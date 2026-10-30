"""Retry only r8's final-camera projection; first failed report remains preserved."""
import os,runpy,time,json
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render';OUT=C+'/blender/landmarks-d1v1-r8'
if os.path.exists(OUT):raise RuntimeError('Existing D1 r8 trial preserved')
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r8 final-camera projection +3 trial START',flush=True)
patch=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r8.py');print(json.dumps(patch['install'](nsD1)),flush=True);patch['check_bounds'](nsD1,C+'/d1-r8-actual-bounds-retry.json')
A=nsD1['A'];A.times='169.8,172.3,403.3';A.out=OUT;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16
nsD1['bpy'].context.window.scene=nsD1['d'].SC;nsD1['main']()
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r8 final-camera projection +3 trial DONE',flush=True)
