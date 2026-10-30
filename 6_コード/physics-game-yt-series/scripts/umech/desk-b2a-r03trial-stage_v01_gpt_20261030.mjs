// Isolated B-2a S3 driver after Claude S2 revisions. Prior S2 and frozen media are read-only.
// prepare: materialize frozen timing + master rows for Blender.
// compose: exact rendered j -> actual 2D composition -> 10-frame sheets.
// --import this file also routes frame-vert's desk import in memory, B2a only.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import {voiceMap,normKana} from './yt1-chain-00bx-common.mjs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import sharp from 'sharp';
import {CACHE,SOURCE_CACHE,ID,KEY,FPS,prepareTypography,typographyEvidence,deskFrame,chunkTimes,inspectLayouts} from './desk-b2a-r03trial-overlay_v01_gpt_20261030.mjs';
export {CACHE,SOURCE_CACHE,ID,KEY,FPS};

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

const FROZEN_NAMES=['plan.json',ID+'.json','timed-selection.json','phrase-times.json',ID+'.voice.wav',ID+'.wav','silent-intro-record.json'];
function initializeFrozenCache(){
 const original=json(path.join(R,'AUDIO_AND_TIMING_FROZEN.json'));
 assert.ok(original.completed&&original.frozen&&original.id===ID);
 for(const item of original.immutableMediaFiles)assert.equal(hash(realFile(item.path)),item.sha256,'Frozen original changed before cache preparation');
 fs.mkdirSync(CACHE,{recursive:true});realFile(CACHE);realFile(SOURCE_CACHE);
 for(const name of FROZEN_NAMES){
  const source=realFile(path.join(SOURCE_CACHE,name)),target=path.join(CACHE,name);
  if(!fs.existsSync(target))fs.copyFileSync(source,target,fs.constants.COPYFILE_EXCL);
  assert.equal(hash(realFile(target)),hash(source),'New S3 timing/audio copy differs from original: '+target);
 }
}
export function loadInputs({initialize=false}={}){
 if(initialize)initializeFrozenCache();
 if(process.env.EM_FILM_CACHE)assert.equal(process.env.EM_FILM_CACHE,CACHE);else process.env.EM_FILM_CACHE=CACHE;
 assert.notEqual(process.env.DESK_ALLOW_MISSING,'1','Nearest-frame substitution is prohibited');
 realFile(CACHE);const master=parseMaster(),plan=json(realFile(path.join(CACHE,'plan.json'))),timed=json(realFile(path.join(CACHE,ID+'.json')));
 const entry=plan.find(c=>c.id===ID);assert.ok(entry);assert.equal(timed.id,ID);assert.equal(entry.scenes.length,timed.scenes.length);
 const audioReport=json(path.join(R,'AUDIO_AND_TIMING_FROZEN.json'));
 assert.ok(audioReport.completed&&audioReport.frozen&&audioReport.id===ID,'Complete S0 voice verification before preparing a frozen scene');
 assert.equal(hash(SCRIPT),audioReport.scriptSha256,'Speech/script snapshot differs from completed S0 verification');
 for(const record of audioReport.immutableMediaFiles)assert.equal(hash(realFile(record.path)),record.sha256,'Frozen speech/timing input changed: '+record.path);
 const clip={...timed,...entry,duration:timed.duration,animationFPS:FPS,scenes:entry.scenes.map((s,i)=>{
  const ts=timed.scenes[i];assert.equal(s.cues.length,ts.captions.length);assert.equal(s.deskFrame,'b2a_gpt_20261029');
  s.cues.forEach((q,k)=>assert.equal(q.subtitle,ts.captions[k].text));
  return {...s,deskFrame:KEY,start:ts.start,end:ts.end,captions:ts.captions};
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
 for(const file of [MASTER,SCRIPT,path.join(R,'row-cue-map.json'),...FROZEN_NAMES.map(x=>path.join(CACHE,x)),...FROZEN_NAMES.map(x=>path.join(SOURCE_CACHE,x))]){
  realFile(file);immutableInputHashes[file]=hash(file);
 }
 const duration=clip.duration,frames=Math.ceil(duration*FPS);
 return {clip,rows,cues,duration,frames,immutableInputHashes};
}
const checkFrozen=inputs=>{for(const [file,sha]of Object.entries(inputs.immutableInputHashes))assert.equal(hash(file),sha,'Input changed during operation: '+file);};

function primaryShotPlan(cues){
 const requests=[
  [2,'ホーイジシン','b2a_terrella_south_compass',.25],
  [3,null,'b2a_terrella_south_compass',.25],
  [4,'エスキョク','b2a_terrella',.45],
  [5,'エヌキョク','b2a_terrella',.45],
  [6,'ウエオムキマス','b2a_terrella_south_compass',.25],
  [7,'ウエニカタムク','b2a_terrella_south_compass',.25],
  [8,null,'b2a_compass_comparison',.70],
  [10,'シンケイ','b2a_frog_leg',.55],
  [10,'シンチュウ','b2a_frog_leg',.55],
  [10,'フレアワセル','b2a_frog_rod_contact',.50],
  [10,'ピクット','b2a_frog_leg',.55],
  [11,'フレアワセル','b2a_frog_rod_contact',.50],
  [19,'メスガフレテイル','b2a_scalpel_nerve_contact',.50],
  [19,'ピクットケッタ','b2a_generator,b2a_frog,b2a_assistant',.55],
  [20,'アシワウゴク','b2a_frog_leg',.55],
  [21,null,'b2a_frog_leg',.55],
  [25,'ツヨクウゴイタ','b2a_frog_same,b2a_frog',.70],
  [29,'アツガミ','b2a_unit',.50],
  [30,'ユビ','b2a_unit',.50],
  [31,'ナンジュックミモカサネマシタ','b2a_pile',.50],
  [32,'ビリット','b2a_pile,b2a_volta',.50],
  [33,'ハガヒライタ','b2a_electroscope_gold_leaf_pair',.30],
  [38,'テガミデ','b2a_map',.50],
  // Claude 2026-10-30 §6 replaces the simultaneous pair by sequential shots.
  // Its explicit glass+hand target is 50%; the second shot retains a >=50%
  // pile rather than falsely claiming an off-screen glass rod is a primary.
  [39,'イチドデオワリデシタ','b2a_glass',.50],
  [39,'サワッテイルアイダ','b2a_pile',.50],
  [41,null,'b2a_pile_one_unit_join',.50],
  [43,'ピクットサセタ','b2a_frog_leg',.45]
 ];
 return requests.map(([row,word,primary,minWidth])=>{
  const options=cues.filter(q=>q.row===row),q=word?options.find(q=>voiceMap({cue:q,t:0,dur:q.end-q.start}).s.includes(normKana(word))):options[0];
  assert.ok(q,'Missing exact spoken shot-plan word: '+row+'/'+word);
  return {cue:q.cueKey,...(word?{word,occ:0}:{}),...(primary?{primary}:{}),minWidth,masterRow:row,scope:primary?'Named native primary at the exact supplied spoken word':'Native primary width only; individual object size still needs image review'};
 });
}

export function prepare(){
 const inputs=loadInputs({initialize:true}),{clip,rows,cues,duration,frames,immutableInputHashes}=inputs;
 const data={episode:'b2a',id:ID,renderKey:KEY,sourceCache:SOURCE_CACHE,fps:FPS,duration,frames,resolution:[1080,1920],rows,cues,sourceMaster:MASTER,sourceScript:SCRIPT,immutableInputHashes,
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
  optionalLabelAnchors:['label.north','label.south','label.n','label.s','label.australia','label.london','label.zinc','label.cardboard','label.copper','label.italy','label.nerve','label.brass','label.iron','label.same','label.different','label.capacitor']};
 outJson(path.join(CACHE,'blender/b2a-scene-data.json'),data);
 outJson(path.join(CACHE,'blender/storyboard-plan.json'),shotPlan);
 const gatePlan=primaryShotPlan(cues),gateFile=path.join(CACHE,'shot-plan.json');
 // Preserve the first derived S3 storyboard plan, created before the gate's
 // array-only contract was confirmed. The immutable supplied plan is unrelated.
 if(fs.existsSync(gateFile)&&!Array.isArray(json(gateFile))){
  assert.equal(fs.readFileSync(gateFile,'utf8'),JSON.stringify(shotPlan,null,2)+'\n');
  const backup=path.join(CACHE,'blender/storyboard-plan.before-gate-split.json');
  assert.ok(!fs.existsSync(backup));fs.renameSync(gateFile,backup);
 }
 outJson(gateFile,gatePlan);
 outJson(path.join(CACHE,'row-to-time.json'),Object.fromEntries(rows.map(r=>[r.row,{start:r.start,end:r.end,cues:r.cues}])));
 checkFrozen(inputs);console.log(JSON.stringify({phase:'prepare',id:ID,rows:rows.length,cues:cues.length,duration,frames,stills:unique.length,sceneData:path.join(CACHE,'blender/b2a-scene-data.json'),shotPlan:path.join(CACHE,'shot-plan.json')}));
 return {data,shotPlan:gatePlan,storyboardPlan:shotPlan,inputs};
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

export async function compose({manifestFile=path.join(CACHE,'storyboard/render-manifest.json'),output=path.join(CACHE,'storyboard/revised-s2-v1'),rows=null}={}){
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


// Export-only S4 additions. loadInputs/prepare/compose above remain unchanged.
const FF=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const REUSE_RECEIPT=path.join(W,'outputs/ys-chain-b2a-backup/S4修正03_20261030/S4r03trial_v01-frozen-input-and-audio-reuse_20261030.json');
const jpg=j=>path.join(CACHE,'blender/desk',String(j).padStart(5,'0')+'.jpg');
const frameDigest=(digest,j,sha)=>digest.update(String(j)+'\0'+sha+'\n');
function frozenMix({mixFile,mixRecord}={}){
 const receiptFile=realFile(REUSE_RECEIPT),receiptSha256=hash(receiptFile),receipt=json(receiptFile);
 assert.equal(receipt.cache,CACHE);assert.equal(receipt.id,ID);assert.equal(receipt.counts.voicedCues,70);assert.equal(receipt.counts.captionChunks,317);
 mixFile=realFile(path.resolve(mixFile??receipt.mix.file));mixRecord=realFile(path.resolve(mixRecord??receipt.mix.record));
 const record=json(mixRecord),mixSha256=hash(mixFile),voiceSha256=hash(realFile(path.join(CACHE,ID+'.voice.wav')));
 assert.equal(mixSha256,receipt.mix.sha256,'Only the accepted unmodified audio-v4 mix may be exported');
 assert.equal(record.mixSha256,mixSha256);assert.equal(record.voiceSha256??record.sourceVoiceSha256,voiceSha256);
 assert.equal(receipt.mix.voiceSha256,voiceSha256);assert.equal(hash(path.join(SOURCE_CACHE,ID+'.voice.wav')),voiceSha256);
 assert.equal(receipt.mix.voiceBgmDifferenceMedianDb,22.398616534108726);assert.equal(receipt.mix.voiceBgmDifferenceP10Db,10.102094715491893);
 return {mixFile,mixRecord,mixSha256,mixRecordSha256:hash(mixRecord),voiceSha256,receiptFile,receiptSha256,voiceBgmDifferenceMedianDb:receipt.mix.voiceBgmDifferenceMedianDb,voiceBgmDifferenceP10Db:receipt.mix.voiceBgmDifferenceP10Db};
}
function checkMix(mix){
 for(const [file,sha]of [[mix.mixFile,mix.mixSha256],[mix.mixRecord,mix.mixRecordSha256],[mix.receiptFile,mix.receiptSha256],[path.join(CACHE,ID+'.voice.wav'),mix.voiceSha256]])assert.equal(hash(realFile(file)),sha,'Frozen audio/provenance changed: '+file);
}
function svgAt(inputs,j){
 const t=j/FPS,scene=inputs.clip.scenes.findLast(x=>x.start<=t)??inputs.clip.scenes[0],svg=deskFrame(inputs.clip,scene,t);
 const geometry=svg.replace(/<image\b[^>]*>/g,'');assert.ok(svg&&!/NaN|undefined|Infinity/.test(geometry),'Invalid composed SVG geometry at exact frame '+j);
 return svg;
}
function newMoviePaths(output){
 output=path.resolve(output);assert.ok(output.startsWith(CACHE+path.sep)&&output.endsWith('.mp4'),'Movie must be a fresh MP4 inside the isolated C5 cache');
 const partial=output.slice(0,-4)+'.partial.mp4',record=output.slice(0,-4)+'.export.json';
 for(const f of [output,partial,record])assert.ok(!fs.existsSync(f),'Preserve prior output: '+f);
 fs.mkdirSync(path.dirname(output),{recursive:true});return {output,partial,record};
}
async function validateNativeRange(fromFrame,toFrameExclusive,width,height){
 const aggregate=createHash('sha256');
 for(let j=fromFrame;j<toFrameExclusive;j++){
  const source=realFile(jpg(j)),m=await sharp(source).metadata();
  assert.equal(m.width,width,'Wrong native width at j '+j+'; upscaling is prohibited');assert.equal(m.height,height,'Wrong native height at j '+j);
  frameDigest(aggregate,j,hash(source));
 }
 return aggregate.digest('hex');
}
function decodeVideo(file,frames){
 const decoded=spawnSync(FF,['-hide_banner','-nostats','-v','error','-xerror','-err_detect','explode','-progress','pipe:1','-i',file,'-map','0:v:0','-an','-f','null','-'],{encoding:'utf8',maxBuffer:4*1024*1024});
 assert.equal(decoded.status,0,'Encoded all-frame strict video decode failed: '+(decoded.stderr??'').slice(-2000));
 const decodedFrames=+[...(decoded.stdout??'').matchAll(/^frame=(\d+)$/gm)].at(-1)?.[1];assert.equal(decodedFrames,frames,'Encoded video lost exact native frames');return decodedFrames;
}
async function encodeRange({inputs,mix,fromFrame,toFrameExclusive,width,height,output,nativeAggregate,stage}){
 const target=newMoviePaths(output),count=toFrameExclusive-fromFrame,duration=count/FPS,started=Date.now(),during=createHash('sha256');
 // All clocks are absolute frame/sample clocks. 24 kHz / 30 fps = exactly
 // 800 audio samples per frame; no speech regeneration, speed, or remixing.
 const audioFilter=`atrim=start_sample=${fromFrame*800}:end_sample=${toFrameExclusive*800},asetpts=PTS-STARTPTS,apad=whole_dur=${duration}`;
 const argv=['-n','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size',`${width}x${height}`,'-framerate',String(FPS),'-i','pipe:0','-i',mix.mixFile,'-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r',String(FPS),'-frames:v',String(count),'-af',audioFilter,'-c:a','aac','-b:a','128k','-movflags','+faststart',target.partial];
 const child=spawn(FF,argv,{stdio:['pipe','inherit','inherit']}),finished=once(child,'close'),pending=new Map();let stdinError=null;
 let lastRaster=null,svgRasterizations=0,identicalSvgReuses=0,svgCacheProof=null;
 child.stdin.on('error',error=>{stdinError=error;});
 function rasterSvg(svg){
  svgRasterizations++;
  const job=sharp(Buffer.from(svg)).flatten({background:'#2a2018'}).resize(width,height,{fit:'fill'}).removeAlpha().raw().toBuffer();job.catch(()=>{});return job;
 }
 function raster(j){
  const source=realFile(jpg(j)),sourceSha=hash(source),svg=svgAt(inputs,j);assert.equal(hash(source),sourceSha,'Native JPEG changed while embedding j '+j);frameDigest(during,j,sourceSha);
  // Full export uses native 1080x1920 JPEGs; motion checks deliberately use
  // native 540x960 JPEGs. This resize only rasterizes 1080-unit overlay SVG.
  // Reuse only when the ENTIRE composed SVG is byte-for-byte identical.
  // Keep all exact-j source hashes and every ffmpeg frame write above/below.
  // This does not interpolate, omit frames or alter any render setting.
  if(lastRaster?.svg===svg){
   identicalSvgReuses++;const cached=lastRaster.promise;
   if(svgCacheProof===null){
    const proof=svgCacheProof={j,fullRgbBufferExactlyEqual:false};
    return Promise.all([cached,rasterSvg(svg)]).then(([old,fresh])=>{
     assert.ok(old.equals(fresh),'Identical-SVG cache proof failed');
     proof.fullRgbBufferExactlyEqual=true;return old;
    });
   }
   return cached;
  }
  const job=rasterSvg(svg);lastRaster={svg,promise:job};return job;
 }
 try{
  for(let j=fromFrame;j<Math.min(fromFrame+2,toFrameExclusive);j++)pending.set(j,raster(j));
  for(let j=fromFrame;j<toFrameExclusive;j++){
   const rgb=await pending.get(j);pending.delete(j);assert.equal(rgb.length,width*height*3);
   if(j+2<toFrameExclusive)pending.set(j+2,raster(j+2));
   if(stdinError)throw stdinError;if(!child.stdin.write(rgb))await once(child.stdin,'drain');
   if((j-fromFrame)%600===0)console.log('B2a '+stage+' exact composition',j-fromFrame,'/',count,'absolute j',j);
  }
  child.stdin.end();const [code]=await finished;assert.equal(code,0,'Encoding failed');
  assert.equal(during.digest('hex'),nativeAggregate,'Native sources changed after the pre-export scan');checkFrozen(inputs);checkMix(mix);
  fs.renameSync(target.partial,target.output);
 }catch(error){child.stdin.destroy();child.kill('SIGTERM');console.error('Partial export preserved at '+target.partial);throw error;}
 const decodedFrames=decodeVideo(target.output,count);
 return {...target,stage,video:target.output,videoSha256:hash(target.output),resolution:[width,height],fps:FPS,inputFrames:count,encodedFrames:decodedFrames,
  absoluteFromFrame:fromFrame,absoluteToFrameExclusive:toFrameExclusive,absoluteStartSeconds:fromFrame/FPS,absoluteEndSeconds:toFrameExclusive/FPS,videoDuration:duration,
  audioTrimStartSample:fromFrame*800,audioTrimEndSample:toFrameExclusive*800,audioFilter,nativeFrameAggregateSha256:nativeAggregate,nativeHashMethod:'SHA256(j + NUL + JPEG-SHA256 + LF) in ascending j order; no per-frame hash table saved',
  elapsedSeconds:(Date.now()-started)/1000,allFrameDecode:true,allVisualsReviewed:false,earsPerformed:false,
  exactSvgCache:{comparison:'entire SVG string ===; no normalization or approximation',framesWritten:count,rasterInvocationsIncludingProof:svgRasterizations,reusedFrames:identicalSvgReuses,firstReuseProof:svgCacheProof,sourceHashCheckedForEveryFrame:true}};
}

/** Full final export. Explicit final:true is mandatory, even via CLI. */
export async function exportFinal({final=false,sourceKey=KEY,mixFile,mixRecord,output}={}){
 assert.equal(final,true,'Use explicit --final / final:true; a preflight is not a final export');
 const inputs=loadInputs();checkFrozen(inputs);await prepareTypography(inputs.clip);assert.equal(inputs.frames,14846);assert.equal(FPS,30);assert.equal(sourceKey,KEY);
 const mix=frozenMix({mixFile,mixRecord}),metaFile=realFile(path.join(CACHE,'blender/desk/meta.json')),anchorsFile=realFile(path.join(CACHE,'blender/desk/anchors.json')),primaryFile=realFile(path.join(CACHE,'blender/primary.json'));
 const coreFiles=[metaFile,anchorsFile,primaryFile],coreMetadataHashes=Object.fromEntries(coreFiles.map(f=>[f,hash(f)]));
 const meta=json(metaFile),anchors=json(anchorsFile),primary=json(primaryFile);
 assert.equal(meta.key,KEY);assert.equal(meta.frames,14846);assert.equal(meta.fps,30);assert.deepEqual(meta.resolution,[1080,1920]);assert.equal(meta.samples,16);
 assert.ok(typeof meta.finished==='string'&&Number.isFinite(Date.parse(meta.finished)),'Full native S4 render is unfinished');assert.equal(meta.previewOnly,false);assert.equal(meta.sampleOnly,false);
 assert.equal(anchors.key,KEY);assert.equal(anchors.frames,inputs.frames);assert.equal(anchors.fps,FPS);assert.ok(!anchors.previewOnly&&!anchors.sampleOnly);
 assert.ok(Object.keys(anchors.anchors??{}).length>0);for(const [name,list]of Object.entries(anchors.anchors))assert.equal(list.length,inputs.frames,'Incomplete anchor slots: '+name);
 const nativeCount=fs.readdirSync(path.dirname(metaFile)).filter(f=>/^\d{5}\.jpg$/.test(f)).length;assert.equal(nativeCount,inputs.frames,'Unexpected/missing exact native JPEG count');
 const primaryCount=Object.entries(primary).filter(([j,b])=>Number.isInteger(+j)&&+j>=0&&+j<inputs.frames&&Array.isArray(b)&&b.length===5&&b.slice(0,4).every(Number.isFinite)&&typeof b[4]==='string').length;
 assert.equal(primaryCount,inputs.frames,'Every final frame requires its native primary box');
 const nativeAggregate=await validateNativeRange(0,inputs.frames,1080,1920);
 const result=await encodeRange({inputs,mix,fromFrame:0,toFrameExclusive:inputs.frames,width:1080,height:1920,output:output??path.join(CACHE,'out',ID+'_s4_final.mp4'),nativeAggregate,stage:'S4 final'});
 for(const [f,sha]of Object.entries(coreMetadataHashes))assert.equal(hash(f),sha,'Native production metadata changed during export');
 const record={...result,id:ID,renderKey:KEY,samples:16,sourceKey:KEY,primaryFrames:primaryCount,nativeCoverageComplete:true,coreMetadataHashes,...mix,suppliedVoiceUnchanged:true,nominalAudioDuration:inputs.duration,trailingAudioPadding:inputs.frames/FPS-inputs.duration,
  scope:'Native 1080x1920/16-sample full export and all-frame decode only; run unchanged quality gate and review the actual video before acceptance. No ear-based listening performed.'};
 outJson(result.record,record);console.log(JSON.stringify({stage:record.stage,video:record.video,record:result.record,frames:record.encodedFrames,resolution:record.resolution,mixSha256:mix.mixSha256},null,2));return record;
}
// Compatibility name intentionally cannot export the old 540px draft path.
export async function exportDraft(options={}){return exportFinal(options);}

function motionWindows(manifest,inputs){
 assert.ok(Array.isArray(manifest.windows)&&manifest.windows.length,'Motion manifest requires windows[]');
 if(manifest.key!==undefined)assert.equal(manifest.key,KEY);if(manifest.fps!==undefined)assert.equal(manifest.fps,FPS);
 return manifest.windows.map((window,index)=>{
  const fromFrame=window.fromFrame??Math.round((window.fromSeconds??window.from)*FPS),toFrameExclusive=window.toFrameExclusive??Math.round((window.toSeconds??window.to)*FPS);
  assert.ok(Number.isInteger(fromFrame)&&Number.isInteger(toFrameExclusive)&&fromFrame>=0&&toFrameExclusive>fromFrame&&toFrameExclusive<=inputs.frames,'Invalid contiguous motion frame interval '+index);
  const id=String(window.id??'window-'+String(index+1).padStart(2,'0'));assert.ok(/^[A-Za-z0-9_-]+$/.test(id),'Window id must be a safe filename');
  const critical=[...(window.criticalFrames??window.eventCriticalFrames??[]),...(manifest.criticalFrames??[]).filter(v=>{const j=typeof v==='number'?v:v.j??v.frame;return j>=fromFrame&&j<toFrameExclusive;})].map(v=>typeof v==='number'?{j:v}:({...v,j:v.j??v.frame}));
  assert.ok(critical.length,'Explicit event-critical frames are required for every motion window');
  for(const item of critical)assert.ok(Number.isInteger(item.j)&&item.j>=fromFrame&&item.j<toFrameExclusive,'Critical frame outside its motion interval');
  const samples=[{j:fromFrame,label:'start'},{j:Math.floor((fromFrame+toFrameExclusive-1)/2),label:'middle'},{j:toFrameExclusive-1,label:'end'},...critical];
  return {id,fromFrame,toFrameExclusive,criticalFrames:[...new Set(critical.map(v=>v.j))],samples:[...new Map(samples.map(v=>[v.j,v])).values()].sort((a,b)=>a.j-b.j)};
 });
}
/** Short continuous trials at exact absolute clocks; never claims final S4. */
export async function exportMotion({manifestFile,output}={}){
 assert.ok(manifestFile&&output,'Pass --manifest FILE and --out FRESH_DIR');const inputs=loadInputs();checkFrozen(inputs);await prepareTypography(inputs.clip);
 manifestFile=realFile(path.resolve(manifestFile));const manifestSha256=hash(manifestFile),manifest=json(manifestFile),windows=motionWindows(manifest,inputs),mix=frozenMix();
 assert.equal(new Set(windows.map(w=>w.id)).size,windows.length,'Duplicate motion window id');
 output=path.resolve(output);assert.ok(output.startsWith(CACHE+path.sep)&&!fs.existsSync(output),'Motion output must be a fresh directory inside C5');
 const anchorsFile=realFile(path.join(CACHE,'blender/desk/anchors.json')),anchorsSha256=hash(anchorsFile),anchors=json(anchorsFile);assert.ok(anchors.anchors);
 for(const values of Object.values(anchors.anchors))assert.equal(values.length,inputs.frames,'Sparse motion anchors must keep absolute full-length slots');
 fs.mkdirSync(path.join(output,'contact-frames'),{recursive:true});const exports=[],tiles=[];
 for(const window of windows){
  const aggregate=await validateNativeRange(window.fromFrame,window.toFrameExclusive,540,960);
  const encoded=await encodeRange({inputs,mix,fromFrame:window.fromFrame,toFrameExclusive:window.toFrameExclusive,width:540,height:960,output:path.join(output,window.id+'.mp4'),nativeAggregate:aggregate,stage:'S3-quality continuous motion trial'});
  outJson(encoded.record,{...encoded,id:ID,renderKey:KEY,windowId:window.id,criticalFrames:window.criticalFrames,...mix,scope:'Short native-540 motion trial, not final S4. Frozen audio trimmed by absolute 24k sample clock.'});exports.push({id:window.id,video:encoded.video,record:encoded.record,fromFrame:window.fromFrame,toFrameExclusive:window.toFrameExclusive,frames:encoded.encodedFrames,criticalFrames:window.criticalFrames});
  for(const sample of window.samples){
   const image=path.join(output,'contact-frames',window.id+'-'+String(sample.j).padStart(5,'0')+'.jpg');
   await sharp(Buffer.from(svgAt(inputs,sample.j))).resize(216,384).jpeg({quality:92,chromaSubsampling:'4:4:4'}).toFile(image);
   tiles.push({image,id:window.id,j:sample.j,absoluteSeconds:sample.j/FPS,label:sample.label??'event-critical',critical:window.criticalFrames.includes(sample.j)});
  }
 }
 const pages=[];
 for(let from=0;from<tiles.length;from+=8){
  const group=tiles.slice(from,from+8),layers=[];
  for(let index=0;index<group.length;index++){
   const tile=group[index],x=12+(index%4)*232,y=12+Math.floor(index/4)*444;
   const note=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="216" height="46"><rect width="216" height="46" fill="${tile.critical?'#fff0a8':'#f6f1e7'}"/><text x="5" y="18" font-family="sans-serif" font-size="13">${tile.id} | j ${tile.j}</text><text x="5" y="37" font-family="sans-serif" font-size="13">${tile.absoluteSeconds.toFixed(3)} s | ${tile.critical?'event-critical':tile.label}</text></svg>`);
   layers.push({input:tile.image,left:x,top:y},{input:note,left:x,top:y+386});
  }
  const page=path.join(output,'motion-contact-'+String(pages.length+1).padStart(2,'0')+'.jpg');await sharp({create:{width:940,height:900,channels:3,background:'#ded8ce'}}).composite(layers).jpeg({quality:92}).toFile(page);pages.push(page);
 }
 checkFrozen(inputs);checkMix(mix);assert.equal(hash(manifestFile),manifestSha256);assert.equal(hash(anchorsFile),anchorsSha256);
 const result={stage:'Continuous S3-quality motion validation',id:ID,renderKey:KEY,fps:FPS,nativeResolution:[540,960],manifestFile,manifestSha256,anchorsSha256,...mix,windows:exports,contactPages:pages,contactSamples:tiles,samplesCoverEveryDeclaredCriticalFrame:windows.every(w=>w.criticalFrames.every(j=>tiles.some(t=>t.id===w.id&&t.j===j))),
  allVisualsReviewed:false,earsPerformed:false,scope:'Exact frame/sample-clock short trials plus contact sheets only. Actual motion must be visually reviewed by root; no audio-generation/mixing, interpolation, missing-frame substitution, or final-resolution claim.'};
 outJson(path.join(output,'motion-export.json'),result);console.log(JSON.stringify({output,windows:exports.length,pages:pages.length,allCriticalFramesSampled:result.samplesCoverEveryDeclaredCriticalFrame}));return result;
}

// The original renderer is never altered on disk. Non-B2a desk scenes delegate
// to its original function inside the dedicated wrapper.
let hooksInstalled=false;
export function installB2AHooks(){
 if(hooksInstalled)return;hooksInstalled=true;
 const frameVert=new URL('./frame-vert.mjs',import.meta.url).href,wrapper=new URL('./desk-b2a-r03trial-overlay_v01_gpt_20261030.mjs',import.meta.url).href;
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
 else if(command==='compose')await compose({manifestFile:arg('--manifest',path.join(CACHE,'storyboard/render-manifest.json')),output:arg('--out',path.join(CACHE,'storyboard/revised-s2-v1')),rows:arg('--rows',null)?.split(',').map(Number)??null});
 else if(command==='export'||command==='export-final')await exportFinal({final:process.argv.includes('--final'),sourceKey:arg('--source-key',KEY),mixFile:arg('--mix',undefined),mixRecord:arg('--mix-record',undefined),output:arg('--out',undefined)});
 else if(command==='export-motion'||command==='exportMotion')await exportMotion({manifestFile:arg('--manifest',null),output:arg('--out',null)});
 else if(command==='inspect'){const i=loadInputs();await prepareTypography(i.clip);console.log(JSON.stringify({id:ID,rows:i.rows.length,cues:i.cues.length,duration:i.duration,frames:i.frames,layoutAudit:inspectLayouts(i.clip),measuredTextCount:typographyEvidence().measuredTextCount},null,2));}
 else throw Error('Usage: node desk-b2a-s4final-stage_gpt_20261030.mjs prepare | inspect | compose [--manifest FILE] [--out FRESH_DIR] | export-final --final [--source-key KEY] [--mix WAV --mix-record JSON] [--out FRESH_MP4] | export-motion --manifest FILE --out FRESH_DIR');
}


