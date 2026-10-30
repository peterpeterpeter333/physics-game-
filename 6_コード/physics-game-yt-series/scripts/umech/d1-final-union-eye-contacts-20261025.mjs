// NEW CPU-only contact/evidence union. No decoder, renderer, encoder or approval.
// Existing main pending/reuse decisions are preserved. Additional-only images
// inherit old eyes only for the same exact frame and identical decoded JPEG.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';
const SELF=fileURLToPath(import.meta.url);
const OLD='/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025';
const OLD_MANIFEST=OLD+'/actual-final-required-review-v4-endframe-20261025/d1v1-review-manifest.json';
const OLD_MANIFEST_SHA='a1792c20470c3840389727f5e84d917f87617757a30f1ff3a1a9c0378f32bd29';
const OLD_EYES=W+'/deep/D-1_actual-final_855team-aggregate_20261025.json';
const OLD_EYES_SHA='43455061d989ae2650724f34e01658324449784b07c3907ec6f66466c14ce4cf';
const ADD_HELPER=W+'/scripts/umech/d1-final-original546-additional-actual-20261025.mjs';
const ADD_HELPER_SHA='c60b9dd34d37c42027764af2cb978fe066de6d007a6125bdb5061029accc785d';
const ORIGINAL546=OLD+'/d1-supplement-requests.json';
const ORIGINAL546_SHA='16088d186cd25ee6d7fa3fc29ad2a2aa45ffab7ddef8ae3748da5a3138e9bee8';
const FINAL='/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
const validSha=h=>typeof h==='string'&&/^[a-f0-9]{64}$/.test(h);
const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
const safeFile=(dir,name)=>{assert.equal(path.basename(name),name);return path.join(dir,'frames-d1v1',name);};
const exactRows=rows=>{
 const m=new Map();for(const r of rows){assert(Number.isInteger(r.frameIndex)&&r.frameIndex>=0);assert(!m.has(r.frameIndex),'Duplicate actual frame');assert(validSha(r.fileSha256));assert(Math.abs(r.time-r.frameIndex/30)<1e-7);m.set(r.frameIndex,r);}return m;
};

// Pure selection function; validation of old page/receipt files is performed
// independently before callers supply old attribution. No new eye claim here.
export function unionRows(main,additional,mainReuse,mainPending,oldRows,oldAttribution){
 const mains=exactRows(main),extras=exactRows(additional),reuse=new Map(mainReuse.map(r=>[r.frameIndex,r])),pending=new Map(mainPending.map(r=>[r.frameIndex,r]));
 assert.equal(reuse.size,mainReuse.length);assert.equal(pending.size,mainPending.length);
 assert.equal(reuse.size+pending.size,mains.size);
 for(const j of reuse.keys())assert(mains.has(j)&&!pending.has(j));
 for(const j of pending.keys())assert(mains.has(j)&&!reuse.has(j));
 const indices=[...new Set([...mains.keys(),...extras.keys()])].sort((a,b)=>a-b),rows=[];
 for(const j of indices){
  const a=mains.get(j),b=extras.get(j);if(a&&b)assert.equal(a.fileSha256,b.fileSha256,'Same final frame has inconsistent JPEG bytes: '+j);
  const selected=a??b;let attribution=null,needEyes=true,reason;
  if(a){
   if(reuse.has(j)){attribution=reuse.get(j);needEyes=false;reason='Main exact-JPEG attributed reuse preserved without reassigning reviewer';}
   else reason='Main newActualEyeFramesRequired decision preserved, never promoted by this helper';
  }else{
   const old=oldRows.get(j),oldEye=oldAttribution.get(j);
   if(old&&oldEye&&old.fileSha256===selected.fileSha256){attribution=oldEye;needEyes=false;reason='Additional-only same old encoded frame and byte-identical decoded JPEG; attributed prior eyes only';}
   else reason=old?'Additional-only final JPEG differs from the same old frame; new actual eyes required':'Additional-only frame absent from attributed old855; new actual eyes required';
  }
  rows.push({...selected,origins:[...(a?['main-final-review']:[]),...(b?['additional-original546']:[])],
   reasons:[...new Set([...(a?.reasons??[]),...(b?.originalReasons??[])])],
   mainDecisionPreserved:!!a,attributedReviewReuse:attribution,newActualEyesRequired:needEyes,
   eyeDecisionReason:reason,actualEyeReviewPerformedThisInvocation:false,finalAcceptance:false});
 }
 assert.deepEqual(rows.filter(r=>r.mainDecisionPreserved&&r.newActualEyesRequired).map(r=>r.frameIndex),[...pending.keys()].sort((a,b)=>a-b));
 return rows;
}

