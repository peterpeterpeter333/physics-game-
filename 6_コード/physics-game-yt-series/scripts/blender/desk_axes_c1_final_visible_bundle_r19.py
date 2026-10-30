"""C19 final mandatory-action bundle after preserved C17 MP4 review.

Root alone calls trial(nsC1), reviews actual probes, then finish(nsC1).
There is no queue submission or render on import. Supplied narration, voice,
captions, face timing, arithmetic formulas and all original/C17 raw files stay fixed.
Three visible repairs plus the explicitly required row38 delayed human point:
true23-paper/whole-eight framing, C-only picture-front1mm, and score timing.
The 2D row7 reveal and matching low point sound are separate private derivatives.
"""
import ast,copy,hashlib,json,math,os,time,types
from pathlib import Path
import numpy as np

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
BASE=Path('/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r17')
TRIAL=Path('/private/tmp/ys/ys-chain-c1v1-visible-r19-trial')
FINAL=Path('/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r19')
AUDIT=W/'scripts/blender/desk_axes_c1_final_halfsecond_bounds.py'
BASE_SHA='93bbfc0c8abcf08dac7b1266ca05d2727ec15de790bee21a0d74c4991d4ba20b'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def save(p,v):Path(p).write_text(json.dumps(v,ensure_ascii=False,indent=1))

