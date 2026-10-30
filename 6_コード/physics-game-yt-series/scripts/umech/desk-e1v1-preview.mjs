// Isolated E-1 compositing, reference comparisons and immutable-source draw cache.
import fs from 'node:fs';
import sharp from 'sharp';
const source='/private/tmp/ys/ys-chain-e1v1',mode=process.argv[2]??'preview';
const tag=process.env.E1_PASS_TAG??'e1v1',root=mode==='final-cache'?'/private/tmp/ys/ys-chain-e1v1-render':source+'/preview-cache-'+tag;
fs.mkdirSync(root+'/blender',{recursive:true});
function link(src,dst){if(!fs.existsSync(dst))fs.symlinkSync(src,dst);}
const plan=JSON.parse(fs.readFileSync(source+'/plan.json'));plan[0].series='E 時間と位置 1';
fs.writeFileSync(root+'/plan.json',JSON.stringify(plan));
for(const f of ['phrase-times.json','timed-selection.json','ys-chain-e1v1.json'])link(source+'/'+f,root+'/'+f);
link(source+'/blender/data.json',root+'/blender/data.json');link(source+'/blender/tex',root+'/blender/tex');
if(mode==='final-cache'){
 link(source+'/blender/desk',root+'/blender/desk');link(source+'/blender/camera-motion.json',root+'/blender/camera-motion.json');
 link(source+'/ys-chain-e1v1.mix.wav',root+'/ys-chain-e1v1.wav');link(source+'/ys-chain-e1v1.wav',root+'/ys-chain-e1v1.voice.wav');
 for(const f of ['ys-chain-e1v1.levels.json','ys-chain-e1v1.mix.json'])link(source+'/'+f,root+'/'+f);
 fs.mkdirSync(root+'/out',{recursive:true});console.log(root);process.exit(0);
}
const renderDir=process.env.E1_PREVIEW_DIR??source+'/blender/gate12';link(renderDir,root+'/blender/desk');
process.env.EM_FILM_CACHE=root;process.env.DESK_ALLOW_MISSING='1';
const {vertFrame}=await import('./desk-axes-frame.mjs');
const timed=JSON.parse(fs.readFileSync(root+'/ys-chain-e1v1.json'));
const base=plan[0],clip={...base,duration:timed.duration,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const data=JSON.parse(fs.readFileSync(source+'/blender/data.json'));
const times=process.env.E1_TIMES?process.env.E1_TIMES.split(',').map(Number):data.gateTimes;
const out=source+'/gate-'+tag;fs.mkdirSync(out,{recursive:true});
const available=fs.readdirSync(renderDir).filter(f=>/^\d+\.jpg$/.test(f)).map(f=>+f.slice(0,-4)).sort((a,b)=>a-b);
const refs=[1,485,14,67,186,70,49,196,253,146,286,485];
const refDir='/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/見本_1-1第6版/全コマ一覧_1秒ごと';
const thumbnails=[];
for(let i=0;i<times.length;i++){
 const j=Math.round(times[i]*30);if(!available.includes(j))throw Error('Missing requested E-1 gate frame '+j+' at '+times[i]+' seconds');
 const t=j/30,s=clip.scenes.find(s=>s.start<=t&&s.end>=t)??clip.scenes.at(-1);
 const svg=vertFrame(clip,s,t);if(/NaN|undefined/.test(svg.replace(/<image[^>]+>/g,'')))throw Error('Invalid SVG '+t);
 const png=out+'/preview-'+String(i+1).padStart(2,'0')+'.png';fs.writeFileSync(png.replace('.png','.svg'),svg);await sharp(Buffer.from(svg)).png().toFile(png);
 const here=await sharp(png).resize(540,960).toBuffer();const ri=refs[i]??0;const sheet=Math.floor(ri/10)+1,cell=ri%10;
 const reference=await sharp(refDir+'/sheet-'+String(sheet).padStart(2,'0')+'.jpg').extract({left:(cell%5)*360,top:Math.floor(cell/5)*662+22,width:360,height:640}).resize(540,960).toBuffer();
 await sharp({create:{width:1080,height:960,channels:3,background:'#000'}}).composite([{input:reference,left:0,top:0},{input:here,left:540,top:0}]).jpeg({quality:93}).toFile(out+'/compare-'+String(i+1).padStart(2,'0')+'.jpg');
 thumbnails.push(await sharp(png).resize(270,480).toBuffer());
}
fs.writeFileSync(out+'/comparison-e1v1.json',JSON.stringify({times,referenceSeconds:refs,referenceSide:'left',e1Side:'right',renderResolution:[1080,1920],samples:16},null,2));
await sharp({create:{width:1080,height:480*Math.ceil(times.length/4),channels:3,background:'#000'}}).composite(thumbnails.map((input,i)=>({input,left:i%4*270,top:Math.floor(i/4)*480}))).png().toFile(out+'/E1_主要12時刻.png');
console.log(JSON.stringify({out,times,drawCache:root},null,2));
