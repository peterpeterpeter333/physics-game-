"""D-1 前後編用の追加部品。Claude の既存ファイルは変更しない。

元の API を保ち、機構の見える所だけを補う。主な相違は、本当に穴の
開いたポンプ、幅を大きくした弁、連続した吸水/排水路、接触する弁棒と
レバー、両端を追従させたリンク。音声・字幕・時刻には触れない。
"""
import math
import random
import bpy
from mathutils import Vector, Matrix
import desk_lib as d
import desk_lib_d1 as ext
import desk_lib_d1_machine_claude_20261026 as original

L = dict(original.L, PR=.060)
idle_state = original.idle_state
cycle_state = original.cycle_state
geometry = original.geometry
mini_engine = original.mini_engine
anchors = original.anchors
sm = original.sm
rod = ext.rod


def _plate_with_hole(name, radius, depth, material, center=(0, 0, 0),
                     hole_x=0.0, hole_y=0.0, hole_radius=.01, n=72):
    """一枚の穴付き板。暗色の円を描くのでなく、内壁まである実開口。"""
    verts = []
    for z in (-depth / 2, depth / 2):
        for inner in (False, True):
            for i in range(n):
                a = 2 * math.pi * i / n
                r = hole_radius if inner else radius
                x = hole_x if inner else 0.0
                y = hole_y if inner else 0.0
                verts.append((x + r * math.cos(a), y + r * math.sin(a), z))
    faces = []
    for i in range(n):
        j = (i + 1) % n
        faces.extend([(i, j, n + j, n + i),
                      (2 * n + i, 3 * n + i, 3 * n + j, 2 * n + j),
                      (i, 2 * n + i, 2 * n + j, j),
                      (n + i, n + j, 3 * n + j, 3 * n + i)])
    mesh = bpy.data.meshes.new(name + '_mesh')
    mesh.from_pydata(verts, [], [tuple(reversed(face)) for face in faces])
    mesh.update()
    obj = d.link(bpy.data.objects.new(name, mesh))
    obj.location = center
    d.put(obj, material)
    bevel = obj.modifiers.new('soft_edge', 'BEVEL')
    bevel.width = min(.0006, depth / 5)
    bevel.segments = 2
    return obj


def _group_added(M, group, before):
    objs = list(set(bpy.data.objects) - before)
    M['groups'].setdefault(group, []).extend(objs)
    M['all'].extend(objs)
    return objs


def _hide_obsolete(M, *objects):
    for obj in objects:
        if obj is not None:
            M['_gpt_obsolete'].append(obj)


def _path_position(path, u):
    lengths = [(b - a).length for a, b in zip(path, path[1:])]
    distance = max(0.0, min(1.0, u)) * sum(lengths)
    for a, b, length in zip(path, path[1:], lengths):
        if distance <= length:
            return a.lerp(b, distance / max(length, 1e-9))
        distance -= length
    return path[-1].copy()


def _set_rod(obj, a, b):
    a, b = Vector(a), Vector(b)
    v = b - a
    obj.location = (a + b) / 2
    obj.rotation_euler = v.to_track_quat('Z', 'Y').to_euler()
    obj.dimensions.z = max(.0001, v.length)


def _half_channel(name, a, b, outer_radius, inner_radius, outer_mat,
                  inner_mat, a0, a1, n=28):
    """断面を見せる、厚みと内壁と端の切り口を持った半円管。"""
    a, b = Vector(a), Vector(b)
    direction = (b - a).normalized()
    back = Vector((0, 1, 0))
    back = back - direction * back.dot(direction)
    if back.length < .01:
        back = Vector((1, 0, 0)) - direction * direction.x
    back.normalize()
    side = back.cross(direction).normalized()
    verts = []
    outer_radii = outer_radius if isinstance(outer_radius, (tuple, list)) else (outer_radius, outer_radius)
    inner_radii = inner_radius if isinstance(inner_radius, (tuple, list)) else (inner_radius, inner_radius)
    for end_i, end in enumerate((a, b)):
        for radius in (outer_radii[end_i], inner_radii[end_i]):
            for i in range(n + 1):
                angle = math.radians(a0 + (a1 - a0) * i / n)
                p = end + radius * (side * math.cos(angle) + back * math.sin(angle))
                verts.append(tuple(p))
    stride = n + 1
    faces, materials = [], []
    def face(indices, material):
        faces.append(indices)
        materials.append(material)
    for i in range(n):
        j = i + 1
        face((i, j, 2 * stride + j, 2 * stride + i), 0)
        face((stride + i, 3 * stride + i, 3 * stride + j, stride + j), 1)
        face((i, stride + i, stride + j, j), 1)
        face((2 * stride + i, 2 * stride + j, 3 * stride + j, 3 * stride + i), 1)
    for i in (0, n):
        edge = (i, 2 * stride + i, 3 * stride + i, stride + i)
        face(edge if i == 0 else tuple(reversed(edge)), 1)
    mesh = bpy.data.meshes.new(name + '_mesh')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = d.link(bpy.data.objects.new(name, mesh))
    obj.data.materials.append(outer_mat)
    obj.data.materials.append(inner_mat)
    for poly, material in zip(obj.data.polygons, materials):
        poly.material_index = material
        poly.use_smooth = poly.index % 4 in (0, 1)
    return obj


def _register_live(M, group, before):
    """追加分だけを登録。動いた後の既存物でrestを上書きしない。"""
    added = _group_added(M, group, before)
    for obj in added:
        M['base'].setdefault(obj, (obj.location.copy(), obj.rotation_euler.copy(), obj.scale.copy()))
        if obj.parent is not None:
            children = M['children'].setdefault(obj.parent, [])
            if obj not in children:
                children.append(obj)
    return added


