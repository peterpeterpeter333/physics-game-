"""B-1 full-resolution, every-second inspection after the 46-frame visual gate."""
import json,time,hashlib
print(time.strftime('%Y-%m-%d %H:%M:%S'),'B1 r5 every-second START',flush=True)
nsB1r5['bpy'].context.window.scene=nsB1r5['d'].SC
_axes_guard(nsB1r5)
c='/private/tmp/ys/ys-chain-b1v1';a=nsB1r5['A']
a.times=','.join(str(i) for i in range(357));a.out=c+'/blender/probe1s-b1v1-r5'
a.force=False;a.start=0;a.stop=1e9;a.every=1;a.scale=1;a.samples=16
nsB1r5['main']()
json.dump({'raw':a.out,'frames':357,'sourceSha256':hashlib.sha256(open(nsB1r5['main'].__globals__['__file__'],'rb').read()).hexdigest(),'finished':time.strftime('%Y-%m-%d %H:%M:%S')},open(c+'/blender/b1-r5-probe-complete.json','w'),indent=1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'B1 r5 every-second DONE',flush=True)
