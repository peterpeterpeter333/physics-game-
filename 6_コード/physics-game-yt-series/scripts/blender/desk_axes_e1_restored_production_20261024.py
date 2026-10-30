"""Retain the guarded failed attempt; restore frozen controls, then retry E1."""
import hashlib,runpy
from pathlib import Path
work=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
helper=work/'scripts/blender/desk_axes_e1_restore_r9_20261024.py'
assert hashlib.sha256(helper.read_bytes()).hexdigest()=='227ed079c77dbf78b3f2acea47b22cb5c8c3dee70c1199698666e36de0addee7'
runpy.run_path(str(helper))['run'](nsE1,render=True)
camera_patch=work/'scripts/blender/desk_axes_e1_camera_patch_20261024.py'
assert hashlib.sha256(camera_patch.read_bytes()).hexdigest()=='eb13699fd997113f3fa3a3ab4b2f4856367d4f160f05726b196228a260eb9f2c'
runpy.run_path(str(camera_patch))['run'](nsE1,authorized=True)
