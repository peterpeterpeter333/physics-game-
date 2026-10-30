// 「机の上」の掛け合いの台本（技術の疑問の鎖 1-1 第4版〜、scene に deskFrame）の機械確認。
// chain-dlg-lint.mjs（変えていない）の決まりのうち、字幕の形（4行まで・1行18字）だけを、この画面の形（区切りごとに2行まで・1行12字前後）に替えた。
// 使い方：node scripts/umech/chain-desk-lint.mjs <台本.mjs> <ID> <ナレーション.md>   （EM_FILM_CACHE があれば、区切りの時刻も確かめる）
// 確かめること
//  1. 字幕＝正本のナレーション欄（一字一句）。cue に分けたのは文の区切りで、3文以上の行だけ
//  2. 場面＝正本の「場面」、話す人＝正本の「話す人」、題・ID・visualPilot・deskFrame
//  3. 字幕の区切り cap：つなぐと字幕と同じ。区切りは2行まで、1行は 13字幅まで（全角1・半角0.55）。区切りの境目は語の途中でない（reading の「|」と数が同じ）
//  4. kana・2文まで
//  5. （音声の後）区切りの時刻が声の時刻から求まること、区切りの表示の長さ（0.5〜2秒の外にあるものを数える）
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {VERT_PILOT} from './frame-vert.mjs';
import {chunkTimes,jw} from './desk-frame.mjs';

const [file,idArg,mdArg]=process.argv.slice(2);
if(!file||!idArg||!mdArg){console.error('使い方：node scripts/umech/chain-desk-lint.mjs <台本.mjs> <ID> <md>');process.exit(2);}
const md=readFileSync(mdArg,'utf8');
const {clips}=await import(pathToFileURL(path.resolve(file)).href);
let bad=0;const ng=s=>{bad++;console.log('× '+s);};
const WHO={'カイ':'kai','ミオ':'mio'};
const sentences=s=>s.split(/(?<=[。？！])/).map(x=>x.trim()).filter(Boolean).length;
const MAXW=13;
for(const c of clips){
 const title=/^# .*?「(.+?)」/m.exec(md)[1];
 if(c.title!==title)ng(`題が正本と違う：${c.title} ／ 正本 ${title}`);
 if(c.visualPilot!==VERT_PILOT)ng(`visualPilot が ${VERT_PILOT} でない`);
 if(c.id!==idArg)ng(`ID が ${idArg} でない：${c.id}`);
 if(!c.scenes.every(s=>s.deskFrame))ng('deskFrame の無い場面がある');
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
  else if(parts>1){const n=sentences(r.text);if(n<=2)ng(`行 ${r.n}：2文以下なのに ${parts} cue に分けた`);else console.log(`・行 ${r.n} を ${parts} cue に分けた（${n}文）`);}
 }
 if(j<cues.length)ng(`正本にない cue が ${cues.length-j} 個ある`);
 let chunks=0,maxw=0;
 cues.forEach(({q},i)=>{
  const tag=`cue ${i+1}`;
  if(!q.kana)ng(`${tag}：kana がない`);
  if(sentences(q.subtitle)>2)ng(`${tag}：3文以上`);
  if(!q.cap)return ng(`${tag}：cap がない`);
  if(q.cap.flat().join('')!==q.subtitle)ng(`${tag}：cap をつなぐと字幕と違う`);
  if(q.capReading?.length!==q.cap.length)ng(`${tag}：capReading の数が cap と違う`);
  if(q.capReading&&q.capReading.join('')!==q.reading)ng(`${tag}：capReading をつなぐと reading と違う`);
  q.cap.forEach((rows,k)=>{chunks++;if(rows.length>2)ng(`${tag}：区切り ${k+1} が ${rows.length} 行`);
   rows.forEach(r=>{maxw=Math.max(maxw,jw(r));if(jw(r)>MAXW)ng(`${tag}：「${r}」が ${jw(r).toFixed(1)} 字幅（${MAXW} まで）`);});});
 });
 console.log(`${c.id}：正本 ${rows.length} 行 → ${cues.length} cue、字幕の区切り ${chunks}、1行の最大 ${maxw.toFixed(1)} 字幅`);
 // 音声の後：区切りの時刻
 const cache=process.env.EM_FILM_CACHE,tf=cache&&`${cache}/${c.id}.json`;
 if(tf&&existsSync(tf)&&existsSync(`${cache}/phrase-times.json`)){
  const timed=JSON.parse(readFileSync(tf,'utf8'));const durs=[];let inexact=0;
  timed.scenes.forEach(s=>s.cues.forEach((q,k)=>{const cap=s.captions[k];const {starts,exact}=chunkTimes(q,cap);if(!exact){inexact++;ng(`区切りの時刻が声と1文字ずつ合わない：${q.subtitle}`);}
   starts.forEach((a,i)=>durs.push(+((i+1<starts.length?starts[i+1]:cap.end)-a).toFixed(2)));}));
  durs.sort((a,b)=>a-b);const med=durs[Math.floor(durs.length/2)];
  const lo=durs.filter(d=>d<.5).length,hi=durs.filter(d=>d>2).length;
  console.log(`字幕の区切りの表示：${durs.length} 個、中央値 ${med} 秒、最短 ${durs[0]}、最長 ${durs.at(-1)}、0.5秒未満 ${lo}、2秒超 ${hi}（2秒超は 声の後の間を含む）`);
 }
}
console.log(bad?`問題 ${bad} 件`:'問題なし');
process.exit(bad?1:0);
