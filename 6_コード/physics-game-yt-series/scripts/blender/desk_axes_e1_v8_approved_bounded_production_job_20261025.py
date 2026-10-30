"""Root-approved actual34 probe; bounded694-frame E production."""
import hashlib,json,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_e1_meaningful_motion_v8_owned_mesh_names_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='28e0493840bffe004f57755b4dadfac997b520a19985aab3b9f9399712d9d845'
eye=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/axes-20261023/root-e1-v8-all34-actual-probe-approval-20261025.json')
assert hashlib.sha256(eye.read_bytes()).hexdigest()=='80dbf47306580a14218da46c2334ac7274d939fd4540cf1859cff20897d14eb5'
r=json.loads(eye.read_text());assert r['approved'] and r['allRequiredProbeImagesPersonallyViewed'] and r['viewedImageCount']==34 and r['helperSha256']=='28e0493840bffe004f57755b4dadfac997b520a19985aab3b9f9399712d9d845'
assert r['probeReportSha256']=='e5f13d2acda7b0feb7eb2f3c6b0922762f260d7caff19435d1261fbadb47ddea'
runpy.run_path(str(p))['run'](nsE1,authorized=True,mode='render',approved_probe_sha256=r['probeReportSha256'],allow_temporary_unhide=True)
