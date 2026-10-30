"""Root-only normal dependency-cache diagnostic. No render or model edit."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_pier_contact_replay_v4_pointer_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='d6978d8d2d225f8aab6f6d0b051d5bce171d9bcd33e866c14b00004424a41c4c'
runpy.run_path(str(p))['coherency_diagnostic'](nsD1,authorized=True)
