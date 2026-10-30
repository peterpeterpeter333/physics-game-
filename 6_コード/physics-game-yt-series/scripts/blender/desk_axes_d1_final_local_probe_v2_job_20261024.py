"""Root-authorized D probe with the verified metadata-only final source pin."""
from pathlib import Path
import hashlib, json, runpy

_dlocal2_w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_dlocal2_helper = _dlocal2_w/'scripts/blender/desk_axes_d1_final_local_bundle_20261024.py'
_dlocal2_diagnostic = _dlocal2_w/'scripts/blender/desk_axes_d1_remaining_height_diagnostic_v2_20261024.py'
_dlocal2_report = Path('/private/tmp/ys/ys-chain-d1v1-render/d1-straw-trace-height-diagnostic-v2-20261024.json')
assert hashlib.sha256(_dlocal2_helper.read_bytes()).hexdigest() == 'f12b6b9a6feb7f70f7919542cef471578ba146fc18c9db1f11063abedce91780'
assert hashlib.sha256(_dlocal2_diagnostic.read_bytes()).hexdigest() == '2fdd9358c97bdb70e863cbe1ca7c8bf11ad3baa4d2d655212428692a360dae9f'
_dlocal2_d = json.loads(_dlocal2_report.read_text())
assert _dlocal2_d['renders'] == 0 and _dlocal2_d['filesOrFunctionsModified'] is False
assert len(_dlocal2_d['rows']) == 12
assert all(abs(r['heightError']) <= 1e-5 for r in _dlocal2_d['rows'])
runpy.run_path(str(_dlocal2_helper))['run'](
    nsD1, authorized=True, mode='probe',
    height_diagnostic_sha256=hashlib.sha256(_dlocal2_report.read_bytes()).hexdigest())
