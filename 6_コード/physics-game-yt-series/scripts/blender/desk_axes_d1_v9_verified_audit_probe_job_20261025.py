"""Root DOF-only actual audit then30 fresh probes; no visual approval inferred."""
import hashlib,json,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_camera_readability_v9_verified_20261025.py')
h='0c8a3b394ae877ec08b0db709864e18b4f6cfe053199ae522261252cf14cc419'
assert hashlib.sha256(p.read_bytes()).hexdigest()==h
helper=runpy.run_path(str(p))
helper['run_camera'](nsD1,authorized=True,mode='audit')
audit=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v9-verified-20261025/audit/report.json')
a=json.loads(audit.read_text())
assert a['allReplacementPhysicalPass'] and not a.get('error') and not a.get('cleanupError')
assert all(a['protectionChecks'].values()) and a['entryDofRestorationPassed']
assert a['actualSources']==428 and a['replacementOutputs']==948
helper['run_camera'](nsD1,authorized=True,mode='probe',audit_report_sha256=hashlib.sha256(audit.read_bytes()).hexdigest())
