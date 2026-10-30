"""The root's sole-GPU dispatch of the approved six inert D camera trials."""
import hashlib
from pathlib import Path
import runpy
_d_ng_probe=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_original_ng_probe_job_20261025.py')
assert hashlib.sha256(_d_ng_probe.read_bytes()).hexdigest()=='4d667c6b6f497ff0eb66776da9e472dfe7940e340549b17af8f9b44758cd0131'
runpy.run_path(str(_d_ng_probe))['run'](nsD1,authorized=True)
