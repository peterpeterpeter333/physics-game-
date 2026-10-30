"""New B2a runtime-only patch: row 6/7 land slice width, nothing else.

Root alone imports this inside the existing Blender GUI.
probe(NS) measures original and 70% width and verifies all protected states.
install(NS) installs an idempotent apply wrapper; uninstall(NS) restores it.
No camera, vertex, needle, arrow, voice, caption, source file or frame is written.
This is not a change to the existing producer or any automatic quality gate.
"""
import json
from pathlib import Path
import bpy
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

PATCH_KEY = '_b2a_earth_slice_width_patch_20261030'


def _globals(ns):
    fn = ns.get('apply')
    assert callable(fn), 'Scene apply(t) is required'
    glob = getattr(fn, '_b2a_scene_globals', fn.__globals__)
    assert glob.get('MODELS') is ns.get('MODELS'), 'Unexpected scene namespace'
    return glob


def _tree(root):
    return {root, *root.children_recursive}


def _projection(glob, model):
    """Actual evaluated top/soil/curve surfaces, with unclipped screen bounds."""
    scene = glob['d'].SC
    camera = glob['d'].CAM
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    points = []
    for ob in model['objects']:
        if ob.type not in ('MESH', 'CURVE') or ob.hide_render:
            continue
        evaluated = ob.evaluated_get(dg)
        mesh = evaluated.to_mesh()
        if mesh is None:
            continue
        try:
            world = evaluated.matrix_world
            for vertex in mesh.vertices:
                p = world_to_camera_view(scene, camera, world @ vertex.co)
                assert p.z > 0, 'Land slice passed behind the camera'
                points.append((float(p.x), float(p.y)))
        finally:
            evaluated.to_mesh_clear()
    assert points, 'No visible land slice surfaces'
    xs, ys = zip(*points)
    return {'x0': min(xs), 'x1': max(xs), 'y0': min(ys), 'y1': max(ys),
            'width': max(xs)-min(xs), 'vertices': len(points)}


def _protected_state(glob, allowed):
    d = glob['d']
    objects = {}
    for ob in d.SC.objects:
        if ob in allowed:
            continue
        objects[ob.name] = {
            'matrix': tuple(v for row in ob.matrix_world for v in row),
            'visible': (bool(ob.hide_render), bool(ob.hide_viewport)),
        }
        if ob.type == 'CURVE':
            objects[ob.name]['curvePoints'] = tuple(
                tuple(point.co) for spline in ob.data.splines
                for point in spline.points)
            objects[ob.name]['bevel'] = float(ob.data.bevel_depth)
    cd = d.CAM.data
    camera = {
        'matrix': tuple(v for row in d.CAM.matrix_world for v in row),
        'lens': float(cd.lens), 'shift_x': float(cd.shift_x),
        'shift_y': float(cd.shift_y), 'clip_start': float(cd.clip_start),
        'clip_end': float(cd.clip_end), 'sensor_fit': cd.sensor_fit,
        'sensor_width': float(cd.sensor_width),
        'sensor_height': float(cd.sensor_height),
        'resolution': (d.SC.render.resolution_x, d.SC.render.resolution_y,
                       d.SC.render.resolution_percentage),
        'dof_fstop': float(cd.dof.aperture_fstop),
    }
    fingerprint = glob.get('mesh_geometry_fingerprint')
    assert callable(fingerprint), 'Producer geometry guard is required'
    return {'objects': objects, 'camera': camera,
            'geometry': fingerprint()}


