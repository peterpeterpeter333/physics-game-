"""Root-only all-six strict restoration test, including hidden catalog jet state."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_pier_contact_replay_v5_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='bc91b1089c3714378cbd98bd39229f288b0e6cf7f7011a492e85d3df7cccbcf7'
runpy.run_path(str(p))['diagnostic'](nsD1,authorized=True)
