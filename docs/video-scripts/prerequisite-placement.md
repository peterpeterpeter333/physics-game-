# 前提動画の追加・配置一覧

大学電磁気を除く96ステージ・既存156本に、76本の共通前提動画を組み込む。高校電磁気は対象。大学電磁気100本とバトル内容は変更しない。

## 実装方針

- 既存動画は削除・再生成せず、同じ難易度の再生リスト内で、その動画を使う前に前提動画を挿入する。
- 同じリストに同じ前提動画が複数回現れないようにする。他の章でも必要な共通動画は、同じ動画ファイルを参照する。
- 前提どうしも依存順に並べる。難易度の選択・点による移動・バトルへの移動は自由で、視聴を強制しない。
- 前提動画の中には基礎を振り返るものも含む。上級の一覧から開いても、使う前の数学へ戻れる。動画内の難易度表示はその前提動画自身の難易度。
- 以前の数値の再生位置で新しい入口を飛ばさないよう、対象分野だけ再生位置の保存キーを更新。大学電磁気のキーは保持。
- UIは動画・短い補足・移動・バトルボタンのまま。説明パネルや鍵を追加しない。

## 追加メディア

76本・285場面、合計54.8分。MP4合計53.8 MiB（ポスターとJSONを除く）。音声は既存と同じVOICEVOX Nemo 男声1、動画内にクレジットを表示。

## 確認範囲と限界

構造テストは、全156本への挿入、前提の順序、重複除去、既存動画の保持、大学電磁気の不変、字幕と音声用台本の一致、動画ファイルとタイムラインを検査する。動画の全フレームデコードは別のメディア検査で行う。描画プリフライトは全場面に実施する。

これは点検一覧への実装対応表であり、初心者全員が全項目を理解できたという証明ではない。実学習者の理解度テスト・全音声の人間による通し聴取・iPhone実機の確認は未実施。既存動画自体の誤記・音声修正や、全分野の3D化は今回の変更ではない。

## 追加した動画

|動画|内容|難易度|長さ|
|---|---|---|---:|
|[prep-position](../../public/media/lessons/prep-position.mp4)|位置と時間を、数で表す|初級|41.4秒|
|[prep-graph-slope](../../public/media/lessons/prep-graph-slope.mp4)|グラフの傾きは、何を割った値？|中級|41.5秒|
|[prep-acceleration](../../public/media/lessons/prep-acceleration.mp4)|加速度は、速度が変わる割合|初級|46.3秒|
|[prep-area-distance](../../public/media/lessons/prep-area-distance.mp4)|速度のグラフの面積が移動になる理由|中級|44.8秒|
|[prep-force](../../public/media/lessons/prep-force.mp4)|力・質量・合力を区別する|初級|42.0秒|
|[prep-vector-difference](../../public/media/lessons/prep-vector-difference.mp4)|速度の矢印を引き算する|上級|42.9秒|
|[prep-trig](../../public/media/lessons/prep-trig.mp4)|斜めの矢印を、横と縦に分ける|中級|43.8秒|
|[prep-initial-values](../../public/media/lessons/prep-initial-values.mp4)|初めの値と、増えた分を分ける|初級|43.9秒|
|[prep-work-energy](../../public/media/lessons/prep-work-energy.mp4)|仕事から運動エネルギーへ|初級|44.1秒|
|[prep-potential-conservation](../../public/media/lessons/prep-potential-conservation.mp4)|位置エネルギーと保存の条件|上級|48.4秒|
|[prep-difference-limit](../../public/media/lessons/prep-difference-limit.mp4)|小さな時間で、平均を取り直す|上級|45.0秒|
|[prep-sum](../../public/media/lessons/prep-sum.mp4)|Σは、具体的な足し算の省略|中級|42.7秒|
|[prep-integral-compute](../../public/media/lessons/prep-integral-compute.mp4)|積分は、微分で確かめながら計算する|上級|43.9秒|
|[prep-radian](../../public/media/lessons/prep-radian.mp4)|一周の角度と、回転の速さ|中級|43.8秒|
|[prep-sin-wave](../../public/media/lessons/prep-sin-wave.mp4)|円の影から、振動の式を読む|上級|46.8秒|
|[prep-vector-length](../../public/media/lessons/prep-vector-length.mp4)|ベクトルの長さと、長さ一の矢印|中級|43.0秒|
|[prep-dot-work](../../public/media/lessons/prep-dot-work.mp4)|内積は、相手の向きに沿う部分を掛ける|中級|47.0秒|
|[prep-chain](../../public/media/lessons/prep-chain.mp4)|二段階の変化率を掛ける|初級|36.2秒|
|[prep-partial](../../public/media/lessons/prep-partial.mp4)|一つだけ変える微分と、両方の変化|上級|44.9秒|
|[prep-exponential](../../public/media/lessons/prep-exponential.mp4)|同じ割合の変化から、指数関数へ|中級|47.5秒|
|[prep-log](../../public/media/lessons/prep-log.mp4)|対数は、何乗かを求める道具|上級|43.0秒|
|[prep-heat-units](../../public/media/lessons/prep-heat-units.mp4)|温度と、加えた熱の量を分ける|初級|34.8秒|
|[prep-melting](../../public/media/lessons/prep-melting.mp4)|温度が変わらない加熱と、熱の収支|上級|35.2秒|
|[prep-pressure](../../public/media/lessons/prep-pressure.mp4)|圧力は、面積一あたりの力|初級|48.5秒|
|[prep-mole](../../public/media/lessons/prep-mole.mp4)|粒子の個数を、モルで数える|中級|33.0秒|
|[prep-gas-work](../../public/media/lessons/prep-gas-work.mp4)|気体が押す仕事と、内部のエネルギー|中級|43.7秒|
|[prep-wave](../../public/media/lessons/prep-wave.mp4)|波は、物体の移動とは違う|初級|44.8秒|
|[prep-superposition](../../public/media/lessons/prep-superposition.mp4)|二つの波を、同じ場所で足す|中級|45.7秒|
|[prep-doppler](../../public/media/lessons/prep-doppler.mp4)|波源が動くと、山の間隔が変わる|初級|34.7秒|
|[prep-refraction](../../public/media/lessons/prep-refraction.mp4)|屈折の角度は、面ではなく法線から|初級|47.0秒|
|[prep-charge-current](../../public/media/lessons/prep-charge-current.mp4)|電荷・電流・電圧は、別の量|初級|44.0秒|
|[prep-circuit-power](../../public/media/lessons/prep-circuit-power.mp4)|回路の分かれ道と、電力の単位|中級|44.0秒|
|[prep-field-flux](../../public/media/lessons/prep-field-flux.mp4)|電場・磁場と、面を通る量|初級|47.6秒|
|[prep-capacitor](../../public/media/lessons/prep-capacitor.mp4)|二枚の板に、電荷とエネルギーを蓄える|初級|48.4秒|
|[prep-photon-atom](../../public/media/lessons/prep-photon-atom.mp4)|光の粒と、原子のエネルギー|初級|47.2秒|
|[prep-nucleus](../../public/media/lessons/prep-nucleus.mp4)|原子核の中身と、崩壊の数え方|初級|43.7秒|
|[prep-impulse](../../public/media/lessons/prep-impulse.mp4)|力を加えた時間から、運動量へ|初級|47.9秒|
|[prep-system](../../public/media/lessons/prep-system.mp4)|つり合いと作用反作用を分ける|上級|35.8秒|
|[prep-circular](../../public/media/lessons/prep-circular.mp4)|円運動では、進む向きが変わる|初級|49.7秒|
|[prep-spring](../../public/media/lessons/prep-spring.mp4)|ばねの変位と、戻す力の負号|初級|43.7秒|
|[prep-ode-initial](../../public/media/lessons/prep-ode-initial.mp4)|微分方程式では、関数を求める|初級|42.8秒|
|[prep-center-mass](../../public/media/lessons/prep-center-mass.mp4)|重心は、質量で重みを付けた平均|初級|33.5秒|
|[prep-rotation-inertia](../../public/media/lessons/prep-rotation-inertia.mp4)|回転する物体を、小さな質量に分ける|中級|45.5秒|
|[prep-torque](../../public/media/lessons/prep-torque.mp4)|回す力の効果と、角運動量|中級|47.1秒|
|[prep-rolling](../../public/media/lessons/prep-rolling.mp4)|転がる運動は、移動と回転の和|初級|47.6秒|
|[prep-reference](../../public/media/lessons/prep-reference.mp4)|観測者を変えると、どの値が変わる？|初級|36.7秒|
|[prep-algebra-projectile](../../public/media/lessons/prep-algebra-projectile.mp4)|着地の時刻と、三角関数の計算|上級|45.2秒|
|[prep-power-derivative](../../public/media/lessons/prep-power-derivative.mp4)|二乗の微分から、三乗の微分へ|上級|43.0秒|
|[prep-taylor](../../public/media/lessons/prep-taylor.mp4)|接線の近似から、曲がりの補正へ|中級|45.6秒|
|[prep-cosine-dot](../../public/media/lessons/prep-cosine-dot.mp4)|角度で書く内積と、成分で書く内積|上級|44.8秒|
|[prep-work-path](../../public/media/lessons/prep-work-path.mp4)|変わる力と、曲がった道の仕事|中級|46.8秒|
|[prep-sin-derivative](../../public/media/lessons/prep-sin-derivative.mp4)|三角関数を微分する前の二つの極限|上級|44.0秒|
|[prep-sin-motion](../../public/media/lessons/prep-sin-motion.mp4)|振動の位置から、速度と加速度を求める|上級|33.5秒|
|[prep-oscillation-equation](../../public/media/lessons/prep-oscillation-equation.mp4)|振動の式を、運動方程式へ戻して確かめる|上級|50.4秒|
|[prep-polar](../../public/media/lessons/prep-polar.mp4)|中心からの距離と角度で、位置を書く|上級|47.6秒|
|[prep-ellipse](../../public/media/lessons/prep-ellipse.mp4)|軌道の式が楕円を表す条件|上級|50.2秒|
|[prep-electric-work](../../public/media/lessons/prep-electric-work.mp4)|電気の仕事から、電位差へ|上級|49.2秒|
|[prep-bohr-energy](../../public/media/lessons/prep-bohr-energy.mp4)|原子の負のエネルギーは、何が基準？|上級|36.7秒|
|[prep-gas-particles](../../public/media/lessons/prep-gas-particles.mp4)|一個の分子の衝突から、圧力へ|上級|49.8秒|
|[prep-heat-cycle](../../public/media/lessons/prep-heat-cycle.mp4)|一周する熱機関の、仕事と熱|上級|33.6秒|
|[prep-traveling-wave](../../public/media/lessons/prep-traveling-wave.mp4)|場所へ届くまでの時間を、波の式へ入れる|上級|34.5秒|
|[prep-sound-boundary](../../public/media/lessons/prep-sound-boundary.mp4)|管の端と、音の節・腹|中級|39.2秒|
|[prep-light-geometry](../../public/media/lessons/prep-light-geometry.mp4)|光の波面から、屈折と干渉の計算へ|中級|46.5秒|
|[prep-charge-calculation](../../public/media/lessons/prep-charge-calculation.mp4)|電気力の大きさと、向きの計算|中級|51.9秒|
|[prep-quantum-units](../../public/media/lessons/prep-quantum-units.mp4)|電子のエネルギーと、波長の単位|中級|39.3秒|
|[prep-nuclear-energy](../../public/media/lessons/prep-nuclear-energy.mp4)|核反応では、数とエネルギーを確認する|上級|48.8秒|
|[prep-absolute](../../public/media/lessons/prep-absolute.mp4)|負号と、絶対値の折れ曲がり|上級|32.7秒|
|[prep-pendulum](../../public/media/lessons/prep-pendulum.mp4)|振り子の位置を、弧の長さで測る|初級|35.3秒|
|[prep-collision](../../public/media/lessons/prep-collision.mp4)|衝突後の二つの速度を、二つの式で求める|上級|35.4秒|
|[prep-mass-integration](../../public/media/lessons/prep-mass-integration.mp4)|長さ・面積・体積を、小さな質量へ変える|上級|49.1秒|
|[prep-derivative-rules](../../public/media/lessons/prep-derivative-rules.mp4)|定数と一次式を、同じ定義で微分する|中級|36.7秒|
|[prep-energy-chain](../../public/media/lessons/prep-energy-chain.mp4)|仕事の式で、なぜ速度の微分が出る？|上級|36.1秒|
|[prep-inverse-potential](../../public/media/lessons/prep-inverse-potential.mp4)|無限遠を基準に、引力のエネルギーを求める|上級|45.9秒|
|[prep-cross-components](../../public/media/lessons/prep-cross-components.mp4)|外積の成分は、基本の三方向から作る|上級|48.0秒|
|[prep-drag-solve](../../public/media/lessons/prep-drag-solve.mp4)|終端速度との差を、指数で求める|上級|48.5秒|
|[prep-oscillation-coefficients](../../public/media/lessons/prep-oscillation-coefficients.mp4)|振動の係数を、初期条件と連立式で決める|上級|46.3秒|

