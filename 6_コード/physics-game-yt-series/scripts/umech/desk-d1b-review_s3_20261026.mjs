// Contact sheets of actual renders; labels are review metadata, not video text.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const [input,out]=process.argv.slice(2);
assert.ok(input&&out);
const files=fs.readdirSync(input).filter(f=>/^\d{5}\.jpg$/.test(f)).sort();
assert.ok(files.length);
fs.mkdirSync(out,{recursive:true});
for(let a=0;a<files.length;a+=10){
 const dest=path.join(out,`page-${String(a/10+1).padStart(2,'0')}.jpg`);
 assert.equal(fs.existsSync(dest),false,'preserve previous contact sheets');
 const comp=[];
 for(let n=0;n<Math.min(10,files.length-a);n++){
  const f=files[a+n],x=(n%5)*270,y=Math.floor(n/5)*510;
  const j=Number(f.slice(0,5));
  comp.push({input:await sharp(path.join(input,f)).resize(270,480).toBuffer(),left:x,top:y+30});
  const text=`${(j/30).toFixed(3)} s  #${j}`;
  comp.push({input:Buffer.from(`<svg width="270" height="30"><rect width="270" height="30" fill="#182335"/><text x="10" y="22" font-family="Arial" font-size="18" fill="white">${text}</text></svg>`),left:x,top:y});
 }
 await sharp({create:{width:1350,height:1020,channels:3,background:'#182335'}}).composite(comp).jpeg({quality:94}).toFile(dest);
 console.log(dest);
}
