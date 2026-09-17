import type { Chapter } from "../types";
import { mechanics } from "./mechanics";
import { thermo } from "./thermo";
import { waves } from "./waves";
import { electromagnetism } from "./electromagnetism";
import { atomic } from "./atomic";
import { universitySource } from './university-source';
import { removedIndices, topicById } from './university-curriculum';
import { enrichChapters } from './explanations';
import { levelChapters } from './university-levels';
import { studySupport } from './study-support';

// 高校物理の5分野 + 大学編3分野。分野間は独立(学校の進度に合わせてどこからでも始められる)。
// 全ステージを自由に選べる。説明は主題ごとの手書きの補足を組み込む。
// 大学編は「数学の武器庫」→「力学」→「電磁気」の順に進むのを推奨(内容が積み上がる)。
export const chapters: Chapter[] = enrichChapters([
  mechanics,
  thermo,
  waves,
  electromagnetism,
  atomic,
]).concat(universitySource.map(chapter=>({...chapter,level:'advanced' as const,
 stages:chapter.stages.map(stage=>stage.lesson.steps[0]?.story?stage:{...stage,
  subtitle:topicById[stage.id].advanced,
  lesson:{...stage.lesson,intro:topicById[stage.id].advanced,
   steps:stage.lesson.steps.map((step,i)=>({...step,sourceStageId:stage.id,sourceSlideIndex:i}))
    .filter(step=>!removedIndices(stage.id).has(step.sourceSlideIndex)),
  },
 }),
}))).concat(levelChapters).map(chapter=>({...chapter,stages:chapter.stages.map(stage=>{
 const aid=studySupport[stage.id];
 if(!aid)throw new Error(`Missing reviewed study support: ${stage.id}`);
 const swap=stage.id.length%2===1;
 return {...stage,problems:[...stage.problems,{
  id:`review-${stage.id}`,difficulty:1 as const,question:aid.question,
  choices:swap?[aid.choices[1],aid.choices[0]]:[...aid.choices],answerIndex:swap?1:0,
  hint:aid.focus,explanation:`${aid.focus} ${aid.why}`,
 }]};
})}));
