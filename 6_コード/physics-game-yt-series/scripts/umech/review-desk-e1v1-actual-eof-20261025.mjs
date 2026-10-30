// Root-authorized REVIEW ONLY. Does not encode, alter, or replace any video.
// The original review source is immutable. No provisional endpoint assumption:
// actual export SHA, MP4 video stsz/stts, and an independent FULL EOF decode
// must agree BEFORE only a nonexistent terminal BOOKEND can be mapped.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {registerHooks} from 'node:module';

const args=process.argv.slice(2),plain=args.filter(a=>!a.startsWith('--'));
assert(args.includes('--authorized')&&args.filter(a=>a==='--authorized').length===1&&plain.length===2,
 'Require --authorized <ACTUAL finalMP4> <NEW review folder> [--all-patch-sources]');
assert(args.every(a=>!a.startsWith('--')||['--authorized','--all-patch-sources'].includes(a)),'Unknown review flag');
const allPatch=args.includes('--all-patch-sources');
const cache='/private/tmp/ys/ys-chain-e1v1-final-20261024',nf=11606,fps=30;
const [video,out]=plain.map(p=>path.resolve(p));
assert.equal(path.dirname(out),cache,'Review folder must be inside the exact completed E final cache');
const exists=p=>{try{fs.lstatSync(p);return true;}catch(e){if(e.code==='ENOENT')return false;throw e;}};
assert(!exists(out),'Preserve every prior review, including incomplete attempts');
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const hash=s=>createHash('sha256').update(s).digest('hex');
const write=(p,value)=>fs.writeFileSync(p,JSON.stringify(value,null,1)+'\n',{flag:'wx'});
const original=new URL('./review-desk-e1v1-delivery-20261024.mjs',import.meta.url);
const originalPin='0c0340bb966b398e14caecdd8be9b20648a0871b13941ab72e813763e211dcdc';
assert.equal(sha(original),originalPin,'Frozen original E reviewer changed');
const originalSource=fs.readFileSync(original,'utf8');
const exp=read(cache+'/export.json'),prepared=read(cache+'/prepared.json'),D=read(cache+'/blender/data.json');
assert.equal(path.resolve(exp.video),video);assert.equal(sha(video),exp.sha256);
assert.equal(exp.preparedSha256,sha(cache+'/prepared.json'));
assert.equal(exp.frames,nf);assert.equal(prepared.frames,nf);assert.equal(prepared.fps,fps);
assert.equal(Math.ceil(D.duration*fps),nf);assert.equal(D.cues.length,54);assert.equal(D.gateTimes.length,12);
const audio=read(cache+'/ys-chain-e1v1.json');
const spoken=audio.scenes.flatMap(s=>s.captions);
assert.equal(spoken.length,D.cues.length);
spoken.forEach((cap,i)=>{assert.equal(cap.start,D.cues[i].start);assert.equal(cap.end,D.cues[i].end);});
const protectedInputs=Object.fromEntries([
 fileURLToPath(original),fileURLToPath(import.meta.url),video,
 cache+'/export.json',cache+'/prepared.json',cache+'/blender/data.json',
 cache+'/ys-chain-e1v1.json',cache+'/blender/delivered-camera-poses.json',cache+'/composite-provenance.json',
].map(p=>[p,sha(p)]));
const verify=()=>{for(const[p,h]of Object.entries(protectedInputs))assert.equal(sha(p),h,p);};
const decodeLog=out+'-encoded-eof-20261025.log',diagnosis=out+'-encoded-eof-20261025.json';
assert(!exists(decodeLog)&&!exists(diagnosis),'Preserve previous EOF diagnostics');

