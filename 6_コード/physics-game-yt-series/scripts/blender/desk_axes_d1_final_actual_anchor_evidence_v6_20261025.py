"""Root-only full846 replay with explicit historical-anchor timing evidence.

146/147/148 remain NG. A stale old-camera anchor may be classified ONLY if
its exact canonical source projection reproduces the historical sidecar at
the original1e-5, its delivered camera is restored at1e-9, and a separately
pinned source-production physical box agrees. The current camera projection
is independently checked and written to a NEW sidecar, never to old anchors.
No model/pose mechanism, physical threshold, source/clip, inspector or gate
is changed. All original546 requests and final pre-hold selection stay exact.
784 independent historical boxes are available;62 production states have no
independent historical box and are explicitly newly measured, not certified
by circular equality. No rendering or actual-image/ear acceptance occurs.
"""
import ast
import hashlib
import json
import math
from pathlib import Path
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
ORIGINAL=W/'scripts/blender/desk_axes_d1_final_camera_pier_physical_v5_20261025.py'
ORIGINAL_SHA='1fa4235a08590e737f06c2940d0b4dc4f5c127d35de19199e6ec7a2f5421804c'
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025')
BASE=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
OLD_CAMERA=Path('/private/tmp/ys/ys-chain-d1v1-camera-patch-v2-20261024/camera-patch-complete.json')
LOCAL=Path('/private/tmp/ys/ys-chain-d1v1-final-local-bundle-v4-20261024/render/report.json')
OLD546=BASE/'d1-complete-v4-delivered-physical-supplement-20261025.json'
CAUSE=FINAL/'final-anchor810-diagnostic-v2-details-20261025.json'
OUT=FINAL/'final-composite-physical-v6-actual-anchor-evidence-20261025.json'
SIDECAR=FINAL/'final-actual-camera-anchors-v6-20261025.json'
PINS={str(ORIGINAL):ORIGINAL_SHA,
 str(OLD_CAMERA):'02f04a5fa1c994c7e37cfb7487b29f9b1d36f78ee308c52994d2a4c82c921944',
 str(LOCAL):'cdef62ce217eae0cf150ddb1600cb42ea9b1b5d13a7ed71d505e084d594fdd16',
 str(OLD546):'a4ad052f41ac11f7d3dc012f9715d3a69dfe0fdefef50402f1ba6e5e8f35a970',
 str(CAUSE):'da23c45daaecd88aa648e78bae2076270a1d4aa20bd74a110791c4ed58955055',
 str(FINAL/'final-anchor810-diagnostic-v2-20261025.json'):'ff9f50ae96bf51bda0b6df01dca0289fec0e0134daa2cee56f936d21ec305a04',
 str(FINAL/'final-composite-physical-v5-20261025.json'):'1ca5e7e538d23d574040a962ead211d558932b9a40048197720f29f79ce7b1e9'}

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text())
def eq(a,b,tol=1e-9):
    if isinstance(a,dict):return isinstance(b,dict)and a.keys()==b.keys()and all(eq(a[k],b[k],tol)for k in a)
    if isinstance(a,(list,tuple)):return isinstance(b,(list,tuple))and len(a)==len(b)and all(eq(x,y,tol)for x,y in zip(a,b))
    if isinstance(a,(int,float))and not isinstance(a,bool):return isinstance(b,(int,float))and not isinstance(b,bool)and math.isfinite(float(a))and math.isfinite(float(b))and abs(a-b)<=tol
    return a==b
def flat(m):return[float(v)for row in m for v in row]
def signature(r):return json.dumps([r[k]for k in['layer','actualFrame','unchangedOtherObjectSourceFrame','semanticOperationTime','cameraOperationTime','pose','raw']],sort_keys=True,separators=(',',':'))
def coordinates(surface):
    if surface is None:return None
    if isinstance(surface,list):assert len(surface)==4;return surface
    return[surface[k]for k in['x0','y0','x1','y1']]
def exclusive(p,x):
    assert p.is_absolute()and p.is_relative_to(FINAL)and not p.exists()and not p.is_symlink()
    assert not any(q.is_symlink()for q in p.parents if q.exists())
    with p.open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)

