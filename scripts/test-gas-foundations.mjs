import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyGasFoundations,gasFoundationIds} from '../docs/video-revision-20260924/gas-foundations.mjs';
import {gasFoundationFrame,gasFoundationKinds,gasFoundationDiagram} from './gas-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyGasFoundations(plan);
let count=0;const seen=new Set();
for(const id of gasFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=gasFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...gasFoundationKinds].sort());
for(const kind of gasFoundationKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>gasFoundationDiagram(kind,p))).size>1);
assert.equal(new Set(gasFoundationKinds.map(kind=>gasFoundationDiagram(kind,.5))).size,gasFoundationKinds.length);
for(const V of [.5,1,2,4])assert.equal(2/V*V,2);
assert.equal(20+273.15,293.15);
assert.match(plan.find(c=>c.id==='t-gas-intro').scenes[1].narration,/実験則/);
assert.match(plan.find(c=>c.id==='t-gas-intro').scenes[2].narration,/温度一定/);
const pressure=plan.find(c=>c.id==='prep-pressure');
assert.equal(pressure.scenes.length,2);
assert.doesNotMatch(pressure.scenes.map(s=>s.narration).join(''),/ボイル|絶対温度/);
assert.match(pressure.title,/面積によって/);
console.log('PASS gas foundations:',gasFoundationIds.length,'films,',count,'frames,',seen.size,'diagrams');
