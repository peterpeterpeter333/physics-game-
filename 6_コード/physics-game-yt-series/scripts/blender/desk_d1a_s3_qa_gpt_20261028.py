"""D-1A S3-only primary measurement and spoken-word shot plan.

Importing this module does nothing.  Call measure(ns, t) only AFTER the scene's
apply(t), including when an old raw image is copied.  The unchanged historical
projector evaluates real mesh vertices; this helper never fits a camera, clips
a bound, expands a proxy, changes visibility, or certifies readability.

primary.json is the gate's {frame: [x0,y0,x1,y1,name] | null} in 1080x1920
top-origin logical pixels.  primary-metadata.json retains unclamped geometry,
height-only requirements and exclusions.  Rows excluded from the SHOT PLAN
are not automatically excluded from measurement: notably row31 is a small
face in the immutable script, so its real objects still need measurement.
"""
import copy
import json
import math
import os
import re

import desk_d1ab_shotqa_gpt_20261026 as _qa


PLAN_EXCLUDED_ROWS = frozenset((8, 13, 18, 25, 31, 37))
_MIN_WIDTH = {
    1: .70, 2: .60, 3: .60, 4: .50, 5: .50, 6: .70, 7: .65,
    8: None, 9: .50, 10: .50, 11: .50, 12: .50, 13: None,
    14: .60, 15: .60, 16: .55, 17: .55, 18: None, 19: .55,
    20: .55, 21: None, 22: .60, 23: .50, 24: .60, 25: None,
    26: .60, 27: .55, 28: .60, 29: .60, 30: .55, 31: .50,
    32: .65, 33: .50, 34: .50, 35: .60, 36: .80, 37: None,
    38: .60, 39: .70, 40: .70,
}
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
_S2_SPECS = os.path.join(_ROOT, 'outputs/ys-chain-d1a-backup/S2_20261028/s2-specs-pass2.json')

# The seven newly spoken cues have supplied, approximate Japanese event times.
# Resolve their WORDS, not the nearest unrelated syllable. These readings are
# literal substrings of the immutable script's supplied kana/phrase map.
_EXACT_EVENT_KANA = {
    'cyl:likecan': {
        '機械の筒も': 'キカイノツツモ', '缶と同じ': 'カントオナジ',
        '中の蒸気': 'ナカノジョオキ', '冷やす': 'ヒヤス', '空っぽ': 'カラッポ',
        '外の空気': 'ソトノクウキ', 'ピストンを押します': 'ピストンオオシマス'},
    'guericke:build': {
        '空気を抜く': 'クウキオヌク', 'ゲーリケ': 'ゲエリケ',
        '空気のポンプ': 'クウキノポンプ', '作りました': 'ツクリマシタ',
        'ポンプには': 'ポンプニワ', '弁という': 'ベントイウ',
        '一方にしか開かない': 'イッポオニシカヒラカナイ',
        '小さな扉': 'チイサナトビラ', '2つ付いています': 'フタツツイテイマス'},
    'guericke:pull': {
        '取っ手を引く': 'トッテオヒク', 'ポンプの中に': 'ポンプノナカニ',
        '空いた所ができ': 'アイタトコロガデキ', '球の中の空気': 'タマノナカノクウキ',
        'ポンプの中へしか開かない': 'ポンプノナカエシカヒラカナイ',
        '入口の弁': 'イリグチノベン', '押し開けて': 'オシアケテ',
        '入ってきます': 'ワイッテキマス'},
    'guericke:push': {
        '取っ手を押す': 'トッテオオス', '入口の弁は閉じ': 'イリグチノベンワトジ',
        '空気は': 'クウキワ', '外へしか開かない': 'ソトエシカヒラカナイ',
        '出口の弁': 'デグチノベン', '出ていきます': 'デテイキマス'},
    'next:mio': {
        '空気って': 'クウキッテ', '力持ち': 'チカラモチ',
        '炭鉱の機械': 'タンコオノキカイ', '中では': 'ナカデワ',
        '何が起きてる': 'ナニガオキテル'},
    'next:open': {
        '機械の中': 'キカイノナカ', '一つずつ開けて見る': 'ヒトツズツアケテミル',
        '熱と動力': 'ネツトドオリョク', '次の回': 'ツギノカイ'},
    'last:can': {
        '缶をつぶした': 'カンオツブシタ', 'ゲーリケの球': 'ゲエリケノタマ',
        '離さなかった': 'ワナサナカッタ', '私たちのまわり': 'ワタシタチノマワリ',
        '空気だった': 'クウキダッタ'},
}


