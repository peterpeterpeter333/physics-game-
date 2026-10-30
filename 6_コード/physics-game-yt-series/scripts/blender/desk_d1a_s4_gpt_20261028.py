"""D1a S4 isolated GUI runner. Import is inert; original files stay read-only.

Rebinds an already-built S3 scene's functions to a private S4 namespace rather
than rebuilding thousands of good objects. Never calls the legacy main/save.
"""
import contextlib, copy, hashlib, importlib.util, json, math, os
from pathlib import Path
import time, traceback, types
import bpy
from mathutils import Vector

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
CACHE=Path('/private/tmp/ys/ys-chain-d1a_s4_gpt_20261028')
NS=None
FPS,NF=30,11618

def read(p):return json.loads(Path(p).read_text())
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def write(p,x):
    p=Path(p);assert str(p).startswith(str(CACHE)+'/') and not p.is_symlink()
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(x,ensure_ascii=False,separators=(',',':'),allow_nan=False))
def module(name):
    p=W/'scripts/blender'/name
    sp=importlib.util.spec_from_file_location(p.stem,p);m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m);return m

def bind(old):
    global NS
    assert NS is None and not bpy.app.background and CACHE.is_dir()
    ns=dict(old)
    for k,v in old.items():
        if isinstance(v,types.FunctionType) and v.__globals__ is old:
            f=types.FunctionType(v.__code__,ns,v.__name__,v.__defaults__,v.__closure__)
            f.__kwdefaults__=v.__kwdefaults__;ns[k]=f
    ns['A']=copy.copy(old['A']);ns['A'].cache=str(CACHE);ns['A'].no_reuse=True
    ns['MANAGED']=list(old['MANAGED']);ns['BASE']={o:tuple(x.copy() for x in b)for o,b in old['BASE'].items()}
    ns['CAM']={k:list(v) for k,v in old['CAM'].items()}
    ns['SHOTQA_PRIMARY']=dict(old['SHOTQA_PRIMARY'])
    ns['PRIMARY']={};ns['S3_PRIMARY_METADATA']={};ns['S3_PRIMARY_SELECTIONS']=[]
    ns['_A3_QA_SELECTION_INDEX']={};ns['_A3_QA_VERTEX_CACHE']={}
    ns['d'].show=ns['show_q'];ns['d'].show_tree=ns['show_tree']
    ns['S4_REVISIONS']=None;ns['S4_PUMP']=None
    ns['_S4_BASE_APPLY']=ns['apply']
    ns['_S4_REV']=module('desk_d1a_s4_revisions_gpt_20261028.py')
    ns['_S4_PUMP']=module('desk_d1a_s4_pump_gpt_20261028.py')
    ns['_S4_REV'].build(ns);ns['_S4_PUMP'].build(ns)
    added=ns['S4_REVISIONS']['objects']+ns['S4_PUMP']['all']
    for o in added:
        if o not in ns['BASE']:
            ns['MANAGED'].append(o);ns['BASE'][o]=(o.location.copy(),o.rotation_euler.copy(),o.scale.copy())
    children={o:[] for o in ns['d'].SC.objects}
    for o in ns['d'].SC.objects:
        if o.parent:children.setdefault(o.parent,[]).append(o)
    ns['CHILDREN']=children
    ns['apply']=lambda t:apply(ns,t)
    ns['_S4_ANCHORS']={};ns['_S4_MACRO']={};ns['_S4_PRIMARY']={};ns['_S4_CAMERA']={}
    NS=ns
    bound_file=CACHE/'bound.json'
    if bound_file.exists():
        bound_file=CACHE/('bound_recovered_'+time.strftime('%Y%m%dT%H%M%S')+'_'+str(os.getpid())+'.json')
        assert not bound_file.exists()
    write(bound_file,dict(stage='S4',objects=len(ns['MANAGED']),newObjects=len(added),nativeRequired=[1080,1920,16],bound=time.strftime('%Y-%m-%dT%H:%M:%S%z')))
    print('D1A_S4_BOUND',len(added),flush=True)

