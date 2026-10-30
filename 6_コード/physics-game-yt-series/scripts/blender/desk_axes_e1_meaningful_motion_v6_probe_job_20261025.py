"""Root E twelve actual motion probes; preserve all original NG evidence."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_e1_meaningful_motion_v6_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='722e6918ed5902c374b8f075e58e36ca47f52668d7c6cd62899bb5238eef8797'
runpy.run_path(str(p))['run'](nsE1,authorized=True,mode='probe',allow_temporary_unhide=True)
