// C7-only post-render continuation. Run only after root GO; old sources stay read-only.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

assert.ok(process.argv.includes('--go'),'Root GO is required: add --go to start the isolated pipeline');
const W=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const C='/private/tmp/ys/ys-chain-b2a_s4r03_gpt_20261030';
const C6='/private/tmp/ys/ys-chain-b2a_s4earth_gpt_20261030';
const R=path.join(W,'outputs/ys-chain-b2a-backup/S4修正03_20261030');
const ID='ys-chain-b2a_gpt_20261029',KEY='b2a_s4final_gpt_20261030',NF=14846;
const PY='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python';
const stage='scripts/umech/desk-b2a-s4r03-stage-cacheexact_gpt_20261030.mjs';
const preparation='scripts/umech/prepare-b2a-s4r03-cache_gpt_20261030.py';
const receiptFile=path.join(R,'S4r03-frozen-input-and-audio-reuse_20261030.json');
const instruction=path.join(R,'B-2前編_S4最終報告へのClaudeの判断と直しの指示_20261030.md');
const movie=path.join(C,'out',ID+'_s4_final.mp4');
const exportRecord=movie.replace(/\.mp4$/,'.export.json');
const audit=path.join(R,'本番完成後の機械検査_v04_追加改訂');
const backup=path.join(R,'S4修正03_最終キャッシュ実体');
const mediaBackup=path.join(R,'完成動画実体_修正03');
const c6Record=path.join(C6,'out',ID+'_s4_final.export.json');
const C6_RECORD_SHA='5bbfffa6046e961974d44c456198efff0e1e51166600e874b9419f47c507fd3a';
const C6_MOVIE_SHA='1f91678a7fe90b79cfd393002dd65998bab7110cb98a5de781df39b17329a9f0';
const MIX_SHA='389c690dee1fe8949ab447792d886318d65a135acb18456f48e1868039cdbf54';
const VOICE_SHA='1bf0ee817705b66479d46af2835f415175dde49238fa1384a07d7bcc9afb7f41';
for(const file of [audit,backup,mediaBackup,movie,exportRecord])assert.ok(!fs.existsSync(file),'Preserve prior result: '+file);
fs.mkdirSync(audit);
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const hash=file=>{const s=fs.lstatSync(file);assert.ok(s.isFile()&&!s.isSymbolicLink(),'Real file required: '+file);return createHash('sha256').update(fs.readFileSync(file)).digest('hex');};
const saveNew=(file,data)=>fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const env={...process.env,EM_FILM_CACHE:C};
const results=[],startedUtc=new Date().toISOString();

async function command(name,executable,args){
 const log=path.join(audit,name+'.log'),start=Date.now(),startedUtc=new Date().toISOString();
 const stream=fs.createWriteStream(log,{flags:'wx'});console.log('START',name,startedUtc);
 const code=await new Promise((resolve,reject)=>{
  const child=spawn(executable,args,{cwd:W,env,stdio:['ignore','pipe','pipe']});
  child.stdout.pipe(stream,{end:false});child.stderr.pipe(stream,{end:false});
  child.on('error',reject);child.on('close',resolve);
 });
 await new Promise(resolve=>stream.end(resolve));
 const result={name,code,log,startedUtc,finishedUtc:new Date().toISOString(),elapsedWallSeconds:(Date.now()-start)/1000};
 results.push(result);console.log('DONE',JSON.stringify(result));return result;
}

function oldC6Proof(){
 assert.equal(hash(c6Record),C6_RECORD_SHA,'Old C6 export record changed');
 const record=read(c6Record),movieFile=path.join(C6,'out',ID+'_s4_final.mp4');
 assert.equal(hash(movieFile),C6_MOVIE_SHA);assert.equal(record.videoSha256,C6_MOVIE_SHA);
 for(const [file,sha] of Object.entries(record.coreMetadataHashes))assert.equal(hash(file),sha,'Old C6 metadata changed');
 assert.equal(hash(record.mixFile),record.mixSha256);assert.equal(record.mixSha256,MIX_SHA);
 assert.equal(hash(path.join(C6,ID+'.voice.wav')),VOICE_SHA);
 const aggregate=createHash('sha256');let bytes=0;
 for(let j=0;j<NF;j++){
  const file=path.join(C6,'blender/desk',String(j).padStart(5,'0')+'.jpg'),sha=hash(file);
  aggregate.update(String(j)+'\0'+sha+'\n');bytes+=fs.statSync(file).size;
 }
 const nativeFrameAggregateSha256=aggregate.digest('hex');
 assert.equal(nativeFrameAggregateSha256,record.nativeFrameAggregateSha256,'Old C6 native images changed');
 return {cache:C6,exportRecordSha256:C6_RECORD_SHA,movieSha256:C6_MOVIE_SHA,
  nativeFrames:NF,nativeBytes:bytes,nativeFrameAggregateSha256,
  allRecordedCoreMetadataUnchanged:true,originalVoiceAndMixUnchanged:true,
  method:'Read-only old C6 exact-j native aggregate plus accepted movie/export/metadata/audio hashes; no individual frame hash table saved'};
}