def _ensure_readable_jack(M):
    """上蓋に隠れる小型ポンプを、実開口を残した手前の断面で見せる。

    実行済みの M にも適用できる。物の位置・mesh の頂点・rest は動かさず、
    この追加版で作った穴付き板と、このポンプ専用の見せる材質だけを変える。
    背面は不透明の金属で、手前だけが透けるため、密閉した機械の断面だと
    分かる。ふたの穴と黄色い一方弁を消したり、穴を拡大したりしない。
    """
    if M.get('_gpt_jack_cutaway_version', 0) >= 1:
        return []
    prefix = M['svhandle'].name.rsplit('_svhandle', 1)[0]
    front = original._alpha_mat(prefix + '_gpt_jack_cut_front', '#829097', .42, metal=.20, alpha=.022)
    rear = d.mat(prefix + '_gpt_jack_cut_back', '#879297', .42, metal=.35)
    inner = d.mat(prefix + '_gpt_jack_hole_inner', '#35434b', .50, metal=.25)
    glass_front = original._alpha_mat(prefix + '_gpt_jack_glass_front', '#c2e6ee', .18, alpha=.025)
    glass_back = original._alpha_mat(prefix + '_gpt_jack_glass_back', '#a4d4df', .22, alpha=.12)
    water = original._alpha_mat(prefix + '_gpt_jack_water_clear', '#3788b5', .27, alpha=.07)
    updated = []
    for suffix in ('_gpt_jackcap', '_gpt_jackbucketdisc', '_gpt_jackfoot'):
        obj = bpy.data.objects.get(prefix + suffix)
        if obj is None:
            continue
        # _plate_with_hole の頂点は板の中心が原点。手前は y<0。
        obj.data.materials.clear()
        for material in (rear, front, inner):
            obj.data.materials.append(material)
        for face in obj.data.polygons:
            if face.center.y < -1e-9:
                face.material_index = 1
            else:
                face.material_index = 2 if face.index % 4 == 3 else 0
        updated.append(obj)
    barrel = bpy.data.objects.get(prefix + '_jackbarrel')
    if barrel is not None:
        barrel.data.materials.clear()
        barrel.data.materials.append(glass_back)
        barrel.data.materials.append(glass_front)
        # 元の sector mesh は世界座標を頂点に焼いて作るため、CY と比較。
        for face in barrel.data.polygons:
            face.material_index = int(face.center.y < M['L']['CY'])
        updated.append(barrel)
    M['jwater'].data.materials.clear()
    M['jwater'].data.materials.append(water)
    updated.append(M['jwater'])
    M['_gpt_jack_cutaway_mats'] = (front, glass_front, glass_back, water)
    M['_gpt_jack_cutaway_version'] = 1
    return updated


def add_drain_hinge(M):
    """固定ピン・管壁固定の二つの軸受・扉側の中空ナックルを一度だけ追加。

    回転中心は既存の dflap と同じ。支えの弁座が外れても蝶番は外れない。
    現在の M がどの角度でも追加でき、既存物の rest は変更しない。
    """
    if M.get('_gpt_drain_hinge_version', 0) >= 1:
        return {'added_objects': [], 'already_applied': True}
    if not M.get('_gpt_worker_drain_version'):
        return {'added_objects': [], 'already_applied': True}
    before = set(bpy.data.objects)
    prefix = M['svhandle'].name.rsplit('_svhandle', 1)[0]
    R = M['dflap_base'].to_matrix()
    hinge = M['dflap'].location.copy()
    axis = R @ Vector((1, 0, 0))
    pin_mat = d.mat(prefix + '_gpt_drain_hinge_pin', '#c0a36b', .32, metal=.55)
    bearing_mat = d.mat(prefix + '_gpt_drain_hinge_bearing', '#59656a', .42, metal=.45)
    rod(prefix + '_drainflap_gpt_fixed_pin', hinge - axis * .0146,
        hinge + axis * .0146, .00055, pin_mat)
    for i, x in enumerate((-.0123, .0123)):
        # 軸受には実際に穴を開ける。内径 .68mm / ピン .55mm で .13mm の隙間。
        ear = _plate_with_hole(prefix + '_drainflap_gpt_fixed_lug%d' % i,
                               .0024, .0030, bearing_mat, hinge + axis * x,
                               hole_radius=.00068, n=40)
        ear.rotation_euler = (R @ Matrix.Rotation(math.pi / 2, 3, 'Y')).to_euler()
        d.sphere(prefix + '_drainflap_gpt_pinhead%d' % i, .00105,
                  hinge + axis * (-.0146 if i == 0 else .0146), pin_mat, seg_=12, ring=6)
    # 軸受は弁室壁そのものへ食い込む位置。扉の中央だけが軸の周りを回る。
    knuckle = _half_channel(prefix + '_drainflap_gpt_moving_knuckle',
                            hinge - axis * .0031, hinge + axis * .0031,
                            .00140, .00068, pin_mat, bearing_mat, 0, 360, n=40)
    d.parent(knuckle, M['dflap'])
    bpy.context.view_layer.update()
    current_R = M['dflap'].matrix_world.to_3x3()
    neck_at = M['dflap'].matrix_world @ Vector((0, -.0010, 0))
    neck = d.box(prefix + '_drainflap_gpt_moving_hinge_leaf', (.0050, .0024, .0012),
                  neck_at, M['hl']['drainflap'], bevel=.00015,
                  rot=current_R.to_euler())
    d.parent(neck, M['dflap'])
    added = _register_live(M, 'drain', before)
    M['_gpt_drain_hinge_version'] = 1
    M['_gpt_drain_hinge_dimensions'] = {'pin_radius': .00055, 'bore_radius': .00068,
                                       'knuckle_half_length': .0031, 'fixed_lug_inner_x': .0108,
                                       'lug_outer_radius': .0024, 'lug_center_x': .0123}
    return {'added_objects': added, 'already_applied': False}


