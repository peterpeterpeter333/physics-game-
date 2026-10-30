// Key frames at full size: node scripts/umech/shots.mjs <id> <cueIndex:progress>... → $EM_FILM_CACHE/shots.jpg
import {readFileSync} from 'node:fs';import sharp from 'sharp';
import {umechFrame} from './frame.mjs';
import {vertFrame,VERT_PILOT} from './frame-vert.mjs';
const [id,...specs]=process.argv.slice(2);const plan=JSON.parse(readFileSync(process.env.EM_FILM_CACHE+'/plan.json'));const e=plan.find(c=>c.id===id);
let t=0;const clip={...e,scenes:e.scenes.map(s=>{const captions=s.utterances.map(u=>{const d=4+(u.pause??0);const c={text:u.subtitle,start:t,end:t+d};t+=d;return c;});return {...s,start:captions[0].start,end:t,captions};})};clip.duration=t;
const cues=clip.scenes.flatMap(s=>s.captions.map((c,k)=>[s,c]));const tiles=[];
if(clip.visualPilot===VERT_PILOT){ // 縦長（1080×1920）：540×960 を横に3枚
 for(const sp of specs){const [i,u]=sp.split(':').map(Number);const [s,c]=cues[i];tiles.push(await sharp(Buffer.from(vertFrame(clip,s,c.start+(c.end-c.start)*u))).resize(540,960).png().toBuffer());}
 await sharp({create:{width:1620,height:960*Math.ceil(tiles.length/3),channels:3,background:'#000'}}).composite(tiles.map((b,i)=>({input:b,left:(i%3)*540,top:Math.floor(i/3)*960}))).jpeg({quality:85}).toFile(process.env.EM_FILM_CACHE+'/shots.jpg');process.exit(0);
}
for(const sp of specs){const [i,u]=sp.split(':').map(Number);const [s,c]=cues[i];tiles.push(await sharp(Buffer.from(umechFrame(clip,s,c.start+(c.end-c.start)*u))).resize(960,570).png().toBuffer());}
await sharp({create:{width:1920,height:570*Math.ceil(tiles.length/2),channels:3,background:'#000'}}).composite(tiles.map((b,i)=>({input:b,left:(i%2)*960,top:Math.floor(i/2)*570}))).jpeg({quality:85}).toFile(process.env.EM_FILM_CACHE+'/shots.jpg');
