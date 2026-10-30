"""NEW root r2 two-fixed-background-region controls adapter, fresh audit/probe.

Original fb3d/903a, failed131, original RGB0 and single-window NG stay intact.
Geometry, time, actual namespace, all original quality/restoration1e-9 guards
remain inherited. Root alone runs the audit before eighteen fresh controls.
"""
import ast,hashlib
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SOURCE=W/'scripts/blender/desk_axes_b1_b7_window_policy_20261025.py'
SOURCE_SHA='fb3d9ec0a8e38e86ddbf0e3980f96674e5a3d067ec316738d6fe0bd10597713b'
POLICY=W/'outputs/axes-20261023/root-b1-window-and-edge-background-policy-r2-20261025.json'
POLICY_SHA='0499ccf90a678fc4b21f35c3e699ed2f469aabcaf85262741851f0f245578d14'
COMPARE=W/'scripts/umech/compare-b1-b7-window-policy-v3-20261025.py'
COMPARE_SHA='0c8449b7751e7071274bd05e52454b2ea49748026863a418e42f5d02eb86d71e'
FAILED=Path('/private/tmp/ys/ys-chain-b1v1-b7-window-policy-v2-20261025/probe/before-controls.json')
FAILED_SHA='a40878254d36de69a283b2a351538ff18cbbb8031df3b7ac3467622cb6403af3'
FAILED_ENVELOPE=FAILED.parent/'failure.json'
FAILED_ENVELOPE_SHA='2255b332e5c32fd359d04a0393eaf66f9143c432055a6ee8525521694f9fc877'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
PINS={SOURCE:SOURCE_SHA,POLICY:POLICY_SHA,COMPARE:COMPARE_SHA,FAILED:FAILED_SHA,FAILED_ENVELOPE:FAILED_ENVELOPE_SHA,
    W/'scripts/blender/desk_axes_b1_b7_window_policy_v2_20261025.py':'903ac7bb04ab56f91ba6ae4f9ddd2b5009a4824c9d6acf4f87f7ec1a514ea133',
    W/'scripts/umech/compare-b1-b7-window-policy-v2-20261025.py':'e8f68141c27a7de90654a0dbb91ba24853f5b19403a9fab60075d5950239e36a',
    W/'scripts/umech/compare-b1-b7-window-policy-20261025.py':'4fe4e2d51abccbfc884512c776b72b1ab2e147822bcbfd0f04b72dbb40db502b',
    W/'outputs/axes-20261023/root-b1-window-only-control-policy-20261025.json':'33bb141baf253c1d501e5ce63b9298201996b4ff4efff4ddf5d05e8f10809f5b',
    Path(__file__).resolve():sha(__file__)}
def verify():
    for p,h in PINS.items():assert sha(p)==h,p
verify();original=SOURCE.read_text();text=original;boundaries=[]
def replace(before,after):
    global text
    assert text.count(before)==1,('Nonunique fixed-background-r2 boundary',before[:100])
    text=text.replace(before,after,1);boundaries.append((before,after))
replace('/private/tmp/ys/ys-chain-b1v1-b7-window-policy-20261025',
        '/private/tmp/ys/ys-chain-b1v1-b7-window-policy-v3-20261025')
replace('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-window-policy-20261025',
        '/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-window-policy-v3-20261025')
replace('root-b1-window-only-control-policy-20261025.json','root-b1-window-and-edge-background-policy-r2-20261025.json')
replace('33bb141baf253c1d501e5ce63b9298201996b4ff4efff4ddf5d05e8f10809f5b',POLICY_SHA)
replace('compare-b1-b7-window-policy-20261025.py','compare-b1-b7-window-policy-v3-20261025.py')
replace('4fe4e2d51abccbfc884512c776b72b1ab2e147822bcbfd0f04b72dbb40db502b',COMPARE_SHA)
replace('EXTRA={RECOVERY:RECOVERY_SHA,POLICY:POLICY_SHA,COMPARATOR:COMPARATOR_SHA,OLD_FAILURE:OLD_FAILURE_SHA}',
        'EXTRA={RECOVERY:RECOVERY_SHA,POLICY:POLICY_SHA,COMPARATOR:COMPARATOR_SHA,OLD_FAILURE:OLD_FAILURE_SHA}\nEXTRA.update(_FIXED_BACKGROUND_R2_PINS)')
