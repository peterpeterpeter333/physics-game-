// CPU only. A separate, user-approved geometric measurement; the original
// image inspector and every historical NG remain byte-for-byte unchanged.
// Run after the149 render report exists:
// node scripts/umech/d1-physical-supplemental-checker-20261025.mjs --authorized \
//   --render-report-sha256=<SHA> --report=/absolute/new-report.json \
//   [--new-cache=/absolute/cache] [--new-mp4=/absolute/movie.mp4]
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';

const W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';
const F='/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025';
const V='/private/tmp/ys/ys-chain-d1v1-five-width-camera-v2-20261025';
const M='/private/tmp/ys/ys-chain-d1v1-missing131-physical-v1-20261025';
const ANCHORS=['beam','boiler','can','coal','cyl','fuji','piston'];
const ORIGINAL_MP4=F+'/out/ys-chain-d1v1.mp4';
const REPORTS={old:F+'/final-composite-physical-v6-actual-anchor-evidence-20261025.json',
 extra:M+'/report.json',audit:V+'/audit/report.json',probe:V+'/probe/report.json'};
const CACHE_PINS={
 'blender/delivered-provenance.json':'e04e8a9e9afa1c1a0ba054aa5c97ea1fc0f976d41e7712107805d55addeea178',
 'blender/delivered-camera-poses.json':'2ed3385064ba4a3e1f3867acf3a0e67d30abe3d6fa33e1275077a72ad62b3873',
 'blender/desk/anchors.json':'01d9bbb1f8b2c2d43e5cab8c42a53382d4fc0151fdeb935717d652be774d7b8d',
 'blender/desk/meta.json':'1f7e6c3d9d51c69b0be556f1ae5c4048b9783c782e75273c975dffdb86216e8c',
 'plan.json':'0000b2d638dac84a15c42943b86aba4411bde1844004c900fc37e1fe568c8feb',
 'ys-chain-d1v1.json':'3789e55ddfdd42308da242396ea755f221e636e75c5501c4e0163717a168d510',
 'phrase-times.json':'3e00e8af9e1613d8d7e7679f58d4fdf8650c1edfe436b2077e0e67503c088f54',
 'ys-chain-d1v1.voice.wav':'74b0951c096caea1be50a5442030cac089dc51c41ea076987bd7633fe369d0ab',
 'ys-chain-d1v1.wav':'8a7bde7c45cc240da46b6a2908297f4058e7966d094f3f7e70cfb58f29b24402',
 'blender/data.json':'eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44'};
const SOURCE_PINS={
 'docs/video-revision-20260924/ytseries/chain-d-1.mjs':'eae1fb9000b3826e5319ad8dd74d9ae8e867f005c4768bf78e26d40fad3b8c9f',
 'docs/video-revision-20260924/deep/技術の疑問の鎖_D-1_第1版_ナレーション.md':'f5cac81feab8b357dcc92698ed2577deccf26ab6f897104a2677604270001a3b',
 'scripts/umech/desk-quality-gate.mjs':'34bf299c1f3b53be622b79d01e19284023cc6f64b14c9d5ec88ead5829748308',
 'scripts/umech/desk-quality-gate-frames.py':'545c7f442c9b7feb1bbfed86543def04d6e6f1cf2638d31bc640a39bd1a4e1bb',
 'scripts/umech/desk-frame.mjs':'1174d49f123e2dcf614143f617c2483d3086be4b38ff51bfe8d0be721447022f',
 'scripts/umech/desk-faces.mjs':'b6fadf280e72c5d2f2aeb77d2285a08d9bdd0cd4554a13a2a9a1a55114eefd3f',
 'scripts/umech/desk-d1v1-overlay.mjs':'9e1105b7a0c4a077b9f4a9067a31760882398304460132ecb22b78ab50ad4a2f',
 'scripts/umech/desk-d1v1-final-layout-frame-20261025.mjs':'c22ac5086b713141b13a1c9c53c8d412727d8711f32b9556bfe55baeec9012d3',
 'scripts/blender/desk_axes_d1_original_ng_variants_20261025.py':'1ff60f728cd60c36a48b20c78cf4169fdf1ca7395ce31622e3362f4a15f96b71',
 'scripts/blender/desk_axes_d1_five_width_camera_plan_v2_20261025.py':'c036200df1256bdf31ae453e9c38b500c2041ef9087d7687cc40d6b3c36964ab',
 'scripts/blender/desk_axes_d1_five_width_probe_job_v2_20261025.py':'6a98c13e2ac68a696753f100117f4b0c01ebe9ef921cc51bd2c8696398c391b3'};
