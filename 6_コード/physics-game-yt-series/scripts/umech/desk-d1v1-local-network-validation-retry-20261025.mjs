// Repeat only the three local-network checks denied by the previous sandbox.
// All failed attempts stay intact. No narration, captions or inspector changes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const cache='/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025';
const old=cache+'/required-checks-d1v1-r15',out=cache+'/required-local-network-retry-20261025';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const checks=JSON.parse(fs.readFileSync(old+'/checks.json'));
const names=['check-readings','prosody','prosody-speaker'];
assert(names.every(n=>checks.find(r=>r.name===n)?.exitCode===1));
assert(names.every(n=>fs.readFileSync(old+'/'+n+'.log','utf8').includes('Operation not permitted')));
assert(!fs.existsSync(out));
const files=[old+'/checks.json',...names.flatMap(n=>[old+'/'+n+'.log','scripts/umech/'+n+'.py']),cache+'/plan.json',cache+'/ys-chain-d1v1.voice.wav',cache+'/ys-chain-d1v1.wav'];
const inputSha256=Object.fromEntries(files.map(p=>[p,sha(p)]));
fs.mkdirSync(out);
const results=[];
for(const name of names){
 const started=Date.now(),fd=fs.openSync(out+'/'+name+'.log','wx');
 const r=spawnSync('/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python',['scripts/umech/'+name+'.py',old+'/plan.json'],{env:{...process.env,NEMO_URL:'http://127.0.0.1:50123'},stdio:['ignore',fd,fd]});
 fs.closeSync(fd);results.push({name,exitCode:r.status,error:r.error?.message??null,seconds:(Date.now()-started)/1000,log:out+'/'+name+'.log'});
}
for(const[p,h]of Object.entries(inputSha256))assert.equal(sha(p),h,p);
const record={episode:'D-1',reason:'Original attempts failed solely because localhost network permission was absent; permission is now explicitly granted.',previousChecks:old+'/checks.json',previousAttemptsPreserved:true,inputSha256,results,allThreeExitZero:results.every(r=>r.exitCode===0),narrationAndCaptionsChanged:false,earsVerified:false,finalAcceptance:false};
fs.writeFileSync(out+'/retry-results.json',JSON.stringify(record,null,1),{flag:'wx'});
console.log(JSON.stringify(record,null,1));assert(record.allThreeExitZero);
