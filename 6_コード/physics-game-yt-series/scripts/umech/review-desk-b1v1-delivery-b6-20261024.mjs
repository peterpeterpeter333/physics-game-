// Actual encoded MP4 evidence only. Pixels/SHA do not constitute human review.
// Root alone authorizes this CPU decode after the final B3+B6 candidate exists.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const args=process.argv.slice(2),plain=args.filter(a=>!a.startsWith('--'));
assert(args.includes('--authorized')&&plain.length===2,'Require --authorized <actualMP4> <newReviewFolder>');
const [video,out]=plain.map(p=>path.resolve(p)),allPatch=args.includes('--all-patch-sources');
assert(fs.statSync(video).isFile());assert(!fs.existsSync(out),'Preserve existing review evidence');
const cache='/private/tmp/ys/ys-chain-b1v1-final4-20261024',fps=30,nf=10700;
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const prepared=read(cache+'/prepared.json'),exported=read(cache+'/export.json');
assert.equal(exported.video,video);assert.equal(exported.sha256,sha(video));
assert.equal(exported.preparedSha256,sha(cache+'/prepared.json'));assert.equal(exported.frames,nf);
for(const[n,h]of Object.entries(prepared.outputHashes))assert.equal(sha(cache+'/'+n),h,n);
const live=read('/private/tmp/ys/ys-chain-b1v1-retained-plan-20261024.json'),cues=live.CUES;
const data=read(cache+'/blender/data.json').b1;assert(data&&cues.length===50&&cues.length===data.cues.length);
assert(cues.every((c,i)=>c.key===data.cues[i].key&&c.start===data.cues[i].start&&c.end===data.cues[i].end));
const at=j=>cues.findLast(c=>c.start<=j/fps)??cues[0],frame=t=>Math.max(0,Math.min(nf-1,Math.round(t*fps)));
const unique=a=>[...new Set(a)].sort((a,b)=>a-b);
const half=Array.from({length:714},(_,i)=>frame(i*.5)),seconds=Array.from({length:357},(_,i)=>frame(i));
const ends=cues.map(c=>Math.min(nf-1,Math.ceil(c.end*fps-1e-7)-1));
const major=[2.7,34,75,97.6,113,142,168,185.9,235.4,259.8,294.4,354].map(frame);
const bookends=[0,.5,1,1.5,2,354,354.5,355,355.5,356,(nf-1)/fps].map(frame);
const poses=read(cache+'/blender/delivered-camera-poses.json').poses;assert.equal(poses.length,nf);
const moving=poses.map((p,j)=>j>0&&p.some((v,i)=>Math.abs(v-poses[j-1][i])>1e-9)),runs=[];
for(let j=0;j<nf;j++)if(moving[j]){const r=runs.at(-1);if(r&&r[1]===j-1)r[1]=j;else runs.push([j,j]);}
const declared=cues.filter(c=>c.move>0).map(c=>({cue:c.key,start:c.start,end:c.start+c.move,
 frames:unique(Array.from({length:11},(_,i)=>frame(c.start+c.move*i/10)))}));
const moves=unique([...declared.flatMap(c=>c.frames),...runs.flatMap(([a,b])=>Array.from({length:11},(_,i)=>Math.round(a+(b-a)*i/10)))]);
const prov=read(cache+'/composite-provenance.json');assert.equal(prov.records.length,nf);
const added=unique(prov.records.filter(r=>r.actualPatchFrame!==null).map(r=>r.actualPatchFrame));
const corrected=[1.5,5,46.5,61.5,68.09,68.3,68.49,68.7,70.35,70.75,71.15,75.5,81.2,81.6,82,
 94.6,96.8,97.08,97.43,97.5,97.6,97.65,97.83333333333333,98,98.15,98.2,98.4,98.6,99,
 115,121.6,122,122.4,122.8,127,166.9,168,171,185.9,201.3333333,202.5666667,203.4,205.4,206.8,208.2,208.6,209.4,
 228.5,249.5,256.5,288.9,294.4,298.5,305.5,316.5,318,320,329.8,332.7,339.5,348.8,349,349.5,350,351.8,355].map(frame);
const targets=unique([...half,...seconds,...ends,...major,...bookends,...moves,...corrected,...(allPatch?added:[])]);
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
fs.mkdirSync(out+'/frames',{recursive:true});const started=Date.now();
const extract=spawnSync(ff,['-v','error','-xerror','-i',video,'-vf','select='+targets.map(j=>`eq(n\\,${j})`).join('+'),
 '-fps_mode','passthrough','-q:v','2',out+'/frames/shot-%04d.jpg'],{encoding:'utf8',maxBuffer:1<<24});
