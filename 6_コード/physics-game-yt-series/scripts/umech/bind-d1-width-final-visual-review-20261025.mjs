// Bind existing sampled visual reviews to the header-fixed movie, only after
// complete decoded-video equivalence and original-AAC preservation succeeded.
// This adds evidence; it does not rewrite old reviews or claim listening.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const W=process.cwd(),O=W+'/outputs/axes-20261023';
const R='/private/tmp/ys/ys-chain-d1v1-width149-finalized-20261025/bounded-finalize-receipt.json';
const C='/private/tmp/ys/ys-chain-d1v1-width149-final-review-compact-20261025/manifest.json';
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const A=O+'/d1-width-final-root-pages01-16-review-20261025.json';
const B=O+'/d1-width149-visual-review-pages017-032-20261025.json';
assert.equal(sha(A),'7b2cabdd330eaf703b8029a981fbfdb6df7c2afd87fc53a0b32f3ad988155a51');
assert.equal(sha(B),'de287c039d60fcb9c1549eae5d0f449982f7dec179885c78636c66eedecc61cd');
assert.equal(sha(C),'d0fabeb36e4732aedfd655181327a7ec9d66ed6d87d6cf9c11e7e05828b6edc5');
const r=read(R),a=read(A),b=read(B),c=read(C);
assert.equal(r.status,'mechanical_checks_passed_explicit_visual_review_rebinding_pending');
assert(r.all_old_inputs_unchanged&&r.decoded_video_identical_to_prior_failed_encode&&r.no_reencode_performed);
assert(r.duration_repair.only_fixed_width_duration_fields_changed);
assert.equal(r.duration_repair.patches.length,5);
assert.equal(r.final_frame_pts.decoded_frames,12162);
assert.equal(r.final_frame_pts.decoded_framehash_receipt_sha256,r.expected_prior_decoded_sequence_sha256);
assert.equal(r.corrected_frame_pts.decoded_framehash_receipt_sha256,r.expected_prior_decoded_sequence_sha256);
assert.equal(sha(r.final_file.path),r.final_file.sha256);
assert.equal(sha(c.sourceMovie),c.sourceMovieSha256);
assert.equal(b.sourceMovieSha256,c.sourceMovieSha256);
assert.equal(r.original_aac_packet_sha256,r.final_aac_packet_sha256);
assert.equal(r.original_pcm_f32le_sha256,r.final_pcm_f32le_sha256);
assert.deepEqual([...a.pagesIndividuallyViewed,...b.pagesPersonallyViewed.map(p=>+p.pageId)],Array.from({length:32},(_,i)=>i+1));
assert.equal(a.selectedEncodedFramesViewed+b.decodedSamplesOnViewedPages,c.frames);
for(const p of c.pages)assert.equal(sha(p.file),p.sha256);
const out=path.resolve(process.argv[2]??O+'/d1-width149-final-visual-review-rebound-20261025.json');
assert(out.startsWith(O+'/')&&!fs.existsSync(out));
fs.writeFileSync(out,JSON.stringify({episode:'D-1',createdAt:new Date().toISOString(),
 status:'sampled_visual_reviews_bound_to_header_fixed_movie',
 movie:r.final_file,finalizer:{path:R,sha256:sha(R)},
 priorReviews:[A,B].map(p=>({path:p,sha256:sha(p)})),
 contactManifest:{path:C,sha256:sha(C)},selectedFrames:c.frames,contactPages:c.pages.length,
 fullDecodedVideoEquality:{frames:12162,sha256:r.expected_prior_decoded_sequence_sha256},
 nativeLastFrameDurationRestored:true,originalAacPacketsAndPcmUnchanged:true,
 sampledVisualReviewCompleted:true,allEncodedFramesPersonallyViewed:false,
 continuousPlaybackPerformed:false,earListeningPerformed:false,
 notes:['The historical reviews retain their actual source movie and dates.',
 'This explicit binding uses full decoded frame/pixel/PTS equality, not just similar contact sheets.',
 'This does not convert any original texture-based NG into PASS.']},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,sha256:sha(out),selectedFrames:c.frames}));
