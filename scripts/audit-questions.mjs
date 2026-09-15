import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import Module from 'node:module';
const b=await build({stdin:{contents:`export {emQuestions} from './src/content/em-questions';export {guidedLessons} from './src/content/guided-em';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const m=new Module(`${process.cwd()}/.questions-audit.cjs`);m._compile(b.outputFiles[0].text,m.id);
const {emQuestions,guidedLessons}=m.exports;
const registry=readFileSync('src/components/figures/index.tsx','utf8');
const counts={},lengths=[];
for(const [id,questions] of Object.entries(emQuestions)){
 counts[id]=questions.length;assert.equal(new Set(questions.map(q=>q.question)).size,questions.length);
 for(const q of questions){assert(q.question.endsWith('？'));assert(q.answer.length>=80&&q.answer.length<=180);lengths.push(q.answer.length);assert(guidedLessons[id].steps.some(s=>s.story.scene===q.scene));if(q.figure)assert(registry.includes(`"${q.figure}"`),q.figure);}
}
assert.equal(emQuestions['ue-integrals'].find(q=>q.scene==='r-sum').figure,'line-integral');
assert.equal(emQuestions['ue-integrals'].find(q=>q.scene==='r-flux').figure,'surface-tiles');
console.log({result:'PASS',counts,characters:{min:Math.min(...lengths),max:Math.max(...lengths)}});
