// Approved C-1 encode, retaining all supplied inputs and the prior mix.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1',cache=root+'/render-r13-cache',out=root+'/out',id='ys-chain-c1v1';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const production=JSON.parse(fs.readFileSync(root+'/c1-production-r13.json')),review=JSON.parse(fs.readFileSync(root+'/c1-r13-human-qa.json')),mix=JSON.parse(fs.readFileSync(root+'/c1-r13-mix-provenance.json'));
assert(production.status==='done'&&production.missing===0&&review.readyForProduction&&review.allActualFramesViewed);
for(const [p,h] of Object.entries({...production.sourceSha256,...production.immutableInputSha256,...mix.protectedSha256}))assert.equal(hash(p),h,p);
assert.equal(hash(root+'/'+id+'.r13.mixed.wav'),mix.newMixSha256);
assert.equal(hash(root+'/'+id+'.wav'),hash(root+'/'+id+'.voice.wav'));
const meta=JSON.parse(fs.readFileSync(root+'/blender/desk/meta.json'));assert(meta.missing===0&&meta.frames===10814);
fs.mkdirSync(cache,{recursive:true});fs.mkdirSync(out,{recursive:true});
for(const ext of ['mp4','json','jpg'])assert(!fs.existsSync(out+'/'+id+'.'+ext),'Preserve prior output '+ext);
const link=(s,t)=>{if(fs.existsSync(t))assert.equal(fs.realpathSync(t),fs.realpathSync(s));else fs.symlinkSync(s,t);};
for(const f of ['plan.json',id+'.json','phrase-times.json',id+'.voice.wav'])link(root+'/'+f,cache+'/'+f);
link(root+'/'+id+'.r13.mixed.wav',cache+'/'+id+'.wav');link(root+'/blender',cache+'/blender');
const files=['./desk-c1v1-approved-frame.mjs','./desk-c1v1-approved-render-entry.mjs','./desk-axes-frame.mjs','./desk-c1v1-overlay.mjs','./desk-c1v1-final-export.mjs'],renderer=Object.fromEntries(files.map(f=>{const p=new URL(f,import.meta.url).pathname;return[p,hash(p)];}));
const env={...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'},started=Date.now();
const r=spawnSync(process.execPath,['scripts/umech/desk-c1v1-approved-render-entry.mjs',id],{env,stdio:'inherit'});if(r.status)process.exit(r.status);
for(const [p,h] of Object.entries({...production.sourceSha256,...production.immutableInputSha256,...mix.protectedSha256,...renderer}))assert.equal(hash(p),h,p);
const video=out+'/'+id+'.mp4';assert(fs.statSync(video).size>1e6);
fs.writeFileSync(root+'/c1-export-r13.json',JSON.stringify({date:new Date().toISOString(),seconds:(Date.now()-started)/1000,video,videoSha256:hash(video),voiceSha256:hash(root+'/'+id+'.voice.wav'),mixSha256:mix.newMixSha256,originalInputsAndPreviousMixUnchanged:true,productionSourceSha256:production.sourceSha256,rendererSourceSha256:renderer,approvedOnlyC1Row34Face:C1Approval(),finalGateNotYetRun:true},null,1));
function C1Approval(){return {cameraSeconds:.8,fallSeconds:.81,face:'unchanged voiceEnd through existing cue end',suppliedPlanFaceUntouched:true};}
