// Proposal-only audit. The root-owned Blender scene is never edited here.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const O=path.dirname(fileURLToPath(import.meta.url)),W=path.resolve(O,'../../..'),C='/private/tmp/ys/ys-chain-b2a_gpt_20261029';
const file=path.join(W,'scripts/blender/desk_b2a_gpt_20261029.py'),source=fs.readFileSync(file,'utf8');
const DATA=JSON.parse(fs.readFileSync(C+'/blender/b2a-scene-data.json')),PT=JSON.parse(fs.readFileSync(C+'/phrase-times.json'));
const {normKana}=await import(path.join(W,'scripts/umech/yt1-chain-00bx-common.mjs'));
function lookup(row,kana,occ=0,end=false){
 const re=new RegExp(normKana(kana).replace(/[ウオ]/g,'[ウオ]'),'g'),out=[];
 for(const q of DATA.cues.filter(q=>q.row===row)){const p=PT[q.subtitle];let m,n=0;re.lastIndex=0;while((m=re.exec(p.s))){const j=end?m.index+normKana(kana).length:m.index;out.push({cue:q.cueKey,occ:n++,start:q.start+p.t[m.index],end:q.start+(p.t[m.index+m[0].length]??p.end),value:q.start+(p.t[j]??p.end),matchedKana:m[0]});}}
 return out[occ]??null;
}
const calls=[];
for(const m of source.matchAll(/word\((\d+),\s*'([^']+)'([^)]*)\)/g)){const row=+m[1],kana=m[2],args=m[3],occ=+(args.match(/occ\s*=\s*(\d+)/)?.[1]??0);calls.push({line:source.slice(0,m.index).split('\n').length,call:m[0],row,kana,occ,result:lookup(row,kana,occ,/end\s*=\s*True/.test(args))});}
const T=(r,k,occ=0)=>{const x=lookup(r,k,occ);if(!x)throw Error('Missing proposed word '+r+' '+k);return {row:r,kana:k,occ:x.occ,cue:x.cue,start:+x.start.toFixed(6),end:+x.end.toFixed(6),matchedKana:x.matchedKana};};
const proposals=[
 {priority:'P0',row:28,issue:'検索語が実声にない。現在はfraction=.5のfallback。',current:"word(28,'カエルオハズシタラ')",replacement:"word(28,'カエルオトリノゾケバ')",timings:[T(28,'カエルオトリノゾケバ')],reason:'正本は「カエルを取りのぞけば」。外したらという語は発声しない。'},
 {priority:'P1',row:10,issue:'棒の接触と足のkickが「ぴくっ」の発声より約1.72秒早い。',current:"ct=word(10,'フレアワセル'); kick=bump(t,ct+.06)",replacement:"approach=word(10,'フレアワセルト'); ct=word(10,'ピクット'); 接近をapproach→ct、接触完成とkick開始をctへ。",timings:[T(10,'フレアワセルト'),T(10,'ピクット')],reason:'検索そのものは成功。ただし前半の条件節と後半の結果の語を同じ発声として使っている。'},
 {priority:'P1',row:11,issue:'離す動きに語アンカーがなく、再接触後の2回目kickは閉じた接点のまま起こる。',current:"ct=word(11,'フレアワセル'); kick=max(bump(t,ct),bump(t,ct+1.15))",replacement:"離す=word(11,'ハナスト')、接近=word(11,'フレアワセルト')、再接触とkick=word(11,'マタウゴキマス')。2回目は画面指定の実演なので、同じ2本をいったん離し再接触してから蹴らせる。",timings:[T(11,'ハナスト'),T(11,'トマリマス'),T(11,'フレアワセルト'),T(11,'マタウゴキマス')],reason:'同じ語を使わず2回目を任意の秒へ置くなら、声同期ではなく「画面だけの反復」と明示する。'},
 {priority:'P1',row:20,issue:'kickのa+.8／a+5がナレーションの結果の語とつながらない。',current:'kick=bump(t,a+.8)+bump(t,a+5)',replacement:"kick=max(bump(t,word(20,'アシワウゴク')),bump(t,word(20,'ピクットシタ')))",timings:[T(20,'アシワウゴク'),T(20,'キンゾクオアテタ'),T(20,'ピクットシタ')],reason:'前者は一般化の説明、後者は金属の実験の回想に対応。'},
 {priority:'P1',row:18,issue:'水位を行全体qで減らすため、コップ1杯の紹介より前に水がほぼ空になる。ポンプも名の発声の1秒前にオン。',current:'levels=max(.03,.9-4*q); pump=t>=word(18,ポンプ)-1',replacement:"コップ1杯の紹介中は水を保ち、排水は「すぐに空になります」へ向かう短い区間に設定。ポンプの導入はword(18,'ポンプ')、実際の戻り流れはword(18,'クミアゲツズケル')〜word(18,'ナガレガトマリマセン')の説明へ同期。",timings:[T(18,'コップイッパイノミズ'),T(18,'スグニカラニナリマス'),T(18,'クミアゲツズケル'),T(18,'ポンプ'),T(18,'ナガレガトマリマセン')],reason:'水が既に空では「ためたようなもの」の画と矛盾する。'},
 {priority:'P1',row:33,issue:'冒頭から電堆→検電器の線が完成している。開く動作は後半だけなので、前半の「離れて開く」の説明では閉じたまま。',current:"opened=word(33,'ハガヒライタ'); wireは行全体で表示",replacement:"前半はword(33,'ハナレテヒラク')で葉の動作を短く実演。後半cueで接続前へ戻し、word(33,'デンタイノハシニツナグ')で線を結び、word(33,'ハガヒライタ')で再度開く。初回の説明を図解の挿入として区別する。",timings:[T(33,'キンノハノケンデンキ'),T(33,'ニマイノウスイキンノハ'),T(33,'ハナレテヒラク'),T(33,'デンタイノハシニツナグ'),T(33,'ハガヒライタ')],reason:'同じ一段落に「装置の動作の説明」と「実験の事実」の2段がある。2つの時刻を使い分ける。'},
 {priority:'P1',row:39,issue:'左の火花と右の繰り返しびりっ／持続びりびりが行割合やa+3/a+5で動き、語頭とずれる。',current:'spark=.12<q<.14; jump at a+3/a+5; shake if q>.72',replacement:"左火花=word(39,'パチッ')。短い反復の区間=word(39,'ナンドデモビリットキマス')。その後word(39,'サワッテイルアイダ')で触れたまま、word(39,'ビリビリガツズキマス')で持続震えへ。",timings:[T(39,'パチッ'),T(39,'ナンドデモビリットキマス'),T(39,'サワッテイルアイダ'),T(39,'ビリビリガツズキマス')],reason:'「何度でも」の反復2〜3回には専用の発声数詞がない。短い反復は画面指定の予定として区間内へ置く。'},
 {priority:'P1',row:42,issue:'乾いた厚紙の置換を行の終わりまで引き延ばし、名前を言ってから約4秒後にdryが切り替わる。',current:"dry=smooth(t,word(42,'カワイタアツガミ'),b-.3); dry>.5",replacement:"dry0=word(42,'カワイタアツガミ'); dry1=word(42,'カワイタアツガミオハサム',end=True); dry=smooth(t,dry0,dry1)" ,timings:[T(42,'カワイタアツガミ'),T(42,'カワイタアツガミオハサム')],reason:'厚紙の名前を言う時に新しい色・材質を見せ、はさむの語までに完了させる。'},
 {priority:'P1',row:43,issue:'現在の最後のkickは金属の語付近で終わり、最後2秒に冒頭と同じぴくっがない。',current:"kick=bump(t,word(43,'キンゾクト')+.4)",replacement:'声のぴくっへの説明用動作を残すならその語で行い、冒頭回収は別にDATA[duration]-2〜DATA[duration]の間で行う。終端の回収に偽の発声時刻は付けない。',timings:[T(43,'ピクットサセタ'),T(43,'キンゾクト')],returnWindow:[DATA.duration-2,DATA.duration],reason:'正本・共通指示が最後1〜2秒を冒頭に戻すと指定。'},
 {priority:'P2',row:36,issue:'神経内の信号粒が行の頭から動き、「後に分かったこと」や神経の名の前に流れる。',current:"signal=((t-a)*.22)%1",replacement:"紹介まではsignal=None、word(36,'チイサナデンキ')から粒を見せ、word(36,'アイズオオクッテイマス')で神経に沿って進める。",timings:[T(36,'イキモノノシンケイ'),T(36,'チイサナデンキ'),T(36,'アイズオオクッテイマス')],reason:'仮説だった画と「後に分かった事実」を、同じ先行信号で混同させない。'},
 {priority:'P2',row:27,issue:'検索のケムリは最初の煙で合っているが、煙上昇と警報が同時に始まり、感じて鳴るの順が弱い。',current:"p.alarm_state(...,t>word(27,'ケムリ'))",replacement:"煙の開始=word(27,'ケムリ')、検出・点滅=word(27,'ナル')。語の時刻間で煙が警報器へ届くようにする。",timings:[T(27,'ケムリ'),T(27,'ナル')],reason:'検索語の訂正ではなく、入力→検出の時系列を分ける提案。'},
];
const passLookups=[
 {row:10,request:'シンチュウ',meaning:'真鍮',actual:T(10,'シンチュウ')},
 {row:10,request:'テツノボー',meaning:'鉄の棒。長音表記は正規化で問題なし。',actual:T(10,'テツノボー')},
 {row:29,request:'アツガミ',meaning:'塩水をしみこませた厚紙。最初の発声で正しい。',actual:T(29,'アツガミ')},
 {row:30,request:'ユビ',meaning:'最初の指はぬらした自分の指。検索は正しい。',actual:T(30,'ユビ')},
 {row:31,request:'カサネマシタ',meaning:'何十組も重ねた動作。検索は正しい。',actual:T(31,'カサネマシタ')},
 {row:32,request:'ビリット',meaning:'触れた結果のびりっ。検索は正しい。',actual:T(32,'ビリット')},
 {row:33,request:'ハガヒライタ',meaning:'後半の実験事実の葉の開き。normではワガヒライタ。',actual:T(33,'ハガヒライタ')},
 {row:33,request:'ウスイキンノハ',meaning:'薄い金の葉。直前のノによるウ→オ正規化をウオ許容で拾えている。',actual:T(33,'ウスイキンノハ')},
];
for(const p of proposals){
 p.status='proposal-only; root decision required';
 if(p.row===28&&source.includes("word(28,'カエルオトリノゾケバ'"))p.status='root already fixed while this audit was being prepared';
 if(p.row===10&&source.includes("ct=word(10,'ピクット'"))p.status='root already fixed while this audit was being prepared';
}
const out={created:new Date().toISOString(),scene:file,sceneSha256:crypto.createHash('sha256').update(source).digest('hex'),scope:'Read-only proposed word/action synchronization audit. Root scene untouched. No Blender render or ear check performed.',counts:{literalWordCalls:calls.length,matched:calls.filter(x=>x.result).length,missing:calls.filter(x=>!x.result).length},calls,proposals,passLookups};
const J=path.join(O,'scene-word-lookup-audit_20261029_v2.json');fs.writeFileSync(J,JSON.stringify(out,null,2),{flag:'wx'});
let md='# B-2前編 scene の発声語・同期点監査（提案のみ）\n\n対象：'+file+'\n\n台本・音声・字幕・root sceneは変更していません。literal word() '+calls.length+'件のうち、見つからない語は'+out.counts.missing+'件です。\n\n## 優先度順の修正案\n';
for(const p of proposals){md+='\n### '+p.priority+' 行'+p.row+'：'+p.issue+'\n\n- 状態：'+(p.status.startsWith('root already')?'監査中にroot側で修正済みを確認。以下は修正前の記録。':'提案のみ。root側の判断・反映待ち。')+'\n- 現状（発見時）：`'+p.current+'`\n- 提案：'+p.replacement+'\n- 理由：'+p.reason+'\n- 実時計：'+p.timings.map(t=>`${t.kana}（${t.start.toFixed(3)}〜${t.end.toFixed(3)}秒、${t.cue}、occ=${t.occ}）`).join('／')+'\n';if(p.returnWindow)md+='- 無声の終端回収窓：'+p.returnWindow.map(t=>t.toFixed(3)).join('〜')+'秒\n';}
md+='\n## 置換しなくてよい検索\n\n| 行 | 検索 | 対応・注意 | 実時計（秒） |\n| --- | --- | --- | --- |\n'+passLookups.map(x=>`| ${x.row} | ${x.request} | ${x.meaning} | ${x.actual.start.toFixed(3)}〜${x.actual.end.toFixed(3)} |`).join('\n')+'\n\n語の終了は次のカナの語頭までを含むため、無音の間を含む場合があります。検索の合否と、動作をその語へ結び付ける意味の正しさは別々に判定しました。\n';
fs.writeFileSync(path.join(O,'scene-word-lookup-修正提案_20261029_v2.md'),md,{flag:'wx'});
console.log(JSON.stringify({counts:out.counts,missing:calls.filter(x=>!x.result),report:J,proposalCount:proposals.length}));
