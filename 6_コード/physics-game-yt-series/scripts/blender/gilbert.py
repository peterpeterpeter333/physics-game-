# 技術の疑問の鎖 第1話（ys-chain-01）の 3D：ヴェルソリウム（軸に乗った針）と、テレラ（磁石の球）の上の針。
#   Blender -b --factory-startup -P scripts/blender/gilbert.py -- --out /private/tmp/ys/ys-chain-01/blender
#
# 図のために決めた値
#  - ヴェルソリウム：木の台（半径 0.9）、真ちゅうの軸（高さ 1.0）、磁石にしていない金属の針（長さ 1.8）。針の向きは角 ψ（上から見て、x 軸から反時計回り）。
#    琥珀を近づける shot：針ははじめ ψ＝0°。琥珀は針の右前（上から見て −50° の向き）から近づく。近づくと、針は琥珀の向き（−50°）へ回る（動きはゆっくりにしている）。
#    金属の棒の shot：棒が同じように近づいても、針は回らない。
#  - テレラ：半径 1.6 の球。中心に、下（−z）を向いた小さな棒磁石（双極子 m）があるとして、針の向き（北を探す端）を
#      B ∝ 3(m·r̂)r̂ − m　　（m＝(0,0,−1)、r̂＝針の場所の向き）
#    で計算して置く（手で角を入れない）。北の端＝球の上（z＞0）の端。
#    緯度 λ の針の、水平（球の面に沿った向き）からの下向きの傾き I は tan I＝2 tan λ になる（下の assert で確かめる）：
#      λ＝0°→0°、25°→43.0°、51.5°→68.3°、70°→79.7°、85°→87.5°。
#    ロンドンの緯度 51.5° の針は 68.3°。ノーマンが 1581年にロンドンで測った値（71°50′、約72度）とは別もの（図では札で分ける）。
#  - カメラは針の並ぶ面（y＝0）に まっすぐ向ける。だから、画面の上の角は、3D の角と同じ（傾きを図の上で測れる）。
import bpy, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bl_common import *

WOOD = '#7a5634'; BRASS = '#c9a45c'; STEEL = '#c4cde0'; AMBER = '#e39b2f'; RED = '#ff6b6b'; STONE = '#4b5568'; YEL = '#ffe28a'

# ================= ヴェルソリウム =================
NEEDLE_Z = 1.13
def needle_mesh(name, length, width, m):
    """細長いひし形の針（上下に少し厚み）。x 方向が針の向き。"""
    import bmesh
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    L, w, t = length / 2, width / 2, 0.025
    vs = [bm.verts.new(v) for v in ((L, 0, 0), (0, w, 0), (-L, 0, 0), (0, -w, 0), (0, 0, t), (0, 0, -t))]
    for a, b in ((0, 1), (1, 2), (2, 3), (3, 0)):
        bm.faces.new((vs[a], vs[b], vs[4])); bm.faces.new((vs[b], vs[a], vs[5]))
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o)
    o.data.materials.append(m); return o

def build_vers():
    wood = mat('wood', WOOD, rough=.7); brass = mat('brass', BRASS, rough=.3, metal=.8)
    S = {}
    S['base'] = cyl('base', 0.9, 0.14, (0, 0, 0.07), wood, verts=64)
    S['pin'] = cone('pin', 0.06, 0.012, 1.0, (0, 0, 0.62), brass)
    nm = mat('needle', STEEL, rough=.28, metal=.85)
    S['needle'] = needle_mesh('needle', 1.8, 0.16, nm); S['needle'].location = (0, 0, NEEDLE_Z)
    S['cap'] = sphere('cap', 0.05, (0, 0, NEEDLE_Z + 0.02), brass, seg=16, ring=8); parent(S['cap'], S['needle'])
    return S

def lights_vers():
    lights(key=(3, -4, 6), fill=(-5, -3, 3), rim=(-1, 5, 5), power=700, target=(0, 0, 0.8))

