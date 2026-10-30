// No rendering, speech synthesis, network calls or edits to supplied assets.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {overlayD1a} from './desk-d1a-overlay_gpt_20261026.mjs';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1a_gpt_20261026';
assert.equal(cache,'/private/tmp/ys/ys-chain-d1a_gpt_20261026');
const read=f=>JSON.parse(fs.readFileSync(f));
const immutable=read(cache+'/immutable-inputs_gpt_20261026.json');
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
for(const [file,expected] of Object.entries(immutable.protectedInputs))assert.equal(sha(file),expected,'Protected asset changed: '+file);
const clip=read(cache+'/ys-chain-d1a.json'), data=read(cache+'/blender/data.json');
let samples=0;const cueKeys=[],errors=[];
for(const scene of clip.scenes)for(let i=0;i<scene.cues.length;i++){
 const q=scene.cues[i],cap=scene.captions[i],key=q.diagram.replace(/^cd1a-/,'');cueKeys.push(key);
 const d=data.cues.find(c=>c.key===key);assert.ok(d);assert.equal(d.start,cap.start);assert.equal(d.end,cap.end);assert.equal(d.subtitle,q.subtitle);
 for(const p of [.03,.2,.4,.6,.8,.97]){
  const t=cap.start+(cap.end-cap.start)*p;
  try{
   const svg=overlayD1a({t,clip,scene,cue:q,cap,k:i,anchor:()=>[540,780,true]});
   assert.ok(!/NaN|undefined/.test(svg));
   assert.ok(!/cd1v1-|c11v6-/.test(svg));
   await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">'+svg+'</svg>')).resize(270,480).png().toBuffer();
   samples++;
  }catch(e){errors.push({key,t,error:e.message});}
 }
}
assert.equal(cueKeys.length,54);assert.equal(new Set(cueKeys).size,54);assert.equal(new Set(data.cues.map(c=>c.row)).size,40);
const mix=read(cache+'/ys-chain-d1a.mix.json'),levels=read(cache+'/ys-chain-d1a.levels.json');
assert.equal(sha(cache+'/ys-chain-d1a.voice.wav'),immutable.voiceSha256);assert.equal(mix.voiceSha256,immutable.voiceSha256);
assert.equal(sha(cache+'/ys-chain-d1a.wav'),mix.mixSha256);
assert.ok(Math.abs(levels.integrated_lufs+14)<=.5);assert.ok(levels.peak_dbfs<=-1.5);assert.equal(levels['quiet_runs_below_-35dB_0.25s'].length,0);
const result={episode:'d1a',samples,cues:cueKeys.length,rows:40,errors,voiceUnchanged:true,protectedInputsUnchanged:true,loudness:levels.integrated_lufs,peak:levels.peak_dbfs,sfx:levels.sfx.length,earListening:'NOT PERFORMED; mechanical audio check only',actual3DVisualReview:'Parent task responsibility; synthetic anchors only in this check'};
fs.writeFileSync(cache+'/pipeline-check_gpt_20261026.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));assert.equal(errors.length,0);

