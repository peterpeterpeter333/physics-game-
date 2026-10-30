# 技術の疑問の鎖 序章2（ys-chain-00b）・序章3（ys-chain-00c）の 3D：エニグマの中を全部開ける。
#   B=/Applications/Blender.app/Contents/MacOS/Blender
#   $B -b --factory-startup -P scripts/blender/enigma_open.py -- --out /private/tmp/ys/ys-chain-00c/blender [--shots …]
#   序章2 の shot（alb・odo・rstep）は --out /private/tmp/ys/ys-chain-00b/blender --shots alb,odo,rstep
# 序章（scripts/blender/enigma.py）の配線の表・円板の形・道の計算を import して使う（enigma.py は変えない）。
#
# 図のために決めた値（全部ここで計算し、assert で確かめる。手で道を引かない）
#  - 配線：I・II・III・折り返し B（enigma.py と同じ）。並び 左 I・真ん中 II・右 III。輪の設定は A（窓の文字＝円板の向き）。
#  - 電流の道（序章と同じ設定）：始めの向き J・H・A。キー A を押すと、先に右が一目盛り進んで J・H・B、その後で電流。
#      差し込み板なし：A → C → U → W → 折り返し → V → R → O → G（序章と同じ）。同じ設定で G → … → A（逆にたどる）。
#      差し込み板あり（序章3 の例。AJ・BQ・CW・DK・EZ・FL・HU・IP・MR・NX の 10本。序章の 10本の AQ・BJ を AJ・BQ に変えた）：
#      A →①差し込み J →②右 W →③真ん中 D →④左 F →⑤折り返し S →⑥左 N →⑦真ん中 A →⑧右 Z →⑨差し込み E。9回とも文字が変わる。
#  - 1枚の円板（I）：向き 0 で 入口 A → 出口 E、一目盛り回ると 入口 A → 出口 J（右の面の B の導線 B→K が来て、K−1＝J）。
#  - 進み方（切り欠き I＝Q、II＝E、III＝V。窓の文字がこの文字のときに押すと、隣を進める）：
#      爪1 は右の円板の歯車を毎回押す。爪2 は右の円板の切り欠きの輪の上に乗り、切り欠きが来たときだけ落ちて、真ん中の歯車も押す。
#      爪3 は真ん中の切り欠きの輪の上に乗り、切り欠きが来たときだけ落ちて、左の歯車と、真ん中の切り欠き（真ん中そのもの）を押す。
#      → 二重送り。J・D・T から 5回：JDU、JDV、JEW、KFX、KFY（真ん中は JDV→JEW と JEW→KFX で 2回続けて進む）。
#      周期：この規則で状態がもとに戻るまで 16,900 回（＝26×25×26。下で数えて assert）。
#  - 距離計（序章2）：右が Z→A のとき真ん中が進むだけの単純な数え方。A・A・W から 4回で A・B・A、さらに 26回で A・C・A。
#  - アルベルティの円板（序章2）：図は 26文字にした（本物は 24 の区切り）。外は A〜Z、内はばらばらの並び（下の ALB_IN）。
import bpy, bmesh, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bl_common import *
import enigma as EN
from enigma import (ABC, WIRE, UKW, N, fwd, bwd, press, Pal, rotor, reflector, entry, set_turn, P, ANG, RAD, HT, CR,
                    XU, XL, XM, XR, XE, rotor_core, draw_path, draw_path_rev, YEL, LIGHTC, ORANGE, BLUEG, BRASS, WOOD, WOOD2,
                    PANEL, KEYC, LAMP0, STEEL)

CYAN = '#6adfff'; GREEN = '#83ecc0'; PINK = '#ff8ac2'; CABLE = '#d28a52'
PITCH = 2 * math.pi / N

# ---------------- 計算（序章3） ----------------
S0 = (9, 7, 0); S1 = (9, 7, 1)
PA = press(S1, 0); PG = press(S1, 6)
assert [ABC[c] for c in PA] == list('ACUWVROG') and PG == PA[::-1]
PAIRS = ['AJ', 'BQ', 'CW', 'DK', 'EZ', 'FL', 'HU', 'IP', 'MR', 'NX']
PLUG = list(range(N))
for a, b in PAIRS: PLUG[ABC.index(a)] = ABC.index(b); PLUG[ABC.index(b)] = ABC.index(a)
assert len({c for pr in PAIRS for c in pr}) == 20
PF = press(S1, PLUG[0])                       # 差し込み板を通った後の道（J から）
FULL = [0] + PF + [PLUG[PF[-1]]]              # A J W D F S N A Z E
assert ''.join(ABC[c] for c in FULL) == 'AJWDFSNAZE', FULL
assert all(FULL[i] != FULL[i + 1] for i in range(9))
# どの文字も自分自身には変わらない（この設定の 26文字すべて）
for k in range(N): assert PLUG[press(S1, PLUG[k])[-1]] != k
# 1枚の円板
assert fwd('I', 0, 0) == 4 and fwd('I', 1, 0) == 9

NOTCH = {'I': 'Q', 'II': 'E', 'III': 'V'}
def step_state(p):
    L, M, R = p
    p3 = M == ABC.index(NOTCH['II']); p2 = R == ABC.index(NOTCH['III'])
    return ((L + p3) % N, (M + (p2 or p3)) % N, (R + 1) % N), p2, p3
STEP0 = tuple(ABC.index(c) for c in 'JDT')
STEPS = [STEP0]; ENG = []
for _ in range(5):
    s, p2, p3 = step_state(STEPS[-1]); STEPS.append(s); ENG.append((True, p2, p3))
assert [''.join(ABC[c] for c in s) for s in STEPS] == ['JDT', 'JDU', 'JDV', 'JEW', 'KFX', 'KFY']
def _period(s0):
    s = s0; n = 0
    while True:
        s = step_state(s)[0]; n += 1
        if s == s0: return n
assert _period(S0) == 16900 == 26 * 25 * 26
WN = lambda s: ''.join(ABC[c] for c in s)

# ---------------- 共通の小物 ----------------
def glow(name, pts, color=YEL, strength=0.9, radius=0.04, smooth=True, head=True):
    m = mat(name + '-m', color, rough=.4, emit=color, strength=strength, unique=True)
    pp = smooth_pts(pts, 5, frac=0.3, cap=0.07) if smooth else [Vector(p) for p in pts]
    o = curve(name, pp, radius, m, res=4); o.data.bevel_factor_end = 0
    hd = sphere(name + '-head', radius * 1.9, pp[0], mat(name + '-hm', LIGHTC, emit=LIGHTC, strength=1.5, unique=True), seg=16, ring=10)
    return {'obj': o, 'pts': pp, 'head': hd, 'mat': m}

def orient(o, a, b):
    a, b = Vector(a), Vector(b); d = b - a
    o.location = (a + b) / 2; o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler(); o.scale = (1, 1, max(d.length, 1e-4))

def bar(name, r, m):
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=r, depth=1.0, location=(0, 0, 0))
    o = bpy.context.active_object; o.name = name; bpy.ops.object.shade_smooth()
    o.data.materials.append(m); return o

def annulus_prism(name, prof, rin, x0, x1, m):
    """x 軸まわりの輪（外の形が prof＝[(角, 外の半径)…] の順、内は半径 rin の円）。x0〜x1 の厚さ。角は P() と同じ（0＝上、+y へ増える）。"""
    me = bpy.data.meshes.new(name); bm = bmesh.new(); V = []
    for a, r in prof:
        V.append([bm.verts.new((x, r * math.sin(a), r * math.cos(a))) for x in (x0, x1)] +
                 [bm.verts.new((x, rin * math.sin(a), rin * math.cos(a))) for x in (x0, x1)])
    n = len(V)
    for i in range(n):
        a, b = V[i], V[(i + 1) % n]
        for f in ((a[0], b[0], b[1], a[1]), (a[2], a[3], b[3], b[2]), (a[0], a[2], b[2], b[0]), (a[1], b[1], b[3], a[3])):
            try: bm.faces.new(f)
            except ValueError: pass
    bm.normal_update(); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); me.materials.append(m)
    return o

