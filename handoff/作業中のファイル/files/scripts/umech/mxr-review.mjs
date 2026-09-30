import {readFileSync,mkdirSync,writeFileSync,existsSync} from 'node:fs';
import sharp from 'sharp';
import {umechFrame} from './frame.mjs';
const cache=process.env.EM_FILM_CACHE,base=JSON.parse(readFileSync(cache+'/plan.json'))[0];
let clip,t=0;const timed=cache+'/'+base.id+'.json';
if(existsSync(timed)){const a=JSON.parse(readFileSync(timed));clip={...base,duration:a.duration,scenes:base.scenes.map((s,i)=>({...s,start:a.scenes[i].start,end:a.scenes[i].end,captions:a.scenes[i].captions}))};}
else{clip={...base,scenes:base.scenes.map(s=>{const captions=s.cues.map(q=>{const start=t;t+=9+(q.pause??0);return {text:q.subtitle,start,end:t};});return {...s,start:captions[0].start,end:t,captions};}),duration:t};}
const out=cache+'/review';mkdirSync(out,{recursive:true});let tiles=[],page=0,idx=0,manifest=[];
async function flush(){if(!tiles.length)return;const name=`page-${String(++page).padStart(2,'0')}.jpg`;await sharp({create:{width:1920,height:400*Math.ceil(tiles.length/3),channels:3,background:'#000'}}).composite(tiles.map((input,i)=>({input,left:i%3*640,top:Math.floor(i/3)*400}))).jpeg({quality:85}).toFile(out+'/'+name);tiles=[];}
for(const s of clip.scenes)for(let i=0;i<s.cues.length;i++){
 const q=s.cues[i],cap=s.captions[i];for(const p of [.05,.5,.95]){const svg=umechFrame(clip,s,cap.start+(cap.end-cap.start)*p);if(/NaN|Infinity/.test(svg))throw Error(`Invalid geometry cue ${idx}`);if(/data-mml-node="merror"/.test(svg))throw Error(`Invalid math cue ${idx}`);if(p===.95){const top=Buffer.from(`<svg width="640" height="20"><rect width="640" height="20" fill="#fff"/><text x="8" y="16" font-size="15">${idx} ${q.diagram??'equation'} ${q.mode??''}</text></svg>`);const frame=await sharp(Buffer.from(svg)).resize(640,380).png().toBuffer();tiles.push(await sharp({create:{width:640,height:400,channels:3,background:'#000'}}).composite([{input:top,left:0,top:0},{input:frame,left:0,top:20}]).png().toBuffer());}}
 manifest.push({index:idx++,chapter:s.heading,start:cap.start,end:cap.end,text:q.subtitle,diagram:q.diagram,mode:q.mode});if(tiles.length===12)await flush();
}await flush();writeFileSync(out+'/manifest.json',JSON.stringify(manifest,null,2));console.log(`Verified ${idx} cues × 3 moments; ${page} review sheets; ${clip.duration.toFixed(1)} s`);
