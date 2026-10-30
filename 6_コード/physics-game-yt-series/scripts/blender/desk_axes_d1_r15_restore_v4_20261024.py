"""Explicit private water-center derivative after the diagnosed v3 failure.

Frozen r15 files and the original six-function/production guards stay intact.
Only mine_state is wrapped: its complete original operation runs first, then
the two water centers use the same requested heights rather than Blender's
not-yet-updated Object.dimensions getter. No renderer is called by restore().
"""
import ast,hashlib,json,runpy,time
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-d1v1-render')
SOURCE=W/'scripts/blender/desk_d1v1.py'
V3_SHA='c5f5f26cafcb9148d1c6cae5bdf13917a68d153b1459662adc9b0770c965cc07'
INTENT_HELPER=W/'scripts/blender/desk_axes_d1_water_intent_check_20261024.py'
INTENT_HELPER_SHA='5992d382457a9c7f0c5ff558bfbca93458b8c3917851c5beaa64cb1c3e14ce3a'
V3_INTENT=C/'d1-water-intent-after-v3-20261024.json'
EVIDENCE=C/'d1-runtime-water-derivative-v4-20261024.json'
PHYSICAL=C/'d1-semantic-physical-r15-water-v4-20261024.json'
INTENT=C/'d1-water-intent-after-v4-20261024.json'
PROBE=Path('/private/tmp/ys/ys-chain-d1v1-water-probe-v4-20261024')
WATER_NAMES={'d1_shaftwater','d1_pool'}

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def corrected_water_centers(frozen_mine_state,g):
    def water_center_derivative(t):
        frozen_mine_state(t)
        # Same frozen height expressions; avoid a stale dimensions getter.
        w=g['water'](t);q=g['P']['mine']
        q['pool'].location.z=.023+max(.006,w*.15)/2
        q['shaft'].location.z=.02+max(.008,w)/2
    return water_center_derivative

def without_water_boxes(states):
    return [{**r,'objects':{k:v for k,v in r['objects'].items() if k not in WATER_NAMES}} for r in states]

