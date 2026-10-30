"""E original guarded runner after verified canonical-renderer restoration."""
import hashlib,json,runpy
from pathlib import Path
w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
c=Path('/private/tmp/ys/ys-chain-e1v1')
r=json.loads((c/'e1v1-job059-independent-review-20261024.json').read_text())
p=w/'scripts/blender/desk_axes_e1_r9_production.py'
assert hashlib.sha256(p.read_bytes()).hexdigest()=='5ace957318aedf51261034af2b9bf2949d8c6cd6d2e476afb5e1b6c27103c8ad'
runpy.run_path(str(p))['run'](nsE1,render=True)
p=w/'scripts/blender/desk_axes_e1_camera_patch_20261024.py'
assert hashlib.sha256(p.read_bytes()).hexdigest()=='eb13699fd997113f3fa3a3ab4b2f4856367d4f160f05726b196228a260eb9f2c'
runpy.run_path(str(p))['run'](nsE1,authorized=True)
