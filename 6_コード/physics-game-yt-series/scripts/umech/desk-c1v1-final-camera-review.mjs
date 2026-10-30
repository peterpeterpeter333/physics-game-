// Extract actual final encoded frames. No SVG recomposition is used here.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root=process.env.C1_FINAL_CACHE;assert(root&&root.includes('ys-chain-c1v1-'));
const read=p=>JSON.parse(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),proof=read(root+'/camera-patch.json'),exported=read(root+'/c1-final-export.json'),out=root+'/actual-final-review',mp4=exported.video;
assert.equal(hash(mp4),exported.videoSha256);assert.equal(hash(root+'/camera-patch.json'),exported.patchProofSha256);assert(!fs.existsSync(out),'Preserve prior actual final review');
const samples=read(root+'/blender/probe1s-r11/qa-samples.json'),data=read(root+'/blender/data.json');assert.equal(samples.frames.length,437);
const halfseconds=Array.from({length:Math.floor(data.duration*2)+1},(_,k)=>Math.round(k*.5*30));assert.equal(halfseconds.length,721);
const moves=data.cues.filter(c=>c.move>0&&c.start>0).map(c=>{
 const duration=c.key==='arm:domino'?.8:c.move,start=c.key==='desk:revolt'?c.words.find(w=>w.word.includes('大きな反乱')).time-duration:c.start;
 return {cue:c.key,frame:Math.round((start+duration*.5)*30)};
});
const frames=[...new Set([...samples.frames,...halfseconds,...proof.patchFrames,...moves.map(x=>x.frame),...data.previews.map(t=>Math.round(t*30))])].sort((a,b)=>a-b);
for(const d of[out,out+'/selected',out+'/frames',out+'/sheets'])fs.mkdirSync(d);
const ff=process.env.FFMPEG??'/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1',select=frames.map(j=>'eq(n\\,'+j+')').join('+');
const r=spawnSync(ff,['-v','error','-i',mp4,'-vf','select='+select,'-fps_mode','passthrough','-start_number','0','-q:v','2',out+'/selected/%05d.jpg'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.equal(fs.readdirSync(out+'/selected').filter(x=>x.endsWith('.jpg')).length,frames.length);
const cards=[],items=[],sheets=[];
for(const [i,j]of frames.entries()){
 const source=out+'/selected/'+String(i).padStart(5,'0')+'.jpg',file=out+'/frames/'+String(j).padStart(5,'0')+'.jpg',t=j/30;fs.renameSync(source,file);
 const m=await sharp(file).metadata();assert(m.width===1080&&m.height===1920);
 const label=Buffer.from(`<svg width="360" height="30"><rect width="360" height="30" fill="white"/><text x="6" y="22" font-family="Arial" font-size="18">C1 MP4 ${t.toFixed(3)} s / ${j}</text></svg>`);
 cards.push(await sharp({create:{width:360,height:670,channels:3,background:'white'}}).composite([{input:await sharp(file).resize(360,640).toBuffer(),left:0,top:30},{input:label,left:0,top:0}]).jpeg({quality:94}).toBuffer());
 items.push({frame:j,time:t,file,sha256:hash(file),integerSecond:j%30===0,originalGateHalfSecond:halfseconds.includes(j),critical:samples.criticalFrames.includes(j),major12:data.previews.some(t=>Math.round(t*30)===j),newPatchSource:proof.patchFrames.includes(j),moveMidpoints:moves.filter(x=>x.frame===j).map(x=>x.cue),cueEnds:samples.cueEnds.filter(x=>x.frame===j).map(x=>x.cue)});
}
for(let i=0;i<cards.length;i+=9){const p=out+'/sheets/sheet-'+String(i/9+1).padStart(3,'0')+'.jpg';await sharp({create:{width:1080,height:2010,channels:3,background:'white'}}).composite(cards.slice(i,i+9).map((input,k)=>({input,left:k%3*360,top:Math.floor(k/3)*670}))).jpeg({quality:94}).toFile(p);sheets.push(p);}
assert.equal(items.filter(x=>x.integerSecond).length,361);assert.equal(items.filter(x=>x.originalGateHalfSecond).length,721);assert.equal(items.reduce((n,x)=>n+x.cueEnds.length,0),53);assert.equal(items.filter(x=>x.critical).length,27);assert.equal(items.filter(x=>x.major12).length,12);assert.equal(items.filter(x=>x.newPatchSource).length,proof.patchFrames.length);assert.equal(hash(mp4),exported.videoSha256);
const report={date:new Date().toISOString(),source:'Actual encoded final MP4, exact original 30fps frame indices; never a recomposed SVG',mp4,mp4Sha256:exported.videoSha256,patchProofSha256:exported.patchProofSha256,frames:items,integerSeconds:361,originalGateHalfSeconds:721,cueEnds:53,critical:27,major12:12,allNewPatchSources:proof.patchFrames.length,moveMidpointCount:moves.length,uniqueFrames:items.length,sheets,allFramesViewed:false,earsVerified:false};
fs.writeFileSync(out+'/actual-final-index.json',JSON.stringify(report,null,1));console.log(JSON.stringify({out,uniqueFrames:items.length,sheets:sheets.length,integerSeconds:361,originalGateHalfSeconds:721,cueEnds:53,major12:12,allNewPatchSources:proof.patchFrames.length,moveMidpointCount:moves.length}));
