// Actual encoded E1 frames, never a fresh SVG approximation of the MP4.
// Run only in a root-approved CPU slot after the final MP4 exists.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const [videoArg,outArg]=process.argv.slice(2);
assert(videoArg&&outArg,'video and NEW output directory required');
const video=path.resolve(videoArg),out=path.resolve(outArg),cache='/private/tmp/ys/ys-chain-e1v1';
assert(fs.statSync(video).isFile());assert(!fs.existsSync(out),'Preserve existing review; choose a new directory');
const D=JSON.parse(fs.readFileSync(cache+'/blender/data.json')),fps=30,nf=Math.ceil(D.duration*fps);
assert.equal(nf,11606);assert.equal(D.cues.length,54);
const seconds=Array.from({length:Math.ceil(D.duration)},(_,t)=>t*fps);
const cueEnds=D.cues.map(c=>Math.min(nf-1,Math.ceil(c.end*fps-1e-7)-1));
const bookends=[0,15,30,45,60,...[385,385.5,386,386.5].map(t=>Math.round(t*fps)),nf-1];
const targets=[...new Set([...seconds,...cueEnds,...bookends])].sort((a,b)=>a-b);
fs.mkdirSync(out+'/frames',{recursive:true});
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const filter='select='+targets.map(j=>`eq(n\\,${j})`).join('+');
const started=Date.now();
const r=spawnSync(ff,['-v','error','-xerror','-i',video,'-vf',filter,'-vsync','0','-q:v','2',out+'/frames/shot-%04d.jpg'],{encoding:'utf8',maxBuffer:1<<25});
fs.writeFileSync(out+'/extract.log',r.stderr??'');assert.equal(r.status,0,r.stderr);
const files=fs.readdirSync(out+'/frames').filter(f=>/^shot-\d+\.jpg$/.test(f)).sort();assert.equal(files.length,targets.length);
const byFrame=new Map(targets.map((j,i)=>[j,out+'/frames/'+files[i]]));
const cueAt=j=>D.cues.findLast(c=>c.start<=j/fps)??D.cues[0];
const label=j=>{const c=cueAt(j);return `${(j/fps).toFixed(3)}s  f${j}  row${c.row} ${c.key}`;};
async function sheets(kind,indices){
 const pages=[];
 for(let base=0;base<indices.length;base+=10){
  const comp=[];
  for(const [i,j]of indices.slice(base,base+10).entries()){
   const header=Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="white"/><text x="5" y="20" font-family="Hiragino Sans" font-size="15" fill="#302316">${label(j)}</text></svg>`);
   comp.push({input:header,left:i%5*360,top:Math.floor(i/5)*668});
   comp.push({input:await sharp(byFrame.get(j)).resize(360,640).toBuffer(),left:i%5*360,top:Math.floor(i/5)*668+28});
  }
  const file=out+'/'+kind+'-sheet-'+String(pages.length+1).padStart(2,'0')+'.jpg';
  await sharp({create:{width:1800,height:1336,channels:3,background:'#fff'}}).composite(comp).jpeg({quality:94}).toFile(file);pages.push(file);
 }
 return {frames:indices.map(j=>({frame:j,time:j/fps,cue:cueAt(j).key,row:cueAt(j).row,file:byFrame.get(j)})),pages,actuallyViewed:false};
}
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const result={id:'ys-chain-e1v1',scope:'actual encoded MP4, exact 30fps frame indices; review still requires human/agent eyes',video,videoSha256:sha(video),fps,expectedFrames:nf,duration:D.duration,uniqueExtracted:targets.length,seconds:await sheets('seconds',seconds),cueEnds:await sheets('cue-ends',cueEnds),bookends:await sheets('bookends',bookends),secondsElapsed:(Date.now()-started)/1000,sourceFreeze:cache+'/e1v1-r9-source-freeze.json',sourceFreezeSha256:sha(cache+'/e1v1-r9-source-freeze.json'),allActuallyViewed:false,audioEarFullReview:false};
fs.writeFileSync(out+'/manifest.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({out,uniqueExtracted:targets.length,seconds:seconds.length,cueEnds:cueEnds.length,pages:{seconds:result.seconds.pages.length,cueEnds:result.cueEnds.pages.length,bookends:result.bookends.pages.length},actuallyViewed:false},null,2));
