"""Root queue only: require actual105 strict recovery before camera audit.

This is an entry file, not a queue submission. It never renders or encodes.
"""
from pathlib import Path
import hashlib
import json
import runpy

_d1ca_w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_d1ca_camera=_d1ca_w/'scripts/blender/desk_axes_d1_four_cue_camera_20261025.py'
_d1ca_recovery=_d1ca_w/'scripts/blender/desk_axes_d1_pier_contact_replay_v2_20261025.py'
_d1ca_diag=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v2-20261025/diagnostic/report.json')
_d1ca_pier=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-20261025/audit/report.json')
_d1ca_out=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-20261025')
def _d1ca_sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def _d1ca_read(p):return json.loads(Path(p).read_text())
def _d1ca_write(p,x):
    with Path(p).open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
assert _d1ca_sha(_d1ca_camera)=='9624c1496089b41d22e7b2321515a7fec2847506685e24d64726259e48c37e00'
assert _d1ca_sha(_d1ca_recovery)=='150a4bca4f8bd0f6c42077afb7b27d6d99f76aac6f1004a56a5b0be43441796c'
assert _d1ca_sha(_d1ca_pier)=='668208ecbd577fe5fb1ba2963f7c0f80ba9add7d1ebaa75988e019c603328e82'
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
# No episode namespace is accessed or opened until the actual105 receipt passes.
_d1ca_d=_d1ca_read(_d1ca_diag)
assert _d1ca_d['helperSha256']==_d1ca_sha(_d1ca_recovery)
assert _d1ca_d['renders']==0 and _d1ca_d['allScenarioFullRestorationsPass']
assert not _d1ca_d.get('error')and not _d1ca_d.get('cleanupError')
assert _d1ca_d['protectionChecks']and all(v is True for v in _d1ca_d['protectionChecks'].values())
assert len(_d1ca_d['scenarios'])==6 and all(r['newFullRestorePass']and not r['newFullRestoreOffenders']for r in _d1ca_d['scenarios'])
_d1ca_transform=_d1ca_d['transformRestorationReport']
assert _d1ca_sha(_d1ca_transform['path'])==_d1ca_transform['sha256']
_d1ca_t=_d1ca_read(_d1ca_transform['path'])
assert _d1ca_t['allPass']and _d1ca_t['toleranceUnchanged']==1e-9
assert _d1ca_t['protectionChecks']and all(v is True for v in _d1ca_t['protectionChecks'].values())
_d1ca_inputs={str(p):_d1ca_sha(p)for p in [_d1ca_camera,_d1ca_recovery,_d1ca_diag,_d1ca_pier,Path(_d1ca_transform['path']),Path(__file__)]}
assert not _d1ca_out.exists()and not _d1ca_out.is_symlink()
_d1ca_out.mkdir()
_d1ca_write(_d1ca_out/'root-audit-preflight.json',{'episode':'D-1','helperSha256':_d1ca_sha(__file__),
    'actual105Diagnostic':str(_d1ca_diag),'actual105DiagnosticSha256':_d1ca_sha(_d1ca_diag),
    'actual105StrictFullRestorationPassed':True,'inputSha256':_d1ca_inputs,
    'namespaceNotOpenedBeforeDiagnosticGuards':True,'renders':0,'automaticApproval':False,'finalAcceptance':False})
_d1ca_result=runpy.run_path(str(_d1ca_camera))['run'](nsD1,authorized=True,mode='audit',
    pier_audit_report_sha256='668208ecbd577fe5fb1ba2963f7c0f80ba9add7d1ebaa75988e019c603328e82')
assert _d1ca_result['renders']==0 and _d1ca_result['allReplacementPhysicalPass']
assert not _d1ca_result.get('error')and not _d1ca_result.get('cleanupError')
assert _d1ca_result['protectionChecks']and all(v is True for v in _d1ca_result['protectionChecks'].values())
assert _d1ca_result['pierOutputIntersection']==[]
assert len(_d1ca_result['deliveredCameraPoses'])==12163
assert _d1ca_result['cameraMotion']['moving_ratio']<=.2 and _d1ca_result['cameraMotion']['top_ratio']<=.2
assert all(_d1ca_sha(p)==h for p,h in _d1ca_inputs.items())
_d1ca_write(_d1ca_out/'root-audit-receipt.json',{'episode':'D-1','actual105DiagnosticSha256':_d1ca_sha(_d1ca_diag),
    'auditReport':str(_d1ca_out/'audit/report.json'),'auditReportSha256':_d1ca_sha(_d1ca_out/'audit/report.json'),
    'allSourcePhysicalPass':True,'sourceAndGuardInputsUnchanged':True,'actualSources':_d1ca_result['actualSources'],
    'replacementOutputs':_d1ca_result['replacementOutputs'],'renders':0,'newProbeEyesPending':True,
    'automaticApproval':False,'finalAcceptance':False})
print('D-1 four-cue fixed-phase camera numerical audit PASS; actual probe/approval still required',flush=True)