def half_shell(name, r, x0, x1, m, keep_front=True):
    """円板の外の殻の半分（y<0 が手前）。中の導線を見せるために、手前の半分を外す。"""
    bm = bmesh.new(); seg = 64; V = []
    a0, a1 = (math.pi, 2 * math.pi) if keep_front else (0, math.pi)
    for i in range(seg + 1):
        a = a0 + (a1 - a0) * i / seg
        V.append([bm.verts.new((x, r * math.sin(a), r * math.cos(a))) for x in (x0, x1)])
    for i in range(seg):
        bm.faces.new((V[i][0], V[i + 1][0], V[i + 1][1], V[i][1]))
    c0 = bm.verts.new((x0, 0, 0)); c1 = bm.verts.new((x1, 0, 0))
    for i in range(seg):
        bm.faces.new((c0, V[i + 1][0], V[i][0])); bm.faces.new((c1, V[i][1], V[i + 1][1]))
    bm.faces.new((V[0][0], V[0][1], c1, c0)); bm.faces.new((V[seg][1], V[seg][0], c0, c1))
    me = bpy.data.meshes.new(name); bm.normal_update(); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); me.materials.append(m)
    for p in me.polygons: p.use_smooth = False
    return o

def fit(pts=None, margin=0.05, objs=None):
    """カメラの位置はそのまま、向きと焦点距離を変えて、点（または物の箱の角）が画面いっぱいに入るようにする。
    shift は使わない（world_to_camera_view が shift を見ないので、アンカーがずれる）。"""
    sc = bpy.context.scene; cam = sc.camera; cam.data.shift_x = cam.data.shift_y = 0
    if pts is None:
        pts = []
        for o in (objs or bpy.context.scene.objects):
            if o.type == 'MESH' and not o.hide_render:
                pts += [o.matrix_world @ Vector(c) for c in o.bound_box]
            elif o.type == 'CURVE' and not o.hide_render:
                pts += [o.matrix_world @ p.co.xyz for sp in o.data.splines for p in sp.points]
    pts = [Vector(p) for p in pts]
    for _ in range(6):
        bpy.context.view_layer.update()
        vs = [world_to_camera_view(sc, cam, p) for p in pts]
        cx = (min(v.x for v in vs) + max(v.x for v in vs)) / 2; cy = (min(v.y for v in vs) + max(v.y for v in vs)) / 2
        fr = cam.data.view_frame(scene=sc)            # 右上・右下・左下・左上（カメラの中の座標、奥行き一定）
        tr, br, bl, tl = fr
        q = bl + (br - bl) * cx + (tl - bl) * cy
        d = (cam.matrix_world.to_3x3() @ q).normalized()
        aim(cam, cam.location, cam.location + d * 10)
    bpy.context.view_layer.update()
    vs = [world_to_camera_view(sc, cam, p) for p in pts]
    k = min(min((0.5 - margin) / max(1e-6, abs(v.x - 0.5)) for v in vs), min((0.5 - margin) / max(1e-6, abs(v.y - 0.5)) for v in vs))
    cam.data.lens *= k
    bpy.context.view_layer.update()

def lights_std(target=(0, 0, 0), power=1100):
    lights(key=(4, -7, 7), fill=(-7, -5, 2), rim=(-1, 6, 5), power=power, target=target)

# ================= 円板1枚（切って中を見せる・一目盛り回す） =================
BHT = 0.36; CHT = 0.5                         # 厚い円板（中の導線が見えるように）
def big_rotor(name, wiring_name, pal, x=0.0, hl=(), ht=None, body=None):
    """円板 I。右の面（表）の接点 j → 左の面（裏）の接点 W[j]。hl＝光らせる導線 [(j, 色)]"""
    BHT = ht or globals()['BHT']
    root = empty(name, (x, 0, 0)); W = [ABC.index(WIRE[wiring_name][j]) for j in range(N)]
    objs = []
    if body: objs.append(cyl(name + '-body', RAD - 0.01, 2 * BHT, (x, 0, 0), body, rot=(0, math.pi / 2, 0), verts=96))
    for s in (-1, 1): objs.append(torus(name + '-rim%d' % s, RAD, 0.03, (x + s * BHT, 0, 0), pal.rim, rot=(0, math.pi / 2, 0)))
    for j in range(N):
        objs.append(sphere('%s-cr%d' % (name, j), 0.06, P(x + BHT, j), pal.contact, seg=14, ring=8))
        objs.append(sphere('%s-cl%d' % (name, j), 0.06, P(x - BHT, j), pal.contact, seg=14, ring=8))
        objs.append(curve('%s-w%d' % (name, j), [P(x + BHT, j), P(x - BHT, W[j])], 0.012, pal.wire, res=2))
    hls = {}
    for j, col in hl:
        m = mat('%s-hl%d' % (name, j), col, emit=col, strength=0, unique=True)
        o = curve('%s-hlw%d' % (name, j), [P(x + BHT, j), P(x - BHT, W[j])], 0.032, m, res=4); o.hide_render = True
        objs.append(o); hls[j] = (o, m, col)
    for o in objs: parent(o, root)
    return root, hls, W

def show_hl(h, a):
    o, m, col = h; o.hide_render = a <= 0.01; set_emit(m, col, 2.2 * a)

# ---- rcut：円板を切る → A→E、B→K ----
CAM_CUT = ((3.0, -2.6, 4.0), (0.0, 0.2, 0.0), 40)
def b_rcut():
    pal = Pal('c')
    root, hls, W = big_rotor('C', 'I', pal, hl=((0, YEL), (1, CYAN)), ht=CHT)
    sh = mat('shell', '#2b3a5c', rough=.45, metal=.2, alpha=1.0, unique=True)
    front = half_shell('shellF', RAD + 0.04, -CHT - 0.01, CHT + 0.01, sh, True)
    back = half_shell('shellB', RAD + 0.06, -CHT - 0.012, CHT + 0.012, mat('shellb', '#1d2840', rough=.6, alpha=.35, unique=True), False)
    camera(*CAM_CUT[:2], lens=CAM_CUT[2]); lights_std(); fit(objs=[o for o in bpy.data.objects if o.name.startswith('C-')], margin=.04)
    return {'hls': hls, 'front': front, 'sh': sh, 'W': W}
def a_rcut(S, i):
    u = i / 89
    out = seg(u, .05, .32)
    S['front'].location = (0, -1.6 * out, 0.9 * out); set_alpha(S['sh'], 1 - out)
    S['front'].hide_render = out > .98
    show_hl(S['hls'][0], seg(u, .38, .5)); show_hl(S['hls'][1], seg(u, .68, .8))
def an_rcut(S, i):
    a = {}
    for L in 'AB': a['in' + L] = P(CHT + 0.02, ABC.index(L))
    for L in 'EK': a['out' + L] = P(-CHT - 0.02, ABC.index(L))
    a['faceR'] = P(CHT, 13, RAD + 0.15); a['faceL'] = P(-CHT, 13, RAD + 0.15); a['top'] = P(0, 0, RAD + 0.2)
    a['bottom'] = P(0, 13, RAD + 0.2)
    return a

# ---- rstep：入口（動かない）A → 円板 → 出口（動かない）。一目盛り回ると出口が E → J ----
XIN, XOUT = 1.15, -1.15
def plate(name, x, pal):
    root = empty(name, (x, 0, 0))
    objs = [cyl(name + '-b', RAD, 0.08, (x, 0, 0), mat('plateb', '#2a3550', rough=.6, alpha=.75, unique=True), rot=(0, math.pi / 2, 0), verts=96),
            torus(name + '-r', RAD, 0.025, (x, 0, 0), pal.rim, rot=(0, math.pi / 2, 0))]
    for j in range(N): objs.append(sphere('%s-c%d' % (name, j), 0.05, P(x, j), pal.contact, seg=12, ring=8))
    for o in objs: parent(o, root)
    return root
CAM_STEP1 = ((3.4, -3.0, 5.0), (0.0, 0.3, 0.1), 40)
def rstep_pts(o):
    j = (0 + o) % N; out = fwd('I', o, 0)
    return [P(XIN + 0.9, 0), P(XIN, 0), P(BHT, 0), P(-BHT, out), P(XOUT, out), P(XOUT - 0.9, out)], j, out
