# Physics Quest の B2 動画配信

## 2026-10-02 の準備状況

- 179本の元MP4（1.286 GiB）は、アップロード目録とファイルサイズ・SHA-1が全件一致した。
- B2の US West に非公開バケット `physics-quest-videos-20261002-6c9a`（ID `6f374c764db5f2b9af060e1f`）を作成した。公開設定やアプリの配信先は変更していない。
- `physics-quest-upload-179-20261002` という7日間・上記バケット・`series/2026-10/` プレフィックス限定のアプリケーションキーを作成した。ブラウザの応答停止により秘密値をアップローダーに引き継げていない。秘密値が取得できない場合は、この未使用キーを削除して新しい限定キーを作る。
- 管理画面から大学編新シリーズ179本をすべてアップロードした。バケット概要で `Current Files: 179`、容量約1.4 GBを確認し、ファイル一覧の179件の名前を元動画179本と照合して欠落0件だった。動画はバケット直下にあり、目録の `series/2026-10/...` には一致しないため、アプリにはまだ接続していない。残り177本の選択には `/private/tmp/physics-quest-upload-hardlinks` の一時的なクローンを使用した。
- 179本だけを非公開のままアップロードするため、`node scripts/upload-b2-series.mjs --series-only --private-stage --upload` を使用する。これらのオプションでは公開URL検証とアプリ設定の切り替えを行わない。
- 進捗表によると179本の通し視聴・音声聴取は未実施。差し替えた11本も耳と実機の最終確認が残るため、アップロード後も公開配信に切り替えない。

179本の大学編新シリーズ（初級49・中級61・上級69）に加え、既存の高校編・問題/解説を含むMP4 578本もB2へ置く。後者を残さないと、アプリから動画を削除した時に高校編やバトルが再生できなくなる。合計757本、約1.94 GiB。

## 切り替えの安全条件

1. B2で公開読み取り専用バケットを作る。**公開アップロードにはしない。** 動画以外の個人ファイルは入れない。
2. そのバケットに限定したアプリケーションキーを作り、`listFiles` と `writeFiles` を付与する。マスターキーをアプリやGitへ入れない。
3. 公開サイト `https://peterpeterpeter333.github.io` からのダウンロードと `Range` ヘッダーを許すCORSルールを設定する。Capacitor/iOSの実機再生も別途確認する。
4. `node scripts/build-b2-series-manifest.mjs` と `node scripts/build-b2-legacy-manifest.mjs` で、元動画の数・容量・SHA-1・配置先を照合する。生成物は `docs/b2-series-upload-manifest.json` と `docs/b2-legacy-upload-manifest.json`。
5. 秘密情報をリポジトリに置かず、ローカル環境で `B2_KEY_ID`、`B2_APPLICATION_KEY`、`B2_BUCKET_ID`、`B2_BUCKET_NAME` を設定する。`node scripts/upload-b2-series.mjs` で件数を確認し、`node scripts/upload-b2-series.mjs --upload` を実行する。中断後も再実行できる。同じキーに異なる内容がある場合は上書きせず停止する。
6. スクリプトは全757本の公開URLについて `Range: bytes=0-1` が206、`Content-Type` がMP4、CORSが正しいことを確認する。**全件成功して初めて** `src/content/video-delivery.json` の `b2BaseUrl` を設定する。
7. `npm run build` で配信済みの既存MP4だけを `dist/media` から除外する。原本 `public/media` と `~/Downloads/physics-quest-youtube` は削除しない。アプリの再生・シーク・0.9倍速・次へ・問題動画/解説動画・バトルをWebとiPhoneで確認してから公開する。

`b2BaseUrl` が空の間、現行アプリはローカル動画を使う。設定後は大学編87単元で新シリーズに切り替わる。「さっと学ぶ」は各単元の最初の1本、「とことん学ぶ」はその単元の全編を手動の「次へ」で順番に見る。高校編と問題/解説は、内容を変えずB2の同じMP4を再生する。新しいMP4が後から追加された場合は、旧マニフェストにない限りローカル再生のまま残る。

参照： [B2 Native APIアップロード](https://www.backblaze.com/docs/cloud-storage-upload-files-with-the-native-api)、[B2 CORS](https://www.backblaze.com/docs/cloud-storage-cross-origin-resource-sharing-rules)、[料金](https://www.backblaze.com/cloud-storage/pricing)。B2の無料枠や転送料は変更されうるため、実際の配信前に料金画面を再確認する。
