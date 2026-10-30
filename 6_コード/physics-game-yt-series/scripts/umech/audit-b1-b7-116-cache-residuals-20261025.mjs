// CPU metadata-only independent validation; never imports Blender or changes gates.
import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));
const input=W+'outputs/axes-20261023/b1-b7-cache-coherency-diagnostic-20261025.json';
const out=W+'outputs/axes-20261023/b1-b7-116-derived-cache-residuals-independent-20261025.json';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(sha(input),'a006d93ca3a572a94694f580590315dcd0558a468a52a453658ff7f1e7c21a41');
const m=JSON.parse(fs.readFileSync(input)),first=m.stages[0].probe,last=m.stages.at(-1).probe;
const view=new DataView(new ArrayBuffer(4));
const bits=x=>{view.setFloat32(0,x,false);assert.equal(view.getFloat32(0,false),x);return view.getUint32(0,false);};
const rows=last.objects.filter(r=>!r.coherentWithinOriginalTolerance).map(r=>({name:r.name,
 worldVersusEvaluatedWorld:r.deltas.worldVersusEvaluatedWorld,
 differingCells:r.matrixWorld.flatMap((v,i)=>v===r.parentWorldTimesInverseTimesBasis[i]?[]:[
  {matrixFlatIndex:i,actualWorld:v,recomputedParentInverseBasis:r.parentWorldTimesInverseTimesBasis[i],
   absoluteDifference:Math.abs(v-r.parentWorldTimesInverseTimesBasis[i]),binary32ULPDistance:Math.abs(bits(v)-bits(r.parentWorldTimesInverseTimesBasis[i]))}])}));
assert.deepEqual(rows.map(r=>r.name),['kai_mitt','kai_thumb']);
assert(rows.every(r=>r.differingCells.length===1&&r.differingCells[0].binary32ULPDistance===1&&r.worldVersusEvaluatedWorld===0));
assert(last.objects.every(r=>r.deltas.worldVersusEvaluatedWorld===0));
const before=first.objects.find(r=>r.name==='hand_kai'),after=last.objects.find(r=>r.name==='hand_kai');
assert(before.deltas.worldVersusParentInverseBasis>5);assert.equal(after.deltas.worldVersusParentInverseBasis,0);
assert(Object.values(m.protectionChecks).every(v=>v===true));
assert(m.pythonWrapperIdentityOnlyDiagnostic.sameRNAPointers===true&&m.pythonWrapperIdentityOnlyDiagnostic.sameViewLayerWrapperIs===false);
const report={episode:'B-1',reviewer:'/root/b1_final_cpu_preflight',createdAt:new Date().toISOString(),input,inputSha256:sha(input),
 method:'Independent CPU binary32 bit-distance analysis of actual116 metadata; no Blender execution',
 stages:m.stages.map(s=>({stage:s.name,incoherentNames:s.probe.incoherentNames})),residualRows:rows,
 handRootStaleErrorBefore:before.deltas.worldVersusParentInverseBasis,handRootErrorAfter:after.deltas.worldVersusParentInverseBasis,
 actualWorldEqualsEvaluatedWorldForEveryTargetExactly:true,all7ActualDiagnosticProtectionChecksPass:true,
 diagnosis:'Residual derived-equation differences each occupy exactly one IEEE754 binary32 ULP in one translation component. This is consistent with floating-point matrix recomputation order, not evidence that a preserved channel changed. The specific Blender multiplication implementation was not independently inspected.',
 distinction:'Diagnostic parent@inverse@basis arithmetic is not the original restoration comparison. Original saved-actual-world versus restored-actual-world must retain its1e-9 threshold; no threshold or original NG result is changed by this receipt.',
 contextIdentity:{RNApointerNameOwnerFrameMatch:true,PythonWrapperIsFalse:true,wrapperIdentityIsNotRNADatablockIdentity:true},
 recommendedNext:'NEW transparent adapter may normalize B-owned hidden dependency caches before capture and after channel restoration, then execute the original strict before/after actual-matrix comparison. Actual audit/probe and eighteen source-control comparisons remain pending.',
 oldStrictAuditFailureRetained:true,automaticGateExemption:false,originalThresholdsChanged:false,
 BlenderCalls:0,renders:0,actualImageEyesPerformedForThisMetadataReceipt:false,finalAcceptance:false,
 writerSha256:sha(fileURLToPath(import.meta.url))};
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:out,sha256:sha(out),residualCount:rows.length,eachExactlyOneBinary32ULP:true,finalAcceptance:false},null,2));