def _measure_change(glob, original_apply, t, target):
    state = original_apply(t)
    assert state['row'] in (6, 7)
    model = glob['MODELS']['earth_slice']
    root = model['root']
    allowed = _tree(root)
    before_projection = _projection(glob, model)
    assert before_projection['width'] > 0
    before = _protected_state(glob, allowed)
    original_scale = root.scale.copy()
    ratio = target / before_projection['width']
    root.scale.x = original_scale.x*ratio
    bpy.context.view_layer.update()
    after_projection = _projection(glob, model)
    after = _protected_state(glob, allowed)
    assert before == after, 'Protected geometry/object/camera state changed'
    assert root.scale.y == original_scale.y and root.scale.z == original_scale.z
    assert abs(after_projection['width']-target) < .00001, 'Width did not converge'
    assert after_projection['x0'] >= -.00001 and after_projection['x1'] <= 1.00001, 'Land slice remains clipped'
    return {'row': state['row'], 'seconds': t, 'frameTime': t*30,
            'originalScale': list(original_scale), 'ratio': ratio,
            'patchedScale': list(root.scale),
            'before': before_projection, 'after': after_projection,
            'allOtherObjectTransformsVisibilityUnchanged': True,
            'allMeshVertexGeometryUnchanged': True,
            'cameraUnchanged': True, 'onlyEarthRootScaleXChanged': True}


def probe(ns, target=.70, out=None):
    """Numerical GUI probe only; creates no drawing and writes no existing file."""
    assert 0 < float(target) < 1
    glob = _globals(ns)
    assert PATCH_KEY not in glob, 'Uninstall the runtime patch before reprobe'
    original = glob['apply']
    measurements = []
    try:
        for row in (6, 7):
            r = glob['ROWS'][row]
            times = [r['start']+1/30, (r['start']+r['end'])/2, r['end']-1/30]
            for t in times:
                measurements.append(_measure_change(glob, original, t, target))
    finally:
        original(0)
    for row in (6, 7):
        ratios = [m['ratio'] for m in measurements if m['row'] == row]
        assert max(ratios)-min(ratios) < .00001, 'Unexpected variable row camera'
    result = {
        'purpose': 'Runtime-only row 6/7 land-slice X-width correction',
        'targetWidthFraction': target, 'measurements': measurements,
        'originalProducerFileEdited': False, 'existingQaEdited': False,
        'drawingPerformed': False, 'allVisualsReviewed': False,
    }
    if out is not None:
        path = Path(out)
        assert not path.exists(), 'Preserve earlier probe results'
        assert path.parent.is_dir()
        with path.open('x', encoding='utf-8') as handle:
            json.dump(result, handle, ensure_ascii=False, indent=2)
    return result


def install(ns, target=.70):
    """Patch actual function globals (runpy may return a shallow namespace copy).

    Scene use() restores the original earth scale before each call, so the
    factor is absolute and never compounds. Original camera calibrations stay.
    """
    glob = _globals(ns)
    existing = glob.get(PATCH_KEY)
    if existing:
        assert existing['target'] == target
        ns['apply'] = existing['patched_apply']
        ns[PATCH_KEY] = existing
        return existing
    result = probe(ns, target)
    original = glob['apply']
    ratios = {row: next(m['ratio'] for m in result['measurements']
                       if m['row'] == row) for row in (6, 7)}

    def patched_apply(t):
        state = original(t)
        row = state['row']
        if row in (6, 7):
            model = glob['MODELS']['earth_slice']
            model['root'].scale.x *= ratios[row]
            bpy.context.view_layer.update()
            measured = _projection(glob, model)
            assert abs(measured['width']-target) < .00001
            assert measured['x0'] >= -.00001 and measured['x1'] <= 1.00001
        return state

    patched_apply._b2a_scene_globals = glob
    patch = {'target': target, 'ratios': ratios, 'original_apply': original,
             'patched_apply': patched_apply, 'probe': result,
             'namespace_globals': glob}
    glob[PATCH_KEY] = patch
    glob['apply'] = patched_apply
    ns['apply'] = patched_apply
    ns[PATCH_KEY] = patch
    patched_apply(0)
    return patch


def uninstall(ns):
    glob = _globals(ns)
    patch = glob.pop(PATCH_KEY, None)
    if patch:
        glob['apply'] = patch['original_apply']
        ns['apply'] = patch['original_apply']
        ns.pop(PATCH_KEY, None)
        patch['original_apply'](0)
    return bool(patch)