V_SIZE = (1000, 700)
CAM_V = ((0.0, -4.6, 3.0), (0, 0, 0.75), 46)

def set_psi(S, deg): S['needle'].rotation_euler = (0, 0, math.radians(deg))

def an_vers(S, i):
    n = S['needle']; mw = n.matrix_world
    a = {'tipR': mw @ Vector((0.9, 0, 0)), 'tipL': mw @ Vector((-0.9, 0, 0)), 'pivot': Vector((0, 0, NEEDLE_Z)), 'base': Vector((0, -0.9, 0.0)), 'pinMid': Vector((0, 0, 0.6))}
    if 'amber' in S: a['amber'] = S['amber'].matrix_world.translation.copy()
    if 'rod' in S: a['rod'] = S['rod'].matrix_world @ Vector((0, 0, 0.6))
    return a

# ---- V1：台・軸・針が組み上がる ----
def b_build():
    S = build_vers(); camera(*CAM_V[:2], lens=CAM_V[2]); lights_vers(); return S
def a_build(S, i):
    u = i / 59
    g1, g2, g3 = seg(u, 0, .25), seg(u, .2, .45), seg(u, .45, .8)
    S['base'].scale = (1, 1, max(g1, 1e-3)); S['base'].hide_render = g1 < .01
    S['pin'].scale = (1, 1, max(g2, 1e-3)); S['pin'].location = (0, 0, 0.12 + 0.5 * g2); S['pin'].hide_render = g2 < .01
    S['needle'].location = (0, 0, NEEDLE_Z + 0.9 * (1 - g3)); S['needle'].hide_render = g3 < .01; S['cap'].hide_render = g3 < .01
    set_psi(S, 20 + 25 * (1 - g3))

# ---- V2：針が軸の上で ゆっくり回る ----
def b_spin():
    S = build_vers(); camera(*CAM_V[:2], lens=CAM_V[2]); lights_vers(); return S
def a_spin(S, i):
    u = i / 71
    set_psi(S, 20 + 110 * ease(u))

# ---- V3：こすった琥珀を近づける → 針が回る ----
AMB_DIR = -50.0
def amber_obj():
    am = mat('amber', AMBER, rough=.22, emit='#ffb347', strength=.25, alpha=.92)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=0.32, location=(0, 0, 0))
    o = bpy.context.active_object; o.name = 'amber'; o.scale = (1.25, 0.85, 0.8)
    d = o.modifiers.new('d', 'DISPLACE'); tx = bpy.data.textures.new('n', 'CLOUDS'); tx.noise_scale = 0.35; d.texture = tx; d.strength = 0.12
    bpy.ops.object.shade_smooth(); o.data.materials.append(am); return o
def amber_pos(r):
    a = math.radians(AMB_DIR); return Vector((r * math.cos(a), r * math.sin(a), NEEDLE_Z))
def b_amber():
    S = build_vers(); camera(*CAM_V[:2], lens=CAM_V[2]); lights_vers()
    S['amber'] = amber_obj(); return S
def a_amber(S, i):
    u = i / 71
    r = 3.2 - 1.95 * seg(u, 0, .45)
    S['amber'].location = amber_pos(r); S['amber'].rotation_euler = (0.3, 0.2, 0.6 + 0.4 * u)
    set_psi(S, 0 + AMB_DIR * seg(u, .4, .95))

# ---- V4：金属の棒を近づけても、針は回らない ----
def b_metal():
    S = build_vers(); camera(*CAM_V[:2], lens=CAM_V[2]); lights_vers()
    S['rod'] = cyl('rod', 0.07, 1.2, (0, 0, 0), mat('rod', '#9aa6bd', rough=.25, metal=.9), verts=24)
    return S
def a_metal(S, i):
    u = i / 47
    r = 3.2 - 1.95 * seg(u, 0, .5); p = amber_pos(r)
    S['rod'].location = (p.x, p.y, NEEDLE_Z + 0.05); S['rod'].rotation_euler = (math.radians(70), 0, math.radians(AMB_DIR + 90))
    set_psi(S, 0)

