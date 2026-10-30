# C-1 制作中断レポート（ChatGPT）

2026-10-23。完成動画ではない。全関門合格でもない。不可変の字幕・声・時刻と、既存 gate 8 の上限が両立しないことを確認し、本番レンダー前に停止した。日本語・字幕・読み・声・時刻・共通検査は変更していない。

## 1. 動画と現在地

- 回：C-1「パスカルは、なぜ歯車に足し算をさせた？」。
- 固定音声の長さ：360.45000000000005秒、正本43行、53 cue、字幕215区切り。
- 本番の想定コマ数：10814（30 fps）。全コマの本番レンダーは未実施。
- 動画予定パス：`/private/tmp/ys/ys-chain-c1v1/out/ys-chain-c1v1.mp4`。このファイルはまだ無い。Downloadsへの完成品配置も未実施。
- 1080×1920・EEVEE 16 samples の主要12時刻、部品カタログ20枚、問題用3D2枚まではGUI Blenderで生成した。新しい構図修正後の13試写は未実施。

## 2. 停止の根拠：不可変字幕の gate 8

既存 `desk-frame.chunkTimes` を直接呼び、既存 gate と同じ未丸め値を並べ、`v[Math.floor(v.length/2)]` を使った。各回を別のNodeプロセスにして phrase-times のキャッシュを混ぜていない。

| 回 | 厳密な中央値（秒） | gate表示 | 区切り数 | 0.4秒未満 | inexact | 判定 |
|---|---:|---:|---:|---:|---:|---|
| B-1 | 1.5090000000000146 | 1.51 | 213 | 0 | 0 | NG |
| C-1 | 1.502999999999986 | 1.50 | 215 | 0 | 0 | NG |
| D-1 | 1.6100000000000136 | 1.61 | 236 | 0 | 0 | NG |
| E-1 | 1.527000000000001 | 1.53 | 235 | 0 | 0 | NG |

C-1の最短は0.5470000000000255秒、最長3.603666666666669秒。0.5秒未満も0。中央値の上限1.5秒を0.003秒超える。表示が小数2桁で1.50となることは、合格の根拠にならない。

独立集計の証拠：

- `/private/tmp/ys/ys-chain-c1v1/caption-audit-allaxes/all-axes-gate8.json`
- `/private/tmp/ys/ys-chain-c1v1/caption-audit-allaxes/all-axes-gate8.md`
- 同フォルダの `ys-chain-{b,c,d,e}1v1-gate8.json`。各回の全区切りdurs、開始時刻、字幕、入力SHA256、検査・chunkTimes関数SHA256を保存。
- 全4本とも、監査前後の入力SHA256一致。原稿・plan・timed JSON・phrase-times・支給voiceを読み取るだけで、書き換えていない。

必要な判断は「不変の声・cap・時刻を維持したまま、この中央値超過をどう扱うか」。字幕の再区切り・時刻の移動・声の再生成・検査閾値の変更・判定の丸めによる回避は行っていない。

## 3. 既存の自動検査本体の全結果（MP4無しの暫定）

2026-10-23 20:33 JST、既存 `desk-quality-gate.mjs` 本体も終了コード1で完了。独立集計と同じく項目8をNGにした。

```sh
DESK_ALLOW_MISSING=1 EM_FILM_CACHE=/private/tmp/ys/ys-chain-c1v1 \
node scripts/umech/desk-quality-gate.mjs ys-chain-c1v1 \
  --script docs/video-revision-20260924/ytseries/chain-c-1.mjs \
  --md docs/video-revision-20260924/deep/技術の疑問の鎖_C-1_第1版_ナレーション.md \
  --cache /private/tmp/ys/ys-chain-c1v1 --no-voice-checks --no-compare
```

| No | 既存検査の項目 | 判定 | 出力された値 |
|---|---|---|---|
| 1 | はみ出し（SVG：画面の枠） | OK | 0件／320コマ（一瞬だけ0） |
| 1c | はみ出し（SVG：字が札の外へ） | OK | 0個・最大0px |
| 2 | 36px未満の文字 | OK | 0件 |
| 3 | カメラが動く割合 | OK | 7.3％（786／10814コマ） |
| 5 | 同じ構図の長さ（何も動かない） | NG | MP4が無い |
| 8 | 字幕の区切りの表示時間 | NG | 中央値1.50秒・0.4秒未満0個（0.5秒未満0／215個） |
| 9 | 音量・無音 | NG | MP4が無い |
| 10 | 冒頭と最後の画 | NG | MP4が無い |
| 11 | 既存の確認 | OK※ | 1本を確認。chain-desk-lint問題なし |
| 12 | 見本との見比べ画像 | 省略 | --no-compare（合否に使わない項目） |