def b_rstep():
    pal = Pal('s'); pf = Pal('f')
    root, hls, W = big_rotor('C', 'I', pal, hl=((0, YEL), (1, CYAN)), body=mat('rbody', '#5d7bb5', rough=.4, alpha=.22, unique=True))
    plate('PIN', XIN, pf); plate('POUT', XOUT, pf)
    pts0, _, o0 = rstep_pts(0); pts1, _, o1 = rstep_pts(1)
    assert (o0, o1) == (4, 9)
    # 道の中の部分が、回したあとの導線と重なるか（円板の導線 j の両端の世界の位置）
    S = {'root': root, 'hls': hls, 'p0': glow('p0', pts0, YEL, smooth=False), 'p1': glow('p1', pts1, CYAN, smooth=False)}
    for o, pts, j in ((0, pts0, 0), (1, pts1, 1)):
        set_turn(root, o); bpy.context.view_layer.update()
        mw = root.matrix_world
        a = mw @ (P(BHT, j) - Vector((0, 0, 0))); b = mw @ (P(-BHT, W[j]))
        assert (a - pts[2]).length < 1e-4 and (b - pts[3]).length < 1e-4, ('rstep の道が導線と重ならない', o)
    set_turn(root, 0)
    camera(*CAM_STEP1[:2], lens=CAM_STEP1[2]); lights_std()
    fit([P(XIN + 0.9, 0), P(XOUT - 0.9, 13)] + [P(x, j, RAD) for x in (XIN, XOUT) for j in range(0, 26, 2)], margin=.05)
    return S
def a_rstep(S, i):
    u = i / 95
    intro = seg(u, 0, .22); turn = seg(u, .55, .7)
    set_turn(S['root'], -3 * (1 - intro) + turn)
    show_hl(S['hls'][0], seg(u, .26, .32) * (1 - seg(u, .5, .55)) + 0.35 * seg(u, .55, .7))
    draw_path(S['p0'], seg(u, .26, .48), head=True); S['p0']['obj'].hide_render = u < .26 or u > .55
    S['p0']['head'].hide_render = S['p0']['head'].hide_render or u > .55
    show_hl(S['hls'][1], seg(u, .74, .8))
    draw_path(S['p1'], seg(u, .74, .96))
def an_rstep(S, i):
    return {'inA': P(XIN, 0) + Vector((0.45, 0, 0.18)), 'outE': P(XOUT, 4), 'outJ': P(XOUT, 9), 'inPlate': P(XIN, 13, RAD + 0.2),
            'outPlate': P(XOUT, 13, RAD + 0.2), 'rotor': P(0, 0, RAD + 0.25), 'rotorB': P(0, 13, RAD + 0.25)}

# ================= 3枚の円板・折り返し・入口・差し込み板（中の図） =================
XP = XE + 1.5
def plugplate(pal):
    root = empty('PLG', (XP, 0, 0))
    objs = [cyl('PLG-body', RAD, 2 * HT, (XP, 0, 0), pal.disc, rot=(0, math.pi / 2, 0), verts=96)]
    for s in (-1, 1): objs.append(torus('PLG-rim%d' % s, RAD, 0.022, (XP + s * HT, 0, 0), pal.rim, rot=(0, math.pi / 2, 0)))
    cm = mat('plgw', CABLE, rough=.5, unique=True)
    for j in range(N):
        objs.append(sphere('PLG-cl%d' % j, 0.045, P(XP - HT, j), pal.contact, seg=12, ring=8))
        objs.append(sphere('PLG-cr%d' % j, 0.045, P(XP + HT, j), pal.contact, seg=12, ring=8))
        q = PLUG[j]
        objs.append(curve('PLG-w%d' % j, [P(XP + HT, j), P(XP - HT, q)], 0.018 if q != j else 0.008, cm if q != j else pal.wire, res=2))
    for o in objs: parent(o, root)
    return root

def build_stack(pos, plug=False, pal_over=None):
    pal_over = pal_over or {}
    pm = pal_over.get('main') or Pal('m')
    cyl('axle', 0.06, (XP if plug else XE) - XU + 0.6, (((XP if plug else XE) + XU) / 2, 0, 0), mat('axle', '#4a5878', rough=.5, metal=.4), rot=(0, math.pi / 2, 0), verts=24)
    R = {}
    for name, x, wr, o in zip(('L', 'M', 'R'), (XL, XM, XR), EN.ORDER, pos):
        w = [ABC.index(WIRE[wr][k]) for k in range(N)]
        R[name] = rotor(name, x, w, pal_over.get(name) or pm); set_turn(R[name], o)
    R['U'] = reflector(pal_over.get('U') or pm); R['E'] = entry(pal_over.get('E') or pm)
    if plug: R['P'] = plugplate(pal_over.get('P') or pm)
    return R

XK = XE + HT + 0.9
def route_pts(p, plug=False):
    """p＝円板・折り返しの道（press の 8つ）。入口の右（または差し込み板の右）から入り、戻って右へ出る。"""
    core = rotor_core(p)
    if plug:
        k0, g0 = FULL[0], FULL[-1]
        head = [P(XP + HT + 0.9, k0), P(XP + HT, k0), P(XP - HT, p[0]), P(XE + HT, p[0]), P(XE - HT, p[0])]
        tail = [P(XE - HT, p[-1]), P(XE + HT, p[-1]), P(XP - HT, p[-1]), P(XP + HT, g0), P(XP + HT + 0.9, g0)]
    else:
        head = [P(XK, p[0]), P(XE + HT, p[0]), P(XE - HT, p[0])]
        tail = [P(XE - HT, p[-1]), P(XE + HT, p[-1]), P(XK, p[-1])]
    return head, core, tail

def verify_core(p):
    bpy.context.view_layer.update(); ends = []
    for o in bpy.data.objects:
        if o.type == 'CURVE' and '-w' in o.name and o.name.split('-')[0] in ('L', 'M', 'R', 'UKW'):
            sp = o.data.splines[0].points; mw = o.matrix_world
            ends.append((mw @ sp[0].co.xyz, mw @ sp[len(sp) - 1].co.xyz))
    raw = rotor_core(p)
    pairs = [(raw[2 * n], raw[2 * n + 1]) for n in range(3)] + [(raw[6], raw[9])] + [(raw[10 + 2 * n], raw[11 + 2 * n]) for n in range(3)]
    for a, b in pairs:
        assert any(((a - e0).length < 1e-4 and (b - e1).length < 1e-4) or ((a - e1).length < 1e-4 and (b - e0).length < 1e-4) for e0, e1 in ends), ('道が導線と重ならない', a, b)
    print('[enigma_open] 道は 7 か所とも導線と一致', ''.join(ABC[c] for c in p))

def verify_plug(fullp):
    bpy.context.view_layer.update(); ends = []
    for o in bpy.data.objects:
        if o.type == 'CURVE' and o.name.startswith('PLG-w'):
            sp = o.data.splines[0].points; mw = o.matrix_world; ends.append((mw @ sp[0].co.xyz, mw @ sp[len(sp) - 1].co.xyz))
    for a, b in ((P(XP + HT, fullp[0]), P(XP - HT, fullp[1])), (P(XP - HT, fullp[-2]), P(XP + HT, fullp[-1]))):
        assert any(((a - e0).length < 1e-4 and (b - e1).length < 1e-4) or ((a - e1).length < 1e-4 and (b - e0).length < 1e-4) for e0, e1 in ends), '差し込み板の道が導線と重ならない'
    print('[enigma_open] 差し込み板の 2か所も導線と一致')

def gap_anchor(xa, xb, j, r=CR): return P((xa + xb) / 2, j, r)

CAM_ROUTE = ((4.2, -8.8, 3.4), (-0.6, 0, -0.1), 40)
def fit_route(plug=False):
    fit([P(x, j, RAD + 0.05) for x in (XU - HT, XE + HT, XK + 0.1) + ((XP + HT + 1.1,) if plug else ()) for j in range(0, 26, 2)], margin=.045)
ROUTE_SIZE = (1000, 600)

