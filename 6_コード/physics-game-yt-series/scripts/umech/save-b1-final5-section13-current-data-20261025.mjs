// CPU-only serialization of existing, separately scoped production evidence.
// No decode, render, encode, automatic visual acceptance, edits to old records or git.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
assert(process.argv.includes('--authorized'));
const W=fileURLToPath(new URL('../../',import.meta.url)),self=fileURLToPath(import.meta.url);
const O=path.join(W,'outputs/axes-20261023'),F='/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
const refs={
 old:path.join(O,'b1-section13-pending-final-report-data-20261025.json'),
 common:path.join(O,'original-preservation-progress-20261025-1540.json'),
 timing:path.join(O,'b1-all39-row-source-timing-attestation-v4-20261025.json'),
 aggregate:path.join(O,'b1-final5-all1803-attributed-visual-review-aggregate-20261025.json'),
 eyes:path.join(O,'b1-final5-exact714-sample72-page-eyes-20261025.json'),
 join:path.join(O,'b1-final5-exact714-original7b-delivered-evidence-with-eyes-20261025.json'),
 rootMajor:path.join(O,'root-b1-final5-major12-problem2-actual-eye-receipt-20261025.json'),
 rootNew:path.join(O,'root-b1-final5-pending34-66-and-half28-29-actual-eye-receipt-20261025.json'),
 ownNew:path.join(O,'b1-final5-pending01-33-personal-eye-receipt-20261025.json'),
 cases:'/private/tmp/ys/ys-chain-b1v1-final5-supplement-face-case-contacts-20261025/manifest.json',
 prepared:path.join(F,'prepared.json'),export:path.join(F,'export.json'),
 actual:path.join(F,'actual-mp4-review/manifest.json'),
 checks:path.join(F,'validation-final-v1/checks.json'),gate:path.join(F,'validation-final-v1/quality-gate.json'),
 b7:'/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-frozen-control-cases-20261025/probe/report.json',
 b7Approval:path.join(O,'root-b1-frozen-cases-all18-actual-carry-probe-approval-20261025.json'),
};
const expected={
 common:'9ba3b9ac3ac967716b2836163aa13fec26aa56558fc42a094a37e18cdd58b403',
 timing:'fb255213631d326196ec99b69397b51c666da3b10ce28e737381e78aa01c4b65',
 aggregate:'d979a4a7902d3d9ee7f3d5db89f9f961712248d0f823ad42a868a5b376d9f752',
 eyes:'59868931ddc95cf82fedaea35c8afb08c9fbfc62b8c5fc28df3345657a5d65a2',
 join:'b84c311b30ee7553e952c7e6a8def7ce5a695c29c528b25e91afda7fccb0a5a9',
 rootMajor:'edd129b3b1e5bdba6d51555b3ea517637b7c244894231f90bb7120142c003351',
 rootNew:'dffa7f3678cd683f255ea8b8def261228ae2c95f47feb68846b03ecccdfc6098',
 ownNew:'daac44425e1c7067cb85293ad7d20556123b54c4bcd01d11e58124dbab9c4794',
 cases:'f05a116f28ecac47e8343e67596a81cfe1e78338e94c562ba74638ee54fd836f',
 prepared:'93b4f6ee2d603eef8771235cb3a051b1a817be9e86565df49b0ae2281c1bc412',
 export:'5f14b1e5fc1115dd6ee39dc46cd6e1dde1fd17611eace67a27c24d355ef20e0d',
 actual:'2f8bb0a84771ae36c141f1c69a8c4d19129f0a40c911331d8a4071a2ca874f8c',
 checks:'b54ae312147b2b4c88f1e5b0649152ad004d9943705b5f4855b544d5cc8ea37b',
 gate:'da15cd05bed4cebfa3ad922a96b20d822742726718467d7be56e1a8b03b23653',
 b7:'97bba60da3dd2a7c0d6bb56205e00553b49cc3119c79d11a6c831e090f6745a4',
 b7Approval:'32453dc7f4a4e9971ca2e998f9c7c58988ca79b92e6efb4679ba6b54cda2889b',
};
const protectedInputSha256={[self]:sha(self)},evidence={};
for(const[k,p]of Object.entries(refs)){
 const h=sha(p);if(expected[k])assert.equal(h,expected[k],k);
 protectedInputSha256[p]=h;evidence[k]={path:p,sha256:h};
}
const old=read(refs.old),common=read(refs.common),timing=read(refs.timing),aggregate=read(refs.aggregate),
 join=read(refs.join),prepared=read(refs.prepared),ex=read(refs.export),actual=read(refs.actual),
 checks=read(refs.checks),gate=read(refs.gate),b7=read(refs.b7),cases=read(refs.cases);
