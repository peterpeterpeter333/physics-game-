"""Root approved all eight actual probes; retain canonical voice and captions."""
import hashlib
import json
from pathlib import Path
import runpy

_e1ar_w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_e1ar_p=_e1ar_w/'scripts/blender/desk_axes_e1_actions_final_20261024.py'
_e1ar_receipt=_e1ar_w/'outputs/axes-20261023/root-e1-actions8-probe-eye-approval-20261025.json'
assert hashlib.sha256(_e1ar_p.read_bytes()).hexdigest()=='e74ac58891ff2768dab426974b71a5207a07f0a207ef25575e6fee658bd5cd83'
_e1ar_a=json.loads(_e1ar_receipt.read_text())
assert _e1ar_a['approved']and _e1ar_a['allEightPersonallyViewedAtOriginalResolution']
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_e1ar_r=runpy.run_path(str(_e1ar_p))['run'](nsE1,authorized=True,mode='render',approved_probe_sha256='af9f7fc72449769fa3b207302a2af47bb2d6b63ee778ee8615ea3f7012b8bff7')
assert _e1ar_r['allPatchFramesActuallyRendered']and _e1ar_r['allGuardedStatesPass']
assert all(_e1ar_r['protectionChecks'].values())
print('E action1501 exact actual sources complete; final encode, original gates and actual visual review still pending',flush=True)
