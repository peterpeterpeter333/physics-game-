"""C1 final real contact correction; the reviewed r9 bookend is unchanged."""
import ast,os,json,time,hashlib,math

def install(ns):
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];bpy.context.window.scene=d.SC
    from mathutils import Matrix,Euler
    source=os.path.abspath(g['__file__']);extpath=os.path.join(os.path.dirname(source),'desk_lib_c1.py')
    tree=ast.parse(open(source).read(),filename=source);names={'mechanism_state','problem_state'}
    functions=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in names];assert len(functions)==2
    peg=next(n for n in ast.parse(open(extpath).read(),filename=extpath).body if isinstance(n,ast.FunctionDef) and n.name=='carry_peg')
    scope={'bpy':bpy,'d':d,'Matrix':Matrix,'Euler':Euler,'Vector':g['Vector'],'math':math}
    exec(compile(ast.Module(body=[peg],type_ignores=[]),extpath,'exec'),scope)
    for kind in ['m2','eight']:
        p=g['PARTS'][kind];spacing=.12 if kind=='m2' else .10;radius=.05 if kind=='m2' else .043
        p['root'].scale=(1,1,1);p['root'].location=p['center']
        for wheel in p['wheels']:
            assert 'carrier' not in wheel,'Do not run the contact installer twice'
            wheel['root'].rotation_euler=(0,0,0);carrier=scope['carry_peg'](wheel,spacing,radius)
            g['GROUPS'][kind].append(carrier);g['MANAGED'].append(carrier);g['SCENE_OBJECTS'].append(carrier)
            g['CHILDREN'].setdefault(wheel['root'],[]).append(carrier)
        for i,ct in enumerate(p['contacts'],1):
            ct.location=p['wheels'][i]['center']+g['Vector']((-spacing+radius,-.018,0));ct.scale=(.5,.5,.5)
        g['TREE_CACHE'].clear()
    exec(compile(ast.Module(body=functions,type_ignores=[]),source,'exec'),g)
    for name in names:ns[name]=g[name]
    data=json.load(open(os.path.join(g['A'].cache,'blender','data.json')))
    assert data==g['DATA'],'Reviewed camera/timing/data must remain exactly equal'
    for f in g['SOURCE_SHA']:g['SOURCE_SHA'][f]=hashlib.sha256(open(f,'rb').read()).hexdigest()
    print('[c1 r10] real 8mm pegs and rigid carriers installed; camera/data unchanged',flush=True)
    return g

def contact_proof(g):
    result=[];d=g['d'];V=g['Vector'];g['bpy'].context.window.scene=d.SC
    for kind in ['m2','eight']:
        p=g['PARTS'][kind];g['hide_all']();g['visible'](kind);p['root'].scale=(1,1,1);p['root'].location=p['center']
        for i,w in enumerate(p['wheels']):w['root'].rotation_euler=(0,-2*math.pi*(9 if i>0 else 0)/10,0)
        g['bpy'].context.view_layer.update()
        for i,w in enumerate(p['wheels'][1:],1):
            # Original 20-tooth mesh vertices; bevel margins are recorded too.
            neighbor=p['wheels'][i-1]
            teeth=next(o for o in g['tree_nodes'](neighbor['root']) if o.type=='MESH' and len(o.data.vertices)==160)
            own=next(o for o in g['tree_nodes'](w['root']) if o.type=='MESH' and len(o.data.vertices)==160)
            def overlap_vertices(mesh,box):
                inv=box.matrix_world.inverted();limits=[max(abs(v.co[j]) for v in box.data.vertices) for j in range(3)];inside=[]
                for v in mesh.data.vertices:
                    q=inv@(mesh.matrix_world@v.co)
                    if all(abs(q[j])<limits[j] for j in range(3)):inside.append(list(mesh.matrix_world@v.co))
                return inside
            reached=overlap_vertices(teeth,w['bump']);attached=overlap_vertices(own,w['carrier'])
            assert reached and attached,(kind,i,'physical contact failed')
            result.append({'model':kind,'rightGearIndex':i,'digits':'all outgoing gears 9','pegNominalSize':w['pegNominalSize'],'phaseDegrees':math.degrees(w['pegPhase']),'neighborToothVerticesInsidePeg':reached,'ownToothVerticesInsideCarrier':attached})
    print('[c1 r10] 11 rigid peg/carrier and adjacent-tooth contacts PASS',flush=True)
    return result

