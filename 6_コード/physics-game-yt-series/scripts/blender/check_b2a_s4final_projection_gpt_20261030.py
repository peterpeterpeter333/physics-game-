"""Independent B-2a S4 final projected-size audit, additive, sources read-only.

Call run(scene_namespace, output_dir=NEW_DIRECTORY) from the initialized Blender
GUI scene. No Blender operators, rendering, old automatic checks, source edits,
or .blend writes. Evaluated real triangles are projected and depth-rasterized at
pixel centers; area is actual visible semantic-mask pixels / full image pixels,
NOT a projected bounding-box product. PNG masks and JSON go to a new directory.

This geometric-mask check excludes 2D composited labels and depth-of-field blur.
Transparent geometry is conservatively treated as an opaque occluder and noted.
Missing/hidden rods and absent actual kicks are NOT converted into passes.
Applicability and revised targets are ONLY Claude's 2026-10-30 supplemental
targets, NOT alterations to shared/original automated checks. No counterfactual
poses are made or accepted. This samples critical actual times, not every frame.
"""
import json, math, time, hashlib, marshal
from pathlib import Path

import bpy
import numpy as np
from mathutils import Vector

TARGET_ROWS = (9, 10, 11, 19, 20, 21, 25, 28, 43)
LIMITS = {'leg_height_fraction': .20, 'leg_area_no_hand': .075,
          'leg_area_with_hand': .070, 'leg_area_each_row25': .050,
          'component_width_fraction': .025, 'strong_tip_distance_over_height': .10,
          'essential_visible_length_fraction': .80}
MASK_SIZE = (540, 960)
FAMILIES = ('leg_body', 'nerve', 'brass', 'iron')
HAND_ID = 250


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


def _mask(scene, models, parts, hand_objects=()):
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
            isolated[semantic_id] = np.zeros((height, width), dtype=bool)
            for ob in objects:
                if ob in by_object:
                    raise RuntimeError('Semantic groups overlap: ' + ob.name)
                by_object[ob] = semantic_id
        # New outer handles are real metal belonging to the same branch.
        # They are NOT extra main-rod centerlines or proxies for rod thickness,
        # but must not turn a same-material metal junction into background ID0.
        handles = list(model['parts'].get('handles', []))
        if handles and len(handles) != 2:
            raise RuntimeError('Explicit brass/iron handle ordering must contain exactly two Objects.')
        for index, handle in enumerate(handles):
            family = ('brass', 'iron')[index]
            sid = next(k for k, v in identities.items() if v['model'] == model_key and v['family'] == family)
            if handle in by_object and by_object[handle] != sid:
                raise RuntimeError('Handle assigned to a conflicting physical branch.')
            by_object[handle] = sid
    for ob in hand_objects:
        if ob in by_object:
            raise RuntimeError('A hand must not belong to foot measurement groups.')
        by_object[ob] = HAND_ID
    notes, skipped, object_records = [], [], []
    without_hands = None
    # Draw every non-hand first, save its real depth result, then let hands
    # occlude it. This distinguishes a hand from normal rod-on-leg overlap.
    render_order = sorted(scene.objects, key=lambda ob: by_object.get(ob) == HAND_ID)
    for original in render_order:
        if not _visible_render_object(original):
            continue
        if by_object.get(original) == HAND_ID and without_hands is None:
            without_hands = ids.copy()
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
            'idsWithoutHands': ids.copy() if without_hands is None else without_hands,
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


