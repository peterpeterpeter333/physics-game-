import assert from 'node:assert/strict';
import {build} from 'esbuild';
import Module from 'node:module';
const b=await build({stdin:{contents:`export * from './src/components/em3d-model';export {spiralLessons} from './src/content/em-spiral';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m=new Module(`${process.cwd()}/.em3d-audit.cjs`);m._compile(b.outputFiles[0].text,m.id);
const {rotate,norm,spherePoint,electricAt,dot,sphereFlux,torusCrossings,scene3DFor,spiralLessons}=m.exports;
for(const angle of [-3,-1,0,1,3])for(const pitch of [-1.3,0,1.3])assert(Math.abs(norm(rotate([1,2,3],angle,pitch))-Math.sqrt(14))<1e-12);
for(const theta of [.1,1,2,3]){const n=spherePoint(theta,.7);assert(Math.abs(norm(n)-1)<1e-12);assert(Math.abs(dot(electricAt(n),n)-1)<1e-12);}
assert.equal(sphereFlux(.5,1),1);assert.equal(sphereFlux(1.5,1),0);assert.equal(sphereFlux(1,1),null);
const hits=torusCrossings([1,0,0],[-1,0,.04]);assert.deepEqual(hits.map(h=>h.sign),[1,-1,1]);
assert.equal(scene3DFor('path',0),undefined);assert.equal(scene3DFor('linear',0),undefined);
let count=0;const scenes=new Set();for(const cycles of Object.values(spiralLessons))for(const cycle of cycles)cycle.cards.forEach((_,i)=>{const scene=scene3DFor(cycle.id,i);if(scene){count++;scenes.add(scene);}});
assert.equal(count,44);assert.equal(scenes.size,12);
console.log({result:'PASS',threeDimensionalSlides:count,scenes:scenes.size,signedCrossings:hits.map(h=>h.sign)});