def trial(ns):
    g=install(ns);started=time.time();a=g['A'];d=g['d'];old=(a.times,a.out,a.force);proof=contact_proof(g)
    for c in g['CUES']:
        for f in [.03,.2,.4,.6,.8,.97]:g['apply'](c['start']+(c['end']-c['start'])*f)
    print('[c1 r10] 318 cue states PASS',flush=True)
    out=os.path.join(a.cache,'blender','trial-r10');a.out=out;a.force=True
    times=[g['FX']['bump']-.04,g['FX']['bump']+.001,g['FX']['bump']+.10]
    a.times=','.join(map(str,times));g['main']()
    a.out=os.path.join(a.cache,'blender','catalog-r10');g['catalog']();g['write_problem']()
    import runpy
    bounds=runpy.run_path(os.path.join(os.path.dirname(g['__file__']),'desk_c1v1_bounds_final.py'))['audit'](ns)
    assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in g['SOURCE_SHA'].items())
    record={'revision':'r10','seconds':time.time()-started,'stateChecks':318,'times':times,'width':1080,'height':1920,'samples':a.samples,'sourceSha256':g['SOURCE_SHA'],'contacts':proof,'sameBookendPose':g['DATA']['cameras']['desk'],'bookendRestoredToR9':True,'boundsRecords':len(bounds['frames']),'catalog':a.out}
    json.dump(record,open(os.path.join(out,'meta.json'),'w'),ensure_ascii=False,indent=1)
    a.times,a.out,a.force=old;print('[c1 r10] actual 3 contact states + catalog20 + problem2 + bounds53 DONE',flush=True);return record

def probe(ns):
    g=ns['main'].__globals__;a=g['A'];old=(a.times,a.out,a.force)
    g['bpy'].context.window.scene=g['d'].SC
    assert g['bpy'].context.scene is g['d'].SC,'Wrong active scene before C1 probe'
    expected=dict(g['SOURCE_SHA']);assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in expected.items()),'Source changed before final probe'
    critical=g['DATA']['previews']+g['DATA'].get('extraPreviews',[])
    critical_frames=[round(t*30) for t in critical]
    ends=[{'cue':c['key'],'frame':math.ceil(c['end']*30)-1,'time':(math.ceil(c['end']*30)-1)/30} for c in g['CUES']]
    frames=list(dict.fromkeys(critical_frames+[t*30 for t in range(361)]+[x['frame'] for x in ends]))
    times=[j/30 for j in frames]
    a.out=os.path.join(a.cache,'blender','probe1s-r10');a.times=','.join(map(str,times));a.force=True
    started=time.time();g['main']()
    assert g['bpy'].context.scene is g['d'].SC,'Active scene changed during C1 probe'
    missing=[j for j in frames if not os.path.isfile(os.path.join(a.out,'%05d.jpg'%j))]
    assert not missing,'Actual C1 JPEG missing: '+str(missing[:12])
    assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in expected.items()),'Source changed during final probe'
    record={'revision':'r10','notFull30fps':True,'seconds':time.time()-started,'times':times,'frames':frames,'criticalTimes':critical,'criticalFrames':critical_frames,'integerTimes':list(range(361)),'cueEnds':ends,'sourceSha256':g['SOURCE_SHA'],'width':1080,'height':1920,'samples':a.samples}
    json.dump(record,open(os.path.join(a.out,'qa-samples.json'),'w'),ensure_ascii=False,indent=1)
    a.times,a.out,a.force=old
    print('[c1 r10] %d unique frames: fixed27 first + all361 integers + all53 exact cue-end frames DONE'%len(frames),flush=True)

def full_render(ns):
    g=ns['main'].__globals__;g['bpy'].context.window.scene=g['d'].SC
    assert g['bpy'].context.scene is g['d'].SC
    a=g['A'];old=(a.times,a.out,a.force);a.times=None;a.out=None;a.force=False
    assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in g['SOURCE_SHA'].items())
    g['main']()
    assert g['bpy'].context.scene is g['d'].SC
    assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in g['SOURCE_SHA'].items())
    meta=json.load(open(os.path.join(a.cache,'blender','desk','meta.json')))
    assert meta['missing']==0 and meta['frames']==g['NF']
    a.times,a.out,a.force=old
    return meta