replace("        assert policy['permittedBackgroundRectangleInclusive']==[888,0,920,109]\n        assert policy['maximumBackgroundChannelDelta']==2 and policy['maximumChangedBackgroundPixels']==500",
        "        assert [(x['rectangleInclusive'],x['maximumChannelDelta'])for x in policy['permittedBackgroundRegions']]==[([888,0,920,109],2),([1000,110,1079,255],4)]\n        assert policy['maximumChangedBackgroundPixels']==500 and policy['allPixelsOutsideBothRegionsMustRemainRgbExact']is True\n        assert policy['quantizationMustRemainIdentical']is True and policy['originalFullImageZeroDifferenceNGMustRemainRecorded']is True")
replace("return {'rootPolicy':str(POLICY),'rootPolicySha256':POLICY_SHA,'comparator':str(COMPARATOR),'comparatorSha256':COMPARATOR_SHA,",
        "return {'fixedBackgroundR2Proof':_FIXED_BACKGROUND_R2_PROOF,'rootPolicy':str(POLICY),'rootPolicySha256':POLICY_SHA,'comparator':str(COMPARATOR),'comparatorSha256':COMPARATOR_SHA,")
replace("            'approvedBackgroundRectangleInclusive':[888,0,920,109],'maximumChangedBackgroundPixels':500,'maximumBackgroundChannelDifference':2,",
        "            'approvedFixedBackgroundRegions':[{'rectangleInclusive':[888,0,920,109],'maximumChannelDelta':2},{'rectangleInclusive':[1000,110,1079,255],'maximumChannelDelta':4}],'maximumChangedBackgroundPixels':500,'allPixelsOutsideRegionUnionRgbExactRequired':True,")
inverse=text
for before,after in reversed(boundaries):
    assert inverse.count(after)==1;inverse=inverse.replace(after,before,1)
assert inverse==original;ast.parse(text)
proof={'adapter':str(Path(__file__).resolve()),'adapterSha256':sha(__file__),'retainedSource':str(SOURCE),'retainedSourceSha256':SOURCE_SHA,
    'rootPolicy':str(POLICY),'rootPolicySha256':POLICY_SHA,'actualComparator':str(COMPARE),'actualComparatorSha256':COMPARE_SHA,
    'actual131FailedReport':str(FAILED),'actual131FailedReportSha256':FAILED_SHA,
    'declaredFixedPolicyAndFreshPathBoundaries':[{'before':a,'after':b}for a,b in boundaries],
    'inverseByteExactToFrozenFb3d':True,'onlySelfAddedControlPolicyRegionsChanged':True,
    'originalFullImageZeroDifferenceAndPriorSingleWindowNGKept':True,'allGeometryTimeAndOneEMinus9GuardsUnchanged':True,
    'all18ActualProbeImagesNeedSeparateRootApproval':True,'finalAcceptance':False}
scope={'__name__':'_root_b7_fixed_background_r2_private','__file__':str(Path(__file__).resolve()),
    '_FIXED_BACKGROUND_R2_PINS':{str(p):h for p,h in PINS.items()},'_FIXED_BACKGROUND_R2_PROOF':proof}
exec(compile(text,str(SOURCE)+' [private explicit root r2 background regions]','exec'),scope)
def run(ns,authorized=False,mode='audit',*,expected_adapter_sha256,approved_audit_sha256=None):
    assert authorized is True and sha(__file__)==expected_adapter_sha256;verify()
    result=scope['run'](ns,authorized=True,mode=mode,expected_adapter_sha256=expected_adapter_sha256,
        approved_audit_sha256=approved_audit_sha256)
    verify();return result
