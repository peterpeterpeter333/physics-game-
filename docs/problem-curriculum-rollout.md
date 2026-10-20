# 問題編の導入状況（2026-10-20）

- 最終台本から160問・478小問を取り込み、114ステージに対応させた。
- 問題画面は「問題文と図 → 4択 → 解説動画」。正解時のダメージ演出を残した。制限時間・正答率判定は設けない。
- 277枚の出題図を `public/media/problem-figures/` に配置した。問題アニメーションMP4はアプリに同梱していない。
- 解説動画160本をYouTubeの「ピーター」チャンネルで公開し、実際の動画IDを `src/content/problem-youtube-ids.json` に対応づけた。高校編73本、大学編87本である。
- 大学編10〜29の60本は、YouTube Studioで動画ごとのファイル名・リンクと公開完了を確認した。アプリの解説画面には対応するYouTube動画を埋め込む。

元データは `~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/` と `~/Downloads/physics-quest-問題編_ダウンロード用_2026-10-18/`。動画IDの正本は `src/content/problem-youtube-ids.json`。アップロード時の作業記録は `outputs/physics-problem-upload-20261018/` にある。

`node scripts/test-problem-curriculum.mjs --require-videos` で全160本の対応を確認する。アプリ内では大学編「RC・RL回路の過渡現象」を使い、出題図・4択・正答時のダメージ・解説動画の表示と再生を確認した。
