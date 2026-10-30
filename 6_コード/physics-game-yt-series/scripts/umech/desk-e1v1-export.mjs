// Non-destructive E1 mux: only a private draw-cache copy uses the new mix.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const source='/private/tmp/ys/ys-chain-e1v1',cache='/private/tmp/ys/ys-chain-e1v1-render',id='ys-chain-e1v1',sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const voiceExpected='e9318ace4036f12ac4e6984d158d0d7d4853212a9252d8d6bdecea7105ed2707';
if(sha(source+'/'+id+'.wav')!==voiceExpected)throw Error('Canonical E1 voice changed');
const desk=source+'/blender/desk',d=JSON.parse(fs.readFileSync(source+'/blender/data.json')),nf=Math.ceil(d.duration*30);
for(let j=0;j<nf;j++)if(!fs.existsSync(desk+'/'+String(j).padStart(5,'0')+'.jpg'))throw Error('Missing E1 frame '+j);
const anc=JSON.parse(fs.readFileSync(desk+'/anchors.json'));if(Object.values(anc.anchors).some(a=>a.length!==nf))throw Error('Incomplete E1 anchors');
const prep=spawnSync(process.execPath,['scripts/umech/desk-e1v1-preview.mjs','final-cache'],{encoding:'utf8'});if(prep.status)throw Error(prep.stderr);process.stdout.write(prep.stdout);
if(fs.existsSync(cache+'/out/'+id+'.mp4'))throw Error('E1 video already exists; use a new output version');
const env={...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:cache+'/out',FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'};
const started=Date.now(),r=spawnSync(process.execPath,['scripts/umech/desk-axes-render-entry.mjs',id],{env,stdio:'inherit'});if(r.status)process.exit(r.status);
if(sha(source+'/'+id+'.wav')!==voiceExpected)throw Error('E1 source voice changed after export');
fs.writeFileSync(cache+'/e1v1-export.json',JSON.stringify({seconds:(Date.now()-started)/1000,video:cache+'/out/'+id+'.mp4',frames:nf,voiceSha256:voiceExpected,mixSha256:sha(source+'/'+id+'.mix.wav'),drawSeries:'E 時間と位置 1',originalUnchanged:true},null,2));
