"""D-1 ニューコメンの機械（前編・後編で共通に使う、新しい模型の部品）。Claude 2026-10-26。

desk_lib（1-1 第6版の机・光・材質・手）と desk_lib_d1（rod・arrow・horse・shell）を、そのまま使う。
今の版の engine()（筒の下のオレンジの輪の重なり、管も弁もない）は使わない。

座標は机の上のメートル（x 右、y 奥、z 上。カメラは手前 -y から見る）。配置図（上から見た図）は
build_machine() の L（寸法の表）と、catalog の d1m_layout_top.jpg を見ること。

使い方（Blender の中で、desk_lib を import した後）：
    import desk_lib_d1_machine_claude_20261026 as mx
    M = mx.build_machine()                 # 全部品を作る（隠しておく）。M['L'] が寸法の表
    mx.show_machine(M, True)               # 見せる（組 'core' 'mine' 'tank' 'jack' 'drain' 'lever' 'plug' 'tap' 'door' 'worker' 'coal' を別に切りかえ可）
    st = mx.idle_state()                   # 状態（dict）。値を変えて
    st['v'] = .5; st['steam_valve'] = 1    #   v＝ピストンの高さ 0（下）〜1（上）、弁 0（閉）〜1（開）…
    mx.apply_machine(M, st, t)             # 1コマの形にする（t は粒の動き用の秒）
    mx.cycle_state(phase)                  # 自動の1往復の状態（phase 0〜1）
    mx.anchors(M, st)                      # 2D の札の引出線の点（世界座標）
状態の項目は idle_state() の説明を見ること。
"""
import math, random
import bpy
from mathutils import Vector
import desk_lib as d
import desk_lib_d1 as ext

rod = ext.rod
arrow = ext.arrow

# ---------------------------------------------------------------- 寸法の表（配置図）
L = dict(
    G=.32, CY=.10,                      # 地上の高さ、機械の奥行きの中心
    DX0=-.53, DX1=.16, DY0=.02, DY1=.18, # 炭鉱の台（ジオラマ）の範囲
    FACE=.04,                            # 断面（切り口）の y
    SX=-.40, SW=.07,                     # 縦の坑の中心と幅（今の版 .044 より太い）
    SUMP=(-.47, -.33, .018, .118),       # 坑の底の広げた所（ポンプが入る）
    GAL=(-.33, -.14, .018, .060),        # 横の坑道
    PR=.03, PB=.024, PT=.108,            # 底のポンプの筒：半径、底、上
    PIPE=.016, PIPE_TOP=.385, SPOUT_Z=.352,
    BX=-.10,                             # ボイラーと筒の x
    FIRE=(-.152, -.048, .052, .148, .32, .366),
    KR=.046, K0=.366, K1=.424, KDOME=.022,  # 鉄の釜：半径、底、肩、丸屋根の高さ
    VZ=.468,                             # 蒸気の弁の高さ
    CR=.036, CB=.492, CT=.594,           # 筒：半径、底、上
    PV=(-.25, .10, .70), ARM=.15, TH=.20,  # 支点、腕の半分の長さ（弧の頭の半径）、傾きの最大（rad）
    TANK=(.05, .13, .60, .65, .08, .07), # 水槽：中心 x,y、底、上、幅、奥行き
    CVZ=.528,                            # 冷水の弁の高さ
    JX=-.315, TUB=(-.32, .10, .024, .022),  # 水槽のポンプの x、くみ上げた水を受ける桶
    DRAIN0=(-.072, .078, .489), DRAIN1=(.018, .064, .372), DTUB=(.022, .062, .017, .018),
    PLUGX=-.045, PLUGY=.060, LEVER=(-.002, .056, .54),
    TAP=(-.188, .050, .43), COAL=(.105, .078, .027),
)
G = L['G']; CY = L['CY']

def _sector_mesh(name, p, r, h, a0, a1, m, n=40, dome=0.0, rings=1):
    """円柱（dome>0 なら上が丸い屋根）の壁の一部。角度は度（0＝+x、-90＝手前）。"""
    p = Vector(p); verts = []; faces = []
    zs = [h * k / rings for k in range(rings + 1)]
    cols = n + 1
    rows = []
    for k, z in enumerate(zs):
        rows.append([])
        for i in range(cols):
            a = math.radians(a0 + (a1 - a0) * i / n)
            verts.append(tuple(p + Vector((r * math.cos(a), r * math.sin(a), z)))); rows[-1].append(len(verts) - 1)
    if dome > 0:
        for k in range(1, 7):
            th = (math.pi / 2) * k / 6; rr = r * math.cos(th); z = h + dome * math.sin(th)
            rows.append([])
            for i in range(cols):
                a = math.radians(a0 + (a1 - a0) * i / n)
                verts.append(tuple(p + Vector((max(rr, .0005) * math.cos(a), max(rr, .0005) * math.sin(a), z)))); rows[-1].append(len(verts) - 1)
    for k in range(len(rows) - 1):
        for i in range(n):
            faces.append((rows[k][i], rows[k][i + 1], rows[k + 1][i + 1], rows[k + 1][i]))
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], faces)
    for f in me.polygons: f.use_smooth = True
    o = d.link(bpy.data.objects.new(name, me)); d.put(o, m)
    s = o.modifiers.new('wall', 'SOLIDIFY'); s.thickness = .0016
    return o

def _alpha_mat(name, color, rough=.5, metal=0.0, alpha=.999):
    m = d.mat(name, color, rough, metal=metal, alpha=alpha)
    try: m.surface_render_method = 'BLENDED'
    except Exception: pass
    return m

def set_alpha(m, a):
    d.principled(m).inputs['Alpha'].default_value = max(0.0, min(1.0, a))

def _hinge(name, hinge, flap_size, flap_off, m, rot=(0, 0, 0)):
    """扉：hinge（世界座標）を軸にする empty と、その子の板。"""
    root = d.empty(name, hinge)
    o = d.box(name + '_plate', flap_size, Vector(hinge) + Vector(flap_off), m, bevel=.0006)
    d.parent(o, root); return root, o

