import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applySineMotion,sineMotionIds} from '../docs/video-revision-20260924/sine-motion.mjs';
import {sineMotionFrame,sineMotionKinds,sineMotionDiagram} from './sine-motion-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applySineMotion(plan);
let count=0;const seen=new Set();
for(const id of sineMotionIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)+'frac'));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=sineMotionFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...sineMotionKinds].sort());
for(const kind of sineMotionKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>sineMotionDiagram(kind,p))).size>1);
assert.equal(new Set(sineMotionKinds.map(kind=>sineMotionDiagram(kind,.5))).size,sineMotionKinds.length);
assert.ok(Math.abs(Math.sin(.002)/.001-2)<.000002);
for(const t of [0,.3,1,2]){const dt=1e-4,A=2,w=3,phi=.4,x=t=>A*Math.cos(w*t+phi);assert.ok(Math.abs((x(t+dt)-x(t-dt))/(2*dt)+A*w*Math.sin(w*t+phi))<1e-6);assert.ok(Math.abs((x(t+dt)-2*x(t)+x(t-dt))/dt**2+w*w*x(t))<1e-5);}
console.log(`PASS sine motion: ${sineMotionIds.length} films, ${count} frames, ${seen.size} diagrams`);
