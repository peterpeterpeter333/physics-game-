# 技術の疑問の鎖 1-1 ChatGPT 試作。既存 v5/v6 の場面・コマは使わない。
# 以下の汎用関数と部屋の仕様のみ、引き継ぎ資料 02 の 7章に従って共通部品から写した。
# このファイルの後半に、この回専用の物・動き・カメラを新しく定義する。
import bpy, bmesh, json, math, os, sys, time, re
from mathutils import Vector, Matrix, Euler
from bpy_extras.object_utils import world_to_camera_view

def args():
    a=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
    o={'cache':None,'scale':1.0,'samples':16,'times':None,'ranges':None,'cue_midpoints':False,'cue_probes':False,'from':None,'to':None,'every':1,'out':None,'force':False}
    i=0
    while i<len(a):
        k=a[i]
        if k=='--force': o['force']=True;i+=1;continue
        if k=='--cue-midpoints': o['cue_midpoints']=True;i+=1;continue
        if k=='--cue-probes': o['cue_probes']=True;i+=1;continue
        v=a[i+1];i+=2
        if k=='--cache':o['cache']=v
        elif k=='--scale':o['scale']=float(v)
        elif k=='--samples':o['samples']=int(v)
        elif k=='--times':o['times']=[float(x) for x in v.split(',')]
        elif k=='--ranges':o['ranges']=[tuple(map(float,x.split(':'))) for x in v.split(',')]
        elif k=='--from':o['from']=float(v)
        elif k=='--to':o['to']=float(v)
        elif k=='--every':o['every']=int(v)
        elif k=='--out':o['out']=v
        else:raise SystemExit('unknown '+k)
    if not o['cache']:raise SystemExit('--cache required')
    return o
A=args(); CACHE=A['cache']; CID='ys-chain-1-1gpt'; FPS=30; W,H=1080,1920
CLIP=json.load(open(os.path.join(CACHE,CID+'.json')))
DATA=json.load(open(os.path.join(CACHE,'blender','data.json')))
DUR=CLIP['duration']; NF=math.ceil(DUR*FPS)
CUES=[]; CUE={}
for scene in CLIP['scenes']:
    for q,cap in zip(scene['cues'],scene['captions']):
        key=q['diagram'].split('-',1)[1]
        ent={'key':key,'s':cap['start'],'e':cap['end'],'heading':scene['heading'],'sub':q['subtitle']}
        CUES.append(ent);CUE[key]=ent
S=lambda k:CUE[k]['s']
E=lambda k:CUE[k]['e']
def cue_at(t):
    latest=CUES[0]
    for q in CUES:
        if q['s']>t:break
        latest=q
        if t<q['e']:break
    return latest

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
    hidden = not v
    if o.hide_render != hidden: o.hide_render = hidden
    if o.hide_viewport != hidden: o.hide_viewport = hidden
def show_tree(o, v):
    show(o, v)
    for c in o.children: show_tree(c, v)

# ---------------- 場面 ----------------
bpy.context.window.scene=bpy.data.scenes.new('Physics Quest 1-1 ChatGPT 試作')
fonts()
SC = bpy.context.scene
SC.render.engine = 'BLENDER_EEVEE'
SC.render.resolution_x = int(W * A['scale']); SC.render.resolution_y = int(H * A['scale']); SC.render.resolution_percentage = 100
SC.render.image_settings.file_format = 'JPEG'; SC.render.image_settings.quality = 92
SC.view_settings.view_transform = 'Standard'; SC.view_settings.look = 'None'; SC.view_settings.exposure = -.45
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
area('key', (-1.0, -1.2, 1.6), (0, 0, 0), 46, 1.4, '#ffd8a8')
area('fill', (1.3, -0.9, 0.9), (0, 0, 0), 11, 1.6, '#dfe6ff')
area('rim', (0.2, 1.0, 1.3), (0, 0, 0), 19, 1.2, '#ffe2c0')
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

# ---------------- この回専用の舞台と道具 ----------------
# どの物も、この回の正本の「画面」欄から新しく配置・演出した。
STAGES={}
def stage(name):
    STAGES[name]=empty('stage_'+name)
    return STAGES[name]
def attach(o,root):
    parent(o,root)
    return o
def label(root,name,body,x,y,z=.018,size=.033,color=None):
    font=FONT_J if any(ord(c)>127 for c in body) else FONT_L
    return attach(text(name,body,size,color or M_INK,(x,y,z),font=font),root)
def bead(root,name,x,y,z,r=.018,color=None):
    return attach(sphere(name,r,(x,y,z),color or M_BLUE),root)

PAPER=mat('parchment','#f0dfbb',.86)
PAPER_EDGE=mat('paperEdge','#b8955f',.8)
RED=mat('waxRed','#9f2935',.35)
GOLD=mat('gold','#d5ad5e',.3,metal=.55)
INK=mat('ink_black','#2b1a14',.7)
CHALK=mat('chalk','#fdf8ed',.75)
TEAL=mat('teal','#4eaa9e',.5)
DARK=mat('midnight','#25344b',.6)
BARWOOD=wood('barrel_unique','#986339','#60391e',(14,1,1),.55,3)

