"""Production only after the strict restore, water intent and real probe QA."""
import hashlib,json,runpy
from pathlib import Path
w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
c=Path('/private/tmp/ys/ys-chain-d1v1-render')
proof=json.loads((c/'d1-runtime-water-derivative-v4-20261024.json').read_text())
intent=json.loads((c/'d1-water-intent-after-v4-20261024.json').read_text())
assert proof['installed'] and proof['heldFailures']==[] and intent['passed'] and intent['maximumDifferenceMeters']<=1e-5
gD=nsD1['main'].__globals__
assert gD['mine_state'] is nsD1['D1_WATER_CENTER_V4']['wrapper']
assert nsD1['D1_WATER_CENTER_V4']['helperSha256']=='7ec8ee0c86872a47de4b505fb469d08e8055fd69528fdcba0c5884677f15fcb6'
qa=w/'docs/video-revision-20260924/deep/D-1_v4_水位3枚実目視_20261024.json'
assert qa.is_file(),'Real water probe visual review is required'
runpy.run_path(str(w/'scripts/blender/desk_axes_d1_r15_production.py'),init_globals={'nsD1':nsD1,'D1_PRODUCTION_AUTHORIZED':True,'D1_RENDER_NOW':True})
p=w/'scripts/blender/desk_axes_d1_camera_patch_20261024.py'
assert hashlib.sha256(p.read_bytes()).hexdigest()=='0ab032966bae0acdf9788df05118c8373d345cadca304f2447d01a0a55fcbdfa'
runpy.run_path(str(p))['run'](nsD1,authorized=True,mode='render')
