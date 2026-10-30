// Root-authorized CPU-only wrapper: frozen identity utility plus pending JPEGs.
// No decoder/render/encode, source edit, automated eyes or final approval.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';
import{createHash}from'node:crypto';import{spawnSync}from'node:child_process';import{fileURLToPath}from'node:url';import sharp from'sharp';
assert(process.argv.includes('--authorized'));
const W=fileURLToPath(new URL('../../',import.meta.url)),self=fileURLToPath(import.meta.url);
const utility=path.join(W,'scripts/umech/compare-b1-new-decoded-review-20261025.mjs');
const aggregate=path.join(W,'outputs/axes-20261023/b1-final4-all1162-attributed-visual-review-aggregate-20261025.json');
const incoming='/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025/actual-mp4-review/manifest.json';
const out='/private/tmp/ys/ys-chain-b1v1-final5-pending-eye-contacts-20261025';
const comparisonFile=path.join(W,'outputs/axes-20261023/b1-final5-decoded-identity-comparison-20261025.json');
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
assert(!exists(out)&&!exists(comparisonFile),'Keep all prior evidence');
const pins={
 [self]:sha(self),[utility]:'5b2a020289891ed650537e0d9b4387acfc4c6db6ab3df6616cc2f72e7c84fab9',
 [aggregate]:'80ed17b46bcadab163436ffc6567707c9f7a571e4a5063001a2f602f43dc7934',
 [incoming]:'2f8bb0a84771ae36c141f1c69a8c4d19129f0a40c911331d8a4071a2ca874f8c'};
const pin=(p,h)=>{if(Object.hasOwn(pins,p))assert.equal(pins[p],h);assert.equal(sha(p),h,p);pins[p]=h;};
const verify=()=>{for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);};verify();
const a=read(aggregate),m=read(incoming);pin(m.video,m.videoSha256);
for(const r of a.receipts)pin(r.file,r.sha256);
const child=spawnSync(process.execPath,[utility,aggregate,incoming],{encoding:'utf8',maxBuffer:32e6});assert.equal(child.status,0,child.stderr);
const comparison=JSON.parse(child.stdout);assert.equal(comparison.aggregate.sha256,pins[aggregate]);assert.equal(comparison.incomingManifest.sha256,pins[incoming]);
const old=new Map(a.frameRecords.map(r=>[r.frame,r])),receipts=new Map(a.receipts.map(r=>[r.id,r]));
for(const row of comparison.exactMatches){
 const prior=old.get(row.frame);assert(prior&&prior.sha256===row.sha256);pin(prior.jpegFile,prior.sha256);
 for(const witness of row.oldWitnesses){
  const receipt=receipts.get(witness.receiptID);assert(receipt&&receipt.actualViewer===witness.actualViewer);
  const page=a.pages.find(p=>p.kind===witness.contactKind&&p.page===witness.page);assert(page&&page.frames.includes(row.frame)&&page.actualViewer===witness.actualViewer);pin(page.file,page.sha256);
 }
 assert(row.oldWitnesses.length>0,'Exact bytes require an attributed scoped old witness');
}
for(const row of [...comparison.exactMatches,...comparison.unapproved])pin(row.file,row.sha256);
comparison.currentIndependentAttributionValidation={allExactSameFrameOldJpegHashesReverified:true,allReferencedReceiptAndPageHashesReverified:true,
 sourceSameFrameScopedWitnessAttributionPreserved:true,notNewPersonalViewing:true,allKnownRepairCandidatesStillRequireNewEyes:true};
comparison.wrapper={file:self,sha256:sha(self),protectedInputSha256:{...pins},noDecodeEncodeOrGpu:true};
fs.writeFileSync(comparisonFile,JSON.stringify(comparison,null,1)+'\n',{flag:'wx'});
fs.mkdirSync(out);const pending=comparison.unapproved,pages=[];
for(let start=0;start<pending.length;start+=10){
 const rows=pending.slice(start,start+10),layers=[];
 for(let i=0;i<rows.length;i++){
  const row=rows[i],md=await sharp(row.file).metadata();assert.equal(md.width,1080);assert.equal(md.height,1920);
  const footer=Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="#ffe9d4"/><text x="6" y="12" font-family="Helvetica" font-size="11">B5 frame ${row.frame} / ${(row.frame/30).toFixed(3)}s</text><text x="6" y="25" font-family="Helvetica" font-size="11">PENDING NEW ACTUAL EYES</text></svg>`);
  const left=(i%5)*360,top=Math.floor(i/5)*668;
  layers.push({input:await sharp(row.file).resize(360,640).toBuffer(),left,top},{input:footer,left,top:top+640});
 }
 const file=path.join(out,'pending-'+String(pages.length+1).padStart(2,'0')+'.jpg');
 await sharp({create:{width:1800,height:1336,channels:3,background:'#fff'}}).composite(layers).jpeg({quality:92}).toFile(file);
 pages.push({page:pages.length+1,file,sha256:sha(file),cells:rows.length,frames:rows.map(r=>r.frame),jpegSha256:rows.map(r=>r.sha256),actuallyViewed:false});
}
verify();const half=Math.ceil(pages.length/2);
const result={id:'B-1-final5-pending-exact-decoded-JPEG-contacts',video:{file:m.video,sha256:m.videoSha256},
 comparison:{file:comparisonFile,sha256:sha(comparisonFile)},oldAggregate:{file:aggregate,sha256:pins[aggregate]},incomingManifest:{file:incoming,sha256:pins[incoming]},
 utility:{file:utility,sha256:pins[utility]},wrapper:{file:self,sha256:sha(self)},protectedInputSha256:pins,
 counts:comparison.counts,pendingFrames:pending,pages,
 allocation:{firstHalf:{viewer:'/root/b1_final_cpu_preflight',pages:pages.slice(0,half).map(p=>p.page),cells:pages.slice(0,half).reduce((s,p)=>s+p.cells,0)},secondHalf:{viewer:'/root',pages:pages.slice(half).map(p=>p.page),cells:pages.slice(half).reduce((s,p)=>s+p.cells,0)}},
 actualNewImagesPersonallyViewed:false,earsVerified:false,continuousPlaybackViewed:false,noDecodeEncodeOrGpu:true,automaticApproval:false,finalAcceptance:false};
const dest=path.join(out,'manifest.json');fs.writeFileSync(dest,JSON.stringify(result,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({comparison:comparisonFile,comparisonSha256:sha(comparisonFile),manifest:dest,manifestSha256:sha(dest),counts:comparison.counts,pages:pages.length,allocation:result.allocation}));
