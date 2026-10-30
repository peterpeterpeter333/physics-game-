"""NEW root-authorized control9540 case; no global RGB tolerance is added.

The frozen v4 whole-image RGB comparison remains truthful, including its NG.
Only a separately pinned root policy can accept <=100 changed pixels, max2,
inside frame9540's16x16 far-right background heading; every other pixel is0.
Controls380/450/9249 still require whole-image RGB0. All geometry, original
one-second motion, camera, speech/captions and1e-9 transaction guards remain.
"""
import ast
import hashlib
import json
from pathlib import Path
import subprocess

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SOURCE=W/'scripts/blender/desk_axes_e1_meaningful_motion_v4_20261025.py'
SOURCE_SHA='cd16376760a4382fcf4827a8e89a8d01258ef0d6fbba877e4013a8f79b3ecfb5'
CASE_COMPARE=W/'scripts/umech/compare-e1-control9540-authorized-case-20261025.py'
CASE_COMPARE_SHA='9874bd85abd5dd231c9b4c0096cd222e2454c655272c4156076c56619e7a1cf5'
POLICY=W/'outputs/axes-20261023/root-e1-control9540-right-edge-only-policy-20261025.json'
POLICY_SHA='ea531690764903269fc19de77b4efe3addcc2eac8c7f25bba094b64047d5b0a1'
ANALYSIS=W/'outputs/axes-20261023/e1-actual124-control9540-rightedge-background-independent-20261025.json'
ANALYSIS_SHA='7d2d4cb5d7a529e7d159e4c6500eef12543cd0c2e089577c0ba878acde6b69e4'
FAILED=Path('/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v4-20261025/probe/report.json')
FAILED_SHA='8a8e252833896f216c992474198dff14a36f1529e30e848de3c301d5b2e37a2c'
def _sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()
_pins={str(SOURCE):SOURCE_SHA,str(CASE_COMPARE):CASE_COMPARE_SHA,str(POLICY):POLICY_SHA,
       str(ANALYSIS):ANALYSIS_SHA,str(FAILED):FAILED_SHA,str(Path(__file__).resolve()):_sha(__file__)}
assert all(_sha(p)==h for p,h in _pins.items())
_policy=json.loads(POLICY.read_text())
assert _policy['supplementalControlPolicyAuthorized'] is True and _policy['actualViewer']=='root'
assert _policy['allowedControlFrame']==9540 and _policy['permittedBackgroundRectangleInclusive']==[1056,192,1071,207]
assert _policy['maximumBackgroundChannelDelta']==2 and _policy['maximumChangedBackgroundPixels']==100
assert _policy['allPixelsOutsideRectangleMustBeRgbExact'] is True
assert _policy['quantizationAndDimensionsMustRemainIdentical'] is True
assert _policy['controls3804509249MustRemainWholeImageRgbExact'] is True
assert _policy['sourceAnalysisSha256']==ANALYSIS_SHA and _policy['bothFullResolutionImagesPersonallyViewed'] is True
assert _policy['newMotionApprovalGrantedHere'] is False and _policy['finalAcceptance'] is False
_original=SOURCE.read_text()
_before_cache='/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v4-20261025'
_after_cache='/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v5-20261025'
assert _original.count(_before_cache)==1
_text=_original.replace(_before_cache,_after_cache,1)
assert _text.replace(_after_cache,_before_cache,1)==_original
_parent={'__name__':'e1_meaningful_motion_v5_parent_private','__file__':str(Path(__file__).resolve())}
exec(compile(_text,str(SOURCE)+' [private v5 fresh cache]','exec'),_parent)
# v4 outer checks and the shared v3 inner transaction both protect these pins.
_parent['_pins'].update(_pins)
_parent['_parent']['_pins'].update(_pins)
_inner=_parent['_inner']
assert all(_inner['_V3_EXTRA_PINS'].get(p)==h for p,h in _pins.items())
_original_inner=_parent['_inner_text']
_inner_text=_original_inner
_boundaries=[]
def _change(before,after):
    global _inner_text
    assert _inner_text.count(before)==1,('Nonunique v5 control boundary',before[:100])
    _inner_text=_inner_text.replace(before,after,1);_boundaries.append((before,after))
_change("            assert all(r['sourceEquivalentAgainstExistingDeliveredRaw'] and r['decodedRgbExact'] and r['decodedDifferenceMinMax']==[0,0] for r in prior['controls'])",
        "            assert all(_CONTROL_ACCEPT(r) for r in prior['controls'])")
_change("            assert record['sourceEquivalentAgainstExistingDeliveredRaw'] and record['decodedRgbExact'] and record['decodedDifferenceMinMax']==[0,0], ('Baseline replay decoded RGB control differs',j)",
        "            assert _CONTROL_ACCEPT(record), ('Baseline replay decoded RGB control or explicit9540 case differs',j)")
_inverse=_inner_text
for before,after in reversed(_boundaries):
    assert _inverse.count(after)==1;_inverse=_inverse.replace(after,before,1)
assert _inverse==_original_inner
_base_compare=_parent['_compare']

