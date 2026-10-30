# D-1 r4 再開制作記録（途中記録・完成報告ではない）

2026-10-23。4本限定の字幕中央値上限1.65秒の承認後に再開。正本・台本・声・元の自動検査は変更していない。以下は作業の再現用であり、全編の合格・完成を意味しない。

## 凍結した3D・データ

| ファイル | SHA-256 |
|---|---|
| `scripts/blender/desk_d1v1.py` | `7ad4d9e5e13fd8062f4a0052fcd3795c69009fa2c74068acb84d4bcf16aebbd0` |
| `scripts/blender/desk_lib_d1.py` | `ab653d04a0c809f763e9c4c344321c4197e72eeaf09cb7599a8b02dd9c66ab81` |
| `/private/tmp/ys/ys-chain-d1v1-render/blender/data.json` | `eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44` |

Python構文確認・JavaScript構文確認・dataの数値assertは合格。GUIが読み終わるまで上のソース・データを変更しない。

## r3で実際に確認したこと

5時刻の本番品質3D画像、2Dを重ねた5画像をすべて目視。54.8秒・403.3秒の不要な黄色線と青い残存物、194秒の手のひらがコンロに隠れる問題、302.7秒の22枚を寸法線が横切る問題は解消。389秒では富士山の機械を0.4倍に拡大したことで、親子変換のずれと地上機の左端の切れが判明した。

画像：`/private/tmp/ys/ys-chain-d1v1-render/gate-c-d1v1-r3/`。

## r4の修正と理由

- 富士山の機械は原点で親子付けしてから0.4倍・所定位置へ移す。全体が入る位置と距離へ調整。
- 面積を説明する円板は、ピストンの金属縁・円周の角度目盛を実物模型として追加。53cmの直径と26.5cmの半径の語に同期して指が指す。手のひら22枚を置く内側は空け、無関係な背景模様は追加しない。
- 100kg・2tの錘に補強帯・リベット・吊り環を付け、黒い無地箱ではなく錘として形を読めるようにした。模型の横幅40〜70％を目安に距離を調整。
- 空気の透明な層模型には薄いアクリルの実在縁を付け、層が積もる前の導入では手が足元を指す。粒の数・比は変更しない。
- 円筒・缶は僅かに寄って読みやすくした。実際の画像と見本の比較で最終判断し、特徴量だけを合格させる修正はしない。
- 行39の半球が初めから結合済みだった未実装動作を補完。「空気の力」で半球を指す。「2つ合わせ」で離れた半球を合体し、続く「空気を抜きました」で排気。行40で弁を開ける時だけ空気粒が入る向きに戻る。声の72個のリテラル語トリガーを支給phrase-timesに照合して合格。
- 旧sceneは保存し、`list(bpy.data.objects)`のsnapshotを使い、`previous_`接頭辞付きの物は再renameしない。新しい名前を空けるために必要な物だけ一度renameする。模型完成後のscene内のparent関係を一度cacheし、同じ再帰と同じ`d.show`でD1の`show_tree`を実行する。描く形・色・可視性の意味は変えず、旧sceneを含む`Object.children`の繰返し全探索を省く。
- rootのnative sampleで、`hide_viewport`の同値・一時状態の大量代入が全sceneの再同期を起こしていると判明。D1の`apply`内だけ可視性を辞書にqueueし、最後のboolだけ差分flushしてからview layerを更新する。`apply`外は即時差分更新。`catalog_stage`の直接代入1箇所はGUIで読むmemory内だけ`show(o,keep)`に置換し、共有原本は変更しない。100組のランダム系列で最終flagsの同値、apply外の即時性を単体検査して合格。Blender上の最終画はr4試写で別途確認する。
- `catalog_stage`はmemory内だけ現在の`SC.objects`に限定し、別episodeの保存sceneの部屋・照明のhide flagsを変更しない。後のepisodeが名前をprefixしてもD1のnamespaceを安全に再利用できるよう、生成時の物の名前をobject参照ごとに保存し、runtimeの名前条件は保存名で判定する。

## GUIの再現

CLIのMetalクラッシュは再試行しない。rootがGUIで逐次実行する。

```python
sys.argv=['desk_d1v1.py','--','--cache','/private/tmp/ys/ys-chain-d1v1-render',
 '--times','4,24.5,54.8,84.3,104.5,126.17,140.5,157,165,175,180,194,210.7,263.9,296,302.7,318,325.9,332.7,334.2,341.6,352,369,389,403.3',
 '--out','/private/tmp/ys/ys-chain-d1v1-render/blender/landmarks-d1v1-r4']
d1=runpy.run_path(W+'/scripts/blender/desk_d1v1.py',run_name='d1_preview_r4')
d1['main']()
d1['A'].out='/private/tmp/ys/ys-chain-d1v1-render/blender/catalog-d1v1-r4'
d1['catalog']()
d1['A'].out='/private/tmp/ys/ys-chain-d1v1-render/problem-r4'
d1['problem']()
```

## 完成前に残る確認

r4の25時刻・26部品画像・問題画像の目視、2D付き12時刻と見本の比較、全時間分布の診断、全12163コマの本番書き出し、MP4書き出し、全編の1秒ごとの全コマを見本と並べた目視、元検査と4ID限定1.65秒例外による全ゲート確認、qx-verify、mxr-review、最終13章形式報告。耳で聞く確認は未実施であり、実施していない限り未確認と明記する。

既存ファイルの移動・上書き・commit・pushはしない。最終Downloads配置はrootの担当。
