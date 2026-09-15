import type { LessonStep } from "./types";

/**
 * A lesson used to show one dense paragraph per screen.  That made the early
 * chapters feel much faster than the carefully scaffolded university EM
 * lessons.  This adapter keeps the authored content intact, but breaks a
 * short lesson into roughly ten small, readable teaching cards.
 *
 * The benchmark lessons that already have ten or more authored steps (for
 * example "∮ 記号の読み方") pass through unchanged.
 */
export type LessonSlide = LessonStep & {
  sourceStep: number;
  part: number;
  parts: number;
  checkpoint: string;
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

  // Do not split at spaces: spaces can occur inside LaTeX or Markdown and a
  // malformed expression is worse than one slightly longer card.
  return [text];
}

function checkpoint(step: LessonStep, part: number, parts: number): string {
  if (part < parts) {
    return "ここでいったん止まろう。今の文で「何を比べたか」を、自分の言葉で言い直してから次へ進もう。";
  }
  if (step.formulaNote) {
    return `式を暗記する前に、「${step.formulaNote}」を例を使って説明できるか確かめよう。`;
  }
  if (step.figure) {
    return "図の矢印・線・量のうち、本文で説明しているものを一つ指さして対応を確かめよう。";
  }
  return "この話を、記号を使わずに日常の言葉で一文に言い換えられたら次へ進もう。";
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

  const expanded = steps.flatMap((step, sourceStep) => {
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
        checkpoint: checkpoint(step, index + 1, parts),
      };
    });
  });

  // Extremely concise authored steps are kept whole to protect math markup.
  // Fill any resulting gap with active-recall cards, rather than inventing
  // scientific detail that has not been reviewed in the source curriculum.
  let cursor = 0;
  while (expanded.length < TARGET_SLIDES && steps.length > 0) {
    const sourceStep = cursor % steps.length;
    const step = steps[sourceStep];
    expanded.push({
      ...step,
      heading: `理解チェック — ${step.heading}`,
      body: `ここまでの「${step.heading}」を、式を見ずに説明してみよう。本文に出てきた具体例について、「何が変わり、何を比べるのか」を順に言えるか確かめる。`,
      figure: undefined,
      formula: undefined,
      formulaNote: undefined,
      sourceStep,
      part: 1,
      parts: 1,
      checkpoint: "答えを急がず、本文の例へ戻って理由を確かめよう。",
    });
    cursor += 1;
  }
  return expanded;
}
