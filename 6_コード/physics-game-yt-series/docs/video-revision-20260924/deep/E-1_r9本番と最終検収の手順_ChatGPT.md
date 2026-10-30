# E-1 r9 本番と最終検収の手順（ChatGPT）

## 1. 現在地

2026-10-24、ユーザーの追加承認を受け、凍結 r9 から本番へ再開するための準備記録。完成動画・最終検収の報告ではない。既知の同期、船本体、時計全身、船と振り子の動的幅を直した r9 の模型・台本・声・字幕を維持する。GPU の実行と順序は root が統括し、E 担当から直接投入しない。

## 2. 承認と不変条件

字幕中央値の上限 1.65 秒は四 ID 限定の外付け runner だけで扱う。追加承認は、原 7b / sparse が実像と食い違う場面について、実物投影幅と実画像の個別目視で補完するもの。原検査、閾値、原 NG は消さず、実際に小さい、空白、読めない画を一律に免除しない。顔と指示の食い違いの正確な承認範囲と適用は root が管理する。原日本語、canonical、声、字幕、語時刻は不変。commit / push なし。

## 3. 再読と凍結

再開時に共通制作指示 255 行と E-1 個別指示 229 行を再び全文読了した。共通第 3 章の資料、正本、台本、語時刻、見本と全 50 コマ、部品は既に前段で読解・視認済み。今回の新規安全 runner は凍結ソース自体を変更しない。

W = `/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series`

C = `/private/tmp/ys/ys-chain-e1v1`

模型凍結は `C/e1v1-r9-source-freeze.json` の 16 ソース。追加準備の別凍結は `C/e1v1-production-r9-preparation-freeze-v2.json`（初回準備 freeze も履歴保持）。古い停止報告 `E-1_r9チェックポイント_検収_ChatGPT.md` は履歴として保持し、完成報告へ上書きしない。

## 4. 本番 runner

新規 `W/scripts/blender/desk_axes_e1_r9_production.py`。root の保持 GUI namespace `nsE1` に対し、`runpy.run_path(PATH)['run'](nsE1)` は preflight のみ、`runpy.run_path(PATH)['run'](nsE1, render=True)` が本番。import だけでは描画しない。CLI Blender、Metal 再試行、模型の作り直しを行わない。

実際の `nsE1['apply'].__globals__` と凍結関数の意味的 bytecode、canonical shared main の意味的 code、16 ソース、声、data、海図 texture、承認済みカメラ、Eevee engine、物理監査 PASS を確認する。保持 namespace の古い SPANS / EVENTS が残っていても、凍結ソースから復元した本番 plan をコピーした main の globals だけへ渡し、模型 globals は変更しない。

## 5. フレームと動作区間

54 cue、386.8433333333335 秒、30fps、11,606 コマ。凍結 plan は実描画 8,100、同一コマ複製 3,506、他回からの copy は 0。正確な全 SPANS と分類は `C/e1v1-r9-production-plan.json`。霧と艦隊、緯度移動、恒星の平行方向、地球儀と灯、霧下の船、船の揺れと振り子、灰色時計影、最後の霧など、説明中の連続動作を 30fps の描画区間へ含める。所要時間は実績からのみ報告し、未実行の予想を実績としない。

## 6. 保存先と scene の保護

本番は新規 `C/blender/desk` のみに保存し、1080×1920 / Eevee 16 samples / JPEG 95。既存があれば明示 resume と同一 owner manifest がなければ停止する。描画 target と clone の source / target を本番直下の五桁 JPEG に限定し、symlink、他回からの copy、既存異内容への上書きを拒否する。既存 raw があれば、明示 resume 以外では描き直さない。

各 apply / render で E scene を選び、実 render operator に E scene 名を明示する。全 scene の render.filepath と現存する保存済み画像の SHA / size / mtime、r5 / r6 / r7 / r9 raw と承認 catalog / 問題 PNG を前後照合する。実行前の active scene を最後に復帰する。他 scene や元共通 renderer、real bpy の monkeypatch はしない。途中失敗でも partial output と証拠を保持する。

## 7. 合成・音声・書き出し

新規 E export は `W/scripts/umech/desk-e1v1-export.mjs`。本番全 JPEG と全 anchor を検査し、専用 DRAW cache `C-render` にだけ plan の series を「E 時間と位置 1」とし、新規 mix を結び、canonical plan / 声は保持する。private compositor `desk-axes-frame.mjs` と private encoder 入口 `desk-axes-render-entry.mjs` を利用する。題だけを 1.5〜2.0 秒 fade とし、元 compositor と字幕は変更しない。

