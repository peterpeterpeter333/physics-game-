# 技術の疑問の鎖 1-1 第5版（ys-chain-1-1v5）「女王を処刑台に送った手紙」の「机の上」の場面。
# 第4版の desk_1_1v4.py（変えていない）の写し。舞台・物・手・タイル・手紙・たる・得点板・円板・表・巻物・本・塔・ろうそく・挑戦は第4版と同じ見た目のまま、
# 第5版で新しく要る物を足した：置き時計、円板の上を1目盛りずつ進む指、表の前で裏返る CAT→EQJ、行き先の線（26・25・24…本）、
# 枝分かれの木の模型、小さな人形6体と名札・吹き出し、E 3枚 → X、白と橙の塔の列、サイコロ、541文字の暗号文の紙（JVX が光る）。
# カメラ（第5版の約束）：説明の間は止める。動かすのは、場面の切り替わり・見せる瞬間・笑いの所だけ。
#   cam_keys() は「止める（hold）」「動く（move）」「切る（cut）」の並び。動いている時間の割合を数えて <cache>/blender/camera-motion.json に書く。
# 動画の全部のコマ（30fps、1080×1920）を、声の時刻に合わせて書き出す（字幕・顔・札は 2D で重ねる：scripts/umech/desk-frame.mjs・desk-1-1v5-overlay.mjs）。
#
# 使い方（音声・phrase-times（chain-dlg-phrase-times-1-1v5.py）・data.json（desk-1-1v5-data.mjs）を作った後）：
#   B=/Applications/Blender.app/Contents/MacOS/Blender
#   $B -b --factory-startup -P scripts/blender/desk_1_1v5.py -- --cache /private/tmp/ys/ys-chain-1-1v5 [--every N] [--scale 0.5] [--from 秒 --to 秒] [--out dir] [--times 1.0,2.5]
#   既定の出力：<cache>/blender/desk/00000.jpg …（コマ番号＝round(t×30)）と <cache>/blender/desk/anchors.json
# 時刻：<cache>/ys-chain-1-1v5.json と <cache>/phrase-times.json から、cue の鍵と言葉で決める。
# 数：<cache>/blender/data.json（desk-1-1v5-data.mjs が計算し assert で確かめたもの）。ここでも主な数を assert する。
# 色の意味（シリーズで固定）：平文＝白、暗号文＝橙、鍵＝青。カイ＝青、ミオ＝桃色。
import bpy, bmesh, json, math, os, sys, time, re, hashlib
from mathutils import Vector, Matrix, Euler
from bpy_extras.object_utils import world_to_camera_view

# ---------------- 引数 ----------------
def args():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    o = {'cache': None, 'every': 1, 'scale': 1.0, 'from': None, 'to': None, 'out': None, 'times': None, 'samples': 16, 'force': False}
    i = 0
    while i < len(a):
        k = a[i]
        if k == '--force': o['force'] = True; i += 1; continue
        if k == '--no-anchors': o['noanc'] = True; i += 1; continue   # 一部だけ書き直す時（アンカーは前の本番のものを使う）
        v = a[i + 1]; i += 2
        if k == '--cache': o['cache'] = v
        elif k == '--every': o['every'] = int(v)
        elif k == '--scale': o['scale'] = float(v)
        elif k == '--from': o['from'] = float(v)
        elif k == '--to': o['to'] = float(v)
        elif k == '--out': o['out'] = v
        elif k == '--times': o['times'] = [float(x) for x in v.split(',')]
        elif k == '--samples': o['samples'] = int(v)
        else: raise SystemExit('unknown arg ' + k)
    if not o['cache']: raise SystemExit('--cache が要る')
    return o
A = args()
CID = 'ys-chain-1-1v5'
CACHE = A['cache']
FPS = 30
W, H = 1080, 1920
DATA = json.load(open(os.path.join(CACHE, 'blender', 'data.json')))
TEX = os.path.join(CACHE, 'blender', 'tex')

# ---------------- 時刻（cue と声） ----------------
CLIP = json.load(open(os.path.join(CACHE, CID + '.json')))
PT = json.load(open(os.path.join(CACHE, 'phrase-times.json')))
CUE = {}
for s in CLIP['scenes']:
    for q, cap, u in zip(s['cues'], s['captions'], s['utterances']):
        key = q['diagram'].split('-', 1)[1]
        pause = float(u.get('pause') or 0)
        CUE[key] = {'s': cap['start'], 'e': cap['end'], 've': cap['end'] - .12 - pause, 'sub': q['subtitle'], 'kana': q.get('kana')}
DUR = CLIP['duration']; NF = int(math.ceil(DUR * FPS))
VOW = {'ア': 'アカサタナハマヤラワガザダバパャァ', 'イ': 'イキシチニヒミリギジヂビピィ', 'ウ': 'ウクスツヌフムユルグズヅブプュゥヴ', 'エ': 'エケセテネヘメレゲゼデベペェ', 'オ': 'オコソトノホモヨロヲゴゾドボポョォ'}
def vowel_of(c):
    for v, s in VOW.items():
        if c in s: return v
    return 'ウ'
def norm(s):
    s = ''.join(chr(ord(c) + 0x60) if 0x3041 <= ord(c) <= 0x3096 else c for c in s)
    s = re.sub(r"['_\s]", '', s).replace('ヲ', 'オ').replace('ハ', 'ワ').replace('ヘ', 'エ').replace('ヅ', 'ズ').replace('ヂ', 'ジ')
    o = ''
    for c in s:
        d = vowel_of(o[-1] if o else 'ア') if c == 'ー' else c
        if d == 'ウ' and o and vowel_of(o[-1]) == 'オ': d = 'オ'
        o += d
    return o
def _find(key, needle, start=0):
    m = PT[CUE[key]['sub']]; n = norm(needle)
    pat = re.compile(re.sub('[ウオ]', '[ウオ]', n))
    r = pat.search(m['s'], start)
    if not r: raise SystemExit('声に無い「%s」：%s / %s' % (needle, CUE[key]['sub'], m['s']))
    return r
def T(key, needle=None, occ=0, end=False):
    """cue の始まり（needle なし）、または声が needle を言い始める（end=True：言い終わる）時刻（秒、動画の頭から）"""
    c = CUE[key]
    if needle is None: return c['s']
    m = PT[c['sub']]; pos = 0
    for k in range(occ + 1):
        r = _find(key, needle, pos); pos = r.start() + 1
    j = r.end() if end else r.start()
    return c['s'] + (m['t'][j] if j < len(m['t']) else m['end'])
def TSEQ(key, needles):
    """needles を順に（前の言葉の後ろから）探した時刻の列"""
    c = CUE[key]; m = PT[c['sub']]; pos = 0; out = []
    for nd in needles:
        r = _find(key, nd, pos); out.append(c['s'] + m['t'][r.start()]); pos = r.end()
    return out
S = lambda k: CUE[k]['s']; E = lambda k: CUE[k]['e']; VE = lambda k: CUE[k]['ve']

# ---------------- 数の確かめ ----------------
ABC = DATA['abc']; SUB = DATA['sub']
def caesar(s, k): return ''.join(ABC[(ABC.index(c) + k) % 26] if c in ABC else c for c in s)
assert caesar('CAT', 3) == 'FDW' and DATA['caesar']['back'] == ['ECV', 'DBU', 'CAT']
assert sum(DATA['tower']) == 541 and max(DATA['tower']) == 70 and DATA['tower'][ABC.index('X')] == 70 and DATA['tower'][ABC.index('J')] == 60
assert SUB[ABC.index('E')] == 'X' and SUB[ABC.index('T')] == 'J' and SUB[ABC.index('H')] == 'V'
assert DATA['challenge'] == 'MYEXD DRO VODDOBC' and caesar(DATA['challenge'], -10) == 'COUNT THE LETTERS'
assert math.prod(int(x) for x in DATA['fact']) == 403291461126605635584000000
assert abs(403291461126605635584000000 / 1e12 / (365.25 * 24 * 3600) / 1.28e7 - 1) < .01
assert sum(DATA['gtower']) == 541 and max(DATA['gtower']) == 70
# 第5版の数
assert caesar('A', 3) == 'D' and caesar('B', 3) == 'E' and caesar('Z', 3) == 'C' and caesar('A', 29) == 'D'
assert ''.join(SUB[ABC.index(c)] for c in 'CAT') == 'EQJ' == DATA['catSub']
assert DATA['choices'][:3] == [26, 25, 24] and DATA['choices'][-1] == 1 and math.prod(DATA['choices']) == 403291461126605635584000000
assert DATA['dollNick'] == [SUB[ABC.index(c)] for c in DATA['dolls']] and DATA['dollNick'][4] == 'X'
assert all(DATA['tower'][ABC.index(SUB[i])] == DATA['plainCnt'][i] for i in range(26))
assert DATA['plainCnt'][ABC.index('E')] == 70 and DATA['plainCnt'][ABC.index('T')] == 60
assert round(DATA['enPct'][ABC.index('E')]) == 13 and round(DATA['enPct'][ABC.index('T')]) == 9
assert DATA['jvxN'] == 14 and len(DATA['jvxPos']) == 14
assert sum(1 for w in re.split('[^A-Z]+', DATA['cipherLetters'] and ' '.join(DATA['sheetLines'])) if w == 'JVX') == 14

# ---------------- 小さな道具 ----------------
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def sm(u): u = clamp(u); return u * u * (3 - 2 * u)
def seg(t, a, b): return sm((t - a) / max(1e-9, b - a))
def lin(t, a, b): return clamp((t - a) / max(1e-9, b - a))
def lerp(a, b, u): return a + (b - a) * u
def vlerp(a, b, u): return Vector(a).lerp(Vector(b), u)
def back(u):  # 少し行き過ぎて戻る
    u = clamp(u); c = 1.70158; return 1 + (c + 1) * (u - 1) ** 3 + c * (u - 1) ** 2
def hop(u, h): return 4 * h * u * (1 - u)
def lin_rgb(c):
    c = c / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
def rgb(h, a=1.0):
    h = h.lstrip('#'); return (lin_rgb(int(h[0:2], 16)), lin_rgb(int(h[2:4], 16)), lin_rgb(int(h[4:6], 16)), a)

def link(o):
    bpy.context.scene.collection.objects.link(o); return o
def principled(m): return next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
MATS = {}
def mat(name, color, rough=.5, metal=0.0, emit=None, strength=0.0, alpha=1.0, unique=False):
    if not unique and name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; p = principled(m)
    p.inputs['Base Color'].default_value = rgb(color); p.inputs['Roughness'].default_value = rough; p.inputs['Metallic'].default_value = metal
    if emit: p.inputs['Emission Color'].default_value = rgb(emit); p.inputs['Emission Strength'].default_value = strength
    if alpha < 1:
        p.inputs['Alpha'].default_value = alpha
        try: m.surface_render_method = 'BLENDED'
        except Exception: pass
    if not unique: MATS[name] = m
    return m
def set_emit(m, strength, color=None):
    p = principled(m); p.inputs['Emission Strength'].default_value = strength
    if color: p.inputs['Emission Color'].default_value = rgb(color)
def wood(name, c1, c2, scale=(1, 18, 1), rough=.55, stripes=6.0, distort=1.5):
    """木目（波の模様と雑音を混ぜて 2色の間を塗る）。すっきりした模型の木"""
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; p = principled(m)
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = scale
    wv = nt.nodes.new('ShaderNodeTexWave'); wv.inputs['Scale'].default_value = stripes; wv.inputs['Distortion'].default_value = distort; wv.inputs['Detail'].default_value = 2.0
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 40.0
    mx = nt.nodes.new('ShaderNodeMath'); mx.operation = 'MULTIPLY_ADD'; mx.inputs[1].default_value = .55; mx.inputs[2].default_value = .0
    ad = nt.nodes.new('ShaderNodeMath'); ad.operation = 'ADD'
    cr = nt.nodes.new('ShaderNodeValToRGB'); cr.color_ramp.elements[0].color = rgb(c1); cr.color_ramp.elements[1].color = rgb(c2)
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], wv.inputs['Vector']); nt.links.new(mp.outputs['Vector'], nz.inputs['Vector'])
    nt.links.new(wv.outputs['Fac'], mx.inputs[0]); nt.links.new(mx.outputs[0], ad.inputs[0])
    sc = nt.nodes.new('ShaderNodeMath'); sc.operation = 'MULTIPLY'; sc.inputs[1].default_value = .25
    nt.links.new(nz.outputs['Fac'], sc.inputs[0]); nt.links.new(sc.outputs[0], ad.inputs[1])
    nt.links.new(ad.outputs[0], cr.inputs['Fac']); nt.links.new(cr.outputs['Color'], p.inputs['Base Color'])
    p.inputs['Roughness'].default_value = rough
    MATS[name] = m; return m
def imgmat(name, path, back='#efe2c4', alpha=False, reveal=False):
    """画像の材質。裏（backfacing）は back の色。reveal=True：UV の u が値（ノード 'reveal'）より大きい所を透明に（追伸を書いていく）"""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; p = principled(m)
    tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(path); tx.interpolation = 'Cubic'
    try: tx.image.colorspace_settings.name = 'sRGB'
    except Exception: pass
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    mixc = nt.nodes.new('ShaderNodeMixRGB'); mixc.inputs['Color2'].default_value = rgb(back)
    nt.links.new(geo.outputs['Backfacing'], mixc.inputs['Fac']); nt.links.new(tx.outputs['Color'], mixc.inputs['Color1'])
    nt.links.new(mixc.outputs['Color'], p.inputs['Base Color']); p.inputs['Roughness'].default_value = .8
    if alpha or reveal:
        a = tx.outputs['Alpha']
        if reveal:
            uv = nt.nodes.new('ShaderNodeTexCoord'); sp = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(uv.outputs['UV'], sp.inputs['Vector'])
            v = nt.nodes.new('ShaderNodeValue'); v.name = 'reveal'; v.outputs[0].default_value = 0.0
            lt = nt.nodes.new('ShaderNodeMath'); lt.operation = 'LESS_THAN'; nt.links.new(sp.outputs['X'], lt.inputs[0]); nt.links.new(v.outputs[0], lt.inputs[1])
            mu = nt.nodes.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; nt.links.new(a, mu.inputs[0]); nt.links.new(lt.outputs[0], mu.inputs[1]); a = mu.outputs[0]
        nt.links.new(a, p.inputs['Alpha'])
        try: m.surface_render_method = 'BLENDED'
        except Exception: pass
    return m

def put(o, m):
    if m is not None:
        o.data.materials.clear(); o.data.materials.append(m)
    return o
def box(name, size, loc, m, bevel=0.0, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name; o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        b = o.modifiers.new('bv', 'BEVEL'); b.width = bevel; b.segments = 3
    return put(o, m)
def cyl(name, r, depth, loc, m, rot=(0, 0, 0), verts=48):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name
    try: bpy.ops.object.shade_auto_smooth(angle=math.radians(40))
    except Exception: bpy.ops.object.shade_smooth()
    return put(o, m)
def sphere(name, r, loc, m, scale=(1, 1, 1), seg_=32, ring=16):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg_, ring_count=ring, radius=r, location=loc)
    o = bpy.context.active_object; o.name = name; o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True); bpy.ops.object.shade_smooth()
    return put(o, m)
