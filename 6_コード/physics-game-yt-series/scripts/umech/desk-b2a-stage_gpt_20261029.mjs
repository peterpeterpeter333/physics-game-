// Isolated B-2a S0/S2 driver. New outputs only; no shared file rewriting.
// prepare: materialize frozen timing + master rows for Blender.
// compose: exact rendered j -> actual 2D composition -> 10-frame sheets.
// --import this file also routes frame-vert's desk import in memory, B2a only.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import sharp from 'sharp';
import {CACHE,ID,KEY,FPS,prepareTypography,typographyEvidence,deskFrame,chunkTimes,inspectLayouts} from './desk-b2a-overlay_gpt_20261029.mjs';

const W=path.resolve(fileURLToPath(new URL('../..',import.meta.url)));
const R=path.join(W,'outputs/ys-chain-b2a-backup/S0_20261029');
const MASTER=path.join(W,'docs/video-revision-20260924/deep/技術の疑問の鎖_B-2_前編_第1版_ナレーション.md');
const MASTER_SHA='a9900445f07735abeb46f39618f5878a161ddb8e3ecc4ad3d7c231e1b322437e';
const SCRIPT=path.join(W,'docs/video-revision-20260924/ytseries/chain-b-2a_gpt_20261029.mjs');
export const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const outJson=(file,data)=>{
 const content=JSON.stringify(data,null,2)+'\n';fs.mkdirSync(path.dirname(file),{recursive:true});
 if(fs.existsSync(file)){assert.equal(fs.readFileSync(file,'utf8'),content,'Refuse to overwrite different existing derived file: '+file);return file;}
 fs.writeFileSync(file,content,{flag:'wx'});return file;
};
const realFile=file=>{assert.equal(fs.realpathSync(file),path.resolve(file),'No symlinked B2a input');return file;};
function parseMaster(){
 assert.equal(hash(MASTER),MASTER_SHA,'B2a master wording changed');
 const rows=fs.readFileSync(MASTER,'utf8').split('\n').filter(x=>/^\|\s*\d+\s*\|/.test(x)).map(line=>{
  const [row,shot,who,narration,screen]=line.split('|').slice(1,-1).map(x=>x.trim());return {row:Number(row),shot,who,narration,screen};
 });
 assert.deepEqual(rows.map(x=>x.row),Array.from({length:43},(_,i)=>i+1));return rows;
}

