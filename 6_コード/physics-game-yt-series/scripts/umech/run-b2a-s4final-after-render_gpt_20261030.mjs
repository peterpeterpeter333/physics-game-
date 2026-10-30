// Local B2a continuation only. Never changes frozen inputs or existing QA.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const W=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const C='/private/tmp/ys/ys-chain-b2a_s4final_gpt_20261030';
const R=path.join(W,'outputs/ys-chain-b2a-backup/S4修正02_20261030');
const ID='ys-chain-b2a_gpt_20261029';
const PY='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python';
const movie=path.join(C,'out',ID+'_s4_final.mp4');
const audit=path.join(R,'本番完成後の機械検査');
assert(!fs.existsSync(audit),'Use a fresh audit directory');fs.mkdirSync(audit);
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const env={...process.env,EM_FILM_CACHE:C};
const results=[];
async function command(name,executable,args){
 const log=path.join(audit,name+'.log');const stream=fs.createWriteStream(log,{flags:'wx'});
 console.log('START',name,new Date().toISOString());
 const code=await new Promise((resolve,reject)=>{
  const child=spawn(executable,args,{cwd:W,env,stdio:['ignore','pipe','pipe']});
  child.stdout.pipe(stream,{end:false});child.stderr.pipe(stream,{end:false});
  child.on('error',reject);child.on('close',resolve);
 });
 await new Promise(resolve=>stream.end(resolve));
 const result={name,code,log};results.push(result);console.log('DONE',JSON.stringify(result));return result;
}
for(;;){
 const error=path.join(C,'jobs/029-native-resume.error.json');
 if(fs.existsSync(error))throw Error('Native render failed: '+fs.readFileSync(error,'utf8'));
 const stateFile=path.join(C,'blender/s4-export-state.json');
 let state=null;try{state=read(stateFile);}catch{}
 if(state){
  console.log('NATIVE',state.lastFrame+1+'/'+state.totalFrames,'complete='+state.completed,new Date().toISOString());
  if(state.completed){
   const meta=read(path.join(C,'blender/desk/meta.json'));
   assert.deepEqual(meta.resolution,[1080,1920]);assert.equal(meta.samples,16);
   assert.equal(meta.frames,14846);assert.equal(meta.previewOnly,false);break;
  }
 }
 await sleep(55000);
}
assert(!fs.existsSync(movie),'Refuse to overwrite an MP4');
const encoded=await command('01_本番合成',process.execPath,['scripts/umech/desk-b2a-s4final-stage_gpt_20261030.mjs','export-final','--final','--out',movie]);
if(encoded.code!==0)throw Error('Encoding failed; see '+encoded.log);
assert(!fs.existsSync(path.join(C,'verify')),'Preserve any existing visual sheets before rerunning qx');
await command('02_全編機械確認と毎秒一覧',process.execPath,['scripts/umech/qx-verify.mjs',ID,movie]);
await command('03_変更していない共通品質検査',process.execPath,['--import','./scripts/umech/desk-b2a-s4final-stage_gpt_20261030.mjs','scripts/umech/desk-quality-gate.mjs',ID,'--cache',C,'--mp4',movie,'--require-primary','--script','docs/video-revision-20260924/ytseries/chain-b-2a_gpt_20261029.mjs','--md','outputs/ys-chain-b2a-backup/S0_20261029/master-audio-rows-derived-for-original-lint.md']);
await command('04_完成MP4音声の実検査',PY,['outputs/ys-chain-b2a-backup/S3_20261029/audit-final-mp4-audio_20261029.py','--mp4',movie,'--out',path.join(audit,'完成MP4音声')]);
await command('05_台本時刻音声BGM不変',PY,['scripts/umech/prepare-b2a-s4final-frozen-audio_gpt_20261030.py','--verify']);
const backup=path.join(R,'S4本番キャッシュ実体');assert(!fs.existsSync(backup));
fs.mkdirSync(backup);
for(const name of ['blender','problem','plan.json',ID+'.json','timed-selection.json','phrase-times.json','row-to-time.json','shot-plan.json','verify','gate','quality-gate.json']){
 const src=path.join(C,name);if(fs.existsSync(src))fs.cpSync(src,path.join(backup,name),{recursive:true,errorOnExist:true,force:false});
}
const state={stage:'Native S4 encoded; mechanical results recorded; manual full-movie visual review still required',movie,results,backup,allCommandsPassed:results.every(r=>r.code===0),earsPerformed:false,finalReportComplete:false};
fs.writeFileSync(path.join(audit,'after-render-result.json'),JSON.stringify(state,null,2),{flag:'wx'});
console.log('AWAITING_MANUAL_VISUAL_REVIEW',JSON.stringify(state));
