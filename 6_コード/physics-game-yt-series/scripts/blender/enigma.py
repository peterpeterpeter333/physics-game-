# 技術の疑問の鎖 序章（ys-chain-00）の 3D：エニグマの本体（外）と、中の電流の道（3枚の円板・折り返し）。
#   Blender -b --factory-startup -P scripts/blender/enigma.py -- --out /private/tmp/ys/ys-chain-00/blender
#
# 図のために決めた値（電流の道は、この表から計算して描く。手で線を引かない）
#  - 円板の配線の表（右の面の接点 → 左の面の接点。位置 A〜Z）：よく知られた陸軍型の円板 I・II・III と反射板 B の表と同じ文字列を使う。
#      I  ：EKMFLGDQVZNTOWYHXUSPAIBRCJ
#      II ：AJDKSIRUXBLHWTMCQGZNPYFVOE
#      III：BDFHJLCPRTXVZNYEIWGAKMQOUS
#      反射板（折り返し）：YRUHQSLDPXNGOKMIEBFZCWVJAT（13組。どの文字も自分とはつながらない）
#  - 並び：左から 折り返し・I（左）・II（真ん中）・III（右）・入口の円板（動かない）・電球の輪・キーの輪・電池。
#  - その日の設定：始めの向き（左・真ん中・右）＝ J・H・A。輪の設定は A、差し込み板は つながない（道の図では省く）。
#  - キーを押すと、先に右の円板が一目盛り進み、その後で電流が流れる。右の円板 A→B→C→D の間に、真ん中を進める切り欠き（V）は通らない。
#  - 計算（solve() と同じ式。c は接点の位置 0〜25、o は円板の向き）：
#      行き：c → (W[(c+o) mod 26] − o) mod 26（右→真ん中→左）、折り返し：c → R[c]、帰り：c → (W⁻¹[(c+o) mod 26] − o) mod 26（左→真ん中→右）
#    1回目（向き J・H・B）：A → C → U → W → 折り返し → V → R → O → G
#    2回目（J・H・C）：A → D → E → N → K → C → U → P
#    3回目（J・H・D）：A → E → A → Q → E → B → Y → X
#    同じ設定（J・H・B）で G を押す：G → O → R → V → 折り返し → W → U → C → A（1回目の道を、そっくり逆にたどる。下の assert で確かめる）
#  - 形：円板の半径 1.0、厚さ 0.4、接点は半径 0.74 の円の上に 26（位置 j は角 360°×j/26）。円板の中の導線は、右の面の接点と左の面の接点を結ぶ まっすぐな線。
import bpy, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bl_common import *

ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
WIRE = {'I': 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'II': 'AJDKSIRUXBLHWTMCQGZNPYFVOE', 'III': 'BDFHJLCPRTXVZNYEIWGAKMQOUS'}
UKW = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'
ORDER = ('I', 'II', 'III')          # 左・真ん中・右
START = (9, 7, 0)                   # J・H・A（その日の始めの向き）
N = 26

def fwd(r, o, c): return (ABC.index(WIRE[r][(c + o) % N]) - o) % N
def bwd(r, o, c): return (WIRE[r].index(ABC[(c + o) % N]) - o) % N
def press(pos, key):
    """pos＝(左, 真ん中, 右) の向きのとき key を押した電流の道（接点の位置の列）と、光る電球"""
    c = key; p = [c]
    for r, o in zip(reversed(ORDER), reversed(pos)): c = fwd(r, o, c); p.append(c)
    c = ABC.index(UKW[c]); p.append(c)
    for r, o in zip(ORDER, pos): c = bwd(r, o, c); p.append(c)
    return p
S1 = (9, 7, 1); S2 = (9, 7, 2); S3 = (9, 7, 3)
PA1, PA2, PA3 = press(S1, 0), press(S2, 0), press(S3, 0)
PG1 = press(S1, 6)
assert [ABC[c] for c in PA1] == list('ACUWVROG'), PA1
assert [ABC[x] for x in (PA1[-1], PA2[-1], PA3[-1])] == ['G', 'P', 'X']
assert PG1 == PA1[::-1], (PG1, PA1)       # G を押した道 ＝ A を押した道を逆にたどったもの
assert all(UKW[i] != ABC[i] and ABC.index(UKW[ABC.index(UKW[i])]) == i for i in range(N))

