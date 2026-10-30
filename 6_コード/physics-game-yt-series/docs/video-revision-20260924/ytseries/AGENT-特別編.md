# 特別編「GPS と相対性理論」を作る担当への注意（AGENT.md の読み替え）

- 作業ディレクトリ：/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series（ここで全コマンドを実行。コミット・push しない）
- まず読む：`AGENT.md`（手順・道具）、`NOTES.md`、`yt1min/STANDARD.md`、見本として `hs-a-nucleus-3.mjs` と `scripts/umech/yt1-hs-a-nucleus-3-diagrams.mjs`（台本と図の書き方、読み・kana の付け方）。
- ナレーション：`~/Downloads/physics-quest-特別編_台本/GPSと相対性理論_動画版_ナレーション.md` の担当パート。**字幕の文は原則そのまま使う**（数値・事実は検算済みなので変えない）。kana の都合などでどうしても変えるときは最小限にし、報告に書く。1 cue ＝ 表の1行（最大2文）。字幕は 44 字幅×3行以内。「画面：」の指示に従って図を描く。指示のない cue も、前後の図を保つか、内容に合う図を出す（空にしない）。
- 4つのパートは、最後に1本の約20分の動画につなぐ。だから：
  - タイトルは全パート共通の「あなたのスマホは、毎日アインシュタインを使っている」にする。
  - 見出しは「特別編・GPS と相対性理論 <N>/4 ｜ <場面名>」にする。
  - パート2〜4は「前回の問い」の場面を作らず、いきなり本文から始める。
  - 最後の cue の pause は 1.0 秒前後にする。パート4の最後だけ 2.0 秒にする。
- ID・ファイル・場所
  - ID：`ys-sp-gps-<N>`
  - 台本：`docs/video-revision-20260924/ytseries/sp-gps-<N>.mjs`
  - 図：`scripts/umech/yt1-sp-gps-<N>-diagrams.mjs`
  - 他のパートのファイルは読んでよいが、編集しない。他の担当と同時に作業している。
  - 共通の部品（地球・衛星・時計）は、自分の図ファイルの中に描く。
- 見た目の約束（他パートとそろえる）：
  - 地球は青い円。衛星は金色の本体に、青い太陽電池板。
  - 時計はアナログの顔に「地上」「衛星」の札。
  - 色：c・v は紫（C.v）、時間 t は金（C.t）、x・y・z は水色（C.x）、b は金、力は緑（C.F）、加速度 a は赤（C.a）。
  - 衛星の時計が「遅れる」は、青 #6f9dff の下向き矢印と「−」。「進む」は、赤の上向き矢印と「＋」。差は黄（C.hi）。
  - 定義・原理・実験・近似のタグは、大学編と同じ見た目にする。
- **キャッシュ（厳守）**：すべてのコマンドで `EM_FILM_CACHE=/private/tmp/ys/ys-sp-gps-<N>`（$CACHE）を指定する。共有の `/private/tmp/ys/` 直下には書かない。前回、ID を付け忘れて共有の場所を汚した事故があった。自分用の道具フォルダは `/private/tmp/ys/tools-sp-gps-<N>`。
- 手順：build → check-readings 0 → prosody 終了0 → 音声 → ミックス → mxr-review。
  - review は全ページを Read する。
  - 動く図は、cue の途中のコマを shots.mjs で確かめる。
  - 書き出し → ffmpeg -xerror。
- 出力：`~/Downloads/physics-quest-youtube/特別編/特別編_GPS_<N>_<パートの題>.mp4`。パートの題は、ナレーション表の「パートN/4『…』」の題。
- ChatGPT 確認用：最後の review の後に、次を実行する。
  `node scripts/umech/export-script-md.mjs ~/Downloads/physics-quest-特別編_台本/台本 docs/video-revision-20260924/ytseries/sp-gps-<N>.mjs`
