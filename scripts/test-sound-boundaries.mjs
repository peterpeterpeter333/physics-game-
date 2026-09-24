import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applySoundBoundaries,soundBoundaryIds} from '../docs/video-revision-20260924/sound-boundaries.mjs';
import {soundBoundaryFrame,soundBoundaryKinds,soundBoundaryDiagram} from './sound-boundary-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applySoundBoundaries(plan);
let count=0;const seen=new Set();
for(const id of soundBoundaryIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=soundBoundaryFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...soundBoundaryKinds].sort());
for(const kind of soundBoundaryKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>soundBoundaryDiagram(kind,p))).size>1);
assert.equal(new Set(soundBoundaryKinds.map(kind=>soundBoundaryDiagram(kind,.5))).size,soundBoundaryKinds.length);
assert.equal(340/(4*.5),170);
assert.equal(340/(2*.5),340);
assert.equal(Math.abs(5-7),2);
for(const z of [0,.5,1])assert.ok(Math.abs(Math.sin(Math.PI*z/2))<=1);
assert.match(plan.find(c=>c.id==='w-sound-middle').scenes[1].narration,/横向きのずれ/);
console.log('PASS sound boundaries:',soundBoundaryIds.length,'films,',count,'frames,',seen.size,'diagrams');
