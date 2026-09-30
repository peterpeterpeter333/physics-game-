// YouTube シリーズ「マクスウェル方程式・中級 2/2」(ys-um-ac-maxwell-2) — 図。Stage 1200×515.
// 色（1/2 と共通）：電流 I 緑、電圧 V・起電力 ℰ 紫、電荷 q・Q 桃、容量 C 黄、時間 t・周期 T 金、位相差 橙、𝐄 水色、𝐁 橙、d𝐀・d𝐫 金、束 Φ 黄、誤り 赤。
// グラフ：u＝t/T。I＝sin 2πu（緑）、コンデンサの V∝q＝−cos 2πu（紫／桃）。I の山 u＝1/4、V の山 u＝1/2 → V が T/4 遅れ。
// 4本の表：①∯𝐄·d𝐀＝Q/ε₀ ②∯𝐁·d𝐀＝0 ③ℰ＝∮𝐄·d𝐫＝−dΦ_B/dt ④∮𝐁·d𝐫＝μ₀I＋μ₀ε₀dΦ_E/dt。
// 板のすき間：板の間の 𝐄 は ＋の板 → −の板（左 → 右）。I＞0 で ＋の板（左）へ電荷が入る。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,texWidth} from './anim.mjs';
import {IC,VC,TC,PH,cs,card,P,TAU} from './yt1-ui-ac-waves-1-diagrams.mjs';
import {T,L,tI,tI0,tV,tV0,tt,tT,tq,tC,Isin,QC,CC,HI,BAD,circuit,panel,tgrid,curve,sI,cV,stack,TOP,BOT,AMP,XU,X0} from './yt1-um-ac-maxwell-1-diagrams.mjs';
import {OI} from './yt1-um-gauss-sphere-preview-1-diagrams.mjs';

const K='um-ac-maxwell-2:';
const EC=C.x,BC=C.E,DC=C.t,PHI=C.hi;
const vE=cs(EC,'\\mathbf{E}'),vB=cs(BC,'\\mathbf{B}'),dA=cs(DC,'d\\mathbf{A}'),dr=cs(DC,'d\\mathbf{r}'),QQ=cs(QC,'Q'),EMF=cs(VC,'\\mathcal{E}');
const PB=cs(PHI,'\\Phi_B'),PE=cs(PHI,'\\Phi_E'),eps='\\varepsilon_0',mu='\\mu_0';
const OS=OI.replace('_S','');
const U=s=>`\\,\\mathrm{${s}}`;
const mcos=u=>-Math.cos(TAU*u);
const dq=`\\dfrac{d${tq}}{d${tt}}`;

// ---- 4 laws table ----------------------------------------------------------------------------------
const ROWS=[
 {name:'① 電場のガウス',kind:'閉じた面',src:'ガウスの法則の回',col:EC,eq:`${OS}${vE}\\cdot${dA}=\\dfrac{${QQ}}{${eps}}`},
 {name:'② 磁場のガウス',kind:'閉じた面',src:'新しい式',col:BC,eq:`${OS}${vB}\\cdot${dA}=0`},
 {name:'③ ファラデー',kind:'閉じた道',src:'電磁誘導の回',col:EC,eq:`${EMF}=\\oint${vE}\\cdot${dr}=-\\dfrac{d${PB}}{d${tt}}`},
 {name:'④ アンペール・マクスウェル',kind:'閉じた道',src:'アンペールの回＋新しい項',col:BC,eq:`\\oint${vB}\\cdot${dr}=${mu}${tI}+${mu}${eps}\\dfrac{d${PE}}{d${tt}}`},
];
const RY=i=>22+i*104;
function row(i,{g=1,hi=0,eq=null,dim=0}={}){
 const r=ROWS[i],y=RY(i);
 let s=rect(30,y,1140,94,{fill:'#131f38',fo:.96,stroke:hi?HI:C.faint,sw:hi?3:2,rx:12});
 s+=label(r.name,50,y+40,{size:i===3?23:26,color:r.col,weight:700})+label(r.kind+'｜'+r.src,50,y+78,{size:22,color:r.src.includes('新しい')?HI:C.dim});
 s+=T(eq??r.eq,800,y+56,{size:i===3?38:40});
 return fade(g*(dim?.35:1),s);
}
function table(n,{hiRow=-1,g=1,gs=null,eq3=null,dimOthers=0}={}){
 let s='';for(let i=0;i<n;i++)s+=row(i,{g:(gs?gs[i]:1)*g,hi:i===hiRow,dim:dimOthers&&i!==hiRow,eq:i===3&&eq3?eq3:null});return s;
}
// capacitor gap close-up: wire from left to plate at x=500, plate at x=700, wire to right
function gapFig(p,{g=1,x1=500,x2=680,cy=250,h=240,eAmp=1}={}){
 const ph=TAU*(p+.125),I=Math.cos(ph),q=Math.sin(ph);
 let s=line(60,cy,x1,cy,{color:C.dim,w:5})+line(x2,cy,1140,cy,{color:C.dim,w:5});
 s+=line(x1,cy-h/2,x1,cy+h/2,{color:C.ink,w:8})+line(x2,cy-h/2,x2,cy+h/2,{color:C.ink,w:8});
 // current arrows in the wires (rightward when I>0)
 if(Math.abs(I)>.05){const L0=90*I;s+=arrow(240-L0/2,cy-28,240+L0/2,cy-28,{color:IC,w:6,head:16})+arrow(920-L0/2,cy-28,920+L0/2,cy-28,{color:IC,w:6,head:16});}
 s+=label('I',240,cy-56,{size:28,color:IC,anchor:'middle',weight:700})+label('I',920,cy-56,{size:28,color:IC,anchor:'middle',weight:700});
 // plate charges
 const sg=q>=0?1:-1;s+=label(sg>0?'＋':'−',x1-26,cy-h/2+6,{size:30,color:QC,anchor:'middle',weight:700})+label(sg>0?'−':'＋',x2+26,cy-h/2+6,{size:30,color:QC,anchor:'middle',weight:700});
 // E arrows in the gap, length ∝ q
 for(let k=0;k<5;k++){const y=cy-h/2+24+k*(h-48)/4,Lx=(x2-x1-50)*Math.abs(q)*eAmp,xm=(x1+x2)/2;if(Lx>8)s+=q>0?arrow(xm-Lx/2,y,xm+Lx/2,y,{color:EC,w:4,head:12}):arrow(xm+Lx/2,y,xm-Lx/2,y,{color:EC,w:4,head:12});}
 s+=label('𝐄',(x1+x2)/2,cy+h/2+36,{size:30,color:EC,anchor:'middle',weight:700});
 return fade(g,s);
}