def _thickness(ids, semantic_id, objects, matrix, allowed_hand_mask=None):
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
                # Scan the complete viewport chord, not an arbitrary 12%-width
                # window. Near a bend, the same physical metal can legitimately
                # continue along the transverse ray beyond that short window.
                # Its actual visible boundary must be measured, not declared
                # thin/occluded merely because the diagnostic ray was too short.
                scan_radius = math.hypot(width, height) + 1.0
                offsets = np.arange(-scan_radius, scan_radius + .125, .25)
                positions = center[None, :] + offsets[:, None] * normal[None, :]
                x, y = np.floor(positions[:, 0]).astype(int), np.floor(positions[:, 1]).astype(int)
                inside = (x >= 0) & (x < width) & (y >= 0) & (y < height)
                occupied = np.zeros(len(offsets), dtype=bool)
                occupied[inside] = ids[y[inside], x[inside]] == semantic_id
                middle = int(np.argmin(np.abs(offsets)))
                row = {'object': object_name, 'segment': i, 'fraction': fraction,
                       'centerPixels': [float(v) for v in center]}
                cx, cy = int(math.floor(center[0])), int(math.floor(center[1]))
                contact_or_handle_junction = (
                    allowed_hand_mask is not None and 0 <= cx < width and 0 <= cy < height
                    and allowed_hand_mask[cy, cx])
                if contact_or_handle_junction:
                    row.update(status='exempt_contact_or_handle_geometry', visibleWidthPixels=None,
                               conservativeVisibleWidthFraction=None)
                    samples.append(row)
                    continue
                if not occupied[middle]:
                    cx, cy = int(math.floor(center[0])), int(math.floor(center[1]))
                    allowed = (allowed_hand_mask is not None and 0 <= cx < width and 0 <= cy < height
                               and allowed_hand_mask[cy, cx] and ids[cy, cx] == HAND_ID)
                    row.update(status='exempt_allowed_contact_or_handle' if allowed else 'center_occluded_or_offscreen',
                               visibleWidthPixels=None if allowed else 0.0,
                               conservativeVisibleWidthFraction=None if allowed else 0.0)
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
    applicable = [s for s in samples if s['status'] not in
                  ('exempt_allowed_contact_or_handle', 'exempt_contact_or_handle_geometry')]
    all_measured = bool(applicable) and all(s['status'] == 'measured' for s in applicable)
    minimum = min(measured) if measured else None
    return {'status': 'measured' if all_measured else 'incomplete_or_occluded',
            'minimumVisibleWidthFraction': minimum,
            'passes': bool(all_measured and minimum >= LIMITS['component_width_fraction']),
            'allowedContactOrHandleSamplesExempted': len(samples) - len(applicable),
            'exemptionDefinition': 'Only centers inside actual V-tip/outer-handle mesh silhouettes; measure main rod core, not junction overlap, regardless of whether a hand is present',
            'sampling': 'Each real poly-curve segment at 30/50/70%; perpendicular to projected tangent across complete viewport chord; conservative minus 1px',
            'samples': samples}


def _save_mask(ids, path):
    palette = np.array([[0, 0, 0, 1], [0, 1, 0, 1], [1, 1, 1, 1],
                        [1, .65, 0, 1], [.05, .6, 1, 1], [.7, 0, 1, 1],
                        [1, .3, .3, 1], [1, 1, 0, 1], [0, 1, 1, 1]], dtype=np.float32)
    expanded = np.zeros((256, 4), dtype=np.float32); expanded[:, 3] = 1
    expanded[:len(palette)] = palette; expanded[HAND_ID] = (1, .05, .05, 1)
    palette = expanded
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


def _silhouette(scene, objects, matrix):
    """True union of the explicitly allowed contact/handle mesh silhouettes."""
    width, height = MASK_SIZE; dg = bpy.context.evaluated_depsgraph_get()
    ids = np.zeros((height, width), dtype=np.uint8); depth = np.full((height, width), np.inf)
    union = {1: np.zeros((height, width), dtype=bool)}
    for original in objects:
        if not _visible_render_object(original):
            continue
        evaluated = original.evaluated_get(dg); mesh = evaluated.to_mesh(preserve_all_data_layers=False, depsgraph=dg)
        if mesh is None:
            continue
        try:
            mesh.calc_loop_triangles(); xyz = np.empty(len(mesh.vertices)*3)
            mesh.vertices.foreach_get('co', xyz); xyz = xyz.reshape((-1, 3))
            world = np.c_[xyz, np.ones(len(xyz))] @ np.asarray(evaluated.matrix_world).T
            pixels, front = _project(world[:, :3], matrix, width, height)
            tt = np.empty(len(mesh.loop_triangles)*3, dtype=np.int32)
            mesh.loop_triangles.foreach_get('vertices', tt)
            for tri in tt.reshape((-1, 3)):
                if front[tri].all():
                    _raster_triangle(ids, depth, union, pixels[tri], 1)
        finally:
            evaluated.to_mesh_clear()
    return union[1]