def torus(name, R, r, loc, m, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=64, minor_segments=12, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name; bpy.ops.object.shade_smooth(); return put(o, m)
def empty(name, loc=(0, 0, 0)):
    o = bpy.data.objects.new(name, None); o.location = loc; return link(o)
def parent(c, p):
    bpy.context.view_layer.update()
    c.parent = p; c.matrix_parent_inverse = p.matrix_world.inverted()
def plane(name, w, h, loc, m, uv=None):
    """xy の平面（中心 loc、幅 w・奥行き h）。uv＝(u0,v0,u1,v1)"""
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    vs = [bm.verts.new((x, y, 0)) for x, y in ((-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2))]
    f = bm.faces.new(vs); lay = bm.loops.layers.uv.new('UV')
    u0, v0, u1, v1 = uv or (0, 0, 1, 1)
    for lp, (u, v) in zip(f.loops, ((u0, v0), (u1, v0), (u1, v1), (u0, v1))): lp[lay].uv = (u, v)
    bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); o.location = loc; link(o); return put(o, m)

FONT_L = None; FONT_J = None
def fonts():
    global FONT_L, FONT_J
    for f in ('/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf', '/System/Library/Fonts/Supplemental/Arial Bold.ttf'):
        if os.path.exists(f): FONT_L = bpy.data.fonts.load(f); break
    f = '/System/Library/Fonts/Supplemental/Arial Unicode.ttf'
    FONT_J = bpy.data.fonts.load(f) if os.path.exists(f) else FONT_L
def text(name, body, size, m, loc=(0, 0, 0), rot=(0, 0, 0), font=None, extrude=0.0004):
    cu = bpy.data.curves.new(name, 'FONT'); cu.body = body; cu.size = size; cu.align_x = 'CENTER'; cu.align_y = 'CENTER'
    cu.font = font or FONT_L; cu.extrude = extrude
    o = bpy.data.objects.new(name, cu); o.location = loc; o.rotation_euler = rot; link(o); cu.materials.append(m); return o
def show(o, v):
    o.hide_render = not v; o.hide_viewport = not v
def show_tree(o, v):
    show(o, v)
    for c in o.children: show_tree(c, v)

# ---------------- 場面 ----------------
bpy.ops.wm.read_factory_settings(use_empty=True)
fonts()
SC = bpy.context.scene
SC.render.engine = 'BLENDER_EEVEE'
SC.render.resolution_x = int(W * A['scale']); SC.render.resolution_y = int(H * A['scale']); SC.render.resolution_percentage = 100
SC.render.image_settings.file_format = 'JPEG'; SC.render.image_settings.quality = 92
SC.view_settings.view_transform = 'Standard'; SC.view_settings.look = 'None'; SC.view_settings.exposure = 0.0
SC.eevee.taa_render_samples = A['samples']
try: SC.render.use_motion_blur = False
except Exception: pass
WORLD = bpy.data.worlds.new('W'); SC.world = WORLD; WORLD.use_nodes = True
BGN = next(n for n in WORLD.node_tree.nodes if n.type == 'BACKGROUND'); BGN.inputs[0].default_value = rgb('#6b5a4a'); BGN.inputs[1].default_value = .35

# 色
WHITE = '#f6f2e8'; ORANGE = '#f08a2c'; BLUE = '#2f7bf0'; INKD = '#22160c'; KAI = '#5f8fff'; MIO = '#ff7fa6'
M_WHITE = mat('tileW', WHITE, .45); M_OR = mat('tileO', ORANGE, .45); M_BLUE = mat('tileB', BLUE, .4)
M_INK = mat('ink', INKD, .5); M_INKW = mat('inkW', '#fffaf0', .5); M_NAVY = mat('navy', '#1b2440', .5)
M_SKIN = mat('skin', '#e9b48f', .6)

# 部屋：床・壁・窓・机
FLOOR_Z = -0.76
plane('floor', 8, 8, (0, 0, FLOOR_Z), wood('floorW', '#7a5232', '#5e3d22', (1, 6, 1), stripes=4))
wall = plane('wall', 8, 3, (0, 1.25, FLOOR_Z + 1.5), mat('wall', '#efe5d6', .9)); wall.rotation_euler = (math.pi / 2, 0, 0)
box('base', (8, .02, .1), (0, 1.24, FLOOR_Z + .05), mat('baseboard', '#d8cbb6', .7))
win = plane('window', .8, 1.0, (-1.0, 1.235, .65), mat('winGlow', '#fff3d6', .5, emit='#fff1d2', strength=3.5)); win.rotation_euler = (math.pi / 2, 0, 0)
for (sx, sz, x, z) in ((.86, .05, -1.0, .15), (.86, .05, -1.0, 1.15), (.05, 1.05, -1.43, .65), (.05, 1.05, -.57, .65), (.86, .03, -1.0, .65), (.03, 1.0, -1.0, .65)):
    box('winF', (sx, .03, sz), (x, 1.22, z), mat('winFrame', '#f8f4ec', .6))
fr = plane('picture', .36, .28, (.75, 1.235, .55), mat('pic', '#9fb8a0', .8)); fr.rotation_euler = (math.pi / 2, 0, 0)
box('picF', (.40, .02, .32), (.75, 1.245, .55), mat('picFrame', '#6b4a2e', .5))
DESK_W, DESK_D = 2.1, 1.1
box('desk', (DESK_W, DESK_D, .05), (0, 0, -.025), wood('deskW', '#a8723f', '#87582f', (1, 14, 1)), bevel=.004)
for lx in (-.98, .98):
    for ly in (-.48, .48): box('leg', (.06, .06, .71), (lx, ly, -.05 - .355), wood('deskW', '#c18a52', '#a46e3c'))
# 鉢植え（背景のぼけ）
cyl('pot', .07, .12, (.92, .42, .06), mat('pot', '#c9714a', .7))
for i, (dx, dy, dz, r) in enumerate(((0, 0, .18, .07), (.05, .02, .24, .05), (-.05, -.01, .23, .055), (.01, .04, .29, .045))):
    sphere('leaf%d' % i, r, (.92 + dx, .42 + dy, dz), mat('leaf', '#5f9b55', .7))
# 本の山（背景）
for i, (h, c) in enumerate(((.035, '#3f6e9e'), (.03, '#b4553f'), (.04, '#d9b25c'))):
    box('stack%d' % i, (.22, .16, h), (-.92, .40, .02 + sum((.035, .03, .04)[:i]) + h / 2 - .02), mat('stack%d' % i, c, .6), bevel=.003)

# 光：暖かい主光・弱い補助光・後ろからの縁の光
LIGHTS = []
def area(name, loc, target, power, size, color):
    ld = bpy.data.lights.new(name, 'AREA'); ld.energy = power; ld.size = size; ld.color = rgb(color)[:3]
    o = link(bpy.data.objects.new(name, ld)); o.location = loc
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); LIGHTS.append((ld, power)); return o
area('key', (-1.0, -1.2, 1.6), (0, 0, 0), 70, 1.4, '#ffd8a8')
area('fill', (1.3, -0.9, 0.9), (0, 0, 0), 18, 1.6, '#dfe6ff')
area('rim', (0.2, 1.0, 1.3), (0, 0, 0), 30, 1.2, '#ffe2c0')
area('floorL', (0, -1.8, 0.2), (0, -1.2, -.76), 20, 1.4, '#ffd8a8')

# ---------------- 手（ミトンのような簡単な手） ----------------
HANDS = {}
TIP = Vector((0, .112, -.004))   # 手の根元（手首）からの、人差し指の先
def make_hand(name, sleeve):
    root = empty('hand_' + name)
    ms = mat('sleeve_' + name, sleeve, .8)
    parts = [sphere(name + '_palm', .042, (0, .035, 0), M_SKIN, scale=(1, 1.15, .5)),
             sphere(name + '_fing', .016, (0, .085, -.002), M_SKIN, scale=(1.0, 1.9, .8)),
             sphere(name + '_mitt', .03, (-.012, .07, -.004), M_SKIN, scale=(1.0, 1.4, .55)),
             sphere(name + '_thumb', .013, (.038, .045, -.004), M_SKIN, scale=(1.0, 2.0, .9)),
             cyl(name + '_slv', .036, .26, (0, -.13, 0), ms, rot=(math.pi / 2, 0, 0)),
             torus(name + '_cuff', .036, .008, (0, -.004, 0), mat('cuff', '#f7f3ea', .7), rot=(math.pi / 2, 0, 0))]
    parts[3].rotation_euler = (0, 0, -.6)
    for p in parts: parent(p, root)
    HANDS[name] = root; return root
for nm, col in (('kai', '#3d63c9'), ('mio', '#e8789c'), ('cour', '#7a5a3a'), ('wal', '#26262e'), ('phel', '#3f5a4a')): make_hand(nm, col)
def set_hand(name, tip, yaw=0.0, pitch=-25.0, roll=0.0, vis=True):
    h = HANDS[name]; show_tree(h, vis)
    if not vis: h.location = (0, 0, -5); return
    R = Euler((math.radians(pitch), math.radians(roll), math.radians(yaw)), 'XYZ')
    h.rotation_euler = R
    h.location = Vector(tip) - R.to_matrix() @ TIP
def hand_path(name, t, keys):
    """keys：[(時刻, 先の位置, yaw, pitch)…]。最初より前・最後より後は見えない（手は画面の外へ）"""
    if t < keys[0][0] or t > keys[-1][0]: set_hand(name, (0, 0, 0), vis=False); return
    for (t0, p0, y0, q0), (t1, p1, y1, q1) in zip(keys, keys[1:]):
        if t0 <= t <= t1:
            u = sm((t - t0) / max(1e-9, t1 - t0))
            set_hand(name, vlerp(p0, p1, u), lerp(y0, y1, u), lerp(q0, q1, u)); return

# ---------------- タイル（上＝白か橙、下＝もう一方。ひっくり返すと文字が替わる） ----------------
TS = .042; TT = .013
def tile(name, top, topm, bot, botm, loc, size=TS, tsize=.03, ink_top=None, ink_bot=None):
    r = empty(name, loc)
    a = box(name + '_t', (size, size, TT / 2), (loc[0], loc[1], loc[2] + TT / 4), topm, bevel=.002)
    b = box(name + '_b', (size, size, TT / 2), (loc[0], loc[1], loc[2] - TT / 4), botm, bevel=.002)
    ta = text(name + '_tt', top, tsize, ink_top or M_INK, (loc[0], loc[1], loc[2] + TT / 2 + .0003))
    tb = text(name + '_tb', bot, tsize, ink_bot or M_INK, (loc[0], loc[1], loc[2] - TT / 2 - .0003), rot=(0, math.pi, 0))
    for p in (a, b, ta, tb): parent(p, r)
    r['tt'] = ta.name; r['tb'] = tb.name
    return r
def place_tile(r, pos, flip=0.0, spin=0.0, vis=True, lift=0.0):
    """flip：0＝上の面、1＝裏返し（Y 軸のまわりに 180°）。とちゅうは跳ねる"""
    show_tree(r, vis)
    if not vis: r.location = (0, 0, -5); return
    r.location = (pos[0], pos[1], pos[2] + TT / 2 + hop(clamp(flip), .035) * (1 if 0 < flip < 1 else 0) + lift)
    r.rotation_euler = (0, math.pi * sm(flip), spin)

# ---------------- 手紙（メアリーの手紙・再現） ----------------
LT = Vector((-.05, -.30, 0)); LW, LH = .20, .26
M_LET = imgmat('letter', os.path.join(TEX, 'letter.png'))
let_root = empty('letter', LT)
pA = plane('letA', LW, LH / 2, (LT.x, LT.y - LH / 4, .0008), M_LET, uv=(0, 0, 1, .5)); parent(pA, let_root)
hingeB = empty('letB_h', (LT.x, LT.y, .0016)); parent(hingeB, let_root)
pB = plane('letB', LW, LH / 2, (LT.x, LT.y + LH / 4, .0016), M_LET, uv=(0, .5, 1, 1)); parent(pB, hingeB)
M_WAX = mat('wax', '#a3151b', .35)
def half_disc(name, r, h, sign):
    me = bpy.data.meshes.new(name); bm = bmesh.new(); n = 16
    pts = [(r * math.cos(math.pi * k / n) * 1, sign * r * math.sin(math.pi * k / n)) for k in range(n + 1)]
    bot = [bm.verts.new((x, y, 0)) for x, y in pts]; top = [bm.verts.new((x, y, h)) for x, y in pts]
    bm.faces.new(bot[::-1]); bm.faces.new(top)
    for i in range(n): bm.faces.new((bot[i], bot[i + 1], top[i + 1], top[i]))
    bm.faces.new((bot[-1], bot[0], top[0], top[-1]))
    bm.normal_update(); bm.to_mesh(me); bm.free(); o = bpy.data.objects.new(name, me); link(o); return put(o, M_WAX)
sealL = half_disc('sealL', .016, .004, 1); sealR = half_disc('sealR', .016, .004, -1)
SEAL_LOCAL = Vector((0, LH / 2 - .02, -.0002))   # B の局所（B の裏面）
for s_ in (sealL, sealR): s_.parent = pB; s_.matrix_parent_inverse = Matrix.Identity(4)
PS_W = LW; PS_H = LW * 160 / 1024
M_PS = imgmat('ps', os.path.join(TEX, 'ps.png'), back='#efe2c4', reveal=True)
PS_Y = LT.y + .13 - .26 * 1155 / 1332
psp = plane('ps', PS_W, PS_H, (LT.x, PS_Y, .0013), M_PS)
def letter_state(t):
    # 0〜0.5 秒：指が封を押す／0.5〜0.75：封が割れる／0.7〜1.95：上の半分が開く（手が持ち上げる）
    br = seg(t, .5, .75); ang = math.pi * (1 - seg(t, .7, 1.95))
    hingeB.rotation_euler = (ang, 0, 0)
    for s_, sg in ((sealL, 1), (sealR, -1)):
        s_.location = Vector((0, LH / 4 - .02 + sg * .007 * br, -.0002)); s_.rotation_euler = (math.pi + sg * .3 * br, 0, sg * .2 * br)
    return ang
def letter_tip(ang):
    """B の奥の端（手で持ち上げる所）の位置"""
    return Vector((LT.x, LT.y + LH / 2 * math.cos(ang), .0016 + LH / 2 * math.sin(ang)))

# ---------------- たる（ビールのたる、栓から手紙） ----------------
BR = Vector((-.64, .20, 0)); BRL = .22; BRR = .085
def barrel():
    me = bpy.data.meshes.new('barrel'); bm = bmesh.new(); n = 48; m = 16; rings = []
    for i in range(m + 1):
        x = -BRL / 2 + BRL * i / m; prof = BRR * (1 - .22 * (2 * x / BRL) ** 2)
        rings.append([bm.verts.new((x, prof * math.cos(2 * math.pi * k / n), prof * math.sin(2 * math.pi * k / n))) for k in range(n)])
    for i in range(m):
        for k in range(n): bm.faces.new((rings[i][k], rings[i][(k + 1) % n], rings[i + 1][(k + 1) % n], rings[i + 1][k]))
    bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1])
    bm.normal_update(); bm.to_mesh(me); bm.free()
    o = link(bpy.data.objects.new('barrel', me)); o.location = (BR.x, BR.y, BRR + .02)
    for f in me.polygons: f.use_smooth = True
    put(o, wood('barrelW', '#9a6234', '#7b4a24', (40, 1, 1), stripes=3))
    for x in (-.085, 0, .085):
        prof = BRR * (1 - .22 * (2 * x / BRL) ** 2)
        torus('hoop', prof + .002, .004, (BR.x + x, BR.y, BRR + .02), mat('hoopM', '#3c3632', .35, metal=.6), rot=(0, math.pi / 2, 0))
    for x in (-.06, .06): box('cradle', (.03, .16, .04), (BR.x + x, BR.y, .02), wood('deskW', '#c18a52', '#a46e3c'))
    cyl('bung', .012, .006, (BR.x, BR.y, 2 * BRR + .02 - .001), mat('bungHole', '#2a1a0e', .8))
