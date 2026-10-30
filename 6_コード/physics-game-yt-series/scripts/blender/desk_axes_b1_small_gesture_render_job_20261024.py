"""Small hand full local correction after six real probe images were viewed."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_small_gesture_20261024.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='beec7f25bdf482cd0c7db62934f158d45e0be4d3335dc303d45c87314dd86475'
a=Path('/private/tmp/ys/ys-chain-b1v1-small-gesture-20261024/probe/actual-eye-approval.json')
runpy.run_path(str(p))['run'](nsB1r6,authorized=True,mode='render',approval_sha=hashlib.sha256(a.read_bytes()).hexdigest())
