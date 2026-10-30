# 技術の疑問の鎖 1-1 第4版（ys-chain-1-1v4）「女王を処刑台に送った手紙」の「机の上」の場面。
# 動画の全部のコマ（30fps、1080×1920）を、声の時刻に合わせて Blender で書き出す（背景の 3D。字幕・顔・札は 2D で重ねる：
#  scripts/umech/desk-frame.mjs・desk-1-1v4-overlay.mjs）。既存の bl_common.py の書き出し（run）は使わず、時刻 t だけで決まる
#  1本の場面を作り、apply(t) で物とカメラを動かして 1コマずつ書く（キーフレームは使わない。何度書いても同じ）。
#
# 使い方（音声・phrase-times・data.json を作った後）：
#   B=/Applications/Blender.app/Contents/MacOS/Blender
#   $B -b --factory-startup -P scripts/blender/desk_1_1v4.py -- --cache /private/tmp/ys/ys-chain-1-1v4 [--every N] [--scale 0.5] [--from 秒 --to 秒] [--out dir] [--times 1.0,2.5]
#   既定の出力：<cache>/blender/desk/00000.jpg …（コマ番号＝round(t×30)）と <cache>/blender/desk/anchors.json（2D の札を合わせる 3D の点の、画面の位置）
#   --every/--scale は下見用（<cache>/blender/preview/ に書く）。本番は付けない。
# 時刻：<cache>/ys-chain-1-1v4.json（字幕の時刻）と <cache>/phrase-times.json（声がどのカナを何秒に言うか）から、cue の鍵と言葉で決める。
# 数：<cache>/blender/data.json（scripts/umech/desk-1-1v4-data.mjs が計算し assert で確かめたもの）。ここでも主な数を assert する。
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
CID = 'ys-chain-1-1v4'
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
def disk_rot(t):
    r = 0.0
    a = T('disk:rome', 'ミッツズツ'); b = VE('disk:rome')
    r = -3 * seg(t, a, b)                                       # 行5：3目盛り回す
    ts0, ts1 = S('disk:spin') + .45, VE('disk:spin') + .25      # 行9：猛スピードで5回転して FDW に戻る
    if t >= ts0: r = -3 + 130 * (sm(lin(t, ts0, ts1)) if t < ts1 else 1)
    tk = TSEQ('disk:three', ['ヒトツ', 'フタツ', 'ミッツ'])    # 1つ・2つ・3つ：1目盛りずつ戻す
    if t >= tk[0] - .05:
        r = -3 + 130 + sum(seg(t, x - .05, x + .2) for x in tk)
    return r
CATS = [tile('cat%d' % i, 'CAT'[i], M_WHITE, 'FDW'[i], M_OR, (0, 0, -5)) for i in range(3)]
CAT_POS = [Vector((DK.x - .06 + .06 * i, -.43, 0)) for i in range(3)]

# ---------------- 入れ替えの表（26組） ----------------
TB = Vector((.55, -.17, 0)); TP = .048
def tab_xy(j, row):  # row 0＝白、1＝橙
    g = j // 13; c = j % 13
    return Vector((TB.x + (c - 6) * TP, TB.y + .09 - g * .135 - row * .056, 0))
