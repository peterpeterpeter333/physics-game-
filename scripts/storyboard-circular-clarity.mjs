import {readFileSync,mkdirSync} from 'node:fs';
import sharp from 'sharp';
import {circularPilotFrame} from './circular-pilot-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));
const out=process.argv[2]??'/private/tmp/physics-circular-clarity-review';
mkdirSync(out,{recursive:true});
const points=[['m-circular-middle',0,3],['m-circular-middle',1,0],['m-circular-middle',1,2],['m-circular-middle',1,3],['m-circular-middle',1,4],['m-circular-middle',3,1],['m-circular-middle',4,1],['m-circular-advanced',1,4]];
for(const [id,i,k] of points){
 const c=structuredClone(plan.find(c=>c.id===id));let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{const a={text:q.subtitle,start:t,end:t+5};t+=5;return a;});s.end=t;}c.duration=t;
 const s=c.scenes[i];
 await sharp(Buffer.from(circularPilotFrame(c,s,s.captions[k].start+3.5))).png().toFile(`${out}/${id}-${i}-${k}.png`);
}
console.log(out);
