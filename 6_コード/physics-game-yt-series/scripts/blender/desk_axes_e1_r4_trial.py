"""Run the independent E-1 r4 corrected-keyframe inspection, not a full film."""
import runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'E1 r4 keyframes START',flush=True)
nsE1['bpy'].context.window.scene=nsE1['d'].SC
runpy.run_path(W+'/scripts/blender/desk_e1v1_hotfix_r4.py')['run'](nsE1,'keyframes')
print(time.strftime('%Y-%m-%d %H:%M:%S'),'E1 r4 keyframes DONE',flush=True)
