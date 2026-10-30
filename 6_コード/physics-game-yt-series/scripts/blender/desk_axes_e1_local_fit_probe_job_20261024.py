import hashlib
import runpy
from pathlib import Path
p = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_e1_local_fit_20261024.py')
assert hashlib.sha256(p.read_bytes()).hexdigest() == '1b6bbbe9e3614df7f84a2543eab649aa4dd7d383d04badbba22a666de29c4395'
runpy.run_path(str(p))['run'](nsE1, authorized=True, mode='probe')
