// Native S4 only. No Blender start, no QA upscale, no overwrite, no speech generation.
// node THIS --source-key <actual key> --adopt-2d-primary
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import sharp from 'sharp';
import {CACHE,ID,hash,inputs,exactFrame} from './desk-d1b-stage_s4_gpt_20261027.mjs';
const args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);return i<0?null:args[i+1];},key=opt('--source-key');
assert.ok(key&&/^[a-f0-9]{20}$/.test(key),'Pass the actual reviewed S4 source key');
const stage=inputs(),meta=stage.read('blender/desk/meta.json');
const timingProbe=stage.read('qa/encode-probe/result.json');assert.equal(timingProbe.frames,stage.nf);assert.equal(timingProbe.timingOptionsMatchFinal,true,'Approve the no-truncation mux probe before final encoding');
assert.equal(meta.key,key);assert.equal(meta.frames,stage.nf);assert.equal(meta.fps,30);assert.equal(meta.stage,'S4');
assert.ok(typeof meta.finished==='string'&&Number.isFinite(Date.parse(meta.finished)),'S4 raw production is not finished');
assert.ok(!meta.previewOnly&&!meta.sampleOnly&&!stage.anchors.previewOnly&&!stage.anchors.sampleOnly);assert.equal(stage.anchors.key,key);
const voice=path.join(CACHE,ID+'.voice.wav'),mix=path.join(CACHE,ID+'.wav'),provenance=stage.read(ID+'.mix.json');
assert.equal(hash(voice),hash(stage.suppliedVoice),'Immutable voice changed');assert.equal(hash(voice),provenance.voiceSha256);assert.equal(hash(mix),provenance.mixSha256);
for(let j=0;j<stage.nf;j++){const info=await sharp(exactFrame(stage,j)).metadata();assert.equal(info.width,1080,'Non-native S4 raw at '+j);assert.equal(info.height,1920);}
const dir=path.join(CACHE,'out'),file=path.join(dir,ID+'.mp4'),partial=path.join(dir,ID+'.partial.mp4'),record=path.join(dir,'s4-export_20261027.json');
for(const f of [file,partial,record])assert.equal(fs.existsSync(f),false,'Preserve existing S4 output: '+f);
const primaryPath=path.join(CACHE,'blender/primary.json'),helper=new URL('./desk-d1b-primary2d_s4_gpt_20261027.mjs',import.meta.url).pathname;
if(args.includes('--adopt-2d-primary')){
 const before=path.join(CACHE,'blender/primary-3d-before-overlay_s4_gpt_20261027.json'),merged=path.join(CACHE,'blender/primary-with-row28-for-export_s4_gpt_20261027.json');
 fs.copyFileSync(primaryPath,before,fs.constants.COPYFILE_EXCL);
 const p=spawnSync(process.execPath,[helper,'--primary-in',before,'--out',merged],{stdio:'inherit'});assert.equal(p.status,0,'Actual SVG primary merge failed');
 assert.equal(hash(primaryPath),hash(before),'Concurrent 3D primary change');fs.copyFileSync(merged,primaryPath);
}else{const p=spawnSync(process.execPath,[helper,'--primary-in',primaryPath,'--verify-existing'],{stdio:'inherit'});assert.equal(p.status,0,'Actual SVG primary must be explicitly adopted first');}
const primary=stage.read('blender/primary.json'),valid=Object.entries(primary).filter(([j,b])=>Number.isInteger(+j)&&+j>=0&&+j<stage.nf&&Array.isArray(b)&&b.length===5&&b.slice(0,4).every(Number.isFinite)&&typeof b[4]==='string'&&b[0]<=b[2]&&b[1]<=b[3]).length;
assert.ok(valid>=stage.nf*.90,'Incomplete full-production primary coverage');
await import('./desk-d1b-hooks_s4_gpt_20261027.mjs');const {vertFrame}=await import('./frame-vert.mjs');
fs.mkdirSync(dir,{recursive:true});
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
// Do not truncate to nominal audio duration: that discarded the final S3 image.
// Feed every raw frame, cap video by integer frame count, and pad only trailing
// mix silence to the 30fps frame-grid end. The immutable input WAV is not edited.
const videoDuration=stage.nf/30;
const argv=['-n','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size','1080x1920','-framerate','30','-i','pipe:0','-i',mix,'-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r','30','-frames:v',String(stage.nf),'-af','apad=whole_dur='+videoDuration,'-c:a','aac','-b:a','96k','-movflags','+faststart',partial];
const child=spawn(ff,argv,{stdio:['pipe','inherit','inherit']}),finished=once(child,'close');let stdinError=null;child.stdin.on('error',e=>{stdinError=e;});
const started=Date.now(),pending=new Map();
function prepare(j){const t=j/30,s=stage.clip.scenes.find(s=>t>=s.start&&t<s.end)??stage.clip.scenes.at(-1),svg=vertFrame(stage.clip,s,t);assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg),'Invalid S4 SVG at '+j);const p=sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).removeAlpha().raw().toBuffer();p.catch(()=>{});return p;}
try{
 for(let j=0;j<Math.min(2,stage.nf);j++)pending.set(j,prepare(j));
 for(let j=0;j<stage.nf;j++){const rgb=await pending.get(j);pending.delete(j);assert.equal(rgb.length,1080*1920*3);if(j+2<stage.nf)pending.set(j+2,prepare(j+2));if(stdinError)throw stdinError;if(!child.stdin.write(rgb))await once(child.stdin,'drain');if(j%600===0)console.log('S4 native composite',j,'/',stage.nf);}
 child.stdin.end();const [code]=await finished;assert.equal(code,0,'Native encode failed');fs.renameSync(partial,file);
}catch(error){child.stdin.destroy();child.kill('SIGTERM');console.error('S4 partial preserved at '+partial);throw error;}
const probe=spawnSync(ff,['-v','info','-i',file,'-map','0:v:0','-an','-f','null','-'],{encoding:'utf8',maxBuffer:4<<20});
const match=[...(probe.stderr??'').matchAll(/frame=\s*(\d+)/g)].at(-1),encodedFrames=match?+match[1]:null;
assert.equal(probe.status,0,'Actual native MP4 decode failed');assert.equal(encodedFrames,stage.nf,'Encoded video lost a raw frame');
const result={stage:'S4',video:file,resolution:[1080,1920],native:true,samples:16,fps:30,inputFrames:stage.nf,encodedFrames,nominalAudioDuration:stage.clip.duration,videoDuration,trailingMixSilencePadding:videoDuration-stage.clip.duration,sourceKey:key,voiceSha256:hash(voice),mixSha256:hash(mix),immutableWavsUnchanged:true,qaUpscale:false,elapsedSeconds:(Date.now()-started)/1000,actualNativeDecode:true,allVisualsReviewed:false,earsPerformed:false};
fs.writeFileSync(record,JSON.stringify(result,null,1)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
