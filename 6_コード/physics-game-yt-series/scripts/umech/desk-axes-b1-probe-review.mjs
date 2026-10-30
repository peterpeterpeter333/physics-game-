// Inspect real complete r5 probe frames only; this is not the final MP4 gate.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const c='/private/tmp/ys/ys-chain-b1v1',marker=c+'/blender/b1-r5-probe-complete.json';
const start=Date.now();
while(!fs.existsSync(marker)){
 if(Date.now()-start>7200000)throw Error('B1 full probe did not finish within two hours');
 await new Promise(r=>setTimeout(r,2000));
}
const report=JSON.parse(fs.readFileSync(marker));
const env={...process.env,B1_RAW:report.raw,B1_TIMES:JSON.stringify(Array.from({length:357},(_,i)=>i)),B1_REVIEW_OUT:c+'/review-probe1s-b1v1-r5'};
let r=spawnSync(process.execPath,['scripts/umech/desk-b1v1-review.mjs'],{env,stdio:'inherit'});if(r.status)process.exit(r.status??1);
r=spawnSync('/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python',['scripts/umech/desk-axes-probe-audit.py',c,report.raw,c+'/blender/b1-r5-probe-audit.json'],{stdio:'inherit',env:process.env});
if(r.status)process.exit(r.status??1);
console.log('B1 every-second visual sheets and preliminary frame metrics are ready');
