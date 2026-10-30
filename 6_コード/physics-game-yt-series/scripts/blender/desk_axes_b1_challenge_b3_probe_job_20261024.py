"""Two actual B3 needle-contrast probes; not a final approval or full render."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_challenge_b3_20261024.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='a912a2bf47cfb42dfff8fac6314aa3b6c53b44dec401346a54e309bd2203ec9d'
runpy.run_path(str(p))['run'](nsB1r6,authorized=True,mode='probe')
