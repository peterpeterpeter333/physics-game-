import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import sharp from 'sharp';
const cache='/private/tmp/ys/ys-chain-b1v1-final2-20261024',out='/private/tmp/ys/ys-chain-b1v1-final3-pole-probe-20261024';
assert(!fs.existsSync(out));fs.mkdirSync(out);process.env.EM_FILM_CACHE=cache;
const {vertFrame}=await import('./desk-b1v1-final3-frame.mjs');
const p=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],a=JSON.parse(fs.readFileSync(cache+'/ys-chain-b1v1.json'));
const c={...p,duration:a.duration,scenes:p.scenes.map((s,i)=>({...s,start:a.scenes[i].start,end:a.scenes[i].end,captions:a.scenes[i].captions}))};
const rows=[];
for(const t of[166.9,168,171,185.9]){
 const s=c.scenes.find(s=>t>=s.start&&t<s.end),svg=vertFrame(c,s,t),file=out+'/'+String(Math.round(t*30)).padStart(5,'0')+'.png';
 await sharp(Buffer.from(svg)).png().toFile(file);rows.push({time:t,file,sha256:createHash('sha256').update(fs.readFileSync(file)).digest('hex')});
}
fs.writeFileSync(out+'/report.json',JSON.stringify({scope:'B2 raw with proposed B3 2D pole-location dots; not final MP4',noNewJapanese:true,no3DPhysicalPoleMovement:true,rows,actualEyeReviewPending:true},null,1));console.log(out);
