import type { LessonStep } from '../../types';

/** Authored bridges, inserted immediately BEFORE the zero-based original step.
 * No sentence splitting, length-based padding, or generated learner-facing text. */
export type Bridge = { before: number; step: LessonStep };
export type Plan = { figures: string[]; bridges: Bridge[] };
export const b = (before: number, heading: string, figure: string, body: string, formula?: string): Bridge =>
  ({ before, step: { heading, figure, body, ...(formula ? { formula } : {}) } });
export const raw = String.raw;
