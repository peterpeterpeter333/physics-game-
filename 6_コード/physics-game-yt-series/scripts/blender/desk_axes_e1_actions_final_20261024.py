"""Root-only add-only E-1 corrections approved after the full41-row audit.

No model reload or function installation. Keep original r9/15 inter-site/local2
camera poses, voice, captions, source files and every earlier raw image. Only
the explicitly approved hat location, dial direction, miniature continuity,
complete pendulum damping and very slight accident-light tint are derivatives.
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
LOCAL = Path('/private/tmp/ys/ys-chain-e1v1-local-fit-20261024/render')
OUT = Path('/private/tmp/ys/ys-chain-e1v1-actions-final-20261024')
RUNNER = W/'scripts/blender/desk_axes_e1_r9_production.py'
RUNNER_SHA = '5ace957318aedf51261034af2b9bf2949d8c6cd6d2e476afb5e1b6c27103c8ad'
LOCAL_SHA = '1b6bbbe9e3614df7f84a2543eab649aa4dd7d383d04badbba22a666de29c4395'
PROBES = (1.5, 10.2, 14., 113.9, 114.4, 6083/30, 326.9, 327.6)
TINT_AMOUNT = .06
TINT_COLOR = (.72, .83, 1.)
HAT_LEFT_TARGET = 55.


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p):
    return json.loads(Path(p).read_text())


def write(p, value):
    with Path(p).open('x') as f:
        json.dump(value, f, ensure_ascii=False, indent=1, allow_nan=False)
        f.write('\n')


def inventory(folder):
    return {p.name: [p.stat().st_size, str(p.stat().st_mtime_ns), str(p.resolve())]
            for p in sorted(Path(folder).iterdir()) if re.fullmatch(r'\d{5}\.jpg', p.name)}


def current(cues, t):
    return next((c for c in reversed(cues) if c['start'] <= t), cues[0])


def selected_action(cues, t, spin_start, stop_start):
    row = current(cues, t)['row']
    if row <= 6:
        return 'quiet-accident-tint-and-hat-fit'
    if row == 14 and spin_start <= t < spin_start+2:
        return 'dial-follows-globe'
    if row == 23:
        return 'same-miniature-as-row22'
    if row == 36 and t >= stop_start:
        return 'complete-pendulum-stop'
    return None


def run(ns, authorized=False, mode='audit', approved_probe_sha256=None):
    import numpy as np
    assert authorized is True and mode in ('audit', 'probe', 'render'), 'Only root may schedule GUI work'
    dest = OUT/mode
    assert not OUT.is_symlink() and not os.path.lexists(dest), 'Preserve prior action-correction evidence'
    assert sha(RUNNER) == RUNNER_SHA
    assert sha(W/'scripts/blender/desk_axes_e1_local_fit_20261024.py') == LOCAL_SHA
    runner = runpy.run_path(str(RUNNER))
    g = ns['apply'].__globals__
    d, bpy, scene = g['d'], g['bpy'], g['d'].SC
    assert scene.render.engine == 'BLENDER_EEVEE' and scene.camera is d.CAM
    assert Path(g['__file__']) == W/'scripts/blender/desk_e1v1.py'
    assert g['NF'] == 11606 and g['FPS'] == 30 and g['A'].cache == str(C)
    freeze_file = C/'e1v1-r9-source-freeze.json'
    freeze = read(freeze_file)
    completed = read(C/'e1v1-production-r9/completed.json')
    assert completed['status'] == 'render_complete_pending_final_QA' and completed['frames'] == 11606
    cp = read(CAMERA/'camera-patch.json')
    lp = read(LOCAL/'report.json')
    assert cp['allPatchFramesActuallyRendered'] and cp['originalInputsUnchanged']
    assert cp['allOriginal11606RawSizeAndMtimeUnchanged'] and cp['allOriginalFunctionsRetained']
    assert not cp['physicalViolations'] and not cp['auxiliaryFullFrameClips']
    assert lp['mode'] == 'render' and lp['allPatchFramesActuallyRendered']
    assert lp['helperSha256'] == LOCAL_SHA and lp['allCandidateRealPrincipal40to70SafeAndUnclipped']
    assert lp['sameTargetAnglesFovAndAllObjectTimesRetained'] and lp['allHeldDependenciesMapped']
    assert all(lp['protectionChecks'].values())
    assert lp['interSiteCameraPatchSha256'] == sha(CAMERA/'camera-patch.json')
    assert lp['approvedProbeSha256'] == sha(LOCAL.parent/'probe/report.json')
    baseline = read(LOCAL/'blender/delivered-camera-poses.json')['poses']
    assert len(baseline) == 11606 and all(len(p) == 7 and all(math.isfinite(v) for v in p) for p in baseline)
    pg, plans = runner['frozen_plan']()
    assert len(plans) == 11606 and dict(Counter(p[0] for p in plans)) == {'render': 8100, 'dup': 3506}
    assert all(tuple(g['plan'](j)) == tuple(p) for j, p in enumerate(plans))
    refs = [j if p[0] == 'render' else p[1] for j, p in enumerate(plans)]
    cp_phys = {r['frame']: r for r in cp['physical']}
    lp_phys = {r['frame']: r for r in lp['physical']}
    for j, ref in enumerate(refs):
        if str(j) in lp['replacementFrameToActualPatchFrame']:
            k = lp['replacementFrameToActualPatchFrame'][str(j)]
            source = lp['patchFrameToUnchangedObjectSourceFrame'][str(k)]
            expected = lp_phys[source]['pose']
        elif str(j) in cp['replacementFrameToActualPatchFrame']:
            expected = cp_phys[cp['replacementFrameToActualPatchFrame'][str(j)]]['pose']
        else:
            expected = g['pose_at'](ref/30)
        assert all(abs(a-b) <= 1e-9 for a, b in zip(baseline[j], expected)), ('Incorrect delivered camera baseline', j)
    cues, fps = g['CUES'], 30
    spin_start = g['T']('lon:spin', '24時間')
    stop_start = g['T']('pen:judge', '負けた')
    hat_start = g['T']('fog:admiral', 'クラウズリー')
    selected = [j for j in range(11606) if selected_action(cues, j/fps, spin_start, stop_start)]
    assert selected and all(current(cues, j/fps)['key'] == current(cues, refs[j]/fps)['key'] for j in selected)
    previous_maps = [cp['replacementFrameToActualPatchFrame'], lp['replacementFrameToActualPatchFrame']]
    assert all(set(selected).isdisjoint(map(int, mapping)) for mapping in previous_maps), 'Do not erase earlier camera corrections'
    protected = {str(W/p): h for p, h in freeze['files'].items()}
    for p, h in cp['protectedInputSha256'].items():
        protected[p] = h
    for p, h in lp['protectedInputSha256'].items():
        protected[p] = h
    for p in [freeze_file, RUNNER, C/'e1v1-production-r9/completed.json', C/'blender/desk/anchors.json',
              C/'blender/desk/meta.json', CAMERA/'camera-patch.json', LOCAL/'report.json',
              LOCAL/'blender/delivered-camera-poses.json', LOCAL/'final-held-dimensions.json',
              LOCAL/'blender/camera-motion.json', LOCAL.parent/'probe/report.json']:
        protected[str(p)] = sha(p)
    protected[str(C/'ys-chain-e1v1.wav')] = freeze['canonicalVoiceSHA256']
    assert all(sha(p) == h for p, h in protected.items())
    raw_folders = [C/'blender/desk', Path(cp['raw']), Path(lp['raw'])]
    raw_before = {str(p): inventory(p) for p in raw_folders}
    assert len(raw_before[str(raw_folders[0])]) == 11606
    source_hashes = {str(raw_folders[0]/('%05d.jpg' % ref)): sha(raw_folders[0]/('%05d.jpg' % ref))
                     for ref in sorted({refs[j] for j in selected})}
    names = sorted(read(C/'blender/desk/anchors.json')['anchors'])
    bindings = {k: g[k] for k in ('main', 'apply', 'apply_state', 'map_state', 'globe_state', 'ship_state',
                                  'light', 'hands', 'plan', 'pose_at', 'use_pose', 'anchors',
                                  'SPANS', 'EVENTS', 'CAMERAS', 'KEYS')}
    old_scene = bpy.context.window.scene
    paths = {s.name: s.render.filepath for s in bpy.data.scenes}
    saved = {p: runner['stamp'](p) for p in paths.values() if p and os.path.isfile(p)}
    all_light_colors = {light: tuple(light.color) for light in bpy.data.lights}
    own_light_colors = {light: tuple(light.color) for light, _ in d.LIGHTS}
    assert own_light_colors
    settings = (scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage,
                scene.eevee.taa_render_samples, scene.render.image_settings.file_format, scene.render.image_settings.quality)
    sizes = {n: len(getattr(bpy.data, n)) for n in ('objects', 'meshes', 'curves', 'materials', 'lights')}
    hat = g['PARTS']['hat']
    assert abs(hat.location.x-(-.29)) < 1e-7, 'Do not inherit an unreviewed hat location'
    hat_original_x = float(hat.location.x)
    own_transforms = {ob: (ob.location.copy(), ob.scale.copy(), ob.rotation_euler.copy()) for ob in (
        hat, g['dial']['hand'], g['PARTS']['pendulum']['pendulum'], g['globe']['root'], g['globe']['rot'], g['arcs']['root'])}
    report = {'id': 'ys-chain-e1v1', 'kind': 'Five narrowly approved E action/light derivatives on unchanged actual camera15+local2 baseline',
              'mode': mode, 'helperSha256': sha(__file__), 'sourceFreezeSha256': sha(freeze_file),
              'interSiteCameraPatchSha256': sha(CAMERA/'camera-patch.json'), 'localFitReportSha256': sha(LOCAL/'report.json'),
              'protectedInputSha256': protected, 'originalSourceVoiceSubtitlesAndTimesUnchanged': True,
              'originalGateNGPreserved': True, 'originalInspectorModified': False, 'originalRuntimeFunctionsNotRebound': True,
              'cameraPosesUnchangedFromDelivered15Plus2': True, 'noModelRebuild': True,
              'physicalActionDerivativesExplicit': True, 'selectedOutputFrames': len(selected),
              'actions': ['slight-cool-accident-light-only', 'minimum-hat-positive-X-shift', 'dial-same-rotation-as-globe',
                          'row23-miniature-retained', 'all-pendulum-axes-stop-in1second'],
              'row23Principal': 'Complete ship, London clock carried on deck, and high-noon sun; miniature globe is separately critical, never background-width inflation.',
              'existingAnchorLimitation': 'Original globe anchor is fixed gc, not the row23 miniature center. No row23 overlay uses that anchor; its old values are not represented as the miniature center.',
              'tint': {'amount': TINT_AMOUNT, 'towardLinearRGB': TINT_COLOR, 'rows': [1, 2, 3, 4, 5, 6],
                       'lightPositionEnergyMaterialsAndQuietMixUnchanged': True},
              'earListeningPerformed': False, 'actualEyeReviewRequired': True, 'finalPassed': False,
              'actualImages': [], 'status': 'Source-state preflight started'}
    started = time.time()
    projection_error = 0.
    local_cache = {}
    hat_dx = 0.
    try:
        bpy.context.window.scene = scene
        scene.render.resolution_x, scene.render.resolution_y = 1080, 1920
        scene.render.resolution_percentage = 100
        scene.eevee.taa_render_samples = 16
        scene.render.image_settings.file_format = 'JPEG'
        scene.render.image_settings.quality = 95

        def world_points(objects):
            deps = bpy.context.evaluated_depsgraph_get()
            parts = []
            for ob in dict.fromkeys(objects):
                if ob.hide_render or ob.type not in ('MESH', 'CURVE', 'FONT'):
                    continue
                cacheable = ob.type == 'MESH' and not ob.data.shape_keys
                if cacheable and ob in local_cache:
                    vv = local_cache[ob]
                else:
                    evaluated = ob.evaluated_get(deps)
                    mesh = evaluated.to_mesh()
                    if mesh is None:
                        continue
                    try:
                        v = np.empty(len(mesh.vertices)*3, dtype=np.float64)
                        mesh.vertices.foreach_get('co', v)
                        vv = np.column_stack((v.reshape(-1, 3), np.ones(len(mesh.vertices))))
                    finally:
                        evaluated.to_mesh_clear()
                    if cacheable:
                        local_cache[ob] = vv
                if len(vv):
                    parts.append(vv @ np.asarray(ob.matrix_world, dtype=np.float64).T)
            assert parts, 'No visible actual role geometry'
            return np.concatenate(parts)

        def project(vv):
            nonlocal projection_error
            deps = bpy.context.evaluated_depsgraph_get()
            matrix = d.CAM.calc_matrix_camera(deps, x=1080, y=1920, scale_x=1, scale_y=1) @ d.CAM.matrix_world.inverted()
            q = vv @ np.asarray(matrix, dtype=np.float64).T
            assert np.isfinite(q).all() and (q[:, 3] > 0).all()
            xy = np.column_stack(((q[:, 0]/q[:, 3]+1)*540, (1-q[:, 1]/q[:, 3])*960))
            for i in {0, len(vv)//2, len(vv)-1}:
                old = d.project(g['Vector'](vv[i, :3]))
                delta = max(abs(old[0]-xy[i, 0]), abs(old[1]-xy[i, 1]))
                projection_error = max(projection_error, float(delta))
                assert delta <= .11, ('Original projection disagreement', delta)
            b = [float(xy[:, 0].min()), float(xy[:, 1].min()), float(xy[:, 0].max()), float(xy[:, 1].max())]
            return {'box': b, 'widthRatio': (b[2]-b[0])/1080,
                    'clipped': b[0] < 0 or b[1] < 0 or b[2] > 1080 or b[3] > 1920,
                    'outsidePrincipalSafeArea': b[0] < 40 or b[1] < 110 or b[2] > 1040 or b[3] > 1550,
                    'evaluatedVertices': len(vv)}

        def original_state(j):
            # Close our own state transaction BEFORE original apply, so no
            # tinted light or moved hat leaks to an unrelated original cue.
            hat.location.x = hat_original_x
            for ld, color in own_light_colors.items():
                ld.color = color
            points = bindings['apply'](refs[j]/fps)
            bindings['use_pose'](baseline[j])
            bpy.context.view_layer.update()
            return points

        # Solve one minimum translation from the union of every actual raised
        # hat pose. It does not change the chart camera or inflate its principal.
        hat_frames = [j for j in selected if hat_start <= j/fps <= hat_start+.9]
        assert hat_frames
        clouds = []
        for j in hat_frames:
            original_state(j)
            if not hat.hide_render:
                clouds.append(world_points(g['GROUPS']['hat']))
        assert clouds
        hat_union = np.unique(np.concatenate(clouds), axis=0)
        representative = hat_frames[-1]
        original_state(representative)
        before_hat = project(hat_union)
        for _ in range(8):
            shifted = hat_union.copy()
            shifted[:, 0] += hat_dx
            b = project(shifted)['box']
            if abs(b[0]-HAT_LEFT_TARGET) < .01:
                break
            trial = shifted.copy()
            trial[:, 0] += .001
            derivative = (project(trial)['box'][0]-b[0])/.001
            assert derivative > 1
            hat_dx += (HAT_LEFT_TARGET-b[0])/derivative
        assert 0 < hat_dx < .10
        shifted = hat_union.copy()
        shifted[:, 0] += hat_dx
        after_hat = project(shifted)
        report['hatFit'] = {'originalX': hat_original_x, 'newX': hat_original_x+hat_dx,
                            'translationX': hat_dx, 'allRaisedFramesInUnion': hat_frames,
                            'leftTargetPixels': HAT_LEFT_TARGET, 'before': before_hat, 'after': after_hat,
                            'chartCameraUnchanged': True}
        assert not after_hat['clipped'] and not after_hat['outsidePrincipalSafeArea']

        def stage_values(j):
            t = j/fps
            action = selected_action(cues, t, spin_start, stop_start)
            if action == 'dial-follows-globe':
                return (2*math.pi*d.seg(t, spin_start, spin_start+2),)
            if action == 'complete-pendulum-stop':
                return (1-d.seg(t, stop_start, stop_start+1),)
            return ()

        mapping, sources, unique = {}, {}, {}
        for j in selected:
            signature = (refs[j], tuple(baseline[j]), selected_action(cues, j/fps, spin_start, stop_start), stage_values(j))
            k = unique.setdefault(signature, j)
            mapping[j], sources[k] = k, refs[j]
        assert all(refs[j] == sources[k] for j, k in mapping.items())

        def state(j):
            t = j/fps
            points = original_state(j)
            action = selected_action(cues, t, spin_start, stop_start)
            assert action
            unchanged_fleet = None
            if action == 'quiet-accident-tint-and-hat-fit':
                unchanged_fleet = [tuple(v for row in s['root'].matrix_world for v in row) for s in g['PARTS']['fleet']]
                for ld, original in own_light_colors.items():
                    ld.color = tuple((1-TINT_AMOUNT)*v+TINT_AMOUNT*b for v, b in zip(original, TINT_COLOR))
                if t >= hat_start:
                    hat.location.x = hat_original_x+hat_dx
            elif action == 'dial-follows-globe':
                # Endpoints outside this interval are physically equivalent
                # modulo2pi in original raw. Every intermediate here is real.
                g['dial']['hand'].rotation_euler.z = g['globe']['rot'].rotation_euler.z
            elif action == 'same-miniature-as-row22':
                g['visible']('globe', 'arcs')
                g['globe']['root'].location = (.365, .005, .06)
                g['globe']['root'].scale = (.32,)*3
                g['globe']['rot'].rotation_euler.z = 0
                g['arcs']['root'].location = (.365, .005, .06+.19*.32)
                g['arcs']['root'].scale = (.32,)*3
                for ob in [g['arcs']['arc'], g['arcs']['east'], g['arcs']['eastpin'], g['arcs']['pins'][1]]:
                    d.show(ob, False)
                d.show(g['arcs']['west'], True)
                d.show(g['arcs']['westpin'], True)
            elif action == 'complete-pendulum-stop':
                p = g['PARTS']['pendulum']['pendulum']
                damping = 1-d.seg(t, stop_start, stop_start+1)
                p.rotation_euler.x *= damping
                p.rotation_euler.z *= damping
            bpy.context.view_layer.update()
            if unchanged_fleet is not None:
                assert unchanged_fleet == [tuple(v for row in s['root'].matrix_world for v in row) for s in g['PARTS']['fleet']]
            if action == 'dial-follows-globe':
                assert abs(g['dial']['hand'].rotation_euler.z-g['globe']['rot'].rotation_euler.z) < 1e-8
            if action == 'complete-pendulum-stop' and t >= stop_start+1:
                assert max(abs(v) for v in g['PARTS']['pendulum']['pendulum'].rotation_euler) < 1e-9
            return points

        def primary(j):
            row = current(cues, j/fps)['row']
            groups = ('chart',) if row <= 6 else ('globe', 'dial') if row == 14 else ('ship', 'shipclock', 'sun') if row == 23 else ('ship', 'pendulum')
            return [ob for group in groups for ob in g['GROUPS'][group]], groups

        physical, violations = [], []
        report['physical'], report['physicalViolations'] = physical, violations
        for j in sorted(sources):
            state(j)
            c = current(cues, j/fps)
            objects, groups = primary(j)
            measured = project(world_points(objects))
            auxiliary, role_failures = {}, []
            within = .4 <= measured['widthRatio'] <= .7
            if not within or measured['clipped'] or measured['outsidePrincipalSafeArea']:
                role_failures.append('complete-real-principal-width-or-safe-clip')
            if c['row'] <= 6 and not hat.hide_render:
                auxiliary['hat'] = project(world_points(g['GROUPS']['hat']))
                if auxiliary['hat']['clipped'] or auxiliary['hat']['outsidePrincipalSafeArea']:
                    role_failures.append('active-hat-safe-clip')
            if c['row'] == 23:
                auxiliary['miniatureGlobeAndWest15'] = project(world_points(g['GROUPS']['globe']+g['GROUPS']['arcs']))
                auxiliary['LondonClockOnDeck'] = project(world_points(g['GROUPS']['shipclock']))
                auxiliary['highNoonSun'] = project(world_points(g['GROUPS']['sun']))
                for name, bounds in auxiliary.items():
                    if bounds['clipped']:
                        role_failures.append('row23-critical-'+name+'-clip')
            row = {'frame': j, 'time': j/fps, 'cue': c['key'], 'row': c['row'],
                   'unchangedOtherObjectSourceFrame': sources[j], 'operationTime': j/fps,
                   'action': selected_action(cues, j/fps, spin_start, stop_start), 'stageValues': list(stage_values(j)),
                   'pose': baseline[j], 'physicalPrincipalGroups': list(groups), 'auxiliaryCriticalBounds': auxiliary,
                   'within40to70': within, 'evaluatedGeometry': True, 'allPrincipalAndCriticalGuardsPass': not role_failures,
                   'roleFailures': role_failures, **measured}
            if c['row'] == 14:
                row['globeAndHandAngles'] = [g['globe']['rot'].rotation_euler.z, g['dial']['hand'].rotation_euler.z]
            if c['row'] == 36:
                row['pendulumRotationXYZ'] = list(g['PARTS']['pendulum']['pendulum'].rotation_euler)
            physical.append(row)
            if role_failures:
                violations.append(row)
        assert not violations, 'Actual principal/critical role preflight NG; no pixels rendered. Numerical rows are retained in report.'
        report.update({'physical': physical, 'allGuardedStatesPass': True, 'projectionMaxDifferencePixels': projection_error,
                       'replacementFrameToActualPatchFrame': mapping, 'patchFrameToUnchangedOtherObjectSourceFrame': sources,
                       'actualSources': len(sources), 'replacementOutputs': len(mapping), 'allHeldDependenciesMapped': True,
                       'allPrevious15Plus2PatchesRetainedDisjoint': True,
                       'geometryMethod': 'All visible evaluated principal/critical vertices, camera-matrix bulk projection independently compared with original d.project at3 real vertices per call within0.11px. No pixel/occlusion approval claim.'})
        dest.mkdir(parents=True)
        write(dest/'preflight.json', report)
        if mode == 'audit':
            report.update({'status': 'Numerical/action audit complete; no pixels rendered', 'allPatchFramesActuallyRendered': False})
            return report
        if mode == 'render':
            probe_file = OUT/'probe/report.json'
            assert approved_probe_sha256 and sha(probe_file) == approved_probe_sha256
            probe = read(probe_file)
            assert probe['mode'] == 'probe' and probe['helperSha256'] == sha(__file__)
            assert probe['allGuardedStatesPass'] and len(probe['actualImages']) == len(PROBES)
            assert probe['physical'] == physical and probe['replacementFrameToActualPatchFrame'] == {str(j): k for j, k in mapping.items()}
            wanted = sorted(sources)
            report['approvedProbeSha256'] = approved_probe_sha256
        else:
            wanted = [round(t*fps) for t in PROBES]
            assert all(j in sources and mapping[j] == j for j in wanted), 'Probe must refer to an actual new source'
        raw = dest/'blender/patch'
        raw.mkdir(parents=True)
        arrays = {name: [[0., 0., 0.] for _ in plans] for name in names}
        for j in wanted:
            points = state(j)
            for name in names:
                arrays[name][j] = d.project(points[name]) if name in points else [0., 0., 0.]
            target = raw/('%05d.jpg' % j)
            assert not os.path.lexists(target) and target.parent == raw
            scene.render.filepath = str(target)
            bpy.context.window.scene = scene
            bpy.ops.render.render(write_still=True, scene=scene.name)
            runner['jpeg'](str(target))
            report['actualImages'].append({'frame': j, 'time': j/fps, 'path': str(target), 'sha256': sha(target), 'actuallyViewed': False})
        write(raw/'anchors.json', {'fps': fps, 'frames': len(plans), 'anchors': arrays})
        report.update({'raw': str(raw), 'anchors': str(raw/'anchors.json'), 'allPatchFramesActuallyRendered': mode == 'render',
                       'status': 'Actual8 probes rendered, approval pending' if mode == 'probe' else 'Actual action derivatives rendered; final actual MP4 eyes/checks pending'})
        return report
    except BaseException as error:
        report.update({'status': 'FAIL; original source/raw/NG preserved, no acceptance', 'error': {'type': type(error).__name__, 'message': str(error)}})
        raise
    finally:
        for ld, color in all_light_colors.items():
            ld.color = color
        for ob, (loc, scale, rotation) in own_transforms.items():
            ob.location = loc
            ob.scale = scale
            ob.rotation_euler = rotation
        scene.render.filepath = paths[scene.name]
        (scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage,
         scene.eevee.taa_render_samples, scene.render.image_settings.file_format, scene.render.image_settings.quality) = settings
        bpy.context.window.scene = old_scene
        checks = {'protectedInputsUnchanged': all(sha(p) == h for p, h in protected.items()),
                  'allEarlierRawInventoriesUnchanged': all(inventory(p) == v for p, v in raw_before.items()),
                  'allSelectedOriginalRawBytesUnchanged': all(sha(p) == h for p, h in source_hashes.items()),
                  'otherSceneSavePathsAndFilesUnchanged': all(bpy.data.scenes[n].render.filepath == p for n, p in paths.items()) and not runner['verify_saved'](saved),
                  'allSceneLightColorsRestored': all(tuple(ld.color) == color for ld, color in all_light_colors.items()),
                  'originalRuntimeFunctionAndControlBindingsUnchanged': all(g[n] is v for n, v in bindings.items()),
                  'noModelRebuild': sizes == {n: len(getattr(bpy.data, n)) for n in sizes},
                  'visibilityQueueClosed': g.get('_SHOW_QUEUE') is None}
        report.update({'protectionChecks': checks, 'originalRawInventoryBefore': raw_before[str(raw_folders[0])], 'seconds': time.time()-started})
        dest.mkdir(parents=True, exist_ok=True)
        write(dest/'report.json', report)
        assert all(checks.values()), 'Action correction preservation failure'
