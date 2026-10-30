"""Inert, B-1-private camera probe candidates for the original gates 7/7b.

This module does not load a scene, reconstruct state, render, encode, or write.
Root must reconstruct each exact final5 delivered state and open its own scene
transaction before calling fit_probe_camera().  In particular, frame 2820 must
retain B6/B5 magnetic stages and frame 4110 must retain actual held references.
The existing B7 carry is never replaced by a nominal-time apply().

Only the loaded B-1 camera is changed.  No materials, texture, object geometry,
visibility, spoken timings, captions, faces, or checker values are changed.
All candidates need actual raw AND unchanged full-composite review.  The fit is
for a representative still; a production camera must be fit once to the union
of every real state in the shot, then held during the explanation.
"""

import math


# The six cases deliberately include smooth objects that camera changes may not
# fix.  A failure is useful evidence; these are not pre-certified passing shots.
CASES = (
    dict(id="pair-visible-faces", frame=2550, time=85.0, row=12,
         principal="pair", azimuth=90.0, elevation=50.0, target_width=.68,
         purpose="Expose both real upper N/S faces with less empty separation."),
    dict(id="pair-action-visible-faces", frame=2820, time=94.0, row=13,
         principal="pair", azimuth=90.0, elevation=50.0, target_width=.68,
         purpose="Check the same angle against the actual attraction stage."),
    dict(id="placement-facing-needles", frame=4110, time=137.0, row=18,
         principal="rock", azimuth=90.0, elevation=25.0, target_width=.68,
         purpose="Look toward the positive-X hemisphere where the first six needles sit."),
    dict(id="dip-pinned-side-view", frame=4650, time=155.0, row=21,
         principal="rock", azimuth=0.0, elevation=15.0, target_width=.68,
         purpose="Keep the required side view; focus on the stone rather than empty aim space."),
    dict(id="prediction-pinned-face-view", frame=6690, time=223.0, row=26,
         principal="cutaway", azimuth=0.0, elevation=10.0, target_width=.68,
         purpose="Preserve the specified undistorted angle comparison and measure its true limit."),
    dict(id="mystery-cutaway-focus", frame=9900, time=330.0, row=37,
         principal="cutaway", azimuth=0.0, elevation=30.0, target_width=.68,
         purpose="Check the visible closed box/lightning timing with the actual cut face in focus."),
)


def _tree(root):
    return [root] + [o for child in root.children for o in _tree(child)]


def _principal_objects(g, case):
    parts = g["PARTS"]
    if case["principal"] == "pair":
        return _tree(parts["magnets"]["a"]) + _tree(parts["magnets"]["b"])
    if case["principal"] == "rock":
        return [parts["terrella"]["rock"]]
    if case["principal"] == "cutaway":
        return [parts["globe"]["disc"]]
    raise AssertionError(case["principal"])


def _world_points(g, objects):
    deps = g["bpy"].context.evaluated_depsgraph_get()
    points = []
    for ob in dict.fromkeys(objects):
        if ob.hide_render or ob.type not in {"MESH", "CURVE", "FONT"}:
            continue
        evaluated = ob.evaluated_get(deps)
        mesh = evaluated.to_mesh()
        try:
            if mesh is not None:
                points.extend(evaluated.matrix_world @ v.co for v in mesh.vertices)
        finally:
            evaluated.to_mesh_clear()
    assert points, "Reconstruct the actual visible principal before this helper."
    return points


def _box(g, points):
    projected = [g["d"].project(p) for p in points]
    assert all(len(p) >= 2 and all(math.isfinite(float(v)) for v in p[:2])
               for p in projected)
    return [min(p[0] for p in projected), min(p[1] for p in projected),
            max(p[0] for p in projected), max(p[1] for p in projected)]


def fit_probe_camera(g, case, baseline_pose):
    """Change only this loaded camera and return measured, non-render evidence.

    baseline_pose must be the exact final5 delivered pose for case['frame'],
    never the current nominal plan pose.  The caller restores the transaction.
    """
    assert case in CASES
    bpy, d, Vector = g["bpy"], g["d"], g["Vector"]
    assert bpy.context.window.scene is d.SC and d.SC.camera is d.CAM
    assert len(baseline_pose) == 7
    points = _world_points(g, _principal_objects(g, case))
    g["pose_b1"](baseline_pose)
    bpy.context.view_layer.update()
    original = _box(g, points)
    center_px = ((original[0] + original[2]) / 2,
                 (original[1] + original[3]) / 2)
    target = Vector(tuple(sum(p[i] for p in points) / len(points)
                          for i in range(3)))
    p = [*target, float(baseline_pose[3]), case["azimuth"],
         case["elevation"], float(baseline_pose[6])]
    for _ in range(16):
        g["pose_b1"](p)
        bpy.context.view_layer.update()
        box = _box(g, points)
        width = (box[2] - box[0]) / 1080
        assert width > 0
        # Camera-local horizontal/vertical preserve the original image center.
        right = d.CAM.rotation_euler.to_matrix() @ Vector((1, 0, 0))
        up = d.CAM.rotation_euler.to_matrix() @ Vector((0, 1, 0))
        span = max(point.dot(right) for point in points) - min(point.dot(right) for point in points)
        meters_per_pixel = span / max(1, box[2] - box[0])
        dx = (box[0] + box[2]) / 2 - center_px[0]
        dy = (box[1] + box[3]) / 2 - center_px[1]
        shifted = Vector(p[:3]) + right * (dx * meters_per_pixel) - up * (dy * meters_per_pixel)
        p[:3] = list(shifted)
        p[3] *= width / case["target_width"]
        assert .04 < p[3] < 5
        if abs(width - case["target_width"]) < 1e-5 and abs(dx) < .05 and abs(dy) < .05:
            break
    g["pose_b1"](p)
    # Focus changes are legitimate only on the actual explanatory object.
    d.CAM_D.dof.focus_distance = (d.CAM.location - target).length
    d.CAM_D.dof.aperture_fstop = 6.0
    bpy.context.view_layer.update()
    box = _box(g, points)
    width = (box[2] - box[0]) / 1080
    assert .4 <= width <= .7
    assert box[0] >= 40 and box[2] <= 1040
    assert box[1] >= 110 and box[3] <= 1600
    return dict(case=case, baselinePose=list(baseline_pose), pose=p,
                principalBox=box, physicalWidth=width,
                focusPoint=list(target), focusDistance=d.CAM_D.dof.focus_distance,
                originalPrincipalBox=original, originalCenterPreserved=True,
                originalFeaturesNotRecomputed=True,
                rendered=False, compositeReviewed=False, originalGatePassClaimed=False,
                unchangedObjectStateRequiredFromCaller=True)
