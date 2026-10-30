// Read-only timing extraction from the frozen narration, PCM and phrase clocks.
// This creates a shot map only; it does not regenerate or modify any voice/cue.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const OUT=path.dirname(fileURLToPath(import.meta.url)),W=path.resolve(OUT,'../../..');
const CACHE='/private/tmp/ys/ys-chain-b2a_gpt_20261029';
const F=JSON.parse(fs.readFileSync(path.join(OUT,'AUDIO_AND_TIMING_FROZEN.json')));
const c=JSON.parse(fs.readFileSync(CACHE+'/'+F.id+'.json'));
const PT=JSON.parse(fs.readFileSync(CACHE+'/phrase-times.json'));
const {normKana}=await import(path.join(W,'scripts/umech/yt1-chain-00bx-common.mjs'));
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
for(const f of F.immutableMediaFiles)if(sha(f.path)!==f.sha256)throw Error('Frozen file changed '+f.path);
if(sha(F.script)!==F.scriptSha256||sha(F.master)!==F.masterSha256)throw Error('Frozen master/script changed');
const rows=fs.readFileSync(F.master,'utf8').split('\n').filter(l=>/^\|\s*\d+\s*\|/.test(l)).map(l=>{const a=l.split('|').map(x=>x.trim());return {row:+a[1],scene:a[2],speaker:a[3],narration:a[4],screen:a[5]};});
const cues=c.scenes.flatMap(s=>s.cues.map((q,i)=>({...q,cap:s.captions[i]})));
const specs=new Map();
const R=(row,primary,events,screenOnly=[])=>specs.set(row,{primary,events,screenOnly});
// N=named object; A=spoken action; C=spoken card/conclusion. Screen-only objects
// are deliberately not reported as if their names were spoken in the voice.
R(1,'布をかぶった小さな台',[],[{label:'緑の丸っこい足先が一度だけ、ぴくっとけって、布が少し揺れる。',method:'fixed-silent-master-row',start:0,end:2,reason:'正本行1は声なし2秒。対応する発声語はない。'}]);
R(2,'テレラ',[
 ['N','テレラ','テレラ'],['N','赤い印','アカイシルシ'],['N','方位磁針','ホオイジシン'],['A','小さな方位磁針を置きます。','ホオイジシンオオキマス'],['C','挑戦の答え合わせ','チョオセンノコタエアワセ'],
]);
R(3,'テレラ',[
 ['N','オーストラリア','オオストラリア'],['N','方位磁針の北を向く先','ホオイジシンノキタオムクサキ'],['C','下と上','シタトウエ'],['A','傾く','カタムク'],
]);
R(4,'テレラ',[
 ['C','一段目','イチダンメ'],['N','地球の北','チキュウノキタ'],['N','S極','エスキョク'],['N','南','ミナミ'],['N','N極','エヌキョク'],
],[{label:'棒磁石の影が透けて見える。',anchor:'チキュウノキタ',reason:'棒磁石という物名は行4の声では発声しない。北・S極の説明へ同期。'}]);
R(5,'テレラ',[
 ['C','二段目','ニダンメ'],['N','磁石の力の線','ジシャクノチカラノセン'],['N','N極','エヌキョク'],['A','N極から出て','エヌキョクカラデテ'],['A','まわりを回り','マワリオマワリ'],['A','S極へ入ります。','エスキョクエハイリマス'],['A','南から出て','ミナミカラデテ'],['A','北へ入ります。','キタエハイリマス'],
],[{label:'鉄の粉がまかれ、線の模様が浮かぶ。',anchor:'ジシャクノチカラノセン',reason:'鉄の粉は画面欄だけで指定され、行5の声にはない。力の線の導入へ同期。'}]);
R(6,'テレラの赤いてっぺんの近く',[
 ['C','三段目','サンダンメ'],['N','てっぺんの近く','テッペンノチカク'],['N','地面の下','ジメンノシタ'],['A','斜め上へ出てきます。','ナナメウエエデテキマス'],['N','針の北を向く先','ハリノキタオムクサキ'],['A','線に沿って向く','センニソッテムク'],['A','上を向きます。','ウエオムキマス'],
]);
R(7,'上に傾く針',[
 ['C','四段目','ヨンダンメ'],['N','オーストラリア','オオストラリア'],['N','南半球','ミナミハンキュウ'],['A','線が出てくる','センガデテクル'],['C','答え','コタエ'],['A','上に傾く','ウエニカタムク'],
]);
R(8,'勝負の札',[
 ['N','北半球のロンドン','キタハンキュウノロンドン'],['N','勝負の札','ショオブノフダ'],['C','言い伝え 0 − 3 実験','イイツタエレイタイサンジッケン'],['C','実験で崩れる','ジッケンデクズレル'],['C','実験に1点','ジッケンニイッテン'],
],[{label:'下に傾く針（前の回の約72度）',anchor:'キタハンキュウノロンドン',reason:'72度はこの行の声にはない。B-1既知の角度として画面欄で指定される。'}]);
R(9,'カエルの足',[
 ['C','1780年代','センナナヒャクハチジュウネンダイ'],['N','イタリアのボローニャ','イタリアノボロオニャ'],['N','ルイージ・ガルヴァーニ','ルイイジガルバアニ'],['N','カエルの足','カエルノアシ'],
],[{label:'布が取られ、カエルの足の模型',anchor:'カエルノアシ',reason:'布を取るという動作は画面欄だけ。足の初紹介時に布を取る。'}]);
R(10,'カエルの足と2本の棒の先',[
 ['N','白い糸','シロイイト'],['N','神経','シンケイ'],['N','真鍮','シンチュウ'],['N','金色の金属の棒','キンイロノキンゾクノボオ'],['A','棒を当てます。','ボオオアテマス',{occ:0}],['N','足の肉','アシノニク'],['N','鉄の棒','テツノボオ'],['A','鉄の棒を当てます。','テツノボオオアテマス'],['N','2本の棒の先','ニホンノボオノサキ'],['A','ふれ合わせると','フレアワセルト'],['A','ぴくっとけります。','ピクットケリマス'],
]);
R(11,'カエルの足と2本の棒の先',[
 ['A','離すと','ハナスト'],['A','止まります。','トマリマス'],['A','ふれ合わせると','フレアワセルト'],['A','また動きます。','マタウゴキマス'],['N','机の上','ツクエノウエ'],['N','電池','デンチ'],['N','電線','デンセン'],
],[{label:'ふれ合わせると、またぴくっ（2回）',anchor:'マタウゴキマス',reason:'声は再接触1回を述べるだけ。画面欄の2回はこの動作語以降の短い実演であり、2回目専用の発声時刻はない。'}]);
R(12,'乾電池',[
 ['N','小さなぴくっ','チイサナピクッ'],['C','およそ20年後','オヨソニジュウネンゴ'],['A','ずっと流し続ける','ズットナガシツズケル'],['N','道具','ドオグ'],['N','電池','デンチ'],
],[{label:'いまの乾電池が1本、ころんと置かれる。',anchor:'デンチ',reason:'置かれる動作語は声にない。電池の名を言う所へ同期。'}]);
R(13,'ガラスの棒と布',[
 ['N','静電気','セエデンキ',{occ:0}],['N','ガラス','ガラス'],['N','布','ヌノ'],['A','こすってためた','コスッテタメタ'],['A','ぱちっと火花を飛ばす','パチットヒバナオトバス'],['A','それで終わり','ソレデオワリ'],
],[{label:'棒に小さな「＋」の印がたまる。',anchor:'コスッテタメタ',reason:'＋の記号は画面欄だけ。ためたの発声区間で増やし、火花後に消す。'}]);
R(14,'水そう2つと透明な管',[
 ['C','たとえ話','タトエバナシ'],['N','高い水そう','タカイスイソオ'],['N','低い水そう','ヒクイスイソオ'],['N','管','カン'],['A','管でつなぐと','カンデツナグト'],['A','高い方から低い方へ流れます。','タカイホオカラヒクイホオエナガレマス'],
]);
R(15,'2つの水そうの高さの差と管',[
 ['N','高さの差','タカサノサ'],['C','水を押す力','ミズオオスチカラ'],['N','電圧','デンアツ'],['N','ボルト','ボルト'],['A','管を流れる','カンオナガレル'],['N','水の量','ミズノリョオ'],['N','電流','デンリュウ'],
]);
R(16,'乾電池とドアの模型',[
 ['C','具体例','グタイレエ'],['N','乾電池1本','カンデンチイッポン'],['C','1.5ボルト','イッテンゴボルト'],['N','ドアノブ','ドアノブ'],['A','ぱちっとくる','パチットクル'],['N','静電気','セエデンキ'],['C','何千ボルト','ナンゼンボルト'],['C','千倍以上','センバイイジョオ'],
],[{label:'2つの水そうの絵の高さで比べる',anchor:'センバイイジョオ',reason:'水そうという語は行16の声にはない。比較の声に合わせて、前の水そうをたとえとして再表示する。'}]);
R(17,'ミオの驚き顔（小）',[
 ['C','強い','ツヨイ'],['A','ぱちっと一瞬','パチットイッシュン'],['A','終わっちゃう','オワッチャウ'],
]);
R(18,'コップの水と2つの水そうとポンプ',[
 ['C','流れる量から','ナガレルリョオカラ'],['N','静電気','セエデンキ'],['N','高い所','タカイトコロ'],['N','コップ1杯の水','コップイッパイノミズ'],['A','ためた','タメタ'],['A','空になります。','カラニナリマス'],['N','電池','デンチ'],['N','高い方','タカイホオ'],['A','くみ上げ続ける','クミアゲツズケル'],['N','ポンプ','ポンプ'],['A','流れが止まりません。','ナガレガトマリマセン'],
],[{label:'管を開けると、勢いよく流れて、すぐ空になる。',anchor:'スグニカラニナリマス',reason:'管を開ける動作は画面欄だけ。空になる語までに流れを実演する。'}]);
R(19,'静電気の機械とメスがふれる神経',[
 ['N','ガルヴァーニの研究室','ガルバアニノケンキュウシツ'],['N','静電気を作る機械','セエデンキオツクルキカイ'],['A','火花を飛ばした','ヒバナオトバシタ'],['N','カエルの神経','カエルノシンケイ'],['N','メス','メス'],['A','メスがふれている','メスガフレテイル'],['A','ぴくっとけった','ピクットケッタ'],
],[{label:'取っ手を回すガラスの円盤の機械',anchor:'セエデンキオツクルキカイ',reason:'取っ手・円盤は画面欄のみ。機械の名の発声時に同じ模型を大きく見せる。'},{label:'メスを持つ人形（前かけ姿。札「研究室で 手伝う 人」）',anchor:'メス',reason:'研究室で手伝う人の名は声では述べない。メス紹介時に作業者を明示する。'}]);
R(20,'金属の棒でぴくっとする足',[
 ['A','電気が流れる','デンキガナガレル'],['A','足は動く','アシワウゴク'],['N','ガルヴァーニ','ガルバアニ'],['N','カエルの足と電気','カエルノアシトデンキ'],['A','金属を当てた','キンゾクオアテタ'],['A','ぴくっとした','ピクットシタ'],['C','電気が流れた','デンキガナガレタ'],
]);
R(21,'カエルの足',[
 ['N','電気の源','デンキノミナモト'],['N','ガルヴァーニ','ガルバアニ'],['C','仮説','カセツ'],['C','カエルの体の中にある','カエルノカラダノナカニアル'],['N','動物電気','ドオブツデンキ'],
],[{label:'カエルの足の中に、小さな稲妻の印。',anchor:'カエルノカラダノナカニアル',reason:'稲妻という語は声にない。ここは仮説の可視化で、事実の電気の発生として見せない。'}]);
R(22,'シビレエイとカエルの足',[
 ['N','シビレエイ','シビレエイ'],['A','体から電気を出して','カラダカラデンキオダシテ'],['A','さわった','サワッタ'],['A','しびれさせる','シビレサセル'],['N','2本の金属','ニホンノキンゾク'],['C','体の中の電気を通す道','カラダノナカノデンキオトオスミチ'],
]);
R(23,'ミオのうなずき顔（小）',[
 ['N','魚','サカナ'],['A','電気を出す','デンキオダス'],['N','カエル','カエル'],
]);
R(24,'ガルヴァーニの本とヴォルタの人形',[
 ['C','1791年','センナナヒャクキュウジュウイチネン'],['N','ガルヴァーニ','ガルバアニ'],['A','本にまとめました。','ホンニマトメマシタ'],['A','それを読んだ','ソレオヨンダ'],['N','パヴィーアの大学','パビイアノダイガク'],['N','アレッサンドロ・ヴォルタ','アレッサンドロボルタ'],['A','初めは動物電気を信じ','ハジメワドオブツデンキオシンジ'],['A','同じ実験を、自分でくり返しました。','オナジジッケンオジブンデクリカエシマシタ'],
],[{label:'本を開く。',anchor:'ソレオヨンダ',reason:'本を開くという動作語は声にない。読んだの語へ同期。'}]);
R(25,'2つのカエルの足の模型',[
 ['C','具体例','グタイレエ'],['N','ヴォルタ','ボルタ'],['A','棒の組み合わせを変えてみました。','ボオノクミアワセオカエテミマシタ'],['C','2本とも同じ金属','ニホントモオナジキンゾク'],['A','ずっと弱くなります。','ズットヨワクナリマス'],['C','違う2種類の金属','チガウニシュルイノキンゾク'],['A','強く動いた','ツヨクウゴイタ'],
],[{label:'左：鉄と鉄の棒 → 足がかすかに動くだけ。',anchor:'ズットヨワクナリマス',reason:'鉄と鉄という個別材料名は声では言わない。同じ金属／弱いという比較に結び付ける。'},{label:'右：真鍮と鉄の棒 → 大きくぴくっ。',anchor:'ツヨクウゴイタ',reason:'真鍮と鉄という個別材料名は声では言わない。違う2種類／強いという比較に結び付ける。'}]);
R(26,'カエルの足とヴォルタの考えの札',[
 ['N','ヴォルタ','ボルタ'],['C','別の考え','ベツノカンガエ'],['C','カエルからではなく','カエルカラデワナク'],['N','違う2種類の金属','チガウニシュルイノキンゾク'],['A','出会いから生まれる','デアイカラウマレル'],['N','カエルの足','カエルノアシ'],['A','電気を感じて動く','デンキオカンジテウゴク'],['C','敏感な道具','ビンカンナドオグ'],
]);
R(27,'警報器の模型',[
 ['C','たとえ話','タトエバナシ'],['N','カエルの足','カエルノアシ'],['N','煙','ケムリ',{occ:0}],['A','煙を感じて鳴る','ケムリオカンジテナル'],['N','火事の警報器','カジノケエホオキ'],['N','警報器','ケエホオキ',{part:2}],['A','鳴りはしても','ナリワシテモ'],['C','煙を出しているわけではありません。','ケムリオダシテイルワケデワアリマセン'],
]);
R(28,'カエルの足',[
 ['C','確かめる側から','タシカメルガワカラ'],['C','もしガルヴァーニが正しく','モシガルバアニガタダシク'],['C','電気がカエルの体の中にあるなら','デンキガカエルノカラダノナカニアルナラ'],['A','カエルを取りのぞけば','カエルオトリノゾケバ'],['C','電気は出ないはず','デンキワデナイハズ'],
]);
R(29,'亜鉛・塩水の厚紙・銅',[
 ['N','カエル','カエル',{part:1}],['C','2つの役','フタツノヤク'],['N','しょっぱい水','ショッパイミズ',{part:1}],['N','ヴォルタ','ボルタ'],['N','塩水','シオミズ'],['A','塩水をしみこませた','シオミズオシミコマセタ'],['N','厚紙','アツガミ'],['A','厚紙に代えました。','アツガミニカエマシタ'],['N','カエルの体の中','カエルノカラダノナカ'],['A','ぬれている','ヌレテイル'],
],[{label:'丸い亜鉛の板',anchor:'シオミズオシミコマセタ',reason:'亜鉛は行29の画面欄で初出だが、この行の声では未発声（初発声は行31）。しみこませた厚紙を挟む組立の開始へ合わせる。'},{label:'丸い銅の板',anchor:'アツガミニカエマシタ',reason:'銅は行29の画面欄で初出だが、この行の声では未発声（初発声は行31）。厚紙に代えましたの組立の終わりへ合わせる。'}]);
R(30,'ぬらした指',[
 ['C','電気を感じる役','デンキオカンジルヤク'],['N','ぬらした自分の指','ヌラシタジブンノユビ'],['A','指に代えました。','ユビニカエマシタ'],['C','指は、カエルの足ほど敏感ではありません。','ユビワカエルノアシホドビンカンデワアリマセン'],
],[{label:'1組にさわっても何も起きない。',anchor:'ユビニカエマシタ',reason:'1組に触れる動作は声では言わない。指への置き換えの実演として、声の後の間で接触し無反応を保つ。'}]);
R(31,'電堆の柱',[
 ['N','ヴォルタ','ボルタ'],['N','亜鉛','アエン'],['N','塩水','シオミズ'],['N','厚紙','アツガミ'],['N','銅','ドオ'],['N','何十組','ナンジュックミ'],['A','何十組も重ねました。','ナンジュックミモカサネマシタ'],['C','重ねるほど、強くなった','カサネルホドツヨクナッタ'],['C','後編で開けます。','コオヘンデアケマス'],
],[{label:'ガラスの棒で支えた柱',anchor:'ナンジュックミモカサネマシタ',reason:'ガラスの支え棒は画面欄の形の指定で、この行の声で名は言わない。積む動きに合わせて支えを残す。'}]);
R(32,'電堆の上端・下端とぬらした指',[
 ['C','事実','ジジツ'],['C','1800年','センハッピャクネン'],['N','積んだ柱','ツンダハシラ'],['N','いちばん下','イチバンシタ'],['N','いちばん上','イチバンウエ'],['N','ぬらした指','ヌラシタユビ'],['A','指でさわると','ユビデサワルト'],['A','びりっときました。','ビリットキマシタ'],['A','両方の端をさわった','リョオホオノハシオサワッタ'],['A','全部の組を通った電気','ゼンブノクミオトオッタデンキ'],['A','指を通る','ユビオトオル'],['C','カエルは、どこにもいません。','カエルワドコニモイマセン'],
]);
R(33,'金の葉の検電器',[
 ['C','生き物でない道具','イキモノデナイドオグ'],['N','金の葉の検電器','キンノハノケンデンキ'],['N','電気','デンキ',{part:1,occ:1}],['A','電気がたまる','デンキガタマル'],['N','ガラスの瓶','ガラスノビン'],['N','2枚の薄い金の葉','ニマイノウスイキンノハ'],['A','離れて開く','ハナレテヒラク'],['N','電堆の端','デンタイノハシ'],['A','電堆の端につなぐ','デンタイノハシニツナグ'],['A','葉が開いた','ハガヒライタ'],
]);
R(34,'論理の筋と勝負の札',[
 ['N','指','ユビ'],['N','検電器','ケンデンキ'],['C','生き物ではありません。','イキモノデワアリマセン'],['C','予言と事実が合いません。','ヨゲントジジツガアイマセン'],['C','崩れたのは','クズレタノワ'],['N','この足','コノアシ'],['C','カエルの体の中から出ている','カエルノカラダノナカカラデテイル'],
],[{label:'判定 ×／言い伝え 0 − 4 実験',anchor:'クズレタノワ',reason:'0−4という数自体は声で言わない。凍結台本のscore.at=クズレタの時刻に判定と加点を同期する。'}]);
R(35,'ミオのひらめき顔（全画面）',[
 ['N','カエル','カエル'],['C','電気を出す係じゃなくて','デンキオダスカカリジャナクテ'],['C','電気を感じる係','デンキオカンジルカカリ'],
]);
R(36,'カエルの足の中の神経',[
 ['C','後に分かったこと','アトニワカッタコト'],['N','生き物の神経','イキモノノシンケイ'],['N','小さな電気','チイサナデンキ'],['A','合図を送っています。','アイズオオクッテイマス'],['N','ガルヴァーニ','ガルバアニ'],['C','全部がまちがいではなかった','ゼンブガマチガイデワナカッタ'],['C','崩れたのは','クズレタノワ'],
]);
R(37,'電堆',[
 ['N','ヴォルタ','ボルタ'],['N','積み重ね','ツミカサネ',{occ:0}],['N','電堆','デンタイ'],['C','電気の積み重ね','デンキノツミカサネ'],['N','電池','デンチ'],
],[{label:'行12 の乾電池と並べる。',anchor:'デンチ',reason:'乾電池を並べる動作は画面欄のみ。世界で初めての電池の説明へ同期する。'}]);
R(38,'手紙とヨーロッパの地図',[
 ['N','ヴォルタ','ボルタ',{occ:0}],['C','その年の3月','ソノトシノサンガツ'],['N','ロンドン','ロンドン'],['N','王立協会','オオリツキョオカイ'],['N','手紙','テガミ'],['A','手紙でこれを知らせました。','テガミデコレオシラセマシタ'],['C','ヴォルタ自身も会員','ボルタジシンモカイイン'],['C','前に賞も受けた','マエニショオモウケタ'],
],[{label:'ヨーロッパの地図の上を、イタリアからロンドンへ飛ぶ。',anchor:'テガミデコレオシラセマシタ',reason:'地図・イタリアから飛ぶという動作は画面欄だけ。手紙で知らせたの語の区間を飛行の開始・完了に用いる。'}]);
R(39,'ガラスの棒と電堆',[
 ['N','静電気','セエデンキ'],['A','ぱちっ','パチッ'],['C','一度で終わり','イチドデオワリ'],['N','電堆','デンタイ'],['C','ため直さなくても','タメナオサナクテモ'],['A','何度でもびりっときます。','ナンドデモビリットキマス'],['A','さわっている間','サワッテイルアイダ'],['A','びりびりが続きます。','ビリビリガツズキマス'],['N','ポンプ','ポンプ'],
],[{label:'ヴォルタの人形が、2回、3回とさわり、そのたびにびりっ。',anchor:'ナンドデモビリットキマス',reason:'2回・3回という数は声にはない。何度でもの声の区間に2〜3回の短い接触実演を配分し、後のさわっている間では接触を保つ。'}]);
R(40,'ミオのじと目（全画面）',[
 ['N','金属の板','キンゾクノイタ'],['N','塩水','シオミズ'],['A','くみ上げ続けられる','クミアゲツズケラレル'],
]);
R(41,'電堆の1組の板の継ぎ目',[
 ['N','電堆の1組','デンタイノヒトクミ'],['N','目に見えない粒','メニミエナイツブ'],['A','開けて見る','アケテミル'],['C','この回の後編で','コノカイノコオヘンデ'],
],[{label:'継ぎ目に、開きそうな線が光る（まだ開けない）。',anchor:'アケテミル',reason:'継ぎ目・光るという語は声にはない。開けて見るの語に光だけを同期し、実際の分解は行わない。'}]);
R(42,'かわいた厚紙の電堆',[
 ['C','今回の挑戦','コンカイノチョオセン'],['N','ヴォルタの電堆','ボルタノデンタイ'],['N','塩水の厚紙','シオミズノアツガミ'],['N','かわいた厚紙','カワイタアツガミ'],['A','かわいた厚紙をはさむ','カワイタアツガミオハサム'],['N','さわった指','サワッタユビ'],['C','びりっとくるでしょうか','ビリットクルデショオカ'],['C','この回の後編で','コノカイノコオヘンデ'],
]);
R(43,'カエルの足の模型',[
 ['N','カエルの足','カエルノアシ'],['A','ぴくっとさせた','ピクットサセタ'],['C','2種類の金属','ニシュルイノキンゾク'],['N','しょっぱい水','ショッパイミズ'],['C','来ていた','キテイタ'],
],[{label:'冒頭と同じぴくっを最後にもう一度',method:'final-return-window',start:c.duration-2,end:c.duration,reason:'最後1〜2秒の回収は画面欄と共通指示。最初の無声ぴくっを同じ動きで戻す。行43の「ぴくっ」の発声時刻とは別の終端回収。'}]);

