"""Inert B-1 exact-source, evaluated-primary measurement; ROOT AUDIT ONLY.

No render/encode mode.  All10700 outputs map to exact held/object-operation/
camera recipes.  Every recipe is evaluated with real mesh/modifier/shape-key/
font/curve vertices.  The old hero_points(), bounding-box corners and old
evaluatedGeometry flags are NOT measurement inputs.  Face classifications come
from an independent full-frame native-faceLayer plan.  Geometry can establish
render enablement and projection, NOT pixel visibility or lack of occlusion.
"""
import ast
import hashlib
import json
import math
import os
from pathlib import Path
import runpy
import time

import numpy as np

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025')
OUT = Path('/private/tmp/ys/ys-chain-b1v1-exact-visible-primary-audit-20261025')
FROZEN = W/'scripts/blender/desk_axes_b1_remaining_ng_six_probe_runner_20261025.py'
RECOVERY = W/'scripts/blender/desk_axes_b1_b7_cache_recovery_20261025.py'
RECOVERED = Path('/private/tmp/ys/ys-chain-b1v1-job153-exact-normal-restore-20261025/report.json')
FACES = W/'outputs/axes-20261023/b1-exact-face-state-plan-20261025.json'
B4 = W/'scripts/blender/desk_axes_b1_camera_size_b4_v4_20261024.py'
B5 = W/'scripts/blender/desk_axes_b1_repel_b5_v4_20261024.py'
B6R = Path('/private/tmp/ys/ys-chain-b1v1-integrated-b6-v6-owned-resume-v2-20261025/render/report.json')
B2R = Path('/private/tmp/ys/ys-chain-b1v1-camera-final-20261024/camera-patch.json')
SMALLR = Path('/private/tmp/ys/ys-chain-b1v1-small-gesture-20261024/render/report.json')
CHALLENGER = Path('/private/tmp/ys/ys-chain-b1v1-challenge-b3-v2-20261024/render/report.json')
TIMINGR = Path('/private/tmp/ys/ys-chain-b1v1-timing-final-20261024/timing-patch.json')
B7R = Path('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-frozen-control-cases-20261025/probe/report.json')
PINS = {
    FROZEN: '1cd857d05f49ee21fb8092bbdfd2d61cd6a88175c95fbbe4cdfb95aeec008df3',
    RECOVERY: '37e6db84e45e544a68175eb8979734a2c63a7ef6928de5bc0ee5e1498e257efc',
    RECOVERED: 'dd73ec51978b99e9ce63c4c2935445da7ada12814bc173b3479ad9552dcc6b85',
    FACES: '4c9972ce18f80d696692b85d75c4db520d7eedd52ac3baec360d68030459a8e5',
    B4: 'd0a04b5b7a933e609a6a26b869d16decd0ff0bf6e493a4384e7bc918d8a28dc2',
    B5: '02c64b5916c754b08b67c5a46330d11a0ca58323ca2f67844a70d4175a9b65d3',
    B6R: '35d9671336facc781ee51d2f93d0a611be02f565dae8829e9c6d8bb6455ad956',
    B2R: '867a061169759c92840a0efdc4e33571f0843b4f51673bd3879afc6ae8bdabde',
    SMALLR: 'fc4d987ffd309ea452e146eac7a4e2ca7469c75460d3d1998858310e5a411bdc',
    CHALLENGER: 'ce63f3ad1f8cdea0940f4472f8e8775ed10bd0556b3ad95eaf723ec9bffa6979',
    TIMINGR: 'b449e734cdeb8c6f5fd2980c0dd9b78cf7f8e86c3e79471377f3519383171b04',
    B7R: '97bba60da3dd2a7c0d6bb56205e00553b49cc3119c79d11a6c831e090f6745a4',
}


