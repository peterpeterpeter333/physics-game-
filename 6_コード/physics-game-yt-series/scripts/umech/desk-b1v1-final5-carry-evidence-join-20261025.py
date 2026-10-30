"""Read-only B5 actual evidence join: immutable B6 join plus exactly16 B7 sources.

Run only after final5 assembly, original checks and actual-MP4 extraction.
No image decoding, feature recalculation, rendering, encoding or gate waiver.
--b7-report-sha256 and --root-approval-sha256 are mandatory actual root pins.
Optional --eyes applies ONLY to this exact encoded MP4/JPEG. Without it all
714 sample eyes and72 page eyes remain pending; probe18 approval is separate.
"""
import hashlib,json,math,sys
from pathlib import Path

W=Path(__file__).resolve().parents[2]
ORIGINAL=W/'scripts/umech/desk-b1v1-b6-v2-final-evidence-join-20261024.py'
ORIGINAL_SHA='ee6161093e7d8a5e01aafdfddef11994896649d88092bb8988da6c8498b1ab02'
B4=Path('/private/tmp/ys/ys-chain-b1v1-final4-owned-resume-v2-20261025')
B5=Path('/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025')
B7_HELPER=W/'scripts/blender/desk_axes_b1_sixth_needle_carry_b7_20261025.py'
B7_SHA='d1736e949348256273198cc181bfc2abe42125f9b8139b8bb466867dc8bc1e54'
ASSEMBLER=W/'scripts/umech/desk-b1v1-final5-carry-assemble-20261025.mjs'
ASSEMBLER_SHA='0cfe85db983ec2bb40207b5bbd6d83d8b938fa900d961b84d0d3c4cc22ed59ed'
BASE_PINS={
 'prepared.json':'5154535d572e6ab4b100fc7fcd730723b965c9569e7e47370a9251f64e878b3a',
 'composite-provenance.json':'685711993fb83cc22f55e22ae3d81a359ce9c58aea4a8efd38c82caf9629460d',
 'final-held-dimensions.json':'a9e88016d9b07e94321db9a256a43e2d0d1140ff9654f87819b3278af70f25a5',
 'blender/delivered-camera-poses.json':'aa4106563b81e8afc8d33c4eb1d19d58ace2e0b706330409bb48ed1a070d883f',
 'blender/desk/anchors.json':'352637a5e790ac026d7d4a0f1d54c8c84833d45ee1832566b4ebc453715f5355',
}
PATCH=list(range(4125,4141));CONTEXT=[4124,4141];ALL=sorted(PATCH+CONTEXT)
CHANNELS=['sixthNeedle.location.z','kaiHand transform and visibility during approved withdrawal']

def digest(p):
    h=hashlib.sha256()
    with Path(p).open('rb')as f:
        for block in iter(lambda:f.read(1<<20),b''):h.update(block)
    return h.hexdigest()

def require(ok,why):
    if not ok:raise ValueError(why)

def load(p):return json.loads(Path(p).read_text())
def exact_sha(value):return isinstance(value,str)and len(value)==64 and all(c in '0123456789abcdef'for c in value)
def same_pose(a,b):return len(a)==len(b)==7 and all(math.isfinite(float(x))and abs(x-y)<1e-9 for x,y in zip(a,b))
def same_box(a,b):return len(a)==len(b)==4 and all(math.isfinite(float(x))and abs(x-y)<=1e-6 for x,y in zip(a,b))

