# v4 担当への共通手順

作業ディレクトリ：/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-claude-mechanics（git worktree。コミットしない）

読む順：
1. docs/video-revision-20260924/experiments/maxwell-v2/HOJOSEN-v4.md（v4 の方針・比喩の表・必ず直す）
2. docs/video-revision-20260924/experiments/maxwell-v2/README-v2.md（画面・台本書式・読み・kana・確認手順）
3. docs/video-revision-20260924/experiments/maxwell-v2/DEEP-v3.md（v3 の深さの基準。v4 でも崩さない）
4. docs/video-revision-20260924/experiments/maxwell-v2/REVIEW-48-hojosen.md（参考。自分の章の項目。時刻は全編版）
5. docs/video-revision-20260924/experiments/maxwell-v2/v3-cue-times.tsv（全編の cue 番号・時刻・章・図キー・字幕。レビューの時刻から cue を探すため）

編集してよいのは自分の部品ファイル `maxwell-v2/<P>.mjs` と図ファイル `scripts/umech/mx2-<P>-diagrams.mjs` だけ（その場で書き換え。ファイル名・export 名・キー接頭辞は変えない）。共有ファイル（mx-common.mjs, frame.mjs, anim.mjs, 他の部品）は編集しない。一時ファイルはスクラッチパッドの自分専用サブフォルダ（例 scratchpad/<P>-v4/）に置く。他の担当と同名の一時ファイルを作らない。

確認（音声エンジンは 127.0.0.1:50123 で動いている。起動待ちなら少し待つ）：
```
P=p2   # 自分の部品
export NEMO_URL=http://127.0.0.1:50123
EM_FILM_CACHE=/private/tmp/mx4-$P node scripts/umech/build-experiment.mjs docs/video-revision-20260924/experiments/maxwell-v2/$P.mjs
python3 scripts/umech/check-readings.py /private/tmp/mx4-$P/plan.json --diff   # 読みの不一致 0
python3 scripts/umech/prosody.py /private/tmp/mx4-$P/plan.json                 # 終了コード 0（kana 照合）
EM_FILM_CACHE=/private/tmp/mx4-$P node scripts/umech/shots.mjs exp-mx2-$P 0:0.1 0:0.5 0:0.95 ...   # → /private/tmp/mx4-$P/shots.jpg を Read で目視
```
kana の注意：**すべてのアクセント句に ' が1つ必要**（平板でも句末に '）。付け忘れると engine が 400 を返し prosody.py が例外で止まる。長音の綴り（オ/ウ）は engine の自動読みに合わせる（prosody.py が不一致を表示する）。語頭の「は」「へ」は ハ・ヘ とカタカナで（ハイル、ハチ、でんじハ）。

新しい・変えた cue は全部 shots.mjs で 0.1/0.5/0.95 を目視し、重なり・はみ出し・向きの誤り・暗すぎる文字を直す。

報告：最終 cue 一覧（番号＋字幕）、比喩（補助線）を入れた cue と比喩名、レビュー項目 → cue、「必ず直す」の対応、長さの見込み、直しきれなかったもの。
