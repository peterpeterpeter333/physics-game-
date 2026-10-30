// Aggregate actual, already completed team views; never infer eyes from source sameness.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const W=process.cwd(),root=path.join(W,'outputs/axes-20261023'),read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest='/private/tmp/ys/ys-chain-e1v1-final-20261024/actual-mp4-review-eof-20261025/manifest.json';
assert.equal(sha(manifest),'70e6a737a28eb13f9d94db8173b89f3517f181572750097e3d55934a681e3a58');const m=read(manifest),required=new Map();
for(const v of Object.values(m))if(v&&Array.isArray(v.frames))for(const r of v.frames){assert.equal(sha(r.file),r.sha256);if(required.has(r.frame))assert.deepEqual(required.get(r.frame),r);else required.set(r.frame,r);}
assert.equal(required.size,1200);const rows=[],receipts=[];
const names=['e1-final-eof-half01-26-e1reviewer-actual-eyes-20261025.json','root-e1-final-half-pages27-52-20261025.json','e1-final-half53-78-personal-review-20261025.json','root-e1-final-nonhalf-pages01-20-actual-eyes-20261025.json','e1-final-nonhalf21-43-personal-review-20261025.json'];
for(const n of names){const p=path.join(root,n),x=read(p),viewer=x.actualViewer??x.reviewer,frames=x.frames??x.frameRecords;assert(viewer&&Array.isArray(frames));
 const pages=x.pages??x.pageReviews;assert(Array.isArray(pages));for(const q of pages)assert.equal(sha(q.file),q.sha256);
 receipts.push({path:p,sha256:sha(p),viewer,frames:frames.length,contactPages:pages.length});
 for(const r of frames){assert(r.actuallyViewed===true||r.actuallyViewedInContactSheet===true||r.personallyViewedAsContactSheetCell===true);const target=required.get(r.frame);assert(target);assert.equal(target.file,r.file);assert.equal(target.sha256,r.sha256);assert.equal(sha(r.file),r.sha256);
  rows.push({frame:r.frame,time:r.time,file:r.file,sha256:r.sha256,actualViewer:viewer,receipt:p,receiptSha256:sha(p),viewingScope:'Personally viewed as an exact SHA-bound contact-sheet cell; full-resolution view only where original receipt explicitly states it',newEyeClaimByAggregateAuthor:false});}}
assert.equal(rows.length,1200);assert.equal(new Set(rows.map(r=>r.frame)).size,1200);assert([...required.keys()].every(j=>rows.some(r=>r.frame===j)));
const out=path.join(root,'e1-oldfinal-all1200-attributed-visual-review-aggregate-20261025.json');assert(!fs.existsSync(out));
fs.writeFileSync(out,JSON.stringify({episode:'E-1',purpose:'Exact old-final encoded JPEG eye evidence for later byte-identical reuse only',manifest,manifestSha256:sha(manifest),video:m.video,videoSha256:m.videoSha256,requiredFrames:1200,attributedPersonallyViewedFrames:1200,receipts,frames:rows.sort((a,b)=>a.frame-b.frame),allRequiredFramesCoveredExactlyOnce:true,oldKnownStaticProblemsNotDeclaredFixed:true,newFinalEncodedImagesNotYetReviewed:true,earListeningPerformed:false,all30fpsHumanViewed:false,finalAcceptance:false},null,1)+'\n',{flag:'wx'});console.log(JSON.stringify({out,sha256:sha(out),frames:rows.length}));
