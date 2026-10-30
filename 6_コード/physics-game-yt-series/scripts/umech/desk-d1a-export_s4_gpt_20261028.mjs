// One actual native1080 S4 export. No upscale, trimming, source edits or synthesis.
// EM_FILM_CACHE=<S4> node THIS --source-key <final-reviewed-key>
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import sharp from 'sharp';
import {CACHE,ID,FPS,NF,hash,inputs,exactFrame,realInput,PUMP_CAPTION_LAYOUT,LOWER_CAPTION_LAYOUT} from './desk-d1a-stage_s4_gpt_20261028.mjs';
const args=process.argv.slice(2),i=args.indexOf('--source-key'),key=i<0?null:args[i+1];
assert.ok(key&&/^[a-f0-9]{20,64}$/.test(key),'Pass the actual final reviewed S4 render key');
assert.equal(args.includes('--qa-copy'),false,'S4 is native1080, never an upscale');
const stage=inputs(),meta=stage.meta;assert.equal(meta.key,key);assert.equal(stage.anchors.key,key);
const voice=realInput(path.join(CACHE,ID+'.voice.wav'));
const mix=realInput(path.join(CACHE,ID+'.s4v3.mixed.wav')),stem=realInput(path.join(CACHE,ID+'.s4v3.bgm.wav'));
const provenance=stage.read(ID+'.s4v3.mix.json'),bgm=stage.read(ID+'.s4v3.voice-bgm.json'),levels=stage.read(ID+'.s4v3.levels.json');
assert.equal(hash(voice),hash(stage.suppliedVoice));assert.equal(hash(voice),provenance.voiceSha256);
assert.equal(hash(mix),provenance.mixSha256);assert.equal(hash(stem),provenance.bgmStemSha256);
assert.equal(provenance.stage,'S4');assert.equal(provenance.speechRegenerated,false);assert.equal(provenance.suppliedVoiceSamplesEdited,false);
assert.equal(provenance.BGMOnlyRevision,false);assert.equal(provenance.BGMAndSFXTimingRevision,true);
assert.deepEqual(provenance.SFXRetimed,['inlet_close']);assert.equal(provenance.originalS3InputsUnchanged,true);
assert.equal(provenance.actualWordEventsSha256,hash(realInput(path.join(CACHE,'word-events-actual_s3_20261028.json'))));
assert.equal(provenance.visualSceneSourceKey,key,'SFX and actual rendered scene must use the same reviewed source key');
assert.equal(provenance.sampleRate,24000);assert.equal(provenance.samples,Math.round(stage.clip.duration*provenance.sampleRate));
assert.equal(bgm.pass,true);assert.ok(bgm.p10VoiceMinusBgmDb>=10&&bgm.medianVoiceMinusBgmDb>=15);
assert.equal(provenance.p10VoiceMinusBgmDb,bgm.p10VoiceMinusBgmDb);assert.equal(provenance.medianVoiceMinusBgmDb,bgm.medianVoiceMinusBgmDb);
assert.equal(bgm.musicDuckDepth,.9);assert.equal(bgm.bedDuckDepth,.75);assert.ok([15,25].includes(bgm.voiceReferencePercentile));
assert.equal(bgm.fastSolvePattern,false);assert.equal(bgm.solveGainBoost,false);
assert.ok(Math.abs(levels.integrated_lufs+14)<.3);assert.ok(levels.peak_dbfs<=-1.45);
assert.equal(levels['quiet_runs_below_-35dB_0.25s']?.length,0);
const timingPath=realInput(levels.visualSfxTiming.path),timing=JSON.parse(fs.readFileSync(timingPath,'utf8'));
assert.equal(hash(timingPath),provenance.sfxTimingSha256);assert.equal(hash(timingPath),levels.visualSfxTiming.sha256);
assert.equal(timing.sceneSourceKey,key);assert.equal(timing.schema,'D1a-S4-visual-SFX-timing-v1');assert.equal(timing.fps,FPS);
const close=timing.events.inlet_close;assert.equal(close.frame,levels.visualSfxTiming.inletCloseFrame);
assert.ok(Number.isInteger(close.frame)&&Math.abs(close.time-close.frame/FPS)<1e-8);
const closeHits=levels.sfx.filter(x=>x.name==='inlet_close');assert.equal(closeHits.length,1);
assert.ok(Math.abs(closeHits[0].time-close.frame/FPS)<=.000051);
for(let j=0;j<NF;j++){
 const info=await sharp(exactFrame(stage,j)).metadata();
 assert.equal(info.width,1080,'Raw is not native1080 at '+j);assert.equal(info.height,1920);
}
const primary=stage.read('blender/primary.json'),pm=stage.read('blender/primary-metadata.json');
assert.deepEqual(pm.logicalResolution,[1080,1920]);assert.equal(pm.fps,FPS);assert.equal(pm.sourceKey,key);
const keys=Array.from({length:NF},(_,j)=>String(j));
assert.deepEqual(Object.keys(primary).sort((a,b)=>a-b),keys,'Every actual frame needs a primary entry, including explicit null');
assert.deepEqual(Object.keys(pm.frames).sort((a,b)=>a-b),keys,'Every actual frame needs primary metadata');
let eligible=0,valid=0,excluded=0;const invalidFrames=[];
for(let j=0;j<NF;j++){
 const m=pm.frames[String(j)],b=primary[String(j)];
 assert.equal(m.frame,j);assert.ok(Math.abs(m.time-j/FPS)<1e-7);
 if(m.excludedFullFace===true){assert.equal(m.sizeApplicable,false);assert.equal(b,null);excluded++;continue;}
 assert.equal(m.sizeApplicable,true);assert.ok(m.excludedFullFace===undefined||m.excludedFullFace===false);eligible++;
 if(Array.isArray(b)&&b.length===5&&b.slice(0,4).every(Number.isFinite)&&typeof b[4]==='string'&&b[0]<=b[2]&&b[1]<=b[3]){
  assert.equal(b[4],m.name);assert.deepEqual(b.slice(0,4),m.rawBoundsLogical);valid++;
 }else invalidFrames.push(j);
}
assert.ok(eligible>0&&valid>=eligible*.90,'Non-full-face actual-box coverage is below90%; never invent a box');
const immutableBefore={...stage.immutableHashes,[ID+'.s4v3.mixed.wav']:hash(mix),[ID+'.s4v3.bgm.wav']:hash(stem),[ID+'.s4v3.mix.json']:hash(path.join(CACHE,ID+'.s4v3.mix.json'))};
const dir=path.join(CACHE,'out'),file=path.join(dir,ID+'.mp4'),partial=path.join(dir,ID+'.partial.mp4'),record=path.join(dir,'s4-export_20261028.json');
for(const f of [file,partial,record])assert.equal(fs.existsSync(f),false,'Preserve previous S4 output '+f);
await import('./desk-d1a-hooks_s4_gpt_20261028.mjs');const {vertFrame}=await import('./frame-vert.mjs');
fs.mkdirSync(dir,{recursive:true});
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const videoDuration=NF/FPS,padding=videoDuration-stage.clip.duration;assert.ok(Math.abs(padding-.012)<1e-6);
const ffargs=['-n','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size','1080x1920','-framerate',String(FPS),'-i','pipe:0','-i',mix,'-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r',String(FPS),'-frames:v',String(NF),'-af','apad=whole_dur='+videoDuration,'-c:a','aac','-b:a','96k','-movflags','+faststart',partial];
const child=spawn(ff,ffargs,{stdio:['pipe','inherit','inherit']}),done=once(child,'close');let stdinError=null;
child.stdin.on('error',e=>{stdinError=e;});const pending=new Map(),started=Date.now();
function prepare(j){
 const t=j/FPS,s=stage.clip.scenes.find(s=>t>=s.start&&t<s.end)??stage.clip.scenes.at(-1),svg=vertFrame(stage.clip,s,t);
 assert.ok(svg&&!/NaN|undefined|Infinity/.test(svg.replace(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g,'data:image/checked')),'Invalid S4 SVG at '+j);
 const task=sharp(Buffer.from(svg)).flatten({background:'#0b1122'}).removeAlpha().raw().toBuffer({resolveWithObject:true}).then(({data,info})=>{
  assert.equal(info.width,1080);assert.equal(info.height,1920);assert.equal(info.channels,3);return data;
 });task.catch(()=>{});return task;
}
try{
 for(let j=0;j<Math.min(2,NF);j++)pending.set(j,prepare(j));
 for(let j=0;j<NF;j++){
  const rgb=await pending.get(j);pending.delete(j);assert.equal(rgb.length,1080*1920*3);
  if(j+2<NF)pending.set(j+2,prepare(j+2));if(stdinError)throw stdinError;
  if(!child.stdin.write(rgb))await once(child.stdin,'drain');if(j%600===0)console.log('A S4 native composite',j,'/',NF);
 }
 child.stdin.end();const [code]=await done;assert.equal(code,0,'Native S4 encoder failed');fs.renameSync(partial,file);
}catch(e){child.stdin.destroy();child.kill('SIGTERM');console.error('Partial S4 preserved at '+partial);throw e;}
const decoded=spawnSync(ff,['-v','info','-i',file,'-map','0:v:0','-an','-f','null','-'],{encoding:'utf8',maxBuffer:4<<20});
const last=[...(decoded.stderr??'').matchAll(/frame=\s*(\d+)/g)].at(-1),encodedFrames=last?+last[1]:null;
assert.equal(decoded.status,0,'Actual S4 MP4 decoding failed');assert.equal(encodedFrames,NF,'S4 MP4 lost a raw frame');
for(const [rel,digest] of Object.entries(immutableBefore))assert.equal(hash(realInput(path.join(CACHE,rel))),digest,'Input changed while encoding '+rel);
assert.equal(hash(timingPath),provenance.sfxTimingSha256);
const result={stage:'S4',video:file,sha256:hash(file),bytes:fs.statSync(file).size,native:true,resolution:[1080,1920],samples:16,fps:FPS,
 inputFrames:NF,encodedFrames,sourceKey:key,nominalAudioDuration:stage.clip.duration,videoDuration,trailingMixSilencePadding:padding,
 nativeRawDimensionsChecked:NF,scalingApplied:false,qaUpscaleProduced:false,actualNativeDecode:true,crf:18,
 voiceSha256:hash(voice),mixSha256:hash(mix),bgmStemSha256:hash(stem),selectedMix:mix,bgmStem:stem,
 speechRegenerated:false,immutableInputsUnchanged:true,medianVoiceMinusBgmDb:bgm.medianVoiceMinusBgmDb,p10VoiceMinusBgmDb:bgm.p10VoiceMinusBgmDb,
 primaryEligibleFrames:eligible,primaryValidFrames:valid,excludedFullFaceFrames:excluded,primaryInvalidFrames:invalidFrames,
 primaryCoverageDenominator:'Actual non-full-face frames; every frame has its own primary entry/metadata; no invented boxes',
 pumpCaptionLayout:PUMP_CAPTION_LAYOUT,
 lowerCaptionLayout:LOWER_CAPTION_LAYOUT,
 elapsedSeconds:(Date.now()-started)/1000,allVisualsReviewed:false,earsPerformed:false,allQualityChecksPassed:false,
 next:'Unmodified quality gate --require-primary, actual movie visual review, preservation and final report'};
fs.writeFileSync(record,JSON.stringify(result,null,1)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
