"""Root-only corrected zero-render diagnosis on the exact frozen D namespace."""
from pathlib import Path
import hashlib,runpy
_d1_height_v2_source=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_remaining_height_diagnostic_v2_20261024.py')
assert hashlib.sha256(_d1_height_v2_source.read_bytes()).hexdigest()=='2fdd9358c97bdb70e863cbe1ca7c8bf11ad3baa4d2d655212428692a360dae9f'
runpy.run_path(str(_d1_height_v2_source))['diagnose'](nsD1,authorized=True)
