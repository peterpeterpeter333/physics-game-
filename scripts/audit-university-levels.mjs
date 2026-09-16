import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import Module from 'node:module';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import katex from 'katex';

/** 大学編の初級・中級だけを検査する。既存56ステージは audit-lessons.mjs が担当する。 */

const imports = `
 export { chapters } from './src/content';
 export { levelStageIds, levelPreviews, preparationFor, universityFamilies, levelChapters } from './src/content/university-levels';
 export { REGISTRY, Figure } from './src/components/figures';
 export { levelReadings } from './src/components/figures/levels';
 export { lessonOrientations } from './src/content/lesson-orientation';
 export { learningPaths, unitAt, phaseLabel } from './src/content/learning-paths';
 export { quantityGlossary } from './src/content/quantity-glossary';
 export { chapterFoundations } from './src/content/chapter-foundations';
 export { getCalculation, calculationRules } from './src/content/calculations';
`;
const bundle = await build({
  stdin: { contents: imports, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic',
  plugins: [{ name: 'omit-styles', setup(b) {
    b.onResolve({ filter: /\.css$/ }, args => ({ path: args.path, namespace: 'styles' }));
    b.onLoad({ filter: /.*/, namespace: 'styles' }, () => ({ contents: '', loader: 'js' }));
  } }],
});
const mod = new Module(`${process.cwd()}/.level-audit.cjs`);
mod.paths = Module._nodeModulePaths(process.cwd());
mod._compile(bundle.outputFiles[0].text, mod.id);
const {
  chapters, levelStageIds, levelPreviews, preparationFor, universityFamilies, levelChapters,
  REGISTRY, Figure, levelReadings, lessonOrientations, learningPaths, unitAt, phaseLabel,
  quantityGlossary, chapterFoundations, getCalculation, calculationRules,
} = mod.exports;

const images = existsSync('src/content/calculations/equations.generated.json')
  ? JSON.parse(readFileSync('src/content/calculations/equations.generated.json', 'utf8')) : {};
const all = chapters.flatMap(c => c.stages);
const advanced = chapters.filter(c => !c.level || c.level === 'advanced').flatMap(c => c.stages);
const levels = chapters.filter(c => c.level === 'intro' || c.level === 'middle');
const stages = levels.flatMap(c => c.stages);

// 既存データを壊していないこと
assert.equal(advanced.length, 56, '既存の上級56ステージが変わっている');
assert.equal(new Set(all.map(s => s.id)).size, all.length, 'ステージIDが重複している');
assert.equal(new Set(all.flatMap(s => s.problems.map(p => p.id))).size,
  all.reduce((n, s) => n + s.problems.length, 0), '問題IDが重複している');
assert.equal(new Set(all.map(s => s.lesson.id)).size, all.length, 'レッスンIDが重複している');

// 章の構成
for (const family of universityFamilies) {
  const present = family.levels.filter(entry => chapters.some(c => c.id === entry.chapterId));
  assert(present.some(entry => entry.level === 'advanced'), `上級が見つからない: ${family.id}`);
  for (const entry of present) {
    const chapter = chapters.find(c => c.id === entry.chapterId);
    assert(chapter.stages.length > 0, `空の章: ${entry.chapterId}`);
    assert(entry.tagline.length >= 6, `段階の案内が短い: ${entry.chapterId}`);
  }
}
const questMap = readFileSync('src/components/QuestMap.tsx', 'utf8');
assert(!/locked|prevCleared|disabled=/.test(questMap), '段階や単元を開けなくする仕組みが入っている');

const beats = ['基本事項', '疑問', '解決', '新しい基本事項'];
const prose = (text, where) => {
  assert.equal((text.match(/\$/g) || []).length % 2, 0, `$ が閉じていない: ${where}`);
  for (const m of text.matchAll(/\$([^$]+)\$/g)) katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' });
  const plain = text.replace(/\$[^$]+\$/g, '');
  assert(!/[\\_^]/.test(plain), `$ の外に TeX 記法が出ている: ${where}: ${plain}`);
  assert(!/undefined|NaN|\[object/.test(text), `未定義の値が混入: ${where}`);
};
const tex = (value, where) => {
  katex.renderToString(value, { throwOnError: true, strict: 'ignore' });
  assert(!/[぀-ヿ一-鿿]/.test(value.replace(/\\text\{[^}]*\}/g, '')),
    `数式の中の日本語は \\text{} で包む: ${where}: ${value}`);
};

let slideCount = 0, figureIds = new Set(), unitCount = 0, problemCount = 0;
for (const stage of stages) {
  const where = stage.id;
  assert(/^u[im]-/.test(stage.id), `初級は ui-、中級は um- で始める: ${stage.id}`);
  assert(levelStageIds.has(stage.id), `レベル一覧に載っていない: ${stage.id}`);
  assert(stage.enemy?.name && stage.enemy?.emoji && stage.enemy.maxHp > 0, `敵の設定がない: ${where}`);

  // 出発点・目的地
  const orientation = lessonOrientations[stage.id];
  assert(orientation, `この章のテーマがない: ${where}`);
  assert(orientation.theme.length > 8 && orientation.goal.length > 25, `テーマか目標が短い: ${where}`);
  prose(orientation.goal, `${where}/goal`);
  const foundation = chapterFoundations[stage.id];
  assert(foundation, `出発点（基本事項）がない: ${where}`);
  assert(foundation.known.length > 15 && foundation.startingPoint.length > 10 && foundation.conditions.length > 10,
    `出発点の記述が短い: ${where}`);
  tex(foundation.example.tex, `${where}/foundation`);

  // 段（学習経路）
  const path = learningPaths[stage.id];
  assert(path, `学習の段がない: ${where}`);
  assert.equal(path.at(-1).end, stage.lesson.steps.length, `段の終わりがスライド数と合わない: ${where}`);
  let start = 0;
  for (const unit of path) {
    assert(unit.end - start >= 2, `1段が短すぎる: ${where}`);
    assert(unit.goal && unit.gain, `段の目的か成果がない: ${where}`);
    for (let page = start; page < unit.end; page++) {
      const at = unitAt(path, page);
      assert.equal(at.start, start);
      assert(phaseLabel(at.offset, at.count));
    }
    start = unit.end;
    unitCount++;
  }

  // スライド
  assert(stage.lesson.steps.length >= 6, `スライドが少ない: ${where}`);
  prose(stage.lesson.intro, `${where}/intro`);
  prose(stage.lesson.outro, `${where}/outro`);
  const seen = new Set();
  for (const [i, step] of stage.lesson.steps.entries()) {
    const at = `${where}/${i}`;
    prose(step.heading, `${at}/heading`);
    prose(step.body, `${at}/body`);
    assert([...step.body].length <= 150, `本文が150字を超えている: ${at}`);
    assert(!seen.has(step.body), `本文が重複している: ${at}`);
    seen.add(step.body);
    assert(step.figure, `図解のないスライドがある: ${at}`);
    assert(REGISTRY[step.figure], `図解IDが見つからない: ${at}: ${step.figure}`);
    assert(levelReadings[step.figure], `「この図で見ること」がない: ${step.figure}`);
    figureIds.add(step.figure);
    assert(beats.includes(step.beat), `四拍子の札がない: ${at}`);
    if (step.formula) tex(step.formula, `${at}/formula`);
    if (step.formulaNote) prose(step.formulaNote, `${at}/formulaNote`);
    const calculation = getCalculation(step);
    if (calculation) for (const line of calculation.lines) {
      tex(line.tex, `${at}/calculation`);
      assert(line.note, `変形の理由が書かれていない: ${at}`);
      if (Object.keys(images).length) assert(images[line.tex], `数式画像が生成されていない: ${at}: ${line.tex}`);
    }
    slideCount++;
  }
  // 四拍子: 基本事項で始まり、疑問と解決を経て、新しい基本事項で終わる
  const order = stage.lesson.steps.map(s => s.beat);
  assert.equal(order[0], '基本事項', `最初のスライドは基本事項から: ${where}`);
  assert.equal(order.at(-1), '新しい基本事項', `最後のスライドは新しい基本事項で締める: ${where}`);
  assert(order.includes('疑問'), `疑問のスライドがない: ${where}`);
  assert(order.includes('解決'), `解決のスライドがない: ${where}`);

  // 記号表
  const glossary = quantityGlossary(stage.id);
  assert(glossary.length >= 8, `記号の説明が8件未満: ${where}`);
  assert.equal(new Set(glossary.map(d => d.key)).size, glossary.length, `記号が重複: ${where}`);
  for (const entry of glossary) assert(entry.label && entry.meaning, `記号の説明が空: ${where}`);

  // 上級編の予告
  const preview = levelPreviews[stage.id];
  if (preview) {
    tex(preview.goal, `${where}/preview`);
    assert(preview.now.length > 8 && preview.later.length > 8, `予告の対応付けが短い: ${where}`);
  }

  // 問題
  assert(stage.problems.length >= 4, `確認問題が4問未満: ${where}`);
  for (const problem of stage.problems) {
    const at = `${where}/${problem.id}`;
    assert(/^p-u[im]/.test(problem.id), `問題IDの接頭辞: ${at}`);
    assert.equal(problem.choices.length, 4, `選択肢は4つ: ${at}`);
    assert.equal(new Set(problem.choices).size, 4, `選択肢が重複: ${at}`);
    assert(problem.answerIndex >= 0 && problem.answerIndex < 4, `正解番号が範囲外: ${at}`);
    assert([1, 2, 3].includes(problem.difficulty), `難易度は1〜3: ${at}`);
    assert(problem.hint && problem.explanation.length >= 40, `解説が短い: ${at}`);
    assert(!/上の図|図のように|先ほどの図/.test(problem.question), `問題文が図を参照している: ${at}`);
    prose(problem.question, `${at}/question`);
    problem.choices.forEach((c, k) => prose(c, `${at}/choice${k}`));
    prose(problem.hint, `${at}/hint`);
    prose(problem.explanation, `${at}/explanation`);
    problemCount++;
  }
}

// 図解が実際に描けること
for (const id of figureIds) {
  const html = renderToStaticMarkup(React.createElement(Figure, { id }));
  assert(html.includes('<svg'), `SVGが出ない: ${id}`);
  assert(!/NaN|Infinity/.test(html), `座標の計算が壊れている: ${id}`);
  assert(html.includes('アニメーションを一時停止'), `再生の操作がない: ${id}`);
  assert(html.includes('この図で見ること'), `図の読み方がない: ${id}`);
  for (const m of html.matchAll(/(?:width|height|r)="(-[\d.]+)"/g)) assert(false, `負の寸法: ${id}: ${m[0]}`);
}

// 上級への案内が、実在するステージを指していること
for (const [advancedId, list] of Object.entries(preparationFor)) {
  assert(all.some(s => s.id === advancedId), `案内先の上級ステージがない: ${advancedId}`);
  for (const entry of list) assert(levelStageIds.has(entry.id), `案内元が初級・中級でない: ${entry.id}`);
}

// 計算行の見出しは、実在するスライドと一対一で対応していること
const headings = new Set(all.flatMap(s => s.lesson.steps.map(step => step.heading)));
for (const rule of calculationRules) {
  for (const heading of rule.headings) assert(headings.has(heading), `対応するスライドがない計算行: ${heading}`);
}

// 単位の整合が画面に出ていること（その系列の章がある場合のみ）
const text = levelChapters.flatMap(c => c.stages).flatMap(s => [
  s.lesson.intro, s.lesson.outro, ...s.lesson.steps.flatMap(step => [step.body, step.formulaNote ?? '']),
  chapterFoundations[s.id].example.tex, chapterFoundations[s.id].example.read,
]).join(' ');
const families = new Set(levels.map(c => c.familyId));
if (families.has('umech')) assert(/N·m|\\mathrm\{N\\cdot m\}|N\\cdot m/.test(text), 'N·m = J の単位整合が画面に出ていない');
if (families.has('uem')) assert(/N\/C|\\mathrm\{N\/C\}/.test(text) && /Wb|\\mathrm\{Wb\}/.test(text), 'N/C や Wb の単位整合が画面に出ていない');

console.log(JSON.stringify({
  result: 'PASS',
  levelChapters: levels.length,
  levelStages: stages.length,
  slides: slideCount,
  learningUnits: unitCount,
  figures: figureIds.size,
  problems: problemCount,
  previews: Object.keys(levelPreviews).length,
  advancedStagesUnchanged: advanced.length,
}, null, 2));
