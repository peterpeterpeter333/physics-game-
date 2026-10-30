"""Read-only physical measurement of the actually shown paper, not future crowd."""
import hashlib,runpy
from pathlib import Path
w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
p=w/'scripts/blender/desk_axes_c1_visible_paper_hold_bounds.py'
assert hashlib.sha256(p.read_bytes()).hexdigest()=='dd669f9a64b5f3d3b0e654bd1e35570dc0996eafd20c959463b04d52f4793d48'
runpy.run_path(str(p))['audit'](nsC1,'/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r16')
