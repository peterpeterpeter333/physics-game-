"""Root C20 exact restore diagnosis, then actual trial. Not full approval."""
from pathlib import Path
import hashlib, runpy
_ct20 = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_c1_final_visible_bundle_r20.py')
assert hashlib.sha256(_ct20.read_bytes()).hexdigest() == '56e667659aa4c0e96f355058ec49c04bf24da68724c79fc92e7f05665f6d4350'
_ct20api = runpy.run_path(str(_ct20))
_ct20restored = _ct20api['restore_diagnostic'](nsC1)
assert _ct20restored['matrixRestored'] and _ct20restored['frozenInputsAndOtherSceneFilesVerified']
_ct20api['trial'](nsC1)
