import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyForceStoryboards,forceIds} from '../docs/video-revision-20260924/force-storyboards.mjs';
import {forceFrame,forceDiagramKinds,forceDiagram} from './force-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyForceStoryboards(plan);
let count=0;const seen=new Set();
for(const id of forceIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=forceFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...forceDiagramKinds].sort());
for(const kind of forceDiagramKinds)assert.notEqual(forceDiagram(kind,0),forceDiagram(kind,1),'Static diagram '+kind);
assert.equal(new Set(forceDiagramKinds.map(kind=>forceDiagram(kind,.5))).size,forceDiagramKinds.length,'Each explanation needs its own visual focus');
assert.match(plan.find(c=>c.id==='m-force-intro').scenes[0].narration,/他の公式から導きません/);
assert.match(plan.find(c=>c.id==='m-force-advanced').scenes[1].narration,/一台ずつの加速度がゼロになるわけではありません/);
assert.equal((5-2)/2,1.5);
// Equal elapsed times must produce equal displacements in the inertia demo.
const cartLeft=p=>Number(forceDiagram('inertia-cart',p).match(/<rect x="([\d.]+)"/)[1]);
assert.ok(Math.abs((cartLeft(.4)-cartLeft(.3))-(cartLeft(.3)-cartLeft(.2)))<1e-9);
console.log(`PASS force: 6 films, ${count} frames, ${seen.size} diagrams, explicit receivers and empirical laws`);
