// Run the unchanged required inspectors in a new per-film validation directory.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const [ep,video]=process.argv.slice(2);assert(['b1','c1','d1','e1'].includes(ep));assert(fs.existsSync(video));
const id='ys-chain-'+ep+'v1',source=process.env.AXES_FINAL_SOURCE??('/private/tmp/ys/'+id+(ep==='d1'?'-render':'')),qa=source+'/validation-final-v1',letter=ep[0].toUpperCase();
fs.mkdirSync(qa,{recursive:true});
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const voice=path.resolve('scripts/blender/desk_assets/'+ep+'v1/'+id+'.wav');
const link=(a,b)=>{if(fs.existsSync(b)){assert.equal(fs.realpathSync(a),fs.realpathSync(b));return;}fs.symlinkSync(a,b);};
for(const file of ['plan.json',id+'.json','phrase-times.json',id+'.wav','blender'])link(source+'/'+file,qa+'/'+file);
link(voice,qa+'/'+id+'.voice.wav');
const script=path.resolve('docs/video-revision-20260924/ytseries/chain-'+ep[0]+'-1.mjs'),md=path.resolve('docs/video-revision-20260924/deep/技術の疑問の鎖_'+letter+'-1_第1版_ナレーション.md');
const immutable={script:sha(script),md:sha(md),voice:sha(voice)};
const env={...process.env,EM_FILM_CACHE:qa,NEMO_URL:'http://127.0.0.1:50123',GATE_NPZ:qa+'/quality-frames-original.npz',PYTHONDONTWRITEBYTECODE:'1',FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'};
delete env.DESK_ALLOW_MISSING;
const py='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python';
const tests=[
 ['chain-desk-lint',process.execPath,['scripts/umech/chain-desk-lint.mjs',script,id,md]],
 ...['check-readings','prosody','prosody-speaker'].map(n=>[n,py,['scripts/umech/'+n+'.py',qa+'/plan.json']]),
 ['qx-verify',process.execPath,['scripts/umech/qx-verify.mjs',id,video]],
 ['mxr-review',process.execPath,['scripts/umech/mxr-review.mjs']],
 ['desk-quality-gate',process.execPath,['--import','./scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-quality-gate.mjs',id,'--cache',qa,'--mp4',video,'--script',script,'--md',md,'--ref','ys-chain-1-1v6']]
];
const results=[];
for(const [name,bin,args]of tests){
 const log=qa+'/'+name+'.log',fd=fs.openSync(log,'w'),started=Date.now();console.log('START',id,name);
 const r=spawnSync(bin,args,{env,stdio:['ignore',fd,fd]});fs.closeSync(fd);
 results.push({name,exitCode:r.status,seconds:(Date.now()-started)/1000,log,error:r.error?.message});
 fs.writeFileSync(qa+'/checks.json',JSON.stringify({id,video,immutable,results},null,1));console.log('END',name,r.status);
}
assert.equal(sha(script),immutable.script);assert.equal(sha(md),immutable.md);assert.equal(sha(voice),immutable.voice);
console.log(JSON.stringify({id,qa,results},null,1));if(results.some(r=>r.exitCode!==0))process.exitCode=1;
