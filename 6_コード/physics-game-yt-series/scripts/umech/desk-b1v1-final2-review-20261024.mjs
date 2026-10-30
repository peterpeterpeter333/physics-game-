// Extract the delivered B-1 MP4 itself, including every original 0.5-second point.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const [videoArg,outArg]=process.argv.slice(2),video=path.resolve(videoArg??''),out=path.resolve(outArg??'');
assert(videoArg&&outArg&&fs.statSync(video).isFile());assert(!fs.existsSync(out),'Preserve prior review');
const cache='/private/tmp/ys/ys-chain-b1v1',D=JSON.parse(fs.readFileSync(cache+'/blender/data.json')).b1;
const fps=30,nf=Math.ceil(D.duration*fps),frame=t=>Math.min(nf-1,Math.round(t*fps));
const grid=Array.from({length:Math.floor(D.duration*2)+1},(_,i)=>frame(i*.5));
const seconds=Array.from({length:Math.ceil(D.duration)},(_,i)=>frame(i));
const ends=D.cues.map(c=>Math.min(nf-1,Math.ceil(c.end*fps-1e-7)-1));
const major=[2.7,34,75,97.6,113,142,168,185.9,235.4,259.8,294.4,354].map(frame);
const patch=[326.5,328,329.5,329.8,330,330.4666666667,330.5,331,332,332.5].map(frame);
const bookends=[0,.5,1,1.5,2,354,354.5,355,355.5,356,(nf-1)/30].map(frame);
const fix=JSON.parse(fs.readFileSync('/private/tmp/ys/ys-chain-b1v1-camera-final-20261024/camera-patch.json'));
const cameraSamples=[...new Set([...fix.ranges.flatMap(r=>[Math.ceil(r.start*fps)/fps,(r.start+r.end)/2,r.end-1/fps]),45.5,108.5,168,176,185.9,201.72,203.38,205.37,294.4,316.5,318,339.5,343.5].map(frame))].sort((a,b)=>a-b);
const targets=[...new Set([...grid,...seconds,...ends,...major,...patch,...bookends,...cameraSamples])].sort((a,b)=>a-b);
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.mkdirSync(out+'/frames',{recursive:true});const started=Date.now();
const filter='select='+targets.map(j=>`eq(n\\,${j})`).join('+');
const r=spawnSync(ff,['-v','error','-xerror','-i',video,'-vf',filter,'-fps_mode','passthrough','-q:v','2',out+'/frames/shot-%04d.jpg'],{encoding:'utf8',maxBuffer:1<<24});
fs.writeFileSync(out+'/extract.log',r.stderr??'');assert.equal(r.status,0,r.stderr);
const names=fs.readdirSync(out+'/frames').filter(s=>/^shot-\d+\.jpg$/.test(s)).sort();assert.equal(names.length,targets.length);
const files=new Map(targets.map((j,i)=>[j,out+'/frames/'+names[i]]));
const at=j=>D.cues.findLast(c=>c.start<=j/fps)??D.cues[0];
async function sheets(kind,indices){
 const pages=[];
 for(let n=0;n<indices.length;n+=10){
  const items=[];for(const [i,j]of indices.slice(n,n+10).entries()){
   const label=`${(j/fps).toFixed(3)}s f${j} row${at(j).row} ${at(j).key}`;
   items.push({input:Buffer.from(`<svg width="360" height="28"><rect width="360" height="28" fill="#fff"/><text x="5" y="20" font-family="Hiragino Sans" font-size="15">${esc(label)}</text></svg>`),left:i%5*360,top:Math.floor(i/5)*668});
   items.push({input:await sharp(files.get(j)).resize(360,640).toBuffer(),left:i%5*360,top:Math.floor(i/5)*668+28});
  }
  const f=out+'/'+kind+'-'+String(pages.length+1).padStart(2,'0')+'.jpg';await sharp({create:{width:1800,height:1336,channels:3,background:'#fff'}}).composite(items).jpeg({quality:94}).toFile(f);pages.push(f);
 }
 return {frames:indices.map(j=>({frame:j,time:j/fps,row:at(j).row,cue:at(j).key,file:files.get(j)})),pages,actuallyViewed:false};
}
const reference='/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/完成形/1-1_女王を処刑台に送った手紙.mp4';
const refTimes=[1,94,120,184,94,226,184,226,418,418,226,488],comparisons=[];
for(const [i,j]of major.entries()){
 const r=spawnSync(ff,['-v','error','-ss',String(refTimes[i]),'-i',reference,'-frames:v','1','-f','image2pipe','-vcodec','png','-'],{maxBuffer:1<<25});assert.equal(r.status,0,String(r.stderr));
 const title=Buffer.from(`<svg width="1080" height="40"><rect width="1080" height="40" fill="#fff"/><text x="8" y="29" font-family="Hiragino Sans" font-size="24">B-1 ${(j/fps).toFixed(2)}秒　　　　　見本1-1 ${refTimes[i]}秒</text></svg>`);
 const f=out+'/compare-major-'+String(i+1).padStart(2,'0')+'.jpg';
 await sharp({create:{width:1080,height:1000,channels:3,background:'#fff'}}).composite([{input:title,left:0,top:0},{input:await sharp(files.get(j)).resize(540,960).toBuffer(),left:0,top:40},{input:await sharp(r.stdout).resize(540,960).toBuffer(),left:540,top:40}]).jpeg({quality:95}).toFile(f);comparisons.push(f);
}
const result={id:'ys-chain-b1v1',scope:'Actual final encoded MP4, no SVG reconstruction; every 0.5 s original inspection point and all integer/cue-end frames',video,videoSha256:sha(video),fps,expectedFrames:nf,duration:D.duration,uniqueExtracted:targets.length,halfSeconds:await sheets('half-seconds',grid),seconds:await sheets('seconds',seconds),cueEnds:await sheets('cue-ends',ends),bookends:await sheets('bookends',bookends),timingPatch:await sheets('timing-patch',patch),cameraAndVisualCorrections:await sheets('camera-corrections',cameraSamples),major:{frames:major.map(j=>({frame:j,time:j/fps,file:files.get(j)})),comparisons,actuallyViewed:false},allActuallyViewed:false,earListeningPerformed:false,secondsElapsed:(Date.now()-started)/1000};
fs.writeFileSync(out+'/manifest.json',JSON.stringify(result,null,1));console.log(JSON.stringify({out,uniqueExtracted:targets.length,halfSecondPages:result.halfSeconds.pages.length,cueEndPages:result.cueEnds.pages.length,comparisonPages:comparisons.length,allActuallyViewed:false}));

