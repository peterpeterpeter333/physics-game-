"""Minimal pointer-identity derivative of frozen7ce47 D entry-cache recovery.

The source stays untouched. Four exact reversible text boundaries change only
fresh OUT, context pointer capture/comparison and additive report metadata.
No recovery formula, 1e-9/mandatory10guard, model, visibility or world setter is
changed. Imports/compilation define code only; root alone runs either API.
"""
import hashlib
from pathlib import Path

SOURCE=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_d1_pier_contact_replay_v4_20261025.py')
SOURCE_SHA='7ce47d78d752bb467d11456e1850819744e497b1bc3cb3c9dfde6ad1826e7a7f'
def _sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert _sha(SOURCE)==SOURCE_SHA
_original=SOURCE.read_text();_text=_original;_boundaries=[]
def _replace(before,after):
    global _text
    assert _text.count(before)==1,('Nonunique private boundary',before[:90])
    _text=_text.replace(before,after,1);_boundaries.append((before,after))

_replace("OUT=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v4-20261025')",
         "OUT=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v4-pointer-20261025')")
_replace("    previous=bpy.context.window.scene;old_layer=bpy.context.window.view_layer",
         "    previous=bpy.context.window.scene;old_layer=bpy.context.window.view_layer\n"
         "    context_before={'scenePointer':previous.as_pointer(),'sceneName':previous.name,'viewLayerPointer':old_layer.as_pointer(),'viewLayerName':old_layer.name}")
_replace("'entryWindowSceneAndLayerRestored':bpy.context.window.scene is previous and bpy.context.window.view_layer is old_layer",
         "'entryWindowSceneAndLayerRestored':bpy.context.window.scene.as_pointer()==context_before['scenePointer'] and bpy.context.window.scene.name==context_before['sceneName'] and bpy.context.window.view_layer.as_pointer()==context_before['viewLayerPointer'] and bpy.context.window.view_layer.name==context_before['viewLayerName']")
_replace("        report.update(protectionChecks=checks,seconds=round(time.time()-started,3));write(Path(out or OUT/'coherency/report.json'),report)",
         "        context_after={'scenePointer':bpy.context.window.scene.as_pointer(),'sceneName':bpy.context.window.scene.name,'viewLayerPointer':bpy.context.window.view_layer.as_pointer(),'viewLayerName':bpy.context.window.view_layer.name}\n"
         "        report.update(protectionChecks=checks,contextBefore=context_before,contextAfter=context_after,contextIdentityMethod='Exact RNA pointers plus scene/view-layer names; never Python wrapper is',sourceAdapter=_SOURCE_ADAPTER_PROOF,seconds=round(time.time()-started,3));write(Path(out or OUT/'coherency/report.json'),report)")

_inverse=_text
for _before,_after in reversed(_boundaries):
    assert _inverse.count(_after)==1;_inverse=_inverse.replace(_after,_before,1)
assert _inverse==_original
_proof={'adapter':str(Path(__file__).resolve()),'adapterSha256':_sha(__file__),
    'source':str(SOURCE),'sourceSha256':SOURCE_SHA,'exactReversibleBoundaries':len(_boundaries),
    'inverseByteIdenticalToFrozenSource':True,'onlyContextIdentityRepresentationAndFreshOutputChanged':True,
    'originalCoherencyRestorationAnd1eMinus9CodeOtherwiseRetained':True}
_scope={'__name__':'d1_v4_pointer_private','__file__':str(Path(__file__).resolve()),'_SOURCE_ADAPTER_PROOF':_proof}
exec(compile(_text,str(SOURCE)+' [private pointer-context derivative]','exec'),_scope)
_scope['PINS'].update({str(SOURCE):SOURCE_SHA,str(Path(__file__).resolve()):_sha(__file__)})
DeliveredReplay=_scope['DeliveredReplay']
OUT=_scope['OUT']
coherency_diagnostic=_scope['coherency_diagnostic']

def diagnostic(ns,authorized=False,*,coherency_report_sha256,out=None):
    """Root second job only, explicitly pinned actual first-job success."""
    assert authorized is True
    assert isinstance(coherency_report_sha256,str)and len(coherency_report_sha256)==64
    coherent=OUT/'coherency/report.json';assert _sha(coherent)==coherency_report_sha256
    _scope['PINS'][str(coherent)]=coherency_report_sha256 # Our private globals only.
    result=_scope['diagnostic'](ns,authorized=True,out=out)
    assert _sha(coherent)==coherency_report_sha256
    return result
