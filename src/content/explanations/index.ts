import type { Chapter } from '../../types';
import { mechanicsPlans } from './mechanics';
import { thermalWavePlans } from './thermal-waves';
import { emAtomicPlans } from './em-atomic';
import { mathPlans } from './math';
import { univMechanicsPlans } from './univ-mechanics';
import { univEmPlans } from './univ-em';
import { corrections } from './corrections';
import { intros } from './intros';
import { highSchoolReviews } from '../high-school-review';
import { guidedLessons, guidedProblems } from '../guided-em';

const basePlans = { ...mechanicsPlans, ...thermalWavePlans, ...emAtomicPlans, ...mathPlans, ...univMechanicsPlans, ...univEmPlans };
export const explanationPlans = Object.fromEntries(Object.entries(basePlans).map(([id, plan]) => [id,
 {...plan, bridges: [...(highSchoolReviews[id] ?? []), ...plan.bridges]},
]));
const spatialFigures: Record<string,string> = {
 'cross-product':'cross-3d', 'right-hand':'cross-3d', 'area-vector':'flux-3d',
 'flux-tilt':'flux-3d', 'helix':'helix-3d', 'em-wave':'em-wave-3d',
};
export function enrichChapters(source: Chapter[]): Chapter[] {
 return source.map(chapter => ({...chapter, stages: chapter.stages.map(stage => {
  if (guidedLessons[stage.id]) return {...stage,lesson:guidedLessons[stage.id],problems:guidedProblems[stage.id]};
  const plan = explanationPlans[stage.id];
  if (!plan) throw new Error(`Missing authored explanation plan: ${stage.id}`);
  const original = stage.lesson.steps;
  const steps = Array.from({length:original.length+1}, (_, index) => [
   ...plan.bridges.filter(bridge => bridge.before === index).map(bridge => bridge.step),
   ...(index < original.length ? [{...original[index], figure: original[index].figure ?? plan.figures[index], ...corrections[stage.id]?.[index]}] : []),
  ]).flat().map(step => ({...step, heading:step.heading.replace(/^[①-⑳]\s*/,''), figure:spatialFigures[step.figure ?? ''] ?? step.figure}));
  if (steps.length < 10 || steps.some(step => !step.figure)) throw new Error(`Incomplete slides: ${stage.id}`);
  return {...stage, lesson:{...stage.lesson, steps, intro:intros[stage.id] ?? stage.lesson.intro,
   ...(stage.id==='ue-maxwell' ? {outro:'交流の応答を微分積分で求め、真空のマクスウェル方程式から波動方程式と光速を導いた。基本法則・成立条件・そこからの計算を区別して読むことが、次の現象を理解する道具になる。'} : {}),
  }};
 })}));
}
