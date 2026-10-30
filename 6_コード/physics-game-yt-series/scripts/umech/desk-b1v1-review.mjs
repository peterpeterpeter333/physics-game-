// Review only actual rendered frames; never nearest-frame fallback.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const source='/private/tmp/ys/ys-chain-b1v1';
const raw=process.env.B1_RAW??source+'/blender/preview';
const times=process.env.B1_TIMES?JSON.parse(process.env.B1_TIMES):JSON.parse(fs.readFileSync(source+'/blender/preview-times-b1v1.json')).times;
const out=process.env.B1_REVIEW_OUT??source+'/review-preview-b1v1';
const cache=out+'/cache';fs.mkdirSync(cache+'/blender',{recursive:true});fs.mkdirSync(out+'/frames',{recursive:true});fs.mkdirSync(out+'/sheets',{recursive:true});
for(const name of ['plan.json','ys-chain-b1v1.json','phrase-times.json'])if(!fs.existsSync(cache+'/'+name))fs.symlinkSync(source+'/'+name,cache+'/'+name);
for(const [src,dest]of[[source+'/blender/data.json','data.json'],[raw,'desk']])if(!fs.existsSync(cache+'/blender/'+dest))fs.symlinkSync(src,cache+'/blender/'+dest);
process.env.EM_FILM_CACHE=cache;
const {vertFrame}=await import('./desk-axes-frame.mjs');
const errors=[];let refine=null,svgItems=null;
if(process.env.B1_AUDIT_SVG==='1'){
 const ROOT=fileURLToPath(new URL('../../',import.meta.url));
 const original=fs.readFileSync(ROOT+'scripts/umech/desk-quality-gate.mjs','utf8');
 const defs=original.slice(original.indexOf('const AFF='),original.indexOf('async function checkSvg()')).replace('export function svgItems','function svgItems');
 ({refine,svgItems}=new Function('createRequire','ROOT','path',defs+'\nreturn {refine,svgItems};')(createRequire,ROOT,path));
}
const plan=JSON.parse(fs.readFileSync(source+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(source+'/ys-chain-b1v1.json'));
const clip={...plan,duration:timed.duration,scenes:plan.scenes.map((s,i)=>({...s,...timed.scenes[i],cues:s.cues}))};
const cards=[];
for(const t of times){
 const j=Math.round(t*30),f=raw+'/'+String(j).padStart(5,'0')+'.jpg';if(!fs.existsSync(f))throw Error('Missing actual image '+f);
 const scene=clip.scenes.find(s=>t>=s.start&&t<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,scene,t);
 if(/NaN|undefined|Infinity/.test(svg))throw Error('Invalid SVG '+t);
 if(refine)for(const it of await refine(svgItems(svg))){
  if(it.op<.05)continue;const [x0,y0,x1,y1]=it.box,tol=it.kind==='rect'?16:6;
  if(x0<40-tol||x1>1040+tol||y0<110-tol||y1>1600+tol)errors.push({t,kind:'outside',text:it.s??'rect',box:it.box});
  if(it.kind==='text'&&it.size<35.99&&!/^[\s、。，．・→←↑↓⇒\-–—…:：|｜\/／]+$/.test(it.s))errors.push({t,kind:'small',text:it.s,size:it.size});
  if(it.card&&Math.max(it.card[0]-x0,x1-it.card[2])>2)errors.push({t,kind:'card',text:it.s,box:it.box,card:it.card});
 }
 const image=await sharp(Buffer.from(svg)).png().toBuffer();fs.writeFileSync(out+'/frames/'+String(j).padStart(5,'0')+'.png',image);
 const title=Buffer.from(`<svg width="360" height="36"><rect width="360" height="36" fill="white"/><text x="10" y="26" font-size="22">B-1 ${t.toFixed(2)} s / ${j}</text></svg>`);
 cards.push(await sharp({create:{width:360,height:676,channels:3,background:'#fff'}}).composite([{input:await sharp(image).resize(360,640).toBuffer(),left:0,top:36},{input:title,left:0,top:0}]).jpeg({quality:93}).toBuffer());
}
const sheets=[];
for(let i=0;i<cards.length;i+=6){const f=out+'/sheets/sheet-'+String(i/6+1).padStart(2,'0')+'.jpg';await sharp({create:{width:1080,height:1352,channels:3,background:'#fff'}}).composite(cards.slice(i,i+6).map((input,k)=>({input,left:k%3*360,top:Math.floor(k/3)*676}))).jpeg({quality:93}).toFile(f);sheets.push(f);}
fs.writeFileSync(out+'/index.json',JSON.stringify({raw,times,count:cards.length,sheets},null,1));console.log(JSON.stringify({count:cards.length,out,sheets}));
if(refine){fs.writeFileSync(out+'/actual-svg-inspection.json',JSON.stringify({scope:'original refine/svgItems checks on actual rendered preflight frames, not final MP4',frames:cards.length,errors},null,1));if(errors.length)process.exitCode=1;}
