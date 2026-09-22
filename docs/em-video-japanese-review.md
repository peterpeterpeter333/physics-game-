# 電磁気動画100本：日本語と画面の対応の確認一覧

## 結論と確認範囲

主語の不足だけではありません。抽象的な言い換え、何を指すか分からない表現、条件の省略、量の名前の混同、そして説明中に図や式が別の内容へ切り替わる問題が、初級・中級・上級に残っています。難しい計算を削ることより、説明対象を一つに特定できるようにする修正が必要です。

対象はローカルのPhysics Quest、HEAD `7b067b9` にある大学電磁気の40単元・MP4 100本です。App Store配信物そのものを確認したものではありません。

実際のMP4から、315場面・632発話のそれぞれの中央時点を画像化し、100本分の632画面を目視しました。動画の全時間を連続再生して見たのではなく、音声も聴取していません。従って「全動画を音声込みで視聴した」監査ではありません。発音・音声の聞き取りやすさ・確認時点の間だけに出る表示は未確認です。

以下は、以前の台本レビューの184件と、今回の画面確認で記録した171件、合計355行の指摘記録です。同じ文章への別観点の指摘や同じ原因の再発箇所を含み、独立した欠陥がその件数あるという意味ではありません。今回は見つけた記録を省略せず掲載しましたが、取りこぼしがないことを保証するものではありません。

想定する学生は「物理・数学に苦手意識があり、専門用語から対象をすぐ想像できない大学1年生」です。実際の学生テストではなく、この学習経験を想定した編集レビューです。偏差値から個人の理解力を断定していません。

## 表の読み方

- **文章**：以前抽出した字幕・台本の表現上の負荷。今回確認した画面で補える場合もあり、全件が文法の誤りという意味ではありません。時刻は該当字幕の表示区間です。
- **画面**：実際のMP4の確認時点で見つけた図中の日本語、見出し、字幕と図・式の食い違い。時刻は確認フレームの秒数です（見出しの0秒は動画全体の見出しを指します）。
- **表示不具合**：日本語の誤りとは別分類。式を指す説明が成立しなくなるため、関連箇所として含めました。
- 「原文抜粋」は全文ではありません。画面内の改行は詰めています。修正方向は検討用の短いメモで、完成台本ではありません。
- MP4リンクはローカル原本。確認画像リンクは一時フォルダのコンタクトシートで、削除されると開けなくなります。再抽出は `scripts/review-em-video-frames.py` で可能です。

## 優先して直す共通問題

1. **指している式が画面にない。** 「その微分」「この値」「両端の差」などを説明している間は、対象の式と比較する値を残す。
2. **図が別の現象を示す。** 放電の説明には充電の図を使わない。円形コイルには直線導線、小長方形には円の図を当てない。
3. **途中と全体の結果が同じ名前。** 「ここまでの仕事」と「終点までの仕事」を明示し、固定した左辺と途中の右辺を等号でつながない。
4. **比喩が定義にすり替わる。** 「効く」「寄与を稼ぐ」「仕事の短冊」「宿る」だけで説明せず、何の量・何の操作かを短く添える。
5. **省略が誤解を生む。** 「外部電荷は効かない」ではなく「閉曲面全体の電気束への寄与が0」と、成り立つ範囲を省略しない。

## 全100本の確認記録

| 動画 | 水準 | 確認画面数 | 文章の記録 | 画面の記録 |
|---|---|---:|---:|---:|
| ui-field-map-01 | 初級 | 6 | 2 | 1 |
| ui-field-map-02 | 初級 | 6 | 0 | 1 |
| ui-field-map-03 | 初級 | 7 | 3 | 2 |
| ui-work-direction-01 | 初級 | 6 | 1 | 1 |
| ui-work-direction-02 | 初級 | 6 | 1 | 2 |
| ui-work-direction-03 | 初級 | 4 | 1 | 2 |
| ui-work-bent-path-01 | 初級 | 6 | 1 | 2 |
| ui-work-bent-path-02 | 初級 | 8 | 0 | 1 |
| ui-work-bent-path-03 | 初級 | 6 | 3 | 1 |
| ui-electric-work-path-01 | 初級 | 6 | 1 | 2 |
| ui-electric-work-path-02 | 初級 | 8 | 1 | 2 |
| ui-electric-work-path-03 | 初級 | 4 | 2 | 1 |
| ui-flux-one-tile-01 | 初級 | 6 | 2 | 1 |
| ui-flux-one-tile-02 | 初級 | 6 | 1 | 1 |
| ui-flux-one-tile-03 | 初級 | 6 | 2 | 4 |
| ui-flux-many-tiles-01 | 初級 | 8 | 0 | 1 |
| ui-flux-many-tiles-02 | 初級 | 8 | 1 | 1 |
| ui-flux-many-tiles-03 | 初級 | 9 | 3 | 1 |
| ui-closed-bag-01 | 初級 | 6 | 2 | 1 |
| ui-closed-bag-02 | 初級 | 6 | 2 | 1 |
| ui-closed-bag-03 | 初級 | 6 | 1 | 1 |
| ui-charge-and-flux-preview-01 | 初級 | 6 | 2 | 1 |
| ui-charge-and-flux-preview-02 | 初級 | 6 | 0 | 1 |
| ui-charge-and-flux-preview-03 | 初級 | 6 | 3 | 2 |
| ui-electric-potential-01 | 初級 | 6 | 3 | 1 |
| ui-capacitance-01 | 初級 | 6 | 2 | 2 |
| ui-conduction-01 | 初級 | 6 | 2 | 1 |
| ui-magnetic-force-01 | 初級 | 6 | 2 | 1 |
| ui-current-field-01 | 初級 | 6 | 3 | 1 |
| ui-induction-01 | 初級 | 6 | 3 | 1 |
| ui-circuit-time-01 | 初級 | 6 | 3 | 1 |
| ui-ac-waves-01 | 初級 | 6 | 2 | 1 |
| um-line-element-01 | 中級 | 8 | 0 | 1 |
| um-line-element-02 | 中級 | 6 | 2 | 1 |
| um-line-element-03 | 中級 | 8 | 1 | 1 |
| um-line-element-04 | 中級 | 6 | 3 | 1 |
| um-line-integral-entry-01 | 中級 | 8 | 2 | 1 |
| um-line-integral-entry-02 | 中級 | 6 | 0 | 2 |
| um-line-integral-entry-03 | 中級 | 6 | 4 | 2 |
| um-line-integral-entry-04 | 中級 | 8 | 1 | 1 |
| um-electrostatic-potential-path-01 | 中級 | 4 | 1 | 1 |
| um-electrostatic-potential-path-02 | 中級 | 6 | 1 | 1 |
| um-electrostatic-potential-path-03 | 中級 | 4 | 1 | 1 |
| um-electrostatic-potential-path-04 | 中級 | 6 | 1 | 2 |
| um-electrostatic-potential-path-05 | 中級 | 6 | 1 | 1 |
| um-em-area-vector-01 | 中級 | 8 | 2 | 2 |
| um-em-area-vector-02 | 中級 | 8 | 3 | 2 |
| um-em-area-vector-03 | 中級 | 4 | 0 | 1 |
| um-surface-integral-entry-01 | 中級 | 6 | 1 | 1 |
| um-surface-integral-entry-02 | 中級 | 6 | 2 | 2 |
| um-surface-integral-entry-03 | 中級 | 8 | 3 | 3 |
| um-closed-electric-flux-01 | 中級 | 4 | 1 | 1 |
| um-closed-electric-flux-02 | 中級 | 8 | 2 | 1 |
| um-closed-electric-flux-03 | 中級 | 4 | 1 | 1 |
| um-gauss-sphere-preview-01 | 中級 | 4 | 0 | 1 |
| um-gauss-sphere-preview-02 | 中級 | 8 | 1 | 3 |
| um-gauss-sphere-preview-03 | 中級 | 8 | 3 | 1 |
| um-capacitance-01 | 中級 | 4 | 1 | 2 |
| um-capacitance-02 | 中級 | 6 | 2 | 2 |
| um-conduction-01 | 中級 | 4 | 1 | 1 |
| um-conduction-02 | 中級 | 6 | 2 | 2 |
| um-magnetic-force-01 | 中級 | 4 | 1 | 1 |
| um-magnetic-force-02 | 中級 | 6 | 2 | 2 |
| um-current-field-01 | 中級 | 4 | 2 | 1 |
| um-current-field-02 | 中級 | 6 | 1 | 1 |
| um-induction-01 | 中級 | 6 | 2 | 2 |
| um-induction-02 | 中級 | 6 | 2 | 1 |
| um-circuit-time-01 | 中級 | 6 | 2 | 2 |
| um-circuit-time-02 | 中級 | 6 | 2 | 2 |
| um-ac-maxwell-01 | 中級 | 6 | 1 | 3 |
| um-ac-maxwell-02 | 中級 | 6 | 2 | 3 |
| ue-integrals-01 | 上級 | 8 | 2 | 3 |
| ue-integrals-02 | 上級 | 8 | 3 | 3 |
| ue-integrals-03 | 上級 | 8 | 1 | 4 |
| ue-integrals-04 | 上級 | 8 | 2 | 2 |
| ue-integrals-05 | 上級 | 8 | 3 | 3 |
| ue-gauss-01 | 上級 | 8 | 3 | 2 |
| ue-gauss-02 | 上級 | 8 | 3 | 3 |
| ue-gauss-03 | 上級 | 8 | 4 | 4 |
| ue-gauss-04 | 上級 | 8 | 2 | 2 |
| ue-gauss-05 | 上級 | 8 | 3 | 2 |
| ue-gauss-06 | 上級 | 8 | 1 | 2 |
| ue-gauss-07 | 上級 | 8 | 2 | 2 |
| ue-potential-01 | 上級 | 8 | 4 | 3 |
| ue-potential-02 | 上級 | 6 | 1 | 3 |
| ue-capacitor-01 | 上級 | 6 | 2 | 4 |
| ue-capacitor-02 | 上級 | 6 | 2 | 2 |
| ue-current-01 | 上級 | 8 | 3 | 3 |
| ue-current-02 | 上級 | 4 | 1 | 3 |
| ue-lorentz-01 | 上級 | 6 | 3 | 2 |
| ue-lorentz-02 | 上級 | 6 | 1 | 2 |
| ue-ampere-01 | 上級 | 6 | 2 | 2 |
| ue-ampere-02 | 上級 | 6 | 3 | 1 |
| ue-faraday-01 | 上級 | 6 | 3 | 2 |
| ue-faraday-02 | 上級 | 6 | 2 | 1 |
| ue-transient-01 | 上級 | 6 | 3 | 2 |
| ue-transient-02 | 上級 | 4 | 2 | 1 |
| ue-maxwell-01 | 上級 | 4 | 1 | 1 |
| ue-maxwell-02 | 上級 | 6 | 3 | 2 |
| ue-maxwell-03 | 上級 | 8 | 4 | 2 |

## 動画ごとの全指摘

### 初級

#### ui-field-map-01 — 矢印の地図

動画の見出し：場を、場所ごとに矢印が決まる地図として読む

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-field-map-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-field-map-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 1 | 00:00.00–00:05.05 | 文章：用語 | 空間の各点に一本ずつ矢印を対応させた地図 | 「対応させる」では何をするか浮かばない。「ある場所を選ぶと、その場所の電場を矢印で描ける」と具体化する。 |
| 2 | 00:13.29 | 画面：図の文言 | 矢印の長さは、その点で1 Cが受ける力の大きさ | 正の1 Cかどうかが省略され、電場の矢印と力の矢印の同一視につながる。+1 Cを置いた場合の力に比例する長さ、と区別する。 |
| 3 | 00:27.30–00:32.24 | 文章：指示 | 外から与えた電場そのもの | 「外」は図の外か物体の外か。電場を作る電荷と、力を調べるために置く電荷を区別する。 |

#### ui-field-map-02 — 矢印の地図

動画の見出し：地図から、置いた電荷が受ける力を作る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-field-map-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-field-map-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 4 | 00:00.00 | 画面：見出し | 置いた電荷が受ける力を作る | 計算で力を求める話なのに、実際に力を発生させる操作に読める。 |

#### ui-field-map-03 — 矢印の地図

動画の見出し：地図の上に道と面を置き、この章の目的地を見る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-field-map-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-field-map-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 5 | 00:04.14–00:09.05 | 文章：接続 | 図の線は空間に実在するひもではありません | それまでの「矢印」が突然「線・ひも」になる。矢印をつないで磁場の向きを表す線、という関係が必要。 |
| 6 | 00:10.40–00:14.90 | 文章：用語 | 道に沿った電場の集計 | 電場の強さをそのまま足すのか。移動方向の成分に移動距離を掛ける操作が見えない。 |
| 7 | 00:21.60–00:25.55 | 文章：指示 | 道の各区間の寄与を足します | 「寄与」は何の数か。各区間で電気力がした仕事、と量の名前で呼ぶ。 |
| 8 | 00:23.57 | 画面：図の文言 | 道の小片を足す → 仕事 [J] | 区間の長さを足すだけで仕事になるように読める。各区間の仕事を足す、と量の名前を正す。 |
| 9 | 00:27.59 | 画面：図の文言 | 面の小片を足す → 束 [Wb] | 面積を足すだけで束になるように読める。直前の字幕は電気束なのにWbは磁束の単位であり、電気束と磁束の呼び分けも必要。 |

