# D-1 r15 本番再開・最終検証の入口

ユーザーが承認した補完は、原7b／sparseの数値と実像が食い違う場面について、元NGを保持し、実寸と実目視を併記することだけ。全域免除でも、他の検査の免除でもない。台本・声・字幕・日本語は固定、commit／push無し。共通255行・D1個別225行を再度全文読了してから準備した。

以下Wはrepository root、OLD=`/private/tmp/ys/ys-chain-d1v1-render`、P=`/private/tmp/ys/ys-chain-d1v1-production-r15`。本書は実施手順であり、未実行の本番や検査を成功とするものではない。

## 1. 凍結入力

|ファイル|SHA-256|
|---|---|
|`scripts/blender/desk_d1v1.py`|`004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2`|
|`scripts/blender/desk_lib_d1.py`|`742d96fcde56f4a2c0eb066600a6428c983a2f96d5b4907824cf4a39f31b7923`|
|`scripts/umech/desk-d1v1-overlay.mjs`|`9e1105b7a0c4a077b9f4a9067a31760882398304460132ecb22b78ab50ad4a2f`|
|data|`eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44`|
|供給声|`74b0951c096caea1be50a5442030cac089dc51c41ea076987bd7633fe369d0ab`|

## 2. GPU投入はrootだけ

入口は新規`W/scripts/blender/desk_axes_d1_r15_production.py`。現在の最終namespace`nsD1`を使い、別GUI／CLIは起動しない。必要なglobalsは次。

```python
runpy.run_path(W+'/scripts/blender/desk_axes_d1_r15_production.py', init_globals={
  'nsD1': nsD1,
  'D1_PRODUCTION_AUTHORIZED': True,
  'D1_RENDER_NOW': True,
})
```

`D1_RENDER_NOW`を省けば、関数code・元shared-main・計画の照合だけで、描画もファイル作成もしない。同じ源の中断再開だけは`D1_PRODUCTION_RESUME=True`を明示し、同じ開始記録とplan SHAを要求する。完了済みや別版は拒否する。

## 3. 既存出力を守る設計

出力は新Pだけ。OLDは読み取り用で、生3Dや旧JSONを書き換えない。P内に固定入力へのlinkを作り、mainのcache／seed／camera-motion／render-logもPに隔離。ほかの回からのcopyは0。各旧rawフォルダの端画像・meta等のSHAを前後で保持し、既存／他回の変更があれば停止する。

自作mainは、変更しない`desk_lib.main`のcodeを複製globalsで利用する。元mainとDの実関数が凍結源と一致することを、命令・定数・名前・flags・行情報等の全code属性の再帰比較でassertする（marshalのinterning由来の偽差分は使わない）。renderには既存のD専用explicit-scene proxyを通し、自分のsceneを指定する。共有bpyや原検査をmonkeypatchしない。

承認済みEevee engineをassertし、production/outと既存出力のsymlinkを拒否する。描画／検証中に例外が出ても、finallyでその呼出のエラーと旧／他回sampledファイルの前後保全結果を記録する。全rawのSHAを計測したという意味ではない。

## 4. 枚数とSPANS

12163フレーム、405.4046667秒、30fps、1080×1920、16samples。5070実レンダー、7093同一状態dup。すべてのdupは既に実レンダーする過去frameを参照する。全移動1012frameの誤dup0。

- 缶close：123.183667〜123.983667、frame3695〜3720の26枚は全render。
- 圧力矢印reveal：133.320667〜133.820667、frame3999〜4015の17枚は全render。

終了時に全12163JPEGの存在／size、全5070done、全アンカー長、meta／anchors key、固定data／声／源のSHAをassertする。開始／終了／保全記録はP内の`d1-production-*.json`、`d1-protected-*.json`。

## 5. MP4（rootとCPU枠を調整してから）

```sh
EM_FILM_CACHE=/private/tmp/ys/ys-chain-d1v1-production-r15 node scripts/umech/desk-d1v1-export.mjs
```

既存export helperは全画像・アンカー・meta／key・mixと供給声のSHAを確認し、rootのprivate title wrapper経由で変更しない元encoderを使う。既存MP4を上書きしない。出力予定は`P/out-final-d1v1/ys-chain-d1v1.mp4`。これはまだ実行結果ではない。

