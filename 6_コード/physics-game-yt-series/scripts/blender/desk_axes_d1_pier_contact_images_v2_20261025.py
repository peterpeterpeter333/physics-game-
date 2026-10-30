"""Root-only minimal adapter for frozen4e9d pier pixel code and v2 recovery.

All original function code objects are retained. Only private module globals
OUT/__file__/runpy differ. The runpy proxy recognizes exactly the original
auditor path, preserving its7e6c identity and actual668 audit bytes while
substituting the separately pinned strict-recovery class. No live module,
original source/report, model, threshold, animation or media is rewritten.
"""
import hashlib
import json
from pathlib import Path
import runpy
import time
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
ORIGINAL=W/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py'
ORIGINAL_SHA='4e9d41accb35d8a31211a65c3ce76740a7e07dc81d021a6a2e2bc0e114b0b479'
AUDITOR=W/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py'
AUDITOR_SHA='7e6c0c3dfb26427a996a1869ab13ea7f69c17b2c39784a827ee5e82dd083768a'
RECOVERY=W/'scripts/blender/desk_axes_d1_pier_contact_replay_v2_20261025.py'
RECOVERY_SHA='150a4bca4f8bd0f6c42077afb7b27d6d99f76aac6f1004a56a5b0be43441796c'
OLD=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-20261025')
AUDIT=OLD/'audit/report.json'
AUDIT_SHA='668208ecbd577fe5fb1ba2963f7c0f80ba9add7d1ebaa75988e019c603328e82'
FAILED_PROBE=OLD/'probe/report.json'
FAILED_PROBE_SHA='ed5f8d96b069c65f6bf1289d0d73c7ce7f07d538cd1f382e1b6d45b3b3aa0993'
OUT=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v2-20261025')
DIAGNOSTIC=OUT/'diagnostic/report.json'

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def write(p,x):
    p=Path(p);assert not p.exists()and not p.is_symlink()
    p.parent.mkdir(parents=True,exist_ok=True)
    with p.open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
def verify(pins):
    for p,h in pins.items():assert sha(p)==h,p

def diagnostic_pins(pin):
    """Every actual105 guard must pass before an episode namespace is opened."""
    assert isinstance(pin,str)and len(pin)==64 and sha(DIAGNOSTIC)==pin
    d=read(DIAGNOSTIC)
    assert d['helperSha256']==RECOVERY_SHA and d['renders']==0 and d['toleranceUnchanged']==1e-9
    assert not d.get('error')and not d.get('cleanupError')and d['allScenarioFullRestorationsPass']
    assert d['protectionChecks']and all(v is True for v in d['protectionChecks'].values())
    expected=['no-operation','exact-delivered7917','problem-challenge','problem-answer','engine-catalog-oblique','engine-catalog-top']
    assert [r['scenario']for r in d['scenarios']]==expected
    assert all(r['newFullRestorePass']and not r['newFullRestoreOffenders']for r in d['scenarios'])
    child=d['transformRestorationReport'];assert sha(child['path'])==child['sha256']
    c=read(child['path'])
    assert c['helperSha256']==RECOVERY_SHA and c['toleranceUnchanged']==1e-9 and c['allPass']and not c['afterOriginalCloseOffenders']
    assert c['protectionChecks']and all(v is True for v in c['protectionChecks'].values())
    assert all(v['sameObject']for f in c['namespaceBindings'].values()for v in f.values())
    return {str(DIAGNOSTIC):pin,str(child['path']):child['sha256']}

def copy_audit(diagnostic_sha256):
    """Exclusive byte copy, never a newly executed audit or a renamed source."""
    assert not any(p.is_symlink()for p in [OUT,*OUT.parents]if p.exists())
    target=OUT/'audit/report.json';record=OUT/'copied-original-audit-provenance.json'
    evidence={'originalAudit':str(AUDIT),'originalAuditSha256':AUDIT_SHA,
        'copiedAudit':str(target),'copiedAuditSha256':AUDIT_SHA,
        'auditHelperIdentityPreserved':AUDITOR_SHA,'actualOriginalAuditReexecuted':False,
        'onlyReplayRestorationClassSubstituted':True,'recoveryHelper':str(RECOVERY),'recoveryHelperSha256':RECOVERY_SHA,
        'actual105Diagnostic':str(DIAGNOSTIC),'actual105DiagnosticSha256':diagnostic_sha256,
        'oldFailedProbe':str(FAILED_PROBE),'oldFailedProbeSha256':FAILED_PROBE_SHA,
        'oldFailedPixelsAcceptedOrReused':False,'automaticApproval':False,'finalAcceptance':False}
    if record.exists():
        assert read(record)==evidence and sha(target)==AUDIT_SHA
    else:
        assert not target.exists();target.parent.mkdir(parents=True,exist_ok=True)
        with target.open('xb')as f:f.write(AUDIT.read_bytes())
        assert sha(target)==AUDIT_SHA;write(record,evidence)
    return {str(target):AUDIT_SHA,str(record):sha(record)}

