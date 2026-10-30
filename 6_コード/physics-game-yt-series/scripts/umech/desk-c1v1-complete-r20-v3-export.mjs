// New C20-v3 final cache and unchanged CRF18 encoder. No Blender invocation.
// The v2 exporter, all prior evidence/candidates and the supplied voice stay intact.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url)),id='ys-chain-c1v1';
const gpu='/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r20',root=process.env.C1_FINAL_CACHE??'/private/tmp/ys/ys-chain-c1v1-complete-final-r20-v3',original='/private/tmp/ys/ys-chain-c1v1';
const prepare=process.argv.includes('--prepare-only'),read=p=>JSON.parse(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,1),{flag:'wx'});
assert.deepEqual(process.argv.slice(2),prepare?['--prepare-only']:[]);
assert(root!==gpu&&root!==original&&root.startsWith('/private/tmp/ys/ys-chain-c1v1-')&&root.endsWith('-v3'));
const qaPath=gpu+'/actual-patch-human-qa-v3.json',indexPath=gpu+'/actual-patch-review-v3/actual-patch-index.json';
const proof=read(gpu+'/camera-patch.json'),qa=read(qaPath),index=read(indexPath),mix=read(original+'/c1-r19-mix-provenance.json');
const production=read(original+'/c1-production-r13.json'),face=read(original+'/c1-r13-human-qa.json'),restored=read(gpu+'/restore.json');
assert.equal(proof.patchSourceSha256,'56e667659aa4c0e96f355058ec49c04bf24da68724c79fc92e7f05665f6d4350');assert.equal(proof.root,gpu);
assert(restored.matrixRestored&&restored.maximumAbsoluteMatrixDelta<1e-12&&restored.unchangedTolerance===1e-12&&restored.frozenInputsAndOtherSceneFilesVerified);
assert.equal(index.runtimeRestoreReceiptSha256,hash(gpu+'/restore.json'));
assert(production.status==='done'&&production.missing===0&&face.readyForProduction&&face.allActualFramesViewed);
assert(proof.allPatchJpegsActuallyRendered&&proof.r18AllNewCameraPrincipalWithin40to70AndUnclipped&&proof.cameraAndConfirmedSemanticHoldCorrectionOnly);
assert.equal(qa.patchProofSha256,hash(gpu+'/camera-patch.json'));assert.equal(qa.actualCompositeIndexSha256,hash(indexPath));
assert(qa.allActualPatchFramesViewed&&qa.actualImageDefectsRemaining===0&&qa.readyForExport&&qa.row38DelayedPointVerified&&qa.row7RevealVerified&&qa.allPhysicalCandidatesClassified&&qa.physicalCandidateSupplementAccepted);
assert.equal(qa.finalAcceptance,false);assert.equal(qa.earsVerified,false);assert.equal(qa.actualPatchFrames,1725);assert.equal(index.actualFrames,1725);
assert.equal(index.errors.length,0);assert.equal(index.actualFrames,proof.patchFrames.length);assert.equal(index.frames.length,proof.patchFrames.length);
assert.deepEqual(index.v3ChangedFrames,[9226,9227,9228,9229]);
for(const row of index.frames){assert.equal(hash(row.actualRaw),row.actualRawSha256,'Reviewed raw changed after QA');assert.equal(hash(row.file),row.sha256,'Reviewed composite changed after QA');}
const mixed=original+'/'+id+'.r19.mixed.wav';assert.equal(hash(mixed),mix.newMixSha256);
assert.equal(mix.newMixSha256,'5f3c480822cfbe84a20bddc86924d40c9153dc62acfc95f245a5b46652580690');
assert.equal(mix.voiceSha256,'57565f6d6f812410201859591b435be76279b36156acaa5baae19d0bdf358a48');
const sources=Object.fromEntries(['desk-c1v1-complete-frame-v3.mjs','desk-c1v1-complete-v3-render-entry.mjs','desk-c1v1-complete-v3-quality-loader.mjs','desk-c1v1-complete-frame-v2.mjs','desk-c1v1-complete-frame.mjs','desk-c1v1-final-frame.mjs','desk-c1v1-approved-frame.mjs','desk-axes-frame.mjs','desk-c1v1-overlay.mjs','desk-c1v1-complete-r20-v3-export.mjs','desk-c1v1-complete-r20-v3-human-qa.mjs','desk-c1v1-complete-r20-v3-checks-20261024.mjs','desk-axes-final-checks.mjs','desk-axes-caption165-loader.mjs','desk-quality-gate.mjs','desk-quality-gate-frames.py','../render-all-films-gptv2.mjs'].map(f=>{const p=fileURLToPath(new URL(f,import.meta.url));return[p,hash(p)];}));
assert.equal(sources[fileURLToPath(new URL('./desk-c1v1-complete-frame-v3.mjs',import.meta.url))],index.finalFrameSha256);
// Check every pin group before merging so duplicate paths cannot mask a mismatch.
for(const pins of [production.sourceSha256,production.immutableInputSha256,proof.patchDependencySha256,mix.protectedSha256,qa.evidenceSha256,sources])for(const[p,h]of Object.entries(pins))assert.equal(hash(p),h,p);
const frozen={...production.sourceSha256,...production.immutableInputSha256,...proof.patchDependencySha256,...mix.protectedSha256,...qa.evidenceSha256,...sources,[original+'/c1-r19-mix-provenance.json']:hash(original+'/c1-r19-mix-provenance.json'),[mixed]:mix.newMixSha256,[gpu+'/restore.json']:hash(gpu+'/restore.json'),[gpu+'/camera-patch.json']:hash(gpu+'/camera-patch.json'),[qaPath]:hash(qaPath),[indexPath]:hash(indexPath)};
for(const[p,h]of Object.entries(frozen))assert.equal(hash(p),h,p);
const drawingLinks=['plan.json',id+'.json','phrase-times.json','blender','final-held-dimensions.json','r11-probe-preflight','actual-patch-review-v3','actual-patch-human-qa-v3.json'];
if(!fs.existsSync(root)){
 fs.mkdirSync(root);for(const f of drawingLinks)fs.symlinkSync(gpu+'/'+f,root+'/'+f);
 fs.symlinkSync(mixed,root+'/'+id+'.wav');fs.symlinkSync(original+'/'+id+'.voice.wav',root+'/'+id+'.voice.wav');fs.symlinkSync(original+'/problem',root+'/problem');
 write(root+'/camera-patch.json',{...proof,root,actualDrawingCache:gpu,actualDrawingProofSha256:hash(gpu+'/camera-patch.json'),completedCompositor:sources,originalC17CandidatePreserved:true,originalC20V2EvidencePreserved:true,mixedAudioIsNewSfxTimingDerivative:true,mixedAudioSha256:mix.newMixSha256,mixProvenance:original+'/c1-r19-mix-provenance.json',mixProvenanceSha256:hash(original+'/c1-r19-mix-provenance.json'),voiceSha256:mix.voiceSha256,finalActualMp4ReviewPending:true});
 write(root+'/complete-cache.json',{date:new Date().toISOString(),revision:'C20-v3',gpu,root,gpuProofSha256:hash(gpu+'/camera-patch.json'),actualCompositeIndexSha256:hash(indexPath),humanQaSha256:hash(qaPath),mixedAudioSha256:mix.newMixSha256,voiceSha256:mix.voiceSha256,frozen,rawNotRewritten:true,finalMp4NotYetExported:true});
}else{
 const saved=read(root+'/complete-cache.json');assert.equal(saved.revision,'C20-v3');assert.equal(saved.gpuProofSha256,hash(gpu+'/camera-patch.json'));assert.equal(saved.actualCompositeIndexSha256,hash(indexPath));assert.equal(saved.humanQaSha256,hash(qaPath));assert.equal(saved.mixedAudioSha256,hash(mixed));assert.deepEqual(saved.frozen,frozen);
 for(const[p,h]of Object.entries(saved.frozen))assert.equal(hash(p),h,p);
}
assert(!fs.lstatSync(root).isSymbolicLink(),'Final cache must be its own new directory');
for(const f of drawingLinks)assert.equal(fs.realpathSync(root+'/'+f),fs.realpathSync(gpu+'/'+f),'Wrong actual source: '+f);
assert.equal(fs.realpathSync(root+'/'+id+'.wav'),fs.realpathSync(mixed));assert.equal(fs.realpathSync(root+'/'+id+'.voice.wav'),fs.realpathSync(original+'/'+id+'.voice.wav'));
assert.equal(hash(root+'/'+id+'.wav'),mix.newMixSha256);assert.equal(hash(root+'/'+id+'.voice.wav'),mix.voiceSha256);
const meta=read(root+'/blender/desk/meta.json');assert(meta.frames===10814&&meta.missing===0);
for(let j=0;j<10814;j++)assert(fs.statSync(root+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg').size>1024);
if(prepare){console.log(JSON.stringify({prepared:root,drawCache:gpu,composite:'complete-frame-v3',mixSha256:mix.newMixSha256,voiceSha256:mix.voiceSha256,notEncoded:true}));process.exit(0);}
const out=root+'/out';assert(!fs.existsSync(out),'Preserve prior MP4');assert(!fs.existsSync(root+'/'+id+'.rendering.mp4'),'Preserve any interrupted partial');fs.mkdirSync(out);
const started=Date.now(),env={...process.env,EM_FILM_CACHE:root,FILM_OUTPUT:out,FILM_COPY_AUDIO:'0',FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'};
const result=spawnSync(process.execPath,['scripts/umech/desk-c1v1-complete-v3-render-entry.mjs',id],{cwd:W,env,stdio:'inherit'});
if(result.error)throw result.error;assert.equal(result.status,0,'Unchanged encoder did not finish successfully');
for(const[p,h]of Object.entries(frozen))assert.equal(hash(p),h,p);
const video=out+'/'+id+'.mp4';assert(fs.statSync(video).size>1e6);
write(root+'/c1-final-export.json',{date:new Date().toISOString(),revision:'C20 mandatory actions with exact complete-frame-v3 HUD-fade repair',seconds:(Date.now()-started)/1000,cache:root,actualDrawingCache:gpu,video,videoSha256:hash(video),voiceSha256:mix.voiceSha256,mixSha256:mix.newMixSha256,mixedAudioIsNotTheOldMix:true,suppliedVoiceWaveformUnchanged:true,patchProofSha256:hash(root+'/camera-patch.json'),gpuPatchProofSha256:hash(gpu+'/camera-patch.json'),patchHumanQaSha256:hash(qaPath),actualCompositeIndexSha256:hash(indexPath),rendererSourceSha256:sources,encoder:'unchanged render-all-films-gptv2.mjs CRF18',finalGateNotYetRun:true,finalActualMp4NotYetReviewed:true,earsVerified:false});
