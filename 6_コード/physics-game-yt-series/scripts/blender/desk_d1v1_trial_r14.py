"""Final minimal focus/can-only actual trial; no full-range or production."""
import hashlib,json,os,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render';OUT=C+'/blender/landmarks-d1v1-r14';SHA='671596522217d9369f84b29061c3b8431eb89cfc6c558207295211f508a90687'
if os.path.exists(OUT):raise RuntimeError('Existing D1 r14 actual trial preserved')
g=nsD1['main'].__globals__;assert hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest()==SHA
report=json.load(open(C+'/d1-semantic-physical-r14.json'));assert report['sourceSha256']==SHA
held=[r for r in report['rows'] if not r['cameraTransition']];assert held and all(r['pass'] for r in held),'D1 held physical failures remain; preserve audit and do not render'
impact=g['T']('can:crush','グシャット');inv=g['T']('can:heat','サカサ');reveal=g['T']('air:who','マワリノ')
times=sorted(set([34.216667,35.24,118.8,inv+.5,inv+1.6,124.3,impact-1/30,impact+.075,126.17,reveal-1/30,reveal+.25,reveal+.55,134.462667,140.5,169.8]))
A=g['A'];A.times=','.join(map(str,times));A.out=OUT;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r14 actual trial START',len(times),'frames',flush=True)
g['bpy'].context.window.scene=g['d'].SC;g['main']()
files=[str(round(t*30)).zfill(5)+'.jpg' for t in times];assert all(os.path.isfile(OUT+'/'+f) and os.path.getsize(OUT+'/'+f)>1000 for f in files),'D1 explicit-scene trial missing JPEG'
json.dump({'episode':'D-1','revision':'r14','sourceSha256':SHA,'times':times,'files':files,'expectedFrames':len(times),'scene':g['d'].SC.name,'status':'minimal focus/can/pressure actual trial only; full-range current revision and original final gates pending','productionStarted':False,'strictInspectorWaiver':False},open(OUT+'/trial-coverage-d1v1-r14.json','w'),indent=1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r14 actual trial DONE',flush=True)
