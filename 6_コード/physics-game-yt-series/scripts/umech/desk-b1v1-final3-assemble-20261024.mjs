// Root-authorized B3 assembly. No Blender, no changed narration/caption/voice,
// no overwritten earlier candidate, no automatic exemption of original NGs.
// --prepare performs only actual-source joins; --encode is a separate action.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

assert(process.argv.includes('--authorized'),'Root authorization required');
const prepare=process.argv.includes('--prepare'),encode=process.argv.includes('--encode');
assert(prepare!==encode,'Choose exactly one of --prepare or --encode');
const root='/private/tmp/ys',id='ys-chain-b1v1',nf=10700,fps=30;
const base=root+'/ys-chain-b1v1-final2-20261024';
const original=root+'/ys-chain-b1v1';
const camera=root+'/ys-chain-b1v1-camera-final-20261024';
const needle=root+'/ys-chain-b1v1-challenge-b3-v2-20261024/render';
const hand=root+'/ys-chain-b1v1-small-gesture-20261024/render';
const entries=root+'/ys-chain-b1v1-score-entries-d1-v2-20261024/render';
const cache=root+'/ys-chain-b1v1-final3-20261024',desk=cache+'/blender/desk',out=cache+'/out';
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,1)+'\n',{flag:'wx'});
const jpg=j=>String(j).padStart(5,'0')+'.jpg';
const link=(a,b)=>{assert(fs.statSync(a).isFile(),a);assert(!fs.existsSync(b),b);fs.symlinkSync(path.resolve(a),b);};
const finitePose=p=>Array.isArray(p)&&p.length===7&&p.every(Number.isFinite);
const finiteBox=b=>Array.isArray(b)&&b.length===4&&b.every(Number.isFinite)&&b[0]<b[2]&&b[1]<b[3];
const clip=b=>b[0]<0||b[1]<0||b[2]>1080||b[3]>1920;
const samePose=(a,b)=>finitePose(a)&&finitePose(b)&&a.every((v,i)=>Math.abs(v-b[i])<=1e-9);
assert.equal(path.dirname(cache),root);assert(!fs.existsSync(cache)||!fs.lstatSync(cache).isSymbolicLink());
const protectedPaths=[
 'scripts/blender/desk_b1v1.py','scripts/blender/desk_lib_b1.py','scripts/blender/desk_lib.py',
 'docs/video-revision-20260924/ytseries/chain-b-1.mjs',
 'docs/video-revision-20260924/deep/技術の疑問の鎖_B-1_第1版_ナレーション.md',
 'scripts/render-all-films-gptv2.mjs','scripts/umech/desk-frame.mjs','scripts/umech/frame-vert.mjs',
 'scripts/umech/desk-quality-gate.mjs','scripts/umech/desk-axes-final-checks.mjs',
 'scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/desk-axes-frame.mjs',
 'scripts/umech/desk-b1v1-overlay.mjs','scripts/umech/desk-b1v1-review-overlay.mjs',
 'scripts/umech/desk-b1v1-review-frame.mjs','scripts/umech/desk-b1v1-final3-frame.mjs',
 'scripts/umech/desk-b1v1-final3-render-entry.mjs','scripts/umech/desk-b1v1-final3-quality-loader.mjs',
 'scripts/umech/desk-b1v1-final3-checks-20261024.mjs',
 'scripts/umech/desk-b1v1-final3-assemble-20261024.mjs',
 base+'/plan.json',base+'/'+id+'.json',base+'/phrase-times.json',base+'/'+id+'.voice.wav',base+'/'+id+'.wav',
 base+'/blender/data.json',base+'/blender/desk/anchors.json',base+'/composite-provenance.json',base+'/export.json',
 camera+'/camera-patch.json',camera+'/final-held-dimensions.json',
 needle+'/report.json',hand+'/report.json',entries+'/report.json',
 root+'/ys-chain-b1v1-final3-plan-v2-20261024.json',
 root+'/ys-chain-b1v1-retained-plan-20261024.json',
 root+'/ys-chain-b1v1-final3-live-plan-diagnosis-20261024.json'];
const verify=hashes=>{for(const [p,h]of Object.entries(hashes))assert.equal(sha(p),h,p);};
const inventory=p=>Object.fromEntries(fs.readdirSync(p).filter(n=>/^\d{5}\.jpg$/.test(n)).sort().map(n=>{
 const s=fs.statSync(p+'/'+n,{bigint:true});return[n,[Number(s.size),s.mtimeNs.toString(),fs.realpathSync(p+'/'+n)]];
}));

