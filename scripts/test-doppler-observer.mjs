import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyDopplerObserver,dopplerObserverIds} from '../docs/video-revision-20260924/doppler-observer.mjs';
import {dopplerObserverFrame,dopplerObserverKinds,dopplerObserverDiagram} from './doppler-observer-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyDopplerObserver(plan);
let count=0;const seen=new Set();
for(const id of dopplerObserverIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=dopplerObserverFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...dopplerObserverKinds].sort());
for(const kind of dopplerObserverKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>dopplerObserverDiagram(kind,p))).size>1);
assert.equal(new Set(dopplerObserverKinds.map(kind=>dopplerObserverDiagram(kind,.5))).size,dopplerObserverKinds.length);
assert.equal((340+34)/340,1.1);
assert.notEqual((340+34)/340,340/(340-34));
assert.equal(340+34,374);
console.log('PASS doppler observer:',dopplerObserverIds.length,'films,',count,'frames,',seen.size,'diagrams');
