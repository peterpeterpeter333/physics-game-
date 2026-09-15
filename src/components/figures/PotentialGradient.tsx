import {useState} from 'react';
import {C} from './anim';

/** One fixed potential, unlike the comparison of different uniform fields. */
export function PotentialGradient(){
 const [width,setWidth]=useState(1);
 const x0=1,x1=x0+width;
 const V=(x:number)=>4-x*x/2;
 const px=(x:number)=>42+76*x,py=(v:number)=>174-32*v;
 const average=(V(x0)-V(x1))/width;
 const points=Array.from({length:55},(_,i)=>{const x=i/20;return `${px(x)},${py(V(x))}`;}).join(' ');
 return <section aria-label="電位の傾きから電場を求める図">
  <p className="figure-note">同じ電位分布の二点を近づけ、その場所の電場を求めます。横軸は位置、縦軸は電位です。粒子の軌道ではありません。</p>
  <svg viewBox="0 0 320 250" role="img" aria-label="固定した電位曲線で、二点を結ぶ青線が点Aの接線へ近づく">
   <title>電位差÷距離から、点Aの電場へ</title>
   <path d="M42 32V174H287" stroke={C.dim} fill="none"/>
   <text x="27" y="177" fill={C.dim} fontSize="10">0</text>
   <text x="27" y={py(4)+4} fill={C.gold} fontSize="10">4</text>
   <text x={px(1)} y="188" fill={C.dim} fontSize="10">1</text>
   <line x1={px(1)} x2={px(1)} y1="170" y2="177" stroke={C.dim}/>
   <text x="9" y="22" fill={C.gold} fontSize="11">電位 V [V]</text>
   <text x="221" y="215" fill={C.dim} fontSize="11">位置 x [m]</text>
   <polyline points={points} fill="none" stroke={C.gold} strokeWidth="2"/>
   <line x1={px(.5)} y1={py(V(x0)+.5)} x2={px(2.2)} y2={py(V(x0)-1.2)} stroke={C.dim} strokeDasharray="4 3"/>
   <line x1={px(x0)} y1={py(V(x0))} x2={px(x1)} y2={py(V(x1))} stroke={C.cyan} strokeWidth="3"/>
   <path d={`M${px(x0)} ${py(V(x0))}H${px(x1)}V${py(V(x1))}`} fill="none" stroke={C.cyan} strokeDasharray="3 3"/>
   <circle cx={px(x0)} cy={py(V(x0))} r="4" fill={C.gold}/>
   <circle cx={px(x1)} cy={py(V(x1))} r="4" fill={C.cyan}/>
   <text x={px(x0)-8} y={py(V(x0))-12} fontSize="11" fill={C.gold}>A：x=1 m</text>
   <text x={px(x1)+7} y={py(V(x1))+13} fontSize="11" fill={C.cyan}>B</text>
   <text x="48" y="233" fontSize="10" fill={C.dim}>金：電位　青：二点の傾き　灰点線：Aの接線</text>
  </svg>
  <label className="figure-range">二点の距離 Δx = {width.toFixed(2)} m<input aria-label="二点の距離 Δx" type="range" min="0.02" max="1.5" step="0.01" value={width} onChange={e=>setWidth(Number(e.target.value))}/></label>
  <p className="figure-note">電位差 ΔV = {(V(x1)-V(x0)).toFixed(4)} V。平均電場 −ΔV/Δx = {average.toFixed(3)} V/m。</p>
  <p className="figure-note">Δxを0へ近づけると、点Aの電場 Eₓ = 1 V/mへ近づきます。ここでは電位差も小さくなります。</p>
  <details><summary>この図の設定と記号</summary><p>静電場の例 V(x)=4 V−(0.5 V/m²)x²。y,z方向には変化しません。Aは位置を固定した観測点、Bは比較する位置です。微分するとEₓ=(1 V/m²)xなので、Aで1 V/mです。</p></details>
 </section>;
}
