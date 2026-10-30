"""Independent B-2a S4 projected-size audit, additive and read-only to sources.

Call run(scene_namespace, output_dir=NEW_DIRECTORY) from the initialized Blender
GUI scene. No Blender operators, rendering, old automatic checks, source edits,
or .blend writes. Evaluated real triangles are projected and depth-rasterized at
pixel centers; area is actual visible semantic-mask pixels / full image pixels,
NOT a projected bounding-box product. PNG masks and JSON go to a new directory.

This geometric-mask check excludes 2D composited labels and depth-of-field blur.
Transparent geometry is conservatively treated as an opaque occluder and noted.
Missing/hidden rods and absent actual kicks are NOT converted into passes.
Counterfactual 30-degree capability is explicitly separate from actual footage.
"""
import json, math, time, hashlib, marshal
from pathlib import Path

import bpy
import numpy as np
from mathutils import Vector

TARGET_ROWS = (9, 10, 11, 19, 20, 21, 25, 28, 43)
LIMITS = {'leg_height_fraction': .20, 'leg_visible_area_fraction': .08,
          'component_width_fraction': .025, 'strong_tip_distance_over_height': .10}
MASK_SIZE = (540, 960)
FAMILIES = ('leg_body', 'nerve', 'brass', 'iron')


def _get(ns, key):
    return ns[key] if isinstance(ns, dict) else getattr(ns, key)


def _camera(scene, dg, width, height):
    camera = scene.camera
    view = np.asarray(camera.matrix_world.inverted(), dtype=np.float64)
    projection = np.asarray(camera.calc_matrix_camera(
        dg, x=width, y=height,
        scale_x=scene.render.pixel_aspect_x,
        scale_y=scene.render.pixel_aspect_y), dtype=np.float64)
    return projection @ view


def _project(points, matrix, width, height):
    p = np.asarray(points, dtype=np.float64)
    if len(p) == 0:
        return np.zeros((0, 3)), np.zeros(0, dtype=bool)
    q = np.c_[p, np.ones(len(p))] @ matrix.T
    good = q[:, 3] > 1e-9
    ndc = np.full((len(p), 3), np.nan)
    ndc[good] = q[good, :3] / q[good, 3, None]
    pixels = np.c_[(ndc[:, 0] + 1) * .5 * width,
                   (1 - ndc[:, 1]) * .5 * height, ndc[:, 2]]
    return pixels, good


def _raster_triangle(ids, depth, isolated, tri, semantic_id):
    """Perspective viewport Z is linearly interpolated in screen barycentrics."""
    height, width = ids.shape
    if not np.isfinite(tri).all():
        return
    if np.max(tri[:, 2]) < -1 or np.min(tri[:, 2]) > 1:
        return
    xmin = max(0, math.floor(float(np.min(tri[:, 0]))))
    xmax = min(width - 1, math.ceil(float(np.max(tri[:, 0]))))
    ymin = max(0, math.floor(float(np.min(tri[:, 1]))))
    ymax = min(height - 1, math.ceil(float(np.max(tri[:, 1]))))
    if xmax < xmin or ymax < ymin:
        return
    a, b, c = tri
    denominator = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1])
    if abs(denominator) < 1e-12:
        return
    x = np.arange(xmin, xmax + 1)[None, :] + .5
    y = np.arange(ymin, ymax + 1)[:, None] + .5
    wa = ((b[1] - c[1]) * (x - c[0]) + (c[0] - b[0]) * (y - c[1])) / denominator
    wb = ((c[1] - a[1]) * (x - c[0]) + (a[0] - c[0]) * (y - c[1])) / denominator
    wc = 1 - wa - wb
    z = wa * a[2] + wb * b[2] + wc * c[2]
    inside = (wa >= -1e-9) & (wb >= -1e-9) & (wc >= -1e-9) & (z >= -1) & (z <= 1)
    if semantic_id in isolated:
        isolated[semantic_id][ymin:ymax + 1, xmin:xmax + 1] |= inside
    destination = depth[ymin:ymax + 1, xmin:xmax + 1]
    visible = inside & (z < destination - 1e-10)
    destination[visible] = z[visible]
    ids[ymin:ymax + 1, xmin:xmax + 1][visible] = semantic_id


