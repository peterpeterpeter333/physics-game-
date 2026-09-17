import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {chapters} from '../src/content';
import {spiralLessons} from '../src/content/em-spiral';
import {movedCycles} from '../src/content/university-curriculum';
import {learningPaths} from '../src/content/learning-paths';
import {emVideoNarration} from '../src/content/em-video-narration';
import {REGISTRY} from '../src/components/figures';
import {reviewShots} from '../src/components/figures/unique';
import {VideoTimeContext} from '../src/components/figures/anim';
import {EMScene3D} from '../src/components/EMScene3D';
import {scene3DFor} from '../src/components/em3d-model';
import {PathMeaning} from '../src/components/PathMeaning';
import {GuidedScene} from '../src/components/GuidedScene';
import {getCalculation} from '../src/content/calculations';
import {integralEquationGuides} from '../src/content/em-equation-guides';
import {gaussEquationGuide} from '../src/content/gauss-equation-guides';

export const stages=chapters.filter(c=>['uem','ui-em','um-em'].includes(c.id)).flatMap(c=>c.stages.map(stage=>{
 const cycles=spiralLessons[stage.id]?.filter(c=>!movedCycles[stage.id]?.[c.id]);
 const steps=cycles?cycles.flatMap(cycle=>cycle.cards.map((card,phase)=>({...card,heading:card.title,body:card.text,cycle:cycle.id,phase,goal:cycle.goal,guide:stage.id==='ue-integrals'?integralEquationGuides[cycle.id]?.[card.guideIndex??phase]:gaussEquationGuide(stage,cycle,phase)}))):stage.lesson.steps.map(s=>({...s,calculation:getCalculation(s)}));
 const narration=emVideoNarration[stage.id];
 if(narration?.length!==steps.length)throw Error(`Narration coverage: ${stage.id}`);
 return {id:stage.id,title:stage.title,level:c.level,steps:steps.map((s,i)=>({...s,narration:narration[i]})),units:learningPaths[stage.id]};
}));

export function diagram(step:any,t:number){
 const scene=step.cycle?scene3DFor(step.cycle,step.phase):undefined;
 const Figure=REGISTRY[step.figure];
 const shot=reviewShots[step.figure];
 const node=scene?<EMScene3D scene={scene} phase={step.phase} videoTime={t}/>:step.pathPart!==undefined?<PathMeaning initialPart={step.pathPart} videoTime={t}/>:shot?<svg viewBox="0 0 320 220">{shot.draw(Math.min(1,t/12),.55)}</svg>:Figure?<Figure/>:step.scene?<GuidedScene scene={step.scene} beat={step.beat??Math.min(step.phase??0,2)}/>:null;
 if(!node)throw Error(`No diagram: ${JSON.stringify(step)}`);
 const html=renderToStaticMarkup(<VideoTimeContext.Provider value={t}>{node}</VideoTimeContext.Provider>);
 const svg=html.match(/<svg\b[\s\S]*?<\/svg>/)?.[0];
 if(!svg)throw Error(`No SVG: ${step.figure||step.scene}`);
 return {svg,spatial:!!scene};
}
