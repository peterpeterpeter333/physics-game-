"""技術の疑問の鎖 D-1 後編（ys-chain-d1b）「機械の中を開ける」の机の 3D。Claude の途中版から新規作成。ChatGPT 2026-10-26。既存の日本語・声・字幕は不変。

机・光・手・得点板は desk_lib（1-1 第6版）、缶・ストロー・富士山・地図は desk_lib_d1（今の版）、
機械は新しい desk_lib_d1_machine_gpt_20261026（前編と共通）。時刻はすべて cue キーと声の語（data.json の wordEvents）で決める。

使い方：
  B=/Applications/Blender.app/Contents/MacOS/Blender
  $B -b --factory-startup --python-use-system-env -P scripts/blender/desk_d1b_gpt_20261026.py -- --cache /private/tmp/ys/ys-chain-d1b_s3_gpt_20261026 [--times 1,2 --scale .5] [--from s --to s] [--catalog] [--problem] [--plan-only]
  出力：<cache>/blender/desk/NNNNN.jpg（コマ＝round(秒×30)）、anchors.json、meta.json、<cache>/blender/camera-motion.json
"""
import os, sys, json, math, time, hashlib, argparse, bisect, types, ctypes, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
saved = sys.argv[:]; sys.argv = sys.argv[:sys.argv.index('--')] if '--' in sys.argv else sys.argv
import bpy
import desk_lib as d
sys.argv = saved
import desk_lib_d1 as ext
import desk_lib_d1b_s3_20261026 as mx
from mathutils import Vector

def args():
    p = argparse.ArgumentParser(); p.add_argument('--cache', default='/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026'); p.add_argument('--times')
    p.add_argument('--from', dest='start', type=float, default=0); p.add_argument('--to', dest='stop', type=float, default=1e9)
    p.add_argument('--scale', type=float, default=.5); p.add_argument('--samples', type=int, default=4); p.add_argument('--out')
    p.add_argument('--force', action='store_true'); p.add_argument('--catalog', action='store_true'); p.add_argument('--problem', action='store_true')
    p.add_argument('--shot-plan', action='store_true'); p.add_argument('--plan-only', action='store_true'); p.add_argument('--dry', action='store_true'); p.add_argument('--finish', action='store_true')
    return p.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
A = args()
assert os.path.realpath(A.cache) not in ['/private/tmp/ys/ys-chain-d1b', '/private/tmp/ys/ys-chain-d1a'], '既存cacheには書かない'
DATA = json.load(open(A.cache + '/blender/data.json')); CUES = DATA['cues']; STARTS = [c['start'] for c in CUES]; CUE = {c['key']: c for c in CUES}
FPS = 30; NF = math.ceil(DATA['duration'] * FPS)

# ---------------- 見せる・隠す（d1v1 と同じ、まとめて最後に反映） ----------------
_VIS = None
def show_now(o, v):
    h = not bool(v)
    if o.hide_render != h: o.hide_render = h
    if o.hide_viewport != h: o.hide_viewport = h
def show_q(o, v):
    if _VIS is None: show_now(o, v)
    else: _VIS[o] = bool(v)
d.show = show_q
P, G = ext.build(DATA, A.cache)
M = mx.build_machine()
TIRED = ext.horse('d1m_tiredhorse', (.05, -.06, 0), 1.5)
TIRED_OBJS = [TIRED['root']] + [o for o in bpy.data.objects if o.name.startswith('d1m_tiredhorse')]
FUJI_MINI = [mx.mini_engine('d1m_fujimini0', (0, 0, 0)), mx.mini_engine('d1m_fujimini1', (0, 0, 0))]
FUJI_ARROWS = [ext.arrow('d1m_fujiarrow0', (0, 0, .05), (0, 0, 0), .0022), ext.arrow('d1m_fujiarrow1', (0, 0, .05 * DATA['numbers']['fujiRatio']), (0, 0, 0), .0022)]
EXTRA = TIRED_OBJS + [o for r, objs, _ in FUJI_MINI for o in [r] + objs] + [o for a in FUJI_ARROWS for o in [a] + list(a.children)]
S3_EXTRAS=mx.build_episode_extras(P,G,FUJI_MINI,FUJI_ARROWS,A.cache,M=M)
S3_EXTRAS['fuji']['layout'].update(
    mount=(.36,.08,0),low=(.09,.08,.125),high=(.36,.08,.300),
    mini_low=(.09,.08,.006),mini_high=(.36,.08,.186))
EXTRA += S3_EXTRAS['all']
S3_MITT=S3_EXTRAS['mitt']['primary']
S3_FUJI=S3_EXTRAS['fuji']['primary']
# 新しい模式地図だけを新材質へ。旧テクスチャ・共通材質は不変。
S3_MAP=[o for o in G['map'] if 'europetex' in o.name or 'mapboard' in o.name]
for o in G['map']:
    if 'europetex' in o.name:
        o.data.materials.clear(); o.data.materials.append(d.imgmat('d1b_s3_europe',A.cache+'/blender/tex/d1-europe-s3.png'))
_MAP_PLACES=[(.225,.27),(.225,.38),(.325,.49),(.425,.49),(.425,.38),
    (.525,.16),(.625,.16),(.525,.27),(.625,.27),(.825,.27),(.925,.27),
    (.625,.38),(.725,.38),(.825,.38),(.925,.38),(.525,.49),(.625,.49),
    (.725,.49),(.825,.49),(.925,.49),(.325,.6),(.525,.6),(.625,.6),
    (.725,.6),(.825,.6),(.925,.6),(.325,.71),(.525,.71),(.625,.71),(.725,.71)]
for i,o in enumerate(P['map']['stamps']):
    u,v=_MAP_PLACES[i]
    # 海を避けた実地図上の格子。最初の2つはイギリス、各印は旧版の2倍。
    o.location=Vector((.20+(u-.5)*.4,.368,.15+(.5-v)*.28)); o.scale=(2,2,2)
MANAGED = list(set(o for objs in G.values() for o in objs)) + M['all'] + EXTRA
BASE = {o: (o.location.copy(), o.rotation_euler.copy(), o.scale.copy()) for o in MANAGED}
SCENE_OBJECTS = list(d.SC.objects); CHILDREN = {o: [] for o in SCENE_OBJECTS}
for c in SCENE_OBJECTS:
    if c.parent in CHILDREN: CHILDREN[c.parent].append(c)
def show_tree(o, v):
    d.show(o, v)
    for c in CHILDREN.get(o, ()): show_tree(c, v)
d.show_tree = show_tree
d.SC.render.resolution_x = round(1080 * A.scale); d.SC.render.resolution_y = round(1920 * A.scale); d.SC.eevee.taa_render_samples = A.samples
for o in MANAGED: d.show(o, False)
# 疲れた馬：脚をたたんで、頭を下げる
for o in TIRED_OBJS:
    if '_leg' in o.name or '_hoof' in o.name: o.scale.z = .35
TIRED['root'].location.z -= .022; TIRED['root'].rotation_euler = (0, .16, 2.75)
BASE.update({o: (o.location.copy(), o.rotation_euler.copy(), o.scale.copy()) for o in TIRED_OBJS})

# ---------------- 時刻 ----------------
def S(k): return CUE[k]['start']
def E(k): return CUE[k]['end']
def W(k, word):
    hits = [w['time'] for w in CUE[k]['wordEvents'] if w['word'] == word]
    assert len(hits) == 1, (k, word, [w['word'] for w in CUE[k]['wordEvents']]); return hits[0]
_PHRASES=json.load(open(A.cache+'/phrase-times.json'))
def PHRASE(k,kana):
    c=CUE[k]; p=_PHRASES[c['subtitle']]; n=p['s'].find(kana)
    assert n>=0 and p['s'].find(kana,n+1)<0,(k,kana)
    return c['start']+p['t'][n]
def U(t, a, dur=.3): return d.sm((t - a) / max(1e-5, dur))
def pulse(t, a, dur=1.2): return math.sin(math.pi * d.clamp((t - a) / dur)) if a <= t <= a + dur else 0.0
def cue_at(t): return CUES[max(0, bisect.bisect_right(STARTS, t + 1e-9) - 1)]
def lerp(a, b, u): return a + (b - a) * u
class CameraPose(list):
    """Seven original pose numbers plus a smoothly interpolated framing shift."""
    pass
def camera_shift(p):
    if hasattr(p,'shift'): return p.shift
    return 0.0 if any(p==CAM[k] for k in ('wide','upper','beam')) else -.06
def mix(p, q, u):
    u=d.sm(u); pose=CameraPose(a+(b-a)*u for a,b in zip(p,q))
    pose.shift=lerp(camera_shift(p),camera_shift(q),u)
    return pose

