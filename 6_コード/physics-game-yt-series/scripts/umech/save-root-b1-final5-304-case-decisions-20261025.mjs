// NEW serialization of explicit root personal image review and named decisions.
// The writer is not the viewer. Original inspector/source/evidence is not edited.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
assert(process.argv.includes('--authorized'));
const self=fileURLToPath(import.meta.url),W=fileURLToPath(new URL('../../',import.meta.url)),O=path.join(W,'outputs/axes-20261023');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const contact='/private/tmp/ys/ys-chain-b1v1-final5-supplement-face-case-contacts-20261025/manifest.json';
const oldEyes=path.join(O,'b1-final5-exact714-sample72-page-eyes-20261025.json');
const oldJoin=path.join(O,'b1-final5-exact714-original7b-delivered-evidence-with-eyes-20261025.json');
const actual='/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025/actual-mp4-review/manifest.json';
const pins={
 [self]:sha(self),[contact]:'f05a116f28ecac47e8343e67596a81cfe1e78338e94c562ba74638ee54fd836f',
 [oldEyes]:'59868931ddc95cf82fedaea35c8afb08c9fbfc62b8c5fc28df3345657a5d65a2',
 [oldJoin]:'b84c311b30ee7553e952c7e6a8def7ce5a695c29c528b25e91afda7fccb0a5a9',
 [actual]:'2f8bb0a84771ae36c141f1c69a8c4d19129f0a40c911331d8a4071a2ca874f8c',
};
const verify=()=>{for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);};verify();
const contacts=read(contact),prior=read(oldEyes),joined=read(oldJoin),manifest=read(actual);
const mp4Sha='6780889510a3d881ec446a58627325edf00cd0b43206c7f8b61c166c270ca1d2';
assert.equal(contacts.video.sha256,mp4Sha);assert.equal(prior.mp4Sha256,mp4Sha);assert.equal(manifest.videoSha256,mp4Sha);
assert.equal(sha(manifest.video),mp4Sha);pins[manifest.video]=mp4Sha;
assert.equal(contacts.rows.length,304);assert.equal(contacts.pages.length,31);
const frameMap=new Map(joined.samples.map(r=>[r.actualMp4Frame,r]));
for(const p of contacts.pages){assert.equal(sha(p.file),p.sha256);pins[p.file]=p.sha256;}
for(const r of contacts.rows){
 assert.equal(sha(r.jpeg),r.jpegSha256);pins[r.jpeg]=r.jpegSha256;
 const base=frameMap.get(r.frame);assert(base);assert.equal(base.actualJpegSha256,r.jpegSha256);
 assert.equal(base.supplementEvidenceEligible,r.supplementEvidenceEligible);
 assert.equal(base.physical.widthRatio,r.physicalWidthRatio);assert.deepEqual(base.physical.box,r.physicalBox);
 assert.equal(base.physical.within40to70,r.within40to70);assert.equal(base.physical.clipped,r.clipped);
 assert.deepEqual(base.physical.principalIdentity,r.physicalPrincipalIdentity);assert.deepEqual(base.compositeFaceHint,r.compositeFaceHint);
}
const eligible=contacts.rows.filter(r=>r.supplementEvidenceEligible),faces=contacts.rows.filter(r=>r.compositeFaceHint.kind.startsWith('full_screen_face'));
assert.equal(eligible.length,253);assert.equal(faces.length,51);
assert.equal(new Set([...eligible,...faces].map(r=>r.frame)).size,304);
const namedGroups={score:'compass plus physical scoreboard',star:'star plus compass',pair:'two interacting magnetic bars',
 vane:'weather vane plus compass',garlic:'magnet plus nails plus garlic',terrella:'rock or sphere',
 predict:'prediction disk',meter:'needle plus scale',undefined:'book plus physical scoreboard',mystery:'cutaway disk'};
const pageFor=j=>contacts.pages.find(p=>p.frames.includes(j));
const mapRow=r=>({frame:r.frame,time:r.time,actualJpeg:r.jpeg,actualJpegSha256:r.jpegSha256,
 contactPage:pageFor(r.frame).file,contactPageSha256:pageFor(r.frame).sha256,
 actualViewer:'/root',reviewer:'root',actuallyViewed:true,
 originalPhysicalPrincipal:r.physicalPrincipalIdentity,
 namedPrincipalDefinition:namedGroups[r.physicalPrincipalIdentity.group]??`unchanged physical principal group: ${r.physicalPrincipalIdentity.group}`,
 physicalWidthRatio:r.physicalWidthRatio,physicalBox:r.physicalBox,physicalWithin40to70:r.within40to70,
 physicalClipped:r.clipped,originalNumericStatusNeverReplaced:true});
const approved=eligible.map(r=>({...mapRow(r),supplementEvidenceEligible:true,approvedSupplement:true,
 correctPrincipal:true,visibleReadable:true,unoccluded:true,captionClear:true,geometryDefinitionAccepted:true,
 unintendedOcclusionAbsent:true,intentionalHandContactNotClassedAsUnintendedOcclusion:true,
 decisionScope:'Only this exact named final JPEG/physical-box pair: original proxy-feature discrepancy; not a numeric-gate rewrite or general threshold exception'}));
