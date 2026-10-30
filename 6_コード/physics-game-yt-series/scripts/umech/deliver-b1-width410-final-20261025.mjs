// Add-only delivery after attributable visual reviews and native media checks.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const W=process.cwd(),O=W+'/outputs/axes-20261023';
assert(W.endsWith('/work/physics-game-yt-series'));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
const source='/private/tmp/ys/ys-chain-b1v1-optics-v2-width410-encoded-20261025/revision.mp4';
const destination='/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/B-1_方位磁針は、なぜ北を向く？_映像修正版_20261025.mp4';
const out=O+'/b1-width410-final-delivery-copy-20261025.json';
assert(!fs.existsSync(destination)&&!fs.existsSync(out));
const expected='a7129d1cde634567ff7ca9c4f7b7230e3f2557f6ee9e33d7308a9fa8ed720308';
assert.equal(sha(source),expected);
const manifestPath='/private/tmp/ys/ys-chain-b1v1-optics-v2-width410-final-review-20261025/manifest.json';
assert.equal(sha(manifestPath),'2dd0d0439024a861d5c317d71e134500a1317890b571557ac26f12d17203a5a2');
const manifest=read(manifestPath);
assert.equal(manifest.rows.length,820);assert.equal(manifest.pages.length,41);
const rootPath=O+'/b1-width-final-root-pages001-021-review-20261025.json';
const agentPath=O+'/b1-optics-width410-final-visual-review-pages022-041-20261025.json';
const root=read(rootPath);
assert.equal(root.actuallyViewedDecodedSamples,420);assert.equal(root.movieSha256,expected);
assert.equal(sha(agentPath),'ea502aea16207f0001eb832db22699b9cfe0a01cd85bd44131f184b2c3d76220');
// Verify every reviewed page/sample still has the attributed contents.
for(const r of [...manifest.rows,...manifest.pages])assert.equal(sha(r.file),r.sha256,r.file);
const patchReceipt='/private/tmp/ys/ys-chain-b1v1-optics-v2-width410-encoded-20261025/patch-movie-receipt.json';
assert.equal(sha(patchReceipt),'e1c7a43026c5212ba24371f75db8132658463b822f16a9fa9074ab0c78e5f042');
const patch=read(patchReceipt);
assert(patch.protected_inputs_unchanged&&!patch.audio_reencoded);
assert.equal(patch.final_aac_packet_sha256,patch.original_aac_packet_sha256);
assert.equal(patch.final_pcm_f32le_sha256,patch.original_pcm_f32le_sha256);
const original='/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/B-1_方位磁針は、なぜ北を向く？.mp4';
const originalSha='6780889510a3d881ec446a58627325edf00cd0b43206c7f8b61c166c270ca1d2';
assert.equal(sha(original),originalSha);
fs.copyFileSync(source,destination,fs.constants.COPYFILE_EXCL);
assert.equal(sha(destination),expected);assert.equal(sha(original),originalSha);
const evidence={createdAt:new Date().toISOString(),source,destination,
 bytes:fs.statSync(destination).size,sha256:expected,exclusiveCopy:true,
 originalB1Preserved:true,audioUnchanged:true,scriptAndSubtitlesUnchanged:true,
 visualReview:{manifest:manifestPath,manifestSha256:sha(manifestPath),uniqueDecodedSamples:820,
  receipts:[rootPath,agentPath].map(path=>({path,sha256:sha(path)}))},
 nativeMediaReceipt:{path:patchReceipt,sha256:sha(patchReceipt)},
 originalHeuristicNGsRetained:[7,'7b'],
 earListeningPerformed:false,continuousPlaybackPerformed:false,gitUsed:false};
fs.writeFileSync(out,JSON.stringify(evidence,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,destination,bytes:evidence.bytes,sha256:expected}));
