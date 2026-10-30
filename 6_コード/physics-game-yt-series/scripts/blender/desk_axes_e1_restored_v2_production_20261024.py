"""Restore canonical E renderer in its own globals, preserving original guards."""
import hashlib,runpy
from pathlib import Path
work=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
helper=work/'scripts/blender/desk_axes_e1_restore_renderer_v2_20261024.py'
assert hashlib.sha256(helper.read_bytes()).hexdigest()=='394e207a69a490aa513284b6c236af958247c728ff3efc141b0f5556ed37b1ed'
runpy.run_path(str(helper))['run'](nsE1,restore=True,render=True)
patch=work/'scripts/blender/desk_axes_e1_camera_patch_20261024.py'
assert hashlib.sha256(patch.read_bytes()).hexdigest()=='eb13699fd997113f3fa3a3ab4b2f4856367d4f160f05726b196228a260eb9f2c'
runpy.run_path(str(patch))['run'](nsE1,authorized=True)