#### ui-work-direction-01 — 斜めの力を分ける

動画の見出し：矢印の長さをそのまま掛けられない場面を見る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-work-direction-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-work-direction-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 10 | 00:13.37 | 画面：図の文言 | 矢印の長さをそのまま掛けてよいのか、という問い | 学習者への説明でなく編集メモの文体。「力10 N×距離2 mでよい？」と対象を名指しした方が短く明確。 |
| 11 | 00:16.38–00:21.42 | 文章：用語 | 右向きの力の成分が必要です | 「成分」が未知だと止まる。斜めの力のうち箱を右へ引く分、と先に示す。 |

#### ui-work-direction-02 — 斜めの力を分ける

動画の見出し：力を2本に分け、道方向の成分だけを取り出す

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-work-direction-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-work-direction-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 12 | 00:00.00–00:04.92 | 文章：接続 | 十ニュートンとコサイン六十度の積 | なぜコサインか不明。力の矢印を斜辺とする直角三角形の横辺との比を結ぶ。 |
| 13 | 00:13.63 | 画面：図の文言 | 上向きの成分は、右へは1 mmも進めない | 力の成分が移動の主体になっている。箱が上向きに移動しないため上向きの力の仕事は0、と因果を正す。 |
| 14 | 00:28.82 | 画面：字幕と図 | その仕事の値は十ジュールになります。 | 図は途中のW=2.4 J、式はW=10 J。「途中まで」と「2 m進んだ合計」を明示しないと二つの答えに見える。 |

#### ui-work-direction-03 — 斜めの力を分ける

動画の見出し：成分に距離を掛けて、仕事を確定する

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-work-direction-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-work-direction-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 15 | 00:02.39 | 画面：図の文言 | 答えの単位がJなら仕事 | 単位だけで仕事だと判定できるように読める。エネルギーもJなので、仕事の単位はJになる、という片方向の確認にする。 |
| 16 | 00:13.12 | 画面：図の文言 | 中級ではこの取り出しを内積と呼ぶ | 成分を取り出す操作だけが内積なのか、移動距離を掛けた全体が内積なのか不明。 |
| 17 | 00:15.93–00:21.21 | 文章：指示 | 力の矢印の全長 | 絵の長さをメートルで測るのか。矢印の長さで表している「力の大きさ」と明記する。 |

#### ui-work-bent-path-01 — 曲がる道の仕事

動画の見出し：曲がる道では「前」が1つに決まらないことを見る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-work-bent-path-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-work-bent-path-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 18 | 00:02.98 | 画面：図の文言 | 道がL字に曲がっている | 図は右・上・左の三つの区間で、L字ではない。言葉の形と図が一致していない。 |
| 19 | 00:11.51–00:16.36 | 文章：文 | 仕事に使う前向きの成分 | 「前」が日常語で、図の上・右・進行方向を混同する。「物体が進む方向の力の成分」に統一する。 |
| 20 | 00:25.30 | 画面：図の文言 | 前1 = 右 | 「前1」「前2」という独自の省略で位置の番号なのか向きの名前なのか迷う。区間1の進行方向、に統一する。 |

#### ui-work-bent-path-02 — 曲がる道の仕事

動画の見出し：区間ごとの寄与を作って合計する

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-work-bent-path-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-work-bent-path-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 21 | 00:37.67 | 画面：字幕と図 | 七ジュールです。 | 図の「ここまで5 J」は途中、字幕の7 Jは全体。合計の対象範囲を強調しないと足し算を疑う。 |

#### ui-work-bent-path-03 — 曲がる道の仕事

動画の見出し：向きの意味と、細かく切った場合を確かめる

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-work-bent-path-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-work-bent-path-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 22 | 00:05.53–00:10.43 | 文章：用語 | 同じ力の分布での仕事 | 「分布」が何か分からない。各場所で働く力を変えずに、と説明する。 |
| 23 | 00:17.13–00:21.90 | 文章：文 | 各区間の仕事の集計方法 | 普通に「各区間の仕事を足す方法」でよい。名詞化で読みづらくなっている。 |
| 24 | 00:23.25–00:29.37 | 文章：条件 | 曲がる道の仕事は、各区間の移動方向の力の成分と長さの積を足した量です | 曲線の有限分割でも正確なのか。短い直線で近似した計算と、細かくする極限を区別する。 |
| 25 | 00:26.31 | 画面：図の文言 | 道を、まっすぐな区間に切る | 曲線を切れば直線になるように読める。短く分け、各区間を直線で近似する、と二つの操作を区別する。 |

#### ui-electric-work-path-01 — 電場の中の曲がった道

動画の見出し：力を電場からの力に取り替える

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-electric-work-path-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-electric-work-path-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 26 | 00:01.89 | 画面：図の文言 | 道がまっすぐなら、掛け算1回で済む | 直線でも電場が位置で変われば単純な積では求められない。電場成分が一定という条件が抜けている。 |
| 27 | 00:01.89 | 画面：表示不具合 | 1 C × 3 N/C × 1 m = 2.6 J | 左辺は固定した最終値、右辺は途中の値なので等式が成立していない。日本語の修正だけでなく同期・数値表示の修正が必要。 |
| 28 | 00:03.94–00:11.30 | 文章：文 | 道方向の電場三ニュートン毎クーロンによる一メートルの移動の仕事 | 修飾が長く、何を掛けるか保持できない。電場の向きと値、電荷、距離、仕事を順に示す。 |

#### ui-electric-work-path-02 — 電場の中の曲がった道

動画の見出し：4つの区間の寄与を1つずつ作る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-electric-work-path-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-electric-work-path-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 29 | 00:00.00–00:05.71 | 文章：用語 | 道方向の成分 | 曲線のどの方向か。「この区間を進む方向」と図中の区間を指す。 |
| 30 | 00:14.41 | 画面：図の文言 | 進んだ長さで寄与を稼げる | 何を「稼ぐ」のか分からない比喩。電場成分が小さくても距離が長ければ仕事は増える、と量の名前に戻す。 |
| 31 | 00:24.73 | 画面：図の文言 | 電場は道と90°、真横を向く | 画面の左右と進行方向から見た横が混ざる。進行方向に直角、とする。 |

#### ui-electric-work-path-03 — 電場の中の曲がった道

動画の見出し：寄与を合計し、細かく切った場合を見通す

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-electric-work-path-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-electric-work-path-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 32 | 00:00.00–00:04.39 | 文章：用語 | 符号付きで足した値 | 日常語では操作が浮かばない。「マイナスの値も、そのまま足す」と説明する。 |
| 33 | 00:02.19 | 画面：字幕と図 | 全体の仕事 | 字幕と式は全体3 J、図はここまで5 J。途中の合計と全体の合計の区別が弱い。 |
| 34 | 00:15.39–00:19.76 | 文章：接続 | 各区間の仕事の和の極限 | 「和」「極限」が同時に出る。区間を細かくしたとき、合計が近づく値、と橋渡しする。 |

#### ui-flux-one-tile-01 — 1枚のタイルと磁場

動画の見出し：面の向きを法線で決め、垂直なときの磁束を作る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-flux-one-tile-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-flux-one-tile-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 35 | 00:01.87 | 画面：図の文言 | 数えたいのは、このタイルを通り抜けた磁場の量 | 過去形の「通り抜けた」で物体の通過数のように聞こえる。磁場は流れる粒子ではないことと、面に対して定義する値を区別する。 |
| 36 | 00:03.90–00:08.69 | 文章：接続 | 磁束は、面に垂直な磁場の成分と面積から定まる量です | 「何から計算するか」だけで「何を調べる量か」がない。面を通り抜ける向きの磁場を、面全体について数値にまとめると説明する。 |
| 37 | 00:13.76–00:19.16 | 文章：文 | 正の向きの選択が磁束の符号を決めます | 硬い名詞構文。「どちら側へ通り抜ける向きをプラスと呼ぶか、先に決めます」と操作を示す。 |

#### ui-flux-one-tile-02 — 1枚のタイルと磁場

動画の見出し：平行・斜めのときに何が減るのかを見る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-flux-one-tile-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-flux-one-tile-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 38 | 00:10.21–00:15.60 | 文章：用語 | 磁場の向きから見た投影面積 | 「投影」で止まる。磁場の矢印に沿って面を正面から見たときの見かけの広さ、と視線を指定する。 |
| 39 | 00:12.90 | 画面：図の文言 | 受け止められる分 | 面が磁場を吸収・遮断するように読める。磁場方向から見た面の見かけの広さ、と図の操作で説明する。 |

#### ui-flux-one-tile-03 — 1枚のタイルと磁場

動画の見出し：角度を連続で変え、本数という言い方を点検する

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-flux-one-tile-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-flux-one-tile-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 40 | 00:02.90 | 画面：字幕と図 | 角度がゼロ度から九十度へ増える | 確認した2.90秒は64°、7.81秒は15°。説明の増える方向と二つの確認画面の変化が逆で、増減の関係を追いにくい。 |
| 41 | 00:11.03–00:15.58 | 文章：文 | 図の磁力線の本数は、描き方によって変えられる比喩です | 本数と比喩は同じ種類のものではない。図に描く本数を変えても実際の磁場は変わらない、と書く。 |
| 42 | 00:13.30 | 画面：図の文言 | 量を見せる工夫 | 「量」が磁場の強さか磁束か不明。線の本数に何を対応させる図か名前を明示する。 |
| 43 | 00:18.22 | 画面：図の文言 | 定義は、磁場と面の向きから決まる量のほうにある | 「定義が量のほうにある」という日本語では何も定義できていない。面積も含めた磁束の計算を直接述べる。 |
| 44 | 00:24.99 | 画面：図の文言 | 効くのは、磁場の法線方向の成分だけ | 何に効くか省略されている。磁束の計算で使う成分、と目的を示す。 |
| 45 | 00:28.07–00:31.91 | 文章：用語 | この磁束には寄与しません | 何が起きないのか不明。「面に沿う成分を掛け算に入れない」と計算に結び付ける。 |

#### ui-flux-many-tiles-01 — タイルを並べて足す

動画の見出し：タイル1枚の寄与を作り、同じ形で2枚目まで足す

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-flux-many-tiles-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-flux-many-tiles-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 46 | 00:00.00 | 画面：見出し | タイル1枚の寄与を作り | 寄与は作る物体ではなく、この面の磁束の計算結果。各面の磁束を計算する、とする。 |

#### ui-flux-many-tiles-02 — タイルを並べて足す

動画の見出し：磁場が場所ごとに違う場合も、1枚ずつ作って足す

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-flux-many-tiles-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-flux-many-tiles-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 47 | 00:00.00–00:05.02 | 文章：指示 | 法線方向の磁場成分が弱くなっています | 磁場自体が弱まったのか、面を傾けた結果なのか不明。何を固定して何を変えた図か添える。 |
| 48 | 00:32.88 | 画面：字幕と図 | 面全体の磁束 | 全体の式は2.5 Wb、図は合計2 Wb。図の「合計」に途中までの値という限定が必要。 |

#### ui-flux-many-tiles-03 — タイルを並べて足す

動画の見出し：仕事の和との対応と、法線の向きの効果を確かめる

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-flux-many-tiles-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-flux-many-tiles-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 49 | 00:02.01 | 画面：図の文言 | 変わったのは、小片が長さから面積になったことだけ | 力から磁場へ、接線成分から法線成分へも変わっている。「だけ」が説明上の違いを隠す。 |
| 50 | 00:08.44–00:13.17 | 文章：文 | 集計する対象の違いが、線積分と面積分の違いです | 対象とは道／面か、仕事／磁束か。区間ごとに足すのと、面を分けて足すのを対比する。 |
| 51 | 00:14.52–00:19.18 | 文章：文 | 法線の向きの取り直しは、磁束の正の向きを逆転させます | 「取り直し」「正の向きの逆転」が重なる。「プラスと呼ぶ向きを反対に決め直す」とする。 |
| 52 | 00:36.64–00:42.37 | 文章：条件 | 分割を細かくした面でも、各区画の磁束は法線成分と面積の積です | 区画の中で場が変わる場合は近似。「小さな区画では、ほぼ一定とみなして掛ける」が必要。 |

#### ui-closed-bag-01 — 袋の出入りを数える

動画の見出し：閉じた面の向きを決め、出入りを符号で数える

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-closed-bag-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-closed-bag-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 53 | 00:00.00–00:03.81 | 文章：用語 | 閉じた面は、空間を内側と外側に分けます | 「閉じた」が分からない。穴のない箱や球の表面を先に示す。 |
| 54 | 00:09.83–00:12.89 | 文章：指示 | 面から外へ向かう電場の寄与は正です | 電場自体にプラス／マイナスが付くのか。面ごとに計算する電気束の符号だと明記する。 |
| 55 | 00:11.36 | 画面：図の文言 | 袋の正味の量 | 袋に何が入っている量か分からない。閉じた面全体の電気束、と量の名前を統一する。 |

#### ui-closed-bag-02 — 袋の出入りを数える

動画の見出し：合計0と、場が0であることを区別する

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-closed-bag-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-closed-bag-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 56 | 00:00.00–00:05.56 | 文章：文 | 面全体の集計についての結果です | 「集計」の繰り返しでは意味が増えない。各面で求めた電気束を足すとゼロ、とはっきり言う。 |
| 57 | 00:18.25 | 画面：字幕 | 入る寄与と出る寄与が等しい | 直前に入る分を負、出る分を正としたので、値そのものは等しくない。大きさが等しく符号が逆、と言う必要がある。 |
| 58 | 00:26.13–00:30.71 | 文章：用語 | 閉曲面の正味の電気束 | 「閉曲面」「正味」が重なる。箱の全ての面についてプラスとマイナスを足した結果、と言い換える。 |

