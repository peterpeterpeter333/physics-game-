import type {EquationGuide} from './em-equation-guides';
import type {SpiralCycle} from './em-spiral';
import type {Stage} from '../types';
type Symbols=[string,string][];
const charge:Symbols=[['Q','場を作る点電荷 [C]。正負を含む'],['k','クーロンの定数1/(4πε₀) [N·m²/C²]'],['ε₀','真空の誘電率 [F/m]'],['E・E（矢印付き）','電場の大きさ・電場ベクトル [N/C]'],['ΦE','閉曲面を外向きに貫く電気束 [N·m²/C]']];
const area:Symbols=[['n','外向きの単位法線。長さ1で無次元'],['dA','細かく区切った微小な面積 [m²]'],['S・∮S','集計する閉曲面・その全面での積分'],['·','対応する成分同士を掛けて足す内積']];
const shifted:Symbols=[['R','積分する球の半径 [m]'],['d','電荷から球中心までのずれ [m]。微分のdとは別'],['r・r（矢印付き）','電荷から面の点までの距離・位置ベクトル [m]'],['θ・φ','球中心から測る極角・周方向の角度 [rad]'],['C','球の中心の座標。電気容量ではない']];
const sets:Record<string,Symbols>={
 'sphere-flux':[['r','電荷を中心にした球の半径 [m]'],['4πr²','この球の全面積 [m²]'],...charge,...area],
 offset:[...shifted,...area,...charge],
 substitute:[['u','置換した距離の二乗r² [m²]。前章の道の目盛りとは別'],['du','このuの微小な変化 [m²]'],...shifted,...charge,...area],
 evaluate:[['G(u)','積分する関数の原始関数を表す略記。この計算では長さの単位 [m]'],['u','距離の二乗 [m²]'],['[G]ₐᵇ','上端G(b)から下端G(a)を引く'],['|R−d|','R−dの絶対値。平方根√((R−d)²)は常にこれ'],...shifted,...charge],
 angle:[['dΩ','符号付き立体角。投影面積を距離の二乗で割ったもの [sr]'],['θ','電荷から面への方向と、外向き法線の角度 [rad]'],['r','電荷から小さな面までの距離 [m]'],...area,...charge],
 closed:[['dΩ','出る方向を正、入る方向を負とした立体角 [sr]'],['4π','単位球全面に対応する立体角 [sr]'],['Qj・Σj','j番目の電荷・指定した電荷を足す記号'],['内','積分する閉曲面の内側にある電荷だけを選ぶ印'],...area,...charge],
 apply:[['r','点電荷または直線電荷からの距離 [m]'],['λ','直線の長さ1 mあたりの電荷 [C/m]'],['L','積分する円筒の長さ [m]'],['2πrL','円筒の側面積 [m²]'],...charge,...area],
 zero:[['Q内','閉曲面内部の電荷の合計 [C]'],['Er','球中心から外向きの電場成分 [N/C]'],['r','球殻内部に取る同心球の半径 [m]'],['E外・E再配置','外部による電場と、再配置した自由電荷による電場 [N/C]'],...area,...charge],
};
const reads:Record<string,string>={
 'sphere-flux':'電場の逆二乗と球面積の二乗を掛けて約分する。ここでは中心が一致する球だけを計算している。',
 offset:'rは電荷から、nは球中心から。異なる二方向の内積を計算し、場の法線成分を取り出す。',
 substitute:'同じ球面のまま変数をθからuへ替える。分子・微分・積分範囲をすべて一緒に変える。',
 evaluate:'平方根を絶対値として扱い、電荷が内部か外部かで場合分けして、原始関数の両端の差を求める。',
 angle:'投影でcosθ、距離の違いで1/r²が現れる。その組を立体角と名付け、場と幾何を分ける。',
 closed:'各方向の出入りを符号付きで数え、その後に電荷ごとの寄与を足す。面上に電荷がないことが前提。',
 apply:'法則だけでなく対称性も使ってEを積分の外へ出す。面の選び方が電場を変えるわけではない。',
 zero:'積分の合計0と、各点の電場0を分ける。後者をいうには球対称性や静電平衡など追加の根拠が必要。',
};
export function gaussEquationGuide(stage:Stage,cycle:SpiralCycle,phase:number):EquationGuide{
 const card=cycle.cards[phase];
 // Source references are authored per cycle; retain their order instead of guessing algebra from text.
 const proofOrder=cycle.id==='substitute'?['g-offsetintegrand','g-substitution','g-antiderivative']:cycle.id==='closed'?['g-raycount','g-superposition']:cycle.references;
 const source=proofOrder.map(id=>stage.lesson.steps.find(step=>step.story?.scene===id)).filter(s=>s!==undefined);
 const lines=source.flatMap(s=>s.story!.beats.filter(b=>b.tex).map(b=>({note:b.action+'：'+b.text,tex:b.tex!})));
 return {kind:'この段の式と前提',read:reads[cycle.id],symbols:sets[cycle.id],steps:lines.length?lines:[{note:'この段の結論を確認する',tex:card.tex!}]};
}
