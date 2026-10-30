"""Read-only physical measurement after C's complete frozen production."""
import hashlib,runpy,json
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_c1_final_halfsecond_bounds.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='e33a5a0b31eba44d42ab4317f741df56d91d623516fe114e27d95d4bd296bb66'
out=Path('/private/tmp/ys/ys-chain-c1v1/c1-final-held-halfsecond-bounds.json')
if out.exists():
    old=json.loads(out.read_text());assert old['sampleCount']==721 and old['productionUniqueStates']==4317
    print('C physical audit already complete; existing evidence preserved')
else:runpy.run_path(str(p))['audit'](nsC1)
