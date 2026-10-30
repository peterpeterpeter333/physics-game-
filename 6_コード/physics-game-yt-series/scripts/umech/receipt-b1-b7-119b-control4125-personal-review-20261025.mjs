// Scope is exactly the two full-resolution control images personally displayed.
import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';import{fileURLToPath}from'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));
const input=W+'outputs/axes-20261023/b1-b7-119b-control-rgb-distribution-20261025.json';
const out=W+'outputs/axes-20261023/b1-b7-119b-control4125-personal-eyes-20261025.json';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(sha(input),'700a69f25be60a0893a3c20a01f154d9c6e33252e6742280e2c5041a4935b737');
const diff=JSON.parse(fs.readFileSync(input)),r=diff.rows.find(r=>r.frame===4125);
assert(r);assert.equal(r.changedPixelCount,150);assert.equal(r.maximumAbsoluteChannelDifference,2);
assert.deepEqual(r.changedPixelBoxInclusive,[895,8,911,96]);assert(r.exactChangedPixelValuesIfAtMost500.every(p=>p.y<110));
for(const[p,h]of[[r.left,r.leftSha256],[r.right,r.rightSha256]])assert.equal(sha(p),h);
const viewer='/root/b1_final_cpu_preflight';
const report={episode:'B-1',createdAt:new Date().toISOString(),kind:'Scoped original-size before-control pair actual eyes, not a tolerance waiver',
 actualViewer:viewer,sourceDistributionReport:input,sourceDistributionReportSha256:sha(input),
 frame:4125,time:137.5,images:[{file:r.left,sha256:r.leftSha256,role:'Original actualB3 raw source'},
  {file:r.right,sha256:r.rightSha256,role:'Actual119b replay before-control'}].map(x=>({...x,resolution:[1080,1920],actuallyViewed:true,actualViewer:viewer,displayTool:'view_image detail=original'})),
 observation:'Both complete original-size pictures were personally displayed. The stone sphere, all visible needles/meridians/base, desk and illumination have no visually observable content change. The numerical residual is confined to the bright upper-right window edge, outside the explanatory model/needles.',
 numericalEvidence:{entireImageBelowY110DecodedRGBExact:true,changedWindowPixels:150,changedPixelBoxInclusive:r.changedPixelBoxInclusive,maximumAbsoluteChannelDifference:2,
  allStrictCleanupChecksPass:diff.allStrictCleanupChecksPass,sourceQuantizationExact:r.quantizationExact},
 limitations:['No repeat-render noise-floor experiment was performed; a cause is not proved merely by small residuals.',
  'The original all-image0difference test is still NG. No result or threshold is rewritten here.',
  'This receipt is not the root acceptance of a new background-only criterion, not18before-controls, and not16repaired delivery images.',
  'No audio was played or heard.'],
 reviewConclusion:'No new explanatory-object defect observed in this exact pair; root decision on separately declared control acceptance remains required.',
 originalZeroDifferenceNGPreserved:true,rootAcceptance:false,earListeningPerformed:false,finalAcceptance:false,writerSha256:sha(fileURLToPath(import.meta.url))};
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:out,sha256:sha(out),imagesPersonallyViewed:2,originalZeroDifferenceNGPreserved:true},null,2));
