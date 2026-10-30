"""Root fresh actual5 pier frames,2problem and2catalog images; no reuse of failed probe."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_verified_v5_adapters_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='f518e79055a897c63d2c5a089abad0d6f8725926f9ab7032ba92d0795e81f464'
runpy.run_path(str(p))['run_pier'](nsD1,authorized=True,mode='probe')
