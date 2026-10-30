// Isolated A S3 inputs; read-only, exact-frame, immutable supplied captions/voice.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const CACHE='/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028',ID='ys-chain-d1a',FPS=30;
export const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
export function realInput(file){
 const p=path.resolve(file);assert.ok(p.startsWith(CACHE+path.sep),'Use only the isolated A S3 cache');
 assert.equal(fs.realpathSync(p),p,'No symlinked S3 inputs');
 for(let q=p;q!==CACHE;q=path.dirname(q))assert.equal(fs.lstatSync(q).isSymbolicLink(),false,'No symlink in S3 input path');
 return p;
}
export function inputs({rawDir=path.join(CACHE,'blender/desk'),anchorsFile=path.join(rawDir,'anchors.json'),rawExt='jpg',sparse=false}={}){
 assert.equal(process.env.EM_FILM_CACHE??CACHE,CACHE);assert.equal(fs.realpathSync(CACHE),CACHE);
 assert.notEqual(process.env.DESK_ALLOW_MISSING,'1','Never substitute a nearby frame');process.env.EM_FILM_CACHE=CACHE;delete process.env.DESK_ALLOW_MISSING;
 const read=rel=>JSON.parse(fs.readFileSync(realInput(path.join(CACHE,rel)),'utf8'));
 const plan=read('plan.json'),timed=read(ID+'.json'),data=read('blender/data.json');read('phrase-times.json');
 const assets=new URL('../blender/desk_assets/d1a/',import.meta.url);
 for(const f of ['plan.json',ID+'.json','phrase-times.json'])assert.equal(hash(path.join(CACHE,f)),hash(new URL(f,assets)),'Supplied text/timing changed: '+f);
 const entry=plan.find(e=>e.id===ID);assert.ok(entry);assert.equal(timed.id,ID);assert.equal(data.episode,'d1a');assert.equal(data.cues.length,54);assert.equal(new Set(data.cues.map(c=>c.row)).size,40);
 const cues=entry.scenes.flatMap(s=>s.cues);assert.deepEqual(cues.map(c=>c.diagram),data.cues.map(c=>'cd1a-'+c.key));
 const clip={...timed,...entry,duration:timed.duration,scenes:entry.scenes.map((s,j)=>({...s,start:timed.scenes[j].start,end:timed.scenes[j].end,captions:timed.scenes[j].captions})),animationFPS:FPS,mediaDirectory:entry.mediaDirectory??'lessons'};
 rawDir=realInput(rawDir);anchorsFile=realInput(anchorsFile);assert.ok(['jpg','png'].includes(rawExt));
 const nf=Math.ceil(clip.duration*FPS),anchors=JSON.parse(fs.readFileSync(anchorsFile,'utf8'));
 if(!sparse){assert.equal(anchors.frames,nf);assert.equal(anchors.fps,FPS);assert.ok(anchors.anchors);for(const p of Object.values(anchors.anchors))assert.equal(p.length,nf);}
 process.env.D1A_S3_RAW_DIR=rawDir;process.env.D1A_S3_ANCHORS_FILE=anchorsFile;process.env.D1A_S3_RAW_EXT=rawExt;
 return {clip,data,nf,anchors,rawDir,anchorsFile,rawExt,sparse,read,suppliedVoice:new URL(ID+'.wav',assets)};
}
export function exactFrame(stage,j){
 assert.ok(Number.isInteger(j)&&j>=0&&j<stage.nf);const file=realInput(path.join(stage.rawDir,String(j).padStart(5,'0')+'.'+stage.rawExt));
 const points=stage.sparse?stage.anchors[String(j)]:Object.fromEntries(Object.entries(stage.anchors.anchors).map(([name,v])=>[name,v[j]]));assert.ok(points&&Object.keys(points).length,'Missing exact logical anchors at '+j);
 for(const p of Object.values(points))assert.ok(Array.isArray(p)&&p.length===3&&p.every(v=>typeof v==='boolean'||(typeof v==='number'&&Number.isFinite(v))),'Invalid logical anchor at '+j);
 return file;
}