# ---- three：右 → 真ん中 → 左（行きだけ） ----
def b_three():
    R = build_stack(S1); verify_core(PA)
    head, core, tail = route_pts(PA)
    S = {'R': R, 'p': glow('go', head + core[:7], YEL)}
    camera(*CAM_ROUTE[:2], lens=CAM_ROUTE[2]); lights_std(target=(-0.5, 0, 0)); fit_route(); return S
def a_three(S, i):
    u = i / 71; draw_path(S['p'], seg(u, .04, .9))
def an_route(S, i):
    a = {'gE': P(XK - 0.25, PA[0]), 'gR': gap_anchor(XR - HT, XM + HT, PA[1]), 'gM': gap_anchor(XM - HT, XL + HT, PA[2]),
         'gL': gap_anchor(XL - HT, XU + HT, PA[3]), 'gL2': gap_anchor(XL - HT, XU + HT, PA[4]), 'gM2': gap_anchor(XM - HT, XL + HT, PA[5]),
         'gR2': gap_anchor(XR - HT, XM + HT, PA[6]), 'gE2': P(XK - 0.25, PA[7]),
         'tU': P(XU, 0, RAD + 0.3), 'tL': P(XL, 0, RAD + 0.3), 'tM': P(XM, 0, RAD + 0.3), 'tR': P(XR, 0, RAD + 0.3), 'tE': P(XE, 0, RAD + 0.3),
         'bU': P(XU, 13, RAD + 0.3), 'bL': P(XL, 13, RAD + 0.3), 'bM': P(XM, 13, RAD + 0.3), 'bR': P(XR, 13, RAD + 0.3), 'bE': P(XE, 13, RAD + 0.3)}
    return a

# ---- back：折り返して、行きと違う導線で 左 → 真ん中 → 右 ----
def b_back():
    R = build_stack(S1); verify_core(PA)
    head, core, tail = route_pts(PA)
    S = {'R': R, 'go': glow('go', head + core[:7], YEL, strength=.7), 'bk': glow('bk', core[6:] + tail, CYAN, strength=1.0)}
    camera(*CAM_ROUTE[:2], lens=CAM_ROUTE[2]); lights_std(target=(-0.5, 0, 0)); fit_route(); return S
def a_back(S, i):
    u = i / 71; draw_path(S['go'], 1, head=False); draw_path(S['bk'], seg(u, .05, .9))

# ---- rev：同じ設定で G → A（A の道を逆に） ----
def b_rev():
    R = build_stack(S1); verify_core(PA); verify_core(PG)
    assert all((a - b).length < 1e-6 for a, b in zip(rotor_core(PA), reversed(rotor_core(PG))))
    h, c, t = route_pts(PA); hg, cg, tg_ = route_pts(PG)
    S = {'R': R, 'pa': glow('pa', h + c + t, '#9c8434', strength=.5, radius=.032), 'pg': glow('pg', hg + cg + tg_, LIGHTC, strength=1.3, radius=.046)}
    camera(*CAM_ROUTE[:2], lens=CAM_ROUTE[2]); lights_std(target=(-0.5, 0, 0)); fit_route(); return S
def a_rev(S, i):
    u = i / 63; draw_path(S['pa'], 1, head=False); draw_path(S['pg'], seg(u, .08, .9))

# ---- refl：折り返し板を正面から（13組の導線） ----
CAM_REFL = ((XU + 5.0, -2.4, 1.2), (XU, 0, 0), 42)
def b_refl():
    pal = Pal('u'); x = XU
    cyl('UKWb', RAD, 2 * HT, (x, 0, 0), pal.disc, rot=(0, math.pi / 2, 0), verts=96)
    torus('UKWr', RAD, 0.03, (x + HT, 0, 0), pal.rim, rot=(0, math.pi / 2, 0))
    wm = mat('uw', '#9fb2d6', rough=.5, unique=True)
    hm = mat('uwh', YEL, emit=YEL, strength=0, unique=True)
    done = set(); S = {'hl': None, 'wires': []}
    for j in range(N):
        sphere('UKWc%d' % j, 0.07, P(x + HT, j), pal.contact, seg=14, ring=8)
        q = ABC.index(UKW[j])
        if j in done: continue
        done |= {j, q}
        a, b = P(x + HT, j), P(x + HT, q); mid = (a + b) / 2
        bulge = 0.25 + 0.35 * (a - b).length / (2 * CR)
        pts = [a + Vector((0.02, 0, 0))] + [Vector(((1 - t) ** 2 * a.x + 2 * (1 - t) * t * (x + HT + bulge) + t * t * b.x,
                                                      (1 - t) ** 2 * a.y + 2 * (1 - t) * t * mid.y * 0.6 + t * t * b.y,
                                                      (1 - t) ** 2 * a.z + 2 * (1 - t) * t * mid.z * 0.6 + t * t * b.z)) for t in [k / 16 for k in range(1, 16)]] + [b + Vector((0.02, 0, 0))]
        hit = {j, q} == {ABC.index('W'), ABC.index('V')}
        o = curve('UKWw%d' % j, pts, 0.03 if hit else 0.02, hm if hit else wm, res=3)
        S['wires'].append(o)
        if hit: S['hl'] = (o, pts)
    S['hm'] = hm
    # 入ってくる電流（W）と出ていく電流（V）：面に垂直に
    w, v = ABC.index('W'), ABC.index('V')
    S['pin'] = glow('pin', [P(x + HT + 1.6, w), P(x + HT, w)], YEL, smooth=False)
    S['pout'] = glow('pout', [P(x + HT, v), P(x + HT + 1.6, v)], CYAN, smooth=False)
    S['phl'] = glow('phl', S['hl'][1], YEL, strength=1.2, radius=0.036, smooth=False)
    assert ABC.index(UKW[w]) == v and PA[3] == w and PA[4] == v
    camera(*CAM_REFL[:2], lens=CAM_REFL[2]); lights(key=(x + 5, -4, 5), fill=(x + 4, 4, 1), rim=(x - 2, 0, 5), power=900, target=(x, 0, 0))
    fit([P(x + HT, j, RAD + 0.35) for j in range(N)] + [P(x - HT, j, RAD) for j in range(0, 26, 3)] + [P(x + HT + 1.6, w), P(x + HT + 1.6, v)], margin=.03)
    return S
def a_refl(S, i):
    u = i / 71
    for o in S['wires']: o.data.bevel_factor_end = max(seg(u, .02, .3), .0005)
    draw_path(S['pin'], seg(u, .45, .62)); draw_path(S['phl'], seg(u, .62, .78)); draw_path(S['pout'], seg(u, .78, .95))
def an_refl(S, i):
    return {('c' + L): P(XU + HT, ABC.index(L), RAD + 0.2) for L in ABC}

# ---- full：差し込み板 → 右 → 真ん中 → 左 → 折り返し → 左 → 真ん中 → 右 → 差し込み板（9回） ----
def _fracs():
    head, core, tail = route_pts(PF, plug=True)
    pts = head + core + tail
    L = [0.0]
    for p0, p1 in zip(pts[:-1], pts[1:]): L.append(L[-1] + (p1 - p0).length)
    T = L[-1]
    # 入れ替えが終わる点（各部品の出口）：差し込み板の左面・右の円板の左面・真ん中・左・折り返しの戻り・左の右面・真ん中・右・差し込み板の右面
    idx = [2, 6, 8, 10, 14, 16, 18, 20, 24]
    want = [(XP - HT, 1), (XR - HT, 2), (XM - HT, 3), (XL - HT, 4), (XU + HT, 5), (XL + HT, 6), (XM + HT, 7), (XR + HT, 8), (XP + HT, 9)]
    for i, (x, n) in zip(idx, want): assert (pts[i] - P(x, FULL[n])).length < 1e-9, ('9回の場所', i, n)
    return [round(L[i] / T, 4) for i in idx]