# ================= テレラ =================
RT = 1.6
LATS = [0.0, 25.0, 51.5, 70.0, 85.0]
LONDON = 2
M = Vector((0, 0, -1))
def field_dir(r):
    rh = r.normalized(); return (3 * M.dot(rh) * rh - M).normalized()
def needle_at(lat):
    l = math.radians(lat); rh = Vector((math.cos(l), 0, math.sin(l))); c = rh * (RT + 0.62)
    b = field_dir(c)
    north_t = Vector((-math.sin(l), 0, math.cos(l)))           # 面に沿って北へ向く向き（水平）
    dip = math.degrees(math.atan2(-b.dot(rh), b.dot(north_t)))  # 水平から下への傾き
    return c, b, rh, north_t, dip
for lat in LATS:
    c, b, rh, nt, dip = needle_at(lat)
    assert abs(math.tan(math.radians(dip)) / (2 * math.tan(math.radians(lat))) - 1) < 1e-5 if lat else abs(dip) < 1e-5  # mathutils は 32 ビットの小数
DIPS = [needle_at(l)[4] for l in LATS]

def stone_mat():
    m = mat('stone', STONE, rough=.55, metal=.35)
    nt = m.node_tree; p = nt.nodes.get('Principled BSDF')
    n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 6.0; n.inputs['Detail'].default_value = 6
    r = nt.nodes.new('ShaderNodeValToRGB'); r.color_ramp.elements[0].color = rgb('#3a4354'); r.color_ramp.elements[1].color = rgb('#5d687e')
    nt.links.new(n.outputs['Fac'], r.inputs['Fac']); nt.links.new(r.outputs['Color'], p.inputs['Base Color'])
    bm = nt.nodes.new('ShaderNodeBump'); bm.inputs['Strength'].default_value = 0.25
    nt.links.new(n.outputs['Fac'], bm.inputs['Height']); nt.links.new(bm.outputs['Normal'], p.inputs['Normal'])
    return m

def compass(name, c, b, rh, mats):
    """針（北を探す端は赤）＋ 球の面から立つ細い柱。b の向きに、針の赤い端を向ける。"""
    root = empty(name, c)
    post = curve(name + '-post', [rh * RT, c - rh * 0.05], 0.022, mats['post'], res=2)
    half = []
    for s, mm in ((1, mats['n']), (-1, mats['s'])):
        cn = cone(name + ('-n' if s > 0 else '-s'), 0.085, 0.0, 0.46, (0, 0, 0), mm, verts=16)
        # 円すいの先（+z）を b の向き（北の端）／逆向き（南の端）へ
        q = (b * s).to_track_quat('Z', 'Y'); cn.rotation_euler = q.to_euler(); cn.location = c + b * s * 0.23
        half.append(cn)
    pivot = sphere(name + '-pv', 0.055, c, mats['post'], seg=12, ring=8)
    for o in half + [post, pivot]: parent(o, root)
    return root

def build_terella(fadeable=False):
    S = {}
    S['ball'] = sphere('terella', RT, (0, 0, 0), stone_mat(), seg=96, ring=48)
    S['pole'] = sphere('pole', 0.07, (0, 0, RT + 0.005), mat('pole', YEL, emit=YEL, strength=1.2), seg=16, ring=8)
    S['eq'] = torus('eq', RT + 0.004, 0.012, (0, 0, 0), mat('eqm', '#9aabc7', rough=.5, alpha=.6), rot=(0, 0, 0), seg=128)
    S['mer'] = torus('mer', RT + 0.004, 0.010, (0, 0, 0), mat('mem', '#9aabc7', rough=.5, alpha=.45), rot=(math.pi / 2, 0, 0), seg=128)
    S['needles'] = []; S['nm'] = []
    for k, lat in enumerate(LATS):
        mats = {'n': mat('n%d' % k, RED, rough=.4, emit=RED, strength=.15, unique=True), 's': mat('s%d' % k, STEEL, rough=.35, metal=.4, unique=True),
                'post': mat('p%d' % k, BRASS, rough=.35, metal=.7, unique=True)}
        c, b, rh, nt, dip = needle_at(lat)
        S['needles'].append(compass('needle%d' % k, c, b, rh, mats)); S['nm'].append(mats)
    return S

