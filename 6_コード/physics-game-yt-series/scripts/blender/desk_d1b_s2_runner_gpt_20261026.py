"""S2 stills only. Parent GUI: run(EPISODES['d1b'], sample_plan_path).

Uses the already-built, frozen B scene. Never calls main/finish, fits a camera,
changes source/old-cache/STOP files, or starts S3/S4. Import alone does nothing.
"""
import json, math, os, pathlib, re, traceback, time

CACHE = pathlib.Path('/private/tmp/ys/ys-chain-d1b_s2_gpt_20261026')
EXPECTED_KEY = '9a65e94c4d7c0931b78f'


def _read(p):
    with open(p) as f:
        return json.load(f)


def _write_new(p, value):
    with open(p, 'x') as f:
        json.dump(value, f, ensure_ascii=False, indent=1)


def _expression(ns, expression):
    # Only the read-only handle paths in the reviewed selector definitions.
    if expression == "next(o for o in G['fuji'] if o.name=='d1_fuji')":
        return next(o for o in ns['G']['fuji'] if o.name == 'd1_fuji')
    m = re.fullmatch(r"(M|P|G|FUJI_ARROWS|d\.HANDS)((?:\['[^']+'\])*)", expression)
    if not m:
        raise ValueError('Unsupported selector expression: ' + expression)
    value = ns['d'].HANDS if m[1] == 'd.HANDS' else ns[m[1]]
    for key in re.findall(r"\['([^']+)'\]", m[2]):
        value = value[key]
    return value


def _selection(ns, sample, definitions, qa):
    """Return exact candidates, matches-new-table flag, notes, measurement kind."""
    row, selector, M = sample['row'], sample['selector'], ns['M']
    objects, explicit, notes, missing = [], set(), [], []
    named = lambda tokens: [o for o in M['all'] if any(t.lower() in o.name.lower() for t in tokens)]
    def add(value, direct=False):
        found = qa._objects(value); objects.extend(found)
        if direct:
            explicit.update(found)
    if selector == 'THREE_PICTURES' or row == 28:
        return [], False, ['2D3絵と対応矢印の実SVG外枠は合成後に別測定。カード背景寸法を代用しない。'], 'overlay'
    if row == 11:
        add(ns['d'].HANDS['mio'], True)
        objects = [o for o in objects if any(k in o.name.lower() for k in ('_palm', '_fing', '_mitt', '_thumb')) and not any(k in o.name.lower() for k in ('_sleeve', '_slv', '_cuff'))]
        notes.append('ミオの手本体だけ。袖・腕・カフを除外。')
    elif row == 15:
        add(M['svhandle'], True); add(M['svdisc'], True)
        bodies = named(('_steamvalve_readable_body', '_steamvalvebody', '_steamvalverim'))
        add(bodies, True)
        if not bodies:
            missing.append('赤い弁本体のmeshが見つからない')
        notes.append('赤い取っ手・弁板・弁本体だけ。管を除外。')
    elif row == 26:
        add(M['foot'], True)
        seats = named(('_footvalveseat', '_gpt_footseat', '_footseat'))
        add(seats, True)
        if not seats:
            missing.append('底弁の独立した弁座meshなし。広い底板/ポンプ全体で代用せず、扉だけの部分測定。')
    elif row == 32:
        add(M['dflap'], True)
        add(named(('_drainseat', '_drainflap_gpt_fixed', '_drainflap_gpt_pinhead')), True)
        notes.append('排水の扉・弁座・実ヒンジだけ。管全長を除外。')
    elif row == 37:
        add(M['svhandle'], True); add(M['cvhandle'], True)
    elif row == 44:
        add(named(qa.BODY))
    elif row == 46:
        add(M['groups'].get('coal', []))
    elif row in (1, 48):
        add([o for name in ('mine',) + qa.MECHANISM for o in M['groups'].get(name, [])])
    elif row == 3:
        add(_expression(ns, "next(o for o in G['fuji'] if o.name=='d1_fuji')"), True)
    elif row == 4:
        for level in ('low', 'high'):
            add(ns['P']['fuji'][level]['layers'], True); add(ns['P']['fuji'][level]['edges'], True)
        add(ns['FUJI_ARROWS'], True)
        notes.append('柱・縁・指定矢印だけ。山体を除外し、矢印を旧QAの除外regexに通さない。')
    else:
        spec = definitions.get(selector)
        if not spec or spec.get('kind') != 'mesh_selectors':
            return [], False, ['未定義/非meshセレクタ。広い旧semantic主役への代用なし。'], 'unmeasured'
        for name in spec.get('groups', []):
            if name not in M['groups']:
                missing.append('M group missing: ' + name)
            add(M['groups'].get(name, []))
        for name in spec.get('groupsG', []):
            if name not in ns['G']:
                missing.append('G group missing: ' + name)
            add(ns['G'].get(name, []))
        for constant in spec.get('namedTokens', []):
            add(named(getattr(qa, constant)))
        for expression in spec.get('expressions', []):
            try:
                add(_expression(ns, expression), True)
            except (KeyError, StopIteration, ValueError) as ex:
                missing.append(expression + ': ' + str(ex))
        add(named(spec.get('nameContains', [])))
        if selector == 'PISTON_SEAL':
            top = float(M['L']['CT'])
            objects = [o for o in objects if '_cylrim' not in o.name.lower() or abs(o.matrix_world.translation.z - top) <= .012]
            notes.append('筒の縁は上口のみ。下縁や筒全長で水増ししない。')
        elif spec.get('filter'):
            missing.append('未実装の文章filter: ' + spec['filter'])
        banned = spec.get('excludeNameContains', [])
        objects = [o for o in objects if not any(k.lower() in o.name.lower() for k in banned)]
        notes.append('新撮影表の selectorDefinitions に対応: ' + selector)
    obsolete = set(M.get('_gpt_obsolete', []))
    meshes = []
    for o in dict.fromkeys(objects):
        if o in obsolete or o.type != 'MESH' or o.hide_render:
            continue
        if o.users_collection and all(c.hide_render for c in o.users_collection):
            continue
        if o not in explicit and (qa._EXCLUDE_NAME.search(o.name) or qa._EXCLUDE_FLUID.search(o.name)):
            continue
        meshes.append(o)
    notes.extend(missing)
    return meshes, not missing, notes, 'geometry'


