import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyHeatFoundations,heatFoundationIds} from '../docs/video-revision-20260924/heat-foundations.mjs';
import {heatFoundationFrame,heatFoundationKinds,heatFoundationDiagram} from './heat-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyHeatFoundations(plan);
let count=0;const seen=new Set();
for(const id of heatFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=heatFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...heatFoundationKinds].sort());
for(const kind of heatFoundationKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>heatFoundationDiagram(kind,p))).size>1);
assert.equal(new Set(heatFoundationKinds.map(kind=>heatFoundationDiagram(kind,.5))).size,heatFoundationKinds.length);
assert.equal(100*4.2*10,4200);assert.equal(.1*4200*10,4200);
assert.equal(4200/(100*4.2),10);assert.equal(4200/(100*8.4),5);
assert.match(plan.find(c=>c.id==='t-heat-middle').scenes[0].narration,/実験/);
assert.match(plan.find(c=>c.id==='prep-heat-units').scenes[2].narration,/最後の三十度ではなく/);
console.log('PASS heat foundations:',heatFoundationIds.length,'films,',count,'frames,',seen.size,'diagrams');
