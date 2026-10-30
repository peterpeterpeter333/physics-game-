# 問題編（全160問）の解説動画と問題アニメを作る担当の手順（2026-10-12）

作業ディレクトリ：`/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series`（全コマンドをここで実行。コミット・push しない）。
この手順書は、以前の `AGENT-問題解説.md`・`AGENT-問題解説-試作修正.md` に代わる。食い違うときはこちらに従う。

## 1. 何を作るか
1問につき次の2種類。アニメーションはすべてこちらで作る（ChatGPT には頼まない）。
1. **解説動画**（ナレーションつき、1280×760）：正本の「### 解説動画」の表を、1行＝1 cue（字幕）にして作る。
2. **問題アニメ**（無音の短い動画、1280×760、字幕の帯なし、最後は静止）：
   - `_出題`：正本の「#### 図・短いアニメーション（出題中）」の図。小問ごとに図が書いてある問題は、小問1の図。
   - `_小問n`：小問で条件を変える／小問ごとに図が書いてある場合の、小問n を出すときの図（n≥2）。
   - 出題中の図は「設定と与えた量だけ」。答え・正しい式・答えにつながる動き（例：前方で詰まる山の円）は描かない。
   - 各クリップは mp4 と、最後のコマの PNG を出す。

## 2. 正本と、日本語の扱い
- 正本：`~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/`（`00_このフォルダについて.md`、`01_共通の約束（ChatGPTへの指示書）.md`、`高校編/`、`大学編/`）。**必ず `01_共通の約束` を最初に全部読む。**
- 問題文・選択肢・ナレーション・札の文字は、正本のとおりに使い、変えない。正本の .md は編集しない。
  - 行頭の「（追加）」は制作上の印。字幕に出さない。
  - 字幕の折り返し（44字×3行）で数・式が割れるときは、**まず文の区切りで cue を2つに分ける**（文言は変えない。lint は「連続する cue をつなげて正本の行と一致」を認める）。それでも直らないときだけ最小限変え、cue に `textChange:'理由'` を書き、報告に「変更前→変更後」を書く。
  - 指示にない短い補助の札（例「両辺を ml で割る」）は足してよい。足したものは台本ファイル冒頭のコメントに書く。
- 以前の試作（`qx-*.mjs`、`yt1-qx-*-diagrams.mjs`）は図の参考にとどめる。内容が違うときは正本が優先。

## 3. 名前・ファイル（手で作らず `qx-name.mjs` で出す）
```
node scripts/umech/qx-name.mjs q-hs-w-doppler-1
```
で、正本の場所・ID・台本・図・キャッシュ・出力名が出る。規則：
- ID：`ys-qx-<問題IDから q- を除いたもの>`（例 `ys-qx-hs-w-doppler-1`、`ys-qx-um-pendulum`）
- 台本：`docs/video-revision-20260924/ytseries/qx-<同じ>.mjs`（`clips` と `problemClips` を export）
- 図：`scripts/umech/yt1-qx-<同じ>-diagrams.mjs`（キーは `qx-<同じ>:<名前>`。自動で読み込まれるので diagrams.mjs は編集しない）
- 共通部品：`scripts/umech/yt1-qx-common.mjs`（**編集しない**。足りない部品は報告で頼む）
- キャッシュ（厳守）：`EM_FILM_CACHE=/private/tmp/ys/ys-qx-<同じ>`。共有の `/private/tmp/ys/` 直下に書かない。一時ファイルもこの下に置く。
- 出力名の頭：高校 `高校_<動画番号>_<単元>_<n>`（n＝ID末尾の数）、大学 `大学_<NN>_<単元>_<初級|中級|上級>`（単元ファイルの 1問目＝初級・2問目＝中級・3問目＝上級。ID の ui/um/uc/ue では決めない）
- 出力先
  - 解説動画：`~/Downloads/physics-quest-youtube/問題編_解説/<頭>_解説.mp4`
  - 問題アニメ：`~/Downloads/physics-quest-youtube/問題編_問題アニメ/<頭>_出題.mp4`／`_出題.png`／`_小問n.mp4`／`_小問n.png`
  - ChatGPT 確認用：`~/Downloads/physics-quest-問題編_解説台本/`（`export-script-md.mjs` で書き出す）
  - 古い試作の mp4 を作り直したら、古い方を `~/Downloads/physics-quest-youtube/問題編_解説/旧版_試作/` へ移す（消さない）。

