"""Root-only broad fixed-view solver after actual130; import has no scene effects.

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
V7=W/'scripts/blender/desk_axes_d1_camera_solver_v7_20261025.py'
V7_SHA='096888fa290597d172f75cb40a5fda559d14211e3a4a8ab8788748763590ff6e'
FAILED130=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v7-20261025/audit/report.json')
FAILED130_SHA='1f478462ee07a358f086218cd2bb8bfa80864d20c35d8ea47ace827c2740e7de'
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
OUT=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v8-20261025')

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

HORSE_SOLVER="""        def fit_horse_phase(vv,phase):
            pairs={}
            for j,r in all_state_rows.items():
                if r['phase']=='horse-close':pairs.setdefault((r['primary'],r['critical']),[]).append(j)
            assert all(critical is None for primary,critical in pairs),'Keep the original horse-only semantic role; do not ignore a new critical object'
            blocks=[clouds[primary]for primary,critical in pairs];starts=np.cumsum([0]+[len(v)for v in blocks[:-1]])
            whole=np.concatenate(blocks);represented=[js for js in pairs.values()]
            def quick(p):
                bounds=[]
                for fraction in (1.,1.01):
                    q=p[:];q[3]*=fraction;camera(q);dg=bpy.context.evaluated_depsgraph_get()
                    m=d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted()
                    clip=whole@np.asarray(m).T
                    if not np.isfinite(clip).all()or not(clip[:,3]>0).all():return None
                    xy=np.column_stack(((clip[:,0]/clip[:,3]+1)*540,(1-clip[:,1]/clip[:,3])*960))
                    low=np.minimum.reduceat(xy,starts,axis=0);high=np.maximum.reduceat(xy,starts,axis=0)
                    bounds.extend((i,fraction,float((b[0]-a[0])/1080),[float(a[0]),float(a[1]),float(b[0]),float(b[1])])for i,(a,b)in enumerate(zip(low,high)))
                minimum=min(bounds,key=lambda r:r[2]);maximum=max(bounds,key=lambda r:r[2])
                assert minimum[2]>0
                return {'minimumWidth':minimum[2],'maximumWidth':maximum[2],'widthRatio':maximum[2]/minimum[2],'minimumOutputFrame':min(represented[minimum[0]]),'maximumOutputFrame':min(represented[maximum[0]])}
            def actual_trial(p):
                rows=[]
                for (primary,critical),js in pairs.items():
                    for fraction in (1.,1.01):
                        q=p[:];q[3]*=fraction;camera(q);b=box(clouds[primary]);c=box(clouds[critical])if critical else None
                        rows.append({'firstOutputFrame':min(js),'lastOutputFrame':max(js),'outputCount':len(js),'approachFraction':fraction,'primaryWidth':(b[2]-b[0])/1080,'primaryBox':b,'criticalBox':c,'pass':bool(quality(b)and quality(c,True))})
                assert rows
                return {'uniqueGeometryStates':len(pairs),'endpointTests':len(rows),'failedEndpointTests':sum(not r['pass']for r in rows),'minimumWidthState':min(rows,key=lambda r:r['primaryWidth']),'maximumWidthState':max(rows,key=lambda r:r['primaryWidth']),'leftmostState':min(rows,key=lambda r:r['primaryBox'][0]),'rightmostState':max(rows,key=lambda r:r['primaryBox'][2]),'topmostState':min(rows,key=lambda r:r['primaryBox'][1]),'bottommostState':max(rows,key=lambda r:r['primaryBox'][3]),'criticalSurfacesPresent':False}
            # Single world-cloud capture, then vectorized matrix projection:
            # no scene replay or evaluated-mesh extraction in this search.
            # The opposite side can shorten the distant broadside relative
            # to the nearer end-on states; an orthographic width ratio alone
            # does not prove perspective feasibility/impossibility.
            yaws=sorted(set(range(-180,180,15))|{-132,-128,-124,48,52})
            screen=[]
            for elevation in (35.,45.,55.):
                for azimuth in yaws:
                    for seed_distance in (.145,.24,.36):
                        seed=list(phase['base']);seed[4]=azimuth;seed[5]=elevation
                        seed[6]*=seed_distance/seed[3];seed[3]=seed_distance
                        measured=quick(seed);row={'azimuth':azimuth,'elevation':elevation,'seedDistance':seed_distance,'seedPose':seed,'cloudProjection':measured}
                        if measured is not None:screen.append(row)
            assert screen
            report['horseOrientationCloudScreen']={'uniqueGeometryStates':len(pairs),'worldVertices':len(whole),'worldCloudSha256':hashlib.sha256(whole.tobytes()).hexdigest(),'candidateCount':len(screen),'candidates':screen,'originalProjectCrosscheckDeferredToEveryFinalActualState':True,'approximateScreenNeverApprovesImages':True}
            def angle_cost(r):
                yaw=abs((r['azimuth']-phase['base'][4]+180)%360-180)
                return (math.hypot(yaw,r['elevation']-phase['base'][5]),r['cloudProjection']['widthRatio'],r['seedDistance'])
            plausible=sorted([r for r in screen if r['cloudProjection']['widthRatio']<=1.80],key=angle_cost)
            best=sorted(screen,key=lambda r:(r['cloudProjection']['widthRatio'],angle_cost(r)))
            candidates=[];seen=set()
            for row in plausible[:12]+best[:8]:
                signature=(row['azimuth'],row['elevation'],row['seedDistance'])
                if signature not in seen:candidates.append(row);seen.add(signature)
            report['horseOrientationCloudScreen']['selectedFixedFitCandidates']=[{k:v for k,v in r.items()if k!='seedPose'}for r in candidates]
            for row in candidates:
                seed=row['seedPose'];target=.80;cy=830.
                for iteration in range(4):
                    trial={'phase':'horse-close','target':target,'center':[540,cy],'fixedAzimuth':row['azimuth'],'fixedElevation':row['elevation'],'seedDistance':row['seedDistance'],'fitIteration':iteration,'coarseScreen':row['cloudProjection']};attempts.append(trial)
                    try:p=fit(vv,seed,target,[540,cy]);summary=actual_trial(p)
                    except (AssertionError,ArithmeticError)as error:trial['solverFailure']=str(error)[:200];break
                    trial.update(pose=p,actualStateSummary=summary,allStatesAndApproachEndpointsPass=summary['failedEndpointTests']==0)
                    if summary['failedEndpointTests']==0:return p
                    lo=.40/summary['minimumWidthState']['primaryWidth'];hi=.70/summary['maximumWidthState']['primaryWidth']
                    trial['actualWidthScaleFeasibleInterval']=[lo,hi]
                    if lo>hi:trial['nextStep']='Current perspective has no linearized zoom interval; not a proof about every camera';break
                    new_target=target*math.sqrt(lo*hi)
                    if new_target>.92:trial['nextStep']='Union-fit horizontal search bound reached';break
                    top=summary['topmostState']['primaryBox'][1];bottom=summary['bottommostState']['primaryBox'][3]
                    low_shift=110-top;high_shift=1550-bottom
                    if low_shift>high_shift:trial['nextStep']='Union-fit vertical search bound reached';break
                    shift=max(low_shift,min(0.,high_shift));new_cy=cy+shift
                    if abs(new_target-target)<1e-7 and abs(new_cy-cy)<.01:break
                    target=new_target;cy=new_cy
            raise AssertionError('Broad fixed-view search found no camera passing every original actual-state quality limit; no render')