def apply(ns,t):
    d=ns['d'];d.CAM_D.type='PERSP';d.CAM_D.sensor_fit='AUTO';d.CAM_D.shift_x=0;d.CAM_D.shift_y=-.06;d.CAM_D.dof.use_dof=True
    cam,st,X=ns['_S4_BASE_APPLY'](t)
    # Adopted and personally reviewed S3 C4 corrections, not its low-res files.
    c=ns['cue_at'](t);k=c['key'];j=round(t*FPS)
    if k=='gin:drum' and 789<=j<=926:
        cam=list(ns['CAM']['ginwinding']);cam[0]-=.025;cam[3]=.51;ns['set_camera'](cam)
    if k=='gin:drum' and 927<=j<=1075:
        cam=[-.355,.10,.208,.55,90,25,80];ns['set_camera'](cam)
    if k=='shrink:back':
        u=ns['U'](t,ns['W']('shrink:back','1700分の1'),1.)
        cam=ns['mix']([.05,-.16,.115,.43,-12,25,40],[.015,-.21,.04,.28,-10,35,52],u)
        cam[3]-=.055*math.sin(math.pi*u)**2;ns['set_camera'](cam)
    rr=ns['_S4_REV'].apply(ns,t)
    if rr.get('camera') is not None:cam=rr['camera']
    pp=ns['_S4_PUMP'].apply(ns,t)
    if pp['active']:
        ns['_S4_PUMP'].set_camera(ns,pp['camera']);cam=pp['camera']
    bpy.context.view_layer.update()
    ns['_S4_LAST']=dict(revisions=rr,pump=pp,cam=cam,st=st,X=X,t=t)
    return cam,st,X

def anchor_points(ns,t,st):
    d=ns['d'];points=ns['anchors_now'](t,st)
    last=ns['_S4_LAST']
    for result in [last['revisions'],last['pump']]:
        for name,v in result.get('anchors',{}).items():points[name]=list(d.project(Vector(v)))
    return points

def camera_record(ns,t):
    d=ns['d'];cam=d.CAM;cd=d.CAM_D
    # Camera optical direction, not an estimated height in the rendered image.
    forward=cam.matrix_world.to_3x3()@Vector((0,0,-1))
    forward.normalize()
    elevation=math.degrees(math.asin(max(-1.,min(1.,-forward.z))))
    return dict(frame=round(t*FPS),time=t,type=cd.type,position=list(cam.location),rotation=list(cam.rotation_euler),lens=cd.lens,
                sensor_fit=cd.sensor_fit,ortho_scale=cd.ortho_scale,shift=[cd.shift_x,cd.shift_y],dof=cd.dof.use_dof,
                aperture_fstop=cd.dof.aperture_fstop,focus_distance=cd.dof.focus_distance,
                sensor_size=[cd.sensor_width,cd.sensor_height],elevation=elevation)

def _camera_motion(records,done):
    """Shared-gate-compatible aggregate of exact main-camera records.

    Compare every actual framing/DOF field, with nine-decimal rounding only
    for numerical noise. No macro camera or estimated visual movement enters
    this measurement. DOF values are conservatively compared even when off.
    """
    fields=('type','position','rotation','lens','sensor_fit','ortho_scale',
            'shift','dof','aperture_fstop','focus_distance','sensor_size')
    def rounded(value):
        if isinstance(value,float):return round(value,9)
        if isinstance(value,(tuple,list)):return tuple(rounded(v)for v in value)
        return value
    def signature(record):return tuple(rounded(record[k])for k in fields)
    poses=[records[str(j)]for j in range(done)]
    moving=[False]+[signature(poses[j])!=signature(poses[j-1])for j in range(1,done)]if done else[]
    spans=[];i=0
    while i<done:
        if not moving[i]:i+=1;continue
        end=i+1
        while end<done and moving[end]:end+=1
        spans.append([i/FPS,end/FPS]);i=end
    count=sum(moving)
    return dict(frames=NF,recorded_frames=done,moving_frames=count,
                moving_ratio=count/NF,moving_spans=spans,
                top_frames=sum(p['elevation']>=65 for p in poses),
                top_ratio=sum(p['elevation']>=65 for p in poses)/NF,
                top_threshold_degrees=65,fps=FPS,complete=done==NF,
                compared_fields=list(fields),float_rounding_decimal_places=9,
                method='Actual main-camera transform, projection and DOF records; cuts count; no macro camera. Partial ratios use full-film denominator until complete.')

