// Actual FINAL encoded MP4 review, never a raw-preview substitute.
// Heavy ffmpeg/Sharp processing: run only after root allocates a CPU slot.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1v1-final-patched-20261024';
const patch='/private/tmp/ys/ys-chain-d1v1-camera-patch-20261024';
const old='/private/tmp/ys/ys-chain-d1v1-render';
const read=p=>JSON.parse(fs.readFileSync(p));
const merge=read(cache+'/d1-camera-merge.json'),p=read(patch+'/camera-patch-complete.json');
if(merge.frames!==12163||!p.allPatchFramesActuallyRendered||!p.allReplacementFramesPhysicalPass)throw Error('Completed derived cache and camera patch required');
const rows=[];
const existing=process.env.D1_SUPPLEMENT_REQUEST??cache+'/d1-supplement-requests.json';
if(fs.existsSync(existing)){
 const v=read(existing);if(v.episode!=='D-1'||v.automaticApproval!==false)throw Error('Evidence requests only, no pre-approval');
 rows.push(...v.requests);
}
const nf=12163;
for(const r of p.ranges){
 const frames=p.actualReplacementFrames.filter(j=>j>=r.firstFrame&&j<=r.lastFrame);
 if(!frames.length)throw Error('Missing actual entry-camera replacement '+r.cue);
 for(const j of [frames[0],frames[Math.floor(frames.length/2)],frames.at(-1)])rows.push({time:j/30,reasons:['camera-patch-first-middle-last:'+r.cue]});
}
for(const r of read(old+'/d1-semantic-physical-r15.json').rows.filter(r=>r.cameraTransition&&!r.pass))rows.push({time:Math.max(0,Math.min(nf-1,Math.round(r.time*30)))/30,reasons:['historical-moving-physical-NG:'+r.cue]});
const request=cache+'/d1-patched-actual-review-requests-20261024.json';
if(fs.existsSync(request))throw Error('Preserve existing review requests');
fs.writeFileSync(request,JSON.stringify({episode:'D-1',automaticApproval:false,kind:'actual-MP4 inspection selection, not a waiver',requests:rows},null,1));
const env={...process.env,EM_FILM_CACHE:cache,D1_FINAL_AUDIT:old+'/d1-source-audit-r15-plan-proof.json',D1_SUPPLEMENT_REQUEST:request,D1_REVIEW_OUT:process.env.D1_REVIEW_OUT??cache+'/actual-mp4-review-camera-final-20261024'};
const r=spawnSync(process.execPath,['scripts/umech/desk-d1v1-review.mjs'],{env,stdio:'inherit'});
process.exit(r.status??1);
