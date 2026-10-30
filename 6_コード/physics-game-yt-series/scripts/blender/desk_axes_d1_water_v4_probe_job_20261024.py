"""Strict water-intent correction and three actual probes, never production."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_r15_restore_v4_20261024.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='7ec8ee0c86872a47de4b505fb469d08e8055fd69528fdcba0c5884677f15fcb6'
h=runpy.run_path(str(p))
nsD1=h['restore'](nsD1,authorized=True)
h['render_probe'](nsD1,authorized=True)
