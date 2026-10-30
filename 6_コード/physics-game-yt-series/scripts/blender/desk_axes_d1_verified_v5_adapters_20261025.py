"""Root-only fresh camera/pier adapters after actual120 strict v5 recovery.

Explicit APIs, separate fresh roots. Frozen9624 camera and4e pier computations,
geometry, source references, times and numeric quality guards stay unchanged.
Only private RECOVERY/OUT/__file__/runpy bindings, actual120 prerequisite, and
declared completion/report metadata differ. No existing source/runtime is edited.
Import is inert; root alone queues audit/probe/render after reading this file.
"""
import hashlib
import json
from pathlib import Path
import runpy
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
CAMERA=W/'scripts/blender/desk_axes_d1_four_cue_camera_20261025.py'
CAMERA_SHA='9624c1496089b41d22e7b2321515a7fec2847506685e24d64726259e48c37e00'
PIER_ADAPTER=W/'scripts/blender/desk_axes_d1_pier_contact_images_v2_20261025.py'
PIER_ADAPTER_SHA='91ac6c70b120fdf8474336381f367e939ddade202515e6feb5db7366a04b5211'
IMAGES=W/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py'
IMAGES_SHA='4e9d41accb35d8a31211a65c3ce76740a7e07dc81d021a6a2e2bc0e114b0b479'
RECOVERY=W/'scripts/blender/desk_axes_d1_pier_contact_replay_v5_20261025.py'
RECOVERY_SHA='bc91b1089c3714378cbd98bd39229f288b0e6cf7f7011a492e85d3df7cccbcf7'
DIAGNOSTIC=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v5-20261025/diagnostic/report.json')
DIAGNOSTIC_SHA='5502cee07b7b6107dd94f2783e0807a8f202334b9e016c5b366b59ed28c3cc5d'
DIAGNOSTIC_CHILD_SHA='eb198b8295a5ac2385d2a25bbbeb63e5512a4b27a9ea41c7aebd9a85ac7f5d10'
AUDIT_SHA='668208ecbd577fe5fb1ba2963f7c0f80ba9add7d1ebaa75988e019c603328e82'
CAMERA_OUT=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v5-20261025')
PIER_OUT=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-images-v5-20261025')
ORIGINAL_GUARDS=('allEntryObjectTransformsRestored','noNewGeometryRemains','runtimeBindingsUnchanged',
 'runtimeDataUnchanged','allEntryMaterialAndHighlightInputsRestored','sourcesAndProtectedInputsUnchanged',
 'allDeliveredRawShaAndStatsUnchanged','allOtherExistingSceneOutputsUnchanged','allSceneFilepathsRestored','visibilityQueueClosed')
SCENARIOS=('engine-catalog-oblique','engine-catalog-top','no-operation','exact-delivered7917','problem-challenge','problem-answer')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def pin(pins,p,h):
    p=Path(p);assert isinstance(h,str)and len(h)==64 and sha(p)==h,str(p)
    key=str(p.resolve());assert key not in pins or pins[key]==h;pins[key]=h
def verify(pins):
    for p,h in pins.items():assert sha(p)==h,p
def strict_summary(evidence):
    assert sha(evidence['path'])==evidence['sha256'];r=read(evidence['path'])
    assert r['helperSha256']==RECOVERY_SHA and r['toleranceUnchanged']==1e-9 and r['allPass']
    assert r['missingOriginalGuardNames']==[]and not r['afterOriginalCloseOffenders']and not r['afterCloseVisibilityOffenders']
    assert r['originalCloseError']is None and r['fullComponentRestorationError']is None
    assert all(r['protectionChecks'].get(k)is True for k in ORIGINAL_GUARDS)
    assert r['protectionChecks']and all(v is True for v in r['protectionChecks'].values())
    assert all(v['sameObject']for f in r['namespaceBindings'].values()for v in f.values())
    return {'helperSha256':r['helperSha256'],'allPass':True,'toleranceUnchanged':1e-9,
        'protectionChecks':r['protectionChecks'],'missingOriginalGuardNames':[],
        'afterOriginalCloseOffenderCount':0,'afterCloseVisibilityOffenderCount':0,
        'originalCloseError':None,'fullComponentRestorationError':None}

