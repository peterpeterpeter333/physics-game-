// 問題編の台本（qx-<id>.mjs）を、正本の台本（制作用台本_最終）と照合する。build の前に必ず実行する。
// 使い方：node scripts/umech/qx-lint.mjs docs/video-revision-20260924/ytseries/qx-<id>.mjs
// 調べること
//  1. 字幕：解説動画の表の各行（番号順）のナレーションと一致するか。1行を連続する2〜3 cue に分けてもよい（つなげて一致すればよい）。
//     行の頭の「（追加）」は制作上の印なので除いて比べる。字幕を変えたときは、cue に textChange:'理由' を書く（報告に出る）。
//  2. 字幕の折り返し：44字で3行以内。行の境目で数・単位・式（半角の英数字や記号の並び）が割れないか。
//  3. 全 cue に kana があるか。1 cue は2文まで。
//  4. 問題アニメの一覧（problemClips）があり、名前が「出題」「小問n」か。
// 正本のフォルダは QX_SOURCE で変えられる（既定 ~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08）。
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';
import {qxInfo} from './qx-name.mjs';

const file=process.argv[2];if(!file)throw Error('使い方：node scripts/umech/qx-lint.mjs <qx-*.mjs>');
const SRC=process.env.QX_SOURCE??path.join(os.homedir(),'Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08');
const mod=await import(pathToFileURL(path.resolve(file)).href);
const clip=mod.clips[0];const qid='q-'+clip.id.replace(/^ys-qx-/,'');
let bad=0;const err=s=>{bad++;console.log('× '+s);};

// ---- 正本から該当の問題を探す（qx-name.mjs と同じ規則）----
const info=qxInfo(qid);
const whole=readFileSync(info.source,'utf8'),at=whole.indexOf(`## ${qid}「`),rest=whole.slice(at+3),cut=rest.search(/\n## q-/);
const md=cut<0?rest:rest.slice(0,cut),mdFile=path.relative(SRC,info.source);
if(clip.id!==info.id)err(`clips[0].id は ${info.id} にする（いまは ${clip.id}）`);
console.log(`出力名の頭：${info.head}`);
const rows=[];const tbl=md.slice(md.indexOf('### 解説動画'));
for(const raw of tbl.split('\n')){const line=raw.replace(/\\\|/g,'\u0001');const m=line.match(/^\|\s*(\d+)\s*\|\s*(.*?)\s*\|\s*(.*)\|\s*$/);if(m)rows.push({n:+m[1],text:m[2].replace(/^（追加）\s*/,'').replace(/\u0001/g,'|').trim(),instr:m[3].replace(/\u0001/g,'|')});}
console.log(`正本：${mdFile} の ${qid}（解説動画 ${rows.length} 行）`);

// ---- 1. 字幕の照合 ----
const cues=clip.scenes.flatMap(s=>s.cues);
const norm=s=>s.replace(/\s+/g,' ').trim();
let ci=0;const changes=[];
for(const r of rows){
 let acc='',start=ci;
 while(ci<cues.length&&norm(acc).length<norm(r.text).length){acc+=cues[ci].subtitle;ci++;if(norm(acc)===norm(r.text))break;}
 const used=cues.slice(start,ci);
 if(norm(acc)!==norm(r.text)){
  // 変えた字幕が正本の行より短いと、次の行の cue まで取り込んでしまう。行の頭の cue に textChange があれば、その cue と、
  // 続く textCont:true の cue（同じ行を文の区切りで分けた続き）までを、この行の cue とする（2026-10-16 追記）。
  if(cues[start]?.textChange){let k=start+1;while(k<cues.length&&cues[k].textCont)k++;ci=k;acc=cues.slice(start,ci).map(c=>c.subtitle).join('');changes.push(`行${r.n}：「${r.text}」→「${acc}」（${cues.slice(start,ci).map(c=>c.textChange).filter(Boolean).join('／')}）`);continue;}
  if(used.some(c=>c.textChange)){changes.push(`行${r.n}：「${r.text}」→「${acc}」（${used.map(c=>c.textChange).filter(Boolean).join('／')}）`);continue;}
  err(`行${r.n} の字幕が正本と違う\n   正本：${r.text}\n   台本：${acc}`);
  // 次の行の頭に合わせて立て直す
  const nx=rows[rows.indexOf(r)+1];if(nx){const k=cues.findIndex((c,j)=>j>=start&&nx.text.startsWith(c.subtitle.slice(0,8)));if(k>=0)ci=k;}
 }
}
if(ci<cues.length)err(`正本の行より cue が多い（余り ${cues.length-ci} cue：「${cues[ci].subtitle.slice(0,20)}…」）`);
console.log(`${bad?'△':'○'} 字幕と正本：${rows.length} 行 ↔ ${cues.length} cue`);
for(const c of changes)console.log('  変更の記録 '+c);

// ---- 2. 折り返し（frame.mjs と同じ規則）----
function wrap(s,max){const out=[];let row='',w=0;for(const ch of s){const cw=/[ -~]/.test(ch)?.55:1;if(w+cw>max&&!/[。、）」？！]/.test(ch)){out.push(row);row='';w=0;}row+=ch;w+=cw;}if(row)out.push(row);return out;}
const tight=/[0-9A-Za-z.,\/^′'²³√π×÷±＝=−\-+＋≈≪<>()（）|θωλ]/;
cues.forEach((c,i)=>{
 const r=wrap(c.subtitle,44);if(r.length>3)err(`cue ${i+1}：字幕が4行以上`);
 for(let k=1;k<r.length;k++){const a=r[k-1].at(-1),b=r[k][0];if(tight.test(a)&&tight.test(b)&&a!==' '&&b!==' ')err(`cue ${i+1}：折り返しで「${r[k-1].slice(-6)}｜${r[k].slice(0,6)}」と割れる`);}
 // ---- 3 ----
 if(!c.kana)err(`cue ${i+1}：kana がない`);
 if(c.subtitle.split('。').filter(Boolean).length>2)err(`cue ${i+1}：3文以上`);
});
// ---- 4 ----
const pc=mod.problemClips;
if(!Array.isArray(pc)||!pc.length)err('problemClips（問題アニメの一覧）がない');
else for(const p of pc){if(!/^(出題|小問\d+)$/.test(p.name))err(`problemClips の名前「${p.name}」`);if(!(p.hold>=1))err(`problemClips ${p.name}：hold は 1 秒以上`);}
console.log(bad?`問題 ${bad} 件`:'問題なし');
process.exit(bad?1:0);
