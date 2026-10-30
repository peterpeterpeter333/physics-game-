# D-1 復元 guard の実診断と v4（意図/実寸/3枚実像PASS・本番進行中）

job052 は 2026-10-24 20:14:59 開始、2.427秒で描画前停止した。実画像0、本番は未開始。原失敗ログと `/private/tmp/ys/ys-chain-d1v1-render/d1-runtime-restore-r15-20261024.json` を保持する。元 r15 stage/lib/overlay/production runner/restore helper は編集していない。

元 live と frozen AST の全12163 plan は差0（5070 actual＋7093 dup、plan SHA `ede4c382fbeb57eacaa671b05e3e7e3b52e589a72305a65d1036668a74f97cac`）。失敗は time0 の代表比較の最大差 `0.03223879835650223` で、元許容値 `1e-5` を超えた。元失敗helperは成分値を保存する前にassertしたため、この数値だけで focus／画素bbox／物体geometry のどれかは断定できない。

## 診断専用 v2

新規 `scripts/blender/desk_axes_d1_restore_diagnostic_v2_20261024.py`、SHA `4dd32e6b348168263bbd4d79c9cb643f97374cba77ea3e7d29e8cb3c4f761b48`。

```python
runpy.run_path(W+'/scripts/blender/desk_axes_d1_restore_diagnostic_v2_20261024.py')['diagnose'](nsD1, authorized=True)
```

描画せず、16代表の各 pose／focus／絞り／anchor／projected bbox、time0 の camera/world matrices／scale／dimensions／evaluated local geometry hash／shape-key を保存する。同じ関数の反復と同じ403.3秒前状態からの old/new 比較を分け、old apply closure の実コードも残す。必ず元 runtime bindings と scene を復帰する。

root の job055 は 2026-10-24 20:51:07 開始、2.398秒で診断を完了した。実出力は `/private/tmp/ys/ys-chain-d1v1-render/d1-runtime-restore-v2-diagnostic-20261024.json`、SHA `4fde177bf43aadaeb81cbbe47d43fa62dab3e72209b23b1e62e4a4cf5602a6dd`。`renders=0`、`allOriginalBindingsRestored=true`、model作り直し・source変更・許容値変更はすべて false。

## job055 の実成分と判断

旧 live と frozen AST の**どちらでも**、同じ time0 を続けて評価すると同じ4項目だけが変わった。2物体の location.z と matrixWorld.z の重複記録であり、実際の変化は次の2つ。

| 物体 | 初回中心 z (m) | 同関数2回目中心 z (m) | 差 (m) |
|---|---:|---:|---:|
| d1_shaftwater | .030025796964764595 | .044999998062849045 | .01497420109808445 |
| d1_pool | .026000000536441803 | .026750000193715096 | .0007499996572732925 |

time0 の固定式は `water(0)=.05`。従って shaftwater は高さ .05、中心 `.02+.05/2=.045`、pool は高さ `.05*.15=.0075`、中心 `.023+.0075/2=.02675` が意図値で、2回目と一致する。両評価で scale、評価後 dimensions（.0499999970／.00749999983）、raw mesh SHA、evaluated local mesh SHA は同じ。camera pose、focus distance 1.100000023841858、fstop 3.4666666984558105 も同じだった。差は水面物体の高さを決める式そのものやcameraではなく、resetによるscale復帰とdimensions参照の間の評価状態にある。

同じ403.3秒の先行状態から比較した old 対 new は差0。同じ反復をそろえた old 対 new も差0。16代表の復元前後比較では time0 の水2物体の projected bbox 8辺のみが異なり、最大は shaftwater y1 の 18.86188846146183 px、残り15状態は全項目差0。従って**凍結ソースとの意味差ではなく、旧／新どちらにもある履歴依存の未評価状態**が実証された。

ただし旧 job052 の最大差 `.03223879835650223` は元helperに成分値が残っていないため、その過去の数値がどのfieldだったかを遡って断言しない。今回の再現で見つかった水中心変化と投影の履歴依存を原因分類の証拠とする。

`beforeApplyGlobalsOwn=false` は root dispatcher の取消確認 wrapper が外側にあるためで、そのclosureの `original` はD専用globalsへ束縛された旧 applyだった。別episodeを参照している証拠ではない。

## 厳密 restore v3 の条件付き準備

新規 `scripts/blender/desk_axes_d1_r15_restore_v3_20261024.py`、SHA `c5f5f26cafcb9148d1c6cae5bdf13917a68d153b1459662adc9b0770c965cc07`。

