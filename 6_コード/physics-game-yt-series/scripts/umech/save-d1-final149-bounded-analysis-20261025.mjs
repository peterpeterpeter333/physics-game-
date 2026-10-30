// NEW CPU evidence analysis only. Original false flags remain false.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';
assert(process.argv.includes('--authorized'));
const self=fileURLToPath(import.meta.url),W=fileURLToPath(new URL('../../',import.meta.url));
const F='/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025',O=path.join(W,'outputs/axes-20261023');
const p=F+'/final-composite-physical-v6-actual-anchor-evidence-20261025.json';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
assert.equal(sha(p),'9bcc39fda77012cff9154c8cc21703ba2a92480f924416df105fb560cc97faf6');
const j=read(p),side=j.actualAnchorAndSourceBoxEvidence;assert.equal(sha(side.path),side.sha256);
const s=read(side.path),rowByFrame=new Map(j.rows.map(r=>[r.deliveredFrame.frame,r]));
const coord=b=>Array.isArray(b)?b:b?[b.x0,b.y0,b.x1,b.y1]:null;
const sourceMismatches=s.sourceBoxes.filter(r=>r.sourceBoxMatchesAt1eMinus9===false).map(r=>{
 const a=coord(r.historicalActualSurface),b=coord(r.newlyEvaluatedActualSurface),row=rowByFrame.get(r.frame);
 return{frame:r.frame,time:r.frame/30,actualSourceFrame:r.actualRawSourceFrame,layer:r.layer,
  sourceRole:r.sourceSemanticPrincipal,currentRole:row.semanticPrincipal,sourceReport:r.sourceRecord,sourceReportSha256:r.sourceReportSha256,
  sourceBox:a,newSemanticBox:b,maxAbsCoordinateDifferencePixels:Math.max(...a.map((v,i)=>Math.abs(v-b[i]))),
  sourceComparisonAt1eMinus9StillFalse:true,originalPhysicalPass:row.pass,
  classification:'different floating-point composition order; not an original physical gate threshold or restored-world tolerance'};
});
assert.equal(sourceMismatches.length,105);assert(sourceMismatches.every(r=>r.layer==='four-cue-camera'&&r.sourceRole===r.currentRole));
assert(Math.max(...sourceMismatches.map(r=>r.maxAbsCoordinateDifferencePixels))<.001);
const canonicalLensByFrame={2925:43.37711094399976,2928:42.48034134399981,2940:40.03086294399996,
 5550:48.78829615407383,5560:44.24260133925876,5565:41.945309487407116};
const unresolved=s.anchors.filter(r=>!r.actualAnchorSourceProvenanceVerified).map(r=>{
 const row=rowByFrame.get(r.frame),oldLens=canonicalLensByFrame[r.frame];assert(oldLens);
 const ratio=row.actualPose[6]/oldLens,pre=r.historicalBeforeOverrideEvidence.canonicalSourceProjection;
 const residual=Math.max(...Object.keys(pre).flatMap(n=>[540+(pre[n][0]-540)*ratio,844.8+(pre[n][1]-844.8)*ratio]
  .map((v,i)=>Math.abs(v-r.preservedHistoricalAnchors[n][i]))));
 return{frame:r.frame,time:r.frame/30,cue:row.cue,unchangedOtherObjectSourceFrame:row.unchangedOtherObjectSourceFrame,
  actualCameraPose:row.actualPose,canonicalLensFromPureStageAST:oldLens,immediatelyAppliedCorrectedLens:row.actualPose[6],ratio,
  historicalMixedOldWorldNewLensMaxResidualFromRounded01PixelInputs:residual,
  residualIsApproximateCausalEvidenceNot1eMinus5Acceptance:true,
  sourceReason:'Old corrected_apply updates camera channels and lens after canonical apply update, then stage main times loop projects anchors before fresh dependency evaluation. Lens changes immediately while matrix_world is stale.',
  originalHistoricalAnchorEqualityStillFalse:true,beforeOverrideSimpleProofStillFalse:true,
  actualIndependentOwnedCameraProjectionExact:r.independentOwnedCameraProjectionExact,
  currentProjectionStoredInPinnedSidecar:true,automaticApproval:false};
});
assert.equal(unresolved.length,6);assert(unresolved.every(r=>r.historicalMixedOldWorldNewLensMaxResidualFromRounded01PixelInputs<.1));
const failures=j.rows.filter(r=>!r.pass).map(r=>({frame:r.deliveredFrame.frame,time:r.time,cue:r.cue,
 semanticPrincipal:r.semanticPrincipal,widthRatio:r.actualSurface?.widthRatio,box:coord(r.actualSurface),
 visibleObjects:r.actualSurface?.visibleObjectCount,physicalChecks:r.physicalChecks,criticalChecks:r.criticalChecks,
 faceHint:r.faceDeclarationHint,actualPose:r.actualPose,rawSource:r.deliveredFrame.raw,
 sourceBoxEvidence:r.independentSourcePhysicalBoxEvidence,
 disposition:'True measured width failure retained; actual image/root staging decision still separate'}));
