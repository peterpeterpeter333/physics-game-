"""Strict, root-only frozen-r15 restore plus explicit deterministic reset fix.

Requires the independent v2 diagnosis first. No threshold is relaxed. The
frozen functions/control data are AST-compiled into their OWN episode globals;
canonical shared main is AST-compiled separately into its OWN module globals.
A NEW private reset wrapper evaluates the restored BASE scale before Blender
Object.dimensions setters read it. No frozen file, model or source plan changes.
"""
import ast,hashlib,json,runpy,time,types
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-d1v1-render')
OLD=W/'scripts/blender/desk_axes_d1_r15_restore.py'
SOURCE=W/'scripts/blender/desk_d1v1.py'
DIAG=C/'d1-runtime-restore-v2-diagnostic-20261024.json'
PHYSICAL=C/'d1-semantic-physical-r15-deterministic-v3-20261024.json'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def largest_numeric(rows):return max([0.]+[x.get('absoluteDifference',0.) for x in rows if x.get('kind')=='number'])
def reset_with_evaluation(frozen_reset,bpy):
    def deterministic_reset():
        # Blender warns that consecutive dimension/scale writes need fresh
        # evaluated data. Establish the same BASE scale before each state.
        frozen_reset()
        bpy.context.view_layer.update()
    return deterministic_reset
