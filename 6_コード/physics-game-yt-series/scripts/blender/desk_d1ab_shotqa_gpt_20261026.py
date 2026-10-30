"""D-1 前後編の撮影台本・実形状投影 QA（描画・カメラ変更はしない）。

Blender で scene を読み込んだ ns に対し run(ns) を呼ぶ。
単体実行では何もしない。既存 scene / 台本 / 自動検査は変更しない。
出力は新キャッシュの blender/gpt-shotqa/ の新しい日時付きファイルだけ。

主役は cue ごとに意味で選ぶ。手・流体粒・矢印・机・周辺の装飾を加えて
幅を水増ししない。評価後 mesh の全頂点から投影の極値を求め、その実頂点を
world_to_camera_view で再投影して数値を確定する。遮蔽と字幕の重なりは
この幾何検査だけでは合否を決めず、完成画での目視が必要と明記する。
"""
import datetime
import json
import math
import os
import re
import statistics


# 主役候補の機械部分。括弧内は置換前にも共通する名前の末尾。
MECHANISM = ('core', 'rod', 'pump', 'tank', 'jack', 'drain', 'lever', 'plug')
BODY = ('_cylinder', '_cover_cylinder', '_cylrim', '_piston', '_pistondisc', '_pistonleather', '_pistoneye', '_gpt_cylfloor')
BOILER = ('_fire_back', '_fire_side', '_fire_floor', '_cover_fire', '_firecoal', '_flame', '_kettle', '_cover_kettle', '_kettlerim', '_kettlefloor')
STEAM_VALVE = ('_steampipe', '_steamvalve', '_svdisc', '_svhandle', '_svknob', '_svspindle')
COLD_VALVE = ('_coldpipe', '_coldvalve', '_cvdisc', '_cvhandle', '_cvknob', '_cvspindle', '_coldelbow', '_coldrim')
TANK_CONTAINER = ('_tankfloor', '_tankback', '_tankside', '_tankfront', '_tankhoop')
TANK_SUPPORT = ('_tankleg', '_tankbrace')
TANK = TANK_CONTAINER + TANK_SUPPORT
BEAM = ('_beam', '_archhead', '_archstrut', '_axle', '_chainP', '_chainR', '_pistoneye', '_rodeye')
MINE_ROD = ('_rodseg', '_rodband', '_rodeye')
PUMP_BODY = ('_barrel', '_gpt_barrel', '_gpt_reducer', '_reducer', '_gpt_footplate', '_footplate', '_gpt_bucketdisc', '_bucketdisc', '_gpt_bucketleather', '_bucketleather', '_gpt_foot', '_gpt_bflap', '_footvalve', '_bucketvalve')
RISING_PIPE = ('_risingmain', '_piperim', '_spout', '_spoutrim')
DRAIN = ('_drainpipe', '_gpt_drainpipe', '_gpt_drain_inlet', '_drainelbow', '_drainrim', '_drainflap')
LEVER_BODY = ('_leverpin', '_leverstrike', '_leverweight', '_gpt_weightarm', '_gpt_weight')
LEVER_LINKS = ('_linkred', '_linkblue', '_gpt_linkbolt')
LEVER = LEVER_BODY + LEVER_LINKS
PLUG = ('_plugrod', '_plugbracket', '_tappetgreen', '_tappetorange')
JACK_BODY = ('_jackbarrel', '_jackrim', '_jackfoot', '_jackbucket', '_jackcap', '_gpt_jackfoot', '_gpt_jackbucket', '_gpt_jackcap', '_gpt_jin_pipe')
JACK_ROD = ('_jackrod',)
JACK_ARM = ('_beam', '_archhead', '_archstrut', '_axle')
JACK = JACK_BODY + JACK_ROD

_EXCLUDE_NAME = re.compile(r'(?:airdot|innerair|steamdot|steampush|steamfill|cpuff|kpuff|bubble|spray\d|cold_\d|colddot|draindot|drainair|pdrop\d|sdrop\d|jackdot|jin_drop|spoonmist|canm_\d|valvegas|seep\d|sweat|vacglow|pathgreen|pathorange|_trace|_sumppush|_airpush|_doorpush|_push\d|_arrow|_stem|_tip|_rain\d)', re.I)
_EXCLUDE_FLUID = re.compile(r'(?:kettlewater|pistonwater|condensate|sumpwater|galwater|barrelwater|belowwater|trough_water|tubwater|tankwater|jackwater|_column|_tapstream|spoonwater|dishwater|shaftwater|_pool|_watermarker)', re.I)


