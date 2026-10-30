// Attributed scoped receipt after personally displaying all23 named sheets.
// SHA verification only; no decode/render/encode or original-file editing.
import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));
const input='/private/tmp/ys/ys-chain-e1v1-final-nonhalf-contact-20261025/manifest.json';
const out=W+'outputs/axes-20261023/e1-final-nonhalf21-43-personal-review-20261025.json';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(sha(input),'59cc4ab5bd12cc522f41779e3dee50efe1e1b21b2e0021c11e3956d84be107fb');
const m=JSON.parse(fs.readFileSync(input)),source=JSON.parse(fs.readFileSync(m.sourceManifest));
assert.equal(sha(m.sourceManifest),m.sourceManifestSha256);assert.equal(sha(m.video),m.videoSha256);
assert.equal(m.videoSha256,'7f882409832ca427cf6ce8276d3ff14f2121baaa92ad48633d616861e6dac1bd');
assert.equal(m.frames.length,426);assert.equal(m.pages.length,43);
const viewer='/root/b1_final_cpu_preflight',pages=m.pages.filter(p=>p.page>=21&&p.page<=43).map(p=>{
 assert.equal(sha(p.file),p.sha256);assert.equal(p.width,1800);assert.equal(p.height,1336);
 return{...p,actuallyViewed:true,actualViewer:viewer,personallyViewed:true,displayTool:'view_image detail=original'};
});
const half=new Set(source.halfSeconds.frames.map(f=>f.frame));
const frames=m.frames.filter(f=>f.contactPageNumber>=21&&f.contactPageNumber<=43).map(f=>{
 assert(!half.has(f.frame));assert.equal(sha(f.file),f.sha256);
 const p=pages.find(p=>p.page===f.contactPageNumber);assert(p);assert.equal(p.frames[f.contactCellIndex],f.frame);
 assert.equal(f.contactPageSha256,p.sha256);
 return{...f,actuallyViewed:true,actualViewer:viewer,individuallyOpenedAt1080x1920:false,
  viewingMethod:'Personally displayed as an exact SHA-bound decoded JPEG cell on the named original-resolution contact sheet',
  finding:f.time>=308.316&&f.time<=317.21?'Known pen:fact calm-pendulum static defect; NEW meaningful-motion repair pending, not accepted here':'No new confirmed visual blocker found in this sampled cell; not original-size text/audio/all30fps certification'};
});
assert.equal(pages.length,23);assert.equal(frames.length,226);assert.equal(frames[0].frame,5387);assert.equal(frames.at(-1).frame,11604);
const report={id:'ys-chain-e1v1',receiptType:'Attributed scoped personal visual review of the actual nonhalf decoded complement',
 createdAt:new Date().toISOString(),actualViewer:viewer,manifest:input,manifestSha256:sha(input),
 sourceManifest:m.sourceManifest,sourceManifestSha256:m.sourceManifestSha256,video:m.video,videoSha256:m.videoSha256,
 scope:{nonhalfContactPages:[21,43],pageCount:23,decodedCellsPersonallyViewed:226,exactFrameIndices:frames.map(f=>f.frame),
  all226DecodedJpegSHAIndependentlyVerified:true,all23PageSHAIndependentlyVerified:true,disjointFromHalfGrid:true,
  otherNonhalfPagesLoaded:false,entireFilmContinuousPlayback:false,all30fpsFramesViewed:false,audioActuallyHeard:false,
  these226ImagesIndividuallyOpenedAtOriginalSize:false},
 findings:{newConfirmedBlockingDefects:[],knownOutstanding:[
  {code:'E-calm-shipboard-pendulum-static',seconds:[308.316,317.21],newRepairPending:true,resolvedInThisReceipt:false},
  {code:'E-early-hand-11-19-pending',seconds:[11,19],outsideThisReceiptScope:true,resolvedInThisReceipt:false}],
  observedGood:['Ship/noon-sun/13:00 clock and west-longitude miniature remain visible across row21–23.',
   'Clock close-up exposes the dial and4minutes/1degree relation. Globe latitude spacing and70km approximation are visible.',
   'Log rope, sandglass, knot counter and compass remain visible; current arrows and differing tracks support accumulated position error.',
   'Fog visibly obscures the star, and frozen caption says one of the major reasons rather than asserting a single proven cause.',
   'Land pendulum moves in the off-grid samples. Known shipboard calm-static interval is not mistaken for successful motion.',
   'Judge full-screen face is intentional. Prize bag/hand/coins,0.5degree condition and20000pound figure remain visible.',
   'Unknown accurate clock and question mark remain a future challenge, without giving away the East/West answer.',
   'Final map retains three remaining ships, the fog, two positions and clock; hand places the clock and remains visible through actual EOF sample11604.'],
  limits:['360pixel-wide contact cells cannot certify every original-size glyph, critical subpixel detail or continuous perceived motion.',
   'No audio was played or heard. Exact voice timing and original automatic gate decisions are separate evidence.',
   'Original JPEGs, manifests, Japanese, voice, subtitles, original NG results and earlier receipts were not modified.',
   'No new semantic/physical error was confirmed in this scope, but known motion repairs prevent final acceptance.']},
 pages,frames,reusePolicy:'Future MP4 review may reuse a cell only on exact decoded JPEG SHA equality, never merely unchanged raw source.',
 writerSha256:sha(fileURLToPath(import.meta.url)),allActuallyViewed:false,earListeningPerformed:false,finalPassed:false,finalAcceptance:false};
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:out,sha256:sha(out),pages:23,cells:226,newBlockingDefects:0,finalAcceptance:false},null,2));
