"""Correct B1 inter-site moves that leave the principal off-screen.

Actual frames 1185/1530/1545 showed blurred wood as a close camera moved between
desk sites. 10470 showed the lid filling the frame. The complete 0.5-second
projection also identified the other off-screen inter-site moves below. The
new shot cuts to the next desk site, then gently approaches its frozen target
within the SAME move interval. Camera corrections preserve the original object
state; the additional visual corrections below are explicitly documented.
Scene duration and Japanese never change.
The original final gate also found 8.5 static seconds in test:if. A blue hand
now points to the equator, pole and London as the unchanged voice names them.
Actual first-candidate review additionally fixes the wind-vane direction,
bounded exact dipole paths, the complete open-book frame, the sailor/garlic
frame and the row32 connector/caption occlusion. These are recorded separately;
this is not represented as a camera-only patch or a blanket gate waiver.
"""
import copy,hashlib,json,math,time,types
import runpy,traceback
import numpy as np
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
EXECUTED_SOURCE_SHA=hashlib.sha256((W/'scripts/blender/desk_axes_b1_camera_patch_20261024.py').read_bytes()).hexdigest()
exec(compile((W/'scripts/blender/desk_axes_c1_final_bounds_job_20261024.py').read_text(),str(W/'scripts/blender/desk_axes_c1_final_bounds_job_20261024.py'),'exec'),globals())
# C's original completed production/audit is preserved. Its separately owned
# camera-only repair can run here before B; a failed strict preflight is kept
# as a failure, but must not suppress B's independent repair.
cpatch=W/'scripts/blender/desk_axes_c1_camera_patch_20261024.py'
try:
    assert hashlib.sha256(cpatch.read_bytes()).hexdigest()=='560991b3a71e02071ae30eac24b2f2ddcf54ff5a8fb8f6a57a8fe704ec97e200'
    runpy.run_path(str(cpatch))['patch'](nsC1)
except Exception:
    record=Path('/private/tmp/ys/ys-chain-c1v1')/('c1-camera-attempt-failed-%d.json'%time.time_ns())
    record.write_text(json.dumps({'status':'failed-not-waived','traceback':traceback.format_exc(),'time':time.time(),'next':'C correction remains required; independently continue B'},indent=1))
    print('C CAMERA CORRECTION FAILED; NOT ACCEPTED. Evidence:',record,traceback.format_exc(),flush=True)
C=Path('/private/tmp/ys/ys-chain-b1v1')
P=Path('/private/tmp/ys/ys-chain-b1v1-camera-final-20261024')
g=nsB1r6['main'].__globals__
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
PATCH_SOURCE_SHA=EXECUTED_SOURCE_SHA
assert sha(g['__file__'])=='7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4'
assert json.loads((C/'b1-production-20261024.json').read_text())['status']=='done'
assert not P.exists(),'Preserve any earlier camera-correction output'
g['bpy'].context.window.scene=g['d'].SC
assert g['bpy'].context.scene is g['d'].SC,'B corrections must be evaluated in the B scene'
keys=['lore:star','lore:garlic','doubt:gilbert','garlic:side','rule:vane','test:side','test:if','test:others','test:fact','test:judge','next:book','next:mio','ch:q','last:needle']
gesture_start,gesture_end=201.32,206.8
gesture_nodes=[(201.72,51.5),(202.55,0),(203.38,90),(204.15,45),(205.37,51.5)]
cues=[next(c for c in g['CUES'] if c['key']==key) for key in keys]
nf=math.ceil(g['DATA']['duration']*30)
ranges=[{'cue':c['key'],'start':c['start'],'end':c['start']+c['move'],'firstFrame':math.ceil(c['start']*30-1e-8),'lastFrame':math.ceil((c['start']+c['move'])*30-1e-8)-1} for c in cues]
immutable=[C/'plan.json',C/'ys-chain-b1v1.json',C/'phrase-times.json',C/'ys-chain-b1v1.wav',C/'blender/desk/meta.json',C/'blender/desk/anchors.json',W/'docs/video-revision-20260924/ytseries/chain-b-1.mjs']
before={str(p):sha(p) for p in immutable}
original_apply=g['apply'];original_pose=g['pose_at']
# The first actual MP4 exposed cropped outer field lines. Use bounded curves
# of the SAME exact dipole equation, never a scaled/distorted field. Original
# data files and the first full raw production remain byte-for-byte intact.
old_lines=copy.deepcopy(json.loads((C/'blender/data.json').read_text())['b1']['fieldLines'])
if '_b1_original_aligned_20261024' not in g:
    assert g['DATA']['fieldLines']==old_lines,'First capture must precede any derived field patch'
    g['_b1_original_aligned_20261024']=[tuple(v.co) for v in g['PARTS']['powder']['aligned'].data]