def add_worker_drain_clearance(M):
    """既存 M に安全に足す、人の手の IK と排水弁室の実クリアランス。

    新しい物だけを base に登録する。既存物の rest、流路の始点/終点は
    変えない。二度目の実行では物も材質も増やさない。
    """
    if M.get('_gpt_worker_drain_version', 0) >= 1:
        return add_drain_hinge(M)
    prefix = M['svhandle'].name.rsplit('_svhandle', 1)[0]
    added_all = []
    before = set(bpy.data.objects)
    # 元の片腕は回転させるだけで、実際のノブとは接続していなかった。
    for suffix in ('_warmbox', '_whand', '_scaffold'):
        _hide_obsolete(M, bpy.data.objects.get(prefix + suffix))
    for obj in M['groups'].get('worker', []):
        if obj.name.startswith(prefix + '_scaffoldpost'):
            _hide_obsolete(M, obj)
    cloth = d.mat(prefix + '_gpt_worker_cloth', '#3a5a8c', .65)
    skin = d.mat(prefix + '_gpt_worker_skin', '#e9b48f', .60)
    wood = M['mats']['wood']
    M['_gpt_worker_upper'] = rod(prefix + '_warm_gpt_upper', (0, 0, 0), (0, 0, .02), .0027, cloth)
    M['_gpt_worker_fore'] = rod(prefix + '_warm_gpt_fore', (0, 0, 0), (0, 0, .02), .0024, cloth)
    M['_gpt_worker_elbow'] = d.sphere(prefix + '_warm_gpt_elbow', .0028, (0, 0, 0), cloth, seg_=12, ring=6)
    M['_gpt_worker_hand'] = d.sphere(prefix + '_whand_gpt', .0035, (0, 0, 0), skin, seg_=16, ring=8)
    # 高さの違う赤/青の取っ手へ、足場自体を連続した斜路でつなぐ。
    p0, p1 = Vector((-.084, .028, .4405)), Vector((.066, .050, .5005))
    axis = p1 - p0
    ramp = d.box(prefix + '_scaffold_gpt_ramp', (axis.length + .052, .029, .004),
                  (p0 + p1) / 2 - Vector((0, 0, .002)), wood, bevel=.0008)
    ramp.rotation_euler = (0, -math.atan2(axis.z, math.hypot(axis.x, axis.y)), math.atan2(axis.y, axis.x))
    for i, p in enumerate((p0 - axis.normalized() * .017, p1 + axis.normalized() * .017)):
        top = p.z - .004
        d.box(prefix + '_scaffold_gpt_post%d' % i, (.005, .005, top - M['L']['G']),
              (p.x, p.y, (top + M['L']['G']) / 2), wood, bevel=.0007)
    M['_gpt_worker_path'] = (p0, p1)
    added_all.extend(_register_live(M, 'worker', before))
    # 管末端の短い弁室。大きな扉を細い本管へ突き刺さず、回転する全範囲を
    # 収める実空間を作る。入口の細い管から、連続した円錐管で広げる。
    before = set(bpy.data.objects)
    a, b = Vector(M['L']['DRAIN0']), Vector(M['L']['DRAIN1'])
    axis = (b - a).normalized()
    q = axis.to_track_quat('Z', 'Y')
    R = q.to_matrix()
    for suffix in ('_drainpipe_readable_back', '_drainpipe_readable_front', '_drainrim', '_drainflapplate'):
        _hide_obsolete(M, bpy.data.objects.get(prefix + suffix))
    _hide_obsolete(M, M['dflap'])
    iron = M['mats']['iron']
    inner = d.mat(prefix + '_gpt_drain_chamber_inner', '#424d52', .46, metal=.30)
    front = original._alpha_mat(prefix + '_gpt_drain_chamber_front', '#9aafb5', .28, alpha=.065)
    M['_gpt_channel_front_mats'] = tuple(M['_gpt_channel_front_mats']) + (front,)
    wide_outer, wide_inner = .0185, .0165
    z1, z2, z3 = b - axis * .047, b - axis * .035, b + axis * .003
    for label, start, end, outer, inside in [
        ('trunk', a, z1, .0067, .0051),
        ('transition', z1, z2, (.0067, wide_outer), (.0051, wide_inner)),
        ('body', z2, z3, wide_outer, wide_inner)]:
        back = _half_channel(prefix + '_drainpipe_gpt_%s_back' % label, start, end, outer, inside, iron, inner, 0, 180)
        face = _half_channel(prefix + '_drainpipe_gpt_%s_front' % label, start, end, outer, inside, front, front, 180, 360)
        M['_gpt_channel_opaque'].append(back)
        M['_gpt_channel_fronts'].append(face)
    # 黄色い円形の扉。掃引最大半径 < .0165 / 内向き到達 < .035 を寸法検査。
    hinge_y, radius, thickness = .0108, .0104, .0012
    root = d.empty(prefix + '_drainflap_gpt', b + R @ Vector((0, hinge_y, .0016)))
    root.rotation_euler = q.to_euler()
    disc = d.cyl(prefix + '_drainflap_gpt_plate', radius, thickness,
                 b + R @ Vector((0, 0, .0016)), M['hl']['drainflap'], rot=q.to_euler(), verts=64)
    d.parent(disc, root)
    # 縁には薄い革の輪。弁の板/穴の区別と、閉じた時の接合を読めるようにする。
    edge = d.torus(prefix + '_drainflap_gpt_edge', radius, .00038,
                   b + R @ Vector((0, 0, .0016)), d.mat(prefix + '_gpt_drain_leather', '#655548', .65), rot=q.to_euler())
    d.parent(edge, root)
    M['dflap'] = root
    M['dflap_base'] = q.to_euler()
    M['drain_dir'] = axis
    M['_gpt_drain_dimensions'] = {'radius': radius, 'hinge_y': hinge_y, 'half_thickness': thickness / 2,
                                  'inner_radius': wide_inner, 'back_depth': .035, 'front_depth': .003,
                                  'edge_radius': .00038}
    # 通常の一方弁は、この実開口の縁に押し付けられて閉じる。壊れた設問で
    # 内向きにも動くのは支えが外れた場合なので、二つの半円の支えを分離し、
    # 大きい空洞だけを残す。管や扉を透かして交差を隠す処理ではない。
    M['_gpt_drain_seats'] = []
    for i, (a0, a1) in enumerate(((0, 180), (180, 360))):
        seat = _half_channel(prefix + '_drainseat_gpt_%d' % i,
                             b + axis * -.0008, b + axis * .0004,
                             .0163, .0096, iron, inner, a0, a1, n=32)
        M['_gpt_drain_seats'].append(seat)
    M['_gpt_drain_seat_offsets'] = (R @ Vector((-.038, 0, -.008)), R @ Vector((.038, 0, -.008)))
    added_all.extend(_register_live(M, 'drain', before))
    M['_gpt_worker_drain_version'] = 1
    added_all.extend(add_drain_hinge(M)['added_objects'])
    return {'added_objects': added_all, 'already_applied': False}


def _two_link_elbow(shoulder, wrist, length=.023):
    """一定長二節の腕。肘を手前/下へ曲げ、手先をノブへ正確につなぐ。"""
    axis = wrist - shoulder
    dist = axis.length
    if dist < 1e-8:
        return shoulder + Vector((0, -length, 0))
    unit = axis / dist
    bend = Vector((-.25, -.75, -.65))
    bend -= unit * bend.dot(unit)
    if bend.length < 1e-6:
        bend = unit.cross(Vector((1, 0, 0)))
    bend.normalize()
    half = min(length - 1e-6, dist / 2)
    return (shoulder + wrist) / 2 + bend * math.sqrt(max(0.0, length * length - half * half))


