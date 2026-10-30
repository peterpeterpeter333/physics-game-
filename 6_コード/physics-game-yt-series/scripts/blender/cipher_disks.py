# 技術の疑問の鎖 序章2-2（ys-chain-00b2）・序章2-3（ys-chain-00b3）の 3D：アルベルティの円板・配線入りの円板・3枚の距離計式の円板。
#   B=/Applications/Blender.app/Contents/MacOS/Blender
#   $B -b --factory-startup -P scripts/blender/cipher_disks.py -- --out /private/tmp/ys/ys-chain-00b2/blender --shots alb2-make,alb2-step
#   $B -b --factory-startup -P scripts/blender/cipher_disks.py -- --out /private/tmp/ys/ys-chain-00b3/blender --shots alb2-step,wired,odo3
# 序章（enigma.py）・序章3（enigma_open.py）の円板の形・材質・配線の表を import して使う（どちらも変えない）。
#
# 図のために決めた値（全部ここで計算し、assert で確かめる）
#  - アルベルティの円板：図は 26文字（本物は 24 の区切り）。外 A〜Z、内 gkwnprtuzlxysomqihfdbacevj（enigma_open.py の ALB_IN と同じ）。
#    内の円板を t 目盛り回すと（上から見て時計回り）、外の j の真下は 内の (j−t) 番目。t＝0：A の下 g、t＝1：A の下 j。
#    g が来る外の文字：t＝0 → A、t＝1 → B、t＝4 → E（2-2 行10）。
#  - 配線入りの円板（wired）：序章と同じ円板 I。キーを押すたびに一目盛り（set_turn で 1 ずつ）。2回押す。
#    表の A の接点に入った電流の出口：向き 0 → E、向き 1 → J、向き 2 → K（enigma.fwd で計算、assert）。
#  - 3枚の距離計（odo3）：切り欠きは 3枚とも Z。右が Z から進むとき真ん中も、真ん中も Z から進むとき左も進む（ただの距離計）。
#    前半：A・A・W → AAX → AAY → AAZ → ABA。後半（早送りの後）：A・Z・X → AZY → AZZ → BAA。
#    周期：この規則で元の向きに戻るまで 26×26×26＝17,576 回（下で数えて assert）。
import bpy, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bl_common import *
import enigma as EN
import enigma_open as EO
from enigma import ABC, N, WIRE, fwd, P, RAD, YEL, BRASS, KEYC, set_turn
from mathutils import Vector

PITCH = 2 * math.pi / N
CR_W = EN.CR                                     # 円板の接点の半径（enigma.py の P）
ALB_IN = EO.ALB_IN
assert ALB_IN == 'gkwnprtuzlxysomqihfdbacevj'
under = lambda j, t: ALB_IN[(j - t) % N]          # 外の j の真下の内の文字（向き t）
assert under(0, 0) == 'g' and under(0, 1) == 'j'
assert [j for t in (0, 1, 4) for j in range(N) if under(j, t) == 'g'] == [0, 1, 4]   # A・B・E

