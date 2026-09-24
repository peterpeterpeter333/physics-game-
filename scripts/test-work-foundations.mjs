import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyWorkFoundations,workFoundationIds} from '../docs/video-revision-20260924/work-foundations.mjs';
import {workFoundationFrame,workFoundationKinds,workFoundationDiagram} from './work-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyWorkFoundations(plan);
let count=0;const seen=new Set();
for(const id of workFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=workFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...workFoundationKinds].sort());
for(const kind of workFoundationKinds)assert.notEqual(workFoundationDiagram(kind,0),workFoundationDiagram(kind,1),'Static diagram '+kind);
assert.equal(new Set(workFoundationKinds.map(kind=>workFoundationDiagram(kind,.5))).size,workFoundationKinds.length,'Each explanation needs its own visual focus');
assert.match(plan.find(c=>c.id==='hm-why-13').scenes[0].narration,/すべての力の仕事の合計/);
assert.match(plan.find(c=>c.id==='m-energy-intro').scenes[2].narration,/重力の仕事も足します/);
assert.equal(.5*2*(4**2-2**2),3*4);
console.log(`PASS work foundations: 3 films, ${count} frames, ${seen.size} diagrams, individual vs total work`);
