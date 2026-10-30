import assert from 'node:assert/strict';
import {build} from 'esbuild';
import Module from 'node:module';
import {readFileSync} from 'node:fs';
const bundle=await build({stdin:{contents:`
 export {chapters} from './src/content';
 export {universitySourceStages} from './src/content/university-source';
 export {universityCurriculum,removedIndices,movedCycles} from './src/content/university-curriculum';
 export {newLevelStageIds} from './src/content/levels/completion';
 export {allLessonSteps,foregroundText} from './src/content/lesson-text';
 export {spiralLessons} from './src/content/em-spiral';
 export {learningPaths} from './src/content/learning-paths';
 export {preparationFor} from './src/content/university-levels';
 export {getCalculation} from './src/content/calculations';
 `,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m=new Module(`${process.cwd()}/.curriculum-audit.cjs`);m._compile(bundle.outputFiles[0].text,m.id);
const {chapters,universitySourceStages:original,universityCurriculum:topics,removedIndices,movedCycles,newLevelStageIds,allLessonSteps,foregroundText,spiralLessons,learningPaths,preparationFor,getCalculation}=m.exports;
const stages=chapters.flatMap(c=>c.stages),byId=Object.fromEntries(stages.map(s=>[s.id,s]));
assert.equal(topics.length,29);
assert.deepEqual(topics.map(t=>t.id).sort(),Object.keys(original).sort(),'Every university topic needs an explicit placement');
assert.equal(stages.length,136);assert.equal(newLevelStageIds.size,39);
const sourceSlides=stages.flatMap(s=>allLessonSteps(s.lesson).map(step=>({owner:s.id,step})));
let moved=0,retained=0;
for(const topic of topics){
 const stage=byId[topic.id],source=original[topic.id];
 assert(stage);assert.deepEqual(stage.problems.filter(p=>!p.id.startsWith('review-')),source.problems,'Existing progress/problem IDs must survive');
 assert.equal(stage.lesson.id,source.lesson.id);
 for(const level of ['intro','middle']){
  const p=topic[level],target=byId[p.id];assert(target,`${topic.id}/${level}`);
  assert.notEqual(p.id,topic.id);assert(p.goal.length>20);
  const chapter=chapters.find(c=>c.stages.some(s=>s.id===p.id));
  assert.equal(chapter.familyId,topic.family);assert.equal(chapter.level,level);
  assert(preparationFor[topic.id].some(e=>e.id===p.id&&e.level===level));
  if(newLevelStageIds.has(p.id)){
   assert(target.lesson.steps.length>=3);assert(target.problems.length>=1);
   assert(target.enemy.maxHp<=24,'One-question checks must finish on one correct answer');
  }
  for(const index of p.slides){
   const candidates=sourceSlides.filter(({step})=>step.sourceStageId===topic.id&&step.sourceSlideIndex===index);
   assert.equal(candidates.length,1,`Material must have exactly one home: ${topic.id}/${index}`);
   assert.equal(candidates[0].owner,p.id);
   const copy=candidates[0].step,old=source.lesson.steps[index];
   for(const key of ['body','figure','formula','formulaNote','heading'])assert.equal(copy[key],old[key],`Lost ${key}: ${topic.id}/${index}`);
   assert.deepEqual(getCalculation(copy),getCalculation(old),'Algebra must migrate with its figure');
   assert.equal(foregroundText(p.id,copy,0),foregroundText(topic.id,old,index),'Short text must follow its source, not its new index');
   moved++;
  }
 }
 if(!source.lesson.steps[0].story){
  const removed=removedIndices(topic.id);
  assert.equal(removed.size,topic.intro.slides.length+topic.middle.slides.length,'Duplicate placement');
  assert.equal(stage.lesson.steps.length,source.lesson.steps.length-removed.size);
  assert(!stage.lesson.steps.some(s=>s.review));
  assert(stage.lesson.steps.length>=2);
  for(const step of stage.lesson.steps){
   assert(!removed.has(step.sourceSlideIndex));
   const old=source.lesson.steps[step.sourceSlideIndex];
   assert.equal(step.heading,old.heading);assert.equal(step.body,old.body);
   assert.equal(foregroundText(stage.id,step,0),foregroundText(stage.id,old,step.sourceSlideIndex));
   retained++;
  }
  assert.equal(learningPaths[topic.id].at(-1).end,stage.lesson.steps.length);
 }
}
let movedSpiralCards=0;
for(const [id,mapping] of Object.entries(movedCycles)){
 const cycles=spiralLessons[id];
 for(const [cycleId,target] of Object.entries(mapping)){
  assert(byId[target]);const cycle=cycles.find(c=>c.id===cycleId);assert(cycle);
  movedSpiralCards+=cycle.cards.length;
 }
 const visible=cycles.filter(c=>!mapping[c.id]);
 assert(visible.length>=4);assert(visible.every(c=>!mapping[c.id]));
}
assert.equal(moved,216);assert.equal(movedSpiralCards,20);
const lessonView=readFileSync('src/components/LessonView.tsx','utf8');
assert(lessonView.includes('foregroundText(stage.id,step,page)'));
assert(lessonView.includes('<MovedMaterial stage={stage}/>'));
const spiralView=readFileSync('src/components/SpiralLesson.tsx','utf8');
assert(spiralView.includes('filter(c=>!movedCycles[stage.id]?.[c.id])'));
assert(spiralView.includes('<AdvancedEntry'));
const supplements=readFileSync('src/components/MovedMaterial.tsx','utf8');
assert(supplements.includes('cyclesOverride={[cycle.cycle]}'));
assert(supplements.includes('open&&'),'Hidden figures must not keep running');
console.log(JSON.stringify({result:'PASS',universityTopics:topics.length,newPreparatoryLessons:newLevelStageIds.size,lowerLessons:chapters.filter(c=>c.level==='intro'||c.level==='middle').flatMap(c=>c.stages).length,relocatedStandardSlides:moved,retainedAdvancedStandardSlides:retained,relocatedSpiralCards:movedSpiralCards,oldProblemIdsPreserved:true,all29TopicsHaveBothLevels:true},null,2));
