"""No rendering: all57cue real principal geometry and three extra models."""
import runpy
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';c='/private/tmp/ys/ys-chain-d1v1-render'
runpy.run_path(W+'/scripts/blender/desk_d1v1_semantic_audit_r9.py')['check'](nsD1,c+'/d1-semantic-physical-r9.json')
runpy.run_path(W+'/scripts/blender/desk_d1v1_extra_bounds_r9.py')['check'](nsD1,c+'/d1-extra-bounds-r9.json')