if(prepare){
 assert(!fs.existsSync(cache),'Preserve previous final3 candidate');
 const np=read(needle+'/report.json'),hp=read(hand+'/report.json'),ep=read(entries+'/report.json');
 const cp=read(camera+'/camera-patch.json'),baseline=read(base+'/composite-provenance.json');
 const plans=read(root+'/ys-chain-b1v1-final3-plan-v2-20261024.json');
 const live=read(root+'/ys-chain-b1v1-retained-plan-20261024.json');
 const diagnosis=read(root+'/ys-chain-b1v1-final3-live-plan-diagnosis-20261024.json');
 assert.equal(baseline.frames,nf);assert.equal(plans.frames,nf);
 assert.deepEqual(live.plans,plans.plans);assert(live.exactRenderFramesMatchOriginalMeta);
 assert.deepEqual(plans.counts,{render:3696,dup:7004});
 assert(diagnosis.exactLivePlanMatchesAll10700ByteProvenRawReferences);
 assert(diagnosis.all73PhysicalTimeExpressionsEqualHeldObjectSource);
 assert.equal(diagnosis.originalPlannerPassClaimed,false);
 assert(plans.all10700RawBytesAndHeldSourceHashesVerified&&plans.b2MotionOriginal609ActuallyReproduced);
 assert.equal(sha('scripts/blender/desk_b1v1.py'),plans.sourceSha256);
 assert.equal(cp.sourceSha256,plans.sourceSha256);
 for(const [report,helper,pin,actualCount]of[
  [np,'scripts/blender/desk_axes_b1_challenge_b3_v2_20261024.py','0dfd82d653f1f13c9c7b76510cc62f337f0fabbb82b9339cd71f8b400b1bae5e',99],
  [hp,'scripts/blender/desk_axes_b1_small_gesture_20261024.py','beec7f25bdf482cd0c7db62934f158d45e0be4d3335dc303d45c87314dd86475',214],
  [ep,'scripts/blender/desk_axes_b1_score_entries_d1_v2_20261024.py','ec6d7cebb1b285518df2eadda60740ab2d39a9e031c50c98e9a82a0bb9b79a8f',361]]){
  assert.equal(report.mode,'render');assert.equal(report.sourceSha256,plans.sourceSha256);
  assert.equal(report.helperSha256,pin);assert.equal(sha(helper),pin);
  protectedPaths.push(helper);
  assert.equal(Object.keys(report.patchFrameToUnchangedObjectSourceFrame).length,actualCount);
  for(const [ks,reference]of Object.entries(report.patchFrameToUnchangedObjectSourceFrame)){
   assert.equal(reference,plans.originalObjectSourceFrames[Number(ks)],'Original object source frame changed');
  }
 }
 assert(np.allPatchFramesActuallyRendered&&Object.values(np.protectionChecks).every(v=>v===true));
 assert(np.scriptVoiceSubtitlesUnchanged&&np.noAnswerAdded&&np.earlierB2AnswerPngUnchanged);
 assert(hp.allPatchFramesActuallyRendered&&hp.unchangedCameraAndSemanticFingertips&&hp.noScriptVoiceCaptionChange);
 assert(ep.allGuardedStatesPass&&ep.allB2PreviouslyCorrectedOutputsUntouched);
 assert(ep.runtimeBindingsUnchanged&&ep.sourceAndProtectedInputsUnchanged&&ep.originalAndB2RawInventoryUnchanged&&ep.dataUnchanged);
 for(const report of[np,ep])assert.equal(report.b2ReportSha256,sha(camera+'/camera-patch.json'));
 for(const [p,h]of Object.entries(np.protectedInputSha256))assert.equal(sha(p),h,p);
 assert.equal(sha(original+'/blender/desk/meta.json'),plans.actualMetaSha256);
 const originalInventory=inventory(original+'/blender/desk'),baseInventory=inventory(base+'/blender/desk');
 assert.equal(Object.keys(originalInventory).length,nf);assert.equal(Object.keys(baseInventory).length,nf);
 for(let j=0;j<nf;j++)assert.deepEqual(originalInventory[jpg(j)].slice(0,2),plans.rawFrameSizeMtimeNs[j]);
 const hashes=Object.fromEntries(protectedPaths.map(p=>[path.resolve(p),sha(p)]));
 const actualFiles=new Map();
 const checkImage=(file,expected)=>{assert(fs.statSync(file).size>1000,file);const h=sha(file);assert.equal(h,expected,file);actualFiles.set(path.resolve(file),h);};
 const na=np.actualRenders.filter(r=>r.format==='JPEG');
 assert.equal(na.length,99);for(const r of na)checkImage(r.file,r.sha256);
 assert.equal(hp.actual.length,214);for(const r of hp.actual)checkImage(r.file,r.sha256);
 assert.equal(ep.actualImages.length,361);for(const r of ep.actualImages)checkImage(r.path,r.sha256);
 const nphys=new Map(np.physical.map(r=>[r.frame,r]));
 const hphys=new Map(hp.actual.map(r=>[r.frame,r]));
 const ephys=new Map(ep.physical.map(r=>[r.frame,r]));
 assert.equal(nphys.size,99);assert.equal(hphys.size,214);assert.equal(ephys.size,361);
 const patchDefs=[
  {kind:'actual-B3-white-half-reading-edge',map:np.replacementFrameToActualPatchFrame,refs:np.patchFrameToUnchangedObjectSourceFrame,raw:np.raw,physical:nphys,anchors:read(np.raw+'/anchors.json')},
  {kind:'actual-B3-24percent-pointing-hand',map:hp.replacementFrameToActualPatchFrame,refs:hp.patchFrameToUnchangedObjectSourceFrame,raw:hp.raw,physical:hphys,anchorRows:hp.anchorProjectionsByActualFrame},
  {kind:'actual-B3-score-placement-and-entry-camera',map:ep.replacementFrameToActualPatchFrame,refs:ep.patchFrameToUnchangedObjectSourceFrame,raw:entries+'/blender/patch',physical:ephys,anchors:read(entries+'/blender/patch/anchors.json')}];
 const patchByOutput=new Map();
 for(const patch of patchDefs)for(const [js,ks]of Object.entries(patch.map)){
  const j=Number(js),k=Number(ks);assert(Number.isInteger(j)&&j>=0&&j<nf&&Number.isInteger(k)&&k>=0&&k<=j);
  assert(!patchByOutput.has(j),'Overlapping B3 patch outputs');assert(patch.physical.has(k));
  if(patch===patchDefs[0])assert.equal(cp.replacementFrameToActualPatchFrame[j],k);
  if(patch===patchDefs[2])assert.equal(cp.replacementFrameToActualPatchFrame[j],undefined,'D patch must not overwrite a B2-corrected output');
  patchByOutput.set(j,{patch,k});
 }
 assert.equal(Object.keys(np.replacementFrameToActualPatchFrame).length,485);
 assert.equal(Object.keys(hp.replacementFrameToActualPatchFrame).length,214);
 assert.equal(Object.keys(ep.replacementFrameToActualPatchFrame).length,1259);
 assert.equal(patchByOutput.size,1958);
 const ba=read(base+'/blender/desk/anchors.json'),anchors=structuredClone(ba);
 const names=Object.keys(ba.anchors).sort();
 assert(names.length>0&&names.every(n=>ba.anchors[n].length===nf));
 for(const p of patchDefs){
  if(p.anchors){assert.deepEqual(Object.keys(p.anchors.anchors).sort(),names);assert(names.every(n=>p.anchors.anchors[n].length===nf));}
  else for(const k of p.physical.keys())assert.deepEqual(Object.keys(p.anchorRows[k]).sort(),names);
 }
 const poses=structuredClone(plans.b2DeliveredPoses),records=[];
 const sourceHashes=new Map(actualFiles);
 const fileHash=file=>{const real=fs.realpathSync(file);if(!sourceHashes.has(real))sourceHashes.set(real,sha(real));return sourceHashes.get(real);};
 assert.equal(poses.length,nf);assert(baseline.records.every((r,j)=>r.frame===j));
 for(let j=0;j<nf;j++){
  const selected=patchByOutput.get(j),prior=baseline.records[j];
  let file=base+'/blender/desk/'+jpg(j),kind='byte-identical-B2-delivered-raw',k=null,objectSource=null;
  if(selected){
   const p=selected.patch;k=selected.k;const phys=p.physical.get(k);
   file=p.raw+'/'+jpg(k);kind=p.kind;objectSource=p.refs[k];
   const b=phys.principalBox??phys.box,w=phys.principalWidthRatio??phys.widthRatio;
   assert(finiteBox(b)&&Number.isFinite(w)&&w>=.4&&w<=.7&&!clip(b),'Actual patch bounds');
   assert(Math.abs((b[2]-b[0])/1080-w)<.0002);
   const pose=phys.pose??phys.cameraPose;assert(finitePose(pose));
   if(p!==patchDefs[2])assert(samePose(pose,poses[j]),'Noncamera patch changed B2 delivered camera');
   poses[j]=structuredClone(pose);
   for(const n of names){
    const v=p.anchors?p.anchors.anchors[n][k]:p.anchorRows[k][n];
    assert(Array.isArray(v)&&v.length===3&&v.every(Number.isFinite));anchors.anchors[n][j]=v;
   }
  }
  const hash=fileHash(file);
  if(!selected)assert.equal(hash,prior.sha256,'B2 source image changed');
  records.push({frame:j,time:j/fps,source:file,sha256:hash,kind,actualPatchFrame:k,
   originalObjectSourceFrame:objectSource,retainedOriginalPlan:live.plans[j],
   previousB2Source:prior.source,previousB2SourceSha256:prior.sha256});
 }
 const moving=poses.map((p,j)=>j>0&&!samePose(p,poses[j-1]));
 const motion={frames:nf,moving_frames:moving.filter(Boolean).length,moving_ratio:moving.filter(Boolean).length/nf,
  top_ratio:poses.filter(p=>p[5]>=80).length/nf,
  method:'Exact actually delivered pose per output: byte-proven B2 hold/camera map, overridden only by B3 entry physical records; hard cuts count as motion',
  b2BaselineMovingFrames:609,b2Baseline609ReproducedBeforeOverrides:true,standalonePatchMotionNotSubstitutedForWholeFilm:true};
 const dimensions=read(camera+'/final-held-dimensions.json');
 for(const sample of dimensions.samples){
  const selected=patchByOutput.get(sample.frame);
  sample.previousB2Measurement={box:sample.box,widthRatio:sample.widthRatio,clipped:sample.clipped};
  sample.moving=moving[sample.frame];sample.deliveredCameraPose=poses[sample.frame];
  if(selected){
   const phys=selected.patch.physical.get(selected.k),b=phys.principalBox??phys.box,w=phys.principalWidthRatio??phys.widthRatio;
   Object.assign(sample,{box:b,widthRatio:w,within40to70:w>=.4&&w<=.7,smallBelow35:w<.35,clipped:clip(b),
    actualPatchedFrame:selected.k,measurementSource:selected.patch.kind,
    evaluatedGeometry:phys.evaluatedGeometry??false,whiteReadingEdgeBox:phys.whiteReadingEdgeBox??null,
    scoreDigitClearance:phys.scoreDigitClearance??null});
  }else sample.measurementSource='unchanged exact B2 delivered physical measurement';
 }
 dimensions.method='Exact half-second/cue-end output joined to actual B3 patch source physical bounds, else unchanged B2 actual hold dimensions; no board/background inflation';
 dimensions.automaticGate7or7bWaived=false;dimensions.actualMp4EyeReviewPending=true;
 dimensions.originalNGMustBeRetained=true;
 dimensions.measurementsOutside40to70Retained=dimensions.samples.filter(s=>!s.within40to70);
 dimensions.clipsRetained=dimensions.samples.filter(s=>s.clipped);
 assert.equal(dimensions.samples.filter(s=>Number.isInteger(s.sampleTime*2)).length,714);
 const problem=np.actualRenders.find(r=>r.format==='PNG');assert(problem&&problem.file===needle+'/challenge-problem.png');checkImage(problem.file,problem.sha256);
 verify(hashes);assert.deepEqual(inventory(original+'/blender/desk'),originalInventory);assert.deepEqual(inventory(base+'/blender/desk'),baseInventory);
 fs.mkdirSync(desk,{recursive:true});fs.mkdirSync(out);fs.mkdirSync(cache+'/problem');
 for(const n of['plan.json',id+'.json','phrase-times.json'])link(base+'/'+n,cache+'/'+n);
 link(base+'/'+id+'.voice.wav',cache+'/'+id+'.voice.wav');link(base+'/'+id+'.wav',cache+'/'+id+'.wav');
 link(base+'/blender/data.json',cache+'/blender/data.json');
 for(const r of records)link(r.source,desk+'/'+jpg(r.frame));
 write(desk+'/anchors.json',anchors);write(cache+'/blender/camera-motion.json',motion);
 write(cache+'/blender/delivered-camera-poses.json',{fps,frames:nf,poses});
 link(base+'/blender/desk/meta.json',desk+'/original-meta.json');
 write(desk+'/meta.json',{id,frames:nf,kind:'New actual-source delivery mapping; not a new Blender production',
  originalMeta:desk+'/original-meta.json',originalPlanCounts:{render:3696,dup:7004},actualSourceJoin:cache+'/composite-provenance.json'});
 write(cache+'/final-held-dimensions.json',dimensions);
 link(problem.file,cache+'/problem/挑戦.png');
 link(camera+'/problem/答え.png',cache+'/problem/答え.png');link(camera+'/problem/problem.json',cache+'/problem/problem.json');
 const owner={id,cache,base,frames:nf,fps,rawB3ActualSources:674,replacedOutputFrames:1958,
  actualRawMappingComplete:true,allAnchorsFromExactCorrespondingActualSources:true,
  originalLivePlanCounts:{render:3696,dup:7004},differentPostCalibrationSourceASTCounts:{render:3755,dup:6945},
  originalPlannerDiscrepancyReport:root+'/ys-chain-b1v1-final3-live-plan-diagnosis-20261024.json',
  originalPlannerNotCertifiedAsCanonicalPass:true,
  magneticPoleMarker:'Only exact original poleN/poleS projected positions get 8px 2D annotation circles. The original hidden 3D caps are not moved or claimed newly visible.',
  fieldPrimary:'Physical field-line pattern, not its background board or only the central sphere',
  originalInputsAndNGPreserved:true,actualFinalGatesPending:true,actualFinalEyeReviewPending:true,
  earListeningPerformed:false,finalPassed:false};
 write(cache+'/composite-provenance.json',{...owner,records,inputReportSha256:{needle:sha(needle+'/report.json'),hand:sha(hand+'/report.json'),entries:sha(entries+'/report.json')},
  fullRawProtection:{originalInventoryBefore:originalInventory,baseInventoryBefore:baseInventory},
  actualPatchImageSha256:Object.fromEntries(actualFiles)});
 write(cache+'/prepared.json',{...owner,encoded:false,protectedInputSha256:hashes,
  outputHashes:Object.fromEntries(['composite-provenance.json','final-held-dimensions.json','blender/desk/anchors.json','blender/camera-motion.json','blender/delivered-camera-poses.json','blender/desk/meta.json'].map(n=>[n,sha(cache+'/'+n)])),
  problemSha256:{challenge:sha(cache+'/problem/挑戦.png'),answer:sha(cache+'/problem/答え.png')}});
 console.log(JSON.stringify({cache,prepared:true,encoded:false,moving:motion.moving_frames,rawActual:674,replaced:1958,originalNGPreserved:true}));
}else{
 const prepared=read(cache+'/prepared.json');assert(prepared.encoded===false);
 assert.equal(prepared.cache,cache);verify(prepared.protectedInputSha256);
 for(const [n,h]of Object.entries(prepared.outputHashes))assert.equal(sha(cache+'/'+n),h,n);
 const provenance=read(cache+'/composite-provenance.json');
 assert.deepEqual(inventory(original+'/blender/desk'),provenance.fullRawProtection.originalInventoryBefore);
 assert.deepEqual(inventory(base+'/blender/desk'),provenance.fullRawProtection.baseInventoryBefore);
 assert(!fs.existsSync(cache+'/export.json'));assert(!fs.existsSync(out+'/'+id+'.mp4'),'Preserve existing MP4');
 const checked=new Map();
 for(const r of provenance.records){
  assert.equal(fs.realpathSync(desk+'/'+jpg(r.frame)),fs.realpathSync(r.source));
  const real=fs.realpathSync(r.source);if(!checked.has(real))checked.set(real,sha(real));assert.equal(checked.get(real),r.sha256);
 }
 const started=Date.now();
 const result=spawnSync(process.execPath,['scripts/umech/desk-b1v1-final3-render-entry.mjs',id],{
  env:{...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,
   FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'},stdio:'inherit'});
 assert.equal(result.status,0,'B3 encode failed; partial new output preserved');
 verify(prepared.protectedInputSha256);
 assert.deepEqual(inventory(original+'/blender/desk'),provenance.fullRawProtection.originalInventoryBefore);
 assert.deepEqual(inventory(base+'/blender/desk'),provenance.fullRawProtection.baseInventoryBefore);
 const video=out+'/'+id+'.mp4';assert(fs.statSync(video).size>1e6);
 write(cache+'/export.json',{id,video,sha256:sha(video),frames:nf,seconds:(Date.now()-started)/1000,
  encoder:'Unmodified render-all-films-gptv2.mjs CRF18, new B3-only exact frame import hook',
  original2DJapaneseVoiceCueTimesUnchanged:true,earListeningPerformed:false,
  preparedSha256:sha(cache+'/prepared.json'),protectedInputSha256:prepared.protectedInputSha256,
  originalGateNGPreserved:true,actualFinalGatesPending:true,actualFinalEyeReviewPending:true,finalPassed:false});
 console.log(video);
}
