"""Root-authorized actual probes following successful exact5074-state audit."""
import hashlib
from pathlib import Path
import runpy

_d1pp_w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_d1pp_h=_d1pp_w/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py'
assert hashlib.sha256(_d1pp_h.read_bytes()).hexdigest()=='4e9d41accb35d8a31211a65c3ce76740a7e07dc81d021a6a2e2bc0e114b0b479'
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_d1pp_r=runpy.run_path(str(_d1pp_h))['run'](nsD1,authorized=True,mode='probe',audit_report_sha256='668208ecbd577fe5fb1ba2963f7c0f80ba9add7d1ebaa75988e019c603328e82')
assert _d1pp_r['allReplacementPhysicalPass']and _d1pp_r['allRequestedActuallyRendered']
assert all(_d1pp_r['protectionChecks'].values())
print('D pier actual probe images ready; root personal image approval required before full render',flush=True)