# ---------------- カメラ（[注視点 x,y,z, 距離, 方位°, 仰角°, レンズ]） ----------------
SX = mx.L['SX']
CAM = {
    'wide': [-.185, .087, .395, 1.13, -10, 25, 40],
    'upper': [-.25, .10, .445, .78, -10, 28, 40],
    'boiler': [-.10, .10, .383, .29, -8, 30, 40],
    'valve': [-.145, .06, .45, .31, -6, 32, 40],
    'valveclose': [-.091, .087, .468, .15, -6, 32, 40],
    'valveshut': [-.0909, .0874, .468, .24, -6, 32, 72],
    'cyl': [-.10, .10, .543, .215, -8, 40, 40],
    'cylspray': [-.10, .10, .543, .215, -8, 32, 40],
    'balance': [-.10, .10, .500, .34, -8, 32, 48],
    'sprayentry': [-.07, .11, .52, .27, -6, 30, 40],
    'beam': [-.25, .10, .665, .98, -8, 28, 40],
    'pumptall': [SX, .10, .125, .35, 0, 8, 48],
    'pumpclose': [SX, .10, .075, .28, 0, 8, 55],
    'pumpmid': [SX, .10, .075, .28, 0, 8, 55],
    'pumpdoor': [-.4345, .10, .112, .45, 0, 10, 45],
    'door': [-.50, .10, .055, .19, 0, 10, 40],
    'drain': [-.031, .072, .402, .30, -6, 32, 40],
    'draincontext': [-.055, .096, .48, .49, -6, 32, 40],
    'drainclose': [.015, .064, .378, .16, 32, 35, 90],
    'drainopen': [.015, .064, .365, .17, 32, 35, 80],
    'tank': [.03, .12, .615, .29, -8, 32, 40],
    'jack': [-.315, .10, .39, .21, -8, 35, 40],
    'jackclose': [-.315, .10, .344, .17, -8, 40, 80],
    'jackdrive': [-.25, .10, .545, .90, -6, 30, 40],
    'jackwide': [-.14, .10, .493, .72, -50, 12, 50],
    'valves': [-.018, .088, .522, .48, -6, 30, 40],
    'waterpath': [-.016, .12, .568, .64, -6, 30, 40],
    'lever': [-.035, .06, .555, .30, -5, 25, 50],
    'leverclose': [-.0105, .066, .554, .22, -5, 35, 40],
    'coal': [-.002, .093, .47, .63, -10, 30, 40],
    'can': [.33, -.11, .065, .62, -12, 35, 40],
    'fuji': [.275, .08, .22, .86, 12, 25, 40],
    'board': [.58, .30, .08, .87, 0, 30, 40],
    'map': [.20, .38, .15, .97, 0, 25, 40],
}
CAM.update(
    straw=[.407,-.12,.074,.32,-6,30,52],
    jackinside=[-.315,.10,.347,.15,-35,24,50],
    valvepair=[-.020,.08,.50,.48,-6,30,40],
    hand=[-.10,.08,.69,.20,-8,25,80],
    cold=[.05,.10,.528,.20,-5,30,72],
    flowpath=[-.015,.11,.555,.43,-10,28,50],
    foot=[SX+.028,.10,.032,.17,0,8,65],
    pumpdetail=[SX,.10,.075,.26,0,8,52],
    pumpexit=[SX+.05,.10,.35,.195,-5,25,55],
    pumpflowwide=[SX,.10,.20,.48,0,8,48],
    tappet=[-.02,.058,.542,.38,-5,25,52],
    cylheat=[-.10,.10,.547,.25,-8,32,48],
    coalonly=[.105,.078,.354,.24,-10,30,60],
)
FUJI_OFF = Vector((0,0,0))

# ---------------- 場面ごとの状態 ----------------
def base_state():
    st = mx.idle_state(); st.update(v=.3, kettle_steam=.8, boil=.5, column=1.0, spout=0.0, sump=.8, covers=.12, air_dots=.5, trough=1.0, tubwater=.6, tank=.6, cold_front=1.0, coal=1.0)
    return st

def run_phase(t, t0, period, phase0=0.0): return phase0 + (t - t0) / period

def cycling(st, phase, lever=False):
    mx.cycle_state(phase, st)
    if not lever: st['lever'] = 0.0
    st['inner_air'] = 0.0
    return st

# 行38：だんだん速くなる往復（周期 4.6 → 2.6 秒）の位相を積分
def accel_phase(t, t0, t1, p0=4.6, p1=2.6):
    if t <= t0: return 0.0
    tt = min(t, t1); u = (tt - t0) / (t1 - t0); T_ = t1 - t0
    # ∫ dt / (p0 + (p1-p0) u)
    k = (p1 - p0)
    ph = T_ / k * math.log((p0 + k * u) / p0) if abs(k) > 1e-9 else (tt - t0) / p0
    return ph + max(0.0, t - t1) / p1