barrel()
BUNG = Vector((BR.x, BR.y, 2 * BRR + .02))
cork = cyl('cork', .011, .016, BUNG + Vector((0, 0, .005)), mat('cork', '#c8a06a', .8))
note = box('note', (.028, .006, .05), BUNG, mat('notePaper', '#efe2c4', .8), bevel=.001)
def barrel_state(t):
    # 行3：「メアリーは」で栓が飛び、「暗号の手紙を」で折った手紙が出てくる。行24：運び役の手が取る
    tc = T('barrel:mary', 'メアリーワ'); u = lin(t, tc, tc + .55)
    u = lin(t, tc, tc + .6)
    cork.location = BUNG + Vector((.07 * u, -.03 * u, .005 + hop(u, .09) - (BUNG.z + .005 - .011) * u))
    cork.rotation_euler = (math.pi / 2 * sm(u), 1.2 * u, 0)
    tn = T('barrel:mary', 'アンゴオノ')
    rise = seg(t, tn, tn + .8)
    show(note, t >= tn)
    return rise
NOTE_UP = BUNG + Vector((0, 0, .02))

# ---------------- 得点板 ----------------
BD = Vector((.30, .36, 0))
board_h = empty('board_h', BD)
bpanel = box('board', (.32, .014, .15), (BD.x, BD.y, .075), wood('boardW', '#5b3a22', '#4a2e1a', (1, 10, 1)), bevel=.004); parent(bpanel, board_h)
M_KAI = mat('kaiTxt', KAI, .4, emit=KAI, strength=.4); M_MIO = mat('mioTxt', MIO, .4, emit=MIO, strength=.4)
for x, s_, m in ((-.10, '作る側', M_KAI), (.10, '破る側', M_MIO)):
    o = text('bl', s_, .028, m, (BD.x + x, BD.y - .0075, .118), rot=(math.pi / 2, 0, 0), font=FONT_J); parent(o, board_h)
dash = text('bdash', '−', .05, M_INKW, (BD.x, BD.y - .0075, .055), rot=(math.pi / 2, 0, 0), font=FONT_J); parent(dash, board_h)
M_DIG = mat('digit', '#fffaf0', .4, emit='#fff6e0', strength=.25)
dg = {}
for k, x in (('make', -.10), ('brk', .10)):
    o = text('dig_' + k, '0', .07, M_DIG, (BD.x + x, BD.y - .0075, .052), rot=(math.pi / 2, 0, 0)); parent(o, board_h); dg[k] = o
SCORE_T = [(T('disk:three', 'キャット'), 1), (T('rows:done', 'カゾエタ'), 2)]
def board_state(t):
    ts = S('barrel:board') + .35
    u = lin(t, ts, ts + .55)
    board_h.rotation_euler = (-(math.pi / 2) * (1 - back(u)) if t < ts + .55 else 0, 0, 0)
    n = 0; pop = 1.0
    for tt, v in SCORE_T:
        if t >= tt: n = v
        d = t - tt
        if 0 <= d < .45: pop = 1 + .6 * math.sin(math.pi * d / .45)
    dg['brk'].data.body = str(n); dg['brk'].scale = (pop, pop, pop)

# ---------------- 円板（カエサル） ----------------
DK = Vector((.55, -.20, 0)); R_OUT, R_IN = .135, .095
disk_root = empty('disks', DK)
od = cyl('diskOut', R_OUT, .012, (DK.x, DK.y, .006), wood('diskO', '#5b3a22', '#4b2f1b', (1, 12, 1)), verts=96); parent(od, disk_root)
inner = empty('inner', (DK.x, DK.y, .012)); parent(inner, disk_root)
idk = cyl('diskIn', R_IN, .012, (DK.x, DK.y, .018), wood('diskI', '#8a5a32', '#6f4526', (1, 12, 1)), verts=96); parent(idk, inner)
cyl('pin', .008, .03, (DK.x, DK.y, .02), mat('brass', '#c9a44e', .3, metal=.8))
knob = cyl('knob', .009, .012, (DK.x, DK.y + .05, .03), M_BLUE); parent(knob, inner)
OUTL = {}; INL = {}
def ang_of(pos): return math.pi / 2 - 2 * math.pi * pos / 26
for j, c in enumerate(ABC):
    a = ang_of(j); r = .116
    m = mat('outL_' + c, '#fffaf0', .5, emit='#fffaf0', strength=.0, unique=True)
    o = text('o_' + c, c, .022, m, (DK.x + r * math.cos(a), DK.y + r * math.sin(a), .0125), rot=(0, 0, a - math.pi / 2)); parent(o, disk_root); OUTL[c] = (o, m)
    a = ang_of(j); r = .078
    m = mat('inL_' + c, ORANGE, .5, emit=ORANGE, strength=.0, unique=True)
    o = text('i_' + c, c, .019, m, (DK.x + r * math.cos(a), DK.y + r * math.sin(a), .0245), rot=(0, 0, a - math.pi / 2)); parent(o, inner); INL[c] = (o, m)
# 円板の向き（rot：内の文字 k が 位置 k+rot に来る。A→D は rot＝−3）
# 第5版：行5〜11前半は rot＝0（外と内が同じ文字）。行11「3目盛り回しておくと」で 1目盛りずつ −3。行13「26目盛り回すと」でひと回り（−29、元と同じ並び）。
#        行14：猛スピードで5回転、「1つ・2つ・3つ」で1目盛りずつ戻す（−29＋130＋3＝104＝26×4 → 外と内が同じ → CAT）
def turn_steps():
    a = T('disk:turn', 'サンメモリ'); b = T('disk:turn', 'オクト', end=True)
    return [a + (b - a) * k / 3 for k in range(3)]
def disk_rot(t):
    r = -sum(seg(t, x, x + .28) for x in turn_steps())
    a = T('disk:25', 'ニジュウロクメモリ'); b = T('disk:25', 'モドッテ', end=True)
    r -= 26 * seg(t, a, b)
    ts0, ts1 = S('disk:spin') + .45, VE('disk:spin') + .25
    if t >= ts0: r = -29 + 130 * (sm(lin(t, ts0, ts1)) if t < ts1 else 1)
    tk = TSEQ('disk:three', ['ヒトツ', 'フタツ', 'ミッツ'])
    if t >= tk[0] - .05:
        r = -29 + 130 + sum(seg(t, x - .05, x + .2) for x in tk)
    return r
assert (-29 + 130 + 3) % 26 == 0 and -29 % 26 == -3 % 26
def outer_xy(c, r=.116, z=.0125):
    a = ang_of(ABC.index(c)); return Vector((DK.x + r * math.cos(a), DK.y + r * math.sin(a), z))
# 指が外の輪を1目盛りずつ進む（行6：A→D、行7：B→E、行10：Z→C）。(cue, 言葉の列, 文字の列)
FINGER = [('disk:ad', ['エエカラ', 'ビイ', 'スィイ', 'ディイト'], DATA['steps']['ad']),
          ('disk:be', ['ビイナラ', 'スィイ', 'ディイ', 'イイデ'], DATA['steps']['be']),
          ('ring:zc', ['ゼット', 'エエ', 'ビイ', 'スィイデ'], DATA['steps']['zc'])]
def finger_state(t):
    """(指先の位置 or None, 光る外の文字 {文字: 強さ})"""
    glow = {}
    for key, nds, cs in FINGER:
        ts = TSEQ(key, nds); t0 = ts[0] - .55; t1 = E(key) + .1
        if not (t0 <= t <= t1 + .6): continue
        # 着く時刻 ts[k]（声がその文字を言う時）。前の文字から跳ねて移る（.3 秒）
        k = max([i for i in range(4) if t >= ts[i] - .3] or [0])
        R = .140; ang = lambda c: ang_of(ABC.index(c))
        p = outer_xy(cs[k], r=R, z=.02); a = ang(cs[k])
        if t < ts[0] - .3: p = vlerp(outer_xy(cs[0], r=.40, z=.16), outer_xy(cs[0], r=R, z=.02), sm((t - t0) / .25)); a = ang(cs[0])
        elif k > 0 and t < ts[k]:
            u = lin(t, ts[k] - .3, ts[k]); a0, a1 = ang(cs[k - 1]), ang(cs[k])
            if a1 - a0 > math.pi: a1 -= 2 * math.pi
            if a0 - a1 > math.pi: a1 += 2 * math.pi
            a = lerp(a0, a1, sm(u)); p = Vector((DK.x + R * math.cos(a), DK.y + R * math.sin(a), .02 + hop(u, .02)))
        if t > t1: p = vlerp(outer_xy(cs[3], r=R, z=.02), outer_xy(cs[3], r=.40, z=.16), sm((t - t1) / .6)); a = ang(cs[3])
        for i in range(4):
            if t >= ts[i] - .05: glow[cs[i]] = 1.0 if i in (0, 3) else (.6 if i == k else .25)
        return (p, a), glow
    return None, glow
CATS = [tile('cat%d' % i, 'CAT'[i], M_WHITE, 'FDW'[i], M_OR, (0, 0, -5)) for i in range(3)]
CAT_POS = [Vector((DK.x - .06 + .06 * i, -.375, 0)) for i in range(3)]   # 第5版：円板の近くに（真上から 1画面に入れる）

# ---------------- 入れ替えの表（26組） ----------------
TB = Vector((.55, -.17, 0)); TP = .048
def tab_xy(j, row):  # row 0＝白、1＝橙
    g = j // 13; c = j % 13
    return Vector((TB.x + (c - 6) * TP, TB.y + .09 - g * .135 - row * .056, 0))
TW_ = [tile('tw%d' % j, ABC[j], M_WHITE, ABC[j], M_WHITE, (0, 0, -5)) for j in range(26)]
TO_ = [tile('to%d' % j, ABC[j], M_OR, ABC[j], M_OR, (0, 0, -5)) for j in range(26)]   # 橙のタイル j＝文字 ABC[j]
UNSUB = {SUB[j]: j for j in range(26)}
def pair_lift(t):
    """行17「AはQ、BはW、CはE」：その組の白と橙が少し浮く（声がその文字を言う時から、cue の終わりまで）"""
    out = {}
    for c, nd in (('A', 'エエワ'), ('B', 'ビイワ'), ('C', 'スィイワ')):
        a = T('sub:ex', nd); out[ABC.index(c)] = .018 * seg(t, a, a + .25) * (1 - seg(t, E('sub:ex'), E('sub:ex') + .4))
    return out
def table_state(t, vis):
    t1 = S('sub:shuffle') + .15; t2 = T('sub:shuffle', 'ズラス'); t3 = T('sub:shuffle', 'バラバラニ')
    pl = pair_lift(t)
    for j in range(26):
        d = t1 + .03 * j; u = seg(t, d, d + .3)
        place_tile(TW_[j], tab_xy(j, 0), vis=vis and t >= d, lift=.08 * (1 - u) + pl.get(j, 0))
    for k in range(26):   # 橙のタイル k（文字 ABC[k]）：カエサルの位置（平文 k−3 の下）→ 入れ替え表の位置（平文 UNSUB の下）
        d = t2 + .03 * k; u = seg(t, d, d + .3)
        p0 = tab_xy((k - 3) % 26, 1); p1 = tab_xy(UNSUB[ABC[k]], 1)
        dl = t3 + .55 * ((k * 7) % 26) / 26; w = seg(t, dl, dl + .55); wl = lin(t, dl, dl + .55)
        p = vlerp(p0, p1, w); lift = .08 * (1 - u) + hop(wl, .07 + .03 * ((k * 5) % 3)) * (0 < wl < 1) + pl.get(UNSUB[ABC[k]], 0)
        place_tile(TO_[k], p, vis=vis and t >= d, lift=lift, spin=2 * math.pi * w * (1 if k % 2 else -1))

# 行17：表の前の CAT（白）→ 1枚ずつ裏返して EQJ（橙）
SCAT = [tile('scat%d' % i, 'CAT'[i], M_WHITE, DATA['catSub'][i], M_OR, (0, 0, -5)) for i in range(3)]
SCAT_POS = [Vector((TB.x - .07 + .07 * i, -.385, 0)) for i in range(3)]
def scat_state(t):
    a = T('sub:cat', 'キャットワ') - .5; ft = TSEQ('sub:cat', ['イイ', 'キュウ', 'ジェエ'])
    gone = S('tab:a') + .2
    for i, r in enumerate(SCAT):
        d = a + .08 * i; u = seg(t, d, d + .3); out = seg(t, gone + .05 * i, gone + .05 * i + .4)
        place_tile(r, SCAT_POS[i] + Vector((0, -.25 * out, 0)), flip=lin(t, ft[i], ft[i] + .4), vis=d <= t < gone + .6, lift=.06 * (1 - u) + hop(out, .05))

# 行18・19：行き先の線（白のタイルから、まだ使っていない橙のタイルへ、弧を描く）。A 26本 → B 25本 → C 24本 → … → Z 1本
M_ARC = mat('arc', BLUE, .35, emit='#7fb2ff', strength=1.2)
arc_me = bpy.data.meshes.new('arcsM'); arc_ob = link(bpy.data.objects.new('arcs', arc_me)); put(arc_ob, M_ARC)
def orange_pos(k): return tab_xy(UNSUB[ABC[k]], 1)
def fan_plan():
    """[(始まり, 終わり, 平文の文字 j, 線を伸ばす速さの区間)]。行き先は SUB の順に使っていく（A→Q、B→W、…）"""
    out = []
    a = T('tab:a', 'ニジュウロクモジノ'); out.append((a, S('tab:b') + .3, 0, 1.6))
    b = T('tab:b', 'ビイノ'); out.append((b, S('tab:c') + .2, 1, 1.4))
    c = T('tab:c', 'スィイワ'); out.append((c, T('tab:z', 'コオシテ') + .05, 2, 1.0))
    z0 = T('tab:z', 'コオシテ'); z1 = T('tab:z', 'ゼットワ') - .1
    for j in range(3, 25):                                   # D〜Y：すばやく（「……と減っていく」）
        d = z0 + (z1 - z0) * (j - 3) / 22; out.append((d, d + (z1 - z0) / 22 + .02, j, .08))
    out.append((T('tab:z', 'ゼットワ'), S('tree:mult') + .4, 25, .4))
    return out
