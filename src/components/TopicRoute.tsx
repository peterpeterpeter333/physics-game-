import { universityCurriculum } from '../content/university-curriculum';
import { levelLabels } from '../content/university-levels';
export function TopicRoute({stageId,onOpenStage}:{stageId:string;onOpenStage?:(id:string)=>void}){
 const topics=universityCurriculum.filter(t=>t.id===stageId||t.intro.id===stageId||t.middle.id===stageId);
 if(!topics.length||!onOpenStage)return null;
 return <details className="study-overview topic-route"><summary>この単元の初級 → 中級 → 上級</summary>
  {topics.map(t=><section key={t.id} aria-label="単元の三段階">
   {(['intro','middle','advanced'] as const).map(level=>{
    const id=level==='advanced'?t.id:t[level].id;
    const goal=level==='advanced'?t.advanced:t[level].goal;
    return <p key={level}><button className="btn btn-ghost" aria-current={stageId===id?'step':undefined} onClick={()=>onOpenStage(id)}>{levelLabels[level]}</button> {goal}</p>;
   })}
  </section>)}
 </details>;
}
