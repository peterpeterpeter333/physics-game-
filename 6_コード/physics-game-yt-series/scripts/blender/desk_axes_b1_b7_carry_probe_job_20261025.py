"""Root queue only: all sixteen B7 delivery frames plus two contexts."""
from pathlib import Path
import hashlib
import json
import runpy

_b7p_w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_b7p_helper = _b7p_w/'scripts/blender/desk_axes_b1_sixth_needle_carry_b7_20261025.py'
_b7p_pin = 'd1736e949348256273198cc181bfc2abe42125f9b8139b8bb466867dc8bc1e54'
_b7p_audit = Path('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-20261025/audit/report.json')
assert hashlib.sha256(_b7p_helper.read_bytes()).hexdigest() == _b7p_pin
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_b7p_before = hashlib.sha256(_b7p_audit.read_bytes()).hexdigest()
_b7p_a = json.loads(_b7p_audit.read_text())
assert _b7p_a['helperSha256'] == _b7p_pin and _b7p_a['mode'] == 'audit'
assert _b7p_a['allGuardedStatesPass'] and _b7p_a['actualGuardedStates'] == 18
assert not _b7p_a.get('error') and not _b7p_a.get('cleanupError') and not _b7p_a['actualImages']
assert all(value is True for value in _b7p_a['protectionChecks'].values())
_b7p_result = runpy.run_path(str(_b7p_helper))['run'](nsB1r6, authorized=True, mode='probe', expected_helper_sha256=_b7p_pin)
assert _b7p_result['allPatchFramesActuallyRendered'] and _b7p_result['actualPatchRenders'] == 16
assert _b7p_result['actualContextRenders'] == 2 and len(_b7p_result['actualImages']) == 18
assert _b7p_result['allGuardedStatesPass'] and not _b7p_result.get('error') and not _b7p_result.get('cleanupError')
assert all(value is True for value in _b7p_result['protectionChecks'].values())
assert not _b7p_result['restorationOffenders']
assert hashlib.sha256(_b7p_audit.read_bytes()).hexdigest() == _b7p_before
assert all(hashlib.sha256(Path(row['path']).read_bytes()).hexdigest() == row['sha256'] for row in _b7p_result['actualImages'])
print('B7 actual16+context2 complete; root personal image approval remains pending', flush=True)