# ================= アルベルティの円板（上から少し傾けて見る） =================
R_OUT, R_IN = 2.9, 1.95
O_LET, I_LET = 2.45, 1.50                         # 文字を置く半径（2D の札をここに重ねる）
def b_alb2():
    om = mat('aout', '#e8e2cf', rough=.6, unique=True); im = mat('ain', '#c9a45c', rough=.5, metal=.2, unique=True)
    lm = mat('aline', '#5e4128', rough=.6, unique=True)
    cyl('aouter', R_OUT, 0.12, (0, 0, 0), om, verts=128)
    torus('aring', 2.0, 0.02, (0, 0, 0.065), lm, seg=128); torus('aring2', R_OUT, 0.025, (0, 0, 0.065), lm, seg=128)
    for j in range(N):
        a = 2 * math.pi * (j + 0.5) / N
        box('ao%d' % j, (0.025, 0.85, 0.02), (2.45 * math.sin(a), 2.45 * math.cos(a), 0.065), lm, rot=(0, 0, -a))
    inner = empty('IN', (0, 0, 0))
    d = cyl('ainner', R_IN, 0.12, (0, 0, 0.12), im, verts=128); parent(d, inner)
    for j in range(N):
        a = 2 * math.pi * (j + 0.5) / N
        t = box('ai%d' % j, (0.025, 1.1, 0.02), (1.38 * math.sin(a), 1.38 * math.cos(a), 0.185), lm, rot=(0, 0, -a)); parent(t, inner)
    pin = cyl('apin', 0.12, 0.34, (0, 0, 0.22), mat('apin', '#7a5634', rough=.5), verts=24)
    camera((0, -4.4, 9.6), (0, -0.2, 0), 34)
    EO.fit([Vector((3.0 * math.sin(a), 3.0 * math.cos(a), 0)) for a in [k * PITCH for k in range(N)]] + [Vector((0, 0, 1.9))], margin=.03)
    lights(key=(3, -4, 8), fill=(-5, -2, 5), rim=(0, 5, 6), power=900, target=(0, 0, 0))
    return {'in': inner, 'pin': pin}
def alb_state(S, z, turn, pin):
    S['in'].location = (0, 0, z); S['in'].rotation_euler = (0, 0, -PITCH * turn)
    S['pin'].location = (0, 0, 0.22 + pin); S['pin'].hide_render = pin > 2.5
def alb_anchors(z, turn, pin):
    a = {}
    for j in range(N):
        ao = 2 * math.pi * j / N; ai = ao + PITCH * turn
        a['o%d' % j] = Vector((O_LET * math.sin(ao), O_LET * math.cos(ao), 0.08))
        a['i%d' % j] = Vector((I_LET * math.sin(ai), I_LET * math.cos(ai), 0.2 + z))
    a['center'] = Vector((0, 0, 0.2 + z)); a['pinTop'] = Vector((0, 0, 0.4 + pin)); a['top'] = Vector((0, R_OUT, 0.1)); a['bottom'] = Vector((0, -R_OUT, 0.1))
    return a
# alb2-make：内の円板が上から降りてきて重なり、真ん中を留める
MAKE_F = 72
def make_z(u): return 0.7 * (1 - seg(u, .08, .55))
def make_turn(u): return -2.0 * (1 - seg(u, .08, .55))      # 降りながら少し回って、向き 0 に収まる
def make_pin(u): return 3.0 * (1 - seg(u, .6, .82))
def a_make(S, i): u = i / (MAKE_F - 1); alb_state(S, make_z(u), make_turn(u), make_pin(u))
def an_make(S, i): u = i / (MAKE_F - 1); return alb_anchors(make_z(u), make_turn(u), make_pin(u))
# alb2-step：内の円板を一目盛り回す（向き 0 → 1）
STEP_F = 48
def step_turn(u): return seg(u, .1, .9)
def a_step(S, i): u = i / (STEP_F - 1); alb_state(S, 0, step_turn(u), 0)
def an_step(S, i): u = i / (STEP_F - 1); return alb_anchors(0, step_turn(u), 0)

# ================= 配線入りの円板（キーを押すたびに一目盛り） =================
WIRED_F = 132
def wired_turn(u): return seg(u, .40, .52) + seg(u, .72, .84)
def wired_key(u):  # キーの沈み 0〜1（押して戻る）
    k = 0.0
    for a in (.34, .66):
        k = max(k, seg(u, a, a + .06) * (1 - seg(u, a + .2, a + .26)))
    return k
