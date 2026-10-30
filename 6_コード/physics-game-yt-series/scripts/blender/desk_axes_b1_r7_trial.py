"""B-1 final real-visibility fixes, reusing the already-built private scene."""
import ast,json,time,hashlib,os
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
c='/private/tmp/ys/ys-chain-b1v1';ns=nsB1r6;g=ns['main'].__globals__
ns['bpy'].context.window.scene=ns['d'].SC
source=open(W+'/scripts/blender/desk_b1v1.py').read();tree=ast.parse(source)
node=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='terrella_state')
exec(compile(ast.Module(body=[node],type_ignores=[]),g['__file__'],'exec'),g)
ns['terrella_state']=g['terrella_state']
poses=g['DATA']['poses'];poses['globeCompass'][4]=-35
poses['terrella'][2]=.105;poses['terrella'][4:6]=[65,25]
measures={}
for name,t in [('globeCompass',294.4),('terrella',142)]:
    g['apply'](t);ns['bpy'].context.view_layer.update();pts=g['hero_points'](name);p=poses[name]
    for _ in range(8):
        g['pose_b1'](p);ns['bpy'].context.view_layer.update()
        screen=[g['d'].project(v) for v in pts];span=(max(v[0] for v in screen)-min(v[0] for v in screen))/1080
        p[3]*=span/.66
    measures[name]={'pose':list(p),'width':span,'representative':t}
times=sorted(set(round(t*30)/30 for t in [126.8,135.4,135.6,136.2,136.4,137.23,137.6,142,294.4,298.2]))
a=ns['A'];a.times=','.join(map(str,times));a.out=c+'/blender/preview-r7'
a.force=False;a.start=0;a.stop=1e9;a.every=1;a.scale=1;a.samples=16
ns['main']()
json.dump({'times':times},open(c+'/blender/preview-times-b1v1-r7.json','w'),indent=1)
json.dump({'revision':'r7','sourceSha256':hashlib.sha256(source.encode()).hexdigest(),'times':times,'measured':measures,'scope':'10 real visibility checks, not a final movie gate'},open(c+'/blender/b1-r7-trial-record.json','w'),indent=1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'B1 r7 real-visibility trial DONE',flush=True)
