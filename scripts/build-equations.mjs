import { build } from 'esbuild';
import Module from 'node:module';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

const bundle = await build({stdin:{contents:`export {chapterFoundations} from './src/content/chapter-foundations'; export {chapters} from './src/content'; export {getCalculation,calculationRules} from './src/content/calculations'; export {spiralLessons} from './src/content/em-spiral'; export {integralEquationGuides} from './src/content/em-equation-guides';`,resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs'});
const mod = new Module(`${process.cwd()}/.equations-build.cjs`);
mod._compile(bundle.outputFiles[0].text,mod.id);
const {chapterFoundations,chapters,getCalculation,calculationRules,spiralLessons,integralEquationGuides} = mod.exports;
const steps = chapters.flatMap(c => c.stages.flatMap(s => s.lesson.steps));
const headings = new Set(steps.map(s => s.heading));
const usedHeadings = new Set();
for (const rule of calculationRules) for (const heading of rule.headings) {
  if (!headings.has(heading)) throw new Error(`Unmatched calculation heading: ${heading}`);
  if (usedHeadings.has(heading)) throw new Error(`Duplicate calculation heading: ${heading}`);
  usedHeadings.add(heading);
}
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const document = mathjax.document('',{InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})});
const output = {};
mkdirSync('public/generated-equations', {recursive:true});
writeFileSync('public/generated-equations/LICENSE.txt', 'MathJax SVG font outlines: Copyright (c) 2017-2022 The MathJax Consortium.\nGenerated typesetting of Physics Quest equations.\n\n'+readFileSync('node_modules/mathjax-full/LICENSE','utf8'));
const lines=steps.flatMap(step=>[...(getCalculation(step)?.lines??[]),...(step.formula?[{tex:step.formula,note:'既存の公式'}]:[])]);
lines.push(...Object.values(spiralLessons).flatMap(cycles=>cycles.flatMap(c=>c.cards.filter(s=>s.tex).map(s=>({tex:s.tex,note:s.title})))));
lines.push(...Object.values(integralEquationGuides).flatMap(guides=>guides.flatMap(guide=>guide.steps)));
lines.push(...Object.values(chapterFoundations).map(f=>({tex:f.example.tex,note:f.example.read})));
// Keep this previously published equation available to already-open lesson tabs.
lines.push({tex:String.raw`dA=R^2\sin\theta\,d\theta\,d\varphi`,note:'旧版の球面積スライドとの互換性'});
for (const line of lines) {
  if (!line.tex || !line.note) throw new Error(`Empty equation: ${line.note}`);
  if (output[line.tex]) continue;
  const node = document.convert(line.tex,{display:true,em:20,ex:10,containerWidth:700});
  const outer = adaptor.outerHTML(node);
  if (outer.includes('data-mjx-error') || outer.includes('merror')) throw new Error(`Invalid TeX: ${line.tex}\n${outer}`);
  let svg = outer.slice(outer.indexOf('<svg'),outer.lastIndexOf('</svg>')+6);
  // Standalone SVG with glyph paths, no font downloads, no foreignObject.
  svg = svg.replace(/currentColor/g,'#eef1ff');
  const width = Number(svg.match(/width="([\d.]+)ex"/)?.[1]);
  const height = Number(svg.match(/height="([\d.]+)ex"/)?.[1]);
  if (!width || !height) throw new Error(`Missing SVG dimensions: ${line.tex}`);
  const name = createHash('sha256').update(svg).digest('hex').slice(0,20);
  const src = `generated-equations/${name}.svg`;
  writeFileSync(`public/${src}`,svg);
  output[line.tex] = {src,width:Math.ceil(width*9),height:Math.ceil(height*9)};
}
writeFileSync('src/content/calculations/equations.generated.json',JSON.stringify(output));
console.log(`Generated ${Object.keys(output).length} standalone equation SVGs; ${usedHeadings.size} authored step-by-step slides.`);
