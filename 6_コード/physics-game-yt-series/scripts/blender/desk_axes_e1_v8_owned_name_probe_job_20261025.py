"""Root retry: existing E mesh identity only, no motion/threshold change."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_e1_meaningful_motion_v8_owned_mesh_names_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='28e0493840bffe004f57755b4dadfac997b520a19985aab3b9f9399712d9d845'
runpy.run_path(str(p))['run'](nsE1,authorized=True,mode='probe',allow_temporary_unhide=True)
