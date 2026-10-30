"""Root GUI queue: zero-render, strict D-1 transform-restoration diagnostic."""
from pathlib import Path
import hashlib
import runpy

_d1diag_w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_d1diag_helper = _d1diag_w/'scripts/blender/desk_axes_d1_pier_contact_replay_v2_20261025.py'
assert hashlib.sha256(_d1diag_helper.read_bytes()).hexdigest() == '150a4bca4f8bd0f6c42077afb7b27d6d99f76aac6f1004a56a5b0be43441796c'
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
print('D-1 zero-render full-transform diagnostic; original 1e-9 checks retained', flush=True)
_d1diag_result = runpy.run_path(str(_d1diag_helper))['diagnostic'](nsD1, authorized=True)
assert _d1diag_result['allScenarioFullRestorationsPass']
assert all(_d1diag_result['protectionChecks'].values())
print('D-1 strict full-transform diagnostic PASS; no renders performed', flush=True)