def setup(ns):
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];parts=g['PARTS'];proof=read(BASE/'camera-patch.json');nf=g['NF']
    assert sha(BASE/'camera-patch.json')==BASE_SHA and nf==10814
    assert sha(AUDIT)=='e33a5a0b31eba44d42ab4317f741df56d91d623516fe114e27d95d4bd296bb66'
    frozen={**proof['originalSourceSha256'],**proof['immutableInputSha256'],**proof['patchDependencySha256'],str(AUDIT):sha(AUDIT),str(Path(__file__).resolve()):sha(__file__)}
    assert all(sha(p)==h for p,h in frozen.items())
    previous_scene=bpy.context.window.scene;previous_path=d.SC.render.filepath
    bpy.context.window.scene=d.SC
    previous_settings=(d.SC.render.resolution_x,d.SC.render.resolution_y,d.SC.render.resolution_percentage,d.SC.eevee.taa_render_samples,d.SC.render.image_settings.file_format)
    original_apply=g['apply'];original_pose=g['raw_pose'];functions={k:g[k] for k in ['apply','raw_pose','set_camera','main','anchors','scene_key']}
    panel=d.fr
    assert panel in list(d.SC.objects) and panel.type=='MESH'
    assert (panel.location-g['Vector']((.75,1.235,.55))).length<1e-5
    assert len(panel.data.materials)==1 and 'pic' in panel.data.materials[0].name
    frame=[o for o in d.SC.objects if o.type=='MESH' and (o.location-g['Vector']((.75,1.245,.55))).length<1e-5 and abs(o.dimensions.x-.4)<1e-4 and abs(o.dimensions.y-.02)<1e-4 and abs(o.dimensions.z-.32)<1e-4]
    assert len(frame)==1 and abs(frame[0].location.y-frame[0].dimensions.y/2-panel.location.y)<1e-5
    panel_matrix=panel.matrix_world.copy();panel_material=panel.data.materials[0];panel_identity=(panel.name,panel.data.name,panel_material.name)
    panel_record={'object':panel.name,'mesh':panel.data.name,'material':panel_material.name,'oldMatrix':[[float(x) for x in row] for row in panel_matrix],'offsetWorld':[0,-.001,0],'newMatrix':[[float(x)-(.001 if i==1 and k==3 else 0) for k,x in enumerate(row)] for i,row in enumerate(panel_matrix)],'woodenFrame':frame[0].name,'onlyScene':d.SC.name}
    other_files=[]
    for sc in bpy.data.scenes:
        p=Path(bpy.path.abspath(sc.render.filepath))
        if sc is not d.SC and p.is_file():st=p.stat();other_files.append((str(p),st.st_mtime_ns,st.st_size,sha(p)))
    assert len(other_files)>=3
    old_inventory={str(p):(p.stat().st_mtime_ns,p.stat().st_size) for p in (BASE/'blender/desk').glob('*.jpg')};assert len(old_inventory)==nf
    protected={str(p):sha(p) for p in [BASE/'camera-patch.json',BASE/'blender/desk/anchors.json',BASE/'blender/desk/meta.json',BASE/'out/ys-chain-c1v1.mp4']}
    # Root-specific subject definitions are reused read-only, not rebound.
    tree=ast.parse(AUDIT.read_text());ad=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='audit');defs=[n for n in ad.body if isinstance(n,ast.FunctionDef) and n.name in {'descendants','subject'}]
    scope={'g':g,'d':d,'parts':parts};exec(compile(ast.Module(body=defs,type_ignores=[]),str(AUDIT),'exec'),scope)
    semantic=proof['deliveredSemanticSourceMap'];assert len(semantic)==nf
    paper_start=g['S']('desk:pile');paper_end=g['S']('son:idea');eight_start=g['S']('hard:crack');eight_end=g['S']('hard:judge')
    score_old=g['FX']['price'];score_new=g['VE']('dad:price')+.15;score_end=g['S']('dad:shown')
    assert abs(score_old-307.65266666666673)<1e-7 and abs(score_new-312.4676666666667)<1e-7
    score_record={'row':38,'oldPointTime':score_old,'newPointTime':score_new,'voiceEnd':g['VE']('dad:price'),'fixedFaceStartWordTime':g['T']('dad:price','ありませんでした'),'fixedFaceEnd':g['E']('dad:price'),'firstNextCueHudTime':score_end,'reason':'Individual row38 explicitly awards human point after ありませんでした, not at 高くて. Score state alone changes; supplied q.score, voice, captions and face remain untouched.'}
    def score_changed(j):return score_old<=j/30<score_end
    def score_phase(j):
        if not score_changed(j):return None
        dt=j/30-score_new
        return 'zero-before-conclusion' if dt<0 else ('pulse',j) if dt<.45 else 'one-after-conclusion'
    assert abs(paper_start-26.062666666666665)<1e-6 and abs(eight_start-209.07266666666663)<1e-6
    mesh_cache={};maximum_error=0.;pose_cache={};eight_target=None
    def base_pose(ref):
        if ref in proof['r17ActualSourceFrames']:return tuple(g['CUE']['desk:rouen']['pose'])
        t=ref/30;r=next((r for r in proof['ranges'] if r['start']<=t<r['end']),None)
        if r is None:return tuple(original_pose(t)[0])
        p=list(r['targetPose']);u=d.seg(t,r['start'],r['moveEnd']);a=.8 if r['cue']=='carry:simple' else 1.02 if r['cue'] in {'hard:9999','arm:wait','ch:intro'} else 1.04 if r['cue']=='gear:box' else 1.1;p[3]*=a+(1-a)*u;return tuple(p)
    private_set_camera=types.FunctionType(g['set_camera'].__code__,{**g,'raw_pose':lambda t:(base_pose(round(t*30)),False)})
    def baseline(j):
        ref=semantic[j];c=original_apply(ref/30);private_set_camera(ref/30)
        if ref in proof['r17ActualSourceFrames']:
            d.pose_cam(tuple(g['CUE']['desk:rouen']['pose']));top=min(23,6+int(ref/30/1.5))-1;target=parts['papers']['papers'][top][1]+g['Vector']((0,0,.0007));d.CAM_D.dof.focus_distance=(d.CAM.location-target).length;d.CAM_D.dof.aperture_fstop=2.8
            grip=d.quill.location+d.quill.rotation_euler.to_matrix()@g['Vector']((0,0,.060));d.set_hand('kai',grip,150,-30,vis=True)
        bpy.context.view_layer.update();return c
    def world_points(roots):
        deps=bpy.context.evaluated_depsgraph_get();points=[];objects=scope['descendants'](roots)
        for ob in objects:
            key=(ob.name,ob.data.body if ob.type=='FONT' else '')
            if key not in mesh_cache:
                ev=ob.evaluated_get(deps);me=ev.to_mesh()
                try:mesh_cache[key]=np.array([tuple(v.co)+(1.,) for v in me.vertices],dtype=np.float64)
                finally:ev.to_mesh_clear()
            if len(mesh_cache[key]):points.append(mesh_cache[key]@np.array(ob.matrix_world).T)
        assert points,'No visible named geometry';return np.concatenate(points),objects
    def project(points):
        nonlocal maximum_error
        deps=bpy.context.evaluated_depsgraph_get();m=np.array(d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1.,scale_y=1.))@np.array(d.CAM.matrix_world.inverted());clip=points@m.T
        assert np.all(clip[:,3]>1e-9),'Named principal behind camera';xy=np.column_stack(((clip[:,0]/clip[:,3]+1)*540,(1-clip[:,1]/clip[:,3])*960))
        for k in set((0,len(points)//2,len(points)-1)):
            old=d.project(tuple(points[k,:3]));e=max(abs(old[0]-xy[k,0]),abs(old[1]-xy[k,1]));maximum_error=max(maximum_error,float(e));assert e<=.11
        return xy
    def measure(roots):
        points,objects=world_points(roots);xy=project(points);lo=xy.min(axis=0);hi=xy.max(axis=0);w=float((hi[0]-lo[0])/1080)
        return {'box':[float(x) for x in [*lo,*hi]],'widthRatio':w,'clipped':bool(lo[0]<0 or hi[0]>1080 or lo[1]<0 or hi[1]>1920),'within40to70':.4<=w<=.7,'objects':len(objects),'evaluatedVertices':len(points),'minimumWorldZ':float(points[:,2].min()),'maximumWorldZ':float(points[:,2].max())}
    def fit(roots,pose,center_y=None):
        points,_=world_points(roots);p=list(pose)
        if center_y is not None:p[:3]=list((points[:,:3].min(axis=0)+points[:,:3].max(axis=0))/2)
        for _ in range(10):
            d.pose_cam(p);bpy.context.view_layer.update();xy=project(points);lo=xy.min(axis=0);hi=xy.max(axis=0);w=(hi[0]-lo[0])/1080
            if center_y is not None:
                delta=(lo+hi)/2-np.array([540.,center_y]);deps=bpy.context.evaluated_depsgraph_get();cp=np.array(d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1.,scale_y=1.));right=np.array(d.CAM.matrix_world)[:3,0];up=np.array(d.CAM.matrix_world)[:3,1]
                aim=np.array(p[:3])+right*delta[0]*p[3]/(cp[0,0]*540)-up*delta[1]*p[3]/(cp[1,1]*960);p[:3]=[float(v) for v in aim]
            p[3]*=float(w/.66)
        d.pose_cam(p);bpy.context.view_layer.update();a=measure(roots);assert a['within40to70'] and not a['clipped'],('Named-principal fit failed',a,p);return tuple(p)
    def paper_roots():return [r for r,p in parts['papers']['papers'] if not r.hide_render]
    def new_pose(j):
        nonlocal eight_target
        ref=semantic[j];t=ref/30
        if ref in pose_cache:return pose_cache[ref]
        if paper_start<=t<paper_end:
            roots=paper_roots();assert len(roots)==23
            p=fit(roots,tuple(g['CUE']['desk:pile']['pose']),center_y=810.)
            # A quiet 4% entrance, then only follow the unchanged physical fall.
            p=list(p);p[3]*=1.04-.04*d.seg(t,paper_start,paper_start+1);p=tuple(p);kind='paper23'
        elif eight_start<=t<eight_end:
            if eight_target is None:
                # Fit the original whole eight-wheel assembly, not an inflated hand.
                save_ref=ref;baseline(round((eight_start+1.1)*30));eight_target=fit([parts['eight']['root']],tuple(g['CUE']['hard:crack']['pose']));baseline(j)
            p=list(eight_target);p[3]*=1.08-.08*d.seg(t,eight_start,eight_start+1);p=tuple(p);kind='eight'
        else:p=base_pose(ref);kind=None
        pose_cache[ref]=(p,kind);return p,kind
    def panel_visible():
        # Homogeneous six-plane polygon clipping; not just a bounding rectangle.
        deps=bpy.context.evaluated_depsgraph_get();m=np.array(d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1.,scale_y=1.))@np.array(d.CAM.matrix_world.inverted());vs=[np.array(tuple(v.co)+(1.,))@np.array(panel.matrix_world).T@m.T for v in panel.data.vertices]
        order=list(panel.data.polygons[0].vertices);poly=[vs[k] for k in order]
        for axis,sign in [(0,1),(0,-1),(1,1),(1,-1),(2,1),(2,-1)]:
            out=[]
            for a,b in zip(poly,poly[1:]+poly[:1]):
                fa=a[3]+sign*a[axis];fb=b[3]+sign*b[axis];ia=fa>=0;ib=fb>=0
                if ia:out.append(a)
                if ia!=ib:out.append(a+(b-a)*fa/(fa-fb))
            poly=out
            if not poly:return False
        if any(v[3]<=0 for v in poly):return False
        xy=np.array([[(v[0]/v[3]+1)*540,(1-v[1]/v[3])*960] for v in poly]);area=abs(sum(a[0]*b[1]-a[1]*b[0] for a,b in zip(xy,np.roll(xy,-1,axis=0))))/2
        return area>1.
    def apply(j,offset=False):
        c=baseline(j)
        visible_before={o.name:(tuple(tuple(float(x) for x in r) for r in o.matrix_world),o.hide_render,o.data.body if o.type=='FONT' else '',tuple((m.name,tuple(m.diffuse_color)) for m in o.data.materials) if hasattr(o.data,'materials') else ()) for o in d.SC.objects if o is not panel and o is not d.CAM and not o.hide_render}
        p,kind=new_pose(j)
        if kind is not None:d.pose_cam(p)
        if kind=='paper23':
            pp,_=world_points(paper_roots());target=g['Vector'](tuple((pp[:,:3].min(axis=0)+pp[:,:3].max(axis=0))/2));d.CAM_D.dof.focus_distance=(d.CAM.location-target).length;d.CAM_D.dof.aperture_fstop=11.
        if offset:panel.matrix_world.translation=panel_matrix.translation+g['Vector']((0,-.001,0))
        else:panel.matrix_world=panel_matrix.copy()
        bpy.context.view_layer.update()
        visible_after={o.name:(tuple(tuple(float(x) for x in r) for r in o.matrix_world),o.hide_render,o.data.body if o.type=='FONT' else '',tuple((m.name,tuple(m.diffuse_color)) for m in o.data.materials) if hasattr(o.data,'materials') else ()) for o in d.SC.objects if o is not panel and o is not d.CAM and not o.hide_render}
        assert visible_before==visible_after,'A camera-only/panel-only correction changed another visible object'
        if score_changed(j):
            # This is an explicit score-animation correction, not a claim that
            # every delivered object source stayed identical to the old raw.
            dt=j/30-score_new;digit=d.dg['make'];digit.data.body='0' if dt<0 else '1'
            sc=1+.45*math.sin(math.pi*dt/.45) if 0<=dt<.45 else 1.;digit.scale=(sc,sc,sc)
            assert d.dg['brk'].data.body=='2'
            bpy.context.view_layer.update()
        return c,p,kind
    def physical(j):
        ref=semantic[j];c=g['cue_at'](ref/30);p,kind=new_pose(j)
        if kind=='paper23':roots=paper_roots();meaning='語られている帳簿23枚の山と机上へ広がる全23枚';excluded='手・ペン・ろうそく・机。最上面1枚だけを全群の代用にしない'
        elif kind=='eight':roots=[parts['eight']['root']];meaning='全8歯車とその必要な支持枠';excluded='手・机・他模型'
        else:roots,meaning,excluded=scope['subject'](c,ref/30)
        return {'frame':j,'time':j/30,'objectSourceFrame':ref,'scoreStateTime':j/30 if score_changed(j) else None,'delayedHumanScore':{'make':d.dg['make'].data.body,'brk':d.dg['brk'].data.body,'scale':list(d.dg['make'].scale)} if score_changed(j) else None,'cameraOperationTime':ref/30,'cue':c['key'],'row':c['row'],'subject':meaning,'excluded':excluded,'cameraPose':list(p),'focusDistance':float(d.CAM_D.dof.focus_distance),'fstop':float(d.CAM_D.dof.aperture_fstop),'localCorrection':kind,**measure(roots),'actualVisibilityNotEstablishedByBoundsAlone':True}
    def verify():
        assert all(g[k] is v for k,v in functions.items()),'Frozen namespace functions were rebound'
        assert all(sha(p)==h for p,h in {**frozen,**protected}.items())
        for p,(mt,size) in old_inventory.items():st=os.stat(p);assert (st.st_mtime_ns,st.st_size)==(mt,size)
        for p,mt,size,h in other_files:st=os.stat(p);assert (st.st_mtime_ns,st.st_size,sha(p))==(mt,size,h)
        assert panel_identity==(panel.name,panel.data.name,panel.data.materials[0].name) and panel.data.materials[0] is panel_material
    def restore():
        panel.matrix_world=panel_matrix.copy();original_apply((nf-1)/30);d.SC.render.filepath=previous_path
        d.SC.render.resolution_x,d.SC.render.resolution_y,d.SC.render.resolution_percentage,d.SC.eevee.taa_render_samples,d.SC.render.image_settings.file_format=previous_settings
        bpy.context.window.scene=previous_scene;bpy.context.view_layer.update();assert np.max(np.abs(np.array(panel.matrix_world)-np.array(panel_matrix)))<1e-12;verify()
    return locals()

