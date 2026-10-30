"""E1 final r5: the last trial-confirmed corrections, then one whole probe.

No model creation/reset/deletion. Root calls run(old_E1_ns, mode) in the GUI.
The retained E1 scene must already have received r3 and r4.
"""
import ast,hashlib,json,math,os,time
def run(ns,mode='probe',out='/private/tmp/ys/ys-chain-e1v1/blender/gate-e1v1-r5'):
    g=ns['apply'].__globals__;A=g['A'];d=g['d'];ext=g['ext'];bpy=g['bpy'];V=g['Vector']
    assert A.cache=='/private/tmp/ys/ys-chain-e1v1'
    bpy.context.window.scene=d.SC
    path=g['__file__'];source=open(path).read();assert 'R5: the protagonist is the leather pouch' in source
    freeze=json.load(open(A.cache+'/e1v1-r5-source-freeze.json'))
    for relative,file in [('scripts/blender/desk_e1v1.py',path),('scripts/blender/desk_lib_e1.py',ext.__file__),('scripts/blender/desk_e1v1_hotfix_r5.py',__file__)]:assert hashlib.sha256(open(file,'rb').read()).hexdigest()==freeze['files'][relative],relative+' changed after freeze'
    names={'prize_body_points','catalog','configure_fog_wisps','map_state','hands'}
    nodes=[n for n in ast.parse(source,path).body if isinstance(n,ast.FunctionDef) and n.name in names];assert len(nodes)==len(names)
    exec(compile(ast.Module(body=nodes,type_ignores=[]),path,'exec'),g)
    g['configure_fog_wisps']()
    center=g['equatorial_star_position']();count=0
    for ob in g['GROUPS']['southern']:
        if ob.type=='MESH' and d.MATS['e1southernWhite'] in list(ob.data.materials):
            coords=[center]+[center+V((.0143*(1 if j%2==0 else .43)*math.sin(j*math.pi/5),0,.0143*(1 if j%2==0 else .43)*math.cos(j*math.pi/5))) for j in range(10)]
            for vertex,p in zip(ob.data.vertices,coords):vertex.co=p
            ob.data.update();count+=1
    assert count==1,count
    g['POINTS']['prize']=g['prize_body_points']();old=g['CAMERAS']['prize'];new=g['calibrated_camera']('prize');g['CAMERAS']['prize']=new
    for key in g['KEYS']:
        if tuple(key['pose'])==tuple(old):key['pose']=new
    d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.eevee.taa_render_samples=16
    d.SC.render.image_settings.file_format='JPEG';d.SC.render.image_settings.quality=95
    A.force=False;A.no_anchors=False;A.start=0;A.stop=1e9;A.every=1
    os.makedirs(out,exist_ok=True);started=time.time()
    print('E1 r5: white glyph radius .0143; pouch BODY 66%; southern catalog observer0 hidden; natural fog wisps and quiet hand rest match opening; mode',mode,flush=True)
    if mode in ['probe','keyframes']:
        times=freeze['preview']['times'] if mode=='probe' else [103,107,330,332,336.7,337.2,341]
        times=sorted(set(round(t*30)/30 for t in times));A.times=','.join(map(str,times));A.out=out+'/frames';g['main']()
    elif mode=='catalog':A.out=out+'/catalog';g['catalog']()
    elif mode=='problem':A.out=out+'/problem-raw';g['render_problem']()
    elif mode=='full':
        A.times=None;A.out=A.cache+'/blender/desk'
        if os.path.exists(A.out):raise RuntimeError('E1 production output already exists; root must choose a new scoped output')
        g['main']()
    else:raise ValueError('Unknown E1 r5 mode: '+mode)
    record={'mode':mode,'seconds':round(time.time()-started,2),'out':A.out,'cameras':g['CAMERAS'],'subject_widths':{n:g['measured'](p,g['POINTS'][n]) for n,p in g['CAMERAS'].items()},'heroGeometry':{'prize':'leather pouch body vertices at rest; flying coins are ancillary','ship':'ship body/masts/braced sails, not its wave board','star':'Earth body, not white glyph'},'sourceFreeze':A.cache+'/e1v1-r5-source-freeze.json'}
    json.dump(record,open(out+'/r5-'+mode+'-actual.json','w'),indent=2)
    print('E1 r5 render complete',mode,'seconds',record['seconds'],flush=True)
    return g
