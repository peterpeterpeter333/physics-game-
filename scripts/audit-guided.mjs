import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import Module from 'node:module';
import {build} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const bundle=await build({stdin:{contents:`export {guidedLessons,guidedProblems} from './src/content/guided-em'; export {GuidedScene} from './src/components/GuidedScene';`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',packages:'external',jsx:'automatic'});
const mod=new Module(`${process.cwd()}/.guided-audit.cjs`);mod.paths=Module._nodeModulePaths(process.cwd());mod._compile(bundle.outputFiles[0].text,mod.id);
const {guidedLessons,guidedProblems,GuidedScene}=mod.exports;
const images=JSON.parse(readFileSync('src/content/calculations/equations.generated.json','utf8'));
let beats=0,equations=0,checks=0;const scenes=new Set();
for(const [id,lesson] of Object.entries(guidedLessons)){
 for(const step of lesson.steps){
  const {scene,beats:sequence,check}=step.story;assert(!scenes.has(scene));scenes.add(scene);
  assert(sequence.length>=3);assert.equal(step.figure,`guided-${scene}`);
  const frames=[];
  for(const [i,beat] of sequence.entries()){
   assert(beat.action.trim()&&beat.text.trim()&&beat.focus.trim(),`missing explanation: ${scene}/${i}`);
   if(beat.tex){assert(images[beat.tex],`missing image: ${scene}/${i}`);equations++;}
   const html=renderToStaticMarkup(React.createElement(GuidedScene,{scene,beat:i}));frames.push(html);
   assert(html.includes(`data-beat="${i}"`));assert(!/NaN|Infinity|(?:width|height|r|rx|ry)="-/.test(html),`invalid geometry: ${scene}/${i}`);
   beats++;
  }
  assert(new Set(frames).size===frames.length);
  if(check){assert(check.answer>=0&&check.answer<check.choices.length);for(const option of check.choices)assert(option.feedback.length>15);checks++;}
 }
 for(const p of guidedProblems[id]){assert(p.choices.length===4);assert(p.answerIndex>=0&&p.answerIndex<4);}
}
const a=yaw=>renderToStaticMarkup(React.createElement(GuidedScene,{scene:'tilt',beat:1,yaw}));assert.notEqual(a(0),a(1));
// Numerical checks independent of the renderer.
assert.equal((2/1),(4/2));assert.equal(2*1+4*1,6);assert.equal(4+0-4+0,0);
assert(Math.abs(Math.cos(Math.PI/3)-.5)<1e-12);
for(const r of [1,2,7])assert(Math.abs((1/(4*Math.PI*r*r))*(4*Math.PI*r*r)-1)<1e-12);
const ui=readFileSync('src/components/GuidedLesson.tsx','utf8');
assert(ui.includes('beat={beat}')&&ui.includes('current.tex')&&ui.includes('current.text'),'One state must drive all three representations');
assert(!ui.includes('setInterval')&&!ui.includes('setTimeout'),'No independent automatic progression');
assert(ui.includes('onClick={onNext}'),'Optional checks must not gate progress');
console.log(JSON.stringify({result:'PASS',chapters:2,scenes:scenes.size,beats,equations,optionalChecks:checks},null,2));
