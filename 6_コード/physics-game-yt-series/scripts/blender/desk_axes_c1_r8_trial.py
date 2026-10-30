"""C-1: the single revised end composition and Pascal subtitle clearance."""
import runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
nsC1['bpy'].context.window.scene=nsC1['d'].SC
runpy.run_path(W+'/scripts/blender/desk_c1v1_refine_r8.py')['trial'](nsC1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'C1 r8 trial DONE',flush=True)