def _hand_objects(ns):
    result = []
    for root in _get(ns, 'd').HANDS.values():
        result += [o for o in root.children_recursive if _visible_render_object(o)]
    return result


def _path_visibility(paths, mask, sid, allowed, hand_mask=None, without_hands=None):
    """Projected arclength, not count of knots or endpoint distance."""
    width, height = MASK_SIZE; visible = eligible = exempt = offscreen = hand_hidden = 0.0
    points = 0
    for _, pp in paths:
        for a, b in zip(pp, pp[1:]):
            length = float(np.linalg.norm(b[:2] - a[:2]))
            if not math.isfinite(length) or length < 1e-8:
                continue
            n = max(1, math.ceil(length / .5)); weight = length / n
            xy = a[:2] + (b[:2]-a[:2])[None, :] * ((np.arange(n)+.5)/n)[:, None]
            for x, y in xy:
                points += 1; xx, yy = math.floor(x), math.floor(y)
                inside = 0 <= xx < width and 0 <= yy < height
                if inside and allowed[yy, xx]:
                    exempt += weight; continue
                eligible += weight
                if inside and mask[yy, xx] == sid:
                    visible += weight
                if (inside and hand_mask is not None and without_hands is not None
                        and hand_mask[yy, xx] and without_hands[yy, xx] == sid):
                    hand_hidden += weight
                if not inside:
                    offscreen += weight
    preserved = (1-hand_hidden/eligible) if eligible > 0 else None
    direct = visible/eligible if eligible > 0 else None
    quantity = preserved if hand_mask is not None else direct
    return {'essentialProjectedLengthPixels': eligible, 'visibleEssentialLengthPixels': visible,
            'allowedContactHandleLengthExcludedPixels': exempt, 'offscreenEssentialLengthPixels': offscreen,
            'visibleEssentialLengthFraction': direct,
            'handHiddenEssentialLengthPixels': hand_hidden,
            'handPreservedEssentialLengthFraction': preserved if hand_mask is not None else None,
            'criterionQuantity': 'handPreservedEssentialLengthFraction' if hand_mask is not None else 'visibleEssentialLengthFraction',
            'sampledCenterlinePoints': points,
            'passes80Percent': bool(eligible > 0 and quantity >= .80)}


def _projected_paths(parts, model, family, objects, matrix):
    if family == 'leg_body':
        if not hasattr(parts, 'body_centerline_world'):
            raise RuntimeError('body_centerline_world is required; do not substitute area for foot length.')
        paths = [('actual-body-hip-knee-ankle-toe', list(parts.body_centerline_world(model)))]
    else:
        paths = _curve_paths(objects)
    projected = []
    for name, pts in paths:
        pp, front = _project([tuple(p) for p in pts], matrix, *MASK_SIZE)
        if not front.all():
            return [], 'centerline_crosses_camera_plane'
        projected.append((name, pp))
    return projected, 'measured' if projected else 'not_displayed_or_no_centerline'


