"""Root's queued zero-render replay of exact final encoded D candidate states."""
from pathlib import Path
import hashlib
import runpy

_d4w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_d4p=_d4w/'scripts/blender/desk_axes_d1_complete_v4_delivered_supplement_20261025.py'
assert hashlib.sha256(_d4p.read_bytes()).hexdigest()=='d18ae16ac335ab12c2bd209b3a0eb526f92dba5cbd5f933b7087eff0107f6b60'
_d4c='/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025'
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_d4r=runpy.run_path(str(_d4p))['run'](nsD1,authorized=True,cache=_d4c)
assert _d4r['renders']==0 and _d4r['exactDeliveredSourcesAndPosesUsed']
print('D exact delivered546-case numerical replay complete; no eye/ear/acceptance claim',flush=True)
