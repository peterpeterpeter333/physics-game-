import {useState} from 'react';

export function pathStep(u:number,h:number){return {dx:h,dy:2*u*h+h*h,tangentY:2*u*h,error:h*h};}

/** A chosen geometric path, not an electron's free trajectory. */
export function PathMeaning({initialPart=0,videoTime}:{initialPart?:number;videoTime?:number}){
 const [part,setPart]=useState(initialPart),[liveU,setU]=useState(.5),[liveH,setH]=useState(.2);
 const u=videoTime===undefined?liveU:part===1?.4:.1+.7*(1-Math.cos(videoTime*.3))/2;
 const h=videoTime===undefined?liveH:.02+.25*(1+Math.cos(videoTime*.3))/2;
 const p=pathStep(u,h),end=u+h;
 const x=(v:number)=>45+280*v,y=(v:number)=>270-220*v;
 const fmt=(v:number)=>Number(v.toFixed(4)).toString();
 return <div className="path-meaning">
  <div className="meaning-tabs" role="group" aria-label="道の式を読み解く">{['位置を決める','一歩を比べる','文字の式へ'].map((name,i)=><button key={name} aria-pressed={part===i} onClick={()=>{setPart(i);if(i===1)setU(Math.min(u,1-h));}}>{name}</button>)}</div>
  <p className="meaning-caption">{part===0?'今回選んだ道：横1m・縦1mの放物線。uは道に付けた目盛り。':part===1?'青＝二点間の移動。金＝接線での近似。刻みを小さくすると重なります。':'横幅をL、縦幅をHに広げたもの。同じ道の作り方を文字で書きます。'}</p>
  <svg viewBox="0 0 380 325" role="img" aria-label="目盛りuと放物線上の位置、実際の移動と接線の近似">
   <defs><marker id="path-actual-tip" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#65e2ff"/></marker><marker id="path-tangent-tip" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#ffd36a"/></marker></defs>
   <path d="M45 35 V270 H345" fill="none" stroke="#8494b0"/>
   <path d="M45 270 Q185 270 325 50" fill="none" stroke="#a9b6d0" strokeWidth="2"/>
   <text x="285" y="310" fill="#b9c7dd" fontSize="13">横 x [m]</text><text x="5" y="22" fill="#b9c7dd" fontSize="13">縦 y [m]</text>
   <text x="32" y="289" fill="#b9c7dd" fontSize="13">0</text><text x="325" y="289" fill="#b9c7dd" fontSize="13">{part===2?'L':'1'}</text><text x="20" y="53" fill="#b9c7dd" fontSize="13">{part===2?'H':'1'}</text>
   <path d={`M45 ${y(u*u)} H${x(u)} V270`} stroke="#65e2ff" strokeDasharray="4 4" fill="none"/>
   <circle cx={x(u)} cy={y(u*u)} r="5" fill="#65e2ff"/>
   {part===1?<>
    <line x1={x(u)} y1={y(u*u)} x2={x(end)} y2={y(end*end)} stroke="#65e2ff" strokeWidth="3" markerEnd="url(#path-actual-tip)"/>
    <line x1={x(u)} y1={y(u*u)} x2={x(end)} y2={y(u*u+p.tangentY)} stroke="#ffd36a" strokeWidth="2" markerEnd="url(#path-tangent-tip)"/>
    <circle cx={x(end)} cy={y(end*end)} r="4" fill="#65e2ff"/>
   </>:<text x="65" y="40" fill="#65e2ff" fontSize="16">{part===2?'r(u) = (Lu, Hu²)':`r(${fmt(u)}) = (${fmt(u)}, ${fmt(u*u)}) m`}</text>}
  </svg>
  <label>道の目盛り u = {fmt(u)}<input aria-label="道の目盛りu" type="range" min="0" max={part===1?1-h:1} step=".01" value={u} onChange={e=>setU(Number(e.target.value))}/></label>
  {part===1?<>
   <label>目盛りの刻み Δu = {fmt(h)}<input aria-label="目盛りの刻み" type="range" min=".01" max=".4" step=".01" value={h} onChange={e=>{const v=Number(e.target.value);setH(v);setU(Math.min(u,1-v));}}/></label>
   <div className="meaning-values"><span>青・実際の移動<br/>({fmt(p.dx)}, {fmt(p.dy)}) m</span><span>金・接線での近似<br/>({fmt(p.dx)}, {fmt(p.tangentY)}) m</span></div>
   <p className="meaning-caption">r′(u)は「uあたりの位置の変化」。その値×Δuが、一歩の近似です。</p>
   <svg viewBox="0 0 380 62" role="img" aria-label="移動は位置の変化率かける刻みで近似する"><text x="190" y="25" textAnchor="middle" fill="#eef4ff" fontSize="20">Δr ≈ r′(u) Δu</text><text x="190" y="51" textAnchor="middle" fill="#b9c7dd" fontSize="14">縦の差 = 1m × (Δu)² = {fmt(p.error)} m</text></svg>
  </>:part===0?<div className="meaning-values"><span>横：u → {fmt(u)} m</span><span>縦：u² → {fmt(u*u)} m</span></div>:<>
   <div className="meaning-values"><span>L・H：横幅・高さ [m]</span><span>r：位置のベクトル</span></div>
   <p className="meaning-caption">Luの微分はL、Hu²の微分は2Hu。成分ごとの変化率を、一組にします。</p>
   <svg viewBox="0 0 380 76" role="img" aria-label="位置を成分ごとに微分し、小さな移動を表す"><text x="190" y="25" textAnchor="middle" fill="#ffd36a" fontSize="20">r′(u) = (L, 2Hu)</text><text x="190" y="57" textAnchor="middle" fill="#eef4ff" fontSize="20">dr = r′(u) du = (L, 2Hu) du</text></svg>
   <p className="meaning-caption">刻みを限りなく小さくして使う表記がdr。有限の移動は、まず「≈」で近似します。</p>
  </>}
  {part===0&&<p className="meaning-caption">0≤u≤1は、始点から終点まで。時間や、道の長さの割合ではありません。</p>}
 </div>;
}
