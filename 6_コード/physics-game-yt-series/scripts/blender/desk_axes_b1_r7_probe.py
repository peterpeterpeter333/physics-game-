"""B-1: all integer seconds and all cue ends after the real 10-frame review."""
import json,time,hashlib
c='/private/tmp/ys/ys-chain-b1v1';ns=nsB1r6;g=ns['main'].__globals__
ns['bpy'].context.window.scene=ns['d'].SC
times=list(range(357))+[round((q['end']-1/30)*30)/30 for q in g['CUES']]
times+=g['DATA']['preview']
times=sorted(set(round(t*30)/30 for t in times if 0<=t<g['DATA']['duration']))
a=ns['A'];a.times=','.join(map(str,times));a.out=c+'/blender/probe1s-b1v1-r7'
a.force=False;a.start=0;a.stop=1e9;a.every=1;a.scale=1;a.samples=16
ns['main']()
json.dump({'times':times,'integerSeconds':357,'allCueEnds':50,'raw':a.out,'sourceSha256':hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest(),'scope':'actual full range preflight, not a completed 30fps film'},open(c+'/blender/b1-r7-probe-complete.json','w'),indent=1)
ns['catalog'](names={'terrella','powder','predictions'},out_dir=c+'/blender/catalog-affected-r7')
ns['write_problem']()
print(time.strftime('%Y-%m-%d %H:%M:%S'),'B1 r7 all-range probe DONE',flush=True)
