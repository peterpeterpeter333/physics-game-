// Root-approved CPU slot only. Extract REAL encoded MP4 frames, including
// every original 0.5s point, every cue end, all camera-entry intermediates,
// the principal 12 shots, and both bookends. Hashing/extraction is not eyes.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const [videoArg,outArg]=process.argv.slice(2);
assert(videoArg&&outArg,'Actual MP4 and NEW review folder required');
const video=path.resolve(videoArg),out=path.resolve(outArg),cache='/private/tmp/ys/ys-chain-e1v1';
assert(fs.statSync(video).isFile()&&!fs.existsSync(out));
const D=JSON.parse(fs.readFileSync(cache+'/blender/data.json')),fps=30,nf=Math.ceil(D.duration*fps);
assert.equal(nf,11606);assert.equal(D.cues.length,54);
const at=j=>D.cues.findLast(c=>c.start<=j/fps)??D.cues[0];
const frame=t=>Math.min(nf-1,Math.max(0,Math.round(t*fps)));
const halfSeconds=Array.from({length:Math.floor(D.duration*2)+1},(_,i)=>i*15);
assert.equal(halfSeconds.length,774);
const seconds=Array.from({length:Math.ceil(D.duration)},(_,i)=>i*30);
const cueEnds=D.cues.map(c=>Math.ceil(c.end*fps-1e-7)-1);
const moving=D.cues.filter(c=>c.move),moveRecords=[];
for(const c of moving){
 const first=Math.ceil(c.start*fps-1e-7),last=Math.ceil((c.start+c.move)*fps-1e-7)-1;
 const indices=[...new Set([first,...Array.from({length:9},(_,i)=>frame(c.start+c.move*(i+1)/10)),last])].sort((a,b)=>a-b);
 moveRecords.push({cue:c.key,start:c.start,end:c.start+c.move,firstFrame:first,lastFrame:last,frames:indices});
}
const moveIndices=[...new Set(moveRecords.flatMap(r=>r.frames))].sort((a,b)=>a-b);
const major=D.gateTimes.map(frame);assert.equal(major.length,12);
const bookends=[0,15,30,45,60,...[385,385.5,386,386.5].map(frame),nf-1];
const targets=[...new Set([...halfSeconds,...seconds,...cueEnds,...moveIndices,...major,...bookends])].sort((a,b)=>a-b);
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const videoSha=sha(video),started=Date.now();fs.mkdirSync(out+'/frames',{recursive:true});
const filter='select='+targets.map(j=>`eq(n\\,${j})`).join('+');
const r=spawnSync(ff,['-v','error','-xerror','-i',video,'-vf',filter,'-fps_mode','passthrough','-q:v','2',out+'/frames/shot-%04d.jpg'],{encoding:'utf8',maxBuffer:1<<25});
fs.writeFileSync(out+'/extract.log',r.stderr??'');assert.equal(r.status,0,r.stderr);
const names=fs.readdirSync(out+'/frames').filter(n=>/^shot-\d+\.jpg$/.test(n)).sort();assert.equal(names.length,targets.length);
const byFrame=new Map(targets.map((j,i)=>[j,out+'/frames/'+names[i]]));
async function sheets(kind,indices){
 const pages=[];
 for(let base=0;base<indices.length;base+=10){
  const items=[];
  for(const [i,j]of indices.slice(base,base+10).entries()){
   const label=`${(j/fps).toFixed(3)}s f${j} row${at(j).row} ${at(j).key}`;
   items.push({input:Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="white"/><text x="5" y="20" font-family="Hiragino Sans" font-size="15">${esc(label)}</text></svg>`),left:i%5*360,top:Math.floor(i/5)*668});
   items.push({input:await sharp(byFrame.get(j)).resize(360,640).toBuffer(),left:i%5*360,top:Math.floor(i/5)*668+28});
  }
  const p=out+'/'+kind+'-'+String(pages.length+1).padStart(2,'0')+'.jpg';
  await sharp({create:{width:1800,height:1336,channels:3,background:'white'}}).composite(items).jpeg({quality:94}).toFile(p);pages.push(p);
 }
 return {frames:indices.map(j=>({frame:j,time:j/fps,cue:at(j).key,row:at(j).row,file:byFrame.get(j)})),pages,actuallyViewed:false};
}
const result={id:'ys-chain-e1v1',scope:'Actual encoded corrected MP4, no SVG reconstruction; extraction/hashes are not visual acceptance',
 video,videoSha256:videoSha,fps,expectedFrames:nf,duration:D.duration,uniqueExtracted:targets.length,
 halfSeconds:await sheets('half-seconds',halfSeconds),seconds:await sheets('seconds',seconds),
 cueEnds:await sheets('cue-ends',cueEnds),allMoveIntermediates:await sheets('all-moves',moveIndices),
 cameraMoveIntervals:moveRecords,major12:await sheets('major12',major),bookends:await sheets('bookends',bookends),
 sourceFreeze:cache+'/e1v1-r9-source-freeze.json',sourceFreezeSha256:sha(cache+'/e1v1-r9-source-freeze.json'),
 specialUnresolvedExistingPreviewPoints:[{frame:3735,time:124.5,cue:'lon:torch',reason:'First125s preview fits but earlier same-site124.5 clip candidate must be viewed exactly.'}],
 secondsElapsed:(Date.now()-started)/1000,allActuallyViewed:false,earListeningPerformed:false,finalPassed:false};
assert.equal(sha(video),videoSha,'MP4 changed during extraction');
fs.writeFileSync(out+'/manifest.json',JSON.stringify(result,null,1));
console.log(JSON.stringify({out,uniqueExtracted:targets.length,halfSecondSamples:774,wholeSeconds:seconds.length,cueEnds:54,
 allMoveIntermediateSamples:moveIndices.length,allActuallyViewed:false,finalPassed:false}));
