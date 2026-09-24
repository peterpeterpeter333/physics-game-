import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyMomentumFoundations,momentumFoundationIds} from '../docs/video-revision-20260924/momentum-foundations.mjs';
import {momentumFoundationFrame,momentumFoundationKinds,momentumFoundationDiagram} from './momentum-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyMomentumFoundations(plan);
let count=0;const seen=new Set();
for(const id of momentumFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=momentumFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...momentumFoundationKinds].sort());
for(const kind of momentumFoundationKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>momentumFoundationDiagram(kind,p))).size>1,'Static diagram '+kind);
assert.equal(new Set(momentumFoundationKinds.map(kind=>momentumFoundationDiagram(kind,.5))).size,momentumFoundationKinds.length);
assert.equal(2*3/3,2);assert.equal(4*3/3,4);
assert.match(plan.find(c=>c.id==='prep-impulse').scenes[0].narration,/一定の合力/);
assert.match(plan.find(c=>c.id==='prep-impulse').scenes[2].narration,/平均の合力/);
console.log(`PASS momentum foundations: ${momentumFoundationIds.length} films, ${count} frames, ${seen.size} diagrams`);
