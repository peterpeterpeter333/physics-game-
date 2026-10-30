// NEW actual137 comparisons only. Image generation is not a viewing receipt.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';import sharp from 'sharp';
const [summary,out]=process.argv.slice(2);assert(summary&&out&&!fs.existsSync(out));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const s=JSON.parse(fs.readFileSync(summary));assert.equal(s.actualImageCount,36);
assert.equal(s.all36StrictTransactionGuardsPass,true);assert.equal(s.passes.length,2);
const p=s.passes[1];assert.equal(p.pass,2);assert.equal(sha(p.report),p.reportSha256);
const report=JSON.parse(fs.readFileSync(p.report)),rows=report.actualImages;
assert.deepEqual(rows.map(r=>r.frame),Array.from({length:18},(_,i)=>4124+i));
fs.mkdirSync(out,{recursive:false});const pages=[];
for(let start=0;start<18;start+=6){
 const cells=rows.slice(start,start+6),layers=[];
 for(let k=0;k<cells.length;k++){
  const r=cells[k],x=(k%2)*720,y=Math.floor(k/2)*668;
  for(const [side,file,h]of [[0,r.source,r.sourceSha256],[1,r.path,r.sha256]]){
   assert.equal(sha(file),h);const m=await sharp(file).metadata();assert.equal(m.width,1080);assert.equal(m.height,1920);
   layers.push({input:await sharp(file).resize(360,640).toBuffer(),left:x+side*360,top:y});
   const label=`${r.frame} ${side===0?'HISTORICAL SOURCE':'137 PASS2 CONTROL'}`;
   layers.push({input:Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="#122535"/><text x="5" y="21" fill="white" font-family="Helvetica" font-size="15">${label}</text></svg>`),left:x+side*360,top:y+640});
  }
 }
 const file=path.join(out,'pairs-'+String(pages.length+1).padStart(2,'0')+'.jpg');
 await sharp({create:{width:1440,height:2004,channels:3,background:'#122535'}}).composite(layers).jpeg({quality:95}).toFile(file);
 pages.push({file,sha256:sha(file),frames:cells.map(r=>r.frame),actuallyViewed:false});
}
const m={episode:'B-1',summary,summarySha256:sha(summary),report:p.report,reportSha256:p.reportSha256,
 pages,frames:rows.map(r=>({frame:r.frame,source:r.source,sourceSha256:r.sourceSha256,path:r.path,sha256:r.sha256})),
 displayScope:'Six pairs per page; historical LEFT and current pass2 RIGHT within each pair; each source resized1080x1920 to360x640',
 actuallyViewed:false,approvalGranted:false,historicalCurrentDifferenceCause:'not-established'};
const dest=path.join(out,'manifest.json');fs.writeFileSync(dest,JSON.stringify(m,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({manifest:dest,sha256:sha(dest),pages:pages.length,pairs:18,approvalGranted:false}));
