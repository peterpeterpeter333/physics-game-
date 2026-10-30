"""Optional all-real-vertex projector; importing this file installs nothing.

No old checker/source is changed or monkeypatched. The same evaluated local
vertices and projection formula are used. Only the four GLOBAL extremal real
vertices are confirmed with Blender's world_to_camera_view; per-mesh bounds
remain clip-formula diagnostics. Global bounds are not clipped or relaxed.

Run from the parent's idle Blender GUI only, after reading this file:
    import desk_d1ab_projector_fast_gpt_20261026 as fp
    report = fp.validate(ns, output_path=".../projector-fast-validation_01.json")

validate() applies nine real scene times, compares old/new outputs at 1e-6,
records warmed timing and raises if ANY comparison fails. It does not render,
fit/change a camera, install this projector or save/change Blender geometry.
The parent must separately decide whether an explicitly approved integration
is worthwhile. A passing timing report is not an occlusion/readability pass.
"""
import json
import math
from pathlib import Path
import statistics
import time

import desk_d1ab_shotqa_gpt_20261026 as original


DEFAULT_TIMES = (.8, 36.8, 90.9, 137.0, 245.2, 265.6, 350.4, 401.5, 470.4)


def _project(ns, meshes, mesh_cache):
    """Drop-in result schema; at most four regulatory projection confirmations."""
    import bpy
    import numpy as np
    from bpy_extras.object_utils import world_to_camera_view
    from mathutils import Vector

    scene, camera = ns['d'].SC, ns['d'].CAM
    dg = bpy.context.evaluated_depsgraph_get()
    render = scene.render
    width, height = render.resolution_x, render.resolution_y
    camera_eval = camera.evaluated_get(dg)
    projection = camera_eval.calc_matrix_camera(dg, x=width, y=height,
                                                scale_x=render.pixel_aspect_x,
                                                scale_y=render.pixel_aspect_y)
    proj = np.asarray(projection, dtype=np.float64)
    view = np.asarray(camera_eval.matrix_world.normalized().inverted(), dtype=np.float64)
    world_min, world_max = np.array([math.inf] * 3), np.array([-math.inf] * 3)
    total_vertices, front_vertices = 0, 0
    individual = []
    # x-min, x-max, y-min, y-max. Every candidate is an actual evaluated vertex.
    extrema = [math.inf, -math.inf, math.inf, -math.inf]
    candidates = [None, None, None, None]
    for obj in meshes:
        evaluated = obj.evaluated_get(dg)
        coords = original._mesh_local(evaluated, obj, mesh_cache, np)
        if not len(coords):
            continue
        local4 = np.column_stack([coords, np.ones(len(coords))])
        world = local4 @ np.asarray(evaluated.matrix_world, dtype=np.float64).T
        camera_coords = world @ view.T
        front = camera_coords[:, 2] < -max(camera.data.clip_start, 1e-6)
        total_vertices += len(coords)
        front_vertices += int(front.sum())
        if not front.any():
            individual.append({'object': obj.name, 'front': False})
            continue
        world_front = world[front]
        clip = camera_coords[front] @ proj.T
        xy = clip[:, :2] / clip[:, 3:4] * .5 + .5
        indices = [int(xy[:, 0].argmin()), int(xy[:, 0].argmax()),
                   int(xy[:, 1].argmin()), int(xy[:, 1].argmax())]
        values = [float(xy[indices[0], 0]), float(xy[indices[1], 0]),
                  float(xy[indices[2], 1]), float(xy[indices[3], 1])]
        for k, (index, value) in enumerate(zip(indices, values)):
            better = value < extrema[k] if k in (0, 2) else value > extrema[k]
            if candidates[k] is None or better:
                extrema[k] = value
                candidates[k] = world_front[index, :3].copy()
        # Keep the old world-bound convention, including back vertices of any
        # object that has at least one front vertex. Never substitute bbox corners.
        world_min = np.minimum(world_min, world[:, :3].min(axis=0))
        world_max = np.maximum(world_max, world[:, :3].max(axis=0))
        x0, x1, y0, y1 = values
        individual.append({'object': obj.name, 'width_ratio': x1 - x0,
                           'height_ratio': y1 - y0,
                           'bounds01': [x0, y0, x1, y1],
                           'vertices': len(coords), 'front': True})
    if candidates[0] is None:
        return {'exists': False, 'width_ratio': 0, 'height_ratio': 0,
                'in_frame': False, 'objects': individual, 'vertices': total_vertices}
    actual = [world_to_camera_view(scene, camera, Vector(point)) for point in candidates]
    minx, maxx = min(p.x for p in actual), max(p.x for p in actual)
    miny, maxy = min(p.y for p in actual), max(p.y for p in actual)
    w, h = maxx - minx, maxy - miny
    visible_w = max(0, min(1, maxx) - max(0, minx))
    visible_h = max(0, min(1, maxy) - max(0, miny))
    return {'exists': True, 'width_ratio': w, 'height_ratio': h,
            'bounds01': [minx, miny, maxx, maxy],
            'bounds_pixels_xy_top': [minx * width, (1 - maxy) * height, maxx * width, (1 - miny) * height],
            'visible_width_ratio': visible_w,
            'in_frame': minx >= 0 and maxx <= 1 and miny >= 0 and maxy <= 1 and front_vertices == total_vertices,
            'bbox_in_frame_area_fraction': visible_w * visible_h / max(w * h, 1e-12),
            'world_center': ((world_min + world_max) / 2).tolist(),
            'world_bounds': [world_min.tolist(), world_max.tolist()],
            'objects': individual, 'vertices': total_vertices,
            'vertices_in_front': front_vertices,
            'occlusion': '未検査。これは実形状投影の測定であり、遮蔽・字幕の重なり・読めるかは完成画で目視する。'}


