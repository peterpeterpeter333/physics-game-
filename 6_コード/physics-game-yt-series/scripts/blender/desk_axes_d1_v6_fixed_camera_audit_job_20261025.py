"""Root fixed-camera actual-state fit audit; no change to40–70/safe/1% limits."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_camera_solver_v6_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='73ec26d906a244ef325329786564332362996df20702f1c18defdf204fd2a3df'
runpy.run_path(str(p))['run_camera'](nsD1,authorized=True,mode='audit')
