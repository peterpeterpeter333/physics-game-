// Read-only checks against the already-supplied scripts/voice. Never synthesize audio.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const root=process.cwd(),out=path.resolve('outputs/axes-20261023/input-checks-20261024');
assert(!fs.existsSync(out),'Preserve existing check evidence');fs.mkdirSync(out);
const py='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python';
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const protectedFiles=[];
for(const e of ['b1','c1','d1','e1']){
 const id='ys-chain-'+e+'v1',cache='/private/tmp/ys/'+id;
 protectedFiles.push(cache+'/plan.json',cache+'/'+id+'.json',cache+'/phrase-times.json',cache+'/'+id+'.wav',path.resolve('docs/video-revision-20260924/ytseries/chain-'+e[0]+'-1.mjs'),path.resolve('docs/video-revision-20260924/deep/技術の疑問の鎖_'+e[0].toUpperCase()+'-1_第1版_ナレーション.md'));
}
const before=Object.fromEntries(protectedFiles.map(p=>[p,sha(p)])),results=[];
for(const e of ['b1','c1','d1','e1']){
 const id='ys-chain-'+e+'v1',cache='/private/tmp/ys/'+id;
 const script='docs/video-revision-20260924/ytseries/chain-'+e[0]+'-1.mjs',md='docs/video-revision-20260924/deep/技術の疑問の鎖_'+e[0].toUpperCase()+'-1_第1版_ナレーション.md';
 const tests=[['chain-desk-lint',process.execPath,['scripts/umech/chain-desk-lint.mjs',script,id,md]],...['check-readings','prosody','prosody-speaker'].map(n=>[n,py,['-B','scripts/umech/'+n+'.py',cache+'/plan.json']])];
 for(const [name,bin,args] of tests){
  const log=out+'/'+e+'-'+name+'.log',fd=fs.openSync(log,'wx'),t=Date.now();
  const r=spawnSync(bin,args,{cwd:root,env:{...process.env,EM_FILM_CACHE:cache,NEMO_URL:'http://127.0.0.1:50123',PYTHONDONTWRITEBYTECODE:'1'},stdio:['ignore',fd,fd],timeout:180000});fs.closeSync(fd);
  const result={id,name,exitCode:r.status,signal:r.signal,seconds:(Date.now()-t)/1000,log,error:r.error?.message};results.push(result);console.log(JSON.stringify(result));
  fs.writeFileSync(out+'/results.json',JSON.stringify({scope:'Original supplied input checks, not final MP4 approval',results,before},null,1));
 }
}
for(const [p,h] of Object.entries(before))assert.equal(sha(p),h,'Read-only checker changed supplied input: '+p);
fs.writeFileSync(out+'/results.json',JSON.stringify({scope:'Original supplied input checks, not final MP4 approval',allProtectedInputsUnchanged:true,results,before},null,1));
if(results.some(r=>r.exitCode!==0))process.exitCode=1;
