import type { Chapter, Stage } from '../types';
import type { Progress } from './state';

export type DiscoveryState = 'unseen' | 'studied' | 'mastered';

export function discoveryState(stage: Stage, progress: Progress): DiscoveryState {
  if (progress.clearedStages.includes(stage.id)) return 'mastered';
  if (progress.finishedLessons.includes(stage.lesson.id)) return 'studied';
  return 'unseen';
}

export function discoveryCounts(chapters: Chapter[], progress: Progress) {
  const stages = chapters.flatMap(chapter => chapter.stages);
  const studied = stages.filter(stage => discoveryState(stage, progress) !== 'unseen').length;
  const mastered = stages.filter(stage => discoveryState(stage, progress) === 'mastered').length;
  return { total: stages.length, studied, mastered };
}