OUT = [fwd('I', o, 0) for o in range(3)]
assert [ABC[c] for c in OUT] == ['E', 'J', 'K'], OUT
def b_wired():
    pal = EN.Pal('w')
    root, hls, W = EO.big_rotor('C', 'I', pal, hl=((0, YEL),), body=mat('wbody', '#5d7bb5', rough=.4, alpha=.22, unique=True))
    # 向きの印（円板の縁の オレンジの札、序章と同じ）と、動かない上の目印
    mk = box('C-mark', (0.5, 0.1, 0.1), P(0, 0, RAD + 0.09), pal.mark); parent(mk, root)
    cone('ptr', 0.12, 0.0, 0.26, (0, 0, RAD + 0.42), mat('ptr', YEL, emit=YEL, strength=.8, unique=True), rot=(math.pi, 0, 0))
    # アルベルティの円板（はじめに見せて、配線入りの円板に置きかわる）。円板と同じ向き（x 軸まわり）に立てる
    om = mat('wa-out', '#e8e2cf', rough=.6, alpha=1.0, unique=True); im = mat('wa-in', '#c9a45c', rough=.5, metal=.2, alpha=1.0, unique=True)
    ao = cyl('wa-outer', RAD + 0.12, 0.06, (0.02, 0, 0), om, rot=(0, math.pi / 2, 0), verts=96)
    ai = cyl('wa-inner', (RAD + 0.12) * R_IN / R_OUT, 0.06, (0.08, 0, 0), im, rot=(0, math.pi / 2, 0), verts=96)
    # キーは 3D に入れない（円板を大きく見せるため）。押す動きは 2D の図で描く（info の keys＝押す進み）
    S = {'root': root, 'hls': hls, 'W': W, 'ao': ao, 'ai': ai, 'om': om, 'im': im,
         'body': bpy.data.materials['wbody'], 'pal': pal}
    for t in (0, 1, 2):          # 接点 j の世界の位置 ＝ アンカーの式（角 ANG(j−t)）
        set_turn(root, t); bpy.context.view_layer.update()
        for j in (0, 5, 13):
            w = bpy.data.objects['C-cr%d' % j].matrix_world.translation
            ang = 2 * math.pi * (j - t) / N
            assert abs(w.y - CR_W * math.sin(ang)) < 1e-3 and abs(w.z - CR_W * math.cos(ang)) < 1e-3, (t, j, w)
    set_turn(root, 0); bpy.context.view_layer.update()
    S['parts'] = [o for o in bpy.data.objects if o.name.startswith('C-') and o.type in ('MESH', 'CURVE') and 'hlw' not in o.name and o.name != 'C-body']
    camera((4.6, -3.1, 1.2), (0.0, 0.0, -0.3), 40); EO.lights_std(power=1100)
    EO.fit([P(x, j, RAD + 0.15) for x in (-0.6, 0.6) for j in range(0, 26, 2)] + [Vector((0, 0, RAD + 0.6))], margin=.04)
    return S
def a_wired(S, i):
    u = i / (WIRED_F - 1)
    g = seg(u, .1, .28)                                # アルベルティ → 配線入り
    set_alpha(S['om'], 1 - g); set_alpha(S['im'], 1 - g)
    S['ao'].hide_render = S['ai'].hide_render = g > .98
    set_alpha(S['body'], .22 * g)
    for o in S['parts']:
        if o.type == 'CURVE': o.data.bevel_factor_end = max(.0005, g); o.hide_render = g < .02
        else: o.hide_render = g < .02
    EO.show_hl(S['hls'][0], seg(u, .26, .32))
    set_turn(S['root'], wired_turn(u))
def an_wired(S, i):
    u = i / (WIRED_F - 1); t = wired_turn(u)
    a = {'ptr': Vector((0, 0, RAD + 0.62)), 'bottom': Vector((0, 0, -RAD - 0.2)), 'center': Vector((0, 0, 0))}
    for j in range(N):     # 縁の文字の位置（円板といっしょに回る。set_turn(+t) で接点 j は角 ANG(j−t) へ動く）
        ang = 2 * math.pi * (j - t) / N
        a['r%d' % j] = Vector((0.0, (RAD + 0.24) * math.sin(ang), (RAD + 0.24) * math.cos(ang)))
    return a

# ================= 3枚の距離計式の円板 =================
def odo_next(s):
    l, m, r = s
    cm = r == 25; cl = cm and m == 25
    return ((l + cl) % N, (m + cm) % N, (r + 1) % N)