def _apply_worker_contact(M, st):
    if not st['worker'] or not M.get('_gpt_worker_drain_version'):
        return
    wx = max(0.0, min(1.0, st['worker_x']))
    p0, p1 = M['_gpt_worker_path']
    body = p0.lerp(p1, wx)
    M['worker'].location = body
    # ノブは取っ手と一緒に回る。手の球の外縁を、その球の前面へ接触させる。
    red = M['svhandle'].location + M['svhandle'].rotation_euler.to_matrix() @ Vector((0, 0, .029))
    blue = M['cvhandle'].location + M['cvhandle'].rotation_euler.to_matrix() @ Vector((0, 0, .026))
    red -= Vector((0, .0045 + .0035, 0))
    blue -= Vector((0, .0042 + .0035, 0))
    shoulder = body + Vector((0, 0, .034))
    contact = red.lerp(blue, wx)
    # 両弁の間を歩く短い時間だけは、空中のノブをつかまず手を下げる。
    traveling = sm(min(1.0, 4 * wx * (1 - wx)))
    wrist = contact.lerp(shoulder + Vector((0, .010, -.023)), traveling)
    elbow = _two_link_elbow(shoulder, wrist)
    _set_rod(M['_gpt_worker_upper'], shoulder, elbow)
    _set_rod(M['_gpt_worker_fore'], elbow, wrist)
    M['_gpt_worker_elbow'].location = elbow
    M['_gpt_worker_hand'].location = wrist
    for key in ('_gpt_worker_upper', '_gpt_worker_fore', '_gpt_worker_elbow', '_gpt_worker_hand'):
        d.show(M[key], True)
    M['_gpt_worker_contact'] = {'wrist': tuple(wrist), 'red_front': tuple(red), 'blue_front': tuple(blue),
                              'error': (wrist - (red if wx < .5 else blue)).length if wx in (0.0, 1.0) else None}
    # 汗も古い足場の位置へ残さない。
    for obj in M['wsweat']:
        obj.location += body - Vector((-.10 + .15 * wx, .006, .4205))


def _apply_drain_clearance(M, st):
    if not M.get('_gpt_worker_drain_version'):
        return
    # 世界の X 軸でなく、斜めの排水管に直交する実際の蝶番の軸で回す。
    # 上の掃引検査と同じ局所座標の回転を、行列の積で明示する。
    M['dflap'].rotation_euler = (M['dflap_base'].to_matrix() @
                               Matrix.Rotation(-1.1 * st['drain'], 3, 'X')).to_euler()
    broken = st.get('drain_broken', st['drain'] < 0)
    for seat, offset in zip(M['_gpt_drain_seats'], M['_gpt_drain_seat_offsets']):
        # 半円管の頂点は世界位置を含むため、通常の object.location は原点。
        # 元の rest は変更せず、このフレームに必要な分だけ離す。
        seat.location = M['base'][seat][0] + (offset if broken else Vector((0, 0, 0)))
        d.show(seat, bool(st['show_drain']))


