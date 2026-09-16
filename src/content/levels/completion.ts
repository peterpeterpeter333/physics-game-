import type { LessonStep, Stage } from '../../types';
import type { BuiltLevelChapter } from './schema';
import { universityCurriculum } from '../university-curriculum';
import { universitySourceStages } from '../university-source';
import { advancedFoundations } from '../chapter-foundations-base';
import { completionChecks } from './completion-checks';
import { foregroundText } from '../lesson-text';

/** Relocation is lossless. Existing lower-level lessons get optional supplements,
 * not a second mandatory run through material they already teach. Missing topics
 * receive their own lesson with the original interactive figures and derivations. */
export const completedLevelOrigins:Record<string,string>={};
export const relocatedSteps:Record<string,LessonStep[]>={};
export const newLevelStageIds=new Set<string>();
export function completeUniversityLevels(built:BuiltLevelChapter[]){
 for(const topic of universityCurriculum){
  const source=universitySourceStages[topic.id];
  for(const level of ['intro','middle'] as const){
   const placement=topic[level];
   const target=built.find(b=>b.chapter.familyId===topic.family&&b.chapter.level===level)!;
   const existing=target.chapter.stages.find(s=>s.id===placement.id);
   const moved=placement.slides.map((i):LessonStep=>{
    const step=source.lesson.steps[i];
    if(!step)throw new Error(`Invalid migration ${topic.id}/${i}`);
    return {...step,sourceStageId:topic.id,sourceSlideIndex:i,summary:foregroundText(topic.id,step,i)};
   });
   if(moved.length)relocatedSteps[placement.id]=[...(relocatedSteps[placement.id]??[]),...moved];
   if(existing){
    existing.lesson={...existing.lesson,supplements:[...(existing.lesson.supplements??[]),...moved]};
    continue;
   }
   if(moved.length<3)throw new Error(`Missing authored preparation ${placement.id}`);
   const check=completionChecks[placement.id];
   if(!check)throw new Error(`Missing application ${placement.id}`);
   completedLevelOrigins[placement.id]=topic.id;
   newLevelStageIds.add(placement.id);
   const steps=moved.map((step,i):LessonStep=>({...step,
    beat:i===0?'基本事項':i===moved.length-1?'新しい基本事項':'解決',
    role:i===0?'観察':i===moved.length-1?'固定':'解釈',
   }));
   const title=source.title.replace(/【.*?】/g,'');
   const stage:Stage={
    id:placement.id,title,subtitle:placement.goal,
    enemy:{name:`${title}の確認`,emoji:topic.family==='umath'?'📐':topic.family==='umech'?'🚀':'🧲',maxHp:24},
    lesson:{id:`lesson-${placement.id}`,title:placement.goal,intro:placement.goal,steps,
     outro:`つながったこと：${placement.goal} 次は${level==='intro'?topic.middle.goal:topic.advanced}`},
    problems:[{id:`p-${placement.id}-check`,difficulty:level==='intro'?1:2,question:check.question,
     choices:check.choices,answerIndex:0,hint:'対象・正方向・成立条件を決めてから、図と式を対応させてみよう。',
     explanation:`$${check.tex}$。${check.reason}`}],
   };
   target.chapter.stages.push(stage);
   target.orientations[stage.id]={theme:placement.goal,goal:placement.goal};
   target.paths[stage.id]=[{end:steps.length,goal:placement.goal,gain:placement.goal}];
   target.glossaries[stage.id]={}; // quantityGlossary inherits the source topic's definitions.
   const foundation=advancedFoundations[topic.id];
   target.foundations[stage.id]={...foundation,
    known:level==='intro'?'数の正負と単位、掛け算・割り算から始める。新しい量は各図と式のそばで確認する。':topic.intro.goal,
    startingPoint:level==='intro'?'現象と測る量を先に決め、定義・基本法則と、そこから計算する結果を区別する。':`初級で確認した量を使って式を立てる。${placement.goal}`,
    example:{given:check.question,tex:check.tex,read:check.reason},
   };
  }
 }
 return built;
}
