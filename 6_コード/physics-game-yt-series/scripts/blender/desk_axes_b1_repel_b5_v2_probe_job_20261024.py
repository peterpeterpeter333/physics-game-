import hashlib
import runpy
from pathlib import Path
p = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_repel_b5_v2_20261024.py')
assert hashlib.sha256(p.read_bytes()).hexdigest() == 'b22afb08cd19154eb2b623384aaa96748fb223b7849d499dee04e6430943c2c8'
runpy.run_path(str(p))['run'](nsB1r6, authorized=True, mode='probe')
