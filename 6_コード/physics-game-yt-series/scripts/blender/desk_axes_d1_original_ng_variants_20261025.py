"""Inert D-1 camera-only trials for the retained original image NG.

The caller must replay the exact delivered model/hand state first. No material,
geometry, cue, word time, Japanese, face, caption, inspector or old output changes.
These six stills test feasibility; they do not certify an episode or a 7b pass.
"""
import math


TRIALS = (
    dict(name='balloon-focus', frame=3090, azimuth=-12., elevation=25.,
         targets=(.67, .65, .62), center=(540., 800.), fstop=11.2,
         reason='Keep the transparent balloon, spoon and steam in one focal volume.'),
    dict(name='hemisphere-contour', frame=9900, azimuth=0., elevation=25.,
         targets=(.67, .65, .62), center=(540., 790.), fstop=11.2,
         reason='Show the actual copper rims, valve and concave opening distinctly.'),
    dict(name='fuji-both-models', frame=11700, azimuth=-35., elevation=25.,
         targets=(.67, .65, .62), center=(540., 850.), fstop=11.2,
         reason='Keep both model engines and both air columns legible together.'),
    dict(name='can-before-crush', frame=3709, azimuth=-15., elevation=34.,
         targets=(.55, .53, .50), center=(540., 650.), fstop=11.2,
         reason='The narrated principal has become the can itself after the tongs leave.'),
    dict(name='cylinder-stroke', frame=7215, azimuth=-10., elevation=32.,
         targets=(.62, .60, .58, .56), center=(540., 800.), fstop=11.2,
         reason='Enlarge the opened cylinder while retaining active pressure arrows.'),
    dict(name='air-layer-focus', frame=4920, azimuth=-15., elevation=20.,
         targets=(.60, .58, .56, .54), center=(540., 900.), fstop=16., min_y=235.,
         reason='Use the specified low angle and resolve existing layer rims and particles.'),
)