FULL_FRACS = _fracs()
CAM_FULL = ((5.4, -9.4, 3.6), (0.3, 0, -0.1), 37)
def b_full():
    R = build_stack(S1, plug=True); verify_core(PF); verify_plug(FULL)
    head, core, tail = route_pts(PF, plug=True)
    pts = head + core + tail
    S = {'R': R, 'p': glow('full', pts, YEL, strength=1.0)}
    km = mat('fkey', KEYC, rough=.45, emit=YEL, strength=0, unique=True)
    S['key'] = cyl('fkey', 0.16, 0.12, P(XP + HT + 1.0, FULL[0]), km, rot=(0, math.pi / 2, 0), verts=24); S['km'] = km
    lm = mat('flamp', LAMP0, rough=.3, emit=YEL, strength=0, unique=True)
    S['lamp'] = sphere('flamp', 0.16, P(XP + HT + 1.05, FULL[-1]), lm, seg=20, ring=12); S['lm'] = lm
    # 9回の入れ替えの場所（道の上の点の割合）
    L = [0]; acc = 0
    for a, b in zip(S['p']['pts'][:-1], S['p']['pts'][1:]): acc += (b - a).length; L.append(acc)
    S['cum'] = [l / acc for l in L]
    camera(*CAM_FULL[:2], lens=CAM_FULL[2]); lights_std(target=(0.3, 0, 0)); fit_route(True); return S
def a_full(S, i):
    u = i / 107
    set_emit(S['km'], YEL, 1.0 * seg(u, 0, .06))
    draw_path(S['p'], seg(u, .06, .92))
    a = seg(u, .9, .96); set_emit(S['lm'], YEL, 1.2 * a); set_color(S['lm'], YEL if a > .05 else LAMP0)
def an_full(S, i):
    p = FULL
    a = {'n1': P(XP, 0, RAD + 0.3), 'n2': P(XR, 0, RAD + 0.3), 'n3': P(XM, 0, RAD + 0.3), 'n4': P(XL, 0, RAD + 0.3), 'n5': P(XU - HT - 0.3, 0, 0),
         'n6': P(XL, 13, RAD + 0.3), 'n7': P(XM, 13, RAD + 0.3), 'n8': P(XR, 13, RAD + 0.3), 'n9': P(XP, 13, RAD + 0.3),
         'nE': P(XE, 0, RAD + 0.3), 'nEb': P(XE, 13, RAD + 0.3), 'key': P(XP + HT + 1.0, FULL[0]), 'lamp': P(XP + HT + 1.05, FULL[-1])}
    return a

# ================= 進み方（歯車・切り欠きの輪・爪） =================
SXC = {'L': -1.1, 'M': 0.0, 'R': 1.1}
RB, TB = 0.9, 0.22                     # 円板の半径・半分の厚さ
R_ROOT, R_TIP, R_RING, R_NOTCH = 0.86, 1.0, 1.02, 0.84
FRONT = 0.0                            # 爪のある位置（上）。局所の角で 0＝上
def ratchet_prof():
    prof = []
    for k in range(N):
        w = FRONT - 0.25 * PITCH - k * PITCH          # 押される面（局所の角）
        # 押される面のすぐ下で歯の先、そこから下へ 半ピッチで根元へ、根元のまま 半ピッチ
        prof += [(w, R_ROOT), (w - 1e-4, R_TIP), (w - 0.5 * PITCH, R_ROOT)]
    prof.sort(key=lambda t: t[0])
    return prof
def notch_prof(n):
    c = FRONT + n * PITCH; out = []
    for k in range(180):
        a = c + math.pi - 2 * math.pi * k / 180
        out.append((a, R_RING))
    out = [(a, r) for a, r in out if abs((a - c + math.pi) % (2 * math.pi) - math.pi) > 0.3 * PITCH]
    out += [(c + 0.3 * PITCH, R_RING), (c + 0.3 * PITCH - 1e-4, R_NOTCH), (c - 0.3 * PITCH + 1e-4, R_NOTCH), (c - 0.3 * PITCH, R_RING)]
    out.sort(key=lambda t: ((t[0] - c + math.pi) % (2 * math.pi)))
    return out

def step_rotor(name, x, notch_letter, pal):
    root = empty(name, (x, 0, 0)); objs = []
    objs.append(cyl(name + '-b', RB, 2 * TB, (x, 0, 0), pal['body'], rot=(0, math.pi / 2, 0), verts=96))
    objs.append(annulus_prism(name + '-ratchet', ratchet_prof(), 0.72, x + TB, x + TB + 0.1, pal['ratchet']))
    objs.append(annulus_prism(name + '-ring', notch_prof(ABC.index(notch_letter)), 0.5, x - TB - 0.1, x - TB, pal['ring']))
    # 切り欠きの底を光らせる（どこにあるか分かるように）
    c = FRONT + ABC.index(notch_letter) * PITCH
    nb = box(name + '-nb', (0.104, 0.58 * PITCH * R_NOTCH, 0.05), (x - TB - 0.05, (R_NOTCH + 0.015) * math.sin(c), (R_NOTCH + 0.015) * math.cos(c)), pal['notch'], rot=(-c, 0, 0))
    objs.append(nb)
    for o in objs: parent(o, root)
    return root

def step_pal(tag=''):
    return {'body': mat('sb' + tag, '#33456b', rough=.45, metal=.25, unique=True),
            'ratchet': mat('sr' + tag, '#aab6cc', rough=.35, metal=.7, unique=True),
            'ring': mat('sg' + tag, '#b08a45', rough=.4, metal=.5, unique=True),
            'notch': mat('sn' + tag, ORANGE, emit=ORANGE, strength=2.2, unique=True),
            'tick': mat('st' + tag, '#c4cde0', rough=.5, unique=True)}

PAWL_X = {1: (SXC['R'] + TB - 0.01, SXC['R'] + TB + 0.14), 2: (SXC['M'] + TB - 0.01, SXC['R'] - TB + 0.01), 3: (SXC['L'] + TB - 0.01, SXC['M'] - TB + 0.01)}
R_ENG, R_RIDE, R_OUT = 0.875, 1.035, 1.3
def make_pawl(k):
    x0, x1 = PAWL_X[k]
    m = mat('pawl%d' % k, GREEN, rough=.4, metal=.2, emit=GREEN, strength=.25, unique=True)
    tip = box('pawl%d-tip' % k, (x1 - x0, 0.42 * PITCH, 0.11), (0, 0, 0), m)
    arm = bar('pawl%d-arm' % k, 0.035, m)
    piv = sphere('pawl%d-piv' % k, 0.07, (0, 0, 0), m, seg=12, ring=8)
    return {'tip': tip, 'arm': arm, 'piv': piv, 'm': m, 'x': (x0 + x1) / 2}
def place_pawl(pw, r, a):
    x = pw['x']; tip = Vector((x, (r + 0.055) * math.sin(a), (r + 0.055) * math.cos(a)))
    pw['tip'].location = tip; pw['tip'].rotation_euler = (-a, 0, 0)
    base = Vector((x, 0.85, 1.7)); pw['piv'].location = base
    outer = Vector((x, (r + 0.11) * math.sin(a), (r + 0.11) * math.cos(a)))
    orient(pw['arm'], base, outer)
    return tip

def pawl_motion(f, engaged):
    """1回の打鍵の中の爪：f 0→1。返す（半径、角、押す進み 0→1）"""
    r_c = R_ENG if engaged else R_RIDE
    a_top = FRONT
    if f < .22:
        g = seg(f, 0, .22); return R_OUT + (r_c - R_OUT) * g, a_top, 0.0
    if f < .74:
        g = seg(f, .26, .7); return r_c, a_top - PITCH * g, g
    g = seg(f, .76, .98)
    r = r_c + (R_OUT - r_c) * min(1, g * 2); a = a_top - PITCH * (1 - seg(g, .4, 1))
    return r, a, 1.0

def build_steps(notches=('I', 'II', 'III'), pawls=True):
    pal = step_pal()
    R = {n: step_rotor(n, SXC[n], NOTCH[w] if w in NOTCH else w, pal) for n, w in zip(('L', 'M', 'R'), notches)}
    cyl('saxle', 0.07, 3.8, (0, 0, 0), mat('sax', '#4a5878', rough=.5, metal=.4), rot=(0, math.pi / 2, 0), verts=24)
    PW = {k: make_pawl(k) for k in (1, 2, 3)} if pawls else {}
    return R, PW, pal

