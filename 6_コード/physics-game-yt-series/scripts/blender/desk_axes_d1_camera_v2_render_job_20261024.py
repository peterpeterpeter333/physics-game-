"""Root queue: unchanged strict D camera guard with the new private entrance fit."""
from pathlib import Path
import hashlib, runpy
_dc2 = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_camera_patch_v2_20261024.py')
assert hashlib.sha256(_dc2.read_bytes()).hexdigest() == '6ef21b9a7c5207855bb9c3ec52e3a1f36a98cd80210d78f1278507303e05857f'
runpy.run_path(str(_dc2))['run'](nsD1, authorized=True, mode='render')
