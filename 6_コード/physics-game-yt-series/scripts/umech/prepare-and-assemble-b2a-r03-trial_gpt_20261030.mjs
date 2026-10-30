// Fresh native-540 trial scaffolding and exact-clock five-window assembly.
// No Blender/UI, native rendering, speech synthesis, remixing, or old-file edits.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';

const W=path.resolve(fileURLToPath(new URL('../..',import.meta.url)));
const SOURCE='/private/tmp/ys/ys-chain-b2a_s4r03_gpt_20261030';
const TRIAL='/private/tmp/ys/ys-chain-b2a_r03trial_gpt_20261030';
const R=path.join(W,'outputs/ys-chain-b2a-backup/S4修正03_20261030');
const ID='ys-chain-b2a_gpt_20261029',KEY='b2a_s4final_gpt_20261030',NF=14846,FPS=30;
const sourceStage=path.join(W,'scripts/umech/desk-b2a-s4r03-stage-cacheexact_gpt_20261030.mjs');
const sourceOverlay=path.join(W,'scripts/umech/desk-b2a-s4r03-overlay_gpt_20261030.mjs');
const sourceReceipt=path.join(R,'S4r03-frozen-input-and-audio-reuse_20261030.json');
const arg=(name,fallback)=>{const index=process.argv.indexOf(name);return index<0?fallback:process.argv[index+1];};
const variant=arg('--variant','v01');assert.ok(/^[a-zA-Z0-9_-]+$/.test(variant),'Use a fresh simple variant label');
const stageName='desk-b2a-r03trial-stage_'+variant+'_gpt_20261030.mjs';
const overlayName='desk-b2a-r03trial-overlay_'+variant+'_gpt_20261030.mjs';
const targetStage=path.join(W,'scripts/umech',stageName),targetOverlay=path.join(W,'scripts/umech',overlayName);
const receiptName='S4r03trial_'+variant+'-frozen-input-and-audio-reuse_20261030.json';
const receiptFile=path.join(R,receiptName);
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const hash=file=>{const s=fs.lstatSync(file);assert.ok(s.isFile()&&!s.isSymbolicLink(),'Real file required: '+file);return createHash('sha256').update(fs.readFileSync(file)).digest('hex');};
const saveNew=(file,data)=>fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const frozenNames=['plan.json',ID+'.json','timed-selection.json','phrase-times.json',ID+'.voice.wav',ID+'.wav','silent-intro-record.json'];
const sourceRelative=absolute=>{const rel=path.relative(SOURCE,absolute);assert.ok(rel&&!rel.startsWith('..')&&!path.isAbsolute(rel));return rel;};

