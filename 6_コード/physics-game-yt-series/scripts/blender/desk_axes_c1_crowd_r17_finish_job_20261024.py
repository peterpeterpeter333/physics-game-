"""42 corrected paper/crowd frames after root and peer saw the four probes."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_c1_crowd_hold_r17.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='237841f4ce377f066490ba1779fdaf910837d3ffe2e61aeb40cf7e347dad32c5'
q=Path('/private/tmp/ys/ys-chain-c1v1-crowd-r17-trial/human-qa.json')
assert hashlib.sha256(q.read_bytes()).hexdigest()=='6cb7117db763ffe3951318b0bb78ae815952a2fe158e996983ca792aa29b0622'
runpy.run_path(str(p))['finish'](nsC1)
