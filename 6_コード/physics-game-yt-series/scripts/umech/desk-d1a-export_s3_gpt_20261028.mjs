// A S3 native540 draft only; exact full raw/captions, immutable supplied voice.
// node THIS --source-key <reviewed Blender key> [--qa-copy]
// Optional1080 reference is explicitly an upscale, never native-quality evidence.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import sharp from 'sharp';
import {CACHE,ID,hash,inputs,exactFrame,realInput} from './desk-d1a-stage_s3_gpt_20261028.mjs';
const args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);return i<0?null:args[i+1];},key=opt('--source-key');
assert.ok(key&&/^[a-f0-9]{20,64}$/.test(key),'Pass the actual reviewed A S3 source key');
const stage=inputs(),meta=stage.read('blender/desk/meta.json');
assert.equal(meta.key,key);assert.equal(meta.frames,stage.nf);assert.equal(meta.fps,30);assert.equal(meta.stage,'S3');
assert.ok(typeof meta.finished==='string'&&Number.isFinite(Date.parse(meta.finished)),'A S3 raw production is not finished');
assert.ok(!meta.previewOnly&&!meta.sampleOnly&&!stage.anchors.previewOnly&&!stage.anchors.sampleOnly);assert.equal(stage.anchors.key,key);
const voice=realInput(path.join(CACHE,ID+'.voice.wav')),mix=realInput(path.join(CACHE,ID+'.s3c.mixed.wav')),stem=realInput(path.join(CACHE,ID+'.s3c.bgm.wav'));
const provenance=stage.read(ID+'.s3c.mix.json'),bgm=stage.read(ID+'.s3c.voice-bgm.json'),levels=stage.read(ID+'.s3c.levels.json');
assert.equal(hash(voice),hash(stage.suppliedVoice));assert.equal(hash(voice),provenance.voiceSha256);assert.equal(hash(mix),provenance.mixSha256);assert.equal(hash(stem),provenance.bgmStemSha256);
assert.equal(provenance.actualWordEventsSha256,hash(realInput(path.join(CACHE,'word-events-actual_s3_20261028.json'))),'Mix and overlay must use the same actual-word timing map');
assert.equal(provenance.speechRegenerated,false);assert.equal(provenance.BGMOnlyRevision,true);assert.equal(provenance.samples,Math.round(stage.clip.duration*provenance.sampleRate));
assert.equal(bgm.pass,true);assert.ok(bgm.medianVoiceMinusBgmDb>=15);assert.equal(bgm.musicDuckDepth,.9);assert.equal(bgm.bedDuckDepth,.75);assert.equal(bgm.voiceReferencePercentile,25);assert.equal(bgm.fastSolvePattern,false);assert.equal(bgm.solveGainBoost,false);
assert.ok(Math.abs(levels.integrated_lufs+14)<=.3);assert.ok(levels.peak_dbfs<=-1.45);assert.equal(levels['quiet_runs_below_-35dB_0.25s']?.length,0);
for(let j=0;j<stage.nf;j++){const m=await sharp(exactFrame(stage,j)).metadata();assert.equal(m.width,540,'Non-native S3 raw at '+j);assert.equal(m.height,960);}
const primary=stage.read('blender/primary.json'),pm=stage.read('blender/primary-metadata.json');
assert.deepEqual(pm.logicalResolution,[1080,1920]);assert.equal(pm.fps,30);assert.ok(pm.frames);
let valid=0,eligible=0,excludedFullFace=0;
for(let j=0;j<stage.nf;j++){
 const m=pm.frames[String(j)];assert.ok(m,'Missing primary metadata at '+j);assert.equal(m.frame,j);assert.ok(Math.abs(m.time-j/30)<1e-7);
 if(m.excludedFullFace===true){assert.equal(m.sizeApplicable,false);excludedFullFace++;continue;}
 assert.equal(m.sizeApplicable,true,'Non-face primary eligibility must be explicit at '+j);assert.ok(m.excludedFullFace===undefined||m.excludedFullFace===false,'Ambiguous full-face metadata at '+j);eligible++;
 const b=primary[String(j)];if(Array.isArray(b)&&b.length===5&&b.slice(0,4).every(Number.isFinite)&&typeof b[4]==='string'&&b[0]<=b[2]&&b[1]<=b[3])valid++;
}
assert.ok(eligible>0&&valid>=eligible*.90,'Incomplete primary coverage of actual non-full-face frames');
const dir=path.join(CACHE,'draft'),file=path.join(dir,ID+'_draft.mp4'),partial=path.join(dir,ID+'_draft.partial.mp4'),record=path.join(dir,'s3-export_20261028.json');
const qaCopy=args.includes('--qa-copy')?path.join(dir,ID+'_draft_qa1080.mp4'):null;
for(const f of [file,partial,record,qaCopy].filter(Boolean))assert.equal(fs.existsSync(f),false,'Preserve previous S3 outputs: '+f);
await import('./desk-d1a-hooks_s3_gpt_20261028.mjs');const {vertFrame}=await import('./frame-vert.mjs');fs.mkdirSync(dir,{recursive:true});
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1',videoDuration=stage.nf/30;
// All integer raw indices are encoded. Only the mix tail is silence-padded in the
// mux; no nominal -t cutoff or -shortest, and no WAV file is changed.
const ffargs=['-n','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size','540x960','-framerate','30','-i','pipe:0','-i',mix,'-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r','30','-frames:v',String(stage.nf),'-af','apad=whole_dur='+videoDuration,'-c:a','aac','-b:a','96k','-movflags','+faststart',partial];
const child=spawn(ff,ffargs,{stdio:['pipe','inherit','inherit']}),finished=once(child,'close');let stdinError=null;child.stdin.on('error',e=>{stdinError=e;});const started=Date.now(),pending=new Map();
function prepare(j){const t=j/30,s=stage.clip.scenes.find(s=>t>=s.start&&t<s.end)??stage.clip.scenes.at(-1),svg=vertFrame(stage.clip,s,t);assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg),'Invalid S3 SVG at '+j);const job=sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).resize(540,960,{fit:'fill'}).removeAlpha().raw().toBuffer();job.catch(()=>{});return job;}
try{
 for(let j=0;j<Math.min(2,stage.nf);j++)pending.set(j,prepare(j));
 for(let j=0;j<stage.nf;j++){const rgb=await pending.get(j);pending.delete(j);assert.equal(rgb.length,540*960*3);if(j+2<stage.nf)pending.set(j+2,prepare(j+2));if(stdinError)throw stdinError;if(!child.stdin.write(rgb))await once(child.stdin,'drain');if(j%600===0)console.log('A S3 composite',j,'/',stage.nf);}
 child.stdin.end();const [code]=await finished;assert.equal(code,0,'A S3 encoding failed');fs.renameSync(partial,file);
}catch(error){child.stdin.destroy();child.kill('SIGTERM');console.error('Partial preserved at '+partial);throw error;}
const decode=spawnSync(ff,['-v','info','-i',file,'-map','0:v:0','-an','-f','null','-'],{encoding:'utf8',maxBuffer:4<<20}),m=[...(decode.stderr??'').matchAll(/frame=\s*(\d+)/g)].at(-1),encodedFrames=m?+m[1]:null;
assert.equal(decode.status,0,'Actual native S3 MP4 decode failed');assert.equal(encodedFrames,stage.nf,'Encoded MP4 lost a raw frame');
if(qaCopy){const p=spawnSync(ff,['-n','-v','error','-i',file,'-vf','scale=1080:1920:flags=lanczos','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',qaCopy],{stdio:'inherit'});assert.equal(p.status,0,'S3 reference-only upscale failed');}
assert.equal(hash(voice),provenance.voiceSha256);assert.equal(hash(mix),provenance.mixSha256);assert.equal(hash(stem),provenance.bgmStemSha256);
const result={stage:'S3',video:file,resolution:[540,960],native:true,samples:4,fps:30,inputFrames:stage.nf,encodedFrames,nominalAudioDuration:stage.clip.duration,videoDuration,trailingMixSilencePadding:videoDuration-stage.clip.duration,sourceKey:key,voiceSha256:hash(voice),mixSha256:hash(mix),selectedMix:mix,bgmStem:stem,medianVoiceMinusBgmDb:bgm.medianVoiceMinusBgmDb,immutableWavsUnchanged:true,primaryValidFrames:valid,primaryEligibleFrames:eligible,excludedFullFaceFrames:excludedFullFace,primaryCoverageDenominator:'Actual non-full-face frames only, from complete primary-metadata',qaCopy,qaCopyReferenceOnly:!!qaCopy,elapsedSeconds:(Date.now()-started)/1000,actualNativeDecode:true,allVisualsReviewed:false,earsPerformed:false,next:'Existing checks plus complete visual review; then report S3 and STOP for Claude. No S4.'};
fs.writeFileSync(record,JSON.stringify(result,null,1)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
