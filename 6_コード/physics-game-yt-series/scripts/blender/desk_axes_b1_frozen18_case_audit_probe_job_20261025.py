"""Root-approved exact137 cases; one fresh audit and one18-image carry probe."""
import hashlib,json,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_b7_frozen_control_cases_20261025.py')
h='a4f42d9c6e8d8ade1f90d3625fe1848a9446cb29cb60558a7a201b5351fced3b'
assert hashlib.sha256(p.read_bytes()).hexdigest()==h
api=runpy.run_path(str(p))['run']
args=dict(expected_adapter_sha256=h,summary_sha256='af396dc21c8d0528e081e0e625b3327a233a828dd2e355ed8a16a2e1a87d6582',root_approval='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/axes-20261023/root-b1-137-exact18-control-case-approval-20261025.json',root_approval_sha256='3a595616bff081701ba479b8349a74849cf787512a6c15503ce974c127f5b5c6')
a=api(nsB1r6,authorized=True,mode='audit',**args)
assert a['allGuardedStatesPass'] and not a.get('error') and all(v is True for v in a['protectionChecks'].values())
audit=Path('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-frozen-control-cases-20261025/audit/report.json')
api(nsB1r6,authorized=True,mode='probe',approved_audit_sha256=hashlib.sha256(audit.read_bytes()).hexdigest(),**args)