export const ytUmAcMaxwell2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=fade(.5,stack({grid:1}));
  s+=card(830,80,340,330,L('コイル',1000,130,{size:28,weight:700})+T(`${tV}=L\\,\\dfrac{d${tI}}{d${tt}}`,1000,200,{size:36})
   +fade(seg(p,.3,.45),L('振幅の比 ωL',1000,285,{size:28,color:HI,weight:700}))+fade(seg(p,.55,.7),L('電圧が π/2 進む',1000,350,{size:28,color:PH,weight:700})),seg(p,.02,.15),VC);
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=fade(.3,circuit({el:'cap',I:.8}));
  s+=card(230,90,740,330,L('前回の 最後の問い',600,145,{color:C.dim})+T(`${tV}=\\dfrac{${tq}}{${tC}}`,600,225,{size:44})
   +L('電流 → 電荷：積分で 戻ると',600,305,{size:30})+L('振幅と 位相は どうなる？',600,370,{size:34,color:HI,weight:700}),seg(p,0,.15),HI);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(150,70,900,170,L('① コンデンサ',300,165,{size:32,color:QC,weight:700,anchor:'start'})+L('積分で 振幅と 位相',640,165,{size:30,anchor:'start'}),seg(p,.02,.18),QC);
  s+=card(150,280,900,170,L('② 中級の 電磁気の 法則',210,375,{size:30,weight:700,anchor:'start'})+L('→ 4本の 式に まとめる',640,375,{size:30,color:HI,weight:700,anchor:'start'}),seg(p,.35,.5),HI);
  return s;
 },

 // ===== S2 電流を積分して電荷を出す =====
 [K+'setup']:(p)=>{
  let s=circuit({el:'cap',I:.9*Math.cos(TAU*2*p)});
  s+=label('＋q',518,246,{size:28,color:QC,weight:700})+label('−q',518,300,{size:28,color:QC,weight:700});
  s+=card(680,80,480,160,T(`${tI}=${Isin}`,920,165,{size:48}),seg(p,.05,.2),IC);
  s+=card(680,280,480,150,L('I ＞ 0 のとき',920,330,{size:26,color:IC})+L('＋の板へ 電荷が 入る',920,385,{size:30,color:QC,weight:700}),seg(p,.45,.6),QC);
  return s;
 },
 [K+'def']:(p)=>{
  let s=T(`${tI}=${dq}`,600,190,{size:84});
  s+=fade(seg(p,.1,.25),L('電流 ＝ 板の 電荷の 増える速さ',600,330,{size:32,weight:700}));
  s+=fade(seg(p,.5,.65),L('（電流の 定義）',600,395,{size:28,color:C.dim}));
  return s;
 },
 [K+'inverse']:(p)=>{
  let s=T(`\\dfrac{d${tq}}{d${tt}}=${Isin}`,600,120,{size:54});
  s+=fade(seg(p,.1,.25),L('微分すると I₀ sin ωt になる 関数 q は？',600,215,{size:28}));
  s+=fade(seg(p,.5,.65),T(`${tq}=\\int ${tI0}\\sin\\omega ${tt}\\,d${tt}`,600,345,{size:60}));
  s+=fade(seg(p,.6,.75),L('電流を 時間で 積分',600,460,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'try']:(p)=>{
  let s=T(`\\dfrac{d}{d${tt}}\\cos\\omega ${tt}=-\\omega\\sin\\omega ${tt}`,600,110,{size:48});
  s+=fade(seg(p,.1,.25),L('→ −cos を 試す',600,195,{size:28,color:C.dim}));
  const f=`\\dfrac{d}{d${tt}}\\big(-\\cos\\omega ${tt}\\big)=\\sin\\omega ${tt}\\times ${cs(HI,'\\omega')}`;
  s+=fade(seg(p,.45,.6),T(f,600,320,{size:56}));
  const w=texWidth(f,56,false);
  s+=fade(seg(p,.6,.75),L('中身の 倍率 ω',600+w/2-40,430,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'divide']:(p)=>{
  const X=`{\\color{${BAD}}\\cancel{\\omega}}`;
  let s=T(`${tq}=-\\dfrac{${tI0}}{\\omega}\\cos\\omega ${tt}`,600,110,{size:56});
  s+=fade(seg(p,.1,.25),L('ω で 割っておく',600,210,{size:26,color:C.dim}));
  s+=fade(seg(p,.4,.55),T(`\\dfrac{d${tq}}{d${tt}}=-\\dfrac{${tI0}}{${X}}\\times\\big(-${X}\\sin\\omega ${tt}\\big)=${Isin}`,600,340,{size:52}));
  s+=fade(seg(p,.7,.85),L('✓ 元の 電流に 戻る',600,460,{size:30,color:IC,weight:700}));
  return s;
 },
 [K+'const']:(p)=>{
  let s=T(`${tq}=-\\dfrac{${tI0}}{\\omega}\\cos\\omega ${tt}\\ +`,540,80,{size:44})+L('定数',800,92,{size:34,color:HI,weight:700});
  const cy=300,amp=90;
  s+=panel(cy,{amp:amp+30,name:'q',col:QC})+curve(cy,mcos,{amp,color:QC,to:1.15});
  s+=fade(seg(p,.1,.25),curve(cy,u=>mcos(u)+.35,{amp,color:QC,to:1.15,w:3,dash:'10 8'})+label('定数を 足した 形',XU(.5)+10,cy-amp*1.35-16,{size:24,color:C.dim}));
  s+=card(830,170,340,250,L('一定の 電荷の',1000,225,{size:26})+L('上乗せ なし',1000,275,{size:30,color:HI,weight:700})+fade(seg(p,.5,.65),L('1周期の 平均 ＝ 0',1000,350,{size:28,color:QC,weight:700})),seg(p,.4,.55),HI);
  return s;
 },
 [K+'const2']:(p)=>{
  const cy=250,amp=110;
  let s=panel(cy,{amp,name:'q',col:QC})+curve(cy,mcos,{amp,color:QC,to:1,p:seg(p,0,.3)});
  const up=[],dn=[];for(let i=0;i<=60;i++){const u=i/60;const y=cy-amp*mcos(u);(mcos(u)>=0?up:dn).push([XU(u),y]);}
  s+=fade(seg(p,.3,.45),`<polygon points="${[[XU(.25),cy],...up,[XU(.75),cy]].map(q=>q.join(',')).join(' ')}" fill="${QC}" fill-opacity=".22"/>`);
  s+=fade(seg(p,.3,.45),`<polygon points="${[[XU(0),cy],...dn.filter(q=>q[0]<=XU(.25)+1),[XU(.25),cy]].map(q=>q.join(',')).join(' ')}" fill="${BAD}" fill-opacity=".22"/><polygon points="${[[XU(.75),cy],...dn.filter(q=>q[0]>=XU(.75)-1),[XU(1),cy]].map(q=>q.join(',')).join(' ')}" fill="${BAD}" fill-opacity=".22"/>`);
  s+=fade(seg(p,.3,.45),label('T',XU(1),cy+amp+50,{size:24,color:TC,anchor:'middle'}));
  s+=card(830,110,340,270,L('1周期で 平均',1000,165,{size:28})+L('上の分 ＝ 下の分',1000,225,{size:26,color:C.dim})+fade(seg(p,.35,.5),L('平均 ＝ 0',1000,285,{size:32,color:QC,weight:700}))+fade(seg(p,.6,.75),L('→ 足す定数 ＝ 0',1000,345,{size:30,color:HI,weight:700})),seg(p,.25,.4),QC);
  return s;
 },
 [K+'V']:(p)=>{
  let s=T(`${tV}=\\dfrac{${tq}}{${tC}}`,600,110,{size:60});
  s+=fade(seg(p,.05,.2),L('容量の 定義',600,210,{size:26,color:C.dim}));
  s+=fade(seg(p,.45,.6),T(`${tV}=-\\dfrac{${tI0}}{\\omega ${tC}}\\cos\\omega ${tt}`,600,350,{size:62}));
  return s;
 },
 [K+'ratio']:(p)=>{
  let s=T(`${tV0}=\\dfrac{${tI0}}{\\omega ${tC}}`,600,120,{size:58});
  s+=fade(seg(p,.1,.25),L('cos の 最大 ＝ 1',600,215,{size:26,color:C.dim}));
  const f=`\\dfrac{${tV0}}{${tI0}}=\\dfrac{1}{\\omega ${tC}}`,w=texWidth(f,60,false);
  s+=fade(seg(p,.4,.55),T(f,600,395,{size:60})+highlight(600-w/2-26,290,w+52,210,1,HI));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=L('F ＝ C/V（クーロン毎ボルト）',600,45,{size:28,color:C.dim});
  s+=fade(seg(p,.05,.2),T(`\\dfrac{1}{\\omega ${tC}}:\\ \\dfrac{1}{\\dfrac{1}{\\mathrm{s}}\\times\\dfrac{\\mathrm{C}}{\\mathrm{V}}}=\\dfrac{\\mathrm{V\\cdot s}}{\\mathrm{C}}`,600,215,{size:46}));
  s+=fade(seg(p,.5,.65),L('C/s ＝ A',600,330,{size:28,color:IC,weight:700}));
  s+=fade(seg(p,.6,.75),T(`=\\dfrac{\\mathrm{V}}{\\mathrm{A}}=\\Omega`,600,435,{size:52}));
  return s;
 },

 // ===== S3 山は1/4周期遅れる =====
 [K+'graphs']:(p)=>{
  let s=stack({vf:mcos,pi:seg(p,.05,.45),pv:seg(p,.3,.7)});
  s+=card(830,90,340,300,T(`${tI}=${tI0}\\sin\\omega ${tt}`,1000,160,{size:34})+fade(seg(p,.3,.45),T(`${tV}=-\\dfrac{${tI0}}{\\omega ${tC}}\\cos\\omega ${tt}`,1000,290,{size:30})),seg(p,0,.15));
  return s;
 },
 [K+'fill']:(p)=>{
  let s=tgrid()+panel(TOP,{name:'I'})+curve(TOP,sI)+panel(BOT,{name:'q',col:QC})+curve(BOT,mcos,{color:QC});
  const pts=[];for(let i=0;i<=60;i++){const u=.5*i/60;pts.push([XU(u),TOP-AMP*sI(u)]);}
  s+=fade(seg(p,.05,.2),`<polygon points="${[[XU(0),TOP],...pts,[XU(.5),TOP]].map(q=>q.join(',')).join(' ')}" fill="${IC}" fill-opacity=".2"/>`+label('I ＞ 0',XU(.25),TOP-22,{size:24,color:IC,anchor:'middle',weight:700}));
  const u=.5*seg(p,.1,.5);
  s+=fade(seg(p,.1,.2),dot(XU(u),BOT-AMP*mcos(u),10,QC)+line(XU(u),TOP-AMP-10,XU(u),BOT+AMP+10,{color:TC,w:2,dash:'6 6'}));
  s+=fade(seg(p,.55,.7),dot(XU(.5),TOP,11,IC)+dot(XU(.5),BOT-AMP,12,QC)+label('最大',XU(.5)+16,BOT-AMP-10,{size:26,color:QC,weight:700}));
  s+=card(830,110,340,260,L('I ＞ 0 の 間',1000,165,{size:28,color:IC})+L('q は 増え続ける',1000,220,{size:28,color:QC,weight:700})+fade(seg(p,.55,.7),L('I が 0 に 戻る 瞬間',1000,290,{size:26})+L('＝ q が 最大',1000,340,{size:30,color:QC,weight:700})),seg(p,.1,.25),QC);
  return s;
 },
 [K+'lag']:(p)=>{
  let s=stack({vf:mcos});
  s+=fade(seg(p,.05,.2),dot(XU(.25),TOP-AMP,11,IC)+line(XU(.25),TOP-AMP,XU(.25),BOT+AMP+10,{color:IC,w:2,dash:'6 6'}));
  s+=fade(seg(p,.2,.35),dot(XU(.5),BOT-AMP,11,VC)+line(XU(.5),BOT-AMP,XU(.5),BOT+AMP+10,{color:VC,w:2,dash:'6 6'}));
  s+=fade(seg(p,.4,.55),line(XU(.25),BOT+AMP+8,XU(.5),BOT+AMP+8,{color:PH,w:7})+label('T/4',XU(.375),BOT+AMP-4,{size:24,color:PH,anchor:'middle',weight:700}));
  s+=card(830,120,340,240,L('電圧の 山が',1000,175,{size:28,color:VC,weight:700})+L('T/4 遅い',1000,230,{size:32,color:PH,weight:700})+fade(seg(p,.55,.7),L('＝ π/2 の 遅れ',1000,300,{size:32,color:PH,weight:700})),seg(p,.3,.45),PH);
  return s;
 },
 [K+'formula']:(p)=>{
  const u=TAU*(.3+.35*p),cx=250,cy=270,R=150;
  const [ix,iy]=P(cx,cy,R,u),[vx,vy]=P(cx,cy,R,u-Math.PI/2);
  let s=line(cx-R-20,cy,cx+R+20,cy,{color:C.faint,w:2})+line(cx,cy+R+20,cx,cy-R-20,{color:C.faint,w:2})+ring(cx,cy,R,{color:C.dim,w:3});
  s+=draw(Array.from({length:41},(_,i)=>P(cx,cy,60,u-Math.PI/2+Math.PI/2*i/40)),1,{color:PH,w:6});
  s+=line(cx,cy,ix,iy,{color:IC,w:4})+line(cx,cy,vx,vy,{color:VC,w:4})+dot(ix,iy,11,IC)+dot(vx,vy,11,VC);
  s+=label('I',cx+(R+28)*Math.cos(u)-8,cy-(R+28)*Math.sin(u)+10,{size:28,color:IC,weight:700})+label('V',cx+(R+28)*Math.cos(u-Math.PI/2)-8,cy-(R+28)*Math.sin(u-Math.PI/2)+10,{size:28,color:VC,weight:700});
  s+=T(`-\\cos\\omega ${tt}=\\sin\\!\\Big(\\omega ${tt}-${cs(PH,'\\dfrac{\\pi}{2}')}\\Big)`,820,170,{size:50});
  s+=fade(seg(p,.4,.55),L('中身から π/2 を 引いた分',820,300,{size:30,color:PH,weight:700})+L('電圧が 後ろを 回る',820,360,{size:30,color:VC,weight:700}));
  return s;
 },
 [K+'compare']:(p)=>{
  const u=TAU*(.1+.3*p),cx=300,cy=265,R=160;
  const pI=P(cx,cy,R,u),pL=P(cx,cy,R,u+Math.PI/2),pC=P(cx,cy,R,u-Math.PI/2);
  let s=line(cx-R-20,cy,cx+R+20,cy,{color:C.faint,w:2})+line(cx,cy+R+20,cx,cy-R-20,{color:C.faint,w:2})+ring(cx,cy,R,{color:C.dim,w:3});
  s+=line(cx,cy,...pI,{color:IC,w:4})+dot(...pI,11,IC)+label('I',cx+(R+28)*Math.cos(u)-8,cy-(R+28)*Math.sin(u)+10,{size:28,color:IC,weight:700});
  s+=fade(seg(p,.05,.2),line(cx,cy,...pL,{color:VC,w:4})+dot(...pL,11,VC)+label('コイル',cx+(R+34)*Math.cos(u+Math.PI/2),cy-(R+34)*Math.sin(u+Math.PI/2)+8,{size:24,color:VC,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),line(cx,cy,...pC,{color:QC,w:4,dash:'8 6'})+dot(...pC,11,QC)+label('コンデンサ',cx+(R+40)*Math.cos(u-Math.PI/2),cy-(R+40)*Math.sin(u-Math.PI/2)+8,{size:24,color:QC,weight:700,anchor:'middle'}));
  s+=card(620,80,540,160,L('コイル：微分',890,135,{size:28,color:VC,weight:700})+L('電圧が π/2 進む',890,195,{size:30,color:PH,weight:700}),seg(p,.05,.2),VC);
  s+=card(620,280,540,160,L('コンデンサ：積分',890,335,{size:28,color:QC,weight:700})+L('電圧が π/2 遅れる',890,395,{size:30,color:PH,weight:700}),seg(p,.35,.5),QC);
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(80,60,420,190,T(`${tC}=100${U('\\mu F')}`,290,130,{size:44})+T(`f=50${U('Hz')}`,290,205,{size:44}),seg(p,0,.15),CC);
  s+=fade(seg(p,.2,.35),T(`\\omega ${tC}\\approx 314\\times 0.0001=0.0314`,830,150,{size:40}));
  s+=fade(seg(p,.55,.7),T(`\\dfrac{1}{\\omega ${tC}}=\\dfrac{1}{0.0314}\\approx 32${U('\\Omega')}`,600,380,{size:56}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(250,100,700,300,L('同じ コンデンサ（C ＝ 100 μF）',600,165,{size:30,color:C.dim})+L('周波数を 2倍：100 Hz',600,245,{size:36,color:PH,weight:700})+T(`\\dfrac{1}{\\omega ${tC}}=\\ ?`,600,335,{size:44,color:HI}),seg(p,0,.15),HI);
  return s;
 },
 [K+'ans']:(p)=>{
  const bar=(y,w,txt,g,c)=>fade(g,rect(260,y,w,50,{fill:c,fo:.35,stroke:c,rx:8})+label(txt,270+w,y+36,{size:28,color:c,weight:700}));
  let s=label('50 Hz',240,110,{size:26,color:C.dim,anchor:'end'})+label('100 Hz',240,190,{size:26,color:C.dim,anchor:'end'});
  s+=bar(75,480,'32 Ω',seg(p,0,.15),C.ink)+bar(155,240,'16 Ω（半分）',seg(p,.1,.25),HI);
  s+=fade(seg(p,.4,.55),card(150,270,900,200,L('速く 揺れる → 電荷を ためる 時間が 短い',600,325,{size:28})+T(`\\dfrac{${tI0}}{\\omega}`,470,425,{size:40})+L('電荷の 振幅が 半分',720,420,{size:30,color:QC,weight:700}),1,QC));
  return s;
 },
 [K+'contrast']:(p)=>{
  const A=axes({x:120,y:440,w:560,h:340,xmax:200,ymax:130,xlabel:'f [Hz]',ylabel:'振幅の比 [Ω]',xticks:[50,100,150],yticks:[32,64,96],xcolor:PH,ycolor:C.ink});
  const wL=f=>2*Math.PI*f*.1,wC=f=>1/(2*Math.PI*f*1e-4);
  let s=A.svg+A.plot(wL,{from:0,to:195,color:VC,w:5,p:seg(p,.05,.4)})+A.plot(wC,{from:12.3,to:195,color:QC,w:5,p:seg(p,.3,.65)});
  s+=fade(seg(p,.3,.45),label('ωL',A.X(190),A.Y(wL(190))-12,{size:28,color:VC,weight:700,anchor:'end'}));
  s+=fade(seg(p,.6,.75),label('1/(ωC)',A.X(190),A.Y(wC(190))-14,{size:28,color:QC,weight:700,anchor:'end'}));
  s+=card(760,100,400,300,L('コイル ωL',960,160,{size:28,color:VC,weight:700})+L('周波数に 比例',960,210,{size:26})+fade(seg(p,.4,.55),L('コンデンサ 1/(ωC)',960,280,{size:28,color:QC,weight:700})+L('周波数に 反比例',960,330,{size:26})),seg(p,.05,.2));
  return s;
 },

 // ===== S4 4本の法則を束ねる =====
 [K+'intro']:(p)=>{
  let s=table(4,{gs:[0,1,2,3].map(i=>seg(p,.05+.12*i,.17+.12*i))});
  return s;
 },
 [K+'gaussE']:(p)=>table(4,{hiRow:0,dimOthers:1}),
 [K+'gaussB']:(p)=>table(4,{hiRow:1,dimOthers:1}),
 [K+'monopole']:(p)=>{
  const cx=380,cy=260;
  let s=rect(cx-110,cy-30,110,60,{fill:BAD,fo:.6,stroke:BAD,rx:6})+rect(cx,cy-30,110,60,{fill:'#4a78d6',fo:.6,stroke:'#4a78d6',rx:6});
  s+=label('N',cx-55,cy+11,{size:30,color:C.ink,anchor:'middle',weight:700})+label('S',cx+55,cy+11,{size:30,color:C.ink,anchor:'middle',weight:700});
  [60,110,160].forEach(r=>{s+=`<ellipse cx="${cx}" cy="${cy-r*.55-30}" rx="${140+r}" ry="${r*.55+2}" fill="none" stroke="${BC}" stroke-width="3" opacity=".8"/>`+`<ellipse cx="${cx}" cy="${cy+r*.55+30}" rx="${140+r}" ry="${r*.55+2}" fill="none" stroke="${BC}" stroke-width="3" opacity=".8"/>`;});
  s+=fade(seg(p,.1,.25),ring(cx-110,cy,90,{color:HI,w:3,dash:'10 8'})+label('閉じた面',cx-110,cy+130,{size:24,color:HI,anchor:'middle',weight:700}));
  s+=card(760,70,400,380,L('磁力線は 始まりも',960,125,{size:26})+L('終わりもない（輪）',960,165,{size:26})+fade(seg(p,.25,.4),L('出る 分 ＝ 入る 分',960,235,{size:30,color:BC,weight:700}))
   +fade(seg(p,.45,.6),L('N極 だけの 磁石',960,305,{size:28})+L('（磁荷）は 見つかって いない',960,350,{size:26,color:C.dim}))+fade(seg(p,.7,.85),L('中級で 初めての 式',960,415,{size:26,color:HI,weight:700})),seg(p,.05,.2),BC);
  return s;
 },
 [K+'faraday']:(p)=>table(4,{hiRow:2,dimOthers:1}),
 [K+'ampere']:(p)=>{
  const q=seg(p,.5,.65);
  let s=table(4,{hiRow:3,dimOthers:1,eq3:`\\oint${vB}\\cdot${dr}=${mu}${tI}`+(q>.01?`+\\ {\\color{${HI}}?}`:'')});
  return s;
 },
 [K+'added']:(p)=>{
  let s=table(4,{hiRow:3,dimOthers:1});
  const x=800+texWidth(ROWS[3].eq,38,false)/2;
  s+=fade(seg(p,.05,.2),highlight(x-170,RY(3)+8,178,80,1,HI));
  s+=fade(seg(p,.3,.45),rect(30,RY(1)+10,1140,150,{fill:C.bg,fo:.97,stroke:HI,sw:2,rx:12})+L('電気束 Φ_E が 時間で 変わる → 電流が なくても 一周の 磁場の和',600,RY(1)+70,{size:26,weight:700})+L('（電流の 項 μ₀I とは 別の 項）',600,RY(1)+120,{size:24,color:C.dim}));
  return s;
 },
 [K+'gap']:(p)=>{
  let s=gapFig(p);
  s+=fade(seg(p,.35,.5),rect(515,70,150,40,{fill:C.bg,fo:.9,stroke:'none'})+label('すき間',590,98,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),card(300,410,600,90,L('電荷が 通っている わけではない',600,466,{size:30,color:BAD,weight:700}),1,BAD));
  return s;
 },
 [K+'gapflux']:(p)=>{
  let s=fade(.5,gapFig(p,{cy:190,h:200}));
  s+=card(120,330,960,170,T(`${cs(EC,'E')}=\\dfrac{${tq}}{${eps}S}`,330,420,{size:44})+fade(seg(p,.4,.55),T(`\\Rightarrow\\ ${PE}=${cs(EC,'E')}S=\\dfrac{${tq}}{${eps}}`,760,420,{size:44})),seg(p,.1,.25),EC);
  s+=fade(seg(p,.1,.25),label('コンデンサの回',140,358,{size:22,color:C.dim}));
  return s;
 },
 [K+'disp']:(p)=>{
  let s=T(`${eps}\\dfrac{d${PE}}{d${tt}}=${eps}\\times\\dfrac{1}{${eps}}\\,\\dfrac{d${tq}}{d${tt}}`,600,100,{size:48});
  s+=fade(seg(p,.2,.35),T(`=\\dfrac{d${tq}}{d${tt}}=${tI}`,600,230,{size:52}));
  s+=fade(seg(p,.35,.5),L('導線の 電流と 同じ 値',600,310,{size:28,color:IC,weight:700}));
  s+=card(300,360,600,120,T(`${eps}\\dfrac{d${PE}}{d${tt}}`,450,428,{size:40})+L('＝ 変位電流',690,432,{size:34,color:HI,weight:700}),seg(p,.6,.75),HI);
  return s;
 },
 [K+'dispnote']:(p)=>{
  let s=fade(.35,gapFig(p,{cy:190,h:200}));
  s+=card(200,300,800,190,L('名前は 電流 でも',600,350,{size:28})+L('電荷の 流れ ではない',600,400,{size:34,color:BAD,weight:700})+fade(seg(p,.5,.65),L('この項が 必要な 理由の 確かめ → 上級',600,455,{size:26,color:C.dim})),seg(p,0,.15),BAD);
  return s;
 },
 [K+'static']:(p)=>{
  const X=s=>`{\\color{${BAD}}\\cancel{${s}}}`;
  const g=seg(p,.15,.3);
  let s=row(2,{eq:g>.5?`\\oint${vE}\\cdot${dr}=-${X(`\\dfrac{d${PB}}{d${tt}}`)}`:null})+row(3,{eq:g>.5?`\\oint${vB}\\cdot${dr}=${mu}${tI}+${X(`${mu}${eps}\\dfrac{d${PE}}{d${tt}}`)}`:null});
  s=`<g transform="translate(0 -180)">${s}</g>`;
  s+=L('何も 時間で 変わらない とき',600,290,{size:28,color:HI,weight:700});
  s+=card(60,320,520,170,L('③ → 電位の回',320,370,{size:26,color:C.dim})+T(`\\oint${vE}\\cdot${dr}=0`,320,440,{size:44}),seg(p,.4,.55),EC);
  s+=card(620,320,520,170,L('④ → アンペールの回',880,370,{size:26,color:C.dim})+T(`\\oint${vB}\\cdot${dr}=${mu}${tI}`,880,440,{size:44}),seg(p,.6,.75),BC);
  return s;
 },
 [K+'status']:(p)=>{
  let s=table(4,{g:.9});
  s+=card(150,432,900,76,L('マクスウェル方程式：実験と 電荷保存に 合う 基本法則',600,480,{size:27,color:HI,weight:700}),seg(p,.05,.2),HI);
  return s;
 },
 [K+'limits']:(p)=>{
  let s=L('4本だけでは 足りない もの',600,70,{size:30,weight:700});
  const items=[['電荷の 動き','ローレンツ力',`${cs(C.F,'\\mathbf{F}')}=${cs(QC,'q')}(${vE}+${cs(C.v,'\\mathbf{v}')}\\times${vB})`,IC],['物質の 中','材料の 性質','',C.ink],['原子の 世界','量子論','',HI]];
  items.forEach(([a,b,f,c],i)=>{const x=60+i*370;s+=card(x,120,340,300,L(a,x+170,190,{size:28,color:C.dim})+L(b,x+170,260,{size:34,color:c,weight:700})+(f?T(f,x+170,350,{size:30}):''),seg(p,.1+.2*i,.25+.2*i),c);});
  return s;
 },

 // ===== S5 中級のまとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(80,90,500,300,L('コイル（微分）',330,150,{size:30,color:VC,weight:700})+T(`\\dfrac{${tV0}}{${tI0}}=\\omega L`,330,245,{size:48})+L('π/2 進む',330,340,{size:32,color:PH,weight:700}),seg(p,.02,.18),VC);
  s+=card(620,90,500,300,L('コンデンサ（積分）',870,150,{size:30,color:QC,weight:700})+T(`\\dfrac{${tV0}}{${tI0}}=\\dfrac{1}{\\omega ${tC}}`,870,245,{size:48})+L('π/2 遅れる',870,340,{size:32,color:PH,weight:700}),seg(p,.4,.55),QC);
  return s;
 },
 [K+'sum2']:(p)=>table(4,{gs:[0,1,2,3].map(i=>seg(p,.05+.1*i,.15+.1*i))}),
 [K+'look']:(p)=>{
  let s=L('中級で 使ってきた 微分',600,80,{size:30,weight:700});
  const fs=['x^2','\\sin','\\cos',`e^{-k${tt}}`];
  fs.forEach((f,i)=>{const x=110+i*260;s+=card(x,130,220,130,T(f,x+110,210,{size:48}),seg(p,.05+.1*i,.15+.1*i));});
  s+=fade(seg(p,.5,.65),card(160,320,380,120,L('差の 商',350,392,{size:32,color:HI,weight:700}),1,HI)+card(660,320,380,120,L('中身の 倍率',850,392,{size:32,color:HI,weight:700}),1,HI));
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(120,50,620,420,L('次の問い',430,100,{color:C.dim})+T(`\\dfrac{d}{d${tt}}\\,${tt}^{\\,n}=\\ ?`,430,190,{size:48})+L('どんな 関数でも 同じ 手順で',430,275,{size:28})+L('導けるのか？',430,325,{size:32,color:HI,weight:700})
   +fade(seg(p,.5,.65),L('傾きが 決まらない 点は？',430,405,{size:32,color:HI,weight:700})),seg(p,0,.15),HI);
  const A=axes({x:800,y:420,w:340,h:260,xmin:-1.2,xmax:1.2,ymin:0,ymax:1.3,g:seg(p,.5,.65)});
  s+=fade(seg(p,.5,.65),A.svg+A.plot(x=>Math.abs(x),{from:-1.1,to:1.1,color:C.x,w:5})+dot(A.X(0),A.Y(0),10,HI)+label('とがった 点',A.X(0)+16,A.Y(0)+34,{size:24,color:HI,weight:700}));
  return s;
 },
 [K+'upper']:(p)=>{
  let s=card(250,120,700,260,L('中級 おわり',600,180,{size:28,color:C.dim})+L('→ 微分・上級へ',600,265,{size:40,color:HI,weight:700})+L('微分の 導き方から',600,335,{size:28}),seg(p,0,.15),HI);
  return s;
 },
};
