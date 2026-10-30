"""C-only local repair of the actual wood-only gap before the crowd rises.

Root calls trial(nsC1), waits for four actual images to be reviewed, then calls
finish(nsC1). No GPU submission occurs here. Original r13 and r16 raw files,
supplied words/voice/captions/face and the original .8s crowd rise stay fixed.
"""
import copy,hashlib,json,math,os,time
from pathlib import Path
import numpy as np
R16=Path('/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r16')
TRIAL=Path('/private/tmp/ys/ys-chain-c1v1-crowd-r17-trial')
FINAL=Path('/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r17')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def save(p,v):Path(p).write_text(json.dumps(v,ensure_ascii=False,indent=1))

def setup(ns):
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];proof=read(R16/'camera-patch.json')
    assert proof['patchSourceSha256']=='9e0aee1daff68af6a45e1156481848ed634f6aafb9fe488bc53470a614e72d06'
    frozen={**proof['originalSourceSha256'],**proof['immutableInputSha256'],**proof['patchDependencySha256'],str(Path(__file__).resolve()):sha(__file__)}
    assert all(sha(p)==h for p,h in frozen.items());bpy.context.window.scene=d.SC
    word=g['T']('desk:revolt','大きな反乱');start=word-g['CUE']['desk:revolt']['move'];cut=word+.4
    assert abs(word-15.96)<1e-7 and abs(cut-16.36)<1e-7
    frames=list(range(math.ceil(start*30),math.ceil(cut*30)));assert len(frames)==42
    deskpose=tuple(g['CUE']['desk:rouen']['pose']);crowdpose=tuple(g['CUE']['desk:revolt']['pose']);original_apply=g['apply']
    def apply(t):
        c=original_apply(t)
        if start<=t<cut:
            d.pose_cam(deskpose)
            top=min(23,6+int(t/1.5))-1;target=g['PARTS']['papers']['papers'][top][1]+g['Vector']((0,0,.0007))
            d.CAM_D.dof.focus_distance=(d.CAM.location-target).length;d.CAM_D.dof.aperture_fstop=2.8
            # Same writing nib, rotation and grip as the unchanged quill_state;
            # only the hand's visibility lasts until the paper leaves the shot.
            grip=d.quill.location+d.quill.rotation_euler.to_matrix()@g['Vector']((0,0,.060))
            d.set_hand('kai',grip,150,-30,vis=True)
        bpy.context.view_layer.update();return c
    def physical(t):
        c=g['cue_at'](t);paper=t<cut
        roots=[g['PARTS']['papers']['papers'][min(23,6+int(t/1.5))-1][0]] if paper else [r for r,p in g['PARTS']['crowd']['roots']]
        objects={o for r in roots for o in g['tree_nodes'](r) if o.type in {'MESH','FONT','CURVE','SURFACE'} and not o.hide_render}
        deps=bpy.context.evaluated_depsgraph_get();camera=np.array(d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1.,scale_y=1.))@np.array(d.CAM.matrix_world.inverted());points=[];minimum=1e9;maximum=-1e9;err=0
        for o in objects:
            ev=o.evaluated_get(deps);me=ev.to_mesh()
            try:v=np.array([tuple(v.co)+(1.,) for v in me.vertices]);world=v@np.array(o.matrix_world).T;clip=world@camera.T
            finally:ev.to_mesh_clear()
            assert np.all(clip[:,3]>0);xy=np.column_stack(((clip[:,0]/clip[:,3]+1)*540,(1-clip[:,1]/clip[:,3])*960));points.append(xy)
            minimum=min(minimum,float(world[:,2].min()));maximum=max(maximum,float(world[:,2].max()))
            for k in set((0,len(world)//2,len(world)-1)):
                old=d.project(tuple(world[k,:3]));err=max(err,max(abs(old[0]-xy[k,0]),abs(old[1]-xy[k,1])))
        assert err<=.11;p=np.concatenate(points);lo=p.min(axis=0);hi=p.max(axis=0);w=float((hi[0]-lo[0])/1080)
        heads=[float(r.location.z+.077) for r,p in g['PARTS']['crowd']['roots']]
        return {'frame':round(t*30),'time':t,'objectSourceFrame':round(t*30),'cue':c['key'],'row':c['row'],'subject':'実際に保持中の帳簿の最上面1枚' if paper else '浮上途中の半透明の人形10体','excluded':'手・羽根ペン・ろうそく・机。未来の群衆を紙保持中の主役に数えない' if paper else '手前の紙・手・机','box':[float(lo[0]),float(lo[1]),float(hi[0]),float(hi[1])],'widthRatio':w,'clipped':bool(lo[0]<0 or hi[0]>1080 or lo[1]<0 or hi[1]>1920),'within40to70':.4<=w<=.7,'within35to71':.35<=w<=.71,'minimumWorldZ':minimum,'maximumWorldZ':maximum,'cameraPose':list(deskpose if paper else crowdpose),'writingHandVisible':not d.HANDS['kai'].hide_render,'crowdHeadTopsWorldZ':heads,'visibleCrowdHeadCount':sum(z>0 for z in heads),'minimumCrowdHeadTopAboveDesk':min(heads),'crowdRiseStartUnchanged':word,'crowdRiseEndUnchanged':word+.8,'originalProjectionMaxDifferencePx':err,'actualVisibilityReviewPending':True}
    def others():
        result=[]
        for sc in bpy.data.scenes:
            p=Path(bpy.path.abspath(sc.render.filepath))
            if sc is not d.SC and p.is_file():s=p.stat();result.append((str(p),s.st_mtime_ns,s.st_size,sha(p)))
        assert len(result)>=3;return result
    def verify(guard):
        assert all(sha(p)==h for p,h in frozen.items())
        for p,mtime,size,h in guard:s=os.stat(p);assert (s.st_mtime_ns,s.st_size,sha(p))==(mtime,size,h)
    return g,bpy,d,proof,frozen,word,start,cut,frames,apply,physical,others,verify

def render(g,bpy,d,frames,apply,out):
    out.mkdir(parents=True,exist_ok=False);anc={};items=[]
    d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.render.resolution_percentage=100;d.SC.eevee.taa_render_samples=16;d.SC.render.image_settings.file_format='JPEG'
    for j in frames:
        apply(j/30)
        for k,v in g['anchors'](j/30).items():anc.setdefault(k,{})[j]=d.project(v)
        file=out/('%05d.jpg'%j);d.SC.render.filepath=str(file);bpy.ops.render.render(write_still=True,scene=d.SC.name)
        assert file.stat().st_size>1024;items.append({'frame':j,'file':str(file),'sha256':sha(file)})
    return anc,items

def trial(ns):
    g,bpy,d,proof,frozen,word,start,cut,frames,apply,physical,others,verify=setup(ns);assert not TRIAL.exists();began=time.time();guard=others();TRIAL.mkdir()
    checks=[]
    for j in frames+[491,498]:
        apply(j/30);p=physical(j/30);assert p['within40to70'] and not p['clipped'],p
        if j/30<cut:assert p['writingHandVisible']
        else:assert p['visibleCrowdHeadCount']==10 and p['minimumCrowdHeadTopAboveDesk']>.02
        checks.append(p)
    selected=[474,490,491,498];anc,items=render(g,bpy,d,selected,apply,TRIAL/'raw');verify(guard)
    result={'revision':'r17-paper-hand-hold-then-crowd-cut','notFinalVideo':True,'date':time.strftime('%Y-%m-%d %H:%M:%S'),'root':str(TRIAL),'sourceSha256':sha(__file__),'dependencySha256':frozen,'baseProofSha256':sha(R16/'camera-patch.json'),'frames':selected,'actualFiles':items,'anchors':anc,'preflight':checks,'word':word,'holdStarts':start,'cut':cut,'crowdRiseStart':word,'crowdRiseEnd':word+.8,'allFullNamedGeometry40to70AndUnclipped':True,'onlyWritingHandVisibilityAddedToOriginalObjectState':True,'allOriginalInputsUnchanged':True,'otherSceneLastOutputsUnchanged':True,'seconds':time.time()-began,'allActualImagesViewed':False}
    save(TRIAL/'trial.json',result);g['apply']((g['NF']-1)/30);print('[C17] FOUR ACTUAL PROBES DONE '+str(TRIAL),flush=True);return result

def finish(ns):
    g,bpy,d,proof,frozen,word,start,cut,frames,apply,physical,others,verify=setup(ns);review=read(TRIAL/'human-qa.json');tr=read(TRIAL/'trial.json')
    assert review['allFourActualImagesViewed'] and review['crowdHeadsReadableAtCut'] and review['readyForLocalReplacement']
    assert review['trialSha256']==sha(TRIAL/'trial.json') and tr['sourceSha256']==sha(__file__);assert not FINAL.exists()
    began=time.time();guard=others();old={str(p):(p.stat().st_mtime_ns,p.stat().st_size) for p in (R16/'blender/desk').glob('*.jpg')};assert len(old)==10814
    protected={str(p):sha(p) for p in [R16/'camera-patch.json',R16/'blender/desk/meta.json',R16/'blender/desk/anchors.json']}
    FINAL.mkdir();(FINAL/'blender').mkdir();(FINAL/'blender/local-r17').mkdir()
    checks=[]
    for j in frames:
        apply(j/30);p=physical(j/30);assert p['within40to70'] and not p['clipped'] and p['writingHandVisible'];checks.append(p)
    anc,items=render(g,bpy,d,frames,apply,FINAL/'blender/local-r17/raw')
    for f in ['plan.json','ys-chain-c1v1.json','phrase-times.json','ys-chain-c1v1.wav','ys-chain-c1v1.voice.wav']:(FINAL/f).symlink_to(R16/f)
    for f in ['data.json','probe1s-r11']:(FINAL/'blender'/f).symlink_to(R16/'blender'/f)
    (FINAL/'r11-probe-preflight').symlink_to(R16/'r11-probe-preflight')
    patch=FINAL/'blender/patch';patch.mkdir();combined=sorted(set(proof['patchFrames']+frames))
    for j in combined:(patch/('%05d.jpg'%j)).symlink_to(FINAL/'blender/local-r17/raw'/('%05d.jpg'%j) if j in frames else Path(proof['raw'])/('%05d.jpg'%j))
    replacements={int(j):ref for j,ref in proof['replacementFrameToActualPatchFrame'].items()};replacements.update({j:j for j in frames})
    delivered=FINAL/'blender/desk';delivered.mkdir();anchors=read(R16/'blender/desk/anchors.json')
    for j in range(g['NF']):
        (delivered/('%05d.jpg'%j)).symlink_to(patch/('%05d.jpg'%replacements[j]) if j in replacements else R16/'blender/desk'/('%05d.jpg'%j))
        if j in frames:
            for k,v in anc.items():anchors['anchors'][k][j]=v[j]
    save(delivered/'anchors.json',anchors);save(delivered/'meta.json',{'frames':g['NF'],'done':g['NF'],'missing':0,'fps':30,'actualPatchSourcesTotal':len(combined),'actualLocalR17':len(frames)})
    def pose16(t):
        r=next((r for r in proof['ranges'] if r['start']<=t<r['end']),None)
        if r is None:return g['raw_pose'](t)[0]
        p=list(r['targetPose']);u=d.seg(t,r['start'],r['moveEnd']);initial=.8 if r['cue']=='carry:simple' else 1.02 if r['cue'] in {'hard:9999','arm:wait','ch:intro'} else 1.04 if r['cue']=='gear:box' else 1.1;p[3]*=initial+(1-initial)*u;return p
    poses=[tuple(g['CUE']['desk:rouen']['pose']) if j in frames else tuple(pose16(proof['deliveredSemanticSourceMap'][j]/30)) for j in range(g['NF'])];moving=sum(poses[j]!=poses[j-1] for j in range(1,g['NF']))
    motion={'frames':g['NF'],'moving_frames':moving,'moving_ratio':moving/g['NF'],'method':'Exact delivered poses including cuts. R16 other entrances 10% approach; whole-M2 2%; pair .80→1 pull-back; box 4% toward 1.17m. R17 paper/hand held until word+.4 then crowd cut; original rise unchanged.'};assert motion['moving_ratio']<=.2;save(FINAL/'blender/camera-motion.json',motion)
    dims=read(R16/'final-held-dimensions.json')
    byframe={p['frame']:p for p in checks}
    for n,p in enumerate(dims['samples']):
        if p['frame'] in byframe:dims['samples'][n]={**byframe[p['frame']],'patched':True,'r17PaperHandHold':True}
    dims.update(method='Exact latest delivered r16 semantic states plus the explicitly recorded r17 paper/crowd subject and camera; original bounds JSONs preserved',actualVisualReviewPending=True);save(FINAL/'final-held-dimensions.json',dims)
    verify(guard);assert all((os.stat(p).st_mtime_ns,os.stat(p).st_size)==v for p,v in old.items());assert all(sha(p)==h for p,h in protected.items())
    result={**proof,'revision':'r17-paper-hand-hold-plus-r16-camera-semantic','root':str(FINAL),'patchSourceSha256':sha(__file__),'patchDependencySha256':frozen,'baseR16':str(R16),'baseR16ProofSha256':sha(R16/'camera-patch.json'),'patchFrames':combined,'raw':str(patch),'replacementFrameToActualPatchFrame':replacements,'allPatchJpegsActuallyRendered':True,'allMeasuredPatchGeometryWithinFrame':True,'allPatchWidths35to71':True,'notClaimingAll40to70':True,'r16Original526RawUnchanged':True,'r17ActualSourceFrames':frames,'r17ActualFiles':items,'r17StrictPhysicalPreflight':checks,'additionalCameraAndWritingHandVisibilityFix':{'start':start,'cut':cut,'word':word,'originalRiseEnd':word+.8,'objectFormulaUnchanged':True,'actualLocalFrames':len(frames),'trial':str(TRIAL/'trial.json'),'trialHumanQa':str(TRIAL/'human-qa.json')},'cameraMotion':motion,'localR17Seconds':time.time()-began,'secondsIncludingR16Patch':proof['seconds']+time.time()-began,'actualCompositeAndFinalMp4ReviewPending':True}
    save(FINAL/'camera-patch.json',result);g['apply']((g['NF']-1)/30);print('[C17] LOCAL REPLACEMENT DONE '+str(FINAL),flush=True);return result