#### ui-closed-bag-03 — 袋の出入りを数える

動画の見出し：袋の中の電荷と、正味の量を結びつける

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-closed-bag-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-closed-bag-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 59 | 00:22.70–00:27.70 | 文章：接続 | 内部の電荷の合計に対応します | 「対応」では比例か等しいか不明。内部の合計電荷が2倍なら合計の電気束も2倍、と関係を示す。 |
| 60 | 00:25.20 | 画面：図の文言 | 教えてくれること | 何が教えてくれるのか省略される。面全体の電気束から分かること、と主語を補う。 |

#### ui-charge-and-flux-preview-01 — 中心の電荷と球面

動画の見出し：球面の向きを決め、中の電荷と正味の量を結ぶ

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-charge-and-flux-preview-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-charge-and-flux-preview-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 61 | 00:00.00–00:04.04 | 文章：用語 | 電荷を囲む仮想の面 | 「仮想」とだけ言っても、電場を変えない理由が伝わらない。計算のために頭の中で描く球の表面、と説明する。 |
| 62 | 00:14.91–00:20.62 | 文章：文 | 図の数値は束の大小を比べる目盛りで、矢印の実在の本数ではありません | 数値・目盛り・実在の本数の関係が不自然。表示値の単位または相対値であることを明記する。 |
| 63 | 00:17.77 | 画面：図の文言 | 数えた本数2/8 | 本数は実在しないと説明しながら数えた本数を正味の量にしている。一本を一定の束に対応させた模式図、という約束が必要。 |

#### ui-charge-and-flux-preview-02 — 中心の電荷と球面

動画の見出し：電荷の符号・大きさ・球の半径を変えて確かめる

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-charge-and-flux-preview-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-charge-and-flux-preview-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 64 | 00:24.78 | 画面：図の文言 | 面をどう取っても、正味の量は変わらない | ここで比べたのは同心球の半径だけ。「どう取っても」と任意の形への一般化を先取りしている。 |

#### ui-charge-and-flux-preview-03 — 中心の電荷と球面

動画の見出し：「本数」の限界を確かめ、上級編の形を見通す

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-charge-and-flux-preview-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-charge-and-flux-preview-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 65 | 00:02.58 | 画面：図の文言 | 中にない電荷は効かない | 外部電荷は各点の電場には影響する。閉曲面全体の電気束への寄与が0、と対象を限定しないと誤解する。 |
| 66 | 00:05.31–00:10.01 | 文章：用語 | 符号付きの寄与は相殺し | 硬い言葉が連続する。入る分のマイナスと出る分のプラスが打ち消し合う、とする。 |
| 67 | 00:11.36–00:16.15 | 文章：指示 | 図の矢印の本数は、電場の強さを表すための描き方です | 前の章は矢印の「長さ」だった。本数・密度・長さのうち、この図では何が強さを表すか統一して示す。 |
| 68 | 00:16.30–00:20.96 | 文章：文 | 電場の法線成分と面積の集計 | 成分と面積を足すようにも読める。二つを掛け、その積を足す、と操作を分ける。 |
| 69 | 00:18.63 | 画面：図の文言 | 定義は電場と面から決まる量。 | 定義と量を同一視していて不自然。電気束は電場と面から計算する量、と主語を直す。 |

#### ui-electric-potential-01 — 電位: 電気の地形図

動画の見出し：電位と電位差を区別し、電場がする仕事と位置エネルギーの符号を読む。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-electric-potential-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-electric-potential-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 70 | 00:00.00–00:03.88 | 文章：接続 | 電位は各場所の値 | 何の値かが説明されていない。電荷1クーロンあたりの電気的な位置エネルギーにつなぐ。 |
| 71 | 00:04.03–00:10.29 | 文章：文 | 終点から始点を引いた電位差 | 場所同士を引くのか。「終点の電位から始点の電位を引く」とする。 |
| 72 | 00:07.16 | 画面：字幕と図 | 始点が一ボルト、終点が四ボルト | 図はB→A、式は1−4=−3 V。字幕の始点・終点と画面の向きが逆で、引き算の符号が分からなくなる。 |
| 73 | 00:16.53–00:21.94 | 文章：指示 | このエネルギーの受け渡し | 何から何へ渡るか不明。電気的な位置エネルギーの減少と電気力がする仕事を対応させる。 |

#### ui-capacitance-01 — コンデンサを導出する

動画の見出し：二枚の板に正負の電荷を分けて蓄え、容量と充電中の電圧を読む。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-capacitance-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-capacitance-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 74 | 00:11.68–00:14.91 | 文章：用語 | 容量は、電荷を電圧で割った量です | 容器の体積と混同する。ここでは電気容量で、同じ電圧でどれだけ電荷をためられるか、と示す。 |
| 75 | 00:23.95 | 画面：字幕と式 | その時点の電荷を容量で割った値 | 説明はV=q/Cだが表示はエネルギーU=QV/2。電圧とエネルギーの話を混同しやすい。 |
| 76 | 00:26.39–00:32.99 | 文章：接続 | 充電の仕事は電圧と電荷のグラフの下の面積なので | なぜ面積になるかが抜ける。少し運ぶ電荷×その時の電圧が仕事で、それを足すと面積になる、とつなぐ。 |
| 77 | 00:29.69 | 画面：図の文言 | 後から運ぶ電荷ほど仕事が大きい | 電荷そのものが仕事をするように読める。同じ少量の電荷を運ぶために必要な仕事が増える、と主体と比較条件を示す。 |

#### ui-conduction-01 — 電流のミクロな正体

動画の見出し：断面を通る電荷で電流を測り、電子の移動と電流の向きを区別する。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-conduction-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-conduction-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 78 | 00:00.00–00:04.16 | 文章：指示 | 断面を通る電荷の量 | 何の断面か不明。導線を途中で輪切りにした面を指す。 |
| 79 | 00:13.68–00:19.42 | 文章：指示 | 電子の平均の移動と電流は逆向き | 「平均」は何を平均するか。ばらばらに動く電子も、全体として少しずつ一方向へ移る、と説明する。 |
| 80 | 00:29.14 | 画面：字幕と図 | 三オームの抵抗に六ボルトがかかると、電流は二アンペアです。 | 図は抵抗5.1Ω・電流1.2A。数値例と動く図の条件が違い、割り算を確かめられない。 |

#### ui-magnetic-force-01 — ローレンツ力

動画の見出し：速度・磁場・力を三本の矢印で区別し、磁気力が速さを変えない理由を読む。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-magnetic-force-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-magnetic-force-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 81 | 00:10.54–00:14.46 | 文章：指示 | 粒子の速度にも磁場にも垂直です | 数値に垂直という言葉が浮かばない。速度の矢印・磁場の矢印の両方に直角、とする。 |
| 82 | 00:17.42 | 画面：字幕と図 | 同じ速度の正の電荷の場合と逆向き | 何と同じかは説明されるが、画面が負電荷だけに切り替わり、正電荷側の矢印が残らない。比較先を同時表示すると指示が成立する。 |
| 83 | 00:21.59–00:26.07 | 文章：用語 | その瞬間の移動と直角なので仕事をしません | 日常の「何もしていない」と混同する。進む向きは変えるが、運動エネルギーは変えないことと結ぶ。 |

#### ui-current-field-01 — アンペールの法則

動画の見出し：電流の周りの磁場の向きを読み、巻数と単位長さあたりの巻数を区別する。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-current-field-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-current-field-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 84 | 00:00.00–00:04.92 | 文章：用語 | 導線を囲む円の接線方向 | 接線を思い出せなければ止まる。導線の周りを回る円に沿う向き、と図で示す。 |
| 85 | 00:15.92–00:20.67 | 文章：指示 | それらの同じ軸方向の寄与の合計 | 「それら」「軸」「寄与」が連続する。各部分が中心に作る磁場の、共通する向きと足す量を明記する。 |
| 86 | 00:18.29 | 画面：字幕と図 | 同じ軸方向の寄与の合計 | 図にはコイルの軸がなく、右側の矢印が中心の磁場を表すという対応が弱い。「中心で右向きの磁場を足す」と場所を明示する。 |
| 87 | 00:22.02–00:26.26 | 文章：用語 | 巻数密度 | 定義はあるが用途がない。「1メートルあたり何回巻いたか」と具体化する。 |

#### ui-induction-01 — ファラデーの法則を微分で

動画の見出し：磁束の変化と起電力を区別し、閉回路の有無と誘導の向きを読む。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-induction-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-induction-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 88 | 00:00.00–00:05.21 | 文章：条件 | 平面を貫く磁束は、法線方向の磁場成分と面積の積です | 一枚の面で成分が一定という前提が見えない。例の磁場が一様であることを添える。 |
| 89 | 00:12.28–00:16.77 | 文章：接続 | 誘導起電力の向きは、磁束の変化を妨げる向きです | 電圧がどう磁束を妨げるのか不明。閉回路なら流れる誘導電流、その電流が作る磁場、の順に結ぶ。 |
| 90 | 00:14.52 | 画面：図の文言 | 誘導の向き | 電流・起電力・誘導磁場のどの向きか不明。円の矢印に量の名前が必要。 |
| 91 | 00:24.35–00:29.94 | 文章：文 | 単位電荷あたりのエネルギーに対応する量 | 「対応」で定義がぼやける。1クーロンを回路一周に沿って運ぶときの仕事との関係を示す。 |

#### ui-circuit-time-01 — RC・RL回路の過渡現象

動画の見出し：抵抗・コンデンサ・コイルの電圧を区別し、電荷と電流の変化を読む。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-circuit-time-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-circuit-time-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 92 | 00:00.00–00:04.42 | 文章：指示 | 抵抗とコンデンサの電圧 | 電圧は二点の差なのに場所が不明。各部品の両端の電圧、と言う。 |
| 93 | 00:11.80–00:15.81 | 文章：用語 | コンデンサの電荷の時間変化率 | 「時間変化率」は長く抽象的。1秒あたりに、ためた電荷がどれだけ増えるか、と結ぶ。 |
| 94 | 00:27.63–00:34.11 | 文章：文 | 抵抗のような電圧降下を生じ続ける部品ではありません | 長い否定で何が起きるか残らない。理想コイルでは電流が一定になれば両端の電圧はゼロ、と述べる。 |
| 95 | 00:30.87 | 画面：字幕と図 | 一定の電流 | 図の電流グラフに、折れ線とは別の斜線が原点から伸びている。どの線が電流を示すか分からず、「一定」を図で確認できない。 |

#### ui-ac-waves-01 — 交流とマクスウェル方程式

動画の見出し：交流の周期・位相と波の伝わる速さを区別して図で読む。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ui-ac-waves-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ui-ac-waves-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 96 | 00:04.14–00:09.38 | 文章：指示 | 周期は一往復の時間 | 電子の往復距離の話と混同する。電流の変化のパターンが一回繰り返すまでの時間、とする。 |
| 97 | 00:10.73–00:14.78 | 文章：用語 | 波の進み具合のずれ | 空間的な位置のずれか時刻のずれか不明。同じ場所で最大になる時刻がずれる例を示す。 |
| 98 | 00:12.75 | 画面：図の文言 | 時刻がずれる | 何の時刻か省略される。最大値になる時刻がずれる、と本文と同じ対象にする。 |

### 中級

#### um-line-element-01 — 小区間の仕事

動画の見出し：場を成分で書き、道が曲がると困ることを見つける

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-line-element-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-line-element-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 99 | 00:02.04 | 画面：字幕と図 | 位置ベクトル | 図には電場E(r)だけがあり、原点や位置ベクトルrがない。最初に説明しているベクトルを図で見つけられない。 |

#### um-line-element-02 — 小区間の仕事

動画の見出し：小移動の矢印と代表点、そして力を用意する

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-line-element-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-line-element-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 100 | 00:05.31–00:09.69 | 文章：指示 | 添字は、その移動が何番目の区間かを表す番号です | どの文字か不明。「右下の小さい i」と図の表示を結ぶ。 |
| 101 | 00:13.37 | 画面：図の文言 | この値を使い回す | 何の値をどこまで同じとみなすか曖昧。区間内の電場を、中点での電場と同じと近似する、とする。 |
| 102 | 00:15.84–00:20.91 | 文章：文 | 区間の中点での電場が区間全体の代表値です | なぜ点の電場で区間を代表してよいか。「短い区間では変化が小さいので、中点の値を使う」とする。 |

#### um-line-element-03 — 小区間の仕事

動画の見出し：有効な力から内積の式まで、一手ずつ進む

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-line-element-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-line-element-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 103 | 00:02.15 | 画面：見出し | 有効な力 | 仕事に関係しない力は無効、あるいは存在しないかのような名前。移動方向の力の成分、と正式な対象名にする。 |
| 104 | 00:04.44–00:09.58 | 文章：文 | 力の大きさと力と移動がなす角のコサインの積 | 「と」が連続して掛けるものが分からない。力の大きさ×cosθ、θは二本の矢印の間の角度、と分ける。 |

#### um-line-element-04 — 小区間の仕事

