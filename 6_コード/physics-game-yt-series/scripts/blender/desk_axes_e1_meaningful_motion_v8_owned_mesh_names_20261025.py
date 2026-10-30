"""NEW v8: resolve existing owned pendulum meshes after actual139 name failure.

No geometry, motion, camera, numerical threshold, control policy or subtitle/
audio changes. Names can acquire the observed retained-scene previous_* prefix
and Blender's numeric suffix. Selection is bounded to the existing E RNA group
and exact direct parents, unique1, with canonical creation-map corroboration
where present. The former bare-name assertion failure stays pinned, not waived.
Root alone runs this fresh cache after static peer.
"""
import ast
import hashlib
import re
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SOURCE=W/'scripts/blender/desk_axes_e1_meaningful_motion_v7_20261025.py'
SOURCE_SHA='de41d06fd60cf89807efe36998dd4743918738a1a929183bf6a0d94acf3d588b'
FAILED=Path('/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v7-20261025/probe/report.json')
FAILED_SHA='d2a39b9845dcce3565c1c1e08e874ba98144ec8ca356c013567d8374ce3b76e8'
FAILED_LOG=Path('/private/tmp/ys/axes-active-queue/job-139-e1-v7-bounded-pendulum-probe34-20261025.log')
FAILED_LOG_SHA='102ffd381323f3741097fe5d585f7871222a22d396b92dda8b44b406b304876d'
FAILED_CONTEXT=Path('/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v7-20261025/context-transactions/context-1792913061942873000.json')
FAILED_CONTEXT_SHA='a81e63de933c6b237956986e3e246ba8e0180a15f293bd0732b5665ce08f2b5e'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
PINS={str(SOURCE):SOURCE_SHA,str(FAILED):FAILED_SHA,str(FAILED_LOG):FAILED_LOG_SHA,
      str(FAILED_CONTEXT):FAILED_CONTEXT_SHA,str(Path(__file__).resolve()):sha(__file__)}

def _resolve_owned_meshes(g,d,parts):
    scene=d.SC;root=parts['pendulum']['root'];pivot=parts['pendulum']['pendulum']
    def pointer(o):return int(o.as_pointer())
    def in_scene(o):
        current=scene.objects.get(o.name)
        return current is not None and pointer(current)==pointer(o)
    assert root.type==pivot.type=='EMPTY' and in_scene(root) and in_scene(pivot)
    assert pivot.parent is not None and pointer(pivot.parent)==pointer(root)
    group=list(g['GROUPS']['pendulum']);owned={pointer(o):o for o in group}
    assert len(owned)==len(group) and pointer(root)in owned and pointer(pivot)in owned
    # Derive only from this retained E root; never search global bpy objects.
    match=re.fullmatch(r'(?P<prefix>(?:previous_[A-Za-z0-9_]+_)?)e1_pendulum(?:\.[0-9]+)?',root.name)
    assert match is not None,('Unexpected retained E root identity',root.name)
    prefix=match.group('prefix')
    assert re.fullmatch(re.escape(prefix+'e1_pendulum_pivot')+r'(?:\.[0-9]+)?',pivot.name)
    created=g.get('CREATED_NAME')
    assert created is None or isinstance(created,dict),'Unexpected canonical creation map type'
    def name_match(o,base):
        actual=bool(re.fullmatch(re.escape(prefix+base)+r'(?:\.[0-9]+)?',o.name))
        if created is not None and o in created:
            label=created[o]
            assert isinstance(label,str)
            canonical=bool(re.fullmatch(re.escape(base)+r'(?:\.[0-9]+)?',label)or
                           re.fullmatch(re.escape(prefix+base)+r'(?:\.[0-9]+)?',label))
            assert actual==canonical,('Canonical map versus owned RNA name disagreement',base,o.name,label)
        return actual
    def select(objects,parent,base):
        candidates=[o for o in objects if o.type=='MESH' and name_match(o,base)]
        assert len(candidates)==1,('Owned mesh name must resolve unique1',base,
                                  [(o.name,o.type)for o in objects])
        o=candidates[0]
        assert pointer(o)in owned and in_scene(o)
        assert o.parent is not None and pointer(o.parent)==pointer(parent)
        assert o.data is not None and o.data.bl_rna.identifier=='Mesh'
        return o
    descendants=list(g['ext'].descendants(pivot))
    bob=select(descendants,pivot,'e1_pendulum_bob')
    panel=select(group,root,'e1_pendulum_window')
    assert pointer(bob)!=pointer(panel)
    proof={'retainedRoot':root.name,'retainedRootRnaPointer':pointer(root),
           'retainedPivot':pivot.name,'retainedPivotRnaPointer':pointer(pivot),
           'retainedNamePrefix':prefix,'canonicalCreationMapPresent':created is not None,
           'bobName':bob.name,'bobRnaPointer':pointer(bob),'bobMeshRnaPointer':pointer(bob.data),
           'panelName':panel.name,'panelRnaPointer':pointer(panel),'panelMeshRnaPointer':pointer(panel.data),
           'bobDirectParentIsOwnedPivot':True,'panelDirectParentIsOwnedRoot':True,
           'sameOwnedSceneAndCapturedGroup':True,'uniquePerSemanticName':True,
           'onlyNumericSuffixAndDerivedOwnedPrefixAllowed':True,
           'namesTransformsMeshesVisibilityAndRuntimeNotModified':True}
    return [bob],[panel],proof