export function loadInputs(){
 if(process.env.EM_FILM_CACHE)assert.equal(process.env.EM_FILM_CACHE,CACHE);else process.env.EM_FILM_CACHE=CACHE;
 assert.notEqual(process.env.DESK_ALLOW_MISSING,'1','Nearest-frame substitution is prohibited');
 realFile(CACHE);const master=parseMaster(),plan=json(realFile(path.join(CACHE,'plan.json'))),timed=json(realFile(path.join(CACHE,ID+'.json')));
 const entry=plan.find(c=>c.id===ID);assert.ok(entry);assert.equal(timed.id,ID);assert.equal(entry.scenes.length,timed.scenes.length);
 const audioReport=json(path.join(R,'AUDIO_AND_TIMING_FROZEN.json'));
 assert.ok(audioReport.completed&&audioReport.frozen&&audioReport.id===ID,'Complete S0 voice verification before preparing a frozen scene');
 assert.equal(hash(SCRIPT),audioReport.scriptSha256,'Speech/script snapshot differs from completed S0 verification');
 for(const record of audioReport.immutableMediaFiles)assert.equal(hash(realFile(record.path)),record.sha256,'Frozen speech/timing input changed: '+record.path);
 const clip={...timed,...entry,duration:timed.duration,animationFPS:FPS,scenes:entry.scenes.map((s,i)=>{
  const ts=timed.scenes[i];assert.equal(s.cues.length,ts.captions.length);assert.equal(s.deskFrame,KEY);
  s.cues.forEach((q,k)=>assert.equal(q.subtitle,ts.captions[k].text));
  return {...s,start:ts.start,end:ts.end,captions:ts.captions};
 })};
 const cues=clip.scenes.flatMap((s,i)=>s.cues.map((q,k)=>{
  const cap=s.captions[k],key=q.diagram.replace(/^cb2agpt-/,'');
  assert.equal(q.diagram,'cb2agpt-'+key);assert.ok(/^r\d\d:[a-z]+$/.test(key));
  assert.ok(cap.start>=2&&cap.end>cap.start&&cap.end<=clip.duration);
  return {row:q.masterRow,masterRow:q.masterRow,key,cueKey:q.diagram,diagram:q.diagram,part:q.part,start:cap.start,end:cap.end,subtitle:q.subtitle,sub:q.subtitle,reading:q.reading,kana:q.kana,speaker:q.speaker,face:q.face??null,cap:q.cap,capReading:q.capReading,sceneIndex:i,cueIndex:k};
 }));
 assert.equal(cues.length,70);assert.equal(cues[0].start,2);assert.equal(new Set(cues.map(x=>x.key)).size,70);
 const rows=master.map(r=>{
  const qs=cues.filter(q=>q.row===r.row);
  if(r.row===1){assert.equal(qs.length,0);return {...r,start:0,end:2,speaker:null,cues:[],parts:[]};}
  assert.ok(qs.length);assert.equal(qs.map(q=>q.subtitle).join(''),r.narration,'Voiced text differs from master row '+r.row);
  return {...r,start:qs[0].start,end:qs.at(-1).end,speaker:qs[0].speaker,cues:qs.map(q=>q.key),parts:qs.map(q=>({key:q.key,start:q.start,end:q.end,subtitle:q.subtitle,part:q.part}))};
 });
 const immutableInputHashes={};
 for(const file of [MASTER,SCRIPT,path.join(R,'row-cue-map.json'),...['plan.json',ID+'.json','timed-selection.json','phrase-times.json',ID+'.voice.wav',ID+'.wav','silent-intro-record.json'].map(x=>path.join(CACHE,x))]){
  realFile(file);immutableInputHashes[file]=hash(file);
 }
 const duration=clip.duration,frames=Math.ceil(duration*FPS);
 return {clip,rows,cues,duration,frames,immutableInputHashes};
}
const checkFrozen=inputs=>{for(const [file,sha]of Object.entries(inputs.immutableInputHashes))assert.equal(hash(file),sha,'Input changed during operation: '+file);};

export function prepare(){
 const inputs=loadInputs(),{clip,rows,cues,duration,frames,immutableInputHashes}=inputs;
 const data={episode:'b2a',id:ID,fps:FPS,duration,frames,resolution:[1080,1920],rows,cues,sourceMaster:MASTER,sourceScript:SCRIPT,immutableInputHashes,
  sourceScope:'Frozen master + already generated original speech/timing. No audio or script rewriting.',silentIntroSeconds:2};
 const samples=[];
 for(const row of rows){
  const len=row.end-row.start,points=row.row===1?[.25,1,1.9]:[row.start+Math.min(.2,len*.1),(row.start+row.end)/2,row.end-Math.min(.2,len*.1)];
  points.forEach((t,i)=>{const j=Math.max(0,Math.min(frames-1,Math.round(t*FPS)));samples.push({row:row.row,where:['start','middle','end'][i],j,seconds:j/FPS,requestedSeconds:t});});
 }
 const unique=[...new Map(samples.map(x=>[x.j,x])).values()].sort((a,b)=>a.j-b.j);
 const shotPlan={episode:'b2a',id:ID,fps:FPS,duration,frames,nativeResolution:[1080,1920],sampledFrames:unique.length,stills:unique,
  rows:rows.map(r=>({row:r.row,start:r.start,end:r.end,shot:r.shot,screen:r.screen,narration:r.narration,cues:r.cues,stills:samples.filter(x=>x.row===r.row)})),
  noNearestFrameSubstitution:true,immutableInputHashes,anchorFormat:'{anchors:{name:Array(frames) of [pixelX,pixelY,visible]}}',
  optionalLabelAnchors:['label.north','label.south','label.australia','label.london','label.zinc','label.cardboard','label.copper']};
 outJson(path.join(CACHE,'blender/b2a-scene-data.json'),data);
 outJson(path.join(CACHE,'shot-plan.json'),shotPlan);
 outJson(path.join(CACHE,'row-to-time.json'),Object.fromEntries(rows.map(r=>[r.row,{start:r.start,end:r.end,cues:r.cues}])));
 checkFrozen(inputs);console.log(JSON.stringify({phase:'prepare',id:ID,rows:rows.length,cues:cues.length,duration,frames,stills:unique.length,sceneData:path.join(CACHE,'blender/b2a-scene-data.json'),shotPlan:path.join(CACHE,'shot-plan.json')}));
 return {data,shotPlan,inputs};
}

