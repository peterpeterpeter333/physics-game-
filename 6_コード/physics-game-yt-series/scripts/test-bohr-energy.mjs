import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyBohrEnergy,bohrEnergyIds} from '../docs/video-revision-20260924/bohr-energy.mjs';
import {bohrEnergyFrame,bohrEnergyKinds,bohrEnergyDiagram} from './bohr-energy-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyBohrEnergy(plan);
let count=0;const seen=new Set();
for(const id of bohrEnergyIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=bohrEnergyFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...bohrEnergyKinds].sort());
for(const kind of bohrEnergyKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>bohrEnergyDiagram(kind,p))).size>1);
assert.equal(new Set(bohrEnergyKinds.map(kind=>bohrEnergyDiagram(kind,.5))).size,bohrEnergyKinds.length);
const hbar=1.055e-34,m=9.11e-31,k=8.99e9,e=1.60e-19,r=hbar*hbar/(m*k*e*e);
assert.ok(Math.abs((k*e*e/(2*r))/e-13.6)<.1);
assert.equal(-13.6/4,-3.4);
const K=k*e*e/(2*r),U=-k*e*e/r;assert.ok(Math.abs((K+U)/(-K)-1)<1e-12);
console.log('PASS Bohr energy:',bohrEnergyIds.length,'films,',count,'frames,',seen.size,'diagrams');
