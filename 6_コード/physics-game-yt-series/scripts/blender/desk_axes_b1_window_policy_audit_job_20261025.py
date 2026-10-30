"""Root strict zero-render audit; separate explicit top-window-only raster control policy."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_b7_window_policy_20261025.py')
h='fb3d9ec0a8e38e86ddbf0e3980f96674e5a3d067ec316738d6fe0bd10597713b'
assert hashlib.sha256(p.read_bytes()).hexdigest()==h
runpy.run_path(str(p))['run'](nsB1r6,authorized=True,mode='audit',expected_adapter_sha256=h)