def build_machine(prefix='d1m', with_mine=True):
    """全部品を作る。返す M：部品の辞書。M['groups'][名前]＝その組の物の list。"""
    before_all = set(bpy.data.objects)
    M = {'L': L, 'groups': {}, 'hl': {}}
    def group(name):
        M['_g'] = name; M['_before'] = set(bpy.data.objects)
    def close():
        M['groups'].setdefault(M['_g'], []).extend(list(set(bpy.data.objects) - M['_before']))
    # 材質（色の意味は今の版と同じ：水＝青、蒸気＝白、黄＝弁・たどる線）
    brick = d.mat('d1_brick', '#a0522d', .65); iron = d.mat('d1_iron', '#6a6b69', .36, metal=.65)
    brass = d.mat('d1m_brass', '#c9a44e', .35, metal=.65); wood = d.wood('d1_enginewood', '#8a5a32', '#6f4526')
    dark = d.mat('d1_dark', '#211f1b', .7); white = d.mat('d1_cream', '#f4e8cc', .65)
    glass = _alpha_mat('d1m_glass', '#dcefF4'.lower(), .08, alpha=.16)
    water = _alpha_mat('d1m_water', '#3f7fb0', .3, alpha=.62)
    waterdrop = d.mat('d1m_waterdrop', '#4f93c8', .3)
    steam = _alpha_mat('d1m_steam', '#f6f6f3', .9, alpha=.40)
    steamfill = _alpha_mat('d1m_steamfill', '#f6f6f3', .9, alpha=.30)
    airdot = d.mat('d1m_air', '#eef3f7', .6)
    yellow = d.mat('d1m_valve_yellow', '#ffd23f', .4, emit='#ffd23f', strength=.15)
    red = d.mat('d1m_handle_red', '#d2453a', .4); blue = d.mat('d1m_handle_blue', '#2f7bf0', .4)
    leather = d.mat('d1m_leather', '#7a4a2a', .7); fire = d.mat('d1m_fire', '#ffb34d', .5, emit='#ff872b', strength=3)
    coal = d.mat('d1_coalgloss', '#292929', .25)
    green = d.mat('d1m_tappet_green', '#43b05c', .4); orange = d.mat('d1m_tappet_orange', '#f08a2c', .4)
    M['mats'] = dict(brick=brick, iron=iron, brass=brass, wood=wood, glass=glass, water=water, steam=steam, steamfill=steamfill, yellow=yellow, red=red, blue=blue, leather=leather, fire=fire)
    # 光らせる（札の語に合わせて黄に光る）材質は、部品ごとに写す
    def hlmat(role, base):
        m = base.copy(); m.name = 'd1m_hl_' + role; M['hl'][role] = m; return m
    # ================================================================ 炭鉱の断面のジオラマ
    if with_mine:
        group('mine')
        x0, x1, y0, y1 = L['DX0'], L['DX1'], L['DY0'], L['DY1']
        d.box(prefix + '_base', (x1 - x0 + .02, y1 - y0 + .02, .018), ((x0 + x1) / 2, (y0 + y1) / 2, .009), d.wood('d1_wood', '#9a6234', '#7b4a24'), bevel=.004)
        sx0, sx1 = L['SX'] - L['SW'] / 2, L['SX'] + L['SW'] / 2
        sp = L['SUMP']; ga = L['GAL']
        bands = [(.018, .060, '#8f724f'), (.060, .118, '#53545a'), (.118, .165, '#252629'), (.165, .215, '#727274'), (.215, .245, '#252629'), (.245, .300, '#9a6d45'), (.300, .312, '#7d5a3a'), (.312, .32, '#73934b')]
        for z0, z1, col in bands:
            if z1 <= .060: voids = [(sp[0], ga[1])]
            elif z1 <= .118: voids = [(sp[0], sp[1])]
            else: voids = [(sx0, sx1)]
            xs = [x0]
            segs = []; cur = x0
            for a, b in sorted(voids):
                if a > cur: segs.append((cur, a))
                cur = max(cur, b)
            if cur < x1: segs.append((cur, x1))
            m = d.mat('d1_soil' + col, col, .8)
            for a, b in segs:
                d.box(prefix + '_stratum', (b - a, .12, z1 - z0), ((a + b) / 2, CY, (z0 + z1) / 2), m, bevel=.0008)
        rock = d.mat('d1m_backrock', '#2e2c2a', .85)
        # 空いた所の奥の壁（暗い岩）
        d.box(prefix + '_shaftback', (sx1 - sx0, .01, G - .118), (L['SX'], .165, (G + .118) / 2), rock)
        d.box(prefix + '_sumpback', (sp[1] - sp[0], .01, sp[3] - sp[2]), ((sp[0] + sp[1]) / 2, .165, (sp[2] + sp[3]) / 2), rock)
        d.box(prefix + '_galback', (ga[1] - ga[0], .01, ga[3] - ga[2]), ((ga[0] + ga[1]) / 2, .165, (ga[2] + ga[3]) / 2), rock)
        # 坑の木の枠（坑の口と、坑道の柱）
        for z in [.15, .21, .27]:
            for xx in [sx0 + .002, sx1 - .002]: d.box(prefix + '_shaftframe', (.004, .12, .004), (xx, CY, z), wood, bevel=.0008)
        for a in [-.30, -.24, -.18]: d.box(prefix + '_pitprop', (.004, .006, .042), (a, .046, .039), wood, bevel=.001)
        d.box(prefix + '_galroof', (ga[1] - ga[0], .012, .005), ((ga[0] + ga[1]) / 2, .046, .061), wood, bevel=.001)
        # 坑の口の囲い（地上）
        for xx in [sx0 - .004, sx1 + .004]: d.box(prefix + '_collar', (.008, .12, .012), (xx, CY, G + .006), wood, bevel=.001)
        # 水（坑の底の広げた所と、坑道の水たまり）。高さは apply で変える
        # 坑の底の水：ポンプの筒の手前はあけて（筒の中が見えるように）、左・右・奥の3つの箱
        xa, xb = L['SX'] - L['PR'] - .002, L['SX'] + L['PR'] + .002
        M['sumpwater'] = [d.box(prefix + '_sumpwater_l', (xa - sp[0] - .001, .118, 1), ((sp[0] + xa) / 2, CY, .5), water),
                          d.box(prefix + '_sumpwater_r', (sp[1] - xb - .001, .118, 1), ((xb + sp[1]) / 2, CY, .5), water),
                          d.box(prefix + '_sumpwater_b', (xb - xa, .159 - (CY + L['PR'] + .002), 1), (L['SX'], (.159 + CY + L['PR'] + .002) / 2, .5), water)]
        M['galwater'] = d.box(prefix + '_galwater', (ga[1] - ga[0], .118, 1), ((ga[0] + ga[1]) / 2, CY, .5), water)
        # 水位の目盛り
        d.box(prefix + '_gauge', (.006, .004, .11), (-.322, .034, .075), white, bevel=.001)
        for i in range(9): d.box(prefix + '_gaugetick', (.012, .004, .0014), (-.318, .032, .025 + i * .012), dark)
        M['marker'] = d.box(prefix + '_watermarker', (.018, .007, .005), (-.322, .030, .09), d.mat('d1_yellow', '#ffd23f', .4, emit='#ffd23f', strength=.4), bevel=.001)
        # 坑道からしみ出す水の粒
        M['seep'] = [d.sphere(prefix + '_seep%d' % i, .0025, (0, 0, -5), waterdrop, seg_=10, ring=5) for i in range(10)]
        close()
        # ---------------- 底のポンプ（透明な筒が、そのまま地上までの管になる）
        group('pump')
        SX = L['SX']; PR = L['PR']
        M['barrel'] = _sector_mesh(prefix + '_barrel', (SX, CY, L['PB']), PR, L['PT'] - L['PB'], 0, 360, glass, n=48)
        for z in [L['PB'], L['PT']]: d.torus(prefix + '_barrelrim', PR, .0016, (SX, CY, z), iron)
        # 筒の上の、細くなる所（円すい）
        bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=PR, radius2=L['PIPE'], depth=.012, location=(SX, CY, L['PT'] + .006), end_fill_type='NOTHING')
        cone = bpy.context.view_layer.objects.active; cone.name = prefix + '_reducer'; d.put(cone, glass)
        M['pipe'] = _sector_mesh(prefix + '_risingmain', (SX, CY, L['PT'] + .012), L['PIPE'], L['PIPE_TOP'] - L['PT'] - .012, 0, 360, hlmat('pipe', glass), n=40)
        for z in [.16, .22, .28, L['PIPE_TOP']]: d.torus(prefix + '_piperim', L['PIPE'], .0014, (SX, CY, z), iron)
        # 地上の口（横へ出る樋の口）と、受ける桶、外へ流す樋
        tx, ty, tr, th = L['TUB']
        M['spout'] = rod(prefix + '_spout', (SX + L['PIPE'] - .002, CY, L['SPOUT_Z']), (tx - .012, CY, L['SPOUT_Z'] - .006), .006, glass)
        d.torus(prefix + '_spoutrim', .006, .0012, (tx - .012, CY, L['SPOUT_Z'] - .006), iron, rot=(0, math.pi / 2, 0))
        _sector_mesh(prefix + '_tub', (tx, ty, G), tr, th, 0, 360, wood, n=36)
        d.cyl(prefix + '_tubfloor', tr, .003, (tx, ty, G + .0015), wood)
        for z in [G + .005, G + th - .004]: d.torus(prefix + '_tubhoop', tr + .001, .0012, (tx, ty, z), iron)
        M['tubwater'] = d.cyl(prefix + '_tubwater', tr - .002, 1, (tx, ty, G + .01), water)
        # 外へ流す樋（手前へ下り坂）
        for sgn in [-1, 1]: d.box(prefix + '_trough_side', (.003, .072, .010), (tx + sgn * .008, .045, G + .010), wood, bevel=.0005, rot=(-.08, 0, 0))
        d.box(prefix + '_trough_floor', (.019, .072, .003), (tx, .045, G + .005), wood, bevel=.0005, rot=(-.08, 0, 0))
        M['troughwater'] = d.box(prefix + '_trough_water', (.013, .072, .002), (tx, .045, G + .0075), water, rot=(-.08, 0, 0))
        # 底の弁（筒の底の板と黄の扉、上にだけ開く）
        fz = L['PB'] + .004
        d.cyl(prefix + '_footplate', PR - .001, .004, (SX, CY, fz), iron)
        d.cyl(prefix + '_foothole', .011, .0045, (SX + .008, CY, fz), dark)
        M['foot'], M['footplate_flap'] = _hinge(prefix + '_footvalve', (SX - .004, CY, fz + .0025), (.026, .026, .0025), (.013, 0, .0012), hlmat('foot', yellow))
        # ふた（灰の円板）と、ふたの弁（黄の扉）。棒の先に付く。上下は apply で
        M['bucket'] = d.empty(prefix + '_bucket', (SX, CY, 0))
        b1 = d.cyl(prefix + '_bucketdisc', PR - .0015, .007, (SX, CY, 0), hlmat('bucket', d.mat('d1m_bucketgrey', '#8d8f8f', .4, metal=.4)))
        b2 = d.cyl(prefix + '_buckethole', .010, .0075, (SX + .010, CY, 0), dark)
        b3 = d.torus(prefix + '_bucketleather', PR - .0015, .0018, (SX, CY, 0), leather)
        for o in [b1, b2, b3]: d.parent(o, M['bucket'])
        M['bflap'], M['bflap_plate'] = _hinge(prefix + '_bucketvalve', (SX - .0005, CY, .004), (.024, .024, .0025), (.012, 0, .0012), hlmat('bflap', yellow))
        d.parent(M['bflap'], M['bucket'])
        # 管の中の水の柱（高さは apply で）
        inwater = _alpha_mat('d1m_innerwater', '#5a9fd0', .3, alpha=.34)
        M['column'] = d.cyl(prefix + '_column', L['PIPE'] - .0015, 1, (SX, CY, .5), water)
        M['barrelwater'] = d.cyl(prefix + '_barrelwater', PR - .0015, 1, (SX, CY, .5), inwater)
        M['belowwater'] = d.cyl(prefix + '_belowwater', PR - .0015, 1, (SX, CY, .5), inwater)
        # 水の粒（ふたの上・下・底の弁から入る）
        M['pdrops'] = [d.sphere(prefix + '_pdrop%d' % i, .0036, (0, 0, -5), d.mat('d1m_pumpdrop', '#1f5f9a', .3), seg_=12, ring=6) for i in range(24)]
        M['spoutdrops'] = [d.sphere(prefix + '_sdrop%d' % i, .003, (0, 0, -5), waterdrop, seg_=10, ring=5) for i in range(10)]
        # 空いた所の光（ふたの下）
        M['vacglow'] = d.cyl(prefix + '_vacglow', PR - .003, 1, (SX, CY, .5), _alpha_mat('d1m_vacglow', '#fff3a0', .5, alpha=.35))
        d.set_emit(M['vacglow'].active_material, .8, '#fff3a0')
        # 底の弁へ向かう矢印（まわりの水が押す）
        M['sumparrows'] = [arrow(prefix + '_sumppush%d' % i, (SX + s * .062, CY - .02, .036), (SX + s * .036, CY - .02, .036), .0028) for i, s in enumerate([-1, 1])]
        close()
    # ================================================================ ボイラー（れんがのかまど＋鉄の釜。手前が開く）
    group('core')
    BX = L['BX']; fx0, fx1, fy0, fy1, fz0, fz1 = L['FIRE']
    # かまど：後ろ・左・右の壁と上の板（中の火が見える）
    d.box(prefix + '_fire_back', (fx1 - fx0, .010, fz1 - fz0), ((fx0 + fx1) / 2, fy1 - .005, (fz0 + fz1) / 2), brick, bevel=.0008)
    for xx in [fx0 + .005, fx1 - .005]: d.box(prefix + '_fire_side', (.010, fy1 - fy0, fz1 - fz0), (xx, CY, (fz0 + fz1) / 2), brick, bevel=.0008)
    d.box(prefix + '_fire_floor', (fx1 - fx0, fy1 - fy0, .004), ((fx0 + fx1) / 2, CY, fz0 + .002), dark)
    mortar = d.mat('d1_mortar', '#d9b28d', .7)
    for z in [fz0 + .012, fz0 + .026, fz0 + .040]:
        d.box(prefix + '_fire_mortar', (fx1 - fx0 + .001, .0012, .001), ((fx0 + fx1) / 2, fy1 - .0105, z), mortar)
    # かまどの手前の面（ふた。開ける時に透ける）
    M['cover_brick_mat'] = _alpha_mat('d1m_cover_brick', '#a0522d', .65)
    cf = d.box(prefix + '_cover_fire', (fx1 - fx0, .008, fz1 - fz0), ((fx0 + fx1) / 2, fy0 + .004, (fz0 + fz1) / 2), M['cover_brick_mat'], bevel=.0008)
    d.box(prefix + '_cover_firedoor', (.03, .0025, .02), (BX, fy0 - .0005, fz0 + .016), M['cover_brick_mat'])
    # 石炭と火
    rng = random.Random(7); M['flames'] = []
    for i in range(9):
        d.sphere(prefix + '_firecoal', rng.uniform(.006, .009), (BX + rng.uniform(-.035, .035), CY + rng.uniform(-.03, .03), fz0 + .007), coal, scale=(1, .8, .6), seg_=10, ring=6)
    for i in range(7):
        bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=.008, radius2=0, depth=.024, location=(BX - .03 + i * .01, CY + rng.uniform(-.02, .02), fz0 + .02))
        fl = bpy.context.view_layer.objects.active; fl.name = prefix + '_flame%d' % i; d.put(fl, fire); M['flames'].append(fl)
    M['firelight'] = None
    # 鉄の釜：後ろの壁（260°）と手前の壁（100°、ふた）
    KR, K0, K1, KD = L['KR'], L['K0'], L['K1'], L['KDOME']
    M['kettle'] = _sector_mesh(prefix + '_kettle', (BX, CY, K0), KR, K1 - K0, -40, 220, hlmat('boiler', iron), dome=KD, rings=2)
    M['cover_iron_mat'] = _alpha_mat('d1m_cover_iron', '#6a6b69', .36, metal=.65)
    M['cover_kettle'] = _sector_mesh(prefix + '_cover_kettle', (BX, CY, K0), KR, K1 - K0, 220, 320, M['cover_iron_mat'], dome=KD, rings=2)
    d.cyl(prefix + '_kettlefloor', KR, .003, (BX, CY, K0 + .0015), iron)
    for z in [K0 + .002, K1]: d.torus(prefix + '_kettlerim', KR, .0016, (BX, CY, z), iron)
    # 釜の中の水・泡・蒸気
    M['kwater'] = d.cyl(prefix + '_kettlewater', KR - .002, 1, (BX, CY, .5), water)
    M['bubbles'] = [d.sphere(prefix + '_bubble%d' % i, .0026, (0, 0, -5), _alpha_mat('d1m_bubble', '#e8f4fb', .2, alpha=.7), seg_=10, ring=5) for i in range(14)]
    M['kpuffs'] = [d.sphere(prefix + '_kpuff%d' % i, .011, (0, 0, -5), steam, scale=(1.3, 1.1, .8), seg_=16, ring=8) for i in range(10)]
    # 蒸気の管（透明、真鍮の輪）と蒸気の弁（赤い取っ手）
    VZ = L['VZ']; top_k = K1 + KD
    M['steampipe'] = _sector_mesh(prefix + '_steampipe', (BX, CY, top_k - .002), .0085, L['CB'] - top_k + .002, 0, 360, hlmat('steampipe', glass), n=28)
    for z in [top_k + .004, L['CB'] - .004]: d.torus(prefix + '_steampiperim', .0085, .0014, (BX, CY, z), brass)
    vb = _sector_mesh(prefix + '_steamvalvebody', (BX, CY, VZ - .011), .0135, .022, 0, 360, glass, n=32)
    for z in [VZ - .011, VZ + .011]: d.torus(prefix + '_steamvalverim', .0135, .0018, (BX, CY, z), brass)
    M['svdisc'] = d.empty(prefix + '_svdisc', (BX, CY, VZ))
    disc = d.cyl(prefix + '_svdiscplate', .0115, .0018, (BX, CY, VZ), brass); d.parent(disc, M['svdisc'])
    d.cyl(prefix + '_svspindle', .0022, .03, (BX, CY - .022, VZ), brass, rot=(math.pi / 2, 0, 0))
    M['svhandle'] = d.empty(prefix + '_svhandle', (BX, CY - .036, VZ))
    h = d.box(prefix + '_svhandlebar', (.006, .005, .034), (BX, CY - .036, VZ + .012), hlmat('red', red), bevel=.0015); d.parent(h, M['svhandle'])
    hk = d.sphere(prefix + '_svknob', .0045, (BX, CY - .036, VZ + .029), M['hl']['red']); d.parent(hk, M['svhandle'])
    M['sdrops'] = [d.sphere(prefix + '_steamdot%d' % i, .0042, (0, 0, -5), d.mat('d1m_steamdot', '#ffffff', .8, emit='#ffffff', strength=.25), seg_=12, ring=6) for i in range(8)]
    # ================================================================ 筒（ボイラーの上。手前が透ける。上は開いている）
    CR, CB, CT = L['CR'], L['CB'], L['CT']
    M['cyl'] = _sector_mesh(prefix + '_cylinder', (BX, CY, CB), CR, CT - CB, -40, 220, hlmat('cyl', brass), n=48)
    M['cover_brass_mat'] = _alpha_mat('d1m_cover_brass', '#c9a44e', .35, metal=.65)
    M['cover_cyl'] = _sector_mesh(prefix + '_cover_cylinder', (BX, CY, CB), CR, CT - CB, 220, 320, M['cover_brass_mat'], n=24)
    for z in [CB, CT]: d.torus(prefix + '_cylrim', CR, .0018, (BX, CY, z), brass)
    d.cyl(prefix + '_cylfloor', CR, .004, (BX, CY, CB), iron)
    # ピストン（革の縁、上に薄い水）
    M['piston'] = d.empty(prefix + '_piston', (BX, CY, CB))
    pd = d.cyl(prefix + '_pistondisc', CR - .003, .008, (BX, CY, CB), hlmat('piston', iron)); d.parent(pd, M['piston'])
    pl = d.torus(prefix + '_pistonleather', CR - .0025, .0028, (BX, CY, CB), hlmat('leather', leather)); d.parent(pl, M['piston'])
    M['film'] = d.cyl(prefix + '_pistonwater', CR - .0045, .0022, (BX, CY, CB + .005), water); d.parent(M['film'], M['piston'])
    eye = d.torus(prefix + '_pistoneye', .004, .0012, (BX, CY, CB + .009), iron, rot=(math.pi / 2, 0, 0)); d.parent(eye, M['piston'])
    # 筒の中の蒸気（白）・冷水の霧（青）・たまった水
    M['steamfill'] = d.cyl(prefix + '_steamfill', CR - .004, 1, (BX, CY, .5), steamfill)
    M['cpuffs'] = [d.sphere(prefix + '_cpuff%d' % i, .010, (0, 0, -5), steam, scale=(1.3, 1.2, .9), seg_=16, ring=8) for i in range(8)]
    M['spray'] = [d.sphere(prefix + '_spray%d' % i, .0034, (0, 0, -5), d.mat('d1m_spraydot', '#3f8fd0', .4), seg_=10, ring=5) for i in range(40)]
    M['condensate'] = d.cyl(prefix + '_condensate', CR - .003, 1, (BX, CY, .5), water)
    d.cyl(prefix + '_jet', .003, .006, (BX + .018, CY + .012, CB + .004), iron)
    # 筒の上の空気の粒と、押す矢印
    M['airdots'] = [d.sphere(prefix + '_airdot%d' % i, .0022, (0, 0, -5), airdot, seg_=10, ring=5) for i in range(26)]
    M['innerair'] = [d.sphere(prefix + '_innerair%d' % i, .0024, (0, 0, -5), airdot, seg_=10, ring=5) for i in range(7)]
    M['air_down'] = arrow(prefix + '_airpush', (BX, CY - .012, CT + .034), (BX, CY - .012, CT + .010), .0034)
    M['steam_up'] = arrow(prefix + '_steampush', (BX, CY - .012, CB + .004), (BX, CY - .012, CB + .028), .0034)
    # 支点（れんがの柱）・軸・腕（シーソー、両端は弧の頭）
    PV = Vector(L['PV']); R = L['ARM']
    d.box(prefix + '_pier', (.04, .05, PV.z - .013 - G), (PV.x, CY, (PV.z - .013 + G) / 2), brick, bevel=.002)
    for z in [G + .03, G + .09, G + .15, G + .21, G + .27, G + .33]:
        d.box(prefix + '_piermortar', (.0405, .0012, .001), (PV.x, CY - .0255, z), mortar)
    d.box(prefix + '_piercap', (.05, .06, .008), (PV.x, CY, PV.z - .017), iron, bevel=.001)
    d.cyl(prefix + '_axle', .012, .07, PV, iron, rot=(math.pi / 2, 0, 0))
    M['beam'] = d.empty(prefix + '_beamroot', PV)
    bw = d.box(prefix + '_beam', (.30, .02, .022), PV, hlmat('beam', wood), bevel=.003); d.parent(bw, M['beam'])
    for sgn in [-1, 1]:
        for k in range(10):
            a = math.radians(-13 + 26 * (k + .5) / 10) + (0 if sgn > 0 else math.pi)
            c = PV + Vector((R * math.cos(a), 0, R * math.sin(a)))
            seg = d.box(prefix + '_archhead', (.008, .024, .0185), c, wood, bevel=.0015, rot=(0, -a + (math.pi if sgn < 0 else 0), 0))
            d.parent(seg, M['beam'])
        for k in [-1, 1]:
            a = math.radians(-6.5 * k) + (0 if sgn > 0 else math.pi)
            st = rod(prefix + '_archstrut', PV + Vector((sgn * .11, 0, 0)), PV + Vector((R * .97 * math.cos(a + math.radians(5 * k)), 0, R * .97 * math.sin(a + math.radians(5 * k)))), .0028, wood)
            d.parent(st, M['beam'])
    # 鎖（小さな輪の列）
    chm = hlmat('chain', d.mat('d1m_chainiron', '#4a4b4a', .4, metal=.7))
    M['chainP'] = [d.torus(prefix + '_chainP%d' % i, .0026, .0008, (0, 0, -5), chm) for i in range(48)]
    M['chainR'] = [d.torus(prefix + '_chainR%d' % i, .0026, .0008, (0, 0, -5), chm) for i in range(24)]
    close()
    # ================================================================ 炭鉱へ下りる重い木の棒（継ぎ目の鉄の帯）
    group('rod')
    rodwood = hlmat('minerod', d.wood('d1m_rodwood', '#9a6a3a', '#7a4e28'))
    M['minerod'] = d.empty(prefix + '_minerodroot', (L['SX'], CY, 0))
    top = PV.z - .06; bottom = .068  # 中の位置（v=.5）
    n = 8; seglen = (top - bottom) / n
    bandm = hlmat('bands', d.mat('d1m_band', '#3d3e3e', .35, metal=.7))
    for k in range(n):
        z = bottom + seglen * (k + .5)
        o = d.box(prefix + '_rodseg', (.0075, .0075, seglen - .002), (L['SX'], CY, z), rodwood, bevel=.0008); d.parent(o, M['minerod'])
        if k:
            b = d.box(prefix + '_rodband', (.0105, .0105, .006), (L['SX'], CY, bottom + seglen * k), bandm, bevel=.0006); d.parent(b, M['minerod'])
    eye = d.torus(prefix + '_rodeye', .004, .0012, (L['SX'], CY, top + .003), iron, rot=(math.pi / 2, 0, 0)); d.parent(eye, M['minerod'])
    M['rod_top0'] = top; M['rod_bottom0'] = bottom
    # たどる黄の線（腕の先から底のポンプまで）
    M['trace'] = rod(prefix + '_trace', (L['SX'] - .009, CY - .012, .05), (L['SX'] - .009, CY - .012, PV.z), .0022, d.mat('d1_trace_yellow', '#ffd23f', .45, emit='#ffd23f', strength=.6))
    close()
    # ================================================================ 高い所の水槽・冷水の管と弁（青い取っ手）
    group('tank')
    tx, ty, tz0, tz1, tw, tdp = L['TANK']
    for xx in [tx - tw / 2 + .006, tx + tw / 2 - .006]:
        for yy in [ty - tdp / 2 + .006, ty + tdp / 2 - .006]:
            d.box(prefix + '_tankleg', (.007, .007, tz0 - G), (xx, yy, (tz0 + G) / 2), wood, bevel=.001)
    for z in [G + .09, G + .19]:
        d.box(prefix + '_tankbrace', (tw - .01, .004, .004), (tx, ty - tdp / 2 + .006, z), wood)
        d.box(prefix + '_tankbrace', (tw - .01, .004, .004), (tx, ty + tdp / 2 - .006, z), wood)
    tankwood = hlmat('tank', d.wood('d1m_tankwood', '#9a6234', '#7b4a24'))
    d.box(prefix + '_tankfloor', (tw, tdp, .006), (tx, ty, tz0 + .003), tankwood, bevel=.001)
    d.box(prefix + '_tankback', (tw, .005, tz1 - tz0), (tx, ty + tdp / 2 - .0025, (tz0 + tz1) / 2), tankwood, bevel=.001)
    for xx in [tx - tw / 2 + .0025, tx + tw / 2 - .0025]: d.box(prefix + '_tankside', (.005, tdp, tz1 - tz0), (xx, ty, (tz0 + tz1) / 2), tankwood, bevel=.001)
    # 手前の板は低い（中の水が見える）
    d.box(prefix + '_tankfront', (tw, .005, (tz1 - tz0) * .45), (tx, ty - tdp / 2 + .0025, tz0 + (tz1 - tz0) * .225), tankwood, bevel=.001)
    for z in [tz0 + .008, tz1 - .006]: d.box(prefix + '_tankhoop', (tw + .002, .002, .003), (tx, ty - tdp / 2 - .0005, z), iron)
    M['tankwater'] = d.box(prefix + '_tankwater', (tw - .01, tdp - .01, 1), (tx, ty, .5), water)
    cx = tx; cyy = .12; CVZ = L['CVZ']; CB = L['CB']
    M['coldpipe'] = [
        _sector_mesh(prefix + '_coldpipe_v', (cx, cyy, CB + .005), .0055, tz0 - CB - .005, 0, 360, hlmat('coldpipe', glass), n=20),
        rod(prefix + '_coldpipe_h', (cx, cyy, CB + .005), (BX + .029, cyy, CB + .005), .0055, M['hl']['coldpipe']),
    ]
    d.sphere(prefix + '_coldelbow', .0062, (cx, cyy, CB + .005), brass)
    for z in [CB + .02, tz0 - .004]: d.torus(prefix + '_coldrim', .0055, .0012, (cx, cyy, z), brass)
    _sector_mesh(prefix + '_coldvalvebody', (cx, cyy, CVZ - .009), .011, .018, 0, 360, glass, n=28)
    for z in [CVZ - .009, CVZ + .009]: d.torus(prefix + '_coldvalverim', .011, .0016, (cx, cyy, z), brass)
    M['cvdisc'] = d.empty(prefix + '_cvdisc', (cx, cyy, CVZ))
    disc = d.cyl(prefix + '_cvdiscplate', .0095, .0016, (cx, cyy, CVZ), brass); d.parent(disc, M['cvdisc'])
    d.cyl(prefix + '_cvspindle', .0018, .03, (cx, cyy - .02, CVZ), brass, rot=(math.pi / 2, 0, 0))
    M['cvhandle'] = d.empty(prefix + '_cvhandle', (cx, cyy - .034, CVZ))
    h = d.box(prefix + '_cvhandlebar', (.006, .005, .030), (cx, cyy - .034, CVZ + .011), hlmat('blue', blue), bevel=.0015); d.parent(h, M['cvhandle'])
    hk = d.sphere(prefix + '_cvknob', .0042, (cx, cyy - .034, CVZ + .026), M['hl']['blue']); d.parent(hk, M['cvhandle'])
    M['cdrops'] = [d.sphere(prefix + '_colddot%d' % i, .0036, (0, 0, -5), waterdrop, seg_=10, ring=5) for i in range(12)]
    close()
    # ================================================================ 水槽のポンプ（腕から下りる細い棒、透明な小さなポンプ）
    group('jack')
    JX = L['JX']; jr = .0095; j0 = G + .004; j1 = G + .058
    _sector_mesh(prefix + '_jackbarrel', (JX, CY, j0), jr, j1 - j0, 0, 360, glass, n=28)
    for z in [j0, j1]: d.torus(prefix + '_jackrim', jr, .0012, (JX, CY, z), iron)
    d.cyl(prefix + '_jackcap', jr + .001, .003, (JX, CY, j1 + .0015), iron)
    d.cyl(prefix + '_jackfoot', jr - .001, .0025, (JX, CY, j0 + .006), iron)
    M['jfoot'], _ = _hinge(prefix + '_jackfootvalve', (JX - .004, CY, j0 + .0075), (.012, .012, .0018), (.006, 0, .0009), yellow)
    M['jbucket'] = d.empty(prefix + '_jackbucket', (JX, CY, 0))
    o = d.cyl(prefix + '_jackbucketdisc', jr - .0012, .004, (JX, CY, 0), d.mat('d1m_bucketgrey', '#8d8f8f', .4, metal=.4)); d.parent(o, M['jbucket'])
    M['jflap'], _ = _hinge(prefix + '_jackbucketvalve', (JX - .004, CY, .0025), (.011, .011, .0016), (.0055, 0, .0008), yellow)
    d.parent(M['jflap'], M['jbucket'])
    M['jrod'] = d.box(prefix + '_jackrod', (.0035, .0035, 1), (JX, CY, .5), hlmat('jackrod', wood))
    M['jwater'] = d.cyl(prefix + '_jackwater', jr - .0012, 1, (JX, CY, .5), water)
    # くみ上げた水を水槽へ送る管（後ろを回る）
    pz = .672; yb = .155
    path = [(JX + jr, CY + .004, j1 - .008), (JX + .02, yb, j1 - .008), (JX + .02, yb, pz), (tx, yb, pz), (tx, ty + .015, pz), (tx, ty + .015, tz1 - .01)]
    M['jpipe'] = []
    for a, b in zip(path, path[1:]):
        M['jpipe'].append(rod(prefix + '_jackpipe', a, b, .0042, hlmat('jackpipe', glass)))
        d.sphere(prefix + '_jackelbow', .0046, b, brass)
    M['jpath'] = path
    M['jdrops'] = [d.sphere(prefix + '_jackdot%d' % i, .0032, (0, 0, -5), waterdrop, seg_=10, ring=5) for i in range(14)]
    close()
    # ================================================================ 排水の管（下り坂）と、外へだけ開く弁、横の小さな桶
    group('drain')
    a = Vector(L['DRAIN0']); b = Vector(L['DRAIN1'])
    M['drainpipe'] = rod(prefix + '_drainpipe', a, b, .0065, hlmat('drainpipe', d.mat('d1m_drainglass', '#cfd8db', .2, alpha=.35)))
    d.sphere(prefix + '_drainelbow', .0068, a, iron)
    rim = d.torus(prefix + '_drainrim', .0068, .0014, b, iron); rim.rotation_euler = (b - a).to_track_quat('Z', 'Y').to_euler()
    dx, dy, dr, dh = L['DTUB']
    _sector_mesh(prefix + '_draintub', (dx, dy, G), dr, dh, 0, 360, wood, n=32)
    d.cyl(prefix + '_draintubfloor', dr, .003, (dx, dy, G + .0015), wood)
    d.torus(prefix + '_draintubhoop', dr + .001, .0011, (dx, dy, G + dh - .003), iron)
    M['dtubwater'] = d.cyl(prefix + '_draintubwater', dr - .002, 1, (dx, dy, G + .01), water)
    # 扉：管の口の上の縁を軸に、外（口の先の向き）へだけ開く
    dirv = (b - a).normalized()
    M['drain_dir'] = dirv
    base = dirv.to_track_quat('Z', 'Y'); M['dflap_base'] = base.to_euler(); Rm = base.to_matrix()
    hinge = b + Rm @ Vector((0, .0088, .0016))
    plate = d.box(prefix + '_drainflapplate', (.0185, .0185, .0022), b + Rm @ Vector((0, 0, .0016)), hlmat('drainflap', yellow), bevel=.0006, rot=M['dflap_base'])
    M['dflap'] = d.empty(prefix + '_drainflap', hinge); M['dflap'].rotation_euler = M['dflap_base']
    d.parent(plate, M['dflap'])
    M['ddrops'] = [d.sphere(prefix + '_draindot%d' % i, .0034, (0, 0, -5), waterdrop, seg_=10, ring=5) for i in range(10)]
    M['dair'] = [d.sphere(prefix + '_drainair%d' % i, .0028, (0, 0, -5), airdot, seg_=10, ring=5) for i in range(8)]
    out = b + dirv * .028
    M['drain_out_arrow'] = arrow(prefix + '_drainoutside', out + Vector((0, -.004, 0)), b + dirv * .006 + Vector((0, -.004, 0)), .0028)
    M['drain_in_arrow'] = arrow(prefix + '_draininside', a + dirv * .012 + Vector((0, -.004, 0)), a + dirv * .050 + Vector((0, -.004, 0)), .0028)
    M['drain_in_arrow_long'] = arrow(prefix + '_draininsidelong', a + dirv * .012 + Vector((0, -.004, 0)), a + dirv * .056 + Vector((0, -.004, 0)), .0030)
    close()
    # ================================================================ 切りかえのレバー（真鍮、先に丸い重り、2本の腕）と弁の棒（黒）と出っぱり2つ
    group('lever')
    LP = Vector(L['LEVER'])
    # レバーの軸受け：水槽の台の脚から出た腕
    rod(prefix + '_leverbracket', LP + Vector((0, .004, 0)), Vector((L['TANK'][0] - L['TANK'][4] / 2 + .006, L['TANK'][1] - L['TANK'][5] / 2 + .006, LP.z)), .0025, iron)
    d.cyl(prefix + '_leverpin', .003, .012, LP + Vector((0, .002, 0)), iron, rot=(math.pi / 2, 0, 0))
    M['lever'] = d.empty(prefix + '_lever', LP)
    lb = hlmat('lever', brass)
    # 打たれる腕（左、弁の棒の通り道へ）：長さ .034、0° のとき -x 向き
    o = d.box(prefix + '_leverstrike', (.034, .004, .005), LP + Vector((-.017, -.004, 0)), lb, bevel=.0012); d.parent(o, M['lever'])
    # 重りの腕（0° のとき上向き）と丸い重り
    be = math.radians(-30); wv = Vector((math.sin(be), 0, math.cos(be)))
    o = d.box(prefix + '_leverweightarm', (.004, .004, .030), LP + Vector((0, -.004, 0)) + wv * .015, lb, bevel=.0012, rot=(0, be, 0)); d.parent(o, M['lever'])
    o = d.sphere(prefix + '_leverweight', .0078, LP + Vector((0, -.004, 0)) + wv * .032, lb, seg_=24, ring=12); d.parent(o, M['lever'])
    # 2本のつなぎ（赤・青の取っ手へ）は apply で引き直す
    M['link_red'] = rod(prefix + '_linkred', (0, 0, 0), (0, 0, 1), .0012, brass)
    M['link_blue'] = rod(prefix + '_linkblue', (0, 0, 0), (0, 0, 1), .0012, brass)
    # 出っぱりの通り道（緑・橙の線）
    gl = _alpha_mat('d1m_path_green', '#43b05c', .5, alpha=.30); ol = _alpha_mat('d1m_path_orange', '#f08a2c', .5, alpha=.30)
    d.set_emit(gl, .5, '#43b05c'); d.set_emit(ol, .5, '#f08a2c')
    M['path_green'] = d.box(prefix + '_pathgreen', (.016, .0012, .075), (L['PLUGX'] + .008, LP.y - .010, LP.z), gl)
    M['path_orange'] = d.box(prefix + '_pathorange', (.012, .0012, .075), (L['PLUGX'] + .022, LP.y - .010, LP.z), ol)
    close()
    group('plug')
    M['plug'] = d.empty(prefix + '_plugroot', (L['PLUGX'], L['PLUGY'], 0))
    PZ = L['PV'][2]; LZ = L['LEVER'][2]
    pr = d.box(prefix + '_plugrod', (.0062, .0062, PZ - (LZ - .07)), (L['PLUGX'], L['PLUGY'], (PZ + LZ - .07) / 2), hlmat('plug', d.mat('d1m_plugblack', '#1e1e1e', .4)), bevel=.0008); d.parent(pr, M['plug'])
    # 腕の先から横に出た腕木（腕と一緒に回る）。弁の棒はここから下がる
    br = rod(prefix + '_plugbracket', Vector(L['PV']) + Vector((.15, 0, .0)), Vector((L['PLUGX'] + .003, L['PLUGY'], PZ)), .003, iron); d.parent(br, M['beam'])
    # 下の出っぱり（緑、短い）と上の出っぱり（橙、長い）。0 の位置は v=.5
    M['tap_green'] = d.box(prefix + '_tappetgreen', (.016, .007, .005), (L['PLUGX'] + .008, L['PLUGY'], LZ - .0371), hlmat('green', green), bevel=.001); d.parent(M['tap_green'], M['plug'])
    M['tap_orange'] = d.box(prefix + '_tappetorange', (.028, .007, .005), (L['PLUGX'] + .014, L['PLUGY'], LZ + .0606), hlmat('orange', orange), bevel=.001); d.parent(M['tap_orange'], M['plug'])
    close()
    # ================================================================ 水道の蛇口の小さな模型（たとえ）
    group('tap')
    TP = Vector(L['TAP'])
    d.box(prefix + '_tappost', (.016, .016, TP.z - G), (TP.x, TP.y + .01, (TP.z + G) / 2), wood, bevel=.002)
    tapm = d.mat('d1m_tapchrome', '#c7cdd0', .2, metal=.85)
    rod(prefix + '_tapsupply', TP + Vector((0, .01, -.004)), TP + Vector((0, .01, .012)), .004, tapm)
    rod(prefix + '_tapspout', TP + Vector((0, .01, .012)), TP + Vector((0, -.012, .012)), .0035, tapm)
    rod(prefix + '_tapnose', TP + Vector((0, -.012, .012)), TP + Vector((0, -.012, .002)), .0035, tapm)
    M['taphandle'] = d.empty(prefix + '_taphandle', TP + Vector((0, .01, .018)))
    for ang in [0, math.pi / 2]:
        o = d.box(prefix + '_tapcross', (.018, .0035, .0035), TP + Vector((0, .01, .018)), d.mat('d1m_handle_red', '#d2453a', .4), bevel=.001, rot=(0, 0, ang)); d.parent(o, M['taphandle'])
    M['tapstream'] = d.cyl(prefix + '_tapstream', .0032, 1, TP + Vector((0, -.012, -.02)), d.mat('d1m_tapwater', '#2f7fc0', .3))
    d.cyl(prefix + '_tapbasin', .014, .004, TP + Vector((0, -.012, -.030)), d.mat('d1_cream', '#f4e8cc', .65))
    close()
    # ================================================================ 一方にしか開かない扉の模型（たとえ。机の上、ポンプの手前の横）
    group('door')
    DP = Vector((-.33, -.025, 0))
    frame = d.mat('d1m_doorframe', '#6f4526', .55)
    for xx in [-.024, .024]:
        for yy in [-.016, .016]: d.box(prefix + '_doorleg', (.004, .004, .05), DP + Vector((xx, yy, .025)), frame, bevel=.0006)
    for sgn in [-1, 1]:
        d.box(prefix + '_doorframe_x', (.052, .006, .005), DP + Vector((0, sgn * .019, .05)), frame, bevel=.0008)
        d.box(prefix + '_doorframe_y', (.006, .044, .005), DP + Vector((sgn * .026, 0, .05)), frame, bevel=.0008)
    d.box(prefix + '_doorstop', (.040, .030, .0015), DP + Vector((0, 0, .0472)), _alpha_mat('d1m_doorhole', '#2a2520', .8, alpha=.0))
    M['door'], _ = _hinge(prefix + '_doorflap', DP + Vector((-.023, 0, .0535)), (.044, .034, .003), (.022, 0, .0015), yellow)
    M['door_up'] = arrow(prefix + '_doorpushup', DP + Vector((.005, -.024, .005)), DP + Vector((.005, -.024, .042)), .0026)
    M['door_down'] = arrow(prefix + '_doorpushdown', DP + Vector((.005, -.024, .105)), DP + Vector((.005, -.024, .062)), .0026)
    M['door_p'] = DP
    close()
    # ================================================================ 作業着の人形（弁を手で開け閉め）と足場
    group('worker')
    d.box(prefix + '_scaffold', (.20, .03, .005), (-.025, .006, .418), wood, bevel=.001)
    for xx in [-.12, .07]: d.box(prefix + '_scaffoldpost', (.005, .005, .418 - .0), (xx, .006, .209), wood)
    M['worker'] = d.empty(prefix + '_worker', (-.08, .006, .4205))
    overall = d.mat('d1m_overall', '#3a5a8c', .7); skin = d.mat('skin', '#e9b48f', .6); cap = d.mat('d1m_cap', '#8a3b2a', .6)
    parts = [d.sphere(prefix + '_wbody', .011, (-.08, .006, .4205 + .024), overall, scale=(1, .8, 1.5)),
             d.sphere(prefix + '_whead', .0085, (-.08, .006, .4205 + .049), skin),
             d.sphere(prefix + '_wcap', .0088, (-.08, .006, .4205 + .054), cap, scale=(1, 1, .55))]
    for sx in [-.005, .005]: parts.append(d.box(prefix + '_wleg', (.005, .005, .014), (-.08 + sx, .006, .4205 + .007), overall, bevel=.001))
    for o in parts: d.parent(o, M['worker'])
    M['warm'] = d.empty(prefix + '_warm', (-.08, .006, .4205 + .034))
    o = d.box(prefix + '_warmbox', (.004, .004, .026), (-.08, .006, .4205 + .047), overall, bevel=.001); d.parent(o, M['warm'])
    o = d.sphere(prefix + '_whand', .0035, (-.08, .006, .4205 + .061), skin); d.parent(o, M['warm']); d.parent(M['warm'], M['worker'])
    M['wsweat'] = [d.sphere(prefix + '_wsweat%d' % i, .0018, (0, 0, -5), d.mat('d1_cold', '#6fb3e0', .5, alpha=.6), seg_=10, ring=5) for i in range(5)]
    close()
    # ================================================================ 石炭の山（地上、手前の右）
    group('coal')
    rng = random.Random(52); cx, cy_, cr = L['COAL']; M['coalpieces'] = []
    for i in range(36):
        a = rng.random() * 6.28; r = cr * math.sqrt(rng.random()); z = G + .006 + .03 * (1 - r / cr) * rng.random()
        M['coalpieces'].append(d.sphere(prefix + '_coal%d' % i, rng.uniform(.006, .010), (cx + r * math.cos(a), cy_ + r * math.sin(a), z), coal, scale=(1, .8, .7), seg_=10, ring=6))
    close()
    M['all'] = list(set(bpy.data.objects) - before_all)
    M['base'] = {o: (o.location.copy(), o.rotation_euler.copy(), o.scale.copy()) for o in M['all']}
    M['children'] = {}
    for o in M['all']:
        if o.parent is not None: M['children'].setdefault(o.parent, []).append(o)
    for o in M['all']: d.show(o, False)
    return M

