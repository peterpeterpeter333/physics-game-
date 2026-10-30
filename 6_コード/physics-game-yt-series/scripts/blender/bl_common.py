# 技術の疑問の鎖（縦長 vert-v1）の 3D の場面を、Blender で連番の PNG に書き出す共通部品。
# 使い方（画面を開かない）：
#   /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup -P scripts/blender/<場面>.py -- --out <キャッシュ>/blender [--shots a,b] [--every N] [--force]
#   --out    書き出す場所。<out>/<shot>/0000.png … と <out>/<shot>/meta.json（コマ数・大きさ・アンカー・かかった秒）
#   --shots  書き出す shot の名前（コンマ区切り）。省くと全部
#   --every  N コマに1枚だけ書く（下見用。meta.json には preview と書く。本番の前に必ず --every なしで書き直す）
#   --force  meta.json の鍵が同じでも書き直す
# 仕組み：
#   - shot ごとに、空の場面から作り直す（build）→ コマ i ごとに apply(i) で物を動かして、静止画として書く。
#     キーフレームは使わない（コマの中身は i だけで決まる。何度書いても同じ）。
#   - アンカー：shot が名前を付けた 3D の点を、コマごとに画面の画素（左上が原点）に写して meta.json に書く。
#     2D の札・矢印を 3D の物に合わせて置くのに使う（scripts/umech/blender-clip.mjs の banchor）。
#   - 鍵（key）：このファイルと場面のファイルの中身・shot の名前・大きさ・コマ数のハッシュ。同じなら書き直さない。
# 見た目：EEVEE、背景は透明（film_transparent）、色の変換は Standard（16進の色がそのまま出る）。
#   暗い背景（#0b1122）に合う、すっきりした図解の色。光る物（電流の道・電球）は放射の材質。
import bpy, math, json, os, sys, time, hashlib
from mathutils import Vector, Matrix, Euler, Quaternion
from bpy_extras.object_utils import world_to_camera_view

BG = '#0b1122'
_mats = {}

def args():
    a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    o = {'out': None, 'shots': None, 'every': 1, 'force': False}
    i = 0
    while i < len(a):
        if a[i] == '--out': o['out'] = a[i + 1]; i += 2
        elif a[i] == '--shots': o['shots'] = a[i + 1].split(','); i += 2
        elif a[i] == '--every': o['every'] = int(a[i + 1]); i += 2
        elif a[i] == '--force': o['force'] = True; i += 1
        else: raise SystemExit('unknown arg ' + a[i])
    if not o['out']: raise SystemExit('--out が要る')
    return o

def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def rgb(h, a=1.0):
    h = h.lstrip('#')
    return (lin(int(h[0:2], 16)), lin(int(h[2:4], 16)), lin(int(h[4:6], 16)), a)

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    _mats.clear()

def setup(w, h, samples=24, world=BG, world_strength=0.6):
    sc = bpy.context.scene
    sc.render.engine = 'BLENDER_EEVEE'
    sc.render.resolution_x = w; sc.render.resolution_y = h; sc.render.resolution_percentage = 100
    sc.render.film_transparent = True
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.render.image_settings.color_depth = '8'
    sc.render.image_settings.compression = 30
    sc.view_settings.view_transform = 'Standard'
    sc.view_settings.look = 'None'
    sc.view_settings.exposure = 0; sc.view_settings.gamma = 1
    sc.eevee.taa_render_samples = samples
    try: sc.render.use_motion_blur = False
    except Exception: pass
    wd = bpy.data.worlds.new('W'); sc.world = wd; wd.use_nodes = True
    bgn = wd.node_tree.nodes.get('Background')
    bgn.inputs[0].default_value = rgb('#8aa0c4'); bgn.inputs[1].default_value = world_strength
    return sc

def mat(name, color, rough=0.55, metal=0.0, emit=None, strength=0.0, alpha=1.0, unique=False):
    """Principled の材質。emit を渡すと光る。alpha<1 は透ける（dithered）。unique=True で物ごとに別の材質（あとで濃さを変える）。"""
    key = name
    if not unique and key in _mats: return _mats[key]
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = rgb(color)
    p.inputs['Roughness'].default_value = rough
    p.inputs['Metallic'].default_value = metal
    if emit:
        p.inputs['Emission Color'].default_value = rgb(emit)
        p.inputs['Emission Strength'].default_value = strength
    p.inputs['Alpha'].default_value = alpha
    try: m.surface_render_method = 'BLENDED' if alpha < 1 else 'DITHERED'
    except Exception: pass
    m.diffuse_color = rgb(color)
    if not unique: _mats[key] = m
    return m