# ---------------- 色 ----------------
YEL = '#ffd23f'; LIGHTC = '#fff1b8'; ORANGE = '#ff9f43'; BLUEG = '#8aa0c4'; STEEL = '#5f7398'
BRASS = '#c9a45c'; WOOD = '#7a5634'; WOOD2 = '#5e4128'; PANEL = '#1d2638'; KEYC = '#8f8a7e'; LAMP0 = '#34405a'

# ================= 中の図（円板と電流の道） =================
RAD, HT, CR = 1.2, 0.2, 0.92
XU, XL, XM, XR, XE = -3.6, -2.1, -0.6, 0.9, 2.4     # 折り返し・左・真ん中・右・入口
ANG = lambda j: 2 * math.pi * j / N
def P(x, j, r=CR): return Vector((x, r * math.sin(ANG(j)), r * math.cos(ANG(j))))

# 電球の板とキーの板（本物と同じ 3段の並び）。円板の下に、カメラの方を向けて置く（y＝0 の面）。
PROWS = ['QWERTZUIO', 'ASDFGHJK', 'PYXCVBNML']
LAMP_CX, KEY_CX, PZ0, PDZ, PDX = -1.25, 2.75, -2.05, 0.42, 0.40
def panel_xz(L, cx):
    for r, row in enumerate(PROWS):
        if L in row:
            c = row.index(L); return (cx + (c - (len(row) - 1) / 2) * PDX, PZ0 - PDZ * r)
def lamp_pos(j): x, z = panel_xz(ABC[j], LAMP_CX); return Vector((x, 0, z))
def key_pos(j): x, z = panel_xz(ABC[j], KEY_CX); return Vector((x, 0, z))
BAT = Vector((KEY_CX, 0, PZ0 - 3 * PDZ - 0.25))
ZBUS_L, ZBUS_K, YBUS_K = -1.62, -1.62, -0.45
XUP_L, XUP_K = XE + HT + 0.45, XE + HT + 0.85

def rotor_core(p):
    """円板の中と、円板どうしの間の道（入口の円板の左の面 → … → 入口の円板の左の面）。verify_path が確かめる部分。"""
    k, r1, m1, l1, u, l2, m2, r2 = p
    xs = [XR, XM, XL]; pts = []; cur = k
    for x, nxt in zip(xs, (r1, m1, l1)):
        pts += [P(x + HT, cur), P(x - HT, nxt)]; cur = nxt
    pts += [P(XU + HT, cur), P(XU + HT - 0.17, cur), P(XU + HT - 0.17, u), P(XU + HT, u)]
    cur = u
    for x, nxt in zip(reversed(xs), (l2, m2, r2)):
        pts += [P(x - HT, cur), P(x + HT, nxt)]; cur = nxt
    return pts

def path_points(p):
    """接点の位置の列 p（8つ）→ 3D の折れ線。電池 → キー → 入口の円板 → 右 → 真ん中 → 左 → 折り返し → 左 → 真ん中 → 右 → 入口 → 電球"""
    k, g = p[0], p[-1]
    kp, lp = key_pos(k), lamp_pos(g)
    head = [BAT + Vector((-0.32, 0, 0)), Vector((kp.x, YBUS_K, BAT.z)), kp + Vector((0, YBUS_K, -0.1)), kp + Vector((0, YBUS_K, 0.12)),
            Vector((kp.x, YBUS_K, ZBUS_K)), Vector((XUP_K, YBUS_K, ZBUS_K)), Vector((XUP_K, P(0, k).y, P(0, k).z)), P(XE + HT, k), P(XE - HT, k)]
    tail = [P(XE - HT, g), P(XE + HT, g), Vector((XUP_L, P(0, g).y, P(0, g).z)), Vector((XUP_L, 0, ZBUS_L)), Vector((lp.x, 0, ZBUS_L)), lp + Vector((0, 0, 0.1))]
    return head + rotor_core(p) + tail

class Pal:
    """部品の材質の組。fade() で組ごとに透かす（取り出した円板だけ残す、など）。"""
    def __init__(self, tag):
        self.disc = mat('disc' + tag, BLUEG, rough=.4, alpha=.13, unique=True)
        self.rim = mat('rim' + tag, BLUEG, rough=.45, metal=.3, unique=True)
        self.contact = mat('ct' + tag, BRASS, rough=.35, metal=.7, unique=True)
        self.wire = mat('wr' + tag, '#7f93b8', rough=.6, alpha=.55, unique=True)
        self.tick = mat('tk' + tag, '#c4cde0', rough=.5, unique=True)
        self.mark = mat('mk' + tag, ORANGE, rough=.5, emit=ORANGE, strength=.6, unique=True)
        self.all = [self.disc, self.rim, self.contact, self.wire, self.tick, self.mark]
        self.base = {m.name: m.node_tree.nodes.get('Principled BSDF').inputs['Alpha'].default_value for m in self.all}
    def fade(self, a):
        for m in self.all: set_alpha(m, self.base[m.name] * a)