```python
nsD1=runpy.run_path(W+'/scripts/blender/desk_axes_d1_r15_restore_v3_20261024.py')['restore'](nsD1, authorized=True)
```

診断で old または new の同関数反復差が実際に `1e-5` を超える場合だけ入れる。この入口条件は job055 の .01497420109808445 m によって満たされた。従って v3 の厳密検証へ進めてよいと root へ連絡した。後述の job058 で v3 の実GUI検証を通過した。

reset が BASE scale を戻した直後に `view_layer.update()` してから `Object.dimensions` setter を使う新規 episode-private wrapper を、old/new の両比較側に同一条件で適用する。固定 r15 の関数/制御配列は元 episode globals、canonical shared main は元 d module globals にそれぞれASTから復元する。元shared sourceは変更せず、元guardの命令列を診断用に正規化して合格させることもしない。

順序は、old16状態の反復strict比較、新16状態の反復strict比較、old対newのstrict比較（元許容 `1e-5` 不変）、独立全12163 plan一致、新342実寸監査（静定303すべて合格、移動中NGは保持）、未改変production runnerのpreflight。いずれか失敗なら関数/制御配列/show/mainをrollbackし、描画しない。成功でも本番開始は別のroot呼び出しであり、最終MP4や視覚の合格を意味しない。

E担当のread-only peer reviewで、同一precondition、strict比較、held303、未改変runner、失敗rollbackの構成に実行阻害は指摘されなかった。Blender同梱 Python 3.13 単体（bpy未import・model未読・render0）で、全FunctionDef AST と元runnerの6関数subset AST の main/plan/pose/set_camera/can_state/visible は全非callable co_* 差0を確認した。これらはGUIでのgeometry証明ではない。

v3実行後には、strict反復の安定だけでなく time0 水中心が意図値 .045／.02675 m に一致することも実値で確認する。reset直後updateがdimensions setter直後の参照まで意図通りにするかは、まだ実証していない。

そのため、新規 no-render 検査 `scripts/blender/desk_axes_d1_water_intent_check_20261024.py`（SHA `5992d382457a9c7f0c5ff558bfbca93458b8c3917851c5beaa64cb1c3e14ce3a`）を準備した。v3成功markerを要求し、異なる3先行状態×6時刻×水2物体の36件について、実height／local centerZ／world centerZが凍結water式の意図値に元 `1e-5` 以内で一致することを照合する。関数をinstallせず、原証拠とsourceを保持する。E担当の全文read-only peer reviewでも致命点は見つからなかった。未実行。

```python
runpy.run_path(W+'/scripts/blender/desk_axes_d1_water_intent_check_20261024.py')['check'](nsD1, authorized=True)
```

出力予定は `/private/tmp/ys/ys-chain-d1v1-render/d1-water-intent-after-v3-20261024.json`。rootだけがGUI queueへ投入する。

## job058 厳密復元の実結果

root は restore-only の別jobとして実行した。2026-10-24 21:00:55 開始、job全体18.703804秒、v3本文18.505秒。`installed=true`、描画0、本番未開始。

実出力 `/private/tmp/ys/ys-chain-d1v1-render/d1-runtime-restore-r15-v3-20261024.json`、SHA `3e8cbcb516484efee43dd3a89985b00fa16b51150c5e1dc0ff096e47e7b1ce23`。

- 旧側16代表の反復、新側16代表の反復、旧対新16代表のstrict比較はすべて元 `1e-5` 以内。最大差は旧54.8秒の `1.8226430711365538e-6`、time0は差0。閾値は変更していない。
- 独立全12163フレームのplan一致（5070 actual render／7093 static duplicate）。
- 新342実寸監査の静定303状態は失敗0。移動中27状態のNGはそのまま記録し、免除していない。これは別のcamera606補正と最終実像確認で扱う。
- 未変更production runnerのpreflightを実通過。canonical shared mainコード・EEVEE・明示scene・凍結source SHA・缶close26フレームと圧力reveal17フレームの全render対象も確認された。

実寸出力 `/private/tmp/ys/ys-chain-d1v1-render/d1-semantic-physical-r15-deterministic-v3-20261024.json`、SHA `b72781bcb82649ae805891d16085307315b4ad1607db96a47b21cbdc9781b7e4`。

## job058a：v3は安定したが水の意図位置にFAIL

