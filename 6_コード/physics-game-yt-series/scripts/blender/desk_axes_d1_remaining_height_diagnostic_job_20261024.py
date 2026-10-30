"""Root-only diagnosis scheduled after ongoing production; no image output."""
from pathlib import Path
import hashlib,runpy
_d1_height_source=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_remaining_height_diagnostic_20261024.py')
assert hashlib.sha256(_d1_height_source.read_bytes()).hexdigest()=='d29ebe64104b20e80dd35006ebde86da938660e8b0ba7da0e72a69a9487c905c'
assert nsD1['D1_WATER_CENTER_V4']['wrapper'] is nsD1['main'].__globals__['mine_state']
runpy.run_path(str(_d1_height_source))['diagnose'](nsD1,authorized=True)
