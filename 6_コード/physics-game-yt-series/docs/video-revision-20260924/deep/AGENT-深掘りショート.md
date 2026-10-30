# 深掘りショート（縦長・約3分）を1本作る担当への手順書

2026-10-15。01「水に入れたストローは、なぜ折れて見える？」（ys-deep-01）を作ったときの仕組みと手順。02〜05 はこれだけ読めば作れるように書く。

- 作業ディレクトリ：`/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series`（ここで全コマンドを実行。コミット・push しない。アプリのコードは触らない）
- 音声エンジン Nemo（127.0.0.1:50123）は共有。応答しないときだけ `cd "$HOME/Library/Application Support/physics-quest-tools/nemo" && nohup ./run --host 127.0.0.1 --port 50123 > ../nemo.log 2>&1 &`。長いコマンドは前面で実行する。

## 1. まず読むもの
1. ナレーション（正本）：`docs/video-revision-20260924/deep/深掘りショート_01-05_光と虹_ナレーション.md` の冒頭「全体の約束」と自分の番号の表・検算。前後の番号も読む（最初の問い＝前の本の最後の問い）。
2. 見本（01）：台本 `docs/video-revision-20260924/ytseries/sp-deep-01.mjs`、図 `scripts/umech/yt1-sp-deep-01-diagrams.mjs`、共通部品 `scripts/umech/yt1-sp-deep-common.mjs`。
3. 読み・kana の書き方：`docs/video-revision-20260924/yt1min/AGENT.md` の「読み・アクセント」、`docs/video-revision-20260924/ytseries/NOTES.md` の D 節。

## 2. ファイル・ID（NN は 02〜05）
| もの | 場所 |
|---|---|
| ID | `ys-deep-NN` |
| 台本 | `docs/video-revision-20260924/ytseries/sp-deep-NN.mjs` |
| 図 | `scripts/umech/yt1-sp-deep-NN-diagrams.mjs`（キーは `deepNN-<組>:<名前>`。自動で読み込まれるので diagrams.mjs は編集しない） |
| キャッシュ | `EM_FILM_CACHE=/private/tmp/ys/ys-deep-NN`（自分専用。一時スクリプトは `/private/tmp/ys/ys-deep-NN/tools/`） |
| 動画 | `~/Downloads/physics-quest-youtube/深掘りショート/NN_<題名から「？」を除いたもの>.mp4`（例：`01_水に入れたストローは、なぜ折れて見える.mp4`） |
| ChatGPT 用 | `node scripts/umech/export-script-md.mjs ~/Downloads/physics-quest-特別編_台本/深掘りショート <台本>` |

- 他の回のファイルは読んでよいが編集しない（共通部品 `yt1-sp-deep-common.mjs` と 01 の図は import して使う。足りない部品は自分の図ファイルに書く）。
- **図ファイルは壊れたまま置かない**：scripts/umech/ の図ファイルは全員の書き出しで自動に読み込まれる。必ず `*.tmp.mjs` で書いて `node --check` を通してから正式の名前に移す（直すときも、写し→直す→check→移す）。

## 3. 台本の書き方
```js
import {D,S} from '../umech/schema.mjs';
const K='deepNN-';
export const clips=[{
  id:'ys-deep-NN',
  visualPilot:'vert-v1',                 // 縦長。これが無いと横長（umech-v1）になる
  series:'深掘りショート NN ｜ 光と虹',   // 画面の一番上の小さな行
  title:'<正本の見出しの「」の中そのまま>',
  condition:'…',
  scenes:[ S('<正本の「場面」欄そのまま>', D(字幕, 読み, K+'組:名前', {kana, lines, pause, sfx, cut}), …), … ],
}];
```
- **1行＝1 cue**。字幕は正本のナレーション欄と一字一句同じ。正本で同じ「場面」が続く行は、1つの `S()` にまとめる。
- 字幕は 1行 約18字（18.3 字幅、半角は 0.55）× **4行まで**。収まらないとき、または収まっても語の途中で割れて読みにくいときだけ、**文の区切り（。）で cue を分ける**（文言は変えない）。01 では 11行目と13行目を2つに分けた。
- `lines:['…','…']`：字幕の行の折り方を自分で決める（つなぐと字幕と同じでないとエラー）。語の途中・数字の途中で割らない。付けなければ自動で折る（`frame-vert.mjs` の `wrapJa`）。
- `pause`：声の後の間（秒）。動きを見せたい cue は 1.0〜1.3、最後の cue は 2.0。長さは 2:40〜3:30（01 は 2:48）。
- `sfx`：`[['whoosh',0]]`（場面の切り替え）、`[['ding','e+0.05']]`（答え・大事な結果）、最後に `[['chime','e+0.05']]`。1本に数個まで。
- `cut:true`：前と全く別の絵に切り替わる cue に付ける（0.35 秒で絵がフェードする）。キーの `:` の前（組）が同じ cue が続く間は、絵がつながり、`ctx.tg`（組が始まってからの秒）で動きを続けられる。
- 台本の冒頭のコメントに、cue の分割・図のために決めた値・検算を書く（export-script-md がそのまま ChatGPT 用に書き出す）。

