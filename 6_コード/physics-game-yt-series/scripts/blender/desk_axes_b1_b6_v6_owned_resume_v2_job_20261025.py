"""Root GUI queue only: frozen803 physics, exact JSON transport normalization."""
from pathlib import Path
import hashlib
import runpy

_b6v2w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_b6v2h = _b6v2w/'scripts/blender/desk_axes_b1_b6_v6_owned_resume_v2_20261025.py'
_b6v2sha = 'e96b776c011c3efc1269cb1905505b3c084622d44b1b800044d72c3032ab5376'
assert hashlib.sha256(_b6v2h.read_bytes()).hexdigest() == _b6v2sha
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_b6v2scope = runpy.run_path(str(_b6v2h))
assert _b6v2scope['synthetic_self_test']()['selfTest'] == 'PASS'
print('Owned B6v6 resume v2: exact JSON-normalized803 equality, preserve487, render316 only',flush=True)
_b6v2result = _b6v2scope['run'](nsB1r6,authorized=True)
assert _b6v2result['allPatchFramesActuallyRendered'] and len(_b6v2result['actualImages'])==803
assert len(_b6v2result['ownedResume']['jsonNormalizedPreflightEquality'])==8
assert all(row['maximumAbsoluteNumericDifference']==0 for row in _b6v2result['ownedResume']['jsonNormalizedPreflightEquality'].values())
print('Owned B6v6 resume v2 finished; final MP4/original gates/actual image review remain pending',flush=True)
