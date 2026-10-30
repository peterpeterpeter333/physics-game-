import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyIdealGasFoundations,idealGasFoundationIds} from '../docs/video-revision-20260924/ideal-gas-foundations.mjs';
import {idealGasFoundationFrame,idealGasFoundationKinds,idealGasFoundationDiagram} from './ideal-gas-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyIdealGasFoundations(plan);
let count=0;const seen=new Set();
for(const id of idealGasFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=idealGasFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...idealGasFoundationKinds].sort());
for(const kind of idealGasFoundationKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>idealGasFoundationDiagram(kind,p))).size>1);
assert.equal(new Set(idealGasFoundationKinds.map(kind=>idealGasFoundationDiagram(kind,.5))).size,idealGasFoundationKinds.length);
assert.equal(1*8.31*300/100000,.02493);
assert.match(plan.find(c=>c.id==='t-ideal-middle').scenes[1].narration,/単位を変えました/);
console.log('PASS ideal gas foundations:',idealGasFoundationIds.length,'films,',count,'frames,',seen.size,'diagrams');
