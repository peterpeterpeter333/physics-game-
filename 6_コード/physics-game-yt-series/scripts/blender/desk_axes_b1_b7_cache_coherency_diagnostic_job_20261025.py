"""Root queue only: zero-render cache/context diagnosis, no actual patch run."""
from pathlib import Path
import hashlib
import runpy
_b7cache_w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_b7cache_h=_b7cache_w/'scripts/blender/desk_axes_b1_b7_cache_coherency_diagnostic_20261025.py'
_b7cache_pin='169bcd5a0ee1c0e858d67423030b491dceb07dc9926bc47e45ef5c0416ed5d6d'
assert hashlib.sha256(_b7cache_h.read_bytes()).hexdigest()==_b7cache_pin
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_b7cache_result=runpy.run_path(str(_b7cache_h))['run'](nsB1r6,authorized=True,
 expected_helper_sha256=_b7cache_pin,allow_temporary_unhide=True)
print('B7 cache diagnostic only; no render/patch/guard waiver',flush=True)
