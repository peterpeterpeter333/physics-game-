// YouTube シリーズ「過渡現象・上級 2/2」(ys-ue-transient-2) — 図。Stage 1200×515.
// 色：電荷 q・Q₀ 桃、電流 I 緑、時間 t・T 金、ω 桃、エネルギー 橙、電場 𝐄 水色、磁場 𝐁 橙、容量 C 黄、L 白、x 水色・v 紫（ばね）。
// LC 回路：左の辺にコンデンサ（上の板 q、下の板 −q）、右の辺にコイル。I の正の向き＝上の導線を左へ → 上の板へ流れ込む（反時計回り）。
//   一周（矢印の向き）：上の板 → 下の板で q/C 下がる、下の導線を右へ → コイルを下から上へで L dI/dt 下がる。
// 振動：q＝Q₀ cos ωt、I＝−ωQ₀ sin ωt。数値 L＝1 mH、C＝1 μF：ω≈31600 rad/s、f≈5.03 kHz、T≈0.199 ms。Q₀＝10 μC：50 μJ、I_max≈0.316 A。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,poly,spring,block,wall,ground} from './anim.mjs';
import {POS,NEG,QC,TC,IC,VC,CC,cs,T,U,card} from './yt1-um-circuit-time-1-diagrams.mjs';

const K='ue-transient-2:';
const EC=C.x,BC=C.E,EN=C.E,OC=C.p;   // 𝐄 水色、𝐁 橙、エネルギー 橙、ω 桃
const q_=cs(QC,'q'),Q0=cs(QC,'Q_0'),I_=cs(IC,'I'),C_=cs(CC,'C'),t_=cs(TC,'t'),W=cs(OC,'\\omega'),TT=cs(TC,'T'),U_=cs(EN,'U');
const DQ=`\\dfrac{d${q_}}{d${t_}}`,DI=`\\dfrac{d${I_}}{d${t_}}`,D2Q=`\\dfrac{d^2${q_}}{d${t_}^2}`;
const LCEQ=`L\\,${D2Q}+\\dfrac{${q_}}{${C_}}=0`;
const SHM=`${D2Q}=-\\dfrac{${q_}}{L${C_}}`;
const OMEGA=`${W}=\\dfrac{1}{\\sqrt{L${C_}}}`;
const QSOL=`${q_}=${Q0}\\cos ${W}${t_}`;
const EE=`\\dfrac{${q_}^2}{2${C_}}`,EB=`\\tfrac12 L${I_}^2`;

