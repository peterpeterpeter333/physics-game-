"""Verify intended water height/centres after successful strict restore, no GPU."""
import hashlib,json,runpy
from pathlib import Path
assert json.loads(Path('/private/tmp/ys/axes-active-queue/job-058-d1-strict-restore-only.done.json').read_text())['status']=='done'
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_water_intent_check_20261024.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='5992d382457a9c7f0c5ff558bfbca93458b8c3917851c5beaa64cb1c3e14ce3a'
runpy.run_path(str(p))['check'](nsD1,authorized=True)
