"""Minimal frozen-v2 derivative: explicit owned visibility evaluation always.

Both earlier drafts are preserved. The root must explicitly authorize temporary
owned-only visibility evaluation, even when two stale world caches agree.
Internal protected-input guards now include both prior source drafts as well.
No camera, narration, subtitle, transform/world/basis restoration tolerance,
one-second pendulum, hand timing, controls, probes or render mappings change.
"""
import hashlib
from pathlib import Path

V2 = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_e1_meaningful_motion_v2_20261025.py')
V2_SHA = '5298e73be134da20d572721796ccab1c57512a65d1703d3406a7d3302fac75d2'
V1 = V2.with_name('desk_axes_e1_meaningful_motion_v1_20261025.py')
V1_SHA = '5257b7d6e3c7c707644614cbab8aa8e7e614770d4318896af7050044d036ec22'
def _sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert _sha(V2) == V2_SHA and _sha(V1) == V1_SHA
_pins = {str(V1):V1_SHA,str(V2):V2_SHA,str(Path(__file__).resolve()):_sha(__file__)}
_original = V2.read_text()
_text = _original
_boundaries = []
def _change(before,after,count=1):
    global _text
    assert _text.count(before)==count,('Nonunique v3 boundary',before[:90],_text.count(before))
    _text=_text.replace(before,after)
    _boundaries.append((before,after,count))

_change('/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v2-20261025',
        '/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v3-20261025',2)
_change("if not normal['allActualWorldsMatchTheirEvaluatedWorlds'] and allow_temporary_unhide:",
        "if allow_temporary_unhide:")
_change("_inverse=_text",
         "_replace(\"    assert all(sha(p) == h for p, h in protected.items())\",\n"
         "         \"    protected.update(_V3_EXTRA_PINS)\\n    assert all(sha(p) == h for p, h in protected.items())\")\n"
         "_inverse=_text")
_change("'_NORMAL':_normal,'_NORMAL_PROOFS':[],'_ALLOW_TEMPORARY_UNHIDE':False,'_SOURCE_PROOF':_source_proof}",
        "'_NORMAL':_normal,'_NORMAL_PROOFS':[],'_ALLOW_TEMPORARY_UNHIDE':False,'_SOURCE_PROOF':_source_proof,'_V3_EXTRA_PINS':_V3_EXTRA_PINS}")
_inverse=_text
for before,after,count in reversed(_boundaries):
    assert _inverse.count(after)==count
    _inverse=_inverse.replace(after,before)
assert _inverse==_original
_proof={'adapter':str(Path(__file__).resolve()),'adapterSha256':_sha(__file__),
        'source':str(V2),'sourceSha256':V2_SHA,'preservedV1':str(V1),'preservedV1Sha256':V1_SHA,
        'exactReversibleBoundaries':len(_boundaries),'inverseByteIdenticalToFrozenV2':True,
        'explicitRootTrueAlwaysEvaluatesOwnedHiddenDependencies':True,'internalOriginalAndAdapterSourcePins':_pins,
        'strictSavedActualWorldRestorationToleranceUnchanged':1e-9,'actualApproval':False}
_private={'__name__':'e1_meaningful_motion_v3_adapter_private','__file__':str(Path(__file__).resolve()),
          '_V3_EXTRA_PINS':_pins}
exec(compile(_text,str(V2)+' [private v3 explicit-visibility derivative]','exec'),_private)
_private['_source_proof']['v3ExactBoundaryProof']=_proof
OUT=_private['OUT']

def run(ns,authorized=False,mode='probe',approved_probe_sha256=None,*,allow_temporary_unhide=False):
    assert authorized is True and allow_temporary_unhide is True,'Root must explicitly authorize exact-restored owned dependency evaluation'
    assert all(_sha(p)==h for p,h in _pins.items())
    result=_private['run'](ns,authorized=True,mode=mode,approved_probe_sha256=approved_probe_sha256,
                           allow_temporary_unhide=True)
    assert all(_sha(p)==h for p,h in _pins.items())
    return result

