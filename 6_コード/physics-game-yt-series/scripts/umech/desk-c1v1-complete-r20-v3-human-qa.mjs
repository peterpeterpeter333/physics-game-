// Aggregate separately scoped actual-eye receipts. No image generation or encode.
// The old v2 index, its known defect and every original measurement stay intact.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));
const root='/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r20',trial='/private/tmp/ys/ys-chain-c1v1-visible-r20-trial';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const evidenceSha256={},pin=(p,h)=>{const actual=sha(p);if(h)assert.equal(actual,h,p);evidenceSha256[p]=actual;return read(p);};
const oldPath=root+'/actual-patch-review/actual-patch-index.json',oldHash='6100f4815e4678e8a979ae55632a8fdcfb50443a9eeaa9cf1070f9298f2d39d0';
const old=pin(oldPath,oldHash),indexPath=root+'/actual-patch-review-v3/actual-patch-index.json';
const index=pin(indexPath,'43ce5cc810edbbfcae89a32d9c7598961b3ea45d90a7ba2f37ff0250af46b311');
const diff=pin(root+'/actual-patch-review-v3/v3-diff-proof.json','89d4a2dc63897e5d13e6f0c3726f378786dbabcb2d39d1b828b3f65c6b917640');
const proof=pin(root+'/camera-patch.json'),restore=pin(root+'/restore.json');
assert.equal(proof.patchSourceSha256,'56e667659aa4c0e96f355058ec49c04bf24da68724c79fc92e7f05665f6d4350');
assert.equal(index.proofSha256,sha(root+'/camera-patch.json'));assert.equal(index.runtimeRestoreReceiptSha256,sha(root+'/restore.json'));
assert(restore.matrixRestored&&restore.maximumAbsoluteMatrixDelta<1e-12&&restore.unchangedTolerance===1e-12&&restore.frozenInputsAndOtherSceneFilesVerified);
assert.equal(index.actualFrames,1725);assert.equal(old.actualFrames,1725);assert.equal(index.frames.length,1725);assert.equal(index.sheets.length,192);
assert.deepEqual(old.errors,[]);assert.deepEqual(index.errors,[]);assert.deepEqual(diff.errors,[]);
assert.deepEqual(index.v3ChangedFrames,[9226,9227,9228,9229]);assert.deepEqual(diff.changedFrames.map(x=>x.frame),index.v3ChangedFrames);
assert.equal(diff.unchangedPngCount,1721);assert(diff.checkedEveryFrameInEntireGuardedWindow&&diff.allPrevious1725PngAndRawShaVerified&&diff.oldSourceAndEvidenceUnchanged);
for(const[p,h]of Object.entries(diff.inputsSha256))assert.equal(sha(p),h,p);
const changed=new Map(diff.changedFrames.map(x=>[x.frame,x])),previous=new Map(old.frames.map(x=>[x.frame,x]));
assert.deepEqual([...new Set(proof.patchFrames)].sort((a,b)=>a-b),index.frames.map(x=>x.frame));
for(const row of index.frames){
 const prior=previous.get(row.frame);assert(prior);assert.equal(row.actualRaw,prior.actualRaw);assert.equal(sha(row.actualRaw),prior.actualRawSha256);assert.equal(row.actualRawSha256,prior.actualRawSha256);
 assert.equal(sha(prior.file),prior.sha256);assert.equal(sha(row.file),row.sha256);
 const change=changed.get(row.frame);if(change){assert.equal(row.sha256,change.sha256);assert.equal(prior.sha256,change.previousSha256);}
 else{assert.equal(row.sha256,prior.sha256);assert.equal(row.sha256,diff.unchangedPngSha256[row.frame]);}
}
for(const sheet of index.sheets){const prior=old.sheets.find(x=>x.page===sheet.page);assert(prior);assert.deepEqual(sheet.frames,prior.frames);assert.equal(sha(sheet.file),sheet.sha256);assert.equal(sha(prior.file),prior.sha256);if(sheet.page!==163)assert.equal(sheet.sha256,prior.sha256);}
assert.deepEqual(diff.changedSheets.map(x=>x.page),[163]);
const teamPath=process.env.C1_TEAM_REVIEW??W+'outputs/axes-20261023/root-c20-team-review-attestation-20261025.json',team=pin(teamPath);
assert.equal(team.originalIndexSha256,oldHash);assert(team.priorC001to058Viewed&&team.priorCReviewBasis&&team.readyForExport);
assert(team.row38DelayedPointVerified&&team.row7RevealVerified&&team.allPhysicalCandidatesClassified&&team.physicalCandidateSupplementAccepted);
assert.equal(team.actualImageDefectsRemainingExceptV2HudFade,0);assert.equal(team.earsVerified,false);assert.equal(team.finalAcceptance,false);
assert.match(team.root059to064ReceiptSha256,/^[a-f0-9]{64}$/);
const root59=pin(team.root059to064Receipt,team.root059to064ReceiptSha256);
const root65Path=W+'outputs/axes-20261023/root-c20-composite-sheets-065-128-review-20261025.json',root65=pin(root65Path);
for(const[r,range,count]of[[root59,[59,64],54],[root65,[65,128],576]]){assert.equal(r.indexSha256,oldHash);assert.deepEqual(r.personallyDisplayedSheetNumbersInclusive,range);assert(r.allNineCellsOfEachDisplayedSheetReviewed);assert.equal(r.reviewedIndexEntries,count);assert.equal(r.actualImageDefectsFoundInThisAssignedRange,0);}
const peerPath=W+'docs/video-revision-20260924/deep/E-1_peer_C20_actual_sheets129-192_20261025.json';
const peer=pin(peerPath,'cd8ed98a744a9d12598a926b4b40a2655e2540dbdff00ea9c90e3d80cf257b46');
assert.equal(peer.sourceIndexSha256,oldHash);assert.deepEqual(peer.reviewedPageRange,[129,192]);assert.equal(peer.reviewedCells,573);assert.equal(peer.newConcreteDefectsOtherThanReportedScoreFade,0);
assert.equal(peer.pages.length,64);for(const p of peer.pages){assert(p.actuallyDisplayed&&p.actualSha256Recomputed);assert.equal(p.sha256,old.sheets.find(x=>x.page===p.page)?.sha256);assert.equal(sha(p.file),p.sha256);}
const ownPath=W+'outputs/axes-20261023/c1-r20-v3-changed-frame-eye-review-20261025.json',own=pin(ownPath);
assert.equal(own.sourceSha256,sha(indexPath));assert.equal(own.diffProofSha256,sha(root+'/actual-patch-review-v3/v3-diff-proof.json'));
assert.deepEqual(own.personallyDisplayedFrames,index.v3ChangedFrames);assert.equal(own.personallyDisplayedSheet,163);assert(own.allNineSheetCellsReviewed);assert.equal(own.sheetSha256,index.sheets.find(x=>x.page===163).sha256);assert.equal(own.actualImageDefectsFoundInThisScope,0);
for(const f of diff.changedFrames)assert.equal(f.sha256,own.allFourPngSha256);
const trialQa=pin(trial+'/human-qa.json','2517ff312a9156e3822c52732949f758b6157eeb5deaa978e963146e7594c038');
assert(trialQa.allActualTrialImagesViewed&&trialQa.readyForLocalReplacement&&trialQa.row38NoHumanPointBeforeConclusion&&trialQa.row7RevealLocallyVerified);
assert.equal(trialQa.actualTrialImages,17);assert.equal(trialQa.compositeImagesActuallyViewed,27);
const trialRoot=pin(W+'outputs/axes-20261023/root-c20-local-trial-approval-20261024.json','b6e707d4a7595fad6a0cb772baf04f13e52d1c454baf5e81fd0c3731f743f893');assert.equal(trialRoot.teamActualQaSha256,sha(trial+'/human-qa.json'));assert(trialRoot.localReplacementAuthorized);
const physicalPath=trial+'/physical15-semantic-review.json',physical=pin(physicalPath,'9ddc227a30e96470cb0a7ffaab34d24121a46ade7ee9b1b0b72fa2a28cd4160e');
assert(physical.all15CasesClassified&&physical.tenTransitionCasesPersonallyReViewedAt1080&&!physical.additionalTrueLearningDefectFound&&!physical.newCameraProposed);assert.equal(physical.rows.length,15);
for(const f of ['desk-c1v1-complete-frame-v3.mjs','desk-c1v1-complete-frame-v2.mjs','desk-c1v1-complete-frame.mjs','desk-c1v1-final-frame.mjs','desk-c1v1-approved-frame.mjs','desk-axes-frame.mjs','desk-c1v1-overlay.mjs','frame-vert.mjs','desk-frame.mjs','desk-faces.mjs','desk-overlay-lib.mjs','yt1-chain-00bx-common.mjs','desk-c1v1-complete-v3-render-entry.mjs','desk-c1v1-complete-v3-quality-loader.mjs','desk-c1v1-complete-r20-v3-checks-20261024.mjs','desk-c1v1-complete-r20-v3-diff-qa.mjs','desk-c1v1-complete-r20-v3-human-qa.mjs','desk-axes-final-checks.mjs','desk-axes-caption165-loader.mjs','desk-quality-gate.mjs','desk-quality-gate-frames.py']){const p=fileURLToPath(new URL(f,import.meta.url));evidenceSha256[p]=sha(p);}
assert.equal(evidenceSha256[fileURLToPath(new URL('./desk-c1v1-complete-frame-v3.mjs',import.meta.url))],index.finalFrameSha256);
const report={date:new Date().toISOString(),revision:'C20 completed compositor v3 actual-eye aggregation; final MP4 pending',patchProofSha256:sha(root+'/camera-patch.json'),actualCompositeIndex:indexPath,actualCompositeIndexSha256:sha(indexPath),actualPatchFrames:1725,allActualPatchFramesViewed:true,reviewScope:'Team sheet coverage001–192 plus separately viewed four corrected v3 PNGs;1721 remaining v3 PNGs byte-identical. The aggregator author personally reviewed only the four corrected PNGs and sheet163.',reviewedSheetRanges:[{range:[1,58],reviewer:'episode_c1',basis:team.priorCReviewBasis,attestedBy:'root'},{range:[59,64],reviewer:'root',receipt:team.root059to064Receipt},{range:[65,128],reviewer:'root',receipt:root65Path},{range:[129,192],reviewer:'episode_e1',receipt:peerPath}],v2KnownHudDefectPreservedAndFixedOnlyInV3:true,v3ChangedFrames:index.v3ChangedFrames,v3ChangedFrameReceipt:ownPath,actualImageDefectsRemaining:0,row38DelayedPointVerified:true,row7RevealVerified:true,allPhysicalCandidatesClassified:true,physicalCandidateSupplementAccepted:true,physicalCandidateEvidence:physicalPath,physicalMeasurementScope:'Original outside40–70 two-disc diagnostic values stay unchanged. Row13 principal is wholeM1; row18/20 points are model transitions within camera moves. This semantic classification is not a numerical pass or waiver.',readyForExport:true,evidenceSha256,finalEncodedVideoNotYetReviewed:true,finalGateNotYetRun:true,earsVerified:false,finalAcceptance:false};
const out=root+'/actual-patch-human-qa-v3.json';fs.writeFileSync(out,JSON.stringify(report,null,1),{flag:'wx'});console.log(JSON.stringify({out,sha256:sha(out),actualPatchFrames:1725,sheets:192,changedFrames:index.v3ChangedFrames,readyForExport:true,finalAcceptance:false}));
