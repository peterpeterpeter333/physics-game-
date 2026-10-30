"""Inert read-only runtime code evidence, not current-file provenance fiction.
Root alone calls run. No model/pose/update/render/rebind or historical reload.
Pure retained plan10700 verification is the only episode-function invocation.
"""
import ast,hashlib,json,marshal,os,time,types
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
STAGE=W/'scripts/blender/desk_b1v1.py';DISPATCHER=W/'scripts/blender/desk_axes_dispatcher.py'
DIAG=W/'outputs/axes-20261023/b1-b7-runtime-namespace-diagnostic-20261025.json'
PLAN=Path('/private/tmp/ys/ys-chain-b1v1-retained-plan-20261024.json')
OUT=W/'outputs/axes-20261023/b1-b7-runtime-namespace-diagnostic-v2-20261025.json'
CANDIDATES={
 'current':STAGE,
 'saved-r7':Path('/private/tmp/ys/ys-chain-b1v1/blender/desk_b1v1-r7-source.py'),
 'early-checkpoint':W/'outputs/axes-20261023/checkpoint/source/scripts/blender/desk_b1v1.py'}
PINS={STAGE:'7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4',
 DISPATCHER:'554b84d1391d9d206e22c080e78183aa85875572a562dbfbf7d48e8a1e7d052a',
 DIAG:'23db067750d03c05add9accae86506b80219e894f021794739396d5ade4ec321',
 PLAN:'8063b1dc98a775067e7f84a77d3c8b898f0edeaec3740bebc7b9355b1dbdb146',
 CANDIDATES['saved-r7']:'6d20223baeed285bf2a161288b1b240a23a92ecefbb88cb5e0487e9bcd1e0a9a',
 CANDIDATES['early-checkpoint']:'611483728e6c8b75b3768f90f0f79a4c5b1c83cbad60de6457bf69980fa095ad',
 W/'scripts/blender/desk_axes_b1_r7_trial.py':'32e549ef80f9745963813d47d1386fc1a622559ace1683b829e6144a35901a3a',
 W/'scripts/blender/desk_axes_b1_r8_trial.py':'12c13b4b87956bc4956ce30b6f23590f316a0a1d770430eb3c5f87061a5a5089',
 W/'scripts/blender/desk_axes_b1_context_proof.py':'1dac47b6c094742e4f5f26d8b26b0be670314740c3872c3023e377ffcb3883cd',
 Path('/private/tmp/ys/ys-chain-b1v1/blender/b1-r6-trial-record.json'):'128e98ced961f366f94e52ffb2ccb880f92fae669446b8a3971fa1ecb66871a0'}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def jsha(x):return hashlib.sha256(json.dumps(x,sort_keys=True,separators=(',',':'),allow_nan=False).encode()).hexdigest()
def bindings(g):return {str(k):id(v)for k,v in g.items()}
def const(x):
    if isinstance(x,types.CodeType):return {'code':payload(x)}
    if isinstance(x,bytes):return {'type':'bytes','hex':x.hex()}
    if isinstance(x,(tuple,frozenset)):
        rows=[const(v)for v in x]
        if isinstance(x,frozenset):rows.sort(key=lambda v:json.dumps(v,sort_keys=True))
        return {'type':type(x).__name__,'items':rows}
    if x is None or x is Ellipsis or isinstance(x,(str,bool,int,float,complex)):
        return {'type':type(x).__name__,'repr':repr(x)}
    raise TypeError(('Unexpected compiled constant',type(x).__name__))
def payload(c):
    return {'co_code':c.co_code.hex(),'co_consts':[const(x)for x in c.co_consts],
      **{k:getattr(c,k)for k in ['co_argcount','co_posonlyargcount','co_kwonlyargcount','co_nlocals','co_stacksize','co_flags']},
      **{k:list(getattr(c,k))for k in ['co_names','co_varnames','co_freevars','co_cellvars']},
      'co_exceptiontable':getattr(c,'co_exceptiontable',b'').hex()}
def description(c):
    return {'semanticSha256ExcludingOnlySourceLocation':jsha(payload(c)),'fullCodeMarshalSha256':hashlib.sha256(marshal.dumps(c)).hexdigest(),
      'co_filename':c.co_filename,'co_firstlineno':c.co_firstlineno,'co_linetable':getattr(c,'co_linetable',b'').hex(),'co_lnotab':c.co_lnotab.hex(),
      'semanticFields':payload(c)}
def children(c):return {v.co_name:v for v in c.co_consts if isinstance(v,types.CodeType)}
def compiled_defs(p):
    defs=[n for n in ast.parse(p.read_text(),str(p)).body if isinstance(n,ast.FunctionDef)]
    return children(compile(ast.Module(body=defs,type_ignores=[]),str(DISPATCHER if p==DISPATCHER else STAGE),'exec'))
