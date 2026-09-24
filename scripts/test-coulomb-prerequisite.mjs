import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyCoulombPrerequisite,coulombPrerequisiteIds} from '../docs/video-revision-20260924/coulomb-prerequisite.mjs';
import {coulombPrerequisiteFrame,coulombPrerequisiteKinds,coulombPrerequisiteDiagram} from './coulomb-prerequisite-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyCoulombPrerequisite(plan);
let count=0;const seen=new Set();
for(const id of coulombPrerequisiteIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=coulombPrerequisiteFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...coulombPrerequisiteKinds].sort());
for(const kind of coulombPrerequisiteKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>coulombPrerequisiteDiagram(kind,p))).size>1);
assert.equal(new Set(coulombPrerequisiteKinds.map(kind=>coulombPrerequisiteDiagram(kind,.5))).size,coulombPrerequisiteKinds.length);
assert.equal(3/1,6/2);
assert.equal(1/(2**2),.25);
assert.equal(3+(-3),0);
console.log('PASS Coulomb prerequisite:',coulombPrerequisiteIds.length,'film,',count,'frames,',seen.size,'diagrams');
