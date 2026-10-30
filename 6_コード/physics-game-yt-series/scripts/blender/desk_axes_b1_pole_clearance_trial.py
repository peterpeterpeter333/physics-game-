"""Three reversible compositions: keep the real red pole clear of fixed captions."""
import json,time,os
c='/private/tmp/ys/ys-chain-b1v1';ns=nsB1r5;g=ns['main'].__globals__;a=ns['A']
ns['bpy'].context.window.scene=ns['d'].SC
old={name:list(g['DATA']['poses'][name]) for name in ['powder','challenge']}
out=c+'/blender/pole-clearance-trial-b1v1-r6'
if os.path.exists(out):raise RuntimeError('Preserve earlier pole-clearance trial')
try:
 for name in old:g['DATA']['poses'][name][2]-=.020
 a.times='168,185.9,340.8';a.out=out;a.force=False;a.start=0;a.stop=1e9;a.every=1;a.scale=1;a.samples=16
 ns['main']()
 proof={}
 for t in [168,185.9,340.8]:
  aa=g['apply'](t);ns['bpy'].context.view_layer.update()
  pts={n:ns['d'].project(aa[n]) for n in ['poleS','poleN','challengeNeedle']}
  proof[str(t)]={'pose':g['pose_at'](t),'anchors':pts}
  assert pts['poleN'][1]<1160,'Red pole must stay above the fixed caption band'
 json.dump(proof,open(c+'/blender/pole-clearance-trial-b1v1-r6.json','w'),indent=1)
finally:
 for name,p in old.items():g['DATA']['poses'][name][:]=p
print(time.strftime('%Y-%m-%d %H:%M:%S'),'B1 red-pole clearance trial DONE',flush=True)
