"""Keep both earlier C productions; render only confirmed local corrections."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_c1_camera_semantic_patch_r15.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='5a7a23470f29fe234b5061130e97a215128c87b3cfe0e9504083ed4a56a1777c'
runpy.run_path(str(p))['patch'](nsC1)
