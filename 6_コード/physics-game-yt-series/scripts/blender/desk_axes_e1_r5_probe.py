"""E-1 final grouped correction followed by the actual whole-film preflight."""
import runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'E1 r5 whole-film probe START',flush=True)
nsE1['bpy'].context.window.scene=nsE1['d'].SC
runpy.run_path(W+'/scripts/blender/desk_e1v1_hotfix_r5.py')['run'](nsE1,'probe')
print(time.strftime('%Y-%m-%d %H:%M:%S'),'E1 r5 whole-film probe DONE',flush=True)
