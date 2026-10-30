// NEW scoped receipt writer only. No decode/render/encode or earlier-file edits.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));
const R='/private/tmp/ys/ys-chain-e1v1-final-20261024/actual-mp4-review-eof-20261025';
const target=W+'outputs/axes-20261023/e1-final-half53-78-personal-review-20261025.json';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifestFile=R+'/manifest.json',m=JSON.parse(fs.readFileSync(manifestFile));
assert.equal(m.videoSha256,'7f882409832ca427cf6ce8276d3ff14f2121baaa92ad48633d616861e6dac1bd');
assert.equal(sha(m.video),m.videoSha256);assert.equal(m.expectedFrames,11606);assert.equal(m.fps,30);
assert.equal(m.halfSeconds.frames.length,774);assert.equal(m.halfSeconds.pages.length,78);
const viewer='/root/b1_final_cpu_preflight',pages=[],frames=[];
for(let page=53;page<=78;page++){
 const file=R+'/half-seconds-'+String(page).padStart(2,'0')+'.jpg';
 assert.equal(m.halfSeconds.pages[page-1],file);assert.equal(sha(file),m.halfSeconds.pageSha256[file]);
 const members=m.halfSeconds.frames.slice((page-1)*10,page*10);
 assert.equal(members.length,page===78?4:10);
 for(let i=0;i<members.length;i++){
  const f=members[i];assert.equal(f.frame,7800+frames.length*15);assert.equal(f.time,f.frame/30);assert.equal(sha(f.file),f.sha256);
  frames.push({...f,actuallyViewed:true,actualViewer:viewer,contactPage:file,contactPageNumber:page,
   contactPageSha256:m.halfSeconds.pageSha256[file],contactCellIndex:i,
   viewingMethod:'Personally displayed via view_image detail=original on its exact SHA-bound contact sheet',
   individuallyOpenedAt1080x1920:[9015,9570,10980,11580].includes(f.frame),
   finding:f.time>=309&&f.time<=317?'Known pen:fact/static interval, repair pending; this receipt does not accept it as fixed':'No new confirmed visual blocker in this sampled cell; not full30fps or audio certification'});
 }
 pages.push({page,file,sha256:m.halfSeconds.pageSha256[file],personallyViewed:true,actualViewer:viewer,
  displayTool:'view_image detail=original',cells:members.length,firstTime:members[0].time,lastTime:members.at(-1).time});
}
assert.equal(frames.length,254);assert.equal(frames[0].time,260);assert.equal(frames.at(-1).time,386.5);
const originals=[
 [9015,'a0db3a2c038467a7f31611c360564f3a960e6d45962c5d18345eb99e62cc7156','Caption crosses the upper pendulum rod/glass; bob and clock dial remain clearly visible. Not a new blocking defect.'],
 [9570,'6c2fed8c0181dd48c85111e0d61c50beb3d68cc36e2db438d2db3b05c7d8ca94','Rocking boat, pendulum rod/bob and clock dial visible at original size; cards overlap upper-left case, not the critical bob/dial.'],
 [10980,'65822a15fa2a1489d08d146ac3354079bdf5f51b607e5c19b1449f5a633b31ec','London dial reads10:00 and sun is at its high point; no answer is revealed.'],
 [11580,'aa9eaca4effd68c3165fc0e86c66e8fc8e3d3f92d00648fbe794963acb04e442','Exactly three remaining ships, two positions and the small clock are visible; no fourth ship.']
].map(([frame,s,note])=>{const f=frames.find(x=>x.frame===frame);assert(f);assert.equal(f.sha256,s);return{frame,time:frame/30,file:f.file,sha256:s,actuallyViewed:true,actualViewer:viewer,displayTool:'view_image detail=original',resolution:[1080,1920],note};});
const report={id:'ys-chain-e1v1',receiptType:'Attributed scoped personal review of actual encoded JPEG cells',createdAt:new Date().toISOString(),actualViewer:viewer,
 video:m.video,videoSha256:m.videoSha256,manifest:manifestFile,manifestSha256:sha(manifestFile),provenanceSha256:m.provenanceSha256,
 sourceFreezeSha256:m.sourceFreezeSha256,scope:{halfSecondPages:[53,78],pageCount:26,decodedCellsPersonallyViewed:254,
 firstSeconds:260,lastSeconds:386.5,exactFrameIndices:frames.map(x=>x.frame),all254DecodedJpegSHAIndependentlyVerified:true,
 all26PageSHAIndependentlyVerified:true,individualOriginalSizeOpens:4,entireEncodedFilmWatched:false,all30fpsFramesViewed:false,
 audioActuallyHeard:false,otherReviewPagesLoaded:false},
 findings:{newConfirmedBlockingDefects:[],knownOutstanding:[
  {code:'E-early-hand-11-19-pending',seconds:[11,19],withinThisReceiptScope:false,resolvedInThisReceipt:false},
  {code:'E-pen-fact-static-309-317-pending',seconds:[309,317],withinThisReceiptScope:true,resolvedInThisReceipt:false}],
  observedGood:['Knot counter progresses, rope/sandglass/compass remain visible.',
   'Blue current arrows and distinct tracks support accumulation of dead-reckoning error; fog hides the star.',
   'Hypothesis, implication, prediction and fact cards can be followed without treating the guess as proof.',
   'Pendulum/clock/boat remain legible during the irregular rocking sequence; the frozen full-face judge beat is intentional.',
   'The0.5degree/20000pound prize and2minute relation are legible; the following East/West challenge does not prematurely give the answer.',
   'Original-size final map shows exactly three remaining ships, not four, and the returned clock beside the original map.'],
  nonBlockingObservations:[{time:300.5,priority:'P3',description:'Caption overlaps upper rod/glass, but bob/dial remain visible; do not treat this as missing principal evidence.'}],
  limits:['Half-second sheets cannot certify all in-between30fps events, exact voice synchronization, sound or every original-size glyph.',
   'Normal pendulum motion sampled at0.5seconds can alias a1second period; no new static defect was inferred solely from matching sampled positions.',
   'Canonical narration, cue table, episode/common instructions were read; Japanese/audio/captions and original gate results were not altered.',
   'Known unresolved early-hand and pen:fact defects prevent any global final acceptance.']},pages,frames,originalSizeViews:originals,
 reusePolicy:'A future repaired MP4 may reuse these attributed eyes only when its decoded JPEG is byte-exact SHA equal. Unchanged raw sources alone do not establish reuse.',
 writerSha256:sha(fileURLToPath(import.meta.url)),allActuallyViewed:false,earListeningPerformed:false,finalPassed:false,finalAcceptance:false};
fs.writeFileSync(target,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:target,sha256:sha(target),pageCount:26,cells:254,originalSize:4,newBlockingDefects:0,finalAcceptance:false},null,2));