動画の見出し：符号の3つの場合を確かめ、誤りの型を押さえる

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-line-element-04.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-line-element-04/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 105 | 00:00.00–00:04.33 | 文章：条件 | 内積は正の最大値です | 何を固定したときの最大か。力と移動距離を同じにして角度を変える場合、と示す。 |
| 106 | 00:02.17 | 画面：字幕と図 | 力と移動が同じ向きなら、内積は正の最大値です。 | 最大値の条件である二つの大きさ固定が省略され、同時に図は直角で仕事0。条件と図の両方が説明に合っていない。 |
| 107 | 00:14.19–00:19.87 | 文章：文 | 運動エネルギーを取り去る寄与 | 遠回し。「この力は運動エネルギーを減らす働きをする」と述べ、他の力の仕事とは分ける。 |
| 108 | 00:26.14–00:31.70 | 文章：指示 | 正しく数えるための係数 | 何を数えるか不明。向きによって仕事を正・ゼロ・負にする cosθ の役割を言う。 |

#### um-line-integral-entry-01 — 有限和から線積分へ

動画の見出し：場所ごとに変わる力を、分割して扱う準備をする

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-line-integral-entry-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-line-integral-entry-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 109 | 00:06.99–00:11.18 | 文章：文 | 区間を細かくする極限が、正確な仕事を与えます | 操作の極限と計算値の極限が混ざる。区間を細かくしたときに合計が近づく値、とする。 |
| 110 | 00:17.56–00:22.44 | 文章：文 | 道全体に一つの力の値を掛ける計算 | 道という物体に数を掛けるのか。道の長さ×一つの力の値、と明記する。 |
| 111 | 00:42.11 | 画面：字幕と図 | 力ベクトルと移動ベクトル | 直前は代表点の位置の話で、図の白い矢印も位置r。三種類のベクトルが名前の切り替えだけで混ざる。 |

#### um-line-integral-entry-02 — 有限和から線積分へ

動画の見出し：有限和を作り、添字と範囲を読む

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-line-integral-entry-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-line-integral-entry-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 112 | 00:16.81 | 画面：字幕と図 | 上のエヌ | 図のΣの上は4。Nを具体例で4にしたことを一言添えないと、Nを探して迷う。 |
| 113 | 00:24.06 | 画面：字幕と図 | 合計は三ジュールです。 | 図には「ここまでの合計5 J」。全区間の3 Jと部分和5 Jの対比が明示されていない。 |

#### um-line-integral-entry-03 — 有限和から線積分へ

動画の見出し：分割を細かくして、極限に記号を付ける

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-line-integral-entry-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-line-integral-entry-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 114 | 00:00.00–00:04.70 | 文章：指示 | 別の滑らかな場です | 「滑らか」が図の線か力の変化か不明。場所を少し変えても力が急に飛び変わらない、と説明する。 |
| 115 | 00:02.35 | 画面：図の文言 | 代表点のずれも減る | 何からのずれなのか不明。代表点で区間全体を置き換える誤差が小さくなる、という意味ならその対象を述べる。 |
| 116 | 00:04.85–00:10.82 | 文章：文 | 折れ線と仕事の近似値がそれぞれ極限へ近づきます | 図形と数値をひとまとめにしている。折れ線は元の曲線へ、仕事の値は一定の値へ近づく、と分ける。 |
| 117 | 00:12.17–00:17.48 | 文章：指示 | すべての区間を十分細かくしたときの和の極限 | 「十分」で止めた近似と極限が混同する。さらに細かくし続けたときの近づき先、とする。 |
| 118 | 00:14.83 | 画面：図の文言 | もう近似ではなく、分け方によらない1つの数 | 画面にはN=64と約1.8833 Jが残る。有限分割の近似値と極限の正確な値を混同する表現。 |
| 119 | 00:22.76–00:28.68 | 文章：文 | 線積分は、この仕事の和の極限を短く表した記号です | 計算と記号が同一扱い。計算を線積分と呼び、この記号で書く、と区別する。 |

#### um-line-integral-entry-04 — 有限和から線積分へ

動画の見出し：電場の式に直し、Cと向きの意味を確かめる

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-line-integral-entry-04.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-line-integral-entry-04/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 120 | 00:37.26 | 画面：図の文言 | 上の枠は確定、下の枠はまだ未確定 | 学習者に何が分かって何が未証明かではなく、枠の状態を説明している。指定経路の仕事は計算できたが経路を変えて同じかは未確認、とする。 |
| 121 | 00:40.26–00:44.48 | 文章：指示 | 追加の条件が必要です | 条件を伏せたままで学びが止まる。静電場なら道によらない、という次の話題を具体的に示す。 |

#### um-electrostatic-potential-path-01 — 静電場の電位差

動画の見出し：2本の道で仕事を計算し、値を見比べる

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-electrostatic-potential-path-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-electrostatic-potential-path-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 122 | 00:00.00–00:04.88 | 文章：文 | この例は、右向きの一様電場の中で二クーロンの電荷を運びます | 「例」が電荷を運ぶ主語になっている。「この例では、〜電荷を運びます」で自然になる。 |
| 123 | 00:14.09 | 画面：図の文言 | どちらが得か、実際に計算してみる | 誰にとって何が得か不明。電気力がする仕事は経路で変わるか、という問いにする。 |

#### um-electrostatic-potential-path-02 — 静電場の電位差

動画の見出し：2本の道で仕事を計算し、値を見比べる

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-electrostatic-potential-path-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-electrostatic-potential-path-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 124 | 00:22.19–00:27.05 | 文章：用語 | 横方向の正味の移動 | 道の長さか差か不明。右へ進んだ距離から左へ進んだ距離を引く、とする。 |
| 125 | 00:24.62 | 画面：図の文言 | 仕事に入らない | 力がないのか、計算を省略するのか不明。この区間で電気力がする仕事は0、と言う。 |

#### um-electrostatic-potential-path-03 — 静電場の電位差

動画の見出し：位置エネルギーを経て、電位差の式を作る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-electrostatic-potential-path-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-electrostatic-potential-path-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 126 | 00:02.13 | 画面：字幕と図 | 一周の線積分はゼロです。 | 図が途中なのに「一周の合計=24 J」と表示。途中までの仕事と一周全体の仕事を同じ名前で表示している。 |
| 127 | 00:04.42–00:10.92 | 文章：文 | この性質は静電場の性質で | 同語の繰り返し。時間がたっても変化しない電場での結論であることを説明する。 |

#### um-electrostatic-potential-path-04 — 静電場の電位差

動画の見出し：位置エネルギーを経て、電位差の式を作る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-electrostatic-potential-path-04.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-electrostatic-potential-path-04/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 128 | 00:02.61 | 画面：図の文言 | 紫が減った分、黄緑が出ていった分。 | 何がどこから出たか不明。紫は位置エネルギーの減少、緑は電気力の仕事、と対応を量名で示す。 |
| 129 | 00:20.20–00:25.54 | 文章：指示 | 位置エネルギーの変化と仕事の関係を代入すると | 何をどの式に入れるのか不明。ΔV=ΔU/q に ΔU=−W を入れる、と示す。 |
| 130 | 00:22.87 | 画面：図の文言 | 位置だけの差として使える | 位置の座標の差なのか電位の差なのか曖昧。二点の電位の差は経路によらない、とする。 |

#### um-electrostatic-potential-path-05 — 静電場の電位差

動画の見出し：単位と読み方、そして使える条件を確かめる

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-electrostatic-potential-path-05.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-electrostatic-potential-path-05/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 131 | 00:17.62 | 画面：字幕と図 | 電位の高さの図 | この場面は縦の等電位線と数値の図で、高さで電位を表していない。画面にない表現の説明になっている。 |
| 132 | 00:21.54–00:27.02 | 文章：文 | ゼロでない電場の線積分を生じさせます | 計算結果を「生じさせる」だけでは現象が浮かばない。一周に沿う電場の働きが打ち消し合わなくなる、と結ぶ。 |

#### um-em-area-vector-01 — 面積ベクトル

動画の見出し：タイルの広さと向きを、別々の記号で押さえる

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-em-area-vector-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-em-area-vector-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 133 | 00:00.00–00:04.97 | 文章：条件 | 一枚の平面の磁束は、磁場の垂直成分と面積の積です | 垂直成分が面上で一定という条件が省かれる。「この一様磁場では」と限定する。 |
| 134 | 00:13.36 | 画面：図の文言 | この2つだけで、1枚が決まる | 面積と法線だけでは位置や形は決まらない。磁束の近似計算に使う面積と向きを表せる、という範囲に限定する。 |
| 135 | 00:21.23–00:25.48 | 文章：指示 | 長さが一のベクトル | 1メートルか。向きだけを表すため大きさを1にそろえた矢印で、物理的な長さではないと添える。 |
| 136 | 00:37.98 | 画面：図の文言 | 面に沿う成分は、1本も貫かない | 成分を線の本数として数える表現に戻っている。面に平行な成分が磁束に加える値は0、とする。 |

#### um-em-area-vector-02 — 面積ベクトル

動画の見出し：向き付き面積を作り、寄与を内積で書く

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-em-area-vector-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-em-area-vector-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 137 | 00:04.39–00:09.70 | 文章：文 | 余分な長さの係数が入りません | 「余分」が何を指すか曖昧。法線の大きさが1なので B×1×cosθ になる、と具体化する。 |
| 138 | 00:07.04 | 画面：図の文言 | 法線の長さは掛からない | 式には長さ1が掛かっている。「1を掛けても値が変わらない」を、掛からないと言い換えたため説明と式が食い違う。 |
| 139 | 00:13.26 | 画面：図の文言 | 長さが面積になる | 物理的な長さが面積に変わるように読める。矢印の長さで面積の数値を表す、と表示の約束を明示する。 |
| 140 | 00:21.07–00:24.51 | 文章：指示 | 矢印のない面積 | 図の矢印か、数式の文字の上の矢印か不明。記号AとベクトルAを画面上で指す。 |
| 141 | 00:36.69–00:42.36 | 文章：文 | 曲がった面の集計につながります | 面の何を足すか曖昧。小さな面ごとの磁束を足して、面全体の磁束を求める、とする。 |

#### um-em-area-vector-03 — 面積ベクトル

動画の見出し：符号の決まり方と、曲面での違いを確かめる

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-em-area-vector-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-em-area-vector-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 142 | 00:12.43 | 画面：図の文言 | だからnには添字iが要る | iが何番目の区画を表すか、その場で確認できない。各区画で違う法線をn₁、n₂…と区別する、と例示する。 |

#### um-surface-integral-entry-01 — 有限和から面積分へ

動画の見出し：平面と曲面を比べ、有限和を作る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-surface-integral-entry-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-surface-integral-entry-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 143 | 00:28.38–00:32.19 | 文章：文 | シグマは、面の区画を番号順に足す記号です | 足すのは区画そのものではない。各区画について計算した磁束を足す記号。 |
| 144 | 00:30.28 | 画面：字幕 | シグマは、面の区画を番号順に足す記号です。 | 足すのは区画そのものではなく各区画で計算した磁束の値。目的語が違う。 |

#### um-surface-integral-entry-02 — 有限和から面積分へ

動画の見出し：極限をとり、面積分の記号と S の意味を受け取る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-surface-integral-entry-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-surface-integral-entry-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 145 | 00:05.84–00:10.34 | 文章：指示 | 滑らかな場と面では、その寄与の和は一定の値へ近づきます | 「滑らか」「その寄与」が曖昧。場の急な変化がないこと、小さい面の磁束を足すことを示す。 |
| 146 | 00:11.69–00:15.82 | 文章：用語 | 面の各区画の寄与の和の極限 | 抽象名詞が重なる。小さな面ごとの磁束を足し、面を細かくし続けたときの値、とする。 |
| 147 | 00:23.72 | 画面：図の文言 | 足す相手はΔrベクトル | 線積分では移動ベクトルだけを足すのではない。内積を取る相手、と足し合わせる値を区別する。 |
| 148 | 00:28.65 | 画面：図の文言 | 足す相手はΔAベクトル | 磁束の面積分でも面積ベクトルだけを足すのではない。磁場との内積を足す、と操作を正す。 |

#### um-surface-integral-entry-03 — 有限和から面積分へ

動画の見出し：記号の区別と、操作の中身を言い切る

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-surface-integral-entry-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-surface-integral-entry-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 149 | 00:17.21–00:22.97 | 文章：指示 | 特別な条件がある場合です | 条件が書かれていない。面に垂直な成分が面上で一定なら、と具体化する。 |
| 150 | 00:26.96 | 画面：図の文言 | 輪が1本か2本かで、道と面を区別する | 1本・2本は輪ではなく積分記号の本数を指しているように見える。丸と積分記号を区別して呼ぶ必要がある。 |
| 151 | 00:29.75–00:35.81 | 文章：文 | 積分対象と移動または面積の記号も合わせて確認します | 読者に判別作業を丸投げする。drなら道、dAなら面、という例を並べる。 |
| 152 | 00:32.78 | 画面：表示不具合 | 丸付きの積分記号 | 比較対象の閉曲面積分が赤い「\oiint」のままで、丸付き記号を視聴者が確認できない。 |
| 153 | 00:39.43 | 画面：図の文言 | 記号は、外向き法線の約束まで持ち込む | 記号自体が必ず外向きを意味すると誤解しやすい。この教材では閉曲面の法線を外向きに選ぶ、という約束を分ける。 |
| 154 | 00:41.85–00:46.47 | 文章：文 | 開いた面の積分は、閉曲面を表す記号とは区別します | 区別するとしか言っていない。ふたのない面と、空間を包む面を図で示す。 |

