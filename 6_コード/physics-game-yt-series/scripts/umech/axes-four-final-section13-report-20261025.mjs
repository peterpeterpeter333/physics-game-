import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

// New local report only. No original/source/media/inspection file is edited.
// Run after root's actual viewing and the final D supplemental audit.
const W=path.resolve(new URL('../../',import.meta.url).pathname);
const O=path.join(W,'outputs/axes-20261023');
const [dPhysical,dClosure,inventory,snapshot]=process.argv.slice(2);
for(const p of [dPhysical,dClosure,inventory,snapshot])assert(p&&path.isAbsolute(p)&&fs.existsSync(p));
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const esc=s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ');
const frozen=read(snapshot);
assert.equal(frozen.allCopiesByteIdentical,true);
assert(Array.isArray(frozen.filesManifest));
const frozenBySource=new Map(frozen.filesManifest.map(x=>[x.source,path.join(path.dirname(snapshot),x.file)]));
const target=p=>{
 if(!p.startsWith('/private/tmp/ys/'))return p;
 assert(frozenBySource.has(p),'A temporary evidence link must have a durable copy: '+p);
 const saved=frozenBySource.get(p);assert(fs.existsSync(saved));return saved;
};
const link=p=>`[${path.basename(p)}](<${target(p)}>)`;
const json=p=>`${link(p)}（SHA-256 ${sha(p)}）`;
const out=path.join(O,'B-1からE-1_映像修正と最終確認_20261025.md');
assert(!fs.existsSync(out));
const cases=[
 {id:'B-1',title:'方位磁針は、なぜ北を向く？',cache:'/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025',
  seconds:10700/30,cues:50,rows:39,caption:213,bytes:45045547,sha:'6780889510a3d881ec446a58627325edf00cd0b43206c7f8b61c166c270ca1d2',
  data:'b1-section13-current-final5-report-data-v2-root304-20261025.json',gate:'validation-final-v1/quality-gate.json',
  compare:'actual-mp4-review',count:1803,newCount:651,oldCount:1152,encode:774.499,
  parts:'17種類・34画像。方位磁針、船、星、風見、磁石、ニンニク、釘、テレラ、地球儀、傾き計、予測図、人物、帳面など。',
  fixes:'物の大きさと配置、得点表示、手の動き、磁場の図・札、予測図、挑戦の針を修正。6本目の針が次の場面で途中に戻らないよう、16フレーム分の動きをつなぎ直した。',
  limits:'原7は最長14.5秒、原7bは中央値38.52％・小さい画39.5％でNGのまま。253画像は対象物の実寸投影と実際の完成画像を対応させた個別判定、51画像は指定された顔・フェードとして別判定した。298.5秒・299秒の背後3D幅37.2％・38.2％は数値を隠していない。',
  question:'正本の星と針を結ぶ向きの指示同士が逆になっている。全画面の顔と地球内部の「？」を同時に見せる指示も両立しない。得点の強調は2D HUDで、3D数字の拡大と文字どおり同じではない。磁針を「引っぱる」は比喩で、一様場では回転させるトルクと並進する力は別である。理想双極子模型の伏角を現実の2026年のロンドン実測値とは扱わない。',
 },
 {id:'C-1',title:'パスカルは、なぜ歯車に足し算をさせた？',cache:'/private/tmp/ys/ys-chain-c1v1-complete-final-r20-v4',
  seconds:10814/30,cues:53,rows:43,caption:215,bytes:51004163,sha:'1a8269cd3f62ea516deeffed145a3df9e1d818ab7ee4bfd9f7e12d1ff4369d74',
  data:'c1-section13-final-report-data-20261025.json',gate:'validation-final-v1/quality-gate.json',
  compare:'actual-final-review',count:511,newCount:193,oldCount:318,encode:682.612,
  parts:'10種類・20画像。歯車、数字輪、桁上がりの腕、計算機、紙と硬貨、ドミノなど。',
  fixes:'数字と歯車、桁上がりの腕の連動、文字の向き、物の大きさ、得点のタイミングを修正。ドミノの倒れ始めとカメラの停止を先に済ませ、顔への切替前に動きが読めるようにした。',
  limits:'原自動検査は全項目OK。ただし別の文章基準「物の少ない画面2秒以上なし」に対し、raw画像推定は2.0秒。284.0〜285.5秒の完成画像で横幅61〜68％の8本のドミノと、その後の指定された全画面の顔を確認した個別判定であり、推定値を0に変更したわけではない。',
  question:'腕の角度60°×d/9は指定された説明模型の式で、実物ソトワールの厳密な軌跡と同一とは断言しない。冒頭の追加カメラ寄りと3D得点板の起上がりは、承認済みの固定構図・2D HUDの差分がある。',
 },
 {id:'D-1',title:'炭鉱の水を、蒸気はどうやってくみ出した？',cache:'/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025',
  seconds:12162/30,cues:57,rows:46,caption:236,sha:'a75bb51396f4e90ab88a477e628aa4e42f8a5d1c7440f23f90b67c6e288f218f',
  data:'d1-section13-current-camera-pier-layout-report-data-20261025.json',gate:'final-original-gates/quality-gate.json',
  compare:'actual-final-review/main12',count:903,newCount:444,oldCount:459,
  parts:'炭鉱、馬、蒸気機関、透明な筒とピストン、冷却水、潰れる缶、空気と蒸気の比較、円と手形22枚、2トンの重り、半球、石炭、富士山など。支柱接触・石炭支持部・4枚の説明札の私有修正版も追加。',
  fixes:'7か所の見切れ・小さすぎる図・何も見えない構図を修正。説明札4枚の配置と引出線を整え、3本の支柱が軸に届くように修正。4区間のカメラと被写界深度を調整し、指先・物・札が読めるようにした。',
  limits:'原7bは中央値50.37％・小さい画23.43％でNGのまま。rawの物が少ない画面の推定は最長3秒で、原自動基準4秒未満には合格するが文章の2秒未満とは異なる。完成画像・意味上の対象物・独立投影の補助記録を別に照合する。',
  question:'歴史的な機関の弁や給水・排水の細部は省略した説明模型。蒸気が冷えると「空っぽ」は完全真空の意味ではなく、残留蒸気・空気がある。100kg、約2トン、約1％という指定の近似や、熱と仕事を扱う次回への説明は変更していない。',
 },
 {id:'E-1',title:'1707年、4隻の軍艦は、なぜ岩に突っ込んだ？',cache:'/private/tmp/ys/ys-chain-e1v1-final2-meaningful-motion-20261025',
  seconds:11605/30,cues:54,rows:41,caption:235,bytes:58006035,sha:'d4d4941e2afbc768c90bcb0afd1b2283d4672cb0873d70e455c316ef7aef6268',
  data:'e1-section13-final-current-evidence-20261025.json',gate:'validation-final-v1/quality-gate.json',
  compare:'actual-mp4-review-eof-20261025',count:1223,newCount:103,oldCount:1120,encode:676.575,
  parts:'11種類・22画像。海図、7隻の船、霧、地球儀、北極星と観測者、時計、航海用ロープと砂時計、船上の振り子時計、賞金など。',
  fixes:'冒頭で手が旗艦を指して退場する動きと、船上の振り子の通常運動→船の揺れ→乱れ→停止を修正。振り子のおもりが窓の奥に隠れる問題を直し、694枚の3D画像を差し替えた。元の静止8秒2区間を解消し、自動検査の最長は7秒になった。',
  limits:'原検査は全項目OK。書出しは11605フレーム。計画の最後の境界フレームとの差1枚は、音声・字幕が終わった後の結末の保持画に限り、実MP4のフレーム表と最後までの復号で確認した。発話・cue・動作時刻を前の画像へ置き換えていない。',
  question:'111×2/3は厳密には74。指定の「約70km」は英国付近を大まかに示すためで、詳細計算の約71kmの補足を併記した。南の星の固定視点は指定30°と実装15°に差分がある。最後の霧は「冒頭と同じ」と「0にする」の指示が両立しないため、薄い霧の既承認版を維持。',
 },
];
const deliveryRoot='/Users/ken/Downloads/physics-quest-youtube/技術の疑問の鎖';
for(const c of cases){
 c.video=path.join(deliveryRoot,`${c.id}_${c.title}.mp4`);
 c.dataPath=path.join(O,c.data);c.dataObj=read(c.dataPath);c.gatePath=path.join(c.cache,c.gate);c.gateObj=read(c.gatePath);
 assert.equal(sha(c.video),c.sha);c.bytes=fs.statSync(c.video).size;
 c.copy=path.join(O,`${c.id.replace('-','').toLowerCase()}-final-delivery-copy-20261025.json`);
 assert.equal(read(c.copy).sha256,c.sha);
}
assert.equal(read(cases[3].copy).qualityApprovalInferred,false);
const dp=read(dPhysical),dc=read(dClosure);
assert.equal(dp.mp4Sha256,cases[2].sha);
assert.equal(dp.rows.length,846);
assert.equal(dp.original546RequestsUnchanged,true);
assert.equal(dp.renders,0);
assert(dp.protectionChecks&&Object.values(dp.protectionChecks).every(x=>x===true));
assert.equal(dc.mp4Sha256,cases[2].sha);
assert.equal(dc.physicalReportSha256,sha(dPhysical));
assert.equal(dc.noNewRequiredVisualRepairIdentified,true);
assert.equal(dc.originalAutomaticFailuresPreserved,true);
assert.equal(dc.all846PhysicalRowsIndependentlyHistoricalBoxCertified,false);
assert.equal(dc.earsVerified,false);
assert.equal(dc.finalDeliveryCopied,true);
assert.equal(dc.deliveryDestinationSha256,cases[2].sha);
const decoded=path.join(O,'axes-four-delivered-full-stream-decode-20261025.json');
const decodedResult=read(decoded);
assert.equal(decodedResult.allFourCompleteStreamsDecodedWithoutError,true);
assert.equal(decodedResult.rows.length,4);
for(const c of cases){
 const r=decodedResult.rows.find(x=>x.mp4Sha256===c.sha);
 assert(r&&r.exitCode===0&&r.completeVideoAndAudioStreamsDecodedToNull===true);
}
const preservation=path.join(O,'original-preservation-final-20261025-1736.json');
assert(read(preservation).allUnchanged===true);
const cSupplement=path.join(O,'c1-final-v4-middle019-036-current162-personal-review-20261025.json');
const cs=read(cSupplement);
assert.equal(cs.mp4Sha256,cases[1].sha);
assert.equal(cs.scope.uniqueCurrentFinalFrames,162);
assert.equal(cs.scope.allAllocatedCellsPersonallyViewed,true);
assert.equal(cs.scope.sameOldJpegCount,157);
assert.equal(cs.scope.changedOldJpegCount,5);
assert.equal(cs.pages.length,18);
assert.equal(cs.findings.noNewRequiredVisualRepairIdentifiedInThisScope,true);
for(const page of cs.pages){
 assert.equal(sha(page.file),page.fileSha256);
 assert.equal(page.cells.length,9);
 for(const cell of page.cells){
  assert.equal(cell.personallyViewedAsContactCell,true);
  assert.equal(cell.actualViewer,cs.actualViewer);
  assert.equal(sha(cell.file),cell.fileSha256);
 }
}
let md='# 技術の疑問の鎖 B-1からE-1 映像修正と最終確認\n\n';
md+='4本の指定先に、修正後の1080×1920・30fpsのMP4を保存しました。台本・音声・字幕は変えていません。コミット・pushはしていません。\n\n';
md+='映像は全編にわたる1秒ごとの画像、cueの終わり、主要動作、見本との比較画像で確認しました。B-1・D-1には元の自動判定のNGが残るため、下の数値と対象画像を指定した個別判定を分けています。「元の自動検査が4本すべて無条件合格」「制作指示の一字一句と完全一致」という報告ではありません。\n\n';
md+='## 1 保存した動画\n\n|回|動画|長さ|cue|正本の行|字幕区切り|容量|\n|---|---|---:|---:|---:|---:|---:|\n';
for(const c of cases)md+=`|${c.id}|${link(c.video)}|${Math.floor(c.seconds/60)}分${(c.seconds%60).toFixed(2)}秒|${c.cues}|${c.rows}|${c.caption}|${(c.bytes/1e6).toFixed(2)} MB|\n`;
md+='\n動画のSHA-256と元ファイルとの一致は、各回の排他的コピー記録で確認できます。既にある出力を上書きせず保存しています。\n\n';
for(const c of cases)md+=`- ${c.id}：${json(c.copy)}\n`;
md+=`\n保存先の4本について、映像と音声の両ストリームを最後まで復号する追加検査も全て終了コード0でした。破損や復号エラーの機械検査であり、耳で聞いたことや人が連続視聴したことを意味しません。${json(decoded)}\n`;
md+='\n## 2 共通指示11章の確認\n\n';
md+='|項目|B-1|C-1|D-1|E-1|\n|---|---|---|---|---|\n';
const gateValue=(c,no)=>c.gateObj.results.find(r=>String(r.no)===String(no))?.value??'別証拠参照';
const row=(name,values)=>{md+=`|${name}|${values.map(esc).join('|')}|\n`;};
row('字幕と正本',[...cases.map(()=> 'lint 0・原稿と字幕は保護')]);
row('読みとアクセント',[...cases.map(()=> '読み0・prosody 0・speaker 0')]);
row('qx-verify',[...cases.map(()=> '終了0')]);
row('原自動品質検査',[...cases.map(c=>c.gateObj.pass?'全項目OK':'NGを保持・個別補助記録併記')]);
row('カメラ移動20％以下',cases.map(c=>gateValue(c,3)));
row('真上の画20％以下',cases.map(c=>`${gateValue(c,4)}（原推定基準は30％）`));
row('主役40〜70％・35％未満20％以下',cases.map(c=>gateValue(c,'7b')));
row('物の少ない画面2秒以上なし',cases.map(c=>`${gateValue(c,7)}${c.id==='E-1'?'':'・対象画像で別判定'}`));
row('札の画面外へのはみ出し',cases.map(c=>gateValue(c,1)));
row('札からの文字のはみ出し',cases.map(c=>gateValue(c,'1c')));
row('36px未満の文字',cases.map(c=>gateValue(c,2)));
row('冒頭と最後の同じ物',['方位磁針と船','同じ計算機','同じ蒸気機関と炭鉱','同じ海図と船']);
row('全編の一覧・比較',cases.map(c=>`${c.count}選択画像・主要12組・問題2枚`));
row('7章の動作と語の時刻',cases.map(c=>`${c.rows}行を照合・文字どおりには異なる所を各回資料に明記`));
row('10章の数の照合',['理想双極子のロンドン68.31°・南緯30°の上向き49.11°など','27+18=45・9999+1=10000・4回の桁上がりなど','15mL×1700=25.5L・26.5²×3.14=2205.065cm²など','360°/24h=15°/h・1°=4分・東30°など']);
row('問題編の準備',cases.map(()=> '挑戦・答え・原文jsonあり'));
row('既存ファイルの保存',cases.map(()=> '共通43保護対象の一致確認・詳細SHA記録あり'));
md+='\n字幕の中央値の上限1.65秒は、この4本だけの承認済み条件です。字幕そのものは変更せず、既存の検査プログラムも書き換えていません。D-1の最初の検査でローカル音声サービスへの通信が拒否された3件は残し、同じ映像・台本を使ったrootでの再実行3件が0であることを別記録に保存しました。\n\n';
md+='## 3 元の自動検査の表\n\n以下は完成候補に対する元の表を、NGと参考行も含めて転記したものです。手動の判断で元の表のNGをOKに書き換えていません。\n\n';
for(const c of cases){
 md+=`### ${c.id}\n\n${json(c.gatePath)}\n\n|番号|項目|判定|値|元の基準|\n|---|---|---|---|---|\n`;
 for(const r of c.gateObj.results)md+=`|${esc(r.no)}|${esc(r.name)}|${esc(r.status)}|${esc(r.value)}|${esc(r.rule)}|\n`;
 md+='\n';
}
md+='## 4 各回の修正と残る差分\n\n';
for(const c of cases){
 md+=`### ${c.id} ${c.title}\n\n${c.fixes}\n\n${c.limits}\n\n原稿と指示への疑問は変更していません。${c.question}\n\n全行の時刻、数の検査、比較画像、部品とカタログの全パス、旧版からの修正履歴、処理時間の詳細は ${json(c.dataPath)} に保存しています。\n\n`;
}
md+='### D-1の古い座標記録と完成映像の照合\n\n';
md+='フレーム番号810では、古い座標記録がカメラ修正前の投影と一致していました。一方、このフレームの完成映像に使われた修正後のカメラ・主役の投影範囲は元の描画記録と一致しました。古い記録を黙って書き換えず、旧記録との不一致、再現したカメラ投影、独立した描画記録との比較を別に保存しています。全コマが同じ原因で数値的に解決した、という意味ではありません。\n\n';
const ds=dp.actualAnchorAndSourceBoxEvidence.summary;
md+=`物理再現は846コマです。完成画像903コマのうち、cueの終端57コマは画像確認には含め、追加の物理再現をしたとは扱っていません。独立した過去の投影範囲があるのは${ds.independentHistoricalSourceBoxAvailable}コマ、残る${ds.newMeasurementsWithoutIndependentHistoricalSourceBox}コマは今回の測定です。旧座標と直接一致しない${ds.historicalAnchorOriginalMismatchRetained}コマや、演算順序に起因する微小差も元のfalseを保持しています。対象ごとの判断と未解決部分は下の最終判断記録に記載しています。\n\n`;
md+='595枚の個別確認画像は、担当2人が各200枚、rootが195枚を確認しました。40〜70％の幅条件を外れた5枚は下表のとおりです。カメラ移動中または機関の組立開始の画として原寸も確認し、対象が読める画像に限って採用しています。幅の数値を合格値に直してはいません。\n\n|時刻|主対象の幅|場面|\n|---|---:|---|\n|41.40秒|70.88％|炭鉱へのカメラ移動|\n|42.00秒|16.81％|機関を組み立て始め、最初のボイラーだけが出た瞬間|\n|123.63秒|30.19％|缶へのカメラ移動|\n|133.57秒|34.31％|潰れた缶と矢印を見せるカメラ移動|\n|133.60秒|37.73％|同じ移動の途中|\n\n';
md+='旧座標34件のうち28件は更新前のカメラで厳密に再現できましたが、残る6件の厳密一致は未解決です。独立した過去の投影範囲がある784件は、679件が厳密一致、105件が不一致です。この105件には演算順序に由来する最大0.000238pxの差があり、元の不一致を保持しています。残る62件には独立した過去の投影範囲がなく、今回測った値だけを根拠に過去との一致を合格扱いしていません。\n\n';
md+='D-1の13章用JSONは追加の物理照合より前の途中記録です。後から分かった照合結果と指定先へのコピーは、上記の完成MP4、コピー記録、および下記2つの後継記録を参照してください。\n\n';
md+=`- 投影・独立描画記録・機構復帰の検証：${json(dPhysical)}\n- 対象画像を指定した最終判断：${json(dClosure)}\n\n`;
md+='## 5 実際に確認した範囲\n\n|回|完成MP4の確認画像|同フレームかつJPEG完全一致の既確認画像|今回の新規確認画像|\n|---|---:|---:|---:|\n';
for(const c of cases)md+=`|${c.id}|${c.count}|${c.oldCount}|${c.newCount}|\n`;
md+='\n旧画像は同じフレーム番号と復号後JPEGのSHAが完全一致するものだけを継承し、元の確認者を記録しています。rootが過去の担当者の確認を自分の視認として扱ったわけではありません。今回の画像は一覧のセルを全て表示し、主要12組と問題2枚は別に表示しました。一覧の全セルを1080×1920で1枚ずつ見た、全30fpsを連続視聴した、という意味ではありません。\n\n';
md+=`C-1は、旧一覧019〜036の一部が元担当の画像コンテキストエラー後の親・チーム記録に依存していたため、現在の完成MP4に対応する162画像を別担当が改めて全て表示しました。157画像は旧JPEGと一致し、変更された5画像も直接確認しています。先のroot確認36画像との重複5枚を差し引き、今回の個別確認は193枚、残る同一JPEGの継承は318枚です。旧13章用JSONの475／36という途中の内訳は書き換えず、この補完を後継記録として分けています。${json(cSupplement)}\n\n`;
for(const c of cases)md+=`- ${c.id}の全編一覧・主要12時刻・帰属の記録：${link(c.dataPath)} 内の visualCoverage／actualReview／major12 等。\n`;
md+='\n### 確認画像への直接リンク\n\n';
const direct=[
 {c:cases[0],index:cases[0].cache+'/actual-mp4-review/manifest.json',contact:'/private/tmp/ys/ys-chain-b1v1-final5-pending-eye-contacts-20261025/manifest.json',prefix:cases[0].cache+'/actual-mp4-review/compare-major-',suffix:'.jpg'},
 {c:cases[1],index:cases[1].cache+'/actual-final-review/actual-final-index.json',contact:cases[1].cache+'/actual-final-review/sheets/sheet-001.jpg',prefix:cases[1].cache+'/actual-final-critical12/compare-c1v1-final-',suffix:'.jpg'},
 {c:cases[2],index:cases[2].cache+'/actual-final-review/d1v1-review-manifest.json',contact:'/private/tmp/ys/ys-chain-d1v1-final-union-eye-review-20261025/d1-final-union-eye-contact-manifest.json',prefix:cases[2].cache+'/actual-final-review/main12/pair-',suffix:'.png'},
 {c:cases[3],index:cases[3].cache+'/actual-mp4-review-old1200-union-20261025/manifest.json',contact:cases[3].cache+'/actual-mp4-review-old1200-union-20261025/attributed-reuse-and-pending/coverage.json',prefix:cases[3].cache+'/actual-mp4-review-eof-20261025/compare-major-',suffix:'.jpg'},
];
for(const x of direct){
 assert(fs.existsSync(x.index)&&fs.existsSync(x.contact));
 const pairs=Array.from({length:12},(_,i)=>x.prefix+String(i+1).padStart(2,'0')+x.suffix);
 assert(pairs.every(p=>fs.existsSync(p)));
 md+=`- ${x.c.id}：全編の${link(x.index)}、一覧の入口 ${link(x.contact)}。主要12組：${pairs.map((p,i)=>`[${i+1}](<${target(p)}>)`).join('、')}。\n`;
}
md+='\n## 6 問題編に使える画像\n\n';
for(const c of cases)md+=`- ${c.id}：${link(path.join(c.cache,'problem/挑戦.png'))}、${link(path.join(c.cache,'problem/答え.png'))}、${link(path.join(c.cache,'problem/problem.json'))}\n`;
md+='\n問題編のjsonは正本の「問題編への接続」の文を保護しています。今回は問題編のゲーム実装はしていません。\n\n';
md+='## 7 部品と関連ファイル\n\n';
for(const c of cases)md+=`- ${c.id}：${c.parts}\n`;
md+=`\n斜めと真上の画像、元の私有プログラム、修正用プログラム、各回のキャッシュと証拠の関連ファイル一覧：${json(inventory)}。この一覧は作業終盤の固定時点のものです。一覧作成後のD補助検証と報告用プログラムは後継の各証拠にも記載しています。一覧に存在することと、今回そのファイルを新規作成したことは区別しています。各部品の全カタログパスは各回の13章用JSONのparts（D-1はfilesAndParts）にもあります。\n\n`;
md+='## 8 書き出し時間\n\n|回|最終MP4のエンコード|今回の主な3D修正の実測経過時間|\n|---|---:|---|\n';
for(const c of cases){
 let enc=c.encode;if(c.id==='D-1')enc=c.dataObj.executionTimes?.encodeSeconds;
 const text=c.id==='B-1'?'16コマの針の動きを補修。試写・本番・再利用の各記録は個別資料参照':c.id==='C-1'?'最終のドミノ区間約1161.66秒。先行修正の時間は個別資料参照':c.id==='D-1'?'支柱約2986.68秒、4区間のカメラ約569.82秒': '694枚の修正約1398.42秒';
 md+=`|${c.id}|${Number.isFinite(enc)?enc.toFixed(3)+'秒':'exportの実測欄を参照'}|${text}|\n`;
}
md+='\nこれらは処理の開始から終了までの経過時間で、GPUだけの稼働時間ではありません。中断、試写、再利用、処理の重複を含むため、単純合算して総制作時間とは呼んでいません。\n\n';
md+='## 9 保存と未確認事項\n\n';
md+=`- 台本・字幕データ・既存音声・共通フレーム・元検査・旧2話の動画など43保護対象の一致：${json(preservation)}。部品・カメラ等の追加保護と、各回の入力の変更前後の一致は各描画・書出し記録にもあります。\n- 完成映像と確認用画像・ログの保存記録：${json(snapshot)}。この報告内の一時キャッシュへのリンクは、同じバイトの保存済みコピーがある場合、そちらへ向けています。元JSON内のパスは改変していないため、将来キャッシュが消えた場合はmanifestのsource→file対応で保存先を引けます。\n- コミット・pushは実施していません。\n\n`;
md+=`保存用バックアップは${(frozen.bytes/1e9).toFixed(2)} GBです。現在の完成版・確認資料を保存し、古い全試作の完全な複製とはしていません。最初のコピー処理が古いキャッシュの別名を重複してたどったため中止し、今回の処理が新規作成した途中コピー約34.27 GBだけを削除しました。元素材と指定先の4本は削除していません。整理記録：${json(path.join(O,'interrupted-task-backup-cleanup-20261025.json'))}\n\n`;
md+='耳で聞く最終確認と、動画を通常再生しての連続通し確認は未実施です。音声は変更しておらず、読み・アクセント・音量・無音・タイミングの機械検査は済んでいますが、音の自然さを耳で保証したとは報告しません。\n\n';
md+='主役の幅40〜70％は全フレームで厳密に成立すると断言しません。大きさの元のNGや顔への切替、同時に比較する対象物の数、原稿内の矛盾など、各回の資料に残した差分を伴う完成版です。全ての元基準を無条件に満たすことと、対象を指定した補助確認で映像を採用することを区別しています。\n';
fs.writeFileSync(out,md,{flag:'wx'});
console.log(JSON.stringify({report:out,bytes:fs.statSync(out).size,sha256:sha(out),videos:cases.map(c=>({id:c.id,path:c.video,sha256:c.sha,bytes:c.bytes})),existingFilesEdited:false,commitOrPushPerformed:false}));
