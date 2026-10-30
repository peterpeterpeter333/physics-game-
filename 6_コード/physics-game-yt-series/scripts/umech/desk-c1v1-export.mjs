// C-1 専用の非破壊書き出し。支給されたvoice.wavと元ID.wavは上書きしない。
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const source=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1',cache=source+'/render-cache',out=source+'/out',id='ys-chain-c1v1';
fs.mkdirSync(cache,{recursive:true});fs.mkdirSync(out,{recursive:true});
for(const ext of ['mp4','json','jpg'])if(fs.existsSync(out+'/'+id+'.'+ext))throw Error('Existing output retained; ask the coordinator before replacing '+out+'/'+id+'.'+ext);
const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
if(hash(source+'/'+id+'.wav')!==hash(source+'/'+id+'.voice.wav'))throw Error('Original voice differs from retained copy');
const desk=source+'/blender/desk',meta=JSON.parse(fs.readFileSync(desk+'/meta.json'));
if(meta.missing!==0||meta.frames!==Math.ceil(JSON.parse(fs.readFileSync(source+'/'+id+'.json')).duration*30))throw Error('Incomplete 3D');
const link=(src,dst)=>{if(!fs.existsSync(dst))fs.symlinkSync(src,dst);else if(fs.realpathSync(dst)!==fs.realpathSync(src))throw Error('Unexpected existing file '+dst);};
for(const name of ['plan.json',id+'.json','phrase-times.json',id+'.voice.wav'])link(source+'/'+name,cache+'/'+name);
link(source+'/'+id+'.mixed.wav',cache+'/'+id+'.wav');link(source+'/blender',cache+'/blender');
const env={...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'};
const started=Date.now(),r=spawnSync(process.execPath,['scripts/umech/desk-axes-render-entry.mjs',id],{env,stdio:'inherit'});if(r.status)process.exit(r.status);
fs.writeFileSync(source+'/c1-export.json',JSON.stringify({seconds:(Date.now()-started)/1000,video:out+'/'+id+'.mp4',voiceSha256:hash(source+'/'+id+'.voice.wav'),mixSha256:hash(source+'/'+id+'.mixed.wav'),originalUnchanged:hash(source+'/'+id+'.wav')===hash(source+'/'+id+'.voice.wav')},null,1));
