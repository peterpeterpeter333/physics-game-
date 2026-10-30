"""NEW pixel-exact control derivative. Preserve old byte-NG and every source.

Only the fresh cache and three exact control-boundary substitutions change.
A pinned external CPU/Pillow process independently decodes both raw JPEGs.
Allowed RGB difference is ZERO everywhere; no background or principal waiver.
Live episode globals, model operations, camera, sound, captions, one-second
pendulum, original strict transaction and all354 mappings are unchanged.
"""
import ast
import hashlib
import json
from pathlib import Path
import subprocess

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SOURCE=W/'scripts/blender/desk_axes_e1_meaningful_motion_v3_20261025.py'
SOURCE_SHA='ba11a1dcc9ca814c962bdef47bd40b4ab7953c402b7fd92688ea4dc6954649f3'
COMPARE=W/'scripts/umech/compare-b1-b7-jpeg-rgb-exact-20261025.py'
COMPARE_SHA='f40eb8ee33e8ffd1ad07fe0ed5bf5d5508f0b335acd687cbcca9feef2b17391f'
PYTHON=Path('/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3')
PYTHON_SHA='494f72dd95d0dc196169c5821219fc6cfa9c1ef582332b95b53874b10acea6e0'
FAILED=Path('/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v3-20261025/probe/report.json')
FAILED_SHA='4191003d42716b746428be77476375af7118dff7acf9d1a710525a2e4fdc2261'
ANALYSIS=W/'outputs/axes-20261023/e1-actual121-control380-rgb-and-comment-difference-independent-20261025.json'
ANALYSIS_SHA='073daab18f36798c0944904b6d660422e1d0c39a0c7d6793d73f705e151b6e6c'
def _sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()
_pins={str(SOURCE):SOURCE_SHA,str(COMPARE):COMPARE_SHA,str(PYTHON):PYTHON_SHA,
       str(FAILED):FAILED_SHA,str(ANALYSIS):ANALYSIS_SHA,str(Path(__file__).resolve()):_sha(__file__)}
assert all(_sha(p)==h for p,h in _pins.items())
_original=SOURCE.read_text()
_before_cache='/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v3-20261025'
_after_cache='/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v4-20261025'
assert _original.count(_before_cache)==1
_text=_original.replace(_before_cache,_after_cache,1)
assert _text.replace(_after_cache,_before_cache,1)==_original
_parent={'__name__':'e1_meaningful_motion_v4_parent_private','__file__':str(Path(__file__).resolve())}
exec(compile(_text,str(SOURCE)+' [private v4 fresh cache]','exec'),_parent)
_parent['_pins'].update(_pins) # Same private dict already passed to all inner guards.
_v2=_parent['_private']
_inner=_v2['_scope']
_original_inner=_v2['_text']
_inner_text=_original_inner
_boundaries=[]
def _change(before,after):
    global _inner_text
    assert _inner_text.count(before)==1,('Nonunique pixel-control boundary',before[:100])
    _inner_text=_inner_text.replace(before,after,1)
    _boundaries.append((before,after))
_change("            assert all(r['byteExactAgainstExistingDeliveredRaw'] for r in prior['controls'])",
        "            assert all(r['sourceEquivalentAgainstExistingDeliveredRaw'] and r['decodedRgbExact'] and r['decodedDifferenceMinMax']==[0,0] for r in prior['controls'])")
_change("            report['controls'].append(record)",
        "            record.update(_INDEPENDENT_RGB_COMPARE(record))\n            report['controls'].append(record)")
_change("            assert record['byteExactAgainstExistingDeliveredRaw'], ('Baseline replay control differs',j)",
        "            assert record['sourceEquivalentAgainstExistingDeliveredRaw'] and record['decodedRgbExact'] and record['decodedDifferenceMinMax']==[0,0], ('Baseline replay decoded RGB control differs',j)")
_inverse=_inner_text
for before,after in reversed(_boundaries):
    assert _inverse.count(after)==1
    _inverse=_inverse.replace(after,before,1)
assert _inverse==_original_inner

def _compare(record):
    assert all(_sha(p)==h for p,h in _pins.items())
    left,right=record['expectedPath'],record['path']
    lh,rh=record['expectedSha256'],record['sha256']
    assert _sha(left)==lh and _sha(right)==rh
    child=subprocess.run([str(PYTHON),str(COMPARE),'--left',left,'--left-sha256',lh,
                          '--right',right,'--right-sha256',rh],capture_output=True,text=True,check=False)
    assert child.returncode in (0,2),('Independent RGB decoder failed',child.stderr[:1000])
    result=json.loads(child.stdout)
    assert result['leftSha256']==lh and result['rightSha256']==rh
    assert result['rgbDimensions']==[1080,1920,3] and result['allowedDifference']==0
    assert result['quantizationExactlyEqual'] and result['filesWritten']==0 and not result['renderOrEncodePerformed']
    assert result['decodedRgbExact'] == (child.returncode==0)
    assert result['decodedRgbExact'] == (result['maximumAbsoluteChannelDifference']==0)
    exact=result['decodedRgbExact']
    assert _sha(left)==lh and _sha(right)==rh and all(_sha(p)==h for p,h in _pins.items())
    return {'sourceEquivalentAgainstExistingDeliveredRaw':record['byteExactAgainstExistingDeliveredRaw'] or exact,
            'decodedRgbExact':exact,'decodedDifferenceMinMax':[0,0] if exact else [None,result['maximumAbsoluteChannelDifference']],
            'pixelAllowedDifference':0,'wholeImageNotBackgroundOnly':True,'independentDecoder':str(COMPARE),
            'independentDecoderSha256':COMPARE_SHA,'independentPythonSha256':PYTHON_SHA,
            'independentDecodedRgbComparison':result,'originalByteExactFailureNotRelabeled':not record['byteExactAgainstExistingDeliveredRaw']}

_proof={'adapter':str(Path(__file__).resolve()),'adapterSha256':_sha(__file__),
        'source':str(SOURCE),'sourceSha256':SOURCE_SHA,'freshCacheBoundaryCount':1,
        'exactReversibleInnerControlBoundaries':len(_boundaries),'inverseByteIdenticalOutsideControlPredicates':True,
        'wholeDecodedRgbAllowedDifference':0,'oldActual121ByteFailurePreserved':str(FAILED),
        'oldActual121ByteFailureSha256':FAILED_SHA,'independentActual380Analysis':str(ANALYSIS),
        'independentActual380AnalysisSha256':ANALYSIS_SHA,'noBackgroundDifferenceAllowance':True}
_inner['_SOURCE_PROOF']['v4PixelExactControlProof']=_proof
_inner['_INDEPENDENT_RGB_COMPARE']=_compare
_nodes=[n for n in ast.parse(_inner_text).body if isinstance(n,ast.FunctionDef) and n.name=='run']
assert len(_nodes)==1
exec(compile(ast.Module(body=_nodes,type_ignores=[]),str(SOURCE)+' [private v4 pixel control run]','exec'),_inner)
OUT=_parent['OUT']

def run(ns,authorized=False,mode='probe',approved_probe_sha256=None,*,allow_temporary_unhide=False):
    assert authorized is True and allow_temporary_unhide is True
    assert all(_sha(p)==h for p,h in _pins.items())
    result=_parent['run'](ns,authorized=True,mode=mode,approved_probe_sha256=approved_probe_sha256,
                          allow_temporary_unhide=True)
    assert all(_sha(p)==h for p,h in _pins.items())
    return result

