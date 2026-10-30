"""C-1 Claude fix (2026-10-25). New file only; the frozen desk_c1v1.py is loaded read-only.

Rows 11-13 (M1 box), rows 24-28 (maker's hurdle) and rows 29-31 / 33 (weighted arm,
9999+1) are re-shot. Object motion formulas stay those of desk_c1v1.py, evaluated at
the delivered semantic source frame (r17 camera-patch deliveredSemanticSourceMap).
Only the camera, the arm size/colour (x1.5, brass vs lead), and a small hanger that
holds the arm pivot are changed.

Usage (background):
  Blender -b --python-use-system-env --python THIS.py -- --job job.json
job.json: {"out": DIR, "frames": [..] | "ranges": [[a,b],..], "probe": bool}
"""
import os, sys, json, math, time, runpy, hashlib

HERE = os.path.dirname(os.path.abspath(__file__))
BASE_SCRIPT = os.path.join(HERE, 'desk_c1v1.py')
R17 = '/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r17/camera-patch.json'

job_path = sys.argv[sys.argv.index('--') + 1:][1] if '--' in sys.argv else None
JOB = json.load(open(job_path))
OUT = JOB['out']; os.makedirs(OUT, exist_ok=True); os.makedirs(os.path.join(OUT, 'raw'), exist_ok=True)

base_sha = hashlib.sha256(open(BASE_SCRIPT, 'rb').read()).hexdigest()
assert base_sha == '533b2a1bc912b6a35f7fa9020c6351649eeef8486e0207df8e25c279ab737a39', base_sha
sys.argv = [sys.argv[0], '--', '--cache', '/private/tmp/ys/ys-chain-c1v1']
g = runpy.run_path(BASE_SCRIPT, run_name='c1_claude_fix')
sys.argv = [sys.argv[0]]

import bpy
import numpy as np
from mathutils import Vector, Matrix

d = g['d']; PARTS = g['PARTS']; GROUPS = g['GROUPS']; S = g['S']; T = g['T']; CUE = g['CUE']
apply_base = g['apply']; anchors_fn = g['anchors']; cue_at = g['cue_at']; FX = g['FX']
SEM = json.load(open(R17))['deliveredSemanticSourceMap']
NF = g['NF']; assert NF == 10814 and len(SEM) == NF

# ------------------------------------------------------------ arm: 1.5x, clearer colours
M2 = PARTS['m2']
bpy.context.view_layer.update()
ARM_L = .099            # weight centre from pivot (was .066). spacing .12 -> pivot sits over its own wheel
K = 1.5
HANGERS = []; PINS = {}
pin_by_index = {}
for o in GROUPS['m2']:
    if o.name.startswith('c1_m2_armpin'):
        idx = int(''.join(ch for ch in o.name[len('c1_m2_armpin'):].split('.')[0] if ch.isdigit()))
        pin_by_index[idx] = o
hanger_mat = d.mat('c1claude_hanger', '#b8913d', .32, metal=.7)
for a in M2['arms']:
    i = a['index']; ar = a['root']
    x_i = M2['wheels'][i]['center'].x
    old_pivot = a['pivot'].copy()
    new_pivot = Vector((x_i - (.12 - ARM_L), old_pivot.y, .1745))
    ar.rotation_euler = (0, 0, 0); bpy.context.view_layer.update()
    kids = [c for c in ar.children]
    bar = next(c for c in kids if 'armbar' in c.name); weight = a['weight']
    bar_rs = bar.matrix_world.to_3x3() * K; w_rs = weight.matrix_world.to_3x3() * K
    shift = new_pivot - old_pivot
    ar.matrix_world = Matrix.Translation(ar.matrix_world.translation + shift); bpy.context.view_layer.update()
    bar.matrix_world = Matrix.Translation(new_pivot + Vector((-.0525, 0, 0))) @ bar_rs.to_4x4()
    weight.matrix_world = Matrix.Translation(new_pivot + Vector((-ARM_L, 0, 0))) @ w_rs.to_4x4()
    a['pivot'] = new_pivot
    pin = pin_by_index[i]; PINS[i] = pin
    pin.matrix_world = Matrix.Translation(new_pivot + Vector((0, .002, 0))) @ (pin.matrix_world.to_3x3() * 1.4).to_4x4()
    # small L hanger from the rail (y .085, z .187-.205) down to the pivot pin
    v = d.box('c1claude_hangerV%d' % i, (.007, .006, .2 - .1745 + .004), (new_pivot.x, .046, (.2 + .1745) / 2), hanger_mat, bevel=.001)
    h = d.box('c1claude_hangerH%d' % i, (.007, .085 - .046 + .006, .006), (new_pivot.x, (.046 + .085) / 2, .198), hanger_mat, bevel=.001)
    for o in (v, h):
        d.parent(o, M2['root']); HANGERS.append((o, ar))
    # colours: brighter brass bar (still the brass of the instruction), darker lead weight
    p = d.principled(a['material'])
    p.inputs['Base Color'].default_value = d.rgb('#e2b84e'); p.inputs['Metallic'].default_value = .55; p.inputs['Roughness'].default_value = .26
