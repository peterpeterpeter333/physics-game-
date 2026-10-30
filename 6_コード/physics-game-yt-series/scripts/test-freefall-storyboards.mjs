import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {applyFreefall,freefallIds} from '../docs/video-revision-20260924/freefall-storyboards.mjs';
import {freefallFrame,freefallKinds,freefallDiagram} from './freefall-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));applyFreefall(plan);
const expected={'m-freefall-intro':['dd','dd','dd'],'m-freefall-middle':['dde','eeee','eeee'],'m-freefall-advanced':['dee','deeee','dd'],'hm-why-08':['dddd'],'hm-why-09':['eeeeeee'],'hm-why-23':['dddd']};
let count=0;const seen=new Set();
for(const id of freefallIds){
 const c=plan.find(c=>c.id===id);assert.ok(c.manuscriptScenes);assert.deepEqual(c.scenes.map(s=>s.cues.map(q=>q.display[0]).join('')),expected[id]);
 let t=0;for(const s of c.scenes){s.start=t;s.captions=s.cues.map(q=>{assert.ok(q.reading&&!/\s/.test(q.reading));assert.equal(q.subtitle.split('。').filter(Boolean).length,q.reading.split('。').filter(Boolean).length);if(q.diagram)seen.add(q.diagram);const start=t;t+=5;return{text:q.subtitle,start,end:t};});s.end=t;}c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.05,.35,.7,.95]){const svg=freefallFrame(c,s,cap.start+5*p);assert.ok(!/NaN|undefined|data-mjx-error/.test(svg));assert.equal((svg.match(/data-presentation=/g)||[]).length,1);await sharp(Buffer.from(svg)).png().toBuffer();count++;}
}
assert.deepEqual([...seen].sort(),[...freefallKinds].sort());
const txt=id=>plan.find(c=>c.id===id).scenes.map(s=>s.narration).join('');
assert.match(txt('hm-why-08'),/最高点から先.*ずっと働かなければ/);
assert.match(txt('m-freefall-middle'),/正の数/);
assert.match(txt('m-freefall-middle'),/上向きの速度が減った分/);
assert.match(txt('m-freefall-middle'),/三十九・二から十九・六を引いた/);
assert.match(txt('m-freefall-advanced'),/前提動画で導いたエネルギー/);
// The highlighted point must pass the zero line, not merely stop on it.
assert.match(freefallDiagram('apex-crossing',1),/cy="322.5"/);
assert.match(freefallDiagram('apex-crossing',1),/この交点で速度が0/);
assert.match(txt('m-freefall-advanced'),/球の質量が違っても/);
assert.match(txt('hm-why-09'),/一定の力で一直線/);
assert.ok(Math.abs(19.6**2/(2*9.8)-19.6)<1e-10);
console.log(`PASS freefall: ${freefallIds.length} films, ${count} frames, ${seen.size} diagrams, conditions/signs/algebra/source scenes`);
