"""Read-only D/E runtime diagnoses. No render and no guard relaxation."""
import hashlib,runpy
from pathlib import Path
w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
p=w/'scripts/blender/desk_axes_d1_restore_diagnostic_v2_20261024.py'
assert hashlib.sha256(p.read_bytes()).hexdigest()=='4dd32e6b348168263bbd4d79c9cb643f97374cba77ea3e7d29e8cb3c4f761b48'
runpy.run_path(str(p))['diagnose'](nsD1,authorized=True)
p=w/'scripts/blender/desk_axes_e1_restore_renderer_v2_20261024.py'
assert hashlib.sha256(p.read_bytes()).hexdigest()=='394e207a69a490aa513284b6c236af958247c728ff3efc141b0f5556ed37b1ed'
runpy.run_path(str(p))['run'](nsE1)
