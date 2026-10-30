# E-1 r9チェックポイント検収（ChatGPT）

## 1. 結論

2026-10-24。最新r9の全473時刻を生成・2D合成・実フォント検査・原特徴集計した。既知の同期・配置・切れ・動的幅を修正し、全54cue/411点と揺れ区間の本番30fps全582姿勢は物理投影PASS。ただし、偏りのない整数全387枚の原7b中央値は.596296で.60未満のNG。全473の.607407だけを採って全合格とはしない。本番11606コマ・完成MP4・最終gateは未実施。rootの指示でここに状態を保存し、本番や追加修正を開始しない。

## 2. 不変入力と承認範囲

正本・台本・日本語・声・cueの語時刻・原検査は不変。54cue、386.843333秒、30fps/11606コマ。声SHA256 `e9318ace4036f12ac4e6984d158d0d7d4853212a9252d8d6bdecea7105ed2707`。字幕中央値1.527秒だけを、承認済み四ID限定1.65秒としてroot外付けrunnerで扱う。7bや顔の例外を加えていない。commit/pushなし。Downloadsへの最終配置と共通カタログ公開はroot担当。

## 3. 作業場所と凍結

W = `/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series`

C = `/private/tmp/ys/ys-chain-e1v1`

最新凍結 `C/e1v1-r9-source-freeze.json`。同名の初回r9はhelper入口のKeyErrorで描画前停止したため、`e1v1-r9-source-freeze-before-helper-fix.json` とjob039 logを保持し、現r9は修正後の凍結。実GUIはrootのjob040（監査）/job041（差分probe）。Metal CLIの再試行はしていない。モデルを新規に増やす再初期化はせず、実E関数globalsへown関数をhotloadした。

## 4. 本当に直した5件

北極移動の誤一致「北極星」70.80秒を、正しい「北極」73.55秒/occurrence1へ修正。30°→50°は「イギリスの南」87.45〜88.25秒で移し、移動中の角度札は隠し黄強調は89.23秒。row39の灰色時計影は毎回(.25,−.05,.13)へresetしてcatalog状態を漏らさない。ログの船本体は約26%だった旧組66%から本体41.9815%へ寄り、砂時計・磁針・人形も全て画内へ。降下前時計の頭切れは、持上げ/静止両位置の実unionを測り静止体42.9815%で全身を収めた。模型の形や寸法、固定の語時刻は変えていない。

## 5. 本体幅と全動作監査

r7のログPは((.252998351,−.100509525,.045803931),.530298615,−15,40,40)、本体41.9815%、全役割部品のunion x52.0〜1028.2/y530.7〜1129.4。振り子Pは((−.3,.104562842,.166516413),.306772614,0,35,40)、静止体42.9815%、持上げ/静止全身union x248.0〜832.0/y161.7〜1498.3。r7の10枚を全て2D合成後に目視した。

r8全54cue/411点監査で、318.8秒の揺れ中だけ74.0093%となりNGを発見。静止時66%でなく、本番30fpsの静定区間全582姿勢を測った最大317.533333秒/74.1759%の実頂点から距離を校正した。最終sway Pは((.25,−.05,.13),.311382294,−25,35,40)、全582姿勢62.0463〜69.0000%、安全域違反0。全54cueの静定後/中央/末尾・全カメラ遷移10分割・動作極値411点も静定違反0（job040、00:42:49）。遷移中を静定の4〜7割合格と偽らない。物理投影だけのPASSで、画像特徴の7bとは別。

## 6. 差分生成と原画像の保護

job041は00:44:18開始/00:47:59 DONE、221.45秒。`C/blender/gate-e1v1-r9/frames` に473JPEGと全要求anchor。実描画105、未変更368はr5へのlink。own mainで全anchorを先に計算し、missingだけを元rendererへ渡す。既存link先を描き直さず、missingゼロは元main自体を呼ばない。元rendererへ空timesを渡して本番全体を誤起動しない。