def _cue(ns, t):
    if callable(ns.get('cue_at')):
        return ns['cue_at'](t)
    cues = ns.get('CUES', ns.get('DATA', {}).get('cues', []))
    preceding = [c for c in cues if float(c['start']) <= t + 1e-9]
    return preceding[-1] if preceding else (cues[0] if cues else {})


def _word(cue, text, default=math.inf):
    hits = [float(e['time']) for e in cue.get('wordEvents', []) if e['word'] == text]
    return hits[0] if len(hits) == 1 else default


def _warning(ns, code, detail):
    item = {'code': code, 'detail': str(detail)}
    registry = ns.setdefault('S3_PRIMARY_WARNINGS', [])
    if item not in registry:
        registry.append(item)
    return item


def _children(ns):
    """Use the scene's prebuilt adjacency, never repeated global bpy scans."""
    if 'CHILDREN' in ns:
        return ns['CHILDREN']
    cache = ns.get('_A3_QA_CHILDREN')
    if cache is not None:
        return cache
    scene = getattr(ns.get('d'), 'SC', None)
    objects = list(getattr(scene, 'objects', ()))
    cache = {obj: [] for obj in objects}
    for obj in objects:
        parent = getattr(obj, 'parent', None)
        if parent in cache:
            cache[parent].append(obj)
    ns['_A3_QA_CHILDREN'] = cache
    return cache


def _objects(ns, value):
    adjacency = _children(ns)
    result, seen = [], set()

    def visit(item):
        if item is None or isinstance(item, (str, bytes, int, float, bool)):
            return
        if hasattr(item, 'type') and hasattr(item, 'matrix_world'):
            if item in seen:
                return
            seen.add(item)
            result.append(item)
            # CHILDREN is made after the complete S3 model is built.  A test
            # or external model without it may expose children directly.
            children = adjacency.get(item)
            if children is None:
                children = getattr(item, 'children', ())
            for child in children:
                visit(child)
        elif isinstance(item, dict):
            for child in item.values():
                visit(child)
        else:
            try:
                for child in item:
                    visit(child)
            except TypeError:
                return
    visit(value)
    return result


def _group(ns, *names):
    groups = ns.get('G', {})
    return [obj for name in names for obj in groups.get(name, ())]


def _named(ns, tokens):
    key = tuple(tokens)
    cache = ns.setdefault('_A3_QA_NAMED', {})
    if key not in cache:
        cache[key] = [o for o in ns.get('M', {}).get('all', ())
                      if '_s3_' not in o.name.lower() and '_s4_' not in o.name.lower()
                      and any(token.lower() in o.name.lower() for token in tokens)]
    return cache[key]


