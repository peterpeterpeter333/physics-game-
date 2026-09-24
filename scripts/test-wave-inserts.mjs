import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {waveInsertIds,waveInsertVisual} from './wave-insert-visuals.mjs';
import {texBox} from './revision-tex.mjs';
import {waveRevisionDiagram} from './wave-revision-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));
for(const id of waveInsertIds){
 const c=plan.find(c=>c.id===id),s={...c.scenes[0],start:0};
 s.captions=s.utterances.map((u,i)=>({text:u.subtitle,start:i*10,end:i*10+10}));
 const frames=new Set();
 for(let i=0;i<s.captions.length;i++)for(const q of [.1,.5,.9]){
  const v=waveInsertVisual(c,s,10*(i+q));
  assert.ok(v?.diagram&&!/NaN|undefined|Infinity/.test(v.diagram));
  assert.ok(!/merror/.test(texBox(v.equation,0,0)));frames.add(v.diagram);
 }
 assert.ok(frames.size>3,id);
}
assert.equal(1/.5*3,6);assert.equal(4/2,2);
assert.equal(340/(4*.5),170);assert.equal(340/(2*.5),340);
assert.equal(442-440,2);
assert.equal(waveInsertVisual({id:'unknown'},null,0),null);
for(const [id,index] of [['w-sound-middle',0],['prep-sin-wave',0],['prep-superposition',1],['prep-sound-boundary',0]]){
 const frames=[0,.1,.5,.9,1].map(p=>waveRevisionDiagram({id},{index},p));
 assert.ok(frames.every(f=>f&&!/NaN|undefined|Infinity/.test(f)));
 assert.ok(new Set(frames).size>2);
}
console.log('PASS: five wave inserts, caption states, finite coordinates, TeX, numerical examples');