## 6. 原検査を全実行して原NGを保存

```sh
EM_FILM_CACHE=/private/tmp/ys/ys-chain-d1v1-production-r15 node scripts/umech/desk-axes-d1-final-checks.mjs /private/tmp/ys/ys-chain-d1v1-production-r15/out-final-d1v1/ys-chain-d1v1.mp4
```

まず元chain-desk-lint、check-readings、prosody、prosody-speaker、mxr-reviewを明示実行し、Nemoに接続できない場合も省略成功にしない。続いて元qx-verifyと元quality-gate、既存の4ID限定字幕1.65loaderを実行する。原frame抽出のNPZも`P/final-gate-d1v1-r15/d1-original-frame-samples.npz`へ保持。原JSONのpass／NGは書き換えない。必須検査失敗、7／7b以外のNGやqx失敗は終了1。7／7bが残れば証拠待ちとして終了2（合格ではない）。元の全表はログ／JSONへそのまま保存される。

共通指示の「物の少ない画面は2秒以上なし」は、原検査の校正された4秒基準とは別に計測事実を保存する。原7が通っても2秒以上なら自動成功にせず、同じ場面別の実寸／実目視補完待ちとして終了2にする。原の表・閾値は変更しない。

## 7. 実寸補完は候補と承認を分ける

上記helperは原NPZから`P/d1-supplement-requests.json`を作る。subject中央値候補／small／sparseを0.5秒の実時刻で列挙するだけで、自動承認しない。

候補が存在する場合だけ、rootのGUIキューで新規`W/scripts/blender/desk_axes_d1_r15_supplement.py`を、`nsD1`と`D1_SUPPLEMENT_AUTHORIZED=True`でrunpyする。描画はしない。D自身の実表面監査のサンプリングだけをprivate scopeで候補の正確な時刻へ置換し、意味別主役・実mesh投影・重要部guardは同じまま使う。

結果`P/d1-physical-supplement-r15.json`は全原NGを保持し、実寸が不適切な物、切れ、重要部／字幕の衝突を成功扱いしない。移動中の不足も削除しない。実像を見ずにcandidateへapprovedを立てない。全域の基準変更や他のgateの置換は禁止。

## 8. 完成MP4からの全1秒・全cue末尾

```sh
EM_FILM_CACHE=/private/tmp/ys/ys-chain-d1v1-production-r15 \
D1_FINAL_AUDIT=/private/tmp/ys/ys-chain-d1v1-render/d1-source-audit-r15-plan-proof.json \
D1_SUPPLEMENT_REQUEST=/private/tmp/ys/ys-chain-d1v1-production-r15/d1-supplement-requests.json \
node scripts/umech/desk-d1v1-review.mjs
```

実MP4から全406整数秒、57cue末尾、主要12、camera移動途中、最後の修正に重要な時刻、すべての補完候補を抽出する。要求理由とframe／画像SHAをmanifestへ保存し、406／57が揃わなければ停止。主要12は以前と同じ適切な見本時刻を使う。

生成後は全シートを実際に目視し、重要局所は原寸の画像でも確認する。抽出済みを目視済みと報告しない。元NGと実寸／実像の不一致を、対象cue／時間区間ごとに記録して補完する。実際に小さい／読めない／欠落する画は、承認対象に混ぜず直す。

## 9. 最終報告

原の検査表を全項目そのまま載せ、承認された補完を別表で付ける。元合格と補完済みを混同しない。新しい実寸／実目視の裏付けが揃わなければ未完了。最終MP4のpath、尺、57cue、実時間、全画像一覧、主要12比較、カタログ26枚、問題2枚、固定入力SHA、未確認の実聴などを13章形式へ反映する。

現在は本番runnerと検査・確認の入口の準備のみ。最終の実検査／実目視は完成MP4後に担当する。

## 10. 開始前guard停止と正規のruntime復元

2026-10-24 19:10:48、job049は0.127718秒で、runtimeの`plan_d1` codeが凍結源と厳密一致しないことを検出して停止した。描画開始前で、新Pは未作成。`job-049-d1-production.log`／`.done.json`はrootのqueue folderへ失敗のまま保存し、元guardを削除・緩和していない。

