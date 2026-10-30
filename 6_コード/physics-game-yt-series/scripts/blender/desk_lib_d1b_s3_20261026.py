"""D-1 後編 S3: 二つの揚水ポンプだけを交換する追加ライブラリ。

2026-10-26 Claude S2 指示 2C/E/F・4.1・4.2 用。旧ライブラリ、声、
字幕、語時刻、既存の良いボイラー・筒・排水・レバーには手を入れない。
import だけではモデルを作らない。呼出し側がカメラと字幕の時刻を決める。

追加 state（いずれも省略可能）:
  _s3_pump_detail / _s3_jack_detail: 説明用の断面と背景。
  _s3_pump_arrows: transfer / lift / refill / leak / none。未指定は動作から。
  _s3_pump_level: 既存 column と同じ 0..1。
  _s3_pump_level_z: 水面の世界 z（上記より優先。見せかけの目盛りではない）。
  _s3_jack_level: 水槽の水面、既存 tank と同じ 0..1。

M['s3'] は説明対象を測るための実物だけのリストを role 別に持つ。
背景・矢印・粒は primary リストに混ぜない。既存 API はそのまま使える。
"""
import json
import math
from pathlib import Path

import bpy
from mathutils import Vector

import desk_lib as d
import desk_lib_d1 as ext
import desk_lib_d1_machine_gpt_20261026 as previous

L = dict(previous.L)
geometry = previous.geometry
sm = previous.sm
mini_engine = previous.mini_engine
rod = ext.rod


def idle_state():
    return previous.idle_state()


def cycle_state(phase, st=None):
    return previous.cycle_state(phase, st)


def _clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


def _material(name, color, alpha=1.0, metal=0.0, rough=.25, emit=0.0):
    # 各 M 専用の新材質。既存の共有材質や d.MATS の値は書き換えない。
    material = d.mat(name, color, rough, metal=metal, alpha=alpha,
                     emit=color if emit else None, strength=emit, unique=True)
    node = d.principled(material)
    if 'Specular IOR Level' in node.inputs:
        node.inputs['Specular IOR Level'].default_value = .24
    # 水・ガラスに noise/波/normal のテクスチャは一つも接続しない。
    return material


def _register(M, group, before):
    added = sorted(set(bpy.data.objects) - before, key=lambda obj: obj.name)
    M['groups'].setdefault(group, []).extend(added)
    for obj in added:
        if obj not in M['all']:
            M['all'].append(obj)
        M['base'].setdefault(obj, (obj.location.copy(), obj.rotation_euler.copy(), obj.scale.copy()))
        if obj.parent is not None:
            children = M['children'].setdefault(obj.parent, [])
            if obj not in children:
                children.append(obj)
        d.show(obj, False)
    return added


def _descendants(root):
    out = [root]
    for child in root.children:
        out.extend(_descendants(child))
    return out


def _hide(objects):
    for obj in objects:
        d.show(obj, False)


def _set_rod(obj, a, b):
    a, b = Vector(a), Vector(b)
    direction = b - a
    obj.location = (a + b) / 2
    obj.rotation_euler = direction.to_track_quat('Z', 'Y').to_euler()
    # dimensions setter は未更新のDGの旧寸法を参照し得る。原meshの長さ
    # から絶対scaleを決め、同じ時刻を何回呼んでも半径を変えない。
    height = obj.get('_s3_rest_mesh_height')
    if height is None:
        zs = [vertex.co.z for vertex in obj.data.vertices]
        height = max(.000001, max(zs) - min(zs))
        obj['_s3_rest_mesh_height'] = height
    obj.scale = (1.0, 1.0, max(.0001, direction.length) / height)


def _set_cylinder(obj, z0, z1):
    # ここで使う水/空隙/箱は、すべて高さ1をmeshへ焼いた物。
    # 既知の原寸に対する絶対scaleで、XYの累積膨張を防ぐ。
    obj.scale = (1.0, 1.0, max(.0002, z1 - z0))
    obj.location.z = (z0 + z1) / 2


def _shell(name, x, y, z0, z1, radius, mats):
    rear = previous.original._sector_mesh(name + '_back', (x, y, z0), radius,
                                          z1 - z0, 0, 180, mats['glass_back'], n=32)
    front = previous.original._sector_mesh(name + '_front', (x, y, z0), radius,
                                           z1 - z0, 180, 360, mats['glass_front'], n=32)
    return [rear, front]


def _cut_material(obj, opaque, transparent, inner):
    # 板の前半分だけを見せる断面にする。背面と実開口の内壁は残す。
    obj.data.materials.clear()
    for material in (opaque, transparent, inner):
        obj.data.materials.append(material)
    for face in obj.data.polygons:
        face.material_index = 2 if face.index % 4 == 3 else int(face.center.y < 0)


def _hinged_valve(name, center, radius, hole_x, hole_r, hinge_x,
                  length, width, plate_depth, flap_depth, mats, parent=None):
    """実穴・弁座・板扉・固定軸・軸受・動くナックルがつながる一方弁。

    扉は水平面から上へだけ開く。単なる円盤を傾けて穴と呼ばない。
    半径/扉四隅/棒との隙間は physical_checks() と同じ寸法で検算する。
    """
    center = Vector(center)
    disc = previous._plate_with_hole(name + '_disc', radius, plate_depth,
                                     mats['metal'], center, hole_x=hole_x,
                                     hole_radius=hole_r, n=64)
    _cut_material(disc, mats['metal'], mats['cutmetal'], mats['inner'])
    seat_center = center + Vector((hole_x, 0, plate_depth / 2 + .00025))
    seat = d.torus(name + '_seat', hole_r + .00045, .00055, seat_center, mats['seat'])
    hinge = center + Vector((hinge_x, 0, plate_depth / 2 + .00075))
    root = d.empty(name + '_hinge', hinge)
    panel = d.box(name + '_yellow_door', (length, width, flap_depth),
                  hinge + Vector((length / 2, 0, flap_depth / 2)),
                  mats['yellow'], bevel=min(.00045, flap_depth / 3))
    d.parent(panel, root)
    pin_r = min(.00075, width / 22)
    pin = rod(name + '_fixed_pin', hinge + Vector((0, -width * .64, 0)),
              hinge + Vector((0, width * .64, 0)), pin_r, mats['pin'])
    fixed = [disc, seat, pin]
    moving = [panel]
    for i, sign in enumerate((-1, 1)):
        # 二つの軸受は板へ固定し、固定軸がその穴を実際に貫く。
        lug = previous._plate_with_hole(name + '_fixed_lug%d' % i,
                                        pin_r * 2.6, pin_r * 2.2, mats['metal'],
                                        hinge + Vector((0, sign * width * .58, 0)),
                                        hole_radius=pin_r * 1.13, n=24)
        lug.rotation_euler.x = math.pi / 2
        foot = d.box(name + '_lugfoot%d' % i,
                     (pin_r * 3.2, pin_r * 2.2, plate_depth / 2 + .0015),
                     hinge + Vector((0, sign * width * .58, -.0015)), mats['metal'], bevel=pin_r * .3)
        knuckle = previous._plate_with_hole(name + '_moving_knuckle%d' % i,
                                            pin_r * 1.9, width * .15, mats['yellow'],
                                            hinge + Vector((0, sign * width * .27, 0)),
                                            hole_radius=pin_r * 1.10, n=24)
        knuckle.rotation_euler.x = math.pi / 2
        d.parent(knuckle, root)
        fixed.extend((lug, foot))
        moving.append(knuckle)
    if parent is not None:
        for obj in fixed + [root]:
            d.parent(obj, parent)
    # 弁そのものの寄りは、穴の輪・蝶番・黄の扉を測る。ふた全体の円板は
    # 別の主役であり、寄りに残る灰色の縁を加えて幅を水増ししない。
    detail_primary = [obj for obj in fixed if obj != disc] + moving
    return dict(root=root, panel=panel, disc=disc, seat=seat, fixed=fixed,
                moving=moving, primary=fixed + moving, detail_primary=detail_primary, center=center,
                hinge=hinge, length=length, width=width, hole_x=hole_x,
                hole_r=hole_r, plate_depth=plate_depth, flap_depth=flap_depth)


