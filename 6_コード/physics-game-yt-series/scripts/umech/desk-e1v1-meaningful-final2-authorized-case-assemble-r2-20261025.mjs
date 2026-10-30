// NEW r2 fixed-right-edge add-only assembler adapter. Root alone invokes prepare/encode.
// Original454 source is retained. Only control9540 may use the separately
// pinned root-authorized right-edge case; every other pixel/control stays0.
import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';
import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));
const self=fileURLToPath(import.meta.url),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const source=path.join(W,'scripts/umech/desk-e1v1-meaningful-final2-assemble-20261025.mjs');
const policyFile=path.join(W,'outputs/axes-20261023/root-e1-control9540-right-edge-only-policy-r2-20261025.json');
const helper=path.join(W,'scripts/blender/desk_axes_e1_meaningful_motion_v6_20261025.py');
const caseDecoder=path.join(W,'scripts/umech/compare-e1-control9540-authorized-case-v2-20261025.py');
const pins={
 [source]:'4543405f9c0e2e36aef2678dadda9836c4e4efd5f790bbc1ed03471e4d8a118f',
 [policyFile]:'5ea12bc32832867a775062a2f42fa9a9a81709a670ba52a0e30300c8950f310f',
 [helper]:'722e6918ed5902c374b8f075e58e36ca47f52668d7c6cd62899bb5238eef8797',
 [caseDecoder]:'7b0390b233d0a8e6d5947603e1ab511743c8f4880ff1b20b1c735fd0f4677025',
 [path.join(W,'outputs/axes-20261023/e1-actual124-control9540-rightedge-background-independent-20261025.json')]:'7d2d4cb5d7a529e7d159e4c6500eef12543cd0c2e089577c0ba878acde6b69e4',
 ['/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v4-20261025/probe/report.json']:'8a8e252833896f216c992474198dff14a36f1529e30e848de3c301d5b2e37a2c',
 [path.join(W,'scripts/umech/desk-e1v1-meaningful-final2-authorized-case-assemble-20261025.mjs')]:'7fa1e9ce12c13691220a0e98dc51e1b7ce92bf2c4dd54c7861e64cdc9e54db6c',
 [path.join(W,'scripts/umech/compare-e1-control9540-authorized-case-20261025.py')]:'9874bd85abd5dd231c9b4c0096cd222e2454c655272c4156076c56619e7a1cf5',
 ['/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v5-20261025/probe/report.json']:'f12f1ccc23ec3134c9de490d2f886676c494267241ce158c8e68c33a07492f6a',
 [self]:sha(self)
};
const verify=()=>{for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);};verify();
const policy=JSON.parse(fs.readFileSync(policyFile));
assert(policy.supplementalControlPolicyAuthorized===true&&policy.actualViewer==='root');
assert.equal(policy.allowedControlFrame,9540);assert.deepEqual(policy.permittedBackgroundRectangleInclusive,[1040,110,1079,320]);
assert.equal(policy.maximumBackgroundChannelDelta,2);assert.equal(policy.maximumChangedBackgroundPixels,100);
assert(policy.allPixelsOutsideRectangleMustBeRgbExact===true&&policy.quantizationAndDimensionsMustRemainIdentical===true&&policy.controls3804509249MustRemainWholeImageRgbExact===true);
assert(policy.newMotionApprovalGrantedHere===false&&policy.finalAcceptance===false);
const original=fs.readFileSync(source,'utf8');let text=original;const boundaries=[];
const replace=(before,after,count=1)=>{assert.equal(text.split(before).length-1,count,before.slice(0,100));text=text.split(before).join(after);boundaries.push({before,after,count});};
// A data-URL import must still hash this real NEW adapter and resolve W here.
replace('import.meta.url',JSON.stringify(import.meta.url),3);
replace(" assert.equal(r.changes.shipboardPeriodSeconds,1,'Same clock keeps its canonical one-second period');",
 " assert.equal(path.resolve(helper),"+JSON.stringify(helper)+");assert.equal(helperSha,"+JSON.stringify(pins[helper])+");\n assert.equal(r.changes.shipboardPeriodSeconds,1,'Same clock keeps its canonical one-second period');");