def _visible_render_object(ob):
    if ob.hide_render or ob.type not in ('MESH', 'CURVE', 'SURFACE', 'FONT', 'META'):
        return False
    # hide_render on a collection removes the collection's members, not just
    # their viewport visibility. Objects linked into another live collection
    # remain renderable.
    if ob.users_collection and all(c.hide_render for c in ob.users_collection):
        return False
    return True


def _alpha_note(ob):
    notes = []
    for slot in ob.material_slots:
        material = slot.material
        if not material:
            continue
        alpha = float(material.diffuse_color[3])
        if material.use_nodes and material.node_tree:
            for node in material.node_tree.nodes:
                if node.type == 'BSDF_PRINCIPLED' and 'Alpha' in node.inputs:
                    alpha = min(alpha, float(node.inputs['Alpha'].default_value))
        if alpha < .999:
            notes.append({'object': ob.name, 'material': material.name, 'alpha': alpha,
                          'treatment': 'opaque conservative occluder; no transparency-based pass'})
    return notes


def _groups(parts, model):
    if not hasattr(parts, 'measure_groups'):
        raise RuntimeError('New parts API measure_groups(model) is required; no name/bbox fallback.')
    groups = parts.measure_groups(model)
    if 'leg_body' not in groups and 'body' in groups:
        groups = {**groups, 'leg_body': groups['body']}
    result = {}
    for family in FAMILIES:
        if family not in groups:
            raise RuntimeError('measure_groups omitted explicit family ' + family)
        objects = list(groups[family])
        if any(not isinstance(ob, bpy.types.Object) for ob in objects):
            raise TypeError('measure_groups must return explicit Blender Object lists.')
        result[family] = objects
    return result


def _mask(scene, models, parts):
    width, height = MASK_SIZE
    dg = bpy.context.evaluated_depsgraph_get()
    matrix = _camera(scene, dg, width, height)
    ids = np.zeros((height, width), dtype=np.uint8)
    depth = np.full((height, width), np.inf)
    identities, groups, by_object, isolated = {}, {}, {}, {}
    for model_key, model in models.items():
        groups[model_key] = _groups(parts, model)
        for family, objects in groups[model_key].items():
            semantic_id = len(identities) + 1
            identities[semantic_id] = {'model': model_key, 'family': family}
            if family == 'leg_body':
                isolated[semantic_id] = np.zeros((height, width), dtype=bool)
            for ob in objects:
                if ob in by_object:
                    raise RuntimeError('Semantic groups overlap: ' + ob.name)
                by_object[ob] = semantic_id
    notes, skipped, object_records = [], [], []
    for original in scene.objects:
        if not _visible_render_object(original):
            continue
        evaluated = original.evaluated_get(dg)
        mesh = evaluated.to_mesh(preserve_all_data_layers=False, depsgraph=dg)
        if mesh is None:
            continue
        try:
            mesh.calc_loop_triangles()
            coordinates = np.empty(len(mesh.vertices) * 3, dtype=np.float64)
            mesh.vertices.foreach_get('co', coordinates)
            coordinates = coordinates.reshape((-1, 3))
            world = np.c_[coordinates, np.ones(len(coordinates))] @ np.asarray(evaluated.matrix_world).T
            pixels, in_front = _project(world[:, :3], matrix, width, height)
            semantic_id = by_object.get(original, 0)
            triangles = np.empty(len(mesh.loop_triangles) * 3, dtype=np.int32)
            mesh.loop_triangles.foreach_get('vertices', triangles)
            triangles = triangles.reshape((-1, 3))
            valid = in_front[triangles].all(axis=1)
            if not valid.all():
                skipped.append({'object': original.name, 'trianglesCrossingCameraPlane': int((~valid).sum()),
                                'semanticId': semantic_id})
            count = 0
            for vertices in triangles[valid]:
                tri = pixels[vertices]
                if (tri[:, 0].max() < 0 or tri[:, 0].min() > width or
                        tri[:, 1].max() < 0 or tri[:, 1].min() > height):
                    continue
                _raster_triangle(ids, depth, isolated, tri, semantic_id)
                count += 1
            if semantic_id:
                object_records.append({'object': original.name, 'semanticId': semantic_id,
                                       'trianglesWithinViewportBounds': count})
            notes.extend(_alpha_note(original))
        finally:
            evaluated.to_mesh_clear()
    return {'ids': ids, 'isolated': isolated, 'identities': identities, 'matrix': matrix,
            'groups': groups, 'transparentOccluders': notes,
            'cameraPlaneSkippedTriangles': skipped, 'objects': object_records}


