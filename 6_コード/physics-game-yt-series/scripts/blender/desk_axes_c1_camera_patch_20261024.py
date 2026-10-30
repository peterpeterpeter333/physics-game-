"""C-only camera correction after the preserved full r13 production.

Root calls patch(nsC1). Actual mid-move JPEGs exposed empty wood / off-screen
incoming objects. Cut to the incoming site, then approach its exact frozen
pose by ten percent in the unchanged camera interval. No object, action,
face, caption, audio, data or original raw image is edited.
"""
import ast,copy,hashlib,json,math,os,time,types
from pathlib import Path
import numpy as np
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
ROOT=Path('/private/tmp/ys/ys-chain-c1v1')
FINAL=Path('/private/tmp/ys/ys-chain-c1v1-camera-final-20261024')
KEYS=['desk:pile','son:idea','hand:look','gear:box','carry:meter','carry:simple','carry:point','hard:9999','arm:shishi','arm:wait','arm:domino','arm:judge','dad:proto','dad:price','ch:intro','last:desk']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def patch(ns):
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];parts=g['PARTS'];nf=g['NF'];started=time.time()
    prod=json.loads((ROOT/'c1-production-r13.json').read_text());assert prod['status']=='done' and prod['missing']==0
    frozen={**prod['sourceSha256'],**prod['immutableInputSha256']}
    assert all(sha(p)==h for p,h in frozen.items());assert sha(g['__file__'])=='533b2a1bc912b6a35f7fa9020c6351649eeef8486e0207df8e25c279ab737a39'
    assert not FINAL.exists(),'Preserve earlier C camera patch output'
    bpy.context.window.scene=d.SC;assert bpy.context.scene is d.SC
    assert g['CUE']['arm:domino']['face']=={'who':'mio','ex':'kirakira','a':0,'b':1}
    original_pose=g['raw_pose'];original_apply=g['apply'];old_main=g['main'];old_out=Path(prod['out'])
    old_files={str(p):(p.stat().st_mtime_ns,p.stat().st_size) for p in old_out.glob('*.jpg')};assert len(old_files)==nf
    protected={str(old_out/n):sha(old_out/n) for n in ['meta.json','anchors.json']}
    others=[]
    for sc in bpy.data.scenes:
        p=Path(bpy.path.abspath(sc.render.filepath))
        if sc is not d.SC and p.is_file():others.append((str(p),p.stat().st_mtime_ns,p.stat().st_size,sha(p)))
    assert len(others)>=3
    ranges=[]
    for key in KEYS:
        c=g['CUE'][key];duration=.8 if key=='arm:domino' else c['move'];assert duration>0
        ranges.append({'cue':key,'start':c['start'],'end':c['start']+duration,'duration':duration,'targetPose':list(c['pose'])})
    def window(t):return next((r for r in ranges if r['start']<=t<r['end']),None)
    def corrected_pose(t):
        r=window(t)
        if r is None:return original_pose(t)
        p=list(r['targetPose']);u=d.seg(t,r['start'],r['end']);p[3]*=1.1-.1*u
        return tuple(p),True
    # Identical original first-occurrence mapping, including dependent copies.
    seen={};plans=[]
    for j in range(nf):
        k=g['scene_key'](j/30)
        if k not in seen:seen[k]=j
        plans.append(seen[k])
    assert len(seen)==prod['uniqueStates']==4317
    changed_sources={ref for ref in plans if corrected_pose(ref/30)!=original_pose(ref/30)}
    replacements={j:plans[j] for j in range(nf) if plans[j] in changed_sources}
    frames=sorted(changed_sources);assert frames
    for j in range(nf):
        if j not in replacements:assert corrected_pose(plans[j]/30)==original_pose(plans[j]/30)
    new_set_camera=types.FunctionType(g['set_camera'].__code__,{**g,'raw_pose':corrected_pose})
    def corrected_apply(t):
        j=round(t*30);ref=plans[j];result=original_apply(ref/30)
        if j in replacements:new_set_camera(ref/30)
        return result
    # Reuse the exact named-subject choices of the preserved original721 audit.
    audit_path=W/'scripts/blender/desk_axes_c1_final_halfsecond_bounds.py'
    assert sha(audit_path)=='e33a5a0b31eba44d42ab4317f741df56d91d623516fe114e27d95d4bd296bb66'
    tree=ast.parse(audit_path.read_text());audit=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='audit')
    names={'descendants','subject'};defs=[n for n in audit.body if isinstance(n,ast.FunctionDef) and n.name in names]
    scope={'g':g,'d':d,'parts':parts};exec(compile(ast.Module(body=defs,type_ignores=[]),str(audit_path),'exec'),scope)
    cache={};max_projection_error=0.
    def physical(t):
        nonlocal max_projection_error
        j=round(t*30);ref=plans[j];c=g['cue_at'](ref/30);roots,meaning,excluded=scope['subject'](c,ref/30);objects=scope['descendants'](roots)
        deps=bpy.context.evaluated_depsgraph_get();camera=np.array(d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1.,scale_y=1.))@np.array(d.CAM.matrix_world.inverted());points=[];minz=1e9;maxz=-1e9
        for o in objects:
            key=(o.name,o.data.body if o.type=='FONT' else '')
            if key not in cache:
                ev=o.evaluated_get(deps);mesh=ev.to_mesh()
                try:cache[key]=np.array([tuple(v.co)+(1.,) for v in mesh.vertices])
                finally:ev.to_mesh_clear()
            vertices=cache[key]
            if not len(vertices):continue
            world=vertices@np.array(o.matrix_world).T;clip=world@camera.T;assert np.all(clip[:,3]>1e-9),'Subject behind camera'
            xy=np.column_stack(((clip[:,0]/clip[:,3]+1)*540,(1-clip[:,1]/clip[:,3])*960));points.append(xy);minz=min(minz,float(world[:,2].min()));maxz=max(maxz,float(world[:,2].max()))
            for k in set((0,len(world)//2,len(world)-1)):
                old=d.project(tuple(world[k,:3]));err=max(abs(old[0]-xy[k,0]),abs(old[1]-xy[k,1]));max_projection_error=max(max_projection_error,float(err));assert err<=.11
        assert points,'No incoming principal geometry';p=np.concatenate(points);lo=p.min(axis=0);hi=p.max(axis=0);box=[float(lo[0]),float(lo[1]),float(hi[0]),float(hi[1])];width=float((hi[0]-lo[0])/1080)
        return {'frame':j,'time':t,'objectSourceFrame':ref,'cue':c['key'],'row':c['row'],'subject':meaning,'excluded':excluded,'box':box,'widthRatio':width,'clipped':bool(lo[0]<0 or hi[0]>1080 or lo[1]<0 or hi[1]>1920),'within35to71':.35<=width<=.71,'within40to70':.4<=width<=.7,'minimumWorldZ':minz,'maximumWorldZ':maxz,'cameraPose':list(corrected_pose(ref/30)[0])}
    proof=[];violations=[]
    for n,j in enumerate(frames):
        corrected_apply(j/30);bpy.context.view_layer.update();p=physical(j/30);proof.append(p)
        if p['clipped'] or not p['within35to71']:violations.append(p)
        if (n+1)%60==0:print('[c1 camera] guard %d/%d %.1fs'%(n+1,len(frames),time.time()-started),flush=True)
    guard=ROOT/'c1-camera-r14-preflight.json';assert not guard.exists();guard.write_text(json.dumps({'cameraOnly':True,'ranges':ranges,'frames':proof,'violations':violations,'originalSourceSha256':prod['sourceSha256'],'patchSourceSha256':sha(__file__),'originalProjectionMaxDifferencePx':max_projection_error},ensure_ascii=False,indent=1))
    assert not violations,('Camera-only preflight failed; no JPEG rendered',[(p['time'],p['cue'],p['widthRatio'],p['box']) for p in violations[:20]])
    FINAL.mkdir();(FINAL/'blender').mkdir()
    for f in ['plan.json','ys-chain-c1v1.json','phrase-times.json']:(FINAL/f).symlink_to(ROOT/f)
    for f,target in [('ys-chain-c1v1.wav',ROOT/'ys-chain-c1v1.r13.mixed.wav'),('ys-chain-c1v1.voice.wav',ROOT/'ys-chain-c1v1.voice.wav')]: (FINAL/f).symlink_to(target)
    (FINAL/'blender/data.json').symlink_to(ROOT/'blender/data.json')
    (FINAL/'blender/probe1s-r11').symlink_to(ROOT/'blender/probe1s-r11')
    (FINAL/'r11-probe-preflight').symlink_to(ROOT/'r11-probe-preflight')
    a=copy.copy(g['A']);a.cache=str(FINAL);a.out=str(FINAL/'blender/patch');a.times=','.join(str(j/30) for j in frames);a.force=False;a.samples=16;a.scale=1
    a.every=1;a.start=0;a.stop=1e9;a.no_anchors=False;a.anchors_only=False
    d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.render.resolution_percentage=100;d.SC.eevee.taa_render_samples=16;d.SC.render.image_settings.file_format='JPEG'
    main_scope={**g,'A':a,'apply':corrected_apply,'camera_motion':lambda:{'pending':True}}
    print('[c1 camera] RENDER START %d unique / %d replacements'%(len(frames),len(replacements)),flush=True)
    types.FunctionType(old_main.__code__,main_scope)()
    assert all((FINAL/'blender/patch'/('%05d.jpg'%j)).is_file() for j in frames)
    delivered=FINAL/'blender/desk';delivered.mkdir();anchors=json.loads((old_out/'anchors.json').read_text());patch_anchors=json.loads((FINAL/'blender/patch/anchors.json').read_text())
    for j in range(nf):
        target=FINAL/'blender/patch'/('%05d.jpg'%replacements[j]) if j in replacements else old_out/('%05d.jpg'%j)
        (delivered/('%05d.jpg'%j)).symlink_to(target)
        if j in replacements:
            for key,values in patch_anchors['anchors'].items():
                if key not in anchors['anchors']:anchors['anchors'][key]=[[0,0,0] for _ in range(nf)]
                anchors['anchors'][key][j]=values[replacements[j]]
    (delivered/'anchors.json').write_text(json.dumps(anchors));(delivered/'meta.json').write_text(json.dumps({'frames':nf,'done':nf,'missing':0,'originalUnique':4317,'actualPatchFrames':len(frames),'replacedOutputFrames':len(replacements),'fps':30}))
    poses=[corrected_pose(plans[j]/30)[0] if j in replacements else original_pose(plans[j]/30)[0] for j in range(nf)];moving=[False]+[poses[j]!=poses[j-1] for j in range(1,nf)]
    motion={'frames':nf,'moving_frames':sum(moving),'moving_ratio':sum(moving)/nf,'method':'Exact delivered held-source poses; cuts count as movement; only listed inter-site entrances use cut plus ten-percent approach'}
    assert motion['moving_ratio']<=.2;(FINAL/'blender/camera-motion.json').write_text(json.dumps(motion,indent=1))
    all_physical=[]
    samples=sorted(set([k*.5 for k in range(math.floor(g['DUR']*2)+1)]+[(math.ceil(c['end']*30-1e-7)-1)/30 for c in g['CUES']]))
    for t in samples:
        j=min(nf-1,round(t*30));corrected_apply(j/30);bpy.context.view_layer.update();p=physical(j/30);p['patched']=j in replacements;all_physical.append(p)
    for p,(mtime,size) in old_files.items():st=os.stat(p);assert st.st_mtime_ns==mtime and st.st_size==size,'Original raw changed'
    assert all(sha(p)==h for p,h in {**frozen,**protected}.items())
    for p,mtime,size,h in others:st=os.stat(p);assert st.st_mtime_ns==mtime and st.st_size==size and sha(p)==h,'Other scene output changed'
    report={'episode':'ys-chain-c1v1','revision':'r14-camera-only','root':str(FINAL),'originalRoot':str(ROOT),'frames':nf,'ranges':ranges,'patchFrames':frames,'replacementFrameToActualPatchFrame':replacements,'patchFrameToUnchangedObjectSourceFrame':{j:plans[j] for j in frames},'originalSourceSha256':prod['sourceSha256'],'immutableInputSha256':prod['immutableInputSha256'],'patchSourceSha256':sha(__file__),'cameraOnly':True,'allPatchJpegsActuallyRendered':True,'allMeasuredPatchGeometryWithinFrame':True,'allPatchWidths35to71':True,'notClaimingAll40to70':True,'originalRawMtimeSizeUnchanged':True,'originalMetaAndAnchorsShaUnchanged':True,'allFrozenInputsUnchanged':True,'otherSceneOutputsUnchanged':True,'cameraMotion':motion,'seconds':time.time()-started,'original721AuditPreserved':str(ROOT/'c1-final-held-halfsecond-bounds.json'),'preflight':str(guard),'raw':str(FINAL/'blender/patch'),'actualCompositeAndFinalMp4ReviewPending':True}
    (FINAL/'camera-patch.json').write_text(json.dumps(report,ensure_ascii=False,indent=1));(FINAL/'final-held-dimensions.json').write_text(json.dumps({'samples':all_physical,'method':'Exact delivered held-source state and patched camera; same named subjects as original721 audit; no geometry inflation','original7bNotWaived':True,'actualVisualReviewPending':True},ensure_ascii=False,indent=1))
    original_apply((nf-1)/30)
    print('[c1 camera] DONE '+str(FINAL),flush=True);return report
