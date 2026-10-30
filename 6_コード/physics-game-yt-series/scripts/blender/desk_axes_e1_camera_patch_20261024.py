"""New E1 camera-only delivery correction, AFTER frozen r9 production.

Root alone schedules run(nsE1, authorized=True). Import performs no Blender
operation. Frozen r9 source/library/runner/raw/gates remain unchanged.
Only documented inter-site moves cut to the incoming subject and approach it
within the SAME supplied move interval. Same-site closeups, all physical
states (including rolling ship/waves/pendulum), source times, holds and hooks
remain those of the original production. No replacement Japanese or sound.
"""
import ast
from collections import Counter
import hashlib
import json
import math
import os
from pathlib import Path
import re
import runpy
import time
import types
from types import SimpleNamespace

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-e1v1')
P = Path('/private/tmp/ys/ys-chain-e1v1-camera-final-20261024')
RUNNER = W / 'scripts/blender/desk_axes_e1_r9_production.py'
RUNNER_SHA = '5ace957318aedf51261034af2b9bf2949d8c6cd6d2e476afb5e1b6c27103c8ad'
KEYS = ('two:need', 'two:grid', 'lat:sky', 'tz:real', 'tz:135', 'ship:sun',
        'clk:111', 'clk:shift', 'dr:none', 'dr:drift', 'pen:hyp', 'pen:fact',
        'prize:act', 'next:order', 'last:clock')
GROUPS = {'map': ['chart'], 'grid': ['chart'], 'globe': ['globe'],
          'latitude': ['globe'], 'star': ['globe'], 'dial': ['globe', 'dial'],
          'torch': ['globe', 'torch'], 'clocks': ['tokyo', 'london'],
          'arc': ['globe', 'arcs'], 'ship': ['ship'], 'clock': ['shipclock'],
          'log': ['ship'], 'pendulum': ['pendulum'],
          'sway': ['ship', 'pendulum'], 'prize': ['prize']}
# These two approved physical principals are only 42% / 43% wide at rest.
# A full 10% pull-back would break the 40% rule. Bound their approach instead.
APPROACH = {'log': .04, 'pendulum': .05}
UNCHANGED_MOVES = ('fog:night', 'lon:star', 'lon:spin', 'lon:torch', 'clk:side')


