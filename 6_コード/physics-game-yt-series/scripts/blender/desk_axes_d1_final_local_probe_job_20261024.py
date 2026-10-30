"""Root-authorized actual D probe only, not approval for full replacement."""
from pathlib import Path
import hashlib, json, runpy

_dlocal_w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_dlocal_helper = _dlocal_w/'scripts/blender/desk_axes_d1_final_local_bundle_20261024.py'
_dlocal_diagnostic = _dlocal_w/'scripts/blender/desk_axes_d1_remaining_height_diagnostic_v2_20261024.py'
_dlocal_report = Path('/private/tmp/ys/ys-chain-d1v1-render/d1-straw-trace-height-diagnostic-v2-20261024.json')
assert hashlib.sha256(_dlocal_helper.read_bytes()).hexdigest() == 'b5eb24f1747aae9e28fcacc64433439b051ac04681c18660faa79f0db0d2815c'
assert hashlib.sha256(_dlocal_diagnostic.read_bytes()).hexdigest() == '2fdd9358c97bdb70e863cbe1ca7c8bf11ad3baa4d2d655212428692a360dae9f'
_dlocal_d = json.loads(_dlocal_report.read_text())
assert _dlocal_d['renders'] == 0 and _dlocal_d['filesOrFunctionsModified'] is False
assert len(_dlocal_d['rows']) == 12
assert all(abs(r['heightError']) <= 1e-5 for r in _dlocal_d['rows'])
runpy.run_path(str(_dlocal_helper))['run'](
    nsD1, authorized=True, mode='probe',
    height_diagnostic_sha256=hashlib.sha256(_dlocal_report.read_bytes()).hexdigest())