def world_vertices(objects, bpy, np):
    """Evaluated mesh vertices; no object or mesh data is modified."""
    dg = bpy.context.evaluated_depsgraph_get()
    parts = []
    for obj in dict.fromkeys(objects):
        if obj.hide_render or obj.type not in ('MESH', 'FONT', 'CURVE'):
            continue
        ev = obj.evaluated_get(dg)
        mesh = ev.to_mesh()
        if mesh is None:
            continue
        try:
            v = np.empty(len(mesh.vertices) * 3, dtype=np.float64)
            mesh.vertices.foreach_get('co', v)
            if len(v):
                vv = np.column_stack((v.reshape(-1, 3), np.ones(len(v) // 3)))
                parts.append(vv @ np.asarray(obj.matrix_world, dtype=np.float64).T)
        finally:
            ev.to_mesh_clear()
    return np.concatenate(parts) if parts else None


def projected_box(vertices, d, bpy, np):
    if vertices is None:
        return None
    dg = bpy.context.evaluated_depsgraph_get()
    m = d.CAM.calc_matrix_camera(dg, x=1080, y=1920, scale_x=1, scale_y=1) @ d.CAM.matrix_world.inverted()
    v = vertices @ np.asarray(m, dtype=np.float64).T
    assert np.isfinite(v).all() and (v[:, 3] > 0).all()
    xy = np.column_stack(((v[:, 0] / v[:, 3] + 1) * 540,
                          (1 - v[:, 1] / v[:, 3]) * 960))
    return [float(xy[:, 0].min()), float(xy[:, 1].min()),
            float(xy[:, 0].max()), float(xy[:, 1].max())]


def physical_checks(primary, critical, min_y=110.):
    def safe(b, bottom):
        return b is not None and b[0] >= 40 and b[2] <= 1040 and b[1] >= 110 and b[3] <= bottom
    width = (primary[2] - primary[0]) / 1080 if primary else None
    return dict(visible=primary is not None,
                size40to70=width is not None and .40 <= width <= .70,
                frameSafe=safe(primary, 1550) and primary[1] >= min_y,
                originalCriticalSafe1100=critical is None or safe(critical, 1100))


def apply_trial(ctx, trial, base_pose, objects, critical):
    """Fit a single fixed pose, then focus on actual principal surface bounds.

    Search changes camera target/distance only at the declared angle. The
    original 40–70 and critical1100 requirements reject infeasible candidates.
    No new production easing or operation times are inferred from one still.
    """
    import numpy as np
    d, bpy = ctx.d, ctx.bpy
    primary = world_vertices(objects, bpy, np)
    important = world_vertices(critical, bpy, np)
    assert primary is not None
    attempts = []

    def camera(pose):
        d.pose_cam(pose)
        bpy.context.view_layer.update()

    def box_at(pose):
        camera(pose)
        return projected_box(primary, d, bpy, np)

    def fit(target):
        pose = list(base_pose)
        pose[4], pose[5] = trial['azimuth'], trial['elevation']
        right = np.array((math.cos(math.radians(pose[4])), math.sin(math.radians(pose[4])), 0.))
        directions = (right, np.array((0., 0., 1.)))
        wanted = np.asarray(trial['center'])
        for _ in range(45):
            b = box_at(pose)
            pose[3] *= ((b[2] - b[0]) / 1080) / target
            assert .04 <= pose[3] <= 3
            b = box_at(pose)
            center = np.array(((b[0] + b[2]) / 2, (b[1] + b[3]) / 2))
            residual = wanted - center
            if max(abs(residual)) < .05 and abs((b[2] - b[0]) / 1080 - target) < 2e-5:
                return pose
            columns = []
            for direction in directions:
                q = pose[:]
                for k in range(3):
                    q[k] += .001 * float(direction[k])
                b2 = box_at(q)
                columns.append((np.array(((b2[0] + b2[2]) / 2, (b2[1] + b2[3]) / 2)) - center) / .001)
            change = np.linalg.lstsq(np.column_stack(columns), residual, rcond=None)[0]
            assert np.isfinite(change).all()
            change *= min(1., .02 / max(float(abs(change).max()), 1e-15))
            for coefficient, direction in zip(change, directions):
                for k in range(3):
                    pose[k] += float(coefficient * direction[k])
        raise ArithmeticError('Single-still camera fit did not converge')

    chosen = None
    for target in trial['targets']:
        try:
            pose = fit(target)
            camera(pose)
            b = projected_box(primary, d, bpy, np)
            cb = projected_box(important, d, bpy, np)
            checks = physical_checks(b, cb, trial.get('min_y', 110.))
            attempts.append(dict(target=target, pose=pose, primary=b, critical=cb, checks=checks))
            if all(checks.values()):
                chosen = attempts[-1]
                break
        except (ArithmeticError, AssertionError) as error:
            attempts.append(dict(target=target, rejected=str(error)))
    if chosen is None:
        return dict(trial=trial, feasible=False, attempts=attempts, rendered=False)
    camera(chosen['pose'])
    focus_cloud = primary[:, :3]
    focus = (focus_cloud.min(axis=0) + focus_cloud.max(axis=0)) / 2
    assert d.CAM_D.dof.focus_object is None
    d.CAM_D.dof.use_dof = True
    d.CAM_D.dof.focus_distance = float(np.float32((ctx.g['Vector'](focus) - d.CAM.location).length))
    d.CAM_D.dof.aperture_fstop = float(np.float32(trial['fstop']))
    bpy.context.view_layer.update()
    return dict(trial=trial, feasible=True, attempts=attempts, chosen=chosen,
                focusPoint=[float(v) for v in focus],
                storedFocusDistance=float(d.CAM_D.dof.focus_distance),
                storedFstop=float(d.CAM_D.dof.aperture_fstop), rendered=False,
                materialGeometryTimingAndTextChanges=0, automaticApproval=False)
