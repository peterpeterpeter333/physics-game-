// Receipt writer only: the named reviewer actually displayed all12 sheets.
// No MP4 decode/render/encode and no original manifest editing.
import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));
const review='/private/tmp/ys/ys-chain-b1v1-final4-owned-resume-v2-20261025/actual-mp4-review';
const destination=W+'outputs/axes-20261023/b1-final4-half25-36-personal-review-20261025.json';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifestFile=review+'/manifest.json',m=JSON.parse(fs.readFileSync(manifestFile));
assert.equal(m.videoSha256,'bb88f94903c1191a712c1d81df93fa6e6cd82fdda44b570f5326b3d76db38db9');
assert.equal(sha(m.video),m.videoSha256);assert.equal(m.expectedFrames,10700);
assert.equal(m.halfSeconds.frames.length,714);assert.equal(m.halfSeconds.pages.length,72);
const pages=[];const frames=[];
for(let page=25;page<=36;page++){
 const file=review+'/half-seconds-'+String(page).padStart(2,'0')+'.jpg';
 assert.equal(m.halfSeconds.pages[page-1],file);assert.equal(sha(file),m.halfSeconds.pageSha256[file]);
 const members=m.halfSeconds.frames.slice((page-1)*10,page*10);assert.equal(members.length,10);
 for(let i=0;i<members.length;i++){
  const f=members[i];assert.equal(f.frame,3600+frames.length*15);assert.equal(f.time,f.frame/30);assert.equal(sha(f.file),f.sha256);
  frames.push({...f,actuallyViewed:true,actualViewer:'/root/b1_final_cpu_preflight',
   personalViewingMethod:'Decoded JPEG visibly represented as one of10 cells on the exact SHA-bound original-resolution contact sheet',
   contactPage:file,contactPageNumber:page,contactPageSha256:m.halfSeconds.pageSha256[file],contactCellIndex:i,
   individuallyOpenedAt1080x1920:false,
   finding:f.frame===4125||f.frame===4140?'Known row18→19 hand/drop discontinuity; B7 replacement pending, not accepted as fixed':'No new obvious visual blocker found in this sampled cell; not a full-resolution text or audio certification'});
 }
 pages.push({page,file,sha256:m.halfSeconds.pageSha256[file],displayedVia:'view_image detail=original',
  actualViewer:'/root/b1_final_cpu_preflight',personallyViewed:true,cells:10,firstTime:members[0].time,lastTime:members.at(-1).time,
  notes:page===28?'Known hand/needle boundary missing continuation at137.5/138.0; do not reuse these2 old cells as final5 approval.':
   page===29||page===30?'Frozen full-screen Mio beat is intentional.':page>=33?'Field pattern is the principal; small central sphere alone is not the width metric.':'No new obvious blocker found.'});
}
assert.equal(frames.length,120);assert.equal(frames[0].time,120);assert.equal(frames.at(-1).time,179.5);
const report={id:'ys-chain-b1v1',receiptType:'Attributed scoped personal visual review of actual final4 decoded cells',
 createdAt:new Date().toISOString(),actualViewer:'/root/b1_final_cpu_preflight',reviewer:'/root/b1_final_cpu_preflight',
 video:m.video,videoSha256:m.videoSha256,manifest:manifestFile,manifestSha256:sha(manifestFile),
 provenanceSha256:m.provenanceSha256,preparedSha256:m.preparedSha256,
 scope:{halfSecondPages:[25,36],pageCount:12,decodedCellsPersonallyViewed:120,firstSeconds:120,lastSeconds:179.5,
  exactFrameIndices:frames.map(f=>f.frame),all120DecodedJpegSHAIndependentReadVerified:true,all12PageSHAIndependentReadVerified:true,
  entireEncodedFilmWatched:false,all30fpsPlaybackFramesViewed:false,all120Original1080x1920ImagesIndividuallyOpened:false,
  audioActuallyHeard:false,otherReviewPagesLoaded:false},
 findings:{newConfirmedBlockingDefects:[],knownOutstanding:[{code:'B7-sixth-needle-carry-pending',
   frames:[4125,4140],timeSeconds:[137.5,138],
   evidence:'At page28, hand disappears at row19 boundary; root separately inspected adjacent raw frames and approved NEW16-frame carry. These old encoded cells are NOT final5 repair evidence.',
   resolvedInThisReceipt:false}],
  observedGood:['Rough stone is large and readable, changes to sphere with chips.',
   'Needle-placement gesture,12-needle alignment and subsequent dip direction can be followed across the sampled sequence.',
   'Full-screen Mio beat appears at the frozen intended cue, not an unexpected lost model.',
   'Iron powder rearranges into complete bounded field paths; yellow arrows and redN/blueS anchored labels are visible without model/label crop.',
   'Forearms entering outside the picture are intentional staging, distinct from contact fingertip/principal/needle visibility.'],
  limits:['360pixel-wide sheet cells are not proof of perfect original-size typography. No glyph defect was promoted from a thumbnail suspicion.',
   'Half-second samples do not certify all in-between30fps events, exact voice synchronization, hearing quality or numeric automatic-gate status.',
   'Frozen Japanese, audio, subtitles, original gate/results and original manifest were not changed.']},
 pages,frames,final5ReusePolicy:'Only a final5 decoded JPEG with byte-exact SHA equal to one of these120 decoded JPEGs may reuse its attributed cell review. Never infer reuse merely from unchanged raw source. Frames4125/4140 require NEW final5 eyes.',
 scriptSha256:sha(fileURLToPath(import.meta.url)),allActuallyViewed:false,earListeningPerformed:false,finalPassed:false,finalAcceptance:false};
fs.writeFileSync(destination,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:destination,sha256:sha(destination),pageCount:12,cells:120,knownB7Pending:true,newBlockingDefects:0,finalAcceptance:false},null,2));