# ---------------------------------------------------------------- 状態
def idle_state():
    """状態の項目（数はすべて 0〜1。粒の動きは t で回る）
    v：ピストンの高さ（0 下、1 上）。腕・鎖・炭鉱の棒・ふた・水槽のポンプ・弁の棒が、ここから決まる
    vdir：ふたの動く向き（+1：棒が下がる＝ふたが下がる、-1：上がる、0：止まる）と、その行程の進み vu（0〜1）
    steam_valve・cold_valve：弁の開き（取っ手と中の円板が回る）
    steam_flow・cold_flow：管の中を流れる粒（0 なし〜1）。cold_front：冷水の先頭が管のどこまで来たか（0〜1）
    steam_fill：筒の中の蒸気の量、spray：噴き上がる冷水、condensate：底にたまった水
    kettle_steam：釜の上の蒸気、boil：泡、kwater：釜の水の高さ（0〜1）
    covers：手前の面の不透明さ（1＝閉じている、0.1＝透けて中が見える）
    air_dots：筒の上の空気の粒、air_arrow・steam_arrow：押す矢印
    column：管の中の水の柱の高さ（0 筒の上〜1 地上の口）、spout：地上の口から出る水、sump：坑の底の水の高さ（0〜1）
    bvalve：ふたの弁の開き（None なら行程の向きから決める）、fvalve：底の弁、no_bflap：ふたの弁を外した、leak：すき間から下へ戻る
    drain：排水の弁（0 閉、1 開。-1 は内へ開く＝壊れた）、drain_flow：排水の粒、drain_air：空気の粒、drain_out_arrow・drain_in_arrow(_long)
    jack：水槽のポンプを見せる、tank：水槽の水の高さ（0〜1）、jack_flow：送る管の粒
    lever：レバーの角度（0 左に倒れる＝赤 開・青 閉、1 右に倒れる＝赤 閉・青 開）。show_lever、show_plug、paths
    tap：蛇口の開き、tap_show、door：扉の模型の開き、door_show、door_up・door_down（矢印）
    worker：人形を見せる、worker_x（0 赤〜1 青）、worker_arm（0〜1 手を上げる）、sweat
    hl：{役: 0〜1}（黄に光る。役は M['hl'] の名前）、trace：黄の線の下りた割合、vacglow：ふたの下の空いた所の光
    """
    return dict(v=.5, vdir=0, vu=0.0, steam_valve=0.0, cold_valve=0.0, steam_flow=0.0, cold_flow=0.0, cold_front=1.0,
                steam_fill=0.0, spray=0.0, condensate=0.0, kettle_steam=.6, boil=.4, kwater=.55, fire=1.0, covers=.12,
                air_dots=0.0, air_arrow=0.0, steam_arrow=0.0, column=1.0, spout=0.0, sump=.75, gal=.5,
                bvalve=None, fvalve=None, no_bflap=False, leak=0.0, drain=0.0, drain_flow=0.0, drain_air=0.0,
                drain_out_arrow=0.0, drain_in_arrow=0.0, drain_in_arrow_long=0.0, pdrops=True, column_step=0.0,
                jack=True, tank=.6, jack_flow=0.0, lever=0.0, show_lever=False, show_plug=False, paths=0.0,
                tap=0.0, tap_show=False, door=0.0, door_show=False, door_up=0.0, door_down=0.0,
                worker=False, worker_x=0.0, worker_arm=0.0, sweat=0.0, hl={}, trace=0.0, vacglow=0.0, seep=0.0,
                trough=1.0, tubwater=.6, lever_auto=False, mine=True, coal=1.0, show_drain=True, show_tank=True,
                dtub=.3, cyl_color=None, flash_valves=0.0, sump_arrows=0.0)