def preflight(s,out):
    g=s['g'];proof=s['proof'];nf=s['nf'];seen={};groups={};baseline=s['baseline'];apply=s['apply'];started=time.time()
    production=read(Path(proof['originalRoot'])/'c1-production-r13.json');source_hashes={}
    for j in range(nf):
        source=Path(proof['raw'])/('%05d.jpg'%proof['replacementFrameToActualPatchFrame'][str(j)]) if str(j) in proof['replacementFrameToActualPatchFrame'] else Path(production['out'])/('%05d.jpg'%proof['originalHeldSourceMap'][j])
        actual=str(source.resolve())
        if actual not in source_hashes:source_hashes[actual]=sha(source)
        assert sha(BASE/'blender/desk'/('%05d.jpg'%j))==source_hashes[actual],('Incorrect C17 held-source evidence',j)
        key=(actual,proof['deliveredSemanticSourceMap'][j],s['score_phase'](j));seen.setdefault(key,j);groups.setdefault(seen[key],[]).append(j)
    rows=[];replacements={};reasons={};violations=[];poses={};semantic_closeups=[]
    for n,(j,outputs) in enumerate(groups.items()):
        baseline(j);p,kind=s['new_pose'](j);s['d'].pose_cam(p);s['bpy'].context.view_layer.update();background=s['panel_visible']()
        if kind or background or s['score_changed'](j):
            apply(j);r=s['physical'](j);r.update(picturePanelVisible=background,dependentOutputFrames=outputs);rows.append(r)
            why=([kind] if kind else [])+(['picture-front1mm'] if background else [])+(['row38-delayed-human-point'] if s['score_changed'](j) else []);reasons[j]=why
            for o in outputs:replacements[o]=j
            if kind and (not r['within40to70'] or r['clipped']):violations.append(r)
        poses[j]=list(p)
        if (n+1)%150==0:print('[C18] physical %d/%d %.1fs, replacements %d'%(n+1,len(groups),time.time()-started,len(rows)),flush=True)
    # Two potentially misleading whole-container measurements are supplemented
    # with genuine functional parts at the exact delivered state, never an arm.
    for j in [2265,2280,2475,2715,2730,3585,4425,4440,5565,6795]:
        apply(j);parts=s['parts'];one=j in {2265,2280};indices=[4] if one else [3,4];roots=[parts['m1']['dials'][k] for k in indices]+[parts['m1']['windows'][k] for k in indices]
        c=s['g']['cue_at'](j/30);r={'frame':j,'time':j/30,'cue':c['key'],'actualSource':str((BASE/'blender/desk'/('%05d.jpg'%j)).resolve()),'actualSourceSha256':sha(BASE/'blender/desk'/('%05d.jpg'%j)),'functionalSubject':'一の位の入力盤1枚と対応する値の窓1枚' if one else '十/一の入力盤2枚と対応する値の窓2枚','excluded':'手、外木箱、未使用の左側盤をfunctional主役へ水増ししない','cameraPose':list(s['new_pose'](j)[0]),'functionalParts':s['measure'](roots),'M1ContextOnlyNotAutomaticallyPrincipal':s['measure']([parts['m1']['root']]),'notAutomaticAcceptance':True}
        if j in {3585,4425,4440,5565,6795}:r['incomingOrFadingMechanismPairOnly']=s['measure']([w['root'] for w in parts['m2']['wheels'][3:5]])
        semantic_closeups.append(r)
    result={'revision':'r19-three-real-visible-repairs-plus-required-row38-point-timing','base':str(BASE),'baseProofSha256':BASE_SHA,'patchSourceSha256':sha(__file__),'dependencySha256':s['frozen'],'frames':rows,'violations':violations,'replacementFrameToActualPatchFrame':replacements,'reasons':reasons,'posesByRepresentative':poses,'allBaseOutputGroups':groups,'functionalCloseupSupplement':semantic_closeups,'picturePanel':s['panel_record'],'scoreTimingCorrection':s['score_record'],'otherVisibleObjectsUnchangedExceptRecordedScoreBodyAndPulse':True,'originalNgEvidenceUnchanged':True,'actualImageApprovalPending':True,'seconds':time.time()-started}
    print('[C18] COUNTS %d actual / %d output replacements; paper %d, eight %d, panel %d'%(len(rows),len(replacements),sum(r['localCorrection']=='paper23' for r in rows),sum(r['localCorrection']=='eight' for r in rows),sum(r['picturePanelVisible'] for r in rows)),flush=True)
    save(out,result);assert not violations,('Strict40–70/clip preflight failed; no JPEG drawn',[(r['time'],r['subject'],r['widthRatio'],r['box']) for r in violations[:10]])
    return result