TW_ = [tile('tw%d' % j, ABC[j], M_WHITE, ABC[j], M_WHITE, (0, 0, -5)) for j in range(26)]
TO_ = [tile('to%d' % j, ABC[j], M_OR, ABC[j], M_OR, (0, 0, -5)) for j in range(26)]   # 橙のタイル j＝文字 ABC[j]
UNSUB = {SUB[j]: j for j in range(26)}
def table_state(t, vis):
    t1 = S('sub:shuffle') + .15; t2 = T('sub:shuffle', 'ズラス'); t3 = T('sub:shuffle', 'バラバラニ')
    for j in range(26):
        d = t1 + .03 * j; u = seg(t, d, d + .3)
        place_tile(TW_[j], tab_xy(j, 0), vis=vis and t >= d, lift=.08 * (1 - u))
    for k in range(26):   # 橙のタイル k（文字 ABC[k]）：カエサルの位置（平文 k−3 の下）→ 入れ替え表の位置（平文 UNSUB の下）
        d = t2 + .03 * k; u = seg(t, d, d + .3)
        p0 = tab_xy((k - 3) % 26, 1); p1 = tab_xy(UNSUB[ABC[k]], 1)
        dl = t3 + .55 * ((k * 7) % 26) / 26; w = seg(t, dl, dl + .55); wl = lin(t, dl, dl + .55)
        p = vlerp(p0, p1, w); lift = .08 * (1 - u) + hop(wl, .07 + .03 * ((k * 5) % 3)) * (0 < wl < 1)
        place_tile(TO_[k], p, vis=vis and t >= d, lift=lift, spin=2 * math.pi * w * (1 if k % 2 else -1))

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
    a = T('scroll:mult'); k = TSEQ('scroll:mult', ['ニジュウロク', 'ニジュウゴ', 'ニジュウヨン', 'ゼンブ', 'ヤク'])
    L = .02 + .08 * seg(t, a + .2, k[0] + .3) + .08 * seg(t, k[1] - .1, k[1] + .3) + .09 * seg(t, k[2] - .1, k[2] + .3)
    L += (1.56 - .27) * (lin(t, k[3], k[4] + .4) ** 1.6)                                   # 全部掛けると：床まで走る
    y = T('scroll:years', 'センサンビャクマンネン')
    L += (2.20 - 1.56) * seg(t, y - .9, y + .25)
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
    a1 = S('tower:grow') + .4; b1 = T('tower:grow', 'ソノ')
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
    # 光る塔（行20：X、行21：J）と白い文字（E・T・H）
    gx = seg(t, T('tower:e'), T('tower:e') + .5) * (1 - seg(t, S('rows:the') + 1, S('rows:the') + 2))
    gj = seg(t, T('tower:t'), T('tower:t') + .5) * (1 - seg(t, S('rows:the') + 1, S('rows:the') + 2))
    for i in range(26): set_emit(M_SLABX[i], 0.0)
    set_emit(M_SLABX[ABC.index('X')], 2.2 * gx); set_emit(M_SLABX[ABC.index('J')], 2.2 * gj)
    for c, k, ta in (('E', 'X', T('tower:e', 'イイ')), ('T', 'J', T('tower:t', 'ティイ')), ('H', 'V', T('rows:the', 'エイチ'))):
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
    tm = {'X': T('rows:the', 'イイデ'), 'J': T('rows:the', 'ティイデ'), 'V': T('rows:the', 'エイチ')}
    rest = [c for c in FILL[3:] if any(x['q'] == c for x in ROWT)]
    a = S('rows:fill') + .25; b = VE('rows:fill') + 1.7
    for k, c in enumerate(rest): tm[c] = a + (b - a) * k / max(1, len(rest) - 1)
    return tm
