import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applySineDerivative,sineDerivativeIds} from '../docs/video-revision-20260924/sine-derivative.mjs';
import {sineDerivativeFrame,sineDerivativeKinds,sineDerivativeDiagram} from './sine-derivative-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applySineDerivative(plan);
let count=0;const seen=new Set();
for(const id of sineDerivativeIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=sineDerivativeFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...sineDerivativeKinds].sort());
for(const kind of sineDerivativeKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>sineDerivativeDiagram(kind,p))).size>1,'Static diagram '+kind);
assert.equal(new Set(sineDerivativeKinds.map(kind=>sineDerivativeDiagram(kind,.5))).size,sineDerivativeKinds.length);
for(const h of [.01,.1,.4,.9]){assert.ok(Math.sin(h)<h&&h<Math.tan(h));assert.ok(Math.cos(h)<Math.sin(h)/h&&Math.sin(h)/h<1);assert.ok(Math.abs((Math.cos(h)-1)/h+Math.sin(h)**2/(h*(1+Math.cos(h))))<1e-12);}
assert.ok(Math.abs(Math.sin(.001)/.001-1)<1e-6);
for(const id of sineDerivativeIds)for(const s of plan.find(c=>c.id===id).scenes)for(const q of s.cues)for(const f of [...q.formula,...(q.previousFormula??[])])assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'),'Doubled TeX escape renders letters instead of a fraction');
assert.match(plan.find(c=>c.id==='prep-sin-derivative').scenes[0].narration,/面積/);
assert.match(plan.find(c=>c.id==='prep-sin-derivative').scenes[1].narration,/マイナス/);
console.log(`PASS sine derivative: ${sineDerivativeIds.length} films, ${count} frames, ${seen.size} diagrams`);