function selftest(){
 const h=n=>String(n).repeat(64),r=(j,n)=>({frameIndex:j,time:j/30,file:'f'+j+'.jpg',fileSha256:h(n),actualFile:'synthetic'+j});
 const old=new Map([[10,r(10,1)],[20,r(20,2)],[30,r(30,3)],[40,r(40,9)]]),attributed=new Map([10,20,30,40].map(j=>[j,{frameIndex:j,reviewer:'synthetic-old-viewer'}]));
 const joined=unionRows([r(10,1),r(20,2)],[r(20,2),r(30,3),r(40,4)],[{frameIndex:10,reviewer:'synthetic-main-viewer'}],[{frameIndex:20}],old,attributed);
 assert.deepEqual(joined.map(r=>r.frameIndex),[10,20,30,40]);assert.deepEqual(joined.filter(r=>r.newActualEyesRequired).map(r=>r.frameIndex),[20,40]);assert.equal(joined[0].attributedReviewReuse.reviewer,'synthetic-main-viewer');assert.equal(joined[2].attributedReviewReuse.reviewer,'synthetic-old-viewer');
 assert.throws(()=>unionRows([r(10,1)],[r(10,2)],[{frameIndex:10}],[],old,attributed));
 assert.throws(()=>unionRows([r(10,1),r(10,1)],[],[{frameIndex:10}],[],old,attributed));
 assert.throws(()=>unionRows([r(10,1)],[],[],[],old,attributed));
 console.log(JSON.stringify({syntheticOnly:true,unionAndAttributionTests:6,pass:true,actualInputsRead:false,imagesGenerated:false}));
}

