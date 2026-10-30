// Owned resume adapter only: fresh cache/output, unchanged frozen pipeline.
// Preserves the interrupted candidate; no GPU, source edits or approval claims.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const mode=process.argv[2];
assert(['--encode','--review'].includes(mode)&&process.argv.length===3);
const source='/private/tmp/ys/ys-chain-d1v1-final-complete-v4-20261025';
const cache='/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025';
const pipeline='scripts/umech/desk-d1v1-final-review-pipeline-v4-20261025.mjs';
const pipelineSha='14ba5451c6c3a3e09fb18136fe97b467f10c86e19c65314502e106f93031747f';
const pause='outputs/axes-20261023/root-user-requested-pause-20261025-0129.json';
const pauseSha='ef46295a72839f98cb5d37f3125b374e755c64fc65c66f746633306a47006f6c';
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,1),{flag:'wx'});
const snapshot=p=>{const s=fs.lstatSync(p);assert(s.isFile()&&!s.isSymbolicLink());return {file:p,bytes:s.size,mtimeMs:s.mtimeMs,sha256:sha(p)};};
const oldFiles=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?oldFiles(path.join(p,e.name)):[snapshot(path.join(p,e.name))]);
const verifyFiles=rows=>{for(const r of rows)assert.deepEqual(snapshot(r.file),r,r.file);};
assert.equal(sha(pipeline),pipelineSha);assert.equal(sha(pause),pauseSha);
assert.equal(read(pause).status,'paused_at_explicit_user_request');
assert(!fs.lstatSync(source).isSymbolicLink()&&!fs.lstatSync(path.dirname(cache)).isSymbolicLink());
assert(!process.env.EM_FILM_CACHE||process.env.EM_FILM_CACHE===cache,'Do not silently use a different final cache');
assert(!process.env.FILM_PREFLIGHT&&!process.env.FILM_STORYBOARD);
assert(!process.env.FILM_SHARD||process.env.FILM_SHARD==='0/1');
const oldPartial=source+'/ys-chain-d1v1.rendering.mp4';
assert.equal(fs.statSync(oldPartial).size,read(pause).dEncoder.partialBytes);
assert.equal(fs.statSync(oldPartial).mtime.toISOString(),read(pause).dEncoder.partialMtimeUTC);
const protectedFiles=[snapshot(oldPartial),...oldFiles(source+'/out-final-d1v1')];
const names=['d1-complete-merge.json','plan.json','ys-chain-d1v1.json','phrase-times.json','ys-chain-d1v1.voice.wav','ys-chain-d1v1.wav','ys-chain-d1v1.mix.json','blender','problem','new-part-catalog-coal-support'];
const beforeFile=cache+'/d1-owned-resume-inputs-20261025.json';
if(mode==='--encode'){
 assert(!fs.existsSync(cache),'Every interrupted/resumed output must be preserved; fresh cache required');
 fs.mkdirSync(cache);
 for(const name of names)fs.symlinkSync(source+'/'+name,cache+'/'+name);
}else assert(fs.existsSync(beforeFile),'Successful resume preflight is required before review');
assert(!fs.lstatSync(cache).isSymbolicLink());
for(const name of names){assert(fs.lstatSync(cache+'/'+name).isSymbolicLink());assert.equal(fs.readlinkSync(cache+'/'+name),source+'/'+name);assert.equal(fs.realpathSync(cache+'/'+name),fs.realpathSync(source+'/'+name));}
// All output-frame identities are checked, not merely a sample or nominal plan.
for(let j=0;j<12163;j++){
 const f='/blender/desk/'+String(j).padStart(5,'0')+'.jpg';
 assert.equal(fs.realpathSync(cache+f),fs.realpathSync(source+f));
 assert(fs.statSync(cache+f).size>1000);
}
const inputs=['d1-complete-merge.json','plan.json','ys-chain-d1v1.json','phrase-times.json','ys-chain-d1v1.voice.wav','ys-chain-d1v1.wav','ys-chain-d1v1.mix.json','blender/data.json','blender/desk/meta.json','blender/desk/anchors.json','blender/delivered-provenance.json','blender/delivered-camera-poses.json','blender/camera-motion.json'];
const inputSha256=Object.fromEntries(inputs.map(f=>[f,sha(source+'/'+f)]));
const verify=()=>{assert.equal(sha(pipeline),pipelineSha);assert.equal(sha(pause),pauseSha);verifyFiles(protectedFiles);for(const[f,h]of Object.entries(inputSha256)){assert.equal(sha(source+'/'+f),h);assert.equal(sha(cache+'/'+f),h);}};
verify();
if(mode==='--encode')write(beforeFile,{episode:'D-1',sourceCache:source,resumedCache:cache,pauseRecord:pause,pauseRecordSha256:pauseSha,unchangedPipeline:pipeline,unchangedPipelineSha256:pipelineSha,resumeHelperSha256:sha(new URL(import.meta.url)),protectedInterruptedFiles:protectedFiles,inputSha256,all12163SourceFrameRealpathsIdentical:true,frameContentOrTimingChanged:false,scope:'Fresh cache aliases only; original pipeline guards and encoder are executed without any source or runtime replacement',finalAcceptance:false});
else{const before=read(beforeFile);assert.deepEqual(before.inputSha256,inputSha256);assert.deepEqual(before.protectedInterruptedFiles,protectedFiles);assert.equal(before.resumeHelperSha256,sha(new URL(import.meta.url)));}
const started=Date.now();let result;
try{
 result=spawnSync(process.execPath,[pipeline,mode],{env:{...process.env,EM_FILM_CACHE:cache},stdio:'inherit'});
 if(result.error)throw result.error;
 assert.equal(result.status,0,'Unchanged final pipeline must complete successfully');
}finally{
 verify();
 write(cache+'/d1-owned-resume-'+mode.slice(2)+'-20261025.json',{episode:'D-1',mode,sourceCache:source,resumedCache:cache,video:cache+'/out-final-d1v1/ys-chain-d1v1.mp4',unchangedPipelineSha256:pipelineSha,resumeHelperSha256:sha(new URL(import.meta.url)),inputReceipt:beforeFile,inputReceiptSha256:sha(beforeFile),exitCode:result?.status??null,signal:result?.signal??null,seconds:(Date.now()-started)/1000,interruptedPartialAndOutputByteHashesUnchanged:true,inputSha256After:Object.fromEntries(inputs.map(f=>[f,sha(cache+'/'+f)])),all12163SourceFrameRealpathsIdentical:true,earsVerified:false,finalAcceptance:false});
}
console.log(JSON.stringify({mode,resumedCache:cache,video:cache+'/out-final-d1v1/ys-chain-d1v1.mp4',metadata:cache+'/out-final-d1v1/d1-encoded-metadata-v4-20261025.json',originalInterruptedCandidatePreserved:true,finalAcceptance:false}));