# 手紙：封を切ったあとに上半分が開く。古い紙の厚みを縁で見せる。
letter=stage('手紙')
lp=attach(box('gpt_letter_bottom',(.58,.72,.008),(0,-.015,.006),PAPER,bevel=.003),letter)
letter_lid=empty('gpt_letter_lid',(0,.34,.013));attach(letter_lid,letter)
attach(box('gpt_letter_upper',(.58,.28,.007),(0,.36,.014),PAPER,bevel=.003),letter_lid)
# 本物の手紙の字形を断定しないため、記号は説明用の再現。横線だけの
# 空白の紙に見えないよう、読む対象として十分大きく置く。
letter_symbols=(
    '∩ Ω § ∞ ¶ △ ∇ Ω',
    '∞ Ω ∩ § ○ ◇ △ ¶',
    '∇ § Ω ∞ ∩ ○ ¶ △',
    'Ω △ ∞ ¶ ◇ § ∩ ∇',
    '∩ ○ § ∇ Ω ∞ △ ¶',
    '△ ¶ ∩ ◇ Ω § ∞ ∇',
    '∞ ∇ § ○ ∩ △ Ω ¶',
    '§ Ω △ ∞ ◇ ∩ ∇ ○',
)
for j,line in enumerate(letter_symbols):
    label(letter,'gpt_letter_symbols_%d'%j,line,0,.18-j*.069,.014,.039,INK)
for j,line in enumerate(('∩ Ω ∞ § △ ∇','◇ ¶ ○ Ω ∩ §','△ ∞ ∇ ¶ Ω ○')):
    label(letter_lid,'gpt_lid_symbols_%d'%j,line,0,.45-j*.08,.020,.037,INK)
wax=attach(cyl('gpt_wax',.036,.009,(0,.17,.019),RED),letter)
letter_year=label(letter,'year','1586',-.19,.28,.021,.048)

# たる：断面を見せる小さな容器。手紙が「安全」と思われた場面にも置く。
barrel=stage('たる')
barrel_root=empty('gpt_barrel_root');attach(barrel_root,barrel)
attach(cyl('gpt_barrel_body',.115,.36,(0,0,.135),BARWOOD,rot=(0,math.pi/2,0),verts=48),barrel_root)
for xx in (-.12,.12):
    attach(torus('gpt_hoop',.116,.007,(xx,0,.135),DARK,rot=(0,math.pi/2,0)),barrel_root)
cork=attach(cyl('gpt_cork',.026,.019,(0,0,.263),PAPER_EDGE),barrel)
note=attach(box('gpt_note',(.12,.08,.006),(0,0,.275),PAPER,bevel=.002),barrel)
label(barrel,'gpt_note_cipher','JVX',0,0,.28,.045,M_OR)

# ずらす：外輪と内輪を別々にし、針と文字は回転時刻を声に合わせる。
wheel=stage('ずらす')
attach(cyl('gpt_outer',.30,.018,(0,.02,.01),wood('gpt_outer_wood','#674225','#3f281b',(1,9,1))),wheel)
inner_root=empty('gpt_inner_root',(0,.02,.017));attach(inner_root,wheel)
attach(cyl('gpt_inner',.225,.018,(0,.02,.019),wood('gpt_inner_wood','#9b643a','#704624',(1,9,1))),inner_root)
attach(cyl('gpt_pin',.012,.042,(0,.02,.03),GOLD),wheel)
outer_letters=[];inner_letters=[]
ABC=DATA['abc']
for i,c in enumerate(ABC):
    a=math.pi/2-2*math.pi*i/26
    xo,yo=.267*math.cos(a),.02+.267*math.sin(a)
    xi,yi=.190*math.cos(a),.02+.190*math.sin(a)
    outer_letters.append(label(wheel,'gpt_out_'+c,c,xo,yo,.023,.045,CHALK))
    inner_letters.append(label(inner_root,'gpt_in_'+c,c,xi,yi,.033,.045,M_OR))
pointer=attach(box('gpt_pointer',(.018,.105,.008),(0,.342,.025),M_BLUE,bevel=.002),wheel)
cat_g=[]
for i,(a,b) in enumerate(zip('CAT','FDW')):
    x=(i-1)*.107
    r=tile('gpt_cat_'+str(i),a,M_WHITE,b,M_OR,(x,-.34,0),size=.075,tsize=.049)
    attach(r,wheel);cat_g.append(r)
clock=stage('時計')
attach(cyl('gpt_clock_face',.23,.023,(0,0,.015),PAPER_EDGE),clock)
attach(cyl('gpt_clock_white',.211,.024,(0,0,.029),PAPER),clock)
for i in range(12):
    a=math.pi/2-2*math.pi*i/12
    label(clock,'gpt_clock_num_'+str(i),str(12 if i==0 else i),.174*math.cos(a),.174*math.sin(a),.044,.025)
