import hashlib
import runpy
from pathlib import Path

_source = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_five_width_probe_job_20261025.py')
assert hashlib.sha256(_source.read_bytes()).hexdigest() == 'fe77ce7fcd58a96b87a93e7b9e4a827c02d86a29ad8c5fd2e7460ffe7a9bb2df'
_api = runpy.run_path(str(_source))
_api['run'](nsD1, authorized=True, mode='audit')