def _objects(value):
    """辞書・root・object 配列から mesh 候補を平らにする。"""
    if value is None or isinstance(value, (str, bytes, int, float, bool)):
        return []
    if hasattr(value, 'type') and hasattr(value, 'matrix_world'):
        result = [value]
        for child in value.children:
            result.extend(_objects(child))
        return result
    if isinstance(value, dict):
        return [obj for child in value.values() for obj in _objects(child)]
    try:
        return [obj for child in value for obj in _objects(child)]
    except TypeError:
        return []


def _named(ns, tokens):
    return [obj for obj in ns.get('M', {}).get('all', []) if any(token.lower() in obj.name.lower() for token in tokens)]


def _groups(ns, *groups):
    return [obj for name in groups for obj in ns.get('G', {}).get(name, [])]


def _machine_groups(ns, *groups):
    return [obj for name in groups for obj in ns.get('M', {}).get('groups', {}).get(name, [])]


def _word(cue, fragment, default):
    hits = [float(w['time']) for w in cue.get('wordEvents', []) if fragment in w['word']]
    return hits[0] if hits else default


def semantic_primary(ns, cue, t):
    """(name, objects, reason)。未登録の物は UNKNOWN にして自動合格させない。

    新しく前編で作る空気ポンプ等は、ns['SHOTQA_PRIMARY'] に指定できる。
    値は {'name': '説明主役', 'objects': [実物object...], 'reason': '理由'}、
    または (ns, cue, t) を受け同形式を返す関数。全文・流体群の指定は不可。
    """
    key = cue['key']
    custom = ns.get('SHOTQA_PRIMARY', {}).get(key)
    if custom is not None:
        spec = custom(ns, cue, t) if callable(custom) else custom
        return spec['name'], _objects(spec['objects']), '明示指定: ' + spec.get('reason', '')
    def machine(name, tokens, reason):
        return name, _named(ns, tokens), reason
    def group(name, *groups):
        return name, _groups(ns, *groups), '説明している模型の group のみ。手・流体粒・矢印は除外。'
    def whole():
        return '機械の作動部全体', _machine_groups(ns, *MECHANISM), '機械全体を説明。炭鉱の地層・机・石炭・馬は大きさに加算しない。'
    # 後編：部品の説明では機械全体に逃げず、その部品だけを測る。
    if key in ('open:machine', 'parts:likecan', 'run:repeat', 'lever:auto', 'nc:install', 'next:open'):
        return whole()
    if key.startswith('boiler:') or key == 'nc:boiler':
        return machine('火床と水をわかす釜', BOILER, '火と釜の因果関係を見せる部品。腕・筒・水槽は除外。')
    if key == 'valve:pipe' or key == 'run:shut':
        return machine('蒸気の管と開閉弁', STEAM_VALVE, '弁の板と取っ手、流路が今回の主役。')
    if key == 'valve:tap':
        return machine('蒸気の弁と蛇口の比較', STEAM_VALVE + ('_tapspout', '_tapnose', '_tapsupply', '_tapcross', '_tapbasin'), '比べる2つの栓だけ。周囲の機械は除外。')
    if key in ('cyl:open', 'run:empty', 'eng:mio', 'eng:mio2', 'pump:mio', 'cyl:likecan', 'myth:mio', 'myth:side', 'myth:hyp', 'myth:if', 'myth:fact', 'myth:judge'):
        return machine('筒・ピストン・密閉する縁', BODY, '筒の内部の仕組み。蒸気の粒や力の矢印は幅に加算しない。')
    if key in ('arm:chain', 'arm:mio', 'arm:heavy'):
        return machine('シーソーの腕と鎖', BEAM, '腕を説明しているため、下の炭鉱断面で幅を広げない。')
    if key in ('arm:rod', 'run:up', 'run:down', 'run:air', 'nc:piston'):
        return machine('腕・鎖・ピストン・重い棒の連動', BEAM + MINE_ROD + BODY, '動力の経路そのもの。地層と無関係な水槽は除外。')
    if key == 'run:steam':
        if t >= _word(cue, '中から', cue['end']):
            return machine('蒸気と空気が押し合う筒とピストン', BODY, '蒸気を入れた後は筒内の押し合いを説明する。すでに通った管と弁は主役寸法に加えない。')
        return machine('蒸気入口・筒・ピストン', STEAM_VALVE + BODY, '蒸気で押し合いが釣り合う範囲。腕全体は加算しない。')
    if key == 'run:back' or key == 'lever:mio':
        return machine('切りかえる2つの弁', STEAM_VALVE + COLD_VALVE, '赤と青の弁の対応を見せる。')
    if key == 'run:spray':
        if t < _word(cue, '勢い', cue['end']) + .3:
            return machine('高い水槽から筒への冷水の経路', TANK_CONTAINER + COLD_VALVE + BODY, '源・管・到着点を一続きに説明する範囲。水槽を支える脚は流路でないため加えない。')
        return machine('筒内の注水口とピストン', BODY + ('_jet',), '噴出の説明へ寄った後は、水槽で幅を稼がない。')
    if key in ('pump:inside', 'pump:repeat'):
        return machine('底のポンプから地上の口まで', PUMP_BODY + RISING_PIPE, '今回の説明範囲は底から地上の口までの管。地上より上へ伸びる棒と腕、地層は主役に加算しない。')
    if key == 'pump:rod':
        if t < _word(cue, '先のふた', cue['end']):
            return machine('棒が通る底から地上までの管', PUMP_BODY + RISING_PIPE, '管内を通る棒の位置を説明する範囲。管の外の棒の全長は別の説明なので測らない。')
        return machine('棒の先のふたと2つの弁', PUMP_BODY, '「先のふた」から説明対象は底の内部へ移る。上までの管を含めない。')
    if key == 'pump:door2':
        return machine('底のポンプと一方へだけ開く扉', PUMP_BODY + ('_doorframe', '_doorleg', '_doorflap'), '比べる実物とたとえの2模型。机の空白は含めない。')
    if key == 'pump:opens':
        return machine('一方へだけ開く扉', ('_doorframe', '_doorleg', '_doorflap'), '開閉を説明する扉だけを主役にする。')
    if key in ('pump:down', 'pump:up', 'pump:refill', 'pump:mio2', 'pump:same', 'pump:novalve'):
        return machine('ポンプのふた・2つの弁・筒', PUMP_BODY, '水が通り抜ける中身が主役。上までの長い管や地層は除外。')
    if key == 'drain:mio':
        return machine('筒底から排水弁への経路', BODY + DRAIN, '筒底にたまる物と出口の対応範囲。')
    if key in ('drain:pipe', 'drain:out'):
        if key == 'drain:out' and _word(cue, '弁を押し開けて', cue['end']) <= t < _word(cue, '下り坂の管', cue['end']):
            return machine('開く排水弁の扉と固定蝶番', ('_drainflap', '_drainseat'), '押し開ける瞬間の寄り。管全長は次の「下り坂の管」のカットで見る。')
        return machine('排水の管と外へだけ開く弁', DRAIN, '出口弁が主役。隣の水槽や機械を測らない。')
    if key == 'drain:steam':
        return machine('筒と排水の弁', BODY + DRAIN, '筒内と外側の押し合いの経路。')
    if key == 'tank:mio':
        return machine('冷水をためた水槽', TANK_CONTAINER, '誰が水を入れるかを問う水槽の容器そのもの。台を支える脚の全長は文脈であり主役寸法には加算しない。')
    if key == 'tank:self':
        if t < _word(cue, '小さなポンプ', cue['end']):
            return machine('腕から小型ポンプへ動きを伝える接続', JACK_ARM + JACK_ROD + JACK_BODY, '最初は腕とそこから伸びる棒がどうポンプへつながるかを見る。送水管と水槽はこの寸法に加算しない。')
        if t < _word(cue, '水槽へ上げる', cue['end']):
            return machine('水槽へ送る小型ポンプの内部', JACK_BODY, '「小さなポンプ」から吸水口・ふた・2弁を見る。腕まで届く棒の全長や送水先は加えない。')
        return machine('小型ポンプから水槽へつながる水の経路', JACK_BODY + ('_jackpipe', '_jackelbow') + TANK_CONTAINER, '送水先までをたどる範囲。すでに説明した長い駆動棒や水槽の脚は加算しない。')
    if key == 'tank:same':
        return machine('小型ポンプのふたと2つの弁', JACK_BODY, '底のポンプと同じ仕組みを見せる筒内の機構。腕に届く長い駆動棒は主役に含めない。')
    if key == 'lever:hand':
        return machine('人形が操作する2つの取っ手', STEAM_VALVE + COLD_VALVE + ('_worker', '_wbody', '_whead', '_wcap', '_wleg', '_warm', '_whand'), '人が操作する因果関係。足場は除外。')
    if key in ('lever:one', 'lever:flip'):
        return machine('レバーと2つの取っ手のつなぎ', LEVER + STEAM_VALVE + COLD_VALVE, 'レバーから実際に切りかわる弁まで。腕全体は除外。')
    if key == 'lever:tappet':
        return machine('弁の棒・2つの出っぱり・レバー', PLUG + LEVER_BODY, '接触し倒れる仕組みそのもの。前の行で説明済みの弁への長いつなぎや水槽は主役に加えない。')
    if key == 'lever:fall':
        return machine('倒れるレバーと接触する出っぱり', LEVER_BODY + ('_tappetgreen', '_tappetorange'), '黒い棒の全長や弁までの長いつなぎではなく、出っぱりと重り付きレバーを測る。')
    if key == 'next:spread':
        return group('炭鉱へ広がる機械の地図', 'map')
    if key in ('next:mio2', 'next:waste', 'next:100', 'next:who'):
        return machine('温め直す筒と減る石炭', BODY + ('_coal',), '熱の無駄を比べる筒と石炭だけ。')
    if key in ('ch:drain', 'ch:stop', 'ch:answer'):
        return machine('壊れた排水の弁', ('_drainflap', '_drainrim'), '今回の問いの主役は小さな扉。長い管を加えて水増ししない。')
    if key == 'last:valve':
        if t >= cue['end'] - 1.6:
            return whole()
        if t < _word(cue, '上へだけ進ませた', cue['end']):
            return whole()
        return machine('最後に回収する底のポンプの弁', PUMP_BODY, '最後は小さな一方弁とふたの機構へ戻る。')
    if key in ('recap:can', 'recap:straw'):
        return group('前編の缶とストローの比較', 'can', 'straw')
    if key.startswith('quiz:') or key in ('ch:fuji', 'ch:later'):
        return group('富士山と2つの空気の柱', 'fuji')
    if key == 'score:still' or key == 'mine:rule':
        return group('勝負の得点板', 'score')
    # 前編：既存模型を再利用する部分。新規の空気ポンプは明示指定必須。
    if key in ('mine:open', 'mine:water', 'last:can'):
        return group('炭鉱の断面模型', 'mine')
    if key.startswith('gin:') or key == 'mine:mio' or key == 'size:rest':
        return group('馬・巻き胴・綱・桶のくみ上げ機', 'horse')
    if key.startswith('shrink:'):
        return group('水を入れた大さじと風船', 'balloon')
    if key.startswith('can:') or key in ('air:pusher', 'air:emptied'):
        if key in ('can:flip', 'can:seal'):
            return group('缶の口と水を受ける皿', 'can')
        p = ns.get('P', {}).get('can', {}).get('can')
        return '空気の力を受ける缶', _objects(p), '缶本体だけ。コンロや皿で幅を水増ししない。'
    if key.startswith('straw:'):
        return group('コップとストロー', 'straw')
    if key == 'air:weight':
        return group('積もった空気を表す層', 'air')
    if key == 'air:1kg':
        p = ns.get('P', {}).get('weights', {})
        if t < _word(cue, '手のひら', cue['end']):
            return '1平方cmの升と1kgの重り', _objects(p.get('one')), '1kgの比較をしている間は100kgの重りを加えない。'
        return '手のひらと100kgの重り', _objects([p.get('palm'), p.get('hundred')]), '手のひらの面積と押す力の比較。'
    if key == 'air:mio':
        return group('手のひらにかかる力の比較', 'weights')
    if key == 'next:mio':
        return whole()
    if key == 'air:inside' or key.startswith('why:'):
        return group('空気と蒸気の入った容器の比較', 'twocans')
    if key == 'size:wide':
        return group('太い筒と細い筒の比較', 'twins')
    if key in ('size:53', 'size:area'):
        return group('直径と面積を測る円いふた', 'area')
    if key == 'size:2t':
        return '2トンの重り', _objects(ns.get('P', {}).get('heavy', {}).get('weight')), '重さそのものを説明。まだ比べていない馬は加えない。'
    if key in ('size:horse4', 'size:mio'):
        return group('2トンと馬4頭の比較', 'heavy')
    if key in ('size:guericke', 'size:pull'):
        return group('銅の半球を引く模型', 'hemi')
    return 'UNKNOWN:' + key, [], '説明主役が未登録。周辺模型で代用せずNGとして報告する。'