def _arrow(name, material, width):
    root = d.empty(name)
    stem = rod(name + '_shaft', (0, 0, 0), (0, 0, .02), width, material)
    bpy.ops.mesh.primitive_cone_add(vertices=20, radius1=width * 2.2,
                                    radius2=0, depth=width * 4.4)
    tip = bpy.context.view_layer.objects.active
    tip.name = name + '_tip'
    d.put(tip, material)
    for obj in (stem, tip):
        d.parent(obj, root)
    return dict(root=root, stem=stem, tip=tip, width=width)


def _pose_arrow(arrow, a, b, visible):
    if not visible:
        d.show_tree(arrow['root'], False)
        return
    a, b = Vector(a), Vector(b)
    direction = b - a
    if direction.length < arrow['width'] * 6:
        d.show_tree(arrow['root'], False)
        return
    unit = direction.normalized()
    head = arrow['width'] * 4.4
    _set_rod(arrow['stem'], a, b - unit * head)
    arrow['tip'].location = b - unit * head / 2
    arrow['tip'].rotation_euler = direction.to_track_quat('Z', 'Y').to_euler()
    d.show_tree(arrow['root'], True)


def _new_materials(prefix, radius):
    return dict(
        glass_back=_material(prefix + '_glass_back', '#b7d7dc', .13, rough=.18),
        glass_front=_material(prefix + '_glass_front', '#d6edf0', .035, rough=.18),
        water=_material(prefix + '_smooth_water', '#8ed3ec', .16, rough=.20),
        surface=_material(prefix + '_water_surface', '#91d9ed', .27, rough=.20),
        drop=_material(prefix + '_tracked_drops', '#c4edf6', 1, rough=.25, emit=.12),
        metal=_material(prefix + '_metal', '#9a9b92', 1, metal=.38, rough=.40),
        cutmetal=_material(prefix + '_metal_front_section', '#9a9b92', .08, metal=.1, rough=.40),
        inner=_material(prefix + '_hole_inner', '#45585d', 1, metal=.3, rough=.43),
        seat=_material(prefix + '_seat', '#d1ac55', 1, metal=.45, rough=.33),
        pin=_material(prefix + '_hinge_pin', '#dde1d8', 1, metal=.55, rough=.32),
        yellow=_material(prefix + '_yellow_valves', '#ffd23f', 1, rough=.32, emit=.12),
        leather=_material(prefix + '_leather', '#87522e', 1, rough=.65),
        marker=_material(prefix + '_white_level', '#f0fbff', 1, rough=.30, emit=.20),
        blue=_material(prefix + '_flow_up', '#399bde', 1, rough=.3, emit=.25),
        red=_material(prefix + '_flow_back', '#e6614b', 1, rough=.3, emit=.20),
        glow=_material(prefix + '_empty_space', '#fff2a4', .10, rough=.45, emit=.25),
    )


