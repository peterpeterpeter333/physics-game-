// E1 exact-frame contact sheets. Review status is deliberately not auto-approved.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const ROOT=fileURLToPath(new URL('../../',import.meta.url)),source='/private/tmp/ys/ys-chain-e1v1';
const mode=process.argv[2]??'preview',tag=process.env.E1_PASS_TAG??'e1v1-r2',cache=mode==='preview'?source+'/preview-cache-'+tag:'/private/tmp/ys/ys-chain-e1v1-render';
const D=JSON.parse(fs.readFileSync(source+'/blender/data.json')),out=source+'/review-'+tag+(mode==='preview'?'-'+(process.env.E1_REVIEW_SCOPE??'allcue'):'-1sec');
fs.mkdirSync(out,{recursive:true});
const head=(s,w=360)=>Buffer.from(`<svg width="${w}" height="28"><rect width="${w}" height="28" fill="white"/><text x="7" y="20" font-family="Hiragino Sans" font-size="16" fill="#302316">${s}</text></svg>`);
let frames=[];
if(mode==='preview'){
 const freeze=JSON.parse(fs.readFileSync(source+'/e1v1-r2-source-freeze.json'));process.env.EM_FILM_CACHE=cache;process.env.DESK_ALLOW_MISSING='1';
 const {vertFrame}=await import('./desk-axes-frame.mjs');
 const plan=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(cache+'/ys-chain-e1v1.json'));
 const clip={...plan,duration:timed.duration,scenes:plan.scenes.map((s,i)=>({...s,...{start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}}))};
 const src=fs.readFileSync(ROOT+'scripts/umech/desk-quality-gate.mjs','utf8'),defs=src.slice(src.indexOf('const AFF='),src.indexOf('async function checkSvg()')).replace('export function svgItems','function svgItems');
 const {refine,svgItems}=new Function('createRequire','ROOT','path',defs+'\nreturn {refine,svgItems};')(createRequire,ROOT,path),errors=[];
 const times=process.env.E1_TIMES?process.env.E1_TIMES.split(',').map(Number):freeze.preview.times;
 for(const t0 of times){
  const j=Math.round(t0*30),t=j/30;
  if(!fs.existsSync(cache+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg'))throw Error('Missing exact E1 review background '+j);
  const s=clip.scenes.find(s=>s.start<=t&&s.end>=t)??clip.scenes.at(-1),c=D.cues.findLast(c=>c.start<=t)??D.cues[0],svg=vertFrame(clip,s,t),file=out+'/e1v1-'+String(j).padStart(5,'0')+'.jpg';
  if(/NaN|undefined|Infinity/.test(svg.replace(/<image[^>]+>/g,'')))throw Error('Invalid E1 geometry '+t);
  fs.writeFileSync(file.replace('.jpg','.svg'),svg);await sharp(Buffer.from(svg)).jpeg({quality:95}).toFile(file);
  for(const it of await refine(svgItems(svg))){
   if(it.op<.05)continue;const [x0,y0,x1,y1]=it.box,tol=it.kind==='rect'?16:6;
   if(x0<40-tol||x1>1040+tol||y0<110-tol||y1>1600+tol)errors.push({t,kind:'outside',text:it.s??'rect',box:it.box});
   if(it.kind==='text'&&it.size<35.99&&!/^[\s、。，．・→←↑↓⇒\-–—…:：|｜\/／]+$/.test(it.s))errors.push({t,kind:'small',text:it.s,size:it.size});
   if(it.card&&Math.max(it.card[0]-x0,x1-it.card[2])>2)errors.push({t,kind:'card',text:it.s,box:it.box,card:it.card});
  }
  frames.push({t,cue:c.key,row:c.row,file});
 }
 fs.writeFileSync(out+'/e1v1-svg-actual-preflight.json',JSON.stringify({frames:frames.length,errors},null,2));
 if(errors.length)process.exitCode=1;
}else{
 const mp4=cache+'/out/ys-chain-e1v1.mp4';if(!fs.existsSync(mp4))throw Error('Final E1 video absent');
 const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1',dir=out+'/frames';fs.mkdirSync(dir,{recursive:true});
 if(!fs.readdirSync(dir).some(f=>f.endsWith('.jpg'))){const r=spawnSync(ff,['-v','error','-i',mp4,'-vf','select=not(mod(n\\,30)),scale=360:640','-vsync','0','-q:v','2',dir+'/e1v1-frame-%04d.jpg'],{encoding:'utf8',maxBuffer:1e7});if(r.status)throw Error(r.stderr);}
 const files=fs.readdirSync(dir).filter(f=>f.endsWith('.jpg')).sort();if(files.length<Math.floor(D.duration))throw Error('Incomplete E1 one-second review');
 frames=files.map((file,t)=>{const c=D.cues.findLast(c=>c.start<=t)??D.cues[0];return {t,cue:c.key,row:c.row,file:dir+'/'+file};});
}
const pages=[];
for(let start=0;start<frames.length;start+=10){
 const composite=[];
 for(const [i,f]of frames.slice(start,start+10).entries()){
  const tile=await sharp({create:{width:360,height:668,channels:3,background:'#fff'}}).composite([{input:head(f.t.toFixed(2)+'秒　行'+f.row+' '+f.cue),left:0,top:0},{input:await sharp(f.file).resize(360,640).toBuffer(),left:0,top:28}]).jpeg({quality:92}).toBuffer();composite.push({input:tile,left:i%5*360,top:Math.floor(i/5)*668});
 }
 const file=out+'/e1v1-sheet-'+String(Math.floor(start/10)+1).padStart(2,'0')+'.jpg';await sharp({create:{width:1800,height:1336,channels:3,background:'#fff'}}).composite(composite).jpeg({quality:93}).toFile(file);pages.push(file);
}
fs.writeFileSync(out+'/e1v1-review-manifest.json',JSON.stringify({mode,cache,frames,pages,review:'not yet visually reviewed'},null,2));
console.log(JSON.stringify({out,frames:frames.length,pages:pages.length,review:'not yet visually reviewed'},null,2));