def set_alpha(m, a):
    m.node_tree.nodes.get('Principled BSDF').inputs['Alpha'].default_value = max(0.0, min(1.0, a))

def set_emit(m, color, strength):
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Emission Color'].default_value = rgb(color)
    p.inputs['Emission Strength'].default_value = strength

def set_color(m, color):
    m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value = rgb(color)

def _link(o):
    bpy.context.scene.collection.objects.link(o)
    return o

def _put(o, m):
    if m is not None:
        o.data.materials.clear(); o.data.materials.append(m)
    return o

def box(name, size, loc, m, bevel=0.0, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name; o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        b = o.modifiers.new('bv', 'BEVEL'); b.width = bevel; b.segments = 3
    return _put(o, m)

def cyl(name, r, depth, loc, m, rot=(0, 0, 0), verts=48, smooth=True):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name
    if smooth:
        bpy.ops.object.shade_auto_smooth(angle=math.radians(40))
    return _put(o, m)

def cone(name, r1, r2, depth, loc, m, rot=(0, 0, 0), verts=32):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r1, radius2=r2, depth=depth, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name
    bpy.ops.object.shade_auto_smooth(angle=math.radians(40))
    return _put(o, m)

def sphere(name, r, loc, m, seg=32, ring=16):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=ring, radius=r, location=loc)
    o = bpy.context.active_object; o.name = name
    bpy.ops.object.shade_smooth()
    return _put(o, m)

def torus(name, R, r, loc, m, rot=(0, 0, 0), seg=96):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=seg, minor_segments=12, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name
    bpy.ops.object.shade_smooth()
    return _put(o, m)

def empty(name, loc=(0, 0, 0)):
    o = bpy.data.objects.new(name, None); o.location = loc
    return _link(o)

def parent(child, par):
    mw = child.matrix_world.copy(); child.parent = par; child.matrix_world = mw

def curve(name, pts, radius, m, closed=False, res=6):
    """折れ線の管（電流の道・導線）。bevel_factor_end を 0→1 にすると、始めから順に描かれる（長さに比例）。"""
    cd = bpy.data.curves.new(name, 'CURVE'); cd.dimensions = '3D'
    cd.bevel_depth = radius; cd.bevel_resolution = res; cd.use_fill_caps = True
    cd.bevel_factor_mapping_start = 'SPLINE'; cd.bevel_factor_mapping_end = 'SPLINE'
    sp = cd.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts): sp.points[i].co = (p[0], p[1], p[2], 1)
    sp.use_cyclic_u = closed
    o = bpy.data.objects.new(name, cd); _link(o)
    if m is not None: cd.materials.append(m)
    return o

def smooth_pts(pts, n=8, frac=0.35, cap=1e9):
    """折れ線の角を丸めた点の列（2次ベジエで角を置き換える）。"""
    if len(pts) < 3: return [Vector(p) for p in pts]
    P = [Vector(p) for p in pts]; out = [P[0]]
    for i in range(1, len(P) - 1):
        a, b, c = P[i - 1], P[i], P[i + 1]
        r = min(min((b - a).length, (c - b).length) * frac, cap)
        p0 = b + (a - b).normalized() * r; p2 = b + (c - b).normalized() * r
        for k in range(n + 1):
            t = k / n; out.append((1 - t) ** 2 * p0 + 2 * (1 - t) * t * b + t * t * p2)
    out.append(P[-1]); return out

def polylen(pts):
    return sum((Vector(pts[i + 1]) - Vector(pts[i])).length for i in range(len(pts) - 1))

def point_at(pts, u):
    """折れ線の長さの割合 u の点。"""
    L = polylen(pts) * max(0.0, min(1.0, u))
    for i in range(len(pts) - 1):
        a, b = Vector(pts[i]), Vector(pts[i + 1]); d = (b - a).length
        if d >= L or i == len(pts) - 2: return a + (b - a) * (min(L, d) / d if d > 0 else 0)
        L -= d
    return Vector(pts[-1])

