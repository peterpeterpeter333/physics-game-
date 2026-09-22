// Mechanical report assembly. Human findings are in the TSV; no automatic
// language-quality scoring is performed here. Writes Markdown to stdout only.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const movies=JSON.parse(fs.readFileSync(path.join(root,'src/content/em-video-catalog.generated.json'),'utf8'));
const frames=JSON.parse(fs.readFileSync('/private/tmp/physics-video-review/frames.json','utf8'));
const additions=fs.readFileSync(path.join(root,'docs/em-video-frame-findings.tsv'),'utf8').trim().split('\n').slice(1).map(line=>{
  const [id,time,kind,quote,problem]=line.split('\t');
  if(!problem) throw Error(`Malformed finding: ${line}`);
  const movie=movies.find(m=>m.id===id);
  if(!movie || +time<0 || +time>movie.scenes.at(-1).end) throw Error(`Bad timestamp: ${line}`);
  if(kind.startsWith('字幕') && !movie.scenes.some(s=>s.narration.includes(quote))) throw Error(`Unmatched subtitle quote: ${id}: ${quote}`);
  const sample=frames.find(f=>f.id===id).samples.reduce((a,b)=>Math.abs(a.time-time)<Math.abs(b.time-time)?a:b);
  if(+time!==0 && Math.abs(sample.time-time)>1)throw Error(`Observation is not near a reviewed frame: ${line}`);
  return {id,time:+time===0?0:sample.time,kind,quote,problem,source:'画面'};
});
const previous=[];let stage;
for(const line of fs.readFileSync(path.join(root,'docs/em-japanese-review.md'),'utf8').split('\n')){
  if(line.startsWith('## 動画画面')) break;
  const header=line.match(/^### .*`([^`]+)`/);if(header)stage=header[1];
  if(!/^\| \d+ \|/.test(line))continue;
  const [number,kind,quote,problem]=line.split('|').slice(1,-1).map(x=>x.trim());
  const movie=movies.find(m=>m.stageId===stage&&m.scenes.some(s=>s.index===+number-1));
  if(!movie)throw Error(`Missing scene ${stage} ${number}`);
  const scene=movie.scenes.find(s=>s.index===+number-1);
  if(!scene.narration.includes(quote))throw Error(`Unmatched prior quote ${stage}: ${quote}`);
  const caption=scene.captions.find(c=>c.text.includes(quote));
  previous.push({id:movie.id,time:caption?.start??scene.start,end:caption?.end??scene.end,kind,quote,problem,source:'文章'});
}
const samples=frames.reduce((n,m)=>n+m.samples.length,0);
if(movies.length!==100||frames.length!==100||samples!==632)throw Error('Coverage changed: re-review is required.');
if(movies.some(m=>!fs.existsSync(`/private/tmp/physics-video-review/${m.id}/sheet.jpg`)))throw Error('Missing evidence sheet');
const escape=s=>s.replaceAll('|','&#124;').replaceAll('\n',' ');
const sec=n=>`${Math.floor(n/60).toString().padStart(2,'0')}:${(n%60).toFixed(2).padStart(5,'0')}`;
const levels=[['intro','初級'],['middle','中級'],['advanced','上級']];
// Catalog uses beginner/intermediate in some generations. Resolve current
// grouping through stable stage prefixes rather than assuming level strings.
const prefix={intro:'ui-',middle:'um-',advanced:'ue-'};
const out=[
'# 電磁気動画100本：日本語と画面の対応の確認一覧',
'',
'## 結論と確認範囲',
'',
'主語の不足だけではありません。抽象的な言い換え、何を指すか分からない表現、条件の省略、量の名前の混同、そして説明中に図や式が別の内容へ切り替わる問題が、初級・中級・上級に残っています。難しい計算を削ることより、説明対象を一つに特定できるようにする修正が必要です。',
'',
'対象はローカルのPhysics Quest、HEAD `7b067b9` にある大学電磁気の40単元・MP4 100本です。App Store配信物そのものを確認したものではありません。',
'',
`実際のMP4から、315場面・632発話のそれぞれの中央時点を画像化し、100本分の632画面を目視しました。動画の全時間を連続再生して見たのではなく、音声も聴取していません。従って「全動画を音声込みで視聴した」監査ではありません。発音・音声の聞き取りやすさ・確認時点の間だけに出る表示は未確認です。`,
'',
`以下は、以前の台本レビューの${previous.length}件と、今回の画面確認で記録した${additions.length}件、合計${previous.length+additions.length}行の指摘記録です。同じ文章への別観点の指摘や同じ原因の再発箇所を含み、独立した欠陥がその件数あるという意味ではありません。今回は見つけた記録を省略せず掲載しましたが、取りこぼしがないことを保証するものではありません。`,
'',
'想定する学生は「物理・数学に苦手意識があり、専門用語から対象をすぐ想像できない大学1年生」です。実際の学生テストではなく、この学習経験を想定した編集レビューです。偏差値から個人の理解力を断定していません。',
'',
'## 表の読み方',
'',
'- **文章**：以前抽出した字幕・台本の表現上の負荷。今回確認した画面で補える場合もあり、全件が文法の誤りという意味ではありません。時刻は該当字幕の表示区間です。',
'- **画面**：実際のMP4の確認時点で見つけた図中の日本語、見出し、字幕と図・式の食い違い。時刻は確認フレームの秒数です（見出しの0秒は動画全体の見出しを指します）。',
'- **表示不具合**：日本語の誤りとは別分類。式を指す説明が成立しなくなるため、関連箇所として含めました。',
'- 「原文抜粋」は全文ではありません。画面内の改行は詰めています。修正方向は検討用の短いメモで、完成台本ではありません。',
'- MP4リンクはローカル原本。確認画像リンクは一時フォルダのコンタクトシートで、削除されると開けなくなります。再抽出は `scripts/review-em-video-frames.py` で可能です。',
'',
'## 優先して直す共通問題',
'',
'1. **指している式が画面にない。** 「その微分」「この値」「両端の差」などを説明している間は、対象の式と比較する値を残す。',
'2. **図が別の現象を示す。** 放電の説明には充電の図を使わない。円形コイルには直線導線、小長方形には円の図を当てない。',
'3. **途中と全体の結果が同じ名前。** 「ここまでの仕事」と「終点までの仕事」を明示し、固定した左辺と途中の右辺を等号でつながない。',
'4. **比喩が定義にすり替わる。** 「効く」「寄与を稼ぐ」「仕事の短冊」「宿る」だけで説明せず、何の量・何の操作かを短く添える。',
'5. **省略が誤解を生む。** 「外部電荷は効かない」ではなく「閉曲面全体の電気束への寄与が0」と、成り立つ範囲を省略しない。',
'',
'## 全100本の確認記録',
'',
'| 動画 | 水準 | 確認画面数 | 文章の記録 | 画面の記録 |',
'|---|---|---:|---:|---:|'
];
for(const [level,label] of levels){for(const m of movies.filter(m=>m.id.startsWith(prefix[level]))){
 out.push(`| ${m.id} | ${label} | ${frames.find(f=>f.id===m.id).samples.length} | ${previous.filter(r=>r.id===m.id).length} | ${additions.filter(r=>r.id===m.id).length} |`);
}}
out.push('','## 動画ごとの全指摘','');
let count=0;
for(const [level,label] of levels){
 out.push(`### ${label}`,'');
 for(const m of movies.filter(m=>m.id.startsWith(prefix[level]))){
  out.push(`#### ${m.id} — ${m.stageTitle}`,'',`動画の見出し：${m.title}`,'',`[MP4原本](${root}/public/media/em/${m.id}.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/${m.id}/sheet.jpg)`,'','| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |','|---:|---|---|---|---|');
  const rows=[...previous,...additions].filter(r=>r.id===m.id).sort((a,b)=>a.time-b.time);
  for(const r of rows){count++;out.push(`| ${count} | ${sec(r.time)}${r.end!==undefined?`–${sec(r.end)}`:''} | ${r.source}：${r.kind} | ${escape(r.quote)} | ${escape(r.problem)} |`);}
  if(!rows.length)out.push('| — | — | 確認済み | 今回の確認方法では追加指摘なし | 全時間・音声まで問題なしと保証するものではありません。 |');
  out.push('');
 }
}
out.push('## 実施しなかったこと','','教材の日本語修正、動画の再生成、アプリの変更、commit・pushは行っていません。以前の報告のアプリUI自動補足4件は、今回の動画100本の件数には含めていません。','');
process.stdout.write(out.join('\n'));