原因となり得る具体的な経路は、r15 label入口が使う`reload_r10.install`のNAMESに`plan_d1`が無いこと。SPANS／EVENTSは再評価するが、関数自体とその行情報は以前のhot-loadのまま残り得る。実runtimeの差が行情報だけか命令も含むかは、次のGUI復元記録が出るまで断定しない。

新しい入口`W/scripts/blender/desk_axes_d1_r15_restore.py`はSHA`712ee8d5abb644b445d6b962429f7415e7b346239b820575cc8288948396170f`で凍結。元episode globalsへ、確定源ASTの全top-level関数とD1_POSES／SPANS／EVENTSを再インストールする。d.show／show_treeは同じglobalsへ結び直すため、VIS_QUEUEのコピーずれを起こさない。モデル／材質の再構築や源の変更、描画は行わない。

独立したJSON＋AST scheduleで全12163 planの完全一致（5070 render、7093 dup、79SPANS、425EVENTS）を要求し、16代表時刻の実evaluated頂点投影・anchor・focusを復元前後で比較する。さらに、SHA固定の元runnerをそのまま無描画preflightして全guardを再通過させる。途中失敗はruntimeのbindingsを戻し、sceneを復帰して証拠を保存する。ローカルのpy_compileとbpy無しschedule検証は通過、実GUI検証はまだ未実施。

rootだけが次を実行する。PASSの後だけ、同じ`nsD1`を既存runnerへ渡す。

```python
d1restore = runpy.run_path(W+'/scripts/blender/desk_axes_d1_r15_restore.py')
nsD1 = d1restore['restore'](nsD1, authorized=True)
```

証拠の予定pathは`OLD/d1-runtime-restore-r15-20261024.json`。rootは新規wrapperとjob052を用意済み。現在のC本番へ触れず、その完了後にroot queueで実行する。本段落は予定と静的確認の記録で、復元成功／本番完成とは扱わない。

## 11. 本番の開始／完了後に点検する実ファイル

開始通知後はrestore JSONの`status`、各code差分、全12163 plan一致、16代表projection比較、VIS同globals、元runnerのpreflightを独立に読む。`P/d1-production-started.json`の源／plan SHA、Eevee、自分のscene、12163＝5070＋7093を確認する。途中のmeta.doneは進捗であって、終了の証拠ではない。

完了後は`P/d1-production-finished.json`と`P/blender/desk/meta.json`／`anchors.json`、全12163JPEGの実在、5070 done、全アンカー長、旧／他回sampledファイル不変、固定声／mix／dataのSHAを確認する。sampled保全を「全rawのSHA検査」と言い換えない。元の失敗job049は残す。

CPU枠をrootと調整してから、§5のexport→§6の原全検査→候補があれば§7のscene別実寸→§8のactual全範囲抽出を順に実行する。静的選択計算では、補完追加前530画像に、全406整数秒・57cue末・主要12・33移動途中が含まれることを確認済み。実MP4で同じカバレッジが揃うことを再assertし、全一覧を実際に見る。

主要12については、全範囲actual manifestができた後、次の新規helperで原寸1080×1920同士の個別12比較を生成できる。D側は既に抽出した実MP4画像だけを使い、見本側も指定の12時刻を実MP4から読む。SVG／3D背景だけで代用しない。生成は目視の代用ではなく、全12枚の実視認が別途必要。

```sh
EM_FILM_CACHE=/private/tmp/ys/ys-chain-d1v1-production-r15 \
node scripts/umech/desk-axes-d1-major12-review.mjs
```

予定出力は`P/major12-actual-d1v1-r15/d1v1-major-01.jpg`〜12と`d1-major12-manifest.json`。helperのSHAは`e91b77e6148dc553d7e028b7eb298fdee3621d600ef7727666be258a66fa8968`、構文確認のみ通過。実行／実視認は未実施で、元検査NGは別表のまま保持する。

最終報告へ残す指示上の疑問：個別行32は「1往復4秒、声の間に2往復」だが、固定`eng:repeat` cueは265.860〜270.722667の4.862667秒しかなく、4秒周期の2往復（8秒）は収まらない。現r15は4秒周期で、この区間は全render、約1.2往復の予定である。音声／字幕／時刻を勝手に伸ばさず、実出力を確認した上で、原指示の数値矛盾として正直に報告する。rootへ内部共有済みで、これを達成済みとは数えない。
