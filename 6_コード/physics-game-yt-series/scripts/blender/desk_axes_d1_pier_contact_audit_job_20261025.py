"""Root-only queued audit; no render or existing source/media modification."""
import hashlib
from pathlib import Path
import runpy

_d1pa_w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_d1pa_helper = _d1pa_w/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py'
assert hashlib.sha256(_d1pa_helper.read_bytes()).hexdigest() == '7e6c0c3dfb26427a996a1869ab13ea7f69c17b2c39784a827ee5e82dd083768a'
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_d1pa_result = runpy.run_path(str(_d1pa_helper))['run'](nsD1, authorized=True)
assert _d1pa_result['renders'] == 0 and not _d1pa_result['fullSourceReplayPending']
assert _d1pa_result['all12163OutputsJoinedExactly']
assert all(_d1pa_result['protectionChecks'].values())
assert _d1pa_result['allGuardedStatesPass'], _d1pa_result['failedRepresentatives']
print('D actual-source pier contact numerical audit complete; new actual probe/approval still required', flush=True)
