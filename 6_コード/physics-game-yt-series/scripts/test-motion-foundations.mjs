import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {motionFoundationIds} from '../docs/video-revision-20260924/motion-foundations.mjs';
import {motionFoundationFrame,motionDiagram,motionDiagramKinds} from './motion-foundation-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));
const expected={
 'm1-velocity-intro':['DDDD','FF','DD'],
 'm1-velocity-middle':['DD','FDFF','DDD'],
 'm1-velocity-advanced':['DFD','DF','FFFF','DF','FD'],
 'm1-acceleration-intro':['DDD','FF','DDD'],
 'm1-acceleration-middle':['DF','FFF','DDDD'],
 'm1-acceleration-advanced':['DD','DDFF','DD']
};
let frames=0;const used=new Set();
for(const id of motionFoundationIds){
 const c=structuredClone(plan.find(c=>c.id===id));assert.ok(c);
 assert.deepEqual(c.scenes.map(s=>s.cues.map(q=>q.display==='diagram'?'D':'F').join('')),expected[id],id);
 let start=0;
 for(const s of c.scenes){
  assert.equal(s.narration,s.utterances.map(u=>u.subtitle).join(''));
  assert.deepEqual(s.utterances,s.cues.map(({subtitle,reading})=>({subtitle,reading})));
  s.start=start;s.captions=s.utterances.map(u=>{assert.ok(u.reading&&!/\s/.test(u.reading));const cap={start,end:start+5,text:u.subtitle};start+=5;return cap;});s.end=start;
  for(const q of s.cues)if(q.display==='diagram'){assert.ok(motionDiagramKinds.includes(q.diagram));used.add(q.diagram);}else assert.ok(q.formula.length&&q.operation);
 }
 c.duration=start;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.02,.2,.5,.98]){
  const svg=motionFoundationFrame(c,s,cap.start+5*p);
  assert.ok(!/NaN|undefined|Infinity|data-mjx-error|data-mml-node="merror"/.test(svg),`${id}/${s.index}`);
  assert.equal((svg.match(/data-presentation=/g)??[]).length,1);
  if(svg.includes('data-presentation="diagram"')){assert.ok(!svg.includes('data-mml-node'));assert.match(svg,/<(?:circle|polyline|line)\b/);}
  // Rasterisation catches malformed XML/font/math markup, not just string errors.
  if(p===.5)await sharp(Buffer.from(svg)).png().toBuffer();
  frames++;
 }
 for(const boundary of c.navigationBreaks??[])assert.ok(boundary>0&&boundary<c.scenes.length);
}
assert.deepEqual([...used].sort(),[...motionDiagramKinds].sort());
assert.throws(()=>motionDiagram('unrelated',.5),/No authored/);
assert.equal((7-1)/(4-2),3);assert.equal((8-2)/2,3);assert.equal((-4)-(-2),-2);
for(const dt of [1,.5,.1,.01])assert.ok(Math.abs(((2+dt)**2-4)/dt-(4+dt))<1e-10);
for(const h of [.9,.1,.01]){
 const v0=[0,-1],v1=[-Math.sin(h),-Math.cos(h)],dv=v1.map((v,i)=>v-v0[i]);
 assert.ok(Math.abs(Math.atan2(dv[1],-dv[0])-h/2)<1e-12);
}
const advanced=plan.find(c=>c.id==='m1-velocity-advanced');
assert.deepEqual(advanced.navigationBreaks,[2,4]);
const words=advanced.scenes.map(s=>s.narration).join('');
assert.ok(words.indexOf('二秒ちょうど')<words.indexOf('微分'));
assert.ok(words.includes('時間の幅はゼロではない'));
assert.ok(words.includes('その「速度の変わり方」を表すのが、加速度です。'));
assert.ok(!words.includes('次の加速度'));
const velocityMiddle=plan.find(c=>c.id==='m1-velocity-middle');
assert.equal(velocityMiddle.scenes[2].cues[2].diagram,'secant-shrink','A shrinking interval must actually shrink');
assert.equal(velocityMiddle.scenes[1].cues[0].symbolFocus,true);
assert.deepEqual(advanced.scenes[2].cues[1].intermediateFormula,['t^2+t\\Delta t+t\\Delta t+(\\Delta t)^2'],'Show all four products before collecting like terms');
for(const t of [1,2,3])for(const h of [.01,.5,1])assert.ok(Math.abs((t+h)**2-(t*t+t*h+t*h+h*h))<1e-10);
assert.notEqual(motionDiagram('secant-shrink',.1),motionDiagram('secant-shrink',.8));
assert.match(motionDiagram('round-trip',.1),/0 m（出発点）/,'The first lesson must identify its position origin');
assert.ok(!motionDiagram('compare-rest',.1).includes('戻った後'),'Do not label a person still walking as already back');
assert.ok(velocityMiddle.scenes.some(s=>s.utterances.some(u=>u.subtitle.includes('ブイバー')&&u.reading.includes('ブイバー'))));
const accelerationMiddle=plan.find(c=>c.id==='m1-acceleration-middle');
assert.equal(accelerationMiddle.scenes[1].cues[0].symbolFocus,true);
assert.ok(accelerationMiddle.scenes.some(s=>s.utterances.some(u=>u.subtitle.includes('エーバー')&&u.reading.includes('エーバー'))));
const mid=plan.find(c=>c.id==='m1-acceleration-middle').scenes.map(s=>s.narration).join('');
assert.ok(mid.includes('二つの端の記録だけでは'));
assert.ok(mid.includes('速度が一定なら'));
assert.ok(mid.includes('加速度が一定の正の値なら'));
assert.ok(plan.find(c=>c.id==='m1-velocity-intro').scenes[0].narration.includes('往復にかかった時間は、合計六秒'));
console.log(`PASS: six motion films, ${frames} cue frames, ${used.size} dedicated diagram types, readings, math, focus and manual breaks`);