def _legacy_semantic(ns, cue, t):
    """Exact front-episode subjects; no desks, hands or whole-scene fallback."""
    key = cue.get('key', '')
    P = ns.get('P', {})
    if key in ('mine:open', 'mine:water', 'last:can'):
        return '炭鉱の断面模型', _group(ns, 'mine')
    if key.startswith('gin:') or key in ('mine:mio', 'size:rest'):
        return '馬のくみ上げ機', _group(ns, 'horse')
    if key == 'mine:rule':
        return '水と人の勝負の札', _group(ns, 'score')
    if key == 'myth:mio':
        return '筒・ピストン・密閉する縁', _named(ns, _qa.BODY)
    if key.startswith('shrink:'):
        return '水を入れた大さじと風船', _group(ns, 'balloon')
    if key.startswith('can:') or key in ('air:pusher', 'air:emptied'):
        if key in ('can:flip', 'can:seal'):
            dishes = [o for o in _group(ns, 'can') if o.name.startswith('d1_waterdish')]
            return '缶の口と水の皿', [P.get('can', {}).get('can'), dishes]
        return '空気の力を受ける缶', P.get('can', {}).get('can')
    if key.startswith('straw:'):
        objects = [o for o in _group(ns, 'straw')
                   if o.name.startswith(('d1_cup', 'd1_straw'))
                   and not any(token in o.name.lower() for token in ('push', 'air', 'juice'))]
        return 'コップとストロー', objects
    if key == 'air:weight':
        return '積もった空気を表す層', _group(ns, 'air')
    if key == 'air:1kg':
        weights = P.get('weights', {})
        palm_word = (ns['W'](key, '手のひら') if callable(ns.get('W'))
                     else _word(cue, '手のひら'))
        if t < palm_word:
            return '1kgの重りと1平方センチの面', weights.get('one')
        return '手のひらと100kgの重り', [weights.get('palm'), weights.get('hundred')]
    if key == 'air:mio':
        return '手のひらと重り', _group(ns, 'weights')
    if key == 'air:inside' or key.startswith('why:'):
        return '押し返す空気を比べる2つの缶', P.get('twocans', {}).get('cans', [])
    if key == 'size:wide':
        return '細い筒と太い筒', _group(ns, 'twins')
    if key in ('size:53', 'size:area'):
        return '筒の上面と手のひら22枚', _group(ns, 'area')
    if key == 'size:2t':
        return '2トンの重り', P.get('heavy', {}).get('weight')
    if key in ('size:horse4', 'size:mio'):
        return '重りと4頭の馬', _group(ns, 'heavy')
    if key in ('size:guericke', 'size:pull'):
        return '銅の半球と綱を引く馬', _group(ns, 'hemi')
    if key == 'nc:install' or key == 'next:mio':
        groups = ns.get('M', {}).get('groups', {})
        return '新しい機械の閉じた外装全体', [groups.get(k, []) for k in _qa.MECHANISM]
    if key.startswith('ch:'):
        return '富士山と空気の柱', _group(ns, 'fuji')
    return 'UNKNOWN:' + key, []


def selector(ns, t):
    """Read-only semantic selection at the ACTUAL time (no camera settling lag)."""
    cue = _cue(ns, float(t))
    row, key = cue.get('row'), cue.get('key')
    full_face = ns.get('full_face')
    if callable(full_face) and full_face(float(t)):
        return {'name': '全画面の顔（実物寸法の対象外）', 'objects': [],
                'minWidth': None, 'minHeight': None, 'excludedFullFace': True,
                'source': 'actual-full-face-overlay'}
    value = ns.get('SHOTQA_PRIMARY', {}).get(key)
    if callable(value):
        value = value(ns, cue, float(t))
    if value is not None:
        if not isinstance(value, dict) or not value.get('name'):
            raise ValueError('SHOTQA_PRIMARY must return a name/objects dictionary: ' + str(key))
        result = dict(value)
        result['source'] = 'scene-SHOTQA_PRIMARY'
        result['objects'] = _objects(ns, value.get('objects', []))
    else:
        name, candidates = _legacy_semantic(ns, cue, float(t))
        result = {'name': name, 'objects': _objects(ns, candidates),
                  'source': 'front-semantic-table', 'reason': 'S2 table physical subject, without stage decoration'}
    minimum = _MIN_WIDTH.get(row)
    height = .70 if row == 21 else None
    if key == 'can:flip':
        minimum = .60  # latest Claude: the inverted can AND dish are 60%.
    # The only authorised smaller new shot is an actual close view of the
    # bucket(s), not the preceding drum/horse/whole hoist combination.
    bucket_only = (row == 3 and '桶' in result['name']
                   and not any(w in result['name'] for w in ('馬', '胴')))
    if bucket_only:
        minimum = .40
        result['maxWidth'] = .50
    supplied_min = result.get('minWidth')
    if supplied_min is not None:
        minimum = max(float(supplied_min), minimum) if minimum is not None else float(supplied_min)
    supplied_height = result.get('minHeight')
    if supplied_height is not None:
        height = max(float(supplied_height), height) if height is not None else float(supplied_height)
    result.update(minWidth=minimum, minHeight=height, excludedFullFace=False)
    return result


