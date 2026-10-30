// Active-task continuation only: wait for root-queued renders, then encode/check.
// This never publishes or approves the result; eye review remains a separate step.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const root=process.cwd(),folder=root+'/outputs/axes-20261023/b1-final-runtime-20261024';
assert(!fs.existsSync(folder),'Preserve existing runtime evidence');fs.mkdirSync(folder);
const patch='/private/tmp/ys/ys-chain-b1v1-timing-final-20261024/timing-patch.json';
const human='/private/tmp/ys/ys-chain-c1v1/c1-r13-human-qa.json';
const final='/private/tmp/ys/ys-chain-b1v1-final-20261024',video=final+'/out/ys-chain-b1v1.mp4';
const started=Date.now(),record={phase:'waiting for actual B1 raw and completed C1 CPU review',started:new Date().toISOString(),steps:[],finalVideoApproved:false};
const save=()=>fs.writeFileSync(folder+'/status.json',JSON.stringify(record,null,1));save();
while(!(fs.existsSync(patch)&&fs.existsSync(human)&&JSON.parse(fs.readFileSync(human)).readyForProduction)){
 if(Date.now()-started>21600000)throw Error('Actual render/QA completion did not arrive; do not fake completion');
 await new Promise(r=>setTimeout(r,15000));
}
async function run(name,args,env={}){
 record.phase=name;save();console.log(new Date().toISOString(),name,'START');
 const log=fs.createWriteStream(folder+'/'+name+'.log',{flags:'wx'}),t=Date.now();
 const child=spawn(process.execPath,args,{cwd:root,env:{...process.env,...env},stdio:['ignore','pipe','pipe']});child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});
 const result=await new Promise(resolve=>{child.once('error',error=>resolve({exitCode:null,error:error.message}));child.once('close',(exitCode,signal)=>resolve({exitCode,signal}));});
 log.end();record.steps.push({name,...result,seconds:(Date.now()-t)/1000,log:folder+'/'+name+'.log'});save();console.log(new Date().toISOString(),name,'END',result.exitCode);
 return result;
}
assert.equal((await run('encode',['scripts/umech/desk-b1v1-final-export-20261024.mjs'])).exitCode,0);
// A failed original heuristic remains a failure in these logs; no blanket waiver.
await run('original-final-checks',['scripts/umech/desk-axes-final-checks.mjs','b1',video],{AXES_FINAL_SOURCE:final});
assert.equal((await run('actual-mp4-review-sheets',['scripts/umech/desk-b1v1-final-review-20261024.mjs',video,final+'/actual-mp4-review'])).exitCode,0);
record.phase='encoded MP4 and original checks ready; actual visual review and scene-specific supplement still pending';record.video=video;record.finished=new Date().toISOString();save();console.log(JSON.stringify(record));