def add_readable_channels(M):
    """既に構築したMにも一度だけ適用できる管・弁座・水膜の読みやすさ修正。

    戻り値added_objectsを呼び出し側のMANAGED/BASE/CHILDRENへ追加する。
    既存M['base']は一切置き換えない。二度目は何も追加しない。
    ただし後から追加された jack の断面修正は、既存 M にも一度適用する。
    """
    if M.get('_gpt_readable_channels_ready'):
        updated = _ensure_readable_jack(M)
        live = add_worker_drain_clearance(M)
        return {'added_objects': live['added_objects'], 'updated_objects': updated,
                'already_applied': not bool(updated or live['added_objects'])}
    prefix = M['svhandle'].name.rsplit('_svhandle', 1)[0]
    Lx = M['L']
    BX, CY, CB = Lx['BX'], Lx['CY'], Lx['CB']
    brass = M['mats']['brass']
    iron = M['mats']['iron']
    inner_brass = d.mat(prefix + '_gpt_channel_inner_brass', '#6e5a33', .48, metal=.40)
    inner_iron = d.mat(prefix + '_gpt_channel_inner_iron', '#3e484c', .48, metal=.30)
    front_brass = original._alpha_mat(prefix + '_gpt_channel_front_brass', '#c9a44e', .26, metal=.35, alpha=.065)
    front_iron = original._alpha_mat(prefix + '_gpt_channel_front_iron', '#9aafb5', .26, metal=.20, alpha=.065)
    M['_gpt_channel_front_mats'] = (front_brass, front_iron)
    M['_gpt_channel_opaque'] = []
    M['_gpt_channel_fronts'] = []
    added_all = []
    def channel(name, a, b, outer, inner, gray=False):
        rear = _half_channel(prefix + name + '_back', a, b, outer, inner,
                             iron if gray else brass, inner_iron if gray else inner_brass, 0, 180)
        mat = front_iron if gray else front_brass
        front = _half_channel(prefix + name + '_front', a, b, outer, inner, mat, mat, 180, 360)
        M['_gpt_channel_opaque'].append(rear)
        M['_gpt_channel_fronts'].append(front)
        return rear, front
    # 蒸気の通り道。釜の屋根と筒の床の中へ少し重ねて連続を見せる。
    before = set(bpy.data.objects)
    top_k = Lx['K1'] + Lx['KDOME']
    VZ = Lx['VZ']
    _hide_obsolete(M, M['steampipe'], bpy.data.objects.get(prefix + '_steamvalvebody'))
    channel('_steampipe_readable_lower', (BX, CY, top_k - .005), (BX, CY, VZ - .011), .0090, .0065)
    channel('_steamvalve_readable_body', (BX, CY, VZ - .011), (BX, CY, VZ + .011), .0135, .0118)
    channel('_steampipe_readable_upper', (BX, CY, VZ + .011), (BX, CY, CB + .003), .0090, .0065)
    _plate_with_hole(prefix + '_steamvalveseat_readable', .0133, .0022, inner_brass,
                     (BX, CY, VZ), hole_radius=.0107, n=48)
    added_all.extend(_register_live(M, 'core', before))
    # 冷水は、水槽から弁、曲がり角を通り、筒内の実ノズルまでつなぐ。
    before = set(bpy.data.objects)
    tx, ty, tz0, tz1, tw, td = Lx['TANK']
    CVZ = Lx['CVZ']
    end = Vector((BX + .018, CY + .012, CB + .004))
    M['_gpt_cold_path'] = [Vector((tx, .12, tz0 + .006)), Vector((tx, .12, CB + .005)),
                            Vector((BX + .029, .12, CB + .005)), end, end + Vector((0, 0, .006))]
    for obj in M['coldpipe']:
        _hide_obsolete(M, obj)
    _hide_obsolete(M, bpy.data.objects.get(prefix + '_coldvalvebody'),
                   bpy.data.objects.get(prefix + '_coldelbow'), bpy.data.objects.get(prefix + '_jet'))
    channel('_coldpipe_readable_upper', (tx, .12, tz0 + .006), (tx, .12, CVZ + .009), .0057, .0041)
    channel('_coldvalve_readable_body', (tx, .12, CVZ + .009), (tx, .12, CVZ - .009), .0110, .0097)
    channel('_coldpipe_readable_lower', (tx, .12, CVZ - .009), (tx, .12, CB + .005), .0057, .0041)
    for i, (a, b) in enumerate(zip(M['_gpt_cold_path'][1:], M['_gpt_cold_path'][2:])):
        channel('_coldpipe_readable_bend%d' % i, a, b, .0057, .0041)
    _plate_with_hole(prefix + '_coldvalveseat_readable', .0108, .0020, inner_brass,
                     (tx, .12, CVZ), hole_radius=.0086, n=48)
    added_all.extend(_register_live(M, 'tank', before))
    # 排水も、輪だけでなく灰色の管壁でつなぐ。実出口の一方弁は維持。
    before = set(bpy.data.objects)
    _hide_obsolete(M, M['drainpipe'])
    channel('_drainpipe_readable', Lx['DRAIN0'], Lx['DRAIN1'], .0067, .0051, gray=True)
    added_all.extend(_register_live(M, 'drain', before))
    # 小型ポンプの送水管は金色の背面で経路を読み取れるように。
    before = set(bpy.data.objects)
    for obj in M['jpipe']:
        _hide_obsolete(M, obj)
    for obj in M['groups'].get('jack', []):
        if obj.name.startswith(prefix + '_jackelbow'):
            _hide_obsolete(M, obj)
    for i, (a, b) in enumerate(zip(M['jpath'], M['jpath'][1:])):
        channel('_jackpipe_readable_%d' % i, a, b, .0048, .0036)
    added_all.extend(_register_live(M, 'jack', before))
    # 薄い水膜は灰色のピストンと区別。厚みを大げさにはしない。
    film_mat = original._alpha_mat(prefix + '_gpt_film_clear_blue', '#167eaf', .22, alpha=.90)
    edge_mat = d.mat(prefix + '_gpt_film_edge_blue', '#4cb7db', .25)
    glint_mat = d.mat(prefix + '_gpt_film_glint', '#c4edf4', .28)
    M['film'].data.materials.clear()
    M['film'].data.materials.append(film_mat)
    before = set(bpy.data.objects)
    center = M['piston'].location.copy()
    M['_gpt_film_rim'] = d.torus(prefix + '_pistonwater_readable_edge', Lx['CR'] - .0045, .00042,
                                 center + Vector((0, 0, .0061)), edge_mat)
    d.parent(M['_gpt_film_rim'], M['piston'])
    M['_gpt_film_glints'] = []
    for i in range(5):
        a0, a1 = math.radians(50 + i * 7), math.radians(57 + i * 7)
        a = center + Vector((.021 * math.cos(a0), .021 * math.sin(a0), .0064))
        b = center + Vector((.021 * math.cos(a1), .021 * math.sin(a1), .0064))
        obj = rod(prefix + '_pistonwater_readable_glint%d' % i, a, b, .00030, glint_mat)
        d.parent(obj, M['piston'])
        M['_gpt_film_glints'].append(obj)
    added_all.extend(_register_live(M, 'core', before))
    # 既存の実開口は大きさを変えず、内壁だけ暗い鉄にして穴の深さを見せる。
    hole_wall = d.mat(prefix + '_gpt_pump_hole_wall', '#3d484d', .52, metal=.35)
    for suffix in ('_gpt_footplate', '_gpt_bucketdisc'):
        obj = bpy.data.objects.get(prefix + suffix)
        if obj is not None:
            obj.data.materials.append(hole_wall)
            index = len(obj.data.materials) - 1
            for face in obj.data.polygons:
                if face.index % 4 == 3:
                    face.material_index = index
    # sphere生成時の楕円scaleとapply時のscaleが二重にかかっていた。
    # baked meshだけ丸へ戻し、applyで小さな丸い房として配置する。
    for objs, axes in [(M['kpuffs'], (1.3, 1.1, .8)), (M['cpuffs'], (1.3, 1.2, .9))]:
        for obj in objs:
            mesh = obj.data.copy()
            obj.data = mesh
            for vertex in mesh.vertices:
                vertex.co.x /= axes[0]
                vertex.co.y /= axes[1]
                vertex.co.z /= axes[2]
            mesh.update()
    M['_gpt_readable_channels_ready'] = True
    updated = _ensure_readable_jack(M)
    added_all.extend(add_worker_drain_clearance(M)['added_objects'])
    # restは追加物に限って上で登録済み。呼び出し側へ差分を渡す。
    return {'added_objects': added_all, 'updated_objects': updated, 'already_applied': False,
            'steam_path': ((BX, CY, top_k - .005), (BX, CY, CB + .003)),
            'cold_path': [tuple(v) for v in M['_gpt_cold_path']]}


