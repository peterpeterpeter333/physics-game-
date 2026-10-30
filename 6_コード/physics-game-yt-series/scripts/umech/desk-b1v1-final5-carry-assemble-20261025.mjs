// Root-only new B5 cache: exact B4 delivery plus sixteen approved B7 sources.
// No Blender, original source/checker, caption, voice, camera or rock edits.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {createHash}from'node:crypto';import {spawnSync}from'node:child_process';import{fileURLToPath}from'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));process.chdir(W);
const args=process.argv.slice(2),option=n=>args.find(a=>a.startsWith(n+'='))?.slice(n.length+1);
assert(args.includes('--authorized'));const prepare=args.includes('--prepare'),encode=args.includes('--encode');assert(prepare!==encode);
const base='/private/tmp/ys/ys-chain-b1v1-final4-owned-resume-v2-20261025',cache='/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025',id='ys-chain-b1v1',nf=10700,fps=30;
const patchFrames=Array.from({length:16},(_,i)=>4125+i),contexts=[4124,4141],allFrames=[...patchFrames,...contexts].sort((a,b)=>a-b);
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,1)+'\n',{flag:'wx'}),jpg=j=>String(j).padStart(5,'0')+'.jpg';
const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
const verify=pins=>{for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);};
const link=(a,b)=>{assert(fs.statSync(a).isFile()&&!exists(b));fs.symlinkSync(path.resolve(a),b);};
const inv=dir=>Object.fromEntries(fs.readdirSync(dir).filter(n=>/^\d{5}\.jpg$/.test(n)).sort().map(n=>{const p=dir+'/'+n,s=fs.statSync(p,{bigint:true});return[n,[s.size.toString(),s.mtimeNs.toString(),fs.realpathSync(p)]];}));
const finite=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite),sameBox=(a,b)=>a.length===4&&b.length===4&&a.every((v,i)=>Math.abs(v-b[i])<=1e-6);
const pins={
 [base+'/prepared.json']:'5154535d572e6ab4b100fc7fcd730723b965c9569e7e47370a9251f64e878b3a',
 [base+'/composite-provenance.json']:'685711993fb83cc22f55e22ae3d81a359ce9c58aea4a8efd38c82caf9629460d',
 [base+'/final-held-dimensions.json']:'a9e88016d9b07e94321db9a256a43e2d0d1140ff9654f87819b3278af70f25a5',
 [base+'/blender/delivered-camera-poses.json']:'aa4106563b81e8afc8d33c4eb1d19d58ace2e0b706330409bb48ed1a070d883f',
 [base+'/blender/desk/anchors.json']:'352637a5e790ac026d7d4a0f1d54c8c84833d45ee1832566b4ebc453715f5355',
 [W+'scripts/umech/desk-b1v1-final-b6-v6-owned-resume-v2-assemble-20261025.mjs']:'2979b4ccfb0486653f348c744619c654da07b5dcc6052d4ba6994f0dea355270',
 [W+'scripts/umech/desk-b1v1-final3-render-entry.mjs']:'08d4bd1f48bba23f385e444cece07edf1cded4e20a54f7f98a8bcf4bad8437f7',
 [W+'scripts/umech/desk-b1v1-final3-frame.mjs']:'31dc965f1d6b6273f3ee97e8875e4134832109e2b4278b37151a95a8223859cb',
};
// The exact encoder-entry pin above is checked before any preparation/encode.
const addPin=(p,h)=>{p=path.resolve(p);assert(/^[a-f0-9]{64}$/.test(h));if(Object.hasOwn(pins,p))assert.equal(pins[p],h);pins[p]=h;};
const desk=cache+'/blender/desk',out=cache+'/out';
verify(pins);
if(prepare){
 assert(!exists(cache),'Every prior candidate and partial final5 is preserved');
 assert(!fs.lstatSync(path.dirname(cache)).isSymbolicLink());
 const helper=option('--b7-helper'),hp=option('--b7-helper-sha256'),report=option('--b7-report'),rp=option('--b7-report-sha256'),eyeFile=option('--root-approval'),ep=option('--root-approval-sha256');
 assert(helper&&report&&eyeFile);for(const[p,h]of[[helper,hp],[report,rp],[eyeFile,ep]]){assert(/^[a-f0-9]{64}$/.test(h??''));assert.equal(sha(p),h);addPin(p,h);}
 const b=read(base+'/prepared.json'),v=read(base+'/composite-provenance.json'),p=read(report),eye=read(eyeFile);
 assert(b.frames===nf&&b.fps===fps&&b.cache===base&&b.finalPassed===false&&v.records.length===nf);
 verify(b.protectedInputSha256);for(const[n,h]of Object.entries(b.outputHashes)){assert.equal(sha(base+'/'+n),h);addPin(base+'/'+n,h);}
 for(const[f,h]of Object.entries(b.protectedInputSha256))addPin(f,h);
 assert.equal(p.mode,'probe');assert.equal(p.helperSha256,hp);assert.equal(p.baseCache,base);
 assert.equal(p.basePreparedSha256,pins[base+'/prepared.json']);assert.equal(p.baseProvenanceSha256,pins[base+'/composite-provenance.json']);assert.equal(p.baseCameraPosesSha256,pins[base+'/blender/delivered-camera-poses.json']);
 assert(p.allGuardedStatesPass&&p.allPatchFramesActuallyRendered&&p.cameraPosesUnchanged&&p.cueTimesAndStartsUnchanged&&p.newActionsEvaluateOutputTime&&!p.error&&!p.cleanupError);
 assert.equal(p.fullFilmFrames,nf);assert.equal(p.fps,fps);assert.equal(p.actualSources,16);assert.equal(p.replacementOutputs,16);assert.equal(p.actualPatchRenders,16);assert.equal(p.actualContextRenders,2);assert.equal(p.actualGuardedStates,18);
 assert.deepEqual(p.contextOnlyFrames,contexts);assert.deepEqual(p.changedChannelsOnly,['sixthNeedle.location.z','kaiHand transform and visibility during approved withdrawal']);
 assert.equal(p.vaneTouched,false);assert(p.allOriginalGateNGPreserved&&p.automaticGateExemption===false&&p.finalAcceptance===false);
 assert(p.protectionChecks&&Object.keys(p.protectionChecks).length>0&&Object.values(p.protectionChecks).every(x=>x===true));assert.deepEqual(p.restorationOffenders,[]);
 verify(p.protectedInputSha256);for(const[f,h]of Object.entries(p.protectedInputSha256))addPin(f,h);
 const images=new Map(p.actualImages.map(r=>[r.frame,r])),physical=new Map(p.physical.map(r=>[r.frame,r]));
 assert.equal(images.size,18);assert.equal(p.actualImages.length,18);assert.equal(physical.size,18);assert.equal(p.physical.length,18);assert.deepEqual([...images.keys()].sort((a,b)=>a-b),allFrames);
 assert.deepEqual(p.replacementFrameToActualPatchFrame,Object.fromEntries(patchFrames.map(j=>[j,j])));
 assert.deepEqual(p.patchFrameToUnchangedOtherObjectSourceFrame,p.patchFrameToUnchangedObjectSourceFrame);
 const originalAnchors=read(base+'/blender/desk/anchors.json'),names=Object.keys(originalAnchors.anchors).sort(),poses=read(base+'/blender/delivered-camera-poses.json').poses;
 assert.equal(poses.length,nf);
 for(const j of allFrames){
  const im=images.get(j),ph=physical.get(j),file=path.resolve(p.raw,jpg(j)),old=v.records[j];assert(im&&ph&&ph.pass&&ph.allNonAuthorizedObjectChannelsUnchanged&&ph.allVerticesEvaluated);
  assert.equal(path.resolve(im.path),file);assert(!fs.lstatSync(file).isSymbolicLink()&&fs.statSync(file).size>1000);assert.equal(sha(file),im.sha256);addPin(file,im.sha256);
  assert.equal(im.contextOnly,contexts.includes(j));assert.equal(ph.contextOnly,contexts.includes(j));assert.equal(ph.unchangedOtherObjectSourceFrame,old.originalObjectSourceFrame);assert.deepEqual(ph.pose,poses[j]);
  const change=ph.explicitChanges;assert(change.principalRockWorldGeometryUnchanged);assert(/^[a-f0-9]{64}$/.test(change.principalRockBaselineWorldVerticesSha256));assert.equal(change.principalRockBaselineWorldVerticesSha256,change.principalRockActualWorldVerticesSha256);
  assert(ph.widthRatio>=.4&&ph.widthRatio<=.7&&ph.box[0]>=40&&ph.box[2]<=1040&&ph.box[1]>=110&&ph.box[3]<=1600);
  assert(Math.abs((ph.box[2]-ph.box[0])/1080-ph.widthRatio)<1e-9);
  const needle=ph.sixthNeedleBox;assert(needle&&needle[0]>=0&&needle[2]<=1080&&needle[1]>=110&&needle[3]<=1600);
  assert.deepEqual(Object.keys(p.anchorProjectionsByActualFrame[j]).sort(),names);assert(Object.values(p.anchorProjectionsByActualFrame[j]).every(finite));
  if(patchFrames.includes(j)){assert.equal(p.patchFrameToUnchangedOtherObjectSourceFrame[j],old.originalObjectSourceFrame);assert.equal(ph.operationTime,j/fps);assert.equal(old.actualPatchFrame,null);}
 }
 assert(eye.approved===true&&eye.helperSha256===hp&&eye.probeReportSha256===rp&&eye.allRequiredProbeImagesPersonallyViewed===true);
 const actualViewer=eye.actualViewer??eye.reviewer;assert(typeof actualViewer==='string'&&actualViewer.trim().length>0&&eye.viewedImageCount===18,'Require the attributed actual18-image viewer, not an unscoped approval boolean');
 const reviewed=eye.reviewedImageSha256;assert.deepEqual(reviewed,Object.fromEntries(p.actualImages.map(im=>[im.path,im.sha256])),'Root approval must cover all16 delivery and2 context actual JPEGs');
 const contextReviewed=contexts.filter(j=>Object.hasOwn(reviewed,images.get(j).path));
 const inventories={...v.fullRawProtection,[base+'/blender/desk']:inv(base+'/blender/desk'),[p.raw]:inv(p.raw)};
 for(const[dir,a]of Object.entries(v.fullRawProtection))assert.deepEqual(inv(dir),a);
 const memo=new Map(),hashFile=file=>{const real=fs.realpathSync(file);if(!memo.has(real))memo.set(real,sha(real));return memo.get(real);};
 const anchors=structuredClone(originalAnchors),records=v.records.map(r=>structuredClone(r));
 assert(names.every(n=>anchors.anchors[n].length===nf));
 for(let j=0;j<nf;j++){
  const r=v.records[j];assert.equal(r.frame,j);assert.equal(fs.realpathSync(base+'/blender/desk/'+jpg(j)),fs.realpathSync(r.source));assert.equal(hashFile(r.source),r.sha256);
  if(!patchFrames.includes(j))continue;
  const im=images.get(j),ph=physical.get(j);records[j]={...r,source:im.path,sha256:im.sha256,kind:'actual-B7-sixth-needle-and-kai-hand-carry-only',actualPatchFrame:j,
   originalPhysicalStateExplicitlyCorrected:true,newActionsEvaluatedAtOutputTime:true,previousB4Record:r,
   B7ExplicitChangedChannels:p.changedChannelsOnly,B7OriginalOtherObjectReference:r.originalObjectSourceFrame,B7OperationTime:j/fps,B7PrincipalRockWorldVerticesSha256:ph.explicitChanges.principalRockActualWorldVerticesSha256};
  for(const n of names)anchors.anchors[n][j]=p.anchorProjectionsByActualFrame[j][n];
 }
 for(let j=0;j<nf;j++)if(!patchFrames.includes(j)){assert.deepEqual(records[j],v.records[j]);for(const n of names)assert.deepEqual(anchors.anchors[n][j],originalAnchors.anchors[n][j]);}
 const dims=structuredClone(read(base+'/final-held-dimensions.json'));assert.equal(dims.samples.length,759);assert.equal(dims.samples.filter(s=>Number.isInteger(s.sampleTime*2)).length,714);
 let changedSamples=0;
 for(const s of dims.samples){assert.equal(s.frame,Math.round(s.sampleTime*fps));if(!patchFrames.includes(s.frame))continue;
  const ph=physical.get(s.frame);assert.equal(s.principal,'terrella');assert(sameBox(s.box,ph.box)&&Math.abs(s.widthRatio-ph.widthRatio)<=1e-9);assert.deepEqual(s.deliveredCameraPose,ph.pose);
  const previous=structuredClone(s);Object.assign(s,{previousB4Measurement:previous,actualPatchedFrame:s.frame,
   measurementSource:'Preserved B4 rock measurement; B7 only changes sixth needle and hand, proven by identical evaluated rock world-vertex bytes',
   B7RawSource:images.get(s.frame).path,B7RawSha256:images.get(s.frame).sha256,B7ReportSha256:rp,
   B7PrincipalRockWorldVerticesSha256:ph.explicitChanges.principalRockActualWorldVerticesSha256,
   originalNumericMeasurementPreserved:true,measurementRecomputed:false,physicalHandNeedleDerivativeExplicit:true});changedSamples++;
 }
 assert.equal(changedSamples,2);dims.measurementsOutside40to70Retained=dims.samples.filter(s=>!s.within40to70);dims.clipsRetained=dims.samples.filter(s=>s.clipped);
 dims.B7PreservedRockMeasurementEvidence={report:path.resolve(report),reportSha256:rp,affectedSampleFrames:[4125,4140],all759NumericPrincipalMeasurementsPreserved:true,newRawSourceProvenanceExplicit:true};
 dims.automaticGate7or7bWaived=false;dims.originalNGMustBeRetained=true;dims.actualMp4EyeReviewPending=true;
 for(const f of ['plan.json',id+'.json','phrase-times.json',id+'.voice.wav',id+'.wav','blender/data.json','blender/desk/meta.json','blender/desk/original-meta.json','blender/camera-motion.json',...['problem.json','挑戦.png','答え.png'].map(n=>'problem/'+n)])addPin(base+'/'+f,sha(base+'/'+f));
 for(const f of ['export.json'])if(exists(base+'/'+f)){addPin(base+'/'+f,sha(base+'/'+f));const e=read(base+'/'+f);if(e.video)addPin(e.video,e.sha256);}
 addPin(fileURLToPath(import.meta.url),sha(fileURLToPath(import.meta.url)));verify(pins);
 fs.mkdirSync(desk,{recursive:true});fs.mkdirSync(out);fs.mkdirSync(cache+'/problem');
 for(const f of ['plan.json',id+'.json','phrase-times.json',id+'.voice.wav',id+'.wav','blender/data.json','blender/delivered-camera-poses.json','blender/camera-motion.json','blender/desk/original-meta.json'])link(base+'/'+f,cache+'/'+f);
 for(const r of records)link(r.source,desk+'/'+jpg(r.frame));write(desk+'/anchors.json',anchors);write(desk+'/meta.json',{...read(base+'/blender/desk/meta.json'),kind:'B4 unchanged delivery plus exactly16 actual B7 hand/needle carry frames',previousMetaSha256:sha(base+'/blender/desk/meta.json'),originalPlannerNotRecertified:true});
 for(const n of ['problem.json','挑戦.png','答え.png'])link(base+'/problem/'+n,cache+'/problem/'+n);write(cache+'/final-held-dimensions.json',dims);
 const owner={id,cache,base,candidate:'B4 owned-resume-v2 plus exactly16 root-approved B7 sixth-needle/blue-hand carry frames',frames:nf,fps,encoded:false,finalPassed:false,
  addedActualSources:b.addedActualSources+16,replacedOutputFrames:b.replacedOutputFrames+16,B7ActualSources:16,B7ReplacementOutputs:16,
  actualFinalGatesPending:true,actualFinalEyeReviewPending:true,earListeningPerformed:false,originalInputsAndNGPreserved:true};
 const inputReports={...b.inputReports,B7:{path:path.resolve(report),sha256:rp,helper:path.resolve(helper),helperSha256:hp,rootApproval:path.resolve(eyeFile),rootApprovalSha256:ep,deliveryFrames:patchFrames,contextFramesReviewed:contextReviewed,contextEyesNotClaimed:contexts.filter(j=>!contextReviewed.includes(j))}};
 write(cache+'/composite-provenance.json',{...v,...owner,records,inputReports,basePreparedSha256:pins[base+'/prepared.json'],baseProvenanceSha256:pins[base+'/composite-provenance.json'],fullRawProtection:inventories,
  actualPatchImageSha256:{...v.actualPatchImageSha256,...Object.fromEntries(patchFrames.map(j=>[images.get(j).path,images.get(j).sha256]))},
  B7Scope:'Only4125..4140 raw/anchors and their explicit hand/sixth-needle metadata differ. Rock/camera/voice/captions/other sources and numeric principal measurements preserved.'});
 const outputs=['composite-provenance.json','final-held-dimensions.json','blender/desk/anchors.json','blender/desk/meta.json','blender/delivered-camera-poses.json','blender/camera-motion.json','problem/problem.json','problem/挑戦.png','problem/答え.png'];
 write(cache+'/prepared.json',{...b,...owner,inputReports,protectedInputSha256:pins,outputHashes:Object.fromEntries(outputs.map(n=>[n,sha(cache+'/'+n)])),
  unchangedBaseOutputFrames:nf-16,newDeliveryActualFrames:patchFrames,all759NumericPrincipalMeasurementsPreserved:true,all10700ActualSourceMappingsVerified:true,
  rootEyeScope:{actualViewer,viewedImageCount:18,deliveryApproved16:true,contextsApproved2:true,contextFramesReviewed:contextReviewed,finalEncodedImagesStillPending:true},onlyB7HandNeedleTransformDerivative:true});
 verify(pins);for(const[dir,a]of Object.entries(inventories))assert.deepEqual(inv(dir),a);console.log(JSON.stringify({cache,prepared:true,newActual16:true,unchangedOutputs:nf-16,dimensions:759,encode:false,finalPassed:false}));
}else{
 const p=read(cache+'/prepared.json');assert.equal(p.cache,cache);assert.equal(p.encoded,false);verify(p.protectedInputSha256);for(const[n,h]of Object.entries(p.outputHashes))assert.equal(sha(cache+'/'+n),h);
 const v=read(cache+'/composite-provenance.json');assert.equal(v.records.length,nf);for(const[dir,a]of Object.entries(v.fullRawProtection))assert.deepEqual(inv(dir),a);
 assert(!exists(cache+'/export.json')&&!exists(out+'/'+id+'.mp4'));const sourceHashes=new Map();
 for(const r of v.records){assert.equal(fs.realpathSync(desk+'/'+jpg(r.frame)),fs.realpathSync(r.source));const real=fs.realpathSync(r.source);if(!sourceHashes.has(real))sourceHashes.set(real,sha(real));assert.equal(sourceHashes.get(real),r.sha256);}
 const started=Date.now(),r=spawnSync(process.execPath,['scripts/umech/desk-b1v1-final3-render-entry.mjs',id],{cwd:W,env:{...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,FILM_COPY_AUDIO:'0',FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'},stdio:'inherit'});
 assert.equal(r.status,0);verify(p.protectedInputSha256);for(const[dir,a]of Object.entries(v.fullRawProtection))assert.deepEqual(inv(dir),a);for(const[f,h]of sourceHashes)assert.equal(sha(f),h);
 const video=out+'/'+id+'.mp4';assert(fs.statSync(video).size>1e6);write(cache+'/export.json',{id,video,sha256:sha(video),frames:nf,seconds:(Date.now()-started)/1000,preparedSha256:sha(cache+'/prepared.json'),encoder:'Unmodified original CRF18 through exact B3 private frame hook',originalJapaneseCaptionsAndVoiceUnchanged:true,originalGateNGPreserved:true,actualFinalGatesPending:true,actualFinalEyeReviewPending:true,earListeningPerformed:false,finalPassed:false});console.log(video);
}
