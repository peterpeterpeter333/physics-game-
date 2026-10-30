# 上級を作る担当への追加の注意（AGENT.md の読み替え）

- 作業ディレクトリ：/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series（ここで全コマンドを実行）
- 計画：`docs/video-revision-20260924/ytseries/PLAN-上級.md` の担当の節（範囲・目標・最初の問い・要点・補助線・最後の問い・中級の約束の回収）。冒頭の共通方針（上級の入口の部品リスト、重複の扱い、字幕の記号）も読む。
- ID：`ys-<ステージid>-<n>`、台本 `docs/video-revision-20260924/ytseries/<ステージid>-<n>.mjs`、図 `scripts/umech/yt1-<ステージid>-<n>-diagrams.mjs`、見出し「<単元>・上級 <n>/<N> ｜ …」。
- 内容の出どころ：`src/content/univ-math.ts`／`univ-mechanics.ts`／`univ-em.ts` の id が単元 id のステージ（本k ＝ lesson.steps[k]）。ue-integrals・ue-gauss は story 形式。
- 前の本：同じシリーズの直前の本の台本（初級 `ui-*`、中級 `um-*` も同じフォルダ）を読み、言葉・記号・比喩をそろえ、その最後の問いから始める。中級の該当ステージの台本も読み、振り返りは1場面に留める。
- 注意点の全まとめ：`docs/video-revision-20260924/ytseries/NOTES.md`（表記・色・読み・過去の誤り）。字幕では ẋ・ẍ・θ̇ や「Φ_E」のような下線表記を使わない。奥向き磁場は ⊗（丸付き）。数値の表示は、画面の式と必ず合わせる（丸めのずれを作らない）。ナレーション中に図が空になる時間を作らない（図は cue の始めに出す）。
- 出力：`~/Downloads/physics-quest-youtube/3_上級_<ステージ順2桁>_<単元>_<n>_<短い題名>.mp4`。
- 音声エンジン Nemo（127.0.0.1:50123）は共有。応答しないときだけ `cd "$HOME/Library/Application Support/physics-quest-tools/nemo" && nohup ./run --host 127.0.0.1 --port 50123 > ../nemo.log 2>&1 &` で起動。長いコマンドは前面で実行。作業用ファイルは自分の $CACHE の中に置く（他の担当と共有しない）。