def lights_ter():
    lights(key=(-4, -6, 6), fill=(6, -4, 1), rim=(2, 6, 4), power=1300, target=(0, 0, 0))

T_SIZE = (1000, 760)
CAM_T = ((0.95, -17.0, 0.75), (0.95, 0, 0.75), 78)    # y＝0 の面に まっすぐ向ける（傾きなし）

def an_ter(S, i):
    a = {'pole': Vector((0, 0, RT + 0.05)), 'center': Vector((0, 0, 0)), 'eqL': Vector((-RT, 0, 0)), 'top': Vector((0, 0, RT))}
    for k, lat in enumerate(LATS):
        c, b, rh, nt, dip = needle_at(lat)
        a['n%d' % k] = c; a['n%dN' % k] = c + b * 0.46; a['n%dS' % k] = c - b * 0.46; a['n%dH' % k] = c + nt * 0.6; a['n%dsurf' % k] = rh * RT
    return a

def show_needle(S, k, g):
    root = S['needles'][k]; s = max(g, 1e-3); root.scale = (s, s, s)
    for o in root.children: o.hide_render = g < .01

# ---- T1：テレラ（磁石の石の球） ----
def b_ball():
    S = build_terella(); camera(*CAM_T[:2], lens=CAM_T[2]); lights_ter()
    for k in range(len(LATS)): show_needle(S, k, 0)
    return S
def a_ball(S, i):
    u = i / 47
    S['ball'].rotation_euler = (0, 0, math.radians(-40 + 40 * ease(u)))

# ---- T2：針を赤道から北の端へ、順に置く ----
def b_needles():
    S = build_terella(); camera(*CAM_T[:2], lens=CAM_T[2]); lights_ter(); return S
def a_needles(S, i):
    u = i / 89
    for k in range(len(LATS)): show_needle(S, k, seg(u, .04 + k * .17, .04 + k * .17 + .12))

# ---- T3：ロンドンの緯度の針だけを残す ----
def b_london():
    S = build_terella(); camera(*CAM_T[:2], lens=CAM_T[2]); lights_ter()
    for mats in S['nm']:
        for m in mats.values():
            try: m.surface_render_method = 'BLENDED'
            except Exception: pass
    return S
def a_london(S, i):
    u = i / 23; g = seg(u, 0, 1)
    for k, mats in enumerate(S['nm']):
        a = 1 if k == LONDON else 1 - 0.8 * g
        for m in mats.values(): set_alpha(m, a)
    set_emit(S['nm'][LONDON]['n'], '#ff8a7e', .15 + .5 * g)

if __name__ == '__main__':
    info = {'lats': LATS, 'dips': [round(d, 2) for d in DIPS], 'london': LONDON}
    run([
        Shot('vers-build', 60, V_SIZE, b_build, a_build, an_vers),
        Shot('vers-spin', 72, V_SIZE, b_spin, a_spin, an_vers),
        Shot('vers-amber', 72, V_SIZE, b_amber, a_amber, an_vers, info={'amberDir': AMB_DIR}),
        Shot('vers-metal', 48, V_SIZE, b_metal, a_metal, an_vers),
        Shot('terella', 48, T_SIZE, b_ball, a_ball, an_ter, info=info),
        Shot('terella-needles', 90, T_SIZE, b_needles, a_needles, an_ter, info=info),
        Shot('terella-london', 24, T_SIZE, b_london, a_london, an_ter, info=info),
    ], [os.path.abspath(__file__)])
