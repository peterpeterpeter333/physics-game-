"""Root-approved actual30 v9 production with explicit audit/probe/eye pins."""
import hashlib,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_camera_readability_v9_verified_20261025.py')
assert hashlib.sha256(p.read_bytes()).hexdigest()=='0c8a3b394ae877ec08b0db709864e18b4f6cfe053199ae522261252cf14cc419'
runpy.run_path(str(p))['run_camera'](nsD1,authorized=True,mode='render',audit_report_sha256='d45aa03fad6f31b1c808ec274da40d3674711a8bb1bb39d8b28c743ce43b1f10',probe_report_sha256='8d20eb27b398a46141e6aff6ddd0af876ec49f1b2a28641bf32b2426048375f8',root_visual_receipt='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/axes-20261023/root-d1-v9-verified-all30-actual-probe-audit-bound-approval-20261025.json',root_visual_receipt_sha256='f1b65f0355c021c228e2e0ee226677cd13906e2d8db51a1f82a4b7a93c50227d')
