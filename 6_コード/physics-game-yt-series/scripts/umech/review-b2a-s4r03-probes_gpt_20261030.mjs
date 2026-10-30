// Review-only stills. Route exact missing j to its explicitly named S3 probe,
// never install low-resolution probes into the native production cache.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {loadInputs} from './desk-b2a-s4r03-stage-cacheexact_gpt_20261030.mjs';
import {prepareTypography,deskFrame,CACHE} from './desk-b2a-s4r03-overlay_gpt_20261030.mjs';
const probe=path.resolve(process.argv[2]);assert.ok(probe.endsWith('probe-result.json'));
const data=JSON.parse(fs.readFileSync(probe));assert.ok(data.completed);
const out=path.join(path.dirname(probe),'字幕札つき確認');assert.ok(!fs.existsSync(out));fs.mkdirSync(out);
const {clip}=loadInputs();await prepareTypography(clip);
const af=path.join(CACHE,'blender/desk/anchors.json');
const anchors=JSON.parse(fs.readFileSync(af));
for(const [name,time,row] of [['09_name',77,9],['23_face',235.5,23]]){
 const j=Math.round(time*30);
 data.records.push({name,time:j/30,j,row,anchors:{},file:path.join(CACHE,'blender/desk',String(j).padStart(5,'0')+'.jpg')});
}
const sources=new Map();
for(const r of data.records){
 sources.set(path.join(CACHE,'blender/desk',String(r.j).padStart(5,'0')+'.jpg'),r.file);
 for(const [key,val] of Object.entries(r.anchors??{})){
  anchors.anchors[key]??=Array(14846).fill(null);anchors.anchors[key][r.j]=val;
 }
}
const oldRead=fs.readFileSync,oldExists=fs.existsSync;
fs.readFileSync=(f,...args)=>String(f)===af?Buffer.from(JSON.stringify(anchors)):oldRead(sources.get(String(f))??f,...args);
fs.existsSync=f=>sources.has(String(f))||oldExists(f);
const records=[];
try{
 for(const r of data.records){
  const scene=clip.scenes.findLast(s=>s.start<=r.time);assert.ok(scene);
  const audit=[],svg=deskFrame(clip,scene,r.time,{audit});
  const file=path.join(out,r.name+'.jpg');
  await sharp(Buffer.from(svg)).resize(540,960).jpeg({quality:94,chromaSubsampling:'4:4:4'}).toFile(file);
  records.push({...r,composed:file,typography:audit});
 }
}finally{fs.readFileSync=oldRead;fs.existsSync=oldExists;}
const pages=[];
for(let i=0;i<records.length;i+=6){
 const group=records.slice(i,i+6),layers=[];
 for(let k=0;k<group.length;k++){
  const x=12+(k%3)*372,y=12+Math.floor(k/3)*675;
  const thumb=await sharp(group[k].composed).resize(360,640).toBuffer();
  const title=Buffer.from(`<svg width="360" height="24"><rect width="360" height="24" fill="#faf7ee"/><text x="6" y="18" font-size="16" font-family="sans-serif">${group[k].name} ${group[k].time.toFixed(3)}s</text></svg>`);
  layers.push({input:thumb,left:x,top:y},{input:title,left:x,top:y+642});
 }
 const file=path.join(out,`page-${String(pages.length+1).padStart(2,'0')}.jpg`);
 await sharp({create:{width:1128,height:1362,channels:3,background:'#d8d0c3'}}).composite(layers).jpeg({quality:94}).toFile(file);pages.push(file);
}
fs.writeFileSync(path.join(out,'composition-audit.json'),JSON.stringify({stage:'S3 review only',nativeProductionCacheWritten:false,captionWordsAndTimesChanged:false,records,pages},null,2),{flag:'wx'});
console.log(JSON.stringify({out,pages},null,2));