def rotor(name, x, wiring, pal, rim_ticks=True):
    """円板（ローカルの x＝0 が中心）。wiring：右の面の接点 k → 左の面の接点の位置。親の空の物を返す（x 軸まわりに回す）。"""
    root = empty(name, (x, 0, 0))
    objs = [cyl(name + '-body', RAD, 2 * HT, (x, 0, 0), pal.disc, rot=(0, math.pi / 2, 0), verts=96)]
    for s in (-1, 1):
        objs.append(torus(name + '-rim%d' % s, RAD, 0.022, (x + s * HT, 0, 0), pal.rim, rot=(0, math.pi / 2, 0)))
    for j in range(N):
        objs.append(sphere('%s-cr%d' % (name, j), 0.045, P(x + HT, j), pal.contact, seg=12, ring=8))
        objs.append(sphere('%s-cl%d' % (name, j), 0.045, P(x - HT, j), pal.contact, seg=12, ring=8))
        objs.append(curve('%s-w%d' % (name, j), [P(x + HT, j), P(x - HT, wiring[j])], 0.010, pal.wire, res=2))
    m = box(name + '-mark', (0.34, 0.09, 0.09), P(x, 0, RAD + 0.08), pal.mark); objs.append(m)
    for o in objs: parent(o, root)
    return root

def reflector(pal):
    root = empty('UKW', (XU, 0, 0))
    objs = [cyl('UKW-body', RAD, 2 * HT, (XU, 0, 0), pal.disc, rot=(0, math.pi / 2, 0), verts=96),
            torus('UKW-rim', RAD, 0.022, (XU + HT, 0, 0), pal.rim, rot=(0, math.pi / 2, 0)),
            torus('UKW-rim2', RAD, 0.022, (XU - HT, 0, 0), pal.rim, rot=(0, math.pi / 2, 0))]
    done = set()
    for j in range(N):
        objs.append(sphere('UKW-c%d' % j, 0.045, P(XU + HT, j), pal.contact, seg=12, ring=8))
        q = ABC.index(UKW[j])
        if j in done: continue
        done |= {j, q}
        objs.append(curve('UKW-w%d' % j, [P(XU + HT, j), P(XU + HT - 0.17, j), P(XU + HT - 0.17, q), P(XU + HT, q)], 0.010, pal.wire, res=2))
    for o in objs: parent(o, root)
    return root

def entry(pal):
    root = empty('ETW', (XE, 0, 0))
    objs = [cyl('ETW-body', RAD, 2 * HT, (XE, 0, 0), pal.disc, rot=(0, math.pi / 2, 0), verts=96)]
    for s in (-1, 1): objs.append(torus('ETW-rim%d' % s, RAD, 0.022, (XE + s * HT, 0, 0), pal.rim, rot=(0, math.pi / 2, 0)))
    for j in range(N):
        objs.append(sphere('ETW-c%d' % j, 0.045, P(XE - HT, j), pal.contact, seg=12, ring=8))
        objs.append(sphere('ETW-cr%d' % j, 0.045, P(XE + HT, j), pal.contact, seg=12, ring=8))
        objs.append(curve('ETW-w%d' % j, [P(XE - HT, j), P(XE + HT, j)], 0.008, pal.wire, res=2))
    for o in objs: parent(o, root)
    return root

def set_turn(root, steps):
    root.rotation_euler = (2 * math.pi * steps / N, 0, 0)