## 4. 縦長の画面（frame：`scripts/umech/frame-vert.mjs`、visualPilot `'vert-v1'`）
画面 1080×1920。割り付けは frame が描く（図ファイルは舞台の中だけを描く）。
| y（画面） | 中身 |
|---|---|
| 0–110 | 空ける（ショートの上の操作） |
| 140 | シリーズ名（`series`、36px、灰） |
| 205 / 270 | 題（`title`、52px 太字、2行まで。自動で「、」の後で折る） |
| 296–348 | 場面の札（`S()` の見出し、36px 黄）と「n / 全場面数」 |
| **372–1292** | **図の舞台 1000×920**（x 40–1040）。図は `viewBox 0 0 1000 920`、1単位＝1px |
| 1312 | 区切り線 |
| 1372–1564 | 字幕 48px、行送り 64px、4行まで、x 60–940 |
| 1690 | 「音声：VOICEVOX Nemo 男声1」（36px、灰） |
| 1904–1914 | 進み具合の細い棒 |

- **隠れやすい所**：右端（画面 x>940、y 900–1700 の操作ボタン）と下端（y>1600 の題名・チャンネル名）。舞台の中では、**舞台 y>560 のところは x<900 に大事な物を置かない**。舞台の左上 (40,60) あたりは空いている（01 では「実験」の札は右上 (960,60) に置いた）。
- **文字は最小 36px**（舞台の中も）。図の中の大事な語は 38〜48px、最後の問いのカードは 56〜60px。注記（「大きく誇張」「動きは ゆっくりに しています」）も 36px。図を縮めて置くときは、中の文字が 36px より小さくならないようにする（小さくなる札は消す）。
- 英語を画面に出さない（単位 m・km・nm、記号は可）。`tex()` に日本語を入れない。
- 色（1分の疑問と同じ系統、`anim.mjs` の `C`）：背景 `C.bg`、強調 黄 `C.hi`、光の線 `LIGHT`（#fff1b8）、水 `WATER`／水面 `SURF`、空気は暗いまま。速さ・時間など量の色は大学編と同じ（v 紫、t 金…）。光の色そのものを描くときは、赤 #ff4b3e・青 #3f8cff・紫 #a274ff（空はなぜ青いと同じ）。
- 演出は控えめに：フェード・線を描いていく・数字が動く、まで。効果音も少なく。