// Independent ISO-BMFF sample-count and CFR clock evidence; not rounded duration.
const bytes=fs.readFileSync(video);
function boxes(a,b){
 const answer=[];
 while(a<b){
  assert(a+8<=b,'Truncated MP4 box header');
  let size=bytes.readUInt32BE(a),header=8;const type=bytes.toString('ascii',a+4,a+8);
  if(size===1){assert(a+16<=b);const large=bytes.readBigUInt64BE(a+8);assert(large<=BigInt(Number.MAX_SAFE_INTEGER));size=Number(large);header=16;}
  if(size===0)size=b-a;
  assert(size>=header&&a+size<=b,'Invalid MP4 box boundary');
  answer.push({type,start:a,payload:a+header,end:a+size});a+=size;
 }
 assert.equal(a,b);return answer;
}
function child(box,type){const found=boxes(box.payload,box.end).filter(v=>v.type===type);assert.equal(found.length,1,'One '+type+' box required');return found[0];}
const moovs=boxes(0,bytes.length).filter(b=>b.type==='moov');assert.equal(moovs.length,1);
const tracks=boxes(moovs[0].payload,moovs[0].end).filter(b=>b.type==='trak');
const videoTracks=tracks.filter(t=>{const h=child(child(t,'mdia'),'hdlr');return bytes.toString('ascii',h.payload+8,h.payload+12)==='vide';});
assert.equal(videoTracks.length,1,'Exactly one video track required');
const mdia=child(videoTracks[0],'mdia'),stbl=child(child(mdia,'minf'),'stbl'),stsz=child(stbl,'stsz'),stts=child(stbl,'stts'),mdhd=child(mdia,'mdhd');
assert(stsz.payload+12<=stsz.end);
const encodedCount=bytes.readUInt32BE(stsz.payload+8);
assert([nf,nf-1].includes(encodedCount),'Only full11606 or independently proven11605 is in scope');
const mdhdVersion=bytes[mdhd.payload];assert([0,1].includes(mdhdVersion));
const timescale=bytes.readUInt32BE(mdhd.payload+(mdhdVersion===1?20:12));assert(timescale>0);
const sttsEntries=bytes.readUInt32BE(stts.payload+4);assert(stts.payload+8+sttsEntries*8<=stts.end);
const sampleTiming=[];let tableCount=0;
for(let i=0;i<sttsEntries;i++){
 const offset=stts.payload+8+i*8,count=bytes.readUInt32BE(offset),delta=bytes.readUInt32BE(offset+4);
 assert(count>0&&delta>0&&BigInt(delta)*BigInt(fps)===BigInt(timescale),'Video stts is not exact30fps');
 sampleTiming.push({count,delta});tableCount+=count;
}
assert.equal(tableCount,encodedCount,'stsz and stts video counts disagree');

// Decode the WHOLE movie through EOF. showinfo precedes select so its n values
// independently prove every decoded frame index, not only three output frames.
// checksum=0 avoids unnecessary pixel CRC work; this remains a decode, not encode.
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const tailStart=encodedCount-3;
const ffArgs=['-hide_banner','-nostdin','-nostats','-xerror','-err_detect','explode','-i',video,
 '-map','0:v:0','-an','-vf',`showinfo=checksum=0,select=gte(n\\,${tailStart})`,'-fps_mode','passthrough','-f','null','-'];
const decoded=spawnSync(ff,ffArgs,{encoding:'utf8',maxBuffer:1<<26});
fs.writeFileSync(decodeLog,decoded.stderr??'',{flag:'wx'});
assert(!decoded.error,decoded.error?.message);assert.equal(decoded.status,0,'Full EOF decode failed; retain diagnostic log');
const timebase=[...decoded.stderr.matchAll(/config in time_base:\s*(\d+)\/(\d+), frame_rate:\s*(\d+)\/(\d+)/g)];
assert.equal(timebase.length,1,'One actual decoder showinfo timebase required');
const [,tbNumerator,tbDenominator,rateNumerator,rateDenominator]=timebase[0];
assert(BigInt(rateNumerator)===BigInt(fps)*BigInt(rateDenominator));
assert(BigInt(tbNumerator)*BigInt(timescale)===BigInt(tbDenominator),'Decoder and video-track timebases differ');
const decodedFrames=[...decoded.stderr.matchAll(/\bn:\s*(\d+) pts:\s*(-?\d+) pts_time:([\d.eE+\-]+)\s+duration:\s*(\d+)/g)]
 .map(m=>({frame:Number(m[1]),pts:m[2],printedTime:Number(m[3]),duration:Number(m[4])}));
assert.equal(decodedFrames.length,encodedCount,'Independent full decoded-frame count differs from stsz');
assert(decodedFrames.every((r,i)=>r.frame===i),'Independent EOF decoder sequence is incomplete');
const tail=decodedFrames.slice(-3);
assert.equal(tail.length,3);
tail.forEach((r,i)=>{
 const j=tailStart+i;assert.equal(r.frame,j);
 assert(BigInt(r.pts)*BigInt(tbNumerator)*BigInt(fps)===BigInt(j)*BigInt(tbDenominator),'Last-three PTS do not equal exact index/30');
 assert(BigInt(r.duration)*BigInt(tbNumerator)*BigInt(fps)===BigInt(tbDenominator),'Last-three duration is not exact1/30');
 assert(Math.abs(r.printedTime-j/fps)<1e-5,'Printed decoder time disagrees with exact rational PTS');
});
const last=encodedCount-1,lastCue=D.cues.at(-1),lastSpokenCueFrame=Math.ceil(lastCue.end*fps-1e-7)-1;
assert(lastSpokenCueFrame<=last&&lastCue.end<=encodedCount/fps+1e-9,
 'Reject endpoint mapping: final spoken cue would be truncated');