def build_inside(pos=S1, pals=None):
    """中の図の全体。pos＝(左, 真ん中, 右) の向き。返す辞書：rot（円板の親）、lamps、keys、mats ほか"""
    pals = pals or {}
    pm = pals.get('main') or Pal('m')
    axle = cyl('axle', 0.06, XE - XU + 0.6, ((XE + XU) / 2, 0, 0), mat('axle', '#4a5878', rough=.5, metal=.4), rot=(0, math.pi / 2, 0), verts=24)
    R = {}
    for name, x, wr, o in zip(('L', 'M', 'R'), (XL, XM, XR), ORDER, pos):
        w = [ABC.index(WIRE[wr][k]) for k in range(N)]
        R[name] = rotor(name, x, w, pals.get(name) or pm); set_turn(R[name], o)
    R['U'] = reflector(pals.get('U') or pm); R['E'] = entry(pals.get('E') or pm)
    lamps, lampm, keys, keym = [], [], [], []
    boardm = mat('board', '#26314a', rough=.6, unique=True)
    for cx in (LAMP_CX, KEY_CX):
        box('board%d' % (cx > 0), (9 * PDX + 0.3, 0.06, 3 * PDZ + 0.25), (cx, 0.22, PZ0 - PDZ), boardm, bevel=0.04)
    for j in range(N):
        lm = mat('lamp%d' % j, LAMP0, rough=.3, emit=YEL, strength=0, unique=True)
        lamps.append(sphere('lamp%d' % j, 0.13, lamp_pos(j), lm, seg=20, ring=12)); lampm.append(lm)
        km = mat('key%d' % j, KEYC, rough=.5, emit=YEL, strength=0, unique=True)
        k = cyl('key%d' % j, 0.14, 0.12, key_pos(j) + Vector((0, -0.06, 0)), km, rot=(math.pi / 2, 0, 0), verts=24)
        keys.append(k); keym.append(km)
    bm = mat('bat', '#3d6fb8', rough=.4, unique=True); bcm = mat('batcap', '#c4cde0', rough=.3, metal=.6, unique=True)
    cyl('battery', 0.2, 0.55, BAT, bm, rot=(0, math.pi / 2, 0))
    cyl('battery-cap', 0.08, 0.1, BAT + Vector((-0.32, 0, 0)), bcm, rot=(0, math.pi / 2, 0))
    cyl('battery-band', 0.205, 0.12, BAT + Vector((0.16, 0, 0)), bcm, rot=(0, math.pi / 2, 0))
    S_extra = [boardm, bm, bcm]
    return {'rot': R, 'lamps': lamps, 'lampm': lampm, 'keys': keys, 'keym': keym, 'pal': pm, 'extra': S_extra}

def light_lamp(S, j, a):
    set_emit(S['lampm'][j], YEL, 1.0 * a); set_color(S['lampm'][j], YEL if a > 0.05 else LAMP0)

def push_key(S, j, a):
    k = S['keys'][j]; k.location = key_pos(j) + Vector((0, -0.06 + 0.07 * a, 0))
    set_emit(S['keym'][j], YEL, 1.0 * a)

def path_obj(name, p, color=YEL, strength=0.9, radius=0.036):
    m = mat(name + '-m', color, rough=.4, emit=color, strength=strength, unique=True)
    pts = smooth_pts(path_points(p), 5, frac=0.3, cap=0.07)
    o = curve(name, pts, radius, m, res=4)
    o.data.bevel_factor_end = 0
    head = sphere(name + '-head', 0.07, pts[0], mat(name + '-hm', LIGHTC, emit=LIGHTC, strength=1.5, unique=True), seg=16, ring=10)
    return {'obj': o, 'pts': pts, 'head': head, 'mat': m}

def draw_path(Pth, u, head=True):
    u = max(0.0, min(1.0, u))
    Pth['obj'].data.bevel_factor_end = max(u, 0.0005)
    Pth['obj'].hide_render = u <= 0.0005
    Pth['head'].location = point_at(Pth['pts'], u)
    Pth['head'].hide_render = not head or u <= 0.0005 or u >= 0.999

def draw_path_rev(Pth, u, head=True):
    """道を終わり（電球の側）から始めへ向かって描く（逆にたどる）。"""
    u = max(0.0, min(1.0, u))
    Pth['obj'].data.bevel_factor_end = 1; Pth['obj'].data.bevel_factor_start = min(1 - u, 0.9995)
    Pth['obj'].hide_render = u <= 0.0005
    Pth['head'].location = point_at(Pth['pts'], 1 - u)
    Pth['head'].hide_render = not head or u <= 0.0005 or u >= 0.999

IN_SIZE = (1000, 620)
CAM_IN = ((1.4, -12.5, 3.6), (0.45, 0, -0.95), 45)