def scene(t):
    """t の場面：(カメラの姿勢, 機械の状態 or None, 他の物の指示 dict)"""
    c = cue_at(t); k = c['key']; st = base_state(); X = {'machine': True, 'groups': [], 'hands': []}
    cam = CAM['wide']
    # ---- 行1：機械はゆっくり上下（手前の面は閉じている）。手が継ぎ目に指をかける
    if k == 'open:machine':
        cycling(st, run_phase(t, 0, 68.19 / 11)); st.update(covers=1.0, air_dots=0, seep=1, spout=1)
        cam = list(CAM['wide']); X['tired'] = True
        a = W(k, '一つずつ開けて')
        X['hands'].append(('kai', (-.137 + .004*math.sin(t*2.2), .066, .40 + .004*math.sin(t*2.2)), 72, -20, .55))
    # ---- 行2：前の回の、つぶれた缶と、コップとストロー
    elif k in ['recap:can', 'recap:straw']:
        X['machine'] = False; X['groups'] = ['can', 'straw']; cam = CAM['can']
        if k=='recap:straw': cam=mix(CAM['can'],CAM['straw'],(t-W(k,'ストロー'))/.8)
        X['can_arrows'] = U(t, W('recap:can', 'まわりの空気'), .5)
        X['straw_push'] = U(t, W('recap:straw', '外の空気'), .6)
    # ---- 行3・4：富士山
    elif k in ['quiz:ask', 'quiz:weak', 'quiz:fuji']:
        X['machine'] = False; X['fuji'] = True; cam = CAM['fuji']
        X['fuji_arrows'] = 1.0 if k!='quiz:ask' else 0
        X['fuji_flash']=pulse(t,W('quiz:weak','弱くなります'),1.0)
        X['fuji_layers'] = 1 if k != 'quiz:ask' else 0
    # ---- 行5：得点板
    elif k == 'score:still':
        X['machine'] = False; X['board'] = True; cam = CAM['board']
    # ---- 行6：機械へ。手前の面が開いて透ける
    elif k == 'parts:likecan':
        cycling(st, run_phase(t, 0, 68.19 / 11)); a = W(k, '中まで開けて'); st.update(covers=1.0, air_dots=0, spout=1)
        X['cover_open']=U(t,a,.8)
        cam = CAM['wide']
        if a - .6 <= t < a + 2.0: X['hands'].append(('kai', (-.137 - .03 * U(t, a, 1.6), .062 - .02 * U(t, a, 1.6), .40), 72, -20, .55))
    # ---- 行7：ボイラー
    elif k in ['boiler:fire', 'boiler:steam']:
        st.update(v=.3 * U(t, S('boiler:fire'), 1.2), steam_valve=0, air_dots=0)
        cam = mix(CAM['wide'], CAM['boiler'], (t - S('boiler:fire')) / 1.2)
        boil = U(t, W('boiler:fire', 'わかします'), .8); st['boil'] = .15 + .85 * boil
        st['kettle_steam'] = .12 + .2 * boil + .68 * U(t, W('boiler:steam', '蒸気になって'), 2.0)
        st['hl'] = {'boiler': pulse(t, W('boiler:fire', 'ボイラー'), 1.2)}
        st['fire'] = 1.0 + .3 * pulse(t, W('boiler:fire', '石炭を燃やして'), 1.0)
    # ---- 行8：蒸気の管と弁、蛇口のたとえ
    elif k in ['valve:pipe', 'valve:tap']:
        st.update(kettle_steam=1, boil=1, air_dots=0)
        cam = mix(CAM['boiler'], CAM['valveclose'], (t - S(k)) / 1.0) if k == 'valve:pipe' else mix(CAM['valveclose'], CAM['valve'], (t - S(k)) / 1.0)
        st['hl'] = {'steampipe': pulse(t, W('valve:pipe', '太い管'), 1.4), 'red': pulse(t, W('valve:pipe', '蒸気の弁'), 1.4)}
        if k == 'valve:tap':
            st['tap_show'] = t >= W(k, '弁は') - .2
            o1 = W(k, '開けたり'); o2 = W(k, '水道の蛇口')
            op = U(t, o1, .25) * (1 - U(t, o1 + .55, .25)) + U(t, o2, .4) * (1 - U(t, o2 + 1.8, .4))
            st.update(tap=op, steam_valve=op, steam_flow=1.0 if op > .5 else 0.0)
            st['hl']['red'] = pulse(t, W(k, '同じ働き'), 1.2)
            cam=mix(CAM['valveclose'],CAM['valve'],(t-W(k,'水道の蛇口'))/.8)
    # ---- 行9：筒の上は開いている。ピストン（革・上に水）
    elif k == 'cyl:open':
        cam = CAM['cyl']
        st.update(kettle_steam=1, boil=.6, air_dots=.25 + .75 * U(t, W(k, '空に向かって'), 1.0))
        a = W(k, '上下に動くふた'); st['v'] = .3 + .28 * math.sin(math.pi * d.clamp((t - a) / 1.6))
        st['hl'] = {'piston': pulse(t, a, 1.6), 'leather': max(pulse(t, W(k, '革でふさぎ'), 1.3), pulse(t, W(k, 'すき間から'), 1.6))}
        st['film'] = U(t, W(k, '少し水をはって'), 1.0)
        X['cyltop_glow'] = pulse(t, W(k, '開いています'), 1.2)
    # ---- 行10：腕と鎖、炭鉱へ下りる重い棒
    elif k == 'arm:chain':
        cam = CAM['beam']; st.update(air_dots=.4)
        st['hl'] = {'beam': pulse(t, W(k, 'シーソーの腕'), 1.3), 'piston': pulse(t, W(k, 'ピストンに'), 1.0), 'chain': pulse(t, W(k, '鎖で'), 1.6)}
    elif k == 'arm:rod':
        cam = mix(CAM['beam'], CAM['wide'], (t - W(k,'長い棒')) / 1.2); st.update(air_dots=.4)
        st['trace'] = U(t, W(k, '炭鉱の底'), 1.6) * (1 - U(t, E(k) - .6, .5))
        st['hl'] = {'minerod': pulse(t, W(k, '長い棒'), 1.4), 'bands': max(pulse(t, W(k, '何本も'), 1.2), pulse(t, W(k, 'つないだ'), 1.2)), 'pipe': 0}
        st['hl']['minerod'] = max(st['hl']['minerod'], .7 * pulse(t, W(k, 'とても重い'), 1.4))
    # ---- 行11・12：ミオの手が腕にぶら下がる。びくともしない
    elif k in ['arm:mio', 'arm:heavy']:
        cam=CAM['hand'] if k=='arm:mio' else CAM['wide']; st.update(air_dots=.4)
        a = W('arm:mio', '持ち上げる')
        if k == 'arm:mio' and t >= a - .3:
            # 指先を腕に残し、手首と袖が下へぶら下がる。指差しとは区別する。
            st['v'] = .3
            sway = 5 * math.sin((t - a) * 4) * math.exp(-max(0, t - a) * .7)
            edge_z = mx.L['PV'][2] + mx.L['ARM'] * math.sin(mx.L['TH'] * (2 * st['v'] - 1))
            reach = U(t, a - .3, .3)
            X['mitt']=True; X['mitt_z']=edge_z; X['mitt_sway']=sway/5
    # ---- 行13〜19：1往復（蒸気 → 上がる → 閉 → 冷水 → 空っぽ → 空気が押す → 戻る）
    elif k in ['run:steam', 'run:up', 'run:shut', 'run:spray', 'run:empty', 'eng:mio', 'run:down', 'run:air', 'run:back']:
        cam = mix(CAM['beam'], CAM['upper'], (t - S('run:steam')) / 1.0) if k == 'run:steam' else CAM['upper']
        if k == 'run:steam':
            cam = mix(CAM['valveshut'], CAM['cylspray'], (t - W(k, '筒に蒸気を入れます')) / 1.0)
            if t >= W(k, '中から'): cam = CAM['balance']
        if k == 'run:up': cam = CAM['wide']
        if k == 'run:shut': cam = CAM['valveshut']
        if k == 'run:spray':
            a=W(k,'冷水の弁'); b=W(k,'水槽'); z=W(k,'噴き出します')
            cam=mix(CAM['upper'],CAM['cold'],(t-a)/.8)
            if t>=b: cam=mix(CAM['cold'],CAM['flowpath'],(t-b)/1.0)
            if t>=z: cam=mix(CAM['flowpath'],CAM['cylspray'],(t-z)/.8)
        if k == 'run:back': cam = mix(CAM['upper'], CAM['valvepair'], (t - W(k,'冷水の弁を閉じて')) / .8)
        zin = W('run:spray', '勢い') + .3
        if k == 'run:spray' and t>=W(k,'噴き出します')+.8: cam=CAM['cylspray']
        if k in ['run:empty', 'eng:mio']: cam = CAM['cylspray']
        if k == 'run:down':
            cam=mix(CAM['wide'],CAM['cyl'],(t-W(k,'押し下げます'))/.8)
            if t>=W(k,'引き上げられます'): cam=mix(CAM['cyl'],CAM['upper'],(t-W(k,'引き上げられます'))/1.0)
        if k=='run:steam' and t<W(k,'筒に蒸気を入れます'): cam=mix(CAM['upper'],CAM['valveshut'],(t-W(k,'蒸気の弁を開けて'))/.65)
        o_s = W('run:steam', '蒸気の弁を開けて') + .7; up = W('run:up', '下がり'); shut = W('run:shut', '閉じます')
        o_c = W('run:spray', '開けます'); spray = W('run:spray', '噴き出します'); empty = W('run:empty', '水に戻って')
        down = W('run:down', '押し下げます'); cl = W('run:back', '冷水の弁を閉じて'); o_s2 = W('run:back', '蒸気の弁を開ければ'); back = W('run:back', 'はじめに戻ります')
        v = .3 + .7 * U(t, up, 1.2); v = v * (1 - U(t, down, 1.2)) + .55 * U(t, back, 1.5)
        st['v'] = v
        st['vdir'] = 1 if up <= t < up + 1.2 else -1 if down <= t < down + 1.2 else 0
        st['vu'] = d.clamp((t - up) / 1.2) if st['vdir'] > 0 else d.clamp((t - down) / 1.2) if st['vdir'] < 0 else 0
        sv = U(t, o_s, .4) * (1 - U(t, shut, .4)) + U(t, o_s2, .4); cv = U(t, o_c, .4) * (1 - U(t, cl, .4))
        st.update(steam_valve=sv, cold_valve=cv, steam_flow=1.0 if sv > .5 else 0, air_dots=.6)
        fill = U(t, W('run:steam', '筒に蒸気を入れます'), 2.0) * (1 - U(t, empty, 2.6)) + .7 * U(t, o_s2 + .3, 1.5)
        st['steam_fill'] = fill
        st['cold_flow'] = 1.0 if (cv > .5 and t >= o_c + .2) else 0.0
        st['cold_front'] = d.clamp((t - o_c - .2) / (spray - o_c - .2))
        st['spray'] = U(t, spray, .4) * (1 - .4 * U(t, empty + 3, 2)) * (1 - U(t, cl, .3))
        st['condensate'] = U(t, empty, 2.6) * .8
        bal = W('run:steam', '押し返す')
        st['steam_arrow'] = 1.0 if (bal <= t < empty) or (t >= o_s2 + .6) else 0.0
        st['air_arrow'] = 1.0 if (bal <= t < empty) or (W('run:down', '外の空気') <= t) else 0.0
        if k in ['run:down', 'run:air'] and t >= W('run:down', '外の空気'): st['steam_arrow'] = 0.0
        if k == 'run:back' and t < o_s2 + .6: st['steam_arrow'] = 0.0
        # 圧力の矢印が冷水の噴流に見えないよう、注水・凝縮だけの場面では消す。
        if k in ['run:spray', 'run:empty', 'eng:mio']:
            st['air_arrow'] = 0.0; st['steam_arrow'] = 0.0
        st['hl'] = {'minerod': max(pulse(t, W('run:up', '炭鉱側の重い棒'), 1.3), pulse(t, W('run:up', '重い棒が引く'), 1.3), pulse(t, W('run:down', '炭鉱の重い棒'), 1.3), pulse(t, W('run:air', '重い棒と水'), 1.3)),
                    'red': max(pulse(t, o_s - .3, 1.0), pulse(t, shut - .2, 1.0), pulse(t, o_s2 - .1, 1.0)), 'blue': max(pulse(t, o_c - .2, 1.0), pulse(t, cl - .1, 1.0)),
                    'tank': pulse(t, W('run:spray', '水槽'), 1.4), 'coldpipe': pulse(t, W('run:spray', '細い管'), 1.4)}
        st['spout'] = 1.0 if st['vdir'] < 0 or (down <= t < down + 2.5) else .0
        X['arrow_glow'] = pulse(t, W('run:air', 'ピストンを押す'), 1.5)
    # ---- 行20・21：顔（全画面）。机はそのまま
    elif k in ['eng:mio2', 'pump:mio']:
        cam = CAM['upper']; st.update(v=.85, steam_valve=1, steam_fill=.7, air_dots=.6, steam_flow=1)
        if k == 'pump:mio': X['machine'] = True
    # ---- 行22〜30：底のポンプの中
    elif k in ['pump:inside', 'pump:rod']:
        cam = CAM['pumptall']; st.update(v=0.0, column=.42)
        if k == 'pump:rod' and t >= W(k, '先のふた'):
            cam = mix(CAM['pumptall'], CAM['pumpdetail'], (t - W(k, '先のふた')) / .8)
        st['hl'] = {'pipe': pulse(t, W('pump:inside', '地上まで'), 1.8), 'minerod': pulse(t, W('pump:rod', '重い棒'), 1.3),
                    'bucket': pulse(t, W('pump:rod', '先のふた'), 1.4), 'foot': pulse(t, W('pump:rod', '弁が一つずつ'), 1.6), 'bflap': pulse(t, W('pump:rod', '弁が一つずつ'), 1.6)}
        st['trace'] = 0
    elif k in ['pump:door2', 'pump:opens']:
        cam = mix(CAM['pumptall'], CAM['pumpdoor'], (t - W('pump:door2','ゲーリケのポンプ')) / .8); st.update(v=0.0, column=.42)
        st['door_show'] = t >= W('pump:door2', 'ゲーリケのポンプ')
        if k == 'pump:opens':
            cam = mix(CAM['pumpdoor'], CAM['door'], (t - W('pump:opens','下から押される')) / .7)
            a = W(k, '下から押される'); o = W(k, '開き'); b = W(k, '上から押される'); c_ = W(k, '閉じます')
            st['door'] = U(t, o - .2, .45) * (1 - U(t, b + .2, .3)) + .06 * math.sin(max(0, t - c_) * 18) * math.exp(-max(0, t - c_) * 5) * (t > c_)
            st['door_up'] = 1.0 if a <= t < b else 0.0; st['door_down'] = 1.0 if t >= b else 0.0
        st['hl'] = {'bflap': pulse(t, W('pump:door2', 'この弁'), 1.4), 'foot': pulse(t, W('pump:door2', 'この弁'), 1.4)}
    elif k == 'pump:down':
        cam = mix(CAM['pumpdoor'], CAM['pumpclose'], (t - S(k)) / 1.0); st.update(column=.42)
        a = W(k, '棒が下がる'); b = E(k) - .4; u = d.clamp((t - a) / (b - a)); st['v'] = d.sm(u); st['vdir'] = 1 if 0 < u < 1 else 0; st['vu'] = u
        st['bvalve'] = U(t, W(k, '下の水に押されて'), .6); st['fvalve'] = 0.0
        st['transfer'] = d.clamp((t - W(k, '通り抜けて') + 1.2) / 2.6) if t >= a else None
        if t < a: st['transfer'] = None
        st['hl'] = {'bflap': pulse(t, W(k, 'ふたの弁'), 1.2), 'foot': .5 * pulse(t, W(k, '開きます') + 1.4, 1.2)}
    elif k in ['pump:up', 'pump:refill', 'pump:mio2', 'pump:same']:
        cam = CAM['pumpdetail']
        if k=='pump:refill': cam=mix(CAM['pumpdetail'],CAM['foot'],(t-W(k,'底の弁が開き'))/.8)
        a = W('pump:up', '棒が上がる'); b = W('pump:up', '持ち上げます') + .3; c2 = W('pump:refill', 'ふたの下'); e2 = W('pump:refill', '底の弁が開き') - .2
        v = 1 - .5 * d.sm(d.clamp((t - a) / (b - a))) - .5 * d.sm(d.clamp((t - c2) / (e2 - c2)))
        st['v'] = v; moving = (a <= t < b) or (c2 <= t < e2); st['vdir'] = -1 if moving else 0; st['vu'] = .5
        st['bvalve'] = 0.0; st['transfer'] = 1.0
        rise = d.sm(d.clamp((t - a) / (b - a))) * .5 + d.sm(d.clamp((t - c2) / (e2 - c2))) * .5
        st['column'] = .42 + .07 * rise
        g0 = mx.geometry(M, dict(v=1.0)); bot0 = M['rod_bottom0'] + g0['rod_dz'] - .0035
        op = W('pump:refill', '底の弁が開き'); nw = W('pump:refill', '新しい水')
        st['fvalve'] = U(t, op, .5) * (1 - U(t, nw + 2.8, .6))
        fill = U(t, op + .3, 2.6)
        gb = mx.geometry(M, st); bb = M['rod_bottom0'] + gb['rod_dz'] - .0035
        st['below_top'] = bot0 + (bb - bot0) * fill
        st['vacglow'] = (.4 + .6 * pulse(t, W('pump:refill', '空いた所'), 1.6)) * (1 - fill) if t >= a + .3 else 0
        st['refill'] = d.clamp((t - op) / 2.4) if t >= op else None
        st['sump_arrows'] = 1.0 if W('pump:refill', 'まわりの水') <= t < nw + 2 else 0.0
        st['hl'] = {'bflap': pulse(t, W('pump:up', 'ふたの弁'), 1.2), 'bucket': pulse(t, W('pump:up', '上に乗った水'), 1.4), 'foot': pulse(t, op, 1.4)}
    elif k == 'pump:repeat':
        cam = CAM['pumpflowwide']
        a = W(k, 'くり返す'); per = (W(k, 'あふれ出ます') - a) / 2.0
        ph = (t - a) / per
        if t < a: st.update(v=0.0, column=.49, vdir=0)
        else:
            cycling(st, min(ph, 2.0) + .0); st['steam_fill'] = 0; st['spray'] = 0; st['steam_valve'] = 0; st['cold_valve'] = 0; st['steam_flow'] = 0; st['cold_flow'] = 0
            if ph >= 2.0: st.update(v=0.0, vdir=0)
            st['column'] = min(1.0, .49 + .255 * min(2.0, ph))
        st['spout'] = U(t, W(k, 'あふれ出ます') - .3, .4); st['trough'] = 1.0; st['tubwater'] = .3 + .5 * st['spout']
        cam=mix(CAM['pumpflowwide'],CAM['pumpexit'],(t-W(k,'あふれ出ます'))/1.2)
    elif k == 'pump:novalve':
        cam=CAM['pumpdetail']
        rm = W(k, '弁がなければ'); up1 = W(k, 'ふたが上がっても'); back = W(k, '一方にしか開かない弁'); up2 = W(k, '上へしか進めない') - .2
        st['no_bflap'] = rm <= t < back + .3
        st['column'] = .52
        if t < up1: st.update(v=1.0, vdir=0, transfer=1.0)
        elif t < up1 + 2.4:
            u = (t - up1) / 2.4; st.update(v=1 - d.sm(u), vdir=-1, vu=u, transfer=None); st['leakp'] = d.clamp(u * 1.2); st['refill'] = None
            st['column'] = .52 - .05 * d.sm(u)
        elif t < back + .6: st.update(v=0.0, vdir=0, column=.47, leakp=1.0)
        elif t < up2:
            u = d.clamp((t - back - .6) / max(.5, up2 - back - .6)); st.update(v=d.sm(u), vdir=1 if u < 1 else 0, vu=u, column=.47)
        else:
            u = d.clamp((t - up2) / 2.2); st.update(v=1 - d.sm(u), vdir=-1 if u < 1 else 0, vu=u, column=.47 + .07 * d.sm(u))
            if u >= 1: st.update(transfer=1.0, refill=1.0)
        X['nflap'] = 0.0   # 外した板は消し、扉のない穴を同じカメラで見せる。
        st['hl'] = {'bflap': pulse(t, back, 1.4)}
    # ---- 行31〜33：排水の管と、外へだけ開く弁
    elif k in ['drain:mio', 'drain:pipe', 'drain:steam', 'drain:out']:
        cam = CAM['drainopen']; st.update(v=.3, condensate=.75, inner_air=1.0, air_dots=.0)
        if k == 'drain:mio': st['hl'] = {'cyl': 0}
        if k in ['drain:pipe']:
            st['hl'] = {'drainpipe': pulse(t, W(k, 'もう一本の管'), 1.4), 'drainflap': max(pulse(t, W(k, '外へしか開かない弁'), 1.6), pulse(t, W(k, '閉じる'), 1.0))}
            st['inner_air'] = 0.0 if t >= W(k, '中が空っぽ') else 1.0
            st['drain_out_arrow'] = 1.0 if t >= W(k, '外の空気') else 0.0
            if W(k, '中が空っぽ') <= t: st['condensate'] = .75
        if k in ['drain:steam', 'drain:out']:
            o = W('drain:steam', '次に蒸気が入る'); st['steam_valve'] = U(t, o, .4); st['steam_flow'] = 1.0
            st['steam_fill'] = U(t, o + .3, 1.6); st['inner_air'] = 1.0 * (1 - U(t, W('drain:out', '一緒に押し出されます') + .8, .5))
            st['drain_out_arrow'] = 1.0 if t >= W('drain:steam', '外の空気より') else 0.0
            st['drain_in_arrow_long'] = 1.0 if t >= W('drain:steam', '少しだけ強く') else 0.0
            if k == 'drain:out':
                op = W(k, '弁を押し開けて'); st['drain'] = U(t, op, .4)
                if op <= t < W(k, '下り坂の管'): cam = CAM['drainopen']
                st['drain_flow'] = 1.0 if t >= op + .2 else 0.0; st['condensate'] = .75 * (1 - U(t, op + .3, 4.0))
                st['drain_air'] = 1.0 if t >= W(k, '残っていた空気') else 0.0; st['dtub'] = .3 + .6 * U(t, op + .5, 5)
                st['hl'] = {'drainflap': pulse(t, op, 1.2), 'drainpipe': pulse(t, W(k, '下り坂の管'), 1.4)}
                if t >= op + .4: st['drain_out_arrow'] = 0.0
    # ---- 行34・35：水槽、水槽のポンプ
    elif k == 'tank:mio':
        cam = CAM['tank']; st.update(v=.3, tank=.45, air_dots=.3)
    elif k in ['tank:self', 'tank:same']:
        t0 = S('tank:self'); a = W('tank:self', '水槽へ上げる')
        cam=CAM['jackwide']
        # 経路の全景→名前を言った小ポンプの内部→水槽への経路。
        # 同じ仕組みを確かめる次の一文では、二弁が読める寄りを保つ。
        if k=='tank:self':
            small=W(k,'小さなポンプ')
            cam=mix(CAM['jackwide'],CAM['jackinside'],(t-small)/.75)
            if t>=a: cam=mix(CAM['jackinside'],CAM['jackwide'],(t-a)/.8)
            X['_s3_jack_macro']=small+.75<=t<a
        else:
            cam=mix(CAM['jackwide'],CAM['jackinside'],(t-W(k,'しくみ'))/.75)
            X['_s3_jack_macro']=t>=W(k,'しくみ')+.75
        cycling(st, run_phase(t, t0, 4.0, .56)); st['tank'] = .45 + .25 * U(t, t0 + 2, 10); st['spout'] = 1.0
        st['hl'] = {'jackrod': pulse(t, W('tank:self', '腕につないだ'), 1.4), 'jackpipe': pulse(t, a, 1.6), 'tank': pulse(t, a + .8, 1.4)}
    # ---- 行36：くり返す。水位が下がる
    elif k == 'run:repeat':
        cam = CAM['wide']
        cycling(st, run_phase(t, S('tank:self'), 4.0, .56)); st['tank'] = .7; st['spout'] = 1.0
        st['sump'] = .8 - .2 * U(t, S(k), E(k) - S(k))
    # ---- 行37〜42：弁の開け閉め → 人形 → レバー → 弁の棒と出っぱり → 自動
    elif k == 'lever:mio':
        cam = mix(CAM['wide'], CAM['valves'], (t - S(k)) / 1.0); cycling(st, .2); st['sump'] = .6
        X['qmarks'] = True
    elif k == 'lever:hand':
        cam = list(CAM['valves']); cam[3]=.40; st['sump'] = .6
        ph = .2 + accel_phase(t, S(k) + .3, E(k)); cycling(st, ph)
        p = ph % 1.0
        # 人形：赤（x 0）にいる .97〜.40、青（x 1）にいる .45〜.92、間を走る
        if p < .40 or p >= .97: wx = 0.0
        elif p < .45: wx = d.sm((p - .40) / .05)
        elif p < .92: wx = 1.0
        else: wx = 1 - d.sm((p - .92) / .05)
        arm = 1.0 if (.38 <= p < .45 or .45 <= p < .52 or .86 <= p < .92 or .95 <= p or p < .02) else .2
        st.update(worker=True, worker_x=wx, worker_arm=arm, sweat=d.clamp((t - S(k) - 1.5) / 5))
    elif k in ['lever:one', 'lever:flip']:
        cam = CAM['valves'] if k == 'lever:one' else CAM['valves']; st['sump'] = .6
        st.update(v=0.0, steam_valve=1.0, cold_valve=0.0, air_dots=.4)
        st['worker'] = k == 'lever:one' and t < W('lever:one', 'やがて') + .1
        st['worker_x'] = 0.0
        lv_on = W('lever:one', '1本のレバー'); st['show_lever'] = t >= lv_on - .2
        lv = 0.0
        if k == 'lever:flip':
            f1 = W(k, '倒れる（1回目）'); f2 = W(k, '反対へ倒れる')
            lv = U(t, f1, .28) * (1 - U(t, f2, .28))
        st['lever'] = lv; st['steam_valve'] = 1 - lv; st['cold_valve'] = lv
        st['hl'] = {'lever': pulse(t, lv_on, 1.5), 'red': pulse(t, W('lever:one', '2つの弁の取っ手'), 1.2), 'blue': pulse(t, W('lever:one', '2つの弁の取っ手'), 1.2)}
        if k == 'lever:flip': st['hl'].update(red=pulse(t, W(k, '蒸気の弁が閉じて'), 1.0), blue=pulse(t, W(k, '冷水の弁が開きます'), 1.0))
    elif k == 'lever:tappet':
        cam = CAM['lever']; st['sump'] = .6
        c1=W(k,'レバーを下から押し'); c2=W(k,'レバーを上から押します')
        if t>=c1: cam=mix(CAM['lever'],CAM['tappet'],(t-c1)/.6)
        if t>=c2: cam=CAM['tappet']
        st['show_lever'] = True; st['show_plug'] = t >= W(k, '上下する棒') - .3
        r0 = W(k, '出っぱりを2つ') + .4; r1 = W(k, 'レバーを下から押し') + .85; d0 = W(k, 'ピストンが下まで来る') - .35; d1 = W(k, 'レバーを上から押します') + .85
        v = d.sm(d.clamp((t - r0) / (r1 - r0))) * (1 - d.sm(d.clamp((t - d0) / (d1 - d0))))
        st['v'] = v; st['vdir'] = 1 if r0 <= t < r1 else -1 if d0 <= t < d1 else 0; st['vu'] = .5
        # レバー：緑が下から押す（v .86〜1 で 0 → .4）、重りで倒れる（.18 秒）。橙が上から押す（v .14〜0 で 1 → .6）、倒れる
        if t < d0:
            push = d.clamp((v - .86) / .14) * .4; lv = push if t < r1 else (.4 + .6 * U(t, r1, .18))
        else:
            push = d.clamp((.14 - v) / .14) * .4; lv = 1 - (push if t < d1 else (.4 + .6 * U(t, d1, .18)))
        st['lever'] = lv
        st['steam_valve'] = 1 - d.clamp((lv - .4) / .6) if lv > .4 else 1.0
        st['steam_valve'] = 1 - d.sm(d.clamp((lv - .4) / .6)); st['cold_valve'] = d.sm(d.clamp((lv - .4) / .6))
        st['steam_fill'] = .7 if lv < .5 else .0; st['air_dots'] = .4
        st['hl'] = {'plug': pulse(t, W(k, '上下する棒'), 1.4), 'green': max(pulse(t, W(k, '出っぱりを2つ'), 1.2), pulse(t, W(k, '下の出っぱり'), 1.4)),
                    'orange': max(pulse(t, W(k, '出っぱりを2つ') + .5, 1.2), pulse(t, W(k, '上の出っぱり'), 1.4))}
    elif k == 'lever:fall':
        cam = mix(CAM['lever'], CAM['leverclose'], (t - S(k)) / 1.0); st['sump'] = .6
        st.update(show_lever=True, show_plug=True, v=1.0, air_dots=.3)
        p0 = W(k, '重りで') - .3; fa = W(k, 'パタンと'); fe = W(k, '反対側へ倒れて') + .5
        if t < p0: lv = 0.0
        elif t < fa: lv = .4 * d.clamp((t - p0) / (fa - p0))
        else: lv = .4 + .6 * d.sm(d.clamp((t - fa) / (fe - fa)))
        st['lever'] = lv; st['steam_valve'] = 1 - d.sm(d.clamp((lv - .4) / .6)); st['cold_valve'] = d.sm(d.clamp((lv - .4) / .6))
        # v：押す間は上（1）。いま押した出っぱり（緑）が下がって、また上がってくる（スロー）
        g1 = W(k, 'いま押した出っぱり'); g2 = W(k, '通り道に入ります')
        st['v'] = 1.0 - .5 * d.sm(d.clamp((t - g1) / 1.6)) + .5 * d.sm(d.clamp((t - g2 + .6) / 2.4))
        st['v'] = (.6 + .4 * U(t, p0 - 1.0, .8)) if t < p0 else min(1.0, st['v'])
        st['paths'] = U(t, g1 - .4, .5)
        st['hl'] = {'lever': pulse(t, fa, 1.0), 'green': max(pulse(t, g1, 1.4), pulse(t, g2, 1.6)), 'orange': pulse(t, W(k, 'もう一方の出っぱり'), 1.4)}
        X['slow'] = True
    elif k == 'lever:auto':
        cam = CAM['wide']; st['sump'] = .6 - .08 * U(t, S(k), 5)
        cycling(st, run_phase(t, S(k), 3.6, .40), lever=True); st.update(show_lever=True, show_plug=True, spout=1.0)
    # ---- 行43：地図に広がる
    elif k == 'next:spread':
        X['machine'] = False; X['map'] = True; cam = CAM['map']
    # ---- 行44〜46：毎回冷やして温め直す（筒が赤と青に）。石炭が減る
    elif k in ['next:mio2', 'next:waste', 'next:100', 'next:who']:
        cam = CAM['cylheat'] if k=='next:mio2' else CAM['coal']; st['sump'] = .5
        per = 2.0; ph = run_phase(t, S('next:mio2'), per, .40); cycling(st, ph, lever=True); st.update(show_lever=True, show_plug=True, spout=1.0)
        if t >= W('next:waste', '冷やした筒') - .2: st['cyl_color'] = 'hot' if (ph % 1.0) < .48 or (ph % 1.0) > .97 else 'cold'
        # 赤↔青の変化1回につき実際の塊を1つ減らす。連続fadeで先に消さない。
        heat0=W('next:waste','冷やした筒')-.2
        phase0=run_phase(heat0,S('next:mio2'),per,.40)
        def heat_edges(p):
            return math.floor(p-.48)+math.floor(p-.97)
        used=max(0,heat_edges(ph)-heat_edges(phase0)) if t>=heat0 else 0
        st['coal']=max(0,len(M['coalpieces'])-used)/len(M['coalpieces'])
    # ---- 行47：挑戦（排水の弁が壊れて、どちらにも開く）
    elif k in ['ch:drain', 'ch:stop', 'ch:answer']:
        cam = CAM['drainclose']; st.update(v=.3, condensate=.5, air_dots=0, sump=.45)
        st['drain_broken'] = t >= W('ch:drain', '壊れて')
        a = W('ch:drain', '開く')
        st['drain'] = .9 * math.sin((t - a) * 2.6) if t >= a else 0.0
        st['hl'] = {'drainflap': max(pulse(t, W('ch:drain', '排水の弁'), 1.4), .5 * pulse(t, W('ch:drain', '壊れて'), 1.0))}
    # ---- 行48：最初の炭鉱へ戻る。水位が下がっている。底の弁が光る
    elif k == 'last:valve':
        cycling(st, run_phase(t, S(k), 6.0, .56), lever=True); st.update(show_lever=True, show_plug=True, sump=.32, gal=.15, spout=1.0)
        a = W(k, '上へだけ進ませた'); f = W(k, '小さな弁')
        # 最後は冒頭と同じ炭鉱全体へ必ず戻す。途中の弁への寄りだけを挟む。
        f=PHRASE('last:valve','ベンデシタ')
        cam=mix(CAM['wide'],CAM['foot'],(t-f)/.65)
        if t>=E(k)-1.7: cam=mix(CAM['foot'],CAM['wide'],(t-(E(k)-1.7))/.6)
        st['_s3_pump_detail']=t>=f and t<E(k)-1.2
        st['flash_valves'] = pulse(t, f+.65, .32)
    # S3の見える断面。日本語・声・動作の時刻は不変。
    if k.startswith('pump:') and not full_face(t):
        st['_s3_pump_detail']=True
        if k=='pump:down': st['_s3_pump_arrows']='transfer'
        elif k=='pump:up': st['_s3_pump_arrows']='lift'
        elif k=='pump:refill': st['_s3_pump_arrows']='refill'
        elif k=='pump:novalve': st['_s3_pump_arrows']='leak' if st['no_bflap'] else 'lift'
        else: st['_s3_pump_arrows']='none'
        if k in ['pump:down','pump:up','pump:refill','pump:novalve']:
            pz=M['rod_bottom0']+mx.geometry(M,st)['rod_dz']
            st['_s3_pump_level_z']=pz+.023
        if k=='pump:novalve':
            # 漏れる比較では、ふたの上昇へ白線を追従させない。
            # 最大ふた高より上の実水面を維持し、弁を戻した後だけ上昇させる。
            highest=M['rod_bottom0']+mx.geometry(M,dict(v=0.0))['rod_dz']+.023
            st['_s3_pump_level_z']=highest+.05*U(t,up2,2.2)
    if k in ['tank:self','tank:same']: st['_s3_jack_detail']=True
    st['_s3_jack_macro']=bool(X.get('_s3_jack_macro',False))
    if k=='next:who':
        import desk_d1ab_shotqa_gpt_20261026 as q0
        X['_s3_primary']={'name':'温め直す筒と石炭の山','objects':s3qa._named(globals(),q0.BODY)+list(M['groups']['coal']),'minWidth':.6}
    X['_s3_key']=k
    st['_s3_whole_machine']=(tuple(cam)==tuple(CAM['wide']) or k in ['arm:chain','arm:rod'])
    return cam, st, X