def run(ns,authorized=False,*,expected_helper_sha256):
    assert authorized is True and isinstance(ns,dict)and sha(__file__)==expected_helper_sha256
    assert not os.path.lexists(OUT)
    for p,h in PINS.items():assert sha(p)==h,p
    initial=json.loads(DIAG.read_text());g=ns['main'].__globals__;before=bindings(g);snapshot_before=bindings(ns)
    assert id(g)==initial['mainGlobalsIdentity']and id(ns)==initial['snapshotIdentity'],'Not the same actual111 namespace'
    guard=g['apply'];assert isinstance(guard,types.FunctionType)
    closure=dict(zip(guard.__code__.co_freevars,(cell.cell_contents for cell in guard.__closure__ or ())))
    dc=compiled_defs(DISPATCHER)['_axes_guard'];expected_guard=children(dc)['guarded'];original=closure.get('original');ag=guard.__globals__
    assert guard.__code__==expected_guard and set(closure)=={'original'}and getattr(guard,'_axes_guarded',False)is True
    assert isinstance(original,types.FunctionType)and original.__globals__ is g and ag.get('_AXES_SESSION')is ag
    assert ag['_axes_guard'].__code__==dc and Path(ag['_AXES_ROOT'])==Path('/private/tmp/ys/axes-active-queue')
    candidates={label:compiled_defs(p)for label,p in CANDIDATES.items()}
    expected_names=set(candidates['current']);rows=[]
    for name in sorted(expected_names):
        binding=g[name];fn=original if name=='apply'else binding
        assert isinstance(fn,types.FunctionType)and fn.__globals__ is g
        candidate=[]
        for label,defs in candidates.items():
            if name not in defs:continue
            c=defs[name];same=payload(fn.__code__)==payload(c)
            fields={k:payload(fn.__code__)[k]==payload(c)[k]for k in payload(c)}
            candidate.append({'label':label,'file':str(CANDIDATES[label]),'sourceSha256':PINS[CANDIDATES[label]],'compiledFirstLine':c.co_firstlineno,
                'fullCodeEquality':fn.__code__==c,'allSemanticFieldsExact':same,'semanticFieldEquality':fields,'compiledSemanticSha256':jsha(payload(c))})
        rows.append({'name':name,'bindingIdentity':id(binding),'resolvedOriginalIdentity':id(fn),'runtimeGlobalsIdentity':id(fn.__globals__),
          'snapshotBindingIsResolvedOriginal':ns.get(name)is fn,'snapshotFunctionCode':description(ns[name].__code__)if isinstance(ns.get(name),types.FunctionType)else None,
          'runtimeCode':description(fn.__code__),'candidateComparisons':candidate})
    retained=json.loads(PLAN.read_text());actual=[list(g['plan'](j))for j in range(10700)]
    assert actual==retained['plans'],'Actual retained10700 plan changed; never recalculate a replacement plan'
    models=['d','bpy','ext','PARTS','GROUPS','CHILDREN','ALL','BASE','DATA','CUES','A','SPANS','VISIBILITY_STATS']
    identity=[{'key':k,'snapshotIdentity':id(ns[k]),'runtimeIdentity':id(g[k]),'sameObject':ns[k]is g[k]}for k in models]
    assert all(r['sameObject']for r in identity)
    event={'snapshotIdentity':id(ns['EVENTS']),'runtimeIdentity':id(g['EVENTS']),'sameObject':ns['EVENTS']is g['EVENTS'],
      'sameValues':ns['EVENTS']==g['EVENTS'],'snapshotValues':ns['EVENTS'],'runtimeValues':g['EVENTS'],
      'documentedRebindSource':str(W/'scripts/blender/desk_axes_b1_r8_trial.py'),'notRequiredToBeSnapshotIdentical':True}
    report={'episode':'B-1','kind':'Actual mixed runtime code freeze and historical comparisons; no reload','helper':str(Path(__file__).resolve()),'helperSha256':expected_helper_sha256,
      'inputSha256':{str(p):h for p,h in PINS.items()},'initialActual111EvidenceSha256':PINS[DIAG],'actualMainGlobalsIdentity':id(g),'actualSnapshotIdentity':id(ns),
      'exactCancellationWrapper':description(guard.__code__),'guardOriginalUsesActualMainGlobals':True,'guardClosureKeys':sorted(closure),'guardOriginalFunctionIdentity':id(original),
      'runtimeFunctions':rows,'runtimeFunctionSemanticDigest':jsha({r['name']:r['runtimeCode']['semanticSha256ExcludingOnlySourceLocation']for r in rows}),
      'runtimeFunctionMarshalDigest':jsha({r['name']:r['runtimeCode']['fullCodeMarshalSha256']for r in rows}),
      'modelObjectIdentity':identity,'EVENTS':event,'all10700RetainedPlansExact':True,'actualPlanSha256':jsha(actual),
      'historicalReplacementEvidence':[{'source':str(W/'scripts/blender/desk_axes_b1_r7_trial.py'),'names':['terrella_state'],'snapshotAlsoRebound':True},
        {'source':str(W/'scripts/blender/desk_axes_b1_r8_trial.py'),'names':['hero_points','globe_state','EVENTS'],'snapshotFunctionBindingsIntentionallyNotRebound':True},
        {'source':str(W/'scripts/blender/desk_axes_b1_context_proof.py'),'names':['main','catalog','write_problem'],'snapshotAlsoRebound':True}],
      'sourceAtR6LoadKnownSha256':'10cc17e99f3bfa26a8bebfa07bb8b5d511313d567509a1c89d2c1aa7c22ad8d3','sourceAtR6LoadFullSnapshotFound':False,
      'currentWholeStageASTIsNotTheActualRuntimeProvenance':True,'controlsNeededBeforeAnyGeometryClaim':True,
      'noRuntimeRebindings':bindings(g)==before and bindings(ns)==snapshot_before,'pinnedInputsUnchanged':all(sha(p)==h for p,h in PINS.items()),
      'purePlanCalls':10700,'modelPoseUpdateRenderOrGPUCalls':0,'finalAcceptance':False}
    assert report['noRuntimeRebindings']and report['pinnedInputsUnchanged']
    with OUT.open('x')as f:json.dump(report,f,ensure_ascii=False,indent=1,allow_nan=False);f.write('\n')
    print(json.dumps({'path':str(OUT),'sha256':sha(OUT),'runtimeFunctionSemanticDigest':report['runtimeFunctionSemanticDigest'],'all10700RetainedPlansExact':True,'zeroGPU':True,'finalAcceptance':False}),flush=True)
    return report