def _excluded(ns):
    values = set(ns.get('M', {}).get('_gpt_obsolete', []))
    for hand in getattr(ns['d'], 'HANDS', {}).values():
        values.update(_objects(hand))
    return values


def _visible_meshes(objects, excluded):
    meshes = []
    for obj in dict.fromkeys(objects):
        if obj in excluded or obj.type != 'MESH' or obj.hide_render:
            continue
        if _EXCLUDE_NAME.search(obj.name) or _EXCLUDE_FLUID.search(obj.name):
            continue
        if obj.users_collection and all(collection.hide_render for collection in obj.users_collection):
            continue
        meshes.append(obj)
    return meshes


def _full_face(ns, cue, t):
    if 'full_face' in ns:
        return bool(ns['full_face'](t))
    face = cue.get('face')
    return bool(face and not face.get('small') and t >= cue['start'] + .3)


def _pose(ns, t):
    if 'pose_at' in ns:
        return list(ns['pose_at'](t))
    if 'scene' in ns:
        return list(ns['scene'](t)[0])
    return None


def _mesh_local(evaluated, obj, cache, np):
    # 位置・回転・scale は毎回 world 行列へ反映。変形する缶はshape値も鍵に。
    shape = getattr(obj.data, 'shape_keys', None)
    shape_values = tuple(round(k.value, 7) for k in shape.key_blocks) if shape else ()
    key = (obj.as_pointer(), shape_values)
    if key not in cache:
        mesh = evaluated.to_mesh()
        try:
            coords = np.empty(len(mesh.vertices) * 3, dtype=np.float64)
            mesh.vertices.foreach_get('co', coords)
            cache[key] = coords.reshape((-1, 3)).copy()
        finally:
            evaluated.to_mesh_clear()
    return cache[key]


