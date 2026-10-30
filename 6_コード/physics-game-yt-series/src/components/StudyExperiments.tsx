import {useState} from 'react';
import type {ReactNode} from 'react';

const gold='#ffd16a', cyan='#57def6', muted='#b8c4dc';
function Chart({title,children}:{title:string;children:ReactNode}) {
 return <svg viewBox="0 0 360 220" role="img" aria-label={title} style={{width:'100%',maxWidth:560,display:'block',background:'#12192b',borderRadius:12}}><title>{title}</title>{children}</svg>;
}
function Range({label,value,min=0,max=1,step=.01,onChange}:{label:string;value:number;min?:number;max?:number;step?:number;onChange:(v:number)=>void}) {
 return <label style={{display:'grid',gap:8,margin:'12px 0'}}>{label}<input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/></label>;
}

/** Separate manipulable models, mounted only when the learner opens the bridge. */
export function DriftExperiment(){
 const [t,setT]=useState(0);
 const xs=Array.from({length:12},(_,i)=>45+i*20+12*t+18*(Math.sin(7*t+i*Math.PI/6)-Math.sin(i*Math.PI/6)));
 return <><p>黄色の同じ粒を追う。水色は12個の平均位置。時間を進め、往復運動と平均の移動を比べる（速さは模式的）。</p>
 <Range label={`経過時間の目盛り：${t.toFixed(2)}`} value={t} onChange={setT}/>
 <Chart title="一個の粒子の往復と集団の平均移動"><rect x="25" y="50" width="310" height="80" rx="10" fill="none" stroke={muted}/>
 {xs.map((x,i)=><circle key={i} cx={x} cy={i===5?90:70+(i%3)*20} r={i===5?8:4} fill={i===5?gold:muted}/>)}
 <line x1={155+12*t} x2={155+12*t} y1="45" y2="145" stroke={cyan} strokeWidth="3"/>
 <text x="25" y="174" fill={gold}>一個の変位：{(xs[5]-145).toFixed(1)} 目盛り</text>
 <text x="25" y="202" fill={cyan}>平均変位：{(12*t).toFixed(1)} 目盛り →</text></Chart></>;
}
export function AxisExperiment(){
 const [a,setA]=useState(0);
 const i=(a+1)**2+(1-a)**2;
 return <><p>1 kgの二つのおもりをx=−1 m、+1 mに固定。縦の回転軸だけを動かす。距離rは物体中心からではなく軸から測る。</p>
 <Range label={`軸の位置 a=${a.toFixed(2)} m`} value={a} min={-1} onChange={setA}/>
 <Chart title="軸からの距離と慣性モーメント"><line x1="70" x2="290" y1="100" y2="100" stroke={muted}/><circle cx="70" cy="100" r="12" fill={gold}/><circle cx="290" cy="100" r="12" fill={gold}/>
 <line x1={180+110*a} x2={180+110*a} y1="25" y2="140" stroke={cyan} strokeWidth="4"/>
 <text x="20" y="170" fill={muted}>r₁={Math.abs(-1-a).toFixed(2)} m　r₂={Math.abs(1-a).toFixed(2)} m</text>
 <text x="20" y="201" fill={cyan}>I=1×r₁²+1×r₂²={i.toFixed(2)} kg·m²</text></Chart></>;
}
export function ChargeExperiment(){
 const [q,setQ]=useState(0);
 return <><p>容量C=1 F、最終電荷Q=6 Cの例。途中の電荷qを増やすと電圧q/Cも増える。黄色の面積が、ここまでの充電の仕事。</p>
 <Range label={`途中の電荷 q=${q.toFixed(1)} C（最終Q=6 C）`} value={q} max={6} step={.1} onChange={setQ}/>
 <Chart title="途中の電荷と電圧の下の面積"><path d="M45 25V175H330" stroke={muted} fill="none"/>
 <polygon points={`45,175 ${45+q*42},175 ${45+q*42},${175-q*22}`} fill={gold} opacity=".3"/>
 <path d="M45 175L297 43" stroke={cyan} strokeWidth="3"/>
 <circle cx={45+q*42} cy={175-q*22} r="6" fill={gold}/>
 <text x="55" y="28" fill={cyan}>電圧 V=q/C [V]</text><text x="210" y="205" fill={muted}>電荷 q [C]</text>
 <text x="65" y="80" fill={gold}>仕事={((q*q)/2).toFixed(2)} J</text></Chart></>;
}
export function CircuitExperiment(){
 const [v,setV]=useState(2);
 return <><p>RC充電：電池6 V、抵抗R=1 Ω。電流の向きに一周する。電池の上昇と、抵抗・コンデンサの降下の合計は0。</p>
 <Range label={`コンデンサ電圧 VC=${v.toFixed(1)} V`} value={v} max={6} step={.1} onChange={setV}/>
 <Chart title="RC回路を一周した電圧の収支"><path d="M45 170V60H310V170Z" stroke={muted} fill="none" strokeWidth="3"/>
 <text x="60" y="42" fill={gold}>→ 抵抗：−{(6-v).toFixed(1)} V</text>
 <text x="60" y="100" fill={cyan}>↑ 電池：+6 V</text>
 <text x="90" y="139" fill={gold}>↓ 容量：−{v.toFixed(1)} V</text>
 <text x="55" y="202" fill={muted}>一周：6−{(6-v).toFixed(1)}−{v.toFixed(1)}=0 V</text></Chart>
 <p>抵抗電圧={ (6-v).toFixed(1)} V、電流={ (6-v).toFixed(1)} A。電圧差がなくなると電流も0。</p></>;
}
export function InductorExperiment(){
 const [s,setS]=useState(1);
 return <><p>L=2 H。電流の正方向は左→右。Vは左端の電位−右端の電位。εは左→右に進む電荷への逆起電力。</p>
 <Range label={`電流の変化率 I′=${s.toFixed(1)} A/s`} value={s} min={-2} max={2} step={.1} onChange={setS}/>
 <Chart title="同じコイルの端子電圧と逆起電力"><path d="M40 90H95 Q105 40 115 90 Q125 40 135 90 Q145 40 155 90 Q165 40 175 90 Q185 40 195 90 H320" stroke={muted} fill="none" strokeWidth="3"/>
 <text x="50" y="35" fill={cyan}>正の電流 I →</text>
 <text x="35" y="131" fill={cyan}>V=V左−V右=2I′={ (2*s).toFixed(1)} V</text>
 <text x="35" y="163" fill={gold}>ε=−2I′={(-2*s).toFixed(1)} V</text>
 <text x="35" y="200" fill={gold}>逆起電力：{s>0?'←':s<0?'→':'0（向きなし）'}</text></Chart></>;
}
export function RefractionExperiment(){
 const [ratio,setRatio]=useState(.65);
 // Huygens construction: A and B lie on the interface, AB is the common hypotenuse.
 const A=[55,118],B=[305,118],h=250,s1=.7,s2=s1*ratio;
 const C=[B[0]-h*s1*s1,B[1]-h*s1*Math.sqrt(1-s1*s1)];
 const D=[A[0]+h*s2*s2,A[1]+h*s2*Math.sqrt(1-s2*s2)];
 return <><p>Aに届いた波が次にBへ届くまでの同じ時間Δtを比べる。上の直角三角形ABCと下のADBの斜辺ABは共通。</p>
 <Range label={`速さの比 v₂/v₁=${ratio.toFixed(2)}（θ₁=44.4°を固定）`} value={ratio} min={.25} max={1} onChange={setRatio}/>
 <Chart title="屈折を導く共通斜辺ABの二つの直角三角形"><line x1="20" x2="340" y1="118" y2="118" stroke={muted}/>
 <polygon points={`${A} ${B} ${C}`} stroke={gold} fill="none" strokeWidth="2"/>
 <polygon points={`${A} ${B} ${D}`} stroke={cyan} fill="none" strokeWidth="2"/>
 <line x1={B[0]} y1={B[1]} x2={C[0]} y2={C[1]} stroke={gold} strokeWidth="5"/>
 <line x1={A[0]} y1={A[1]} x2={D[0]} y2={D[1]} stroke={cyan} strokeWidth="5"/>
 <text x="32" y="119" fill={muted}>A</text><text x="312" y="119" fill={muted}>B</text>
 <text x={C[0]-16} y={C[1]+8} fill={gold}>C ∟</text><text x={D[0]-16} y={D[1]+18} fill={cyan}>D ∟</text>
 <text x="230" y="50" fill={gold}>BC=v₁Δt</text><text x="225" y="177" fill={cyan}>AD=v₂Δt</text>
 <text x="135" y="107" fill={muted}>共通の斜辺 AB</text></Chart>
 <p>∠CAB=θ₁、∠ABD=θ₂（光線と法線の角にも等しい）。sinθ₁=BC/AB、sinθ₂=AD/AB。θ₂={ (Math.asin(s2)*180/Math.PI).toFixed(1)}°。</p></>;
}

export const studyExperiments:Record<string,()=>ReactNode>={
 'ui-conduction':DriftExperiment,'um-conduction':DriftExperiment,'ue-current':DriftExperiment,
 'ui-inertia':AxisExperiment,'um-inertia':AxisExperiment,'uc-rigid1':AxisExperiment,
 'ue-capacitor':ChargeExperiment,'ui-capacitance':ChargeExperiment,'e-capacitor':ChargeExperiment,
 'ui-circuit-time':CircuitExperiment,'um-circuit-time':CircuitExperiment,'ue-transient':CircuitExperiment,
 'ue-faraday':InductorExperiment,'um-ac-maxwell':InductorExperiment,'w-light':RefractionExperiment,
};
