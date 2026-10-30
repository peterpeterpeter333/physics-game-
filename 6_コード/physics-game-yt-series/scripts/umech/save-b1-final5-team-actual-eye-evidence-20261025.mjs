// NEW evidence serialization only. Eye claims below are explicit personal
// tool views or trusted root declarations, never inferred from byte identity.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';
assert(process.argv.includes('--authorized'));
const W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series',O=W+'/outputs/axes-20261023';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,1)+'\n',{flag:'wx'});
const cm='/private/tmp/ys/ys-chain-b1v1-final5-pending-eye-contacts-20261025/manifest.json',cp=O+'/b1-final5-decoded-identity-comparison-20261025.json';
const oldFile=O+'/b1-final4-all1162-attributed-visual-review-aggregate-20261025.json';
const manifestFile='/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025/actual-mp4-review/manifest.json';
const majorFile=O+'/root-b1-final5-major12-problem2-actual-eye-receipt-20261025.json';
const pins={[cm]:'cce7c2a4b3d64c0dad34a495a79c356506861170902f05ea43977c1b4c42b3be',[cp]:'66f20cc1e2359c67426b0f881e2b5017a42050d318378d3721678e2fc34f368a',[oldFile]:'80ed17b46bcadab163436ffc6567707c9f7a571e4a5063001a2f602f43dc7934',[manifestFile]:'2f8bb0a84771ae36c141f1c69a8c4d19129f0a40c911331d8a4071a2ca874f8c',[majorFile]:'edd129b3b1e5bdba6d51555b3ea517637b7c244894231f90bb7120142c003351'};
const pin=(p,h)=>{if(Object.hasOwn(pins,p))assert.equal(pins[p],h);assert.equal(sha(p),h,p);pins[p]=h;};
const verify=()=>{for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);};verify();
const contacts=read(cm),comparison=read(cp),old=read(oldFile),manifest=read(manifestFile);pin(manifest.video,manifest.videoSha256);
assert.equal(manifest.videoSha256,'6780889510a3d881ec446a58627325edf00cd0b43206c7f8b61c166c270ca1d2');
assert.deepEqual(comparison.counts,{incomingUniqueFrames:1803,mechanicallyExactNotKnownBad:1152,unapprovedUnknownChangedOrKnownBad:651,original1162NotPresentInIncoming:0});
const pending=new Map(contacts.pendingFrames.map(r=>[r.frame,r]));assert.equal(pending.size,651);
const base={episode:'B-1',candidate:'final5-carry',mp4:manifest.video,mp4Sha256:manifest.videoSha256,
 manifest:manifestFile,manifestSha256:pins[manifestFile],contactManifest:cm,contactManifestSha256:pins[cm],
 earsVerified:false,continuousPlaybackViewed:false,all30fpsFramesViewed:false,originalSourceAudioCaptionsUnchanged:true,
 originalGateNGPreserved:true,automaticWaiverApplied:false,finalAcceptance:false};
