"""Root queue runner only; never launch this from a CLI Blender process."""
from pathlib import Path
import hashlib
import runpy

_b6rw = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_b6rh = _b6rw/'scripts/blender/desk_axes_b1_b6_v6_owned_resume_20261025.py'
_b6rsha = '39792974a4afe144f64ac674e5a85dde3bbd26ec0b5c0f61e46db13a43ac3cbf'
assert hashlib.sha256(_b6rh.read_bytes()).hexdigest() == _b6rsha
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
print('Owned B6v6 resume: preserve487, recompute803 strict states/anchors, render316 missing only',flush=True)
_b6rr = runpy.run_path(str(_b6rh))['run'](nsB1r6,authorized=True)
assert _b6rr['allPatchFramesActuallyRendered'] and len(_b6rr['actualImages'])==803
print('Owned B6v6 resume finished; final MP4 eyes/ears/original gates still pending',flush=True)
