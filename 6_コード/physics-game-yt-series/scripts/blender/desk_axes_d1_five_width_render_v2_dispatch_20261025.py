import hashlib
import json
import runpy
from pathlib import Path

_w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_source=_w/'scripts/blender/desk_axes_d1_five_width_probe_job_v2_20261025.py'
assert hashlib.sha256(_source.read_bytes()).hexdigest()=='6a98c13e2ac68a696753f100117f4b0c01ebe9ef921cc51bd2c8696398c391b3'
_review=json.loads((_w/'outputs/axes-20261023/d1-five-width-six-composites-root-review-20261025.json').read_text())
assert _review['approvedFor149FrameRender'] and _review['actualCompletePngsIndividuallyViewed']==[1242,1260,1269,3709,4007,4008]
_api=runpy.run_path(str(_source))
_api['run'](nsD1,authorized=True,mode='render',audit_sha256='328a5def747cb2af8ea3fe826fa9d4eae5f474de5aaf6d93046a1d83179e49f5',probe_sha256='a52cfc91118225b362e343f26464859e41501f3adb10638e55679914bf251c19')