def _visible(ns, spec):
    cached_collections = ns.setdefault('_A3_QA_COLLECTIONS', {})
    obsolete = set(ns.get('M', {}).get('_gpt_obsolete', ()))
    meshes = []
    for obj in spec['objects']:
        if obj in obsolete or getattr(obj, 'type', None) != 'MESH' or getattr(obj, 'hide_render', False):
            continue
        if obj not in cached_collections:
            cached_collections[obj] = tuple(getattr(obj, 'users_collection', ()))
        collections = cached_collections[obj]
        if collections and all(getattr(c, 'hide_render', False) for c in collections):
            continue
        if spec['source'] == 'front-semantic-table' and (_qa._EXCLUDE_NAME.search(obj.name)
                                                       or _qa._EXCLUDE_FLUID.search(obj.name)):
            continue
        meshes.append(obj)
    return meshes


def measure(ns, t):
    """Measure current applied geometry, store PRIMARY + actual metadata."""
    t = float(t)
    fps = float(ns.get('FPS', 30))
    frame = int(round(t * fps))
    cue = _cue(ns, t)
    spec = selector(ns, t)
    primary = ns.setdefault('PRIMARY', {})
    records = ns.setdefault('S3_PRIMARY_METADATA', {})
    record = {'frame': frame, 'time': t, 'cue': cue.get('key'), 'row': cue.get('row'),
              'name': spec['name'], 'minWidth': spec.get('minWidth'),
              'minHeight': spec.get('minHeight'), 'maxWidth': spec.get('maxWidth'),
              'selectionSource': spec['source'], 'selectionReason': spec.get('reason'),
              'logicalResolution': [1080, 1920], 'cameraChangedByMeasurement': False,
              'occlusionOrReadabilityChecked': False,
              'planExcludedRow': cue.get('row') in PLAN_EXCLUDED_ROWS}
    if spec.get('excludedFullFace'):
        record.update(sizeApplicable=False, excludedFullFace=True, measured=False)
        records[str(frame)] = record
        primary[str(frame)] = None
        return None
    meshes = _visible(ns, spec)
    if spec['name'].startswith('UNKNOWN:'):
        _warning(ns, 'PRIMARY_UNREGISTERED', cue.get('key'))
    names = tuple(obj.name for obj in meshes)
    selections = ns.setdefault('S3_PRIMARY_SELECTIONS', [])
    lookup = ns.setdefault('_A3_QA_SELECTION_INDEX', {})
    if names not in lookup:
        lookup[names] = len(selections)
        selections.append(list(names))
    record.update(sizeApplicable=True, selectionIndex=lookup[names], selectedMeshCount=len(meshes))
    if not meshes:
        record.update(measured=False, missing=True)
        _warning(ns, 'PRIMARY_NO_VISIBLE_MESH', cue.get('key'))
        records[str(frame)] = record
        primary[str(frame)] = None
        return None
    measurement = _qa._project(ns, meshes, ns.setdefault('_A3_QA_VERTEX_CACHE', {}))
    raw = measurement.get('bounds01')
    if not measurement.get('exists') or not raw or not all(math.isfinite(float(v)) for v in raw):
        record.update(measured=False, missing=True, rawBounds01=raw,
                      vertices=measurement.get('vertices', 0))
        _warning(ns, 'PRIMARY_NO_FINITE_FRONT_PROJECTION', cue.get('key'))
        records[str(frame)] = record
        primary[str(frame)] = None
        return None
    x0, y0, x1, y1 = map(float, raw)
    box = [x0 * 1080, (1 - y1) * 1920, x1 * 1080, (1 - y0) * 1920, spec['name']]
    width = float(measurement['width_ratio'])
    height = float(measurement['height_ratio'])
    total, front = measurement.get('vertices', 0), measurement.get('vertices_in_front', 0)
    record.update(measured=True, missing=False, rawBounds01=list(raw), rawBoundsLogical=box[:4],
                  width=width, height=height,
                  geometricMinimumMet=(width >= spec['minWidth'] if spec.get('minWidth') is not None else None),
                  geometricHeightMinimumMet=(height >= spec['minHeight'] if spec.get('minHeight') is not None else None),
                  geometricMaximumMet=(width <= spec['maxWidth'] if spec.get('maxWidth') is not None else None),
                  allVerticesInFront=total > 0 and total == front, vertices=total, verticesInFront=front,
                  inFrame=bool(measurement.get('in_frame')), cropped=not bool(measurement.get('in_frame')),
                  note='Unclamped real geometry. Occlusion, transparency, labels and legibility require actual images.')
    if callable(ns.get('reuse_frame')):
        old_frame = ns['reuse_frame'](t)
        if old_frame is not None:
            record['rawReuse'] = {'sourceFrame': int(old_frame),
                                  'measuredGeometry': 'Current scene after apply(t), including its old-pose mapping',
                                  'imageGeometryIdentityCheckedByMeasurement': False}
    records[str(frame)] = record
    primary[str(frame)] = box
    return box


