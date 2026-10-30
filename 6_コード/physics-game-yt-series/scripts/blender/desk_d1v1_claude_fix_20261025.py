"""D-1 Claude fix (2026-10-25): re-render three scenes only (rows 22, 40, 45).

Run (background, one at a time, under /private/tmp/ys/blender-lock):
  D1C_JOB=job.json PYTHONPATH=W/scripts/blender Blender -b --python-use-system-env \
     --python THIS -- --cache /private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025
job.json: {"out": DIR, "frames": [int,...], "mode": "base"|"fix"}
Writes DIR/NNNNN.jpg and DIR/anchors-NNNNN.json (7 anchors, projected).
Never writes into the cache. The original desk_d1v1.py is run unchanged
(as a module, not __main__), then this file adjusts the state per frame.
"""
import os, sys, json, math, runpy, time
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
JOB = json.load(open(os.environ['D1C_JOB']))
OUT = JOB['out']; os.makedirs(OUT, exist_ok=True)
assert not OUT.startswith('/private/tmp/ys/ys-chain-d1v1-final')
ns = runpy.run_path(os.path.join(HERE, 'desk_d1v1.py'), run_name='d1_claude_fix')
d = ns['d']; P = ns['P']; G = ns['G']; T = ns['T']; S = ns['S']; E = ns['E']; U = ns['U']
CHILDREN = ns['CHILDREN']; CREATED_NAME = ns['CREATED_NAME']; BASE = ns['BASE']
FPS = 30
POSES = json.load(open('/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025/blender/delivered-camera-poses.json'))


def mix(a, b, u):
    return [x + (y - x) * u for x, y in zip(a, b)]


def set_pose(p):
    d.pose_cam(p)


# ---------------------------------------------------------------- row 22
# 1 cm square + 1 kg next to the palm (enlarged to ~10 cm) + 100 kg, in one
# still view, so the size relation is true (square ~ 1/10 of the palm width).
ROW22_SQ = Vector((.418, -.045, .002))
PALM_S = 1.3
ROW22_POSE = [.36, -.02, .02, .37, -6, 45, 50]


def fix_row22(t):
    q = P['weights']
    one = T('air:1kg', 'イチキログラム'); hundred = T('air:1kg', 'ヒャッキログラム')
    hand = T('air:1kg', 'テノヒラ')
    sq = next(o for o in G['weights'] if CREATED_NAME[o] == 'd1_squarecm')
    sq.location = ROW22_SQ
    q['palm'].scale = (PALM_S,) * 3
    w1 = q['one']; w1.scale = (.56, .56, .56)
    w1.location = ROW22_SQ + Vector((0, 0, .001 + .0056 + .004 * (1 - U(t, one, .4))))
    d.show_tree(w1, t >= one)
    for n in d.HANDS:
        d.HANDS[n].scale = (1, 1, 1); d.set_hand(n, (0, 0, 0), vis=False)
    a = T('air:1kg', 'イチエイホオ')
    if a <= t < one:
        ns['small_hand_d1']('kai', (ROW22_SQ.x + .006, -.047 + .004 * U(t, a, .7), .003), scale=.12)
    if hand <= t < hand + 2.1:
        ns['small_hand_d1']('kai', (.318, -.035, .011), scale=.28)
    c0 = S('air:1kg')
    start = list(ROW22_POSE); start[3] *= 1.08
    set_pose(mix(start, ROW22_POSE, U(t, c0, .8)))
    d.CAM_D.dof.focus_distance = (Vector((.30, -.045, .01)) - d.CAM.location).length
    d.CAM_D.dof.aperture_fstop = 16


# ---------------------------------------------------------------- row 40
# 4 horses per side in two pairs (2 deep x 2 abreast), 1.7x larger, so that
# the sphere and all 8 horses fill ~80 % of the frame width.
HSCALE = .60 * 1.7
ROW40_POSE = [.10, -.05, .05, .95, -8, 22, 40]


def fix_row40(t):
    q = P['hemi']; center = q['center']
    pull0 = S('size:pull'); air = T('size:pull', 'クウキオ')
    release = U(t, air, .6)
    tug = U(t, pull0 + .3, .5)
    hard = 1 - U(t, air - .1, .25)
    for i, h in enumerate(q['horses']):
        sign = -1 if i < 4 else 1; k = i % 4; row, lane = k // 2, k % 2
        r = h['root']; r.scale = (HSCALE,) * 3
        x0 = .13 + row * .068
        lurch = .025 * U(t, air, .9)
        r.location = center + Vector((sign * (x0 + .006 * tug * hard + lurch), (-.017 if lane else .017), -.056))
        dip = math.sin(math.pi * U(t, air + .05, 1.4))
        r.rotation_euler = (0, -.12 * tug * hard + .60 * dip, 0 if sign > 0 else math.pi)
        amp = .005 * tug * hard + .007 * release * (1 - U(t, air + .6, .8))
        for j, leg in enumerate(h['legs']):
            leg.location.z += amp * max(0, math.sin(t * 26 + j * math.pi * .5 + k))
        d.show_tree(r, t >= pull0)
    for n, o in enumerate(q['ropes']):
        sign = -1 if n == 0 else 1
        a = center + Vector((sign * (.045 + .08 * release), 0, 0))
        b = center + Vector((sign * (.13 + .025 * U(t, air, .9) + .006 * tug * hard - .03), 0, -.056 + .040))
        v = b - a
        o.rotation_euler = v.to_track_quat('Z', 'Y').to_euler(); o.location = (a + b) / 2
        o.scale = (2.6, 2.6, 1); bpy.context.view_layer.update()
        o.scale.z = v.length / max(1e-6, o.dimensions.z) * o.scale.z
        d.show(o, t >= pull0)
    # the valve belongs to the right half: it travels and tilts with it
    ang = .6 * release
    for o, h in [(q['valve'], .063), (q['valvepipe'], .052)]:
        o.location = center + Vector((.08 * release + h * math.sin(ang), 0, h * math.cos(ang)))
        o.rotation_euler.y = ang
    pop = U(t, air, .25) * (1 - U(t, air + .35, .4))
    for i, o in enumerate(q['gas']):
        a = 2 * math.pi * i / len(q['gas'])
        if pop > 0:
            o.location = center + Vector((0, .03 * math.cos(a) * (.3 + pop), .03 * math.sin(a) * (.3 + pop)))
            o.scale = (2,) * 3
    hemi_pose = POSES[int(round(pull0 * FPS)) - 1]
    set_pose(mix(hemi_pose, ROW40_POSE, U(t, pull0, 1.0)))
    d.CAM_D.dof.focus_distance = (center - d.CAM.location).length
    d.CAM_D.dof.aperture_fstop = 11.2


