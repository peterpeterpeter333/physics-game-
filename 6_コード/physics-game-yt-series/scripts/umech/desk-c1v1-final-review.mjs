// Extract the actual encoded MP4 (not recomposed SVG) for full visual QA.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root='/private/tmp/ys/ys-chain-c1v1',id='ys-chain-c1v1',mp4=root+'/out/'+id+'.mp4',out=root+'/final-r13-review',hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const exported=JSON.parse(fs.readFileSync(root+'/c1-export-r13.json'));assert.equal(hash(mp4),exported.videoSha256);assert(!fs.existsSync(out),'Preserve prior final review');
const samples=JSON.parse(fs.readFileSync(root+'/blender/probe1s-r11/qa-samples.json')),frames=[...samples.frames].sort((a,b)=>a-b);assert.equal(new Set(frames).size,437);
for(const d of [out,out+'/selected',out+'/frames',out+'/sheets'])fs.mkdirSync(d);
const ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1',select=frames.map(j=>'eq(n\\,'+j+')').join('+');
const r=spawnSync(ff,['-v','error','-i',mp4,'-vf','select='+select,'-fps_mode','passthrough','-start_number','0','-q:v','2',out+'/selected/%05d.jpg'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.equal(fs.readdirSync(out+'/selected').filter(x=>x.endsWith('.jpg')).length,437);
const reference=root+'/r11-probe-preflight/probe1s-review-c1v1/reference1s',items=[],cards=[];
for(const [i,j]of frames.entries()){
 const source=out+'/selected/'+String(i).padStart(5,'0')+'.jpg',target=out+'/frames/'+String(j).padStart(5,'0')+'.jpg',t=j/30;fs.renameSync(source,target);
 const m=await sharp(target).metadata();assert(m.width===1080&&m.height===1920);const ref=reference+'/'+String(Math.min(360,Math.floor(t))).padStart(5,'0')+'.jpg';
 const label=Buffer.from(`<svg width="432" height="24"><text x="5" y="17" font-family="Arial" font-size="14">C1 FINAL ${t.toFixed(3)} s / ${j} | REF ${Math.floor(t)} s</text></svg>`);
 cards.push(await sharp({create:{width:432,height:408,channels:3,background:'#f4e8cc'}}).composite([{input:await sharp(target).resize(216,384).toBuffer(),left:0,top:24},{input:fs.readFileSync(ref),left:216,top:24},{input:label,left:0,top:0}]).jpeg({quality:94}).toBuffer());
 items.push({frame:j,time:t,file:target,sha256:hash(target),integerSecond:j%30===0,critical:samples.criticalFrames.includes(j),cueEnds:samples.cueEnds.filter(x=>x.frame===j).map(x=>x.cue)});
}
const sheets=[];
for(let i=0;i<cards.length;i+=9){const p=out+'/sheets/sheet-'+String(i/9+1).padStart(2,'0')+'.jpg';await sharp({create:{width:1296,height:1224,channels:3,background:'#f4e8cc'}}).composite(cards.slice(i,i+9).map((input,k)=>({input,left:k%3*432,top:Math.floor(k/3)*408}))).jpeg({quality:94}).toFile(p);sheets.push(p);}
assert.equal(items.filter(x=>x.integerSecond).length,361);assert.equal(items.reduce((n,x)=>n+x.cueEnds.length,0),53);assert.equal(items.filter(x=>x.critical).length,27);
assert.equal(hash(mp4),exported.videoSha256);
fs.writeFileSync(out+'/actual-final-index.json',JSON.stringify({date:new Date().toISOString(),source:'actual encoded final MP4, exact selected 30fps frame indices',mp4,mp4Sha256:exported.videoSha256,frames:items,integerSeconds:361,cueEnds:53,critical:27,uniqueFrames:437,sheets,allFramesViewed:false,earsVerified:false},null,1));
console.log(JSON.stringify({out,uniqueFrames:437,integerSeconds:361,cueEnds:53,critical:27,sheets:49,actualVideoSha256:exported.videoSha256}));
