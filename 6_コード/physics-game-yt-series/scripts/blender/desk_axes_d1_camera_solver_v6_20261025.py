"""Root-only fixed-camera solver derivative; import is inert.

Actual122 failed before pixels because a moving horse's union was fitted to
at most65%, not each horse pose. Only horse-close union-fit search is extended;
the accepted camera must still pass every actual state at both original1%
approach endpoints under unchanged40--70/1550/critical1100 limits. Angles,
model/hand/source states, word times, and stopped-camera behavior stay fixed.
"""
import hashlib
import json
from pathlib import Path
import runpy
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
BASE=W/'scripts/blender/desk_axes_d1_verified_v5_adapters_20261025.py'
BASE_SHA='f518e79055a897c63d2c5a089abad0d6f8725926f9ab7032ba92d0795e81f464'
CAMERA=W/'scripts/blender/desk_axes_d1_four_cue_camera_20261025.py'
CAMERA_SHA='9624c1496089b41d22e7b2321515a7fec2847506685e24d64726259e48c37e00'
FAILED=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v5-20261025/audit/report.json')
FAILED_SHA='e6b3bc72417f173416f0b05cd115efc8a40ad60c3c9c4be5c79a9e7f5991f5a4'
OUT=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v6-20261025')

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def adapted_camera_source():
    original=CAMERA.read_text();text=original;changes=[]
    def replace(a,b):
        nonlocal text
        assert text.count(a)==1,('Nonunique solver boundary',a[:80]);text=text.replace(a,b,1);changes.append((a,b))
    replace('attempts=[];fitted={}',"attempts=[];fitted={};report['cameraFitAttempts']=attempts")
    replace('for target in (.60,.55,.65,.50,.45):',
        "for target in ((.60,.55,.65,.50,.45,.70,.72,.74,.76,.78,.80,.82,.84,.86,.88,.90) if name=='horse-close' else (.60,.55,.65,.50,.45)):")
    replace('for cy in (700,650,750,600,800):',
        "for cy in ((700,650,750,600,800,850,900,950) if name=='horse-close' else (700,650,750,600,800)):")
    replace("""                    tested=[]
                    # Identical evaluated world-vertex bytes have identical
                    # projected bounds. Every output remains recorded below.
                    pairs={(r['primary'],r['critical'])for r in all_state_rows.values()if r['phase']==name}
                    for primary,critical in pairs:
                        for fraction in (1.,1.01):
                            try:
                                q=p[:];q[3]*=fraction;camera(q);b=box(clouds[primary]);c=box(clouds[critical])if critical else None
                                tested.append(quality(b)and quality(c,True))
                            except AssertionError:tested.append(False)
                    trial.update(pose=p,allStatesAndApproachEndpointsPass=all(tested))""",
        """                    tested=[];measurements=[];projection_failures=[]
                    # Union width is only a numerical fit aid. Acceptance is
                    # still every actual mesh state and both original endpoints.
                    pairs={}
                    for j,r in all_state_rows.items():
                        if r['phase']==name:pairs.setdefault((r['primary'],r['critical']),[]).append(j)
                    for (primary,critical),js in pairs.items():
                        for fraction in (1.,1.01):
                            try:
                                q=p[:];q[3]*=fraction;camera(q);b=box(clouds[primary]);c=box(clouds[critical])if critical else None
                                passed=quality(b)and quality(c,True);tested.append(passed)
                                measurements.append({'firstOutputFrame':min(js),'lastOutputFrame':max(js),'outputCount':len(js),'approachFraction':fraction,'primaryWidth':(b[2]-b[0])/1080,'primaryBox':b,'criticalBox':c,'pass':passed})
                            except AssertionError as error:
                                tested.append(False);projection_failures.append({'firstOutputFrame':min(js),'lastOutputFrame':max(js),'approachFraction':fraction,'error':str(error)[:160]})
                    summary={'uniqueGeometryStates':len(pairs),'endpointTests':len(tested),'failedEndpointTests':sum(not v for v in tested),'projectionFailureCount':len(projection_failures),'projectionFailures':projection_failures[:2]}
                    if measurements:
                        summary.update(minimumWidthState=min(measurements,key=lambda r:r['primaryWidth']),maximumWidthState=max(measurements,key=lambda r:r['primaryWidth']),leftmostState=min(measurements,key=lambda r:r['primaryBox'][0]),rightmostState=max(measurements,key=lambda r:r['primaryBox'][2]),topmostState=min(measurements,key=lambda r:r['primaryBox'][1]),bottommostState=max(measurements,key=lambda r:r['primaryBox'][3]))
                        critical_rows=[r for r in measurements if r['criticalBox']is not None]
                        if critical_rows:summary['lowestCriticalState']=max(critical_rows,key=lambda r:r['criticalBox'][3])
                    trial.update(pose=p,actualStateSummary=summary,allStatesAndApproachEndpointsPass=all(tested))""")
    inverse=text
    for a,b in reversed(changes):assert inverse.count(b)==1;inverse=inverse.replace(b,a,1)
    assert inverse==original
    return text,{'exactSolverBoundaries':len(changes),'inverseByteIdenticalTo9624':True,
        'onlyHorseCloseFitAidTargetsAndCentersExtended':True,'allActualStateQualityLimitsUnchanged':True,
        'cameraAnglesUnchanged':True,'modelHandAndSourceStateChanges':0,
        'fixedCameraAndOriginalOnePercentApproachUnchanged':True,
        'failedActual122Report':str(FAILED),'failedActual122ReportSha256':FAILED_SHA,
        'unionTargetIsNotPerStatePrimaryWidth':True,'actualTrialMetricsRetainedOnFailure':True}