FAN = None
def arcs_state(t):
    global FAN
    if FAN is None: FAN = fan_plan()
    bm = bmesh.new(); n_drawn = 0
    for (a, b, j, grow) in FAN:
        if not (a <= t < b): continue
        used = set(SUB[i] for i in range(j))                     # 前の文字がもう使った行き先
        targets = [k for k in range(26) if ABC[k] not in used]
        assert len(targets) == 26 - j
        src = tab_xy(j, 0) + Vector((0, 0, TT + .002))
        for m, k in enumerate(targets):
            u = lin(t, a + grow * .6 * m / max(1, len(targets)), a + grow * .6 * m / max(1, len(targets)) + grow * .4 + .05)
            if u <= 0: continue
            dst = orange_pos(k) + Vector((0, 0, TT + .002))
            h = .035 + .22 * (src - dst).length
            pts = []
            for i in range(17):
                v = u * i / 16; q = src.lerp(dst, v); q.z += 4 * h * v * (1 - v); pts.append(q)
            r = .0011
            prev = None
            for q in pts:
                ring = [bm.verts.new(q + Vector((dx, 0, dz))) for dx, dz in ((r, 0), (0, r), (-r, 0), (0, -r))]
                if prev:
                    for e in range(4): bm.faces.new((prev[e], prev[(e + 1) % 4], ring[(e + 1) % 4], ring[e]))
                prev = ring
            n_drawn += 1
    bm.to_mesh(arc_me); bm.free()
    return n_drawn

# ---------------- 巻物（掛け算。机の端から床まで） ----------------
SCR = DATA['scroll']; SCW = SCR['w']; SCL = SCR['len']
S0 = Vector((-.78, -.24, 0)); EDGE_Y = -DESK_D / 2
_E = .012; _H = .0006
SCR_PTS = [Vector((S0.x, S0.y, _H)), Vector((S0.x, EDGE_Y, _H)), Vector((S0.x, EDGE_Y - _E, -_E)), Vector((S0.x, EDGE_Y - _E, FLOOR_Z + _E)),
           Vector((S0.x, EDGE_Y - 2 * _E, FLOOR_Z + _H)), Vector((S0.x, EDGE_Y - 2 * _E - 4, FLOOR_Z + _H))]
SCR_N = [Vector((0, 0, 1)), Vector((0, -.7071, .7071)), Vector((0, -1, 0)), Vector((0, -.7071, .7071)), Vector((0, 0, 1))]
def scroll_path(s):
    """巻物の中心線（s：始めからの長さ）→（位置、外向きの法線）。机の上 → 端を回って下へ → 床の上"""
    for i in range(len(SCR_PTS) - 1):
        a, b = SCR_PTS[i], SCR_PTS[i + 1]; d = (b - a).length
        if s <= d or i == len(SCR_PTS) - 2:
            return a + (b - a) * (s / d), SCR_N[i]
        s -= d
M_SCR = imgmat('scroll', os.path.join(TEX, 'scroll.png'), back='#e9dcc0')
scr_me = bpy.data.meshes.new('scrollM'); scr_ob = link(bpy.data.objects.new('scroll', scr_me)); put(scr_ob, M_SCR)
roll = cyl('roll', .02, SCW + .01, (0, 0, 0), mat('rollPaper', '#efe2c4', .8), rot=(0, math.pi / 2, 0))
rods = [cyl('rod%d' % i, .006, .012, (0, 0, 0), wood('rodW', '#6b4426', '#5b3a22'), rot=(0, math.pi / 2, 0)) for i in range(2)]
def scroll_len(t):
    # 第5版：行21 で一気に床まで伸びる（26・×25・×24… の段が机の上を走り、端を越えて床へ）。行42 で巻き戻る
    a = S('scroll:years'); k = TSEQ('scroll:years', ['イチビョオニ', 'タメシテモ', 'ゼンブオ', 'センサンビャクマンネン'])
    L = .02 + .25 * seg(t, a + .1, k[0] + .5)
    L += (1.56 - .27) * (lin(t, k[1] - .2, k[2] + .6) ** 1.6)
    L += (2.20 - 1.56) * seg(t, k[3] - .9, k[3] + .25)
    r0 = T('scroll:back', 'ヒトツモ') - .4; r1 = VE('scroll:back') + .3
    L = .02 + (L - .02) * (1 - sm(lin(t, r0, r1)))
    return min(L, SCL)
def scroll_state(t):
    L = scroll_len(t); n = max(2, int(L / .006) + 1)
    bm = bmesh.new(); lay = bm.loops.layers.uv.new('UV'); prev = None
    for i in range(n):
        s = L * i / (n - 1); p, nr = scroll_path(s); side = Vector((1, 0, 0)) * SCW / 2
        a = bm.verts.new(p - side); b = bm.verts.new(p + side)
        if prev:
            f = bm.faces.new((prev[1], prev[0], a, b))
            v0 = 1 - prev[2] / SCL; v1 = 1 - s / SCL
            for lp, uv in zip(f.loops, ((1, v0), (0, v0), (0, v1), (1, v1))): lp[lay].uv = uv
        prev = (a, b, s)
    bm.to_mesh(scr_me); bm.free()
    p, nr = scroll_path(L); r = .012 + .012 * (1 - L / SCL)
    roll.location = p + nr * r; roll.scale = (r / .02, r / .02, 1)
    for i, sx in enumerate((-1, 1)): rods[i].location = roll.location + Vector((sx * (SCW / 2 + .01), 0, 0))
    return L

# ---------------- キンディーの本 ----------------
BK = Vector((-.42, -.10, 0)); BKW, BKD = .17, .23
M_LEATH = mat('leather', '#6b2a1a', .55)
bpages = box('bpages', (BKW, BKD, .028), (BK.x, BK.y, .016), mat('pagesSide', '#e8d8b0', .8));
bback = box('bback', (BKW + .008, BKD + .01, .006), (BK.x, BK.y, .003), M_LEATH, bevel=.002)
bp_top = plane('bpageTop', BKW - .004, BKD - .004, (BK.x, BK.y, .0305), imgmat('bookR', os.path.join(TEX, 'book.png'), back='#ecdcb6'), uv=(.5, 0, 1, 1))
bhinge = empty('bhinge', (BK.x - BKW / 2, BK.y, .033))
bcover = box('bcover', (BKW + .008, BKD + .01, .006), (BK.x, BK.y, .034), M_LEATH, bevel=.002); parent(bcover, bhinge)
bcov_in = plane('bcovIn', BKW - .004, BKD - .004, (BK.x, BK.y, .0305), imgmat('bookL', os.path.join(TEX, 'book.png'), back='#ecdcb6'), uv=(0, 0, .5, 1));
bcov_in.rotation_euler = (0, math.pi, 0); bcov_in.location = (BK.x, BK.y, .0305); parent(bcov_in, bhinge)
bdeco = torus('bdeco', .03, .003, (BK.x, BK.y, .0372), mat('gold', '#c9a44e', .3, metal=.8)); parent(bdeco, bhinge)
def book_state(t):
    to = T('book:kindi', 'キンディイワ'); u = seg(t, to - .2, to + .9)
    bhinge.rotation_euler = (0, -math.pi * u, 0)

# ---------------- 塔（暗号文の文字を数える） ----------------
TWC = Vector((.55, .0, 0)); TPX = .03; SLAB = .0034
def tw_x(i): return TWC.x + (i - 12.5) * TPX
M_SLAB = mat('slab', '#f39a45', .5)
M_SLABX = {}
COLS = []; BASEL = []; BASEG = []
for i in range(26):
    m = mat('slab_%d' % i, '#f39a45', .5, emit='#ffb070', strength=0, unique=True); M_SLABX[i] = m
    o = box('col%d' % i, (.024, .024, SLAB * .88), (tw_x(i), TWC.y, SLAB / 2), m, bevel=.0008)
    ar = o.modifiers.new('arr', 'ARRAY'); ar.use_relative_offset = False; ar.use_constant_offset = True; ar.constant_offset_displace = (0, 0, SLAB); ar.count = 1
    COLS.append(o)
    BASEL.append(tile('base%d' % i, ABC[i], M_OR, ABC[i], M_OR, (0, 0, -5), size=.026, tsize=.019))
    BASEG.append(plane('gbase%d' % i, .026, .026, (0, 0, -5), imgmat('glyphM%d' % i, os.path.join(TEX, 'glyph%d.png' % i))))
WT = {c: tile('wt_' + c, c, M_WHITE, c, M_WHITE, (0, 0, -5), size=.03, tsize=.024) for c in 'ETH'}
CIPH = DATA['cipherLetters']; GT = DATA['gtower']; GLY = DATA['glyphs']; SYMP = DATA['symPlain']
# 記号の塔の数え方：TEXT1 の文字の順に、その文字の記号の塔に積む（平文の文字 → 記号 → 記号の番号）
PLAIN = ''.join(ABC[SUB.index(c)] for c in CIPH)
GORDER = [GLY.index(SYMP[ABC.index(p)]) for p in PLAIN]
assert all(sum(1 for g in GORDER if g == k) == GT[k] for k in range(26))
assert all(CIPH.count(ABC[k]) == DATA['tower'][k] for k in range(26))
def counted(t, a, b, n=541):
    return int(n * clamp((t - a) / (b - a))) if t > a else 0
def towers_state(t):
    a1 = T('tower:grow', 'ゴヒャク'); b1 = VE('tower:grow') + 1.0      # 第5版：「541文字の…数えていきます」で数える
    g0 = S('end:phel'); a2 = T('end:phel', 'キゴオノ'); b2 = T('end:phel', 'ツカエマス', end=True)
    vis_l = S('tower:grow') - .2 <= t < S('end:pass'); vis_g = g0 + 2.0 <= t < S('end:ps')
    if vis_l: n = counted(t, a1, b1); seq = CIPH; key = lambda c: ABC.index(c)
    elif vis_g: n = counted(t, a2, b2); seq = GORDER; key = lambda k: k
    else: n = 0; seq = ''
    cnt = [0] * 26
    for x in list(seq)[:n]: cnt[key(x)] += 1
    for i in range(26):
        o = COLS[i]; v = (vis_l or vis_g) and cnt[i] > 0; show(o, v)
        o.modifiers['arr'].count = max(1, cnt[i])
        place_tile(BASEL[i], Vector((tw_x(i), TWC.y - .034, 0)), vis=vis_l and t >= S('tower:grow') - .2 + .02 * i)
        bg = BASEG[i]; show(bg, vis_g); bg.location = (tw_x(i), TWC.y - .034, .0012) if vis_g else (0, 0, -5)
    # 光る塔（行36：X、行37：J）と白い文字（E・T・H）
    tx = T('tower:e', 'エックス'); tj = T('logic:hyp', 'ジェエワ'); off = S('rows:fill')
    gx = seg(t, tx, tx + .5) * (1 - seg(t, off + 1, off + 2))
    gj = seg(t, tj, tj + .5) * (1 - seg(t, off + 1, off + 2))
    for i in range(26): set_emit(M_SLABX[i], 0.0)
    set_emit(M_SLABX[ABC.index('X')], 2.2 * gx); set_emit(M_SLABX[ABC.index('J')], 2.2 * gj)
    for c, k, ta in (('E', 'X', T('tower:e', 'エックスガ', end=True)), ('T', 'J', T('logic:hyp', 'ティイ')), ('H', 'V', T('logic:judge', 'エイチ'))):
        i = ABC.index(k); top = SLAB * DATA['tower'][i]
        u = seg(t, ta - .1, ta + .35)
        place_tile(WT[c], Vector((tw_x(i), TWC.y, top + .002)), vis=vis_l and t >= ta - .1, lift=.08 * (1 - u))
    return cnt

# ---------------- 並べたタイル（最初の文の暗号文 → 読めていく） ----------------
RP = DATA['rows']['plain']; RC = DATA['rows']['cipher']; RW = Vector((.55, -.31, 0)); RPX = .046
ROWT = []
for r, (pl, ci) in enumerate(zip(RP, RC)):
    for c, (p, q) in enumerate(zip(pl, ci)):
        if p == ' ': continue
        x = RW.x + (c - (len(pl) - 1) / 2) * RPX; y = RW.y + .11 - r * .056
        o = tile('rw%d_%d' % (r, c), q, M_OR, p, M_WHITE, (0, 0, -5))
        ROWT.append({'o': o, 'p': p, 'q': q, 'pos': Vector((x, y, 0)), 'r': r, 'c': c})
assert len(ROWT) == 46
FILL = DATA['fill']
def rows_flip_time():
    s0 = S('rows:fill'); tm = {'X': s0 + .35, 'J': s0 + .6, 'V': s0 + .85}     # 第5版：分かった X・J・V を先に
    rest = [c for c in FILL[3:] if any(x['q'] == c for x in ROWT)]
    a = s0 + 1.2; b = VE('rows:fill') + 1.7
    for k, c in enumerate(rest): tm[c] = a + (b - a) * k / max(1, len(rest) - 1)
    return tm
FLIPT = None
M_GLOW = mat('glowOr', ORANGE, .4, emit='#ffcf7a', strength=0, unique=True)
def rows_state(t):
    global FLIPT
    if FLIPT is None: FLIPT = rows_flip_time()
    t0 = S('rows:fill') - .3; vis = t0 - .1 <= t < S('end:pass')
    tg = th = None
    for k, x in enumerate(ROWT):
        d = t0 + .012 * k; u = seg(t, d, d + .25)
        ft = FLIPT[x['q']] + .02 * (k % 7)
        f = lin(t, ft, ft + .4)
        place_tile(x['o'], x['pos'], flip=f, vis=vis and t >= d, lift=.06 * (1 - u))
    return tg, th

# ---------------- ろうそく ----------------
CD = Vector((-.22, .33, 0))
cyl('dish', .045, .008, (CD.x, CD.y, .004), mat('brass', '#c9a44e', .3, metal=.8))
cyl('candle', .018, .12, (CD.x, CD.y, .068), mat('wax2', '#f4ead2', .6))
cyl('wick', .0015, .012, (CD.x, CD.y, .134), mat('wick', '#1a1410', .8))
M_FLAME = mat('flame', '#ffcc66', .5, emit='#ffb347', strength=18)
flame = sphere('flame', .008, (CD.x, CD.y, .147), M_FLAME, scale=(1, 1, 2.6))
fl = bpy.data.lights.new('candleL', 'POINT'); fl.energy = 2.5; fl.color = rgb('#ffb060')[:3]; fl.shadow_soft_size = .01
flo = link(bpy.data.objects.new('candleL', fl)); flo.location = (CD.x, CD.y, .16)
SMOKE = [sphere('smoke%d' % i, .01, (0, 0, -5), mat('smoke%d' % i, '#9a9a9a', .9, alpha=.35, unique=True)) for i in range(7)]
def candle_state(t):
    te = VE('end:exec') - .35
    u = seg(t, te, te + .45)
    fz = 2.6 * (1 + .06 * math.sin(t * 13.1) + .04 * math.sin(t * 29.7))
    s = 1 - u; flame.scale = (max(.001, s), max(.001, s), max(.001, s * fz / 2.6))
    show(flame, s > .01); fl.energy = 2.5 * s
    for i, o in enumerate(SMOKE):
        d = te + .3 + .18 * i; w = lin(t, d, d + 2.2)
        if 0 < w < 1:
            o.location = (CD.x + .02 * math.sin(i * 1.7 + w * 4), CD.y + .01 * math.cos(i), .15 + .22 * w)
            r = 1 + 3 * w; o.scale = (r, r, r); show(o, True)
            principled(o.data.materials[0]).inputs['Alpha'].default_value = .35 * (1 - w)
        else: show(o, False)
