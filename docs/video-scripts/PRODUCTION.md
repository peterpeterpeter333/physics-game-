# 全分野の動画化

大学電磁気の既存100本を保持し、このディレクトリの台本156本を追加する。
高校範囲は同じ単元の画面内で初級・中級・上級を選ぶ。大学範囲は既存のレベル別単元を使う。
学習画面は動画、短い補足、動画の選択・移動、バトルへのボタンで構成する。
記号一覧、章の目的パネル、元の長文、動画を別画面で開くリンクは表示しない。
問題・バトル・敵・報酬のデータは変更しない。

## 再現手順

1. `node scripts/build-all-video-scripts.mjs` — 編集済みの台本を再集計。
2. `node scripts/test-all-video-scripts.mjs` — 台本の構造と編集内容を検査。
3. `node scripts/build-all-film-plan.mjs` — `/private/tmp/physics-all-films/plan.json` を作成。
4. VOICEVOX Nemoエンジンをローカルの `127.0.0.1:50123` で起動。
5. `EM_FILM_CACHE=/private/tmp/physics-all-films python scripts/render-em-film-audio.py` — 文単位で音声をキャッシュ。
6. `FILM_PREFLIGHT=1 node scripts/render-all-films.mjs` — 全シーン・字幕・数式の描画を検査。
7. `FFMPEG=/path/to/ffmpeg node scripts/render-all-films.mjs` — H.264/AACへ書き出す。
   `FILM_SHARD=0/3` などで分割実行できる。指定した動画IDだけの再生成もできる。
8. `node scripts/finalize-all-films.mjs` — 全ファイルが完成してからカタログを更新。
9. `node scripts/test-all-films.mjs` と `python scripts/check-em-video-media.py src/content/lesson-video-catalog.generated.json`。
10. `npm run build` と実画面で動画再生・難易度切替・バトル遷移を確認。

Pythonの依存はnumpyとimageio-ffmpeg。実行場所はリポジトリルート。
音声クレジットは各動画内の `音声：VOICEVOX Nemo 男声1` を保持する。
音声エンジン自体はアプリへ同梱しない。

## 修正時の注意

字幕は読み上げ前の原文を保存する。読みの置換（電場→でんば等）は合成入力だけに適用する。
台本、音声、字幕が一致しないと生成・最終化を失敗させる。
描画結果のハッシュが一致する動画は再生成しないため、変更した箇所だけ差し替えられる。
動画内の数式はローカルSVGから焼き込み、外部の数式画像サービスに依存しない。

自動テストはファイル・対応関係・タイムライン・デコードの検証であり、学習者に対する理解度テストではない。
既存教材の図を利用する部分と、今回の台本に合わせて追加した図の両方を使用している。

## 今回の確認範囲

- 新規156本・468場面・音声935文。大学電磁気の既存100本を保持し、合計256本で全136単元をカバー。
- ブラウザ上で全136単元・256動画の選択経路、動画要素、バトルボタン、不要な説明パネルの非表示を確認。
- 新規動画1本の最後までの実再生、初級から中級への切替、バトル画面への遷移を確認。
- 新規156本を全フレームデコードし、H.264/AAC・音声タイムラインとの長さの一致を検査。
- 468場面の代表フレームをブラウザで表示し、文字の画面外へのはみ出しと重なりを検査。
- 台本・動画対応表・既存バトルデータの検査と本番ビルドを実行。

全動画を人が通して視聴したという意味ではない。iPhone実機・App Store版の更新確認と、実際の学習者による理解度の確認は別途必要。
