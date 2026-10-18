import {copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {basename, join} from 'node:path';

// One-time, deterministic import of the final scripts and the small question figures.
// Usage: node scripts/import-problem-curriculum.mjs FINAL_SCRIPT_DIR EXTRACTED_ZIP_DIR
const [scriptsRoot, mediaRoot] = process.argv.slice(2);
if (!scriptsRoot || !mediaRoot) throw new Error('Supply final script and extracted ZIP directories');
const outputDir = 'public/media/problem-figures';
mkdirSync(outputDir, {recursive: true});
const curriculumSource = readFileSync('src/content/university-curriculum.ts', 'utf8');
const universityTopics = [...curriculumSource.matchAll(/\{id:'([^']+)',family:'[^']+',intro:p\('([^']+)'[^\n]*middle:p\('([^']+)'/g)]
  .map(([, advanced, intro, middle]) => [intro, middle, advanced]);
if (universityTopics.length !== 29) throw new Error(`Expected 29 university topics, got ${universityTopics.length}`);

const result = [];
for (const school of ['高校編', '大学編']) {
  const dir = join(scriptsRoot, school);
  for (const [unitIndex, filename] of readdirSync(dir).filter(name => name.endsWith('.md')).sort().entries()) {
    const content = readFileSync(join(dir, filename), 'utf8');
    const unitName = basename(filename, '.md');
    const blocks = [...content.matchAll(/^## (q-[^\s「]+)「([^」]+)」\s*\n([\s\S]*?)(?=^## q-|(?![\s\S]))/gm)];
    if (!blocks.length) throw new Error(`No exercises found in ${filename}`);
    for (const [ordinal, match] of blocks.entries()) {
      const [, id, title, body] = match;
      const stageId = school === '高校編'
        ? id.slice('q-hs-'.length).replace(/-\d+$/, '')
        : universityTopics[unitIndex][ordinal];
      const mediaStem = school === '高校編'
        ? `高校_${unitName}_${ordinal + 1}`
        : `大学_${unitName}_${['初級', '中級', '上級'][ordinal]}`;
      if (mediaStem.endsWith('undefined')) throw new Error(`Too many difficulty levels in ${filename}`);
      const context = body.match(/^#### 問題文\s*\n([\s\S]*?)(?=^#### 小問\d+)/m)?.[1].trim();
      if (!context) throw new Error(`Missing problem statement: ${id}`);
      const subquestions = [...body.matchAll(/^#### 小問(\d+)[^\n]*\n([\s\S]*?)(?=^#### 小問\d+|^### 解説動画|^### 検算|$(?![\s\S]))/gm)].map(([, number, section]) => {
        const prompt = section.match(/^問い：([^\n]+)/m)?.[1].trim();
        const choices = [...section.matchAll(/^- ([ABCD]) (.+)$/gm)].map(([, letter, text]) => ({letter, text: text.trim()}));
        const answer = section.match(/^正解：([ABCD])/m)?.[1];
        if (!prompt || choices.length !== 4 || !answer || choices.map(choice => choice.letter).join('') !== 'ABCD') {
          throw new Error(`Malformed subquestion ${number} in ${id}`);
        }
        const candidate = `${mediaStem}_小問${number}.png`;
        const imageName = existsSync(join(mediaRoot, school, '問題アニメ', candidate)) ? candidate : `${mediaStem}_出題.png`;
        const sourceImage = join(mediaRoot, school, '問題アニメ', imageName);
        if (!existsSync(sourceImage)) throw new Error(`Missing figure ${sourceImage}`);
        const publicName = `${id}-${imageName.endsWith('_出題.png') ? 'base' : `s${number}`}.png`;
        const publicPath = join(outputDir, publicName);
        copyFileSync(sourceImage, publicPath);
        return {number: Number(number), prompt, choices: choices.map(choice => choice.text), answerIndex: 'ABCD'.indexOf(answer), figure: `media/problem-figures/${publicName}`};
      });
      const headingCount = [...body.matchAll(/^#### 小問\d+/gm)].length;
      if (headingCount !== subquestions.length) throw new Error(`Parsed ${subquestions.length}/${headingCount} subquestions in ${id}`);
      if (!subquestions.length) throw new Error(`Missing subquestions: ${id}`);
      const solutionFilename = `${mediaStem}_解説.mp4`;
      if (!existsSync(join(mediaRoot, school, '解説動画', solutionFilename))) throw new Error(`Missing solution ${solutionFilename}`);
      result.push({id, stageId, title, context, subquestions, solutionFilename, solutionYoutubeId: null});
    }
  }
}
const totalSubquestions = result.reduce((sum, item) => sum + item.subquestions.length, 0);
if (result.length !== 160 || totalSubquestions !== 478) throw new Error(`Expected 160/478, got ${result.length}/${totalSubquestions}`);
const stages = new Set(result.map(item => item.stageId));
if (stages.size !== 114) throw new Error(`Expected 114 stage IDs (27 high-school units and 87 university levels), got ${stages.size}`);
writeFileSync('src/content/problem-curriculum.generated.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(`Imported ${result.length} exercises, ${totalSubquestions} subquestions, ${stages.size} stages`);
