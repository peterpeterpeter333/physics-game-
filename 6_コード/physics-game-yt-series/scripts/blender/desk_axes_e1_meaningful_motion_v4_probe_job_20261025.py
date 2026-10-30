"""Root E actual12 probes; controls require independently decoded whole RGB equality."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_e1_meaningful_motion_v4_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='cd16376760a4382fcf4827a8e89a8d01258ef0d6fbba877e4013a8f79b3ecfb5'
runpy.run_path(str(p))['run'](nsE1,authorized=True,mode='probe',allow_temporary_unhide=True)
