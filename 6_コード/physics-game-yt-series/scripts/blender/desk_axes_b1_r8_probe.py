"""B-1 all-range current evidence, render only genuinely changed images.

Unchanged r7 images are linked read-only and checked byte-for-byte afterwards.
The new private main filters existing times before calling shared render code.
"""
import os,json,time,hashlib
c='/private/tmp/ys/ys-chain-b1v1';ns=nsB1r6;g=ns['main'].__globals__;g['bpy'].context.window.scene=g['d'].SC
assert 'explicit_scene_bpy' in open(g['__file__']).read()
old=json.load(open(c+'/blender/b1-r7-probe-complete.json'));trial=json.load(open(c+'/blender/preview-times-b1v1-r8.json'))
times=sorted(set(round(t*30)/30 for t in old['times']+trial['times']))
out=c+'/blender/probe1s-b1v1-r8';os.makedirs(out,exist_ok=True);linked={}
def changed(t):
    q=g['cue_at'](t);i=g['CUES'].index(q);names={'star','magnet','pair','vane','globeCompass'}
    return q['camera'] in names or (i and g['CUES'][i-1]['camera'] in names and q['move'] and t<q['start']+q['move']+1/30) or 234.4<=t<=235.68
for t in times:
    name='%05d.jpg'%round(t*30);src=old['raw']+'/'+name;dst=out+'/'+name
    if not changed(t) and os.path.isfile(src):
        if os.path.lexists(dst):raise RuntimeError('Preserve prior B8 evidence '+dst)
        os.symlink(src,dst);linked[src]=hashlib.sha256(open(src,'rb').read()).hexdigest()
a=g['A'];a.out=out;a.times=','.join(map(str,times));a.force=False;a.samples=16;a.scale=1;a.start=0;a.stop=1e9;a.every=1
started=time.time();g['main']()
for src,sha in linked.items():assert hashlib.sha256(open(src,'rb').read()).hexdigest()==sha,'An unchanged prior image was modified'
assert all(os.path.isfile(out+'/%05d.jpg'%round(t*30)) for t in times)
json.dump({'times':times,'raw':out,'frames':len(times),'linkedExactUnchanged':len(linked),'newActualImages':len(times)-len(linked),'priorImagesUnmodified':True,'sourceSha256':hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest(),'actualCuesAndPoses':g['CUES'],'scope':'latest all-range preflight, NOT30fps movie','seconds':time.time()-started},open(c+'/blender/b1-r8-probe-complete.json','w'),indent=1)
print('B1 r8 complete actual range, exact prior images preserved',len(times),len(linked),flush=True)
