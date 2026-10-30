"""C-1 approved row34: camera .8s, eight falls .81s, then existing pause face.

Root calls trial(nsC1), reviews actual frames, then explicitly calls production.
This file never queues work or changes supplied plan/voice/captions.
"""
import ast,os,json,time,hashlib,math

def sha(p):return hashlib.sha256(open(p,'rb').read()).hexdigest()

def immutable(g):
    c=g['A'].cache;w=os.path.dirname(os.path.dirname(os.path.dirname(g['__file__'])))
    files=[os.path.join(c,f) for f in ['plan.json','ys-chain-c1v1.json','phrase-times.json','ys-chain-c1v1.wav','ys-chain-c1v1.voice.wav','ys-chain-c1v1.mixed.wav']]
    files.extend(os.path.join(w,'docs','video-revision-20260924',sub,name) for sub,name in [('ytseries','chain-c-1.mjs'),('deep','技術の疑問の鎖_C-1_第1版_ナレーション.md')])
    return {p:sha(p) for p in files}

def guard_other(g):
    bpy=g['bpy'];d=g['d'];result=[]
    for sc in bpy.data.scenes:
        p=bpy.path.abspath(sc.render.filepath)
        if sc is not d.SC and os.path.isfile(p):
            st=os.stat(p);result.append({'scene':sc.name,'file':p,'mtimeNs':st.st_mtime_ns,'bytes':st.st_size,'sha256':sha(p)})
    assert len(result)>=3
    return result

def verify_other(items):
    for p in items:
        st=os.stat(p['file']);assert st.st_mtime_ns==p['mtimeNs'] and st.st_size==p['bytes'] and sha(p['file'])==p['sha256'],'Other scene output changed '+p['scene']

def install(ns):
    g=ns['main'].__globals__;g['bpy'].context.window.scene=g['d'].SC
    s=g['S']('arm:domino');e=g['E']('arm:domino');old_source=dict(g['SOURCE_SHA'])
    before={j:g['raw_pose'](j/30) for j in range(g['NF']) if not s<=j/30<e}
    source=g['__file__'];tree=ast.parse(open(source).read(),filename=source);names={'cam_keys','apply_state'}
    selected=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in names];assert len(selected)==2
    exec(compile(ast.Module(body=selected,type_ignores=[]),source,'exec'),g)
    for name in names:ns[name]=g[name];assert g[name].__globals__ is g
    g['KEYS']=g['cam_keys']()
    assert before=={j:g['raw_pose'](j/30) for j in before},'Camera outside row34 changed'
    assert g['CUE']['arm:domino']['face']=={'who':'mio','ex':'kirakira','a':0,'b':1}
    assert g['CUE']['arm:domino']['move']==1,'Immutable prepared data was edited'
    w=os.path.dirname(os.path.dirname(os.path.dirname(source)))
    for p in [os.path.abspath(__file__),os.path.join(w,'scripts','umech','desk-c1v1-approved-frame.mjs')]:g['SOURCE_SHA'][p]=sha(p)
    for p in g['SOURCE_SHA']:g['SOURCE_SHA'][p]=sha(p)
    return g,old_source,len(before)