def _case_valid(result,record):
    return (record['frame']==9540 and result['frame']==9540
        and result['leftSha256']==record['expectedSha256']==_policy['actualOriginalImageSha256']
        and result['rightSha256']==record['sha256']
        and result['rgbDimensions']==[1080,1920,3] and result['quantizationExactlyEqual'] is True
        and result['decodedRgbExact'] is False and result['explicitCaseAccepted'] is True
        and result['authorizedBoundingBoxInclusive']==[1056,192,1071,207]
        and result['maximumAllowedChangedPixels']==100 and 0<result['changedPixelCount']<=100
        and result['maximumAllowedChannelDifferenceInsideCase']==2 and 0<result['maximumAbsoluteChannelDifference']<=2
        and result['allOutsideAuthorizedRectangleExactlyZero'] is True
        and result['outsideAuthorizedRectangleAllowedDifference']==0
        and result['filesWritten']==0 and result['renderOrEncodePerformed'] is False)

def _compare(record):
    result=_base_compare(record)
    result.update({'explicitCaseAccepted':False,'explicitCasePolicy':str(POLICY),'explicitCasePolicySha256':POLICY_SHA,
                   'wholeRgbZeroFailureNotRelabeled':not result['decodedRgbExact']})
    if record['frame']==9540 and not result['decodedRgbExact']:
        assert all(_sha(p)==h for p,h in _pins.items())
        child=subprocess.run([str(_parent['PYTHON']),str(CASE_COMPARE),'--left',record['expectedPath'],
            '--left-sha256',record['expectedSha256'],'--right',record['path'],'--right-sha256',record['sha256'],
            '--frame','9540'],capture_output=True,text=True,check=False)
        assert child.returncode in (0,2),('Independent9540 case decoder failed',child.stderr[:1000])
        measured=json.loads(child.stdout)
        assert measured['explicitCaseAccepted'] == (child.returncode==0)
        accepted=_case_valid(measured,record)
        assert accepted == measured['explicitCaseAccepted']
        result.update({'explicitCaseAccepted':accepted,'independentExplicitCaseComparison':measured,
                       'independentExplicitCaseDecoder':str(CASE_COMPARE),'independentExplicitCaseDecoderSha256':CASE_COMPARE_SHA,
                       'sourceEquivalentAgainstExistingDeliveredRaw':bool(result['sourceEquivalentAgainstExistingDeliveredRaw'] or accepted)})
        assert all(_sha(p)==h for p,h in _pins.items())
    return result

def _accept(record):
    assert record['frame'] in (380,450,9249,9540)
    assert _sha(record['path'])==record['sha256'] and _sha(record['expectedPath'])==record['expectedSha256']
    assert record['byteExactAgainstExistingDeliveredRaw']==(record['sha256']==record['expectedSha256'])
    exact=record['decodedRgbExact'] is True and record['decodedDifferenceMinMax']==[0,0]
    case=(record['frame']==9540 and record['decodedRgbExact'] is False
          and record.get('explicitCaseAccepted') is True
          and record.get('explicitCasePolicySha256')==POLICY_SHA
          and record.get('independentExplicitCaseDecoderSha256')==CASE_COMPARE_SHA
          and _case_valid(record['independentExplicitCaseComparison'],record))
    assert record['sourceEquivalentAgainstExistingDeliveredRaw']==bool(record['byteExactAgainstExistingDeliveredRaw'] or exact or case)
    return bool(record['sourceEquivalentAgainstExistingDeliveredRaw'] and (exact or case))

_proof={'adapter':str(Path(__file__).resolve()),'adapterSha256':_sha(__file__),'source':str(SOURCE),'sourceSha256':SOURCE_SHA,
        'freshCacheBoundaryCount':1,'exactReversibleInnerControlPredicateBoundaries':len(_boundaries),
        'inverseByteIdenticalOutsideControlPredicates':True,'rootPolicy':str(POLICY),'rootPolicySha256':POLICY_SHA,
        'oldActual124WholeRgbZeroFailurePreserved':str(FAILED),'oldActual124WholeRgbZeroFailureSha256':FAILED_SHA,
        'explicitCaseFrameOnly':9540,'explicitCaseRectangleInclusive':[1056,192,1071,207],
        'allOtherPixelsAndOtherControlsStillRequireRgbZero':True,'wholeImageRgbZeroNGNotRelabeled':True,
        'noOriginalGateWaived':True,'motionEyeApprovalNotGrantedByControlPolicy':True,'finalAcceptance':False}
_inner['_SOURCE_PROOF']['v5ExplicitRoot9540CaseProof']=_proof
_inner['_INDEPENDENT_RGB_COMPARE']=_compare
_inner['_CONTROL_ACCEPT']=_accept
_nodes=[n for n in ast.parse(_inner_text).body if isinstance(n,ast.FunctionDef) and n.name=='run']
assert len(_nodes)==1
exec(compile(ast.Module(body=_nodes,type_ignores=[]),str(SOURCE)+' [private v5 explicit9540 control predicates]','exec'),_inner)
OUT=_parent['OUT']

def run(ns,authorized=False,mode='probe',approved_probe_sha256=None,*,allow_temporary_unhide=False):
    assert authorized is True and allow_temporary_unhide is True
    assert all(_sha(p)==h for p,h in _pins.items())
    result=_parent['run'](ns,authorized=True,mode=mode,approved_probe_sha256=approved_probe_sha256,
                          allow_temporary_unhide=True)
    assert all(_sha(p)==h for p,h in _pins.items())
    return result
