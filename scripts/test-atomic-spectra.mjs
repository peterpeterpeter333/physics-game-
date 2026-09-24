import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyAtomicSpectra,atomicSpectraIds} from '../docs/video-revision-20260924/atomic-spectra.mjs';
import {atomicSpectraFrame,atomicSpectraKinds,atomicSpectraDiagram} from './atomic-spectra-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyAtomicSpectra(plan);
let count=0;const seen=new Set();
for(const id of atomicSpectraIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=atomicSpectraFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...atomicSpectraKinds].sort());
for(const kind of atomicSpectraKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>atomicSpectraDiagram(kind,p))).size>1);
assert.equal(new Set(atomicSpectraKinds.map(kind=>atomicSpectraDiagram(kind,.5))).size,atomicSpectraKinds.length);
assert.ok(Math.abs((-1.51)-(-3.4)-1.89)<1e-12);
assert.ok(Math.abs(1240/1.89-656)<1);
assert.ok(Math.abs((6.63e-34*3e8/1.60e-19)*1e9-1240)<5);
assert.match(plan.find(c=>c.id==='a-photon-advanced').condition,/準位/);
assert.doesNotMatch(plan.find(c=>c.id==='a-photon-advanced').condition,/光電効果/);
console.log('PASS atomic spectra:',atomicSpectraIds.length,'films,',count,'frames,',seen.size,'diagrams');
