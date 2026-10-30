// New §13 version after trusted root's exact304-image case decisions.
// All original inspectors, previous report versions and NG metrics remain intact.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
assert(process.argv.includes('--authorized'));
const self=fileURLToPath(import.meta.url),W=fileURLToPath(new URL('../../',import.meta.url)),O=path.join(W,'outputs/axes-20261023');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const files={
 previous:path.join(O,'b1-section13-current-final5-report-data-20261025.json'),
 root304:path.join(O,'root-b1-final5-all304-named-visual-case-decisions-20261025.json'),
 eyes:path.join(O,'b1-final5-exact714-sample72-page-eyes-root253-cases-20261025.json'),
 join:path.join(O,'b1-final5-exact714-original7b-delivered-evidence-root253-cases-20261025.json'),
};
const expected={previous:'1e543e4d145ea99e30ebcc3991443ad2e5e26703ef61946c6631348bb00a8bc0',
 root304:'b28b49f98d4e4faa336d7abf503ee207f63b64236732fd50a10e1a7934db8586',
 eyes:'66c5ef63296b28a82d4c2486086a3cbc8c22b5a24c3c850178e87da13766bab1',
 join:'305814d350c9ab63c3fb6e988ee9562599eb7d869f6551c48dbdfd6def128bb5'};
const refs={};for(const[k,p]of Object.entries(files)){assert.equal(sha(p),expected[k],k);refs[k]={path:p,sha256:expected[k]};}
const previous=read(files.previous),root=read(files.root304),eyes=read(files.eyes),join=read(files.join);
assert.equal(root.actualViewer,'/root');assert.equal(root.scope.personallyViewedPages31,31);
assert.equal(root.scope.personallyViewedUniqueCells304,304);assert.equal(root.approvedNamedSupplementCases.length,253);
assert.equal(root.separateFaceAndFadeDecisions.length,51);assert(root.originalAutomated7and7bNGPreserved&&root.noGeneralWaiver);
assert(root.approvedNamedSupplementCases.every(r=>r.approvedSupplement&&r.supplementEvidenceEligible&&r.actuallyViewed&&r.reviewer==='root'&&
 ['correctPrincipal','visibleReadable','unoccluded','captionClear','geometryDefinitionAccepted'].every(k=>r[k]===true)));
assert(root.separateFaceAndFadeDecisions.every(r=>r.approvedSupplement===false&&r.underlying3DWidth40to70Waived===false));
assert.equal(join.summary.explicitRootCaseDecisions,253);assert.equal(join.summary.explicitlyViewed,714);
assert.equal(join.summary.explicitlyViewedPages,72);assert.equal(join.samples.filter(r=>r.actualEyeReview.approvedException).length,253);
assert.equal(join.finalPassed,false);assert.deepEqual(join.originalFinalGateResultsRetainedVerbatim.filter(r=>r.status==='NG').map(r=>r.no),[7,'7b']);
assert.equal(eyes.samples.length,714);assert.equal(eyes.samples.filter(r=>r.approvedSupplement).length,253);
const protectedInputSha256={...previous.protectedInputSha256,[self]:sha(self)};
for(const r of Object.values(refs))protectedInputSha256[r.path]=r.sha256;
for(const[p,h]of Object.entries(root.protectedInputSha256)){
 if(Object.hasOwn(protectedInputSha256,p))assert.equal(protectedInputSha256[p],h);
 protectedInputSha256[p]=h;
}
const closed={receipt:refs.root304,joined253Evidence:refs.join,eyes:refs.eyes,
 actualViewer:'/root',recordedBy:'/root/b1_final_cpu_preflight',actualCaseContactSheets31:31,actualUniqueCaseCells304:304,
 explicitNamedSupplementCasesAccepted253:253,separateCanonicalFaceOrFadeCasesAccepted51:51,
 rootScopeNotAll1803:true,noGenericWaiver:true,originalAutomated7and7bNGPreserved:true,
 frozenJoinPreApprovalDispositionLabelsNotRewritten:true,
 trueUnderlyingWidthFailuresRetained:[{frame:8955,time:298.5,widthRatio:0.37223906004201035,canonicalFaceOpacity:.4},
  {frame:8970,time:299,widthRatio:0.3820065978501366,canonicalFaceOpacity:1}],
 opaqueFaceAcceptanceIsNot3DWidthAcceptance:true,row36ImmutableInstructionConflictRetained:true,
 earsVerified:false,continuousPlaybackVerified:false,finalFilmAcceptanceClaimed:false};
const data={...previous,schema:'B-1-section13-current-final5-data-v2-root304-case-closure',
 snapshotUtc:new Date().toISOString(),supersedesCurrentReportingStateOnly:refs.previous,
 purpose:'NEW §13 final production data after root31-page/304-image scoped case closure; original automatic NG and immutable-source conflicts remain',
 evidence:{...previous.evidence,root304:refs.root304,root253Eyes:refs.eyes,root253Join:refs.join},
 section11Table:previous.section11Table.map(r=>({...r,currentStatus:({
  quality:'original_NG7_and_7b_preserved_253_named_proxy_cases_and51_separate_face_cases_closed',
  scale:'759_geometry_preserved_253_exact_proxy_cases_accepted_51_face_stagings_separate_two_underlying_width_failures_retained',
  sparse:'original14_5s_proxy_NG_preserved_root_named_actual_case_decisions_recorded_not_generic_gate_pass',
 }[r.id]??r.currentStatus)})),
 physical:{...previous.physical,all304CasesPendingRootNamedDecision:false,rootExactNamedCaseClosure:closed},
 visualCoverage:{...previous.visualCoverage,caseApprovals:253,separateCanonicalFaceOrFadeApprovals:51,
  all304ExactCaseDispositionsClosed:true,caseClosure:closed,rootPersonallyViewedAll1803:false},
 allFramesIndex:{...previous.allFramesIndex,root253SampleEyes:refs.eyes,root253Join:refs.join,root304CaseDecisions:refs.root304},
 rootExactNamedVisualCaseClosure:closed,
 currentlyPendingBeforeFinalAcceptance:[
  'Root final acceptance and EXCL copy to requested delivery path; no delivery claim before copy receipt',
  'Report original automated7/7b NG and source row4/row36 instruction conflicts even though exact304 visual cases are closed',
  'Final audible listening, continuous full-film playback and personal inspection of all10700 30fps frames remain unperformed and must be disclosed'],
 prior304PendingStateResolvedByExplicitNewRootReceipt:true,
 oldAll39TimingRowsAnd76WordChecksRetained:true,all34CatalogImagesRetained:true,
 originalAutomatedGatePass:false,literalAllInstructionsComplied:false,
 protectedInputSha256,rootFinalAcceptance:false,earsVerified:false,continuousPlaybackVerified:false,
 all10700FramesPersonallyViewed:false,commitOrPushPerformed:false};
for(const[p,h]of Object.entries(protectedInputSha256))assert.equal(sha(p),h,p);
const destination=path.join(O,'b1-section13-current-final5-report-data-v2-root304-20261025.json');
fs.writeFileSync(destination,JSON.stringify(data,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({file:destination,sha256:sha(destination),accepted253ExactCases:253,separate51FaceCases:51,
 noUnresolvedCasesIn304Scope:true,originalNG:[7,'7b'],allGatesPassClaimed:false,ears:false,continuous:false,rootFinalAcceptance:false}));
