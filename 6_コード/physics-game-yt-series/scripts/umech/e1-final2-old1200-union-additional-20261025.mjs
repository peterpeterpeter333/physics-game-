// NEW, one exact additional final-MP4 frame only. Frozen r3 and its manifest stay unchanged.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const W=fileURLToPath(new URL('../../',import.meta.url));
const C='/private/tmp/ys/ys-chain-e1v1-final2-meaningful-motion-20261025';
const original=C+'/actual-mp4-review-eof-20261025/manifest.json';
const old=W+'outputs/axes-20261023/e1-oldfinal-all1200-attributed-visual-review-aggregate-20261025.json';
const eof=C+'/actual-mp4-review-eof-20261025-encoded-eof-20261025.json';
const out=C+'/actual-mp4-review-old1200-union-20261025';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
const pins={
 [original]:'ac8444d30e9775c54450a17c02d108fabe6c5ac60a211727ba8ca3c41270fcde',
 [old]:'4241dc4e6dd4dd14889f8d822daa07737ae57448bb00a238d984b90236090e91',
 [eof]:'2de117efb2a1322bbc1542bb1029d3add2f96bff4124cd7bb0aae0b181a538a4'
};
const verify=()=>{for(const[p,h]of Object.entries(pins))assert.equal(sha(p),h,p);};
verify();assert(!fs.existsSync(out));
const base=read(original),prior=read(old),proof=read(eof),required=new Map();
assert.equal(base.videoSha256,'d4d4941e2afbc768c90bcb0afd1b2283d4672cb0873d70e455c316ef7aef6268');
assert.equal(sha(base.video),base.videoSha256);assert.equal(proof.mp4Sha256,base.videoSha256);
assert.equal(proof.independentFullDecodedFrameCount,11605);assert.equal(proof.independentDecodedSequenceComplete,true);
for(const v of Object.values(base))if(v&&Array.isArray(v.frames))for(const r of v.frames){
 assert.equal(sha(r.file),r.sha256);if(required.has(r.frame))assert.deepEqual(required.get(r.frame),r);else required.set(r.frame,r);
}
assert.equal(required.size,1222);assert.equal(prior.frames.length,1200);
const missing=prior.frames.filter(r=>!required.has(r.frame));assert.deepEqual(missing.map(r=>r.frame),[9849]);
const j=9849;assert(j<proof.independentFullDecodedFrameCount);
fs.mkdirSync(out,{recursive:false});fs.mkdirSync(out+'/frames');
const ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const command=['-v','error','-xerror','-err_detect','explode','-i',base.video,'-vf','select=eq(n\\,9849)','-fps_mode','passthrough','-q:v','2',out+'/frames/additional-%04d.jpg'];
const decoded=spawnSync(ff,command,{encoding:'utf8',maxBuffer:1e7});
fs.writeFileSync(out+'/extract.log',decoded.stderr??'',{flag:'wx'});assert.equal(decoded.status,0,decoded.stderr);
assert.deepEqual(fs.readdirSync(out+'/frames'),['additional-0001.jpg']);
const file=out+'/frames/additional-0001.jpg',meta=await sharp(file).metadata();
assert.equal(meta.width,1080);assert.equal(meta.height,1920);assert(!fs.lstatSync(file).isSymbolicLink());
const oldFrame=missing[0],row={frame:j,time:j/30,cue:'pen:judge',row:36,file,sha256:sha(file),actuallyViewed:false};
assert.equal(oldFrame.time,row.time);assert.equal(sha(oldFrame.file),oldFrame.sha256);
required.set(j,row);assert.equal(required.size,1223);assert(prior.frames.every(r=>required.has(r.frame)));
const result={...base,scope:'Exact frozen r3 scopes plus one separately decoded old1200 run-representative frame; no eye approval',
 uniqueExtracted:1223,parentR3Manifest:original,parentR3ManifestSha256:sha(original),parentUniqueExtracted:1222,
 oldAttributedAggregate:old,oldAttributedAggregateSha256:sha(old),oldAll1200FramesIncluded:true,
 supplementOld1200:{frames:[row],reason:'Original run-representative midpoint 9849 ceased being a representative after the contiguous repair; retain it explicitly without editing frozen reviewer.',pages:[],actuallyViewed:false},
 exactAdditionalFrameCount:1,sourceIsSameFinalMp4:true,rawSourceSubstitution:false,frameOrTimeRemapping:[],
 actualDecodeCommand:{binary:ff,args:command},eofProof:eof,eofProofSha256:sha(eof),
 extractionHelper:fileURLToPath(import.meta.url),extractionHelperSha256:sha(fileURLToPath(import.meta.url)),
 allActuallyViewed:false,earListeningPerformed:false,finalPassed:false};
verify();assert.equal(sha(base.video),base.videoSha256);
const dest=out+'/manifest.json';fs.writeFileSync(dest,JSON.stringify(result,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({manifest:dest,sha256:sha(dest),unique:1223,old1200AllIncluded:true,additionalFrame:j,additionalSha256:row.sha256,actuallyViewed:false}));
