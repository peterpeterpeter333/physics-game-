import fs from'node:fs';import assert from'node:assert/strict';import{spawnSync}from'node:child_process';import{createHash}from'node:crypto';
// Same three original inspectors in the root's allowed local-network context.
// Retains the first agent-side sandbox failures without replacing any log.
const C='/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025';
const out=C+'/root-nemo-three-retry-20261025';assert(!fs.existsSync(out));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const first=C+'/required-checks-d1v1-r15/checks.json',old=JSON.parse(fs.readFileSync(first));
const names=['check-readings','prosody','prosody-speaker'];assert(names.every(n=>old.some(x=>x.name===n&&x.exitCode===1)));
const exp=JSON.parse(fs.readFileSync(C+'/export.json'));assert.equal(exp.videoSha256,'a75bb51396f4e90ab88a477e628aa4e42f8a5d1c7440f23f90b67c6e288f218f');assert.equal(sha(exp.video),exp.videoSha256);
const files=['plan.json','ys-chain-d1v1.json','phrase-times.json','ys-chain-d1v1.voice.wav','ys-chain-d1v1.wav'];
const pins=Object.fromEntries([...files.map(n=>C+'/'+n),...names.map(n=>'scripts/umech/'+n+'.py'),first].map(p=>[p,sha(p)]));
fs.mkdirSync(out);for(const n of [...files,'blender'])fs.symlinkSync(C+'/'+n,out+'/'+n);
const results=[];
for(const name of names){const log=out+'/'+name+'.log',fd=fs.openSync(log,'wx'),start=Date.now();const args=['-B','scripts/umech/'+name+'.py',out+'/plan.json'];const r=spawnSync('/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python',args,{env:{...process.env,EM_FILM_CACHE:out,NEMO_URL:'http://127.0.0.1:50123',PYTHONDONTWRITEBYTECODE:'1'},stdio:['ignore',fd,fd]});fs.closeSync(fd);results.push({name,args,exitCode:r.status,error:r.error?.message??null,seconds:(Date.now()-start)/1000,log,logSha256:sha(log)});console.log(name,r.status);}
for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h);
fs.writeFileSync(out+'/checks.json',JSON.stringify({episode:'D-1',video:exp.video,videoSha256:exp.videoSha256,originalSandboxFailures:{file:first,sha256:sha(first),preserved:true},reason:'Only local-network execution context differs. Same original inspector files and exact final source/audio.',results,protectedInputSha256:pins,sourceAudioCaptionsChanged:false,earListeningPerformed:false,originalGateNGPreserved:true,allThreeMechanicalPass:results.every(x=>x.exitCode===0)},null,2)+'\n',{flag:'wx'});
if(results.some(x=>x.exitCode!==0))process.exitCode=1;
