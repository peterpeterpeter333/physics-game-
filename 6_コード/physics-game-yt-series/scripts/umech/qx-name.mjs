// 問題 ID から、正本の場所・ID・ファイル名・出力名を出す（問題編の全担当が使う。手で名前を作らない）。
// 使い方：node scripts/umech/qx-name.mjs q-hs-w-doppler-1     （q- は省いてもよい）
// 出力名の頭：高校 → 高校_<動画番号>_<単元>_<n>（n は ID の末尾の数）
//             大学 → 大学_<NN>_<単元>_<初級|中級|上級>（単元ファイルの中の 1問目＝初級・2問目＝中級・3問目＝上級）
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';

export const QX_SOURCE=process.env.QX_SOURCE??path.join(os.homedir(),'Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08');
export function qxInfo(id){
 const qid=id.startsWith('q-')?id:'q-'+id.replace(/^ys-qx-/,'');
 for(const dir of ['高校編','大学編'])for(const f of readdirSync(path.join(QX_SOURCE,dir)).filter(f=>f.endsWith('.md')).sort()){
  const t=readFileSync(path.join(QX_SOURCE,dir,f),'utf8');
  const ids=[...t.matchAll(/^## (q-[a-z0-9-]+)「([^」]*)」/gm)];
  const k=ids.findIndex(m=>m[1]===qid);if(k<0)continue;
  const [, num, unit]=f.replace(/\.md$/,'').match(/^(\d+)_(.+)$/);
  const hs=dir==='高校編';
  const tail=hs?qid.match(/-(\d+)$/)?.[1]:['初級','中級','上級'][k];
  if(!tail)throw Error(`番号が決まらない：${qid}`);
  const short=qid.slice(2);
  return {qid,title:ids[k][2],source:path.join(QX_SOURCE,dir,f),kind:hs?'高校':'大学',num,unit,tail,
   id:`ys-qx-${short}`,script:`docs/video-revision-20260924/ytseries/qx-${short}.mjs`,diagrams:`scripts/umech/yt1-qx-${short}-diagrams.mjs`,
   key:`qx-${short}:`,cache:`/private/tmp/ys/ys-qx-${short}`,head:`${hs?'高校':'大学'}_${num}_${unit}_${tail}`};
 }
 throw Error(`正本に ${qid} が見つからない（${QX_SOURCE}）`);
}
if(import.meta.url===pathToFileURL(process.argv[1]).href){
 const id=process.argv[2];if(!id)throw Error('使い方：node scripts/umech/qx-name.mjs <問題ID>');
 const q=qxInfo(id);
 console.log([`問題：${q.qid}「${q.title}」（${q.kind} ${q.num} ${q.unit}・${q.tail}）`,`正本：${q.source}`,
  `ID：${q.id}`,`台本：${q.script}`,`図：${q.diagrams}（キーは '${q.key}<名前>'）`,`キャッシュ：${q.cache}`,
  `解説動画：~/Downloads/physics-quest-youtube/問題編_解説/${q.head}_解説.mp4`,
  `問題アニメ：~/Downloads/physics-quest-youtube/問題編_問題アニメ/${q.head}_出題.mp4（.png）、${q.head}_小問n.mp4（.png）`,
  `出力名の頭：${q.head}`].join('\n'));
}
