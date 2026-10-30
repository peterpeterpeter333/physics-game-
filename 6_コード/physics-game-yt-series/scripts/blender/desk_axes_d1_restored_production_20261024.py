"""Retain the guarded failed attempt; restore frozen functions, then retry D1."""
import hashlib,runpy
from pathlib import Path
work=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
helper=work/'scripts/blender/desk_axes_d1_r15_restore.py'
assert hashlib.sha256(helper.read_bytes()).hexdigest()=='712ee8d5abb644b445d6b962429f7415e7b346239b820575cc8288948396170f'
nsD1=runpy.run_path(str(helper))['restore'](nsD1,authorized=True)
runpy.run_path(str(work/'scripts/blender/desk_axes_d1_r15_production.py'),init_globals={'nsD1':nsD1,'D1_PRODUCTION_AUTHORIZED':True,'D1_RENDER_NOW':True})
camera_patch=work/'scripts/blender/desk_axes_d1_camera_patch_20261024.py'
assert hashlib.sha256(camera_patch.read_bytes()).hexdigest()=='0ab032966bae0acdf9788df05118c8373d345cadca304f2447d01a0a55fcbdfa'
runpy.run_path(str(camera_patch))['run'](nsD1,authorized=True,mode='render')