def _selected_meshes(ns, t, X):
    """Match the current S3 primary() selector/filter without changing it."""
    selector = ns.get('s3qa')
    if selector is None:
        import desk_d1b_s3_qa_20261026 as selector
    spec = selector._select(ns, t, X)
    assert spec['source'] != 'full-face-excluded', ('Choose a visible-geometry sample', t)
    obsolete = set(ns.get('M', {}).get('_gpt_obsolete', []))
    obsolete.update(ns.get('M', {}).get('s3', {}).get('obsolete', []))
    meshes = [o for o in dict.fromkeys(spec['objects'])
              if o not in obsolete and getattr(o, 'type', None) == 'MESH'
              and not o.hide_render
              and not (o.users_collection and all(k.hide_render for k in o.users_collection))]
    if spec['source'] in ('legacy-semantic-warning', 'cylinder-only',
                          'machine-groups-no-stage-front', 'M.s3.pump.body+rising-main',
                          'moving-arm-piston-mine-rod', 'main-cylinder-and-coal'):
        meshes = [o for o in meshes if not original._EXCLUDE_NAME.search(o.name)
                  and not original._EXCLUDE_FLUID.search(o.name)]
    assert meshes, ('No primary meshes for independent old/new comparison', t, spec['source'])
    return meshes, spec


def _camera_snapshot(ns):
    camera, render = ns['d'].CAM, ns['d'].SC.render
    return (tuple(tuple(row) for row in camera.matrix_world), camera.data.lens,
            camera.data.shift_x, camera.data.shift_y, camera.data.clip_start,
            camera.data.clip_end, camera.data.sensor_fit, render.resolution_x,
            render.resolution_y, render.pixel_aspect_x, render.pixel_aspect_y)


def _flatten(value):
    if isinstance(value, (list, tuple)):
        return [x for item in value for x in _flatten(item)]
    return [float(value)]


def _differences(old, new, tolerance):
    differences = []
    for key in ('exists', 'vertices', 'vertices_in_front', 'in_frame'):
        if old.get(key) != new.get(key):
            differences.append({'key': key, 'old': old.get(key), 'new': new.get(key)})
    keys = ('bounds01', 'bounds_pixels_xy_top', 'width_ratio', 'height_ratio',
            'visible_width_ratio', 'bbox_in_frame_area_fraction', 'world_center', 'world_bounds')
    for key in keys:
        a, b = old.get(key), new.get(key)
        if a is None or b is None:
            if a != b:
                differences.append({'key': key, 'old': a, 'new': b})
            continue
        aa, bb = _flatten(a), _flatten(b)
        error = max((abs(x - y) for x, y in zip(aa, bb)), default=0)
        if len(aa) != len(bb) or not all(math.isfinite(x) for x in aa + bb) or error > tolerance:
            differences.append({'key': key, 'old': a, 'new': b, 'maxError': error})
    # Per-mesh raw clip bounds are diagnostic only; counts/front flags are exact.
    a = [(o['object'], o.get('vertices'), o.get('front')) for o in old['objects']]
    b = [(o['object'], o.get('vertices'), o.get('front')) for o in new['objects']]
    if a != b:
        differences.append({'key': 'perMeshIdentityVertexFront', 'old': a, 'new': b})
    return differences


