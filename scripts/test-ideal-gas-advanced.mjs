import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyIdealGasAdvanced,idealGasAdvancedIds} from '../docs/video-revision-20260924/ideal-gas-advanced.mjs';
import {idealGasAdvancedFrame,idealGasAdvancedKinds,idealGasAdvancedDiagram} from './ideal-gas-advanced-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyIdealGasAdvanced(plan);
let count=0;const seen=new Set();
for(const id of idealGasAdvancedIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=idealGasAdvancedFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...idealGasAdvancedKinds].sort());
for(const kind of idealGasAdvancedKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>idealGasAdvancedDiagram(kind,p))).size>1);
assert.equal(new Set(idealGasAdvancedKinds.map(kind=>idealGasAdvancedDiagram(kind,.5))).size,idealGasAdvancedKinds.length);
assert.equal(3*(14/3),14);
assert.equal((-2*3)-(2*3),-12);
assert.match(plan.find(c=>c.id==='t-ideal-advanced').scenes[2].narration,/一個あたり/);
assert.match(plan.find(c=>c.id==='ht-why-06').scenes[0].narration,/マイナス二/);
console.log('PASS ideal gas advanced:',idealGasAdvancedIds.length,'films,',count,'frames,',seen.size,'diagrams');