# ---------------- 1コマを置く ----------------
def reset():
    for o in MANAGED: d.show(o, False)
    # 同じ値の書き戻しで全objectのdepsgraphを汚さない。姿勢の値は従来と同じ。
    for o, (p, r, s) in BASE.items():
        if o.location!=p: o.location=p
        if o.rotation_euler!=r: o.rotation_euler=r
        if o.scale!=s: o.scale=s
    for n in d.HANDS: d.HANDS[n].scale = (1, 1, 1); d.set_hand(n, (0, 0, 0), vis=False)
    P['can']['can']['crush'].value = 0
def visible(*names):
    for n in names:
        for o in G[n]:
            if not o.name.startswith('d1_can_redband'): d.show(o, True)
def small_hand(name, tip, yaw=75, pitch=-25, scale=.5):
    d.set_hand(name, tip, yaw=yaw, pitch=pitch); h = d.HANDS[name]; h.scale = (scale,) * 3
    h.location = Vector(tip) - h.rotation_euler.to_matrix() @ (d.TIP * scale)
def set_camera(cam):
    d.pose_cam(cam)
    d.CAM_D.shift_y=camera_shift(cam)
    # 内部の2枚の弁は、前後両方に焦点を合わせる。背景のぼけとは別に扱う。
    d.CAM_D.dof.aperture_fstop = (32.0 if cam[6] >= 70 and cam[3] <= .25 else
                                 11.0 if cam[3] <= .25 else 8.0 if cam[3] < .6 else 5.6)
