"""E1 r8: r7 approved poses, explicit-scene guards and honest complete audit.

No visual/model changes from r7. All 54 E1 cues are audited before new renders.
"""
import ast,hashlib,json,os,time
from desk_render_axes import explicit_scene_bpy
def changed(t,g):
    return (g['T']('lat:equator','北極星')<=t<=g['E']('lat:50') or
            g['S']('dr:none')<=t<=g['S']('dr:drift')+1.01 or
            g['S']('pen:hyp')<=t<=g['S']('pen:fact')+1.01 or
            g['S']('next:order')<=t<g['S']('ch:noon'))
def physical_audit(g,out):
    d=g['d'];bpy=g['bpy'];bpy.context.window.scene=d.SC
    groups={'map':['chart'],'grid':['chart'],'globe':['globe'],'latitude':['globe'],'star':['globe'],'dial':['globe','dial'],'torch':['globe','torch'],'clocks':['tokyo','london'],'arc':['globe','arcs'],'ship':['ship'],'clock':['shipclock'],'log':['ship'],'pendulum':['pendulum'],'sway':['ship','pendulum'],'prize':['prize']}
    rows=[];violations=[];times=[]
    for c in g['CUES']:
        a=min(c['end']-.01,c['start']+c['move']+.02)
        times.extend([a,(a+c['end'])/2,c['end']-.001])
        if c['move']:times.extend(c['start']+c['move']*i/10 for i in range(11))
    times.extend([71.85,73.55,73.85,74.15,87.45,87.85,88.25,89.23,255.75,256.96,259.31,260.5,261.4,296.5,297,297.65,297.95,298.25,317.21,317.89,318.8,320.76,326.43,336.25,336.85,350,351,354.3,359])
    for t in sorted(set(times)):
        g['apply'](t);c=g['current'](t);points=[]
        for name in groups[c['camera']]:
            for ob in g['GROUPS'][name]:
                if ob.hide_render:continue
                if c['camera']=='prize' and not(ob.type=='MESH' and d.MATS['e1leather'] in list(ob.data.materials)):continue
                if ob.type=='MESH':points.extend(ob.matrix_world@v.co for v in ob.data.vertices)
                elif ob.type=='CURVE':
                    for spline in ob.data.splines:points.extend(ob.matrix_world@g['Vector'](p.co[:3]) for p in spline.points)
        q=[d.project(p) for p in points]
        assert q,(t,c['key'])
        box=[min(p[0] for p in q),min(p[1] for p in q),max(p[0] for p in q),max(p[1] for p in q)];width=(box[2]-box[0])/1080
        stable=not c['move'] or t>=c['start']+c['move']-1e-7
        row={'time':t,'cue':c['key'],'row':c['row'],'groups':groups[c['camera']],'stable':stable,'pose':g['pose_at'](t),'box':box,'width':width}
        rows.append(row)
        if stable and not(.4<=width<=.7 and box[0]>=40 and box[1]>=110 and box[2]<=1040 and box[3]<=1550):violations.append(row)
    result={'scope':'actual visible principal mesh/curve vertices, all54cue stable endpoints plus ten divisions of camera transitions and physical extremes; NOT image gate','cues':len(g['CUES']),'samples':len(rows),'stableViolations':violations,'rows':rows,'status':'PASS' if not violations else 'NG'}
    json.dump(result,open(out+'/e1v1-r8-physical-bounds.json','w'),ensure_ascii=False,indent=2)
    print('E1 r8 physical audit',result['status'],'cues',result['cues'],'samples',len(rows),'violations',len(violations),flush=True)
    return result
def run(ns,mode='probe',out='/private/tmp/ys/ys-chain-e1v1/blender/gate-e1v1-r8'):
    g=ns['apply'].__globals__;A=g['A'];d=g['d'];bpy=g['bpy'];ext=g['ext']
    assert A.cache=='/private/tmp/ys/ys-chain-e1v1';bpy.context.window.scene=d.SC
    path=g['__file__'];freeze=json.load(open(A.cache+'/e1v1-r8-source-freeze.json'))
    for relative,file in [('scripts/blender/desk_e1v1.py',path),('scripts/blender/desk_lib_e1.py',ext.__file__),('scripts/blender/desk_e1v1_hotfix_r8.py',__file__)]:assert hashlib.sha256(open(file,'rb').read()).hexdigest()==freeze['files'][relative],relative+' changed after freeze'
    names={'main','catalog','render_problem'};nodes=[n for n in ast.parse(open(path).read(),path).body if isinstance(n,ast.FunctionDef) and n.name in names];assert len(nodes)==len(names)
    g['explicit_scene_bpy']=explicit_scene_bpy;exec(compile(ast.Module(body=nodes,type_ignores=[]),path,'exec'),g)
    # The existing r7 calibration is the accepted deterministic camera fit.
    fit=json.load(open(A.cache+'/blender/gate-e1v1-r7/r7-keyframes-actual.json'))
    for name in ['log','pendulum']:g['CAMERAS'][name]=tuple(fit['cameras'][name])
    g['KEYS']=g['camera_keys']();os.makedirs(out,exist_ok=True);started=time.time()
    audit=physical_audit(g,out)
    if mode=='audit':return g
    if audit['stableViolations']:raise RuntimeError('E1 physical bounds have actual NG; inspect JSON before rendering')
    d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.eevee.taa_render_samples=16;d.SC.render.image_settings.file_format='JPEG';d.SC.render.image_settings.quality=95
    A.force=False;A.no_anchors=False;A.start=0;A.stop=1e9;A.every=1
    if mode=='probe':
        times=freeze['preview']['times'];A.times=','.join(map(str,times));A.out=out+'/frames';os.makedirs(A.out,exist_ok=True)
        for t in times:
            if changed(t,g):continue
            file='%05d.jpg'%round(t*30);src=A.cache+'/blender/gate-e1v1-r5/frames/'+file;dst=A.out+'/'+file
            if not os.path.lexists(dst):assert os.path.isfile(src),src;os.symlink(src,dst)
        g['main']()
    elif mode=='full':
        A.times=None;A.out=A.cache+'/blender/desk'
        if os.path.exists(A.out):raise RuntimeError('E1 production output already exists; choose a scoped new version')
        g['main']()
    else:raise ValueError(mode)
    json.dump({'mode':mode,'seconds':round(time.time()-started,2),'out':A.out,'cameras':g['CAMERAS'],'audit':out+'/e1v1-r8-physical-bounds.json','explicitOwnedScene':d.SC.name,'reuseSkipsExistingFiles':True,'fullGate':'not yet evaluated'},open(out+'/r8-'+mode+'-actual.json','w'),ensure_ascii=False,indent=2)
    print('E1 r8',mode,'complete',round(time.time()-started,2),'seconds',flush=True);return g
