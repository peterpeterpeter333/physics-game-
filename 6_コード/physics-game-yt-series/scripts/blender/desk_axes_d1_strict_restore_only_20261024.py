"""Diagnosed D restoration and original preflight only; no production render."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_r15_restore_v3_20261024.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='c5f5f26cafcb9148d1c6cae5bdf13917a68d153b1459662adc9b0770c965cc07'
nsD1=runpy.run_path(str(p))['restore'](nsD1,authorized=True)
