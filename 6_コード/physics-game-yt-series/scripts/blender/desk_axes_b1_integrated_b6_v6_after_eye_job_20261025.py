"""Root queue item: a human-written actual-probe approval must precede full render.

Waiting never creates an approval. Timeout leaves the attempt failed and moves
the queue on; source, probe, previous failures and inspectors are preserved.
"""
from pathlib import Path
import hashlib
import json
import runpy
import time

_b6w = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_b6h = _b6w / 'scripts/blender/desk_axes_b1_integrated_b6_v6_20261024.py'
_b6pin = 'bbcd5af4926fbccde672c6601b11362d6f18a72619fc1fd1daa628e25c218e61'
_b6probe = Path('/private/tmp/ys/ys-chain-b1v1-integrated-b6-v6-20261024/probe/report.json')
_b6eye = _b6w / 'outputs/axes-20261023/root-b6v6-probe20-eye-approval-20261025.json'
_b6sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert _b6sha(_b6h) == _b6pin
assert _b6probe.is_file(), 'The actual20-probe run must have finished first'
_b6pr = json.loads(_b6probe.read_text())
assert _b6pr['helperSha256'] == _b6pin and len(_b6pr['actualImages']) == 20
_b6deadline = time.monotonic() + 300
print('Waiting up to300s for root actual20-probe visual receipt; no automatic approval', flush=True)
while not _b6eye.is_file():
    assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists(), 'User cancellation'
    assert time.monotonic() < _b6deadline, 'Actual20-probe visual receipt not supplied; no full render authorized'
    time.sleep(.5)
_b6approval = json.loads(_b6eye.read_text())
assert _b6approval['helperSha256'] == _b6pin
assert _b6approval['probeReportSha256'] == _b6sha(_b6probe)
assert _b6approval['allTwentyActualProbesTeamViewed'] is True
assert _b6approval['concreteDefectsRemaining'] == 0
assert _b6approval['approvedForIntegratedRender'] is True
assert _b6approval['finalAcceptance'] is False
assert _b6approval['probeActualImages'] == [
    {'frame': r['frame'], 'path': r['path'], 'sha256': r['sha256']}
    for r in _b6pr['actualImages']
]
assert all(_b6sha(r['path']) == r['sha256'] for r in _b6pr['actualImages'])
runpy.run_path(str(_b6h))['run'](
    nsB1r6, authorized=True, mode='render',
    b4_probe_sha256='5bae5a0335fbe6b14555560e386315764b58eba42e24d85e5bd08bdcc81d9c53',
    b5_probe_sha256='69f680bda23b6e30ca9a6272cd34009777683065aca4bc0661f342f1e8f460c5',
    dependency_probes_visually_approved=True, visually_approved=True,
    probe_report_sha256=_b6sha(_b6probe))
