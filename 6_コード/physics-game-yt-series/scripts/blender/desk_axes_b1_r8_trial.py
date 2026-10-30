"""B-1 actual two-bar/rooster width correction, not texture-based gate tuning."""
import json,time,hashlib,os,ast
c='/private/tmp/ys/ys-chain-b1v1';ns=nsB1r6;g=ns['main'].__globals__
ns['bpy'].context.window.scene=ns['d'].SC
tree=ast.parse(open(g['__file__']).read())
nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ['hero_points','globe_state']]
assert len(nodes)==2
exec(compile(ast.Module(body=nodes,type_ignores=[]),g['__file__'],'exec'),g)
g['DATA']['poses']['star'][2]-=.035
# Update the exact-hold planner as well as live preview states.
g['SPANS'][:]=[(234.4,235.5) if a==235 and b==235.5 else (a,b) for a,b in g['SPANS']]
g['EVENTS']=sorted(set([q['start'] for q in g['CUES']]+[w['time'] for q in g['CUES'] for w in q['wordEvents']]+[b for a,b in g['SPANS']]))
measures={}
for name,t in [('pair',83.1),('vane',107.5),('magnet',65),('globeCompass',294.4),('star',24)]:
    g['apply'](t);ns['bpy'].context.view_layer.update();pts=g['hero_points'](name);p=g['DATA']['poses'][name]
    if name in ['vane','magnet','globeCompass']:p[:3]=[(min(v[a] for v in pts)+max(v[a] for v in pts))/2 for a in range(3)]
    for _ in range(8):
        g['pose_b1'](p);ns['bpy'].context.view_layer.update();screen=[g['d'].project(v) for v in pts]
        span=(max(v[0] for v in screen)-min(v[0] for v in screen))/1080;p[3]*=span/.66
    measures[name]={'pose':list(p),'width':span,'representative':t}
times=sorted(set(round(t*30)/30 for t in [20.1,24,63,68.7,75,77.5,82,83.1,94.5,97.7,98.3,107.5,113,115.3,234.4,235.3,294.4,298.2]))
a=ns['A'];a.times=','.join(map(str,times));a.out=c+'/blender/preview-r8';a.force=False;a.start=0;a.stop=1e9;a.every=1;a.scale=1;a.samples=16
ns['main']()
json.dump({'times':times},open(c+'/blender/preview-times-b1v1-r8.json','w'),indent=1)
json.dump({'revision':'r8','sourceSha256':hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest(),'times':times,'measured':measures,'fixes':['two-bar union fitted from the widest initial separation','rooster/compass union fitted before the vane turn','iron nails included in the garlic experiment framing','whole open compass box included with the globe','needle clear of captions and star clear of its label','known third prediction appears inside the existing silent pause, and curve completes before the scene changes'],'scope':'18 real correction images, original7b unchanged'},open(c+'/blender/b1-r8-trial-record.json','w'),indent=1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'B1 r8 actual-width trial DONE',flush=True)
