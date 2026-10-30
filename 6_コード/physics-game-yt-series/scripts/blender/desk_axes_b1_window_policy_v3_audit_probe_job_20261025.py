"""Root strict fresh audit then eighteen actual probes; no eye approval inferred."""
import hashlib,json,runpy
from pathlib import Path
p=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_b7_window_policy_v3_20261025.py')
h='fdb6858923fcad77b282014cde20829f3f27f6dcdfb3785a15299bbc7e8366b8'
assert hashlib.sha256(p.read_bytes()).hexdigest()==h
helper=runpy.run_path(str(p))
helper['run'](nsB1r6,authorized=True,mode='audit',expected_adapter_sha256=h)
audit=Path('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-window-policy-v3-20261025/audit/report.json')
a=json.loads(audit.read_text())
assert a['allGuardedStatesPass'] and a['cleanupError'] is None and not a.get('error')
assert all(a['protectionChecks'].values()) and not a['restorationOffenders']
helper['run'](nsB1r6,authorized=True,mode='probe',expected_adapter_sha256=h,approved_audit_sha256=hashlib.sha256(audit.read_bytes()).hexdigest())