def sha(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def read(path):
    return json.loads(Path(path).read_text())


def verify(pins):
    for path, expected in pins.items():
        assert sha(path) == expected, ('Protected input differs', str(path))


def write_new(path, value):
    assert path.is_relative_to(OUT) and not os.path.lexists(path)
    assert not any(p.is_symlink() for p in path.parents if p.exists())
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('x') as stream:
        json.dump(value, stream, ensure_ascii=False, indent=1, allow_nan=False)
        stream.write('\n')


def select_namespace(session):
    assert sha(FROZEN) == PINS[FROZEN]
    return runpy.run_path(str(FROZEN))['select_namespace'](session)


def source_family(record):
    source = Path(record['source']).resolve()
    roots = (
        ('b6', 'ys-chain-b1v1-integrated-b6-v6-owned-resume-v2-20261025'),
        ('b3-score', 'ys-chain-b1v1-score-entries-d1-v2-20261024'),
        ('b3-small', 'ys-chain-b1v1-small-gesture-20261024'),
        ('b3-challenge', 'ys-chain-b1v1-challenge-b3-v2-20261024'),
        ('timing', 'ys-chain-b1v1-timing-final-20261024'),
        ('b2-camera', 'ys-chain-b1v1-camera-final-20261024'),
    )
    if record['kind'] == 'actual-B7-sixth-needle-and-kai-hand-carry-only':
        return 'b7', source, record['frame']
    for family, root in roots:
        if root in source.parts:
            return family, source, int(source.stem)
    assert source.parent == Path('/private/tmp/ys/ys-chain-b1v1/blender/desk'), source
    return 'base', source, None


def recipe_key(record, pose):
    family, _, operation = source_family(record)
    # Score camera corrections have no new time-dependent model action.
    if family == 'b3-score':
        operation = None
    return json.dumps([family, record['originalObjectSourceFrame'], operation, pose], separators=(',', ':'))


def run(ns, authorized=False, *, expected_helper_sha256, namespace_name=None):
    assert authorized is True and sha(__file__) == expected_helper_sha256
    assert not os.path.lexists(OUT) and not OUT.is_symlink()
    verify(PINS)
    assert read(RECOVERED)['success'] is True
    frozen = runpy.run_path(str(FROZEN))
    g, tools = frozen['runtime_api'](ns)
    d, bpy = g['d'], g['bpy']
    scene = d.SC
    prepared, provenance = read(C/'prepared.json'), read(C/'composite-provenance.json')
    records, poses = provenance['records'], read(C/'blender/delivered-camera-poses.json')['poses']
    historical = read(C/'final-held-dimensions.json')['samples']
    assert len(records) == len(poses) == 10700 and len(historical) == 759
    b6, b2, small, challenge, timing = read(B6R), read(B2R), read(SMALLR), read(CHALLENGER), read(TIMINGR)
    b7 = {r['frame']: r for r in read(B7R)['physical']}
    face_plan = read(FACES)
    assert face_plan['frames'] == 10700
    protected = {str(p): h for p, h in PINS.items()}
    protected.update({str(p): h for p, h in frozen['PINS'].items()})
    protected.update(prepared['protectedInputSha256'])
    protected.update({str(C/p): h for p, h in prepared['outputHashes'].items()})
    protected[str(Path(__file__).resolve())] = expected_helper_sha256
    source_hashes = {}
    for j, record in enumerate(records):
        assert record['frame'] == j and isinstance(record['originalObjectSourceFrame'], int)
        actual = Path(record['source']).resolve()
        assert (C/'blender/desk'/f'{j:05d}.jpg').resolve() == actual
        if str(actual) not in source_hashes:
            source_hashes[str(actual)] = sha(actual)
        assert source_hashes[str(actual)] == record['sha256']
    verify(protected)
    recovery_module = runpy.run_path(str(RECOVERY))
    protected.update({str(p): h for p, h in recovery_module['EXTRA_PINS'].items()})
    verify(protected)
    api, recovery = recovery_module['prepare'](ns)
    # The already verified five-boundary recovery derivative retains every
    # original transaction guard, adds normal evaluation and exact RNA identity.
    private = {'__name__': '_b1_exact_primary_transaction', '__file__': str(recovery.tools['ORIGINAL']), '_recovery': recovery}
    exec(compile(api['adapt_text'](), str(recovery.tools['ORIGINAL'])+' [existing recovery boundaries]', 'exec'), private)
    oldscene, oldlayer = bpy.context.window.scene, bpy.context.window.view_layer
    entry_context = recovery.tools['context'](bpy)
    bindings, snapshot_bindings = tools['bindings'](g), tools['bindings'](ns)
    raw_inventory = private['inventory'](C/'blender/desk')
    bpy.context.window.scene = scene
    bpy.context.view_layer.update()
    try:
        tx = private['SceneTransaction'](g, oldscene, oldlayer)
    except BaseException:
        bpy.context.window.scene = oldscene
        bpy.context.window.view_layer = oldlayer
        bpy.context.view_layer.update()
        raise
    started = time.time()
    states, frame_map, state_index = [], [], {}
    report = dict(episode='B-1', kind='Full exact-source evaluated-primary measurement, no render',
                  helperSha256=expected_helper_sha256, namespace=namespace_name,
                  original10700OutputsPreserved=True, originalHalfSecondSamples=714,
                  historical759RetainedVerbatim=historical, states=states, frameMap=frame_map,
                  faceStatePlan=str(FACES), faceStatePlanSha256=PINS[FACES],
                  originalInspectorThresholdsAndNGUnchanged=True,
                  meshBoundingBoxCornersUsed=False, heroPointsUsed=False,
                  pixelVisibilityOrOcclusionProofClaimed=False,
                  automaticSupplementalPassClaimed=False, finalAcceptance=False,
                  renders=0, encodes=0, existingMediaModified=False)
    try:
        assert scene.camera == d.CAM and d.CAM.data == d.CAM_D
        assert scene.render.pixel_aspect_x == scene.render.pixel_aspect_y == 1
        collection_paths = {}

        def collect_paths(layer, path=(), permitted=True):
            collection = layer.collection
            permitted = permitted and not layer.exclude and not collection.hide_render
            node = dict(name=collection.name, hideRender=bool(collection.hide_render),
                        layerExcluded=bool(layer.exclude))
            path = path+(node,)
            for ob in collection.objects:
                collection_paths.setdefault(ob, []).append(dict(path=list(path), renderPermitted=permitted))
            for child in layer.children:
                collect_paths(child, path, permitted)

        collect_paths(bpy.context.view_layer.layer_collection)
        projection_max_difference = 0.

        def tree(root):
            return [root] + [v for child in root.children for v in tree(child)]

        def world_points(objects):
            deps, clouds, included = bpy.context.evaluated_depsgraph_get(), [], []
            for ob in dict.fromkeys(objects):
                paths = collection_paths.get(ob, [])
                if ob.hide_render or not any(p['renderPermitted'] for p in paths) or ob.type not in ('MESH', 'CURVE', 'FONT'):
                    continue
                assert ob.name in scene.objects
                evaluated = ob.evaluated_get(deps)
                mesh = evaluated.to_mesh()
                try:
                    if mesh is None or not len(mesh.vertices):
                        continue
                    vv = np.empty(len(mesh.vertices)*3, dtype=np.float64)
                    mesh.vertices.foreach_get('co', vv)
                    vv = np.column_stack((vv.reshape(-1, 3), np.ones(len(mesh.vertices))))
                    world_matrix = np.asarray(evaluated.matrix_world, dtype=np.float64)
                finally:
                    evaluated.to_mesh_clear()
                clouds.append(vv @ world_matrix.T)
                included.append(dict(name=ob.name, type=ob.type, vertices=len(vv),
                                     renderEnabled=not ob.hide_render, viewportHidden=bool(ob.hide_viewport),
                                     collectionPaths=paths))
            return (np.concatenate(clouds) if clouds else None), included

        def measure(objects):
            nonlocal projection_max_difference
            cloud, included = world_points(objects)
            if cloud is None:
                return dict(objects=included, presentInRenderState=False, box=None, widthRatio=None)
            deps = bpy.context.evaluated_depsgraph_get()
            matrix = d.CAM.calc_matrix_camera(deps, x=1080, y=1920, scale_x=1, scale_y=1) @ d.CAM.matrix_world.inverted()
            pp = cloud @ np.asarray(matrix, dtype=np.float64).T
            in_front = bool((pp[:, 3] > 0).all())
            assert np.isfinite(pp).all()
            if not in_front:
                return dict(objects=included, presentInRenderState=True, allVerticesInFrontCamera=False,
                            box=None, widthRatio=None, geometrySha256=hashlib.sha256(cloud.tobytes()).hexdigest())
            xy = np.column_stack(((pp[:, 0]/pp[:, 3]+1)*540, (1-pp[:, 1]/pp[:, 3])*960))
            # Independent original projector is rounded to 0.1 pixel.  This is
            # numerical projection validation, not a quality/width allowance.
            for index in {0, len(cloud)//2, len(cloud)-1}:
                original = d.project(g['Vector'](cloud[index, :3]))
                difference = max(abs(original[0]-xy[index, 0]), abs(original[1]-xy[index, 1]))
                projection_max_difference = max(projection_max_difference, float(difference))
                assert difference <= .11, ('Projection implementations disagree', difference)
            box = [float(xy[:, 0].min()), float(xy[:, 1].min()), float(xy[:, 0].max()), float(xy[:, 1].max())]
            width = (box[2]-box[0])/1080
            return dict(objects=included, evaluatedVertices=len(cloud), presentInRenderState=True,
                        allVerticesInFrontCamera=True, box=box, widthRatio=width,
                        within40to70=.4 <= width <= .7,
                        insideFullFrame=box[0] >= 0 and box[2] <= 1080 and box[1] >= 0 and box[3] <= 1920,
                        insideInstructionSafeFrame=box[0] >= 40 and box[2] <= 1040 and box[1] >= 110 and box[3] <= 1600,
                        geometrySha256=hashlib.sha256(cloud.tobytes()).hexdigest(),
                        presenceIsRenderEnablementAndProjectionNotPixelOcclusion=True)

        b5_scope = runpy.run_path(str(B5))
        outer = next(n for n in ast.parse(B5.read_text()).body if isinstance(n, ast.FunctionDef) and n.name == 'run')
        block = next(n for n in outer.body if isinstance(n, ast.Try))
        defs = [n for n in block.body if isinstance(n, ast.FunctionDef) and n.name in ('stages', 'place')]
        assert len(defs) == 2
        phase = {**b5_scope, 'g': g, 'd': d, 'bpy': bpy, 'original_apply': g['apply'],
                 'world_points': lambda obs: world_points(obs)[0], 'tree': tree}
        exec(compile(ast.Module(body=defs, type_ignores=[]), str(B5), 'exec'), phase)
        lore_placement = runpy.run_path(str(B4))['apply_lore_garlic_initial']
        b2_refs = {int(k): v for k, v in b2['patchFrameToUnchangedObjectSourceFrame'].items()}
        small_refs = {int(k): v for k, v in small['patchFrameToUnchangedObjectSourceFrame'].items()}
        challenge_refs = {int(k): v for k, v in challenge['patchFrameToUnchangedObjectSourceFrame'].items()}
        b6_refs = {int(k): v for k, v in b6['patchFrameToUnchangedObjectSourceFrame'].items()}
        ship_keys = {'open:box', 'open:mio', 'last:needle'}
        garlic_keys = {'garlic:side', 'garlic:rub', 'garlic:nail', 'garlic:mio'}
        pair_keys = {'rule:first', 'rule:bar', 'rule:pull'}
        gesture_nodes = [(201.72, 51.5), (202.55, 0), (203.38, 90), (204.15, 45), (205.37, 51.5)]

        def reconstruct(j):
            record = records[j]
            family, source, operation = source_family(record)
            ref = record['originalObjectSourceFrame']
            op_time = operation/30 if operation is not None else None
            # Actual source report mappings take precedence over an inherited
            # nominal output plan.  The source filename is not output time.
            if family == 'b6':
                assert ref == b6_refs[operation]
            elif family == 'b2-camera':
                assert ref == b2_refs[operation]
            elif family == 'b3-small':
                assert ref == small_refs[operation]
            elif family == 'b3-challenge':
                assert ref == challenge_refs[operation]
            elif family == 'timing':
                assert timing['firstFrame'] <= operation <= timing['lastFrame']
                ref = operation  # This private timing patch actually rendered every supplied time.
            d.HANDS['kai'].scale = (1, 1, 1)
            key = g['cue_at'](ref/30)['key']
            assert key == g['cue_at'](j/30)['key'], 'Actual held object must belong to output cue'
            aa = phase['place'](ref, op_time) if family == 'b6' and key == 'rule:pull' else g['apply'](ref/30)
            if family == 'b6':
                if key == 'lore:garlic':
                    lore_placement(g, ref)
                if key in ship_keys:
                    from mathutils import Matrix
                    pivot, site = g['Vector'](b6['ship']['old']), g['Vector'](b6['ship']['new'])
                    rotation = Matrix.Rotation(b6['ship']['yaw'], 3, 'Z')
                    for ob in g['GROUPS']['ship']:
                        if ob.parent not in g['GROUPS']['ship']:
                            ob.location = site + rotation @ (ob.location-pivot)
                            ob.rotation_euler = (rotation @ ob.rotation_euler.to_matrix()).to_euler()
                if key in garlic_keys:
                    for ob in g['GROUPS']['gilbert']:
                        ob.hide_render = False
                        ob.hide_viewport = False
                    delta = g['Vector'](b6['Gilbert']['new'])-g['Vector'](b6['Gilbert']['old'])
                    for ob in g['GROUPS']['gilbert']:
                        if ob.parent not in g['GROUPS']['gilbert']:
                            ob.location += delta
                    garlic = g['PARTS']['garlic']
                    wait = g['BASE'][garlic['root']][0] + g['Vector'](b6['garlicWaitingShift'])
                    if op_time < 68.09:
                        garlic['root'].location = wait
                    elif op_time < 68.49:
                        garlic['root'].location = wait.lerp(g['Vector']((-.035, -.02, .036)), g['u'](op_time, 68.09, .4))
                    elif 70.35 <= op_time < 71.15:
                        end = g['Vector']((-.035+.025*math.sin(g['u'](70.35, 68.49, 1.8)*math.pi*6), -.02, .036))
                        garlic['root'].location = end.lerp(wait, g['u'](op_time, 70.35, .8))
                    elif op_time >= 71.15:
                        garlic['root'].location = wait
                if key in pair_keys:
                    u = g['u'](op_time, b6['retire']['start'], .8)
                    delta = g['Vector']((.10*min(1, u/.35), .30*max(0, (u-.35)/.65), 0))
                    garlic = g['PARTS']['garlic']
                    for ob in tree(garlic['root']):
                        ob.hide_render = False
                        ob.hide_viewport = False
                    garlic['root'].location = g['BASE'][garlic['root']][0] + g['Vector'](b6['garlicWaitingShift']) + delta
                    for nail in garlic['nails']:
                        for ob in tree(nail):
                            ob.hide_render = False
                            ob.hide_viewport = False
                        nail.location = g['BASE'][nail][0] + g['Vector']((0, -.04, 0)) + delta
                if key == 'terella:idea':
                    u = g['u'](op_time, b6['descent']['start'], .8)
                    dz = .04*(1-u)-.002*math.sin(math.pi*u)
                    for ob in [g['PARTS']['terrella']['rock']] + [o for o in g['GROUPS']['terrella'] if o.type == 'MESH' and 'b1_pole' in o.name]:
                        ob.location.z += dz
            elif family == 'b3-score' and key == 'open:who':
                d.board_h.location.x += .20
            if family in ('b2-camera', 'b3-small'):
                if key == 'rule:vane':
                    g['PARTS']['vane']['root'].rotation_euler.z = math.radians(70)*(1-d.back(d.lin(ref/30, 107.97, 108.67)))
                if key == 'test:if' and 201.32 <= op_time <= 206.8:
                    latitude = gesture_nodes[0][1]
                    for (at, angle), (bt, next_angle) in zip(gesture_nodes, gesture_nodes[1:]):
                        if op_time >= at:
                            latitude = angle+(next_angle-angle)*g['u'](op_time, at, bt-at)
                    r = math.radians(latitude)
                    target = g['PARTS']['terrella']['center'] + .099*g['Vector']((math.cos(r), 0, math.sin(r))) + g['Vector']((0, -.03, 0))
                    g['touch']('kai', target, op_time, 201.72, 206.3)
                if family == 'b3-small':
                    hand = d.HANDS['kai']
                    tip = hand.location+hand.rotation_euler.to_matrix() @ d.TIP
                    hand.scale = (.24,)*3
                    hand.location = tip-hand.rotation_euler.to_matrix() @ (d.TIP*.24)
            if family == 'b3-challenge':
                p = g['PARTS']['terrella']
                needle, support, _, _ = p['needles'][0]
                rr = g['Vector']((math.cos(math.pi/6), 0, -.5))
                needle.location, support.location = p['center']+.112*rr, p['center']+.108*rr
                g['place_angle_frame'](needle.location, -30)
                riser = bpy.data.objects.get('b1_challenge_riser_20261024')
                assert riser is not None
                d.show(riser, True)
                aa['challengeNeedle'] = needle.location.copy()
                # White reading-edge/outline additions are not the primary stone;
                # no claim is made that those extra pixels have been recreated.
            if family == 'timing' and op_time < timing['boxAppears']:
                for ob in g['GROUPS']['mysterybox']:
                    d.show(ob, False)
            if family == 'b7':
                assert operation == j and 4125 <= j <= 4140
                a6 = g['PARTS']['terrella']['needles'][5][0]
                a6.location.z += .025*(1-g['u'](op_time, 137.35, .25))
                tip = a6.location.copy()
                if op_time >= 137.60:
                    tip += g['Vector']((.06, 0, .08))*g['u'](op_time, 137.60, .4)
                d.set_hand('kai', tip, yaw=150, pitch=-25, vis=True)
                assert private['maxdelta'](tuple(a6.location), b7[j]['sixthNeedleLocation']) <= 1e-9
            g['pose_b1'](poses[j])
            if g['cue_at'](ref/30)['row'] == 32 and family == 'b2-camera':
                focus = g['Vector']((.32, .12, .16))
                d.CAM_D.dof.focus_distance = (d.CAM.location-focus).length
            bpy.context.view_layer.update()
            return aa, family, source, ref, operation

        def primary(cue):
            row, p, groups = cue['row'], g['PARTS'], g['GROUPS']
            if row in (1, 2, 14, 16, 39):
                return 'complete compass including actual lid', groups['compass'], {}
            if row == 3:
                return 'compass and physical score board', groups['compass']+tree(d.board_h), {'compass': groups['compass'], 'scoreBoard': tree(d.board_h)}
            if row == 4:
                return 'polar star ornament and compass', groups['star']+groups['compass'], {'star': groups['star'], 'compass': groups['compass']}
            if row in (5, 6):
                return 'complete map and raised magnetic island', groups['map'], {}
            if row == 7:
                return 'sailor holding garlic', groups['sailor']+tree(p['garlic']['root']), {'sailor': groups['sailor'], 'garlic': tree(p['garlic']['root'])}
            if row == 8:
                return 'complete Gilbert figure', groups['gilbert'], {}
            if row in (9, 10, 11):
                return 'complete experiment magnet A', tree(p['magnets']['a']), {'garlic': tree(p['garlic']['root']), 'nails': [o for n in p['garlic']['nails'] for o in tree(n)]}
            if row in (12, 13):
                return 'both complete interacting bars', groups['magnets'], {'barA': tree(p['magnets']['a']), 'barB': tree(p['magnets']['b'])}
            if row == 15:
                return 'wind vane and compass comparison', groups['vane']+groups['compass'], {'vane': groups['vane'], 'compass': groups['compass']}
            if row in (17, 18, 19, 20, 21, 25, 38):
                secondary = {'surfaceNeedles': [o for a, _, _, _ in p['terrella']['needles'] for o in tree(a)]}
                return 'evaluated stone only; no stand/hand/needle inflation', [p['terrella']['rock']], secondary
            if row in (22, 23):
                particles = [p['powder']['mesh']]
                arrows = [o for arrow, _, _ in p['powder']['arrows'] for o in tree(arrow)]
                return 'evaluated stone in unchanged side shot; no glass/particle extent inflation', [p['terrella']['rock']], {'ironParticlesAndFieldArrows': particles+arrows}
            if row in (24, 30, 31, 33, 34):
                return 'actual globe surface; inner magnet separately', [p['globe']['globe']], {'innerBar': tree(p['globe']['inner'])}
            if row == 32:
                return 'actual globe and complete compass', [p['globe']['globe']]+groups['compass'], {'globe': [p['globe']['globe']], 'compass': groups['compass']}
            if row in (26, 28, 29, 36, 37):
                return 'actual visible cutaway disc; hidden sphere excluded', [p['globe']['disc']], {'predictionAndAxis': groups['globe'], 'mysteryBox': groups['mysterybox'] if row == 37 else []}
            if row == 27:
                return 'complete dip meter only; Norman separately', groups['meter'], {'Norman': groups['norman']}
            if row == 35:
                return 'open book and physical score board', groups['book']+tree(d.board_h), {'book': groups['book'], 'scoreBoard': tree(d.board_h)}
            raise AssertionError(('No explicit semantic primary', row))

        face_by_frame = [None]*10700
        for run in face_plan['runs']:
            for j in range(run['firstFrame'], run['lastFrame']+1):
                assert face_by_frame[j] is None
                face_by_frame[j] = {k: v for k, v in run.items() if k not in ('firstFrame', 'lastFrame')}
        assert all(face_by_frame)
        for j, record in enumerate(records):
            assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists(), 'Root requested audit cancellation'
            key = recipe_key(record, poses[j])
            if key not in state_index:
                aa, family, source, ref, operation = reconstruct(j)
                cue = g['cue_at'](j/30)
                definition, objects, secondary = primary(cue)
                evaluated = measure(objects)
                assert evaluated['presentInRenderState'], ('Primary absent from actual source recipe', j, definition)
                state_index[key] = len(states)
                states.append(dict(index=len(states), representativeOutputFrame=j,
                                   sourceFamily=family, source=str(source), sourceSha256=record['sha256'],
                                   inheritedOtherObjectReference=record['originalObjectSourceFrame'],
                                   evaluatedObjectTime=ref/30, operationSourceFrame=operation,
                                   deliveredPose=poses[j], cue=cue['key'], row=cue['row'],
                                   principalDefinition=definition, primary=evaluated,
                                   secondary={name: measure(obs) for name, obs in secondary.items() if obs},
                                   challengeReadingEdgePixelsNotRecreated=family == 'b3-challenge'))
                if len(states) % 50 == 0:
                    print('B1 exact visible primary audit', len(states), 'recipes; output', j, '/10700; zero renders', flush=True)
            state = states[state_index[key]]
            cue = g['cue_at'](j/30)
            assert state['row'] == cue['row'], 'No cross-row primary definition reuse'
            frame_map.append(dict(frame=j, stateIndex=state_index[key], face=face_by_frame[j]))
        half_frames = [k*15 for k in range(714)]
        boundary_frames = sorted({r['frame'] for r in historical} - set(half_frames))
        assert len(boundary_frames) == 45 and all(0 <= j < 10700 for j in half_frames+boundary_frames)
        samples = [dict(frame=j, time=j/30, stateIndex=frame_map[j]['stateIndex'],
                        face=frame_map[j]['face'], primary=states[frame_map[j]['stateIndex']]['primary'])
                   for j in sorted(set(half_frames+boundary_frames))]
        assert len(states) == 4047, ('Exact-source recipe count changed', len(states))
        report.update(all10700OutputsMapped=True, exactRecipeCount=len(states),
                      halfSecondFrames=half_frames, exactNonHalfBoundaryFrames=boundary_frames,
                      samples759=samples, oldGeometryFlagsNeverUsedForVerdict=True,
                      numericalProjectionMaxDifferencePixels=projection_max_difference,
                      allB7PatchFramesRetained=list(range(4125, 4141)),
                      originalPhysicalRecordsNotOverwritten=True,
                      completedMeasurements=True)
        return report
    except BaseException as error:
        report['error'] = dict(type=type(error).__name__, message=str(error))
        raise
    finally:
        cleanup, checks, offenders = None, {}, []
        try:
            checks, offenders = tx.close()
        except BaseException as error:
            cleanup = dict(type=type(error).__name__, message=str(error))
        finally:
            bpy.context.window.scene = oldscene
            target = next(l for l in oldscene.view_layers if l.name == entry_context['viewLayerName'] and recovery.tools['pointer'](l) == entry_context['viewLayerPointer'])
            bpy.context.window.view_layer = target
            bpy.context.view_layer.update()
        checks.update(
            allProtectedInputSHAUnchanged=all(sha(p) == h for p, h in protected.items()),
            allActualDeliveredSourceSHAUnchanged=all(sha(p) == h for p, h in source_hashes.items()),
            all10700RawStatsAndPathsUnchanged=private['inventory'](C/'blender/desk') == raw_inventory,
            allRuntimeAndSnapshotBindingsUnchanged=tools['bindings'](g) == bindings and tools['bindings'](ns) == snapshot_bindings,
            RNAContextPointerNameOwnerFrameRestored=recovery.tools['context_equal'](entry_context, recovery.tools['context'](bpy)))
        report.update(protectionChecks=checks, restorationOffenders=offenders, cleanupError=cleanup,
                      protectedInputSha256=protected, normalEvaluation=recovery.metadata(),
                      seconds=round(time.time()-started, 3))
        write_new(OUT/'report.json', report)
        assert not cleanup and not offenders and checks and all(checks.values()), ('B1 exact audit strict restoration failed', checks, cleanup, offenders[:3])