function scope(pages,viewer){
 const chosen=contacts.pages.filter(p=>pages.includes(p.page));assert.equal(chosen.length,pages.length);
 const samples=chosen.flatMap(p=>p.frames.map(j=>{const f=pending.get(j);assert(f);pin(f.file,f.sha256);return{frame:j,time:j/30,file:f.file,sha256:f.sha256,page:p.page,actuallyViewed:true,actualViewer:viewer,viewingMethod:'Personally inspected actual decoded image cell in individually displayed1800x1336 contact sheet; not a separate full-resolution claim'};}));
 for(const p of chosen)pin(p.file,p.sha256);
 return{pages:chosen.map(p=>({...p,actuallyViewed:true,actualViewer:viewer})),samples};
}
const firstPages=Array.from({length:33},(_,i)=>i+1),lastPages=Array.from({length:33},(_,i)=>i+34);
const own=scope(firstPages,'/root/b1_final_cpu_preflight'),root=scope(lastPages,'/root');assert.equal(own.samples.length,330);assert.equal(root.samples.length,321);
const spots=[20,1208,1373,2066,2240].map(j=>{const r=pending.get(j);return{frame:j,time:j/30,file:r.file,sha256:r.sha256,actuallyViewed:true,actualViewer:'/root/b1_final_cpu_preflight',displayResolution:[1080,1920],viewingMethod:'Individually displayed via view_image detail=original'};});
const nail={frame:2240,time:2240/30,initialObservation:'Caption says the nails were attracted while they are still separated at this sample.',
 rootAdjacentActualReview:'Root personally viewed2241..2263: sequential contacts occur around2241..2251, all attached from2252.',
 rootSourceTimingComparison:{startsSeconds:[74.61,74.68,74.75],eachMotionDurationSeconds:.4,exactVoiceSeconds:74.611666},
 disposition:'Not a new required defect.2240 is only about0.055s after the first placement/movement start and before the final nail start; subsequent actual contacts match the prescribed.4s motions.',
 currentReviewerDidNotViewAdjacentRootAllocation:true,sourceOrJapaneseChanged:false};
const ownFile=O+'/b1-final5-pending01-33-personal-eye-receipt-20261025.json';
write(ownFile,{...base,actualViewer:'/root/b1_final_cpu_preflight',recordedBy:'/root/b1_final_cpu_preflight',
 scope:{pendingPages:[1,33],personallyViewedContactSheets:33,personallyViewedCells:330,firstFrame:own.samples[0].frame,lastFrame:own.samples.at(-1).frame,individualOriginalSizeImages:5,rootPages34through66NotViewedByThisReviewer:true},
 pages:own.pages,samples:own.samples,individualOriginals:spots,
 findings:{newRequiredDefects:[],retainedP3:[{code:'early-garlic-waiting-prop-under-subtitle',frame:1208,time:1208/30,originalSizeConfirmed:true,observation:'Garlic waiting low on the body is blurred and largely under the subtitle. By1373=45.767s it is large and clear at the nose, so the required nose/freeze action is present.',newDefect:false}],boundaryObservationResolvedByTrustedRoot:nail},
 conclusion:'All330 assigned actual cells and5 named original-size checks personally inspected; no new required defect found in this scope. No claim to entire movie/audio, root pages or quality-gate acceptance.'});pin(ownFile,sha(ownFile));
// Root explicitly declared these33 sheets/321 cells personally displayed,
// plus half-second sheets28/29. Serialization is by this agent, not attribution.
const halfRoot=[28,29].map(n=>{const file=manifest.halfSeconds.pages[n-1];const h=sha(file);pin(file,h);return{page:n,file,sha256:h,actuallyViewed:true,actualViewer:'/root',
 frames:manifest.halfSeconds.frames.slice((n-1)*10,n*10).map(r=>{pin(r.file,r.sha256);return{frame:r.frame,file:r.file,sha256:r.sha256};})};});
assert.equal(halfRoot.reduce((s,p)=>s+p.frames.length,0),20);
const rootFile=O+'/root-b1-final5-pending34-66-and-half28-29-actual-eye-receipt-20261025.json';
write(rootFile,{...base,actualViewer:'/root',recordedBy:'/root/b1_final_cpu_preflight',
 attributionBasis:'Explicit trusted root messages: root personally displayed pending34..66 all321 cells, and actual half-second sheets28/29 all20 cells; this serializer does not claim to be the viewer.',
 scope:{pendingPages:[34,66],personallyViewedContactSheets:33,personallyViewedPendingCells:321,supplementalHalfSecondPages:[28,29],supplementalHalfSecondCells:20,notNecessarily341UniqueFrames:true},
 pages:root.pages,samples:root.samples,additionalHalfSecondPages:halfRoot,
 observations:['2241..2263 nails attach sequentially; all attached from2252, matching original timing.','2652..2681 magnet N/S flash labels legible.','2869..2957 approach/recoil/spin coherent; prior97.6s claim stays withdrawn.','3651..3709 rough-rock transition clear.','4122..4245 repaired needle stays on ball through hand withdrawal; all16 repair inputs visible in actual encoded samples.','10467..10583 final compass and lower captions do not disappear.','Half-second sheets28/29: needle carry, subsequent orientations and cue-final face coherent.'],
 findings:{newRequiredDefects:[],nailBoundary:nail},notAll72HalfSecondSheetsNewlyViewed:true});pin(rootFile,sha(rootFile));
