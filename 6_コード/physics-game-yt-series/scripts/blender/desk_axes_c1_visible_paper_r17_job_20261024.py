"""Read-only actual-paper dimensions through the real 16.36s cut."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_c1_visible_paper_hold_bounds_r17.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='680f2aad4db4813ff18c75efd141213e2c5ba0c157792a065276eff4c4b242a9'
runpy.run_path(str(p))['audit'](nsC1,'/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r17')