- 音声エンジン Nemo（127.0.0.1:50123）は共有。応答しないときだけ、`cd "$HOME/Library/Application Support/physics-quest-tools/nemo" && nohup ./run --host 127.0.0.1 --port 50123 > ../nemo.log 2>&1 &` で起動する。長いコマンドは前面で実行する。
- Python の文字列経由で JS を書くと、TeX のバックスラッシュが半分になる。TeX が表示されることを必ず確かめる。
- 読み：数字の読み方に注意する。
  - 「10.22999999543」は「じゅってん に に きゅう きゅう きゅう きゅう きゅう きゅう ご よん さん」（小数点以下は 2,2,9,9,9,9,9,9,5,4,3 の11桁）のように、桁を一つずつ読む。
  - 「91億9263万1770」は「きゅうじゅういちおく きゅうせん にひゃく ろくじゅうさんまん せん ななひゃく ななじゅう」と読む。
  - 「NTS-2」は「エヌティーエス ツー」、「μs」は「マイクロびょう」、「ns」は「ナノびょう」と読む。
  - 人名「ハーフェレ」「キーティング」は、カタカナのまま読む。
- 報告（短く）：次のことを書く。
  - ID・長さ・出力パス
  - 字幕を変えた所
  - 確認したこと／していないこと
  - 図で工夫した所

## v2（2026-10-06 作り直し：v1 は難しすぎた）
- ナレーション：`~/Downloads/physics-quest-特別編_台本/GPSと相対性理論_動画版v2_ナレーション.md`。冒頭の「v2 の方針」を必ず読む。難しさは★1→★4 と少しずつ上げる。式は、パート3の「ボスの式」と、パート4の言葉の式だけ。
- ID：`ys-sp-gps2-<N>`。台本 `sp-gps2-<N>.mjs`、図 `yt1-sp-gps2-<N>-diagrams.mjs`。キャッシュ `/private/tmp/ys/ys-sp-gps2-<N>`、道具 `/private/tmp/ys/tools-sp-gps2-<N>`。
- v1 の図（`yt1-sp-gps-1〜4-diagrams.mjs`）は import して再利用してよい（編集はしない）。v1 の台本・動画は消さない。
- クイズ cue：「Q.」カード＋選択肢＋カウントダウンの輪、pause 2.5〜3.5 秒。答えの cue で正解の選択肢を光らせる。
- 階段（★1〜★4）の小さな表示を、各パートの始まりと終わりに出す（いまの段が光る）。
- 出力：`~/Downloads/physics-quest-youtube/特別編/v2/特別編v2_GPS_<N>_<パートの題>.mp4`。ChatGPT 用の書き出し先：`~/Downloads/physics-quest-特別編_台本/台本v2`。

## v3「疑問20連発」（2026-10-06：v2 を小さな疑問→解決→次の疑問 の20本に）
- ナレーション：`~/Downloads/physics-quest-特別編_台本/GPSと相対性理論_疑問20連発_ナレーション.md`。冒頭の「形」を必ず読む。
- 1つの Q ＝ 1本の動画。ID `ys-sp-gpsq-<NN>`（01〜20）。台本 `sp-gpsq-<NN>.mjs`、図 `yt1-sp-gpsq-<NN>-diagrams.mjs`（担当内で共通の部品を1ファイルにまとめたいときは `yt1-sp-gpsq-<担当A〜D>-common.mjs` を使ってよい）。キャッシュ `/private/tmp/ys/ys-sp-gpsq-<NN>`、道具 `/private/tmp/ys/tools-sp-gpsq-<担当>`。
- タイトル：「疑問20連発：あなたのスマホは、毎日アインシュタインを使っている」。見出し：「Q.<n> ｜ <問いの短い形>」。
- v1・v2 の図（`yt1-sp-gps-N`、`yt1-sp-gps2-N`）は import して再利用してよい（編集しない）。
- 画面上部の Q1〜Q20 の点の列と★は、全担当で同じ見た目にする：画面上の右寄り、直径 12px の点を 20 個、間隔 22px。解いた Q は水色の塗り、いまの Q は黄色の輪で光る、未来の Q は灰の輪。その左に「★★」のような難しさ。
- Q カード（各本の最初の cue）：中央に大きく黄色の「Q.n」、その下に白で問いの文。pause 0.8 秒。橋の cue（最後）：右下に「次の疑問 →」、pause 0.6 秒（Q20 の最後だけ 2.0 秒）。
- 出力：`~/Downloads/physics-quest-youtube/特別編/v3/特別編v3_Q<NN>_<問いの短い形>.mp4`。ChatGPT 用：`~/Downloads/physics-quest-特別編_台本/台本v3`。
