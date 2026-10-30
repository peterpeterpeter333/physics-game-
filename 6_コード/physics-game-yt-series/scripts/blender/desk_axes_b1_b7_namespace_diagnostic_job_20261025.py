"""ROOT QUEUE ONLY. Read identities/code; never invoke a model or GPU call."""
from pathlib import Path
import hashlib
import runpy

_b7nd_w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_b7nd_helper=_b7nd_w/'scripts/blender/desk_axes_b1_b7_namespace_diagnostic_20261025.py'
_b7nd_pin='f79cf17f3eec0fb9ece14495012985c419a0a1652e903f4524fb56d8abede3d8'
assert hashlib.sha256(_b7nd_helper.read_bytes()).hexdigest()==_b7nd_pin
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_b7nd_result=runpy.run_path(str(_b7nd_helper))['run'](nsB1r6,authorized=True,expected_helper_sha256=_b7nd_pin)
print('B7 read-only namespace diagnostic finished; no audit/probe/GPU/encode; original functions were not called',flush=True)
