// Review frames come only from the completed B3 MP4, never SVG reconstruction.
// Extraction and hashing do not claim that a human has seen a frame.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';

const [videoArg,outArg]=process.argv.slice(2);
assert(videoArg&&outArg);
const video=path.resolve(videoArg),out=path.resolve(outArg);
assert(fs.statSync(video).isFile());assert(!fs.existsSync(out),'Preserve previous review');
const cache='/private/tmp/ys/ys-chain-b1v1-final3-20261024';
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const exported=read(cache+'/export.json');
assert.equal(exported.video,video);assert.equal(sha(video),exported.sha256);
const plan=read('/private/tmp/ys/ys-chain-b1v1-retained-plan-20261024.json');
const D=read(cache+'/blender/data.json').b1,cues=plan.CUES;
assert.equal(cues.length,D.cues.length);
assert(cues.every((c,i)=>c.key===D.cues[i].key&&c.start===D.cues[i].start&&c.end===D.cues[i].end));
const fps=30,nf=Math.ceil(D.duration*fps);assert.equal(nf,10700);
const frame=t=>Math.max(0,Math.min(nf-1,Math.round(t*fps)));
const at=j=>cues.findLast(c=>c.start<=j/fps)??cues[0];
const half=Array.from({length:Math.floor(D.duration*2)+1},(_,i)=>frame(i*.5));
const seconds=Array.from({length:Math.ceil(D.duration)},(_,i)=>frame(i));
const ends=cues.map(c=>Math.min(nf-1,Math.ceil(c.end*fps-1e-7)-1));
const major=[2.7,34,75,97.6,113,142,168,185.9,235.4,259.8,294.4,354].map(frame);
const bookends=[0,.5,1,1.5,2,354,354.5,355,355.5,356,(nf-1)/fps].map(frame);
const moveDetails=cues.filter(c=>c.move>0).map(c=>({cue:c.key,start:c.start,end:c.start+c.move,
 frames:[...new Set(Array.from({length:11},(_,i)=>frame(c.start+c.move*i/10)))]}));
const allMove=moveDetails.flatMap(r=>r.frames);
const correctionTimes=[13,18.5,25,51,51.5,99.5,122,127,166.9,168,171,185.9,
 201.3333333,201.7333333,202.5666667,203.4,205.4,206.8,208.2,208.6,209.4,209.8,
 288.8333333,288.9,289.8666667,293.7333333,293.7666667,294.4,296.4666667,296.5,
 298.4,298.4333333,298.5,298.6,298.6333333,299,299.4333333,
 315.6333333,316.5,318,320,326.5,328,329.5,329.8,330,330.4666667,330.5,331,332,332.5,
 332.7,339.5,343.5,348.8,349,349.5,350,351.8].map(frame);
