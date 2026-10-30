import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyTravelingWave,travelingWaveIds} from '../docs/video-revision-20260924/traveling-wave.mjs';
import {travelingWaveFrame,travelingWaveKinds,travelingWaveDiagram} from './traveling-wave-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyTravelingWave(plan);
let count=0;const seen=new Set();
for(const id of travelingWaveIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=travelingWaveFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),travelingWaveKinds.filter(k=>k!=='travelprep-delay-transport').sort());
for(const kind of travelingWaveKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>travelingWaveDiagram(kind,p))).size>1);
assert.equal(new Set(travelingWaveKinds.map(kind=>travelingWaveDiagram(kind,.5))).size,travelingWaveKinds.length);
assert.equal(4/2,2);
assert.equal(5-4/2,3);
for(const t of [0,.3,1])for(const x of [0,.5,2]){const v=2,dt=.2;assert.ok(Math.abs((t+dt)-(x+v*dt)/v-(t-x/v))<1e-12);}
assert.equal(plan.find(c=>c.id==='prep-traveling-wave').scenes.length,1);
assert.match(plan.find(c=>c.id==='w-basics-advanced').scenes[3].narration,/約分/);
console.log('PASS traveling wave:',travelingWaveIds.length,'films,',count,'frames,',seen.size,'diagrams');