## 4. 見本（この2問を写して始める）
- 高校：`qx-hs-w-doppler-1.mjs` ＋ `yt1-qx-hs-w-doppler-1-diagrams.mjs`（元の単元動画の部品を import して使う例）
- 大学：`qx-um-pendulum.mjs` ＋ `yt1-qx-um-pendulum-diagrams.mjs`（左に図・右に説明の枠・誤答カードは枠の下、【カット割り】、実時間のアニメと「映像を一時停止」の例）

## 5. 画面の約束（共通部品 `yt1-qx-common.mjs`）
ステージは 1200×515（解説動画では左上に題と見出し、下に字幕の帯）。**札の帯 y＜78 には図を描かない。**
| 部品 | 使い方 | 見た目 |
|---|---|---|
| `goalTag(text)` | 小問の最初の cue で出し、その小問のあいだ出したまま | 左上・白枠「求めるもの：…」 |
| `answerTag(n,letter,value)` | 答えを声で言う cue で出す（声の文に合わせて `sentWin` で出す）。その小問の誤答の説明が終わるまで出したまま | 右上・黄枠「小問n の答え：X（値）」。長い値は自動で2行。値に式を使うときは `{tex:'…'}` |
| `answerRow([[n,X,値],…])` | まとめで答えの札を横に並べる | 右上に一列 |
| `wrongCard(X,値,理由,{mid})` | 誤答1枚。`mid` に誤答の計算（TeX）を入れられる | 赤い ×・灰色の文字「× 誤答 X：値」＋理由（1行か2行） |
| `wrongSeq(p,ctx,[[X,値,理由],…])` | 誤答を**1枚ずつ**。既定でナレーションの文ごとに切り替わる（`win` で区間を指定可） | 前のカードは次が出る前に消える |
| `kindTag('定義'｜'法則'｜'近似'｜'前提'｜'実験'｜'仮定'｜'結果',x,y)` | 種類のタグ | 色付きの丸い札（定義 黄・法則 緑・近似 橙・前提/仮定 灰・実験 白） |
| `pauseBadge()` | 映像を止める所（物体が止まったのではない） | 「‖ 映像を 一時停止」 |
| `legend([[文字,色],…],x,y)` | 単元動画と色が違う量があるとき | 色見本つきの凡例 |
| `note(text,x,y)` | 「大きく誇張」「省略して描いています」など | 灰色 22px |
| `QC` | 01_共通の約束の色（位置 x・𝐄・λ 水色／速度・電位 紫／加速度 赤／力・電流 緑／時間 金／エネルギー・𝐁 橙／運動量・電荷・振動数 桃／温度 黄緑／強調 黄） | |
| `card(x,y,w,h,inner,g,stroke)` | 紺の塗り・角の丸い枠 | |
時間の道具：`cueT(ctx)`（cue の中の秒）、`tAt(ctx,key)`（同じ場面でその cue が始まってからの秒。動きを cue をまたいで続ける）、`durOf(ctx,key)`、`sentWin(ctx)`（各文が読まれる区間 0〜1）、`voiceEnd(ctx)`、`isProblem(ctx)`（問題アニメで描いているとき true）。
- 一画面の主役は一つ。情報が多い行（【カット割り】）は、同じ cue の中で ①図で意味 → ②図を消して式を一段ずつ（→③図に戻る）と切り替える。文が2つなら、文の区切り（`sentWin`）で切り替える。
- 誤答カードは、正解の導出中に重ねない。答えの札を出してから。
- 前の条件の図・前の場面の矢印や数値は、場面が変わるときに消す。動いている量を一定値のまま表示し続けない。
- 文字は 22px 以上。`tex()` に日本語を入れない。英語を画面に出さない（記号・単位は可）。
- 色が共通の表と違う単元は、正本の指示どおり `legend` を出す。
- 別の場面に切り替わる cue には `cut:true`（画面がフェードする）。同じ図が続く cue には付けない。

