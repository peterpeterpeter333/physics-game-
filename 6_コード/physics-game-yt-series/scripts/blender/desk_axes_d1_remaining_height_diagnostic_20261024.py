"""Read-only numerical diagnosis; no rendering or function rebinding."""
import hashlib,json,time
from pathlib import Path
OUT=Path('/private/tmp/ys/ys-chain-d1v1-render/d1-straw-trace-height-diagnostic-20261024.json')
def diagnose(ns,authorized=False):
    assert authorized and not OUT.exists()
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy']
    source=Path(g['__file__']);source_sha=hashlib.sha256(source.read_bytes()).hexdigest()
    previous=bpy.context.window.scene;paths={s.name:s.render.filepath for s in bpy.data.scenes}
    bindings={k:g[k] for k in ('apply','apply_state','mine_state','engine_state','reset','plan_d1','main')}
    before={str(p):(p.stat().st_size,p.stat().st_mtime_ns) for folder in ['/private/tmp/ys/ys-chain-d1v1-render/blender/desk','/private/tmp/ys/ys-chain-d1v1-production-r15/blender/desk'] for p in Path(folder).glob('*.jpg')}
    rows=[]
    try:
        bpy.context.window.scene=d.SC
        for kind,key,word,offsets in [
            ('straw','straw:push','オシアゲテ',[-.3,0,.2,.6,1.1,2.]),
            ('trace','eng:arm','タンコオノソコ',[-.3,0,.2,.6,1.1,2.])]:
            event=g['T'](key,word)
            for offset in offsets:
                t=event+offset;g['apply'](t);bpy.context.view_layer.update()
                if kind=='straw':
                    obj=g['P']['straw']['juice'];height=.01+.10*g['U'](t,event,1);center=.02+height/2
                else:
                    obj=g['P']['engine']['trace'];height=.001+.47*g['U'](t,event,1);center=.54-height/2
                actual_height=float(obj.dimensions.z);actual_center=float(obj.location.z)
                rows.append({'kind':kind,'time':t,'suppliedWordTime':event,'offset':offset,'object':obj.name,
                  'actualHeightAfterDepsgraphUpdate':actual_height,'requestedHeight':height,
                  'actualCenterAfterDepsgraphUpdate':actual_center,'requestedFixedBottomOrTopCenter':center,
                  'heightError':actual_height-height,'centerError':actual_center-center,
                  'centerMatchesWithin1eMinus5':abs(actual_center-center)<=1e-5,'hiddenInThisState':bool(obj.hide_render)})
        assert all(g[k] is value for k,value in bindings.items())
        assert hashlib.sha256(source.read_bytes()).hexdigest()==source_sha
        assert all((Path(p).stat().st_size,Path(p).stat().st_mtime_ns)==st for p,st in before.items())
        assert all(bpy.data.scenes[name].render.filepath==p for name,p in paths.items())
        result={'date':time.strftime('%Y-%m-%d %H:%M:%S'),'source':str(source),'sourceSha256':source_sha,
          'rows':rows,'allCentersMatch':all(r['centerMatchesWithin1eMinus5'] for r in rows),
          'renders':0,'filesOrFunctionsModified':False,'oldRawFilesChecked':len(before),'finalVideoAcceptance':False}
        with OUT.open('x')as f:json.dump(result,f,ensure_ascii=False,indent=1)
        print('D1 HEIGHT DIAGNOSIS '+str(OUT)+' allCentersMatch='+str(result['allCentersMatch']),flush=True)
        return result
    finally:bpy.context.window.scene=previous
