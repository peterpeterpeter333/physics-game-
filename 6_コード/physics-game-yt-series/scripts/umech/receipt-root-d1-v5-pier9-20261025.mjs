// Root personally viewed all9 named raw images; not final MP4 acceptance.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';
assert.deepEqual(process.argv.slice(2),['--root-personally-viewed-all9']);
const W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';
const p='/private/tmp/ys/ys-chain-d1v1-pier-contact-images-v5-20261025/probe/report.json';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(sha(p),'4b58375cfd358900c30b68d1230255b9587185bff2f056c7f5e2b6fdb0653bde');const r=JSON.parse(fs.readFileSync(p));
assert.equal(r.helperSha256,'f518e79055a897c63d2c5a089abad0d6f8725926f9ab7032ba92d0795e81f464');
assert(r.allReplacementPhysicalPass&&r.allRequestedActuallyRendered&&Object.values(r.protectionChecks).every(v=>v===true));
const rows=[...r.actualImages,...r.newProblemRawImages,...r.newEngineCatalogImages];assert.equal(rows.length,9);
const images=Object.fromEntries(rows.map(r=>{assert.equal(sha(r.path),r.sha256);return[r.path,r.sha256];}));
const out=W+'/outputs/axes-20261023/root-d1-v5-pier9-actual-probe-approval-20261025.json';
const receipt={approved:true,actualViewer:'root',helperSha256:r.helperSha256,probeReport:p,probeReportSha256:sha(p),auditReportSha256:r.auditReportSha256,
 allRequiredProbeImagesPersonallyViewed:true,viewedImageCount:9,reviewedImageSha256:images,
 actualViews:rows.map(r=>({path:r.path,sha256:r.sha256,actuallyViewed:true,actualViewer:'root',viewingResolution:'original1080x1920'})),
 findings:['The raised wooden support contacts the underside of the existing axle without moving the axle or lowering the beam.',
 'All5 delivered-source probes keep the original model, piston, rope and camera content. Two Fuji copies retain their source assembly offsets.',
 'Both catalog views show the existing beam and cylinder clearly; the pier fills the former axle gap. No new model part has been added.',
 'Both problem raw pictures retain the two-altitude arrangement; answer arrows remain distinct. Final canonical labels still require the unmodified problem composer.'],
 originalFailed103ProbeNotReused:true,actual120StrictRecoveryRequired:true,finalProblemCompositionPending:true,
 earsVerified:false,allFilmFramesActuallyViewedHere:false,finalPassed:false,finalAcceptance:false};
fs.writeFileSync(out,JSON.stringify(receipt,null,1)+'\n',{flag:'wx'});console.log(JSON.stringify({out,sha256:sha(out),approvedProbe9:true,finalAcceptance:false}));
