"""Root-scheduled E1 r9 production, using the retained GUI scene only.

Import has no render side effects. Root calls run(nsE1, render=True).
run(nsE1) performs preflight only. Never creates/replaces model objects.
"""
import ast,collections,hashlib,json,math,os,re,time,types
from types import SimpleNamespace as N

CACHE='/private/tmp/ys/ys-chain-e1v1'
WORK='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
OUT=CACHE+'/blender/desk'
RECORD=CACHE+'/e1v1-production-r9'
def sha(path):
    h=hashlib.sha256()
    with open(path,'rb') as f:
        for chunk in iter(lambda:f.read(1<<20),b''):h.update(chunk)
    return h.hexdigest()
def dump(path,value):
    with open(path,'w') as f:json.dump(value,f,ensure_ascii=False,indent=2)
def signature(code):
    return (code.co_code.hex(),code.co_names,code.co_varnames,code.co_argcount,code.co_posonlyargcount,code.co_kwonlyargcount,code.co_flags,getattr(code,'co_exceptiontable',b'').hex(),tuple(signature(v) if isinstance(v,types.CodeType) else repr(v) for v in code.co_consts))
def frozen_plan():
    path=WORK+'/scripts/blender/desk_e1v1.py';data=json.load(open(CACHE+'/blender/data.json'));cues={c['key']:c for c in data['cues']}
    def T(key,word,occ=0):return [w['time'] for w in cues[key]['wordEvents'] if word in w['word']][occ]
    g={'CUES':data['cues'],'S':lambda k:cues[k]['start'],'E':lambda k:cues[k]['end'],'T':T,'DUR':data['duration'],'FPS':30,'math':math}
    nodes=[]
    for n in ast.parse(open(path).read(),path).body:
        if isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name) and n.targets[0].id in ['SPANS','EVENTS']:nodes.append(n)
        elif isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name) and n.target.id=='SPANS':nodes.append(n)
        elif isinstance(n,ast.FunctionDef) and n.name=='plan':nodes.append(n)
    exec(compile(ast.Module(body=nodes,type_ignores=[]),path,'exec'),g)
    nf=math.ceil(data['duration']*30);plans=[g['plan'](j) for j in range(nf)]
    assert all(p[0] in ['render','dup'] for p in plans),'No legacy cross-episode copy plans'
    assert all(p[0]!='dup' or 0<=p[1]<j and plans[p[1]][0]=='render' for j,p in enumerate(plans))
    return g,plans
def stamp(path):
    if not os.path.isfile(path):return {'exists':False}
    s=os.stat(path);return {'exists':True,'size':s.st_size,'mtimeNs':s.st_mtime_ns,'sha256':sha(path)}
def protected_raw():
    rows={}
    for relative in ['blender/gate-e1v1-r5/frames','blender/gate-e1v1-r6/frames','blender/gate-e1v1-r7/frames','blender/gate-e1v1-r9/frames','blender/gate-e1v1-r5/catalog','problem']:
        folder=CACHE+'/'+relative
        if not os.path.isdir(folder):continue
        for name in sorted(os.listdir(folder)):
            if name.endswith(('.jpg','.png')):rows[folder+'/'+name]=stamp(folder+'/'+name)
    return rows
def verify_saved(rows):return [p for p,v in rows.items() if stamp(p)!=v]
def jpeg(path):
    if os.path.islink(path):raise RuntimeError('Production JPEG must not alias a preview: '+path)
    if os.path.getsize(path)<1000:raise RuntimeError('Invalid production JPEG: '+path)
    with open(path,'rb') as f:
        assert f.read(2)==b'\xff\xd8',path;f.seek(-2,2);assert f.read(2)==b'\xff\xd9',path
