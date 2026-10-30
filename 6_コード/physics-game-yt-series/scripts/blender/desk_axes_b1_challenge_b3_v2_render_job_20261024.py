"""Only the 99 approved actual challenge states; B2 sources stay intact."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_challenge_b3_v2_20261024.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='0dfd82d653f1f13c9c7b76510cc62f337f0fabbb82b9339cd71f8b400b1bae5e'
runpy.run_path(str(p))['run'](nsB1r6,authorized=True,mode='render',visually_approved=True,probe_report_sha256='1cb209cca6b3431e3e9340f8f1800d17798624acb4b9e84c076f4e176dd33548')