def _mask_numbers(mask):
    height, width = mask.shape
    yy, xx = np.nonzero(mask)
    if not len(xx):
        return {'visible': False, 'pixels': 0, 'areaFraction': 0.0,
                'bbox': None, 'widthFraction': 0.0, 'heightFraction': 0.0}
    return {'visible': True, 'pixels': int(len(xx)),
            'areaFraction': float(len(xx) / (width * height)),
            'bbox': {'x0': int(xx.min()), 'y0': int(yy.min()),
                     'x1Exclusive': int(xx.max() + 1), 'y1Exclusive': int(yy.max() + 1)},
            'widthFraction': float((xx.max() - xx.min() + 1) / width),
            'heightFraction': float((yy.max() - yy.min() + 1) / height)}


def _curve_paths(objects):
    paths = []
    for ob in objects:
        if ob.type != 'CURVE' or not _visible_render_object(ob):
            continue
        for spline in ob.data.splines:
            if spline.type == 'BEZIER':
                # Current parts use poly curves. Bezier knot chords would not
                # be the true evaluated tangent, so refuse a silent fallback.
                raise RuntimeError('Bezier centerline requires explicit parts API, not chord approximation.')
            points = [ob.matrix_world @ Vector(p.co[:3]) for p in spline.points]
            if len(points) > 1:
                paths.append((ob.name, points))
    return paths


def _thickness(ids, semantic_id, objects, matrix):
    height, width = ids.shape
    paths = _curve_paths(objects)
    if not paths:
        return {'status': 'not_measurable', 'reason': 'No visible real CURVE centerline',
                'minimumVisibleWidthFraction': None, 'passes': False, 'samples': []}
    samples = []
    for object_name, points in paths:
        pp, valid = _project([tuple(p) for p in points], matrix, width, height)
        for i in range(len(points) - 1):
            if not (valid[i] and valid[i + 1]):
                continue
            tangent = pp[i + 1, :2] - pp[i, :2]
            length = float(np.linalg.norm(tangent))
            if length < 2:
                samples.append({'object': object_name, 'segment': i, 'status': 'projected_axis_too_short'})
                continue
            normal = np.array([-tangent[1], tangent[0]]) / length
            for fraction in (.30, .50, .70):
                # Project the actual 3D centerline position (perspective), not
                # a linear interpolation of projected endpoints.
                world = points[i].lerp(points[i + 1], fraction)
                center, good = _project([tuple(world)], matrix, width, height)
                center = center[0, :2]
                offsets = np.arange(-width * .12, width * .12 + .125, .25)
                positions = center[None, :] + offsets[:, None] * normal[None, :]
                x, y = np.floor(positions[:, 0]).astype(int), np.floor(positions[:, 1]).astype(int)
                inside = (x >= 0) & (x < width) & (y >= 0) & (y < height)
                occupied = np.zeros(len(offsets), dtype=bool)
                occupied[inside] = ids[y[inside], x[inside]] == semantic_id
                middle = int(np.argmin(np.abs(offsets)))
                row = {'object': object_name, 'segment': i, 'fraction': fraction,
                       'centerPixels': [float(v) for v in center]}
                if not occupied[middle]:
                    row.update(status='center_occluded_or_offscreen', visibleWidthPixels=0.0,
                               conservativeVisibleWidthFraction=0.0)
                else:
                    lo = hi = middle
                    while lo > 0 and occupied[lo - 1]: lo -= 1
                    while hi + 1 < len(occupied) and occupied[hi + 1]: hi += 1
                    if lo == 0 or hi == len(occupied) - 1:
                        row.update(status='scan_limit_reached', visibleWidthPixels=None,
                                   conservativeVisibleWidthFraction=None)
                    else:
                        measured = float((hi - lo + 1) * .25)
                        # Pixel-center raster uncertainty must not inflate a
                        # marginal threshold pass. Subtract one full pixel.
                        conservative = max(0.0, measured - 1.0)
                        row.update(status='measured', visibleWidthPixels=measured,
                                   conservativeVisibleWidthFraction=conservative / width)
                samples.append(row)
    measured = [s['conservativeVisibleWidthFraction'] for s in samples
                if s.get('conservativeVisibleWidthFraction') is not None]
    all_measured = bool(samples) and all(s['status'] == 'measured' for s in samples)
    minimum = min(measured) if measured else None
    return {'status': 'measured' if all_measured else 'incomplete_or_occluded',
            'minimumVisibleWidthFraction': minimum,
            'passes': bool(all_measured and minimum >= LIMITS['component_width_fraction']),
            'sampling': 'Each real poly-curve segment at 30/50/70%; perpendicular to projected tangent; conservative minus 1px',
            'samples': samples}


