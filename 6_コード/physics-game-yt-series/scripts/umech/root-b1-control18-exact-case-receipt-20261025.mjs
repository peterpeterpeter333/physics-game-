// Root alone invokes AFTER personally viewing all three actual pair sheets.
// Approval is limited to these exact18 files, not a general raster tolerance.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';import path from'node:path';
assert(process.argv.includes('--root-personally-viewed-all18-pairs'));
const out=process.argv.find(x=>x.startsWith('--out='))?.slice(6);assert(out&&!fs.existsSync(out));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const sum='/private/tmp/ys/ys-chain-b1v1-b7-all18-controls-diagnostic-20261025/diagnostic-summary.json',s=read(sum);
const contact='/private/tmp/ys/ys-chain-b1v1-b7-control18-pair-contacts-20261025/manifest.json';
assert.equal(sha(contact),'6cac75ee7207375093ae9b5e5ec1f522c8fa45c8a90551ff89ec3cc157d15a53');
const c=read(contact);assert.equal(c.summarySha256,sha(sum));assert.equal(s.all36StrictTransactionGuardsPass,true);
assert.equal(s.geometryRepairOrActualNeedleProbeInvoked,false);assert.equal(s.actualImageCount,36);
for(const p of c.pages)assert.equal(sha(p.file),p.sha256);
const reports=s.passes.map(p=>{assert.equal(sha(p.report),p.reportSha256);return read(p.report);});
assert.equal(reports.length,2);assert(s.repeatedControlComparisons.every(r=>r.exactInputStateDigestEqual));
const metadata=s.passes.map(p=>path.join(path.dirname(p.report),'diagnostic-metadata.json'));
const metas=metadata.map(read),cases=[];
for(let j=4124;j<=4141;j++){
 const a=reports[0].actualImages.find(r=>r.frame===j),b=reports[1].actualImages.find(r=>r.frame===j);
 for(const r of[a,b]){assert.equal(sha(r.path),r.sha256);assert.equal(sha(r.source),r.sourceSha256);}
 assert.equal(a.source,b.source);assert.equal(a.sourceSha256,b.sourceSha256);
 const q=reports[1].comparisonRows.find(r=>r.frame===j),r=s.repeatedControlComparisons.find(r=>r.frame===j);
 const states=metas.map(m=>m.supplementalWindowControlPolicy.controlStateProofs.find(r=>r.frame===j));
 assert.equal(states[0].beforeInputStateSha256,states[1].beforeInputStateSha256);
 assert.equal(r.firstInputStateSha256,states[0].beforeInputStateSha256);assert.equal(r.secondInputStateSha256,states[1].beforeInputStateSha256);
 assert(reports.every(p=>p.comparisonRows.find(r=>r.frame===j).quantizationExactlyEqual));
 cases.push({frame:j,sourcePath:b.source,sourceSha256:b.sourceSha256,pass1Path:a.path,pass1Sha256:a.sha256,
  pass2Path:b.path,pass2Sha256:b.sha256,beforeInputStateSha256:states[1].beforeInputStateSha256,
  pass2OriginalFullImageZeroDifferencePass:q.originalFullImageZeroDifferencePass,repeatedInputStateDigestEqual:true,
  actualRootPairViewed:true,approvedForFrozenControlReuse:true,
  unchangedOriginalComparison:q,repeatComparison:r.comparison});
}
const result={episode:'B-1',purpose:'root-approval-of-exact-137-frozen-control18-cases-only',actualViewer:'root',
 reviewedAll18HistoricalAndPass2Pairs:true,reviewedImageCount:36,
 originalGeometryHelperSha256:'d1736e949348256273198cc181bfc2abe42125f9b8139b8bb466867dc8bc1e54',
 actualRuntimeDiagnosticSha256:'69c657e35b6f6c1c121d927b6094eb3aa01f2c7db8bbe917433552296863f3e1',
 historicalVersusCurrentDifferenceCause:'not-established',noGeneralRasterToleranceGranted:true,
 reuseExactlyApprovedPass2Controls:true,requireSeparateAll18ActualRepairImageApproval:true,
 context2Criterion:'same-authoritative-source-input-and-geometry; actual18 eyes pending; RGB0 retained',
 diagnosticSummary:{path:sum,sha256:sha(sum)},diagnosticPassReports:s.passes.map((p,i)=>({pass:p.pass,path:p.report,sha256:p.reportSha256,metadataPath:metadata[i],metadataSha256:sha(metadata[i])})),
 cases,actuallyViewedContactManifest:contact,actuallyViewedContactManifestSha256:sha(contact),
 actuallyViewedContactPages:c.pages.map(p=>({...p,actuallyViewed:true})),
 viewingScope:'Root personally viewed all36 actual images as the18 historical-left/pass2-right pairs on three sheets; not individual full-resolution viewing of all36 files',
 findings:'No visible changes to the rock, needles, hand or camera between historical and control pairs. Numerical differences remain recorded, including false RGB0/r2 results. Their historical cause is not established. New same-input repeated renders also differ slightly; this is not used as a blanket cause or tolerance.',
 actualNeedleRepairImagesViewed:false,earListeningPerformed:false,finalAcceptance:false};
fs.writeFileSync(out,JSON.stringify(result,null,1)+'\n',{flag:'wx'});console.log(JSON.stringify({receipt:out,sha256:sha(out),exactCases:cases.length}));
