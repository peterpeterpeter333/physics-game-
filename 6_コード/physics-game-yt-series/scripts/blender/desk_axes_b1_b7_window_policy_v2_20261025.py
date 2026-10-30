"""NEW metadata-only B127 compatibility fix, fresh audit/controls/probes.

Original fb3d/4fe/failed127 are pinned and unchanged. The CPU comparison adds
only comparisonMethod required by the retained progress print. Every numeric
result, background policy, full-image0RGB false flag and strict guard is kept.
"""
import ast
import hashlib
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SOURCE=W/'scripts/blender/desk_axes_b1_b7_window_policy_20261025.py'
SOURCE_SHA='fb3d9ec0a8e38e86ddbf0e3980f96674e5a3d067ec316738d6fe0bd10597713b'
OLD_COMPARE=W/'scripts/umech/compare-b1-b7-window-policy-20261025.py'
OLD_COMPARE_SHA='4fe4e2d51abccbfc884512c776b72b1ab2e147822bcbfd0f04b72dbb40db502b'
COMPARE=W/'scripts/umech/compare-b1-b7-window-policy-v2-20261025.py'
COMPARE_SHA='e8f68141c27a7de90654a0dbb91ba24853f5b19403a9fab60075d5950239e36a'
FAILED=Path('/private/tmp/ys/ys-chain-b1v1-b7-window-policy-20261025/probe/before-controls.json')
FAILED_SHA='640b6ffc5bd3ce3f09c084ee03789ddb1a40489ee24f3632d352d066aa651243'
FAILED_ENVELOPE=FAILED.parent/'failure.json'
FAILED_ENVELOPE_SHA='5eb69e13d52a53ffbec6cad5540c4a7a998a99c5f520f5984e3353d432a7fae6'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
PINS={SOURCE:SOURCE_SHA,OLD_COMPARE:OLD_COMPARE_SHA,COMPARE:COMPARE_SHA,
    FAILED:FAILED_SHA,FAILED_ENVELOPE:FAILED_ENVELOPE_SHA,Path(__file__).resolve():sha(__file__)}
def verify():
    for p,h in PINS.items():assert sha(p)==h,p
verify();original=SOURCE.read_text();text=original;boundaries=[]
def replace(before,after):
    global text
    assert text.count(before)==1,('Nonunique metadata-v2 boundary',before[:100])
    text=text.replace(before,after,1);boundaries.append((before,after))
replace('/private/tmp/ys/ys-chain-b1v1-b7-window-policy-20261025',
        '/private/tmp/ys/ys-chain-b1v1-b7-window-policy-v2-20261025')
replace('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-window-policy-20261025',
        '/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-window-policy-v2-20261025')
replace('compare-b1-b7-window-policy-20261025.py','compare-b1-b7-window-policy-v2-20261025.py')
replace(OLD_COMPARE_SHA,COMPARE_SHA)
replace('EXTRA={RECOVERY:RECOVERY_SHA,POLICY:POLICY_SHA,COMPARATOR:COMPARATOR_SHA,OLD_FAILURE:OLD_FAILURE_SHA}',
        'EXTRA={RECOVERY:RECOVERY_SHA,POLICY:POLICY_SHA,COMPARATOR:COMPARATOR_SHA,OLD_FAILURE:OLD_FAILURE_SHA}\nEXTRA.update(_PRINT_METADATA_V2_PINS)')
replace("return {'rootPolicy':str(POLICY),'rootPolicySha256':POLICY_SHA,'comparator':str(COMPARATOR),'comparatorSha256':COMPARATOR_SHA,",
        "return {'printMetadataOnlyV2':_PRINT_METADATA_V2_PROOF,'rootPolicy':str(POLICY),'rootPolicySha256':POLICY_SHA,'comparator':str(COMPARATOR),'comparatorSha256':COMPARATOR_SHA,")
inverse=text
for before,after in reversed(boundaries):
    assert inverse.count(after)==1;inverse=inverse.replace(after,before,1)
assert inverse==original;ast.parse(text)
proof={'adapter':str(Path(__file__).resolve()),'adapterSha256':sha(__file__),'retainedSource':str(SOURCE),'retainedSourceSha256':SOURCE_SHA,
    'oldNumericComparator':str(OLD_COMPARE),'oldNumericComparatorSha256':OLD_COMPARE_SHA,
    'newPrintFieldComparator':str(COMPARE),'newPrintFieldComparatorSha256':COMPARE_SHA,
    'actual127FailedReport':str(FAILED),'actual127FailedReportSha256':FAILED_SHA,
    'declaredMetadataAndFreshPathBoundaries':[{'before':a,'after':b}for a,b in boundaries],
    'inverseByteExactToFrozenFb3d':True,'onlyComparisonMethodAddedToEachUnchangedNumericResult':True,
    'originalFullImageZeroDifferenceResultAndNGKept':True,'allGeometryPolicyTimeAndOneEMinus9GuardsUnchanged':True,
    'actual127StrictCleanupPassButPrintFailureRetained':True,'finalAcceptance':False}
scope={'__name__':'_root_b7_window_policy_v2_private','__file__':str(Path(__file__).resolve()),
    '_PRINT_METADATA_V2_PINS':{str(p):h for p,h in PINS.items()},'_PRINT_METADATA_V2_PROOF':proof}
exec(compile(text,str(SOURCE)+' [private fresh-path/print-metadata only]','exec'),scope)
def run(ns,authorized=False,mode='audit',*,expected_adapter_sha256,approved_audit_sha256=None):
    assert authorized is True and sha(__file__)==expected_adapter_sha256;verify()
    result=scope['run'](ns,authorized=True,mode=mode,expected_adapter_sha256=expected_adapter_sha256,
        approved_audit_sha256=approved_audit_sha256)
    verify();return result
