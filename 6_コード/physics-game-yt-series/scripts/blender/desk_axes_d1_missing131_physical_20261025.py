"""Root-only zero-render D-1 supplement for original half-second coverage.

The original 811 raw half-second samples are not all in the retained846
physical replay. Compute the exact131 difference, replay its actual final
camera/pier/base sources, and run the retained semantic auditor at the same
numeric thresholds. Never infer decoded-pixel approval, revise historical
sourcebox/anchor NG, or merge the later149-frame camera derivative silently.
Import is inert. No Blender render operator occurs in this file.
"""
import hashlib
import json
from pathlib import Path
import runpy
import types

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
FINAL = Path('/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025')
BASE = Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
PIER = Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-images-v5-20261025')
CAMERA = Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v9-verified-20261025')
OUT = Path('/private/tmp/ys/ys-chain-d1v1-missing131-physical-v1-20261025')
FINAL_HELPER = W/'scripts/blender/desk_axes_d1_final_camera_pier_physical_v5_20261025.py'
FINAL_HELPER_SHA = '1fa4235a08590e737f06c2940d0b4dc4f5c127d35de19199e6ec7a2f5421804c'
OLD_PHYSICAL = FINAL/'final-composite-physical-v6-actual-anchor-evidence-20261025.json'
OLD_PHYSICAL_SHA = '9bcc39fda77012cff9154c8cc21703ba2a92480f924416df105fb560cc97faf6'
NPZ = FINAL/'final-original-gates/d1-original-frame-samples.npz'
NPZ_SHA = 'd2d90b4d56f7bdeb8e62ab258a40c8f8401e2dde1459aac83e1b8a68e5fe6229'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p):
    return json.loads(Path(p).read_text())


