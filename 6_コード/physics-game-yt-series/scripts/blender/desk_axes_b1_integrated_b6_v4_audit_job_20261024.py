"""Root numerical audit only; no image approval inferred from bounds."""
from pathlib import Path
import hashlib, runpy
_b6v4w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_b6v4h = _b6v4w/'scripts/blender/desk_axes_b1_integrated_b6_v4_20261024.py'
_b6v4p4 = Path('/private/tmp/ys/ys-chain-b1v1-camera-size-b4-v4-20261024/probe/report.json')
_b6v4p5 = Path('/private/tmp/ys/ys-chain-b1v1-repel-b5-v4-20261024/probe/report.json')
assert hashlib.sha256(_b6v4h.read_bytes()).hexdigest() == '0b690509cff90753f2952c9dbb747592ebf922d157674e506e04eccebec9bd35'
assert hashlib.sha256(_b6v4p5.read_bytes()).hexdigest() == '69f680bda23b6e30ca9a6272cd34009777683065aca4bc0661f342f1e8f460c5'
runpy.run_path(str(_b6v4h))['run'](nsB1r6, authorized=True, mode='audit', b4_probe_sha256=hashlib.sha256(_b6v4p4.read_bytes()).hexdigest(), b5_probe_sha256=hashlib.sha256(_b6v4p5.read_bytes()).hexdigest())
