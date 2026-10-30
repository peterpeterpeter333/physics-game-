"""Root numeric-only B6v2 audit after the exact new dependency probes."""
from pathlib import Path
import hashlib, runpy
_b6v2w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_b6v2h = _b6v2w/'scripts/blender/desk_axes_b1_integrated_b6_v2_20261024.py'
_b6v2p4 = Path('/private/tmp/ys/ys-chain-b1v1-camera-size-b4-v2-20261024/probe/report.json')
_b6v2p5 = Path('/private/tmp/ys/ys-chain-b1v1-repel-b5-v4-20261024/probe/report.json')
assert hashlib.sha256(_b6v2h.read_bytes()).hexdigest() == 'd32f113c60df61c9a31909f0aa4b5b0dd667e6fc5f4fb4b38652b70e1f707b13'
runpy.run_path(str(_b6v2h))['run'](nsB1r6, authorized=True, mode='audit', b4_probe_sha256=hashlib.sha256(_b6v2p4.read_bytes()).hexdigest(), b5_probe_sha256=hashlib.sha256(_b6v2p5.read_bytes()).hexdigest())
