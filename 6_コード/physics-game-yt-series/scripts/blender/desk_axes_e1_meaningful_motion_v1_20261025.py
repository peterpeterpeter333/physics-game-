"""Add-only E-1 motion repair, root-scheduled and fail closed.

Replay original r9 object source + delivered15/local2 camera + approved1501
hat/light derivatives. Change ONLY an existing Kai hand in row2 and the
existing shipboard pendulum in row35. Never install functions or build models.
Probe must be personally approved by root before mode=render is scheduled.
"""
import ast
import hashlib
import json
import math
import os
from pathlib import Path
import runpy
import time

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-e1v1')
OUT = Path('/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v1-20261025')
ACTION = W/'scripts/blender/desk_axes_e1_actions_final_20261024.py'
ACTION_SHA = 'e74ac58891ff2768dab426974b71a5207a07f0a207ef25575e6fee658bd5cd83'
AR = Path('/private/tmp/ys/ys-chain-e1v1-actions-final-20261024/render/report.json')
AR_SHA = 'd24ec7403557a97c0b1c4534553935b53fee822bb1674784c364c67919991aaa'
POSES = Path('/private/tmp/ys/ys-chain-e1v1-local-fit-20261024/render/blender/delivered-camera-poses.json')
HAND_START, HAND_CONTACT, HAND_EXIT, HAND_END = 12.70, 13.47, 13.70, 15.00
PERIOD, AMPLITUDE, BLEND = 1.6, .18, .6
PROBE_TIMES = (12.9, 13.47, 13.9, 14.5, 308.4, 309.1, 310.2, 311.4, 314.2, 317.2, 317.5, 317.8)
CONTROL_FRAMES = (380, 450, 9249, 9540)


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p):
    return json.loads(Path(p).read_text())


def write(p, value):
    with Path(p).open('x') as stream:
        json.dump(value, stream, ensure_ascii=False, indent=1, allow_nan=False)
        stream.write('\n')


def current(cues, t):
    return next((q for q in reversed(cues) if q['start'] <= t), cues[0])


def blend_weight(u):
    u = max(0., min(1., u))
    return u*u*u*(10+u*(-15+6*u))


def hand_offset(t, smooth):
    return 1-smooth(t, HAND_START, HAND_CONTACT)+smooth(t, HAND_EXIT, HAND_END)


def repaired_pendulum(t, wave, original):
    """C1 blend: matches the original irregular angle at wave, not its alias."""
    regular = (0., AMPLITUDE*math.sin(2*math.pi*(t-wave)/PERIOD+.7), 0.)
    w = blend_weight((t-wave)/BLEND)
    return tuple((1-w)*a+w*b for a, b in zip(regular, original))


def _copy_value(value):
    if hasattr(value, 'copy'):
        return value.copy()
    if isinstance(value, (str, bool, int, float)):
        return value
    return tuple(value)


def _value_error(a, b):
    if isinstance(b, (bool, str, int)):
        return 0. if a == b else math.inf
    try:
        return max((abs(float(x)-float(y)) for x, y in zip(a, b)), default=0.)
    except TypeError:
        return abs(float(a)-float(b))