lines=[];line_constants=[]
for sign in [-1,1]:
    for k in range(8):
        L=.125+.01*k+(0 if sign<0 else .0005);theta0=math.asin(math.sqrt(.09/L));line=[]
        for j in range(121):
            th=theta0+(math.pi-2*theta0)*j/120;r=L*math.sin(th)**2
            line.append([sign*r*math.sin(th),r*math.cos(th)])
        lines.append(line);line_constants.append(L)
assert all(abs(math.hypot(x,z)-L*(x*x/(x*x+z*z)))<1e-10 for L,line in zip(line_constants,lines) for x,z in line)
assert len(lines)==len(set(line_constants))==16
g['DATA']['fieldLines']=lines
aligned=g['PARTS']['powder']['aligned']
old_aligned=g['_b1_original_aligned_20261024']
for i in range(3000):
    x,z=lines[i%16][(i*17)%121]
    for k,dv in enumerate([(0,0,.0012),(.001,0,-.0006),(-.0005,.0009,-.0006),(-.0005,-.0009,-.0006)]):
        aligned.data[i*4+k].co=g['Vector']((x,.118,.12+z))+g['Vector'](dv)
g['PARTS']['powder']['mesh'].data.update()
# The original connecting arrow penetrated the open wooden lid. Route this
# illustrative connector in front of, then above, that lid. Its start/end
# still point to the same red needle and the same northern blue S pole.
attract_spline=g['attract'].data.splines[0]
if '_b1_original_attract_20261024' not in g:
    g['_b1_original_attract_20261024']=[tuple(p.co) for p in attract_spline.points]
assert len(attract_spline.points)==3
attract_spline.points[1].co=(.15,-.16,.24,1)
g['attract'].data.update_tag()
# At the challenge's meridional side view the white half of the original
# tangent needle was inside the opaque stone's silhouette. Keep its SAME
# latitude, horizontal tangent and camera, but give the transparent support a
# real short radial standoff. Both halves can then be read without revealing
# the answer or moving the protractor out of its explanatory plane.
rr_ch=g['Vector']((math.cos(math.pi/6),0,-.5))
riser_name='b1_challenge_riser_20261024'
riser=g['bpy'].data.objects.get(riser_name)
if riser is None:
    mat=g['d'].MATS['b1stand']
    riser=g['d'].cyl(riser_name,.002,.022,g['PARTS']['terrella']['center']+.101*rr_ch,mat,verts=16)
riser.rotation_mode='QUATERNION';riser.rotation_quaternion=rr_ch.to_track_quat('Z','Y');g['d'].show(riser,False)
def mesh_points(objects):
    pts=[]
    for ob in objects:
        if ob.type=='MESH':pts.extend(ob.matrix_world@v.co for v in ob.data.vertices)
        elif ob.type=='CURVE':
            for spl in ob.data.splines:pts.extend(ob.matrix_world@g['Vector'](p.co[:3]) for p in spl.points)
    return pts
