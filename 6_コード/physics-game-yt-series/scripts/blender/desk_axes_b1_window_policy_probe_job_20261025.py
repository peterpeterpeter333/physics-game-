"""Root-only18controls+18repair/context images, explicit window-only case, oldNG retained."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_b7_window_policy_20261025.py')
h='fb3d9ec0a8e38e86ddbf0e3980f96674e5a3d067ec316738d6fe0bd10597713b'
assert hashlib.sha256(p.read_bytes()).hexdigest()==h
runpy.run_path(str(p))['run'](nsB1r6,authorized=True,mode='probe',expected_adapter_sha256=h,approved_audit_sha256='2142094a6e500da96cf8d8e6832413695956182cf3d9ab84e3c490a7775e3b3d')
