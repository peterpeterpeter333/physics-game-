"""Fresh actual trial after all held physical constraints, no original-gate waiver."""
import hashlib,json,os,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render';OUT=C+'/blender/landmarks-d1v1-r12';SHA='44f10e1ce023e0d2b64872f82b342592892a33d0d100020787c64d11266a0892'
if os.path.exists(OUT):raise RuntimeError('Existing D1 r12 actual trial preserved')
g=nsD1['main'].__globals__;assert hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest()==SHA
report=json.load(open(C+'/d1-semantic-physical-r12.json'));assert report['sourceSha256']==SHA
held=[r for r in report['rows'] if not r['cameraTransition']];assert held and all(r['pass'] for r in held),'D1 held-state physical failures must be resolved before trial'
times=sorted(set(g['DATA']['landmarks']+[0,2,20,28.421333,33.2,33.45,33.7,34.216667,34.758333,35.24,36.94,41.922,43.872667,54.8,98.1,100.7,104.5,115.5,134.462667,143.949333,165,169.8,171.632667,172.3,175.5,178.382667,180.982667,187.558,205.068,208.086,234.223333,243,247,312.465667,316.925333,319.52,320.554,327,333.2,339.7,390,403.3]))
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r12 actual trial START',len(times),'frames',flush=True)
A=g['A'];A.times=','.join(map(str,times));A.out=OUT;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16
g['bpy'].context.window.scene=g['d'].SC;g['main']()
files=[str(round(t*30)).zfill(5)+'.jpg' for t in times];assert all(os.path.isfile(OUT+'/'+f) and os.path.getsize(OUT+'/'+f)>1000 for f in files),'D1 explicit-scene trial did not create all requested JPGs'
json.dump({'episode':'D-1','revision':'r12','sourceSha256':SHA,'times':times,'files':files,'expectedFrames':len(times),'scene':g['d'].SC.name,'status':'real trial only; all moving-state bounds failures preserved for visual review; original strict gates and all-range review pending'},open(OUT+'/trial-coverage-d1v1-r12.json','w'),indent=1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r12 actual trial DONE',flush=True)
