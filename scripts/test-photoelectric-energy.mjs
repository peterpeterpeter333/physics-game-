import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyPhotoelectricEnergy,photoelectricEnergyIds} from '../docs/video-revision-20260924/photoelectric-energy.mjs';
import {photoelectricEnergyFrame,photoelectricEnergyKinds,photoelectricEnergyDiagram} from './photoelectric-energy-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyPhotoelectricEnergy(plan);
let count=0;const seen=new Set();
for(const id of photoelectricEnergyIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=photoelectricEnergyFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...photoelectricEnergyKinds].sort());
for(const kind of photoelectricEnergyKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>photoelectricEnergyDiagram(kind,p))).size>1);
assert.equal(new Set(photoelectricEnergyKinds.map(kind=>photoelectricEnergyDiagram(kind,.5))).size,photoelectricEnergyKinds.length);
assert.ok(Math.abs((3-2.3)-.7)<1e-12);
assert.ok(Math.abs((.7*1.602176634e-19)/1.602176634e-19-.7)<1e-12);
assert.match(plan.find(c=>c.id==='a-photon-middle').condition,/一光子/);
console.log('PASS photoelectric energy:',photoelectricEnergyIds.length,'films,',count,'frames,',seen.size,'diagrams');
