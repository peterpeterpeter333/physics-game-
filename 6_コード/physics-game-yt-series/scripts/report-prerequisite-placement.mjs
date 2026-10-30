import {readFileSync,writeFileSync,statSync} from 'node:fs';
import {topics,extra} from '../docs/video-scripts/prerequisite-audit.mjs';
const read=p=>JSON.parse(readFileSync(p));
const added=read('src/content/prerequisite-video-catalog.generated.json'),original=read('src/content/lesson-video-catalog.generated.json');
const names={intro:'初級',middle:'中級',advanced:'上級'};
let out='# 前提動画の追加・配置一覧\n\n';
out+=`大学電磁気を除く96ステージ・既存156本に、${added.length}本の共通前提動画を組み込む。高校電磁気は対象。大学電磁気100本とバトル内容は変更しない。\n\n`;
out+='## 実装方針\n\n- 既存動画は削除・再生成せず、同じ難易度の再生リスト内で、その動画を使う前に前提動画を挿入する。\n- 同じリストに同じ前提動画が複数回現れないようにする。他の章でも必要な共通動画は、同じ動画ファイルを参照する。\n- 前提どうしも依存順に並べる。難易度の選択・点による移動・バトルへの移動は自由で、視聴を強制しない。\n- 前提動画の中には基礎を振り返るものも含む。上級の一覧から開いても、使う前の数学へ戻れる。動画内の難易度表示はその前提動画自身の難易度。\n- 以前の数値の再生位置で新しい入口を飛ばさないよう、対象分野だけ再生位置の保存キーを更新。大学電磁気のキーは保持。\n- UIは動画・短い補足・移動・バトルボタンのまま。説明パネルや鍵を追加しない。\n\n';
const bytes=added.reduce((n,p)=>n+statSync(`public/media/lessons/${p.id}.mp4`).size,0);
out+=`## 追加メディア\n\n${added.length}本・${added.reduce((n,p)=>n+p.scenes.length,0)}場面、合計${(added.reduce((n,p)=>n+p.duration,0)/60).toFixed(1)}分。MP4合計${(bytes/2**20).toFixed(1)} MiB（ポスターとJSONを除く）。音声は既存と同じVOICEVOX Nemo 男声1、動画内にクレジットを表示。\n\n`;
out+='## 確認範囲と限界\n\n構造テストは、全156本への挿入、前提の順序、重複除去、既存動画の保持、大学電磁気の不変、字幕と音声用台本の一致、動画ファイルとタイムラインを検査する。動画の全フレームデコードは別のメディア検査で行う。描画プリフライトは全場面に実施する。\n\nこれは点検一覧への実装対応表であり、初心者全員が全項目を理解できたという証明ではない。実学習者の理解度テスト・全音声の人間による通し聴取・iPhone実機の確認は未実施。既存動画自体の誤記・音声修正や、全分野の3D化は今回の変更ではない。\n\n';
out+='## 追加した動画\n\n|動画|内容|難易度|長さ|\n|---|---|---|---:|\n';
for(const p of added)out+=`|[${p.id}](../../public/media/lessons/${p.id}.mp4)|${p.title}|${names[p.level]}|${p.duration.toFixed(1)}秒|\n`;
out+='\n## 点検一覧との対応（既存156本）\n\n「追加する説明」は前回の点検時点の記録。以下の順で前提動画を表示し、その後で既存動画へ進む。共通事項を複数箇所へ再掲するので、動画数と指摘数は一致しない。\n';
for(const [i,v] of original.entries()){
 const note=extra[v.id]??topics[v.topicId]?.[['intro','middle','advanced'].indexOf(v.level)];
 const pre=added.filter(p=>p.before.includes(v.id));
 if(!note||!pre.length)throw Error(`Unmapped audit ${v.id}`);
 out+=`\n### ${i+1}. ${v.stageTitle}・${names[v.level]}\n\n既存：\`${v.id}\` — ${v.title}\n\n追加する説明：${note.split('|')[2]}\n\n${pre.map((p,i)=>`${i+1}. ${p.title}（\`${p.id}\`）`).join('\n')}\n${pre.length+1}. 既存動画：${v.title}\n`;
}
writeFileSync('docs/video-scripts/prerequisite-placement.md',out);
console.log(`Wrote ${original.length} audit-to-playlist mappings`);