## 6. 手順（ID と F を自分のものに）
```
Q=q-hs-w-doppler-1; node scripts/umech/qx-name.mjs $Q        # 名前の確認
ID=ys-qx-hs-w-doppler-1; F=docs/video-revision-20260924/ytseries/qx-hs-w-doppler-1.mjs; CACHE=/private/tmp/ys/$ID
HEAD=高校_303_ドップラー効果_1
export NEMO_URL=http://127.0.0.1:50123
PY="$HOME/Library/Application Support/physics-quest-tools/pyenv/bin/python"
FF="$HOME/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1"
# 1) 台本と図を書く（正本の表を1行＝1 cue。kana は最初は無しでよい）
node scripts/umech/qx-lint.mjs $F                                   # 字幕と正本の照合・折り返し・kana・problemClips（問題なし まで直す）
EM_FILM_CACHE=$CACHE node scripts/umech/build-experiment.mjs $F
python3 scripts/umech/check-readings.py $CACHE/plan.json --diff       # 「0 reading mismatches」。--diff の一覧も目で確かめる
python3 scripts/umech/prosody.py $CACHE/plan.json                     # kana の案 → 写して直す → 再実行で終了コード 0
# 2) 問題アニメ（無音）。--sheet で 1 秒ごとの一覧も作る → Read で見る
EM_FILM_CACHE=$CACHE node scripts/umech/render-problem-clip.mjs $F "$HEAD" --sheet
#    （確かめるだけのときは --out $CACHE/problem を付けて、Downloads に出さない）
# 3) 音声・ミックス・静止画の確認
EM_FILM_CACHE=$CACHE "$PY" scripts/render-em-film-audio.py $ID
EM_FILM_CACHE=$CACHE "$PY" scripts/umech/mix-audio.py $ID
EM_FILM_CACHE=$CACHE node scripts/umech/mxr-review.mjs              # $CACHE/review/page-*.jpg を全部 Read。直したらもう一度
EM_FILM_CACHE=$CACHE node scripts/umech/shots.mjs $ID 3:0.3 3:0.6 …  # 動きの途中のコマ（必要な所だけ）
# 4) 書き出しと機械確認
mkdir -p $CACHE/out; EM_FILM_CACHE=$CACHE FFMPEG="$FF" FILM_OUTPUT=$CACHE/out node scripts/render-all-films.mjs $ID
EM_FILM_CACHE=$CACHE node scripts/umech/qx-verify.mjs $ID $CACHE/out/$ID.mp4   # 終了コード 0 まで直す
#    → $CACHE/verify/sheet-*.jpg（1 秒ごとの全コマ）を **全部** Read で見る
cp $CACHE/out/$ID.mp4 ~/Downloads/physics-quest-youtube/問題編_解説/${HEAD}_解説.mp4
node scripts/umech/export-script-md.mjs ~/Downloads/physics-quest-問題編_解説台本 $F
```
- 長いコマンドは前面で実行する（バックグラウンドの待ちで止まらないように）。音声エンジン Nemo（127.0.0.1:50123）は共有。応答しないときだけ起動する。
- 字幕・読みを変えたら音声から作り直す。図だけを直したときは 3) の review と 4) だけでよい。
- 読み（reading）・kana の書き方は `AGENT.md` と `NOTES.md` の D 節。アルファベットの C は読みを「スィー」、kana は「スィ'イ」（check-readings と prosody が通る形）。18 は「じゅうハチ」。

