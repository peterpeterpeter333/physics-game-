"""D-1B S3 real-mesh primary bounds. No rendering, fitting, or file writes.

After apply(t), view-layer update and camera update, call::

    box = primary(globals(), t, st, X)

The scene may set X['_s3_primary'] = {'name': ..., 'objects': [actual mesh
handles], 'minWidth': .55, 'minHeight': .6}. This explicit semantic selection
has priority. Bounds returned are UNCLAMPED 1080x1920 top-origin logical
pixels. Save ns['S3_PRIMARY_METADATA'] alongside primary.json; it retains raw
bounds, front/crop flags and warnings. None means excluded or unmeasured,
never a fabricated screen-sized primary. selector(ns,t) is read-only too.

The old QA's actual evaluated-vertex projector/cache is reused unchanged.
Its projection is not an occlusion/readability certificate.
"""
import math
import warnings

import desk_d1ab_shotqa_gpt_20261026 as _qa


def _cue(ns, t):
    if callable(ns.get('cue_at')):
        return ns['cue_at'](t)
    cues = ns.get('CUES', ns.get('DATA', {}).get('cues', []))
    found = [c for c in cues if float(c['start']) <= t + 1e-9]
    return found[-1] if found else (cues[0] if cues else {})


def _word(cue, text, fallback):
    return next((float(w['time']) for w in cue.get('wordEvents', [])
                 if text in w['word']), fallback)


def _warn(ns, code, detail):
    record = {'code': code, 'detail': str(detail)}
    registry = ns.setdefault('S3_PRIMARY_WARNINGS', [])
    if record not in registry:
        registry.append(record)
        warnings.warn(code + ': ' + str(detail), RuntimeWarning, stacklevel=3)
    return record


def _full_face(ns, cue, t):
    # The parent's exact overlay timing handles cue5's second half correctly.
    if callable(ns.get('full_face')):
        return bool(ns['full_face'](t))
    face = cue.get('face')
    if not face or face.get('small'):
        return False
    start, end = float(cue['start']), float(cue['end'])
    if face.get('at'):
        word = {'ココカラ': 'ここから'}.get(face['at'], face['at'])
        start = _word(cue, word, math.inf)
    else:
        start += float(face.get('a', 0)) * (end - start)
    return start + .25 <= t <= end - .15


def _named(ns, tokens):
    # These are legacy semantic names, not typed S3 roles. In particular the
    # historical token '_piston' must not collect the distant new bottom-pump
    # '_s3_pistonvalve' or jack pistons. New pumps/mitt/Fuji are selected above
    # via their explicit physical-role lists, never by this broad name query.
    return [o for o in _qa._named(ns, tokens) if '_s3_' not in o.name.lower()]


def _parts(value):
    # A supplied role's primary list is authoritative; do not flatten its
    # dimensions, hidden alternatives, fluid arrows, long rods or metadata.
    if isinstance(value, dict) and 'primary' in value:
        return _qa._objects(value['primary'])
    return _qa._objects(value)


def _detail(ns, value, role):
    """Actual valve opening/seat/hinge/door, never the enclosing full disc."""
    if not isinstance(value, dict):
        _warn(ns, 'VALVE_DETAIL_ROLE_MISSING', role)
        return []
    if value.get('detail_primary'):
        return _qa._objects(value['detail_primary'])
    # An already-built GUI can have the same physical parts before the new
    # explicit role was added. This equivalent selection only removes the full
    # disc; it never substitutes the whole pump or enlarges the measured part.
    if value.get('fixed') and value.get('moving') and value.get('disc') is not None:
        _warn(ns, 'VALVE_DETAIL_EQUIVALENT_ROLE', role + ': fixed minus disc + moving')
        return _qa._objects([o for o in value['fixed'] if o != value['disc']]) + _qa._objects(value['moving'])
    _warn(ns, 'VALVE_DETAIL_ROLE_MISSING', role)
    return []