def light_level(t):
    te = VE('end:exec') - .1; tb = S('next:weak') - .3
    return 1 - .8 * seg(t, te, te + 1.4) + .8 * seg(t, tb, tb + 1.3)

# ---------------- 挑戦のタイル ----------------
CH = Vector((.55, -.22, 0))
CHW = DATA['challenge'].split(' ')
CHT = []
for r, w in enumerate(CHW):
    for c, ch in enumerate(w):
        x = CH.x + (c - (len(w) - 1) / 2) * RPX; y = CH.y + .07 - r * .06
        CHT.append({'o': tile('ch%d_%d' % (r, c), ch, M_OR, ch, M_OR, (0, 0, -5)), 'pos': Vector((x, y, 0))})
QT = tile('chq', '?', M_BLUE, '?', M_BLUE, (0, 0, -5), ink_top=M_INKW, ink_bot=M_INKW)
QPOS = Vector((CH.x + 2.6 * RPX, CH.y + .01, 0))
def challenge_state(t):
    nd = ['エム', 'ワイ', 'イイ', 'エックス', 'ディイ', 'ディイ', 'アアル', 'オオ', 'ブイ', 'オオ', 'ディイ', 'ディイ', 'オオ', 'ビイ', 'スィイ']
    tm = TSEQ('ch:tiles', nd); assert len(tm) == len(CHT) == 15
    vis = t >= S('ch:tiles') - .1 and t < S('last:letter') + .5
    for x, d in zip(CHT, tm):
        u = seg(t, d - .05, d + .25); place_tile(x['o'], x['pos'], vis=vis and t >= d - .05, lift=.07 * (1 - u))
    dq = T('ch:next', 'カエサル'); u = seg(t, dq, dq + .3)
    place_tile(QT, QPOS, vis=vis and t >= dq, lift=.07 * (1 - u), spin=.3)

# ======================== 第5版で足した物 ========================
# ---------------- 置き時計（行9：針が 12 を過ぎて 1 へ） ----------------
CLK = Vector((-.02, .37, 0)); CLR = .072; CLZ = .032 + CLR
box('clockBase', (.12, .05, .024), (CLK.x, CLK.y + .004, .012), wood('clockW', '#9a6234', '#7b4a24', (1, 10, 1)), bevel=.004)
cyl('clockBody', CLR + .01, .045, (CLK.x, CLK.y, CLZ), wood('clockW', '#9a6234', '#7b4a24', (1, 10, 1)), rot=(math.pi / 2, 0, 0), verts=72)
torus('clockRim', CLR + .003, .0045, (CLK.x, CLK.y - .0228, CLZ), mat('brass', '#c9a44e', .3, metal=.8), rot=(math.pi / 2, 0, 0))
cface = plane('clockFace', 2 * CLR, 2 * CLR, (CLK.x, CLK.y - .0232, CLZ), imgmat('clockM', os.path.join(TEX, 'clock.png'), back='#fbf6ea', alpha=True))
cface.rotation_euler = (math.pi / 2, 0, 0)
chand = empty('clockHand', (CLK.x, CLK.y - .026, CLZ))
_hb = box('clockHandBar', (.007, .002, .052), (CLK.x, CLK.y - .026, CLZ + .022), mat('handInk', '#1b1410', .4), bevel=.001); parent(_hb, chand)
_ht = box('clockHandTip', (.012, .002, .012), (CLK.x, CLK.y - .026, CLZ + .046), mat('handInk', '#1b1410', .4), rot=(0, math.pi / 4, 0)); parent(_ht, chand)
cyl('clockCap', .006, .004, (CLK.x, CLK.y - .028, CLZ), mat('brass', '#c9a44e', .3, metal=.8), rot=(math.pi / 2, 0, 0))
def clock_hour(t):
    a12 = T('clock:tick', 'ジュウニオ'); a1 = T('clock:tick', 'イチニ')
    return 11 + back(lin(t, a12 - .35, a12 + .05)) * (t >= a12 - .35) + back(lin(t, a1 - .35, a1 + .05)) * (t >= a1 - .35)
def clock_state(t):
    h = clock_hour(t); chand.rotation_euler = (0, 2 * math.pi * h / 12, 0)
    return h
assert abs(math.sin(2 * math.pi * 3 / 12) - 1) < 1e-9   # 3時＝右（カメラは −y から +y を見る）

# ---------------- 枝分かれの木の模型（行20：26本 → 各25本 → 各24本 …） ----------------
TRc = Vector((.60, .22, 0)); TR_TOP = TRc + Vector((0, 0, .07))
cyl('treeBase', .05, .01, (TRc.x, TRc.y, .005), wood('treeBaseW', '#6b4426', '#5b3a22'))
trunk = cyl('treeTrunk', .006, .07, (TRc.x, TRc.y, .045), mat('trunk', '#6b4122', .6))
M_TW1 = mat('twig1', '#7a4a26', .6); M_TW2 = mat('twig2', '#a8743f', .6)
M_LEAF = mat('leafy', '#6fae5f', .7, alpha=.0, unique=True)
M_TRH = mat('treeHi', BLUE, .35, emit='#7fb2ff', strength=1.6)
N1, N2, N3 = DATA['choices'][:3]; assert (N1, N2, N3) == (26, 25, 24)
L1LEN, L2LEN, L3LEN = .10, .066, .03; HI1, HI2 = 12, 12
def th1(i): return math.radians(-78 + 156 * i / (N1 - 1))
def th2(i, j): return th1(i) + math.radians(2.8 * (j - (N2 - 1) / 2) / ((N2 - 1) / 2))
def th3(i, j, k): return th2(i, j) + math.radians(2.6 * (k - (N3 - 1) / 2) / ((N3 - 1) / 2))
def dvec(a): return Vector((math.sin(a), 0, math.cos(a)))
def tip1(i): return TR_TOP + L1LEN * dvec(th1(i))
def tip2(i, j): return tip1(i) + L2LEN * dvec(th2(i, j))
def ribbon(bm, p0, p1, w):
    d = (p1 - p0); 
    if d.length < 1e-6: return
    n = Vector((d.z, 0, -d.x)).normalized() * w / 2
    vs = [bm.verts.new(p0 - n), bm.verts.new(p1 - n), bm.verts.new(p1 + n), bm.verts.new(p0 + n)]
    bm.faces.new(vs)
tree_me = bpy.data.meshes.new('treeM'); tree_ob = link(bpy.data.objects.new('tree', tree_me)); put(tree_ob, M_TW2)
treeh_me = bpy.data.meshes.new('treeHM'); treeh_ob = link(bpy.data.objects.new('treeH', treeh_me)); put(treeh_ob, M_TRH)
# 3段目（26×25×24＝15600本）は一度だけ作り、色の濃さで出す
_v = []; _f = []
for i in range(N1):
    for j in range(N2):
        p0 = tip2(i, j)
        for k in range(N3):
            p1 = p0 + L3LEN * dvec(th3(i, j, k)); d = p1 - p0; n = Vector((d.z, 0, -d.x)).normalized() * .0004
            b = len(_v); _v += [tuple(p0 - n), tuple(p1 - n), tuple(p1 + n), tuple(p0 + n)]; _f.append((b, b + 1, b + 2, b + 3))
assert len(_f) == 26 * 25 * 24 == 15600
leaf_me = bpy.data.meshes.new('leafM'); leaf_me.from_pydata(_v, [], _f); leaf_ob = link(bpy.data.objects.new('treeL3', leaf_me)); put(leaf_ob, M_LEAF)
TREE_PARTS = [trunk, tree_ob, treeh_ob, leaf_ob] + [bpy.data.objects['treeBase']]
def tree_times():
    k = TSEQ('tree:mult', ['ヒトツノ', 'ツギノ', 'カケザンニ', 'ゼンブオ', 'ヤク'])
    return k
def tree_state(t):
    vis = S('tree:mult') - .4 <= t < S('sub:mary')
    for o in TREE_PARTS: show(o, vis)
    if not vis: return
    k = tree_times()
    u1 = seg(t, k[0] - .1, k[0] + 1.1); u2 = seg(t, k[1] - .1, k[1] + 1.6); u3 = seg(t, k[2] - .1, k[2] + 1.0)
    hi1 = seg(t, k[0] + 1.0, k[0] + 1.3); hi2 = seg(t, k[1] + 1.5, k[1] + 1.8); hi3 = seg(t, k[2] + .9, k[2] + 1.2)
    bm = bmesh.new(); bh = bmesh.new()
    for i in range(N1):
        a = TR_TOP; b = TR_TOP + L1LEN * u1 * dvec(th1(i))
        ribbon(bh if (i == HI1 and hi1 > .5) else bm, a, b, .0042)
        if u2 > 0:
            for j in range(N2):
                p0 = tip1(i); ribbon(bh if (i == HI1 and hi2 > .5) else bm, p0, p0 + L2LEN * u2 * dvec(th2(i, j)), .0013)
    if hi3 > .5:
        p0 = tip2(HI1, HI2)
        for kk in range(N3): ribbon(bh, p0, p0 + L3LEN * dvec(th3(HI1, HI2, kk)), .0008)
    bm.to_mesh(tree_me); bm.free(); bh.to_mesh(treeh_me); bh.free()
    principled(M_LEAF).inputs['Alpha'].default_value = .85 * u3
    show(leaf_ob, vis and u3 > .01)

# ---------------- 小さな人形6体と名札（行27・28：たとえ話） ----------------
DOLLS = DATA['dolls']; NICK = DATA['dollNick']; TALK = DATA['dollTalk']
DOLL_COL = ['#e07a5f', '#3d85c6', '#81b29a', '#f2b84b', '#9b5de5', '#43aa8b']
DOLL_POS = [Vector((.55 + (i - 2.5) * .085, -.07, 0)) for i in range(6)]
DOLL_ROOTS = []; DOLL_TAGS = []; BUBBLES = []
M_EYE = mat('eye', '#1b1410', .4); M_BUB = mat('bubble', '#ffffff', .4, emit='#ffffff', strength=.35)
for i, p in enumerate(DOLL_POS):
    r = empty('doll%d' % i, p)
    parts = [cyl('dBody%d' % i, .021, .056, (p.x, p.y, .028), mat('dollC%d' % i, DOLL_COL[i], .55), verts=32),
             sphere('dHead%d' % i, .02, (p.x, p.y, .075), M_SKIN),
             sphere('dHair%d' % i, .021, (p.x, p.y + .003, .081), mat('dollH%d' % i, ['#3b2416', '#1b1410', '#6b4426', '#2b1a10', '#4a2e1a', '#1b1410'][i], .6), scale=(1, 1, .62)),
             sphere('dEyeL%d' % i, .0028, (p.x - .007, p.y - .0185, .076), M_EYE), sphere('dEyeR%d' % i, .0028, (p.x + .007, p.y - .0185, .076), M_EYE)]
    for o in parts: parent(o, r)
    DOLL_ROOTS.append(r)
    DOLL_TAGS.append(tile('dtag%d' % i, DOLLS[i], M_WHITE, NICK[i], M_OR, (0, 0, -5), size=.036, tsize=.026))
    bs = []
    for k in range(TALK[i]):
        b = empty('bub%d_%d' % (i, k))
        e = sphere('bubE%d_%d' % (i, k), .017, (0, 0, 0), M_BUB, scale=(1.3, .32, .85)); parent(e, b)
        for d in (-1, 0, 1):
            o = sphere('bubD%d_%d_%d' % (i, k, d), .0026, (d * .008, -.006, 0), M_EYE); parent(o, b)
        bs.append(b)
    BUBBLES.append(bs)
TAG_ORDER = [2, 0, 4, 1, 5, 3]
def bubble_plan():
    """吹き出しの出る時刻：一番よくしゃべる人形（E → あだ名 X）は 7個、ほかは 1〜2個（たとえ）"""
    a = T('doll:talk', 'イチバン'); b = T('doll:talk', 'シャベリマス', end=True)
    plan = {}
    for i in range(6):
        n = TALK[i]
        if i == 4: plan[i] = [a + (b - a) * k / (n - 1) for k in range(n)]
        else: plan[i] = [a + .4 + (b - a - .4) * (k + .3 + .17 * i) / (n + .6) for k in range(n)]
    return plan
BPLAN = None
def dolls_state(t):
    global BPLAN
    if BPLAN is None: BPLAN = bubble_plan()
    a0 = S('doll:tag') - .6; gone = S('e3:same') + .1
    vis = a0 <= t < gone + .7
    ft = T('doll:tag', 'ツケカエタト') - .2
    for i, r in enumerate(DOLL_ROOTS):
        d = a0 + .07 * i; u = seg(t, d, d + .35); out = seg(t, gone + .04 * i, gone + .04 * i + .5)
        show_tree(r, vis and t >= d)
        fi = ft + .2 * TAG_ORDER.index(i); fl = lin(t, fi, fi + .4)
        r.location = DOLL_POS[i] + Vector((0, .5 * out, .06 * (1 - u) + hop(fl, .012) * (0 < fl < 1)))
        place_tile(DOLL_TAGS[i], DOLL_POS[i] + Vector((0, -.075 + .5 * out, 0)), flip=fl, vis=vis and t >= d, lift=.05 * (1 - u))
        for k, b in enumerate(BUBBLES[i]):
            tb = BPLAN[i][k]; w = lin(t, tb, tb + .3); show_tree(b, vis and t >= tb and out < .5)
            sc = back(w) * (1 - out); b.scale = (sc, sc, sc)
            if i == 4: off = Vector((.03 * math.sin(k * 2.3), -.004, .112 + .028 * k))
            else: off = Vector((.026, -.004, .112 + .03 * k))
            b.location = DOLL_POS[i] + off + Vector((0, .5 * out, 0))
DHEAD = [p + Vector((0, 0, .1)) for p in DOLL_POS]

# ---------------- E のタイル3枚 → X（行29・30：具体例） ----------------
E3T = [tile('e3t%d' % i, 'E', M_WHITE, 'X', M_OR, (0, 0, -5)) for i in range(3)]
E3W = [tile('e3w%d' % i, 'E', M_WHITE, 'E', M_WHITE, (0, 0, -5)) for i in range(3)]
E3_POS = [Vector((.48 + .07 * i, -.21, 0)) for i in range(3)]
E3_STK_O = Vector((.595, -.08, 0)); E3_STK_W = Vector((.505, -.08, 0))
assert DATA['sub'][ABC.index('E')] == 'X'
def e3_state(t):
    a0 = T('e3:three', 'イイガ'); gone = S('tw:pair') + .1
    vis = a0 - .3 <= t < gone + .6
    ft = T('e3:flip', 'ミッツノ', occ=1) - .15; st = T('e3:flip', 'カズワ') - .1
    for i in range(3):
        d = a0 - .2 + .18 * i; u = seg(t, d, d + .3); f = lin(t, ft + .32 * i, ft + .32 * i + .4)
        w = lin(t, st + .25 * i, st + .25 * i + .45)
        p = E3_POS[i].lerp(E3_STK_O + Vector((0, 0, TT * i)), sm(w)) + Vector((0, 0, hop(w, .05) * (0 < w < 1)))
        out = seg(t, gone + .05 * i, gone + .05 * i + .5)
        place_tile(E3T[i], p + Vector((0, .6 * out, 0)), flip=f, vis=vis and t >= d, lift=.06 * (1 - u))
        dw = st + .25 * i + .1; uw = seg(t, dw, dw + .35)
        place_tile(E3W[i], E3_STK_W + Vector((0, .6 * out, TT * i)), vis=vis and t >= dw, lift=.07 * (1 - uw))

