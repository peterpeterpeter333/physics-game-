import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {thermalInsertVisual,reflectedPosition,thermalInsertIds} from './thermal-insert-visuals.mjs';
import {texBox} from './revision-tex.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));
for(const id of thermalInsertIds){
 const clip=plan.find(c=>c.id===id),source=clip.scenes[0];
 const scene={...source,start:0,end:source.utterances.length*10,captions:source.utterances.map((u,i)=>({text:u.subtitle,start:i*10,end:i*10+10}))};
 const distinct=new Set();
 for(let i=0;i<scene.captions.length;i++)for(const f of [.1,.3,.6,.9]){
  const v=thermalInsertVisual(clip,scene,i*10+f*10);assert.ok(v?.diagram);
  assert.ok(!/NaN|undefined|Infinity/.test(v.diagram));
  const equation=texBox(v.equation,0,0);
  assert.ok(!/merror/.test(equation));distinct.add(v.diagram+equation);
 }
 assert.ok(distinct.size>=3,`${id}: insufficient visual progression`);
}
// The same speed is preserved when the box width is halved.
for(const L of [150,310])for(const d of [35,84,99]){
 const derivative=(reflectedPosition(d+.001,L)-reflectedPosition(d,L))/.001;
 assert.ok(Math.abs(Math.abs(derivative)-1)<1e-8);
 assert.equal(reflectedPosition(d+2*L,L),reflectedPosition(d,L));
}
assert.equal(thermalInsertVisual({id:'unknown'},null,0),null,'No generic substitute diagram');
console.log('PASS: thermal insert scenes, rendered TeX, and constant-speed reflections');