class Evidence:
    def __init__(self,kwargs):
        self.anchors={};self.boxes={};self.pins=dict(PINS)
        for p,h in self.pins.items():assert sha(p)==h,p
        self.pins[str(Path(__file__).resolve())]=sha(__file__)
        assert load(CAUSE)['beforeOverrideProof']['canonicalSourceProjectionMatchesHistoricalAnchorsAtOriginalTolerance']is True
        self.oldcam={r['frame']:r for r in load(OLD_CAMERA)['physical']}
        self.local={r['frame']:r for r in load(LOCAL)['physical']}
        self.old546={}
        for r in load(OLD546)['rows']:self.old546.setdefault(signature(r['deliveredFrame']),[]).append(r)
        self.camera_report=str(kwargs['camera_render_report']);self.pier_report=str(kwargs['pier_render_report'])
        self.camera=load(self.camera_report);self.pier=load(self.pier_report)
        assert sha(kwargs['camera_render_report'])==kwargs['camera_render_report_sha256']
        assert sha(kwargs['pier_render_report'])==kwargs['pier_render_report_sha256']
        self.pins[self.camera_report]=kwargs['camera_render_report_sha256']
        self.pins[self.pier_report]=kwargs['pier_render_report_sha256']
        self.cp={r['frame']:r for r in self.camera['physical']};self.pp={r['frame']:r for r in self.pier['physical']}
        self.checked_points=None
    def image_checked_points(self,image,ctx,audit,record):
        # Preserve the complete original checker body/thresholds. Only return
        # its ALREADY computed aa world points alongside the two old outputs.
        if self.checked_points is None:
            original_path=W/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py'
            assert sha(original_path)=='4e9d41accb35d8a31211a65c3ce76740a7e07dc81d021a6a2e2bc0e114b0b479'
            source=original_path.read_text();before='    return fresh,anchors\n';after='    return fresh,anchors,aa\n'
            assert source.count(before)==1;derived=source.replace(before,after,1)
            assert derived.count(after)==1 and derived.replace(after,before,1)==source
            fn=next(n for n in ast.parse(derived).body if isinstance(n,ast.FunctionDef)and n.name=='apply_checked')
            original_fn=image['apply_checked'];assert original_fn.__code__.co_filename==str(original_path)
            namespace={**original_fn.__globals__}
            exec(compile(ast.Module(body=[fn],type_ignores=[]),str(original_path)+' [return already computed world points]','exec'),namespace)
            self.checked_points=namespace['apply_checked']
        return self.checked_points(ctx,audit,record)
    def anchor(self,ctx,audit,j,row,points,projected,expected):
        from mathutils import Vector
        from bpy_extras.object_utils import world_to_camera_view
        g,d,bpy=ctx.g,ctx.d,ctx.bpy
        assert set(projected)==set(expected)==set(points)
        # Projection function and independent scene-camera API must reference
        # the exact owned camera. This does not infer truth from expected data.
        gg=d.project.__globals__
        assert gg['SC']is d.SC and gg['CAM']is d.CAM and gg['CAM_D']is d.CAM_D
        fresh={}
        for n,p in points.items():
            v=world_to_camera_view(ctx.scene,d.CAM,Vector(p))
            fresh[n]=[round(v.x*1080,1),round((1-v.y)*1920,1),1 if 0<=v.x<=1 and 0<=v.y<=1 and v.z>0 else 0]
        assert fresh==projected,'Current runtime projection disagrees with independent actual-camera projection'
        legacy=eq(projected,expected,1e-5);timing=None
        if not legacy and row['layer']=='camera':
            # Reproduce precisely the old source-before-camera-override path,
            # then return via the SAME unmodified delivery replay.
            assert row['actualFrame']in self.oldcam
            before_world=flat(d.CAM.matrix_world)
            before_objects={o:audit['object_state'](o)for o in ctx.scene.objects if o is not d.CAM}
            source_points=g['apply'](row['unchangedOtherObjectSourceFrame']/30);bpy.context.view_layer.update()
            before_override={n:list(d.project(v))for n,v in source_points.items()}
            canonical_match=eq(before_override,expected,1e-5)
            restored=ctx.replay(row);bpy.context.view_layer.update()
            assert eq(before_world,flat(d.CAM.matrix_world),1e-9),'Delivered camera world not restored after provenance diagnostic'
            assert all(audit['object_state'](o)==s for o,s in before_objects.items()),'Historical-anchor diagnostic changed model or hand state'
            assert {n:list(d.project(v))for n,v in restored.items()}==projected
            timing={'canonicalSourceProjection':before_override,'matchesPreservedHistoricalAnchorsAtOriginal1eMinus5':canonical_match,
                'exactDeliveredProjectionRestored':True,'allModelAndHandChannelsRestoredExactly':True,
                'actualCameraWorldRestoredAt1eMinus9':True,'canonicalSourceTime':row['unchangedOtherObjectSourceFrame']/30,
                'actualCameraOperationTime':row['cameraOperationTime'],'noNewPoseOrMechanismUsed':True}
        verified=legacy or bool(timing and timing['matchesPreservedHistoricalAnchorsAtOriginal1eMinus5'])
        record={'frame':j,'layer':row['layer'],'actualRawSourceFrame':row['actualFrame'],'raw':row['raw'],
            'worldAnchorPoints':{n:list(v)for n,v in points.items()},'actualDeliveredCameraProjected':projected,
            'preservedHistoricalAnchors':expected,'originalHistoricalAnchorEqualityAt1eMinus5':legacy,
            'oldFalseNeverReclassifiedAsOriginalPass':True,'historicalBeforeOverrideEvidence':timing,
            'independentOwnedCameraProjectionExact':True,'actualAnchorSourceProvenanceVerified':verified,
            'originalAnchorTolerancePixelsUnchanged':1e-5,'originalWorldRestorationToleranceUnchanged':1e-9,
            'originalSidecarEdited':False,'automaticApproval':False}
        if j in self.anchors:assert eq(self.anchors[j],record)
        self.anchors[j]=record
        return record
    def source_box(self,r):
        row=r['deliveredFrame'];j=row['frame'];layer=row['layer'];k=row['actualFrame'];old=None;field='actualSurface';file=None;origin=None
        if layer=='four-cue-camera':old=self.cp[j];file=self.camera_report;origin='exact-final-camera-source-render-record'
        elif layer=='pier-contact':old=self.pp[k];field='afterActualSurface';file=self.pier_report;origin='exact-final-pier-source-render-record'
        elif layer=='local':old=self.local[k];file=str(LOCAL);origin='exact-local-source-render-record'
        elif layer=='camera':old=self.oldcam[k];file=str(OLD_CAMERA);origin='exact-historical-camera-source-render-record'
        elif layer=='production':
            prior=self.old546.get(signature(row),[])
            if prior:
                old=prior[0];assert all(eq(x['actualSurface'],old['actualSurface'])for x in prior)
                assert sha(row['raw'])==old['deliveredRawSha256'],'Prior independent box refers to another raw image'
                file=str(OLD546);origin='independent-prior546-exact-full-delivery-signature-record'
        else:raise AssertionError('Unsupported exact delivery layer '+layer)
        if old is None:
            proof={'frame':j,'actualRawSourceFrame':k,'layer':layer,'independentHistoricalBoxAvailable':False,
                'newlyMeasuredActualSurface':r['actualSurface'],'historicalBoxMatchNotClaimed':True,
                'status':'new-evaluated-physical-state-without-independent-historical-sourcebox',
                'originalPhysicalThresholdResult':r['pass'],'automaticApproval':False}
        else:
            a=coordinates(r['actualSurface']);b=coordinates(old[field]);matches=eq(a,b,1e-9)
            proof={'frame':j,'actualRawSourceFrame':k,'layer':layer,'independentHistoricalBoxAvailable':True,
                'origin':origin,'sourceRecord':file,'sourceReportSha256':self.pins[file],'sourceBoxField':field,
                'historicalActualSurface':old[field],'newlyEvaluatedActualSurface':r['actualSurface'],
                'sourceBoxMatchesAt1eMinus9':matches,'sourceSemanticPrincipal':old.get('semanticPrincipal'),
                'sourcePhysicalThresholdResultRetained':old.get('pass'),'originalPhysicalThresholdResult':r['pass'],
                'matchingBoxDoesNotConvertOriginalNGToPass':True,'automaticApproval':False}
        self.boxes[j]=proof;r['independentSourcePhysicalBoxEvidence']=proof
    def finish(self,report):
        anchors=[self.anchors[j]for j in sorted(self.anchors)];boxes=[self.boxes[j]for j in sorted(self.boxes)]
        complete=len(anchors)==len(boxes)==846
        available=[r for r in boxes if r['independentHistoricalBoxAvailable']]
        missing=[r['frame']for r in boxes if not r['independentHistoricalBoxAvailable']]
        summary={'replayedFrames':len(anchors),'physicalRowsWithSourceBoxDisposition':len(boxes),'completeExpected846':complete,
            'original546RequestsPreservedNotRemapped':True,
            'historicalAnchorDirectMatch':sum(r['originalHistoricalAnchorEqualityAt1eMinus5']for r in anchors),
            'historicalAnchorOriginalMismatchRetained':sum(not r['originalHistoricalAnchorEqualityAt1eMinus5']for r in anchors),
            'allCurrentCameraAnchorProvenanceVerified':bool(anchors)and all(r['actualAnchorSourceProvenanceVerified']for r in anchors),
            'independentHistoricalSourceBoxAvailable':len(available),'newMeasurementsWithoutIndependentHistoricalSourceBox':len(missing),
            'allAvailableIndependentSourceBoxesMatch':bool(available)and all(r['sourceBoxMatchesAt1eMinus9']for r in available),
            'missingIndependentSourceBoxFrames':missing,'noClaimOfIndependentBoxesForAll846':True,
            'originalThresholdsAndNGUnchanged':True,'noRendering':True,'automaticApproval':False}
        exclusive(SIDECAR,{'episode':'D-1','mode':'actual-delivered-camera-anchor-and-independent-sourcebox-evidence',
            'helperSha256':sha(__file__),'originalHelperSha256':ORIGINAL_SHA,'cause148':{'file':str(CAUSE),'sha256':PINS[str(CAUSE)]},
            'mp4Sha256':report['mp4Sha256'],'preparedSha256':report['preparedSha256'],
            'summary':summary,'anchors':anchors,'sourceBoxes':boxes,'originalHistoricalSidecarsUnchanged':True,
            'existingModelCameraMechanismsUnchanged':True,'originalAnchorAssertionFailureRetainedIn146147148':True,
            'renders':0,'automaticApproval':False,'allActualImagesPersonallyViewed':False,'earsVerified':False,'finalAcceptance':False})
        report['actualAnchorAndSourceBoxEvidence']={'path':str(SIDECAR),'sha256':sha(SIDECAR),'summary':summary}
        report['originalPhysicalThresholdAllPass']=report.get('allPass')
        report['allPass']=bool(report.get('allPass')and complete and summary['allCurrentCameraAnchorProvenanceVerified']and summary['allAvailableIndependentSourceBoxesMatch'])
        report['originalHistoricalAnchorNGNotChanged']=True

