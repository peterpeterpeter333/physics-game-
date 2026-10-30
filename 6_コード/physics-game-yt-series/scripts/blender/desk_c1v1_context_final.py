"""Correct render context, preserving live C1 geometry and function globals.

The failed r10 probe had no C1 JPEGs and is retained, not accepted or overwritten.
"""
import ast,os,json,time,hashlib,math

def install(ns):
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];bpy.context.window.scene=d.SC
    source=os.path.abspath(g['__file__']);old=dict(g['SOURCE_SHA']);names={'main','catalog','write_problem','challenge_setup'}
    tree=ast.parse(open(source).read(),filename=source);functions=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in names]
    assert len(functions)==len(names);parts={k:id(v) for k,v in g['PARTS'].items()}
    assert json.load(open(os.path.join(g['A'].cache,'blender','data.json')))==g['DATA']
    exec(compile(ast.Module(body=functions,type_ignores=[]),source,'exec'),g)
    for name in names:
        assert g[name].__globals__ is g
        ns[name]=g[name]
    assert parts=={k:id(v) for k,v in g['PARTS'].items()}
    for f in g['SOURCE_SHA']:g['SOURCE_SHA'][f]=hashlib.sha256(open(f,'rb').read()).hexdigest()
    record={'revision':'r11-context-fix','date':time.strftime('%Y-%m-%d %H:%M:%S'),'oldSourceSha256':old,'newSourceSha256':dict(g['SOURCE_SHA']),'functions':sorted(names),'mainGlobalsPreserved':True,'modelObjectsPreserved':True,'dataCameraWordsTimesUnchanged':True,'failedProbeJpegs':0,'failedProbeFolder':os.path.join(g['A'].cache,'blender','probe1s-r10'),'scene':d.SC.name}
    json.dump(record,open(os.path.join(g['A'].cache,'c1-render-context-fix.json'),'w'),ensure_ascii=False,indent=1)
    print('[c1 r11] scene selection + every render(scene=d.SC.name); live globals preserved; models/data untouched',flush=True)
    return g

def probe(ns):
    g=install(ns);a=g['A'];d=g['d'];bpy=g['bpy'];old=(a.times,a.out,a.force)
    protected=[]
    for sc in bpy.data.scenes:
        f=bpy.path.abspath(sc.render.filepath)
        if sc is not d.SC and os.path.isfile(f):
            st=os.stat(f);protected.append({'scene':sc.name,'file':f,'mtimeNs':st.st_mtime_ns,'bytes':st.st_size,'sha256':hashlib.sha256(open(f,'rb').read()).hexdigest()})
    assert len(protected)>=3,'Expected to protect the other episode scenes'
    critical=g['DATA']['previews']+g['DATA'].get('extraPreviews',[]);critical_frames=[round(t*30) for t in critical]
    ends=[{'cue':c['key'],'frame':math.ceil(c['end']*30)-1,'time':(math.ceil(c['end']*30)-1)/30} for c in g['CUES']]
    frames=list(dict.fromkeys(critical_frames+[t*30 for t in range(361)]+[x['frame'] for x in ends]));assert len(frames)==437
    times=[j/30 for j in frames];out=os.path.join(a.cache,'blender','probe1s-r11');os.makedirs(out,exist_ok=False)
    a.out=out;a.times=','.join(map(str,times));a.force=True;started=time.time();expected=dict(g['SOURCE_SHA'])
    g['main']();assert bpy.context.scene is d.SC
    files=[]
    for j in frames:
        f=os.path.join(out,'%05d.jpg'%j);assert os.path.isfile(f),'Missing actual C1 JPEG '+f
        st=os.stat(f);assert st.st_mtime>=started-.5 and st.st_size>1024,'Old/empty actual C1 JPEG '+f
        with open(f,'rb') as img:
            assert img.read(2)==b'\xff\xd8';img.seek(-2,2);assert img.read(2)==b'\xff\xd9'
        files.append({'frame':j,'file':f,'bytes':st.st_size,'mtime':st.st_mtime})
    assert len([f for f in os.listdir(out) if f.endswith('.jpg')])==437
    assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in expected.items())
    for p in protected:
        st=os.stat(p['file']);assert st.st_mtime_ns==p['mtimeNs'] and st.st_size==p['bytes'] and hashlib.sha256(open(p['file'],'rb').read()).hexdigest()==p['sha256'],'Other scene output changed: '+p['scene']
    record={'revision':'r11-context-fix','notFull30fps':True,'seconds':time.time()-started,'times':times,'frames':frames,'criticalTimes':critical,'criticalFrames':critical_frames,'integerTimes':list(range(361)),'cueEnds':ends,'sourceSha256':expected,'width':1080,'height':1920,'samples':a.samples,'scene':d.SC.name,'activeScene':bpy.context.scene.name,'actualJpegCount':437,'allJpegMtimeAfterStart':True,'allJpegHeadersValid':True,'actualFiles':files,'otherSceneLastOutputs':protected,'otherSceneLastOutputsMtimeAndShaUnchanged':True}
    json.dump(record,open(os.path.join(out,'qa-samples.json'),'w'),ensure_ascii=False,indent=1);a.times,a.out,a.force=old
    print('[c1 r11] 437 actual JPEGs verified: exact count / new mtime / JPEG headers / C1 scene / frozen source',flush=True)
    return record

def full_render(ns):
    g=ns['main'].__globals__;g['bpy'].context.window.scene=g['d'].SC;assert g['bpy'].context.scene is g['d'].SC
    a=g['A'];old=(a.times,a.out,a.force);a.times=None;a.out=None;a.force=False;expected=dict(g['SOURCE_SHA'])
    assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in expected.items())
    g['main']();assert g['bpy'].context.scene is g['d'].SC
    assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in expected.items())
    meta=json.load(open(os.path.join(a.cache,'blender','desk','meta.json')));assert meta['missing']==0 and meta['frames']==g['NF']
    a.times,a.out,a.force=old;return meta
