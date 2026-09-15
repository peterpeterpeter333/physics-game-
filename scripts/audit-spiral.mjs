import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import Module from 'node:module';
const b=await build({stdin:{contents:`export {spiralLessons} from './src/content/em-spiral';export {guidedLessons} from './src/content/guided-em';export {integralEquationGuides} from './src/content/em-equation-guides';export {pathStep} from './src/components/PathMeaning';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m=new Module(`${process.cwd()}/.spiral-audit.cjs`);m._compile(b.outputFiles[0].text,m.id);
const {spiralLessons,guidedLessons,integralEquationGuides,pathStep}=m.exports;
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
const equations=JSON.parse(readFileSync('src/content/calculations/equations.generated.json','utf8'));
let explained=0,derivationSteps=0;
for(const cycle of spiralLessons['ue-integrals']){
 const guides=integralEquationGuides[cycle.id];assert.equal(guides.length,cycle.cards.length);
 for(const guide of guides){
  assert(guide.kind&&guide.read);assert(guide.symbols.length&&guide.steps.length>=2);
  assert.equal(new Set(guide.symbols.map(x=>x[0])).size,guide.symbols.length,'Repeated symbol');
  for(const [symbol,definition] of guide.symbols)assert(symbol&&definition);
  for(const step of guide.steps){assert(step.note&&equations[step.tex],step.tex);derivationSteps++;}
  explained++;
 }
}
for(const u of [0,.2,.5,.6])for(const h of [.01,.1,.4]){
 const p=pathStep(u,h);assert(Math.abs(p.dy-((u+h)**2-u*u))<1e-12);
 assert(Math.abs(p.dy-p.tangentY-p.error)<1e-12);
 assert(Math.abs(pathStep(u,h/2).error-p.error/4)<1e-12);
}
assert.equal(explained,27);
console.log({equationGuides:explained,derivationSteps,pathApproximation:'PASS'});
console.log({result:'PASS',slides:counts,characters:{min:Math.min(...lengths),max:Math.max(...lengths)}});
