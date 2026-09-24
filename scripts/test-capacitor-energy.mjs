import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyCapacitorEnergy,capacitorEnergyIds} from '../docs/video-revision-20260924/capacitor-energy.mjs';
import {capacitorEnergyFrame,capacitorEnergyKinds,capacitorEnergyDiagram} from './capacitor-energy-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyCapacitorEnergy(plan);
let count=0;const seen=new Set();
for(const id of capacitorEnergyIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=capacitorEnergyFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...capacitorEnergyKinds].sort());
for(const kind of capacitorEnergyKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>capacitorEnergyDiagram(kind,p))).size>1);
assert.equal(new Set(capacitorEnergyKinds.map(kind=>capacitorEnergyDiagram(kind,.5))).size,capacitorEnergyKinds.length);
assert.ok(Math.abs(2e-6*10-20e-6)<1e-18);
assert.ok(Math.abs(.5*2e-6*100-1e-4)<1e-16);
const lowerArea=n=>Array.from({length:n},(_,i)=>i/n/n).reduce((a,b)=>a+b,0);
assert.ok(Math.abs(lowerArea(28)-.5)<Math.abs(lowerArea(4)-.5));
console.log('PASS capacitor energy:',capacitorEnergyIds.length,'films,',count,'frames,',seen.size,'diagrams');