def _applicability(ns, state, time_value, model_key):
    row = state['row']; rows = _get(ns, 'ROWS'); reason = None
    if row == 43 and time_value < rows[43]['start'] + 1.0:
        reason = 'Claude exemption: cloth-covered/removal interval, first1.0s'
    if row == 28:
        exit_info = state.get('eligibility', {}).get('frogExit')
        if exit_info is None:
            raise RuntimeError('Row28 requires explicit eligibility.frogExit start/end; no visual cherry-picking.')
        expected = _get(ns, 'word')(28, 'カエルオトリノゾケバ')
        if abs(exit_info['start'] - expected) > 1/30 or abs(exit_info['end'] - (rows[28]['end']-.4)) > 1/30:
            raise RuntimeError('Row28 transition metadata differs from frozen spoken event/authored exit end.')
        if time_value >= exit_info['start']:
            reason = ('Nonordinary authored removal transition; measured but not counted as PASS'
                      if time_value < exit_info['end'] else 'Claude exemption: frog already removed')
    return {'ordinaryFootView': reason is None, 'numbers123Apply': reason is None,
            'exemptionReason': reason,
            'requiredWidthFamilies': ['nerve'] if row == 19 else ['nerve', 'brass', 'iron'],
            'motionRequired': row not in (9, 21, 28) and not (row == 25 and model_key == 'frog_same'),
            'motionExemptionReason': ('No narrated kick in this row' if row in (9, 21, 28) else
                                      'Upper foot intentionally weak5degrees' if row == 25 and model_key == 'frog_same' else None)}


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


