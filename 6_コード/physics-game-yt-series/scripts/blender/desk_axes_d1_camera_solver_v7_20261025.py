"""Root-only camera solver after actual126; imports have no scene effects.

Only the horse close-up may use a different, single fixed viewing angle.
The horse's125degree walk, all models/hands/times and the original1% approach
are unchanged. Original40--70/safe/critical limits remain; global motion is
additionally limited to root's10%, not the prior helper's20% ceiling.
"""
import hashlib
import json
import math
from pathlib import Path
import runpy
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
V6=W/'scripts/blender/desk_axes_d1_camera_solver_v6_20261025.py'
V6_SHA='73ec26d906a244ef325329786564332362996df20702f1c18defdf204fd2a3df'
BASE=W/'scripts/blender/desk_axes_d1_verified_v5_adapters_20261025.py'
BASE_SHA='f518e79055a897c63d2c5a089abad0d6f8725926f9ab7032ba92d0795e81f464'
CAMERA=W/'scripts/blender/desk_axes_d1_four_cue_camera_20261025.py'
CAMERA_SHA='9624c1496089b41d22e7b2321515a7fec2847506685e24d64726259e48c37e00'
FAILED122=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v5-20261025/audit/report.json')
FAILED122_SHA='e6b3bc72417f173416f0b05cd115efc8a40ad60c3c9c4be5c79a9e7f5991f5a4'
FAILED126=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v6-20261025/audit/report.json')
FAILED126_SHA='2e912683c9a5401a93f240b3c3508ea6345b294eb3fbeee5e3acdcc1906db14b'
OUT=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v7-20261025')

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

HORSE_SOLVER="""        def fit_horse_phase(vv,phase):
            pairs={}
            for j,r in all_state_rows.items():
                if r['phase']=='horse-close':pairs.setdefault((r['primary'],r['critical']),[]).append(j)
            def actual_trial(p):
                rows=[]
                for (primary,critical),js in pairs.items():
                    for fraction in (1.,1.01):
                        q=p[:];q[3]*=fraction;camera(q);b=box(clouds[primary]);c=box(clouds[critical])if critical else None
                        rows.append({'firstOutputFrame':min(js),'lastOutputFrame':max(js),'outputCount':len(js),'approachFraction':fraction,'primaryWidth':(b[2]-b[0])/1080,'primaryBox':b,'criticalBox':c,'pass':bool(quality(b)and quality(c,True))})
                assert rows
                return {'uniqueGeometryStates':len(pairs),'endpointTests':len(rows),'failedEndpointTests':sum(not r['pass']for r in rows),'minimumWidthState':min(rows,key=lambda r:r['primaryWidth']),'maximumWidthState':max(rows,key=lambda r:r['primaryWidth']),'leftmostState':min(rows,key=lambda r:r['primaryBox'][0]),'rightmostState':max(rows,key=lambda r:r['primaryBox'][2]),'topmostState':min(rows,key=lambda r:r['primaryBox'][1]),'bottommostState':max(rows,key=lambda r:r['primaryBox'][3]),'criticalSurfacesPresent':any(r['criticalBox']is not None for r in rows)}
            # Elevation35 first. Within each elevation tier the least yaw
            # deviation from original-142 is tried first, then larger changes.
            # Farther seeds preserve approximate framing by proportional lens;
            # they reduce close-perspective distortion, not object motion.
            for elevation in (35.,40.,45.):
                for azimuth in (-132.,-128.,-124.):
                    for seed_distance in (phase['base'][3],.24,.36):
                        seed=list(phase['base']);seed[4]=azimuth;seed[5]=elevation
                        seed[6]*=seed_distance/seed[3];seed[3]=seed_distance
                        target=.80;cy=830.
                        for iteration in range(4):
                            trial={'phase':'horse-close','target':target,'center':[540,cy],'fixedAzimuth':azimuth,'fixedElevation':elevation,'seedDistance':seed_distance,'fitIteration':iteration};attempts.append(trial)
                            try:p=fit(vv,seed,target,[540,cy]);summary=actual_trial(p)
                            except (AssertionError,ArithmeticError)as error:trial['solverFailure']=str(error)[:200];break
                            trial.update(pose=p,actualStateSummary=summary,allStatesAndApproachEndpointsPass=summary['failedEndpointTests']==0)
                            if summary['failedEndpointTests']==0:return p
                            lo=.40/summary['minimumWidthState']['primaryWidth'];hi=.70/summary['maximumWidthState']['primaryWidth']
                            trial['actualWidthScaleFeasibleInterval']=[lo,hi]
                            if lo>hi:trial['nextStep']='Try a different fixed perspective; zoom alone cannot satisfy both widths';break
                            new_target=target*math.sqrt(lo*hi)
                            # This is only a union-fit search bound, derived
                            # from the unchanged x40..1040 safety margin.
                            if new_target>.92:trial['nextStep']='Union cannot fit horizontal safety at this perspective';break
                            top=summary['topmostState']['primaryBox'][1];bottom=summary['bottommostState']['primaryBox'][3]
                            low_shift=110-top;high_shift=1550-bottom
                            if low_shift>high_shift:trial['nextStep']='Union cannot fit vertical safety at this perspective';break
                            shift=max(low_shift,min(0.,high_shift));new_cy=cy+shift
                            if abs(new_target-target)<1e-7 and abs(new_cy-cy)<.01:break
                            target=new_target;cy=new_cy
            raise AssertionError('No approved fixed horse perspective passes every original actual-state quality limit; no render')
"""

