import hashlib
import runpy
from pathlib import Path

_source = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_five_width_probe_job_v2_20261025.py')
assert hashlib.sha256(_source.read_bytes()).hexdigest() == '6a98c13e2ac68a696753f100117f4b0c01ebe9ef921cc51bd2c8696398c391b3'
_api = runpy.run_path(str(_source))
_api['run'](nsD1, authorized=True, mode='audit')