## 点検一覧との対応（既存156本）

「追加する説明」は前回の点検時点の記録。以下の順で前提動画を表示し、その後で既存動画へ進む。共通事項を複数箇所へ再掲するので、動画数と指摘数は一致しない。

### 1. 位置の変化から速度へ・初級

既存：`m1-velocity-intro` — 往復した人の平均速度は、なぜゼロになる？

追加する説明：直線を同じ時間に進む数値例→距離÷時間→位置の符号→往復の順にする。

1. 位置と時間を、数で表す（`prep-position`）
2. 既存動画：往復した人の平均速度は、なぜゼロになる？

### 2. 位置の変化から速度へ・中級

既存：`m1-velocity-middle` — 位置のグラフの傾きは、なぜ速度になる？

追加する説明：時刻と位置の表から2点を打つ→差を引き算→縦÷横→原点より左にいることとの区別を示す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 既存動画：位置のグラフの傾きは、なぜ速度になる？

### 3. 位置の変化から速度へ・上級

既存：`m1-velocity-advanced` — 平均から、その瞬間の速度へどう近づく？

追加する説明：関数を時刻から位置を得る規則として導入し、実数の短い区間を計算してから極限・微分の記号を付ける。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 既存動画：平均から、その瞬間の速度へどう近づく？

### 4. 速度の変化から加速度へ・初級

既存：`m1-acceleration-intro` — 加速度が負なら、物体は必ず遅くなる？

追加する説明：正の一定加速度を速度の表で定義→速度一定なら差0→負号のある例へ進む。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 既存動画：加速度が負なら、物体は必ず遅くなる？

### 5. 速度の変化から加速度へ・中級

既存：`m1-acceleration-middle` — 加速度の単位に、なぜ秒が二つ入る？

追加する説明：速度の差÷時間の差をグラフ上でも計算し、水平な速度グラフと等速直線運動を結ぶ。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 既存動画：加速度の単位に、なぜ秒が二つ入る？

### 6. 速度の変化から加速度へ・上級

既存：`m1-acceleration-advanced` — 速さが一定でも、加速度は生じる？

追加する説明：一次元の差→平面の矢印の加減→二つの速度の差→短時間で割る順に準備する。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度の矢印を引き算する（`prep-vector-difference`）
3. 既存動画：速さが一定でも、加速度は生じる？

### 7. 等加速度の公式をつなぐ・初級

既存：`m1-uniform-accel-intro` — 最初から動いていた物体の速度は、どう求める？

追加する説明：初め・1秒後・2秒後の速度を表にし、一定a、v₀、経過時間tを対応させる。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 初めの値と、増えた分を分ける（`prep-initial-values`）
5. 既存動画：最初から動いていた物体の速度は、どう求める？

### 8. 等加速度の公式をつなぐ・中級

既存：`m1-uniform-accel-middle` — 位置の式の二分の一は、どこから来る？

追加する説明：一定速度の長方形→区間の和→三角形、最後に初期位置を足す計算を入れる。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
3. 既存動画：位置の式の二分の一は、どこから来る？

### 9. 等加速度の公式をつなぐ・上級

既存：`m1-uniform-accel-advanced` — 時間が分からないとき、速度と位置をどう結ぶ？

追加する説明：等加速度でのみ端の平均が使えること、(a+b)(a−b)の展開、停止の数値例を先に確認する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 初めの値と、増えた分を分ける（`prep-initial-values`）
5. 既存動画：時間が分からないとき、速度と位置をどう結ぶ？

### 10. 落下と投げ上げ・初級

既存：`m-freefall-intro` — 投げ上げた球の最高点では、重力も消える？

追加する説明：手を離した静止球の落下から、重力と一定の下向き加速度を説明し、速度0と加速度0を区別する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 既存動画：投げ上げた球の最高点では、重力も消える？

### 11. 落下と投げ上げ・中級

既存：`m-freefall-middle` — 上向きに投げた球は、何秒後に止まる？

追加する説明：aの式に下向きの数値を代入し、一次方程式を単位付きで解く。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 初めの値と、増えた分を分ける（`prep-initial-values`）
5. 既存動画：上向きに投げた球は、何秒後に止まる？

### 12. 落下と投げ上げ・上級

既存：`m-freefall-advanced` — 落下の式とエネルギーの式は、同じ答えになる？

追加する説明：先にK=mv²/2、ΔU=mgΔyと保存条件を学べる順序へ移すか、ここは運動の計算に留める。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 仕事から運動エネルギーへ（`prep-work-energy`）
7. 位置エネルギーと保存の条件（`prep-potential-conservation`）
8. 既存動画：落下の式とエネルギーの式は、同じ答えになる？

### 13. 放物運動・初級

既存：`m-projectile-intro` — 投げた球は、なぜ横へ進みながら落ちる？

追加する説明：合力0→速度一定を先に確認し、同一時刻の二つの位置を合成する表を示す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 既存動画：投げた球は、なぜ横へ進みながら落ちる？

### 14. 放物運動・中級

既存：`m-projectile-middle` — 斜めの初速度を、なぜ成分へ分ける？

追加する説明：直角三角形の辺の比を具体値で確認→初速度を分解→各成分の運動式へ進む。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 既存動画：斜めの初速度を、なぜ成分へ分ける？

### 15. 放物運動・上級

既存：`m-projectile-advanced` — どの条件なら、四十五度の投射が最も遠くへ飛ぶ？

追加する説明：因数分解で二つの時刻を区別し、2sinθcosθ=sin2θとsinの範囲を説明してから最大飛距離へ進む。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 斜めの矢印を、横と縦に分ける（`prep-trig`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 着地の時刻と、三角関数の計算（`prep-algebra-projectile`）
7. 既存動画：どの条件なら、四十五度の投射が最も遠くへ飛ぶ？

### 16. 力から運動の変化へ・初級

既存：`m-force-intro` — 物体が動いているなら、進む向きの力が必要？

追加する説明：物体への押し引きを矢印で描き、働く相手と力の種類、同一物体上の合計を説明する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 既存動画：物体が動いているなら、進む向きの力が必要？

### 17. 力から運動の変化へ・中級

既存：`m-force-middle` — 逆向きの力が二つあるとき、加速度はどう決まる？

追加する説明：1 Nとkg·m/s²、ma=合力の出発点を説明し、力の図→符号→足し算→aの順で計算する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 既存動画：逆向きの力が二つあるとき、加速度はどう決まる？

### 18. 力から運動の変化へ・上級

既存：`m-force-advanced` — 二つの物体が押し合うとき、反作用は打ち消せる？

追加する説明：一台の力の図を2枚作り、各式を足すことでのみ内力が消えることを確かめる。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. つり合いと作用反作用を分ける（`prep-system`）
6. 既存動画：二つの物体が押し合うとき、反作用は打ち消せる？

### 19. 仕事とエネルギー・初級

既存：`m-energy-intro` — 重い荷物を持って立つだけなら、仕事はゼロ？

追加する説明：一定力で物体を動かす具体例→仕事の単位→移動0の場合を示す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 仕事から運動エネルギーへ（`prep-work-energy`）
7. 既存動画：重い荷物を持って立つだけなら、仕事はゼロ？

### 20. 仕事とエネルギー・中級

既存：`m-energy-middle` — 斜めの力の仕事は、どの成分で計算する？

追加する説明：成分の計算を準備し、一定合力と等加速度の式からK=mv²/2とW合計=ΔKを導く。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 既存動画：斜めの力の仕事は、どの成分で計算する？

### 21. 仕事とエネルギー・上級

既存：`m-energy-advanced` — ばねの仕事を、なぜ力かける距離だけで求められない？

追加する説明：ばねの力の実測比例→ゆっくり伸ばす外力の仕事→蓄えた量→重力の場合と保存条件を用意する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 仕事から運動エネルギーへ（`prep-work-energy`）
7. 位置エネルギーと保存の条件（`prep-potential-conservation`）
8. ばねの変位と、戻す力の負号（`prep-spring`）
9. 既存動画：ばねの仕事を、なぜ力かける距離だけで求められない？

### 22. 運動量と力積・初級

既存：`m-momentum-intro` — 同じ速さなら、重い台車も軽い台車も同じように止まる？

追加する説明：一定質量のma=FからmΔv=FΔtを作り、力積という名とN·sの単位を付ける。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 力を加えた時間から、運動量へ（`prep-impulse`）
6. 既存動画：同じ速さなら、重い台車も軽い台車も同じように止まる？

### 23. 運動量と力積・中級

既存：`m-momentum-middle` — 衝突時間を延ばすと、なぜ平均の力が小さくなる？

追加する説明：一定力×時間→時間ごとの和→平均力の長方形を示し、符号と最大値を分ける。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 力を加えた時間から、運動量へ（`prep-impulse`）
6. 既存動画：衝突時間を延ばすと、なぜ平均の力が小さくなる？

### 24. 運動量と力積・上級

既存：`m-momentum-advanced` — 衝突でエネルギーが減っても、運動量は保存する？

追加する説明：一台ずつΔpを書いて足し、具体的な二台の数値で保存式から共通速度を求める。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 力を加えた時間から、運動量へ（`prep-impulse`）
6. 既存動画：衝突でエネルギーが減っても、運動量は保存する？

### 25. 円運動と万有引力・初級

既存：`m-circular-intro` — 円を回る物体には、外向きの力が必要？

追加する説明：円の1点の進む方向と半径を作図し、力を切った後の直線運動を慣性と結ぶ。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 速度の矢印を引き算する（`prep-vector-difference`）
4. 小さな時間で、平均を取り直す（`prep-difference-limit`）
5. 円運動では、進む向きが変わる（`prep-circular`）
6. 既存動画：円を回る物体には、外向きの力が必要？

### 26. 円運動と万有引力・中級

既存：`m-circular-middle` — 同じ円を速く回ると、必要な力はどれだけ増える？

追加する説明：矢印の差と相似比を具体図で確認し、弦から弧へ近づく条件を示してa=v²/rへ進む。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 速度の矢印を引き算する（`prep-vector-difference`）
4. 小さな時間で、平均を取り直す（`prep-difference-limit`）
5. 円運動では、進む向きが変わる（`prep-circular`）
6. 既存動画：同じ円を速く回ると、必要な力はどれだけ増える？

### 27. 円運動と万有引力・上級

既存：`m-circular-advanced` — 遠い軌道の衛星は、なぜ一周に時間がかかる？

追加する説明：GMm/r²を出発点と明示→中心からのr→T=2πr/v→質量の約分と3乗の計算を行う。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 速度の矢印を引き算する（`prep-vector-difference`）
4. 小さな時間で、平均を取り直す（`prep-difference-limit`）
5. 円運動では、進む向きが変わる（`prep-circular`）
6. 既存動画：遠い軌道の衛星は、なぜ一周に時間がかかる？

### 28. 単振動・初級

既存：`m-shm-intro` — ばねにつないだ物体は、なぜ中央を通り過ぎる？

追加する説明：摩擦なしの水平ばねを条件として、原点、端、1往復、最大のずれを先に示す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. ばねの変位と、戻す力の負号（`prep-spring`）
6. 既存動画：ばねにつないだ物体は、なぜ中央を通り過ぎる？

### 29. 単振動・中級

既存：`m-shm-middle` — 往復の周期は、重さとばねの硬さでどう変わる？

