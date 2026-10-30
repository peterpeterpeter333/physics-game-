import { useState } from 'react';
import type { Stage } from '../types';
import { studySupport } from '../content/study-support';
import { MathText } from './MathText';
import './study-flow.css';
import {studyExperiments} from './StudyExperiments';

/** One compact bridge, not another mandatory run of slides. */
export function StudyAid({stage,onPractice}:{stage:Stage;onPractice?:()=>void}) {
 const aid=studySupport[stage.id];
 const [selected,setSelected]=useState<number|null>(null);
 const [open,setOpen]=useState(false);
 const Experiment=studyExperiments[stage.id];
 const order=stage.id.length%2 ? [1,0] : [0,1];
 if(!aid)return null;
 return <aside className="study-aid"><p className="study-aid-focus">{aid.focus}</p><details onToggle={e=>setOpen(e.currentTarget.open)}>
  <summary>前提を確認・一問試す（読み直しを短縮）</summary>
  <p>{aid.example}</p>
  {open&&Experiment&&<Experiment/>}
  <fieldset><legend>{aid.question}</legend>
   {order.map(i=><button className="btn btn-ghost" key={i} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{aid.choices[i]}</button>)}
  </fieldset>
  {selected!==null&&<p role="status">{selected===aid.answer?'確認できました。':'ここを確かめましょう。'} {aid.why}</p>}
  {selected===aid.answer&&onPractice&&<button className="btn btn-primary" onClick={onPractice}>説明を省略して、この章の確認問題へ</button>}
  <details><summary>解くために必要な式を確認する</summary><p><MathText text={stage.lesson.intro}/></p></details>
 </details></aside>;
}
