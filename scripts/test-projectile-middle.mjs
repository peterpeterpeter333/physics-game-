import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyProjectileMiddle} from '../docs/video-revision-20260924/projectile-middle.mjs';
import {projectileMiddleFrame,projectileMiddleKinds} from './projectile-middle-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyProjectileMiddle(plan);
const c=plan.find(c=>c.id==='m-projectile-middle');assert.ok(c.manuscriptScenes);
assert.deepEqual(c.navigationBreaks,[1,2,3]);
assert.deepEqual(c.scenes.map(s=>s.cues.map(q=>q.display[0]).join('')),['ddee','ee','deeeee','dee']);
let t=0,count=0;const seen=new Set();
for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));assert.equal(q.subtitle.split('。').filter(Boolean).length,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=projectileMiddleFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
assert.deepEqual([...seen].sort(),[...projectileMiddleKinds].sort());
assert.deepEqual(c.scenes[2].cues.slice(2).map(q=>q.previousFormula),[
 ['0','=','t\\left(v_{0y}-\\frac{gt}{2}\\right)'],['0','=','v_{0y}-\\frac{gt}{2}'],['\\frac{gt}{2}','=','v_{0y}'],['gt','=','2v_{0y}']]);
assert.equal(Math.round(8*12/9.8*10)/10,9.8);
console.log(`PASS projectile middle: ${count} frames, ${seen.size} diagrams, continuous algebra and 4 manual pages`);
