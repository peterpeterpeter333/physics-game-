// New read-only contact-sheet derivative of actual probe JPEGs, no approval.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';import sharp from'sharp';
const[report,out]=process.argv.slice(2);assert(report&&out&&!fs.existsSync(out));const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const r=JSON.parse(fs.readFileSync(report)),images=r.actualImages;assert(images.length>0);for(const q of images)assert.equal(sha(q.path),q.sha256);fs.mkdirSync(out,{recursive:false});
const pages=[];for(let start=0;start<images.length;start+=10){const rows=images.slice(start,start+10),layers=[];for(let i=0;i<rows.length;i++){
 const q=rows[i],left=i%5*360,top=Math.floor(i/5)*668;layers.push({input:await sharp(q.path).resize(360,640).toBuffer(),left,top});
 layers.push({input:Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="#17212b"/><text x="5" y="21" fill="white" font-size="17">frame ${q.frame} / ${(q.frame/30).toFixed(3)}s</text></svg>`),left,top:top+640});}
 const file=path.join(out,'probe-'+String(pages.length+1).padStart(2,'0')+'.jpg');await sharp({create:{width:1800,height:1336,channels:3,background:'#17212b'}}).composite(layers).jpeg({quality:95}).toFile(file);pages.push({file,sha256:sha(file),images:rows.map(q=>({frame:q.frame,file:q.path,sha256:q.sha256})),actuallyViewed:false});}
const dest=path.join(out,'contacts.json');fs.writeFileSync(dest,JSON.stringify({report,reportSha256:sha(report),images:images.length,pages,actuallyViewed:false,automaticApproval:false},null,1)+'\n',{flag:'wx'});console.log(JSON.stringify({dest,pages:pages.length,images:images.length}));