def place_fuji(X, t):
    visible('fuji'); q = P['fuji']
    for o in G['fuji']:
        if o.parent is None: o.location = BASE[o][0] + FUJI_OFF
    for _, g in q['engines']: show_tree(_, False)
    for o in q['answers']: show_tree(o, False)
    lay = X.get('fuji_layers', 1)
    for grp, base in [(q['low'], Vector((.14, .05, 0))), (q['high'], Vector((.33, .05, .15)))]:
        # 前編と同じ .80 倍の柱を斜めから見て、模型の裏への遮蔽を避ける。
        # 層の段数・粒数と、ふもと/頂上の高さは変えない。
        for o in [grp['ground']] + grp['layers'] + sum(grp['particles'], []) + sum(grp['edges'], []):
            o.location = base + FUJI_OFF + (BASE[o][0] - base) / .44 * .80
            o.scale = BASE[o][2] / .44 * .80
        for o in grp['layers'] + sum(grp['particles'], []) + sum(grp['edges'], []): d.show(o, lay > 0)
        # 同じ体積中の粒の数を比べる。数・位置は正本どおりで、
        # 色と直径だけを読みやすくして、細かい白点の見落としを防ぐ。
        particle_mat = d.mat('d1b_gpt_fuji_readable_particles', '#236d9c', .50)
        for o in sum(grp['particles'], []):
            o.scale *= 2.8
            if not o.data.materials or o.data.materials[0] != particle_mat:
                o.data.materials.clear(); o.data.materials.append(particle_mat)
    spots = [Vector((.14, -.025, .01)) + FUJI_OFF, Vector((.33, .015, .16)) + FUJI_OFF]
    for (root, objs, top), p, arw in zip(FUJI_MINI, spots, FUJI_ARROWS):
        root.location = p; show_tree(root, True)
        pt = p + Vector((0, 0, .214 * .42)); arw.location = pt + Vector((0, -.012, .006)); show_tree(arw, X.get('fuji_arrows', 0) > .02)
