"""Root cached-cloud fixed-view search, strict actual quality acceptance only."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_camera_solver_v8_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='85420b61e740d63102703ebf04032c51de46f98022a1660d7c70467845446e11'
runpy.run_path(str(p))['run_camera'](nsD1,authorized=True,mode='audit')
