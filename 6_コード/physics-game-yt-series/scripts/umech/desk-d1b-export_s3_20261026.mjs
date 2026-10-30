// S3 only: native540x960/30fps draft, canonical captions + immutable Nemo voice.
// node THIS --source-key <S3 Blender render key> [--adopt-2d-primary] [--qa-copy]
// --qa-copy creates a separate1080x1920 reference copy, never replaces the draft.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import sharp from 'sharp';
import {CACHE,ID,hash,inputs,exactFrame} from './desk-d1b-stage_s3_20261026.mjs';
const args=process.argv.slice(2),value=k=>{const i=args.indexOf(k);return i<0?null:args[i+1];};
const key=value('--source-key');assert.ok(key&&/^[a-f0-9]{20,64}$/.test(key),'Pass the actual S3 Blender source key');
const stage=inputs(),meta=stage.read('blender/desk/meta.json');
assert.equal(meta.key,key,'S3 source key mismatch');assert.equal(meta.frames,stage.nf);assert.equal(meta.fps,30);
assert.ok(typeof meta.finished==='string'&&Number.isFinite(Date.parse(meta.finished)),'Full S3 raw render is not finished');
assert.ok(!meta.previewOnly&&!meta.sampleOnly&&!stage.anchors.previewOnly&&!stage.anchors.sampleOnly,'S2 sample caches cannot be exported as S3');
assert.equal(stage.anchors.key,key,'S3 anchor source key mismatch');
const voice=path.join(CACHE,ID+'.voice.wav'),mix=path.join(CACHE,ID+'.wav'),provenance=stage.read(ID+'.mix.json');
assert.equal(hash(voice),hash(stage.suppliedVoice),'Supplied voice changed');assert.equal(hash(voice),provenance.voiceSha256);assert.equal(hash(mix),provenance.mixSha256);
for(let j=0;j<stage.nf;j++){
 const raw=exactFrame(stage,j),info=await sharp(raw).metadata();assert.equal(info.width,540,'Wrong S3 raw width at '+j);assert.equal(info.height,960,'Wrong S3 raw height at '+j);
}
const dir=path.join(CACHE,'draft'),file=path.join(dir,ID+'_draft.mp4'),partial=path.join(dir,ID+'_draft.partial.mp4'),record=path.join(dir,'s3-export_20261026.json');
for(const f of [file,partial,record])assert.equal(fs.existsSync(f),false,'Preserve existing S3 output: '+f);
const primaryPath=path.join(CACHE,'blender/primary.json'),primaryHelper=new URL('./desk-d1b-primary2d_s3_20261026.mjs',import.meta.url).pathname;
if(args.includes('--adopt-2d-primary')){
 const preserved=path.join(CACHE,'blender/primary-3d-before-overlay_s3_20261026.json'),merged=path.join(CACHE,'blender/primary-with-row28-for-export_s3_20261026.json');
 fs.copyFileSync(primaryPath,preserved,fs.constants.COPYFILE_EXCL);
 const p=spawnSync(process.execPath,[primaryHelper,'--primary-in',preserved,'--out',merged],{stdio:'inherit'});assert.equal(p.status,0,'2D primary merge failed');
 assert.equal(hash(primaryPath),hash(preserved),'3D primary changed concurrently');
 // Explicit flag authorizes adoption ONLY in the new S3 cache; its3D source is preserved.
 fs.copyFileSync(merged,primaryPath);
}else{
 const p=spawnSync(process.execPath,[primaryHelper,'--primary-in',primaryPath,'--verify-existing'],{stdio:'inherit'});
 assert.equal(p.status,0,'Adopt actual row28 SVG bounds first, or pass --adopt-2d-primary');
}
const primary=stage.read('blender/primary.json'),validPrimary=Object.entries(primary).filter(([j,b])=>Number.isInteger(+j)&&+j>=0&&+j<stage.nf&&Array.isArray(b)&&b.length===5&&b.slice(0,4).every(Number.isFinite)&&typeof b[4]==='string'&&b[0]<=b[2]&&b[1]<=b[3]).length;
assert.ok(validPrimary>=stage.nf*.90,'Full S3 per-frame primary coverage is incomplete; face-only frames may be omitted');
await import('./desk-d1b-hooks_s3_20261026.mjs');
const {vertFrame}=await import('./frame-vert.mjs');
fs.mkdirSync(dir,{recursive:true});
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const ffargs=['-n','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size','540x960','-framerate','30','-i','pipe:0','-i',mix,'-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r','30','-c:a','aac','-b:a','96k','-t',String(stage.clip.duration),'-movflags','+faststart',partial];
const child=spawn(ff,ffargs,{stdio:['pipe','inherit','inherit']}),finished=once(child,'close');let stdinError=null;child.stdin.on('error',e=>{stdinError=e;});
const started=Date.now(),pending=new Map();
function prepare(j){
 const t=j/30,scene=stage.clip.scenes.find(s=>t>=s.start&&t<s.end)??stage.clip.scenes.at(-1),svg=vertFrame(stage.clip,scene,t);
 assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg),'Invalid S3 SVG at '+j);
 // SVG is constructed synchronously; only Sharp rasterization has a two-frame look-ahead.
 const job=sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).resize(540,960,{fit:'fill'}).removeAlpha().raw().toBuffer();
 job.catch(()=>{});return job;
}
try{
 for(let j=0;j<Math.min(2,stage.nf);j++)pending.set(j,prepare(j));
 for(let j=0;j<stage.nf;j++){
  const rgb=await pending.get(j);pending.delete(j);assert.equal(rgb.length,540*960*3);
  if(j+2<stage.nf)pending.set(j+2,prepare(j+2));
  if(stdinError)throw stdinError;
  if(!child.stdin.write(rgb))await once(child.stdin,'drain');
  if(j%600===0)console.log('S3 composite',j,'/',stage.nf);
 }
 child.stdin.end();const [code]=await finished;assert.equal(code,0,'S3 encoding failed');
 fs.renameSync(partial,file);
}catch(error){
 child.stdin.destroy();child.kill('SIGTERM');console.error('S3 stopped; partial output is preserved at '+partial);throw error;
}
let qaCopy=null;
if(args.includes('--qa-copy')){
 qaCopy=path.join(dir,ID+'_draft_qa1080.mp4');assert.equal(fs.existsSync(qaCopy),false);
 const p=spawnSync(ff,['-n','-v','error','-i',file,'-vf','scale=1080:1920:flags=lanczos','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',qaCopy],{stdio:'inherit'});
 assert.equal(p.status,0,'Could not create the authorized S3 reference-only upscale');
}
const result={stage:'S3',video:file,resolution:[540,960],fps:30,frames:stage.nf,duration:stage.clip.duration,sourceKey:key,voiceSha256:hash(voice),suppliedVoiceUnchanged:true,mixSha256:hash(mix),qaCopy,qaCopyReferenceOnly:true,elapsedSeconds:(Date.now()-started)/1000,checksRun:false,allVisualsReviewed:false,next:'Run existing checks against the reference-only copy, review S3, report, STOP for Claude. No S4.'};
fs.writeFileSync(record,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result,null,2));
