"""Root fixed-angle derivative; every original actual-state quality test remains."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_camera_solver_v7_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='096888fa290597d172f75cb40a5fda559d14211e3a4a8ab8788748763590ff6e'
runpy.run_path(str(p))['run_camera'](nsD1,authorized=True,mode='audit')