最終予定 MP4 は `/private/tmp/ys/ys-chain-e1v1-render/out/ys-chain-e1v1.mp4`。既存 MP4 を置き換えない。声 SHA256 は `e9318ace4036f12ac4e6984d158d0d7d4853212a9252d8d6bdecea7105ed2707`。Nemo 3 種の既存再確認は 54 文の読み不一致 0、男 46 / 女 8、話者不一致 0。最終 MP4 の音量・無音・耳での全編同期確認は生成後に別記する。

## 8. 原 gate と実寸の区別

最終検査は actual MP4 と正しい E DRAW cache を使い、原 `desk-quality-gate.mjs` と `desk-quality-gate-frames.py` をそのまま実行する。字幕例外だけを承認済み四 ID 限定 loader へ渡す。`GATE_NPZ=<新規QA>/quality-frames-original.npz` で元の desk_t / desk_feat を保存する。全 0.5 秒の偏りのない標本で 7b、sparse、静止、始終を記録する。cue 重点の偏った probe 値を全編の代用にしない。

新規 `W/scripts/blender/desk_axes_e1_r9_final_dimensions.py` は本番完了後に root が非描画で実行できる。原 raw gate の全 0.5 秒 frame と全 cue 末尾に一致する主役 mesh / curve の実投影を記録する。同一コマの dup については target 時刻の仮想姿勢ではなく、実際に写った参照 frame の姿勢を使う。模型を作り直さず、元 NG を変更しない。

## 9. 補完の個別判定

原指標と画像が食い違う候補ごとに、時刻 / cue / 声が説明する物 / 元 subject・wood・busy / 主役の定義 / 実物幅 / 実画像 / 実目視判定を対応付ける。皮袋は皮の袋本体、ログは船本体、船と振り子は指定された二物の組と各単体を区別する。机、補助飾り、無関係な札を主役幅へ足さない。

実寸が 4〜7 割でも、字幕に作用部が隠れる、物と言葉が合わない、ピントが悪い、実際に空白が続く等の欠陥は修正または未合格として扱う。承認済み補完を原 gate の PASS と呼ばず、「原 NG、該当する実像の補完確認」と併記する。模様、測定用の色、閾値変更による検査対策はしない。

## 10. 実 MP4 の全秒・cue 末尾の目視

新規 `W/scripts/umech/review-desk-e1v1-final.mjs` に実 MP4 と新規出力先を渡す。MP4 自体から整数 0〜386 秒の 387 frame、全 54 cue 末尾の実 30fps frame、冒頭末尾を抽出する。SVG の再合成を実 MP4 の検収画像の代用にしない。全秒 39 一覧、cue 末尾 6 一覧、始終一覧を実表示して、見たページと具体的な欠陥を記録する。生成のみで actuallyViewed を true にしない。

元 qx-verify の全一覧と mxr-review の全 cue 終端も別に確認する。事故冒頭 6 行の静かな動き、4 隻のみの事故、北極と北極星、30°→50°、両地点 40°・東が先、東西と時差、1 目盛 1.85km、ログと砂時計 / 磁針、時計持上げ / 落下、船上の振り子、袋と金貨、霧と灰色時計、始終の一致を重点確認する。挑戦と答えの図は本編で取り違えない。

## 11. 既にある図とカタログ

最終承認済み 22 部品写真は `C/blender/gate-e1v1-r5/catalog`。11 種の斜め / 上で全て目視済み。r6 以降は部品形状を変えていない。公開と共通 catalog への追記は root 担当。E 担当は共有 MD を変更しない。

`C/problem/挑戦.png` と `C/problem/答え.png` は raw と最終 2D を既に実目視済み。1080×1920、船の昼 12 時 / London 10 時、答えだけ東 30°。本番後に最終出力一式へ含まれることを確認する。

## 12. 最終記録する検査

chain-desk-lint、check-readings、prosody、prosody-speaker、qx-verify、mxr-review、原 desk-quality-gate、元検査 NPZ、実寸補完、実 MP4 全秒と cue 末尾、実フォント、主要 12 比較、音の全編確認、source / 声 / 原検査 / 既存回 MP4 の不変照合を実結果で記録する。caption 例外、原 7b / sparse の NG と補完、未確認は列を分ける。root の最終総合検収と E 担当の個別実績を混同しない。

## 13. 未実施と次の引き継ぎ

本書作成時点で本番と完成 MP4 は未生成、最終ゲートと最終 MP4 の全秒 / cue 末尾 / 音の実目視は未実施。新規 runner の GUI preflight 結果も root の実行待ち。旧 r9 probe の整数全 387 の原中央値 .596296 は NG のまま保持する。本番後の値は未計測であり、合格を予告しない。root が安全 preflight と GPU 順序を確認して本番を開始し、完了後に E 担当が CPU 枠を確認して最終検査と実画像の確認へ進む。
