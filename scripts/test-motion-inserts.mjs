import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {motionInsertIds,applyMotionInserts,motionInsertRoutes} from '../docs/video-revision-20260924/motion-inserts.mjs';
import {motionInsertFrame,motionInsertDiagram,motionInsertDiagramKinds,secantSample,vectorSample} from './motion-insert-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));
const copy=structuredClone(plan);applyMotionInserts(copy);assert.deepEqual(copy,plan,'Idempotent preparation');
const expected={'hm-why-01':'DDDDDFD','hm-why-02':'DFDDFFF','hm-why-03':'DFDFFFFFFFFD','hm-why-04':'DDDDDDDD'};
const used=new Set();let frames=0;
for(const id of motionInsertIds){
 const c=structuredClone(plan.find(c=>c.id===id));let t=0;
 assert.ok(c.manuscriptScenes[0].utterances.every(u=>u.source?.line));
 assert.equal(c.scenes.flatMap(s=>s.cues).map(q=>q.display==='diagram'?'D':'F').join(''),expected[id]);
 for(const s of c.scenes){
  assert.equal(s.cues.map(q=>q.subtitle).join(''),s.narration);
  s.start=t;s.captions=s.cues.map(q=>{
   assert.ok(q.source?.line&&q.reading&&!/\s/.test(q.reading));
   assert.equal(q.subtitle.split('。').filter(Boolean).length,q.reading.split('。').filter(Boolean).length);
   if(q.display==='diagram'){used.add(q.diagram);assert.ok(motionInsertDiagramKinds.includes(q.diagram));}
   else for(const f of q.formula)assert.ok(!/[\u0000-\u001f]/.test(f),'Unescaped TeX');
   const cap={start:t,end:t+5,text:q.subtitle};t+=5;return cap;
  });s.end=t;
 }
 c.duration=t;
 for(const s of c.scenes)for(const cap of s.captions)for(const p of [.01,.25,.5,.99]){
  const svg=motionInsertFrame(c,s,cap.start+(cap.end-cap.start)*p);
  assert.ok(!/NaN|undefined|Infinity|data-mjx-error|data-mml-node="merror"/.test(svg));
  assert.equal((svg.match(/data-presentation=/g)??[]).length,1);
  if(svg.includes('data-presentation="diagram"'))assert.ok(!svg.includes('data-mml-node'));
  if(p===.5)await sharp(Buffer.from(svg)).png().toBuffer();frames++;
 }
}
assert.deepEqual([...used].sort(),[...motionInsertDiagramKinds].sort());
for(const kind of used)for(const progress of [0,.5,1]){
 const svg=motionInsertDiagram(kind,progress);
 for(const match of svg.matchAll(/<text\b[^>]*\by="([\d.-]+)"[^>]*>/g))assert.ok(+match[1]<=500,kind+' label below visible area');
}
for(const [h,v]of [[1,3],[.1,2.1],[.01,2.01]]){
 assert.equal(secantSample(h).average,v);
 assert.ok(Math.abs(((1+h)**2-1)/h-v)<1e-10);
}
for(const h of [.85,.1,.005]){
 const {v0,v1,delta}=vectorSample(h);
 assert.ok(Math.abs(Math.hypot(...v0)-Math.hypot(...v1))<1e-10);
 assert.ok(delta[0]<0,'Inward, not merely perpendicular');
 assert.ok(Math.abs(Math.atan2(delta[1],-delta[0])-h/2)<1e-10);
}
assert.equal(Object.keys(motionInsertRoutes).length,4);
assert.ok(plan.find(c=>c.id==='hm-why-04').scenes[0].narration.includes('有限の時間'));
console.log('PASS: four manuscript supplements, '+frames+' frames, '+used.size+' diagrams, units, algebra, inward limit, source mapping.');
