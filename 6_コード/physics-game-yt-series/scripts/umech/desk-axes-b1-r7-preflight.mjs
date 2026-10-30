// Actual all-range visual evidence, no final-MP4 claim or relaxed image limits.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const revision=process.env.B1_FINAL_REV??'r7';
if(!/^r[0-9]+$/.test(revision))throw Error('Invalid B1 review revision');
const c='/private/tmp/ys/ys-chain-b1v1',marker=c+'/blender/b1-'+revision+'-probe-complete.json';
const started=Date.now();
while(!fs.existsSync(marker)){
 if(Date.now()-started>3600000)throw Error('B1 probe not ready within1hour');
 await new Promise(r=>setTimeout(r,2000));
}
const p=JSON.parse(fs.readFileSync(marker)),env={...process.env,B1_RAW:p.raw,B1_TIMES:JSON.stringify(p.times),B1_REVIEW_OUT:c+'/review-probe1s-b1v1-'+revision,B1_AUDIT_SVG:'1'};
let r=spawnSync(process.execPath,['scripts/umech/desk-b1v1-review.mjs'],{env,stdio:'inherit'});if(r.status)process.exit(r.status??1);
r=spawnSync('/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python',['scripts/umech/desk-axes-probe-audit.py',c,p.raw,c+'/blender/b1-'+revision+'-probe-audit.json'],{stdio:'inherit'});
if(r.status)process.exit(r.status??1);
console.log('B1 latest full-range original diagnostics and actual sheets ready; unreviewed until explicitly viewed.');
