import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyMoleFoundations,moleFoundationIds} from '../docs/video-revision-20260924/mole-foundations.mjs';
import {moleFoundationFrame,moleFoundationKinds,moleFoundationDiagram} from './mole-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyMoleFoundations(plan);
let count=0;const seen=new Set();
for(const id of moleFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=moleFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...moleFoundationKinds].sort());
for(const kind of moleFoundationKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>moleFoundationDiagram(kind,p))).size>1);
assert.equal(new Set(moleFoundationKinds.map(kind=>moleFoundationDiagram(kind,.5))).size,moleFoundationKinds.length);
assert.equal(36/18,2);
assert.ok(Math.abs(6.02214076*1.380649-8.31446261815324)<1e-12);
assert.equal((6.02214076*1.380649).toFixed(2),'8.31');
assert.match(plan.find(c=>c.id==='prep-mole').scenes[0].narration,/正確な値として定義/);
console.log('PASS mole foundations:',moleFoundationIds.length,'films,',count,'frames,',seen.size,'diagrams');
