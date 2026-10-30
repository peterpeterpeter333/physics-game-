"""GUI queue entry, after r7 trial approval: every second, cue end and move middle."""
import os,json,time,runpy
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';OUT='/private/tmp/ys/ys-chain-d1v1-render/blender/probe1s-d1v1-r7'
if os.path.exists(OUT):raise RuntimeError('Existing D1 r7 probes preserved; do not execute twice')
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r7 all-range probe START',flush=True)
print(json.dumps(runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r7.py')['install'](nsD1)),flush=True)
g=nsD1['main'].__globals__;times=sorted(set([float(i) for i in range(406)]+[round((c['end']-.06)*30)/30 for c in g['CUES']]+[round(t*30)/30 for t in g['DATA']['landmarks']]+[round((a+b)/2*30)/30 for a,b in json.load(open(g['A'].cache+'/blender/camera-motion.json'))['moving_spans']]+[18,20,34,169.8,171.8,172.3,400,403.3]))
A=g['A'];A.times=','.join(map(str,times));A.out=OUT;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16
g['bpy'].context.window.scene=g['d'].SC;g['main']()
json.dump({'times':times,'integerSeconds':406,'cueEnds':len(g['CUES']),'revision':'r7','sourceSha256':runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r7.py')['EXPECTED_SOURCE']},open(OUT+'/probe-coverage-d1v1-r7.json','w'),indent=1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r7 all-range probe DONE',flush=True)
