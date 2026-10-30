// Root invokes this ONLY after the stated actual images have personally been viewed.
// This writes a scoped data receipt, never substitutes generation for visual review.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';
const arg=k=>process.argv.find(x=>x.startsWith('--'+k+'='))?.slice(k.length+3);
assert(process.argv.includes('--root-actually-viewed-all-listed-images'));
const report=arg('report'),out=arg('out'),expected=arg('report-sha256'),count=Number(arg('count'));
assert(report&&out&&!fs.existsSync(out)&&expected&&count>0);
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');assert.equal(sha(report),expected);
const r=JSON.parse(fs.readFileSync(report));assert.equal(r.mode,'probe');assert(!r.error&&!r.cleanupError);
assert(r.allReplacementPhysicalPass===true||r.allPass===true||r.allGuardedStatesPass===true);
assert(r.protectionChecks&&Object.values(r.protectionChecks).every(v=>v===true));
assert.equal(r.actualImages.length,count);const images=r.actualImages;
for(const p of images)assert.equal(sha(p.path),p.sha256);
const full=(arg('full-original-frames')??'').split(',').filter(Boolean).map(Number);
assert(full.every(j=>images.some(r=>r.frame===j))&&new Set(full).size===full.length);
const contacts=arg('contacts');let contact=null;
if(contacts){contact=JSON.parse(fs.readFileSync(contacts));assert.equal(contact.report,report);assert.equal(contact.reportSha256,expected);for(const p of contact.pages)assert.equal(sha(p.file),p.sha256);}
else assert.equal(full.length,count,'No contact evidence: each image must be individually viewed at original resolution');
const result={episode:arg('episode'),approved:true,actualViewer:'root',helperSha256:r.helperSha256,
 probeReportSha256:expected,allRequiredProbeImagesPersonallyViewed:true,viewedImageCount:count,
 reviewedImageSha256:Object.fromEntries(images.map(r=>[r.path,r.sha256])),
 individualOriginalResolutionFrames:full,contactManifest:contacts??null,contactManifestSha256:contacts?sha(contacts):null,
 actuallyViewedContactPages:contact?contact.pages.map(p=>({file:p.file,sha256:p.sha256,actuallyViewed:true})):[],
 viewingScope:contact?'Root viewed all actual listed images as contact cells and the explicitly listed frames individually at1080x1920. Not individual full-resolution viewing of every contact cell.':'Root individually viewed every listed actual image at1080x1920.',
 findings:arg('findings')??'',actualEncodedFinalFilmStillPending:true,earListeningPerformed:false,
 originalSourceAndInspectorFilesModified:false,originalGateNGPreserved:true,finalAcceptance:false};
fs.writeFileSync(out,JSON.stringify(result,null,1)+'\n',{flag:'wx'});console.log(JSON.stringify({receipt:out,sha256:sha(out),viewed:count}));