const FIXED_PINS={
 [REPORTS.old]:'9bcc39fda77012cff9154c8cc21703ba2a92480f924416df105fb560cc97faf6',
 [REPORTS.extra]:'438ecad89185c74d32fb26f4b09116f66d29832d8d1f943df1d3faa16d90cf37',
 [REPORTS.audit]:'328a5def747cb2af8ea3fe826fa9d4eae5f474de5aaf6d93046a1d83179e49f5',
 [REPORTS.probe]:'a52cfc91118225b362e343f26464859e41501f3adb10638e55679914bf251c19',
 [ORIGINAL_MP4]:'a75bb51396f4e90ab88a477e628aa4e42f8a5d1c7440f23f90b67c6e288f218f',
 [F+'/final-original-gates/quality-gate.json']:'3a7f686671368502eaba31e688dc78573f1ce742d0906bdb2e85a1084f233458',
 [F+'/final-original-gates/d1-original-frame-samples.npz']:'d2d90b4d56f7bdeb8e62ab258a40c8f8401e2dde1459aac83e1b8a68e5fe6229',
 ...Object.fromEntries(Object.entries(CACHE_PINS).map(([p,h])=>[F+'/'+p,h])),
 ...Object.fromEntries(Object.entries(SOURCE_PINS).map(([p,h])=>[W+'/'+p,h]))};
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const objectSha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const unique=a=>[...new Set(a)].sort((a,b)=>a-b);
const frameOf=r=>r.frame??Math.round(r.time*30);
const finite=a=>Array.isArray(a)&&a.every(Number.isFinite);
const box=b=>Array.isArray(b)?b:b?[b.x0,b.y0,b.x1,b.y1]:null;
const boxWidth=b=>(b[2]-b[0])/1080;
const isSafe=(b,bottom)=>finite(b)&&b.length===4&&b[0]>=40&&b[2]<=1040&&b[1]>=110&&b[3]<=bottom;
const equalSet=(a,b)=>assert.deepEqual(unique(a),unique(b));
function metric(values){const s=[...values].sort((a,b)=>a-b),n=s.length;assert(n>0);const median=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;
 return{samples:n,median,smallBelow035:s.filter(v=>v<.35).length,smallRatio:s.filter(v=>v<.35).length/n,
  medianAtLeast060:median>=.6,smallRatioAtMost020:s.filter(v=>v<.35).length/n<=.2};}
function guards(r){assert(!r.error&&!r.cleanupError);assert(r.protectionChecks&&Object.keys(r.protectionChecks).length>=18);
 assert(Object.values(r.protectionChecks).every(v=>v===true));}
function seven(a){assert.deepEqual(Object.keys(a??{}).sort(),ANCHORS);for(const p of Object.values(a))assert(finite(p)&&p.length===3);}
export function containerVideoSamples(p){
 const b=fs.readFileSync(p);
 function boxes(a,z){const out=[];while(a<z){let n=b.readUInt32BE(a),h=8;const type=b.toString('ascii',a+4,a+8);
  if(n===1){n=Number(b.readBigUInt64BE(a+8));h=16;}if(n===0)n=z-a;assert(Number.isSafeInteger(n)&&n>=h&&a+n<=z);
  out.push({type,payload:a+h,end:a+n});a+=n;}assert.equal(a,z);return out;}
 const child=(x,name)=>{const y=boxes(x.payload,x.end).find(t=>t.type===name);assert(y,name);return y;};
 const moov=boxes(0,b.length).find(x=>x.type==='moov');assert(moov,'MP4 moov');
 const track=boxes(moov.payload,moov.end).filter(x=>x.type==='trak').find(x=>{const h=child(child(x,'mdia'),'hdlr');return b.toString('ascii',h.payload+8,h.payload+12)==='vide';});
 assert(track,'MP4 video track');const s=child(child(child(child(track,'mdia'),'minf'),'stbl'),'stsz');
 return b.readUInt32BE(s.payload+8);
}

