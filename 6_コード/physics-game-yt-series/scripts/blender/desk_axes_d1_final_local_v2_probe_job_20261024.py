"""Root probe, new camera dependency and explicitly unused hidden diagnosis."""
from pathlib import Path
import hashlib, json, runpy
_dl2w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_dl2h = _dl2w/'scripts/blender/desk_axes_d1_final_local_bundle_v2_20261024.py'
_dl2diag = Path('/private/tmp/ys/ys-chain-d1v1-render/d1-straw-trace-height-diagnostic-v2-20261024.json')
assert hashlib.sha256(_dl2h.read_bytes()).hexdigest() == 'dc58dbd338006f71fe280677af3fec8353042c68a7e3fab7a4fb385f0fc2dbee'
_dl2r = json.loads(_dl2diag.read_text())
assert len(_dl2r['rows']) == 12 and _dl2r['renders'] == 0 and _dl2r['filesOrFunctionsModified'] is False
assert all(abs(r['heightError']) <= 1e-5 for r in _dl2r['rows'] if not r['hiddenInThisState'])
runpy.run_path(str(_dl2h))['run'](nsD1, authorized=True, mode='probe', height_diagnostic_sha256=hashlib.sha256(_dl2diag.read_bytes()).hexdigest())