assert all(sha(p)==h for p,h in PINS.items())
_original=SOURCE.read_text()
_before="'/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v7-20261025'"
_after="'/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v8-owned-mesh-names-20261025'"
assert _original.count(_before)==1
_text=_original.replace(_before,_after,1)
assert _text.replace(_after,_before,1)==_original
_parent={'__name__':'e1_v8_owned_mesh_resolution_private','__file__':str(Path(__file__).resolve())}
exec(compile(_text,str(SOURCE)+' [private v8 fresh cache]','exec'),_parent)
_node=next(n for n in ast.parse(_original).body if isinstance(n,ast.FunctionDef)and n.name=='_bob_visible')
_original_bob=ast.get_source_segment(_original,_node)
_bob_text=_original_bob
_changes=[
 ("    bob=[o for o in g['ext'].descendants(pivot) if o.type=='MESH' and o.name=='e1_pendulum_bob']\n"
  "    panel=[o for o in g['GROUPS']['pendulum'] if o.type=='MESH' and o.name=='e1_pendulum_window']",
  "    bob,panel,name_evidence=_RESOLVE_OWNED_MESHES(g,d,parts)"),
 ("'notAnActualPixelOrFullOcclusionProof':True,'rootActualProbeReviewStillMandatory':True}",
  "'notAnActualPixelOrFullOcclusionProof':True,'rootActualProbeReviewStillMandatory':True,\n"
  "            'existingOwnedMeshResolution':name_evidence}")
]
for before,after in _changes:
    assert _bob_text.count(before)==1
    _bob_text=_bob_text.replace(before,after,1)
_inverse=_bob_text
for before,after in reversed(_changes):
    assert _inverse.count(after)==1
    _inverse=_inverse.replace(after,before,1)
assert _inverse==_original_bob
_bob_scope={**_parent,'_RESOLVE_OWNED_MESHES':_resolve_owned_meshes}
exec(compile(_bob_text,str(SOURCE)+' [only semantic mesh name resolution]','exec'),_bob_scope)
_parent['_inner']['_BOB_VISIBLE']=_bob_scope['_bob_visible']
_scope=_parent
while isinstance(_scope,dict):
    if '_pins'in _scope:_scope['_pins'].update(PINS)
    _scope=_scope.get('_parent')
_parent['_inner']['_V3_EXTRA_PINS'].update(PINS)
PROOF={'adapter':str(Path(__file__).resolve()),'adapterSha256':sha(__file__),
       'retainedV7':str(SOURCE),'retainedV7Sha256':SOURCE_SHA,
       'actual139FailedReport':str(FAILED),'actual139FailedReportSha256':FAILED_SHA,
       'actual139Log':str(FAILED_LOG),'actual139LogSha256':FAILED_LOG_SHA,
       'actual139Context':str(FAILED_CONTEXT),'actual139ContextSha256':FAILED_CONTEXT_SHA,
       'freshCacheBoundaryCount':1,'onlyBobHelperBoundaries':len(_changes),
       'bobHelperInverseByteIdenticalOutsideNameResolutionAndEvidence':True,
       'existingOwnedRootPivotGroupParentTypeAndUniqueMeshRequired':True,
       'originalAll694MotionAnglesNumericalThresholdsAndControlsUnchanged':True,
       'originalFourControlsWholeRgbZeroStillRequired':True,
       'old9540CaseNotReintroduced':True,'actualProbesOrEyesNotClaimed':True,'finalAcceptance':False}
_parent['_inner']['_SOURCE_PROOF']['v8OwnedSemanticMeshNameResolutionProof']=PROOF
OUT=_parent['OUT']

def run(ns,authorized=False,mode='probe',approved_probe_sha256=None,*,allow_temporary_unhide=False):
    assert authorized is True and allow_temporary_unhide is True
    assert all(sha(p)==h for p,h in PINS.items())
    result=_parent['run'](ns,authorized=True,mode=mode,approved_probe_sha256=approved_probe_sha256,allow_temporary_unhide=True)
    assert result['actualSources']==694 and len(result['replacementFrameToActualPatchFrame'])==694
    assert all(sha(p)==h for p,h in PINS.items())
    return result
