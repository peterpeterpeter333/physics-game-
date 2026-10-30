"""Root queue only; freeze actual mixed runtime codes, zero model/GPU calls."""
from pathlib import Path
import hashlib,runpy
_b7nd2_w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_b7nd2_h=_b7nd2_w/'scripts/blender/desk_axes_b1_b7_namespace_diagnostic_v2_20261025.py'
_b7nd2_pin='98e11823b952c024d7769e678ced48a1274fa198ab94379b13971f536b4abcb0'
assert hashlib.sha256(_b7nd2_h.read_bytes()).hexdigest()==_b7nd2_pin
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_b7nd2_result=runpy.run_path(str(_b7nd2_h))['run'](nsB1r6,authorized=True,expected_helper_sha256=_b7nd2_pin)
print('B7 actual-code freeze done; historical source not reloaded; zero model/pose/update/GPU calls',flush=True)
