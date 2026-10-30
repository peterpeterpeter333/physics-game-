// Independent r7 review cache. Keep all r4 probe images/JSON as historical proof.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const source='/private/tmp/ys/ys-chain-c1v1',cache=source+'/r7-preflight',mode=process.argv[2];
if(!['trial','probe'].includes(mode))throw Error('Expected trial or probe');
fs.mkdirSync(cache+'/blender',{recursive:true});
function link(s,t){if(fs.existsSync(t)){if(fs.realpathSync(t)!==fs.realpathSync(s))throw Error('Unexpected preflight link '+t);}else fs.symlinkSync(s,t);}
for(const f of ['plan.json','ys-chain-c1v1.json','phrase-times.json'])link(source+'/'+f,cache+'/'+f);
for(const f of ['data.json','preview','catalog'])link(source+'/blender/'+f,cache+'/blender/'+f);
link(source+'/problem',cache+'/problem');
const env={...process.env,EM_FILM_CACHE:cache,C1_QA_EXTRA:'0,1,2,358,359,360,214,215,216,331,332,333'};
function run(bin,args){const r=spawnSync(bin,args,{env,stdio:'inherit'});if(r.status!==0)throw Error(bin+' exit '+r.status);}
if(mode==='trial')run(process.execPath,['scripts/umech/desk-c1v1-preview.mjs']);
else{
 link(source+'/blender/probe1s-r7',cache+'/blender/probe1s');
 run(process.execPath,['scripts/umech/desk-c1v1-probe1s.mjs']);
 run('/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python',['scripts/umech/audit-c1v1-probe1s.py']);
}
console.log('C1 r7 '+mode+' review at '+cache);
