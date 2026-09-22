import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { topics, extra } from '../docs/video-scripts/prerequisite-audit.mjs';

const root = new URL('../', import.meta.url);
const read = p => JSON.parse(fs.readFileSync(new URL(p, root), 'utf8'));
const plan = read('docs/video-scripts/plan.generated.json');
const catalog = read('src/content/lesson-video-catalog.generated.json');
const levels = ['intro', 'middle', 'advanced'];
const names = {intro:'初級',middle:'中級',advanced:'上級'};
const sourceFiles = ['high-school-mechanics','high-school-thermal','high-school-waves','high-school-em','high-school-atomic','university-math','university-mechanics','bridges','advanced-followups'];
const sourceTexts = sourceFiles.map(n => [n, fs.readFileSync(new URL(`docs/video-scripts/${n}.mjs`,root),'utf8').split('\n')]);
const used = new Set();
const rows = catalog.map(v => {
  const r = plan.records.find(r => r.id === v.sourceScript);
  if (!r || r.beats.length !== v.scenes.length || r.beats.some((b,i) => b.speech !== v.scenes[i].narration)) throw Error(`Narration mismatch: ${v.id}`);
  const key = extra[v.id] ? v.id : `${v.topicId}:${v.level}`;
  const note = extra[v.id] ?? topics[v.topicId]?.[levels.indexOf(v.level)];
  if (!note || used.has(key)) throw Error(`Missing/duplicate review: ${v.id}`);
  used.add(key);
  const parts = note.split('|');
  if (parts.length !== 3 || parts.some(x=>!x)) throw Error(`Invalid review: ${v.id}`);
  const fileHint = v.id.includes('bridges-') ? 'bridges' : v.id.includes('advanced-followups-') ? 'advanced-followups' : v.family;
  const source = sourceTexts.find(([name])=>name===fileHint);
  return {v,r,tag:parts[0],gap:parts[1],prep:parts[2],source: source ? `${source[0]}.mjs` : `${v.family}.mjs`};
});
const expected = Object.values(topics).reduce((n,a)=>n+a.length,0)+Object.keys(extra).length;
if (used.size !== expected || catalog.length !== 156 || new Set(catalog.map(v=>v.stageId)).size !== 96) throw Error('Audit scope changed; review before regenerating.');
const sha = execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const counts = Object.fromEntries([...new Set(rows.map(r=>r.tag))].map(k=>[k,rows.filter(r=>r.tag===k).length]));
let out = `# 前提知識の欠落・学習順序の監査\n\n対象コミット：\`${sha}\`。監査日：2026-09-23。\n\n## 結論\n\n現状は、高校編を完全初心者が順に学んで理解できる構成とは言えない。定義や数学の操作を学ぶ前に応用へ進む箇所、前提の説明が後にある箇所、元教材の説明が動画化で抜けた箇所がある。難しい内容そのものを削るのではなく、使う前に必要な入口を置く必要がある。\n\n## 対象と確認方法\n\n- 大学電磁気だけを除外。高校電磁気は含む。高校27ステージ・81本、大学数学31ステージ・32本、大学力学38ステージ・43本、計96ステージ・156本。\n- 現行動画カタログの全468場面の台本、音声用文章、数式、動画生成コード・図の実装と、元教材96ステージの見出し構成を照合した。全156本について台本とカタログの音声文が一致することを機械的にも確認した。\n- 全動画を実時間で視聴した検査ではない。音声の聞き取りや全フレームの見え方、実際の初心者による理解度は未検証。元教材も全本文の逐語監査ではない。\n- 下記156件は動画ごとの点検記録であり、独立した欠陥が156個あるという意味ではない。同じ前提不足が複数動画に影響する。新たな利用者テストで追加の不足が見つかる可能性はある。\n- 高校では物理未習を想定する。基本の四則計算は出発点とするが、負数・比・文字式・グラフ・三角比などは、必要な場面で具体例から接続する。大学では既習事項を全て再講義する必要はないが、必要な前提とそこへ戻る経路が要る。\n- 教材・音声・動画の修正、再生成、commit、pushは行っていない。\n\n## 判定の意味\n\n|判定|意味|動画数|\n|---|---|---:|\n`;
const meanings = {'不足':'使うための定義・操作・条件・具体例が不十分。完全な未記載とは限らない。','順序逆転':'必要な説明が後にある、または応用から先に始まる。','先取り':'未準備の概念・数学の操作を前提に先へ進む。','接続不足':'別単元に説明があっても、そこから使える状態へつなぐ説明・案内が弱い。','補強':'基本の説明はあるが、完全初心者には追加の例や対応付けが必要。'};
for(const [k,n] of Object.entries(counts)) out += `|${k}|${meanings[k]}|${n}|\n`;
out += `\n## 全分野に共通する不足\n\n1. **量と単位**：何を測った値か、1秒あたり・1平方メートルあたり、単位の掛け算と割り算、換算を準備する。記号一覧を作るだけでは足りない。\n2. **座標とグラフ**：原点・正方向・横軸と縦軸・点・差・傾き・符号付き面積を、それぞれ数値の表と結ぶ。負の位置と負の速度を区別する。\n3. **文字式**：関数、添字、Δ、比例・反比例、因数分解、平方根、代入と未知数の解き方を使う前に扱う。\n4. **矢印の計算**：位置・移動・速度・力を区別し、ベクトルの和・差・成分・大きさを先に準備する。内積・外積の式を初級の図へ先出ししない。\n5. **三角関数**：直角三角形の辺の比→成分→ラジアン・単位円→位相→加法定理や微分、という前提をつなぐ。\n6. **微積分**：数値の平均→短い区間→極限→記号という順にする。位置の傾きは速度、速度の傾きは加速度という違いを示す。等速直線運動では加速度0。\n7. **和と積分計算**：少数の項を実際に足してからΣ、分割数、添字、極限へ進む。原始関数・積分定数・上下限代入の基本計算も必要。\n8. **指数・対数**：e、ln、指数関数の微分、1/xの積分を未説明の道具にしない。減衰・半減期・微分方程式に影響する。\n9. **物理の出発点**：力・質量・合力→運動、一定力の仕事→運動エネルギー→位置エネルギー→保存条件を先に整える。電荷、圧力、波、原子の構造も同様。\n10. **条件と適用範囲**：空気抵抗なし、系と外力、温度一定、薄いレンズ、微小振動などを結論と一緒に示す。定義・実験法則・そこからの導出は区別する。\n\n## 動画化・表示側の構造的な原因\n\n- \`EMVideoLesson.tsx\`ではカタログのあるステージが動画表示へ進む。元の詳しいスライドにあった前提が自動的に残るわけではない。\n- 台本の\`symbols\`と\`condition\`が存在しても、動画生成側で一律に読み上げ・表示される仕組みではない。記号欄に書いただけでは受講者に説明済みと言えない。\n- 台本の\`visual\`は図への指示であり、その文章どおりの図が自動生成されるわけではない。数式の追加ステップや固定図で、音声より先に概念が出ることもある。\n- 高校の同一単元で初→中→上と進む場合と、全単元の初級から回る場合の両方を支える必要がある。力より先の放物運動、仕事より先の落下のエネルギー計算などは難易度を分けただけでは解決しない。\n- 全156本が3場面構成で、検査にも3場面固定の条件がある。必要な説明の量が異なる単元を同じ型へ押し込むと、入口が抜ける。\n- 現行テストのファイル・リンク・字幕・主語らしさ等の検査は、前提の習得順や説明内容の網羅性を保証しない。\n\n## 修正の順序と合格条件\n\nまず高校の量・単位・グラフ・力・仕事を整え、三角比・ベクトル・波・電荷等へつなぐ。次に大学数学の極限・積分計算・指数対数を整え、大学力学の応用へつなぐ。全動画へ長い共通復習を足すのではなく、前提動画と使う場面の短い確認を組み合わせる。ロック機能は不要。\n\n各動画を修正したら、①初出の量を図と数値で指せる、②記号を自分の言葉で説明できる、③使用する操作を前の動画までに練習している、④簡単な一問を実際に計算できる、⑤条件と結論を区別できる、を確認する。分かる作者だけでなく、物理未習の利用者による確認が必要。\n\n## 全156本の個別点検\n\n各記録の「現行の音声と台本の式」は照合用。式変形用の追加表示は\`scripts/all-film-equations.mjs\`、図は動画生成コードも参照する。下記は単純な全文検索で欠落を断定した一覧ではなく、説明順・具体例・実装を踏まえた点検である。\n`;
let family = '';
for (const [i,a] of rows.entries()) {
  if(a.v.family !== family) { family=a.v.family; out+=`\n### ${a.r.familyTitle || family}\n`; }
  out += `\n#### ${String(i+1).padStart(3,'0')}. ${a.v.stageTitle} — ${names[a.v.level]}\n\n動画：\`${a.v.id}\` ／ ステージ：\`${a.v.stageId}\`<br>\n現在の問い：${a.v.title}<br>\n台本：[${a.source}](./${a.source})\n\n- **判定：${a.tag}**\n- **不足・飛躍：** ${a.gap}\n- **先に必要な説明：** ${a.prep}\n\n<details>\n<summary>現行の音声と台本の式（照合用）</summary>\n\n`;
  for (const s of a.v.scenes) out+=`場面${s.index+1}（${s.start.toFixed(1)}–${s.end.toFixed(1)}秒）：${s.narration}\n\n${s.equation ? `式：${s.equation}\n\n`:''}`;
  out+='</details>\n';
}
out+='\n## 元教材の見出しとの照合用一覧（96ステージ）\n\n見出しが動画からなくなったことだけで欠陥とは判定しない。同じ意味を別の図や音声で教えているか、後の計算の前提として必要かを確認するための一覧。\n\n';
for(const s of plan.sourceStages) out+=`- **${s.title}**（\`${s.id}\`）：${s.headings.join(' ／ ')}\n`;
fs.writeFileSync(new URL('docs/video-scripts/prerequisite-audit.md',root),out);
console.log(JSON.stringify({videos:rows.length,stages:new Set(rows.map(a=>a.v.stageId)).size,scenes:rows.reduce((n,a)=>n+a.v.scenes.length,0),counts,output:'docs/video-scripts/prerequisite-audit.md'},null,2));
