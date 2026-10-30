// Explicit root contact-sheet viewing receipt, not a computed viewing claim.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';
assert.deepEqual(process.argv.slice(2),['--root-personally-viewed-pages01-20']);
const W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';
const f='/private/tmp/ys/ys-chain-e1v1-final-nonhalf-contact-20261025/manifest.json';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(sha(f),'59cc4ab5bd12cc522f41779e3dee50efe1e1b21b2e0021c11e3956d84be107fb');
const m=JSON.parse(fs.readFileSync(f)),pages=m.pages.filter(p=>p.page<=20),frames=m.frames.filter(r=>r.contactPageNumber<=20);
assert.equal(pages.length,20);assert.equal(frames.length,200);
pages.forEach(p=>assert.equal(sha(p.file),p.sha256));frames.forEach(r=>assert.equal(sha(r.file),r.sha256));
const out=W+'/outputs/axes-20261023/root-e1-final-nonhalf-pages01-20-actual-eyes-20261025.json';
const report={episode:'E-1',actualViewer:'root',sourceManifest:f,sourceManifestSha256:sha(f),mp4:m.video,mp4Sha256:m.videoSha256,
 pages:pages.map(p=>({...p,actuallyViewed:true,actualViewer:'root'})),frames:frames.map(r=>({...r,actuallyViewed:true,actualViewer:'root',viewingMode:'360x640 cell in original-size1800px contact sheet; not individually original1080px'})),
 scope:'All200 exact non-half decoded JPEGs on pages01–20. Every cell personally inspected; no image was inferred viewed from a hash.',
 findings:['Smooth sampled camera transitions preserve globe/map/clock subjects without explanatory-object loss.',
 'The four lost ships, true versus assumed position, latitude/longitude grid,90°/10°/20°/30°/50° sequence and north-star relation are visible at the sampled exact cue/word times.',
 '24hours/360degrees and360÷24=15 appear as a timed build,9hours×15=135 matches the displayed arc. Tokyo noon/London3am and labels agree.',
 'Miniature globe survives face-reaction transition. Intentional full-screen Mio reaction at95.667 and178.467 is not a missing3D claim.',
 'Ambient scoreboard is sometimes partly cropped at a margin, but score-focused HUD and explanatory model remain readable. No new mandatory defect in these200 samples.',
 'Existing static windows11–19/309–317 elsewhere remain pending and this is NOT final-film approval.'],
 allAllocatedCellsPersonallyViewed:true,individuallyFullResolutionFramesViewed:0,earListeningPerformed:false,all30fpsHumanViewed:false,
 reusePolicy:'Future versions may inherit only exact newly decoded JPEG SHA matches; unchanged raw images alone are not proof.',finalPassed:false,finalAcceptance:false};
fs.writeFileSync(out,JSON.stringify(report,null,1)+'\n',{flag:'wx'});console.log(JSON.stringify({out,sha256:sha(out),pages:20,frames:200,finalAcceptance:false}));
