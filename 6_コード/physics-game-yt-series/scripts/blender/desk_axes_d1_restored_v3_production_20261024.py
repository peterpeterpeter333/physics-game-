"""Retain failed attempts; strict diagnosed D reset restoration, then render."""
import hashlib,runpy
from pathlib import Path
work=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
helper=work/'scripts/blender/desk_axes_d1_r15_restore_v3_20261024.py'
assert hashlib.sha256(helper.read_bytes()).hexdigest()=='c5f5f26cafcb9148d1c6cae5bdf13917a68d153b1459662adc9b0770c965cc07'
nsD1=runpy.run_path(str(helper))['restore'](nsD1,authorized=True)
runpy.run_path(str(work/'scripts/blender/desk_axes_d1_r15_production.py'),init_globals={'nsD1':nsD1,'D1_PRODUCTION_AUTHORIZED':True,'D1_RENDER_NOW':True})
patch=work/'scripts/blender/desk_axes_d1_camera_patch_20261024.py'
assert hashlib.sha256(patch.read_bytes()).hexdigest()=='0ab032966bae0acdf9788df05118c8373d345cadca304f2447d01a0a55fcbdfa'
runpy.run_path(str(patch))['run'](nsD1,authorized=True,mode='render')
