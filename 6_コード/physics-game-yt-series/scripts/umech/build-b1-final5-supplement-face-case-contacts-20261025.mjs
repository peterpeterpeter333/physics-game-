// Root-authorized CPU contact construction from already decoded final JPEGs.
// This creates pending visual cases, not approvals, threshold changes or new eyes.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

assert(process.argv.includes('--authorized'));
const self=fileURLToPath(import.meta.url),W=fileURLToPath(new URL('../../',import.meta.url));
const evidence=path.join(W,'outputs/axes-20261023/b1-final5-exact714-original7b-delivered-evidence-with-eyes-20261025.json');
const actual='/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025/actual-mp4-review/manifest.json';
const out='/private/tmp/ys/ys-chain-b1v1-final5-supplement-face-case-contacts-20261025';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
assert(!fs.existsSync(out),'Fresh output only; prior results remain unchanged');
const protectedInputSha256={
 [self]:sha(self),
 [evidence]:'b84c311b30ee7553e952c7e6a8def7ce5a695c29c528b25e91afda7fccb0a5a9',
 [actual]:'2f8bb0a84771ae36c141f1c69a8c4d19129f0a40c911331d8a4071a2ca874f8c',
};
const verify=()=>{for(const[p,h]of Object.entries(protectedInputSha256))assert.equal(sha(p),h,p);};
verify();
const e=read(evidence),m=read(actual);
assert.equal(e.samples.length,714);
assert.equal(e.mp4,m.video);assert.equal(e.mp4Sha256,m.videoSha256);
assert.equal(m.videoSha256,'6780889510a3d881ec446a58627325edf00cd0b43206c7f8b61c166c270ca1d2');
protectedInputSha256[m.video]=m.videoSha256;
const rawHalf=m.halfSeconds.frames;
assert(Array.isArray(rawHalf)&&rawHalf.length===714);
const incomingByFrame=new Map(rawHalf.map(r=>[r.frame,r]));
const selected=e.samples.filter(r=>r.supplementEvidenceEligible===true||r.compositeFaceHint.kind.startsWith('full_screen_face')||r.physical.within40to70===false||r.physical.clipped===true);
assert.equal(new Set(selected.map(r=>r.actualMp4Frame)).size,selected.length);
assert.equal(selected.length,304);
const counts={selectedUnique:304,eligible:selected.filter(r=>r.supplementEvidenceEligible).length,
 fullScreenFace:selected.filter(r=>r.compositeFaceHint.kind.startsWith('full_screen_face')).length,
 outside40to70:selected.filter(r=>!r.physical.within40to70).length,
 clipped:selected.filter(r=>r.physical.clipped).length};
assert.deepEqual(counts,{selectedUnique:304,eligible:253,fullScreenFace:51,outside40to70:2,clipped:0});
const rows=[];
for(const r of selected){
 const actualRow=incomingByFrame.get(r.actualMp4Frame);
 assert(actualRow,'Exact frame must belong to original 714 half-second sample set');
 assert.equal(actualRow.file,r.actualJpeg);assert.equal(actualRow.sha256,r.actualJpegSha256);
 assert.equal(sha(r.actualJpeg),r.actualJpegSha256,r.actualJpeg);
 protectedInputSha256[r.actualJpeg]=r.actualJpegSha256;
 const md=await sharp(r.actualJpeg).metadata();assert.equal(md.width,1080);assert.equal(md.height,1920);
 rows.push({frame:r.actualMp4Frame,time:r.time,sampleIndex:r.sampleIndex,cue:r.cue,row:r.row,
  jpeg:r.actualJpeg,jpegSha256:r.actualJpegSha256,physicalPrincipalIdentity:r.physical.principalIdentity,
  physicalWidthRatio:r.physical.widthRatio,physicalBox:r.physical.box,
  within40to70:r.physical.within40to70,under35:r.physical.under35,clipped:r.physical.clipped,
  supplementEvidenceEligible:r.supplementEvidenceEligible,compositeFaceHint:r.compositeFaceHint,
  originalFeatures:r.originalFeatures,originalHeuristicFlags:r.originalHeuristicFlags,
  originalDisposition:r.reviewDisposition,underlyingPhysicalWidthIsNotFaceSizeEvidence:r.compositeFaceHint.kind.startsWith('full_screen_face'),
  originalNumericStatusNeverReplaced:true,caseDecisionPending:true,approvedSupplement:false,
  actualViewer:null,newCaseImagesPersonallyViewed:false});
}
fs.mkdirSync(out);
const pages=[],esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(let start=0;start<rows.length;start+=10){
 const cells=rows.slice(start,start+10),layers=[];
 for(let i=0;i<cells.length;i++){
  const r=cells[i],labels=[r.supplementEvidenceEligible?'ELIGIBLE':null,r.compositeFaceHint.kind.startsWith('full_screen_face')?'FACE':null,!r.within40to70?'OUTSIDE40-70':null,r.clipped?'CLIPPED':null].filter(Boolean).join(' | ');
  const group=r.physicalPrincipalIdentity.group;
  const footer=Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="#fff0d7"/><text x="5" y="12" font-family="Helvetica" font-size="11">j${r.frame} ${r.time.toFixed(3)}s ${esc(group)} width=${(r.physicalWidthRatio*100).toFixed(3)}%</text><text x="5" y="25" font-family="Helvetica" font-size="11">${esc(labels)} — ROOT CASE DECISION PENDING</text></svg>`);
  const left=(i%5)*360,top=Math.floor(i/5)*668;
  layers.push({input:await sharp(r.jpeg).resize(360,640).toBuffer(),left,top},{input:footer,left,top:top+640});
 }
 const file=path.join(out,'cases-'+String(pages.length+1).padStart(2,'0')+'.jpg');
 await sharp({create:{width:1800,height:1336,channels:3,background:'#fff'}}).composite(layers).jpeg({quality:92}).toFile(file);
 pages.push({page:pages.length+1,file,sha256:sha(file),width:1800,height:1336,cells:cells.length,
  frames:cells.map(r=>r.frame),jpegSha256:cells.map(r=>r.jpegSha256),caseDecisionsPending:true,newPersonallyViewed:false});
}
verify();assert.equal(pages.length,31);
const result={id:'B-1-final5-pending-supplement-face-and-width-case-contacts',
 video:{file:m.video,sha256:m.videoSha256},inputs:{evidence:{file:evidence,sha256:protectedInputSha256[evidence]},actualManifest:{file:actual,sha256:protectedInputSha256[actual]}},
 selectionRule:'Union: supplementEvidenceEligible OR full_screen_face scheduled OR physical.within40to70=false OR physical.clipped=true; exact frame dedup; no numeric or classification changes',
 counts,pages,rows,protectedInputSha256,
 builtFromExistingDecodedJpegsOnly:true,noDecodeEncodeOrGpu:true,
 original7and7bNGUnchanged:true,thresholdsUnchanged:true,automaticApproval:false,
 rootMustPersonallyReviewAndIssueExactNamedCaseDecisions:true,
 noClaimThatRootPersonallyViewedAll1803:true,newCaseViewingPerformed:false,earsVerified:false,continuousPlaybackVerified:false,finalAcceptance:false};
const manifest=path.join(out,'manifest.json');fs.writeFileSync(manifest,JSON.stringify(result,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({manifest,sha256:sha(manifest),counts,pages:pages.length,firstPage:pages[0].file,lastPage:pages.at(-1).file,caseApprovals:0}));