def run(ns, authorized=False, mode='probe', approved_probe_sha256=None):
    import numpy as np
    assert authorized is True and mode in ('audit', 'probe', 'render')
    assert not OUT.is_symlink() and not os.path.lexists(OUT/mode)
    assert sha(ACTION) == ACTION_SHA and sha(AR) == AR_SHA
    action = runpy.run_path(str(ACTION))
    runner = runpy.run_path(str(action['RUNNER']))
    assert sha(action['RUNNER']) == action['RUNNER_SHA']
    ar = read(AR)
    assert ar['helperSha256'] == ACTION_SHA and ar['allPatchFramesActuallyRendered']
    assert ar['allGuardedStatesPass'] and all(ar['protectionChecks'].values())
    g = ns['apply'].__globals__
    d, bpy, scene = g['d'], g['bpy'], g['d'].SC
    assert g['__file__'] == str(W/'scripts/blender/desk_e1v1.py')
    assert g['NF'] == 11606 and g['FPS'] == 30 and g['A'].cache == str(C)
    assert scene.camera is d.CAM and scene.render.engine == 'BLENDER_EEVEE'
    assert g.get('_SHOW_QUEUE') is None
    pg, plans = runner['frozen_plan']()
    assert len(plans) == 11606 and all(tuple(g['plan'](j)) == tuple(p) for j, p in enumerate(plans))
    refs = [j if p[0] == 'render' else p[1] for j, p in enumerate(plans)]
    poses = read(POSES)['poses']
    assert len(poses) == len(plans)
    cues = g['CUES']
    fact, wave = g['S']('pen:fact'), g['T']('pen:sway', '波')
    assert abs(g['T']('fog:admiral', '帰る途中')-HAND_CONTACT) < 1e-8
    assert abs(fact-308.316) < 1e-8 and abs(wave-317.21) < 1e-8
    def kind(j):
        t = j/30
        if HAND_START <= t < HAND_END:
            assert current(cues, t)['row'] == 2
            return 'quiet-flagship-point'
        if fact <= t < wave+BLEND:
            assert current(cues, t)['row'] == 35
            return 'regular-shipboard-pendulum-to-existing-wave'
        return None
    selected = [j for j in range(len(plans)) if kind(j)]
    # All this episode's opening mist and the pendulum span are actual30fps,
    # so each changed output has its own existing physical state. No held
    # dependency may escape this claim or be silently promoted to a new state.
    assert selected and all(refs[j] == j for j in selected)
    assert all(not (p[0] == 'dup' and p[1] in selected) for p in plans)
    for j in selected:
        if kind(j) == 'quiet-flagship-point':
            k = ar['replacementFrameToActualPatchFrame'][str(j)]
            assert k == j and ar['patchFrameToUnchangedOtherObjectSourceFrame'][str(k)] == j
            assert list(poses[j]) == next(r['pose'] for r in ar['physical'] if r['frame'] == k)
    protected = dict(ar['protectedInputSha256'])
    protected.update({str(ACTION): ACTION_SHA, str(AR): AR_SHA, str(POSES): sha(POSES), __file__: sha(__file__)})
    assert all(sha(p) == h for p, h in protected.items())
    cp = read(action['CAMERA']/'camera-patch.json')
    lp = read(action['LOCAL']/'report.json')
    raw_folders = [C/'blender/desk', Path(cp['raw']), Path(lp['raw']), Path(ar['raw'])]
    inventory_before = {str(p): action['inventory'](p) for p in raw_folders}
    def baseline_raw(j):
        for report in (ar, lp, cp):
            mapping = report['replacementFrameToActualPatchFrame']
            if str(j) in mapping:
                return Path(report['raw'])/('%05d.jpg' % mapping[str(j)])
        return raw_folders[0]/('%05d.jpg' % refs[j])
    input_raw_hashes = {str(baseline_raw(j)): sha(baseline_raw(j)) for j in selected+list(CONTROL_FRAMES)}
    # Prove the actual retained function payloads, without executing a source
    # import that would rebuild or rebind the shared/private scene.
    wanted = ('apply', 'apply_state', 'map_state', 'ship_state', 'hands', 'use_pose', 'anchors')
    nodes = [n for n in ast.parse((W/'scripts/blender/desk_e1v1.py').read_text()).body
             if isinstance(n, ast.FunctionDef) and n.name in wanted]
    compiled = {}
    exec(compile(ast.Module(body=nodes, type_ignores=[]), str(W/'scripts/blender/desk_e1v1.py'), 'exec'), compiled)
    assert all(runner['signature'](g[n].__code__) == runner['signature'](compiled[n].__code__) for n in wanted)
    bindings = {n: g[n] for n in wanted+('plan', 'pose_at', 'main', 'SPANS', 'EVENTS', 'CAMERAS', 'KEYS')}
    managed = list(dict.fromkeys(g['MANAGED']+[o for root in d.HANDS.values() for o in g['ext'].descendants(root)]))
    assert all(o.name in scene.objects and scene.objects[o.name] is o for o in managed)
    # Local channels actually touched by original apply(row2/35), not foreign
    # scenes or a blanket world-matrix reassignment.
    parts = g['PARTS']
    clocks = (parts['shipclock'], parts['pendulum']['clock'])
    roots = [parts['hat'], parts['offset'], g['globe']['root'], g['globe']['rot'], g['arcs']['root'],
             parts['pendulum']['root'], parts['pendulum']['pendulum'], parts['ship']['root'], d.CAM, d.board_h]
    roots += [s['root'] for s in parts['fleet']]+list(d.HANDS.values())
    roots += [cl[k] for cl in clocks for k in ('root', 'hour', 'minute')]
    roots = list(dict.fromkeys(roots))
    transform_properties = ('location', 'scale', 'rotation_euler', 'rotation_quaternion', 'rotation_axis_angle',
                            'delta_location', 'delta_scale', 'delta_rotation_euler', 'delta_rotation_quaternion')
    transforms = {o: {p: _copy_value(getattr(o, p)) for p in transform_properties} for o in roots}
    worlds = {o: o.matrix_world.copy() for o in roots}
    bases = {o: o.matrix_basis.copy() for o in roots}
    parent_identity = {o: (o.parent, o.matrix_parent_inverse.copy(), o.rotation_mode) for o in roots}
    visibility = {o: (bool(o.hide_render), bool(o.hide_viewport)) for o in managed}
    colors = {o: tuple(o.color) for o in managed}
    # The two unique fog materials deliberately are not in d.MATS. Include
    # owned model slots so their Mapping socket motion is really restored.
    materials = list(dict.fromkeys(list(d.MATS.values())+[m for ob in managed
        if getattr(ob,'data',None) and hasattr(ob.data,'materials')
        for m in ob.data.materials if m is not None]))
    sockets = []
    for owner in materials+[scene.world]:
        if owner and owner.use_nodes:
            for node in owner.node_tree.nodes:
                for socket in node.inputs:
                    if hasattr(socket, 'default_value') and socket.type in ('VALUE', 'RGBA', 'VECTOR', 'INT', 'BOOLEAN'):
                        sockets.append((socket, _copy_value(socket.default_value)))
    sphere_materials = tuple(g['globe']['sphere'].data.materials)
    texts = {d.dg[k].data: d.dg[k].data.body for k in ('make', 'brk')}
    lights = {ld: (float(ld.energy), tuple(ld.color)) for ld in list(dict.fromkeys([ld for ld, _ in d.LIGHTS]+[parts['torch']['light']]))}
    nominal = [tuple(d.rgb(h)[:3]) for h in ('#ffd8a8', '#dfe6ff', '#ffe2c0', '#ffd8a8')]
    assert len(d.LIGHTS) == len(nominal)
    assert all(max(abs(a-b) for a,b in zip(ld.color,col)) < 1e-7 for (ld,_),col in zip(d.LIGHTS,nominal))
    light_colors = {ld: tuple(ld.color) for ld, _ in d.LIGHTS}
    original_hat_x = float(parts['hat'].location.x)
    assert abs(original_hat_x-ar['hatFit']['originalX']) < 1e-8
    camera_values = (d.CAM_D.lens, d.CAM_D.dof.focus_distance, d.CAM_D.dof.aperture_fstop)
    old_scene = bpy.context.window.scene
    paths = {s.name: s.render.filepath for s in bpy.data.scenes}
    saved_paths = {p: runner['stamp'](p) for p in paths.values() if p and os.path.isfile(p)}
    settings = (scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage,
                scene.eevee.taa_render_samples, scene.render.image_settings.file_format, scene.render.image_settings.quality)
    sizes = {n: len(getattr(bpy.data,n)) for n in ('objects','meshes','curves','materials','lights')}
    dest = OUT/mode
    dest.mkdir(parents=True)
    report = {'id':'ys-chain-e1v1', 'kind':'meaningful hand and calm shipboard pendulum only', 'mode':mode,
              'helperSha256':sha(__file__), 'baseActionReportSha256':AR_SHA, 'protectedInputSha256':protected,
              'allOriginalScriptAudioSubtitlesUnchanged':True, 'allOriginalRuntimeBindingsRetained':True,
              'originalGateNGPreserved':True, 'automaticWaiver':False, 'finalPassed':False, 'earListeningPerformed':False,
              'changes':{'handSeconds':[HAND_START,HAND_CONTACT,HAND_EXIT,HAND_END],
                         'handMeaning':'Quietly identify the existing flagship while saying it was returning; no map-position answer/route/wreck is introduced.',
                         'pendulumSeconds':[fact,wave,wave+BLEND], 'shipboardPeriodSeconds':PERIOD,
                         'landRow33And34Unchanged':True, 'waveBlendSeconds':BLEND},
              'replacementFrameToActualPatchFrame':{j:j for j in selected},
              'patchFrameToUnchangedOtherObjectSourceFrame':{j:refs[j] for j in selected},
              'allHeldDependenciesMapped':True, 'actualSources':len(selected),
              'actualImages':[], 'controls':[], 'physical':[], 'allPass':False}
    began = time.time()
    local_cache = {}
    def cloud(objects):
        deps = bpy.context.evaluated_depsgraph_get()
        points = []
        for ob in dict.fromkeys(objects):
            if ob.hide_render or ob.type not in ('MESH','CURVE','FONT'):
                continue
            if ob not in local_cache:
                evaluated = ob.evaluated_get(deps)
                mesh = evaluated.to_mesh()
                try:
                    assert mesh is not None
                    v = np.empty(len(mesh.vertices)*3, dtype=np.float64)
                    mesh.vertices.foreach_get('co',v)
                    local_cache[ob] = np.column_stack((v.reshape(-1,3),np.ones(len(mesh.vertices))))
                finally:
                    evaluated.to_mesh_clear()
            points.append(local_cache[ob] @ np.asarray(ob.matrix_world,dtype=np.float64).T)
        assert points
        return np.concatenate(points)
    def bounds(objects):
        vv = cloud(objects)
        deps = bpy.context.evaluated_depsgraph_get()
        matrix = d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1,scale_y=1) @ d.CAM.matrix_world.inverted()
        q = vv @ np.asarray(matrix,dtype=np.float64).T
        assert np.isfinite(q).all() and (q[:,3]>0).all()
        xy = np.column_stack(((q[:,0]/q[:,3]+1)*540,(1-q[:,1]/q[:,3])*960))
        for i in (0,len(vv)//2,len(vv)-1):
            assert max(abs(a-b) for a,b in zip(d.project(g['Vector'](vv[i,:3]))[:2],xy[i])) <= .11
        box = [float(xy[:,0].min()),float(xy[:,1].min()),float(xy[:,0].max()),float(xy[:,1].max())]
        return {'box':box,'widthRatio':(box[2]-box[0])/1080,
                'safe':box[0]>=40 and box[1]>=110 and box[2]<=1040 and box[3]<=1550}
    def unchanged_state(j):
        parts['hat'].location.x = original_hat_x
        for ld,color in light_colors.items():
            ld.color = color
        points = bindings['apply'](refs[j]/30)
        bindings['use_pose'](poses[j])
        if current(cues,j/30)['row'] <= 6:
            for ld,col in light_colors.items():
                ld.color = tuple((1-action['TINT_AMOUNT'])*a+action['TINT_AMOUNT']*b for a,b in zip(col,action['TINT_COLOR']))
            if j/30 >= g['T']('fog:admiral','クラウズリー'):
                parts['hat'].location.x = ar['hatFit']['newX']
        bpy.context.view_layer.update()
        return points
    def changed_state(j):
        points = unchanged_state(j)
        action_kind = kind(j)
        before = {o: o.matrix_world.copy() for o in managed}
        camera_before = (d.CAM.matrix_world.copy(), d.CAM_D.lens,
                         d.CAM_D.dof.focus_distance, d.CAM_D.dof.aperture_fstop)
        if action_kind == 'quiet-flagship-point':
            target = g['Vector'](g['DATA']['map']['fleetLead'])+g['Vector'](g['DATA']['map']['fleetMove'])+g['Vector']((0,0,.043))
            v = hand_offset(j/30,d.seg)
            d.set_hand('kai',target+g['Vector']((.22*v,-.28*v,.10*v)),130,-28)
            exempt = set(g['ext'].descendants(d.HANDS['kai']))
        else:
            assert action_kind == 'regular-shipboard-pendulum-to-existing-wave'
            p = parts['pendulum']['pendulum']
            p.rotation_euler = repaired_pendulum(j/30,wave,tuple(p.rotation_euler))
            exempt = set(g['ext'].descendants(p))
        bpy.context.view_layer.update()
        assert all(max(abs(a-b) for ra,rb in zip(ob.matrix_world,before[ob]) for a,b in zip(ra,rb)) <= 1e-9
                   for ob in managed if ob not in exempt), 'Non-approved geometry changed'
        assert max(abs(a-b) for ra,rb in zip(d.CAM.matrix_world,camera_before[0]) for a,b in zip(ra,rb)) <= 1e-9
        assert (d.CAM_D.lens,d.CAM_D.dof.focus_distance,d.CAM_D.dof.aperture_fstop) == camera_before[1:]
        assert list(poses[j]) == list(poses[refs[j]]), 'No camera drift through held-state substitution'
        return points
    def render_one(j,folder,changed):
        points = changed_state(j) if changed else unchanged_state(j)
        target = folder/('%05d.jpg'%j)
        assert not os.path.lexists(target) and target.parent == folder
        scene.render.filepath = str(target)
        bpy.context.window.scene = scene
        bpy.ops.render.render(write_still=True,scene=scene.name)
        runner['jpeg'](str(target))
        return {'frame':j,'time':j/30,'path':str(target),'sha256':sha(target),'actuallyViewed':False},points
    try:
        bpy.context.window.scene = scene
        scene.render.resolution_x,scene.render.resolution_y = 1080,1920
        scene.render.resolution_percentage = 100
        scene.eevee.taa_render_samples = 16
        scene.render.image_settings.file_format = 'JPEG'
        scene.render.image_settings.quality = 95
        for j in selected:
            changed_state(j)
            groups = ('chart',) if kind(j) == 'quiet-flagship-point' else ('ship','pendulum')
            bb = bounds([o for name in groups for o in g['GROUPS'][name]])
            assert .4 <= bb['widthRatio'] <= .7 and bb['safe'], ('Principal guard NG',j,bb)
            critical = {'hat':bounds(g['GROUPS']['hat'])} if groups == ('chart',) else {}
            assert all(b['safe'] for b in critical.values())
            hand_tip = d.project(d.HANDS['kai'].matrix_world @ d.TIP) if groups == ('chart',) else None
            if hand_tip and abs(j/30-HAND_CONTACT) <= .2:
                assert 40 <= hand_tip[0] <= 1040 and 110 <= hand_tip[1] <= 1550 and hand_tip[2] == 1
            report['physical'].append({'frame':j,'time':j/30,'kind':kind(j),'pose':poses[j],
                                       'principalGroups':groups,'principal':bb,'critical':critical,
                                       'handTipPixels':hand_tip,
                                       'pendulumRotationXYZ':list(parts['pendulum']['pendulum'].rotation_euler) if groups != ('chart',) else None})
        report['allPrincipalAndCriticalNumericalGuardsPass'] = True
        write(dest/'preflight.json',report)
        if mode == 'audit':
            report['status'] = 'Numerical only; no actual pixels or acceptance'
            return report
        if mode == 'render':
            probe = OUT/'probe/report.json'
            assert approved_probe_sha256 and sha(probe) == approved_probe_sha256
            prior = read(probe)
            assert prior['helperSha256'] == sha(__file__) and prior['allPass']
            assert prior['allPrincipalAndCriticalNumericalGuardsPass']
            assert prior['physical'] == report['physical']
            assert len(prior['actualImages']) == len(PROBE_TIMES)
            assert all(r['byteExactAgainstExistingDeliveredRaw'] for r in prior['controls'])
            wanted_frames = selected
            report['approvedProbeSha256'] = approved_probe_sha256
        else:
            wanted_frames = [round(t*30) for t in PROBE_TIMES]
            assert len(set(wanted_frames)) == len(PROBE_TIMES) and set(wanted_frames) <= set(selected)
        control_dir = dest/'controls'
        control_dir.mkdir()
        for j in CONTROL_FRAMES:
            assert kind(j) is None
            record,_ = render_one(j,control_dir,False)
            record.update({'expectedPath':str(baseline_raw(j)),
                           'expectedSha256':input_raw_hashes[str(baseline_raw(j))],
                           'byteExactAgainstExistingDeliveredRaw':record['sha256']==input_raw_hashes[str(baseline_raw(j))]})
            report['controls'].append(record)
            assert record['byteExactAgainstExistingDeliveredRaw'], ('Baseline replay control differs',j)
        raw = dest/'blender/patch'
        raw.mkdir(parents=True)
        names = sorted(read(C/'blender/desk/anchors.json')['anchors'])
        anchors = {name:[[0.,0.,0.] for _ in plans] for name in names}
        for j in wanted_frames:
            record,points = render_one(j,raw,True)
            report['actualImages'].append(record)
            for name in names:
                anchors[name][j] = d.project(points[name]) if name in points else [0.,0.,0.]
        write(raw/'anchors.json',{'fps':30,'frames':len(plans),'anchors':anchors})
        report.update({'raw':str(raw),'anchors':str(raw/'anchors.json'),
                       'allPatchFramesActuallyRendered':mode=='render',
                       'status':'Actual probes; root eye approval required' if mode=='probe' else 'Actual derivative rendered; final MP4 checks/eyes pending'})
        return report
    except BaseException as error:
        report['error'] = {'type':type(error).__name__,'message':str(error)}
        report['status'] = 'FAIL; original evidence and gates retained'
        raise
    finally:
        restore_error = None
        try:
            # Restore only E-owned mutable channels, then evaluate this scene.
            # No world/basis assignment and no editing a saved entry snapshot.
            for ob,(hr,hv) in visibility.items():
                ob.hide_render,ob.hide_viewport = hr,hv
            for ob,props in transforms.items():
                for name,value in props.items():
                    setattr(ob,name,value)
            for ob,value in colors.items():
                ob.color = value
            for socket,value in sockets:
                socket.default_value = value
            for data,body in texts.items():
                data.body = body
            for index,material in enumerate(sphere_materials):
                g['globe']['sphere'].data.materials[index] = material
            for ld,(energy,color) in lights.items():
                ld.energy,ld.color = energy,color
            d.CAM_D.lens,d.CAM_D.dof.focus_distance,d.CAM_D.dof.aperture_fstop = camera_values
            scene.render.filepath = paths[scene.name]
            (scene.render.resolution_x,scene.render.resolution_y,scene.render.resolution_percentage,
             scene.eevee.taa_render_samples,scene.render.image_settings.file_format,scene.render.image_settings.quality) = settings
            bpy.context.window.scene = scene
            bpy.context.view_layer.update()
        except BaseException as error:
            restore_error = {'type':type(error).__name__,'message':str(error)}
        checks = {
            'protectedInputsUnchanged':all(sha(p)==h for p,h in protected.items()),
            'allPriorRawInventoriesUnchanged':all(action['inventory'](p)==v for p,v in inventory_before.items()),
            'allSelectedBaselineRawBytesUnchanged':all(sha(p)==h for p,h in input_raw_hashes.items()),
            'originalBindingsUnchanged':all(g[n] is value for n,value in bindings.items()),
            'noModelRebuild':sizes=={n:len(getattr(bpy.data,n)) for n in sizes},
            'localTransformsRestored':all(_value_error(getattr(o,p),v)<=1e-9 for o,props in transforms.items() for p,v in props.items()),
            'localBasisRestored':all(max(abs(a-b) for ra,rb in zip(o.matrix_basis,value) for a,b in zip(ra,rb))<=1e-9 for o,value in bases.items()),
            'localWorldsRestored':all(max(abs(a-b) for ra,rb in zip(o.matrix_world,value) for a,b in zip(ra,rb))<=1e-9 for o,value in worlds.items()),
            'parentsInverseAndRotationModesUnchanged':all(o.parent is value[0] and o.rotation_mode==value[2] and max(abs(a-b) for ra,rb in zip(o.matrix_parent_inverse,value[1]) for a,b in zip(ra,rb))<=1e-9 for o,value in parent_identity.items()),
            'visibilityExactlyRestored':all((bool(o.hide_render),bool(o.hide_viewport))==value for o,value in visibility.items()),
            'objectOpacityColorsRestored':all(_value_error(o.color,value)<=1e-9 for o,value in colors.items()),
            'materialAndWorldInputsRestored':all(_value_error(socket.default_value,value)<=1e-9 for socket,value in sockets),
            'ownedLightEnergyAndColorRestored':all(abs(ld.energy-value[0])<=1e-9 and _value_error(ld.color,value[1])<=1e-9 for ld,value in lights.items()),
            'sphereMaterialSlotsRestored':tuple(g['globe']['sphere'].data.materials)==sphere_materials,
            'scoreTextRestored':all(data.body==body for data,body in texts.items()),
            'cameraDataRestored':(d.CAM_D.lens,d.CAM_D.dof.focus_distance,d.CAM_D.dof.aperture_fstop)==camera_values,
            'allScenePathsAndExistingFilesUnchanged':all(bpy.data.scenes[n].render.filepath==p for n,p in paths.items()) and not runner['verify_saved'](saved_paths),
            'visibilityQueueClosed':g.get('_SHOW_QUEUE') is None,
            'restorationCompletedWithoutException':restore_error is None
        }
        bpy.context.window.scene = old_scene
        checks['contextSceneRestored'] = bpy.context.window.scene is old_scene
        report.update({'protectionChecks':checks,'restorationError':restore_error,'seconds':time.time()-began,
                       'allPass':not report.get('error') and all(checks.values())})
        write(dest/'report.json',report)
        assert all(checks.values()), 'Local E transaction restoration/preservation failed; no waiver'