def add_s3_pumps(M):
    """旧 M にも一度だけ追加可能。既存の休止位置・材質・mesh は上書きしない。"""
    if M.get('_s3_pumps_version'):
        return {'added_objects': [], 'already_applied': True}
    prefix = M['svhandle'].name.rsplit('_svhandle', 1)[0] + '_s3'
    lx = M['L']
    sx, cy, pb, pt = (lx[k] for k in ('SX', 'CY', 'PB', 'PT'))
    # 真横から高さ60%で読める縦長の筒。ただしふた/木の棒の実zと
    # .06mのストロークは拡大しない（棒を伸縮させる物理矛盾を防ぐ）。
    pump_top = .224
    S = M['s3'] = dict(obsolete=[], new_objects=[])
    # 旧式の粒・円盤は表示関数が再表示するため、最後に必ず消す一覧へ保存。
    obsolete = S['obsolete']
    if 'bucket' in M:
        for key in ('foot', 'bflap'):
            obsolete.extend(_descendants(M[key]))
        obsolete.extend(obj for obj in _descendants(M['bucket']) if obj != M['bucket'])
        for key in ('barrel', '_gpt_pump_cover', 'barrelwater', 'belowwater', 'column', 'vacglow'):
            if M.get(key) is not None:
                obsolete.append(M[key])
        for key in ('pdrops', 'sumparrows'):
            for obj in M.get(key, []):
                obsolete.extend(_descendants(obj))
        for obj in M['groups'].get('pump', []):
            if any(word in obj.name for word in ('barrelrim', '_gpt_reducer', '_reducer', '_gpt_footplate', '_piperim')):
                obsolete.append(obj)
        obsolete.append(M['pipe'])
        before = set(bpy.data.objects)
        mats = _new_materials(prefix + '_pump', lx['PR'])
        radius = lx['PR']
        shell = _shell(prefix + '_pumpbody', sx, cy, pb, pump_top, radius, mats)
        rims = [d.torus(prefix + '_pump_rim', radius, .0015, (sx, cy, z), mats['metal'])
                for z in (pb, pump_top)]
        # 薄い透明円すいは、太いポンプから元の地上管へ隙間なく続く。
        bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=radius, radius2=lx['PIPE'],
                                        depth=.012, location=(sx, cy, pump_top + .006), end_fill_type='NOTHING')
        reducer = bpy.context.view_layer.objects.active
        reducer.name = prefix + '_pump_reducer'
        d.put(reducer, mats['glass_back'])
        rising_main = _shell(prefix + '_pump_risingmain', sx, cy, pump_top + .012,
                             lx['PIPE_TOP'], lx['PIPE'], mats)
        rising_rims = [d.torus(prefix + '_risingmain_rim', lx['PIPE'], .0012,
                               (sx, cy, z), mats['metal'])
                       for z in (.26, .32, lx['PIPE_TOP'])]
        foot = _hinged_valve(prefix + '_footvalve', (sx, cy, pb + .004),
                             radius - .0015, .028, .020, .0048, .046, .043,
                             .004, .0020, mats)
        piston = _hinged_valve(prefix + '_pistonvalve', (sx, cy, 0),
                               radius - .0015, .028, .020, .0048, .046, .043,
                               .007, .0020, mats, M['bucket'])
        leather = d.torus(prefix + '_pump_piston_leather', radius - .0012, .0015,
                          (sx, cy, 0), mats['leather'])
        d.parent(leather, M['bucket'])
        above = d.cyl(prefix + '_pump_water_above', radius - .003, 1, (sx, cy, .5), mats['water'], verts=48)
        below = d.cyl(prefix + '_pump_water_below', radius - .003, 1, (sx, cy, .5), mats['water'], verts=48)
        column = d.cyl(prefix + '_pump_water_column', lx['PIPE'] - .0017, 1, (sx, cy, .5), mats['water'], verts=40)
        surface = d.cyl(prefix + '_pump_water_top', radius - .003, .0006, (sx, cy, .5), mats['surface'], verts=48)
        marker = rod(prefix + '_pump_white_level', (sx - .04, cy - .04, .1),
                     (sx + .04, cy - .04, .1), .0011, mats['marker'])
        glow = d.cyl(prefix + '_pump_empty_space', radius - .005, 1, (sx, cy, .5), mats['glow'], verts=40)
        # 旧 .0036m のちょうど2倍。合計8個、旧24個の3分の1。
        drops = [d.sphere(prefix + '_pump_tracked_water%d' % i, .0072,
                          (0, 0, -5), mats['drop'], seg_=16, ring=8) for i in range(8)]
        arrows = {role: _arrow(prefix + '_pump_flow_' + role,
                               mats['red'] if role == 'leak' else mats['blue'], .0025)
                  for role in ('transfer', 'lift', 'refill', 'leak')}
        S['pump'] = dict(mats=mats, shell=shell, rims=rims, reducer=reducer,
                         rising_main=rising_main, rising_rims=rising_rims,
                         foot=foot, piston=piston, leather=leather,
                         above=above, below=below, column=column,
                         surface=surface, marker=marker, glow=glow,
                         drops=drops, arrows=arrows,
                         primary=shell + rims + [reducer] + foot['primary'] + piston['primary'] + [leather],
                         body_primary=shell + rims + foot['primary'] + piston['primary'] + [leather],
                         display_layout=dict(PB=pb, PT=pump_top, PR=radius,
                                             PIPE_START=pump_top + .012, PIPE_TOP=lx['PIPE_TOP']),
                         display_bounds=(sx - radius, sx + radius, cy - radius, cy + radius, pb, pump_top))
        S['new_objects'].extend(_register(M, 'pump', before))
        # 同名の API が新しい実扉を指すので、既存の取り外す動作も使える。
        M['foot'], M['footplate_flap'] = foot['root'], foot['panel']
        M['bflap'], M['bflap_plate'] = piston['root'], piston['panel']
        before = set(bpy.data.objects)
        soil = _material(prefix + '_detail_soil', '#c7b48d', rough=.78)
        backdrop = d.box(prefix + '_pump_detail_backdrop', (.25, .003, .38),
                         (sx, .182, .195), soil, bevel=.001)
        S['backdrop'] = backdrop
        S['detail_walls'] = [obj for obj in M['groups'].get('mine', [])
                             if any(word in obj.name for word in ('stratum', 'shaftback', 'sumpback',
                                                                  'galback', 'shaftframe', 'galroof', 'pitprop'))]
        # 縦長になった筒が岩を貫かないよう、上側の坑も同じ太さに切り取る。
        # 台の外形と地層色は維持。元のmeshは隠すだけで変更しない。
        widened = []
        for obj in list(M['groups'].get('mine', [])):
            zlo, zhi = obj.location.z - obj.dimensions.z / 2, obj.location.z + obj.dimensions.z / 2
            if '_stratum' not in obj.name or zhi <= .118 or zlo >= pump_top + .012:
                continue
            xlo, xhi = obj.location.x - obj.dimensions.x / 2, obj.location.x + obj.dimensions.x / 2
            left, right = sx - radius - .004, sx + radius + .004
            if xhi <= left or xlo >= right:
                continue
            obsolete.append(obj)
            for k, (a, b) in enumerate(((xlo, min(xhi, left)), (max(xlo, right), xhi))):
                if b - a > .0002:
                    widened.append(d.box(prefix + '_wide_shaft_soil',
                                          (b - a, obj.dimensions.y, obj.dimensions.z),
                                          ((a + b) / 2, obj.location.y, obj.location.z),
                                          obj.active_material, bevel=.0008))
        for obj in list(M['groups'].get('mine', [])):
            if '_shaftframe' in obj.name and obj.location.z < pump_top + .012:
                obsolete.append(obj)
                sign = -1 if obj.location.x < sx else 1
                widened.append(d.box(prefix + '_wide_shaft_frame', tuple(obj.dimensions),
                                      (sx + sign * (radius + .004), obj.location.y, obj.location.z),
                                      obj.active_material, bevel=.0008))
        S['detail_walls'].extend(widened)
        S['new_objects'].extend(_register(M, 's3_pump_background', before))
        # 寄りでない時には、土色の板だけでなく新しい地層の切り口を見せる。
        S['wide_shaft'] = widened
        # 元の坑の水は平滑な材質の新しい箱へ交換（共有 water は触らない）。
        before = set(bpy.data.objects)
        obsolete.extend(M['sumpwater'])
        sp = lx['SUMP']
        xa, xb = sx - radius - .002, sx + radius + .002
        bounds = [(sp[0], xa, .022, .157), (xb, sp[1], .022, .157),
                  (xa, xb, cy + radius + .002, .175)]
        sumpwater = []
        for i, (x0, x1, y0, y1) in enumerate(bounds):
            if x1 > x0 and y1 > y0:
                sumpwater.append(d.box(prefix + '_smooth_sumpwater%d' % i,
                                       (x1 - x0, y1 - y0, 1), ((x0 + x1) / 2, (y0 + y1) / 2, .5), mats['water']))
        S['sumpwater'] = sumpwater
        S['new_objects'].extend(_register(M, 'mine', before))
    # 小型ポンプは同じ実穴・扉・蝶番の構造。棒と水槽への経路も連続。
    before = set(bpy.data.objects)
    old_jack = list(M['groups'].get('jack', []))
    obsolete.extend(obj for obj in old_jack if obj not in (M['jrod'], M['jbucket']))
    jx, ground = lx['JX'], lx['G']
    j0, j1, jr = ground + .004, ground + .070, .019
    jm = _new_materials(prefix + '_jack', jr)
    jshell = _shell(prefix + '_jackbody', jx, cy, j0, j1, jr, jm)
    jrims = [d.torus(prefix + '_jack_rim', jr, .0010, (jx, cy, z), jm['metal']) for z in (j0, j1)]
    jfoot = _hinged_valve(prefix + '_jack_footvalve', (jx, cy, j0 + .004),
                          jr - .0005, .010, .006, .0027, .0140, .0144,
                          .0020, .0011, jm)
    jpiston = _hinged_valve(prefix + '_jack_pistonvalve', (jx, cy, 0),
                            jr - .0005, .010, .006, .0027, .0140, .0144,
                            .0030, .0011, jm, M['jbucket'])
    # 上蓋は棒の実穴付き。手前の断面だけを透明にし、後ろ半分は密閉の金属。
    cap = previous._plate_with_hole(prefix + '_jack_cap', jr + .0003, .0024,
                                    jm['metal'], (jx, cy, j1 + .0012), hole_radius=.0027, n=48)
    _cut_material(cap, jm['metal'], jm['cutmetal'], jm['inner'])
    jwaterbelow = d.cyl(prefix + '_jack_water_below', jr - .0015, 1, (jx, cy, .5), jm['water'], verts=40)
    jwaterabove = d.cyl(prefix + '_jack_water_above', jr - .0015, 1, (jx, cy, .5), jm['water'], verts=40)
    # 地上の樋/受け桶の水面より下に、実際の底の穴がある。
    inlet = _shell(prefix + '_jack_submerged_inlet', jx + .010, cy,
                    ground + .003, j0 + .003, .0068, jm)
    tx, ty, tz0, tz1, tw, td = lx['TANK']
    path = [Vector((jx + jr - .001, cy, j1 - .010)),
            Vector((jx + .032, .155, j1 - .010)), Vector((jx + .032, .155, .672)),
            Vector((tx, .155, .672)), Vector((tx, ty + .015, .672)), Vector((tx, ty + .015, tz1 - .010))]
    channels = []
    for i, (a, b) in enumerate(zip(path, path[1:])):
        channels.append(previous._half_channel(prefix + '_jack_delivery%d_back' % i,
                                               a, b, .0050, .0037, jm['seat'], jm['inner'], 0, 180, n=16))
        channels.append(previous._half_channel(prefix + '_jack_delivery%d_front' % i,
                                               a, b, .0050, .0037, jm['glass_front'], jm['glass_front'], 180, 360, n=16))
    jdrops = [d.sphere(prefix + '_jack_tracked_water%d' % i, .0028, (0, 0, -5), jm['drop'], seg_=12, ring=6) for i in range(10)]
    joint_a = d.sphere(prefix + '_jackrod_lower_pin', .0026, (0, 0, -5), jm['pin'], seg_=12, ring=6)
    joint_b = d.sphere(prefix + '_jackrod_upper_pin', .0026, (0, 0, -5), jm['pin'], seg_=12, ring=6)
    rodlink = rod(prefix + '_jackrod_beam_link', (jx, cy, .67), (jx, cy, .69), .0015, jm['pin'])
    tankline = rod(prefix + '_tank_white_level', (tx - tw * .40, ty - td / 2 - .0015, tz0 + .02),
                   (tx + tw * .40, ty - td / 2 - .0015, tz0 + .02), .0008, jm['marker'])
    S['jack'] = dict(mats=jm, shell=jshell, rims=jrims, cap=cap,
                     foot=jfoot, piston=jpiston, above=jwaterabove, below=jwaterbelow,
                     inlet=inlet, channels=channels, path=path, drops=jdrops,
                     rodlink=rodlink, joint_a=joint_a, joint_b=joint_b, tankline=tankline,
                     radius=jr, z0=j0, z1=j1,
                     primary=jshell + jrims + [cap] + jfoot['primary'] + jpiston['primary'],
                     body_primary=jshell + jrims + [cap] + jfoot['primary'] + jpiston['primary'])
    S['new_objects'].extend(_register(M, 'jack', before))
    M['jfoot'], M['jflap'] = jfoot['root'], jpiston['root']
    # 旧送水入口の粒も、旧組に入っているので再表示しない。
    obsolete.extend(M.get('_gpt_jin_drops', []))
    S['obsolete'] = list(dict.fromkeys(obsolete))
    S['new_objects'] = list(dict.fromkeys(S['new_objects']))
    M['_s3_pumps_version'] = 1
    return {'added_objects': S['new_objects'], 'already_applied': False}


