"""D-1 approved three-image trial -> actual whole-range preflight, not production."""
import runpy,time,json
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
approval=json.load(open('/private/tmp/ys/ys-chain-d1v1-render/trial-approval-d1v1-r8.json'))
assert approval['trialImagesVisuallyReviewed'] and approval['proceedToAllRangeProbe']
nsD1['bpy'].context.window.scene=nsD1['d'].SC
_axes_guard(nsD1)
runpy.run_path(W+'/scripts/blender/desk_d1v1_probe_r8.py',init_globals={'nsD1':nsD1})
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r8 whole-range probe DONE',flush=True)
