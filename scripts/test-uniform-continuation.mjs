import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyUniformContinuation,uniformContinuationIds} from '../docs/video-revision-20260924/uniform-continuation.mjs';
import {uniformContinuationFrame,uniformContinuationKinds} from './uniform-continuation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyUniformContinuation(plan);
const expected={'hm-why-05':['eeeeee'],'hm-why-06':['deeede'],'hm-why-07':['deeed'],'hm-why-24':['ddddee'],'m1-uniform-accel-middle':['ddddd','dede','ed'],'m1-uniform-accel-advanced':['de','eeeee','ed']};
let count=0;const seen=new Set();
for(const id of uniformContinuationIds){
 const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);
 assert.deepEqual(c.scenes.map(s=>s.cues.map(q=>q.display[0]).join('')),expected[id]);
 let t=0;
 for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;assert.equal(s.narration,s.utterances.map(u=>u.subtitle).join(''));}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){
  const svg=uniformContinuationFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;
 }
}
assert.deepEqual([...seen].sort(),[...uniformContinuationKinds].sort());
const narration=id=>plan.find(c=>c.id===id).scenes.map(s=>s.narration).join('');
assert.match(narration('m1-uniform-accel-middle'),/時間を短く区切/);
assert.match(narration('m1-uniform-accel-middle'),/二分の一は三角形の項だけ/);
assert.match(narration('m1-uniform-accel-advanced'),/同じ値を引いて足して/);
assert.match(narration('hm-why-24'),/左の辺が最初/);
assert.match(narration('hm-why-07'),/マイナス五メートル毎秒二乗/);
assert.equal(20**2/(2*5),40);
console.log(`PASS: six uniform continuation films, ${count} frames, ${seen.size} diagrams, algebra/units/purpose/manual boundaries`);
