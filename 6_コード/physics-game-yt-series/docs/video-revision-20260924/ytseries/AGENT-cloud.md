# 大学編 5分動画シリーズ：クラウド（Linux）で1本を作る人への作業手順

基本は `AGENT.md`（Mac 用）と同じ。違うのは道具の場所と出力先だけ。**まず `AGENT.md` と `../yt1min/STANDARD.md` を読み、ここに書いた差分で読み替える。**

## 必ず読むもの
1. `docs/video-revision-20260924/ytseries/AGENT.md`（作業手順。作るファイル・読み・kana・確認の流れ）
2. `docs/video-revision-20260924/yt1min/STANDARD.md`（制作基準）
3. `docs/video-revision-20260924/ytseries/NOTES.md`（注意点と改善点の全まとめ。表記・色・読み・過去に直した誤り）
4. `docs/video-revision-20260924/ytseries/PLAN-中級.md` の担当の節（範囲・最初の問い・要点・補助線・最後の問い）
5. 品質の見本：同じレベルの完成済みの台本と図（例 `um-function-rules-1.mjs` と `scripts/umech/yt1-um-function-rules-1-diagrams.mjs`、`um-sum-to-integral-*.mjs`）。**この密度・画面の作り・字幕の量に合わせる。** 前の本の台本も読んで、言葉・記号・比喩をそろえ、その最後の問いから始める。

## 道具（このマシン）
```
cd /home/user/physics-game-
export NEMO_URL=http://127.0.0.1:50123       # VOICEVOX NEMO 0.24.0（Linux 版。Mac と同じ版）
PY=/home/user/tools/pyenv/bin/python          # numpy, imageio-ffmpeg
FF=/home/user/tools/pyenv/lib/python3.11/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2
ID=ys-<ステージid>-<n>; F=docs/video-revision-20260924/ytseries/<ステージid>-<n>.mjs; CACHE=/tmp/claude-0/ys/$ID
```
- エンジンが応答しないとき（`curl -s $NEMO_URL/version` が "0.24.0" を返さない）：
  `cd /home/user/tools/linux-cpu-x64 && nohup ./run --host 127.0.0.1 --port 50123 > /home/user/tools/nemo.log 2>&1 &` を実行し、応答するまで待つ。
- 作業用フォルダは必ず自分の `$CACHE`（他の人と共有しない）。

## コマンド（AGENT.md の確認コマンドの Linux 版）
```
EM_FILM_CACHE=$CACHE node scripts/umech/build-experiment.mjs $F
python3 scripts/umech/check-readings.py $CACHE/plan.json --diff          # 読みの不一致 0
python3 scripts/umech/prosody.py $CACHE/plan.json                          # 終了コード 0
EM_FILM_CACHE=$CACHE node scripts/umech/shots.mjs $ID 0:0.1 0:0.5 ...     # 仮の時間で静止画 → $CACHE/shots.jpg を Read
EM_FILM_CACHE=$CACHE $PY scripts/render-em-film-audio.py $ID               # 音声（約2分）
EM_FILM_CACHE=$CACHE $PY scripts/umech/mix-audio.py $ID                    # BGM・効果音
EM_FILM_CACHE=$CACHE node scripts/umech/mxr-review.mjs                     # 実際の音声の時間で静止画 → $CACHE/review/page-*.jpg を全部 Read して目視
mkdir -p $CACHE/out; EM_FILM_CACHE=$CACHE FFMPEG=$FF FILM_OUTPUT=$CACHE/out node scripts/render-all-films.mjs $ID   # 約4分
$FF -v error -xerror -i $CACHE/out/$ID.mp4 -f null -                       # デコード検査
```
- 長いコマンドは前面で実行する（バックグラウンドで待たない）。
- mp4 のコピー・コミット・push は統括がする。作業者は `$CACHE/out/$ID.mp4` まで作って報告する。
- 編集してよいのは自分の担当の台本と図のファイルだけ（`diagrams.mjs`・`schema.mjs`・他の本のファイルは編集しない）。

## 報告（短く）
AGENT.md の「報告」と同じ。加えて mp4 のパス、長さ、出力ファイル名の案（`2_中級_<nn>_<単元>_<n>_<短い題名>.mp4`）。