def _snapshot(ns):
    """Capture the live scene changes made by apply(), not just render settings."""
    scene = ns['d'].SC
    objects = [(o, o.matrix_basis.copy(), o.hide_render, o.hide_viewport) for o in scene.objects]
    data = {o.data for o in scene.objects if o.data is not None}
    slots = [(d, list(d.materials)) for d in data if hasattr(d, 'materials')]
    shapes = [(k, k.value) for d in data for k in (d.shape_keys.key_blocks if getattr(d, 'shape_keys', None) else [])]
    bodies = [(d, d.body) for d in data if hasattr(d, 'body')]
    materials = {m for d, mm in slots for m in mm if m is not None}
    sockets = []
    for material in materials:
        if material.use_nodes:
            for node in material.node_tree.nodes:
                for socket in node.inputs:
                    if not hasattr(socket, 'default_value'):
                        continue
                    value = socket.default_value
                    if not isinstance(value, (bool, int, float, str, type(None))) and hasattr(value, '__len__'):
                        value = tuple(value)
                    sockets.append((socket, value))
    cam = ns['d'].CAM.data
    camera = (cam.lens, cam.dof.focus_distance, cam.dof.aperture_fstop, cam.dof.focus_object)
    def restore():
        for obj, matrix, hide_render, hide_viewport in objects:
            obj.matrix_basis = matrix; obj.hide_render = hide_render; obj.hide_viewport = hide_viewport
        for d, mm in slots:
            if list(d.materials) != mm:
                d.materials.clear()
                for m in mm:
                    d.materials.append(m)
        for key, value in shapes:
            key.value = value
        for d, body in bodies:
            d.body = body
        for socket, value in sockets:
            socket.default_value = value
        cam.lens, cam.dof.focus_distance, cam.dof.aperture_fstop, cam.dof.focus_object = camera
    return restore


