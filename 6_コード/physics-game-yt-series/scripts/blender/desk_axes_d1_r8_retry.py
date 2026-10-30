"""D-1 final three-frame confirmation after the last-camera bound was corrected."""
import runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
nsD1['bpy'].context.window.scene=nsD1['d'].SC
runpy.run_path(W+'/scripts/blender/desk_d1v1_trial_r8_retry.py',init_globals={'nsD1':nsD1})
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r8 retry DONE',flush=True)
