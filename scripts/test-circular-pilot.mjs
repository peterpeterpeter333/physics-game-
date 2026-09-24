import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {circularPilotIds} from '../docs/video-revision-20260924/circular-pilot.mjs';
import {circularPilotFrame} from './circular-pilot-visuals.mjs';
const plan=JSON.parse(readFileSync('docs/video-revision-20260924/full-plan.generated.json'));
let frames=0;
for(const id of circularPilotIds){
 const c=structuredClone(plan.find(c=>c.id===id));assert.ok(c);let start=0;
 for(const s of c.scenes){
  assert.equal(s.cues.length,s.utterances.length);
  assert.equal(s.narration,s.utterances.map(u=>u.subtitle).join(''));
  s.start=start;s.captions=s.utterances.map(u=>{const a={text:u.subtitle,start,end:start+5};start+=5;assert.ok(u.reading&&!/\s/.test(u.reading));return a;});s.end=start;
  assert.ok(s.cues.every(cue=>cue.operation&&cue.diagram));
 }
 c.duration=start;
 for(const s of c.scenes)for(const cap of s.captions){
  const sampled=[];for(const p of [.02,.2,.5,.98]){
   const svg=circularPilotFrame(c,s,cap.start+p*5);assert.ok(svg);
   assert.ok(!/NaN|undefined|Infinity|data-mjx-error|data-mml-node="merror"/.test(svg));
   assert.equal((svg.match(/data-presentation=/g)??[]).length,1,'Exactly one visual focus per frame');
   if(svg.includes('data-presentation="diagram"'))assert.ok(!svg.includes('data-mml-node'),'No formula panel on geometry frames');
   assert.ok(svg.includes(cap.text.slice(0,8)));sampled.push(svg);frames++;
  }
  assert.notEqual(sampled[0],sampled[3],'Every spoken cue has a time-dependent animation');
 }
}
// Finite chords, not arcs, give the exact similar-triangle relation.
for(const h of [1,.1,.001]){
 const r=2,v=3,dt=r*h/v,chord=2*r*Math.sin(h/2),dv=2*v*Math.sin(h/2);
 assert.ok(Math.abs(dv/v-chord/r)<1e-12);
 if(h===.001)assert.ok(Math.abs(dv/dt-v*v/r)<1e-6);
}
const GM=3.986004418e14,r=6.8e6,m=1000,v2=GM/r,T2=4*Math.PI**2*r**3/GM;
assert.ok(Math.abs(m*v2/r-GM*m/r**2)<1e-9);
assert.ok(Math.abs((2*Math.PI*r/Math.sqrt(v2))**2/T2-1)<1e-12);
assert.equal(Math.sqrt(4**3),8);assert.equal((2*3)**2/3**2,4);
assert.equal(6/(3/2),6*(2/3));
const advanced=plan.find(c=>c.id==='m-circular-advanced');
for(const needed of ['÷ m','× r','2乗','逆数','r² × r'])assert.ok(JSON.stringify(advanced).includes(needed),needed);
const routes=JSON.parse(readFileSync('src/content/prerequisite-routes.generated.json'));
for(const l of ['intro','middle','advanced'])assert.deepEqual(routes[`m-circular-${l}`],{required:[],review:[]});
console.log(`PASS: six circular/gravity films, ${frames} cue frames, readings, algebra, geometry, and scoped prerequisite routing`);
