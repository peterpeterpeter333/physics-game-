// Add-only fourth B-1 encode candidate: exact B3 delivery + approved B4 size
// and B5 physical-repulsion patches. No Blender or automatic gate exceptions.
// Root alone authorizes --prepare and, separately, the CPU-heavy --encode.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

assert(process.argv.includes('--authorized'),'Root authorization required');
const prepare=process.argv.includes('--prepare'),encode=process.argv.includes('--encode');
assert(prepare!==encode,'Choose exactly one of --prepare or --encode');
const root='/private/tmp/ys',id='ys-chain-b1v1',nf=10700,fps=30;
const base=root+'/ys-chain-b1v1-final3-20261024';
const original=root+'/ys-chain-b1v1';
const cache=root+'/ys-chain-b1v1-final4-20261024',desk=cache+'/blender/desk',out=cache+'/out';
const problem=path.resolve('outputs/axes-20261023/delivery-metadata-20261024/B-1-problem');
const B3_PREPARED='3956feb23129e64514852978fba184e9e3f416f627e5c1139b5f94a12ed19841';
const patches=[
 {name:'B4',kind:'actual-B4-three-cue-principal-size-camera',folder:root+'/ys-chain-b1v1-camera-size-b4-20261024',
  helper:'scripts/blender/desk_axes_b1_camera_size_b4_20261024.py',pin:'0f283f6101fa0c69e8aa3ebf4d9f37088e877e9f74223886eb7043e5d7027c96',
  keys:['lore:garlic','rule:first','rule:north'],physicalChange:false},
 {name:'B5',kind:'actual-B5-correct-NN-repulsion-and-following-anchors',folder:root+'/ys-chain-b1v1-repel-b5-v2-20261024',
  helper:'scripts/blender/desk_axes_b1_repel_b5_v2_20261024.py',pin:'b22afb08cd19154eb2b623384aaa96748fb223b7849d499dee04e6430943c2c8',
  keys:['rule:pull'],physicalChange:true}];
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,1)+'\n',{flag:'wx'});
const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
const jpg=j=>String(j).padStart(5,'0')+'.jpg';
const link=(a,b)=>{assert(fs.statSync(a).isFile(),a);assert(!exists(b),b);fs.symlinkSync(path.resolve(a),b);};
const pose=p=>Array.isArray(p)&&p.length===7&&p.every(Number.isFinite);
const box=b=>Array.isArray(b)&&b.length===4&&b.every(Number.isFinite)&&b[0]<b[2]&&b[1]<b[3];
const clip=b=>b[0]<0||b[1]<0||b[2]>1080||b[3]>1920;
const samePose=(a,b)=>pose(a)&&pose(b)&&a.every((v,i)=>Math.abs(v-b[i])<=1e-9);
const verify=hashes=>{for(const [p,h]of Object.entries(hashes))assert.equal(sha(p),h,p);};
const inventory=p=>Object.fromEntries(fs.readdirSync(p).filter(n=>/^\d{5}\.jpg$/.test(n)).sort().map(n=>{
 const s=fs.statSync(p+'/'+n,{bigint:true});return[n,[Number(s.size),s.mtimeNs.toString(),fs.realpathSync(p+'/'+n)]];
}));
assert.equal(path.dirname(cache),root);assert(!exists(cache)||!fs.lstatSync(cache).isSymbolicLink());

