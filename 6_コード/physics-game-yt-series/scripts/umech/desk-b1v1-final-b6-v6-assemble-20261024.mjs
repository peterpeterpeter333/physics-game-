// Root-authorized, add-only B3+B6 v6 assembly. This file never starts Blender.
// B4v4 / B5v4 are four-probe dependencies inside B6 v6, not separate full renders.
// The failed older helper/probe evidence and old assembler remain unmodified.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));
process.chdir(W);
assert(process.argv.includes('--authorized'),'Root authorization required');
const prepare=process.argv.includes('--prepare'),encode=process.argv.includes('--encode');
assert(prepare!==encode,'Choose exactly one of --prepare / --encode');
const option=n=>process.argv.find(a=>a.startsWith(n+'='))?.slice(n.length+1);
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,1)+'\n',{flag:'wx'});
const verify=hh=>{for(const[p,h]of Object.entries(hh))assert.equal(sha(p),h,p);};
const jpg=j=>String(j).padStart(5,'0')+'.jpg';
const link=(a,b)=>{assert(fs.statSync(a).isFile(),a);assert(!exists(b),b);fs.symlinkSync(path.resolve(a),b);};
const pose=p=>Array.isArray(p)&&p.length===7&&p.every(Number.isFinite);
const box=b=>Array.isArray(b)&&b.length===4&&b.every(Number.isFinite)&&b[0]<b[2]&&b[1]<b[3];
const clipped=b=>b[0]<0||b[1]<0||b[2]>1080||b[3]>1920;
const same=(a,b)=>pose(a)&&pose(b)&&a.every((v,i)=>Math.abs(v-b[i])<=1e-9);
const inventory=p=>Object.fromEntries(fs.readdirSync(p).filter(n=>/^\d{5}\.jpg$/.test(n)).sort().map(n=>{
 const s=fs.statSync(p+'/'+n,{bigint:true});return[n,[s.size.toString(),s.mtimeNs.toString(),fs.realpathSync(p+'/'+n)]];}));
