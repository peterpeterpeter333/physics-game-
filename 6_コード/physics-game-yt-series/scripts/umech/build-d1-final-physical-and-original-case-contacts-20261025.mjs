// CPU-only fresh case list/contacts, from existing decoded final JPEGs.
// A physical failure, old proxy flag or whole-face hint is never auto-approved.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';
import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';import sharp from'sharp';
assert(process.argv.includes('--authorized'));
const self=fileURLToPath(import.meta.url),W=fileURLToPath(new URL('../../',import.meta.url));
const F='/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025';
const B='/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025';
const option=n=>process.argv.find(s=>s.startsWith(n+'='))?.slice(n.length+1);
const physicalFile=path.resolve(option('--physical')??''),physicalSha=option('--physical-sha256');
const out=path.resolve(option('--out')??'');
assert(/^[0-9a-f]{64}$/.test(physicalSha??''));assert(physicalFile.startsWith(F+'/'));
assert(out.startsWith('/private/tmp/ys/ys-chain-d1v1-')&&!fs.existsSync(out),'Fresh private output only');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const coverageFile=F+'/actual-final-review/required-coverage-and-reuse.json';
const additionalFile=F+'/actual-original546-additional-20261025/d1v1-additional-original546-manifest.json';
const currentReq=F+'/d1-supplement-requests.json',originalReq=B+'/d1-supplement-requests.json';
const pins={[self]:sha(self),[physicalFile]:physicalSha,
 [coverageFile]:'b6a045848e89110b62aad5d86b9837fc45e4e80b497984bf70fbb30e967ccc33',
 [additionalFile]:'9f7727956e667837b4f4b07a562807b4528c23d3ab56e054f25b6ee389edc523',
 [currentReq]:'34e87b9b95dd1acf081776cfcd563d4d419771ac1554f3703e2bc81cffc89f34',
 [originalReq]:'16088d186cd25ee6d7fa3fc29ad2a2aa45ffab7ddef8ae3748da5a3138e9bee8'};