def run(ns, authorized=False):
    assert authorized is True, 'Only the root dispatcher may evaluate this scene'
    assert not OUT.exists() and not OUT.is_symlink()
    assert sha(FINAL_HELPER) == FINAL_HELPER_SHA and sha(OLD_PHYSICAL) == OLD_PHYSICAL_SHA
    # The retained NPZ pin is also checked against the already pinned report;
    # avoid replacing its original measurements with a newly sampled sequence.
    prior = read(OLD_PHYSICAL)
    assert sha(NPZ) == NPZ_SHA == prior['originalFrameSamplesSha256']
    helper = runpy.run_path(str(FINAL_HELPER))
    pins = dict(helper['PINS'])
    pins.update({str(FINAL_HELPER): FINAL_HELPER_SHA, str(OLD_PHYSICAL): OLD_PHYSICAL_SHA,
                 str(NPZ): sha(NPZ), str(Path(__file__).resolve()): sha(__file__)})
    adapter = runpy.run_path(str(helper['ADAPTER']))
    pins.update(adapter['diagnostic_pins']('5502cee07b7b6107dd94f2783e0807a8f202334b9e016c5b366b59ed28c3cc5d'))
    for p in (FINAL/'prepared.json', FINAL/'blender/delivered-provenance.json',
              FINAL/'blender/delivered-camera-poses.json', FINAL/'blender/desk/anchors.json',
              FINAL/'blender/data.json', PIER/'render/report.json', CAMERA/'render/report.json'):
        pins[str(p)] = sha(p)
    for p, h in pins.items():
        assert sha(p) == h, str(p)
    import numpy as np
    samples = np.load(NPZ)
    half = [int(round(float(t)*30)) for t in samples['desk_t']]
    old_frames = {int(round(r['time']*30)) for r in prior['rows']}
    frames = sorted(set(half)-old_frames)
    assert len(half) == len(set(half)) == 811 and len(prior['rows']) == len(old_frames) == 846
    assert len(frames) == 131 and not (set(frames) & old_frames)
    rows = read(FINAL/'blender/delivered-provenance.json')['frames']
    poses = read(FINAL/'blender/delivered-camera-poses.json')
    anchors = read(FINAL/'blender/desk/anchors.json')['anchors']
    data = read(FINAL/'blender/data.json')
    assert len(rows) == len(poses) == 12163 and set(anchors) == {'boiler','cyl','piston','beam','can','coal','fuji'}
    pr, cam = read(PIER/'render/report.json'), read(CAMERA/'render/report.json')
    assert pr['helperSha256'] == helper['PINS'][str(helper['ADAPTER'])]
    assert cam['helperSha256'] == helper['PINS'][str(helper['CAMERA_HELPER'])]
    assert pr['allReplacementPhysicalPass'] and cam['allReplacementPhysicalPass']
    assert not pr.get('error') and not cam.get('error')
    image = runpy.run_path(str(helper['IMAGES']))
    audit = runpy.run_path(str(helper['AUDIT']))
    recovery = runpy.run_path(str(helper['RECOVERY']))
    load = image['load_audit']
    private_load = types.FunctionType(load.__code__, {**load.__globals__, 'OUT': PIER},
                                      load.__name__, load.__defaults__, load.__closure__)
    _, states, pier_map = private_load(Path(pr['auditReport']), pr['auditReportSha256'])
    camera_map = {int(j): int(k) for j, k in cam['replacementFrameToActualPatchFrame'].items()}
    assert not set(pier_map) & set(camera_map)
    OUT.mkdir(parents=True)
    report = dict(episode='D-1', mode='zero-render-original-half-second-missing131', renders=0,
                  helperSha256=sha(__file__), sourceCache=str(FINAL), priorPhysicalReport=str(OLD_PHYSICAL),
                  priorPhysicalReportSha256=OLD_PHYSICAL_SHA, originalSampleNpz=str(NPZ), originalSampleNpzSha256=sha(NPZ),
                  originalHalfSecondFrames=half, retainedPhysicalFrames=sorted(old_frames), requestedFrames=frames,
                  originalHalfSecondSampleCount=811, retainedPhysicalCount=846, additionalGeometryStates=131,
                  actualEncodedImagesRetrieved=False, rawNeverSubstitutesForDecodedPixelEvidence=True,
                  originalHistoricalSourceboxAndAnchorNGPreserved=True, originalProxy7bNGPreserved=True,
                  independentHistoricalSourceboxEqualityNotRecertified=True,
                  later149FrameCameraPatchNotAppliedOrRecertified=True,
                  originalThresholdsUnchanged=True, automaticApproval=False, earsVerified=False, finalAcceptance=False)
    ctx, private_scope, previous_out = None, None, None
    observations, raw_before = {}, {}
    cleanup_failure = None
    try:
        private_scope = recovery['normalize'].__globals__
        assert recovery['write'].__globals__ is private_scope
        previous_out = private_scope['OUT']
        private_scope['OUT'] = OUT/'strict-replay'
        ctx = recovery['DeliveredReplay'](ns, cache=BASE)
        ctx.open()
        ctx.protected.update(pins)
        g, d, bpy = ctx.g, ctx.d, ctx.bpy
        enforce_camera_dof, describe_geometry = helper['camera_policy_replayer'](ctx, cam)
        def apply(t):
            j = helper['js_frame'](t)
            assert j in frames
            row = rows[j]
            assert row['frame'] == j and row['pose'] == poses[j]
            link = FINAL/'blender/desk'/('%05d.jpg' % j)
            assert link.resolve() == Path(row['raw']).resolve()
            raw_before.setdefault(row['raw'], helper['raw_state'](row['raw']))
            contacts, dof = [], None
            if row['layer'] == 'four-cue-camera':
                assert j in camera_map and camera_map[j] == row['actualFrame']
                source = row['cameraSourceDeliveredRow']
                assert source == ctx.rows[row['actualFrame']]
                points = ctx.replay(source)
                before = {o:audit['object_state'](o) for o in ctx.scene.objects if o is not d.CAM}
                types.FunctionType(g['set_camera'].__code__, {**g,'pose_at':lambda _t:poses[j]})(row['actualFrame']/30)
                bpy.context.view_layer.update()
                assert all(audit['object_state'](o) == s for o,s in before.items())
                dof = enforce_camera_dof(row['actualFrame'])
                projected = {n:list(d.project(v)) for n,v in points.items()}
            elif row['layer'] == 'pier-contact':
                assert j in pier_map and pier_map[j] == row['actualFrame']
                fresh, projected = image['apply_checked'](ctx, audit, states[row['actualFrame']])
                assert fresh['pass']
                contacts = fresh['contacts']
            else:
                assert j not in camera_map and j not in pier_map
                points = ctx.replay(row)
                projected = {n:list(d.project(v)) for n,v in points.items()}
            historical = {n:anchors[n][j] for n in anchors}
            observation = dict(frame=j, deliveredFrame=row, actualRawSha256=sha(row['raw']),
                               sourceObjectFrame=row['unchangedOtherObjectSourceFrame'],
                               semanticOperationTime=row['semanticOperationTime'],
                               cameraOperationTime=row['cameraOperationTime'],
                               actualProjectedAnchors=projected, historicalDeliveredAnchors=historical,
                               historicalAnchorComparisonAt1eMinus5=helper['same'](projected, historical, 1e-5),
                               historicalMismatchNotSilentlyRepaired=True,
                               finalCameraDofPolicyReplayed=dof, pierContacts=contacts,
                               semanticWorldGeometry=describe_geometry(j),
                               faceDeclarationHint=helper['face_hint'](data,j),
                               actualEncodedPixelVisibilityNotInferred=True)
            observations[j] = observation
            return projected
        def source_time(t):
            return rows[helper['js_frame'](t)]['unchangedOtherObjectSourceFrame']/30
        scope, adapted_hash, changes = helper['requested_auditor']([j/30 for j in frames], source_time, ctx.module['straw_semantic_geometry'])
        replay_file = OUT/'evaluated-semantic-replay.json'
        private = {**g, 'apply':apply, 'pose_at':lambda t:poses[helper['js_frame'](t)]}
        result = scope['check']({'main':types.FunctionType(g['main'].__code__,private)}, str(replay_file),
                                revision='Additional131 original half-second states; exact current final source replay; no pixels',
                                expected_source=helper['STAGE'])
        assert len(result['rows']) == 131 and set(observations) == set(frames)
        for row in result['rows']:
            j = helper['js_frame'](row['time'])
            assert row['actualPose'] == poses[j]
            row.update(observations[j])
            for role, field in (('primary','actualSurface'), ('critical','criticalSurface')):
                world = row['semanticWorldGeometry'][role]
                if row[field] is None:
                    assert world is None
                else:
                    assert world is not None and world['vertexCount'] == row[field]['vertexCount']
                    assert world['visibleObjectCreationNames'] == row[field]['objectNames']
        layer_counts = {}
        for j in frames:
            layer_counts[rows[j]['layer']] = layer_counts.get(rows[j]['layer'],0)+1
        report.update(rows=result['rows'], new131PhysicalAllPass=result['allPass'], failures=result['failures'],
                      exactCurrentLayerCounts=layer_counts, evaluatedSemanticReplay=str(replay_file),
                      evaluatedSemanticReplaySha256=sha(replay_file), adaptedAuditorSha256=adapted_hash,
                      exactRetainedAuditorAdaptationPairs=changes,
                      halfSecondGeometryCoverageAfterExplicitUnion=len(set(half) & (old_frames | set(frames))),
                      uniquePhysicalFramesAfterExplicitUnion=len(old_frames | set(frames)),
                      doesNotAssertAllUnionPhysicalPass=True,
                      historicalAnchorMismatchesRetained=sum(not r['historicalAnchorComparisonAt1eMinus5'] for r in observations.values()))
    except BaseException as error:
        report['error'] = dict(type=type(error).__name__, message=str(error)[:2000])
        raise
    finally:
        if ctx is not None:
            try:
                checks = ctx.close()
                dof_after = {k:getattr(ctx.d.CAM_D.dof,k) for k in ctx.dof}
                checks['allEntryDofScalarsExplicitlyVerifiedAt1eMinus9'] = helper['same'](ctx.dof,dof_after)
                assert all(v is True for v in checks.values())
                assert Path(ctx.transformRestorationReport['path']).is_relative_to(OUT/'strict-replay')
                report['protectionChecks'] = checks
                report['strictRestorationEvidence'] = ctx.transformRestorationReport
            except BaseException as error:
                report['cleanupError'] = dict(type=type(error).__name__, message=str(error)[:2000])
                cleanup_failure = error
        if private_scope is not None:
            private_scope['OUT'] = previous_out
        assert all(helper['raw_state'](p) == s for p,s in raw_before.items())
        assert all(sha(p) == h for p,h in pins.items())
        report['oldRawAndPinnedSourcesUnchanged'] = True
        with (OUT/'report.json').open('x') as f:
            json.dump(report,f,ensure_ascii=False,indent=1,allow_nan=False)
        if cleanup_failure is not None:
            raise cleanup_failure
    return report
