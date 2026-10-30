import { useState } from 'react';
import type { Stage } from '../types';
import { Figure } from './figures';
import { UniqueFigure,getUniqueShot } from './figures/unique';
import { MathText } from './MathText';
import { QuantityGlossary } from './QuantityGlossary';
import { CalculationBoard } from './CalculationBoard';
import { getCalculation } from '../content/calculations';
import { movedCycles } from '../content/university-curriculum';
import { spiralLessons } from '../content/em-spiral';
import { universitySourceStages } from '../content/university-source';
import { SpiralLesson } from './SpiralLesson';

/** Mount only the selected figure: closed reviews must not run hundreds of animations. */
export function MovedMaterial({stage}:{stage:Stage}){
 const [open,setOpen]=useState(false),[selected,setSelected]=useState(0);
 const supplements=stage.lesson.supplements??[];
 const cycles=Object.entries(movedCycles).flatMap(([source,targets])=>Object.entries(targets)
  .filter(([,target])=>target===stage.id).map(([id])=>({source,cycle:spiralLessons[source].find(c=>c.id===id)!})));
 if(!supplements.length&&!cycles.length)return null;
 const step=supplements[selected],cycle=cycles[selected-supplements.length];
 const calc=step?getCalculation(step):undefined;
 const shot=step?getUniqueShot(step.sourceStageId??stage.id,step):undefined;
 return <details className="study-overview moved-material" onToggle={e=>setOpen(e.currentTarget.open)}>
  <summary>必要なときだけ：上級から移した説明・途中式（{supplements.length+cycles.length}件）</summary>
  {open&&<><p>主な流れで理解できたら、ここを繰り返し読む必要はありません。</p>
   <nav aria-label="移した補足を選ぶ">{[...supplements.map(s=>s.heading),...cycles.map(c=>c.cycle.title)].map((h,i)=><button key={i} className="btn btn-ghost" aria-current={selected===i?'step':undefined} onClick={()=>setSelected(i)}>{h}</button>)}</nav>
   {step&&<section key={selected}><h3>{step.heading}</h3><MathText text={step.body}/>
    {shot?<UniqueFigure shot={shot} id={`moved-${stage.id}-${selected}`}/>:step.figure&&<Figure id={step.figure}/>}
    <QuantityGlossary stageId={step.sourceStageId??stage.id} expressions={[step.formula??'',...(calc?.lines.map(l=>l.tex)??[])]}/>
    {calc&&<CalculationBoard calculation={calc} purpose={step.heading}/>}</section>}
   {cycle&&<SpiralLesson key={cycle.cycle.id} stage={universitySourceStages[cycle.source]} cyclesOverride={[cycle.cycle]} embedded alreadyFinished onExit={()=>setSelected(0)} onComplete={()=>setSelected(0)}/>}
  </>}
 </details>;
}