#### um-closed-electric-flux-01 — 閉曲面の電気束

動画の見出し：外向き法線の約束を決め、場の中に箱を置く

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-closed-electric-flux-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-closed-electric-flux-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 155 | 00:01.89 | 画面：図の文言 | この約束込みの記号 | 何の約束を含むか曖昧。面全体を積分する記号と、法線を外向きに選ぶ約束を別々に説明する。 |
| 156 | 00:16.22–00:20.44 | 文章：指示 | 左右の面積 | どこの左右か。「箱の左面と右面の面積」とする。 |

#### um-closed-electric-flux-02 — 閉曲面の電気束

動画の見出し：6面の寄与を1面ずつ計算して足す

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-closed-electric-flux-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-closed-electric-flux-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 157 | 00:26.06–00:30.56 | 文章：文 | その四面の内積はゼロ | 面同士の内積と読める。各面の電場と外向き単位法線の内積がゼロ、とする。 |
| 158 | 00:31.91–00:37.59 | 文章：文 | 六面の寄与の合計は、左の負の寄与と右の正の寄与が相殺してゼロです | 寄与を3回使い、数値を隠している。左面の負の電気束と右面の正の電気束を足す式を示す。 |
| 159 | 00:34.75 | 画面：表示不具合 | 六面の寄与の合計 | その合計を表す式の積分記号が「\oiint」と赤く残る。式の意味を学ぶ場面で表示が壊れている。 |

#### um-closed-electric-flux-03 — 閉曲面の電気束

動画の見出し：合計0の意味を、場が0であることと区別する

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-closed-electric-flux-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-closed-electric-flux-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 160 | 00:10.31–00:14.81 | 文章：文 | 面全体の符号付きの集計 | 何の量も操作も想像しにくい。各面の電気束を符号も含めて足した値、とする。 |
| 161 | 00:12.56 | 画面：図の文言 | 点が左から入り、右へ抜けていくことを見てください | 移動する点が電子なのか電場なのか不明。電気束は粒子の通過数ではないため、模式表示である説明が必要。 |

#### um-gauss-sphere-preview-01 — 中心の点電荷と球面

動画の見出し：点電荷の場を読み、閉じた面として球面を選ぶ

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-gauss-sphere-preview-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-gauss-sphere-preview-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 162 | 00:07.47 | 画面：図の文言 | 大きさは距離だけで決まる | 電荷Qも表示されるのに「だけ」と言い切る。中心の電荷を固定したとき、と比較条件が必要。 |

#### um-gauss-sphere-preview-02 — 中心の点電荷と球面

動画の見出し：平行と等しさを使って、和を掛け算に退化させる

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-gauss-sphere-preview-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-gauss-sphere-preview-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 163 | 00:00.00 | 画面：見出し | 和を掛け算に退化させる | 「退化」は劣化の意味に聞こえ、計算が簡単になることを伝えない。同じ値をまとめて掛け算にする、とする。 |
| 164 | 00:20.85–00:25.69 | 文章：接続 | 各区画に共通する電場の強さは、面積分の外へ出せます | なぜ外へ出せるかを言わない。Ea+Eb=E(a+b)と同じまとめ方、と接続する。 |
| 165 | 00:23.27 | 画面：表示不具合 | 積分の外へ出せます。 | 外へ出す操作を表す式に赤い「\oiint」が残り、どの記号の外なのか読めない。 |
| 166 | 00:34.16 | 画面：図の文言 | タイルが1周そろうと、球の表面積になる | 平面図で円周上を1周するだけの図なので、円周の長さと球面積を混同しやすい。球の表面全体を覆う、と対象を正す。 |

#### um-gauss-sphere-preview-03 — 中心の点電荷と球面

動画の見出し：中心球の電気束を求め、まだ示していない範囲を区別する

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-gauss-sphere-preview-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-gauss-sphere-preview-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 167 | 00:12.62–00:17.82 | 文章：指示 | 任意の適切な閉曲面 | 「適切」の判定ができない。少なくとも点電荷が面そのものに乗る場合を除くなど、適用範囲を具体化する。 |
| 168 | 00:17.97–00:23.91 | 文章：用語 | 未知の電場を積分から取り出す | 電場を物として取り出す印象。面上の同じ強さEを積分の外へ出し、Eを求めるという計算を言う。 |
| 169 | 00:28.35 | 画面：図の文言 | Eが場所ごとに違い、外へ出せない | 電場が球の外に出ないようにも読める。積分記号の外へ共通因子として出せない、と目的語を省略しない。 |
| 170 | 00:37.89–00:43.33 | 文章：文 | クーロンの法則の逆二乗と球面積の二乗 | 球面積そのものを二乗するように読める。「電場の式の1/r²と、面積の式のr²」とする。 |

#### um-capacitance-01 — コンデンサを導出する

動画の見出し：面密度から板間の電場と電圧を求め、平行板の容量を導く。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-capacitance-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-capacitance-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 171 | 00:00.00 | 画面：見出し | 面密度から板間の電場と電圧を求め、平行板の容量を導く。 | 何の面密度か省略される。「平行板の容量」も板自体の量に見える。面電荷密度と平行板コンデンサの静電容量、と対象を明確にする。 |
| 172 | 00:02.16 | 画面：字幕と図 | 面電荷密度 | 図に板の面積Sがなく、Q=CVしかない。単位面積あたりの電荷という対象を図で確認できない。 |
| 173 | 00:04.46–00:11.43 | 文章：指示 | 板の間隔が幅より十分小さく、中央で端の影響を無視できる場合 | 何の幅・中央・影響か。板の横幅、板間の中央付近、端で電場が曲がる影響、と対応を示す。 |

#### um-capacitance-02 — コンデンサを導出する

動画の見出し：面密度から板間の電場と電圧を求め、平行板の容量を導く。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-capacitance-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-capacitance-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 174 | 00:00.00–00:04.61 | 文章：条件 | 一枚の無限平面の電場は、両側へ半分ずつ広がります | 何の半分か不明で、量を分配する印象になる。一枚ならσ/(2ε₀)、二枚の板間なら両方を足す、とする。 |
| 175 | 00:02.31 | 画面：字幕 | 両側へ半分ずつ広がります。 | 何を半分にしたのか不明。各側の電場の強さがσ/(2ε₀)であることと、電場を半分ずつ分配する比喩を区別する。 |
| 176 | 00:17.69–00:23.88 | 文章：文 | 容量の定義への代入が、誘電率と面積の積を間隔で割った容量の式を与えます | 名詞が連なり、操作が追えない。C=Q/VにV=EdとEの式を代入する、と順に示す。 |
| 177 | 00:27.32 | 画面：図の文言 | σ=Q/Sを入れるとSとdだけ残る | 表示する容量の式にはε₀も残る。形を変えたときの変数がSとd、という意味なら条件を添える。 |

#### um-conduction-01 — 電流のミクロな正体

動画の見出し：断面を通る粒子の数から電流を求め、電荷保存から分岐点の収支を立てる。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-conduction-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-conduction-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 178 | 00:02.29 | 画面：字幕と図 | 電子の数密度 | 図は電子の移動と場の伝わり方で、1 m³の領域や粒子数の対応がない。数密度の定義を説明する図になっていない。 |
| 179 | 00:11.24–00:17.44 | 文章：文 | 電子の電荷の大きさと数密度と断面積と平均の速さの積 | 四つの掛け算を音だけで保持しづらい。体積→電子の数→電荷→1秒あたりの量、の順でまとめる。 |

#### um-conduction-02 — 電流のミクロな正体

動画の見出し：断面を通る粒子の数から電流を求め、電荷保存から分岐点の収支を立てる。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-conduction-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-conduction-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 180 | 00:00.00–00:06.76 | 文章：文 | 平均速度と時間が作る円柱の体積 | 速度と時間だけでは円柱は決まらない。導線の断面積を底面積、速さ×時間を長さとする円柱、と説明する。 |
| 181 | 00:03.38 | 画面：字幕と図 | 平均速度と時間が作る円柱の体積 | 図には円柱やvdtの長さがない。「速度と時間が作る」という比喩だけで体積S vdtを組み立てられない。 |
| 182 | 00:14.53 | 画面：字幕と図 | 分岐点の電流の収支 | 図は分岐のない一周の回路。文中の分岐点が存在せず、入る電流と出る電流を追えない。 |
| 183 | 00:16.70–00:22.49 | 文章：用語 | 起電力も含めたエネルギーの収支 | 「収支」が抽象的。電池から受け取る分と、抵抗などに渡す分を一周について比べる。 |

#### um-magnetic-force-01 — ローレンツ力

動画の見出し：ローレンツ力を出発点に、電荷の符号と円運動が成り立つ条件を判断する。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-magnetic-force-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-magnetic-force-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 184 | 00:12.15–00:16.38 | 文章：文 | 電荷と速度と磁場の外積 | 電荷も含めた三つの外積に読める。速度と磁場の外積を求め、それに電荷qを掛ける、とする。 |
| 185 | 00:14.26 | 画面：字幕と図 | 速度と磁場 | 図の矢印はA・B・A×B。Aが速度か面積か分からず、字幕の量名と図中の記号が一致しない。 |

#### um-magnetic-force-02 — ローレンツ力

動画の見出し：ローレンツ力を出発点に、電荷の符号と円運動が成り立つ条件を判断する。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-magnetic-force-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-magnetic-force-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 186 | 00:00.00–00:05.13 | 文章：指示 | 速度から磁場へ右手の指を曲げたとき | どの指をどう置くか不明。速度の矢印から磁場の矢印へ、指を曲げる図と説明を合わせる。 |
| 187 | 00:02.57 | 画面：字幕と図 | 右手の指を曲げたときの親指 | 手の図がなく、ベクトルの図だけ。どの指をどこからどこへ曲げるか、言葉だけでは再現しにくい。 |
| 188 | 00:20.49 | 画面：字幕と式 | 半径は | 確認フレームには周期Tの式が出ている。半径の分数を説明しても対応する式を見つけられない。 |
| 189 | 00:24.46–00:29.44 | 文章：条件 | 磁気力の仕事がゼロという性質は、速さが変わらないことを意味します | 他の力が働いても一定と受け取れる。磁気力だけが働く場合の結論、と言う。 |

#### um-current-field-01 — アンペールの法則

動画の見出し：定常電流の周回積分と対称性を使い、直線電流の磁場を求める。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-current-field-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-current-field-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 190 | 00:00.00–00:06.14 | 文章：用語 | 磁場の周回積分と面を貫く電流を結びます | 道の話から面が突然出る。閉じた道と、その道をふちに持つ面を先に示す。 |
| 191 | 00:12.57–00:17.12 | 文章：文 | 周回の正の向きと面の正の向きは、右手で対応します | 「右手で対応」だけでは手を置けない。曲げた指を道の向き、親指を面のプラス向きとする。 |
| 192 | 00:14.84 | 画面：字幕と図 | 周回の正の向きと面の正の向き | 周回経路・面・磁場の線が図で明確に区別されていない。物理的な磁場の向きと、計算で選ぶ正方向が混ざる。 |

#### um-current-field-02 — アンペールの法則

動画の見出し：定常電流の周回積分と対称性を使い、直線電流の磁場を求める。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-current-field-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-current-field-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 193 | 00:12.84–00:19.40 | 文章：文 | 円周上での一定の強さと接線方向の対称性 | 「接線方向の対称性」が曖昧。どこでも同じ強さで、磁場が円に沿う向き、と二つに分ける。 |
| 194 | 00:27.88 | 画面：字幕 | 半径に反比例 | 導線の太さの半径と混同しやすい。導線から観測点までの距離r、と量の意味を言い直す。 |

#### um-induction-01 — ファラデーの法則を微分で

動画の見出し：ファラデーの法則から回転コイルと動く導線の起電力を計算する。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-induction-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-induction-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 195 | 00:03.10 | 画面：字幕と図 | 変動磁束による電場ではゼロとは限りません。 | 図には静電場の一周で0という説明だけが残る。今は静電場ではない場合を説明している、という切り替えが図に反映されない。 |
| 196 | 00:19.29–00:24.64 | 文章：文 | 指定した向きに対して磁束の変化を妨げる関係 | 何が妨げるか消えている。法線と周回の向きの約束を示し、誘導電流が作る磁場と結ぶ。 |
| 197 | 00:25.99–00:31.99 | 文章：文 | 各巻きを同じ磁束が貫く場合 | 巻き線を磁束が貫くように聞こえる。各一周が囲む面を通る磁束が同じ、とする。 |
| 198 | 00:28.99 | 画面：字幕と図 | 各巻きを同じ磁束が貫く場合 | 図は面1枚で、何巻きもあるコイルがない。「各巻き」「一巻き」の比較対象が見えない。 |

#### um-induction-02 — ファラデーの法則を微分で

動画の見出し：ファラデーの法則から回転コイルと動く導線の起電力を計算する。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-induction-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-induction-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 199 | 00:00.00–00:05.51 | 文章：指示 | 面と磁場の角度 | 磁束公式は法線との角度を使う。前の角度の定義と混同させる言い方。 |
| 200 | 00:05.66–00:10.47 | 文章：文 | 磁束のコサインの変化 | 磁束の値のcosを取るように聞こえる。磁束がcos(ωt)の形で変化する、とする。 |
| 201 | 00:27.20 | 画面：字幕と図 | 動く棒が作る回路の面積変化率 | 図は磁場中の導線に働く力で、回路や囲まれた面がない。何の面積が変わるか特定できない。 |

