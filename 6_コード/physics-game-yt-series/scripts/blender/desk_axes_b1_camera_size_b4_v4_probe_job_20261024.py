"""Root-only four-image trial, independently reviewed and SHA pinned."""
from pathlib import Path
import hashlib, runpy
_b4v4 = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_camera_size_b4_v4_20261024.py')
assert hashlib.sha256(_b4v4.read_bytes()).hexdigest() == 'd0a04b5b7a933e609a6a26b869d16decd0ff0bf6e493a4384e7bc918d8a28dc2'
runpy.run_path(str(_b4v4))['run'](nsB1r6, authorized=True, mode='probe')