# ---------------- 白の塔の列（元の文）と、橙の塔の列（暗号文）（行31〜33） ----------------
SLAB2 = .0030; PW_Y = .20; PO_Y = -.14
PCNT = DATA['plainCnt']; ENP = DATA['enPct']
M_SLW = mat('slabW', '#f6f2e8', .5)
M_SLWX = {}
PWC = []; POC = []; PWB = []; POB = []
for i in range(26):
    m = M_SLW
    if ABC[i] in 'ET': m = mat('slabW_' + ABC[i], '#f6f2e8', .5, emit='#fff3c4', strength=0, unique=True); M_SLWX[ABC[i]] = m
    o = box('pw%d' % i, (.022, .022, SLAB2 * .86), (tw_x(i), PW_Y, SLAB2 / 2), m, bevel=.0007)
    ar = o.modifiers.new('arr', 'ARRAY'); ar.use_relative_offset = False; ar.use_constant_offset = True; ar.constant_offset_displace = (0, 0, SLAB2); ar.count = 1; PWC.append(o)
    o = box('po%d' % i, (.022, .022, SLAB2 * .86), (tw_x(i), PO_Y, SLAB2 / 2), M_SLAB, bevel=.0007)
    ar = o.modifiers.new('arr', 'ARRAY'); ar.use_relative_offset = False; ar.use_constant_offset = True; ar.constant_offset_displace = (0, 0, SLAB2); ar.count = 1; POC.append(o)
    PWB.append(tile('pwb%d' % i, ABC[i], M_WHITE, ABC[i], M_WHITE, (0, 0, -5), size=.025, tsize=.019))
    POB.append(tile('pob%d' % i, SUB[i], M_OR, SUB[i], M_OR, (0, 0, -5), size=.025, tsize=.019))
def pairs_counts(t):
    """(白の各列の板の数, 橙の各列の板の数, 白の見える?, 橙の見える?)。橙の列 i は、白の平文 i の行き先 SUB[i] の数（＝同じ）"""
    g0 = S('tw:pair') + .2; g1 = T('tw:pair', 'モジノ') + .3
    u = seg(t, g0, g1)
    e0 = T('tw:en', 'エイゴノ'); v = seg(t, e0, e0 + 1.3)
    s0 = S('tower:grow') - .1; w = seg(t, s0, s0 + .7)
    white = [round((PCNT[i] * (1 - v) + ENP[i] / 100 * 541 * v) * u * (1 - w)) for i in range(26)]
    orange = [round(DATA['tower'][ABC.index(SUB[i])] * u * (1 - v)) for i in range(26)]
    return white, orange, S('tw:pair') - .2 <= t < s0 + .8, S('tw:pair') - .2 <= t < e0 + 1.4
assert all(DATA['tower'][ABC.index(SUB[i])] == PCNT[i] for i in range(26))
def pairs_state(t):
    white, orange, vw, vo = pairs_counts(t)
    for i in range(26):
        show(PWC[i], vw and white[i] > 0); PWC[i].modifiers['arr'].count = max(1, white[i])
        show(POC[i], vo and orange[i] > 0); POC[i].modifiers['arr'].count = max(1, orange[i])
        d = S('tw:pair') + .02 * i
        place_tile(PWB[i], Vector((tw_x(i), PW_Y - .032, 0)), vis=vw and t >= d)
        place_tile(POB[i], Vector((tw_x(i), PO_Y - .032, 0)), vis=vo and t >= d)
    ge = seg(t, T('tw:en', 'ジュウサン') - .1, T('tw:en', 'ジュウサン') + .3); gt = seg(t, T('tw:en', 'キュウ') - .1, T('tw:en', 'キュウ') + .3)
    off = 1 - seg(t, S('dice:short'), S('dice:short') + .5)
    set_emit(M_SLWX['E'], 1.2 * ge * off); set_emit(M_SLWX['T'], 1.2 * gt * off)
    return white, orange

# ---------------- サイコロ（行34：数回では かたよりは 分からない） ----------------
DIE_S = .032
die = empty('die')
_dm = mat('dieW', '#fbf8f0', .35)
_db = box('dieBody', (DIE_S, DIE_S, DIE_S), (0, 0, 0), _dm, bevel=.004); parent(_db, die)
PIPS = {1: [(0, 0)], 2: [(-1, -1), (1, 1)], 3: [(-1, -1), (0, 0), (1, 1)], 4: [(-1, -1), (-1, 1), (1, -1), (1, 1)],
        5: [(-1, -1), (-1, 1), (0, 0), (1, -1), (1, 1)], 6: [(-1, -1), (-1, 0), (-1, 1), (1, -1), (1, 0), (1, 1)]}
FACE_N = {1: Vector((0, 0, 1)), 6: Vector((0, 0, -1)), 2: Vector((0, 1, 0)), 5: Vector((0, -1, 0)), 3: Vector((1, 0, 0)), 4: Vector((-1, 0, 0))}
M_PIP = mat('pip', '#1b1410', .4); M_PIP1 = mat('pip1', '#b3261e', .4)
for v, pts in PIPS.items():
    n = FACE_N[v]; a = Vector((n.y, n.z, n.x)) if abs(n.z) < .5 else Vector((1, 0, 0)); b = n.cross(a)
    for (x, y) in pts:
        p = n * DIE_S / 2 + (a * x + b * y) * DIE_S * .26
        o = sphere('pip%d_%d_%d' % (v, x, y), .0036 if v != 1 else .0055, tuple(p), M_PIP1 if v == 1 else M_PIP, scale=(1, 1, 1)); parent(o, die)
from mathutils import Quaternion
def q_top(v, yaw):
    n = FACE_N[v]; q = n.rotation_difference(Vector((0, 0, 1)))
    return Quaternion((0, 0, 1), yaw) @ q
for v in range(1, 7): assert (q_top(v, .7) @ FACE_N[v] - Vector((0, 0, 1))).length < 1e-6
ROLLS = DATA['dice']; DIE_LAND = [Vector((.40 + .07 * k, -.32, DIE_S / 2)) for k in range(len(ROLLS))]
def dice_times():
    a = T('dice:roll', 'サイコロオ'); b = T('dice:roll', 'カタヨリガ') + .2
    d = .62; return [a + (b - a - d) * k / (len(ROLLS) - 1) for k in range(len(ROLLS))], d
def dice_state(t):
    ts, d = dice_times(); a0 = ts[0] - .5; gone = S('dice:long') + .1
    vis = a0 <= t < gone + .8; show_tree(die, vis)
    if not vis: die.location = (0, 0, -5); return None
    pos = DIE_LAND[0] + Vector((-.12, -.05, .12)); q = q_top(2, .3); landed = 0
    start = pos.copy(); qs = q.copy()
    for k, tk in enumerate(ts):
        qt = q_top(ROLLS[k], .5 + 1.3 * k); p_end = DIE_LAND[k]
        if t < tk: break
        u = lin(t, tk, tk + d)
        axis = Vector((-(p_end - start).y, (p_end - start).x, 0)).normalized() if (p_end - start).length > 1e-6 else Vector((1, 0, 0))
        qq = Quaternion(axis, 2 * math.pi * 2 * sm(u)) @ qs.slerp(qt, sm(u))
        pos = start.lerp(p_end, u) + Vector((0, 0, hop(u, .06)))
        q = qq
        if u >= 1: landed = k + 1; start = p_end; qs = qt
    if t >= gone: w = lin(t, gone, gone + .7); pos = pos.lerp(Vector((1.2, -.3, .02)), sm(w)) + Vector((0, 0, hop(w, .05)))
    die.location = pos; die.rotation_mode = 'QUATERNION'; die.rotation_quaternion = q
    return landed
# ---------------- 541文字の暗号文の紙（行34「長い文」、行39：JVX が 14か所 光る） ----------------
SH = DATA['sheet']; SHW = .36; SHH = SHW * SH['H'] / SH['W']; SHC = Vector((.55, -.31, 0))
def sheet_mat():
    m = bpy.data.materials.new('sheetM'); m.use_nodes = True; nt = m.node_tree; p = principled(m)
    tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(os.path.join(TEX, 'sheet.png')); tx.interpolation = 'Cubic'
    mk = nt.nodes.new('ShaderNodeTexImage'); mk.image = bpy.data.images.load(os.path.join(TEX, 'sheetMask.png')); mk.interpolation = 'Closest'
    try: mk.image.colorspace_settings.name = 'Non-Color'
    except Exception: pass
    sp = nt.nodes.new('ShaderNodeSeparateColor'); nt.links.new(mk.outputs['Color'], sp.inputs['Color'])
    m16 = nt.nodes.new('ShaderNodeMath'); m16.operation = 'MULTIPLY'; m16.inputs[1].default_value = 16.0; nt.links.new(sp.outputs[0], m16.inputs[0])
    hv = nt.nodes.new('ShaderNodeValue'); hv.name = 'hl'; hv.outputs[0].default_value = 0.0
    lt = nt.nodes.new('ShaderNodeMath'); lt.operation = 'LESS_THAN'; nt.links.new(m16.outputs[0], lt.inputs[0]); nt.links.new(hv.outputs[0], lt.inputs[1])
    gt = nt.nodes.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = .5; nt.links.new(m16.outputs[0], gt.inputs[0])
    on = nt.nodes.new('ShaderNodeMath'); on.operation = 'MULTIPLY'; nt.links.new(lt.outputs[0], on.inputs[0]); nt.links.new(gt.outputs[0], on.inputs[1])
    mix = nt.nodes.new('ShaderNodeMixRGB'); mix.inputs['Color2'].default_value = rgb('#ffd23f'); nt.links.new(on.outputs[0], mix.inputs['Fac']); nt.links.new(tx.outputs['Color'], mix.inputs['Color1'])
    nt.links.new(mix.outputs['Color'], p.inputs['Base Color']); p.inputs['Roughness'].default_value = .8
    p.inputs['Emission Color'].default_value = rgb('#ffcf4a'); es = nt.nodes.new('ShaderNodeMath'); es.operation = 'MULTIPLY'; es.inputs[1].default_value = 1.6
    nt.links.new(on.outputs[0], es.inputs[0]); nt.links.new(es.outputs[0], p.inputs['Emission Strength'])
    uv = nt.nodes.new('ShaderNodeTexCoord'); su = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(uv.outputs['UV'], su.inputs['Vector'])
    rv = nt.nodes.new('ShaderNodeValue'); rv.name = 'reveal'; rv.outputs[0].default_value = 1.0
    one = nt.nodes.new('ShaderNodeMath'); one.operation = 'SUBTRACT'; one.inputs[0].default_value = 1.0; nt.links.new(rv.outputs[0], one.inputs[1])
    gv = nt.nodes.new('ShaderNodeMath'); gv.operation = 'GREATER_THAN'; nt.links.new(su.outputs['Y'], gv.inputs[0]); nt.links.new(one.outputs[0], gv.inputs[1])
    nt.links.new(gv.outputs[0], p.inputs['Alpha'])
    try: m.surface_render_method = 'BLENDED'
    except Exception: pass
    return m
M_SHEET = sheet_mat()
sheet = plane('sheet', SHW, SHH, (SHC.x, SHC.y, .0009), M_SHEET)
sroll = cyl('sheetRoll', .008, SHW + .006, (0, 0, -5), mat('rollPaper', '#efe2c4', .8), rot=(0, math.pi / 2, 0))
def jvx_lit(t):
    a = T('logic:fact', 'サガスト'); b = T('logic:fact', 'デテ')
    return 0 if t < a else min(14, 1 + int(14 * (t - a) / (b - a)))
def sheet_state(t):
    a = S('dice:long') + .2; b = T('dice:long', 'カゾエマス'); gone = S('rows:fill') - .3
    vis = a <= t < gone; show(sheet, vis)
    r = seg(t, a, b)
    M_SHEET.node_tree.nodes['reveal'].outputs[0].default_value = r
    n = jvx_lit(t) if t < S('rows:fill') else 0
    M_SHEET.node_tree.nodes['hl'].outputs[0].default_value = n + .5 if n else 0.0
    if vis and r < 1:
        y = SHC.y + SHH / 2 - SHH * r; sroll.location = (SHC.x, y, .009); show(sroll, True)
    else: show(sroll, False); sroll.location = (0, 0, -5)
    return n
def jvx_xy(k):
    r, c = DATA['jvxPos'][k]
    u = (SH['px'] + (c + 1.5) * SH['cw']) / SH['W']; v = (SH['py'] + (r + .5) * SH['lh']) / SH['H']
    return Vector((SHC.x - SHW / 2 + SHW * u, SHC.y + SHH / 2 - SHH * v, .001))

