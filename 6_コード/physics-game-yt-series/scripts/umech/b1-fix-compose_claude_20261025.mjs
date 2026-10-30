// Claude 2026-10-25: B-1 local scene fixes -- build a NEW complete cache and the complete-frame patch PNGs.
// usage: node b1-fix-compose_claude_20261025.mjs PLANROOT NEWCACHE [--only-frames a,b,c]
// Base = the delivered composition cache (optics-v2-width410). Nothing in it is modified: the new cache links to it
// and only replaces the changed frames' raw images, anchors, camera poses and camera-motion summary.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import sharp from 'sharp';

const [planRoot,outArg,...rest]=process.argv.slice(2);
const only=rest[0]==='--only-frames'?new Set(rest[1].split(',').map(Number)):null;
const BASE='/private/tmp/ys/ys-chain-b1v1-optics-v2-width410-composition-20261025';
const ID='ys-chain-b1v1',TOTAL=10700;
const out=path.resolve(outArg);
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const plan=read(path.join(planRoot,'plan.json')).frames;
const byFrame=new Map(plan.map(p=>[p.frame,p]));
const proj={};
for(const s of ['garlic','powder','section','book']){const f=path.join(planRoot,`proj-${s}.json`);if(fs.existsSync(f))proj[s]=read(f);}

if(!fs.existsSync(out)){
 fs.mkdirSync(out);fs.mkdirSync(out+'/blender/desk',{recursive:true});
 for(const r of ['plan.json',`${ID}.json`,'phrase-times.json',`${ID}.wav`,`${ID}.voice.wav`,'problem'])fs.symlinkSync(fs.realpathSync(BASE+'/'+r),out+'/'+r);
 fs.symlinkSync(fs.realpathSync(BASE+'/blender/data.json'),out+'/blender/data.json');
 for(const r of ['meta.json','original-meta.json'])fs.symlinkSync(fs.realpathSync(BASE+'/blender/desk/'+r),out+'/blender/desk/'+r);
 const anchors=read(BASE+'/blender/desk/anchors.json');
 const poses=read(BASE+'/blender/delivered-camera-poses.json');
 const custom={};
 for(let j=0;j<TOTAL;j++){
  const name=String(j).padStart(5,'0')+'.jpg',p=byFrame.get(j);
  const src=p?p.raw:fs.realpathSync(BASE+'/blender/desk/'+name);
  assert(fs.statSync(src).isFile(),src);
  fs.symlinkSync(src,out+'/blender/desk/'+name);
  if(!p)continue;
  poses.poses[j]=p.pose;
  if(p.scene==='hold8058'){for(const n of Object.keys(anchors.anchors))anchors.anchors[n][j]=anchors.anchors[n][8058];continue;}
  const row=proj[p.scene][String(p.rep)];assert(row,'missing projection '+j);
  for(const n of Object.keys(anchors.anchors)){assert(row[n],n);anchors.anchors[n][j]=row[n];}
  if(p.scene==='section'||p.scene==='powder'){
   const c={mode:p.scene};for(const[k,v]of Object.entries(row))if(k.startsWith('c_'))c[k]=v;
   if(p.scene==='section')c.c_islandMid??=row.c_islandMid;
   custom[j]=c;
  }
 }
 // The section's custom-anchor visibility of the old 'pin' is switched off so the old free-floating prediction
 // cards (anchored to it in desk-b1v1-overlay.mjs) are not drawn; the new labels replace them.
 for(const [j,c] of Object.entries(custom))if(c.mode==='section'){const a=anchors.anchors.pin[j];anchors.anchors.pin[j]=[a[0],a[1],0];}
 fs.writeFileSync(out+'/blender/desk/anchors.json',JSON.stringify(anchors));
 fs.writeFileSync(out+'/claude-anchors.json',JSON.stringify(custom));
 fs.writeFileSync(out+'/blender/delivered-camera-poses.json',JSON.stringify(poses));
 const ps=poses.poses;let moving=0;for(let j=1;j<TOTAL;j++)if(JSON.stringify(ps[j])!==JSON.stringify(ps[j-1]))moving++;
 const before=read(BASE+'/blender/camera-motion.json');
 fs.writeFileSync(out+'/blender/camera-motion.json',JSON.stringify({frames:TOTAL,moving_frames:moving,moving_ratio:moving/TOTAL,top_ratio:0,
  method:'Claude 2026-10-25: delivered poses with the four locally re-framed scenes (rows 9-13, 22-23, 26/28/36-37, 35); pose list comparison',
  previousMotion:before},null,1));
 console.log('cache built; moving frames',moving,(moving/TOTAL*100).toFixed(2)+'%');
}
// ---------- compose complete frames ----------
process.env.EM_FILM_CACHE=out;
delete process.env.DESK_ALLOW_MISSING;
const entry=read(out+'/plan.json').find(c=>c.id===ID),timed=read(out+'/'+ID+'.json');
assert(entry&&entry.scenes.length===timed.scenes.length);
const clip={...timed,...entry,duration:timed.duration,scenes:entry.scenes.map((s,j)=>({...s,start:timed.scenes[j].start,end:timed.scenes[j].end,captions:timed.scenes[j].captions}))};
const here=path.dirname(new URL(import.meta.url).pathname);
const {vertFrame}=await import(pathToFileURL(path.join(here,'desk-b1v1-frame_claude_20261025.mjs')).href);
fs.mkdirSync(out+'/png',{recursive:true});
const frames=plan.map(p=>p.frame).filter(j=>!only||only.has(j));
const patches=[];let k=0;
for(const j of frames){
 const t=j/30,scene=clip.scenes.find(s=>s.start<=t&&t<s.end)??clip.scenes.at(-1);
 const svg=vertFrame(clip,scene,t);
 assert(svg.startsWith('<svg')&&svg.includes('width="1080" height="1920"'));
 const png=out+'/png/frame-'+String(j).padStart(5,'0')+'.png';
 await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).removeAlpha().png().toFile(png);
 patches.push({frame:j,png});
 if(++k%100===0)console.log('composed',k,'/',frames.length);
}
if(!only)fs.writeFileSync(out+'/patch-map.json',JSON.stringify({frames:patches}));
console.log(JSON.stringify({count:patches.length,cache:out}));