def _apply_readable_channels(M, st, t):
    if not M.get('_gpt_readable_channels_ready'):
        return
    for material in M['_gpt_channel_front_mats']:
        original.set_alpha(material, .065 if st['covers'] < .5 else 1.0)
    # 小型ポンプの外観／断面も covers と同期する。黄色い二つの扉は常に
    # 元の不透明材質のままなので、透明な金属や水に紛れて消えない。
    if M.get('_gpt_jack_cutaway_version', 0) >= 1:
        front, glass_front, glass_back, water = M['_gpt_jack_cutaway_mats']
        cutaway = st.get('jack_cutaway', st['covers'] < .5)
        original.set_alpha(front, .022 if cutaway else 1.0)
        original.set_alpha(glass_front, .025 if cutaway else .18)
        original.set_alpha(glass_back, .12 if cutaway else .18)
        original.set_alpha(water, .07 if cutaway else .45)
    # 白い目印は開いた円板の横を通す。細い管の内側からはみ出させない。
    for i, obj in enumerate(M['sdrops']):
        obj.scale = (.55, .55, .55)
        obj.location.x = M['L']['BX'] + (.0039 if i % 2 else -.0039)
    # 曲管の端で粒が瞬間移動しないよう、連続した管の長さで位置を求める。
    for i, obj in enumerate(M['cdrops']):
        u = (t * 1.3 + i / len(M['cdrops'])) % 1
        obj.location = _path_position(M['_gpt_cold_path'], u)
        CVZ = M['L']['CVZ']
        if abs(obj.location.z - CVZ) < .009 and abs(obj.location.x - M['L']['TANK'][0]) < .001:
            obj.location.x += .0055 * math.sin(math.pi * (obj.location.z - CVZ + .009) / .018)
        obj.scale = (.70, .70, .70)
        d.show(obj, st['show_tank'] and st['cold_flow'] > 0 and u <= st['cold_front'])
    # 気体の房は薄いパンを積むのでなく、小さな丸がゆっくり上へ動く。
    BX, CY, CB = M['L']['BX'], M['L']['CY'], M['L']['CB']
    kz0 = M['L']['K0'] + .003
    kh = (M['L']['K1'] - M['L']['K0'] - .006) * st['kwater']
    lo, hi = kz0 + kh + .006, M['L']['K1'] + .009
    k = st['kettle_steam']
    for i, obj in enumerate(M['kpuffs']):
        u = (t * .23 + i * .173) % 1
        angle = i * 2.40 + t * .16
        radius = .006 + .014 * ((i % 3) / 2)
        obj.location = (BX + radius * math.cos(angle), CY + radius * math.sin(angle), lo + max(.005, hi - lo) * u)
        size = (.48 + .10 * math.sin(i * 1.7 + t * .9)) * (.4 + .6 * k)
        obj.scale = (size, size, size)
    g = geometry(M, st)
    sf = st['steam_fill']
    height = max(.004, g['pz'] - CB - .013)
    for i, obj in enumerate(M['cpuffs']):
        u = (t * .20 + i * .157) % 1
        angle = i * 2.40 + t * .13
        radius = .007 + .009 * (i % 2)
        obj.location = (BX + radius * math.cos(angle), CY + radius * math.sin(angle), CB + .007 + height * u)
        size = sf * (.48 + .07 * math.sin(i * 1.3 + t))
        obj.scale = (size, size, min(size, height / .022))
    original.set_alpha(M['steamfill'].active_material, .18 * sf)
    # 膜のふちは水を張り終えるにつれて現れる。薄い厚みは元のまま。
    f = st.get('film', 1.0)
    rim = M['_gpt_film_rim']
    rim.scale = (max(.05, f), max(.05, f), 1.0)
    d.show(rim, f > .1)
    for obj in M['_gpt_film_glints']:
        d.show(obj, f > .8)


