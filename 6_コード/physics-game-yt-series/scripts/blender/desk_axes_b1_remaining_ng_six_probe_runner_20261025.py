"""Inert root-dispatched B-1 camera-only six-still experiment.

No call is made at import.  run(audit) renders nothing.  run(probe) requires
the fresh audit SHA and renders six exact-state controls plus six variants.
All output is under a NEW private cache.  There is no production/encode mode.
The old inspection failures are observations, never waived or reclassified.
"""
import ast
import hashlib
import json
import math
import os
from pathlib import Path
import runpy
import time
import types

import numpy as np

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025')
OUT = Path('/private/tmp/ys/ys-chain-b1v1-original-ng-camera-six-probe-20261025')
DESIGN = W/'scripts/blender/desk_axes_b1_remaining_ng_probe_design_20261025.py'
B7 = W/'scripts/blender/desk_axes_b1_sixth_needle_carry_b7_20261025.py'
B5 = W/'scripts/blender/desk_axes_b1_repel_b5_v4_20261024.py'
TOOLS = W/'scripts/blender/desk_axes_b1_b7_namespace_diagnostic_v2_20261025.py'
RUNTIME = W/'outputs/axes-20261023/b1-b7-runtime-namespace-diagnostic-v2-20261025.json'
B6_REPORT = Path('/private/tmp/ys/ys-chain-b1v1-integrated-b6-v6-owned-resume-v2-20261025/render/report.json')
B3_REPORT = Path('/private/tmp/ys/ys-chain-b1v1-score-entries-d1-v2-20261024/render/report.json')
B7_REPORT = Path('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-frozen-control-cases-20261025/probe/report.json')
PINS = {
    C/'prepared.json': '93b4f6ee2d603eef8771235cb3a051b1a817be9e86565df49b0ae2281c1bc412',
    C/'composite-provenance.json': 'c13cfdb83c0513ac28bfc4345be8a57bbb979b4301130339cbe4c647e4952135',
    C/'blender/delivered-camera-poses.json': 'aa4106563b81e8afc8d33c4eb1d19d58ace2e0b706330409bb48ed1a070d883f',
    C/'final-held-dimensions.json': 'f4274745b4eabc3731c4f331c1bc99f7704e89ebd2fa804284557daac3b0bdd5',
    C/'validation-final-v1/quality-gate.json': 'da15cd05bed4cebfa3ad922a96b20d822742726718467d7be56e1a8b03b23653',
    DESIGN: '1b22aab4d54f93537fa43f80de65a8f89f2d883224a8e733f1a95918c6026d5f',
    B7: 'd1736e949348256273198cc181bfc2abe42125f9b8139b8bb466867dc8bc1e54',
    B5: '02c64b5916c754b08b67c5a46330d11a0ca58323ca2f67844a70d4175a9b65d3',
    TOOLS: '98e11823b952c024d7769e678ced48a1274fa198ab94379b13971f536b4abcb0',
    RUNTIME: '69c657e35b6f6c1c121d927b6094eb3aa01f2c7db8bbe917433552296863f3e1',
    B6_REPORT: '35d9671336facc781ee51d2f93d0a611be02f565dae8829e9c6d8bb6455ad956',
    B3_REPORT: 'dcccf2cfa6162b40e6d063b6a0261d8df2bcb7e37f7f1fef208e5577fdcedba6',
    B7_REPORT: '97bba60da3dd2a7c0d6bb56205e00553b49cc3119c79d11a6c831e090f6745a4',
}
FRAMES = (2550, 2820, 4110, 4650, 6690, 9900)
B7_AUDIT_ONLY = (4125, 4140)
TOL = 1e-9


