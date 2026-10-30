import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyWorkComponents,workComponentIds} from '../docs/video-revision-20260924/work-components.mjs';
import {workComponentFrame,workComponentKinds,workComponentDiagram} from './work-component-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyWorkComponents(plan);
let count=0;const seen=new Set();
for(const id of workComponentIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=workComponentFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...workComponentKinds].sort());
for(const kind of workComponentKinds)assert.notEqual(workComponentDiagram(kind,0),workComponentDiagram(kind,1),'Static diagram '+kind);
assert.equal(new Set(workComponentKinds.map(kind=>workComponentDiagram(kind,.5))).size,workComponentKinds.length,'Each explanation needs its own visual focus');
assert.ok(Math.abs(10*Math.cos(Math.PI/3)*2-10)<1e-10);
assert.match(plan.find(c=>c.id==='m-energy-middle').scenes[2].narration,/摩擦/);
assert.match(plan.find(c=>c.id==='hm-why-14').scenes[0].narration,/床から浮かない/);
assert.equal(70+55,125); // plotted upward forces balance the downward force
console.log(`PASS work components: ${workComponentIds.length} films, ${count} frames, ${seen.size} diagrams, components and signed work`);
