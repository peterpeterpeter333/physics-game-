// NEW evidence serialization of explicit trusted root views and two team scopes.
// The serializer does not claim personal viewing. Original JSONs remain immutable.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';
assert(process.argv.includes('--authorized'));
const self=fileURLToPath(import.meta.url),W=fileURLToPath(new URL('../../',import.meta.url)),O=path.join(W,'outputs/axes-20261023');
const F='/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,1)+'\n',{flag:'wx'});
const files={
 manifest:'/private/tmp/ys/ys-chain-d1v1-final-physical-original-case-contacts-20261025/manifest.json',
 physical:F+'/final-composite-physical-v6-actual-anchor-evidence-20261025.json',
 e1:path.join(W,'deep/D-1_final-original-cases001-020_E1-personal-actual-review_20261025.json'),
 eRow:path.join(O,'d1-final-original-case-pages021-040-personal-visual-decisions-20261025.json'),
 eyes903:path.join(W,'deep/D-1_final-camera-pier-layout_903team-actual-eye-aggregate_20261025.json'),
 analysis:path.join(O,'d1-final149-bounded-anchor-sourcebox-and-width-analysis-20261025.json'),
};
const expected={manifest:'311b1f3e6aad969a4cfc11c4b1e25e975e977f1c8159f0156090db69329c0098',
 physical:'9bcc39fda77012cff9154c8cc21703ba2a92480f924416df105fb560cc97faf6',
 e1:'02b1c2ad4bcd26897dea11f749722fc712af335747230fa1ed46dac7b4090612',
 eRow:'26ffd3a0b1bce9baf28775267207c0d6f8bea8d69d0f98a4db39d56a348107b9',
 eyes903:'6b93793138ed08907baf5506410c199d404c34ca121f04b92ddc91e5bf49f6d4',
 analysis:'b39e665635612e9df6392dcd491ab4afdb56418317dda2cd99725afee4bf0332'};
