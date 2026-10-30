"""E1-only, no-reset GUI hotfix. Call run(prior_runpy_namespace, mode).

This module creates no model, removes no model, and does not run on import.
The functions bind into the *real* old function globals, not runpy's copy.
"""
import ast,json,math,os,time,hashlib
def run(ns,mode='keyframes',out='/private/tmp/ys/ys-chain-e1v1/blender/gate-e1v1-r3'):
    g=ns['apply'].__globals__;A=g['A'];d=g['d'];ext=g['ext']
    assert A.cache=='/private/tmp/ys/ys-chain-e1v1'
    source_path=g['__file__'];source=open(source_path).read()
    assert 'Homothety about the deck observation point' in source,'R3 source is not ready'
    freeze=json.load(open(A.cache+'/e1v1-r3-source-freeze.json'))
    assert hashlib.sha256(source.encode()).hexdigest()==freeze['files']['scripts/blender/desk_e1v1.py'],'E1 source changed after freeze'
    names={'use_pose','ship_state','challenge_setup','catalog'}
    nodes=[n for n in ast.parse(source,source_path).body if isinstance(n,ast.FunctionDef) and n.name in names]
    assert len(nodes)==len(names)
    exec(compile(ast.Module(body=nodes,type_ignores=[]),source_path,'exec'),g)
    libsource=open(ext.__file__).read();libnodes=[n for n in ast.parse(libsource,ext.__file__).body if isinstance(n,ast.FunctionDef) and n.name=='open_purse']
    assert len(libnodes)==1
    exec(compile(ast.Module(body=libnodes,type_ignores=[]),ext.__file__,'exec'),ext.__dict__)
    bags=[o for o in ext.descendants(g['PARTS']['prize']) if o.type=='MESH' and d.MATS['e1leather'] in list(o.data.materials)]
    assert len(bags)==1,bags;ext.open_purse(bags[0])
    # Brace the existing yards and cloth about each mast. The fresh factory
    # makes these same coordinates directly; old meshes are changed once.
    co=math.cos(math.radians(55));si=math.sin(math.radians(55));counts={'sails':0,'yards':0}
    for ship in g['PARTS']['fleet']+[g['PARTS']['ship']]:
        if ship.get('sails_braced'):continue
        for ob in ext.descendants(ship['root']):
            if ob.type=='MESH' and '_sail' in ob.name:
                mast=min(v.co.x for v in ob.data.vertices)
                for v in ob.data.vertices:
                    x=v.co.x-mast;y=v.co.y;v.co.x=mast+co*x-si*y;v.co.y=si*x+co*y
                ob.data.update();counts['sails']+=1
            elif ob.type=='CURVE' and '_yard' in ob.name:
                for spline in ob.data.splines:
                    mast=spline.points[0].co.x
                    for p in spline.points:
                        x=p.co.x-mast;y=p.co.y;p.co.x=mast+co*x-si*y;p.co.y=si*x+co*y
                counts['yards']+=1
        ship['sails_braced']=True
    # Refresh the measured geometry, so the motion report describes the actual
    # opened pouch and braced ship, not the former cached vertex positions.
    g['POINTS']['prize']=g['cloud']('prize');g['POINTS']['ship']=g['cloud']('ship')
    # Same homothety for the momentary vertical noon marker.
    line=g['ship_noon']
    for p,z in zip(line.data.splines[0].points,[.0985,.1765]):p.co=(.25,-.05,z,1)
    d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.eevee.taa_render_samples=16
    print('E1 r3 hotfix applied',counts,'mode',mode,flush=True)
    started=time.time();os.makedirs(out,exist_ok=True)
    if mode=='catalog':
        A.out=out+'/catalog';g['catalog']()
    elif mode=='problem':
        A.out=out+'/problem-raw';g['render_problem']()
    elif mode in ['keyframes','probe']:
        times=[1.5,31.5,38.5,49,55.2,81.8,103,104,107,114.5,131,156.8,162,181.5,182.8,190.7,199.5,209.96666666666667,233.8,249.8,260.5,284,292,300,318.8,337.2,341,350,362.7,366.3,385]
        if mode=='probe':times=freeze['preview']['times']
        times=sorted(set(round(t*30)/30 for t in times));A.times=','.join(map(str,times));A.out=out+'/frames';g['main']()
    else:raise ValueError('Unknown E1 r3 mode: '+mode)
    print('E1 r3 hotfix render complete',mode,'seconds',round(time.time()-started,2),flush=True)
    return g
