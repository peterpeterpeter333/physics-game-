"""E1 factual r6 bundle; update only retained E1 objects and functions.

No factory reset, new geometry, deletion, shared-file edits or metric masking.
The root GUI owns scheduling. Reuse r5 images only outside changed intervals.
"""
import ast,hashlib,json,os,time
KEY_TIMES=[71.85,73.3,73.9,74.56,79.89,80.3,81.1,84.5,87.45,87.85,88.25,89.23,
           245.5,249.8,255.9,260.5,262.4,295.6,296.5,297,297.7,298.3,300,309.5,
           350,351,354.3,359]
def changed(t,g):
    return (g['T']('lat:equator','北極星')<=t<=g['E']('lat:50') or
            g['S']('dr:none')<=t<=g['S']('dr:drift')+1.01 or
            g['S']('pen:hyp')<=t<=g['S']('pen:fact')+1.01 or
            g['S']('next:order')<=t<g['S']('ch:noon'))
def run(ns,mode='keyframes',out='/private/tmp/ys/ys-chain-e1v1/blender/gate-e1v1-r6'):
    g=ns['apply'].__globals__;A=g['A'];d=g['d'];ext=g['ext'];bpy=g['bpy']
    assert A.cache=='/private/tmp/ys/ys-chain-e1v1'
    bpy.context.window.scene=d.SC
    source_path=g['__file__'];source=open(source_path).read()
    freeze=json.load(open(A.cache+'/e1v1-r6-source-freeze.json'))
    for relative,file in [('scripts/blender/desk_e1v1.py',source_path),('scripts/blender/desk_lib_e1.py',ext.__file__),('scripts/blender/desk_e1v1_hotfix_r6.py',__file__)]:
        assert hashlib.sha256(open(file,'rb').read()).hexdigest()==freeze['files'][relative],relative+' changed after freeze'
    names={'latitude_state','ship_state','calibrated_camera','camera_keys'}
    nodes=[n for n in ast.parse(source,source_path).body if isinstance(n,ast.FunctionDef) and n.name in names]
    assert len(nodes)==len(names)
    exec(compile(ast.Module(body=nodes,type_ignores=[]),source_path,'exec'),g)
    # Measure the real ship, not its long trailing rope or ancillary wave board.
    g['apply'](249.8);g['POINTS']['log']=g['cloud']('ship')
    g['apply'](300);g['POINTS']['pendulum']=g['cloud']('pendulum')
    for name in ['log','pendulum']:g['CAMERAS'][name]=g['calibrated_camera'](name)
    g['KEYS']=g['camera_keys']()
    d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.eevee.taa_render_samples=16
    d.SC.render.image_settings.file_format='JPEG';d.SC.render.image_settings.quality=95
    A.force=False;A.no_anchors=False;A.start=0;A.stop=1e9;A.every=1
    os.makedirs(out,exist_ok=True);started=time.time();reused=0
    if mode in ['keyframes','probe']:
        times=KEY_TIMES if mode=='keyframes' else freeze['preview']['times']
        times=sorted(set(round(t*30)/30 for t in times));A.out=out+'/frames';os.makedirs(A.out,exist_ok=True)
        if mode=='probe':
            old=A.cache+'/blender/gate-e1v1-r5/frames'
            for t in times:
                file='%05d.jpg'%round(t*30);src=old+'/'+file;dst=A.out+'/'+file
                if not changed(t,g) and not os.path.lexists(dst):
                    assert os.path.isfile(src),src;os.symlink(src,dst);reused+=1
        A.times=','.join(map(str,times));g['main']()
    elif mode=='full':
        A.times=None;A.out=A.cache+'/blender/desk'
        if os.path.exists(A.out):raise RuntimeError('E1 production output already exists; choose a new scoped version')
        g['main']();times=KEY_TIMES
    else:raise ValueError(mode)
    actual=[]
    for t in times:
        g['apply'](t);c=g['current'](t)
        if c['row'] not in [10,11,28,29,33,34,39]:continue
        groups=['ship','log','hourglass','compass'] if c['row'] in [28,29] else ['pendulum'] if c['row'] in [33,34] else ['ghost'] if c['row']==39 else ['globe']
        bounds={}
        for name in groups:
            pts=[d.project(p) for p in g['cloud'](name)]
            if pts:bounds[name]={'box':[min(p[0] for p in pts),min(p[1] for p in pts),max(p[0] for p in pts),max(p[1] for p in pts)],'width':(max(p[0] for p in pts)-min(p[0] for p in pts))/1080}
        actual.append({'t':t,'cue':c['key'],'pose':g['pose_at'](t),'bounds':bounds})
    record={'mode':mode,'seconds':round(time.time()-started,2),'out':A.out,'r5ImagesLinked':reused,'cameras':g['CAMERAS'],'subject_widths':{n:g['measured'](p,g['POINTS'][n]) for n,p in g['CAMERAS'].items()},'actual':actual,'fixes':['North pole event is occurrence 1, not 北極星','30 to 50 at イギリスの南, label hidden during motion, yellow only at 50度','ghost world location reset every row39 apply','ship body48% log closeup, original rope/hourglass/compass unchanged','pendulum body48% and raised camera center encompass its instructed lowering'],'sourceFreeze':A.cache+'/e1v1-r6-source-freeze.json'}
    json.dump(record,open(out+'/r6-'+mode+'-actual.json','w'),ensure_ascii=False,indent=2)
    print('E1 r6',mode,'complete',record['seconds'],'seconds, linked r5',reused,flush=True)
    return g
