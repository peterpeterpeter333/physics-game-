import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applySoundBeats,soundBeatIds} from '../docs/video-revision-20260924/sound-beats.mjs';
import {soundBeatFrame,soundBeatKinds,soundBeatDiagram} from './sound-beat-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applySoundBeats(plan);
let count=0;const seen=new Set();
for(const id of soundBeatIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=soundBeatFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...soundBeatKinds].sort());
for(const kind of soundBeatKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>soundBeatDiagram(kind,p))).size>1);
assert.equal(new Set(soundBeatKinds.map(kind=>soundBeatDiagram(kind,.5))).size,soundBeatKinds.length);
assert.equal(Math.abs(442-440),2);
assert.equal(1/2,.5);
assert.ok(Math.abs(Math.pow(Math.cos(2*Math.PI*.25),2))<1e-12);
assert.match(plan.find(c=>c.id==='w-sound-advanced').scenes[1].narration,/一回多く/);
console.log('PASS sound beats:',soundBeatIds.length,'films,',count,'frames,',seen.size,'diagrams');