def apply_state(t):
    reset(); cam, st, X = scene(t)
    if st['show_lever']: st['hl'] = dict(st['hl']); st['hl']['lever'] = max(.22, st['hl'].get('lever', 0))
    if X['machine']:
        mx.apply_machine(M, st, t)
        if cue_at(t)['key'] == 'run:steam':
            # 押す矢印は筒の手前へ出し、円板や水面で比較が隠れないようにする。
            for name in ('air_down', 'steam_up'):
                M[name].location.y -= mx.L['CR'] + .006
        if X.get('nflap', 0) > 0:
            # 外した弁の板：ふたの上で、横に持ち上げて見せる（弁がない状態）
            pl = M['bflap_plate']; d.show(pl, True); d.show(M['bflap'], True)
            M['bflap'].rotation_euler = (0, 0, 0)
            M['bflap'].location = M['base'][M['bflap']][0] + Vector((.042 * X['nflap'], -.03 * X['nflap'], .012 * X['nflap']))
        else:
            M['bflap'].location = M['base'][M['bflap']][0]
    else:
        for o in M['all']: d.show(o, False)
    if X.get('tired'):
        for o in TIRED_OBJS: d.show(o, True)
    if 'can' in X['groups']:
        visible('can', 'straw'); q = P['can']; c = q['can']
        for o in G['can']:
            if o.name.startswith(('d1_stove', 'd1_flame_ring', 'd1_tong')): d.show(o, False)
        c['crush'].value = 1.0; c['root'].location = (.265, -.12, .047)
        for o in c['rim']: o.scale.x = .8; o.scale.y = .85
        for o in q['mist']: d.show(o, False)
        r = X['can_arrows']; center = Vector((.265, -.12, .048))
        for o in q['arrows']: o.scale = (max(.01, r),) * 3; o.location = center * (1 - r); show_tree(o, r > .01)
        show_tree(q['tongs'], False)
        s_ = P['straw']; v = X['straw_push']
        for i, o in enumerate(s_['bubbles']): d.show(o, False)
        s_['juice'].dimensions.z = .01 + .10 * max(v, .6); s_['juice'].location.z = .02 + s_['juice'].dimensions.z / 2
        for o in s_['arrows']: show_tree(o, v > .02)
    if X.get('fuji'): pass  # new episode extras place the mountain/columns/minis
    if X.get('board'): visible('score')
    if X.get('map'):
        visible('map'); a = W('next:spread', '数十年')
        for i, o in enumerate(P['map']['stamps']): show_tree(o, t >= a + .14 * i)
    d.dg['make'].data.body = '1'; d.dg['brk'].data.body = '2' if t >= W('next:spread', 'くみ出せる（得点板 水 1−2 人・カイ得意顔）') else '1' if t >= W('run:repeat', 'くり返し（得点板 水 1−1 人）') else '0'
    for who, tip, yaw, pitch, sc in X['hands']: small_hand(who, tip, yaw, pitch, sc)
    mx.apply_episode_extras(S3_EXTRAS,M,P,G,X,st,t)
    set_camera(cam)
    return cam, st, X

def apply(t):
    global _VIS
    _VIS = {}
    try: r = apply_state(t)
    finally:
        pend = _VIS; _VIS = None
        for o, v in pend.items(): show_now(o, v)
        bpy.context.view_layer.update()
    return r

def pose_at(t): return scene(t)[0]

# ---------------- 書き出しの計画 ----------------
def full_face(t):
    c = cue_at(t); f = c.get('face')
    if not f or f.get('small'): return False
    if f.get('at'): a = W(c['key'], {'ココカラ': 'ここから（腕まくり顔）'}.get(f['at'], f['at']))
    else: a = c['start'] + (f.get('a', 0)) * (c['end'] - c['start'])
    return a + .25 <= t <= c['end'] - .15
STATIC_KEYS = {'recap:can', 'recap:straw', 'quiz:ask', 'quiz:weak', 'quiz:fuji', 'score:still'}
def rate(t):
    # S3: visible machinery is rendered at true30fps; only opaque full-screen faces reuse hidden backgrounds.
    return 0 if full_face(t) else 1
ENTRY_MOVES = {c['key']: pose_at(c['start'] + .02) != pose_at(c['start'] + 1.25) for c in CUES}
STATIC_EVENTS = []
for c in CUES:
    STATIC_EVENTS.append(c['start'])
    if c['key'] in STATIC_KEYS:
        for w in c['wordEvents']: STATIC_EVENTS.append(w['time'])
STATIC_EVENTS = sorted(set(STATIC_EVENTS))
def plan(j):
    t = j / FPS; r = rate(t)
    if r == 1: return ('render', None)
    if r == 2:
        k = j - (j % 2)
        return ('render', None) if (k == j or rate(k / FPS) != 2 or
                                   cue_at(k / FPS)['key'] != cue_at(t)['key']) else ('dup', k)
    # 止まった画：直前の変わり目（とその後 .7 秒は描く）
    a = max([0] + [x for x in STATIC_EVENTS if x <= t + 1e-9])
    if t < a + .5 and not full_face(t): return ('render', None)
    if full_face(t):
        c = cue_at(t); jj = int(math.ceil((c['start'] + .3) * FPS))
        while jj < j and not full_face(jj / FPS): jj += 1
        return ('render', None) if jj >= j else ('dup', jj)
    k = int(math.ceil((a + .5) * FPS)); return ('render', None) if k >= j else ('dup', k)

def anchor_world(st):
    a=mx.anchors(M,st); a.update(mx.extra_anchors(S3_EXTRAS,M,st))
    a['britain']=Vector((.10,.368,.20))
    return a
ANC_NAMES=list(anchor_world(base_state()).keys())
def anchors_now(t,st):
    a=anchor_world(st)
    return {n:d.project(a[n]) for n in ANC_NAMES}
import desk_d1b_s3_qa_20261026 as s3qa
PRIMARY={}
def measure_primary(t,st,X):
    box=s3qa.primary(globals(),t,st,X)
    j=str(round(t*FPS))
    if box is not None: PRIMARY[j]=box
    else: PRIMARY.pop(j,None)
    return box

