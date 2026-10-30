"""Four actual C17 paper/crowd-cut probes; originals and r16 remain intact."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_c1_crowd_hold_r17.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='237841f4ce377f066490ba1779fdaf910837d3ffe2e61aeb40cf7e347dad32c5'
runpy.run_path(str(p))['trial'](nsC1)
