"""C-1 final grouped model/word-timing trial; no full render before actual review."""
import runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'C1 r7 grouped trial START',flush=True)
nsC1['bpy'].context.window.scene=nsC1['d'].SC
runpy.run_path(W+'/scripts/blender/desk_c1v1_refine_r7.py')['trial'](nsC1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'C1 r7 grouped trial DONE',flush=True)