FLIPT = None
M_GLOW = mat('glowOr', ORANGE, .4, emit='#ffcf7a', strength=0, unique=True)
def rows_state(t):
    global FLIPT
    if FLIPT is None: FLIPT = rows_flip_time()
    t0 = S('rows:the'); vis = t0 - .1 <= t < S('end:pass')
    tg = T('rows:the', 'サンモジガ'); th = T('rows:the', 'ザ')
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
def K(t, tgt, d, az, el, lens=40, cut=False): return {'t': t, 'p': Vector(tgt), 'd': d, 'az': az, 'el': el, 'lens': lens, 'cut': cut}
def cam_keys():
    k = []
    s = S
    k += [K(0, SEAL0 + Vector((0, .02, 0)), .30, -8, 40, 50), K(s('letter:open') + 1.2, LTc + Vector((0, -.05, 0)), .42, 0, 55, 45), K(s('letter:open') + 2.7, LTc, .55, 10, 62, 40)]
    k += [K(s('letter:mio') + 1.2, LTc + Vector((.02, .02, 0)), .42, 18, 52, 45)]
    k += [K(s('barrel:mary') + .75, BRc, .55, -25, 25, 40), K(T('barrel:mary', 'メアリーワ') + .3, BRc, .42, -5, 22, 45),
          K(T('barrel:mary', 'アンゴオノ') + .7, BUc, .34, 15, 55, 45), K(VE('barrel:mary'), BRc, .48, 30, 30, 40)]
    k += [K(s('barrel:board') + .7, BDc, 0.8, -10, 18, 40), K(s('barrel:board') + 2.4, BDc, 0.61, 8, 12, 50), K(E('barrel:board') + .3, Vector((-.05, 0, 0)), 1.25, 0, 38, 35)]
    k += [K(s('disk:rome') + .8, DKc, .60, 20, 50, 40), K(T('disk:rome', 'カエサルワ'), DKc, .45, 5, 65, 45), K(VE('disk:rome'), DKc, .36, -5, 76, 50)]
    k += [K(s('disk:ad') + 1.0, DKc + Vector((0, .1, 0)), .24, 10, 68, 55)]
    k += [K(s('disk:cat') + .7, CTc, .34, -10, 45, 45), K(E('disk:cat'), CTc, .32, 12, 55, 45)]
    k += [K(s('disk:mio') + 1.5, Vector((.55, -.30, .02)), .62, 25, 40, 40), K(E('disk:mio'), Vector((.55, -.30, .02)), .55, -5, 45, 40)]
    k += [K(E('disk:25'), DKc, .42, -15, 60, 45)]
    k += [K(s('disk:spin') + .8, DKc, .38, 0, 72, 45), K(E('disk:spin'), DKc, .33, 8, 74, 45)]
    k += [K(s('disk:three') + .9, Vector((.55, -.31, .01)), .46, -10, 60, 45), K(T('disk:three', 'ミッツ'), CTc, .30, 0, 50, 50), K(E('disk:three'), CTc, .34, 10, 45, 45)]
    k += [K(E('disk:kai'), DKc, .70, 30, 45, 40)]
    k += [K(s('sub:shuffle') + .7, TBc, 1.0, -20, 62, 35), K(T('sub:shuffle', 'ズラス'), TBc, .92, 0, 70, 35), K(VE('sub:shuffle') + .3, TBc, .88, 15, 58, 35)]
    kk = TSEQ('scroll:mult', ['ニジュウロク', 'ニジュウヨン', 'ゼンブ', 'ヤク'])
    k += [K(s('scroll:mult') + .7, S0 + Vector((0, -.05, 0)), .40, -30, 45, 45), K(kk[0] + .3, S0 + Vector((0, -.10, 0)), .34, -15, 58, 45),
          K(kk[1] + .3, Vector((S0.x, -.42, 0)), .40, -10, 50, 45), K(kk[2] + .6, Vector((S0.x, -.62, -.25)), .75, -6, 18, 35),
          K(kk[3] + .3, Vector((S0.x, -.85, -.70)), .70, 0, 26, 35), K(VE('scroll:mult') + .2, Vector((S0.x, -1.05, -.74)), .55, 10, 32, 40)]
    yy = T('scroll:years', 'センサンビャクマンネン')
    k += [K(yy, Vector((S0.x, -1.40, -.74)), .52, 0, 42, 40), K(VE('scroll:years') + .1, Vector((S0.x, -1.50, -.74)), .46, 5, 50, 45),
          K(E('scroll:years') + .2, Vector((S0.x, -.95, -.40)), 1.55, -15, 15, 30), K(E('scroll:mio'), Vector((S0.x, -.8, -.30)), 1.75, -25, 12, 30)]
    k += [K(s('sub:mary') + .8, Vector((.25, -.24, 0)), 1.25, 0, 60, 35), K(E('sub:mary'), Vector((.25, -.24, 0)), 1.15, 12, 55, 35)]
    k += [K(s('book:kindi') + .8, BKc, .55, -20, 40, 40), K(T('book:kindi', 'キンディイワ') + .5, BKc, .42, -5, 58, 45), K(E('book:kindi'), BKc + Vector((.05, 0, 0)), .40, 5, 66, 50)]
    k += [K(E('book:count'), BKc + Vector((.06, .02, 0)), .36, 0, 75, 55), K(E('book:mio'), BKc, .50, 15, 45, 40)]
    k += [K(s('tower:grow') + .7, TWc, .82, -30, 30, 35), K(s('tower:grow') + 3.2, TWc + Vector((-.22, 0, -.03)), .45, -42, 14, 40),
          K(s('tower:grow') + 6.2, TWc + Vector((.15, 0, 0)), .46, 25, 14, 40), K(T('tower:grow', 'ソノ'), TWc, .74, 0, 24, 35), K(E('tower:grow'), XTOP + Vector((0, 0, -.04)), .55, -10, 24, 40)]
    k += [K(T('tower:e', 'イイ'), XTOP, .40, -5, 18, 45), K(E('tower:e'), XTOP, .36, 5, 22, 45)]
    k += [K(T('tower:t', 'ティイ'), JTOP, .40, 5, 20, 45), K(E('tower:t'), JTOP, .44, 12, 24, 45)]
    k += [K(s('rows:the') + .8, RWc, .85, 0, 66, 40), K(T('rows:the', 'ナンドモ'), RWc, .78, -10, 70, 40), K(E('rows:the'), RWc + Vector((0, .03, 0)), .74, 10, 72, 40)]
    k += [K(s('rows:fill') + 1.8, RWc, .82, 20, 60, 40), K(VE('rows:fill') + 1.0, RWc, .84, -15, 56, 40), K(E('rows:fill'), RWc, .88, 0, 70, 38)]
    k += [K(T('rows:done', 'カゾエタ'), BDc, 0.72, 0, 14, 45), K(E('rows:done'), BDc, 0.65, 15, 18, 45)]
    tw = T('end:pass', 'ウォルシンガムノ')
    k += [K(s('end:pass') + .8, BRc, .55, 20, 30, 40), K(T('end:pass', 'ハコビヤクオ'), BUc, .40, 0, 35, 45), K(tw, Vector((-.38, .12, .10)), .62, 0, 28, 40), K(E('end:pass'), Vector((-.25, .05, .08)), .58, 15, 30, 40)]
    tc = T('end:phel', 'キゴオノ')
    k += [K(s('end:phel') + .8, LTc, .50, -10, 56, 45), K(tc - .6, LTc, .42, 10, 60, 45), K(tc + 1.2, TWc, .80, -20, 30, 35), K(E('end:phel'), TWc, .60, 10, 25, 40)]
    tp = T('end:ps', 'ニセノ')
    k += [K(s('end:ps') + .8, LTc, .50, 0, 60, 40), K(tp + .4, PSc, .30, -10, 55, 50), K(T('end:ps', 'ナカマノ'), PSc, .28, 10, 60, 50), K(E('end:ps'), LTc, .45, 0, 65, 45)]
    k += [K(s('end:exec') + .8, CDc, .45, -15, 15, 45), K(VE('end:exec') - .3, CDc + Vector((0, 0, .03)), .32, 0, 12, 50), K(E('end:exec'), CDc, .45, 15, 18, 45)]
    k += [K(s('end:mio') + 2.0, LTc, .70, -10, 45, 35), K(E('end:mio'), LTc, .60, 8, 50, 38)]
    k += [K(s('next:weak') + .9, BDc, 0.8, -15, 18, 40), K(T('next:weak', 'デモ'), BDc, 0.61, 10, 15, 45), K(E('next:weak'), BDc, 0.7, -5, 20, 42)]
    k += [K(s('ch:tiles') + .9, BDc + Vector((0, 0, .02)), .62, 12, 20, 38), K(T('ch:tiles', 'エム') + .1, CHc, .70, 0, 70, 40), K(s('ch:tiles') + 3.6, CHc, .66, -8, 72, 40), K(E('ch:tiles'), CHc, .64, 8, 66, 40)]
    k += [K(s('ch:next') + 2.3, CHc, .66, 20, 45, 40), K(E('ch:next') + .3, CHc, .80, -5, 50, 38)]
    k += [K(s('last:letter') + .9, LTc, .66, -15, 50, 40), K(s('last:letter') + 3.6, LTc, .58, 5, 58, 40), K(DUR + .5, LTc, .55, 10, 62, 40)]
    k.sort(key=lambda x: x['t'])
    return k
