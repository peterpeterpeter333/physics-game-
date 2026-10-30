"""Actual B-1 geometry widths, separate from unchanged image-gradient proxy."""
import json,time,hashlib
c='/private/tmp/ys/ys-chain-b1v1';ns=nsB1r6;g=ns['main'].__globals__
revision=globals().get('B1_BOUND_REV','r7')
assert revision in ('r7','r8')
g['bpy'].context.window.scene=g['d'].SC
rows=[]
times=[82,94.5,126.8,135.6,142,185.9,196.6,235.4,272.4,294.4,298.2,340.8,354]
times+=[q['start']+(q['end']-q['start'])*f for q in g['CUES'] for f in [.03,.2,.4,.6,.8,.97]]
for t in sorted(set(times)):
    g['apply'](t);g['bpy'].context.view_layer.update();q=g['cue_at'](t);pts=g['hero_points'](q['camera'])
    p=[g['d'].project(v) for v in pts]
    rows.append({'time':t,'row':q['row'],'camera':q['camera'],'cameraMoving':bool(q['move'] and t<q['start']+q['move']),'pose':list(g['pose_at'](t)),'widthRatio':(max(v[0] for v in p)-min(v[0] for v in p))/1080,'bbox':[min(v[0] for v in p),min(v[1] for v in p),max(v[0] for v in p),max(v[1] for v in p)]})
json.dump({'scope':'300 cue states plus13 actual object projection widths, not a waiver or replacement of original7b','sourceSha256':hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest(),'rows':rows,'outside40to70':[r for r in rows if r['widthRatio']<.4 or r['widthRatio']>.7],'outsideAfterCameraSettles':[r for r in rows if not r['cameraMoving'] and (r['widthRatio']<.4 or r['widthRatio']>.7)],'created':time.strftime('%Y-%m-%d %H:%M:%S')},open(c+'/blender/b1-actual-width-'+revision+'.json','w'),indent=1)
print('B1 actual real geometry widths saved; original7b remains separate',flush=True)
