"""GUI after r8 trial approval: real every-second/cue-end/move probes + final catalog."""
import os,json,time,runpy
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render';OUT=C+'/blender/probe1s-d1v1-r8'
if os.path.exists(OUT):raise RuntimeError('Existing D1 r8 probes preserved')
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r8 all-range probe START',flush=True)
patch=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r8.py');print(json.dumps(patch['install'](nsD1)),flush=True)
g=nsD1['main'].__globals__;times=sorted(set([float(i) for i in range(406)]+[round((c['end']-.06)*30)/30 for c in g['CUES']]+[round(t*30)/30 for t in g['DATA']['landmarks']]+[round((a+b)/2*30)/30 for a,b in json.load(open(C+'/blender/camera-motion.json'))['moving_spans']]+[18,20,34,169.8,171.8,172.3,400,403.3]))
A=g['A'];A.times=','.join(map(str,times));A.out=OUT;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16
g['bpy'].context.window.scene=g['d'].SC;g['main']()
json.dump({'times':times,'integerSeconds':406,'cueEnds':len(g['CUES']),'revision':'r8','sourceSha256':patch['EXPECTED_SOURCE']},open(OUT+'/probe-coverage-d1v1-r8.json','w'),indent=1)
print(json.dumps(runpy.run_path(W+'/scripts/blender/desk_d1v1_catalog_r8.py')['finish'](nsD1)),flush=True)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r8 all-range probe DONE',flush=True)