def _project(ns, meshes, mesh_cache):
    import bpy
    import numpy as np
    from bpy_extras.object_utils import world_to_camera_view
    from mathutils import Vector
    scene = ns['d'].SC
    camera = ns['d'].CAM
    dg = bpy.context.evaluated_depsgraph_get()
    render = scene.render
    width, height = render.resolution_x, render.resolution_y
    camera_eval = camera.evaluated_get(dg)
    projection = camera_eval.calc_matrix_camera(dg, x=width, y=height,
                                                scale_x=render.pixel_aspect_x,
                                                scale_y=render.pixel_aspect_y)
    proj = np.asarray(projection, dtype=np.float64)
    view = np.asarray(camera_eval.matrix_world.normalized().inverted(), dtype=np.float64)
    points = []
    world_min = np.array([math.inf] * 3)
    world_max = np.array([-math.inf] * 3)
    total_vertices, front_vertices = 0, 0
    individual = []
    for obj in meshes:
        evaluated = obj.evaluated_get(dg)
        coords = _mesh_local(evaluated, obj, mesh_cache, np)
        if not len(coords):
            continue
        local4 = np.column_stack([coords, np.ones(len(coords))])
        world = local4 @ np.asarray(evaluated.matrix_world, dtype=np.float64).T
        camera_coords = world @ view.T
        front = camera_coords[:, 2] < -max(camera.data.clip_start, 1e-6)
        total_vertices += len(coords)
        front_vertices += int(front.sum())
        if not front.any():
            individual.append({'object': obj.name, 'front': False})
            continue
        world_front = world[front]
        clip = camera_coords[front] @ proj.T
        xy = clip[:, :2] / clip[:, 3:4] * .5 + .5
        # 全実頂点から極値候補を選び、規定の関数で確定する（BBox角で水増ししない）。
        indices = {int(xy[:, 0].argmin()), int(xy[:, 0].argmax()),
                   int(xy[:, 1].argmin()), int(xy[:, 1].argmax())}
        actual = [world_to_camera_view(scene, camera, Vector(world_front[i, :3])) for i in indices]
        minx, maxx = min(p.x for p in actual), max(p.x for p in actual)
        miny, maxy = min(p.y for p in actual), max(p.y for p in actual)
        points.extend([(minx, miny), (maxx, maxy)])
        world_min = np.minimum(world_min, world[:, :3].min(axis=0))
        world_max = np.maximum(world_max, world[:, :3].max(axis=0))
        individual.append({'object': obj.name, 'width_ratio': maxx - minx,
                           'height_ratio': maxy - miny,
                           'bounds01': [minx, miny, maxx, maxy],
                           'vertices': len(coords), 'front': True})
    if not points:
        return {'exists': False, 'width_ratio': 0, 'height_ratio': 0,
                'in_frame': False, 'objects': individual, 'vertices': total_vertices}
    minx, miny = min(p[0] for p in points), min(p[1] for p in points)
    maxx, maxy = max(p[0] for p in points), max(p[1] for p in points)
    w, h = maxx - minx, maxy - miny
    visible_w = max(0, min(1, maxx) - max(0, minx))
    visible_h = max(0, min(1, maxy) - max(0, miny))
    return {'exists': True, 'width_ratio': w, 'height_ratio': h,
            'bounds01': [minx, miny, maxx, maxy],
            'bounds_pixels_xy_top': [minx * width, (1 - maxy) * height, maxx * width, (1 - miny) * height],
            'visible_width_ratio': visible_w,
            'in_frame': minx >= 0 and maxx <= 1 and miny >= 0 and maxy <= 1 and front_vertices == total_vertices,
            'bbox_in_frame_area_fraction': visible_w * visible_h / max(w * h, 1e-12),
            'world_center': ((world_min + world_max) / 2).tolist(),
            'world_bounds': [world_min.tolist(), world_max.tolist()],
            'objects': individual, 'vertices': total_vertices,
            'vertices_in_front': front_vertices,
            'occlusion': '未検査。これは実形状投影の測定であり、遮蔽・字幕の重なり・読めるかは完成画で目視する。'}


