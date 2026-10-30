// Tiny-picture mux probe only; no video production or Blender. Invoke explicitly.
// Uses the unchanged S4 mix and the final export's exact timing options.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
const C='/private/tmp/ys/ys-chain-d1b_s4_gpt_20261027',ID='ys-chain-d1b',F=14813,R=30;
assert.ok(process.argv.includes('--run'),'Pass --run after review');assert.equal(process.env.EM_FILM_CACHE??C,C);
const dir=path.join(C,'qa/encode-probe'),file=path.join(dir,'probe-14813.mp4'),record=path.join(dir,'result.json');for(const p of [file,record])assert.equal(fs.existsSync(p),false);
fs.mkdirSync(dir,{recursive:true});const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const args=['-n','-v','error','-f','lavfi','-i','color=c=black:s=16x16:r=30:d='+F/R,'-i',path.join(C,ID+'.wav'),'-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','-r','30','-frames:v',String(F),'-af','apad=whole_dur='+F/R,'-c:a','aac','-b:a','96k','-movflags','+faststart',file];
const encoded=spawnSync(ff,args,{encoding:'utf8',maxBuffer:1<<20});assert.equal(encoded.status,0,encoded.stderr);
const probe=spawnSync(ff,['-v','info','-i',file,'-map','0:v:0','-an','-f','null','-'],{encoding:'utf8',maxBuffer:1<<20});const match=[...(probe.stderr??'').matchAll(/frame=\s*(\d+)/g)].at(-1),actual=match?+match[1]:null;assert.equal(probe.status,0);assert.equal(actual,F,'Timing mux probe lost a frame');
fs.writeFileSync(record,JSON.stringify({frames:actual,fps:R,videoDuration:F/R,immutableMixInput:true,timingOptionsMatchFinal:true,probePictureOnly:[16,16],notNativeQualityEvidence:true,command:[ff,...args]},null,1)+'\n',{flag:'wx'});console.log(JSON.stringify({record,frames:actual}));
