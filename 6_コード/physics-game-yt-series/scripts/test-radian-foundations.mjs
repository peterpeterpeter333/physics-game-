import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyRadianFoundations,radianFoundationIds} from '../docs/video-revision-20260924/radian-foundations.mjs';
import {radianFoundationFrame,radianFoundationKinds,radianFoundationDiagram} from './radian-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyRadianFoundations(plan);
let count=0;const seen=new Set();
for(const id of radianFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=radianFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...radianFoundationKinds].sort());
for(const kind of radianFoundationKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>radianFoundationDiagram(kind,p))).size>1,'Static diagram '+kind);
assert.equal(new Set(radianFoundationKinds.map(kind=>radianFoundationDiagram(kind,.5))).size,radianFoundationKinds.length);
assert.equal(1/2,.5);assert.equal(2*Math.PI/4,Math.PI/2);
assert.match(plan.find(c=>c.id==='prep-radian').scenes[0].narration,/半径で割る/);
assert.match(plan.find(c=>c.id==='prep-radian').scenes[3].narration,/経過時間で割り/);
console.log(`PASS radian foundations: ${radianFoundationIds.length} films, ${count} frames, ${seen.size} diagrams`);