const newByFrame=new Map([...own.samples.map(r=>({...r,receipt:ownFile,receiptSha256:pins[ownFile]})),...root.samples.map(r=>({...r,receipt:rootFile,receiptSha256:pins[rootFile]}))].map(r=>[r.frame,r]));assert.equal(newByFrame.size,651);
const records=[];
for(const r of comparison.exactMatches){
 assert(!newByFrame.has(r.frame));assert(r.oldWitnesses.length>0);pin(r.file,r.sha256);
 const witnesses=r.oldWitnesses.map(w=>{const receipt=old.receipts.find(x=>x.id===w.receiptID);assert(receipt&&receipt.actualViewer===w.actualViewer);pin(receipt.file,receipt.sha256);return{...w,receipt:receipt.file,receiptSha256:receipt.sha256,newPersonalViewingClaimed:false,exactSameFrameAndDecodedJpegReuse:true};});
 records.push({frame:r.frame,time:r.frame/30,jpegFile:r.file,sha256:r.sha256,groups:r.groups,viewingKind:'attributed exact same-frame decoded-JPEG reuse',actualViewer:witnesses[0].actualViewer,witnesses,actuallyViewedPixelEvidence:true,newPersonalViewingPerformed:false});
}
for(const r of contacts.pendingFrames){const v=newByFrame.get(r.frame);assert(v&&v.sha256===r.sha256);records.push({frame:r.frame,time:r.frame/30,jpegFile:r.file,sha256:r.sha256,groups:r.groups,viewingKind:'new actual decoded JPEG personally inspected in contact sheet',actualViewer:v.actualViewer,
 witnesses:[{actualViewer:v.actualViewer,receipt:v.receipt,receiptSha256:v.receiptSha256,page:v.page,sourceFrameActuallyViewed:true,originalFullSizeClaimed:spots.some(s=>s.frame===r.frame)&&v.actualViewer==='/root/b1_final_cpu_preflight'}],actuallyViewedPixelEvidence:true,newPersonalViewingPerformed:true});}