def sm(u): u = max(0.0, min(1.0, u)); return u * u * (3 - 2 * u)

def cycle_state(phase, st=None):
    """自動の1往復（phase 0〜1）。0〜.42 ピストンが上がる（蒸気の弁 開）、.42〜.5 弁の切りかえ、.5〜.56 冷水が噴いて空っぽ、
    .56〜.92 空気がピストンを押し下げる、.92〜1 冷水の弁を閉じ、蒸気の弁を開ける。"""
    st = st or idle_state(); p = phase % 1.0
    if p < .42: v = sm(p / .42); vdir = 1; vu = p / .42
    elif p < .56: v = 1.0; vdir = 0; vu = 0
    elif p < .92: v = 1 - sm((p - .56) / .36); vdir = -1; vu = (p - .56) / .36
    else: v = 0.0; vdir = 0; vu = 0
    st.update(v=v, vdir=vdir, vu=vu)
    st['steam_valve'] = 1.0 if p < .42 else 1 - sm((p - .42) / .03) if p < .45 else 0.0 if p < .95 else sm((p - .95) / .03)
    st['cold_valve'] = 0.0 if p < .46 else sm((p - .46) / .03) if p < .49 else 1.0 if p < .90 else 1 - sm((p - .90) / .03)
    st['lever'] = 1.0 if .44 <= p < .93 else 0.0
    st['steam_flow'] = 1.0 if p < .42 else 0.0
    st['cold_flow'] = 1.0 if .49 <= p < .90 else 0.0
    st['steam_fill'] = (min(1.0, .3 + v) if p < .5 else max(0.0, 1 - (p - .5) / .06)) if p < .56 else 0.0
    st['spray'] = 1.0 if .49 <= p < .62 else max(0.0, 1 - (p - .62) / .2) if p < .82 else 0.0
    st['condensate'] = .2 + .5 * sm((p - .5) / .1) if p < .97 else .2
    st['drain'] = sm((p - .02) / .04) * (1 - sm((p - .16) / .04)) if p < .22 else 0.0
    st['drain_flow'] = 1.0 if .03 < p < .18 else 0.0
    st['spout'] = 1.0 if vdir < 0 else .35
    st['jack_flow'] = 1.0 if vdir < 0 else 0.0
    st['air_dots'] = .6
    return st