※ 項目11は本体の表示をそのまま記録したもの。この実行ではNemo3検査を省略し、qx-verifyも未実施であり、これら全体が合格したとの意味ではない。

本体が報告した不合格は4項目：5、8、9、10。`world_source:null` であり、項目4（真上）、6（壁・窓）、7（物の少なさ）、7b（主役の大きさ）、1b（MP4端の文字）は測定されていない。省略を合格として扱わない。

また、`DESK_ALLOW_MISSING=1` で既存の12試写を背景に使った暫定SVG検査。本番の全コマと全時刻のanchorsは無いので、窓数字などのアンカー札を含む完成状態の検査ではない。

- ログ：`/private/tmp/ys/ys-chain-c1v1/c1-existing-gate-preflight.log`
- 本体JSON：`/private/tmp/ys/ys-chain-c1v1/quality-gate.json`（`pass:false`）

## 4. 共通11章の条件との照合

| 条件 | 現在の結果 |
|---|---|
| 字幕＝正本 | chain-desk-lint問題なし。43行→53 cue、215区切り、最大13.0字幅 |
| check-readings | root再実行exit0、53 sentences・0 reading mismatches |
| prosody | root再実行exit0 |
| prosody-speaker | root再実行exit0、10001:44 cue／10005:9 cue、合わない0 |
| qx-verify | 未実施。完成MP4が無い |
| mxr-review | 未実施。全3Dコマが無い |
| desk-quality-gate全部 | 不合格。上記の暫定結果。gate8は入力そのものの不合格 |
| カメラ移動2割以下 | 試写キャッシュ7.268％。撮影台本の予定移動27.7秒／7.685％ |
| 真上2割以下 | 撮影台本の仰角65°以上27.043秒／7.502％。全映像の画像判定は未測定 |
| 主役4〜7割・小さい画2割以下 | 未合格。試写で8歯車の端切れを確認。修正候補は未再撮影。7b全コマ測定は未実施 |
| 物の少ない画面2秒以上なし | 全コマ未測定。筆算紙の距離を再調整したが未再撮影 |
| 札の枠・字のはみ出し0 | 暫定SVGは0。全anchors付き本番は未検査 |
| 36px未満なし | 暫定SVGは0。問題準備の2D数字48px・桁札36pxを目視 |
| 冒頭と最後が同じ物・姿勢 | 現在の試写は同姿勢だが最後のM1は一部だけ。両方を同じ新姿勢へ直した候補は未再撮影 |
| 全1秒コマ・全cue終わりを目視 | 未実施。完成MP4・全3Dが無い |
| 合わせる語と動作 | 数とイベントの対応は実装。主要12枚は確認。全行の連続した動作は未確認 |
| 数のassert | PASS。27＋18、7＋8、桁の順序、9999＋1と4腕・5歯車、999＋1と3腕、7×3、腕0/60°、得点列 |
| 問題編準備 | 2枚とJSONあり。3D原画・2D数字・答えの1/2/3も保存、目視済み |
| 既存ファイル | C1担当は新規C1ファイルのみ。OVERLAYS登録はroot担当。入力不変と旧2本のSVG/PNG回帰証拠は下記 |

Nemo確認ログ：

- `/private/tmp/ys/ys-chain-c1v1/c1-check-readings-root-confirm.log`
- `/private/tmp/ys/ys-chain-c1v1/c1-prosody-root-confirm.log`
- `/private/tmp/ys/ys-chain-c1v1/c1-prosody-speaker-root-confirm.log`

rootの入力・回帰証拠：`W/outputs/axes-20261023/immutable-inputs-and-regression.json`。全4本のplan/timed/phrase/voiceは支給backupとSHA一致。旧1-1v6・1-2v2の全SVG 26509コマのSHAと144枚のPNGは一致。ただし、既存MP4の再エンコード後cmpは未実施（証拠JSONでも `mp4ByteComparison:false`）。