def build_machine(prefix='d1m', with_mine=True):
    M = previous.build_machine(prefix, with_mine)
    add_s3_pumps(M)
    return M


def _valve_open(vdir, vu, manual, opening_direction):
    if manual is not None:
        return _clamp(manual)
    return sm(vu / .12) * (1 - sm((vu - .9) / .1)) if vdir == opening_direction else 0.0


def _angle_for_clearance(valve, opening, room):
    # 扉の上面が上のふた/筒に突き抜けない。有限厚の角の最高点で制限。
    free = max(0.0, room - valve['flap_depth'] - .0008)
    return min(1.10 * opening, math.asin(_clamp(free / valve['length'], 0, .999)))


def _pump_level(M, st):
    lx = M['L']
    pt = M.get('s3', {}).get('pump', {}).get('display_layout', {}).get('PT', lx['PT'])
    if st.get('_s3_pump_level_z') is not None:
        return _clamp(float(st['_s3_pump_level_z']), lx['PB'] + .007, lx['SPOUT_Z'] + .006)
    col = st.get('_s3_pump_level', st['column'])
    return pt + .012 + (lx['SPOUT_Z'] + .006 - pt - .012) * _clamp(col)


def _tank_level_z(lx, st):
    _, _, z0, z1, _, _ = lx['TANK']
    h = (z1 - z0 - .010) * _clamp(st.get('_s3_jack_level', st['tank']))
    # original の高さ max(.001,h) と、中心 z0+.006+h/2 の実上面。
    return z0 + .006 + (h + max(.001, h)) / 2


