// These are regression checks of the ten requirements, not a readability certification.
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import Module from 'node:module';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import katex from 'katex';
const b=await build({stdin:{contents:`
 export {chapters} from './src/content';
 export {chapterFoundations} from './src/content/chapter-foundations';
 export {figureReadings} from './src/content/figure-readings';
 export {learningPaths,phaseLabel} from './src/content/learning-paths';
 export {spiralLessons} from './src/content/em-spiral';
 export {slideSummaries} from './src/content/slide-summaries';
 export {lessonOrientations} from './src/content/lesson-orientation';
 export {quantityGlossary,notationHelp} from './src/content/quantity-glossary';
 export {getCalculation} from './src/content/calculations';
 export {REGISTRY,Figure} from './src/components/figures';
 export {getUniqueShot} from './src/components/figures/unique';
 export {gaussEquationGuide} from './src/content/gauss-equation-guides';
 export {integralEquationGuides} from './src/content/em-equation-guides';
 export {clarityRevisions} from './src/content/clarity-revisions';
 export {expressionSymbols} from './src/components/QuantityGlossary';
 export {heatBudget} from './src/components/figures/HeatEngine';
 `,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs',packages:'external',jsx:'automatic'});
const m=new Module(`${process.cwd()}/.ten-principles.cjs`);m.paths=Module._nodeModulePaths(process.cwd());m._compile(b.outputFiles[0].text,m.id);
const {chapters,chapterFoundations,figureReadings,learningPaths,phaseLabel,spiralLessons,slideSummaries,lessonOrientations,quantityGlossary,notationHelp,getCalculation,REGISTRY,Figure,getUniqueShot,gaussEquationGuide,integralEquationGuides}=m.exports;
const stages=chapters.flatMap(c=>c.stages),all=stages.flatMap(s=>s.lesson.steps),results=[];
const {clarityRevisions}=m.exports;
const images=JSON.parse(readFileSync('src/content/calculations/equations.generated.json','utf8'));
const src=path=>readFileSync(path,'utf8');
function check(number,name,fn){fn();results.push({number,name,automated:'PASS',pedagogicalReview:'not certified by automated tests'});}
function equation(tex){assert(tex);katex.renderToString(tex,{throwOnError:true,strict:'ignore'});assert(images[tex],`No generated image: ${tex}`);assert(existsSync(`public/${images[tex].src}`));}
function audit(file){process.stdout.write(execFileSync(process.execPath,[`scripts/${file}`],{encoding:'utf8'}));}
check(1,'知識のつながり',()=>{
 assert.equal(stages.length,56);assert.deepEqual(Object.keys(chapterFoundations).sort(),stages.map(s=>s.id).sort());
 for(const s of stages){assert(chapterFoundations[s.id].known.length>15,s.id);const path=learningPaths[s.id]??spiralLessons[s.id];assert(path.length>=2,s.id);for(const u of path)assert(u.goal&&u.gain,s.id);}
 audit('audit-study-flow.mjs');
});
check(2,'基本事項・可変ステップ・つながったこと',()=>{
 for(const count of [3,4,5,6]){assert.equal(phaseLabel(0,count),'基本事項');assert.equal(phaseLabel(count-1,count),'つながったこと');for(let i=1;i<count-1;i++)assert.equal(phaseLabel(i,count),`ステップ${i}`);}
 for(const cycles of Object.values(spiralLessons))for(const c of cycles)assert(c.cards.length>=3);
});
check(3,'目的・既知と未知・今の話',()=>{
 for(const s of stages){const o=lessonOrientations[s.id],f=chapterFoundations[s.id];assert(o.theme&&o.goal&&f.known&&f.startingPoint);for(const step of s.lesson.steps)assert(step.heading&&step.body);}
 assert(src('src/components/LessonView.tsx').includes('purpose='));
 assert(src('src/components/SpiralLesson.tsx').includes('この段で求めること'));
 audit('test-potential-context.mjs');
});
check(4,'短い本文と省略しない補足',()=>{
 for(const [id,revisions] of Object.entries(clarityRevisions))for(const [heading,revision] of Object.entries(revisions)){assert.equal(stages.find(s=>s.id===id).lesson.steps.find(s=>s.heading===heading)?.body,revision.body,`${id}/${heading}: unapplied revision`);assert(revision.body.length<=150,`${id}/${heading}: ${revision.body.length}`);}
 for(const s of stages){if(spiralLessons[s.id]){for(const c of spiralLessons[s.id])for(const card of c.cards)assert(card.text.length<=210,`${s.id}/${card.title}`);}else for(const [i,step] of s.lesson.steps.entries())assert((slideSummaries[s.id]?.[i]??step.body).length<=150,`${s.id}/${i}`);}
 assert(src('src/components/LessonView.tsx').includes('補足・元の詳しい説明'));
 for(const f of Object.values(chapterFoundations))for(const t of [f.known,f.startingPoint,f.conditions,f.example.given,f.example.read])assert(t.length<=150);
});
check(5,'式の意味・具体例・記号・計算',()=>{
 for(const s of stages){const f=chapterFoundations[s.id];equation(f.example.tex);assert(f.example.given&&f.example.read);if(!spiralLessons[s.id])assert(quantityGlossary(s.id).length>=8);for(const step of s.lesson.steps){const c=getCalculation(step);if(c)for(const line of c.lines){assert(line.note);equation(line.tex);}}}
 for(const [id,cycles] of Object.entries(spiralLessons))for(const c of cycles)c.cards.forEach((card,i)=>{const guide=id==='ue-gauss'?gaussEquationGuide(stages.find(s=>s.id===id),c,i):integralEquationGuides[c.id][card.guideIndex??i];assert(guide.read&&guide.symbols.length&&guide.steps.length);for(const line of guide.steps)equation(line.tex);});
 assert(src('src/components/CalculationBoard.tsx').includes('途中式を示す導出ではありません'));
});
check(6,'現象の図と式の併設・図の意味',()=>{
 for(let w=10;w<=60;w+=5){const b=m.exports.heatBudget(w);assert.equal(b.input,b.output+b.rejected);assert.equal(b.efficiency,w/100);}
 assert.equal(stages.find(s=>s.id==='t-firstlaw').lesson.steps[9].figure,'heat-engine');
 assert.deepEqual(Object.keys(figureReadings).sort(),Object.keys(REGISTRY).sort());
 for(const [id,reading] of Object.entries(figureReadings)){assert(reading.length>=30&&reading.length<=160,id);const html=renderToStaticMarkup(React.createElement(Figure,{id}));assert(html.includes('この図で見ること'),id);assert(html.includes('<svg'),id);assert(!/NaN|Infinity/.test(html),id);}
 for(const s of stages)for(const step of s.lesson.steps)assert(step.story||REGISTRY[step.figure]||getUniqueShot(s.id,step),`${s.id}/${step.heading}`);
 assert(!stages.find(s=>s.id==='uc-drag').lesson.steps.some(s=>s.figure==='time-constant'),'RC diagram in falling-body lesson');
 assert(!stages.find(s=>s.id==='e-magnet').lesson.steps.some(s=>s.figure==='field-map'),'electric field diagram used as magnetic field');
});
check(7,'意味のある3D・視点と物理量の区別',()=>{
 for(const id of ['flux-3d','cross-3d','helix-3d','em-wave-3d']){const html=renderToStaticMarkup(React.createElement(Figure,{id}));assert(html.includes('視点'));assert(html.includes('物理量は変わりません'));}
 audit('audit-em3d.mjs');
});
check(8,'用語・記号の意味を確認できる',()=>{
 const tokens=m.exports.expressionSymbols([String.raw`\mathcal E=\varepsilon_0+P_{\rm 損}+W_{\rm out}+|Z_L|`]);
 for(const key of ['mathcalE','epsilon_0','P_損','W_out','Z_L'])assert(tokens.has(key),`symbol token ${key}`);
 assert(!tokens.has('E'),'EMF must not be mistaken for electric field');
 assert(notationHelp.length>=5);
 for(const s of stages.filter(s=>!spiralLessons[s.id]))for(const d of quantityGlossary(s.id))assert(d.key&&d.label&&d.meaning);
 const g=gaussEquationGuide(stages.find(s=>s.id==='ue-gauss'),spiralLessons['ue-gauss'].find(c=>c.id==='substitute'),1);
 assert(g.symbols.some(([key,value])=>key==='u'&&value.includes('二乗')&&value.includes('別')));
 assert(figureReadings['standing-wave'].includes('節'));assert(figureReadings['standing-wave'].includes('動かない'));
});
check(9,'前提・定義・法則と結論の区別',()=>{
 const revised=(id,heading)=>clarityRevisions[id][heading];
 assert(revised('t-firstlaw','熱機関と熱効率: 熱は全部仕事にできない').body.includes('逆符号'));
 assert(revised('m-momentum','力積 = 運動量の変化').body.includes('平均力'));
 assert(revised('ue-current','なぜ送電線は数十万ボルトなのだろう?').formula.includes('P_{\\rm 損}'));
 assert(revised('ue-maxwell','コイルとコンデンサは、交流にどう応じるのだろう?').formula.includes('|Z_L|'));
 assert(revised('um-integral','高校の公式を、自分の手で作れるだろうか?').formula.includes('x_0'));
 assert(revised('uc-shm','振り子の運動方程式は、どう立てるのだろう?').body.includes('数値的'));
 assert(revised('um-shm-ode','なぜこの方程式が「世界最重要」なのだろう?').body.includes('U″>0'));
 for(const f of Object.values(chapterFoundations))assert(f.conditions.length>20&&f.startingPoint.length>15);
 assert(chapterFoundations['m-force'].startingPoint.includes('基本法則'));
 assert(chapterFoundations['a-photon'].startingPoint.includes('出発点'));
 assert(chapterFoundations['ue-gauss'].conditions.includes('対称性'));
 assert(chapterFoundations['uc-rigid2'].conditions.includes('固定'));
 assert(chapterFoundations['a-nucleus'].conditions.includes('期待値'));
 assert(figureReadings['shell-zero'].includes('球対称性'));
 audit('audit-guided.mjs');
});
check(10,'自由な章移動・点のナビ・数式の耐障害性',()=>{
 assert(!/locked|prevCleared|disabled=/.test(src('src/components/QuestMap.tsx')));
 for(const file of ['LessonView','SpiralLesson'])assert(src(`src/components/${file}.tsx`).includes('lesson-dot'));
 for(const step of all)assert(!/いったん止ま|一旦止ま|前のステージをクリアで解放/.test(step.body));
 audit('audit-offline.mjs');
});
const referenceOnly=all.filter(s=>getCalculation(s)?.reference).length;
console.log(JSON.stringify({scope:{chapters:chapters.length,stages:stages.length,sourceSlides:all.length,figureReadings:Object.keys(figureReadings).length},results,remainingReview:{referenceOnlySlides:referenceOnly,note:'Definitions, laws and repeated formulas may legitimately be reference-only. A human must check each context; counts are not proof of complete derivations. All-slide visual and learner review are separate.'}},null,2));
