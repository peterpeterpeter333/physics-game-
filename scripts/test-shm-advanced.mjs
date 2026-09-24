import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyShmAdvanced,shmAdvancedIds} from '../docs/video-revision-20260924/shm-advanced.mjs';
import {shmAdvancedFrame,shmAdvancedKinds,shmAdvancedDiagram} from './shm-advanced-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyShmAdvanced(plan);
let count=0;const seen=new Set();
for(const id of shmAdvancedIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=shmAdvancedFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...shmAdvancedKinds].sort());
for(const kind of shmAdvancedKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>shmAdvancedDiagram(kind,p))).size>1);
assert.equal(new Set(shmAdvancedKinds.map(kind=>shmAdvancedDiagram(kind,.5))).size,shmAdvancedKinds.length);
for(const phi of [0,Math.PI/2,.4])for(const t of [0,.3,1,2]){const A=2,m=3,k=12,w=Math.sqrt(k/m),x=A*Math.cos(w*t+phi),a=-w*w*x;assert.ok(Math.abs(m*a+k*x)<1e-10);}
assert.match(plan.find(c=>c.id==='m-shm-advanced').scenes[1].cues[0].operation,/x≠0/);
console.log(`PASS shm advanced: ${shmAdvancedIds.length} films, ${count} frames, ${seen.size} diagrams`);