def _put_chain(links, top, bottom, x, y, show):
    n = len(links); spacing = .0046
    length = max(0.0, top - bottom)
    for i, o in enumerate(links):
        z = top - spacing * i
        vis = show and z >= bottom - .001
        o.location = (x, y, z) if vis else (0, 0, -5)
        o.rotation_euler = (math.pi / 2, 0, (math.pi / 2) * (i % 2))
        d.show(o, vis)

def _flap(root, base_rot, ang, axis='y'):
    r = base_rot.copy() if base_rot is not None else root.rotation_euler.copy()
    root.rotation_euler = r
    root.rotation_euler.y = (base_rot.y if base_rot is not None else 0) - ang

def geometry(M, st):
    """v から、腕の傾き・各点の高さを出す"""
    Lx = M['L']; R = Lx['ARM']; th = Lx['TH'] * (2 * st['v'] - 1)
    pz = Lx['CB'] + .0475 + R * th          # ピストンの上面の基準
    rod_dz = -R * th                         # 炭鉱の棒（ピストンと反対）
    jack_dz = -(Lx['PV'][0] - Lx['JX']) * math.sin(th) * -1
    jack_dz = (Lx['JX'] - Lx['PV'][0]) * th  # 支点より左なので、ピストンと反対の向き
    plug_dz = (Lx['PLUGX'] - Lx['PV'][0]) * th
    return dict(th=th, pz=pz, rod_dz=rod_dz, jack_dz=jack_dz, plug_dz=plug_dz)

