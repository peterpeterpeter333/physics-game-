"""Root queue entry: read-only B7 geometry audit through explicit runtime pins."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_b7_namespace_compat_20261025.py')
h='ea40e31506f9f0d0aee236f21639c7776f8b4786a274a187a740298a3e0a5e89'
assert hashlib.sha256(p.read_bytes()).hexdigest()==h
runpy.run_path(str(p))['run'](nsB1r6,authorized=True,mode='audit',expected_adapter_sha256=h,runtime_report_sha256='69c657e35b6f6c1c121d927b6094eb3aa01f2c7db8bbe917433552296863f3e1')