def principal_points(c):
    if c['group']=='powder':
        # The principal here is the COMPLETE magnetic-field pattern, not an
        # inflated board and not merely the smaller stone in its centre.
        return [g['Vector']((x,.118,.12+z)) for line in lines for x,z in line]
    if c['group']=='book':return mesh_points(g['GROUPS']['book'])+g['hero_points']('book')
    if c['group']=='sailor':
        return mesh_points([ob for ob in g['GROUPS']['sailor']+g['GROUPS']['garlic'] if not ob.hide_render])
    return g['hero_points'](c['camera'])
projection_max_error=0.
def project_points(points):
    global projection_max_error
    deps=g['bpy'].context.evaluated_depsgraph_get();d=g['d']
    m=np.array(d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1.,scale_y=1.))@np.array(d.CAM.matrix_world.inverted())
    xyz=np.array([tuple(v)+(1.,) for v in points]);q=xyz@m.T
    assert np.all(np.abs(q[:,3])>1e-10),'Principal lies on camera plane'
    xy=np.column_stack(((q[:,0]/q[:,3]+1)*540,(1-q[:,1]/q[:,3])*960))
    for k in set([0,len(points)//2,len(points)-1]):
        old=d.project(points[k]);err=max(abs(old[0]-xy[k,0]),abs(old[1]-xy[k,1]));projection_max_error=max(projection_max_error,float(err))
        assert err<=.11,('Independent projection differs from original',err)
    return xy.tolist()
def fit_pose(c,t,target=.66,initial=None,samples=None):
    pts=[]
    for at in samples or [t]:
        original_apply(at);g['bpy'].context.view_layer.update();pts.extend(principal_points(c))
    p=list(initial or c['pose'])
    p[:3]=[(min(v[a] for v in pts)+max(v[a] for v in pts))/2 for a in range(3)]
    for _ in range(10):
        g['pose_b1'](p);g['bpy'].context.view_layer.update();pp=[g['d'].project(v) for v in pts]
        p[3]*=(max(v[0] for v in pp)-min(v[0] for v in pp))/(1080*target)
    return p
powder_cue=next(c for c in g['CUES'] if c['group']=='powder')
powder_pose=fit_pose(powder_cue,172.5)
book_cue=next(c for c in g['CUES'] if c['group']=='book')
book_pose=fit_pose(book_cue,318,samples=[315.8,316,316.2,316.5,318])
sailor_cue=next(c for c in g['CUES'] if c['group']=='sailor')
sailor_pose=fit_pose(sailor_cue,45.5,samples=[sailor_cue['start']+.05,43.5,44.5,45.5,46.6])
# Row32: move the two-object composition up, never the fixed captions.
globe_cue=next(c for c in g['CUES'] if c['row']==32)
globe_pose=list(globe_cue['pose'])
original_apply(294.4)
for _ in range(6):
    g['pose_b1'](globe_pose);g['bpy'].context.view_layer.update()
    y=g['d'].project(g['anchors'](294.4)['north'])[1]
    if y<=1060:break
    globe_pose[2]-=.08
corrected_whole_cues={c['key'] for c in g['CUES'] if c['group'] in ['powder','book','sailor','challenge'] or c['row']==32 or c['key']=='rule:vane'}
def corrected_pose(t):
    c=g['cue_at'](t)
    if c['group']=='powder':return list(powder_pose)
    if c['group']=='book':return list(book_pose)
    if c['group']=='sailor':return list(sailor_pose)
    if c['row']==32:return list(globe_pose)
    if c['key'] in keys and t<c['start']+c['move']:
        p=list(c['pose'])
        # Gilbert is already calibrated at the lower 40% subject bound; do
        # not shrink him another ten percent simply for a decorative approach.
        zoom=1.0 if c['camera']=='gilbert' else 1.1-.1*g['u'](t,c['start'],c['move'])
        p[3]*=zoom;return p
    return original_pose(t)
replacements={};source_frames={};unique={}
for j in range(nf):
    t=j/30;c=g['cue_at'](t);planned=g['plan'](j);ref=j if planned[0]=='render' else planned[1]
    # Correct dependent holds too. A held copy of an old off-screen first
    # frame must not reappear after the camera has reached its destination.
    gesturing=c['key']=='test:if' and gesture_start<=t<=gesture_end
    if c['key'] in corrected_whole_cues or c['key'] in keys and (t<c['start']+c['move'] or ref/30<c['start']+c['move'] or gesturing):
        state=(ref,tuple(corrected_pose(t)),j if gesturing else None)
        k=unique.setdefault(state,j);replacements[j]=k;source_frames[k]=ref
frames=sorted(set(replacements.values()))
assert len(frames)==len(set(frames))
def corrected_apply(t):
    j=round(t*30)
    # Preserve the original production's object state even where its 3D hold
    # was intentional; only the camera's unsafe path changes.
    result=original_apply(source_frames.get(j,j)/30)
    challenge=g['cue_at'](t)['group']=='challenge';g['d'].show(riser,challenge)
    if challenge:
        p=g['PARTS']['terrella'];a,s,_,_=p['needles'][0]
        a.location=p['center']+.112*rr_ch;s.location=p['center']+.108*rr_ch
        g['place_angle_frame'](a.location,-30)
        result['challengeNeedle']=a.location.copy()
    if j in source_frames:g['pose_b1'](corrected_pose(t))
    if g['cue_at'](t)['row']==32:
        # Reframing up must not focus on the empty aiming point below the desk.
        focus=g['Vector'](globe_cue['pose'][:3])
        g['d'].CAM_D.dof.focus_distance=(g['d'].CAM.location-focus).length
    if g['cue_at'](t)['key']=='rule:vane':
        # Wind travels from +x toward -x. The rooster head must finish +x,
        # facing where that wind comes from, not seventy degrees away.
        g['PARTS']['vane']['root'].rotation_euler.z=math.radians(70)*(1-g['d'].back(g['d'].lin(source_frames.get(j,j)/30,107.97,108.67)))
    if g['cue_at'](t)['key']=='test:if' and gesture_start<=t<=gesture_end:
        latitude=gesture_nodes[0][1]
        for (at,angle),(bt,next_angle) in zip(gesture_nodes,gesture_nodes[1:]):
            if t>=at:latitude=angle+(next_angle-angle)*g['u'](t,at,bt-at)
        rr=g['Vector']((math.cos(math.radians(latitude)),0,math.sin(math.radians(latitude))))
        target=g['PARTS']['terrella']['center']+.099*rr+g['Vector']((0,-.03,0))
        g['touch']('kai',target,t,201.72,206.3)
    return result
g['bpy'].context.window.scene=g['d'].SC
g['d'].SC.render.resolution_x=1080;g['d'].SC.render.resolution_y=1920;g['d'].SC.render.resolution_percentage=100
g['d'].SC.eevee.taa_render_samples=16;g['d'].SC.render.image_settings.file_format='JPEG'
physical=[]
for j in frames:
    t=j/30;corrected_apply(t);g['bpy'].context.view_layer.update();c=g['cue_at'](t);pts=principal_points(c);assert pts
    projected=project_points(pts)
    box=[min(p[0] for p in projected),min(p[1] for p in projected),max(p[0] for p in projected),max(p[1] for p in projected)]
    width=(box[2]-box[0])/1080
    assert .35<=width<=.71,('Corrected camera must keep the principal object large',t,width)
    assert box[0]>=0 and box[1]>=0 and box[2]<=1080 and box[3]<=1920,('Camera crosses/clips its principal object',t,box)
    physical.append({'frame':j,'time':t,'cue':c['key'],'widthRatio':width,'box':box,'pose':corrected_pose(t)})
    if c['row']==32:
        nn=g['d'].project(g['anchors'](t)['north']);assert nn[2] and nn[1]<1120,('Needle tip still behind fixed captions',t,nn)
P.mkdir();(P/'blender').mkdir()
for name in ['plan.json','ys-chain-b1v1.json','phrase-times.json']:(P/name).symlink_to(C/name)
(P/'blender/data.json').symlink_to(C/'blender/data.json')
(P/'field-pattern-derivative.json').write_text(json.dumps({'equation':'r = L sin(theta)^2','R':.09,'L':line_constants,'fieldLines':lines,'originalFieldLines':old_lines,'originalAlignedCoordinateSha256':hashlib.sha256(repr(old_aligned).encode()).hexdigest(),'reason':'Actual first MP4 crops original L=.36/.50 outer paths; bounded true dipole curves are all displayed, not clipped or anisotropically scaled','primaryForThisShot':'complete magnetic-field pattern, not the backing board'},indent=1))
a=copy.copy(g['A']);a.cache=str(P);a.out=str(P/'blender/patch');a.times=','.join(str(j/30) for j in frames)
a.force=False;a.samples=16;a.scale=1;a.every=1;a.start=0;a.stop=1e9
scope={**g,'__file__':str(W/'scripts/blender/desk_axes_b1_camera_patch_20261024.py'),'A':a,'apply':corrected_apply}
started=time.time();print('B1 CAMERA CORRECTION START',ranges,len(frames),flush=True)
types.FunctionType(g['main'].__code__,scope)()
assert all((P/'blender/patch'/('%05d.jpg'%j)).is_file() for j in frames)
assert all(sha(p)==h for p,h in before.items()),'A supplied input or original full production changed'
assert sha(scope['__file__'])==PATCH_SOURCE_SHA,'Executed patch source changed during its run'
# Preserve the old camera report; the new report describes the delivered path.
poses=[]
for j in range(nf):
    if j in replacements:poses.append(corrected_pose(replacements[j]/30))
    else:
        planned=g['plan'](j);ref=j if planned[0]=='render' else planned[1]
        poses.append(original_pose(ref/30))
moving=[False]+[poses[i]!=poses[i-1] for i in range(1,nf)]
motion={'frames':nf,'moving_frames':sum(moving),'moving_ratio':sum(moving)/nf,'top_ratio':sum(p[5]>65 for p in poses)/nf,'method':'Original frozen path except documented off-screen inter-site moves, corrected by camera-only approaches; scene cuts count as movement'}
(P/'blender/camera-motion.json').write_text(json.dumps(motion,ensure_ascii=False,indent=1))
report={'id':'ys-chain-b1v1','frames':nf,'fps':30,'ranges':ranges,'meaningfulGesture':{'cue':'test:if','reason':'Original unchanged final gate5 found an 8.5-second static shot; point to the actual locations named by the unchanged narration','start':gesture_start,'end':gesture_end,'wordTimeAndLatitude':gesture_nodes,'noAnswerOrExtraTextAdded':True},'patchFrames':frames,'replacementFrameToActualPatchFrame':replacements,'patchFrameToUnchangedObjectSourceFrame':source_frames,'physical':physical,'allPatchFramesActuallyRendered':True,'allObjectsWithinFrame':True,'allWidths35to71':True,'oldProductionAndInputsUnchanged':True,'protectedInputSha256':before,'sourceSha256':sha(g['__file__']),'patchSourceSha256':sha(scope['__file__']),'cameraMotion':motion,'raw':str(P/'blender/patch'),'seconds':time.time()-started,'actualCompositeAndFinalMp4ReviewStillRequired':True}
report.pop('allObjectsWithinFrame',None)
report['allMeasuredPrincipalGeometryWithinFrame']=True
report['allWidths35to71IsNotThe40to70Criterion']=True
report['staticWidth40to70MustBeJudgedSeparately']=True
report['correctedWholeCues']=sorted(corrected_whole_cues)
report['fieldPatternProof']=str(P/'field-pattern-derivative.json')
report['newPoses']={'powder':powder_pose,'book':book_pose,'sailor':sailor_pose,'row32GlobeAndNeedle':globe_pose}
report['vaneCorrection']='Head finishes world +x, the origin of the unchanged wind from +x toward -x'
report['attractionConnectorCorrection']={'original':g['_b1_original_attract_20261024'],'newMiddle':[.15,-.16,.24],'sameStartAndEnd':True,'reason':'Route in front of and above the open lid instead of through the opaque wood'}
report['independentProjectionMaxDifferencePx']=projection_max_error
report['challengeNeedleSupportCorrection']={'name':riser_name,'oldNeedleRadius':.099,'newNeedleRadius':.112,'latitudeDegrees':-30,'horizontalTangentAndNoAnswerUnchanged':True,'sameCameraAndMeridianProtractor':True,'reason':'Actual first candidate hides the needle white half behind the stone; add a short transparent radial support, not a new angle or the answer'}
(P/'camera-patch.json').write_text(json.dumps(report,ensure_ascii=False,indent=1))
# Every actual held output time, including cue ends, not only freshly rendered
# states. Reapply its real source state and delivered camera before measuring.
samples=sorted(set([k*.5 for k in range(math.ceil(g['DATA']['duration']*2))]+[(min(nf-1,math.ceil(c['end']*30-1e-7)-1))/30 for c in g['CUES']]))
all_dimensions=[]
for t in samples:
    j=min(nf-1,round(t*30));actual=replacements.get(j)
    if actual is not None:corrected_apply(actual/30)
    elif j>=9794 and j<=9980:
        original_apply(j/30)
        g['d'].show(g['PARTS']['mysterybox']['lightning'],329.80<=j/30<330.5)
        if j/30<329.80:
            for ob in g['GROUPS']['mysterybox']:g['d'].show(ob,False)
    else:
        pp=g['plan'](j);ref=j if pp[0]=='render' else pp[1];original_apply(ref/30)
    g['bpy'].context.view_layer.update();c=g['cue_at'](j/30);pts=principal_points(c)
    pp=project_points(pts)
    box=[min(p[0] for p in pp),min(p[1] for p in pp),max(p[0] for p in pp),max(p[1] for p in pp)]
    width=(box[2]-box[0])/1080;moving=j>0 and poses[j]!=poses[j-1]
    all_dimensions.append({'sampleTime':t,'frame':j,'cue':c['key'],'row':c['row'],'box':box,'widthRatio':width,'within40to70':.4<=width<=.7,'smallBelow35':width<.35,'moving':moving,'clipped':box[0]<0 or box[1]<0 or box[2]>1080 or box[3]>1920,'principal':'complete magnetic-field pattern' if c['group']=='powder' else 'open book plus score board' if c['group']=='book' else c['camera'],'actualPatchedFrame':actual})
(P/'final-held-dimensions.json').write_text(json.dumps({'samples':all_dimensions,'method':'Exact actually delivered hold source and camera; powder measures physical full field paths; no background board inflation','automaticGate7or7bWaived':False,'actualMp4EyeReviewPending':True},ensure_ascii=False,indent=1))
problem=P/'problem';problem.mkdir()
(problem/'problem.json').write_bytes((C/'problem/problem.json').read_bytes())
old_format=g['d'].SC.render.image_settings.file_format
g['d'].SC.render.image_settings.file_format='PNG'
for title,fn in [('挑戦',g['challenge_setup']),('答え',g['answer_state'])]:
    fn();p=g['PARTS']['terrella'];a,s,_,_=p['needles'][0]
    a.location=p['center']+.112*rr_ch;s.location=p['center']+.108*rr_ch
    g['place_angle_frame'](a.location,-30);g['d'].show(riser,True)
    if title=='答え':g['pose_b1'](powder_pose)
    g['bpy'].context.view_layer.update();g['d'].SC.render.filepath=str(problem/(title+'.png'))
    g['bpy'].ops.render.render(write_still=True,scene=g['d'].SC.name)
g['d'].SC.render.image_settings.file_format=old_format;g['d'].show(riser,False)
assert sha(problem/'problem.json')==sha(C/'problem/problem.json')
assert sha(scope['__file__'])==PATCH_SOURCE_SHA
print('B1 CAMERA CORRECTION COMPLETE',len(frames),'actual frames',flush=True)