def apply_machine(M, st, t):
    Lx = M['L']; g = geometry(M, st); Gz = Lx['G']; BX = Lx['BX']; SX = Lx['SX']; CB = Lx['CB']; CT = Lx['CT']
    # 組の見せ方
    def show_group(name, v):
        for o in M['groups'].get(name, []): d.show(o, v)
    show_group('mine', st['mine']); show_group('pump', st['mine']); show_group('core', True); show_group('rod', True)
    show_group('tank', st['show_tank']); show_group('jack', st['jack']); show_group('drain', st['show_drain'])
    show_group('lever', st['show_lever']); show_group('plug', st['show_plug']); show_group('tap', st['tap_show'])
    show_group('door', st['door_show']); show_group('worker', st['worker']); show_group('coal', st['coal'] > 0)
    # 手前の面（透ける）
    for k in ['cover_brick_mat', 'cover_iron_mat', 'cover_brass_mat']: set_alpha(M[k], st['covers'])
    # 腕
    M['beam'].rotation_euler = (0, -g['th'], 0)
    PV = Vector(Lx['PV']); R = Lx['ARM']
    # ピストンと鎖（弧の頭の右端 x=PV.x+R から真下へ）
    M['piston'].location = (BX, Lx['CY'], g['pz'])
    _put_chain(M['chainP'], PV.z, g['pz'] + .012, PV.x + R, Lx['CY'], True)
    # 炭鉱の棒と鎖
    M['minerod'].location = M['base'][M['minerod']][0] + Vector((0, 0, g['rod_dz']))
    rod_top = M['rod_top0'] + g['rod_dz']
    _put_chain(M['chainR'], PV.z, rod_top + .006, PV.x - R, Lx['CY'], True)
    # ふた（棒の先）
    bz = M['rod_bottom0'] + g['rod_dz']
    if st['mine']:
        M['bucket'].location = (SX, Lx['CY'], bz)
    # 黄の線
    tr = st['trace']
    if tr > 0:
        top = PV.z; bot = top - (top - .05) * tr
        M['trace'].dimensions.z = max(.001, top - bot); M['trace'].location = (SX - .009, Lx['CY'] - .012, (top + bot) / 2)
    d.show(M['trace'], tr > 0)
    # 弁（取っ手は y 軸のまわり。開＝縦、閉＝横。円板も同じ角度：開＝縦で流れを通す）
    for handle, disc, val in [(M['svhandle'], M['svdisc'], st['steam_valve']), (M.get('cvhandle'), M.get('cvdisc'), st['cold_valve'])]:
        if handle is None: continue
        # 取っ手と中の円板は同じ向き：開＝縦（円板のふちが流れに沿う）、閉＝横（円板が通り道をふさぐ）
        ang = (1 - val) * math.pi / 2
        handle.rotation_euler = (0, ang, 0)
        disc.rotation_euler = (0, math.pi / 2 - ang, 0)
    # 管の中の蒸気の粒（釜の上 → 筒の底）
    top_k = Lx['K1'] + Lx['KDOME']
    for i, o in enumerate(M['sdrops']):
        u = (t * 1.6 + i / len(M['sdrops'])) % 1
        z = top_k - .01 + (CB + .01 - top_k + .01) * u
        vis = st['steam_flow'] > 0 and i < len(M['sdrops']) * st['steam_flow'] + .01
        o.location = (BX + .002 * math.sin(i * 2.1 + t * 3), Lx['CY'] - .001, z); d.show(o, vis)
    # 釜：水・泡・蒸気・火
    kz0 = Lx['K0'] + .003; kh = (Lx['K1'] - Lx['K0'] - .006) * st['kwater']
    M['kwater'].dimensions.z = max(.001, kh); M['kwater'].location.z = kz0 + kh / 2
    rng = random.Random(3)
    for i, o in enumerate(M['bubbles']):
        ph = rng.random(); x = BX + rng.uniform(-.035, .035); y = Lx['CY'] + rng.uniform(-.028, .018)
        u = (t * .9 + ph) % 1
        vis = st['boil'] > 0 and i < len(M['bubbles']) * st['boil']
        o.location = (x + .002 * math.sin(t * 5 + i), y, kz0 + kh * u); o.scale = (1 + .6 * u,) * 3; d.show(o, vis)
    for i, o in enumerate(M['kpuffs']):
        a = i / len(M['kpuffs']) * 6.28 + t * .25; r = .022 * ((i % 3) / 2)
        z0 = kz0 + kh + .006; z1 = Lx['K1'] + Lx['KDOME'] * .5
        k = st['kettle_steam']; zz = z0 + (z1 - z0) * min(1.0, (i % 4) / 3) * k + .002 * math.sin(t * 1.3 + i)
        o.location = (BX + r * math.cos(a), Lx['CY'] + .006 + r * math.sin(a) * .5, zz)
        o.scale = (1.3 * (.4 + .6 * k), 1.1 * (.4 + .6 * k), .8 * (.4 + .6 * k)); d.show(o, k > .02 and i < 3 + 7 * k)
    for i, o in enumerate(M['flames']):
        f = st['fire'] * (.75 + .25 * math.sin(t * 9 + i * 1.7)); o.scale = (1, 1, max(.05, f)); d.show(o, st['fire'] > 0)
    # 筒の中：蒸気・霧・たまった水
    pb = g['pz'] - .004; ch = max(.001, pb - CB - .002)
    sf = st['steam_fill']
    M['steamfill'].dimensions.z = ch; M['steamfill'].location.z = CB + .002 + ch / 2; set_alpha(M['steamfill'].active_material, .42 * sf); d.show(M['steamfill'], sf > .02)
    for i, o in enumerate(M['cpuffs']):
        a = i / len(M['cpuffs']) * 6.28 + t * .4; r = .018
        o.location = (BX + r * math.cos(a), Lx['CY'] + r * math.sin(a) * .6, CB + .006 + ch * ((i % 4 + .5) / 4))
        o.scale = (1.3 * sf, 1.2 * sf, .9 * min(1.0, ch / .03) * sf + .001); d.show(o, sf > .05)
    sp = st['spray']; rng = random.Random(11)
    for i, o in enumerate(M['spray']):
        ph = rng.random(); u = (t * 2.2 + ph) % 1; ang = rng.uniform(0, 6.28); spread = rng.uniform(.004, .028)
        h = min(ch, .055) * u * 1.05
        o.location = (BX + .018 - (.018) * u * .3 + spread * u * math.cos(ang), Lx['CY'] + .012 + spread * u * math.sin(ang) * .6, CB + .006 + h - .02 * u * u * (h > .03))
        d.show(o, sp > 0 and i < len(M['spray']) * sp)
    cd = .0015 + .006 * st['condensate']
    M['condensate'].dimensions.z = cd; M['condensate'].location.z = CB + .002 + cd / 2; d.show(M['condensate'], st['condensate'] > .02)
    # 筒の上の空気の粒（漂う）
    rng = random.Random(23)
    for i, o in enumerate(M['airdots']):
        x = BX + rng.uniform(-.034, .034); y = Lx['CY'] + rng.uniform(-.03, .03); z0 = CT + rng.uniform(.004, .06)
        dz = .004 * math.sin(t * 1.1 + i)
        if st['air_arrow'] > 0: z0 = max(g['pz'] + .008, z0 - .015 * st['air_arrow'] * ((t * .5 + rng.random()) % 1))
        o.location = (x + .003 * math.sin(t * .7 + i * 1.3), y, z0 + dz); d.show(o, i < len(M['airdots']) * st['air_dots'])
    # 矢印はピストンについて動く（上＝空気、下＝蒸気。同じ長さ）
    rng = random.Random(29)
    for i, o in enumerate(M['innerair']):
        x = BX + rng.uniform(-.026, .026); y = Lx['CY'] + rng.uniform(-.02, .02)
        z = CB + .008 + min(.02, max(.002, g['pz'] - CB - .014)) * rng.random() + .0015 * math.sin(t * 1.7 + i)
        o.location = (x, y, z); d.show(o, i < len(M['innerair']) * st.get('inner_air', 0))
    f = st.get('film', 1.0); M['film'].scale = (max(.05, f), max(.05, f), 1); d.show(M['film'], f > .02)
    M['air_down'].location = (0, 0, g['pz'] + .012 - (CT + .010)); d.show_tree(M['air_down'], st['air_arrow'] > .01)
    M['steam_up'].location = (0, 0, g['pz'] - .006 - (CB + .028))
    d.show_tree(M['steam_up'], st['steam_arrow'] > .01)
    # 冷水：管の中の粒（先頭 cold_front）と、水槽の水
    tx, ty, tz0, tz1, tw, tdp = Lx['TANK']
    if st['show_tank']:
        lvl = (tz1 - tz0 - .01) * st['tank']; M['tankwater'].dimensions.z = max(.001, lvl); M['tankwater'].location.z = tz0 + .006 + lvl / 2
        path_len_v = tz0 - (CB + .005); path_len_h = tx - (BX + .029); total = path_len_v + path_len_h
        for i, o in enumerate(M['cdrops']):
            u = (t * 1.3 + i / len(M['cdrops'])) % 1
            if u > st['cold_front']: d.show(o, False); continue
            s_ = u * total
            if s_ < path_len_v: pos = (tx, .12, tz0 - s_)
            else: pos = (tx - (s_ - path_len_v), .12, CB + .005)
            o.location = pos; d.show(o, st['cold_flow'] > 0)
    # 炭鉱：水
    if st['mine']:
        sp_ = Lx['SUMP']; h = .012 + (sp_[3] - sp_[2] - .02) * st['sump']
        for o in M['sumpwater']: o.dimensions.z = h; o.location.z = sp_[2] + h / 2
        ga = Lx['GAL']; gh = .004 + .02 * st['gal']; M['galwater'].dimensions.z = gh; M['galwater'].location.z = ga[2] + gh / 2
        M['marker'].location.z = sp_[2] + h
        for i, o in enumerate(M['seep']):
            u = (t * .35 + i * .1) % 1; o.location = (-.31 + .016 * i, .05, .058 - .04 * u); d.show(o, st['seep'] > 0 and u < .9)
        _apply_pump(M, st, t, g, bz)
        # 地上の口から出る水
        tx_, ty_, tr_, th_ = Lx['TUB']
        for i, o in enumerate(M['spoutdrops']):
            u = (t * 1.5 + i / len(M['spoutdrops'])) % 1
            a = Vector((SX + Lx['PIPE'], Lx['CY'], Lx['SPOUT_Z'])); b = Vector((tx_ - .012, Lx['CY'], Lx['SPOUT_Z'] - .006))
            p = a.lerp(b, min(1.0, u * 1.6)) if u < .62 else b + Vector((.004 * (u - .62), 0, -(.03) * (u - .62) / .38))
            o.location = p; d.show(o, st['spout'] > 0 and i < len(M['spoutdrops']) * st['spout'])
        tw_ = .004 + .012 * st['tubwater']; M['tubwater'].dimensions.z = tw_; M['tubwater'].location.z = Gz + .003 + tw_ / 2
        d.show(M['troughwater'], st['trough'] > 0)
    # 水槽のポンプ
    if st['jack']:
        JX = Lx['JX']; jb = Gz + .032 + g['jack_dz'] * .9
        M['jbucket'].location = (JX, Lx['CY'], jb)
        top = (PV.z + (JX - PV.x) * math.sin(g['th'])) - .012
        M['jrod'].dimensions = (.0035, .0035, max(.01, top - jb)); M['jrod'].location = (JX, Lx['CY'], (top + jb) / 2)
        jw_ = max(.002, (Gz + .058 - .004) - (Gz + .012)); M['jwater'].dimensions.z = jw_; M['jwater'].location.z = Gz + .012 + jw_ / 2
        down = st['vdir'] > 0  # 腕の左が下がる＝ジャックのふたも下がる
        M['jflap'].rotation_euler = (0, -(1.1 if down and st['vdir'] != 0 else 0), 0)
        M['jfoot'].rotation_euler = (0, -(1.0 if st['vdir'] < 0 else 0), 0)
        path = [Vector(p) for p in M['jpath']]
        seglen = [(b - a).length for a, b in zip(path, path[1:])]; tot = sum(seglen)
        for i, o in enumerate(M['jdrops']):
            u = (t * .45 + i / len(M['jdrops'])) % 1; s_ = u * tot; p = path[-1]
            for a, b, l in zip(path, path[1:], seglen):
                if s_ <= l: p = a.lerp(b, s_ / l); break
                s_ -= l
            o.location = p; d.show(o, st['jack_flow'] > 0)
    # 排水の弁と粒
    if st['show_drain']:
        base = M['dflap_base']; ang = st['drain']
        M['dflap'].rotation_euler = base
        M['dflap'].rotation_euler.rotate_axis('X', -1.1 * ang)
        a = Vector(Lx['DRAIN0']); b = Vector(Lx['DRAIN1']); dirv = M['drain_dir']
        for i, o in enumerate(M['ddrops']):
            u = (t * 1.2 + i / len(M['ddrops'])) % 1
            p = a.lerp(b, min(1.0, u / .75)) if u < .75 else b + dirv * .01 + Vector((0, 0, -.03 * (u - .75) / .25))
            o.location = p; d.show(o, st['drain_flow'] > 0 and i < len(M['ddrops']) * st['drain_flow'])
        for i, o in enumerate(M['dair']):
            u = (t * 1.0 + i / len(M['dair']) + .05) % 1
            p = a.lerp(b, min(1.0, u / .7)) + Vector((0, -.002, .003)) if u < .7 else b + dirv * (.012 + .03 * (u - .7)) + Vector((0, 0, .02 * (u - .7)))
            o.location = p; d.show(o, st['drain_air'] > 0 and i < len(M['dair']) * st['drain_air'])
        d.show_tree(M['drain_out_arrow'], st['drain_out_arrow'] > .01)
        d.show_tree(M['drain_in_arrow'], st['drain_in_arrow'] > .01)
        d.show_tree(M['drain_in_arrow_long'], st['drain_in_arrow_long'] > .01)
        dx, dy, dr, dh = Lx['DTUB']; w = .003 + .01 * st['dtub']; M['dtubwater'].dimensions.z = w; M['dtubwater'].location.z = Gz + .003 + w / 2
    # レバー・弁の棒
    LP = Vector(Lx['LEVER'])
    if st['show_lever'] or st['show_plug']:
        lv = st['lever']; ang = math.radians(10 - 70 * lv)   # 0：重りが左（打たれる腕は水平、赤 開・青 閉）、1：重りが右（腕は上、赤 閉・青 開）
        M['lever'].rotation_euler = (0, -ang, 0)
        M['plug'].location = M['base'][M['plug']][0] + Vector((0, 0, g['plug_dz']))
        if st['show_lever']:
            # つなぎ：レバーの軸の下の点 → 取っ手の先
            crank = LP + Vector((0, -.008, -.010))
            rh = Vector((BX, Lx['CY'] - .036, Lx['VZ'])); bh = Vector((Lx['TANK'][0], .12 - .034, Lx['CVZ']))
            for o, tgt in [(M['link_red'], rh + Vector((0, -.003, .02))), (M['link_blue'], bh + Vector((0, -.003, .02)))]:
                v_ = tgt - crank; o.location = (crank + tgt) / 2; o.rotation_euler = v_.to_track_quat('Z', 'Y').to_euler(); o.dimensions.z = v_.length
        d.show(M['path_green'], st['paths'] > 0 and st['show_lever']); d.show(M['path_orange'], st['paths'] > 0 and st['show_lever'])
    # 蛇口
    if st['tap_show']:
        M['taphandle'].rotation_euler = (0, 0, st['tap'] * math.pi / 2)
        TP = Vector(Lx['TAP']); s_ = st['tap']; ln = .028 * min(1.0, s_ * 1.5)
        M['tapstream'].dimensions.z = max(.001, ln); M['tapstream'].location = TP + Vector((0, -.012, .001 - ln / 2)); d.show(M['tapstream'], s_ > .2)
    # 扉の模型
    if st['door_show']:
        M['door'].rotation_euler = (0, -1.2 * st['door'], 0)
        d.show_tree(M['door_up'], st['door_up'] > 0); d.show_tree(M['door_down'], st['door_down'] > 0)
    # 人形
    if st['worker']:
        x = -.10 + .15 * st['worker_x']
        M['worker'].location = M['base'][M['worker']][0] + Vector((x + .08, 0, 0))
        M['warm'].rotation_euler = (-1.0 * st['worker_arm'], 0, 0)
        wp = Vector((x, .006, .4205 + .052))
        for i, o in enumerate(M['wsweat']):
            u = (t * 1.4 + i / 5) % 1; o.location = wp + Vector(((i - 2) * .006 + .004 * u * (1 if i % 2 else -1), -.004, .006 + .008 * math.sin(u * math.pi) - .01 * u)); d.show(o, st['sweat'] > 0 and i < 5 * st['sweat'])
    # 石炭の山（減る）
    if st['coal'] > 0:
        n = len(M['coalpieces']); keep = int(round(n * st['coal']))
        for i, o in enumerate(M['coalpieces']): d.show(o, i >= n - keep)
    # 筒の色（赤＝熱い、青＝冷たい）
    if st['cyl_color']:
        col = {'hot': '#c85042', 'cold': '#6fb3e0'}[st['cyl_color']]
        d.principled(M['hl']['cyl']).inputs['Base Color'].default_value = d.rgb(col)
        d.principled(M['cover_brass_mat']).inputs['Base Color'].default_value = d.rgb(col)
    else:
        d.principled(M['hl']['cyl']).inputs['Base Color'].default_value = d.rgb('#c9a44e')
        d.principled(M['cover_brass_mat']).inputs['Base Color'].default_value = d.rgb('#c9a44e')
    # 光る
    for role, m in M['hl'].items():
        d.set_emit(m, .9 * st['hl'].get(role, 0.0), '#ffd23f')
    if st['flash_valves'] > 0:
        for role in ['foot', 'bflap']: d.set_emit(M['hl'][role], .15 + 2.5 * st['flash_valves'], '#ffd23f')
    else:
        for role in ['foot', 'bflap', 'drainflap']:
            if st['hl'].get(role, 0) == 0: d.set_emit(M['hl'][role], .15, '#ffd23f')