// ---- LC circuit -----------------------------------------------------------------------------------
const X1=170,X2=500,YT=110,YB=430,PT=250,PB=292,CY1=190,CY2=350;
function vcoil(x,y1,y2,{color=C.ink,w=5,n=5}={}){const d=(y2-y1)/n;let s=`M${x} ${y1}`;for(let i=0;i<n;i++)s+=` a${d*.75} ${d/2} 0 0 1 0 ${d}`;return `<path d="${s}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;}
// o: {q (−1..1 relative charge of top plate), I (−1..1, + = arrow direction), arrows (show positive-direction arrows), fields, labels, hiC, hiL, sw}
function lc({q=1,I=0,g=1,posArrows=0,flow=0,fields=0,labels=true,hiC=0,hiL=0,signs=0,sw=1,qlab=0}={}){
 let s='';
 const Wd=(pts)=>draw(pts,1,{color:C.dim,w:4});
 s+=Wd([[X1,PT],[X1,YT],[X2,YT],[X2,CY1]])+Wd([[X2,CY2],[X2,YB],[X1,YB],[X1,PB]]);
 if(sw<1){s+=line(X2-30,YB,X2-30,YB,{});}
 s+=rect(X1-60,PT-8,120,8,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+rect(X1-60,PB,120,8,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2});
 s+=vcoil(X2,CY1,CY2);
 // charges
 const n=Math.round(Math.abs(q)*5);
 for(let k=0;k<n;k++){const x=X1-48+k*24;const top=q>0?'＋':'−',bot=q>0?'−':'＋';
  s+=label(top,x,PT-16,{size:22,color:q>0?POS:NEG,anchor:'middle',weight:700})+label(bot,x,PB+34,{size:24,color:q>0?NEG:POS,anchor:'middle',weight:700});}
 if(fields&&Math.abs(q)>.05){const a=Math.abs(q);for(let k=0;k<3;k++){const x=X1-36+k*36;s+=fade(fields*a,q>0?arrow(x,PT+3,x,PB-3,{color:EC,w:3,head:8}):arrow(x,PB-3,x,PT+3,{color:EC,w:3,head:8}));}}
 if(fields&&Math.abs(I)>.05){const a=Math.abs(I);const up=I>0;s+=fade(fields*a,line(X2+8,CY1+6,X2+8,CY2-6,{color:BC,w:4})+line(X2+20,CY1+14,X2+20,CY2-14,{color:BC,w:3})+label('磁場',X2+56,(CY1+CY2)/2+8,{size:24,color:BC,weight:700}));}
 if(labels){
  s+=label('コンデンサ C',14,PB+80,{size:24,color:CC,weight:700});
  s+=label('コイル L',X2+34,150,{size:24,color:C.ink,weight:700});
 }
 if(qlab)s+=fade(qlab,label('上の板 q',X1+72,PT-4,{size:24,color:QC,weight:700})+label('下の板 −q',X1+72,PB+30,{size:24,color:QC,weight:700}));
 if(hiC)s+=highlight(X1-72,PT-40,144,90,hiC,QC);
 if(hiL)s+=highlight(X2-30,CY1-8,60,CY2-CY1+16,hiL,C.ink);
 if(signs)s+=fade(signs,label('入る側 ＋',X2+30,CY2+20,{size:22,color:POS,weight:700})+label('−',X2+30,CY1+10,{size:26,color:NEG,weight:700}));
 const o={color:IC,w:5,head:16};
 if(posArrows)s+=fade(posArrows,arrow(X2-40,YT,X1+60,YT,o)+arrow(X1,YT+12,X1,PT-42,o)+arrow(X1+60,YB,X2-40,YB,o)+arrow(X2,YB-20,X2,CY2+25,o)+label('I の正の向き',(X1+X2)/2,YT-16,{size:24,color:IC,weight:700,anchor:'middle'}));
 if(Math.abs(flow)>.02){const a=Math.abs(flow),o2={color:IC,w:3+3*a,head:12};const A=(x1,y1,x2,y2)=>flow>0?arrow(x1,y1,x2,y2,o2):arrow(x2,y2,x1,y1,o2);
  s+=fade(Math.min(1,.3+a),A(X2-40,YT+26,X1+60,YT+26)+A(X1+60,YB-26,X2-40,YB-26));}
 return fade(g,s);
}
// energy bars
function bars(qn,In,{x=720,y=420,h=250,g=1}={}){
 const e=qn*qn,b=In*In;let s='';
 s+=line(x-20,y,x+400,y,{color:C.dim,w:2});
 s+=rect(x+20,y-h*e,120,h*e,{fill:EN,fo:.55,stroke:EC,sw:3,rx:4})+rect(x+240,y-h*b,120,h*b,{fill:EN,fo:.55,stroke:BC,sw:3,rx:4});
 s+=label('電場',x+80,y+34,{size:24,color:EC,anchor:'middle',weight:700})+label('磁場',x+300,y+34,{size:24,color:BC,anchor:'middle',weight:700});
 s+=T(EE,x+80,y-h-30,{size:30})+T(EB,x+300,y-h-30,{size:30});
 return fade(g,s);
}
// q, I graphs over one period (u = t/T)
function qiGraph({g=1,p=1,mark=-1,x=110,y=225,w=480,h=150}={}){
 const A=axes({x,y,w,h,ymin:-1.2,ymax:1.2,xmax:1.08,xticks:[],yticks:[],g,xlabel:'t',ylabel:'電荷 q',xcolor:TC,ycolor:QC});
 const B=axes({x,y:y+205,w,h:150,ymin:-1.2,ymax:1.2,xmax:1.08,xticks:[],yticks:[],g,xlabel:'t',ylabel:'電流 I',xcolor:TC,ycolor:IC});
 let s=A.svg+B.svg+A.plot(u=>Math.cos(2*Math.PI*u),{from:0,to:1,p,color:QC,w:5})+B.plot(u=>-Math.sin(2*Math.PI*u),{from:0,to:1,p,color:IC,w:5});
 const labs=['0','T/4','T/2','3T/4','T'];
 [0,.25,.5,.75,1].forEach((u,i)=>{s+=fade(g,line(A.X(u),A.Y(1.2),A.X(u),B.Y(-1.2),{color:C.grid,w:1.5})+label(labs[i],A.X(u),B.Y(-1.2)+30,{size:22,color:TC,anchor:'middle'}));});
 if(mark>=0){const u=mark;s+=line(A.X(u),A.Y(1.2),B.X(u),B.Y(-1.2),{color:C.hi,w:2,dash:'6 5'})+dot(A.X(u),A.Y(Math.cos(2*Math.PI*u)),8,QC)+dot(B.X(u),B.Y(-Math.sin(2*Math.PI*u)),8,IC);}
 return {A,B,svg:fade(g,s)};
}

export const ytUeTransient2Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  let s=lc({q:1,g:seg(p,0,.2)});
  s+=card(680,100,480,300,label('前回の最後の問い',920,150,{size:24,color:C.dim,anchor:'middle'})
   +label('抵抗を 外して',920,220,{size:28,color:C.ink,anchor:'middle'})+label('L と C だけに したら？',920,280,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=lc({q:1});
  s+=card(680,100,480,300,label('前回の最後の問い',920,150,{size:24,color:C.dim,anchor:'middle'})
   +label('L と C だけに したら？',920,220,{size:28,color:C.ink,anchor:'middle'})+label('電荷は 減衰せずに',920,290,{size:30,color:QC,anchor:'middle',weight:700})+label('何を する？',920,345,{size:34,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=card(80,90,500,320,label('コイル ＝「電流の 慣性」',330,150,{size:28,color:C.ink,anchor:'middle',weight:700})
   +T(`\\tau=\\dfrac{L}{R},\\quad ${EB}`,330,250,{size:42})+label('前回・電磁誘導',330,350,{size:22,color:C.dim,anchor:'middle'}),seg(p,0,.15));
  s+=card(620,90,500,320,label('抵抗 なし',870,170,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('熱で 失われる 所が ない',870,260,{size:28,color:EN,anchor:'middle',weight:700})+T(`R${I_}^2=0`,870,340,{size:40})),seg(p,.45,.6),C.hi);
  return s;
 },
 // ===== S2 =====
 [K+'setup']:(p)=>{
  let s=lc({q:1,g:seg(p,0,.2)});
  s+=card(680,90,480,330,label('仮定',920,145,{size:26,color:C.hi,anchor:'middle',weight:700})
   +label('はじめ 電荷 Q₀ まで 充電',920,210,{size:28,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),label('t ＝ 0 で コイルに つなぐ',920,270,{size:28,color:TC,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('導線・コイルの 抵抗 0',920,335,{size:28,color:C.ink,anchor:'middle'})+label('L、C は 一定',920,385,{size:26,color:C.dim,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'plate']:(p)=>{
  let s=lc({q:1,hiC:seg(p,0,.2),qlab:seg(p,.1,.35)});
  s+=card(680,110,480,280,T(`${q_}(0)=${Q0}>0`,920,200,{size:46})+fade(seg(p,.5,.7),label('上の板が ＋',920,300,{size:30,color:POS,anchor:'middle',weight:700})),seg(p,.4,.55),QC);
  return s;
 },
 [K+'Idir']:(p)=>{
  let s=lc({q:1,posArrows:seg(p,.05,.3),qlab:1});
  s+=card(680,110,480,280,label('矢印 ＝ I の 正の 向き',920,165,{size:28,color:IC,anchor:'middle',weight:700})+label('（上の板へ 流れ込む 向き）',920,210,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.55,.75),T(`${I_}=${DQ}`,920,310,{size:54})),seg(p,.15,.3),IC);
  return s;
 },
 [K+'cap']:(p)=>{
  let s=lc({q:1,posArrows:1,hiC:seg(p,.45,.6),fields:0});
  s+=card(680,110,480,280,label('矢印の向きに 一周（第2法則）',920,170,{size:26,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('上の板 → 下の板',920,240,{size:28,color:C.ink,anchor:'middle'})+T(`-\\dfrac{${q_}}{${C_}}`,920,330,{size:46})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'coil']:(p)=>{
  let s=lc({q:1,posArrows:1,hiL:seg(p,0,.2),signs:seg(p,.3,.5)});
  s+=card(680,110,480,280,label('コイル（下 → 上）',920,170,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),T(`-L\\,${DI}`,920,270,{size:50})+label('前回と 同じ 約束',920,350,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'loop']:(p)=>{
  let s=lc({q:1,posArrows:1,g:.35});
  s+=card(600,150,560,200,fade(seg(p,.05,.3),T(`-\\dfrac{${q_}}{${C_}}-L\\,${DI}=0`,880,255,{size:52})),1);
  return s;
 },
 [K+'neg']:(p)=>{
  let s=T(`-\\dfrac{${q_}}{${C_}}-L\\,${DI}=0`,600,100,{size:46,color:C.dim});
  s+=fade(seg(p,.05,.25),label('両辺に −1 を 掛ける',600,200,{size:28,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.3,.55),T(`L\\,${DI}+\\dfrac{${q_}}{${C_}}=0`,600,330,{size:62}));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T(`L\\,${DI}+\\dfrac{${q_}}{${C_}}=0`,600,70,{size:38,color:C.dim});
  s+=fade(seg(p,.02,.3),T(`${I_}=${DQ}\\ \\Rightarrow\\ ${DI}=${D2Q}`,600,210,{size:44}));
  s+=fade(seg(p,.55,.75),T(LCEQ,600,385,{size:58}));
  return s;
 },
 [K+'div']:(p)=>{
  let s=T(LCEQ,600,85,{size:44,color:C.dim});
  s+=fade(seg(p,.05,.25),T(`L\\,${D2Q}=-\\dfrac{${q_}}{${C_}}`,600,210,{size:50})+label('q/C を 右へ',960,220,{size:24,color:C.hi}));
  s+=fade(seg(p,.45,.7),T(SHM,600,370,{size:64})+label('L で 割る',960,380,{size:24,color:C.hi}));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=lc({q:1,posArrows:.5});
  s+=card(680,110,480,280,T(SHM,920,180,{size:40})
   +fade(seg(p,.3,.5),label('はじめ q ＞ 0',920,265,{size:28,color:QC,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.8),label('→ d²q/dt² ＜ 0',920,330,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'sign2']:(p)=>{
  const u=seg(p,.1,.9);
  let s=lc({q:Math.cos(u*Math.PI/2*.7),posArrows:.35,flow:-.9*seg(p,.05,.25)});
  s+=card(680,110,480,280,label('I は 負の 向きへ 増える',920,170,{size:28,color:IC,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),label('電荷は 上の板から 流れ出す',920,240,{size:26,color:QC,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('＝ 放電の 向き ○',920,320,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S3 =====
 [K+'compare']:(p)=>{
  const xm=mix(260,330,.5+.5*Math.cos(p*Math.PI*2));
  let s=wall(80,60,190)+spring(80,xm-45,145,{coils:8})+block(xm,180,90,70,{color:C.x,text:'m'})+ground(70,520,182);
  s+=tex('m\\dfrac{d^2x}{dt^2}=-kx',840,120,{size:46});
  s+=fade(seg(p,.2,.4),T(`L\\,${D2Q}=-\\dfrac{1}{${C_}}\\,${q_}`,840,300,{size:46}));
  s+=fade(seg(p,.45,.6),label('x → q',220,330,{size:32,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('m → L',220,390,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('k → 1/C',220,450,{size:32,color:CC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'omega']:(p)=>{
  let s=tex('\\omega^2=\\dfrac{k}{m}',330,140,{size:56,color:C.ink})+label('単振動',330,60,{size:26,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.25,.45),label('k → 1/C、m → L',600,250,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),T(`${W}^2=\\dfrac{1}{L${C_}}`,870,140,{size:56}));
  s+=fade(seg(p,.6,.8),card(330,290,540,195,T(OMEGA,600,395,{size:50}),1,OC));
  return s;
 },
 [K+'sol']:(p)=>{
  const {svg}=qiGraph({p:seg(p,.3,.9),g:seg(p,.2,.35)});
  let s=svg;
  s+=card(680,100,480,320,T(`${q_}(0)=${Q0},\\quad ${I_}(0)=0`,920,170,{size:36})
   +fade(seg(p,.35,.5),label('振動の方程式・上級の 解',920,245,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.5,.7),T(QSOL,920,330,{size:50})),seg(p,0,.15),QC);
  return s;
 },
 [K+'check']:(p)=>{
  let s=T(QSOL,600,80,{size:44,color:C.dim});
  s+=fade(seg(p,.05,.3),T(`${D2Q}=-${W}^2${Q0}\\cos ${W}${t_}=-${W}^2${q_}`,600,205,{size:48}));
  s+=fade(seg(p,.5,.75),T(`=-\\dfrac{${q_}}{L${C_}}`,600,340,{size:56})+label('○ 元の式',870,350,{size:30,color:IC,weight:700}));
  return s;
 },
 [K+'I']:(p)=>{
  const {A,B,svg}=qiGraph({mark:seg(p,.5,.7)>0?.25:-1});
  let s=svg;
  s+=card(680,110,480,280,T(`${I_}=${DQ}=-${W}${Q0}\\sin ${W}${t_}`,920,190,{size:36})
   +fade(seg(p,.5,.7),label('q ＝ 0 の 瞬間',920,280,{size:28,color:QC,anchor:'middle',weight:700})+label('|I| が 最大',920,330,{size:30,color:IC,anchor:'middle',weight:700})),seg(p,0,.15),IC);
  return s;
 },
 [K+'T']:(p)=>{
  let s=T(`${TT}=\\dfrac{2\\pi}{${W}}=2\\pi\\sqrt{L${C_}}`,600,100,{size:56});
  s+=fade(seg(p,.35,.55),T(`\\mathrm{H}\\times\\mathrm{F}=\\dfrac{\\mathrm{V\\cdot s}}{\\mathrm{A}}\\times\\dfrac{\\mathrm{C}}{\\mathrm{V}}=\\mathrm{s}\\cdot\\dfrac{\\mathrm{C}}{\\mathrm{A}}=\\mathrm{s}^2`,600,260,{size:44}));
  s+=fade(seg(p,.7,.85),label('√ を とると 秒',600,400,{size:32,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=label('L ＝ 1 mH、C ＝ 1 μF',600,80,{size:34,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.5),T(`L${C_}=10^{-3}\\times10^{-6}=10^{-9}\\,\\mathrm{s^2}`,600,200,{size:48}));
  s+=fade(seg(p,.6,.8),T(`\\sqrt{L${C_}}\\approx 3.16\\times10^{-5}\\,\\mathrm{s}`,600,330,{size:50}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=T(`${W}=\\dfrac{1}{3.16\\times10^{-5}}\\approx ${cs(OC,'31600\\,\\mathrm{rad/s}')}`,600,110,{size:46});
  s+=fade(seg(p,.35,.55),T(`f=\\dfrac{${W}}{2\\pi}\\approx 5.03\\,\\mathrm{kHz}`,600,260,{size:50}));
  s+=fade(seg(p,.65,.8),label('1 秒に 約 5000 回 往復',600,400,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 =====
 [K+'E']:(p)=>{
  let s=lc({q:.7,I:.7,fields:seg(p,0,.3),labels:true});
  s+=card(680,90,480,330,label('コンデンサ',800,140,{size:24,color:CC,anchor:'middle'})+T(EE,800,215,{size:42})
   +label('コイル',1040,140,{size:24,color:C.ink,anchor:'middle'})+T(EB,1040,215,{size:42})
   +fade(seg(p,.5,.7),T(`${U_}=${EE}+${EB}`,920,345,{size:40})),seg(p,0,.15),EN);
  return s;
 },
 [K+'de1']:(p)=>{
  let s=label('U を 時間で 微分',600,60,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.1,.35),T(`\\dfrac{d}{d${t_}}${EE}=\\dfrac{${q_}}{${C_}}\\,${DQ}`,600,190,{size:52})+label('連鎖律',960,200,{size:24,color:C.dim}));
  s+=fade(seg(p,.6,.8),T(`=\\dfrac{${q_}}{${C_}}\\,${I_}`,600,340,{size:56}));
  return s;
 },
 [K+'de2']:(p)=>{
  let s=T(`\\dfrac{d}{d${t_}}${EE}=\\dfrac{${q_}}{${C_}}\\,${I_}`,600,70,{size:38,color:C.dim});
  s+=fade(seg(p,.05,.3),T(`\\dfrac{d}{d${t_}}${EB}=L${I_}\\,${DI}`,600,200,{size:52}));
  s+=fade(seg(p,.5,.7),T(`=L${I_}\\,${D2Q}`,600,340,{size:56}));
  return s;
 },
 [K+'de3']:(p)=>{
  let s=fade(seg(p,.4,.55),highlight(530,40,330,150,1,C.hi)+label('回路の式から 0',780,220,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=T(`\\dfrac{d${U_}}{d${t_}}=${I_}\\left(\\dfrac{${q_}}{${C_}}+L\\,${D2Q}\\right)`,600,110,{size:52});
  s+=fade(seg(p,.65,.85),T(`\\dfrac{d${U_}}{d${t_}}=0`,600,340,{size:60})+label('U は 一定',870,350,{size:32,color:EN,weight:700}));
  return s;
 },
 ...(()=>{
  const st=(u,g=1)=>{const qn=Math.cos(2*Math.PI*u),In=-Math.sin(2*Math.PI*u);
   return lc({q:qn,I:In,flow:In,fields:1,labels:false,g})+bars(qn,In,{g});};
  const tag=(t,g=1)=>fade(g,label(t,600,40,{size:30,color:TC,anchor:'middle',weight:700}));
  return {
   [K+'f0']:(p)=>st(0)+tag('t ＝ 0：q ＝ Q₀、I ＝ 0'),
   [K+'f1']:(p)=>st(.25*seg(p,.0,.3))+tag('t ＝ T/4：q ＝ 0、電流 最大',seg(p,.25,.35)),
   [K+'f2']:(p)=>{const u=p<.4?mix(.25,.5,seg(p,0,.25)):mix(.5,1,seg(p,.45,.95));
    const lab=u<.6?'t ＝ T/2：q ＝ −Q₀':u<.9?'t ＝ 3T/4：逆向きの 電流':'t ＝ T：元に 戻る';return st(u)+tag(lab);},
  };
 })(),
 [K+'nE']:(p)=>{
  let s=bars(1,0,{x:80});
  s+=card(600,100,560,300,T(`${Q0}=10\\,\\mu\\mathrm{C},\\ ${C_}=1\\,\\mu\\mathrm{F}`,880,160,{size:36})
   +fade(seg(p,.3,.5),T(`\\dfrac{(10^{-5})^2}{2\\times10^{-6}}=5\\times10^{-5}\\,\\mathrm{J}`,880,250,{size:38}))
   +fade(seg(p,.6,.75),T(`=${cs(EN,'50\\,\\mu\\mathrm{J}')}`,880,345,{size:44})),seg(p,0,.15),EN);
  return s;
 },
 [K+'nB']:(p)=>{
  let s=bars(0,1,{x:80});
  s+=card(600,100,560,300,T(`${I_}_{\\max}=${W}${Q0}\\approx 31600\\times10^{-5}\\approx 0.316\\,\\mathrm{A}`,880,160,{size:30})
   +fade(seg(p,.35,.55),T(`\\tfrac12\\times10^{-3}\\times0.316^2`,880,250,{size:38}))
   +fade(seg(p,.6,.75),T(`\\approx ${cs(EN,'50\\,\\mu\\mathrm{J}')}`,880,340,{size:44})+label('一致 ○',1010,350,{size:28,color:IC,weight:700})),seg(p,0,.15),EN);
  return s;
 },
 ...(()=>{
  const rows=[['x','位置',C.x,q_,'電荷'],['v','速度',C.v,I_,'電流'],['m','質量',C.ink,'L','コイル'],['k','ばね定数',C.ink,`1/${C_}`,'容量の逆数'],['\\tfrac12 mv^2','運動エネルギー',EN,EB,'磁場のエネルギー'],['\\tfrac12 kx^2','ばねのエネルギー',EN,`${q_}^2/2${C_}`,'電場のエネルギー']];
  const table=(g=1,bad=0)=>{let s=label('ばね',300,50,{size:28,color:C.dim,anchor:'middle',weight:700})+label('LC 回路',820,50,{size:28,color:C.dim,anchor:'middle',weight:700});
   rows.forEach((r,i)=>{const y=110+i*68;s+=fade(seg(g,i*.13,i*.13+.25),tex(r[0],230,y,{size:32})+label(r[1],310,y+8,{size:22,color:C.dim})+label('↔',600,y+10,{size:30,color:C.hi,anchor:'middle'})+T(r[3],730,y,{size:32})+label(r[4],810,y+8,{size:22,color:C.dim}));});
   return s;};
  return {
   [K+'table']:(p)=>table(seg(p,0,.85)),
   [K+'notmap']:(p)=>fade(1-seg(p,0,.15)*.6,table())+card(620,220,560,240,label('対応 しない もの',900,270,{size:28,color:C.a,anchor:'middle',weight:700})
     +fade(seg(p,.1,.3),label('q は 位置ではなく 電荷の 量',900,330,{size:26,color:QC,anchor:'middle'}))
     +fade(seg(p,.5,.7),label('エネルギーは 電場と 磁場に ある',900,400,{size:26,color:EN,anchor:'middle',weight:700})),seg(p,0,.15),C.a),
  };
 })(),
 // ===== S5 =====
 [K+'real']:(p)=>{
  const A=axes({x:110,y:300,w:520,h:220,ymin:-1.2,ymax:1.2,xmax:6.3,g:1,xlabel:'t',ylabel:'電荷 q',xcolor:TC,ycolor:QC});
  let s=A.svg+A.plot(u=>Math.exp(-.35*u)*Math.cos(2*Math.PI*u),{from:0,to:6,p:seg(p,.05,.6),color:QC,w:4,steps:400});
  s+=fade(seg(p,.4,.6),A.plot(u=>Math.exp(-.35*u),{from:0,to:6,color:C.dim,w:2,dash:'8 6'})+A.plot(u=>-Math.exp(-.35*u),{from:0,to:6,color:C.dim,w:2,dash:'8 6'}));
  s+=card(700,100,460,300,label('抵抗が あると 減衰',930,160,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.55,.75),label('単振動・上級 2/3 の',930,240,{size:24,color:C.dim,anchor:'middle'})+label('減衰の 方程式と 同じ 形',930,290,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'radio']:(p)=>{
  const A=axes({x:110,y:430,w:500,h:300,xmin:0,xmax:2,ymax:1.15,xticks:[],yticks:[],g:1,xlabel:'f',ylabel:'振動の 大きさ',xcolor:C.ink,ycolor:C.ink});
  const r=f=>.1/Math.sqrt((1-f*f)**2+(.1*f)**2);
  let s=A.svg+A.plot(f=>Math.min(1.1,r(f)),{from:.02,to:1.98,p:seg(p,.2,.7),color:C.hi,w:4,steps:400})+fade(seg(p,.6,.75),line(A.X(1),A.Y(0),A.X(1),A.Y(1),{color:C.dim,w:2,dash:'6 5'})+label('LC の f ＝ 放送局の f',A.X(1),A.Y(0)+34,{size:22,color:C.ink,anchor:'middle'}));
  s+=card(680,100,480,300,label('C を 変えて',920,170,{size:28,color:CC,anchor:'middle',weight:700})+label('LC の 振動数を 放送局に 合わせる',920,235,{size:24,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.7),label('＝ 共振（単振動・上級 3/3）',920,320,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'sq']:(p)=>{
  let s=T(`f=\\dfrac{1}{2\\pi\\sqrt{L${C_}}}`,600,110,{size:56});
  s+=fade(seg(p,.35,.5),label('両辺を 2乗',600,220,{size:28,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.5,.75),T(`f^2=\\dfrac{1}{4\\pi^2 L${C_}}`,600,340,{size:60}));
  return s;
 },
 [K+'swap']:(p)=>{
  let s=T(`f^2=\\dfrac{1}{4\\pi^2 L${C_}}`,600,100,{size:46,color:C.dim});
  s+=fade(seg(p,.05,.25),label('C と f² を 入れ替える',600,210,{size:28,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.3,.55),T(`${C_}=\\dfrac{1}{4\\pi^2 f^2 L}`,600,340,{size:62}));
  return s;
 },
 [K+'rnum']:(p)=>{
  let s=label('f ＝ 1 MHz、L ＝ 250 μH',600,70,{size:32,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.25,.5),T(`4\\pi^2 f^2 L=39.5\\times10^{12}\\times2.5\\times10^{-4}\\approx 9.87\\times10^{9}`,600,190,{size:40}));
  s+=fade(seg(p,.6,.8),T(`${C_}\\approx\\dfrac{1}{9.87\\times10^{9}}\\approx1.01\\times10^{-10}\\,\\mathrm{F}\\approx 101\\,\\mathrm{pF}`,600,330,{size:44}));
  return s;
 },
 // ===== S6 =====
 ...(()=>{
  const c1=(g=1)=>card(80,40,1040,200,T(SHM,330,140,{size:46})+label('単振動と 同じ 形',330,215,{size:24,color:C.dim,anchor:'middle'})+T(OMEGA,860,140,{size:50}),g,C.hi);
  const c2=(g=1)=>card(80,265,1040,225,label('原理：一周で 電位は 戻る（キルヒホッフの第2法則）',600,320,{size:26,color:C.ink,anchor:'middle'})
   +label('仮定：抵抗 0、L・C 一定',600,375,{size:26,color:C.ink,anchor:'middle'})
   +label('導いた 結果：q ＝ Q₀ cos ωt、U が 一定',600,440,{size:28,color:IC,anchor:'middle',weight:700}),g);
  return {[K+'sum1']:(p)=>c1(seg(p,0,.2)),[K+'sum2']:(p)=>c1()+c2(seg(p,0,.2))};
 })(),
 [K+'next1']:(p)=>{
  let s=lc({q:Math.cos(p*Math.PI*2),I:-Math.sin(p*Math.PI*2),flow:-Math.sin(p*Math.PI*2),fields:1,labels:false});
  s+=card(680,100,480,300,label('空間 そのものでも',920,170,{size:28,color:C.ink,anchor:'middle'})
   +label('電場と 磁場は',920,240,{size:30,color:EC,anchor:'middle',weight:700})+label('互いを 生み 続けられる？',920,300,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  // charging capacitor: wires with current into plates, question in the gap
  let s='';
  s+=line(80,260,330,260,{color:C.dim,w:4})+line(390,260,640,260,{color:C.dim,w:4});
  s+=rect(330,150,8,220,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+rect(382,150,8,220,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2});
  s+=arrow(110,235,260,235,{color:IC,w:5,head:16})+label('I',180,220,{size:28,color:IC,weight:700});
  s+=arrow(460,235,610,235,{color:IC,w:5,head:16})+label('I',530,220,{size:28,color:IC,weight:700});
  for(let k=0;k<4;k++){const y=175+k*55;s+=fade(seg(p,.2,.4),arrow(342,y,378,y,{color:EC,w:3,head:8}));}
  s+=fade(seg(p,.3,.5),label('？',360,120,{size:44,color:C.hi,anchor:'middle',weight:700})+label('すき間',360,420,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(700,110,460,280,label('次の問い',930,165,{size:24,color:C.dim,anchor:'middle'})+label('充電中の すき間を',930,235,{size:28,color:C.ink,anchor:'middle'})+label('「貫く 電流」は ある？',930,300,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
};