def run_camera(ns,authorized=False,mode='audit',*,recovery_diagnostic_sha256='5502cee07b7b6107dd94f2783e0807a8f202334b9e016c5b366b59ed28c3cc5d',
        audit_report_sha256=None,probe_report_sha256=None,root_visual_receipt=None,root_visual_receipt_sha256=None):
    assert authorized is True and mode in('audit','probe','render')
    pins={str(BASE):BASE_SHA,str(CAMERA):CAMERA_SHA,str(FAILED):FAILED_SHA,str(Path(__file__).resolve()):sha(__file__)}
    for p,h in pins.items():assert sha(p)==h,p
    failed=json.loads(FAILED.read_text());assert failed['renders']==0 and failed['helperSha256']==BASE_SHA
    assert failed['error']['message']=="('No fixed camera satisfies every actual state; no render', 'horse-close')"
    assert all(v is True for v in failed['protectionChecks'].values())
    text,metadata=adapted_camera_source();real=runpy.run_path
    def private_run_path(path,*args,**kwargs):
        if Path(path).resolve()==CAMERA:
            assert not args and not kwargs;scope={'__name__':'d1_camera_solver_v6_private','__file__':str(CAMERA)}
            exec(compile(text,str(CAMERA)+' [four reversible solver boundaries]','exec'),scope);return scope
        return real(path,*args,**kwargs)
    base=real(str(BASE));scope=base['_rebind']({'run':base['run_camera']},{'CAMERA_OUT':OUT,'__file__':str(Path(__file__).resolve()),'runpy':types.SimpleNamespace(run_path=private_run_path)})
    original_proof=scope['_proof']
    def proof(role,protected):
        protected.update(pins)
        return{**original_proof(role,protected),'fixedCameraSolverDerivative':{**metadata,'priorRuntimeAdapter':str(BASE),'priorRuntimeAdapterSha256':BASE_SHA}}
    scope['_proof']=proof
    try:
        return scope['run_camera'](ns,authorized=True,mode=mode,recovery_diagnostic_sha256=recovery_diagnostic_sha256,
            audit_report_sha256=audit_report_sha256,probe_report_sha256=probe_report_sha256,
            root_visual_receipt=root_visual_receipt,root_visual_receipt_sha256=root_visual_receipt_sha256)
    finally:
        for p,h in pins.items():assert sha(p)==h,p