def render(s,frames,out):
    out.mkdir(parents=True,exist_ok=False);d=s['d'];bpy=s['bpy'];g=s['g'];items=[];anchors={};d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.render.resolution_percentage=100;d.SC.eevee.taa_render_samples=16;d.SC.render.image_settings.file_format='JPEG'
    for n,j in enumerate(frames):
        s['apply'](j,offset=True)
        for key,point in g['anchors'](j/30).items():anchors.setdefault(key,{})[j]=d.project(point)
        f=out/('%05d.jpg'%j);d.SC.render.filepath=str(f);bpy.ops.render.render(write_still=True,scene=d.SC.name);assert f.stat().st_size>1024
        items.append({'frame':j,'time':j/30,'file':str(f),'sha256':sha(f),'objectSourceFrame':s['semantic'][j],'scoreStateTime':j/30 if s['score_changed'](j) else None})
        if (n+1)%30==0:print('[C18] actual %d/%d'%(n+1,len(frames)),flush=True)
    return items,anchors

def trial(ns):
    assert not TRIAL.exists() and not FINAL.exists();s=setup(ns);TRIAL.mkdir();started=time.time()
    try:
        guard=preflight(s,TRIAL/'preflight.json');allframes={r['frame'] for r in guard['frames']}
        wanted=[783,900,926,940,960,1013,6285,6305,6510,8758,8761,9075,9085,9240,9375,10180,10215]
        # Each requested point resolves to the delivered actual-source group.
        groups=guard['allBaseOutputGroups'];reverse={int(o):int(k) for k,outs in groups.items() for o in outs};frames=sorted({reverse[j] for j in wanted if reverse[j] in allframes});assert len(frames)>=10
        items,anc=render(s,frames,TRIAL/'raw');s['verify']();report={'revision':guard['revision'],'notFinalVideo':True,'sourceSha256':sha(__file__),'baseProofSha256':BASE_SHA,'preflight':str(TRIAL/'preflight.json'),'preflightSha256':sha(TRIAL/'preflight.json'),'frames':frames,'actualFiles':items,'anchors':anc,'picturePanel':s['panel_record'],'scoreTimingCorrection':s['score_record'],'allFrozenInputsUnchanged':True,'otherSceneLastOutputsUnchanged':True,'allActualImagesViewed':False,'seconds':time.time()-started};save(TRIAL/'trial.json',report);print('[C19] ACTUAL TRIAL DONE '+str(TRIAL),flush=True);return report
    finally:s['restore']()

