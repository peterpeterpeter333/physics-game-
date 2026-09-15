import { useState } from 'react';
import { C, useT } from './anim';
import { Caption, FigSvg } from './mechanics';

export function Longitudinal() {
 const t=useT(), k=2*Math.PI/90;
 return <FigSvg>
  <text x={12} y={25} fill={C.cyan} fontSize={12}>粒子は左右に往復。密な部分は右へ進む。</text>
  {[0,1,2].flatMap(row=>Array.from({length:31},(_,i)=>{
   const base=24+i*9,x=base+6*Math.sin(k*base-t*2);
   return <circle key={`${row}-${i}`} cx={x} cy={65+row*22} r={i===14?5:3} fill={i===14?C.gold:C.cyan}/>;
  }))}
  <line x1={150} x2={150} y1={45} y2={123} stroke={C.gold} strokeDasharray="3 3"/>
  <text x={17} y={146} fill={C.gold} fontSize={12}>金色の粒に注目：遠くへ運ばれない</text>
  <Caption text="音・ばねの縦波。密度の模様と粒子自身の動きを区別する。"/>
 </FigSvg>;
}
export function StandingWave() {
 const t=useT(), [n,setN]=useState(1);
 const points=Array.from({length:121},(_,i)=>`${30+i*260/120},${92-45*Math.sin(n*Math.PI*i/120)*Math.cos(t*3)}`).join(' ');
 return <div><FigSvg>
  <text x={12} y={25} fill={C.dim} fontSize={12}>両端固定の弦　n = {n}　λ = 2L / n</text>
  <line x1={30} x2={290} y1={92} y2={92} stroke={C.dim} strokeDasharray="4 3"/>
  <polyline points={points} stroke={C.cyan} fill="none" strokeWidth={3}/>
  {Array.from({length:n+1},(_,i)=><circle key={i} cx={30+260*i/n} cy={92} r={5} fill={C.gold}/>)}
  <text x={26} y={148} fill={C.gold} fontSize={11}>金色：節（動かない点）　中央など：腹</text>
  <Caption text="弦の長さLに、半波長が整数個入る。全体の模様は進まない。"/>
 </FigSvg><button className="btn btn-ghost" onClick={()=>setN(n=>n===3?1:n+1)}>基本振動・倍音を切り替える</button></div>;
}
export function YoungSlits() {
 const t=useT(), y=90+54*Math.sin(t*.45), slits=[65,115];
 const lengths=slits.map(s=>Math.hypot(180,y-s)), delta=lengths[0]-lengths[1];
 const intensity=Math.cos(Math.PI*delta/8)**2;
 return <FigSvg>
  <text x={12} y={20} fill={C.dim} fontSize={11}>同位相の2スリット → 経路差で明暗が変わる</text>
  <line x1={90} x2={90} y1={38} y2={150} stroke={C.dim} strokeWidth={5}/>
  {slits.map((s,i)=><g key={s}>
   <circle cx={90} cy={s} r={5} fill={C.cyan}/>
   <line x1={90} y1={s} x2={270} y2={y} stroke={i?C.purple:C.cyan}/>
   {Array.from({length:5},(_,j)=>{const f=(t*.35+j/5)%1;return <circle key={j} cx={90+180*f} cy={s+(y-s)*f} r={3} fill={i?C.purple:C.cyan}/>;})}
  </g>)}
  {Array.from({length:56},(_,i)=>{const yy=35+i*2,d=Math.hypot(180,yy-65)-Math.hypot(180,yy-115);return <rect key={i} x={278} y={yy} width={12} height={2} fill={C.gold} opacity={.08+.92*Math.cos(Math.PI*d/8)**2}/>;})}
  <circle cx={270} cy={y} r={7} fill={C.gold} opacity={.15+.85*intensity}/>
  <text x={20} y={49} fill={C.cyan} fontSize={12}>S₁</text><text x={20} y={123} fill={C.purple} fontSize={12}>S₂</text>
  <text x={20} y={164} fill={C.gold} fontSize={11}>経路差 / λ = {(delta/8).toFixed(2)}　相対強度 {intensity.toFixed(2)}</text>
  <Caption text="光点は位相の目印。右の明暗は2経路の波を足した結果。"/>
 </FigSvg>;
}
export function ChargeWork() {
 const t=useT(), fraction=(t/9)%1;
 return <FigSvg>
  <text x={15} y={20} fill={C.dim} fontSize={12}>小さな電荷 × その時の電圧 = 仕事の短冊</text>
  <line x1={45} y1={145} x2={290} y2={145} stroke={C.dim}/><line x1={45} y1={145} x2={45} y2={35} stroke={C.dim}/>
  <text x={12} y={43} fill={C.cyan} fontSize={11}>電圧</text><text x={268} y={163} fill={C.gold} fontSize={11}>電荷q</text>
  {Array.from({length:24},(_,i)=>{const q=(i+.5)/24;return q<=fraction?<rect key={i} x={45+240*i/24} y={145-100*q} width={9} height={100*q} fill={C.gold} opacity={.6}/>:null;})}
  <line x1={45} y1={145} x2={285} y2={45} stroke={C.cyan} strokeWidth={2}/>
  <circle cx={45+240*fraction} cy={145-100*fraction} r={5} fill={C.cyan}/>
  <text x={100} y={48} fill={C.cyan} fontSize={12}>V(q) = q/C</text>
  <text x={90} y={72} fill={C.gold} fontSize={11}>面積 = U = q²/(2C)</text>
  <Caption text="0から最終Qまでの面積は三角形。QVではなくQV/2。"/>
 </FigSvg>;
}
export function Nuclide() {
 const t=useT(), s=(t%8), f=Math.max(0,Math.min(1,(s-2)/3));
 return <FigSvg>
  <text x={12} y={22} fill={C.dim} fontSize={12}>α崩壊の例：陽子2個＋中性子2個を放出</text>
  {Array.from({length:30},(_,i)=>{const angle=i*2.4, rr=6*Math.sqrt(i);return <circle key={i} cx={105+rr*Math.cos(angle)} cy={90+rr*Math.sin(angle)} r={6} fill={i%2?C.cyan:C.red}/>;})}
  {[[-5,-5],[5,-5],[-5,5],[5,5]].map(([x,y],i)=><circle key={i} cx={135+115*f+x} cy={86+y} r={6} fill={i<2?C.red:C.cyan}/>)}
  <text x={35} y={145} fill={C.gold} fontSize={12}>{f===0?'²³⁸U：Z=92, A=238':'²³⁴Th：Z=90, A=234'}</text>
  {f>0&&<text x={204} y={123} fill={C.gold} fontSize={12}>⁴He：Z=2, A=4</text>}
  <Caption text="赤は陽子、青は中性子。粒数と大きさは模式的に省略。"/>
 </FigSvg>;
}
export function MassEnergy() {
 const t=useT(), f=(1-Math.cos(t*.7))/2;
 return <FigSvg>
  <text x={12} y={24} fill={C.dim} fontSize={12}>反応前の静止エネルギー = 反応後 ＋ 放出分</text>
  <rect x={45} y={48} width={220} height={24} fill={C.purple}/>
  <text x={55} y={65} fill="white" fontSize={12}>m前 c²</text>
  <rect x={45} y={100} width={220-60*f} height={24} fill={C.cyan}/>
  <rect x={265-60*f} y={100} width={60*f} height={24} fill={C.gold}/>
  <text x={55} y={116} fill="#111827" fontSize={12}>m後 c²</text>
  <text x={201} y={147} fill={C.gold} fontSize={12}>ΔE = Δm c²</text>
  <Caption text="下段の合計は不変。説明用に質量差を大きく表示している。"/>
 </FigSvg>;
}
