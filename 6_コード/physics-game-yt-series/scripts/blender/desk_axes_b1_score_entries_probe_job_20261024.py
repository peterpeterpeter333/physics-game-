"""Five actual B score/remaining-entry probes; no full replacement yet."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_score_entries_d1_20261024.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='76387e1d6700eb01a65a56bf36f7086e08b716e522c4084b27843e767ee31338'
runpy.run_path(str(p))['run'](nsB1r6,authorized=True,mode='probe')