追加する説明：角度と周期の関係を円運動の影で準備し、結果の紹介と導出を分ける。

1. 一周の角度と、回転の速さ（`prep-radian`）
2. 既存動画：往復の周期は、重さとばねの硬さでどう変わる？

### 30. 単振動・上級

既存：`m-shm-advanced` — サインやコサインが、なぜ運動の答えになる？

追加する説明：三角関数→微分の定義と規則→位置・速度・加速度→代入検算の準備動画が必要。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 斜めの矢印を、横と縦に分ける（`prep-trig`）
4. 小さな時間で、平均を取り直す（`prep-difference-limit`）
5. 一周の角度と、回転の速さ（`prep-radian`）
6. 円の影から、振動の式を読む（`prep-sin-wave`）
7. 二段階の変化率を掛ける（`prep-chain`）
8. 三角関数を微分する前の二つの極限（`prep-sin-derivative`）
9. 振動の位置から、速度と加速度を求める（`prep-sin-motion`）
10. 既存動画：サインやコサインが、なぜ運動の答えになる？

### 31. 温度と熱の移動・初級

既存：`t-heat-intro` — 同じ温度の水槽とコップを一度温めるには、同じ熱量が必要？

追加する説明：加熱で物体内部が変わる図、温度計と加えたエネルギーの別測定を示す。

1. 温度と、加えた熱の量を分ける（`prep-heat-units`）
2. 既存動画：同じ温度の水槽とコップを一度温めるには、同じ熱量が必要？

### 32. 温度と熱の移動・中級

既存：`t-heat-middle` — 比熱は、何を一単位あたりにした量？

追加する説明：質量単位をそろえ、1 g・1度あたりから具体量へ掛け算し、ΔTを引き算する。

1. 温度と、加えた熱の量を分ける（`prep-heat-units`）
2. 既存動画：比熱は、何を一単位あたりにした量？

### 33. 温度と熱の移動・上級

既存：`t-heat-advanced` — 熱を加えているのに、氷の温度が変わらないのはなぜ？

追加する説明：融かす部分と温める部分を区切り、熱の出入りがない境界と同じ最終温度を説明して式を作る。

1. 温度と、加えた熱の量を分ける（`prep-heat-units`）
2. 温度が変わらない加熱と、熱の収支（`prep-melting`）
3. 既存動画：熱を加えているのに、氷の温度が変わらないのはなぜ？

### 34. 気体の圧力・体積・温度・初級

既存：`t-gas-intro` — 気体を押し縮めると、なぜ圧力が上がる？

追加する説明：同じ力を違う面積へ加える例→p=F/SとPa→体積を半分にする比較を行う。

1. 圧力は、面積一あたりの力（`prep-pressure`）
2. 既存動画：気体を押し縮めると、なぜ圧力が上がる？

### 35. 気体の圧力・体積・温度・中級

既存：`t-gas-middle` — 温度を二倍にするなら、摂氏二十度を四十度にすればよい？

追加する説明：換算と温度差を区別し、動くピストンで圧力一定の比較を示す。

1. 圧力は、面積一あたりの力（`prep-pressure`）
2. 既存動画：温度を二倍にするなら、摂氏二十度を四十度にすればよい？

### 36. 気体の圧力・体積・温度・上級

既存：`t-gas-advanced` — 圧力も体積も変わるとき、二つの状態をどう結ぶ？

追加する説明：温度一定と圧力一定の二操作をつないで状態の式を作り、仕事は第一法則の準備後に扱う。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 仕事から運動エネルギーへ（`prep-work-energy`）
7. 圧力は、面積一あたりの力（`prep-pressure`）
8. 気体が押す仕事と、内部のエネルギー（`prep-gas-work`）
9. 既存動画：圧力も体積も変わるとき、二つの状態をどう結ぶ？

### 37. 理想気体の状態方程式・初級

既存：`t-ideal-intro` — 同じ温度と体積で、気体を増やすと何が変わる？

追加する説明：1箱に一定個数という例→アボガドロ定数→N=nN_A、必要ならモル質量を示す。

1. 圧力は、面積一あたりの力（`prep-pressure`）
2. 既存動画：同じ温度と体積で、気体を増やすと何が変わる？

### 38. 理想気体の状態方程式・中級

既存：`t-ideal-middle` — 状態方程式の四つの文字は、何を表す？

追加する説明：前の比例関係をまとめ、単位付き数値で未知量を一つ最後まで求める。

1. 圧力は、面積一あたりの力（`prep-pressure`）
2. 粒子の個数を、モルで数える（`prep-mole`）
3. 既存動画：状態方程式の四つの文字は、何を表す？

### 39. 理想気体の状態方程式・上級

既存：`t-ideal-advanced` — 分子の動きと圧力は、式でどうつながる？

追加する説明：一分子→単位時間の力→圧力→全分子の和→1/3→運動エネルギーとの比較に分ける。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 圧力は、面積一あたりの力（`prep-pressure`）
6. 粒子の個数を、モルで数える（`prep-mole`）
7. 力を加えた時間から、運動量へ（`prep-impulse`）
8. 一個の分子の衝突から、圧力へ（`prep-gas-particles`）
9. 既存動画：分子の動きと圧力は、式でどうつながる？

### 40. 熱と仕事の収支・初級

既存：`t-firstlaw-intro` — 熱を加えた分は、全部温度上昇になる？

追加する説明：気体を囲んで内部にある量Uと出入りQ・Wを分け、基準の符号を図で示す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 仕事から運動エネルギーへ（`prep-work-energy`）
7. 圧力は、面積一あたりの力（`prep-pressure`）
8. 気体が押す仕事と、内部のエネルギー（`prep-gas-work`）
9. 既存動画：熱を加えた分は、全部温度上昇になる？

### 41. 熱と仕事の収支・中級

既存：`t-firstlaw-middle` — 気体の仕事が圧力かける体積変化になるのはなぜ？

追加する説明：力÷面積の逆算とSΔxの体積を確認し、扱う圧力とゆっくり動く条件を明示する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 仕事から運動エネルギーへ（`prep-work-energy`）
7. 圧力は、面積一あたりの力（`prep-pressure`）
8. 気体が押す仕事と、内部のエネルギー（`prep-gas-work`）
9. 既存動画：気体の仕事が圧力かける体積変化になるのはなぜ？

### 42. 熱と仕事の収支・上級

既存：`t-firstlaw-advanced` — 熱機関が一周して元の状態へ戻ると、受け取った熱はどうなる？

追加する説明：往復の仕事の符号を足す→Uが戻る意味→受熱・放熱→効率。断熱はQ=0で温度一定ではないと確認する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 仕事から運動エネルギーへ（`prep-work-energy`）
7. 圧力は、面積一あたりの力（`prep-pressure`）
8. 気体が押す仕事と、内部のエネルギー（`prep-gas-work`）
9. 一周する熱機関の、仕事と熱（`prep-heat-cycle`）
10. 既存動画：熱機関が一周して元の状態へ戻ると、受け取った熱はどうなる？

### 43. 振動が伝わる波・初級

既存：`w-basics-intro` — 波が右へ進むと、水やひもも右へ運ばれる？

追加する説明：ひもの同一点を追って0と最大変位を示し、場所の図と時間の記録を分ける。

1. 波は、物体の移動とは違う（`prep-wave`）
2. 既存動画：波が右へ進むと、水やひもも右へ運ばれる？

### 44. 振動が伝わる波・中級

既存：`w-basics-middle` — 波の速さは、なぜ振動数と波長の積になる？

追加する説明：1往復2秒なら1秒0.5回という例を式に対応させ、波の速さと粒の速さを区別する。

1. 波は、物体の移動とは違う（`prep-wave`）
2. 既存動画：波の速さは、なぜ振動数と波長の積になる？

### 45. 振動が伝わる波・上級

既存：`w-basics-advanced` — 波の式に、位置と時刻が両方入るのはなぜ？

追加する説明：一点の正弦振動とω=2πfを準備し、到着時間x/vを計算してから二変数の式を作る。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 一周の角度と、回転の速さ（`prep-radian`）
4. 円の影から、振動の式を読む（`prep-sin-wave`）
5. 波は、物体の移動とは違う（`prep-wave`）
6. 場所へ届くまでの時間を、波の式へ入れる（`prep-traveling-wave`）
7. 既存動画：波の式に、位置と時刻が両方入るのはなぜ？

### 46. 空気の振動と共鳴・初級

既存：`w-sound-intro` — 音の山は、空気が高く盛り上がった場所？

追加する説明：空気粒の平常位置と密度の増減を示し、縦軸が何の差なのかを明示する。

1. 波は、物体の移動とは違う（`prep-wave`）
2. 既存動画：音の山は、空気が高く盛り上がった場所？

### 47. 空気の振動と共鳴・中級

既存：`w-sound-middle` — 同じ長さでも、閉じた管の音が低いのはなぜ？

追加する説明：進行波と反射波を足して止まる点を作り、変位と圧力の節の違いから管の波長を決める。

1. 波は、物体の移動とは違う（`prep-wave`）
2. 二つの波を、同じ場所で足す（`prep-superposition`）
3. 管の端と、音の節・腹（`prep-sound-boundary`）
4. 既存動画：同じ長さでも、閉じた管の音が低いのはなぜ？

### 48. 空気の振動と共鳴・上級

既存：`w-sound-advanced` — 二つの音から、なぜゆっくりしたうなりが生まれる？

追加する説明：同一点の二振動を符号付きで足し、1秒の回数差を数えてうなりの式へ進む。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 一周の角度と、回転の速さ（`prep-radian`）
4. 円の影から、振動の式を読む（`prep-sin-wave`）
5. 波は、物体の移動とは違う（`prep-wave`）
6. 二つの波を、同じ場所で足す（`prep-superposition`）
7. 場所へ届くまでの時間を、波の式へ入れる（`prep-traveling-wave`）
8. 管の端と、音の節・腹（`prep-sound-boundary`）
9. 既存動画：二つの音から、なぜゆっくりしたうなりが生まれる？

### 49. 音源と観測者の運動・初級

既存：`w-doppler-intro` — 近づく救急車の音は、なぜ高く聞こえる？

追加する説明：等間隔に出す印の到着時刻を比較し、空気の粒そのものが届くのではないと区別する。

1. 波は、物体の移動とは違う（`prep-wave`）
2. 波源が動くと、山の間隔が変わる（`prep-doppler`）
3. 既存動画：近づく救急車の音は、なぜ高く聞こえる？

### 50. 音源と観測者の運動・中級

既存：`w-doppler-middle` — 動く音源は、波長をどれだけ縮める？

追加する説明：一周期の二つの距離を数値で引き算し、条件を音声か図に残す。

1. 波は、物体の移動とは違う（`prep-wave`）
2. 波源が動くと、山の間隔が変わる（`prep-doppler`）
3. 既存動画：動く音源は、波長をどれだけ縮める？

### 51. 音源と観測者の運動・上級

既存：`w-doppler-advanced` — 観測者が動く場合も、波長が変わる？

追加する説明：止まった波面の列を横切る数え方→波も動く場合の出会う速さ→受信回数を示す。

1. 波は、物体の移動とは違う（`prep-wave`）
2. 波源が動くと、山の間隔が変わる（`prep-doppler`）
3. 既存動画：観測者が動く場合も、波長が変わる？

### 52. 光の進み方と屈折・初級

既存：`w-light-intro` — 水に入る光は、なぜ向きを変える？

追加する説明：同じ振動状態の点を結んだ面と進む向きを分け、光線図へ置き換える。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 波は、物体の移動とは違う（`prep-wave`）
4. 屈折の角度は、面ではなく法線から（`prep-refraction`）
5. 既存動画：水に入る光は、なぜ向きを変える？

### 53. 光の進み方と屈折・中級

既存：`w-light-middle` — 屈折率が大きい側で、光は法線へ近づく？

追加する説明：二つの距離と共通辺から比を作り、n=c/vを代入してスネルの式へ進む。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 波は、物体の移動とは違う（`prep-wave`）
4. 二つの波を、同じ場所で足す（`prep-superposition`）
5. 屈折の角度は、面ではなく法線から（`prep-refraction`）
6. 光の波面から、屈折と干渉の計算へ（`prep-light-geometry`）
7. 既存動画：屈折率が大きい側で、光は法線へ近づく？