def clone_primary(ns, src, dst):
    """Copy a scene-declared duplicate's bounds; never invent a new bound.

    src/dst are INTEGER frame indices.  The parent guards source fingerprint
    and declares identical raw geometry. Camera equality is checked here;
    differing semantic names require a fresh measure(), not a renamed box.
    """
    if not isinstance(src, int) or not isinstance(dst, int):
        raise TypeError('clone_primary expects integer frame indices')
    primary, records = ns.setdefault('PRIMARY', {}), ns.setdefault('S3_PRIMARY_METADATA', {})
    if str(src) not in primary or str(src) not in records:
        raise ValueError('Source primary/metadata missing: %s' % src)
    fps = float(ns.get('FPS', 30))
    cue, spec = _cue(ns, dst / fps), selector(ns, dst / fps)
    record = copy.deepcopy(records[str(src)])
    record.update(frame=dst, time=dst / fps, cue=cue.get('key'), row=cue.get('row'),
                  clonedFromFrame=src, geometryEvaluatedAtFrame=record.get('geometryEvaluatedAtFrame', src),
                  cloneEvidence='Parent scene duplicate plan; no re-projection claimed for destination',
                  planExcludedRow=cue.get('row') in PLAN_EXCLUDED_ROWS)
    if spec.get('excludedFullFace'):
        record.update(name=spec['name'], sizeApplicable=False, measured=False,
                      excludedFullFace=True, rawBounds01=None, rawBoundsLogical=None)
        primary[str(dst)], records[str(dst)] = None, record
        return None
    source_box = primary[str(src)]
    if source_box is None or source_box[4] != spec['name']:
        raise ValueError('Duplicate semantic/face changed; apply then measure destination: %s->%s' % (src, dst))
    if callable(ns.get('plan')) and tuple(ns['plan'](dst)) != ('dup', src):
        raise ValueError('Scene does not declare this exact duplicate')
    if callable(ns.get('pose_at')):
        a, b = ns['pose_at'](src / fps), ns['pose_at'](dst / fps)
        if len(a) != len(b) or any(abs(float(x)-float(y)) > 1e-9 for x, y in zip(a, b)):
            raise ValueError('Duplicate camera differs; measure destination instead')
    record.update(name=spec['name'], minWidth=spec.get('minWidth'), minHeight=spec.get('minHeight'),
                  maxWidth=spec.get('maxWidth'), selectionSource=spec['source'])
    record['geometricMinimumMet'] = record['width'] >= spec['minWidth'] if spec.get('minWidth') is not None else None
    record['geometricHeightMinimumMet'] = record['height'] >= spec['minHeight'] if spec.get('minHeight') is not None else None
    primary[str(dst)] = list(source_box)
    records[str(dst)] = record
    return primary[str(dst)]