def run(ns,authorized=False,mode='probe',*,recovery_diagnostic_sha256,
        audit_report_sha256=AUDIT_SHA,probe_report_sha256=None,
        root_probe_visual_receipt=None,root_probe_visual_receipt_sha256=None):
    assert authorized is True and mode in ('probe','render')
    assert audit_report_sha256==AUDIT_SHA
    pins={str(ORIGINAL):ORIGINAL_SHA,str(AUDITOR):AUDITOR_SHA,str(RECOVERY):RECOVERY_SHA,
        str(AUDIT):AUDIT_SHA,str(FAILED_PROBE):FAILED_PROBE_SHA,str(Path(__file__).resolve()):sha(__file__)}
    verify(pins)
    pins.update(diagnostic_pins(recovery_diagnostic_sha256)) # prior to any ns use
    pins.update(copy_audit(recovery_diagnostic_sha256));verify(pins)
    assert not (OUT/mode).exists(),'A fresh mode output is required; old103 is never reused'
    image=runpy.run_path(str(ORIGINAL));auditor=runpy.run_path(str(AUDITOR));recovery=runpy.run_path(str(RECOVERY))
    instances=[]
    class OwnedRecovery(recovery['DeliveredReplay']):
        def __init__(self,*args,**kwargs):
            super().__init__(*args,**kwargs);self.protected.update(pins);instances.append(self)
    real_run_path=runpy.run_path
    def private_run_path(path,*args,**kwargs):
        if Path(path).resolve()==AUDITOR:
            assert not args and not kwargs
            assert sha(AUDITOR)==AUDITOR_SHA
            return {**auditor,'DeliveredReplay':OwnedRecovery}
        return real_run_path(path,*args,**kwargs)
    original_globals=image['run'].__globals__;scope=dict(original_globals);rebound=[]
    for name,value in original_globals.items():
        if isinstance(value,types.FunctionType)and value.__globals__ is original_globals:
            function=types.FunctionType(value.__code__,scope,value.__name__,value.__defaults__,value.__closure__)
            function.__kwdefaults__=value.__kwdefaults__;function.__annotations__=value.__annotations__.copy()
            assert function.__code__ is value.__code__;scope[name]=function;rebound.append(name)
    scope.update(OUT=OUT,__file__=str(Path(__file__).resolve()),runpy=types.SimpleNamespace(run_path=private_run_path))
    assert all(scope[name].__globals__ is scope for name in rebound)
    assert scope['AUDITOR']==AUDITOR and scope['AUDITOR_SHA']==AUDITOR_SHA
    started=time.time();result=None;failure=None;completion={}
    try:
        result=scope['run'](ns,authorized=True,mode=mode,audit_report_sha256=AUDIT_SHA,
            probe_report_sha256=probe_report_sha256,root_probe_visual_receipt=root_probe_visual_receipt,
            root_probe_visual_receipt_sha256=root_probe_visual_receipt_sha256)
        return result
    except BaseException as error:
        failure=error;raise
    finally:
        children=[]
        for ctx in instances:
            evidence=ctx.transformRestorationReport
            if evidence is not None:
                assert sha(evidence['path'])==evidence['sha256']
                children.append({**evidence,'fullReport':read(evidence['path'])})
        unchanged=all(sha(p)==h for p,h in pins.items())
        child_pass=bool(instances)and len(children)==len(instances)and all(c['fullReport']['allPass']and all(c['fullReport']['protectionChecks'].values())for c in children)
        report=OUT/mode/'report.json'
        completion.update(episode='D-1',mode=mode,adapter=str(Path(__file__).resolve()),adapterSha256=sha(__file__),
            originalPixelHelper=str(ORIGINAL),originalPixelHelperSha256=ORIGINAL_SHA,
            auditIdentityAndBytesUnchanged=True,auditWasExclusivelyCopiedNotReexecuted=True,
            overriddenPrivateGlobals=['OUT','__file__','runpy.run_path only at exact AUDITOR path'],
            originalFunctionCodeObjectsRetained=True,allLocalHelperFunctionsReboundToPrivateGlobals=sorted(rebound),
            actual105DiagnosticSha256=recovery_diagnostic_sha256,extraProtectedInputSha256=pins,
            completeTransformRestorationEvidence=children,extraPinsUnchanged=unchanged,
            strictCompleteTransformRestorationPassed=child_pass,
            frozenRunReport=str(report)if report.is_file()else None,frozenRunReportSha256=sha(report)if report.is_file()else None,
            failedOld103ProbeAndPixelsPreserved=True,failedOld103PixelsReused=False,
            actualImagesRequireRootVisualApproval=True,automaticApproval=False,finalAcceptance=False,
            seconds=round(time.time()-started,3),error=None if failure is None else {'type':type(failure).__name__,'message':str(failure)})
        write(OUT/mode/'v2-adapter-completion.json',completion)
        assert unchanged and child_pass,completion