def adapted_camera_source():
    retained=runpy.run_path(str(V6));original,metadata=retained['adapted_camera_source']();text=original;changes=[]
    def replace(a,b):
        nonlocal text
        assert text.count(a)==1,('Nonunique v7 solver boundary',a[:80]);text=text.replace(a,b,1);changes.append((a,b))
    marker="        for name in dict.fromkeys(p['name']for p in definitions):"
    replace(marker,HORSE_SOLVER+marker)
    marker="            if prior:fitted[name]=prior['fixedPhasePoses'][name];continue"
    replace(marker,marker+"\n            if name=='horse-close':fitted[name]=fit_horse_phase(vv,phase);continue")
    marker="        assert motion['moving_ratio']<=.20 and motion['top_ratio']<=.20"
    replace(marker,marker+"\n        assert motion['moving_ratio']<=.10,'Root-required whole-film camera motion ceiling remains10%' ")
    inverse=text
    for a,b in reversed(changes):assert inverse.count(b)==1;inverse=inverse.replace(b,a,1)
    assert inverse==original
    return text,{**metadata,'cameraAnglesUnchanged':False,'onlyHorseCloseFitAidTargetsAndCentersExtended':False,
        'rootAuthorizedHorseFixedAngleDerivative':True,'fixedAngleSelection':'elevation35 before40/45; within a tier, smallest yaw deviation from original-142 first; original actual quality decides',
        'fixedAzimuthCandidates':[-132,-128,-124],'fixedElevationCandidates':[35,40,45],
        'originalHorseWalkModelAndTimesUnchanged':True,'originalFixedAngleSelfConstraintExplicitlyReplaced':True,
        'globalMotionMaximum':.10,'globalTopMaximum':.20,'additionalReversibleSourceBoundaries':len(changes),'v7InverseByteIdenticalToV6DerivedSource':True,
        'v6Source':str(V6),'v6SourceSha256':V6_SHA,'actual126FailedReport':str(FAILED126),'actual126FailedReportSha256':FAILED126_SHA,
        'actual126ExampleTrial':{'unionTarget':.9,'center':[540,950],'minimumAtFrame1076':.28554637921117354,'maximumAtFrame1025':.8044139674857692},
        'actual126CriticalSurfacesWereAbsent':True,'automaticPhysicalOrPixelApproval':False}

def run_camera(ns,authorized=False,mode='audit',*,recovery_diagnostic_sha256='5502cee07b7b6107dd94f2783e0807a8f202334b9e016c5b366b59ed28c3cc5d',
        audit_report_sha256=None,probe_report_sha256=None,root_visual_receipt=None,root_visual_receipt_sha256=None):
    assert authorized is True and mode in('audit','probe','render')
    pins={str(BASE):BASE_SHA,str(V6):V6_SHA,str(CAMERA):CAMERA_SHA,str(FAILED122):FAILED122_SHA,str(FAILED126):FAILED126_SHA,str(Path(__file__).resolve()):sha(__file__)}
    for p,h in pins.items():assert sha(p)==h,p
    failed=json.loads(FAILED126.read_text());assert failed['renders']==0 and failed['helperSha256']==V6_SHA
    assert failed['error']['message']=="('No fixed camera satisfies every actual state; no render', 'horse-close')"and all(v is True for v in failed['protectionChecks'].values())
    text,metadata=adapted_camera_source();real=runpy.run_path
    def private_run_path(path,*args,**kwargs):
        if Path(path).resolve()==CAMERA:
            assert not args and not kwargs;scope={'__name__':'d1_camera_solver_v7_private','__file__':str(CAMERA)}
            exec(compile(text,str(CAMERA)+' [reversible fixed-horse-view solver derivative]','exec'),scope);return scope
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
