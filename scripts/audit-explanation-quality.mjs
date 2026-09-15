// Inventory, not a claim that every explanation is understandable.
import {build} from 'esbuild';
import Module from 'node:module';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const b=await build({stdin:{contents:`export {chapters} from './src/content';export {getCalculation} from './src/content/calculations';export {getUniqueShot} from './src/components/figures/unique';export {REGISTRY} from './src/components/figures';export {slideSummaries} from './src/content/slide-summaries';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs',packages:'external',jsx:'automatic'});
const m=new Module(`${process.cwd()}/.quality-audit.cjs`);m.paths=Module._nodeModulePaths(process.cwd());m._compile(b.outputFiles[0].text,m.id);
const {chapters,getCalculation,getUniqueShot,REGISTRY,slideSummaries}=m.exports;
const rows=[];
for(const chapter of chapters)for(const stage of chapter.stages){
 const row={stage:stage.id,title:stage.title,slides:stage.lesson.steps.length,referenceOnly:[],figures:{},diagramMissing:[],summaryOverrides:0};
 for(const [i,step] of stage.lesson.steps.entries()){
  const calc=getCalculation(step),shot=getUniqueShot(stage.id,step);
  if(calc?.reference)row.referenceOnly.push(`${i+1}. ${step.heading}`);
  if(step.figure)row.figures[step.figure]=(row.figures[step.figure]??0)+1;
  if(!shot&&!REGISTRY[step.figure]&&!step.story)row.diagramMissing.push(i+1);
  if(slideSummaries[stage.id]?.[i])row.summaryOverrides++;
 }
 rows.push(row);
}
const figures=Object.entries(REGISTRY).map(([id,Comp])=>{
 const html=renderToStaticMarkup(React.createElement(Comp));
 return {id,labels:html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()};
});
console.log(JSON.stringify({notice:'Reference-only means no authored algebra board, not necessarily a missing proof: definitions and empirical laws are not derivations. Figure reuse and text labels need contextual human review. Counts are source slides, not rendered EM cards.',stages:rows,figureLabels:figures},null,2));
