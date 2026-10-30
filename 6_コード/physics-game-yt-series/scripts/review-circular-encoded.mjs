// Extract the actual encoded frames (not regenerated SVGs) for the 11 repaired cues.
import {readFileSync,mkdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const out=process.argv[2]??'/private/tmp/physics-circular-restored';
assert.ok(process.env.FFMPEG,'Set FFMPEG');mkdirSync(out,{recursive:true});
const films=[
 ['revisions','m-circular-intro',[[0,0],[0,1],[0,2],[1,0],[1,1],[2,1],[2,2]]],
 ['revisions','m-circular-advanced',[[0,0],[0,2],[2,0]]],
 ['inserts','hm-why-20',[[0,0]]]
];
for(const [dir,id,points]of films){
 const base=`public/media/${dir}/${id}`,c=JSON.parse(readFileSync(base+'.json')),images=[];
 for(const [n,[i,k]]of points.entries()){
  const s=c.scenes[i],cap=s.captions[k];assert.equal(s.cues[k].display,'diagram');
  const png=execFileSync(process.env.FFMPEG,['-v','error','-ss',String((cap.start+cap.end)/2),'-i',base+'.mp4','-frames:v','1','-f','image2pipe','-vcodec','png','pipe:1'],{maxBuffer:10e6});
  images.push({input:await sharp(png).resize(640,380).png().toBuffer(),left:(n%2)*640,top:Math.floor(n/2)*380});
 }
 await sharp({create:{width:1280,height:Math.ceil(points.length/2)*380,channels:3,background:'#0b1122'}}).composite(images).png().toFile(`${out}/${id}.png`);
 console.log(`${out}/${id}.png`);
}