KEYS = cam_keys()
def hermite(ts, vs, t):
    n = len(ts)
    if t <= ts[0]: return vs[0]
    if t >= ts[-1]: return vs[-1]
    i = max(j for j in range(n - 1) if ts[j] <= t)
    def m(j):
        if j == 0: return (vs[1] - vs[0]) / (ts[1] - ts[0])
        if j == n - 1: return (vs[-1] - vs[-2]) / (ts[-1] - ts[-2])
        return (vs[j + 1] - vs[j - 1]) / (ts[j + 1] - ts[j - 1])
    h = ts[i + 1] - ts[i]; u = (t - ts[i]) / h
    h00 = 2 * u ** 3 - 3 * u ** 2 + 1; h10 = u ** 3 - 2 * u ** 2 + u; h01 = -2 * u ** 3 + 3 * u ** 2; h11 = u ** 3 - u ** 2
    return h00 * vs[i] + h10 * h * m(i) + h01 * vs[i + 1] + h11 * h * m(i + 1)
def cam_pose(t):
    ts = [k['t'] for k in KEYS]
    comp = {}
    for nm in ('x', 'y', 'z', 'd', 'az', 'el', 'lens'):
        vs = [ (k['p'].x if nm == 'x' else k['p'].y if nm == 'y' else k['p'].z if nm == 'z' else k[nm]) for k in KEYS]
        comp[nm] = hermite(ts, vs, t)
    tgt = Vector((comp['x'], comp['y'], comp['z']))
    az = math.radians(comp['az']); el = math.radians(clamp(comp['el'], 3, 85))
    d = max(.12, comp['d'])
    pos = tgt + d * Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
    # 行9：円板を猛スピードで回す間、画面が小さく揺れる
    a, b = S('disk:spin') + .45, VE('disk:spin') + .25
    if a < t < b:
        s = .006 * math.sin(math.pi * (t - a) / (b - a))
        pos += Vector((s * math.sin(t * 71), s * math.cos(t * 53), s * .5 * math.sin(t * 97)))
    return pos, tgt, comp['lens'] * .78, d
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
        # 行5：カイの指が内の円板のつまみを 3目盛り回す
        a = T('disk:rome', 'カエサルワ'); b = VE('disk:rome') + .4
        if a - .4 <= t <= b + .7:
            r = disk_rot(t); ang_k = ang_of(r) ; kp = Vector((DK.x + .05 * math.cos(ang_k), DK.y + .05 * math.sin(ang_k), .036))
            if t < a + .3: tip = vlerp(Vector((DK.x + .05, -.75, .2)), kp, sm((t - (a - .4)) / .7))
            elif t > b: tip = vlerp(kp, Vector((DK.x + .2, -.7, .2)), sm((t - b) / .7))
            else: tip = kp
            set_hand('kai', tip, 10, -35)
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
    # 行6：A と D、B と E が光る
    for c, nd, m in (('A', 'エエワ', OUTL['A'][1]), ('B', 'ビイワ', OUTL['B'][1])):
        u = seg(t, T('disk:ad', nd), T('disk:ad', nd) + .3) * (1 - seg(t, E('disk:ad'), E('disk:ad') + .4)); set_emit(m, 2.5 * u)
    for c, nd in (('D', 'ディイ'), ('E', 'イイ')):
        u = seg(t, T('disk:ad', nd), T('disk:ad', nd) + .3) * (1 - seg(t, E('disk:ad'), E('disk:ad') + .4)); set_emit(INL[c][1], 2.5 * u)
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
        cvis = S('disk:ad') - 1 <= t < S('sub:shuffle') + .3
        place_tile(r, CAT_POS[i], flip=f, spin=spin, vis=cvis, lift=hop(lin(t, k3[0], k3[0] + .3), .02) if 0 < lin(t, k3[0], k3[0] + .3) < 1 else 0)
    table_state(t, S('sub:shuffle') - .1 <= t < S('book:kindi'))
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
    # 1. アンカー（全コマ、書かない）
    if not preview:
        anc = {}
        for j in range(NF):
            t = j / FPS; apply(t); bpy.context.view_layer.update()
            for nm, p in anchors(t).items(): anc.setdefault(nm, []).append(project(p))
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