function arg(name,fallback){const at=process.argv.indexOf(name);return at>=0?process.argv[at+1]:fallback;}
function samplesFromManifest(manifest){
 let records=Array.isArray(manifest)?manifest:manifest.stills??manifest.renderedFrames??(Array.isArray(manifest.frames)?manifest.frames:manifest.frameIndices);
 assert.ok(Array.isArray(records)&&records.length,'Actual render manifest needs explicit frame indices');
 records=records.map(record=>typeof record==='number'?{j:record}:record);
 const out=records.map(record=>{
  const j=record.j??record.frame??record.frameIndex;assert.ok(Number.isInteger(j),'Native manifest frame j must be an integer');return {...record,j,seconds:j/FPS};
 });
 assert.equal(new Set(out.map(x=>x.j)).size,out.length,'Duplicate native frame index in render manifest');return out.sort((a,b)=>a.j-b.j);
}

export async function compose({manifestFile=path.join(CACHE,'storyboard/render-manifest.json'),output=path.join(CACHE,'storyboard/composed-v1'),rows=null}={}){
 const inputs=loadInputs();checkFrozen(inputs);await prepareTypography(inputs.clip);
 const manifestSha256=hash(realFile(manifestFile)),sourceManifest=json(manifestFile),allRecords=samplesFromManifest(sourceManifest),records=rows?allRecords.filter(r=>rows.includes(r.row)):allRecords,anchorsFile=path.join(CACHE,'blender/desk/anchors.json');
 assert.ok(records.length,'No exact-frame records match selected rows');
 realFile(anchorsFile);const anchorsSha256=hash(anchorsFile),anchors=json(anchorsFile);assert.ok(anchors.anchors);
 for(const record of records){
  assert.ok(record.j>=0&&record.j<inputs.frames);const f=path.join(CACHE,'blender/desk',String(record.j).padStart(5,'0')+'.jpg');realFile(f);
  for(const name of Object.keys(anchors.anchors))assert.equal(anchors.anchors[name].length,inputs.frames,'Sparse anchors still need exact full-frame index slots: '+name);
 }
 assert.ok(!fs.existsSync(output),'Use a fresh versioned composed output directory, not overwrite: '+output);
 fs.mkdirSync(path.join(output,'frames'),{recursive:true});const review=[];
 for(const record of records){
  const t=record.j/FPS,scene=inputs.clip.scenes.findLast(s=>s.start<=t)??inputs.clip.scenes[0],audit=[];
  const source=path.join(CACHE,'blender/desk',String(record.j).padStart(5,'0')+'.jpg'),sourceSha256=hash(source);
  const svg=deskFrame(inputs.clip,scene,t,{audit});
  const metadata=await sharp(source).metadata();
  assert.equal(metadata.width/metadata.height,1080/1920,'Native aspect ratio changed');
  const file=path.join(output,'frames',String(record.j).padStart(5,'0')+'.jpg');
  await sharp(Buffer.from(svg)).resize(540,960).jpeg({quality:92,chromaSubsampling:'4:4:4'}).toFile(file);
  const row=inputs.rows.find(r=>t>=r.start&&t<=r.end)??inputs.rows.findLast(r=>r.start<=t);
  assert.equal(hash(source),sourceSha256,'Native frame changed during its exact composition: '+source);
  review.push({...record,row:row?.row,source,sourceSha256,nativeResolution:[metadata.width,metadata.height],output:file,outputSha256:hash(file),audit});
 }
 const pages=[];
 for(let from=0;from<review.length;from+=10){
  const group=review.slice(from,from+10),tiles=[];
  for(let i=0;i<group.length;i++){
   const r=group[i],x=16+(i%5)*276,y=16+Math.floor(i/5)*530;
   const thumb=await sharp(r.output).resize(260,462).jpeg({quality:91}).toBuffer();
   const label=`row ${r.row??'-'} | j ${r.j} | ${r.seconds.toFixed(2)} s`;
   const note=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="44"><rect width="260" height="44" fill="#f8f6f0"/><text x="7" y="28" font-family="sans-serif" font-size="19" fill="#111">${label}</text></svg>`);
   tiles.push({input:thumb,left:x,top:y},{input:note,left:x,top:y+465});
  }
  const file=path.join(output,`page-${String(pages.length+1).padStart(2,'0')}.jpg`);
  await sharp({create:{width:1396,height:1076,channels:3,background:'#ded8ce'}}).composite(tiles).jpeg({quality:93}).toFile(file);pages.push(file);
 }
 assert.equal(hash(manifestFile),manifestSha256,'Native manifest changed during composition');assert.equal(hash(anchorsFile),anchorsSha256,'Native anchors changed during composition');
 const result={episode:'B-2前編',id:ID,stage:'S2 actual exact-frame 2D compositions',nativeFrameManifest:manifestFile,nativeFrameManifestSha256:manifestSha256,anchorsFile,anchorsSha256,
  frames:review,frameCount:review.length,pages,sourceRecordCount:allRecords.length,selectedRows:rows,immutableInputHashes:inputs.immutableInputHashes,
  safeRectangle:{xMin:40,xMax:1040,yMin:110,yMax:1600},
  scope:'Actual SVG measured native-font label/caption geometry at every composed sample; not OCR of Blender or a full movie/ear review',
  allRecordedTextBoxesSafe:review.every(f=>f.audit.every(b=>b.type==='anchorLabel'?b.rect.x>=40&&b.rect.x+b.rect.width<=1040&&b.rect.y>=110&&b.rect.y+b.rect.height<=1600:b.type==='caption'?b.rect.x>=40&&b.rect.x+b.rect.width<=1040&&b.rect.y>=110&&b.rect.y+b.rect.height<=1600:true)),
  layoutEvidence:typographyEvidence()};
 checkFrozen(inputs);outJson(path.join(output,'composition-audit.json'),result);
 console.log(JSON.stringify({phase:'compose',frames:review.length,pages:pages.length,output,audit:path.join(output,'composition-audit.json'),allRecordedTextBoxesSafe:result.allRecordedTextBoxesSafe}));return result;
}

// The original renderer is never altered on disk. Non-B2a desk scenes delegate
// to its original function inside the dedicated wrapper.
let hooksInstalled=false;
export function installB2AHooks(){
 if(hooksInstalled)return;hooksInstalled=true;
 const frameVert=new URL('./frame-vert.mjs',import.meta.url).href,wrapper=new URL('./desk-b2a-overlay_gpt_20261029.mjs',import.meta.url).href;
 registerHooks({resolve(specifier,context,nextResolve){
  if(context.parentURL?.split('?')[0]===frameVert&&specifier==='./desk-frame.mjs')return {url:wrapper,shortCircuit:true};
  return nextResolve(specifier,context);
 }});
}
installB2AHooks();

const isDirect=process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url;
if(!isDirect)await prepareTypography(loadInputs().clip);
if(isDirect){
 const command=process.argv[2];
 if(command==='prepare')prepare();
 else if(command==='compose')await compose({manifestFile:arg('--manifest',path.join(CACHE,'storyboard/render-manifest.json')),output:arg('--out',path.join(CACHE,'storyboard/composed-v1')),rows:arg('--rows',null)?.split(',').map(Number)??null});
 else if(command==='inspect'){const i=loadInputs();await prepareTypography(i.clip);console.log(JSON.stringify({id:ID,rows:i.rows.length,cues:i.cues.length,duration:i.duration,frames:i.frames,layoutAudit:inspectLayouts(i.clip),measuredTextCount:typographyEvidence().measuredTextCount},null,2));}
 else throw Error('Usage: node desk-b2a-stage_gpt_20261029.mjs prepare | inspect | compose [--manifest FILE] [--out FRESH_DIR]');
}