## 7. 確認（全部やる。やっていないことを「確認した」と書かない）
1. `qx-lint` 問題なし（字幕＝正本、折り返しで数・式が割れない、全 cue に kana、problemClips）
2. `check-readings` 0、`prosody` 終了コード 0
3. `mxr-review` の全ページを Read（全 cue × 終わりの時点）
4. 問題アニメの `--sheet` 一覧を Read（答えを漏らしていないか、最後のコマが静止か）
5. `qx-verify`：デコード検査（-xerror）、動画と音声 JSON の長さ、声と字幕の時間の一致（声の始まり 0.35 s 以内・字幕の終わりを越えない・途中の無音 1.2 s 以下・後の無音は pause＋1 s 以下）、最後の声が動画の終わりより前に終わる、書き出した音声の 3.5 s 以上の無音（-40 dB）
6. `qx-verify` の 1 秒ごとの全コマ一覧（`verify/sheet-*.jpg`）を**全部** Read。見るもの：字幕と図・式・札の一致、答えの札は答えを言った後か、誤答カードは1枚ずつか、重なり・はみ出し・欠け、空の画面が長く続かないか、前の条件の図が残っていないか
7. 物理・数値を自分で検算し、台本ファイル冒頭のコメントに書く（正本の「### 検算」と一致させる）
- **耳では聞けない**（音声認識の道具がない）。報告に「耳での確認はしていない」と書く。

## 8. 報告（短く）
- 問題 ID・ID・長さ・出力パス（解説動画、問題アニメの各クリップ）
- 字幕を変えた所（cue の分割を含む。変更前→変更後）、足した札
- 確認したこと：lint／読み 0・prosody 0／review 何ページ／全コマ一覧 何枚（何秒間隔）／qx-verify の結果（一致した cue 数・無音）／デコード検査
- 確認していないこと：耳での聴取、スマホでの見え方、初学者の視聴
- 共通部品で足りなかったもの・正本の疑問点（正本は直さず、指摘として書く）

## 9. 量産で気をつけること（試作2問で分かったこと）
- 正本の1行が2文で、2文目に長い式・数（`T＝2π/ω＝2π√(l/g)`、`V＝340 m/s`）があると、字幕の折り返しで割れやすい。lint で見つけ、文の区切りで cue を分ける。
- 答えの札・求めるもの札は上の帯に置くので、以前の試作の図（上端 y＝0〜60 に枠や式を置いていた）は、そのままでは重なる。図を 80px ほど下げるか、枠を札の間（中央）に置く。
- 2文の行で「2文目で札・カードを出す」ときは `sentWin(ctx)` で区間を取る（p の決め打ちだと声とずれる）。
- 実時間で動かす行（例：振り子 4往復 12.6 s）は、cue の `pause` で字幕を出したままにして長さを確保し、止める所で `pauseBadge`。
- 最初の文が短い cue（「小問1 の答えは C です。」など）は数秒しかないので、図は前の cue の続きにして、札だけを足す。
- 1問の目安：台本と図 2〜3時間（図を作り直す量による）、音声 5〜10分、書き出し 5〜8分（3〜4分の動画で）、確認（全コマ一覧 12〜15枚の目視と直し）1時間前後。

## 追記（2026-10-13、量産中に分かったこと）
- **図ファイルは壊れたまま置かない**：scripts/umech/ の図ファイルは全員の build で自動に読み込まれる。構文エラーのファイルがあると、全員の書き出しが止まる。図ファイルは別名（例 `*.tmp.mjs`、読み込まれない名前）で書いて `node --check` で通してから、正式の名前に移す。
- **答えの札**：各小問のあいだ右上に1枚出し、まとめで横に並べる（見本どおり）。正本の「下に積む」は、この形で読み替える。
- **直しを入れたら**：その動画の全コマ一覧を、直した後の版で全部見直す（一部だけで済ませない）。
- **キャッシュ**：試しの書き出しも含めて、必ず自分の ID のフォルダに出す。
- **上付きの数字・符号**（10⁻⁴ など）：2026-10-13 から anim.mjs の label が、上付きの文字を「小さく持ち上げたふつうの数字・符号」で描くようになった（以前は ⁻ がほとんど見えず 10⁴ と読めた）。自前の回避（fixSup など）は不要。TeX の式はそのままでよい。
- **さらに担当を立てない**：1人で、担当の単元の問題を順に作る（音声エンジンが1台なので、並列を増やしすぎない）。
- **answerRow** の項目は、値がないときも [n,'C',''] と3つ目を空文字で渡す（undefined と出るため）。