### 54. 光の進み方と屈折・上級

既存：`w-light-advanced` — 全反射が、屈折率の大きい側から進む光だけで起こるのはなぜ？

追加する説明：角度と辺の比の上限を確認し、条件を満たす屈折角がなくなる境界を示す。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 波は、物体の移動とは違う（`prep-wave`）
4. 屈折の角度は、面ではなく法線から（`prep-refraction`）
5. 既存動画：全反射が、屈折率の大きい側から進む光だけで起こるのはなぜ？

### 55. 光の干渉と回折・初級

既存：`w-interference-intro` — 光を二つ重ねたのに、暗くなる場所がある？

追加する説明：まずひもの変位を足す操作と周期のずれを学び、光では足す量が電場であると橋渡しする。

1. 波は、物体の移動とは違う（`prep-wave`）
2. 二つの波を、同じ場所で足す（`prep-superposition`）
3. 既存動画：光を二つ重ねたのに、暗くなる場所がある？

### 56. 光の干渉と回折・中級

既存：`w-interference-middle` — 二重スリットの明るい縞は、どこにできる？

追加する説明：余分な道1波長と半波長→2経路の三角形→遠方・小角の近似→隣のmの差を示す。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 波は、物体の移動とは違う（`prep-wave`）
4. 二つの波を、同じ場所で足す（`prep-superposition`）
5. 屈折の角度は、面ではなく法線から（`prep-refraction`）
6. 光の波面から、屈折と干渉の計算へ（`prep-light-geometry`）
7. 既存動画：二重スリットの明るい縞は、どこにできる？

### 57. 光の干渉と回折・上級

既存：`w-interference-advanced` — スリットが一つでも、なぜ暗い場所ができる？

追加する説明：1本の開口の中も分けて足すことと、対の位相差πを説明し、最初の暗線に限定して計算する。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 波は、物体の移動とは違う（`prep-wave`）
4. 二つの波を、同じ場所で足す（`prep-superposition`）
5. 屈折の角度は、面ではなく法線から（`prep-refraction`）
6. 光の波面から、屈折と干渉の計算へ（`prep-light-geometry`）
7. 既存動画：スリットが一つでも、なぜ暗い場所ができる？

### 58. 電流・電圧・抵抗・初級

既存：`e-current-intro` — 電球を通ると、電流は使われて減る？

追加する説明：電荷量Qと単位C→閉じた回路→Q/時間=電流→電圧1 V=1 J/Cを数値で確認する。

1. 電荷・電流・電圧は、別の量（`prep-charge-current`）
2. 既存動画：電球を通ると、電流は使われて減る？

### 59. 電流・電圧・抵抗・中級

既存：`e-current-middle` — 同じ抵抗に二倍の電圧をかけると、電流はどうなる？

追加する説明：測る場所と量を図で決め、V/Iの比を数値で作って抵抗の定義へ進む。

1. 電荷・電流・電圧は、別の量（`prep-charge-current`）
2. 既存動画：同じ抵抗に二倍の電圧をかけると、電流はどうなる？

### 60. 電流・電圧・抵抗・上級

既存：`e-current-advanced` — 直列と並列で、合成抵抗の式が違うのはなぜ？

追加する説明：回路の分岐と共通端子を確認→電流保存・電位差の和→数値で合成抵抗を算出する。

1. 電荷・電流・電圧は、別の量（`prep-charge-current`）
2. 回路の分かれ道と、電力の単位（`prep-circuit-power`）
3. 電気力の大きさと、向きの計算（`prep-charge-calculation`）
4. 既存動画：直列と並列で、合成抵抗の式が違うのはなぜ？

### 61. 電力とジュール熱・初級

既存：`e-power-intro` — 電圧も電流も、なぜ電力に関係する？

追加する説明：1秒に何C、1Cに何Jという具体例を掛け、電力量とkWhまで単位をつなぐ。

1. 電荷・電流・電圧は、別の量（`prep-charge-current`）
2. 既存動画：電圧も電流も、なぜ電力に関係する？

### 62. 電力とジュール熱・中級

既存：`e-power-middle` — 抵抗が大きいと、発熱は増える？減る？

追加する説明：同じRの式を2つの実験条件で使い、2倍・半分を数値代入する。

1. 電荷・電流・電圧は、別の量（`prep-charge-current`）
2. 回路の分かれ道と、電力の単位（`prep-circuit-power`）
3. 電気力の大きさと、向きの計算（`prep-charge-calculation`）
4. 既存動画：抵抗が大きいと、発熱は増える？減る？

### 63. 電力とジュール熱・上級

既存：`e-power-advanced` — 送電の電圧を高くすると、なぜ電線の損失が減る？

追加する説明：送る側・電線・負荷の図を描き、同じ電力を送る比較でP損失=I²R線を使う。

1. 電荷・電流・電圧は、別の量（`prep-charge-current`）
2. 回路の分かれ道と、電力の単位（`prep-circuit-power`）
3. 電気力の大きさと、向きの計算（`prep-charge-calculation`）
4. 既存動画：送電の電圧を高くすると、なぜ電線の損失が減る？

### 64. 磁場と電磁誘導・初級

既存：`e-magnet-intro` — 磁力線の本数が増えると、本当に磁場が強くなる？

追加する説明：磁石と方位磁針→各場所の向き→電流のまわりの磁場→力と磁力線の表示を順に説明する。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 電荷・電流・電圧は、別の量（`prep-charge-current`）
4. 電場・磁場と、面を通る量（`prep-field-flux`）
5. 既存動画：磁力線の本数が増えると、本当に磁場が強くなる？

### 65. 磁場と電磁誘導・中級

既存：`e-magnet-middle` — 磁石が動かなくても、コイルを回すと電圧が生まれる？

追加する説明：平らな枠の正面の広さ→BA→傾けたBAcosθ→磁束の時間変化と電圧に分ける。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 電荷・電流・電圧は、別の量（`prep-charge-current`）
4. 電場・磁場と、面を通る量（`prep-field-flux`）
5. 既存動画：磁石が動かなくても、コイルを回すと電圧が生まれる？

### 66. 磁場と電磁誘導・上級

既存：`e-magnet-advanced` — 誘導電流は、なぜ磁束の変化を妨げる向きになる？

追加する説明：まずΔΦ/Δtの数値→向きの約束→磁場変化に対する応答、微分は準備後に付ける。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 電荷・電流・電圧は、別の量（`prep-charge-current`）
4. 電場・磁場と、面を通る量（`prep-field-flux`）
5. 既存動画：誘導電流は、なぜ磁束の変化を妨げる向きになる？

### 67. 電荷から電場へ・初級

既存：`e-field-intro` — そこに別の電荷を置く前でも、電場は考えられる？

追加する説明：反発と引力→同じ場所で電荷量を変えた力→F/qで場所固有の値を作る。

1. 電荷・電流・電圧は、別の量（`prep-charge-current`）
2. 既存動画：そこに別の電荷を置く前でも、電場は考えられる？

### 68. 電荷から電場へ・中級

既存：`e-field-middle` — 距離を二倍にすると、電気力はどうなる？

追加する説明：距離2倍の平方を計算し、力の大きさと向きを分け、2本の電場を具体的に合成する。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 電荷・電流・電圧は、別の量（`prep-charge-current`）
4. 電場・磁場と、面を通る量（`prep-field-flux`）
5. 電気力の大きさと、向きの計算（`prep-charge-calculation`）
6. 既存動画：距離を二倍にすると、電気力はどうなる？

### 69. 電荷から電場へ・上級

既存：`e-field-advanced` — 電場がゼロの点でも、電位はゼロとは限らない？

追加する説明：まず電荷を動かす仕事→1 Cあたり→電位差と基準を準備し、電場0と電位0の比較は最後に置く。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 斜めの矢印を、横と縦に分ける（`prep-trig`）
6. 初めの値と、増えた分を分ける（`prep-initial-values`）
7. 仕事から運動エネルギーへ（`prep-work-energy`）
8. 電荷・電流・電圧は、別の量（`prep-charge-current`）
9. 電場・磁場と、面を通る量（`prep-field-flux`）
10. 電気の仕事から、電位差へ（`prep-electric-work`）
11. 既存動画：電場がゼロの点でも、電位はゼロとは限らない？

### 70. 電荷とエネルギーを蓄える・初級

既存：`e-capacitor-intro` — コンデンサは、何をどこへ蓄える？

追加する説明：二枚の板へ逆符号が蓄積する経路、Qと電圧の測定、比Q/VとFの単位を示す。

1. 電荷・電流・電圧は、別の量（`prep-charge-current`）
2. 二枚の板に、電荷とエネルギーを蓄える（`prep-capacitor`）
3. 既存動画：コンデンサは、何をどこへ蓄える？

### 71. 電荷とエネルギーを蓄える・中級

既存：`e-capacitor-middle` — 板を近づけると、なぜ容量が増える？

追加する説明：F=qEと仕事からV=Edを準備し、平行板のEを模型の既知法則として条件付きで説明するか導出を先行させる。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 仕事から運動エネルギーへ（`prep-work-energy`）
7. 電荷・電流・電圧は、別の量（`prep-charge-current`）
8. 二枚の板に、電荷とエネルギーを蓄える（`prep-capacitor`）
9. 電気の仕事から、電位差へ（`prep-electric-work`）
10. 既存動画：板を近づけると、なぜ容量が増える？

### 72. 電荷とエネルギーを蓄える・上級

既存：`e-capacitor-advanced` — 蓄えたエネルギーは、なぜ電荷かける電圧の半分？

追加する説明：少量ずつ電荷を運ぶ仕事を数値で足し、一定容量の直線の三角形へ進む。

1. 電荷・電流・電圧は、別の量（`prep-charge-current`）
2. 二枚の板に、電荷とエネルギーを蓄える（`prep-capacitor`）
3. 既存動画：蓄えたエネルギーは、なぜ電荷かける電圧の半分？

### 73. 光子・光電効果・エネルギー準位・初級

既存：`a-photon-intro` — 明るくしても、電子が出ない光があるのはなぜ？

追加する説明：原子と電子の最小限の構造→光のエネルギーのまとまり→電子を取り出す観測を導入する。

1. 波は、物体の移動とは違う（`prep-wave`）
2. 電荷・電流・電圧は、別の量（`prep-charge-current`）
3. 光の粒と、原子のエネルギー（`prep-photon-atom`）
4. 既存動画：明るくしても、電子が出ない光があるのはなぜ？

### 74. 光子・光電効果・エネルギー準位・中級

既存：`a-photon-middle` — 光子のエネルギーの残りは、どこへ行く？

追加する説明：光子のエネルギー則を出発点として説明し、必要額と残額の計算→qΔVで電子を止める順にする。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 波は、物体の移動とは違う（`prep-wave`）
6. 電荷・電流・電圧は、別の量（`prep-charge-current`）
7. 光の粒と、原子のエネルギー（`prep-photon-atom`）
8. 力を加えた時間から、運動量へ（`prep-impulse`）
9. 電子のエネルギーと、波長の単位（`prep-quantum-units`）
10. 既存動画：光子のエネルギーの残りは、どこへ行く？

### 75. 光子・光電効果・エネルギー準位・上級

既存：`a-photon-advanced` — 原子から出る光が、特定の色に限られるのはなぜ？

追加する説明：空間の高さではない目盛りに二状態を置き、差を計算してνへ換算する例を加える。

1. 波は、物体の移動とは違う（`prep-wave`）
2. 電荷・電流・電圧は、別の量（`prep-charge-current`）
3. 光の粒と、原子のエネルギー（`prep-photon-atom`）
4. 既存動画：原子から出る光が、特定の色に限られるのはなぜ？

### 76. 物質波とボーア模型・初級

既存：`a-bohr-intro` — 電子が一個ずつ来るのに、干渉縞ができる？

追加する説明：一個の検出と多数の分布を区別し、既習の干渉と運動量を復習してλ=h/pの具体値を扱う。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 波は、物体の移動とは違う（`prep-wave`）
6. 電荷・電流・電圧は、別の量（`prep-charge-current`）
7. 光の粒と、原子のエネルギー（`prep-photon-atom`）
8. 力を加えた時間から、運動量へ（`prep-impulse`）
9. 電子のエネルギーと、波長の単位（`prep-quantum-units`）
10. 既存動画：電子が一個ずつ来るのに、干渉縞ができる？