def set_pos(R, pos):
    for n, o in zip(('L', 'M', 'R'), pos): R[n].rotation_euler = (PITCH * o, 0, 0)

def step_frame(S, n, f):
    """n 回目の打鍵（STEPS[n] → STEPS[n+1]）の f の状態"""
    a0 = STEPS[n]; e1, e2, e3 = ENG[n]
    pr = {}
    for k, eng in ((1, e1), (2, e2), (3, e3)):
        r, a, g = pawl_motion(f, eng); place_pawl(S['PW'][k], r, a); pr[k] = g if eng else 0
        set_emit(S['PW'][k]['m'], YEL if eng and .24 < f < .74 else GREEN, 1.2 if eng and .24 < f < .74 else .25)
        set_color(S['PW'][k]['m'], YEL if eng and .24 < f < .74 else GREEN)
    push = seg(f, .26, .7)
    dL = push if e3 else 0; dM = push if (e2 or e3) else 0; dR = push
    set_pos(S['R'], (a0[0] + dL, a0[1] + dM, a0[2] + dR))
    return push

STEP_F = 48
CAM_STEPS = ((1.3, -5.6, 3.0), (0.0, 0.0, 0.3), 46)
STEP_FIT = [Vector((x, y, z)) for x in (-1.45, 1.45) for y in (-1.0, 1.0) for z in (-1.0, 1.75)]
def b_step():
    R, PW, pal = build_steps(); camera(*CAM_STEPS[:2], lens=CAM_STEPS[2]); lights_std(target=(0, -0.3, 0), power=1000); fit(STEP_FIT, margin=.03)
    return {'R': R, 'PW': PW}