assert.equal(ex.sha256,'6780889510a3d881ec446a58627325edf00cd0b43206c7f8b61c166c270ca1d2');
assert.equal(sha(ex.video),ex.sha256);protectedInputSha256[ex.video]=ex.sha256;
assert.equal(ex.sha256,actual.videoSha256);assert.equal(ex.sha256,aggregate.mp4Sha256);assert.equal(ex.sha256,join.mp4Sha256);
assert.equal(ex.frames,10700);assert.equal(ex.preparedSha256,evidence.prepared.sha256);
assert.equal(common.checked,43);assert.equal(common.checkedFiles.length,43);
const commonFresh=common.checkedFiles.map(r=>({path:r.path,expectedSha256:r.expectedSha256,
 currentSha256:sha(r.path),unchanged:sha(r.path)===r.expectedSha256}));
assert(commonFresh.every(r=>r.unchanged));
assert.equal(timing.sourcePins.length,30);assert.equal(timing.rows.length,39);
const sourceFresh=timing.sourcePins.map(r=>({path:r.path,sha256:r.sha256,unchanged:sha(r.path)===r.sha256}));
assert(sourceFresh.every(r=>r.unchanged));
let catalogImages=0;
for(const r of [old.parts.catalogDocument,old.parts.overview,old.parts.sourceLibrary,...old.parts.objects.flatMap(r=>r.images)]){
 assert.equal(sha(r.path),r.sha256,r.path);protectedInputSha256[r.path]=r.sha256;
}
catalogImages=old.parts.objects.flatMap(r=>r.images).length;assert.equal(catalogImages,34);
assert.equal(checks.results.length,7);assert.equal(checks.results.filter(r=>r.exitCode===0).length,6);
assert.equal(checks.results.find(r=>r.name==='desk-quality-gate').exitCode,1);assert.equal(gate.pass,false);
assert.deepEqual(gate.results.filter(r=>r.status==='NG').map(r=>r.no),[7,'7b']);
assert.equal(prepared.B7ActualSources,16);assert.equal(prepared.B7ReplacementOutputs,16);
assert.equal(prepared.unchangedBaseOutputFrames,10684);
assert(prepared.all759NumericPrincipalMeasurementsPreserved&&prepared.all10700ActualSourceMappingsVerified);
assert.equal(b7.actualGuardedStates,18);assert(b7.allGuardedStatesPass);
assert(Object.values(b7.protectionChecks).every(v=>v===true));
assert.equal(aggregate.partition.totalUnique,1803);assert.equal(aggregate.partition.attributedOldExactReuse,1152);
assert.equal(aggregate.partition.newPersonalCells,651);assert.equal(join.summary.explicitlyViewed,714);
assert.equal(join.summary.explicitlyViewedPages,72);assert.equal(join.summary.explicitRootCaseDecisions,0);
assert.equal(cases.counts.selectedUnique,304);assert.equal(cases.pages.length,31);

const film={title:old.film.title,requestedDeliveryPath:old.film.requestedDeliveryPath,
 currentFinalCandidate:{path:ex.video,sha256:ex.sha256,bytes:fs.statSync(ex.video).size,width:1080,height:1920,fps:30,
  encodedFrames:10700,canonicalAudioDurationSeconds:356.6526666666668,nominalCfrDurationSeconds:10700/30,
  lastEncodedFrame:10699,lastEncodedFrameTimeSeconds:10699/30,lastCaptionEnd:356.0626666666668,
  prepared:true,encoded:true,mechanicalChecksRun:true,requiredActualImageCoverageAttributed:true,
  originalAutomatedGatePass:false,rootFinalAcceptance:false},
 canonicalRows:39,cues:50,captionChunks:213,newExclusiveDeliveryProven:false,
 historicalB4Evidence:evidence.old,oldB4CandidateSha256:old.film.oldB4.sha256};
const statuses={
 captions:'current_final_mechanical_pass',readingsProsody:'current_final_mechanical_pass_not_ear_certification',
 qx:'current_final_exit0',quality:'original_NG_7_and_7b_preserved_case_decisions_pending',
 camera:'current_actual_pose_measured_pass',overhead:'current_measured_pass',
 scale:'all759_geometry_preserved_two_true_width_failures_retained_304_visual_cases_pending',
 sparse:'original_14_5s_proxy_NG_preserved_written2s_case_disposition_pending',
 overflow:'current_final_svg_guard_pass',font:'current_final_svg_guard_pass',
 bookends:'current_final_gate_and_root_actual_pair_review_complete',
 allSheets:'required_samples_attributed_exact_JPEG_eyes_not_all30fps_or_continuous',
 actions:'all39_source_audited_row18_repaired_literal_conflicts_and_offsets_retained',
 numbers:'unchanged_canonical_arithmetic_evidence_retained',
 problem:'new_actual_problem_and_answer_root_review_complete_not_game_implementation',
 preservation:'common43_and_B30_fresh_hashes_match_separate_scopes_B7_strict_pass',
};
const table=old.section11Table.map(r=>({id:r.id,criterion:r.criterion,currentStatus:statuses[r.id],
 originalHistoricalRowPreserved:{...r},noOriginalFailureStatusRewritten:true}));