def _fit(measurement, pose):
    if not measurement.get('exists') or not pose:
        return None
    width_distance = pose[3] * measurement['width_ratio'] / .60
    height_distance = pose[3] * measurement['height_ratio'] / .72
    return {'target': measurement['world_center'],
            'distance_for_width_60': width_distance,
            'distance_for_height_72': height_distance,
            'distance_for_unclipped_fit': max(width_distance, height_distance),
            'needs_angle_or_shot_split': height_distance > pose[3] * measurement['width_ratio'] / .50,
            'note': '現在の投影の一次近似。カメラは変更しない。狭い部品と長い棒を同時に説明するなら別カット/角度変更も検討。'}


def _plain(value):
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, dict):
        return {str(k): _plain(v) for k, v in value.items()}
    if hasattr(value, 'name') and hasattr(value, 'type'):
        return value.name
    try:
        return [_plain(v) for v in value]
    except TypeError:
        return str(value)


def _sample(ns, cue, t, kinds, mesh_cache, excluded):
    ns['apply'](t)
    pose = _pose(ns, t)
    primary, candidates, reason = semantic_primary(ns, cue, t)
    meshes = _visible_meshes(candidates, excluded)
    measurement = _project(ns, meshes, mesh_cache)
    face = _full_face(ns, cue, t)
    issues = []
    if not face:
        if primary.startswith('UNKNOWN:'):
            issues.append('PRIMARY_UNREGISTERED')
        if not measurement['exists']:
            issues.append('PRIMARY_MISSING')
        if measurement['width_ratio'] < .50:
            issues.append('WIDTH_BELOW_50')
        elif measurement['width_ratio'] > .70:
            issues.append('WIDTH_ABOVE_70')
        if measurement['width_ratio'] < .35:
            issues.append('WIDTH_BELOW_35')
        if not measurement['in_frame']:
            issues.append('CROPPED_OR_BEHIND_CAMERA')
    scene_state = ns['scene'](t) if 'scene' in ns else None
    action = scene_state[2] if scene_state and len(scene_state) > 2 else {}
    hands = action.get('hands', [])
    return {'time': t, 'kinds': sorted(kinds), 'cue': cue['key'], 'row': cue.get('row'),
            'subtitle': cue.get('subtitle'), 'primary': primary, 'selection_reason': reason,
            'excluded_context': '手・流体粒・矢印・文字・机は主役寸法に含めない。機械の一部を説明する時は機械全体も含めない。',
            'selected_meshes': [obj.name for obj in meshes], 'measurement': measurement,
            'full_face_overlay': face, 'size_applicable': not face,
            'camera_pose': pose,
            'camera_world_location': list(ns['d'].CAM.location),
            'camera_rotation_euler': list(ns['d'].CAM.rotation_euler),
            'camera_lens_actual': float(ns['d'].CAM.data.lens),
            'hands': _plain(hands),
            'sync_words': cue.get('wordEvents', []),
            'labels': {'view': cue.get('view'), 'face': cue.get('face'),
                       'overlay': '各 cue の正本に従う2D札。幾何測定に札の幅は含めない。'},
            'issues': issues, 'fit_recommendation': _fit(measurement, pose)}