if(prepare){
 assert(!exists(cache),'Preserve any previous fourth candidate');
 assert.equal(sha(base+'/prepared.json'),B3_PREPARED,'Exact B3 baseline required');
 const bp=read(base+'/prepared.json'),prior=read(base+'/composite-provenance.json');
 assert.equal(bp.frames,nf);assert.equal(prior.frames,nf);assert.equal(prior.records.length,nf);
 verify(bp.protectedInputSha256);
 for(const [n,h]of Object.entries(bp.outputHashes))assert.equal(sha(base+'/'+n),h,n);
 const exported=read(base+'/export.json');assert.equal(sha(exported.video),exported.sha256);
 const live=read(root+'/ys-chain-b1v1-retained-plan-20261024.json');
 const diagnosis=read(root+'/ys-chain-b1v1-final3-live-plan-diagnosis-20261024.json');
 assert.equal(live.plans.length,nf);assert(live.exactRenderFramesMatchOriginalMeta);
 assert(diagnosis.exactLivePlanMatchesAll10700ByteProvenRawReferences&&diagnosis.all73PhysicalTimeExpressionsEqualHeldObjectSource);
 assert.equal(diagnosis.originalPlannerPassClaimed,false);
 const counts={render:live.plans.filter(p=>p[0]==='render').length,dup:live.plans.filter(p=>p[0]==='dup').length};
 assert.deepEqual(counts,{render:3696,dup:7004});
 const sourceRef=j=>live.plans[j][0]==='render'?j:live.plans[j][1];
 const allCues=live.CUES,at=j=>allCues.findLast(c=>c.start<=j/fps)??allCues[0];
 const anchors=structuredClone(read(base+'/blender/desk/anchors.json'));
 const names=Object.keys(anchors.anchors).sort();assert(names.length&&names.every(n=>anchors.anchors[n].length===nf));
 const poses=structuredClone(read(base+'/blender/delivered-camera-poses.json').poses);assert.equal(poses.length,nf);
 assert(poses.every(pose));
 const selected=new Map(),actualImages=new Map(),inputReports={},protectedPaths=[
  ...Object.keys(bp.protectedInputSha256),base+'/prepared.json',base+'/export.json',exported.video,
  base+'/composite-provenance.json',base+'/final-held-dimensions.json',base+'/blender/desk/meta.json',
  base+'/blender/desk/anchors.json',base+'/blender/camera-motion.json',base+'/blender/delivered-camera-poses.json',
  'scripts/umech/desk-b1v1-final4-assemble-20261024.mjs','scripts/umech/desk-b1v1-final3-render-entry.mjs',
  root+'/ys-chain-b1v1-retained-plan-20261024.json',root+'/ys-chain-b1v1-final3-live-plan-diagnosis-20261024.json'];
 for(const n of ['挑戦.png','答え.png','problem.json'])protectedPaths.push(problem+'/'+n);
 const canonicalProblem=read(problem+'/problem.json');assert.equal(canonicalProblem.answerDegrees,49.106605350869096);
 assert(canonicalProblem.canonical&&Array.isArray(canonicalProblem.parts));
 assert(!JSON.stringify(canonicalProblem).includes('点検'),'Use clean canonical problem metadata');
 const inventories={};
 for(const folder of [original+'/blender/desk',prior.fullRawProtection.baseInventoryBefore?prior.base+'/blender/desk':null,base+'/blender/desk'].filter(Boolean)){
  inventories[folder]=inventory(folder);assert.equal(Object.keys(inventories[folder]).length,nf);
 }
 for(const patch of patches){
  assert.equal(sha(patch.helper),patch.pin);const p=read(patch.folder+'/render/report.json');patch.report=p;
  assert.equal(p.mode,'render');assert.equal(p.helperSha256,patch.pin);assert.equal(p.b3PreparedSha256,B3_PREPARED);
  assert.equal(p.sourceSha256,sha('scripts/blender/desk_b1v1.py'));assert.deepEqual(p.keys,patch.keys);
  assert(p.allGuardedStatesPass&&p.allPatchFramesActuallyRendered&&p.allSelectedB3RawSourcesAndHeldObjectRefsVerified);
  assert(p.allHeldDependenciesMapped&&p.allOtherB3DeliveredPosesRetained);
  assert(p.originalGateNGPreserved&&p.originalInspectorModified===false&&p.finalAcceptance===false);
  assert(Object.values(p.protectionChecks).every(v=>v===true));verify(p.protectedInputSha256);
  assert.equal(p.approvedProbeReportSha256,sha(patch.folder+'/probe/report.json'));
  const probe=read(patch.folder+'/probe/report.json');assert.equal(probe.helperSha256,patch.pin);
  assert(probe.allGuardedStatesPass&&probe.actualImages.length===3);
  assert.deepEqual(probe.physical,p.physical);assert.deepEqual(probe.replacementFrameToActualPatchFrame,p.replacementFrameToActualPatchFrame);
  if(patch.name==='B4')assert(p.modelsVoiceSubtitlesAndTimesUnchanged);
  else{
   assert(p.modelMeshesVoiceSubtitlesAndSourceTimesUnchanged&&p.barAStateIsExplicitDerivative);
   assert(p.barBOriginalWorldMatricesRetained&&p.allOriginalHandWorldMatricesAndVisibilityRetained);
   assert.deepEqual(p.originalBugActuallyReproduced.nearest.a,'S');assert.deepEqual(p.originalBugActuallyReproduced.nearest.b,'N');
   assert.deepEqual(p.nearestWorldPoleAssertions.map(r=>[r.nearest.a,r.nearest.b]),[['N','S'],['N','N'],['N','N']]);
   assert(p.recoil.afterGapMeters>p.recoil.beforeGapMeters+.02);
  }
  protectedPaths.push(patch.helper,patch.folder+'/probe/report.json',patch.folder+'/render/report.json');
  patch.physical=new Map(p.physical.map(r=>[r.frame,r]));
  assert.equal(patch.physical.size,Object.keys(p.patchFrameToUnchangedObjectSourceFrame).length);
  assert.equal(p.actualImages.length,patch.physical.size);assert.equal(p.actualSources,patch.physical.size);
  assert.equal(p.replacementOutputs,Object.keys(p.replacementFrameToActualPatchFrame).length);
  patch.anchors=read(p.anchors);assert.deepEqual(Object.keys(patch.anchors.anchors).sort(),names);
  assert(names.every(n=>patch.anchors.anchors[n].length===nf));
  assert.equal(path.resolve(p.raw),path.resolve(patch.folder+'/render/blender/patch'));
  assert.equal(path.resolve(p.anchors),path.resolve(p.raw+'/anchors.json'));protectedPaths.push(p.anchors);
  for(const image of p.actualImages){
   const file=path.resolve(p.raw+'/'+jpg(image.frame));assert.equal(path.resolve(image.path),file);
   assert(!fs.lstatSync(file).isSymbolicLink());assert(fs.statSync(file).size>1000);
   assert.equal(sha(file),image.sha256,file);assert(patch.physical.has(image.frame));actualImages.set(file,image.sha256);
  }
  for(const [js,ks]of Object.entries(p.replacementFrameToActualPatchFrame)){
   const j=Number(js),k=Number(ks),reference=p.patchFrameToUnchangedObjectSourceFrame[k];
   assert(Number.isInteger(j)&&j>=0&&j<nf&&Number.isInteger(k)&&k>=0&&k<=j);
   assert(!selected.has(j),'B4 and B5 replacement outputs must be disjoint');
   assert(patch.keys.includes(at(j).key)&&at(reference).key===at(j).key);
   assert.equal(reference,sourceRef(j));assert.equal(reference,sourceRef(k));
   assert.equal(prior.records[j].kind,'byte-identical-B2-delivered-raw','Do not erase an earlier B3 model correction');
   const phys=patch.physical.get(k);assert(phys&&phys.pass&&phys.evaluatedGeometry);
   assert.equal(phys.unchangedObjectSourceFrame,reference);assert.equal(phys.cue,at(j).key);
   const b=phys.box,w=phys.widthRatio;
   assert(box(b)&&Number.isFinite(w)&&w>=.4&&w<=.7&&!clip(b)&&pose(phys.pose));
   assert(b[0]>=40&&b[2]<=1040&&b[1]>=110&&b[3]<=1600,'Actual safe bounds');
   assert(Math.abs((b[2]-b[0])/1080-w)<.0002);
   selected.set(j,{patch,k,reference,phys});
  }
  for(const key of patch.keys){
   const outputs=Array.from({length:nf},(_,j)=>j).filter(j=>at(j).key===key);
   assert(outputs.length&&outputs.every(j=>selected.get(j)?.patch===patch),'All exact cue outputs and held dependents required');
  }
  inputReports[patch.name]={path:patch.folder+'/render/report.json',sha256:sha(patch.folder+'/render/report.json'),
   actualSources:patch.physical.size,replacementOutputs:p.replacementOutputs,helper:patch.helper,helperSha256:patch.pin};
 }
 assert.equal(inputReports.B5.replacementOutputs,235);assert.equal(inputReports.B5.actualSources,119);
 const hashes=Object.fromEntries([...new Set(protectedPaths.map(p=>path.resolve(p)))].map(p=>[p,sha(p)]));
 const sourceHashes=new Map(actualImages),fileHash=file=>{const real=fs.realpathSync(file);if(!sourceHashes.has(real))sourceHashes.set(real,sha(real));return sourceHashes.get(real);};
 const records=[];
 for(let j=0;j<nf;j++){
  const old=prior.records[j];assert.equal(old.frame,j);assert.deepEqual(old.retainedOriginalPlan,live.plans[j]);
  assert.equal(fs.realpathSync(base+'/blender/desk/'+jpg(j)),fs.realpathSync(old.source));
  assert.equal(fileHash(old.source),old.sha256,'Prior B3 source changed');
  const s=selected.get(j);let file=old.source;
  if(s){file=s.patch.report.raw+'/'+jpg(s.k);poses[j]=structuredClone(s.phys.pose);
   for(const n of names){const v=s.patch.anchors.anchors[n][s.k];assert(Array.isArray(v)&&v.length===3&&v.every(Number.isFinite));anchors.anchors[n][j]=v;}}
  records.push({frame:j,time:j/fps,source:file,sha256:fileHash(file),kind:s?s.patch.kind:'byte-identical-B3-delivered-raw',
   actualPatchFrame:s?s.k:null,originalObjectSourceFrame:s?s.reference:(old.originalObjectSourceFrame??sourceRef(j)),
   originalPhysicalStateExplicitlyCorrected:s?.patch.physicalChange??false,
   retainedOriginalPlan:live.plans[j],previousB3Record:old});
 }
 const moving=poses.map((p,j)=>j>0&&!samePose(p,poses[j-1]));
 const motion={frames:nf,moving_frames:moving.filter(Boolean).length,moving_ratio:moving.filter(Boolean).length/nf,
  top_ratio:poses.filter(p=>p[5]>=80).length/nf,
  method:'Exact B3 delivered per-output poses plus disjoint B4/B5 physical records. Hard cuts count as motion; no standalone patch motion file is substituted.',
  b3BaselineMovingFrames:read(base+'/blender/camera-motion.json').moving_frames,standalonePatchMotionNotSubstitutedForWholeFilm:true};
 const dimensions=structuredClone(read(base+'/final-held-dimensions.json'));
 for(const sample of dimensions.samples){
  const s=selected.get(sample.frame);sample.previousB3Measurement={box:sample.box,widthRatio:sample.widthRatio,clipped:sample.clipped,measurementSource:sample.measurementSource};
  sample.moving=moving[sample.frame];sample.deliveredCameraPose=poses[sample.frame];
  if(s){const phys=s.phys,b=phys.box,w=phys.widthRatio;
   Object.assign(sample,{box:b,widthRatio:w,within40to70:w>=.4&&w<=.7,smallBelow35:w<.35,clipped:clip(b),
    actualPatchedFrame:s.k,measurementSource:s.patch.kind,evaluatedGeometry:true,
    principalDefinition:phys.principalDefinition??({ 'lore:garlic':'sailor body including head and clothing; garlic is separately guarded, not included in body width',
     'rule:first':'both complete N/S bar magnets','rule:north':'complete compass including open lid'}[sample.cue]),
    auxiliaryGarlicBox:phys.auxiliaryGarlicBox??null,auxiliaryNotCountedInPrincipalWidth:phys.auxiliaryNotCountedInPrincipalWidth??null,
    nearestActualPolePair:phys.nearestActualPolePair??null,
    originalPhysicalStateExplicitlyCorrected:s.patch.physicalChange});}
 }
 dimensions.method='Exact B3 actual-held geometry base plus B4/B5 actual-source full-geometry records, joined on every exact output frame. Original heuristics NG retained, no automatic waiver.';
 dimensions.automaticGate7or7bWaived=false;dimensions.actualMp4EyeReviewPending=true;dimensions.originalNGMustBeRetained=true;
 dimensions.faceOverlayPhysicalWidthIsNotAnAutomaticFailureOrPass='An unchanged face overlay is a separate user-approved presentation; globe-only width is retained as measured, not silently declared a 40–70% physical principal.';
 dimensions.measurementsOutside40to70Retained=dimensions.samples.filter(s=>!s.within40to70);dimensions.clipsRetained=dimensions.samples.filter(s=>s.clipped);
 assert.equal(dimensions.samples.filter(s=>Number.isInteger(s.sampleTime*2)).length,714);
 assert(!dimensions.samples.some(s=>patches.some(p=>p.keys.includes(s.cue))&&(!s.within40to70||s.clipped)),'Repaired cues must really pass physical dimensions');
 verify(hashes);for(const [folder,inv]of Object.entries(inventories))assert.deepEqual(inventory(folder),inv);
 fs.mkdirSync(desk,{recursive:true});fs.mkdirSync(out);fs.mkdirSync(cache+'/problem');
 for(const n of ['plan.json',id+'.json','phrase-times.json',id+'.voice.wav',id+'.wav'])link(base+'/'+n,cache+'/'+n);
 link(base+'/blender/data.json',cache+'/blender/data.json');for(const r of records)link(r.source,desk+'/'+jpg(r.frame));
 write(desk+'/anchors.json',anchors);write(cache+'/blender/camera-motion.json',motion);write(cache+'/blender/delivered-camera-poses.json',{fps,frames:nf,poses});
 link(base+'/blender/desk/original-meta.json',desk+'/original-meta.json');
 write(desk+'/meta.json',{id,frames:nf,kind:'Exact B3 delivery plus approved new B4/B5 actual-source mapping; not canonical original production',
  originalMeta:desk+'/original-meta.json',originalPlanCounts:counts,actualSourceJoin:cache+'/composite-provenance.json'});
 write(cache+'/final-held-dimensions.json',dimensions);for(const n of ['挑戦.png','答え.png','problem.json'])link(problem+'/'+n,cache+'/problem/'+n);
 const owner={id,candidate:'B4+B5 combined fourth encode candidate',cache,base,frames:nf,fps,
  addedActualSources:[...actualImages].length,replacedOutputFrames:selected.size,actualRawMappingComplete:true,
  allAnchorsFromExactCorrespondingActualSources:true,allPriorB3ModelCorrectionsRetained:true,
  originalLivePlanCounts:counts,differentPostCalibrationSourceASTCounts:{render:3755,dup:6945},
  originalPlannerDiscrepancyReport:root+'/ys-chain-b1v1-final3-live-plan-diagnosis-20261024.json',originalPlannerNotCertifiedAsCanonicalPass:true,
  physicalRepulsionDerivative:'B5 preserves bar-A BASE orientation, adds same-time negative-Y recoil and follows original N/S semantic anchors. Original wrong source and earlier videos are retained.',
  originalInputsAndNGPreserved:true,actualFinalGatesPending:true,actualFinalEyeReviewPending:true,earListeningPerformed:false,finalPassed:false};
 write(cache+'/composite-provenance.json',{...owner,records,inputReports,fullRawProtection:inventories,actualPatchImageSha256:Object.fromEntries(actualImages),basePreparedSha256:B3_PREPARED});
 const outputNames=['composite-provenance.json','final-held-dimensions.json','blender/desk/anchors.json','blender/camera-motion.json',
  'blender/delivered-camera-poses.json','blender/desk/meta.json','problem/problem.json','problem/挑戦.png','problem/答え.png'];
 write(cache+'/prepared.json',{...owner,encoded:false,protectedInputSha256:hashes,outputHashes:Object.fromEntries(outputNames.map(n=>[n,sha(cache+'/'+n)])),inputReports,
  problemSourceFolder:problem,problemSha256:Object.fromEntries(['problem.json','挑戦.png','答え.png'].map(n=>[n,sha(cache+'/problem/'+n)]))});
 console.log(JSON.stringify({cache,prepared:true,encoded:false,addedActual:actualImages.size,replaced:selected.size,moving:motion.moving_frames,originalNGPreserved:true}));
}else{
 const prepared=read(cache+'/prepared.json');assert.equal(prepared.cache,cache);assert.equal(prepared.encoded,false);verify(prepared.protectedInputSha256);
 for(const [n,h]of Object.entries(prepared.outputHashes))assert.equal(sha(cache+'/'+n),h,n);
 const provenance=read(cache+'/composite-provenance.json');for(const [folder,inv]of Object.entries(provenance.fullRawProtection))assert.deepEqual(inventory(folder),inv);
 assert(!exists(cache+'/export.json')&&!exists(out+'/'+id+'.mp4'),'Preserve earlier MP4/evidence');
 const checked=new Map();for(const r of provenance.records){assert.equal(fs.realpathSync(desk+'/'+jpg(r.frame)),fs.realpathSync(r.source));
  const real=fs.realpathSync(r.source);if(!checked.has(real))checked.set(real,sha(real));assert.equal(checked.get(real),r.sha256);}
 const started=Date.now(),result=spawnSync(process.execPath,['scripts/umech/desk-b1v1-final3-render-entry.mjs',id],{
  env:{...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,
   FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'},stdio:'inherit'});
 assert.equal(result.status,0,'Fourth candidate encode failed; partial new output retained');verify(prepared.protectedInputSha256);
 for(const [folder,inv]of Object.entries(provenance.fullRawProtection))assert.deepEqual(inventory(folder),inv);
 for(const [file,hash]of checked)assert.equal(sha(file),hash,'Actual raw source changed during encode');
 const video=out+'/'+id+'.mp4';assert(fs.statSync(video).size>1e6);
 write(cache+'/export.json',{id,candidate:prepared.candidate,video,sha256:sha(video),frames:nf,seconds:(Date.now()-started)/1000,
  encoder:'Unmodified render-all-films-gptv2.mjs CRF18 via unchanged B3 frame hook; exact B4+B5 raw/anchors and original Japanese captions/voice',
  original2DJapaneseVoiceCueTimesUnchanged:true,earListeningPerformed:false,preparedSha256:sha(cache+'/prepared.json'),
  protectedInputSha256:prepared.protectedInputSha256,originalGateNGPreserved:true,actualFinalGatesPending:true,actualFinalEyeReviewPending:true,finalPassed:false});
 console.log(video);
}
