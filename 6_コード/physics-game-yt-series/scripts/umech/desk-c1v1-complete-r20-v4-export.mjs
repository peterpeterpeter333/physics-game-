// New layout-only C cache. Preparation has no Blender invocation or encode.
// Encoding requires a separately written root eye receipt for all 31 changed composites.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url)),id='ys-chain-c1v1',prior='/private/tmp/ys/ys-chain-c1v1-complete-final-r20-v3',root=process.env.C1_FINAL_CACHE??'/private/tmp/ys/ys-chain-c1v1-complete-final-r20-v4';
const prepare=process.argv.includes('--prepare-only'),read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,1),{flag:'wx'});
assert.deepEqual(process.argv.slice(2),prepare?['--prepare-only']:[]);
assert(root!==prior&&root.startsWith('/private/tmp/ys/ys-chain-c1v1-')&&root.endsWith('-v4'));
const old=read(prior+'/complete-cache.json'),oldExport=read(prior+'/c1-final-export.json'),oldIndex=prior+'/actual-final-review/actual-final-index.json';
assert.equal(sha(oldExport.video),'d04e7bdb0113889eb1cf111c49318cd8b4d86f6cfc9b8beea06f170df54b8093');assert.equal(oldExport.videoSha256,sha(oldExport.video));
for(const[p,h]of Object.entries(old.frozen))assert.equal(sha(p),h,p);
const files=['desk-c1v1-complete-frame-v4.mjs','desk-c1v1-complete-v4-hooks.mjs','desk-c1v1-complete-r20-v4-export.mjs','desk-c1v1-complete-r20-v4-layout-proof.mjs'];
const sources=Object.fromEntries(files.map(f=>{const p=fileURLToPath(new URL(f,import.meta.url));return[p,sha(p)];}));
const frozen={...old.frozen,...sources,[prior+'/complete-cache.json']:sha(prior+'/complete-cache.json'),[prior+'/c1-final-export.json']:sha(prior+'/c1-final-export.json'),[oldExport.video]:oldExport.videoSha256,[oldIndex]:sha(oldIndex)};
const links=['plan.json',id+'.json','phrase-times.json','blender','final-held-dimensions.json','r11-probe-preflight','actual-patch-review-v3','actual-patch-human-qa-v3.json','camera-patch.json','problem',id+'.wav',id+'.voice.wav'];
if(!fs.existsSync(root)){
 fs.mkdirSync(root);for(const f of links)fs.symlinkSync(prior+'/'+f,root+'/'+f);
 write(root+'/complete-cache.json',{date:new Date().toISOString(),revision:'C20-v4 first canonical chunk layout only',root,prior,actualDrawingCache:oldExport.actualDrawingCache,rawNotRewritten:true,noGpuRequired:true,oldV3CollisionRetainedInPriorEvidence:true,oldActualReviewDoesNotAcceptThisNewMp4:true,finalMp4NotYetExported:true,frozen});
}else assert.deepEqual(read(root+'/complete-cache.json').frozen,frozen);
assert(!fs.lstatSync(root).isSymbolicLink());
for(const f of links)assert.equal(fs.realpathSync(root+'/'+f),fs.realpathSync(prior+'/'+f));
for(const[p,h]of Object.entries(frozen))assert.equal(sha(p),h,p);
assert.equal(sha(root+'/'+id+'.voice.wav'),oldExport.voiceSha256);assert.equal(sha(root+'/'+id+'.wav'),oldExport.mixSha256);
if(prepare){console.log(JSON.stringify({prepared:root,prior,notEncoded:true,noGpu:true,compositor:'complete-frame-v4'}));process.exit(0);}
const proofPath=root+'/v4-layout-preview/layout-diff-proof.json',proof=read(proofPath),qaPath=root+'/c1-v4-layout-human-qa.json',qa=read(qaPath);
assert.equal(proof.allOutputFramesCompared,10814);assert.equal(proof.outsideScopeSvgByteEqualFrames,10783);assert.deepEqual(proof.changedFrames,Array.from({length:31},(_,i)=>4712+i));assert.equal(proof.onlyExactOriginalCaptionLayerTranslated,true);
assert.equal(qa.diffProofSha256,sha(proofPath));assert.deepEqual(qa.personallyViewedChangedFrames,proof.changedFrames);assert(qa.readyForEncode&&qa.actualImageDefectsRemaining===0&&qa.finalAcceptance===false);
for(const[p,h]of Object.entries(proof.inputsSha256))assert.equal(sha(p),h,p);
for(const f of [...proof.previews,...proof.sheets])assert.equal(sha(f.file),f.sha256,f.file);
const out=root+'/out';assert(!fs.existsSync(out),'Preserve prior MP4');assert(!fs.existsSync(root+'/'+id+'.rendering.mp4'),'Preserve interrupted encode');fs.mkdirSync(out);
const started=Date.now(),env={...process.env,EM_FILM_CACHE:root,FILM_OUTPUT:out,FILM_COPY_AUDIO:'0',FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'};
const r=spawnSync(process.execPath,['--import','./scripts/umech/desk-c1v1-complete-v4-hooks.mjs','scripts/render-all-films-gptv2.mjs',id],{cwd:W,env,stdio:'inherit'});if(r.error)throw r.error;assert.equal(r.status,0);
for(const[p,h]of Object.entries(frozen))assert.equal(sha(p),h,p);
const video=out+'/'+id+'.mp4';assert(fs.statSync(video).size>1e6);
write(root+'/c1-final-export.json',{date:new Date().toISOString(),revision:'C20-v4 first carry:order caption/speaker layout only',seconds:(Date.now()-started)/1000,cache:root,actualDrawingCache:oldExport.actualDrawingCache,video,videoSha256:sha(video),priorVideo:oldExport.video,priorVideoSha256:oldExport.videoSha256,voiceSha256:oldExport.voiceSha256,mixSha256:oldExport.mixSha256,suppliedVoiceWaveformUnchanged:true,allRawFramesUnchanged:true,layoutDiffProofSha256:sha(proofPath),layoutHumanQaSha256:sha(qaPath),rendererSourceSha256:sources,encoder:'unchanged render-all-films-gptv2.mjs CRF18',finalGateNotYetRun:true,finalActualMp4NotYetReviewed:true,earsVerified:false,finalAcceptance:false});
