import {existsSync, readFileSync} from 'node:fs';
import Module from 'node:module';
import {build} from 'esbuild';

const problems = JSON.parse(readFileSync('src/content/problem-curriculum.generated.json', 'utf8'));
const youtubeIds = JSON.parse(readFileSync('src/content/problem-youtube-ids.json', 'utf8'));
const result = await build({entryPoints: ['src/content/index.ts'], bundle: true, platform: 'node', format: 'cjs', write: false, logLevel: 'silent'});
const bundled = new Module('/virtual/physics-content.cjs');
bundled.paths = Module._nodeModulePaths(process.cwd());
bundled._compile(result.outputFiles[0].text, '/virtual/physics-content.cjs');
const stageIds = new Set(bundled.exports.chapters.flatMap(chapter => chapter.stages.map(stage => stage.id)));

const assert = (condition, message) => {if (!condition) throw new Error(message);};
assert(problems.length === 160, `Expected 160 problems, got ${problems.length}`);
assert(new Set(problems.map(problem => problem.id)).size === 160, 'Duplicate problem ID');
assert(new Set(problems.map(problem => problem.solutionFilename)).size === 160, 'Duplicate solution filename');
assert(new Set(problems.map(problem => problem.stageId)).size === 114, 'Expected 114 mapped stages');
assert(problems.reduce((sum, problem) => sum + problem.subquestions.length, 0) === 478, 'Expected 478 subquestions');
for (const problem of problems) {
  assert(stageIds.has(problem.stageId), `Unknown stage: ${problem.stageId}`);
  assert(problem.subquestions.length >= 2, `No subquestions: ${problem.id}`);
  for (const subquestion of problem.subquestions) {
    assert(subquestion.choices.length === 4, `Expected four choices: ${problem.id}`);
    assert(Number.isInteger(subquestion.answerIndex) && subquestion.answerIndex >= 0 && subquestion.answerIndex < 4, `Invalid answer: ${problem.id}`);
    assert(existsSync(`public/${subquestion.figure}`), `Missing figure: ${problem.id}`);
  }
  const youtubeId = youtubeIds[problem.solutionFilename];
  assert(!youtubeId || /^[\w-]{11}$/.test(youtubeId), `Invalid YouTube ID: ${problem.solutionFilename}`);
}
assert(new Set(Object.values(youtubeIds)).size === Object.keys(youtubeIds).length, 'Duplicate YouTube video ID');
if (process.argv.includes('--require-videos')) {
  const missing = problems.filter(problem => !youtubeIds[problem.solutionFilename]);
  assert(!missing.length, `${missing.length} solution videos do not have YouTube IDs`);
}
console.log(`Validated ${problems.length} problems, 478 subquestions, 114 stage mappings and all figures; ${Object.keys(youtubeIds).length}/160 video IDs.`);