専用helperを実行した結果、高さは意図値と一致するが中心はBASE寸法由来で固定されていた。time0 shaft center .05999999865889549 m（意図 .045）、pool .030500000342726707 m（意図 .02675）。time20 shaftは意図 .10362548449320501 mにもかかわらず同じ .05999999865889549 m、34.216667秒も意図 .115 mに対して同じ値。従ってreset直後updateだけでは、dimensions setter**後**のgetterは更新されない。安定した誤位置を合格にして本番へ進めなかった。

実失敗証拠 `/private/tmp/ys/ys-chain-d1v1-render/d1-water-intent-after-v3-20261024.json` を保持する。過去のstrict復元PASSは取り消して隠すのではなく、「反復と凍結コードの一致はPASS／水の意図位置はFAIL」と区別する。

## 明示 private derivative v4

新規 `scripts/blender/desk_axes_d1_r15_restore_v4_20261024.py`、SHA `7ec8ee0c86872a47de4b505fb469d08e8055fd69528fdcba0c5884677f15fcb6`。rootへGUI APIを渡した。元source・元6関数・元runnerは変更しない。元 `mine_state(t)` を完全実行した後、水2物体の中心zだけを**同じwater式の要求height**から直接算出する明示的なruntime派生である。v3 reset評価前提は保持する。寸法そのもの・雨滴・発光・marker・camera・時刻・音声は変更しない。

全16代表について水以外の投影/focus/anchorを元 `1e-5` で比較し、修正後16代表反復も同じ厳密比較をする。意図36件、新342実寸のheld303、独立全12163 plan、未変更runner preflightを全件要求する。水の投影と位置の意図的な差は専用JSONへ残し、旧対新が差0だったという報告にすり替えない。失敗ならv3の元mine_stateへ戻し、本番を開始しない。

`restore` 自体は描画0。別API `render_probe` は全guard成功後だけ、新cache `/private/tmp/ys/ys-chain-d1v1-water-probe-v4-20261024` に0／20／403.3秒の3枚をcanonical mainで撮影する。原cache/他回のsampledファイルとscene保存先を保護する。E担当の全文read-onlyレビューでも致命的実行阻害は指摘されなかった。GPU実行はrootのみ。

```python
v4=runpy.run_path(W+'/scripts/blender/desk_axes_d1_r15_restore_v4_20261024.py')
nsD1=v4['restore'](nsD1, authorized=True)
v4['render_probe'](nsD1, authorized=True)
```

## v4の実結果と3枚実目視

2026-10-24 21:06:18開始。restore14.136秒、3枚probe5.395秒、job全体21.869931秒。非水16代表strict比較の最大差0、修正後16代表反復の最大差0、意図36件の最大差 `6.9800435431588426e-9` m、新held303失敗0、独立plan全12163一致、元runner preflightすべてPASS。移動27件の元NGは保存した。source・元6関数・時刻は不変、runtimeの水中心2値だけを意図式へ直した明示的派生である。

`/private/tmp/ys/ys-chain-d1v1-water-probe-v4-20261024/blender/preview/` の 00000.jpg（0秒）、00600.jpg（20秒）、12099.jpg（403.3秒）をすべて個別に実目視した。坑底からの低水位→高水位→排水後の低水位を明確に読め、黄markerとも一致し、主役は画内。230 sampled旧/他回ファイル不変の実記録もPASS。rootへ水修正を本番へ進められる旨を返した。

実目視・全SHA・数値は新規 `D-1_v4_水位3枚実目視_20261024.json` に記録した。これはraw3枚の確認であって、最終MP4や字幕との合成の合格ではない。

未確認：過去差 .0322388 のexact field、本番、追加camera606枚、最終gateと全編実像。本番完成・全合格ではない。

## job071：本番開始の実記録

rootが投入した別job071の実ログ `/private/tmp/ys/axes-active-queue/job-071-d1-verified-water-production.log` を独立に読んだ。2026-10-24 21:39:01に本番が実際に開始し、100 actual / 5070の書き出しと146秒の進行を確認した。元runnerのstrict preflight、canonical shared main code、明示D scene `Technical chain D-1v1`、EEVEE、元12163 plan（5070 actual／7093 same-state clone）はPASSのまま実行された。agentからGPUを投入していない。

これは開始と進行の観測であり、本番完了・camera606完了・MP4作成・最終検査・全編実目視はまだ未確認。上記の各失敗jobが「描画0／当時の本番未開始」だった履歴は変更しない。
