import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyShmFoundations,shmFoundationIds} from '../docs/video-revision-20260924/shm-foundations.mjs';
import {shmFoundationFrame,shmFoundationKinds,shmFoundationDiagram} from './shm-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyShmFoundations(plan);
let count=0;const seen=new Set();
for(const id of shmFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=shmFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...shmFoundationKinds].sort());
for(const kind of shmFoundationKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>shmFoundationDiagram(kind,p))).size>1,'Static diagram '+kind);
assert.equal(new Set(shmFoundationKinds.map(kind=>shmFoundationDiagram(kind,.5))).size,shmFoundationKinds.length);
assert.equal(1/2,.5);assert.equal(2*Math.PI/4,Math.PI/2);
assert.match(plan.find(c=>c.id==='m-shm-intro').scenes[1].narration,/速度そのものがゼロ/);
assert.match(plan.find(c=>c.id==='prep-sin-wave').scenes[0].narration,/下側/);
console.log(`PASS shm foundations: ${shmFoundationIds.length} films, ${count} frames, ${seen.size} diagrams`);
