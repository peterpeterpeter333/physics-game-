// Only wait for the root-started native540 job, then assemble its exact clocks.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const W=path.resolve(fileURLToPath(new URL('../..',import.meta.url)));
const R=path.join(W,'outputs/ys-chain-b2a-backup/S4修正03_20261030');
const receipt=path.join(R,'連続試写_描画記録.json');
while(!fs.existsSync(receipt))await new Promise(resolve=>setTimeout(resolve,55000));
const native=JSON.parse(fs.readFileSync(receipt));
if(!native.completed)throw Error('Trial native job failed: '+JSON.stringify(native));
const code=await new Promise((resolve,reject)=>{
 const c=spawn(process.execPath,['scripts/umech/prepare-and-assemble-b2a-r03-trial_gpt_20261030.mjs',
 'assemble','--variant','v01','--manifest',path.join(R,'連続試写_manifest.json')],{cwd:W,stdio:'inherit'});
 c.on('error',reject);c.on('close',resolve);
});
process.exitCode=code;
