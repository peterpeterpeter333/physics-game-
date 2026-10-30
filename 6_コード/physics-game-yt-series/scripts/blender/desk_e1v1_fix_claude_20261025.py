"""E-1 scene fixes by Claude (2026-10-25). New file; no existing source is edited.

Builds the frozen E-1 stage from desk_e1v1.py in memory (background Blender),
reproduces the delivered state (approved accident tint, hat fit, flagship hand),
then applies only the requested changes for four scenes:
  A  rows 1-6   : closer/higher chart camera, larger fleet/marks/arrow
  B  rows 15-16 : torch + globe composition, lit/night contrast, noon band, towns
  C  rows 26-27 : chart camera, thicker 70 km arrow and ship mark
  D  rows 30-32 : chart camera, thicker drift lines/currents, fog
  E  row 41     : same pose/size as the opening
Usage:
  E1FIX_JOB=job.json Blender -b --python-use-system-env --python THIS.py
job: {"mode":"probe"|"render","frames":[...],"out":DIR,"scale":1.0,"samples":16}
"""
import os, sys, json, math, runpy, time, hashlib

W = '/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
SRC = '/private/tmp/ys/ys-chain-e1v1'
FINAL = '/private/tmp/ys/ys-chain-e1v1-final2-meaningful-motion-20261025'
JOB = json.load(open(os.environ['E1FIX_JOB']))
t0 = time.time()
def log(*a): print('[E1FIX %.1fs]' % (time.time()-t0), *a, flush=True)

sys.argv = ['blender', '--', '--cache', SRC, '--samples', str(JOB.get('samples', 16)), '--scale', str(JOB.get('scale', 1.0))]
ns = runpy.run_path(W+'/scripts/blender/desk_e1v1.py', run_name='e1_claude_fix')
g = ns['apply'].__globals__
import bpy
from mathutils import Vector, Euler
d, ext, PARTS, GROUPS = g['d'], g['ext'], g['PARTS'], g['GROUPS']
S, E, T, current = g['S'], g['E'], g['T'], g['current']
PI = math.pi
log('stage built')

POSES = json.load(open(FINAL+'/blender/delivered-camera-poses.json'))['poses']
ACT = json.load(open('/private/tmp/ys/ys-chain-e1v1-actions-final-20261024/render/report.json'))
HAT_NEW_X = ACT['hatFit']['newX']
TINT_AMOUNT, TINT_COLOR = .06, (.72, .83, 1.)
OWN_LIGHT_COLORS = {ld: tuple(ld.color) for ld, _ in d.LIGHTS}

# ---------------------------------------------------------------- parameters
K = JOB.get('fleetK', 1.6)                     # fleet model scale versus delivered
SHIP0 = .07/.16
MOVE = Vector(g['DATA']['map']['fleetMove'])
# Two quiet echelons after the 1.5 s move (world x,y). Indices 0-3 are the
# four lost ships (flagship 0), beside the Scilly rocks; 4-6 are the others.
FLEET_END = [(.045-.022*i, .03-.05*i) for i in range(4)]+[(-.085-.022*j, .035-.05*j) for j in range(3)]
if JOB.get('leadLost'):
    # The four lost ships are the convoy's leading pairs (nearest the rocks); the
    # three survivors are the trailing ships, which stay for the final image.
    _A, _B = FLEET_END[:4], FLEET_END[4:]
    FLEET_END = [_A[0], _B[0], _A[1], _B[1], _A[2], _B[2], _A[3]]
FLEET_Z = .007
HAND_Z = .043*1.55
HAT_XY = tuple(JOB.get('hat', (.15, -.262)))
MAP_EL = JOB.get('mapEl', 47.)
MAP_WIDTH = JOB.get('mapWidth', .80)
TORCH_AZ = JOB.get('torchAz', -50.)
TORCH_EL = JOB.get('torchEl', 22.)
GLOBE_WIDTH = JOB.get('globeWidth', .60)
PHI_S = JOB.get('phiS', -45.)          # sub-torch (noon) meridian, world angle
ROT_OFF = math.radians(PHI_S+90)
TORCH_DIST = JOB.get('torchDist', .27)
TORCH_SCALE = JOB.get('torchScale', 1.35)
DOLL_K = 2.0

gc = Vector((0, .2, .19))

