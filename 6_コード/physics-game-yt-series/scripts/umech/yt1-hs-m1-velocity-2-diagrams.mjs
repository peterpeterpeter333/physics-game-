// 高校編「速度・深く学ぶ 2/2」(ys-hs-m1-velocity-2) — 図。Stage 1200×515.
// 色：位置 x・変位 水色、速度 v 紫、時刻 t 金、道のり・強調 黄。部品は 1/2 の図から借りる。
import {C,mix,seg,fade,label,line,rect,dot,draw,arrow,axes,tex} from './anim.mjs';
import {card,NL,numberLine,thing,backForth,brace} from './yt1-hs-m1-velocity-1-diagrams.mjs';

const K='hs-m1-velocity-2:';
const X=NL.X;
const xs=m=>m<0?`−${-m}`:String(m);

// ---- x–t graph ---------------------------------------------------------------------------
export const xtAxes=(g=1,{x=110,y=440,w=560,h=360}={})=>axes({x,y,w,h,xmax:5.4,ymax:12.6,xlabel:'t [s]',ylabel:'位置 x [m]',xticks:[1,2,3,4,5],yticks:[2,4,6,8,10,12],grid:true,g,xcolor:C.t,ycolor:C.x});
export const L1=t=>4+3*t, L2=t=>10-2*t, L0=t=>3*t;
export function xtLine(A,f,{from=0,to=2.8,p=1,color=C.v,w=4}={}){return A.plot(f,{from,to,p,color,w,steps:2});}
export function slopeTri(A,f,t0,t1,{g=1,color=C.hi,dx='',dt='',side=1}={}){
 const a=[A.X(t0),A.Y(f(t0))],b=[A.X(t1),A.Y(f(t0))],c=[A.X(t1),A.Y(f(t1))];
 return fade(g,line(a[0],a[1],b[0],b[1],{color:C.t,w:3,dash:'7 6'})+line(b[0],b[1],c[0],c[1],{color:C.x,w:3,dash:'7 6'})
  +(dt?label(dt,(a[0]+b[0])/2,a[1]+(f(t1)>f(t0)?30:-14),{size:24,color:C.t,anchor:'middle'}):'')
  +(dx?label(dx,b[0]+12*side,(b[1]+c[1])/2+8,{size:24,color:C.x,anchor:side>0?'start':'end'}):''));
}
const pt=(A,t,f,color=C.hi,r=8)=>dot(A.X(t),A.Y(f(t)),r,color);

// velocity arrow on the number line: from m, length v metres (sign = direction)
const varrow=(m,v,y,g=1,txt='')=>arrow(X(m),y,X(m+v),y,{color:C.v,w:6,g,head:18})+fade(g,txt?label(txt,X(m+v/2),y-18,{size:26,color:C.v,anchor:'middle',weight:700}):'');

function ball(p){
 let s=line(500,40,700,40,{color:C.dim,w:3});
 const n=Math.floor(6*seg(p,.1,.8)+1e-6);
 for(let i=0;i<=n;i++){const y=60+9*i*i+6*i;s+=dot(600,y,14,C.hi,i===n?1:.35);}
 return s;
}

