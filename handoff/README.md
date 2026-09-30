# Physics Quest 動画制作：引き継ぎ資料（2026-09-30 時点）

このフォルダだけで、これまでの作業内容・成果物の場所・作り方・残りの作業が分かるようにまとめたものです。

## 1. このフォルダの中身

| ファイル | 内容 |
|---|---|
| `README.md` | この文書（全体のまとめ） |
| `注意点と改善点の一覧.md` | **ユーザーの要望・指摘と、制作中に見つかった注意点・改善点の全まとめ**（最初に読むとよい） |
| `ユーザー指示の原文/` | ChatGPT 作成の制作基準プロンプトの原文 |
| `レビューと方針（Maxwell）/` | Maxwell 動画のレビュー（70・72・48項目）、補助線の方針と比喩の一覧、初心者目線の点検など |
| `動画ファイル一覧.md` | できあがった全動画のパス・長さ・サイズ（67本） |
| `会話記録/会話記録_本セッション_2026-09-28〜30.md` | 本セッションの会話（ユーザーの発言・Claude の返答・作業エージェントの報告）を読める形にしたもの |
| `会話記録/会話記録_前セッション_〜2026-09-28.md` | その前のセッション（Maxwell 動画 v2〜v4 など）の会話 |
| `生ログ/*.jsonl` | 上の2セッションの完全な記録（ツールの実行内容・結果を含む元データ） |
| `作業手順と計画/` | 制作基準 STANDARD.md、作業手順 AGENT.md、計画 PLAN-初級.md / PLAN-中級.md、進捗 PROGRESS.md、単元一覧 UNITS.md の写し |

元の会話記録の保存場所：`~/.claude/projects/-Users-ken-Documents-Codex-2026-09-15-github-plugin-github-openai-curated-remote-work-physics-game-claude-mechanics/`
- 本セッション：`16f69a2c-3b0b-4d85-8dcc-4aee8846b655.jsonl`（作業エージェントの記録は同名フォルダの `subagents/`）
- 前セッション：`823630db-7d9a-4f45-acd7-23232829f73b.jsonl`

## 2. 成果物（動画）の場所

| フォルダ | 中身 |
|---|---|
| `~/Downloads/physics-quest-youtube/` | 大学編 YouTube シリーズ（約5分×多数）。`1_初級_…`（49本）、`2_中級_…`（作成中） |
| `~/Downloads/physics-quest-youtube/旧版_3本構成/` | 微分・初級の旧3本構成（保管） |
| `~/Downloads/physics-quest-youtube/見本_1分/` | 承認された1分見本（微分・初級） |
| `~/Downloads/physics-quest-maxwell-v2/` `-v3/` `-v4/` | Maxwell 導出動画の各版（各フォルダに README） |

ファイル名の規則：`<1|2|3>_<初級|中級|上級>_<単元順2桁>_<単元名>_<本番号>_<短い題名>.mp4`

## 3. 大学編 YouTube シリーズの進み具合

- **初級：完成**（29単元・49本）。全本で検算・読みの機械検査・静止画の目視・デコード検査済み。通しの再生・音声の聴取は未実施。
- **中級：作成中**（計画 29単元・61本、`PLAN-中級.md`）
  - 完成・送付済み：01 微分（2本）、02 積分（3本）、03 微分の法則（2本）
    - 02 積分は統括（Claude）による静止画の目視がまだ
  - 途中で止まっている：04 近似、05 ベクトル、06 内積（作業エージェントの記録が残っており、続きから再開可能）
  - 未着手：07〜29
- **上級：未着手**（計画 PLAN-上級.md も未作成）
- 詳細は `作業手順と計画/PROGRESS.md`

### 残っている修正
- 初級27 電磁誘導：電流 I を緑、起電力 ℰ を紫に揃える（ユーザー承認済み・未着手）
- 初級20-2：「上級では」→「中級では」は修正・再書き出し済み。直した場面の静止画の目視はまだ
- 初級08-2：字幕の e^(−kt) 表記が ASCII のまま（要検討として記録）
- 初級15：PLAN 外の 𝐋＝𝐫×𝐩 予告2文（要否はユーザー確認待ち）

## 4. ユーザーからの指示（守ること）

