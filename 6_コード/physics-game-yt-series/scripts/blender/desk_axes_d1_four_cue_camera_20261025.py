"""Root-only four-cue camera derivative; imports are inert.

Exact delivered object/hand/source states are replayed unchanged. Each spoken
object phase has one fixed camera, with at most a 1% distance approach inside
an existing introduction/move interval. No continuous centroid following.
All actual source states and held dependents are checked before any render.
"""
import copy
import hashlib
import json
import math
from pathlib import Path
import runpy
import time
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
BASE=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
OUT=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-20261025')
PIER=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-20261025/audit/report.json')
REPLAY=W/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py'
REPLAY_SHA='7e6c0c3dfb26427a996a1869ab13ea7f69c17b2c39784a827ee5e82dd083768a'
RECOVERY=W/'scripts/blender/desk_axes_d1_pier_contact_replay_v2_20261025.py'
RECOVERY_SHA='150a4bca4f8bd0f6c42077afb7b27d6d99f76aac6f1004a56a5b0be43441796c'
KEYS=('mine:mio','air:1kg','size:2t','size:horse')
BAD_TIMES=(35.5,168.5,171.5,174.,310.5,311.,320.)

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def write(p,x):
    with Path(p).open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
def same(a,b,tolerance=1e-9):
    if isinstance(a,dict):return isinstance(b,dict)and a.keys()==b.keys()and all(same(v,b[k],tolerance)for k,v in a.items())
    if isinstance(a,(tuple,list)):return isinstance(b,(tuple,list))and len(a)==len(b)and all(same(x,y,tolerance)for x,y in zip(a,b))
    if isinstance(a,(int,float))and not isinstance(a,bool):return isinstance(b,(int,float))and math.isfinite(float(a))and math.isfinite(float(b))and abs(a-b)<=tolerance
    return a==b
def pin(p,h):assert isinstance(h,str)and len(h)==64 and sha(p)==h,str(p)
def sm(v):v=max(0.,min(1.,v));return v*v*(3-2*v)

def phases(g):
    """Only original word/move boundaries; no supplied timing is changed."""
    def end(key):
        c=g['CUE'][key];i=g['CUES'].index(c)
        return g['CUES'][i+1]['start']if i+1<len(g['CUES'])else g['DATA']['duration']
    kg=g['T']('air:1kg','イチキログラム');hand=g['T']('air:1kg','テノヒラ')
    tonnes=g['T']('size:2t','ニトン');horse=g['T']('size:horse','ウマ')
    return [
     {'name':'horse-close','cue':'mine:mio','a':g['S']('mine:mio'),'b':end('mine:mio'),'move':1.,'base':g['camera_pose_d1']('horse')},
     {'name':'square','cue':'air:1kg','a':g['S']('air:1kg'),'b':kg,'move':.8,'base':[.24,-.04,.001,.12,0,40,196]},
     {'name':'one-kg','cue':'air:1kg','a':kg,'b':hand,'move':.4,'base':[.24,-.04,.008,.12,0,40,100]},
     {'name':'palm-and-100kg','cue':'air:1kg','a':hand,'b':end('air:1kg'),'move':.8,'base':g['camera_pose_d1']('weights')},
     {'name':'twenty-two-palms','cue':'size:2t','a':g['S']('size:2t'),'b':tonnes,'move':min(1.,g['CUE']['size:2t']['move']),'base':g['camera_pose_d1']('area')},
     {'name':'two-tonnes','cue':'size:2t','a':tonnes,'b':end('size:2t'),'move':.4,'base':g['camera_pose_d1']('heavyclose')},
     {'name':'two-tonnes','cue':'size:horse','a':g['S']('size:horse'),'b':horse,'move':0.,'base':g['camera_pose_d1']('heavyclose')},
     {'name':'horse-comparison','cue':'size:horse','a':horse,'b':end('size:horse'),'move':.6,'base':g['camera_pose_d1']('heavy')},
    ]

