"""Add-only local repair of the two confirmed E1 same-site entry defects.

No model or frozen function is installed/edited. Only distance may increase;
the original target, azimuth, elevation, FOV, source state and hold times stay.
Root schedules probe first, then approves its exact report SHA for render.
"""
from collections import Counter
import hashlib
import json
import math
import os
from pathlib import Path
import re
import runpy
import time

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-e1v1')
CAMERA = Path('/private/tmp/ys/ys-chain-e1v1-camera-final-20261024')
P = Path('/private/tmp/ys/ys-chain-e1v1-local-fit-20261024')
RUNNER = W / 'scripts/blender/desk_axes_e1_r9_production.py'
RUNNER_SHA = '5ace957318aedf51261034af2b9bf2949d8c6cd6d2e476afb5e1b6c27103c8ad'
KEYS = ('lon:spin', 'lon:torch')
PRIMARY = {'lon:spin': ('globe', 'dial'), 'lon:torch': ('globe', 'torch')}
PROBE_TIMES = (110.5, 111., 124.5, 125.)
WIDTH_CEILING = .68  # real principal, with margin below the unchanged70% limit


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p):
    return json.loads(Path(p).read_text())


def write(p, value):
    with Path(p).open('x') as f:
        json.dump(value, f, ensure_ascii=False, indent=1, allow_nan=False)
        f.write('\n')


def inventory(folder):
    return {p.name: [p.stat().st_size, str(p.stat().st_mtime_ns)]
            for p in sorted(Path(folder).iterdir()) if re.fullmatch(r'\d{5}\.jpg', p.name)}


def current(cues, t):
    return next((c for c in reversed(cues) if c['start'] <= t), cues[0])


def dependent_mapping(plans, fitted, fps=30):
    """A corrected actual source also owns every output held from that source."""
    mapping, sources, unique = {}, {}, {}
    for j, p in enumerate(plans):
        ref = j if p[0] == 'render' else p[1]
        if ref not in fitted or not fitted[ref]['distanceChanged']:
            continue
        state = (ref, tuple(fitted[ref]['pose']))
        actual = unique.setdefault(state, j)
        mapping[j] = actual
        sources[actual] = ref
    return mapping, sources