const retainedNotes=old.remainingLimitationsAndQuestions.filter(r=>r.kind!=='actual_required_repair').map(r=>
 r.row===18?{...r,historicalOnly:true,resolution:'See newFinalRow18Resolution; original finding is preserved, no longer an open rendering defect'}:r);
const row18={originalBoundaryFindingPreserved:true,originalFindingArtifact:evidence.old,
 resolution:'Sixth needle descent and hand withdrawal continue across cue boundary in actual final5 frames4125..4140; source audio/script/captions/camera/other objects unchanged',
 replacementFrames:[4125,4140],replacementCount:16,contextFrames:[4124,4141],
 originalGeometryHelperSha256:b7.originalGeometryHelperSha256,
 actualContainerIdentity:b7.rootFrozenControlCases,
 renderReport:evidence.b7,actualProbeApproval:evidence.b7Approval,
 actualFinalEncodedEyeScope:aggregate.repaired16NewEncodedEyes,
 strictAllProtectionChecks:b7.protectionChecks,geometryAndWorldBeforeAfterTolerance:1e-9,
 originalRgbExactFailuresRetained:true,noAutomaticToleranceWaiver:true,
 finalEncodedCarryAll16PresentInRootScope:true,priorFindingNoLongerPending:true};
const historicalTimes=old.measuredTimes.recordedGenerationWalls.map(r=>({
 phase:r.phase,path:r.path,sha256:r.sha256,recordedElapsedSeconds:r.seconds,
 actualFrameCount:Array.isArray(r.actualFrames)?r.actualFrames.length:r.actualFrames??null,
 replacementOutputCount:r.replacementOutputs??null,historicalStatusRetained:r.status,
 interpretation:'Recorded wall-clock field, not GPU kernel time; interrupted/reused phases are not summed as fresh render time'}));
