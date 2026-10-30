// Record completed actual-image peer review only; no render or approval.
import fs from 'node:fs';
import crypto from 'node:crypto';
const base='/private/tmp/ys/ys-chain-b1v1-final2-20261024';
const dir=base+'/actual-mp4-review';
const manifestPath=dir+'/manifest.json';
const out=base+'/d1-peer-b1-final2-first-half-20261024.json';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(fs.existsSync(out))throw new Error('Keep prior peer-review evidence');
const manifest=JSON.parse(fs.readFileSync(manifestPath));
const frames=manifest.halfSeconds.frames.filter(r=>r.time<=179.5);
if(frames.length!==360||frames.some((r,i)=>r.time!==i*.5))throw new Error('Expected every half second 0..179.5');
const observations=[
 '0–29.5秒。箱の開閉・針・星の点線・地図を実視認。行3の物理得点板の左0は箱の開いた蓋で隠れる。上の2D得点札は読める。',
 '30–59.5秒。磁石島・船乗りとニンニク・ギルバートを実視認。51/51.5秒は人形へ安全にcutしており、旧木目だけの移動は解消。',
 '60–89.5秒。ニンニクをこする手と白い跡、くぎ3本の移動、2本の棒磁石を実視認。くぎは75秒以後磁石に接している。',
 '90–119.5秒。N/Sの引合い、N/N接近後の反転とS/N接触を実視認（個別N2指示どおり）。風見鶏の頭が右から来る風へ向く修正を確認。箱・風見鶏の場面移動で木目だけにはならない。',
 '120–149.5秒。122秒のごつごつ石の右端clipを確認し、個別フル解像度でも再確認した。122.5秒には石全体が入る。球への変形、針の配置と向きの変化、全画面ミオを実視認。',
 '150–179.5秒。赤白針の傾き、粉の散乱→磁力線、N/S札を実視認。168秒をフル解像度でも確認し、左右の粉の線は完全に画内、旧field clipは解消。'
];
const pages=Array.from({length:36},(_,i)=>{
 const path=dir+'/half-seconds-'+String(i+1).padStart(2,'0')+'.jpg';
 if(manifest.halfSeconds.pages[i]!==path)throw new Error('Unexpected review page');
 return {page:i+1,path,sha256:sha(path),firstSecond:i*5,lastSecond:i*5+4.5,frames:10,actuallyViewed:true,observation:observations[Math.floor(i/6)]};
});
const enlarged=[13,122,168].map(t=>{
 const r=frames.find(r=>r.time===t);
 return {...r,sha256:sha(r.file),actuallyViewedIndividually:true};
});
const qualityPath=base+'/validation-final-v1/quality-gate.json';
const quality=JSON.parse(fs.readFileSync(qualityPath));
const result={
 reviewer:'D-1 agent, independent B-1 candidate2 front-half actual-image peer QA',
 recordedAt:new Date().toISOString(),
 status:'Review complete for this 360-frame scope only; B2 is NOT final accepted',
 video:manifest.video,videoSha256:manifest.videoSha256,
 manifest:manifestPath,manifestSha256:sha(manifestPath),
 scope:{startSecond:0,endSecond:179.5,stepSeconds:.5,actualFrames:360,pages:36,allListedPagesActuallyViewed:true},
 sourceInstruction:'/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/B-1/B-1_制作指示書.md',
 sourceInstructionFullyRead:true,
 actualImagesAreFromEncodedMp4:true,svgOrRawReconstruction:false,
 originalQualityGate:{path:qualityPath,sha256:sha(qualityPath),pass:quality.pass,results:quality.results},
 originalGateNGPreserved:true,originalInspectorModified:false,blanketWaiver:false,
 findings:[
  {id:'B2-score-left-zero-occluded',kind:'Unresolved known real occlusion, not a new duplicate finding',cue:'open:who',row:3,observedHalfSeconds:[13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19],evidence:enlarged.find(r=>r.time===13),observation:'Physical score board left 0 is hidden behind the open compass-box lid. Both names and experiment 0 are visible; the separate 2D 0–0 card is readable. This is a real physical-part occlusion, not an original 7b proxy conflict.',suggestion:'Keep box and score legible by a small board offset or camera correction; do not change scores/caption/script.'},
  {id:'B2-rock-entry-right-clip',kind:'New remaining real brief camera-entry clip',cue:'terrella:idea',row:17,time:122,evidence:enlarged.find(r=>r.time===122),observation:'The rough stone is already visible but its right flank extends beyond the frame at 122.0 seconds. Its center/body remain visible, so it is not a blank frame. At 122.5 seconds the full stone fits.',suggestion:'Include this entry state in the camera-only actual-geometry guard and use the next-site safe camera from the cut; do not alter the stone state or spoken timing.'}
 ],
 verifiedCorrections:[
  {times:[51,51.5],what:'Gilbert entry shows the doll rather than only desk wood.'},
  {times:[108.5,109,109.5],what:'Vane head faces the incoming wind from screen right.'},
  {times:[165,168,169,171,175,179.5],what:'The field-line pattern is fully within both side edges; no old field crop remains in these actual frames.'}
 ],
 knownOutOfScopeDefect:'Root reported the later B2 challenge white half-needle visibility issue; it is not in this front-half scope and has not been personally reviewed here.',
 pages,enlarged,frames:frames.map(r=>({...r,sha256:sha(r.file),actuallyViewedInContactSheet:true})),
 notConfirmed:['180 seconds onward is assigned to E agent, not claimed by this record','All 30fps intermediate frames between 0.5-second samples','B3 replacement candidate actual MP4','Any actual-ear listening','Final acceptance or specific original 7/7b supplemental approval'],
 gpuOrHeavyCpuExecuted:false,sourceModified:false,finalAcceptance:false
};
fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,sha256:sha(out),pages:pages.length,frames:frames.length,findings:result.findings.map(r=>r.id),finalAcceptance:false}));
