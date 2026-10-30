import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyCoulombField,coulombFieldIds} from '../docs/video-revision-20260924/coulomb-field.mjs';
import {coulombFieldFrame,coulombFieldKinds,coulombFieldDiagram} from './coulomb-field-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyCoulombField(plan);
let count=0;const seen=new Set();
for(const id of coulombFieldIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=coulombFieldFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...coulombFieldKinds].sort());
for(const kind of coulombFieldKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>coulombFieldDiagram(kind,p))).size>1);
assert.equal(new Set(coulombFieldKinds.map(kind=>coulombFieldDiagram(kind,.5))).size,coulombFieldKinds.length);
assert.equal(9e9*1e-6*1e-6,.009);
assert.equal(.009/4,.00225);
assert.equal((2**2),4);
assert.equal(3+(-3),0);
console.log('PASS Coulomb field:',coulombFieldIds.length,'films,',count,'frames,',seen.size,'diagrams');
