// Isolated previews and byte-for-byte legacy dispatch regression.
import fs from 'node:fs';
import sharp from 'sharp';
import {vertFrame} from './frame-vert.mjs';
const [mode='new',phase='before']=process.argv.slice(2);
const ROOT='/private/tmp/ys/ys-chain-1-2v1-render';
const OUT=ROOT+'/gate-1-2v1';fs.mkdirSync(OUT,{recursive:true});
function timed(base,a){return {...base,duration:a.duration,scenes:base.scenes.map((s,i)=>({...s,start:a.scenes[i].start,end:a.scenes[i].end,captions:a.scenes[i].captions}))};}
if(mode==='old'){
 const id=process.env.LEGACY_ID??'ys-chain-1-1v6';let c;
 if(id==='ys-deep-12'){
  c=structuredClone((await import('../../docs/video-revision-20260924/ytseries/sp-deep-12.mjs')).clips[0]);
  let t=0;for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{let start=t;t+=9+(q.pause??0);return {start,end:t,text:q.subtitle}});s.end=t;}c.duration=t;
 }else{
  const cache='/private/tmp/ys/'+id;process.env.EM_FILM_CACHE=cache;
  c=timed(JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],JSON.parse(fs.readFileSync(cache+'/'+id+'.json')));
 }
 const dest=OUT+'/regression-'+phase;fs.mkdirSync(dest,{recursive:true});let n=0;
 for(const s of c.scenes)for(let i=0;i<s.cues.length;i++){
  const cap=s.captions[i],t=cap.start+.95*(cap.end-cap.start);
  await sharp(Buffer.from(vertFrame(c,s,t))).png().toFile(`${dest}/${id}-${String(n++).padStart(3,'0')}.png`);
 }
 console.log(id,phase,n,'legacy frames');
}else{
 // Never overwrite the running production render or its complete anchors.
 const staging=ROOT+'/preview-cache-1-2v1';process.env.EM_FILM_CACHE=staging;
 const source=process.env.DESK_PREVIEW_DIR??ROOT+'/blender/preview-1_2v1',desk=staging+'/blender/desk';fs.mkdirSync(desk,{recursive:true});
 for(const f of ['plan.json','phrase-times.json','ys-chain-1-2v1.json'])fs.copyFileSync(ROOT+'/'+f,staging+'/'+f);
 fs.copyFileSync(ROOT+'/blender/data.json',staging+'/blender/data.json');
 for(const f of fs.readdirSync(source))if(f.endsWith('.jpg')||f==='anchors.json')fs.copyFileSync(source+'/'+f,desk+'/'+f);
 const c=timed(JSON.parse(fs.readFileSync(ROOT+'/plan.json'))[0],JSON.parse(fs.readFileSync(ROOT+'/ys-chain-1-2v1.json')));
 const times=process.env.PREVIEW_TIMES?process.env.PREVIEW_TIMES.split(',').map(Number):mode==='cues'?JSON.parse(fs.readFileSync(ROOT+'/blender/data.json')).episode12.cues.map(q=>Math.round((q.end-.25)*100)/100):[.7,27.9,61.9,94.7,107.5,128,179,261.8,272.3,306,345,390.5];let images=[];
 const prefix=mode==='cues'?'cue':mode==='retouch'?'retouch':'preview';
 for(let i=0;i<times.length;i++){
  let t=times[i],j=Math.round(t*30);
  // Python's round uses ties-to-even. Use the actual rendered frame timestamp.
  if(!fs.existsSync(`${desk}/${String(j).padStart(5,'0')}.jpg`)){
   const jj=[j-1,j+1].find(x=>fs.existsSync(`${desk}/${String(x).padStart(5,'0')}.jpg`));
   if(jj===undefined)throw Error('Missing preview '+t);j=jj;
  }
  t=j/30;const s=c.scenes.find(s=>s.start<=t&&t<=s.end)??c.scenes.at(-1);
  const svg=vertFrame(c,s,t);fs.writeFileSync(`${OUT}/${prefix}-${i+1}.svg`,svg);
  const p=`${OUT}/${prefix}-${String(i+1).padStart(2,'0')}.png`;await sharp(Buffer.from(svg)).png().toFile(p);
  images.push(await sharp(p).resize(270,480).toBuffer());
 }
 for(let off=0;off<images.length;off+=12){let page=images.slice(off,off+12);
  await sharp({create:{width:1080,height:480*Math.ceil(page.length/4),channels:3,background:'#000'}}).composite(page.map((input,i)=>({input,left:i%4*270,top:Math.floor(i/4)*480}))).png().toFile(OUT+(mode==='cues'?`/cues-sheet-${off/12+1}.png`:mode==='retouch'?'/retouch-scenes-1-2v1.png':'/12-scenes-1-2v1.png'));
 }
 console.log(times.length,'preview scenes',OUT);
}
