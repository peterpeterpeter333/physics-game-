# 大学編 1分動画：1本を担当する人への作業手順

作業ディレクトリ：/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-claude-mechanics（git worktree。コミット・push しない）

## 目的
大学編の全単元 × 初級・中級・上級（全87本、一覧は `docs/video-revision-20260924/yt1min/UNITS.md`）を、約1分（55〜80秒）の動画にする。全87本はあとで番号順につなぎ、約5分ごとに区切った一続きのシリーズとして YouTube に上げる。だから1本は単独で意味が通り、前の番号の動画から自然につながり、最後は次の番号へつながる問いで終える。アプリには入れない。

## まず読むもの
1. `docs/video-revision-20260924/yt1min/STANDARD.md` — 制作基準（構成・数式のルール・補助線・画面と音声・確認方法）。すべて守る。
2. **承認済みの見本（01番）**：台本 `docs/video-revision-20260924/yt1min/um-derivative.mjs`、図 `scripts/umech/yt-deriv-diagrams.mjs`。この長さ・説明の細かさ・画面の作り・字幕の量で作る（10文前後、74秒）。
3. 内容の出どころ（UNITS.md の「ステージ id」）：初級 `src/content/levels/intro-*.ts`、中級 `src/content/levels/middle-*.ts`、上級 `src/content/univ-math.ts` / `univ-mechanics.ts` / `univ-em.ts`（id が単元 id のステージ）。goal・foundation（example）・glossary・units・slides を読み、1分で見せる「そのレベルで一番大事な一歩」を一つ選ぶ。例題の数値はステージに合わせ、検算する。
4. 直前の番号の動画の台本（あれば `docs/video-revision-20260924/yt1min/*.mjs`）を読み、言葉・記号・比喩をそろえ、その最後の問いから始める。

## 作るファイル（他のファイルは編集しない）
- 台本：`docs/video-revision-20260924/yt1min/<単元id>-<level>.mjs`（level は intro/middle/advanced）。`export const clips=[{id:'yt-<単元id>-<level>', title:'<問いの形の題名>', condition:'<前提・条件>', scenes:[S(...),S(...),S(...)]}]`。`import {D,S} from '../umech/schema.mjs';`
  - 場面は3つ。見出しは「<単元>・<初級|中級|上級> ｜ <場面名>」。
  - D(subtitle, reading, diagramKey, {kana, pause, sfx, cut})。1 cue ＝字幕2文まで、3行（1行44字）以内。
- 図：`scripts/umech/yt1-<単元id>-<level>-diagrams.mjs`。`export const <任意の名前>={ 'k<番号2桁>:<名前>':(p,ctx)=>svg, ... }`（例 `k02:secant`。自動で読み込まれるので diagrams.mjs は編集しない）。`anim.mjs` の部品（C, axes, tex, texWidth, label, arrow, draw, ...）を使う。見本のヘルパーはコピーしてよい。
  - `:` の前が同じキーの間は画面がフェードせずつながる。全く別の場面に切り替わる cue には `cut:true`。
  - ステージ 1200×515。文字は 22px 以上。`tex()` に日本語を入れない（日本語は `label()`）。英語を画面に出さない（記号・単位は可）。

## 読み・アクセント（音声エンジン：127.0.0.1:50123 で動いている）
- reading：ひらがな（外来語・記号はカタカナ）、文節ごとに半角スペース、漢字を残さない、数字・単位・記号も読みで書く。語頭の「は」「へ」は ハ・ヘ（ハバ、ハイル、ハチ）。
- kana（全 cue 必須）：VOICEVOX のアクセント句表記。`/` 句の区切り、`'` アクセント（**すべての句に ' が1つ必要**。付け忘れると engine が 400 を返す）、`、` 息継ぎ、`？` 疑問、`_` 無声化。長音の綴り（オ／ウ、レイ／レエ）は engine の自動読みに合わせる。
- 手順：まず kana なしで build → `prosody.py` が自動の案を表示 → それを写して、句の切れ目とアクセントを自然に直す（数字の途中で句を切らない等）→ kana を入れて再検査。

## 確認コマンド（ID と F を自分のものに）
```
ID=yt-um-derivative-middle; F=docs/video-revision-20260924/yt1min/um-derivative-middle.mjs; CACHE=/private/tmp/yt1/$ID
export NEMO_URL=http://127.0.0.1:50123
PY="$HOME/Library/Application Support/physics-quest-tools/pyenv/bin/python"
FF="$HOME/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1"
EM_FILM_CACHE=$CACHE node scripts/umech/build-experiment.mjs $F
python3 scripts/umech/check-readings.py $CACHE/plan.json --diff          # 読みの不一致 0
python3 scripts/umech/prosody.py $CACHE/plan.json                          # 終了コード 0
EM_FILM_CACHE=$CACHE node scripts/umech/shots.mjs $ID 0:0.1 0:0.5 0:0.95 ... # 仮の時間で静止画 → $CACHE/shots.jpg を Read
EM_FILM_CACHE=$CACHE "$PY" scripts/render-em-film-audio.py $ID              # 音声（Nemo）
EM_FILM_CACHE=$CACHE "$PY" scripts/umech/mix-audio.py $ID                   # BGM・効果音
EM_FILM_CACHE=$CACHE node scripts/umech/mxr-review.mjs                      # 実際の音声の時間で全 cue×3時点 → $CACHE/review/page-01.jpg を Read して目視
mkdir -p $CACHE/out; EM_FILM_CACHE=$CACHE FFMPEG="$FF" FILM_OUTPUT=$CACHE/out node scripts/render-all-films.mjs $ID
"$FF" -v error -xerror -i $CACHE/out/$ID.mp4 -f null -                        # デコード検査
cp $CACHE/out/$ID.mp4 "$HOME/Downloads/physics-quest-youtube/<番号2桁>_<初級|中級|上級>_<単元>_<題名を短く>.mp4"
```
- 長さが 55〜80秒に入らなければ台本を調整する（論理を削らない）。
- review の静止画で、重なり・はみ出し・欠け・向きや符号の誤り・字幕と図の食い違い・暗すぎる文字を見つけたら直し、review をもう一度作って確かめる。
- 物理・数学の内容（数値・単位・符号・条件）を自分で検算する。定義／実験に支えられた原理／仮定／導いた結果 を区別する。

## 報告（短く）
番号・動画ID・題名・長さ・出力パス、流れ（1文ずつ要約）、入れた補助線、確認したこと（台本検算／読み0・kana0／review 静止画の目視と直したもの／デコード検査）、未確認のこと、最後の問い（次の番号へのつなぎ）。
