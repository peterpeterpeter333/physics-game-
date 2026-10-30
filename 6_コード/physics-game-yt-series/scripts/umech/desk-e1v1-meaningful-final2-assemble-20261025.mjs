// NEW E delivery derivative; original caches, scripts, audio and captions remain unchanged.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';
import{createHash}from'node:crypto';import{spawnSync}from'node:child_process';import{fileURLToPath}from'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));process.chdir(W);
const args=process.argv.slice(2);assert(args.includes('--authorized'));
const prep=args.includes('--prepare'),enc=args.includes('--encode');assert(prep!==enc);
const arg=k=>{const a=args.filter(a=>a.startsWith('--'+k+'='));assert.equal(a.length,1,k);return a[0].slice(k.length+3);};
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,1)+'\n',{flag:'wx'});
const pin=h=>assert(/^[a-f0-9]{64}$/.test(h));const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
const verify=o=>{for(const[p,h]of Object.entries(o))assert.equal(sha(p),h,p);};
const B='/private/tmp/ys/ys-chain-e1v1-final-20261024',C='/private/tmp/ys/ys-chain-e1v1-final2-meaningful-motion-20261025';
const id='ys-chain-e1v1',nf=11606,fps=30,jpg=j=>String(j).padStart(5,'0')+'.jpg';
const link=(a,b)=>{assert(fs.statSync(a).isFile()&&!exists(b));fs.symlinkSync(path.resolve(a),b);};
const inventory=p=>Object.fromEntries(fs.readdirSync(p).filter(n=>/^\d{5}\.jpg$/.test(n)).sort().map(n=>{const s=fs.statSync(p+'/'+n,{bigint:true});return[n,[Number(s.size),s.mtimeNs.toString(),fs.realpathSync(p+'/'+n)]];}));
const bprep=read(B+'/prepared.json');assert.equal(sha(B+'/prepared.json'),'b87b2614bd5a826ecf4287f5373fb456698b7281ad4f43d64d05ff4152170f91');
verify(bprep.protectedInputSha256);for(const[p,h]of Object.entries(bprep.outputHashes))assert.equal(sha(B+'/'+p),h,p);
if(prep){
 assert(!exists(C),'Preserve all prior attempts');
 const reportFile=path.resolve(arg('report')),reportSha=arg('report-sha256'),helper=path.resolve(arg('helper')),helperSha=arg('helper-sha256');
 const approvalFile=path.resolve(arg('root-approval')),approvalSha=arg('root-approval-sha256');
 const contextFile=path.resolve(arg('context-transaction')),contextSha=arg('context-transaction-sha256');
 [reportSha,helperSha,approvalSha,contextSha].forEach(pin);assert.equal(sha(reportFile),reportSha);assert.equal(sha(helper),helperSha);assert.equal(sha(approvalFile),approvalSha);assert.equal(sha(contextFile),contextSha);
 const r=read(reportFile),approval=read(approvalFile);assert.equal(r.id,id);assert.equal(r.mode,'render');assert.equal(r.helperSha256,helperSha);
 assert(r.allPass&&r.allPatchFramesActuallyRendered&&r.allPrincipalAndCriticalNumericalGuardsPass);
 assert(Object.values(r.protectionChecks).every(v=>v===true));assert(r.allOriginalScriptAudioSubtitlesUnchanged&&r.allOriginalRuntimeBindingsRetained&&r.allHeldDependenciesMapped);
 assert.equal(r.changes.shipboardPeriodSeconds,1,'Same clock keeps its canonical one-second period');
 assert.equal(r.changes.waveBlendSeconds,.6);verify(r.protectedInputSha256);
 const probeFile=path.resolve(path.dirname(path.dirname(reportFile))+'/probe/report.json'),probe=read(probeFile);
 assert.equal(r.approvedProbeSha256,sha(probeFile));assert.equal(probe.helperSha256,helperSha);assert(probe.allPass);
 assert.equal(approval.helperSha256,helperSha);assert.equal(approval.probeReportSha256,sha(probeFile));
 assert(approval.approved===true&&approval.allRequiredProbeImagesPersonallyViewed===true&&approval.actualViewer==='root');
 assert.equal(probe.actualImages.length,12);assert.equal(approval.viewedImageCount,12);
 for(const row of probe.actualImages){assert.equal(sha(row.path),row.sha256);assert.equal(approval.reviewedImageSha256[row.path],row.sha256);}
 for(const controlRows of [probe.controls,r.controls]){
  assert.deepEqual(controlRows.map(c=>c.frame).sort((a,b)=>a-b),[380,450,9249,9540]);
  for(const c of controlRows){
   assert.equal(sha(c.path),c.sha256);assert.equal(sha(c.expectedPath),c.expectedSha256);
   assert.equal(c.byteExactAgainstExistingDeliveredRaw,c.sha256===c.expectedSha256,'Keep the original byte comparison truthful');
   assert(c.sourceEquivalentAgainstExistingDeliveredRaw===true&&c.decodedRgbExact===true&&c.pixelAllowedDifference===0&&c.wholeImageNotBackgroundOnly===true);
   assert.deepEqual(c.decodedDifferenceMinMax,[0,0]);const d=c.independentDecodedRgbComparison;
   assert(d.decodedRgbExact===true&&d.maximumAbsoluteChannelDifference===0&&d.allowedDifference===0&&d.quantizationExactlyEqual===true);
   assert.equal(d.leftSha256,c.expectedSha256);assert.equal(d.rightSha256,c.sha256);assert.deepEqual(d.rgbDimensions,[1080,1920,3]);
   assert.equal(c.independentDecoderSha256,'f40eb8ee33e8ffd1ad07fe0ed5bf5d5508f0b335acd687cbcca9feef2b17391f');
  }
 }
 const context=read(contextFile);assert.equal(context.mode,'render');assert.equal(context.helperSha256,helperSha);
 assert(context.contextRestoredByExactRNAPointersNamesOwnerAndFrame===true&&context.operationError===null&&context.allowTemporaryUnhideExplicitlyAuthorized===true);
 assert.deepEqual(context.contextBefore,context.contextAfter);assert.equal(context.normalDependencyProofs.length,2);
 for(const p of context.normalDependencyProofs)assert(p.allOwnedLocalChannelsConstraintsVisibilityPointersAndBasisUnchanged===true&&p.allActualWorldsMatchEvaluatedAfterFlagsRestored===true&&p.error===null&&p.temporaryOwnedVisibilityEvaluationPerformed===true);
 assert.deepEqual(context.normalDependencyProofs.map(p=>p.phase),['entry-before-snapshot','restore-before-strict-original-world-comparison']);
 const maps=Object.entries(r.replacementFrameToActualPatchFrame).map(([j,k])=>[Number(j),Number(k)]),selected=new Map(maps);
 assert.equal(selected.size,354);assert.equal(r.actualSources,354);assert(maps.every(([j,k])=>j===k&&Number.isInteger(j)&&j>=0&&j<nf));
 const physical=new Map(r.physical.map(p=>[p.frame,p])),images=new Map(r.actualImages.map(p=>[p.frame,p]));assert.equal(images.size,354);
 const anchors=structuredClone(read(B+'/blender/desk/anchors.json')),pa=read(r.anchors),names=Object.keys(anchors.anchors).sort();
 assert.deepEqual(Object.keys(pa.anchors).sort(),names);assert.equal(pa.frames,nf);assert.equal(pa.fps,fps);
 const prov=structuredClone(read(B+'/composite-provenance.json')),poses=read(B+'/blender/delivered-camera-poses.json').poses;
 const dims=structuredClone(read(B+'/final-held-dimensions.json'));const newHashes={};
 assert.equal(prov.records.length,nf);assert.equal(poses.length,nf);
 const dimsByFrame=new Map(dims.samples.map(s=>[s.frame,s]));
 for(let j=0;j<nf;j++){
  const row=prov.records[j];assert.equal(row.frame,j);assert.equal(sha(row.source),row.sha256);
  if(!selected.has(j))continue;const ph=physical.get(j),im=images.get(j);
  assert(ph&&im&&ph.frame===j&&ph.time===j/fps&&selected.get(j)===j);
  assert.equal(r.patchFrameToUnchangedOtherObjectSourceFrame[j],row.originalObjectSourceFrame);assert.equal(row.originalObjectSourceFrame,j);
  assert.deepEqual(ph.pose,poses[j]);assert(ph.principal.safe&&ph.principal.widthRatio>=.4&&ph.principal.widthRatio<=.7);
  assert.equal(path.resolve(im.path),path.resolve(r.raw+'/'+jpg(j)));assert.equal(sha(im.path),im.sha256);assert(!fs.lstatSync(im.path).isSymbolicLink());
  const previous={...row};Object.assign(row,{source:im.path,sha256:im.sha256,kind:'actual-meaningful-calm-clock-and-flagship-hand-correction',actualPatchFrame:j,physicalActionExplicitlyCorrected:true,parentFinalRecord:previous});
  newHashes[im.path]=im.sha256;
  for(const n of names){const a=pa.anchors[n][j];assert(Array.isArray(a)&&a.length===3&&a.every(Number.isFinite));anchors.anchors[n][j]=a;}
  const s=dimsByFrame.get(j);if(s){s.parentFinalPhysicalMeasurement={...s};Object.assign(s,{box:ph.principal.box,widthRatio:ph.principal.widthRatio,within40to70:true,clipped:false,outsidePrincipalSafeArea:false,pose:ph.pose,sampleTime:j/fps,actualPatchedFrame:j,physicalActionExplicitlyCorrected:true,measurementSource:row.kind,motionRepairPhysical:ph});}
 }
 const hashes={...bprep.protectedInputSha256,...r.protectedInputSha256,[reportFile]:reportSha,[helper]:helperSha,[approvalFile]:approvalSha,
  [probeFile]:sha(probeFile),[contextFile]:contextSha,[r.anchors]:sha(r.anchors),[B+'/prepared.json']:sha(B+'/prepared.json'),[B+'/export.json']:sha(B+'/export.json'),[fileURLToPath(import.meta.url)]:sha(fileURLToPath(import.meta.url))};
 for(const[p,h]of Object.entries(bprep.outputHashes))hashes[B+'/'+p]=h;
 verify(hashes);const inventories={...prov.fullRawProtection,[r.raw]:inventory(r.raw)};assert.equal(Object.keys(inventories[r.raw]).length,354);
 for(const[p,inv]of Object.entries(inventories))assert.deepEqual(inventory(p),inv);
 fs.mkdirSync(C+'/blender/desk',{recursive:true});fs.mkdirSync(C+'/out');fs.mkdirSync(C+'/problem');
 for(const n of ['plan.json',id+'.json','phrase-times.json','timed-selection.json',id+'.voice.wav',id+'.wav'])link(B+'/'+n,C+'/'+n);
 for(const n of [id+'.mix.json',id+'.levels.json'])if(exists(B+'/'+n))link(B+'/'+n,C+'/'+n);
 link(B+'/blender/data.json',C+'/blender/data.json');fs.symlinkSync(fs.realpathSync(B+'/blender/tex'),C+'/blender/tex');
 for(const row of prov.records)link(row.source,C+'/blender/desk/'+jpg(row.frame));write(C+'/blender/desk/anchors.json',anchors);
 link(B+'/blender/desk/meta.json',C+'/blender/desk/original-meta.json');
 write(C+'/blender/desk/meta.json',{id,frames:nf,parentFinalCache:B,newActualRepairFrames:354,originalRawSequencesUnchanged:true});
 for(const n of ['camera-motion.json','delivered-camera-poses.json'])link(B+'/blender/'+n,C+'/blender/'+n);
 for(const n of ['挑戦.png','答え.png','problem.json'])link(B+'/problem/'+n,C+'/problem/'+n);
 dims.measurementsOutside40to70Retained=dims.samples.filter(s=>!s.within40to70);dims.clipsRetained=dims.samples.filter(s=>s.clipped);
 dims.meaningfulMotionReport={path:reportFile,sha256:reportSha};dims.actualMp4EyeReviewPending=true;write(C+'/final-held-dimensions.json',dims);
 const reports={...bprep.inputReports,meaningfulMotion:{path:reportFile,sha256:reportSha}};
 const selectedPatchRows=prov.records.filter(r=>r.actualPatchFrame!==null),selectedActualCount=new Set(selectedPatchRows.map(r=>r.source)).size;
 Object.assign(prov,{cache:C,parentFinalCache:B,parentPreparedSha256:sha(B+'/prepared.json'),inputReports:reports,fullRawProtection:inventories,
  parentAddedActualPatchSources:prov.addedActualPatchSources,parentReplacedOutputFrames:prov.replacedOutputFrames,
  addedActualPatchSources:selectedActualCount,replacedOutputFrames:selectedPatchRows.length,
  actualPatchImageSha256:{...prov.actualPatchImageSha256,...newHashes},newActualRepairSources:354,newReplacedOutputFrames:354,
  cumulativeRawPatchImagesSeenInInputs:Object.keys({...prov.actualPatchImageSha256,...newHashes}).length,earListeningPerformed:false,actualFinalEyeReviewPending:true,finalPassed:false});
 write(C+'/composite-provenance.json',prov);
 const outputs=['plan.json','composite-provenance.json','final-held-dimensions.json','blender/desk/anchors.json','blender/desk/meta.json','blender/camera-motion.json','blender/delivered-camera-poses.json','problem/problem.json','problem/挑戦.png','problem/答え.png'];
 write(C+'/prepared.json',{...bprep,cache:C,parentFinalCache:B,parentPreparedSha256:sha(B+'/prepared.json'),newActualRepairSources:354,newReplacedOutputFrames:354,
  parentAddedActualPatchSources:bprep.addedActualPatchSources,parentReplacedOutputFrames:bprep.replacedOutputFrames,addedActualPatchSources:selectedActualCount,replacedOutputFrames:selectedPatchRows.length,
  encoded:false,protectedInputSha256:hashes,inputReports:reports,outputHashes:Object.fromEntries(outputs.map(n=>[n,sha(C+'/'+n)])),actualFinalGatesPending:true,actualFinalEyeReviewPending:true,finalPassed:false});
 verify(hashes);console.log(JSON.stringify({cache:C,newActual:354,newOutputs:354,unchangedOutputs:11252,encoded:false}));
}else{
 const p=read(C+'/prepared.json'),v=read(C+'/composite-provenance.json');assert.equal(p.cache,C);verify(p.protectedInputSha256);
 for(const[n,h]of Object.entries(p.outputHashes))assert.equal(sha(C+'/'+n),h,n);
 for(const[folder,inv]of Object.entries(v.fullRawProtection))assert.deepEqual(inventory(folder),inv);
 const checked=new Map();for(const row of v.records){assert.equal(fs.realpathSync(C+'/blender/desk/'+jpg(row.frame)),fs.realpathSync(row.source));if(!checked.has(row.source))checked.set(row.source,sha(row.source));assert.equal(checked.get(row.source),row.sha256);}
 assert(!exists(C+'/export.json')&&!exists(C+'/out/'+id+'.mp4'));const began=Date.now();
 const result=spawnSync(process.execPath,['scripts/umech/desk-axes-render-entry.mjs',id],{env:{...process.env,EM_FILM_CACHE:C,FILM_OUTPUT:C+'/out',FILM_COPY_AUDIO:'0',FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'},stdio:'inherit'});
 assert.equal(result.status,0);verify(p.protectedInputSha256);for(const[folder,inv]of Object.entries(v.fullRawProtection))assert.deepEqual(inventory(folder),inv);
 for(const[file,h]of checked)assert.equal(sha(file),h);const video=C+'/out/'+id+'.mp4';assert(fs.statSync(video).size>1e6);
 write(C+'/export.json',{id,video,sha256:sha(video),frames:nf,seconds:(Date.now()-began)/1000,preparedSha256:sha(C+'/prepared.json'),
  encoder:'Unmodified original CRF18 render entry and axes drawing hook',parentFinalExportSha256:sha(B+'/export.json'),
  original2DJapaneseVoiceCueTimesUnchanged:true,originalGateNGPreserved:true,protectedInputSha256:p.protectedInputSha256,
  actualFinalGatesPending:true,actualFinalEyeReviewPending:true,earListeningPerformed:false,finalPassed:false});console.log(video);
}
