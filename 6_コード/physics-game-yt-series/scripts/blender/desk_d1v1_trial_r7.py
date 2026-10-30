"""GUI queue entry: eight D1 r7 framing and mechanical-clearance frames."""
import os,runpy,time,json
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';OUT='/private/tmp/ys/ys-chain-d1v1-render/blender/landmarks-d1v1-r7'
if os.path.exists(OUT):raise RuntimeError('Existing D1 r7 trial preserved')
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r7 eight trial START',flush=True)
print(json.dumps(runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r7.py')['install'](nsD1)),flush=True)
A=nsD1['A'];A.times='18,20,34,169.8,171.8,172.3,400,403.3';A.out=OUT;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16
nsD1['bpy'].context.window.scene=nsD1['d'].SC;nsD1['main']()
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r7 eight trial DONE',flush=True)
