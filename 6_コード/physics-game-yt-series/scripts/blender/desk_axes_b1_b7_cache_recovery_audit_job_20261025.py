"""Root-owned B7 zero-render strict audit after explicit cache/RNA repair."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_b7_cache_recovery_20261025.py')
h='37e6db84e45e544a68175eb8979734a2c63a7ef6928de5bc0ee5e1498e257efc'
assert hashlib.sha256(p.read_bytes()).hexdigest()==h
runpy.run_path(str(p))['run'](nsB1r6,authorized=True,mode='audit',expected_adapter_sha256=h)