def validate_b7(a,C,p,prepared,poses,dims,m,frozen,b6_mapping):
    """Prove the complete final5 delta before the unchanged714-grid join."""
    require(C.resolve()==B5.resolve(),'Only the isolated final5 candidate is supported')
    require(exact_sha(a.b7_report_sha256)and exact_sha(a.root_approval_sha256),'Explicit actual B7/report and root18-approval SHA pins required')
    def pin(file,expected=None):
        file=Path(file);h=digest(file)
        require(expected is None or h==expected,'Input SHA mismatch '+str(file))
        key=str(file.resolve());require(key not in frozen or frozen[key]==h,'Conflicting pin '+key);frozen[key]=h
        return h
    pin(ORIGINAL,ORIGINAL_SHA);pin(ASSEMBLER,ASSEMBLER_SHA);pin(B7_HELPER,B7_SHA)
    for name,h in BASE_PINS.items():pin(B4/name,h)
    b=load(B4/'prepared.json');v=load(B4/'composite-provenance.json')
    bd=load(B4/'final-held-dimensions.json');ba=load(B4/'blender/desk/anchors.json')
    anchors_file=C/'blender/desk/anchors.json';pin(anchors_file);aa=load(anchors_file)
    bp=load(B4/'blender/delivered-camera-poses.json')['poses']
    for parent,folder in[(b,B4),(prepared,C)]:
        for name,h in parent['outputHashes'].items():pin(folder/name,h)
        for name,h in parent['protectedInputSha256'].items():pin(Path(name)if Path(name).is_absolute()else W/name,h)
    require(prepared['frames']==10700 and prepared['fps']==30 and prepared['cache']==str(B5),'Wrong prepared candidate')
    require(prepared['all759NumericPrincipalMeasurementsPreserved']and prepared['all10700ActualSourceMappingsVerified']and prepared['onlyB7HandNeedleTransformDerivative'],'Final5 assembler completion facts missing')
    exported_file=C/'export.json';pin(exported_file);exported=load(exported_file)
    require(exported['frames']==10700 and Path(exported['video']).resolve()==Path(m['video']).resolve()and exported['sha256']==m['videoSha256'],'Manifest is not the exact final5 export')
    require(exported['preparedSha256']==m['preparedSha256']==digest(C/'prepared.json')and m['provenanceSha256']==digest(C/'composite-provenance.json'),'Encoded/extracted candidate is not this prepared source map')
    pin(Path(m['video']),m['videoSha256'])
    require(p['basePreparedSha256']==BASE_PINS['prepared.json']and p['baseProvenanceSha256']==BASE_PINS['composite-provenance.json'],'Wrong unchanged B4 basis')
    info=p['inputReports']['B7'];require(info==prepared['inputReports']['B7'],'Prepared/provenance B7 disagreement')
    require(Path(info['helper']).resolve()==B7_HELPER.resolve()and info['helperSha256']==B7_SHA,'Wrong B7 helper')
    report=Path(info['path']);pin(report,a.b7_report_sha256);require(info['sha256']==a.b7_report_sha256,'Assembler used another B7 report')
    approval=Path(info['rootApproval']);pin(approval,a.root_approval_sha256);require(info['rootApprovalSha256']==a.root_approval_sha256,'Assembler used another actual18-eye receipt')
    r=load(report);eye=load(approval)
    require(r['mode']=='probe'and r['helperSha256']==B7_SHA and r['baseCache']==str(B4),'Require actual B7 probe, not audit')
    for key,name in[('basePreparedSha256','prepared.json'),('baseProvenanceSha256','composite-provenance.json'),('baseCameraPosesSha256','blender/delivered-camera-poses.json')]:require(r[key]==BASE_PINS[name],'B7 basis changed '+key)
    require(r['fullFilmFrames']==10700 and r['fps']==30 and r['actualSources']==r['replacementOutputs']==r['actualPatchRenders']==16 and r['actualContextRenders']==2 and r['actualGuardedStates']==18,'Require exactly16 actual replacements plus2 contexts')
    require(r['allGuardedStatesPass']and r['allPatchFramesActuallyRendered']and r['cameraPosesUnchanged']and r['cueTimesAndStartsUnchanged']and r['newActionsEvaluateOutputTime'],'B7 guards incomplete')
    require(r['changedChannelsOnly']==CHANNELS and r['contextOnlyFrames']==CONTEXT and r['vaneTouched']is False,'Unauthorized B7 scope')
    require(r['allOriginalGateNGPreserved']and r['automaticGateExemption']is False and r['finalAcceptance']is False,'Original NG must stay unchanged')
    require(not r.get('error')and not r.get('cleanupError')and r['restorationOffenders']==[]and r['protectionChecks']and all(x is True for x in r['protectionChecks'].values()),'B7 preservation failed')
    for name,h in r['protectedInputSha256'].items():pin(Path(name)if Path(name).is_absolute()else W/name,h)
    mapping={int(j):int(k)for j,k in r['replacementFrameToActualPatchFrame'].items()}
    require(mapping=={j:j for j in PATCH}and not set(mapping).intersection(b6_mapping),'B7 identity16 map must be disjoint from unchanged B6 branch')
    refs={int(j):int(k)for j,k in r['patchFrameToUnchangedOtherObjectSourceFrame'].items()}
    require(r['patchFrameToUnchangedOtherObjectSourceFrame']==r['patchFrameToUnchangedObjectSourceFrame']and set(refs)==set(PATCH),'B7 other-object provenance mismatch')
    images={im['frame']:im for im in r['actualImages']};physical={x['frame']:x for x in r['physical']}
    require(len(r['actualImages'])==len(r['physical'])==18 and sorted(images)==sorted(physical)==ALL,'Require every actual/context state')
    viewer=eye.get('actualViewer',eye.get('reviewer'))
    require(eye['approved']is True and eye['helperSha256']==B7_SHA and eye['probeReportSha256']==a.b7_report_sha256 and eye['allRequiredProbeImagesPersonallyViewed']is True,'Missing root-approved exact probe18 receipt')
    require(isinstance(viewer,str)and viewer.strip()and eye['viewedImageCount']==18,'Probe-eye attribution must name the actual18-image viewer')
    require(eye['reviewedImageSha256']=={im['path']:im['sha256']for im in r['actualImages']},'Root receipt must cover all16 delivery and2 context actual JPEGs')
    require(info['deliveryFrames']==PATCH and info['contextFramesReviewed']==CONTEXT and info['contextEyesNotClaimed']==[],'Assembler probe scope differs from actual receipt')
    require(len(poses)==len(bp)==10700 and poses==bp,'B7 camera array changed')
    require(len(p['records'])==len(v['records'])==10700 and p['inputReports']['B6']==v['inputReports']['B6'],'Retain whole B4/B6 source lineage')
    require(sorted(aa['anchors'])==sorted(ba['anchors'])and all(len(x)==10700 for x in aa['anchors'].values())and all(len(x)==10700 for x in ba['anchors'].values()),'Whole10700 anchors required')
    memo={}
    def raw_sha(file):
        real=str(Path(file).resolve())
        if real not in memo:memo[real]=digest(real)
        return memo[real]
    for j in ALL:
        im=images[j];ph=physical[j];old=v['records'][j];file=Path(r['raw'])/('%05d.jpg'%j)
        require(Path(im['path']).resolve()==file.resolve()and file.is_file()and not file.is_symlink()and raw_sha(file)==im['sha256'],'Actual B7 JPEG absent/changed')
        pin(file,im['sha256']);require(im['contextOnly']==ph['contextOnly']==(j in CONTEXT),'Context flag mismatch')
        require(ph['frame']==j and ph['time']==j/30 and ph['pass']and ph['allVerticesEvaluated']and ph['allNonAuthorizedObjectChannelsUnchanged'],'Actual geometry proof absent')
        require(ph['unchangedOtherObjectSourceFrame']==old['originalObjectSourceFrame']and same_pose(ph['pose'],poses[j]),'Actual B7 source/camera mismatch')
        require(ph['operationTime']==(j/30 if j in PATCH else None),'B7 operation time must not use held object time')
        change=ph['explicitChanges'];rock=change['principalRockActualWorldVerticesSha256']
        require(exact_sha(rock)and rock==change['principalRockBaselineWorldVerticesSha256']and change['principalRockWorldGeometryUnchanged'],'Principal rock world geometry changed')
        box=ph['box'];needle=ph['sixthNeedleBox']
        require(.4<=ph['widthRatio']<=.7 and abs((box[2]-box[0])/1080-ph['widthRatio'])<1e-9 and box[0]>=40 and box[2]<=1040 and box[1]>=110 and box[3]<=1600,'Real rock guard failed; no heuristic waiver')
        require(needle[0]>=0 and needle[2]<=1080 and needle[1]>=110 and needle[3]<=1600,'Actual sixth needle not caption-safe')
        projected=r['anchorProjectionsByActualFrame'][str(j)]
        require(sorted(projected)==sorted(ba['anchors'])and all(len(x)==3 and all(math.isfinite(float(n))for n in x)for x in projected.values()),'B7 anchor names/values changed')
    for j,(new,old)in enumerate(zip(p['records'],v['records'])):
        require(new['frame']==old['frame']==j,'Whole-film frame order changed')
        for folder,record in[(C,new),(B4,old)]:
            require((folder/'blender/desk'/('%05d.jpg'%j)).resolve()==Path(record['source']).resolve()and raw_sha(record['source'])==record['sha256'],'Whole10700 actual-source SHA/realpath mismatch')
        if j not in mapping:
            require(new==old and all(aa['anchors'][n][j]==ba['anchors'][n][j]for n in ba['anchors']),'An output outside the16 B7 frames changed')
            continue
        ph=physical[j];im=images[j]
        expected={**old,'source':im['path'],'sha256':im['sha256'],'kind':'actual-B7-sixth-needle-and-kai-hand-carry-only','actualPatchFrame':j,
            'originalPhysicalStateExplicitlyCorrected':True,'newActionsEvaluatedAtOutputTime':True,'previousB4Record':old,
            'B7ExplicitChangedChannels':CHANNELS,'B7OriginalOtherObjectReference':old['originalObjectSourceFrame'],'B7OperationTime':j/30,
            'B7PrincipalRockWorldVerticesSha256':ph['explicitChanges']['principalRockActualWorldVerticesSha256']}
        require(new==expected and refs[j]==old['originalObjectSourceFrame'],'B7 record changes exceeded explicit hand/needle scope')
        require(all(aa['anchors'][n][j]==r['anchorProjectionsByActualFrame'][str(j)][n]for n in ba['anchors']),'B7 anchors do not describe actual patch')
    require(len(dims['samples'])==len(bd['samples'])==759,'All759 physical samples required')
    changed=[]
    for new,old in zip(dims['samples'],bd['samples']):
        j=new['frame'];require(j==old['frame'],'Physical sample order changed')
        if j not in mapping:require(new==old,'An unchanged physical sample changed');continue
        ph=physical[j];im=images[j]
        require(new['previousB4Measurement']==old and new['originalNumericMeasurementPreserved']and not new['measurementRecomputed']and new['physicalHandNeedleDerivativeExplicit'],'Rock measurement reuse must be explicit')
        expected={**old,**{k:new[k]for k in['previousB4Measurement','actualPatchedFrame','measurementSource','B7RawSource','B7RawSha256','B7ReportSha256','B7PrincipalRockWorldVerticesSha256','originalNumericMeasurementPreserved','measurementRecomputed','physicalHandNeedleDerivativeExplicit']}}
        require(new==expected and old['principal']=='terrella'and new['actualPatchedFrame']==j,'759 sample numeric/identity fields changed')
        require(new['B7RawSource']==im['path']and new['B7RawSha256']==im['sha256']and new['B7ReportSha256']==a.b7_report_sha256 and new['B7PrincipalRockWorldVerticesSha256']==ph['explicitChanges']['principalRockActualWorldVerticesSha256'],'Physical-to-B7 SHA lineage mismatch')
        require(same_pose(new['deliveredCameraPose'],ph['pose'])and same_box(new['box'],ph['box'])and abs(new['widthRatio']-ph['widthRatio'])<=1e-9,'Reused rock measurement disagrees with actual evaluated B7 geometry')
        changed.append(j)
    require(changed==[4125,4140],'Exactly two714-grid numeric samples acquire B7 provenance')
    proof=dims['B7PreservedRockMeasurementEvidence'];require(proof['reportSha256']==a.b7_report_sha256 and Path(proof['report']).resolve()==report.resolve()and proof['affectedSampleFrames']==changed and proof['all759NumericPrincipalMeasurementsPreserved']and proof['newRawSourceProvenanceExplicit'],'Missing759 preservation proof')
    return {'mapping':mapping,'physical':physical,'images':images,'report':str(report),'reportSha256':a.b7_report_sha256,'helperSha256':B7_SHA,
        'rootProbeApproval':str(approval),'rootProbeApprovalSha256':a.root_approval_sha256,'rootProbeActualViewer':viewer,
        'rootProbe18ApprovedNotFinalMp4Eyes':True,'unchangedOutputs':10684,'all10700SourceAndAnchorMappingsVerified':True,'all759NumericPhysicalSamplesPreserved':True,
        'new714GridRows':[4125,4140],'originalB6BranchUnchanged':True,'featuresRecomputed':False,'automaticWaiverApplied':False,'finalAcceptance':False}

