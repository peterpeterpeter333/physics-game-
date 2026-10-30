"""D-1: three revised frames, after explicit geometry-bound assertions."""
import runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r8 trial START',flush=True)
nsD1['bpy'].context.window.scene=nsD1['d'].SC
runpy.run_path(W+'/scripts/blender/desk_d1v1_trial_r8.py',init_globals={'nsD1':nsD1})
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r8 trial DONE',flush=True)