def _pump_working(ns, pump, include_surface=True):
    """Lid, real foot valve and water surface; not the tall barrel wall."""
    return [_parts(pump.get('piston')), pump.get('leather'),
            _detail(ns, pump.get('foot'), 'pump.foot'),
            pump.get('surface') if include_surface else None]


def _top_rim(ns):
    rims = _named(ns, ('_cylrim',))
    if not rims:
        _warn(ns, 'CYLINDER_TOP_RIM_MISSING', 'No cylinder-wall fallback')
        return []
    def z(obj):
        # matrix_world reflects current apply(); local z is an equivalent
        # fallback for simple non-parented rim objects in API-only tests.
        try:
            return float(obj.matrix_world.translation.z)
        except AttributeError:
            return float(obj.location.z)
    top = max(z(o) for o in rims)
    return [o for o in rims if abs(z(o) - top) < .002]


def _cylinder_mouth(ns):
    return [_top_rim(ns), _named(ns, ('_pistondisc', '_pistonleather', '_pistoneye'))]


def _valves(ns, color=None):
    red = ('_steamvalve', '_svdisc', '_svhandle', '_svknob', '_svspindle')
    blue = ('_coldvalve', '_cvdisc', '_cvhandle', '_cvknob', '_cvspindle')
    return _named(ns, red if color == 'red' else blue if color == 'blue' else red + blue)


def _drain_detail(ns):
    # Names include the real fixed pin/lugs and moving hinge leaf. The long
    # drain trunk/body is a different explanatory subject and is not included.
    return _named(ns, ('_drainflap', '_drainseat'))


def _last_valve_time(ns, c):
    if callable(ns.get('PHRASE')):
        return float(ns['PHRASE']('last:valve', 'ベンデシタ'))
    _warn(ns, 'LAST_VALVE_PHRASE_TIME_MISSING', 'Exact ベンデシタ timing required; no early 小さな弁 substitution')
    return math.inf


def _jack_macro_phase(cue, t):
    """Exact scripted arrival/hold phase for read-only shot-plan generation."""
    if cue.get('key') == 'tank:self':
        return (_word(cue, '小さなポンプ', math.inf) + .75 <= t
                < _word(cue, '水槽へ上げる', math.inf))
    if cue.get('key') == 'tank:same':
        return t >= _word(cue, 'しくみ', math.inf) + .75
    return False


def _spec(ns, name, objects, width, source, height=None, notes=()):
    return {'name': name, 'objects': _qa._objects(objects), 'minWidth': width,
            'minHeight': height, 'source': source, 'notes': list(notes)}


def _explicit(ns, value, cue, t):
    if callable(value):
        value = value(ns, cue, t)
    if not isinstance(value, dict) or not value.get('name'):
        return _spec(ns, 'UNMEASURED', [], None, 'invalid-explicit', notes=[
            _warn(ns, 'INVALID_EXPLICIT_PRIMARY', 'name/objects dictionary required')])
    result = dict(value)
    result['objects'] = _qa._objects(value.get('objects', []))
    result['minWidth'] = value.get('minWidth', value.get('min'))
    result['minHeight'] = value.get('minHeight', value.get('height'))
    result['source'] = 'scene-X-explicit'
    result['notes'] = list(value.get('notes', []))
    if not result['objects']:
        result['notes'].append(_warn(ns, 'EXPLICIT_PRIMARY_EMPTY', cue.get('key')))
    return result


