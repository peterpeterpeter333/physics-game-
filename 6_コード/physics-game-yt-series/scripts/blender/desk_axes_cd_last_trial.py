"""Final small framing trials; leaves each episode in its own saved scene."""
import runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'C1 r6 framing START',flush=True)
nsC1['bpy'].context.window.scene=nsC1['d'].SC
runpy.run_path(W+'/scripts/blender/desk_c1v1_calibrate_r6.py')['run'](nsC1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'C1 r6 framing DONE',flush=True)
nsD1['bpy'].context.window.scene=nsD1['d'].SC
runpy.run_path(W+'/scripts/blender/desk_d1v1_trial_r7.py',init_globals={'nsD1':nsD1})
