import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyGasParticles,gasParticleIds} from '../docs/video-revision-20260924/gas-particles.mjs';
import {gasParticleFrame,gasParticleKinds,gasParticleDiagram} from './gas-particle-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyGasParticles(plan);
let count=0;const seen=new Set();
for(const id of gasParticleIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=gasParticleFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...gasParticleKinds].sort());
for(const kind of gasParticleKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>gasParticleDiagram(kind,p))).size>1);
assert.equal(new Set(gasParticleKinds.map(kind=>gasParticleDiagram(kind,.5))).size,gasParticleKinds.length);
assert.equal((-2*3)-(2*3),-12);
assert.equal((2*2*3)/(2*4/3),2*3*3/4);
assert.match(plan.find(c=>c.id==='prep-gas-particles').scenes[0].narration,/後の運動量から前の運動量/);
const prerequisite=plan.find(c=>c.id==='prep-gas-particles');
assert.equal(prerequisite.scenes.length,3);
assert.doesNotMatch(prerequisite.scenes.map(s=>s.narration).join(''),/内部エネルギー/);
assert.match(prerequisite.scenes[2].narration,/圧力と体積の積/);
console.log('PASS gas particles:',gasParticleIds.length,'films,',count,'frames,',seen.size,'diagrams');
