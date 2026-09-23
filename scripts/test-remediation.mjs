import assert from 'node:assert/strict';
import {build} from 'esbuild';
import Module from 'node:module';
import {readFileSync} from 'node:fs';
const bundle=await build({stdin:{contents:`
export {chapters} from './src/content';
export {studySupport} from './src/content/study-support';
export {emPaperProblems} from './src/content/em-paper-problems';
export {completionHints} from './src/content/levels/completion-hints';
export {studyExperiments} from './src/components/StudyExperiments';
export {restoredPage,allQuestionsSolved,questionsToRetry} from './src/game/study-progress';
export {renderToStaticMarkup} from 'react-dom/server';
export {createElement} from 'react';
`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic'});
const m=new Module(`${process.cwd()}/.remediation-test.cjs`);m._compile(bundle.outputFiles[0].text,m.id);
const {chapters,studySupport,emPaperProblems,completionHints,studyExperiments,restoredPage,allQuestionsSolved,questionsToRetry,renderToStaticMarkup,createElement}=m.exports;
const stages=chapters.flatMap(c=>c.stages),ids=new Set(stages.map(s=>s.id));
assert.deepEqual(Object.keys(emPaperProblems).sort(),['ui-field-map','um-line-element','ue-integrals'].sort());
for(const [stageId,problems] of Object.entries(emPaperProblems)){
 assert(ids.has(stageId));assert.equal(problems.length,3,stageId);
 assert.equal(new Set(problems.map(problem=>problem.id)).size,3,stageId);
 for(const problem of problems)assert(problem.question.length>20&&problem.labels.length===3&&problem.steps.length===3,problem.id);
}
assert.equal(stages.length,136);
assert.deepEqual(new Set(Object.keys(studySupport)),ids);
for(const stage of stages){
 const aid=studySupport[stage.id],review=stage.problems.filter(p=>p.id===`review-${stage.id}`);
 assert.equal(review.length,1);assert(stage.problems.length>=2);
 assert(aid.focus.length>15&&aid.example.length>20&&aid.question.length>5,stage.id);
 assert.equal(new Set(aid.choices).size,2);
 assert.equal(review[0].choices[review[0].answerIndex],aid.choices[aid.answer]);
 assert(!stage.problems.some(p=>/前問/.test(p.question)),stage.id);
 assert.equal(new Set(stage.problems.map(p=>p.id)).size,stage.problems.length);
 assert(!allQuestionsSolved(stage.problems,new Set()));
 assert(!allQuestionsSolved(stage.problems,new Set([stage.problems[0].id])));
 const all=new Set(stage.problems.map(p=>p.id));assert(allQuestionsSolved(stage.problems,all));
 const missing=stage.problems.at(-1);all.delete(missing.id);
 assert.deepEqual(questionsToRetry(stage.problems,all),[missing]);
}
assert.equal(stages.reduce((n,s)=>n+s.problems.length,0),627);
assert.equal(Object.keys(completionHints).length,39);
for(const [id,hint]of Object.entries(completionHints)){assert(ids.has(id));assert(hint.length>15);assert(!/図と式を確認/.test(hint));}
for(const [id,Experiment]of Object.entries(studyExperiments)){
 assert(ids.has(id),`Orphan experiment ${id}`);
 const html=renderToStaticMarkup(createElement(Experiment));
 assert(html.includes('type="range"')&&html.includes('role="img"'),id);
 assert(!/NaN|Infinity|undefined/.test(html),id);
}
for(const [value,count,expected]of [[null,5,0],['3',5,3],['99',5,4],['-1',5,0],['NaN',5,0],['2.5',5,0],['3',0,0]])assert.equal(restoredPage(value,count),expected);
const text=stages.flatMap(s=>s.problems).map(p=>[p.question,p.choices[p.answerIndex],p.explanation].join(' ')).join('\n');
assert(!text.includes('全区間の電子が同時に動き始める'));
assert(text.includes('L/(2m)'));
assert(text.includes('小角'));
assert(text.includes('磁気力'));
assert(text.includes('連鎖律'));
const battle=readFileSync('src/components/BattleView.tsx','utf8');
for(const required of ['useState(false)','showHint || reviewing','remainingRef.current = remain','if (timed) setHearts','回答を保持','continueNext'])assert(battle.includes(required),required);
assert(!battle.includes('30秒のバトルに挑戦する'),'Timed battle must not be offered');
console.log(JSON.stringify({result:'PASS',supportedStages:stages.length,problems:627,newChecks:136,specificHints:39,interactiveBridgePlacements:Object.keys(studyExperiments).length,progressAndRetryCases:'all stages',scope:'Data/SSR/pure-logic tests; visual and learner tests are separate'},null,2));
