// Before/after stills only. Does not generate or certify an S4 video.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const root=path.resolve('outputs/ys-chain-b2a-backup/S4_20261030');
const old=JSON.parse(fs.readFileSync(path.join(root,'旧S3比較用/composition-audit.json')));
const now=JSON.parse(fs.readFileSync(path.join(root,'全修正試写02/composition-audit.json')));
const out=path.join(root,'前後比較_試写02');assert.ok(!fs.existsSync(out));fs.mkdirSync(out);
const seconds=[6.9,24.4,25.9,47.1,78.5,84,87.2,91.2,96.6,101.8,136,150,190.9,193.1,245.5,263,265.07,268.33,317.7,334.9,336.5,365,373.3,375.2,377,380.8,398.7,401.1,406,408.8,437.9,445.2,473,475.8,485,486];
const frames=seconds.map(t=>{const j=Math.round(t*30),a=old.frames.find(x=>x.j===j),b=now.frames.find(x=>x.j===j);assert.ok(a&&b,'Missing exact pair '+j);return {j,t:j/30,row:b.row,before:a.output,after:b.output};});
const pages=[];
for(let k=0;k<frames.length;k+=6){
 const group=frames.slice(k,k+6),items=[];
 for(let i=0;i<group.length;i++){
  const f=group[i],x=12+(i%3)*444,y=12+Math.floor(i/3)*446;
  for(const [n,p] of [[0,f.before],[1,f.after]])items.push({input:await sharp(p).resize(210,373).jpeg({quality:91}).toBuffer(),left:x+n*220,top:y+42});
  items.push({input:Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="432" height="38"><rect width="432" height="38" fill="#fff"/><text x="8" y="25" font-size="17" font-family="sans-serif" fill="#111">row ${f.row} | ${f.t.toFixed(2)}s | BEFORE / AFTER</text></svg>`),left:x,top:y});
 }
 const f=path.join(out,`page-${String(pages.length+1).padStart(2,'0')}.jpg`);await sharp({create:{width:1344,height:906,channels:3,background:'#ddd8cd'}}).composite(items).jpeg({quality:93}).toFile(f);pages.push(f);
}
fs.writeFileSync(path.join(out,'comparison-manifest.json'),JSON.stringify({stage:'S3-quality still comparison, not S4',pairs:frames,pages,allVisualsReviewed:false},null,2));
console.log(JSON.stringify({pairs:frames.length,pages:pages.length,out}));