def finish(ns):
    assert not FINAL.exists();s=setup(ns);tr=read(TRIAL/'trial.json');qa=read(TRIAL/'human-qa.json');assert tr['sourceSha256']==sha(__file__) and qa['trialSha256']==sha(TRIAL/'trial.json')
    assert qa['allActualTrialImagesViewed'] and qa['paperFallReadable'] and qa['eightWheelsFullyVisible'] and qa['pictureFlickerResolved'] and qa['row38NoHumanPointBeforeConclusion'] and qa['readyForLocalReplacement'];started=time.time()
    try:
        FINAL.mkdir();(FINAL/'blender').mkdir();guard=preflight(s,FINAL/'c1-r18-preflight.json');frames=sorted(r['frame'] for r in guard['frames']);items,anc=render(s,frames,FINAL/'blender/local-r18');base=s['proof'];nf=s['nf'];newmap={int(j):int(k) for j,k in guard['replacementFrameToActualPatchFrame'].items()};replacements={int(j):int(k) for j,k in base['replacementFrameToActualPatchFrame'].items()};replacements.update(newmap)
        combined=sorted(set(base['patchFrames']+frames));raw=FINAL/'blender/patch';raw.mkdir()
        for j in combined:(raw/('%05d.jpg'%j)).symlink_to(FINAL/'blender/local-r18'/('%05d.jpg'%j) if j in frames else Path(base['raw'])/('%05d.jpg'%j))
        for f in ['plan.json','ys-chain-c1v1.json','phrase-times.json','ys-chain-c1v1.wav','ys-chain-c1v1.voice.wav']:(FINAL/f).symlink_to(BASE/f)
        for f in ['data.json','probe1s-r11']:(FINAL/'blender'/f).symlink_to(BASE/'blender'/f)
        (FINAL/'r11-probe-preflight').symlink_to(BASE/'r11-probe-preflight');desk=FINAL/'blender/desk';desk.mkdir();anchors=read(BASE/'blender/desk/anchors.json')
        for j in range(nf):
            (desk/('%05d.jpg'%j)).symlink_to(raw/('%05d.jpg'%newmap[j]) if j in newmap else BASE/'blender/desk'/('%05d.jpg'%j))
            if j in newmap:
                for key,values in anc.items():anchors['anchors'][key][j]=values[newmap[j]]
        hash_cache={}
        def cached_hash(p):
            real=str(Path(p).resolve())
            if real not in hash_cache:hash_cache[real]=sha(real)
            return hash_cache[real]
        for j,k in replacements.items():assert cached_hash(desk/('%05d.jpg'%j))==cached_hash(raw/('%05d.jpg'%k)),('Actual-source map collision',j,k)
        save(desk/'anchors.json',anchors);save(desk/'meta.json',{'frames':nf,'done':nf,'missing':0,'fps':30,'newActualC18':len(frames),'actualPatchSourcesTotal':len(combined)})
        group_for={int(j):int(k) for k,outs in guard['allBaseOutputGroups'].items() for j in outs};poses=[guard['posesByRepresentative'][str(group_for[j])] if str(group_for[j]) in guard['posesByRepresentative'] else guard['posesByRepresentative'][group_for[j]] for j in range(nf)];moving=sum(poses[j]!=poses[j-1] for j in range(1,nf));motion={'frames':nf,'moving_frames':moving,'moving_ratio':moving/nf,'top_frames':sum(p[5]>=65 for p in poses),'top_ratio':sum(p[5]>=65 for p in poses)/nf,'top_method':'Every actual delivered output pose; elevation>=65 degrees, separate from original gate image-estimated wood_top metric. No samples or overlays excluded.','allDeliveredPoses':poses,'method':'Exact delivered per-output camera poses. True23-paper union fit66% follows the unmodified fall; eight-wheel full assembly fit66%; all other C17 camera poses retained. Cuts count.'};assert motion['moving_ratio']<=.2 and motion['top_ratio']<=.2;save(FINAL/'blender/camera-motion.json',motion)
        samples=read(BASE/'final-held-dimensions.json')['samples'];dims=[]
        for p in samples:
            j=p['frame']
            if j in newmap:s['apply'](j,offset=True);p={**s['physical'](j),'patched':True,'r18NewActualSourceFrame':newmap[j]}
            dims.append(p)
        save(FINAL/'final-held-dimensions.json',{'samples':dims,'method':'Exact C17 semantic sources and C18 delivered cameras. Full23 papers are measured when those23 papers are the narrated principal; original top-one-sheet and original721 NG evidence remain preserved. Panel-only redraw does not reclassify other principals.','actualVisualReviewPending':True,'original7bNotWaived':True})
        report={**base,'revision':'r19-true-paper23-eight-framing-C-only-picture-front-and-row38-point-timing','root':str(FINAL),'raw':str(raw),'patchSourceSha256':sha(__file__),'patchDependencySha256':s['frozen'],'baseR17':str(BASE),'baseR17ProofSha256':BASE_SHA,'patchFrames':combined,'replacementFrameToActualPatchFrame':replacements,'patchFrameToSemanticObjectSourceFrame':{**base['patchFrameToSemanticObjectSourceFrame'],**{j:s['semantic'][j] for j in frames}},'r19ScoreTimingCorrection':s['score_record'],'r19ScoreChangedOutputFrames':[j for j in newmap if s['score_changed'](j)],'r18ActualFiles':items,'r18ActualFrames':frames,'r18ReplacementOutputs':newmap,'r18CorrectionReasons':guard['reasons'],'r18PicturePanel':s['panel_record'],'r18AllNewCameraPrincipalWithin40to70AndUnclipped':True,'r18BackgroundOnlyNotRelabelledAsPhysicalWaiver':True,'originalObjectFormulaUnchanged':False,'arithmeticAndMainObjectFormulaUnchanged':True,'additionalOnlyCScenePanelTransformAndRecordedScoreBodyPulseDuringRender':True,'r17CandidateRawAndMp4Unchanged':True,'cameraOnly':False,'cameraAndConfirmedSemanticHoldCorrectionOnly':True,'cameraFramingPlusPrivateBackgroundOffsetAndScoreTimingOnly':True,'allPatchJpegsActuallyRendered':True,'allMeasuredPatchGeometryWithinFrame':all(not p['clipped'] for p in guard['frames']),'backgroundOnlyOriginalNamedPrincipalClipDiagnostics':[p for p in guard['frames'] if p['localCorrection'] is None and p['clipped']],'notClaimingAll40to70':True,'cameraMotion':motion,'localR18Seconds':time.time()-started,'secondsIncludingAllPatches':base['secondsIncludingR16Patch']+time.time()-started,'r18Trial':str(TRIAL/'trial.json'),'r18TrialHumanQa':str(TRIAL/'human-qa.json'),'r18Preflight':str(FINAL/'c1-r18-preflight.json'),'actualCompositeAndFinalMp4ReviewPending':True};save(FINAL/'camera-patch.json',report);s['verify']();print('[C19] LOCAL REPLACEMENT DONE '+str(FINAL),flush=True);return report
    finally:s['restore']()
