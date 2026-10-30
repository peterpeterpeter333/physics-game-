import hashlib
import runpy
from pathlib import Path

_source = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_missing131_physical_20261025.py')
assert hashlib.sha256(_source.read_bytes()).hexdigest() == '717cd8556f82c782f573fba2309e26c21e6d945a9f90c07711df844be9ef68ef'
_api = runpy.run_path(str(_source))
_api['run'](nsD1, authorized=True)