def in_anchors(S, extra=()):
    top = RAD + 0.25
    a = {'U': P(XU, 0, top), 'L': P(XL, 0, top), 'M': P(XM, 0, top), 'R': P(XR, 0, top), 'E': P(XE, 0, top),
         'battery': BAT + Vector((0, 0, -0.25)), 'lampBoard': Vector((LAMP_CX, 0, PZ0 - 3 * PDZ - 0.05)), 'keyBoard': Vector((KEY_CX, 0, PZ0 - 3 * PDZ - 0.05)),
         'lampTop': Vector((LAMP_CX, 0, PZ0 + 0.2)), 'keyTop': Vector((KEY_CX, 0, PZ0 + 0.2))}
    for L in 'AGPX':
        j = ABC.index(L); a['lamp' + L] = lamp_pos(j); a['key' + L] = key_pos(j)
    return a

def lights_in():
    lights(key=(4, -7, 7), fill=(-7, -5, 2), rim=(-1, 6, 5), power=1100, target=(0.5, 0, 0))

# ---- I1：A を押す → 電流の道（向き J・H・B） ----
def verify_path(S, p):
    """描く道が、円板の中の導線（作った 3D の線そのもの）と、両端でぴったり重なることを確かめる。"""
    bpy.context.view_layer.update()
    ends = []
    for o in bpy.data.objects:
        if o.type == 'CURVE' and '-w' in o.name and o.name.split('-')[0] in ('L', 'M', 'R', 'UKW'):
            sp = o.data.splines[0].points; mw = o.matrix_world
            ends.append((mw @ sp[0].co.xyz, mw @ sp[len(sp) - 1].co.xyz))
    raw = rotor_core(p)
    pairs = [(raw[2 * n], raw[2 * n + 1]) for n in range(3)] + [(raw[6], raw[9])] + [(raw[10 + 2 * n], raw[11 + 2 * n]) for n in range(3)]
    for a, b in pairs:
        ok = any(((a - e0).length < 1e-4 and (b - e1).length < 1e-4) or ((a - e1).length < 1e-4 and (b - e0).length < 1e-4) for e0, e1 in ends)
        assert ok, ('道が導線と重ならない', a, b)
    print('[enigma] 道は 7 か所とも導線と一致', ''.join(ABC[c] for c in p))

def b_path():
    S = build_inside(S1); camera(*CAM_IN[:2], lens=CAM_IN[2]); lights_in()
    verify_path(S, PA1)
    S['p'] = path_obj('pathA', PA1); return S
def a_path(S, i):
    u = i / 59
    push_key(S, 0, seg(u, 0, .08) * (1 - seg(u, .95, 1) * 0))
    draw_path(S['p'], seg(u, .08, .88) if u < .88 else 1)
    light_lamp(S, PA1[-1], seg(u, .86, .94))

# ---- I2：1枚の円板（真ん中）を手前に出す ----
def b_rotor():
    pm, po = Pal('m'), Pal('o')
    S = build_inside(S1, {'main': po, 'M': pm}); S['pm'], S['po'] = pm, po
    camera(*CAM_IN[:2], lens=CAM_IN[2]); lights_in()
    # 真ん中の円板で、1回目の道が通る導線（右の面 C → 左の面 U）
    o = S1[1]; k = (PA1[1] + o) % N
    assert (ABC.index(WIRE['II'][k]) - o) % N == PA1[2]
    hm = mat('hl', YEL, emit=YEL, strength=5, unique=True)
    # 円板はもう o 目盛り回っているので、いまの（絶対の）位置で作ってから親に付ける
    S['hl'] = curve('M-hl', [P(XM + HT, PA1[1]), P(XM - HT, PA1[2])], 0.03, hm, res=4)
    parent(S['hl'], S['rot']['M']); S['hlm'] = hm
    return S
def a_rotor(S, i):
    u = i / 71
    out = seg(u, .05, .45); spin = seg(u, .45, .95)
    root = S['rot']['M']
    cam = bpy.context.scene.camera.location
    # 手前（カメラの方）へ 45% 近づけ、少し上げる
    tgt = Vector((XM, 0, 0)).lerp(Vector(cam), 0.42) + Vector((0, 0, -0.35))
    root.location = Vector((XM, 0, 0)).lerp(tgt, out)
    root.rotation_euler = Euler((2 * math.pi * S1[1] / N, 0, math.radians(-62) * spin))
    S['po'].fade(1 - 0.82 * out)
    for m in S['lampm'] + S['keym'] + S['extra']: set_alpha(m, 1 - 0.82 * out)
    set_emit(S['hlm'], YEL, 5 * seg(u, .7, .9)); S['hl'].hide_render = u < .7