export async function main(argv=process.argv.slice(2)){
 const opts=Object.fromEntries(argv.filter(x=>x.startsWith('--')&&x.includes('=')).map(x=>{const i=x.indexOf('=');return[x.slice(2,i),x.slice(i+1)];}));
 assert(argv.includes('--authorized'),'Explicit root execution required');
 assert(opts.report&&path.isAbsolute(opts.report)&&!fs.existsSync(opts.report),'Fresh absolute --report required');
 assert(!opts.report.startsWith(F+'/'),'Preserve the old final cache');
 assert(/^[0-9a-f]{64}$/.test(opts['render-report-sha256']??''),'Completed149 --render-report-sha256 required');
 const renderPath=opts['render-report']??V+'/render/report.json';
 const pins={...FIXED_PINS,[renderPath]:opts['render-report-sha256']};
 const states=new Map();
 const pin=(p,h)=>{assert.equal(sha(p),h,p);const s=fs.statSync(p);states.set(p,{size:s.size,mtimeMs:s.mtimeMs});};
 for(const[p,h]of Object.entries(pins))pin(p,h);
 const old=read(REPORTS.old),extra=read(REPORTS.extra),audit=read(REPORTS.audit),probe=read(REPORTS.probe),render=read(renderPath);
 const provenance=read(F+'/blender/delivered-provenance.json').frames,poses=read(F+'/blender/delivered-camera-poses.json');
 const oldAnchors=read(F+'/blender/desk/anchors.json').anchors;
 for(const r of[old,extra,audit,probe,render]){assert.equal(r.episode,'D-1');guards(r);}
 assert.equal(old.rows.length,846);assert.equal(extra.rows.length,131);assert.equal(audit.rows.length,158);
 assert.equal(probe.renders,6);assert.equal(render.mode,'render');assert.equal(render.renders,149);assert.equal(render.rows.length,149);
 assert(audit.allAffectedAndBoundaryPhysicalPass&&render.allAffectedAndBoundaryPhysicalPass);
 assert.equal(render.runnerSha256,SOURCE_PINS['scripts/blender/desk_axes_d1_five_width_probe_job_v2_20261025.py']);
 assert.equal(render.helperSha256,SOURCE_PINS['scripts/blender/desk_axes_d1_five_width_camera_plan_v2_20261025.py']);
 assert.deepEqual(render.plan,audit.plan);assert.deepEqual(probe.plan,audit.plan);
 for(const r of probe.rows){assert(r.pass);pin(r.image,r.imageSha256);}
 assert(render.noPerFrameFitOrAutomaticRenormalization&&render.oldSourceFrameAndOperationTimeMappingsUnchanged);
 assert.equal(provenance.length,12163);assert.equal(poses.length,12163);
 const affected=new Set(audit.affectedFrames);assert.equal(affected.size,149);equalSet(render.rows.map(frameOf),[...affected]);
 const half=extra.originalHalfSecondFrames;equalSet(half,Array.from({length:811},(_,i)=>i*15));
 equalSet(extra.retainedPhysicalFrames,old.rows.map(frameOf));
 equalSet(extra.requestedFrames,half.filter(j=>!new Set(old.rows.map(frameOf)).has(j)));
 const selected=new Map(),origins=new Map(),renderMap=new Map(),auditMap=new Map(audit.rows.map(r=>[r.frame,r]));
 const origin=(r,file,h,index)=>({report:file,reportSha256:h,row:index,frame:frameOf(r),rowSha256:objectSha(r),previousPass:r.pass});
 function addOrigin(j,v){if(!origins.has(j))origins.set(j,[]);origins.get(j).push(v);}
 function oldRecord(r,label,file,h,index){const j=frameOf(r),p=r.actualSurface,c=r.criticalSurface;
  assert.equal(r.actualPose.length,7);assert.deepEqual(r.deliveredFrame,provenance[j]);assert.deepEqual(r.actualPose,poses[j]);
  assert(p.vertexCount>0&&p.visibleObjectCount>0&&p.objectNames.length===p.visibleObjectCount);
  assert.equal(r.semanticWorldGeometry.primary.vertexCount,p.vertexCount);
  if(c)assert(c.vertexCount>0&&c.visibleObjectCount>0);
  pin(r.deliveredFrame.raw,r.actualRawSha256);
  addOrigin(j,origin(r,file,h,index));
  return{frame:j,time:j/30,cue:r.cue,semanticPrincipal:r.semanticPrincipal,evidence:label,primary:box(p),critical:box(c),
   vertexCount:p.vertexCount,presenceEvidence:'positive evaluated vertex/object counts and pinned semantic world record',
   vertexCountEmitted:true,sourceDeliveredRow:r.deliveredFrame,pose:r.actualPose,mandatoryMouthPathSafe:r.mandatoryMouthPathSafe!==false};}
 old.rows.forEach((r,i)=>{const x=oldRecord(r,'retained846',REPORTS.old,FIXED_PINS[REPORTS.old],i);assert(!selected.has(x.frame));selected.set(x.frame,x);});
 extra.rows.forEach((r,i)=>{const x=oldRecord(r,'additional131',REPORTS.extra,FIXED_PINS[REPORTS.extra],i);assert(!selected.has(x.frame));selected.set(x.frame,x);});
 function cameraRecord(r,label,file,h,index){const j=r.frame;assert.deepEqual(r.sourceDeliveredRow,provenance[j]);
  assert.deepEqual(r.camera.pose,render.candidateDeliveredCameraPoses[j]);assert.equal(r.pass,true);
  assert(r.physicalChecks.visible&&r.physicalChecks.size40to70&&r.physicalChecks.frameSafe&&r.physicalChecks.originalCriticalSafe1100);
  seven(r.newProjectedAnchors);seven(r.newAnchorWorldPoints);
  const p=box(r.actualSurface),c=box(r.criticalSurface);assert(finite(p)&&p.length===4&&p[2]>p[0]&&p[3]>p[1]);
  addOrigin(j,origin(r,file,h,index));
  return{frame:j,time:j/30,semanticPrincipal:r.semanticPrincipal,evidence:label,primary:p,critical:c,vertexCount:null,
   vertexCountEmitted:false,presenceEvidence:'frozen v2 runner calls world_vertices on the exact semantic role; nonempty cloud assertion and finite positive box; numeric vertex count was not emitted',
   sourceDeliveredRow:r.sourceDeliveredRow,pose:r.camera.pose,mandatoryMouthPathSafe:true,
   newProjectedAnchors:r.newProjectedAnchors,newAnchorWorldPoints:r.newAnchorWorldPoints};}
 for(let i=0;i<audit.rows.length;i++){const r=audit.rows[i];
  if(affected.has(r.frame)){assert.notEqual(r.camera.phase,'unchanged');addOrigin(r.frame,origin(r,REPORTS.audit,FIXED_PINS[REPORTS.audit],i));continue;}
  assert.equal(r.camera.phase,'unchanged');assert.deepEqual(r.camera.pose,poses[r.frame]);
  const x=cameraRecord(r,'unchanged-boundary-audit',REPORTS.audit,FIXED_PINS[REPORTS.audit],i);
  if(!selected.has(x.frame))selected.set(x.frame,x);
 }
 let maxRepeatBoxDelta=0;
 for(let i=0;i<render.rows.length;i++){const r=render.rows[i],a=auditMap.get(r.frame);assert(a&&affected.has(r.frame));
  assert.deepEqual(r.camera,a.camera);assert.equal(r.semanticPrincipal,a.semanticPrincipal);assert.notEqual(r.camera.phase,'unchanged');
  pin(r.image,r.imageSha256);const x=cameraRecord(r,'new149-render',renderPath,pins[renderPath],i);renderMap.set(r.frame,r);
  for(let k=0;k<4;k++)maxRepeatBoxDelta=Math.max(maxRepeatBoxDelta,Math.abs(box(r.actualSurface)[k]-box(a.actualSurface)[k]));
  x.raw=r.image;x.rawSha256=r.imageSha256;selected.set(r.frame,x);
 }
 assert.equal(selected.size,1115);assert(half.every(j=>selected.has(j)));
 assert([...selected.keys()].every(j=>Number.isInteger(j)&&j>=0&&j<=12161),'No state-only source endpoint12162 is an encoded geometry frame');
 const measurements=[...selected.values()].sort((a,b)=>a.frame-b.frame);
 for(const r of measurements){r.originReferences=origins.get(r.frame);r.widthRatio=boxWidth(r.primary);
  r.checks={principalPresent:r.vertexCountEmitted?r.vertexCount>0:true,width40to70:r.widthRatio>=.4&&r.widthRatio<=.7,
   principalSafe:isSafe(r.primary,1600),criticalSafe:r.critical===null||isSafe(r.critical,1100),mandatoryMouthPathSafe:r.mandatoryMouthPathSafe};
  r.pass=Object.values(r.checks).every(v=>v===true);
 }
 const failures=measurements.filter(r=>!r.pass),halfStats=metric(half.map(j=>selected.get(j).widthRatio)),unionStats=metric(measurements.map(r=>r.widthRatio));
 const historicalFailures=[...old.rows.filter(r=>!r.pass).map(r=>({report:REPORTS.old,frame:frameOf(r),time:r.time,cue:r.cue,widthRatio:r.actualSurface.widthRatio,originalPass:false})),
  ...extra.rows.filter(r=>!r.pass).map(r=>({report:REPORTS.extra,frame:frameOf(r),time:r.time,cue:r.cue,widthRatio:r.actualSurface.widthRatio,originalPass:false}))];
 for(const r of historicalFailures){r.currentSelectedEvidence=selected.get(r.frame).evidence;r.currentMeasuredWidthRatio=selected.get(r.frame).widthRatio;r.currentSupplementalPhysicalPass=selected.get(r.frame).pass;}
 let newCache=null;
 if(opts['new-cache']){const c=path.resolve(opts['new-cache']);assert.notEqual(c,F);const na=read(c+'/blender/desk/anchors.json').anchors,np=read(c+'/blender/delivered-camera-poses.json');
  for(const[n,h]of Object.entries(CACHE_PINS).filter(([n])=>!n.startsWith('blender/desk/')&&!n.includes('delivered-')))pin(c+'/'+n,h);
  assert.equal(np.length,12163);assert.deepEqual(Object.keys(na).sort(),ANCHORS);
  for(let j=0;j<12163;j++){const r=renderMap.get(j),expectedRaw=r?.image??provenance[j].raw;
   assert.equal(fs.realpathSync(c+'/blender/desk/'+String(j).padStart(5,'0')+'.jpg'),fs.realpathSync(expectedRaw));
   assert.deepEqual(np[j],r?.camera.pose??poses[j]);for(const n of ANCHORS)assert.deepEqual(na[n][j],r?.newProjectedAnchors[n]??oldAnchors[n][j]);}
  newCache={path:c,sourceRawPoseAndAnchorMappingsChecked:12163,patchedFrames:149,capsAudioAndDataByteIdentical:true,
   sourceFrame12162IsNotAnEncodedFrame:true};
 }
 const oldCount=containerVideoSamples(ORIGINAL_MP4);assert.equal(oldCount,old.endpointEvidence.actualEncodedFrames);
 let movie=null;if(opts['new-mp4']){const p=path.resolve(opts['new-mp4']);assert.notEqual(p,ORIGINAL_MP4);const h=sha(p);if(opts['new-mp4-sha256'])assert.equal(h,opts['new-mp4-sha256']);
  const count=containerVideoSamples(p);assert.equal(count,oldCount,'New movie must preserve the exact12162 encoded samples; source12162 is not encoded');
  pins[p]=h;movie={path:p,sha256:h,containerVideoSamples:count,sourceFrames:12163,lastActualEncodedFrame:12161,
   nonEncodedSourceEndpoint:12162,containerCountOnlyNotAFullPixelDecodeOrEarCheck:true,rawMappingChecked:!!newCache};}
 const pass=failures.length===0&&halfStats.medianAtLeast060&&halfStats.smallRatioAtMost020;
 const report={episode:'D-1',checker:'accurate projected semantic width supplemental measurement',checkerPath:fileURLToPath(import.meta.url),checkerSha256:sha(fileURLToPath(import.meta.url)),
  sourceCache:F,pinnedInputSha256:pins,sourceClipAudioCaptionsAndOriginalInspectorsUnchanged:true,
  scope:{retained846:846,additional131:131,newRendered149:149,auditBoundaryStates:9,newBoundaryStatesAdded:6,uniqueMeasuredFrames:1115,halfSecondCovered:811,halfSecondExpected:811,
   adoption:'new render records only within the explicit149 affected frames; unaffected existing records retain priority; absent unchanged boundary records are added',
   sourceFrames:12163,encodedFrames:oldCount,lastActualEncodedFrame:12161,nonEncodedSourceEndpoint:12162,
   measuredGeometryMaxFrame:Math.max(...selected.keys()),sourceEndpoint12162ExcludedFromMeasuredEncodedGeometry:true,
   all30fpsFramesGeometryMeasured:false},
  uniformHalfSecondPhysicalWidths:halfStats,allUnionPhysicalWidths:unionStats,physicalFailures:failures,
  allMeasuredPrincipalsAndCriticalBoundsPass:failures.length===0,supplementalPhysicalMeasurementPass:pass,
  presenceEvidence:{numericVertexCounts:measurements.filter(r=>r.vertexCountEmitted).length,nonemptyCloudProofWithoutEmittedCount:measurements.filter(r=>!r.vertexCountEmitted).length,
   noInventedVertexCounts:true,projectedGeometryPresenceOnlyNotPixelVisibility:true},
  newCameraRepeatProjectionMaxCoordinateDeltaPixels:maxRepeatBoxDelta,repeatDifferenceNotUsedToRepairHistoricalIdentityChecks:true,
  historicalPhysicalNGPreserved:historicalFailures,historicalAutomaticNGPreserved:old.originalNG,
  historicalMetadataNGPreserved:{reference:old.actualAnchorAndSourceBoxEvidence,
   oldAnchorEqualityFalse:old.rows.filter(r=>r.actualCameraAnchorProof?.originalHistoricalAnchorEqualityAt1eMinus5===false).length,
   oldSourceboxEqualityFalse:old.rows.filter(r=>r.independentSourcePhysicalBoxEvidence?.sourceBoxMatchesAt1eMinus9===false).length,
   sourceboxEqualityNotRecomputedOrRelabeled:true},
  originalProxy7bPassNotClaimed:true,originalProxyNotRerunByThisChecker:true,originalDeskQualityGateAllPassNotClaimed:true,
  originalMovie:{path:ORIGINAL_MP4,sha256:FIXED_PINS[ORIGINAL_MP4],containerVideoSamples:oldCount},newCache,newMovie:movie,
  pixelVisibilityVerified:false,earsVerified:false,continuousPlaybackVerified:false,automaticFilmAcceptance:false,
  rows:measurements};
 for(const[p,s]of states){const t=fs.statSync(p);assert.equal(t.size,s.size,p);assert.equal(t.mtimeMs,s.mtimeMs,p);}
 fs.writeFileSync(opts.report,JSON.stringify(report,null,1),{flag:'wx'});
 console.log(JSON.stringify({report:opts.report,reportSha256:sha(opts.report),supplementalPhysicalMeasurementPass:pass,uniqueFrames:1115,halfSecondFrames:811,
  medianActualWidth:halfStats.median,smallRatio:halfStats.smallRatio,physicalFailures:failures.length,historicalWidthNGPreserved:historicalFailures.length,
  originalProxyNGUnchanged:true,pixelVisibilityVerified:false,earsVerified:false}));
 process.exitCode=pass?0:1;return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{await main();}catch(e){console.error(JSON.stringify({error:e.message,checker:'D-1 physical supplement',noOriginalFileWritten:true}));process.exitCode=2;}
}
