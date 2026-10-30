// Add-only final raw assembly: LOCAL bundle > CAMERA correction > original.
// No encoder or GPU calls. Root-approved probes plus all strict numeric states
// permit ASSEMBLY/ENCODE-TO-REVIEW only; final integer-second eyes remain pending.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
const base='/private/tmp/ys/ys-chain-d1v1-production-r15',cam=process.env.D1_CAMERA_ROOT??'/private/tmp/ys/ys-chain-d1v1-camera-patch-v2-20261024',local=process.env.D1_LOCAL_ROOT??'/private/tmp/ys/ys-chain-d1v1-final-local-bundle-v4-20261024',dest=process.env.D1_COMPLETE_CACHE??'/private/tmp/ys/ys-chain-d1v1-final-complete-v4-20261025';
const helper=process.env.D1_LOCAL_HELPER??'scripts/blender/desk_axes_d1_final_local_bundle_v4_20261024.py',read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),jsha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex'),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,1),{flag:'wx'});
assert(!fs.existsSync(dest)&&![base,cam,local].includes(dest));assert(!fs.lstatSync(path.dirname(dest)).isSymbolicLink());
const prod=read(base+'/d1-production-finished.json'),cp=read(cam+'/camera-patch-complete.json'),lp=read(local+'/render/report.json'),probeQaPath='deep/D-1_localv4_22actualと新部品2視点_承認_20261025.json',qa=read(probeQaPath);
assert.equal(sha(probeQaPath),'516d30491caf041ca3c268714cf3af584fb7979d06efeabb8c81b78ad34eeb28');
assert(prod.all12163JpegsPresent&&prod.all5070RenderSourcesDone&&cp.allPatchFramesActuallyRendered&&cp.allReplacementFramesPhysicalPass);
assert(lp.allPatchFramesActuallyRendered&&lp.allReplacementPhysicalPass&&lp.sameStoppedBookendPose&&lp.renders===lp.actualFrameCount);
assert(Object.values(lp.protection).every(Boolean));assert.equal(lp.helperSha256,sha(helper));assert.equal(lp.originalCameraCompleteReportSha256,sha(cam+'/camera-patch-complete.json'));
assert.equal(lp.actualFrameCount,1991);assert.equal(lp.replacementOutputCount,2905);
assert.equal(qa.helperSha256,lp.helperSha256);assert.equal(qa.probeReportSha256,'89cc2d0853a01ca0a1513582cfbaa113a2262690cabcbc6985891069c1f076b1');assert.equal(qa.probeReportSha256,sha(local+'/probe/report.json'));assert.equal(lp.approvedProbeReportSha256,qa.probeReportSha256);
assert(qa.approvedForFullLocalV4Render&&qa.all22RawIndividuallyDisplayedAndViewed&&qa.all22CompositesViewedOnContactSheets&&qa.defectsInReviewedProbes===0&&qa.tongsGripAndMetalClearanceVisuallyVerified&&qa.valveAttachmentVisuallyVerified&&qa.sameStoppedBookendVerified&&qa.coalSupportVisuallyVerified,'Actual approved probes are required before assembly/encode-to-review');
assert.equal(qa.catalogViewsIndividuallyDisplayedAndViewed.length,2);for(const im of qa.catalogViewsIndividuallyDisplayedAndViewed)assert.equal(sha(im.path),im.sha256);
assert.equal(qa.all1991ActualLocalFramesViewed,false);assert.equal(qa.readyForExport,false);assert.equal(qa.finalAcceptance,false);
for(const[p,h]of Object.entries(lp.frozen))assert.equal(sha(p),h,p);
for(const r of lp.actualImages)assert.equal(sha(r.path),r.sha256,r.path);
const probe=read(local+'/probe/report.json');assert.equal(probe.helperSha256,lp.helperSha256);assert.equal(lp.approvedProbeReportSha256,sha(local+'/probe/report.json'));assert(probe.newPartCatalogActualImages?.length===2);for(const im of probe.newPartCatalogActualImages)assert.equal(sha(im.path),im.sha256);
const n=12163,meta=read(base+'/blender/desk/meta.json'),a0=read(base+'/blender/desk/anchors.json'),aC=read(cp.anchors),aL=read(lp.anchors);assert(meta.frames===n&&a0.frames===n&&meta.key===a0.key&&a0.fps===30);
const names=Object.keys(a0.anchors).sort();assert.deepEqual(Object.keys(aC.anchors).sort(),names);assert.deepEqual(Object.keys(aL.anchors).sort(),names);for(const a of[a0,aC,aL])for(const x of Object.values(a.anchors))assert.equal(x.length,n);
const originalPoseFile=process.env.D1_ORIGINAL_MAP??'/private/tmp/ys/ys-chain-d1v1-render/d1-frozen-original-delivery-map-20261024.json',originalMap=read(originalPoseFile);
const originalPlans=originalMap.plans;assert(Array.isArray(originalPlans)&&originalPlans.length===n,'Original exact plan required; never guess refs');assert.equal(originalMap.planSha256,prod.planSha256);assert.equal(originalMap.sourceProductionCompleteSha256,sha(base+'/d1-production-finished.json'));
const pC=new Map(cp.physical.map(r=>[r.frame,r])),pL=new Map(lp.physical.map(r=>[r.frame,r])),selected=[],poses=[],provenance=[],anchors=structuredClone(a0),sources=new Map();
for(let j=0;j<n;j++){
 let k,ref,pose,cameraTime,semanticTime,raw,layer,aa;
 if(lp.replacementFrameToActualPatchFrame[j]!==undefined){k=lp.replacementFrameToActualPatchFrame[j];ref=lp.patchFrameToUnchangedOtherObjectSourceFrame[k];const r=pL.get(k);assert(r&&r.pass);pose=r.pose;cameraTime=r.cameraOperationTime;semanticTime=k/30;raw=lp.raw+'/'+String(k).padStart(5,'0')+'.jpg';layer='local';aa=aL;}
 else if(cp.replacementFrameToActualPatchFrame[j]!==undefined){k=cp.replacementFrameToActualPatchFrame[j];ref=cp.patchFrameToUnchangedObjectSourceFrame[k];const r=pC.get(k);assert(r&&r.pass);pose=r.pose;cameraTime=k/30;semanticTime=null;raw=cp.raw+'/'+String(k).padStart(5,'0')+'.jpg';layer='camera';aa=aC;}
 else{const p=originalPlans[j];assert(['render','dup'].includes(p[0]));ref=p[0]==='render'?j:p[1];k=ref;raw=base+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg';layer='production';aa=a0;cameraTime=ref/30;semanticTime=null;pose=null;}
 const st=fs.lstatSync(raw);assert(st.isFile()&&!st.isSymbolicLink()&&st.size>1000,raw);sources.set(raw,{bytes:st.size,mtimeMs:st.mtimeMs});
 if(layer==='production'){const r=(prod.deliveredCameraPoses??[])[j];if(r)pose=r;}
 selected.push(raw);poses.push(pose);provenance.push({frame:j,layer,actualFrame:k,unchangedOtherObjectSourceFrame:ref,semanticOperationTime:semanticTime,cameraOperationTime:cameraTime,pose,raw});
 if(layer!=='production')for(const name of names)anchors.anchors[name][j]=aa.anchors[name][k];
}
// Exact original source poses are produced by the frozen-source AST helper at
// root's preflight, not a nominal camera table or interpolation in this script.
const arr=originalMap.poses;assert(arr.length===n);for(let j=0;j<n;j++)if(!poses[j]){poses[j]=arr[j];provenance[j].pose=arr[j];}assert(poses.every(p=>Array.isArray(p)&&p.length===7));
const key=jsha([meta.key,lp.helperSha256,sha(local+'/render/report.json'),lp.replacementFrameToActualPatchFrame,cp.replacementFrameToActualPatchFrame,anchors.anchors]).slice(0,20);anchors.key=key;
fs.mkdirSync(dest+'/blender/desk',{recursive:true});const link=(s,d)=>fs.symlinkSync(s,d);
for(const f of ['plan.json','ys-chain-d1v1.json','phrase-times.json','ys-chain-d1v1.voice.wav','ys-chain-d1v1.wav','ys-chain-d1v1.mix.json'])link(base+'/'+f,dest+'/'+f);link(base+'/blender/data.json',dest+'/blender/data.json');if(fs.existsSync(base+'/blender/tex'))link(base+'/blender/tex',dest+'/blender/tex');
for(let j=0;j<n;j++)link(selected[j],dest+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg');write(dest+'/blender/desk/anchors.json',anchors);write(dest+'/blender/desk/meta.json',{...meta,key,originalKey:meta.key,localDerivative:true});write(dest+'/blender/delivered-camera-poses.json',poses);
const changed=[false,...poses.slice(1).map((p,i)=>JSON.stringify(p)!==JSON.stringify(poses[i]))],spans=[];let a=null;for(let j=0;j<=n;j++){if(changed[j]&&a===null)a=j/30;if(!changed[j]&&a!==null){spans.push([a,j/30]);a=null;}}
write(dest+'/blender/camera-motion.json',{frames:n,moving_frames:changed.filter(Boolean).length,moving_ratio:changed.filter(Boolean).length/n,moving_spans:spans,top_ratio:poses.filter(p=>p[5]>=65).length/n,method:'Every delivered source-pose, local > camera > original held ref. Cuts count as motion.'});
link('/private/tmp/ys/ys-chain-d1v1-render/problem-final-d1v1',dest+'/problem');link(local+'/probe/catalog-coal-support-v4',dest+'/new-part-catalog-coal-support');
const record={episode:'D-1',frames:n,fps:30,finalCache:dest,production:base,camera:cam,localBundle:local,localHelper:path.resolve(helper),localHelperSha256:lp.helperSha256,localRenderReportSha256:sha(local+'/render/report.json'),localPreEncodeProbeQa: path.resolve(probeQaPath),localPreEncodeProbeQaSha256:sha(probeQaPath),preEncodeApprovalScope:'Assembly and encode-to-review only:22 approved actual probes plus2 catalog views and1991 strict numeric actual states; no all1991 human-eye requirement or claim',patchCompleteReportSha256:sha(cam+'/camera-patch-complete.json'),originalPoseFile,originalPoseFileSha256:sha(originalPoseFile),assemblerSha256:sha(new URL(import.meta.url)),localProbeSha256:sha(local+'/probe/report.json'),newPartCatalogImages:probe.newPartCatalogActualImages,originalRawAndSourcesNotModified:true,localOutputCount:Object.keys(lp.replacementFrameToActualPatchFrame).length,localActualCount:lp.actualFrameCount,precedence:['local','camera','production'],sourceFileStats:[...sources].map(([file,stat])=>({file,...stat})),actualFinalMp4ReviewPending:true,allFinalIntegerSecondsReviewPending:true,finalActualCueEndsCritical12AndAllOriginalCandidatesReviewPending:true,originalInspectorNGPreserved:true,automaticApproval:false,finalAcceptance:false,finalPassed:false,provenance:dest+'/blender/delivered-provenance.json',deliveredPoses:dest+'/blender/delivered-camera-poses.json'};
write(dest+'/blender/delivered-provenance.json',{episode:'D-1',originalOtherObjectRefAlwaysPreserved:true,explicitSemanticDerivatives:lp.limits,frames:provenance});write(dest+'/d1-complete-merge.json',record);console.log(JSON.stringify({...record,sourceFileStats:record.sourceFileStats.length},null,1));


