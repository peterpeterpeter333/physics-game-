"""Camera-only A S3 correction. Import is inert; GUI calls are parent-owned.

review(ns, wide_distance=.51, bucket_distance=.55, label='candidate2'):
  after BASE finishes, evaluate ALL494 target frames and render seven gin
  stills plus five shrink-camera stills.
production(ns, label='candidate2'):
  requires CACHE/FRAMING_APPROVED.json with approved:true and sourceKey from
  the reviewed candidate; renders494 only, copies every other exact base JPEG.
Never calls the old scene main/finish/save or writes the base cache.
"""
from pathlib import Path
import contextlib, copy, hashlib, json, math, os, shutil, time

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
BASE = Path('/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028')
CACHE = Path('/private/tmp/ys/ys-chain-d1a_s3_framing_gpt_20261028')
BASE_KEY = '8eb303df05bafa5a3d96'
NF, FPS = 11618, 30
SELF = Path(__file__).resolve()
LOADER = W/'scripts/umech/desk-d1a-framing-loader_s3_gpt_20261028.mjs'
INPUTS = ['plan.json','ys-chain-d1a.json','phrase-times.json','timed-selection.json','prosody.txt',
          'ys-chain-d1a.wav','ys-chain-d1a.voice.wav','ys-chain-d1a.s3c.mixed.wav',
          'ys-chain-d1a.s3c.bgm.wav','ys-chain-d1a.s3c.mix.json','ys-chain-d1a.s3c.levels.json',
          'ys-chain-d1a.s3c.voice-bgm.json','word-events-actual_s3_20261028.json',
          'blender/data.json','shot-plan.json']

def sha(p):
    h=hashlib.sha256()
    with Path(p).open('rb') as f:
        for b in iter(lambda:f.read(1<<20),b''):h.update(b)
    return h.hexdigest()

def read(p):
    with Path(p).open(encoding='utf8') as f:return json.load(f)

def output_path(p):
    p=Path(p);assert str(p).startswith(str(CACHE)+os.sep)
    for q in [p]+list(p.parents):
        assert not q.is_symlink(),'No output through symlinks: '+str(q)
        if q==CACHE:break
    return p

def write(p,value):
    p=output_path(p)
    p.parent.mkdir(parents=True,exist_ok=True)
    with p.open('x',encoding='utf8') as f:json.dump(value,f,ensure_ascii=False,separators=(',',':'),allow_nan=False)

def real_file(p):
    p=Path(p);assert p.is_file() and not p.is_symlink() and p.resolve()==p
    return p

def stopped():
    assert not (CACHE/'STOP_FRAMING').exists(),'STOP_FRAMING present; outputs preserved'

def base_check(ns):
    assert Path(ns['A'].cache)==BASE and ns['render_key']()==BASE_KEY
    assert ns['FPS']==FPS and ns['NF']==NF
    m=read(real_file(BASE/'blender/desk/meta.json'))
    assert m['key']==BASE_KEY and m['frames']==NF and m['fps']==FPS and m.get('stage')=='S3'
    assert isinstance(m.get('finished'),str) and not m.get('previewOnly') and not m.get('sampleOnly'),'Base render must finish before this helper is used'
    assert len(read(real_file(BASE/'blender/delivered-camera-poses_gpt_20261026.json')))==NF
    assert read(real_file(BASE/'blender/camera-motion.json'))['frames']==NF
    a=read(real_file(BASE/'blender/desk/anchors.json'));assert a['key']==BASE_KEY and a['frames']==NF
    assert len(read(real_file(BASE/'blender/primary-metadata.json'))['frames'])==NF
    return m

def prepare_inputs(ns):
    base_check(ns);CACHE.mkdir(parents=True,exist_ok=True);assert CACHE.resolve()==CACHE and not CACHE.is_symlink()
    hashes={}
    for rel in INPUTS:
        src=real_file(BASE/rel);dst=output_path(CACHE/rel);digest=sha(src)
        dst.parent.mkdir(parents=True,exist_ok=True)
        if dst.exists():assert real_file(dst) and sha(dst)==digest,'Existing candidate input differs: '+rel
        else:shutil.copyfile(src,dst)
        hashes[rel]=digest
    tex=BASE/'blender/tex'
    if tex.is_dir():
        for src in sorted(tex.rglob('*')):
            if src.is_dir():continue
            real_file(src);dst=output_path(CACHE/src.relative_to(BASE));dst.parent.mkdir(parents=True,exist_ok=True)
            if dst.exists():assert sha(dst)==sha(src)
            else:shutil.copyfile(src,dst)
    return hashes