def _camera_snapshot(ns):
    d=ns['d'];cd=d.CAM_D
    return (d.CAM.matrix_world.copy(),{k:getattr(cd,k)for k in ['type','lens','sensor_fit','ortho_scale','shift_x','shift_y']},
            {k:getattr(cd.dof,k)for k in ['use_dof','aperture_fstop','focus_distance']})
def _camera_restore(ns,snap):
    d=ns['d'];d.CAM.matrix_world=snap[0]
    for k,v in snap[1].items():setattr(d.CAM_D,k,v)
    for k,v in snap[2].items():setattr(d.CAM_D.dof,k,v)

def _render(ns,file,width,height,samples):
    d=ns['d'];sc=d.SC
    sc.render.resolution_x=width;sc.render.resolution_y=height;sc.render.resolution_percentage=100
    sc.eevee.taa_render_samples=samples;sc.render.image_settings.file_format='JPEG';sc.render.image_settings.quality=95
    sc.render.filepath=str(file);assert not Path(file).exists(),'Never overwrite a rendered frame'
    bpy.ops.render.render(write_still=True,scene=sc.name)

def macro_specs(ns,t,points):
    specs=[];a=ns['W']('air:1kg','1平方センチメートル');b=ns['W']('air:1kg','手のひら')
    if a<=t<b:
        fade=min(1,max(.1,(t-a)/.3),max(.1,(b-t)/.3))
        specs.append(dict(kind='square',pose=[.418,-.045,.006,.12,-6,35,200],focus=[.418,-.045,.007],
                          target=list(ns['d'].project(Vector((.418,-.045,.002)))),circle=[690,650,325],opacity=fade))
    for p in ns['_S4_LAST']['pump'].get('macro',[]):
        a,b=p['start'],p['end'];fade=min(1,max(0,(t-a)/.12),max(0,(b-t)/.12))
        specs.append(dict(kind=p['name'],camera=p['camera'],target=points[p['name']],circle=[760,900,160],opacity=fade))
    return specs

def _macros(ns,j,out,points,samples,edge):
    t=j/FPS;sc=ns['d'].SC;snap=_camera_snapshot(ns);settings=(sc.render.resolution_x,sc.render.resolution_y)
    entries=[]
    try:
        for spec in macro_specs(ns,t,points):
            # Macro geometry state is the same instant as the main frame.
            if spec.get('pose'):
                ns['d'].pose_cam(spec['pose']);ns['d'].CAM_D.dof.aperture_fstop=22
                ns['d'].CAM_D.dof.focus_distance=(Vector(spec['focus'])-ns['d'].CAM.location).length
            else:ns['_S4_PUMP'].set_camera(ns,spec['camera'])
            p=out/'macro'/spec['kind']/('%05d.jpg'%j);p.parent.mkdir(parents=True,exist_ok=True)
            if not p.exists():_render(ns,p,edge,edge,samples)
            entries.append({k:spec[k]for k in ('kind','target','circle','opacity')}|dict(image=str(p.relative_to(CACHE)),resolution=[edge,edge],samples=samples,realSeparate3DCamera=True))
    finally:
        _camera_restore(ns,snap);sc.render.resolution_x,sc.render.resolution_y=settings;bpy.context.view_layer.update()
    return entries

