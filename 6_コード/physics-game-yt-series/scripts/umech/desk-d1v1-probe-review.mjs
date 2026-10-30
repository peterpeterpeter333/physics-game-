// D-1 only: contact sheets of real integer-second preview frames with final 2D.
// This is not the final encoded-video inspection or a substitute quality gate.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const source=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1v1-render';
const frames=process.env.D1_PROBE_DIR??source+'/blender/probe1s-d1v1-r5';
const out=process.env.D1_PROBE_REVIEW_OUT??source+'/probe-review-d1v1-r5';
if(fs.existsSync(out))throw Error('Existing D1 probe review is preserved; choose a fresh output');
const data=JSON.parse(fs.readFileSync(source+'/blender/data.json'));
const expected=Math.ceil(data.duration),integerFiles=Array.from({length:expected},(_,t)=>String(t*30).padStart(5,'0')+'.jpg');
for(const name of integerFiles)if(!fs.existsSync(frames+'/'+name))throw Error('D1 integer-second frame missing '+name);
const files=process.env.D1_PROBE_INCLUDE_EXTRAS==='1'?fs.readdirSync(frames).filter(f=>/^\d+\.jpg$/.test(f)).sort():integerFiles;
const cache=out+'/composition-cache-d1v1';fs.mkdirSync(cache+'/blender',{recursive:true});
const link=(src,dst)=>fs.symlinkSync(src,dst);
for(const name of ['plan.json','ys-chain-d1v1.json','phrase-times.json'])link(source+'/'+name,cache+'/'+name);
link(source+'/blender/data.json',cache+'/blender/data.json');link(frames,cache+'/blender/desk');
process.env.EM_FILM_CACHE=cache;process.env.DESK_ALLOW_MISSING='1';
const {vertFrame}=await import('./desk-axes-frame.mjs');
const plan=JSON.parse(fs.readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(fs.readFileSync(cache+'/ys-chain-d1v1.json'));
const clip={...plan,duration:timed.duration,scenes:plan.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const pages=[],manifest=[];
for(let start=0;start<files.length;start+=10){
 const tiles=[];
 for(let offset=0;offset<10&&start+offset<files.length;offset++){
  const index=start+offset,t=Number(files[index].slice(0,-4))/30,cue=data.cues.find(c=>c.start<=t&&t<c.end)??data.cues.findLast(c=>c.start<=t)??data.cues[0];
  const scene=clip.scenes.find(s=>s.start<=t&&t<s.end)??clip.scenes.at(-1),svg=vertFrame(clip,scene,t);
  if(/NaN|undefined|Infinity/.test(svg))throw Error('Invalid D1 probe SVG at '+t);
  const full=await sharp(Buffer.from(svg)).resize(360,640).jpeg({quality:92}).toBuffer();
  const heading=Buffer.from(`<svg width="360" height="24"><rect width="360" height="24" fill="white"/><text x="8" y="18" font-family="Hiragino Sans" font-size="16" fill="#241c15">D-1 ${t.toFixed(2)}秒 ${cue.key}</text></svg>`);
  const tile=await sharp({create:{width:360,height:664,channels:3,background:'#fff'}}).composite([{input:heading,left:0,top:0},{input:full,left:0,top:24}]).jpeg({quality:92}).toBuffer();
  tiles.push({input:tile,left:offset%5*360,top:Math.floor(offset/5)*664});
  manifest.push({time:t,cue:cue.key,row:cue.row,source:frames+'/'+files[index],sha256:createHash('sha256').update(fs.readFileSync(frames+'/'+files[index])).digest('hex')});
 }
 const name='d1v1-probe-sheet-'+String(start/10+1).padStart(2,'0')+'.jpg';
 await sharp({create:{width:1800,height:1328,channels:3,background:'#fff'}}).composite(tiles).jpeg({quality:92}).toFile(out+'/'+name);pages.push(name);
}
const record={episode:'D-1',status:'real 3D preview plus final 2D; visual review pending; not final MP4 gate',frames:files.length,integerSeconds:expected,source:frames,pages,manifest};
fs.writeFileSync(out+'/d1v1-probe-review.json',JSON.stringify(record,null,1));
console.log(JSON.stringify({out,frames:files.length,integerSeconds:expected,pages:pages.length,status:record.status},null,1));
