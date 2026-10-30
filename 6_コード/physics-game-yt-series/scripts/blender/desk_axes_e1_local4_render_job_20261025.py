"""Root approved the four actual camera-only probe images before this render."""
import hashlib
import json
from pathlib import Path
import runpy

_e1l_w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_e1l_p=_e1l_w/'scripts/blender/desk_axes_e1_local_fit_20261024.py'
_e1l_receipt=_e1l_w/'outputs/axes-20261023/root-e1-local4-probe-eye-approval-20261025.json'
assert hashlib.sha256(_e1l_p.read_bytes()).hexdigest()=='1b6bbbe9e3614df7f84a2543eab649aa4dd7d383d04badbba22a666de29c4395'
_e1l_a=json.loads(_e1l_receipt.read_text())
assert _e1l_a['approved']and _e1l_a['allFourPersonallyViewedAtOriginalResolution']
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_e1l_r=runpy.run_path(str(_e1l_p))['run'](nsE1,authorized=True,mode='render',approved_probe_sha256='bb40f4e333726630e9aeebbb5a501740c21de75c0978aa185800f4a6b6e5f16b')
assert _e1l_r['allPatchFramesActuallyRendered']and _e1l_r['allCandidateRealPrincipal40to70SafeAndUnclipped']
assert all(_e1l_r['protectionChecks'].values())
print('E local camera60 actual derivatives complete; final encoded QA still pending',flush=True)
