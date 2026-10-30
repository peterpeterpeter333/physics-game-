"""Root-approved full local derivative after all22 actual probes and2 catalog views."""
from pathlib import Path
import hashlib, runpy
_dv4full = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_final_local_bundle_v4_20261024.py')
assert hashlib.sha256(_dv4full.read_bytes()).hexdigest() == '1edcafa6e7d52033554834398ce49daf2f2022133c13ec6b87d7d77655d33ca2'
runpy.run_path(str(_dv4full))['run'](nsD1, authorized=True, mode='render', height_diagnostic_sha256='775fd4b38fbe3690f6c0d03034ddba417cfbd27fb3a85262727ee0d154e733dc', probe_report_sha256='89cc2d0853a01ca0a1513582cfbaa113a2262690cabcbc6985891069c1f076b1', visually_approved=True)
