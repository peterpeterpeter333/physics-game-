// 深掘りショート（縦長 vert-v1）の台本の機械確認。
// 使い方：node scripts/umech/deep-lint.mjs <台本.mjs> [<番号 01〜05>] [<ナレーション.md>]
//  （番号を省くと ID ys-deep-NN から取る。md を省くと docs/video-revision-20260924/deep/深掘りショート_01-05_光と虹_ナレーション.md）
// 確かめること
//  1. 字幕＝正本の「ナレーション」欄（一字一句）。1行を cue に分けたときは、文の区切り（。？）で分け、つなぐと元の行になること
//  2. 場面の見出し（scene.heading）＝正本の「場面」欄
//  3. 題＝正本の見出しの「…」の中、visualPilot＝'vert-v1'、ID＝ys-deep-NN
//  4. 字幕が 4行以内（frame-vert.mjs と同じ折り返し）、lines を付けたときは各行が 1行の幅以内で、つなぐと字幕と同じ
//  5. 全 cue に kana（アクセント句）、1 cue は 2文まで
//  6. 図のキーが登録されていること
// 問題があれば終了コード 1。
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {captionRows,jw,VCAP,VERT_PILOT} from './frame-vert.mjs';
import {diagrams} from './diagrams.mjs';

const [file,numArg,mdArg]=process.argv.slice(2);
if(!file){console.error('使い方：node scripts/umech/deep-lint.mjs <台本.mjs> [番号] [md]');process.exit(2);}
const md=readFileSync(mdArg??'docs/video-revision-20260924/deep/深掘りショート_01-05_光と虹_ナレーション.md','utf8');
const {clips}=await import(pathToFileURL(path.resolve(file)).href);
let bad=0;const ng=s=>{bad++;console.log('× '+s);};
for(const c of clips){
 const num=numArg??(/ys-deep-(\d+)/.exec(c.id)??[])[1];
 const sec=md.split(/\n## /).find(x=>x.startsWith(num));if(!sec){ng(`正本に「## ${num}」がない`);continue;}
 const title=/「(.+?)」/.exec(sec)[1];
 if(c.title!==title)ng(`題が正本と違う：${c.title} ／ 正本 ${title}`);
 if(c.visualPilot!==VERT_PILOT)ng(`visualPilot が ${VERT_PILOT} でない`);
 if(c.id!==`ys-deep-${num}`)ng(`ID が ys-deep-${num} でない：${c.id}`);
 const rows=sec.split('\n').filter(l=>/^\|\s*\d+\s*\|/.test(l)).map(l=>{const f=l.split('|').map(x=>x.trim());return {n:+f[1],scene:f[2],text:f[3]};});
 const cues=c.scenes.flatMap(s=>s.cues.map(q=>({q,heading:s.heading})));
 let j=0;
 for(const r of rows){
  let acc='',parts=0;
  while(j<cues.length&&acc.length<r.text.length){
   const {q,heading}=cues[j];
   if(heading!==r.scene)ng(`行 ${r.n}：場面「${heading}」≠ 正本「${r.scene}」`);
   if(acc&&!/[。？！]$/.test(acc))ng(`行 ${r.n}：文の途中で cue を分けている「${acc}」|「${q.subtitle}」`);
   acc+=q.subtitle;j++;parts++;
  }
  if(acc!==r.text)ng(`行 ${r.n}：字幕が正本と違う\n   台本：${acc}\n   正本：${r.text}`);
  else if(parts>1)console.log(`・行 ${r.n} を ${parts} cue に分けた`);
 }
 if(j<cues.length)ng(`正本にない cue が ${cues.length-j} 個ある`);
 cues.forEach(({q},i)=>{
  const tag=`cue ${i+1}`;
  if(!q.kana)ng(`${tag}：kana がない`);
  const n=q.subtitle.split('。').filter(Boolean).length;if(n>2)ng(`${tag}：3文以上`);
  if(q.lines){
   if(q.lines.join('')!==q.subtitle)ng(`${tag}：lines をつなぐと字幕と違う`);
   for(const L of q.lines)if(jw(L)>VCAP.max+1e-9)ng(`${tag}：行が長すぎる（${jw(L).toFixed(1)} 字 > ${VCAP.max}）「${L}」`);
  }
  let rowsC;try{rowsC=captionRows(q.subtitle,q);}catch(e){ng(`${tag}：${e.message}`);return;}
  if(rowsC.length>VCAP.lines)ng(`${tag}：字幕が ${rowsC.length} 行（4行まで）：${rowsC.join(' / ')}`);
  if(!diagrams[q.diagram])ng(`${tag}：図 ${q.diagram} が登録されていない`);
 });
 console.log(`${c.id}：正本 ${rows.length} 行 → ${cues.length} cue`);
}
console.log(bad?`問題 ${bad} 件`:'問題なし');
process.exit(bad?1:0);