`C/e1v1-r5-after-r9-immutability.json` はr5 raw全473のsize/mtime/SHA一致、差分0でPASS。入力の基準は `e1v1-r5-raw-before-r9.json`。main/catalog/問題の入口でE sceneを選び、実renderには `scene=d.SC.name` を明示する新規proxyを利用。real bpyや既存共通rendererは変更しない。scene/reuseの実main AST stub試験もmissing限定・全既存skip・外国scene拒否・link元SHA不変PASS（`e1v1-r9-main-guards.json`）。

r6の359秒rawは他episodeのactive scene漏れで00:14:38に更新された事故証拠として保持し、採用しない。r9の359秒は新規生成し、船上の時計影を実目視確認した。

## 7. 原画像特徴と未合格

元 `desk-quality-gate-frames.py` のfeatures/blocks/gmap/corrをread-only importし、元と同じarea270×480で測定した。原検査・閾値・画のmaskは変更していない。

| 標本 | 原subject中央値 | .35未満の割合 |
|---|---:|---:|
| 全473（cue重点を含み時間の偏りあり） | .607407 | 16.0677% |
| 整数0〜386秒の全387（欠けなし） | .596296 NG | 16.5375% |

閾値は中央値.60以上/小さい画20%以下。全473の値だけで合格と判定せず、原7b NGを保持する。自然な既存形状・焦点・構図の改善以外に、測定用の模様や余分な物を追加していない。最終0.5秒刻みの完成MP4/desk検査は未実施。証拠 `C/e1v1-r9-full-probe-frame-features.json`。

## 8. 目視と文字の範囲

r5の48シート/全473枚は既に全目視済み。r9では全473合成を再生成し、367枚はr5とJPEG byte一致。新raw105＋題wrapperの1枚、計106差分が入る16シートを全て実目視した（1,9〜12,31〜33,37〜41,43〜45）。隣接する未変更コマも含む。その後r9の2〜7も追加で実目視し、最新の直接表示は22シート/220枚。差分台帳 `C/e1v1-r9-differential-review.json`。最新の全473を一から再目視したとは呼ばず、旧全目視＋367枚のJPEG byte一致確認＋106全差分目視で現在の全473を漏れなく覆った根拠と区別する。PNGのbyte一致とは呼ばない。

73秒まで0°、74秒北極への移動、75秒90°、88秒移動中は角度札なし、89秒50°、ログの1〜5と砂時計/磁針、時計全身、swayのrod/bob、ghostの船上reset、359秒の正常再生成を確認した。r9の作用説明318.8/319/320秒ではrodとbobの変化が見え、下端の一部と字幕が重なる時刻もある。321秒以後は論理札が時計盤上端の一部へ重なるが、支点/rod/bobと針の下側は見える。無遮蔽と誇張しない。326.9秒以後は規定の全画面反応顔のため3Dを見せない。

全473の実SVG/実フォントは枠外・札外・36px未満のerrors=0（`C/review-e1v1-r9-allcue/e1v1-svg-actual-preflight.json`）。主要12の2D一覧も実目視済みで、比較画像12枚を生成した。最新比較12枚を全て拡大検収したとは未確認のため書かない。

## 9. 静止・空白・冒頭末尾と顔

整数全387の原静止最長7秒（310〜317）、次6秒（168〜174）、空白条件の連続区間0、壁帯あり94.3152%。規定は静止8秒未満・空白2秒未満。1秒probeの予備結果で、最終0.5秒検査ではない。

題は共通指示の0〜2秒へ合わせ、rootの新規private compositorで題groupだけを1.5〜2.0秒fadeした。既存compositor/検査/日本語/fontは不変。原相関は整数始終.918213、冒頭末尾2秒の実標本最大.918641。追加maskなし。反応顔の描画や時間はcanonical/shared仕様のままで、rootが確認中の指示との食い違いを勝手に例外扱いしない。全画面顔中は回の札を出さず、smallの丸顔と区別した。

