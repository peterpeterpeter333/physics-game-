import fs from 'node:fs';
import sharp from 'sharp';
const W=process.cwd(),ROOT='/private/tmp/ys/ys-chain-1-2v1-render',out=ROOT+'/gate-1-2v1';
const dest=W+'/docs/video-revision-20260924/deep/部品カタログ画像';
fs.mkdirSync(dest,{recursive:true});
for(const f of fs.readdirSync(ROOT+'/blender/catalog-1-2v1-b2')){
 if(!f.startsWith('1_2v1_')||!f.endsWith('.jpg'))continue;
 if(!fs.existsSync(dest+'/'+f))fs.copyFileSync(ROOT+'/blender/catalog-1-2v1-b2/'+f,dest+'/'+f);
}
const old=JSON.parse(fs.readFileSync('/private/tmp/ys/ys-chain-1-1v6/ys-chain-1-1v6.json'));
const caps=old.scenes.flatMap(s=>s.captions);
const wanted=[4,90,35,35,35,190,260,35,35,260,40,488];
for(let i=0;i<wanted.length;i++){
 let k=0;for(let j=1;j<caps.length;j++)if(Math.abs(caps[j].end-wanted[i])<Math.abs(caps[k].end-wanted[i]))k=j;
 const ref=`${out}/regression-before/ys-chain-1-1v6-${String(k).padStart(3,'0')}.png`;
 const fresh=`${out}/preview-${String(i+1).padStart(2,'0')}.png`;
 const a=await sharp(ref).resize(432,768).toBuffer(),b=await sharp(fresh).resize(432,768).toBuffer();
 await sharp({create:{width:864,height:768,channels:3,background:'#000'}}).composite([{input:a,left:0,top:0},{input:b,left:432,top:0}]).png().toFile(`${out}/compare-1-2v1-${String(i+1).padStart(2,'0')}.png`);
}
for(let page=0;page<2;page++){
 let inputs=[];for(let i=0;i<6;i++)inputs.push({input:await sharp(`${out}/compare-1-2v1-${String(page*6+i+1).padStart(2,'0')}.png`).resize(432,384).toBuffer(),left:(i%3)*432,top:Math.floor(i/3)*384});
 await sharp({create:{width:1296,height:768,channels:3,background:'#000'}}).composite(inputs).png().toFile(`${out}/comparison-sheet-1-2v1-${page+1}.png`);
}
const a=await sharp(`${dest}/1_2v1_alberti_oblique.jpg`).resize(432,768).toBuffer();
const b=await sharp(`${out}/regression-before/ys-chain-1-1v6-004.png`).resize(432,768).toBuffer();
await sharp({create:{width:864,height:768,channels:3,background:'#000'}}).composite([{input:b,left:0,top:0},{input:a,left:432,top:0}]).png().toFile(`${out}/catalog-world-1-2v1.png`);
console.log('26 catalog images saved; 12 comparison pairs generated');
