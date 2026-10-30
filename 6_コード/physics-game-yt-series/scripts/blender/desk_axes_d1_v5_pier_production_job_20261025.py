"""Root production of the nine-image visually approved three-pier repair."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_verified_v5_adapters_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='f518e79055a897c63d2c5a089abad0d6f8725926f9ab7032ba92d0795e81f464'
runpy.run_path(str(p))['run_pier'](nsD1,authorized=True,mode='render',probe_report_sha256='4b58375cfd358900c30b68d1230255b9587185bff2f056c7f5e2b6fdb0653bde',root_probe_visual_receipt='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/axes-20261023/root-d1-v5-pier9-actual-probe-approval-20261025.json',root_probe_visual_receipt_sha256='1591543b134c37d27690bcca1ac1da7f3dea7219574c351eed8a04b85fe43611')
