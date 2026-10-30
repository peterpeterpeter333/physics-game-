"""Root numerical audit only; no dependency visual approval is inferred."""
from pathlib import Path
import hashlib, runpy
_bv3w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_bv3h = _bv3w/'scripts/blender/desk_axes_b1_integrated_b6_v3_20261024.py'
_bv3p4 = Path('/private/tmp/ys/ys-chain-b1v1-camera-size-b4-v3-20261024/probe/report.json')
_bv3p5 = Path('/private/tmp/ys/ys-chain-b1v1-repel-b5-v4-20261024/probe/report.json')
assert hashlib.sha256(_bv3h.read_bytes()).hexdigest() == 'c85c0e8754bc782d5209c4962071e88748b28ee0020260f74cf1e0d719080b2d'
runpy.run_path(str(_bv3h))['run'](nsB1r6, authorized=True, mode='audit', b4_probe_sha256=hashlib.sha256(_bv3p4.read_bytes()).hexdigest(), b5_probe_sha256=hashlib.sha256(_bv3p5.read_bytes()).hexdigest())