def _atomic_json(path, value):
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    temporary = path + '.tmp-' + str(os.getpid())
    try:
        with open(temporary, 'w', encoding='utf-8') as f:
            json.dump(value, f, ensure_ascii=False, separators=(',', ':'), allow_nan=False)
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def _output(ns, out):
    out = os.path.realpath(os.path.abspath(os.fspath(out)))
    cache = os.path.realpath(ns['A'].cache)
    if cache != '/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028':
        raise ValueError('Only the new isolated A S3 cache is writable')
    if out != cache and not out.startswith(cache + os.sep):
        raise ValueError('QA output must remain inside new A S3 cache')
    return out


def save(ns, out):
    """Save generated outputs only; no vertex/object cache is serialised."""
    out = _output(ns, out)
    metadata = {'logicalResolution': [1080, 1920], 'fps': ns.get('FPS', 30),
                'frames': ns.get('S3_PRIMARY_METADATA', {}),
                'selections': ns.get('S3_PRIMARY_SELECTIONS', []),
                'warnings': ns.get('S3_PRIMARY_WARNINGS', []),
                'occlusionOrReadabilityPassClaimed': False,
                'sourceFingerprintGuard': 'Parent scene owns source-key and resume approval guard',
                'planExcludedRows': sorted(PLAN_EXCLUDED_ROWS),
                'measurementExclusions': 'Only actual full_face(t); row31 face.small is measured normally',
                'heightGateLimitation': 'Shared gate7d checks widths only; row21 height70% remains separate metadata'}
    _atomic_json(os.path.join(out, 'primary.json'), ns.get('PRIMARY', {}))
    _atomic_json(os.path.join(out, 'primary-metadata.json'), metadata)
    return {'primary': os.path.join(out, 'primary.json'),
            'metadata': os.path.join(out, 'primary-metadata.json'), 'frames': len(metadata['frames'])}


def load(ns, out):
    """Restore only a matching pair; caller must first enforce sourceKey."""
    out = _output(ns, out)
    p, m = os.path.join(out, 'primary.json'), os.path.join(out, 'primary-metadata.json')
    if not os.path.exists(p) and not os.path.exists(m):
        ns.setdefault('PRIMARY', {}); ns.setdefault('S3_PRIMARY_METADATA', {})
        return {'loaded': False, 'frames': 0}
    if not os.path.isfile(p) or not os.path.isfile(m):
        raise ValueError('Resume needs both primary.json and primary-metadata.json')
    with open(p, encoding='utf-8') as f:
        primary = json.load(f)
    with open(m, encoding='utf-8') as f:
        metadata = json.load(f)
    if metadata.get('logicalResolution') != [1080, 1920] or float(metadata.get('fps', 0)) != float(ns.get('FPS', 30)):
        raise ValueError('Resume logical resolution/fps mismatch')
    records = metadata.get('frames', {})
    if set(primary) != set(records):
        raise ValueError('Resume primary/metadata coverage mismatch; do not skip unmeasured frames')
    for key, box in primary.items():
        if not key.isdigit() or int(records[key].get('frame', -1)) != int(key):
            raise ValueError('Invalid saved frame: ' + str(key))
        if box is not None and (not isinstance(box, list) or len(box) != 5
                                or not all(isinstance(v, (float, int)) and math.isfinite(v) for v in box[:4])
                                or not isinstance(box[4], str) or box[0] > box[2] or box[1] > box[3]
                                or box[4] != records[key].get('name')):
            raise ValueError('Invalid saved primary: ' + key)
    ns['PRIMARY'], ns['S3_PRIMARY_METADATA'] = primary, records
    ns['S3_PRIMARY_SELECTIONS'] = metadata.get('selections', [])
    ns['_A3_QA_SELECTION_INDEX'] = {tuple(v): i for i, v in enumerate(ns['S3_PRIMARY_SELECTIONS'])}
    ns['S3_PRIMARY_WARNINGS'] = metadata.get('warnings', [])
    return {'loaded': True, 'frames': len(primary)}