function copyOrVerify(source,target){
 const before=hash(source);fs.mkdirSync(path.dirname(target),{recursive:true});
 let copied=false;
 if(!fs.existsSync(target)){fs.copyFileSync(source,target,fs.constants.COPYFILE_EXCL);copied=true;}
 assert.equal(hash(target),before,'Never overwrite different existing trial input: '+target);assert.equal(hash(source),before);
 return {source,target,sha256:before,bytes:fs.statSync(source).size,copiedNow:copied};
}
function speechAggregate(root){
 const files=[];
 const walk=relative=>{
  for(const entry of fs.readdirSync(path.join(root,relative),{withFileTypes:true})){
   assert.ok(!entry.isSymbolicLink());const rel=path.join(relative,entry.name);
   if(entry.isDirectory())walk(rel);else {assert.ok(entry.isFile());files.push(rel);}
  }
 };walk('');files.sort();let bytes=0;const aggregate=createHash('sha256');
 for(const rel of files){const file=path.join(root,rel),size=fs.statSync(file).size;aggregate.update(rel+'\0'+size+'\0'+hash(file)+'\n');bytes+=size;}
 return {root,count:files.length,bytes,sha256:aggregate.digest('hex'),files,
  method:'Sorted relative path/bytes/file-SHA aggregate; per-file/frame hash tables are not stored'};
}
function replaceExact(text,before,after,expected){
 assert.equal(text.split(before).length-1,expected,'Unexpected snapshot source shape: '+before);
 return text.split(before).join(after);
}
function snapshotContents(){
 const overlay=fs.readFileSync(sourceOverlay,'utf8'),stage=fs.readFileSync(sourceStage,'utf8');
 const newOverlay=replaceExact(overlay,"export const CACHE='"+SOURCE+"';","export const CACHE='"+TRIAL+"';",1);
 let newStage=replaceExact(stage,'./'+path.basename(sourceOverlay),'./'+overlayName,2);
 newStage=replaceExact(newStage,'outputs/ys-chain-b2a-backup/S4修正03_20261030/'+path.basename(sourceReceipt),
  'outputs/ys-chain-b2a-backup/S4修正03_20261030/'+receiptName,1);
 return {newOverlay,newStage,sourceStageSha256:hash(sourceStage),sourceOverlaySha256:hash(sourceOverlay)};
}
function writeNewOrAssertExact(file,content){
 if(fs.existsSync(file))assert.equal(fs.readFileSync(file,'utf8'),content,'Current producer changed; preserve the old snapshot and use --variant NEW');
 else fs.writeFileSync(file,content,{flag:'wx'});
}
function verifyPrepared(){
 const receipt=read(receiptFile),snapshot=snapshotContents();
 assert.equal(receipt.cache,TRIAL);assert.equal(receipt.id,ID);assert.equal(receipt.counts.voicedCues,70);assert.equal(receipt.counts.captionChunks,317);
 assert.equal(hash(sourceReceipt),receipt.priorReceipt.sha256,'C7 immutable-input receipt changed');
 for(const source of receipt.protectedSources)assert.equal(hash(source.path),source.sha256,'Old protected source changed');
 for(const copy of receipt.criticalCopies){assert.equal(hash(copy.source),copy.sha256);assert.equal(hash(copy.target),copy.sha256);}
 assert.equal(hash(sourceStage),receipt.localProducerSnapshot.sourceStageSha256);
 assert.equal(hash(sourceOverlay),receipt.localProducerSnapshot.sourceOverlaySha256);
 assert.equal(fs.readFileSync(targetStage,'utf8'),snapshot.newStage);assert.equal(fs.readFileSync(targetOverlay,'utf8'),snapshot.newOverlay);
 assert.equal(hash(targetStage),receipt.localProducerSnapshot.trialStageSha256);assert.equal(hash(targetOverlay),receipt.localProducerSnapshot.trialOverlaySha256);
 const sourceSpeech=speechAggregate(path.join(SOURCE,'speech')),trialSpeech=speechAggregate(path.join(TRIAL,'speech'));
 assert.equal(sourceSpeech.sha256,receipt.speechCopySummary.source.sha256);assert.equal(sourceSpeech.sha256,trialSpeech.sha256);
 assert.equal(hash(receipt.mix.file),receipt.mix.sha256);assert.equal(hash(path.join(TRIAL,ID+'.voice.wav')),receipt.mix.voiceSha256);
 return receipt;
}

