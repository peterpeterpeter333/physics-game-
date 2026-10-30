"""Root-only pre-override-anchor proof; original147/146 assertions stay NG.

No rendering. Existing g.apply(source) and exact DeliveredReplay.replay(row)
are called once more solely to isolate historical anchor capture timing.
The final state must return at1e-9 to the original actual delivered camera,
and the primary evaluated mesh box must equal the historical render record.
Neither the historical anchor file nor any model/camera mechanism is edited.
"""
import ast
import hashlib
import json
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
FIRST=W/'scripts/blender/desk_axes_d1_final_anchor810_diagnostic_20261025.py'
FIRST_SHA='1613691c2eb276992a4216b4c38ef62c8c7057eaee8fd994af300fdb854fbb64'
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025')
PINS={
 str(FIRST):FIRST_SHA,
 str(FINAL/'final-anchor810-diagnostic-details-20261025.json'):'f5a0982983d020a986021195cc6e32e9545a284efe65138fdab08fa9b7559062',
 str(FINAL/'final-anchor810-diagnostic-20261025.json'):'e439be46e2539b2277970478c6d8d08cb20bcdcc4bf379e8dbf923d00bf6d4ff',
}
INSERT='''    # Reproduce the source helper ordering without changing its code:
    # original(source) updates canonical camera; corrected_camera is later.
    actual_camera_before=flat(d.CAM.matrix_world)
    ref_time=row['unchangedOtherObjectSourceFrame']/30
    canonical_pose=list(g['pose_at'](ref_time))
    canonical_points=g['apply'](ref_time)
    bpy.context.view_layer.update()
    canonical_projection={n:list(d.project(v))for n,v in canonical_points.items()}
    canonical_camera=flat(d.CAM.matrix_world)
    canonical_match=set(canonical_projection)==set(expected)and all(
        len(canonical_projection[n])==len(expected[n])and all(abs(a-b)<=1e-5 for a,b in zip(canonical_projection[n],expected[n]))for n in expected)
    restored_points=ctx.replay(row)
    bpy.context.view_layer.update()
    restored_projection={n:list(d.project(v))for n,v in restored_points.items()}
    restored_camera=flat(d.CAM.matrix_world)
    restored_surface=ctx.tools['project'](objects,matrix,bpy.context.evaluated_depsgraph_get())
    assert max(abs(a-b)for a,b in zip(actual_camera_before,restored_camera))<=1e-9,'Diagnostic replay did not restore actual delivered camera'
    assert restored_projection==projected,'Diagnostic replay changed actual projected anchors'
    assert restored_surface==surface==historical['actualSurface'],'Replayed primary physical box differs from source production810'
    before_override_proof={'canonicalSourcePose':canonical_pose,'deliveredCameraPose':poses[j],
        'sourceHelperOrdering':'original(source) update -> corrected_camera(target) without update -> stage main d.project before later renderer update',
        'canonicalSourceWorldAnchors':{n:list(v)for n,v in canonical_points.items()},
        'canonicalSourceProjectedAnchors':canonical_projection,'historicalDeliveredAnchors':expected,
        'canonicalSourceProjectionMatchesHistoricalAnchorsAtOriginalTolerance':canonical_match,
        'canonicalSourceCameraWorld':canonical_camera,'actualDeliveredCameraWorld':actual_camera_before,
        'restoredActualDeliveredCameraWorld':restored_camera,
        'actualDeliveredProjectionRestoredExactly':restored_projection==projected,
        'sourceRendered810PrincipalSurfaceMatchesExactly':restored_surface==historical['actualSurface'],
        'thresholdsAndMechanismUnchanged':True,'newRenderRequiredByThisDiagnostic':False}
'''

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def private_scope():
    for p,h in PINS.items():assert sha(p)==h,p
    original=FIRST.read_text();text=original;changes=[]
    def replace(a,b):
        nonlocal text
        assert text.count(a)==1,a[:100];text=text.replace(a,b,1);changes.append((a,b))
    replace("OUT=FINAL/'final-anchor810-diagnostic-20261025.json'","OUT=FINAL/'final-anchor810-diagnostic-v2-20261025.json'")
    replace("DETAILS=FINAL/'final-anchor810-diagnostic-details-20261025.json'","DETAILS=FINAL/'final-anchor810-diagnostic-v2-details-20261025.json'")
    before="    details={'episode':'D-1','mode':'zero-render-one-frame-anchor-diagnostic','helperSha256':sha(__file__),"
    replace(before,INSERT+before)
    replace("        'projected':projected,'expected':expected,'perAnchorIndependentProjection':independent,",
        "        'projected':projected,'expected':expected,'perAnchorIndependentProjection':independent,'beforeOverrideProof':before_override_proof,")
    inverse=text
    for a,b in reversed(changes):assert inverse.count(b)==1;inverse=inverse.replace(b,a,1)
    assert inverse==original and len(changes)==4;ast.parse(text)
    scope={'__name__':'d1_anchor810_order_diagnostic_private','__file__':str(Path(__file__).resolve())}
    exec(compile(text,str(FIRST)+' [four exact diagnostic-order changes]','exec'),scope)
    original_scope=scope['private_scope']
    def pinned_inner_scope():
        inner=original_scope()
        for p,h in PINS.items():assert sha(p)==h;inner['PINS'][p]=h
        inner['PINS'][str(Path(__file__).resolve())]=sha(__file__)
        return inner
    scope['private_scope']=pinned_inner_scope
    return scope

def run(ns,authorized=False,**kwargs):
    assert authorized is True and kwargs['out']==FINAL/'final-anchor810-diagnostic-v2-20261025.json'
    for p,h in PINS.items():assert sha(p)==h
    return private_scope()['run'](ns,authorized=True,**kwargs)