"""

def adapted_camera_source():
    retained=runpy.run_path(str(V7));original,metadata=retained['adapted_camera_source']();text=original
    previous=retained['HORSE_SOLVER'];assert text.count(previous)==1;text=text.replace(previous,HORSE_SOLVER,1)
    assert text.count(HORSE_SOLVER)==1 and text.replace(HORSE_SOLVER,previous,1)==original
    return text,{**metadata,'fixedAngleSelection':'all-yaw15degree cloud screen and elevations35/45/55; least angular deviation among plausible candidates, plus best-ratio fallbacks; only strict actual-state checks can accept',
        'fixedAzimuthCandidates':sorted(set(range(-180,180,15))|{-132,-128,-124,48,52}),'fixedElevationCandidates':[35,45,55],
        'additionalV8ReversibleSourceBoundaries':1,'v8InverseByteIdenticalToV7DerivedSource':True,
        'retainedV7Source':str(V7),'retainedV7SourceSha256':V7_SHA,
        'actual130FailedReport':str(FAILED130),'actual130FailedReportSha256':FAILED130_SHA,
        'actual130BestObservedRatioInIts27Candidates':1.935702821679514,
        'cloudScreenReplaysAndMeshExtractionsAdded':0,'screenWidthRatioIsNotAnAcceptanceOrImpossibilityProof':True,
        'strictQualityFunctionAndFinalAllOutputChecksUnchanged':True}

def run_camera(ns,authorized=False,mode='audit',*,recovery_diagnostic_sha256='5502cee07b7b6107dd94f2783e0807a8f202334b9e016c5b366b59ed28c3cc5d',
        audit_report_sha256=None,probe_report_sha256=None,root_visual_receipt=None,root_visual_receipt_sha256=None):
    assert authorized is True and mode in('audit','probe','render')
    pins={str(BASE):BASE_SHA,str(V6):V6_SHA,str(V7):V7_SHA,str(FAILED130):FAILED130_SHA,str(CAMERA):CAMERA_SHA,str(FAILED122):FAILED122_SHA,str(FAILED126):FAILED126_SHA,str(Path(__file__).resolve()):sha(__file__)}
    for p,h in pins.items():assert sha(p)==h,p
    failed=json.loads(FAILED126.read_text());assert failed['renders']==0 and failed['helperSha256']==V6_SHA
    assert failed['error']['message']=="('No fixed camera satisfies every actual state; no render', 'horse-close')"and all(v is True for v in failed['protectionChecks'].values())
    text,metadata=adapted_camera_source();real=runpy.run_path
    def private_run_path(path,*args,**kwargs):
        if Path(path).resolve()==CAMERA:
            assert not args and not kwargs;scope={'__name__':'d1_camera_solver_v8_private','__file__':str(CAMERA)}
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