function completedNativeProof(){
 const file=path.join(C,'blender/desk/meta.json'),meta=read(file);
 assert.equal(meta.key,KEY);assert.equal(meta.frames,NF);assert.equal(meta.fps,30);assert.equal(meta.samples,16);
 assert.deepEqual(meta.resolution,[1080,1920]);assert.equal(meta.previewOnly,false);assert.equal(meta.sampleOnly,false);assert.ok(meta.finished);
 const names=new Set(fs.readdirSync(path.join(C,'blender/desk')).filter(name=>/^\d{5}\.jpg$/.test(name)));
 assert.equal(names.size,NF);for(let j=0;j<NF;j++)assert.ok(names.has(String(j).padStart(5,'0')+'.jpg'),'Missing exact j '+j);
 const cameras=read(path.join(C,'blender/camera-records.json')),indices=new Set(cameras.map(row=>row.j));
 assert.equal(cameras.length,NF);assert.equal(indices.size,NF);for(let j=0;j<NF;j++)assert.ok(indices.has(j),'Missing completed camera row '+j);
 const receipt=read(receiptFile);assert.equal(receipt.cache,C);assert.equal(receipt.id,ID);
 assert.equal(receipt.mix.sha256,MIX_SHA);assert.equal(receipt.mix.voiceSha256,VOICE_SHA);
 assert.equal(hash(receipt.mix.file),MIX_SHA);assert.equal(hash(path.join(C,ID+'.voice.wav')),VOICE_SHA);
 assert.equal(hash(instruction),receipt.instructionSha256);
 assert.equal(hash(path.join(C,'shot-plan.json')),hash(path.join(C6,'shot-plan.json')),'Keep the supplied old shot plan/7d targets unchanged');
 return {metaFile:file,metaSha256:hash(file),meta,nativeJpegCount:names.size,
  completeUniqueCameraCount:indices.size,allPendingCameraIndicesOriginallyRemoved:receipt.allPendingCameraIndicesRemovedBeforeFirstRender,
  nativeChangedRows:receipt.partialRevision.nativeRows,nativeChangedFrames:receipt.partialRevision.framesToRender,
  frozenReceipt:receiptFile,frozenReceiptSha256:hash(receiptFile),frozenMixSha256:MIX_SHA,frozenVoiceSha256:VOICE_SHA,
  scope:'Complete exact-j set and metadata; exporter additionally validates every native JPEG at 1080x1920'};
}

