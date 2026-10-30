"""E1 r9: one actual sway-union correction, all 30fps physical poses first."""
import ast,hashlib,json,os,time
from desk_render_axes import explicit_scene_bpy
from desk_e1v1_hotfix_r8 import physical_audit
def changed(t,g):
    return (g['T']('lat:equator','北極星')<=t<=g['E']('lat:50') or
            g['S']('dr:none')<=t<=g['S']('dr:drift')+1.01 or
            g['S']('pen:hyp')<=t<=g['S']('prize:act')+1.01 or
            g['S']('next:order')<=t<g['S']('ch:noon'))
def run(ns,mode='audit',out='/private/tmp/ys/ys-chain-e1v1/blender/gate-e1v1-r9'):
    g=ns['apply'].__globals__;A=g['A'];d=g['d'];bpy=g['bpy'];ext=g['ext']
    assert A.cache=='/private/tmp/ys/ys-chain-e1v1';bpy.context.window.scene=d.SC
    path=g['__file__'];freeze=json.load(open(A.cache+'/e1v1-r9-source-freeze.json'))
    for relative,file in [('scripts/blender/desk_e1v1.py',path),('scripts/blender/desk_lib_e1.py',ext.__file__),('scripts/blender/desk_e1v1_hotfix_r9.py',__file__)]:assert hashlib.sha256(open(file,'rb').read()).hexdigest()==freeze['files'][relative],relative+' changed after freeze'
    names={'main','catalog','render_problem','sway_motion_calibrated'}
    nodes=[n for n in ast.parse(open(path).read(),path).body if isinstance(n,ast.FunctionDef) and n.name in names];assert len(nodes)==len(names)
    g['explicit_scene_bpy']=explicit_scene_bpy;exec(compile(ast.Module(body=nodes,type_ignores=[]),path,'exec'),g)
    fit=json.load(open(A.cache+'/blender/gate-e1v1-r7/r7-keyframes-actual.json'))
    # r7 stores only the two fitted replacement poses. Sway remains the
    # existing E1 scene/source pose and is measured below, not read from r7.
    for name in ['log','pendulum']:g['CAMERAS'][name]=tuple(fit['cameras'][name])
    g['KEYS']=g['camera_keys']();os.makedirs(out,exist_ok=True);started=time.time()
    g['CAMERAS']['sway']=g['sway_motion_calibrated'](g['CAMERAS']['sway']);g['KEYS']=g['camera_keys']()
    json.dump(g['SWAY_MOTION_PROOF'],open(out+'/e1v1-r9-sway-full30fps-bounds.json','w'),ensure_ascii=False,indent=2)
    audit=physical_audit(g,out)
    json.dump(audit,open(out+'/e1v1-r9-physical-bounds.json','w'),ensure_ascii=False,indent=2)
    if mode=='audit':return g
    if audit['stableViolations']:raise RuntimeError('E1 physical bounds have actual NG; no images rendered')
    d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.eevee.taa_render_samples=16;d.SC.render.image_settings.file_format='JPEG';d.SC.render.image_settings.quality=95
    A.force=False;A.no_anchors=False;A.start=0;A.stop=1e9;A.every=1
    if mode in ['probe','trial']:
        times=freeze['preview']['times'] if mode=='probe' else [309.4,318.8,320.76,326.43,328.4]
        A.times=','.join(map(str,times));A.out=out+('/frames' if mode=='probe' else '/trial');os.makedirs(A.out,exist_ok=True)
        if mode=='probe':
            for t in times:
                if changed(t,g):continue
                file='%05d.jpg'%round(t*30);src=A.cache+'/blender/gate-e1v1-r5/frames/'+file;dst=A.out+'/'+file
                if not os.path.lexists(dst):assert os.path.isfile(src),src;os.symlink(src,dst)
        g['main']()
    elif mode=='full':
        A.times=None;A.out=A.cache+'/blender/desk'
        if os.path.exists(A.out):raise RuntimeError('E1 production output already exists; use a new version')
        g['main']()
    else:raise ValueError(mode)
    json.dump({'mode':mode,'seconds':round(time.time()-started,2),'out':A.out,'cameras':g['CAMERAS'],'sway':{k:v for k,v in g['SWAY_MOTION_PROOF'].items() if k!='rows'},'explicitOwnedScene':d.SC.name,'reuseSkipsExistingFiles':True,'fullGate':'not evaluated'},open(out+'/r9-'+mode+'-actual.json','w'),ensure_ascii=False,indent=2)
    print('E1 r9',mode,'complete',round(time.time()-started,2),'seconds',flush=True);return g
