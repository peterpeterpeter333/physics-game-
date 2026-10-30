import type { LessonStep } from '../../types';

export type CalculationLine = { tex: string; note: string };
export type Calculation = { title: string; lines: CalculationLine[]; reference?: boolean };
export type CalculationRule = { headings: string[]; calculation: Calculation };
/** Explicit, authored algebra. Never infer an algebraic operation from prose. */
export const calc = (headings: string, ...rows: string[]): CalculationRule => ({
  headings: headings.split('|'),
  calculation: { title: '式を一段ずつ追う', lines: rows.map(row => {
    const [note, ...tex] = row.split(' :: ');
    return { note, tex: tex.join(' :: ') };
  }) },
});
export const r = String.raw;

/** Keep complete expressions intact: equality chains are not separate equations.
 * Prose expressions are displayed as references, NOT labelled equivalent steps. */
export function referenceCalculation(step: LessonStep): Calculation | undefined {
  const formulas = [...step.body.matchAll(/\$([^$]+)\$/g)].map(m => m[1])
    .filter(tex => /[=<>]|\\(?:approx|equiv|propto|leq|geq|Rightarrow)/.test(tex) && !/[=<>]\s*$/.test(tex));
  if (step.formula) formulas.push(step.formula);
  const unique = [...new Set(formulas.map(f => f.trim()))];
  if (!unique.length) return;
  return { title: 'このスライドの数式', reference:true, lines: unique.map(tex => ({tex, note: '本文と対応する式'})) };
}