def an_rotor(S, i):
    root = S['rot']['M']; mw = root.matrix_world
    o = S1[1]; k = (PA1[1] + o) % N
    c = mw.translation
    return {'Mcenter': c.copy(), 'Mtop': c + Vector((0, 0, RAD + 0.15)), 'Mbottom': c + Vector((0, 0, -RAD - 0.15)),
            'hlR': mw @ Vector((HT, CR * math.sin(ANG(k)), CR * math.cos(ANG(k)))),
            'hlL': mw @ Vector((-HT, CR * math.sin(ANG(ABC.index(WIRE['II'][k]))), CR * math.cos(ANG(ABC.index(WIRE['II'][k])))))}

# ---- I3：A を3回 → 右の円板が一目盛りずつ → G、P、X ----
STEP_F = 34
def b_step():
    S = build_inside((9, 7, 0)); camera(*CAM_IN[:2], lens=CAM_IN[2]); lights_in()
    S['ps'] = [path_obj('pA%d' % n, p) for n, p in enumerate((PA1, PA2, PA3))]
    for n, (st, p) in enumerate(((S1, PA1), (S2, PA2), (S3, PA3))):
        set_turn(S['rot']['R'], st[2]); verify_path(S, p)
    set_turn(S['rot']['R'], 0); return S
