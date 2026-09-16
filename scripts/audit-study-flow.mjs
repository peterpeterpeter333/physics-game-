import assert from 'node:assert/strict';
import {build} from 'esbuild';
import Module from 'node:module';
import katex from 'katex';
const b=await build({stdin:{contents:`export {chapters} from './src/content';export * from './src/content/learning-paths';export {slideSummaries} from './src/content/slide-summaries';export {quantityGlossary} from './src/content/quantity-glossary';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m=new Module(`${process.cwd()}/.study-audit.cjs`);m._compile(b.outputFiles[0].text,m.id);
const {chapters,learningPaths,unitAt,phaseLabel,slideSummaries,quantityGlossary}=m.exports;
const stages=chapters.flatMap(c=>c.stages).filter(s=>!s.lesson.steps[0]?.story);
const advanced=chapters.filter(c=>!c.level||c.level==='advanced').flatMap(c=>c.stages).filter(s=>!s.lesson.steps[0]?.story);
assert.equal(advanced.length,54);
assert.deepEqual(Object.keys(learningPaths).sort(),stages.map(s=>s.id).sort());
let units=0,slides=0,summaries=0;const counts=new Set(),long=[];
for(const stage of stages){
 const path=learningPaths[stage.id];assert.equal(path.at(-1).end,stage.lesson.steps.length,stage.id);
 let start=0;for(const unit of path){
  assert(unit.end-start>=2,stage.id);assert(unit.goal&&unit.gain);units++;
  counts.add(unit.end-start-2);
  for(let page=start;page<unit.end;page++){
   const at=unitAt(path,page);assert.equal(at.start,start);assert.equal(at.unit,unit);
   assert(phaseLabel(at.offset,at.count));
  }start=unit.end;
 }
 const definitions=quantityGlossary(stage.id);assert(definitions.length>=8,stage.id);
 assert.equal(new Set(definitions.map(d=>d.key)).size,definitions.length);
 for(const entry of definitions)assert(entry.label&&entry.meaning);
 for(const [index,summary] of Object.entries(slideSummaries[stage.id]??{})){
  assert(stage.lesson.steps[Number(index)],`${stage.id}/${index}`);assert(summary.length<=150,`${stage.id}/${index}: ${summary.length}`);summaries++;
 }
 stage.lesson.steps.forEach((step,i)=>{
  const text=slideSummaries[stage.id]?.[i]??step.body;
  assert.equal((text.match(/\$/g)||[]).length%2,0);
  for(const match of text.matchAll(/\$([^$]+)\$/g))katex.renderToString(match[1],{throwOnError:true,strict:'ignore'});
  if(text.length>150)long.push(`${stage.id}/${i}: ${text.length}`);
  assert(step.figure,`${stage.id}/${i}: lost diagram`);slides++;
 });
}
assert(counts.has(1)&&counts.has(3)&&counts.has(4),'Need actually variable reasoning step counts');
assert.deepEqual(long,[],'Foreground explanations must stay concise');
assert.equal(phaseLabel(0,6),'基本事項');assert.equal(phaseLabel(4,6),'ステップ4');assert.equal(phaseLabel(5,6),'つながったこと');
assert.equal(phaseLabel(1,3),'ステップ1');assert.equal(phaseLabel(2,3),'つながったこと');
console.log({result:'PASS',standardLessons:stages.length,authoredLearningUnits:units,slides,authoredShortExplanations:summaries,reasoningStepCounts:[...counts].sort()});