def diagnostic_pins(expected=DIAGNOSTIC_SHA):
    """Actual120 and every actual child are checked BEFORE namespace access."""
    assert expected==DIAGNOSTIC_SHA;pins={}
    for p,h in[(CAMERA,CAMERA_SHA),(PIER_ADAPTER,PIER_ADAPTER_SHA),(IMAGES,IMAGES_SHA),(RECOVERY,RECOVERY_SHA),(DIAGNOSTIC,expected),(Path(__file__).resolve(),sha(__file__))]:pin(pins,p,h)
    d=read(DIAGNOSTIC);assert d['helperSha256']==RECOVERY_SHA and d['renders']==0 and d['toleranceUnchanged']==1e-9
    assert d['allScenarioFullRestorationsPass']and not d.get('error')and not d.get('cleanupError')and d['allPinnedSourcesAndFailed117EvidenceUnchanged']
    assert tuple(d['scenarioOrder'])==SCENARIOS and tuple(r['scenario']for r in d['scenarios'])==SCENARIOS
    assert all(r['newFullRestorePass']and r['offenderCount']==r['visibilityOffenderCount']==0 for r in d['scenarios'])
    assert all(d['protectionChecks'].get(k)is True for k in ORIGINAL_GUARDS)and all(v is True for v in d['protectionChecks'].values())
    child=d['transformRestorationReport'];assert child['sha256']==DIAGNOSTIC_CHILD_SHA;pin(pins,child['path'],child['sha256']);strict_summary(child)
    assert d['normalizations']and read(child['path'])['normalizations']==d['normalizations']
    for n in d['normalizations']:
        pin(pins,n['path'],n['sha256']);r=read(n['path'])
        assert n['pass']and r['pass']and r['helperSha256']==RECOVERY_SHA and all(v is True for v in r['protectionChecks'].values())
        assert r['worldBasisTransformConstraintAssignmentsAdded']==0 and r['originalSavedVersusRestoredWorldToleranceUnchanged']==1e-9
    return pins

def _proof(role,pins):
    return {'adapter':str(Path(__file__).resolve()),'adapterSha256':sha(__file__),'role':role,
        'actual120Diagnostic':str(DIAGNOSTIC),'actual120DiagnosticSha256':DIAGNOSTIC_SHA,
        'recoveryHelper':str(RECOVERY),'recoveryHelperSha256':RECOVERY_SHA,
        'canonicalCamera':str(CAMERA),'canonicalCameraSha256':CAMERA_SHA,
        'canonicalPierPixelHelper':str(IMAGES),'canonicalPierPixelHelperSha256':IMAGES_SHA,
        'priorPierAdapter':str(PIER_ADAPTER),'priorPierAdapterSha256':PIER_ADAPTER_SHA,
        'old105SuccessNotAssumed':True,'actual120StrictSuccessRequiredBeforeNamespace':True,
        'extraProtectedInputSha256':pins,'thresholdsGeometryAndOperationTimesUnchanged':True,
        'actualPixelApprovalNotInferredFromGeometry':True,'automaticApproval':False,'finalAcceptance':False}
def _write(root,p,x,proof):
    p=Path(p);assert p.is_relative_to(root)and not p.exists()and not p.is_symlink()
    assert not any(q.is_symlink()for q in p.parents if q.exists())
    if p.name in('report.json','preflight.json','v5-adapter-completion.json'):x['verifiedV5RuntimeAdapter']=proof
    with p.open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
def _rebind(namespace,updates):
    original=namespace['run'].__globals__;scope=dict(original)
    for name,value in original.items():
        if isinstance(value,types.FunctionType)and value.__globals__ is original:
            function=types.FunctionType(value.__code__,scope,value.__name__,value.__defaults__,value.__closure__)
            function.__kwdefaults__=value.__kwdefaults__;function.__annotations__=value.__annotations__.copy()
            assert function.__code__ is value.__code__;scope[name]=function
    scope.update(updates);return scope
def _runtime(pins,images_writer=None):
    recovery=runpy.run_path(str(RECOVERY));real=runpy.run_path
    class OwnedRecovery(recovery['DeliveredReplay']):
        def __init__(self,*args,**kwargs):super().__init__(*args,**kwargs);self.protected.update(pins)
    def private_run_path(path,*args,**kwargs):
        if Path(path).resolve()==RECOVERY:
            assert not args and not kwargs;return{**recovery,'DeliveredReplay':OwnedRecovery}
        if images_writer is not None and Path(path).resolve()==IMAGES:
            assert not args and not kwargs
            image=real(path);return _rebind(image,{'write':images_writer})
        return real(path,*args,**kwargs)
    return types.SimpleNamespace(run_path=private_run_path)