def run(ns, authorized=False, mode='probe', approved_probe_sha256=None):
    import numpy as np
    assert authorized and mode in ('probe', 'render'), 'Only root may schedule GUI work'
    out = P / mode
    assert not os.path.lexists(out), 'Preserve any previous probe/render evidence'
    assert sha(RUNNER) == RUNNER_SHA
    runner = runpy.run_path(str(RUNNER))
    g = ns['apply'].__globals__
    d, bpy, scene = g['d'], g['bpy'], g['d'].SC
    assert scene.render.engine == 'BLENDER_EEVEE' and scene.camera is d.CAM
    assert g['NF'] == 11606 and g['FPS'] == 30 and g['A'].cache == str(C)
    freeze_file = C / 'e1v1-r9-source-freeze.json'
    freeze = read(freeze_file)
    protected = {str(W / p): h for p, h in freeze['files'].items()}
    protected[str(freeze_file)] = sha(freeze_file)
    protected[str(RUNNER)] = RUNNER_SHA
    protected[str(C / 'ys-chain-e1v1.wav')] = freeze['canonicalVoiceSHA256']
    cpfile = CAMERA / 'camera-patch.json'
    cp = read(cpfile)
    assert cp['allPatchFramesActuallyRendered'] and cp['originalInputsUnchanged']
    assert cp['allOriginal11606RawSizeAndMtimeUnchanged'] and cp['allOriginalFunctionsRetained']
    assert not cp['physicalViolations'] and not cp['auxiliaryFullFrameClips']
    protected[str(cpfile)] = sha(cpfile)
    protected[str(CAMERA / 'final-held-dimensions.json')] = sha(CAMERA / 'final-held-dimensions.json')
    assert set(KEYS).isdisjoint(cp['keys'])
    for p, h in cp['protectedInputSha256'].items():
        protected[p] = h
    for p in (C / 'blender/desk/anchors.json', C / 'blender/desk/meta.json'):
        protected[str(p)] = sha(p)
    assert all(sha(p) == h for p, h in protected.items())
    pg, plans = runner['frozen_plan']()
    assert len(plans) == 11606
    assert all(tuple(g['plan'](j)) == tuple(p) for j, p in enumerate(plans))
    assert dict(Counter(p[0] for p in plans)) == {'render': 8100, 'dup': 3506}
    cues, fps = g['CUES'], 30
    originals = {n: g[n] for n in ('apply', 'apply_state', 'pose_at', 'use_pose', 'plan', 'main', 'anchors')}
    controls = {n: g[n] for n in ('SPANS', 'EVENTS', 'CAMERAS', 'KEYS')}
    raw_original = C / 'blender/desk'
    before_original, before_camera = inventory(raw_original), inventory(cp['raw'])
    assert len(before_original) == 11606
    candidate_refs = sorted({j if p[0] == 'render' else p[1] for j, p in enumerate(plans)
                             if current(cues, j/fps)['key'] in KEYS
                             and j/fps < current(cues, j/fps)['start'] + current(cues, j/fps)['move']})
    assert candidate_refs
    assert all(plans[k][0] == 'render' for k in candidate_refs)
    assert all(current(cues, k/fps)['key'] in KEYS for k in candidate_refs)
    raw_samples = {str(raw_original / ('%05d.jpg' % k)): sha(raw_original / ('%05d.jpg' % k))
                   for k in sorted(set([0, 15, 11605] + candidate_refs))}
    old_scene = bpy.context.window.scene
    paths = {s.name: s.render.filepath for s in bpy.data.scenes}
    saved = {p: runner['stamp'](p) for p in paths.values() if p and os.path.isfile(p)}
    settings = (scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage,
                scene.eevee.taa_render_samples, scene.render.image_settings.file_format, scene.render.image_settings.quality)
    sizes = {n: len(getattr(bpy.data, n)) for n in ('objects', 'meshes', 'curves', 'materials')}
    started = time.time()
    out.mkdir(parents=True)
    report = {'id': 'ys-chain-e1v1', 'kind': 'Actual same-site entry physical-size/clip repair, distance only',
              'helperSha256': sha(__file__), 'sourceFreezeSha256': sha(freeze_file), 'mode': mode,
              'keys': list(KEYS), 'widthCeiling': WIDTH_CEILING,
              'protectedInputSha256': protected, 'originalRawInventoryBefore': before_original,
              'interSiteCameraPatchSha256': sha(cpfile), 'originalGateNGPreserved': True,
              'originalSourceVoiceSubtitlesAndTimesUnchanged': True,
              'actualEyeReviewRequired': True, 'finalPassed': False, 'status': 'Preflight started'}
    fitted, physical, actual_images = {}, [], []
    try:
        bpy.context.window.scene = scene
        scene.render.resolution_x, scene.render.resolution_y = 1080, 1920
        scene.render.resolution_percentage = 100
        scene.eevee.taa_render_samples = 16
        scene.render.image_settings.file_format = 'JPEG'
        scene.render.image_settings.quality = 95

        def vertices(groups):
            deps = bpy.context.evaluated_depsgraph_get()
            result = []
            for name in groups:
                for ob in g['GROUPS'][name]:
                    if ob.hide_render or ob.type not in ('MESH', 'CURVE', 'FONT'):
                        continue
                    evaluated = ob.evaluated_get(deps)
                    mesh = evaluated.to_mesh()
                    try:
                        if mesh:
                            result.extend(evaluated.matrix_world @ v.co for v in mesh.vertices)
                    finally:
                        evaluated.to_mesh_clear()
            return result

        def bounds(points):
            assert points
            deps = bpy.context.evaluated_depsgraph_get()
            projection = d.CAM.calc_matrix_camera(deps, x=1080, y=1920, scale_x=1, scale_y=1) @ d.CAM.matrix_world.inverted()
            world = np.array([list(p)+[1.] for p in points], dtype=np.float64)
            projected = world @ np.asarray(projection, dtype=np.float64).T
            assert np.isfinite(projected).all() and (np.abs(projected[:, 3]) > 1e-12).all()
            ndc = projected[:, :3] / projected[:, 3:4]
            xy = np.column_stack(((ndc[:, 0]*.5+.5)*1080, (.5-ndc[:, 1]*.5)*1920))
            indices = sorted(set((0, len(points)//2, len(points)-1)))
            reference = np.array([d.project(points[i])[:2] for i in indices])
            delta = float(np.abs(reference-xy[indices]).max())
            assert delta <= .11, ('Original d.project crosscheck', delta)
            b = [float(xy[:, 0].min()), float(xy[:, 1].min()), float(xy[:, 0].max()), float(xy[:, 1].max())]
            width = (b[2]-b[0])/1080
            return {'box': b, 'widthRatio': width, 'within40to70': .4 <= width <= .7,
                    'clipped': bool((projected[:, 3] <= 0).any() or b[0] < 0 or b[1] < 0 or b[2] > 1080 or b[3] > 1920),
                    'outsidePrincipalSafeArea': b[0] < 40 or b[1] < 110 or b[2] > 1040 or b[3] > 1550,
                    'originalProjectCrosscheckMaxPx': delta, 'evaluatedVertices': len(points)}

        def measure_pose(points, pose):
            originals['use_pose'](pose)
            bpy.context.view_layer.update()
            return bounds(points)

        for ref in candidate_refs:
            originals['apply'](ref/fps)
            bpy.context.view_layer.update()
            c = current(cues, ref/fps)
            points = vertices(PRIMARY[c['key']])
            pose = list(originals['pose_at'](ref/fps))
            original_bounds = measure_pose(points, pose)
            def adequate(bb):
                return bb['widthRatio'] <= WIDTH_CEILING and not bb['clipped'] and not bb['outsidePrincipalSafeArea']
            if adequate(original_bounds):
                fitted_pose, bb = pose[:], original_bounds
            else:
                lo, hi = 1., 1.1
                test = pose[:]
                for _ in range(25):
                    test[3] = pose[3]*hi
                    bb = measure_pose(points, test)
                    if adequate(bb):
                        break
                    hi *= 1.1
                else:
                    raise AssertionError('No real geometry distance fit')
                for _ in range(28):
                    mid = (lo+hi)/2
                    test[3] = pose[3]*mid
                    if adequate(measure_pose(points, test)):
                        hi = mid
                    else:
                        lo = mid
                fitted_pose = pose[:]
                fitted_pose[3] *= hi*(1+1e-8)
                bb = measure_pose(points, fitted_pose)
            assert bb['within40to70'] and not bb['clipped'] and not bb['outsidePrincipalSafeArea']
            assert all(fitted_pose[i] == pose[i] for i in (0, 1, 2, 4, 5, 6)) and fitted_pose[3] >= pose[3]
            extras = {}
            if c['key'] == 'lon:torch':
                for name in ('dolls', 'noon'):
                    cloud = vertices((name,))
                    if cloud:
                        extras[name] = bounds(cloud)
                        assert not extras[name]['clipped'], ('Critical town/noon clip', name)
            row = {'frame': ref, 'time': ref/fps, 'cue': c['key'], 'row': c['row'],
                   'unchangedObjectSourceFrame': ref, 'originalPose': pose, 'pose': fitted_pose,
                   'distanceChanged': fitted_pose[3] != pose[3], 'distanceMultiplier': fitted_pose[3]/pose[3],
                   'originalBounds': original_bounds, 'auxiliaryCriticalBounds': extras,
                   'physicalPrincipalGroups': list(PRIMARY[c['key']]), **bb}
            fitted[ref] = row
            physical.append(row)
        mapping, sources = dependent_mapping(plans, fitted, fps)
        assert mapping and set(mapping).isdisjoint(int(k) for k in cp['replacementFrameToActualPatchFrame'])
        assert all(current(cues, j/fps)['key'] == current(cues, ref/fps)['key']
                   for j, k in mapping.items() for ref in (sources[k],))
        report.update({'physical': physical, 'candidateActualStates': len(candidate_refs),
                       'allCandidateRealPrincipal40to70SafeAndUnclipped': True,
                       'replacementFrameToActualPatchFrame': mapping,
                       'patchFrameToUnchangedObjectSourceFrame': sources,
                       'actualSources': len(sources), 'replacementOutputs': len(mapping),
                       'sameTargetAnglesFovAndAllObjectTimesRetained': True,
                       'evaluatedGeometryAndOriginalThreePointProjectChecks': True,
                       'allHeldDependenciesMapped': True, 'status': 'All actual source states preflight PASS; no pixels rendered yet'})
        write(out/'preflight.json', report)
        if mode == 'render':
            probe = P/'probe/report.json'
            assert approved_probe_sha256 and sha(probe) == approved_probe_sha256, 'Root must approve exact actual probe'
            pp = read(probe)
            assert pp['mode'] == 'probe' and len(pp['actualImages']) == len(PROBE_TIMES)
            assert pp['helperSha256'] == sha(__file__) and pp['physical'] == physical
            assert pp['replacementFrameToActualPatchFrame'] == {str(j): k for j, k in mapping.items()}
            chosen = sorted(sources)
            report['approvedProbeSha256'] = approved_probe_sha256
        else:
            chosen = [round(t*fps) for t in PROBE_TIMES]
            assert all(j in mapping and mapping[j] == j for j in chosen)
        raw = out/'blender/patch'
        raw.mkdir(parents=True)
        names = sorted(read(C/'blender/desk/anchors.json')['anchors'])
        arrays = {name: [[0, 0, 0] for _ in plans] for name in names}
        for j in chosen:
            ref = sources[j]
            points = originals['apply'](ref/fps)
            originals['use_pose'](fitted[ref]['pose'])
            bpy.context.view_layer.update()
            for name in names:
                arrays[name][j] = d.project(points[name]) if name in points else [0, 0, 0]
            target = raw/('%05d.jpg' % j)
            assert target.parent == raw and not os.path.lexists(target)
            scene.render.filepath = str(target)
            bpy.context.window.scene = scene
            bpy.ops.render.render(write_still=True, scene=scene.name)
            runner['jpeg'](str(target))
            actual_images.append({'frame': j, 'time': j/fps, 'path': str(target), 'sha256': sha(target), 'actuallyViewed': False})
        write(raw/'anchors.json', {'fps': fps, 'frames': len(plans), 'anchors': arrays})
        report.update({'actualImages': actual_images, 'raw': str(raw), 'anchors': str(raw/'anchors.json'),
                       'allPatchFramesActuallyRendered': mode == 'render',
                       'status': 'Actual probe rendered, approval pending' if mode == 'probe' else 'Actual local repair rendered; final actual MP4 review required'})
        if mode == 'render':
            cp_phys = {r['frame']: r for r in cp['physical']}
            poses = []
            for j, p in enumerate(plans):
                if j in mapping:
                    pose = fitted[sources[mapping[j]]]['pose']
                elif str(j) in cp['replacementFrameToActualPatchFrame']:
                    pose = cp_phys[cp['replacementFrameToActualPatchFrame'][str(j)]]['pose']
                else:
                    ref = j if p[0] == 'render' else p[1]
                    pose = list(originals['pose_at'](ref/fps))
                poses.append(pose)
            moving = [False] + [poses[j] != poses[j-1] for j in range(1, len(plans))]
            motion = {'frames': len(plans), 'moving_frames': sum(moving), 'moving_ratio': sum(moving)/len(plans),
                      'top_ratio': sum(p[5] >= 65 for p in poses)/len(plans),
                      'method': 'Exact original frozen held-camera poses + inter-site15 actual map + same-site2 distance-only actual map; cuts count as motion'}
            write(out/'blender/camera-motion.json', motion)
            write(out/'blender/delivered-camera-poses.json', {'fps': fps, 'frames': len(plans), 'poses': poses})
            dims = read(CAMERA/'final-held-dimensions.json')
            for s in dims['samples']:
                j = s['frame']
                s['moving'] = moving[j]
                if j in mapping:
                    row = fitted[sources[mapping[j]]]
                    s.update(row)
                    s.update({'frame': j, 'sampleTime': j/fps, 'actualPatchedFrame': mapping[j],
                              'measurementSource': 'actual local same-site distance-only correction'})
            dims.update({'automaticGate7or7bWaived': False, 'actualMp4EyeReviewPending': True,
                         'method': 'Exact delivered camera15+local2 actual physical geometry join, original unchanged measurements elsewhere'})
            write(out/'final-held-dimensions.json', dims)
            report['cameraMotion'] = motion
        return report
    except BaseException as error:
        report.update({'status': 'FAIL before acceptance, original sources and NG retained',
                       'error': {'type': type(error).__name__, 'message': str(error)}})
        raise
    finally:
        scene.render.filepath = paths[scene.name]
        (scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage,
         scene.eevee.taa_render_samples, scene.render.image_settings.file_format, scene.render.image_settings.quality) = settings
        bpy.context.window.scene = old_scene
        checks = {'protectedInputsUnchanged': all(sha(p) == h for p, h in protected.items()),
                  'allOriginalRawInventoryAndSampledBytesUnchanged': inventory(raw_original) == before_original and all(sha(p) == h for p, h in raw_samples.items()),
                  'allEarlierCamera15RawInventoryUnchanged': inventory(cp['raw']) == before_camera,
                  'otherSceneSavePathsAndFilesUnchanged': all(bpy.data.scenes[n].render.filepath == p for n, p in paths.items()) and not runner['verify_saved'](saved),
                  'originalFunctionAndControlBindingsUnchanged': all(g[n] is v for n, v in originals.items()) and all(g[n] is v for n, v in controls.items()),
                  'noModelRebuild': sizes == {n: len(getattr(bpy.data, n)) for n in sizes},
                  'visibilityQueueClosed': g.get('_SHOW_QUEUE') is None}
        report.update({'protectionChecks': checks, 'seconds': time.time()-started})
        write(out/'report.json', report)
        assert all(checks.values()), 'Frozen/raw/other-scene preservation failed'
