"""Root fresh E twelve-image probe with explicit9540-only control case."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_e1_meaningful_motion_v5_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='bb072f9a86031b1408af8bd19efbd587a550fd368521d698caf6c28991862088'
runpy.run_path(str(p))['run'](nsE1,authorized=True,mode='probe',allow_temporary_unhide=True)
