"""Small, full-resolution trials before another whole-film probe."""
import runpy,json,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
print('C1 reversible legibility calibration START',flush=True)
nsC1['bpy'].context.window.scene=nsC1['d'].SC
runpy.run_path(W+'/scripts/blender/desk_c1v1_calibrate_r5.py')['run'](nsC1)
print('C1 reversible legibility calibration DONE',flush=True)
print('D1 r6 trial START',flush=True)
nsD1['bpy'].context.window.scene=nsD1['d'].SC
print(json.dumps(runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r6.py')['install'](nsD1)),flush=True)
a=nsD1['A'];a.times='4,18,20,24.5,34,45.6,47.2,51.2,54.8,63,84.3,118.8,126.17,140.5,165,169.8,172.3,175.5,179,194,221.5,225.5,229,263.9,279.5,283,311.7,321,400,403.3'
a.out='/private/tmp/ys/ys-chain-d1v1-render/blender/landmarks-d1v1-r6'
a.force=False;a.start=0;a.stop=1e9;a.every=1;a.scale=1;a.samples=16
nsD1['main']()
print('D1 r6 trial DONE',flush=True)
