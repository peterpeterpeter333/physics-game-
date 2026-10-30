// New E-1 delivery cache assembled ONCE after original r9, camera15, local2,
// and approved action derivatives complete. No old cache/voice/text/check edit.
// --prepare and CPU-heavy --encode require separate root authorization.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

assert(process.argv.includes('--authorized'),'Only root may authorize assembly/encoding');
const prepare=process.argv.includes('--prepare'),encode=process.argv.includes('--encode');
assert(prepare!==encode,'Choose exactly --prepare or --encode');
const C='/private/tmp/ys/ys-chain-e1v1',id='ys-chain-e1v1',nf=11606,fps=30;
const camera='/private/tmp/ys/ys-chain-e1v1-camera-final-20261024';
const local='/private/tmp/ys/ys-chain-e1v1-local-fit-20261024/render';
const actions='/private/tmp/ys/ys-chain-e1v1-actions-final-20261024/render';
const cache='/private/tmp/ys/ys-chain-e1v1-final-20261024',desk=cache+'/blender/desk',out=cache+'/out';
const ACTION_SHA='e74ac58891ff2768dab426974b71a5207a07f0a207ef25575e6fee658bd5cd83';
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,1)+'\n',{flag:'wx'});
const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
const jpg=j=>String(j).padStart(5,'0')+'.jpg';
const link=(a,b)=>{assert(fs.statSync(a).isFile(),a);assert(!exists(b),b);fs.symlinkSync(path.resolve(a),b);};
const finitePose=p=>Array.isArray(p)&&p.length===7&&p.every(Number.isFinite);
const finiteBox=b=>Array.isArray(b)&&b.length===4&&b.every(Number.isFinite)&&b[0]<b[2]&&b[1]<b[3];
const samePose=(a,b)=>finitePose(a)&&finitePose(b)&&a.every((v,i)=>Math.abs(v-b[i])<=1e-9);
const clipped=b=>b[0]<0||b[1]<0||b[2]>1080||b[3]>1920;
const verify=hashes=>{for(const [p,h]of Object.entries(hashes))assert.equal(sha(p),h,p);};
const inventory=p=>Object.fromEntries(fs.readdirSync(p).filter(n=>/^\d{5}\.jpg$/.test(n)).sort().map(n=>{
 const s=fs.statSync(p+'/'+n,{bigint:true});return[n,[Number(s.size),s.mtimeNs.toString(),fs.realpathSync(p+'/'+n)]];
}));

