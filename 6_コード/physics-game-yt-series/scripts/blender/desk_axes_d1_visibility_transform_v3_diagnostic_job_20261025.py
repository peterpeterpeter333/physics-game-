"""Root only: exact saved-visibility + strict transform, zero-render diagnosis."""
from pathlib import Path
import hashlib
import runpy

_d1v3_w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_d1v3_h=_d1v3_w/'scripts/blender/desk_axes_d1_pier_contact_replay_v3_20261025.py'
assert hashlib.sha256(_d1v3_h.read_bytes()).hexdigest()=='c2affda7bb6287c50d99f7badfb2bbf936acbe725fb74de6b94410557f440e2a'
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_d1v3_result=runpy.run_path(str(_d1v3_h))['diagnostic'](nsD1,authorized=True)
assert _d1v3_result['renders']==0 and _d1v3_result['allScenarioFullRestorationsPass']
assert len(_d1v3_result['scenarios'])==6 and not _d1v3_result.get('error') and not _d1v3_result.get('cleanupError')
assert all(v is True for v in _d1v3_result['protectionChecks'].values())
assert _d1v3_result['allPinnedSourcesAndFailed105EvidenceUnchanged']
print('D-1 v3 actual six-scenario strict saved visibility+transform PASS; zero renders',flush=True)
