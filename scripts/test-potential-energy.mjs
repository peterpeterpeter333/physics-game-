import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyPotentialEnergy,potentialEnergyIds} from '../docs/video-revision-20260924/potential-energy.mjs';
import {potentialEnergyFrame,potentialEnergyKinds,potentialEnergyDiagram} from './potential-energy-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyPotentialEnergy(plan);
let count=0;const seen=new Set();
for(const id of potentialEnergyIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=potentialEnergyFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...potentialEnergyKinds].sort());
for(const kind of potentialEnergyKinds)assert.notEqual(potentialEnergyDiagram(kind,0),potentialEnergyDiagram(kind,1),'Static diagram '+kind);
assert.equal(new Set(potentialEnergyKinds.map(kind=>potentialEnergyDiagram(kind,.5))).size,potentialEnergyKinds.length);
assert.equal((Math.sqrt(2*9.8*2)).toFixed(1),'6.3');
for(const c of plan.filter(c=>potentialEnergyIds.includes(c.id)))assert.match(c.scenes.map(s=>s.narration).join(''),/空気抵抗/);
console.log(`PASS potential energy: ${potentialEnergyIds.length} films, ${count} frames, ${seen.size} diagrams`);
