// Root-approved CPU slot only. These are decoded final MP4 frames, not SVGs.
// All 0.5s/1s/cue ends, moving entries, twelve comparisons, bookends, and action
// checkpoints are generated. Optional --all-patch-sources adds every new raw
// source's actual encoded frame; extraction never means a human viewed it.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const [videoArg,outArg]=process.argv.slice(2);assert(videoArg&&outArg);
const allPatchSources=process.argv.includes('--all-patch-sources');
const video=path.resolve(videoArg),out=path.resolve(outArg),cache='/private/tmp/ys/ys-chain-e1v1-final-20261024';
assert(fs.statSync(video).isFile()&&!fs.existsSync(out),'Existing MP4 and NEW review folder required');
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const exported=read(cache+'/export.json'),prepared=read(cache+'/prepared.json');
assert.equal(exported.video,video);assert.equal(sha(video),exported.sha256);assert.equal(exported.preparedSha256,sha(cache+'/prepared.json'));
const D=read(cache+'/blender/data.json'),fps=30,nf=Math.ceil(D.duration*fps);assert.equal(nf,11606);assert.equal(D.cues.length,54);
const frame=t=>Math.min(nf-1,Math.max(0,Math.round(t*fps))),at=j=>D.cues.findLast(c=>c.start<=j/fps)??D.cues[0];
const unique=a=>[...new Set(a)].sort((a,b)=>a-b);
const half=Array.from({length:Math.floor(D.duration*2)+1},(_,i)=>i*15);
const seconds=Array.from({length:Math.ceil(D.duration)},(_,i)=>i*30);
const cueEnds=D.cues.map(c=>Math.ceil(c.end*fps-1e-7)-1);
assert.equal(half.length,774);assert.equal(seconds.length,387);assert.equal(cueEnds.length,54);
const moveRecords=D.cues.filter(c=>c.move).map(c=>({cue:c.key,start:c.start,end:c.start+c.move,
 frames:unique([Math.ceil(c.start*fps-1e-7),...Array.from({length:9},(_,i)=>frame(c.start+c.move*(i+1)/10)),Math.ceil((c.start+c.move)*fps-1e-7)-1])}));
const poses=read(cache+'/blender/delivered-camera-poses.json').poses;assert.equal(poses.length,nf);
const moving=poses.map((p,j)=>j>0&&p.some((v,i)=>Math.abs(v-poses[j-1][i])>1e-9)),movingRuns=[];
for(let j=0;j<nf;j++)if(moving[j]){const r=movingRuns.at(-1);if(r&&r[1]===j-1)r[1]=j;else movingRuns.push([j,j]);}
const moveIndices=unique([...moveRecords.flatMap(r=>r.frames),...movingRuns.flatMap(([a,b])=>Array.from({length:11},(_,i)=>Math.round(a+(b-a)*i/10)))]);
const major=D.gateTimes.map(frame);assert.equal(major.length,12);
const bookends=unique([0,15,30,45,60,...[385,385.5,386,386.5].map(frame),nf-1]);
const provenance=read(cache+'/composite-provenance.json');assert.equal(provenance.records.length,nf);
const patchFrames=unique(provenance.records.filter(r=>r.actualPatchFrame!==null).map(r=>r.actualPatchFrame));
const runs=[];for(const r of provenance.records)if(r.actualPatchFrame!==null){const last=runs.at(-1);if(last&&last[1]===r.frame-1)last[1]=r.frame;else runs.push([r.frame,r.frame]);}
const checkpoints=unique([1.5,10.0666667,10.2,10.5,10.9,14,19.62,25.67,34.62,35.82,36.32,38.5,73.55,74.1666667,79.89,80.3,80.7,81.8,
 102.7,107.6,110.5,111,113.4,113.9,114.4,115.3666667,124.5,125,130.43,131.97,151.21,153.64,156.8,
 182.42,190.37,193.47,198.4,199.5,202.7666667,203,211.83,225.23,226.44,235.93,249.48,
 259.31,259.81,260.31,260.81,261.31,273.49,285.46,297.65,298.25,317.21,318.8,326.43,326.9,327.4333333,327.6,
 336.25,336.8,337.4,351,359.5,365.65,378.98,382.58,383.5,385].map(frame).concat(runs.flatMap(([a,b])=>[a,Math.round((a+b)/2),b])));
const targets=unique([...half,...seconds,...cueEnds,...moveIndices,...major,...bookends,...checkpoints,...(allPatchSources?patchFrames:[])]);
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const videoSha=sha(video),started=Date.now();fs.mkdirSync(out+'/frames',{recursive:true});
const r=spawnSync(ff,['-v','error','-xerror','-i',video,'-vf','select='+targets.map(j=>`eq(n\\,${j})`).join('+'),
 '-fps_mode','passthrough','-q:v','2',out+'/frames/shot-%04d.jpg'],{encoding:'utf8',maxBuffer:1<<25});
