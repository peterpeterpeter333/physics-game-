# 高校編を作る担当への追加の注意（AGENT.md の読み替え）

- 作業ディレクトリ：/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series（ここで全コマンドを実行。コミット・push しない）
- 方針：`~/Downloads/physics-quest-高校編_台本/00_高校編の方針.md`（深く学ぶ版と要点版の違い、微積分を使わない、など）
- 計画：`~/Downloads/physics-quest-高校編_台本/構成/高校_1_力学.md`・`高校_2_熱・3_波.md`・`高校_4_電磁気・5_原子.md` の担当の節。冒頭の用語・記号表と末尾の「決めること」も読む（決まっていない所は構成表の案に従い、報告に書く）。
- 内容の出どころ：`/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-claude-mechanics/src/content/` の `mechanics.ts`・`thermo.ts`・`waves.ts`・`electromagnetism.ts`・`atomic.ts`。本n はアプリで表示される順（構成表に対応が書いてある）。
- ID と台本：
  - 深く学ぶ版：ID `ys-hs-<単元id>-<n>`、台本 `docs/video-revision-20260924/ytseries/hs-<単元id>-<n>.mjs`、図 `scripts/umech/yt1-hs-<単元id>-<n>-diagrams.mjs`、見出し「<単元>・深く学ぶ <n>/<N> ｜ …」。
  - 要点版：ID `ys-hs-<単元id>-summary`、台本 `hs-<単元id>-summary.mjs`、図 `yt1-hs-<単元id>-summary-diagrams.mjs`、見出し「<単元>・要点 ｜ …」。2:00〜3:00、15〜25文。
- 前の本：直前の深く学ぶ版の台本を読み、言葉・記号をそろえ、その最後の問いから始める（構成表の文言どおり）。要点版は前後とつながらなくてよいが、深く学ぶ版と言葉・記号・数値例をそろえる。
- 注意点：`docs/video-revision-20260924/ytseries/NOTES.md`、`yt1min/STANDARD.md`。字幕に ASCII の式・下線表記を出さない。数字・単位・式を行の途中で割らない（レンダラと同じ折り返しで確かめる）。ナレーション中に図を空にしない。画面の数値と式を必ず一致させる。同じ文字を二つの量に使わない。
- 出力：`~/Downloads/physics-quest-youtube/高校編/` に、深く学ぶ版は `0_高校_<動画番号>_<単元>_深く_<n>_<短い題名>.mp4`、要点版は `0_高校_<動画番号>_<単元>_要点_<短い題名>.mp4`。動画番号は分野番号＋単元2桁（力学 101〜110、熱 201〜204、波 301〜305、電磁気 401〜405、原子 501〜503）。
- ChatGPT 確認用：仕上げたら `node scripts/umech/export-script-md.mjs ~/Downloads/physics-quest-高校編_台本/台本 docs/video-revision-20260924/ytseries/hs-<単元id>-*.mjs` を実行（review の静止画も一緒に写る。review を作り直した後に実行する）。
- 音声エンジン Nemo（127.0.0.1:50123）は共有。応答しないときだけ `cd "$HOME/Library/Application Support/physics-quest-tools/nemo" && nohup ./run --host 127.0.0.1 --port 50123 > ../nemo.log 2>&1 &` で起動。長いコマンドは前面で実行。作業用ファイルは自分の $CACHE（`/private/tmp/ys/<ID>`）と自分用の道具フォルダに置く。
- Python の文字列経由で JS を書くと TeX のバックスラッシュが半分になる。TeX が表示されることを必ず確かめる。
