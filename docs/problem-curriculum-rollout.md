# 問題編の導入状況（2026-10-18）

- 最終台本から160問・478小問を取り込み、114ステージに対応させた。
- 問題画面は「問題文と図 → 4択 → 解説動画」。正解時のダメージ演出を残した。制限時間・正答率判定は設けない。
- 277枚の出題図を `public/media/problem-figures/` に配置した。問題アニメーションMP4はアプリに同梱していない。
- 解説動画100本をYouTubeの「ピーター」チャンネルで公開し、`src/content/problem-youtube-ids.json` に対応を記録した。高校編73本と大学編01〜09の27本である。
- 残る大学編10〜29の60本は、YouTubeの「1日のアップロード数の上限」で投稿できなかった。対応IDがない解説画面は準備中と明示する。未公開のIDを推測して埋めない。

元データは `~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/` と `~/Downloads/physics-quest-問題編_ダウンロード用_2026-10-18/`。アップロード済みIDと残りのファイル名は `outputs/physics-problem-upload-20261018/problem-solution-youtube-drafts.json`、公開確認済みIDは同じフォルダの `problem-solution-youtube-published.json` に保存した。

残り60本を投稿・公開したら、実際のYouTube IDを `problem-youtube-ids.json` に追加して `node scripts/test-problem-curriculum.mjs --require-videos` を実行する。最後にアプリ内の図・4択・動画再生をサンプル確認し、mainへの統合を判断する。