## 10. 天体・敬意・声・音

数値式の根拠は `C/e1v1-r9-world-data-proof.json` PASS。緯度10点、東+28°の南中103.4643605秒/西−28°106.8636395秒、高度とも40°、恒星方向は平行(0,−1,0)、甲板観測点から太陽位置と寸法を一様.65倍。実写可読性の代用にはしない。行13の仰角30→15°/az−20°と海図az−15→0°は新規撮影台本に理由を記録し正本は不変。

事故の4隻は岩の前で20°傾きα.5へ薄れるだけで、沈下・破壊・跳ねなし。最初6行は静かなpad/遠い海/低く短い鐘、喜ぶ得点音なし。Nemo3種はroot再確認exit0、54文読み不一致0、男46/女8、話者不一致0。新規mix機械値は−14.3LUFS、peak−.7dBFS、−35dB/.25秒無音区間0。耳での全編視聴は未実施。

## 11. 部品と問題

最終承認済みcatalogは `C/blender/gate-e1v1-r5/catalog` の11種×斜め/上、22枚全て実目視済み。stemsはe1v1_chart/fleet/ship/observer/southern/dial/torch/arc/log/pendulum/prize。r6以降はモデル形状を変えておらずこの写真は有効。公開と共通MD追記はroot担当。

問題は `C/problem/挑戦.png` と `答え.png`、1080×1920。rawと最終2Dの両方を実目視済み。船の昼12時/London10時、答えだけに「2時間 早い → 東へ 30度」と東30°弧。本編へ答えを挿入しない。

## 12. 最新ソース・文書・証拠

主な新規E1ソースは `W/scripts/blender/desk_e1v1.py`、`desk_lib_e1.py`、`desk_e1v1_hotfix_r9.py`。新規umechは `desk-e1v1-{data,overlay,preview,review,problem,export}.mjs`、`mix-chain-desk-audio-e1v1.py`、`publish-desk-e1v1-catalog.mjs`、`audit-desk-e1v1-{static.mjs,frames.py,world.py,main-guards.py,ends.py,plan.py,overlay.mjs}`、`review-desk-e1v1-r9.sh`。旧r3〜r8 helperは履歴として保持する。

root所有の新規拡張は `desk_render_axes.py`、`desk-axes-frame.mjs`、`desk-axes-render-entry.mjs`、`desk-axes-text-metrics.mjs`。E1はimportするだけで共有旧ソースを編集していない。描画cacheのplanコピーだけseriesを「E 時間と位置 1」にし、canonical/元planは不変。

最終JSONは `C/e1v1-r9-final-checkpoint.json`。最終sourceaudit `C/e1v1-r9-checkpoint-source-audit.json` は凍結対象16ソース差分0/声SHA一致、本番deskなし/完成MP4なしを確認した。

文書は `W/docs/video-revision-20260924/deep/E-1_撮影台本_ChatGPT.md`、`E-1_机の部品カタログ追補_ChatGPT.md` と本書。r5全検収/r8〜r9監査過程の旧報告も履歴として残す。画像は `C/gate-e1v1-r9`（主要12/比較）、`C/review-e1v1-r9-allcue`（全473/48シート/SVG/manifest）、証拠JSONは各章のパス。

## 13. 未確認と停止点

原7bの整数中央値NG、rootが確認する顔/指示の食い違いを残して状態保存する。全11606コマ、本番MP4、最終0.5秒原gate、四ID限定字幕runnerの本番結果、qx-verify/mxr-review、本番全秒/全cue末尾、音の全編視聴は未実施。最新473の機械検査・全差分目視と、22部品・問題2枚の生成/目視は完了したが完成動画とは呼ばない。これ以上の3D・修正・本番は開始せず、必要な承認はrootがユーザーへ確認する。