def run(ns,render=False,resume=False):
    g=ns['apply'].__globals__;d=g['d'];bpy=g['bpy'];scene=d.SC
    assert g['A'].cache==CACHE and g['__file__']==WORK+'/scripts/blender/desk_e1v1.py'
    freeze=json.load(open(CACHE+'/e1v1-r9-source-freeze.json'))
    changed=[p for p,h in freeze['files'].items() if sha(WORK+'/'+p)!=h]
    assert not changed,('Frozen source changed',changed)
    assert sha(CACHE+'/ys-chain-e1v1.wav')==freeze['canonicalVoiceSHA256']
    assert sha(CACHE+'/blender/data.json')==freeze['dataSHA256']
    assert sha(CACHE+'/blender/tex/e1-chart.png')==freeze['textureSHA256']
    assert bpy.data.scenes.get(scene.name) is scene and scene.camera is d.CAM
    source_path=g['__file__'];test={}
    names={'main','apply','plan','latitude_state','ship_state','hands','pose_at','anchors'}
    nodes=[n for n in ast.parse(open(source_path).read(),source_path).body if isinstance(n,ast.FunctionDef) and n.name in names]
    exec(compile(ast.Module(body=nodes,type_ignores=[]),source_path,'exec'),test)
    stale=[n for n in names if signature(g[n].__code__)!=signature(test[n].__code__)]
    assert not stale,('Current GUI functions differ from frozen r9; no model reload',stale)
    libpath=WORK+'/scripts/blender/desk_lib.py';canonical={}
    libnodes=[n for n in ast.parse(open(libpath).read(),libpath).body if isinstance(n,ast.FunctionDef) and n.name=='main']
    exec(compile(ast.Module(body=libnodes,type_ignores=[]),libpath,'exec'),canonical)
    assert signature(d.main.__code__)==signature(canonical['main'].__code__),'Retained renderer differs from canonical shared main code'
    assert scene.render.engine=='BLENDER_EEVEE','Approved r9 uses Eevee, not a changed engine'
    actual=json.load(open(CACHE+'/blender/gate-e1v1-r9/r9-probe-actual.json'))
    assert set(actual['cameras'])==set(g['CAMERAS'])
    assert all(abs(a-b)<1e-9 for k,p in actual['cameras'].items() for a,b in zip(p,g['CAMERAS'][k]))
    assert json.load(open(CACHE+'/blender/gate-e1v1-r9/e1v1-r9-physical-bounds.json'))['status']=='PASS'
    assert g['SWAY_MOTION_PROOF']['status']=='PASS'
    pg,plans=frozen_plan();nf=len(plans);assert nf==g['NF']==11606 and g['FPS']==30
    counts=dict(collections.Counter(p[0] for p in plans))
    other_scenes={s.name:s.render.filepath for s in bpy.data.scenes if s is not scene}
    other_files={p:stamp(p) for p in other_scenes.values() if p and os.path.isfile(p)}
    os.makedirs(RECORD,exist_ok=True)
    record={'id':'ys-chain-e1v1','stage':'r9','time':time.strftime('%Y-%m-%d %H:%M:%S'),'runnerSha256':sha(__file__),'sourceFreeze':CACHE+'/e1v1-r9-source-freeze.json','frames':nf,'duration':g['DUR'],'fps':30,'counts':counts,'movingSpans':pg['SPANS'],'frozenPlanVsRetainedDifferentFrames':sum(tuple(g['plan'](j))!=tuple(p) for j,p in enumerate(plans)),'explicitScene':scene.name,'renderer':scene.render.engine,'canonicalRendererCodeVerified':True,'canonicalRendererSourceSha256':sha(libpath),'resolution':[1080,1920],'samples':16,'out':OUT,'otherSceneFiles':other_files,'protectedSourceFiles':len(freeze['files']),'renderRequested':render,'renderCalls':0,'existingProductionFramesSkipped':0}
    dump(RECORD+'/preflight-'+time.strftime('%Y%m%dT%H%M%S')+'.json',record)
    print('E1 production preflight',json.dumps(record,ensure_ascii=False),flush=True)
    if not render:return record
    owner_path=OUT+'/e1v1-production-owner.json'
    owner={'id':record['id'],'sourceSha256':sha(source_path),'librarySha256':sha(g['ext'].__file__),'runnerSha256':record['runnerSha256'],'settings':{'frames':nf,'fps':30,'samples':16,'resolution':[1080,1920]}}
    if os.path.lexists(OUT):
        assert resume and os.path.isdir(OUT) and not os.path.islink(OUT),'Existing production needs explicit owned resume'
        assert json.load(open(owner_path))==owner,'Existing production is not this exact frozen job'
        assert not os.path.exists(RECORD+'/completed.json'),'Production already complete; do not run twice'
        for name in os.listdir(OUT):
            assert not os.path.islink(OUT+'/'+name),'Production contains a symlink'
    else:
        assert not resume,'Resume requested but output does not exist'
        os.makedirs(OUT);dump(owner_path,owner)
    before=protected_raw();dump(RECORD+'/protected-raw-before.json',before)
    old_scene=bpy.context.window.scene
    scene.render.resolution_x=1080;scene.render.resolution_y=1920;scene.render.resolution_percentage=100
    scene.eevee.taa_render_samples=16;scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=95
    assert scene.render.engine=='BLENDER_EEVEE','Approved r9 uses Eevee, not a changed engine'
    def inside(path):
        path=os.path.abspath(path)
        assert os.path.dirname(path)==OUT and re.fullmatch(r'\d{5}\.jpg',os.path.basename(path)),path
        assert not os.path.islink(path),'Refusing symlink render/clone target'
        return path
    class Render:
        def render(self,*args,**kwargs):
            bpy.context.window.scene=scene
            requested=kwargs.pop('scene',scene.name);assert requested==scene.name
            path=inside(scene.render.filepath);j=int(os.path.basename(path)[:5]);assert plans[j][0]=='render'
            if os.path.exists(path):
                assert resume,'Unexpected existing raw in fresh production';jpeg(path);record['existingProductionFramesSkipped']+=1;return {'FINISHED'}
            result=bpy.ops.render.render(*args,scene=scene.name,**kwargs)
            jpeg(path);record['renderCalls']+=1;return result
        def __getattr__(self,name):return getattr(bpy.ops.render,name)
    proxy=N(**bpy.__dict__);proxy.ops=N(render=Render())
    def explicit(owned):assert owned is scene;return proxy
    def apply_owned(t):
        bpy.context.window.scene=scene
        return g['apply'](t)
    def clone_owned(src,dst):
        src=inside(src);dst=inside(dst);jpeg(src)
        if os.path.exists(dst):
            jpeg(dst);assert sha(src)==sha(dst),'Existing duplicate differs';return
        d.clone(src,dst)
    dcopy=N(**{**d.__dict__,'clone':clone_owned})
    options=N(**vars(g['A']));options.times=None;options.out=OUT;options.force=False;options.no_anchors=False;options.start=0;options.stop=1e9;options.every=1;options.scale=1
    scope={**g,'A':options,'d':dcopy,'apply':apply_owned,'plan':pg['plan'],'explicit_scene_bpy':explicit}
    started=time.time();error=None
    try:
        bpy.context.window.scene=scene
        types.FunctionType(g['main'].__code__,scope)()
        files=sorted(n for n in os.listdir(OUT) if re.fullmatch(r'\d{5}\.jpg',n));assert files==['%05d.jpg'%j for j in range(nf)]
        for name in files:jpeg(OUT+'/'+name)
        anc=json.load(open(OUT+'/anchors.json'));assert anc['frames']==nf and all(len(v)==nf for v in anc['anchors'].values())
        motion=json.load(open(CACHE+'/blender/camera-motion.json'));assert motion['moving_ratio']<=.2 and motion['top_ratio']<=.2
    except BaseException as exc:
        error=repr(exc);raise
    finally:
        raw_changes=verify_saved(before);other_changes=verify_saved(other_files)
        scene_changes=[name for name,path in other_scenes.items() if bpy.data.scenes[name].render.filepath!=path]
        record.update(seconds=round(time.time()-started,2),error=error,protectedRawChanged=raw_changes,otherSceneFileChanged=other_changes,otherScenePathChanged=scene_changes,sourceChanged=[p for p,h in freeze['files'].items() if sha(WORK+'/'+p)!=h],voiceUnchanged=sha(CACHE+'/ys-chain-e1v1.wav')==freeze['canonicalVoiceSHA256'])
        record['status']='render_complete_pending_final_QA' if error is None and not(raw_changes or other_changes or scene_changes or record['sourceChanged']) and record['voiceUnchanged'] else 'NG_or_interrupted_outputs_preserved'
        dump(RECORD+('/completed.json' if record['status']=='render_complete_pending_final_QA' else '/interrupted-'+time.strftime('%Y%m%dT%H%M%S')+'.json'),record)
        bpy.context.window.scene=old_scene
        print('E1 production result',json.dumps(record,ensure_ascii=False),flush=True)
        if error is None:assert record['status']=='render_complete_pending_final_QA',record
    return record