def restore(ns,authorized=False,evidence=None):
    assert authorized is True,'Only root may queue D1 restore v3'
    target=Path(evidence or C/'d1-runtime-restore-r15-v3-20261024.json')
    assert not target.exists() and not target.is_symlink() and not PHYSICAL.exists(),'Preserve earlier evidence'
    assert sha(OLD)=='712ee8d5abb644b445d6b962429f7415e7b346239b820575cc8288948396170f'
    old=runpy.run_path(str(OLD));diag=runpy.run_path(str(W/'scripts/blender/desk_axes_d1_restore_diagnostic_v2_20261024.py'))
    diagnostic=json.loads(DIAG.read_text())
    assert diagnostic['renders']==0 and diagnostic['allOriginalBindingsRestored'] and diagnostic['sourceSha256']==old['FROZEN'][SOURCE]
    repeat_delta=max(largest_numeric(diagnostic['oldRepeat0Differences']),largest_numeric(diagnostic['newRepeat0Differences']))
    # Do not pretend this fix addresses a different kind of mismatch. Root
    # must first see actual evidence of same-function non-idempotence.
    assert repeat_delta>1e-5,'No diagnosed same-function reset/evaluation instability; do not install a speculative reset fix'
    assert not Path('/private/tmp/ys/ys-chain-d1v1-production-r15').exists(),'Never restore an in-progress production'
    for p,h in old['FROZEN'].items():assert sha(p)==h
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];old_scene=bpy.context.window.scene
    assert g['_VIS_QUEUE'] is None and g['P']['can']['can'].get('printed_label') is True
    tree=ast.parse(SOURCE.read_text());functions=[n for n in tree.body if isinstance(n,ast.FunctionDef)]
    saved={n.name:g[n.name] for n in functions};saved.update({k:g[k] for k in ['D1_POSES','SPANS','EVENTS']})
    saved_show=(d.show,d.show_tree);saved_main=d.main;identity=[o.as_pointer() for o in d.SC.objects]
    fresh={};exec(compile(ast.Module(body=functions,type_ignores=[]),str(SOURCE),'exec'),fresh)
    pure,expected=old['frozen_schedule'](d.norm);assert len(expected)==12163 and sum(p[0]=='render' for p in expected)==5070
    main_path=W/'scripts/blender/desk_lib.py';main_tree=ast.parse(main_path.read_text())
    main_nodes=[n for n in main_tree.body if isinstance(n,ast.FunctionDef) and n.name=='main'];canonical={}
    exec(compile(ast.Module(body=main_nodes,type_ignores=[]),str(main_path),'exec'),canonical)
    started=time.time();success=False;changed=False
    report={'episode':'D-1','stage':'strict r15 restoration + separate private deterministic reset derivative','startedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'sourceSha256':old['FROZEN'][SOURCE],'helperSha256':sha(__file__),'diagnosticEvidence':str(DIAG),'diagnosticSha256':sha(DIAG),'sameFunctionRepeatMaximumBeforeFix':repeat_delta,'originalProjectionTolerance':1e-5,'guardToleranceChanged':False,'sourceFilesModified':False,'modelsRebuilt':False,'renders':0,'separateRuntimeResetWrapper':{'reason':'Evaluate BASE scale restored by reset before Object.dimensions setters; fixed-time geometry must not depend on previous scene state','source':str(Path(__file__).resolve()),'sourceSha256':sha(__file__),'noTimingOrModelGeometryChangeRequested':True},'canonicalSharedMainBeforeDifferences':old['code_differences'](saved_main.__code__,canonical['main'].__code__)}
    try:
        bpy.context.window.scene=d.SC
        # Same precise precondition on BOTH sides of the restore comparison.
        # This does not compare a warmed old state with an unwarmed new one.
        changed=True;g['reset']=reset_with_evaluation(saved['reset'],bpy)
        before=old['projection_states'](g,old['TIMES']);before_repeat=old['projection_states'](g,old['TIMES'])
        report['normalizedOldRepresentativeStates']=before;report['normalizedOldRepeatStates']=before_repeat
        report['normalizedOldRepeatComponentDifferences']=[{'time':a['time'],'differences':diag['differences'](a,b)} for a,b in zip(before,before_repeat)]
        report['normalizedOldRepeatStrictChecks']=old['compare_projections'](before,before_repeat)
        exec(compile(ast.Module(body=functions,type_ignores=[]),str(SOURCE),'exec'),g)
        exec(compile(ast.Module(body=old['assignment_nodes'](tree),type_ignores=[]),str(SOURCE),'exec'),g)
        assert all(not old['code_differences'](g[n.name].__code__,fresh[n.name].__code__) for n in functions),'Every restored function must first be the exact frozen AST code'
        frozen_reset=g['reset'];g['reset']=reset_with_evaluation(frozen_reset,bpy)
        d.show=g['show_d1'];d.show_tree=g['show_tree_d1']
        # E's independent Blender 3.13 reproduction found module-vs-AST
        # PUSH_NULL placement differences. Restore the canonical AST code in
        # its original module namespace; do NOT normalize the original guard.
        exec(compile(ast.Module(body=main_nodes,type_ignores=[]),str(main_path),'exec'),d.__dict__)
        assert not old['code_differences'](d.main.__code__,canonical['main'].__code__)
        after=old['projection_states'](g,old['TIMES']);after_repeat=old['projection_states'](g,old['TIMES'])
        report['normalizedNewRepresentativeStates']=after;report['normalizedNewRepeatStates']=after_repeat
        report['normalizedOldVersusFrozenNewComponentDifferences']=[{'time':a['time'],'differences':diag['differences'](a,b)} for a,b in zip(before,after)]
        report['normalizedNewRepeatComponentDifferences']=[{'time':a['time'],'differences':diag['differences'](a,b)} for a,b in zip(after,after_repeat)]
        report['oldVersusFrozenNewStrictChecks']=old['compare_projections'](before,after)
        report['normalizedNewRepeatStrictChecks']=old['compare_projections'](after,after_repeat)
        assert g['D1_POSES']==pure['D1_POSES'] and g['SPANS']==pure['SPANS'] and g['EVENTS']==pure['EVENTS']
        plans=[g['plan_d1'](j) for j in range(12163)];assert plans==expected,'Full independent plan mismatch'
        report['independentAll12163PlanMatch']=True;report['planSha256']=old['jsha'](plans)
        report['renderFrames']=5070;report['duplicateFrames']=7093
        audit=runpy.run_path(str(W/'scripts/blender/desk_d1v1_semantic_audit_r9.py'))
        physical=audit['check'](ns,str(PHYSICAL),revision='r15 deterministic reset v3 (no camera correction yet)',expected_source=old['FROZEN'][SOURCE])
        held=[r for r in physical['rows'] if not r['cameraTransition']]
        report['newPhysicalEvidence']=str(PHYSICAL);report['newPhysicalEvidenceSha256']=sha(PHYSICAL)
        report['newPhysicalStates']=len(physical['rows']);report['newHeldStates']=len(held);report['newHeldFailures']=[r for r in held if not r['pass']]
        report['movingFailuresPreserved']=[r for r in physical['rows'] if r['cameraTransition'] and not r['pass']]
        assert len(held)==303 and all(r['pass'] for r in held),'Deterministic state fix must preserve every held physical criterion'
        assert identity==[o.as_pointer() for o in d.SC.objects] and g['_VIS_QUEUE'] is None
        # The unchanged runner is the final authority for its original code,
        # input, canonical shared-main and schedule guards. No GPU flag passed.
        prepared=runpy.run_path(str(W/'scripts/blender/desk_axes_d1_r15_production.py'),init_globals={'nsD1':ns,'D1_PRODUCTION_AUTHORIZED':True})['prepared']
        assert prepared['productionStarted'] is False and not Path(prepared['productionCache']).exists()
        report['unchangedOriginalRunnerPreflight']=prepared
        report['allFrozenFunctionsStrictCodeMatchExceptExplicitResetWrapper']=all(not old['code_differences']((frozen_reset if n.name=='reset' else g[n.name]).__code__,fresh[n.name].__code__) for n in functions)
        assert report['allFrozenFunctionsStrictCodeMatchExceptExplicitResetWrapper']
        for n in functions:ns[n.name]=g[n.name]
        for k in ['D1_POSES','SPANS','EVENTS']:ns[k]=g[k]
        ns['D1_DETERMINISTIC_RESET_V3']={'helperSha256':sha(__file__),'frozenReset':frozen_reset,'wrapper':g['reset'],'physicalEvidence':str(PHYSICAL)}
        success=True;report['status']='PASS: strict normalized restoration, repeat determinism, held303 and original runner preflight; no production started'
        return ns
    except BaseException as e:
        report['status']='FAIL: no render; original runtime bindings restored';report['error']={'type':type(e).__name__,'message':str(e)};raise
    finally:
        if changed and not success:g.update(saved);d.show,d.show_tree=saved_show;d.main=saved_main
        report['installed']=success;report['seconds']=round(time.time()-started,3)
        for p,h in old['FROZEN'].items():assert sha(p)==h
        assert identity==[o.as_pointer() for o in d.SC.objects] and g['_VIS_QUEUE'] is None
        bpy.context.window.scene=old_scene;target.write_text(json.dumps(report,ensure_ascii=False,indent=1))
        print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 RESTORE V3',report['status'],str(target),flush=True)