def _spoken_anchor(ns, cue, event):
    """Resolve a supplied Japanese event to a REAL phrase-time kana index.

    The gate's C.wt accepts kana, not Japanese. No subtitle reading conversion,
    guessed timing or camera-arrival offset is used here.
    """
    phrase = ns['PT'][cue['subtitle']]
    text, times = phrase['s'], phrase['t']
    relative = float(event['time']) - float(cue['start'])
    if not text or len(text) != len(times):
        raise ValueError('Invalid immutable phrase map: ' + cue['key'])
    explicit = _EXACT_EVENT_KANA.get(cue['key'], {}).get(event['word'])
    if explicit:
        needle = explicit
        matches = list(re.finditer(re.sub('[ウオ]', '[ウオ]', needle), text))
        if len(matches) != 1:
            raise ValueError('Explicit script kana must match exactly once: %s/%s/%s' % (cue['key'], event['word'], needle))
        index = matches[0].start()
        method = 'explicit-script-kana-to-immutable-phrase-times'
    else:
        index = min(range(len(times)), key=lambda j: abs(float(times[j]) - relative))
        error = abs(float(times[index]) - relative)
        if error > .025:
            raise ValueError('Supplied legacy word not at a real phrase onset: %s/%s %.6fs' % (cue['key'], event['word'], error))
        needle = text[index:index + 8]
        method = 'legacy-supplied-event-to-matching-phrase-boundary-within25ms'
    pattern = re.compile(re.sub('[ウオ]', '[ウオ]', needle))
    positions, start = [], 0
    while start < len(text):
        match = pattern.search(text, start)
        if not match:
            break
        positions.append(match.start()); start = match.start() + 1
    if index not in positions:
        raise ValueError('Kana occurrence cannot map event: ' + cue['key'])
    return {'word': needle, 'occ': positions.index(index), 'phraseIndex': index,
            'suppliedEventWord': event['word'], 'suppliedEventTime': float(event['time']),
            'actualGateTime': float(cue['start']) + float(times[index]),
            'eventRoundingDifference': float(cue['start']) + float(times[index]) - float(event['time']),
            'resolutionMethod': method}


def build_word_events(ns, out):
    """Derived all-event lookup; original supplied data/timing remains untouched.

    Uncertain legacy boundaries are not silently moved. Their sourceTime is
    retained with fallback=true and a reason. This is an animation lookup,
    not a claim of listening-based voice verification.
    """
    cues = ns.get('CUES', ns.get('DATA', {}).get('cues', []))
    result, fallbacks = {}, []
    for cue in cues:
        items = {}
        for event in cue.get('wordEvents', []):
            try:
                anchor = _spoken_anchor(ns, cue, event)
                items[event['word']] = {'time': anchor['actualGateTime'],
                                        'kana': anchor['word'], 'occ': anchor['occ'],
                                        'sourceTime': float(event['time']),
                                        'delta': anchor['eventRoundingDifference'],
                                        'phraseIndex': anchor['phraseIndex'],
                                        'method': anchor['resolutionMethod'], 'fallback': False}
            except ValueError as error:
                items[event['word']] = {'time': float(event['time']), 'kana': None, 'occ': None,
                                        'sourceTime': float(event['time']), 'delta': 0,
                                        'method': 'uncertain-source-time-fallback', 'fallback': True,
                                        'reason': str(error)}
                fallbacks.append({'cue': cue['key'], 'word': event['word'], 'reason': str(error)})
        result[cue['key']] = items
    path = os.path.join(_output(ns, out), 'word-events-actual_s3_20261028.json')
    _atomic_json(path, result)
    return {'path': path, 'cues': len(result), 'events': sum(len(v) for v in result.values()),
            'fallbacks': fallbacks, 'originalInputsChanged': False}


