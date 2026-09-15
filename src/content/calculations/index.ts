import type { LessonStep } from '../../types';
import { mechanicsCalculations } from './mechanics';
import { fieldCalculations } from './fields';
import { mathCalculations } from './math';
import { universityCalculations } from './university';
import { emCalculations } from './electromagnetism';
import { referenceCalculation } from './schema';
export const calculationRules = [...mechanicsCalculations, ...fieldCalculations, ...mathCalculations, ...universityCalculations, ...emCalculations];
export function getCalculation(step: LessonStep) {
  return calculationRules.find(rule => rule.headings.includes(step.heading))?.calculation ?? referenceCalculation(step);
}