# --------------------------------------------------- geometry modifications
def scale_curve(o, center, k, bevel=None):
    for sp in o.data.splines:
        for p in sp.points:
            v = Vector(p.co[:3]); v = center+(v-center)*k; p.co = (*v, 1)
    if bevel: o.data.bevel_depth = bevel

def scale_mesh(o, center, k):
    for v in o.data.vertices: v.co = center+(v.co-center)*k

def owned(group, pred=lambda o: True):
    return [o for o in GROUPS[group] if pred(o)]

def is_curve(o): return o.type == 'CURVE'
def is_mesh(o): return o.type == 'MESH'

# Marks: rings 2x radius, 2x line; offset arrow thick yellow, tip 2.2x.
th = Vector(g['DATA']['map']['thought']); rl = Vector(g['DATA']['map']['real'])
for o in GROUPS['marks']:
    if o.type == 'CURVE' and o.data.materials and o.data.materials[0] in (d.MATS['e1thought'], d.MATS['e1real']):
        c = th if o.data.materials[0] == d.MATS['e1thought'] else rl
        scale_curve(o, c, 2.0, .0032)
offset_line = next(o for o in GROUPS['marks'] if o.type == 'CURVE' and o.data.materials and o.data.materials[0] == d.MATS['e1yellow'])
offset_tip = next(o for o in GROUPS['marks'] if o.type == 'MESH' and o.data.materials and o.data.materials[0] == d.MATS['e1yellow'])
# The arrow runs between ring edges (not centres) so both marks stay readable.
dv = (rl-th).normalized()
a0, b0 = th+dv*.034, rl-dv*.034
sp = offset_line.data.splines[0]; sp.points[0].co = (*a0, 1); sp.points[1].co = (*b0, 1)
offset_line.data.bevel_depth = .0042
side = Vector((-dv.y, dv.x, 0))*.019
for v, p in zip(offset_tip.data.vertices, [b0+dv*.012, b0-dv*.026+side, b0-dv*.026-side]): v.co = p
offset_line.data.bevel_factor_mapping_end = 'SPLINE'

# Fleet scale.
for s in PARTS['fleet']: s['root'].scale = (SHIP0*K,)*3

# 70 km shift: mark ring 2x, arrow thick (length = chart scale, unchanged).
shift_ring = [o for o in GROUPS['shift'] if o.type == 'CURVE' and o.data.materials and o.data.materials[0] == d.M_INKW]
SHIP_MARK = Vector((-.10, -.12, .01))
for o in shift_ring: scale_curve(o, SHIP_MARK, 2.0, .0032)
km_line = next(o for o in GROUPS['shift'] if o.type == 'CURVE' and o not in shift_ring)
km_tip = next(o for o in GROUPS['shift'] if o.type == 'MESH')
ka = Vector((-.10+.03, -.12, .012)); kb = Vector((-.10+g['DATA']['map']['km70World'], -.12, .012))
sp = km_line.data.splines[0]; sp.points[0].co = (*ka, 1); sp.points[1].co = (*kb, 1)
km_line.data.bevel_depth = .0045; km_line.data.bevel_factor_mapping_end = 'SPLINE'
for v, p in zip(km_tip.data.vertices, [kb+Vector((.012, 0, 0)), kb+Vector((-.026, .019, 0)), kb+Vector((-.026, -.019, 0))]): v.co = p
# The 70 km scale bar now starts at the ring edge; the true 70 km span is from
# the mark centre to the tip (unchanged world length .16 = 70 km on this chart).

# Drift: thicker guess/truth lines, larger day dots, bold blue currents.
for (guess, truth, dot) in g['drift']['pairs']:
    for o in guess: o.data.bevel_depth = .0026
    truth.data.bevel_depth = .0040
    dot.scale = (2.2,)*3
for o in g['drift']['currents']:
    if o.type == 'CURVE': o.data.bevel_depth = .0034
    else:
        vs = [v.co.copy() for v in o.data.vertices]; tip = vs[0]
        for v in o.data.vertices: v.co = tip+(v.co-tip)*2.0

# Torch scene: larger towns, thick noon band, larger/brighter torch, arc arrow.
for i in (1, 2):
    r = PARTS['dolls'][i]; r.scale = tuple(v*DOLL_K for v in r.scale)
noon_curve = next(o for o in GROUPS['noon'] if o.type == 'CURVE')
noon_curve.data.bevel_depth = .0062
# Keep the band just outside the (now night/day) globe surface.
for i, p in enumerate(noon_curve.data.splines[0].points):
    a = -PI/2+PI*i/90; p.co = (-.1245*math.cos(a), 0, .1245*math.sin(a), 1)