## 5. 音の準備

支給 `ys-chain-c1v1.wav` は上書きせず、新規 `ys-chain-c1v1.mixed.wav` へ合成した。

| 項目 | 値 |
|---|---:|
| mixed WAV integrated | −14.2 LUFS |
| mixed WAV true peak | −1.2 dBFS |
| −35dB以下0.25秒以上 | 0区間 |
| 元voice SHA256 | 57565f6d6f812410201859591b435be76279b36156acaa5baae19d0bdf358a48 |
| 支給voiceと保持コピー | SHA一致・元ファイル不変 |

`/private/tmp/ys/ys-chain-c1v1/ys-chain-c1v1.levels.json`、同 `.mix.json`、`c1-mix.log` に保存。音楽のsolve/solved/dark/toll/after、after後のbase復帰、盤のカチ、腕4段、ししおどし、紙、メーター、得点の時刻を設定した。耳での確認とMP4へ入れた後の再測定は未実施。

## 6. 作った新規ファイルと部品

以下はWからの相対パス。既存共通ライブラリや検査は編集していない。

- `scripts/blender/desk_c1v1.py`：GUIアダプタ、場面、時刻状態、手、カメラ、anchors、再開レンダー、catalog、12＋補足試写、問題関数。
- `scripts/blender/desk_lib_c1.py`：M1、M2、出っぱり、おもりの腕、8歯車模型、走行距離メーター、ししおどし、ドミノ、パスカル人形、紙、試作36箱。
- `scripts/umech/desk-c1v1-data.mjs`：共有digits/events、計算assert、撮影台本・データ・問題JSON。
- `scripts/umech/desk-c1v1-overlay.mjs`：札、筆算、窓数字、論理、得点。
- `scripts/umech/mix-chain-desk-audio-c1v1.py`：非破壊mix。
- `scripts/umech/desk-c1v1-preview.mjs`：試写12枚の字幕・札の合成と見本との対比。
- `scripts/umech/desk-c1v1-problem.mjs`：問題画像の2D数字・桁・番号。3D原画も保持。
- `scripts/umech/desk-c1v1-export.mjs`：元voiceを上書きしない新しいrender-cache経由の本番書き出し。まだ実行していない。
- `scripts/umech/check-c1v1-overlays.mjs`：53 cue×6時刻、計318時刻のSVG生成確認PASS（共通gateの代替ではない）。
- `scripts/umech/check-c1v1-captions.mjs`、`check-axes-captions-c1v1.mjs`：未丸め字幕監査。
- `docs/video-revision-20260924/deep/C-1_撮影台本_ChatGPT.md`：全53 cueのカメラ数値、主役幅、物・手・動き、語と秒、札、顔。
- 同 `C-1_机の部品カタログ追補_ChatGPT.md`、`C-1_史実と制作上の確認_ChatGPT.md`、本レポート。
- `docs/video-revision-20260924/deep/部品カタログ画像/c1v1_*.jpg`：新規20枚。元のカタログ画像は変更していない。

部品カタログ原画：`/private/tmp/ys/ys-chain-c1v1/blender/catalog/`。斜め上と真上の各10枚。最初の20枚は全て目視し、更新版の部品対比10枚も個別に目視した。同じ光・素材・角丸の模型として見えるが、ししおどしの最終候補など未再撮影の修正が残る。

ChatGPT用の固定台本書き出し：`/private/tmp/ys/ys-chain-c1v1/script-export/ys-chain-c1v1.md`。

## 7. 比較画像と問題準備

- 関門Bの部品比較10枚：`/private/tmp/ys/ys-chain-c1v1/gate-b-c1v1/compare-*.jpg`。全10枚を個別に目視。
- 関門Cの主要12枚：`/private/tmp/ys/ys-chain-c1v1/gate-c-c1v1/c1v1-01.png`〜`c1v1-12.png`。
- 主要12枚の見本対比：同 `compare-c1v1-01.jpg`〜`compare-c1v1-12.jpg`、同 `compare-c1v1-all12.jpg`。全12枚を個別に目視。
- 主要時刻：1.1、31.729666666666667、63.1、89、104.44、131.862、155.3、217.18566666666663、234.356、260.389、274.7106666666667、358.7秒。
- 問題：`/private/tmp/ys/ys-chain-c1v1/problem/挑戦.png`、`答え.png`。00999で3腕上／01000で3腕下を目視。2D数字と桁・番号を追加した2枚も目視。
- 原3D：同 `挑戦_3D.png`、`答え_3D.png`。合成SHA：同 `composition-c1v1.json`。
- 問題JSON：同 `problem.json`。正本「問題編への接続」の節をそのまま保持、部品一覧・数字・3回も記録。
- 本回の全1秒コマ一覧・cue終わり一覧：未作成。見本の全コマ一覧50枚は全て見た。