if(prepare){
 assert(!exists(cache),'Preserve any earlier E delivery cache');
 const done=read(C+'/e1v1-production-r9/completed.json');
 assert.equal(done.status,'render_complete_pending_final_QA');assert.equal(done.frames,nf);
 assert.deepEqual(done.counts,{render:8100,dup:3506});assert(done.canonicalRendererCodeVerified&&done.voiceUnchanged);
 assert.equal(done.protectedRawChanged.length,0);assert.equal(done.otherSceneFileChanged.length,0);
 assert.equal(done.otherScenePathChanged.length,0);assert.equal(done.sourceChanged.length,0);
 const freeze=read(C+'/e1v1-r9-source-freeze.json');verify(freeze.files);
 assert.equal(sha(C+'/'+id+'.wav'),freeze.canonicalVoiceSHA256);assert.equal(sha(C+'/blender/data.json'),freeze.dataSHA256);
 const planReceipt=read(C+'/e1v1-final-plan-receipt-20261024.json');
 assert.equal(planReceipt.sourceFreezeSha256,sha(C+'/e1v1-r9-source-freeze.json'));
 assert.equal(planReceipt.dataSha256,sha(C+'/blender/data.json'));assert.equal(planReceipt.frames,nf);
 assert.deepEqual(planReceipt.counts,{render:8100,dup:3506});assert(planReceipt.allFrozenSourcesUnchanged&&planReceipt.renderCalls===0);
 const plans=planReceipt.plans,refs=planReceipt.originalObjectSourceFrames;
 const originalMeta=read(C+'/blender/desk/meta.json');
 assert.deepEqual([...originalMeta.done].sort((a,b)=>a-b),plans.flatMap((p,j)=>p[0]==='render'?[j]:[]),'All8100 actual original frames required');
 const D=read(C+'/blender/data.json'),at=j=>D.cues.findLast(c=>c.start<=j/fps)??D.cues[0];
 assert.equal(D.cues.length,54);assert.equal(Math.ceil(D.duration*fps),nf);
 const cp=read(camera+'/camera-patch.json'),lp=read(local+'/report.json'),ap=read(actions+'/report.json');
 const expectedHelpers=[
  ['scripts/blender/desk_axes_e1_camera_patch_20261024.py','eb13699fd997113f3fa3a3ab4b2f4856367d4f160f05726b196228a260eb9f2c',cp],
  ['scripts/blender/desk_axes_e1_local_fit_20261024.py','1b6bbbe9e3614df7f84a2543eab649aa4dd7d383d04badbba22a666de29c4395',lp],
  ['scripts/blender/desk_axes_e1_actions_final_20261024.py',ACTION_SHA,ap]];
 for(const [helper,pin,report]of expectedHelpers){assert.equal(sha(helper),pin);assert.equal(report.helperSha256,pin);verify(report.protectedInputSha256);assert(report.allPatchFramesActuallyRendered);}
 assert(cp.originalInputsUnchanged&&cp.allOriginal11606RawSizeAndMtimeUnchanged&&cp.otherSceneSavePathsAndImagesUnchanged);
 assert(cp.allOriginalFunctionsRetained&&cp.noModelRebuild&&!cp.physicalViolations.length&&!cp.auxiliaryFullFrameClips.length);
 assert.equal(lp.mode,'render');assert(lp.allCandidateRealPrincipal40to70SafeAndUnclipped&&lp.sameTargetAnglesFovAndAllObjectTimesRetained&&lp.allHeldDependenciesMapped);
 assert.equal(lp.interSiteCameraPatchSha256,sha(camera+'/camera-patch.json'));
 assert.equal(lp.approvedProbeSha256,sha(path.dirname(local)+'/probe/report.json'));
 assert.equal(ap.mode,'render');assert(ap.allGuardedStatesPass&&ap.cameraPosesUnchangedFromDelivered15Plus2&&ap.allHeldDependenciesMapped);
 assert(ap.originalRuntimeFunctionsNotRebound&&ap.noModelRebuild&&ap.allPrevious15Plus2PatchesRetainedDisjoint);
 assert.equal(ap.interSiteCameraPatchSha256,sha(camera+'/camera-patch.json'));assert.equal(ap.localFitReportSha256,sha(local+'/report.json'));
 assert.equal(ap.approvedProbeSha256,sha(path.dirname(actions)+'/probe/report.json'));
 assert(Object.values(lp.protectionChecks).every(v=>v===true)&&Object.values(ap.protectionChecks).every(v=>v===true));
 const poses=read(local+'/blender/delivered-camera-poses.json').poses;assert.equal(poses.length,nf);assert(poses.every(finitePose));
 const anchors=structuredClone(read(C+'/blender/desk/anchors.json')),names=Object.keys(anchors.anchors).sort();
 assert(names.length&&names.every(n=>anchors.anchors[n].length===nf));
 const patchDefs=[
  {name:'camera15',kind:'actual-inter-site-camera-only-correction',report:cp,refs:cp.patchFrameToUnchangedObjectSourceFrame},
  {name:'local2',kind:'actual-same-site-distance-only-correction',report:lp,refs:lp.patchFrameToUnchangedObjectSourceFrame},
  {name:'actions',kind:'actual-approved-action-and-accident-light-derivatives',report:ap,refs:ap.patchFrameToUnchangedOtherObjectSourceFrame}];
 const selected=new Map(),patchHashes=new Map();
 for(const p of patchDefs){
  p.physical=new Map(p.report.physical.map(r=>[r.frame,r]));p.anchors=read(p.report.anchors);
  assert.deepEqual(Object.keys(p.anchors.anchors).sort(),names);assert(names.every(n=>p.anchors.anchors[n].length===nf));
  assert.equal(path.resolve(p.report.anchors),path.resolve(p.report.raw+'/anchors.json'));
  const keys=Object.keys(p.refs).map(Number);assert.equal(keys.length,fs.readdirSync(p.report.raw).filter(n=>/^\d{5}\.jpg$/.test(n)).length);
  const imageEvidence=p.report.actualImages?new Map(p.report.actualImages.map(r=>[r.frame,r])):null;
  if(imageEvidence)assert.equal(imageEvidence.size,keys.length);
  for(const k of keys){
   const file=path.resolve(p.report.raw+'/'+jpg(k));assert(!fs.lstatSync(file).isSymbolicLink());assert(fs.statSync(file).size>1000);
   const hash=sha(file);if(imageEvidence){assert.equal(path.resolve(imageEvidence.get(k).path),file);assert.equal(imageEvidence.get(k).sha256,hash);}
   patchHashes.set(file,hash);
  }
  for(const [js,ks]of Object.entries(p.report.replacementFrameToActualPatchFrame)){
   const j=Number(js),k=Number(ks),ref=p.refs[k];assert(Number.isInteger(j)&&j>=0&&j<nf&&Number.isInteger(k)&&k>=0&&k<=j);
   assert(!selected.has(j),'Approved correction sets must be disjoint');assert.equal(ref,refs[j]);assert.equal(at(j).key,at(ref).key);
   const physical=p.physical.get(p.name==='local2'?ref:k);assert(physical);
   assert(physical.within40to70&&!physical.clipped&&!physical.outsidePrincipalSafeArea);
   assert(finiteBox(physical.box)&&physical.widthRatio>=.4&&physical.widthRatio<=.7&&!clipped(physical.box));
   assert(Math.abs((physical.box[2]-physical.box[0])/1080-physical.widthRatio)<.0002);
   assert(samePose(physical.pose,poses[j]),'No patch may silently undo an approved camera');
   selected.set(j,{patch:p,k,ref,physical});
  }
 }
 const inventoryFolders=[C+'/blender/desk',...patchDefs.map(p=>p.report.raw)],inventories=Object.fromEntries(inventoryFolders.map(p=>[p,inventory(p)]));
 assert.equal(Object.keys(inventories[C+'/blender/desk']).length,nf);
 const originalHashes=new Map();
 for(let j=0;j<nf;j++){
  const file=C+'/blender/desk/'+jpg(j);assert(!fs.lstatSync(file).isSymbolicLink());
  const inv=inventories[C+'/blender/desk'][jpg(j)],prior=cp.originalRawInventoryBefore[jpg(j)];assert.deepEqual(inv.slice(0,2),prior.slice(0,2));
  const hash=sha(file);originalHashes.set(file,hash);if(plans[j][0]==='dup')assert.equal(hash,originalHashes.get(C+'/blender/desk/'+jpg(refs[j])),'Frozen original hold differs from source');
 }
 const records=[];for(let j=0;j<nf;j++){
  const s=selected.get(j),file=s?s.patch.report.raw+'/'+jpg(s.k):C+'/blender/desk/'+jpg(j);
  if(s)for(const n of names){const v=s.patch.anchors.anchors[n][s.k];assert(Array.isArray(v)&&v.length===3&&v.every(Number.isFinite));anchors.anchors[n][j]=v;}
  records.push({frame:j,time:j/fps,source:file,sha256:s?patchHashes.get(path.resolve(file)):originalHashes.get(file),
   kind:s?s.patch.kind:'unchanged-exact-frozen-r9-production',actualPatchFrame:s?s.k:null,originalObjectSourceFrame:refs[j],
   physicalActionExplicitlyCorrected:s?.patch.name==='actions',retainedOriginalPlan:plans[j]});
 }
 const moving=poses.map((p,j)=>j>0&&!samePose(p,poses[j-1]));
 const motion={frames:nf,moving_frames:moving.filter(Boolean).length,moving_ratio:moving.filter(Boolean).length/nf,
  top_ratio:poses.filter(p=>p[5]>=65).length/nf,method:'Exact original frozen held camera plus camera15 and local2 actual-source poses; action derivatives do not move the camera. Hard cuts count as motion.'};
 const dimensions=structuredClone(read(local+'/final-held-dimensions.json'));
 for(const s of dimensions.samples){s.moving=moving[s.frame];s.deliveredCameraPose=poses[s.frame];const p=selected.get(s.frame);
  if(p?.patch.name==='actions'){
   s.previous15Plus2Measurement={box:s.box,widthRatio:s.widthRatio,clipped:s.clipped};
   Object.assign(s,p.physical,{frame:s.frame,sampleTime:s.frame/fps,actualPatchedFrame:p.k,measurementSource:p.patch.kind,physicalActionExplicitlyCorrected:true});
  }}
 assert.equal(dimensions.samples.filter(s=>Number.isInteger(s.sampleTime*2)).length,774);
 dimensions.originalGateNGMustBeRetained=true;dimensions.automaticGate7or7bWaived=false;dimensions.actualMp4EyeReviewPending=true;
 dimensions.method='Exact half-second/cue-end geometry of the actually selected original/camera15/local2/action source. Physical metrics do not certify contrast, occlusion, or human viewing.';
 dimensions.measurementsOutside40to70Retained=dimensions.samples.filter(s=>!s.within40to70);dimensions.clipsRetained=dimensions.samples.filter(s=>s.clipped);
 const protectedPaths=[...Object.keys(freeze.files),...expectedHelpers.map(r=>r[0]),
  C+'/e1v1-r9-source-freeze.json',C+'/e1v1-production-r9/completed.json',C+'/e1v1-final-plan-receipt-20261024.json',
  C+'/plan.json',C+'/'+id+'.json',C+'/phrase-times.json',C+'/timed-selection.json',C+'/'+id+'.wav',C+'/'+id+'.mix.wav',
  C+'/blender/data.json',C+'/blender/desk/anchors.json',C+'/blender/desk/meta.json',camera+'/camera-patch.json',
  local+'/report.json',local+'/final-held-dimensions.json',local+'/blender/delivered-camera-poses.json',
  path.dirname(local)+'/probe/report.json',actions+'/report.json',path.dirname(actions)+'/probe/report.json',
  ...patchDefs.map(p=>p.report.anchors),'scripts/render-all-films-gptv2.mjs','scripts/umech/desk-axes-render-entry.mjs',
  'scripts/umech/desk-axes-frame.mjs','scripts/umech/desk-frame.mjs','scripts/umech/desk-quality-gate.mjs',
  'scripts/umech/desk-e1v1-final-assemble-20261024.mjs',...['挑戦.png','答え.png','problem.json'].map(n=>C+'/problem/'+n)];
 const hashes=Object.fromEntries([...new Set(protectedPaths.map(p=>path.resolve(p)))].map(p=>[p,sha(p)]));
 const problem=read(C+'/problem/problem.json');assert.equal(problem.answer.direction,'east');assert.equal(problem.answer.angle,30);
 assert(!problem.sourceSection.includes('点検'));
 for(const [folder,inv]of Object.entries(inventories))assert.deepEqual(inventory(folder),inv);verify(hashes);
 fs.mkdirSync(desk,{recursive:true});fs.mkdirSync(out);fs.mkdirSync(cache+'/problem');
 const drawingPlan=structuredClone(read(C+'/plan.json'));drawingPlan[0].series='E 時間と位置 1';write(cache+'/plan.json',drawingPlan);
 for(const n of [id+'.json','phrase-times.json','timed-selection.json'])link(C+'/'+n,cache+'/'+n);
 link(C+'/'+id+'.wav',cache+'/'+id+'.voice.wav');link(C+'/'+id+'.mix.wav',cache+'/'+id+'.wav');
 for(const n of [id+'.mix.json',id+'.levels.json'])if(exists(C+'/'+n))link(C+'/'+n,cache+'/'+n);
 link(C+'/blender/data.json',cache+'/blender/data.json');fs.symlinkSync(C+'/blender/tex',cache+'/blender/tex');
 for(const r of records)link(r.source,desk+'/'+jpg(r.frame));write(desk+'/anchors.json',anchors);
 link(C+'/blender/desk/meta.json',desk+'/original-meta.json');
 write(desk+'/meta.json',{id,frames:nf,kind:'New actual-source corrected delivery mapping, not overwritten original production',originalMeta:desk+'/original-meta.json',originalPlanCounts:planReceipt.counts});
 write(cache+'/blender/camera-motion.json',motion);write(cache+'/blender/delivered-camera-poses.json',{fps,frames:nf,poses});write(cache+'/final-held-dimensions.json',dimensions);
 for(const n of ['挑戦.png','答え.png','problem.json'])link(C+'/problem/'+n,cache+'/problem/'+n);
 const owner={id,cache,source:C,frames:nf,fps,sourceFreezeSha256:sha(C+'/e1v1-r9-source-freeze.json'),
  originalPlanCounts:planReceipt.counts,addedActualPatchSources:patchHashes.size,replacedOutputFrames:selected.size,
  allRawAndAnchorsUseExactActualFrame:true,allOriginalHoldSourceBytesVerified:true,originalInputsAndOriginalNGPreserved:true,
  drawingPlanDerivative:'Only the new drawing-cache plan[0].series is set to E 時間と位置 1; the canonical source and original plan remain byte-identical. No caption, scene, cue, voice, or timestamp edits.',
  actionCorrectionsExplicitNotCanonicalSourceChanges:true,earListeningPerformed:false,actualFinalGatesPending:true,actualFinalEyeReviewPending:true,finalPassed:false};
 const inputReports={camera15:{path:camera+'/camera-patch.json',sha256:sha(camera+'/camera-patch.json')},
  local2:{path:local+'/report.json',sha256:sha(local+'/report.json')},actions:{path:actions+'/report.json',sha256:sha(actions+'/report.json')}};
 write(cache+'/composite-provenance.json',{...owner,records,inputReports,fullRawProtection:inventories,actualPatchImageSha256:Object.fromEntries(patchHashes)});
 const outputs=['plan.json','composite-provenance.json','final-held-dimensions.json','blender/desk/anchors.json','blender/desk/meta.json',
  'blender/camera-motion.json','blender/delivered-camera-poses.json','problem/problem.json','problem/挑戦.png','problem/答え.png'];
 write(cache+'/prepared.json',{...owner,encoded:false,protectedInputSha256:hashes,inputReports,outputHashes:Object.fromEntries(outputs.map(n=>[n,sha(cache+'/'+n)]))});
 console.log(JSON.stringify({cache,prepared:true,encoded:false,addedActual:patchHashes.size,replaced:selected.size,moving:motion.moving_frames,originalNGPreserved:true}));
}else{
 const prepared=read(cache+'/prepared.json');assert.equal(prepared.cache,cache);assert.equal(prepared.encoded,false);verify(prepared.protectedInputSha256);
 for(const [n,h]of Object.entries(prepared.outputHashes))assert.equal(sha(cache+'/'+n),h,n);
 assert(!exists(cache+'/export.json')&&!exists(out+'/'+id+'.mp4'),'Preserve previous export');
 const provenance=read(cache+'/composite-provenance.json');for(const [folder,inv]of Object.entries(provenance.fullRawProtection))assert.deepEqual(inventory(folder),inv);
 const checked=new Map();for(const r of provenance.records){assert.equal(fs.realpathSync(desk+'/'+jpg(r.frame)),fs.realpathSync(r.source));
  const real=fs.realpathSync(r.source);if(!checked.has(real))checked.set(real,sha(real));assert.equal(checked.get(real),r.sha256);}
 const started=Date.now(),result=spawnSync(process.execPath,['scripts/umech/desk-axes-render-entry.mjs',id],{
  env:{...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,FILM_COPY_AUDIO:'0',
   FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'},stdio:'inherit'});
 assert.equal(result.status,0,'E encode failed; partial new output retained');verify(prepared.protectedInputSha256);
 for(const [folder,inv]of Object.entries(provenance.fullRawProtection))assert.deepEqual(inventory(folder),inv);
 for(const [file,h]of checked)assert.equal(sha(file),h,'Actual raw source changed during encode');
 const video=out+'/'+id+'.mp4';assert(fs.statSync(video).size>1e6);
 write(cache+'/export.json',{id,video,sha256:sha(video),frames:nf,seconds:(Date.now()-started)/1000,
  encoder:'Unmodified render-all-films-gptv2.mjs CRF18 through new private axes frame hook',
  original2DJapaneseVoiceCueTimesUnchanged:true,preparedSha256:sha(cache+'/prepared.json'),protectedInputSha256:prepared.protectedInputSha256,
  originalGateNGPreserved:true,actualFinalGatesPending:true,actualFinalEyeReviewPending:true,earListeningPerformed:false,finalPassed:false});console.log(video);
}
