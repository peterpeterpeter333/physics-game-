import type {Problem} from '../types';
import {QuantityGlossary} from './QuantityGlossary';
import {MathBlock,MathText} from './MathText';
import './spiral-lesson.css';
import './study-flow.css';

/** The original answer and reasoning are unchanged; definitions can be checked in place. */
export function ProblemMeaning({problem,stageId}:{problem:Problem;stageId:string}){
 const equations=[...new Set(Array.from(problem.explanation.matchAll(/\$([^$]+)\$/g),m=>m[1]).filter(tex=>/[=<>]|\\(?:approx|propto|simeq)/.test(tex)))];
 const symbols=[...equations,...Array.from(problem.question.matchAll(/\$([^$]+)\$/g),m=>m[1])];
 return <details className="study-original"><summary>解説に出てきた式・記号を確認する</summary>
  <p>今回解くこと：<MathText text={problem.question}/></p>
  {equations.map(tex=><MathBlock key={tex} tex={tex}/>)}
  <QuantityGlossary stageId={stageId} expressions={symbols}/>
 </details>;
}