def _save_mask(ids, path):
    palette = np.array([[0, 0, 0, 1], [0, 1, 0, 1], [1, 1, 1, 1],
                        [1, .65, 0, 1], [.05, .6, 1, 1], [.7, 0, 1, 1],
                        [1, .3, .3, 1], [1, 1, 0, 1], [0, 1, 1, 1]], dtype=np.float32)
    if int(ids.max()) >= len(palette):
        raise RuntimeError('Need explicit palette for additional semantic identities')
    height, width = ids.shape
    image = bpy.data.images.new('B2A_S4_measurement_mask_temporary', width=width, height=height, alpha=True)
    try:
        image.colorspace_settings.name = 'Non-Color'
        image.pixels.foreach_set(palette[ids][::-1].reshape(-1))
        image.filepath_raw = str(path); image.file_format = 'PNG'; image.save()
    finally:
        bpy.data.images.remove(image)


def _camera_record(scene):
    c = scene.camera
    return {'matrixWorld': [float(x) for row in c.matrix_world for x in row],
            'lens': float(c.data.lens), 'shiftX': float(c.data.shift_x),
            'shiftY': float(c.data.shift_y), 'type': c.data.type}


def _tip(parts, model):
    if not hasattr(parts, 'foot_tip_world'):
        raise RuntimeError('foot_tip_world(model) required; no bounding-box corner fallback.')
    p = parts.foot_tip_world(model)
    return Vector(p)


def _leg(model):
    return model['parts'].get('leg', model)


def _motion(ns, event, model_key):
    apply, parts, models = _get(ns, 'apply'), _get(ns, 'p'), _get(ns, 'MODELS')
    fps, width, height = 30, *MASK_SIZE
    # Include actual encoded rest frames on BOTH sides of the spoken event.
    # A camera cut in those extra frames is reported, never corrected away.
    first = max(0, math.floor(event['start'] * fps + 1e-8) - 1)
    last = min(_get(ns, 'NF') - 1, math.ceil(event['end'] * fps - 1e-8) + 1)
    records = []
    for frame in range(first, last + 1):
        t = frame / fps; state = apply(t)
        scene = bpy.context.scene; bpy.context.view_layer.update()
        point = _tip(parts, models[model_key])
        matrix = _camera(scene, bpy.context.evaluated_depsgraph_get(), width, height)
        projected, front = _project([tuple(point)], matrix, width, height)
        hinge = _leg(models[model_key])['parts']['knee_hinge']
        records.append({'frame': frame, 'time': t, 'tipPixels': projected[0, :2].tolist(),
                        'worldPoint': list(point), 'inFront': bool(front[0]),
                        'kneeYDegrees': math.degrees(hinge.rotation_euler.y),
                        'camera': _camera_record(scene), 'stateName': state.get('name')})
    points = np.asarray([r['tipPixels'] for r in records])
    # The first encoded frame after a word may already be 1/30 s into a kick.
    # Include recovery-to-rest and measure the full observed point-to-point
    # excursion; do not underestimate 30 degrees by using that partial pose.
    pairwise = np.linalg.norm(points[:, None, :] - points[None, :, :], axis=2)
    actual = float(np.max(pairwise) / height)
    vertical = float(np.ptp(points[:, 1]) / height)
    knee_angles = [r['kneeYDegrees'] for r in records]
    angle_range = max(knee_angles) - min(knee_angles)
    stable = all(r['camera'] == records[0]['camera'] for r in records)
    camera_changes = [r['frame'] for i, r in enumerate(records)
                      if i and r['camera'] != records[i - 1]['camera']]
    strong = event['degrees'] > 5.01
    return {'row': event['row'], 'model': model_key, 'actualEvent': True,
            'intendedAngleDegrees': event['degrees'], 'maxMeasuredKneeChangeDegrees': angle_range,
            'cameraStableThroughout': stable, 'maximumTipDistanceOverHeight': actual,
            'cameraChangeFrames': camera_changes,
            'actualFrameWindowDefinition': 'floor(spokenStart*30)-1 through ceil(actionEnd*30)+1, inclusive; actual cameras left unchanged',
            'maximumTipVerticalChangeOverHeight': vertical,
            'distanceDefinition': 'Maximum pairwise distance among actual encoded-frame tip positions, including return to rest; never camera-motion-adjusted',
            'passesStrongMotion10Percent': bool(strong and stable and actual >= LIMITS['strong_tip_distance_over_height']),
            'weakFiveDegreeException': not strong,
            'literalTenPercentPassEvenForWeak': bool(stable and actual >= LIMITS['strong_tip_distance_over_height']),
            'angleMatchesIntentWithinOneDegree': abs(angle_range - event['degrees']) <= 1.0,
            'records': records}


