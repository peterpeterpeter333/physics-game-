"""Diagnosed E renderer restoration and original preflight only, no render."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_e1_restore_renderer_v2_20261024.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='394e207a69a490aa513284b6c236af958247c728ff3efc141b0f5556ed37b1ed'
runpy.run_path(str(p))['run'](nsE1,restore=True,render=False)