- 対象は大学編。既存のアプリ動画は内容の把握にだけ使い、流用しない。
- 単元×レベル（初級→中級→上級の順）ごとに、約5分（4:30〜6:00）の動画を1〜10本。説明の細かさは分野の難しさに応じて変えてよい。微分・初級は2本がちょうど良い、が基準。
- 1本ごとに完結しつつ、前の本の最後の問いから始め、次の本へつながる問いで終える。
- 横長 1280×760、全部を一つのフォルダ（`~/Downloads/physics-quest-youtube/`）に保存。
- 制作基準は ChatGPT 作成のプロンプトを要約した `STANDARD.md`（補助線、比喩は描けて元に戻せるときだけ、式変形は一操作ずつ、定義／原理／仮定／結果の区別、1 T＝1 N/(A·m)、k→ε₀ は定義、線積分に扇風機の比喩を使わない、など）。
- GitHub への push・App Store 提出は、指示があるまでしない。
- 既存アプリ（バトル・4択・ダメージ・進捗・動画リンク）を壊さない。他の作業中のファイルを上書きしない。
- 確認の記録は正直に（台本・静止画・通し再生・音声の確認は別物。やっていないことをやったと書かない）。
- 権限・費用・大きな仕様変更は事前に確認。

## 5. 作り方（パイプライン）

作業場所：`/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-claude-mechanics`（git worktree、ブランチ `claude/university-mechanics-review`、未コミット）

- 台本：`docs/video-revision-20260924/ytseries/<ステージid>-<n>.mjs`（ID `ys-<ステージid>-<n>`）
- 図：`scripts/umech/yt1-<ステージid>-<n>-diagrams.mjs`（自動読み込み）
- 作業用キャッシュ：`/private/tmp/ys/<ID>/`（review/ に静止画シート。再起動で消える）
- 手順の詳細とコマンド：`作業手順と計画/AGENT.md`

必要な道具（この Mac の中）：
- 音声エンジン VOICEVOX NEMO 0.24.0（macOS arm64）：`~/Library/Application Support/physics-quest-tools/nemo/run --host 127.0.0.1 --port 50123` で起動。話者 10001、速さ 0.90。
- Python：`~/Library/Application Support/physics-quest-tools/pyenv/bin/python`（numpy, imageio-ffmpeg）
- FFmpeg：`…/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1`

流れ：build-experiment.mjs → check-readings.py（不一致0）→ prosody.py（終了0、NEMO_URL 必須）→ render-em-film-audio.py → mix-audio.py → mxr-review.mjs（静止画シートを目視）→ render-all-films.mjs → ffmpeg -xerror でデコード検査 → Downloads へコピー。

読みの注意：kana はすべての句に `'`（無いと HTTP 400）、文中の「？」も 400、語頭の「は」は ハ と書く、字幕では ẋ/ẍ を使わず d²x/dt²、「x×x」は「x × x」、数字や単位が行の途中で割れないようにする。

## 6. クラウドについて

このセッションはクラウドではなく、この MacBook Air（KENnoMacBook-Air.local）上で動いている。音声エンジン・書き出し・出力先がこの Mac にあるため、クラウドで続ける場合は、台本や図のコード作成のみクラウドで行い、音声と書き出しはこの Mac で行う必要がある。クラウドへ移すにはブランチの GitHub への push が必要（現在は push しない指示のため、ユーザーの許可が要る）。

## 7. この GitHub ブランチについて（handoff/2026-09-30）

- アプリのコードを含まない独立したブランチ（orphan）。main や作業ブランチには一切影響しない。
- `handoff/生ログ/`：元の .jsonl を gzip で圧縮し、GitHub の容量制限（1ファイル100MB）のため45MBごとに分割したもの。元に戻すには：
  ```bash
  cat 16f69a2c-3b0b-4d85-8dcc-4aee8846b655.jsonl.gz.part-* | gunzip > 16f69a2c-3b0b-4d85-8dcc-4aee8846b655.jsonl
  cat 823630db-7d9a-4f45-acd7-23232829f73b.jsonl.gz.part-* | gunzip > 823630db-7d9a-4f45-acd7-23232829f73b.jsonl
  ```
- `handoff/作業中のファイル/`：作業ブランチ `claude/university-mechanics-review` にある未コミットの作業（台本・図・スクリプト）の写し。
  - `BASE_COMMIT.txt`：写しを取ったときの基準コミット
  - `tracked-changes.patch`：既存ファイルへの変更（`git apply` で当てられる）
  - `files/`：新規・変更ファイルの写し（リポジトリと同じ相対パス）
  - `git-status.txt`：写しを取った時点の状態
- 動画本体（約420MB、`~/Downloads/physics-quest-youtube/` など）は含めていない。
