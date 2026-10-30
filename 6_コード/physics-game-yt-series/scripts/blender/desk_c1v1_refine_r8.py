"""C1 r8 critical bookend composition: same physical six-sheet pile, M1 behind.

Eight real frames first; never start the full probe or render automatically.
"""
import ast,os,json,time,hashlib
def trial(ns):
    g=ns['main'].__globals__;g['bpy'].context.window.scene=g['d'].SC;source=os.path.abspath(g['__file__'])
    data=json.load(open(os.path.join(g['A'].cache,'blender','data.json')))
    for key in ['duration','numbers','events','effects','previews','extraPreviews']:assert data[key]==g['DATA'][key],key
    for old,new in zip(g['CUES'],data['cues']):
        assert {k:v for k,v in old.items() if k!='pose'}=={k:v for k,v in new.items() if k!='pose'}
        if old['camera'] not in ['desk','pascal']:assert old['pose']==new['pose']
    g['DATA']=data;g['CUES']=data['cues'];g['CUE']={c['key']:c for c in g['CUES']};g['KEYS']=g['cam_keys']()
    tree=ast.parse(open(source).read(),filename=source);fn=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='set_camera')
    exec(compile(ast.Module(body=[fn],type_ignores=[]),source,'exec'),g)
    for name in ['DATA','CUES','CUE','KEYS','set_camera']:ns[name]=g[name]
    for p in g['SOURCE_SHA']:g['SOURCE_SHA'][p]=hashlib.sha256(open(p,'rb').read()).hexdigest()
    a=g['A'];old=(a.times,a.out,a.force);out=os.path.join(a.cache,'blender','trial-r8');a.out=out;a.force=True
    times=[0,1,2,358,359,360,37.63133333333333,41.0];a.times=','.join(map(str,times));started=time.time()
    for c in g['CUES']:
        for f in [.03,.2,.4,.6,.8,.97]:g['apply'](c['start']+(c['end']-c['start'])*f)
    g['main']();assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in g['SOURCE_SHA'].items())
    record={'revision':'r8','seconds':time.time()-started,'stateChecks':318,'times':times,'sourceSha256':g['SOURCE_SHA'],'sameBookendPose':data['cameras']['desk'],'endPaperCount':6,'width':1080,'height':1920,'samples':a.samples}
    json.dump(record,open(os.path.join(out,'meta.json'),'w'),ensure_ascii=False,indent=1);a.times,a.out,a.force=old
    print('[c1 r8] 318 states + eight critical real frames DONE; no full probe yet',flush=True);return record