def run(ns, output_dir=None, sample_times=None, counterfactual=False):
    """Measure the revised, explicitly applicable supplemental criteria."""
    if counterfactual:
        raise RuntimeError('Counterfactual poses prohibited in this final supplemental check.')
    started = time.time()
    apply, parts, rows, models = (_get(ns, k) for k in ('apply', 'p', 'ROWS', 'MODELS'))
    cache = Path(_get(ns, 'C'))
    output = Path(output_dir) if output_dir else cache / 'qa/projection-final-independent-20261030'
    if output.exists():
        raise RuntimeError('Preserve earlier checks: choose a new directory.')
    if not hasattr(parts, 'hand_occlusion_allowed_objects'):
        raise RuntimeError('Explicit contact/handle Object API is required.')
    output.mkdir(parents=True); (output / 'masks').mkdir()
    instruction = Path(_get(ns, 'W')) / 'outputs/ys-chain-b2a-backup/S4_20261030/B-2前編_S4前_Claudeの直しの指示_20261030.md'
    events = [e for e in _get(ns, 'kick_events')() if e['row'] in TARGET_ROWS]
    word = _get(ns, 'word')
    if sample_times is None:
        samples = []
        for row in TARGET_ROWS:
            r = rows[row]
            samples += [(r['start']+.5, 'row-start'), ((r['start']+r['end'])/2, 'row-middle'),
                        (r['end']-.5, 'row-end')]
        for event in events:
            samples += [(event['start']-1/30, 'kick-rest-before'), (event['start'], 'kick-start'),
                        (event['peak'], 'kick-peak'), (event['end']+1/30, 'kick-rest-after')]
        # Exact frozen hand/contact phrases, including the two previously
        # obscured intervals. These are actual samples, not best-looking poses.
        for at in (word(10, 'シンチュウ'), word(10, 'テツノボー'),
                   word(10, 'フレアワセル'), word(11, 'フレアワセル')):
            samples += [(at+off, 'critical-hand/contact') for off in (-.10,.10,.35,.65,1.0)]
        ending = _get(ns, 'DATA')['duration']-1.15
        samples += [(ending+off, 'final-handle-hand') for off in (-.45,-.25,0,.15,.55)]
        samples += [(rows[43]['start']+1.05, 'after-cloth-exemption'),
                    (word(19, 'メスガフレテイル')+.4, 'actual-scalpel-contact')]
    else:
        samples = [(float(t), 'caller-selected') for t in sample_times]
    by_frame = {}
    for t, why in samples:
        j = max(0, min(_get(ns, 'NF')-1, round(t*30)))
        by_frame.setdefault(j, []).append(why)
    frames = []
    try:
        for j, reasons in sorted(by_frame.items()):
            t = j/30; state = apply(t); scene = bpy.context.scene
            bpy.context.view_layer.update(); row = int(state['row'])
            if row not in TARGET_ROWS:
                continue
            chosen = {'frog': models['frog']}
            if row == 25:
                chosen['frog_same'] = models['frog_same']
            masks = _mask(scene, chosen, parts, _hand_objects(ns))
            hand_present = bool(np.any(masks['ids'] == HAND_ID))
            mask_file = output / 'masks' / ('frame-'+str(j).zfill(5)+'.png')
            _save_mask(masks['ids'], mask_file)
            semantic = {}
            allowed = {}
            for key, model in chosen.items():
                objects = list(parts.hand_occlusion_allowed_objects(model))
                allowed[key] = _silhouette(scene, objects, masks['matrix'])
                semantic[key] = {'applicability': _applicability(ns, state, t, key),
                                 'allowedHandOcclusionObjects': [o.name for o in objects],
                                 'groups': {}}
            for sid, identity in masks['identities'].items():
                key, family = identity['model'], identity['family']
                objects = masks['groups'][key][family]
                values = _mask_numbers(masks['ids'] == sid)
                values['objectNamesDeclared'] = [o.name for o in objects]
                values['visibleObjectNames'] = [o.name for o in objects if _visible_render_object(o)]
                projected, status = _projected_paths(parts, chosen[key], family, objects, masks['matrix'])
                visibility = _path_visibility(projected, masks['ids'], sid, allowed[key],
                                              masks['ids'] == HAND_ID, masks['idsWithoutHands'])
                baseline_visibility = _path_visibility(projected, masks['idsWithoutHands'], sid, allowed[key])
                visibility['centerlineStatus'] = status
                visibility['withoutHandsVisibleLengthFraction'] = baseline_visibility['visibleEssentialLengthFraction']
                visibility['nonHandGeometricVisibilityIsInformationalOnly'] = True
                values['essentialVisibility'] = visibility
                hand_over = (masks['ids'] == HAND_ID) & masks['isolated'][sid]
                forbidden = hand_over & ~allowed[key]
                values['handOcclusion'] = {
                    'overlapPixels': int(hand_over.sum()),
                    'forbiddenOutsideExplicitContactHandlePixels': int(forbidden.sum()),
                    'passesAllowedRegionsOnly': not np.any(forbidden),
                    'allowedSilhouetteIsActualMeshUnionNotBBox': True}
                warnings = [x for x in masks['cameraPlaneSkippedTriangles'] if x['semanticId'] == sid]
                values['geometryMeasurementReliable'] = not warnings
                values['cameraPlaneWarnings'] = warnings
                applicability = semantic[key]['applicability']
                if family == 'leg_body':
                    isolated = _mask_numbers(masks['isolated'][sid])
                    values['isolatedSilhouetteIgnoringOccluders'] = isolated
                    values['visibleAreaRatioOfIsolatedSilhouetteInformationalOnly'] = (
                        values['pixels']/isolated['pixels'] if isolated['pixels'] else None)
                    area_limit = (.05 if row == 25 else .07 if hand_present else .075)
                    values['criteria'] = {
                        'height': {'applies': applicability['numbers123Apply'], 'threshold': .20,
                                   'measured': values['heightFraction'], 'pass': values['heightFraction'] >= .20,
                                   'reasonIfNotApplicable': applicability['exemptionReason']},
                        'area': {'applies': applicability['numbers123Apply'], 'threshold': area_limit,
                                 'measured': values['areaFraction'], 'pass': values['areaFraction'] >= area_limit,
                                 'thresholdReason': 'each-row25' if row == 25 else 'hand-on-screen' if hand_present else 'no-hand-on-screen',
                                 'reasonIfNotApplicable': applicability['exemptionReason']}}
                else:
                    thickness = _thickness(masks['ids'], sid, objects, masks['matrix'], allowed[key])
                    expected = family in applicability['requiredWidthFamilies']
                    displayed = any(ob.type == 'CURVE' and _visible_render_object(ob) for ob in objects)
                    thickness['applies'] = applicability['numbers123Apply'] and expected and displayed
                    thickness['reasonIfNotApplicable'] = (
                        applicability['exemptionReason'] if not applicability['numbers123Apply'] else
                        'Row19 intentionally has no brass/iron rods: nerve only' if not expected else
                        'Component centerline not displayed; not counted as a pass' if not displayed else None)
                    thickness['unexpectedMissingExpectedObject'] = bool(applicability['numbers123Apply'] and expected and not displayed)
                    values['thickness'] = thickness
                semantic[key]['groups'][family] = values
            for key, item in semantic.items():
                app, gg = item['applicability'], item['groups']
                if row == 25:
                    ids = [sid for sid, identity in masks['identities'].items() if identity['model'] == key]
                    union = np.isin(masks['ids'], ids)
                    bundle = _mask_numbers(union)
                    slot = (.13, .41) if key == 'frog_same' else (.43, .71)
                    box = bundle['bbox']; body_width = gg['leg_body']['widthFraction']
                    within = bool(box and box['y0']/960 >= slot[0] and box['y1Exclusive']/960 <= slot[1])
                    item['row25Layout'] = {'slot': slot, 'wholeExplanatoryBundle': bundle,
                                          'withinOwnVerticalSlot': within,
                                          'bodyWidthFraction': body_width,
                                          'bodyWidth60to70PercentPass': .60 <= body_width <= .70,
                                          'twoDLabelVisibilityNotCertifiedByThisMask': True}
                    other = 'frog_same' if key == 'frog' else 'frog'
                    own_sids = [sid for sid, identity in masks['identities'].items() if identity['model'] == key]
                    other_sids = [sid for sid, identity in masks['identities'].items() if identity['model'] == other]
                    own_silhouette = np.logical_or.reduce([masks['isolated'][sid] for sid in own_sids])
                    other_silhouette = np.logical_or.reduce([masks['isolated'][sid] for sid in other_sids])
                    overlap = int(np.count_nonzero(own_silhouette & other_silhouette))
                    item['row25Layout']['projectedBundleOverlapPixels'] = overlap
                    item['row25Layout']['noFootBundleOverlapPass'] = overlap == 0
                applicable = app['numbers123Apply']
                body = gg['leg_body']
                width_families = app['requiredWidthFamilies']
                failures = []
                if applicable:
                    for number in ('height', 'area'):
                        if not body['criteria'][number]['pass']:
                            failures.append(number)
                    for family in width_families:
                        if not gg[family]['thickness']['applies'] or not gg[family]['thickness']['passes']:
                            failures.append('width:'+family)
                    for family in ('leg_body', *width_families):
                        v = gg[family]
                        if not v['essentialVisibility']['passes80Percent']:
                            failures.append('visible-essential-length80:'+family)
                        if not v['handOcclusion']['passesAllowedRegionsOnly']:
                            failures.append('forbidden-hand-occlusion:'+family)
                        if not v['geometryMeasurementReliable']:
                            failures.append('geometry-unreliable:'+family)
                    if row == 25:
                        if not item['row25Layout']['withinOwnVerticalSlot']:
                            failures.append('row25-vertical-slot')
                        if not item['row25Layout']['bodyWidth60to70PercentPass']:
                            failures.append('row25-width60to70')
                        if not item['row25Layout']['noFootBundleOverlapPass']:
                            failures.append('row25-overlapping-foot-bundles')
                item['sampledApplicablePass'] = None if not applicable else not failures
                item['failures'] = failures
            frames.append({'frame': j, 'time': t, 'row': row, 'reasons': reasons,
                           'view': state.get('name'), 'camera': _camera_record(scene),
                           'handOnScreen': hand_present, 'mask': str(mask_file),
                           'maskMeaning': masks['identities'], 'handMaskId': HAND_ID,
                           'models': semantic, 'transparentOccluders': masks['transparentOccluders'],
                           'cameraPlaneSkippedTriangles': masks['cameraPlaneSkippedTriangles']})
        motions = [_motion(ns, e, 'frog_same' if e['row'] == 25 and e['degrees'] <= 5.01 else 'frog') for e in events]
        for motion in motions:
            motion['criterion4Applies'] = not motion['weakFiveDegreeException']
            motion['criterion4ExemptionReason'] = 'Upper row25 foot intentionally weak5degrees' if motion['weakFiveDegreeException'] else None
        summaries = []
        for row in TARGET_ROWS:
            for key in (('frog', 'frog_same') if row == 25 else ('frog',)):
                values = [(f, f['models'][key]) for f in frames if f['row'] == row and key in f['models']]
                active = [(f, x) for f, x in values if x['applicability']['numbers123Apply']]
                kicks = [m for m in motions if m['row'] == row and m['model'] == key]
                strong = [m for m in kicks if m['criterion4Applies']]
                motion_applies = row not in (9,21,28) and not (row == 25 and key == 'frog_same')
                summary = {'row': row, 'model': key, 'actualFramesMeasured': len(values),
                           'applicableOrdinaryFrames': len(active),
                           'exemptFrames': [{'frame': f['frame'], 'reason': x['applicability']['exemptionReason']} for f,x in values if not x['applicability']['numbers123Apply']],
                           'minimumApplicableHeightFraction': min((x['groups']['leg_body']['heightFraction'] for f,x in active), default=None),
                           'minimumApplicableAreaFraction': min((x['groups']['leg_body']['areaFraction'] for f,x in active), default=None),
                           'frameFailures': [{'frame': f['frame'], 'time': f['time'], 'failures': x['failures']} for f,x in active if x['failures']],
                           'criterion4Applies': motion_applies,
                           'criterion4ReasonIfNotApplicable': 'No actual strong kick in row / intentionally weak upper row25' if not motion_applies else None,
                           'criterion4Pass': None if not motion_applies else bool(strong and all(m['passesStrongMotion10Percent'] for m in strong)),
                           'actualKickAnglesMatchIntended5or30Degrees': all(m['angleMatchesIntentWithinOneDegree'] for m in kicks),
                           'noCounterfactualMeasurement': True}
                summary['allSampledApplicableCriteriaSatisfied'] = bool(active and not summary['frameFailures'] and (not motion_applies or summary['criterion4Pass']) and summary['actualKickAnglesMatchIntended5or30Degrees'])
                summaries.append(summary)
        report = {'kind': 'B-2a S4final independent supplemental projection and applicability check',
                  'version': 2, 'thresholdsFromNewClaudeInstruction': LIMITS,
                  'instruction': str(instruction),
                  'instructionSha256': hashlib.sha256(instruction.read_bytes()).hexdigest(),
                  'maskResolution': list(MASK_SIZE),
                  'sourceProvenance': {'checkerFile': str(Path(__file__).resolve()),
                      'checkerSourceSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                      'loadedMotionCodeSha256': hashlib.sha256(marshal.dumps(_motion.__code__)).hexdigest(),
                      'partsFile': str(Path(parts.__file__).resolve()),
                      'partsSourceSha256': hashlib.sha256(Path(parts.__file__).read_bytes()).hexdigest()},
                  'method': 'Actual evaluated triangle Z masks; visible semantic pixel area, never bbox product. Projected centerline arclength at <=.5px samples.',
                  'limitations': ['2D labels, depth-of-field blur and antialias expansion excluded.',
                      'Transparency conservatively treated as opaque; listed per frame.',
                      'Critical actual-frame sampling is not an every-encoded-frame proof of always-visible.',
                      'No hypothetical poses; no exemption silently counted as a PASS.',
                      'Supplemental targets only: shared quality gate/thresholds are unchanged.'],
                  'rows': summaries, 'actualFrames': frames, 'actualKicks': motions,
                  'allSampledApplicableCriteriaSatisfied': bool(summaries and all(x['allSampledApplicableCriteriaSatisfied'] for x in summaries)),
                  'allEncodedFramesVisibilityCertified': False,
                  'originalAutomaticChecksChanged': False, 'audioSubtitlesOrOriginalSourcesChanged': False,
                  'elapsedSeconds': time.time()-started}
        (output/'projection-measurements.json').write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf8')
        return report
    finally:
        if by_frame:
            apply(min(by_frame)/30)


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