def camera(loc, target, lens=50, ortho=None, name='Cam'):
    cd = bpy.data.cameras.new(name)
    if ortho: cd.type = 'ORTHO'; cd.ortho_scale = ortho
    else: cd.lens = lens
    cd.clip_start = 0.05; cd.clip_end = 200
    o = bpy.data.objects.new(name, cd); _link(o)
    aim(o, loc, target); bpy.context.scene.camera = o
    return o

def aim(o, loc, target):
    o.location = Vector(loc)
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()

def lights(key=(4, -6, 7), fill=(-6, -3, 3), rim=(0, 6, 5), power=900, target=(0, 0, 0)):
    out = []
    for nm, loc, pw, size in (('Key', key, power, 4), ('Fill', fill, power * 0.35, 6), ('Rim', rim, power * 0.5, 4)):
        ld = bpy.data.lights.new(nm, 'AREA'); ld.energy = pw; ld.size = size
        o = bpy.data.objects.new(nm, ld); _link(o); aim(o, loc, target); out.append(o)
    return out

def face_camera(o, cam_loc):
    o.rotation_euler = (Vector(cam_loc) - o.matrix_world.translation).to_track_quat('Z', 'Y').to_euler()

def project(pt):
    sc = bpy.context.scene
    v = world_to_camera_view(sc, sc.camera, Vector(pt))
    return [round(v.x * sc.render.resolution_x, 2), round((1 - v.y) * sc.render.resolution_y, 2)]

def ease(u):
    u = max(0.0, min(1.0, u)); return u * u * (3 - 2 * u)

def seg(u, a, b):
    return ease((u - a) / max(1e-9, b - a))

class Shot:
    """name：shot の名前（フォルダ名）／frames：コマ数／size：(幅, 高さ) 画素
    build()：場面を作る（空の場面から）。戻り値は apply・anchors が使う辞書
    apply(S, i)：コマ i の状態にする／anchors(S, i)：{名前: 3D の点} を返す（画面の画素に写して書く）"""
    def __init__(self, name, frames, size, build, apply, anchors=None, samples=24, info=None):
        self.name, self.frames, self.size, self.build, self.apply = name, frames, size, build, apply
        self.anchors, self.samples, self.info = anchors, samples, info or {}

def run(shots, sources):
    o = args()
    src = b''.join(open(f, 'rb').read() for f in [__file__] + list(sources))
    total = time.time(); log = []
    for sh in shots:
        if o['shots'] and sh.name not in o['shots']: continue
        d = os.path.join(o['out'], sh.name); os.makedirs(d, exist_ok=True)
        key = hashlib.sha256(src + json.dumps([sh.name, sh.frames, sh.size, sh.samples]).encode()).hexdigest()[:20]
        metaf = os.path.join(d, 'meta.json')
        if not o['force'] and o['every'] == 1 and os.path.exists(metaf):
            old = json.load(open(metaf))
            if old.get('key') == key and not old.get('preview') and all(os.path.exists(os.path.join(d, '%04d.png' % i)) for i in range(sh.frames)):
                print('[blender] 同じ鍵なので書かない', sh.name); log.append((sh.name, 0, 0)); continue
        t0 = time.time()
        reset(); setup(sh.size[0], sh.size[1], sh.samples)
        S = sh.build()
        sc = bpy.context.scene
        anchors = {}; n = 0
        for i in range(sh.frames):
            sh.apply(S, i)
            if sh.anchors:
                for k, p in sh.anchors(S, i).items(): anchors.setdefault(k, []).append(project(p))
            if i % o['every'] and i != sh.frames - 1: continue
            sc.render.filepath = os.path.join(d, '%04d.png' % i)
            bpy.ops.render.render(write_still=True); n += 1
        dt = time.time() - t0
        meta = {'shot': sh.name, 'frames': sh.frames, 'width': sh.size[0], 'height': sh.size[1], 'key': key,
                'preview': o['every'] > 1, 'seconds': round(dt, 1), 'rendered': n, 'anchors': anchors, 'info': sh.info}
        json.dump(meta, open(metaf, 'w'), ensure_ascii=False)
        print('[blender] %s：%d コマ %.1f 秒' % (sh.name, n, dt)); log.append((sh.name, n, dt))
    tt = time.time() - total
    print('[blender] 合計 %.1f 秒' % tt)
    with open(os.path.join(o['out'], 'render-log.txt'), 'a') as f:
        f.write(time.strftime('%Y-%m-%d %H:%M:%S') + ' ' + ' '.join('%s:%d枚/%.1fs' % x for x in log) + ' 合計 %.1fs\n' % tt)