const pins={[self]:sha(self)},refs={};
for(const[k,p]of Object.entries(files)){assert.equal(sha(p),expected[k]);pins[p]=expected[k];refs[k]={path:p,sha256:expected[k]};}
const manifest=read(files.manifest),physical=read(files.physical),e1=read(files.e1),eRow=read(files.eRow),eyes903=read(files.eyes903);
const videoSha='a75bb51396f4e90ab88a477e628aa4e42f8a5d1c7440f23f90b67c6e288f218f';
assert.equal(manifest.mp4Sha256,videoSha);assert.equal(physical.mp4Sha256,videoSha);assert.equal(eyes903.mp4Sha256,videoSha);
assert.equal(sha(manifest.mp4),videoSha);pins[manifest.mp4]=videoSha;
assert.equal(manifest.rows.length,595);assert.equal(manifest.pages.length,60);
const cases=new Map(manifest.rows.map(r=>[r.frame,r]));assert.equal(cases.size,595);
const scopePages=manifest.pages.filter(p=>p.page>=41&&p.page<=60);assert.equal(scopePages.length,20);
const rootFrames=[];
for(const p of scopePages){
 assert.equal(sha(p.file),p.sha256);pins[p.file]=p.sha256;
 p.frames.forEach((j,i)=>{
  const r=cases.get(j);assert(r);assert.equal(r.sha256,p.actualJpegSha256[i]);assert.equal(sha(r.file),r.sha256);pins[r.file]=r.sha256;
  rootFrames.push({frame:j,time:r.time,actualDecodedJpeg:r.file,actualDecodedJpegSha256:r.sha256,
   contactPage:p.file,contactPageSha256:p.sha256,contactPageNumber:p.page,contactCellIndex:i,
   actualViewer:'/root',personallyViewed:true,visualCaseAccepted:true,
   viewingMethod:'Root explicitly personally displayed the exact contact sheet via view_image; not a native-resolution claim',
   originalCaseReasons:r.caseReasons,originalPhysicalThresholdPass:r.physical?.pass??null,
   physicalWidthRatio:r.physicalSummary?.principalWidthRatio??null,
   noNewRequiredVisualRepairIdentifiedInThisCell:true,
   observation:'Specific comparison groups, large circle/hand/horse, mountain and ending mechanism readable in this assigned scope',
   sourceBoxOrAnchorMismatchNotResolvedByVisualReview:true,originalGateOrPhysicalNgRewritten:false,notGenericWaiver:true});
 });
}
assert.equal(rootFrames.length,195);
const nativeHashes={1242:'c42cfb0bb89fb37630da91d32911d6af35f91f0d4aacce80185f880fb528972a',
1260:'32a6d7a53303207c7662c13830284efb01f0b9e4471025d2549be2831a0470c2',
3709:'008b4126e0e745d428d2d7ba8b5c828dfd77f71e9c1c72b4f78a80602a0ad31e',
4007:'902b13c136f04b88968c6dff307dd5ea953ab201e1ae511a2d7a11c71db364af',
4008:'af7dcfe8d0445cf1548990dcf1931ee0c8acc71c7278fac91daf14f5d8b0a5cf'};
const explanations={1242:'Mine70.882455% during a short camera approach; true numeric NG retained',
1260:'Boiler-only16.809544% first assembly from41.95s; cylinder+0.3/beam+0.6; true numeric NG retained',
3709:'Can30.194264% during camera approach123.18..123.98; true numeric NG retained',
4007:'Can and pressure arrows34.309879% during reveal camera133.32..133.82; true numeric NG retained',
4008:'Can and pressure arrows37.733964% during same reveal camera; true numeric NG retained'};
const native5=Object.entries(nativeHashes).map(([key,h])=>{
 const j=Number(key),r=cases.get(j);assert(r);assert.equal(r.sha256,h);assert.equal(sha(r.file),h);pins[r.file]=h;
 assert.equal(r.physical.pass,false);assert.equal(r.physical.physicalChecks.size40to70,false);
 return{frame:j,time:j/30,file:r.file,sha256:h,actualViewer:'/root',actuallyViewed:true,
  nativeResolutionIndividuallyDisplayed:true,displayResolution:[1080,1920],
  originalWidthRatio:r.physical.actualSurface.widthRatio,originalPhysicalPass:false,
  explicitRootDecision:'Specific primary object and arrows are readable in intentional short staging/approach; no new required visual repair',
  sourceStaging:explanations[j],originalNumericNgPreserved:true,notSize40to70Pass:true,notGenericMotionOrAssemblyWaiver:true};
});
const rootFile=path.join(O,'root-d1-final-case-pages041-060-and-five-native-width-decisions-20261025.json');
const rootReceipt={episode:'D-1',mp4:manifest.mp4,mp4Sha256:videoSha,manifest:files.manifest,manifestSha256:expected.manifest,
 physical:refs.physical,actualViewer:'/root',serializedBy:'/root/b1_final_cpu_preflight',
 attributionBasis:'Explicit trusted root message: ALL cases041..060=195cells personally displayed through view_image; five named numeric-width failures also individually displayed at native resolution. The serializer is not the viewer.',
 scope:{assignedPages:[41,60],personallyViewedPages:20,personallyViewedCells:195,nativeExpandedWidthCases:5,
  not200Or595CellsClaimedForRoot:true,native5OverlapOtherReviewersPages:true,not903Or30fpsOrContinuousPlaybackClaim:true},
 pages:scopePages.map(p=>({...p,actuallyViewed:true,actualViewer:'/root'})),frames:rootFrames,
 native5,findings:{newRequiredVisualDefects:[],all195AssignedCaseCellsVisuallyReadable:true,
  fiveNativeWidthCasesAcceptedOnlyAsExactReadableStaging:true,numericNgNotReclassified:true},
 originalAutomaticFailuresPreserved:true,originalPhysicalAndSourceMetadataFalseFlagsPreserved:true,
 earsVerified:false,continuousPlaybackVerified:false,automaticApproval:false,finalAcceptance:false,protectedInputSha256:{...pins}};
write(rootFile,rootReceipt);pins[rootFile]=sha(rootFile);

// Independent normalization of three differently shaped scoped receipts.
assert.equal(e1.actualViewer,'/root/episode_e1');assert.equal(eRow.actualViewer,'/root/e1_row_timing_final');
assert.equal(e1.cases.length,200);assert.equal(eRow.frames.length,200);
assert.equal(e1.visualFindings.newlyConfirmedBlockingPixelDefects.length,0);
assert.equal(eRow.counts.newMandatoryVisibleDefectsConfirmed,0);
const scopes=[{viewer:e1.actualViewer,file:files.e1,sha256:expected.e1,source:e1,records:e1.cases,pages:[1,20]},
 {viewer:eRow.actualViewer,file:files.eRow,sha256:expected.eRow,source:eRow,records:eRow.frames,pages:[21,40]},
 {viewer:'/root',file:rootFile,sha256:pins[rootFile],source:rootReceipt,records:rootFrames,pages:[41,60]}];
