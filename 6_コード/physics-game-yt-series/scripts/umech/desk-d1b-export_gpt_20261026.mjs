// D-1 後編（ys-chain-d1b）の書き出し（Claude 2026-10-26）。desk-d1v1-export.mjs を写して ID と読み込みの差し替えを変えた。
// 3D のコマ・anchors・meta・声・mix を確かめてから、今の版と同じ CRF18 の書き出し（render-all-films-gptv2.mjs）を、
// desk-d1b-hooks_gpt_20261026.mjs（後編の札への振り分け）を読み込んで動かす。共通のファイルは変えない。
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const id='ys-chain-d1b',source=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1b_gpt_20261026';
const out=process.env.D1B_EXPORT_OUT??source+'/out',cache=source+'/export-cache-d1b';
const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const supplied=new URL('../blender/desk_assets/d1b/'+id+'.wav',import.meta.url);
const voice=source+'/'+id+'.voice.wav',mix=source+'/'+id+'.wav';
const provenance=JSON.parse(fs.readFileSync(source+'/'+id+'.mix.json'));
if(hash(voice)!==hash(supplied)||hash(voice)!==provenance.voiceSha256)throw Error('D1b supplied voice changed');
if(hash(mix)!==provenance.mixSha256)throw Error('D1b mixed audio changed');
const timed=JSON.parse(fs.readFileSync(source+'/'+id+'.json')),nf=Math.ceil(timed.duration*30),desk=source+'/blender/desk';
const absent=Array.from({length:nf},(_,j)=>path.join(desk,String(j).padStart(5,'0')+'.jpg')).filter(f=>!fs.existsSync(f));
if(absent.length)throw Error(`Incomplete D1b 3D: ${absent.length}/${nf}, first ${absent[0]}`);
const anchors=JSON.parse(fs.readFileSync(desk+'/anchors.json'));
if(anchors.frames!==nf||anchors.fps!==30||!Object.values(anchors.anchors).every(a=>a.length===nf))throw Error('Incomplete D1b anchors');
const meta=JSON.parse(fs.readFileSync(desk+'/meta.json'));
if(meta.frames!==nf||meta.fps!==30||meta.key!==anchors.key)throw Error('D1b 3D provenance mismatch');
if(fs.existsSync(out+'/'+id+'.mp4'))throw Error('Existing D1b MP4 is preserved; use a new D1B_EXPORT_OUT');
fs.mkdirSync(cache,{recursive:true});fs.mkdirSync(out,{recursive:true});
function link(src,dst){if(!fs.existsSync(dst))fs.symlinkSync(src,dst);else if(fs.realpathSync(dst)!==fs.realpathSync(src))throw Error('Unexpected export input '+dst);}
for(const f of ['plan.json',id+'.json','phrase-times.json',id+'.voice.wav',id+'.wav'])link(source+'/'+f,cache+'/'+f);
link(source+'/blender',cache+'/blender');
const env={...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'};
delete env.DESK_ALLOW_MISSING;
const hooks=new URL('./desk-d1b-hooks_gpt_20261026.mjs',import.meta.url).pathname;
const start=Date.now(),result=spawnSync(process.execPath,['--import',hooks,'scripts/render-all-films-gptv2.mjs',id],{env,stdio:'inherit'});
if(result.status!==0)process.exit(result.status??1);
const record={episode:'D-1 後編',video:out+'/'+id+'.mp4',frames:nf,fps:30,duration:timed.duration,seconds:(Date.now()-start)/1000,renderKey:meta.key,voiceSha256:hash(voice),mixSha256:hash(mix),videoSha256:hash(out+'/'+id+'.mp4'),suppliedVoiceUnchanged:hash(voice)===hash(supplied),hooks:'scripts/umech/desk-d1b-hooks_gpt_20261026.mjs'};
fs.writeFileSync(out+'/d1b-export.json',JSON.stringify(record,null,1));console.log(JSON.stringify(record,null,1));

