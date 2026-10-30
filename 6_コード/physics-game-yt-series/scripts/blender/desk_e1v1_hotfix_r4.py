"""E1 r4: update the retained E1 scene, never reset or create model objects.

Root owns GUI scheduling. Import this file without side effects, then run(ns,
'keyframes'), inspect, and only then request 'probe'/'catalog'/'problem'/'full'.
"""
import ast,hashlib,json,math,os,time
KEY_TIMES=[0,.5,1,1.5,2,6,6.5,11.5,12,19.5,20,31.5,38.5,49,55.2,81.8,
           103,103.5,104,107,107.5,114.5,131,156.8,162,181.5,182.8,190.7,
           199.5,209.96666666666667,233.8,237,249.8,260.5,270,273,273.5,274,
           274.5,280,280.5,284,285.5,286,287,287.5,292,292.5,300,318.8,
           330,332,336.2,336.7,337.2,338,341,350,362.7,366.3,384.5,385,
           385.5,386,386.5]
def run(ns,mode='keyframes',out='/private/tmp/ys/ys-chain-e1v1/blender/gate-e1v1-r4'):
    g=ns['apply'].__globals__;A=g['A'];d=g['d'];ext=g['ext'];bpy=g['bpy']
    assert A.cache=='/private/tmp/ys/ys-chain-e1v1'
    bpy.context.window.scene=d.SC
    source_path=g['__file__'];source=open(source_path).read()
    assert 'A star is effectively at infinity' in source,'R4 source is not ready'
    freeze=json.load(open(A.cache+'/e1v1-r4-source-freeze.json'))
    for relative,path in [('scripts/blender/desk_e1v1.py',source_path),('scripts/blender/desk_lib_e1.py',ext.__file__),('scripts/blender/desk_e1v1_hotfix_r4.py',__file__)]:
        assert hashlib.sha256(open(path,'rb').read()).hexdigest()==freeze['files'][relative],relative+' changed after freeze'
    names={'equatorial_star_position','configure_fog_wisps','map_state','globe_state','hands','apply_state','calibrated_camera','catalog'}
    nodes=[n for n in ast.parse(source,source_path).body if isinstance(n,ast.FunctionDef) and n.name in names]
    assert len(nodes)==len(names)
    exec(compile(ast.Module(body=nodes,type_ignores=[]),source_path,'exec'),g)
    # Both newly built and retained scenes use the same star position. Keep
    # material identity: other episodes legitimately renamed retained objects.
    southern=g['southern'];newpos=g['equatorial_star_position']();delta=newpos-southern['position'];moved=0
    for ob in g['GROUPS']['southern']:
        if ob.type=='MESH' and d.MATS['e1southernWhite'] in list(ob.data.materials):
            for v in ob.data.vertices:v.co+=delta
            ob.data.update();moved+=1
    assert moved==1,moved
    southern['position']=newpos
    ext.fadeable(g['PARTS']['star']);g['configure_fog_wisps']()
    # Recalibrate only the two documented camera deviations, rebuilding the
    # same deterministic keys so the initial six-percent approach is retained.
    for name in ['map','star']:g['CAMERAS'][name]=g['calibrated_camera'](name)
    keys=[]
    for c in g['CUES']:
        target=g['CAMERAS'][c['camera']]
        if c['move']:
            previous=keys[-1]['pose'] if keys else tuple(list(target[:3])+[target[3]*1.06]+list(target[4:]))
            keys.extend([{'t':c['start'],'pose':previous,'cut':False},{'t':c['start']+c['move'],'pose':target,'cut':False}])
        else:keys.append({'t':c['start'],'pose':target,'cut':False})
        keys.append({'t':c['end'],'pose':target,'cut':False})
    keys.sort(key=lambda k:k['t']);g['KEYS']=keys
    d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.eevee.taa_render_samples=16
    d.SC.render.image_settings.file_format='JPEG';d.SC.render.image_settings.quality=95
    os.makedirs(out,exist_ok=True);started=time.time()
    print('E1 r4 applied: parallel star rays, natural pouch placement, fog world velocity/phase, two-mark pulse, closing hand; mode',mode,flush=True)
    print('E1 r4 numerical camera calibration',json.dumps({n:{'pose':g['CAMERAS'][n],'width':g['measured'](g['CAMERAS'][n],g['POINTS'][n])} for n in ['map','star']}),flush=True)
    A.force=False;A.no_anchors=False;A.start=0;A.stop=1e9;A.every=1
    if mode in ['keyframes','probe']:
        times=KEY_TIMES if mode=='keyframes' else freeze['preview']['times']
        times=sorted(set(round(t*30)/30 for t in times));A.times=','.join(map(str,times));A.out=out+'/frames';g['main']()
    elif mode=='catalog':A.out=out+'/catalog';g['catalog']()
    elif mode=='problem':A.out=out+'/problem-raw';g['render_problem']()
    elif mode=='full':
        A.times=None;A.out=A.cache+'/blender/desk'
        if os.path.exists(A.out):raise RuntimeError('E1 production output already exists; root must choose a new scoped output')
        g['main']()
    else:raise ValueError('Unknown E1 r4 mode: '+mode)
    record={'mode':mode,'seconds':round(time.time()-started,2),'out':A.out,'cameras':g['CAMERAS'],'subject_widths':{n:g['measured'](p,g['POINTS'][n]) for n,p in g['CAMERAS'].items()},'star':{'whiteGlyphPosition':list(newpos),'direction':[0,-1,0],'eyeRadius':.147,'latitude':50,'transitAltitude':40},'sourceFreeze':A.cache+'/e1v1-r4-source-freeze.json'}
    json.dump(record,open(out+'/r4-'+mode+'-actual.json','w'),indent=2)
    print('E1 r4 render complete',mode,'seconds',record['seconds'],flush=True)
    return g
