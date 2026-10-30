import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const W = path.resolve(import.meta.dirname, '../..');
const O = path.join(W, 'outputs/axes-20261023');
const M = '/private/tmp/ys/ys-chain-b1v1-final4-owned-resume-v2-20261025/actual-mp4-review/manifest.json';
const N = '/private/tmp/ys/ys-chain-b1v1-final4-nonhalf-contact-20261025/manifest.json';
const shaCache = new Map();
const sha = p => { if (!shaCache.has(p)) shaCache.set(p, crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')); return shaCache.get(p); };
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const must = (ok, message) => { if (!ok) throw new Error(message); };
const m = read(M), n = read(N);
must(sha(M) === 'e96b832def9cfccc5cb5c67826cdfcd0438d55824289a0adc474b8783af40486', 'Original actual manifest changed');
must(sha(N) === '1a1020c7c67238cf1d859a06a9a42fc0e684a3177f1b81beba75a2a11e5cac99', 'Complement manifest changed');
must(sha(m.video) === m.videoSha256, 'Encoded B4 MP4 changed');

const specs = [
 ['H01-12', 'b1-final4-e1reviewer-half01-12-actual-eyes-r2-20261025.json', 'half', 1, 12, 'samples'],
 ['H13-24', 'root-b1-B4-actual-half-pages13-24-20261025.json', 'half', 13, 24, 'images'],
 ['H25-36', 'b1-final4-half25-36-personal-review-20261025.json', 'half', 25, 36, 'frames'],
 ['H37-48', 'b1-final4-e1reviewer-half37-48-actual-eyes-20261025.json', 'half', 37, 48, 'samples'],
 ['H49-60', 'root-b1-B4-actual-half-pages49-60-20261025.json', 'half', 49, 60, 'frames'],
 ['H61-72', 'b1-final4-e1reviewer-half61-72-actual-eyes-20261025.json', 'half', 61, 72, 'samples'],
 ['N01-15', 'b1-final4-nonhalf01-15-personal-review-20261025.json', 'nonhalf', 1, 15, 'frames'],
 ['N16-30', 'root-b1-B4-nonhalf-pages16-30-r2-20261025.json', 'nonhalf', 16, 30, 'frames'],
 ['N31-45', 'b1-final4-e1reviewer-nonhalf31-45-actual-eyes-20261025.json', 'nonhalf', 31, 45, 'frames']
];
const byFrame = new Map();
for (const [group, value] of Object.entries(m)) {
 if (!value || !Array.isArray(value.frames)) continue;
 for (const f of value.frames) {
  const prev = byFrame.get(f.frame);
  if (prev) must(prev.sha256 === f.sha256 && prev.jpegFile === f.file, 'Conflicting manifest frame ' + f.frame);
  else byFrame.set(f.frame, {frame:f.frame, time:f.time, jpegFile:f.file, sha256:f.sha256, groups:[], witnesses:[]});
  byFrame.get(f.frame).groups.push(group);
 }
}
must(byFrame.size === 1162 && byFrame.size === m.uniqueExtracted, 'Unexpected unique sample count');
const half = new Set(m.halfSeconds.frames.map(f=>f.frame));
const nonhalf = new Set(n.frames.map(f=>f.frame));
must(half.size === 714 && nonhalf.size === 448, 'Partition counts differ');
must([...half].every(f=>!nonhalf.has(f)), 'Half/non-half overlap');
must(new Set([...half,...nonhalf]).size === byFrame.size && [...byFrame.keys()].every(f=>half.has(f)||nonhalf.has(f)), 'Partition union differs');
for (const f of byFrame.values()) {
 must(sha(f.jpegFile) === f.sha256, 'Original actual JPEG changed: '+f.frame);
 f.actualJpegShaVerified = true;
}
const receipts=[], pages=[], scopeNormalizations=[];
const canonicalViewer = v => v === 'root' ? '/root' : v;
for (const [id, filename, kind, first, last, frameKey] of specs) {
 const file=path.join(O,filename), j=read(file), rows=j[frameKey];
 must(Array.isArray(rows), 'Missing frame array '+id);
 const declaredViewer=j.actualViewer||j.reviewer;
 must(typeof declaredViewer === 'string', 'Missing viewer '+id);
 const viewer=canonicalViewer(declaredViewer);
 const videoHash=j.videoSha256||j.mp4Sha256||j.video?.sha256;
 must(videoHash === m.videoSha256, 'Receipt video binding mismatch '+id);
 const scopedTop=j.allAllocatedCellsPersonallyViewed===true;
 const expectedPages=kind==='half'
  ?m.halfSeconds.pages.slice(first-1,last).map((p,index)=>({page:first+index,file:p,sha256:m.halfSeconds.pageSha256[p],frames:m.halfSeconds.frames.slice((first+index-1)*10,(first+index)*10).map(f=>f.frame)}))
  :n.pages.filter(p=>p.page>=first&&p.page<=last);
 const expectedSet=new Set(expectedPages.flatMap(p=>p.frames));
 must(rows.length===expectedSet.size && new Set(rows.map(f=>f.frame)).size===expectedSet.size && rows.every(f=>expectedSet.has(f.frame)), 'Allocated cells differ '+id);
 const declaredPages=j.pages;
 must(Array.isArray(declaredPages)&&declaredPages.length===expectedPages.length, 'Allocated pages differ '+id);
 for (const ep of expectedPages) {
  const dp=declaredPages.find(p=>(p.file||p.path)===ep.file);
  must(dp && dp.sha256===ep.sha256 && sha(ep.file)===ep.sha256, 'Page identity mismatch '+id+' '+ep.page);
  const declaredPageFrames=dp.frames||dp.frameIndices;
  if(declaredPageFrames)must(JSON.stringify(declaredPageFrames)===JSON.stringify(ep.frames), 'Page cell mapping mismatch '+id+' '+ep.page);
  must(dp.actuallyViewed===true||dp.personallyViewed===true||j.allAllocatedPagesPersonallyViewed===true||scopedTop, 'No explicit viewed-page declaration '+id);
  pages.push({kind,page:ep.page,file:ep.file,sha256:ep.sha256,actualShaVerified:true,frames:ep.frames,actualCells:ep.frames.length,actualViewer:viewer,receiptID:id,sourcePageActuallyViewed:dp.actuallyViewed??null,sourcePagePersonallyViewed:dp.personallyViewed??null,sourceTopAllAllocatedPagesPersonallyViewed:j.allAllocatedPagesPersonallyViewed??null,sourceTopAllAllocatedCellsPersonallyViewed:j.allAllocatedCellsPersonallyViewed??null,derivedFromExplicitScopeRatherThanMutatingSource:dp.actuallyViewed!==true&&dp.personallyViewed!==true});
 }
 let inheritedFalseCount=0;
 for(const f of rows) {
  const frame=byFrame.get(f.frame);
  must(frame && frame.sha256===f.sha256 && frame.jpegFile===f.file, 'Frame identity mismatch '+id+' '+f.frame);
  const direct=f.actuallyViewed===true||f.actuallyViewedInContactSheet===true;
  must(direct||scopedTop, 'No explicit personal viewing declaration '+id+' '+f.frame);
  if(f.actuallyViewed===false)inheritedFalseCount++;
  const page=expectedPages.find(p=>p.frames.includes(f.frame));
  const directViewer=f.actualViewer||f.viewer;
  if(directViewer)must(canonicalViewer(directViewer)===viewer,'Conflicting frame viewer '+id);
  frame.witnesses.push({receiptID:id,actualViewer:viewer,declaredReviewer:declaredViewer,contactKind:kind,page:page.page,contactCellIndex:page.frames.indexOf(f.frame),sourceFrameActuallyViewed:f.actuallyViewed??null,sourceFrameActuallyViewedInContactSheet:f.actuallyViewedInContactSheet??null,sourceTopAllAllocatedCellsPersonallyViewed:j.allAllocatedCellsPersonallyViewed??null,normalizedFromExplicitScope:!direct&&scopedTop,originalFullSizeClaimed:f.originalFullSizePersonallyViewed===true||f.individuallyOpenedAt1080x1920===true});
 }
 if(inheritedFalseCount)scopeNormalizations.push({receiptID:id,sourceFile:file,inheritedFrameActuallyViewedFalseCount:inheritedFalseCount,explicitTopScope:j.allAllocatedCellsPersonallyViewed??null,explicitContactFlagPresent:rows.some(f=>f.actuallyViewedInContactSheet===true),explanation:'Source actuallyViewed:false is preserved verbatim as inherited extraction metadata. The normalized witness is attributed only to the explicit top-level allAllocatedCellsPersonallyViewed declaration or explicit contact-cell flag; it does not rewrite the source or invent new eyes.'});
 receipts.push({id,file,sha256:sha(file),actualViewer:viewer,declaredReviewer:declaredViewer,kind,firstPage:first,lastPage:last,actualCells:rows.length,allAllocatedCellsSupportedByExplicitDeclaration:true,frameArrayKey:frameKey,sourceTopAllAllocatedCellsPersonallyViewed:j.allAllocatedCellsPersonallyViewed??null,scope:j.scope,findings:j.findings,judgment:j.judgment??null,knownRepairPending:j.knownRepairPending??null,mandatoryNewRepairsFound:j.mandatoryNewRepairsFound??null,withdrawnFindings:j.withdrawnFindings??null,extraOriginals:j.fullSizeAdditional||j.originalSizeSpots||[]});
}
must(pages.length===117 && pages.reduce((s,p)=>s+p.actualCells,0)===1162, 'Total page-cell count differs');
for (const f of byFrame.values())must(f.witnesses.length===1, 'Missing/duplicate primary allocation '+f.frame);
const majorPath=path.join(O,'b1-final4-e1reviewer-major12-problem2-actual-eyes-20261025.json');
const major=read(majorPath);
must(major.video.sha256===m.videoSha256&&major.comparisons.length===12,'Major receipt mismatch');
for(const c of major.comparisons){
 must(c.comparisonPersonallyViewed===true&&sha(c.comparisonFile)===c.comparisonSha256,'Major comparison not viewed or changed');
 const f=c.actualVideoFrame, old=byFrame.get(f.frame);
 must(old&&old.sha256===f.sha256&&c.actualVideoFrame.personallyViewedInComparison===true,'Major actual mismatch');
 old.additionalMajorWitness={receiptID:'MAJOR12+PROBLEM2',actualViewer:major.actualViewer,comparisonNumber:c.number,comparisonSha256:c.comparisonSha256};
}
for(const p of major.problem.images)must(p.personallyViewedOriginal===true&&sha(p.file)===p.sha256,'Problem image not viewed or changed');
must(major.problem.json.personallyReadInFull===true&&sha(major.problem.json.file)===major.problem.json.sha256,'Problem JSON changed or unread');
const groupCoverage=Object.fromEntries(Object.entries(m).filter(([,g])=>g&&Array.isArray(g.frames)).map(([name,g])=>[name,{entries:g.frames.length,uniqueFrames:new Set(g.frames.map(f=>f.frame)).size,allIncludedInAttributed1162:g.frames.every(f=>byFrame.get(f.frame)?.sha256===f.sha256),frameIndices:g.frames.map(f=>f.frame)}]));
const frameRecords=[...byFrame.values()].sort((a,b)=>a.frame-b.frame);
const digest = data => crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
const status={
 schemaVersion:1,id:'B-1-B4-attributed-personal-visual-review-aggregate-1162',createdAt:new Date().toISOString(),aggregator:'/root/e1_row_timing_final',
 candidate:'B4, still draft; not final B5 acceptance',sourceManifest:{file:M,sha256:sha(M)},complementManifest:{file:N,sha256:sha(N)},video:{file:m.video,sha256:m.videoSha256,actualShaVerified:true,expectedFrames:m.expectedFrames,duration:m.duration},
 script:{file:fs.realpathSync(new URL(import.meta.url)),sha256:sha(fs.realpathSync(new URL(import.meta.url)))},
 semanticLimits:{newPersonalViewingPerformedByAggregation:false,attributedPriorPersonalViewingOnly:true,allExtracted1162HaveExplicitPersonalViewingWitness:true,all10700MovieFramesViewed:false,continuousPlaybackPerformed:false,earListeningPerformed:false,finalAcceptance:false},
 partition:{half714:half.size,nonHalf448:nonhalf.size,intersection:0,union1162:byFrame.size,exactDisjointComplement:true,all117ContactPageHashesVerified:true,all1162ActualJpegHashesVerified:true,allOrderedFrameShaDigest:digest(frameRecords.map(f=>[f.frame,f.sha256])),halfOrderedFrameShaDigest:digest(frameRecords.filter(f=>half.has(f.frame)).map(f=>[f.frame,f.sha256])),nonhalfOrderedFrameShaDigest:digest(frameRecords.filter(f=>nonhalf.has(f.frame)).map(f=>[f.frame,f.sha256]))},
 attributedCounts:Object.fromEntries([...new Set(frameRecords.map(f=>f.witnesses[0].actualViewer))].map(v=>[v,frameRecords.filter(f=>f.witnesses[0].actualViewer===v).length])),
 receipts,pages,scopeNormalizations,groupCoverage,
 cameraMoveDetailCoverage:m.allCameraMoveDetails.map(d=>({...d,allNamedSampleFramesAttributed:d.frames.every(f=>byFrame.has(f))})),
 samplingLimits:{expectedMovieFrames:m.expectedFrames,uniqueDecodedAndAttributedSamples:byFrame.size,addedActualPatchSourcesExtracted:m.allAddedActualPatchSources.frames.length,addedActualPatchSourcesNotExtracted:m.allAddedActualPatchSources.unextractedSourceFrames.length,allAddedPatchSourceFramesClaimedViewed:false,explanation:'All394 named camera-move samples are covered, but this is not every30fps frame of every movement. The original624 unextracted added-source indices remain unclaimed.'},
 majorAndProblem:{file:majorPath,sha256:sha(majorPath),actualViewer:major.actualViewer,comparisonCount:12,allComparisonAndActualImageHashesVerified:true,comparisonOrientation:major.comparisonOrientation,comparisons:major.comparisons,problem:major.problem,findings:major.findings},
 outstanding:{requiredRepairPending:[{code:'B7-sixth-needle-carry',knownAffectedReviewedFrames:[4125,4140],plannedSourceRepairFrames:'16 newly rendered carry frames; root maintains exact source map',status:'PENDING_NEW_ENCODED_OUTPUT_AND_ACTUAL_EYES',oldImageReviewDoesNotApproveKnownBadState:true}],P3Preserved:true,P3SourceRefs:receipts.filter(r=>JSON.stringify(r.findings).includes('P3')).map(r=>r.id),ears:false,finalAcceptance:false},
 excludedSupersededOrMalformed:[{file:path.join(O,'b1-final4-e1reviewer-half01-12-actual-eyes-20261025.json'),reason:'Superseded by r2 which withdraws the false date-card defect.'},{file:path.join(O,'root-b1-B4-nonhalf-pages16-30-20261025.json'),reason:'Malformed truncated output is preserved but excluded. Valid r2 serialization used, not a new-eyes claim.'}],
 reusePolicy:{onlyExactNewlyDecodedJpegSha:true,knownBadStateCannotBeApprovedByEquality:true,unknownOrChangedNewJpegs:'UNAPPROVED_REQUIRES_PERSONAL_VIEWING',decodedProvenanceMustBeSeparatelyEstablished:true,rawSourceOrManifestCopyInsufficient:true,noAutomaticFinalAcceptance:true},
 frameRecords
};
const args=process.argv.slice(2);
if(args[0]==='--summary'){const {frameRecords,...summary}=status;console.log(JSON.stringify(summary));}
else if(args[0]==='--frames'){const a=Number(args[1]),b=Number(args[2]);must(Number.isInteger(a)&&Number.isInteger(b)&&a>=0&&b>a,'Expected --frames START END');console.log(JSON.stringify(frameRecords.slice(a,b)));}
else if(args[0]==='--compact-index'){console.log(JSON.stringify(frameRecords.map(f=>[f.frame,f.sha256,f.witnesses[0].receiptID,f.witnesses[0].actualViewer])));}
else throw new Error('Read-only stdout utility. Usage: --summary | --frames START END | --compact-index. It never writes or approves a film.');