const tmp='/private/tmp/ys',id='ys-chain-b1v1',nf=10700,fps=30;
const base=tmp+'/ys-chain-b1v1-final3-20261024',cache=tmp+'/ys-chain-b1v1-final4-20261024';
const patchBase=tmp+'/ys-chain-b1v1-integrated-b6-v6-20261024';
const helper=path.resolve('scripts/blender/desk_axes_b1_integrated_b6_v6_20261024.py');
const B6PIN='bbcd5af4926fbccde672c6601b11362d6f18a72619fc1fd1daa628e25c218e61';
const B6AUDIT=patchBase+'/audit/report.json',B6AUDITPIN='e8f4def138cb039f1d7bd3536ea22c527004343828d0318b65f3ab51eb99b8d0';
const B4PROBEPIN='5bae5a0335fbe6b14555560e386315764b58eba42e24d85e5bd08bdcc81d9c53';
const B5PROBEPIN='69f680bda23b6e30ca9a6272cd34009777683065aca4bc0661f342f1e8f460c5';
const desk=cache+'/blender/desk',out=cache+'/out';
const problem=W+'outputs/axes-20261023/delivery-metadata-20261024/B-1-problem';
const B3PIN='3956feb23129e64514852978fba184e9e3f416f627e5c1139b5f94a12ed19841';
const MIX=tmp+'/'+id+'/'+id+'.b5v3.mixed.wav';
const MIXPIN='15ff9a7d23a49e2d9eb4b536f3f1c666b2941d94e2ef232ed24960f7cd948501';
const SFX=tmp+'/'+id+'/b1-b5v3-sfx-provenance.json';
const keys=['open:box','open:mio','last:needle','garlic:side','garlic:rub','garlic:nail','garlic:mio','rule:first','rule:bar','rule:pull','lore:garlic','rule:north','terella:idea'].sort();
const principal=key=>{
 if(['open:box','open:mio','last:needle','rule:north'].includes(key))return['compass','Complete compass including the lid in its actual delivered closed/open pose; ship is separately guarded, not counted in principal width'];
 if(key==='lore:garlic')return['sailor','Sailor body/head/clothing alone; the explicitly shifted lore-garlic waiting endpoint is separately guarded and never included in principal width'];
 if(key.startsWith('garlic:'))return['bar-A','Complete bar A alone; Gilbert, waiting garlic and nails are separately guarded'];
 if(['rule:first','rule:bar','rule:pull'].includes(key))return['both-complete-bars','Both complete N/S bar magnets including pole labels; retiring garlic/nails and hands are excluded'];
 if(key==='terella:idea')return['evaluated-rock','Evaluated rough terrella rock alone; descent state is the explicit derivative'];
 throw Error('Unknown B6 named principal '+key);
};
assert.equal(path.dirname(cache),tmp);assert(!exists(cache)||!fs.lstatSync(cache).isSymbolicLink());
const protectedInventories=prior=>{
 const dirs=new Set([tmp+'/'+id+'/blender/desk',base+'/blender/desk']);
 for(const r of prior.records)dirs.add(path.dirname(fs.realpathSync(r.source)));
 return Object.fromEntries([...dirs].map(p=>[p,inventory(p)]));
};
if(prepare){
 assert(!exists(cache),'Preserve any prior final4 candidate and evidence');
 const hp=option('--b6-helper-sha256'),pp=option('--b6-probe-sha256');
 assert(/^[a-f0-9]{64}$/.test(hp??'')&&/^[a-f0-9]{64}$/.test(pp??''),'Explicit root-pinned B6 helper/probe SHA required');
 assert.equal(hp,B6PIN);assert.equal(sha(helper),B6PIN);assert.equal(sha(base+'/prepared.json'),B3PIN);
 assert.equal(sha(B6AUDIT),B6AUDITPIN);const audit=read(B6AUDIT);
 assert(audit.helperSha256===B6PIN&&audit.allGuardedStatesPass&&audit.allCandidateSelectionsRequireExactPerStateQuality);
 assert.equal(audit.actualSources,803);assert.equal(audit.replacementOutputs,2386);
 const bp=read(base+'/prepared.json'),prior=read(base+'/composite-provenance.json'),exp=read(base+'/export.json');
 assert.equal(bp.frames,nf);assert.equal(prior.records.length,nf);assert.equal(sha(exp.video),exp.sha256);
 verify(bp.protectedInputSha256);for(const[n,h]of Object.entries(bp.outputHashes))assert.equal(sha(base+'/'+n),h,n);
 const live=read(tmp+'/'+id+'-retained-plan-20261024.json');
 const diag=read(tmp+'/'+id+'-final3-live-plan-diagnosis-20261024.json');
 assert.equal(live.plans.length,nf);assert(live.exactRenderFramesMatchOriginalMeta);
 assert(diag.exactLivePlanMatchesAll10700ByteProvenRawReferences&&diag.all73PhysicalTimeExpressionsEqualHeldObjectSource);
 assert.equal(diag.originalPlannerPassClaimed,false);
 const counts={render:live.plans.filter(p=>p[0]==='render').length,dup:live.plans.filter(p=>p[0]==='dup').length};
 assert.deepEqual(counts,{render:3696,dup:7004});
 const sourceRef=j=>live.plans[j][0]==='render'?j:live.plans[j][1];
 const at=j=>live.CUES.findLast(c=>c.start<=j/fps)??live.CUES[0];
 const p=read(patchBase+'/render/report.json'),probe=read(patchBase+'/probe/report.json');
 assert.equal(p.mode,'render');assert.equal(p.helperSha256,hp);assert.equal(probe.helperSha256,hp);
 assert.equal(p.b3PreparedSha256,B3PIN);assert.equal(sha(patchBase+'/probe/report.json'),pp);
 assert.equal(p.approvedProbeReportSha256,pp);assert.equal(p.dependencyProbeVisualApproval,true);
 assert(p.allGuardedStatesPass&&p.allPatchFramesActuallyRendered&&p.allHeldDependenciesMapped);
 assert(p.newActionsEvaluateOutputTime&&p.B4FitAndB5V4PhasesRetained&&p.modelDerivativeExplicit&&p.voiceCaptionsCanonicalSourceUnchanged);
 assert(p.allCandidateSelectionsRequireExactPerStateQuality&&p.lorePlacementIsExplicitModelTransformDerivative&&p.noOtherFixedSiteExceptionAdded);
 assert(p.loreGarlicInitialPlacement.strictSameDefinitionAsApprovedB4Probe&&p.loreGarlicInitialPlacement.helperSha256==='d0a04b5b7a933e609a6a26b869d16decd0ff0bf6e493a4384e7bc918d8a28dc2');
 assert.equal(p.loreGarlicInitialPlacement.function,'apply_lore_garlic_initial');
 assert.deepEqual(p.loreGarlicInitialPlacement.oldInitial,[0,-.12,.018]);assert.deepEqual(p.loreGarlicInitialPlacement.newInitial,[.035,-.047,.018]);
 assert.equal(p.actualSources,803);assert.equal(p.replacementOutputs,2386);
 assert.deepEqual(p.physical,audit.physical);assert.deepEqual(p.replacementFrameToActualPatchFrame,audit.replacementFrameToActualPatchFrame);
 assert(p.originalGateNGPreserved&&p.originalInspectorModified===false&&p.finalAcceptance===false);
 assert(Object.values(p.protectionChecks).every(v=>v===true));verify(p.protectedInputSha256);
 assert(probe.allGuardedStatesPass&&probe.dependencyProbeVisualApproval&&probe.actualImages.length===20&&probe.allCandidateSelectionsRequireExactPerStateQuality);
 assert.deepEqual(probe.physical,p.physical);assert.deepEqual(probe.replacementFrameToActualPatchFrame,p.replacementFrameToActualPatchFrame);
 const deps=[['B4v4',tmp+'/'+id+'-camera-size-b4-v4-20261024/probe/report.json',B4PROBEPIN,4,
  W+'scripts/blender/desk_axes_b1_camera_size_b4_v4_20261024.py','d0a04b5b7a933e609a6a26b869d16decd0ff0bf6e493a4384e7bc918d8a28dc2'],
  ['B5v4',tmp+'/'+id+'-repel-b5-v4-20261024/probe/report.json',B5PROBEPIN,4,
  W+'scripts/blender/desk_axes_b1_repel_b5_v4_20261024.py','02c64b5916c754b08b67c5a46330d11a0ca58323ca2f67844a70d4175a9b65d3']];
 assert.equal(p.b4ProbeSha256,B4PROBEPIN);assert.equal(p.b5ProbeSha256,B5PROBEPIN);
 for(const[name,file,pin,n,depHelper,depPin]of deps){assert.equal(sha(file),pin,name);const pr=read(file);assert.equal(sha(depHelper),depPin,name+' source');assert.equal(pr.helperSha256,depPin);
  assert(pr.allGuardedStatesPass&&pr.actualImages.length===n);assert(Object.values(pr.protectionChecks).every(v=>v===true));
  for(const im of pr.actualImages)assert.equal(sha(im.path),im.sha256,im.path);}
 assert.equal(p.projectedBoundsAreNotActualOcclusionApproval,true);
 assert.equal(p.integratedMagneticWorldProof.length,4);
 const raw=path.resolve(patchBase+'/render/blender/patch');assert.equal(path.resolve(p.raw),raw);
 assert.equal(path.resolve(p.anchors),raw+'/anchors.json');
 const pa=read(p.anchors),anchors=structuredClone(read(base+'/blender/desk/anchors.json'));
 const names=Object.keys(anchors.anchors).sort();assert.deepEqual(Object.keys(pa.anchors).sort(),names);
 assert(names.every(n=>anchors.anchors[n].length===nf&&pa.anchors[n].length===nf));
 const poses=structuredClone(read(base+'/blender/delivered-camera-poses.json').poses);assert.equal(poses.length,nf);assert(poses.every(pose));
 const physical=new Map(p.physical.map(r=>[r.frame,r])),selected=new Map(),actualHashes=new Map();
 assert.equal(physical.size,p.actualSources);assert.equal(p.actualImages.length,p.actualSources);
 assert.equal(Object.keys(p.patchFrameToUnchangedOtherObjectSourceFrame).length,p.actualSources);
 assert.deepEqual(p.patchFrameToUnchangedOtherObjectSourceFrame,p.patchFrameToUnchangedObjectSourceFrame);
 for(const im of p.actualImages){const file=raw+'/'+jpg(im.frame);assert.equal(path.resolve(im.path),file);
  assert(physical.has(im.frame)&&!fs.lstatSync(file).isSymbolicLink()&&fs.statSync(file).size>1000);
  assert.equal(sha(file),im.sha256);actualHashes.set(file,im.sha256);}
 for(const[js,ks]of Object.entries(p.replacementFrameToActualPatchFrame)){
  const j=Number(js),k=Number(ks),ref=p.patchFrameToUnchangedOtherObjectSourceFrame[k],ph=physical.get(k);
  assert(Number.isInteger(j)&&j>=0&&j<nf&&Number.isInteger(k)&&k>=0&&k<=j);
  assert(keys.includes(at(j).key)&&at(ref).key===at(j).key);assert.equal(ref,sourceRef(j));assert.equal(ref,sourceRef(k));
  assert(ph&&ph.pass&&ph.evaluatedGeometry&&pose(ph.pose)&&ph.cue===at(j).key);
  assert.equal(ph.unchangedOtherObjectSourceFrame,ref);assert.equal(ph.operationTime,k/fps);
  assert(box(ph.box)&&ph.widthRatio>=.4&&ph.widthRatio<=.7&&!clipped(ph.box));
  assert(ph.box[0]>=40&&ph.box[2]<=1040&&ph.box[1]>=110&&ph.box[3]<=1600);
  assert(Math.abs((ph.box[2]-ph.box[0])/1080-ph.widthRatio)<.0002);
  assert(ph.principalExcludesSecondaryPropsAndHands&&ph.retiringSecondaryNotCountedAsPrincipal);
  selected.set(j,{k,ref,ph});
 }
 assert.equal(selected.size,p.replacementOutputs);
 for(let j=0;j<nf;j++)assert.equal(selected.has(j),keys.includes(at(j).key),'Every selected cue output/held dependent must be replaced exactly');
 const sfx=read(SFX);assert.equal(sha(MIX),MIXPIN);assert.equal(sfx.newMixed,MIX);assert.equal(sfx.newMixSha256,MIXPIN);
 assert(sfx.suppliedVoiceWaveformUnchanged&&sfx.originalMixAndSourcesUnchanged&&sfx.musicAndOtherSeRecipeUnchanged);
 assert(sfx.allPcmOutsideMovedTwoEventGroupsByteIdentical&&sfx.changedSamplesOutsideExpectedEventSubwindows===0);verify(sfx.protectedInputSha256);
 const cp=read(problem+'/problem.json');assert(cp.canonical&&Array.isArray(cp.parts));assert.equal(cp.answerDegrees,49.106605350869096);
 assert(!JSON.stringify(cp).includes('点検'),'Clean canonical problem required');
 const protectedPaths=[...Object.keys(bp.protectedInputSha256),...Object.keys(p.protectedInputSha256),...Object.keys(sfx.protectedInputSha256),
  base+'/prepared.json',base+'/export.json',exp.video,base+'/composite-provenance.json',base+'/final-held-dimensions.json',
  base+'/blender/desk/anchors.json',base+'/blender/desk/meta.json',base+'/blender/delivered-camera-poses.json',base+'/blender/camera-motion.json',
  helper,B6AUDIT,patchBase+'/probe/report.json',patchBase+'/render/report.json',p.anchors,MIX,SFX,
  ...deps.flatMap(d=>[d[1],d[4]]),tmp+'/'+id+'-retained-plan-20261024.json',tmp+'/'+id+'-final3-live-plan-diagnosis-20261024.json',
  fileURLToPath(import.meta.url),W+'scripts/umech/desk-b1v1-final3-render-entry.mjs',W+'scripts/umech/desk-b1v1-final3-frame.mjs',
  ...['problem.json','挑戦.png','答え.png'].map(n=>problem+'/'+n)];
 const hashes=Object.fromEntries([...new Set(protectedPaths)].map(p=>[p,sha(p)])),inventories=protectedInventories(prior);
 const memo=new Map(actualHashes),hashFile=p=>{const r=fs.realpathSync(p);if(!memo.has(r))memo.set(r,sha(r));return memo.get(r);};
 const records=[];
 for(let j=0;j<nf;j++){
  const old=prior.records[j];assert.equal(old.frame,j);assert.deepEqual(old.retainedOriginalPlan,live.plans[j]);
  assert.equal(fs.realpathSync(base+'/blender/desk/'+jpg(j)),fs.realpathSync(old.source));assert.equal(hashFile(old.source),old.sha256);
  const s=selected.get(j),file=s?raw+'/'+jpg(s.k):old.source;
  if(s){poses[j]=structuredClone(s.ph.pose);for(const n of names){const v=pa.anchors[n][s.k];assert(Array.isArray(v)&&v.length===3&&v.every(Number.isFinite));anchors.anchors[n][j]=v;}}
  records.push({frame:j,time:j/fps,source:file,sha256:hashFile(file),kind:s?'actual-integrated-B6-derivative':'byte-identical-B3-delivered-raw',
   actualPatchFrame:s?.k??null,originalObjectSourceFrame:s?.ref??old.originalObjectSourceFrame??sourceRef(j),
   originalPhysicalStateExplicitlyCorrected:!!s,newActionsEvaluatedAtOutputTime:!!s,
   retainedOriginalPlan:live.plans[j],previousB3Record:old});
 }
 const moving=poses.map((p,j)=>j>0&&!same(p,poses[j-1])),motion={frames:nf,moving_frames:moving.filter(Boolean).length,
  moving_ratio:moving.filter(Boolean).length/nf,top_ratio:poses.filter(p=>p[5]>=80).length/nf,
  method:'Exact B3 per-output delivered poses plus integrated B6 actual-source poses. No standalone patch motion replaces the whole film.',
  b3BaselineMovingFrames:read(base+'/blender/camera-motion.json').moving_frames};
 const dims=structuredClone(read(base+'/final-held-dimensions.json'));
 for(const sample of dims.samples){const s=selected.get(sample.frame);sample.previousB3Measurement={box:sample.box,widthRatio:sample.widthRatio,clipped:sample.clipped,measurementSource:sample.measurementSource,principal:sample.principal,principalDefinition:sample.principalDefinition??null};
  sample.moving=moving[sample.frame];sample.deliveredCameraPose=poses[sample.frame];if(s){const ph=s.ph;
   const [identity,definition]=principal(sample.cue);
   Object.assign(sample,{box:ph.box,widthRatio:ph.widthRatio,within40to70:ph.widthRatio>=.4&&ph.widthRatio<=.7,smallBelow35:ph.widthRatio<.35,clipped:clipped(ph.box),
    actualPatchedFrame:s.k,measurementSource:'actual-integrated-B6-derivative',evaluatedGeometry:true,
    principal:identity,principalDefinition:definition,
    criticalBox:ph.criticalBox,retiringSecondaryPropsBox:ph.retiringSecondaryPropsBox,phaseValues:ph.phaseValues,
    originalPhysicalStateExplicitlyCorrected:true,unchangedOtherObjectSourceFrame:s.ref});}}
 dims.method='All759 B3 actual-held samples (714 exact half-second samples plus45 cue-end samples), replaced only by exact B6 actual-source full-geometry records. Proxy NG is retained; no automatic waiver/eye approval.';
 dims.automaticGate7or7bWaived=false;dims.actualMp4EyeReviewPending=true;dims.originalNGMustBeRetained=true;
 dims.measurementsOutside40to70Retained=dims.samples.filter(s=>!s.within40to70);dims.clipsRetained=dims.samples.filter(s=>s.clipped);
 assert.equal(dims.samples.length,759);assert.equal(dims.samples.filter(s=>Number.isInteger(s.sampleTime*2)).length,714);
 assert(dims.samples.every(s=>s.frame===Math.round(s.sampleTime*fps)));
 assert(!dims.samples.some(s=>selected.has(s.frame)&&(!s.within40to70||s.clipped)));
 verify(hashes);for(const[dir,inv]of Object.entries(inventories))assert.deepEqual(inventory(dir),inv);
 fs.mkdirSync(desk,{recursive:true});fs.mkdirSync(out);fs.mkdirSync(cache+'/problem');
 for(const n of ['plan.json',id+'.json','phrase-times.json',id+'.voice.wav'])link(base+'/'+n,cache+'/'+n);
 link(MIX,cache+'/'+id+'.wav');link(base+'/blender/data.json',cache+'/blender/data.json');
 for(const r of records)link(r.source,desk+'/'+jpg(r.frame));
 write(desk+'/anchors.json',anchors);write(cache+'/blender/camera-motion.json',motion);write(cache+'/blender/delivered-camera-poses.json',{fps,frames:nf,poses});
 link(base+'/blender/desk/original-meta.json',desk+'/original-meta.json');
 write(desk+'/meta.json',{id,frames:nf,kind:'Exact B3 delivery plus approved integrated B6 map; original canonical planner not certified',originalPlanCounts:counts,originalMeta:desk+'/original-meta.json'});
 write(cache+'/final-held-dimensions.json',dims);for(const n of ['problem.json','挑戦.png','答え.png'])link(problem+'/'+n,cache+'/problem/'+n);
 const inputReports={B6:{path:patchBase+'/render/report.json',sha256:sha(patchBase+'/render/report.json'),helper,helperSha256:hp,probeSha256:pp,
  actualSources:p.actualSources,replacementOutputs:p.replacementOutputs,auditSha256:B6AUDITPIN},B4v4Probe:{path:deps[0][1],sha256:deps[0][2]},B5v4Probe:{path:deps[1][1],sha256:deps[1][2]},SFX:{path:SFX,sha256:sha(SFX),mixed:MIX,mixedSha256:MIXPIN}};
 const owner={id,candidate:'B3 plus sole integrated B6 v6 raw, explicit lore-garlic waiting transform and approved two-SE timing derivative',cache,base,frames:nf,fps,addedActualSources:p.actualSources,replacedOutputFrames:selected.size,
  allRawMappingAndAnchorsExact:true,originalLivePlanCounts:counts,postCalibrationASTCountsPreservedSeparately:{render:3755,dup:6945},originalPlannerNotCertifiedAsCanonicalPass:true,
  original97_6SNIsNotAnIntrinsicPhysicsViolation:true,N2StagedEscapeAndAttachmentRetained:true,
  originalInputsAndNGPreserved:true,actualFinalGatesPending:true,actualFinalEyeReviewPending:true,earListeningPerformed:false,finalPassed:false};
 write(cache+'/composite-provenance.json',{...owner,records,inputReports,basePreparedSha256:B3PIN,fullRawProtection:inventories,actualPatchImageSha256:Object.fromEntries(actualHashes),
  sourceTimeMeaning:'originalObjectSourceFrame is unchanged other-object provenance; explicit new B6 actions are evaluated at output time, with phase values in physical records.',
  noStandaloneB4B5FullRenderRequired:true,exactActualStateGuardedBeforeCandidateSelection:true,loreGarlicInitialPlacement:p.loreGarlicInitialPlacement,
  scoreboardIndividualWordingDifferencePreserved:p.scoreboard});
 const outputs=['composite-provenance.json','final-held-dimensions.json','blender/desk/anchors.json','blender/camera-motion.json','blender/delivered-camera-poses.json','blender/desk/meta.json',
  'problem/problem.json','problem/挑戦.png','problem/答え.png'];
 write(cache+'/prepared.json',{...owner,encoded:false,protectedInputSha256:hashes,outputHashes:Object.fromEntries(outputs.map(n=>[n,sha(cache+'/'+n)])),inputReports,
  problemSourceFolder:problem,audioRecipe:'Only turn97.65..98 and returnclick98.60 changed; supplied voice/music/other sounds byte-proven unchanged outside their event windows.',
  linkedOriginalPlanAndSubtitleJsonUnchanged:true,explicitModelTransformDerivative:p.loreGarlicInitialPlacement,
  originalUnexecutedV2AssemblerPreserved:true,newAnchorAccessMatchesActualSingleAnchorsObject:true});
 console.log(JSON.stringify({cache,prepared:true,encoded:false,addedActual:p.actualSources,replaced:selected.size,moving:motion.moving_frames,finalPassed:false}));
}else{
 const pp=read(cache+'/prepared.json');assert.equal(pp.cache,cache);assert.equal(pp.encoded,false);verify(pp.protectedInputSha256);
 for(const[n,h]of Object.entries(pp.outputHashes))assert.equal(sha(cache+'/'+n),h,n);
 const prov=read(cache+'/composite-provenance.json');for(const[p,inv]of Object.entries(prov.fullRawProtection))assert.deepEqual(inventory(p),inv);
 assert(!exists(cache+'/export.json')&&!exists(out+'/'+id+'.mp4'),'Preserve previous output');
 const checked=new Map();for(const r of prov.records){assert.equal(fs.realpathSync(desk+'/'+jpg(r.frame)),fs.realpathSync(r.source));
  const real=fs.realpathSync(r.source);if(!checked.has(real))checked.set(real,sha(real));assert.equal(checked.get(real),r.sha256);}
 const start=Date.now(),r=spawnSync(process.execPath,['scripts/umech/desk-b1v1-final3-render-entry.mjs',id],{
  cwd:W,env:{...process.env,EM_FILM_CACHE:cache,FILM_OUTPUT:out,FILM_COPY_AUDIO:'0',
  FFMPEG:process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'},stdio:'inherit'});
 assert.equal(r.status,0,'New encode failed; keep its partial output');verify(pp.protectedInputSha256);
 for(const[p,inv]of Object.entries(prov.fullRawProtection))assert.deepEqual(inventory(p),inv);for(const[p,h]of checked)assert.equal(sha(p),h);
 const video=out+'/'+id+'.mp4';assert(fs.statSync(video).size>1e6);
 write(cache+'/export.json',{id,video,sha256:sha(video),frames:nf,seconds:(Date.now()-start)/1000,preparedSha256:sha(cache+'/prepared.json'),
  encoder:'Unmodified render-all-films-gptv2.mjs CRF18 via B3 private frame hook; B3+B6 actual raw and new two-SE-only mix.',
  originalJapaneseCaptionsAndVoiceUnchanged:true,earListeningPerformed:false,originalGateNGPreserved:true,actualFinalGatesPending:true,actualFinalEyeReviewPending:true,finalPassed:false});
 console.log(video);
}
