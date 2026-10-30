import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyHeatCycle,heatCycleIds} from '../docs/video-revision-20260924/heat-cycle.mjs';
import {heatCycleFrame,heatCycleKinds,heatCycleDiagram} from './heat-cycle-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyHeatCycle(plan);
let count=0;const seen=new Set();
for(const id of heatCycleIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=heatCycleFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...heatCycleKinds].sort());
for(const kind of heatCycleKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>heatCycleDiagram(kind,p))).size>1);
assert.equal(new Set(heatCycleKinds.map(kind=>heatCycleDiagram(kind,.5))).size,heatCycleKinds.length);
assert.equal(1000-600,400);
assert.equal(400/1000,.4);
assert.equal(plan.find(c=>c.id==='prep-heat-cycle').scenes[1].cues.length,1,'Do not preteach efficiency before its main derivation');
assert.match(heatCycleDiagram('heatcycle-work-signs',.5),/ピストンの移動 ←/);
assert.match(heatCycleDiagram('heatcycle-work-signs',.5),/気体が押す力 →/);
assert.match(plan.find(c=>c.id==='prep-heat-cycle').scenes[2].narration,/断熱/);
assert.match(plan.find(c=>c.id==='t-firstlaw-advanced').scenes[2].narration,/第二法則/);
console.log('PASS heat cycle:',heatCycleIds.length,'films,',count,'frames,',seen.size,'diagrams');
