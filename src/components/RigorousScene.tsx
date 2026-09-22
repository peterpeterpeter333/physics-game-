import {useContext,useEffect,useState,type ReactNode} from 'react';
import {VideoTimeContext} from './figures/anim';
import {electronState,offsetDensity,midpointIntegral} from './rigorous-models';
const C={e:'#57dff8',f:'#c3a2ff',p:'#ffd36a',muted:'#a7b5ce',ink:'#eef4ff',red:'#ff9bab',green:'#92e5bd'};
const text=(x:number,y:number,t:string,color=C.muted,size=15)=><text x={x} y={y} textAnchor="middle" fill={color} fontSize={size}>{t}</text>;
const line=(x:number,y:number,X:number,Y:number,color=C.muted,dash=false)=><line x1={x} y1={y} x2={X} y2={Y} stroke={color} strokeWidth="2" strokeDasharray={dash?'4 4':undefined}/>;
const arr=(x:number,y:number,X:number,Y:number,color=C.e)=>{const dx=X-x,dy=Y-y,a=Math.atan2(dy,dx);if(Math.hypot(dx,dy)<.1)return null;return <g>{line(x,y,X,Y,color)}<path d={`M${X-7*Math.cos(a-.45)},${Y-7*Math.sin(a-.45)} L${X},${Y} L${X-7*Math.cos(a+.45)},${Y-7*Math.sin(a+.45)}`} fill="none" stroke={color} strokeWidth="2"/></g>;};
const circ=(x:number,y:number,r:number,color=C.p)=><circle cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth="2"/>;
const dot=(x:number,y:number,label='+',color=C.p)=><g><circle cx={x} cy={y} r="11" fill="#131b31" stroke={color}/>{text(x,y+5,label,color,15)}</g>;
const many=(n:number,f:(i:number)=>ReactNode)=>Array.from({length:n},(_,i)=><g key={i}>{f(i)}</g>);
const path=(pts:number[][],color=C.p,dash=false)=><polyline points={pts.map(v=>v.join(',')).join(' ')} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={dash?'5 4':undefined}/>;
const frame=(scene:string,beat:number,children:ReactNode,height=300)=><svg viewBox={`0 0 480 ${height}`} className="guided-scene rigorous-scene" role="img" aria-label={`${scene}：説明段階 ${beat+1}`} data-guided-scene={scene} data-beat={beat}>{children}</svg>;

