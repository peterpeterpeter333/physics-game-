"""Root diagnostic only: two complete zero-repair render passes, retain pixel NG."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_b7_control18_distribution_diagnostic_20261025.py')
h='6c6adc908d80ae9a6c5caa7432b3e4bc96668d3ff0c2deec0ab4776fdd1eb23c'
assert hashlib.sha256(p.read_bytes()).hexdigest()==h
runpy.run_path(str(p))['run'](nsB1r6,authorized=True,expected_helper_sha256=h,passes=2)