## 8. すでに直した点

- 8歯車に5桁用アーム配列を参照していたIndexErrorを修正。
- M1のふた内の歯車、読み位置の矢印、小歯車の縮尺、目盛り盤と指の回る向きを修正。
- 9→0になった腕だけを落とす。腕は数字に応じて0〜60°、落下0.15秒、連鎖0.25秒。
- 箱の落下・ふた・接点の光・4腕の光・得点の膨らみが、静止画複製で失われないようscene keyを修正。
- 数字は同じeventsからM1/M2/2Dへ供給。繰り上がりで変わった桁だけ黄色にする。
- 札を実際にsharpで測る。勝負札の「機械」が2行に割れたため420px幅へ修正。
- 論理「だから」は予言の長い札と重なるためy680へずらした。
- 音は支給voiceを保持し別mixedへ。正規化を反復し−14.2 LUFSへ調整。

## 9. 実装したが未再撮影の修正候補・必要再試写

以下はソースと撮影台本にはあるが、現在の12枚に反映されていない。合格と扱わない。

| 対象 | 現在の試写の問題 | 未再撮影の候補 |
|---|---|---|
| 冒頭・紙崩れ・最後 | 最後のM1が右端の一部だけ | 両端を同じP((−.30,.015,.04),.93,−65,45,40)へ。物は移動しない。投影計算上、紙は横幅66.2％、M1全体も枠内。実写未確認 |
| 筆算紙 | 距離.52の3Dは木目85.5％、空画面検出の境界 | 距離.49、計算上の紙幅約69％。実写未確認 |
| 全5歯車 | 距離1.05では幅が大きめ | 距離1.35、約70％幅を狙う。実写未確認 |
| 8歯車 | 左右端の歯車が切れている | 距離1.85で全8個を収める。歯のひびを3Dアンカーへ付ける。実写未確認 |
| ししおどし | 石が倒れる側と反対 | 石を左、口がゆっくり下がり→一気に倒れる回転へ変更。水の流れも追従。実写未確認 |
| 行21のM1と筆算 | 紙の答えを同時に見せる確認が不足 | order見る点y−.18と2D筆算45を追加。171.8秒を補足試写に追加。未撮影 |

再開を承認された場合の最初の手順は、GUIで `desk_c1v1.py -- --cache /private/tmp/ys/ys-chain-c1v1 --gates --force` を新しくrunpyすること。catalog→主要12＋補足171.8→問題2枚を生成し、その後previewヘルパーで再合成・全枚比較する。本番より先に関門B/Cをやり直す。

## 10. 残る懸念・疑問・未確認

- gate8の矛盾が解決されない限り、映像をどれだけ直しても「全自動検査合格」とはならない。
- 腕の式 `60×d/9` は指定された説明模型。実物ソトワールの持ち上げ時期とは一致しない資料がある。正本・指定式は直さず、史実確認メモに記録した。
- 行38の制作表は「ありませんでした」の後に得点、固定台本・cue時刻・scoreは「高くて」。固定台本の時刻を優先し、文言や声は変えていない。
- 行34のドミノは、固定台本の全画面の顔が大部分を隠す。台本を変えて見せることはしていない。
- 関門Cの修正候補、全7b、物の少なさ、静止時間、冒頭末尾相関、全1秒コマ、全cue終わり、MP4音量・デコード・同期は未確認。
- 耳での確認、見本動画を通し再生する確認、本回の完成動画の通し再生はしていない。
- 本番書き出し時間は未実施のため無い。試写の厳密な全経過秒は記録できていない（既存12枚の生成時刻は20:12〜20:13 JST）。
- git commit・pushは行っていない。完成MP4も納品していない。

この状態の新規ファイルと証拠を残して停止する。ユーザーの判断なしに字幕や検査を変更して続行しない。
