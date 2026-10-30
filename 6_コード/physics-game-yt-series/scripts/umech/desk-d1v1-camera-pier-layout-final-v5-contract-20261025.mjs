// Verified v5-contract derivative: actual120 recovery/pier completion, fresh camera proof; original v3 retained.
// New v3 final cache: camera > pier-v2 > original, approved2D unchanged.
// New v2: pinned anchors and independent EOF-tail proof; prior runner preserved.
// Root-authorized new-cache assembly / encode-to-review / original checks /
// actual-MP4 review. No Blender calls and no source/test/threshold modification.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import{createHash}from'node:crypto';import{spawnSync}from'node:child_process';
import sharp from 'sharp';
const mode=process.argv[2];assert(['--prepare','--encode','--checks','--review'].includes(mode)&&process.argv.includes('--authorized'));
const option=n=>process.argv.find(s=>s.startsWith(n+'='))?.slice(n.length+1);
const old='/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025',cache='/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025',id='ys-chain-d1v1',out=cache+'/out';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,1),{flag:'wx'}),jpg=j=>String(j).padStart(5,'0')+'.jpg';
const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
const snapshot=p=>{const s=fs.statSync(p);return{file:p,bytes:s.size,mtimeMs:s.mtimeMs,sha256:sha(p)};};
const verifyRows=rows=>{for(const r of rows)assert.deepEqual(snapshot(r.file),r,r.file);};
const link=(source,dest)=>{assert(!exists(dest));fs.symlinkSync(path.resolve(source),dest);};
const hook=path.resolve('scripts/umech/desk-d1v1-camera-pier-layout-hooks-v3-20261025.mjs'),frame=path.resolve('scripts/umech/desk-d1v1-final-layout-frame-20261025.mjs');
const self=path.resolve('scripts/umech/desk-d1v1-camera-pier-layout-final-v5-contract-20261025.mjs');
const layoutQa=path.resolve('deep/D-1_final-layout_9actual-raw-composites_20261025.json'),oldEyes=path.resolve('deep/D-1_actual-final_855team-aggregate_20261025.json');
const fixed={
 ['scripts/umech/desk-d1v1-camera-pier-layout-final-v3-verified-20261025.mjs']:'8b5af346bd294c7616620ae3cd308e48ed667aa3d570a5e63eb252bf3e40bf57',
 [hook]:'2d79005c96f09f8f1dc009c63969e529d7409fcee370a0317faabcce2dc38393',
 [frame]:'c22ac5086b713141b13a1c9c53c8d412727d8711f32b9556bfe55baeec9012d3',
 [layoutQa]:'a72aee95d27786312f87bde8ff28ea99b8556a9fcbc643ea01ede3d402090238',
 [oldEyes]:'43455061d989ae2650724f34e01658324449784b07c3907ec6f66466c14ce4cf',
 [old+'/d1-complete-merge.json']:'2184a78457c7444799b857524f860c5c71c58c7c25d14365593d5ad00891a9e8',
 [old+'/blender/delivered-provenance.json']:'c7813f40a8fc9fefb5d0cdea49022e9633be510f69589c852a8b337a15b87d94',
 [old+'/out-final-d1v1/ys-chain-d1v1.mp4']:'c0253209e9fa83a6a8b87e6afbf764bfec2b05211d8532dc1e6e176907a3c9ee',
 ['scripts/umech/desk-d1v1-overlay.mjs']:'9e1105b7a0c4a077b9f4a9067a31760882398304460132ecb22b78ab50ad4a2f',
 ['scripts/umech/desk-d1v1-review.mjs']:'64a90c763c7ab2afbd621c930aa16378648cbaea04428dacc22e715184cda6b9',
 ['scripts/umech/desk-axes-d1-final-checks.mjs']:'88549a25cb55104be3c0a90c33a4dbf8c51f5fe3e2a6c70ea581bcfd5cf3de17',
 ['scripts/umech/desk-d1v1-final-gates.mjs']:'97b8d71776ac4178ad59c4887132c177cb8fd89e8d0c55b84f1d825d627b6ec0'};
