import {chapterFoundations} from '../content/chapter-foundations';
import {EquationImage} from './CalculationBoard';

/** Keep prerequisites accessible without repeating a long introduction on every slide. */
export function ChapterFoundation({stageId}:{stageId:string}){
 const entry=chapterFoundations[stageId];
 if(!entry)return null;
 return <details className="study-overview chapter-foundation">
  <summary>出発点・使える条件・数値例を確認</summary>
  <p><strong>既に使える考え方：</strong>{entry.known}</p>
  <p><strong>定義・法則から出発：</strong>{entry.startingPoint}</p>
  <p><strong>この章での条件：</strong>{entry.conditions}</p>
  <section aria-label="数値で確かめる例">
   <h3>数値で確かめると</h3>
   <p>{entry.example.given}</p>
   <EquationImage tex={entry.example.tex}/>
   <p>{entry.example.read}</p>
  </section>
 </details>;
}
