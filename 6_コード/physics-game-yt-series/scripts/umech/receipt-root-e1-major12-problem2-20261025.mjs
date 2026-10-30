// Explicit root eye receipt; run only after root personally viewed all named images.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';
assert.deepEqual(process.argv.slice(2),['--root-personally-viewed-all14']);
const W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';
const f='/private/tmp/ys/ys-chain-e1v1-final-20261024/actual-mp4-review-eof-20261025/manifest.json';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
assert.equal(sha(f),'70e6a737a28eb13f9d94db8173b89f3517f181572750097e3d55934a681e3a58');
const m=JSON.parse(fs.readFileSync(f));const rows=m.comparisons.map(r=>{assert.equal(sha(r.file),r.sha256);return{...r,actuallyViewed:true,actualViewer:'root',actualSide:'RIGHT',referenceSide:'LEFT'};});
assert.equal(rows.length,12);const problem=['挑戦','答え'].map(n=>{const p='/private/tmp/ys/ys-chain-e1v1/problem/'+n+'.png';return{file:p,sha256:sha(p),actuallyViewed:true,actualViewer:'root'};});
const out=W+'/outputs/axes-20261023/root-e1-final-major12-problem2-actual-eyes-20261025.json';
const report={episode:'E-1',reviewManifest:f,reviewManifestSha256:sha(f),mp4:m.video,mp4Sha256:m.videoSha256,
 comparisons:rows,actualFrames:m.major12.frames.map(r=>({...r,actuallyViewed:true,viewedWithinNamedReferenceComparison:true,actualViewer:'root'})),problem,
 findings:['All12 reference comparisons personally viewed at original full contact-sheet size; RIGHT is actual E film, LEFT is reference.',
 'Principal models, labels, clock times and figurines are legible at these12 samples. Captions do not hide the explanatory clock/angle/route.',
 'Problem independently solved: ship noon when London10:00 means ship is2hours ahead, east30degrees. Clock picture10:00, answer arc and wording agree.',
 'clk:70 retains canonical rough2/3 estimate and explicitly notes more precise about71km; no canonical wording edited.',
 'Known static windows11–19 and309–317 remain open elsewhere; reference12 approval is not final-film approval.'],
 supplementaryConcern:'Ambient 3D scoreboard can be partly cropped at frame margins outside score-focused shots; explanatory HUD remains readable. No new correction required from these samples.',
 earsVerified:false,all30fpsHumanViewed:false,finalPassed:false,finalAcceptance:false};
fs.writeFileSync(out,JSON.stringify(report,null,1)+'\n',{flag:'wx'});console.log(JSON.stringify({out,sha256:sha(out),compared12:true,problem2:true,finalAcceptance:false}));
