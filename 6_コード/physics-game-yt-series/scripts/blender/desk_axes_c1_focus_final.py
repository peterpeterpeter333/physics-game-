"""C-1 bookend focus confirmation, with the same objects, pose, and six sheets."""
import runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
nsC1['bpy'].context.window.scene=nsC1['d'].SC
runpy.run_path(W+'/scripts/blender/desk_c1v1_focus_final.py')['trial'](nsC1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'C1 actual-paper focus trial DONE',flush=True)
