import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyHeatMelting,heatMeltingIds} from '../docs/video-revision-20260924/heat-melting.mjs';
import {heatMeltingFrame,heatMeltingKinds,heatMeltingDiagram} from './heat-melting-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyHeatMelting(plan);
let count=0;const seen=new Set();
for(const id of heatMeltingIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=heatMeltingFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...heatMeltingKinds].sort());
for(const kind of heatMeltingKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>heatMeltingDiagram(kind,p))).size>1);
assert.equal(new Set(heatMeltingKinds.map(kind=>heatMeltingDiagram(kind,.5))).size,heatMeltingKinds.length);
assert.equal(100*334+100*4.2*20,41800);
assert.ok(heatMeltingDiagram('meltinginsert-hot-cold',1).includes('熱平衡'));
assert.ok(!heatMeltingDiagram('meltinginsert-hot-cold',.2).includes('熱平衡'));
assert.equal(100*4.2*(80-50),100*4.2*(50-20));
assert.match(plan.find(c=>c.id==='t-heat-advanced').scenes[1].cues[0].operation,/J\/g/);
console.log('PASS heat melting:',heatMeltingIds.length,'films,',count,'frames,',seen.size,'diagrams');