def run(namespace, sample_plan_path):
    started = time.time()
    started_jst = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(started))
    import bpy
    import desk_d1ab_shotqa_gpt_20261026 as qa
    ns = namespace['apply'].__globals__
    assert ns['DATA']['episode'] == 'd1b' and ns['render_key']() == EXPECTED_KEY
    assert (ns['d'].W, ns['d'].H) == (1080, 1920), 'anchors_now already uses logical pixels; do not multiply by2'
    assert _read(CACHE/'blender/data.json') == ns['DATA']
    plan = _read(sample_plan_path)
    assert plan['episode'] == 'd1b' and pathlib.Path(plan['cache']) == CACHE
    assert plan['resolution'] == [540, 960] and plan['samples'] == 4
    nf = math.ceil(ns['DATA']['duration'] * 30); assert nf == 14813
    # 静止画の選び方だけを補う。声・場面の動作・元の計画ファイルは変更しない。
    prepared = [dict(s) for s in plan['frames']]
    for s in prepared:
        if s['sampleid'] == 'run-shut-2':
            s.update(timeOffset=.55, samplingNote='0.4秒の閉弁が終わった状態を撮る')
        elif s['sampleid'] == 'lever-flip-2':
            s.update(timeOffset=.4, samplingNote='反対側への0.28秒の切替が終わった状態を撮る')
    for original, sampleid, offset, why in [
        ('drain-out-1', 'drain-out-open', .35, '同じ寄りで排水弁の開いた状態も撮る'),
        ('lever-flip-1', 'lever-flip-open', .95, '一回目の切替が終わった状態も撮る'),
    ]:
        s = dict(next(s for s in prepared if s['sampleid'] == original))
        s.update(sampleid=sampleid, timeOffset=offset, samplingNote=why)
        prepared.append(s)
    actual = []
    for source in prepared:
        s = dict(source); spoken = 'word' in s.get('timeMethod', '').lower() or 'phrase' in s.get('timeMethod', '').lower()
        j = math.ceil((s['sourceWordTime'] + s.get('timeOffset', 0)) * 30 - 1e-8) if spoken else round(s['time'] * 30)
        assert 0 <= j < nf and ns['cue_at'](j/30)['key'] == s['cue']
        s.update(plannedTime=s['time'], plannedFrame=s['frame'], time=j/30, frame=j, image=str(CACHE/'blender/desk'/('%05d.jpg' % j)), rounding='ceil-not-before-word' if spoken else 'nearest-30fps')
        actual.append(s)
    actual.sort(key=lambda s: (s['frame'], s['sampleid']))
    assert len(set(s['sampleid'] for s in actual)) == len(actual)
    assert set(s['cue'] for s in actual) == set(ns['CUE'])
    raw = CACHE/'blender/desk'; board = CACHE/'storyboard'; raw.mkdir(parents=True, exist_ok=True); board.mkdir(parents=True, exist_ok=True)
    manifest_path = board/'s2-manifest_gpt_20261026.json'
    output_files = [raw/'anchors.json', CACHE/'blender/primary.json', CACHE/'shot-plan.json', manifest_path, board/'s2-partial_gpt_20261026.json']
    for p in output_files + [pathlib.Path(s['image']) for s in actual]:
        assert not p.exists(), 'Preserve existing S2 output: ' + str(p)
    scene, options = ns['d'].SC, ns['A']
    assert scene.render.engine.startswith('BLENDER_EEVEE')
    restore_visual = _snapshot(ns)
    render = scene.render; image = render.image_settings
    saved = (render.resolution_x, render.resolution_y, render.resolution_percentage, render.filepath, image.file_format, image.color_mode, image.quality, scene.eevee.taa_render_samples, options.out)
    old_cache = options.cache
    win = bpy.context.window or next(iter(bpy.context.window_manager.windows))
    old_scene, old_layer = win.scene, win.view_layer
    anchors = {name: [None] * nf for name in ns['ANC_NAMES']}; primary = {}; results = []; error = None; restored = False
    mesh_cache = {}
    try:
        render.resolution_x = 540; render.resolution_y = 960; render.resolution_percentage = 100
        image.file_format = 'JPEG'; image.color_mode = 'RGB'; image.quality = 93
        scene.eevee.taa_render_samples = 4; options.out = str(raw)
        win.scene = scene
        with bpy.context.temp_override(window=win, scene=scene, view_layer=scene.view_layers[0]):
            for s in actual:
                if (CACHE/'STOP_S2').exists():
                    raise RuntimeError('ユーザーの中断指示。S2の描画済み画像を保持して停止。')
                t, j = s['time'], s['frame']; _, state, _ = ns['apply'](t)
                before_cam = ns['d'].CAM.matrix_world.copy(); before_lens = ns['d'].CAM.data.lens
                points = ns['anchors_now'](t, state)
                for name in anchors:
                    anchors[name][j] = points[name]  # Already logical1080x1920; no x2.
                hidden = bool(ns['full_face'](t)); measurement = None; notes = []; matches = False; kind = 'hidden-face'
                if not hidden:
                    try:
                        meshes, matches, notes, kind = _selection(ns, s, plan['selectorDefinitions'], qa)
                        if meshes:
                            m = qa._project(ns, meshes, mesh_cache)
                            measurement = {k: m.get(k) for k in ('exists', 'bounds01', 'width_ratio', 'height_ratio', 'visible_width_ratio', 'in_frame', 'vertices', 'vertices_in_front')}
                            measurement['selectedMeshCount'] = len(meshes)
                            if m.get('exists'):
                                x0, y0, x1, y1 = m['bounds01']
                                bbox = [1080*x0, 1920*(1-y1), 1080*x1, 1920*(1-y0), s['primary']]
                                measurement['logicalBounds'] = bbox[:4]
                                if matches:
                                    primary[str(j)] = bbox
                        elif kind == 'geometry':
                            matches = False; notes.append('主役の可視meshなし。幅の代用・合格主張なし。')
                    except Exception as ex:
                        matches = False; measurement = None; kind = 'selection-failed'; notes.append(type(ex).__name__ + ': ' + str(ex))
                else:
                    notes.append('現在の台本では全画面の顔。3Dの主役bboxは書かず、隠れていると記録。')
                assert ns['d'].CAM.matrix_world == before_cam and ns['d'].CAM.data.lens == before_lens, 'Measurement must not fit/change the camera'
                render.filepath = s['image']; bpy.ops.render.render(write_still=True, scene=scene.name)
                visible = measurement.get('visible_width_ratio') if measurement else None
                width_pass = bool(visible is not None and visible >= s['minWidth'] and measurement.get('in_frame')) if matches and s.get('minWidth') is not None else None
                results.append(dict(s, hiddenByFullFace=hidden, measurementKind=kind, selectorMatchesNewTable=matches, measurement=measurement, minWidthPass=width_pass, notes=notes))
                print('S2', len(results), '/', len(actual), s['sampleid'], s['time'], 'width', visible, 'matches', matches, flush=True)
    except BaseException:
        error = traceback.format_exc()
    finally:
        try:
            restore_visual()
            (render.resolution_x, render.resolution_y, render.resolution_percentage, render.filepath, image.file_format, image.color_mode, image.quality, scene.eevee.taa_render_samples, options.out) = saved
            win.scene = old_scene; win.view_layer = old_layer
            bpy.context.view_layer.update()
            assert options.cache == old_cache and (ns['d'].W, ns['d'].H) == (1080, 1920)
            assert ns['render_key']() == EXPECTED_KEY
            restored = True
        except BaseException:
            error = (error or '') + '\nRESTORE FAILURE:\n' + traceback.format_exc()
    manifest = dict(episode='d1b', stage='S2', cache=str(CACHE), resolution=[540, 960], samples=4, fps=30, sourceKey=EXPECTED_KEY, sourcePlan=str(sample_plan_path), frames=results, all63CuesRendered=len(set(s['cue'] for s in results)) == 63, coordinateSpace=[1080, 1920], anchorSource='desk_lib.project fixed W/H; anchors_now unchanged, no multiplication', primaryScope='Only these S2 sample frames; full30fps primary measurement NOT performed', settingsAndLiveVisualStateRestored=restored, widthFailures=[s['sampleid'] for s in results if s['minWidthPass'] is False], unmeasured=[s['sampleid'] for s in results if s['measurement'] is None], selectorMismatch=[s['sampleid'] for s in results if not s['selectorMatchesNewTable'] and not s['hiddenByFullFace']], noAutomaticGate=True, noMovieStarted=True, error=error, startedJST=started_jst, elapsedSeconds=time.time()-started, stopAfter='S2 report and wait for Claude instructions. No S3/S4.')
    if error:
        _write_new(board/'s2-partial_gpt_20261026.json', manifest)
        raise RuntimeError(error)
    _write_new(raw/'anchors.json', dict(fps=30, frames=nf, previewOnly=True, sampleOnly=True, logicalResolution=[1080, 1920], anchors=anchors))
    _write_new(CACHE/'blender/primary.json', primary)
    shots = [dict(r, cue='cd1b-'+r['cue'].removeprefix('cd1b-')) for r in plan['shotPlan']]
    _write_new(CACHE/'shot-plan.json', shots)
    _write_new(manifest_path, manifest)
    print('S2_MANIFEST', str(manifest_path), 'STOP_FOR_CLAUDE', flush=True)
    return str(manifest_path)