torch_root = PARTS['torch']['root']
TORCH_LIGHT = PARTS['torch']['light']
TORCH_LIGHT.spot_size = math.radians(62); TORCH_LIGHT.spot_blend = JOB.get('spotBlend', .5)
noon_mat = d.mat('e1fixNoon', '#ffd23f', .4, emit='#ffcf2e', strength=2.2)
noon_curve.data.materials[0] = noon_mat
# Rotation direction: a cream arc arrow just above the north pole (fixed in world).
arc_mat = d.mat('e1fixArc', '#fffdf1', .5, emit='#fffdf1', strength=.9)
_arc_before = set(bpy.data.objects)
arc_root = ext.root('fixRotArc')
ARC_R, ARC_Z = .072, gc.z+.138
pts = [(ARC_R*math.cos(math.radians(a)), .2+ARC_R*math.sin(math.radians(a)), ARC_Z) for a in [-205+1.6*k for k in range(101)]]
ext.line('fixRotArcLine', pts, .0030, arc_mat, arc_root)
a_end = math.radians(-205+160); tipc = Vector((ARC_R*math.cos(a_end), .2+ARC_R*math.sin(a_end), ARC_Z))
tang = Vector((-math.sin(a_end), math.cos(a_end), 0)); rad = Vector((math.cos(a_end), math.sin(a_end), 0))
ext.mesh('fixRotArcTip', [tipc+tang*.016, tipc-tang*.010+rad*.011, tipc-tang*.010-rad*.011], [(0, 1, 2)], arc_mat, arc_root)
# All arc objects (line + tip + root), created just above; hidden except in rows 15-16.
ARC_OBJS = list(set(bpy.data.objects)-_arc_before)
assert len(ARC_OBJS) == 3, ARC_OBJS
for o in ARC_OBJS: d.show(o, False)
ext.configure_children(list(d.SC.objects))

# ------------------------------------------------------------- camera fitting
def proj_box(points):
    q = [d.project(v) for v in points]
    return [min(v[0] for v in q), min(v[1] for v in q), max(v[0] for v in q), max(v[1] for v in q)]

def chart_points():
    pts = []
    for o in GROUPS['chart']:
        if o.type == 'MESH' and o.name.startswith('e1_chart_paper'):
            pts += [o.matrix_world@v.co for v in o.data.vertices]
    assert pts
    return pts

def fit(pose, points, width, cy, cx=540):
    p = list(pose)
    for _ in range(6):
        lo, hi = .15, 3
        for _ in range(22):
            p[3] = (lo+hi)/2; g['use_pose'](p); b = proj_box(points)
            lo, hi = (p[3], hi) if (b[2]-b[0])/1080 > width else (lo, p[3])
        g['use_pose'](p); b = proj_box(points)
        ex, ey = (b[0]+b[2])/2-cx, (b[1]+b[3])/2-cy
        if abs(ex) < .3 and abs(ey) < .3: break
        az, el = math.radians(p[4]), math.radians(p[5])
        right = Vector((math.cos(az), math.sin(az), 0)); up = Vector((-math.sin(az)*math.sin(el), math.cos(az)*math.sin(el), math.cos(el)))
        f = 1920*p[6]*.78/36
        delta = right*(ex*p[3]/f)-up*(ey*p[3]/f)
        for i in range(3): p[i] += delta[i]
    return tuple(p)

g['apply'](20.0)
MAP_POSE = fit((0, -.08, .02, 1.0, 0, MAP_EL, 40), chart_points(), MAP_WIDTH, JOB.get('mapCy', 800))
log('MAP_POSE', MAP_POSE, proj_box(chart_points()))

def globe_points():
    s = g['globe']['sphere']; return [s.matrix_world@v.co for v in s.data.vertices]

_ps = math.radians(PHI_S)
TORCH_ROOT = Vector((0, .2, .19))+TORCH_DIST*Vector((math.sin(_ps), -math.cos(_ps), 0))
def set_torch_model():
    torch_root.location = TORCH_ROOT; torch_root.scale = (TORCH_SCALE,)*3; torch_root.rotation_euler = (0, 0, ROT_OFF)
