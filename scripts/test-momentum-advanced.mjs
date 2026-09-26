import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyMomentumAdvanced,momentumAdvancedIds} from '../docs/video-revision-20260924/momentum-advanced.mjs';
import {momentumAdvancedFrame,momentumAdvancedKinds,momentumAdvancedDiagram} from './momentum-advanced-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyMomentumAdvanced(plan);
let count=0;const seen=new Set();
for(const id of momentumAdvancedIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=momentumAdvancedFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...momentumAdvancedKinds].sort());
for(const kind of momentumAdvancedKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>momentumAdvancedDiagram(kind,p))).size>1,'Static diagram '+kind);
assert.equal(new Set(momentumAdvancedKinds.map(kind=>momentumAdvancedDiagram(kind,.5))).size,momentumAdvancedKinds.length);
assert.equal((2*3+1*0)/(2+1),2);assert.equal(.5*2*3**2-.5*3*2**2,3);
for(const id of momentumAdvancedIds)for(const s of plan.find(c=>c.id===id).scenes)for(const q of s.cues)for(const f of [...q.formula,...(q.previousFormula??[])])assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'),'Doubled TeX escape renders letters instead of a fraction');
assert.match(plan.find(c=>c.id==='m-momentum-advanced').scenes[0].narration,/水平方向の力積は無視/);
assert.match(plan.find(c=>c.id==='hm-why-17').scenes[0].narration,/消えたのではなく/);
// Equal screen-time intervals must show the stated 3:2 speed ratio.
const cartX=p=>Number(momentumAdvancedDiagram('collision-numbers',p).match(/<rect x="([\d.]+)"/)[1])+50;
const beforeDistance=cartX(.2)-cartX(.1),afterDistance=cartX(.7)-cartX(.6);
assert.ok(Math.abs(beforeDistance/afterDistance-1.5)<1e-10,'Collision must slow from 3 m/s to 2 m/s');
assert.ok(Math.abs(cartX(.3)-cartX(.2)-beforeDistance)<1e-10,'Uniform motion before collision');
console.log(`PASS momentum advanced: ${momentumAdvancedIds.length} films, ${count} frames, ${seen.size} diagrams`);
