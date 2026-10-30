// Isolated S4 helper (2026-10-27); original S3 files remain unchanged.
// Read-only S4 inputs, shared by stills and draft export. No nearest-frame fallback.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const CACHE='/private/tmp/ys/ys-chain-d1b_s4_gpt_20261027',ID='ys-chain-d1b';
export const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
export function inputs({rawDir=path.join(CACHE,'blender/desk'),anchorsFile=path.join(rawDir,'anchors.json'),rawExt='jpg'}={}){
 assert.equal(process.env.EM_FILM_CACHE??CACHE,CACHE,'S4 cache must be isolated');
 assert.notEqual(process.env.DESK_ALLOW_MISSING,'1','Nearest-frame fallback is forbidden');
 process.env.EM_FILM_CACHE=CACHE;delete process.env.DESK_ALLOW_MISSING;
 assert.equal(fs.lstatSync(CACHE).isSymbolicLink(),false);
 const read=f=>{const p=path.join(CACHE,f);assert.equal(fs.lstatSync(p).isSymbolicLink(),false,'Use real S4 input copies: '+f);return JSON.parse(fs.readFileSync(p,'utf8'));};
 const plan=read('plan.json'),timed=read(ID+'.json'),entry=plan.find(p=>p.id===ID),data=read('blender/data.json');
 read('phrase-times.json');assert.ok(entry);assert.equal(data.episode,'d1b');assert.equal(data.cues.length,63);
 const assets=new URL('../blender/desk_assets/d1b/',import.meta.url);
 for(const f of ['plan.json',ID+'.json','phrase-times.json']){
  assert.equal(hash(path.join(CACHE,f)),hash(new URL(f,assets)),'Supplied script/caption/timing changed: '+f);
 }
 const cues=entry.scenes.flatMap(s=>s.cues);
 assert.equal(cues.length,63);assert.equal(new Set(data.cues.map(c=>c.row)).size,48);
 assert.deepEqual(cues.map(q=>q.diagram),data.cues.map(c=>'cd1b-'+c.key));
 const clip={...timed,...entry,duration:timed.duration,scenes:entry.scenes.map((s,j)=>({...s,start:timed.scenes[j].start,end:timed.scenes[j].end,captions:timed.scenes[j].captions})),animationFPS:30,mediaDirectory:entry.mediaDirectory??'lessons'};
 rawDir=fs.realpathSync(rawDir);anchorsFile=fs.realpathSync(anchorsFile);
 assert.ok(rawDir.startsWith(CACHE+path.sep)&&anchorsFile.startsWith(CACHE+path.sep),'Preview inputs must remain in the new S4 cache');
 assert.ok(['jpg','png'].includes(rawExt));assert.equal(fs.lstatSync(anchorsFile).isSymbolicLink(),false);
 process.env.D1B_S4_RAW_DIR=rawDir;process.env.D1B_S4_ANCHORS_FILE=anchorsFile;process.env.D1B_S4_RAW_EXT=rawExt;
 const nf=Math.ceil(timed.duration*30),anchors=JSON.parse(fs.readFileSync(anchorsFile,'utf8'));
 assert.equal(anchors.frames,nf);assert.equal(anchors.fps,30);
 assert.ok(Object.keys(anchors.anchors??{}).length>0);
 for(const name of ['leather','pistonwater','pistonvalve','footvalve','pumpwater','pumpbelow','pumpabove','pumpoutside','pumpinlet','jackrod','fujiLow','fujiHigh','britain'])assert.ok(anchors.anchors[name],'Missing new S4 anchor: '+name);
 for(const points of Object.values(anchors.anchors))assert.equal(points.length,nf);
 return {clip,data,nf,anchors,read,rawDir,rawExt,suppliedVoice:new URL(ID+'.wav',assets)};
}
export function exactFrame(stage,j){
 assert.ok(Number.isInteger(j)&&j>=0&&j<stage.nf);
 const raw=path.join(stage.rawDir,String(j).padStart(5,'0')+'.'+stage.rawExt);
 assert.ok(fs.existsSync(raw),'Missing exact S4 frame '+raw);assert.equal(fs.lstatSync(raw).isSymbolicLink(),false);
 for(const points of Object.values(stage.anchors.anchors)){
  const p=points[j];assert.ok(Array.isArray(p)&&p.length===3&&p.every(v=>typeof v==='boolean'||(typeof v==='number'&&Number.isFinite(v))),'Missing/invalid logical1080 anchor at '+j);
 }
 return raw;
}