# Day/night split follows the torch direction (was world X for a torch on -X).
_nt = g['globe']['nightmat'].node_tree
_xyz = next(n for n in _nt.nodes if n.type == 'SEPXYZ')
_ramp = next(n for n in _nt.nodes if n.type == 'MAP_RANGE')
_geo = next(n for n in _nt.nodes if n.type == 'NEW_GEOMETRY')
if PHI_S != -90:
  _sub = _nt.nodes.new('ShaderNodeVectorMath'); _sub.operation = 'SUBTRACT'; _sub.inputs[1].default_value = (0, .2, .19)
  _dot = _nt.nodes.new('ShaderNodeVectorMath'); _dot.operation = 'DOT_PRODUCT'; _dot.inputs[1].default_value = (-math.sin(_ps), math.cos(_ps), 0)
  _nt.links.new(_geo.outputs['Position'], _sub.inputs[0]); _nt.links.new(_sub.outputs['Vector'], _dot.inputs[0])
  _nt.links.new(_dot.outputs['Value'], _ramp.inputs['Value'])
g['noon'].rotation_euler = (0, 0, ROT_OFF)
# Day side glows softly in its own colour; night side stays navy.
_p = d.principled(g['globe']['nightmat'])
_mixn = next(n for n in _nt.nodes if n.type == 'MIX_RGB' or (n.type == 'MIX' and n.data_type == 'RGBA'))
_tex = _mixn.inputs['Color1'].links[0].from_socket
_inv = _nt.nodes.new('ShaderNodeMath'); _inv.operation = 'SUBTRACT'; _inv.inputs[0].default_value = 1
_nt.links.new(_ramp.outputs['Result'], _inv.inputs[1])
_em = _nt.nodes.new('ShaderNodeMath'); _em.operation = 'MULTIPLY'; _em.inputs[1].default_value = JOB.get('dayEmit', .5)
_nt.links.new(_inv.outputs[0], _em.inputs[0])
_nt.links.new(_tex, _p.inputs['Emission Color']); _nt.links.new(_em.outputs[0], _p.inputs['Emission Strength'])

set_torch_model()
g['apply'](140.0); set_torch_model(); bpy.context.view_layer.update()
torch_pts = [o.matrix_world@v.co for o in GROUPS['torch'] if o.type == 'MESH' for v in o.data.vertices]
cx = JOB.get('torchCx', 600)
for _ in range(8):
    TORCH_POSE = list(fit((-.08, .2, .19, 1.0, TORCH_AZ, TORCH_EL, 40), globe_points(), GLOBE_WIDTH, JOB.get('torchCy', 830), cx))
    left = proj_box(torch_pts)[0]
    if left >= 45 or cx > JOB.get('torchCxMax', 700): break
    cx += min(60, 45-left)
TORCH_POSE = tuple(TORCH_POSE)
g['use_pose'](TORCH_POSE)
log('TORCH_POSE', TORCH_POSE, 'globe', proj_box(globe_points()), 'torch', proj_box(torch_pts))

# ------------------------------------------------------------- frame state
def block(j):
    t = j/30
    if j <= 1353: return 'A'
    if 3734 <= j <= 4361: return 'B'
    if 7062 <= j <= 7333: return 'C'
    if 7877 <= j <= 8864: return 'D'
    if 11370 <= j <= 11605: return 'E'
    return None

def mix(a, b, u): return d.pose_mix(a, b, u)

def camera_for(j):
    t = j/30; k = block(j)
    far = lambda p: tuple(list(p[:3])+[p[3]*1.10]+list(p[4:]))
    if k == 'A':
        return mix(tuple(list(MAP_POSE[:3])+[MAP_POSE[3]*1.06]+list(MAP_POSE[4:])), MAP_POSE, t/1.5) if t < 1.5 else MAP_POSE
    if k == 'B':
        a = S('lon:torch')
        return mix(tuple(POSES[3733]), TORCH_POSE, (t-a)/1.0) if t < a+1.0 else TORCH_POSE
    if k in 'CDE':
        a = {'C': S('clk:shift'), 'D': S('dr:drift'), 'E': S('last:clock')}[k]
        dur = {'C': 1.0, 'D': 1.0, 'E': 1.2}[k]
        if k == 'D' and t >= E('dr:drift')+.01: return MAP_POSE
        return mix(far(MAP_POSE), MAP_POSE, (t-a)/dur) if t < a+dur else MAP_POSE
    raise ValueError(j)

def fleet_base(i):
    x, y = FLEET_END[i]; return Vector((x, y, FLEET_Z))-MOVE

