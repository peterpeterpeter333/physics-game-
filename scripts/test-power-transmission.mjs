import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyPowerTransmission,powerTransmissionIds} from '../docs/video-revision-20260924/power-transmission.mjs';
import {powerTransmissionFrame,powerTransmissionKinds,powerTransmissionDiagram} from './power-transmission-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyPowerTransmission(plan);
let count=0;const seen=new Set();
for(const id of powerTransmissionIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=powerTransmissionFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...powerTransmissionKinds].sort());
for(const kind of powerTransmissionKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>powerTransmissionDiagram(kind,p))).size>1);
assert.equal(new Set(powerTransmissionKinds.map(kind=>powerTransmissionDiagram(kind,.5))).size,powerTransmissionKinds.length);
assert.equal((1000/100)**2*2,200);
assert.equal((1000/1000)**2*2,2);
assert.equal(2/200,1/100);
assert.equal(1000+200,1200);
assert.equal(1000+2,1002);
console.log('PASS power transmission:',powerTransmissionIds.length,'films,',count,'frames,',seen.size,'diagrams');