def restore(ns,authorized=False):
    assert authorized is True,'Only root may queue the D1 v4 derivative'
    assert all(not p.exists() and not p.is_symlink() for p in (EVIDENCE,PHYSICAL,INTENT)),'Keep all prior evidence'
    assert not Path('/private/tmp/ys/ys-chain-d1v1-production-r15').exists(),'Do not change an in-progress production'
    old=runpy.run_path(str(W/'scripts/blender/desk_axes_d1_r15_restore.py'))
    diag=runpy.run_path(str(W/'scripts/blender/desk_axes_d1_restore_diagnostic_v2_20261024.py'))
    for p,h in old['FROZEN'].items():assert sha(p)==h
    assert sha(INTENT_HELPER)==INTENT_HELPER_SHA
    failed=json.loads(V3_INTENT.read_text());assert failed['passed'] is False and failed['renders']==0
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];marker=ns['D1_DETERMINISTIC_RESET_V3']
    assert marker['helperSha256']==V3_SHA and g['reset'] is marker['wrapper'] and g['_VIS_QUEUE'] is None
    tree=ast.parse(SOURCE.read_text());nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef)];fresh={}
    exec(compile(ast.Module(body=nodes,type_ignores=[]),str(SOURCE),'exec'),fresh)
    assert all(not old['code_differences']((marker['frozenReset'] if n.name=='reset' else g[n.name]).__code__,fresh[n.name].__code__) for n in nodes),'All frozen functions must match before the explicit derivative'
    original=g['mine_state'];identities=[o.as_pointer() for o in d.SC.objects];old_scene=bpy.context.window.scene
    started=time.time();installed=False;changed=False
    report={'episode':'D-1','kind':'Explicit private mine_state water-center derivative, not a frozen-source restoration','startedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'helperSha256':sha(__file__),'frozenSourceSha256':old['FROZEN'][SOURCE],'v3IntentFailureEvidence':str(V3_INTENT),'v3IntentFailureSha256':sha(V3_INTENT),'originalTolerance':1e-5,'guardThresholdChanged':False,'sourceFilesModified':False,'modelsRebuilt':False,'renders':0,'allowedChanges':['d1_shaftwater location.z using .02+max(.008,water(t))/2','d1_pool location.z using .023+max(.006,water(t)*.15)/2'],'status':'IN PROGRESS'}
    try:
        bpy.context.window.scene=d.SC
        before=old['projection_states'](g,old['TIMES']);before_details=diag['details'](g,0)
        report['v3BaselineRepresentativeStates']=before;report['v3BaselineDetails0']=before_details
        changed=True;g['mine_state']=corrected_water_centers(original,g)
        after=old['projection_states'](g,old['TIMES']);repeat=old['projection_states'](g,old['TIMES'])
        after_details=diag['details'](g,0)
        report['correctedRepresentativeStates']=after;report['correctedRepeatedStates']=repeat;report['correctedDetails0']=after_details
        # Real water positions intentionally change; do not hide those deltas.
        report['explicitRepresentativeDeltas']=[{'time':a['time'],'differences':diag['differences'](a,b)} for a,b in zip(before,after)]
        report['strictUnaffectedObjectChecks']=old['compare_projections'](without_water_boxes(before),without_water_boxes(after))
        report['strictCorrectedRepeatChecks']=old['compare_projections'](after,repeat)
        detail_changes=diag['differences'](before_details,after_details)
        allowed={'.objects.'+name+tail for name in WATER_NAMES for tail in ('.location[2]','.matrixWorld[2][3]')}
        assert all(r['field'] in allowed or r.get('kind')=='number' and r['absoluteDifference']<=1e-5 for r in detail_changes),'The derivative must not change mesh, scale, material, pose, focus or an unrelated object'
        report['explicitDetails0Deltas']=detail_changes
        intent=runpy.run_path(str(INTENT_HELPER))['check'](ns,authorized=True,out=str(INTENT))
        assert intent['passed'] and len(intent['rows'])==36
        report['intentEvidence']=str(INTENT);report['intentEvidenceSha256']=sha(INTENT);report['intentStates']=36;report['intentMaximumDifferenceMeters']=intent['maximumDifferenceMeters']
        pure,expected=old['frozen_schedule'](d.norm);plans=[g['plan_d1'](j) for j in range(12163)]
        assert plans==expected and g['D1_POSES']==pure['D1_POSES'] and g['SPANS']==pure['SPANS'] and g['EVENTS']==pure['EVENTS']
        report['independentAll12163PlanMatch']=True;report['planSha256']=old['jsha'](plans);report['renderFrames']=5070;report['duplicateFrames']=7093
        physical=runpy.run_path(str(W/'scripts/blender/desk_d1v1_semantic_audit_r9.py'))['check'](ns,str(PHYSICAL),revision='r15 + explicit private v4 water-center derivative, no camera correction yet',expected_source=old['FROZEN'][SOURCE])
        held=[r for r in physical['rows'] if not r['cameraTransition']]
        report['physicalEvidence']=str(PHYSICAL);report['physicalEvidenceSha256']=sha(PHYSICAL);report['physicalStates']=len(physical['rows']);report['heldStates']=len(held);report['heldFailures']=[r for r in held if not r['pass']];report['movingFailuresPreserved']=[r for r in physical['rows'] if r['cameraTransition'] and not r['pass']]
        assert len(held)==303 and all(r['pass'] for r in held),'Every held physical guard must still pass'
        assert all(not old['code_differences']((marker['frozenReset'] if n.name=='reset' else original if n.name=='mine_state' else g[n.name]).__code__,fresh[n.name].__code__) for n in nodes)
        prepared=runpy.run_path(str(W/'scripts/blender/desk_axes_d1_r15_production.py'),init_globals={'nsD1':ns,'D1_PRODUCTION_AUTHORIZED':True})['prepared']
        assert prepared['productionStarted'] is False and not Path(prepared['productionCache']).exists()
        report['unchangedOriginalRunnerPreflight']=prepared
        assert identities==[o.as_pointer() for o in d.SC.objects] and g['_VIS_QUEUE'] is None
        ns['mine_state']=g['mine_state'];ns['D1_WATER_CENTER_V4']={'helperSha256':sha(__file__),'frozenMineState':original,'wrapper':g['mine_state'],'evidence':str(EVIDENCE),'physicalEvidence':str(PHYSICAL),'intentEvidence':str(INTENT)}
        installed=True;report['status']='PASS: explicit water-center derivative, intended centers36, strict unaffected/repeat16, held303 and unchanged original preflight; no render'
        return ns
    except BaseException as e:
        report['status']='FAIL: v4 not installed, original v3 bindings retained; no render';report['error']={'type':type(e).__name__,'message':str(e)};raise
    finally:
        if changed and not installed:g['mine_state']=original
        assert identities==[o.as_pointer() for o in d.SC.objects] and g['_VIS_QUEUE'] is None
        for p,h in old['FROZEN'].items():assert sha(p)==h
        bpy.context.window.scene=old_scene
        report['installed']=installed;report['seconds']=round(time.time()-started,3)
        EVIDENCE.write_text(json.dumps(report,ensure_ascii=False,indent=1))
        print('D1 WATER DERIVATIVE V4',report['status'],str(EVIDENCE),flush=True)

def render_probe(ns,authorized=False):
    assert authorized is True,'Only root may queue the three actual water probes'
    marker=ns['D1_WATER_CENTER_V4'];assert marker['helperSha256']==sha(__file__)
    report4=json.loads(EVIDENCE.read_text());assert report4['installed'] and report4['intentStates']==36 and report4['heldFailures']==[]
    assert not PROBE.exists() and not PROBE.is_symlink(),'Keep existing probe outputs'
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];A=g['A'];assert g['mine_state'] is marker['wrapper']
    original=runpy.run_path(str(W/'scripts/blender/desk_axes_d1_r15_production.py'),init_globals={'nsD1':ns,'D1_PRODUCTION_AUTHORIZED':True})
    before=original['protected_snapshot']();old_scene=bpy.context.window.scene;old_A=dict(vars(A));scene_paths={s.name:s.render.filepath for s in bpy.data.scenes}
    render=d.SC.render;settings={k:getattr(render,k) for k in ('filepath','resolution_x','resolution_y','resolution_percentage')};old_format=render.image_settings.file_format;old_samples=d.SC.eevee.taa_render_samples
    out=PROBE/'blender/preview';started=time.time();report={'episode':'D-1','kind':'Three actual canonical-main water probes only; not final MP4','helperSha256':sha(__file__),'times':[0.,20.,403.3],'status':'IN PROGRESS','actualImages':[]}
    try:
        PROBE.mkdir();A.cache=str(PROBE);A.out=str(out);A.times='0,20,403.3';A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16;A.anchors_only=False
        bpy.context.window.scene=d.SC;render.resolution_x=1080;render.resolution_y=1920;render.resolution_percentage=100;render.image_settings.file_format='JPEG';d.SC.eevee.taa_render_samples=16
        g['main']()
        for t in report['times']:
            p=out/('%05d.jpg'%round(t*30));assert p.is_file() and not p.is_symlink() and p.stat().st_size>1000
            report['actualImages'].append({'time':t,'path':str(p),'sha256':sha(p),'bytes':p.stat().st_size,'actuallyViewed':False})
        report['status']='Three actual water probes rendered; actual visual review pending'
        return report
    except BaseException as e:
        report['status']='FAIL: no production started';report['error']={'type':type(e).__name__,'message':str(e)};raise
    finally:
        vars(A).clear();vars(A).update(old_A)
        for k,v in settings.items():setattr(render,k,v)
        render.image_settings.file_format=old_format;d.SC.eevee.taa_render_samples=old_samples
        for s in bpy.data.scenes:
            if s.name in scene_paths:assert s.render.filepath==scene_paths[s.name]
        bpy.context.window.scene=old_scene
        after=original['protected_snapshot']();report['oldAndOtherEpisodeSampledFilesUnchanged']=all(after.get(p)==v for p,v in before.items());report['protectedSampledFiles']=len(before)
        report['seconds']=round(time.time()-started,3)
        (PROBE/'d1-water-v4-probe.json').write_text(json.dumps(report,ensure_ascii=False,indent=1))
        assert report['oldAndOtherEpisodeSampledFilesUnchanged']
