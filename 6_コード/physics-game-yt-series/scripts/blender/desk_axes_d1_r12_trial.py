import json,runpy
_w='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
runpy.run_path(_w+'/scripts/blender/desk_d1v1_physical_r12.py',init_globals={'nsD1':nsD1})
_d=json.load(open('/private/tmp/ys/ys-chain-d1v1-render/d1-semantic-physical-r12.json'))
assert all(r['pass'] for r in _d['rows'] if not r['cameraTransition']), 'Held-state physical failure; trial cancelled'
runpy.run_path(_w+'/scripts/blender/desk_d1v1_trial_r12.py',init_globals={'nsD1':nsD1})