function prepare(){
 const source=read(sourceReceipt);assert.equal(source.cache,SOURCE);assert.equal(source.id,ID);
 for(const item of source.protectedSources)assert.equal(hash(item.path),item.sha256);
 const snapshot=snapshotContents();
 if(fs.existsSync(receiptFile)){verifyPrepared();return {receipt:read(receiptFile),createdNow:false};}
 // Root may already have rendered native trial frames here. Never copy or
 // replace anchors/primary/camera/JPEGs: those must come from the actual trial.
 if(!fs.existsSync(TRIAL))fs.mkdirSync(TRIAL);else assert.ok(fs.lstatSync(TRIAL).isDirectory()&&!fs.lstatSync(TRIAL).isSymbolicLink());
 const critical=[];
 for(const name of frozenNames)critical.push(copyOrVerify(path.join(SOURCE,name),path.join(TRIAL,name)));
 for(const file of fs.readdirSync(path.join(SOURCE,'audio-v4')).sort()){
  critical.push(copyOrVerify(path.join(SOURCE,'audio-v4',file),path.join(TRIAL,'audio-v4',file)));
 }
 for(const name of ['row-to-time.json','shot-plan.json'])critical.push(copyOrVerify(path.join(SOURCE,name),path.join(TRIAL,name)));
 const speech=speechAggregate(path.join(SOURCE,'speech'));
 for(const rel of speech.files)copyOrVerify(path.join(SOURCE,'speech',rel),path.join(TRIAL,'speech',rel));
 const copiedSpeech=speechAggregate(path.join(TRIAL,'speech'));assert.equal(copiedSpeech.sha256,speech.sha256);
 // These clock/data references are optional for a root controller; no render
 // metadata is copied. A controller should still produce its own trial anchors.
 const references=[];
 for(const name of ['blender/b2a-scene-data.json','blender/storyboard-plan.json']){
  const target=path.join(TRIAL,'source-reference-c7',name);references.push(copyOrVerify(path.join(SOURCE,name),target));
 }
 writeNewOrAssertExact(targetStage,snapshot.newStage);writeNewOrAssertExact(targetOverlay,snapshot.newOverlay);
 const cleanAggregate=summary=>{const {files,...compact}=summary;return compact;};
 const receipt={preparedUtc:new Date().toISOString(),id:ID,cache:TRIAL,
  priorReceipt:{path:sourceReceipt,sha256:hash(sourceReceipt)},protectedSources:source.protectedSources,
  criticalCopies:critical,sourceClockReferences:references,
  speechCopySummary:{source:cleanAggregate(speech),target:cleanAggregate(copiedSpeech)},
  counts:{voicedCues:70,captionChunks:317,speechFiles:speech.count,frozenCopies:critical.length+speech.count},
  partialRevision:source.partialRevision,
  mix:{...source.mix,file:path.join(TRIAL,sourceRelative(source.mix.file)),record:path.join(TRIAL,sourceRelative(source.mix.record))},
  localProducerSnapshot:{sourceStage,sourceStageSha256:snapshot.sourceStageSha256,
   sourceOverlay,sourceOverlaySha256:snapshot.sourceOverlaySha256,
   trialStage:targetStage,trialStageSha256:hash(targetStage),trialOverlay:targetOverlay,trialOverlaySha256:hash(targetOverlay),
   onlySourceDifferences:'Trial CACHE constant, local wrapper import/hook, and fresh trial reuse-receipt path'},
  originalVoiceAndMixByteUnchanged:true,audioRegenerated:false,remixed:false,
  nativeFramesOrProjectionMetadataCopied:false,earsPerformed:false,
  scope:'Immutable real audio/clock copies and current local producer snapshot only. Root must render native540 exact-j trial frames and anchors; not a final S4 cache.'};
 saveNew(receiptFile,receipt);verifyPrepared();return {receipt,createdNow:true};
}

function validateManifest(manifestFile,receipt){
 const manifest=read(manifestFile);assert.ok(Array.isArray(manifest.windows));assert.equal(manifest.windows.length,5,'Use the five full changed intervals');
 if(manifest.key!==undefined)assert.equal(manifest.key,KEY);if(manifest.fps!==undefined)assert.equal(manifest.fps,FPS);
 const actual=manifest.windows.map(window=>({from:window.fromFrame,to:window.toFrameExclusive,window})).sort((a,b)=>a.from-b.from);
 const expected=receipt.partialRevision.ranges;
 assert.deepEqual(actual.map(({from,to})=>[from,to]),expected.map(({fromFrame,toFrameExclusive})=>[fromFrame,toFrameExclusive]));
 let frames=0;
 for(const {from,to,window} of actual){
  const critical=window.criticalFrames??window.eventCriticalFrames??[];
  assert.ok(critical.length,'Provide real event-critical j for every interval');
  for(const item of critical){const j=typeof item==='number'?item:item.j??item.frame;assert.ok(Number.isInteger(j)&&j>=from&&j<to);}
  for(let j=from;j<to;j++){
   const file=path.join(TRIAL,'blender/desk',String(j).padStart(5,'0')+'.jpg');
   const stat=fs.lstatSync(file);assert.ok(stat.isFile()&&!stat.isSymbolicLink(),'Missing real exact trial j '+j);frames++;
  }
 }
 assert.equal(frames,2288);
 const anchors=read(path.join(TRIAL,'blender/desk/anchors.json'));
 assert.ok(anchors.anchors&&Object.keys(anchors.anchors).length);
 for(const values of Object.values(anchors.anchors))assert.equal(values.length,NF,'Trial anchors must have full absolute-j slots');
 return {manifest,frames};
}

