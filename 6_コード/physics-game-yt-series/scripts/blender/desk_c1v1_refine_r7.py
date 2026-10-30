"""C1 coherent r7: main-subject focus, physical pen grip, restored bookend.

Only C1-owned functions/data and C1 scene objects. Supplied words/times frozen.
"""
import ast,os,json,time,hashlib

def install(ns):
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];bpy.context.window.scene=d.SC
    source=os.path.abspath(g['__file__']);tree=ast.parse(open(source).read(),filename=source)
    names={'set_camera','hands','papers_state','quill_state','catalog','private_catalog_stage'}
    selected=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in names];assert len(selected)==len(names)
    before={k:id(v) for k,v in g['PARTS'].items()};data=json.load(open(os.path.join(g['A'].cache,'blender','data.json')))
    for key in ['duration','numbers','events','effects','previews','extraPreviews']:assert data[key]==g['DATA'][key],key
    assert len(data['cues'])==len(g['CUES'])==53
    for old,new in zip(g['CUES'],data['cues']):assert {k:v for k,v in old.items() if k!='pose'}=={k:v for k,v in new.items() if k!='pose'}
    g['DATA']=data;g['CUES']=data['cues'];g['CUE']={c['key']:c for c in g['CUES']};g['KEYS']=g['cam_keys']()
    if 'stroke' not in g['PARTS']['papers']:
        extpath=os.path.join(os.path.dirname(source),'desk_lib_c1.py');exttree=ast.parse(open(extpath).read(),filename=extpath)
        fn=next(n for n in exttree.body if isinstance(n,ast.FunctionDef) and n.name=='writing_stroke')
        scope={'bpy':bpy,'d':d};exec(compile(ast.Module(body=[fn],type_ignores=[]),extpath,'exec'),scope)
        stroke=scope['writing_stroke']();g['PARTS']['papers']['stroke']=stroke;g['GROUPS']['papers'].append(stroke);g['MANAGED'].append(stroke)
        g['SCENE_OBJECTS'].append(stroke)
    labels=[o for o in g['tree_nodes'](d.board_h) if o.type=='FONT' and o.data.body in ['人の手','機械']]
    assert len(labels)==2
    for o in labels:o.data.size=.034
    exec(compile(ast.Module(body=selected,type_ignores=[]),source,'exec'),g)
    d.catalog_stage=g['private_catalog_stage']
    for name in names|{'DATA','CUES','CUE','KEYS'}:ns[name]=g[name]
    assert before=={k:id(v) for k,v in g['PARTS'].items()}
    for f in g['SOURCE_SHA']:g['SOURCE_SHA'][f]=hashlib.sha256(open(f,'rb').read()).hexdigest()
    print('[c1 r7] six C1 functions and one pen ink curve installed; immutable values equal',flush=True)
    return g

def trial(ns):
    g=install(ns);started=time.time();a=g['A'];old=(a.times,a.out,a.force);a.out=None;a.force=True
    for c in g['CUES']:
        for f in [.03,.2,.4,.6,.8,.97]:g['apply'](c['start']+(c['end']-c['start'])*f)
    print('[c1 r7] 318 states PASS',flush=True)
    g['catalog']();times=list(dict.fromkeys(g['DATA']['previews']+g['DATA'].get('extraPreviews',[])+[0,1,2,358,359,360,214,215,216,331,332,333]))
    a.times=','.join(map(str,times));g['main']();g['write_problem']()
    assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in g['SOURCE_SHA'].items())
    record={'revision':'r7','seconds':time.time()-started,'stateChecks':318,'width':d.SC.render.resolution_x if (d:=g['d']) else 0,'height':d.SC.render.resolution_y,'samples':a.samples,'times':times,'sourceSha256':g['SOURCE_SHA'],'treeCache':{'roots':len(g['TREE_ROOTS']),'descendantsEqual':True,'callsChecked':g['TREE_CALLS']},'visibility':g['VISIBILITY_STATS'],'armContact':g['PARTS']['m2']['contactProof']}
    for name in ['gate-c1v1-run.json','gate-c1v1-r7-run.json']:json.dump(record,open(os.path.join(a.cache,'blender',name),'w'),indent=1)
    a.times,a.out,a.force=old;print('[c1 r7] catalog20 + preview%d + problem2 DONE'%len(times),flush=True);return record

def probe(ns):
    g=ns['main'].__globals__;a=g['A'];old=(a.times,a.out,a.force)
    a.out=os.path.join(a.cache,'blender','probe1s-r7');a.times=','.join(map(str,range(361)));a.force=True
    g['main']();a.times,a.out,a.force=old;print('[c1 r7] 361 full-resolution one-second probe DONE',flush=True)