def sha(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def write_new(path, value):
    with Path(path).open('x') as f:
        json.dump(value, f, ensure_ascii=False, indent=1, allow_nan=False)
        f.write('\n')


def smooth(x):
    x = max(0., min(1., x))
    return x * x * (3 - 2 * x)


def cue_at(cues, t):
    return next((c for c in reversed(cues) if c['start'] <= t), cues[0])


def patch_pose(cue, t, cameras, fallback):
    if cue['key'] not in KEYS:
        return list(fallback(t))
    target = list(cameras[cue['camera']])
    if t < cue['start'] + cue['move']:
        progress = smooth((t - cue['start']) / cue['move'])
        target[3] *= 1 + APPROACH.get(cue['camera'], .10) * (1 - progress)
    return target


def schedule(cues, cameras, plans, fallback, fps=30):
    """Pure exact-frame schedule. Never advances a held object's source time."""
    replacements, sources, unique = {}, {}, {}
    for j, planned in enumerate(plans):
        t = j / fps
        cue = cue_at(cues, t)
        if cue['key'] not in KEYS:
            continue
        ref = j if planned[0] == 'render' else planned[1]
        boundary = cue['start'] + cue['move']
        if t < boundary or ref / fps < boundary:
            assert cue_at(cues, ref / fps)['key'] == cue['key'], (j, ref, cue['key'])
            state = (ref, tuple(patch_pose(cue, t, cameras, fallback)))
            actual = unique.setdefault(state, j)
            replacements[j] = actual
            sources[actual] = ref
    assert all(plans[ref][0] == 'render' for ref in sources.values())
    return replacements, sources


def raw_inventory(folder):
    result = {}
    for p in sorted(folder.iterdir()):
        if re.fullmatch(r'\d{5}\.jpg', p.name):
            assert not p.is_symlink(), 'Frozen production must remain real owned JPEGs'
            s = p.stat()
            # Preserve nanoseconds exactly through JSON and the JS merger.
            result[p.name] = [s.st_size, str(s.st_mtime_ns)]
    return result


def function_snapshot(g, names):
    return {name: g[name] for name in names}


def run(ns, authorized=False, render=True, out=str(P)):
    import numpy as np
    assert authorized, 'Only the root GUI queue may execute this correction'
    out = Path(out)
    assert out.parent == P.parent and out.name.startswith(P.name)
    assert not os.path.lexists(out), 'Preserve previous correction output; use a new version'
    assert sha(RUNNER) == RUNNER_SHA, 'Frozen v2 runner changed'
    runner = runpy.run_path(str(RUNNER))
    g = ns['apply'].__globals__
    d, bpy, scene = g['d'], g['bpy'], g['d'].SC
    assert Path(g['__file__']) == W / 'scripts/blender/desk_e1v1.py'
    assert g['A'].cache == str(C) and g['FPS'] == 30 and g['NF'] == 11606
    assert bpy.data.scenes.get(scene.name) is scene and scene.camera is d.CAM
    assert scene.render.engine == 'BLENDER_EEVEE'
    completed = C / 'e1v1-production-r9/completed.json'
    assert completed.is_file(), 'Wait for successful original r9 production'
    complete = json.loads(completed.read_text())
    assert complete['status'] == 'render_complete_pending_final_QA'
    assert complete['runnerSha256'] == RUNNER_SHA
    freeze_file = C / 'e1v1-r9-source-freeze.json'
    freeze = json.loads(freeze_file.read_text())
    protected = {str(W / p): h for p, h in freeze['files'].items()}
    protected.update({str(freeze_file): sha(freeze_file), str(RUNNER): RUNNER_SHA,
                      str(C / 'ys-chain-e1v1.wav'): freeze['canonicalVoiceSHA256'],
                      str(C / 'blender/data.json'): freeze['dataSHA256'],
                      str(C / 'blender/tex/e1-chart.png'): freeze['textureSHA256'],
                      str(completed): sha(completed),
                      str(C / 'blender/desk/anchors.json'): sha(C / 'blender/desk/anchors.json'),
                      str(C / 'blender/desk/meta.json'): sha(C / 'blender/desk/meta.json'),
                      str(C / 'blender/camera-motion.json'): sha(C / 'blender/camera-motion.json')})
    assert all(sha(p) == h for p, h in protected.items()), 'Frozen input changed'
    names = {'main', 'apply', 'plan', 'latitude_state', 'ship_state', 'hands', 'pose_at', 'anchors'}
    nodes = [n for n in ast.parse(Path(g['__file__']).read_text()).body
             if isinstance(n, ast.FunctionDef) and n.name in names]
    test = {}
    exec(compile(ast.Module(body=nodes, type_ignores=[]), g['__file__'], 'exec'), test)
    assert all(runner['signature'](g[n].__code__) == runner['signature'](test[n].__code__)
               for n in names), 'Retained frozen E runtime changed'
    originals = function_snapshot(g, names | {'apply_state', 'use_pose', 'camera_keys'})
    control_bindings = {name: g[name] for name in ('SPANS', 'EVENTS', 'KEYS', 'CAMERAS')}
    canonical = {}
    source = W / 'scripts/blender/desk_lib.py'
    main_node = [n for n in ast.parse(source.read_text()).body
                 if isinstance(n, ast.FunctionDef) and n.name == 'main']
    exec(compile(ast.Module(body=main_node, type_ignores=[]), str(source), 'exec'), canonical)
    assert runner['signature'](d.main.__code__) == runner['signature'](canonical['main'].__code__)
    pg, plans = runner['frozen_plan']()
    assert all(tuple(g['plan'](j)) == tuple(p) for j, p in enumerate(plans))
    camera_record = json.loads((C / 'blender/gate-e1v1-r9/r9-probe-actual.json').read_text())
    assert all(tuple(g['CAMERAS'][k]) == tuple(p) for k, p in camera_record['cameras'].items())
    assert len(plans) == 11606
    cues, fps = g['CUES'], g['FPS']
    assert set(KEYS).issubset({c['key'] for c in cues})
    assert {c['key'] for c in cues if c['move']} == set(KEYS) | set(UNCHANGED_MOVES)
    replacements, sources = schedule(cues, g['CAMERAS'], plans, g['pose_at'], fps)
    frames = sorted(sources)
    assert frames and len(frames) == len(set(replacements.values()))
    base = C / 'blender/desk'
    inventory = raw_inventory(base)
    assert len(inventory) == 11606
    sampled_sha = {str(base / ('%05d.jpg' % j)): sha(base / ('%05d.jpg' % j))
                   for j in sorted(set([0, 15, 11605] + list(sources.values())))}
    old_scene = bpy.context.window.scene
    render_paths = {s.name: s.render.filepath for s in bpy.data.scenes}
    existing_saved = {p: runner['stamp'](p) for p in render_paths.values()
                      if p and os.path.isfile(p)}
    scene_sizes = {'objects': len(bpy.data.objects), 'meshes': len(bpy.data.meshes),
                   'curves': len(bpy.data.curves), 'materials': len(bpy.data.materials)}
    old_settings = (scene.render.resolution_x, scene.render.resolution_y,
                    scene.render.resolution_percentage, scene.eevee.taa_render_samples,
                    scene.render.image_settings.file_format, scene.render.image_settings.quality)
    started = time.time()
    physical, violations, extra_clips = [], [], []
    arrays = {name: [[0, 0, 0] for _ in plans]
              for name in sorted(set(g['anchors'](0)) | {'observer'})}

    def apply_source_and_camera(j, patched):
        if patched:
            ref = sources[j]
            points = originals['apply'](ref / fps)
            cue = cue_at(cues, j / fps)
            pose = patch_pose(cue, j / fps, g['CAMERAS'], originals['pose_at'])
            originals['use_pose'](pose)
        else:
            ref = j if plans[j][0] == 'render' else plans[j][1]
            points = originals['apply'](ref / fps)
            pose = originals['pose_at'](ref / fps)
        bpy.context.view_layer.update()
        return ref, list(pose), points

    def vertices(names, leather=False):
        result = []
        for name in names:
            for ob in g['GROUPS'][name]:
                if ob.hide_render:
                    continue
                if leather and not (ob.type == 'MESH' and
                        d.MATS['e1leather'] in list(ob.data.materials)):
                    continue
                if ob.type == 'MESH':
                    result.extend(ob.matrix_world @ v.co for v in ob.data.vertices)
                elif ob.type == 'CURVE':
                    for spline in ob.data.splines:
                        result.extend(ob.matrix_world @ g['Vector'](p.co[:3]) for p in spline.points)
        return result

    def bounds(points, projection):
        assert points, 'No physical primary geometry'
        world = np.array([list(p) + [1.] for p in points], dtype=np.float64)
        clip = world @ np.asarray(projection, dtype=np.float64).T
        assert np.isfinite(clip).all() and (np.abs(clip[:, 3]) > 1e-12).all()
        ndc = clip[:, :3] / clip[:, 3:4]
        xy = np.column_stack(((ndc[:, 0] * .5 + .5) * 1080,
                              (.5 - ndc[:, 1] * .5) * 1920))
        selected = sorted(set([0, len(points) // 2, len(points) - 1]))
        reference = np.array([d.project(points[i])[:2] for i in selected])
        delta = float(np.abs(xy[selected] - reference).max())
        assert delta <= .11, ('Bulk camera projection differs from original d.project', delta)
        # The original d.project serializes x/y to one decimal place.
        rounded = np.round(xy, 1)
        box = [float(rounded[:, 0].min()), float(rounded[:, 1].min()),
               float(rounded[:, 0].max()), float(rounded[:, 1].max())]
        in_frame = bool((clip[:, 3] > 0).all() and box[0] >= 0 and box[1] >= 0 and
                        box[2] <= 1080 and box[3] <= 1920)
        width = (box[2] - box[0]) / 1080
        return {'box': box, 'widthRatio': width, 'within40to70': .4 <= width <= .7,
                'smallBelow35': width < .35,
                'originalProjectCrosscheck': {'vertices': len(selected), 'maxAbsolutePixelDifference': delta},
                'allProjectedVerticesInFrontAndFrame': in_frame,
                'clipped': box[0] < 0 or box[1] < 0 or box[2] > 1080 or box[3] > 1920 or
                    not in_frame,
                'outsidePrincipalSafeArea': box[0] < 40 or box[1] < 110 or
                    box[2] > 1040 or box[3] > 1550}

    def measure(j, patched):
        ref, pose, anchors = apply_source_and_camera(j, patched)
        cue = cue_at(cues, j / fps)
        primary = GROUPS[cue['camera']]
        depsgraph = bpy.context.evaluated_depsgraph_get()
        projection = d.CAM.calc_matrix_camera(depsgraph, x=1080, y=1920, scale_x=1, scale_y=1) @ d.CAM.matrix_world.inverted()
        result = bounds(vertices(primary, cue['camera'] == 'prize'), projection)
        extras = []
        if cue['camera'] == 'log':
            extras = ['sailor', 'compass', 'hourglass', 'log']
        if cue['row'] == 21:
            extras = ['sun']
        extra = {}
        for name in extras:
            cloud = vertices([name])
            if cloud:
                extra[name] = bounds(cloud, projection)
        row = {'frame': j, 'time': j / fps, 'cue': cue['key'], 'row': cue['row'],
               'camera': cue['camera'], 'groups': primary, 'depictedObjectFrame': ref,
               'pose': pose, 'auxiliaryRoleGeometry': extra, **result}
        return row, anchors

    out.mkdir()
    report = {'id': 'ys-chain-e1v1', 'sourceFreeze': str(freeze_file),
              'sourceFreezeSha256': sha(freeze_file), 'helperSha256': sha(__file__),
              'productionFrames': 11606, 'fps': 30, 'originalPlanCounts': dict(Counter(p[0] for p in plans)),
              'keys': list(KEYS), 'sameSiteAndOpeningMovesUnchanged': list(UNCHANGED_MOVES),
              'approach': {'maximumDistanceMultiplier': 1.10,
                           'logDistanceMultiplier': 1.04, 'pendulumDistanceMultiplier': 1.05,
                           'reasonForSmallerTwo': 'Preserve the approved 42% / 43% true primary above 40%, not a decorative union'},
              'replacementFrameToActualPatchFrame': replacements,
              'patchFrameToUnchangedObjectSourceFrame': sources, 'patchFrames': frames,
              'protectedInputSha256': protected, 'protectedOriginalRawSampleSha256': sampled_sha,
              'originalRawInventoryBefore': inventory,
              'actualEyeReviewRequired': True, 'originalImageGateNotChanged': True,
              'finalPassed': False, 'status': 'Preflight in progress; no patch JPEG rendered'}
    try:
        bpy.context.window.scene = scene
        scene.render.resolution_x = 1080
        scene.render.resolution_y = 1920
        scene.render.resolution_percentage = 100
        scene.eevee.taa_render_samples = 16
        scene.render.image_settings.file_format = 'JPEG'
        scene.render.image_settings.quality = 95
        # Audit EVERY actual patch state, not just hand-picked trial times.
        for j in frames:
            row, anchor_points = measure(j, True)
            physical.append(row)
            if row['clipped'] or not row['within40to70'] or row['outsidePrincipalSafeArea']:
                violations.append(row)
            for name, bb in row['auxiliaryRoleGeometry'].items():
                if bb['clipped']:
                    extra_clips.append({'frame': j, 'cue': row['cue'], 'auxiliary': name, **bb})
            for name in arrays:
                arrays[name][j] = d.project(anchor_points[name]) if name in anchor_points else [0, 0, 0]
        report.update({'physical': physical, 'physicalViolations': violations,
                       'auxiliaryFullFrameClips': extra_clips,
                       'geometryMethod': 'Visible base mesh/curve vertices, bulk camera-matrix projection independently compared with original d.project at three real vertices per measured group/frame within0.11px; no evaluated-modifier, pixel contrast or occlusion claim',
                       'status': 'Preflight numeric evidence complete; actual visual review still required'})
        write_new(out / 'preflight.json', report)
        assert not violations and not extra_clips, 'Actual physical camera preflight NG; NO patch images rendered'
        if not render:
            return report
        raw = out / 'blender/patch'
        raw.mkdir(parents=True)
        write_new(raw / 'anchors.json', {'fps': fps, 'frames': len(plans), 'anchors': arrays})

        class Render:
            def render(self, *args, **kwargs):
                requested = kwargs.pop('scene', scene.name)
                assert requested == scene.name
                bpy.context.window.scene = scene
                target = Path(scene.render.filepath)
                assert target.parent == raw and re.fullmatch(r'\d{5}\.jpg', target.name)
                assert int(target.stem) in sources and not os.path.lexists(target)
                result = bpy.ops.render.render(*args, scene=scene.name, **kwargs)
                runner['jpeg'](str(target))
                return result

        proxy = SimpleNamespace(**bpy.__dict__)
        proxy.ops = SimpleNamespace(render=Render())
        options = {'times': [j / fps for j in frames], 'out': str(raw),
                   'every': 1, 'scale': 1, 'from': 0, 'to': 1e9, 'force': False, 'noanc': False}
        scope = {**d.__dict__, 'bpy': proxy, 'SC': scene, 'A': options,
                 'FPS': fps, 'NF6': len(plans), 'CACHE6': str(out),
                 'T6': lambda *args, **kwargs: 0, 'S6': lambda key: 1e6,
                 'plan6': lambda j: ('render', None),
                 'apply6': lambda t: apply_source_and_camera(round(t * fps), True)}
        print('E1 camera-only correction START', len(frames), 'actual renders /', len(replacements), 'delivered frames', flush=True)
        try:
            types.FunctionType(d.main.__code__, scope)()
        except SystemExit as e:
            assert e.code in (None, 0)
        assert all((raw / ('%05d.jpg' % j)).is_file() for j in frames)
        for j in frames:
            runner['jpeg'](str(raw / ('%05d.jpg' % j)))
        poses = []
        for j, planned in enumerate(plans):
            if j in replacements:
                k = replacements[j]
                poses.append(patch_pose(cue_at(cues, k / fps), k / fps, g['CAMERAS'], originals['pose_at']))
            else:
                ref = j if planned[0] == 'render' else planned[1]
                poses.append(list(originals['pose_at'](ref / fps)))
        moving = [False] + [poses[j] != poses[j - 1] for j in range(1, len(poses))]
        motion = {'frames': len(plans), 'moving_frames': sum(moving),
                  'moving_ratio': sum(moving) / len(plans),
                  'top_ratio': sum(p[5] >= 65 for p in poses) / len(plans),
                  'method': 'Exact actual delivered source poses; scene cuts count as motion; only documented inter-site moves corrected'}
        write_new(out / 'blender/camera-motion.json', motion)
        indices = sorted(set(list(range(0, len(plans), 15)) +
                         [math.ceil(c['end'] * fps - 1e-7) - 1 for c in cues] + [len(plans) - 1]))
        final_dimensions = []
        for j in indices:
            actual = replacements.get(j)
            row, _ = measure(actual if actual is not None else j, actual is not None)
            final_dimensions.append({**row, 'frame': j, 'sampleTime': j / fps,
                                     'actualPatchedFrame': actual,
                                     'actualEyeReviewRequired': True})
        write_new(out / 'final-held-dimensions.json', {
            'id': 'ys-chain-e1v1', 'samples': final_dimensions,
            'method': 'Exact delivered original hold source and camera or actual camera-patch source; physical widths do not certify visible pixels',
            'automaticGate7or7bWaived': False, 'actualMp4EyeReviewPending': True})
        report.update({'raw': str(raw), 'anchors': str(raw / 'anchors.json'),
                       'cameraMotion': motion, 'allPatchFramesActuallyRendered': True,
                       'status': 'Camera-only JPEG correction rendered; actual composite/MP4 review and original gates pending'})
        return report
    except BaseException as error:
        report.update({'status': 'FAIL; original inputs/raw and original NG preserved',
                       'error': {'type': type(error).__name__, 'message': str(error)}})
        raise
    finally:
        scene.render.filepath = render_paths[scene.name]
        (scene.render.resolution_x, scene.render.resolution_y,
         scene.render.resolution_percentage, scene.eevee.taa_render_samples,
         scene.render.image_settings.file_format, scene.render.image_settings.quality) = old_settings
        bpy.context.window.scene = old_scene
        protected_ok = all(sha(p) == h for p, h in protected.items())
        raw_ok = raw_inventory(base) == inventory and all(sha(p) == h for p, h in sampled_sha.items())
        other_ok = all(bpy.data.scenes[name].render.filepath == value for name, value in render_paths.items())
        saved_ok = not runner['verify_saved'](existing_saved)
        identity_ok = (all(g[name] is func for name, func in originals.items()) and
                       all(g[name] is value for name, value in control_bindings.items()))
        sizes_ok = scene_sizes == {'objects': len(bpy.data.objects), 'meshes': len(bpy.data.meshes),
                                   'curves': len(bpy.data.curves), 'materials': len(bpy.data.materials)}
        report.update({'originalInputsUnchanged': protected_ok,
                       'allOriginal11606RawSizeAndMtimeUnchanged': raw_ok,
                       'otherSceneSavePathsAndImagesUnchanged': other_ok and saved_ok,
                       'allOriginalFunctionsRetained': identity_ok, 'noModelRebuild': sizes_ok,
                       'seconds': round(time.time() - started, 3)})
        write_new(out / 'camera-patch.json', report)
        assert protected_ok and raw_ok and other_ok and saved_ok and identity_ok and sizes_ok, 'Frozen source/raw or other-scene protection failed'
        print('E1 camera-only correction STOP/COMPLETE', report['status'], flush=True)
