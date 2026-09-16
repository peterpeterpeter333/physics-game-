/** Reviewed destinations for every university topic. Indices refer to the immutable,
 * enriched source lesson, never to the already filtered advanced lesson. */
export type Placement = { id:string; slides:number[]; goal:string };
export type UniversityTopic = { id:string; family:'umath'|'umech'|'uem'; intro:Placement; middle:Placement; advanced:string };
const p=(id:string,slides:number[],goal:string):Placement=>({id,slides,goal});
export const universityCurriculum:UniversityTopic[]=[
 {id:'um-derivative',family:'umath',intro:p('ui-average-to-now',[0,1],'位置の記録から平均速度を求め、区間を短くする意味を図で読む。'),middle:p('um-average-rate',[2,3,4,5,7],'差商を展開して極限をとり、微分係数を数値と式で求める。'),advanced:'べき関数・三角関数の微分を導き、微分できない点も判別する。'},
 {id:'um-integral',family:'umath',intro:p('ui-area-is-distance',[0,1],'速度と時間の積を足し、変位と道のりを区別して求める。'),middle:p('um-sum-to-integral',[2,3,4,5,7,8],'有限和の極限を定積分と結び、積分定数と上下限を区別する。'),advanced:'微積分の基本定理から定積分を計算し、初期条件付きの位置を求める。'},
 {id:'um-rules',family:'umath',intro:p('ui-function-rules',[0,3,7],'二段の関数と積の変化を具体例で読み、何を微分するかを決める。'),middle:p('um-function-rules',[1,4,5,8,9],'連鎖律・積の微分・偏微分を使い、内側の変化と固定する変数を明示する。'),advanced:'差の比の極限から微分法則を証明し、複数変数が同時に変わる場合へ進む。'},
 {id:'um-taylor',family:'umath',intro:p('ui-approximation',[0,1,2],'ラジアンと小角近似の意味を確かめ、近似と等式を区別する。'),middle:p('um-approximation',[3,4,5,8],'接線と二次式で関数を近似し、捨てる項から使える範囲を見積もる。'),advanced:'テイラー係数を導き、安定点近傍の力をばねの形へ一般化する。'},
 {id:'um-vector',family:'umath',intro:p('ui-vector-map',[0,1,2,4,5,6],'矢印を成分で表し、向き・長さ・足し算を座標と結び付ける。'),middle:p('um-vector-components',[3,7,8],'三次元の長さと単位ベクトルを計算し、ベクトルの式を成分へ分ける。'),advanced:'位置ベクトルを時間微分し、三次元の速度と加速度を計算する。'},
 {id:'um-dot',family:'umath',intro:p('ui-effective-component',[0,1,2,3],'移動に平行な力だけが仕事をすることを角度と具体例で読む。'),middle:p('um-inner-product',[6,7,8],'内積を成分で計算し、長さ・直交・仕事の符号を判定する。'),advanced:'内積の成分式を展開して導き、変化する場の仕事と束へ応用する。'},
 {id:'um-cross',family:'umath',intro:p('ui-cross-product',[0,1,2,3],'回転の効き方を面積で測り、半径方向と直角方向の違いを読む。'),middle:p('um-cross-product',[4,5,6,8],'右手系で外積の向きを決め、順序と電荷の符号を区別する。'),advanced:'外積の成分式を導き、トルクと負電荷に働く力を計算する。'},
 {id:'um-ode',family:'umath',intro:p('ui-rate-equation',[0,1,6,10],'変化率の規則と出発点を区別し、答えが時間の関数になると理解する。'),middle:p('um-simple-derivative-equation',[7],'減衰を短い時間刻みで追い、指数関数の解と初期値を対応させる。'),advanced:'変数分離を根拠から実行し、零解・積分定数・半減期まで確かめる。'},
 {id:'um-shm-ode',family:'umath',intro:p('ui-oscillation-equation',[0,1,2,6,7],'復元力の向きと周期を読み、位置を二回微分する意味をつかむ。'),middle:p('um-oscillation-equation',[3,4,5],'sinとcosを二回微分して方程式へ代入し、振動の解を確かめる。'),advanced:'安定点での線形化とエネルギー保存から、単振動が成り立つ範囲を論じる。'},
 {id:'uc-newton',family:'umech',intro:p('ui-newton-small-step',[0,1,2,3],'物体と正方向を指定し、合力から加速度と短時間後の速度を出す。'),middle:p('um-constant-force-derive',[4,5,6,7,8,9,10,11,12,13],'成分ごとの運動方程式を二回積分し、初期位置と初速度を入れる。'),advanced:'放物運動を成分で解き、解の検算と力が変わる場合のモデル選択を行う。'},
 {id:'uc-drag',family:'umech',intro:p('ui-drag',[0,1,4,5,6],'重力と抵抗を描き、力のつり合いが静止を意味しないと確かめる。'),middle:p('um-drag',[2,3,7,11],'速度比例抵抗の運動方程式を立て、終端速度との差と時定数を求める。'),advanced:'抵抗下の速度を初期条件付きで積分し、二乗抵抗モデルとの差を調べる。'},
 {id:'uc-work',family:'umech',intro:p('ui-work-constant',[0,1,4],'力・移動・仕事を区別し、正負と単位を具体例で確かめる。'),middle:p('um-work-energy',[2,3],'内積の仕事と運動方程式を結び、仕事が運動エネルギーを変えると示す。'),advanced:'曲線を時間で表し、ベクトルの微分から仕事・エネルギー・仕事率を導く。'},
 {id:'uc-potential',family:'umech',intro:p('ui-potential',[0,1,2,3],'高さで蓄えるエネルギーと基準の選び方を、保存力の仕事と結ぶ。'),middle:p('um-potential-slope',[4,5,6,7],'保存力の仕事から位置エネルギーを定義し、微分で力へ戻す。'),advanced:'万有引力のポテンシャル・折り返し点・安定性を計算し、保存則を検算する。'},
 {id:'uc-momentum',family:'umech',intro:p('ui-momentum',[0,3,6],'質量と速度から運動量を求め、力積と系の境界を区別する。'),middle:p('um-momentum-change',[1,2,4,5,7],'力を時間で積分し、運動量変化と力積のグラフを対応させる。'),advanced:'内部の力の相殺から保存則を導き、反発係数と連立して衝突後を求める。'},
 {id:'uc-angular',family:'umech',intro:p('ui-angular',[0,1,3],'ドアとてこで、力の大きさ・作用点・向きが回転にどう効くか読む。'),middle:p('um-angular',[2,4,5,6,7],'基準点を決め、トルクと角運動量を外積で表して計算する。'),advanced:'角運動量を時間微分してトルクと結び、中心力の面積速度一定を導く。'},
 {id:'uc-shm',family:'umech',intro:p('ui-pendulum',[0,1,6],'振り子の戻る向きと周期を、位置・運動エネルギーの交換で読む。'),middle:p('um-pendulum',[2,3,4,5],'接線方向の方程式を立て、小角近似の条件付きで振り子の周期を導く。'),advanced:'振動のエネルギーを検算し、減衰と強制振動の解から共振を求める。'},
 {id:'uc-rigid1',family:'umech',intro:p('ui-inertia',[0,1,3],'重心のつり合いと回転時の速さを、質量と軸からの距離で読む。'),middle:p('um-inertia',[2,4,5,6],'小さな質量のエネルギーを足して慣性モーメントを作り、積分へ直す。'),advanced:'棒・円板・球の慣性モーメントを積分し、平行軸の定理を証明する。'},
 {id:'uc-rigid2',family:'umech',intro:p('ui-rotation',[0,3,4],'角速度と滑らない車輪の速さを結び、並進と回転のエネルギーを分ける。'),middle:p('um-rotation',[1,2,5,6,7],'固定軸の回転方程式と滑らない条件を使い、車輪の各点の速度を出す。'),advanced:'転がる物体の速さを求め、角運動量保存と回転エネルギーの違いを説明する。'},
 {id:'uc-frontier',family:'umech',intro:p('ui-reference-frame',[0,3,6],'観測者による見え方、円運動の加速度、距離で変わる重力を区別する。'),middle:p('um-reference-frame',[1,2,4,5,8,9],'座標変換を二回微分して慣性力を求め、円軌道の力の式を立てる。'),advanced:'回転座標の追加項を区別し、中心力から円軌道と楕円軌道の性質を導く。'},
 {id:'ue-integrals',family:'uem',intro:p('ui-electric-work-path',[],'電場から力を求め、曲がった道を小区間に分けて仕事を足す。'),middle:p('um-line-integral-entry',[],'小区間の内積の和の極限から線積分を定義し、道の向きを区別する。'),advanced:'曲線のパラメータ表示と面の座標を使い、線積分と二重積分を実際に計算する。'},
 {id:'ue-gauss',family:'uem',intro:p('ui-closed-bag',[],'閉曲面の外向きを正とし、電気束の合計と各点の電場を区別する。'),middle:p('um-gauss-sphere-preview',[],'対称性で球面の電気束を簡単にし、法則の証明と計算の簡略化を区別する。'),advanced:'偏心球をそのまま積分し、立体角と重ね合わせで任意の閉曲面へ一般化する。'},
 {id:'ue-potential',family:'uem',intro:p('ui-electric-potential',[0,1,4],'電位と電位差を区別し、電場がする仕事と位置エネルギーの符号を読む。'),middle:p('um-electrostatic-potential-path',[2,3,8,10],'静電場の仕事を単位電荷あたりで数え、道によらない電位差を定義する。'),advanced:'電位から勾配で電場を求め、点電荷の積分と等電位面の性質を確かめる。'},
 {id:'ue-capacitor',family:'uem',intro:p('ui-capacitance',[0,1,6],'二枚の板に正負の電荷を分けて蓄え、容量と充電中の電圧を読む。'),middle:p('um-capacitance',[2,3,4,5,7],'面密度から板間の電場と電圧を求め、平行板の容量を導く。'),advanced:'充電仕事を積分してエネルギー密度を導き、誘電体と固定条件の違いを調べる。'},
 {id:'ue-current',family:'uem',intro:p('ui-conduction',[0,1,4],'断面を通る電荷で電流を測り、電子の移動と電流の向きを区別する。'),middle:p('um-conduction',[2,3,5,10,11],'断面を通る粒子の数から電流を求め、電荷保存から分岐点の収支を立てる。'),advanced:'衝突モデルから導電率とオームの法則を導き、送電の損失を計算する。'},
 {id:'ue-lorentz',family:'uem',intro:p('ui-magnetic-force',[0,1,4],'速度・磁場・力を三本の矢印で区別し、磁気力が速さを変えない理由を読む。'),middle:p('um-magnetic-force',[2,3,5,6,7],'ローレンツ力を出発点に、電荷の符号と円運動が成り立つ条件を判断する。'),advanced:'半径・周期・らせんの間隔を導き、粒子の力を足して導線の力を求める。'},
 {id:'ue-ampere',family:'uem',intro:p('ui-current-field',[0,1,8],'電流の周りの磁場の向きを読み、巻数と単位長さあたりの巻数を区別する。'),middle:p('um-current-field',[5,6,7,9,10],'定常電流の周回積分と対称性を使い、直線電流の磁場を求める。'),advanced:'ビオ・サバール則で円形電流を積分し、長いコイルの磁場を四辺から導く。'},
 {id:'ue-faraday',family:'uem',intro:p('ui-induction',[0,1,2],'磁束の変化と起電力を区別し、閉回路の有無と誘導の向きを読む。'),middle:p('um-induction',[3,4,5,6,7,8],'ファラデーの法則から回転コイルと動く導線の起電力を計算する。'),advanced:'自己・相互インダクタンスからコイルのエネルギーと変圧器の関係を導く。'},
 {id:'ue-transient',family:'uem',intro:p('ui-circuit-time',[0,1,7],'抵抗・コンデンサ・コイルの電圧を区別し、電荷と電流の変化を読む。'),middle:p('um-circuit-time',[2,3,4,6,8,9],'回路の収支を微分方程式に直し、RCの時定数と充放電の行き先を求める。'),advanced:'指数関数の解を確かめ、RLの過渡応答とLCの振動を同じ方法で導く。'},
 {id:'ue-maxwell',family:'uem',intro:p('ui-ac-waves',[0,1,7],'交流の周期・位相と波の伝わる速さを区別して図で読む。'),middle:p('um-ac-maxwell',[2,3,4,5,6,8],'交流での微分積分から素子の応答を出し、四つの場の法則を整理する。'),advanced:'変位電流で電荷保存を確かめ、真空の波動方程式と光速を導く。'},
];
export const topicById=Object.fromEntries(universityCurriculum.map(t=>[t.id,t]));
export const removedIndices=(id:string)=>new Set([...(topicById[id]?.intro.slides??[]),...(topicById[id]?.middle.slides??[])]);
export const movedCycles:Record<string,Record<string,string>>={
 'ue-integrals':{work:'ui-work-constant',linear:'ui-work-changing',projection:'ui-electric-work-path',surface:'um-surface-integral-entry'},
 'ue-gauss':{'sphere-flux':'um-gauss-sphere-preview'},
};