def _probe(ns,t):
    out=ns['_S4_REV'].measure(ns,t)
    p=ns['_S4_LAST']['pump']
    if p['active']:
        # Reuse the explicit vertex projector, with strict per-part thresholds.
        fake=dict(time=t,roles=p['measurements'],camera=p['camera'])
        out['pump']=ns['_S4_REV'].measure(ns,t,fake)
        out['pumpState']={k:p[k]for k in ['sphere_count','piston_z','doorangles','timing']}
    return out

def preview(label='p1',times=None):
    assert NS is not None and label.replace('_','').isalnum()
    ns=NS;out=CACHE/'preview'/label;assert not out.exists();out.mkdir(parents=True)
    times=times or ([float(t)for t in range(314,341)]+[26.3,26.9,31,31.5,34.5,114,117,125,184.7,186,188,191,195.4,197.9,212,214,216.4,219.5,221,276.7,278.7,279.5,280.3,303,307,311,341,345,366,373,381,386])
    indices=sorted(set(min(NF-1,max(0,round(t*FPS)))for t in times))
    d=ns['d'];win=bpy.context.window or next(iter(bpy.context.window_manager.windows));win.scene=d.SC
    records=[];anc={};macro={}
    with open(CACHE/('preview-'+label+'.log'),'a',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            with bpy.context.temp_override(window=win,scene=d.SC,view_layer=d.SC.view_layers[0]):
                for j in indices:
                    t=j/FPS;cam,st,X=apply(ns,t);points=anchor_points(ns,t,st)
                    p=out/('%05d.jpg'%j);_render(ns,p,540,960,4)
                    anc[str(j)]=points;macro[str(j)]=_macros(ns,j,out,points,4,480)
                    records.append(dict(frame=j,time=t,cue=ns['cue_at'](t)['key'],image=str(p),measurement=_probe(ns,t),camera=camera_record(ns,t)))
                    print('PREVIEW',j,flush=True)
            write(out/'anchors.json',anc);write(out/'macro-frames.json',dict(entries=macro))
            write(out/'manifest.json',dict(stage='S3 revised S4 candidate',frames=records,personallyViewed=False))
            print('S4_PREVIEW_COMPLETE',label,len(records),flush=True)
        except BaseException:traceback.print_exc();raise
    return None

def refresh(rebuild=False):
    """Refresh only newly authored behaviour; keep already-built objects."""
    ns=NS;assert ns is not None
    ns['_S4_REV']=module('desk_d1a_s4_revisions_gpt_20261028.py')
    ns['_S4_PUMP']=module('desk_d1a_s4_pump_gpt_20261028.py')
    if rebuild:
        old=ns.pop('S4_REVISIONS')
        for o in old['objects']:ns['show_now'](o,False)
        ns['P']['can']['can']['body'].active_material=old['canMaterial']
        ns['_S4_BASE_APPLY'](ns['W']('air:1kg','1キログラム')+.25)
        bpy.context.view_layer.update()
        q=ns['_S4_REV'].build(ns)
        for o in q['objects']:
            if o not in ns['BASE']:
                ns['MANAGED'].append(o);ns['BASE'][o]=(o.location.copy(),o.rotation_euler.copy(),o.scale.copy())
    children={o:[] for o in ns['d'].SC.objects}
    for o in ns['d'].SC.objects:
        if o.parent:children.setdefault(o.parent,[]).append(o)
    ns['CHILDREN']=children
    return None

def role(ns,c,t):
    """Read-only semantic phase; also valid while preparing a shot plan."""
    k=c['key'];p=ns['P'];q=ns['S4_REVISIONS'];name=None;objects=[];minimum=None
    if k.startswith('guericke:'):
        name='球・管・筒・弁・取っ手の実物全体';objects=ns['S4_PUMP']['roles']['whole'];minimum=.70
    elif k=='air:inside':
        can=t>=ns['W'](k,'缶がつぶれた')
        name='内外の圧力を比べる逆さの缶' if can else '内外から押される手のひら'
        objects=[p['can']['can']['root']]if can else[q['palm']];minimum=.60 if can else .50
    elif k=='air:weight':
        name='人の頭上から積もる空気の層';objects=p['air']['layers']+ns['COR']['airhead']['primary'];minimum=.35
    elif k=='gin:drum':
        close=t>=ns['W'](k,'一方の桶');name='水入りと空の2つの桶'if close else'馬と坑内の2つの桶'
        objects=[x[0]for x in ns['EX']['gin']['buckets']]if close else ns['EX']['gin']['primary'];minimum=.40 if close else .60
    elif k in ('shrink:spoon','shrink:1700','shrink:back'):
        name='左手前の大さじと右奥の風船';objects=q['spoon']+[p['balloon']['balloon']];minimum=.60
    elif k=='size:guericke':name='ゆっくり回り合わさる2つの銅半球';objects=p['hemi']['parts'];minimum=.50
    elif k=='size:pull':name='8頭の馬と張った綱と銅の球';objects=[h['root']for h in p['hemi']['horses']]+p['hemi']['parts']+p['hemi']['ropes'];minimum=.80
    elif k=='size:2t':
        a=ns['W'](k,'22枚');b=ns['W'](k,'2200キログラム')+.8
        if t<a:name='手のひら1枚と100kgの重り';objects=q['pairs'][0]['all']
        elif t<b:name='2列11組の手のひらと100kgから2tへ';objects=[v['root']for v in q['pairs']]+[p['heavy']['weight']]
        else:name='集まった2トンの重り';objects=[p['heavy']['weight']]
        minimum=.55
    elif k=='last:can':name='水が湧き続ける炭鉱の断面';objects=ns['G']['mine'];minimum=.70
    assert name is not None,k
    return dict(name=name,objects=objects,minWidth=minimum,reason='Latest Claude S3 correction semantic subject; actual real objects only')

def source_definition():
    paths=[Path(__file__),W/'scripts/blender/desk_d1a_s4_revisions_gpt_20261028.py',
           W/'scripts/blender/desk_d1a_s4_pump_gpt_20261028.py',W/'scripts/blender/desk_d1a_s4_qa_gpt_20261028.py']
    paths+=sorted((W/'scripts/umech').glob('*d1a*s4*gpt_20261028*'))
    paths+=[CACHE/x for x in ['plan.json','ys-chain-d1a.json','phrase-times.json','timed-selection.json','prosody.txt','word-events-actual_s3_20261028.json','blender/data.json','ys-chain-d1a.voice.wav']]
    assert all(p.is_file()for p in paths),'A required frozen source/input is missing'
    digests={str(p):sha(p)for p in dict.fromkeys(paths)}
    key=hashlib.sha256(json.dumps(digests,sort_keys=True).encode()).hexdigest()[:24]
    return dict(key=key,files=digests,stage='S4',resolution=[1080,1920],samples=16,fps=FPS,frames=NF)

def setup_qa(ns,key):
    ns['_S4_KEY']=key;ns['_S4_QA']=module('desk_d1a_s4_qa_gpt_20261028.py')
    for k in ['guericke:build','guericke:pull','guericke:push','air:inside','air:weight','gin:drum','shrink:spoon','shrink:1700','shrink:back','size:guericke','size:pull','size:2t','last:can']:
        ns['SHOTQA_PRIMARY'][k]=role
    ns['S4_MACRO_PRIMARY']=lambda sj: next(iter(ns['_S4_MACRO'].get(sj,[])),None)
    ns['S4_MACRO_WINDOWS']=[] # Pump's primary is the whole real rig, not its small inset.

def _checkpoint(ns,definition,finished=False):
    root=CACHE/'blender';key=definition['key']
    # A raw render may exist while its macro or primary failed. Only the
    # contiguous intersection of ALL five evidence streams is resumably done.
    buffers={name:ns[name]for name in ('_S4_ANCHORS','_S4_MACRO','_S4_CAMERA','PRIMARY','S4_PRIMARY_METADATA')}
    done=0
    while done<NF and all(str(done)in records for records in buffers.values()):done+=1
    if finished:assert done==NF,'Final checkpoint needs every raw/macro/camera/primary evidence frame'
    prefix={str(j)for j in range(done)}
    anchor_records={j:record for j,record in ns['_S4_ANCHORS'].items()if j in prefix}
    macro_records={j:record for j,record in ns['_S4_MACRO'].items()if j in prefix}
    camera_records={j:record for j,record in ns['_S4_CAMERA'].items()if j in prefix}
    names=sorted({name for record in anchor_records.values()for name in record})
    table={name:[anchor_records.get(str(j),{}).get(name,[0,0,False])for j in range(NF)]for name in names}
    write(root/'desk/anchors.json',dict(key=key,frames=NF,fps=FPS,renderedFrames=done,anchors=table))
    write(root/'macro-frames.json',dict(entries=macro_records))
    write(root/'delivered-camera-records.json',camera_records)
    write(root/'camera-motion.json',_camera_motion(camera_records,done))
    # Save only complete evidence without destroying the in-memory failed-frame
    # diagnostic. A resume starts at the recorded prefix and reuses its native
    # raw file only after validating its real dimensions.
    original_primary=ns['PRIMARY'];original_metadata=ns['S4_PRIMARY_METADATA']
    try:
        ns['PRIMARY']={j:r for j,r in original_primary.items()if j in prefix}
        ns['S4_PRIMARY_METADATA']={j:r for j,r in original_metadata.items()if j in prefix}
        ns['_S4_QA'].save(ns,root,key,complete=finished)
    finally:ns['PRIMARY']=original_primary;ns['S4_PRIMARY_METADATA']=original_metadata
    pending=sorted({int(j)for records in buffers.values()for j in records if j not in prefix})
    write(root/'desk/meta.json',definition|dict(frames=NF,renderedFrames=done,uncheckpointedEvidenceFrames=pending,started=ns['_S4_STARTED'],finished=time.strftime('%Y-%m-%dT%H:%M:%S%z')if finished else None,previewOnly=False))
    write(CACHE/'render-progress.json',dict(done=done,frames=NF,key=key,finished=finished,at=time.strftime('%Y-%m-%dT%H:%M:%S%z')))

def production():
    """Native one-pass S4; resume only the same frozen scene, no force flag."""
    ns=NS;assert ns is not None
    approval=read(CACHE/'S4_VISUAL_APPROVED.json');definition=source_definition();key=definition['key']
    assert approval['approved']is True and approval['sourceKey']==key,'Source changed after visual approval'
    assert not (CACHE/'blender/desk/meta.json').exists(),'Use resume() for the same interrupted pass'
    setup_qa(ns,key);ns['_S4_STARTED']=time.strftime('%Y-%m-%dT%H:%M:%S%z')
    ns['PRIMARY']={};ns['S4_PRIMARY_METADATA']={};ns['S4_PRIMARY_SELECTIONS']=[];ns['_S4_QA_SELECTION_INDEX']={}
    ns['_S4_ANCHORS']={};ns['_S4_MACRO']={};ns['_S4_CAMERA']={}
    ns['_S4_QA'].build_shot_plan(ns,CACHE)
    return _production_loop(ns,definition,0)

def _production_loop(ns,definition,start):
    d=ns['d'];win=bpy.context.window or next(iter(bpy.context.window_manager.windows));win.scene=d.SC
    root=CACHE/'blender/desk';began=time.time()
    with open(CACHE/'s4-render.log','a',buffering=1)as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            with bpy.context.temp_override(window=win,scene=d.SC,view_layer=d.SC.view_layers[0]):
                for j in range(start,NF):
                    if (CACHE/'STOP_S4').exists():
                        _checkpoint(ns,definition);print('S4_SAFE_STOP',j,flush=True);return None
                    t=j/FPS;cam,st,X=apply(ns,t);points=anchor_points(ns,t,st)
                    f=root/('%05d.jpg'%j)
                    if not f.exists():_render(ns,f,1080,1920,16)
                    else:
                        # Only a frame created before an interrupted checkpoint can exist.
                        im=bpy.data.images.load(str(f),check_existing=False)
                        try:assert tuple(im.size)==(1080,1920)
                        finally:bpy.data.images.remove(im)
                    ns['_S4_ANCHORS'][str(j)]=points
                    ns['_S4_MACRO'][str(j)]=_macros(ns,j,CACHE,points,16,768)
                    ns['_S4_CAMERA'][str(j)]=camera_record(ns,t)
                    ns['_S4_QA'].measure(ns,t)
                    if j%120==0:
                        _checkpoint(ns,definition);print('S4_NATIVE',j,'/',NF,'elapsed',time.time()-began,flush=True)
                assert source_definition()['key']==definition['key'],'Frozen production sources changed'
                _checkpoint(ns,definition,True)
            print('S4_NATIVE_COMPLETE',NF,'elapsed',time.time()-began,flush=True)
        except BaseException:
            _checkpoint(ns,definition);traceback.print_exc();raise
    return None

def resume():
    ns=NS;definition=source_definition();key=definition['key'];meta=read(CACHE/'blender/desk/meta.json')
    approval=read(CACHE/'S4_VISUAL_APPROVED.json');assert approval['approved']is True and approval['sourceKey']==key
    assert meta['key']==key and not meta.get('finished')
    setup_qa(ns,key);ns['_S4_STARTED']=meta['started']
    a=read(CACHE/'blender/desk/anchors.json');done=meta['renderedFrames']
    ns['_S4_ANCHORS']={str(j):{name:values[j]for name,values in a['anchors'].items()}for j in range(done)}
    ns['_S4_MACRO']=read(CACHE/'blender/macro-frames.json')['entries']
    ns['_S4_CAMERA']=read(CACHE/'blender/delivered-camera-records.json')
    ns['_S4_QA'].load(ns,CACHE/'blender',key)
    done=len(ns['_S4_ANCHORS']);assert set(ns['_S4_ANCHORS'])=={str(j)for j in range(done)}
    return _production_loop(ns,definition,done)

def problem():
    """Two native stills, time-independent supplied setup/answer functions."""
    ns=NS;d=ns['d'];out=CACHE/'problem';out.mkdir(parents=True,exist_ok=True)
    master=W/'docs/video-revision-20260924/deep/技術の疑問の鎖_D-1前編_ナレーション.md'
    text=master.read_text();heading='## 問題編への接続（いまは作らない。入れるときのため）'
    assert text.count(heading)==1
    section=text[text.index(heading):]
    win=bpy.context.window or next(iter(bpy.context.window_manager.windows));win.scene=d.SC
    with bpy.context.temp_override(window=win,scene=d.SC,view_layer=d.SC.view_layers[0]):
        d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.render.resolution_percentage=100;d.SC.eevee.taa_render_samples=16
        try:
            for name,fn in [('挑戦.png',ns['challenge_setup']),('答え.png',ns['answer_state'])]:
                f=out/name;assert not f.exists()
                d.CAM_D.type='PERSP';d.CAM_D.shift_x=0;d.CAM_D.shift_y=-.06;d.CAM_D.sensor_fit='AUTO'
                fn();d.SC.render.image_settings.file_format='PNG';d.SC.render.filepath=str(f)
                bpy.ops.render.render(write_still=True,scene=d.SC.name)
        finally:d.SC.render.image_settings.file_format='JPEG'
    write(out/'problem.json',dict(episode='d1a',master=str(master),masterSha256=sha(master),
         sourceSectionVerbatim=section,wordingEdited=False,timeIndependent=True,
         components=['富士山の模型','ふもとと頂上の空気の柱','同じ新型機械の小模型','押す力の矢印'],
         setup=str(out/'挑戦.png'),answer=str(out/'答え.png')))
    print('S4_PROBLEM_READY',flush=True)

