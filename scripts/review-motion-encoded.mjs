// Actual encoded-video QA, sampled once per spoken cue. Re-rendered SVGs alone
// do not prove that the published MP4 contains the right diagrams.
import {readFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {motionFoundationIds} from '../docs/video-revision-20260924/motion-foundations.mjs';
const out=process.argv[2]??'/private/tmp/physics-motion-encoded';
assert.ok(process.env.FFMPEG);mkdirSync(out,{recursive:true});
for(const id of motionFoundationIds){
 const base=`public/media/revisions/${id}`,c=JSON.parse(readFileSync(base+'.json')),images=[];
 for(const s of c.scenes)for(const cap of s.captions){
  const i=images.length;
  const png=execFileSync(process.env.FFMPEG,['-v','error','-ss',String(cap.start+(cap.end-cap.start)*.8),'-i',base+'.mp4','-frames:v','1','-f','image2pipe','-vcodec','png','pipe:1'],{maxBuffer:10e6});
  images.push({input:await sharp(png).resize(640,380).png().toBuffer(),left:(i%2)*640,top:Math.floor(i/2)*380});
 }
 await sharp({create:{width:1280,height:Math.ceil(images.length/2)*380,channels:3,background:'#0b1122'}}).composite(images).png().toFile(`${out}/${id}.png`);
 console.log(`${out}/${id}.png`);
}
