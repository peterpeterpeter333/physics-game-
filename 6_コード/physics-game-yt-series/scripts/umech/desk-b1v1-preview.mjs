// B-1, read-only reference + original full-resolution Blender images.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
const source=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-b1v1',out=process.env.B1_COMPARE_OUT??source+'/gate-c-b1v1',cache=out+'/cache',raw=process.env.B1_RAW??source+'/blender/preview';
fs.mkdirSync(cache+'/blender',{recursive:true});fs.mkdirSync(out,{recursive:true});
const data=JSON.parse(fs.readFileSync(source+'/blender/data.json')).b1;
function link(src,dst){if(!fs.existsSync(dst))fs.symlinkSync(src,dst);}
for(const n of ['plan.json','ys-chain-b1v1.json','phrase-times.json'])link(source+'/'+n,cache+'/'+n);
link(source+'/blender/data.json',cache+'/blender/data.json');link(raw,cache+'/blender/desk');
process.env.EM_FILM_CACHE=cache;
const {vertFrame}=await import('./desk-axes-frame.mjs');
const base=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(cache+'/ys-chain-b1v1.json'));
const clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const ref='/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/完成形/1-1_女王を処刑台に送った手紙.mp4';
const refTimes=[1,94,120,184,94,226,184,226,418,418,226,488];
function refAt(t){const r=spawnSync(ff,['-v','error','-ss',String(t),'-i',ref,'-frames:v','1','-vf','scale=540:960','-f','image2pipe','-c:v','png','-'],{maxBuffer:8e6});if(r.status)throw Error(r.stderr.toString());return r.stdout;}
async function pair(a,b,title){return sharp({create:{width:1080,height:1020,channels:3,background:'#fff'}}).composite([{input:Buffer.from(`<svg width="1080" height="60"><rect width="1080" height="60" fill="white"/><text x="20" y="42" font-family="Hiragino Sans" font-size="26">${title}</text></svg>`),left:0,top:0},{input:await sharp(a).resize(540,960).toBuffer(),left:0,top:60},{input:await sharp(b).resize(540,960).toBuffer(),left:540,top:60}]).jpeg({quality:93}).toBuffer();}
const cards=[];
for(const [i,t]of data.preview.entries()){
 const j=Math.round(t*30),file=raw+'/'+String(j).padStart(5,'0')+'.jpg';if(!fs.existsSync(file))throw Error('Missing actual render '+file);
 const scene=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,scene,t);
 if(/NaN|undefined|Infinity/.test(svg))throw Error('Invalid SVG '+t);
 const frame=await sharp(Buffer.from(svg)).png().toBuffer();fs.writeFileSync(out+'/b1v1-'+String(i+1).padStart(2,'0')+'.png',frame);
 const comparison=await pair(frame,refAt(refTimes[i]),`B-1 ${t.toFixed(2)}秒　　　　　　　　　見本 1-1 第6版 ${refTimes[i]}秒`);
 fs.writeFileSync(out+'/compare-b1v1-'+String(i+1).padStart(2,'0')+'.jpg',comparison);cards.push(await sharp(comparison).resize(360,340).toBuffer());
}
await sharp({create:{width:1440,height:1020,channels:3,background:'#fff'}}).composite(cards.map((input,i)=>({input,left:i%4*360,top:Math.floor(i/4)*340}))).jpeg({quality:93}).toFile(out+'/compare-b1v1-all12.jpg');
const catalog=source+'/gate-b-b1v1';fs.mkdirSync(catalog,{recursive:true});
for(const [i,nm]of ['compass','magnets','garlic','star','map','gilbert','norman','vane','terrella','powder','meter','globe'].entries()){
 const actual=source+'/blender/catalog/'+nm+'_oblique.jpg';if(!fs.existsSync(actual))throw Error('Missing catalog '+actual);
 fs.writeFileSync(catalog+'/compare-'+nm+'.jpg',await pair(actual,refAt([94,184,120,184,268,13,13,94,226,184,94,226][i]),`B-1 ${nm}　　　　　　　　　　　　見本 1-1 第6版`));
}
console.log(JSON.stringify({gateB:catalog,gateC:out,times:data.preview,reference:ref,resolution:'1080×1920',samples:16},null,1));
