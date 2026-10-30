import {buildLearningFlow} from './em-learning-flow';
const r=String.raw;
export type SpiralCard={title:string;text:string;tex?:string;figure?:string;scene?:string;lab?:'constant'|'linear';beat?:number;guideIndex?:number;pathPart?:number};
export type SpiralCycle={id:string;title:string;uses:string;gain:string;goal?:string;references:string[];cards:SpiralCard[]};
const c=(title:string,text:string,tex?:string,figure?:string,scene?:string):SpiralCard=>({title,text,tex,figure,scene});
const lessonSources:Record<string,SpiralCycle[]>={
 'ue-integrals':[
 {id:'work',title:'掛け算から積分へ',uses:'出発点：同じ向きの一定力の仕事 W=FL',gain:'一定の値の積分は長方形の面積になる',references:['r-work','r-sum'],cards:[
 {...c('一定の力なら、仕事は長方形になる','2Nの力で同じ向きに3m動かすと、仕事は6J。横軸を移動距離、縦軸を力にすれば、縦×横がそのまま仕事になります。まず、この知っている掛け算を図に対応させます。',r`W=FL=2\times3=6\,\mathrm J`),lab:'constant'},
 {...c('道を細かく切ったら、合計は変わる？','3mの道を分け、各区間で「2N×その区間の長さ」を計算します。分割数を動かして予想を確かめましょう。区切りが増えたぶん、仕事まで増えてしまうでしょうか？',r`W_N=\sum_{i=1}^{N}2\frac3N`),lab:'constant'},
 {...c('同じ長方形を切り分けただけだった','区切りが何個でも合計は6J。小区間の和の極限を積分と呼び、下のように書きます。∫は合計、0と3は集計する範囲、dxは小区間の幅。新しい記号が、元の掛け算につながりました。',r`\int_0^3 2\,dx=[2x]_0^3=6`),lab:'constant'},
 ]},
 {id:'linear',title:'変わる力を積分する',uses:'前の段：仕事は小区間の面積の合計',gain:'一次関数の積分を図と計算で一致させる',references:['r-sum','r-power'],cards:[
 {...c('次は、進むほど強くなる力','力をF(x)=kxとします。グラフは斜めの直線で、仕事はその下の面積です。各区間では左端の力を使って長方形で近似します。分割を細かくすると、隙間はどうなるでしょう。',r`W_N=\sum_{i=0}^{N-1}k\frac{iL}{N}\frac LN`),lab:'linear'},
 {...c('最後の力×全距離では、なぜ大きすぎる？','最後の力kLを道全体に使うと、高さkLの長方形になります。でも途中の力は、それより弱いはず。斜めの線より上の部分は、実際にはしていない仕事まで数えています。',r`W_{\rm 長方形}=kL^2`),lab:'linear'},
 {...c('三角形の面積と積分の答えが一致する','正しい面積は長方形の半分、kL²/2です。計算でも、kx²/2を微分するとkxなので、原始関数の両端の差が同じ答えになります。原始関数で足し算ができる理由は、途中の端点の値が相殺するためです。',r`\int_0^L kx\,dx=\left[\frac{kx^2}{2}\right]_0^L=\frac{kL^2}{2}`),lab:'linear'},
 ]},
 {id:'projection',title:'仕事を電場の言葉にする',uses:'前の段：場所ごとに力を調べて仕事を足す',gain:'電場・力・移動を区別し、内積を使う',references:['r-field','r-dot'],cards:[
 c('電場は、各点にある力の情報','電場Eは単位電荷あたりの電気力です。電荷qに働く力はqE。電子ではqが負なので力は電場と逆向きです。力が決まっても、進む向きは初速度や外力にもよるため別に考えます。',r`\vec F=q\vec E`, 'field-map'),
 c('斜めの力でも、そのまま距離を掛けてよい？','仕事に効くのは、移動方向の成分だけです。図の角度を変えると、力を保ったまま効く成分が小さくなります。直角まで回したとき、力は残っているのに仕事はどうなるでしょう？',undefined,'dot-product'),
 c('向きの問題を、内積が解決する','直角なら仕事は0です。力の移動方向成分Fcosθに距離dsを掛ける操作が内積。電気力を代入すれば、一歩の仕事はqE·drです。掛け算の仕事を捨てず、斜めにも使える形に広げられました。',r`dW=q\vec E\cdot d\vec r=qE\cos\theta\,ds`,'dot-product'),
 ]},
 {id:'path',title:'曲がる道を計算する',uses:'前の段：一歩の仕事は qE·dr',gain:'線積分を一変数の積分に直す',references:['r-path','r-sum'],cards:[
 c('曲がるたびに、その場の内積を取り直す','元の図で、金色は道の向きに効く成分です。移動方向が曲がっても、その場所で内積を取り直せば一歩の仕事が分かります。それを道に沿って足した極限が、ベクトル場の線積分です。',r`W=\int_Cq\vec E\cdot d\vec r`,'line-integral'),
 c('道の式と「小さな移動」は、どう読む？','まず横1m・縦1mの道で、uを動かして位置を確かめます。次に近い二点の移動を比べ、最後にL・Hを使う式へ。「位置を決める」から順に図を切り替えてください。',undefined,undefined,'r-path'),
 c('一様な横向き電場なら、曲線でも計算できた','図と計算は同じ一様電場E=(E₀,0)と放物線r=(Lu,Hu²)です。縦の移動は仕事に寄与せず、結果はqE₀L。緑の棒は終点の仕事に対する割合uを示します。曲線の線積分が、最初の一定値の積分へ戻りました。',r`W=\int_0^1q(E_0,0)\cdot(L,2Hu)\,du=qE_0L`,'line-integral'),
 ]},
 {id:'variable-path',title:'場も道も変わる場合へ',uses:'前の段：E(r(u))とr′(u)の内積を積分する',gain:'二次元の場で電子の仕事を最後まで計算する',references:['r-calculate','r-power','r-path'],cards:[
 c('今度は、電場そのものも場所で変える','E=(αx,αy)に、同じ放物線の座標を代入します。今回は電子q=−eを外力で道に沿って運びます。図はその指定経路であり、電子を放したときの自由運動ではありません。',r`\vec E(\vec r(u))=(\alpha Lu,\alpha Hu^2)`,undefined,'r-calculate'),
 c('二つの成分は、どう一つの積分になる？','内積は横同士・縦同士の積の和です。場と移動の接線を掛けると、uとu³の二項になります。u³はu⁴/4の微分なので積分できます。前の一次関数の積分と、同じ原始関数の考え方です。',r`dW=-e\alpha(L^2u+2H^2u^3)\,du`,undefined,'r-calculate'),
 c('途中の仕事も、終点の仕事も求まった','0から今の位置uまで積分すると下の式です。L=H=1m、α=1V/m²なら終点で−1eV。図の電子を動かすと累積仕事も変わります。幾何学の道、電気力、積分のグラフが一つの計算につながりました。',r`W(u)=-e\alpha\left(\frac{L^2u^2}{2}+\frac{H^2u^4}{2}\right)`,undefined,'r-calculate'),
 ]},
 {id:'potential',title:'仕事から電位差へ',uses:'前の段：道に沿う仕事を計算できる',gain:'経路によらない仕事を電位差で表す',references:['r-compare','r-voltage'],cards:[
 c('同じ終点へ、別の道でも運んでみる','先ほどの場で、放物線の代わりに直線r=(Lu,Hu)を使います。接線も変えて積分すると、終点の仕事は同じになります。図では途中の累積値は違いますが、最後に一致することを確かめられます。',r`W_{\rm 直線}=-\frac{e\alpha}{2}(L^2+H^2)=W_{\rm 放物線}`,undefined,'r-compare'),
 c('いつでも遠回りの影響が消えるの？','一般の場では消えません。この静電場では、仕事が始点・終点だけで決まる保存性があります。そこで位置ごとのエネルギーを使えます。電気力が正の仕事をすれば、その分だけ位置エネルギーは減ります。',r`U_B-U_A=-W_{A\to B}`,undefined,'r-voltage'),
 c('マイナスの意味が分かると、電位差が読める','位置エネルギーを電荷で割ったものが電位です。したがって電位差は電場の線積分のマイナス。一周して元の点へ戻れば静電場では0になります。これは閉じた道の性質で、次に扱う閉じた面の集計とは別です。',r`V_B-V_A=-\int_A^B\vec E\cdot d\vec r`,'loop-integral'),
 ]},
 {id:'surface',title:'道の集計から面の集計へ',uses:'前の段：小片で計算し、全体を足す',gain:'面積ベクトルと電気束を定義する',references:['r-flux','r-area','r-patches'],cards:[
 c('面でも、小さく分けて集められる','高校の磁束はBAcosθでした。元の図は磁場Bの面をタイルに分けて集計しています。同じ仕組みを電場Eに使った量を電気束と呼びます。道に沿う仕事ではなく、面を貫く成分の集計を新しく作ります。',undefined,'surface-tiles'),
 c('なぜ面に「向き」を付ける必要があるの？','同じ面積でも、場に正面を向けるか横を向けるかで貫く成分が変わります。面の垂直方向を単位ベクトルnで表し、面積dAと組にします。図で傾きを変え、面積だけでは足りない情報を確かめましょう。',r`d\vec A=\vec n\,dA`,'area-vector'),
 c('仕事で使った内積が、面でも役立った','今回は移動方向ではなく、面の法線方向の成分を取り出します。小片の寄与E·n dAを全面で足すのが電気束。高校の磁束も同じ構造です。場が一様で面が平らなときだけ、積分がEAcosθという掛け算に戻ります。',r`\Phi_E=\int_S\vec E\cdot\vec n\,dA`, 'flux-tilt'),
 ]},
 {id:'double',title:'面積分を二重積分へ',uses:'前の段：小片の垂直成分×面積を足す',gain:'場所で違う電場の面積分を計算する',references:['r-surfacecalc','r-area'],cards:[
 c('まず、正方形を貫く成分を調べる','z=0の正方形0≤x,y≤Lを上向き法線で見ます。場がE=β(z,0,x)なら、この面の垂直成分はβx。右へ行くほど強い場なので、全体を一つのE×面積にはできません。',r`\vec E\cdot\vec n=\beta x`,undefined,'r-surfacecalc'),
 c('面全体を足すのに、なぜ積分が二回必要？','一度x方向に足すと、薄い横一帯の集計になります。その帯をy方向にも並べて足す必要があるため二重積分です。最初の積分は、すでに計算した一次関数の積分に戻ります。',r`\int_0^L\beta x\,dx=\frac{\beta L^2}{2}`,undefined,'r-surfacecalc'),
 c('新しい積分は、知っている二つの積分だった','一帯の集計βL²/2はyによらないので、次の積分は一定値×長さL。結果はβL³/2です。一次関数の積分と一定値の積分を組み合わせるだけで、面全体の電気束が求まりました。',r`\Phi_E=\int_0^L\frac{\beta L^2}{2}\,dy=\frac{\beta L^3}{2}`,undefined,'r-surfacecalc'),
 ]},
 {id:'sphere-area',title:'球の表面を区切り、面積を求める',uses:'前の段：面を細かく分けて足した → 今度は球の表面で考える',gain:'球の微小な面積dAと、全面積4πR²を導く',references:['r-spherearea','r-area'],cards:[
 c('球では、縦横の代わりに二つの角度を使う','北極からの角度θと、軸の周りの角度φで球面の場所を指定します。縦の小幅はR dθ。横方向は緯線に沿います。長方形で使った「縦×横」を、球のごく小さな小片に使ってみましょう。',undefined,undefined,'r-spherearea'),
 c('横幅もR dφでよいのでは？','極の近くの緯線は、赤道より小さな輪です。輪の半径はR sinθなので、横幅はR sinθ dφ。図の輪を北から南へ動かすと、同じ経度差でも横幅が違う理由が見えます。',r`dA=(R\,d\theta)(R\sin\theta\,d\varphi)`,undefined,'r-spherearea'),
 c('小片を足すと、知っている球面積が出る','θを0〜π、φを0〜2πで足します。sinθの原始関数は−cosθなので最初の積分は2、周方向は2π。面積は4πR²になりました。次章では、この同じ小片に電場の垂直成分を掛けます。',r`A=R^2\int_0^{2\pi}d\varphi\int_0^\pi\sin\theta\,d\theta=4\pi R^2`,undefined,'r-spherearea'),
 ]},
 ],
 'ue-gauss':[
 {id:'sphere-flux',title:'球面積とクーロンの法則を結ぶ',uses:'前章：ΦEは垂直成分×小面積の合計',gain:'逆二乗と球面積が打ち消し合う',references:['g-contract','point'],cards:[
 c('新しい出発点：点電荷の電場','真空中の静止した点電荷Q>0は、外向きにkQ/r²の電場を作ります。これはクーロンの法則という物理の出発点です。前章の球面積と組み合わせ、電荷中心の球を通る電気束を計算します。',r`E(r)=\frac{kQ}{r^2},\qquad k=\frac1{4\pi\varepsilon_0}`,'gauss-sphere'),
 c('球を広げると、束は減る？増える？','半径を2倍にすると電場は1/4。でも球面積は4倍です。電場は球面の法線と同じ向きなので、全面の束は電場×球面積。片方だけでなく、両方が変わることを使って予想してください。',r`E(2r)=E(r)/4,\qquad A(2r)=4A(r)`,'gauss-sphere'),
 c('電場は弱まるのに、束の合計は変わらない','前章で導いた4πr²と掛けると、r²が約分されます。結果はQ/ε₀。ここで示せたのは電荷中心の球だけです。「形や中心が違っても同じか」という新しい疑問が、次の積分の目的になります。',r`\Phi_E=\frac{kQ}{r^2}\,4\pi r^2=\frac Q{\varepsilon_0}`,'gauss-sphere'),
 ]},
 {id:'offset',title:'同じ面を取り替えず計算する',uses:'前の段：中心球では束がQ/ε₀だった',gain:'偏心球の電場と法線を座標で組み立てる',references:['g-offset','g-offsetintegrand'],cards:[
 c('電荷を原点、球の中心を距離dだけ離す','半径Rの球の中心をC=(0,0,d)に固定します。まず0<d<Rで、電荷は球の中です。電荷から小片への距離rは場所で変わります。前章の球の座標に中心のずれを足して、小片の位置を書きます。',r`\vec r=(R\sin\theta\cos\varphi,R\sin\theta\sin\varphi,d+R\cos\theta)`,undefined,'g-offset'),
 c('球を描いたら、電場も球の中心から向く？','電場は電荷から向き、法線は球の中心から向きます。面を描いても電場は変わりません。同じ点で二つの矢印を比べると、向きが違います。だから今回はE×面積でなく、小片ごとの内積が必要です。',r`r^2=R^2+d^2+2Rd\cos\theta`,undefined,'g-offsetintegrand'),
 c('前章の内積が、ずれを含む式を作った','電場kQ r/r³と単位法線nの内積を取ります。成分を掛けて足すとr·n=R+dcosθ。これで各小片の垂直成分が求まりました。強さも角度も変わる状況を、座標と内積で一つの式にまとめられます。',r`\vec E\cdot\vec n=\frac{kQ(R+d\cos\theta)}{(R^2+d^2+2Rd\cos\theta)^{3/2}}`,undefined,'g-offsetintegrand'),
 ]},
 {id:'substitute',title:'球面積分を計算可能な形へ',uses:'前の段：小片の垂直成分が求まった',gain:'置換積分で距離の式をべき関数にする',references:['g-substitution','g-antiderivative','g-offsetintegrand'],cards:[
 c('球の小面積を掛けて、全面を足す','前章のdA=R²sinθ dθ dφを掛けます。式はφによらないので、周方向の積分は2πを掛けるだけ。二重積分がθ一つの積分になりました。ここでも、先に簡単な方向を集計しています。',r`\Phi_E=2\pi kQR^2\int_0^\pi\frac{(R+d\cos\theta)\sin\theta}{(R^2+d^2+2Rd\cos\theta)^{3/2}}\,d\theta`,undefined,'g-substitution'),
 c('長い距離の式を、毎回扱わないといけない？','分母の距離の二乗をuと置くと、その微分にsinθ dθが現れます。分子のcosθと積分範囲も同時に書き換えます。これは面の交換ではなく、同じ小片に付ける目盛りの交換です。',r`u=R^2+d^2+2Rd\cos\theta,\qquad du=-2Rd\sin\theta\,d\theta`,undefined,'g-substitution'),
 c('複雑な三角関数が、二つのべき関数になった','書き換えるとuの−1/2乗と−3/2乗を積分する形になります。平方根とその逆数を微分すれば原始関数を確かめられます。次は、得た原始関数に両端を代入して、物理的な結論を読みます。',r`\Phi_E=\frac{\pi kQ}{2d}\int_{(R-d)^2}^{(R+d)^2}\left(u^{-1/2}+(R^2-d^2)u^{-3/2}\right)du`,undefined,'g-antiderivative'),
 ]},
 {id:'evaluate',title:'積分から位置によらない性質へ',uses:'前の段：偏心球の積分をべき関数へ直した',gain:'内部ではQ/ε₀、外部では0を区別する',references:['g-antiderivative','g-endpoints','g-outsideproof'],cards:[
 c('原始関数の両端を引けば、積分が終わる','原始関数を下のGでまとめます。前章の一次関数と同じく、終点の値−始点の値を求めます。ここで平方根の符号を決めるために、電荷が球の内部か外部かという条件が効いてきます。',r`G(u)=\sqrt u-\frac{R^2-d^2}{\sqrt u},\quad\Phi_E=\frac{\pi kQ}{d}[G(u)]_{(R-d)^2}^{(R+d)^2}`,undefined,'g-endpoints'),
 c('ずれを含むのに、本当に同じ答えになる？','内部ではR−d>0。上端の値は2d、下端は−2dとなり、差の4dと係数の1/dが打ち消します。dが消えてQ/ε₀が残りました。面を取り替えなくても、中心球と同じ束になると計算で分かります。',r`\Phi_E=\frac{\pi kQ}{d}\{2d-(-2d)\}=4\pi kQ=\frac Q{\varepsilon_0}`,undefined,'g-endpoints'),
 c('外部に移ると、同じ計算が0を返す','d>Rでは√((R−d)²)=d−R。今度は両端の値が同じ2dになり、正味の束は0です。外の電荷も電場は作りますが、入る寄与と出る寄与が全面で相殺します。「電場0」と「合計0」は違います。',r`d>R:\qquad\Phi_E=\frac{\pi kQ}{d}(2d-2d)=0`,undefined,'g-outsideproof'),
 ]},
 {id:'angle',title:'球の結果を任意の面へ広げる',uses:'前の段：内部・外部で束が違うと計算できた',gain:'投影と相似から立体角を作る',references:['g-solidangle'],cards:[
 c('面の小片を、電荷から正面に見る','球以外の形を扱うため、小片を電荷からの方向に垂直な面へ投影します。前章と同じ内積により、見かけの面積はcosθ倍。ここでθは電荷からの方向と小片の法線の角度です。',r`dA_\perp=\cos\theta\,dA`,undefined,'g-solidangle'),
 c('同じ面積でも、遠いと小さく見えるのは？','同じ方向の広がりのまま距離をr倍にすると、縦横がr倍で面積はr²倍です。逆に単位距離へ写せば1/r²倍。この単位球上の符号付き面積を立体角dΩと定義します。',r`d\Omega=\frac{\cos\theta}{r^2}\,dA`,undefined,'g-solidangle'),
 c('距離の効果と電場の弱まりが、同じ因子だった','クーロンの電場を掛けると、小片の束はkQ dΩになります。逆二乗と投影の因子が、立体角の定義にそのまま入っていました。任意の面の集計を、電荷から見た方向の集計へ置き換えられます。',r`d\Phi_E=\frac{kQ}{r^2}\cos\theta\,dA=kQ\,d\Omega`,undefined,'g-solidangle'),
 ]},
 {id:'closed',title:'出入りを数えて法則を完成させる',uses:'前の段：小片の束はkQ dΩ',gain:'符号付き立体角と重ね合わせで一般形へ',references:['g-raycount','g-superposition','g-contract'],cards:[
 c('内部から全方向を見ると、単位球一個分','内部から閉曲面を見て、外へ出る交差を＋、入る交差を−とします。凸な面なら各方向に出口が一つ。単位球の面積は前章の公式で4πなので、全方向の立体角の合計は4πです。',r`\Phi_E=kQ\int d\Omega=4\pi kQ`,undefined,'g-raycount'),
 c('凹んだ面では、何度も数えてしまわない？','凹みに入り直すと−、そこから出ると＋で相殺します。内部からなら正味の出口が一つ残り、外部からなら出入りが対になって0です。自己交差しない閉曲面で、電荷が面上にないことを前提にしています。',r`\oint_Sd\Omega=\begin{cases}4\pi&\text{内部}\\0&\text{外部}\end{cases}`,undefined,'g-raycount'),
 c('複数の電荷を足すと、ガウスの法則になった','物理のもう一つの出発点は電場の重ね合わせです。内積と積分も項ごとに足せるので、内部電荷のQj/ε₀だけが残ります。球の計算、投影、出入りの符号がつながり、任意の閉曲面の法則を導けました。',r`\oint_S\vec E\cdot\vec n\,dA=\frac{\sum_{j\in\mathrm{内}}Q_j}{\varepsilon_0}`,undefined,'g-superposition'),
 ]},
 {id:'apply',title:'証明した法則で未知の電場を求める',uses:'前の段：閉曲面の束が内部電荷で決まる',gain:'対称性と法則の役割を区別する',references:['g-application','point','wire','sheet'],cards:[
 c('対称性があれば、合計から一地点の値を求められる','点電荷だけの場では、同じ距離なら同じ強さで放射状です。この情報を使って球面の積分をE×面積にすると、未知のEを解けます。ここで面を選ぶのは証明の代わりではなく、法則の応用です。',r`E(4\pi r^2)=Q/\varepsilon_0`,undefined,'point'),
 c('線電荷でも、球面積で割ればよい？','一様な無限直線は球対称ではありません。場は線から真横へ向くので、線を囲む円筒を選びます。側面は場に垂直、ふたは平行。同じ法則でも、電荷の配置に合う対称性を調べ直す必要があります。',r`E(2\pi rL)=\lambda L/\varepsilon_0`,undefined,'wire'),
 c('球では1/r²、線では1/rの理由が見えた','円筒では囲む長さLが約分され、1/rが残ります。球の1/r²との違いは、束が広がる面積の増え方にありました。無限平面の両面を数える応用も同じ発想です。詳しい計算は補足に置いています。',r`E_{\rm 線}=\frac{\lambda}{2\pi\varepsilon_0r}`,undefined,'wire'),
 ]},
 {id:'zero',title:'合計から言えることの限界を知る',uses:'前の段：電場を求めるには対称性の情報も使った',gain:'電気束0と電場0を取り違えない',references:['g-outsideproof','shell','conductor'],cards:[
 c('内部電荷0なら、分かるのは正味の束0','外部電荷だけでも、面上に電場はあります。ただし入る束と出る束を全面で足すと0です。法則の右辺が0というだけで、左辺の各点の電場を0にしてはいけません。',r`Q_{\rm 内}=0\ \Rightarrow\ \oint_S\vec E\cdot\vec n\,dA=0`,undefined,'g-outsideproof'),
 c('では、一様な球殻の内部はなぜ電場0？','球殻だけで外部電場がなければ、球対称性により同じ半径で同じ半径方向成分Erです。だから0という合計をEr×4πr²と書けます。対称性という追加情報が、各点の電場を決めています。',r`E_r(4\pi r^2)=0\ \Rightarrow\ E_r=0`,undefined,'shell'),
 c('同じ電場0でも、根拠を区別できるようになった','静電平衡の導体材料内部では、自由電荷の再配置が場を打ち消します。こちらは球対称性ではなく平衡が理由です。法則・対称性・平衡のどの情報を使ったかを区別すると、式を使える条件まで説明できます。',r`\vec E_{\rm 外}+\vec E_{\rm 再配置}=\vec0`,undefined,'conductor'),
 ]},
 ],
};
export const spiralLessons=buildLearningFlow(lessonSources);
