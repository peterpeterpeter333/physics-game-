import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyFirstlawFoundations,firstlawFoundationIds} from '../docs/video-revision-20260924/firstlaw-foundations.mjs';
import {firstlawFoundationFrame,firstlawFoundationKinds,firstlawFoundationDiagram} from './firstlaw-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyFirstlawFoundations(plan);
let count=0;const seen=new Set();
for(const id of firstlawFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=firstlawFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...firstlawFoundationKinds].sort());
for(const kind of firstlawFoundationKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>firstlawFoundationDiagram(kind,p))).size>1);
assert.equal(new Set(firstlawFoundationKinds.map(kind=>firstlawFoundationDiagram(kind,.5))).size,firstlawFoundationKinds.length);
assert.equal(100-40,60);
assert.equal(100000*.001,100);
assert.match(plan.find(c=>c.id==='t-firstlaw-intro').scenes[3].narration,/同じ種類と量/);
assert.match(plan.find(c=>c.id==='t-firstlaw-middle').scenes[2].narration,/負/);
console.log('PASS first law foundations:',firstlawFoundationIds.length,'films,',count,'frames,',seen.size,'diagrams');