replace(`   assert(c.sourceEquivalentAgainstExistingDeliveredRaw===true&&c.decodedRgbExact===true&&c.pixelAllowedDifference===0&&c.wholeImageNotBackgroundOnly===true);
   assert.deepEqual(c.decodedDifferenceMinMax,[0,0]);const d=c.independentDecodedRgbComparison;
   assert(d.decodedRgbExact===true&&d.maximumAbsoluteChannelDifference===0&&d.allowedDifference===0&&d.quantizationExactlyEqual===true);
   assert.equal(d.leftSha256,c.expectedSha256);assert.equal(d.rightSha256,c.sha256);assert.deepEqual(d.rgbDimensions,[1080,1920,3]);
   assert.equal(c.independentDecoderSha256,'f40eb8ee33e8ffd1ad07fe0ed5bf5d5508f0b335acd687cbcca9feef2b17391f');`,
 `   assert(c.sourceEquivalentAgainstExistingDeliveredRaw===true&&c.pixelAllowedDifference===0&&c.wholeImageNotBackgroundOnly===true);
   const d=c.independentDecodedRgbComparison;
   assert(d.allowedDifference===0&&d.quantizationExactlyEqual===true&&d.filesWritten===0&&d.renderOrEncodePerformed===false);
   assert.equal(d.leftSha256,c.expectedSha256);assert.equal(d.rightSha256,c.sha256);assert.deepEqual(d.rgbDimensions,[1080,1920,3]);
   assert.equal(c.independentDecoderSha256,'f40eb8ee33e8ffd1ad07fe0ed5bf5d5508f0b335acd687cbcca9feef2b17391f');
   if(c.decodedRgbExact===true){
    assert(c.explicitCaseAccepted===false&&d.decodedRgbExact===true&&d.maximumAbsoluteChannelDifference===0);
    assert.deepEqual(c.decodedDifferenceMinMax,[0,0]);
   }else{
    assert.equal(c.frame,9540,'No case for any other control');
    assert(c.decodedRgbExact===false&&d.decodedRgbExact===false&&c.byteExactAgainstExistingDeliveredRaw===false);
    assert(c.wholeRgbZeroFailureNotRelabeled===true&&c.originalByteExactFailureNotRelabeled===true&&c.explicitCaseAccepted===true);
    assert.equal(path.resolve(c.expectedPath),'/private/tmp/ys/ys-chain-e1v1/blender/desk/09540.jpg');
    assert.equal(c.expectedSha256,'23f73fa17cd7e96e3087c267617661e28d44f0c7b598d51883d0269fa8aebf35');
    assert.equal(path.resolve(c.explicitCasePolicy),${JSON.stringify(policyFile)});assert.equal(c.explicitCasePolicySha256,${JSON.stringify(pins[policyFile])});
    assert.equal(path.resolve(c.independentExplicitCaseDecoder),${JSON.stringify(caseDecoder)});assert.equal(c.independentExplicitCaseDecoderSha256,${JSON.stringify(pins[caseDecoder])});
    const a=c.independentExplicitCaseComparison;
    assert.equal(a.frame,9540);assert.equal(a.leftSha256,c.expectedSha256);assert.equal(a.rightSha256,c.sha256);
    assert.equal(path.resolve(a.left),path.resolve(c.expectedPath));assert.equal(path.resolve(a.right),path.resolve(c.path));
    assert.deepEqual(a.rgbDimensions,[1080,1920,3]);assert(a.quantizationExactlyEqual===true&&a.decodedRgbExact===false&&a.explicitCaseAccepted===true);
    assert.deepEqual(a.authorizedBoundingBoxInclusive,[1040,110,1079,320]);
    const b=a.differenceBoundingBoxInclusive;assert(Array.isArray(b)&&b.length===4&&b.every(Number.isInteger)&&b[0]>=1040&&b[1]>=110&&b[2]<=1079&&b[3]<=320&&b[0]<=b[2]&&b[1]<=b[3]);
    assert.equal(a.maximumAllowedChangedPixels,100);assert(Number.isInteger(a.changedPixelCount)&&a.changedPixelCount>0&&a.changedPixelCount<=100);
    assert.equal(a.maximumAllowedChannelDifferenceInsideCase,2);assert(Number.isInteger(a.maximumAbsoluteChannelDifference)&&a.maximumAbsoluteChannelDifference>0&&a.maximumAbsoluteChannelDifference<=2);
    assert(a.allOutsideAuthorizedRectangleExactlyZero===true&&a.outsideAuthorizedRectangleAllowedDifference===0);
    assert(a.filesWritten===0&&a.renderOrEncodePerformed===false&&a.wholeImageEqualityNotClaimedForCase===true);
    assert.equal(d.maximumAbsoluteChannelDifference,a.maximumAbsoluteChannelDifference);assert.deepEqual(c.decodedDifferenceMinMax,[null,a.maximumAbsoluteChannelDifference]);
   }`);
replace(" for(const[p,h]of Object.entries(bprep.outputHashes))hashes[B+'/'+p]=h;",
 " for(const[p,h]of Object.entries(bprep.outputHashes))hashes[B+'/'+p]=h;\n for(const[p,h]of Object.entries("+JSON.stringify(pins)+")){assert(!Object.hasOwn(hashes,p)||hashes[p]===h,'Adapter/source pin conflict');hashes[p]=h;}");
let inverse=text;
for(const{before,after,count}of [...boundaries].reverse()){assert.equal(inverse.split(after).length-1,count);inverse=inverse.split(after).join(before);}
assert.equal(inverse,original,'Outside declared control/identity/pin boundaries source must remain exact');
assert.equal(boundaries.length,4);
// Import is the root-authorized execution boundary, never an automatic review
// or policy waiver. The inherited script independently validates all inputs,
// RNA context proof,12 root-viewed probes,354 actual images and old inventories.
verify();
try{await import('data:text/javascript;base64,'+Buffer.from(text,'utf8').toString('base64'));}
finally{verify();}
