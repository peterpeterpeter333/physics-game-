import type { LessonStep } from '../../types';
import { mechanicsCalculations } from './mechanics';
import { fieldCalculations } from './fields';
import { mathCalculations } from './math';
import { universityCalculations } from './university';
import { emCalculations } from './electromagnetism';
import { referenceCalculation } from './schema';
import { reviewCalculations } from '../high-school-review';
import { retiredEmHeadings } from '../guided-em';
export const calculationRules = [...mechanicsCalculations, ...fieldCalculations, ...mathCalculations, ...universityCalculations, ...emCalculations, ...reviewCalculations].map(rule=>({...rule,headings:rule.headings.filter(h=>!retiredEmHeadings.has(h))})).filter(rule=>rule.headings.length);
export function getCalculation(step: LessonStep) {
  if(step.story) return {title:'図と一緒に考える',lines:[...(step.story.goalTex?[{tex:step.story.goalTex,note:'今回導く式'}]:[]),...step.story.beats.filter(b=>b.tex).map(b=>({tex:b.tex!,note:b.action})),...(step.story.notes??[]).map(n=>({tex:n.tex,note:n.title}))]};
  return calculationRules.find(rule => rule.headings.includes(step.heading))?.calculation ?? referenceCalculation(step);
}
