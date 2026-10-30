// Record the D1 reviewer's completed HUMAN inspection, not a visual classifier.
// Reads existing B media/evidence only; never changes original results or media.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const base='/private/tmp/ys/ys-chain-b1v1-final-20261024',dir=base+'/actual-mp4-review';
const output=base+'/d1-peer-b1-first-half-20261024.json';
if(fs.existsSync(output))throw Error('Preserve existing D1 peer evidence');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifestPath=dir+'/manifest.json',m=JSON.parse(fs.readFileSync(manifestPath));
const frames=m.halfSeconds.frames.filter(r=>r.time>=0&&r.time<=179.5);
if(frames.length!==360||frames.some((r,i)=>r.time!==i*.5))throw Error('Not every assigned half-second present');
const pages=Array.from({length:36},(_,i)=>({file:dir+'/half-seconds-'+String(i+1).padStart(2,'0')+'.jpg',start:i*5,end:i*5+4.5,actuallyViewed:true})).map(p=>({...p,sha256:sha(p.file)}));
const fullTimes=[18,108.5,109,168];
const expanded=fullTimes.map(time=>{const r=frames.find(r=>r.time===time);if(!r)throw Error('Missing enlarged frame '+time);return {...r,sha256:sha(r.file),actuallyViewedAtOriginalResolution:true};});
const frameAt=t=>frames.find(r=>r.time===t).file;
const gatePath=base+'/validation-final-v1/quality-gate.json',gate=JSON.parse(fs.readFileSync(gatePath));
const report={episode:'B-1',reviewer:'D-1 agent independent peer',recordedAt:new Date().toISOString(),candidateNotFinal:true,status:'360 assigned actual encoded images viewed; genuine findings below; NOT final acceptance',manifest:manifestPath,manifestSha256:sha(manifestPath),video:m.video,videoSha256FromExtractionManifest:m.videoSha256,scope:{start:0,end:179.5,step:.5,frames:360,pages:36,allAssignedPagesActuallyViewed:true,allAssignedHalfSecondFramesActuallyViewedInSheets:true,allFramesViewedAtFullResolution:false},pages,frames:frames.map(r=>({...r,sha256:sha(r.file),actuallyViewedInContactSheet:true})),individuallyEnlarged:expanded,
 findings:[
  {id:'B1-D1-01',priority:'causal explanation',timeRange:[108.5,114.5],cue:'rule:vane',confirmedActualVisualDefect:true,description:'The wind lines arrive from screen right, but after turning the rooster is almost edge-on / pointing toward the back rather than aligned toward that incoming wind. This weakens the spoken weather-vane analogy.',evidence:[frameAt(108.5),frameAt(109)],readOnlySourceCrossCheck:{stage:'scripts/blender/desk_b1v1.py:208',part:'scripts/blender/desk_lib_b1.py:111',wind:'scripts/blender/desk_lib_b1.py:119',fact:'Rooster head is originally along +x; stage rotates it from 0 to +70 degrees. Wind curves run from larger x to smaller x and only translate x. Therefore final heading is 70 degrees away from incoming +x.'},fixStatus:'Reported to root; no B source/media edited by peer'},
  {id:'B1-D1-02',priority:'score readability',timeRange:[13.5,19],cue:'open:who',confirmedActualVisualDefect:true,description:'The open compass-box lid completely occludes the left zero on the physical score board. At 18 s only the physical minus and right zero can be read; the earlier 2D 0-0 HUD has already faded.',evidence:[frameAt(18)],fixStatus:'Reported to root; no B source/media edited by peer'},
  {id:'B1-D1-03',priority:'diagram completeness',timeRange:[165,179.5],cue:'lines:iron / lines:follow / lines:dip',confirmedActualVisualDefect:true,description:'Outer iron-filing field lines are visibly cut at both image edges. The 168 s full-resolution frame shows outer loop arcs and some yellow arrows leaving x=0 / x=1080. This is actual clipping, not merely a low subject-width heuristic.',evidence:[frameAt(168)],fixStatus:'Reported to root; no B source/media edited by peer'}
 ],
 secondaryObservations:[
  {timeRange:[0,19],description:'The specified small ship beside the opening compass was not visible in the assigned opening sheets. The compass itself and its opening action are clear. This is a staging/specification observation, not a claim that no ship object exists in the model.'},
  {timeRange:[40.5,44],description:'Before the sailor raises the garlic to the mouth, the resting garlic is below the framing or partly clipped at the bottom. The later eating-freeze gesture around 45-50 s is clear.'}
 ],
 successfulReadingsWithinScope:[
  'The box opens, the red north-pointing end is clear, and the caption remains readable.',
  'The garlic rub leaves three pale bands; three nails subsequently slide to and attach to the magnet.',
  'N/S attraction, N/N approach, rotation away, and the intentionally subsequent S/N click can be distinguished in the half-second sequence.',
  'The stone becomes a sphere, needles are placed, and their red ends turn toward the same blue top.',
  'The iron powder visibly reorganizes into lines; N appears at the bottom before S appears at the top, consistent with the fixed spoken order.',
  'The full-screen face around 144-147.5 s has no episode-specific explanatory cards over it.'
 ],
 knownCameraFixSeparate:{status:'Root already preparing replacement of known camera movement defects; not reimplemented by this peer',observedExamples:[{time:51,file:frameAt(51)},{time:51.5,file:frameAt(51.5)}],futurePatchedCandidateMustBeReviewedAgain:true},
 originalGate:{path:gatePath,sha256:sha(gatePath),pass:gate.pass,allOriginalNGPreserved:true,originalNG:gate.results.filter(r=>r.status==='NG'),metrics:gate.metrics,automaticWaivers:false,otherGateNGNotExempted:true},
 physicalComplement:{status:'PENDING exact current all-half-second projection evidence; no numerical case acceptance claimed',oldFileRead:'/private/tmp/ys/ys-chain-b1v1/blender/physical-hero-projection-b1v1.json',oldFileSha256:sha('/private/tmp/ys/ys-chain-b1v1/blender/physical-hero-projection-b1v1.json'),whyNotUsedForAcceptance:'That file is dated Oct 23 22:52 and contains only 50 cue-end samples, including old pair width 79.3%; it is not same-time proof for this candidate.',actualImageObservation:'The plain magnets and the black sphere are visibly present despite low texture-based proxy scores. That observation does not excuse the real wind/score/field-line findings or grant a blanket 7/7b pass.'},
 notChecked:['The second half at 180 s or later','The forthcoming camera-patched final candidate','Every 30 fps in-between frame or continuous playback','Actual-ear listening and audio/event synchrony','Independent current physical projection values for each original 7/7b sample','Independent new execution of the original validators; existing original results were read without alteration'],
 gpuOrHeavyCpuStarted:false,BSourceOrMediaModified:false,finalAcceptance:false};
fs.writeFileSync(output,JSON.stringify(report,null,1));
console.log(JSON.stringify({output,sha256:sha(output),pages:pages.length,frames:frames.length,findings:report.findings.length,finalAcceptance:false},null,1));
