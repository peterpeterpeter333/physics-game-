// YouTube シリーズ「コンデンサ・初級 1/1」(ys-ui-capacitance-1) — 図。Stage 1200×515.
// 色：正電荷 赤、電子・負電荷 青、電場 𝐄 水色、電荷 q・Q 桃、電圧 V 紫、容量 C 黄、仕事 橙、力 F 緑（仕事の回と同じ）。
// 回路：左の板（＋になる）と右の板（−になる）。電池の長い線（＋極）が左の板側。電子は 左の板 → 導線 → 電池 → 右の板。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,poly,axes,texWidth} from './anim.mjs';
import {cs,card,T} from './yt1-ui-closed-bag-1-diagrams.mjs';
import {fx,area,fline,rectLabels} from './yt1-ui-work-constant-1-diagrams.mjs';

const K='ui-capacitance-1:';
const POS=C.a,NEG='#7fb3ff',EC=C.x,QC=C.p,VC=C.v,CC=C.hi,WC=C.E;
const vE=cs(EC,'\\mathbf{E}');

// ---- circuit geometry ------------------------------------------------------------------------
const LX=360,RX=580,PW=64,PT=90,PB=372,WY=440,BX=470; // inner faces, plate width, top/bottom, wire y, battery centre
const SLOT=k=>120+k*46;                                  // 6 charge rows
const EL=LX-46,ER=RX+18;                              // electron x on the left / right plate
const ePath=k=>[[EL,SLOT(k)],[LX-32,PB+10],[LX-32,WY],[BX-10,WY],[BX+10,WY],[RX+32,WY],[RX+32,PB+10],[ER,SLOT(k)]];
const gPath=k=>[[EL,SLOT(k)],[LX+30,SLOT(k)-18],[(LX+RX)/2,SLOT(k)-22],[RX-30,SLOT(k)-18],[ER,SLOT(k)]]; // carried by hand across the gap
function along(pts,f){ // point at fraction f of the polyline
 let L=0;const d=[];for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);d.push(s);L+=s;}
 let w=L*clamp(f);for(let i=1;i<pts.length;i++){if(w<=d[i-1]){const u=w/d[i-1];return [mix(pts[i-1][0],pts[i][0],u),mix(pts[i-1][1],pts[i][1],u)];}w-=d[i-1];}
 return pts[pts.length-1];
}
const handPush=(x,y)=>fade(clamp((x-LX-60)/40),arrow(x-70,y,x-16,y,{color:C.hi,w:5,head:14})+label('手',x-43,y-14,{size:22,color:C.hi,anchor:'middle',weight:700}));
const electron=(x,y,{r=12,op=1}={})=>fade(op,ring(x,y,r,{color:NEG,w:2.5,fill:'#1b2a48'})+label('−',x,y+7,{size:22,color:NEG,anchor:'middle',weight:700}));
const plus=(x,y,{op=1,glow=0}={})=>fade(op,(glow?ring(x,y-1,15,{color:POS,w:2}):'')+label('＋',x,y+9,{size:26,color:POS,anchor:'middle',weight:700}));
function plates({g=1,labels=0}={}){
 let s=rect(LX-PW,PT,PW,PB-PT,{fill:'#8795ad',fo:.28,stroke:C.dim,sw:2.5,rx:4})+rect(RX,PT,PW,PB-PT,{fill:'#8795ad',fo:.28,stroke:C.dim,sw:2.5,rx:4});
 if(labels)s+=fade(labels,label('金属の板',LX-PW/2,PT-22,{size:24,color:C.dim,anchor:'middle'})+label('金属の板',RX+PW/2,PT-22,{size:24,color:C.dim,anchor:'middle'})+label('すき間',(LX+RX)/2,PT-22,{size:24,color:C.dim,anchor:'middle'}));
 return fade(g,s);
}
function battery({g=1,volt='',hand=false}={}){
 if(hand)return '';
 let s=draw([[LX-32,PB],[LX-32,WY],[BX-10,WY]],1,{color:C.dim,w:4})+draw([[BX+10,WY],[RX+32,WY],[RX+32,PB]],1,{color:C.dim,w:4});
 s+=line(BX-10,WY-34,BX-10,WY+34,{color:C.ink,w:5})+line(BX+10,WY-18,BX+10,WY+18,{color:C.ink,w:9});
 s+=label('＋',BX-32,WY-22,{size:24,color:POS,anchor:'middle',weight:700})+label('−',BX+32,WY-22,{size:26,color:NEG,anchor:'middle',weight:700});
 s+=label(volt?`電池 ${volt}`:'電池',BX,WY+62-8,{size:24,color:volt?VC:C.dim,anchor:'middle',weight:volt?700:400});
 return fade(g,s);
}
// moved: how many electrons (0..6, fractional = one in transit); pairs: show the neutral left plate
function charges(moved,{g=1,glow=0,dimPairs=1,gap=false}={}){
 let s='';
 for(let k=0;k<6;k++){
  const f=clamp(moved-k),y=SLOT(k);
  s+=plus(LX-14,y,{op:f>0?1:.55*dimPairs,glow:f>=1?glow:0});
  if(f<=0)s+=electron(EL,y,{op:dimPairs});
  else if(f<1){const [x,yy]=along(gap?gPath(k):ePath(k),f);s+=electron(x,yy)+(gap?handPush(x,yy):'');}
  else s+=electron(ER,y);
 }
 return fade(g,s);
}
function fieldArrows(g=1,{n=4,strength=1}={}){
 if(g<=0.001)return '';
 let s='';for(let i=0;i<n;i++){const y=140+i*62;s+=arrow(LX+34,y,LX+34+(RX-LX-68)*clamp(strength),y,{color:EC,w:4,head:14});}
 return fade(g,s+T(vE,(LX+RX)/2,PT-18,{size:34}));
}
const circuit=(o={})=>plates(o)+battery(o);
const panel=(x,y,w,h,inner,g=1,stroke=C.faint)=>card(x,y,w,h,inner,g,stroke);
const PX=740,PWD=430;                            // right panel
function counter(n,{g=1,y=110,h=250}={}){
 const cx=PX+PWD/2;
 return panel(PX,y,PWD,h,label('運んだ電子',cx,y+50,{size:26,color:C.dim,anchor:'middle'})+label(`${n} 個`,cx,y+100,{size:38,color:C.hi,anchor:'middle',weight:700})
  +label('左の板',PX+100,y+160,{size:26,color:C.dim,anchor:'middle'})+label(`＋${n}`,PX+100,y+215,{size:40,color:POS,anchor:'middle',weight:700})
  +label('右の板',PX+PWD-100,y+160,{size:26,color:C.dim,anchor:'middle'})+label(`−${n}`,PX+PWD-100,y+215,{size:40,color:NEG,anchor:'middle',weight:700}),g);
}
// V–q graph (q in μC, V in volts), 0..6 μC, 0..3 V
function vq({x=130,y=440,w=500,h=330,g=1,xmax=7,ymax=3.6}={}){
 return axes({x,y,w,h,xmax,ymax,xticks:[1,2,3,4,5,6],yticks:[1,2,3],grid:true,g,xlabel:'q [μC]',ylabel:'電圧 [V]',xcolor:QC,ycolor:VC});
}
const VL=q=>q/2;                                  // V = q/C with C = 2 μF
function steps(A,n,{g=1,color=WC,fo=.35}={}){
 let s='';const dq=6/n;for(let i=0;i<n;i++){const q0=i*dq,v=VL(q0);if(v<=0)continue;s+=rect(A.X(q0),A.Y(v),A.X(q0+dq)-A.X(q0),A.Y(0)-A.Y(v),{fill:color,fo,stroke:color,sw:n>20?0.6:2,rx:1});}
 return fade(g,s);
}
const triangle=(A,{g=1,fo=.38}={})=>fade(g,poly([[A.X(0),A.Y(0)],[A.X(6),A.Y(0)],[A.X(6),A.Y(3)]],{fill:WC,fo,stroke:WC,sw:2}));
const vqLine=(A,p=1)=>A.plot(VL,{from:0,to:6,p,color:VC,w:5});
const U=s=>`\\,\\mathrm{${s}}`;                   // unit
const q6=cs(QC,'6'+U('\\mu C')),v3=cs(VC,'3'+U('V'));

