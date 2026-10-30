"""Root-queued, read-only namespace diagnosis. Import is inert; zero GPU.

Never invoke main/apply/pose/update/render, rebind a runtime name, change scene,
or create a model. Only inspect original function code, globals/closure identity
and the preserved cancellation wrapper, then write one fresh diagnostic JSON.
The old B7 helper and every existing render/media/input remain unchanged.
"""
import ast
import hashlib
import json
import os
from pathlib import Path
import time
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
STAGE=W/'scripts/blender/desk_b1v1.py'
DISPATCHER=W/'scripts/blender/desk_axes_dispatcher.py'
OLD_B7=W/'scripts/blender/desk_axes_b1_sixth_needle_carry_b7_20261025.py'
OUTPUT=W/'outputs/axes-20261023/b1-b7-runtime-namespace-diagnostic-20261025.json'
PINS={STAGE:'7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4',
 DISPATCHER:'554b84d1391d9d206e22c080e78183aa85875572a562dbfbf7d48e8a1e7d052a',
 OLD_B7:'d1736e949348256273198cc181bfc2abe42125f9b8139b8bb466867dc8bc1e54'}

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def bindings(g):return {str(k):id(v)for k,v in g.items()}
def code_children(code):return {c.co_name:c for c in code.co_consts if isinstance(c,types.CodeType)}
def function_info(fn):
    if not isinstance(fn,types.FunctionType):return {'isPythonFunction':False,'type':type(fn).__name__,'identity':id(fn)}
    return {'isPythonFunction':True,'identity':id(fn),'globalsIdentity':id(fn.__globals__),'codeIdentity':id(fn.__code__),
      'name':fn.__name__,'qualname':fn.__qualname__,'filename':fn.__code__.co_filename,'firstLine':fn.__code__.co_firstlineno,
      'freevars':list(fn.__code__.co_freevars),'closureCellCount':len(fn.__closure__ or ()),'axesGuarded':getattr(fn,'_axes_guarded',False)}

