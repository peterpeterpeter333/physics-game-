import { levelOrientations } from './university-levels';
import { universityCurriculum } from './university-curriculum';
export type LessonOrientation = { theme: string; goal: string };
const r = String.raw;
const focus = (theme: string, goal: string): LessonOrientation => ({ theme, goal });

/** Stage-wide destination, deliberately stable while the current slide changes.
 * Laws, definitions, approximations and consequences are not interchangeable. */
const advancedOrientations: Record<string, LessonOrientation> = {
  'm1-velocity': focus('位置の変化を、時間と向きで表す', r`平均速度 $\bar v=\Delta x/\Delta t$ の意味を理解し、速度一定の式 $x=x_0+vt$ を作る。`),
  'm1-acceleration': focus('速度がどれだけ変わるかを測る', r`平均加速度 $a=\Delta v/\Delta t$ の意味と、加速度の正負が表す向きを理解する。`),
  'm1-uniform-accel': focus('加速度が一定の運動を予測する', r`初期位置を0として、$v=v_0+at$、$x=v_0t+\frac12at^2$、$v^2-v_0^2=2ax$ を定義とグラフから導く。`),
  'm-freefall': focus('重力による落下と投げ上げ', r`空気抵抗を無視し、下向きを正にした自由落下の $v=gt$、$y=\frac12gt^2$ と、投げ上げの最高点を求める。`),
  'm-projectile': focus('ボールの斜めの運動を、横と縦に分ける', r`空気抵抗なしで軌道を求め、発射点と着地点が同じ高さなら射程 $L=v_0^2\sin(2\theta)/g$ になることを導く。`),
  'm-force': focus('力が運動を変える仕組み', r`運動方程式 $m\vec a=\sum\vec F$ を基本法則として読み、力を合計して加速度を求める。`),
  'm-energy': focus('仕事からエネルギーを作る', r`仕事から $K=\frac12mv^2$、$U=mgh$ を導き、保存力だけが仕事をするとき $K+U$ が一定になる理由を確かめる。`),
  'm-momentum': focus('物体の勢いと衝突前後のつながり', r`運動方程式から力積 $F\Delta t=\Delta p$ を導き、外力の力積が0なら全運動量が保存することを確かめる。`),
  'm-circular': focus('向きを変え続ける運動と重力', r`円運動の加速度 $a=v^2/r$ を導き、万有引力の法則を使って円軌道の速さと周期を求める。`),
  'm-shm': focus('元の位置へ戻す力が作る振動', r`ばねの周期 $T=2\pi\sqrt{m/k}$ と、小さく振れる振り子の $T=2\pi\sqrt{l/g}$ がどこから出るかを理解する。`),
  't-heat': focus('温度と、移動する熱の量を区別する', r`比熱一定での $Q=mc\Delta T$ の意味を理解し、熱の収支から混合後の温度を求める。`),
  't-gas': focus('気体の圧力・体積・温度の関係', r`分子数一定の理想気体で、ボイル・シャルルの法則を組み合わせて $PV/T=\text{一定}$ を導く。`),
  't-ideal': focus('分子の数と運動を、気体全体の量へつなぐ', r`状態方程式 $PV=nRT$ の意味を理解し、分子の運動から単原子理想気体の内部エネルギー $U=\frac32nRT$ を導く。`),
  't-firstlaw': focus('熱と仕事を、エネルギー保存で結ぶ', r`気体にした仕事を正とする $\Delta U=Q+W$ を使い、熱機関の効率 $\eta=1-Q_c/Q_h$ を導く。`),
  'w-basics': focus('振動が周囲へ伝わる仕組み', r`周期・振動数・波長を区別し、1周期に1波長進むことから波の速さ $v=f\lambda$ を導く。`),
  'w-sound': focus('空気の振動が音の高さや響きになる', r`2つの音から生じるうなり $f_{\text{うなり}}=|f_1-f_2|$ と、定常波・共鳴の条件を理解する。`),
  'w-doppler': focus('音源や聞き手が動くと、音の高さが変わる', r`静止した聞き手へ音源が近づくとき、波長の縮みから $f'=fV/(V-v_s)$ を導く（空気静止、$v_s<V$）。`),
  'w-light': focus('光の速さの違いが、進む向きを変える', r`屈折率 $n=c/v$ と波面から屈折の関係 $n_1\sin\theta_1=n_2\sin\theta_2$ を読み解き、全反射の条件を求める。`),
  'w-interference': focus('波の足し算が、明暗の模様を作る', r`経路差から強め合い・弱め合いを判定し、ヤングの実験の縞間隔 $\Delta y=\lambda L/d$ を導く。`),
  'e-current': focus('電荷の流れと、それを動かす電圧', r`$I=Q/t$ と $V=RI$ の意味を理解し、直列・並列回路の合成抵抗を電流と電圧の関係から導く。`),
  'e-power': focus('電気が1秒あたりに渡すエネルギー', r`電圧・電流の定義から $P=VI$ を導き、抵抗では $P=RI^2=V^2/R$、一定電力では $W=Pt$ と表せることを確かめる。`),
  'e-magnet': focus('電流・磁場・発電のつながり', r`磁束 $\Phi=BA\cos\theta$ と誘導の法則 $\mathcal E=-N\,d\Phi/dt$ を読み、モーターと発電機の働きを説明する。`),
  'e-field': focus('電荷の力を、空間の電場として表す', r`クーロンの法則と $\vec F=q\vec E$ から点電荷の電場を求め、一様電場では電位差の大きさが $Ed$ になることを導く。`),
  'e-capacitor': focus('電荷を蓄える仕組みとエネルギー', r`容量の定義 $Q=CV$ を読み、平行板の容量 $C=\varepsilon_0A/d$ と充電の仕事 $U=\frac12CV^2$ を導く。`),
  'a-photon': focus('光を粒として扱うと、光電効果が分かる', r`光子の関係 $E=h\nu$ を出発点に、エネルギー保存から $K_{\max}=h\nu-W_0$ と限界振動数を導く。`),
  'a-bohr': focus('電子の波が、原子の許される状態を決める', r`物質波 $\lambda=h/(mv)$ とボーア模型を使い、水素原子の半径 $r_n\propto n^2$、準位 $E_n\propto-1/n^2$ を導く。`),
  'a-nucleus': focus('原子核の崩壊と、核反応のエネルギー', r`一定の崩壊確率から半減期の式 $N=N_0(1/2)^{t/T}$ を導き、質量差と $\Delta E=\Delta m\,c^2$ の関係を理解する。`),
  'um-derivative': focus('平均の変化率から、瞬間の変化率へ', r`極限から $v=dx/dt$ を定義し、グラフの接線の傾き・速度・加速度が同じ微分の考え方で読めることを確かめる。`),
  'um-integral': focus('小さく刻んだ量を足して、全体を求める', r`積分の足し算と微分の関係を確かめ、$\int_a^b f(x)\,dx=F(b)-F(a)$ で位置の変化などを計算する。`),
  'um-rules': focus('合成・積・複数変数の変化を計算する', r`連鎖律 $dy/dt=(dy/du)(du/dt)$ と積の微分 $(fg)'=f'g+fg'$ を導き、偏微分との使い分けを理解する。`),
  'um-taylor': focus('難しい関数を、近くで扱いやすい式にする', r`値と傾きを合わせて $f(x)\approx f(a)+f'(a)(x-a)$ を作り、小角近似・高次の近似の誤差と適用範囲を確かめる。`),
  'um-vector': focus('向きのある量を、座標の成分で読む', r`矢印の計算と成分計算を対応させ、大きさ $|\vec A|=\sqrt{A_x^2+A_y^2+A_z^2}$ と成分ごとの微分を理解する。`),
  'um-dot': focus('相手の向きに沿った成分を取り出す内積', r`$\vec A\cdot\vec B=AB\cos\theta$ と成分表示のつながりを導き、仕事 $W=\vec F\cdot\vec s$ に使う理由を確かめる。`),
  'um-cross': focus('面積と回転軸を一緒に表す外積', r`$|\vec A\times\vec B|=AB\sin\theta$ の意味と右手で決まる向きを理解し、順序を逆にすると符号が反転することを確かめる。`),
  'um-ode': focus('量の変わり方から、時間の関数を求める', r`$dv/dt=-kv$ を解いて $v=v_0e^{-kt}$ を導き、初期条件が解を1つに決める理由を理解する。`),
  'um-shm-ode': focus('ばねの方程式から、振動の関数を作る', r`$d^2x/dt^2=-\omega^2x$ の解と初期条件を確かめ、周期 $T=2\pi/\omega$、エネルギー保存を導く。`),
  'uc-newton': focus('力と初期状態から、物体の位置を予測する', r`$m\,d^2\vec r/dt^2=\vec F$ を成分ごとに積分し、力一定の場合の速度・位置の公式を初期条件付きで導く。`),
  'uc-drag': focus('抵抗を受ける落下が、一定の速さへ近づく', r`速度比例の抵抗で $m\,dv/dt=mg-kv$ を解き、静止からの $v(t)=(mg/k)(1-e^{-kt/m})$ と終端速度を導く。`),
  'uc-work': focus('変わる力・曲がる道でも、仕事を計算する', r`仕事 $W=\int\vec F\cdot d\vec r$ と運動方程式から $\Delta K=W$、仕事率 $P=\vec F\cdot\vec v$ を導く。`),
  'uc-potential': focus('位置エネルギーの地形から、力を読み取る', r`保存力の仕事から $F=-dU/dx$ を導き、ポテンシャルの傾き・安定性・力学的エネルギー保存をつなぐ。`),
  'uc-momentum': focus('外力の力積と、衝突で変わる運動量', r`$\Delta\vec p=\int\vec F\,dt$ と全運動量の保存条件を導き、反発係数と合わせて衝突後の速度を求める。`),
  'uc-angular': focus('回転の効き目と、保存される回転の勢い', r`$\vec L=\vec r\times\vec p$ を微分して $d\vec L/dt=\vec N$ を導き、中心力で角運動量・面積速度が保存することを確かめる。`),
  'uc-shm': focus('振り子から、減衰と共振へ', r`小角近似で振り子の周期 $T=2\pi\sqrt{l/g}$ を導き、抵抗や周期的外力が振動の振幅に与える影響を理解する。`),
  'uc-rigid1': focus('物体の質量の分布が、回しにくさを決める', r`質点の足し算から重心と $I=\sum m_ir_i^2$ を求め、平行軸の定理 $I=I_G+Md^2$ を導く。`),
  'uc-rigid2': focus('大きさのある物体の、並進と回転', r`固定軸の式 $I\,d\omega/dt=N$ を導き、転がる物体のエネルギーと、外部トルク0での角運動量保存を使う。`),
  'uc-frontier': focus('動く観測者からの見え方と、重力の軌道', r`座標変換から慣性力を導き、万有引力で円軌道の周期 $T^2=4\pi^2r^3/(GM)$ と楕円軌道の関係を求める。`),
  'ue-integrals': focus('電磁気の積分は、何をどこで足しているか', r`電位差 $V_B-V_A=-\int_A^B\vec E\cdot d\vec r$ と磁束 $\Phi=\int\vec B\cdot d\vec A$ を読み解き、閉じた道と閉じた面を区別する。`),
  'ue-gauss': focus('閉じた面を貫く電場と、中の電荷', r`ガウスの法則 $\oint\vec E\cdot d\vec A=Q_{\text{内}}/\varepsilon_0$ を使い、対称性から球・直線・平面の電場を導く。`),
  'ue-potential': focus('電位差と電場を、仕事と傾きでつなぐ', r`静電場で $\vec E=-\nabla V$ を導き、無限遠を基準にした点電荷の電位 $V=Q/(4\pi\varepsilon_0r)$ を求める。`),
  'ue-capacitor': focus('平行板の電場から、容量とエネルギーへ', r`真空の平行板で端の影響を無視し、$C=\varepsilon_0S/d$ とエネルギー密度 $u=\frac12\varepsilon_0E^2$ を導く。`),
  'ue-current': focus('電子の動きを、電流と抵抗へつなぐ', r`電子を数えて $I=enSv$ を導き、散乱のモデルから $\vec j=\sigma\vec E$ と $R=\rho l/S$ を求める。`),
  'ue-lorentz': focus('磁場が電荷の進む向きを曲げる', r`磁気力 $\vec F=q\vec v\times\vec B$ を使い、一様磁場での半径 $r=mv_\perp/(|q|B)$、周期、らせんのピッチを導く。`),
  'ue-ampere': focus('電流の周りにできる磁場を求める', r`定常電流の法則と対称性を使い、無限直線の $B=\mu_0I/(2\pi r)$ と長いソレノイドの $B=\mu_0nI$ を導く。`),
  'ue-faraday': focus('磁束の時間変化が、起電力を生む', r`誘導の法則 $\mathcal E=-d\Psi/dt$（$\Psi$ は鎖交磁束）から発電機の電圧と、線形コイルの $U=\frac12LI^2$ を導く。`),
  'ue-transient': focus('スイッチを切り替えた後の回路の時間変化', r`初めに電荷0のRC充電で $q=CV_0(1-e^{-t/(RC)})$ を導き、RC・RLの時定数とLC振動を求める。`),
  'ue-maxwell': focus('交流の応答から、電磁波と光速へ', r`コイル・コンデンサの交流応答を求め、真空のマクスウェル方程式から波動方程式と $c=1/\sqrt{\mu_0\varepsilon_0}$ を導く。`),
};

/** 初級・中級は各章のファイルで theme と goal を書く。ここでまとめて取り込む。 */
export const lessonOrientations: Record<string, LessonOrientation> = { ...advancedOrientations, ...levelOrientations };
for(const topic of universityCurriculum)lessonOrientations[topic.id]={...lessonOrientations[topic.id],goal:topic.advanced};
