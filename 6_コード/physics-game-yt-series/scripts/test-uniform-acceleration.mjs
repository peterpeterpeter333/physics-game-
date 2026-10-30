import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyUniformAcceleration} from '../docs/video-revision-20260924/uniform-acceleration.mjs';
import {uniformAccelerationFrame,uniformDiagram} from './uniform-acceleration-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));
applyUniformAcceleration(plan);const c=plan.find(c=>c.id==='m1-uniform-accel-intro');
assert.equal(c.scenes.length,3);assert.ok(c.manuscriptScenes);
assert.deepEqual(c.scenes.map(s=>s.cues.map(q=>q.display[0]).join('')),['ddd','eeeed','dd']);
let time=0,count=0;
for(const s of c.scenes){
 s.start=time;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));const start=time;time+=5;return{text:q.subtitle,start,end:time};});s.end=time;
 assert.equal(s.narration,s.utterances.map(u=>u.subtitle).join(''));
}
c.duration=time;
for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){
 const svg=uniformAccelerationFrame(c,s,cap.start+(cap.end-cap.start)*p);
 assert.equal((svg.match(/data-presentation=/g)||[]).length,1);
 assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));
 await sharp(Buffer.from(svg)).png().toBuffer();count++;
}
assert.match(c.scenes[1].narration,/単位の秒が一つ約分/);
assert.match(c.scenes[1].narration,/ブイゼロは最初の速度/);
assert.match(c.scenes[2].narration,/中級の動画で扱います/);
assert.match(uniformDiagram('uniform-second',1),/速度 8.0 m\/s/);
assert.match(uniformDiagram('uniform-first',1),/速度 5.0 m\/s/);
assert.throws(()=>uniformDiagram('missing',.5));
console.log(`PASS uniform acceleration intro: ${count} frames, 3 manuscript boundaries, units, symbols, single-focus scenes`);