const find=(row,needle,{occ=0,part}={})=>{
 const n=normKana(needle),regex=new RegExp(n.replace(/[ウオ]/g,'[ウオ]'),'g');
 const found=[];
 for(const q of cues.filter(q=>q.masterRow===row&&(!part||q.part===part))){
  const p=PT[q.subtitle];let m,cueOccurrence=0;regex.lastIndex=0;
  while((m=regex.exec(p.s))){const i=m.index,j=i+n.length;found.push({cue:q.diagram,part:q.part,occ:cueOccurrence++,rowOccurrence:found.length,lookupPart:part??null,originalKana:needle,normalizedKana:n,matchedKana:m[0],charStart:i,charEndExclusive:j,start:+(q.cap.start+p.t[i]).toFixed(6),end:+(q.cap.start+(j<p.t.length?p.t[j]:p.end)).toFixed(6),cueStart:q.cap.start,cueEnd:q.cap.end,method:'exact-phrase-clock-normalized-ou',fallback:false});if(regex.lastIndex===m.index)regex.lastIndex++;}
 }
 return found[occ]??null;
};
let flat=[];const mapped=[];
for(const row of rows){
 const spec=specs.get(row.row);if(!spec)throw Error('No row spec '+row.row);
 const qs=cues.filter(q=>q.masterRow===row.row);
 const rr={...row,primary:spec.primary,cueKeys:qs.map(q=>q.diagram),start:qs[0]?.cap.start??0,end:qs.at(-1)?.cap.end??2,events:[],screenOnlyFallbacks:[]};
 for(const [kind,label,kana,options={}] of spec.events){
  let event=find(row.row,kana,options);
  if(!event)event={cue:qs[0]?.diagram??null,part:qs[0]?.part??null,originalKana:kana,normalizedKana:normKana(kana),start:rr.start,end:rr.end,method:'row-window-unresolved',fallback:true,reason:'指定カナが実際のphrase-timesに見つからない。行の範囲だけを示し、語の実時刻として使わない。'};
  const e={id:`r${String(row.row).padStart(2,'0')}-${String(rr.events.length+1).padStart(2,'0')}`,row:row.row,kind,label,primary:spec.primary,...event};rr.events.push(e);flat.push(e);
 }
 for(const x of spec.screenOnly){
  const a=x.anchor?find(row.row,x.anchor):null;
  const e={id:`r${String(row.row).padStart(2,'0')}-screen-${rr.screenOnlyFallbacks.length+1}`,row:row.row,kind:'screen-only',label:x.label,primary:spec.primary,start:x.start??a?.start??rr.start,end:x.end??a?.end??rr.end,method:x.method??(a?'unspoken-object-tied-to-exact-spoken-anchor':'unspoken-object-row-window'),fallback:true,anchorKana:x.anchor??null,anchor:a??null,reason:x.reason};
  rr.screenOnlyFallbacks.push(e);flat.push(e);
 }
 mapped.push(rr);
}
const missing=flat.filter(x=>x.method==='row-window-unresolved');
const frozenAfter=F.immutableMediaFiles.every(f=>sha(f.path)===f.sha256)&&sha(F.script)===F.scriptSha256&&sha(F.master)===F.masterSha256;
const result={id:c.id,created:new Date().toISOString(),duration:c.duration,master:F.master,masterSha256:F.masterSha256,scriptSha256:F.scriptSha256,timingFilesUnchanged:frozenAfter,scope:'Frozen Nemo phrase clock lookup, not ear listening or forced audio alignment.',normalization:'Uses the unchanged normKana() and the same ウ/オ tolerance as wt(). Lexical ハ/ヘ are normalized by the shared mechanism. Foreign v names follow frozen Japanese b pronunciations.',endDefinition:'end is the next kana onset after the matched spelling, or phrase-times.end at cue end; it is an animation boundary and can include a following pause, not a measured last-phoneme offset.',counts:{masterRows:mapped.length,voiceCues:cues.length,totalEvents:flat.length,spokenExact:flat.filter(x=>!x.fallback).length,screenOnlyFallbacks:flat.filter(x=>x.kind==='screen-only').length,unresolvedSpoken:missing.length},unresolved:missing,rows:mapped,events:flat};
if(!frozenAfter)throw Error('Frozen files changed');
const jp=path.join(OUT,'word-events.json');fs.writeFileSync(jp,JSON.stringify(result,null,2));
const esc=s=>String(s).replaceAll('|','｜').replaceAll('\n',' ');
let md=`# B-2前編 cue・撮影語の表（S0）\n\n正本43行を再読し、凍結した70cueの phrase-times から抽出しました。総尺 ${c.duration.toFixed(3)}秒。台本・音声・字幕・時刻は変更していません。\n\n- 正確な照合：${result.counts.spokenExact}件。画面欄だけの物・動き：${result.counts.screenOnlyFallbacks}件。発声語が見つからないもの：${missing.length}件。\n- 開始は合成モーラ時計の語頭。終了は次のカナの語頭（またはcue内の声の終了）で、後続の間を含む場合があります。実耳・ASRによる語境界測定ではありません。\n- 「画面のみ」は、その物の名前をこの行では発声しないことを明示した予定です。アンカーの語頭へ合わせても、その物の発声確認に合格したとは扱いません。\n- t<2秒は無声・字幕なし。最後の2秒は冒頭と同じ足のぴくっへ戻る別の画面指定です。\n- 読みの照合は既存 normKana と wt と同じウ／オ許容を使います。外国語のvは凍結音声では日本語b音（ガルバーニ／ボルタ／パビーア）です。\n\n## 全70cueの撮影語\n\n| 正本行 | cue | 時間（秒） | 主役 | 発声に対応する物・動き（開始〜終了） |\n| --- | --- | --- | --- | --- |\n`;
md+='| 1 | 声なし | 0.000〜2.000 | 布をかぶった小さな台 | ぴくっは無声固定。カナに対応する時刻はありません。 |\n';
for(const q of cues){const rr=mapped.find(r=>r.row===q.masterRow);const ev=rr.events.filter(e=>e.cue===q.diagram);md+=`| ${q.masterRow} | ${q.diagram} | ${q.cap.start.toFixed(3)}〜${q.cap.end.toFixed(3)} | ${esc(rr.primary)} | ${ev.map(e=>`${esc(e.label)}（${e.start.toFixed(3)}〜${e.end.toFixed(3)}${e.fallback?'／未解決':''}）`).join('／')||'このcue固有の新しい物・動きはありません。前の状態を保ち、声の語を先取りしません。'} |\n`;}
md+='\n## 全43行：正本と画面の照合\n';
for(const r of mapped){md+=`\n### 行${r.row} ${r.scene}（${r.start.toFixed(3)}〜${r.end.toFixed(3)}秒）\n\n- 主役：${r.primary}\n- ナレーション原文：${r.narration}\n- 画面原文：${r.screen}\n`;
 if(r.events.length)md+='\n| 種類 | 正本の語・動き | 合わせるカナ | 開始〜終了（秒） | cue | 判定 |\n| --- | --- | --- | --- | --- | --- |\n'+r.events.map(e=>`| ${{N:'物',A:'動き',C:'札・意味'}[e.kind]} | ${esc(e.label)} | ${e.originalKana} | ${e.start.toFixed(3)}〜${e.end.toFixed(3)} | ${e.cue} | ${e.fallback?'未解決：語の時刻ではない':'実phrase時計に照合'} |`).join('\n')+'\n';
 if(r.screenOnlyFallbacks.length)md+='\n画面欄だけの予定（発声した物として数えない）：\n\n'+r.screenOnlyFallbacks.map(e=>`- ${e.label}：${e.start.toFixed(3)}〜${e.end.toFixed(3)}秒。${e.anchorKana?'アンカー `'+e.anchorKana+'`。':''}${e.reason}`).join('\n')+'\n';
}
md+='\n## 凍結の照合\n\n元の台本・音声・字幕時刻・正本のSHAは、抽出前後ですべて一致しました。JSON正本：'+jp+'\n';
fs.writeFileSync(path.join(OUT,'cue-撮影表.md'),md);
console.log(JSON.stringify({counts:result.counts,unresolved:missing.map(x=>({row:x.row,label:x.label,kana:x.originalKana})),files:[jp,path.join(OUT,'cue-撮影表.md')]}));