clock_hand=attach(box('gpt_clock_hand',(.007,.15,.004),(0,.070,.047),DARK),clock)
label(clock,'gpt_clock_note','12 → 1',0,-.31,.024,.043)

# 入れ替え：文字カードから線が分かれ、選択肢の積が巨大になる。
sub=stage('入れ替え')
attach(box('gpt_sub_board',(.72,.69,.015),(0,0,.008),DARK,bevel=.008),sub)
sub_plain=[];sub_cipher=[]
for i,(a,b) in enumerate(zip('CAT','EQJ')):
    x=(i-1)*.19
    sub_plain.append(label(sub,'gpt_sub_plain_'+a,a,x,.16,.025,.074,CHALK))
    sub_cipher.append(label(sub,'gpt_sub_cipher_'+b,b,x,-.13,.025,.074,M_OR))
    attach(box('gpt_sub_bridge_'+str(i),(.006,.14,.005),(x,.01,.024),GOLD),sub)
choices=[26,25,24,23,1]
branches=[]
for i,n in enumerate(choices):
    x=(i-2)*.13
    branches.append(label(sub,'gpt_choice_'+str(i),str(n),x,-.29,.025,.042,GOLD))
# 掛け算の理由は、別の立体の枝で見せる。最初の分岐から次の枝が増える。
tree=stage('枝分かれ')
attach(cyl('gpt_tree_trunk',.012,.16,(0,-.21,.10),PAPER_EDGE,rot=(math.pi/2,0,0)),tree)
tree_level=[]
for level,(count_,y,span) in enumerate(((5,-.11,.56),(9,.04,.66),(13,.20,.72))):
    objs=[]
    for i in range(count_):
        x=(i/(count_-1)-.5)*span
        line=attach(box('gpt_tree_branch_%d_%d'%(level,i),(.009,.13,.006),(x*.62,y-.06,.025),GOLD,rot=(0,0,-math.atan2(x,.15))),tree)
        tip=attach(sphere('gpt_tree_tip_%d_%d'%(level,i),.013,(x,y,.035),TEAL),tree)
        objs.extend((line,tip))
    tree_level.append(objs)
tree_counts=[label(tree,'gpt_tree_count_'+str(i),s,(i-1)*.23,-.33,.024,.047,M_INK)
             for i,s in enumerate(('26','×25','×24'))]
scroll=stage('巻物')
scroll_paper=attach(box('gpt_scroll',(.44,.60,.012),(0,0,.015),PAPER,bevel=.004),scroll)
for i in range(10):
    attach(box('gpt_scroll_line_'+str(i),(.31,.002,.002),(0,.23-i*.047,.023),INK),scroll)

# 何を数えるか：名札を替えても、同じ人の声の数は変わらない。
count=stage('数える')
dolls=[];doll_tags=[]
for i in range(6):
    x=(i-2.5)*.115
    root=empty('gpt_doll_'+str(i));attach(root,count)
    attach(cyl('gpt_doll_body_'+str(i),.035,.105,(x,-.025,.078),mat('gpt_doll_cloth_'+str(i),['#375e9c','#8c785d','#54836c','#b46b61','#a081b5','#6483a1'][i])),root)
    attach(sphere('gpt_doll_head_'+str(i),.035,(x,-.025,.151),M_SKIN),root)
    doll_tags.append(label(root,'gpt_doll_tag_'+str(i),ABC[i],x,-.10,.080,.047,M_OR))
    dolls.append(root)