def _apply_pump(M, st, t, g, bz):
    """底のポンプの中：ふた・2つの弁・水の粒・水の柱。
    粒 A（8）：ふたの穴を通る水（transfer 0→1 で下→上、leakp 0→1 で上→下、どちらも無ければふたの上に乗る）
    粒 B（8）：底の弁から入る新しい水（refill 0→1 で、まわり → 底の弁 → ふたの下）。refill が無ければ見せない
    vdir/vu だけ渡したときは、そこから transfer・refill・弁の開きを決める（自動の往復）。"""
    Lx = M['L']; SX = Lx['SX']; CY = Lx['CY']; PR = Lx['PR']; PB = Lx['PB']; PT = Lx['PT']
    vdir = st['vdir']; vu = st['vu']
    transfer = st.get('transfer'); refill = st.get('refill'); leakp = st.get('leakp')
    if transfer is None and vdir > 0: transfer = min(1.0, vu * 1.3)
    if refill is None and vdir < 0 and not st['no_bflap']: refill = min(1.0, vu * 1.3)
    if leakp is None and vdir < 0 and st['no_bflap']: leakp = min(1.0, vu * 1.3)
    bopen = st['bvalve'] if st['bvalve'] is not None else (sm(vu / .12) * (1 - sm((vu - .9) / .1)) if vdir > 0 else 0.0)
    fopen = st['fvalve'] if st['fvalve'] is not None else (sm(vu / .12) * (1 - sm((vu - .9) / .1)) if vdir < 0 else 0.0)
    M['bflap'].rotation_euler = (0, -1.15 * bopen, 0)
    M['foot'].rotation_euler = (0, -1.05 * fopen, 0)
    d.show(M['bflap_plate'], not st['no_bflap']); d.show(M['bflap'], not st['no_bflap'])
    fz = PB + .006; bbot = bz - .0035
    below_top = st.get('below_top')
    if below_top is None: below_top = bbot
    below_top = min(below_top, bbot)
    bh = max(.001, below_top - fz); M['belowwater'].dimensions.z = bh; M['belowwater'].location.z = fz + bh / 2
    d.show(M['belowwater'], below_top > fz + .001)
    above0 = bz + .0035
    M['barrelwater'].dimensions.z = max(.001, PT - above0); M['barrelwater'].location.z = (PT + above0) / 2
    col = st['column']; ctop = PT + .012 + (Lx['SPOUT_Z'] + .006 - PT - .012) * col
    if col <= 0: d.show(M['column'], False)
    else:
        M['column'].dimensions.z = max(.001, ctop - PT); M['column'].location.z = (ctop + PT) / 2; d.show(M['column'], True)
    vg = M['vacglow']; gap = bbot - below_top
    if gap > .0015 and st['vacglow'] > 0:
        vg.dimensions.z = gap; vg.location.z = below_top + gap / 2
        set_alpha(vg.active_material, .2 + .35 * st['vacglow']); d.show(vg, True)
    else: d.show(vg, False)
    for o in M['sumparrows']: d.show_tree(o, st.get('sump_arrows', 0) > 0)
    drops = M['pdrops']
    for o in drops: d.show(o, False)
    if not st['pdrops']: return
    rng = random.Random(5)
    hole = Vector((SX + .010, CY - .006, bz)); foot = Vector((SX + .008, CY - .006, fz + .002))
    for i in range(8):
        o = drops[i]; ox = rng.uniform(-.019, .019); oz = rng.uniform(.004, .016)
        above = Vector((SX + ox, CY - .006, bz + .006 + oz)); below = Vector((SX + ox, CY - .006, max(fz + .005, bbot - .003 - oz * .6)))
        if transfer is not None:
            p = max(0.0, min(1.0, transfer * 1.45 - i * .055))
            pos = below.lerp(hole + Vector((0, 0, -.004)), p / .5) if p < .5 else (hole + Vector((0, 0, .004))).lerp(above, (p - .5) / .5)
        elif leakp is not None:
            p = max(0.0, min(1.0, leakp * 1.45 - i * .055))
            pos = above.lerp(hole + Vector((0, 0, .004)), p / .5) if p < .5 else (hole + Vector((0, 0, -.004))).lerp(below, (p - .5) / .5)
        else: pos = above
        pos.z = min(pos.z, PT - .003); pos.z = max(pos.z, fz + .004)
        o.location = pos; d.show(o, True)
    if refill is not None:
        for i in range(8):
            o = drops[8 + i]; ox = rng.uniform(-.017, .017); oz = rng.uniform(.002, .010); side = 1 if i % 2 else -1
            outside = Vector((SX + side * (PR + .010 + .008 * (i % 3)), CY - .006, fz + .004 + .005 * (i % 3)))
            under = Vector((foot.x + side * .006, foot.y, fz - .004))
            inside = Vector((SX + ox, CY - .006, min(bbot - .004, fz + .006 + oz)))
            p = max(0.0, min(1.0, refill * 1.45 - i * .055))
            if p < .45: pos = outside.lerp(under, p / .45)
            elif p < .6: pos = under.lerp(foot + Vector((0, 0, .004)), (p - .45) / .15)
            else: pos = (foot + Vector((0, 0, .004))).lerp(inside, (p - .6) / .4)
            o.location = pos; d.show(o, True)

