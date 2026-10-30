"""One final physical focus correction: actual ledger surface, same r8 camera."""
import ast,os,json,time,hashlib
def trial(ns):
    g=ns['main'].__globals__;g['bpy'].context.window.scene=g['d'].SC;source=os.path.abspath(g['__file__'])
    tree=ast.parse(open(source).read(),filename=source);fn=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='set_camera')
    exec(compile(ast.Module(body=[fn],type_ignores=[]),source,'exec'),g);ns['set_camera']=g['set_camera']
    for p in g['SOURCE_SHA']:g['SOURCE_SHA'][p]=hashlib.sha256(open(p,'rb').read()).hexdigest()
    a=g['A'];old=(a.times,a.out,a.force);out=os.path.join(a.cache,'blender','trial-r9');a.out=out;a.force=True;times=[0,1,2,358,359,360];a.times=','.join(map(str,times));started=time.time()
    g['main']();assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in g['SOURCE_SHA'].items())
    record={'revision':'r9','seconds':time.time()-started,'times':times,'sourceSha256':g['SOURCE_SHA'],'sameBookendPose':g['DATA']['cameras']['desk'],'endPaperCount':6,'width':1080,'height':1920,'samples':a.samples}
    json.dump(record,open(os.path.join(out,'meta.json'),'w'),ensure_ascii=False,indent=1);a.times,a.out,a.force=old
    print('[c1 r9] actual ledger focus, six bookend frames DONE',flush=True);return record