# ---------------- カメラ ----------------
CAM_D = bpy.data.cameras.new('cam'); CAM_D.lens = 40; CAM_D.sensor_fit = 'AUTO'; CAM_D.clip_start = .01; CAM_D.clip_end = 30
CAM_D.dof.use_dof = True; CAM_D.dof.aperture_fstop = 2.8; CAM_D.shift_y = -.06
CAM = link(bpy.data.objects.new('cam', CAM_D)); SC.camera = CAM
LTc = LT + Vector((0, 0, .0)); SEAL0 = Vector((LT.x, LT.y - LH / 2 + .02, .004))
DKc = DK + Vector((0, 0, .02)); CTc = Vector((DK.x, -.43, .01)); TBc = TB + Vector((0, -.03, .01)); BKc = BK + Vector((0, 0, .03))
TWc = TWC + Vector((0, 0, .09)); RWc = RW + Vector((0, 0, .01)); CDc = CD + Vector((0, 0, .11)); CHc = CH + Vector((0, 0, .01))
BDc = BD + Vector((0, 0, .075)); BRc = BR + Vector((0, 0, .10)); BUc = BUNG + Vector((0, 0, .02))
XTOP = Vector((tw_x(ABC.index('X')), TWC.y, SLAB * 70)); JTOP = Vector((tw_x(ABC.index('J')), TWC.y, SLAB * 60))
PSc = Vector((LT.x, PS_Y, .001))
# 第5版のカメラ：「止める（同じ姿勢の2点）」「動く（違う姿勢の2点を、ゆっくり始めてゆっくり止める）」「切る（cut）」の並び。
# 姿勢 P＝(見る点, 距離, 方位°, 仰角°, レンズ)。続けて動く点（連なり）は、その間を滑らかにつなぎ（端は止まる）、止める所では1画素も動かない。
def P(tgt, d, az, el, lens=40): return (float(tgt[0]), float(tgt[1]), float(tgt[2]), float(d), float(az), float(el), float(lens))
DISKTOP = P((DK.x, -.29, 0), .76, 0, 82, 40)
P_OPEN = [P(SEAL0 + Vector((0, .02, 0)), .30, -8, 40, 50), P(LTc + Vector((0, -.05, 0)), .42, 0, 55, 45), P(LTc, .55, 10, 62, 40)]
P_BARREL = P(BR + Vector((0, 0, .13)), .52, 8, 30, 42)
P_BOARD = P(BDc, .66, 0, 14, 45)
P_DISKW = P(DKc + Vector((0, -.06, 0)), .66, 15, 48, 40)
P_DISKZ = P(outer_xy('Z') + Vector((0, -.04, 0)), .34, -8, 62, 45)
P_CLOCK = P((CLK.x, CLK.y, CLZ - .005), .42, 0, 6, 45)
P_DISK34 = P((DK.x, -.27, 0), .64, 16, 56, 40)
P_SPIN = P(DKc, .38, 0, 72, 45)
P_CATT = P((DK.x, -.33, .01), .56, -8, 55, 40)
P_TABW = P(TBc, .95, 0, 62, 35)
P_TABF = P((TB.x, -.24, .05), 1.05, 0, 44, 38)
P_TREE = P((TRc.x, TRc.y, .17), .62, 0, 10, 40)
P_SCRW = P((S0.x, -.8, -.30), 1.75, -25, 12, 30)
P_LETTAB = P((.33, -.24, 0), 1.35, 0, 58, 35)
P_BOOK = P((BK.x - .06, BK.y, .03), .52, 0, 64, 45)
P_DOLLS = P((.55, -.10, .08), .80, 0, 20, 38)
P_E3 = P((.55, -.15, .02), .50, 0, 38, 40)
P_PAIRS = P((.55, .03, .08), 1.25, 0, 45, 35)
P_DICE = P((.55, -.30, .02), .62, 0, 38, 40)
P_SHEET = P((.55, -.30, 0), .78, 0, 70, 40)
P_TWX = P(XTOP + Vector((0, 0, -.03)), .50, 30, 20, 42)
P_LOGIC = P((.655, .0, .13), .88, 0, 22, 38)
P_LOGIC2 = P((.55, -.40, 0), 1.05, 0, 80, 40)
P_ROWS1 = P(RWc, 1.0, -10, 60, 40); P_ROWS2 = P(RWc, 1.02, 8, 66, 39)
P_BOARD2 = P(BDc, .70, -12, 34, 45)
P_SCRBACK = P((S0.x, -.72, -.36), 1.45, -58, 14, 30)
P_BARREL2 = P(BRc, .55, 20, 30, 40)
P_HANDOFF = P((-.38, .12, .10), .62, 0, 28, 40)
P_LET = P(LTc, .46, 0, 58, 45)
P_GTW = P(TWc, .72, -10, 28, 36)
P_PS = P(PSc + Vector((0, .05, 0)), .36, 0, 58, 48)
P_CANDLE = P(CDc, .40, -5, 14, 47)
P_LETW = P(LTc, .70, -10, 45, 35)
P_BOARD3 = P(BDc, .66, 5, 16, 45)
P_CH = P(CHc, .68, 0, 70, 40)
P_LAST = P(LTc, .58, 5, 58, 40)
def cam_keys():
    k = []
    def at(t, pose, cut=False): k.append({'t': float(t), 'pose': pose, 'cut': cut})
    def hold(t0, t1, pose): at(t0, pose); at(t1, pose)
    # 行1・2：冒頭（手が封を切る）＝動く → ミオの顔の間は止める
    at(0, P_OPEN[0]); at(1.2, P_OPEN[1]); at(2.7, P_OPEN[2]); at(S('barrel:mary'), P_OPEN[2])
    # 行3：たるへ（動く→止まる）
    at(S('barrel:mary') + 1.5, P_BARREL); at(E('barrel:mary'), P_BARREL)
    # 行4：得点板（切る・止める）
    at(S('barrel:board'), P_BOARD, cut=True); at(S('disk:rome'), P_BOARD)
    # 行5：円板へ（動く）
    at(S('disk:rome') + 2.0, P_DISKW); at(S('disk:ad') - .1, P_DISKW)
    # 行6・7：真上から止める（指とタイルで見せる）
    at(S('disk:ad') + .9, DISKTOP); at(S('disk:z'), DISKTOP)
    # 行8：Z に寄る（動く）
    at(S('disk:z') + 1.3, P_DISKZ); at(S('clock:tick'), P_DISKZ)
    # 行9：置き時計（切る・止める）
    at(S('clock:tick'), P_CLOCK, cut=True); at(S('ring:loop'), P_CLOCK)
    # 行10・11：円板へ切り替え（切る・止める）
    at(S('ring:loop'), DISKTOP, cut=True); at(S('disk:mio'), DISKTOP)
    # 行12・13：斜めから（動いて、止める。内の円板がひと回り）
    at(S('disk:mio') + 1.4, P_DISK34); at(S('disk:spin'), P_DISK34)
    # 行14：猛スピード回転（動く・笑い）→ CAT のタイル
    at(S('disk:spin') + .9, P_SPIN); at(S('disk:three'), P_SPIN)
    at(S('disk:three') + 1.0, P_CATT); at(S('sub:shuffle'), P_CATT)
    # 行16：表のシャッフル（動く）
    at(S('sub:shuffle') + 1.6, P_TABW); at(S('sub:ex') - .1, P_TABW)
    # 行17〜19：表の前で止める（タイル、線）
    at(S('sub:ex') + 1.0, P_TABF); at(VE('tab:z') + .1, P_TABF)
    # 行20：枝分かれの木（動いて、止める）
    at(S('tree:mult') + .4, P_TREE); at(S('scroll:years'), P_TREE)
    # 行21：巻物が床まで（動く・笑い）
    kk = TSEQ('scroll:years', ['タメシテモ', 'ゼンブオ', 'センサンビャクマンネン'])
    at(S('scroll:years') + .9, P(S0 + Vector((0, -.08, 0)), .45, -30, 40, 45))
    at(kk[0], P((S0.x, -.42, 0), .45, -15, 45, 45))
    at(kk[1] + .6, P((S0.x, -.68, -.28), .80, -8, 18, 35))
    at(kk[2], P((S0.x, -1.35, -.74), .55, 0, 40, 40))
    at(VE('scroll:years') + .2, P((S0.x, -1.45, -.74), .48, 5, 50, 45))
    at(S('scroll:mio') + .9, P_SCRW); at(S('sub:mary'), P_SCRW)
    # 行23・24：記号の手紙と表（切る・止める）。一時停止の問いも止めたまま
    at(S('sub:mary'), P_LETTAB, cut=True); at(S('book:kindi'), P_LETTAB)
    # 行25：本が開く（動く→止める）
    at(S('book:kindi') + 1.6, P_BOOK); at(S('doll:tag') - .3, P_BOOK)
    # 行27・28：人形（動いて、止める）
    at(S('doll:tag') + 1.1, P_DOLLS); at(S('e3:same'), P_DOLLS)
    # 行29・30：E のタイル（止める）
    at(S('e3:same') + 1.1, P_E3); at(S('tw:pair'), P_E3)
    # 行31〜33：白と橙の塔の列（止める）
    at(S('tw:pair') + 1.3, P_PAIRS); at(S('dice:roll') - .5, P_PAIRS)
    # 行34：サイコロ（寄る）→ 長い文の紙
    at(S('dice:roll') + .5, P_DICE); at(S('dice:long'), P_DICE)
    at(S('dice:long') + 1.2, P_SHEET); at(S('tower:grow'), P_SHEET)
    # 行35：塔が立つ（動く）
    at(S('tower:grow') + 2.2, P(TWc, .88, -25, 30, 35))
    at(S('tower:grow') + 4.8, P(TWc + Vector((-.15, 0, -.02)), .58, -36, 16, 40))
    at(VE('tower:grow') + .7, P(TWc + Vector((.08, 0, 0)), .62, 14, 18, 40))
    # 行36：X の塔が光る（止める）
    at(S('tower:e') + .9, P_TWX); at(S('logic:check'), P_TWX)
    # 行37〜39：論理の筋（止める）
    at(S('logic:check') + 1.2, P_LOGIC); at(S('logic:if'), P_LOGIC)
    at(S('logic:if') + 1.3, P_LOGIC2); at(S('rows:fill'), P_LOGIC2)
    # 行40：橙が白に（動く・音楽）
    at(S('rows:fill') + 1.2, P_ROWS1); at(VE('rows:fill') + 1.2, P_ROWS2); at(S('rows:done'), P_ROWS2)
    # 行41：得点板（切る）、行42：巻物が巻き戻る（切る・止める）
    at(S('rows:done'), P_BOARD2, cut=True); at(S('scroll:back'), P_BOARD2)
    at(S('scroll:back'), P_SCRBACK, cut=True); at(S('end:pass'), P_SCRBACK)
    # 行43〜50：結末（第4版の物の動き。カメラは移る時だけ動く）
    at(S('end:pass') + 1.4, P_BARREL2); at(T('end:pass', 'ハコビヤクオ') - .2, P_BARREL2)
    at(T('end:pass', 'ウォルシンガムノ') + .3, P_HANDOFF); at(S('end:phel'), P_HANDOFF)
    at(S('end:phel') + 1.2, P_LET); at(T('end:phel', 'キゴオノ') - .4, P_LET)
    at(T('end:phel', 'キゴオノ') + .9, P_GTW); at(S('end:ps'), P_GTW)
    at(S('end:ps') + 1.2, P_PS); at(S('end:exec'), P_PS)
    at(S('end:exec'), P_CANDLE, cut=True); at(S('end:mio'), P_CANDLE)
    at(S('end:mio') + 2.0, P_LETW); at(S('next:weak'), P_LETW)
    at(S('next:weak') + 1.2, P_BOARD3); at(S('ch:tiles'), P_BOARD3)
    at(S('ch:tiles') + 1.2, P_CH); at(S('last:letter'), P_CH)
    at(S('last:letter') + 1.6, P_LAST); at(DUR + .5, P_LAST)
    for a, b in zip(k, k[1:]): assert b['t'] >= a['t'] - 1e-9, (a['t'], b['t'], a['pose'], b['pose'])
    return k
KEYS = cam_keys()
def _chain_pose(i, t):
    """KEYS[i]→KEYS[i+1] が動く区間。前後に続けて動く点があれば、その連なりを滑らかに（端は止まる）"""
    a = i
    while a > 0 and not KEYS[a]['cut'] and KEYS[a - 1]['pose'] != KEYS[a]['pose'] and KEYS[a]['t'] > KEYS[a - 1]['t']: a -= 1
    b = i + 1
    while b < len(KEYS) - 1 and not KEYS[b + 1]['cut'] and KEYS[b + 1]['pose'] != KEYS[b]['pose'] and KEYS[b + 1]['t'] > KEYS[b]['t']: b += 1
    ts = [KEYS[j]['t'] for j in range(a, b + 1)]; out = []
    for c in range(7):
        vs = [KEYS[j]['pose'][c] for j in range(a, b + 1)]; n = len(ts)
        def m(j):
            if j == 0 or j == n - 1: return 0.0
            return (vs[j + 1] - vs[j - 1]) / (ts[j + 1] - ts[j - 1])
        j = i - a; h = ts[j + 1] - ts[j]; u = (t - ts[j]) / h
        h00 = 2 * u ** 3 - 3 * u ** 2 + 1; h10 = u ** 3 - 2 * u ** 2 + u; h01 = -2 * u ** 3 + 3 * u ** 2; h11 = u ** 3 - u ** 2
        out.append(h00 * vs[j] + h10 * h * m(j) + h01 * vs[j + 1] + h11 * h * m(j + 1))
    return tuple(out)
def raw_pose(t):
    """(姿勢, 動いている?)"""
    if t <= KEYS[0]['t']: return KEYS[0]['pose'], False
    for i in range(len(KEYS) - 1):
        a, b = KEYS[i], KEYS[i + 1]
        if a['t'] <= t < b['t']:
            if b['cut'] or a['pose'] == b['pose']: return a['pose'], False
            return _chain_pose(i, t), True
    return KEYS[-1]['pose'], False
def shaking(t):
    a, b = S('disk:spin') + .45, VE('disk:spin') + .25
    return a < t < b
def cam_pose(t):
    pose, moving = raw_pose(t)
    x, y, z, d, az, el, lens = pose
    tgt = Vector((x, y, z))
    az = math.radians(az); el = math.radians(clamp(el, 3, 85)); d = max(.12, d)
    pos = tgt + d * Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
    # 行14：円板を猛スピードで回す間、画面が小さく揺れる（笑い）
    if shaking(t):
        a, b = S('disk:spin') + .45, VE('disk:spin') + .25
        s = .006 * math.sin(math.pi * (t - a) / (b - a))
        pos += Vector((s * math.sin(t * 71), s * math.cos(t * 53), s * .5 * math.sin(t * 97)))
    return pos, tgt, lens * .78, d
def camera_motion():
    """動いている時間（コマ）の割合。止めている所は姿勢が前のコマと全く同じ"""
    mv = []; prev = None
    for j in range(NF):
        t = j / FPS; pose, moving = raw_pose(t); m = (prev is not None and pose != prev) or shaking(t)
        mv.append(1 if m else 0); prev = pose
    spans = []; i = 0
    while i < NF:
        if mv[i]:
            j = i
            while j < NF and mv[j]: j += 1
            spans.append((round(i / FPS, 2), round(j / FPS, 2))); i = j
        else: i += 1
    return {'frames': NF, 'moving_frames': sum(mv), 'moving_ratio': round(sum(mv) / NF, 4), 'moving_spans': spans, 'cuts': [round(k['t'], 2) for k in KEYS if k['cut']]}
def set_camera(t):
    pos, tgt, lens, d = cam_pose(t)
    CAM.location = pos; CAM.rotation_euler = (tgt - pos).to_track_quat('-Z', 'Y').to_euler()
    CAM_D.lens = lens; CAM_D.dof.focus_distance = (tgt - pos).length
    CAM_D.dof.aperture_fstop = 2.0 + 2.2 * clamp((d - .3) / 1.2)
    # 床まで降りる巻物の場面は、床の高さまで来ても机の下に入らないように
    return pos, tgt

