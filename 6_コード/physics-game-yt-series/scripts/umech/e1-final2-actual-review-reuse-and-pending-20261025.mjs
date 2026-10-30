// New final decoded JPEGs inherit only exact same-frame JPEG evidence, never raw-source similarity.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';import sharp from'sharp';
const [manifest,out]=process.argv.slice(2);assert(manifest&&out&&!fs.existsSync(out));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const old=path.resolve('outputs/axes-20261023/e1-oldfinal-all1200-attributed-visual-review-aggregate-20261025.json');assert.equal(sha(old),'4241dc4e6dd4dd14889f8d822daa07737ae57448bb00a238d984b90236090e91');
const a=read(old),m=read(manifest),prior=new Map(a.frames.map(r=>[r.frame,r])),required=new Map();
for(const v of Object.values(m))if(v&&Array.isArray(v.frames))for(const r of v.frames){assert.equal(sha(r.file),r.sha256);if(required.has(r.frame))assert.deepEqual(required.get(r.frame),r);else required.set(r.frame,r);}
assert(required.size>=1200&&m.videoSha256!==a.videoSha256);assert.equal(sha(m.video),m.videoSha256);
const reused=[],pending=[];for(const r of [...required.values()].sort((a,b)=>a.frame-b.frame)){
 const p=prior.get(r.frame);if(p&&p.sha256===r.sha256){assert.equal(sha(p.file),p.sha256);assert.equal(sha(p.receipt),p.receiptSha256);reused.push({...r,attributedPreviousEyes:p,reason:'Exact same actual decoded JPEG SHA at same frame; no new personal-eye claim'});}
 else pending.push({...r,oldSha256:p?.sha256??null,actuallyViewed:false,reason:p?'Actual decoded JPEG changed':'Additional required actual action frame'});}
assert.equal(reused.length+pending.length,required.size);fs.mkdirSync(out,{recursive:false});
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const pages=[];for(let i=0;i<pending.length;i+=10){const cells=pending.slice(i,i+10),layers=[];
 for(let k=0;k<cells.length;k++){const r=cells[k],left=(k%5)*360,top=Math.floor(k/5)*668;layers.push({input:await sharp(r.file).resize(360,640).jpeg({quality:95}).toBuffer(),left,top});
  const label=`f${r.frame}  ${r.time.toFixed(3)}s  ${r.cue??''}`;layers.push({input:Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="#17212b"/><text x="5" y="21" fill="white" font-size="16">${escape(label)}</text></svg>`),left,top:top+640});}
 const file=path.join(out,'pending-'+String(pages.length+1).padStart(2,'0')+'.jpg');await sharp({create:{width:1800,height:1336,channels:3,background:'#17212b'}}).composite(layers).jpeg({quality:95}).toFile(file);
 pages.push({page:pages.length+1,file,sha256:sha(file),frames:cells.map(r=>r.frame),actuallyViewed:false});for(let k=0;k<cells.length;k++)Object.assign(cells[k],{contactPage:file,contactPageSha256:sha(file),contactCellIndex:k});}
const result={episode:'E-1',manifest,manifestSha256:sha(manifest),video:m.video,videoSha256:m.videoSha256,oldAttributedAggregate:old,oldAttributedAggregateSha256:sha(old),requiredFrames:required.size,reusedAttributedFrames:reused,pendingActualEyeFrames:pending,pages,allPendingPersonallyViewed:false,all30fpsHumanViewed:false,earListeningPerformed:false,finalAcceptance:false};
const dest=path.join(out,'coverage.json');fs.writeFileSync(dest,JSON.stringify(result,null,1)+'\n',{flag:'wx'});console.log(JSON.stringify({dest,sha256:sha(dest),required:required.size,reused:reused.length,pending:pending.length,pages:pages.length}));