def sha(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def read(path):
    return json.loads(Path(path).read_text())


def verify(pins):
    for path, expected in pins.items():
        assert sha(path) == expected, ('Protected input changed', str(path))


def write_new(path, value):
    path = Path(path)
    assert path.is_relative_to(OUT) and not os.path.lexists(path)
    assert not any(p.is_symlink() for p in path.parents if p.exists())
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('x') as stream:
        json.dump(value, stream, ensure_ascii=False, indent=1, allow_nan=False)
        stream.write('\n')


def runtime_api(ns):
    """Pin actual mixed code, without importing/rebinding episode functions.

    Object/Python IDs from the old process are not claimed after a restart.
    Exact function code descriptions are still required.  The guarded apply
    is unwrapped for inspection ONLY and is always called through its guard.
    """
    verify(PINS)
    tools = runpy.run_path(str(TOOLS))
    frozen = read(RUNTIME)
    g = ns['main'].__globals__
    assert Path(g['__file__']) == W/'scripts/blender/desk_b1v1.py'
    assert g['VIS_QUEUE'] is None and g['CHECK_VISIBILITY'] is False
    wrapper = g['apply']
    assert isinstance(wrapper, types.FunctionType) and getattr(wrapper, '_axes_guarded', False)
    cells = dict(zip(wrapper.__code__.co_freevars,
                     (cell.cell_contents for cell in wrapper.__closure__ or ())))
    assert set(cells) == {'original'}
    original = cells['original']
    assert original.__globals__ is g and ns['apply'] is original
    assert tools['description'](wrapper.__code__) == frozen['exactCancellationWrapper']
    for row in frozen['runtimeFunctions']:
        fn = original if row['name'] == 'apply' else g[row['name']]
        assert fn.__globals__ is g
        assert tools['description'](fn.__code__) == row['runtimeCode'], ('Actual code differs', row['name'])
    assert g['main'] is ns['main'] and g['pose_b1'].__globals__ is g
    d = g['d']
    assert d.pose_cam.__globals__['SC'] is d.SC
    assert d.pose_cam.__globals__['CAM'] is d.CAM
    assert d.pose_cam.__globals__['CAM_D'] is d.CAM_D
    assert all(ob.name in d.SC.objects for ob in g['ALL'])
    assert all(hand.name in d.SC.objects for hand in d.HANDS.values())
    for row in frozen['modelObjectIdentity']:
        assert ns[row['key']] is g[row['key']], ('Snapshot/model mismatch', row['key'])
    retained = read('/private/tmp/ys/ys-chain-b1v1-retained-plan-20261024.json')['plans']
    assert all(list(g['plan'](j)) == row for j, row in enumerate(retained))
    return g, tools


def select_namespace(session):
    failures = []
    for name in ('nsB1r6', 'nsB1'):
        ns = session.get(name)
        if not isinstance(ns, dict) or 'main' not in ns:
            continue
        try:
            runtime_api(ns)
            return name, ns
        except Exception as error:
            failures.append((name, type(error).__name__, str(error)))
    raise AssertionError(('No exact B-1 mixed-runtime namespace; never silently reload', failures))


def jpeg_tables(path):
    data = Path(path).read_bytes()
    assert data[:2] == b'\xff\xd8'
    at, tables = 2, []
    while at < len(data):
        assert data[at] == 255
        at += 1
        while data[at] == 255:
            at += 1
        marker = data[at]
        at += 1
        if marker in (0xda, 0xd9):
            break
        size = int.from_bytes(data[at:at + 2], 'big')
        if marker == 0xdb:
            tables.append(data[at + 2:at + size])
        at += size
    return hashlib.sha256(b''.join(tables)).hexdigest()


def run(ns, authorized=False, mode='audit', *, expected_helper_sha256,
        approved_audit_sha256=None, namespace_name=None):
    assert authorized is True and mode in ('audit', 'probe')
    assert sha(__file__) == expected_helper_sha256
    assert not OUT.is_symlink() and not os.path.lexists(OUT/mode)
    if mode == 'probe':
        assert approved_audit_sha256 and sha(OUT/'audit/report.json') == approved_audit_sha256
        audit = read(OUT/'audit/report.json')
        assert audit['allGuardedStatesPass'] and not audit.get('error')
        assert all(v is True for v in audit['protectionChecks'].values())
    verify(PINS)
    prepared, provenance = read(C/'prepared.json'), read(C/'composite-provenance.json')
    poses = read(C/'blender/delivered-camera-poses.json')['poses']
    dims = {r['frame']: r for r in read(C/'final-held-dimensions.json')['samples']}
    b6 = read(B6_REPORT)
    b7_rows = {r['frame']: r for r in read(B7_REPORT)['physical']}
    design, legacy = runpy.run_path(str(DESIGN)), runpy.run_path(str(B7))
    cases = design['CASES']
    assert tuple(c['frame'] for c in cases) == FRAMES
    g, tools = runtime_api(ns)
    d, bpy = g['d'], g['bpy']
    scene = d.SC
    assert scene.render.engine == 'BLENDER_EEVEE' and scene.camera is d.CAM
    assert scene.view_settings.view_transform == 'Standard' and scene.view_settings.look == 'None'
    protected = {str(p): h for p, h in PINS.items()}
    protected.update(prepared['protectedInputSha256'])
    protected.update({str(C/p): h for p, h in prepared['outputHashes'].items()})
    protected[str(Path(__file__).resolve())] = expected_helper_sha256
    if approved_audit_sha256:
        protected[str(OUT/'audit/report.json')] = approved_audit_sha256
    source_hashes, records = {}, {}
    for j in (*FRAMES, *B7_AUDIT_ONLY):
        row = provenance['records'][j]
        assert row['frame'] == j and (C/'blender/desk'/f'{j:05d}.jpg').resolve() == Path(row['source']).resolve()
        source_hashes[row['source']] = row['sha256']
        protected[row['source']] = row['sha256']
        records[j] = row
    verify(protected)
    raw_inventory = legacy['inventory'](C/'blender/desk')
    bindings, snapshot_bindings = tools['bindings'](g), tools['bindings'](ns)
    oldscene, oldlayer = bpy.context.window.scene, bpy.context.window.view_layer
    bpy.context.window.scene = scene
    bpy.context.view_layer.update()
    try:
        tx = legacy['SceneTransaction'](g, oldscene, oldlayer)
    except BaseException:
        bpy.context.window.scene = oldscene
        bpy.context.window.view_layer = oldlayer
        bpy.context.view_layer.update()
        raise
    started = time.time()
    report = dict(episode='B-1', mode=mode, helperSha256=expected_helper_sha256,
                  namespace=namespace_name, baseCache=str(C), frames=list(FRAMES),
                  allGuardedStatesPass=False, actualImages=[], physical=[], b7AuditOnly=[],
                  runtimeCodeMatchesFrozenEvidence=True, historicalProcessIdentityClaimed=False,
                  originalThresholdsAndNGUnchanged=True, finalAcceptance=False,
                  actualImageReviewPending=True, earsVerified=False)
    target = OUT/mode
    try:
        target.mkdir(parents=True)
        if mode == 'probe':
            (target/'control-raw').mkdir()
            (target/'raw').mkdir()
        scene.render.resolution_x = 1080
        scene.render.resolution_y = 1920
        scene.render.resolution_percentage = 100
        scene.render.image_settings.file_format = 'JPEG'
        scene.eevee.taa_render_samples = 16

        def tree(root):
            return [root] + [v for child in g['CHILDREN'].get(root, ()) for v in tree(child)]

        def world_points(objects):
            clouds = []
            deps = bpy.context.evaluated_depsgraph_get()
            for ob in dict.fromkeys(objects):
                if ob.hide_render or ob.type not in ('MESH', 'FONT', 'CURVE'):
                    continue
                evaluated = ob.evaluated_get(deps)
                mesh = evaluated.to_mesh()
                try:
                    if mesh is None:
                        continue
                    vv = np.empty(len(mesh.vertices)*3, dtype=np.float64)
                    mesh.vertices.foreach_get('co', vv)
                    vv = np.column_stack((vv.reshape(-1, 3), np.ones(len(mesh.vertices))))
                finally:
                    evaluated.to_mesh_clear()
                if len(vv):
                    clouds.append(vv @ np.asarray(ob.matrix_world, dtype=np.float64).T)
            assert clouds
            return np.concatenate(clouds)

        # Extract the two exact old B5 functions; do not invoke old run/render.
        b5_scope = runpy.run_path(str(B5))
        outer = next(n for n in ast.parse(B5.read_text()).body if isinstance(n, ast.FunctionDef) and n.name == 'run')
        block = next(n for n in outer.body if isinstance(n, ast.Try))
        defs = [n for n in block.body if isinstance(n, ast.FunctionDef) and n.name in ('stages', 'place')]
        assert len(defs) == 2
        phase = {**b5_scope, 'g': g, 'd': d, 'bpy': bpy, 'original_apply': g['apply'],
                 'world_points': world_points, 'tree': tree}
        exec(compile(ast.Module(body=defs, type_ignores=[]), str(B5), 'exec'), phase)

        def reconstruct(j):
            record = records[j]
            ref = record['originalObjectSourceFrame']
            assert isinstance(ref, int)
            if record['kind'] == 'actual-integrated-B6-derivative':
                actual = record['actualPatchFrame']
                assert isinstance(actual, int) and ref == int(b6['patchFrameToUnchangedObjectSourceFrame'][str(actual)])
                key = g['cue_at'](actual/30)['key']
                assert key in ('rule:first', 'rule:pull')
                aa = phase['place'](ref, actual/30) if key == 'rule:pull' else g['apply'](ref/30)
                # Exact B6 v6 retirement: sideways first, then backward.
                u = g['u'](actual/30, b6['retire']['start'], .8)
                delta = g['Vector']((.10*min(1, u/.35), .30*max(0, (u-.35)/.65), 0))
                garlic = g['PARTS']['garlic']
                for ob in tree(garlic['root']):
                    ob.hide_render = False
                    ob.hide_viewport = False
                garlic['root'].location = g['BASE'][garlic['root']][0] + delta
                for nail in garlic['nails']:
                    for ob in tree(nail):
                        ob.hide_render = False
                        ob.hide_viewport = False
                    nail.location = g['BASE'][nail][0] + g['Vector']((0, -.04, 0)) + delta
                operation = actual/30
            else:
                aa = g['apply'](ref/30)
                operation = None
            if j in B7_AUDIT_ONLY:
                assert record['kind'] == 'actual-B7-sixth-needle-and-kai-hand-carry-only'
                a6 = g['PARTS']['terrella']['needles'][5][0]
                a6.location.z += .025*(1-g['u'](j/30, 137.35, .25))
                tip = a6.location.copy()
                if j/30 >= 137.60:
                    tip += g['Vector']((.06, 0, .08))*g['u'](j/30, 137.60, .4)
                d.set_hand('kai', tip, yaw=150, pitch=-25, vis=True)
                operation = j/30
            g['pose_b1'](poses[j])
            bpy.context.view_layer.update()
            return aa, ref, operation

        def render(path, j, kind, quality):
            assert mode == 'probe' and path.parent in (target/'raw', target/'control-raw')
            assert not os.path.lexists(path)
            scene.render.image_settings.quality = quality
            scene.render.filepath = str(path)
            bpy.ops.render.render(write_still=True, scene=scene.name)
            assert path.is_file() and not path.is_symlink() and path.stat().st_size > 1000
            assert jpeg_tables(path) == jpeg_tables(records[j]['source']), 'Actual source JPEG quantization must match'
            report['actualImages'].append(dict(frame=j, kind=kind, path=str(path), sha256=sha(path),
                                               quality=quality, source=records[j]['source'],
                                               sourceSha256=records[j]['sha256'],
                                               historicalJpegByteEqual=sha(path) == records[j]['sha256'],
                                               actuallyViewed=False))
            print('B1 original-NG camera experiment', kind, j, flush=True)

        # Independently preserve the already fixed sixth-needle boundary.
        for j in B7_AUDIT_ONLY:
            reconstruct(j)
            old = b7_rows[j]
            a6 = g['PARTS']['terrella']['needles'][5][0]
            assert legacy['maxdelta'](tuple(a6.location), old['sixthNeedleLocation']) <= TOL
            hand_now = legacy['transform'](d.HANDS['kai'])
            hand_expected = old['explicitChanges']['actualKaiHand']
            for key, value in hand_now.items():
                good = legacy['maxdelta'](value, hand_expected[key]) <= TOL if isinstance(value, tuple) else value == hand_expected[key]
                assert good, ('B7 hand reconstruction differs', j, key)
            rock_hash = hashlib.sha256(world_points([g['PARTS']['terrella']['rock']]).tobytes()).hexdigest()
            assert rock_hash == old['explicitChanges']['principalRockActualWorldVerticesSha256']
            report['b7AuditOnly'].append(dict(frame=j, sourceSha256=records[j]['sha256'],
                                              sixthNeedleAndHandExactlyPreserved=True,
                                              principalRockWorldVerticesSha256=rock_hash,
                                              rendered=False))

        for case in cases:
            j = case['frame']
            aa, ref, operation = reconstruct(j)
            points = design['_world_points'](g, design['_principal_objects'](g, case))
            baseline_box = design['_box'](g, points)
            expected = dims[j]['box']
            assert max(abs(a-b) for a, b in zip(baseline_box, expected)) <= .11, ('Actual source reconstruction differs', j, baseline_box, expected)
            before = {ob: legacy['transform'](ob) for ob in scene.objects if ob is not d.CAM}
            quality = 95 if records[j]['kind'] == 'actual-integrated-B6-derivative' else 92
            if mode == 'probe':
                render(target/'control-raw'/f'{j:05d}.jpg', j, 'current-state-control', quality)
            fit = design['fit_probe_camera'](g, case, poses[j])
            offenders = []
            for ob, old in before.items():
                now = legacy['transform'](ob)
                for key, value in old.items():
                    after = now[key]
                    good = legacy['maxdelta'](value, after) <= TOL if isinstance(value, tuple) else value == after
                    if not good:
                        offenders.append((ob.name, key))
            assert not offenders, ('Camera-only variant changed an object', j, offenders)
            required = g['GROUPS']['terrella'] if case['principal'] == 'rock' else g['GROUPS']['globe'] if case['principal'] == 'cutaway' else g['GROUPS']['magnets']
            if case['row'] == 37:
                required = required + g['GROUPS']['mysterybox']
            secondary_points = design['_world_points'](g, required)
            secondary_box = design['_box'](g, secondary_points)
            assert secondary_box[0] >= 0 and secondary_box[2] <= 1080
            assert secondary_box[1] >= 110 and secondary_box[3] <= 1600, ('Required explanatory geometry clipped', j, secondary_box)
            fingertip_projected = None
            if not d.HANDS['kai'].hide_render and case['row'] == 18:
                hand = d.HANDS['kai']
                fingertip = hand.location + hand.rotation_euler.to_matrix() @ d.TIP
                fingertip_projected = d.project(fingertip)
                assert fingertip_projected[2] and 0 <= fingertip_projected[0] <= 1080 and 110 <= fingertip_projected[1] <= 1600
            projected = {name: d.project(v) for name, v in aa.items()}
            row = dict(frame=j, exactOtherObjectReference=ref, exactB6OperationTime=operation,
                       source=records[j]['source'], sourceSha256=records[j]['sha256'],
                       baselinePhysicalBox=baseline_box, historicalPhysicalBox=expected,
                       fit=fit, anchorProjections=projected,
                       requiredVisibleGeometryBox=secondary_box,
                       placementFingertipProjection=fingertip_projected,
                       objectChannelsUnchanged=True, objectChannelTolerance=1e-9,
                       actualCompositeCaptionCollisionReviewPending=True)
            report['physical'].append(row)
            if mode == 'probe':
                expected_audit = next(r for r in audit['physical'] if r['frame'] == j)
                assert row == expected_audit, ('Probe differs from exact zero-render audit', j)
                render(target/'raw'/f'{j:05d}.jpg', j, 'camera-only-variant', quality)
        report['allGuardedStatesPass'] = True
        report['actualRenderCount'] = len(report['actualImages'])
        report['allSixVariantImagesRendered'] = mode == 'probe' and len(report['actualImages']) == 12
        assert mode == 'audit' or report['allSixVariantImagesRendered']
        return report
    except BaseException as error:
        report['error'] = dict(type=type(error).__name__, message=str(error))
        raise
    finally:
        cleanup_error, checks, offenders = None, {}, []
        try:
            checks, offenders = tx.close()
        except BaseException as error:
            cleanup_error = dict(type=type(error).__name__, message=str(error))
        finally:
            bpy.context.window.scene = oldscene
            bpy.context.window.view_layer = oldlayer
            bpy.context.view_layer.update()
        checks.update(
            allProtectedInputSHAUnchanged=all(sha(p) == h for p, h in protected.items()),
            all10700Final5RawStatsAndResolvedPathsUnchanged=legacy['inventory'](C/'blender/desk') == raw_inventory,
            allEightActualSourceJpegSHAUnchanged=all(sha(p) == h for p, h in source_hashes.items()),
            allRuntimeAndSnapshotBindingsUnchanged=tools['bindings'](g) == bindings and tools['bindings'](ns) == snapshot_bindings,
            contextRestoredEvenOnFailure=bpy.context.window.scene is oldscene and bpy.context.window.view_layer is oldlayer)
        report.update(protectionChecks=checks, restorationOffenders=offenders,
                      cleanupError=cleanup_error, protectedInputSha256=protected,
                      seconds=round(time.time()-started, 3), productionOrEncodeInvoked=False)
        write_new(target/'report.json', report)
        assert not cleanup_error and not offenders and checks and all(checks.values()), ('Strict restoration failed', checks, cleanup_error, offenders)