### 77. 物質波とボーア模型・中級

既存：`a-bohr-middle` — ボーア模型では、なぜ許される半径が限られる？

追加する説明：原子模型→円周の波長数→ℏへの表記変更→二式からvを消す計算を段階化する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 波は、物体の移動とは違う（`prep-wave`）
6. 電荷・電流・電圧は、別の量（`prep-charge-current`）
7. 光の粒と、原子のエネルギー（`prep-photon-atom`）
8. 力を加えた時間から、運動量へ（`prep-impulse`）
9. 電子のエネルギーと、波長の単位（`prep-quantum-units`）
10. 既存動画：ボーア模型では、なぜ許される半径が限られる？

### 78. 物質波とボーア模型・上級

既存：`a-bohr-advanced` — ボーア模型のエネルギーは、なぜ負になる？

追加する説明：エネルギーの基準と引力の仕事を準備し、KとUを別々に求めて足し、r_nを代入する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 速度の矢印を引き算する（`prep-vector-difference`）
7. 初めの値と、増えた分を分ける（`prep-initial-values`）
8. 仕事から運動エネルギーへ（`prep-work-energy`）
9. 位置エネルギーと保存の条件（`prep-potential-conservation`）
10. 小さな時間で、平均を取り直す（`prep-difference-limit`）
11. Σは、具体的な足し算の省略（`prep-sum`）
12. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
13. 電荷・電流・電圧は、別の量（`prep-charge-current`）
14. 円運動では、進む向きが変わる（`prep-circular`）
15. 電気の仕事から、電位差へ（`prep-electric-work`）
16. 原子の負のエネルギーは、何が基準？（`prep-bohr-energy`）
17. 無限遠を基準に、引力のエネルギーを求める（`prep-inverse-potential`）
18. 既存動画：ボーア模型のエネルギーは、なぜ負になる？

### 79. 原子核・放射性崩壊・結合エネルギー・初級

既存：`a-nucleus-intro` — 半減期が来ると、原子核は一斉に半分になる？

追加する説明：核の構成と変化、残っている核の数を説明してから、個体の偶然と多数の平均を比較する。

1. 原子核の中身と、崩壊の数え方（`prep-nucleus`）
2. 既存動画：半減期が来ると、原子核は一斉に半分になる？

### 80. 原子核・放射性崩壊・結合エネルギー・中級

既存：`a-nucleus-middle` — 放射能の強さは、何を一秒あたりに数える？

追加する説明：単位時間の崩壊率→A=λNとBq→核の表記と放出粒子の前後の数え上げに分ける。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 二段階の変化率を掛ける（`prep-chain`）
5. 同じ割合の変化から、指数関数へ（`prep-exponential`）
6. 原子核の中身と、崩壊の数え方（`prep-nucleus`）
7. 核反応では、数とエネルギーを確認する（`prep-nuclear-energy`）
8. 既存動画：放射能の強さは、何を一秒あたりに数える？

### 81. 原子核・放射性崩壊・結合エネルギー・上級

既存：`a-nucleus-advanced` — 核の質量の差が、なぜ取り出せるエネルギーになる？

追加する説明：自由な同数の核子との比較、Δmの引き算、E=mc²を相対論の出発点として適用する範囲を示す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 二段階の変化率を掛ける（`prep-chain`）
5. 同じ割合の変化から、指数関数へ（`prep-exponential`）
6. 対数は、何乗かを求める道具（`prep-log`）
7. 原子核の中身と、崩壊の数え方（`prep-nucleus`）
8. 核反応では、数とエネルギーを確認する（`prep-nuclear-energy`）
9. 既存動画：核の質量の差が、なぜ取り出せるエネルギーになる？

### 82. 平均変化率から微分へ・初級

既存：`um-derivative-intro` — 一瞬の速度を、時間ゼロで割らずに求められる？

追加する説明：時刻と位置の表→2点の差→数値の割り算→hによる一般化の順で、対象関数を先に設定する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 既存動画：一瞬の速度を、時間ゼロで割らずに求められる？

### 83. 平均変化率から微分へ・中級

既存：`um-derivative-middle` — 差の比を展開すると、極限を計算できるのはなぜ？

追加する説明：x²の一例を定義に戻し、同じ操作で定数・x・ax+bを計算して規則へ進む。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 定数と一次式を、同じ定義で微分する（`prep-derivative-rules`）
5. 既存動画：差の比を展開すると、極限を計算できるのはなぜ？

### 84. 平均変化率から微分へ・上級

既存：`um-derivative-advanced` — 曲線がつながっていれば、必ず微分できる？

追加する説明：数直線の距離から絶対値を定義し、正負のhで実数を計算して左右の違いを作る。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 斜めの矢印を、横と縦に分ける（`prep-trig`）
4. 小さな時間で、平均を取り直す（`prep-difference-limit`）
5. 一周の角度と、回転の速さ（`prep-radian`）
6. 円の影から、振動の式を読む（`prep-sin-wave`）
7. 二乗の微分から、三乗の微分へ（`prep-power-derivative`）
8. 三角関数を微分する前の二つの極限（`prep-sin-derivative`）
9. 負号と、絶対値の折れ曲がり（`prep-absolute`）
10. 既存動画：曲線がつながっていれば、必ず微分できる？

### 85. 和の極限から積分へ・初級

既存：`um-integral-intro` — 速度のグラフの下を足すと、なぜ位置が分かる？

追加する説明：段階的な速度の記録で移動を合計→曲線の近似→極限→位置へ戻す順を示す。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
3. 既存動画：速度のグラフの下を足すと、なぜ位置が分かる？

### 86. 和の極限から積分へ・中級

既存：`um-integral-middle` — 積分記号は、有限個の足し算とどうつながる？

追加する説明：N=4の全項を実際に書き、Σへ略記し、整数和を両端の組で説明して極限へ進む。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
3. Σは、具体的な足し算の省略（`prep-sum`）
4. 既存動画：積分記号は、有限個の足し算とどうつながる？

### 87. 和の極限から積分へ・上級

既存：`um-integral-advanced` — 面積を求める積分で、なぜ原始関数を引き算する？

追加する説明：累積量の具体例→微分すると元に戻る関数→定数差→数値の上下限評価を用意する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
4. 小さな時間で、平均を取り直す（`prep-difference-limit`）
5. Σは、具体的な足し算の省略（`prep-sum`）
6. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
7. 既存動画：面積を求める積分で、なぜ原始関数を引き算する？

### 88. 微分の規則を理由から読む・初級

既存：`um-rules-intro` — 関数の中に関数があるとき、何が二段階で変わる？

追加する説明：半径が1増えたとき・1秒でいくつ増えるかを数値で掛けてから微分記号を付ける。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 二段階の変化率を掛ける（`prep-chain`）
5. 既存動画：関数の中に関数があるとき、何が二段階で変わる？

### 89. 微分の規則を理由から読む・中級

既存：`um-rules-middle` — 円の面積の時間変化は、どう計算する？

追加する説明：差の比を二つの比へ分けた後で極限を取り、r(t)を明示して代入する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 二段階の変化率を掛ける（`prep-chain`）
5. 既存動画：円の面積の時間変化は、どう計算する？

### 90. 微分の規則を理由から読む・上級

既存：`um-rules-advanced` — 二つの変数が同時に変わるとき、変化をどう足す？

追加する説明：まず一方を固定した変化を2例計算し、有限差の角ΔxΔyを時間で割ってから極限で消す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 二段階の変化率を掛ける（`prep-chain`）
5. 一つだけ変える微分と、両方の変化（`prep-partial`）
6. 既存動画：二つの変数が同時に変わるとき、変化をどう足す？

### 91. 近くの形から近似する・初級

既存：`um-taylor-intro` — 小さい角度で、サインを角度そのものにしてよいのはなぜ？

追加する説明：s/rの数値→単位円の縦成分→sinθとθの値の差を確認する。

1. 一周の角度と、回転の速さ（`prep-radian`）
2. 既存動画：小さい角度で、サインを角度そのものにしてよいのはなぜ？

### 92. 近くの形から近似する・中級

既存：`um-taylor-middle` — 接線を使えば、どんな関数も近くで計算しやすくなる？

追加する説明：基準値＋傾き×入力差を直線から作り、√xの微分を準備して数値へ代入する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 二乗の微分から、三乗の微分へ（`prep-power-derivative`）
5. 接線の近似から、曲がりの補正へ（`prep-taylor`）
6. 既存動画：接線を使えば、どんな関数も近くで計算しやすくなる？

### 93. 近くの形から近似する・上級

既存：`um-taylor-advanced` — テイラー展開の二分の一は、どこから来る？

追加する説明：2回微分を具体式で計算し、係数合わせ→2!→残す項と誤差に分け、力学への応用は前提を案内する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 二乗の微分から、三乗の微分へ（`prep-power-derivative`）
5. 接線の近似から、曲がりの補正へ（`prep-taylor`）
6. 既存動画：テイラー展開の二分の一は、どこから来る？

### 94. ベクトルと成分・初級

既存：`um-vector-intro` — 矢印の二つの数字は、何を表す？

追加する説明：2点の数値座標を引き、移動の足し算を逆にたどって差の矢印を定義する。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度の矢印を引き算する（`prep-vector-difference`）
3. 既存動画：矢印の二つの数字は、何を表す？

### 95. ベクトルと成分・中級

既存：`um-vector-middle` — 三次元の矢印の長さは、どう求める？

追加する説明：2Dの3–4–5の例→3Dのもう一つの直角三角形→成分を同じ数で割る操作を示す。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度の矢印を引き算する（`prep-vector-difference`）
3. ベクトルの長さと、長さ一の矢印（`prep-vector-length`）
4. 既存動画：三次元の矢印の長さは、どう求める？

### 96. ベクトルと成分・上級

既存：`um-vector-advanced` — 位置ベクトルを微分すると、なぜ速度になる？

追加する説明：一変数微分を先に案内し、r(t)=(t,t²)等を具体的に微分してから一般式にする。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 二段階の変化率を掛ける（`prep-chain`）
5. 既存動画：位置ベクトルを微分すると、なぜ速度になる？

### 97. 内積が選び出す成分・初級

既存：`um-dot-intro` — 移動と直角の力は、なぜ仕事をしない？

追加する説明：同方向F×dから斜めの投影を作り、結果が数になるまでを図と数値で確かめる。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 既存動画：移動と直角の力は、なぜ仕事をしない？

### 98. 内積が選び出す成分・中級

既存：`um-dot-middle` — 内積は、成分だけでどう計算する？

追加する説明：xとyの基本矢印の直角を確認して項の0を示し、角度による定義との対応を予告する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 斜めの矢印を、横と縦に分ける（`prep-trig`）
6. 初めの値と、増えた分を分ける（`prep-initial-values`）
7. 仕事から運動エネルギーへ（`prep-work-energy`）
8. 内積は、相手の向きに沿う部分を掛ける（`prep-dot-work`）
9. 既存動画：内積は、成分だけでどう計算する？

### 99. 内積が選び出す成分・上級

既存：`um-dot-advanced` — 角度の式と成分の式は、なぜ一致する？

追加する説明：同じ三角形の3辺を確定し、余弦定理と各成分の二乗を一つずつ計算して比較する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 斜めの矢印を、横と縦に分ける（`prep-trig`）
6. 初めの値と、増えた分を分ける（`prep-initial-values`）
7. 仕事から運動エネルギーへ（`prep-work-energy`）
8. 内積は、相手の向きに沿う部分を掛ける（`prep-dot-work`）
9. 角度で書く内積と、成分で書く内積（`prep-cosine-dot`）
10. 既存動画：角度の式と成分の式は、なぜ一致する？

### 100. 外積の大きさと向き・初級

既存：`um-cross-intro` — ドアは、どの向きへ押すとよく回る？

追加する説明：ドアの垂直距離×力→二矢印の面積→向きの約束を順に導入する。

1. 位置と時間を、数で表す（`prep-position`）
2. 斜めの矢印を、横と縦に分ける（`prep-trig`）
3. 既存動画：ドアは、どの向きへ押すとよく回る？

