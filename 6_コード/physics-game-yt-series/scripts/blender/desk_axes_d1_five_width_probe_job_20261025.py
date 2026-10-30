"""Root-only audit, then at most six still probes of explicit D-1 camera keys.

Import is inert. run(nsD1, authorized=True, mode='audit') fits only two short
construction phase unions and one air key from named samples, freezes those
numeric poses, and checks every affected30fps output plus all boundaries.
mode='probe' requires the SHA of a completely passing audit and never refits.
No rendering starts without root dispatch. This is not a 7b or delivery pass.
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
OUT = Path('/private/tmp/ys/ys-chain-d1v1-five-width-camera-v1-20261025')
V1 = W/'scripts/blender/desk_axes_d1_original_ng_probe_job_20261025.py'
VARIANT = W/'scripts/blender/desk_axes_d1_original_ng_variants_20261025.py'
PLAN = W/'scripts/blender/desk_axes_d1_five_width_camera_plan_20261025.py'
DEFAULT_PROBES = (1242, 1260, 1269, 3709, 4007, 4008)
ORIGINAL_FIVE = (1242, 1260, 3709, 4007, 4008)
V1_SHA = '4d667c6b6f497ff0eb66776da9e472dfe7940e340549b17af8f9b44758cd0131'
VARIANT_SHA = '1ff60f728cd60c36a48b20c78cf4169fdf1ca7395ce31622e3362f4a15f96b71'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p):
    return json.loads(Path(p).read_text())


def run(ns, authorized=False, mode='audit', audit_sha256=None, probe_frames=None):
    assert authorized is True and mode in ('audit', 'probe')
    assert sha(V1) == V1_SHA and sha(VARIANT) == VARIANT_SHA
    old = runpy.run_path(str(V1))
    variant = runpy.run_path(str(VARIANT))
    policy = runpy.run_path(str(PLAN))
    pins = {**old['PINS'], V1: V1_SHA, VARIANT: VARIANT_SHA, PLAN: sha(PLAN)}
    for p, h in pins.items():
        assert sha(p) == h, str(p)
    dest = OUT/mode
    assert not dest.exists() and not OUT.is_symlink()
    prior = None
    if mode == 'probe':
        assert isinstance(audit_sha256, str) and sha(OUT/'audit/report.json') == audit_sha256
        prior = read(OUT/'audit/report.json')
        assert prior['allAffectedAndBoundaryPhysicalPass'] and not prior.get('error') and not prior.get('cleanupError')
        assert prior['helperSha256'] == sha(PLAN) and prior['runnerSha256'] == sha(__file__)
        assert all(v is True for v in prior['protectionChecks'].values())
        assert prior['renders'] == 0
    rows = read(FINAL/'blender/delivered-provenance.json')['frames']
    poses = read(FINAL/'blender/delivered-camera-poses.json')
    retained = read(FINAL/'final-composite-physical-v6-actual-anchor-evidence-20261025.json')
    original_rows = {round(r['time']*30): r for r in retained['rows']}
    assert len(rows) == len(poses) == 12163
    inspector_path = W/'scripts/umech/desk-quality-gate-frames.py'
    inspector_sha256 = sha(inspector_path)
    inspector = runpy.run_path(str(inspector_path))
    images = runpy.run_path(str(W/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py'))
    audit = runpy.run_path(str(W/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py'))
    recovery = runpy.run_path(str(W/'scripts/blender/desk_axes_d1_pier_contact_replay_v5_20261025.py'))
    pier = read(PIER/'render/report.json')
    load = images['load_audit']
    owned_load = types.FunctionType(load.__code__, {**load.__globals__, 'OUT': PIER}, load.__name__, load.__defaults__, load.__closure__)
    _, states, _ = owned_load(Path(pier['auditReport']), pier['auditReportSha256'])
    dest.mkdir(parents=True)
    ctx = None
    settings = None
    recovery_scope = None
    recovery_out = None
    raw_pins = {}
    report = dict(episode='D-1', mode=mode, helperSha256=sha(PLAN), runnerSha256=sha(__file__),
                  renders=0, rows=[], failures=[], originalFiveFrames=list(ORIGINAL_FIVE),
                  originalNGPreserved=True, originalHistoricalSourceboxAndAnchorNGPreserved=True,
                  originalMaterialGeometryObjectHandWordAndCaptionTimesUnchanged=True,
                  oldSourceFrameAndOperationTimeMappingsUnchanged=True,
                  noPerFrameFitOrAutomaticRenormalization=True,
                  allAffectedAndBoundaryPhysicalPass=False, original7bPassNotClaimed=True,
                  earsVerified=False, automaticApproval=False, finalAcceptance=False)
    try:
        import numpy as np
        # runpy made a fresh, private helper namespace. Its diagnostics must
        # live in this NEW cache, rather than append files to the old v5 cache.
        # No live episode binding or original source text is changed.
        recovery_scope = recovery['normalize'].__globals__
        assert recovery['write'].__globals__ is recovery_scope
        assert recovery['DeliveredReplay'].close.__globals__ is recovery_scope
        recovery_out = recovery_scope['OUT']
        recovery_scope['OUT'] = dest/'strict-replay'
        report['privateStrictReplayOutput'] = str(recovery_scope['OUT'])
        ctx = recovery['DeliveredReplay'](ns, cache=BASE)
        ctx.open()
        g, d, bpy = ctx.g, ctx.d, ctx.bpy
        scene = d.SC
        settings = dict(filepath=scene.render.filepath, resolution_x=scene.render.resolution_x,
                        resolution_y=scene.render.resolution_y, resolution_percentage=scene.render.resolution_percentage,
                        file_format=scene.render.image_settings.file_format, samples=scene.cycles.samples)

        def replay(j):
            row = rows[j]
            assert row['layer'] != 'four-cue-camera', 'Only the three named non-four-cue intervals are in scope'
            raw_pins.setdefault(row['raw'], sha(row['raw']))
            if row['layer'] == 'pier-contact':
                fresh, _ = images['apply_checked'](ctx, audit, states[row['actualFrame']])
                assert fresh['pass']
            else:
                ctx.replay(row)
            source_t = row['unchangedOtherObjectSourceFrame']/30
            role, objects, critical = ctx.tools['principal'](g['cue_at'](j/30), source_t)
            return (row, role, variant['world_vertices'](objects, bpy, np),
                    variant['world_vertices'](critical, bpy, np))

        if prior is None:
            b = policy['definitions'](g)
            assert abs(b['installationWordTime']-41.95) < 1e-6
            assert abs(b['canPrincipalCut']-123.18) < 1e-6
            assert abs(b['airWordTime']-133.32) < 1e-6
            phases, fitting_samples = {}, {}
            for name, a, z in (
                    ('boiler-visible', b['constructionStart'], b['constructionCylinder']),
                    ('cylinder-visible', b['constructionCylinder'], b['constructionBeam'])):
                js = policy['sample_frames'](a, z)
                samples = [replay(j) for j in js]
                cloud = np.concatenate([r[2] for r in samples])
                cc = [r[3] for r in samples if r[3] is not None]
                critical = np.concatenate(cc) if cc else None
                phases[name] = policy['fit_sampled_cloud'](ctx, variant, name, rows[js[-1]]['pose'], cloud, critical)
                fitting_samples[name] = js
            mine_j = policy['first_frame'](b['installationPatchStart'])-1
            engine_j = policy['first_frame'](b['installationPatchEnd'])
            close_j = policy['first_frame'](b['canPatchEnd'])
            air_close_j = policy['first_frame'](b['airWordTime'])-1
            air_full_j = policy['first_frame'](b['airFullKey'])
            fixed = [('mine-hold', mine_j), ('beam-and-rod', engine_j),
                     ('can-close', close_j), ('air-close', air_close_j), ('air-full', air_full_j)]
            for name, j in fixed:
                _, _, cloud, _ = replay(j)
                center = (cloud[:, :3].min(axis=0)+cloud[:, :3].max(axis=0))/2
                phases[name] = dict(pose=poses[j], focusPoint=[float(v) for v in center], fstop=11.2,
                                    fixedExistingPoseFromOutputFrame=j)
            # One middle key is fitted from one declared existing output state.
            # Playback interpolates its numeric pose; it does not refit a box.
            middle_j = int(math_floor_half_up(b['airMiddleKey']*30))
            _, _, cloud, critical = replay(middle_j)
            original = variant['apply_trial']
            def supplied(which, _bpy, _np):
                return cloud if which == 'primary' else critical
            fn = types.FunctionType(original.__code__, {**original.__globals__, 'world_vertices': supplied},
                                    original.__name__, original.__defaults__, original.__closure__)
            trial = dict(name='air-fixed-middle-key', azimuth=-15., elevation=34., targets=(.55, .53, .50),
                         center=(540., 650.), fstop=11.2)
            fitted = fn(ctx, trial, poses[middle_j], 'primary', 'critical')
            assert fitted['feasible'], fitted
            phases['air-middle'] = dict(pose=fitted['chosen']['pose'], focusPoint=phases['air-close']['focusPoint'],
                                        fstop=11.2, sampledFit=fitted)
            fitting_samples['air-middle'] = [middle_j]
            plan = dict(boundaries=b, phases=phases, fittingFrames=fitting_samples,
                        constructionCuts=[b['constructionStart'], b['constructionCylinder'], b['constructionBeam']],
                        canCloseCut=b['canPrincipalCut'],
                        airExplicitKeyTimes=[b['airHoldKey'], b['airMiddleKey'], b['airFullKey']],
                        easing='smoothstep(u)=u*u*(3-2*u), only between the two air key intervals',
                        installationNote='Mine holds until the spoken installation; new component arrivals use fixed wider views.',
                        sourceMappingsEdited=False, oldPoseListEdited=False)
        else:
            plan = prior['plan']
            assert plan['boundaries'] == policy['definitions'](g)
        affected = policy['selected_frames'](plan['boundaries'])
        boundaries = policy['boundary_frames'](plan['boundaries'], len(rows))
        all_frames = sorted(set(affected+boundaries+list(ORIGINAL_FIVE)))
        assert set(ORIGINAL_FIVE) <= set(affected)
        if mode == 'probe':
            all_frames = list(DEFAULT_PROBES if probe_frames is None else probe_frames)
            assert 1 <= len(all_frames) <= 6 and len(set(all_frames)) == len(all_frames)
            assert set(all_frames) <= set(prior['auditedFrames'])
        report.update(plan=plan, affectedFrames=affected, boundaryFrames=boundaries, auditedFrames=all_frames)
        for j in all_frames:
            row, role, primary, critical = replay(j)
            before = {o: audit['object_state'](o) for o in scene.objects if o is not d.CAM}
            camera = policy['pose_for'](j, row['pose'], plan)
            if camera['phase'] != 'unchanged':
                policy['apply_pose'](ctx, camera)
            assert all(audit['object_state'](o) == s for o, s in before.items())
            box = variant['projected_box'](primary, d, bpy, np)
            cb = variant['projected_box'](critical, d, bpy, np)
            checks = variant['physical_checks'](box, cb)
            item = dict(frame=j, time=j/30, semanticPrincipal=role, camera=camera,
                        sourceDeliveredRow=row, actualSurface=box, criticalSurface=cb,
                        widthRatio=(box[2]-box[0])/1080, physicalChecks=checks,
                        originalHistoricalIdentityNotRecertified=True)
            item['pass'] = all(checks.values())
            if j in original_rows:
                item['retainedPreviousPhysicalWidth'] = original_rows[j]['actualSurface']['widthRatio']
                item['retainedPreviousPhysicalPass'] = original_rows[j]['pass']
            report['rows'].append(item)
            if not item['pass']:
                report['failures'].append(item)
            if mode == 'probe':
                assert item['pass'], item
                path = dest/('five-width-%05d.jpg' % j)
                assert not path.exists()
                scene.render.resolution_x, scene.render.resolution_y = 1080, 1920
                scene.render.resolution_percentage = 100
                scene.render.image_settings.file_format = 'JPEG'
                scene.cycles.samples = 16
                scene.render.filepath = str(path)
                bpy.ops.render.render(write_still=True)
                item.update(image=str(path), imageSha256=sha(path),
                            oldOriginalImageFeatures=old['original_image_features'](row['raw'], inspector),
                            newOriginalImageFeatures=old['original_image_features'](path, inspector))
                report['renders'] += 1
        report['allAffectedAndBoundaryPhysicalPass'] = not report['failures']
        new_poses = [policy['pose_for'](j, p, plan)['pose'] for j, p in enumerate(poses)]
        rounded = [tuple(round(float(v), 10) for v in p) for p in new_poses]
        moving = sum(rounded[j] != rounded[j-1] for j in range(1, len(rounded)))
        report['candidateCameraMotion'] = dict(frames=len(poses), movingFrames=moving,
                                              movingRatio=moving/len(poses),
                                              topRatio=sum(p[5] >= 65 for p in new_poses)/len(poses))
        assert report['candidateCameraMotion']['movingRatio'] <= .2
        assert report['candidateCameraMotion']['topRatio'] <= .2
    except BaseException as error:
        report['error'] = dict(type=type(error).__name__, message=str(error))
        raise
    finally:
        cleanup_failure = None
        if ctx is not None:
            if settings is not None:
                scene = ctx.d.SC
                for key in ('filepath', 'resolution_x', 'resolution_y', 'resolution_percentage'):
                    setattr(scene.render, key, settings[key])
                scene.render.image_settings.file_format = settings['file_format']
                scene.cycles.samples = settings['samples']
            try:
                report['protectionChecks'] = ctx.close()
                report['strictRestorationEvidence'] = ctx.transformRestorationReport
                assert all(v is True for v in report['protectionChecks'].values())
                assert Path(ctx.transformRestorationReport['path']).is_relative_to(dest/'strict-replay')
                assert all(Path(n['path']).is_relative_to(dest/'strict-replay') for n in ctx.normalizations)
                report['strictRecordsUseOnlyNewCache'] = True
            except BaseException as error:
                report['cleanupError'] = dict(type=type(error).__name__, message=str(error))
                cleanup_failure = error
        if recovery_scope is not None:
            recovery_scope['OUT'] = recovery_out
        assert all(sha(p) == h for p, h in raw_pins.items())
        assert all(sha(p) == h for p, h in pins.items())
        assert sha(inspector_path) == inspector_sha256
        report['oldRawAndPinnedSourcesUnchanged'] = True
        with (dest/'report.json').open('x') as f:
            json.dump(report, f, ensure_ascii=False, indent=1, allow_nan=False)
        if cleanup_failure is not None:
            raise cleanup_failure
    return report


def math_floor_half_up(value):
    import math
    return math.floor(value + .5)