### 図の関数
```js
// scripts/umech/yt1-sp-deep-NN-diagrams.tmp.mjs で書いて node --check → yt1-sp-deep-NN-diagrams.mjs へ
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,WATER,SURF,GLASS,N_WATER,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard,eye,snellR,surfacePoint,apparent} from './yt1-sp-deep-common.mjs';
export const deepNNDiagrams={ 'deepNN-組:名前':(p,ctx)=>svg, … };
```
- `ctx = {t, dur, k, cue, clip, scene, tg, W:1000, H:920}`。`vseg(ctx,p,a,b)`＝声の割合 a〜b の進み（0→1）、`swin(ctx,p,i,a,b)`＝i 番目の文の中の割合 a〜b（2文の cue で文に合わせて出すとき）。声より先に答えを出さない（その語を言う文の窓で出す）。
- 共通部品（`yt1-sp-deep-common.mjs`）：`tag('実験'|'仮説'|'予想'|'仮定'|'定義'|'結果'|'今の値',x,y,{text,anchor})` 種類の札（暗い板つき）、`note(text,x,y)` 灰の注記、`plate(text,x,y)` 図の上に重ねる文字（暗い板つき）、`bigQ(x,y,g)` 大きな「？」、`finalCard(lines,g,{y,size})` 最後の問い（黄の枠）、`eye(x,y,向き)` 目、`snellR(i)` 曲がった後の角（n＝1.33）、`surfacePoint(物,目,水面y)` 光が水面で曲がる点（二分法）、`apparent(物,目,水面y)` 見かけの位置。
- 01 の図から使い回せる形（`import {strawScene,coinScene,snellFigure,waveFronts,onRay,SN,CUP} from './yt1-sp-deep-01-diagrams.mjs'`）：コップとストロー、茶わんとコイン、円と縦の線（横のずれ・比 1.33）、光の列（波の山の線）が水面で向きを変える図。02 の「前回の列が向きを変える図」、05 の振り返りに使える。**他の図ファイルを `export *` しない**（自動読み込みは各ファイルが export した「関数の入った object」を全部登録するので、01 の `deep01Diagrams` を再 export するとキーが重複して全員の書き出しが止まる）。名前を指定して import するだけにする。
- 「定義・実験・仮説・導いた結果」を札で区別する（01：茶わんとコイン＝実験、「はず」＝予想、表＝今の値）。誇張して描く所には `note('… 大きく誇張',…)`。

## 5. 読み（reading）と kana
- reading：ひらがな（外来語はカタカナ）、文節ごとに半角スペース、漢字を残さない、数字も読みで書く（1.33＝いってんさんさん、984年＝きゅうひゃくハちじゅうよねん）。語頭の「は」はハ（ハいる、ハかる、ハやさ、ハず）。助詞の「へ」が句の途中にあるときは「え」と書く（よこえの ずれ）。
- kana：まず kana なしで build → `prosody.py` の案を写して直す。**すべての句に `'` が1つ**。数字の途中で句を切らない。長音の綴りはエンジンに合わせる（01 では「表に」が ヒョウニ）。
- 字幕・読み・pause を変えたら音声から作り直す。図だけ直したときは review と書き出し・確認だけでよい。

## 6. コマンド一式（ID・F・NN を自分のものに）
```
NN=02; ID=ys-deep-$NN; F=docs/video-revision-20260924/ytseries/sp-deep-$NN.mjs; CACHE=/private/tmp/ys/$ID
export NEMO_URL=http://127.0.0.1:50123
PY="$HOME/Library/Application Support/physics-quest-tools/pyenv/bin/python"
FF="$HOME/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1"
node --check scripts/umech/yt1-sp-deep-$NN-diagrams.tmp.mjs && mv scripts/umech/yt1-sp-deep-$NN-diagrams.tmp.mjs scripts/umech/yt1-sp-deep-$NN-diagrams.mjs
node scripts/umech/deep-lint.mjs $F                              # 字幕＝正本・場面・題・4行・lines・kana・図のキー →「問題なし」
EM_FILM_CACHE=$CACHE node scripts/umech/build-experiment.mjs $F
python3 scripts/umech/check-readings.py $CACHE/plan.json --diff   # 0 reading mismatches（--diff の一覧も目で確かめる）
python3 scripts/umech/prosody.py $CACHE/plan.json; echo $?        # 終了コード 0
EM_FILM_CACHE=$CACHE "$PY" scripts/render-em-film-audio.py $ID    # 音声（声の長さが決まる）
EM_FILM_CACHE=$CACHE "$PY" scripts/umech/mix-audio.py $ID         # BGM・効果音
EM_FILM_CACHE=$CACHE node scripts/umech/mxr-review.mjs            # 全 cue の終わりのコマ → $CACHE/review/page-*.jpg（8枚／ページ）を全部 Read
EM_FILM_CACHE=$CACHE node scripts/umech/shots.mjs $ID 4:0.5 15:0.3 # 途中のコマ（仮の時間で）→ $CACHE/shots.jpg
mkdir -p $CACHE/out; EM_FILM_CACHE=$CACHE FFMPEG="$FF" FILM_OUTPUT=$CACHE/out node scripts/render-all-films.mjs $ID   # 3分で約1分
EM_FILM_CACHE=$CACHE node scripts/umech/qx-verify.mjs $ID $CACHE/out/$ID.mp4; echo $?   # 終了コード 0 まで直す
#   → $CACHE/verify/sheet-*.jpg（1秒ごとの全コマ、10枚／一覧、3分で17枚）を **全部** Read
mkdir -p ~/Downloads/physics-quest-youtube/深掘りショート
cp $CACHE/out/$ID.mp4 "$HOME/Downloads/physics-quest-youtube/深掘りショート/${NN}_<題名から？を除く>.mp4"
node scripts/umech/export-script-md.mjs ~/Downloads/physics-quest-特別編_台本/深掘りショート $F
```
- qx-verify（縦長も可）がやること：デコード検査（-xerror）、動画と音声 JSON の長さ、声と字幕の時間の一致（声の始まり 0.35 s 以内・字幕の終わりを越えない・途中の無音 1.2 s 以下・後の無音は pause＋1 s 以下）、最後の声が動画の終わりより前、書き出した音声の 3.5 s 以上の無音（-40 dB）、1秒ごとの全コマ一覧。