export function FieldLaboratory({scene,beat}:{scene:string;beat:number}){
 const videoTime=useContext(VideoTimeContext);
 const [liveU,setU]=useState([.25,.5,1][Math.min(beat,2)]),[playing,setPlaying]=useState(false);
 const u=videoTime===null?liveU:Math.min(1,videoTime/12);
 useEffect(()=>{setU([.25,.5,1][Math.min(beat,2)]);setPlaying(false);},[scene,beat]);
 useEffect(()=>{if(!playing)return;let id=0,last=0;const tick=(t:number)=>{if(last){const du=Math.min(t-last,80)/7000;setU(v=>Math.min(1,v+du));}last=t;id=requestAnimationFrame(tick);};id=requestAnimationFrame(tick);return()=>cancelAnimationFrame(id);},[playing]);
 useEffect(()=>{if(u>=1)setPlaying(false);},[u]);
 const s=electronState(u),P=(x:number,y:number)=>[55+245*x,290-225*y];const [x,y]=P(s.x,s.y);
 const N=scene==='r-sum'?[4,8,24][beat]:40;
 const pts=Array.from({length:N+1},(_,i)=>P(i/N,(i/N)**2));
 const g=(v:number,w:number)=>[65+340*v,377-112*w];
 const curve=Array.from({length:61},(_,i)=>g(i/60,electronState(i/60).workPerE));
 const upto=Array.from({length:Math.ceil(u*60)+1},(_,i)=>{const v=u*i/Math.max(1,Math.ceil(u*60));return g(v,electronState(v).workPerE);});
 const [gx,gy]=g(u,s.workPerE);
 return <div className="rigorous-lab">
 {frame(scene,beat,<>
  {text(240,22,'電場・移動・力を同じ位置で読む',C.ink,17)}
  {many(36,i=>{const a=(i%6)/5,b=Math.floor(i/6)/5,[X,Y]=P(a,b);return <g opacity=".45">{arr(X,Y,X+22*a,Y-22*b)}</g>;})}
  {arr(55,290,330,290,C.muted)}{arr(55,290,55,42,C.muted)}{text(333,308,'x [m]')}{text(34,43,'y [m]')}
  {text(43,308,'0')}{text(300,308,'1')}{text(40,67,'1')}{path(pts)}
  {scene==='r-sum'&&many(N,i=>{const [X,Y]=pts[i];return <circle cx={X} cy={Y} r="3" fill={C.p}/>;})}
  {scene==='r-compare'&&path([P(0,0),P(1,1)],C.green,true)}
  {arr(x,y,x+45*s.ex,y-45*s.ey,C.e)}{arr(x,y,x+40/Math.hypot(1,s.ty),y-40*s.ty/Math.hypot(1,s.ty),C.p)}{arr(x,y,x+45*s.fx,y-45*s.fy,C.f)}{dot(x,y,'−',C.ink)}
  {text(393,70,'青：電場 E',C.e)}{text(393,98,'金：移動 dr',C.p)}{text(393,126,'紫：力 −eE',C.f)}
  {text(393,165,`u = ${u.toFixed(2)}`,C.ink)}{text(393,192,`x = ${s.x.toFixed(2)} m`)}{text(393,216,`y = ${s.y.toFixed(2)} m`)}
  {text(393,252,'矢印の縮尺は',C.muted,12)}{text(393,271,'量の種類ごとに別',C.muted,12)}
  {text(240,345,'ここまでの仕事 ÷ 電気素量 e',C.ink,16)}
  {arr(65,377,425,377,C.muted)}{arr(65,365,65,510,C.muted)}{text(34,380,'0')}{text(35,491,'−1')}{text(432,381,'u')}{text(98,360,'W / e [V]',C.f,13)}
  {path(curve,C.muted,true)}{path(upto,C.f)}
  {scene==='r-compare'&&path(Array.from({length:61},(_,i)=>g(i/60,electronState(i/60,true).workPerE)),C.green,true)}
  {line(gx,377,gx,gy,C.p,true)}<circle cx={gx} cy={gy} r="5" fill={C.p}/>
  {text(258,535,`W/e = ${s.workPerE.toFixed(4)} V`,C.ink,18)}
  {text(240,560,scene==='r-compare'?'緑破線：直線経路。同じ終点で累積値が一致。':'外力で運ぶ指定経路。電子の自由運動ではありません。',C.muted,13)}
 </>,580)}
 <label className="guided-camera">道に沿う位置 u（図と累積仕事を同時に更新）<input type="range" min="0" max="1" step=".01" value={u} aria-label="電子の位置 u" onChange={e=>{setPlaying(false);setU(Number(e.target.value));}}/></label>
 <button className="btn btn-ghost" onClick={()=>{if(u>=1)setU(0);setPlaying(v=>!v);}}>{playing?'⏸ 移動を止める':'▶ 電子と仕事を追う'}</button>
 <p className="rigorous-readout" aria-live={playing?'off':'polite'}>現在の電場 E=({s.ex.toFixed(2)}, {s.ey.toFixed(2)}) V/m。移動の接線 r′=(1, {s.ty.toFixed(2)}) m。仕事の変化率 (dW/du)/e={s.ratePerE.toFixed(3)} V。図は L=H=1m、α=1 V/m² の場合。</p>
 </div>;
}