export const hsVelocity2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=backForth(p,{g1:seg(p,.05,.45),g2:seg(p,.55,.95)});
  s+=fade(seg(p,.85,.97),label('道のり 3 ＋ 3 ＝ 6 m',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p)=>backForth(1)+card(220,385,760,100,label('「どこへ 移ったか」 ＝ ？',600,448,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 [K+'track']:(p)=>{
  const g1=seg(p,.3,.55),g2=seg(p,.65,.95);
  const q=p<.3?0:p<.6?.05+.4*(p-.3)/.3:.55+.4*Math.min(1,(p-.6)/.35);
  let s=backForth(q,{g1,g2});
  s+=fade(seg(p,.05,.2),label('はじめ x ＝ 2 m',X(2),NL.y+90,{size:26,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),label('5 m',X(5),NL.y+90,{size:26,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.85,.97),label('あと x ＝ 2 m',X(2),NL.y+130,{size:26,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'series']:(p)=>{
  let s=card(110,150,430,190,label('移った量',325,230,{size:36,color:C.x,anchor:'middle',weight:700})+label('（変位）',325,285,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.x);
  s+=arrow(570,245,680,245,{color:C.dim,w:4,g:seg(p,.4,.55)});
  s+=card(710,150,380,190,label('速度',900,235,{size:48,color:C.v,anchor:'middle',weight:700})+label('向きを持つ 速さ',900,290,{size:26,color:C.ink,anchor:'middle'}),seg(p,.5,.65),C.v);
  return s;
 },
 // ================= S2 変位 =================
 [K+'disp']:(p)=>{
  let s=card(150,20,900,110,label('変位 ＝ あとの位置 − はじめの位置',600,90,{size:38,color:C.x,anchor:'middle',weight:700}),seg(p,.05,.25),C.x);
  s+=fade(seg(p,.6,.75),label('（定義）',1000,170,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.3,.5),backForth(1,{y:380}));
  return s;
 },
 [K+'disp0']:(p)=>{
  let s=card(150,20,900,110,label('変位 ＝ あとの位置 − はじめの位置',600,90,{size:38,color:C.x,anchor:'middle',weight:700}),1,C.x);
  s+=backForth(1,{y:380});
  s+=card(790,165,370,80,label('2 − 2 ＝ 0 m',975,218,{size:36,color:C.x,anchor:'middle',weight:700}),seg(p,.1,.3),C.x);
  s+=fade(seg(p,.55,.7),label('出発点に 戻った',975,290,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'compare']:(p)=>{
  let s=backForth(1);
  s+=fade(seg(p,.05,.25),label('道のり：矢印の長さを 全部足す 3 ＋ 3 ＝ 6 m',600,48,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),dot(X(2),NL.y,12,C.x)+label('変位：始点 → 終点 の矢印 1本',600,420,{size:28,color:C.x,anchor:'middle',weight:700})+label('始点 ＝ 終点 なので 長さ 0',600,465,{size:26,color:C.x,anchor:'middle'}));
  return s;
 },
 [K+'oneway']:(p)=>{
  let s=numberLine({pos:0})+thing(mix(2,7,seg(p,.05,.4)));
  s+=arrow(X(2),NL.y-90,X(7),NL.y-90,{color:C.hi,w:5,g:seg(p,.05,.4),head:16})+fade(seg(p,.3,.45),label('道のり 5 m',X(4.5),NL.y-108,{size:26,color:C.hi,anchor:'middle'}));
  s+=arrow(X(2),NL.y+70,X(7),NL.y+70,{color:C.x,w:5,g:seg(p,.4,.55),head:16})+fade(seg(p,.5,.6),label('変位 ＋5 m',X(4.5),NL.y+110,{size:26,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('折り返さない → 同じ大きさ',600,470,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'left']:(p)=>{
  const u=seg(p,.1,.6);
  let s=numberLine({pos:1})+thing(mix(2,-3,u));
  s+=fade(seg(p,.02,.12),label('はじめ x ＝ 2 m',X(2),NL.y+90,{size:26,color:C.x,anchor:'middle'}));
  s+=arrow(X(2),NL.y-90,X(-3),NL.y-90,{color:C.hi,w:5,g:u,head:16})+fade(seg(p,.4,.55),label('左へ 5 m',X(-0.5),NL.y-108,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),label('あと x ＝ −3 m',X(-3),NL.y+90,{size:26,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'leftd']:(p)=>{
  let s=numberLine({pos:1})+thing(-3);
  s+=arrow(X(2),NL.y-90,X(-3),NL.y-90,{color:C.x,w:6,head:18});
  s+=label('はじめ 2 m',X(2),NL.y+90,{size:24,color:C.x,anchor:'middle'})+label('あと −3 m',X(-3),NL.y+90,{size:24,color:C.x,anchor:'middle'});
  s+=card(630,385,530,110,label('変位 ＝ (−3) − 2 ＝ −5 m',895,430,{size:34,color:C.x,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('マイナス ＝ 左向き に 5 m',895,475,{size:26,color:C.ink,anchor:'middle'})),seg(p,.05,.25),C.x);
  return s;
 },
 // ================= S3 速度 =================
 [K+'nodir']:(p)=>{
  let s=numberLine({y:200,pos:0,zero:1});
  s+=varrow(2,5,130,seg(p,.05,.2),'速さ 5 m/s')+varrow(2,-5,275,seg(p,.1,.25),'');
  s+=fade(seg(p,.1,.25),label('速さ 5 m/s',X(-0.5),318,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),label('速さ だけでは 向きが 分からない',600,370,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(250,400,700,90,label('速度 v ＝ 速さ ＋ 向き',600,458,{size:36,color:C.v,anchor:'middle',weight:700}),seg(p,.6,.75),C.v);
  return s;
 },
 [K+'sign']:(p)=>{
  let s=numberLine({y:270,pos:1});
  s+=varrow(2,5,170,seg(p,.05,.2),'v ＝ ＋5 m/s');
  s+=varrow(2,-5,400,seg(p,.5,.65),'v ＝ −5 m/s');
  s+=fade(seg(p,.05,.2),label('右へ',X(2)-14,178,{size:24,color:C.dim,anchor:'end'}));
  s+=fade(seg(p,.5,.65),label('左へ',X(2)+14,408,{size:24,color:C.dim}));
  return s;
 },
 ...Object.fromEntries([['predict',0],['answer',1]].map(([k,ans])=>[K+k,(p)=>{
  let s=numberLine({y:300,pos:1});
  s+=thing(4,300,X,C.v)+varrow(4,-5,200,ans?1:seg(p,.05,.2),'v ＝ −5 m/s');
  s+=thing(6,300,X,'#8fd3ff')+varrow(6,3,130,ans?1:seg(p,.15,.3),'v ＝ ＋3 m/s');
  if(!ans)s+=card(250,400,700,90,label('−5 は ＋3 より 遅い？',600,458,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  else{
   s+=fade(seg(p,.05,.2),label('速さ 5',X(-1)-20,208,{size:26,color:C.ink,anchor:'end'})+label('速さ 3',X(9)+24,138,{size:26,color:C.ink}));
   s+=card(150,400,900,90,label('マイナス ＝ 遅い ではなく 逆向き',600,458,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  }
  return s;
 }])),
 [K+'delta']:(p)=>card(250,120,700,240,label('Δ（デルタ）',600,200,{size:40,color:C.ink,anchor:'middle',weight:700})+label('＝ あと − はじめ の 差の印',600,270,{size:34,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.55,.7),label('新しい量 ではない',600,325,{size:26,color:C.dim,anchor:'middle'})),seg(p,.05,.25),C.hi),
 [K+'dxdt']:(p)=>{
  let s=fade(seg(p,.05,.2),tex('\\Delta x',220,140,{size:56})+label('＝ あとの位置 − はじめの位置',300,155,{size:32,color:C.x}));
  s+=fade(seg(p,.35,.5),tex('\\Delta t',220,260,{size:56})+label('＝ あとの時刻 − はじめの時刻',300,275,{size:32,color:C.t}));
  s+=card(250,350,700,100,label('変位 ＝ Δx',600,413,{size:38,color:C.x,anchor:'middle',weight:700}),seg(p,.65,.8),C.x);
  return s;
 },
 [K+'vbar']:(p)=>{
  let s=fade(seg(p,.05,.2),label('平均の速度',330,140,{size:32,color:C.v,anchor:'middle',weight:700})+tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}',330,260,{size:72}));
  s+=fade(seg(p,.3,.45),label('← 変位',470,235,{size:26,color:C.x})+label('← かかった時間',470,310,{size:26,color:C.t}));
  s+=fade(seg(p,.6,.75),label('（定義）',330,420,{size:28,color:C.hi,anchor:'middle'}));
  s+=card(720,150,420,200,label('くらべる',930,200,{size:24,color:C.dim,anchor:'middle'})+label('平均の速さ',930,255,{size:30,color:C.ink,anchor:'middle'})+label('＝ 道のり ÷ 時間',930,305,{size:30,color:C.ink,anchor:'middle'}),seg(p,.75,.9));
  return s;
 },
 [K+'round']:(p)=>{
  let s=fade(seg(p,.02,.15),label('往復：道のり 6 m、変位 0 m、時間 6 s',600,80,{size:30,color:C.ink,anchor:'middle'}));
  s+=card(120,140,960,120,label('平均の速さ ＝ 6 m ÷ 6 s ＝ 1 m/s',600,215,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.25,.4),C.hi);
  s+=card(120,300,960,120,label('平均の速度 ＝ 0 m ÷ 6 s ＝ 0 m/s',600,375,{size:36,color:C.v,anchor:'middle',weight:700}),seg(p,.6,.75),C.v);
  return s;
 },
 // ================= S4 速度が一定のとき =================
 [K+'assume']:(p)=>card(200,130,800,200,label('仮定',600,200,{size:32,color:C.hi,anchor:'middle',weight:700})+label('速度 v が ずっと 一定',600,270,{size:40,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 [K+'x0']:(p)=>{
  let s=numberLine({pos:0,zero:1});
  s+=fade(seg(p,.05,.2),thing(1)+tex('x_0',X(1),NL.y+90,{size:44})+label('時刻 0',X(1),NL.y+140,{size:24,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),thing(8,NL.y,X,C.dim)+tex('x',X(8),NL.y+90,{size:44})+label('時刻 t',X(8),NL.y+140,{size:24,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('x₀ ＝ 出発点の位置',X(1),120,{size:30,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'start']:(p)=>{
  let s=fade(seg(p,.03,.15),tex('\\Delta x=x-x_0',300,110,{size:46}));
  s+=fade(seg(p,.2,.32),tex('\\Delta t=t-0=t',300,210,{size:46}));
  s+=fade(seg(p,.55,.7),tex('v=\\dfrac{x-x_0}{t}',800,170,{size:64}));
  s+=fade(seg(p,.5,.6),arrow(500,165,600,165,{color:C.dim,w:3,head:12}));
  s+=fade(seg(p,.8,.92),label('一定 → 平均の速度 ＝ v',800,330,{size:30,color:C.v,anchor:'middle'}));
  return s;
 },
 [K+'mult']:(p)=>{
  let s=tex('v=\\dfrac{x-x_0}{t}',600,90,{size:50});
  const c=seg(p,.4,.55);
  s+=fade(seg(p,.05,.2)*(1-c),tex('v\\,{\\color{#ffe28a}\\times t}=\\dfrac{x-x_0}{t}\\,{\\color{#ffe28a}\\times t}',600,230,{size:50}));
  s+=fade(c,tex('v\\,{\\color{#ffe28a}\\times t}=\\dfrac{x-x_0}{\\cancel{t}}\\,{\\color{#ffe28a}\\times \\cancel{t}}',600,230,{size:50}));
  s+=fade(seg(p,.05,.2),label('両辺に t を掛ける',900,240,{size:26,color:C.hi}));
  s+=card(400,330,400,110,tex('vt=x-x_0',600,390,{size:56}),seg(p,.6,.75),C.v);
  return s;
 },
 [K+'add']:(p)=>{
  let s=tex('vt=x-x_0',600,80,{size:50});
  s+=fade(seg(p,.05,.2),tex('vt\\,{\\color{#ffe28a}+x_0}=x-x_0\\,{\\color{#ffe28a}+x_0}',600,190,{size:50})+label('両辺に x₀ を足す',930,200,{size:26,color:C.hi}));
  s+=fade(seg(p,.25,.4),tex('x_0+vt=x',600,290,{size:50}));
  s+=card(380,350,440,110,tex('x=x_0+vt',600,410,{size:60}),seg(p,.55,.7),C.hi);
  s+=fade(seg(p,.55,.7),label('左右を 入れ替え',940,420,{size:26,color:C.dim}));
  return s;
 },
 [K+'mean']:(p)=>{
  let s=numberLine({pos:0,zero:0})+tex('x=x_0+vt',600,60,{size:46});
  s+=thing(1)+tex('x_0',X(1),NL.y+80,{size:40});
  for(let i=0;i<3;i++){const g=seg(p,.15+i*.15,.28+i*.15);s+=arrow(X(1+2*i),NL.y-80,X(3+2*i),NL.y-80,{color:C.v,w:5,g,head:14})+fade(g,label('v',X(2+2*i),NL.y-96,{size:28,color:C.v,anchor:'middle',weight:700})+label('1 s',X(2+2*i),NL.y-44,{size:22,color:C.t,anchor:'middle'}));}
  s+=fade(seg(p,.62,.75),brace(X(1),X(7),NL.y-130,{dir:-1,text:'vt（t 秒ぶん）',color:C.v,size:26})+tex('x',X(7),NL.y+80,{size:40})+thing(7,NL.y,X,C.dim));
  return s;
 },
 [K+'num']:(p)=>{
  let s=fade(seg(p,.03,.2),label('x₀ ＝ 4 m',250,110,{size:32,color:C.x,anchor:'middle'})+label('v ＝ ＋3 m/s',600,110,{size:32,color:C.v,anchor:'middle'})+label('t ＝ 2 s',950,110,{size:32,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),tex('x=4+3\\times 2',500,260,{size:56,auto:false}));
  s+=fade(seg(p,.6,.75),tex('=10\\,\\mathrm{m}',820,260,{size:56,auto:false,color:C.x}));
  return s;
 },
 // ================= S5 x-t グラフの傾き =================
 [K+'graph']:(p)=>{
  const A=xtAxes(seg(p,.05,.3));let s=A.svg;
  s+=fade(seg(p,.4,.55),label('横：時刻 t',940,170,{size:30,color:C.t,anchor:'middle'})+label('縦：位置 x',940,230,{size:30,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('x-t グラフ',940,320,{size:34,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'line']:(p)=>{
  const A=xtAxes();let s=A.svg;
  [0,1,2].forEach((t,i)=>{s+=fade(seg(p,.05+i*.1,.12+i*.1),pt(A,t,L1));});
  s+=xtLine(A,L1,{p:seg(p,.35,.55)});
  s+=fade(seg(p,.6,.75),label('x₀ ＝ 4',A.X(0)+16,A.Y(4)+34,{size:26,color:C.x,weight:700}));
  s+=card(740,140,420,140,label('x ＝ 4 ＋ 3t',950,200,{size:34,color:C.v,anchor:'middle',weight:700})+label('点は 1本の 直線に 並ぶ',950,250,{size:24,color:C.ink,anchor:'middle'}),seg(p,.3,.45));
  return s;
 },
 [K+'slope']:(p)=>{
  const A=xtAxes();let s=A.svg+xtLine(A,L1)+pt(A,0,L1)+pt(A,2,L1);
  s+=slopeTri(A,L1,0,2,{g:seg(p,.05,.3),dt:'Δt ＝ 2 s',dx:'Δx ＝ 6 m'});
  s+=card(740,140,420,170,tex('\\dfrac{\\Delta x}{\\Delta t}=\\dfrac{6}{2}=3',950,215,{size:44})+fade(seg(p,.6,.75),label('傾き ＝ 速度 3 m/s',950,285,{size:28,color:C.v,anchor:'middle',weight:700})),seg(p,.3,.45),C.v);
  return s;
 },
 [K+'line2']:(p)=>{
  const A=xtAxes();let s=A.svg+fade(.5,xtLine(A,L1));
  s+=fade(seg(p,.05,.2),pt(A,0,L2,C.a));
  s+=xtLine(A,L2,{to:5,p:seg(p,.25,.55),color:C.a});
  s+=fade(seg(p,.6,.75),pt(A,3,L2,C.a)+label('(3 s, 4 m)',A.X(3)+14,A.Y(4)-14,{size:24,color:C.a}));
  s+=card(740,140,420,170,label('x ＝ 10 − 2t',950,200,{size:34,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('10 − 2 × 3 ＝ 4',950,265,{size:28,color:C.ink,anchor:'middle'})),seg(p,.1,.25),C.a);
  return s;
 },
 [K+'slope2']:(p)=>{
  const A=xtAxes();let s=A.svg+fade(.5,xtLine(A,L1))+xtLine(A,L2,{to:5,color:C.a})+pt(A,0,L2,C.a)+pt(A,3,L2,C.a);
  s+=slopeTri(A,L2,0,3,{g:seg(p,.05,.3),dt:'Δt ＝ 3 s',dx:'Δx ＝ −6 m'});
  s+=card(740,140,420,190,tex('\\dfrac{\\Delta x}{\\Delta t}=\\dfrac{-6}{3}=-2',950,215,{size:42})+fade(seg(p,.55,.7),label('右下がり ＝ 左向き',950,295,{size:28,color:C.a,anchor:'middle',weight:700})),seg(p,.3,.45),C.a);
  return s;
 },
 ...Object.fromEntries([['height',0],['height2',1]].map(([k,st])=>[K+k,(p)=>{
  const A=xtAxes();let s=A.svg+xtLine(A,L1)+xtLine(A,L2,{to:5,color:C.a});
  s+=pt(A,0,L1,C.v,10)+pt(A,0,L2,C.a,10);
  s+=label('1本目',A.X(2.6)+10,A.Y(L1(2.6))+6,{size:24,color:C.v})+label('2本目',A.X(4.6),A.Y(L2(4.6))-16,{size:24,color:C.a});
  if(!st)s+=card(740,140,420,170,label('時刻 0 の 高さ',950,195,{size:28,color:C.ink,anchor:'middle'})+label('1本目 4 m、2本目 10 m',950,245,{size:28,color:C.x,anchor:'middle'})+fade(seg(p,.1,.25),label('高い ＝ 速い？',950,290,{size:28,color:C.a,anchor:'middle',weight:700})),seg(p,.05,.2),C.a);
  else s+=card(740,120,420,250,label('傾き',950,170,{size:28,color:C.ink,anchor:'middle'})+label('1本目 3 → 速さ 3',950,220,{size:28,color:C.v,anchor:'middle'})+label('2本目 −2 → 速さ 2',950,265,{size:28,color:C.a,anchor:'middle'})+fade(seg(p,.4,.55),label('速度 ＝ 傾き、高さ ＝ 位置',950,330,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 }])),
 [K+'parallel']:(p)=>{
  const A=xtAxes();let s=A.svg;
  s+=xtLine(A,L1,{p:seg(p,.05,.25)})+xtLine(A,L0,{to:4,p:seg(p,.3,.5),color:'#8fd3ff'});
  s+=fade(seg(p,.2,.3),label('x₀ ＝ 4',A.X(2.8)+12,A.Y(12.4)+8,{size:24,color:C.v}));
  s+=fade(seg(p,.45,.55),label('x₀ ＝ 0',A.X(4)+12,A.Y(12)+24,{size:24,color:'#8fd3ff'}));
  s+=card(740,140,420,170,label('傾きは どちらも 3',950,200,{size:30,color:C.ink,anchor:'middle',weight:700})+label('速度 同じ、出発点 だけ 違う',950,260,{size:26,color:C.hi,anchor:'middle'}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'xvt']:(p)=>{
  let s=card(150,90,900,120,label('x ＝ vt',380,165,{size:40,color:C.dim,anchor:'middle',weight:700})+label('x₀ ＝ 0 と 選んだ ときだけ',760,165,{size:30,color:C.dim,anchor:'middle'}),seg(p,.05,.2));
  s+=card(150,260,900,140,tex('x=x_0+vt',380,335,{size:56})+label('出発点 x₀ を 足す',760,345,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 // ================= S6 まとめと次の問い =================
 [K+'sum']:(p)=>{
  let s=card(80,50,500,150,label('変位 Δx',330,110,{size:34,color:C.x,anchor:'middle',weight:700})+label('＝ あと − はじめ の 位置',330,165,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.x);
  s+=card(620,50,500,150,label('速度 v',870,110,{size:34,color:C.v,anchor:'middle',weight:700})+label('＝ 向きの付いた 速さ',870,165,{size:26,color:C.ink,anchor:'middle'}),seg(p,.3,.45),C.v);
  s+=card(250,240,700,200,label('x-t グラフの 傾き ＝ 速度',600,300,{size:36,color:C.hi,anchor:'middle',weight:700})+tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}',600,385,{size:40}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'sum2']:(p)=>{
  const A=xtAxes(1,{x:110,y:440,w:520,h:340});let s=A.svg+xtLine(A,L1)+pt(A,0,L1);
  s+=label('x₀',A.X(0)+16,A.Y(4)+30,{size:26,color:C.x,weight:700});
  s+=slopeTri(A,L1,1,2,{g:1,dt:'1 s',dx:'v',side:1});
  s+=card(720,150,440,170,tex('x=x_0+vt',940,215,{size:52})+label('傾き v、切片 x₀',940,285,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'ball']:(p)=>{
  let s=ball(p);
  s+=fade(seg(p,.55,.7),label('間隔が 広がる',850,250,{size:30,color:C.hi,weight:700})+label('→ だんだん 速くなる',850,300,{size:28,color:C.ink}));
  s+=fade(seg(p,.05,.2),label('同じ時間ごとの 位置',250,250,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=fade(.35,ball(1));
  s+=card(150,150,900,200,label('速度そのものが 変わるとき',600,225,{size:34,color:C.ink,anchor:'middle'})+label('「変わり方」を どう 数にする？',600,295,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の単元',600,175,{size:28,color:C.dim,anchor:'middle'})+label('加速度',600,260,{size:56,color:C.a,anchor:'middle',weight:700})+label('速度の 変わり方を 数にする',600,315,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a);
  s+=fade(seg(p,.5,.7),label('加速度・深く学ぶ 1/2 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