def b7_delivery(ctx,j,row,record,measured,pose):
    ph=ctx['physical'][j];change=ph['explicitChanges']
    require(ph['cue']==row['cue']and same_pose(ph['pose'],pose),'B7 exact sample cue/camera mismatch')
    return {'kind':'actual-B7-sixth-needle-and-kai-hand-carry-only','actualFrame':j,'otherObjectSourceFrame':record['originalObjectSourceFrame'],
        'operationTime':j/30,'explicitChangedChannels':CHANNELS,'explicitChanges':change,'sixthNeedleBox':ph['sixthNeedleBox'],
        'principal':measured['principal'],'principalDefinition':measured.get('principalDefinition'),'evaluatedGeometry':True,
        'principalRockWorldGeometryUnchanged':True,'rockMeasurementPreservedNotRecomputed':True,'previousB4Physical':measured['previousB4Measurement'],
        'cameraEvidence':'Exact B4 delivered camera; evaluated rock world-vertex bytes equal before/after. Only needle/hand change; actual occlusion is separately eye-reviewed.',
        'probeApprovalIsNotFinalEncodedEyeReview':True,'reportSha256':ctx['reportSha256']}

def review_pages(manifest,eyes):
    supplied={}
    if eyes:
        entries=load(eyes).get('pages',[]);supplied={str(Path(x['file']).resolve()):x for x in entries}
        require(len(supplied)==len(entries),'Duplicate page-eye decisions')
    pages=[]
    for file in manifest['halfSeconds']['pages']:
        h=digest(file);decision=supplied.pop(str(Path(file).resolve()),None)
        row={'file':file,'sha256':h,'actuallyViewed':False,'status':'pending','pageEyeNotInferredFromHashOrSampleEyes':True}
        if decision is not None:
            require(decision['sha256']==h,'Page-eye decision refers to another actual sheet')
            if decision.get('actuallyViewed')is True:
                viewer=decision.get('actualViewer',decision.get('reviewer'));require(isinstance(viewer,str)and viewer.strip(),'Actual page viewer attribution required')
                row.update(actuallyViewed=True,status='viewed',actualViewer=viewer,suppliedDecision=decision)
        pages.append(row)
    require(not supplied and len(pages)==72,'Only the exact72 actual714-grid pages may be attributed')
    return pages