fs.writeFileSync(out+'/extract.log',extract.stderr??'',{flag:'wx'});assert.equal(extract.status,0,extract.stderr);
const names=fs.readdirSync(out+'/frames').filter(n=>/^shot-\d+\.jpg$/.test(n)).sort();assert.equal(names.length,targets.length);
const files=new Map(targets.map((j,i)=>[j,out+'/frames/'+names[i]]));
const item=j=>({frame:j,time:j/fps,row:at(j).row,cue:at(j).key,file:files.get(j),sha256:sha(files.get(j)),actuallyViewed:false});
async function sheets(kind,indices){const pages=[];for(let n=0;n<indices.length;n+=10){const layers=[];
 for(const[i,j]of indices.slice(n,n+10).entries()){const label=`${(j/fps).toFixed(3)}s f${j} row${at(j).row} ${at(j).key}`;
  layers.push({input:Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="#fff"/><text x="5" y="20" font-family="Hiragino Sans" font-size="15">${esc(label)}</text></svg>`),left:i%5*360,top:Math.floor(i/5)*668});
  layers.push({input:await sharp(files.get(j)).resize(360,640).toBuffer(),left:i%5*360,top:Math.floor(i/5)*668+28});}
 const file=out+'/'+kind+'-'+String(pages.length+1).padStart(2,'0')+'.jpg';
 await sharp({create:{width:1800,height:1336,channels:3,background:'#fff'}}).composite(layers).jpeg({quality:94}).toFile(file);pages.push(file);}
 return{frames:indices.map(item),pages,pageSha256:Object.fromEntries(pages.map(p=>[p,sha(p)])),actuallyViewed:false};}
const reference='/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/完成形/1-1_女王を処刑台に送った手紙.mp4';
const refTimes=[1,94,120,184,94,226,184,226,418,418,226,488],comparisons=[];
for(const[i,j]of major.entries()){const ref=spawnSync(ff,['-v','error','-ss',String(refTimes[i]),'-i',reference,'-frames:v','1','-f','image2pipe','-vcodec','png','-'],{maxBuffer:1<<25});
 assert.equal(ref.status,0,String(ref.stderr));const title=Buffer.from(`<svg width="1080" height="40"><rect width="1080" height="40" fill="#fff"/><text x="8" y="29" font-family="Hiragino Sans" font-size="24">B3+B6 ${(j/fps).toFixed(2)}秒　　　　　見本1-1 ${refTimes[i]}秒</text></svg>`);
 const file=out+'/compare-major-'+String(i+1).padStart(2,'0')+'.jpg';await sharp({create:{width:1080,height:1000,channels:3,background:'#fff'}}).composite([
 {input:title,left:0,top:0},{input:await sharp(files.get(j)).resize(540,960).toBuffer(),left:0,top:40},{input:await sharp(ref.stdout).resize(540,960).toBuffer(),left:540,top:40}]).jpeg({quality:95}).toFile(file);comparisons.push(file);}
const missing=added.filter(j=>!files.has(j));
const result={id:'ys-chain-b1v1',candidate:prepared.candidate,scope:'Actual B3+B6 encoded MP4; no SVG reconstruction or automatic human review',video,videoSha256:sha(video),
 fps,expectedFrames:nf,duration:data.duration,uniqueExtracted:targets.length,
 halfSeconds:await sheets('half-seconds',half),seconds:await sheets('seconds',seconds),cueEnds:await sheets('cue-ends',ends),bookends:await sheets('bookends',bookends),
 cameraAndVisualCorrections:await sheets('camera-corrections',unique(corrected)),allCameraMoves:await sheets('all-moves',moves),allCameraMoveDetails:declared,actualMovingOutputRuns:runs,
 allAddedActualPatchSources:allPatch?await sheets('added-patch-sources',added):{frames:added.filter(j=>files.has(j)).map(item),notAllExtracted:true,unextractedSourceFrames:missing,actuallyViewed:false},
 major:{frames:major.map(item),comparisons,comparisonSha256:Object.fromEntries(comparisons.map(p=>[p,sha(p)])),actuallyViewed:false},
 provenanceSha256:sha(cache+'/composite-provenance.json'),preparedSha256:sha(cache+'/prepared.json'),newMixedSha256:prepared.inputReports.SFX.mixedSha256,
 original97_6SNViolationClaimWithdrawn:true,N2RecoilSpinAttachmentCheckpointFrames:[97.08,97.43,97.5,97.6,97.65,97.83333333333333,98,98.15,98.2,98.4,98.6].map(frame),
 originalGateNGPreserved:true,allActuallyViewed:false,earListeningPerformed:false,finalPassed:false,secondsElapsed:(Date.now()-started)/1000};
fs.writeFileSync(out+'/manifest.json',JSON.stringify(result,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,uniqueExtracted:targets.length,halfSecondPages:result.halfSeconds.pages.length,cueEnds:ends.length,allActuallyViewed:false,finalPassed:false}));