function OffsetFigure({scene,beat}:{scene:string;beat:number}){
 const d=scene==='g-outsideproof'?1.5:.5,R=1,scale=68,cx=157,cy=166,oy=cy+d*scale;
 const theta=[.55,1.6,2.65][beat],nx=Math.sin(theta),nz=Math.cos(theta),px=cx+scale*nx,py=cy-scale*nz;
 const rx=px-cx,ry=py-oy,dist=Math.hypot(rx,ry),ex=rx/dist,ey=ry/dist;
 const f=(t:number)=>offsetDensity(t,d,R),q=midpointIntegral(f,0,Math.PI,2000);
 const graph=Array.from({length:101},(_,i)=>{const t=i*Math.PI/100;return [315+135*i/100,220-40*f(t)];});
 return frame(scene,beat,<>
 {text(240,22,d>1?'外部電荷：同じ面積分を評価':'偏心球を固定したまま積分する',C.ink,17)}
 {circ(cx,cy,scale)}<ellipse cx={cx} cy={cy} rx={scale} ry="17" fill="none" stroke={C.p} strokeDasharray="4 4"/>
 {dot(cx,oy,'Q')}{text(cx-22,oy+6,'O',C.p)}<circle cx={cx} cy={cy} r="3" fill={C.muted}/>{text(cx-21,cy,'C')}
 {line(cx,cy,cx,oy,C.muted,true)}{text(cx-14,(cy+oy)/2,'d')}
 {line(cx,cy,px,py,C.p,true)}{text((cx+px)/2+12,(cy+py)/2,'R',C.p)}
 {line(cx,oy,px,py,C.e,true)}{text((cx+px)/2-15,(oy+py)/2,'r',C.e)}
 {arr(px,py,px+35*nx,py-35*nz,C.p)}{arr(px,py,px+35*ex,py+35*ey,C.e)}{dot(px,py,'P',C.ink)}
 {text(370,64,'青 E：Oから',C.e,16)}{text(370,91,'金 n：Cから',C.p,16)}
 {text(382,127,'小片の寄与',C.ink,16)}{arr(315,220,457,220,C.muted)}{arr(315,254,315,144,C.muted)}{path(graph,C.f)}
 <circle cx={315+135*theta/Math.PI} cy={220-40*f(theta)} r="4" fill={C.p}/>
 {text(315,271,'0')}{text(450,271,'π')}{text(382,294,'θ：北→南',C.muted,16)}
 {text(240,328,`d/R=${d.toFixed(1)}　球の断面（3Dの面を集計）`,C.muted,16)}
 {text(240,357,scene==='g-endpoints'||scene==='g-outsideproof'?`数値確認：Φ / (Q/ε₀) ≈ ${q.toFixed(6)}`:'R,dは固定：注目する小片だけを変える',C.green,16)}
 {text(240,384,'曲線：θごとの寄与（φは積分済み・正規化）',C.muted,14)}
 </>,400);
}