def main():
    require(digest(ORIGINAL)==ORIGINAL_SHA,'Immutable original evidence join changed')
    original=ORIGINAL.read_text();text=original;boundaries=[]
    def replace(before,after):
        nonlocal text
        require(text.count(before)==1,'Adapter boundary is not unique: '+before[:90]);text=text.replace(before,after,1);boundaries.append((before,after))
    replace("Path('/private/tmp/ys/ys-chain-b1v1-final4-20261024')","Path('/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025')")
    replace("Path('/private/tmp/ys/ys-chain-b1v1-integrated-b6-v2-20261024/render/report.json')","Path('/private/tmp/ys/ys-chain-b1v1-integrated-b6-v6-owned-resume-v2-20261025/render/report.json')")
    replace("W/'scripts/blender/desk_axes_b1_integrated_b6_v2_20261024.py'","W/'scripts/blender/desk_axes_b1_integrated_b6_v6_20261024.py'")
    replace("    for n in ('npz','quality','manifest','eyes','out'):ap.add_argument('--'+n,type=Path)","    for n in ('npz','quality','manifest','eyes','out'):ap.add_argument('--'+n,type=Path)\n    ap.add_argument('--b7-report-sha256');ap.add_argument('--root-approval-sha256')")
    replace("C/'b6-v2-final-original7b-delivered-evidence.json'","C/'final5-carry-original7b-delivered-evidence.json'")
    needle="    require(len(physical)==len(images)==r['actualSources'],'All new B6 sources need numeric and actual JPEG evidence')"
    replace(needle,needle+"\n    b7=validate_b7(a,C,p,prepared,poses,dims,m,frozen,mapping)")
    replace("        if j in mapping:\n            k=mapping[j]","        if j in b7['mapping']:\n            delivery=b7_delivery(b7,j,row,record,measured,poses[j])\n        elif j in mapping:\n            k=mapping[j]")
    replace("    pages=[{'file':file,'sha256':sha(file),'actuallyViewedNotInferredFromHash':True} for file in m['halfSeconds']['pages']];require(len(pages)==72,'All714 actual images/72pages required')","    pages=review_pages(m,a.eyes)")
    replace("'candidate':'Exact final B3+B6 v2 actual encoded MP4; original older candidates preserved'","'candidate':'Exact final5 encoded B4-owned-resume-v2 plus16 approved B7 hand/needle sources; all older candidates preserved','B7CompleteDeltaEvidence':{k:v for k,v in b7.items()if k not in ('mapping','physical','images')}")
    replace("'exactFrameJoin':'original desk_t*30 == final outputj == extracted MP4j; B6 j→actualk→other-object-ref + explicit output-time actions; else exact byte-identical B3 source and camera'","'exactFrameJoin':'original desk_t*30 == final outputj == extracted MP4j; B7 identity16 actualj→unchanged-other-object-ref, exact rock SHA/camera and explicit needle/hand output-time actions; unchanged original B6 branch; else exact B3 raw/camera'")
    replace("'newB6GridRows':sum(j in mapping for j in range(0,10700,15))","'newB6GridRows':sum(j in mapping for j in range(0,10700,15)),'newB7GridRows':sum(j in b7['mapping']for j in range(0,10700,15)),'explicitlyViewedPages':sum(x['actuallyViewed']for x in pages)")
    inverse=text
    for before,after in reversed(boundaries):
        require(inverse.count(after)==1,'Inverse adapter boundary ambiguous');inverse=inverse.replace(after,before,1)
    require(inverse==original,'Inverse comparison to immutable original failed')
    scope={'__name__':'b1_final5_evidence_private','__file__':str(Path(__file__).resolve()),'validate_b7':validate_b7,'b7_delivery':b7_delivery,'review_pages':review_pages}
    exec(compile(text,str(ORIGINAL)+' [private exact-boundary adapter]','exec'),scope)
    original_eye=scope['eye_disposition']
    def attributed_eye(row,decision):
        if decision and decision.get('actuallyViewed')is True:
            viewer=decision.get('reviewer');require(isinstance(viewer,str)and viewer.strip(),'Actual714-sample viewer attribution required')
        return original_eye(row,decision)
    scope['eye_disposition']=attributed_eye
    scope['main']()

if __name__=='__main__':
    try:main()
    except (AssertionError,ValueError,KeyError,OSError)as e:print('STOP: '+str(e),file=sys.stderr);sys.exit(2)
