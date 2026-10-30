"""Continue the active GUI session: only E-1's new, frozen trial corrections."""
import runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'E-1 r3 trial START',flush=True)
helper=runpy.run_path(W+'/scripts/blender/desk_e1v1_hotfix_r3.py')
nsE1['bpy'].context.window.scene=nsE1['d'].SC
helper['run'](nsE1,'keyframes')
print(time.strftime('%Y-%m-%d %H:%M:%S'),'E-1 r3 trial DONE',flush=True)