const pin=(p,h)=>{if(Object.hasOwn(pins,p))assert.equal(pins[p],h);assert.equal(sha(p),h,p);pins[p]=h;};
const verify=()=>{for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);};verify();
const physical=read(physicalFile),coverage=read(coverageFile),additional=read(additionalFile);
pin(coverage.manifest,coverage.manifestSha256);const main=read(coverage.manifest);
assert.equal(physical.mp4Sha256,coverage.mp4Sha256);assert.equal(additional.mp4Sha256,coverage.mp4Sha256);
assert.equal(physical.mp4Sha256,'a75bb51396f4e90ab88a477e628aa4e42f8a5d1c7440f23f90b67c6e288f218f');
pin(physical.mp4,physical.mp4Sha256);assert(Array.isArray(physical.rows)&&!physical.error&&!physical.cleanupError,'Need completed physical rows, not a partial failure');
assert(Object.values(physical.protectionChecks).every(v=>v===true),'Physical preservation must pass');
const actual=new Map();
for(const[manifest,file]of[[main,coverage.manifest],[additional,additionalFile]])for(const r of manifest.frames){
 const j=r.frameIndex,image=path.join(path.dirname(file),'frames-d1v1',r.file);pin(image,r.fileSha256);
 if(actual.has(j))assert.equal(actual.get(j).sha256,r.fileSha256,'Same actual frame differs');
 else actual.set(j,{frame:j,time:j/30,file:image,sha256:r.fileSha256,cue:r.cue??null,row:r.row??null,subtitle:r.subtitle??null,
  manifest:file,manifestSha256:pins[file],reasons:r.reasons??r.originalReasons??[]});
}
assert.equal(actual.size,903);
const phys=new Map(physical.rows.map(r=>[Math.round(r.time*30),r]));assert.equal(phys.size,physical.rows.length);
const cases=new Map();
function add(j,reason,detail){
 const im=actual.get(j);assert(im,'Every case requires exact final decoded JPEG, no raw substitute: '+j);
 let r=cases.get(j);if(!r){r={...im,caseReasons:[],originalRequests:[],physical:phys.get(j)??null,actuallyViewed:false,
  rootCaseDecisionPending:true,approved:false};cases.set(j,r);}
 if(!r.caseReasons.includes(reason))r.caseReasons.push(reason);if(detail)r.originalRequests.push(detail);
}
for(const[file,kind]of[[currentReq,'current-final-original-inspector'],[originalReq,'preserved-original546-inspector']]){
 const req=read(file);for(const r of req.requests)if(r.reasons.some(s=>s.includes('7b-')||s.includes('sparse-'))){
  add(r.frameIndex,kind,{file,sha256:pins[file],request:r});
 }
}
for(const[j,r]of phys){
 const b=r.actualSurface,critical=r.criticalSurface;
 if(!b)add(j,'physical-primary-not-visible');
 if(b&&!(b.widthRatio>=.4&&b.widthRatio<=.7))add(j,'physical-primary-width-outside40to70');
 if(b&&b.widthRatio<.35)add(j,'physical-primary-width-below35');
 if(r.physicalChecks.frameSafe===false)add(j,'physical-primary-frame-or-caption-clipping');
 if(r.criticalChecks?.frameSafe===false)add(j,'physical-critical-frame-or-caption-clipping');
 if(r.mandatoryMouthPathSafe===false)add(j,'physical-mandatory-mouth-path-not-safe');
 if(r.actualCameraAnchorProof?.actualAnchorSourceProvenanceVerified===false)add(j,'actual-anchor-provenance-unresolved');
 if(r.independentSourcePhysicalBoxEvidence?.sourceBoxMatchesAt1eMinus9===false)add(j,'independent-sourcebox-mismatch');
}
const rows=[...cases.values()].sort((a,b)=>a.frame-b.frame);
for(const r of rows){
 const p=r.physical;r.physicalSummary=p?{semanticPrincipal:p.semanticPrincipal,
  principalWidthRatio:p.actualSurface?.widthRatio??null,principalBox:p.actualSurface?[p.actualSurface.x0,p.actualSurface.y0,p.actualSurface.x1,p.actualSurface.y1]:null,
  primaryChecks:p.physicalChecks,criticalBox:p.criticalSurface,criticalChecks:p.criticalChecks,
  faceDeclarationHint:p.faceDeclarationHint,originalPhysicalThresholdPass:p.pass,
  physicalGeometryIsNotActualFaceSizeOrPixelOcclusionEvidence:true}:null;
 const md=await sharp(r.file).metadata();assert.equal(md.width,1080);assert.equal(md.height,1920);
}
fs.mkdirSync(out);const pages=[];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(let start=0;start<rows.length;start+=10){
 const cells=rows.slice(start,start+10),layers=[];
 for(let i=0;i<cells.length;i++){
  const r=cells[i],w=r.physicalSummary?.principalWidthRatio;
  const footer=Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="#fff0d7"/><text x="5" y="12" font-family="Helvetica" font-size="10">j${r.frame} ${(r.frame/30).toFixed(3)}s width=${w==null?'NA':(w*100).toFixed(3)+'%'} ${esc(r.cue??'')}</text><text x="5" y="25" font-family="Helvetica" font-size="10">ROOT CASE PENDING: ${esc(r.caseReasons.join('|').slice(0,45))}</text></svg>`);
  const left=(i%5)*360,top=Math.floor(i/5)*668;
  layers.push({input:await sharp(r.file).resize(360,640).toBuffer(),left,top},{input:footer,left,top:top+640});
 }
 const file=path.join(out,'cases-'+String(pages.length+1).padStart(3,'0')+'.jpg');
 await sharp({create:{width:1800,height:1336,channels:3,background:'#fff'}}).composite(layers).jpeg({quality:92}).toFile(file);
 pages.push({page:pages.length+1,file,sha256:sha(file),cells:cells.length,frames:cells.map(r=>r.frame),actualJpegSha256:cells.map(r=>r.sha256),actuallyViewed:false});
}
verify();const manifest=path.join(out,'manifest.json');
const counts={actualImageUnion903:903,physicalReplayRows:phys.size,candidateUnique:rows.length,pages:pages.length,
 physicalFailures:physical.rows.filter(r=>!r.pass).length,actualImagesWithoutPhysicalRows:[...actual.keys()].filter(j=>!phys.has(j)).length,
 reasons:Object.fromEntries([...new Set(rows.flatMap(r=>r.caseReasons))].map(s=>[s,rows.filter(r=>r.caseReasons.includes(s)).length]))};
fs.writeFileSync(manifest,JSON.stringify({episode:'D-1',mp4:physical.mp4,mp4Sha256:physical.mp4Sha256,
 physical:{file:physicalFile,sha256:physicalSha},coverage:{file:coverageFile,sha256:pins[coverageFile]},
 originalInspectorRequestsPreserved:true,counts,rows,pages,protectedInputSha256:pins,
 newDecodedFrameOrVideoRendered:false,cpuExistingJPEGCompositionOnly:true,
 allCasesPendingExactRootDecision:true,automaticApproval:false,originalNGUnchanged:true,
 earsVerified:false,continuousPlaybackVerified:false,finalAcceptance:false},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({manifest,sha256:sha(manifest),counts,caseApproval:0}));
