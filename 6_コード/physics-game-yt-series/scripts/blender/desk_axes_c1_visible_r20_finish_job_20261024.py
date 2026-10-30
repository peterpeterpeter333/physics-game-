"""Root approved the actual C20 trial; render its local replacements once."""
from pathlib import Path
import hashlib, runpy
_cf20 = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_c1_final_visible_bundle_r20.py')
_cf20qa = Path('/private/tmp/ys/ys-chain-c1v1-visible-r20-trial/human-qa.json')
assert hashlib.sha256(_cf20.read_bytes()).hexdigest() == '56e667659aa4c0e96f355058ec49c04bf24da68724c79fc92e7f05665f6d4350'
assert hashlib.sha256(_cf20qa.read_bytes()).hexdigest() == '2517ff312a9156e3822c52732949f758b6157eeb5deaa978e963146e7594c038'
runpy.run_path(str(_cf20))['finish'](nsC1)