def validate(ns, times=DEFAULT_TIMES, repeats=3, output_path=None):
    """Run both independent projectors at nine actual poses, then assert equality.

    Returns/report timings even on a numerical failure; failure raises after an
    optional new report file is written. Existing reports are never overwritten.
    No render, camera fit, threshold change, integration or monkeypatch occurs.
    """
    times = tuple(float(t) for t in times)
    assert len(times) == 9, 'Validation requires nine actual scene times'
    assert isinstance(repeats, int) and repeats >= 1
    destination = Path(output_path) if output_path is not None else None
    if destination is not None:
        assert destination.name.startswith('projector-fast-validation_') and destination.suffix == '.json'
        assert not destination.exists(), 'Never overwrite an earlier validation'
        assert destination.parent.is_dir(), 'Parent must supply an existing report directory'
    old_cache, new_cache = {}, {}
    records = []
    for index, t in enumerate(times):
        camera, st, X = ns['apply'](t)
        meshes, spec = _selected_meshes(ns, t, X)
        before = _camera_snapshot(ns)
        # Warm both separate caches with the same pose/meshes before timing.
        old = original._project(ns, meshes, old_cache)
        new = _project(ns, meshes, new_cache)
        differences = _differences(old, new, 1e-6)
        old_seconds, new_seconds = [], []
        for iteration in range(repeats):
            order = ('old', 'new') if (index + iteration) % 2 == 0 else ('new', 'old')
            measured = {}
            for which in order:
                fn, cache = (original._project, old_cache) if which == 'old' else (_project, new_cache)
                start = time.perf_counter()
                measured[which] = fn(ns, meshes, cache)
                elapsed = time.perf_counter() - start
                (old_seconds if which == 'old' else new_seconds).append(elapsed)
            differences.extend(_differences(measured['old'], measured['new'], 1e-6))
        if before != _camera_snapshot(ns):
            differences.append({'key': 'camera_or_render_changed'})
        record = {'time': t, 'cue': ns['cue_at'](t)['key'], 'name': spec['name'],
                  'selectionSource': spec['source'], 'meshCount': len(meshes),
                  'vertices': old.get('vertices'), 'verticesInFront': old.get('vertices_in_front'),
                  'oldBounds01': old.get('bounds01'), 'newBounds01': new.get('bounds01'),
                  'oldInFrame': old.get('in_frame'), 'newInFrame': new.get('in_frame'),
                  'tolerance': 1e-6, 'differences': differences, 'passed': not differences,
                  'oldSeconds': old_seconds, 'newSeconds': new_seconds,
                  'oldMedianSeconds': statistics.median(old_seconds),
                  'newMedianSeconds': statistics.median(new_seconds),
                  'globalConfirmationCalls': 4 if new['exists'] else 0,
                  'cameraUnchanged': before == _camera_snapshot(ns)}
        record['speedup'] = record['oldMedianSeconds'] / max(record['newMedianSeconds'], 1e-12)
        records.append(record)
        print('[projector optional validation]', t, 'PASS' if record['passed'] else 'FAIL',
              'old %.4fs new %.4fs speedup %.2fx' % (record['oldMedianSeconds'], record['newMedianSeconds'], record['speedup']), flush=True)
    old_total = sum(r['oldMedianSeconds'] for r in records)
    new_total = sum(r['newMedianSeconds'] for r in records)
    report = {'kind': 'optional-projector-validation-not-wired', 'tolerance': 1e-6,
              'samples': records, 'passed': all(r['passed'] for r in records),
              'oldMedianSumSeconds': old_total, 'newMedianSumSeconds': new_total,
              'aggregateSpeedup': old_total / max(new_total, 1e-12),
              'perMeshDiagnosticBounds': 'clip formula; no substitution for confirmed global bounds',
              'integrated': False, 'oldCheckerChanged': False, 'cameraChanged': False,
              'allActualEvaluatedVertices': True, 'occlusionOrReadabilityPassClaimed': False}
    if destination is not None:
        with destination.open('x', encoding='utf-8') as handle:
            json.dump(report, handle, ensure_ascii=False, indent=2)
    assert report['passed'], 'Optional projector differs from old: keep old projector; inspect validation report'
    return report
