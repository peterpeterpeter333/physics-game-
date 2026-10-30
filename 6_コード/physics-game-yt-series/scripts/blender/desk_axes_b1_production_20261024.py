"""Approved B-1 production, using the frozen scene and original shared main.

No supplied narration, captions, old images or protected sources are changed.
"""
import os,json,time,hashlib
c='/private/tmp/ys/ys-chain-b1v1'
g=nsB1r6['main'].__globals__
# Frozen source checksum, recorded by the actual final r8 trial.
frozen=json.load(open(c+'/blender/b1-r8-probe-complete.json'))
assert hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest()==frozen['sourceSha256']
out=c+'/blender/desk'
assert not os.path.exists(out),'Preserve any prior production directory'
a=g['A'];a.cache=c;a.out=out;a.times=None;a.force=False;a.samples=16;a.scale=1;a.start=0;a.stop=1e9;a.every=1
g['bpy'].context.window.scene=g['d'].SC
g['d'].SC.render.resolution_x=1080;g['d'].SC.render.resolution_y=1920
g['d'].SC.render.resolution_percentage=100
g['d'].SC.eevee.taa_render_samples=16
g['d'].SC.render.image_settings.file_format='JPEG'
plans=[g['plan'](j) for j in range(__import__('math').ceil(g['DATA']['duration']*30))]
status={'id':'ys-chain-b1v1','status':'running','started':time.time(),'frames':len(plans),'actualFrames':sum(p[0]=='render' for p in plans),'heldFrames':sum(p[0]=='dup' for p in plans),'sourceSha256':frozen['sourceSha256'],'out':out,'samples':16,'resolution':[1080,1920]}
with open(c+'/b1-production-20261024.json','w') as f:json.dump(status,f,indent=1)
print('B1 APPROVED PRODUCTION',status,flush=True)
g['main']()
missing=[j for j in range(len(plans)) if not os.path.isfile(out+'/%05d.jpg'%j)]
assert not missing,missing[:20]
anchors=json.load(open(out+'/anchors.json'))
assert all(len(v)==len(plans) for v in anchors['anchors'].values())
status.update(status='done',ended=time.time(),seconds=time.time()-status['started'],missing=0)
with open(c+'/b1-production-20261024.json','w') as f:json.dump(status,f,indent=1)
print('B1 PRODUCTION COMPLETE',status,flush=True)