def _build_shot_plan_data(ns):
    cues = ns.get('CUES', ns.get('DATA', {}).get('cues', []))
    by = {c['key']: c for c in cues}
    with open(_S2_SPECS, encoding='utf-8') as f:
        specs = json.load(f)['specs']
    requests = []
    for spec in specs:
        if (spec.get('word') and abs(float(spec.get('offsetFromWord', 0))) < 1e-9
                and spec.get('row') not in PLAN_EXCLUDED_ROWS):
            requests.append((spec['cue'], spec['word'], 'S2 cue-table noun/onset; not its offset stills'))
    # Claude's new bucket and complete pump context must not be missed just
    # because the former S2 examples sampled different words.
    for key, fragments in (
            ('gin:drum', ('一方の桶', '空の桶')),
            ('guericke:build', ('弁という', '2つ付いています')),
            ('guericke:pull', ('取っ手を引く',)),
            ('guericke:push', ('取っ手を押す',))):
        cue = by.get(key)
        if cue:
            for fragment in fragments:
                matches = [e for e in cue.get('wordEvents', []) if fragment in e['word']]
                if matches:
                    requests.append((key, matches[0]['word'], 'Latest Claude named-subject correction'))
    rows, height_rows, seen = [], [], set()
    for key, word, reason in requests:
        if (key, word) in seen:
            continue
        seen.add((key, word))
        cue = by[key]
        hits = [e for e in cue.get('wordEvents', []) if e['word'] == word]
        if len(hits) != 1:
            raise ValueError('S2 event does not uniquely match immutable cue: %s/%s' % (key, word))
        anchor = _spoken_anchor(ns, cue, hits[0])
        target = anchor['actualGateTime']
        spec = selector(ns, target)
        record = dict(cue='cd1a-' + key, row=cue['row'], primary=spec['name'],
                      minWidth=spec.get('minWidth'), minHeight=spec.get('minHeight'),
                      **anchor, reason=reason)
        # The unchanged gate has NO height feature. Do not fake row21 as a
        # tiny width requirement to make it pass; retain this separate test.
        if spec.get('minHeight') is not None and spec.get('minWidth') is None:
            height_rows.append(record)
            continue
        if spec.get('excludedFullFace'):
            raise ValueError('Non-face shot table event is covered by actual full-face overlay: ' + key)
        if not spec.get('minWidth') or spec['name'].startswith('UNKNOWN:'):
            raise ValueError('No meaningful minimum/name for shot table cue: ' + key)
        if spec.get('maxWidth') is not None:
            record['maxWidth'] = spec['maxWidth']
        rows.append(record)
    return rows, {'planRows': len(rows), 'trueSpokenTimes': True, 'cameraArrivalOffsetsAdded': False,
                  'excludedRows': sorted(PLAN_EXCLUDED_ROWS), 'heightOnlyRows': height_rows,
                  'basis': _S2_SPECS, 'geometryOrVisualPassClaimed': False,
                  'limitations': ['Gate7d can select the best frame within1.5 seconds after the true spoken time.',
                                 'It does not test occlusion/readability or row21 height70%.',
                                 'Bucket maximum50% and each individual bucket require separate image/metadata review.',
                                 'Row31 is omitted only from shot-plan per Claude; face.small does not exclude real measurement.']}


def build_shot_plan(ns, out):
    """Write the NEW cache's word-linked plan, never edit shared gate/script."""
    rows, metadata = _build_shot_plan_data(ns)
    out = _output(ns, out)
    plan_path, meta_path = os.path.join(out, 'shot-plan.json'), os.path.join(out, 'shot-plan-metadata.json')
    _atomic_json(plan_path, rows)
    _atomic_json(meta_path, metadata)
    return {'plan': plan_path, 'metadata': meta_path, 'rows': len(rows),
            'heightOnlyRows': len(metadata['heightOnlyRows'])}
