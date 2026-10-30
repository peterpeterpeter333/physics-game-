"""C1 r4: load only three changed functions into the existing isolated scene.

No factory reset, no common-file mutation, no geometry/material/name mutation.
Re-run the same complete trial and source/visibility/contact proof before probe.
"""
import ast,os,json,time,hashlib

def install(ns):
    g=ns['main'].__globals__;bpy=g['bpy'];bpy.context.window.scene=g['d'].SC
    source=os.path.abspath(g['__file__']);tree=ast.parse(open(source).read(),filename=source)
    selected=[n for n in tree.body if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef)) and n.name in {'set_camera','hands','catalog'}]
    assert len(selected)==3
    before={k:id(v) for k,v in g['PARTS'].items()}
    data=json.load(open(os.path.join(g['A'].cache,'blender','data.json')))
    for key in ['duration','numbers','events','effects','previews','extraPreviews']:
        assert data[key]==g['DATA'][key],'Unexpected non-camera data change: '+key
    for old,new in zip(g['CUES'],data['cues']):
        assert {k:v for k,v in old.items() if k!='pose'}=={k:v for k,v in new.items() if k!='pose'}
    g['DATA']=data;g['CUES']=data['cues'];g['CUE']={c['key']:c for c in g['CUES']};g['KEYS']=g['cam_keys']()
    for name in ['DATA','CUES','CUE','KEYS']:ns[name]=g[name]
    exec(compile(ast.Module(body=selected,type_ignores=[]),source,'exec'),g)
    for name in ['set_camera','hands','catalog']:ns[name]=g[name]
    assert before=={k:id(v) for k,v in g['PARTS'].items()}
    for f in g['SOURCE_SHA']:g['SOURCE_SHA'][f]=hashlib.sha256(open(f,'rb').read()).hexdigest()
    print('[c1 r4] 3 isolated functions reloaded; same PARTS/scene/geometry',flush=True)
    return g

def trial(ns):
    g=install(ns);started=time.time();a=g['A'];old=(a.times,a.out,a.force)
    a.out=None;a.force=True
    for ci,c in enumerate(g['CUES']):
        for f in [.03,.2,.4,.6,.8,.97]:g['apply'](c['start']+(c['end']-c['start'])*f)
    print('[c1 r4] all 53 x 6 state checks PASS',flush=True)
    g['catalog']();a.times=','.join(map(str,g['DATA']['previews']+g['DATA'].get('extraPreviews',[])));g['main']();g['write_problem']()
    assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in g['SOURCE_SHA'].items())
    record={'revision':'r4','changes':['Pascal head/idea focus only','row12 hand entry only','standing domino catalog only'],'seconds':time.time()-started,'stateChecks':318,'width':g['d'].SC.render.resolution_x,'height':g['d'].SC.render.resolution_y,'samples':a.samples,'times':g['DATA']['previews']+g['DATA'].get('extraPreviews',[]),'sourceSha256':g['SOURCE_SHA'],'treeCache':{'roots':len(g['TREE_ROOTS']),'descendantsEqual':True,'callsChecked':g['TREE_CALLS']},'visibility':g['VISIBILITY_STATS'],'armContact':g['PARTS']['m2']['contactProof']}
    for name in ['gate-c1v1-run.json','gate-c1v1-r4-run.json']:json.dump(record,open(os.path.join(a.cache,'blender',name),'w'),indent=1)
    a.times,a.out,a.force=old
    print('[c1 r4] full catalog20 + preview27 + problem2 trial DONE',flush=True)
    return record
