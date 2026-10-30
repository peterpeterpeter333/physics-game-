// NEW CPU-only manifest/finalizer. Never runs Blender, a renderer or an encoder.
// node THIS.mjs manifest REPORT_JSON NEW_MANIFEST_JSON
// node THIS.mjs finalize NEW_COMPOSITION_CACHE RENDER_REPORT_JSON FINAL_MP4
// FFMPEG may name the root's read-only diagnostic executable.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const source='/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025',id='ys-chain-b1v1',nf=10700,fps=30;
const W=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const baseEvaluation='/private/tmp/ys/ys-chain-b1v1-exact-visible-primary-audit-20261025/report.json';
const faceFile=W+'/outputs/axes-20261023/b1-exact-face-state-plan-20261025.json';
const basePins={
 [source+'/prepared.json']:'93b4f6ee2d603eef8771235cb3a051b1a817be9e86565df49b0ae2281c1bc412',
 [source+'/composite-provenance.json']:'c13cfdb83c0513ac28bfc4345be8a57bbb979b4301130339cbe4c647e4952135',
 [source+'/blender/delivered-camera-poses.json']:'aa4106563b81e8afc8d33c4eb1d19d58ace2e0b706330409bb48ed1a070d883f',
 [source+'/validation-final-v1/quality-gate.json']:'da15cd05bed4cebfa3ad922a96b20d822742726718467d7be56e1a8b03b23653',
 [baseEvaluation]:'2f6c4df22e67c13af81ae37701b18305d67f09c62544c875908fa235929ddbaa',
 [faceFile]:'4c9972ce18f80d696692b85d75c4db520d7eedd52ac3baec360d68030459a8e5',
};
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const digest=b=>createHash('sha256').update(b).digest('hex');
const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
const verify=pins=>{for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);};
const mergePins=(target,extra)=>{for(const[p,h]of Object.entries(extra)){if(Object.hasOwn(target,p))assert.equal(target[p],h,p);target[p]=h;}};
const jpg=j=>String(j).padStart(5,'0')+'.jpg';
const allowed=p=>{p=path.resolve(p);assert(p.startsWith('/private/tmp/ys/')&&!p.startsWith(source+'/')&&p!==source);return p;};
const noSymlinkAncestors=p=>{for(let d=path.dirname(p);d!=='/';d=path.dirname(d))if(exists(d))assert(!fs.lstatSync(d).isSymbolicLink(),d);};
const write=(p,value)=>{allowed(p);noSymlinkAncestors(p);assert(!exists(p),p);fs.writeFileSync(p,JSON.stringify(value,null,1)+'\n',{flag:'wx'});};
const link=(a,b)=>{allowed(b);noSymlinkAncestors(b);assert(fs.statSync(a).isFile());assert(!exists(b),b);fs.symlinkSync(path.resolve(a),b);};
const sortedNumbers=xs=>[...xs].sort((a,b)=>a-b);
const posesEqual=(a,b)=>a.length===b.length&&a.every((x,i)=>Math.abs(x-b[i])<=1e-9);
function scale(j){
 if(j>=3169&&j<=3440)return 39/40;
 if(j>=4825&&j<=4916)return 36.8/40;
 if(j>=4917&&j<=4940){const u=Math.max(0,Math.min(1,(j-4917)/23));return(36.8+3.2*u*u*(3-2*u))/40;}
 if(j>=8953&&j<=8975)return 44/40;
 return 1;
}
const changed=Array.from({length:nf},(_,j)=>j).filter(j=>scale(j)!==1),changedSet=new Set(changed);
assert.equal(changed.length,410);
const pins={...basePins,[fileURLToPath(import.meta.url)]:sha(fileURLToPath(import.meta.url))};
verify(pins);
const sourcePrepared=read(source+'/prepared.json');
mergePins(pins,sourcePrepared.protectedInputSha256);
for(const[p,h]of Object.entries(sourcePrepared.outputHashes))pins[source+'/'+p]=h;
verify(pins);
const originalProvenance=read(source+'/composite-provenance.json');
const originalPoses=read(source+'/blender/delivered-camera-poses.json');
const originalAnchors=read(source+'/blender/desk/anchors.json');
assert.equal(originalProvenance.records.length,nf);assert.equal(originalPoses.poses.length,nf);
const anchorNames=Object.keys(originalAnchors.anchors).sort();
function loadReport(file){
 file=path.resolve(file);pins[file]=sha(file);
 const r=read(file);
 assert(['probe','render'].includes(r.mode)&&r.allGuardedStatesPass&&r.all10700SemanticPhysicalChecked);
 assert(!r.error&&!r.cleanupError&&r.restorationOffenders.length===0);
 assert(Object.keys(r.protectionChecks).length>=22&&Object.values(r.protectionChecks).every(v=>v===true));
 assert.equal(r.baseFullEvaluationSha256,basePins[baseEvaluation]);
 assert.equal(r.plannedActualSources,262);assert.deepEqual(r.changedOutputFrames,changed);
 assert.equal(r.onlyFocalLengthDerivative,true);assert.equal(r.objectStateVoiceCaptionsAndFocusUnchanged,true);
 assert.equal(r.pixelVisibilityOrOcclusionProofClaimed,false);
 assert.equal(r.actualRenderCount,r.mode==='render'?262:4);
 assert.equal(r.actualImages.length,r.actualRenderCount);
 mergePins(pins,r.protectedInputSha256);verify(pins);
 assert(Object.values(r.protectedInputSha256).includes(r.helperSha256),'Actual executed helper must be a protected input');
 const images=new Map(r.actualImages.map(x=>[x.frame,x])),physical=new Map(r.physical.map(x=>[x.recipeKey,x]));
 assert.equal(images.size,r.actualImages.length);
 const anchorPath=path.dirname(file)+'/anchor-projections.json',anchors=read(anchorPath);pins[anchorPath]=sha(anchorPath);
 for(const im of images.values()){
  assert.equal(path.resolve(im.path),path.dirname(file)+'/raw/'+jpg(im.frame));
  assert(!fs.lstatSync(im.path).isSymbolicLink()&&fs.statSync(im.path).size>1000);
  assert.equal(sha(im.path),im.sha256);pins[im.path]=im.sha256;
  const p=physical.get(im.recipeKey);assert(p&&p.frame===im.frame);
  assert.deepEqual(anchors[im.frame],p.anchorProjections);
  assert.deepEqual(Object.keys(p.anchorProjections).sort(),anchorNames);
  for(const point of Object.values(p.anchorProjections))assert(Array.isArray(point)&&point.length===3&&point.every(Number.isFinite)&&[0,1].includes(point[2]));
 }
 if(r.mode==='probe')assert.deepEqual(sortedNumbers(images.keys()),[3251,4825,4932,8953]);
 else{
  assert.deepEqual(sortedNumbers(Object.keys(r.replacementFrameToActualPatchFrame).map(Number)),changed);
  assert.deepEqual(sortedNumbers(new Set(Object.values(r.replacementFrameToActualPatchFrame))),sortedNumbers(images.keys()));
 }
 return {r,images,physical,file};
}
function manifest(bundle,out){
 const {r,images,physical,file}=bundle;
 const frames=(r.mode==='render'?changed:sortedNumbers(images.keys())).map(j=>{
  const actual=r.mode==='render'?r.replacementFrameToActualPatchFrame[j]:j;
  const im=images.get(actual),p=physical.get(im.recipeKey);assert(im&&p);
  return{frame:j,raw:im.path,rawSha256:im.sha256,actualSourceFrame:actual,anchorProjections:p.anchorProjections};
 });
 return{episode:'B-1',sourceCache:source,mode:r.mode,renderReport:file,renderReportSha256:sha(file),
  actualSources:images.size,changedOutputs:frames.length,frames,sourceInputs:pins,
  onlyLensChanged:true,voiceAndCaptionsChanged:false,originalNGPreserved:true,manifestOutput:out};
}
function stats(rows){
 const widths=rows.map(x=>x.primary.widthRatio).sort((a,b)=>a-b);assert(widths.every(Number.isFinite));
 const median=widths.length?(widths[Math.floor((widths.length-1)/2)]+widths[Math.floor(widths.length/2)])/2:null;
 const small=widths.filter(x=>x<.35).length;
 return{count:rows.length,median,smallBelow35:small,smallRatio:rows.length?small/rows.length:null,
  minimum:widths.at(0)??null,maximum:widths.at(-1)??null,
  projected7bPass:rows.length?median>=.6&&small/rows.length<=.2:null};
}
function supplemental(r){
 assert.equal(r.all10700SemanticPhysical.length,nf);
 const face=read(faceFile),native=new Array(nf);
 for(const run of face.runs)for(let j=run.firstFrame;j<=run.lastFrame;j++){assert(!native[j]);native[j]=run;}
 const byFace={},failures=[];
 for(let j=0;j<nf;j++){
  const x=r.all10700SemanticPhysical[j],p=x.primary,b=p.box;
  assert.equal(x.frame,j);assert.equal(x.faceKind,native[j].kind);assert.equal(x.faceOpacity,native[j].svgOpacity);
  assert.equal(x.eligible3D,x.faceKind!=='full_face_opaque');
  assert(Array.isArray(b)&&b.length===4&&b.every(Number.isFinite)&&b[0]<b[2]&&b[1]<b[3]);
  const width=(b[2]-b[0])/1080;assert(Math.abs(width-p.widthRatio)<=1e-12);
  const widthPass=width>=.4&&width<=.7,full=b[0]>=0&&b[2]<=1080&&b[1]>=0&&b[3]<=1920,
   safe=b[0]>=40&&b[2]<=1040&&b[1]>=110&&b[3]<=1600,present=p.presentInRenderState===true&&p.allVerticesInFrontCamera===true&&p.evaluatedVertices>0;
  assert.equal(p.within40to70,widthPass);assert.equal(p.insideFullFrame,full);assert.equal(p.insideInstructionSafeFrame,safe);
  assert(/^[a-f0-9]{64}$/.test(p.geometrySha256));
  if(!widthPass||!full||!safe||!present)failures.push({frame:j,faceKind:x.faceKind,width,widthPass,full,safe,present});
  (byFace[x.faceKind]??=[]).push(x);
 }
 const all=r.all10700SemanticPhysical,eligible=all.filter(x=>x.eligible3D),half=all.filter(x=>x.frame%15===0),halfEligible=half.filter(x=>x.eligible3D);
 assert.equal(half.length,714);assert.equal(eligible.length,9976);assert.equal(byFace.full_face_opaque.length,724);
 assert.equal(failures.length,0,'All raw geometries now satisfy limits; opaque face remains separately classified, not waived');
 assert(stats(half).projected7bPass&&stats(halfEligible).projected7bPass);
 return{episode:'B-1',all10700:stats(all),actual3DEligible9976:stats(eligible),originalHalfSecond714:stats(half),
  eligibleHalfSecond666:stats(halfEligible),byFaceClass:Object.fromEntries(Object.entries(byFace).map(([k,v])=>[k,stats(v)])),
  exact40to70BoundsAndRenderPresenceFailures:failures,nativeFacePlan:faceFile,nativeFacePlanSha256:sha(faceFile),
  geometryMeasure:'Actual evaluated source-state vertices; powder actual particles/arrows, not central stone or transparent-board corners',
  presenceIsRenderEnablementAndFrontCameraProjectionNotPixelOcclusion:true,pixelOcclusionClaimed:false,
  originalInspectorChanged:false,originalSourceNG:read(source+'/validation-final-v1/quality-gate.json').results.filter(x=>x.status==='NG'),
  originalNGPreserved:true,finalVisualReviewRequired:true,earListeningPerformed:false,finalAcceptance:false};
}
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
function mediaProof(mp4){
 assert(fs.statSync(mp4).isFile()&&fs.statSync(mp4).size>1e6);
 const decoded=spawnSync(ff,['-hide_banner','-loglevel','info','-i',mp4,'-map','0:v:0','-an','-vf','showinfo','-fps_mode','passthrough','-f','null','-'],{encoding:'utf8',maxBuffer:64*1024*1024});
 assert.equal(decoded.status,0,decoded.stderr?.slice(-3000));
 const config=[...decoded.stderr.matchAll(/config in time_base:\s*(\d+)\/(\d+), frame_rate:\s*(\d+)\/(\d+)/g)];assert(config.length);
 const [tbN,tbD,rateN,rateD]=config[0].slice(1).map(BigInt);assert.equal(rateN,30n*rateD);
 const rows=[...decoded.stderr.matchAll(/n:\s*(\d+)\s+pts:\s*(-?\d+)\s+pts_time:[^\n]*?\bs:(\d+)x(\d+)/g)];
 assert.equal(rows.length,nf,'No duplicated/dropped terminal frame or rate conversion accepted');
 for(let j=0;j<nf;j++){const x=rows[j];assert.equal(Number(x[1]),j);assert.equal(BigInt(x[2])*tbN*30n,BigInt(j)*tbD);assert.equal(Number(x[3]),1080);assert.equal(Number(x[4]),1920);}
 const originalExport=read(source+'/export.json'),original=originalExport.video;
 assert.equal(sha(original),originalExport.sha256);pins[source+'/export.json']=sha(source+'/export.json');
 const aac=p=>{const a=spawnSync(ff,['-v','error','-i',p,'-map','0:a:0','-c:a','copy','-f','adts','pipe:1'],{maxBuffer:32*1024*1024});assert.equal(a.status,0,String(a.stderr));assert(a.stdout.length>1000);return{bytes:a.stdout.length,sha256:digest(a.stdout)};};
 const oldAudio=aac(original),newAudio=aac(mp4);assert.deepEqual(newAudio,oldAudio,'AAC stream copy must remain exact');
 return{mp4,mp4Sha256:sha(mp4),decodedFrames:nf,nativeFPS:30,exactIntegerPTSAtNative30:true,width:1080,height:1920,
  sourceMP4:original,sourceMP4Sha256:sha(original),aacADTSStreamCopy:oldAudio,audioBitstreamIdentical:true,earListeningPerformed:false};
}
const [action,...args]=process.argv.slice(2);
if(action==='manifest'){
 const [file,outArg]=args;assert(file&&outArg&&args.length===2);
 const out=allowed(outArg);assert(!exists(out));
 const bundle=loadReport(file),data=manifest(bundle,out);verify(pins);write(out,data);verify(pins);
 console.log(JSON.stringify({manifest:out,mode:bundle.r.mode,actualSources:data.actualSources,outputs:data.frames.length,sha256:sha(out)}));
}else if(action==='finalize'){
 const [cacheArg,file,mp4Arg]=args;assert(cacheArg&&file&&mp4Arg&&args.length===3);
 const cache=allowed(cacheArg),mp4=path.resolve(mp4Arg);assert(fs.statSync(cache).isDirectory()&&!fs.lstatSync(cache).isSymbolicLink());
 const {r,images,physical}=loadReport(file);assert.equal(r.mode,'render');
 const composition=read(cache+'/composition-receipt.json');pins[cache+'/composition-receipt.json']=sha(cache+'/composition-receipt.json');
 assert.equal(composition.episode,'B-1');assert.equal(composition.sourceCache,source);assert.equal(composition.frames.length,410);
 assert.deepEqual(sortedNumbers(composition.frames.map(x=>x.frame)),changed);
 verify(composition.protectedInputs);mergePins(pins,composition.protectedInputs);
 for(const row of composition.frames){assert.equal(sha(row.png),row.sha256);pins[row.png]=row.sha256;}
 const expectedManifest=manifest({r,images,physical,file:path.resolve(file)},null);
 const anchors=read(cache+'/blender/desk/anchors.json');assert.deepEqual(Object.keys(anchors.anchors).sort(),anchorNames);
 assert(anchorNames.every(n=>anchors.anchors[n].length===nf&&originalAnchors.anchors[n].length===nf));
 for(const j of changed)for(const n of anchorNames)assert.deepEqual(anchors.anchors[n][j],expectedManifest.frames.find(x=>x.frame===j).anchorProjections[n]);
 for(let j=0;j<nf;j++)if(!changedSet.has(j))for(const n of anchorNames)assert.deepEqual(anchors.anchors[n][j],originalAnchors.anchors[n][j]);
 const supplement=supplemental(r),video=mediaProof(mp4);
 pins[mp4]=video.mp4Sha256;pins[video.sourceMP4]=video.sourceMP4Sha256;
 const newNames=['composite-provenance.json','final-held-dimensions.json','blender/delivered-camera-poses.json','blender/camera-motion.json','blender/desk/meta.json','supplemental-projected-primary.json','complete-cache-receipt.json','prepared.json','export.json'];
 for(const name of newNames)assert(!exists(cache+'/'+name),'Preserve prior/partial finalize output: '+name);
 const records=structuredClone(originalProvenance.records),poses=structuredClone(originalPoses),memo=new Map();
 const fileHash=p=>{const real=fs.realpathSync(p);if(!memo.has(real))memo.set(real,sha(real));return memo.get(real);};
 for(let j=0;j<nf;j++){
  const old=originalProvenance.records[j];assert.equal(old.frame,j);assert.equal(fs.realpathSync(source+'/blender/desk/'+jpg(j)),fs.realpathSync(old.source));assert.equal(fileHash(old.source),old.sha256);pins[fs.realpathSync(old.source)]=old.sha256;
  const dest=cache+'/blender/desk/'+jpg(j);
  if(changedSet.has(j)){
   const actual=r.replacementFrameToActualPatchFrame[j],im=images.get(actual),p=physical.get(im.recipeKey);
   assert.equal(fs.realpathSync(dest),fs.realpathSync(im.path));assert.equal(fileHash(dest),im.sha256);
   assert(posesEqual(p.pose.slice(0,6),poses.poses[j].slice(0,6)));assert(Math.abs(p.pose[6]-poses.poses[j][6]*scale(j))<1e-12);
   poses.poses[j]=p.pose;
   records[j]={...old,source:im.path,sha256:im.sha256,kind:'actual-fixed-phase-focal-length-only-20261025',actualPatchFrame:actual,previousFinal5Record:old,
    otherObjectSourceFrameUnchanged:true,lensScale:scale(j),deliveredCameraPose:p.pose,semanticPhysicalReport:path.resolve(file),semanticPhysicalReportSha256:sha(file)};
  }else{assert(!exists(dest));link(source+'/blender/desk/'+jpg(j),dest);}
 }
 assert.equal(fs.readdirSync(cache+'/blender/desk').filter(x=>/^\d{5}\.jpg$/.test(x)).length,nf);
 const moving=poses.poses.map((p,j)=>j>0&&!posesEqual(p,poses.poses[j-1]));
 const motion={frames:nf,moving_frames:moving.filter(Boolean).length,moving_ratio:moving.filter(Boolean).length/nf,top_ratio:poses.poses.filter(p=>p[5]>=80).length/nf,
  method:'Exact final5 delivered poses plus three explicit focal-length phases; original1e-9 pose comparison',previousMotion:read(source+'/blender/camera-motion.json')};
 const oldDims=read(source+'/final-held-dimensions.json');assert.equal(oldDims.samples.length,759);
 const dims={id,frames:nf,fps,originalInspectorNGPreserved:true,originalGeometryFlagsNotReinterpreted:true,
  previousFinal5Report:{path:source+'/final-held-dimensions.json',sha256:sha(source+'/final-held-dimensions.json')},
  previousFinal5DiagnosticSummary:Object.fromEntries(Object.entries(oldDims).filter(([k])=>k!=='samples')),
  samples:oldDims.samples.map(old=>{
  const j=old.frame,p=r.all10700SemanticPhysical[j];return{frame:j,sampleTime:j/30,...p.primary,deliveredCameraPose:poses.poses[j],moving:moving[j],faceKind:p.faceKind,faceOpacity:p.faceOpacity,
   evaluatedGeometry:true,sourceEvaluatedStateIndex:p.sourceStateIndex,measurementSource:p.source,measurementReport:path.resolve(file),measurementReportSha256:sha(file),previousFinal5Measurement:old};
 })};
 for(const name of [id+'.voice.wav',id+'.wav',id+'.mix.json','blender/desk/original-meta.json'])if(exists(source+'/'+name))link(source+'/'+name,cache+'/'+name);
 if(exists(source+'/problem')){assert(!exists(cache+'/problem'));fs.mkdirSync(cache+'/problem');for(const name of fs.readdirSync(source+'/problem'))link(source+'/problem/'+name,cache+'/problem/'+name);}
 write(cache+'/composite-provenance.json',{...originalProvenance,cache,sourceCache:source,records,frames:nf,fps,newActualSources:262,replacedOutputFrames:410,
  inputReports:{...originalProvenance.inputReports,semanticFixedOptics:{report:path.resolve(file),sha256:sha(file)}},originalInputsAndNGPreserved:true});
 write(cache+'/blender/delivered-camera-poses.json',poses);write(cache+'/blender/camera-motion.json',motion);write(cache+'/final-held-dimensions.json',dims);
 write(cache+'/blender/desk/meta.json',{...read(source+'/blender/desk/meta.json'),kind:'Final5 plus262 exact fixed-phase focal-length sources for410 outputs',frames:nf,fps,sourceMetaSha256:sha(source+'/blender/desk/meta.json'),originalPlannerNotRecertified:true});
 write(cache+'/supplemental-projected-primary.json',{...supplement,renderReport:path.resolve(file),renderReportSha256:sha(file),video});
 if(!exists(cache+'/out'))fs.mkdirSync(cache+'/out');
 const target=cache+'/out/'+id+'.mp4';if(exists(target))assert.equal(fs.realpathSync(target),fs.realpathSync(mp4));else link(mp4,target);
 verify(pins);
 const receipt={source,cache,frames:nf,fps,newActualSources:262,replacedOutputFrames:410,retainedOriginalOutputs:nf-410,renderReport:path.resolve(file),renderReportSha256:sha(file),compositionSha256:sha(cache+'/composition-receipt.json'),video,
  all10700ActualSourceMappingsVerified:true,originalInputsAndNGPreserved:true,audioCopiedUnchanged:true,originalCaptionsAndVoiceUnchanged:true,earListeningPerformed:false,finalPassed:false};
 write(cache+'/complete-cache-receipt.json',receipt);
 write(cache+'/export.json',{id,video:target,sha256:video.mp4Sha256,frames:nf,fps,encoder:'Root native30 complete-frame patches, original AAC stream copy',originalJapaneseCaptionsAndVoiceUnchanged:true,originalGateNGPreserved:true,earListeningPerformed:false,finalPassed:false});
 const outputs=newNames.filter(x=>x!=='prepared.json').concat(['blender/desk/anchors.json','composition-receipt.json']);
 write(cache+'/prepared.json',{id,cache,source,frames:nf,fps,encoded:true,finalPassed:false,protectedInputSha256:pins,outputHashes:Object.fromEntries(outputs.map(n=>[n,sha(cache+'/'+n)])),newActualSources:262,replacedOutputFrames:410,all10700ActualSourceMappingsVerified:true,originalInputsAndNGPreserved:true,earListeningPerformed:false});
 verify(pins);console.log(JSON.stringify({cache,frames:nf,newActualSources:262,replaced:410,supplement:cache+'/supplemental-projected-primary.json',native30:video.exactIntegerPTSAtNative30,audioBitstreamIdentical:true,finalPassed:false}));
}else throw Error('Usage: manifest REPORT NEW_MANIFEST | finalize NEW_COMPOSITION_CACHE RENDER_REPORT FINAL_MP4');