// Also sample the exact beginning/middle/end of each contiguous actual output
// replacement range (score, compass, stone, hand, white needle, existing B2).
const provenance=read(cache+'/composite-provenance.json');
const changed=provenance.records.filter(r=>r.actualPatchFrame!==null).map(r=>r.frame);
const runs=[];
for(const j of changed){const last=runs.at(-1);if(last&&j===last[1]+1)last[1]=j;else runs.push([j,j]);}
const replacements=runs.flatMap(([a,b])=>[a,Math.round((a+b)/2),b]);
const correction=[...new Set([...correctionTimes,...replacements])].sort((a,b)=>a-b);
const unique=a=>[...new Set(a)].sort((a,b)=>a-b);
const targets=unique([...half,...seconds,...ends,...major,...bookends,...allMove,...correction]);
assert.equal(half.length,714);assert.equal(seconds.length,357);assert.equal(ends.length,50);
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
fs.mkdirSync(out+'/frames',{recursive:true});const started=Date.now();
const filter='select='+targets.map(j=>`eq(n\\,${j})`).join('+');
const r=spawnSync(ff,['-v','error','-xerror','-i',video,'-vf',filter,'-fps_mode','passthrough','-q:v','2',out+'/frames/shot-%04d.jpg'],{encoding:'utf8',maxBuffer:1<<24});
fs.writeFileSync(out+'/extract.log',r.stderr??'',{flag:'wx'});assert.equal(r.status,0,r.stderr);
const names=fs.readdirSync(out+'/frames').filter(s=>/^shot-\d+\.jpg$/.test(s)).sort();
assert.equal(names.length,targets.length);
const files=new Map(targets.map((j,i)=>[j,out+'/frames/'+names[i]]));
const item=j=>({frame:j,time:j/fps,row:at(j).row,cue:at(j).key,file:files.get(j),sha256:sha(files.get(j)),actuallyViewed:false});
async function sheets(kind,indices){
 const pages=[];
 for(let n=0;n<indices.length;n+=10){
  const items=[];
  for(const [i,j]of indices.slice(n,n+10).entries()){
   const label=`${(j/fps).toFixed(3)}s f${j} row${at(j).row} ${at(j).key}`;
   items.push({input:Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="#fff"/><text x="5" y="20" font-family="Hiragino Sans" font-size="15">${esc(label)}</text></svg>`),left:i%5*360,top:Math.floor(i/5)*668});
   items.push({input:await sharp(files.get(j)).resize(360,640).toBuffer(),left:i%5*360,top:Math.floor(i/5)*668+28});
  }
  const file=out+'/'+kind+'-'+String(pages.length+1).padStart(2,'0')+'.jpg';
  await sharp({create:{width:1800,height:1336,channels:3,background:'#fff'}}).composite(items).jpeg({quality:94}).toFile(file);
  pages.push(file);
 }
 return {frames:indices.map(item),pages,pageSha256:Object.fromEntries(pages.map(p=>[p,sha(p)])),actuallyViewed:false};
}
const reference='/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/完成形/1-1_女王を処刑台に送った手紙.mp4';
const refTimes=[1,94,120,184,94,226,184,226,418,418,226,488],comparisons=[];
for(const [i,j]of major.entries()){
 const ref=spawnSync(ff,['-v','error','-ss',String(refTimes[i]),'-i',reference,'-frames:v','1','-f','image2pipe','-vcodec','png','-'],{maxBuffer:1<<25});
 assert.equal(ref.status,0,String(ref.stderr));
 const title=Buffer.from(`<svg width="1080" height="40"><rect width="1080" height="40" fill="#fff"/><text x="8" y="29" font-family="Hiragino Sans" font-size="24">B3 ${(j/fps).toFixed(2)}秒　　　　　見本1-1 ${refTimes[i]}秒</text></svg>`);
 const file=out+'/compare-major-'+String(i+1).padStart(2,'0')+'.jpg';
 await sharp({create:{width:1080,height:1000,channels:3,background:'#fff'}}).composite([{input:title,left:0,top:0},{input:await sharp(files.get(j)).resize(540,960).toBuffer(),left:0,top:40},{input:await sharp(ref.stdout).resize(540,960).toBuffer(),left:540,top:40}]).jpeg({quality:95}).toFile(file);
 comparisons.push(file);
}
const result={id:'ys-chain-b1v1',candidate:'B3',scope:'Actual encoded B3 MP4 exact frames, no SVG reconstruction',
 video,videoSha256:sha(video),fps,expectedFrames:nf,duration:D.duration,uniqueExtracted:targets.length,
 halfSeconds:await sheets('half-seconds',half),seconds:await sheets('seconds',seconds),
 cueEnds:await sheets('cue-ends',ends),bookends:await sheets('bookends',bookends),
 cameraAndVisualCorrections:await sheets('camera-corrections',correction),
 allCameraMoves:await sheets('all-moves',unique(allMove)),allCameraMoveDetails:moveDetails,
 major:{frames:major.map(item),comparisons,comparisonSha256:Object.fromEntries(comparisons.map(p=>[p,sha(p)])),actuallyViewed:false},
 provenanceSha256:sha(cache+'/composite-provenance.json'),
 originalGateNGPreserved:true,allActuallyViewed:false,earListeningPerformed:false,finalPassed:false,
 secondsElapsed:(Date.now()-started)/1000};
fs.writeFileSync(out+'/manifest.json',JSON.stringify(result,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,uniqueExtracted:targets.length,halfSecondPages:result.halfSeconds.pages.length,
 cueEndPages:result.cueEnds.pages.length,allMovePages:result.allCameraMoves.pages.length,allActuallyViewed:false}));
