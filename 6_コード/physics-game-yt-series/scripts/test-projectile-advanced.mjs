import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyProjectileAdvanced,projectileAdvancedIds} from '../docs/video-revision-20260924/projectile-advanced.mjs';
import {projectileAdvancedFrame,projectileAdvancedKinds} from './projectile-advanced-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));const routes={};applyProjectileAdvanced(plan,routes);
assert.deepEqual(routes['m-projectile-advanced'],[{afterScene:3,inserts:['hm-why-11']}]);
let count=0;const seen=new Set();
for(const id of projectileAdvancedIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=projectileAdvancedFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...projectileAdvancedKinds].sort());
const range=a=>100*Math.sin(2*a*Math.PI/180)/9.8;
assert.ok(Math.abs(range(30)-range(60))<1e-12);assert.equal(Math.round(range(45)*10)/10,10.2);assert.ok(range(45)>8*12/9.8);
console.log(`PASS projectile advanced: 3 films, ${count} frames, ${seen.size} diagrams, numerical comparisons and conditions`);
