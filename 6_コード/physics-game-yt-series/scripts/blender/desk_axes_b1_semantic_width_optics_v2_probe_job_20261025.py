import hashlib
from pathlib import Path
import runpy
_b1_optics_v2 = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_semantic_width_optics_v2_20261025.py')
assert hashlib.sha256(_b1_optics_v2.read_bytes()).hexdigest() == 'dad9771c5c7ecd57668d312fadb873ce457b7cbc3f49c5c69e95670cb8bfaeb0'
runpy.run_path(str(_b1_optics_v2))['dispatch'](globals(), {'mode': 'probe', 'auditSha256': 'd562bc9feb20efd70962f6410b8e0944ad3da8e448c1d5f23c36901e584e57ea'})
