import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applySoundFoundations,soundFoundationIds} from '../docs/video-revision-20260924/sound-foundations.mjs';
import {soundFoundationFrame,soundFoundationKinds,soundFoundationDiagram} from './sound-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applySoundFoundations(plan);
let count=0;const seen=new Set();
for(const id of soundFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=soundFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...soundFoundationKinds].sort());
for(const kind of soundFoundationKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>soundFoundationDiagram(kind,p))).size>1);
assert.equal(new Set(soundFoundationKinds.map(kind=>soundFoundationDiagram(kind,.5))).size,soundFoundationKinds.length);
assert.match(plan.find(c=>c.id==='w-sound-intro').scenes[1].narration,/縦軸/);
assert.match(plan.find(c=>c.id==='w-sound-intro').scenes[2].narration,/振動数/);
// The air displacement gradient stays below one, so plotted material points never cross.
assert.ok(22*2*Math.PI/400<1);
console.log('PASS sound foundations:',soundFoundationIds.length,'films,',count,'frames,',seen.size,'diagrams');
