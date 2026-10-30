// Assemble only actually rendered B corrections. Earlier candidate and gates
// remain untouched; holds point to their actual corrected source frame.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const base='/private/tmp/ys/ys-chain-b1v1';
const timing='/private/tmp/ys/ys-chain-b1v1-timing-final-20261024';
const camera='/private/tmp/ys/ys-chain-b1v1-camera-final-20261024';
const cache='/private/tmp/ys/ys-chain-b1v1-final2-20261024';
const id='ys-chain-b1v1',out=cache+'/out',desk=cache+'/blender/desk';
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const prod=read(base+'/b1-production-20261024.json');
const tp=read(timing+'/timing-patch.json'),cp=read(camera+'/camera-patch.json');
assert.equal(prod.status,'done');assert(cp.allPatchFramesActuallyRendered);
assert.equal(sha('scripts/blender/desk_b1v1.py'),cp.sourceSha256);
assert.equal(sha('scripts/blender/desk_axes_b1_camera_patch_v2_20261024.py'),cp.patchSourceSha256);
assert.equal(sha('scripts/blender/desk_axes_b1_timing_patch_20261024.py'),tp.patchSourceSha256);
for(const [p,h]of Object.entries(cp.protectedInputSha256))assert.equal(sha(p),h,p);
assert.equal(sha(base+'/'+id+'.wav'),tp.voiceSha256);
assert(!fs.existsSync(cache),'Preserve previous final2 output');
fs.mkdirSync(desk,{recursive:true});fs.mkdirSync(out);
const link=(a,b)=>{assert(fs.statSync(a).isFile());fs.symlinkSync(a,b);};
for(const name of ['plan.json',id+'.json','phrase-times.json'])link(base+'/'+name,cache+'/'+name);
link(base+'/'+id+'.wav',cache+'/'+id+'.voice.wav');
link(base+'/'+id+'.mixed.wav',cache+'/'+id+'.wav');
link(base+'/blender/desk/meta.json',desk+'/meta.json');
link(camera+'/blender/camera-motion.json',cache+'/blender/camera-motion.json');
const data=read(base+'/blender/data.json'),deriv=read(camera+'/field-pattern-derivative.json');
data.b1.fieldLines=deriv.fieldLines;
fs.writeFileSync(cache+'/blender/data.json',JSON.stringify(data,null,1));
const ba=read(base+'/blender/desk/anchors.json'),pa=read(camera+'/blender/patch/anchors.json');
const anchors=structuredClone(ba),records=[],n=cp.frames;
assert.equal(n,prod.frames);
for(let j=0;j<n;j++){
 const name=String(j).padStart(5,'0')+'.jpg',k=cp.replacementFrameToActualPatchFrame[j];
 let source,kind;
 if(k!==undefined){
  source=cp.raw+'/'+String(k).padStart(5,'0')+'.jpg';kind='actual-corrected-state-and-camera';
  for(const nm of Object.keys(anchors.anchors)){
   assert(pa.anchors[nm]?.[k],'Missing actual patched anchor '+nm+' frame '+k);
   anchors.anchors[nm][j]=pa.anchors[nm][k];
  }
 }else if(j>=tp.firstFrame&&j<=tp.lastFrame){source=tp.raw+'/'+name;kind='actual-word-timed-smallbox-correction';}
 else{source=prod.out+'/'+name;kind='unchanged-original-full-production';}
 assert(fs.statSync(source).size>1000,'Missing actual JPEG '+source);link(source,desk+'/'+name);
 records.push({frame:j,patchSourceFrame:k??null,source,kind,sha256:sha(source)});
}
assert(Object.values(anchors.anchors).every(a=>a.length===n));
fs.writeFileSync(desk+'/anchors.json',JSON.stringify(anchors));
fs.writeFileSync(cache+'/composite-provenance.json',JSON.stringify({id,frames:n,fps:30,baseProduction:prod,timingCorrection:tp,cameraAndExplanationCorrection:cp,fieldPattern:deriv,records,allAnchorsFromActualCorrespondingRawFrames:true,originalCandidatePreserved:true,finalMp4ReviewPending:true},null,1));
const protectedFiles=[base+'/plan.json',base+'/'+id+'.json',base+'/phrase-times.json',base+'/'+id+'.wav',base+'/'+id+'.mixed.wav','scripts/blender/desk_b1v1.py','scripts/umech/desk-b1v1-overlay.mjs','scripts/umech/desk-b1v1-review-overlay.mjs','scripts/umech/desk-b1v1-review-frame.mjs','scripts/umech/desk-b1v1-review-render-entry.mjs'];
const hashes=Object.fromEntries(protectedFiles.map(p=>[path.resolve(p),sha(p)]));
const start=Date.now(),r=spawnSync(process.execPath,['scripts/umech/desk-b1v1-review-render-entry.mjs',id],{env:{...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'},stdio:'inherit'});
assert.equal(r.status,0,'B final2 encode failed');
for(const [p,h]of Object.entries(hashes))assert.equal(sha(p),h,p);
const video=out+'/'+id+'.mp4';assert(fs.statSync(video).size>1e6);
fs.writeFileSync(cache+'/export.json',JSON.stringify({id,video,sha256:sha(video),frames:n,seconds:(Date.now()-start)/1000,encoder:'unchanged CRF18 encoder with B-only approved-scope visual correction wrapper',protectedInputSha256:hashes,finalVideoReviewPending:true},null,1));
console.log(video);