assert.equal(failures.length,5);assert(failures.every(r=>r.physicalChecks.frameSafe));
const contacts='/private/tmp/ys/ys-chain-d1v1-final-physical-original-case-contacts-20261025/manifest.json';
assert.equal(sha(contacts),'311b1f3e6aad969a4cfc11c4b1e25e975e977f1c8159f0156090db69329c0098');
const proof62=path.join(O,'d1-production326-sourcebox-readonly-search-20261025.json');
assert.equal(sha(proof62),'40568c733903ae5f2aae0e8fbb96b3d4a0113549989d9400cadf01a1bda90b38');
const pins={[self]:sha(self),[p]:sha(p),[side.path]:side.sha256,[contacts]:sha(contacts),[proof62]:sha(proof62)};
for(const relative of['scripts/blender/desk_axes_d1_four_cue_camera_20261025.py','scripts/blender/desk_d1v1_semantic_audit_r9.py','scripts/blender/desk_axes_d1_camera_patch_v2_20261024.py','scripts/blender/desk_d1v1.py'])pins[path.join(W,relative)]=sha(path.join(W,relative));
const result={episode:'D-1',scope:'Read-only bounded actual149 analysis; no additional probe, decoder, renderer, encoder or acceptance',
 finalMp4:j.mp4,mp4Sha256:j.mp4Sha256,physicalReport:{file:p,sha256:pins[p]},actualAnchorSidecar:side,
 actualScope:{actualDecodedImageUnion:903,replayedPhysicalFrames:846,original546PhysicalRequestsUnchanged:true,
  actualCueEndFramesNotSeparatelyGeometryReplayed:57,all903PixelEyesBelongToSeparateAttributedRootTeamReceipts:true,
  notClaim903GeometryReplays:true},
 preservation:{checks23:j.protectionChecks,allTrue:Object.values(j.protectionChecks).every(v=>v===true),originalTolerance1eMinus9Unchanged:true},
 original149FailuresStillFalse:{allPass:j.allPass,originalPhysicalThresholdAllPass:j.originalPhysicalThresholdAllPass,
  allCurrentCameraAnchorProvenanceVerified:s.summary.allCurrentCameraAnchorProvenanceVerified,
  allAvailableIndependentSourceBoxesMatch:s.summary.allAvailableIndependentSourceBoxesMatch},
 sourceBoxComparison:{available:784,missingIndependentHistorical62:s.summary.missingIndependentSourceBoxFrames,
  exactlyMatching679:679,false105:105,falseAllWithinFourCueCamera:true,maxDifferencePixels:Math.max(...sourceMismatches.map(r=>r.maxAbsCoordinateDifferencePixels)),
  arithmeticReason:'Original camera tool: float64 local @ object.matrix_world, then camera projection. Semantic tool: mathutils(float32) cameraProjection @ object.matrix_world, then float64 local projection. Association/cast differs;1e-9 pixel equality is a newly added identity check, not an original size/position criterion.',
  noNewRoundingToleranceAccepted:true,noThresholdChanged:true,all105FalseRecords:sourceMismatches,
  independentMissing62Search:{file:proof62,sha256:pins[proof62]},noClaimOfHistoricalBoxForMissing62:true},
 historicalAnchorComparison:{directTrue812:812,originalFalse34:34,canonicalPreOverrideExactlyExplained28:28,
  simpleCanonicalProofUnresolved6:6,mixedLensApproximateExplanation:unresolved,
  noOriginalFalseFlagFlipped:true,noAdditionalGPURequested:true},
 fiveTrueWidthFailures:failures,
 sourceStagingNotes:[
  {frame:1242,text:'41.4s mine70.882% during camera approach; remains a true40–70 failure, no clipping.'},
  {frame:1260,text:'42s engine16.810%,5 visible pieces: original engine_state reveals boiler/fire/mortar from41.95, cylinder+0.3s, beam+0.6s. First assembly phase; actual readability is a root decision.'},
  {frame:3709,text:'123.633s can30.194% during unchanged close-camera move123.18..123.98.'},
  {frames:[4007,4008],text:'133.567/.6s can+pressure arrows34.310/37.734% during unchanged reveal/camera move133.32..133.82.'}],
 rootActualCaseReview:{manifest:contacts,sha256:pins[contacts],candidateUnique:595,pages60:60,approvalByThisAnalysis:false},
 recommendation:'Do not rerender based on stale historical anchors or subpixel association mismatch alone. Root must classify exact5 width/staging images plus original proxy candidates; retain every original automated NG and all unperformed checks.',
 protectedInputSha256:pins,actualImagesPersonallyViewedThisAnalysis:false,earsVerified:false,continuousPlaybackVerified:false,
 originalThresholdsUnchanged:true,originalNGUnchanged:true,automaticApproval:false,finalAcceptance:false};
const out=path.join(O,'d1-final149-bounded-anchor-sourcebox-and-width-analysis-20261025.json');
fs.writeFileSync(out,JSON.stringify(result,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({file:out,sha256:sha(out),physical846:846,actual903:903,sourceBoxFalse105:105,maxSourceBoxDelta:result.sourceBoxComparison.maxDifferencePixels,
 anchorSimpleProofUnresolved6:6,trueWidthFailures5:5,automaticApproval:false}));