const faceDecisions=faces.map(r=>({...mapRow(r),supplementEvidenceEligible:false,approvedSupplement:false,
 compositeFaceHint:r.compositeFaceHint,classification:r.compositeFaceHint.kind,
 canonicalFaceOrFadeActuallyViewed:true,canonicalFaceStagingAccepted:true,visibleReadable:true,captionClear:true,
 underlying3DWidthNotEvaluatedAsFaceSize:true,underlying3DWidth40to70Waived:false,
 truePhysicalWidthOutside40to70Preserved:!r.within40to70,
 decisionScope:'Separate actual canonical full-screen face/fade staging decision; not a supplement approval or underlying 3D width waiver'}));
assert.deepEqual(faceDecisions.filter(r=>r.truePhysicalWidthOutside40to70Preserved).map(r=>r.frame),[8955,8970]);
const receiptFile=path.join(O,'root-b1-final5-all304-named-visual-case-decisions-20261025.json');
const receipt={episode:'B-1',candidate:'final5-carry',mp4:manifest.video,mp4Sha256:mp4Sha,
 actualViewer:'/root',reviewer:'root',recordedBy:'/root/b1_final_cpu_preflight',
 attributionBasis:'Explicit trusted root message: personally displayed all31 cases-01..31 contact pages via view_image, all304 actual JPEG cells; writer did not perform these new views',
 scope:{personallyViewedPages31:31,personallyViewedUniqueCells304:304,eligibleProxyDiscrepancyCases253:253,separateCanonicalFaceOrFadeCases51:51,
 notClaimThatRootPersonallyViewedAll1803:true,notContinuousPlaybackOrAll10700Frames:true},
 contactManifest:{file:contact,sha256:pins[contact]},pages:contacts.pages.map(p=>({...p,newPersonallyViewed:true,actualViewer:'/root',caseDecisionsPending:false})),
 approvedNamedSupplementCases:approved,separateFaceAndFadeDecisions:faceDecisions,
 retainedNotes:[
  'Early garlic waiting-stage visibility remains an existing optional P3, not a new required repair.',
  'Frame8955 at298.5s has scheduled face opacity0.4 and frame8970 at299s full face. Both actual composites readable; underlying width37.2239/38.2007% remains outside40–70.',
  'Row36 canonical full-screen face versus requested cutaway/question-mark visibility is an immutable-source instruction conflict, not literal compliance.'
 ],
 originalAutomated7and7bNGPreserved:true,originalNumericThresholdsUnchanged:true,noGeneralWaiver:true,
 all304CaseDispositionsClosedWithinExplicitScope:true,allOriginalGatesPass:false,literalAllInstructionsCompliance:false,
 earsVerified:false,continuousPlaybackVerified:false,finalFilmAcceptanceClaimed:false,
 protectedInputSha256:pins};
fs.writeFileSync(receiptFile,JSON.stringify(receipt,null,1)+'\n',{flag:'wx'});
const receiptSha=sha(receiptFile),approvedByFrame=new Map(approved.map(r=>[r.frame,r]));
const samples=prior.samples.map(old=>{
 const d=approvedByFrame.get(old.frame);if(!d)return structuredClone(old);
 assert.equal(old.actualJpegSha256,d.actualJpegSha256);
 return{...old,reviewer:'root',actualViewer:'/root',actuallyViewed:true,
  priorAttributedSampleEyeEvidence:structuredClone(old),
  additionalRootNamedCaseDecision:{receipt:receiptFile,receiptSha256:receiptSha,contactPage:d.contactPage,contactPageSha256:d.contactPageSha256},
  approvedSupplement:true,correctPrincipal:true,visibleReadable:true,unoccluded:true,captionClear:true,geometryDefinitionAccepted:true,
  approvedPhysicalPrincipal:d.originalPhysicalPrincipal,approvedPhysicalBox:d.physicalBox,
  approvedNamedPrincipalDefinition:d.namedPrincipalDefinition,
  approvalIsExactNamedProxyDiscrepancyCaseNotGeneralGateWaiver:true};
});
assert.equal(samples.length,714);assert.equal(samples.filter(r=>r.approvedSupplement).length,253);
assert.equal(samples.filter((r,i)=>JSON.stringify(r)!==JSON.stringify(prior.samples[i])).length,253);
for(let i=0;i<samples.length;i++)if(!approvedByFrame.has(samples[i].frame))assert.deepEqual(samples[i],prior.samples[i]);
const eyes={...prior,samples,pages:structuredClone(prior.pages),
 supersedesOnly253CaseDecisionFields:{previousEyes:oldEyes,previousEyesSha256:pins[oldEyes],receipt:receiptFile,receiptSha256:receiptSha,
  exactly253SamplesChanged:true,remaining461SampleAttributionsUnchanged:true,all72PageAttributionsUnchanged:true,
  previous253AttributionsRetainedInsideEachReplacement:true},
 separate51FaceOrFadeCaseReceipt:{file:receiptFile,sha256:receiptSha,
  notInsertedAsApprovedSupplement:true,underlying3DWidthNotWaived:true},
 noAutomaticSupplementOrOriginalGateWaiver:true,all253ApprovalsExplicitRootActualCaseDecisions:true,
 original7and7bNGUnchanged:true,earsVerified:false,continuousPlaybackViewed:false,finalAcceptance:false};
const eyesFile=path.join(O,'b1-final5-exact714-sample72-page-eyes-root253-cases-20261025.json');
verify();fs.writeFileSync(eyesFile,JSON.stringify(eyes,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({receipt:receiptFile,receiptSha256:receiptSha,eyes:eyesFile,eyesSha256:sha(eyesFile),approvedSupplementCases:253,separateCanonicalFaceCases:51,originalNGUnchanged:true,finalAcceptance:false}));
