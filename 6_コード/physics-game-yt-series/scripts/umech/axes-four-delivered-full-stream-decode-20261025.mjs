import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
const W=process.cwd();
assert(W.endsWith('/work/physics-game-yt-series'));
const O=W+'/outputs/axes-20261023';
const out=O+'/axes-four-delivered-full-stream-decode-20261025.json';
assert(!fs.existsSync(out));
const ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const rows=[];
for(const id of ['b1','c1','d1','e1']) {
 const receipt=O+'/'+id+'-final-delivery-copy-20261025.json';
 const copy=JSON.parse(fs.readFileSync(receipt));
 assert.equal(sha(copy.destination),copy.sha256);
 const args=['-nostdin','-v','error','-xerror','-i',copy.destination,'-map','0:v:0','-map','0:a:0','-f','null','-'];
 const started=Date.now();
 const result=await new Promise((resolve,reject)=>{
  const child=spawn(ff,args,{stdio:['ignore','ignore','pipe']});let stderr='';
  child.stderr.on('data',chunk=>{stderr+=chunk;assert(stderr.length<1000000);});
  child.once('error',reject);child.once('close',(code,signal)=>resolve({code,signal,stderr}));
 });
 const after=sha(copy.destination);
 assert.equal(after,copy.sha256);
 rows.push({episode:id,video:copy.destination,mp4Sha256:after,deliveryReceipt:receipt,
  deliveryReceiptSha256:sha(receipt),executable:ff,args,exitCode:result.code,
  signal:result.signal,stderr:result.stderr,seconds:(Date.now()-started)/1000,
  completeVideoAndAudioStreamsDecodedToNull:result.code===0&&result.signal===null,
  fileUnchanged:true,audibleListeningPerformed:false,continuousHumanPlaybackPerformed:false});
 console.log(JSON.stringify({episode:id,exitCode:result.code,seconds:rows.at(-1).seconds}));
}
fs.writeFileSync(out,JSON.stringify({date:new Date().toISOString(),scope:'Independent full decoding of both streams from the four delivered Downloads MP4 files. No ear listening, no visual recognition or claim that original quality gates passed.',rows,
 allFourCompleteStreamsDecodedWithoutError:rows.every(r=>r.completeVideoAndAudioStreamsDecodedToNull),
 existingFilesEdited:false,newMediaGenerated:false,commitOrPushPerformed:false},null,1)+'\n',{flag:'wx'});
assert(rows.every(r=>r.completeVideoAndAudioStreamsDecodedToNull),'A delivered full-stream decode failed; inspect the new report');
console.log(JSON.stringify({report:out,sha256:sha(out)}));
