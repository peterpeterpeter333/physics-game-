"""Root-authorized C19 trial, not a full-render approval."""
from pathlib import Path
import hashlib,runpy
_c19_trial_source=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_c1_final_visible_bundle_r19.py')
assert hashlib.sha256(_c19_trial_source.read_bytes()).hexdigest()=='50f591dee6c59c0105cc8f360bedd391560b6f2ac8342a1786fe5c29216a5171'
runpy.run_path(str(_c19_trial_source))['trial'](nsC1)
