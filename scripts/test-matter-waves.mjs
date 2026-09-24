import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyMatterWaves,matterWaveIds} from '../docs/video-revision-20260924/matter-waves.mjs';
import {matterWaveFrame,matterWaveKinds,matterWaveDiagram} from './matter-wave-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyMatterWaves(plan);
let count=0;const seen=new Set();
for(const id of matterWaveIds){const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const n=q.subtitle.split('。').filter(Boolean).length;assert.ok(n>0&&n<=2);assert.equal(n,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);for(const f of q.formula)assert.ok(!f.includes(String.fromCharCode(92,92)));const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=matterWaveFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...matterWaveKinds].sort());
for(const kind of matterWaveKinds)assert.ok(new Set([0,.2,.4,.6,.8,1].map(p=>matterWaveDiagram(kind,p))).size>1);
assert.equal(new Set(matterWaveKinds.map(kind=>matterWaveDiagram(kind,.5))).size,matterWaveKinds.length);
const p=Math.sqrt(2*9.11e-31*1.60e-19*100),lambda=6.63e-34/p;
assert.ok(Math.abs(p/1e-24-5.4)<.01);
assert.ok(Math.abs(lambda/1e-9-.12)<.005);
assert.ok(p/9.11e-31/3e8<.02);
console.log('PASS matter waves:',matterWaveIds.length,'films,',count,'frames,',seen.size,'diagrams');
