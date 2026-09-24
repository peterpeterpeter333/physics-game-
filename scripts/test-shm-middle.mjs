import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyShmMiddle,shmMiddleIds} from '../docs/video-revision-20260924/shm-middle.mjs';
import {shmMiddleFrame,shmMiddleKinds,shmMiddleDiagram} from './shm-middle-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyShmMiddle(plan);
let count=0;const seen=new Set();
for(const id of shmMiddleIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=shmMiddleFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...shmMiddleKinds].sort());
for(const kind of shmMiddleKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>shmMiddleDiagram(kind,p))).size>1,'Static diagram '+kind);
assert.equal(new Set(shmMiddleKinds.map(kind=>shmMiddleDiagram(kind,.5))).size,shmMiddleKinds.length);
assert.equal(Math.sqrt(4),2);assert.equal(Math.sqrt(4*3/12)/Math.sqrt(3/12),2);
for(const theta of [0,.4,1.2,2.8]){const A=2,omega=3,x=A*Math.cos(theta);assert.ok(Math.abs(-A*omega**2*Math.cos(theta)+omega**2*x)<1e-10);}
for(const id of shmMiddleIds)for(const s of plan.find(c=>c.id===id).scenes)for(const q of s.cues)for(const f of [...q.formula,...(q.previousFormula??[])])assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'),'Doubled TeX escape renders letters instead of a fraction');
assert.match(plan.find(c=>c.id==='m-shm-middle').scenes[0].narration,/つり合いの位置をゼロ/);
assert.match(plan.find(c=>c.id==='hm-why-21').scenes[0].narration,/中心以外の位置/);
console.log(`PASS shm middle: ${shmMiddleIds.length} films, ${count} frames, ${seen.size} diagrams`);