const frameRecords=[],covered=new Set(),pageCoverage=[];
for(const s of scopes){
 assert.equal(s.source.manifest??files.manifest,files.manifest);assert.equal(s.source.manifestSha256,expected.manifest);assert.equal(s.source.mp4Sha256,videoSha);
 const pages=s.source.pages;assert.equal(pages.length,20);
 for(const p of pages){
  const exact=manifest.pages.find(x=>x.page===p.page);assert(exact&&p.page>=s.pages[0]&&p.page<=s.pages[1]);
  assert.equal(p.file,exact.file);assert.equal(p.sha256,exact.sha256);assert.equal(sha(p.file),p.sha256);pins[p.file]=p.sha256;
  assert.equal(p.actuallyViewed,true);assert.equal(p.actualViewer,s.viewer);
  pageCoverage.push({page:p.page,file:p.file,sha256:p.sha256,actualViewer:s.viewer,receipt:s.file,receiptSha256:s.sha256,
   frames:exact.frames,actualJpegSha256:exact.actualJpegSha256});
 }
 for(const r of s.records){
  const j=r.frame,exact=cases.get(j),file=r.file??r.actualDecodedJpeg,h=r.sha256??r.actualDecodedJpegSha256;
  assert(exact&&!covered.has(j));assert.equal(file,exact.file);assert.equal(h,exact.sha256);assert.equal(sha(file),h);pins[file]=h;
  assert.equal(r.actualViewer,s.viewer);assert(r.actuallyViewed===true||r.personallyViewed===true);
  const p=pageCoverage.find(p=>p.actualViewer===s.viewer&&p.frames.includes(j));assert(p);
  assert(r.visualCaseAccepted===true||String(r.recommendation).startsWith('adopt_'));
  frameRecords.push({frame:j,time:j/30,file,sha256:h,actualViewer:s.viewer,receipt:s.file,receiptSha256:s.sha256,
   contactPage:p.file,contactPageSha256:p.sha256,contactCellIndex:p.frames.indexOf(j),actuallyViewed:true,
   exactVisualReadabilityAccepted:true,sourceDisposition:r.visualCaseDecision??r.recommendation??'root exact cell visually readable',
   priorPhysicalPass:exact.physical?.pass??null,caseReasons:exact.caseReasons,
   noNumericOrSourceEvidenceFalseFlagChanged:true,notOriginalInspectorPass:true});covered.add(j);
 }
}
assert.equal(covered.size,595);assert.equal(pageCoverage.length,60);assert.equal(new Set(pageCoverage.map(p=>p.page)).size,60);
assert.deepEqual([...covered].sort((a,b)=>a-b),[...cases.keys()].sort((a,b)=>a-b));
frameRecords.sort((a,b)=>a.frame-b.frame);pageCoverage.sort((a,b)=>a.page-b.page);
const aggregateFile=path.join(O,'d1-final-all595-exact-cases-three-viewer-attributed-aggregate-20261025.json');
const aggregate={episode:'D-1',mp4:manifest.mp4,mp4Sha256:videoSha,manifest:refs.manifest,physical:refs.physical,
 aggregator:'/root/b1_final_cpu_preflight',aggregationNotNewPersonalViewing:true,
 scope:{exactCases:595,pages:60,threeViewers:true,caseSetsDisjointAndComplete:true,
  perViewer:scopes.map(s=>({actualViewer:s.viewer,cases:s.records.length,pages:s.pages,receipt:s.file,receiptSha256:s.sha256})),
  native5ExtraRootViewsNotAddedTo595Count:true,rootPersonallyViewedAll595:false,serializerPersonallyViewedAnyNewCase:false},
 pageCoverage,frameRecords,all595ExactFrameAndJpegHashesValidated:true,all60PageHashesAndScopedAttributionValidated:true,
 separate903ActualEyeCoverage:refs.eyes903,all903PixelEvidenceNot903GeometryReplays:true,
 nativeWidthDecisionReceipt:{path:rootFile,sha256:pins[rootFile],exactFrames:Object.keys(nativeHashes).map(Number)},
 noNewRequiredVisualRepairIdentified:true,originalAutomaticFailuresPreserved:true,
 metadataAndPhysicalFalseAreNotResolvedByEyes:true,all846PhysicalRowsIndependentlyHistoricalBoxCertified:false,
 earsVerified:false,continuousPlaybackVerified:false,all30fpsFramesViewed:false,automaticApproval:false,finalAcceptance:false};
