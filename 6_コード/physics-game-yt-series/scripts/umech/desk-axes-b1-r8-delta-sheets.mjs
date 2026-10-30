// Reassemble already rendered current images; do not render or alter prior evidence.
import fs from 'node:fs';
import sharp from 'sharp';
const c='/private/tmp/ys/ys-chain-b1v1', marker=JSON.parse(fs.readFileSync(c+'/blender/b1-r8-probe-complete.json'));
const review=c+'/review-probe1s-b1v1-r8', out=review+'/delta-sheets';
fs.mkdirSync(out,{recursive:true});
const times=marker.times.filter(t=>!fs.lstatSync(marker.raw+'/'+String(Math.round(t*30)).padStart(5,'0')+'.jpg').isSymbolicLink());
const cards=[];
for(const t of times){
 const input=review+'/frames/'+String(Math.round(t*30)).padStart(5,'0')+'.png';
 const label=Buffer.from(`<svg width="360" height="36"><rect width="360" height="36" fill="white"/><text x="10" y="26" font-size="22">B-1 r8 ${t.toFixed(2)} s</text></svg>`);
 cards.push(await sharp({create:{width:360,height:676,channels:3,background:'#fff'}}).composite([{input:await sharp(input).resize(360,640).toBuffer(),left:0,top:36},{input:label,left:0,top:0}]).jpeg({quality:94}).toBuffer());
}
const sheets=[];
for(let i=0;i<cards.length;i+=6){
 const name=out+'/sheet-'+String(i/6+1).padStart(2,'0')+'.jpg';
 await sharp({create:{width:1080,height:1352,channels:3,background:'#fff'}}).composite(cards.slice(i,i+6).map((input,k)=>({input,left:k%3*360,top:Math.floor(k/3)*676}))).jpeg({quality:94}).toFile(name);sheets.push(name);
}
fs.writeFileSync(out+'/index.json',JSON.stringify({status:'not yet visually reviewed',times,count:times.length,sheets,priorExactUnchanged:marker.linkedExactUnchanged},null,1));
console.log(JSON.stringify({count:times.length,sheets:sheets.length,out}));