def lead_target():
    return fleet_base(0)+MOVE+Vector((0, 0, HAND_Z))

def state(j):
    t = j/30; k = block(j); c = current(t)
    for ld, col in OWN_LIGHT_COLORS.items(): ld.color = col
    PARTS['hat'].location.x = -.29
    PARTS['star'].location = (-.3, .38, 0); PARTS['star'].scale = (1, 1, 1)
    torch_root.location = (-.29, .2, .19); torch_root.scale = (1, 1, 1); torch_root.rotation_euler = (0, 0, 0)
    for o in ARC_OBJS: d.show(o, False)
    pts = g['apply'](t)
    first = t < S('two:need'); returning = c['row'] == 41
    if k in 'ACDE' and c['group'] in ('map', 'grid'):
        # Fleet: larger models, two echelons; same move, same quiet tilt/fade.
        for i, s in enumerate(PARTS['fleet']):
            r = s['root']; u = d.seg(t, 0, 1.5) if first else 1
            r.location = fleet_base(i)+MOVE*u
        # Offset arrow grows from the thought mark (not from the world origin).
        off = PARTS['offset']; u = off.scale[0]; off.scale = (1, 1, 1)
        offset_line.data.bevel_factor_end = max(.001, u)
        d.show(offset_tip, (not offset_line.hide_render) and u > .93)
        # 70 km arrow likewise grows from the ship mark.
        ar = g['shift']['arrow']; u = ar.scale[0]; ar.scale = (1, 1, 1)
        km_line.data.bevel_factor_end = max(.001, u); d.show(km_tip, (not km_line.hide_render) and u > .93)
        if first:
            for ld, col in OWN_LIGHT_COLORS.items():
                ld.color = tuple((1-TINT_AMOUNT)*v+TINT_AMOUNT*b for v, b in zip(col, TINT_COLOR))
        hat = PARTS['hat']
        hat.location.x, hat.location.y = HAT_XY
        if t < 8:
            p = lead_target()+MOVE*(d.seg(t, 0, 1.5)-1)
            out = d.seg(t, 2.2, 3.6)
            d.set_hand('kai', p+Vector((.22*out, -.28*out, .1*out)), 130, -28, vis=t < 3.6)
        if 12.70 <= t < 15.00:
            v = 1-d.seg(t, 12.70, 13.47)+d.seg(t, 13.70, 15.00)
            d.set_hand('kai', lead_target()+Vector((.22*v, -.28*v, .10*v)), 130, -28)
        if returning:
            sc = PARTS['shipclock']['root']; z = sc.location.z
            sc.location = (JOB.get('clockX', .178), JOB.get('clockY', .032), z)
            if t >= S('last:clock'):
                a = T('last:clock', '正確な時計'); u = d.seg(t, a-.6, a); rest = d.seg(t, a+.95, a+1.85)
                top = Vector((sc.location.x, sc.location.y, .05+z))
                contact = top+Vector((.25*(1-u), -.1*(1-u), .15*(1-u)))
                # Rest on the opening's hand pose (flagship's place), so the last image echoes the first.
                restp = lead_target() if JOB.get('endRestLead') else Vector((.10, .0, .07))
                d.set_hand('kai', contact.lerp(restp, rest), 165-35*rest, -28)
        if k == 'D':
            pol = PARTS['star']; pol.location = tuple(JOB.get('starLoc', (-.165, .10, 0))); pol.scale = (JOB.get('starScale', .55),)*3
    if k == 'B':
        set_torch_model()
        if c['group'] == 'torch':
            g['globe']['rot'].rotation_euler.z += ROT_OFF
            for o in ARC_OBJS: d.show(o, t >= S('lon:torch')+1.0)
            for i in range(2): d.show_tree(g['town_suns'][i], False)
            lv = JOB.get('torchRoom', .24)
            for ld, p0 in d.LIGHTS: ld.energy = p0*lv
            d.BGN.inputs[1].default_value = .35*lv
            d.set_emit(d.MATS['winGlow'], 3.5*(.7+.3*lv))
            a = T('lon:torch', '懐中電灯'); TORCH_LIGHT.energy = JOB.get('torchEnergy', 25.0)*d.seg(t, a, a+.3)
            d.set_emit(noon_mat, 1.4+1.6*d.seg(t, T('lon:noon', '昼の12時'), T('lon:noon', '昼の12時')+.25) if t >= S('lon:noon') else 1.4)
            if S('lon:torch') <= t < T('lon:torch', '回すと')+.5:
                a = T('lon:torch', '懐中電灯'); p = torch_root.matrix_world@Vector((-.012, -.003, .018))
                u = d.seg(t, a-.7, a); v = d.seg(t, a+.5, a+1.4)
                d.set_hand('kai', p+Vector((-.20*(1-u+v), -.18*(1-u+v), .10*(1-u+v))), -40, -35)
    g['use_pose'](camera_for(j))
    bpy.context.view_layer.update()
    return pts