def _select(ns, t, X=None):
    c = _cue(ns, t); key = c.get('key', 'UNKNOWN'); row = c.get('row')
    if _full_face(ns, c, t):
        return _spec(ns, '全画面の顔（物の幅から除外）', [], None,
                     'full-face-excluded', notes=['Fixed script, not a missing object.'])
    if isinstance(X, dict) and '_s3_primary' in X:
        return _explicit(ns, X['_s3_primary'], c, t)
    M = ns.get('M', {}); s3 = M.get('s3', {})
    pump, jack = s3.get('pump', {}), s3.get('jack', {})
    if row == 11:
        value = ns.get('S3_MITT')
        if value is None:
            _warn(ns, 'S3_MITT_MISSING', 'No beam/sleeve fallback for arm:mio')
        return _spec(ns, '腕の筒側端とミオの手', _parts(value), .5,
                     'S3_MITT', notes=['Grip-end region may be explicit; never add the whole beam or forearm.'])
    if row == 4:
        value = ns.get('S3_FUJI')
        if value is None:
            _warn(ns, 'S3_FUJI_MISSING', 'Register new mountain/columns/minis explicitly')
        return _spec(ns, '富士山・2柱・2小機械', _parts(value), .65, 'S3_FUJI')
    if row == 28:
        return _spec(ns, '缶・ストロー・ポンプの3図', [], .7, 'actual-SVG-required',
                     notes=[_warn(ns, 'OVERLAY_PRIMARY_UNMEASURED',
                                  'Compositor must merge actual SVG picture/arrow bounds; no proxy plane.')])
    if row == 9:
        return _spec(ns, '開いた筒の口・ピストン・革', _cylinder_mouth(ns), .55,
                     'cylinder-mouth-piston-leather',
                     notes=['The lower rim and full cylinder wall are outside this retained good close-up.'])
    if row == 13:
        if t < _word(c, '筒に蒸気を入れます', c.get('end', t)):
            return _spec(ns, '蒸気を入れる赤い弁と取っ手', _valves(ns, 'red'), .55,
                         'steam-valve-close')
        return _spec(ns, '蒸気と空気が押し合う筒とピストン', _named(ns, _qa.BODY),
                     .55, 'cylinder-only',
                     notes=['Legacy piston token cannot select S3 bottom-pump or jack pistons.'])
    if row in (17, 18):
        return _spec(ns, '空っぽになる筒とピストン', _named(ns, _qa.BODY), .55,
                     'cylinder-only',
                     notes=['Retained good cylinder shot; distant S3 pumps are excluded by identity namespace.'])
    if row == 16:
        flow = _word(c, '水槽', c.get('end', t))
        spray = _word(c, '噴き出します', c.get('end', t))
        if t < flow:
            return _spec(ns, '冷水の青い弁と取っ手', _valves(ns, 'blue'), .55,
                         'cold-valve-close')
        if t < spray:
            return _spec(ns, '水槽から細い管を通って筒へ入る流路',
                         [_named(ns, _qa.TANK_CONTAINER + _qa.COLD_VALVE), _cylinder_mouth(ns)],
                         .6, 'tank-cold-path-cylinder-entry',
                         notes=['Source, connecting pipe and actual cylinder entry; no tank legs or deep cylinder wall.'])
        return _spec(ns, '筒内の注水口・ピストン',
                     [_cylinder_mouth(ns), _named(ns, ('_jet',))], .55,
                     'cylinder-entry-piston')
    if row == 19:
        if key == 'run:back':
            return _spec(ns, '切り替える赤と青の弁の取っ手', _valves(ns), .55,
                         'red-blue-valves-close')
        if key == 'run:down':
            press = _word(c, '押し下げます', c.get('end', t))
            lift = _word(c, '引き上げられます', c.get('end', t))
            if press <= t < lift:
                return _spec(ns, '空気が押す開いた筒とピストン', _cylinder_mouth(ns), .55,
                             'air-push-cylinder-mouth')
        return _spec(ns, '腕・鎖・ピストン・重い棒の連動',
                     _named(ns, _qa.BEAM + _qa.MINE_ROD + _qa.BODY), .75,
                     'moving-arm-piston-mine-rod',
                     notes=['No ground, shaft wall or unrelated tank added to the power path.'])
    if row == 26:
        if t < _word(c, '底の弁が開き', c.get('end', t)):
            return _spec(ns, 'ふたの下に空く所と底の弁', _pump_working(ns, pump), .6,
                         'M.s3.pump.working-parts')
        return _spec(ns, '底の弁・蝶番・弁座', _detail(ns, pump.get('foot'), 'pump.foot'),
                     .6, 'M.s3.pump.foot.detail_primary',
                     notes=['Full base disc is not the named opening/door and is deliberately excluded.'])
    if row == 48 and _last_valve_time(ns, c) <= t < float(c.get('end', t)) - 1.7:
        return _spec(ns, '最後に確かめる底の一方弁',
                     _detail(ns, pump.get('foot'), 'pump.foot'), .6,
                     'M.s3.pump.foot.detail_primary')
    if row in (24, 25, 30):
        return _spec(ns, 'ポンプのふた・足弁・水面', _pump_working(ns, pump), .6,
                     'M.s3.pump.working-parts',
                     notes=['The tall transparent barrel wall/top is not the subject in this internal working close-up.'])
    if row == 22:
        if not pump.get('body_primary'):
            _warn(ns, 'PUMP_BODY_ROLES_MISSING', key)
        if key == 'pump:rod' and t >= _word(c, '先のふた', c.get('end', t)):
            return _spec(ns, '棒の先のふたと底の弁', _pump_working(ns, pump, include_surface=False), .6,
                         'M.s3.pump.lid-and-two-valves',
                         notes=['The pipe water surface is not named during this rod/lid/two-valve explanation.'])
        return _spec(ns, '底の縦長のポンプ本体（ふたと2弁を含む）',
                     pump.get('body_primary', []),
                     .6, 'M.s3.pump.tall-body', height=.6,
                     notes=['60% height is measured on the cylinder body itself, not the long pipe up to ground.',
                            'This height condition applies only to the tall/full-body shot; the later lid/valve close-up is separate.'])
    if row == 23:
        door = _named(ns, ('_doorframe', '_doorleg', '_doorflap'))
        if key == 'pump:opens':
            return _spec(ns, '下からだけ開く扉', door, .55, 'one-way-door-model')
        return _spec(ns, '底のポンプと一方へだけ開く扉',
                     [pump.get('body_primary', []), door], .55,
                     'typed-pump-and-one-way-door-model',
                     notes=['New pump uses its physical role, not legacy substring matches.'])
    if row == 29:
        if t >= _word(c, 'あふれ出ます', c.get('end', t)):
            return _spec(ns, '地上へあふれる管の口', _named(ns, ('_spout', '_spoutrim')),
                         .6, 'ground-pipe-exit',
                         notes=['After the upward camera pan begins, do not count the already-explained lower pump.'])
        return _spec(ns, '管の水柱から地上の口',
                     [pump.get('body_primary', []), pump.get('rising_main', []),
                      pump.get('rising_rims', []), _named(ns, ('_spout', '_spoutrim'))],
                     .4, 'M.s3.pump.body+rising-main', height=.6,
                     notes=['The shot plan specifies 60% of the full shaft height, not 60% horizontal width.',
                            'Before the upward exit pan, the complete vertical pump-to-ground flow path is the subject.'])
    if row in (31, 32):
        return _spec(ns, '排水弁の黄色い扉・弁座・蝶番', _drain_detail(ns),
                     .5 if row == 31 else .55, 'drain-door-seat-hinge',
                     notes=['Same physical subject as the retained drain:out opening macro; no long pipe.'])
    if key == 'drain:out' and _word(c, '弁を押し開けて', c.get('end', t)) <= t < _word(c, '下り坂の管', c.get('end', t)):
        return _spec(ns, '開く排水弁の扉・弁座・蝶番', _drain_detail(ns), .55,
                     'drain-door-seat-hinge')
    if row == 35:
        if not jack.get('body_primary'):
            _warn(ns, 'JACK_ROLES_MISSING', 'No rod/ring-only fallback for water-tank pump')
        # Production X records the actual camera phase. A shot-plan call may
        # omit X; only then derive the same phase from exact cue word times.
        # Do not relabel an in-progress approach as an already-arrived macro.
        macro = (bool(X['_s3_jack_macro'])
                 if isinstance(X, dict) and '_s3_jack_macro' in X
                 else _jack_macro_phase(c, t))
        if macro:
            return _spec(ns, '水槽ポンプの本体・2弁・水中の入口',
                         [jack.get('body_primary', []), jack.get('inlet', [])],
                         .55, 'M.s3.jack.body+inlet-macro',
                         notes=['The internal mechanism is the named subject in this close-up; delivery channels and destination tank are measured in the separate context shot.'])
        return _spec(ns, '水槽ポンプと水槽への流路',
                     [jack.get('body_primary', []), jack.get('inlet', []),
                      jack.get('channels', []), _named(ns, _qa.TANK_CONTAINER)],
                     .55, 'M.s3.jack.body+inlet+channels+tank-container',
                     notes=['No rodlink, beam joints, long driving rod, tank legs or fluid.'])
    if row == 44:
        return _spec(ns, '冷水が吹きこむ筒', _named(ns, _qa.BODY), .55, 'cylinder-only')
    if row in (45, 46):
        return _spec(ns, '温め直す筒と石炭の山',
                     [_named(ns, _qa.BODY), M.get('groups', {}).get('coal', [])], .6,
                     'main-cylinder-and-coal',
                     notes=['No S3 bottom-pump or jack pistons, ground, or background in this pair.'])
    if row in (1, 6, 10, 12, 14, 36, 42, 48):
        return _spec(ns, '機械全体', _qa._machine_groups(ns, *_qa.MECHANISM),
                     .75, 'machine-groups-no-stage-front',
                     notes=['Broad 75% only for whole-machine shots, not a local part close-up.'])
    name, objects, reason = _qa.semantic_primary(ns, c, t)
    # Old semantic_primary internally uses its unchanged broad _named(). Strip
    # only the separate S3 identity namespace; typed new-role branches above
    # retain their actual meshes. This is not a spatial crop or bbox fitting.
    objects = [o for o in objects if '_s3_' not in o.name.lower()]
    warning = _warn(ns, 'LEGACY_SEMANTIC_FALLBACK', key + ': ' + name)
    # Retained good objects can use their original exact mesh sets, but this is
    # visible in metadata; it is not an assertion that the new shot plan matches.
    minima = {2: .6, 5: .5, 7: .6, 8: .55, 9: .55, 13: .55, 15: .5,
              16: .6, 17: .55, 18: .55, 19: .75, 23: .55, 31: .5,
              32: .55, 33: .55, 34: .5, 37: .5, 38: .55, 39: .55,
              40: .6, 41: .6, 43: .7, 45: .6, 47: .5}
    return _spec(ns, name, objects, minima.get(row), 'legacy-semantic-warning',
                 notes=[warning, reason, 'Requires comparison with current semantic shot plan.'])