# ---------------- 1コマの状態 ----------------
def hands(t):
    # 行1：カイの手が封を押し、上の半分を持ち上げて開く（0秒から動いている）
    ang = math.pi * (1 - seg(t, .7, 1.95))
    if t < 2.8:
        if t < .7: tip = SEAL0 + Vector((0, -.012 + .012 * sm(t / .5), .004 - .002 * sm(t / .5)))
        elif t < 1.95: tip = letter_tip(ang) + Vector((0, -.006, .006))
        else: tip = vlerp(letter_tip(0) + Vector((0, -.006, .006)), Vector((.55, -.35, .2)), sm((t - 1.95) / .85))
        set_hand('kai', tip, 75, -30 if t < .7 else -15)
    else:
        # 第5版 行6・7・10：カイの指が外の輪を1目盛りずつ進む／行11・13：内の円板のつまみを回す
        fp, _ = finger_state(t)
        knob_spans = [(T('disk:turn', 'サンメモリ'), T('disk:turn', 'オクト', end=True) + .3), (T('disk:25', 'ニジュウロクメモリ'), T('disk:25', 'モドッテ', end=True))]
        ks = next(((a, b) for a, b in knob_spans if a - .6 <= t <= b + .7), None)
        if fp is not None:
            # 指は輪の外から、その文字を指す（手で文字を隠さない）：指先は文字の外側（半径 .15）、向きは中心へ
            p, a = fp; set_hand('kai', p, math.degrees(a) + 90, -28)
        elif ks:
            a, b = ks
            r = disk_rot(t); ang_k = ang_of(r); kp = Vector((DK.x + .05 * math.cos(ang_k), DK.y + .05 * math.sin(ang_k), .036))
            if t < a: tip = vlerp(Vector((DK.x + .05, DK.y - .55, .2)), kp, sm((t - (a - .6)) / .6))
            elif t > b: tip = vlerp(kp, Vector((DK.x + .2, DK.y - .5, .2)), sm((t - b) / .7))
            else: tip = kp
            set_hand('kai', tip, 60, -32)
        else: set_hand('kai', (0, 0, 0), vis=False)
    # 行9：ミオの手（桃色の袖）が、猛スピードで回し、1目盛りずつ戻す
    a = S('disk:spin') + .1; b = E('disk:three') - .3
    if a <= t <= b + .8:
        r = disk_rot(t); ang_k = ang_of(r); kp = Vector((DK.x + .05 * math.cos(ang_k), DK.y + .05 * math.sin(ang_k), .036))
        if t < a + .35: tip = vlerp(Vector((DK.x + .45, -.30, .2)), kp, sm((t - a) / .35))
        elif t > b: tip = vlerp(kp, Vector((DK.x + .5, -.4, .2)), sm((t - b) / .8))
        else: tip = kp
        set_hand('mio', tip, 70, -35)
    else: set_hand('mio', (0, 0, 0), vis=False)
    # 行24：運び役の手（茶）が たるの手紙を取り、ウォルシンガムの手（黒）に渡す
    tg = T('end:pass', 'ハコビヤクオ'); tw = T('end:pass', 'ウォルシンガムノ'); tend = VE('end:pass') + .5
    up = NOTE_UP + Vector((0, 0, .025)); mid = Vector((-.40, .10, .12))
    note_pos = None
    if tg - .8 <= t <= tw + .4:
        if t < tg: tip = vlerp(Vector((-.95, -.4, .25)), up, sm((t - (tg - .8)) / .8))
        else: tip = vlerp(up, mid, sm((t - tg) / max(.1, tw - .2 - tg))); note_pos = tip + Vector((0, -.01, -.03)) if t > tg + .1 else None
        if t > tw: tip = vlerp(mid, Vector((-.95, -.5, .3)), sm((t - tw) / .4)); note_pos = None
        set_hand('cour', tip, -50, -10)
    else: set_hand('cour', (0, 0, 0), vis=False)
    if tw - .9 <= t <= tend + .6:
        if t < tw: tip = vlerp(Vector((.4, .3, .3)), mid + Vector((.03, 0, .01)), sm((t - (tw - .9)) / .9))
        else: tip = vlerp(mid + Vector((.03, 0, .01)), Vector((.6, .5, .35)), sm((t - tw - .3) / (tend + .6 - tw - .3)))
        if t >= tw: note_pos = tip + Vector((0, -.01, -.03))
        set_hand('wal', tip, 110, -10)
    else: set_hand('wal', (0, 0, 0), vis=False)
    # 行25：フェリペスの指が手紙の記号をたどる／行26：羽根ペンで追伸を書く
    a = S('end:phel') + .4; b = T('end:phel', 'ドオ')
    tp = T('end:ps', 'ニセノ'); w0 = T('end:ps', 'ツイシンオ'); w1 = VE('end:ps') - 2.0
    if a <= t <= b + .6:
        u = lin(t, a + .5, b); row = int(u * 3)
        tip = Vector((LT.x - .07 + .14 * ((u * 3) % 1), LT.y + .09 - .05 * min(row, 2), .006))
        if t < a + .5: tip = vlerp(Vector((-.6, -.35, .25)), tip, sm((t - a) / .5))
        if t > b: tip = vlerp(tip, Vector((-.6, -.35, .25)), sm((t - b) / .6))
        set_hand('phel', tip, -78, -30)
    elif tp - .8 <= t <= w1 + 1.0:
        x0, x1 = LT.x - LW / 2 + LW * .09, LT.x - LW / 2 + LW * .86
        u = lin(t, w0, w1)
        nib = Vector((lerp(x0, x1, u), PS_Y - .004 + .003 * math.sin(t * 40) * (0 < u < 1), .002))
        if t < w0: nib = vlerp(Vector((.45, -.30, .3)), Vector((x0, PS_Y, .004)), sm((t - (tp - .8)) / (w0 - tp + .8)))
        if t > w1: nib = vlerp(Vector((x1, PS_Y, .003)), Vector((.45, -.3, .3)), sm((t - w1) / 1.0))
        set_hand('phel', nib + Vector((.07, .03, .06)), 80, -30)
        quill.location = nib; quill.rotation_euler = (math.radians(-35), math.radians(35), 0); show_tree(quill, True)
        M_PS.node_tree.nodes['reveal'].outputs[0].default_value = clamp(lerp(.08, .87, u)) if t >= w0 else 0
    else:
        set_hand('phel', (0, 0, 0), vis=False)
    if not (tp - .8 <= t <= w1 + 1.0): show_tree(quill, False); M_PS.node_tree.nodes['reveal'].outputs[0].default_value = 1.0 if t > w1 else 0.0
    return note_pos
# 羽根ペン
quill = empty('quill')
qf = sphere('qfeather', .02, (0, 0, .11), mat('feather', '#fbf8f0', .7), scale=(.45, .15, 2.8)); parent(qf, quill)
qs = cyl('qshaft', .0025, .2, (0, 0, .07), mat('shaft', '#e8dcc0', .6)); parent(qs, quill)
qn = cyl('qnib', .0025, .02, (0, 0, .005), mat('nib', '#2a1a0e', .4)); parent(qn, quill)

def apply(t):
    letter_state(t)
    rise = barrel_state(t)
    board_state(t)
    inner.rotation_euler = (0, 0, -2 * math.pi * disk_rot(t) / 26)
    # 円板と CAT のタイルは 行5〜10 の間だけ（行11 からは 入れ替えの表）
    dvis = S('disk:rome') - 6 <= t < S('sub:shuffle') + .3
    show_tree(disk_root, dvis); show(bpy.data.objects['pin'], dvis)
    # 外の文字・内の文字が光る（第5版）：指が進む文字（行6・7・10）、「Zの次は、A」（行10）、外の A と内の D（行11）
    _, fg = finger_state(t)
    og = {c: 0.0 for c in ABC}; ig = {c: 0.0 for c in ABC}
    for c, v in fg.items(): og[c] = max(og[c], 2.5 * v)
    for c, nd in (('Z', 'ゼットノ'), ('A', 'エエ')):
        u = seg(t, T('ring:za', nd), T('ring:za', nd) + .25) * (1 - seg(t, E('ring:za'), E('ring:za') + .3)); og[c] = max(og[c], 2.5 * u)
    off = 1 - seg(t, E('disk:read'), E('disk:read') + .4)
    og['A'] = max(og['A'], 2.5 * seg(t, T('disk:turn', 'エエノ'), T('disk:turn', 'エエノ') + .3) * off)
    ig['D'] = max(ig['D'], 2.5 * seg(t, T('disk:turn', 'ディイガ'), T('disk:turn', 'ディイガ') + .3) * off)
    for c in ABC: set_emit(OUTL[c][1], og[c]); set_emit(INL[c][1], ig[c])
    # CAT → FDW（行6）、1つ・2つ・3つ（行9）
    ft = TSEQ('disk:cat', ['エフ', 'ディイ', 'ダブリュウ']); k3 = TSEQ('disk:three', ['ヒトツ', 'フタツ', 'ミッツ'])
    for i, r in enumerate(CATS):
        f = lin(t, ft[i], ft[i] + .4)
        word = 'FDW'
        if t >= k3[0] + .05: word = 'ECV'
        if t >= k3[1] + .05: word = 'DBU'
        bpy.data.objects[r['tb']].data.body = word[i]
        if t >= k3[2]: f = 1 - lin(t, k3[2] + .03 * i, k3[2] + .03 * i + .4)
        spin = 0.0
        for kk in k3[:2]:
            w = lin(t, kk + .03 * i, kk + .03 * i + .3)
            if 0 < w < 1: spin = 2 * math.pi * sm(w)
        d0 = S('disk:cat') - .5 + .08 * i; cvis = d0 <= t < S('sub:shuffle') + .3
        lift = .06 * (1 - seg(t, d0, d0 + .3)) + (hop(lin(t, k3[0], k3[0] + .3), .02) if 0 < lin(t, k3[0], k3[0] + .3) < 1 else 0)
        place_tile(r, CAT_POS[i], flip=f, spin=spin, vis=cvis, lift=lift)
    table_state(t, S('sub:shuffle') - .1 <= t < S('book:kindi'))
    scat_state(t)
    arcs_state(t)
    clock_state(t)
    tree_state(t)
    dolls_state(t)
    e3_state(t)
    pairs_state(t)
    dice_state(t)
    sheet_state(t)
    L = scroll_state(t)
    book_state(t)
    towers_state(t)
    rows_state(t)
    candle_state(t)
    challenge_state(t)
    lv = light_level(t)
    for ld, p in LIGHTS: ld.energy = p * lv
    BGN.inputs[1].default_value = .35 * (.35 + .65 * lv)
    MATS['winGlow'] and set_emit(MATS['winGlow'], 3.5 * (.3 + .7 * lv))
    note_pos = hands(t)
    # たるの手紙
    if note_pos is not None: note.location = note_pos; note.rotation_euler = (0, 0, .3)
    elif t >= T('end:pass', 'ハコビヤクオ') + .1: show(note, False)
    else: note.location = BUNG + Vector((0, 0, -.03 + .055 * rise)); note.rotation_euler = (0, 0, 0)
    pos, tgt = set_camera(t)
    return pos

# 2D の札を合わせる 3D の点
def anchors(t):
    return {'letter': LT + Vector((LW / 2, -LH / 2, 0)), 'scrollTip': scroll_path(min(scroll_len(t), SCL))[0], 'xtop': XTOP + Vector((0, 0, .04)),
            'xbase': Vector((tw_x(ABC.index('X')), TWC.y - .034, 0)), 'psR': Vector((LT.x + LW / 2, PS_Y, 0)), 'board': BD + Vector((0, 0, .16)),
            'disk': DK + Vector((0, R_OUT, 0)), 'book': BK + Vector((BKW / 2, BKD / 2, .03)), 'rows': RW + Vector((0, .16, 0)), 'tower': TWC + Vector((0, 0, .26)),
            'glyphBase': Vector((TWC.x, TWC.y - .05, 0)), 'chq': QPOS}
def anchors5(t):
    w, o, _, _ = pairs_counts(t)
    a = {'diskC': Vector((DK.x, DK.y, .03)), 'clockC': Vector((CLK.x, CLK.y - .026, CLZ)), 'clock12': Vector((CLK.x, CLK.y - .026, CLZ + CLR)),
         'eTop': Vector((tw_x(ABC.index('E')), PW_Y, SLAB2 * w[ABC.index('E')] + .01)), 'tTop': Vector((tw_x(ABC.index('T')), PW_Y, SLAB2 * w[ABC.index('T')] + .01)),
         'die': die.location.copy(), 'sheetTop': Vector((SHC.x, SHC.y + SHH / 2, 0)), 'treeTop': TR_TOP + Vector((0, 0, .2)), 'e3stk': E3_STK_O + Vector((0, 0, .06)),
         'jTop': JTOP + Vector((0, 0, .04)), 'vTop': Vector((tw_x(ABC.index('V')), TWC.y, SLAB * DATA['tower'][ABC.index('V')] + .04))}
    for i in range(6): a['doll%d' % i] = DHEAD[i]
    return a
def project(p):
    v = world_to_camera_view(SC, CAM, Vector(p))
    return [round(v.x * W, 1), round((1 - v.y) * H, 1), 1 if (0 <= v.x <= 1 and 0 <= v.y <= 1 and v.z > 0) else 0]

# ---------------- 書き出し ----------------
if __name__ == '__main__':
    preview = A['every'] > 1 or A['scale'] < 1 or A['times']
    out = A['out'] or os.path.join(CACHE, 'blender', 'preview' if preview else 'desk')
    os.makedirs(out, exist_ok=True)
    src = open(os.path.abspath(__file__), 'rb').read()
    key = hashlib.sha256(src + json.dumps([CLIP['duration'], [(k, v['s'], v['e']) for k, v in CUE.items()], DATA], sort_keys=True).encode() + json.dumps(PT, sort_keys=True).encode()).hexdigest()[:20]
    t_all = time.time()
    cm = camera_motion(); json.dump(cm, open(os.path.join(CACHE, 'blender', 'camera-motion.json'), 'w'), indent=1)
    print('[desk] カメラが動いている割合 %.1f%%（%d / %d コマ）、切り替え（cut）%d 回' % (100 * cm['moving_ratio'], cm['moving_frames'], cm['frames'], len(cm['cuts'])), flush=True)
    # 1. アンカー（全コマ、書かない）
    if not preview and not A.get('noanc'):
        anc = {}
        for j in range(NF):
            t = j / FPS; apply(t); bpy.context.view_layer.update()
            for nm, p in {**anchors(t), **anchors5(t)}.items(): anc.setdefault(nm, []).append(project(p))
        json.dump({'fps': FPS, 'frames': NF, 'key': key, 'anchors': anc}, open(os.path.join(out, 'anchors.json'), 'w'))
        print('[desk] アンカー %d コマ %.1f 秒' % (NF, time.time() - t_all), flush=True)
    # 2. コマ
    if A['times']: idx = [int(round(x * FPS)) for x in A['times']]
    else:
        j0 = int((A['from'] or 0) * FPS); j1 = min(NF, int(math.ceil((A['to'] if A['to'] is not None else DUR) * FPS)))
        idx = list(range(j0, j1, A['every']))
    metaf = os.path.join(out, 'meta.json')
    old = json.load(open(metaf)) if os.path.exists(metaf) and not preview else {}
    done = set(old.get('done', [])) if old.get('key') == key and not A['force'] else set()
    t0 = time.time(); n = 0
    for j in idx:
        f = os.path.join(out, '%05d.jpg' % j)
        if j in done and os.path.exists(f): continue
        apply(j / FPS)
        SC.render.filepath = f; bpy.ops.render.render(write_still=True); n += 1; done.add(j)
        if n % 100 == 0:
            el = time.time() - t0; rest = sum(1 for x in idx if x not in done)
            print('[desk] %d コマ %.0f 秒（1コマ %.2f 秒、残り %d コマ ≈ %.0f 分）' % (n, el, el / n, rest, rest * el / n / 60), flush=True)
            if not preview: json.dump({'key': key, 'frames': NF, 'done': sorted(done), 'fps': FPS}, open(metaf, 'w'))
    dt = time.time() - t0
    if not preview: json.dump({'key': key, 'frames': NF, 'done': sorted(done), 'fps': FPS, 'seconds': round(dt, 1)}, open(metaf, 'w'))
    msg = '%s %s：%d コマ %.1f 秒（1コマ %.2f 秒）合計 %.1f 秒' % (time.strftime('%Y-%m-%d %H:%M:%S'), 'preview' if preview else 'full', n, dt, dt / max(1, n), time.time() - t_all)
    print('[desk] ' + msg)
    with open(os.path.join(CACHE, 'blender', 'render-log.txt'), 'a') as fh: fh.write(msg + '\n')
