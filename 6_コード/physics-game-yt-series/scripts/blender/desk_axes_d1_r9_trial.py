"""D-1 genuine crop, principal-width, and force-arrow visibility corrections."""
import runpy
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
try:
    runpy.run_path(W+'/scripts/blender/desk_d1v1_trial_r9.py',init_globals={'nsD1':nsD1})
finally:
    runpy.run_path(W+'/scripts/blender/desk_d1v1_extra_bounds_r9.py')['check'](nsD1,'/private/tmp/ys/ys-chain-d1v1-render/d1-extra-bounds-r9.json')
