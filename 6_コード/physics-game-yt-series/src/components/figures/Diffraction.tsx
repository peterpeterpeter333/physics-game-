import {useState} from 'react';
/** Far-field single-slit intensity. This is not a standing-wave diagram. */
export function Diffraction(){
 const [ratio,setRatio]=useState(2);
 const intensity=(angle:number)=>{const z=Math.PI*ratio*Math.sin(angle);return Math.abs(z)<1e-8?1:(Math.sin(z)/z)**2;};
 const curve=Array.from({length:201},(_,i)=>{const a=(i/200-.5)*Math.PI;return `${30+280*i/200},${190-140*intensity(a)}`;}).join(' ');
 return <div><svg viewBox="0 0 340 245" role="img" aria-label="単一スリットの幅と遠方の回折強度">
 <path d="M30 35V190H315" fill="none" stroke="#9cacc8"/><polyline points={curve} fill="none" stroke="#61dffc" strokeWidth="2.5"/>
 <text x="35" y="25" fill="#d6e4fa" fontSize="13">明るさ I / 中央の明るさ</text>
 <text x="24" y="210" fill="#afc4df" fontSize="12">−90°</text><text x="165" y="210" fill="#afc4df" fontSize="12">0°</text><text x="286" y="210" fill="#afc4df" fontSize="12">90°</text>
 <text x="170" y="233" textAnchor="middle" fill="#ffd36a" fontSize="13">正面からの角度 θ</text>
 </svg><label>隙間の幅 / 波長 = {ratio.toFixed(1)}<input aria-label="隙間の幅と波長の比" type="range" min="1" max="8" step=".1" value={ratio} onChange={e=>setRatio(+e.target.value)}/></label>
 <p>波長は固定。隙間を狭くすると中央の山が広がります。最初の暗線：sinθ=λ/a。横軸は位置でなく角度、遠方での強度を中央で割った図です。</p></div>;
}