const mapping=encodedCount===nf?null:{
 scope:'sole terminal bookend; not a cue, half-second, integer-second, action, camera, or reference remapping',
 requestedSourceFrame:nf-1,requestedSourceTime:(nf-1)/fps,
 actualEncodedFrame:last,actualEncodedTime:last/fps,timeDifferenceSeconds:1/fps,
 reason:'Actual video-track stsz/stts and independent full EOF decode prove one absent CFR boundary frame after the complete final spoken cue',
 rawFrameSubstitution:false,reencodePerformed:false,actualImageEyeReviewPending:true,
};
verify();
write(diagnosis,{
 episode:'E-1',scope:'ACTUAL encoded EOF proof only; no actual-image eye approval',
 helper:fileURLToPath(import.meta.url),helperSha256:sha(new URL(import.meta.url)),
 mp4:video,mp4Sha256:exp.sha256,exportSha256:sha(cache+'/export.json'),
 originalSourceFrames:nf,containerVideoSampleCount:encodedCount,sttsSampleCount:tableCount,
 mdhdTimescale:timescale,videoSampleTiming:sampleTiming,
 independentFullDecodedFrameCount:decodedFrames.length,independentDecodedSequenceComplete:true,
 decoderTimebase:{numerator:tbNumerator,denominator:tbDenominator},
 exactDecodedLastThreeFrames:tail,lastEncodedFrame:last,lastEncodedTime:last/fps,
 nominalDuration:D.duration,actualVideoDisplayEnd:encodedCount/fps,
 finalSpokenCueEnd:lastCue.end,finalSpokenCueLastRequestedFrame:lastSpokenCueFrame,
 finalSpokenCueComplete:true,explicitBookendMapping:mapping,
 eofCommand:{binary:ff,args:ffArgs},decodeLog,decodeLogSha256:sha(decodeLog),
 originalReviewer:fileURLToPath(original),originalReviewerSha256:originalPin,
 protectedInputsSha256:protectedInputs,actuallyViewed:false,earsVerified:false,finalAcceptance:false,
});

