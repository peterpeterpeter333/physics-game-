// Review-only repair for a CFR boundary: preserve the failed extraction and
// map its sole nonexistent last-bookend request to the actual encoded last frame.
// The original renderer, pipeline, selection, quality gates and MP4 are unchanged.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const c='/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025';
const generic='scripts/umech/desk-d1v1-review.mjs',genericSha='64a90c763c7ab2afbd621c930aa16378648cbaea04428dacc22e715184cda6b9';
const video=c+'/out-final-d1v1/ys-chain-d1v1.mp4',videoSha='c0253209e9fa83a6a8b87e6afbf764bfec2b05211d8532dc1e6e176907a3c9ee';
const failed=c+'/actual-final-required-review-v4-20261025',oldSelection=c+'/d1-final-required-selection-v4-20261025.json';
const out=c+'/actual-final-required-review-v4-endframe-20261025';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,1),{flag:'wx'});
const tree=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?tree(path.join(p,e.name)):[path.join(p,e.name)]);
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
assert(!fs.existsSync(out));assert.equal(sha(video),videoSha);assert.equal(sha(generic),genericSha);
assert.equal(sha(oldSelection),'bc8d60a16ab0bd54783b8fc2362a8261982d0197381cc4df47abe4e8d0f7ea87');
const exported=read(c+'/out-final-d1v1/d1-encode-to-review-v4-20261025.json');assert.equal(exported.videoSha256,videoSha);
const inputs={...exported.inputSha256Before,[video]:videoSha,[generic]:genericSha,[oldSelection]:sha(oldSelection),[c+'/d1-owned-resume-review-20261025.json']:sha(c+'/d1-owned-resume-review-20261025.json')};
for(const f of tree(failed))inputs[f]=sha(f);
const verify=()=>{for(const[p,h]of Object.entries(inputs))assert.equal(sha(p),h,p);};verify();
const d=read(c+'/blender/data.json'),selection=read(oldSelection),request=read(c+'/d1-supplement-requests.json');
assert.equal(d.cues.length,57);assert.equal(d.landmarks.length,12);assert.equal(selection.automaticApproval,false);
assert.equal(sha(request.originalGate),request.originalGateSha256);assert.equal(sha(request.originalFrameSamples),request.originalFrameSamplesSha256);
assert.equal(request.requestedTimes.length,546);assert(request.requestedTimes.every(t=>Math.round(t*30)<12162),'The546 physical requests must not need endpoint remapping');
const sourceCount=Math.ceil(d.duration*30);assert.equal(sourceCount,12163);
// Inspect the video-track sample count independently of rounded format metadata.
const bytes=fs.readFileSync(video);
function boxes(a,b){const rows=[];while(a<b){let size=bytes.readUInt32BE(a),header=8;const type=bytes.toString('ascii',a+4,a+8);if(size===1){size=Number(bytes.readBigUInt64BE(a+8));header=16;}if(size===0)size=b-a;assert(size>=header&&a+size<=b);rows.push({type,payload:a+header,end:a+size});a+=size;}assert.equal(a,b);return rows;}
const child=(box,name)=>{const r=boxes(box.payload,box.end).find(x=>x.type===name);assert(r,name);return r;};
const moov=boxes(0,bytes.length).find(x=>x.type==='moov');assert(moov);
const videoTrack=boxes(moov.payload,moov.end).filter(x=>x.type==='trak').find(t=>{const h=child(child(t,'mdia'),'hdlr');return bytes.toString('ascii',h.payload+8,h.payload+12)==='vide';});assert(videoTrack);
const stsz=child(child(child(child(videoTrack,'mdia'),'minf'),'stbl'),'stsz');
const encodedCount=bytes.readUInt32BE(stsz.payload+8);assert.equal(encodedCount,12162);assert.equal(sourceCount-encodedCount,1);
// Decode through EOF and independently prove the last three sequential frames.
const tailStart=sourceCount-4;
const decoded=spawnSync(ff,['-hide_banner','-nostats','-i',video,'-map','0:v:0','-an','-vf',`select=gte(n\\,${tailStart}),showinfo`,'-fps_mode','passthrough','-f','null','-'],{encoding:'utf8',maxBuffer:1e7});
assert.equal(decoded.status,0);const tail=[...decoded.stderr.matchAll(/\bn:\s*(\d+) pts:\s*(\d+) pts_time:([\d.]+)/g)].map(m=>({tailIndex:Number(m[1]),pts:Number(m[2]),time:Number(m[3])}));
assert.equal(tail.length,encodedCount-tailStart);assert(tail.every((r,i)=>r.tailIndex===i&&Math.abs(r.time-(tailStart+i)/30)<1e-6));
const last=encodedCount-1;assert.equal(last,12161);
const nonexistent=selection.requests.filter(r=>Math.round(r.time*30)>=encodedCount);assert.equal(nonexistent.length,1);assert.equal(nonexistent[0].time,405.4);
assert(nonexistent[0].reasons.includes('required-critical-tongs-straw-valve-coal-pressure-bookend'));
const mapping={requestedTime:405.4,requestedSourceFrame:12162,actualEncodedFrame:last,actualEncodedTime:last/30,timeDifferenceSeconds:1/30,reason:'Original -t405.4046667 at30fps encodes12162 frames. Review the actual encoded last frame; never substitute raw12162.',originalReasons:nonexistent[0].reasons,notACueEndRemapping:true,notAPhysicalRequestRemapping:true,actualImageEyeReviewPending:true};
const selectionFile=out+'-selection.json',diagnosis=out+'-diagnosis.json',decodeLog=out+'-ffmpeg-tail.log';
fs.writeFileSync(decodeLog,decoded.stderr,{flag:'wx'});
write(diagnosis,{episode:'D-1',helperSha256:sha(new URL(import.meta.url)),mp4:video,mp4Sha256:videoSha,expectedSourceFrames:sourceCount,containerVideoSampleCount:encodedCount,decodedFrameCount:tailStart+tail.length,actualFirstFrame:0,actualLastFrame:last,actualLastFrameTime:last/30,actualVideoDisplayEnd:encodedCount/30,nominalDuration:d.duration,nominalMinusVideoEndSeconds:d.duration-encodedCount/30,decodedTail:tail,decodeLog,decodeLogSha256:sha(decodeLog),failedExtractedJpegs:fs.readdirSync(failed+'/frames-d1v1').filter(f=>f.endsWith('.jpg')).length,missingOriginalRequest:mapping,finalSpokenCueEnd:d.cues.at(-1).end,finalCueLastRequestedFrame:Math.ceil(d.cues.at(-1).end*30-1e-7)-1,all546PhysicalRequestsRemainExact:true,maxPhysicalRequestTime:Math.max(...request.requestedTimes),reencodePerformed:false,rawImageSubstitution:false,finalAcceptance:false});
write(selectionFile,{...selection,sourceSelection:oldSelection,sourceSelectionSha256:sha(oldSelection),actualEndpointMapping:mapping,requests:selection.requests.map(r=>Math.round(r.time*30)===12162?{...r,time:last/30,reasons:[...r.reasons,'explicit-encoded-last-frame-for-requested-source12162'],originalRequestedTime:r.time,originalRequestedFrame:12162}:r)});
const r=spawnSync(process.execPath,[generic],{env:{...process.env,EM_FILM_CACHE:c,FFMPEG:ff,D1_REVIEW_MP4:video,D1_REVIEW_OUT:out,D1_SUPPLEMENT_REQUEST:selectionFile,D1_FINAL_AUDIT:''},stdio:'inherit'});
if(r.error)throw r.error;assert.equal(r.status,0);verify();
const manifestFile=out+'/d1v1-review-manifest.json',manifest=read(manifestFile),frames=new Set(manifest.frames.map(r=>r.frameIndex));
assert.equal(manifest.mp4Sha256,videoSha);assert.equal(manifest.integerSeconds,406);assert.equal(manifest.cueEnds,57);assert.equal(manifest.selectedFrames,855);
const requests=read(selectionFile).requests;assert(requests.every(r=>frames.has(Math.round(r.time*30))));
assert(d.cues.every(q=>frames.has(Math.ceil(q.end*30-1e-7)-1)));assert(d.landmarks.every(t=>frames.has(Math.round(t*30))));
assert(request.requestedTimes.every(t=>frames.has(Math.round(t*30))));assert(frames.has(last)&&!frames.has(12162));
const lastImage=manifest.frames.find(r=>r.frameIndex===last);assert(lastImage.reasons.some(r=>r.includes('explicit-encoded-last-frame')));
write(out+'/required-coverage-endframe-20261025.json',{episode:'D-1',actualMp4Sha256:videoSha,manifest:manifestFile,manifestSha256:sha(manifestFile),diagnosis,diagnosisSha256:sha(diagnosis),selection:selectionFile,selectionSha256:sha(selectionFile),sourceSelectionSha256:sha(oldSelection),helperSha256:sha(new URL(import.meta.url)),unchangedGenericReviewerSha256:genericSha,integerSeconds:406,exactCueFinalFrames:57,main12ReferencePairsPresent:true,originalPhysicalRequests:546,all546OriginalPhysicalFramesExact:true,originalPhysicalRequestsRemapped:0,oneEndpointCriticalMapping:mapping,lastActualImage:lastImage,selectedFrames:855,pages:manifest.pages.length,failedExtractionAndInputsSha256Preserved:inputs,allActuallyViewed:false,earsVerified:false,originalNGPreserved:true,finalAcceptance:false});
console.log(JSON.stringify({out,selectedFrames:855,pages:manifest.pages.length,mapping,manifestSha256:sha(manifestFile),allActuallyViewed:false,finalAcceptance:false}));
