# 全分野の動画化

## 2026-09-23：外部校閲稿を反映した差し替え

ユーザー提供の「完成版」6ファイル（314本）を読み上げ原稿のベースとして採用。残る橋渡し・続編18本も点検。
元の原稿、提供稿、最終稿は `reviewed-narration-20260923.json` に場面単位で保存し、元ファイルのSHA-256を記録する。
最終稿は既存の手書き `.mjs` と `src/content/em-video-narration.ts` に反映済み。生成時に未反映の別原稿を読む構成にはしない。

- 全332本・1,068場面のうち、325本・1,013場面の音声文を更新。前提動画76本も含む。
- 提供稿の意味のずれや不足条件を67場面で補正。変位と道のり、平均加速度、仕事と仕事率、単位電荷、静電場の条件、電子のドリフト、変位電流など。
- 再利用する図のうち、抵抗の数値、半径の単位、速度・時間グラフの目盛り、積の微分の図、仕事と仕事率の矢印を訂正。
- 大学電磁気は、説明文の文数が変わった箇所の数式切り替え位置も更新。
- Nemoの読みを照合し、「電気束」の誤読を「でんきそく」に固定。字幕は漢字を維持し、読みの修正も描画ハッシュへ含める。
- 文単位の音声キャッシュと動画の描画ハッシュを利用。変化のない7本は保持し、変更箇所を含む動画だけを差し替える。
- ファイル名は維持し、アプリ側の動画・ポスターURLに描画ハッシュを付ける。旧キャッシュの再表示を防ぐ。
- 問題・敵・報酬は変更せず、初級／中級／上級とバトルへの導線を維持する。

### この改訂の再現・検査

1. 提供稿を再取り込みする場合のみ `node scripts/import-reviewed-narration.mjs /原稿のフォルダ`。編集上の補正は `scripts/reviewed-narration-corrections.mjs`。
2. 上記の各分野の生成手順で台本計画・音声を更新。`NEMO_URL` でローカル音声エンジンの接続先を指定できる。
3. `node scripts/render-reviewed-videos.mjs` は音声が完成した動画から順に生成する。`FFMPEG` を指定し、カタログの途中公開はしない。
4. 図や式の最終編集後にも各レンダラーを再実行し、描画ハッシュが変わった動画だけを更新する。
5. `node scripts/finalize-reviewed-videos.mjs` は全動画と最終台本の一致を検査してから、3カタログと媒体ハッシュ一覧を確定する。
6. `npm run test:reviewed-videos`、既存の動画テスト3種、`npm run test:em-video-repairs`、全3カタログの `check-em-video-media.py`、本番ビルドを実行する。

`preflight-reviewed-videos.mjs` は仮の時刻で全文の改行・数式生成を検査する。音声合成・実再生の検査とは別であり、動画や音声キャッシュを上書きしない。
自動テストは理解度を保証しない。iPhone実機での視聴、全編を人が聞く検査、学習者による理解度試験は別途必要。

### 最終検査結果

- 332本・約234.7分、MP4合計272.3 MiB。媒体ごとのSHA-256は `reviewed-media-20260923.json` に保存。
- 全332本のH.264映像・AAC音声を最後までデコードし、全ファイルでエラーなし。実際の再生時間と台本の時刻も一致。
- 全1,068場面の最終台本・字幕・カタログ、および全動画のチェックサム照合に合格。
- 動画6種のテスト、前提動画76本の依存順序、全136単元の対応・バトル保持、既存の教材・数式・10原則の回帰テストに合格。
- 本番ビルド成功。既存のSDKのブラウザー互換警告と大きいJSチャンクの警告は残る。
- 完成本番ビルドの画面で、加速度の前提動画→本編、初級→中級、更新識別子付き動画の読み込み（readyState 4）、バトル画面への遷移を確認。
- 加速度の軸・単位、面積変化率の単位、仕事と仕事率の矢印など、修正箇所の映像を抜き取り確認。Safariでは前提動画の再生開始も確認。
- 内蔵ブラウザーは再生操作時にタブが終了したため、そこでの通し再生は未確認。iPhone実機と全編の人による視聴は未実施。
- 原稿変更のない7本はGitの元動画と同一。UIの簡素化方針、難易度選択、バトルを維持。

---

以下は初回制作・前提動画追加時の記録。

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

## 前提動画の追加（既存156本とは別管理）

台本は `prerequisite-lessons.mjs` と同名接頭辞の分野別ファイル、前提の順序は `prerequisite-order.mjs`。

1. `node scripts/build-prerequisite-films.mjs`
2. `EM_FILM_CACHE=/private/tmp/physics-prerequisite-films python scripts/render-em-film-audio.py`
3. `EM_FILM_CACHE=/private/tmp/physics-prerequisite-films FILM_PREFLIGHT=1 node scripts/render-all-films.mjs`
4. `EM_FILM_CACHE=/private/tmp/physics-prerequisite-films FFMPEG=/path/to/ffmpeg node scripts/render-all-films.mjs`
5. `node scripts/finalize-prerequisite-films.mjs` — 全ファイル完成・台本一致を確認してから、新しいカタログだけを更新。
6. `npm run test:prerequisite-videos`
7. `python scripts/check-em-video-media.py src/content/prerequisite-video-catalog.generated.json`
8. `node scripts/report-prerequisite-placement.mjs` と `npm run build`

前提動画は `public/media/lessons/prep-*.mp4`、カタログは `src/content/prerequisite-video-catalog.generated.json`。既存の二つのカタログは変更しない。前提動画だけの生成計画に対して、既存動画用の `finalize-all-films.mjs` は使用しないこと。

### 前提動画追加時の検査結果

- 76本・285場面、対象96ステージの既存156本への挿入・依存順・リスト内重複除去のテストに合格。
- 全76本の全フレームデコード、H.264/AAC、音声タイムラインの長さの検査に合格。既存動画の構造テストと本番ビルドも合格。
- 本番プレビューの加速度章で「位置と時間 → グラフの傾き → 加速度の定義 → 既存動画」の配置と、追加動画の読み込み（readyState 4）を確認。
- 再生ボタン操作時に確認用ブラウザーのページがクラッシュしたため、この追加分について実再生・難易度切替・バトル遷移の画面検証は未完了。原因は未特定で、公開前に通常ブラウザーとiPhone実機で確認すること。
- 全動画を人間が通して視聴した検査、実学習者による理解度テスト、App Store版の検証は未実施。push・公開は行っていない。