#### um-circuit-time-01 — RC・RL回路の過渡現象

動画の見出し：回路の収支を微分方程式に直し、RCの時定数と充放電の行き先を求める。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-circuit-time-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-circuit-time-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 202 | 00:00.00–00:05.04 | 文章：文 | この回路は、電荷ゼロのコンデンサを一定電圧の電池から充電します | 回路が充電する主語になっている。この回路では、電池をつないでコンデンサを充電する、とする。 |
| 203 | 00:02.52 | 画面：図の文言 | 満タンQ=CV | コンデンサ固有の最大容量のように読める。この電池電圧での最終電荷、と条件を添える。 |
| 204 | 00:19.99 | 画面：字幕と式 | 電流を電荷の時間微分に置き換えると | 式は既に積分したln&#124;u&#124;の式。置き換えるIとdq/dtが見えず、今の操作を追えない。 |
| 205 | 00:24.34–00:30.95 | 文章：文 | その差の変化率は差自身に比例して負になります | 差と変化率のどちらが負か追いにくい。「残りの差が大きいほど速く減り、差が小さくなるとゆっくり減る」と結ぶ。 |

#### um-circuit-time-02 — RC・RL回路の過渡現象

動画の見出し：回路の収支を微分方程式に直し、RCの時定数と充放電の行き先を求める。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-circuit-time-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-circuit-time-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 206 | 00:02.19 | 画面：図の文言 | 回路の「反応時間」 | 反応を始めるまでの待ち時間と誤解しやすい。変化の速さの目安となる時間、とする。 |
| 207 | 00:04.53–00:11.65 | 文章：文 | 時定数一回分の時間 | 回数として数えるのが不自然。「時間がRC秒たつと」と具体化する。 |
| 208 | 00:13.00–00:18.85 | 文章：文 | 時刻に時定数を代入した充電率 | 何の式のどの文字か不明。「充電量の式にt=RCを入れると」とする。 |
| 209 | 00:32.17 | 画面：字幕と図 | 放電の電荷 | 図は右上がりで「充電中」「満タン」。減る放電の説明と増える充電の絵が正反対。 |

#### um-ac-maxwell-01 — 交流とマクスウェル方程式

動画の見出し：交流での微分積分から素子の応答を出し、四つの場の法則を整理する。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-ac-maxwell-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-ac-maxwell-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 210 | 00:02.14 | 画面：字幕と図 | 正弦波の交流電流 | 図は周波数と通しにくさのグラフで、電流の正弦波ではない。振幅・位相の説明を図から読めない。 |
| 211 | 00:10.29–00:15.63 | 文章：用語 | 交流への応答は、振幅比と位相差の両方を持ちます | 応答・振幅比・位相差が一文に集中。電流に対し電圧がどれだけ大きく、いつ最大になるか、の二点を示す。 |
| 212 | 00:12.96 | 画面：図の文言 | 通しにくさ | 何を通しにくいか省略される。交流電流の流れにくさ、と対象を明示し、電圧と電流の振幅比との関係を示す。 |
| 213 | 00:30.97 | 画面：字幕と図 | 四分の一周期先行します。 | 時間軸の波形がなく、どちらの最大値が先か確かめられない。先行という言葉を同時刻の波形で補う必要がある。 |

#### um-ac-maxwell-02 — 交流とマクスウェル方程式

動画の見出し：交流での微分積分から素子の応答を出し、四つの場の法則を整理する。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/um-ac-maxwell-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/um-ac-maxwell-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 214 | 00:04.16–00:09.86 | 文章：指示 | 平均電荷ゼロの正弦交流では | 平均の対象と条件を入れる理由が不明。一定の電荷が上乗せされていない場合、と式の定数項に結ぶ。 |
| 215 | 00:07.01 | 画面：字幕と図 | 四分の一周期遅れます。 | ここも周波数のグラフで、電圧と電流の時間のずれが表示されない。「遅れる」の比較対象が視覚的にない。 |
| 216 | 00:13.74 | 画面：図の文言 | 袋の本数=電荷 | 袋の数なのか線の数なのか不明で、単位も異なる量を等号で結ぶ。閉じた面の電気束は内部電荷に比例、と表す。 |
| 217 | 00:16.42–00:21.82 | 文章：用語 | 物質中の場には材料の応答も必要です | 何を追加すればよいか分からない。材料が電場に応じて分極する性質などを例示する。 |
| 218 | 00:25.77 | 画面：図の文言 | 磁力線は閉じる | どの磁力線も必ず有限の閉じた輪になる、と読める。磁場には電荷のような湧き出し・吸い込みがない、という法則の範囲を明示する。 |

### 上級

#### ue-integrals-01 — 線積分・面積分を計算する

動画の見出し：曲線上の仕事を、道の目盛りuを使う一変数積分へ直す。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-integrals-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-integrals-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 219 | 00:03.05 | 画面：図の文言 | 効く成分 | 何に効くのかが省略されている。電気力の仕事の計算に使う、移動方向の電場成分、と対象を明示する。 |
| 220 | 00:12.04–00:16.28 | 文章：文 | 道の目盛りユーから電荷の位置を指定します | uの値を選ぶと点が一つ決まるという意味が薄い。u=0が出発点、u=1が終点、と設定を先に言う。 |
| 221 | 00:18.76 | 画面：字幕と式 | 横の位置はエルかけるユー、縦の位置はエイチかけるユーの二乗です。 | この確認フレームの式はr(u+h)−r(u)。位置の式ではなく二つの位置の差なので、字幕が説明するLu、Hu²を探せない。 |
| 222 | 00:22.44–00:26.67 | 文章：指示 | 目盛り一単位あたりの位置の変化 | 有限の1単位移動と微分を混同する。uの小さな変化に対する位置の変わり方、と極限に結ぶ。 |
| 223 | 00:29.02 | 画面：字幕と式 | その微分と微小な刻みの積 | 画面は有限の差r(u+h)−r(u)であり、r′(u)duではない。「その微分」「刻み」が何を指すか画面から追えない。 |

#### ue-integrals-02 — 線積分・面積分を計算する

動画の見出し：変化する電場で電子を指定経路に沿って運ぶ仕事W(u)を求める。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-integrals-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-integrals-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 224 | 00:00.00–00:03.72 | 文章：指示 | 位置に比例して強くなります | 位置はベクトルか距離か不明。この例では原点からの距離に比例して電場の強さが増す、とする。 |
| 225 | 00:01.86 | 画面：図の文言 | ここまでに電気力がした仕事（累積） | 図の数値はW/e、単位V。仕事WそのもののJではない。仕事を電気素量で割った値を表示している、と区別が必要。 |
| 226 | 00:11.08–00:14.98 | 文章：文 | 各成分の電場と移動の積の和 | 何と何を組にするか不明。横同士を掛け、縦同士を掛け、その二つを足す、とする。 |
| 227 | 00:26.08–00:31.56 | 文章：指示 | 上端のユーとは別の役割です | 役割を説明していない。vは途中を順に調べる変数、uはどこまで足すかを指定する終点、とする。 |
| 228 | 00:28.82 | 画面：字幕と式 | 積分変数ブイは道の途中の目盛りで、上端のユーとは別の役割です。 | 確認フレームはv²/2などの微分の式で、積分の上端uが見えない。説明対象を同じ画面に残す必要がある。 |
| 229 | 00:41.16 | 画面：字幕と図 | この例の負の仕事 | 図は途中までの移動、式はW(1)という終点までの結果。「この例」だけでは途中の値か全体の値か分からない。 |

#### ue-integrals-03 — 線積分・面積分を計算する

動画の見出し：仕事の経路によらない性質から、電位差の式を導く。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-integrals-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-integrals-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 230 | 00:10.93–00:15.77 | 文章：文 | 位置の二乗の始点と終点の差 | 語順が不自然。終点でのx²+y²から始点でのx²+y²を引く、と式の対象を明示する。 |
| 231 | 00:13.35 | 画面：図の文言 | 外向きの電場へ電子を運ぶ | 「電場へ」が行き先のように読める。電場の矢印と同じ向きへ運ぶのか、電荷から遠ざけるのか明記する。 |
| 232 | 00:18.39 | 画面：図の文言 | Vは低く | 複数の半径の説明が同じ表現で、何と比較して低いか不明。中心に近い点より低い、など比較対象が必要。 |
| 233 | 00:28.44 | 画面：字幕と式 | 電気力の仕事を電荷で割り、負号を付けた量 | 画面はV=U/qと位置エネルギーの差。仕事Wと負号が同時に見えず、UとWの接続を視聴者が補う必要がある。 |
| 234 | 00:34.36 | 画面：図の文言 | 合計(いま): | 何の合計か、単位は何かが書かれていない。電場の線積分と仕事と電位差を区別できない。 |

#### ue-integrals-04 — 線積分・面積分を計算する

動画の見出し：不均一な場が正方形を貫く電気束βL³/2を計算する。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-integrals-04.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-integrals-04/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 235 | 00:11.43–00:16.84 | 文章：指示 | ベータかけるエックスを横幅の範囲で足します | dxの幅を掛ける操作が消える。各位置のβxに小さな横幅を掛けて足す、と言う。 |
| 236 | 00:14.14 | 画面：字幕と図 | 横一列 | 立体図のx・y・zに対して、画面の横と座標のどちらを指すか曖昧。x方向の帯、と図中の軸に対応させる。 |
| 237 | 00:27.34–00:33.70 | 文章：指示 | 帯の係数 | 初出の「係数」が何の数か不明。横一列の積分で得たβL²/2など、実際の式を指す。 |
| 238 | 00:43.40 | 画面：字幕と式 | 二つの方向の集計 | 確認フレームは単位の換算式。二重積分の二つの方向を見つけられない。「x方向に足した後、y方向に足す」と式と図を一致させる。 |

#### ue-integrals-05 — 線積分・面積分を計算する

動画の見出し：球の小面積dAを組み立て、積分で球面積4πR²を導く。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-integrals-05.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-integrals-05/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 239 | 00:02.31 | 画面：図の文言 | 電荷と面の配置は同じです。 | 球の面積を扱う図に電荷が描かれていない。いま説明していない対象を持ち込んでいる。 |
| 240 | 00:04.76–00:09.73 | 文章：条件 | 球の表面の円弧の長さは、半径と角度の変化の積になります | 球面上のどの円弧でも球の半径Rでよいように聞こえる。縦の円と横の輪の半径を分ける。 |
| 241 | 00:16.80–00:22.20 | 文章：用語 | 周方向の角度の変化 | 「周方向」がどちらか不明。球の軸の周りを回る角度φと図の矢印で指定する。 |
| 242 | 00:19.50 | 画面：字幕と式 | その輪の円弧の長さ | 表示式は面積の積。円弧の長さを表す因子がどれか示されず、「その輪」と対応付けられない。 |
| 243 | 00:31.39 | 画面：字幕と式 | 縦の円弧の長さと横の円弧の長さの積 | 確認フレームはsinθ=ρ/R。説明している面積の積とは違う式なので追えない。 |
| 244 | 00:41.46–00:48.02 | 文章：指示 | 二つの角度の積分が、それぞれ二と二パイ | θそのものの積分が2になると誤読する。sinθを0〜πで積分、1を0〜2πで積分、と対応を言う。 |

#### ue-gauss-01 — ガウスの法則を証明する

動画の見出し：中心のずれた球で、各点の電場の法線成分E·nを求める。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-gauss-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-gauss-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 245 | 00:11.70–00:17.43 | 文章：指示 | 法線は球の中心から同じ点へ向きます | 位置ベクトルと、その点に置く単位法線を混同する。単位法線の向きが中心から外へ向かう半径方向、とする。 |
| 246 | 00:28.87–00:34.51 | 文章：指示 | 三角関数の二乗の和が一になるため | 全ての三角関数の二乗の和ではない。sin²θ+cos²θ=1のどの項を使うか示す。 |
| 247 | 00:28.87–00:34.51 | 文章：文 | 内積は画面の式まで整理できます | 「画面の式」が説明の代わりになっている。消えた項と残った項を言う。 |
| 248 | 00:31.69 | 画面：字幕と式 | 内積は画面の式まで整理できます。 | 画面の式はr²=R²+d²+2Rd cosθという距離の二乗。内積r・nの式ではなく、「画面の式」という指示が成立しない。 |
| 249 | 00:43.83 | 画面：字幕と式 | 距離の三乗 | 画面の分母は括弧の3/2乗。括弧が距離の二乗だという一言がないと、三乗という説明と一致しないように見える。 |

#### ue-gauss-02 — ガウスの法則を証明する

動画の見出し：偏心球の面積分を、置換によってべき関数の積分へ直す。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-gauss-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-gauss-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 250 | 00:00.00 | 画面：見出し | 偏心球の面積分を、置換によってべき関数の積分へ直す。 | 偏心球・置換・べき関数を同時に処理させる。中心がずれた球、積分する文字を変える、など既に使った言葉に接続する。 |
| 251 | 00:05.74–00:11.22 | 文章：指示 | 残りは縦方向の角度の積分です | 縦の距離と角度が混ざる。北極側から測る角度θについての積分、とする。 |
| 252 | 00:08.48 | 画面：字幕と式 | 周方向の積分 | 説明はφの積分だが、画面はuについて積分した後の式。φがどこで2πになったか追えない。 |
| 253 | 00:24.36–00:29.52 | 文章：文 | 分子のコサインと積分の両端も、新しい変数ユーの式に変わります | 自然に変わるように見える。cosθをuで表し、θの始めと終わりに対応するuの値も計算する、とする。 |
| 254 | 00:32.20 | 画面：字幕と式 | 上端と下端 | 確認フレームに積分範囲がなく、uの定義と微分関係だけがある。交換する二つの値を示す必要がある。 |
| 255 | 00:36.09–00:40.31 | 文章：用語 | ユーの二つのべき関数の和 | べき関数という名前だけでは式が浮かばない。uの何乗の項が二つ残るか指す。 |