speech=[]
for i in range(9):
    x=.02+.032*(i%3);y=.085+.040*(i//3)
    speech.append(bead(count,'gpt_speech_'+str(i),x,y,.18,.013,CHALK))
freq=[]
counts={'X':70,'J':60,'V':48,'Q':43,'G':36,'N':31}
for i,(k,n) in enumerate(counts.items()):
    x=(i-2.5)*.10
    b=attach(box('gpt_freq_'+k,(.064,.074,n*.0038),(x,-.13,n*.0019),M_OR,bevel=.002),count)
    tag=label(count,'gpt_freq_tag_'+k,k,x,-.195,.022,.037)
    freq.append((b,tag,n))
white_freq=[]
for i,(k,n) in enumerate((('E',70),('T',60),('A',48),('O',43),('I',36),('N',31))):
    x=(i-2.5)*.10
    b=attach(box('gpt_white_freq_'+k,(.064,.074,n*.0038),(x,.16,n*.0019),M_WHITE,bevel=.002),count)
    tag=label(count,'gpt_white_freq_tag_'+k,k,x,.095,.022,.037,M_INK)
    white_freq.append((b,tag,n))
eee=[];xxx=[]
for i in range(3):
    px=(i-1)*.21
    e=tile('gpt_E_'+str(i),'E',M_WHITE,'X',M_OR,(px,-.01,0),size=.16,tsize=.11)
    x=tile('gpt_X_'+str(i),'X',M_OR,'',M_OR,(px,-.01,0),size=.16,tsize=.11)
    attach(e,count);attach(x,count)
    eee.append(e);xxx.append(x)
book=stage('本')
attach(box('gpt_book_cover',(.61,.55,.035),(0,0,.018),wood('gpt_book_leather','#704d36','#573724',(1,8,1)),bevel=.005),book)
for side in (-1,1):
    attach(box('gpt_book_page',(.27,.49,.010),(side*.145,0,.041),PAPER,bevel=.003),book)
for side in (-1,1):
    for row in range(7):
        for mark in range(2+((row*7+side*3)%6)):
            attach(box('gpt_tally_%d_%d_%d'%(side,row,mark),(.002,.027,.001),
                       (side*.145-.09+mark*.019,.17-row*.055,.050),INK),book)

# サイコロ：短い試行では偏りが大きく、回数を増やすと傾向が見える。
dice=stage('サイコロ')
die=[]
for i,x in enumerate((-.20,0,.20)):
    root=empty('gpt_die_root_'+str(i),(x,.02,.04));attach(root,dice)
    attach(box('gpt_die_'+str(i),(.105,.105,.105),(x,.02,.06),M_WHITE,bevel=.012),root)
    for j,(dx,dy) in enumerate(((-.022,-.022),(.022,.022),(-.022,.022),(.022,-.022))[:i+2]):
        attach(sphere('gpt_die_pip_%d_%d'%(i,j),.008,(x+dx,.02+dy,.114),M_INK),root)
    die.append(root)

# 仮説→予言→事実→判定。答えは cue が来てから見えるようにする。
logic=stage('確かめる')
logic_glass=attach(torus('gpt_logic_glass',.14,.012,(0,0,.055),GOLD),logic)
logic_handle=attach(box('gpt_logic_handle',(.025,.20,.014),(.12,-.20,.052),DARK,bevel=.009,rot=(0,0,-math.pi/4)),logic)
logic_exam=[]
for i,(glyph,colour) in enumerate((('X',M_OR),('E',M_WHITE))):
    tile_root=tile('gpt_logic_exam_'+glyph,glyph,colour,'',colour,((i-.5)*.31,.0,0),size=.21,tsize=.145)
    attach(tile_root,logic);logic_exam.append(tile_root)
cards=[]
for i,(s,c) in enumerate((('仮説',BLUE),('予言','#e2a046'),('事実','#60a79e'),('判定','#9acd72'))):
    y=.25-i*.17
    m=mat('gpt_logic_'+str(i),c,.56)
    boxo=attach(box('gpt_logic_card_'+str(i),(.52,.12,.012),(0,y,.018),PAPER,bevel=.004),logic)
    t=label(logic,'gpt_logic_word_'+str(i),s,-.15,y,.028,.044,m)
    cards.append((boxo,t))
logic_value=label(logic,'gpt_logic_value','X = E    J = T',.06,.24,.030,.033,M_OR)
logic_detail=[label(logic,'gpt_logic_detail_'+str(i),s,.06,.25-i*.17,.030,.035,M_INK)
              for i,s in enumerate(('X = E / J = T','J □ X','JVX × 14','V = H'))]

# 14回という「事実」は、抽象的な札だけでなく暗号文の紙の上で確かめる。
cipher_stage=stage('暗号文')
attach(box('gpt_cipher_sheet',(.78,.70,.009),(0,0,.013),PAPER,bevel=.003),cipher_stage)
words=DATA['cipher'].split()
for i in range(5):
    line=' '.join(words[i*6:(i+1)*6])[:35]
    label(cipher_stage,'gpt_cipher_line_'+str(i),line,0,.275-i*.078,.025,.027,M_INK)
cipher_marks=[]
for i in range(14):
    x=(i%7-3)*.075;y=-.185-(i//7)*.085
    b=attach(box('gpt_jvx_card_'+str(i),(.069,.059,.004),(x,y,.029),M_OR,bevel=.002),cipher_stage)
    s=label(cipher_stage,'gpt_jvx_'+str(i),'JVX',x,y,.033,.029,M_INKW)
    cipher_marks.append((b,s))

# 暗号文を解いていく机の紙。既知文字と候補は音声の該当 cue から表示。
rows=stage('穴埋め')
attach(box('gpt_rows_paper',(.78,.70,.012),(0,0,.011),PAPER,bevel=.003),rows)
row_ciph=label(rows,'gpt_row_cipher','JVX QSNI DPGG',0,.21,.022,.050,M_OR)
row_cipher2=label(rows,'gpt_row_cipher2','NXXJ QJ JVX',0,.125,.022,.050,M_OR)
row_plain1=label(rows,'gpt_row_plain1','THE □□□□ □□□□',0,-.055,.025,.050,INK)
row_plain2=label(rows,'gpt_row_plain2','□□□□ □□ THE',0,-.145,.025,.050,INK)
row_hint=label(rows,'gpt_row_hint','E  T  H',0,-.29,.024,.037,M_BLUE)
# 「□EET」の候補を声に合わせて二つ並べる。候補を先に一つに決めつけない。
meet_choices=[
    label(rows,'gpt_meet_choice_feet','FEET',-.18,-.29,.029,.037,M_INK),
    label(rows,'gpt_meet_choice_meet','MEET',.18,-.29,.029,.037,M_BLUE),
]
meet_reject=label(rows,'gpt_meet_reject','×',-.06,-.29,.032,.046,M_OR)
fill_cards=[]
for i,c in enumerate('THEARMYWILLMEETATTHE'):
    row,col=divmod(i,11)
    x=((col-5)*.060 + (col>=3)*.018 + (col>=7)*.018 - .018) if row==0 else ((col-4)*.060 + (col>=4)*.018 + (col>=6)*.018 - .018)
    y=.07-row*.20
    plate=attach(box('gpt_fill_plate_'+str(i),(.058,.083,.004),(x,y,.045),M_WHITE,bevel=.002),rows)
    glyph=label(rows,'gpt_fill_glyph_'+str(i),c,x,y,.051,.052,M_INK)
    fill_cards.append((plate,glyph))
q_markers=[]
for i in range(4):
    q_markers.append(bead(rows,'gpt_q_marker_'+str(i),-.27+i*.18,.315,.026,.013,GOLD))

solved=stage('解ける')
attach(box('gpt_solved_board',(.73,.64,.016),(0,0,.012),DARK,bevel=.006),solved)
label(solved,'gpt_solved_caption','THE ARMY WILL',0,.15,.026,.052,CHALK)
label(solved,'gpt_solved_caption2','MEET AT THE',0,.04,.026,.052,CHALK)
label(solved,'gpt_solved_count','0   −   2',0,-.18,.026,.074,GOLD)

# 手紙の横流し：運び役が敵方に向きを変え、渡してから封を戻す。
ending=stage('結末')
attach(box('gpt_end_map',(.75,.68,.012),(0,0,.008),PAPER,bevel=.004),ending)
end_people=[]
for i,(x,c,name) in enumerate(((-.26,'#a45e83','メアリー'),(0,'#785d3a','ギフォード'),(.26,'#29364e','ウォルシンガム'))):
    cloth=mat('gpt_end_cloth_'+str(i),c,.7)
    body=attach(cyl('gpt_end_body_'+str(i),.032,.078,(x,.20,.060),cloth),ending)
    head=attach(sphere('gpt_end_head_'+str(i),.029,(x,.20,.117),M_SKIN),ending)
    # 長い右端の名前を画面外にはみ出させない。
    label(ending,'gpt_end_name_'+str(i),name,x-.055 if i==2 else x,.09,.025,.023 if i==2 else .029,M_INK)
    end_people.append((body,head))
carrier=empty('gpt_carrier',(0,-.13,.025));attach(carrier,ending)
attach(cyl('gpt_carrier_body',.034,.11,(0,0,.063),mat('gpt_carrier_coat','#785d3a')),carrier)
attach(sphere('gpt_carrier_head',.031,(0,0,.133),M_SKIN),carrier)
attach(cyl('gpt_carrier_hat',.039,.012,(0,0,.164),DARK),carrier)
spy_letter=attach(box('gpt_spy_letter',(.18,.13,.004),(-.22,.12,.024),PAPER,bevel=.002),ending)
spy_copy=attach(box('gpt_spy_copy',(.18,.13,.004),(.22,.12,.024),CHALK,bevel=.002),ending)
spy_wax=attach(cyl('gpt_spy_wax',.014,.005,(-.22,.12,.031),RED),ending)
route=attach(box('gpt_end_route',(.54,.006,.003),(0,.04,.022),GOLD),ending)
label(ending,'gpt_end_route_label','手紙',0,-.31,.020,.035,M_OR)
post=stage('追伸')
attach(box('gpt_post_paper',(.72,.70,.01),(0,0,.01),PAPER,bevel=.004),post)
for i in range(8):
    cipher_line=' '.join(words[i*5:(i+1)*5])[:30]
    label(post,'gpt_post_cipher_'+str(i),cipher_line,0,.29-i*.064,.024,.026,M_INK)
post_note=attach(box('gpt_post_note',(.64,.13,.003),(0,-.25,.025),M_WHITE,bevel=.002),post)
post_label=label(post,'gpt_post_add','追伸',-.22,-.25,.031,.049,RED)
dark_end=stage('処刑')
attach(cyl('gpt_dark_plinth',.22,.022,(0,0,.01),DARK),dark_end)
attach(cyl('gpt_candle',.041,.23,(0,0,.14),PAPER),dark_end)
flame=attach(sphere('gpt_flame',.035,(0,0,.30),mat('gpt_fire','#ffc35d',emit='#ff9e24',strength=3),scale=(.52,.52,1.6)),dark_end)
dark_scene=stage('次へ')
attach(box('gpt_next_b',(.70,.60,.01),(0,0,.01),DARK),dark_scene)
label(dark_scene,'gpt_next','同じ文字 → 同じ記号',0,0,.022,.039,CHALK)
challenge=stage('挑戦')
attach(box('gpt_ch_paper',(.78,.61,.01),(0,0,.01),PAPER),challenge)
label(challenge,'gpt_challenge','MYEXD',0,.16,.023,.066,M_INK)
label(challenge,'gpt_challenge_2','DRO VODDOBC',0,.025,.023,.055,M_INK)
last=stage('終わり')
attach(box('gpt_last_letter',(.58,.72,.008),(0,0,.01),PAPER,bevel=.004),last)
label(last,'gpt_last','JVX → THE',0,0,.021,.060,M_INK)

# ---------------- 回ごとの物の動き ----------------
STAGE_FOR={'手紙':'手紙','ずらす':'ずらす','入れ替え':'入れ替え','考える':'巻物',
           '数える':'数える','確かめる':'確かめる','穴埋め':'穴埋め','解ける':'解ける',
           '結末':'結末','次へ':'次へ','挑戦':'挑戦','終わり':'終わり'}
def local(q,t):
    return lin(t,q['s'],q['e'])
def stage_for(q):
    k=q['key']
    if k.startswith('tree:'):return '枝分かれ'
    if k.startswith('tab:'):return '入れ替え'
    if k.startswith('think:'):return '巻物'
    if k.startswith('dice:'):return 'サイコロ'
    if k.startswith('tower:'):return '数える'
    if k=='logic:fact':return '暗号文'
    if k in ('end:phel','end:ps'):return '追伸'
    if k=='end:exec':return '処刑'
    if k.startswith('barrel:'):return 'たる'
    if k.startswith('clock:'):return '時計'
    if k.startswith('book:'):return '本'
    if k.startswith('scroll:'):return '巻物'
    return STAGE_FOR[q['heading']]
def apply(t):
    q=cue_at(t);key=q['key'];u=local(q,t);st=stage_for(q)
    for name,root in STAGES.items():show_tree(root,name==st)
    for name in HANDS:
        set_hand(name,(0,0,0),vis=False)
        HANDS[name].scale=(1,1,1)
    # 手紙を開く手は、冒頭だけ。封は割れ、紙の上半分が持ち上がる。
    letter_lid.rotation_euler=(math.pi*.70*(1-seg(t,S('letter:open')+.55,S('letter:open')+1.85)),0,0)
    if st=='手紙':
        # 年号は次の場面で声に合わせて示す。冒頭の問いには先出ししない。
        show_tree(letter_year,False)
        show_tree(wax,t<S('letter:open')+1.0)
        set_hand('kai',(.18-.12*seg(t,S('letter:open'),S('letter:open')+1.2),.18,.065),yaw=-32,pitch=-28)
        HANDS['kai'].scale=(.5,.5,.5)
    if st=='たる':
        rise=seg(t,S('barrel:mary')+.5,S('barrel:mary')+1.65)
        cork.location=(0,.08*rise,.263+.08*hop(rise,.6))
        note.location=(0,0,.275+.105*rise)
        set_hand('kai',(.11,.07,.28+.07*rise),yaw=20,pitch=-30)
    # 円板の3目盛りは 3/26 周。左右の文字は動かさず、内輪だけ動かす。
    if st=='ずらす':
        start=S('disk:turn');end=E('disk:turn')
        turn=seg(t,start,end)
        if t<start:turn=0
        inner_root.rotation_euler=(0,0,2*math.pi*3/26*turn)
        step={'disk:ad':3,'disk:be':3,'ring:zc':3}
        cursor=step.get(key,0)
        a=math.pi/2-2*math.pi*min(cursor,3)*u/26
        pointer.location=(.30*math.cos(a),.02+.30*math.sin(a),.027)
        pointer.rotation_euler=(0,0,a-math.pi/2)
        flips={'disk:cat':3,'disk:three':3}
        n=flips.get(key,0)
        for i,r in enumerate(cat_g):place_tile(r,((i-1)*.107,-.34,.02),flip=seg(u,i/3,min(1,(i+1)/3)) if n else 0,vis=True)
        if key=='disk:turn':
            set_hand('kai',(pointer.location.x,pointer.location.y,.083),yaw=0,pitch=-45)
            HANDS['kai'].scale=(.35,.35,.35)
    if st=='時計':clock_hand.rotation_euler=(0,0,-2*math.pi*seg(t,S('clock:tick'),E('clock:tick'))/12)
    if st=='入れ替え':
        for i,v in enumerate(sub_cipher):
            visible=(key=='sub:ex' and i==0 and u>.55) or (key=='sub:cat' and u>(i+1)/4) or key not in ('sub:shuffle','sub:ex','sub:cat')
            show_tree(v,visible)
        for i,v in enumerate(branches):
            show_tree(v,key.startswith(('tab:','tree:')) and u>(i+1)*.13)
        if key.startswith('tab:'):set_hand('kai',(-.35+.70*u,-.15,.085),yaw=0,pitch=-45)
    if st=='枝分かれ':
        for i,group in enumerate(tree_level):
            for obj in group:show_tree(obj,u>(i+.3)/4)
        for i,obj in enumerate(tree_counts):show_tree(obj,u>(i+.8)/4)
    if st=='巻物':scroll_paper.scale.y=1+2.2*seg(t,S('scroll:years'),E('scroll:years'))
    if st=='数える':
        for i,d in enumerate(dolls):show_tree(d,key.startswith('doll:'))
        for i,tag in enumerate(doll_tags):
            tag.data.body=('PRMSKY'[i] if key.startswith('doll:') and (key!='doll:tag' or u>.5) else ABC[i])
        for i,p in enumerate(speech):show_tree(p,key=='doll:talk' and u>(i+1)/11)
        for b,tag,n in freq:
            show_tree(b,key.startswith(('tower:','tw:')) and key!='tw:en')
            show_tree(tag,key.startswith(('tower:','tw:')) and key!='tw:en')
        for b,tag,n in white_freq:
            show_tree(b,key in ('tw:pair','tw:mio','tw:en'))
            show_tree(tag,key in ('tw:pair','tw:mio','tw:en'))
        ephase=key.startswith('e3:')
        for i in range(3):
            flip=seg(u,i*.28+.06,i*.28+.25) if key=='e3:flip' else 0
            place_tile(eee[i],((i-1)*.21,-.01,0),flip=flip,vis=ephase)
            show_tree(xxx[i],False)
        if key=='doll:tag':set_hand('kai',(-.30+.45*u,-.27,.08),yaw=0,pitch=-40)
    if st=='サイコロ':
        for i,d in enumerate(die):
            d.rotation_euler=(.28*math.sin(t*8+i),.21*math.sin(t*6+i*2),.34*math.sin(t*9+i))
    if st=='確かめる':
        level=0 if key=='logic:check' else 1 if key=='logic:hyp' else 2 if key=='logic:if' else 3 if key=='logic:fact' else 4
        show_tree(logic_glass,key=='logic:check');show_tree(logic_handle,key=='logic:check')
        for tile_root in logic_exam:show_tree(tile_root,key=='logic:check')
        for i,(p,w) in enumerate(cards):show_tree(p,i<level);show_tree(w,i<level)
        show_tree(logic_value,False)
        for i,v in enumerate(logic_detail):show_tree(v,i<level)
    if st=='暗号文':
        for i,(b,w) in enumerate(cipher_marks):
            show_tree(b,u>(i+.5)/16);show_tree(w,u>(i+.5)/16)
    if st=='穴埋め':
        # 各候補が現れるのは、その cue の声が始まった後。正本の順番を変えない。
        text1='THE □□□□ □□□□';text2='□□□□ □□ THE';hint='E  T  H'
        if key in ('rows:e','rows:f','rows:f2','rows:f3'):text2='□EET AT THE' if key!='rows:e' else '□EET Q□ THE'
        if key in ('rows:g','rows:h'):text1='TE□□  →  TELL' if key=='rows:h' else 'TE□□'
        if key in ('rows:i','rows:i2','rows:i2b'):text1='THE A□□□ □□LL';text2='□EET AT THE'
        if key in ('rows:i3','rows:i3b'):text1='THE A□M□ □□LL';text2='MEET AT THE'
        if key in ('rows:j','rows:j2','rows:fill'):text1='THE ARMY WILL';text2='MEET AT THE'
        row_plain1.data.body=text1;row_plain2.data.body=text2
        if key in ('rows:f2','rows:f3'):hint='Q = A'
        if key in ('rows:h','rows:i'):hint='G = L'
        if key in ('rows:i2b','rows:i3'):hint='N = M'
        if key in ('rows:i3b','rows:j'):hint='QSNI = ARMY'
        if key in ('rows:j2','rows:fill'):hint='1文字ずつ、穴が埋まる'
        row_hint.data.body=hint
        filling=key=='rows:fill'
        for item in (row_ciph,row_cipher2,row_plain1,row_plain2):show_tree(item,not filling)
        show_tree(row_hint,not filling and key not in ('rows:i2','rows:i2b'))
        for i,item in enumerate(meet_choices):
            show_tree(item,key=='rows:i2' or (key=='rows:i2b' and i==1))
        show_tree(meet_reject,(key=='rows:i2' and u>.55))
        for i,(plate,glyph) in enumerate(fill_cards):
            reveal=filling and u>(i+.25)/len(fill_cards)
            show_tree(plate,reveal);show_tree(glyph,reveal)
        for i,m in enumerate(q_markers):show_tree(m,key=='rows:b' and u>(i+1)/5)
        if key in ('rows:b','rows:e','rows:h','rows:i3b'):
            set_hand('kai',(.32,.24-.10*u,.09),yaw=15,pitch=-40)
    if st=='結末':
        if key=='end:a':carrier.rotation_euler=(0,0,math.pi*seg(t,q['s']+.25,q['e']-.25))
        else:carrier.rotation_euler=(0,0,math.pi)
        if key=='end:b':
            spy_letter.location=(-.22+.44*seg(t,q['s'],q['s']+(q['e']-q['s'])*.47),.12,.024)
            show_tree(spy_copy,u>.47)
            spy_wax.location=(spy_letter.location.x,.12,.031)
            set_hand('cour',(spy_letter.location.x,.05,.1),yaw=-15,pitch=-30)
            set_hand('wal',(.22,.20,.1),yaw=15,pitch=-30)
        else:show_tree(spy_copy,False)
    if st=='追伸':
        show_tree(post_note,key=='end:ps')
        show_tree(post_label,key=='end:ps')
        if key=='end:ps':set_hand('phel',(-.12+.22*u,-.25,.07),yaw=5,pitch=-30)
    if st=='処刑':
        flame.scale.z=.8+.25*math.sin(t*9)
    return q

# 固定カメラを基本にする。場面が変わる位置だけ 1.2 秒で移り、説明中は止める。
CAMERA=bpy.data.cameras.new('gpt_cam')
CAM=bpy.data.objects.new('gpt_cam',CAMERA);link(CAM);SC.camera=CAM
CAMERA.type='PERSP';CAMERA.lens=38;CAMERA.shift_y=-.06
POSES={'手紙':((0,-.01,.02),1.22,-8,61,40),'たる':((0,0,.12),.88,8,39,46),
       'ずらす':((0,0,.01),1.75,0,78,40),'時計':((0,0,.02),.85,0,80,42),
       '入れ替え':((0,0,.02),1.22,0,74,40),'巻物':((0,0,.03),1.17,-6,65,40),
       '枝分かれ':((0,0,.03),1.27,0,76,39),
       '数える':((0,0,.08),1.35,0,55,38),'本':((0,0,.02),1.04,0,72,42),
       'サイコロ':((0,0,.04),1.05,0,60,42),
       '確かめる':((0,0,.02),1.15,0,73,41),'穴埋め':((0,0,.02),1.50,0,82,38),
       '暗号文':((0,0,.02),1.55,0,78,41),
       '解ける':((0,0,.02),1.12,0,77,40),'結末':((0,0,.02),1.55,0,65,38),
       '追伸':((0,0,.02),1.10,0,75,41),'処刑':((0,0,.06),.92,0,62,42),
       '次へ':((0,0,.01),1.09,0,76,42),'挑戦':((0,0,.01),1.08,0,79,42),
       '終わり':((0,0,.01),1.10,0,74,42)}
def set_camera(t,st):
    target,d,az,el,lens=POSES[st]
    az=math.radians(az);el=math.radians(el)
    loc=Vector(target)+Vector((d*math.cos(el)*math.sin(az),-d*math.cos(el)*math.cos(az),d*math.sin(el)))
    CAM.location=loc
    CAM.rotation_euler=(Vector(target)-loc).to_track_quat('-Z','Y').to_euler()
    CAMERA.lens=lens
    CAMERA.dof.use_dof=True;CAMERA.dof.focus_distance=d;CAMERA.dof.aperture_fstop=3.6

def camera_motion():
    return {'frames':NF,'moving_frames':0,'moving_ratio':0.0,'method':'説明中および場面転換は固定姿勢のカット'}
def anchors(t):
    # 今回の 2D の札は固定位置で描く。3D への追従札は使わない。
    return {}
def render_one(t,outdir,scale=None):
    q=apply(t);st=stage_for(q);set_camera(t,st)
    j=round(t*FPS);fp=os.path.join(outdir,'%05d.jpg'%j)
    if os.path.exists(fp) and not A['force']:return False
    SC.render.filepath=fp
    bpy.ops.render.render(write_still=True)
    return True
def main():
    root=os.path.join(CACHE,'blender')
    out=A['out'] or os.path.join(root,'preview' if A['times'] else 'desk')
    os.makedirs(out,exist_ok=True)
    probes=[q['s']+(q['e']-q['s'])*p for q in CUES for p in (.05,.5,.95)] if A['cue_probes'] else None
    times=probes if probes else ([max(q['s'],min(q['e']-.03,(q['s']+q['e'])/2)) for q in CUES] if A['cue_midpoints'] else A['times']) if (A['times'] or A['cue_midpoints']) else [j/FPS for j in range(NF) if
         j%A['every']==0 and (A['from'] is None or j/FPS>=A['from']) and (A['to'] is None or j/FPS<A['to']) and
         (A['ranges'] is None or any(a<=j/FPS<b for a,b in A['ranges']))]
    start=time.time()
    for k,t in enumerate(times):
        if render_one(t,out) and k%30==0:print('render',k,'/',len(times),'t',round(t,2),'elapsed',round(time.time()-start,1),flush=True)
    if not A['times'] and not A['ranges'] and not A['cue_midpoints'] and not A['cue_probes']:
        with open(os.path.join(root,'camera-motion.json'),'w') as f:json.dump(camera_motion(),f,ensure_ascii=False,indent=2)
        desk=os.path.join(root,'desk')
        with open(os.path.join(desk,'anchors.json'),'w') as f:json.dump({'anchors':{}},f)
        with open(os.path.join(desk,'meta.json'),'w') as f:json.dump({'id':CID,'duration':DUR,'frames':NF,'blender_seconds':round(time.time()-start,2)},f)
    print('done',len(times),'frames',round(time.time()-start,2),'seconds',flush=True)
if __name__=='__main__':main()