export const ytUiCapacitance1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recall']:(p)=>{
  // two potential levels; 1 C lifted from 0 V to 1 V needs 1 J
  const y0=400,y1=190;let s=line(120,y0,560,y0,{color:VC,w:3})+line(120,y1,560,y1,{color:VC,w:3});
  s+=fade(seg(p,0,.2),label('高さの地図：高さ ＝ 電位',120,110,{size:26,color:C.dim}));
  s+=label('電位 0 V',120,y0+40,{size:26,color:VC})+label('電位 1 V',120,y1-18,{size:26,color:VC});
  const u=seg(p,.2,.55),cy=mix(y0-26,y1-26,u);
  s+=ring(380,cy,24,{color:POS,w:3,fill:'#3a1d2a'})+label('＋',380,cy+9,{size:26,color:POS,anchor:'middle',weight:700})+label('1 C',420,cy+9,{size:26,color:POS});
  s+=fade(seg(p,.4,.6),arrow(300,y0-10,300,y1+10,{color:C.dim,w:3,head:14})+label('電位差 1 V',290,(y0+y1)/2+8,{size:26,color:VC,anchor:'end'}));
  s+=fade(seg(p,.55,.7),label('エネルギー ＋1 J',470,(y0+y1)/2+8,{size:28,color:WC,weight:700}));
  s+=panel(740,150,420,200,label('単位 J/C ＝ ボルト V',950,205,{size:26,color:C.dim,anchor:'middle'})+T(`1${U('V')}=1${U('J/C')}`,950,290,{size:52,color:VC}),seg(p,.65,.8),VC);
  return s;
 },
 [K+'question']:(p)=>{
  let s=plates({g:seg(p,0,.2)});
  s+=fade(seg(p,.1,.3),plus(LX-14,SLOT(1))+plus(LX-14,SLOT(3))+electron(ER,SLOT(1))+electron(ER,SLOT(3)));
  s+=panel(700,120,470,260,label('コンデンサ',935,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('電荷をためる装置',935,230,{size:26,color:C.dim,anchor:'middle'})
   +label('1 V あたり',935,295,{size:32,color:VC,anchor:'middle',weight:700})+label('どれだけ ためられる？',935,345,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'plates']:(p)=>{
  let s=plates({g:seg(p,0,.2),labels:seg(p,.15,.3)});
  // inside metal: electrons wander freely
  const inner=panel(760,110,400,280,label('金属（導体）の中',960,160,{size:26,color:C.dim,anchor:'middle'}),seg(p,.45,.6));
  s+=inner;
  if(p>.45){const g=seg(p,.5,.65);let e='';for(let i=0;i<7;i++){const t=p*9+i*1.7,x=960+140*Math.sin(t+i),y=280+70*Math.sin(1.3*t+2*i);e+=electron(x,y,{r:11});}
   s+=fade(g,rect(790,190,340,180,{fill:'#8795ad',fo:.18,stroke:C.dim,sw:2,rx:8})+e+label('電荷が 自由に動ける',960,428,{size:26,color:C.hi,anchor:'middle',weight:700}));}
  return s;
 },
 [K+'battery']:(p)=>{
  let s=plates({labels:1-seg(p,.4,.6)});
  s+=fade(seg(p,0,.25),line(LX+10,PT+20,RX-10,PT+20,{color:C.dim,w:2,dash:'6 8'})+label('電気を通さない',(LX+RX)/2,PT+60,{size:22,color:C.dim,anchor:'middle'}));
  s+=battery({g:seg(p,.45,.7)});
  s+=charges(0,{g:seg(p,.7,.9)});
  return s;
 },
 // ===== S2 電子を運ぶ =====
 [K+'carry']:(p)=>{
  let s=circuit()+charges(clamp((p-.2)/.6));
  s+=fade(seg(p,.1,.25),label('電子を 1個',PX+30,150,{size:30,color:NEG,weight:700})+label('左の板 → 導線 → 右の板',PX+30,205,{size:26,color:C.ink}));
  s+=fade(seg(p,.65,.8),label('電子 ＝ 負の電荷',PX+30,280,{size:28,color:NEG}));
  return s;
 },
 [K+'pair']:(p)=>{
  let s=circuit()+charges(1,{glow:seg(p,.1,.3)});
  s+=fade(seg(p,.05,.3),label('左：＋が 1つ 余る',PX+30,170,{size:30,color:POS,weight:700}));
  s+=fade(seg(p,.5,.7),ring(ER,SLOT(0),20,{color:NEG,w:2.5})+label('右：−が 1つ 増える',PX+30,240,{size:30,color:NEG,weight:700}));
  return s;
 },
 [K+'count']:(p)=>{
  const m=1+5*seg(p,.05,.75);const n=Math.floor(m+1e-6);
  return circuit()+charges(m,{glow:1})+counter(n,{g:seg(p,0,.15)});
 },
 [K+'Q']:(p)=>{
  let s=circuit()+charges(6,{glow:1});
  s+=fade(seg(p,.05,.25),T(cs(POS,'+Q'),LX-PW-50,215,{size:40})+T(cs(NEG,'-Q'),RX+PW+50,215,{size:40}));
  s+=panel(PX,130,PWD,220,T(cs(QC,'Q'),PX+70,215,{size:52})+label('片方の板の',PX+120,200,{size:28,color:C.ink})+label('電荷の大きさ',PX+120,245,{size:28,color:C.ink})
   +fade(seg(p,.5,.7),label('左 ＋Q，右 −Q',PX+PWD/2,315,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.15,.35),QC);
  return s;
 },
 [K+'Qsum']:(p)=>{
  let s=circuit()+charges(6,{glow:1})+T(cs(POS,'+Q'),LX-PW-50,215,{size:40})+T(cs(NEG,'-Q'),RX+PW+50,215,{size:40});
  s+=panel(PX,110,PWD,300,
   T(`${cs(POS,'(+Q)')}+${cs(NEG,'(-Q)')}=0`,PX+PWD/2,180,{size:40})
   +fade(seg(p,.2,.35),label('合計は 0',PX+PWD/2,240,{size:28,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.5,.7),label('コンデンサの電荷 Q',PX+PWD/2,310,{size:30,color:QC,anchor:'middle',weight:700})+label('＝ 片方の板の 大きさ',PX+PWD/2,360,{size:30,color:QC,anchor:'middle',weight:700})),seg(p,0,.15),QC);
  return s;
 },
 [K+'field']:(p)=>{
  const m=6*(0.5+0.5*seg(p,.55,.9));
  let s=circuit()+charges(6,{glow:1})+fieldArrows(seg(p,.05,.3),{strength:seg(p,.05,.3)});
  s+=panel(PX,120,PWD,250,label('電場',PX+40,185,{size:28,color:EC})+T(vE,PX+120,183,{size:38})+label('の向き',PX+150,185,{size:28,color:EC})
   +label('＋の板 → −の板',PX+PWD/2,250,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('電荷が 増えるほど 強い',PX+PWD/2,320,{size:28,color:C.hi,anchor:'middle'})),seg(p,.15,.3),EC);
  return s;
 },
 [K+'stop']:(p)=>{
  let s=circuit({volt:'3 V'})+charges(6,{glow:1})+fieldArrows(1);
  const vy=PB-6;s+=fade(seg(p,.05,.25),line(LX+6,vy,RX-6,vy,{color:VC,w:3})+line(LX+6,vy-10,LX+6,vy+10,{color:VC,w:3})+line(RX-6,vy-10,RX-6,vy+10,{color:VC,w:3})+label('電圧',(LX+RX)/2,vy-14,{size:24,color:VC,anchor:'middle',weight:700}));
  s+=panel(PX,110,PWD,290,label('電荷が増える',PX+PWD/2,165,{size:28,color:C.ink,anchor:'middle'})+label('↓',PX+PWD/2,205,{size:28,color:C.dim,anchor:'middle'})
   +label('板の間の 電圧が上がる',PX+PWD/2,250,{size:28,color:VC,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('電池の電圧と 等しい',PX+PWD/2,310,{size:28,color:VC,anchor:'middle'})+label('→ 移動が止まる',PX+PWD/2,360,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),VC);
  return s;
 },
 // ===== S3 1 V あたりの電荷 =====
 [K+'meas']:(p)=>{
  let s=circuit({volt:'3 V'})+charges(6,{glow:1})+fieldArrows(1);
  s+=fade(seg(p,.1,.3),label('● 1つ ＝ 1 μC 分の電子',PX+20,120,{size:24,color:NEG}));
  s+=panel(PX,160,PWD,210,label('電池 3 V のとき',PX+PWD/2,215,{size:28,color:VC,anchor:'middle',weight:700})
   +label('片方の板の電荷',PX+PWD/2,270,{size:26,color:C.dim,anchor:'middle'})+T(`Q=${q6}`,PX+PWD/2,335,{size:46,color:QC}),seg(p,.35,.55),QC);
  return s;
 },
 [K+'micro']:(p)=>{
  let s=circuit({volt:'3 V'})+charges(6,{glow:1})+fieldArrows(1);
  s+=panel(PX,100,PWD,330,
   T(`\\mu=10^{-6}`,PX+PWD/2,175,{size:48,color:C.hi})
   +label('マイクロ ＝ 100万分の1',PX+PWD/2,240,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),T(`${q6}=${cs(QC,'6\\times10^{-6}'+U('C'))}`,PX+PWD/2,340,{size:40})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'prop']:(p)=>{
  const two=seg(p,.05,.3);
  let s=circuit({volt:two>.5?'6 V':'3 V'})+charges(6,{glow:1})+fieldArrows(1);
  s+=fade(two,label('×2',LX-PW-45,SLOT(3)+10,{size:30,color:POS,anchor:'middle',weight:700})+label('×2',RX+PW+45,SLOT(3)+10,{size:30,color:NEG,anchor:'middle',weight:700}));
  const row=(y,v,q,g)=>fade(g,label(v,PX+110,y,{size:32,color:VC,anchor:'middle',weight:700})+label('→',PX+PWD/2,y,{size:30,color:C.dim,anchor:'middle'})+label(q,PX+PWD-110,y,{size:32,color:QC,anchor:'middle',weight:700}));
  s+=panel(PX,100,PWD,320,label('電圧',PX+110,150,{size:24,color:C.dim,anchor:'middle'})+label('電荷',PX+PWD-110,150,{size:24,color:C.dim,anchor:'middle'})
   +row(210,'3 V','6 μC',1)+row(275,'6 V','12 μC',seg(p,.2,.35))
   +fade(seg(p,.55,.7),label('比例する（実験）',PX+PWD/2,370,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'def']:(p)=>{
  const row=(y,t,g)=>fade(g,T(t,700,y,{size:40}));
  let s=panel(90,80,500,360,label('電荷 ÷ 電圧',340,135,{size:28,color:C.dim,anchor:'middle'})
   +T(`\\dfrac{${cs(QC,'6'+U('\\mu C'))}}{${cs(VC,'3'+U('V'))}}=2`,340,230,{size:40})
   +T(`\\dfrac{${cs(QC,'12'+U('\\mu C'))}}{${cs(VC,'6'+U('V'))}}=2`,340,350,{size:40})
   +fade(seg(p,.15,.3),label('電圧によらず 同じ',340,420,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  s+=panel(650,110,500,300,
   T(`${cs(CC,'C')}=\\dfrac{${cs(QC,'Q')}}{${cs(VC,'V')}}`,900,210,{size:64})
   +label('電気容量（定義）',900,315,{size:32,color:CC,anchor:'middle',weight:700})
   +label('C：容量　Q：片方の電荷　V：電圧',900,370,{size:24,color:C.dim,anchor:'middle'}),seg(p,.45,.65),CC);
  return s;
 },
 [K+'calc']:(p)=>{
  let s=panel(90,80,1020,360,
   T(`${cs(CC,'C')}=\\dfrac{${cs(QC,'Q')}}{${cs(VC,'V')}}`,300,200,{size:56})
   +fade(seg(p,.1,.3),T(`=\\dfrac{${q6}}{${v3}}`,560,200,{size:52}))
   +fade(seg(p,.45,.65),T(`=${cs(CC,'2'+U('\\mu C/V'))}`,860,200,{size:52}))
   +fade(seg(p,.65,.85),label('1 V あたり 2 μC',600,360,{size:36,color:CC,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=panel(90,80,1020,360,
   T(`${cs(CC,'C')}=${cs(CC,'2'+U('\\mu C/V'))}`,380,165,{size:50})
   +fade(seg(p,.05,.25),label('クーロン毎ボルト',800,172,{size:28,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.25,.45),T(`1${U('F')}=1${U('C/V')}`,380,275,{size:50,color:CC})+label('ファラド：1 V あたり 1 C',800,282,{size:28,color:CC,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.85),T(`${cs(CC,'C')}=${cs(CC,'2'+U('\\mu F'))}`,600,390,{size:56})+highlight(470,345,260,76,1,CC)),seg(p,0,.1));
  return s;
 },
 [K+'symbol']:(p)=>{
  const SYL=370-texWidth('C=2\\,\\mathrm{\\mu F}',60,false)/2,SYR=830-texWidth('Q=6\\,\\mathrm{\\mu C}',60,false)/2;
  let s=panel(90,80,1020,360,
   T(`${cs(CC,'C')}=2${U('\\mu F')}`,SYL,190,{size:60,anchor:'start'})
   +T(`${cs(QC,'Q')}=6${U('\\mu C')}`,SYR,190,{size:60,anchor:'start'})
   +fade(seg(p,.25,.45),ring(SYL+texWidth('C',60,false)/2+9,178,34,{color:CC,w:3})+label('斜めの C ＝ 容量',370,310,{size:32,color:CC,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.8),ring(SYR+texWidth('Q=6\\,\\mathrm{\\mu C}',60,false)-texWidth('\\mathrm{C}',60,false)/2+9,178,34,{color:QC,w:3})+label('立った C ＝ クーロン',830,310,{size:32,color:QC,anchor:'middle',weight:700}))
   +fade(seg(p,.8,.95),label('（F はファラド）',370,375,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.1));
  return s;
 },
 [K+'quiz']:(p)=>{
  return panel(250,90,700,330,label('確認',600,150,{size:28,color:C.dim,anchor:'middle'})
   +T(`${cs(CC,'C')}=2${U('\\mu F')},\\quad ${cs(VC,'V')}=${cs(VC,'5'+U('V'))}`,600,235,{size:48})
   +fade(seg(p,.35,.55),T(`${cs(QC,'Q')}=\\;?\\;${U('\\mu C')}`,600,340,{size:52})),seg(p,0,.15),C.hi);
 },
 [K+'quizans']:(p)=>{
  return panel(250,80,700,350,label('確認',600,135,{size:28,color:C.dim,anchor:'middle'})
   +T(`${cs(CC,'C')}=2${U('\\mu F')},\\quad ${cs(VC,'V')}=${cs(VC,'5'+U('V'))}`,600,215,{size:48})
   +T(`${cs(QC,'Q')}=${cs(CC,'C')}${cs(VC,'V')}`,600,310,{size:48})
   +fade(seg(p,.4,.6),T(`=2${U('\\mu F')}\\times${cs(VC,'5'+U('V'))}=${cs(QC,'10'+U('\\mu C'))}`,600,380,{size:44})),0.999,C.hi);
 },
 // ===== S4 ためるのに要る仕事 =====
 [K+'hand']:(p)=>{
  let s=plates()+charges(2+clamp((p-.3)/.55),{glow:1,gap:true});
  s+=fade(seg(p,.05,.2),label('電池の代わりに',PX+20,160,{size:28,color:C.dim})+label('手で 少しずつ 運ぶ',PX+20,215,{size:32,color:C.hi,weight:700}));
  s+=fade(seg(p,.5,.65),label('左の板 → 右の板',PX+20,280,{size:28,color:NEG}));
  return s;
 },
 [K+'against']:(p)=>{
  let s=plates()+charges(3,{glow:1})+fade(.5,fieldArrows(1,{n:2}));
  const ex=(LX+RX)/2+20,ey=SLOT(3)+23;
  s+=electron(ex,ey);
  s+=fade(seg(p,.05,.25),arrow(ex-16,ey-26,ex-96,ey-26,{color:C.F,w:5,head:14})+label('＋の板が 引く',ex-56,ey-44,{size:22,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.4),arrow(ex-16,ey+26,ex-96,ey+26,{color:C.F,w:5,head:14})+label('−の板が 押す',ex-56,ey+62,{size:22,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),arrow(ex+18,ey,ex+72,ey,{color:C.hi,w:5,head:14}));
  s+=panel(PX,130,PWD,220,label('電子への力は 左向き',PX+PWD/2,190,{size:28,color:C.F,anchor:'middle',weight:700})+label('右へ運ぶ ＝ 逆らって運ぶ',PX+PWD/2,250,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('→ 仕事が要る',PX+PWD/2,305,{size:30,color:WC,anchor:'middle',weight:700}),seg(p,.55,.75));
  return s;
 },
 [K+'perC']:(p)=>{
  return panel(170,90,860,330,label('電圧の定義',600,150,{size:28,color:C.dim,anchor:'middle'})
   +T(`1${U('V')}=1${U('J/C')}`,600,230,{size:50,color:VC})
   +fade(seg(p,.3,.5),label('電圧 3 V の間で',420,320,{size:30,color:VC,anchor:'middle'})+label('1 C を運ぶ',420,370,{size:30,color:QC,anchor:'middle'}))
   +fade(seg(p,.55,.75),label('→',620,345,{size:34,color:C.dim,anchor:'middle'})+label('仕事 3 J',800,355,{size:42,color:WC,anchor:'middle',weight:700})),seg(p,0,.12));
 },
 [K+'predict']:(p)=>{
  return panel(170,90,860,330,label('全部 3 V で運ぶと？',600,160,{size:30,color:C.ink,anchor:'middle'})
   +T(`${q6}\\times${v3}=${cs(WC,'18'+U('\\mu J'))}\\;?`,600,260,{size:52})
   +fade(seg(p,.4,.6),label('予想してみよう',600,370,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12),C.hi);
 },
 [K+'empty']:(p)=>{
  let s=plates()+charges(clamp((p-.45)/.4),{gap:true});
  s+=panel(PX,130,PWD,240,label('空の板',PX+PWD/2,185,{size:28,color:C.dim,anchor:'middle'})+T(`${cs(VC,'V')}=${cs(VC,'0'+U('V'))}`,PX+PWD/2,260,{size:48})
   +fade(seg(p,.5,.7),label('最初の電子は ほぼ 仕事なし',PX+PWD/2,335,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.2),VC);
  return s;
 },
 [K+'mid']:(p)=>{
  let s=plates()+charges(2,{glow:1});
  s+=panel(PX,90,PWD,340,
   T(`${cs(CC,'C')}=\\dfrac{${cs(QC,'Q')}}{${cs(VC,'V')}}`,PX+PWD/2,160,{size:44})
   +fade(seg(p,.3,.5),label('↓ 電圧について 解く',PX+PWD/2,235,{size:26,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.5,.7),T(`${cs(VC,'V')}=\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}`,PX+PWD/2,315,{size:52}))
   +fade(seg(p,.1,.3),label('q：途中の電荷',PX+PWD/2,405,{size:24,color:QC,anchor:'middle'})),seg(p,0,.1));
  return s;
 },
 [K+'mid2']:(p)=>{
  const q=[0,2,4,6];const idx=Math.min(3,Math.floor(1+3*seg(p,.05,.7)+1e-6));
  let s=plates()+charges(q[idx],{glow:1});
  const row=(i,g)=>fade(g,label(`${q[i]} μC`,PX+110,190+i*56,{size:30,color:QC,anchor:'middle',weight:700})+label('→',PX+PWD/2,190+i*56,{size:28,color:C.dim,anchor:'middle'})+label(`${q[i]/2} V`,PX+PWD-110,190+i*56,{size:30,color:VC,anchor:'middle',weight:700}));
  s+=panel(PX,90,PWD,350,label('q',PX+110,140,{size:24,color:QC,anchor:'middle'})+label('電圧 q/C',PX+PWD-110,140,{size:24,color:VC,anchor:'middle'})
   +row(0,1)+row(1,idx>=1?1:0)+row(2,idx>=2?1:0)+row(3,idx>=3?1:0),seg(p,0,.1));
  return s;
 },
 [K+'graph']:(p)=>{
  const A=vq({g:seg(p,0,.2)});
  let s=A.svg+vqLine(A,seg(p,.25,.6));
  s+=fade(seg(p,.3,.45),dot(A.X(2),A.Y(1),8,C.hi)+dot(A.X(4),A.Y(2),8,C.hi));
  s+=fade(seg(p,.55,.7),dot(A.X(6),A.Y(3),9,C.hi)+label('(6 μC, 3 V)',A.X(6)-10,A.Y(3)-22,{size:24,color:C.hi,anchor:'end'}));
  s+=panel(740,120,420,220,label('電圧は',950,180,{size:28,color:C.dim,anchor:'middle'})+T(`${cs(VC,'V')}=\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}`,950,255,{size:48})+label('0 から まっすぐ 増える',950,318,{size:26,color:VC,anchor:'middle'}),seg(p,.4,.6));
  return s;
 },
 [K+'stair']:(p)=>{
  const A=vq();let s=A.svg+vqLine(A);
  s+=steps(A,6,{g:seg(p,.1,.35)});
  // highlight one strip: q from 3 to 4 μC at 1.5 V
  const g=seg(p,.35,.55);
  s+=fade(g,rect(A.X(3),A.Y(1.5),A.X(4)-A.X(3),A.Y(0)-A.Y(1.5),{fill:'none',fo:0,stroke:C.hi,sw:3,rx:1})+label('1 μC',(A.X(3)+A.X(4))/2,A.Y(0)+64,{size:22,color:QC,anchor:'middle'}));
  s+=panel(740,110,420,290,label('1回の仕事',950,165,{size:26,color:C.dim,anchor:'middle'})
   +label('1 μC × その時の電圧',950,240,{size:30,color:C.ink,anchor:'middle'})
   +label('＝ 細い長方形',950,295,{size:28,color:WC,anchor:'middle'})
   +fade(seg(p,.65,.85),label('6本で 7.5 μJ',950,365,{size:36,color:WC,anchor:'middle',weight:700})),seg(p,.3,.45));
  return s;
 },
 [K+'fine']:(p)=>{
  const A=vq();let s=A.svg;
  const f=seg(p,.05,.3);s+=steps(A,6,{g:1-f})+steps(A,60,{g:f});
  s+=vqLine(A);
  s+=fade(seg(p,.65,.85),triangle(A,{fo:.0})+draw([[A.X(0),A.Y(0)],[A.X(6),A.Y(0)],[A.X(6),A.Y(3)],[A.X(0),A.Y(0)]],1,{color:C.hi,w:3}));
  s+=panel(740,110,420,290,label('細かくすると',950,165,{size:26,color:C.dim,anchor:'middle'})
   +label('6本　→ 7.5 μJ',950,230,{size:32,color:WC,anchor:'middle'})
   +fade(seg(p,.2,.35),label('60本 → 8.85 μJ',950,290,{size:32,color:WC,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.8),label('→ 三角形の面積へ',950,360,{size:30,color:C.hi,anchor:'middle',weight:700})),0.999);
  return s;
 },
 [K+'tri']:(p)=>{
  const A=vq();let s=A.svg+triangle(A,{g:seg(p,0,.2)})+vqLine(A);
  s+=fade(seg(p,.15,.3),label('底辺 6 μC',(A.X(0)+A.X(6))/2,A.Y(0)+64,{size:24,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),line(A.X(6)+14,A.Y(0),A.X(6)+14,A.Y(3),{color:VC,w:4})+label('高さ 3 V',A.X(6)+26,(A.Y(0)+A.Y(3))/2+8,{size:24,color:VC,weight:700}));
  s+=panel(780,120,380,270,label('仕事 ＝ 三角形',970,175,{size:28,color:C.dim,anchor:'middle'})
   +T(`\\tfrac12\\times${q6}\\times${v3}`,970,250,{size:36})
   +fade(seg(p,.55,.75),T(`=${cs(WC,'9'+U('\\mu J'))}`,970,335,{size:52})),seg(p,.3,.5),WC);
  return s;
 },
 [K+'units']:(p)=>{
  return panel(170,90,860,330,label('単位',600,145,{size:28,color:C.dim,anchor:'middle'})
   +T(`${cs(QC,U('\\mu C'))}\\times${cs(VC,U('V'))}=${cs(WC,U('\\mu J'))}`,600,225,{size:50})
   +fade(seg(p,.4,.6),T(`${cs(QC,U('C'))}\\times${cs(VC,'\\dfrac{\\mathrm{J}}{\\mathrm{C}}')}=${cs(WC,U('J'))}`,600,345,{size:48})
    +label('1 V ＝ 1 J/C',930,352,{size:24,color:VC,anchor:'middle'})),seg(p,0,.12));
 },
 // ===== S5 長方形と三角形 =====
 [K+'fx']:(p)=>{
  const A=fx({x:110,y:420,w:420,h:280,xmax:3.6,ymax:3,g:seg(p,0,.2)});
  let s=A.svg+area(A,0,3,2,{g:seg(p,.2,.5)})+fline(A,0,3,2,{p:seg(p,.1,.3)})+rectLabels(A,0,3,2,{gh:seg(p,.4,.55),gw:seg(p,.4,.55),ga:seg(p,.55,.7),h:'2 N',w:'3 m',a:'6 J'});
  s+=fade(seg(p,0,.2),label('仕事の回：力が一定',330,70,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('→ 長方形',470,505,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'compare']:(p)=>{
  const A=fx({x:110,y:420,w:420,h:280,xmax:3.6,ymax:3});
  let s=A.svg+area(A,0,3,2)+fline(A,0,3,2)+rectLabels(A,0,3,2,{h:'2 N',w:'3 m',a:'6 J'})+label('仕事の回：力が一定',330,70,{size:26,color:C.F,anchor:'middle',weight:700})+label('→ 長方形',470,505,{size:26,color:C.hi,anchor:'middle',weight:700});
  const B=vq({x:700,y:420,w:380,h:280,xmax:7,ymax:3.6,g:seg(p,0,.2)});
  s+=B.svg+vqLine(B,seg(p,.15,.4))+triangle(B,{g:seg(p,.35,.6)});
  s+=fade(seg(p,.35,.55),label('9 μJ',B.X(4.6),B.Y(.7),{size:30,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,0,.2),label('コンデンサ：電圧が 0 から増える',890,70,{size:26,color:VC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('→ 三角形',890,505,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'double']:(p)=>{
  const A=fx({x:110,y:420,w:420,h:280,xmax:3.6,ymax:3});
  let s=A.svg+area(A,0,3,2)+fline(A,0,3,2)+rectLabels(A,0,3,2,{h:'2 N',w:'3 m',a:'6 J'})+label('仕事の回：力が一定',330,70,{size:26,color:C.F,anchor:'middle',weight:700});
  const B=vq({x:700,y:420,w:380,h:280,xmax:7,ymax:3.6});
  const g=seg(p,.05,.3);
  s+=fade(g,rect(B.X(0),B.Y(3),B.X(6)-B.X(0),B.Y(0)-B.Y(3),{fill:C.a,fo:.12,stroke:C.a,sw:3,rx:1}).replace('/>',' stroke-dasharray="10 8"/>'));
  s+=B.svg+triangle(B)+vqLine(B);
  s+=fade(g,label('18 μJ ？',B.X(1.6),B.Y(2.3),{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=label('9 μJ',B.X(4.6),B.Y(.7),{size:30,color:WC,anchor:'middle',weight:700});
  s+=fade(seg(p,.5,.7),label('3 V のまま運ぶ → 2倍で 多すぎ',890,70,{size:26,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('正しいのは 三角形',890,505,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'summary']:(p)=>{
  const col=(x,title,color,body,g)=>card(x,110,340,300,label(title,x+170,165,{size:28,color,anchor:'middle',weight:700})+body,g,color);
  let s=col(60,'実験事実',C.dim,T(`${cs(QC,'Q')}\\propto ${cs(VC,'V')}`,230,260,{size:50})+label('同じコンデンサで',230,350,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.25));
  s+=col(430,'定義',CC,T(`${cs(CC,'C')}=\\dfrac{${cs(QC,'Q')}}{${cs(VC,'V')}}`,600,265,{size:50})+label('単位 F ＝ C/V',600,355,{size:24,color:CC,anchor:'middle'}),seg(p,.25,.45));
  s+=col(800,'導いた結果',WC,T(`\\tfrac12\\times${q6}\\times${v3}`,970,250,{size:28})+T(`=${cs(WC,'9'+U('\\mu J'))}`,970,320,{size:44})+label('三角形の面積',970,380,{size:24,color:WC,anchor:'middle'}),seg(p,.5,.7));
  return s;
 },
 // ===== S6 次の問い =====
 [K+'flow']:(p)=>{
  let s=circuit({volt:'3 V'})+charges(Math.min(6,6*seg(p,.05,.9)),{glow:1});
  s+=fade(seg(p,.1,.3),label('充電の間',PX+20,170,{size:28,color:C.dim})+label('導線の中を 電子が流れる',PX+20,225,{size:30,color:NEG,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  // a wire with a cross-section; electrons drifting through it
  const y=260,x1=110,x2=640;let s=rect(x1,y-45,x2-x1,90,{fill:'#8795ad',fo:.18,stroke:C.dim,sw:2.5,rx:40});
  s+=fade(seg(p,.1,.3),`<ellipse cx="400" cy="${y}" rx="22" ry="45" fill="${C.hi}" fill-opacity=".15" stroke="${C.hi}" stroke-width="3"/>`);
  for(let i=0;i<7;i++){const x=x1+30+((i*80+p*260)%(x2-x1-60)),yy=y+(i%3-1)*24;s+=electron(x,yy,{r:11});}
  s+=panel(720,120,440,250,label('次の問い',940,175,{size:26,color:C.dim,anchor:'middle'})+label('導線を流れる電荷の',940,240,{size:30,color:C.ink,anchor:'middle'})
   +label('「流れの量」は どう測る？',940,300,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
};