def a_step(S, i):
    n = min(4, i // STEP_F); f = (i - n * STEP_F) / (STEP_F - 1)
    step_frame(S, n, f)
def win_seq(frames_per, steps, mid=.5):
    out = []
    for i in range(frames_per * (len(steps) - 1)):
        n = min(len(steps) - 2, i // frames_per); f = (i - n * frames_per) / (frames_per - 1)
        cur, nxt = steps[n], steps[n + 1]; out.append(WN(nxt if seg(f, .26, .7) >= mid else cur))
    return out
def an_step(S, i):
    a = {}
    for n in ('L', 'M', 'R'):
        x = SXC[n]; a['top' + n] = Vector((x, 0, RB + 0.55)); a['bot' + n] = Vector((x, -0.4, -RB - 0.3)); a['ctr' + n] = Vector((x, 0, 0)); a['ring' + n] = Vector((x - TB - 0.05, 0, R_RING)); a['rat' + n] = Vector((x + TB + 0.05, 0, R_TIP))
    for k in (1, 2, 3):
        a['pawl%d' % k] = S['PW'][k]['tip'].location.copy(); a['piv%d' % k] = S['PW'][k]['piv'].location.copy()
    return a

# ---- pawl：近くから、ゆっくり（3回目 JDV→JEW と 4回目 JEW→KFX） ----
PAWL_F = 90
CAM_PAWL = ((0.7, -2.5, 3.1), (0.0, 0.0, 0.9), 40)
def b_pawl():
    R, PW, pal = build_steps(); camera(*CAM_PAWL[:2], lens=CAM_PAWL[2]); lights_std(target=(0, -0.6, 0), power=900)
    fit([Vector((x, y, z)) for x in (-1.0, 1.0) for y in (-0.6, 0.5) for z in (0.35, 1.45)], margin=.02)
    return {'R': R, 'PW': PW}
def a_pawl(S, i):
    n = 2 + min(1, i // PAWL_F); f = (i - (n - 2) * PAWL_F) / (PAWL_F - 1)
    step_frame(S, n, f)

# ---- odo（序章2）：距離計のように（切り欠きは Z。右が Z→A のときだけ真ん中が進む） ----
ODO = [(0, 0, 22)]
for _ in range(4): l, m, r = ODO[-1]; ODO.append((l, (m + (r == 25)) % N, (r + 1) % N))
assert [WN(s) for s in ODO] == ['AAW', 'AAX', 'AAY', 'AAZ', 'ABA']
ODO_F1 = 30; ODO_F2 = 90
def b_odo():
    R, PW, pal = build_steps(notches=('Z', 'Z', 'Z'), pawls=False)
    camera((1.8, -6.0, 2.2), (0.0, 0.0, -0.05), 44); lights_std(power=1000); fit([Vector((x, y, z)) for x in (-1.45, 1.45) for y in (-1.0, 1.0) for z in (-1.05, 1.5)], margin=.03)
    return {'R': R}
def odo_pos(i):
    if i < 4 * ODO_F1:
        n = i // ODO_F1; f = (i - n * ODO_F1) / (ODO_F1 - 1); g = seg(f, .2, .75)
        a, b = ODO[n], ODO[n + 1]
        return tuple(x + (((y - x) % N) * g) for x, y in zip(a, b))
    f = (i - 4 * ODO_F1) / (ODO_F2 - 1)
    rr = 26 * seg(f, .05, .85); m = 1 + seg(f, .8, .9)
    return (0, m, 0 + rr)
def a_odo(S, i): set_pos(S['R'], odo_pos(i))
def odo_win(i):
    p = odo_pos(i); return ''.join(ABC[int(round(x)) % N] for x in p)
def an_odo(S, i):
    return {('top' + n): Vector((SXC[n], 0, RB + 0.55)) for n in ('L', 'M', 'R')} | {('bot' + n): Vector((SXC[n], -0.4, -RB - 0.45)) for n in ('L', 'M', 'R')}

# ================= 文字の輪（輪だけ回る。配線は動かない） =================
RING_F = 84
CAM_RING = ((5.2, -1.7, 1.5), (0, 0, -0.05), 40)
def b_ring():
    pal = Pal('g')
    root, hls, W = big_rotor('C', 'I', pal, hl=((0, YEL),))
    show_hl(hls[0], 1)
    rm = mat('ringm', BRASS, rough=.35, metal=.6, unique=True)
    ring = empty('RING', (0, 0, 0))
    prof = []
    c = 0.0                        # 切り欠きの局所の角（輪の文字 Q の位置に置く）
    nq = ABC.index('Q')
    cn = 2 * math.pi * nq / N + PITCH / 2
    for k in range(240):
        a = 2 * math.pi * k / 240
        d = abs((a - cn + math.pi) % (2 * math.pi) - math.pi)
        prof.append((a, 1.26 if d < 0.3 * PITCH else 1.4))
    rg = annulus_prism('ringbody', prof, RAD + 0.02, -BHT, BHT, rm); parent(rg, ring)
    tm = mat('ringt', '#1b2438', rough=.5, unique=True); am = mat('ringA', ORANGE, emit=ORANGE, strength=1.0, unique=True)
    for j in range(N):
        a = 2 * math.pi * j / N
        t = box('rt%d' % j, (0.04, 0.03, 0.08), (BHT + 0.015, 1.36 * math.sin(a), 1.36 * math.cos(a)), am if j == 0 else tm, rot=(-a, 0, 0))
        parent(t, ring)
    nb = box('rnb', (2 * BHT, 0.5 * PITCH * 1.26, 0.03), (0, 1.27 * math.sin(cn), 1.27 * math.cos(cn)), mat('rn', ORANGE, emit=ORANGE, strength=1.2, unique=True), rot=(-cn, 0, 0))
    parent(nb, ring)
    # 窓（動かない目印、上）
    box('window', (0.5, 0.06, 0.12), (0, 0, 1.98), mat('win', '#e8e2cf', rough=.4, unique=True))
    camera(*CAM_RING[:2], lens=CAM_RING[2]); lights(key=(6, -4, 5), fill=(4, 4, 1), rim=(-3, 0, 5), power=900, target=(0, 0, 0))
    fit([Vector((BHT, 1.75 * math.sin(a), 1.75 * math.cos(a))) for a in [k * PITCH for k in range(N)]] + [Vector((-BHT, 0, 2.1)), Vector((-BHT, 0, -1.5))], margin=.03)
    return {'root': root, 'ring': ring}
RING_STEPS = 3
def ring_turn(i):
    u = i / (RING_F - 1); return RING_STEPS * seg(u, .15, .85)
def a_ring(S, i):
    S['ring'].rotation_euler = (PITCH * ring_turn(i), 0, 0)
def an_ring(S, i):
    t = ring_turn(i); a = {}
    for j in range(N):
        ang = 2 * math.pi * j / N - PITCH * t
        a['L%d' % j] = Vector((BHT, 1.62 * math.sin(ang), 1.62 * math.cos(ang)))
    a['win'] = Vector((0, 0, 1.75)); a['wire'] = P(BHT, 0)
    return a

# ================= 差し込み板（本物の形） =================
PROWS = ['QWERTZUIO', 'ASDFGHJK', 'PYXCVBNML']
PS = 0.52
def sock_xz(L):
    for r, row in enumerate(PROWS):
        if L in row:
            c = row.index(L); return ((c - (len(row) - 1) / 2) * PS, 0.55 - 0.5 * r)
ETW_C = Vector((0.5, 1.5, 1.75))
def etw_contact(j, r=0.62):
    a = 2 * math.pi * j / N; return ETW_C + Vector((r * math.sin(a), 0, r * math.cos(a)))
def b_plug():
    pnl = mat('pnl', PANEL, rough=.55, metal=.2, alpha=.62, unique=True)
    box('pboard', (9 * PS + 0.4, 0.06, 1.6), (0, 0, 0.05), pnl, bevel=0.03)
    sock = mat('sock', '#0c1220', rough=.6); stem = mat('pst', '#6b7894', rough=.4, metal=.5)
    for L in ABC:
        x, z = sock_xz(L)
        for dz in (0.06, -0.06): cyl('s%s%d' % (L, dz > 0), 0.04, 0.08, (x, -0.04, z + dz), sock, rot=(math.pi / 2, 0, 0), verts=12)
        torus('sr' + L, 0.11, 0.014, (x, -0.05, z), stem, rot=(math.pi / 2, 0, 0), seg=24)
    # 入口の円板（板の奥、上）
    em = Pal('e')
    cyl('etwb', 0.8, 0.16, ETW_C, em.disc, rot=(math.pi / 2, 0, 0), verts=96)
    torus('etwr', 0.8, 0.02, ETW_C + Vector((0, -0.08, 0)), em.rim, rot=(math.pi / 2, 0, 0))
    for j in range(N): sphere('etwc%d' % j, 0.045, etw_contact(j) + Vector((0, -0.09, 0)), em.contact, seg=12, ring=8)
    # 線（A–J）
    cm = mat('cable', CABLE, rough=.5); pm = mat('plug', '#2a3144', rough=.4)
    (x1, z1), (x2, z2) = sock_xz('A'), sock_xz('J')
    y0 = -0.1; cab = [Vector((x1, y0 - 0.12, z1))]
    for k in range(1, 16):
        t = k / 16; cab.append(Vector((x1 + (x2 - x1) * t, y0 - 0.28 - 0.12 * math.sin(math.pi * t), z1 + (z2 - z1) * t - 0.55 * math.sin(math.pi * t))))
    cab.append(Vector((x2, y0 - 0.12, z2)))
    c = curve('cableAJ', cab, 0.035, cm, res=4)
    p1 = cyl('plugA', 0.075, 0.2, (x1, y0 - 0.06, z1), pm, rot=(math.pi / 2, 0, 0), verts=16)
    p2 = cyl('plugJ', 0.075, 0.2, (x2, y0 - 0.06, z2), pm, rot=(math.pi / 2, 0, 0), verts=16)
    # キー A（手前の下）
    km = mat('keyA', KEYC, rough=.45, emit=YEL, strength=0, unique=True)
    KA = Vector((x1 - 0.2, -1.4, -1.25))
    cyl('keyAcap', 0.2, 0.08, KA, km, verts=32)
    # 電流の道：キー A → 板の奥 → ソケット A → 線 → ソケット J → 板の奥 → 入口の円板の J
    a_back = Vector((x1, 0.35, z1)); j_back = Vector((x2, 0.35, z2))
    pts = [KA + Vector((0, 0, 0.05)), Vector((KA.x, 0.35, KA.z + 0.05)), Vector((x1, 0.35, KA.z + 0.05)), a_back, Vector((x1, 0.0, z1)), Vector((x1, y0 - 0.12, z1))]
    pts += cab[1:-1] + [Vector((x2, y0 - 0.12, z2)), Vector((x2, 0.0, z2)), j_back]
    ej = etw_contact(ABC.index('J')) + Vector((0, -0.09, 0))
    pts += [Vector((x2, 0.35, ej.z)) if ej.z > z2 else j_back, Vector((x2, ej.y - 0.6, ej.z)), Vector((ej.x, ej.y - 0.6, ej.z)), ej]
    S = {'cab': c, 'p1': p1, 'p2': p2, 'km': km, 'path': glow('pp', pts, YEL, strength=1.0, radius=0.035)}
    hlj = sphere('ejhl', 0.09, ej, mat('ejm', YEL, emit=YEL, strength=0, unique=True), seg=16, ring=10); S['ejm'] = hlj.data.materials[0]
    S['ca'], S['c1'], S['c2'] = cab, (x1, z1), (x2, z2)
    camera((2.4, -5.6, 2.4), (0.15, 0.4, 0.1), 38); fit(margin=.04); lights(key=(3, -5, 6), fill=(-5, -4, 3), rim=(-2, 6, 6), power=1000, target=(0, 0, 0.3))
    return S
def a_plug(S, i):
    u = i / 107
    g = seg(u, .05, .4)
    S['cab'].data.bevel_factor_end = max(g, .0005); S['cab'].hide_render = g <= .0005
    (x1, z1), (x2, z2) = S['c1'], S['c2']
    S['p1'].location = (x1, -0.16 - 0.5 * (1 - seg(u, .02, .1)), z1); S['p1'].hide_render = u < .02
    S['p2'].location = (x2, -0.16 - 0.5 * (1 - seg(u, .38, .46)), z2); S['p2'].hide_render = u < .36
    set_emit(S['km'], YEL, 1.0 * seg(u, .52, .56))
    draw_path(S['path'], seg(u, .56, .94))
    set_emit(S['ejm'], YEL, 2.0 * seg(u, .92, .96))
def an_plug(S, i):
    a = {('s' + L): Vector((sock_xz(L)[0], -0.05, sock_xz(L)[1])) for L in 'AJ'}
    a['key'] = Vector((sock_xz('A')[0] - 0.2, -1.4, -1.25)); a['etw'] = ETW_C + Vector((0, 0, 0.95)); a['ej'] = etw_contact(ABC.index('J'))
    a['board'] = Vector((0, -0.05, -0.85))
    return a

# ================= ふたを開ける（本体） =================
BX, BY, BZ = 3.4, 2.8, 1.2
def b_lid():
    wood = mat('wood', WOOD, rough=.7); wood2 = mat('wood2', WOOD2, rough=.75); panel = mat('panel', PANEL, rough=.55, metal=.2)
    box('case', (BX, BY, BZ), (0, 0, BZ / 2), wood, bevel=0.04)
    box('deck', (BX - 0.24, BY - 0.24, 0.04), (0, 0, BZ + 0.01), panel)
    stem = mat('stem', '#6b7894', rough=.4, metal=.5)
    for L in ABC:
        x, y = EN.key_xy(L)
        cyl('kcap' + L, 0.12, 0.05, (x, y, BZ + 0.2), mat('kc', KEYC, rough=.45), verts=32)
        cyl('kstem' + L, 0.025, 0.16, (x, y, BZ + 0.1), stem, verts=12)
        lx, ly = EN.lamp_xy(L)
        cyl('lamp' + L, 0.1, 0.03, (lx, ly, BZ + 0.035), mat('lp', LAMP0, rough=.3), verts=32)
    # 円板の箱（中に 3枚・折り返し・入口）
    pal = Pal('x')
    rotors = []
    for n, x in enumerate((-0.45, 0, 0.45)):
        r = cyl('xr%d' % n, 0.42, 0.3, (x, 1.0, BZ + 0.32), mat('xrb', '#8aa0c4', rough=.4, metal=.4), rot=(0, math.pi / 2, 0), verts=48)
        w = cyl('xw%d' % n, 0.47, 0.06, (x - 0.12, 1.0, BZ + 0.32), mat('xwh', '#b8c2d6', rough=.35, metal=.6), rot=(0, math.pi / 2, 0), verts=26, smooth=False)
        rotors.append((r, w))
    cyl('xu', 0.42, 0.18, (-0.8, 1.0, BZ + 0.32), mat('xub', '#6b7894', rough=.4, metal=.4), rot=(0, math.pi / 2, 0), verts=48)
    cyl('xe', 0.42, 0.18, (0.78, 1.0, BZ + 0.32), mat('xeb', '#6b7894', rough=.4, metal=.4), rot=(0, math.pi / 2, 0), verts=48)
    cyl('xax', 0.04, 1.9, (0, 1.0, BZ + 0.32), mat('xax', '#4a5878', rough=.5, metal=.4), rot=(0, math.pi / 2, 0), verts=16)
    cov = box('cover', (2.1, 0.9, 0.8), (0, 1.0, BZ + 0.38), panel, bevel=0.03)
    # ふた（後ろの辺で回る）
    hinge = empty('hinge', (0, BY / 2, BZ + 0.02))
    lid = box('lid', (BX + 0.04, BY + 0.04, 0.12), (0, 0, BZ + 0.86), wood, bevel=0.03)
    WALLS = [((BX + 0.04, 0.06, 0.8), (0, -BY / 2, BZ + 0.44)), ((0.06, BY + 0.04, 0.8), (-BX / 2, 0, BZ + 0.44)),
             ((0.06, BY + 0.04, 0.8), (BX / 2, 0, BZ + 0.44)), ((BX + 0.04, 0.06, 0.8), (0, BY / 2, BZ + 0.44))]
    walls = [box('lw%d' % k, sz, lc, wood2) for k, (sz, lc) in enumerate(WALLS)]
    for o in [lid] + walls: parent(o, hinge)
    S = {'hinge': hinge, 'cover': cov, 'cam': camera((-3.4, -6.6, 5.2), (0, 0.2, 1.0), 40)}
    lights(key=(3, -5, 7), fill=(-6, -4, 3), rim=(-2, 6, 6), power=1000, target=(0, 0, 1))
    return S
def a_lid(S, i):
    u = i / 83
    S['hinge'].rotation_euler = (math.radians(-118) * seg(u, .05, .4), 0, 0)
    c = seg(u, .42, .62); S['cover'].location = (0, 1.0 - 1.4 * c, BZ + 0.38 + 1.6 * c); S['cover'].hide_render = c > .97
    k = seg(u, .55, 1.0)
    loc = Vector((-3.4, -6.6, 5.2)).lerp(Vector((1.4, -2.6, 3.4)), k); tgt = Vector((0, 0.2, 1.0)).lerp(Vector((0, 0.9, BZ + 0.3)), k)
    aim(S['cam'], loc, tgt)
def an_lid(S, i):
    return {'rotors': Vector((0, 1.0, BZ + 0.85)), 'case': Vector((0, -BY / 2, 0.2))}

# ================= アルベルティの円板（序章2） =================
ALB_IN = 'gkwnprtuzlxysomqihfdbacevj'   # 内の円板の並び（図のための例）
assert sorted(ALB_IN) == sorted('abcdefghijklmnopqrstuvwxyz')
ALB_F = 96
def b_alb():
    om = mat('aout', '#e8e2cf', rough=.6, unique=True); im = mat('ain', '#c9a45c', rough=.5, metal=.2, unique=True)
    lm = mat('aline', '#5e4128', rough=.6, unique=True)
    cyl('aouter', 2.9, 0.12, (0, 0, 0), om, verts=128)
    cyl('ainner', 1.95, 0.12, (0, 0, 0.12), im, verts=128)
    inner = empty('IN', (0, 0, 0))
    for j in range(N):
        a = 2 * math.pi * (j + 0.5) / N
        box('ao%d' % j, (0.025, 0.85, 0.02), (2.45 * math.sin(a), 2.45 * math.cos(a), 0.065), lm, rot=(0, 0, -a))
        t = box('ai%d' % j, (0.025, 1.1, 0.02), (1.38 * math.sin(a), 1.38 * math.cos(a), 0.185), lm, rot=(0, 0, -a)); parent(t, inner)
    torus('aring', 2.0, 0.02, (0, 0, 0.07), lm, seg=128); torus('aring2', 2.9, 0.025, (0, 0, 0.065), lm, seg=128)
    pin = cyl('apin', 0.12, 0.3, (0, 0, 0.2), mat('apin', '#7a5634', rough=.5), verts=24)
    camera((0, -4.6, 9.4), (0, -0.25, 0), 34); fit([Vector((3.0 * math.sin(a), 3.0 * math.cos(a), 0)) for a in [k * PITCH for k in range(N)]], margin=.03); lights(key=(3, -4, 8), fill=(-5, -2, 5), rim=(0, 5, 6), power=900, target=(0, 0, 0))
    return {'in': inner, 'innerdisc': bpy.data.objects['ainner']}
def alb_turn(i):
    u = i / (ALB_F - 1); return sum(seg(u, a, a + .12) for a in (.12, .42, .72))
def a_alb(S, i):
    t = alb_turn(i); S['in'].rotation_euler = (0, 0, -PITCH * t)
def an_alb(S, i):
    t = alb_turn(i); a = {}
    for j in range(N):
        ao = 2 * math.pi * j / N; ai = ao + PITCH * t
        a['o%d' % j] = Vector((2.45 * math.sin(ao), 2.45 * math.cos(ao), 0.08))
        a['i%d' % j] = Vector((1.62 * math.sin(ai), 1.62 * math.cos(ai), 0.2))
    a['center'] = Vector((0, 0, 0.2)); a['top'] = Vector((0, 2.9, 0.1)); a['bottom'] = Vector((0, -2.9, 0.1))
    return a

SHOTS_C = [
    Shot('lid', 84, (1000, 820), b_lid, a_lid, an_lid),
    Shot('rcut', 90, (1000, 820), b_rcut, a_rcut, an_rcut),
    Shot('rstep', 96, (1000, 760), b_rstep, a_rstep, an_rstep, info={'out': ['E', 'J']}),
    Shot('three', 72, ROUTE_SIZE, b_three, a_three, an_route, info={'path': [ABC[c] for c in PA]}),
    Shot('refl', 72, (1000, 820), b_refl, a_refl, an_refl, info={'ukw': UKW}),
    Shot('back', 72, ROUTE_SIZE, b_back, a_back, an_route),
    Shot('rev', 64, ROUTE_SIZE, b_rev, a_rev, an_route, info={'pathG': [ABC[c] for c in PG]}),
    Shot('step', 5 * STEP_F, (1000, 760), b_step, a_step, an_step, info={'win': win_seq(STEP_F, STEPS), 'stepFrames': STEP_F, 'steps': [WN(s) for s in STEPS]}),
    Shot('pawl', 2 * PAWL_F, (1000, 820), b_pawl, a_pawl, an_step, info={'win': win_seq(PAWL_F, STEPS[2:5]), 'stepFrames': PAWL_F}),
    Shot('ring', RING_F, (1000, 820), b_ring, a_ring, an_ring),
    Shot('plug', 108, (1000, 820), b_plug, a_plug, an_plug),
    Shot('full', 108, (1000, 600), b_full, a_full, an_full, info={'path': [ABC[c] for c in FULL], 'fracs': FULL_FRACS}),
    Shot('alb', ALB_F, (1000, 860), b_alb, a_alb, an_alb, info={'inner': ALB_IN}),
    Shot('odo', 4 * ODO_F1 + ODO_F2, (1000, 780), b_odo, a_odo, an_odo, info={'win': [odo_win(i) for i in range(4 * ODO_F1 + ODO_F2)], 'f1': ODO_F1}),
]

if __name__ == '__main__':
    run(SHOTS_C, [os.path.abspath(__file__), os.path.abspath(EN.__file__)])