### 101. 外積の大きさと向き・中級

既存：`um-cross-middle` — 外積の順序を逆にすると、何が変わる？

追加する説明：具体的なx,y,z軸で右手の向きを確認し、負電荷の例は必要な前提がある場所へ移す。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度の矢印を引き算する（`prep-vector-difference`）
3. 斜めの矢印を、横と縦に分ける（`prep-trig`）
4. ベクトルの長さと、長さ一の矢印（`prep-vector-length`）
5. 回す力の効果と、角運動量（`prep-torque`）
6. 既存動画：外積の順序を逆にすると、何が変わる？

### 102. 外積の大きさと向き・上級

既存：`um-cross-advanced` — 外積の成分式の符号は、どう決める？

追加する説明：基本3方向の積の表と1個の数値例を先に行い、各成分の9項を残して一般化する。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度の矢印を引き算する（`prep-vector-difference`）
3. 斜めの矢印を、横と縦に分ける（`prep-trig`）
4. ベクトルの長さと、長さ一の矢印（`prep-vector-length`）
5. 回す力の効果と、角運動量（`prep-torque`）
6. 外積の成分は、基本の三方向から作る（`prep-cross-components`）
7. 既存動画：外積の成分式の符号は、どう決める？

### 103. 変化の規則から時間の関数へ・初級

既存：`um-ode-intro` — 微分方程式で、答えは数字ではなく何になる？

追加する説明：数の未知数の方程式と、時刻ごとの値を求める方程式を同じ簡単な例で対比する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 小さな時間で、平均を取り直す（`prep-difference-limit`）
6. 微分方程式では、関数を求める（`prep-ode-initial`）
7. 既存動画：微分方程式で、答えは数字ではなく何になる？

### 104. 変化の規則から時間の関数へ・中級

既存：`um-ode-middle` — 同じ割合で減ると、なぜ直線にならない？

追加する説明：同じ割合の繰返し→指数→連続時間とe→微分で確かめる順を準備する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 二段階の変化率を掛ける（`prep-chain`）
5. 同じ割合の変化から、指数関数へ（`prep-exponential`）
6. 既存動画：同じ割合で減ると、なぜ直線にならない？

### 105. 変化の規則から時間の関数へ・上級

既存：`um-ode-advanced` — 変数分離で、ゼロの解を失わないためには？

追加する説明：非ゼロの範囲を確認して連鎖律で変形を支え、lnの定義・基本積分・初期値代入を説明する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 二段階の変化率を掛ける（`prep-chain`）
5. 同じ割合の変化から、指数関数へ（`prep-exponential`）
6. 対数は、何乗かを求める道具（`prep-log`）
7. 既存動画：変数分離で、ゼロの解を失わないためには？

### 106. 二階微分方程式と振動・初級

既存：`um-shm-ode-intro` — 位置を二回微分すると、何が分かる？

追加する説明：位置の表→速度の変化率→加速度、F=−kxとa=−(k/m)xを確認する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 斜めの矢印を、横と縦に分ける（`prep-trig`）
6. 一周の角度と、回転の速さ（`prep-radian`）
7. 円の影から、振動の式を読む（`prep-sin-wave`）
8. ばねの変位と、戻す力の負号（`prep-spring`）
9. 既存動画：位置を二回微分すると、何が分かる？

### 107. 二階微分方程式と振動・中級

既存：`um-shm-ode-middle` — サインとコサインの二つが、なぜ必要？

追加する説明：sin・cos各解を検算→和も解になる計算→x(0),v(0)→係数2個の決定を分ける。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 斜めの矢印を、横と縦に分ける（`prep-trig`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. 一周の角度と、回転の速さ（`prep-radian`）
8. 円の影から、振動の式を読む（`prep-sin-wave`）
9. 二段階の変化率を掛ける（`prep-chain`）
10. ばねの変位と、戻す力の負号（`prep-spring`）
11. 三角関数を微分する前の二つの極限（`prep-sin-derivative`）
12. 振動の位置から、速度と加速度を求める（`prep-sin-motion`）
13. 振動の式を、運動方程式へ戻して確かめる（`prep-oscillation-equation`）
14. 振動の係数を、初期条件と連立式で決める（`prep-oscillation-coefficients`）
15. 既存動画：サインとコサインの二つが、なぜ必要？

### 108. 二階微分方程式と振動・上級

既存：`um-shm-ode-advanced` — 安定なつり合いの近くで、なぜ多くの振動が単振動へ近づく？

追加する説明：保存力とUの関係を準備し、一次微分0かつ二階微分正という条件を図と数値で確かめる。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 斜めの矢印を、横と縦に分ける（`prep-trig`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. 一周の角度と、回転の速さ（`prep-radian`）
8. 円の影から、振動の式を読む（`prep-sin-wave`）
9. 二段階の変化率を掛ける（`prep-chain`）
10. ばねの変位と、戻す力の負号（`prep-spring`）
11. 三角関数を微分する前の二つの極限（`prep-sin-derivative`）
12. 振動の位置から、速度と加速度を求める（`prep-sin-motion`）
13. 振動の式を、運動方程式へ戻して確かめる（`prep-oscillation-equation`）
14. 既存動画：安定なつり合いの近くで、なぜ多くの振動が単振動へ近づく？

### 109. 運動方程式から位置まで求める・初級

既存：`uc-newton-intro` — 力が分かれば、物体の位置もすぐ決まる？

追加する説明：実際にF/mでaを求め、Δv=aΔtと次の速度を計算してから位置を更新する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 既存動画：力が分かれば、物体の位置もすぐ決まる？

### 110. 運動方程式から位置まで求める・中級

既存：`uc-newton-middle` — 一定の力から、なぜ積分を二回する？

追加する説明：一定aの面積→v₀を足す→vの面積→x₀を足す計算を、数学の前提と結んで示す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. Σは、具体的な足し算の省略（`prep-sum`）
8. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
9. 定数と一次式を、同じ定義で微分する（`prep-derivative-rules`）
10. 既存動画：一定の力から、なぜ積分を二回する？

### 111. 運動方程式から位置まで求める・上級

既存：`uc-newton-advanced` — 斜めの運動を解いた式は、どう検算する？

追加する説明：横縦の力の図から二式を作り、v(t)とx(t)のt=0をそれぞれ確かめる。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. Σは、具体的な足し算の省略（`prep-sum`）
8. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
9. つり合いと作用反作用を分ける（`prep-system`）
10. 既存動画：斜めの運動を解いた式は、どう検算する？

### 112. 抵抗と終端速度・初級

既存：`uc-drag-intro` — 力がつり合った落下物は、空中で止まる？

追加する説明：mgと抵抗を数値比較し、aが小さくなる過程を速度の表で確認する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 小さな時間で、平均を取り直す（`prep-difference-limit`）
6. 微分方程式では、関数を求める（`prep-ode-initial`）
7. 既存動画：力がつり合った落下物は、空中で止まる？

### 113. 抵抗と終端速度・中級

既存：`uc-drag-middle` — 終端速度との差を使うと、なぜ式が簡単になる？

追加する説明：微分方程式・指数の前提を案内し、uの定義を微分して負号の出所を確認する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 小さな時間で、平均を取り直す（`prep-difference-limit`）
6. 二段階の変化率を掛ける（`prep-chain`）
7. 同じ割合の変化から、指数関数へ（`prep-exponential`）
8. 対数は、何乗かを求める道具（`prep-log`）
9. 微分方程式では、関数を求める（`prep-ode-initial`）
10. 終端速度との差を、指数で求める（`prep-drag-solve`）
11. 既存動画：終端速度との差を使うと、なぜ式が簡単になる？

### 114. 抵抗と終端速度・上級

既存：`uc-drag-advanced` — 抵抗ありの落下速度を、初期条件から導ける？

追加する説明：変数分離を数行で行いu(0)を入れ、m/bの単位と1時定数後の比を確認する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 小さな時間で、平均を取り直す（`prep-difference-limit`）
6. 二段階の変化率を掛ける（`prep-chain`）
7. 同じ割合の変化から、指数関数へ（`prep-exponential`）
8. 対数は、何乗かを求める道具（`prep-log`）
9. 微分方程式では、関数を求める（`prep-ode-initial`）
10. 終端速度との差を、指数で求める（`prep-drag-solve`）
11. 既存動画：抵抗ありの落下速度を、初期条件から導ける？

### 115. 仕事から運動エネルギーを導く・初級

既存：`uc-work-intro` — 仕事が正なら、物体は必ず速くなる？

追加する説明：一定力と距離から仕事を計算し、運動エネルギーを定義・復習してから合計仕事を比べる。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 仕事から運動エネルギーへ（`prep-work-energy`）
7. 既存動画：仕事が正なら、物体は必ず速くなる？

### 116. 仕事から運動エネルギーを導く・中級

既存：`uc-work-middle` — 仕事と運動エネルギーは、どう式でつながる？

追加する説明：有限の変化と微分を区別し、d(v²/2)/dt=v dv/dtから同じ式を支え、積分の変数と上下限を説明する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 斜めの矢印を、横と縦に分ける（`prep-trig`）
7. 初めの値と、増えた分を分ける（`prep-initial-values`）
8. 仕事から運動エネルギーへ（`prep-work-energy`）
9. 小さな時間で、平均を取り直す（`prep-difference-limit`）
10. Σは、具体的な足し算の省略（`prep-sum`）
11. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
12. 内積は、相手の向きに沿う部分を掛ける（`prep-dot-work`）
13. 二段階の変化率を掛ける（`prep-chain`）
14. 仕事の式で、なぜ速度の微分が出る？（`prep-energy-chain`）
15. 既存動画：仕事と運動エネルギーは、どう式でつながる？

### 117. 仕事から運動エネルギーを導く・上級

既存：`uc-work-advanced` — 曲がった道でも、仕事は同じエネルギー差になる？

追加する説明：成分でv·vを書いて微分し、同じ項が2個になる計算を示してから時間積分する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 斜めの矢印を、横と縦に分ける（`prep-trig`）
7. 初めの値と、増えた分を分ける（`prep-initial-values`）
8. 仕事から運動エネルギーへ（`prep-work-energy`）
9. 小さな時間で、平均を取り直す（`prep-difference-limit`）
10. Σは、具体的な足し算の省略（`prep-sum`）
11. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
12. 内積は、相手の向きに沿う部分を掛ける（`prep-dot-work`）
13. 二段階の変化率を掛ける（`prep-chain`）
14. 変わる力と、曲がった道の仕事（`prep-work-path`）
15. 仕事の式で、なぜ速度の微分が出る？（`prep-energy-chain`）
16. 既存動画：曲がった道でも、仕事は同じエネルギー差になる？

### 118. 仕事から位置エネルギーへ・初級

既存：`uc-potential-intro` — 位置エネルギーのゼロは、どこに置いてもよい？

追加する説明：同じ両端で違う道の仕事を比べ、経路に依存しない力に限ってUの差を定義する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 仕事から運動エネルギーへ（`prep-work-energy`）
7. 位置エネルギーと保存の条件（`prep-potential-conservation`）
8. 既存動画：位置エネルギーのゼロは、どこに置いてもよい？

### 119. 仕事から位置エネルギーへ・中級

既存：`uc-potential-middle` — エネルギーのグラフから、力の向きが読める？

追加する説明：短い移動の数値例でJ/m=Nを確認し、軸を位置に固定してから極限を取る。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 小さな時間で、平均を取り直す（`prep-difference-limit`）
4. 二段階の変化率を掛ける（`prep-chain`）
5. 一つだけ変える微分と、両方の変化（`prep-partial`）
6. 既存動画：エネルギーのグラフから、力の向きが読める？

### 120. 仕事から位置エネルギーへ・上級

既存：`uc-potential-advanced` — 万有引力の位置エネルギーを、どう積分する？

