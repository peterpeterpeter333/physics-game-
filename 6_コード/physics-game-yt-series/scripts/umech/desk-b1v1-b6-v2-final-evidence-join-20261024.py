"""CPU-only exact714-grid B3/B6/actual-MP4 evidence join; never a gate waiver.

Run only after final B6 render, E's new assembler, original inspectors and
actual-MP4 extraction complete. All old B3 NG/NPZ714 rows are retained too.
No image decoding, feature recalculation, rendering, encoding or source edits.
Optional --eyes must describe this exact new MP4/JPEG, not an old candidate.
"""
import argparse,hashlib,importlib.util,json,math,sys
from collections import Counter
from pathlib import Path
import numpy as np

W=Path(__file__).resolve().parents[2];ID='ys-chain-b1v1';LEGACY=W/'scripts/umech/audit-desk-b1v1-final2-proxy-physical.py'
spec=importlib.util.spec_from_file_location('b1_preserved_proxy_algorithm',LEGACY);old=importlib.util.module_from_spec(spec);spec.loader.exec_module(old)
require=old.require;sha=old.sha;read=old.read_json
FLAGS=('correctPrincipal','visibleReadable','unoccluded','captionClear','geometryDefinitionAccepted')
def equal_pose(a,b):return len(a)==len(b)==7 and all(math.isfinite(float(x)) and abs(x-y)<1e-9 for x,y in zip(a,b))
def equal_box(a,b):return len(a)==len(b)==4 and all(math.isfinite(float(x)) and abs(x-y)<1e-8 for x,y in zip(a,b))
def original_npz(p,quality,th):
    with np.load(p,allow_pickle=False) as z:
        require(z['feat_names'].tolist()==old.FEATURES,'Original NPZ feature order changed')
        times=z['desk_t'].copy();features=z['desk_feat'].copy()
    require(features.shape==(714,6) and np.isfinite(features).all(),'All714 original features required')
    require(np.array_equal(times,np.arange(714,dtype=float)*.5),'Exact original714 grid required')
    summary=old.original_summary(features,th)
    for k in ('samples','subject_median','subject_small_ratio','subject_small_runs','sparse_longest','sparse_ratio','sparse_runs'):
        require(summary[k]==quality['metrics'][k],'Original metric mismatch '+k)
    require(quality['id']==ID and quality['metrics']['world_source']=='desk','Wrong episode/world source')
    for k,v in th.items():require(quality['thresholds'][k]==v,'Original threshold changed '+k)
    original_rows=[v for v in quality['results'] if str(v['no']) in {'7','7b'}];require(len(original_rows)==2,'Both original numeric statuses required')
    for v in original_rows:require(v['status']==summary['gate7OriginalStatus' if str(v['no'])=='7' else 'gate7bOriginalStatus'],'Original numeric status differs from its preserved values')
    return times,features,summary
def eye_disposition(row,decision):
    result={'status':'pending','approvedException':False,'rootAcceptanceClaimedByThisHelper':False}
    if decision is None:return result
    require(decision.get('actualJpegSha256')==row['actualJpegSha256'],'Eye decision refers to another JPEG')
    require(decision.get('frame')==row['actualMp4Frame'],'Eye frame mismatch')
    viewed=decision.get('actuallyViewed') is True;result.update(status='viewed' if viewed else 'pending',suppliedDecision=decision)
    if decision.get('approvedSupplement'):
        require(viewed and decision.get('reviewer')=='root','Only explicit root actual-eye decision may approve a case')
        require(all(decision.get(k) is True for k in FLAGS),'Incomplete actual-eye findings')
        require(row['supplementEvidenceEligible'],'True clip/width or hidden face cannot be waived as a proxy discrepancy')
        result['approvedException']=True;result['approvalSource']='Explicit supplied root decision; original numerical NG remains unchanged'
    return result
def self_test():
    old.self_test();row={'actualJpegSha256':'x','actualMp4Frame':15,'supplementEvidenceEligible':True}
    require(not eye_disposition(row,None)['approvedException'],'No automatic approval')
    decision={'frame':15,'actualJpegSha256':'x','actuallyViewed':True,'reviewer':'root','approvedSupplement':True,**{k:True for k in FLAGS}}
    require(eye_disposition(row,decision)['approvedException'],'Explicit complete case evidence test')
    for badrow,bad in [(row,{**decision,'actualJpegSha256':'wrong'}),({**row,'supplementEvidenceEligible':False},decision),(row,{**decision,'actuallyViewed':False})]:
        try:eye_disposition(badrow,bad)
        except ValueError:pass
        else:raise AssertionError('Incorrect evidence must not be accepted')
    print(json.dumps({'selfTest':'PASS','syntheticOnly':True,'renders':0,'finalAcceptance':False}))