def private_scope(evidence):
    assert sha(ORIGINAL)==ORIGINAL_SHA
    original=ORIGINAL.read_text();text=original;changes=[]
    def replace(a,b):
        nonlocal text
        assert text.count(a)==1,a[:100];text=text.replace(a,b,1);changes.append((a,b))
    replace("k=row['actualFrame'];fresh,projected=image['apply_checked'](ctx,audit,states[k]);assert image['same'](fresh,pp[k]);contacts=fresh['contacts']",
        "k=row['actualFrame'];fresh,projected,points=evidence_image_checked(image,ctx,audit,states[k]);assert image['same'](fresh,pp[k]);contacts=fresh['contacts']")
    replace("            assert set(projected)==names and same(projected,expected,1e-5),('Actual versus delivered anchors mismatch',j)",
        "            assert set(projected)==names,'Anchor names changed'\n            actual_anchor_proof=evidence_anchor(ctx,audit,j,row,points,projected,expected)")
    replace("                'pierContacts':contacts,'caseSupplementApproved':False,'actualEncodedImageNeedsEyeReview':True}",
        "                'pierContacts':contacts,'caseSupplementApproved':False,'actualEncodedImageNeedsEyeReview':True,'actualCameraAnchorProof':actual_anchor_proof}")
    replace("            j=js_frame(r['time']);assert r['actualPose']==poses[j];r.update(observations[j])",
        "            j=js_frame(r['time']);assert r['actualPose']==poses[j];r.update(observations[j]);evidence_source_box(r)")
    replace("        write(dest,report);assert checks and all(v is True for v in checks.values()),checks",
        "        evidence_finish(report)\n        write(dest,report);assert checks and all(v is True for v in checks.values()),checks")
    inverse=text
    for a,b in reversed(changes):assert inverse.count(b)==1;inverse=inverse.replace(b,a,1)
    assert inverse==original and len(changes)==5;ast.parse(text)
    scope={'__file__':str(Path(__file__).resolve()),'__name__':'d1_actual_anchor_v6_private',
        'evidence_anchor':evidence.anchor,'evidence_source_box':evidence.source_box,'evidence_finish':evidence.finish,
        'evidence_image_checked':evidence.image_checked_points}
    exec(compile(text,str(ORIGINAL)+' [five inverse-exact actual-anchor evidence boundaries]','exec'),scope)
    scope['PINS'].update(evidence.pins)
    return scope

def run(ns,authorized=False,**kwargs):
    assert authorized is True and kwargs['out']==OUT and not OUT.exists()and not SIDECAR.exists()
    evidence=Evidence(kwargs)
    return private_scope(evidence)['run'](ns,authorized=True,**kwargs)