def selector(ns, t):
    """Return semantic name/actual handles/minimums; no applying or fitting.

    The optional scene(t) call only reads the pure state/X definition. The
    renderer should use primary(..., X) after apply(t), avoiding a second call.
    """
    X = None
    if callable(ns.get('scene')):
        value = ns['scene'](t)
        if isinstance(value, (tuple, list)) and len(value) > 2:
            X = value[2]
    return _select(ns, float(t), X)


def primary(ns, t, st=None, X=None):
    """Measure current evaluated vertices; return unclamped logical bbox/None.

    Does not call apply(), update/fix the camera, render, or save any file.
    st is accepted for the scene's API; visibility/transforms must already have
    been applied. Registry entries keep the measured object-name list once.
    """
    t = float(t); c = _cue(ns, t); spec = _select(ns, t, X)
    fps = float(ns.get('FPS', 30)); frame = round(t * fps)
    record = {'time': t, 'frame': frame, 'cue': c.get('key'), 'row': c.get('row'),
              'name': spec['name'], 'minWidth': spec.get('minWidth'),
              'minHeight': spec.get('minHeight'), 'selectionSource': spec['source'],
              'notes': spec.get('notes', []), 'occlusionChecked': False,
              'logicalResolution': [1080, 1920], 'cameraChangedByMeasurement': False}
    records = ns.setdefault('S3_PRIMARY_METADATA', {})
    if spec['source'] == 'full-face-excluded':
        record.update(sizeApplicable=False, measured=False, excludedFullFace=True)
        records[str(frame)] = record
        return None
    obsolete = set(ns.get('M', {}).get('_gpt_obsolete', []))
    obsolete.update(ns.get('M', {}).get('s3', {}).get('obsolete', []))
    meshes = [o for o in dict.fromkeys(spec['objects'])
              if o not in obsolete and getattr(o, 'type', None) == 'MESH'
              and not o.hide_render
              and not (o.users_collection and all(k.hide_render for k in o.users_collection))]
    if spec['source'] in ('legacy-semantic-warning', 'cylinder-only',
                          'machine-groups-no-stage-front', 'M.s3.pump.body+rising-main',
                          'moving-arm-piston-mine-rod', 'main-cylinder-and-coal'):
        # Preserve the old semantic projector's fluid/decoration exclusions.
        # Explicit role lists (mitt/Fuji/new hinges) are not name-guessed here.
        meshes = [o for o in meshes if not _qa._EXCLUDE_NAME.search(o.name)
                  and not _qa._EXCLUDE_FLUID.search(o.name)]
    if not meshes:
        record.update(sizeApplicable=True, measured=False, missing=True,
                      warning=_warn(ns, 'PRIMARY_NO_VISIBLE_MESH', c.get('key')))
        records[str(frame)] = record
        return None
    names = tuple(o.name for o in meshes)
    registry = ns.setdefault('S3_PRIMARY_SELECTIONS', [])
    if names not in registry:
        registry.append(names)
    record.update(sizeApplicable=True, selectionIndex=registry.index(names), selectedMeshCount=len(meshes))
    measurement = _qa._project(ns, meshes, ns.setdefault('_S3_PRIMARY_VERTEX_CACHE', {}))
    # No clipping to viewport or .35/.5 thresholds: guards must see real errors.
    exists = bool(measurement.get('exists'))
    raw = measurement.get('bounds01')
    if not exists or not raw or not all(math.isfinite(v) for v in raw):
        record.update(measured=False, missing=True, rawBounds01=raw,
                      vertices=measurement.get('vertices', 0),
                      warning=_warn(ns, 'PRIMARY_NO_FINITE_FRONT_PROJECTION', c.get('key')))
        records[str(frame)] = record
        return None
    x0, y0, x1, y1 = raw
    box = [x0 * 1080, (1 - y1) * 1920, x1 * 1080, (1 - y0) * 1920, spec['name']]
    total = measurement.get('vertices', 0); front = measurement.get('vertices_in_front', 0)
    record.update(measured=True, missing=False, rawBounds01=list(raw), rawBoundsLogical=box[:4],
                  width=measurement['width_ratio'], height=measurement['height_ratio'],
                  viewportIntersectionWidth=measurement.get('visible_width_ratio'),
                  allVerticesInFront=total > 0 and total == front,
                  vertices=total, verticesInFront=front,
                  inFrame=bool(measurement.get('in_frame')), cropped=not bool(measurement.get('in_frame')),
                  occlusionNote='Real mesh projection only. Inspect final 2D/face composite for occlusion and readability.')
    records[str(frame)] = record
    return box


def metadata(ns):
    """JSON-ready records (not vertex caches or Blender object handles)."""
    return {'logicalResolution': [1080, 1920], 'frames': ns.get('S3_PRIMARY_METADATA', {}),
            'selections': ns.get('S3_PRIMARY_SELECTIONS', []),
            'warnings': ns.get('S3_PRIMARY_WARNINGS', []),
            'occlusionOrReadabilityPassClaimed': False}
