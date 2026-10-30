"""Root-authorized four-image trial; all numerical guards run before drawing."""
from pathlib import Path
import hashlib, runpy
_b5v3_source=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_repel_b5_v3_20261024.py')
assert hashlib.sha256(_b5v3_source.read_bytes()).hexdigest()=='b5284ff4c264a57153d2f4bc31480e37f6b7e4bea019b579bdd967b4bba6dc6d'
runpy.run_path(str(_b5v3_source))['run'](nsB1r6,authorized=True,mode='probe')
