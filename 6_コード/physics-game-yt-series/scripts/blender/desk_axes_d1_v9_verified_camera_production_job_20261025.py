"""Root-approved actual30-image v9 readable-camera production."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_camera_readability_v9_verified_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='0c8a3b394ae877ec08b0db709864e18b4f6cfe053199ae522261252cf14cc419'
runpy.run_path(str(p))['run_camera'](nsD1,authorized=True,mode='render',probe_report_sha256='8d20eb27b398a46141e6aff6ddd0af876ec49f1b2a28641bf32b2426048375f8',root_visual_receipt='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/axes-20261023/root-d1-v9-verified-all30-actual-probe-approval-20261025.json',root_visual_receipt_sha256='414100e06063f2b1aa756687fce80fc28c8b2096612574bab33a61953f0698c9')
