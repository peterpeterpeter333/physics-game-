// C-1 関門B/C。実写以外の背景へ置き換えず、独立した下見キャッシュで合成する。
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
const source=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1',cache=source+'/gate-c-cache',out=source+'/gate-c-c1v1';
const d=JSON.parse(fs.readFileSync(source+'/blender/data.json'));fs.mkdirSync(cache+'/blender',{recursive:true});fs.mkdirSync(out,{recursive:true});
function link(src,dst){if(!fs.existsSync(dst))fs.symlinkSync(src,dst);}
for(const name of ['plan.json','ys-chain-c1v1.json','phrase-times.json'])link(source+'/'+name,cache+'/'+name);
link(source+'/blender/data.json',cache+'/blender/data.json');link(source+'/blender/preview',cache+'/blender/desk');
process.env.EM_FILM_CACHE=cache;
const {vertFrame}=await import('./desk-axes-frame.mjs');
const base=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(cache+'/ys-chain-c1v1.json'));
const clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const ref='/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/完成形/1-1_女王を処刑台に送った手紙.mp4',refTimes=[1,418,488,94,31,94,120,226,94,418,226,431];
const pair=async(a,b,title)=>sharp({create:{width:1080,height:1020,channels:3,background:'#fff'}}).composite([{input:Buffer.from(`<svg width="1080" height="60"><rect width="1080" height="60" fill="white"/><text x="20" y="42" font-family="Hiragino Sans" font-size="26">${title}</text></svg>`),left:0,top:0},{input:await sharp(a).resize(540,960).toBuffer(),left:0,top:60},{input:await sharp(b).resize(540,960).toBuffer(),left:540,top:60}]).jpeg({quality:92}).toBuffer();
function refAt(t){const r=spawnSync(ff,['-v','error','-ss',String(t),'-i',ref,'-frames:v','1','-vf','scale=540:960','-f','image2pipe','-c:v','png','-'],{maxBuffer:8e6});if(r.status)throw Error(r.stderr.toString());return r.stdout;}
const cards=[];
for(let i=0;i<d.previews.length;i++){
 const t=d.previews[i],j=Math.round(t*30),file=source+'/blender/preview/'+String(j).padStart(5,'0')+'.jpg';if(!fs.existsSync(file))throw Error('Missing real preview '+file);
 const s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,s,t);if(/NaN|undefined|Infinity/.test(svg))throw Error('Invalid SVG '+t);
 const frame=await sharp(Buffer.from(svg)).png().toBuffer();fs.writeFileSync(out+'/c1v1-'+String(i+1).padStart(2,'0')+'.png',frame);
 const p=await pair(frame,refAt(refTimes[i]),`C-1 ${t.toFixed(2)}秒　　　　　　　　　見本 1-1 第6版 ${refTimes[i]}秒`);fs.writeFileSync(out+'/compare-c1v1-'+String(i+1).padStart(2,'0')+'.jpg',p);cards.push(await sharp(p).resize(360,340).toBuffer());
}
await sharp({create:{width:1440,height:1020,channels:3,background:'#fff'}}).composite(cards.map((input,i)=>({input,left:i%4*360,top:Math.floor(i/4)*340}))).jpeg({quality:92}).toFile(out+'/compare-c1v1-all12.jpg');
const extraTimes=[...new Set([...(d.extraPreviews??[]),...(process.env.C1_QA_EXTRA??'').split(',').filter(Boolean).map(Number)])];
for(const t of extraTimes){const f=source+'/blender/preview/'+String(Math.round(t*30)).padStart(5,'0')+'.jpg';if(!fs.existsSync(f))continue;const s=clip.scenes.find(s=>t>=s.start&&t<s.end),frame=await sharp(Buffer.from(vertFrame(clip,s,t))).png().toBuffer();fs.writeFileSync(out+'/extra-'+t+'.png',frame);fs.writeFileSync(out+'/compare-extra-'+t+'.jpg',await pair(frame,refAt(418),`C-1 ${t}秒（補足確認）　　　　　　　見本 1-1 第6版 418秒`));}
const catalog=source+'/gate-b-c1v1';fs.mkdirSync(catalog,{recursive:true});
for(const [i,name]of ['m1','m2','bump','arm','meter','shishi','domino','proto','paper','pascal'].entries()){
 const frame=source+'/blender/catalog/c1v1_'+name+'_oblique.jpg';if(!fs.existsSync(frame))throw Error('Missing catalog '+frame);
 fs.writeFileSync(catalog+'/compare-'+name+'.jpg',await pair(frame,refAt([94,184,184,226,94,356,251,337,268,13][i]),`C-1 ${name}　　　　　　　　　　　　見本 1-1 第6版`));
}
console.log(JSON.stringify({gateB:catalog,gateC:out,times:d.previews,reference:ref,resolution:'1080×1920',samples:16},null,1));
const {buildProblem}=await import('./desk-c1v1-problem.mjs');await buildProblem(source);
