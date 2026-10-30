// C-1の全編1秒probe。全30fps本番の合格を代用しない。
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
const source=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1',raw=source+'/blender/probe1s',cache=source+'/probe1s-cache',out=source+'/probe1s-review-c1v1',id='ys-chain-c1v1';
const d=JSON.parse(fs.readFileSync(source+'/blender/data.json')),times=Array.from({length:Math.ceil(d.duration)},(_,i)=>i);
const qa=fs.existsSync(raw+'/qa-samples.json')?JSON.parse(fs.readFileSync(raw+'/qa-samples.json')):null,qaTimes=qa?[...qa.times].sort((a,b)=>a-b):times;
const reviewName=t=>Number.isInteger(t)?String(t).padStart(3,'0')+'.jpg':'frame-'+String(Math.round(t*30)).padStart(5,'0')+'.jpg';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),rendererPaths=['./desk-axes-frame.mjs','./desk-c1v1-overlay.mjs','./desk-c1v1-probe1s.mjs'].map(f=>new URL(f,import.meta.url));
const rendererSha256=Object.fromEntries(rendererPaths.map(p=>[p.pathname,hash(p)]));
fs.mkdirSync(cache+'/blender',{recursive:true});fs.mkdirSync(out,{recursive:true});
const link=(s,t)=>{if(!fs.existsSync(t))fs.symlinkSync(s,t);else if(fs.realpathSync(t)!==fs.realpathSync(s))throw Error('Unexpected probe link '+t);};
for(const f of ['plan.json',id+'.json','phrase-times.json'])link(source+'/'+f,cache+'/'+f);
link(source+'/blender/data.json',cache+'/blender/data.json');link(raw,cache+'/blender/desk');
for(const t of qaTimes){const f=raw+'/'+String(Math.round(t*30)).padStart(5,'0')+'.jpg';if(!fs.existsSync(f))throw Error('Missing actual QA frame '+f);const m=await sharp(f).metadata();if(m.width!==1080||m.height!==1920)throw Error('Wrong probe resolution '+f);}
process.env.EM_FILM_CACHE=cache;const {vertFrame}=await import('./desk-axes-frame.mjs');
const base=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(cache+'/'+id+'.json')),clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const ref='/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/完成形/1-1_女王を処刑台に送った手紙.mp4',refDir=out+'/reference1s',ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
fs.mkdirSync(refDir,{recursive:true});if(!fs.existsSync(refDir+'/'+String(times.length-1).padStart(5,'0')+'.jpg')){const r=spawnSync(ff,['-y','-v','error','-i',ref,'-vf','fps=1,scale=216:384:flags=area','-frames:v',String(times.length),'-start_number','0','-q:v','3',refDir+'/%05d.jpg'],{encoding:'utf8'});if(r.status)throw Error(r.stderr);}
let cards=[];let sheet=0;
async function flush(){if(!cards.length)return;sheet++;await sharp({create:{width:1296,height:1206,channels:3,background:'#f4e8cc'}}).composite(cards.map((input,i)=>({input,left:i%3*432,top:Math.floor(i/3)*402}))).jpeg({quality:94}).toFile(out+'/compare1s-'+String(sheet).padStart(2,'0')+'.jpg');cards=[];}
for(const t of qaTimes){const s=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,s,t);if(/NaN|Infinity|undefined/.test(svg))throw Error('Invalid probe SVG '+t);const jpg=await sharp(Buffer.from(svg)).jpeg({quality:93}).toBuffer();fs.writeFileSync(out+'/'+reviewName(t),jpg);const refT=Math.min(times.at(-1),Math.floor(t)),pair=await sharp({create:{width:432,height:402,channels:3,background:'#f4e8cc'}}).composite([{input:await sharp(jpg).resize(216,384).toBuffer(),left:0,top:18},{input:fs.readFileSync(refDir+'/'+String(refT).padStart(5,'0')+'.jpg'),left:216,top:18},{input:Buffer.from(`<svg width="432" height="18"><text x="5" y="14" font-family="Arial" font-size="14">C1 ${Number(t.toFixed(3))}s                 REF ${refT}s</text></svg>`),left:0,top:0}]).jpeg({quality:93}).toBuffer();cards.push(pair);if(cards.length===9)await flush();}
await flush();
const thFile='scripts/umech/desk-quality-gate.mjs',thSource=fs.readFileSync(thFile,'utf8'),th=vm.runInNewContext('('+thSource.match(/export const TH=(\{[\s\S]*?\n\});/)[1]+')');
const record={isPreflight:true,notFull30fps:true,raw,review:out,times,qaTimes,qaFrames:qaTimes.map(t=>({time:t,frame:Math.round(t*30),reviewFile:reviewName(t)})),criticalFrames:qa?.criticalFrames,cueEnds:qa?.cueEnds,sheets:sheet,width:1080,height:1920,sourceSha256:createHash('sha256').update(fs.readFileSync(source+'/blender/data.json')).digest('hex'),thresholdSource:thFile,thresholdSourceSha256:createHash('sha256').update(thSource).digest('hex'),thresholds:th};
for(const [p,h] of Object.entries(rendererSha256))if(hash(p)!==h)throw Error('Renderer changed during final QA '+p);
record.rendererSha256=rendererSha256;
fs.writeFileSync(source+'/c1-probe1s-metadata.json',JSON.stringify(record,null,1));console.log(JSON.stringify(record,null,1));