lead = d.principled(M2['arms'][0]['weight'].data.materials[0])
lead.inputs['Base Color'].default_value = d.rgb('#3f444b'); lead.inputs['Metallic'].default_value = .3; lead.inputs['Roughness'].default_value = .42
bpy.context.view_layer.update()

PANEL = d.fr; PANEL_M = PANEL.matrix_world.copy()

# ------------------------------------------------------------ projection / fit
def cam_matrix():
    deps = bpy.context.evaluated_depsgraph_get()
    return np.array(d.CAM.calc_matrix_camera(deps, x=1080, y=1920, scale_x=1., scale_y=1.)) @ np.array(d.CAM.matrix_world.inverted())

def descendants(roots):
    out = []; seen = set(); st = list(roots)
    while st:
        o = st.pop()
        if o in seen: continue
        seen.add(o); out.append(o); st.extend(o.children)
    return out

def points(objs):
    deps = bpy.context.evaluated_depsgraph_get(); pts = []
    for ob in descendants(objs):
        if ob.hide_render or ob.type not in ('MESH', 'FONT', 'CURVE'): continue
        ev = ob.evaluated_get(deps); me = ev.to_mesh()
        try:
            a = np.array([tuple(v.co) + (1.,) for v in me.vertices], dtype=np.float64)
        finally:
            ev.to_mesh_clear()
        if len(a): pts.append(a @ np.array(ob.matrix_world).T)
    return np.concatenate(pts)

def bbox(objs):
    P = points(objs); c = P @ cam_matrix().T
    xy = np.column_stack(((c[:, 0] / c[:, 3] + 1) * 540, (1 - c[:, 1] / c[:, 3]) * 960))
    return xy.min(axis=0), xy.max(axis=0)

def fit(objs, pose, width, cy, cx=540.):
    p = list(pose)
    for _ in range(14):
        d.pose_cam(p); bpy.context.view_layer.update()
        lo, hi = bbox(objs); w = (hi[0] - lo[0]) / 1080
        delta = (lo + hi) / 2 - np.array([cx, cy])
        cp = np.array(d.CAM.calc_matrix_camera(bpy.context.evaluated_depsgraph_get(), x=1080, y=1920, scale_x=1., scale_y=1.))
        right = np.array(d.CAM.matrix_world)[:3, 0]; up = np.array(d.CAM.matrix_world)[:3, 1]
        dist = p[3]
        aim = np.array(p[:3]) + right * delta[0] * dist / (cp[0, 0] * 540) - up * delta[1] * dist / (cp[1, 1] * 960)
        p[:3] = [float(x) for x in aim]; p[3] = float(p[3] * w / width)
    d.pose_cam(p); bpy.context.view_layer.update(); lo, hi = bbox(objs)
    return p, [float(x) for x in (*lo, *hi)]

def state(j):
    """Delivered object state of output frame j (semantic source), no camera decision yet."""
    ref = SEM[j]; c = apply_base(ref / 30)
    for o, ar in HANGERS:
        o.hide_render = ar.hide_render; o.hide_viewport = ar.hide_viewport
    if ref / 30 < FX['box'] + .5:                # internal gears must not poke through the closed lid
        for gi in PARTS['m1']['insides']:
            for o in descendants([gi['root']]): o.hide_render = True; o.hide_viewport = True
    if c['row'] == 27 and ref / 30 >= FX['shake']:   # finger tremble: +-.006 total (base +-.002) so it reads on screen
        d.HANDS['kai'].location.x += .004 * math.sin(ref / 30 * 2 * math.pi * 10)
    PANEL.matrix_world = Matrix.Translation(PANEL_M.translation + Vector((0, -.001, 0))) @ PANEL_M.to_3x3().to_4x4()
    bpy.context.view_layer.update()
    return c

FSTOP = 5.6
def frame_of(t): return int(round(t * 30))

wheels = [w['root'] for w in M2['wheels']]
arms = [a['root'] for a in M2['arms']]
posts = [o for o in GROUPS['m2'] if o.name.startswith('c1_m2_post') or o.name.startswith('c1_m2_rail')]

# Fixed framings, measured once on the actual geometry.
POSE = {}
# rows 11-13: the whole M1 box (lid open), 66 % width, elevation 45
state(frame_of(76.0)); POSE['m1'], _ = fit([PARTS['m1']['root']], [.05, .06, .05, .8, 0, 55, 40], .66, 880)
# rows 24-26, 28: M2 five wheels + posts, 68 %, almost frontal
state(frame_of(200.0)); POSE['m2'], _ = fit(wheels, [0, .05, .11, .8, 0, 7, 40], .74, 1020)
# row 27: the eight-wheel drawing, 72 %
state(frame_of(212.0)); POSE['eight'], _ = fit([w['root'] for w in PARTS['eight']['wheels']], [0, .05, .11, 1., 0, 7, 40], .80, 980, cx=465.)
# rows 29-31: tens + ones wheel + the ones arm raised (state at 9 = 60 deg), 66 %, frontal
state(frame_of(236.0))
arm4 = next(a['root'] for a in M2['arms'] if a['index'] == 4)
POSE['arm'], _ = fit([wheels[3], wheels[4], arm4], [.18, .05, .16, .4, 0, 2.5, 40], .64, 880)
# row 33: five wheels + four raised arms, 77 %
state(frame_of(270.0)); POSE['wait'], _ = fit(wheels + arms, [0, .05, .14, .8, 0, 6, 40], .77, 1010)
OLD = {
    'paper': tuple(g['DATA']['cameras']['paper']),
    'm1close': tuple(g['DATA']['cameras']['m1close']),
    'score': tuple(g['DATA']['cameras']['score']),
}

