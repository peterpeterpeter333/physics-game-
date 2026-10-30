import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyFaradayLenz,faradayLenzIds} from '../docs/video-revision-20260924/faraday-lenz.mjs';
import {faradayLenzFrame,faradayLenzKinds,faradayLenzDiagram} from './faraday-lenz-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyFaradayLenz(plan);
let count=0;const seen=new Set();
for(const id of faradayLenzIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=faradayLenzFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...faradayLenzKinds].sort());
for(const kind of faradayLenzKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>faradayLenzDiagram(kind,p))).size>1);
assert.equal(new Set(faradayLenzKinds.map(kind=>faradayLenzDiagram(kind,.5))).size,faradayLenzKinds.length);
assert.ok(Math.abs(.01/.1-.1)<1e-12);
assert.equal(100*.1,10);
const phi=t=>.01*t*t,slope=h=>(phi(1+h)-phi(1))/h;
assert.ok(Math.abs(slope(.12)-.02)<Math.abs(slope(.85)-.02));
assert.ok(-100*(.01/.1)<0);
console.log('PASS Faraday Lenz:',faradayLenzIds.length,'films,',count,'frames,',seen.size,'diagrams');