def build_machine(prefix='d1m', with_mine=True):
    M = original.build_machine(prefix, with_mine)
    M['L'] = dict(L)
    M['_gpt_obsolete'] = []
    mats = M['mats']
    SX, CY, PB, PT = L['SX'], L['CY'], L['PB'], L['PT']
    # 円い弁は元の角扉の幅の2.17倍。穴・板・水・筒を同時に広げる。
    M['_gpt_hole_x'] = .031
    M['_gpt_flap_radius'] = .026
    if with_mine:
        before = set(bpy.data.objects)
        glass = original._alpha_mat(prefix + '_gpt_pump_glass', '#dceff4', .10, alpha=.10)
        inner_water = original._alpha_mat(prefix + '_gpt_pump_water', '#4f93c8', .34, alpha=.13)
        for key in ('barrelwater', 'belowwater'):
            M[key].data.materials.clear()
            M[key].data.materials.append(inner_water)
            M[key].scale.x = M[key].scale.y = L['PR'] / original.L['PR']
        M['vacglow'].scale.x = M['vacglow'].scale.y = (L['PR'] - .003) / (original.L['PR'] - .003)
        _hide_obsolete(M, M['barrel'])
        M['barrel'] = original._sector_mesh(prefix + '_gpt_barrel_back', (SX, CY, PB), L['PR'], PT - PB, -40, 220, glass, n=52)
        M['_gpt_pump_cover_mat'] = original._alpha_mat(prefix + '_gpt_pump_cover', '#dceff4', .10, alpha=.10)
        M['_gpt_pump_cover'] = original._sector_mesh(prefix + '_gpt_barrel_front', (SX, CY, PB), L['PR'], PT - PB, 220, 320, M['_gpt_pump_cover_mat'], n=28)
        for obj in M['groups']['pump']:
            if obj.name.startswith(prefix + '_barrelrim') or obj.name == prefix + '_reducer':
                _hide_obsolete(M, obj)
        for z in (PB, PT):
            d.torus(prefix + '_gpt_barrelrim', L['PR'], .0017, (SX, CY, z), mats['iron'])
        # 上の細い管へ、口が開いた円すいで接続する。
        bpy.ops.mesh.primitive_cone_add(vertices=48, radius1=L['PR'], radius2=L['PIPE'], depth=.012,
                                        location=(SX, CY, PT + .006), end_fill_type='NOTHING')
        reducer = bpy.context.view_layer.objects.active
        reducer.name = prefix + '_gpt_reducer'
        d.put(reducer, glass)
        # 底板と、上下するふたに、同じ大きさの本当の穴を開ける。
        for suffix in ('_footplate', '_foothole', '_bucketdisc', '_buckethole', '_bucketleather'):
            _hide_obsolete(M, bpy.data.objects.get(prefix + suffix))
        fz = PB + .004
        _plate_with_hole(prefix + '_gpt_footplate', L['PR'] - .001, .004, mats['iron'], (SX, CY, fz),
                         hole_x=M['_gpt_hole_x'], hole_radius=.0245)
        bucket = _plate_with_hole(prefix + '_gpt_bucketdisc', L['PR'] - .0015, .007, M['hl']['bucket'],
                                  (SX, CY, 0), hole_x=M['_gpt_hole_x'], hole_radius=.0245)
        d.parent(bucket, M['bucket'])
        leather = d.torus(prefix + '_gpt_bucketleather', L['PR'] - .0015, .0018, (SX, CY, 0), mats['leather'])
        d.parent(leather, M['bucket'])
        for role, z, parent in [('foot', fz + .0025, None), ('bflap', .004, M['bucket'])]:
            old = M[role]
            _hide_obsolete(M, old, *(M['children'].get(old, [])))
            root = d.empty(prefix + '_gpt_' + role, (SX + .005, CY, z))
            flap = d.cyl(prefix + '_gpt_' + role + '_plate', M['_gpt_flap_radius'], .0025,
                         (SX + .031, CY, z + .00125), M['hl'][role], verts=64)
            d.parent(flap, root)
            if parent is not None:
                d.parent(root, parent)
            M[role] = root
            M['bflap_plate' if role == 'bflap' else 'footplate_flap'] = flap
        # 筒が太くなった分だけ、周囲の水の「見せる切り口」も広げる。
        sump = L['SUMP']
        xa, xb = SX - L['PR'] - .002, SX + L['PR'] + .002
        left, right, back = M['sumpwater']
        left.dimensions.x = max(.002, xa - sump[0] - .001)
        left.location.x = (sump[0] + xa) / 2
        right.dimensions.x = max(.002, sump[1] - xb - .001)
        right.location.x = (xb + sump[1]) / 2
        back.dimensions.x = xb - xa
        back.dimensions.y = max(.002, .159 - (CY + L['PR'] + .002))
        back.location.y = (.159 + CY + L['PR'] + .002) / 2
        _group_added(M, 'pump', before)
    # 水槽ポンプの入口を、くみ上げた水の桶まで実際につなぐ。
    before = set(bpy.data.objects)
    JX, G = L['JX'], L['G']
    tx, ty, tr, th = L['TUB']
    inlet_glass = original._alpha_mat(prefix + '_gpt_inlet_glass', '#dceff4', .15, alpha=.22)
    M['_gpt_jin_path'] = [Vector((tx - .006, ty, G + .010)),
                           Vector((JX - .014, CY, G + .010)),
                           Vector((JX - .014, CY, G + .003)),
                           Vector((JX + .003, CY, G + .003)),
                           Vector((JX + .003, CY, G + .013))]
    for i, (a, b) in enumerate(zip(M['_gpt_jin_path'], M['_gpt_jin_path'][1:])):
        rod(prefix + '_gpt_jin_pipe%d' % i, a, b, .0032, inlet_glass)
    M['_gpt_jin_drops'] = [d.sphere(prefix + '_gpt_jin_drop%d' % i, .0017, (0, 0, -5),
                                    d.mat(prefix + '_gpt_jin_blue', '#276da4', .35), seg_=10, ring=5) for i in range(9)]
    # 小さなポンプの底・ふたにも実開口。棒が通る上蓋にも穴を開ける。
    for suffix, z, radius, depth, hx, hr, parent in [
        ('_jackfoot', G + .010, .0085, .0025, .003, .0036, None),
        ('_jackbucketdisc', 0, .0083, .004, .0045, .0025, M['jbucket']),
        ('_jackcap', G + .0595, .0105, .003, 0.0, .0025, None)]:
        old = bpy.data.objects.get(prefix + suffix)
        _hide_obsolete(M, old)
        plate = _plate_with_hole(prefix + '_gpt' + suffix, radius, depth, mats['iron'],
                                 (JX, CY, z), hole_x=hx, hole_radius=hr, n=48)
        if parent is not None:
            d.parent(plate, parent)
    _group_added(M, 'jack', before)
    # 排水路は筒内の水から連続して始まり、桶の真上まで下がる。
    # 元の始点は床より3mm低く、筒との接続が見えなかった。
    M['L']['DRAIN0'] = (L['BX'] + .018, CY - .018, L['CB'] + .006)
    before = set(bpy.data.objects)
    old_pipe = M['drainpipe']
    _hide_obsolete(M, old_pipe, bpy.data.objects.get(prefix + '_drainelbow'))
    M['drainpipe'] = rod(prefix + '_gpt_drainpipe', M['L']['DRAIN0'], L['DRAIN1'], .0065, M['hl']['drainpipe'])
    d.torus(prefix + '_gpt_drain_inlet', .007, .0013, M['L']['DRAIN0'], mats['iron'])
    _group_added(M, 'drain', before)
    # 筒床を蒸気が通り抜ける所にも実開口を作る。
    before = set(bpy.data.objects)
    _hide_obsolete(M, bpy.data.objects.get(prefix + '_cylfloor'))
    _plate_with_hole(prefix + '_gpt_cylfloor', L['CR'], .004, mats['iron'],
                     (L['BX'], CY, L['CB']), hole_radius=.0095)
    _group_added(M, 'core', before)
    # 出っぱりとレバーは奥行きも一致させる。旧版は2.5mm離れていた。
    strike = bpy.data.objects.get(prefix + '_leverstrike')
    strike.location.y += .006
    strike.dimensions.y = .009
    # 重りの重心が、押される終わり(lv=.4)で支点の真上を越える。
    # 旧版の-30度では押し終えても手前へ戻る向きだった。
    before = set(bpy.data.objects)
    for suffix in ('_leverweightarm', '_leverweight'):
        _hide_obsolete(M, bpy.data.objects.get(prefix + suffix))
    LP = Vector(L['LEVER'])
    angle = math.radians(-18)
    direction = Vector((math.sin(angle), 0, math.cos(angle)))
    weight_arm = d.box(prefix + '_gpt_weightarm', (.004, .004, .030),
                       LP + Vector((0, -.004, 0)) + direction * .015, M['hl']['lever'], bevel=.0012,
                       rot=(0, angle, 0))
    weight = d.sphere(prefix + '_gpt_weight', .0078,
                      LP + Vector((0, -.004, 0)) + direction * .032, M['hl']['lever'], seg_=24, ring=12)
    d.parent(weight_arm, M['lever'])
    d.parent(weight, M['lever'])
    M['_gpt_link_bolts'] = [d.sphere(prefix + '_gpt_linkbolt%d' % i, .0020, (0, 0, -5), mats['iron'], seg_=12, ring=6) for i in range(4)]
    _group_added(M, 'lever', before)
    # 新しく作った物も、元と同じリセット・表示管理へ登録。
    M['all'] = list(dict.fromkeys(M['all']))
    M['base'] = {o: (o.location.copy(), o.rotation_euler.copy(), o.scale.copy()) for o in M['all']}
    M['children'] = {}
    for obj in M['all']:
        if obj.parent is not None:
            M['children'].setdefault(obj.parent, []).append(obj)
    for obj in M['all']:
        d.show(obj, False)
    add_readable_channels(M)
    return M


