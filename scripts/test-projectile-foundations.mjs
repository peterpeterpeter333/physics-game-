import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyProjectileFoundations,projectileFoundationIds} from '../docs/video-revision-20260924/projectile-foundations.mjs';
import {projectileFoundationFrame,projectileFoundationKinds} from './projectile-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyProjectileFoundations(plan);
let count=0;const seen=new Set();
for(const id of projectileFoundationIds){
 const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);
 assert.deepEqual(c.scenes.map(s=>s.cues.map(q=>q.display[0]).join('')),id.startsWith('hm-')?['deeedd']:['dd','dd','dd']);
 let t=0;for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));assert.equal(q.subtitle.split('。').filter(Boolean).length,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=projectileFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...projectileFoundationKinds].sort());
assert.match(plan.find(c=>c.id==='hm-why-10').scenes[0].narration,/最初の縦方向の速度はゼロ/);
console.log(`PASS projectile foundations: 2 films, ${count} frames, ${seen.size} diagrams, shared clock and explicit conditions`);