const verify=hh=>{for(const[p,h]of Object.entries(hh))assert.equal(sha(p),h,p);};verify(fixed);
const putPin=(pins,p,h)=>{p=path.resolve(p);assert(/^[a-f0-9]{64}$/.test(h));if(Object.hasOwn(pins,p))assert.equal(pins[p],h,'Conflicting SHA pin: '+p);pins[p]=h;};
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const env=()=>{const e={...process.env,EM_FILM_CACHE:cache,D1_LAYOUT_SCOPE:'D1-camera-pier-layout-20261025',FFMPEG:ff};delete e.DESK_ALLOW_MISSING;return e;};
const child=(args,e=env())=>{const r=spawnSync(process.execPath,args,{env:e,stdio:'inherit'});if(r.error)throw r.error;return r;};
const contract=p=>[p.layer,p.actualFrame,p.unchangedOtherObjectSourceFrame,p.semanticOperationTime,p.cameraOperationTime,p.pose];
const sameOriginalCameraTolerance=(a,b)=>{
 if(typeof a==='number')return typeof b==='number'&&Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-9;
 if(Array.isArray(a))return Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>sameOriginalCameraTolerance(v,b[i]));
 if(a&&typeof a==='object')return b&&typeof b==='object'&&!Array.isArray(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&sameOriginalCameraTolerance(a[k],b[k]));
 return a===b;
};
const v5={adapter:path.resolve('scripts/blender/desk_axes_d1_verified_v5_adapters_20261025.py'),adapterSha256:'f518e79055a897c63d2c5a089abad0d6f8725926f9ab7032ba92d0795e81f464',recovery:path.resolve('scripts/blender/desk_axes_d1_pier_contact_replay_v5_20261025.py'),recoverySha256:'bc91b1089c3714378cbd98bd39229f288b0e6cf7f7011a492e85d3df7cccbcf7',diagnostic:'/private/tmp/ys/ys-chain-d1v1-pier-contact-v5-20261025/diagnostic/report.json',diagnosticSha256:'5502cee07b7b6107dd94f2783e0807a8f202334b9e016c5b366b59ed28c3cc5d',childSha256:'eb198b8295a5ac2385d2a25bbbeb63e5512a4b27a9ea41c7aebd9a85ac7f5d10',pierRoot:'/private/tmp/ys/ys-chain-d1v1-pier-contact-images-v5-20261025'};
const original10=['allEntryObjectTransformsRestored','noNewGeometryRemains','runtimeBindingsUnchanged','runtimeDataUnchanged','allEntryMaterialAndHighlightInputsRestored','sourcesAndProtectedInputsUnchanged','allDeliveredRawShaAndStatsUnchanged','allOtherExistingSceneOutputsUnchanged','allSceneFilepathsRestored','visibilityQueueClosed'];
const strictChild=(e,pins)=>{
 assert.equal(sha(e.path),e.sha256);const r=read(e.path);putPin(pins,e.path,e.sha256);
 assert.equal(r.helperSha256,v5.recoverySha256);assert.equal(r.toleranceUnchanged,1e-9);assert.equal(r.allPass,true);assert.deepEqual(r.missingOriginalGuardNames,[]);assert.deepEqual(r.afterOriginalCloseOffenders,[]);assert.deepEqual(r.afterCloseVisibilityOffenders,[]);assert.equal(r.originalCloseError,null);assert.equal(r.fullComponentRestorationError,null);
 assert(original10.every(k=>r.protectionChecks[k]===true)&&Object.keys(r.protectionChecks).length>=18&&Object.values(r.protectionChecks).every(v=>v===true));assert(Object.values(r.namespaceBindings).every(f=>Object.values(f).every(v=>v.sameObject===true)));
 assert(r.normalizations?.length>0);for(const n of r.normalizations){assert.equal(sha(n.path),n.sha256);const x=read(n.path);assert(n.pass&&x.pass&&x.helperSha256===v5.recoverySha256&&Object.values(x.protectionChecks).every(v=>v===true)&&x.worldBasisTransformConstraintAssignmentsAdded===0&&x.originalSavedVersusRestoredWorldToleranceUnchanged===1e-9);putPin(pins,n.path,n.sha256);}
 const summary={helperSha256:r.helperSha256,allPass:true,toleranceUnchanged:1e-9,protectionChecks:r.protectionChecks,missingOriginalGuardNames:[],afterOriginalCloseOffenderCount:0,afterCloseVisibilityOffenderCount:0,originalCloseError:null,fullComponentRestorationError:null};
 if(e.strictSummary)assert.deepEqual(e.strictSummary,summary);return summary;
};
const v5Proof=(r,role,helperPath,helperPin,pins)=>{
 const q=r.verifiedV5RuntimeAdapter;assert(q&&q.role===role&&q.adapterSha256===helperPin&&path.resolve(q.adapter)===path.resolve(helperPath)&&r.helperSha256===helperPin);
 assert(q.old105SuccessNotAssumed&&q.actual120StrictSuccessRequiredBeforeNamespace&&q.thresholdsGeometryAndOperationTimesUnchanged&&q.actualPixelApprovalNotInferredFromGeometry&&q.automaticApproval===false&&q.finalAcceptance===false);
 assert.equal(path.resolve(q.recoveryHelper),v5.recovery);assert.equal(q.recoveryHelperSha256,v5.recoverySha256);assert.equal(q.actual120Diagnostic,v5.diagnostic);assert.equal(q.actual120DiagnosticSha256,v5.diagnosticSha256);
 assert.equal(q.canonicalCameraSha256,'9624c1496089b41d22e7b2321515a7fec2847506685e24d64726259e48c37e00');assert.equal(q.canonicalPierPixelHelperSha256,'4e9d41accb35d8a31211a65c3ce76740a7e07dc81d021a6a2e2bc0e114b0b479');assert.equal(q.priorPierAdapterSha256,'91ac6c70b120fdf8474336381f367e939ddade202515e6feb5db7366a04b5211');
 for(const[f,h]of Object.entries(q.extraProtectedInputSha256))putPin(pins,f,h);putPin(pins,v5.adapter,v5.adapterSha256);putPin(pins,v5.recovery,v5.recoverySha256);putPin(pins,v5.diagnostic,v5.diagnosticSha256);
 assert.equal(sha(q.canonicalCamera),q.canonicalCameraSha256);assert.equal(sha(q.canonicalPierPixelHelper),q.canonicalPierPixelHelperSha256);assert.equal(sha(q.priorPierAdapter),q.priorPierAdapterSha256);
 for(const n of ['canonicalCamera','canonicalPierPixelHelper','priorPierAdapter'])putPin(pins,q[n],q[n+'Sha256']);
 assert.equal(sha(v5.diagnostic),v5.diagnosticSha256);const d=read(v5.diagnostic);assert(d.helperSha256===v5.recoverySha256&&d.renders===0&&d.toleranceUnchanged===1e-9&&d.allScenarioFullRestorationsPass&&d.allPinnedSourcesAndFailed117EvidenceUnchanged&&!d.error&&!d.cleanupError);
 const order=['engine-catalog-oblique','engine-catalog-top','no-operation','exact-delivered7917','problem-challenge','problem-answer'];assert.deepEqual(d.scenarioOrder,order);assert.deepEqual(d.scenarios.map(x=>x.scenario),order);assert(d.scenarios.every(x=>x.newFullRestorePass&&x.offenderCount===0&&x.visibilityOffenderCount===0));assert(original10.every(k=>d.protectionChecks[k]===true)&&Object.values(d.protectionChecks).every(v=>v===true));
 assert.equal(d.transformRestorationReport.sha256,v5.childSha256);strictChild(d.transformRestorationReport,pins);strictChild(r.completeTransformRestorationEvidence??{path:null},pins);
 return q;
};
if(mode==='--prepare'){
 assert(!exists(cache)&&!fs.lstatSync(path.dirname(cache)).isSymbolicLink(),'Fresh final cache required; preserve every old candidate');
 const report=option('--pillar-report'),reportPin=option('--pillar-report-sha256'),helper=option('--pillar-helper');
 assert(report&&helper&&/^[a-f0-9]{64}$/.test(reportPin??''));assert.equal(sha(report),reportPin);
 const p=read(report),expectedActual=Number(option('--actual-count')),expectedOutputs=Number(option('--output-count'));
 assert(Number.isInteger(expectedActual)&&expectedActual>0&&Number.isInteger(expectedOutputs)&&expectedOutputs>=expectedActual);
 assert.equal(p.mode,'render');assert.equal(p.helperSha256,sha(helper));assert(!p.error&&!p.cleanupError&&p.allReplacementPhysicalPass&&p.allRequestedActuallyRendered&&p.allPatchFramesActuallyRendered&&Object.values(p.protectionChecks).every(v=>v===true));
 const completionFile=path.dirname(report)+'/v5-adapter-completion.json',completion=read(completionFile);
 assert.equal(completion.adapterSha256,p.helperSha256);assert.equal(completion.frozenRunReportSha256,reportPin);
 assert(completion.extraPinsUnchanged&&completion.strictCompleteTransformRestorationPassed&&!completion.error);
 assert(completion.completeTransformRestorationEvidence.length>0&&completion.completeTransformRestorationEvidence.every(c=>c.strictSummary?.allPass&&Object.values(c.strictSummary.protectionChecks).every(v=>v===true)));
 assert.equal(p.actualSources,expectedActual);assert.equal(p.replacementOutputs,expectedOutputs);assert.equal(p.actualImages.length,expectedActual);assert.equal(p.physical.length,expectedActual);
 assert.equal(p.originalMergeSha256,fixed[old+'/d1-complete-merge.json']);assert.equal(p.originalProvenanceSha256,fixed[old+'/blender/delivered-provenance.json']);
 assert(p.approvedProbeReport&&p.approvedProbeReportSha256&&p.rootProbeVisualReceipt&&p.rootProbeVisualReceiptSha256);
 assert.equal(sha(p.approvedProbeReport),p.approvedProbeReportSha256);assert.equal(sha(p.rootProbeVisualReceipt),p.rootProbeVisualReceiptSha256);
 assert(p.pins&&Object.keys(p.pins).length>0&&Object.keys(p.protectionChecks).length>0);
 const pins={};for(const[f,h]of Object.entries(fixed))putPin(pins,f,h);
 for(const[f,h]of Object.entries(p.pins))putPin(pins,f,h);
 putPin(pins,completionFile,sha(completionFile));for(const[f,h]of Object.entries(completion.extraProtectedInputSha256))putPin(pins,f,h);
 assert.equal(path.resolve(helper),v5.adapter);assert.equal(p.helperSha256,v5.adapterSha256);assert.equal(path.resolve(path.dirname(path.dirname(report))),v5.pierRoot);assert.equal(completion.actual120DiagnosticSha256,v5.diagnosticSha256);
 const pierProof=v5Proof({...p,completeTransformRestorationEvidence:completion.completeTransformRestorationEvidence[0]},'three-pier-images',helper,p.helperSha256,pins);
 assert.equal(completion.verifiedV5RuntimeAdapter.role,'three-pier-images');assert.deepEqual(completion.verifiedV5RuntimeAdapter,p.verifiedV5RuntimeAdapter);
 for(const child of completion.completeTransformRestorationEvidence)strictChild(child,pins);
 for(const[f,h]of Object.entries({[hook]:sha(hook),[self]:sha(self),[path.resolve(helper)]:sha(helper),[path.resolve(report)]:reportPin,[p.approvedProbeReport]:p.approvedProbeReportSha256,[p.rootProbeVisualReceipt]:p.rootProbeVisualReceiptSha256}))putPin(pins,f,h);
 assert.equal(sha(p.anchors),p.anchorsSha256);putPin(pins,p.anchors,p.anchorsSha256);
 verify(pins);const qa=read(layoutQa);assert(qa.allNineIndividuallyDisplayedAtFullResolution&&qa.finalAcceptance===false);assert.equal(sha(qa.proof),qa.proofSha256);putPin(pins,qa.proof,qa.proofSha256);
 for(const f of ['scripts/render-all-films-gptv2.mjs','scripts/umech/desk-axes-frame.mjs','scripts/umech/frame-vert.mjs','scripts/umech/desk-frame.mjs','scripts/umech/desk-faces.mjs','scripts/umech/desk-overlay-lib.mjs','scripts/umech/desk-quality-gate.mjs','scripts/umech/desk-quality-gate-frames.py','scripts/umech/desk-axes-caption165-loader.mjs','scripts/umech/yt1-chain-00bx-common.mjs'])putPin(pins,f,sha(f));
 const base=read(old+'/blender/delivered-provenance.json').frames,poses=read(old+'/blender/delivered-camera-poses.json'),anc=read(old+'/blender/desk/anchors.json'),meta=read(old+'/blender/desk/meta.json'),pa=read(p.anchors);
 assert(base.length===12163&&poses.length===12163&&meta.frames===12163&&anc.frames===12163&&meta.key===anc.key);
 assert.equal(pa.frames,12163);assert.equal(pa.fps,30);
 const names=Object.keys(anc.anchors).sort();assert.deepEqual(Object.keys(pa.anchors).sort(),names);for(const n of names)assert.equal(pa.anchors[n].length,12163);
 const cameraReport=option('--camera-report'),cameraPin=option('--camera-report-sha256'),cameraHelper=option('--camera-helper'),cameraHelperPin=option('--camera-helper-sha256');
 assert(cameraReport&&cameraHelper&&/^[a-f0-9]{64}$/.test(cameraPin??'')&&/^[a-f0-9]{64}$/.test(cameraHelperPin??''));assert.equal(sha(cameraReport),cameraPin);assert.equal(sha(cameraHelper),cameraHelperPin);
 const cam=read(cameraReport),cameraActual=Number(option('--camera-actual-count')),cameraOutputs=Number(option('--camera-output-count'));
 assert(Number.isInteger(cameraActual)&&cameraActual>0&&Number.isInteger(cameraOutputs)&&cameraOutputs>=cameraActual);
 assert(cam.mode==='render'&&cam.helperSha256===cameraHelperPin&&cam.allPatchFramesActuallyRendered&&cam.allRequestedActuallyRendered&&cam.allReplacementPhysicalPass&&!cam.error&&!cam.cleanupError);
 assert(cam.protectionChecks&&Object.keys(cam.protectionChecks).length>0&&Object.values(cam.protectionChecks).every(v=>v===true));assert.deepEqual(cam.pierOutputIntersection,[]);
 assert.equal(cam.actualSources,cameraActual);assert.equal(cam.replacementOutputs,cameraOutputs);assert.equal(cam.actualImages.length,cameraActual);
 const camMap=cam.replacementFrameToActualPatchFrame,camPhysical=new Map(cam.physical.map(r=>[r.frame,r])),camImages=new Map(),camPoses=cam.deliveredCameraPoses,camAnchors=read(cam.anchors);
 assert.equal(Object.keys(camMap).length,cameraOutputs);assert.equal(camPhysical.size,cameraOutputs);assert.equal(camPoses.length,12163);assert.equal(camAnchors.fps,30);assert.deepEqual(Object.keys(camAnchors.anchors).sort(),names);for(const n of names)assert.equal(camAnchors.anchors[n].length,12163);
 assert.equal(sha(cam.anchors),cam.anchorsSha256);putPin(pins,cam.anchors,cam.anchorsSha256);putPin(pins,cameraReport,cameraPin);putPin(pins,cameraHelper,cameraHelperPin);for(const[f,h]of Object.entries(cam.pins))putPin(pins,f,h);
 const camAudit=path.dirname(path.dirname(cameraReport))+'/audit/report.json',camProbe=path.dirname(path.dirname(cameraReport))+'/probe/report.json';
 putPin(pins,camAudit,cam.auditReportSha256);putPin(pins,camProbe,cam.approvedProbeReportSha256);putPin(pins,cam.rootVisualReceipt,cam.rootVisualReceiptSha256);
 // The actual f518/v6 API does not create obsolete105 root-audit receipts.
 // Replace that nonexistent contract with the actual120 prerequisite, exact
 // new audit/probe/render sources, and their independently read strict children.
 const camAuditReport=read(camAudit),camProbeReport=read(camProbe);
 for(const [r,m]of [[camAuditReport,'audit'],[camProbeReport,'probe'],[cam,'render']]){
  assert.equal(r.mode,m);assert(r.allReplacementPhysicalPass&&!r.error&&!r.cleanupError&&r.protectionChecks&&Object.values(r.protectionChecks).every(v=>v===true));
  v5Proof(r,'four-cue-camera',cameraHelper,cameraHelperPin,pins);
  assert.deepEqual(r.fixedPhasePoses,cam.fixedPhasePoses);assert.deepEqual(r.replacementFrameToActualPatchFrame,camMap);assert.deepEqual(r.deliveredCameraPoses,camPoses);assert(sameOriginalCameraTolerance(r.physical,cam.physical),'Same1e-9 comparison as frozen camera probe/render against its audit');
 }
 assert(camProbeReport.allRequestedActuallyRendered&&camProbeReport.auditReportSha256===cam.auditReportSha256);
 const cameraProbe=read(camProbe),cameraEye=read(cam.rootVisualReceipt);
 assert(cameraEye.approved&&cameraEye.allRequiredProbeImagesPersonallyViewed&&cameraEye.helperSha256===cameraHelperPin&&cameraEye.probeReportSha256===cam.approvedProbeReportSha256&&cameraEye.auditReportSha256===cam.auditReportSha256);
 assert.deepEqual(cameraEye.reviewedImageSha256,Object.fromEntries(cameraProbe.actualImages.map(r=>[r.path,r.sha256])));
 for(const im of cam.actualImages){const f=path.resolve(cam.raw,jpg(im.frame));assert.equal(path.resolve(im.path),f);assert(fs.lstatSync(f).isFile()&&!fs.lstatSync(f).isSymbolicLink());assert.equal(sha(f),im.sha256);camImages.set(im.frame,f);}
 assert.equal(camImages.size,cameraActual);assert.equal(new Set(Object.values(camMap)).size,cameraActual);
 const physical=new Map(p.physical.map(r=>[r.frame,r])),actual=new Map(),map=p.replacementFrameToActualPatchFrame;
 assert.equal(physical.size,expectedActual);assert.equal(Object.keys(map).length,expectedOutputs);
 assert(Object.keys(camMap).every(j=>!Object.hasOwn(map,j)),'A genuine camera/pier overlap requires explicit joint rendering, not precedence masking');
 for(const im of p.actualImages){const f=path.resolve(p.raw,jpg(im.frame));assert.equal(path.resolve(im.path),f);const st=fs.lstatSync(f);assert(st.isFile()&&!st.isSymbolicLink()&&st.size>1000);assert.equal(sha(f),im.sha256);actual.set(im.frame,f);}
 const snapshots=new Map(),remember=f=>{f=fs.realpathSync(f);if(!snapshots.has(f))snapshots.set(f,snapshot(f));return f;};
 const anchors=structuredClone(anc),records=[],selected=[];
 for(let j=0;j<12163;j++){
  const before=base[j];assert.equal(before.frame,j);assert.equal(fs.realpathSync(old+'/blender/desk/'+jpg(j)),fs.realpathSync(before.raw));remember(before.raw);
  let row={...before};if(Object.hasOwn(camMap,j)){
   const k=camMap[j],r=camPhysical.get(j),source=cam.patchFrameToOriginalDeliveredRow[k];assert(Number.isInteger(k)&&camImages.has(k)&&r?.pass);
   assert.deepEqual(source,base[k]);assert.deepEqual(contract(before),contract(source));assert.deepEqual(r.delivered,before);assert.deepEqual(r.pose,camPoses[j]);assert.deepEqual(camPoses[k],camPoses[j]);
   assert(r.primary40to70AndSafe1550&&r.originalCriticalSafe1100);const b=r.actualSurface,c=r.criticalSurface;assert(b&&b[0]>=40&&b[2]<=1040&&b[1]>=110&&b[3]<=1550&&(b[2]-b[0])/1080>=.4&&(b[2]-b[0])/1080<=.7);if(c)assert(c[0]>=40&&c[2]<=1040&&c[1]>=110&&c[3]<=1100);
   row={...before,layer:'four-cue-camera',actualFrame:k,pose:camPoses[j],cameraOperationTime:k/30,raw:camImages.get(k),originalDeliveredRow:before,cameraSourceDeliveredRow:source,cameraPatchSourceFrame:k,originalModelHandAndSemanticOperationTimesPreserved:true};
   for(const n of names)anchors.anchors[n][j]=camAnchors.anchors[n][k];remember(row.raw);
  }else if(Object.hasOwn(map,j)){
   const k=map[j],r=physical.get(k),delivered=p.patchFrameToOriginalDeliveredRow[k];assert(Number.isInteger(k)&&r&&r.pass&&actual.has(k));
   assert.deepEqual(delivered,base[k]);assert.deepEqual(contract(delivered),contract(before));assert.deepEqual(r.pose,before.pose);
   assert.deepEqual(r.delivered,delivered);assert(r.contacts.length>=1&&r.contacts.every(x=>x.pass&&x.surfaceContactErrorMeters<=1e-6&&x.oldBottomPreservedErrorMeters<=1e-6&&x.xyBoundsUnchangedErrorMeters<=1e-7));
   row={...before,layer:'pier-contact',actualFrame:k,raw:actual.get(k),originalDeliveredRow:before,pierSourceDeliveredRow:delivered,pierContactSourceFrame:k,originalCameraAndSemanticOperationTimesPreserved:true};
   for(const n of names)anchors.anchors[n][j]=pa.anchors[n][k];selected.push(j);remember(row.raw);
  }
  assert.deepEqual(row.pose,camPoses[j]);if(!Object.hasOwn(camMap,j))assert.deepEqual(camPoses[j],poses[j]);records.push(row);
 }
 assert.equal(selected.length,expectedOutputs);assert.equal(new Set(Object.values(map)).size,expectedActual);
 assert(p.newProblemRawImages?.length===2&&p.newEngineCatalogImages?.length===2);
 const composition=p.newProblemComposition,rawProblem=composition.raw,catalog=path.dirname(p.newEngineCatalogImages[0].path),problem=cache+'/problem';
 assert.equal(path.resolve(rawProblem),path.resolve(path.dirname(report),'problem-raw'));assert.equal(path.resolve(catalog),path.resolve(path.dirname(report),'catalog'));
 assert.equal(sha(rawProblem+'/problem.json'),sha(old+'/problem/problem.json'),'Canonical problem JSON bytes must stay exact');
 assert.equal(sha(composition.composer),composition.composerSha256);assert.equal(composition.composerSha256,'a76792a81e9f1d7bc2b20b065f88d54e98d0c21453154c5ca60652acd3422f7d');putPin(pins,composition.composer,composition.composerSha256);
 for(const im of [...p.newProblemRawImages,...p.newEngineCatalogImages]){assert.equal(sha(im.path),im.sha256);putPin(pins,im.path,im.sha256);}
 for(const name of ['挑戦.png','答え.png'])assert(p.newProblemRawImages.some(im=>path.resolve(im.path)===path.resolve(rawProblem,name)));
 for(const f of ['d1-complete-merge.json','plan.json',id+'.json','phrase-times.json',id+'.voice.wav',id+'.wav',id+'.mix.json','blender/data.json','blender/desk/anchors.json','blender/desk/meta.json','blender/delivered-camera-poses.json','blender/delivered-provenance.json','blender/camera-motion.json'])putPin(pins,old+'/'+f,sha(old+'/'+f));
 const rounded=camPoses.map(p=>p.map(v=>Number(v.toFixed(10)))),moving=[false,...rounded.slice(1).map((p,i)=>JSON.stringify(p)!==JSON.stringify(rounded[i]))],spans=[];let begin=null;
 for(let j=0;j<=12163;j++){const active=moving[j]??false;if(active&&begin===null)begin=j/30;if(!active&&begin!==null){spans.push([begin,j/30]);begin=null;}}
 const cameraMotion={frames:12163,moving_frames:moving.filter(Boolean).length,moving_ratio:moving.filter(Boolean).length/12163,top_ratio:camPoses.filter(p=>p[5]>=65).length/12163,moving_spans:spans};assert.deepEqual(cameraMotion,cam.cameraMotion);assert(cameraMotion.moving_ratio<=.2&&cameraMotion.top_ratio<=.2);
 const key=hash([meta.key,reportPin,cameraPin,sha(frame),anchors.anchors]).slice(0,20);anchors.key=key;
 fs.mkdirSync(cache+'/blender/desk',{recursive:true});
 for(const f of ['plan.json',id+'.json','phrase-times.json',id+'.voice.wav',id+'.wav',id+'.mix.json'])link(old+'/'+f,cache+'/'+f);
 link(old+'/blender/data.json',cache+'/blender/data.json');if(exists(old+'/blender/tex'))link(old+'/blender/tex',cache+'/blender/tex');
 for(let j=0;j<12163;j++)link(records[j].raw,cache+'/blender/desk/'+jpg(j));
 write(cache+'/blender/desk/anchors.json',anchors);write(cache+'/blender/desk/meta.json',{...meta,key,previousKey:meta.key,privateCameraAndPierContactDerivative:true,originalPlannerNotRecertified:true});
 write(cache+'/blender/delivered-camera-poses.json',camPoses);write(cache+'/blender/camera-motion.json',cameraMotion);
 write(cache+'/blender/delivered-provenance.json',{episode:'D-1',frames:records,precedence:['four-cue-camera','pier-contact','previous-local-camera-production'],cameraPierMapsDisjoint:true,previousProvenanceSha256:fixed[old+'/blender/delivered-provenance.json'],onlyFourCueCamerasAndThreePierTransformsChanged:true,originalObjectHandAndSemanticOperationTimesPreserved:true});
 const composed=child([composition.composer],{...env(),EM_FILM_CACHE:old,D1_PROBLEM_SOURCE:rawProblem,D1_PROBLEM_OUT:problem});assert.equal(composed.status,0);
 assert.equal(sha(problem+'/problem.json'),sha(old+'/problem/problem.json'));
 link(catalog,cache+'/pier-engine-catalog');link(old+'/new-part-catalog-coal-support',cache+'/coal-support-catalog');
 const files=['plan.json',id+'.json','phrase-times.json',id+'.voice.wav',id+'.wav',id+'.mix.json','blender/data.json','blender/desk/meta.json','blender/desk/anchors.json','blender/delivered-provenance.json','blender/delivered-camera-poses.json','blender/camera-motion.json','problem/problem.json','problem/挑戦.png','problem/答え.png'];
 const prepared={episode:'D-1',cache,source:old,frames:12163,pillarActualSources:expectedActual,pillarReplacementOutputs:expectedOutputs,report:path.resolve(report),reportSha256:reportPin,helper:path.resolve(helper),helperSha256:sha(helper),pierAdapterCompletion:completionFile,pierAdapterCompletionSha256:sha(completionFile),actual120RecoveryProof:{diagnostic:v5.diagnostic,diagnosticSha256:v5.diagnosticSha256,recovery:v5.recovery,recoverySha256:v5.recoverySha256,pierReportRole:pierProof.role,original105SuccessNotAssumed:true},cameraReport:path.resolve(cameraReport),cameraReportSha256:cameraPin,cameraHelper:path.resolve(cameraHelper),cameraHelperSha256:cameraHelperPin,cameraActualSources:cameraActual,cameraReplacementOutputs:cameraOutputs,cameraMotion,cameraPierMapsDisjoint:true,rootProbeVisualReceipt:p.rootProbeVisualReceipt,rootProbeVisualReceiptSha256:p.rootProbeVisualReceiptSha256,layoutFrame:frame,layoutFrameSha256:sha(frame),layoutQa,layoutQaSha256:sha(layoutQa),hook,hookSha256:sha(hook),runner:self,runnerSha256:sha(self),generatedInputSha256:Object.fromEntries(files.map(f=>[cache+'/'+f,sha(cache+'/'+f)])),problemImages:['挑戦.png','答え.png'].map(n=>({path:problem+'/'+n,sha256:sha(problem+'/'+n),actuallyViewed:false})),sourceFileSnapshots:[...snapshots.values()],protectedInputSha256:pins,all12163OutputRowsAccountedFor:true,allCameraChangesRestrictedToFourOriginalCues:true,problemCanonicalJsonByteIdentical:true,old855CandidateAndDiagnosticsPreserved:true,assemblyOnlyNotFinalAcceptance:true,actualFinalReviewPending:true,earsVerified:false,originalNGPreserved:true,finalAcceptance:false};
 write(cache+'/prepared.json',prepared);verify(pins);verifyRows(prepared.sourceFileSnapshots);console.log(JSON.stringify({cache,prepared:true,sourceFrames:12163,actualPillar:expectedActual,pierOutputs:expectedOutputs,cameraActual,cameraOutputs,totalReplacementOutputs:expectedOutputs+cameraOutputs,noEncode:true}));
}else{
 const p=read(cache+'/prepared.json');assert.equal(p.cache,cache);assert.equal(p.finalAcceptance,false);assert.equal(sha(self),p.runnerSha256);verify(p.protectedInputSha256);verify(p.generatedInputSha256);verifyRows(p.sourceFileSnapshots);
 const sourceRows=read(cache+'/blender/delivered-provenance.json').frames;assert.equal(sourceRows.length,12163);
 for(let j=0;j<12163;j++){assert.equal(sourceRows[j].frame,j);assert.equal(fs.realpathSync(cache+'/blender/desk/'+jpg(j)),fs.realpathSync(sourceRows[j].raw));}
 const requiredFiles=['plan.json',id+'.json','phrase-times.json',id+'.voice.wav',id+'.wav',id+'.mix.json','blender/data.json','blender/desk/meta.json','blender/desk/anchors.json','blender/delivered-provenance.json','blender/delivered-camera-poses.json','blender/camera-motion.json','problem/problem.json','problem/挑戦.png','problem/答え.png'];
 const before=Object.fromEntries(requiredFiles.map(f=>[cache+'/'+f,sha(cache+'/'+f)]));
 const verifyAfter=()=>{verify(p.protectedInputSha256);verify(p.generatedInputSha256);verifyRows(p.sourceFileSnapshots);verify(before);};
 if(mode==='--encode'){
  assert(!exists(out)&&!exists(cache+'/'+id+'.rendering.mp4'),'Every old/partial output is preserved');assert(!process.env.FILM_PREFLIGHT&&!process.env.FILM_STORYBOARD);assert(!process.env.FILM_SHARD||process.env.FILM_SHARD==='0/1');
  fs.mkdirSync(out);const start=Date.now(),r=child(['--import',hook,'scripts/render-all-films-gptv2.mjs',id],{...env(),FILM_OUTPUT:out,FILM_COPY_AUDIO:'0'});assert.equal(r.status,0);verifyAfter();
  const video=out+'/'+id+'.mp4';assert(fs.statSync(video).size>1e6);const meta=spawnSync(ff,['-hide_banner','-i',video],{encoding:'utf8',maxBuffer:1e7});assert.equal(meta.status,1);
  const md=meta.stderr??'',v=md.split('\n').find(x=>x.includes('Video:')),a=md.split('\n').find(x=>x.includes('Audio:')),dur=md.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);assert(v?.includes('1080x1920')&&/\b30 fps\b/.test(v)&&a&&dur);
  const seconds=+dur[1]*3600+ +dur[2]*60+ +dur[3];assert(Math.abs(seconds-read(cache+'/'+id+'.json').duration)<.15);
  write(out+'/metadata.json',{metadata:md,metadataCommandExit:1,durationSeconds:seconds,videoDescriptor:v,audioDescriptor:a,notAFullDecodeOrEarCheck:true});
  write(cache+'/export.json',{episode:'D-1',video,videoSha256:sha(video),preparedSha256:sha(cache+'/prepared.json'),sourceFrames:12163,metadata:out+'/metadata.json',metadataSha256:sha(out+'/metadata.json'),inputSha256Before:before,inputSha256After:Object.fromEntries(requiredFiles.map(f=>[cache+'/'+f,sha(cache+'/'+f)])),seconds:(Date.now()-start)/1000,encoder:'Unmodified render-all-films-gptv2.mjs CRF18; only final-D compositor import routed to approved private layout',allFinalVisualAndOriginalChecksPending:true,earsVerified:false,finalAcceptance:false});console.log(JSON.stringify({video,sha256:sha(video),encodeToReviewOnly:true}));
 }else if(mode==='--checks'){
  const exp=read(cache+'/export.json');assert.equal(sha(exp.video),exp.videoSha256);assert.equal(exp.preparedSha256,sha(cache+'/prepared.json'));
  const start=Date.now(),r=child(['scripts/umech/desk-axes-d1-final-checks.mjs',exp.video],{...env(),D1_FINAL_GATE_CACHE:cache+'/final-original-gates',NODE_OPTIONS:[process.env.NODE_OPTIONS??'','--import='+hook].filter(Boolean).join(' ')});verifyAfter();
  write(cache+'/original-checks-launch.json',{episode:'D-1',mp4Sha256:exp.videoSha256,launcher:'scripts/umech/desk-axes-d1-final-checks.mjs',launcherSha256:fixed['scripts/umech/desk-axes-d1-final-checks.mjs'],exitCode:r.status,seconds:(Date.now()-start)/1000,actualPrivateCompositorUsedForSvgChecks:true,originalInspectorsAndThresholdsUnchanged:true,onlyPreexistingFourIdCaption165Exception:true,originalNGMustBePreserved:true,earsVerified:false,finalAcceptance:false});process.exitCode=r.status??1;
 }else{
  const exp=read(cache+'/export.json');assert.equal(sha(exp.video),exp.videoSha256);assert.equal(exp.preparedSha256,sha(cache+'/prepared.json'));
  const requestFile=cache+'/d1-supplement-requests.json',request=read(requestFile),gateFile=path.dirname(request.originalGate)+'/d1-original-and-supplement-pending.json',gate=read(gateFile);
  assert(request.episode==='D-1'&&request.automaticApproval===false&&Array.isArray(request.requests));assert.equal(gate.mp4Sha256,exp.videoSha256);
  assert.equal(sha(request.originalGate),request.originalGateSha256);assert.equal(sha(request.originalFrameSamples),request.originalFrameSamplesSha256);
  const data=read(cache+'/blender/data.json'),nf=Math.ceil(data.duration*30),motion=read(cache+'/blender/camera-motion.json');assert.equal(nf,12163);assert.equal(data.cues.length,57);assert.equal(data.landmarks.length,12);
  // Count actual video samples, not the rounded MP4 format-duration display.
  const bytes=fs.readFileSync(exp.video);
  const boxes=(a,b)=>{const r=[];while(a<b){let n=bytes.readUInt32BE(a),h=8;const type=bytes.toString('ascii',a+4,a+8);if(n===1){n=Number(bytes.readBigUInt64BE(a+8));h=16;}if(n===0)n=b-a;assert(n>=h&&a+n<=b);r.push({type,payload:a+h,end:a+n});a+=n;}assert.equal(a,b);return r;};
  const childBox=(b,n)=>{const c=boxes(b.payload,b.end).find(x=>x.type===n);assert(c,n);return c;},moov=boxes(0,bytes.length).find(x=>x.type==='moov');assert(moov);
  const track=boxes(moov.payload,moov.end).filter(x=>x.type==='trak').find(b=>{const h=childBox(childBox(b,'mdia'),'hdlr');return bytes.toString('ascii',h.payload+8,h.payload+12)==='vide';});assert(track);
  const stsz=childBox(childBox(childBox(childBox(track,'mdia'),'minf'),'stbl'),'stsz'),encoded=bytes.readUInt32BE(stsz.payload+8);assert(encoded===nf||encoded===nf-1,'More than the known one-frame CFR boundary is not an approved remapping');
  const selected=[],add=(time,reason)=>selected.push({time,reasons:[reason]});
  for(let t=0;t<Math.ceil(data.duration);t++)add(t,'required-integer-second');
  for(const q of data.cues)add((Math.ceil(q.end*30-1e-7)-1)/30,'exact-cue-final:'+q.key);
  for(const t of data.landmarks)add(t,'required-main12');
  const critical=[0,2,20,34.216667,35.24,35.5,118.8,120.6,121.5,122.3,124.3,125.975667,126.084,126.17,133.287333,133.570667,133.870667,134.462667,140.5,150.16666666666666,152,153.06666666666666,168.5,169.8,171.5,172.3,174,220.26666666666668,221.5,240.5,310.5,311,315.4,315.43333333333334,318.46666666666664,318.5,320,333.2,334.6666666666667,334.73333333333335,339.5,339.8,341.6,365.2,367.2,379.43333333333334,398.2,403.3,405.4];
  for(const t of critical)add(t,'required-critical-tongs-straw-valve-coal-pressure-bookend');
  // Named real repairs, not every30fps raw: card boundaries and representative
  // contact states from the root-approved new pier probe are important timings.
  for(const j of [1527,1620,1662,2529,2730,2807,4860,4980,5037])add(j/30,'approved-layout-repair-important-state');
  const pillar=read(p.report),probe=read(pillar.approvedProbeReport);assert(Array.isArray(probe.actualImages)&&probe.actualImages.length>0);
  for(const im of probe.actualImages){assert(Number.isInteger(im.frame)&&im.frame>=0&&im.frame<nf);add(im.frame/30,'approved-pier-probe-important-state');}
  const camera=read(p.cameraReport),cameraProbe=read(path.dirname(path.dirname(p.cameraReport))+'/probe/report.json');for(const im of cameraProbe.actualImages)add(im.frame/30,'approved-camera-probe-important-state');
  for(const phase of camera.phaseDefinitions)for(const t of [phase.a,phase.b])for(const offset of [-1,0,1]){const j=Math.ceil(t*30-1e-8)+offset;if(j>=0&&j<nf)add(j/30,'exact-fixed-camera-phase-boundary');}
  for(const[a,b]of motion.moving_spans)add((a+b)/2,'every-delivered-camera-move-middle');selected.push(...request.requests);
  const missing=selected.filter(r=>Math.round(r.time*30)>=encoded);assert(missing.every(r=>Math.round(r.time*30)===12162&&r.reasons.includes('required-critical-tongs-straw-valve-coal-pressure-bookend')));
  assert(request.requests.every(r=>Math.round(r.time*30)<encoded),'Original physical/visual request indices must remain exact');
  assert(data.cues.every(q=>Math.ceil(q.end*30-1e-7)-1<encoded),'A cue-end cannot be silently remapped');
  assert(missing.length<=1);let actualEofProof=null;
  if(missing.length){
   const tailStart=encoded-3,tailLog=cache+'/final-review-actual-eof.log';assert(!exists(tailLog));
   const decoded=spawnSync(ff,['-hide_banner','-nostats','-i',exp.video,'-map','0:v:0','-an','-vf',`select=gte(n\\,${tailStart}),showinfo`,'-fps_mode','passthrough','-f','null','-'],{encoding:'utf8',maxBuffer:1e7});assert.equal(decoded.status,0);
   fs.writeFileSync(tailLog,decoded.stderr,{flag:'wx'});const tb=decoded.stderr.match(/config in time_base:\s*(\d+)\/(\d+)/);assert(tb,'Exact showinfo time_base required, not rounded pts_time');const numerator=Number(tb[1]),denominator=Number(tb[2]);assert(numerator>0&&denominator>0);
   const tail=[...decoded.stderr.matchAll(/\bn:\s*(\d+) pts:\s*(\d+) pts_time:([\d.]+)/g)].map(m=>({tailIndex:Number(m[1]),pts:Number(m[2]),printedPtsTime:Number(m[3]),exactTime:Number(m[2])*numerator/denominator}));
   assert.equal(tail.length,3);assert(tail.every((r,i)=>r.tailIndex===i&&Math.abs(r.exactTime-(tailStart+i)/30)<=1e-9));
   actualEofProof={containerVideoSamples:encoded,decodedThroughEofFrameCount:tailStart+tail.length,lastActualFrame:encoded-1,decodedTail:tail,timeBase:[numerator,denominator],tailLog,tailLogSha256:sha(tailLog),noRawSubstitution:true,noReencode:true};
  }
  const mappings=missing.map(r=>({requestedTime:r.time,requestedSourceFrame:12162,actualEncodedFrame:encoded-1,actualEncodedTime:(encoded-1)/30,timeDifferenceSeconds:1/30,reason:'Known unchanged-encoder CFR endpoint only, independently decoded through EOF; actual final encoded image, never raw substitution',originalReasons:r.reasons,notCueEndOrPhysicalRequest:true}));
  const mapped=selected.map(r=>Math.round(r.time*30)>=encoded?{...r,time:(encoded-1)/30,reasons:[...r.reasons,'explicit-actual-last-frame-for-source12162'],requestedSourceTime:r.time,requestedSourceFrame:12162}:r);
  const selection=cache+'/final-required-selection.json',review=cache+'/actual-final-review';assert(!exists(selection)&&!exists(review));
  write(selection,{episode:'D-1',automaticApproval:false,mp4Sha256:exp.videoSha256,encodedFrames:encoded,sourceFrames:nf,actualEndpointMappings:mappings,originalCandidates:requestFile,originalCandidatesSha256:sha(requestFile),scope:'All integer seconds, exact cue finals, main12, repair-critical/word states, move middles and every final original7/7b/sparse request; not every30fps raw',requests:mapped});
  const r=child(['scripts/umech/desk-d1v1-review.mjs'],{...env(),D1_REVIEW_MP4:exp.video,D1_REVIEW_OUT:review,D1_SUPPLEMENT_REQUEST:selection,D1_FINAL_AUDIT:''});assert.equal(r.status,0);verifyAfter();assert.equal(sha(exp.video),exp.videoSha256);
  const manifestFile=review+'/d1v1-review-manifest.json',manifest=read(manifestFile),indices=new Set(manifest.frames.map(r=>r.frameIndex));assert.equal(manifest.mp4Sha256,exp.videoSha256);assert.equal(manifest.integerSeconds,406);assert.equal(manifest.cueEnds,57);assert(mapped.every(r=>indices.has(Math.round(r.time*30))));
  assert(data.cues.every(q=>indices.has(Math.ceil(q.end*30-1e-7)-1)));assert(data.landmarks.every(t=>indices.has(Math.round(t*30))));assert(manifest.frames.every(r=>r.frameIndex<encoded));
  const previousManifestFile=old+'/actual-final-required-review-v4-endframe-20261025/d1v1-review-manifest.json';assert.equal(sha(previousManifestFile),'a1792c20470c3840389727f5e84d917f87617757a30f1ff3a1a9c0378f32bd29');
  const previous=read(previousManifestFile),eyes=read(oldEyes),previousByIndex=new Map(previous.frames.map(r=>[r.frameIndex,r])),oldPages=eyes.pageCoverage;
  assert.equal(previous.mp4Sha256,fixed[old+'/out-final-d1v1/ys-chain-d1v1.mp4']);assert.equal(eyes.aggregateAuthorPersonalScope.all855PersonallyViewed,false);assert(eyes.coverage.allSelectedCellsCoveredByExactlyOneAttributedReceipt);
  const reuse=[],pending=[];
  for(const row of manifest.frames){
   const f=review+'/frames-d1v1/'+row.file;assert.equal(sha(f),row.fileSha256);const oldRow=previousByIndex.get(row.frameIndex);
   if(oldRow&&row.fileSha256===oldRow.fileSha256){
    const oldFile=path.dirname(previousManifestFile)+'/frames-d1v1/'+oldRow.file;assert.equal(sha(oldFile),oldRow.fileSha256);
    const page=oldPages.find(p=>p.frameIndices.includes(row.frameIndex));assert(page,'Every reused eye must have a scoped, attributed old page');assert.equal(sha(page.receipt),page.receiptSha256);assert.equal(sha(path.dirname(previousManifestFile)+'/'+page.file),page.sha256);
    reuse.push({frameIndex:row.frameIndex,file:f,jpegSha256:row.fileSha256,oldFile,oldMp4Sha256:previous.mp4Sha256,oldManifestSha256:sha(previousManifestFile),scopedOldPage:page.page,reviewer:page.reviewer,receipt:page.receipt,receiptSha256:page.receiptSha256,reason:'Actual final decoded JPEG byte-identical to the same old actual encoded frame; attribution only, not a new personal-eye claim'});
   }else pending.push({frameIndex:row.frameIndex,time:row.time,file:f,jpegSha256:row.fileSha256,oldJpegSha256:oldRow?.fileSha256??null,reason:oldRow?'Actual encoded JPEG bytes changed; fresh actual eyes required':'New required actual frame; fresh actual eyes required'});
  }
  // Fullsize side-by-side exact main12 pairs, alongside all generic sheets.
  fs.mkdirSync(review+'/main12');fs.mkdirSync(review+'/reference-main12-fullsize');const referenceTimes=[7,13,25,268,20,94,95,337,418,364,431,488],pairs=[],refIndices=[...new Set(referenceTimes.map(t=>t*30))].sort((a,b)=>a-b);
  assert.equal(manifest.referenceSha256,'ea0cef6700b81ee775b7c2b7452b2c9dc154dad78e898419c2e802e25d220978');assert.equal(sha(manifest.reference),manifest.referenceSha256);
  const refDecode=spawnSync(ff,['-v','error','-i',manifest.reference,'-vf','select='+refIndices.map(j=>`eq(n\\,${j})`).join('+'),'-fps_mode','passthrough','-q:v','2',review+'/reference-main12-fullsize/reference-%02d.jpg'],{encoding:'utf8',maxBuffer:1e7});assert.equal(refDecode.status,0);assert.equal(fs.readdirSync(review+'/reference-main12-fullsize').filter(n=>n.endsWith('.jpg')).length,12);
  for(let n=0;n<12;n++){
   const j=Math.round(data.landmarks[n]*30),row=manifest.frames.find(r=>r.frameIndex===j);assert(row);const ref=review+'/reference-main12-fullsize/reference-'+String(refIndices.indexOf(referenceTimes[n]*30)+1).padStart(2,'0')+'.jpg',own=review+'/frames-d1v1/'+row.file,dest=review+'/main12/pair-'+String(n+1).padStart(2,'0')+'.png',refMeta=await sharp(ref).metadata();assert.equal(refMeta.width,1080);assert.equal(refMeta.height,1920);
   await sharp({create:{width:2160,height:1920,channels:3,background:'#fff'}}).composite([{input:await sharp(own).resize(1080,1920).toBuffer(),left:0,top:0},{input:await sharp(ref).resize(1080,1920).toBuffer(),left:1080,top:0}]).png().toFile(dest);
   pairs.push({n:n+1,frameIndex:j,time:j/30,file:dest,sha256:sha(dest),actualJpegSha256:row.fileSha256,referenceTime:referenceTimes[n],referenceDecodedJpeg:ref,referenceDecodedJpegSha256:sha(ref),referenceNativeReviewResolution:[1080,1920],actuallyViewed:false});
  }
  write(review+'/required-coverage-and-reuse.json',{episode:'D-1',mp4:exp.video,mp4Sha256:exp.videoSha256,manifest:manifestFile,manifestSha256:sha(manifestFile),selection,selectionSha256:sha(selection),sourceFrames:nf,actualEncodedFrames:encoded,actualEofProof,actualEndpointMappings:mappings,integerSeconds:406,exactCueFinalFrames:57,main12:pairs,originalCandidateRequests:request.requests.length,originalCandidatesAllExact:true,allRequestedActualFramesPresent:true,selectedFrames:manifest.frames.length,pages:manifest.pages.length,attributedByteIdenticalOldReviewFrames:reuse,newActualEyeFramesRequired:pending,allNewRequiredFramesActuallyViewed:false,problem2:p.problemImages,physicalSupplementRequiresNewFinalSourceReplay:true,old099NotAFinalRawCertification:true,originalNGPreserved:true,earsVerified:false,finalAcceptance:false});
  console.log(JSON.stringify({review,selectedFrames:manifest.frames.length,pages:manifest.pages.length,reusedAttributedEyes:reuse.length,newActualEyesRequired:pending.length,main12:12,problem2:2,finalAcceptance:false}));
 }
}