# ---------------------------------------------------------------- row 45
ROW45_POSE = [.30, .02, .13, .93, -6, 14, 40]


def fix_row45(t):
    q = P['fuji']
    # Bring both air columns forward and enlarge them (low: 10 layers at the
    # foot, high: thin stack above the summit), so they read side by side.
    for grp, base, newbase, s in [(q['low'], Vector((.14, .05, 0)), Vector((.148, .02, 0)), .80),
                                  (q['high'], Vector((.33, .05, .15)), Vector((.33, .05, .15)), .80)]:
        for o in [grp['ground']] + grp['layers'] + sum(grp['particles'], []) + sum(grp['edges'], []):
            # original placement is base+(L-base)*.44 with scale*.44; undo -> s
            rel = (o.location - base) / .44
            o.location = newbase + rel * s
            o.scale = o.scale / .44 * s
    # the foot engine sits beside its column
    r, _ = q['engines'][0]; r.location = Vector((.148, -.07, .01))
    c0 = S('ch:fuji'); start = list(ROW45_POSE); start[3] *= 1.08
    set_pose(mix(start, ROW45_POSE, U(t, c0, 1.0)))
    d.CAM_D.dof.focus_distance = (Vector((.29, .02, .10)) - d.CAM.location).length
    d.CAM_D.dof.aperture_fstop = 11.2


def fix_row46(t):
    # only the 1.2 s camera move at the start of row 46: start from the new
    # Fuji framing instead of the old one, end exactly on the delivered pose.
    s0 = S('last:air'); end = POSES[int(round((s0 + 1.2) * FPS))]
    set_pose(mix(ROW45_POSE, end, U(t, s0, 1.2)))


def scene_of(t):
    if S('last:air') <= t < S('last:air') + 1.2: return 'row46'
    if S('air:1kg') <= t < S('air:inside'): return 'row22'
    if S('size:pull') <= t < S('next:spread'): return 'row40'
    if S('ch:fuji') <= t < S('last:air'): return 'row45'
    return None


FIX = {'row22': fix_row22, 'row40': fix_row40, 'row45': fix_row45, 'row46': fix_row46}
mode = JOB.get('mode', 'fix')
bpy.context.window.scene = d.SC
t0 = time.time()
for j in JOB['frames']:
    t = j / FPS
    f = os.path.join(OUT, '%05d.jpg' % j)
    if os.path.exists(f) and not JOB.get('force'): continue
    ns['apply'](t)
    if mode == 'base':
        set_pose(POSES[j])
    else:
        sc = scene_of(t); FIX[sc](t)
    bpy.context.view_layer.update()
    pts = ns['anchors'](t)
    extra = {}
    if mode != 'base' and scene_of(t) == 'row22':
        extra['sq'] = d.project(ROW22_SQ)
        extra['sq_edge'] = d.project(ROW22_SQ + Vector((.005, 0, 0)))
        extra['magT'] = T('air:1kg', 'イチエイホオ'); extra['t'] = t
    json.dump({n: d.project(v) for n, v in pts.items()}, open(os.path.join(OUT, 'anchors-%05d.json' % j), 'w'))
    json.dump(extra, open(os.path.join(OUT, 'extra-%05d.json' % j), 'w'))
    d.SC.render.filepath = f
    bpy.ops.render.render(write_still=True, scene=d.SC.name)
    if mode != 'base' and scene_of(t) == 'row22' and t >= T('air:1kg', 'イチエイホオ') - .2:
        rx, ry, ap, fd = d.SC.render.resolution_x, d.SC.render.resolution_y, d.CAM_D.dof.aperture_fstop, d.CAM_D.dof.focus_distance
        d.SC.render.resolution_x = d.SC.render.resolution_y = 480
        set_pose([ROW22_SQ.x, ROW22_SQ.y, .006, .12, -6, 35, 200])
        d.CAM_D.dof.focus_distance = (ROW22_SQ + Vector((0, 0, .005)) - d.CAM.location).length
        d.CAM_D.dof.aperture_fstop = 22
        d.SC.render.filepath = os.path.join(OUT, 'mag-%05d.jpg' % j)
        bpy.ops.render.render(write_still=True, scene=d.SC.name)
        d.SC.render.resolution_x, d.SC.render.resolution_y = rx, ry
        d.CAM_D.dof.aperture_fstop, d.CAM_D.dof.focus_distance = ap, fd
    print('[d1c] frame', j, 'done %.1fs' % (time.time() - t0), flush=True)
print('[d1c] ALL DONE', len(JOB['frames']), flush=True)
