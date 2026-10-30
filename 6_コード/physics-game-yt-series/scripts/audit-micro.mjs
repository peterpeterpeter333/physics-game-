import assert from 'node:assert/strict';
import {build} from 'esbuild';
import Module from 'node:module';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const bundle=await build({stdin:{contents:`export {guidedLessons} from './src/content/guided-em';export * from './src/content/micro-slides';export * from './src/content/em-faq';export {FaqFrame} from './src/components/FaqAnimation';`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',packages:'external',jsx:'automatic'});
const mod=new Module(`${process.cwd()}/.micro-audit.cjs`);mod.paths=Module._nodeModulePaths(process.cwd());mod._compile(bundle.outputFiles[0].text,mod.id);
const {guidedLessons,microSlides,textPages,emFaq,faqSources,FaqFrame}=mod.exports;
let count=0;const long=[];
for(const lesson of Object.values(guidedLessons))for(const step of lesson.steps){
 const s=step.story,cards=microSlides(step);count+=cards.length;
 for(const c of cards){assert(c.lines.length<=4);assert(c.lines.every(l=>Array.from(l).length<=21));}
 const originals=[s.goal,s.basis,...s.beats.flatMap(b=>[b.text,b.focus]),s.result,...(s.notes||[]).map(n=>n.text)].filter(Boolean);
 assert.equal(cards.flatMap(c=>c.lines).join(''),originals.join(''),`Dropped or changed text: ${s.scene}`);
 for(const tex of [s.goalTex,...s.beats.map(b=>b.tex),...(s.notes||[]).map(n=>n.tex)].filter(Boolean))assert(cards.some(c=>c.tex===tex),`Dropped equation: ${s.scene}`);
 const faq=emFaq[s.scene];assert(faq&&faq.lines.length===4);
 for(const l of faq.lines)if(Array.from(l).length>21)long.push([s.scene,Array.from(l).length,l]);
 faq.sources.forEach(k=>assert(faqSources[k]));
 const frames=[0,.25,.5,.75,1].map(t=>renderToStaticMarkup(React.createElement(FaqFrame,{scene:s.scene,t})));
 for(const html of frames)assert(!/NaN|Infinity|(?:width|height|r|rx|ry)="-/.test(html),s.scene);
 assert(new Set(frames).size>1,`Non-interactive FAQ: ${s.scene}`);
}
console.log(JSON.stringify({slides:count,faqs:Object.keys(emFaq).length,overlongFaqLines:long},null,2));
assert.equal(long.length,0);
for(const text of ['abc','文。次の文。','x'.repeat(100),'電場の途中式を一つずつ確認します。'])assert.equal(textPages(text).flat().join(''),text);
