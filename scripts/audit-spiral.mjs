import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import Module from 'node:module';
const b=await build({stdin:{contents:`export {spiralLessons} from './src/content/em-spiral';export {guidedLessons} from './src/content/guided-em';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m=new Module(`${process.cwd()}/.spiral-audit.cjs`);m._compile(b.outputFiles[0].text,m.id);
const {spiralLessons,guidedLessons}=m.exports;
const registry=readFileSync('src/components/figures/index.tsx','utf8');
const lengths=[],counts={};
for(const [id,cycles] of Object.entries(spiralLessons)){
 assert.equal(new Set(cycles.map(c=>c.id)).size,cycles.length);
 counts[id]=cycles.length*3;
 const scenes=guidedLessons[id].steps.map(s=>s.story.scene);
 for(const cycle of cycles){
  assert(cycle.uses&&cycle.gain&&cycle.references.length);
  cycle.references.forEach(s=>assert(scenes.includes(s),s));
  assert.equal(cycle.cards.length,3);
  for(const card of cycle.cards){
   assert(card.title&&card.text);assert(card.text.length<=180,card.title);lengths.push(card.text.length);
   assert(card.figure||card.scene||card.lab,card.title);
   if(card.figure)assert(registry.includes(`"${card.figure}"`),card.figure);
   if(card.scene)assert(scenes.includes(card.scene),card.scene);
  }
 }
}
assert.deepEqual(counts,{'ue-integrals':27,'ue-gauss':24});
const cards=spiralLessons['ue-integrals'].flatMap(c=>c.cards);
assert(cards.some(c=>c.figure==='line-integral'));assert(cards.some(c=>c.figure==='surface-tiles'));
console.log({result:'PASS',slides:counts,characters:{min:Math.min(...lengths),max:Math.max(...lengths)}});
