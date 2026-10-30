import {useEffect,useRef,useState} from 'react';
import {add,mul,dot,unit,norm,spherePoint,project,electricAt,sphereFlux,torusCrossings,type V3,type Scene3D} from './em3d-model';
import './em-scene-3d.css';
const C={field:'#68dfff',normal:'#ffd36a',surface:'#809bd7',charge:'#ffa77c',other:'#c89bff',ink:'#e6eeff'};
type Item={points:V3[];color:string;fill?:string;width?:number;label?:string;arrow?:boolean;dash?:boolean};
const circle=(r:number,z=0,c:V3=[0,0,0])=>Array.from({length:49},(_,i)=>add(c,[r*Math.cos(i*Math.PI/24),r*Math.sin(i*Math.PI/24),z] as V3));
const titles:Record<Scene3D,string>={plane:'面・電場・法線を別々の方向から見る',square:'正方形の場所ごとに違う垂直成分', 'sphere-area':'球面の緯線・経線・小面積',sphere:'点電荷を囲む仮想の球',offset:'電場は電荷から、法線は球の中心から',outside:'外部電荷：入る束と出る束', 'solid-angle':'小片が電荷から見える方向の広がり',crossings:'閉曲面での出入りを、立体で数える',superposition:'内部電荷の寄与だけが正味の束に残る',wire:'無限直線電荷を囲む円筒',shell:'一様に帯電した球殻と内部のガウス面',conductor:'導体内部で、二つの電場が打ち消す'};

