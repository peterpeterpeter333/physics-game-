import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyAdditionTheorem,applyAdditionPrerequisiteRoutes} from '../docs/video-revision-20260924/addition-theorem.mjs';
import {additionTheoremFrame,additionDiagramKinds} from './addition-theorem-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyAdditionTheorem(plan);
const c=plan.find(c=>c.id==='prep-addition-theorem');assert.ok(c.manuscriptScenes);
assert.deepEqual(c.navigationBreaks,[1,2,3,4,5,6]);
let t=0,count=0;const seen=new Set();
for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=additionTheoremFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
assert.deepEqual([...seen].sort(),[...additionDiagramKinds].sort());
const routes={one:{required:['a','prep-algebra-projectile'],review:['prep-algebra-projectile']},two:{required:['prep-sin-derivative'],review:[]},other:{required:['untouched'],review:[]}};
applyAdditionPrerequisiteRoutes(routes);const once=structuredClone(routes);applyAdditionPrerequisiteRoutes(routes);assert.deepEqual(routes,once);
assert.deepEqual(routes.one.required,['a','prep-addition-theorem','prep-algebra-projectile']);assert.deepEqual(routes.two.required,['prep-addition-theorem','prep-sin-derivative']);assert.deepEqual(routes.other.required,['untouched']);
for(const a of [-2,-.2,.7,2,4])for(const b of [-1,.3,1.7])assert.ok(Math.abs(Math.sin(a+b)-Math.sin(a)*Math.cos(b)-Math.cos(a)*Math.sin(b))<1e-12);
console.log(`PASS addition theorem: ${count} frames, ${seen.size} diagrams, angle substitution and prerequisite ordering`);