追加する説明：r^−2の原始関数を微分で確認→基準決定→全エネルギーとの差の図を別に説明する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 初めの値と、増えた分を分ける（`prep-initial-values`）
7. 仕事から運動エネルギーへ（`prep-work-energy`）
8. 位置エネルギーと保存の条件（`prep-potential-conservation`）
9. 小さな時間で、平均を取り直す（`prep-difference-limit`）
10. Σは、具体的な足し算の省略（`prep-sum`）
11. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
12. 二乗の微分から、三乗の微分へ（`prep-power-derivative`）
13. 接線の近似から、曲がりの補正へ（`prep-taylor`）
14. 無限遠を基準に、引力のエネルギーを求める（`prep-inverse-potential`）
15. 既存動画：万有引力の位置エネルギーを、どう積分する？

### 121. 運動量保存を内部の力から導く・初級

既存：`uc-momentum-intro` — 運動量保存で、何を一組として考える？

追加する説明：各物体の運動量を数値で足し、外力の力積が全体の変化になる式を先に確認する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 力を加えた時間から、運動量へ（`prep-impulse`）
6. 既存動画：運動量保存で、何を一組として考える？

### 122. 運動量保存を内部の力から導く・中級

既存：`uc-momentum-middle` — 短い衝撃と長い力は、どう同じ式で扱える？

追加する説明：一定質量の微分→一定力×時間→変わる力の和→符号付き積分を順に示す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 力を加えた時間から、運動量へ（`prep-impulse`）
6. 既存動画：短い衝撃と長い力は、どう同じ式で扱える？

### 123. 運動量保存を内部の力から導く・上級

既存：`uc-momentum-advanced` — 反発する二台の衝突後の速度は、どう決める？

追加する説明：接近と分離を同じ向きで計算し、保存式と反発式を数値で最後まで解く。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 力を加えた時間から、運動量へ（`prep-impulse`）
6. 衝突後の二つの速度を、二つの式で求める（`prep-collision`）
7. 既存動画：反発する二台の衝突後の速度は、どう決める？

### 124. トルクと角運動量・初級

既存：`uc-angular-intro` — 同じ力でも、押す場所で回転が変わるのはなぜ？

追加する説明：ドアの図に作用線を延ばして最短距離を作り、τ=力×腕を数値で確かめる。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 速度の矢印を引き算する（`prep-vector-difference`）
4. 小さな時間で、平均を取り直す（`prep-difference-limit`）
5. 円運動では、進む向きが変わる（`prep-circular`）
6. 既存動画：同じ力でも、押す場所で回転が変わるのはなぜ？

### 125. トルクと角運動量・中級

既存：`uc-angular-middle` — 角運動量の矢印は、どこを向く？

追加する説明：外積の前提を案内し、r,pの二本から大きさと向きを求める例を行う。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度の矢印を引き算する（`prep-vector-difference`）
3. 斜めの矢印を、横と縦に分ける（`prep-trig`）
4. 一周の角度と、回転の速さ（`prep-radian`）
5. ベクトルの長さと、長さ一の矢印（`prep-vector-length`）
6. 回す力の効果と、角運動量（`prep-torque`）
7. 既存動画：角運動量の矢印は、どこを向く？

### 126. トルクと角運動量・上級

既存：`uc-angular-advanced` — 中心力で、面積速度が一定になるのはなぜ？

追加する説明：積の微分を展開→中心力でトルク0→短時間三角形→単位時間の面積へ進む。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度の矢印を引き算する（`prep-vector-difference`）
3. 斜めの矢印を、横と縦に分ける（`prep-trig`）
4. ベクトルの長さと、長さ一の矢印（`prep-vector-length`）
5. 回す力の効果と、角運動量（`prep-torque`）
6. 外積の成分は、基本の三方向から作る（`prep-cross-components`）
7. 既存動画：中心力で、面積速度が一定になるのはなぜ？

### 127. 振り子と振動の広がり・初級

既存：`uc-shm-intro` — 振り子を戻すのは、糸の張力？重力？

追加する説明：糸と接線の方向を決め、重力の成分を求め、弧の長さと角度を対応させる。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 斜めの矢印を、横と縦に分ける（`prep-trig`）
6. 一周の角度と、回転の速さ（`prep-radian`）
7. ばねの変位と、戻す力の負号（`prep-spring`）
8. 振り子の位置を、弧の長さで測る（`prep-pendulum`）
9. 既存動画：振り子を戻すのは、糸の張力？重力？

### 128. 振り子と振動の広がり・中級

既存：`uc-shm-middle` — 振り子の周期に、おもりの質量が残らないのはなぜ？

追加する説明：弧長→接線速度→接線加速度を順に示し、角振動数と周期の関係を復習する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 斜めの矢印を、横と縦に分ける（`prep-trig`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. 一周の角度と、回転の速さ（`prep-radian`）
8. 円の影から、振動の式を読む（`prep-sin-wave`）
9. 二段階の変化率を掛ける（`prep-chain`）
10. ばねの変位と、戻す力の負号（`prep-spring`）
11. 三角関数を微分する前の二つの極限（`prep-sin-derivative`）
12. 振動の位置から、速度と加速度を求める（`prep-sin-motion`）
13. 振り子の位置を、弧の長さで測る（`prep-pendulum`）
14. 既存動画：振り子の周期に、おもりの質量が残らないのはなぜ？

### 129. 振り子と振動の広がり・上級

既存：`uc-shm-advanced` — 共振の最大振幅は、なぜ無限とは限らない？

追加する説明：自由振動→抵抗あり→周期外力→過渡が消えた運動を先に分け、複雑な式の導出は続編へ接続する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 斜めの矢印を、横と縦に分ける（`prep-trig`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. 一周の角度と、回転の速さ（`prep-radian`）
8. 円の影から、振動の式を読む（`prep-sin-wave`）
9. 二段階の変化率を掛ける（`prep-chain`）
10. ばねの変位と、戻す力の負号（`prep-spring`）
11. 三角関数を微分する前の二つの極限（`prep-sin-derivative`）
12. 振動の位置から、速度と加速度を求める（`prep-sin-motion`）
13. 振動の式を、運動方程式へ戻して確かめる（`prep-oscillation-equation`）
14. 既存動画：共振の最大振幅は、なぜ無限とは限らない？

### 130. 質量分布と慣性モーメント・初級

既存：`uc-rigid1-intro` — 質量が同じ物体でも、回しにくさが違うのはなぜ？

追加する説明：同じ角度を回る内外2点の弧長を比較し、角速度と速さを分ける。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 一周の角度と、回転の速さ（`prep-radian`）
6. 重心は、質量で重みを付けた平均（`prep-center-mass`）
7. 既存動画：質量が同じ物体でも、回しにくさが違うのはなぜ？

### 131. 質量分布と慣性モーメント・中級

既存：`uc-rigid1-middle` — 慣性モーメントで、距離が二乗になるのはなぜ？

追加する説明：2個の質点のKを足す→多数→長さを分けて質量を割り当てる計算を行う。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. Σは、具体的な足し算の省略（`prep-sum`）
8. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
9. 一周の角度と、回転の速さ（`prep-radian`）
10. 重心は、質量で重みを付けた平均（`prep-center-mass`）
11. 回転する物体を、小さな質量に分ける（`prep-rotation-inertia`）
12. 既存動画：慣性モーメントで、距離が二乗になるのはなぜ？

### 132. 質量分布と慣性モーメント・上級

既存：`uc-rigid1-advanced` — 棒の中心を通る軸から、端を通る軸へ変えると？

追加する説明：重心を定義して∫x dm=0を確認し、対称な棒の積分を展開・上下限代入まで行う。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. Σは、具体的な足し算の省略（`prep-sum`）
8. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
9. 一周の角度と、回転の速さ（`prep-radian`）
10. 重心は、質量で重みを付けた平均（`prep-center-mass`）
11. 回転する物体を、小さな質量に分ける（`prep-rotation-inertia`）
12. 既存動画：棒の中心を通る軸から、端を通る軸へ変えると？

### 133. 回転方程式と転がり・初級

既存：`uc-rigid2-intro` — 転がる車輪の接地点は、地面から見ると動いている？

追加する説明：中心の移動と中心から見た回転を別々に動かし、接点での数値の和を示す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. Σは、具体的な足し算の省略（`prep-sum`）
8. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
9. 一周の角度と、回転の速さ（`prep-radian`）
10. 重心は、質量で重みを付けた平均（`prep-center-mass`）
11. 回転する物体を、小さな質量に分ける（`prep-rotation-inertia`）
12. 転がる運動は、移動と回転の和（`prep-rolling`）
13. 既存動画：転がる車輪の接地点は、地面から見ると動いている？

### 134. 回転方程式と転がり・中級

既存：`uc-rigid2-middle` — 回転でも、力と加速度のような式がある？

追加する説明：各質点の角運動量を足してL軸を作り、α=dω/dt、I一定の条件で微分する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 速度の矢印を引き算する（`prep-vector-difference`）
7. 斜めの矢印を、横と縦に分ける（`prep-trig`）
8. 小さな時間で、平均を取り直す（`prep-difference-limit`）
9. Σは、具体的な足し算の省略（`prep-sum`）
10. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
11. 一周の角度と、回転の速さ（`prep-radian`）
12. ベクトルの長さと、長さ一の矢印（`prep-vector-length`）
13. 重心は、質量で重みを付けた平均（`prep-center-mass`）
14. 回転する物体を、小さな質量に分ける（`prep-rotation-inertia`）
15. 回す力の効果と、角運動量（`prep-torque`）
16. 既存動画：回転でも、力と加速度のような式がある？

### 135. 回転方程式と転がり・上級

既存：`uc-rigid2-advanced` — 斜面を転がる輪と円板は、どちらが速くなる？

追加する説明：滑りなしと接地の力を確認し、二種のKを分け、既に求めたIの値を案内して代入する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. Σは、具体的な足し算の省略（`prep-sum`）
8. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
9. 一周の角度と、回転の速さ（`prep-radian`）
10. 重心は、質量で重みを付けた平均（`prep-center-mass`）
11. 回転する物体を、小さな質量に分ける（`prep-rotation-inertia`）
12. 転がる運動は、移動と回転の和（`prep-rolling`）
13. 既存動画：斜面を転がる輪と円板は、どちらが速くなる？

### 136. 観測者を変える・中心力を広げる・初級

既存：`uc-frontier-intro` — 加速する車内で、体が後ろへ押されるように見えるのはなぜ？

追加する説明：止まった観測者と動く観測者の同じ位置記録を比較してから加速する車へ進む。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 速度の矢印を引き算する（`prep-vector-difference`）
4. 小さな時間で、平均を取り直す（`prep-difference-limit`）
5. 観測者を変えると、どの値が変わる？（`prep-reference`）
6. 既存動画：加速する車内で、体が後ろへ押されるように見えるのはなぜ？

### 137. 観測者を変える・中心力を広げる・中級

既存：`uc-frontier-middle` — 加速する座標の見かけの力は、どう導く？

追加する説明：相対位置をx相対と書き、位置→速度→加速度を3行で作って移項する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 速度の矢印を引き算する（`prep-vector-difference`）
4. 小さな時間で、平均を取り直す（`prep-difference-limit`）
5. 観測者を変えると、どの値が変わる？（`prep-reference`）
6. 既存動画：加速する座標の見かけの力は、どう導く？

### 138. 観測者を変える・中心力を広げる・上級

既存：`uc-frontier-advanced` — 万有引力を受ける物体の軌道の形は、どう求める？

追加する説明：直交座標から半径と角度へ移り、楕円の形と焦点、未知量と条件を説明してから見通しの式を示す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 速度の矢印を引き算する（`prep-vector-difference`）
4. 斜めの矢印を、横と縦に分ける（`prep-trig`）
5. 小さな時間で、平均を取り直す（`prep-difference-limit`）
6. 一周の角度と、回転の速さ（`prep-radian`）
7. ベクトルの長さと、長さ一の矢印（`prep-vector-length`）
8. 二段階の変化率を掛ける（`prep-chain`）
9. 回す力の効果と、角運動量（`prep-torque`）
10. 中心からの距離と角度で、位置を書く（`prep-polar`）
11. 既存動画：万有引力を受ける物体の軌道の形は、どう求める？

### 139. 曲線の下を長方形で囲む・初級

既存：`ui-curve-tiles-bridges-1` — 曲線の面積は、四角いタイルで測ってよい？

追加する説明：4分割で上下両方の数値を出し、差が小さくなる過程を示してΣは次へ送る。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
3. 既存動画：曲線の面積は、四角いタイルで測ってよい？

