"""Root fresh strict zero-render audit with metadata-only print compatibility."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_b7_window_policy_v2_20261025.py')
h='903ac7bb04ab56f91ba6ae4f9ddd2b5009a4824c9d6acf4f87f7ec1a514ea133'
assert hashlib.sha256(p.read_bytes()).hexdigest()==h
runpy.run_path(str(p))['run'](nsB1r6,authorized=True,mode='audit',expected_adapter_sha256=h)
