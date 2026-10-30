// Compose gate-C previews only after actual full-quality Blender frames exist.
import {readFileSync,writeFileSync,mkdirSync,readdirSync,existsSync,symlinkSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
import path from 'node:path';
const source=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1v1',dir=process.env.D1_PREVIEW_DIR??source+'/blender/landmarks-d1v1',cache=source+'/gate-c-cache-d1v1-'+path.basename(dir);
const d=JSON.parse(readFileSync(source+'/blender/data.json'));mkdirSync(cache+'/blender',{recursive:true});
const link=(src,dst)=>{if(!existsSync(dst))symlinkSync(src,dst);};
for(const f of ['plan.json','ys-chain-d1v1.json','phrase-times.json'])link(source+'/'+f,cache+'/'+f);
link(source+'/blender/data.json',cache+'/blender/data.json');link(dir,cache+'/blender/desk');
process.env.EM_FILM_CACHE=cache;process.env.DESK_ALLOW_MISSING='1';
const {vertFrame}=await import('./desk-axes-frame.mjs');
const p=JSON.parse(readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(readFileSync(cache+'/ys-chain-d1v1.json'));
const clip={...p,duration:timed.duration,scenes:p.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const out=process.env.D1_PREVIEW_OUT??source+'/gate-c-d1v1';if(existsSync(out))throw Error('Existing D1 preview output preserved; choose a fresh D1_PREVIEW_OUT');mkdirSync(out,{recursive:true});
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const ref='/private/tmp/ys/ys-chain-1-1v6/out/ys-chain-1-1v6.mp4';
const refTimes=[7,13,25,268,20,94,95,337,418,364,431,488];
const times=process.env.D1_TIMES?process.env.D1_TIMES.split(',').map(Number):d.landmarks;
let cards=[];
for(let i=0;i<times.length;i++){
 const t=times[i],j=Math.round(t*30);if(!existsSync(dir+'/'+String(j).padStart(5,'0')+'.jpg'))throw Error('Full-quality landmark missing '+t);
 const s=clip.scenes.find(s=>s.start<=t&&s.end>=t);const svg=vertFrame(clip,s,t);
 if(/NaN|undefined|Infinity/.test(svg))throw Error('Invalid D1 preview '+t);
 const frame=await sharp(Buffer.from(svg)).png().toBuffer();await sharp(frame).png().toFile(out+'/d1v1-'+String(i+1).padStart(2,'0')+'.png');
 const refTime=refTimes[d.landmarks.indexOf(t)]??(t>=382?488:95);
 const r=spawnSync(ff,['-v','error','-ss',String(refTime),'-i',ref,'-frames:v','1','-vf','scale=540:960','-f','image2pipe','-c:v','png','-'],{maxBuffer:8e6});if(r.status)throw Error(r.stderr.toString());
 const a=await sharp(frame).resize(540,960).png().toBuffer();
 const title=Buffer.from(`<svg width="1080" height="60"><rect width="1080" height="60" fill="white"/><text x="20" y="42" font-family="Hiragino Sans" font-size="30">D-1 ${t.toFixed(2)}秒</text><text x="560" y="42" font-family="Hiragino Sans" font-size="30">見本 1-1 第6版 ${refTime}秒</text></svg>`);
 const pair=await sharp({create:{width:1080,height:1020,channels:3,background:'#fff'}}).composite([{input:title,left:0,top:0},{input:a,left:0,top:60},{input:r.stdout,left:540,top:60}]).jpeg({quality:92}).toBuffer();
 writeFileSync(out+'/compare-d1v1-'+String(i+1).padStart(2,'0')+'.jpg',pair);cards.push(await sharp(pair).resize(360,340).toBuffer());
}
await sharp({create:{width:1440,height:340*Math.ceil(cards.length/4),channels:3,background:'#fff'}}).composite(cards.map((input,i)=>({input,left:i%4*360,top:Math.floor(i/4)*340}))).jpeg({quality:92}).toFile(out+`/compare-d1v1-all${times.length}.jpg`);
for(const t of (process.env.D1_EXTRA_TIMES??'157,175,194,296,318,352,369,389').split(',').map(Number)){
 const j=Math.round(t*30);if(!existsSync(dir+'/'+String(j).padStart(5,'0')+'.jpg'))continue;
 const s=clip.scenes.find(s=>s.start<=t&&s.end>=t),svg=vertFrame(clip,s,t);if(/NaN|undefined|Infinity/.test(svg))throw Error('Invalid D1 extra '+t);
 await sharp(Buffer.from(svg)).png().toFile(out+'/extra-d1v1-'+String(j).padStart(5,'0')+'.png');
}
// The answer label is 2D, as all explanatory labels in the series are.
const problem=process.env.D1_PROBLEM_DIR??source+'/problem',answer=problem+'/答え.png',labelled=problem+'/答え-d1v1-札付き.png';if(existsSync(answer)&&!existsSync(labelled)){
 const label=Buffer.from(`<svg width="1080" height="1920"><g><rect x="40" y="310" width="430" height="86" rx="8" fill="#f4e8cc" stroke="#b8925a" stroke-width="3"/><text x="255" y="368" font-family="Hiragino Sans" font-size="44" font-weight="800" text-anchor="middle" fill="#3b2412">約${d.numbers.fujiRatio}倍</text></g></svg>`);
 await sharp(answer).composite([{input:label}]).png().toFile(labelled);
}
console.log(JSON.stringify({landmarks:times,comparisons:out,reference:ref,quality:'1080×1920, Blender EEVEE 16 samples, narration captions and D1 overlay'},null,1));