### 140. 面の向きと通り抜ける量・初級

既存：`ui-through-a-surface-bridges-2` — 同じ面積でも、傾けると通り抜ける量が変わる？

追加する説明：単位面積・単位時間あたりの流れを決め、正面と平行の2例から傾いた面へ進む。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 斜めの矢印を、横と縦に分ける（`prep-trig`）
7. 初めの値と、増えた分を分ける（`prep-initial-values`）
8. 仕事から運動エネルギーへ（`prep-work-energy`）
9. Σは、具体的な足し算の省略（`prep-sum`）
10. 内積は、相手の向きに沿う部分を掛ける（`prep-dot-work`）
11. 変わる力と、曲がった道の仕事（`prep-work-path`）
12. 既存動画：同じ面積でも、傾けると通り抜ける量が変わる？

### 141. 曲がった道と移動ベクトル・中級

既存：`um-path-pieces-bridges-3` — 曲がった移動を、なぜ直線の矢印で表せる？

追加する説明：2点を数値座標で引き、区間を分ける前後を比較し、内積の前提単元を案内する。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度の矢印を引き算する（`prep-vector-difference`）
3. ベクトルの長さと、長さ一の矢印（`prep-vector-length`）
4. 既存動画：曲がった移動を、なぜ直線の矢印で表せる？

### 142. 面積に向きを持たせる・中級

既存：`um-area-vector-bridges-4` — 面積なのに、なぜ矢印で表す？

追加する説明：長さ1の垂直矢印に面積を掛ける操作を数値で行い、二つの向きと外向きの約束を区別する。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度の矢印を引き算する（`prep-vector-difference`）
3. ベクトルの長さと、長さ一の矢印（`prep-vector-length`）
4. 既存動画：面積なのに、なぜ矢印で表す？

### 143. 位置の記録を読む・初級

既存：`ui-motion-record-bridges-5` — 写真の点の間隔から、速さの変化は分かる？

追加する説明：原点と時計を示して表を作り、引き返す例で距離と変位を分ける。

1. 位置と時間を、数で表す（`prep-position`）
2. 既存動画：写真の点の間隔から、速さの変化は分かる？

### 144. 一つの物体の力を描く・初級

既存：`ui-force-map-bridges-6` — 運動方程式の前に、どの力を描けばよい？

追加する説明：相手ごとに力を見つける手順と大きさ・向きの意味を教え、水平の足し算から始める。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 既存動画：運動方程式の前に、どの力を描けばよい？

### 145. 変わる力の仕事を足す・初級

既存：`ui-work-changing-bridges-7` — 力が変わる区間で、どの力を距離へ掛ける？

追加する説明：二つの一定力の区間を具体的に計算して足し、グラフの高さと幅を対応させる。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 斜めの矢印を、横と縦に分ける（`prep-trig`）
7. 初めの値と、増えた分を分ける（`prep-initial-values`）
8. 仕事から運動エネルギーへ（`prep-work-energy`）
9. Σは、具体的な足し算の省略（`prep-sum`）
10. 内積は、相手の向きに沿う部分を掛ける（`prep-dot-work`）
11. 変わる力と、曲がった道の仕事（`prep-work-path`）
12. 既存動画：力が変わる区間で、どの力を距離へ掛ける？

### 146. 仕事と速さの変化・初級

既存：`ui-energy-change-bridges-8` — 同じ仕事をしても、速さの増え方は同じ？

追加する説明：同じ質量の数値表でKを定義し、既習のW=ΔKから平方根で速さを戻す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 初めの値と、増えた分を分ける（`prep-initial-values`）
6. 仕事から運動エネルギーへ（`prep-work-energy`）
7. 既存動画：同じ仕事をしても、速さの増え方は同じ？

### 147. 速度の向きだけを変える・初級

既存：`ui-turning-motion-bridges-9` — 速さが変わらない物体にも、力が必要？

追加する説明：速度の矢印の差と一定力の投影を先に示し、微分記号は準備後に置く。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 斜めの矢印を、横と縦に分ける（`prep-trig`）
6. 初めの値と、増えた分を分ける（`prep-initial-values`）
7. 仕事から運動エネルギーへ（`prep-work-energy`）
8. 内積は、相手の向きに沿う部分を掛ける（`prep-dot-work`）
9. 既存動画：速さが変わらない物体にも、力が必要？

### 148. ベクトルの運動方程式を成分へ分ける・中級

既存：`um-newton-components-bridges-10` — 一本のベクトルの式から、どう横と縦の式を作る？

追加する説明：一つの斜めの力の横縦を計算し、他の力を加えた各軸の式を数値で作る。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 斜めの矢印を、横と縦に分ける（`prep-trig`）
7. 初めの値と、増えた分を分ける（`prep-initial-values`）
8. 仕事から運動エネルギーへ（`prep-work-energy`）
9. Σは、具体的な足し算の省略（`prep-sum`）
10. 内積は、相手の向きに沿う部分を掛ける（`prep-dot-work`）
11. 変わる力と、曲がった道の仕事（`prep-work-path`）
12. 既存動画：一本のベクトルの式から、どう横と縦の式を作る？

### 149. 仕事の和を定積分にする・中級

既存：`um-work-sum-bridges-11` — 力が位置に比例するとき、和から仕事を求められる？

追加する説明：N=4で全4項を計算→略記Σ→和の公式の準備→極限という順に分ける。

1. 位置と時間を、数で表す（`prep-position`）
2. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
3. Σは、具体的な足し算の省略（`prep-sum`）
4. 既存動画：力が位置に比例するとき、和から仕事を求められる？

### 150. 内積で仕事の和を作る・中級

既存：`um-work-vector-bridges-12` — 曲がった道では、何と何の内積を足す？

追加する説明：2～3辺の力と移動を具体値で組にして内積を足し、式の各記号へ対応させる。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 斜めの矢印を、横と縦に分ける（`prep-trig`）
7. 初めの値と、増えた分を分ける（`prep-initial-values`）
8. 仕事から運動エネルギーへ（`prep-work-energy`）
9. Σは、具体的な足し算の省略（`prep-sum`）
10. 内積は、相手の向きに沿う部分を掛ける（`prep-dot-work`）
11. 既存動画：曲がった道では、何と何の内積を足す？

### 151. 共振の振幅式を係数比較で導く・上級

既存：`uc-shm-advanced-followups-1` — 共振の分母の二つの項は、どこから来る？

追加する説明：和の微分→sin/cos別の列→連立式→位相をまとめる三角関数の合成を先に用意する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 斜めの矢印を、横と縦に分ける（`prep-trig`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. 一周の角度と、回転の速さ（`prep-radian`）
8. 円の影から、振動の式を読む（`prep-sin-wave`）
9. 二段階の変化率を掛ける（`prep-chain`）
10. ばねの変位と、戻す力の負号（`prep-spring`）
11. 三角関数を微分する前の二つの極限（`prep-sin-derivative`）
12. 振動の位置から、速度と加速度を求める（`prep-sin-motion`）
13. 振動の式を、運動方程式へ戻して確かめる（`prep-oscillation-equation`）
14. 振動の係数を、初期条件と連立式で決める（`prep-oscillation-coefficients`）
15. 既存動画：共振の分母の二つの項は、どこから来る？

### 152. 逆数を使って軌道の方程式を作る・上級

既存：`uc-frontier-advanced-followups-2` — 距離の逆数へ変えると、どの項が消える？

追加する説明：回る単位ベクトルを微分して半径方向加速度r̈−rφ̇²を先に導き、その後u=1/rへ変換する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 速度の矢印を引き算する（`prep-vector-difference`）
4. 斜めの矢印を、横と縦に分ける（`prep-trig`）
5. 小さな時間で、平均を取り直す（`prep-difference-limit`）
6. 一周の角度と、回転の速さ（`prep-radian`）
7. ベクトルの長さと、長さ一の矢印（`prep-vector-length`）
8. 二段階の変化率を掛ける（`prep-chain`）
9. 回す力の効果と、角運動量（`prep-torque`）
10. 中心からの距離と角度で、位置を書く（`prep-polar`）
11. 既存動画：距離の逆数へ変えると、どの項が消える？

### 153. 軌道の方程式を解いて楕円へ進む・上級

既存：`uc-frontier-advanced-followups-3` — 単振動の解から、どう楕円の形が出る？

追加する説明：前の解の一般形と角度原点の変更を説明し、r+ex=p等から焦点を持つ円錐曲線へ結び付ける。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 力・質量・合力を区別する（`prep-force`）
5. 速度の矢印を引き算する（`prep-vector-difference`）
6. 斜めの矢印を、横と縦に分ける（`prep-trig`）
7. 小さな時間で、平均を取り直す（`prep-difference-limit`）
8. 一周の角度と、回転の速さ（`prep-radian`）
9. 円の影から、振動の式を読む（`prep-sin-wave`）
10. ベクトルの長さと、長さ一の矢印（`prep-vector-length`）
11. 二段階の変化率を掛ける（`prep-chain`）
12. ばねの変位と、戻す力の負号（`prep-spring`）
13. 回す力の効果と、角運動量（`prep-torque`）
14. 三角関数を微分する前の二つの極限（`prep-sin-derivative`）
15. 振動の位置から、速度と加速度を求める（`prep-sin-motion`）
16. 振動の式を、運動方程式へ戻して確かめる（`prep-oscillation-equation`）
17. 中心からの距離と角度で、位置を書く（`prep-polar`）
18. 軌道の式が楕円を表す条件（`prep-ellipse`）
19. 既存動画：単振動の解から、どう楕円の形が出る？

### 154. サインの微分とラジアン・上級

既存：`um-derivative-advanced-followups-4` — サインを微分するとコサインになるのはなぜ？

追加する説明：加法定理とラジアンを先に準備し、二つの基本極限を別々に確かめて差の比へ戻す。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 斜めの矢印を、横と縦に分ける（`prep-trig`）
4. 小さな時間で、平均を取り直す（`prep-difference-limit`）
5. 一周の角度と、回転の速さ（`prep-radian`）
6. 円の影から、振動の式を読む（`prep-sin-wave`）
7. 三角関数を微分する前の二つの極限（`prep-sin-derivative`）
8. 既存動画：サインを微分するとコサインになるのはなぜ？

### 155. 円板と球の慣性モーメント・上級

既存：`uc-rigid1-advanced-followups-5` — 球の慣性モーメントを、円板の積み重ねで計算できる？

追加する説明：1D→2D→3Dの質量換算を示し、円板を完成後に球を積み、展開・積分・全質量への置換を分ける。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. Σは、具体的な足し算の省略（`prep-sum`）
8. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
9. 一周の角度と、回転の速さ（`prep-radian`）
10. 重心は、質量で重みを付けた平均（`prep-center-mass`）
11. 回転する物体を、小さな質量に分ける（`prep-rotation-inertia`）
12. 長さ・面積・体積を、小さな質量へ変える（`prep-mass-integration`）
13. 既存動画：球の慣性モーメントを、円板の積み重ねで計算できる？

### 156. 体を縮める回転とエネルギー・上級

既存：`uc-rigid2-advanced-followups-6` — 角運動量が一定なのに、回転エネルギーは増える？

追加する説明：外部トルク0と内部エネルギー移動を区別し、同じ回転模型の適用範囲でL一定の数値例を計算する。

1. 位置と時間を、数で表す（`prep-position`）
2. グラフの傾きは、何を割った値？（`prep-graph-slope`）
3. 加速度は、速度が変わる割合（`prep-acceleration`）
4. 速度のグラフの面積が移動になる理由（`prep-area-distance`）
5. 力・質量・合力を区別する（`prep-force`）
6. 小さな時間で、平均を取り直す（`prep-difference-limit`）
7. Σは、具体的な足し算の省略（`prep-sum`）
8. 積分は、微分で確かめながら計算する（`prep-integral-compute`）
9. 一周の角度と、回転の速さ（`prep-radian`）
10. 重心は、質量で重みを付けた平均（`prep-center-mass`）
11. 回転する物体を、小さな質量に分ける（`prep-rotation-inertia`）
12. 転がる運動は、移動と回転の和（`prep-rolling`）
13. 既存動画：角運動量が一定なのに、回転エネルギーは増える？
