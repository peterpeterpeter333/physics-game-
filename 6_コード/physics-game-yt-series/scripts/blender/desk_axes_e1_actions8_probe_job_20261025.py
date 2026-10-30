"""Root-only actual eight probes; this does not authorize the full action render."""
import hashlib
from pathlib import Path
import runpy

_e1a_w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_e1a_p=_e1a_w/'scripts/blender/desk_axes_e1_actions_final_20261024.py'
assert hashlib.sha256(_e1a_p.read_bytes()).hexdigest()=='e74ac58891ff2768dab426974b71a5207a07f0a207ef25575e6fee658bd5cd83'
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_e1a_r=runpy.run_path(str(_e1a_p))['run'](nsE1,authorized=True,mode='probe')
assert _e1a_r['allGuardedStatesPass']and all(_e1a_r['protectionChecks'].values())
print('E action8 actual probes ready; root image review required before full render',flush=True)
