"""Root queue only: zero-render audit of the sixteen-frame B7 carry."""
from pathlib import Path
import hashlib
import runpy

_b7a_w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_b7a_helper = _b7a_w/'scripts/blender/desk_axes_b1_sixth_needle_carry_b7_20261025.py'
_b7a_pin = 'd1736e949348256273198cc181bfc2abe42125f9b8139b8bb466867dc8bc1e54'
assert hashlib.sha256(_b7a_helper.read_bytes()).hexdigest() == _b7a_pin
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_b7a_result = runpy.run_path(str(_b7a_helper))['run'](nsB1r6, authorized=True, mode='audit', expected_helper_sha256=_b7a_pin)
assert _b7a_result['replacementOutputs'] == _b7a_result['actualSources'] == 16
assert _b7a_result['actualGuardedStates'] == 18 and not _b7a_result['actualImages']
assert _b7a_result['allGuardedStatesPass'] and not _b7a_result.get('error') and not _b7a_result.get('cleanupError')
assert all(value is True for value in _b7a_result['protectionChecks'].values())
assert not _b7a_result['restorationOffenders']
print('B7 zero-render18-state audit PASS; actual probe/eyes remain pending', flush=True)
