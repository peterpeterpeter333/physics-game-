import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyBohrRadius,bohrRadiusIds} from '../docs/video-revision-20260924/bohr-radius.mjs';
import {bohrRadiusFrame,bohrRadiusKinds,bohrRadiusDiagram} from './bohr-radius-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyBohrRadius(plan);
let count=0;const seen=new Set();
for(const id of bohrRadiusIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=bohrRadiusFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...bohrRadiusKinds].sort());
for(const kind of bohrRadiusKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>bohrRadiusDiagram(kind,p))).size>1);
assert.equal(new Set(bohrRadiusKinds.map(kind=>bohrRadiusDiagram(kind,.5))).size,bohrRadiusKinds.length);
const hbar=1.055e-34,m=9.11e-31,k=8.99e9,e=1.60e-19,r=hbar*hbar/(m*k*e*e);
assert.ok(Math.abs(r/1e-9-.053)<.001);
for(const n of [1,2,3]){const rn=n*n*r,v=n*hbar/(m*rn);assert.ok(Math.abs((k*e*e/rn**2)/(m*v*v/rn)-1)<1e-12);}
console.log('PASS Bohr radius:',bohrRadiusIds.length,'films,',count,'frames,',seen.size,'diagrams');
