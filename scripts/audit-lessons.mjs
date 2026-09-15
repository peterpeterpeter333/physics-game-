import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Module from 'node:module';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import katex from 'katex';

const imports = `
 export { chapters } from './src/content';
 export { explanationPlans } from './src/content/explanations';
 export { formulas as formulaBook } from './src/content/formulas';
 export { REGISTRY, Figure } from './src/components/figures';
 export { getUniqueShot } from './src/components/figures/unique';
 export { highSchoolReviews } from './src/content/high-school-review';
 export { guidedLessons, guidedProblems } from './src/content/guided-em';
 export { mechanics } from './src/content/mechanics';
 export { thermo } from './src/content/thermo';
 export { waves } from './src/content/waves';
 export { electromagnetism } from './src/content/electromagnetism';
 export { atomic } from './src/content/atomic';
 export { univMath } from './src/content/univ-math';
 export { univMechanics } from './src/content/univ-mechanics';
 export { univEm } from './src/content/univ-em';
`;
const bundle=await build({stdin:{contents:imports,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',packages:'external',jsx:'automatic'});
const module=new Module(`${process.cwd()}/.lesson-audit.cjs`);
module.paths=Module._nodeModulePaths(process.cwd());
module._compile(bundle.outputFiles[0].text,module.id);
const { chapters, explanationPlans, REGISTRY, Figure, formulaBook, getUniqueShot, highSchoolReviews, guidedLessons, guidedProblems, ...raw }=module.exports;
assert.deepEqual(Object.keys(guidedLessons).sort(),['ue-gauss','ue-integrals']);
const originals=['mechanics','thermo','waves','electromagnetism','atomic','univMath','univMechanics','univEm'].flatMap(key=>raw[key].stages);
const stages=chapters.flatMap(c=>c.stages);
assert.equal(stages.length,56);
assert.deepEqual(stages.map(s=>s.id),originals.map(s=>s.id));
let total=0, formulas=0, bridges=0;
const used=new Set();
const math=(tex)=>{katex.renderToString(tex,{throwOnError:true,strict:'ignore'});formulas++;};
const prose=(text)=>{
 assert.equal((text.match(/\$/g)||[]).length%2,0,`unpaired $: ${text}`);
 for(const m of text.matchAll(/\$([^$]+)\$/g))math(m[1]);
 assert(!/いったん止ま|一旦止ま|前のステージをクリアで解放/.test(text));
};
for(const stage of stages){
 const original=originals.find(s=>s.id===stage.id),plan=explanationPlans[stage.id];
 assert.deepEqual(stage.problems,guidedProblems[stage.id] ?? original.problems,`problem change: ${stage.id}`);
 assert.deepEqual(stage.problems.map(p=>p.id).sort(),original.problems.map(p=>p.id).sort(),`problem IDs changed: ${stage.id}`);
 assert.equal(stage.lesson.id,original.lesson.id);
 assert(stage.lesson.steps.length>=10);
 if(!guidedLessons[stage.id]) assert.equal(stage.lesson.steps.length,original.lesson.steps.length+plan.bridges.length,`lost bridge: ${stage.id}`);
 else assert.deepEqual(stage.lesson,guidedLessons[stage.id]);
 for(const bridge of plan.bridges){assert(bridge.before>=0&&bridge.before<=original.lesson.steps.length);assert(bridge.step.body.length>=45);}
 bridges+=plan.bridges.length;
 const distinct=new Set();
 for(const step of stage.lesson.steps){
  assert(step.story || REGISTRY[step.figure] || getUniqueShot(stage.id,step),`missing animation ${stage.id}/${step.heading}: ${step.figure}`);
  assert(!distinct.has(step.body),`duplicate body: ${stage.id}`);distinct.add(step.body);
  if(REGISTRY[step.figure])used.add(step.figure);prose(step.body);prose(step.heading);
  if(step.formula)math(step.formula);
  if(step.formulaNote)prose(step.formulaNote);
  total++;
 }
 prose(stage.lesson.intro);prose(stage.lesson.outro);
 if (/^(uc|ue)-/.test(stage.id) && !guidedLessons[stage.id]) {
  assert(highSchoolReviews[stage.id]?.length>=3,`missing prerequisites: ${stage.id}`);
  assert(stage.lesson.steps[0].review,`prerequisites must come first: ${stage.id}`);
  for(const review of highSchoolReviews[stage.id]) {
   assert(stage.lesson.steps.some(s=>s.figure===review.step.figure));
   assert(review.step.body.includes('大学へのつながり：'));
  }
 }
}
for(const id of used){
 const html=renderToStaticMarkup(React.createElement(Figure,{id}));
 assert(html.includes('<svg'),`no svg ${id}`);
 assert(!/NaN|Infinity/.test(html),`invalid numeric geometry ${id}`);
 if(id==='potential-gradient') {
  assert(html.includes('aria-label="二点の距離 Δx"')&&html.includes('type="range"'),`no interactive distance control ${id}`);
 } else assert(html.includes('アニメーションを一時停止'),`no playback control ${id}`);
 for(const m of html.matchAll(/(?:width|height|r)="(-[\d.]+)"/g))assert(false,`negative SVG dimension ${id}: ${m[0]}`);
}
for(const formula of formulaBook){
 assert(stages.some(s=>s.id===formula.stageId),`broken derivation link: ${formula.id}`);
 math(formula.tex);prose(formula.meaning);
}
const map=readFileSync('src/components/QuestMap.tsx','utf8');
assert(!/locked|prevCleared|disabled=/.test(map),'stage gating remains');
const view=readFileSync('src/components/LessonView.tsx','utf8');
assert(!/checkpoint|lessonSlides/.test(view),'auto-padding remains');
console.log(JSON.stringify({stages:stages.length,slides:total,authoredAdditions:bridges,animationIds:used.size,mathExpressions:formulas,problemCount:stages.reduce((n,s)=>n+s.problems.length,0),range:[Math.min(...stages.map(s=>s.lesson.steps.length)),Math.max(...stages.map(s=>s.lesson.steps.length))],result:'PASS'},null,2));
