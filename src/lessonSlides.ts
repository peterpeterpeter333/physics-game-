import type { LessonStep } from "./types";

/**
 * A lesson used to show one dense paragraph per screen. That made the early
 * chapters feel much faster than the carefully scaffolded university EM
 * lessons. This adapter keeps the authored content intact, but breaks a
 * short lesson into roughly ten small, readable teaching cards.
 *
 * The benchmark lessons that already have ten or more authored steps (for
 * example "∮ 記号の読み方") pass through unchanged.
 */
export type LessonSlide = LessonStep & {
  sourceStep: number;
  part: number;
  parts: number;
};

const TARGET_SLIDES = 10;

function sentences(text: string): string[] {
  // Keep the original punctuation and all inline KaTeX. Japanese explanatory
  // prose is normally sentence-delimited by 。, so this avoids cutting a
  // formula or a Markdown emphasis marker in half.
  const chunks = text.match(/[^。！？]+[。！？]?/g) ?? [text];
  return chunks.map((chunk) => chunk.trim()).filter(Boolean);
}

function splitIntoParts(text: string, parts: number): string[] {
  if (parts <= 1) return [text];

  const source = sentences(text);
  if (source.length >= parts) {
    const result: string[] = [];
    let cursor = 0;
    for (let part = 0; part < parts; part += 1) {
      const remainingSentences = source.length - cursor;
      const remainingParts = parts - part;
      const take = Math.ceil(remainingSentences / remainingParts);
      result.push(source.slice(cursor, cursor + take).join(" "));
      cursor += take;
    }
    return result;
  }

  // A few concise steps contain fewer Japanese sentence boundaries than the
  // number of cards assigned to them. Split only at whitespace as a fallback;
  // if there is no safe boundary, leave the authored sentence whole rather
  // than corrupting math notation.
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length >= parts) {
    return Array.from({ length: parts }, (_, index) => {
      const start = Math.floor((index * words.length) / parts);
      const end = Math.floor(((index + 1) * words.length) / parts);
      return words.slice(start, end).join(" ");
    });
  }
  return [text];
}

function allocations(steps: LessonStep[]): number[] {
  if (steps.length >= TARGET_SLIDES) return steps.map(() => 1);

  const result = steps.map(() => 1);
  let remaining = TARGET_SLIDES - steps.length;
  const weights = steps.map((step) => Math.max(step.body.length, 1));

  // Give each extra card to the currently least-expanded long explanation.
  // This makes long conceptual explanations slower without inventing or
  // changing scientific claims in the authored content.
  while (remaining > 0) {
    let chosen = 0;
    let best = -Infinity;
    for (let index = 0; index < steps.length; index += 1) {
      const score = weights[index] / result[index];
      if (score > best) {
        best = score;
        chosen = index;
      }
    }
    result[chosen] += 1;
    remaining -= 1;
  }
  return result;
}

export function lessonSlides(steps: LessonStep[]): LessonSlide[] {
  const perStep = allocations(steps);

  return steps.flatMap((step, sourceStep) => {
    const bodies = splitIntoParts(step.body, perStep[sourceStep]);
    return bodies.map((body, index) => {
      const parts = bodies.length;
      const continuation = index > 0 ? ` — つづき ${index + 1}/${parts}` : "";
      return {
        ...step,
        heading: `${step.heading}${continuation}`,
        body,
        // A visual stays with the first part. The formula is shown after the
        // final explanatory part, so the learner sees its meaning first.
        figure: index === 0 ? step.figure : undefined,
        formula: index === parts - 1 ? step.formula : undefined,
        formulaNote: index === parts - 1 ? step.formulaNote : undefined,
        sourceStep,
        part: index + 1,
        parts,
      };
    });
  });
}
