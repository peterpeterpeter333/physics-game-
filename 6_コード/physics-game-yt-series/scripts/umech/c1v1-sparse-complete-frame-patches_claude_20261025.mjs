// C-1 copy of axes-sparse-complete-frame-patches-20261025.mjs (Claude, 2026-10-25).
// New task-private CPU composition with the delivered C-1 compositor (complete-frame-v4).
// Never edits a source cache, manuscript, voice or caption.
// Usage: node THIS.mjs manifest.json NEW_CACHE
// manifest: {sourceCache:ABS, frames:[{frame,raw,anchorProjections}]}
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const [manifestArg, outArg] = process.argv.slice(2);
assert(manifestArg && outArg);
const manifestPath=path.resolve(manifestArg), out=path.resolve(outArg);
assert(!fs.existsSync(out) && fs.statSync(path.dirname(out)).isDirectory());
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=read(manifestPath), source=path.resolve(manifest.sourceCache);
assert(source.startsWith('/private/tmp/ys/') && out.startsWith('/private/tmp/ys/'));
assert(source!==out && !out.startsWith(source+'/'));
const id='ys-chain-c1v1', total=10814;
const relative=['plan.json',`${id}.json`,'phrase-times.json','blender/data.json','blender/desk/anchors.json'];
const pins=Object.fromEntries([manifestPath,...relative.map(r=>source+'/'+r)].map(p=>[p,sha(p)]));
const rows=[...manifest.frames].sort((a,b)=>a.frame-b.frame);
assert(rows.length && new Set(rows.map(r=>r.frame)).size===rows.length);
const anchors=read(source+'/blender/desk/anchors.json');
const names=Object.keys(anchors.anchors).sort();
for(const r of rows){
 assert(Number.isInteger(r.frame)&&r.frame>=0&&r.frame<total);
 assert(path.isAbsolute(r.raw)&&fs.statSync(r.raw).isFile());
 if(r.anchorProjections===null)continue; // unchanged frame (pipeline check): original anchors
 assert.deepEqual(Object.keys(r.anchorProjections).sort(),names,'Every original anchor is explicitly updated');
 for(const n of names){const p=r.anchorProjections[n];assert(Array.isArray(p)&&p.length>=3&&p.slice(0,2).every(Number.isFinite));anchors.anchors[n][r.frame]=p;}
}
fs.mkdirSync(out);fs.mkdirSync(out+'/blender/desk',{recursive:true});fs.mkdirSync(out+'/png');
for(const r of relative.filter(r=>r!=='blender/desk/anchors.json'))fs.symlinkSync(fs.realpathSync(source+'/'+r),out+'/'+r);
fs.writeFileSync(out+'/blender/desk/anchors.json',JSON.stringify(anchors),{flag:'wx'});
for(const r of rows)fs.symlinkSync(r.raw,out+'/blender/desk/'+String(r.frame).padStart(5,'0')+'.jpg');
const entry=read(source+'/plan.json').find(c=>c.id===id), timed=read(source+'/'+id+'.json');
assert(entry&&entry.scenes.length===timed.scenes.length);
const scriptKey=c=>JSON.stringify(c.scenes.map(s=>[s.narration,s.utterances]));
assert.equal(scriptKey(entry),scriptKey(timed));
const clip={...timed,...entry,duration:timed.duration,scenes:entry.scenes.map((s,j)=>({...s,start:timed.scenes[j].start,end:timed.scenes[j].end,captions:timed.scenes[j].captions}))};
clip.mediaDirectory=entry.mediaDirectory??'lessons';if(clip.visualPilot)clip.animationFPS=30;
process.env.EM_FILM_CACHE=out;
delete process.env.DESK_ALLOW_MISSING;
const modulePath=path.resolve(path.dirname(new URL(import.meta.url).pathname),'desk-c1v1-complete-frame-v4.mjs');
pins[modulePath]=sha(modulePath);
const {vertFrame}=await import(modulePath);
const patches=[];
for(const r of rows){
 const t=r.frame/30;
 const scene=clip.scenes.find(s=>s.start<=t&&t<s.end)??clip.scenes.at(-1);
 const svg=vertFrame(clip,scene,t);
 assert(svg&&svg.startsWith('<svg')&&svg.includes('width="1080" height="1920"'));
 const png=out+'/png/frame-'+String(r.frame).padStart(5,'0')+'.png';
 await sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).removeAlpha().png().toFile(png);
 patches.push({frame:r.frame,png});
 if(patches.length%100===0)console.log('C-1 patch frames',patches.length,'/',rows.length);
}
for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);
fs.writeFileSync(out+'/patch-map.json',JSON.stringify({frames:patches}),{flag:'wx'});
fs.writeFileSync(out+'/composition-receipt.json',JSON.stringify({episode:'C-1',sourceCache:source,helperSha256:sha(new URL(import.meta.url)),manifestSha256:sha(manifestPath),protectedInputs:pins,count:patches.length,captionsAndVoicesChanged:false},null,1),{flag:'wx'});
console.log(JSON.stringify({patchMap:out+'/patch-map.json',count:patches.length}));