_LIBC = ctypes.CDLL('/usr/lib/libSystem.B.dylib')
def clone(src, dst):
    if os.path.lexists(dst): os.remove(dst)
    if _LIBC.clonefile(src.encode(), dst.encode(), 0) != 0: shutil.copy2(src, dst)

def render_key():
    src = b''.join(open(f, 'rb').read() for f in [os.path.abspath(__file__), mx.__file__, ext.__file__, s3qa.__file__])
    return hashlib.sha256(src + json.dumps(DATA, sort_keys=True).encode()).hexdigest()[:20]

# This records the files corresponding to this actual GUI build, rather than
# silently accepting on-disk source changes while old functions remain loaded.
S3_BUILT_SOURCE_KEY = render_key()

def _s3_paths(out=None):
    cache = os.path.realpath(A.cache)
    name = os.path.basename(cache)
    assert os.path.dirname(cache) == '/private/tmp/ys' and (
        name == 'ys-chain-d1b_s3_gpt_20261026' or name.startswith('ys-chain-d1b_s3_gpt_20261026_')
    ), 'S3 must use its own new cache; old B/S2/other episode caches are forbidden'
    if out is not None:
        dest = os.path.realpath(out)
        assert os.path.commonpath([cache, dest]) == cache, 'S3 output must stay inside its new cache'
    return cache

def _s3_approval(key):
    assert render_key() == key, 'Source changed after this render key was chosen'
    assert S3_BUILT_SOURCE_KEY == key, 'GUI scene/source changed; rebuild or explicitly refresh all behaviour before rendering'
    p = A.cache + '/S2_SELF_REVIEW_APPROVED.json'
    assert os.path.isfile(p), 'S2 correction review must finish before S3 production'
    value = json.load(open(p))
    assert isinstance(value, dict) and value.get('approved') is True, 'S2 approval must explicitly contain approved:true'
    assert value.get('episode') == 'd1b' and value.get('sourceKey') == key, 'S2 approval is for a different episode/source key'
    return value

def _s3_atomic_json(filename, value):
    temporary = filename + '.writing-' + str(os.getpid())
    with open(temporary, 'w') as f:
        json.dump(value, f, ensure_ascii=False)
        f.flush()
        os.fsync(f.fileno())
    os.replace(temporary, filename)

def _s3_primary_record_valid(j):
    rec = globals().get('S3_PRIMARY_METADATA', {}).get(str(j))
    if not isinstance(rec, dict) or rec.get('frame') != j or abs(rec.get('time', -1) - j / FPS) > 1e-7:
        return False
    if rec.get('logicalResolution') != [1080, 1920]: return False
    if full_face(j / FPS):
        return rec.get('excludedFullFace') is True and str(j) not in PRIMARY
    box = PRIMARY.get(str(j))
    return bool(rec.get('measured') is True and rec.get('rawBoundsLogical') and box
                and box[:4] == rec['rawBoundsLogical'] and box[4] == rec.get('name')
                and all(math.isfinite(v) for v in box[:4]))

def _s3_load_primary_state(filename, key):
    PRIMARY.clear()
    globals()['S3_PRIMARY_METADATA'] = {}
    globals()['S3_PRIMARY_SELECTIONS'] = []
    globals()['S3_PRIMARY_WARNINGS'] = []
    globals()['_S3_PRIMARY_VERTEX_CACHE'] = {}
    if not os.path.isfile(filename): return
    state = json.load(open(filename))
    assert state.get('sourceKey') == key and state.get('episode') == 'd1b', 'Partial primary state is stale'
    assert state.get('frames') == NF and state.get('fps') == FPS, 'Partial primary frame layout changed'
    PRIMARY.update(state.get('boxes', {}))
    meta = state.get('metadata', {})
    assert meta.get('logicalResolution') == [1080, 1920], 'Partial primary coordinates changed'
    globals()['S3_PRIMARY_METADATA'] = meta.get('frames', {})
    globals()['S3_PRIMARY_SELECTIONS'] = [tuple(a) for a in meta.get('selections', [])]
    globals()['S3_PRIMARY_WARNINGS'] = meta.get('warnings', [])

def _s3_checkpoint(out, key, done, anc):
    _s3_atomic_json(os.path.join(out, 'anchors-partial.json'), anc)
    _s3_atomic_json(os.path.join(out, 'primary-state-partial.json'), {
        'episode': 'd1b', 'sourceKey': key, 'frames': NF, 'fps': FPS,
        'boxes': PRIMARY, 'metadata': s3qa.metadata(globals())})
    _s3_atomic_json(os.path.join(out, 'meta.json'), {
        'key': key, 'frames': NF, 'fps': FPS, 'done': sorted(done),
        'sourceChangedOnDisk': render_key() != key, 'stage': 'S3',
        'finished': False})

def _s3_complete_primary():
    """Resume old same-key images by measuring missing metadata, not rerendering.

    Full-screen faces are deliberately excluded. An actual 2D SVG primary is
    deferred to the compositor, not replaced by a synthetic plane or bbox.
    """
    for j in range(NF):
        if j % 40 == 0 and os.path.isfile(A.cache + '/STOP_S3'):
            raise InterruptedError('STOP_S3 during primary recovery')
        if _s3_primary_record_valid(j): continue
        t = j / FPS
        if full_face(t):
            measure_primary(t, None, {})
        else:
            cam, st, X = apply(t)
            measure_primary(t, st, X)
    meta = s3qa.metadata(globals())
    counts = {'measuredGeometry': 0, 'fullFaceExcluded': 0,
              'pendingActualSvg': 0, 'missingOrInvalid': 0}
    missing = []
    for j in range(NF):
        rec = meta.get('frames', {}).get(str(j), {})
        if full_face(j/FPS) and _s3_primary_record_valid(j): counts['fullFaceExcluded'] += 1
        elif _s3_primary_record_valid(j): counts['measuredGeometry'] += 1
        elif rec.get('selectionSource') == 'actual-SVG-required': counts['pendingActualSvg'] += 1
        else:
            counts['missingOrInvalid'] += 1
            missing.append(j)
    return dict(counts, missingFrames=missing,
                finalPrimaryReady=counts['missingOrInvalid'] == 0 and counts['pendingActualSvg'] == 0,
                note='This is coverage, not size/occlusion/readability approval. Actual SVG bounds must be merged before require-primary checks.')

def main():
    _s3_paths()
    bpy.context.window.scene = d.SC
    if A.shot_plan:
        import desk_d1ab_shotqa_gpt_20261026 as shotqa
        shotqa.run(globals())
        return
    plans = [plan(j) for j in range(NF)]
    nr = sum(p[0] == 'render' for p in plans)
    print('[d1b] コマ %d：描く %d、同じコマ %d' % (NF, nr, NF - nr), flush=True)
    if A.dry:
        t = 0.0; n = 0
        while t < DATA['duration']: apply(t); t += .2; n += 1
        print('[d1b] dry ok', n, flush=True); return
    if A.plan_only:
        segs = {}
        for j, p in enumerate(plans):
            if p[0] == 'render': segs.setdefault(cue_at(j / FPS)['key'], 0); segs[cue_at(j / FPS)['key']] += 1
        print(json.dumps(segs, ensure_ascii=False)); return
    if A.times:
        out = A.out or A.cache + '/blender/preview'
        _s3_paths(out)
        os.makedirs(out, exist_ok=True)
        preview_key = render_key()
        assert S3_BUILT_SOURCE_KEY == preview_key, 'Rebuild stale GUI scene before new preview'
        preview_meta = out + '/preview-meta.json'
        if os.path.isfile(preview_meta):
            assert json.load(open(preview_meta)).get('sourceKey') == preview_key, 'Changed source requires a new preview directory'
        elif any(name.endswith('.jpg') for name in os.listdir(out)):
            raise AssertionError('Unversioned existing preview JPGs: use a fresh directory')
        anchor_file = out + '/anchors-partial.json'
        anc = json.load(open(anchor_file)) if os.path.exists(anchor_file) else {}
        for x in [float(v) for v in A.times.split(',')]:
            f = os.path.join(out, '%05d.jpg' % round(x * FPS))
            cam, st, X = apply(x); measure_primary(x,st,X)
            anc[str(round(x * FPS))] = anchors_now(x, st)
            if not os.path.exists(f) or A.force:
                d.SC.render.filepath = f; bpy.ops.render.render(write_still=True, scene=d.SC.name)
            print('[d1b] %.2f' % x, flush=True)
        json.dump(anc, open(anchor_file, 'w'))
        arr = {n: [[0, 0, 0] for _ in range(NF)] for n in ANC_NAMES}
        for j, points in anc.items():
            for n in ANC_NAMES: arr[n][int(j)] = points[n]
        json.dump({'fps': FPS, 'frames': NF, 'previewOnly': True, 'anchors': arr}, open(out + '/anchors.json', 'w'))
        json.dump(PRIMARY,open(out+'/primary.json','w'),ensure_ascii=False)
        json.dump(s3qa.metadata(globals()),open(out+'/primary-metadata.json','w'),ensure_ascii=False)
        _s3_atomic_json(preview_meta, {'episode':'d1b', 'sourceKey':preview_key, 'frames':NF, 'fps':FPS, 'previewOnly':True})
        return
    out = A.out or A.cache + '/blender/desk'
    _s3_paths(out)
    os.makedirs(out, exist_ok=True)
    key = render_key(); metaf = os.path.join(out, 'meta.json')
    _s3_approval(key)
    old = json.load(open(metaf)) if os.path.exists(metaf) else {}
    if old:
        assert old.get('key') == key, 'Source key mismatch: --force cannot mix revisions; use a fresh output directory'
        assert old.get('frames') == NF and old.get('fps') == FPS, 'Existing frame layout differs'
    elif any(name.endswith('.jpg') for name in os.listdir(out)):
        raise AssertionError('Unversioned existing JPGs: use a fresh production directory')
    # Same-key resume only. --force may redraw a range, never admit old-source frames.
    done = set(old.get('done', []))
    assert all(isinstance(j,int) and 0 <= j < NF for j in done), 'Invalid saved done frame list'
    ancf = os.path.join(out, 'anchors-partial.json')
    anc = json.load(open(ancf)) if os.path.exists(ancf) else {}
    _s3_load_primary_state(os.path.join(out, 'primary-state-partial.json'), key)
    if A.force: done -= {j for j in done if A.start <= j / FPS < A.stop}
    idx = [j for j, p in enumerate(plans) if p[0] == 'render' and A.start <= j / FPS < A.stop]
    t0 = time.time(); n = 0; recovered = 0
    for j in idx:
        if os.path.isfile(A.cache + '/STOP_S3'):
            _s3_checkpoint(out, key, done, anc)
            print('[d1b] 中断指示を受け、描いたコマを保持して停止', flush=True)
            return
        f = os.path.join(out, '%05d.jpg' % j)
        if j in done and os.path.exists(f) and str(j) in anc:
            if _s3_primary_record_valid(j): continue
            # Keep the rendered JPEG byte-for-byte; repair only missing actual
            # measurements after same-key scene evaluation.
            cam, st, X = apply(j / FPS); measure_primary(j/FPS,st,X); recovered += 1
            if recovered % 40 == 0: _s3_checkpoint(out, key, done, anc)
            continue
        cam, st, X = apply(j / FPS); anc[str(j)] = anchors_now(j / FPS, st); measure_primary(j/FPS,st,X)
        d.SC.render.filepath = f; bpy.ops.render.render(write_still=True, scene=d.SC.name); n += 1; done.add(j)
        if n % 40 == 0:
            el = time.time() - t0; rest = sum(1 for x in idx if x not in done)
            print('[d1b] %d コマ %.0f 秒（1コマ %.2f 秒、この区間の残り %d）' % (n, el, el / n, rest), flush=True)
            _s3_checkpoint(out, key, done, anc)
            assert render_key() == key, 'Source changed on disk; checkpoint saved, rebuild with a fresh output directory'
    _s3_checkpoint(out, key, done, anc)
    print('[d1b] 書いた %d コマ %.1f 秒' % (n, time.time() - t0), flush=True)
    if recovered: print('[d1b] 既存JPEGを保持し主役実測だけ復元 %d コマ' % recovered, flush=True)
    if A.finish: finish(plans, out, key, done, anc)