const data={schema:'B-1-section13-current-final5-data-v1',episode:'B-1',edition:'final5-carry-20261025',
 dataPreparedBy:'/root/b1_final_cpu_preflight',snapshotUtc:new Date().toISOString(),
 purpose:'NEW current §13 reporting data; old pending report remains unchanged; root304 case decisions and delivery still separate',
 scope:{newSerializationOnly:true,newImageViewingPerformedByThisSerializer:false,newEarListening:false,newBlenderRender:false,newVideoDecodeEncode:false},
 evidence,film,section11Table:table,currentFinalSevenToolResults:checks.results,
 currentFinalAllOriginalGateResultsAndMetrics:{path:refs.gate,sha256:evidence.gate.sha256,pass:gate.pass,thresholds:gate.thresholds,results:gate.results,metrics:gate.metrics},
 caption165Authorization:old.caption165Authorization,
 preservation:{commonAllFourEpisodesAndOldRegressions:{historical:evidence.common,checked43:43,allCurrentHashesMatch:true,
   scope:'43 immutable inputs/source/regression assets common across all four films; NOT the B source39 attestation30 pins',
   freshCheckedFiles:commonFresh,oldEpisodeRegressionAttribution:common.oldEpisodeRegressions,newRegressionReencodePerformed:false},
  BAll39SourceAudit:{receipt:evidence.timing,pins30:30,freshPinsAllMatch:true,sourcePins:sourceFresh},
  B7StrictChecks:b7.protectionChecks,originalsAndAllFailedAttemptsRetained:true,noJapaneseAudioOrCaptionChanges:true},
 actionTiming:{receipt:evidence.timing,coverage:timing.coverage,all39RowsRetainedVerbatim:timing.rows,
  all76WordChecksRetainedVerbatim:timing.wordChecks,allCaveatsRetainedVerbatim:timing.caveats,
  historicalNotesRetained:old.actionTiming,newFinalRow18Resolution:row18,
  literalAll39Pass:false,sourceInternalConflictsExplicit:[
   {row:4,issue:'Section7 connection/growth direction and N4 direction differ; immutable instructions retained'},
   {row:36,issue:'Frozen full-screen Mio metadata hides globe and suppresses question mark; cannot claim literal simultaneous globe/? instruction compliance'}],
  wordOffsetsAndTableMismatchRetained:true,canonicalFilesEdited:false},
 physical:{historical759:old.original759Physical,final759NumericExactlyPreserved:true,
  all10700ActualSourceMapVerified:true,unchanged10684OutputFrames:true,
  all714ExactActualJPEGAndGeometryJoined:evidence.join,
  widthFlagsNeverOverwritten:true,underlying3DWidthNotOpaqueFaceSizeEvidence:true,
  originalProxyGate7And7bStillNG:true,all304CasesPendingRootNamedDecision:true},
 visualCoverage:{aggregate:evidence.aggregate,requiredUniqueActualJpegs:1803,
  partition:aggregate.partition,all714ExactSampleEyes:true,
  halfPageCoverage:aggregate.halfPageCoverage,rootNewReceipt:evidence.rootNew,subagentNewReceipt:evidence.ownNew,
  actualFullFaceAndSupplementCaseContacts:evidence.cases,cases:cases.counts,casePages31:31,caseApprovals:0,
  rootPersonallyViewedAll1803:false,teamAttributedViewingIsNotOnePersonsFullFilmViewing:true,
  earsVerified:false,continuousPlaybackVerified:false,all10700FramesPersonallyViewed:false},
 major12AndProblem2:{receipt:evidence.rootMajor,actualViewer:'/root',
  earlierHistoricalEvidence:old.major12,newActualRootReview:true,problemJsonAndPreparation:old.problemPreparation},
 allFramesIndex:{actualManifest:evidence.actual,aggregate:evidence.aggregate,exactSampleEyes:evidence.eyes,
  caseContacts:evidence.cases,oldIndexesRetained:old.allFramesIndex},
 parts:old.parts,partsFreshHashAudit:{publishedImages34:catalogImages,objects17:old.parts.objects.length,
  all34ImageHashesAndCatalogAndSourceLibraryMatch:true},
 measuredTimes:{historicalRecordedWalls:historicalTimes,
  finalCarryProbe:{path:refs.b7,sha256:evidence.b7.sha256,recordedElapsedSeconds:b7.seconds,actualRepairFrames16:16,actualContexts2:2},
  finalEncode:{path:refs.export,sha256:evidence.export.sha256,recordedElapsedSeconds:ex.seconds,
   fieldIsExportElapsedWallNotVideoDuration:true},currentCheckWalls:checks.results.map(r=>({name:r.name,seconds:r.seconds})),
  notClaimedAsGpuKernelTiming:true,noInventedCombinedElapsed:true},
 fixHistory:{historicalInitialToB6RowsRetainedVerbatim:old.fixHistory,
  newFinalCarry:{changes:'Only sixth needle z continuation and hand withdrawal16frames; no vane repair, no new captions or voice',
   report:evidence.b7,originalGeometryHelper:b7.originalGeometryHelperSha256,finalVideoSha256:ex.sha256,
   historicalRgbNGAndAllOtherFailedAttemptsRetained:true,actualEncodedEyes:aggregate.repaired16NewEncodedEyes}},
 retainedLimitationsAndQuestions:retainedNotes,
 currentlyPendingBeforeFinalAcceptance:[
  'Root personally review31 case sheets/304 exact JPEGs and issue exact-frame/SHA named physical/face/sparse decisions; no generic numeric waiver',
  'Keep original automated7/7b NG and source row4/row36 instruction conflicts in final report even if specific visual cases accepted',
  'Root final acceptance and EXCL copy to requested delivery path; no delivery claim before copy receipt',
  'Final audible listening, continuous full-film playback, all10700 30fps frame personal inspection remain unperformed and must be disclosed'],
 oldPendingReportNeverEdited:evidence.old,oldPendingStepsResolvedByNewFinalEvidenceNotRewritten:true,
 protectedInputSha256,commitOrPushPerformed:false,newMediaGeneratedByThisSerializer:false,
 earsVerified:false,continuousPlaybackVerified:false,all10700FramesPersonallyViewed:false,
 literalAllInstructionsComplied:false,originalAutomatedGatePass:false,rootFinalAcceptance:false,
 finalAuthority:'Root alone; new receipt does not override original inspectors, immutable sources or unperformed hearing/continuous checks'};
for(const[p,h]of Object.entries(protectedInputSha256))assert.equal(sha(p),h,p);
const destination=path.join(O,'b1-section13-current-final5-report-data-20261025.json');
fs.writeFileSync(destination,JSON.stringify(data,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({file:destination,sha256:sha(destination),filmSha256:ex.sha256,
 common43FreshAllMatch:true,B30SourcePinsAllMatch:true,all39RowsRetained:true,all76WordChecksRetained:true,
 catalogImages34:34,requiredActualJpegCoverage:1803,pendingCases:304,originalNG:[7,'7b'],
 B7Resolved:true,rootFinalAcceptance:false,ears:false,continuous:false}));