def trial(ns):
    g,old_source,same=install(ns);a=g['A'];bpy=g['bpy'];d=g['d'];c=a.cache;began=time.time();inputs=immutable(g);protected=guard_other(g)
    out=os.path.join(c,'blender','trial-r13');os.makedirs(out,exist_ok=False)
    s=g['S']('arm:domino');e=g['E']('arm:domino');ve=g['VE']('arm:domino');arrive=s+.8;fall_end=arrive+7*.08+.25
    assert fall_end<ve and e-ve>1
    for ci,cue in enumerate(g['CUES']):
        for f in [.03,.20,.40,.60,.80,.97]:g['apply'](cue['start']+(cue['end']-cue['start'])*f)
    print('[c1 r13] 318 states PASS; unchanged outside-row34 camera samples %d'%same,flush=True)
    # Inspect the full actual 30fps event, including one preceding and one
    # following cue frame; no new arbitrary camera candidates.
    frames=list(range(math.floor(s*30),math.ceil(g['S']('arm:judge')*30)+1));times=[j/30 for j in frames]
    state=[]
    for j,t in zip(frames,times):
        g['apply'](t);pose,moving=g['raw_pose'](t)
        angles=[math.degrees(o.rotation_euler.y) for i,o in enumerate(g['PARTS']['domino']['tiles'])]
        if s<=t<arrive:assert all(abs(v)<1e-5 for v in angles)
        if arrive<=t<e:assert not moving and tuple(pose)==tuple(g['CUE']['arm:domino']['pose'])
        if fall_end<=t<e:assert all(v<=-76 for v in angles)
        state.append({'frame':j,'time':t,'cameraMoving':moving,'pose':list(pose),'dominoAnglesLeftToRight':angles})
    saved=(a.times,a.out,a.force);a.out=out;a.times=','.join(map(str,times));a.force=True;expected=dict(g['SOURCE_SHA']);g['main']()
    assert bpy.context.scene is d.SC
    files=[]
    for j in frames:
        p=os.path.join(out,'%05d.jpg'%j);st=os.stat(p);assert st.st_size>1024 and st.st_mtime>=began-.5
        with open(p,'rb') as f:assert f.read(2)==b'\xff\xd8';f.seek(-2,2);assert f.read(2)==b'\xff\xd9'
        files.append({'frame':j,'file':p,'sha256':sha(p),'bytes':st.st_size})
    assert len([f for f in os.listdir(out) if f.endswith('.jpg')])==len(frames)
    assert immutable(g)==inputs;verify_other(protected)
    assert all(sha(p)==h for p,h in expected.items())
    record={'revision':'r13-approved-domino','approvedExceptions':['raw 7b/sparse NG retained, actual named-subject bounds plus full visual review supplements only mismatched scenes','row34 face moves to unchanged voiceEnd through existing cue end'],'notFullVideo':True,'seconds':time.time()-began,'sourceSha256':expected,'oldSourceSha256':old_source,'immutableInputSha256':inputs,'allImmutableInputsUnchanged':True,'stateChecks':318,'outsideCueCameraFramesUnchanged':same,'scene':d.SC.name,'width':1080,'height':1920,'samples':a.samples,'frames':frames,'times':times,'actualJpegCount':len(files),'actualFiles':files,'states':state,'timing':{'cueStart':s,'cameraArrives':arrive,'firstFall':arrive,'lastFallEnds':fall_end,'faceStart':ve,'faceEnds':e,'faceSeconds':e-ve,'fallStep':.08,'singleFallSeconds':.25},'originalPlanFaceUnchanged':True,'otherSceneOutputs':protected,'otherSceneOutputsMtimeShaUnchanged':True}
    json.dump(record,open(os.path.join(out,'qa-samples.json'),'w'),ensure_ascii=False,indent=1);a.times,a.out,a.force=saved
    print('[c1 r13] %d actual30fps JPEGs verified; immutable inputs and other scenes unchanged'%len(files),flush=True)
    return record

def production(ns,resume=False):
    g=ns['main'].__globals__;a=g['A'];d=g['d'];bpy=g['bpy'];c=a.cache
    review=json.load(open(os.path.join(c,'c1-r13-human-qa.json')));assert review['readyForProduction'] and review['allActualFramesViewed']
    frozen=json.load(open(os.path.join(c,'blender','trial-r13','qa-samples.json')))
    assert all(sha(p)==h for p,h in frozen['sourceSha256'].items()) and immutable(g)==frozen['immutableInputSha256']
    out=os.path.join(c,'blender','desk');statusfile=os.path.join(c,'c1-production-r13.json')
    if os.path.exists(out):
        assert resume and os.path.isfile(statusfile),'Preserve prior production output'
        status=json.load(open(statusfile));assert status['out']==out and status['sourceSha256']==frozen['sourceSha256']
    else:assert not resume
    a.out=out;a.times=None;a.force=False;a.samples=16;a.scale=1;a.start=0;a.stop=1e9;a.every=1;a.no_anchors=False;a.anchors_only=False
    bpy.context.window.scene=d.SC;assert bpy.context.scene is d.SC
    d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.render.resolution_percentage=100;d.SC.eevee.taa_render_samples=16;d.SC.render.image_settings.file_format='JPEG'
    protected=guard_other(g);started=time.time();keys={g['scene_key'](j/30) for j in range(g['NF'])}
    status={'status':'running','revision':'r13-approved-domino','started':started,'out':out,'frames':g['NF'],'uniqueStates':len(keys),'sourceSha256':frozen['sourceSha256'],'immutableInputSha256':frozen['immutableInputSha256'],'otherSceneOutputs':protected}
    json.dump(status,open(statusfile,'w'),ensure_ascii=False,indent=1);print('[c1 r13] PRODUCTION START',status,flush=True)
    g['main']();assert bpy.context.scene is d.SC
    missing=[j for j in range(g['NF']) if not os.path.isfile(os.path.join(out,'%05d.jpg'%j))];assert not missing,missing[:20]
    anchors=json.load(open(os.path.join(out,'anchors.json')));assert all(len(v)==g['NF'] for v in anchors['anchors'].values())
    assert all(sha(p)==h for p,h in frozen['sourceSha256'].items()) and immutable(g)==frozen['immutableInputSha256'];verify_other(protected)
    status.update(status='done',seconds=time.time()-started,missing=0,allImmutableInputsUnchanged=True,otherSceneOutputsMtimeShaUnchanged=True)
    json.dump(status,open(statusfile,'w'),ensure_ascii=False,indent=1);print('[c1 r13] PRODUCTION DONE',status,flush=True)
    return status