def a_step(S, i):
    n = min(2, i // STEP_F); f = (i - n * STEP_F) / (STEP_F - 1)
    turn = seg(f, 0.0, 0.25)
    set_turn(S['rot']['R'], n + turn)
    push_key(S, 0, seg(f, 0, .12) * (1 - seg(f, .9, 1)))
    for q in range(3):
        if q == n: draw_path(S['ps'][q], seg(f, .27, .75))
        else: draw_path(S['ps'][q], 0)
    for j in range(N): light_lamp(S, j, 0)
    light_lamp(S, (PA1, PA2, PA3)[n][-1], seg(f, .74, .8))

# ---- I4：同じ設定で G を押す → 道を逆にたどって A ----
def b_rev():
    S = build_inside(S1); camera(*CAM_IN[:2], lens=CAM_IN[2]); lights_in()
    S['pa'] = path_obj('pathA', PA1, color='#9c8434', strength=0.5, radius=0.03)
    # G を押した道：キー G → 入口 → 円板の中は A の道とまったく同じ導線を逆向きに → 入口 → 電球 A。
    S['pg'] = path_obj('pathG', PG1, color=LIGHTC, strength=1.3, radius=0.046)
    verify_path(S, PA1); verify_path(S, PG1)
    ca, cg = rotor_core(PA1), rotor_core(PG1)
    assert all((a - b).length < 1e-6 for a, b in zip(ca, reversed(cg))), '円板の中の道が逆になっていない'
    return S
def a_rev(S, i):
    u = i / 63
    draw_path(S['pa'], 1, head=False)
    push_key(S, 6, seg(u, .12, .2))
    draw_path(S['pg'], seg(u, .2, .86))
    light_lamp(S, 0, seg(u, .84, .92))

# ---- I5：円板を入れ替える → 円板を回す ----
def b_swap():
    S = build_inside((9, 7, 0)); camera(*CAM_IN[:2], lens=CAM_IN[2]); lights_in(); return S
def a_swap(S, i):
    u = i / 71
    sw = seg(u, .05, .45)
    rM, rR = S['rot']['M'], S['rot']['R']
    # 真ん中と右を、上と下の弧で入れ替える
    xm = XM + (XR - XM) * sw; xr = XR + (XM - XR) * sw; arc = math.sin(math.pi * sw)
    rM.location = (xm, 0, 1.4 * arc); rR.location = (xr, -2.4 * arc, 0.7 * arc)   # 一方は上へ、もう一方は手前へ（板に当たらない）
    rot = seg(u, .55, .95)
    set_turn(S['rot']['L'], 9 + 5 * rot); set_turn(rM, 7 - 4 * rot); set_turn(rR, 0 + 7 * rot)

# ================= 外の図（エニグマの本体） =================
ROWS = ['QWERTZUIO', 'ASDFGHJK', 'PYXCVBNML']
BX, BY, BZ = 3.4, 2.8, 1.2
def key_xy(L):
    for r, row in enumerate(ROWS):
        if L in row:
            n = len(row); c = row.index(L); return ((c - (n - 1) / 2) * 0.34, -0.5 - 0.3 * r)
def lamp_xy(L):
    for r, row in enumerate(ROWS):
        if L in row:
            n = len(row); c = row.index(L); return ((c - (n - 1) / 2) * 0.32, 0.56 - 0.27 * r)
def plug_xz(L):
    for r, row in enumerate(ROWS):
        if L in row:
            n = len(row); c = row.index(L); return ((c - (n - 1) / 2) * 0.33, 0.86 - 0.3 * r)

def build_outside():
    wood = mat('wood', WOOD, rough=.7); wood2 = mat('wood2', WOOD2, rough=.75)
    panel = mat('panel', PANEL, rough=.55, metal=.2)
    box('case', (BX, BY, BZ), (0, 0, BZ / 2), wood, bevel=0.04)
    box('rimT', (BX + 0.04, BY + 0.04, 0.08), (0, 0, BZ - 0.02), wood2, bevel=0.02)
    box('deck', (BX - 0.24, BY - 0.24, 0.04), (0, 0, BZ + 0.01), panel)
    box('cover', (1.7, 0.62, 0.22), (0, 1.0, BZ + 0.12), panel, bevel=0.03)
    wheels = []
    for n, x in enumerate((-0.42, 0, 0.42)):
        w = cyl('wheel%d' % n, 0.3, 0.1, (x, 1.0, BZ + 0.24), mat('wheel', '#b8c2d6', rough=.35, metal=.6), rot=(0, math.pi / 2, 0), verts=26, smooth=False)
        wheels.append(w)
        box('win%d' % n, (0.12, 0.02, 0.12), (x + 0.16, 0.68, BZ + 0.15), mat('win', '#e8e2cf', rough=.4))
    keys, keym, lamps, lampm = {}, {}, {}, {}
    stem = mat('stem', '#6b7894', rough=.4, metal=.5)
    for L in ABC:
        x, y = key_xy(L)
        km = mat('k' + L, KEYC, rough=.45, emit=YEL, strength=0, unique=True)
        grp = empty('key' + L, (x, y, BZ))
        a = cyl('kstem' + L, 0.025, 0.16, (x, y, BZ + 0.1), stem, verts=12)
        b = cyl('kcap' + L, 0.12, 0.05, (x, y, BZ + 0.2), km, verts=32)
        c = torus('kring' + L, 0.12, 0.012, (x, y, BZ + 0.2), stem, seg=32)
        for o in (a, b, c): parent(o, grp)
        keys[L], keym[L] = grp, km
        lx, ly = lamp_xy(L)
        lm = mat('l' + L, LAMP0, rough=.3, emit=YEL, strength=0, unique=True)
        lamps[L] = cyl('lamp' + L, 0.1, 0.03, (lx, ly, BZ + 0.035), lm, verts=32); lampm[L] = lm
        torus('lring' + L, 0.105, 0.012, (lx, ly, BZ + 0.05), stem, seg=32)
    # 手前の差し込み板（前の面）
    pb = box('plugboard', (BX - 0.3, 0.04, 0.95), (0, -BY / 2 - 0.01, 0.55), panel)
    sock = mat('sock', '#0c1220', rough=.6)
    for L in ABC:
        x, z = plug_xz(L)
        for dz in (0.045, -0.045):
            cyl('s%s%d' % (L, dz > 0), 0.028, 0.03, (x, -BY / 2 - 0.035, z + dz), sock, rot=(math.pi / 2, 0, 0), verts=12)
        torus('sr' + L, 0.075, 0.01, (x, -BY / 2 - 0.035, z), stem, rot=(math.pi / 2, 0, 0), seg=24)
    return {'keys': keys, 'keym': keym, 'lamps': lamps, 'lampm': lampm, 'wheels': wheels}

def out_light(S, L, a):
    set_emit(S['lampm'][L], YEL, 1.2 * a); set_color(S['lampm'][L], YEL if a > 0.05 else LAMP0)
def out_push(S, L, a):
    x, y = key_xy(L); S['keys'][L].location = (x, y, BZ - 0.1 * a)

EXT_SIZE = (1000, 760)
def lights_out():
    lights(key=(3, -5, 7), fill=(-6, -4, 3), rim=(-2, 6, 6), power=1000, target=(0, 0, 1))

# ---- E1：本体（ゆっくり回り込む） ----
def b_intro():
    S = build_outside(); S['cam'] = camera((-4.2, -5.6, 5.0), (0, 0, 0.9), lens=40); lights_out(); return S
def a_intro(S, i):
    u = i / 71; th = math.radians(-125 + 40 * ease(u)); r = 7.0 - 0.8 * ease(u)
    aim(S['cam'], (r * math.cos(th), r * math.sin(th), 4.9 - 0.4 * ease(u)), (0, 0.05, 0.95))
def an_ext(S, i):
    a = {}
    for L in 'AG':
        x, y = key_xy(L); a['key' + L] = Vector((x, y, BZ + 0.22))
        x, y = lamp_xy(L); a['lamp' + L] = Vector((x, y, BZ + 0.05))
    a['wheels'] = Vector((0, 1.0, BZ + 0.55)); a['lampboard'] = Vector((0, 0.3, BZ)); a['keyboard'] = Vector((0, -0.8, BZ))
    a['plug'] = Vector((0, -BY / 2, 0.15))
    return a

# ---- E2：キー A を押す → 電球 G が光る ----
CAM_PRESS = ((0.5, -5.2, 5.6), (0, 0.05, 0.95), 42)
def b_press():
    S = build_outside(); camera(*CAM_PRESS[:2], lens=CAM_PRESS[2]); lights_out(); return S
def a_press(S, i):
    u = i / 47
    out_push(S, 'A', seg(u, .15, .3)); out_light(S, 'G', seg(u, .3, .38))

# ---- E3：差し込み板に線を挿す（10本） ----
PAIRS = ['AQ', 'BJ', 'CW', 'DK', 'EZ', 'FL', 'HU', 'IP', 'MR', 'NX']
def b_plug():
    S = build_outside(); camera((0.9, -6.4, 2.4), (0, -BY / 2, 0.5), lens=44); lights_out()
    cm = mat('cable', '#d28a52', rough=.5); pm = mat('plug', '#2a3144', rough=.4)
    S['cab'] = []
    for n, pr in enumerate(PAIRS):
        (x1, z1), (x2, z2) = plug_xz(pr[0]), plug_xz(pr[1])
        y0 = -BY / 2 - 0.06; sag = 0.32 + 0.05 * (n % 3)
        pts = [Vector((x1, y0, z1)), Vector((x1, y0 - 0.16, z1 - 0.06))]
        for k in range(1, 12):
            t = k / 12; x = x1 + (x2 - x1) * t; z = z1 + (z2 - z1) * t - sag * math.sin(math.pi * t)
            pts.append(Vector((x, y0 - 0.2 - 0.1 * math.sin(math.pi * t), z)))
        pts += [Vector((x2, y0 - 0.16, z2 - 0.06)), Vector((x2, y0, z2))]
        c = curve('cable%d' % n, pts, 0.022, cm, res=4)
        p1 = cyl('plugA%d' % n, 0.05, 0.12, (x1, y0 - 0.05, z1), pm, rot=(math.pi / 2, 0, 0), verts=16)
        p2 = cyl('plugB%d' % n, 0.05, 0.12, (x2, y0 - 0.05, z2), pm, rot=(math.pi / 2, 0, 0), verts=16)
        S['cab'].append((c, p1, p2))
    return S
def a_plug(S, i):
    u = i / 71
    for n, (c, p1, p2) in enumerate(S['cab']):
        g = seg(u, .04 + n * .085, .04 + n * .085 + .1)
        c.data.bevel_factor_end = max(g, .0005); c.hide_render = g <= .0005
        p1.hide_render = g <= .0005; p2.hide_render = g < .98

if __name__ == '__main__':
    run([
        Shot('ext-intro', 72, EXT_SIZE, b_intro, a_intro, an_ext),
        Shot('ext-press', 48, EXT_SIZE, b_press, a_press, an_ext),
        Shot('ext-plug', 72, EXT_SIZE, b_plug, a_plug, an_ext),
        Shot('in-path', 60, IN_SIZE, b_path, a_path, in_anchors, info={'path': [ABC[c] for c in PA1]}),
        Shot('in-rotor', 72, IN_SIZE, b_rotor, a_rotor, lambda S, i: {**in_anchors(S), **an_rotor(S, i)}),
        Shot('in-step', 3 * STEP_F, IN_SIZE, b_step, a_step, in_anchors, info={'paths': [[ABC[c] for c in p] for p in (PA1, PA2, PA3)], 'stepFrames': STEP_F}),
        Shot('in-reverse', 64, IN_SIZE, b_rev, a_rev, in_anchors, info={'pathG': [ABC[c] for c in PG1]}),
        Shot('in-swap', 72, IN_SIZE, b_swap, a_swap, in_anchors),
    ], [os.path.abspath(__file__)])