def camera_statistics(ns, fps=30):
    duration = float(ns['DATA']['duration'])
    count = int(math.ceil(duration * fps))
    moving, top, low, previous = 0, 0, 0, None
    spans, span_start = [], None
    for i in range(count):
        pose = _pose(ns, i / fps)
        if pose is None:
            return {'measured': False, 'reason': 'pose_at / scene がない'}
        change = previous is not None and any(abs(a - b) > 1e-8 for a, b in zip(previous, pose))
        if change:
            moving += 1
            if span_start is None:
                span_start = i / fps
        elif span_start is not None:
            spans.append([span_start, i / fps])
            span_start = None
        top += pose[5] >= 65
        low += pose[5] < 25
        previous = pose
    if span_start is not None:
        spans.append([span_start, duration])
    return {'measured': True, 'fps': fps, 'frames': count, 'moving_frames': moving,
            'moving_ratio': moving / max(1, count), 'moving_spans': spans,
            'top_elevation_ge65_ratio': top / max(1, count),
            'elevation_below25_ratio': low / max(1, count),
            'moving_ratio_pass': moving / max(1, count) <= .20,
            'top_ratio_pass': top / max(1, count) <= .20}


def _unique_file(directory, basename, extension):
    path = os.path.join(directory, basename + extension)
    i = 2
    while os.path.exists(path):
        path = os.path.join(directory, basename + '_' + str(i) + extension)
        i += 1
    return path