def mini_engine(name, p, scale=.42):
    """富士山の場面の小さな機械（ボイラー・筒・ピストン・支点・腕）。返す：root、ピストンの上の点（世界）"""
    p = Vector(p); root = d.empty(name, p); objs = []
    brick = d.mat('d1_brick', '#a0522d', .65); iron = d.mat('d1_iron', '#6a6b69', .36, metal=.65); brass = d.mat('d1m_brass', '#c9a44e', .35, metal=.65)
    wood = d.wood('d1_enginewood', '#8a5a32', '#6f4526')
    objs.append(d.box(name + '_fire', (.10, .09, .045), p + Vector((0, 0, .0225)), brick, bevel=.002))
    objs.append(d.cyl(name + '_kettle', .046, .06, p + Vector((0, 0, .075)), iron))
    objs.append(d.sphere(name + '_dome', .046, p + Vector((0, 0, .105)), iron, scale=(1, 1, .5)))
    objs.append(rod(name + '_steampipe', p + Vector((0, 0, .12)), p + Vector((0, 0, .17)), .008, brass))
    objs.append(_sector_mesh(name + '_cyl', p + Vector((0, 0, .17)), .036, .10, -40, 220, brass, n=32))
    objs.append(d.torus(name + '_rim', .036, .0018, p + Vector((0, 0, .27)), brass))
    objs.append(d.cyl(name + '_piston', .033, .008, p + Vector((0, 0, .21)), iron))
    objs.append(d.box(name + '_pier', (.04, .05, .36), p + Vector((-.15, 0, .18)), brick, bevel=.002))
    objs.append(d.box(name + '_beam', (.30, .02, .022), p + Vector((-.15, 0, .38)), wood, bevel=.003))
    objs.append(rod(name + '_chain', p + Vector((0, 0, .38)), p + Vector((0, 0, .214)), .0022, iron))
    objs.append(rod(name + '_rod', p + Vector((-.30, 0, .38)), p + Vector((-.30, 0, .0)), .004, wood))
    for o in objs: d.parent(o, root)
    root.scale = (scale,) * 3
    return root, objs, p + Vector((0, 0, .214 * scale))

def anchors(M, st):
    Lx = M['L']; g = geometry(M, st)
    return {
        'boiler': Vector((Lx['BX'], Lx['CY'] - .05, Lx['K0'] + .03)),
        'fire': Vector((Lx['BX'], Lx['CY'] - .05, Lx['G'] + .02)),
        'steamvalve': Vector((Lx['BX'], Lx['CY'] - .04, Lx['VZ'])),
        'cyl': Vector((Lx['BX'], Lx['CY'] - .04, (Lx['CB'] + Lx['CT']) / 2)),
        'cyltop': Vector((Lx['BX'], Lx['CY'], Lx['CT'] + .01)),
        'piston': Vector((Lx['BX'], Lx['CY'] - .036, g['pz'])),
        'beam': Vector(Lx['PV']),
        'tank': Vector((Lx['TANK'][0], Lx['TANK'][1] - .04, Lx['TANK'][3])),
        'coldvalve': Vector((Lx['TANK'][0], .12 - .036, Lx['CVZ'])),
        'pump': Vector((Lx['SX'], Lx['CY'] - .03, (Lx['PB'] + Lx['PT']) / 2)),
        'bucket': Vector((Lx['SX'], Lx['CY'] - .03, M['rod_bottom0'] + g['rod_dz'])),
        'drain': Vector(Lx['DRAIN1']),
        'jack': Vector((Lx['JX'], Lx['CY'] - .01, Lx['G'] + .06)),
        'lever': Vector(Lx['LEVER']),
        'rodmid': Vector((Lx['SX'], Lx['CY'] - .01, .35)),
        'coal': Vector((Lx['COAL'][0], Lx['COAL'][1], Lx['G'] + .04)),
        'spout': Vector((Lx['TUB'][0], Lx['CY'], Lx['SPOUT_Z'])),
        'door': M['door_p'] + Vector((0, 0, .06)),
        'tap': Vector(Lx['TAP']),
        'plug': Vector((Lx['PLUGX'], Lx['PLUGY'], Lx['LEVER'][2] - .05 + g['plug_dz'])),
    }
