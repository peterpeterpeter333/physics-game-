"""Root trial of the actual same-camera bookends and correctly classified air exit."""
from pathlib import Path
import hashlib, runpy
_dl3h = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_final_local_bundle_v3_20261024.py')
_dl3diag = Path('/private/tmp/ys/ys-chain-d1v1-render/d1-straw-trace-height-diagnostic-v2-20261024.json')
assert hashlib.sha256(_dl3h.read_bytes()).hexdigest() == '90531e001fc86cf4d633bb2a8bcedb474eaaa49f15e2777bb4d2f9420263e2ed'
assert hashlib.sha256(_dl3diag.read_bytes()).hexdigest() == '775fd4b38fbe3690f6c0d03034ddba417cfbd27fb3a85262727ee0d154e733dc'
runpy.run_path(str(_dl3h))['run'](nsD1, authorized=True, mode='probe', height_diagnostic_sha256=hashlib.sha256(_dl3diag.read_bytes()).hexdigest())