function realFiles(root,relative=''){
 const out=[];
 for(const entry of fs.readdirSync(path.join(root,relative),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
  const rel=path.join(relative,entry.name);assert.ok(!entry.isSymbolicLink(),'No symlinked cache entry: '+rel);
  if(entry.isDirectory())out.push(...realFiles(root,rel));else {assert.ok(entry.isFile(),'Unexpected special cache entry: '+rel);out.push(rel);}
 }
 return out.sort();
}
function treeAggregate(root){
 const aggregate=createHash('sha256'),files=realFiles(root);let bytes=0;
 for(const rel of files){const file=path.join(root,rel),size=fs.statSync(file).size;aggregate.update(rel+'\0'+size+'\0'+hash(file)+'\n');bytes+=size;}
 return {root,files:files.length,bytes,sha256:aggregate.digest('hex'),method:'Sorted relative path/bytes/file-SHA aggregate only; no per-frame proof table saved'};
}

async function main(){
 let lastState=null;
 for(;;){
  const jobs=path.join(C,'jobs');
  if(fs.existsSync(jobs))for(const name of fs.readdirSync(jobs).filter(name=>name.endsWith('.error.json')))throw Error('Native job error: '+fs.readFileSync(path.join(jobs,name),'utf8'));
  let state=null;try{state=read(path.join(C,'blender/s4-export-state.json'));}catch{}
  if(state){
   const marker=JSON.stringify([state.lastFrame,state.completed]);
   if(marker!==lastState){console.log('NATIVE_LAST_WRITTEN_J',state.lastFrame,'fullSetCompleted='+state.completed,new Date().toISOString());lastState=marker;}
   if(state.completed&&fs.existsSync(path.join(C,'blender/desk/meta.json')))break;
  }
  await sleep(55000);
 }
 const nativeInput=completedNativeProof();saveNew(path.join(audit,'native-input-receipt.json'),nativeInput);
 const producerFiles=[stage,'scripts/umech/desk-b2a-s4r03-overlay_gpt_20261030.mjs',preparation].map(file=>path.join(W,file));
 const producerSourceHashes=Object.fromEntries(producerFiles.map(file=>[file,hash(file)]));
 saveNew(path.join(audit,'current-local-producer-sources.json'),producerSourceHashes);
 const c6Before=oldC6Proof();saveNew(path.join(audit,'C6不変_処理前.json'),c6Before);
 const preserved=await command('00_修正対象外と凍結入力不変',PY,[preparation,'--verify']);
 if(preserved.code!==0)throw Error('C7 outside-range or immutable-source verification failed');
 const encoded=await command('01_本番全14846コマ合成',process.execPath,[stage,'export-final','--final','--out',movie]);
 if(encoded.code!==0)throw Error('Encoding failed; keep the partial files and see its log');
 const exported=read(exportRecord);assert.equal(hash(movie),exported.videoSha256);
 assert.equal(exported.encodedFrames,NF);assert.equal(exported.samples,16);assert.equal(exported.mixSha256,MIX_SHA);assert.equal(exported.voiceSha256,VOICE_SHA);
 assert.ok(!fs.existsSync(path.join(C,'verify')),'Preserve any existing qx sheets; use a fresh candidate before rerun');
 await command('02_全編機械確認と毎秒一覧',process.execPath,['scripts/umech/qx-verify.mjs',ID,movie]);
 await command('03_変更していない共通品質検査',process.execPath,['--import','./'+stage,'scripts/umech/desk-quality-gate.mjs',ID,
  '--cache',C,'--mp4',movie,'--require-primary','--script','docs/video-revision-20260924/ytseries/chain-b-2a_gpt_20261029.mjs',
  '--md','outputs/ys-chain-b2a-backup/S0_20261029/master-audio-rows-derived-for-original-lint.md']);
 await command('04_完成MP4音声の実検査',PY,['outputs/ys-chain-b2a-backup/S3_20261029/audit-final-mp4-audio_20261029.py','--mp4',movie,'--out',path.join(audit,'完成MP4音声')]);
 const after=await command('05_台本時刻音声BGMと修正対象外不変',PY,[preparation,'--verify']);
 if(after.code!==0)throw Error('Post-export C7 source preservation failed');
 for(const [file,sha] of Object.entries(producerSourceHashes))assert.equal(hash(file),sha,'Current local producer changed during final export/QA');
 const c6After=oldC6Proof();assert.deepEqual(c6After,c6Before);saveNew(path.join(audit,'C6不変_処理後.json'),c6After);
 const sourceTree=treeAggregate(C);
 assert.ok(!fs.existsSync(backup));fs.cpSync(C,backup,{recursive:true,errorOnExist:true,force:false});
 const sourceAgain=treeAggregate(C),backupTree=treeAggregate(backup);
 assert.equal(sourceAgain.sha256,sourceTree.sha256,'C7 cache changed during backup');
 assert.equal(backupTree.sha256,sourceTree.sha256,'Full C7 backup differs');
 assert.equal(backupTree.files,sourceTree.files);assert.equal(backupTree.bytes,sourceTree.bytes);
 fs.mkdirSync(mediaBackup);
 const finalVideo=path.join(mediaBackup,path.basename(movie)),finalExport=path.join(mediaBackup,path.basename(exportRecord));
 fs.copyFileSync(movie,finalVideo,fs.constants.COPYFILE_EXCL);fs.copyFileSync(exportRecord,finalExport,fs.constants.COPYFILE_EXCL);
 assert.equal(hash(finalVideo),exported.videoSha256);assert.equal(hash(finalExport),hash(exportRecord));
 saveNew(path.join(audit,'full-cache-and-video-backup.json'),{sourceTree,backupTree,
  standaloneVideo:finalVideo,standaloneVideoSha256:exported.videoSha256,standaloneExport:finalExport,
  exportRecordSha256:hash(finalExport),allRealFiles:true,downloadsCopyPerformed:false});
 const gate=fs.existsSync(path.join(C,'quality-gate.json'))?read(path.join(C,'quality-gate.json')):null;
 const gateStatuses=gate?.results?.map(({no,status,value,detail})=>({no,status,value,detail}))??[];
 const outcome={stage:'C7 partial-native revision fully composed; mechanical results recorded; manual visual review still required',
  startedUtc,finishedUtc:new Date().toISOString(),movie,videoSha256:exported.videoSha256,results,backup,mediaBackup,
  allCommandsPassed:results.every(result=>result.code===0),originalGatePass:gate?.pass??null,
  originalGateResults:gateStatuses,originalGateExceptions:read(receiptFile).acceptedOriginalGateExceptions,
  originalGateOverridden:false,oldC6Unchanged:true,fullCacheBackupByteIdentical:true,
  originalAudioSubtitlesAndClockPreserved:true,earsPerformed:false,allVisualsReviewed:false,
  downloadsCopyPerformed:false,finalReportComplete:false};
 saveNew(path.join(audit,'after-render-result.json'),outcome);console.log('AWAITING_MANUAL_VISUAL_REVIEW',JSON.stringify(outcome));
}

try{await main();}catch(error){
 const failure={failed:true,error:String(error?.stack??error),startedUtc,failedUtc:new Date().toISOString(),results,
  earsPerformed:false,allVisualsReviewed:false,finalReportComplete:false,oldOutputsPreserved:true};
 const file=path.join(audit,'after-render-error.json');if(!fs.existsSync(file))saveNew(file,failure);
 console.error(error);process.exitCode=1;
}
