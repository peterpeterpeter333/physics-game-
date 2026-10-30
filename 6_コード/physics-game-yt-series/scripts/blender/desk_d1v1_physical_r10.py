"""Install one D1 real-visual fix bundle; audit all cues before any more renders."""
import json,runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r10 physical audit START',flush=True)
p=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r10.py');print(json.dumps(p['install'](nsD1)),flush=True)
runpy.run_path(W+'/scripts/blender/desk_d1v1_semantic_audit_r9.py')['check'](nsD1,C+'/d1-semantic-physical-r10.json',revision='r10',expected_source=p['EXPECTED_SOURCE'])
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r10 physical audit DONE (no rendering)',flush=True)
