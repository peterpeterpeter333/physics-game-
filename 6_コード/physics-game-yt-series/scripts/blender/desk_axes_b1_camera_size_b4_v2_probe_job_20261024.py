"""Root four-image B4v2 trial with independent primary and critical garlic."""
from pathlib import Path
import hashlib, runpy
_bc4v2 = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_camera_size_b4_v2_20261024.py')
assert hashlib.sha256(_bc4v2.read_bytes()).hexdigest() == 'a989a5246c97760af0f088ae6e978bfe03f5ee842753ae35838167a89269d987'
runpy.run_path(str(_bc4v2))['run'](nsB1r6, authorized=True, mode='probe')