def _apply_pump(M, st, t, g):
    S = M['s3']
    if 'pump' not in S:
        return
    pump = S['pump']
    visible = bool(st['mine'])
    detail = bool(st.get('_s3_pump_detail', False)) and visible
    lx = M['L']
    sx, cy, pb, pt, radius = (lx[k] for k in ('SX', 'CY', 'PB', 'PT', 'PR'))
    pt = pump['display_layout']['PT']
    bz = M['rod_bottom0'] + g['rod_dz']
    d.show(S['backdrop'], detail)
    if detail:
        _hide(S['detail_walls'])
    else:
        for obj in S.get('wide_shaft', []):
            d.show(obj, visible)
    for obj in pump['primary']:
        d.show(obj, visible)
    for obj in pump['rising_main'] + pump['rising_rims']:
        d.show(obj, visible)
    # 新しい専用材質だけを変える。旧共有材質への set_alpha はしない。
    previous.original.set_alpha(pump['mats']['glass_front'], .018 if detail else .07)
    previous.original.set_alpha(pump['mats']['cutmetal'], .035 if detail else .10)
    piston, foot = pump['piston'], pump['foot']
    bopen = _valve_open(st['vdir'], st['vu'], st['bvalve'], 1)
    fopen = _valve_open(st['vdir'], st['vu'], st['fvalve'], -1)
    ba = _angle_for_clearance(piston, bopen, pt - (bz + piston['hinge'].z))
    fa = _angle_for_clearance(foot, fopen, bz - .0035 - foot['hinge'].z)
    piston['root'].rotation_euler.y = -ba
    foot['root'].rotation_euler.y = -fa
    for obj in piston['moving']:
        d.show(obj, visible and not st['no_bflap'])
    d.show(piston['root'], visible and not st['no_bflap'])
    for role, valve in (('bflap', piston), ('foot', foot)):
        strength = .12 + 1.6 * st.get('hl', {}).get(role, 0) + 2.0 * st.get('flash_valves', 0)
        # 両弁は同じ黄色の意味。主役を光で隠すほど強くしない。
        if role == 'foot':
            strength = max(strength, .12)
        d.set_emit(valve['panel'].active_material, min(2.2, strength))
    level = _pump_level(M, st)
    above0, foot_top = bz + .0035, pb + .006
    level = max(above0 + .001, level)
    _set_cylinder(pump['above'], above0, min(pt, level))
    _set_cylinder(pump['column'], pt, level)
    d.show(pump['above'], visible and level > above0)
    d.show(pump['column'], visible and level > pt + .0003)
    below_top = st.get('below_top')
    below_top = min(bz - .0035 if below_top is None else below_top, bz - .0035)
    _set_cylinder(pump['below'], foot_top, max(foot_top, below_top))
    d.show(pump['below'], visible and below_top > foot_top + .0004)
    sr = radius - .003 if level <= pt else lx['PIPE'] - .0017
    pump['surface'].location.z = level
    pump['surface'].scale.x = pump['surface'].scale.y = sr / (radius - .003)
    d.show(pump['surface'], visible)
    _set_rod(pump['marker'], (sx - sr * .87, cy - sr * .52, level + .0006),
             (sx + sr * .87, cy - sr * .52, level + .0006))
    d.show(pump['marker'], visible)
    gap = bz - .0035 - below_top
    _set_cylinder(pump['glow'], below_top, bz - .0035)
    d.show(pump['glow'], visible and gap > .002 and st.get('vacglow', 0) > 0)
    sump_h = .012 + (lx['SUMP'][3] - lx['SUMP'][2] - .02) * st['sump']
    for obj in S.get('sumpwater', []):
        _set_cylinder(obj, lx['SUMP'][2], lx['SUMP'][2] + sump_h)
        d.show(obj, visible)
    mode = st.get('_s3_pump_arrows')
    if mode is None:
        mode = 'leak' if st['no_bflap'] and st['vdir'] < 0 else 'transfer' if st['vdir'] > 0 else 'refill' if fopen > .2 else 'lift' if st['vdir'] < 0 else 'none'
    xflow = sx + .0393
    yflow = cy - .003
    particle_room = bz - .0035 - (pb + .006)
    # 大きくした粒を、低いふたと底板の狭いすき間へ無理に押し込まない。
    start = (xflow, yflow, max(pb + .006 + .0073, bz - .019))
    finish = (xflow, yflow, min(pt - .0075, bz + .028))
    arrows = pump['arrows']
    for arrow in arrows.values():
        _pose_arrow(arrow, start, finish, False)
    # 大きな水滴と矢印の先を重ねない。矢印は透明筒の手前に置いた
    # 平行な説明線であり、実際の水滴の穴・経路は一切移動しない。
    transfer_start = (sx - .025, cy - .070, start[2])
    transfer_finish = (sx - .025, cy - .070, finish[2])
    _pose_arrow(arrows['transfer'], transfer_start, transfer_finish,
                 visible and mode == 'transfer' and ba > .98)
    _pose_arrow(arrows['leak'], finish, start, visible and mode == 'leak' and st['no_bflap'])
    _pose_arrow(arrows['lift'], (sx - .025, cy - .020, bz + .012),
                 (sx - .025, cy - .020, min(level - .004, bz + .049)), visible and mode == 'lift')
    _pose_arrow(arrows['refill'], (xflow, yflow, pb - .002),
                 (xflow, yflow, min(bz - .011, pb + .042)), visible and mode == 'refill' and fa > .98)
    _hide(pump['drops'])
    if not visible or not st['pdrops']:
        return
    for i, obj in enumerate(pump['drops'][:2]):
        u = (t * .43 + i * .50) % 1
        if mode == 'transfer' and ba > .98 and particle_room > .0152:
            obj.location = Vector(start).lerp(Vector(finish), u)
            d.show(obj, True)
        elif mode == 'leak' and st['no_bflap'] and particle_room > .0152:
            obj.location = Vector(finish).lerp(Vector(start), u)
            d.show(obj, True)
        elif st['vdir'] < 0 and not st['no_bflap']:
            obj.location = (sx + (-.020 if i % 2 else -.002), cy - .016 + (i // 2) * .019,
                            min(pt - .008, bz + .013 + (i // 2) * .012))
            d.show(obj, True)
    if fa > .98 and st.get('refill') is not None:
        for i, obj in enumerate(pump['drops'][4:6]):
            u = (t * .43 + i * .50) % 1
            # 最後まで開口半径内。黄色い扉の自由端より外側を通る。
            obj.location = Vector((xflow, yflow, pb + .0015)).lerp(
                Vector((xflow, yflow, min(bz - .012, pb + .040))), u)
            d.show(obj, True)


def _apply_jack(M, st, t, g):
    jack = M['s3']['jack']
    visible = bool(st['jack'])
    detail = bool(st.get('_s3_jack_detail', False))
    lx, cy = M['L'], M['L']['CY']
    jx, ground = lx['JX'], lx['G']
    jb = ground + .032 + g['jack_dz'] * .9
    piston, foot = jack['piston'], jack['foot']
    bo = _valve_open(st['vdir'], st['vu'], None, 1)
    fo = _valve_open(st['vdir'], st['vu'], None, -1)
    ba = _angle_for_clearance(piston, bo, jack['z1'] - (jb + piston['hinge'].z))
    fa = _angle_for_clearance(foot, fo, jb - .0015 - foot['hinge'].z)
    piston['root'].rotation_euler.y = -ba
    foot['root'].rotation_euler.y = -fa
    for obj in jack['primary'] + jack['inlet'] + jack['channels']:
        d.show(obj, visible)
    previous.original.set_alpha(jack['mats']['glass_front'], .018 if detail else .06)
    previous.original.set_alpha(jack['mats']['cutmetal'], .035 if detail else .10)
    _set_cylinder(jack['below'], ground + .009, jb - .0015)
    _set_cylinder(jack['above'], jb + .0015, jack['z1'] - .010)
    d.show(jack['below'], visible)
    d.show(jack['above'], visible)
    pv = Vector(lx['PV'])
    dx = jx - pv.x
    beam_point = pv + Vector((dx * math.cos(g['th']), 0, dx * math.sin(g['th'])))
    rod_end = Vector((jx, cy, beam_point.z - .012))
    _set_rod(jack['rodlink'], rod_end, beam_point)
    jack['joint_a'].location = rod_end
    jack['joint_b'].location = beam_point
    for obj in (jack['rodlink'], jack['joint_a'], jack['joint_b']):
        d.show(obj, visible)
    tx, ty, tz0, tz1, tw, td = lx['TANK']
    # 元の tankwater と同じ水面。図上の白線だけが先に上がることはない。
    tank = _clamp(st.get('_s3_jack_level', st['tank']))
    tank_h = (tz1 - tz0 - .010) * tank
    tz = _tank_level_z(lx, st)
    M['tankwater'].scale = (1.0, 1.0, max(.001, tank_h))
    M['tankwater'].location.z = tz0 + .006 + tank_h / 2
    _set_rod(jack['tankline'], (tx - tw * .40, ty - td / 2 - .0015, tz),
             (tx + tw * .40, ty - td / 2 - .0015, tz))
    d.show(jack['tankline'], visible and st['show_tank'])
    _hide(jack['drops'])
    if not visible:
        return
    for i, obj in enumerate(jack['drops']):
        u = (t * .58 + (i % 4) / 4) % 1
        if i < 4 and ba > 1.05:
            # 扉の自由端を避けた穴の外寄り。粒 .0028 は穴 .006 内に収まる。
            obj.location = (jx + .013, cy, jb - .008 + .024 * u)
            d.show(obj, True)
        elif 4 <= i < 8 and fa > 1.05:
            lo, hi = ground + .003, min(ground + .031, jb - .0046)
            obj.location = (jx + .013, cy, lo + (hi - lo) * u)
            d.show(obj, True)
        elif i >= 8 and st['jack_flow'] > 0:
            obj.location = previous._path_position(jack['path'], (t * .45 + (i - 8) * .5) % 1)
            d.show(obj, True)


def _apply_jack_context_cutaway(M, st):
    """給水経路の説明だけ、手前の主機関を断面として取り除く。

    腕→細い棒→小ポンプ→送水管→水槽を、元の位置のまま見る。
    他のcueでは何もしないので、既に良い主筒・釜・弁の画を変えない。
    """
    if not (st.get('_s3_jack_detail') and st.get('jack')):
        return
    keep_core = set(_descendants(M['beam']))
    keep_core.update(obj for obj in M['groups'].get('core', []) if '_axle' in obj.name)
    hidden = [obj for obj in M['groups'].get('core', []) if obj not in keep_core]
    # 見ている給水管と、筒へ冷水を戻す別の管を混同させない。
    cold_names = ('_cold', '_cvdisc', '_cvspindle', '_cvhandle', '_cvknob')
    hidden.extend(obj for obj in M['groups'].get('tank', []) if any(word in obj.name for word in cold_names))
    for group in ('drain', 'coal', 'rod', 'lever', 'plug', 'worker', 'tap', 'door', 's3_episode'):
        hidden.extend(M['groups'].get(group, []))
    # 底のポンプの全景は前の行までで確認済み。地上の受け桶と樋は残す。
    hidden.extend(obj for obj in M['groups'].get('pump', [])
                  if not any(word in obj.name for word in ('_tub', '_trough')))
    if st.get('_s3_jack_macro'):
        # 茶色の受け桶は一体の360度壁なので、この寄りだけ壁を断面除去。
        # 底板・輪・実水面・樋・吸水口は残し、どこから水が来るかを保つ。
        hidden.extend(obj for obj in M['groups'].get('pump', [])
                      if obj.type == 'MESH' and obj.name.split('.', 1)[0].endswith('_tub'))
    # 台の高い側面は経路を隠すので切り取る。地上の薄い緑の面は残る。
    ground = M['L']['G']
    hidden.extend(obj for obj in M['groups'].get('mine', [])
                  if obj.location.z + obj.dimensions.z / 2 < ground - .015)
    hidden.extend(M['s3'].get('wide_shaft', []))
    _hide(list(dict.fromkeys(hidden)))
    # これらは cutaway で消す物ではない。根も明示して実物を必ず見せる。
    for obj in keep_core:
        d.show(obj, True)
    d.show(M['jrod'], True)
    M['s3']['jack_cutaway_hidden'] = list(dict.fromkeys(hidden))


def _apply_whole_front_cutaway(M, st):
    """全体画だけ、坑の右にある厚い地層の縦壁を切り取る。

    地下ポンプの周りの左壁・奥壁・木枠は残す。地上の緑面と薄い
    上縁も残すので、ポンプ・管・樋の高さの関係は失われない。
    """
    if not st.get('_s3_whole_machine'):
        return
    lx = M['L']
    cutoff_x = lx['SX'] + min(lx['PR'], lx.get('SW', .07) / 2)
    hidden = []
    candidates = M['groups'].get('mine', []) + M['s3'].get('wide_shaft', [])
    for obj in candidates:
        if '_stratum' not in obj.name and '_wide_shaft_soil' not in obj.name:
            continue
        # 位置・寸法はこの静止した地層の原meshから直接読む。
        # stale DG の dimensions に判定を左右されないようにする。
        if obj.type != 'MESH':
            continue
        xs = [v.co.x for v in obj.data.vertices]
        zs = [v.co.z for v in obj.data.vertices]
        left = obj.location.x + min(xs) * obj.scale.x
        top = obj.location.z + max(zs) * obj.scale.z
        if left >= cutoff_x - .000001 and top <= .300001:
            hidden.append(obj)
    _hide(hidden)
    M['s3']['whole_front_cutaway_hidden'] = hidden


def apply_machine(M, st, t):
    previous.apply_machine(M, st, t)
    if not M.get('_s3_pumps_version'):
        return
    g = geometry(M, st)
    _apply_pump(M, st, t, g)
    _apply_jack(M, st, t, g)
    # 一括表示する旧 apply より必ず後。旧灰円板・水粒・黒壁が戻らない。
    _hide(M['s3']['obsolete'])
    _apply_jack_context_cutaway(M, st)
    _apply_whole_front_cutaway(M, st)


def show_machine(M, visible=True):
    previous.show_machine(M, visible)
    if M.get('_s3_pumps_version'):
        _hide(M['s3']['obsolete'])
        if not visible:
            _hide(M['s3']['new_objects'])


def anchors(M, st):
    result = previous.anchors(M, st)
    lx = M['L']
    sx, cy, pb, pt = (lx[k] for k in ('SX', 'CY', 'PB', 'PT'))
    pt = M.get('s3', {}).get('pump', {}).get('display_layout', {}).get('PT', pt)
    bz = M['rod_bottom0'] + geometry(M, st)['rod_dz']
    jx, ground = lx['JX'], lx['G']
    jb = ground + .032 + geometry(M, st)['jack_dz'] * .9
    level = _pump_level(M, st)
    result.update(
        footvalve=Vector((sx + .028, cy, pb + .007)),
        pistonvalve=Vector((sx + .028, cy, bz + .006)),
        bflap=Vector((sx + .028, cy, bz + .006)),
        pumpbody=Vector((sx, cy, (pb + pt) / 2)),
        pumpwater=Vector((sx, cy - (lx['PR'] if level <= pt else lx['PIPE']) * .52, level)),
        pumplevel=Vector((sx, cy, level)),
        pumpbelow=Vector((sx - .016, cy, max(pb + .010, bz - .014))),
        pumpabove=Vector((sx - .016, cy, min(pt - .005, bz + .016))),
        pumpoutside=Vector((sx + .065, cy, pb + .010)),
        pumpinlet=Vector((sx + .028, cy, pb + .018)),
        jackfootvalve=Vector((jx + .010, cy, ground + .010)),
        jackpistonvalve=Vector((jx + .010, cy, jb + .004)),
        jackbody=Vector((jx, cy, ground + .037)),
        jackrod=Vector((jx, cy, (ground + .04 + lx['PV'][2]) / 2)),
        tanklevel=Vector((lx['TANK'][0], lx['TANK'][1] - lx['TANK'][5] / 2, _tank_level_z(lx, st))),
    )
    return result


def physical_checks():
    """描画不要の寸法検算。実際の透け方・主役サイズの目視確認とは別。"""
    previous.physical_checks()
    for radius, hole_x, hole_r, hx, length, width, particle in (
        (.0585, .028, .020, .0048, .046, .043, .0072),
        (.0185, .010, .006, .0027, .0140, .0144, .0028),
    ):
        assert hole_x + hole_r < radius
        assert math.hypot(hx + length, width / 2) < radius
        assert hx < hole_x - hole_r and hx + length > hole_x + hole_r
        assert width / 2 > hole_r
        assert particle < hole_r
    # 実流路を通る粒の最外点。底ポンプ .003m の奥行きも加味。
    assert math.hypot(.0393 - .028, .003) + .0072 < .020
    assert abs(.013 - .010) + .0028 < .006
    # 水槽へ送る粒は本当の管の内径より小さい。
    assert .0028 < .0037
    return {'bottom_particle_radius': .0072, 'bottom_particle_count': 8,
            'bottom_old_particle_radius': .0036, 'bottom_old_particle_count': 24,
            'jack_particle_radius': .0028, 'jack_delivery_inner_radius': .0037}


# ---------------------------------------------------------------- episode-only extras
def _build_mitt(prefix):
    before = set(bpy.data.objects)
    root = d.empty(prefix + '_contact', (-.10, .10, .688))
    swing = d.empty(prefix + '_swing', root.location)
    d.parent(swing, root)
    pink = _material(prefix + '_pink', '#e9a3b6', rough=.55)
    dark = _material(prefix + '_pink_edge', '#bb718b', rough=.60)
    cuffmat = _material(prefix + '_cuff', '#da789e', rough=.60)
    sleeve = _material(prefix + '_sleeve', '#d48db0', rough=.65)
    contact = root.location.copy()
    palm = d.sphere(prefix + '_rounded_palm', .014, contact + Vector((0, -.025, -.014)),
                     pink, scale=(1.03, .65, 1.25), seg_=24, ring=12)
    thumb = d.sphere(prefix + '_gripping_thumb', .0075, contact + Vector((.014, -.020, -.004)),
                      pink, scale=(.8, .85, 1.2), seg_=20, ring=10)
    for obj in (palm, thumb):
        d.parent(obj, swing)
    # 指の丸い一体部が腕の上を越え、奥側へ折れる。指差しの細棒ではない。
    hook_top = d.box(prefix + '_hook_over_beam', (.027, .033, .009),
                     contact + Vector((0, -.001, .015)), pink, bevel=.004)
    hook_back = d.box(prefix + '_hook_behind_beam', (.026, .009, .020),
                      contact + Vector((0, .013, .008)), pink, bevel=.004)
    hook_front = d.box(prefix + '_front_knuckles', (.027, .011, .017),
                       contact + Vector((0, -.019, .007)), pink, bevel=.004)
    for obj in (hook_top, hook_back, hook_front):
        d.parent(obj, root)
    for i in (-1, 0, 1):
        seam = rod(prefix + '_finger_seam', contact + Vector((i * .006, -.015, .020)),
                   contact + Vector((i * .006, .009, .020)), .00030, dark)
        d.parent(seam, root)
    cuff = d.box(prefix + '_rounded_cuff', (.020, .017, .012),
                 contact + Vector((0, -.024, -.038)), cuffmat, bevel=.004)
    arm = d.box(prefix + '_hanging_sleeve', (.016, .015, .057),
                contact + Vector((0, -.024, -.071)), sleeve, bevel=.005)
    for obj in (cuff, arm):
        d.parent(obj, swing)
    return dict(root=root, swing=swing, contact=contact,
                primary=[palm, thumb, hook_top, hook_back, hook_front],
                all=sorted(set(bpy.data.objects) - before, key=lambda obj: obj.name))


def _mountain(prefix):
    """雪と青灰の稜線を持つ独立した富士山の机上模型。旧円錐は変更しない。"""
    rock = [_material(prefix + '_rock_light', '#718b9c', rough=.78),
            _material(prefix + '_rock_dark', '#566f80', rough=.78)]
    snow = _material(prefix + '_snow', '#f5f4e8', rough=.65)
    root = d.empty(prefix + '_root')
    n = 64
    rings = [(0, .15), (.045, .114), (.095, .077), (.140, .047), (.170, .025), (.183, .018)]
    verts = []
    for z, radius in rings:
        for i in range(n):
            a = 2 * math.pi * i / n
            r = radius * (1 + .035 * math.cos(12 * a) + .018 * math.sin(7 * a))
            verts.append((r * math.cos(a), r * math.sin(a), z))
    faces = [(j * n + i, j * n + (i + 1) % n, (j + 1) * n + (i + 1) % n, (j + 1) * n + i)
             for j in range(len(rings) - 1) for i in range(n)]
    mesh = bpy.data.meshes.new(prefix + '_ridged_mesh')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    mountain = d.link(bpy.data.objects.new(prefix + '_ridged_mountain', mesh))
    for material in rock:
        mesh.materials.append(material)
    for face in mesh.polygons:
        face.material_index = int(math.cos((face.index % n) / n * math.pi * 12) < -.1)
        face.use_smooth = True
    d.parent(mountain, root)
    snowverts = []
    for j in range(3):
        for i in range(n):
            a = 2 * math.pi * i / n
            if j == 0:
                z = .133 + .008 * math.cos(9 * a) + .004 * math.sin(5 * a)
                radius = .077 + (.047 - .077) * ((z - .095) / .045) + .0012
            elif j == 1:
                z, radius = .1705, .026
            else:
                z, radius = .1835, .0187
            snowverts.append((radius * math.cos(a), radius * math.sin(a), z))
    snowfaces = [(j * n + i, j * n + (i + 1) % n, (j + 1) * n + (i + 1) % n, (j + 1) * n + i)
                 for j in range(2) for i in range(n)]
    snowmesh = bpy.data.meshes.new(prefix + '_snow_mesh')
    snowmesh.from_pydata(snowverts, [], snowfaces)
    snowmesh.update()
    snowobj = d.link(bpy.data.objects.new(prefix + '_snow_cap', snowmesh))
    d.put(snowobj, snow)
    d.parent(snowobj, root)
    crater = d.torus(prefix + '_summit_rim', .0178, .0015, (0, 0, .1834), snow)
    d.parent(crater, root)
    return root, [mountain], [snowobj, crater]


def _install_machine_extras(extras, M):
    if extras.get('_machine_installed'):
        return
    before = set(bpy.data.objects)
    lx = M['L']
    prefix = M['svhandle'].name.rsplit('_svhandle', 1)[0] + '_s3_episode'
    pinmat = _material(prefix + '_hinge_metal', '#b4ad90', metal=.5, rough=.37)
    hinges = []
    # 旧前面のmeshをそのまま親付けする。左右に開く実在の蝶番の軸。
    for key, radius, z0, z1 in [('cover_kettle', lx['KR'], lx['K0'], lx['K1'] + lx['KDOME']),
                                ('cover_cyl', lx['CR'], lx['CB'], lx['CT'])]:
        angle = math.radians(220)
        point = Vector((lx['BX'] + radius * math.cos(angle), lx['CY'] + radius * math.sin(angle), (z0 + z1) / 2))
        root = d.empty(prefix + '_' + key + '_hinge', point)
        cover = M[key]
        d.parent(cover, root)
        # 親付け後のlocal値だけを更新。旧source自体やmeshは触らない。
        M['base'][cover] = (cover.location.copy(), cover.rotation_euler.copy(), cover.scale.copy())
        fixed = []
        for i, z in enumerate((z0 + .006, z1 - .006)):
            at = Vector((point.x, point.y, z))
            fixed.append(rod(prefix + '_' + key + '_pin%d' % i,
                             at + Vector((0, 0, -.004)), at + Vector((0, 0, .004)), .0012, pinmat))
            fixed.append(d.box(prefix + '_' + key + '_hinge_leaf%d' % i,
                                (.010, .0018, .006), at + Vector((.003, .001, 0)), pinmat,
                                bevel=.0005, rot=(0, 0, math.radians(-40))))
        hinges.append(dict(root=root, cover=cover, fixed=fixed, point=point, primary=[cover] + fixed))
    extras['hinges'] = hinges
    old_leather = [obj for obj in M['children'].get(M['piston'], []) if 'pistonleather' in obj.name]
    brown = _material(prefix + '_clear_leather', '#8c4e25', rough=.65)
    piston = M['piston']
    ring = d.torus(prefix + '_thick_brown_leather', lx['CR'] - .0030, .0028,
                   piston.location.copy(), brown)
    d.parent(ring, piston)
    extras['leather'] = dict(primary=[ring], ring=ring, obsolete=old_leather)
    # 蛇口の既存組だけをTPを中心に2倍。水柱も同じ親なので口から離れない。
    tp = Vector(lx['TAP'])
    taproot = d.empty(prefix + '_tap_x2', tp)
    tapobjects = list(M['groups']['tap'])
    taproots = [obj for obj in tapobjects if obj.parent is None]
    for obj in taproots:
        d.parent(obj, taproot)
    taproot.scale = (2, 2, 2)
    # 支柱だけは地面を突き抜けさせず、元の接地高へ伸ばす。
    for obj in tapobjects:
        if '_tappost' in obj.name:
            desired_center = (lx['G'] + tp.z) / 2
            obj.location.z = tp.z + (desired_center - tp.z) / 2
            obj.dimensions.z = (tp.z - lx['G']) / 2
        M['base'][obj] = (obj.location.copy(), obj.rotation_euler.copy(), obj.scale.copy())
    extras['tap'] = dict(root=taproot, primary=tapobjects, center=tp, all=tapobjects + [taproot])
    # 比較の模型は左、実ポンプは右。板・枠・矢印の形と既存の開閉軸は不変。
    # 元DP(-.33,-.025,0)から(-.50,.10,0)へ、最上位だけまとめて移す。
    doorroot = d.empty(prefix + '_door_positioning')
    doorobjects = list(M['groups']['door'])
    for obj in doorobjects:
        if obj.parent is None:
            d.parent(obj, doorroot)
            M['base'][obj] = (obj.location.copy(), obj.rotation_euler.copy(), obj.scale.copy())
    delta = Vector((-.17, .125, 0))
    doorroot.location = delta
    extras['door_positioning'] = dict(root=doorroot, delta=delta,
                                      primary=[obj for obj in doorobjects if obj.type == 'MESH'],
                                      all=doorobjects + [doorroot],
                                      world_p=Vector(M['door_p']) + delta)
    added = _register(M, 's3_episode', before)
    extras['all'].extend(obj for obj in added if obj not in extras['all'])
    extras['_machine_installed'] = True


def _prepare_fuji_flash(fuji):
    """山頂矢印専用の材質を作る。共有の矢印や長さには触らない。"""
    if 'high_arrow_mats' in fuji:
        return
    copies, records = {}, []
    for obj in _descendants(fuji['arrows'][1]):
        if obj.type != 'MESH':
            continue
        for i, material in enumerate(list(obj.data.materials)):
            key = material.as_pointer()
            if key not in copies:
                copied = material.copy()
                copied.name = 'd1b_s3_fuji_high_flash_' + material.name
                copies[key] = copied
                node = d.principled(copied)
                records.append((copied, tuple(node.inputs['Base Color'].default_value),
                                tuple(node.inputs['Emission Color'].default_value),
                                float(node.inputs['Emission Strength'].default_value)))
            obj.data.materials[i] = copies[key]
    fuji['high_arrow_mats'] = records


def _flash_fuji_high(fuji, flash):
    _prepare_fuji_flash(fuji)
    flash = _clamp(float(flash))
    light = d.rgb('#82e8ff')
    for material, base, emission, strength in fuji['high_arrow_mats']:
        node = d.principled(material)
        node.inputs['Base Color'].default_value = tuple(base[i] * (1 - .45 * flash) + light[i] * .45 * flash for i in range(4))
        node.inputs['Emission Color'].default_value = light if flash > 0 else emission
        node.inputs['Emission Strength'].default_value = strength + 1.2 * flash


def build_episode_extras(P, G, FUJI_MINI, FUJI_ARROWS, cache, M=None):
    """机上の新模型だけを足す。M=Mなら全追加objをBASE作成前に登録できる。"""
    before = set(bpy.data.objects)
    extras = dict(all=[], hinges=[], tap=None, leather=None)
    extras['mitt'] = _build_mitt('d1b_s3_mitt')
    root, mountain, snow = _mountain('d1b_s3_fuji')
    data_path = Path(cache) / 'blender' / 'data.json'
    data = json.loads(data_path.read_text()) if data_path.is_file() else None
    ratio = float(data['numbers']['fujiRatio']) if data is not None else .63
    assert abs(ratio - .63) < 1e-9, '支給の富士山の比は0.63'
    q = P['fuji']
    rest = {}
    for grp in (q['low'], q['high']):
        for obj in [grp['ground']] + grp['layers'] + sum(grp['particles'], []) + sum(grp['edges'], []):
            rest[obj] = (obj.location.copy(), obj.rotation_euler.copy(), obj.scale.copy())
    extras['fuji'] = dict(root=root, mountain=mountain, snow=snow,
                          low=q['low'], high=q['high'], mini=FUJI_MINI, arrows=FUJI_ARROWS,
                          old_group=list(G['fuji']), rest=rest, ratio=ratio,
                          layout=dict(mount=(.36, .08, 0), low=(.065, .035, 0), high=(.355, .08, .184),
                                      mini_low=(.19, -.045, .006), mini_high=(.485, .005, .185)),
                          primary=mountain + snow, all=[root] + mountain + snow)
    fuji = extras['fuji']
    for key in ('low', 'high'):
        grp = fuji[key]
        fuji[key + '_primary'] = [grp['ground']] + grp['layers'] + sum(grp['edges'], [])
    fuji['mini_primary'] = [list(objects) for _, objects, _ in FUJI_MINI]
    fuji['arrows_primary'] = [obj for arrow in FUJI_ARROWS for obj in _descendants(arrow) if obj.type == 'MESH']
    fuji['primary'] = (mountain + snow + fuji['low_primary'] + fuji['high_primary']
                       + sum(fuji['mini_primary'], []) + fuji['arrows_primary'])
    _prepare_fuji_flash(fuji)
    extras['all'] = sorted(set(bpy.data.objects) - before, key=lambda obj: obj.name)
    for obj in extras['all']:
        d.show(obj, False)
    if M is not None:
        _install_machine_extras(extras, M)
    return extras


def apply_fuji(extras, X, t):
    fuji = extras['fuji']
    active = bool(X.get('fuji'))
    for obj in fuji['all']:
        d.show(obj, active)
    if not active:
        return
    _hide(fuji['old_group'])
    layout = dict(fuji['layout'], **X.get('_s3_fuji_layout', {}))
    fuji['root'].location = layout['mount']
    factor = .72
    for grp, original_base, key in ((fuji['low'], Vector((.14, .05, 0)), 'low'),
                                    (fuji['high'], Vector((.33, .05, .15)), 'high')):
        base = Vector(layout[key])
        for obj in [grp['ground']] + grp['layers'] + sum(grp['particles'], []) + sum(grp['edges'], []):
            pos, rot, scale = fuji['rest'][obj]
            obj.location = base + (pos - original_base) / .44 * factor
            obj.rotation_euler = rot
            obj.scale = scale / .44 * factor
            d.show(obj, X.get('fuji_layers', 1) > 0)
        for obj in sum(grp['particles'], []):
            obj.scale *= 2.8
    for i, ((root, objects, _), arrow) in enumerate(zip(fuji['mini'], fuji['arrows'])):
        p = Vector(layout['mini_low' if i == 0 else 'mini_high'])
        root.location = p
        root.scale = (.26, .26, .26)
        d.show_tree(root, True)
        # 旧矢印meshには既に0.63が焼かれている。長さを別々に変更しない。
        arrow.location = p + Vector((0, -.12, .214 * .26 + .006))
        arrow.scale = (2.5, 2.5, 2.5)
        d.show_tree(arrow, X.get('fuji_arrows', 0) > .02)
    _flash_fuji_high(fuji, X.get('fuji_flash', 0))
    fuji['current_layout'] = layout


def apply_episode_extras(extras, M, P, G, X, st, t):
    if not extras.get('_machine_installed'):
        _install_machine_extras(extras, M)
    machine = bool(X.get('machine', True))
    for hinge in extras['hinges']:
        active = machine and 'cover_open' in X
        d.show(hinge['root'], machine)
        hinge['root'].rotation_euler.z = -math.pi * .48 * _clamp(X.get('cover_open', 0)) if active else 0.0
        for obj in hinge['fixed']:
            d.show(obj, active)
        if active:
            # 開く板が透明では回転が読めない。このcueだけ閉外装として表示する。
            previous.original.set_alpha(hinge['cover'].active_material, 1.0)
    leather = extras['leather']
    _hide(leather['obsolete'])
    d.show(leather['ring'], machine)
    d.set_emit(leather['ring'].active_material, .20 * st.get('hl', {}).get('leather', 0))
    tap = extras['tap']
    tap['root'].scale = (2, 2, 2)
    d.show(tap['root'], machine and st['tap_show'])
    door = extras['door_positioning']
    door['root'].location = door['delta']
    d.show(door['root'], machine and st['door_show'])
    mitt = extras['mitt']
    active = machine and bool(X.get('mitt'))
    for obj in mitt['all']:
        d.show(obj, active)
    if active:
        g = geometry(M, st)
        z = X.get('mitt_z', M['L']['PV'][2] + M['L']['ARM'] * math.sin(g['th']))
        mitt['root'].location = (M['L']['BX'], M['L']['CY'], z)
        mitt['swing'].rotation_euler.y = math.radians(6) * _clamp(float(X.get('mitt_sway', 0)), -1, 1)
        # 旧指差しの袖を同時に出さない。別の役・別のモデルである。
        if 'mio' in d.HANDS:
            d.show_tree(d.HANDS['mio'], False)
    apply_fuji(extras, X, t)
    # 札/手のextrasが後から革帯や旧カバーを再表示しても、給水経路は塞がない。
    if machine:
        _apply_jack_context_cutaway(M, st)
        _apply_whole_front_cutaway(M, st)
    # 蛇口の親は2倍。旧applyがDG未更新のdimensionsで計算していても、
    # 原mesh（半径.0032・高さ1）のscaleを最後に絶対値へ戻す。
    tap_value = st['tap']
    stream_length = .028 * min(1.0, tap_value * 1.5)
    M['tapstream'].scale = (1.0, 1.0, max(.001, stream_length))
    M['tapstream'].location = Vector(M['L']['TAP']) + Vector((0, -.012, .001 - stream_length / 2))


def extra_anchors(extras, M, st):
    lx, g = M['L'], geometry(M, st)
    layout = extras['fuji'].get('current_layout', extras['fuji']['layout'])
    return dict(
        leather=Vector((lx['BX'] - lx['CR'] + .003, lx['CY'] - .008, g['pz'])),
        pistonwater=Vector((lx['BX'], lx['CY'] - .015, g['pz'] + .006)),
        mitt=extras['mitt']['root'].location.copy() + Vector((0, -.023, -.010)),
        tap=Vector(lx['TAP']) + Vector((0, -.024, .024)),
        door=extras['door_positioning']['world_p'] + Vector((0, 0, .060)),
        fujiLow=Vector(layout['low']) + Vector((0, -.025, .02)),
        fujiHigh=Vector(layout['high']) + Vector((0, -.025, .02)),
    )
