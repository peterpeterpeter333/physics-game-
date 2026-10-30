// Preserve all original final-gate output; prepare only case-specific evidence.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const c=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1v1-production-r15';
const mp4=process.argv[2]??c+'/out-final-d1v1/ys-chain-d1v1.mp4';
const gate=process.env.D1_FINAL_GATE_CACHE??c+'/final-gate-d1v1-r15';
if(!fs.existsSync(mp4)||fs.existsSync(gate))throw Error('Real final MP4 and fresh final gate cache required');
const npz=gate+'/d1-original-frame-samples.npz';
const env={...process.env,EM_FILM_CACHE:c,D1_FINAL_GATE_CACHE:gate,GATE_NPZ:npz};delete env.DESK_ALLOW_MISSING;
const py=process.env.PQ_PYTHON??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python';
const preflight=c+'/required-checks-d1v1-r15';if(fs.existsSync(preflight))throw Error('Existing D1 required-check evidence preserved');fs.mkdirSync(preflight);
for(const f of ['plan.json','ys-chain-d1v1.json','phrase-times.json','ys-chain-d1v1.voice.wav','ys-chain-d1v1.wav','blender'])fs.symlinkSync(c+'/'+f,preflight+'/'+f);
const required=[
 ['chain-desk-lint',process.execPath,['scripts/umech/chain-desk-lint.mjs','docs/video-revision-20260924/ytseries/chain-d-1.mjs','ys-chain-d1v1','docs/video-revision-20260924/deep/技術の疑問の鎖_D-1_第1版_ナレーション.md']],
 ...['check-readings','prosody','prosody-speaker'].map(n=>[n,py,['scripts/umech/'+n+'.py',preflight+'/plan.json']]),
 ['mxr-review',process.execPath,['scripts/umech/mxr-review.mjs']],
];
const requiredResults=[];
for(const [name,bin,args]of required){const log=preflight+'/'+name+'.log',fd=fs.openSync(log,'w'),start=Date.now();console.log('D1 required START',name);const r=spawnSync(bin,args,{env:{...env,EM_FILM_CACHE:preflight,NEMO_URL:process.env.NEMO_URL??'http://127.0.0.1:50123'},stdio:['ignore',fd,fd]});fs.closeSync(fd);requiredResults.push({name,exitCode:r.status,seconds:(Date.now()-start)/1000,log,error:r.error?.message??null});fs.writeFileSync(preflight+'/checks.json',JSON.stringify(requiredResults,null,1));console.log('D1 required END',name,r.status);}
const r=spawnSync(process.execPath,['scripts/umech/desk-d1v1-final-gates.mjs',mp4],{env,stdio:'inherit'});
if(!fs.existsSync(gate+'/quality-gate.json')||!fs.existsSync(npz))throw Error('Original gate did not produce complete facts');
const q=JSON.parse(fs.readFileSync(gate+'/quality-gate.json')),v=JSON.parse(fs.readFileSync(gate+'/d1-final-validator-results.json'));
const unresolved=q.results.filter(x=>x.status==='NG'&&!['7','7b'].includes(String(x.no)));
// The written common instruction is stricter than the untouched original gate
// (2 s rather than its calibrated 4 s). Keep that separate fact; never rewrite
// the gate result or silently let its pass imply the written criterion passed.
const commonSparse={longestSeconds:q.metrics?.sparse_longest??null,maxExclusiveSeconds:2,pass:Number.isFinite(q.metrics?.sparse_longest)&&q.metrics.sparse_longest<2,originalGateUnchanged:true};
const request=c+'/d1-supplement-requests.json';
if(fs.existsSync(request))throw Error('Preserve existing D1 evidence request');
const a=spawnSync(py,['scripts/umech/desk-axes-d1-supplement-candidates.py','--gate',gate+'/quality-gate.json','--npz',npz,'--out',request],{env,encoding:'utf8',maxBuffer:1e7});
fs.writeFileSync(gate+'/d1-supplement-request-generation.log',(a.stdout??'')+(a.stderr??''));
if(a.status!==0)throw Error('D1 candidate request generation failed');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const record={episode:'D-1',mp4,path:gate,mp4Sha256:sha(mp4),originalValidatorExit:r.status,originalGatePass:q.pass,originalNG:q.results.filter(x=>x.status==='NG'),allOriginalNGPreserved:true,commonInstructionSparseCriterion:commonSparse,unresolvedNonSupplementableNG:unresolved,requiredChecks:requiredResults,qxVerify:v.qxVerify,physicalAndVisualSupplementRequests:request,supplementaryDecision:(!q.pass||!commonSparse.pass)?'PENDING: no sample or gate has been waived automatically':'Original numerical criteria passed; actual full visual review remains required',automaticApproval:false,captionException:'Existing user-approved four-ID 1.65 s caption loader only',originalGateSourceSha256:sha('scripts/umech/desk-quality-gate.mjs'),originalFrameGateSourceSha256:sha('scripts/umech/desk-quality-gate-frames.py')};
fs.writeFileSync(gate+'/d1-original-and-supplement-pending.json',JSON.stringify(record,null,1));
console.log(JSON.stringify(record,null,1));
if(v.qxVerify.exitCode!==0||unresolved.length||requiredResults.some(x=>x.exitCode!==0))process.exit(1);
if(!q.pass||!commonSparse.pass)process.exit(2); // Distinct pending evidence, not a false all-pass.
