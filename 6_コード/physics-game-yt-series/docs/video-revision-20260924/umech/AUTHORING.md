# 大学力学・映像の作り直し（umech-v1）執筆ガイド

大学力学の動画 43 本（メイン30本・橋渡し8本・発展5本）を、偏差値30の学生が見て分かる 3Blue1Brown 型の映像に作り直すための約束。
見本は単元1（`newton.mjs` と `scripts/umech/newton-diagrams.mjs`）。

## ファイル

| 役割 | 場所 |
|---|---|
| 台本（字幕・読み・画面の指定） | `docs/video-revision-20260924/umech/<topic>.mjs` が `export const clips=[...]` |
| 図（アニメーション） | `scripts/umech/<topic>-diagrams.mjs` が `export const <topic>Diagrams={...}` |
| 共通部品（編集しない） | `scripts/umech/anim.mjs`（図形・矢印・グラフ・TeX）、`frame.mjs`（画面の組み立て・式の変形）、`schema.mjs`（D/E/S） |
| 計画 | `EM_FILM_CACHE=/private/tmp/umech-<topic> node scripts/umech/build-plan.mjs <ids>` |
| 読みの検査 | `python3 scripts/umech/check-readings.py /private/tmp/umech-<topic>/plan.json --diff` |
| 絵コンテ | `EM_FILM_CACHE=... node scripts/umech/storyboard.mjs /private/tmp/umech-<topic>/sb` |
| 音声（Nemo） | `EM_FILM_CACHE=... /private/tmp/physics-video-review-env/bin/python scripts/render-em-film-audio.py <ids>` |
| 映像 | `EM_FILM_CACHE=... FFMPEG=<ffmpeg> FILM_OUTPUT=<dir> node scripts/render-all-films.mjs <ids>` |

ID は既存の `lesson-video-catalog` の ID をそのまま使う（アプリは `revised-video-catalog` の同じ ID で差し替える）。

## 台本の書き方

- 一本は3場面、1場面3〜4文（cue）。全体でおよそ70〜100秒。
- 題名は「問い」。答えを知りたくなるフックにする。冒頭を「今回は、〜を確かめます」で始めない。「私たちは」を使わない。
- 1文に1つの考え。字幕は1 cue で最大3行（1行44字）を超えると描き出しが止まる。1 cue は **2文まで**（`build-plan.mjs` とテストが止める）。目安は90字以内。
- 数値・記号・条件は、その動画の `stageId` のレッスン本文（初級 `levels/intro-mechanics.ts`・中級 `levels/middle-mechanics.ts`・上級 `univ-mechanics.ts`、自動生成段は `levels/completion.ts` と `university-curriculum.ts`）にそろえる。
- 新しい記号は、初めて出たときに声で読み、意味を言う（例:「オメガ、つまり一秒あたりに回る角度」）。
- 同じ音に聞こえる記号を避ける：振幅 A と加速度 a →「振幅」と言う。G と g →「大文字のジー（万有引力定数）」。運動エネルギー K とばね定数 k を同じ文で使わない。
- トルクはレッスンと同じ **N**。初出で「トルク エヌ。力の単位のニュートンとは別物」と言う。空気抵抗の係数はレッスンと同じ **k**。
- 高校で扱っていないもの（垂直抗力・張力・摩擦の描き方、力のモーメント、ω・ラジアン、反発係数、慣性力）は、使う前に一言で橋渡しする。
- 物理を正しく。数値は必ず検算する。

## 読み（ふりがな）

- `reading` はひらがな（外来語・記号はカタカナ）で、**文節ごとに半角スペース**。スペースは音声では間にならない。
- 「は」「へ」は文節の最後に置けば助詞（ワ・エ）として読まれる。語の途中の「へ」「は」は、前後にスペースを入れない（例:「へいほう」）。
- Nemo は語頭の「は」を助詞として「ワ」と読むことがある（数字の「はち」→ワチ）。数字の 8 は「ハチ」とカタカナで書く。「はば」なども検査で引っかかったら言い換える。
- アルファベットの c は Nemo の発音に合わせ「スィー」と書く。
- 漢字を残さない。数字は読みで書く（0.5→れいてんご、2.25→にてん にご、10→じゅう）。単位も読む（メートル、まいびょう、ニュートン、キログラム、ジュール）。
- 記号の読み：v ブイ、v₀ ブイゼロ、x エックス、a エー、F エフ、m エム、t ティー、g ジー、ω オメガ、θ シータ、I アイ、L エル、p ピー、k ケー、U ユー、N エヌ、Δ デルタ、π パイ。
- `check-readings.py` の `[READING]` が 0 件になるまで直す。`--diff` の一覧（漢字のまま読ませた場合との差）は、こちらの読みが正しいかを目で確かめる。

## 画面の作り方（3Blue1Brown 型）

- 画面は 1200×515。文字は 22px 以上。はみ出し・重なりを出さない。英語を画面に出さない。`tex()` に日本語を入れない（ラベルは `label()`）。
- 仕組みを動きで見せる：矢印が伸びる、面積が塗られる、点が軌跡を描く、図形が組み変わる。静止画を続けない。
- 同じ図を続ける場面は、キーを `'group:段階'` にする（例 `nw-v:first` → `nw-v:stack`）。グループが同じなら画面は切り替わらず、続きとして動く。
- 色は量ごとに固定（`C`）：位置・距離 `C.x`（水色）、速度 `C.v`（紫）、加速度 `C.a`（赤）、力 `C.F`（緑）、時間 `C.t`（金）、エネルギー `C.E`（橙）、運動量 `C.p`（桃）、強調 `C.hi`。回転の量は対応する並進の色：角速度 ω は `C.v`、トルク N は `C.F`、角運動量 L は `C.p`。見かけの力（慣性力）は `C.a` の破線。
- `tex()` は x, v, a, F, t の文字を自動で色分けする（`auto:false` で無効）。
- 式だけの cue は `E(...)`。`prev` に直前の式を渡すと、共通の部分が滑って移動し、新しい部分が現れる。
- 図のキーは単元ごとの接頭辞にする（重複すると読み込みで止まる）。

## 確認の手順

1. `build-plan.mjs`（読みの漢字残り・文数の不一致で止まる）
2. `check-readings.py --diff`（不一致 0）
3. `storyboard.mjs` の一覧を開いて、全 cue の始め・中・終わりのコマを目で確認
4. 音声を作り、もう一度 `storyboard.mjs`（実際の時間で確認）
