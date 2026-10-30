// Add the exact audit dependency to the already-personally-viewed30-image receipt.
// No image/caption/audio edit and no new visual claim.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const dir='outputs/axes-20261023/',old=dir+'root-d1-v9-verified-all30-actual-probe-approval-20261025.json';
assert.equal(sha(old),'414100e06063f2b1aa756687fce80fc28c8b2096612574bab33a61953f0698c9');
const r=read(old),probe='/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v9-verified-20261025/probe/report.json',p=read(probe);
assert.equal(sha(probe),r.probeReportSha256);assert.equal(r.viewedImageCount,30);assert(r.approved&&r.allRequiredProbeImagesPersonallyViewed);
const audit='/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v9-verified-20261025/audit/report.json';
assert.equal(sha(audit),p.auditReportSha256);assert.equal(p.auditReportSha256,'d45aa03fad6f31b1c808ec274da40d3674711a8bb1bb39d8b28c743ce43b1f10');
for(const im of p.actualImages){assert.equal(sha(im.path),im.sha256);assert.equal(r.reviewedImageSha256[im.path],im.sha256);}
const out=dir+'root-d1-v9-verified-all30-actual-probe-audit-bound-approval-20261025.json';
fs.writeFileSync(out,JSON.stringify({...r,auditReportSha256:p.auditReportSha256,auditReport:audit,
 parentActualEyeReceipt:old,parentActualEyeReceiptSha256:sha(old),newVisualViewingClaim:false,
 reason:'Explicit audit SHA required by unchanged production contract; all30 actual image SHA and original root receipt still match'},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({receipt:out,sha256:sha(out)}));
