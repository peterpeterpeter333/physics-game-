"""Inert, explicit D-1 camera phases for the five retained width failures.

Three construction views are fixed from sampled, unchanged visible surfaces.
The can uses one cut at the existing semantic/spoken-event boundary. The air
reveal uses three named pose keys and smoothstep, never a per-frame box fit.
The root runner must audit every affected output frame before any probe.
"""
import math
import types


def first_frame(t):
    return int(math.ceil(t * 30 - 1e-8))


def smoothstep(u):
    u = max(0., min(1., u))
    return u * u * (3. - 2. * u)


def interpolate(a, b, u):
    u = smoothstep(u)
    return [float(x + (y - x) * u) for x, y in zip(a, b)]


def definitions(g):
    install = g['T']('nc:install', 'スエツケ')
    can_cut = g['T']('can:heat', 'サカサ') + 2.2
    air = g['T']('air:who', 'マワリノ')
    return dict(
        installationWordTime=install,
        constructionStart=install,
        constructionCylinder=install + .3,
        constructionBeam=install + .6,
        constructionRod=install + .9,
        constructionEnd=install + 1.2,
        installationPatchStart=install - 1.2,
        installationPatchEnd=g['S']('nc:boiler'),
        canPrincipalCut=can_cut,
        canPatchEnd=g['S']('can:crush'),
        airWordTime=air,
        airHoldKey=air + .18,
        airMiddleKey=air + .30,
        airFullKey=air + .50,
    )


def selected_frames(bounds):
    out = set()
    for a, b in ((bounds['installationPatchStart'], bounds['installationPatchEnd']),
                 (bounds['canPrincipalCut'], bounds['canPatchEnd']),
                 (bounds['airWordTime'], bounds['airFullKey'])):
        out.update(range(first_frame(a), first_frame(b)))
    return sorted(out)


def boundary_frames(bounds, total):
    times = [bounds[k] for k in (
        'installationPatchStart', 'constructionStart', 'constructionCylinder',
        'constructionBeam', 'constructionRod', 'constructionEnd',
        'installationPatchEnd', 'canPrincipalCut', 'canPatchEnd',
        'airWordTime', 'airHoldKey', 'airMiddleKey', 'airFullKey')]
    return sorted({j for t in times for j in (first_frame(t)-1, first_frame(t), first_frame(t)+1)
                   if 0 <= j < total})


def sample_frames(a, b):
    lo, hi = first_frame(a), first_frame(b) - 1
    assert lo <= hi
    return sorted({lo, (lo + hi) // 2, hi})


def fit_sampled_cloud(ctx, variant, name, base_pose, primary, critical,
                      target=(.60, .55, .50), center=(540., 780.)):
    """Reuse the already reviewed bounded still fitter on a sampled union.

    No source text is rewritten. No fit result is computed during playback or
    during the exhaustive frame audit; the returned numeric pose is fixed.
    """
    original = variant['apply_trial']
    def supplied_cloud(which, _bpy, _np):
        return primary if which == 'primary' else critical
    private = types.FunctionType(original.__code__,
                                 {**original.__globals__, 'world_vertices': supplied_cloud},
                                 original.__name__, original.__defaults__, original.__closure__)
    trial = dict(name=name, azimuth=-10., elevation=32., targets=target,
                 center=center, fstop=11.2,
                 reason='One fixed pose from three sampled unchanged construction states')
    result = private(ctx, trial, base_pose, 'primary', 'critical')
    assert result['feasible'], {'phase': name, 'attempts': result['attempts']}
    return dict(pose=result['chosen']['pose'], focusPoint=result['focusPoint'],
                fstop=11.2, sampledFit=result)


def pose_for(frame, old_pose, plan):
    """Only fixed values and the declared three-key smoothstep path."""
    t = frame / 30
    b, p = plan['boundaries'], plan['phases']
    if b['installationPatchStart'] <= t < b['constructionStart']:
        return dict(**p['mine-hold'], phase='mine-hold')
    if b['constructionStart'] <= t < b['constructionCylinder']:
        return dict(**p['boiler-visible'], phase='boiler-visible')
    if b['constructionCylinder'] <= t < b['constructionBeam']:
        return dict(**p['cylinder-visible'], phase='cylinder-visible')
    if b['constructionBeam'] <= t < b['installationPatchEnd']:
        return dict(**p['beam-and-rod'], phase='beam-and-rod')
    if b['canPrincipalCut'] <= t < b['canPatchEnd']:
        return dict(**p['can-close'], phase='can-close-cut')
    if b['airWordTime'] <= t < b['airFullKey']:
        if t <= b['airHoldKey']:
            pose = p['air-close']['pose'][:]
            label = 'air-reveal-close-hold'
        elif t <= b['airMiddleKey']:
            pose = interpolate(p['air-close']['pose'], p['air-middle']['pose'],
                               (t-b['airHoldKey'])/(b['airMiddleKey']-b['airHoldKey']))
            label = 'air-reveal-first-ease'
        else:
            pose = interpolate(p['air-middle']['pose'], p['air-full']['pose'],
                               (t-b['airMiddleKey'])/(b['airFullKey']-b['airMiddleKey']))
            label = 'air-reveal-second-ease'
        return dict(pose=pose, focusPoint=p['air-close']['focusPoint'],
                    fstop=11.2, phase=label)
    return dict(pose=list(old_pose), phase='unchanged', preserveExistingDof=True)


def apply_pose(ctx, camera):
    ctx.d.pose_cam(camera['pose'])
    if not camera.get('preserveExistingDof'):
        import numpy as np
        point = ctx.g['Vector'](camera['focusPoint'])
        assert ctx.d.CAM_D.dof.focus_object is None
        ctx.d.CAM_D.dof.use_dof = True
        ctx.d.CAM_D.dof.focus_distance = float(np.float32((point-ctx.d.CAM.location).length))
        ctx.d.CAM_D.dof.aperture_fstop = float(np.float32(camera['fstop']))
    ctx.bpy.context.view_layer.update()