fs.writeFileSync(out+'/extract.log',r.stderr??'',{flag:'wx'});assert.equal(r.status,0,r.stderr);
const names=fs.readdirSync(out+'/frames').filter(n=>/^shot-\d+\.jpg$/.test(n)).sort();assert.equal(names.length,targets.length);
const byFrame=new Map(targets.map((j,i)=>[j,out+'/frames/'+names[i]]));
const item=j=>({frame:j,time:j/fps,cue:at(j).key,row:at(j).row,file:byFrame.get(j),sha256:sha(byFrame.get(j)),actuallyViewed:false});
async function sheets(kind,indices){
 const pages=[];for(let base=0;base<indices.length;base+=10){const items=[];
  for(const [i,j]of indices.slice(base,base+10).entries()){
   const label=`${(j/fps).toFixed(3)}s f${j} row${at(j).row} ${at(j).key}`;
   items.push({input:Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="white"/><text x="5" y="20" font-family="Hiragino Sans" font-size="15">${esc(label)}</text></svg>`),left:i%5*360,top:Math.floor(i/5)*668});
   items.push({input:await sharp(byFrame.get(j)).resize(360,640).toBuffer(),left:i%5*360,top:Math.floor(i/5)*668+28});
  }
  const file=out+'/'+kind+'-'+String(pages.length+1).padStart(2,'0')+'.jpg';
  await sharp({create:{width:1800,height:1336,channels:3,background:'white'}}).composite(items).jpeg({quality:94}).toFile(file);pages.push(file);
 }
 return {frames:indices.map(item),pages,pageSha256:Object.fromEntries(pages.map(p=>[p,sha(p)])),actuallyViewed:false};
}
// Match the previous approved 12-shot gate's exact reference snapshots.
const refSeconds=[1,485,14,67,186,70,49,196,253,146,286,485];
const refDir='/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/見本_1-1第6版/全コマ一覧_1秒ごと';
const comparisons=[];
for(const [i,j]of major.entries()){
 const ri=refSeconds[i],cell=ri%10,ref=refDir+'/sheet-'+String(Math.floor(ri/10)+1).padStart(2,'0')+'.jpg';
 const reference=await sharp(ref).extract({left:cell%5*360,top:Math.floor(cell/5)*662+22,width:360,height:640}).resize(540,960).toBuffer();
 const file=out+'/compare-major-'+String(i+1).padStart(2,'0')+'.jpg';
 await sharp({create:{width:1080,height:960,channels:3,background:'#000'}}).composite([{input:reference,left:0,top:0},
  {input:await sharp(byFrame.get(j)).resize(540,960).toBuffer(),left:540,top:0}]).jpeg({quality:95}).toFile(file);
 comparisons.push({file,sha256:sha(file),referenceSheet:ref,referenceSheetSha256:sha(ref),referenceSecond:ri,actualE1Frame:j,actualE1Time:j/fps,actuallyViewed:false});
}
const manifest={id:'ys-chain-e1v1',scope:'Actual encoded E r9+camera15+local2+approved action/light derivative; no SVG reconstruction or automatic eye claim',
 video,videoSha256:videoSha,fps,expectedFrames:nf,duration:D.duration,uniqueExtracted:targets.length,
 halfSeconds:await sheets('half-seconds',half),seconds:await sheets('seconds',seconds),cueEnds:await sheets('cue-ends',cueEnds),
 allMoveIntermediates:await sheets('all-moves',moveIndices),cameraMoveIntervals:moveRecords,actualMovingOutputRuns:movingRuns,
 major12:await sheets('major12',major),comparisons,bookends:await sheets('bookends',bookends),requiredActions:await sheets('required-actions',checkpoints),
 allPatchSourcesRequested:allPatchSources,allActualPatchSources:allPatchSources?await sheets('all-patch-sources',patchFrames):null,
 actualPatchSourceFrameCount:patchFrames.length,unextractedPatchSourceFrames:patchFrames.filter(j=>!byFrame.has(j)),
 provenanceSha256:sha(cache+'/composite-provenance.json'),sourceFreezeSha256:prepared.sourceFreezeSha256,
 originalGateNGPreserved:true,allActuallyViewed:false,earListeningPerformed:false,finalPassed:false,secondsElapsed:(Date.now()-started)/1000};
assert.equal(sha(video),videoSha,'MP4 changed during extraction');fs.writeFileSync(out+'/manifest.json',JSON.stringify(manifest,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,uniqueExtracted:targets.length,halfSecondPages:manifest.halfSeconds.pages.length,wholeSeconds:seconds.length,cueEnds:54,
 allMoveIntermediateSamples:moveIndices.length,comparisons:12,allPatchSourcesRequested:allPatchSources,allActuallyViewed:false,finalPassed:false}));