def _period(s0):
    s, n = s0, 0
    while True:
        s = odo_next(s); n += 1
        if s == s0: return n
assert _period((0, 0, 0)) == 17576 == 26 ** 3
WN = lambda s: ''.join(ABC[c] for c in s)
ODA = [(0, 0, 22)]
for _ in range(4): ODA.append(odo_next(ODA[-1]))
ODB = [(0, 25, 23)]
for _ in range(3): ODB.append(odo_next(ODB[-1]))
assert [WN(s) for s in ODA] == ['AAW', 'AAX', 'AAY', 'AAZ', 'ABA'] and [WN(s) for s in ODB] == ['AZX', 'AZY', 'AZZ', 'BAA']
OF = 24; OGAP = 12
ODO_F = 4 * OF + OGAP + 3 * OF
def odo_pos(i):
    """コマ i の (左, 真ん中, 右) の向き（連続）と、窓の文字"""
    def mv(seq, n, f):
        g = seg(f, .2, .75); a, b = seq[n], seq[n + 1]
        return tuple(x + ((y - x) % N) * g for x, y in zip(a, b)), WN(b if g >= .5 else a)
    if i < 4 * OF:
        n = i // OF; return mv(ODA, n, (i - n * OF) / (OF - 1))
    if i < 4 * OF + OGAP:
        return (tuple(float(x) for x in ODA[-1]) if i < 4 * OF + OGAP // 2 else tuple(float(x) for x in ODB[0])), (WN(ODA[-1]) if i < 4 * OF + OGAP // 2 else WN(ODB[0]))
    j = i - 4 * OF - OGAP; n = min(2, j // OF); return mv(ODB, n, (j - n * OF) / (OF - 1))
def b_odo3():
    R, PW, pal = EO.build_steps(notches=('Z', 'Z', 'Z'), pawls=False)
    cm = mat('odo-a', '#6adfff', emit='#6adfff', strength=1.2, unique=True)
    for n in ('L', 'M', 'R'):      # A の位置の印（円板といっしょに回る。向きの変化が見えるように）
        b = box('amark' + n, (2 * EO.TB + 0.02, 0.16, 0.05), (EO.SXC[n], 0, EO.RB + 0.02), cm); parent(b, R[n])
    camera((1.8, -6.0, 2.2), (0.0, 0.0, -0.05), 44); EO.lights_std(power=1000)
    EO.fit([Vector((x, y, z)) for x in (-1.45, 1.45) for y in (-1.0, 1.0) for z in (-1.05, 1.5)], margin=.03)
    return {'R': R}
def a_odo3(S, i): EO.set_pos(S['R'], odo_pos(i)[0])
def an_odo3(S, i):
    return {('top' + n): Vector((EO.SXC[n], 0, EO.RB + 0.55)) for n in ('L', 'M', 'R')} | {('bot' + n): Vector((EO.SXC[n], -0.4, -EO.RB - 0.45)) for n in ('L', 'M', 'R')}

SHOTS = [
    Shot('alb2-make', MAKE_F, (1000, 860), b_alb2, a_make, an_make, info={'inner': ALB_IN}),
    Shot('alb2-step', STEP_F, (1000, 860), b_alb2, a_step, an_step, info={'inner': ALB_IN}),
    Shot('wired', WIRED_F, (1000, 760), b_wired, a_wired, an_wired, info={'out': [ABC[c] for c in OUT], 'turn': [round(wired_turn(i / (WIRED_F - 1)), 4) for i in range(WIRED_F)], 'key': [round(wired_key(i / (WIRED_F - 1)), 4) for i in range(WIRED_F)]}),
    Shot('odo3', ODO_F, (1000, 780), b_odo3, a_odo3, an_odo3, info={'win': [odo_pos(i)[1] for i in range(ODO_F)], 'f': OF, 'gap': OGAP}),
]

if __name__ == '__main__':
    run(SHOTS, [os.path.abspath(__file__), os.path.abspath(EN.__file__), os.path.abspath(EO.__file__)])