def town_info(j):
    t = j/30; out = {}
    if block(j) != 'B' or current(t)['group'] != 'torch': return out
    rot = math.degrees(g['globe']['rot'].rotation_euler.z)
    for name, i, lon in [('east', 1, 28), ('west', 2, -28)]:
        r = PARTS['dolls'][i]
        top = r.matrix_world@Vector((0, 0, .105))
        foot = r.matrix_world.translation
        phi = lon+rot
        facing = (foot-gc).normalized().dot((d.CAM.matrix_world.translation-foot).normalized())
        out[name] = {'top': d.project(top), 'foot': d.project(foot), 'phi': phi, 'noon': phi >= PHI_S, 'facing': facing}
    return out

# ------------------------------------------------------------------ run
mode = JOB['mode']; out = JOB['out']; os.makedirs(out, exist_ok=True)
scene = d.SC; bpy.context.window.scene = scene
scene.render.resolution_x = round(1080*JOB.get('scale', 1.0)); scene.render.resolution_y = round(1920*JOB.get('scale', 1.0))
scene.render.resolution_percentage = 100
scene.eevee.taa_render_samples = JOB.get('samples', 16)
scene.render.image_settings.file_format = 'JPEG'; scene.render.image_settings.quality = 95
names = sorted(json.load(open(FINAL+'/blender/desk/anchors.json'))['anchors'])
rec = {'poses': {'map': MAP_POSE, 'torch': TORCH_POSE}, 'frames': {}}
recpath = out+'/fix-record.json'
if os.path.exists(recpath): rec = json.load(open(recpath)); rec['poses'] = {'map': MAP_POSE, 'torch': TORCH_POSE}
for j in JOB['frames']:
    target = out+'/%05d.jpg' % j
    if os.path.exists(target) and mode == 'render' and str(j) in rec['frames']: continue
    pts = state(j)
    anc = {n: (d.project(pts[n]) if n in pts else [0., 0., 0.]) for n in names}
    if block(j) in 'ACDE':
        # Rows 3-4 labels: "本当の 位置" (drawn 95 px above its anchor) goes just
        # below the red mark; "シリー諸島" (drawn 65 px below) goes above the rocks.
        pr = d.project(rl); anc['real'] = [pr[0], pr[1]+JOB.get('realDy', 160), pr[2]]
        ps = d.project(Vector((.113, -.023, .02))); anc['scilly'] = [ps[0], ps[1]-JOB.get('scillyDy', 130), ps[2]]
    info = {'pose': list(camera_for(j)), 'anchors': anc, 'towns': town_info(j)}
    if JOB.get('measure'):
        cp = chart_points(); info['chartBox'] = proj_box(cp)
        if block(j) == 'B': info['globeBox'] = proj_box(globe_points()); info['torchBox'] = proj_box([o.matrix_world@v.co for o in GROUPS['torch'] if o.type == 'MESH' for v in o.data.vertices])
        fl = [o.matrix_world@v.co for s in PARTS['fleet'] for o in ext.descendants(s['root']) if o.type == 'MESH' and not o.hide_render for v in o.data.vertices]
        if fl: info['fleetBox'] = proj_box(fl)
        if block(j) == 'D': info['starLoc'] = list(PARTS['star'].location); info['starTop'] = d.project(PARTS['star'].matrix_world@Vector((0, -.003, .35)))
        hp = [o.matrix_world@v.co for o in GROUPS['hat'] if o.type == 'MESH' and not o.hide_render for v in o.data.vertices]
        if hp: info['hatBox'] = proj_box(hp)
    scene.render.filepath = target
    bpy.ops.render.render(write_still=True, scene=scene.name)
    rec['frames'][str(j)] = info
    if len(rec['frames']) % 20 == 0:
        json.dump(rec, open(recpath, 'w')); log('frame', j)
json.dump(rec, open(recpath, 'w'))
log('done', len(JOB['frames']))
