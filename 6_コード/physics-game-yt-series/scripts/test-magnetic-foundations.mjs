import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyMagneticFoundations,magneticFoundationIds} from '../docs/video-revision-20260924/magnetic-foundations.mjs';
import {magneticFoundationFrame,magneticFoundationKinds,magneticFoundationDiagram} from './magnetic-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyMagneticFoundations(plan);
let count=0;const seen=new Set();
for(const id of magneticFoundationIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=magneticFoundationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...magneticFoundationKinds].sort());
for(const kind of magneticFoundationKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>magneticFoundationDiagram(kind,p))).size>1);
assert.equal(new Set(magneticFoundationKinds.map(kind=>magneticFoundationDiagram(kind,.5))).size,magneticFoundationKinds.length);
for(const theta of [0,.3,.7,Math.PI/2]){const n=[Math.cos(theta),0,Math.sin(theta)],a=[-Math.sin(theta),0,Math.cos(theta)];assert.ok(Math.abs(n[0]*a[0]+n[2]*a[2])<1e-12);assert.ok(Math.abs(Math.hypot(...n)-1)<1e-12);}
assert.ok(Math.abs(.5*.02*Math.cos(Math.PI/3)-.005)<1e-12);
console.log('PASS magnetic foundations:',magneticFoundationIds.length,'films,',count,'frames,',seen.size,'diagrams');
