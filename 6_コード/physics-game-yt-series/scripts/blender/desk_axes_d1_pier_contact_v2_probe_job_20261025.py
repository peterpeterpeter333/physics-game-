"""Root queue entry only; require actual105 before fresh5+2+2 pier probes."""
from pathlib import Path
import hashlib
import json
import runpy

_d1pv_w=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
_d1pv_helper=_d1pv_w/'scripts/blender/desk_axes_d1_pier_contact_images_v2_20261025.py'
_d1pv_recovery=_d1pv_w/'scripts/blender/desk_axes_d1_pier_contact_replay_v2_20261025.py'
_d1pv_out=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v2-20261025')
_d1pv_diagnostic=_d1pv_out/'diagnostic/report.json'
def _d1pv_sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def _d1pv_read(p):return json.loads(Path(p).read_text())
def _d1pv_write(p,x):
    with Path(p).open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
assert _d1pv_sha(_d1pv_helper)=='91ac6c70b120fdf8474336381f367e939ddade202515e6feb5db7366a04b5211'
assert _d1pv_sha(_d1pv_recovery)=='150a4bca4f8bd0f6c42077afb7b27d6d99f76aac6f1004a56a5b0be43441796c'
assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
_d1pv_module=runpy.run_path(str(_d1pv_helper)) # inert definitions only
_d1pv_diagnostic_sha256=_d1pv_sha(_d1pv_diagnostic)
_d1pv_pins=_d1pv_module['diagnostic_pins'](_d1pv_diagnostic_sha256)
assert _d1pv_read(_d1pv_diagnostic)['allScenarioFullRestorationsPass']
_d1pv_pins.update({str(_d1pv_helper):_d1pv_sha(_d1pv_helper),str(_d1pv_recovery):_d1pv_sha(_d1pv_recovery)})
# The strict105 file/sidecar checks above precede the first nsD1 access.
_d1pv_write(_d1pv_out/'root-probe-preflight.json',{'episode':'D-1','entrySha256':_d1pv_sha(__file__),
    'actual105Diagnostic':str(_d1pv_diagnostic),'actual105DiagnosticSha256':_d1pv_diagnostic_sha256,
    'requiredStrictDiagnosticInputs':_d1pv_pins,'namespaceNotOpenedBeforeDiagnosticGuards':True,
    'freshProbeOnly':True,'old103NotAcceptedOrReused':True,'automaticApproval':False,'finalAcceptance':False})
_d1pv_result=_d1pv_module['run'](nsD1,authorized=True,mode='probe',recovery_diagnostic_sha256=_d1pv_diagnostic_sha256)
assert _d1pv_result['helperSha256']==_d1pv_sha(_d1pv_helper)
assert _d1pv_result['allReplacementPhysicalPass']and _d1pv_result['allRequestedActuallyRendered']
assert not _d1pv_result.get('error')and not _d1pv_result.get('cleanupError')
assert _d1pv_result['actualSources']==2062 and _d1pv_result['replacementOutputs']==5004
assert len(_d1pv_result['physical'])==2062 and all(r['pass']for r in _d1pv_result['physical'])
assert len(_d1pv_result['actualImages'])==5 and len(_d1pv_result['newProblemRawImages'])==2 and len(_d1pv_result['newEngineCatalogImages'])==2
assert _d1pv_result['protectionChecks']and all(v is True for v in _d1pv_result['protectionChecks'].values())
_d1pv_completion=_d1pv_out/'probe/v2-adapter-completion.json';_d1pv_c=_d1pv_read(_d1pv_completion)
assert _d1pv_c['adapterSha256']==_d1pv_sha(_d1pv_helper)and _d1pv_c['actual105DiagnosticSha256']==_d1pv_diagnostic_sha256
assert _d1pv_c['extraPinsUnchanged']and _d1pv_c['strictCompleteTransformRestorationPassed']and not _d1pv_c['error']
assert _d1pv_c['frozenRunReportSha256']==_d1pv_sha(_d1pv_out/'probe/report.json')
assert _d1pv_c['completeTransformRestorationEvidence']and all(c['fullReport']['allPass']and all(c['fullReport']['protectionChecks'].values())for c in _d1pv_c['completeTransformRestorationEvidence'])
_d1pv_images=_d1pv_result['actualImages']+_d1pv_result['newProblemRawImages']+_d1pv_result['newEngineCatalogImages']
assert all(_d1pv_sha(r['path'])==r['sha256']for r in _d1pv_images)
assert all(_d1pv_sha(p)==h for p,h in _d1pv_pins.items())
_d1pv_write(_d1pv_out/'root-probe-receipt.json',{'episode':'D-1','probeReport':str(_d1pv_out/'probe/report.json'),
    'probeReportSha256':_d1pv_sha(_d1pv_out/'probe/report.json'),'adapterCompletionSha256':_d1pv_sha(_d1pv_completion),
    'actual105DiagnosticSha256':_d1pv_diagnostic_sha256,'actualImages':_d1pv_images,
    'all2062PhysicalStatesAnd5004OutputsPass':True,'allNineRequestedActualImagesPresent':True,
    'strictCompleteTransformRestorationPassed':True,'rootPersonalVisualApprovalPending':True,
    'oldFailed103PreservedNotApproved':True,'automaticApproval':False,'finalAcceptance':False})
print('D-1 pier-v2 strict actual5+problem2+catalog2 ready; root actual-image approval remains required',flush=True)
