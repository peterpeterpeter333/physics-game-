// NEW r3:694 real source frames, exposed bounded pendulum, strict RGB0 controls.
// Only root invokes prepare/encode after independently viewing all new probes.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';
import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url)),self=fileURLToPath(import.meta.url);
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const source=path.join(W,'scripts/umech/desk-e1v1-meaningful-final2-assemble-20261025.mjs');
const helper=path.join(W,'scripts/blender/desk_axes_e1_meaningful_motion_v7_20261025.py');
const pins={
 [source]:'4543405f9c0e2e36aef2678dadda9836c4e4efd5f790bbc1ed03471e4d8a118f',
 [helper]:'de41d06fd60cf89807efe36998dd4743918738a1a929183bf6a0d94acf3d588b',
 [path.join(W,'scripts/umech/desk-e1v1-meaningful-final2-authorized-case-assemble-r2-20261025.mjs')]:'d2115617d4e5bac28880fe6111a6d3831453217dccf668b565d97dd31c232ba5',
 ['/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v6-20261025/probe/report.json']:'d0874f898df088a56853f81fca898001c8a20f57870e9f7b170b75324d5f1f2b',
 ['/private/tmp/ys/ys-chain-e1v1-camera-final-20261024/blender/patch/09875.jpg']:'15e787b47b8cdd7a56869d047bfb63d6fe5c6e340a6067bbb4f04cab41f7f803',
 [self]:sha(self)
};
const verify=()=>{for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);};verify();
const original=fs.readFileSync(source,'utf8');let text=original;const boundaries=[];
const replace=(before,after,count=1)=>{assert.equal(text.split(before).length-1,count,before.slice(0,100));text=text.split(before).join(after);boundaries.push({before,after,count});};
replace('import.meta.url',JSON.stringify(import.meta.url),3);
// Every354 literal in frozen454 is a changed-source/output count, not a hash.
replace('354','694',11);replace('11252','10912');
replace(" assert.equal(r.changes.shipboardPeriodSeconds,1,'Same clock keeps its canonical one-second period');",
 ` assert.equal(path.resolve(helper),${JSON.stringify(helper)});assert.equal(helperSha,${JSON.stringify(pins[helper])});
 assert(r.boundedShipboardPendulum.expectedActualFrames===694&&r.boundedShipboardPendulum.handActualFrames===69&&r.boundedShipboardPendulum.shipActualFrames===625);
 assert(Math.abs(r.boundedShipboardPendulum.shipboardInterval[0]-308.316)<1e-8&&Math.abs(r.boundedShipboardPendulum.shipboardInterval[1]-329.1393333333334)<1e-8);
 assert.deepEqual(r.boundedShipboardPendulum.stopInterval,[326.43,327.43]);
 assert.equal(r.changes.shipboardPeriodSeconds,1,'Same clock keeps its canonical one-second period');`);
replace(' assert.equal(probe.actualImages.length,12);assert.equal(approval.viewedImageCount,12);',
 ` const planned=r.plannedProbeFrames;assert(Array.isArray(planned)&&planned.length>=27&&new Set(planned).size===planned.length&&planned.every(Number.isInteger));
 assert.deepEqual(probe.plannedProbeFrames,planned);assert.deepEqual(r.boundedShipboardPendulum.plannedProbeFrames,planned);
 assert.deepEqual(probe.actualImages.map(r=>r.frame).sort((a,b)=>a-b),[...planned].sort((a,b)=>a-b));
 assert.equal(probe.actualImages.length,planned.length);assert.equal(approval.viewedImageCount,planned.length);`);
replace('[380,450,9249,9540]','[380,450,9249,9875]');
replace("   assert.equal(c.independentDecoderSha256,'f40eb8ee33e8ffd1ad07fe0ed5bf5d5508f0b335acd687cbcca9feef2b17391f');",
 `   assert.equal(c.independentDecoderSha256,'f40eb8ee33e8ffd1ad07fe0ed5bf5d5508f0b335acd687cbcca9feef2b17391f');
   assert.equal(c.explicitCaseAccepted,false,'Old9540 exception is not active for any new control');
   if(c.frame===9875){assert.equal(path.resolve(c.expectedPath),'/private/tmp/ys/ys-chain-e1v1-camera-final-20261024/blender/patch/09875.jpg');assert.equal(c.expectedSha256,'15e787b47b8cdd7a56869d047bfb63d6fe5c6e340a6067bbb4f04cab41f7f803');}`);
replace('  assert.deepEqual(ph.pose,poses[j]);assert(ph.principal.safe&&ph.principal.widthRatio>=.4&&ph.principal.widthRatio<=.7);',
 `  assert.deepEqual(ph.pose,poses[j]);assert(ph.principal.safe&&ph.principal.widthRatio>=.4&&ph.principal.widthRatio<=.7);
  if(ph.kind==='quiet-flagship-point'){assert.equal(ph.bobVisibility,null);}else{
   const b=ph.bobVisibility;assert(b&&b.passed===true&&b.frontCapVertexFraction>=.18&&b.frontCapRequiredClearanceMeters===.0004);
   assert(b.windowOpeningXZClearanceMeters>=.0004&&b.minimumWindowClearanceMeters===.0004);
   assert(b.wholeBobProjection.safe===true&&b.wholeBobDiameterPixels>=30&&b.minimumWholeBobDiameterPixels===30);
   assert(b.visibleFrontCapDiameterPixels>=25&&b.minimumFrontCapDiameterPixels===25);
   const cap=b.visibleFrontCapProjectedBox;assert(cap[0]>=40&&cap[1]>=110&&cap[2]<=1040&&cap[3]<=1550);
   const a=b.threeAxisAnglesRadians;assert(Math.abs(a[0])<=.003+1e-8&&Math.abs(a[1])<=.18+1e-8&&Math.abs(a[2])<=.02+1e-8);
   assert(b.notAnActualPixelOrFullOcclusionProof===true&&b.rootActualProbeReviewStillMandatory===true);
  }`);
replace(" for(const[p,h]of Object.entries(bprep.outputHashes))hashes[B+'/'+p]=h;",
 " for(const[p,h]of Object.entries(bprep.outputHashes))hashes[B+'/'+p]=h;\n for(const[p,h]of Object.entries("+JSON.stringify(pins)+")){assert(!Object.hasOwn(hashes,p)||hashes[p]===h,'Bounded-motion adapter pin conflict');hashes[p]=h;}");
let inverse=text;for(const{before,after,count}of [...boundaries].reverse()){assert.equal(inverse.split(after).length-1,count);inverse=inverse.split(after).join(before);}
assert.equal(inverse,original);assert.equal(boundaries.length,9);
// No automatic pixel approval: frozen454 still requires the real root receipt,
// complete original context/normalization proof and exact current raw hashes.
verify();try{await import('data:text/javascript;base64,'+Buffer.from(text,'utf8').toString('base64'));}finally{verify();}
