import assert from 'node:assert/strict';
import Module from 'node:module';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import katex from 'katex';

const bundle = await build({
  stdin: { contents: `export { chapters } from './src/content';
    export { formulas } from './src/content/formulas';
    export { lessonOrientations } from './src/content/lesson-orientation';
    export { LessonOrientation } from './src/components/LessonOrientation';
    export { MathText } from './src/components/MathText';`, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
  jsx: 'automatic', plugins: [{ name: 'omit-styles-in-ssr-audit', setup(build) {
    build.onResolve({ filter: /\.css$/ }, args => ({ path: args.path, namespace: 'styles' }));
    build.onLoad({ filter: /.*/, namespace: 'styles' }, () => ({ contents: '', loader: 'js' }));
  } }],
});
const module = new Module(`${process.cwd()}/.math-audit.cjs`);
module.paths = Module._nodeModulePaths(process.cwd());
module._compile(bundle.outputFiles[0].text, module.id);
const { chapters, formulas, MathText, lessonOrientations, LessonOrientation } = module.exports;
let proseFields = 0, expressions = 0;
function checkProse(text, location) {
  assert(!/[\x00-\x08\x0b-\x1f]/.test(text), `Escaped TeX command became a control character: ${location}`);
  assert.equal((text.match(/\$/g) || []).length % 2, 0, `Unpaired math delimiter: ${location}`);
  const math = [...text.matchAll(/\$([^$]+)\$/g)];
  const plain = text.replace(/\$[^$]+\$/g, '');
  assert(!/[\\_^]/.test(plain), `Unformatted TeX in prose: ${location}: ${plain}`);
  for (const [, tex] of math) {
    katex.renderToString(tex, { throwOnError: true, strict: 'ignore' });
    expressions++;
  }
  const html = renderToStaticMarkup(React.createElement(MathText, { text }));
  assert(!html.includes('katex-error'), `Render error: ${location}`);
  assert.equal((html.match(/class="math-inline"/g) || []).length, math.length,
    `Math was split by emphasis or left unrendered: ${location}`);
  proseFields++;
}
function walk(value, location = 'content') {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    const path = `${location}.${key}`;
    if (typeof child === 'string') {
      if (key === 'formula' || key === 'tex') {
        katex.renderToString(child, { throwOnError: true, strict: 'ignore' });
        expressions++;
      } else if (!['id', 'stageId', 'figure', 'color', 'icon'].includes(key)) checkProse(child, path);
    } else walk(child, path);
  }
}
walk({ chapters, formulas, lessonOrientations });
const stages = chapters.flatMap(chapter => chapter.stages);
assert.deepEqual(Object.keys(lessonOrientations).sort(), stages.map(stage => stage.id).sort(), 'Every stage needs an authored destination');
let orientedSlides = 0;
for (const stage of stages) {
  const destination = lessonOrientations[stage.id];
  assert(destination.theme.length > 8 && destination.goal.length > 25, `Empty destination: ${stage.id}`);
  for (const [page, step] of stage.lesson.steps.entries()) {
    const html = renderToStaticMarkup(React.createElement(LessonOrientation, {
      stageId: stage.id, heading: step.heading, page, total: stage.lesson.steps.length, review: step.review,
    }));
    for (const label of ['この章のテーマ', '目標の式・性質', '今の話']) assert(html.includes(label));
    assert(html.includes(destination.theme), `Wrong theme: ${stage.id}/${page}`);
    assert(html.includes(`${page + 1} / ${stage.lesson.steps.length}`), 'Wrong slide progress');
    assert(html.indexOf('lesson-destination') < html.indexOf('<h2>'), 'Destination must come before the current topic');
    assert(!html.includes('katex-error'));
    if(step.review) assert(html.includes('高校の復習・大学への準備'));
    orientedSlides++;
  }
}
// Regression: bold prose and integral bounds / exponent / vector subscripts.
for (const text of [String.raw`**電位差は $V_B-V_A$**、仕事は $q\int_A^B\vec E\cdot d\vec r$。`,
  String.raw`$q=CV_0(1-e^{-t/(RC)})$ と $v_\perp$ を区別する。`]) checkProse(text, 'regression');
console.log(JSON.stringify({ proseFields, expressions, orientedStages: stages.length, orientedSlides, result: 'PASS' }, null, 2));