export function EMScene3D({scene,phase,videoTime}:{scene:Scene3D;phase:number;videoTime?:number}){
 const [liveYaw,setYaw]=useState(-.55),[pitch,setPitch]=useState(.4),[playing,setPlaying]=useState(()=>typeof window!=='undefined'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const yaw=videoTime===undefined?liveYaw:-.55+.22*Math.sin(videoTime*.25);
 const [parameter,setParameter]=useState(scene==='outside'?1.5:scene==='offset'?.5:scene==='sphere-area'?1:scene==='sphere'?1:scene==='solid-angle'?1.6:35);
 const [theta,setTheta]=useState(scene==='outside'?2.65:1.01),[phi,setPhi]=useState(.7),[torus,setTorus]=useState(phase===1||phase===2);
 const [angleChange,setAngleChange]=useState(.1);
 const [triangleOnly,setTriangleOnly]=useState(false);
 const drag=useRef<{x:number;y:number}|null>(null);
 useEffect(()=>{if(!playing)return;let frame=0,last=0;const tick=(t:number)=>{if(last&&t-last>=35){setYaw(v=>v+.008);last=t;}else if(!last)last=t;frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[playing]);
 const items:Item[]=[];
 const line=(points:V3[],color=C.surface,width=1,fill?:string,dash=false)=>items.push({points,color,width,fill,dash});
 const arrow=(a:V3,v:V3,color:string,label?:string)=>items.push({points:[a,add(a,v)],color,width:2.5,arrow:true,label});
 const mark=(p:V3,label:string,color=C.charge)=>items.push({points:[p],color,label});
 const sphere=(center:V3,R:number,color=C.surface)=>{for(let j=1;j<9;j++)line(circle(R*Math.sin(j*Math.PI/9),R*Math.cos(j*Math.PI/9),center),color);for(let j=0;j<10;j++)line(Array.from({length:49},(_,i)=>add(center,spherePoint(i*Math.PI/24,j*Math.PI/5,R))),color);};
 const axes=(origin:V3=[0,0,0],scale=1.35)=>{arrow(origin,[scale,0,0],'#758399','x');arrow(origin,[0,scale,0],'#758399','y');arrow(origin,[0,0,scale],'#758399','z');};
 let caption='',readout='',legend='青：電場 E　金：面の法線 n',slider:{label:string;min:number;max:number;step:number}|undefined;
 if(scene==='plane'){
  const angle=parameter*Math.PI/180,n:V3=[Math.sin(angle),0,Math.cos(angle)],a:V3=[Math.cos(angle),0,-Math.sin(angle)],b:V3=[0,1,0];
  const P=(u:number,v:number)=>add(mul(a,u),mul(b,v));
  line([P(-1,-1),P(1,-1),P(1,1),P(-1,1),P(-1,-1)],C.normal,2,'#ffd36a16');
  for(let k=-.5;k<1;k+=.5){line([P(k,-1),P(k,1)]);line([P(-1,k),P(1,k)]);}
  for(const u of [-.65,0,.65])for(const v of [-.65,.65])arrow(add(P(u,v),[0,0,-.7]),[0,0,1.4],C.field);
  arrow([0,0,0],mul(n,.85),C.normal,'n');arrow([0,0,0],[0,0,.9],C.field,'E');
  caption='電場は上向きに固定。金の面を傾けても電場の向きは変わりません。';
  readout=`角度 θ=${parameter}° ／ 垂直成分 E cosθ = ${(Math.cos(angle)).toFixed(2)} E`;
  slider={label:'面の傾き θ [度]',min:0,max:90,step:1};
 }else if(scene==='square'){
  axes([-.65,-.65,0],1.5);const p=(x:number,y:number):V3=>[x-.65,y-.65,0];
  line([p(0,0),p(1.3,0),p(1.3,1.3),p(0,1.3),p(0,0)],C.normal,2,'#ffd36a16');
  for(let i=0;i<=4;i++){const a=i*1.3/4;line([p(a,0),p(a,1.3)]);line([p(0,a),p(1.3,a)]);}
  for(let i=1;i<5;i++)for(let j=0;j<4;j++)arrow(p(i*.26,(j+.5)*.325),[0,0,i*.22],C.field);
  const a=.325*(phase===0?0:phase===1?1:2),w=phase===0?.325:1.3;
  line([p(0,a),p(w,a),p(w,a+.325),p(0,a+.325),p(0,a)],C.normal,2,'#ffd36a50');
  arrow(p(0,1.3),[0,0,.6],C.normal,'n');caption='面はz=0。電場E=β(z,0,x)のうち、上向きのβxだけが貫きます。';
  readout=phase===0?'金：小片 dx dy':phase===1?'金：x方向に集める帯':'帯をy方向にも並べ、面全体を足す';
 }else if(scene==='sphere-area'){
  sphere([0,0,0],1);const t=parameter,dt=angleChange,dp=.3;
  line(circle(Math.sin(t),Math.cos(t)),C.normal,2.5);line([[0,0,Math.cos(t)],spherePoint(t,phi)],C.normal,3);
  line([[0,0,0],[0,0,1.3]],'#8b99b2');line([[0,0,0],spherePoint(t,phi)],C.field,2);
  const patch=[spherePoint(t,phi),spherePoint(t+dt,phi),spherePoint(t+dt,phi+dp),spherePoint(t,phi+dp),spherePoint(t,phi)];line(patch,C.normal,2,'#ffd36a80');
  const arc=Array.from({length:33},(_,i)=>spherePoint(t+dt*i/32,phi));
  line(arc,C.field,5);line([[0,0,0],spherePoint(t+dt,phi)],C.field,2);
  line(Array.from({length:33},(_,i)=>spherePoint(t*i/32,phi,.28)),C.other,2);
  mark(spherePoint(t*.5,phi,.34),'θ',C.other);
  if(phase===0){
   line(Array.from({length:65},(_,i)=>spherePoint(i*Math.PI/32,phi)),C.field,1);
   mark(spherePoint(t+dt*.5,phi,1.12),'Δs',C.field);
   mark(spherePoint(t+dt*.5,phi,.65),'Δθ',C.field);
   caption='青い太線が求める長さ。球を突っ切る直線ではなく、半径Rの円に沿う道です。図の例はR＝2 m。';
   readout=`Δs = 2 m × ${dt.toFixed(2)} = ${(2*dt).toFixed(2)} m（Δθ = ${dt.toFixed(2)} rad ≈ ${(dt*180/Math.PI).toFixed(1)}°）`;
   legend='青：二本の半径と、その間の円弧　紫：位置を指定する角度θ';
  }else{
   line([[0,0,0],[0,0,Math.cos(t)],spherePoint(t,phi)],C.normal,3);
   mark(mul(spherePoint(t,phi),.55),'R',C.field);
   mark([Math.sin(t)*Math.cos(phi)*.5,Math.sin(t)*Math.sin(phi)*.5,Math.cos(t)],'ρ',C.normal);
   caption=phase===1?'金の三角形で、斜辺Rに対する横の辺がρ。sinθ＝ρ/Rなので、横向きの輪の半径はρ＝Rsinθです。':'金の囲みは表面を区切った一つ分。青が縦の長さ。区切りを小さくすると、縦×横で面積を近似できます。';
   readout=`θ=${t.toFixed(2)} rad ／ 横向きの輪の半径 ρ=${Math.sin(t).toFixed(2)} R`;
   legend='青：球の半径と縦の円弧　金：横向きの輪、その半径ρ、面の囲み';
  }
  mark([0,0,1.22],'北極',C.ink);slider={label:'上向きの軸から測る位置の角度 θ [rad]',min:.12,max:2.75,step:.01};
 }else if(['sphere','offset','outside'].includes(scene)){
  const R=scene==='sphere'?parameter:1,d=scene==='sphere'?0:parameter,center:V3=[0,0,d];sphere(center,R);mark([0,0,0],d===0?'+Q（球中心）':'+Q');if(d!==0)mark(center,'C','#e8d990');
  for(let j=0;j<12;j++){const n=spherePoint(Math.acos(1-2*(j+.5)/12),j*2.4),p=add(center,mul(n,R));const E=electricAt(p);arrow(p,mul(unit(E),Math.min(.58,.3*norm(E))),C.field);}
  const n=spherePoint(theta,phi),p=add(center,mul(n,R)),E=electricAt(p);
  line([[0,0,0],p],C.field,1,undefined,true);line([center,p],C.normal,1,undefined,true);
  arrow(p,mul(n,.62),C.normal,'n');arrow(p,mul(unit(E),.8),C.field,'E');mark(p,'小片',C.ink);
  const flux=sphereFlux(d,R);caption='青は電荷からの電場、金は球中心からの外向き法線。球は計算用の仮想面です。';
  readout=flux===null?'電荷が面上：この教材の積分の適用範囲外':`正味の束 Φ/(Q/ε₀)=${flux} ／ 注目点の E·n ${dot(E,n)>=0?'≥ 0（外へ）':'< 0（中へ）'}`;
  slider=scene==='sphere'?{label:'球の半径 R（相対値）',min:.65,max:1.35,step:.05}:{label:'中心のずれ d/R',min:0,max:1.6,step:.05};
 }else if(scene==='solid-angle'){
  const q:V3=[-.9,0,0],D=parameter,p:V3=[D-.9,0,0];sphere(q,1,'#625780');mark(q,'+Q');
  const corners:V3[]=[add(p,[0,-.45,-.45]),add(p,[0,.45,-.45]),add(p,[0,.45,.45]),add(p,[0,-.45,.45])];
  line([...corners,corners[0]],C.normal,2,'#ffd36a35');corners.forEach(v=>line([q,v],C.field,1));
  const small=corners.map(v=>add(q,unit(add(v,mul(q,-1)))));line([...small,small[0]],C.other,2,'#c89bff40');
  arrow(p,[.55,0,0],C.normal,'n');line([q,p],'#99aac4',1,undefined,true);
  caption='電荷から小片へ伸ばした方向を、単位球へ写します。紫の囲みは、その方向の広がりです。';
  readout=`小片の面積を固定して距離 r=${D.toFixed(2)} を変更 ／ 遠いほど見える広がりは小さい`;
  legend='金：小さな面　紫：半径1の球に写した範囲（模式図）';slider={label:'電荷から小片までの距離（相対値）',min:1.15,max:2.4,step:.05};
 }else if(scene==='crossings'){
  if(torus){for(let j=0;j<18;j++){const a=j*Math.PI/9;line(Array.from({length:33},(_,i)=>{const b=i*Math.PI/16;return [(1+.36*Math.cos(b))*Math.cos(a),(1+.36*Math.cos(b))*Math.sin(a),.36*Math.sin(b)] as V3;}));}
   for(let j=0;j<10;j++){const b=j*Math.PI/5;line(Array.from({length:65},(_,i)=>{const a=i*Math.PI/32;return [(1+.36*Math.cos(b))*Math.cos(a),(1+.36*Math.cos(b))*Math.sin(a),.36*Math.sin(b)] as V3;}));}
   const origin:V3=[1,0,0],direction:V3=[-1,0,.04];mark(origin,'+Q');arrow(origin,mul(unit(direction),2.7),C.field);
   torusCrossings(origin,direction).forEach((c,i)=>mark(c.point,`${i+1}: ${c.sign>0?'出＋':'入−'}`,c.sign>0?C.normal:C.other));
   caption='穴のある閉曲面を例に、一方向の出入りを追います。電荷は輪の管の内部にあり、中央の穴にはありません。';readout='出る＋1 → 入る−1 → 出る＋1 = 正味＋1';
  }else{sphere([0,0,0],1);mark([0,0,0],'+Q');for(let i=0;i<14;i++)arrow([0,0,0],mul(spherePoint(.3+i*.2,i*2.4),1.3),C.field);caption='凸な球面では、内部の電荷からどの方向へ進んでも出口が一つです。';readout='全方向を合わせると、単位球一個分の立体角4π';}
  legend='青：電荷から伸ばした方向　金：出口　紫：入口';
 }else if(scene==='superposition'){
  sphere([0,0,0],1);mark([-.4,0,0],'+2Q');mark([.35,.2,.25],'−Q',C.other);mark([1.6,0,.4],'+Q（外）');
  for(let i=0;i<14;i++){const p=spherePoint(.25+i*.2,i*2.4),E=add(add(mul(electricAt(p,[-.4,0,0]),2),mul(electricAt(p,[.35,.2,.25]),-1)),electricAt(p,[1.6,0,.4]));arrow(p,mul(unit(E),.42),C.field);}
  caption='青は3個の電荷が作る電場の合計。外部電荷も各点の電場には寄与します。';readout='内部：2Q−Q=Q ／ 外部電荷の正味の束は0 ／ Φ=Q/ε₀';
 }else if(scene==='wire'){
  line([[0,0,-1.7],[0,0,1.7]],C.other,4);line(circle(.85,-.9),C.normal,2);line(circle(.85,.9),C.normal,2);
  for(let i=0;i<12;i++){const a=i*Math.PI/6,p:V3=[.85*Math.cos(a),.85*Math.sin(a),0];line([add(p,[0,0,-.9]),add(p,[0,0,.9])]);arrow(p,mul(unit(p),.55),C.field);}
  arrow([.3,0,.9],[0,0,.6],C.normal,'n（ふた）');arrow([.3,0,.9],[.65,0,0],C.field,'E');arrow([.85,0,-.45],[.6,0,0],C.normal,'n（側面）');
  caption='紫は無限直線電荷の一部分。青の電場は線から真横へ向きます。';readout='側面：Eとnが平行 ／ ふた：Eとnが直角で寄与0';
 }else if(scene==='shell'){
  sphere([0,0,0],1.15,C.other);sphere([0,0,0],.62,C.normal);for(let i=0;i<16;i++)mark(spherePoint(.25+i*.17,i*2.4,1.15),'+',C.other);
  caption='紫は一様に帯電した実際の球殻。金は内部の計算用の球面で、電荷はありません。';readout='外部電場なし・球対称性あり：内部の各点で E=0';legend='紫：帯電した球殻　金：内部のガウス面';
 }else if(scene==='conductor'){
  const a=.75;for(const z of [-a,a])line([[-a,-a,z],[a,-a,z],[a,a,z],[-a,a,z],[-a,-a,z]],C.normal,1.5,'#ffd36a0b');for(const x of [-a,a])for(const y of [-a,a])line([[x,y,-a],[x,y,a]],C.normal);
  for(const y of [-.5,0,.5])for(const z of [-.5,.5]){mark([-a,y,z],'−',C.other);mark([a,y,z],'+');}
  arrow([-.55,0,0],[1.1,0,0],C.field,'E外');arrow([.55,0,.16],[-1.1,0,0],C.other,'E再配置');
  caption='導体材料内部の模式図。自由電荷の再配置が作る場は、外の場と逆向きになります。';readout='静電平衡：E外 ＋ E再配置 = 0（材料内部）';legend='青：外の場　紫：再配置した電荷の場';
 }
 const offsetView=['offset','outside'].includes(scene);
 if(scene==='sphere-area'&&triangleOnly){
  items.length=0;
  const t=parameter,p=spherePoint(t,phi),z:V3=[0,0,Math.cos(t)];
  line([[0,0,0],z,p,[0,0,0]],C.normal,3);
  mark(mul(p,.55),'R',C.field);mark(mul(add(p,z),.5),'R sinθ',C.normal);
  line(Array.from({length:25},(_,i)=>spherePoint(t*i/24,phi,.25)),C.other,2);
  mark(spherePoint(t/2,phi,.35),'θ',C.other);
  caption='球を隠して同じ直角三角形だけを見る。斜辺はR、軸から表面までの横の辺はR sinθ。';
 }
 const ordered=items.map((item,i)=>({item,i,points:item.points.map(p=>{const q=project(offsetView?add(p,[0,0,-parameter*.5]):p,yaw,pitch);return offsetView?[240+(q[0]-240)*.76,175+(q[1]-175)*.76,q[2]] as V3:q;})})).sort((a,b)=>a.points.reduce((s,p)=>s+p[2],0)/a.points.length-b.points.reduce((s,p)=>s+p[2],0)/b.points.length);
 return <div className="em3d" data-scene-3d={scene}>
  <h3>{scene==='sphere-area'?'球の表面に沿う長さと面積':titles[scene]}</h3><p className="em3d-caption">{caption}</p>
  {offsetView&&<p className="em3d-readout" role="status">{Math.abs(parameter-1)<1e-8?'現在d/R=1：電荷が面上にあり、本文の通常の面積分の対象外です。':parameter<1?'現在は電荷が球内（d<R）。本文の内部電荷の証明と同じ条件です。':'現在は電荷が球外（d>R）。内部電荷の場合の計算式は使わず、外部電荷の証明と比較します。'} 面を操作しても、電荷が作る電場そのものを変更したわけではありません。</p>}
  {scene==='sphere-area'&&<button className="btn btn-ghost" onClick={()=>{setPlaying(false);setTriangleOnly(v=>!v);}}>{triangleOnly?'同じ三角形を球の中へ戻す':'球を隠して三角形だけを見る'}</button>}
  <svg viewBox="0 0 480 350" role="img" aria-label={`回転できる3次元図：${scene==='sphere-area'?'球の表面に沿う長さと面積':titles[scene]}`} onPointerDown={e=>{setPlaying(false);drag.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(!drag.current)return;setYaw(v=>v+(e.clientX-drag.current!.x)*.01);setPitch(v=>Math.max(-1.3,Math.min(1.3,v+(e.clientY-drag.current!.y)*.008)));drag.current={x:e.clientX,y:e.clientY};}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
   {ordered.map(({item,points,i})=>{const p=points[0],end=points[points.length-1];if(points.length===1)return <g key={i}><circle cx={p[0]} cy={p[1]} r="5" fill={item.color}/><text x={p[0]+8} y={p[1]-7} fill={item.color} fontSize="12" paintOrder="stroke" stroke="#0e1729" strokeWidth="3">{item.label}</text></g>;
    const d=`M${points.map(p=>`${p[0]},${p[1]}`).join(' L')}`,a=Math.atan2(end[1]-p[1],end[0]-p[0]);
    return <g key={i}><path d={d} fill={item.fill??'none'} stroke={item.color} strokeWidth={item.width} strokeDasharray={item.dash?'4 4':undefined} opacity={item.color===C.surface?.48:1}/>{item.arrow&&<path d={`M${end[0]-9*Math.cos(a-.45)},${end[1]-9*Math.sin(a-.45)} L${end[0]},${end[1]} L${end[0]-9*Math.cos(a+.45)},${end[1]-9*Math.sin(a+.45)}`} fill="none" stroke={item.color} strokeWidth="2.5"/>}{item.label&&<text x={end[0]+5} y={end[1]-5} fill={item.color} fontSize="12" paintOrder="stroke" stroke="#0e1729" strokeWidth="3">{item.label}</text>}</g>;
   })}
   {videoTime!==undefined&&<text x="15" y="338" fill={C.ink} fontSize="10">{legend}</text>}
  </svg>
  <p className="em3d-legend">{legend}</p><p className="em3d-readout" aria-live="polite">{readout}</p>
  <div className="em3d-buttons"><button onClick={()=>setPlaying(p=>!p)}>{playing?'Ⅱ 視点の回転を停止':'▶ 視点を自動回転'}</button><button onClick={()=>{setPlaying(false);setYaw(-.55);setPitch(.4);}}>視点を戻す</button></div>
  <label>視点：横回転<input aria-label="3D視点の横回転" type="range" min={-Math.PI} max={Math.PI} step=".01" value={Math.atan2(Math.sin(yaw),Math.cos(yaw))} onChange={e=>{setPlaying(false);setYaw(Number(e.target.value));}}/></label>
  <label>視点：上下<input aria-label="3D視点の上下" type="range" min="-1.3" max="1.3" step=".01" value={pitch} onChange={e=>{setPlaying(false);setPitch(Number(e.target.value));}}/></label>
  {slider&&<label className="em3d-physical">条件：{slider.label}<input aria-label={slider.label} type="range" min={slider.min} max={slider.max} step={slider.step} value={parameter} onChange={e=>{setPlaying(false);setParameter(Number(e.target.value));}}/></label>}
  {['offset','outside'].includes(scene)&&<label>注目する小片の位置 θ<input aria-label="球面上の小片の位置" type="range" min=".05" max="3.09" step=".02" value={theta} onChange={e=>{setPlaying(false);setTheta(Number(e.target.value));}}/></label>}
  {scene==='sphere-area'&&<>
   <label>二点間の角度の変化 Δθ = {angleChange.toFixed(2)} rad<input aria-label="二点間の角度の変化" type="range" min=".02" max=".3" step=".01" value={angleChange} onChange={e=>{setPlaying(false);setAngleChange(Number(e.target.value));}}/></label>
   <label>軸の周りの位置の角度 φ<input aria-label="軸の周りの角度" type="range" min="0" max="5.9" step=".05" value={phi} onChange={e=>{setPlaying(false);setPhi(Number(e.target.value));}}/></label>
   <details><summary>図の言葉・記号を確認する</summary><p>弧：円周の一部分。Δ（デルタ）：二点間の変化。θ・φ：場所を指定する角度。dθ・dφ：それぞれの角度の微小な変化。</p><p>緯線：地球儀で同じ緯度を結ぶ輪。この図では同じ高さの輪です。大円：球の中心を通る平面で切った円。小片：表面を細かく分けた一つ分のことで、特別な物理量の名前ではありません。</p><p>図の囲みは見える大きさで描いています。微小な面積dAそのものを実寸で描いたものではありません。</p></details>
  </>}
  {scene==='crossings'&&<button onClick={()=>{setPlaying(false);setTorus(v=>!v);}}>{torus?'凸な球面と比較':'穴のある閉曲面と比較'}</button>}
  <small>自動回転・ドラッグは視点だけを変えます。電荷の運動ではありません。矢印の長さは見やすさのため調整しています。</small>
 </div>;
}