write(aggregateFile,aggregate);pins[aggregateFile]=sha(aggregateFile);
const summary=read(physical.actualAnchorAndSourceBoxEvidence.path).summary;
assert.equal(summary.replayedFrames,846);assert.equal(summary.independentHistoricalSourceBoxAvailable,784);
assert.equal(summary.newMeasurementsWithoutIndependentHistoricalSourceBox,62);
assert.equal(summary.historicalAnchorOriginalMismatchRetained,34);
assert.equal(physical.rows.filter(r=>!r.pass).length,5);
assert.equal(Object.keys(physical.protectionChecks).length,23);assert(Object.values(physical.protectionChecks).every(v=>v===true));
const closureFile=path.join(O,'d1-final-exact-case-visual-closure-20261025.json');
const closure={episode:'D-1',candidate:'final-camera-pier-layout-20261025',mp4:manifest.mp4,mp4Sha256:videoSha,
 physicalReport:files.physical,physicalReportSha256:expected.physical,
 exact595CaseAggregate:{path:aggregateFile,sha256:pins[aggregateFile]},root195AndNative5Receipt:{path:rootFile,sha256:pins[rootFile]},
 all903ActualImageAttribution:refs.eyes903,boundedFalseFlagAnalysis:refs.analysis,
 noNewRequiredVisualRepairIdentified:true,originalAutomaticFailuresPreserved:true,
 all846PhysicalRowsIndependentlyHistoricalBoxCertified:false,earsVerified:false,
 scope:{preservationGuards:23,all23PreservationGuardsTrue:true,physicalReplayFrames:846,
  preservedOriginalPhysicalRequests:546,actualSelectedDecodedImages:903,actualCueEndImagesNotSeparatelyGeometryReplayed:57,
  exactAdditionalVisualCases:595,contactPages:60,caseViewers:3,
  caseAttribution:{episodeE1:200,eRow:200,root:195},nativeExpandedRootWidthCases:5},
 numericalFailuresRetained:{originalAutomaticGatePass:false,original7bNgPreserved:true,
  writtenStrictSparsePass:false,trueWidthFailures:5,trueWidthFailureFrames:[1242,1260,3709,4007,4008],
  originalPhysicalThresholdAllPass:physical.originalPhysicalThresholdAllPass,combinedEvidenceAllPass:physical.allPass,
  sourceBoxComparisonAt1eMinus9False:105,sourceBoxFalseMaxPixels:.0002376512481419013,
  independentHistoricalBoxesAvailable:784,independentHistoricalBoxesMatchingAt1eMinus9:679,
  historicalBoxesUnavailable:62,originalAnchorEqualityAt1eMinus5False:34,
  canonicalPreOverrideExactlyExplained:28,anchorSimpleProofUnresolved:6,
  unresolvedAnchorFrames:[2925,2928,2940,5550,5560,5565],
  allCurrentCameraAnchorProvenanceVerified:false,allAvailableIndependentSourceBoxesMatch:false},
 limitedVisualAdoption:'595 exact JPEG cases are readable in their specific narrated object/group, face, staged assembly or short-approach context; five native width cases expressly accepted for readability only. This is not a40–70 width PASS, sourcebox/anchor repair, generic waiver or all-gates compliance.',
 metadataInterpretation:'Retain stale historical camera anchors and differing projection arithmetic records. No additional movie rendering is justified by those records alone; unverified historical-box62 scope stays explicit.',
 unqualifiedAllGatesPass:false,literalAllInstructionsComplianceNotClaimed:true,
 continuousPlaybackVerified:false,all30fpsFramesPersonallyViewed:false,
 finalDeliveryCopied:false,finalFilmAcceptanceAuthority:'Root; this is scoped visual closure plus exact retained failure accounting',
 protectedInputSha256:pins,originalJsonEdited:false,renderPerformed:false,commitOrPushPerformed:false};
for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);
write(closureFile,closure);
console.log(JSON.stringify({rootReceipt:rootFile,rootReceiptSha256:pins[rootFile],aggregate:aggregateFile,aggregateSha256:pins[aggregateFile],
 closure:closureFile,closureSha256:sha(closureFile),caseCoverage:595,viewerCounts:[200,200,195],
 noNewRequiredVisualRepairIdentified:true,originalAutomaticFailuresPreserved:true,all846HistoricalBoxCertified:false,earsVerified:false}));
