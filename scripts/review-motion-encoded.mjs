// Actual encoded-video QA, sampled once per spoken cue. Re-rendered SVGs alone
// do not prove that the published MP4 contains the right diagrams.
import {readFileSync,mkdirSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {motionFoundationIds} from '../docs/video-revision-20260924/motion-foundations.mjs';
const out=process.argv[2]??'/private/tmp/physics-motion-encoded';
const args=process.argv.slice(3),option=args.find(a=>a.startsWith('--fractions='));
const fractions=option?option.slice('--fractions='.length).split(',').map(Number):[.8];
assert.ok(fractions.length&&fractions.every(p=>Number.isFinite(p)&&p>=0&&p<1),'Fractions must be in [0, 1)');
const ids=args.filter(a=>!a.startsWith('--'));
assert.ok(process.env.FFMPEG);mkdirSync(out,{recursive:true});
for(const id of (ids.length?ids:motionFoundationIds)){
 assert.match(id,/^[a-z0-9-]+$/);
 const directory=['revisions','inserts','lessons','em'].find(d=>existsSync(`public/media/${d}/${id}.json`)&&existsSync(`public/media/${d}/${id}.mp4`));
 assert.ok(directory,`No encoded media found: ${id}`);
 const base=`public/media/${directory}/${id}`,c=JSON.parse(readFileSync(base+'.json')),images=[];
 const samples=[];
 for(const s of c.scenes)for(const [cue,cap]of s.captions.entries())for(const fraction of fractions){
  const i=images.length;
  const seconds=cap.start+(cap.end-cap.start)*fraction,columns=fractions.length===1?2:fractions.length;
  const png=execFileSync(process.env.FFMPEG,['-v','error','-ss',String(seconds),'-i',base+'.mp4','-frames:v','1','-f','image2pipe','-vcodec','png','pipe:1'],{maxBuffer:10e6});
  const label=Buffer.from(`<svg width="640" height="24"><rect width="640" height="24" fill="#18243a"/><text x="10" y="18" fill="white" font-size="15">scene ${s.index+1} / cue ${cue+1} / ${Math.round(fraction*100)}% / ${seconds.toFixed(2)} s</text></svg>`);
  images.push({input:await sharp(png).resize(640,380).extend({bottom:24,background:'#18243a'}).composite([{input:label,top:380,left:0}]).png().toBuffer(),left:(i%columns)*640,top:Math.floor(i/columns)*404});
  samples.push({scene:s.index,cue,fraction,seconds,subtitle:cap.text});
 }
 const columns=fractions.length===1?2:fractions.length;
 await sharp({create:{width:columns*640,height:Math.ceil(images.length/columns)*404,channels:3,background:'#0b1122'}}).composite(images).png().toFile(`${out}/${id}.png`);
 writeFileSync(`${out}/${id}.samples.json`,JSON.stringify({id,media:base+'.mp4',sha256:createHash('sha256').update(readFileSync(base+'.mp4')).digest('hex'),method:'Encoded frame samples, NOT continuous playback or listening',samples},null,2)+'\n');
 console.log(`${out}/${id}.png`);
}