def _counterfactual(ns, row, t, key):
    """Geometric capacity, never evidence of an actual narrated kick."""
    apply, parts, models = _get(ns, 'apply'), _get(ns, 'p'), _get(ns, 'MODELS')
    apply(t); scene = bpy.context.scene; camera_before = _camera_record(scene)
    model = models[key]; leg = _leg(model)
    parts.frog_kick(leg, 0.0, degrees=30); bpy.context.view_layer.update()
    matrix = _camera(scene, bpy.context.evaluated_depsgraph_get(), *MASK_SIZE)
    a, _ = _project([tuple(_tip(parts, model))], matrix, *MASK_SIZE)
    parts.frog_kick(leg, 1.0, degrees=30); bpy.context.view_layer.update()
    b, _ = _project([tuple(_tip(parts, model))], matrix, *MASK_SIZE)
    distance = float(np.linalg.norm(b[0, :2] - a[0, :2]) / MASK_SIZE[1])
    apply(t)
    return {'row': row, 'model': key, 'time': t, 'actualEvent': False,
            'kind': 'counterfactual_same_camera_30_degree_capacity',
            'tipDistanceOverHeight': distance, 'passesGeometricCapacityOnly': distance >= .10,
            'mustNotCountAsActualMotionPass': True,
            'cameraUnchanged': _camera_record(scene) == camera_before}


