import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import Module from 'node:module';
import {build} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const source=`export {chapters} from './src/content'; export {getCalculation,calculationRules} from './src/content/calculations'; export {uniqueShots} from './src/components/figures/unique';`;
const bundle=await build({stdin:{contents:source,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',packages:'external',jsx:'automatic'});
const mod=new Module(`${process.cwd()}/.calc-audit.cjs`);mod.paths=Module._nodeModulePaths(process.cwd());mod._compile(bundle.outputFiles[0].text,mod.id);
const {chapters,getCalculation,calculationRules,uniqueShots}=mod.exports;
const images=JSON.parse(readFileSync('src/content/calculations/equations.generated.json','utf8'));
const stages=chapters.flatMap(c=>c.stages);
let illustrated=0,authored=0,original=0;
const fingerprints=new Set();
for(const stage of stages){
  const shots=uniqueShots[stage.id];
  if(shots) assert.equal(shots.length,stage.lesson.steps.length,`incomplete authored storyboard: ${stage.id}`);
  for(const [i,step] of stage.lesson.steps.entries()){
    const calculation=getCalculation(step);
    if(step.formula) assert(images[step.formula],`original formula lost: ${stage.id}/${i}`);
    if(calculation){
      illustrated++;
      const rule=calculationRules.find(r=>r.headings.includes(step.heading));
      if(rule){authored++;assert(calculation.lines.length>=2);}
      for(const line of calculation.lines){
        const asset=images[line.tex];assert(asset,`unrendered formula ${stage.id}/${i}: ${line.tex}`);
        assert(asset.width>0 && asset.height>0);assert(existsSync(`public/${asset.src}`));
        const svg=readFileSync(`public/${asset.src}`,'utf8');
        assert(svg.includes('<svg'));assert(svg.includes('<path')||svg.includes('<text'));
        assert(!/foreignObject|data-mjx-error|<script/.test(svg));
      }
    }
    if(shots){
      original++; const shot=shots[i];assert.equal(shot.heading,step.heading,`storyboard mismatch ${stage.id}/${i}`);
      const frames=[0,.13,.5,.87,1].map(p=>renderToStaticMarkup(React.createElement('svg',null,shot.draw(p,.55))));
      assert(new Set(frames).size>1,`static shot ${stage.id}/${i}`);
      for(const html of frames) assert(!/NaN|Infinity/.test(html),`invalid scene ${stage.id}/${i}`);
      const fp=frames.join('');assert(!fingerprints.has(fp),`reused animation ${stage.id}/${i}`);fingerprints.add(fp);
      if(shot.spatial) assert.notEqual(renderToStaticMarkup(React.createElement('svg',null,shot.draw(.45,0))),renderToStaticMarkup(React.createElement('svg',null,shot.draw(.45,1))),`camera doesn't work ${stage.id}/${i}`);
    }
  }
}
const view=readFileSync('src/components/LessonView.tsx','utf8');assert(!view.includes('<select'),'slide dropdown remains');
assert(view.includes('lesson-dot')&&view.includes('aria-current'));
console.log(JSON.stringify({result:'PASS',slidesWithEquationImages:illustrated,authoredCalculationSlides:authored,equationSvgCount:Object.keys(images).length,originalPhenomenonAnimations:original,remainingOriginalAnimationSlides:stages.reduce((n,s)=>n+s.lesson.steps.length,0)-original},null,2));