export function RigorousScene({scene,beat}:{scene:string;beat:number}){
 if(['r-field','r-sum','r-path','r-calculate','r-compare'].includes(scene))return <FieldLaboratory scene={scene} beat={beat}/>;
 if(['g-offset','g-offsetintegrand','g-substitution','g-antiderivative','g-endpoints','g-outsideproof'].includes(scene))return <OffsetFigure scene={scene} beat={beat}/>;
 const b=beat;let art:ReactNode;
 switch(scene){
 case 'r-map':art=<>{text(125,32,'道に沿う仕事',C.ink,18)}{many(12,i=>{const x=35+(i%4)*53,y=80+Math.floor(i/4)*55;return arr(x,y,x+20,y-12);})}{path([[35,230],[75,200],[120,185],[165,120],[210,77]])}{dot(75+b*45,200-b*40,'−',C.ink)}{text(350,32,'面を通る電気束',C.ink,18)}<polygon points="290,110 389,75 438,175 339,210" fill="#ffd36a15" stroke={C.p}/>{arr(362,147,345,64,C.p)}{many(3,i=>arr(285+i*50,230,315+i*50,75))}{text(120,275,'電荷 × 電場 × 移動',C.p)}{text(355,275,'垂直成分 × 面積',C.p)}</>;break;
 case 'r-dot':{const angle=b===2?.45:1,x=130,y=220,X=x+140*Math.cos(angle),Y=y-140*Math.sin(angle);art=<>{text(240,30,b===0?'移動を水平・鉛直に分ける':b===1?'同じ座標の成分同士を掛ける':'移動方向へ座標をそろえる',C.ink,17)}{arr(x,y,370,160,C.p)}{line(x,y,370,y,C.p,true)}{line(370,y,370,160,C.p,true)}{text(255,246,'dx',C.p)}{text(395,195,'dy',C.p)}{arr(x,y,X,Y)}{line(X,Y,X,y,C.e,true)}{text(X+26,Y,'E',C.e)}{text(260,135,b===2?'E cosθ × ds':'Ex dx ＋ Ey dy',C.ink,18)}{text(240,283,'内積の相手は、電場と小さな移動です。')}</>;break;}
 case 'r-work':art=<>{text(240,30,'仕事と運動エネルギーをつなぐ',C.ink,18)}{dot(100+b*70,155,'−',C.ink)}{arr(100+b*70,155,180+b*70,125,C.p)}{arr(100+b*70,155,65+b*70,175,C.f)}{text(365,108,'移動 dr',C.p)}{text(90,206,'電気力',C.f)}{text(240,250,b===0?'速度の2乗を微分':b===1?'合力 × 移動 ＝ 運動エネルギーの変化':'合力の仕事を、各力の仕事へ分ける',C.ink,15)}</>;break;
 case 'r-power':art=<>{text(240,30,'小区間の増分が、両端の差へつながる',C.ink,16)}{many(5,i=><g><rect x={35+i*85} y={160-i*15} width="72" height={35+i*15} fill={`${C.e}22`} stroke={C.e}/>{text(71+i*85,220,`区間${i+1}`,C.muted,12)}</g>)}{text(240,75,b===0?'(u+h)² を展開':b===1?'(u+h)⁴ を展開':'G1−G0 ＋ G2−G1 ＋ … ＋ G5−G4',C.p,16)}{text(240,265,b===2?'途中の値が消えて G5−G0 が残る':'hで割る → hを0へ近づける',C.ink,17)}</>;break;
 case 'r-voltage':art=<>{text(240,28,'電子を原点から遠ざける',C.ink,17)}{many(5,i=><g>{circ(120,143,20+i*15,C.muted)}{text(328,70+i*34,`半径${i+1}：外ほど低電位`,i===b+1?C.p:C.muted,14)}</g>)}{arr(132,143,233,143,C.e)}{dot(146+b*22,143,'−',C.ink)}{arr(146+b*22,157,113+b*22,157,C.f)}{text(240,260,b===2?'電子：ΔVは負、ΔUは正、電気力の仕事は負':'等電位線：電位が同じ点を結んだ線。電場は低い電位へ向く。',C.p,14)}</>;break;
 case 'r-flux':art=<>{text(240,28,'面は、移動の道ではない',C.ink,18)}<polygon points="110,130 295,85 370,188 185,233" fill="#ffd36a15" stroke={C.p}/>{arr(240,160,220,61,C.p)}{text(206,57,'n',C.p)}{arr(285,250,205+b*24,69,C.e)}{text(340,62,'E',C.e)}{text(240,280,b===0?'面に垂直な成分を取り出す':b===1?'小片の寄与＝E・n × dA':'仕事[J]とは単位も目的も違う',C.ink,16)}</>;break;
 case 'r-patches':art=<>{text(240,28,'曲面の各小片で、別々に内積を取る',C.ink,16)}{many(5,i=>{const x=32+i*90,y=143+18*Math.abs(i-2),a=(i-2)*.2;return <><polygon points={`${x},${y} ${x+62},${y-10} ${x+74},${y+26} ${x+12},${y+36}`} fill={i===b+1?'#ffd36a44':'#ffd36a11'} stroke={C.p}/>{arr(x+38,y+12,x+38+40*Math.sin(a),y+12-40*Math.cos(a),C.p)}{arr(x+10,y+45,x+10,y-30,C.e)}{text(x+37,255,`小片${i+1}`,C.muted,12)}</>;})}{text(240,282,'Ei と ni と ΔAi を、同じ小片で組み合わせる',C.p,14)}</>;break;
 case 'r-area':art=<>{text(240,28,'面の二つの接線が、小片を作る',C.ink,17)}<polygon points="115,224 290,210 366,131 191,145" fill="#ffd36a18" stroke={C.p}/>{arr(115,224,290,210,C.p)}{arr(115,224,191,145,C.f)}{arr(220,180,207,63,C.e)}{text(318,235,'su du',C.p)}{text(124,151,'sv dv',C.f)}{text(265,65,'su × sv',C.e)}{b>0&&<>{line(191,145,191,218,C.muted,true)}{text(252,269,'底辺 × 高さ ＝ |a| |b| sinγ',C.ink,17)}</>}{b===2&&text(350,90,'du dv で積分',C.ink,14)}</>;break;
 case 'r-spherearea':{const th=[.4,1.05,1.6][b],yy=155-88*Math.cos(th),rr=88*Math.sin(th);art=<>{text(240,26,'二つの角度で、球面を一度ずつ覆う',C.ink,16)}{circ(230,155,88)}<ellipse cx="230" cy={yy} rx={rr} ry={rr*.25} fill="#ffd36a14" stroke={C.p}/><ellipse cx="230" cy="155" rx="25" ry="88" fill="none" stroke={C.muted}/>{line(230,155,230+rr,yy,C.e)}{line(230,yy,230+rr,yy,C.p)}{text(367,117,'緯線半径',C.p)}{text(367,144,'R sinθ',C.p)}{text(100,90,'θ：北→南')}{text(368,194,'φ：一周')}{text(240,282,b===2?'∫sinθ dθ = 2、∫dφ = 2π':'小片の面積：R dθ × R sinθ dφ',C.ink,17)}</>;break;}
 case 'r-surfacecalc':art=<>{text(240,26,'正方形を貫く電場は、右ほど強い',C.ink,17)}<rect x="45" y="60" width="210" height="180" fill="#ffd36a10" stroke={C.p}/>{many(16,i=>{const x=70+(i%4)*50,y=85+Math.floor(i/4)*43;return <>{circ(x,y,3+(i%4)*2,C.e)}<circle cx={x} cy={y} r="1.5" fill={C.e}/></>;})}{text(150,265,'u：0 → L',C.p)}{text(277,155,'v',C.p)}{arr(310,226,445,226,C.muted)}{arr(310,226,310,74,C.muted)}<polygon points="310,226 433,226 433,96" fill="#57dff822" stroke={C.e}/>{text(375,253,'u',C.muted)}{text(335,63,'βu',C.e)}{text(371,170,b===0?'場所で変化':b===1?'帯の積分':'帯 × L',C.ink,15)}{text(240,292,'⊙：紙面の手前向き。面上で一定とはしない。',C.muted,13)}</>;break;
 case 'g-contract':art=<>{text(240,27,'同じ電荷を囲む、異なる閉曲面',C.ink,17)}{circ(240,155,74)}<ellipse cx="245" cy="149" rx="175" ry="100" fill="none" stroke={C.f}/><path d="M95 155 Q80 45 230 80 Q330 25 399 120 Q430 245 280 248 Q148 290 95 155Z" fill="none" stroke={C.e}/>{dot(240,167,'Q')}{many(8,i=>{const a=i*Math.PI/4;return arr(240+27*Math.cos(a),167+27*Math.sin(a),240+55*Math.cos(a),167+55*Math.sin(a));})}{text(240,290,b===0?'証明したい：どの面でも合計は Q/ε₀':b===1?'出発点：クーロンの法則＋重ね合わせ':'偏心球の積分 → 任意の面 → 複数電荷',C.p,16)}</>;break;
 case 'g-solidangle':art=<>{text(240,26,'一つの方向の束を、単位球へ写す',C.ink,17)}{dot(55,173,'Q')}{line(55,173,420,71,C.e)}{line(55,173,429,223,C.e)}<polygon points="339,85 392,135 427,220 374,170" fill="#ffd36a22" stroke={C.p}/>{arr(382,155,344,114,C.p)}{text(413,260,'面積 dA',C.p,14)}{b>0&&<><path d="M151 146 A100 100 0 0 1 155 187" fill="none" stroke={C.f} strokeWidth="9"/>{text(150,222,'単位球の dΩ',C.f,14)}</>}{text(270,55,'投影：cosθ倍',C.p,14)}{text(250,283,b===0?'斜めの面を正面に射影':b===1?'距離 r → 1：面積は1/r²倍':'小片ごとに dΦ = kQ dΩ',C.ink,16)}</>;break;
 case 'g-raycount':art=<>{text(240,27,b===1?'外部から：入る−と出る＋が対':'内部から：出る＋が一回多い',C.ink,17)}<path d="M75 70 L155 70 L155 190 L242 190 L242 70 L325 70 L325 242 L75 242Z" fill="#ffd36a13" stroke={C.p}/>{dot(b===1?25:105,138,'Q')}{arr(b===1?38:116,138,446,138,C.e)}{b===1&&text(76,118,'−',C.red,24)}{text(156,118,'＋',C.green,23)}{text(242,118,'−',C.red,24)}{text(325,118,'＋',C.green,23)}{text(240,280,b===1?'−1 ＋1 −1 ＋1 = 0':b===2?'これを三次元の全方向へ積分する':'＋1 −1 ＋1 = 1',C.ink,19)}{text(240,310,'図は断面。囲む立体の外向き法線で符号を決める。',C.muted,12)}</>;return frame(scene,beat,art,330);
 case 'g-superposition':art=<>{text(240,27,'同じ面に対する各電荷の寄与を足す',C.ink,17)}<rect x="63" y="70" width="278" height="167" rx="32" fill="#ffd36a10" stroke={C.p}/>{dot(137,145,'+',C.p)}{dot(253,145,'−',C.f)}{dot(418,145,'+',C.e)}{text(136,185,'＋2Q',C.p)}{text(251,185,'−Q',C.f)}{text(418,185,'外部',C.e)}{text(240,280,b===0?'E = E1 ＋ E2 ＋ E3':b===1?'電気束 = 2Q/ε₀ − Q/ε₀ ＋ 0':'連続分布：Q内 = ∫ρ dV',C.ink,18)}</>;break;
 case 'g-application':art=<>{text(240,27,'証明と、証明済みの法則の応用は別',C.ink,16)}{dot(175,155,'Q')}{circ(b===0?220:175,155,b===0?95:140)}{many(6,i=>{const a=i*Math.PI/3;return arr(175+28*Math.cos(a),155+28*Math.sin(a),175+70*Math.cos(a),155+70*Math.sin(a));})}{dot(315,155,'P',C.ink)}{text(364,194,'Pの電場は固定',C.e,13)}{text(240,282,b===0?'どんな面でも成立する、と証明した':b===1?'Pを通り、他の点も同じ強さの面を選ぶ':'対称性がなければ、各点の場は法則一つでは決まらない',C.p,14)}</>;break;
 default:throw new Error(`Unknown rigorous scene: ${scene}`);
 }
 return frame(scene,beat,art);
}