#### ue-gauss-03 — ガウスの法則を証明する

動画の見出し：偏心球の積分を評価し、内部電荷と外部電荷の束を区別する。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-gauss-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-gauss-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 256 | 00:00.00–00:04.76 | 文章：文 | 原始関数ジーは、置換後の積分を計算するための関数です | 目的を繰り返すだけ。Gを微分すると積分する式に戻る、という定義を言う。 |
| 257 | 00:00.00 | 画面：見出し | 偏心球の積分を評価し | 「評価」が出来栄えを採点する意味に読める。積分の値を計算する、とする。 |
| 258 | 00:04.91–00:10.04 | 文章：文 | その関数の上端と下端の差 | 関数に上端・下端があるように聞こえる。積分の上端でのGの値から下端でのGの値を引く、とする。 |
| 259 | 00:07.48 | 画面：字幕と式 | 上端と下端の差 | 画面には上端を代入したGの値しかない。差を取るもう一方の値がなく比較できない。 |
| 260 | 00:11.39–00:17.61 | 文章：指示 | 中心のずれの四倍 | 何のずれか・記号が不明。電荷から球の中心までの距離aの4倍、と指す。 |
| 261 | 00:20.23 | 画面：字幕と式 | この値は球全体の集計結果で、各点の電場の値ではありません。 | 内部電荷の電気束を説明した後に、画面はΦE=0でもE≠0。「この値」が直前の非ゼロの束なのか、表示中のゼロなのか分からない。 |
| 262 | 00:36.23–00:41.11 | 文章：接続 | 平方根の値は内部の場合と変わります | なぜ変わるか隠れている。√(R−a)²= |
| 263 | 00:43.99 | 画面：字幕と式 | 原始関数の両端の値が一致 | 画面には一方の端のGの値のみ。一致する二つの値を並べないと「両端」を確認できない。 |

#### ue-gauss-04 — ガウスの法則を証明する

動画の見出し：任意の小片の電気束を、立体角を使ってkQ dΩと表す。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-gauss-04.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-gauss-04/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 264 | 00:00.00–00:06.46 | 文章：文 | 電荷から見た方向に垂直な面への投影面積 | 向きの修飾が重なり、頭の中で回転が必要。電荷からその小面へ視線を向け、その視線に正面を向けた面に写す、と段階化する。 |
| 265 | 00:00.00 | 画面：見出し | 任意の小片の電気束 | 「小片」が何を分けたものか分からない。面を細かく分けた一区画、と名前より対象を先に示す。 |
| 266 | 00:17.92–00:22.60 | 文章：用語 | 方向の広がりと面の向き | 「方向の広がり」が想像しにくい。電荷から見て小面が視界のどれだけを占めるか、符号は出入りで決まる、とする。 |
| 267 | 00:31.78 | 画面：字幕と式 | 投影面積を距離の二乗で割った部分 | 画面はdA⊥=(r̂・n̂)dAで、距離の二乗で割った部分がない。「その式の中」を探しても見つからない。 |

#### ue-gauss-05 — ガウスの法則を証明する

動画の見出し：閉曲面の立体角と電場の重ね合わせから、ガウスの法則を導く。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-gauss-05.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-gauss-05/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 268 | 00:00.00–00:05.03 | 文章：指示 | 各方向に出口が一つあります | 何が出ていくのか不明。電荷からまっすぐ伸ばした線が、面と一度交わる、と説明する。 |
| 269 | 00:13.10–00:18.16 | 文章：文 | 凹んだ面での交差は、外へ出ると正、内へ入ると負の寄与です | 交差する線が明示されていない。同じ半直線が面を通過する場所と符号を一つずつ示す。 |
| 270 | 00:25.62–00:31.63 | 文章：文 | 内部の点電荷は正味の電気束を残し | 「残す」が物理的に何か残存する印象。全ての面の電気束を足してもゼロにならない、とする。 |
| 271 | 00:33.97 | 画面：表示不具合 | 電荷が閉曲面上にないこと | 同時に出る数式で閉曲面積分が赤い未変換の「\oiint」になっている。日本語自体とは別の表示不具合だが、説明の対象を読めない。 |
| 272 | 00:45.35 | 画面：字幕と式 | 内部電荷の合計を真空の誘電率で割った値 | 確認フレームは立体角の合計4πを示す式。電荷と誘電率の式を同時に見せないと結論の対象が分からない。 |

#### ue-gauss-06 — ガウスの法則を証明する

動画の見出し：ガウスの法則と対称性を使い、点電荷・線電荷の電場を求める。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-gauss-06.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-gauss-06/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 273 | 00:08.52 | 画面：字幕と式 | この対称性 | 点電荷について説明しているのに、表示は平面電荷のE=σ/(2ε₀)。どの配置の対称性を指すか混乱する。 |
| 274 | 00:12.65–00:17.10 | 文章：指示 | 線から真横へ向きます | 図の横か空間のどの方向か不明。直線に垂直で、線から離れる方向、と符号条件も示す。 |
| 275 | 00:46.21 | 画面：字幕と式 | 距離の二乗 | 距離依存を比べる説明中に、距離を含まない平面の式が表示される。点電荷・線電荷・平面電荷の式に対象名が必要。 |

#### ue-gauss-07 — ガウスの法則を証明する

動画の見出し：電気束0だけで言えることと、電場0を結論できる条件を区別する。

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-gauss-07.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-gauss-07/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 276 | 00:07.68 | 画面：字幕と式 | 各点の電場は、外部電荷によってゼロでない場合があります。 | 画面はE合=E外+E再配置=0。別の導体の話を先に見せているため、「ゼロでない」と「=0」が矛盾するように見える。 |
| 277 | 00:11.24–00:15.82 | 文章：用語 | 一様な球殻だけが作る電場は、球対称性を持ちます | 一様なのは殻の厚さか電荷か。「球の表面に電荷が均等に分布する場合」と明記する。 |
| 278 | 00:13.53 | 画面：字幕と図 | 一様な球殻 | 二つの球面のうち、電荷が載る実物の面と計算用の面がどちらか分からない。図の名前が不足している。 |
| 279 | 00:34.95–00:41.16 | 文章：用語 | 自由電荷の再配置 | 何が動くか想像しにくい。動ける電荷が移り、その電荷が作る電場によって内部の電場を打ち消す、とする。 |

#### ue-potential-01 — 電位: 電気の地形図

動画の見出し：微小移動の仕事から電場を電位の傾きへ結ぶ ／ 点電荷の電位を積分しエネルギーへ戻す

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-potential-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-potential-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 280 | 00:05.43–00:10.20 | 文章：指示 | 電位差を横の距離で割った値の極限 | 何をゼロへ近づけるか不明。二点の横方向の間隔をゼロへ近づける、と言う。 |
| 281 | 00:14.05 | 画面：図の文言 | 混む所で強い | 何が混むのか不明。等電位線の間隔が狭いところ、という対象が必要。 |
| 282 | 00:16.70–00:20.48 | 文章：指示 | ほかの座標は固定されたままです | 「ほか」を暗記するだけ。xを変えて調べる間、yとzは変えない、と具体化する。 |
| 283 | 00:18.59 | 画面：字幕と式 | 偏微分では、ほかの座標は固定されたままです。 | 偏微分を説明中なのに画面はE=V/d。一般式と一様電場の特別な式の違いが説明されない。 |
| 284 | 00:25.65–00:31.18 | 文章：接続 | 電場と面内の移動の内積がゼロになるため | ある一方向との内積ゼロだけでは垂直とは言えない。面に沿うどの向きの微小移動でもゼロ、と言う。 |
| 285 | 00:34.96 | 画面：字幕と図 | 無限遠を基準 | 図は試験電荷とE=F/qで、遠方や基準点がない。「どこからどこまで」を図で補えない。 |
| 286 | 00:37.53–00:42.75 | 文章：文 | 距離のマイナス二乗の原始関数は、距離の逆数に負号を付けた関数 | 音だけで式を保持しづらい。−1/rを微分すると1/r²に戻る、と画面の式と対にする。 |

#### ue-potential-02 — 電位: 電気の地形図

動画の見出し：電位一定と、電位0を区別する

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-potential-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-potential-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 287 | 00:13.04 | 画面：図の文言 | 電位Vの高さ | 導体の絵に斜めの線が重なり、実際の物体の高さと電位の数値を区別する軸がない。 |
| 288 | 00:14.96–00:21.37 | 文章：文 | 電場のゼロは電位の空間的な傾きがゼロという条件 | 硬い名詞構文。「電位が周囲のどの向きにも変わらない場所では、電場がゼロ」と述べる。 |
| 289 | 00:25.15 | 画面：字幕と図 | 理想導線の抵抗はゼロと近似されるため、電位降下もゼロです。 | 字幕は理想導線の説明だが、図は電子の散乱を表す模型。理想導線と抵抗のある導線を切り替えたことが伝わらない。 |
| 290 | 00:25.15 | 画面：図の文言 | 電子の模式軌道 | 「模式」「格子」の説明がない。電子の動きの簡略図、金属中の原子の位置、など図中の対象を直接呼ぶ。 |

#### ue-capacitor-01 — コンデンサを導出する

動画の見出し：充電の仕事を積分して場のエネルギーを求める

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-capacitor-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-capacitor-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 291 | 00:02.29 | 画面：図の文言 | 仕事の短冊 | 仕事そのものが細長い紙片のように読める。「細い長方形の面積が、この分の仕事を表す」が必要。 |
| 292 | 00:04.74–00:09.98 | 文章：指示 | 少しずつ電荷を運ぶ仕事 | どこからどこへ、誰の仕事か。片方の板から他方へ電荷を移すため、外部が行う仕事、と設定を示す。 |
| 293 | 00:14.28 | 画面：図の文言 | エネルギーは空間の状態に宿る | 「宿る」は比喩で、何が分かったか説明していない。電場のある場所に、E²に比例するエネルギーを割り当てられる、と具体化する。 |
| 294 | 00:19.59 | 画面：図の文言 | 明るさ ∝ E² | 実際に光るのか、図の表示上の工夫なのか曖昧。明るさでエネルギー密度を表した図、と明記する。 |
| 295 | 00:23.15–00:28.90 | 文章：文 | エネルギーの式への容量と電圧の代入が、板間の体積を含む式を与えます | 代入を主語にした説明が追いづらい。どの式へCとVの何を入れるか順番に示す。 |
| 296 | 00:31.70 | 画面：字幕と式 | 体積で割った結果 | 式はまだ体積Sdを含む全エネルギー。全体の量Uと体積あたりの量uを指し分ける必要がある。 |

#### ue-capacitor-02 — コンデンサを導出する

動画の見出し：誘電体で何が変わり、何を固定するかを考える

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-capacitor-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-capacitor-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 297 | 00:02.38 | 画面：図の文言 | 絶縁体の分子が電場に沿って向きを揃える（分極） | 向きが揃う模型を全ての分極の定義のように言っている。電荷の位置がずれる場合もあり、「ここでは向きが揃う例」と限定する。 |
| 298 | 00:18.82 | 画面：図の文言 | 分極の逆向き電場でEが弱まる | 電池につないで電圧一定という字幕の場面にもこの図の文が残る。電圧一定・間隔一定の板間電場まで弱まると誤解させる。 |
| 299 | 00:23.67–00:29.29 | 文章：文 | 一様な線形誘電体を満たした容量 | 「容量を満たす」という不自然な修飾。板の間を誘電体で満たしたコンデンサの容量、とする。 |
| 300 | 00:23.67–00:29.29 | 文章：用語 | 真空の場合の比誘電率倍 | 比誘電率が未知だと比較できない。比誘電率が3なら容量は3倍、と例を添える。 |

#### ue-current-01 — 電流のミクロな正体

動画の見出し：散乱の模型から局所と回路のオーム則を結ぶ

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-current-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-current-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 301 | 00:00.00–00:05.78 | 文章：用語 | 散乱による運動量の損失 | 何が何にぶつかり、何の平均が減るか不明。電子の進む向きが乱され、電場方向にそろった運動が減る、とモデルを説明する。 |
| 302 | 00:00.00 | 画面：見出し | 局所と回路のオーム則を結ぶ | 「局所」はどこの何か不明。導体中の各点の電場と電流密度の関係、と回路全体のV=RIを区別する。 |
| 303 | 00:02.89 | 画面：図の文言 | 電子は平均して右へ | 時間平均なのか、電子を集めた平均なのか不明。ばらばらに動きながら全体として少しずつ右へ、と補う。 |
| 304 | 00:12.01–00:17.47 | 文章：文 | 電子の平均運動の式 | 位置・速度・力のどの式か不明。電子の平均速度の変化を表す運動方程式、とする。 |
| 305 | 00:39.56 | 画面：字幕と式 | 電流密度と断面積の積 | 確認フレームはR=ρl/S。字幕の積jSを探せない。 |
| 306 | 00:42.01–00:49.11 | 文章：指示 | 電場を電圧と長さの比に直すと | 何の電圧・長さか不明。導線の両端の電圧と、その間の長さ、とする。 |

