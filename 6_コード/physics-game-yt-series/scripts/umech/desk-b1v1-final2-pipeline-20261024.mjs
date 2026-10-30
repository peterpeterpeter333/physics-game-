// Local one-shot continuation. Does not change inputs, schedule future work,
// waive failed tests, publish, or replace any existing candidate.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const queue='/private/tmp/ys/axes-active-queue/job-054-b1-camera-v2.done.json';
const cache='/private/tmp/ys/ys-chain-b1v1-final2-20261024';
const video=cache+'/out/ys-chain-b1v1.mp4';
const log='/private/tmp/ys/b1-final2-pipeline-20261024.json';
assert(!fs.existsSync(cache),'Keep any previous output intact');
assert(!fs.existsSync(log),'Do not replace a previous pipeline record');
const results=[];
const save=()=>fs.writeFileSync(log,JSON.stringify({queue,cache,video,results,actualVisualReviewCompleted:false,earListeningPerformed:false},null,1));
save();
while(!fs.existsSync(queue))await new Promise(r=>setTimeout(r,15000));
const done=JSON.parse(fs.readFileSync(queue));
assert.equal(done.status,'done',JSON.stringify(done));
for(const [name,args] of [
 ['export',['scripts/umech/desk-b1v1-final2-export-20261024.mjs']],
 ['original-checks',['scripts/umech/desk-b1v1-final2-checks-20261024.mjs','b1',video]],
 ['actual-mp4-review-extraction',['scripts/umech/desk-b1v1-final2-review-20261024.mjs',video,cache+'/actual-mp4-review']],
]){
 const start=Date.now();
 const r=spawnSync(process.execPath,args,{env:{...process.env,AXES_FINAL_SOURCE:cache},stdio:'inherit'});
 results.push({name,exitCode:r.status,seconds:(Date.now()-start)/1000});save();
 // Original quality NGs must remain available for independent visual review.
 if(name!=='original-checks')assert.equal(r.status,0,name);
}
console.log('B2 candidate and unchanged checks ready; actual visual judgment still required.');
