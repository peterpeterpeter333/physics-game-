// 技術の疑問の鎖の「掛け合い」の台本（cue に speaker がある縦長）の機械確認。chain-lint.mjs と同じ確かめ方に、話す人の欄と、
// 掛け合いの字幕（1行目が名前の分だけ短い、vert-dialogue.mjs）を足したもの。chain-lint.mjs は変えていない。
// 使い方：node scripts/umech/chain-dlg-lint.mjs <台本.mjs> <ID> <ナレーション.md>
//  正本の表は「| 番号 | 場面 | 話す人 | ナレーション | 画面 |」。題は 1行目の見出しの「…」。
// 確かめること
//  1. 字幕＝正本のナレーション欄（一字一句）。cue に分けたときは文の区切り（。？！）で分け、つなぐと元の行になること
//  2. 分けた行は、本当に分ける必要があったか（3文以上、または つなぐと 4行に収まらない）。必要がなければ ×
//  3. 場面＝正本の「場面」、話す人＝正本の「話す人」（カイ→kai、ミオ→mio）
//  4. 題・visualPilot・ID
//  5. 掛け合いの字幕が 4行以内（1行目は 名前の分 短い）、lines の各行の幅
//  6. 全 cue に kana、1 cue は 2文まで、図のキーが登録されていること
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {wrapJa,jw,VCAP,VERT_PILOT} from './frame-vert.mjs';
import {dialogueRows,rowMax,SPEAKERS} from './vert-dialogue.mjs';
import {diagrams} from './diagrams.mjs';

const [file,idArg,mdArg]=process.argv.slice(2);
if(!file||!idArg||!mdArg){console.error('使い方：node scripts/umech/chain-dlg-lint.mjs <台本.mjs> <ID> <md>');process.exit(2);}
const md=readFileSync(mdArg,'utf8');
const {clips}=await import(pathToFileURL(path.resolve(file)).href);
let bad=0;const ng=s=>{bad++;console.log('× '+s);};
const WHO={'カイ':'kai','ミオ':'mio'};
const sentences=s=>s.split(/(?<=[。？！])/).map(x=>x.trim()).filter(Boolean).length;
const rowsOf=(text,q={})=>dialogueRows(text,q,{wrapJa,jw,max:VCAP.max});
for(const c of clips){
 const title=/^# .*?「(.+?)」/m.exec(md)[1];
 if(c.title!==title)ng(`題が正本と違う：${c.title} ／ 正本 ${title}`);
 if(c.visualPilot!==VERT_PILOT)ng(`visualPilot が ${VERT_PILOT} でない`);
 if(c.id!==idArg)ng(`ID が ${idArg} でない：${c.id}`);
 const rows=md.split('\n').filter(l=>/^\|\s*\d+\s*\|/.test(l)).map(l=>{const f=l.split('|').map(x=>x.trim());return {n:+f[1],scene:f[2],who:f[3],text:f[4]};});
 const cues=c.scenes.flatMap(s=>s.cues.map(q=>({q,heading:s.heading})));
 let j=0;
 for(const r of rows){
  let acc='',parts=0;
  while(j<cues.length&&acc.length<r.text.length){
   const {q,heading}=cues[j];
   if(heading!==r.scene)ng(`行 ${r.n}：場面「${heading}」≠ 正本「${r.scene}」`);
   if(q.speaker!==WHO[r.who])ng(`行 ${r.n}：話す人 ${q.speaker} ≠ 正本「${r.who}」`);
   if(acc&&!/[。？！]$/.test(acc))ng(`行 ${r.n}：文の途中で cue を分けている「${acc}」|「${q.subtitle}」`);
   acc+=q.subtitle;j++;parts++;
  }
  if(acc!==r.text)ng(`行 ${r.n}：字幕が正本と違う\n   台本：${acc}\n   正本：${r.text}`);
  else if(parts>1){
   const n=sentences(r.text),L=rowsOf(r.text).length;
   if(n<=2&&L<=VCAP.lines)ng(`行 ${r.n}：分けなくても収まる（${n}文・${L}行）のに ${parts} cue に分けた`);
   else console.log(`・行 ${r.n} を ${parts} cue に分けた（${n}文・まとめると ${L}行）`);
  }else{const L=rowsOf(r.text).length;if(L>VCAP.lines)ng(`行 ${r.n}：4行に収まらない（${L}行）`);}
 }
 if(j<cues.length)ng(`正本にない cue が ${cues.length-j} 個ある`);
 cues.forEach(({q},i)=>{
  const tag=`cue ${i+1}`;
  if(!SPEAKERS[q.speaker])ng(`${tag}：speaker がない`);
  if(!q.kana)ng(`${tag}：kana がない`);
  if(sentences(q.subtitle)>2)ng(`${tag}：3文以上`);
  let rs;try{rs=rowsOf(q.subtitle,q);}catch(e){ng(`${tag}：${e.message}`);return;}
  rs.forEach((L,k)=>{if(jw(L)>rowMax(k,VCAP.max)+1e-9)ng(`${tag}：${k+1}行目が長すぎる（${jw(L).toFixed(1)} 字 > ${rowMax(k,VCAP.max).toFixed(1)}）「${L}」`);});
  if(rs.length>VCAP.lines)ng(`${tag}：字幕が ${rs.length} 行（4行まで）：${rs.join(' / ')}`);
  if(!diagrams[q.diagram])ng(`${tag}：図 ${q.diagram} が登録されていない`);
 });
 console.log(`${c.id}：正本 ${rows.length} 行 → ${cues.length} cue`);
}
console.log(bad?`問題 ${bad} 件`:'問題なし');
process.exit(bad?1:0);
