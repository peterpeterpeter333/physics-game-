"""GUI queue entry: D1 r6 30 real-quality semantic/camera trial frames only."""
import os,runpy,time,json
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
OUT='/private/tmp/ys/ys-chain-d1v1-render/blender/landmarks-d1v1-r6'
if os.path.exists(OUT):raise RuntimeError('Existing D1 r6 trial preserved; do not execute twice')
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r6 30 trial START',flush=True)
print(json.dumps(runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r6.py')['install'](nsD1)),flush=True)
A=nsD1['A'];A.times='4,18,20,24.5,34,45.6,47.2,51.2,54.8,63,84.3,118.8,126.17,140.5,165,169.8,172.3,175.5,179,194,221.5,225.5,229,263.9,279.5,283,311.7,321,400,403.3';A.out=OUT;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16
nsD1['bpy'].context.window.scene=nsD1['d'].SC;nsD1['main']()
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r6 30 trial DONE',flush=True)