async function build(){
 assert(process.argv.includes('--authorized'),'Explicit root CPU authorization required');
 const option=n=>process.argv.find(x=>x.startsWith(n+'='))?.slice(n.length+1);
 const coveragePath=path.resolve(option('--coverage')??''),additionalPath=path.resolve(option('--additional')??''),out=path.resolve(option('--out')??'');
 const coverageSha=option('--coverage-sha256'),additionalSha=option('--additional-sha256');
 assert(validSha(coverageSha)&&validSha(additionalSha));
 assert.equal(coveragePath,FINAL+'/actual-final-review/required-coverage-and-reuse.json');
 assert(out.startsWith('/private/tmp/ys/ys-chain-d1v1-')&&!exists(out),'Fresh private contact folder only');
 const pins=new Map(),snapshots=new Map();
 const pin=(p,h=sha(p))=>{
  p=path.resolve(p);assert(validSha(h));if(pins.has(p))assert.equal(pins.get(p),h,'Conflicting SHA pin');
  assert.equal(sha(p),h,p);pins.set(p,h);const s=fs.statSync(p);assert(s.isFile());
  snapshots.set(p,{bytes:s.size,mtimeMs:s.mtimeMs,ino:s.ino,dev:s.dev});return h;
 };
 const verify=()=>{for(const[p,h]of pins){assert.equal(sha(p),h,p);const s=fs.statSync(p);assert.deepEqual({bytes:s.size,mtimeMs:s.mtimeMs,ino:s.ino,dev:s.dev},snapshots.get(p),p);}};
 pin(SELF);pin(ADD_HELPER,ADD_HELPER_SHA);pin(OLD_MANIFEST,OLD_MANIFEST_SHA);pin(OLD_EYES,OLD_EYES_SHA);pin(ORIGINAL546,ORIGINAL546_SHA);
 pin(coveragePath,coverageSha);pin(additionalPath,additionalSha);
 const coverage=read(coveragePath),additional=read(additionalPath),oldManifest=read(OLD_MANIFEST),eyes=read(OLD_EYES),original546=read(ORIGINAL546);
 assert.equal(coverage.episode,'D-1');assert.equal(additional.episode,'D-1');
 assert.equal(coverage.sourceFrames,12163);assert.equal(coverage.actualEncodedFrames,12162);
 assert.equal(additional.sourceFrames,coverage.sourceFrames);assert.equal(additional.actualEncodedFrames,coverage.actualEncodedFrames);
 assert.equal(coverage.mp4,FINAL+'/out/ys-chain-d1v1.mp4');pin(coverage.mp4,coverage.mp4Sha256);
 assert.equal(additional.mp4,coverage.mp4);assert.equal(additional.mp4Sha256,coverage.mp4Sha256);
 assert.equal(additional.parentCoverage,coveragePath);assert.equal(additional.parentCoverageSha256,coverageSha);
 assert.equal(additional.originalCandidates,ORIGINAL546);assert.equal(additional.originalCandidatesSha256,ORIGINAL546_SHA);
 assert.equal(additional.exactOriginal546,546);assert.equal(additional.allActualImagesFromSameFinalMp4,true);
 assert.deepEqual(additional.endpointRemapping,[]);assert.equal(additional.frames.length,546);assert.equal(original546.requests.length,546);
 assert.equal(additional.finalAcceptance,false);assert.equal(additional.allImagesPersonallyViewed,false);
 const manifestPath=coverage.manifest;assert.equal(manifestPath,FINAL+'/actual-final-review/d1v1-review-manifest.json');pin(manifestPath,coverage.manifestSha256);
 const manifest=read(manifestPath);assert.equal(manifest.episode,'D-1');assert.equal(manifest.mp4Sha256,coverage.mp4Sha256);
 assert.equal(coverage.selectedFrames,manifest.frames.length);assert.equal(coverage.allRequestedActualFramesPresent,true);assert.equal(coverage.originalCandidatesAllExact,true);
 assert.equal(coverage.allNewRequiredFramesActuallyViewed,false);assert.equal(coverage.finalAcceptance,false);
 pin(coverage.selection,coverage.selectionSha256);
 assert.equal(oldManifest.frames.length,855);assert.equal(eyes.mp4Sha256,oldManifest.mp4Sha256);assert.equal(eyes.manifestSha256,OLD_MANIFEST_SHA);
 assert.equal(eyes.coverage.allSelectedCellsCoveredByExactlyOneAttributedReceipt,true);assert.equal(eyes.aggregateAuthorPersonalScope.all855PersonallyViewed,false);
 const oldRows=exactRows(oldManifest.frames),oldAttribution=new Map();
 assert.equal(eyes.pageCoverage.length,86);
 for(const page of eyes.pageCoverage){
  assert(Number.isInteger(page.page)&&page.page>0&&page.page<=86&&typeof page.reviewer==='string'&&page.reviewer.length>0);
  assert.equal(oldManifest.pages[page.page-1],page.file);assert.equal(oldManifest.pageSha256[page.file],page.sha256);
  assert.deepEqual(page.frameIndices,oldManifest.frames.slice((page.page-1)*10,page.page*10).map(r=>r.frameIndex));
  const pagePath=path.join(path.dirname(OLD_MANIFEST),page.file);pin(pagePath,page.sha256);pin(page.receipt,page.receiptSha256);
  for(const j of page.frameIndices){
   assert(!oldAttribution.has(j));const oldRow=oldRows.get(j);assert(oldRow);
   const oldFile=safeFile(path.dirname(OLD_MANIFEST),oldRow.file);pin(oldFile,oldRow.fileSha256);
   oldAttribution.set(j,{frameIndex:j,oldFile,oldJpegSha256:oldRow.fileSha256,oldMp4Sha256:oldManifest.mp4Sha256,
    oldManifest:OLD_MANIFEST,oldManifestSha256:OLD_MANIFEST_SHA,oldAggregate:OLD_EYES,oldAggregateSha256:OLD_EYES_SHA,
    scopedOldPage:page.page,oldPage:pagePath,oldPageSha256:page.sha256,reviewer:page.reviewer,
    receipt:page.receipt,receiptSha256:page.receiptSha256,
    reason:'Same exact old encoded-frame index and byte-identical decoded JPEG; attribution only, no new personal-view claim'});
  }
 }
 assert.equal(oldAttribution.size,855);
 const mainRows=manifest.frames.map(r=>{const actualFile=safeFile(path.dirname(manifestPath),r.file);pin(actualFile,r.fileSha256);return{...r,actualFile};});
 const mainMap=exactRows(mainRows),additionalRows=additional.frames.map((r,i)=>{
  assert.equal(r.frameIndex,original546.requests[i].frameIndex);assert(Math.abs(r.time-original546.requests[i].time)<1e-7);
  assert.deepEqual(r.originalReasons,original546.requests[i].reasons);assert.equal(r.sourceIsFinalMp4,true);assert.equal(r.rawSourceSubstitution,false);
  assert.equal(r.actualEyeReviewPerformed,false);assert(r.frameIndex<12162);
  const actualFile=safeFile(path.dirname(additionalPath),r.file);pin(actualFile,r.fileSha256);
  assert.equal(r.reusedSameFinalDecodedJpeg,mainMap.has(r.frameIndex));return{...r,actualFile};
 });
 for(const r of coverage.attributedByteIdenticalOldReviewFrames){
  const actual=mainMap.get(r.frameIndex),old=oldRows.get(r.frameIndex),attribution=oldAttribution.get(r.frameIndex);assert(actual&&old&&attribution);
  assert.equal(r.file,actual.actualFile);assert.equal(r.jpegSha256,actual.fileSha256);assert.equal(r.jpegSha256,old.fileSha256);
  for(const k of ['oldFile','oldMp4Sha256','oldManifestSha256','scopedOldPage','reviewer','receipt','receiptSha256'])assert.deepEqual(r[k],attribution[k]);
 }
 for(const r of coverage.newActualEyeFramesRequired){const actual=mainMap.get(r.frameIndex);assert(actual);assert.equal(r.file,actual.actualFile);assert.equal(r.jpegSha256,actual.fileSha256);}
 const rows=unionRows(mainRows,additionalRows,coverage.attributedByteIdenticalOldReviewFrames,coverage.newActualEyeFramesRequired,oldRows,oldAttribution);
 assert(rows.every(r=>r.frameIndex<12162));verify();
 fs.mkdirSync(out,{recursive:false});fs.mkdirSync(path.join(out,'contacts'));
 const pages=[];
 for(let start=0;start<rows.length;start+=10){
  const cells=rows.slice(start,start+10),layers=[];
  for(let i=0;i<cells.length;i++){
   const r=cells[i],metadata=await sharp(r.actualFile).metadata();assert.equal(metadata.width,1080);assert.equal(metadata.height,1920);
   const status=r.newActualEyesRequired?'PENDING NEW EYES':'ATTRIBUTED OLD EYES ONLY';
   const footer=Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="${r.newActualEyesRequired?'#ffead1':'#e2f0e7'}"/><text x="6" y="12" font-family="Helvetica" font-size="11" fill="#152332">D-1 frame ${r.frameIndex} / ${(r.frameIndex/30).toFixed(3)}s</text><text x="6" y="25" font-family="Helvetica" font-size="11" fill="#152332">${status}</text></svg>`);
   const left=(i%5)*360,top=Math.floor(i/5)*668;
   layers.push({input:await sharp(r.actualFile).resize(360,640,{fit:'fill'}).toBuffer(),left,top},{input:footer,left,top:top+640});
  }
  const file='d1-final-union-'+String(pages.length+1).padStart(3,'0')+'.jpg',dest=path.join(out,'contacts',file);
  await sharp({create:{width:1800,height:1336,channels:3,background:'#ffffff'}}).composite(layers).jpeg({quality:92}).toFile(dest);
  const md=await sharp(dest).metadata();assert.equal(md.width,1800);assert.equal(md.height,1336);
  pages.push({page:pages.length+1,file:dest,sha256:sha(dest),width:1800,height:1336,cells:cells.length,
   frameIndices:cells.map(r=>r.frameIndex),decodedJpegSha256:cells.map(r=>r.fileSha256),
   pendingNewEyeFrames:cells.filter(r=>r.newActualEyesRequired).map(r=>r.frameIndex),
   attributedOldEyeFrames:cells.filter(r=>!r.newActualEyesRequired).map(r=>r.frameIndex),actuallyViewed:false});
 }
 verify();
 const record={episode:'D-1',scope:'Exact main-final plus original546 frame union; pending preserved, no automatic visual approval',
  mp4:coverage.mp4,mp4Sha256:coverage.mp4Sha256,sourceFrames:12163,actualEncodedFrames:12162,
  helper:SELF,helperSha256:sha(SELF),mainCoverage:coveragePath,mainCoverageSha256:coverageSha,
  mainManifest:manifestPath,mainManifestSha256:coverage.manifestSha256,additionalManifest:additionalPath,additionalManifestSha256:additionalSha,
  old855Manifest:OLD_MANIFEST,old855ManifestSha256:OLD_MANIFEST_SHA,old855Aggregate:OLD_EYES,old855AggregateSha256:OLD_EYES_SHA,
  protectedInputSha256:Object.fromEntries(pins),inputSnapshots:Object.fromEntries(snapshots),
  mainFrameCount:mainRows.length,original546FrameCount:546,unionFrameCount:rows.length,
  sameFrameOverlapCount:mainRows.length+546-rows.length,overlapJpegShaExactlyEqual:true,
  preservedMainAttributedReuseRows:coverage.attributedByteIdenticalOldReviewFrames,
  preservedMainPendingRows:coverage.newActualEyeFramesRequired,
  attributedByteIdenticalOldReviewFrames:rows.filter(r=>!r.newActualEyesRequired).map(r=>({frameIndex:r.frameIndex,jpegSha256:r.fileSha256,...r.attributedReviewReuse})),
  newActualEyeFramesRequired:rows.filter(r=>r.newActualEyesRequired).map(r=>({frameIndex:r.frameIndex,time:r.time,file:r.actualFile,jpegSha256:r.fileSha256,reason:r.eyeDecisionReason})),
  frames:rows,pages,allUnionImagesFromSameFinalMp4:true,allInputHashesAndStatsVerifiedBeforeAndAfter:true,
  attributedReuseIsNotNewPersonalViewing:true,noPreviouslyPendingFramePromoted:true,
  imageDecodeOnlyForContactResizing:true,mp4DecodePerformed:false,renderOrEncodePerformed:false,
  allNewRequiredFramesActuallyViewed:false,allContactPagesActuallyViewed:false,earsVerified:false,
  originalSourcesAndManifestsUnchanged:true,originalNGPreserved:true,automaticApproval:false,finalAcceptance:false};
 const dest=path.join(out,'d1-final-union-eye-contact-manifest.json');fs.writeFileSync(dest,JSON.stringify(record,null,1)+'\n',{flag:'wx'});
 console.log(JSON.stringify({manifest:dest,sha256:sha(dest),union:rows.length,pages:pages.length,
  attributedReuse:record.attributedByteIdenticalOldReviewFrames.length,pending:record.newActualEyeFramesRequired.length,actualEyesPerformed:false}));
}

if(process.argv[1]&&path.resolve(process.argv[1])===SELF){
 if(process.argv.includes('--selftest'))selftest();
 else{assert(process.argv.includes('--build'),'Choose --selftest or explicitly --build --authorized');await build();}
}
