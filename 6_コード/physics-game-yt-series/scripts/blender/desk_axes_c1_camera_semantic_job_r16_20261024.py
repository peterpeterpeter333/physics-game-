"""Keep earlier rejected candidates; strict r16 correction only."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_c1_camera_semantic_patch_r16.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='9e0aee1daff68af6a45e1156481848ed634f6aafb9fe488bc53470a614e72d06'
runpy.run_path(str(p))['patch'](nsC1)