#### ue-current-02 — 電流のミクロな正体

動画の見出し：保存則と電力で回路・送電を読む

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-current-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-current-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 307 | 00:00.00 | 画面：見出し | 保存則と電力で回路・送電を読む | 何の保存則か、何を計算できるかが見出しにない。「読む」が学習の目的をぼかしている。 |
| 308 | 00:02.85 | 画面：図の文言 | 高電圧（100倍）：電流1/100 | 何に対する100倍か、何を一定にする比較かが図中にない。送る電力を同じにする条件が必要。 |
| 309 | 00:18.13–00:23.50 | 文章：文 | 線の発熱を計算する電圧は、線自身の抵抗による電圧降下です | 全ての発熱計算に電圧が必須の印象。V²/Rで計算する際に使うVだと限定する。 |
| 310 | 00:20.81 | 画面：字幕と式 | 線自身の抵抗による電圧降下 | 説明は線の電圧降下だが式は送電電圧V送を含む。I=P送/V送を代入した別表現だと示さないと矛盾に見える。 |

#### ue-lorentz-01 — ローレンツ力

動画の見出し：一様磁場の運動から円の半径と周期を導く ／ 粒子の力を足して導線の力を求める

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-lorentz-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-lorentz-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 311 | 00:05.74–00:11.01 | 文章：文 | 半径の式を円周と速さの比に代入すると | 比がどちら割るどちらか分からない。周期T=2πr/vへ半径rの式を入れる、とする。 |
| 312 | 00:12.36–00:18.43 | 文章：文 | 電流と長さベクトルと磁場の外積 | スカラーの電流まで外積の対象に聞こえる。長さベクトルと磁場の外積に電流を掛ける、とする。 |
| 313 | 00:18.58–00:22.72 | 文章：用語 | コイルを回すトルクを作ります | トルクが初出なら回す働きの大きさだと添える。力と区別する。 |
| 314 | 00:20.65 | 画面：字幕と図 | コイルの左右の力 | 図は一本の直線導線しかなく、コイルの左右も回転軸もない。「左右」の指す場所がない。 |
| 315 | 00:32.48 | 画面：字幕と式 | 電流の式でまとめると | 表示は粒子数nSlなどを含む途中式。どの部分が電流Iになるか囲って示されず、まとめる操作が分からない。 |

#### ue-lorentz-02 — ローレンツ力

動画の見出し：平行成分を合わせ、らせんと模型の限界を読む

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-lorentz-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-lorentz-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 316 | 00:00.00–00:05.84 | 文章：文 | 垂直成分は円運動します | 速度成分自体が粒子のように円運動する表現。磁場に垂直な平面に映した粒子の動きが円運動になる、とする。 |
| 317 | 00:00.00 | 画面：見出し | 平行成分を合わせ、らせんと模型の限界を読む | 何の平行成分を何に合わせるか省略されている。「限界を読む」も、説明できない現象を確認する、など目的に直す。 |
| 318 | 00:24.74 | 画面：字幕と図 | 磁力線に沿う荷電粒子の運動 | 「沿う」が磁力線の上を走る意味に読める。磁場方向に進みながら、その方向を軸に回る、という意味を分ける。 |

#### ue-ampere-01 — アンペールの法則

動画の見出し：電流の各部分が作る場を積分する

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-ampere-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-ampere-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 319 | 00:00.00–00:07.56 | 文章：指示 | 微小な導線のベクトル | ベクトルの長さの意味が抜ける。短く分けた導線の向きと長さを表すdℓ、とする。 |
| 320 | 00:03.78 | 画面：図の文言 | 合計：0.98（相対値） | 何の合計か、何を1とするか不明。観測点の磁場の大きさであることと表示尺度が必要。 |
| 321 | 00:26.79–00:33.70 | 文章：指示 | 各区間からの距離が同じ | どこまでの距離か。各区間からコイルの中心までの距離、とする。 |
| 322 | 00:30.25 | 画面：字幕と図 | 円形コイルの中心 | 画面は直線導線とその横の点P。円形コイルも中心もなく、距離が等しいという説明を確かめられない。 |

#### ue-ampere-02 — アンペールの法則

動画の見出し：長いソレノイドの四辺を数えて磁場を導く

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-ampere-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-ampere-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 323 | 00:05.13–00:10.96 | 文章：文 | アンペールの法則とこの近似が、巻数密度と電流から磁場を求める式を与えます | 結果が得られるとだけ述べる。長方形のどの辺の積分が残るかへ具体的につなぐ。 |
| 324 | 00:14.91 | 画面：字幕と図 | 長方形の経路 | 図に長方形がない。どの辺の積分がゼロになるか、文中の「内部の辺」を特定できない。 |
| 325 | 00:17.67–00:23.42 | 文章：指示 | 長さエルの範囲を貫く電流 | 長さを電流が貫くとは何か。長方形が囲む面を、導線がnL本横切る、とする。 |
| 326 | 00:29.87–00:36.67 | 文章：文 | 近似の補正が必要です | どう違うか伝わらない。短いコイルや端では磁場が一様にならず、この式からずれる、とする。 |

#### ue-faraday-01 — ファラデーの法則を微分で

動画の見出し：自己誘導の式からコイルのエネルギーを求める

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-faraday-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-faraday-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 327 | 00:00.00–00:03.95 | 文章：用語 | 線形コイルの鎖交磁束 | 線形・鎖交磁束が同時に未知。電流を2倍にすると、全ての巻きについて足した磁束も2倍になる場合、と先に示す。 |
| 328 | 00:01.97 | 画面：図の文言 | 電流の慣性（質量の役） | 電流が質量を持つという意味に読める。電流の変化を妨げる点が物体の慣性に似る、という比喩の範囲が必要。 |
| 329 | 00:15.43–00:21.70 | 文章：用語 | 受動符号での端子電圧 | 約束を知らないと正負を追えない。電流が入る端を＋と決めた電圧、という約束を図示する。 |
| 330 | 00:18.56 | 画面：字幕と図 | 向きの約束が異なるため符号が逆になります。 | 図は電流の時間変化のグラフで、二つの電圧の正方向がない。「異なる」二つを比較できない。 |
| 331 | 00:23.05–00:28.87 | 文章：文 | インダクタンスと電流と電流の増分の積 | IとdIの区別が耳で難しい。現在の電流Iと、そこから増やす小さな量dIを分ける。 |

#### ue-faraday-02 — ファラデーの法則を微分で

動画の見出し：相互誘導から変圧器の電圧比を求める

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-faraday-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-faraday-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 332 | 00:08.52 | 画面：字幕と図 | 導線で直結しないエネルギーの受け渡し | どちらのコイルからどちらへ渡るかが抽象的。一次側の電源から二次側の負荷へ、と対象名が必要。 |
| 333 | 00:17.74–00:23.65 | 文章：指示 | 電流比はその逆になります | 何を分子にした比の逆か不明。一次／二次の電圧比と電流比を同じ順序で書く。 |
| 334 | 00:30.46–00:36.22 | 文章：文 | ファラデーの法則への代入が、他方のコイルに生じる誘導起電力の式を与えます | 何を代入したか消えている。二つ目のコイルの鎖交磁束をM I₁で置き換える、とする。 |

#### ue-transient-01 — RC・RL回路の過渡現象

動画の見出し：回路の電圧の和を電荷の微分方程式にする ／ RL回路を同じ「最終値との差」で解く

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-transient-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-transient-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 335 | 00:00.00–00:05.55 | 文章：指示 | 最終電荷との差 | どちらからどちらを引くか不明。充電完了時の電荷から現在の電荷を引いた「残り」とする。 |
| 336 | 00:02.77 | 画面：図の文言 | 量 | グラフの縦軸が「量」だけ。電流か電荷か、最終値との差か区別できない。 |
| 337 | 00:15.13 | 画面：図の文言 | 電流の慣性を急停止させる衝撃の電気版 | ONの電流増加の図に「急停止」「衝撃」がある。何の現象を指すのか一致しない。 |
| 338 | 00:17.56–00:23.74 | 文章：用語 | 時定数として立ち上がります | 「立ち上がる」は専門的な比喩。電流がゼロから増え、L/R秒で最終値の約63%になる、と例に結ぶ。 |
| 339 | 00:25.09–00:30.26 | 文章：指示 | 電流と最終電流との差は、指数関数的に減ります | 差の引く順序により増減の言い方が変わる。最終電流−現在の電流、という正の残りで統一する。 |

#### ue-transient-02 — RC・RL回路の過渡現象

動画の見出し：LC回路の電荷の式を振動へ結ぶ

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-transient-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-transient-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 340 | 00:00.00–00:05.08 | 文章：接続 | コンデンサとコイルがエネルギーを交換します | 何が増えて何が減るか想像できない。電荷が減る間に電流が増え、蓄えるエネルギーの場所が変わる、と説明する。 |
| 341 | 00:11.43–00:15.61 | 文章：用語 | 電荷の二階微分 | 上級でも対象の意味は要る。電荷の変化率が電流、その電流の変化率が電荷の二階微分、と結ぶ。 |
| 342 | 00:13.52 | 画面：字幕と式 | 電荷の二階微分 | 画面は角振動数と周期の式。qの二階微分を示す式がこの発話の画面にない。 |

#### ue-maxwell-01 — 交流とマクスウェル方程式

動画の見出し：四つの基本法則と変位電流の役割を整理する ／ 真空の平面波に絞り、積分形を場所の変化へ直す

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-maxwell-01.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-maxwell-01/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 343 | 00:00.00 | 画面：見出し | 積分形を場所の変化へ直す | 「積分形」「場所の変化」の対応が不明。面や道全体の式から、各点の電場・磁場の変化を表す式を導く、とする。 |
| 344 | 00:05.66–00:10.23 | 文章：文 | その変化を導線の電流と整合させます | 「整合」で何が解決するか隠れる。面の選び方によって周回積分の答えが食い違う問題と、追加項の役割を言う。 |

#### ue-maxwell-02 — 交流とマクスウェル方程式

動画の見出し：四つの基本法則と変位電流の役割を整理する ／ 真空の平面波に絞り、積分形を場所の変化へ直す

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-maxwell-02.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-maxwell-02/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 345 | 00:06.11–00:11.01 | 文章：指示 | 二つの周回の法則 | どの法則か不明。ファラデーの法則と変位電流を含むアンペールの法則を名指しする。 |
| 346 | 00:12.36–00:17.85 | 文章：指示 | 電場の寄与の差が周回積分に残ります | 電場そのものを引くのか。各辺の電場の接線成分×辺の長さを足す計算を示す。 |
| 347 | 00:15.10 | 画面：字幕と図 | 小長方形の左右の辺 | 図は円形の経路で、左右の辺が存在しない。文中の対象を図で探せない。 |
| 348 | 00:18.00–00:22.82 | 文章：指示 | 横方向の電場の変化率 | 横向き成分か、横へ動いたときの変化か曖昧。y向きの電場成分が、位置xによってどれだけ変わるか、とする。 |
| 349 | 00:20.41 | 画面：図の文言 | 静電場では一周すると合計0に戻る | 変化する磁場と電場の周回積分を導く場面で、静電場の説明が残る。今の前提を取り違えやすい。 |

#### ue-maxwell-03 — 交流とマクスウェル方程式

動画の見出し：場を消去して波動方程式と光速を導く

[MP4原本](/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-levels/public/media/em/ue-maxwell-03.mp4) ／ [確認した画面一覧](/private/tmp/physics-video-review/ue-maxwell-03/sheet.jpg)

| No. | 時刻 | 確認・分類 | 原文抜粋 | 初学者が止まる理由／修正方向 |
|---:|---|---|---|---|
| 350 | 00:00.00–00:05.38 | 文章：指示 | 二つの場の関係をそれぞれ微分すると | 何を何で微分するのか省略される。片方は時間、もう片方は位置など、式ごとに操作を言う。 |
| 351 | 00:05.53–00:10.08 | 文章：文 | その項の消去が、電場だけを含む波動方程式を与えます | 「消去」という操作名だけ。同じ磁場の微分を一方の式で置き換える、と該当箇所を指す。 |
| 352 | 00:07.81 | 画面：字幕と式 | 電場だけを含む波動方程式 | 画面は磁場Bの混合微分の等式。説明対象である電場だけの式が見えない。 |
| 353 | 00:11.43–00:16.49 | 文章：文 | 位置から速さと時間の積を引いた変数を持ちます | 式を日本語に直訳しただけ。x−ctが一定の場所を追うと山が速さcで動く、と物理的な意味を示す。 |
| 354 | 00:13.96 | 画面：字幕と式 | 位置から速さと時間の積を引いた変数 | 画面はc=1/√(με)。説明するx−ctがなく、言葉を式に対応させられない。 |
| 355 | 00:41.66–00:47.58 | 文章：文 | 二つの場の外積は波の進行方向で | ベクトルと方向を同一視している。「電場と磁場の外積が向く方向に、波が進む」とする。 |

## 実施しなかったこと

教材の日本語修正、動画の再生成、アプリの変更、commit・pushは行っていません。以前の報告のアプリUI自動補足4件は、今回の動画100本の件数には含めていません。