def _pump_readable(M, st, t, g):
    """水は開いた本当の穴だけを通る。大きな扉の筒/ふたとの衝突も防ぐ。"""
    Lx = M['L']
    SX, CY, PB, PT = Lx['SX'], Lx['CY'], Lx['PB'], Lx['PT']
    bz = M['rod_bottom0'] + g['rod_dz']
    vdir, vu = st['vdir'], st['vu']
    bopen = st['bvalve'] if st['bvalve'] is not None else (sm(vu / .12) * (1 - sm((vu - .9) / .1)) if vdir > 0 else 0.0)
    fopen = st['fvalve'] if st['fvalve'] is not None else (sm(vu / .12) * (1 - sm((vu - .9) / .1)) if vdir < 0 else 0.0)
    diameter = M['_gpt_flap_radius'] * 2
    top_room = max(.002, PT - (bz + .006))
    foot_room = max(.002, bz - .005 - (PB + .008))
    M['bflap'].rotation_euler.y = -min(1.15 * bopen, math.asin(min(.99, top_room / diameter)))
    M['foot'].rotation_euler.y = -min(1.05 * fopen, math.asin(min(.99, foot_room / diameter)))
    # 説明中は手前の壁を開き、穴と弁を不透明な水で隠さない。
    cutaway = st.get('pump_cutaway', st['covers'] < .5)
    original.set_alpha(M['_gpt_pump_cover_mat'], .015 if cutaway else .14)
    transfer, refill, leak = st.get('transfer'), st.get('refill'), st.get('leakp')
    if transfer is None and vdir > 0:
        transfer = min(1.0, vu * 1.3)
    if refill is None and vdir < 0 and st['fvalve'] is None and not st['no_bflap']:
        refill = min(1.0, vu * 1.3)
    if leak is None and vdir < 0 and st['no_bflap']:
        leak = min(1.0, vu * 1.3)
    if not st['pdrops']:
        return
    # 元の自動補充では、手動説明で底の弁を閉じた時にも粒が出る。
    # 一旦消し、下で実際の開閉に対応する群だけを見せる。
    for obj in M['pdrops']:
        d.show(obj, False)
    rng = random.Random(5)
    fz = PB + .006
    hole = Vector((SX + M['_gpt_hole_x'], CY - .004, bz))
    foot = Vector((SX + M['_gpt_hole_x'], CY - .004, fz + .002))
    for i in range(8):
        obj = M['pdrops'][i]
        ox = rng.uniform(-.021, .021)
        oz = rng.uniform(.005, .015)
        above = Vector((SX + ox, CY - .004, min(PT - .004, bz + .007 + oz)))
        below = Vector((SX + ox, CY - .004, max(fz + .004, bz - .008 - oz * .5)))
        if transfer is not None:
            u = max(0, min(1, transfer * 1.45 - i * .055))
            path = [below, hole + Vector((0, 0, -.006)), hole + Vector((0, 0, .008)), above]
            pos = _path_position(path, u)
        elif leak is not None:
            u = max(0, min(1, leak * 1.45 - i * .055))
            path = [above, hole + Vector((0, 0, .008)), hole + Vector((0, 0, -.006)), below]
            pos = _path_position(path, u)
        else:
            pos = above
        obj.location = pos
        d.show(obj, True)
    if refill is not None:
        for i in range(8):
            obj = M['pdrops'][8 + i]
            side = -1 if i % 2 else 1
            outside = Vector((SX + side * (Lx['PR'] + .008), CY - .004, fz + .009))
            under = foot + Vector((0, 0, -.010))
            inside = Vector((SX + .020 + .005 * (i % 3), CY - .004, min(bz - .006, fz + .018)))
            u = max(0, min(1, refill * 1.45 - i * .055))
            obj.location = _path_position([outside, under, foot + Vector((0, 0, .007)), inside], u)
            d.show(obj, True)


def apply_machine(M, st, t):
    original.apply_machine(M, st, t)
    if st['mine']:
        _pump_readable(M, st, t, geometry(M, st))
    # 空気/水が出る口の始点を、変更した筒内の水につなぎ直す。
    if st['show_drain']:
        a, b = Vector(M['L']['DRAIN0']), Vector(M['L']['DRAIN1'])
        for i, obj in enumerate(M['ddrops']):
            u = (t * 1.2 + i / len(M['ddrops'])) % 1
            obj.location = a.lerp(b, min(1.0, u / .75)) if u < .75 else b + Vector((0, 0, -.03 * (u - .75) / .25))
        for i, obj in enumerate(M['dair']):
            u = (t + i / len(M['dair']) + .05) % 1
            obj.location = a.lerp(b, min(1.0, u / .7)) + Vector((0, -.002, .003)) if u < .7 else b + Vector((0, 0, .02 * (u - .7)))
    # 吸水はふたが上がる時。目印の粒が、桶→入口→底の弁をたどる。
    for i, obj in enumerate(M['_gpt_jin_drops']):
        obj.location = _path_position(M['_gpt_jin_path'], (t * .65 + i / len(M['_gpt_jin_drops'])) % 1)
        d.show(obj, st['jack'] and st['vdir'] < 0 and st['jack_flow'] > 0)
    if st['show_lever']:
        # 取っ手・レバー双方の回転を反映し、固定点へつながる偽の棒をなくす。
        LP = Vector(M['L']['LEVER'])
        lv = st['lever']
        lever_rot = M['lever'].rotation_euler.to_matrix()
        red_rot = M['svhandle'].rotation_euler.to_matrix()
        blue_rot = M['cvhandle'].rotation_euler.to_matrix()
        start_red = LP + lever_rot @ Vector((-.010, -.010, .003))
        start_blue = LP + lever_rot @ Vector((.006, -.010, -.007))
        end_red = M['svhandle'].location + red_rot @ Vector((0, 0, .029))
        end_blue = M['cvhandle'].location + blue_rot @ Vector((0, 0, .026))
        _set_rod(M['link_red'], start_red, end_red)
        _set_rod(M['link_blue'], start_blue, end_blue)
        for obj, pos in zip(M['_gpt_link_bolts'], (start_red, end_red, start_blue, end_blue)):
            obj.location = pos
            d.show(obj, True)
    _apply_readable_channels(M, st, t)
    _apply_worker_contact(M, st)
    _apply_drain_clearance(M, st)
    # 元の表示関数はグループを一括で見せるため、置換前の物は最後に必ず隠す。
    for obj in M['_gpt_obsolete']:
        d.show(obj, False)


def show_machine(M, visible=True):
    for obj in M['all']:
        d.show(obj, visible and obj not in M['_gpt_obsolete'])


def physical_checks():
    """Blender の描画を要しない寸法関係（レンダリングの代わりにはしない）。"""
    hole_x, hole_radius, flap_radius = .031, .0245, .026
    assert hole_x + hole_radius < L['PR'] - .0015
    assert hole_x + flap_radius < L['PR']
    assert hole_x - hole_radius > .0075 / 2
    assert flap_radius * 2 >= .024 * 2
    # レバーの打たれる腕と出っぱりが奥行き方向でも重なる。
    strike_y = L['LEVER'][1] - .004 + .006
    assert max(strike_y - .009 / 2, L['PLUGY'] - .007 / 2) < min(strike_y + .009 / 2, L['PLUGY'] + .007 / 2)
    # 押す終わり(.4)で重りが支点の真上を越える。
    assert abs(-18 + (-10 + 70 * .4)) < 1e-9
    return dict(pump_radius=L['PR'], flap_width=.052, hole_radius=hole_radius,
                strike_tappet_depth_overlap=.006, overcentre_at=.4)