async function assemble(){
 const manifestArg=arg('--manifest',null);assert.ok(manifestArg,'Use --manifest with exact windows and actual event-critical frames');
 const manifestFile=path.resolve(manifestArg),beforeManifest=hash(manifestFile);
 const {receipt}=prepare();validateManifest(manifestFile,receipt);
 const output=path.resolve(arg('--out',path.join(TRIAL,'continuous-trials_'+variant)));
 const backup=path.resolve(arg('--backup',path.join(R,'連続試写_修正03_'+variant)));
 assert.ok(output.startsWith(TRIAL+path.sep)&&!fs.existsSync(output),'Use a fresh trial output directory');
 assert.ok(backup.startsWith(R+path.sep)&&!fs.existsSync(backup),'Use a fresh trial backup inside R7');
 process.env.EM_FILM_CACHE=TRIAL;
 const {exportMotion}=await import(pathToFileURL(targetStage).href);
 const result=await exportMotion({manifestFile,output});
 assert.equal(result.windows.length,5);assert.ok(result.samplesCoverEveryDeclaredCriticalFrame);
 assert.equal(hash(manifestFile),beforeManifest);verifyPrepared();
 fs.cpSync(output,backup,{recursive:true,errorOnExist:true,force:false});
 for(const window of result.windows){
  const saved=path.join(backup,path.basename(window.video));assert.equal(hash(saved),hash(window.video));
  const sidecar=path.join(backup,path.basename(window.record));assert.equal(hash(sidecar),hash(window.record));
 }
 saveNew(path.join(backup,'trial-assembly-receipt.json'),{id:ID,variant,trialCache:TRIAL,
  manifestFile,manifestSha256:beforeManifest,immutableAudioReceipt:receiptFile,
  producerSnapshot:receipt.localProducerSnapshot,changedNativeFrames:2288,nativeResolution:[540,960],fps:FPS,
  windows:result.windows,output,backup,allDeclaredCriticalFramesCovered:true,
  originalAudioAndTimingUnchanged:true,oldCachesWrittenByThisHelper:false,earsPerformed:false,allVisualsReviewed:false,
  scope:'Five continuous S3-quality exact-clock trials assembled from root-rendered frames. Generation is not visual review or final S4 acceptance.'});
 console.log(JSON.stringify({stage:'Trial assembly complete; visual review required',output,backup,
  windows:5,frames:2288,contactPages:result.contactPages.length,allCriticalFramesSampled:true,earsPerformed:false,allVisualsReviewed:false},null,2));
}

const command=process.argv[2];
if(command==='prepare'){
 const {createdNow}=prepare();console.log(JSON.stringify({trialCache:TRIAL,receiptFile,targetStage,targetOverlay,createdNow,
  copiedNativeFrames:0,next:'Root renders native540 exact changed j plus full-length trial anchors, then assemble --manifest FILE'},null,2));
}else if(command==='verify'){
 verifyPrepared();console.log(JSON.stringify({pass:true,trialCache:TRIAL,receiptFile,audioRegenerated:false,earsPerformed:false}));
}else if(command==='assemble')await assemble();
else throw Error('Usage: node prepare-and-assemble-b2a-r03-trial_gpt_20261030.mjs prepare | verify | assemble --manifest FILE [--variant v01] [--out FRESH_TRIAL_DIR] [--backup FRESH_R7_DIR]');