## 7. 確認（全部やる。やっていないことを「確認した」と書かない）
1. `deep-lint` 問題なし／`check-readings` 0／`prosody` 終了 0
2. `mxr-review` の全ページを Read（全 cue の終わりのコマ）
3. `qx-verify` 終了 0、1秒ごとの全コマ一覧を**全部** Read。見るもの：字幕と図・札の一致、答えより先に答えを描いていないか、重なり・はみ出し・欠け、36px 未満の文字、右端・下端に大事な物がないか、空の画面が長く続かないか、前の場面の物が残っていないか。
4. **直したら、直した後の版で review と全コマ一覧を全部見直す**（一部だけで済ませない）。
5. 物理・数値を自分で検算し、台本冒頭のコメントに書く（正本の「検算」と一致させる）。
- 耳では聞けない（音声認識の道具がない）。報告に「耳での確認はしていない」と書く。スマホ実機での見え方も未確認と書く。

## 8. 仕組み（参考：01 の担当が作った／変えたもの）
- 新規：`scripts/umech/frame-vert.mjs`（縦長の frame、`vertFrame`・`wrapJa`・`captionRows`・寸法）、`scripts/umech/yt1-sp-deep-common.mjs`（共通部品）、`scripts/umech/deep-lint.mjs`（台本の機械確認）。
- 既存に足した分岐（横長の出力は1ピクセルも変わらない。ys-sp-1min-sky で plan.json・review・shots・mp4（バイト単位）・qx-verify の一覧が変更前と同一なのを確認済み）：
  - `scripts/render-all-films.mjs`：`vertFrame` を最初に試す／vert-v1 の renderKey に scripts/umech/*.mjs を含める／書き出しの大きさを vert-v1 のときだけ 1080×1920（他は 1280×760 のまま）。
  - `scripts/umech/build-experiment.mjs`：clip の `visualPilot`（無ければ従来の umech-v1）と `series` を plan に渡す。
  - `scripts/umech/shots.mjs`・`scripts/umech/mxr-review.mjs`：vert-v1 のときだけ縦長の一覧（shots 540×960 を3枚／列、review 480×853 を8枚／ページ、review フォルダは作り直す）。
  - `scripts/umech/qx-verify.mjs`：動画が縦長のときだけ、一覧のコマを 360×640・5×2 にする。

## 9. 報告（短く）
ID・長さ・出力パス、字幕の分割（どの行をどこで分けたか）、図のために決めた値、確認したこと（lint／読み 0・prosody 0／review 何ページ／全コマ一覧 何枚／qx-verify の結果／デコード検査）、確認していないこと（耳・スマホ実機・初学者の視聴）、代表のコマ数枚のパス（`$CACHE/verify/sheet-NN.jpg` と時刻）、正本への疑問点（正本は直さず指摘として書く）。
