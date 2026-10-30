"""R12: retain the writing desk until the unchanged revolt appearance word.

Only the real 12–15 second blank-desk defect is changed. The r11 437 JPEGs
are preserved; the fixed fullscreen face is deliberately NOT moved.
"""
import ast,os,json,time,hashlib

def sha(path):
    return hashlib.sha256(open(path,'rb').read()).hexdigest()

def trial(ns):
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];a=g['A'];bpy.context.window.scene=d.SC
    cache=a.cache;previous=os.path.join(cache,'blender','probe1s-r11')
    old=json.load(open(os.path.join(previous,'qa-samples.json')))
    assert old['actualJpegCount']==437 and old['otherSceneLastOutputsMtimeAndShaUnchanged']
    originals={os.path.join(previous,'%05d.jpg'%j):sha(os.path.join(previous,'%05d.jpg'%j)) for j in old['frames']}
    protected=[]
    for sc in bpy.data.scenes:
        path=bpy.path.abspath(sc.render.filepath)
        if sc is not d.SC and os.path.isfile(path):
            st=os.stat(path);protected.append({'scene':sc.name,'file':path,'mtimeNs':st.st_mtime_ns,'bytes':st.st_size,'sha256':sha(path)})
    assert len(protected)>=3
    start=g['S']('desk:revolt');word=g['T']('desk:revolt','大きな反乱');pan=word-g['CUE']['desk:revolt']['move']
    affected=[j for j in old['frames'] if start<=j/30<word]
    assert sorted(affected)==[360,390,420,450]
    unchanged=sorted(j for j in old['frames'] if j not in affected)
    def signatures():
        result={};g['apply'](0)
        for j in unchanged:
            t=j/30;g['set_camera'](t);g['quill_state'](t,g['cue_at'](t)['row']==43)
            roots=[d.CAM,d.quill,d.HANDS['kai']]
            result[j]=[[list(o.location),list(o.rotation_euler),list(o.scale),o.hide_render] for o in roots]+[d.CAM_D.lens,d.CAM_D.dof.focus_distance,d.CAM_D.dof.aperture_fstop]
        return result
    before=signatures();old_source=dict(g['SOURCE_SHA']);source=g['__file__']
    names={'cam_keys','set_camera','quill_state'}
    tree=ast.parse(open(source).read(),filename=source)
    selected=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in names]
    assert len(selected)==3
    exec(compile(ast.Module(body=selected,type_ignores=[]),source,'exec'),g)
    for name in names:ns[name]=g[name];assert g[name].__globals__ is g
    g['KEYS']=g['cam_keys']();assert all(x['t']<=y['t'] for x,y in zip(g['KEYS'],g['KEYS'][1:]))
    after=signatures();assert before==after,'Unchanged interval camera / focus / quill / hand differs'
    assert len(unchanged)==433 and g['CUE']['arm:domino']['face']=={'who':'mio','ex':'kirakira','a':0,'b':1}
    for path in g['SOURCE_SHA']:g['SOURCE_SHA'][path]=sha(path)
    expected=dict(g['SOURCE_SHA']);out=os.path.join(cache,'blender','trial-r12');os.makedirs(out,exist_ok=False)
    # Exact 30fps phase samples; 136.5 is an unchanged existing 0.6s contact
    # highlight, diagnosing why integer-only static sampling misses its motion.
    frames=[360,390,420,448,450,463,478,480,492,502,510,4095]
    times=[j/30 for j in frames];saved=(a.out,a.times,a.force);a.out=out;a.times=','.join(map(str,times));a.force=True;began=time.time()
    g['main']();assert bpy.context.scene is d.SC
    files=[]
    for j in frames:
        path=os.path.join(out,'%05d.jpg'%j);st=os.stat(path)
        assert st.st_size>1024 and st.st_mtime>=began-.5
        with open(path,'rb') as f:
            assert f.read(2)==b'\xff\xd8';f.seek(-2,2);assert f.read(2)==b'\xff\xd9'
        files.append({'frame':j,'time':j/30,'file':path,'bytes':st.st_size,'sha256':sha(path)})
    assert len([f for f in os.listdir(out) if f.endswith('.jpg')])==12
    assert all(sha(path)==value for path,value in originals.items()),'Original r11 image changed'
    for p in protected:
        st=os.stat(p['file']);assert st.st_mtime_ns==p['mtimeNs'] and st.st_size==p['bytes'] and sha(p['file'])==p['sha256']
    assert all(sha(path)==value for path,value in expected.items())
    record={'revision':'r12-writing-hold','notFull30fps':True,'seconds':time.time()-began,'affectedInterval':[start,word],'paperHeldUntil':pan,'cameraMove':[pan,word],'crowdAppearanceUnchanged':[word,word+.8],'functionsChanged':sorted(names),'oldSourceSha256':old_source,'sourceSha256':expected,'frames':frames,'times':times,'changedOriginalFrames':affected,'unchangedOriginalFrames':unchanged,'unchangedCameraFocusQuillHandSignatures':len(unchanged),'original437ShaUnchanged':True,'original437Sha256':originals,'otherSceneLastOutputs':protected,'otherSceneOutputsMtimeShaUnchanged':True,'faceUnchanged':True,'actualFiles':files,'width':1080,'height':1920,'samples':a.samples,'scene':d.SC.name}
    json.dump(record,open(os.path.join(out,'qa-samples.json'),'w'),ensure_ascii=False,indent=1);a.out,a.times,a.force=saved
    print('[c1 r12] 12 actual JPEGs, only four original samples changed; 433 camera/focus/quill/hand signatures equal; original437 and other scenes unchanged',flush=True)
    return record
