"""Root-only zero-render audit before the B-1 camera-only trial."""
import hashlib
import runpy
from pathlib import Path
_probe=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_remaining_ng_six_probe_runner_20261025.py')
assert hashlib.sha256(_probe.read_bytes()).hexdigest()=='12cd2b0bd0b3f2006465d91ab710fc1963327e0a784df00f7ed0ccaf0aee0e9c'
_api=runpy.run_path(str(_probe))
_name,_ns=_api['select_namespace'](globals())
_api['run'](_ns,authorized=True,mode='audit',expected_helper_sha256='12cd2b0bd0b3f2006465d91ab710fc1963327e0a784df00f7ed0ccaf0aee0e9c',namespace_name=_name)
