// NEW artifact only. Original546 geometry candidates join exact FINAL encoded frames.
// Existing reviewer/manifests/inspectors are never edited. No visual approval here.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const [coveragePath, out] = process.argv.slice(2);
assert(coveragePath && out && !fs.existsSync(out));
const sha = p => createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read = p => JSON.parse(fs.readFileSync(p));
const original = '/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025/d1-supplement-requests.json';
assert.equal(sha(original), '16088d186cd25ee6d7fa3fc29ad2a2aa45ffab7ddef8ae3748da5a3138e9bee8');
const source = read(original), coverage = read(coveragePath), manifest = read(coverage.manifest);
assert.equal(coverage.episode, 'D-1');
assert.equal(sha(coverage.manifest), coverage.manifestSha256);
assert.equal(sha(coverage.mp4), coverage.mp4Sha256);
assert.equal(manifest.mp4Sha256, coverage.mp4Sha256);
assert.equal(coverage.sourceFrames, 12163);
assert.equal(coverage.actualEncodedFrames, 12162);
assert.equal(source.requests.length, 546);
const previous = new Map(manifest.frames.map(r => [r.frameIndex, r]));
assert.equal(previous.size, manifest.frames.length);
const wanted = source.requests.map(r => {
  assert(Number.isInteger(r.frameIndex) && Math.abs(r.time * 30 - r.frameIndex) < 1e-7);
  assert(r.frameIndex >= 0 && r.frameIndex < coverage.actualEncodedFrames);
  return r.frameIndex;
});
assert.equal(new Set(wanted).size, 546);
assert.deepEqual(wanted,[...wanted].sort((a,b)=>a-b));
fs.mkdirSync(out, {recursive:false});
const framesDir = path.join(out, 'frames-d1v1');
fs.mkdirSync(framesDir);
const missing = wanted.filter(j => !previous.has(j));
const ffmpeg = '/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
if (missing.length) {
  // One exact n-select from the final MP4, not a raw render or a time seek.
  const selected = spawnSync(ffmpeg, ['-v','error','-i',coverage.mp4,'-vf',
    'select=' + missing.map(j => `eq(n\\,${j})`).join('+'),
    '-fps_mode','passthrough','-q:v','2',path.join(framesDir,'additional-%04d.jpg')],
    {encoding:'utf8',maxBuffer:1e7});
  assert.equal(selected.status, 0, selected.stderr);
  assert.equal(fs.readdirSync(framesDir).filter(n => n.endsWith('.jpg')).length, missing.length);
}
const missingIndex = new Map(missing.map((j,i) => [j,i+1]));
const frames = source.requests.map(r => {
  let file, reused = false;
  if (previous.has(r.frameIndex)) {
    const p = previous.get(r.frameIndex);
    const actual = path.join(path.dirname(coverage.manifest),'frames-d1v1',p.file);
    assert.equal(sha(actual), p.fileSha256);
    file = 'existing-' + String(r.frameIndex).padStart(5,'0') + '.jpg';
    fs.symlinkSync(actual, path.join(framesDir,file));
    reused = true;
  } else {
    file = 'additional-' + String(missingIndex.get(r.frameIndex)).padStart(4,'0') + '.jpg';
  }
  return {frameIndex:r.frameIndex,time:r.time,file,fileSha256:sha(path.join(framesDir,file)),
    reusedSameFinalDecodedJpeg:reused,originalReasons:r.reasons,
    actualEyeReviewPerformed:false,sourceIsFinalMp4:true,rawSourceSubstitution:false};
});
const result = {episode:'D-1',mp4:coverage.mp4,mp4Sha256:coverage.mp4Sha256,
  sourceFrames:coverage.sourceFrames,actualEncodedFrames:coverage.actualEncodedFrames,
  parentCoverage:coveragePath,parentCoverageSha256:sha(coveragePath),
  originalCandidates:original,originalCandidatesSha256:sha(original),
  frames,exactOriginal546:546,newlyExtractedActualFrames:missing.length,
  reusedSameFinalActualFrames:546-missing.length,endpointRemapping:[],
  allActualImagesFromSameFinalMp4:true,originalManifestsEdited:false,
  allImagesPersonallyViewed:false,earListeningPerformed:false,finalAcceptance:false};
const dest = path.join(out,'d1v1-additional-original546-manifest.json');
fs.writeFileSync(dest,JSON.stringify(result,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({manifest:dest,sha256:sha(dest),frames:546,newlyDecoded:missing.length}));
