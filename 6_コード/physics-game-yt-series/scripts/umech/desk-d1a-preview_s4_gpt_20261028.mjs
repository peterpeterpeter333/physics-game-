// Native logical composite preview, exact frame only; never alters source text.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import sharp from 'sharp';
import {CACHE,inputs,exactFrame} from './desk-d1a-stage_s4_gpt_20261028.mjs';
const label=process.argv[2]??'p1',dir=path.join(CACHE,'preview',label),manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json')));
assert.ok(/^[A-Za-z0-9_]+$/.test(label));
const macro=JSON.parse(fs.readFileSync(path.join(dir,'macro-frames.json')));
fs.writeFileSync(path.join(CACHE,'blender/macro-frames.json'),JSON.stringify(macro));
const stage=inputs({rawDir:dir,anchorsFile:path.join(dir,'anchors.json'),sparse:true});
await import('./desk-d1a-hooks_s4_gpt_20261028.mjs');const {vertFrame}=await import('./frame-vert.mjs');
const out=path.join(dir,'composite'+(process.argv[3]??''));assert.equal(fs.existsSync(out),false);fs.mkdirSync(out);
const rows=[];
for(const r of manifest.frames){
 const j=r.frame,t=j/30;exactFrame(stage,j);const s=stage.clip.scenes.find(s=>t>=s.start&&t<s.end)??stage.clip.scenes.at(-1);
 const svg=vertFrame(stage.clip,s,t),markup=svg.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,'data:image/checked');if(/NaN|undefined|Infinity/.test(markup))fs.writeFileSync(path.join(out,'invalid-'+j+'.svg'),svg);assert.ok(!/NaN|undefined|Infinity/.test(markup),'Invalid at '+j);
 const file=path.join(out,String(j).padStart(5,'0')+'.jpg');await sharp(Buffer.from(svg)).jpeg({quality:93}).toFile(file);
 rows.push({...r,composite:file});
}
const pump=rows.filter(r=>r.time>=314&&r.time<=340),other=rows.filter(r=>r.time<314||r.time>340);
for(const [group,items]of [['pump',pump],['other',other]])for(let a=0;a<items.length;a+=12){
 const subset=items.slice(a,a+12),cw=270,ch=515,cols=4,h=Math.ceil(subset.length/cols)*ch;
 const tiles=[];
 for(let i=0;i<subset.length;i++){
  const r=subset[i],x=i%cols*cw,y=Math.floor(i/cols)*ch;
  tiles.push({input:await sharp(r.composite).resize(cw,480).toBuffer(),left:x,top:y});
  const txt=Buffer.from(`<svg width="270" height="35"><rect width="270" height="35" fill="#eee"/><text x="8" y="25" font-size="22">${r.time.toFixed(3)} / ${r.frame}</text></svg>`);
  tiles.push({input:txt,left:x,top:y+480});
 }
 await sharp({create:{width:cw*cols,height:h,channels:3,background:'#eee'}}).composite(tiles).png().toFile(path.join(dir,`${group}-${a/12}.png`));
}
fs.writeFileSync(path.join(dir,'composite-manifest.json'),JSON.stringify({frames:rows,personallyViewed:false}));
console.log('COMPOSITE_PREVIEW',dir,rows.length);
