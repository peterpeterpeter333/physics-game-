import type { Lesson, LessonStep } from '../types';
import { slideSummaries } from './slide-summaries';
import { clarityRevisions } from './clarity-revisions';
export function foregroundText(stageId:string,step:LessonStep,index:number){
 const id=step.sourceStageId??stageId, sourceIndex=step.sourceSlideIndex??index;
 return step.summary??clarityRevisions[id]?.[step.heading]?.body??slideSummaries[id]?.[sourceIndex]??step.body;
}
export const allLessonSteps=(lesson:Lesson)=>[...lesson.steps,...(lesson.supplements??[])];
