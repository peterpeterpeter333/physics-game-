import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyMomentumMiddle} from '../docs/video-revision-20260924/momentum-middle.mjs';
import {momentumMiddleFrame,momentumMiddleDiagram,momentumMiddleKinds} from './momentum-middle-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyMomentumMiddle(plan);
const c=plan.find(c=>c.id==='m-momentum-middle');assert.ok(c.manuscriptScenes);let t=0,count=0;const seen=new Set();
for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=momentumMiddleFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
assert.deepEqual([...seen].sort(),[...momentumMiddleKinds].sort());
for(const kind of momentumMiddleKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>momentumMiddleDiagram(kind,p))).size>1,'Static '+kind);
assert.equal(.06*5,.3);assert.equal(.3/.01,30);assert.ok(Math.abs(.3/.1-3)<1e-9);
assert.match(c.scenes[4].narration,/重力/);assert.match(c.scenes[2].narration,/最大/);assert.equal(c.navigationBreaks.length,4);
console.log(`PASS momentum middle: ${count} frames, ${seen.size} diagrams; net/contact force and average/peak distinguished`);