// Only the bookend literal can change. The added guard only ASSERTS scopes.
const bookendBefore='const bookends=unique([0,15,30,45,60,...[385,385.5,386,386.5].map(frame),nf-1]);';
const bookendAfter='const bookends=unique([0,15,30,45,60,...[385,385.5,386,386.5].map(frame),nf-2]);';
const targetBefore='const targets=unique([...half,...seconds,...cueEnds,...moveIndices,...major,...bookends,...checkpoints,...(allPatchSources?patchFrames:[])]);';
const guardKey='physics-quest-E1-actual-EOF-review-20261025';
const targetAfter=targetBefore+`\nglobalThis[Symbol.for('${guardKey}')]({half,seconds,cueEnds,moveIndices,major,bookends,checkpoints,patchFrames,targets,allPatchSources,nf,fps});`;
assert.equal(originalSource.split(bookendBefore).length,2);assert.equal(originalSource.split(targetBefore).length,2);
let adapted=encodedCount===nf?originalSource:originalSource.replace(bookendBefore,bookendAfter);
adapted=adapted.replace(targetBefore,targetAfter);
let restored=adapted.replace(targetAfter,targetBefore);
if(encodedCount!==nf)restored=restored.replace(bookendAfter,bookendBefore);
assert.equal(restored,originalSource,'No other original review statement may differ');
const unique=a=>[...new Set(a)].sort((a,b)=>a-b);
const index=t=>Math.min(nf-1,Math.max(0,Math.round(t*fps)));
const expectedHalf=Array.from({length:774},(_,i)=>i*15),expectedSeconds=Array.from({length:387},(_,i)=>i*30);
const expectedEnds=D.cues.map(c=>Math.ceil(c.end*fps-1e-7)-1),expectedMajor=D.gateTimes.map(index);
const originalBookends=unique([0,15,30,45,60,...[385,385.5,386,386.5].map(index),nf-1]);
const expectedBookends=unique(originalBookends.map(j=>mapping&&j===nf-1?last:j));
let captured=null;
assert(!Object.hasOwn(globalThis,Symbol.for(guardKey)),'No preexisting private review guard');
globalThis[Symbol.for(guardKey)]=sets=>{
 assert.equal(captured,null,'Guard must run exactly once');
 assert.equal(sets.nf,nf);assert.equal(sets.fps,fps);assert.equal(sets.allPatchSources,allPatch);
 assert.deepEqual(sets.half,expectedHalf);assert.deepEqual(sets.seconds,expectedSeconds);
 assert.deepEqual(sets.cueEnds,expectedEnds);assert.deepEqual(sets.major,expectedMajor);
 assert.deepEqual(sets.bookends,expectedBookends,'Only verified final bookend may differ');
 const protectedScopes={halfSeconds:sets.half,integerSeconds:sets.seconds,cueEnds:sets.cueEnds,
  cameraMoveIntermediates:sets.moveIndices,major12:sets.major,importantActionCheckpoints:sets.checkpoints,
  ...(allPatch?{allActualPatchSources:sets.patchFrames}:{})};
 for(const[name,indices]of Object.entries(protectedScopes)){
  assert(indices.every(j=>Number.isInteger(j)&&j>=0&&j<encodedCount),
   'A non-bookend request is absent from the actual MP4; NO remapping allowed: '+name);
 }
 const unchangedNonBookend=unique(Object.values(protectedScopes).flat());
 const originalRequested=unique([...unchangedNonBookend,...originalBookends]);
 const absent=originalRequested.filter(j=>j>=encodedCount);
 assert.deepEqual(absent,mapping?[nf-1]:[],'Only the sole original terminal bookend may be absent');
 assert.deepEqual(sets.targets,unique([...unchangedNonBookend,...expectedBookends]));
 assert(sets.targets.every(j=>j<encodedCount));
 captured={allProtectedOriginalScopes:protectedScopes,
  allProtectedOriginalScopeSha256:Object.fromEntries(Object.entries(protectedScopes).map(([name,indices])=>[name,hash(JSON.stringify(indices))])),
  originalBookendFrames:originalBookends,actualBookendFrames:expectedBookends,
  originalRequestedFrameCount:originalRequested.length,actualRequestedFrames:sets.targets,
  absentOriginalRequests:absent,onlyBookendChanged:!!mapping,
  halfSecondRequestsRemapped:0,integerSecondRequestsRemapped:0,cueEndRequestsRemapped:0,
  importantActionRequestsRemapped:0,reference12RequestsRemapped:0,cameraRequestsRemapped:0};
};
registerHooks({load(url,context,nextLoad){
 if(url!==original.href)return nextLoad(url,context);
 assert.equal(sha(original),originalPin);
 return{format:'module',source:adapted,shortCircuit:true};
}});
const originalArgv=process.argv;
try{
 // The immutable reviewer expects TWO plain arguments first, not --authorized.
 process.argv=[process.execPath,fileURLToPath(original),video,out,...(allPatch?['--all-patch-sources']:[])];
 await import(original.href);
}finally{
 process.argv=originalArgv;delete globalThis[Symbol.for(guardKey)];
}
assert(captured,'Original target selection guard never ran');verify();
const manifestFile=out+'/manifest.json',manifest=read(manifestFile);
assert.equal(manifest.id,'ys-chain-e1v1');assert.equal(manifest.expectedFrames,nf);assert.equal(manifest.videoSha256,exp.sha256);
assert.equal(manifest.uniqueExtracted,captured.actualRequestedFrames.length);
assert.deepEqual(manifest.halfSeconds.frames.map(r=>r.frame),expectedHalf);
assert.deepEqual(manifest.seconds.frames.map(r=>r.frame),expectedSeconds);
assert.deepEqual(manifest.cueEnds.frames.map(r=>r.frame),expectedEnds);
assert.deepEqual(manifest.major12.frames.map(r=>r.frame),expectedMajor);assert.equal(manifest.comparisons.length,12);
assert.deepEqual(manifest.bookends.frames.map(r=>r.frame),expectedBookends);
assert(manifest.bookends.frames.some(r=>r.frame===last),'Actual final encoded bookend missing');
assert.equal(manifest.allActuallyViewed,false);assert.equal(manifest.earListeningPerformed,false);assert.equal(manifest.finalPassed,false);
write(out+'/actual-eof-review-20261025.json',{
 episode:'E-1',mp4:video,mp4Sha256:exp.sha256,manifest:manifestFile,manifestSha256:sha(manifestFile),
 helper:fileURLToPath(import.meta.url),helperSha256:sha(new URL(import.meta.url)),
 originalReviewer:fileURLToPath(original),originalReviewerSha256:originalPin,
 inMemoryReviewerSha256:hash(adapted),inverseIsByteExactOriginal:true,
 changes:{bookendLiteralChangedOnlyIfActual11605:!!mapping,onlyExtraStatement:'Exact request-scope assertion guard; does not alter any array'},
 actualEOFProof:diagnosis,actualEOFProofSha256:sha(diagnosis),decodeLog,decodeLogSha256:sha(decodeLog),
 actualEncodedFrameCount:encodedCount,expectedSourceFrames:nf,explicitBookendMapping:mapping,
 protectedSelectionEvidence:captured,protectedInputsSha256:protectedInputs,
 originalManifestContractUnchanged:true,rawImageSubstitution:false,reencodePerformed:false,
 allActuallyViewed:false,earsVerified:false,originalNGPreserved:true,finalAcceptance:false,
});
console.log(JSON.stringify({out,manifestSha256:sha(manifestFile),actualEncodedFrames:encodedCount,
 bookendMapping:mapping,integerSeconds:387,exactCueEnds:54,halfSeconds:774,referencePairs:12,
 actualEyeReviewPending:true,finalAcceptance:false}));
