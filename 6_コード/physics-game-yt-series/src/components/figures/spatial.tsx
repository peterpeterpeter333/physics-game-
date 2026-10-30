import { useState } from 'react';
import { useT, useSweep, C } from './anim';

type V = [number, number, number];
type Mode = 'flux' | 'cross' | 'helix' | 'wave';
const add = (a:V,b:V):V => [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const mul = (a:V,n:number):V => [a[0]*n,a[1]*n,a[2]*n];

/** True 3D coordinates, orthographically projected. Camera motion never changes physics. */
function Spatial({mode}:{mode:Mode}) {
 const t=useT();
 const [yaw,setYaw]=useState(32);
 const [pitch,setPitch]=useState(24);
 const [deg,setDeg]=useSweep(mode==='cross'?70:25,mode==='cross'?10:0,mode==='cross'?170:90,14);
 const [sign,setSign]=useState(1);
 const a=yaw*Math.PI/180, p=pitch*Math.PI/180, theta=deg*Math.PI/180;
 const project=([x,y,z]:V):[number,number] => {
  const xx=x*Math.cos(a)+z*Math.sin(a), zz=-x*Math.sin(a)+z*Math.cos(a);
  return [180+65*xx,145-65*(y*Math.cos(p)-zz*Math.sin(p))];
 };
 const points=(vs:V[])=>vs.map(v=>project(v).join(',')).join(' ');
 const line=(from:V,to:V,color:string,key:string,dash=false)=>{
  const [x1,y1]=project(from),[x2,y2]=project(to);
  return <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} strokeDasharray={dash?'4 4':undefined}/>;
 };
 const arrow=(from:V,to:V,color:string,label:string)=>{
  const [x1,y1]=project(from),[x2,y2]=project(to), angle=Math.atan2(y2-y1,x2-x1);
  const tip=`${x2},${y2} ${x2-9*Math.cos(angle-.4)},${y2-9*Math.sin(angle-.4)} ${x2-9*Math.cos(angle+.4)},${y2-9*Math.sin(angle+.4)}`;
  return <g key={label}>{line(from,to,color,label)}<polygon points={tip} fill={color}/><text x={x2+6} y={y2-6} fill={color} fontSize={12}>{label}</text></g>;
 };
 const particle=(pos:V,color:string,key:string,radius=4)=>{const [cx,cy]=project(pos);return <circle key={key} cx={cx} cy={cy} r={radius} fill={color}/>;};
 const origin:V=[0,0,0];
 const normal:V=[Math.sin(theta),0,Math.cos(theta)];
 const u:V=[Math.cos(theta),0,-Math.sin(theta)], v:V=[0,1,0];
 const A:V=[1.45,0,0], B:V=[Math.cos(theta),Math.sin(theta),0];
 const helix=(s:number):V=>[.65*Math.cos(s),-.65*Math.sin(sign*s),-1.45+.21*s];
 const progress=(t*.8)%(4*Math.PI);
 const titles={flux:'面・法線・磁場を立体で比較',cross:'2本の矢印と、垂直な外積',helix:'円運動＋磁場方向の等速運動',wave:'直交する電場・磁場が進む'};
 return <div className="spatial-figure">
  <svg className="fig" viewBox="0 0 360 290" role="img" aria-label={titles[mode]}>
   <title>{titles[mode]}</title>
   <text x={12} y={22} fill={C.dim} fontSize={12}>3D · {titles[mode]}</text>
   {line([-1.7,0,0],[1.7,0,0],C.dim,'x',true)}
   {line([0,-1.2,0],[0,1.5,0],C.dim,'y',true)}
   {line([0,0,-1.7],[0,0,1.7],C.dim,'z',true)}
   {mode==='flux' && <>
    {[-.8,0,.8].flatMap(x=>[-.7,0,.7].map(y=>line([x,y,-1.5],[x,y,1.5],C.cyan,`field${x}${y}`)))}
    <polygon points={points([add(u,v),add(mul(u,-1),v),mul(add(u,v),-1),add(u,mul(v,-1))])} fill={C.gold} fillOpacity={.23} stroke={C.gold}/>
    {arrow(origin,mul(normal,1.5),C.purple,'法線 n')}
    {arrow([1.3,0,-1],[1.3,0,1],C.cyan,'B')}
    {[-.8,0,.8].flatMap(x=>[-.7,0,.7].map((y,i)=>particle([x,y,((t*.5+i*.7)%3)-1.5],C.cyan,`flow${x}${y}`)))}
    <text x={12} y={261} fill={C.gold} fontSize={13}>θ = {deg.toFixed(1)}°　Φ / BA = {Math.cos(theta).toFixed(2)}</text>
    <text x={12} y={280} fill={C.dim} fontSize={11}>粒は通過量の目印。磁場の物質粒子ではありません。</text>
   </>}
   {mode==='cross' && <>
    <polygon points={points([origin,A,add(A,B),B])} fill={C.green} fillOpacity={.2} stroke={C.green}/>
    {arrow(origin,A,C.cyan,'A')}{arrow(origin,B,C.purple,'B')}
    {arrow(origin,[0,0,sign*1.45*Math.sin(theta)],C.gold,sign===1?'A × B':'B × A')}
    {particle([.3*Math.cos(sign*t),.3*Math.sin(sign*t),0],C.gold,'rotation')}
    <text x={12} y={262} fill={C.gold} fontSize={13}>θ = {deg.toFixed(1)}°　面積 / AB = {Math.sin(theta).toFixed(2)}</text>
    <text x={12} y={282} fill={C.dim} fontSize={11}>順序で軸の向きが反転。回る点は向きの目印。</text>
   </>}
   {mode==='helix' && <>
    <polyline points={points(Array.from({length:160},(_,i)=>helix(i/159*4*Math.PI)))} fill="none" stroke={C.purple} strokeWidth={2}/>
    {arrow([1.2,0,-1.3],[1.2,0,1.4],C.cyan,'B')}
    {particle(helix(progress),C.gold,'charge',7)}
    {arrow(helix(progress),add(helix(progress),[-.5*Math.cos(progress),.5*Math.sin(sign*progress),0]),C.red,'F')}
    <text x={12} y={262} fill={C.gold} fontSize={13}>q {sign===1?'>':'<'} 0　r = mv⊥ / |q|B　ピッチ = v∥T</text>
    <text x={12} y={282} fill={C.dim} fontSize={11}>一様な磁場・電場なし。1周期ごとに同じ距離を進む。</text>
   </>}
   {mode==='wave' && <>
    <polyline points={points(Array.from({length:100},(_,i)=>{const x=-2+i*4/99;return [x,.7*Math.sin(3*x-t*2),0] as V;}))} fill="none" stroke={C.gold} strokeWidth={2}/>
    <polyline points={points(Array.from({length:100},(_,i)=>{const x=-2+i*4/99;return [x,0,.7*Math.sin(3*x-t*2)] as V;}))} fill="none" stroke={C.cyan} strokeWidth={2}/>
    {Array.from({length:13},(_,i)=>{const x=-1.8+i*.3,y=.7*Math.sin(3*x-t*2);return <g key={i}>{line([x,0,0],[x,y,0],C.gold,`e${i}`)}{line([x,0,0],[x,0,y],C.cyan,`b${i}`)}</g>;})}
    {arrow([-1.2,-1,0],[1.3,-1,0],C.green,'進行 +x')}
    <text x={12} y={260} fill={C.gold} fontSize={13}>E：y方向</text><text x={140} y={260} fill={C.cyan} fontSize={13}>cB：z方向</text>
    <text x={12} y={282} fill={C.dim} fontSize={11}>表示はEとcBで尺度をそろえる。物体の揺れではない。</text>
   </>}
  </svg>
  {(mode==='flux'||mode==='cross')&&<label className="figure-range">{mode==='flux'?'法線とBの角度':'AとBの角度'}<input aria-label="物理的な角度" type="range" min={mode==='cross'?10:0} max={mode==='cross'?170:90} step={1} value={deg} onChange={e=>setDeg(+e.target.value)}/></label>}
  {(mode==='cross'||mode==='helix')&&<button className="btn btn-ghost" onClick={()=>setSign(s=>-s)}>{mode==='cross'?'外積の順序を交換':'電荷の正負を交換'}</button>}
  <label className="figure-range">視点・横<input aria-label="3D視点の横回転" type="range" min={-150} max={150} value={yaw} onChange={e=>setYaw(+e.target.value)}/></label>
  <label className="figure-range">視点・高さ<input aria-label="3D視点の高さ" type="range" min={-60} max={65} value={pitch} onChange={e=>setPitch(+e.target.value)}/></label>
  <p className="figure-note">視点だけ変えても、物理量は変わりません。</p>
 </div>;
}
export const Flux3D=()=> <Spatial mode="flux"/>;
export const Cross3D=()=> <Spatial mode="cross"/>;
export const Helix3D=()=> <Spatial mode="helix"/>;
export const EmWave3D=()=> <Spatial mode="wave"/>;