records.sort((a,b)=>a.frame-b.frame);assert.equal(records.length,new Set(records.map(r=>r.frame)).size);assert.equal(records.length,1803);
const indexed=new Map(records.map(r=>[r.frame,r])),halfPages=[];
for(let i=0;i<72;i++){
 const file=manifest.halfSeconds.pages[i],h=sha(file),previous=old.pages.find(p=>p.kind==='half'&&p.page===i+1);pin(file,h);assert(previous);
 const rootActual=halfRoot.find(p=>p.page===i+1);
 if(rootActual){assert.equal(h,rootActual.sha256);halfPages.push({file,sha256:h,actuallyViewed:true,actualViewer:'/root',reviewer:'/root',receipt:rootFile,receiptSha256:pins[rootFile],newPersonalViewingPerformed:true});}
 else{assert.equal(h,previous.sha256,'Only root-viewed28/29 may differ from old sheets');pin(previous.file,previous.sha256);const receipt=old.receipts.find(r=>r.id===previous.receiptID);assert(receipt&&receipt.actualViewer===previous.actualViewer);pin(receipt.file,receipt.sha256);halfPages.push({file,sha256:h,actuallyViewed:true,actualViewer:previous.actualViewer,reviewer:previous.actualViewer,receipt:receipt.file,receiptSha256:receipt.sha256,
 oldPage:previous.file,oldPageSha256:previous.sha256,exactSameOldContactPageByteReuse:true,newPersonalViewingPerformed:false});}
}
assert.equal(halfPages.filter(p=>p.newPersonalViewingPerformed).length,2);
const aggregateFile=O+'/b1-final5-all1803-attributed-visual-review-aggregate-20261025.json';
write(aggregateFile,{...base,aggregator:'/root/b1_final_cpu_preflight',aggregationIsNotClaimOfPersonallyViewingAllSamples:true,
 comparison:{file:cp,sha256:pins[cp]},previous1162Aggregate:{file:oldFile,sha256:pins[oldFile]},
 receipts:[{file:ownFile,sha256:pins[ownFile],actualViewer:'/root/b1_final_cpu_preflight',newPendingCells:330},{file:rootFile,sha256:pins[rootFile],actualViewer:'/root',newPendingCells:321,newHalfPageCells:20}],
 partition:{totalUnique:1803,attributedOldExactReuse:1152,newPersonalCells:651,oldKnownRepairFramesNeverApprovedByIdentity:[4125,4140]},
 all714HalfSecondSamplesHaveAttributedExactPixelEyes:manifest.halfSeconds.frames.every(r=>indexed.get(r.frame)?.sha256===r.sha256),
 halfPageCoverage:{total:72,exactOldPageAttributedReuse:70,newRootPages:2},halfPages,frameRecords:records,
 major12Problem2:{file:majorFile,sha256:pins[majorFile],actualViewer:'/root',newIndependentReceipt:true},
 oldOutstandingRepairStatusRetainedVerbatim:old.outstanding.requiredRepairPending,
 repaired16NewEncodedEyes:{frames:Array.from({length:16},(_,i)=>4125+i),actualViewer:'/root',receipt:rootFile,receiptSha256:pins[rootFile],allPresentInRootActualEyeScope:Array.from({length:16},(_,i)=>4125+i).every(j=>newByFrame.get(j)?.actualViewer==='/root')},
 P3ObservationsRetained:true,allSamplesHaveExactlyScopedEyeWitnesses:true,oldGateFailuresAreNotChangedByHumanReview:true,
 protectedInputSha256:{...pins},fullFilmPlaybackOrAudioCertification:false});pin(aggregateFile,sha(aggregateFile));
const samples=manifest.halfSeconds.frames.map(im=>{const r=indexed.get(im.frame);assert(r&&r.sha256===im.sha256);return{frame:im.frame,actualJpegSha256:im.sha256,actuallyViewed:true,reviewer:r.actualViewer,actualViewer:r.actualViewer,viewingKind:r.viewingKind,sourceWitnesses:r.witnesses,newPersonalViewingPerformed:r.newPersonalViewingPerformed,approvedSupplement:false};});assert.equal(samples.length,714);
const eyesFile=O+'/b1-final5-exact714-sample72-page-eyes-20261025.json';
write(eyesFile,{episode:'B-1',mp4Sha256:manifest.videoSha256,manifest:manifestFile,manifestSha256:pins[manifestFile],aggregate:aggregateFile,aggregateSha256:pins[aggregateFile],samples,pages:halfPages,
 scope:{uniqueActualSamples:714,actualHalfPages:72,oldExactPageReuse:70,newRootPages:[28,29],notNew72PageViewingClaim:true},
 noAutomaticSupplementOrOriginalGateWaiver:true,earsVerified:false,continuousPlaybackViewed:false,finalAcceptance:false});
verify();console.log(JSON.stringify({ownReceipt:ownFile,ownSha256:sha(ownFile),rootReceipt:rootFile,rootSha256:sha(rootFile),aggregate:aggregateFile,aggregateSha256:sha(aggregateFile),eyes:eyesFile,eyesSha256:sha(eyesFile),counts:{oldReuse:1152,newEyes:651,total:1803,grid:714,oldPages:70,newRootPages:2}}));
