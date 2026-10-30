import hashlib
import runpy
from pathlib import Path
p = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_camera_size_b4_20261024.py')
assert hashlib.sha256(p.read_bytes()).hexdigest() == '0f283f6101fa0c69e8aa3ebf4d9f37088e877e9f74223886eb7043e5d7027c96'
runpy.run_path(str(p))['run'](nsB1r6, authorized=True, mode='probe')
