// D1a S4 isolated native inputs. Shared scripts/assets are read-only.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const CACHE='/private/tmp/ys/ys-chain-d1a_s4_gpt_20261028',ID='ys-chain-d1a',FPS=30,NF=11618;
export const PUMP_CAPTION_LAYOUT=Object.freeze({cues:['guericke:build','guericke:pull','guericke:push'],
 mode:'left-lower',x:280,fontSize:48,lineHeight:62,twoLineBaselines:[1350,1412],oneLineBaseline:1381,
 speakerCenterX:280,speakerFontSize:38,speakerBaseline:1280,speakerNameTextOffsetX:12,
 captionTextTimingChanged:false,lineReflowed:false});
export const LOWER_CAPTION_LAYOUT=Object.freeze({cues:['gin:drum','size:2t'],
 mode:'below-subject',x:540,fontSize:66,lineHeight:84,twoLineBaselines:[1495,1579],oneLineBaseline:1537,
 speakerCenterX:540,speakerFontSize:38,speakerBaseline:1425,speakerNameTextOffsetX:12,
 captionTextTimingChanged:false,lineReflowed:false});
export const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const ASSETS=new URL('../blender/desk_assets/d1a/',import.meta.url);
export function realInput(file){
 const p=path.resolve(file);assert.ok(p.startsWith(CACHE+path.sep),'Use the isolated D1a S4 cache');
 assert.equal(fs.realpathSync(p),p,'No symlinked S4 input');
 for(let q=p;q!==CACHE;q=path.dirname(q))assert.equal(fs.lstatSync(q).isSymbolicLink(),false,'No S4 input path symlink');
 return p;
}
export function inputs({rawDir=path.join(CACHE,'blender/desk'),anchorsFile=path.join(rawDir,'anchors.json'),rawExt='jpg',sparse=false}={}){
 assert.equal(process.env.EM_FILM_CACHE,CACHE,'Set EM_FILM_CACHE explicitly to the S4 cache');
 assert.equal(fs.realpathSync(CACHE),CACHE);assert.equal(fs.lstatSync(CACHE).isSymbolicLink(),false);
 assert.notEqual(process.env.DESK_ALLOW_MISSING,'1','Never substitute a nearby frame');
 const read=rel=>JSON.parse(fs.readFileSync(realInput(path.join(CACHE,rel)),'utf8'));
 const immutableHashes={};
 for(const rel of ['plan.json',ID+'.json','phrase-times.json','timed-selection.json','prosody.txt']){
  const file=realInput(path.join(CACHE,rel));immutableHashes[rel]=hash(file);
  assert.equal(immutableHashes[rel],hash(new URL(rel,ASSETS)),'Supplied text/timing changed: '+rel);
 }
 const suppliedVoice=new URL(ID+'.wav',ASSETS);
 for(const rel of [ID+'.voice.wav',ID+'.wav']){
  immutableHashes[rel]=hash(realInput(path.join(CACHE,rel)));
  assert.equal(immutableHashes[rel],hash(suppliedVoice),'Supplied speech changed: '+rel);
 }
 assert.equal(immutableHashes['plan.json'],'b7da529070c86e45ce91247197000d68632acaa3d7a42a48d45d8e1cb6d9a646');
 assert.equal(immutableHashes[ID+'.voice.wav'],'e551ec0088c453f177d13274876a13701060be68614571369db3011629109e96');
 const plan=read('plan.json'),timed=read(ID+'.json'),data=read('blender/data.json'),entry=plan.find(c=>c.id===ID);
 assert.ok(entry);assert.equal(timed.id,ID);assert.equal(data.episode,'d1a');
 assert.equal(data.cues.length,54);assert.equal(new Set(data.cues.map(c=>c.row)).size,40);
 assert.deepEqual(entry.scenes.flatMap(s=>s.cues).map(q=>q.diagram),data.cues.map(c=>'cd1a-'+c.key));
 const clip={...timed,...entry,duration:timed.duration,scenes:entry.scenes.map((s,j)=>({...s,start:timed.scenes[j].start,end:timed.scenes[j].end,captions:timed.scenes[j].captions})),animationFPS:FPS,mediaDirectory:entry.mediaDirectory??'lessons'};
 const nf=Math.ceil(clip.duration*FPS);assert.equal(nf,NF);
 for(const rel of ['word-events-actual_s3_20261028.json','blender/data.json'])immutableHashes[rel]=hash(realInput(path.join(CACHE,rel)));
 rawDir=realInput(rawDir);anchorsFile=realInput(anchorsFile);assert.ok(['jpg','png'].includes(rawExt));
 const anchors=JSON.parse(fs.readFileSync(anchorsFile,'utf8'));
 let meta=null;
 if(!sparse){
  meta=read('blender/desk/meta.json');
  assert.equal(meta.stage,'S4');assert.equal(meta.frames,nf);assert.equal(meta.fps,FPS);
  assert.deepEqual(meta.resolution,[1080,1920]);assert.equal(meta.samples,16);
  assert.ok(typeof meta.finished==='string'&&Number.isFinite(Date.parse(meta.finished)));
  assert.ok(!meta.previewOnly&&!meta.sampleOnly&&!anchors.previewOnly&&!anchors.sampleOnly);
  assert.equal(anchors.key,meta.key);assert.equal(anchors.frames,nf);assert.equal(anchors.fps,FPS);
  assert.ok(anchors.anchors);for(const values of Object.values(anchors.anchors))assert.equal(values.length,nf);
 }
 // Sparse preview may contain False at unrendered indices. exactFrame() still
 // requires the requested actual image and actual anchor record, never nearest.
 process.env.D1A_S4_RAW_DIR=rawDir;process.env.D1A_S4_ANCHORS_FILE=anchorsFile;process.env.D1A_S4_RAW_EXT=rawExt;
 return {clip,data,nf,anchors,meta,rawDir,anchorsFile,rawExt,sparse,read,suppliedVoice,immutableHashes};
}
export function exactFrame(stage,j){
 assert.ok(Number.isInteger(j)&&j>=0&&j<stage.nf);
 const file=realInput(path.join(stage.rawDir,String(j).padStart(5,'0')+'.'+stage.rawExt));
 const points=stage.anchors.anchors?Object.fromEntries(Object.entries(stage.anchors.anchors).map(([name,v])=>[name,v[j]])):stage.anchors[String(j)];
 assert.ok(points&&Object.keys(points).length,'Missing exact-frame S4 anchor record: '+j);
 for(const p of Object.values(points))assert.ok(Array.isArray(p)&&p.length===3&&p.every(v=>typeof v==='boolean'||(typeof v==='number'&&Number.isFinite(v))),'Unrendered/invalid S4 anchors at '+j);
 return file;
}
