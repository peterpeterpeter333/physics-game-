// Rebind full-sample audio measurements only with exact AAC and decoded PCM
// equality. No subjective or continuous listening is inferred from checksums.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const [bReceiptPath,out]=process.argv.slice(2),O=process.cwd()+'/outputs/axes-20261023';
assert(bReceiptPath&&out&&out.startsWith(O+'/')&&!fs.existsSync(out));
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const oldPath=O+'/axes-four-delivered-audio-machine-audit-20261025.json';
assert.equal(sha(oldPath),'06b4eb69de5a0c678df9b9c84dfc28355839fa02d57213a46a4ff96e576351f4');
const old=read(oldPath),b=read(bReceiptPath);
const dPath='/private/tmp/ys/ys-chain-d1v1-width149-finalized-20261025/bounded-finalize-receipt.json',d=read(dPath);
assert.equal(b.status,'mechanical_checks_passed_visual_review_pending');
assert(b.protected_inputs_unchanged&&d.all_old_inputs_unchanged);
assert.equal(d.status,'mechanical_checks_passed_explicit_visual_review_rebinding_pending');
const destinations={
 'B-1':'/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/B-1_方位磁針は、なぜ北を向く？_映像修正版_20261025.mp4',
 'C-1':'/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/C-1_パスカルは、なぜ歯車に足し算をさせた？.mp4',
 'D-1':'/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/D-1_炭鉱の水を、蒸気はどうやってくみ出した？_映像修正版_20261025.mp4',
 'E-1':'/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/E-1_1707年、4隻の軍艦は、なぜ岩に突っ込んだ？.mp4'};
const episodes=[];
for(const e of old.episodes){
 const dest=destinations[e.episode],hash=sha(dest),m=e.audio_measurements;
 const patch=e.episode==='B-1'?b:e.episode==='D-1'?d:null;
 if(patch){
  assert.equal(hash,patch.final_file.sha256);
  assert.equal(patch.original_aac_packet_sha256,patch.final_aac_packet_sha256);
  assert.equal(patch.final_aac_packet_sha256,e.encoded_audio_packet_hash.audio_packet_payload_sha256);
  assert.equal(patch.original_pcm_f32le_sha256,patch.final_pcm_f32le_sha256);
  assert.equal(patch.final_pcm_f32le_sha256,m.decoded_pcm_f32le_sha256);
 }else assert.equal(hash,e.expected_delivery_file_sha256);
 assert(m.full_audio_decode_completed&&m.decoder_stderr!==undefined);
 assert.equal(m.nonfinite_sample_values,0);assert.equal(m.sample_clip_candidate_values_total,0);
 assert.equal(m.silence.interval_count,0);
 episodes.push({episode:e.episode,destination:dest,finalFileSha256:hash,
  fullAudioMeasurementOrigin:{path:oldPath,sha256:sha(oldPath)},
  exactFinalMovieBinding:patch?{receipt:e.episode==='B-1'?bReceiptPath:dPath,receiptSha256:sha(e.episode==='B-1'?bReceiptPath:dPath),
   originalAACPacketsEqualFinal:true,originalDecodedFloatPCMSamplesEqualFinal:true}:'Entire movie unchanged from full audio audit',
  integratedLoudnessLUFS:m.integrated_loudness_LUFS,truePeakDBFS:m.true_peak_dBFS,
  decodedSampleFrames:m.decoded_sample_frames,nonfiniteSamples:0,sampleClipCandidates:0,
  silenceBelowMinus35dBForAtLeast025Seconds:0,
  previousPeakReferenceWarningRetained:m.true_peak_above_reference_minus_1_5_dBFS,
  earListeningPerformed:false,asrPerformed:false});
}
assert.equal(episodes.length,4);
fs.writeFileSync(out,JSON.stringify({createdAt:new Date().toISOString(),episodes,
 allFourFinalAudioStreamsBoundToFullSampleMeasurements:true,
 audioProcessingApplied:false,earListeningPerformed:false,continuousListeningPerformed:false,
 limitation:'Machine decoding, timing, volume and silence checks do not establish naturalness, pronunciation or musical balance by ear.'},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,sha256:sha(out),episodes:episodes.length}));