def finish(plans, out, key, done, anc):
    """全部を描き終えた後：同じコマを写し、anchors.json と camera-motion.json を書く"""
    _s3_paths(out)
    _s3_approval(key)
    need = [j for j, p in enumerate(plans) if p[0] == 'render']
    missing = [j for j in need if j not in done or not os.path.exists(os.path.join(out, '%05d.jpg' % j))]
    assert not missing, ('描いていないコマ', len(missing), missing[:5])
    assert all(str(j) in anc for j in need), 'Rendered frames have missing anchor records'
    try:
        coverage = _s3_complete_primary()
    except InterruptedError:
        _s3_checkpoint(out, key, done, anc)
        print('[d1b] 主役実測の復元中に停止。JPEGと実測途中を保持', flush=True)
        return
    _s3_checkpoint(out, key, done, anc)
    _s3_approval(key)
    arr = {nm: [] for nm in ANC_NAMES}
    for j, p in enumerate(plans):
        if j % 40 == 0 and os.path.isfile(A.cache + '/STOP_S3'):
            _s3_checkpoint(out, key, done, anc)
            print('[d1b] 仕上げ中に停止。JPEGと実測途中を保持', flush=True)
            return
        src = j if p[0] == 'render' else p[1]
        if p[0] == 'dup': clone(os.path.join(out, '%05d.jpg' % src), os.path.join(out, '%05d.jpg' % j))
        for nm in ANC_NAMES: arr[nm].append(anc[str(src)][nm])
    json.dump({'fps': FPS, 'frames': NF, 'key': key, 'anchors': arr}, open(os.path.join(out, 'anchors.json'), 'w'))
    json.dump({'key': key, 'frames': NF, 'fps': FPS, 'done': sorted(done), 'stage':'S3',
               'finished': time.strftime('%Y-%m-%d %H:%M:%S'),
               'primaryCoverage':coverage, 'visualReviewApproved':False}, open(os.path.join(out, 'meta.json'), 'w'))
    poses = [tuple(round(x, 9) for x in pose_at(j / FPS)) for j in range(NF)]; mv = [False] + [poses[j] != poses[j - 1] for j in range(1, NF)]
    spans = []; s0 = None
    for j, f in enumerate(mv + [False]):
        if f and s0 is None: s0 = j / FPS
        if not f and s0 is not None: spans.append([s0, j / FPS]); s0 = None
    json.dump({'frames': NF, 'moving_frames': sum(mv), 'moving_ratio': sum(mv) / NF, 'moving_spans': spans, 'top_ratio': sum(p[5] >= 65 for p in poses) / NF}, open(A.cache + '/blender/camera-motion.json', 'w'), indent=1)
    json.dump(PRIMARY,open(A.cache+'/blender/primary.json','w'),ensure_ascii=False)
    metadata=s3qa.metadata(globals()); metadata.update(sourceKey=key, coverage=coverage)
    json.dump(metadata,open(A.cache+'/blender/primary-metadata.json','w'),ensure_ascii=False)
    print('[d1b] 仕上げ：コマ %d、カメラが動く割合 %.3f' % (NF, sum(mv) / NF), flush=True)

# ---------------- 部品のカタログと、問題編の画 ----------------
def catalog():
    bpy.context.window.scene = d.SC
    out = A.out or A.cache + '/blender/catalog-d1b'; os.makedirs(out, exist_ok=True)
    st = base_state(); st.update(v=.55, steam_valve=1, steam_fill=.7, steam_flow=1, cold_valve=0, column=.7, air_dots=.5, show_lever=True, show_plug=True, spout=1)
    specs = [('layout', dict(), (-.19, .10, .30), .40, None),
             ('mine_and_pump', dict(), (-.40, .10, .17), .17, None),
             ('boiler', dict(boil=1, kettle_steam=1), (-.10, .10, .40), .07, None),
             ('steam_valve_and_tap', dict(tap_show=True, tap=1), (-.15, .07, .45), .08, None),
             ('cylinder_piston', dict(v=.3, film=1), (-.10, .10, .55), .07, None),
             ('beam_chain_rod', dict(), (-.25, .10, .58), .20, None),
             ('bottom_pump', dict(v=.5, vdir=1, vu=.5, door_show=True, door=.8), (-.37, .03, .07), .07, None),
             ('drain_valve', dict(drain=.8, drain_flow=1), (-.03, .07, .43), .07, None),
             ('tank_and_cold_valve', dict(cold_valve=1, cold_flow=1, spray=1), (.0, .11, .56), .10, None),
             ('jack_pump', dict(jack_flow=1, vdir=-1, vu=.5), (-.315, .10, .39), .04, None),
             ('lever_and_tappets', dict(paths=1, lever=1), (-.095, .05, .57), .07, None),
             ('worker', dict(worker=True, worker_arm=1, sweat=1), (-.03, .05, .47), .09, None)]
    for name, upd, center, span, _ in specs:
        reset(); s2 = dict(st); s2.update(upd); mx.apply_machine(M, s2, 1.3)
        for top in [False, True]:
            f = out + '/d1m_' + name + ('_top.jpg' if top else '_oblique.jpg')
            if os.path.exists(f) and not A.force: continue
            d.catalog_camera(center, top, span); d.CAM_D.dof.aperture_fstop = 11
            bpy.context.view_layer.update(); d.SC.render.filepath = f; bpy.ops.render.render(write_still=True, scene=d.SC.name)

def challenge_setup():
    """声の時刻に依存しない、排水弁が内外どちらへも開く挑戦の状態。"""
    reset(); st = base_state(); st.update(v=.3, condensate=.4, drain=-.7, drain_broken=True, air_dots=.0, sump=.45, hl={'drainflap': .8})
    mx.apply_machine(M, st, 2.0); set_camera(CAM['drainclose']); bpy.context.view_layer.update()
    return st

def answer_state():
    """壊れた弁から外気が入り、ピストン上下面の押し合いが釣り合う状態。"""
    reset(); st = base_state(); st.update(v=1.0, condensate=.6, drain=-.9, drain_broken=True, inner_air=1.0, air_dots=.6, air_arrow=1, steam_arrow=1, drain_air=1, cold_valve=1, spray=.3, sump=.45)
    mx.apply_machine(M, st, 2.0)
    # 入ってくる空気の粒：管の口から筒の中へ（逆向き）
    a = Vector(mx.L['DRAIN0']); b = Vector(mx.L['DRAIN1'])
    for i, o in enumerate(M['dair']): o.location = b.lerp(a, (i + .5) / len(M['dair'])) + Vector((0, -.002, .003)); d.show(o, True)
    set_camera([-.05, .07, .49, .32, -6, 12, 40]); bpy.context.view_layer.update()
    return st

def problem():
    bpy.context.window.scene = d.SC
    out = A.out or A.cache + '/problem'; os.makedirs(out, exist_ok=True)
    fmt = d.SC.render.image_settings.file_format; d.SC.render.image_settings.file_format = 'PNG'
    for filename, fn in [('挑戦.png', challenge_setup), ('答え.png', answer_state)]:
        fn(); d.SC.render.filepath = out + '/' + filename
        bpy.ops.render.render(write_still=True, scene=d.SC.name)
    d.SC.render.image_settings.file_format = fmt

if __name__ == '__main__':
    if A.catalog: catalog()
    elif A.problem: problem()
    else: main()

