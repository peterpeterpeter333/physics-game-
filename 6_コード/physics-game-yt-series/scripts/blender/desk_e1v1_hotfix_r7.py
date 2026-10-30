"""E1 r7 actual-union camera fit, then assertions before any rendering."""
import ast,hashlib,json,os,time
KEY_TIMES=[245.5,249.8,255.9,260.5,262.4,296.5,297,297.7,298.3,300]
def run(ns,mode='keyframes',out='/private/tmp/ys/ys-chain-e1v1/blender/gate-e1v1-r7'):
    g=ns['apply'].__globals__;A=g['A'];d=g['d'];ext=g['ext'];bpy=g['bpy'];V=g['Vector']
    assert A.cache=='/private/tmp/ys/ys-chain-e1v1';bpy.context.window.scene=d.SC
    path=g['__file__'];source=open(path).read();freeze=json.load(open(A.cache+'/e1v1-r7-source-freeze.json'))
    for relative,file in [('scripts/blender/desk_e1v1.py',path),('scripts/blender/desk_lib_e1.py',ext.__file__),('scripts/blender/desk_e1v1_hotfix_r7.py',__file__)]:assert hashlib.sha256(open(file,'rb').read()).hexdigest()==freeze['files'][relative],relative+' changed after freeze'
    names={'fitted_camera','calibrated_camera','camera_keys'}
    nodes=[n for n in ast.parse(source,path).body if isinstance(n,ast.FunctionDef) and n.name in names];assert len(nodes)==len(names)
    exec(compile(ast.Module(body=nodes,type_ignores=[]),path,'exec'),g)
    g['apply'](249.8);g['POINTS']['log']=g['cloud']('ship');g['POINTS']['log_fit']=g['cloud']('ship','hourglass','compass','sailor')
    g['apply'](300);g['POINTS']['pendulum']=g['cloud']('pendulum');g['POINTS']['pendulum_fit']=g['POINTS']['pendulum']+[p+V((0,0,.1)) for p in g['POINTS']['pendulum']]
    for name in ['log','pendulum']:g['CAMERAS'][name]=g['calibrated_camera'](name)
    g['KEYS']=g['camera_keys']();os.makedirs(out,exist_ok=True);actual=[]
    # Audit ALL physical endpoints and transition poses. Entry into a new shot
    # is recorded honestly, never hidden or used as a stable-shot fit assertion.
    transition=[]
    for c in g['CUES']:
        if c['camera'] in ['log','pendulum'] or c['key'] in ['dr:drift','pen:fact']:
            transition += [c['start']+c['move']*i/10 for i in range(11)] if c['move'] else [c['start'],c['end']-.001]
    test=sorted(set(KEY_TIMES+transition))
    for t in test:
        g['apply'](t);c=g['current'](t)
        groups=['ship','hourglass','compass','sailor'] if c['camera']=='log' else ['pendulum'] if c['camera']=='pendulum' else ['chart'] if c['key']=='dr:drift' else ['ship','pendulum']
        bounds={}
        for name in groups:
            q=[d.project(v) for v in g['cloud'](name)];bounds[name]=[min(v[0] for v in q),min(v[1] for v in q),max(v[0] for v in q),max(v[1] for v in q)]
        stable=not c['move'] or t>=c['start']+c['move']-1e-7
        if stable and c['camera'] in ['log','pendulum']:
            for name,box in bounds.items():assert box[0]>=40 and box[1]>=110 and box[2]<=1040 and box[3]<=1550,(t,name,box)
        actual.append({'t':t,'cue':c['key'],'stable':stable,'pose':g['pose_at'](t),'boxes':bounds})
    record={'mode':mode,'actualBoundsAsserts':'PASS for every stationary physical endpoint and lowered/raised union','transitionBounds':'every tenth of each camera transition recorded; physical entry is not concealed','cameras':{n:g['CAMERAS'][n] for n in ['log','pendulum']},'actual':actual}
    json.dump(record,open(out+'/r7-bounds.json','w'),ensure_ascii=False,indent=2)
    if mode=='bounds':return g
    d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.eevee.taa_render_samples=16;d.SC.render.image_settings.file_format='JPEG';d.SC.render.image_settings.quality=95
    A.force=False;A.no_anchors=False;A.start=0;A.stop=1e9;A.every=1;started=time.time()
    if mode=='keyframes':times=KEY_TIMES
    elif mode=='probe':times=freeze['preview']['times']
    elif mode=='full':
        A.times=None;A.out=A.cache+'/blender/desk'
        if os.path.exists(A.out):raise RuntimeError('E1 production output already exists')
        g['main']();return g
    else:raise ValueError(mode)
    times=sorted(set(round(t*30)/30 for t in times));A.out=out+'/frames';os.makedirs(A.out,exist_ok=True)
    if mode=='probe':
        for t in times:
            changed=(g['T']('lat:equator','北極星')<=t<=g['E']('lat:50') or g['S']('dr:none')<=t<=g['S']('dr:drift')+1.01 or g['S']('pen:hyp')<=t<=g['S']('pen:fact')+1.01 or g['S']('next:order')<=t<g['S']('ch:noon'))
            file='%05d.jpg'%round(t*30);dst=A.out+'/'+file
            if not changed and not os.path.lexists(dst):os.symlink(A.cache+'/blender/gate-e1v1-r5/frames/'+file,dst)
    A.times=','.join(map(str,times));g['main']();record['seconds']=round(time.time()-started,2);record['widths']={n:g['measured'](g['CAMERAS'][n],g['POINTS'][n]) for n in ['log','pendulum']};json.dump(record,open(out+'/r7-'+mode+'-actual.json','w'),ensure_ascii=False,indent=2)
    print('E1 r7',mode,'complete',record['seconds'],'seconds',flush=True);return g