def run(ns,authorized=False,mode='audit',*,pier_audit_report_sha256,
        audit_report_sha256=None,probe_report_sha256=None,
        root_visual_receipt=None,root_visual_receipt_sha256=None):
    assert authorized is True and mode in ('audit','probe','render')
    pin(REPLAY,REPLAY_SHA);pin(RECOVERY,RECOVERY_SHA);pin(PIER,pier_audit_report_sha256)
    pier=read(PIER);assert pier['helperSha256']==REPLAY_SHA and pier['allGuardedStatesPass']and not pier.get('error')
    assert pier['protectionChecks']and all(pier['protectionChecks'].values())
    assert not OUT.is_symlink();dest=OUT/mode
    assert not dest.exists()and not any(p.is_symlink()for p in [OUT,*OUT.parents]if p.exists())
    prior=None;probe=None
    if mode!='audit':
        pin(OUT/'audit/report.json',audit_report_sha256);prior=read(OUT/'audit/report.json')
        assert prior['helperSha256']==sha(__file__)and prior['allReplacementPhysicalPass']and not prior.get('error')
        assert prior['pierAuditReportSha256']==pier_audit_report_sha256 and all(prior['protectionChecks'].values())
    if mode=='render':
        pin(OUT/'probe/report.json',probe_report_sha256);probe=read(OUT/'probe/report.json')
        pin(root_visual_receipt,root_visual_receipt_sha256);eye=read(root_visual_receipt)
        assert eye['approved']is True and eye['helperSha256']==sha(__file__)and eye['probeReportSha256']==probe_report_sha256
        assert eye['auditReportSha256']==audit_report_sha256 and eye['allRequiredProbeImagesPersonallyViewed']is True
        assert probe['allRequestedActuallyRendered']and probe['allReplacementPhysicalPass']and all(probe['protectionChecks'].values())
        assert eye['reviewedImageSha256']=={r['path']:r['sha256']for r in probe['actualImages']}
        for r in probe['actualImages']:pin(r['path'],r['sha256'])
    dest.mkdir(parents=True);started=time.time();ctx=None;settings=None
    report={'episode':'D-1','mode':mode,'helperSha256':sha(__file__),'sourceCache':str(BASE),
        'pierAuditReportSha256':pier_audit_report_sha256,'modelsHandsVoiceCaptionsAndTimesUnchanged':True,
        'renders':0,'allReplacementPhysicalPass':False,'allPatchFramesActuallyRendered':False,
        'automaticApproval':False,'originalNGPreserved':True,'actualFinalImageReviewPending':True,'finalAcceptance':False}
    try:
        import numpy as np
        replay=runpy.run_path(str(REPLAY));recovery=runpy.run_path(str(RECOVERY))
        ctx=recovery['DeliveredReplay'](ns,cache=BASE);ctx.open()
        g,d,bpy=ctx.g,ctx.d,ctx.bpy;scene=d.SC;definitions=phases(g)
        selected={j:next((p for p in definitions if p['a']<=j/30<p['b']),None)for j in range(12163)}
        selected={j:p for j,p in selected.items()if p is not None};assert {g['cue_at'](j/30)['key']for j in selected}==set(KEYS)
        intersection=sorted(set(selected)&set(map(int,pier['replacementOutputToPatchSource'])))
        assert not intersection,'Unexpected real camera/pier output intersection requires explicit integration'
        report.update(phaseDefinitions=definitions,pierOutputIntersection=intersection,
            all12163OutsideSelectedCuesKeepOriginalDeliveredCamera=True)
        protected={str(REPLAY):REPLAY_SHA,str(RECOVERY):RECOVERY_SHA,str(PIER):pier_audit_report_sha256,str(Path(__file__).resolve()):sha(__file__),**ctx.protected}
        if prior:protected[str(OUT/'audit/report.json')]=audit_report_sha256
        if probe:protected.update({str(OUT/'probe/report.json'):probe_report_sha256,str(root_visual_receipt):root_visual_receipt_sha256})
        report['pins']=protected
        local_cache={};clouds={};states={};all_state_rows={};max_projection_error=0.
        def world_points(objects):
            dg=bpy.context.evaluated_depsgraph_get();parts=[]
            for o in dict.fromkeys(objects):
                if o.hide_render or o.type not in ('MESH','FONT','CURVE'):continue
                cacheable=o.type=='MESH'and not o.data.shape_keys
                if cacheable and o in local_cache:vv=local_cache[o]
                else:
                    ev=o.evaluated_get(dg);me=ev.to_mesh()
                    if me is None:continue
                    try:
                        v=np.empty(len(me.vertices)*3);me.vertices.foreach_get('co',v)
                        vv=np.column_stack((v.reshape(-1,3),np.ones(len(me.vertices))))
                    finally:ev.to_mesh_clear()
                    if cacheable:local_cache[o]=vv
                if len(vv):parts.append(vv@np.asarray(o.matrix_world).T)
            if not parts:return None
            vv=np.concatenate(parts);key=hashlib.sha256(vv.tobytes()).hexdigest();clouds.setdefault(key,vv);return key
        for j,phase in selected.items():
            row=ctx.rows[j];sig=replay['signature'](row)
            if sig not in states:
                ctx.replay(row);t=row['unchangedOtherObjectSourceFrame']/30;c=g['cue_at'](t)
                role,objects,critical=ctx.tools['principal'](c,t)
                states[sig]={'primary':world_points(objects),'critical':world_points(critical),'role':role,'delivered':row}
            all_state_rows[j]={**states[sig],'phase':phase['name']}
        last_camera=None
        def camera(p):
            nonlocal last_camera
            key=tuple(p)
            if key!=last_camera:d.pose_cam(p);bpy.context.view_layer.update();last_camera=key
        def box(vv):
            nonlocal max_projection_error
            if vv is None:return None
            dg=bpy.context.evaluated_depsgraph_get();m=d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted()
            clip=vv@np.asarray(m).T;assert np.isfinite(clip).all()and(clip[:,3]>0).all()
            xy=np.column_stack(((clip[:,0]/clip[:,3]+1)*540,(1-clip[:,1]/clip[:,3])*960))
            for i in {0,len(vv)//2,len(vv)-1}:
                original=d.project(g['Vector'](vv[i,:3]));error=max(abs(original[0]-xy[i,0]),abs(original[1]-xy[i,1]));max_projection_error=max(max_projection_error,float(error));assert error<=.11
            return [float(xy[:,0].min()),float(xy[:,1].min()),float(xy[:,0].max()),float(xy[:,1].max())]
        def measure(vv,p):camera(p);return box(vv)
        def quality(b,critical=False):
            if b is None:return True if critical else False
            return b[0]>=40 and b[2]<=1040 and b[1]>=110 and b[3]<=(1100 if critical else 1550)and(critical or .40<=(b[2]-b[0])/1080<=.70)
        def cloud_for(name,field):
            keys={r[field]for r in all_state_rows.values()if r['phase']==name and r[field]is not None}
            return np.concatenate([clouds[k]for k in keys])if keys else None
        attempts=[];fitted={}
        def fit(vv,base,target,center):
            p=list(base);right=np.array([math.cos(math.radians(p[4])),math.sin(math.radians(p[4])),0.]);directions=[right,np.array([0.,0.,1.])]
            for iteration in range(50):
                b=measure(vv,p);width=(b[2]-b[0])/1080;distance=p[3]*width/target
                if distance>=.12:p[3]=distance
                else:p[3]=.12;b=measure(vv,p);p[6]*=target/((b[2]-b[0])/1080)
                assert .12<=p[3]<=3 and 15<=p[6]<=250
                b=measure(vv,p);c=np.array([(b[0]+b[2])/2,(b[1]+b[3])/2]);delta=np.asarray(center)-c
                if abs((b[2]-b[0])/1080-target)<2e-5 and float(np.abs(delta).max())<.05:return p
                columns=[]
                for direction in directions:
                    q=p[:]
                    for a in range(3):q[a]+=.001*float(direction[a])
                    bb=measure(vv,q);columns.append((np.array([(bb[0]+bb[2])/2,(bb[1]+bb[3])/2])-c)/.001)
                jac=np.column_stack(columns);gram=jac.T@jac
                change=np.linalg.solve(gram+np.eye(2)*max(1e-9,float(np.trace(gram))*1e-10),jac.T@delta)
                assert np.isfinite(change).all();change*=min(1.,.025/max(float(np.abs(change).max()),1e-15))
                old_score=float(np.linalg.norm(delta));accepted=False
                for factor in (1.,.5,.25,.125,.0625):
                    q=p[:]
                    for coefficient,direction in zip(change,directions):
                        for a in range(3):q[a]+=factor*float(coefficient*direction[a])
                    bb=measure(vv,q);score=float(np.linalg.norm(np.asarray(center)-np.array([(bb[0]+bb[2])/2,(bb[1]+bb[3])/2])))
                    if score<old_score:p=q;accepted=True;break
                if not accepted:raise ArithmeticError('Bounded fixed-camera centering did not improve')
            raise ArithmeticError('Fixed-camera solver iteration bound')
        for name in dict.fromkeys(p['name']for p in definitions):
            phase=next(p for p in definitions if p['name']==name);vv=cloud_for(name,'primary')
            if prior:fitted[name]=prior['fixedPhasePoses'][name];continue
            accepted=None
            for target in (.60,.55,.65,.50,.45):
                for cy in (700,650,750,600,800):
                    trial={'phase':name,'target':target,'center':[540,cy]};attempts.append(trial)
                    try:p=fit(vv,phase['base'],target,[540,cy])
                    except (AssertionError,ArithmeticError)as error:trial['solverFailure']=str(error);continue
                    tested=[]
                    # Identical evaluated world-vertex bytes have identical
                    # projected bounds. Every output remains recorded below.
                    pairs={(r['primary'],r['critical'])for r in all_state_rows.values()if r['phase']==name}
                    for primary,critical in pairs:
                        for fraction in (1.,1.01):
                            try:
                                q=p[:];q[3]*=fraction;camera(q);b=box(clouds[primary]);c=box(clouds[critical])if critical else None
                                tested.append(quality(b)and quality(c,True))
                            except AssertionError:tested.append(False)
                    trial.update(pose=p,allStatesAndApproachEndpointsPass=all(tested))
                    if all(tested):accepted=p;break
                if accepted is not None:break
            assert accepted is not None,('No fixed camera satisfies every actual state; no render',name)
            fitted[name]=accepted
        def corrected_pose(j):
            if j not in selected:return list(ctx.rows[j]['pose'])
            phase=selected[j];p=list(fitted[phase['name']])
            if phase['move']>0:p[3]*=1+.01*(1-sm((j/30-phase['a'])/phase['move']))
            return p
        delivered_poses=[corrected_pose(j)for j in range(12163)]
        for j,phase in selected.items():
            if j-1 in selected and selected[j-1]is phase and j/30>=phase['a']+phase['move']+1/30:
                assert delivered_poses[j]==delivered_poses[j-1],'No camera tracking during stopped explanation'
        rounded=[tuple(round(v,10)for v in p)for p in delivered_poses]
        moving=[False]+[rounded[j]!=rounded[j-1]for j in range(1,12163)]
        spans=[];start=None
        for j,flag in enumerate(moving+[False]):
            if flag and start is None:start=j/30
            if not flag and start is not None:spans.append([start,j/30]);start=None
        motion={'frames':12163,'moving_frames':sum(moving),'moving_ratio':sum(moving)/12163,'top_ratio':sum(p[5]>=65 for p in delivered_poses)/12163,'moving_spans':spans}
        assert motion['moving_ratio']<=.20 and motion['top_ratio']<=.20
        unique={};mapping={};sources={};physical=[]
        for j,phase in selected.items():
            row=ctx.rows[j];p=delivered_poses[j];signature=(replay['signature'](row),tuple(p),phase['name'])
            k=unique.setdefault(signature,j);mapping[j]=k;sources.setdefault(k,row)
            camera(p);model=all_state_rows[j];b=box(clouds[model['primary']]);c=box(clouds[model['critical']])if model['critical']else None
            physical.append({'frame':j,'patchSource':k,'phase':phase['name'],'delivered':row,'pose':p,'semanticPrincipal':model['role'],'actualSurface':b,'criticalSurface':c,'primary40to70AndSafe1550':quality(b),'originalCriticalSafe1100':quality(c,True),'pass':bool(quality(b)and quality(c,True))})
        assert all(r['pass']for r in physical)
        plan={'fixedPhasePoses':fitted,'replacementFrameToActualPatchFrame':mapping,
            'patchFrameToOriginalDeliveredRow':sources,'deliveredCameraPoses':delivered_poses,
            'physical':physical,'cameraMotion':motion}
        if prior:
            assert same(plan['fixedPhasePoses'],prior['fixedPhasePoses'])and same(physical,prior['physical'])
            assert {str(j):k for j,k in mapping.items()}==prior['replacementFrameToActualPatchFrame']
        report.update(**plan,actualSources=len(sources),replacementOutputs=len(mapping),allReplacementPhysicalPass=True,
            projectionVersusOriginalMaxErrorPixels=max_projection_error,cameraFitAttempts=attempts,pins=protected)
        write(dest/'preflight.json',report)
        if mode=='audit':return report
        wanted=set(round(t*30)for t in BAD_TIMES)
        for phase in definitions:
            js=[j for j,p in selected.items()if p is phase];assert js
            wanted.update((js[0],js[-1],min(js,key=lambda j:abs(j/30-(phase['a']+phase['move'])))))
        wanted=sorted(wanted)if mode=='probe'else sorted(sources)
        def actual_apply(t):
            j=round(t*30);r=ctx.rows[j];points=ctx.replay(r)
            objects={o:replay['object_state'](o)for o in scene.objects if o is not d.CAM}
            fn=types.FunctionType(g['set_camera'].__code__,{**g,'pose_at':lambda _t:delivered_poses[j]});fn(t);bpy.context.view_layer.update()
            assert all(replay['object_state'](o)==s for o,s in objects.items()),'Camera-only derivative changed a model/hand'
            return points
        settings={k:getattr(scene.render,k)for k in ['resolution_x','resolution_y','resolution_percentage']}
        settings.update(image={k:getattr(scene.render.image_settings,k)for k in ['file_format','quality','color_mode','color_depth','compression']},samples=scene.eevee.taa_render_samples)
        scene.render.resolution_x=1080;scene.render.resolution_y=1920;scene.render.resolution_percentage=100
        scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=92;scene.eevee.taa_render_samples=16
        raw=dest/'blender/patch';raw.mkdir(parents=True)
        a=copy.copy(g['A']);a.cache=str(dest);a.out=str(raw);a.times=','.join(str(j/30)for j in wanted)
        a.force=False;a.start=0;a.stop=1e9;a.every=1;a.scale=1;a.samples=16;a.anchors_only=False
        scope={**g,'A':a,'apply':actual_apply,'pose_at':lambda t:delivered_poses[max(0,min(12162,round(t*30)))]}
        types.FunctionType(g['main'].__code__,scope)()
        images=[]
        for j in wanted:
            f=raw/('%05d.jpg'%j);assert f.is_file()and not f.is_symlink()and f.stat().st_size>1000
            images.append({'frame':j,'path':str(f),'sha256':sha(f),'delivered':ctx.rows[j],'pose':delivered_poses[j],'actuallyViewed':False})
        report.update(raw=str(raw),actualImages=images,anchors=str(raw/'anchors.json'),anchorsSha256=sha(raw/'anchors.json'),
            renders=len(images),allRequestedActuallyRendered=True,allPatchFramesActuallyRendered=mode=='render',
            auditReportSha256=audit_report_sha256,approvedProbeReportSha256=probe_report_sha256,
            rootVisualReceipt=root_visual_receipt,rootVisualReceiptSha256=root_visual_receipt_sha256)
        return report
    except BaseException as error:
        report['error']={'type':type(error).__name__,'message':str(error)};raise
    finally:
        checks={}
        if ctx is not None:
            if settings is not None:
                for k in ['resolution_x','resolution_y','resolution_percentage']:setattr(ctx.scene.render,k,settings[k])
                for k,v in settings['image'].items():setattr(ctx.scene.render.image_settings,k,v)
                ctx.scene.eevee.taa_render_samples=settings['samples']
            try:checks.update(ctx.close())
            except BaseException as error:checks['replayRestorationCompleted']=False;report['cleanupError']={'type':type(error).__name__,'message':str(error)}
            report['completeTransformRestorationEvidence']=ctx.transformRestorationReport
        checks['sourceAndPinnedEvidenceUnchanged']=all(sha(p)==h for p,h in report.get('pins',{}).items())
        report.update(protectionChecks=checks,seconds=round(time.time()-started,3),automaticApproval=False,finalAcceptance=False)
        write(dest/'report.json',report);assert checks and all(checks.values()),checks