def definition(ns,wide_distance,bucket_distance):
    assert .35<=wide_distance<=.62 and .45<=bucket_distance<=.575,'Manual candidate distances only'
    a=math.ceil(ns['W']('gin:drum','巻き取られて')*FPS-1e-8)
    b=math.ceil(ns['W']('gin:drum','一方の桶')*FPS-1e-8)
    end=math.ceil(ns['E']('gin:drum')*FPS-1e-8)
    assert (a,b,end)==(789,927,1076)
    balloon_start=math.ceil(ns['S']('shrink:back')*FPS-1e-8);balloon_end=math.ceil(ns['E']('shrink:back')*FPS-1e-8)
    assert (balloon_start,balloon_end)==(3716,3923)
    p={'schema':'A-S3-camera-only-framing-v2','baseSourceKey':BASE_KEY,
       'adapterSha256':sha(SELF),'cacheLoaderSha256':sha(LOADER),
       'frameRanges':[{'name':'gin-wide','first':a,'last':b-1,'mode':'distance','distance':wide_distance,'targetShift':[-.025,0,0],'minWidth':.60},
                      {'name':'two-buckets','first':b,'last':end-1,'mode':'distance','distance':bucket_distance,'minWidth':.40},
                      {'name':'shrink-camera','first':balloon_start,'last':balloon_end-1,'mode':'shrink-tracking','minWidth':.60,
                       'widePose':list(ns['CAM']['balloon']),'closePose':[.015,-.21,.04,.28,-10,35,52],
                       'shrinkStart':ns['W']('shrink:back','1700分の1'),'shrinkSeconds':1.0,'trackingDollyAmplitude':.055}],
       'immutableInputHashes':prepare_inputs(ns),'fps':FPS,'frames':NF,'resolution':[540,960],'samples':4,
       'geometryAudioScriptCaptionChanged':False,'changedCameraFields':{'gin-wide':['targetX','distance'],'two-buckets':['distance'],'shrink-camera':['targetXYZ','distance','yaw','elevation','lens']},
       'sourceIdentity':'Aggregate of unchanged base render, this adapter, private cache loader and approved camera patch; not the base render key'}
    p['aggregateKey']=hashlib.sha256(json.dumps(p,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()[:20]
    return p

def phase(p,j):
    return next((r for r in p['frameRanges'] if r['first']<=j<=r['last']),None)

def target_indices(p):
    return [j for r in p['frameRanges'] for j in range(r['first'],r['last']+1)]

@contextlib.contextmanager
def restored(ns,restore_time=None):
    import bpy
    d=ns['d'];sc=d.SC;win=bpy.context.window or next(iter(bpy.context.window_manager.windows));prior=win.scene
    render=(sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage,sc.eevee.taa_render_samples,sc.render.filepath,sc.render.image_settings.file_format)
    cam=(d.CAM.matrix_world.copy(),d.CAM_D.lens,d.CAM_D.dof.aperture_fstop,d.CAM_D.dof.focus_distance)
    names=['PRIMARY','S3_PRIMARY_METADATA','S3_PRIMARY_SELECTIONS','_A3_QA_SELECTION_INDEX','S3_PRIMARY_WARNINGS','_A3_QA_VERTEX_CACHE']
    old={k:ns.get(k) for k in names};present={k:k in ns for k in names}
    ns.update(PRIMARY={},S3_PRIMARY_METADATA={},S3_PRIMARY_SELECTIONS=[],_A3_QA_SELECTION_INDEX={},S3_PRIMARY_WARNINGS=[],_A3_QA_VERTEX_CACHE={})
    try:
        win.scene=sc;sc.render.resolution_x=540;sc.render.resolution_y=960;sc.render.resolution_percentage=100;sc.eevee.taa_render_samples=4;sc.render.image_settings.file_format='JPEG'
        with bpy.context.temp_override(window=win,scene=sc,view_layer=sc.view_layers[0]):yield
    finally:
        # Re-establish a declared unmodified base-film pose, then restore camera
        # and render/UI settings. No old output function is called.
        ns['apply']((NF-1)/FPS if restore_time is None else restore_time)
        d.CAM.matrix_world=cam[0];d.CAM_D.lens=cam[1];d.CAM_D.dof.aperture_fstop=cam[2];d.CAM_D.dof.focus_distance=cam[3]
        sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage,sc.eevee.taa_render_samples,sc.render.filepath,sc.render.image_settings.file_format=render
        for k in names:
            if present[k]:ns[k]=old[k]
            else:ns.pop(k,None)
        win.scene=prior;bpy.context.view_layer.update()

def camera_apply(ns,p,j):
    import bpy
    import desk_d1a_s3_qa_gpt_20261028 as qa
    r=phase(p,j);assert r is not None
    t=j/FPS;basecam,st,X=ns['apply'](t);spec=qa.selector(ns,t);meshes=qa._visible(ns,spec)
    transforms={o.name:tuple(v for row in o.matrix_world for v in row) for o in meshes}
    cam=list(basecam)
    if r['mode']=='distance':
        cam[3]=r['distance']
        for axis,shift in enumerate(r.get('targetShift',[0,0,0])):cam[axis]+=shift
    else:
        assert r['mode']=='shrink-tracking'
        u=ns['U'](t,r['shrinkStart'],r['shrinkSeconds'])
        cam=[a+(b-a)*u for a,b in zip(r['widePose'],r['closePose'])]
        cam[3]-=r['trackingDollyAmplitude']*math.sin(math.pi*u)**2
    ns['set_camera'](cam);bpy.context.view_layer.update()
    assert transforms=={o.name:tuple(v for row in o.matrix_world for v in row) for o in meshes},'Camera patch changed model transforms'
    qa.measure(ns,t);record=copy.deepcopy(ns['S3_PRIMARY_METADATA'][str(j)])
    record.update(cameraFramingCorrection=True,baseSourceKey=BASE_KEY,aggregateSourceKey=p['aggregateKey'],cameraBase=list(basecam),cameraDelivered=cam,geometryUnchangedByCameraPatch=True)
    box=ns['PRIMARY'][str(j)];raw=record.get('rawBounds01')
    inside=bool(raw and all(math.isfinite(v) for v in raw) and 0<=raw[0]<=raw[2]<=1 and 0<=raw[1]<=raw[3]<=1)
    maximum=spec.get('maxWidth')
    passed=bool(record.get('measured') and record.get('width',0)>=r['minWidth'] and (maximum is None or record.get('width',0)<=maximum) and inside and record.get('allVerticesInFront'))
    return cam,st,record,box,passed

def review(ns,wide_distance=.51,bucket_distance=.55,label='candidate2',restore_time=None):
    import bpy
    assert label.replace('-','').replace('_','').isalnum()
    p=definition(ns,wide_distance,bucket_distance);out=output_path(CACHE/'review'/label)
    assert not out.exists(),'Preserve previous candidate review; choose a new label'
    out.mkdir(parents=True);write(out/'patch-definition.json',p)
    records=[];anchors={};measurements={};start=time.time()
    with restored(ns,restore_time):
        for j in target_indices(p):
            stopped();cam,st,m,box,passed=camera_apply(ns,p,j)
            records.append({'frame':j,'time':j/FPS,'phase':phase(p,j)['name'],'primary':m['name'],'width':m.get('width'),'height':m.get('height'),'minWidth':phase(p,j)['minWidth'],'maxWidth':m.get('maxWidth'),'rawBoundsLogical':m.get('rawBoundsLogical'),'allVerticesInFront':m.get('allVerticesInFront'),'inFrame':m.get('inFrame'),'pass':passed,'camera':cam})
            if j%48==0:print('FRAMING_PROJECT',j,flush=True)
        wide=[r for r in records if r['phase']=='gin-wide'];buckets=[r for r in records if r['phase']=='two-buckets']
        chosen=set([789,857,926,min(wide,key=lambda r:r['width'] or 0)['frame'],927,1075,min(buckets,key=lambda r:r['width'] or 0)['frame']])
        for extra in [1001,820,965,1050]:
            if len(chosen)>=7:break
            chosen.add(extra)
        chosen.update([3716,3822,3838,3853,3922])
        specs=[];rawdir=out/'raw';rawdir.mkdir()
        for j in sorted(chosen):
            cam,st,m,box,passed=camera_apply(ns,p,j);image=rawdir/('%05d.jpg'%j);assert not image.exists()
            ns['d'].SC.render.filepath=str(image);bpy.ops.render.render(write_still=True,scene=ns['d'].SC.name)
            anchors[str(j)]=ns['anchors_now'](j/FPS,st);c=ns['cue_at'](j/FPS)
            specs.append({'name':'framing-'+str(j),'frame':j,'time':j/FPS,'row':c['row'],'cue':c['key'],'image':str(image),'primary':m['name'],'width':m.get('width'),'pass':passed})
    result={'stage':'S3 camera-framing candidate only','sourceKey':p['aggregateKey'],'baseSourceKey':BASE_KEY,'projectedFrames':len(records),'allProjectedFramesPass':all(r['pass'] for r in records),'failingFrames':[r for r in records if not r['pass']],'records':records,'samples':specs,'elapsedSeconds':time.time()-start,'personallyViewed':False,'movieRendered':False,'rawBaseModified':False}
    write(out/'projection.json',result);write(out/'anchors.json',anchors);write(out/'samples.json',{'sourceKey':p['aggregateKey'],'frames':specs})
    print('FRAMING_REVIEW_READY',str(out),p['aggregateKey'],'allProjectionPass',result['allProjectedFramesPass'],flush=True)
    return None

def production(ns,label='candidate2',restore_time=None):
    import bpy
    assert label.replace('-','').replace('_','').isalnum()
    base=base_check(ns);reviewdir=CACHE/'review'/label;p=read(real_file(reviewdir/'patch-definition.json'));projection=read(real_file(reviewdir/'projection.json'))
    current=definition(ns,p['frameRanges'][0]['distance'],p['frameRanges'][1]['distance']);assert current==p,'Reviewed patch/source/input changed'
    approval=read(real_file(CACHE/'FRAMING_APPROVED.json'));assert approval.get('approved') is True and approval.get('sourceKey')==p['aggregateKey'] and approval.get('baseSourceKey')==BASE_KEY
    assert projection['allProjectedFramesPass'] is True,'Do not render a candidate whose real projection still fails'
    out=output_path(CACHE/'blender/desk');assert not out.exists(),'Preserve any previous/partial framing render; inspect before retrying'
    out.mkdir(parents=True);write(CACHE/'framing-patch.json',p)
    primary=read(real_file(BASE/'blender/primary.json'));metadata=read(real_file(BASE/'blender/primary-metadata.json'));anchors=read(real_file(BASE/'blender/desk/anchors.json'));poses=read(real_file(BASE/'blender/delivered-camera-poses_gpt_20261026.json'))
    assert len(poses)==NF and len(metadata['frames'])==NF and anchors['frames']==NF
    copied=0;corrected=[];start=time.time()
    with restored(ns,restore_time):
        ns['PRIMARY']=primary;ns['S3_PRIMARY_METADATA']=metadata['frames'];ns['S3_PRIMARY_SELECTIONS']=metadata.get('selections',[])
        ns['_A3_QA_SELECTION_INDEX']={tuple(v):i for i,v in enumerate(ns['S3_PRIMARY_SELECTIONS'])};ns['S3_PRIMARY_WARNINGS']=metadata.get('warnings',[])
        for j in range(NF):
            stopped();dst=out/('%05d.jpg'%j);assert not dst.exists()
            if phase(p,j):
                cam,st,m,box,passed=camera_apply(ns,p,j);assert passed,('A reviewed corrected projection changed',j,m)
                ns['d'].SC.render.filepath=str(dst);bpy.ops.render.render(write_still=True,scene=ns['d'].SC.name)
                points=ns['anchors_now'](j/FPS,st)
                for name,values in anchors['anchors'].items():assert len(values)==NF and name in points;values[j]=points[name]
                ns['S3_PRIMARY_METADATA'][str(j)]=m;poses[j]=[round(v,9) for v in cam];corrected.append(j)
            else:
                src=real_file(BASE/'blender/desk'/('%05d.jpg'%j));shutil.copyfile(src,dst);assert src.stat().st_size==dst.stat().st_size;copied+=1
            if j%240==0:print('FRAMING_ASSEMBLE',j,'corrected',len(corrected),'exactBaseCopies',copied,flush=True)
        assert corrected==target_indices(p) and copied==NF-len(corrected)
        metadata.update(sourceKey=p['aggregateKey'],baseSourceKey=BASE_KEY,frames=ns['S3_PRIMARY_METADATA'],selections=ns['S3_PRIMARY_SELECTIONS'],warnings=ns['S3_PRIMARY_WARNINGS'],cameraCorrectionFrames=corrected)
        anchors.update(key=p['aggregateKey'],baseSourceKey=BASE_KEY,previewOnly=False,sampleOnly=False)
        moving=[False]+[poses[j]!=poses[j-1] for j in range(1,NF)];spans=[];begin=None
        for j,value in enumerate(moving+[False]):
            if value and begin is None:begin=j/FPS
            if not value and begin is not None:spans.append([begin,j/FPS]);begin=None
        motion=read(BASE/'blender/camera-motion.json');motion.update(sourceKey=p['aggregateKey'],baseSourceKey=BASE_KEY,moving_frames=sum(moving),moving_ratio=sum(moving)/NF,moving_spans=spans,top_ratio=sum(v[5]>=65 for v in poses)/NF)
        write(CACHE/'blender/primary.json',ns['PRIMARY']);write(CACHE/'blender/primary-metadata.json',metadata);write(out/'anchors.json',anchors)
        write(CACHE/'blender/camera-motion.json',motion);write(CACHE/'blender/delivered-camera-poses_gpt_20261026.json',poses)
        write(CACHE/'blender/camera-poses-provenance.json',{'sourceKey':p['aggregateKey'],'baseSourceKey':BASE_KEY,'cameraOnlyRecomputedFrames':corrected,'otherPoses':'Exact base values; no geometry reevaluation claimed'})
    provenance={'sourceKey':p['aggregateKey'],'baseSourceKey':BASE_KEY,'patchSha256':sha(CACHE/'framing-patch.json'),'frames':NF,'correctedFrames':len(corrected),'exactBaseCopiedFrames':NF-len(corrected),'sources':{str(j):{'kind':'camera-corrected-render' if phase(p,j) else 'exact-base-real-copy','baseFrame':j,'baseSourceKey':BASE_KEY} for j in range(NF)},'rawFilesAreRealCopies':True,'allPerFrameHashesGenerated':False}
    write(CACHE/'frame-provenance.json',provenance)
    assert ns['render_key']()==BASE_KEY and all(sha(BASE/rel)==v and sha(CACHE/rel)==v for rel,v in p['immutableInputHashes'].items())
    assert sha(SELF)==p['adapterSha256'] and sha(LOADER)==p['cacheLoaderSha256'],'Correction helper changed during production'
    meta={'key':p['aggregateKey'],'baseSourceKey':BASE_KEY,'stage':'S3','frames':NF,'fps':FPS,'resolution':[540,960],'samples':4,'done':list(range(NF)),'finished':time.strftime('%Y-%m-%d %H:%M:%S'),'renderStrategy':str(len(corrected))+' camera-only corrected frames plus'+str(copied)+' exact base real-copy frames','framingPatchSha256':provenance['patchSha256'],'elapsedSeconds':time.time()-start,'allMoviePass':False,'earsPerformed':False}
    write(out/'meta.json',meta)
    print('FRAMING_RAW_COMPLETE',p['aggregateKey'],len(corrected),copied,'No export/check/backup started',flush=True)
    return None