def zoom(p, f):
    q = list(p); q[3] *= f; return q

def mix(a, b, u):
    return list(d.pose_mix(tuple(a), tuple(b), u))

def pose_for(j):
    t = j / 30
    if t < S('gear:add8'):                       # rows 11-13: wide while the box drops, 1 s in, then still
        land = FX['box'] + .8
        return zoom(POSE['m1'], 1.45 - .45 * d.seg(t, land, land + 1.0))
    if t < S('hard:9999'):                       # row 14 head: 1 s move to the old close view
        return mix(POSE['m1'], OLD['m1close'], (t - S('gear:add8')) / 1.0)
    if t < S('hard:crack'):                      # rows 24-26 (first 30 % is the full face)
        return zoom(POSE['m2'], 1.03 - .03 * d.seg(t, S('hard:9999'), S('hard:9999') + 1.0))
    if t < S('hard:judge'):                      # row 27
        return zoom(POSE['eight'], 1.06 - .06 * d.seg(t, S('hard:crack'), S('hard:crack') + 1.0))
    if t < S('arm:lift'):                        # row 28: 1 s back to M2
        return mix(POSE['eight'], POSE['m2'], (t - S('hard:judge')) / 1.0)
    if t < S('arm:shishi'):                      # rows 29-31: 1 s in to the arm, then still
        return mix(POSE['m2'], POSE['arm'], (t - S('arm:lift')) / 1.0)
    if t >= S('arm:wait'):                       # row 33
        return zoom(POSE['wait'], 1.04 - .04 * d.seg(t, S('arm:wait'), S('arm:wait') + 1.0))
    raise ValueError(t)

def focus_point(j):
    t = j / 30
    if t < S('hard:9999'): return Vector((.05, .045, .07)) if t < S('gear:add8') else None
    if S('arm:lift') + 1 <= t < S('arm:shishi'): return Vector((.18, .04, .15))
    return Vector((0, .045, .12))

def apply(j):
    c = state(j); p = pose_for(j); d.pose_cam(p)
    f = focus_point(j); t = j / 30
    if f is not None:
        d.CAM_D.dof.focus_distance = (d.CAM.location - f).length
        d.CAM_D.dof.aperture_fstop = FSTOP
    elif S('gear:add8') <= t < S('hard:9999'):
        default = d.CAM_D.dof.aperture_fstop
        d.CAM_D.dof.aperture_fstop = d.lerp(FSTOP, default, d.sm(min(1, (t - S('gear:add8')) / 1.0)))
    bpy.context.view_layer.update()
    return c, p

def frames_of_job():
    if 'frames' in JOB: return list(JOB['frames'])
    out = []
    for a, b in JOB['ranges']: out += list(range(a, b + 1))
    return out

frames = frames_of_job()
d.SC.render.resolution_x = 1080; d.SC.render.resolution_y = 1920; d.SC.render.resolution_percentage = 100
d.SC.eevee.taa_render_samples = 16; d.SC.render.image_settings.file_format = 'JPEG'
started = time.time(); rec = {'poses': POSE, 'frames': {}, 'anchors': {}}
key_to_frame = {}; n = 0
for j in frames:
    c, p = apply(j)
    key = (SEM[j], tuple(round(x, 7) for x in p))
    anc = {k: d.project(v) for k, v in anchors_fn(j / 30).items()}
    rec['anchors'][j] = anc
    if key in key_to_frame:
        rec['frames'][j] = {'render': key_to_frame[key], 'pose': p, 'sem': SEM[j], 'cue': c['key']}
        continue
    f = os.path.join(OUT, 'raw', '%05d.jpg' % j)
    if not os.path.exists(f):
        d.SC.render.filepath = f; bpy.ops.render.render(write_still=True, scene=d.SC.name); n += 1
        if n % 25 == 0: print('[c1claude] %d rendered, %.1fs' % (n, time.time() - started), flush=True)
    key_to_frame[key] = j
    rec['frames'][j] = {'render': j, 'pose': p, 'sem': SEM[j], 'cue': c['key']}
rec['seconds'] = time.time() - started; rec['rendered'] = n
name = JOB.get('record', 'record.json')
json.dump(rec, open(os.path.join(OUT, name), 'w'), indent=0)
print('[c1claude] DONE', n, 'rendered', len(frames), 'frames', '%.1fs' % rec['seconds'], flush=True)
