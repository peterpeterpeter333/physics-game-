"""Root-only numerical audit of the integrated B candidate; zero image draw."""
from pathlib import Path
import hashlib,runpy
_b6_audit_source=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_integrated_b6_20261024.py')
_b6_b4_report=Path('/private/tmp/ys/ys-chain-b1v1-camera-size-b4-20261024/probe/report.json')
_b6_b5_report=Path('/private/tmp/ys/ys-chain-b1v1-repel-b5-v3-20261024/probe/report.json')
assert hashlib.sha256(_b6_audit_source.read_bytes()).hexdigest()=='ebf86330b46eea0972461786ddc8f2e911152530bf381e0e18c7a222f4643c4d'
runpy.run_path(str(_b6_audit_source))['run'](nsB1r6,authorized=True,mode='audit',
    b4_probe_sha256=hashlib.sha256(_b6_b4_report.read_bytes()).hexdigest(),
    b5_probe_sha256=hashlib.sha256(_b6_b5_report.read_bytes()).hexdigest())