def run_camera(ns,authorized=False,mode='audit',*,recovery_diagnostic_sha256=DIAGNOSTIC_SHA,
        audit_report_sha256=None,probe_report_sha256=None,root_visual_receipt=None,root_visual_receipt_sha256=None):
    assert authorized is True and mode in('audit','probe','render')
    pins=diagnostic_pins(recovery_diagnostic_sha256);proof=_proof('four-cue-camera',pins)
    writer=lambda p,x:_write(CAMERA_OUT,p,x,proof)
    scope=_rebind(runpy.run_path(str(CAMERA)),{'OUT':CAMERA_OUT,'RECOVERY':RECOVERY,'RECOVERY_SHA':RECOVERY_SHA,
        '__file__':str(Path(__file__).resolve()),'runpy':_runtime(pins),'write':writer})
    try:
        return scope['run'](ns,authorized=True,mode=mode,pier_audit_report_sha256=AUDIT_SHA,
            audit_report_sha256=audit_report_sha256,probe_report_sha256=probe_report_sha256,
            root_visual_receipt=root_visual_receipt,root_visual_receipt_sha256=root_visual_receipt_sha256)
    finally:verify(pins)

def _pier_source():
    """Metadata-only boundaries; never touch the original4e pixel functions."""
    original=PIER_ADAPTER.read_text();text=original;changes=[]
    def replace(a,b):
        nonlocal text
        assert text.count(a)==1,('Nonunique metadata boundary',a[:80]);text=text.replace(a,b,1);changes.append((a,b))
    replace("'actual105Diagnostic':str(DIAGNOSTIC),'actual105DiagnosticSha256':diagnostic_sha256,","'actual120Diagnostic':str(DIAGNOSTIC),'actual120DiagnosticSha256':diagnostic_sha256,")
    replace('actual105DiagnosticSha256=recovery_diagnostic_sha256','actual120DiagnosticSha256=recovery_diagnostic_sha256')
    replace("children.append({**evidence,'fullReport':read(evidence['path'])})","children.append({**evidence,'strictSummary':strict_summary(evidence)})")
    replace("all(c['fullReport']['allPass']and all(c['fullReport']['protectionChecks'].values())for c in children)","all(c['strictSummary']['allPass']and all(c['strictSummary']['protectionChecks'].values())for c in children)")
    replace("'v2-adapter-completion.json'","'v5-adapter-completion.json'")
    replace('assert unchanged and child_pass,completion',"assert unchanged and child_pass,{'completion':str(OUT/mode/'v5-adapter-completion.json'),'extraPinsUnchanged':unchanged,'strictChildPass':child_pass}")
    inverse=text
    for a,b in reversed(changes):assert inverse.count(b)==1;inverse=inverse.replace(b,a,1)
    assert inverse==original
    return text,{'exactMetadataBoundaries':len(changes),'inverseByteIdenticalToPriorAdapter':True,
        'fullChildReportNotRecursivelyEmbedded':True,'original4eFunctionCodeObjectsRetained':True}

def run_pier(ns,authorized=False,mode='probe',*,recovery_diagnostic_sha256=DIAGNOSTIC_SHA,
        probe_report_sha256=None,root_probe_visual_receipt=None,root_probe_visual_receipt_sha256=None):
    assert authorized is True and mode in('probe','render')
    pins=diagnostic_pins(recovery_diagnostic_sha256);text,metadata=_pier_source();proof={**_proof('three-pier-images',pins),**metadata}
    writer=lambda p,x:_write(PIER_OUT,p,x,proof)
    initial={'__name__':'d1_v5_pier_private','__file__':str(Path(__file__).resolve()),'strict_summary':strict_summary}
    exec(compile(text,str(PIER_ADAPTER)+' [private metadata-only completion derivative]','exec'),initial)
    scope=_rebind(initial,{'OUT':PIER_OUT,'RECOVERY':RECOVERY,'RECOVERY_SHA':RECOVERY_SHA,'DIAGNOSTIC':DIAGNOSTIC,
        '__file__':str(Path(__file__).resolve()),'diagnostic_pins':diagnostic_pins,'strict_summary':strict_summary,
        'runpy':_runtime(pins,writer),'write':writer})
    try:
        return scope['run'](ns,authorized=True,mode=mode,recovery_diagnostic_sha256=recovery_diagnostic_sha256,
            audit_report_sha256=AUDIT_SHA,probe_report_sha256=probe_report_sha256,
            root_probe_visual_receipt=root_probe_visual_receipt,root_probe_visual_receipt_sha256=root_probe_visual_receipt_sha256)
    finally:verify(pins)
