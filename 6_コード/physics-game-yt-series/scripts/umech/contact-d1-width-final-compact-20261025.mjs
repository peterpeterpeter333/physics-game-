import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const [manifestPath,out]=process.argv.slice(2);
assert(manifestPath&&out&&!fs.existsSync(out));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const a=JSON.parse(fs.readFileSync(manifestPath));
assert(a.actualEncodedSource&&a.rows.length===634&&a.integerSeconds===406&&a.changedFrames===149);
fs.mkdirSync(out);const pages=[];
for(let at=0;at<a.rows.length;at+=20){
 const layers=[];
 for(let i=0;i<20&&at+i<a.rows.length;i++){
  const r=a.rows[at+i],x=(i%5)*216,y=Math.floor(i/5)*406;
  assert.equal(sha(r.file),r.sha256);
  const text=`${r.time.toFixed(3)}s #${r.frame}${r.reasons.includes('changed-30fps-frame')?' PATCH':''}`;
  const head=Buffer.from(`<svg width="216" height="22"><rect width="216" height="22" fill="white"/><text x="4" y="16" font-family="Hiragino Sans" font-size="12" fill="#241c15">${text}</text></svg>`);
  layers.push({input:head,left:x,top:y},{input:await sharp(r.file).resize(216,384).toBuffer(),left:x,top:y+22});
 }
 const file=out+'/page-'+String(pages.length+1).padStart(3,'0')+'.jpg';
 await sharp({create:{width:1080,height:1624,channels:3,background:'#fff'}}).composite(layers).jpeg({quality:96}).toFile(file);
 pages.push({page:pages.length+1,file,sha256:sha(file),frames:a.rows.slice(at,at+20).map(r=>r.frame)});
}
fs.writeFileSync(out+'/manifest.json',JSON.stringify({sourceManifest:manifestPath,sourceManifestSha256:sha(manifestPath),sourceMovie:a.mp4,sourceMovieSha256:a.mp4Sha256,frames:634,pages,personallyViewed:false},null,1),{flag:'wx'});
console.log(JSON.stringify({out,pages:pages.length}));