def run(ns, output_dir=None, sample_times=None, counterfactual=True):
    started = time.time()
    apply, parts, rows, all_models = (_get(ns, k) for k in ('apply', 'p', 'ROWS', 'MODELS'))
    cache = Path(_get(ns, 'C'))
    output = Path(output_dir) if output_dir else cache / 'qa/projection-mask-independent-20261030'
    if output.exists():
        raise RuntimeError('Preserve previous checks; choose a new output directory: ' + str(output))
    output.mkdir(parents=True); (output / 'masks').mkdir()
    events = [e for e in _get(ns, 'kick_events')() if e['row'] in TARGET_ROWS]
    if sample_times is None:
        samples = []
        for row in TARGET_ROWS:
            r = rows[row]
            samples += [(r['start'] + .5, 'row-start'), ((r['start'] + r['end']) / 2, 'row-middle'),
                        (r['end'] - .5, 'row-end')]
        for event in events:
            samples += [(event['start'], 'kick-start'), (event['peak'], 'kick-peak'),
                        (event['end'], 'kick-end')]
        # Complete-loop macro views are measured explicitly and not mistaken
        # for the main full-foot composition; their classification is recorded.
        word = _get(ns, 'word')
        samples += [(word(row, 'フレアワセル') + .5, 'contact-macro') for row in (10, 11)]
        samples += [(word(19, 'メスガフレテイル') + .4, 'scalpel-macro')]
    else:
        samples = [(float(t), 'caller-selected') for t in sample_times]
    by_frame = {}
    for t, why in samples:
        j = max(0, min(_get(ns, 'NF') - 1, round(t * 30)))
        by_frame.setdefault(j, []).append(why)
    frames = []
    try:
        for j, reasons in sorted(by_frame.items()):
            t = j / 30; state = apply(t); scene = bpy.context.scene
            bpy.context.view_layer.update(); row = int(state['row'])
            if row not in TARGET_ROWS:
                continue
            chosen = {'frog': all_models['frog']}
            if row == 25:
                chosen['frog_same'] = all_models['frog_same']
            m = _mask(scene, chosen, parts)
            image = output / 'masks' / ('frame-' + str(j).zfill(5) + '.png')
            _save_mask(m['ids'], image)
            semantic, body_ids = {}, {}
            for sid, identity in m['identities'].items():
                key, family = identity['model'], identity['family']
                values = _mask_numbers(m['ids'] == sid)
                skipped_target = [x for x in m['cameraPlaneSkippedTriangles'] if x['semanticId'] == sid]
                transparent_target = [x for x in m['transparentOccluders']
                                      if x['object'] in {o.name for o in m['groups'][key][family]}]
                values['geometryMeasurementReliable'] = not skipped_target and not transparent_target
                values['targetCameraPlaneOrAlphaWarnings'] = skipped_target + transparent_target
                values['objectNamesDeclared'] = [o.name for o in m['groups'][key][family]]
                values['visibleObjectNames'] = [o.name for o in m['groups'][key][family] if _visible_render_object(o)]
                if family == 'leg_body':
                    body_ids[key] = sid
                    values['isolatedSilhouetteIgnoringOtherOccluders'] = _mask_numbers(m['isolated'][sid])
                    values['heightPass'] = values['heightFraction'] >= LIMITS['leg_height_fraction']
                    values['visibleAreaPass'] = values['areaFraction'] >= LIMITS['leg_visible_area_fraction']
                else:
                    values['thickness'] = _thickness(m['ids'], sid, m['groups'][key][family], m['matrix'])
                semantic.setdefault(key, {})[family] = values
            frames.append({'frame': j, 'time': t, 'row': row, 'reasons': reasons,
                           'view': state.get('name'), 'camera': _camera_record(scene),
                           'mask': str(image), 'maskMeaning': m['identities'],
                           'models': semantic, 'transparentOccluders': m['transparentOccluders'],
                           'cameraPlaneSkippedTriangles': m['cameraPlaneSkippedTriangles'],
                           'source': 'Actual evaluated mesh pixels with solid scene-depth occlusion, not bbox area'})
        motions = [_motion(ns, e, 'frog_same' if e['row'] == 25 and e['degrees'] <= 5.01 else 'frog') for e in events]
        hypotheticals = []
        if counterfactual:
            for row in TARGET_ROWS:
                at = rows[row]['start'] + (1.3 if row == 43 else .5)
                for key in (('frog', 'frog_same') if row == 25 else ('frog',)):
                    hypotheticals.append(_counterfactual(ns, row, at, key))
        summaries = []
        for row in TARGET_ROWS:
            actual = [f for f in frames if f['row'] == row]
            for key in (('frog', 'frog_same') if row == 25 else ('frog',)):
                values = [f['models'][key] for f in actual if key in f['models']]
                row_motion = [q for q in motions if q['row'] == row and q['model'] == key]
                height = min((q['leg_body']['heightFraction'] for q in values), default=None)
                area = min((q['leg_body']['areaFraction'] for q in values), default=None)
                thickness = {}
                for family in ('nerve', 'brass', 'iron'):
                    tt = [q[family]['thickness'] for q in values]
                    vv = [x['minimumVisibleWidthFraction'] for x in tt if x['minimumVisibleWidthFraction'] is not None]
                    thickness[family] = {'minimum': min(vv) if vv else None,
                                         'allActualSamplesMeasuredAndPass': bool(tt and all(x['passes'] for x in tt)),
                                         'unmeasurableOrOccludedSamples': sum(x['status'] != 'measured' for x in tt)}
                motion_status = ('not_demonstrated_no_actual_kick_in_row' if not row_motion else
                                 'weak_5_degrees_not_a_strong_10_percent_pass' if all(q['weakFiveDegreeException'] for q in row_motion) else
                                 'pass' if all(q['passesStrongMotion10Percent'] for q in row_motion) else 'fail_or_camera_change')
                unreliable = sum(not all(family['geometryMeasurementReliable'] for family in q.values()) for q in values)
                four = bool(height is not None and height >= .20 and area >= .08 and not unreliable and
                            all(q['allActualSamplesMeasuredAndPass'] for q in thickness.values()) and motion_status == 'pass')
                summaries.append({'row': row, 'model': key, 'actualFramesMeasured': len(values),
                                  'minimumActualVisibleHeightFraction': height, 'minimumActualVisibleAreaFraction': area,
                                  'unreliableActualGeometrySamples': unreliable,
                                  'componentWidths': thickness, 'actualMotionStatus': motion_status,
                                  'allFourActualConditionsDemonstrated': four,
                                  'note': 'All sampled actual views included. Entry/exit/cloth/macro or absent rods are not silently excluded. Static-row hypothetical capacity is separate.'})
        report = {'kind': 'B-2a independent S4 projection-mask preflight', 'version': 1,
                  'sourceProvenance': {
                      'checkerFile': str(Path(__file__).resolve()),
                      'checkerSourceSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                      'loadedMotionCodeSha256': hashlib.sha256(marshal.dumps(_motion.__code__)).hexdigest(),
                      'partsFile': str(Path(parts.__file__).resolve()),
                      'partsSourceSha256': hashlib.sha256(Path(parts.__file__).read_bytes()).hexdigest(),
                      'note': 'Function bytecode hash identifies the loaded motion implementation, including after GUI module reload. Parts hash records on-disk source at audit time; instantiate models after reloading parts.'},
                  'thresholdsUnchanged': LIMITS, 'maskResolution': list(MASK_SIZE),
                  'method': 'Evaluated real mesh triangle rasterization at pixel centers with perspective camera Z-buffer; visible semantic pixels/full frame. No bbox-area proxy.',
                  'thicknessMethod': 'Curve-centerline perpendicular visible-mask scans, each segment 30/50/70%, minimum conservative width minus1px.',
                  'footTipMethod': 'Parts explicit actual deformed middle-toe mesh endpoint via foot_tip_world, sampled at every encoded frame during each actual kick.',
                  'limitations': ['Opaque geometric silhouette; no 2D overlays, depth-of-field blur or antialias expansion.',
                                  'Transparent geometry conservatively occludes; its names/material alpha are recorded.',
                                  'Triangles crossing camera plane are skipped and recorded; do not accept any target crossing-camera sample as reliable.',
                                  'Static rows, hidden rods and weak5-degree kicks cannot demonstrate all four literal actual conditions. Hypothetical capacity never changes that status.',
                                  'Measurements supplement, do not replace or modify, existing quality gate 7b/7c/7d.'],
                  'rows': summaries, 'actualFrames': frames, 'actualKicks': motions,
                  'counterfactualCapacityOnly': hypotheticals,
                  'allRowsAllFourActualConditionsDemonstrated': bool(summaries and all(r['allFourActualConditionsDemonstrated'] for r in summaries)),
                  's4MayProceedUnderLiteralFourConditions': bool(summaries and all(r['allFourActualConditionsDemonstrated'] for r in summaries)),
                  'audioOrSubtitlesChanged': False, 'sourceFilesChanged': False,
                  'existingAutomaticChecksModified': False, 'elapsedSeconds': time.time() - started}
        destination = output / 'projection-measurements.json'
        destination.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf8')
        return report
    finally:
        # Restore a deterministic actual scene state, not the last hypothetical.
        if by_frame:
            apply(min(by_frame) / 30)


def selftest_rasterizer():
    """No GUI/render needed: triangle coverage proves no bbox-area substitution."""
    ids = np.zeros((100, 100), dtype=np.uint8); z = np.full((100, 100), np.inf)
    isolated = {1: np.zeros((100, 100), dtype=bool)}
    _raster_triangle(ids, z, isolated, np.array([[10, 10, .1], [90, 10, .1], [10, 90, .1]]), 1)
    actual = int((ids == 1).sum()); bbox_product = 80 * 80
    assert 3100 < actual < 3300 and actual < bbox_product * .55
    _raster_triangle(ids, z, isolated, np.array([[0, 0, 0], [100, 0, 0], [0, 100, 0]]), 0)
    assert not np.any(ids == 1) and int(isolated[1].sum()) == actual
    return {'trianglePixels': actual, 'bboxProductNotUsed': bbox_product,
            'frontBlackOccluderRemovesVisiblePixels': True, 'pass': True}
