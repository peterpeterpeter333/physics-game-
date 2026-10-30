// Final MP4's actual twelve frames, paired with the original approved reference mapping.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {spawnSync} from 'node:child_process';import sharp from 'sharp';
const root='/private/tmp/ys/ys-chain-c1v1',out=root+'/final-r13-critical12',hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const exported=JSON.parse(fs.readFileSync(root+'/c1-export-r13.json')),index=JSON.parse(fs.readFileSync(root+'/final-r13-review/actual-final-index.json')),data=JSON.parse(fs.readFileSync(root+'/blender/data.json'));
assert.equal(hash(exported.video),exported.videoSha256);assert.equal(index.mp4Sha256,exported.videoSha256);assert.equal(data.previews.length,12);assert(!fs.existsSync(out));fs.mkdirSync(out);
const reference='/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖/完成形/1-1_女王を処刑台に送った手紙.mp4',refSha=hash(reference),refTimes=[1,418,488,94,31,94,120,226,94,418,226,431],ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1';
const cards=[],items=[];
for(let i=0;i<12;i++){
 const t=data.previews[i],j=Math.round(t*30),actual=index.frames.find(f=>f.frame===j);assert(actual);assert.equal(hash(actual.file),actual.sha256);
 const r=spawnSync(ff,['-v','error','-ss',String(refTimes[i]),'-i',reference,'-frames:v','1','-vf','scale=540:960','-f','image2pipe','-c:v','png','-'],{maxBuffer:8e6});assert.equal(r.status,0,r.stderr.toString());
 const label=Buffer.from(`<svg width="1080" height="60"><rect width="1080" height="60" fill="white"/><text x="16" y="40" font-family="Hiragino Sans" font-size="25">C-1 完成MP4 ${actual.time.toFixed(3)}秒　　　　　見本1-1第6版 ${refTimes[i]}秒</text></svg>`),file=out+'/compare-c1v1-final-'+String(i+1).padStart(2,'0')+'.jpg';
 const pair=await sharp({create:{width:1080,height:1020,channels:3,background:'white'}}).composite([{input:label,left:0,top:0},{input:await sharp(actual.file).resize(540,960).toBuffer(),left:0,top:60},{input:r.stdout,left:540,top:60}]).jpeg({quality:94}).toBuffer();fs.writeFileSync(file,pair);cards.push(await sharp(pair).resize(360,340).toBuffer());items.push({frame:j,time:actual.time,file,sha256:hash(file),actualMp4Frame:actual.file,actualMp4FrameSha256:actual.sha256,referenceTime:refTimes[i]});
}
await sharp({create:{width:1440,height:1020,channels:3,background:'white'}}).composite(cards.map((input,i)=>({input,left:i%4*360,top:Math.floor(i/4)*340}))).jpeg({quality:94}).toFile(out+'/compare-c1v1-final-all12.jpg');
assert.equal(hash(reference),refSha);assert.equal(hash(exported.video),exported.videoSha256);
fs.writeFileSync(out+'/actual-critical12-index.json',JSON.stringify({source:'actual final MP4 frames, not recomposed SVG',mp4:exported.video,mp4Sha256:exported.videoSha256,reference,referenceSha256:refSha,referenceMappingUnchangedFromOriginalPreview:true,frames:items,allTwelveViewed:false,earsVerified:false},null,1));console.log(JSON.stringify({out,actualFrames:12,mp4Sha256:exported.videoSha256}));
