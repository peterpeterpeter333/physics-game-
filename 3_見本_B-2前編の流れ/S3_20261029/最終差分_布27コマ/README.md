# B-2前編：行43の布を直した27コマの最終差分

保存・検証：2026-10-29 23:28 JST。

これは**前に保存した全編のバックアップを変更せず、最後の布修正だけを別に保存した差分**です。前の全編バックアップと、この差分を組み合わせれば、今回の修正後のネイティブコマ・制作ソース・検査記録を復旧できます。完成MP4はまだこの差分へ入れていません。

## 1. 何を変えた差分か

行43の冒頭で布が大きい足の模型へ食い込んでいたため、布だけをZ方向へ0.040m上げた版です。カメラ・台・足・発話時刻を変更する修正ではありません。

- 最新コマ：**14542.jpg〜14568.jpg、27枚**。
- 最新場面ソース：`desk_b2a_s3_gpt_20261029.py`。
- 最新場面SHA-256：`28f29685658e041ad43e203942c485d454e9539bb7b0dcc3fe38ecf4f9b75523`。
- 修正前の全編保存に入っている場面SHA：`b90fa52a957a2faf7007a80dec5c14fd6aac611f4e52629151eca0bc386668cf`。
- 台本・音声・字幕の原ファイルと原時刻はS0の凍結ハッシュと一致。詳細は`原本不変_検証.json`。

## 2. 差分の中身

```text
最終差分_布27コマ/
├── 確定キャッシュ/
│   ├── blender/
│   │   ├── desk/14542.jpg ... 14568.jpg
│   │   ├── desk/meta.json
│   │   ├── desk/anchors.json
│   │   ├── primary.json
│   │   ├── camera-records.json
│   │   └── camera-motion.json
│   └── qa/
│       ├── s3-scene-numerical-check.json
│       └── s3-specific-widths-20261029-1793283932784057000.json
├── 制作ソース/scripts/blender/desk_b2a_s3_gpt_20261029.py
├── manifest.json
├── 原本不変_検証.json
└── README.md
```

保存した実体は35ファイル、8,648,114 bytes（このREADMEと2つの検証JSONは数えない）。シンボリックリンクやハードリンクではありません。全35ファイルのバイト列一致・コピー先inodeの独立・リンク数1を確認しています。

jobsの027が完了したあと、その再検査結果を保存しました。

- 一般の実Blender数値検査：**243項目、NG 0**。
- 単体幅・語同期packetの追加検査：**302項目、NG 0**。
- 追加検査に記録された場面SHAと、この差分の最新場面SHAは一致。

これらは幾何・投影・語時刻などの検査です。最終MP4の再生確認や、耳で聴いた確認の代わりにはなりません。

## 3. 復旧する順番

**元の保存用フォルダを直接上書きしないでください。** まず別の空の復元用フォルダを用意し、そこへ普通のファイルコピーを作ります。

1. 次の元の全編保存から、`確定キャッシュ`と`制作ソース`の2フォルダを復元用フォルダへコピーします。

   `/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/ys-chain-b2a-backup/S3_20261029/`

2. **復元用フォルダ側にだけ**、この差分内の同名の2フォルダを重ねます。27枚のJPEG・5つの描画メタデータ・最新QA・場面ソースが新版へ置き換わります。旧QAの別名ファイルが残るのは正常です。最新版の名前は上記の一覧で確認してください。
3. 復元した`確定キャッシュ/blender/desk/`で、`00000.jpg`〜`14845.jpg`が合計14,846枚あり、この差分の27枚と最新メタデータが反映されていることを確かめます。
4. 作業用キャッシュが消えた場合は、この復元済みキャッシュを作業用の場所へ配置して再開します。コードが使っている場所は次です。元の作業キャッシュが残っている間は、勝手に上書きしないでください。

   `/private/tmp/ys/ys-chain-b2a_s3_gpt_20261029/`

5. 承認されたaudio-v4のミックスとstemは次の既存の永続保存を併用します。この差分では音を変更・再生成していません。

   `/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/ys-chain-b2a-backup/S3_20261029/audio/`

全編バックアップにあって差分で置き換えない14,831ファイル（約1.30GB）と、変更しない制作ソース8本についても、現在の作業ファイルとの全バイト一致を再確認しました。したがって、別のコマや別のソースの変更を取りこぼしたまま「27枚だけ」としている状態ではありません。QAの再実行で変わるJSONも差分に含めています。

## 4. 元の保存を残した場所

- 全編保存：`/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/ys-chain-b2a-backup/S3_20261029/確定キャッシュ/`
- 前のソース保存：`/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/ys-chain-b2a-backup/S3_20261029/制作ソース/`
- 布修正前27コマ：`/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/ys-chain-b2a-backup/S3_20261029/布修正前27コマ/`

元の全編保存・保存検証JSON・以前の作業記録には書き込んでいません。今回の差分だけを新しく作っています。

## 5. まだ含めていないもの

布修正後の最終MP4は再書き出し中のため、ここには含めていません。最終MP4のデコード・画面の見え方・文字と図の重なり・音画同期・圧縮後の音量の確認結果は、別の段階報告で確認してください。耳での通し確認は未実施です。

今回保存したのは新規制作ソースの差分であり、既存の共通Blender部品・素材・正本をすべて内包する別Mac向けパッケージではありません。元の作業場所にある共通部品を併用する前提です。コミット・pushは行っていません。
