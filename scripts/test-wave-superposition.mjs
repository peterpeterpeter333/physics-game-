import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyWaveSuperposition,waveSuperpositionIds} from '../docs/video-revision-20260924/wave-superposition.mjs';
import {waveSuperpositionFrame,waveSuperpositionKinds,waveSuperpositionDiagram} from './wave-superposition-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyWaveSuperposition(plan);
let count=0;const seen=new Set();
for(const id of waveSuperpositionIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=waveSuperpositionFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...waveSuperpositionKinds].sort());
for(const kind of waveSuperpositionKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>waveSuperpositionDiagram(kind,p))).size>1);
assert.equal(new Set(waveSuperpositionKinds.map(kind=>waveSuperpositionDiagram(kind,.5))).size,waveSuperpositionKinds.length);
assert.equal(1+1,2);
assert.equal(1+(-1),0);
for(const t of [0,.3,1])for(const x of [0,Math.PI,2*Math.PI])assert.ok(Math.abs(Math.sin(x-t)+Math.sin(x+t))<1e-12);
assert.match(plan.find(c=>c.id==='prep-superposition').scenes[2].narration,/同じ振幅/);
console.log('PASS wave superposition:',waveSuperpositionIds.length,'films,',count,'frames,',seen.size,'diagrams');