def run(ns,authorized=False,*,expected_helper_sha256):
    assert authorized is True and isinstance(ns,dict)
    assert sha(__file__)==expected_helper_sha256 and len(expected_helper_sha256)==64
    assert not os.path.lexists(OUTPUT),'Never overwrite prior diagnostic evidence'
    for p,h in PINS.items():assert sha(p)==h,('Input changed',str(p))
    started=time.time();ns_before=bindings(ns)
    main=ns.get('main');assert isinstance(main,types.FunctionType),'Cannot identify runtime without main'
    g=main.__globals__;g_before=bindings(g)
    apply=g.get('apply');pose=g.get('pose_b1')
    tree=ast.parse(STAGE.read_text(),str(STAGE));defs=[n for n in tree.body if isinstance(n,ast.FunctionDef)]
    # Compilation creates code objects only. No original definition or body is executed.
    expected=code_children(compile(ast.Module(body=defs,type_ignores=[]),str(STAGE),'exec'))
    dtree=ast.parse(DISPATCHER.read_text(),str(DISPATCHER));dguard=next(n for n in dtree.body if isinstance(n,ast.FunctionDef)and n.name=='_axes_guard')
    guard_outer=code_children(compile(ast.Module(body=[dguard],type_ignores=[]),str(DISPATCHER),'exec'))['_axes_guard']
    guard_code=code_children(guard_outer)['guarded']
    closure={}
    if isinstance(apply,types.FunctionType):
        for name,cell in zip(apply.__code__.co_freevars,apply.__closure__ or ()):
            try:closure[name]=cell.cell_contents
            except ValueError:closure[name]=None
    original=closure.get('original')
    guarded=isinstance(apply,types.FunctionType)and apply.__code__==guard_code and getattr(apply,'_axes_guarded',False)is True
    ag=apply.__globals__ if isinstance(apply,types.FunctionType)else{}
    checks={
      'mainBindingIsTheSubmittedMain':g.get('main')is main,
      'stagePathExact':Path(g.get('__file__','')).resolve()==STAGE,
      'applyAndPoseBothDirectlyUseMainGlobals':isinstance(apply,types.FunctionType)and apply.__globals__ is g and isinstance(pose,types.FunctionType)and pose.__globals__ is g,
      'applyIsExactOriginalCode':isinstance(apply,types.FunctionType)and apply.__code__==expected['apply'],
      'applyIsExactPinnedDispatcherCancellationGuard':guarded,
      'guardClosureHasOnlyOriginal':set(closure)=={'original'},
      'guardOriginalIsPythonFunction':isinstance(original,types.FunctionType),
      'guardOriginalUsesMainGlobals':isinstance(original,types.FunctionType)and original.__globals__ is g,
      'guardOriginalIsExactStageApplyCode':isinstance(original,types.FunctionType)and original.__code__==expected['apply'],
      'guardGlobalSessionIsItsActualGlobals':ag.get('_AXES_SESSION')is ag,
      'guardRootPathExact':Path(ag.get('_AXES_ROOT','')).resolve()==Path('/private/tmp/ys/axes-active-queue'),
      'guardFactoryIsExactPinnedDispatcherCode':isinstance(ag.get('_axes_guard'),types.FunctionType)and ag['_axes_guard'].__globals__ is ag and ag['_axes_guard'].__code__==guard_outer,
      'poseUsesMainGlobals':isinstance(pose,types.FunctionType)and pose.__globals__ is g,
      'snapshotApplyIsGuardOriginal':ns.get('apply')is original,
    }
    original_functions=[]
    for n in defs:
        bound=g.get(n.name);resolved=original if n.name=='apply'and guarded else bound
        original_functions.append({'name':n.name,'binding':function_info(bound),'resolvedOriginal':function_info(resolved),
          'originalCodeEqualsPinnedCompiledDefinition':isinstance(resolved,types.FunctionType)and resolved.__code__==expected[n.name],
          'resolvedGlobalsIsMainGlobals':isinstance(resolved,types.FunctionType)and resolved.__globals__ is g,
          'snapshotBindingIsResolvedOriginal':ns.get(n.name)is resolved})
    required_keys=['d','bpy','ext','PARTS','GROUPS','CHILDREN','ALL','BASE','DATA','CUES','A','SPANS','EVENTS','VISIBILITY_STATS']
    identities=[{'key':k,'presentInMain':k in g,'presentInSnapshot':k in ns,'sameObject':k in g and k in ns and g[k]is ns[k],
       'mainIdentity':id(g[k])if k in g else None,'snapshotIdentity':id(ns[k])if k in ns else None}for k in required_keys]
    d=g.get('d');scene=getattr(d,'SC',None);bpy=g.get('bpy')
    camera=getattr(d,'CAM',None);data=getattr(d,'CAM_D',None);pose_cam=getattr(d,'pose_cam',None)
    checks.update(
      allOriginalEpisodeFunctionsResolvedExactly=all(r['originalCodeEqualsPinnedCompiledDefinition']and r['resolvedGlobalsIsMainGlobals']for r in original_functions),
      allRequiredSnapshotModelObjectsIdentical=all(r['sameObject']for r in identities),
      sceneCameraIsOriginalSharedCamera=scene is not None and scene.camera is camera,
      sharedCameraFunctionOwnsExactScene=isinstance(pose_cam,types.FunctionType)and pose_cam.__globals__.get('SC')is scene and pose_cam.__globals__.get('CAM')is camera and pose_cam.__globals__.get('CAM_D')is data,
      visibilityQueueIsClosed=g.get('VIS_QUEUE','missing')is None,
      visibilityDiagnosticsRemainDisabled=g.get('CHECK_VISIBILITY','missing')is False)
    alternatives=[]
    for label,fn in [('main',main),('apply',apply),('pose_b1',pose),('guard.original',original)]:
      if isinstance(fn,types.FunctionType):alternatives.append({'source':label,'globalsIdentity':id(fn.__globals__),'sameAsMain':fn.__globals__ is g,'stageFile':str(fn.__globals__.get('__file__',''))})
    contract=['mainBindingIsTheSubmittedMain','stagePathExact','applyIsExactPinnedDispatcherCancellationGuard','guardClosureHasOnlyOriginal','guardOriginalIsPythonFunction','guardOriginalUsesMainGlobals','guardOriginalIsExactStageApplyCode','guardGlobalSessionIsItsActualGlobals','guardRootPathExact','guardFactoryIsExactPinnedDispatcherCode','poseUsesMainGlobals','allOriginalEpisodeFunctionsResolvedExactly','allRequiredSnapshotModelObjectsIdentical','sceneCameraIsOriginalSharedCamera','sharedCameraFunctionOwnsExactScene','visibilityQueueIsClosed','visibilityDiagnosticsRemainDisabled']
    verified=all(checks[k]for k in contract)
    checks['runtimeNamespaceBindingsUnchanged']=bindings(g)==g_before
    checks['snapshotNamespaceBindingsUnchanged']=bindings(ns)==ns_before
    checks['pinnedSourceFileBytesUnchanged']=all(sha(p)==h for p,h in PINS.items())and sha(__file__)==expected_helper_sha256
    assert checks['runtimeNamespaceBindingsUnchanged']and checks['snapshotNamespaceBindingsUnchanged']and checks['pinnedSourceFileBytesUnchanged']
    report={'episode':'B-1','kind':'Read-only actual runtime global/closure identity diagnostic','helper':str(Path(__file__).resolve()),'helperSha256':expected_helper_sha256,
      'inputSha256':{str(p):h for p,h in PINS.items()},'snapshotIdentity':id(ns),'mainGlobalsIdentity':id(g),'snapshotIsMainActualGlobals':ns is g,
      'checks':checks,'namespaceContractVerified':verified,'contractChecks':contract,'violations':[k for k in contract if not checks[k]],
      'bindingIdentityDifferences':[k for k in sorted(set(ns)|set(g))if k not in ns or k not in g or ns[k]is not g[k]],
      'actualFunctionGlobalPointers':alternatives,'applyBinding':function_info(apply),'guardOriginal':function_info(original),'originalFunctions':original_functions,'modelIdentityChecks':identities,
      'causeIfVerified':'The B7 assertion wrongly rejects the existing exact cancellation-guard closure. Its original apply and every original episode function use main.__globals__; the wrapper itself intentionally uses dispatcher globals. No namespace reconstruction is needed.',
      'proposedFutureFixIfVerified':'NEW B7 v2 must resolve and verify the exact pinned wrapper+closure, then retain guarded apply calls and namespace identity. In original-function AST verification only apply is compared through this validated original; no original code/threshold/state is waived. Preserve this old diagnostic and helper.',
      'gpuCalls':0,'originalModelFunctionCalls':0,'viewLayerUpdates':0,'sceneContextChanges':0,'runtimeRebindings':0,'renderOrEncodePerformed':False,'existingFilesModified':False,
      'auditOrProbePerformed':False,'finalAcceptance':False,'seconds':round(time.time()-started,3)}
    with OUTPUT.open('x')as f:json.dump(report,f,ensure_ascii=False,indent=1,allow_nan=False);f.write('\n')
    print(json.dumps({'diagnostic':str(OUTPUT),'sha256':sha(OUTPUT),'namespaceContractVerified':verified,'violations':report['violations'],'zeroGPU':True,'noAuditOrProbe':True,'finalAcceptance':False}),flush=True)
    return report
