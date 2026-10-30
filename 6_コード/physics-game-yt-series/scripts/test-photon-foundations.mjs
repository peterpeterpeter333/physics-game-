import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyPhotonFoundations,photonFoundationIds} from '../docs/video-revision-20260924/photon-foundations.mjs';
import {photonFoundationFrame,photonFoundationKinds,photonFoundationDiagram} from './photon-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyPhotonFoundations(plan);
let count=0;const seen=new Set();
for(const id of photonFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=photonFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...photonFoundationKinds].sort());
for(const kind of photonFoundationKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>photonFoundationDiagram(kind,p))).size>1);
assert.equal(new Set(photonFoundationKinds.map(kind=>photonFoundationDiagram(kind,.5))).size,photonFoundationKinds.length);
assert.ok(Math.abs(6.63e-34*5.5e14/1.6e-19-2.2790625)<1e-12);
assert.equal(-34+14,-20);assert.ok(Math.abs(36.5e-20-3.65e-19)<1e-32);
assert.match(plan.find(c=>c.id==='a-photon-intro').condition,/一光子/);
console.log('PASS photon foundations:',photonFoundationIds.length,'films,',count,'frames,',seen.size,'diagrams');