def run(ns, coverage_fps=1.0, include_word_events=True, camera_fps=30):
    """全cueの中点/語時刻+全編1Hzを実測。戻り値は新規報告ファイルのパス。

    coverage_fps は正直に報告へ記録する。1Hzの測定を30fps全コマ検査と
    呼ばない。カメラ移動率だけは pose_at で全30fpsを正確に調べる。
    """
    if coverage_fps <= 0:
        raise ValueError('coverage_fps must be positive')
    cache = os.path.realpath(ns['A'].cache)
    if cache in ('/private/tmp/ys/ys-chain-d1a', '/private/tmp/ys/ys-chain-d1b') or '_gpt_' not in cache:
        raise ValueError('既存cacheへは出力しない。日付付きの新しい _gpt_ cache を指定する')
    out = os.path.join(cache, 'blender', 'gpt-shotqa')
    os.makedirs(out, exist_ok=True)
    cues = ns.get('CUES', ns['DATA']['cues'])
    duration = float(ns['DATA']['duration'])
    requested = {}
    def add(t, kind):
        t = round(max(0, min(duration - 1e-5, float(t))), 5)
        requested.setdefault(t, set()).add(kind)
    for cue in cues:
        add((cue['start'] + cue['end']) / 2, 'cue_midpoint')
        if include_word_events:
            for event in cue.get('wordEvents', []):
                add(event['time'], 'word:' + event['word'])
    coverage_times = []
    for i in range(int(math.ceil(duration * coverage_fps))):
        t = round(i / coverage_fps, 5)
        add(t, 'coverage')
        coverage_times.append(t)
    excluded = _excluded(ns)
    mesh_cache, records = {}, []
    cue_index = 0
    for t in sorted(requested):
        while cue_index + 1 < len(cues) and cues[cue_index + 1]['start'] <= t:
            cue_index += 1
        records.append(_sample(ns, cues[cue_index], t, requested[t], mesh_cache, excluded))
    coverage = [r for r in records if 'coverage' in r['kinds'] and r['size_applicable']]
    widths = [r['measurement']['width_ratio'] for r in coverage]
    small = sum(width < .35 for width in widths)
    # 最終の1秒未満も残り時間だけ重み付け。全画面の顔は3D寸法の分母から除外。
    weights = [min(1 / coverage_fps, duration - r['time']) for r in coverage]
    measured_seconds = sum(weights)
    small_seconds = sum(weight for width, weight in zip(widths, weights) if width < .35)
    summary = {'episode': ns['DATA'].get('episode'), 'duration': duration,
               'cues': len(cues), 'coverage_fps': coverage_fps,
               'coverage_description': '全編の等間隔実形状測定。中点と主要語は別途全件。画像をレンダした検査ではない。',
               'samples_total': len(records), 'coverage_applicable_samples': len(coverage),
               'width_median': statistics.median(widths) if widths else None,
               'below35_count': small, 'below35_sample_ratio': small / max(1, len(widths)),
               'applicable_seconds_estimate': measured_seconds,
               'below35_seconds_estimate': small_seconds,
               'below35_time_ratio_estimate': small_seconds / max(measured_seconds, 1e-9),
               'below35_ratio_pass': bool(widths) and small_seconds / max(measured_seconds, 1e-9) <= .20,
               'width50to70_sample_ratio': sum(.50 <= w <= .70 for w in widths) / max(1, len(widths)),
               'missing_primary_samples': sum(not r['measurement']['exists'] for r in coverage),
               'cropped_samples': sum(not r['measurement']['in_frame'] for r in coverage),
               'unregistered_cues': sorted({r['cue'] for r in records if r['primary'].startswith('UNKNOWN:')}),
               'camera': camera_statistics(ns, camera_fps),
               'limitations': ['遮蔽・部品の読める明暗・字幕/顔/札との重なりは完成画の目視が必要。',
                              'fit推奨は一次近似であり、カメラは自動変更しない。',
                              '機械全体ではなく説明中の部品を測るため、旧エッジ密度方式より厳しくNGが出る。']}
    shots = []
    for cue in cues:
        samples = [r for r in records if r['cue'] == cue['key'] and any(kind == 'cue_midpoint' or kind.startswith('word:') for kind in r['kinds'])]
        middle = next((r for r in samples if 'cue_midpoint' in r['kinds']), None)
        shots.append({'cue': cue['key'], 'row': cue.get('row'), 'start': cue['start'], 'end': cue['end'],
                      'subtitle': cue.get('subtitle'), 'midpoint': middle, 'word_samples': samples,
                      'labels': {'view': cue.get('view'), 'face': cue.get('face')},
                      'sync_words': cue.get('wordEvents', [])})
    report = {'summary': summary, 'shots': shots, 'all_measurements': records,
              'ng': [r for r in records if r['issues']]}
    stamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    json_path = _unique_file(out, '撮影台本_実形状投影_' + stamp, '.json')
    md_path = _unique_file(out, '撮影台本_実形状投影_' + stamp, '.md')
    with open(json_path, 'x', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
    lines = ['# D-1 前後編 撮影台本・主役の実形状投影検査', '',
             '既存の台本・字幕・音声は変更していません。この報告は完成画の目視を代替しません。', '',
             '## 集計', '', '```json', json.dumps(summary, ensure_ascii=False, indent=2), '```', '',
             '## 全cueの撮影台本（中点）', '',
             '| 行 | cue / 時間 | 今回の主役 | 幅 | 高さ | 画面内 | カメラ [target,d,az,el,lens] | 手 | 札・顔 | 判定 |',
             '|---|---|---|---|---|---|---|---|---|---|']
    for shot in shots:
        r = shot['midpoint']
        if not r:
            continue
        m = r['measurement']
        camera = ','.join('%.4g' % n for n in (r['camera_pose'] or []))
        labels = json.dumps(shot['labels'], ensure_ascii=False).replace('|', '／')
        hands = json.dumps(r['hands'], ensure_ascii=False).replace('|', '／')
        verdict = '顔の全画面（3D寸法対象外）' if r['full_face_overlay'] else ', '.join(r['issues']) or '幾何基準内・目視待ち'
        lines.append('| %s | %s / %.2f–%.2fs | %s | %.1f%% | %.1f%% | %s | %s | %s | %s | %s |' %
                     (shot['row'], shot['cue'], shot['start'], shot['end'], r['primary'], m['width_ratio'] * 100,
                      m['height_ratio'] * 100, 'はい' if m['in_frame'] else 'いいえ', camera, hands, labels, verdict))
    lines.extend(['', '## 数値NGとfit推奨（中点）', ''])
    for shot in shots:
        r = shot['midpoint']
        if r and r['issues']:
            lines.extend(['### %s / %.2fs' % (r['cue'], r['time']), '',
                          '- 主役：' + r['primary'], '- 理由：' + r['selection_reason'],
                          '- NG：' + ', '.join(r['issues']),
                          '- fit推奨：`' + json.dumps(r['fit_recommendation'], ensure_ascii=False) + '`',
                          '- 同期語：' + ' / '.join('%s %.2fs' % (e['word'], e['time']) for e in r['sync_words']), ''])
    lines.extend(['', '## 全件の実測データ', '', json_path,
                  '', '主要語時刻を含む全サンプル、選んだmesh名、実頂点数、画面境界、個々の部品の投影幅はJSONを参照。', ''])
    with open(md_path, 'x', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    # 変わったのは一時的なscene時刻だけ。提出対象のscene本体/カメラを保存しない。
    return {'json': json_path, 'markdown': md_path, 'summary': summary}


generate = run
