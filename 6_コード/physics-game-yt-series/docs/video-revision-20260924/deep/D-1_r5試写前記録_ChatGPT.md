# D-1 r5 試写前記録（完成・合格の報告ではない）

2026-10-23。字幕中央値上限1.65秒の4本限定承認後の制作途中記録。台本・声・字幕時刻・元の自動検査は変更していない。

W は `/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series`、C は `/private/tmp/ys/ys-chain-d1v1-render`。

## 凍結ソースと変更範囲

| 対象 | SHA-256 |
|---|---|
| `scripts/blender/desk_d1v1.py` | `db40bb24ed333caf1046a047fed0afc72ded0a3b9785ed766ce38d753cfc5509` |
| `scripts/blender/desk_lib_d1.py` | `ab653d04a0c809f763e9c4c344321c4197e72eeaf09cb7599a8b02dd9c66ab81` |
| `C/blender/data.json` | `eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44` |

r4の既存sceneへ、形を作り直さず6個の姿勢関数とSPANS/EVENTSだけを読み直す。helperは上の3種のhashと既読データの等値、可視性queueが空であることをassertする。runpyの返却dictだけでなく、実際にmainが参照する `main.__globals__` を更新し、現在のsceneをD1に戻す。

- 面積を指す手は共通の形を0.32倍、半球を指す手は0.55倍。手先の位置は縮小後も指す場所に一致するよう補正。毎回のresetで手のscaleを1へ戻す。
- 100kg×22枚の説明中は22枚を読める面積のカメラを保ち、「2トン」の1秒前から重い錘のカメラへ移る。
- 「22枚」306.1467秒で22枚を0.7秒間ほのかに発光。「2トン」311.15秒付近で机と置かれた比較模型が0.002mだけ減衰振動する。数や声は変えない。
- 79個のリテラルT呼び出し、41種類の語句を支給phrase-timesと元norm関数で照合し、語句なし0・cue外0。Python/Node構文検査は通過。

## r4の実画像で確認したこと

`C/d1-batch3-gui.log`：21:35:04開始、21:44:59終了（9分55秒、初期化＋25試写＋26部品＋問題2枚）。主要12枚の2D込み画像を個別に目視し、12組の見本比較一覧も目視。追加13時刻は、3D単体または2D込みで全て目視した。

- 54.8秒・403.3秒の不要な黄色線と青い残存物はない。
- 手の板はコンロに隠れず、22枚は3＋5＋6＋5＋3で分離し、寸法線は出現後に消える。金属縁と角度目盛はピストン面として自然な補助。
- 半球は離れた状態から「2つ合わせ」で結合し、排気の後に弁で空気を入れる。r5はこの動作を変えず、覆い隠す手だけ縮小する。
- 富士山の地上・頂上の小機構は0.4倍の指示に対応し、全体が入る。
- 残る観察：157秒の積層直前の手は大きく浅い焦点。369秒の石炭寄りでは筒の左端が切れる。全1秒probeを見て自然な焦点・構図の必要を判断する。

部品26枚は `C/catalog-review-d1v1-r4/d1-catalog-sheet-01.jpg`〜`07.jpg` で全て目視した。area斜めの左端の馬の切れとweightsの刻印を覆う後段用矢印だけを、独立helperで4枚再撮影する。動画の形・姿勢は変えない。他22枚は新規最終catalogへ複製し、由来をSHAで記録する。

## GUI再現用

rootの既読namespace名は `nsD1`。CLIのMetalクラッシュは再試行しない。

```python
patchD1=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r5.py')
print(patchD1['install'](nsD1))
nsD1['A'].times='296,306.4,311.25,325.9,332.7'
nsD1['A'].out='/private/tmp/ys/ys-chain-d1v1-render/blender/landmarks-d1v1-r5-hands'
nsD1['main']()
nsD1['A'].times=','.join(str(i) for i in range(406))
nsD1['A'].out='/private/tmp/ys/ys-chain-d1v1-render/blender/probe1s-d1v1-r5'
nsD1['main']()
fixCatD1=runpy.run_path(W+'/scripts/blender/desk_d1v1_catalog_finish.py')
print(fixCatD1['finish'](nsD1,'/private/tmp/ys/ys-chain-d1v1-render/blender/catalog-d1v1-final'))
```

probe完了後、`desk-d1v1-probe.py` で変更していない元検査のfeatures関数を呼ぶ。縮小は `scale=270:480:flags=area`。`desk-d1v1-probe-review.mjs` は実3Dと最終2Dを1秒ごとに合成し41枚の一覧にする。この診断も最終MP4の本体検査の代わりにはしない。

## 問題準備と音声

`C/problem-final-d1v1/挑戦.png`、`答え.png`、`problem.json` を作成し両画像を目視。答えには44pxの「約0.63倍」の札。入力の3D画像も `挑戦-3D-d1v1.png`、`答え-3D-d1v1.png` に保存し、`composition-d1v1.json` にSHAと比を記録した。元 `problem-r4` の2枚は不変。

声のSHAは `74b0951c096caea1be50a5442030cac089dc51c41ea076987bd7633fe369d0ab`。mixの測定は−14.0LUFS、peak−1.6dBFS、0.25秒以上の低レベル無音0回。rootのNemo3種終了0は以前の固定声の確認記録として保持。耳での確認はまだ行っていない。

## 未完・未確認

r5の5試写と406枚probeはこの記録時点で未生成。最終catalog4枚も未生成。全12163コマ、完成MP4、本体の全項目合格、qx-verify、最終MP4からの1秒全コマ一覧と見本比較は未完。7bを含む全編の合格は報告しない。

4ID限定1.65秒の承認はrootの新規loaderで処理し、元検査は変更しない。commit/push、既存ファイルの移動、Downloadsへの最終配置はしていない。

## 追記：r5の5試写を目視済み

rootのbatch4は22:14:03に開始。296、306.4、311.25、325.9、332.7秒の3D5枚を全て目視し、`C/gate-c-d1v1-r5-hands/d1v1-01.png`〜`05.png` の2D込み5枚も全て個別に目視。`compare-d1v1-all5.jpg` で見本とも比較した。

指が円の大半や右半球を覆わなくなり、直径/半径の指示、22枚を保った説明、2tへの切替、半球の内側と結合途中を読める。札と字幕のはみ出し・重なりは目視では見当たらない。2tの刻印面には軽い焦点の甘さが残るため、全時間の分布を見た後の調整候補として保持。406枚probeと最終catalog4枚は引き続き未完。この5枚だけを全編合格とはしない。