def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--self-test',action='store_true')
    ap.add_argument('--base',type=Path,default=Path('/private/tmp/ys/ys-chain-b1v1-final3-20261024'))
    ap.add_argument('--final',type=Path,default=Path('/private/tmp/ys/ys-chain-b1v1-final4-20261024'))
    ap.add_argument('--b6-report',type=Path,default=Path('/private/tmp/ys/ys-chain-b1v1-integrated-b6-v2-20261024/render/report.json'))
    ap.add_argument('--b6-helper',type=Path,default=W/'scripts/blender/desk_axes_b1_integrated_b6_v2_20261024.py')
    for n in ('npz','quality','manifest','eyes','out'):ap.add_argument('--'+n,type=Path)
    a=ap.parse_args()
    if a.self_test:self_test();return
    C=a.final;B=a.base;out=a.out or C/'b6-v2-final-original7b-delivered-evidence.json';require(not out.exists() and not out.is_symlink(),'Preserve prior evidence')
    npz=a.npz or C/'validation-final-v1/quality-frames-original.npz';quality=a.quality or npz.parent/'quality-gate.json';manifest=a.manifest or C/'actual-mp4-review/manifest.json'
    bnpz=B/'validation-final-v1/quality-frames-original.npz';bquality=B/'validation-final-v1/quality-gate.json'
    paths=[npz,quality,manifest,bnpz,bquality,C/'prepared.json',C/'composite-provenance.json',C/'final-held-dimensions.json',C/'blender/delivered-camera-poses.json',C/'blender/data.json',B/'prepared.json',B/'composite-provenance.json',B/'final-held-dimensions.json',B/'blender/delivered-camera-poses.json',a.b6_report,a.b6_helper,LEGACY,old.GATE,old.FRAME_GATE,old.FRAME_SOURCE,Path(__file__)]
    if a.eyes:paths.append(a.eyes)
    require(all(p.is_file() for p in paths),'Completed exact inputs required; no nominal-time fallback')
    frozen={str(p.resolve()):sha(p) for p in paths};q=read(quality);bq=read(bquality);m=read(manifest);p=read(C/'composite-provenance.json');bp=read(B/'composite-provenance.json');prepared=read(C/'prepared.json');bprepared=read(B/'prepared.json');r=read(a.b6_report)
    require(r['mode']=='render' and r['allPatchFramesActuallyRendered'] and r['allGuardedStatesPass'] and r['allHeldDependenciesMapped'],'Actual B6 completion required')
    require(r['B4FitAndB5V4PhasesRetained'] is True,'Require new B6 v2 / B4v2 / B5v4, not an older failed dependency version')
    require(r['helperSha256']==sha(a.b6_helper) and r['b3PreparedSha256']==sha(B/'prepared.json'),'B6 report/helper/base pin disagreement')
    require(all(r['protectionChecks'].values()) and r['originalInspectorModified'] is False and r['finalAcceptance'] is False,'B6 original protections required')
    for parent,folder in [(prepared,C),(bprepared,B)]:
        for relative,h in parent['outputHashes'].items():require(sha(folder/relative)==h,'Prepared source output changed '+relative)
        for file,h in parent['protectedInputSha256'].items():
            f=Path(file) if Path(file).is_absolute() else W/file;require(sha(f)==h,'Prepared protected input changed '+str(f));frozen[str(f.resolve())]=h
    for relative,h in prepared['outputHashes'].items():require(sha(C/relative)==h,'Final prepared output changed '+relative)
    require(len(p['records'])==len(bp['records'])==10700 and p['originalInputsAndNGPreserved'],'Exact whole-film source map required')
    require(p.get('originalPlannerNotCertifiedAsCanonicalPass') is True,'Retain original3696 vs post-calibration3755 planner discrepancy')
    require(p['inputReports']['B6']['sha256']==sha(a.b6_report),'Assembler must use this exact B6 render report')
    poses=read(C/'blender/delivered-camera-poses.json')['poses'];bposes=read(B/'blender/delivered-camera-poses.json')['poses'];require(len(poses)==len(bposes)==10700,'Whole delivered pose arrays required')
    dims=read(C/'final-held-dimensions.json');bdims=read(B/'final-held-dimensions.json');require(len(dims['samples'])==len(bdims['samples'])==759,'Preserve all759, not only714 grid samples')
    ph=old.dimension_index(dims['samples']);bph=old.dimension_index(bdims['samples']);physical={v['frame']:v for v in r['physical']};mapping={int(j):int(k) for j,k in r['replacementFrameToActualPatchFrame'].items()};refs={int(k):int(v) for k,v in r['patchFrameToUnchangedOtherObjectSourceFrame'].items()};images={v['frame']:v for v in r['actualImages']}
    require(len(physical)==len(images)==r['actualSources'],'All new B6 sources need numeric and actual JPEG evidence')
    require(m['id']==ID and m['fps']==30 and m['expectedFrames']==10700,'Wrong actual MP4 manifest')
    video=Path(m['video']);require(video.is_file() and sha(video)==m['videoSha256'],'Hash exact delivered MP4, not merely manifest claim');require(Path(q['mp4']).resolve()==video.resolve(),'Original inspector checked a different MP4')
    data=read(C/'blender/data.json')['b1'];th=old.source_thresholds();times,features,summary=original_npz(npz,q,th);bt,bfeatures,bsummary=original_npz(bnpz,bq,th);require(np.array_equal(times,bt),'Preserved B3 grid changed')
    rows=old.join_rows(times,features,dims,m,data,th);eye={}
    if a.eyes:
        e=read(a.eyes);require(e['mp4Sha256']==m['videoSha256'],'Do not reuse earlier candidate eyes');eye={d['frame']:d for d in e['samples']};require(len(eye)==len(e['samples']),'Duplicate eye decisions')
    memo={};raw_evidence={}
    def raw_sha(path):
        real=str(Path(path).resolve())
        if real not in memo:memo[real]=sha(real)
        return memo[real]
    for row in rows:
        j=row['actualMp4Frame'];record=p['records'][j];base_record=bp['records'][j];measured=ph[j];base_measured=bph[j]
        require(record['frame']==base_record['frame']==j,'Source map frame mismatch');raw=Path(record['source']);chosen=C/'blender/desk'/('%05d.jpg'%j)
        require(chosen.resolve()==raw.resolve() and raw_sha(raw)==record['sha256'],'Final actual raw wrong or changed')
        if j in mapping:
            k=mapping[j];v=physical[k];ref=refs[k];expected=Path(r['raw'])/('%05d.jpg'%k)
            require(raw.resolve()==expected.resolve() and raw_sha(raw)==images[k]['sha256'],'Wrong actual B6 source JPEG')
            require(record['actualPatchFrame']==k and record['originalObjectSourceFrame']==ref and v['unchangedOtherObjectSourceFrame']==ref,'B6 actualk/other-source ref mismatch')
            require(v['cue']==row['cue'] and v['operationTime']==k/30 and v['pass'] and v['evaluatedGeometry'],'Wrong B6 semantic/action frame')
            require(equal_pose(v['pose'],poses[j]) and equal_box(v['box'],measured['box']) and abs(v['widthRatio']-measured['widthRatio'])<1e-10,'New dimensions do not describe delivered B6 camera/geometry')
            require(record['originalPhysicalStateExplicitlyCorrected'] and measured['originalPhysicalStateExplicitlyCorrected'],'B6 model actions must not be mislabeled unchanged')
            delivery={'kind':'actual-integrated-B6-derivative','actualFrame':k,'otherObjectSourceFrame':ref,'operationTime':k/30,'phaseValues':v['phaseValues'],'principal':measured['principal'],'principalDefinition':measured['principalDefinition'],'criticalBox':v['criticalBox'],'retiringSecondaryPropsBox':v['retiringSecondaryPropsBox'],'evaluatedGeometry':True,'modelActionDerivativesExplicit':True}
        else:
            require(raw.resolve()==Path(base_record['source']).resolve() and record['sha256']==base_record['sha256'],'Unchanged output must be exact B3 source')
            require(equal_pose(poses[j],bposes[j]) and equal_box(measured['box'],base_measured['box']) and abs(measured['widthRatio']-base_measured['widthRatio'])<1e-10,'Unchanged B3 measurement/camera changed')
            delivery={'kind':'exact-byte-identical-B3-delivered-raw','actualFrame':base_record.get('actualPatchFrame'),'originalOtherObjectSourceFrame':record['originalObjectSourceFrame'],'retainedOriginalPlan':record['retainedOriginalPlan'],'originalB3ModelCorrectionsPreserved':True,'resolvedStoredActualJpeg':str(raw.resolve()),'cameraEvidence':'Exact delivered B3 pose and B3 physical record, verified by unchanged raw SHA; never reevaluate at nominal output time','principal':measured['principal'],'principalDefinition':measured.get('principalDefinition'),'evaluatedGeometry':measured.get('evaluatedGeometry',False),'notNominalOutputTimeReevaluation':True}
        image=Path(row['actualJpeg']);require(image.is_file(),'Missing actual MP4 extraction');image_sha=sha(image);row['actualJpegSha256']=image_sha
        manifest_image=next(v for v in m['halfSeconds']['frames'] if v['frame']==j);require(manifest_image.get('sha256')==image_sha,'Actual encoded JPEG changed after extraction')
        original_candidate=row['originalHeuristicFlags']['subjectBelow35'] or row['originalHeuristicFlags']['sparseCandidate'];hidden=row['compositeFaceHint']['kind'].startswith('full_screen_face')
        row['supplementEvidenceEligible']=bool(original_candidate and measured['within40to70'] and not measured['clipped'] and not hidden)
        row.update(deliveredSource={'outputFrame':j,'source':str(raw),'rawSha256':record['sha256'],'pose':poses[j],**delivery},preservedB3Physical=base_measured,preservedB3OriginalFeatures={name:float(bfeatures[row['sampleIndex'],i]) for i,name in enumerate(old.FEATURES)},originalNumericStatusNeverReplaced=True,actualEyeReview=eye_disposition(row,eye.get(j)))
        row['physical'].pop('notAnEvaluatedModifierOrOcclusionAudit',None);row['physical'].update(notAnOcclusionOrPixelVisibilityAudit=True,evaluatedGeometryProof=delivery['evaluatedGeometry'])
        raw_evidence[str(raw.resolve())]=record['sha256']
    pages=[{'file':file,'sha256':sha(file),'actuallyViewedNotInferredFromHash':True} for file in m['halfSeconds']['pages']];require(len(pages)==72,'All714 actual images/72pages required')
    require(all(sha(path)==h for path,h in frozen.items()) and all(sha(path)==h for path,h in raw_evidence.items()),'Evidence changed during read-only join')
    result={'id':ID,'candidate':'Exact final B3+B6 v2 actual encoded MP4; original older candidates preserved','inputsSha256':frozen,'mp4':str(video),'mp4Sha256':m['videoSha256'],'method':{'exactFrameJoin':'original desk_t*30 == final outputj == extracted MP4j; B6 j→actualk→other-object-ref + explicit output-time actions; else exact byte-identical B3 source and camera','npzArraysLoadedOnly':['feat_names','desk_t','desk_feat'],'featuresRecomputed':False,'rendersOrEncodesPerformed':False,'additionalGuiRequired':False,'all714Joined':True,'all759PhysicalSamplesPreserved':True},'originalFinalGateResultsRetainedVerbatim':q['results'],'originalFinalFeatureSummary':summary,'preservedB3GateResultsVerbatim':bq['results'],'preservedB3OriginalFeatureSummary':bsummary,'originalThresholds':th,'samples':rows,'other45PhysicalSamplesPreservedVerbatim':[v for v in dims['samples'] if not float(v['sampleTime']*2).is_integer()],'actualReviewPages':pages,'summary':{'samples':714,'newB6GridRows':sum(j in mapping for j in range(0,10700,15)),'dispositions':dict(Counter(v['reviewDisposition'] for v in rows)),'explicitlyViewed':sum(v['actualEyeReview']['status']=='viewed' for v in rows),'explicitRootCaseDecisions':sum(v['actualEyeReview']['approvedException'] for v in rows)},'everyOriginalNGPreserved':True,'automaticGate7or7bWaiverApplied':False,'rootFinalAcceptanceNotClaimed':True,'actualEyeReviewRequired':True,'allActuallyViewed':all(v['actualEyeReview']['status']=='viewed' for v in rows),'earsVerified':False,'finalPassed':False}
    with out.open('x') as f:json.dump(result,f,ensure_ascii=False,indent=1,allow_nan=False);f.write('\n')
    print(json.dumps({'out':str(out),'samples':714,'rootFinalAcceptanceClaimed':False,'eyesPending':not result['allActuallyViewed'],'finalPassed':False}))
if __name__=='__main__':
    try:main()
    except (AssertionError,ValueError,KeyError,OSError) as e:print('STOP: '+str(e),file=sys.stderr);sys.exit(2)
