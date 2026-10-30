// New, task-private CPU composition. Never edits a source cache or manuscript.
// Usage: node THIS.mjs manifest.json NEW_CACHE
// manifest: {episode:'B-1'|'D-1', sourceCache:ABS, frames:[{frame,raw,anchorProjections}]}
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import sharp from 'sharp';

const [manifestArg, outArg] = process.argv.slice(2);
assert(manifestArg && outArg);
const manifestPath=path.resolve(manifestArg), out=path.resolve(outArg);
assert(!fs.existsSync(out) && fs.statSync(path.dirname(out)).isDirectory());
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=read(manifestPath), source=path.resolve(manifest.sourceCache);
assert(['B-1','D-1'].includes(manifest.episode));
assert(source.startsWith('/private/tmp/ys/') && out.startsWith('/private/tmp/ys/'));
assert(source!==out && !out.startsWith(source+'/'));
const id=manifest.episode==='B-1'?'ys-chain-b1v1':'ys-chain-d1v1';
const total=id==='ys-chain-b1v1'?10700:12162;
const relative=['plan.json',`${id}.json`,'phrase-times.json','blender/data.json','blender/desk/anchors.json'];
const pins=Object.fromEntries([manifestPath,...relative.map(r=>source+'/'+r)].map(p=>[p,sha(p)]));
assert(Array.isArray(manifest.frames) && manifest.frames.length);
const rows=[...manifest.frames].sort((a,b)=>a.frame-b.frame);
assert.equal(new Set(rows.map(r=>r.frame)).size,rows.length);
const anchors=read(source+'/blender/desk/anchors.json');
const names=Object.keys(anchors.anchors).sort();
for(const r of rows){
 assert(Number.isInteger(r.frame)&&r.frame>=0&&r.frame<total);
 assert(path.isAbsolute(r.raw)&&fs.statSync(r.raw).isFile());
 pins[r.raw]=sha(r.raw);
 assert.deepEqual(Object.keys(r.anchorProjections).sort(),names,'Every original anchor is explicitly updated');
 for(const n of names){
  const point=r.anchorProjections[n];
  assert(Array.isArray(point)&&point.length>=3&&point.slice(0,2).every(Number.isFinite));
  assert([0,1,false,true].includes(point[2]),'Original projector visibility is 0/1');
  assert.equal(anchors.anchors[n].length>=total,true);
  anchors.anchors[n][r.frame]=point;
 }
}
fs.mkdirSync(out);
fs.mkdirSync(out+'/blender/desk',{recursive:true});
fs.mkdirSync(out+'/png');
for(const r of relative.filter(r=>r!=='blender/desk/anchors.json'))fs.symlinkSync(source+'/'+r,out+'/'+r);
fs.writeFileSync(out+'/blender/desk/anchors.json',JSON.stringify(anchors),{flag:'wx'});
for(const r of rows)fs.symlinkSync(r.raw,out+'/blender/desk/'+String(r.frame).padStart(5,'0')+'.jpg');
const entry=read(source+'/plan.json').find(c=>c.id===id), timed=read(source+'/'+id+'.json');
assert(entry&&entry.scenes.length===timed.scenes.length);
const scriptKey=c=>JSON.stringify(c.scenes.map(s=>[s.narration,s.utterances]));
assert.equal(scriptKey(entry),scriptKey(timed));
const clip={...timed,...entry,duration:timed.duration,scenes:entry.scenes.map((s,j)=>({...s,start:timed.scenes[j].start,end:timed.scenes[j].end,captions:timed.scenes[j].captions}))};
process.env.EM_FILM_CACHE=out;
delete process.env.DESK_ALLOW_MISSING;
const moduleName=id==='ys-chain-b1v1'?'desk-b1v1-final3-frame.mjs':'desk-d1v1-final-layout-frame-20261025.mjs';
const modulePath=path.resolve(path.dirname(new URL(import.meta.url).pathname),moduleName);
pins[modulePath]=sha(modulePath);
const {vertFrame}=await import(pathToFileURL(modulePath).href);
const patches=[];
for(const r of rows){
 const t=r.frame/30;
 const scene=clip.scenes.find(s=>s.start<=t&&t<s.end)??clip.scenes.at(-1);
 assert(scene.start<=t&&t<=clip.duration);
 const svg=vertFrame(clip,scene,t);
 assert(svg.startsWith('<svg') && svg.includes('width="1080" height="1920"'));
 const png=out+'/png/frame-'+String(r.frame).padStart(5,'0')+'.png';
 await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).removeAlpha().png().toFile(png);
 const meta=await sharp(png).metadata();
 assert.equal(meta.width,1080);assert.equal(meta.height,1920);assert.equal(meta.channels,3);
 patches.push({frame:r.frame,png});
 if(patches.length%30===0)console.log('Complete original-caption patch frames',patches.length,'/',rows.length);
}
for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);
fs.writeFileSync(out+'/patch-map.json',JSON.stringify({frames:patches}),{flag:'wx'});
fs.writeFileSync(out+'/composition-receipt.json',JSON.stringify({episode:manifest.episode,sourceCache:source,helperSha256:sha(new URL(import.meta.url)),manifestSha256:sha(manifestPath),protectedInputs:pins,frames:patches.map(r=>({...r,sha256:sha(r.png)})),captionsAndVoicesChanged:false,outputOnlyUsesExactRequestedFrames:true,visualReviewPerformed:false},null,1),{flag:'wx'});
console.log(JSON.stringify({patchMap:out+'/patch-map.json',count:patches.length}));
