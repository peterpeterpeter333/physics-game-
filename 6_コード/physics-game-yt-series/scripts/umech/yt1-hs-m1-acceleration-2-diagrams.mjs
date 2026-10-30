// 高校編「加速度・深く学ぶ 2/2」(ys-hs-m1-acceleration-2) — 図。Stage 1200×515.
// 色：位置 x 水色、速度 v 紫、加速度・速度の変化 赤、時刻 t 金、強調 黄。部品は速度・加速度 1/2 の図から借りる。
import {C,mix,seg,fade,label,line,rect,dot,arrow,axes,tex} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {xtAxes,xtLine,slopeTri} from './yt1-hs-m1-velocity-2-diagrams.mjs';

const K='hs-m1-acceleration-2:';
const fmt1=v=>{const r=Math.round(v*10)/10;return (r<0?'−':'')+String(Math.abs(r));};

// ---- road with a car, velocity (purple) / acceleration (red) arrows -------------------------
function road(y=300,{pos=1}={}){
 let s=line(60,y,1140,y,{color:C.dim,w:3});
 if(pos)s+=arrow(980,y+60,1120,y+60,{color:C.x,w:3,head:12})+label('正の向き',1050,y+95,{size:22,color:C.x,anchor:'middle'});
 return s;
}
export function car(x,y,color=C.hi){return rect(x-34,y-44,68,32,{fill:color,fo:.85,stroke:color,rx:7})+dot(x-18,y-8,8,C.ink)+dot(x+18,y-8,8,C.ink);}
const varr=(x,y,v,k,txt='',g=1)=>Math.abs(v)<.05?'':arrow(x,y,x+v*k,y,{color:C.v,w:6,head:16,g})+fade(g,txt?label(txt,x+v*k/2,y-16,{size:26,color:C.v,anchor:'middle',weight:700}):'');
const aarr=(x,y,a,k,txt='',g=1)=>arrow(x,y,x+a*k,y,{color:C.a,w:6,head:16,g})+fade(g,txt?label(txt,x+a*k/2,y+36,{size:26,color:C.a,anchor:'middle',weight:700}):'');

// brake: v = 18 − 3t, x = 18t − 1.5t² (m), 14 px per m
const BX=t=>130+14*(18*t-1.5*t*t);
function brakeScene(t,{y=300,info=1}={}){
 let s=road(y)+car(BX(t),y);
 s+=varr(BX(t),y-80,18-3*t,14);
 if(info)s+=label(`t ＝ ${fmt1(t)} s`,200,80,{size:30,color:C.t,weight:700})+label(`v ＝ ${18-3*t<.05?'0':'＋'+fmt1(18-3*t)} m/s`,200,130,{size:30,color:C.v,weight:700});
 return s;
}
// left-moving object: v = −2 → −5 in 1.0 s (40 px per m/s for arrows)
function leftRows(p,{g1=1,g2=1,speed=0}={}){
 let s=road(400);
 s+=fade(g1,label('t ＝ 0 s',120,140,{size:28,color:C.t,weight:700})+car(900,170,C.E)+varr(900,110,-2,40,'v₀ ＝ −2 m/s'));
 s+=fade(g2,label('t ＝ 1.0 s',120,320,{size:28,color:C.t,weight:700})+car(700,350,C.E)+varr(700,290,-5,40,'v ＝ −5 m/s'));
 if(speed)s+=fade(speed,label('速さ 2',990,118,{size:28,color:C.ink,weight:700})+label('速さ 5',790,298,{size:28,color:C.ink,weight:700}));
 return s;
}

// ---- 2×2 table -------------------------------------------------------------------------------
function table(p,{g=1,cells=1,hl=1}={}){
 const X0=330,W=380,Y0=120,Hh=150;
 let s=fade(g,label('加速度 a →',X0-20,60,{size:24,color:C.a,anchor:'end'})+label('右向き（＋）',X0+W/2,70,{size:28,color:C.a,anchor:'middle',weight:700})+label('左向き（−）',X0+W*1.5,70,{size:28,color:C.a,anchor:'middle',weight:700})
  +label('速度 v ↓',90,105,{size:24,color:C.v})+label('右向き（＋）',X0-20,Y0+Hh/2+10,{size:28,color:C.v,anchor:'end',weight:700})+label('左向き（−）',X0-20,Y0+Hh*1.5+10,{size:28,color:C.v,anchor:'end',weight:700}));
 const cell=(i,j,vd,ad,txt,col,ex,k)=>{const x=X0+W*j,y=Y0+Hh*i,cx=x+W/2,a=seg(cells,.0+k*.15,.15+k*.15);
  return fade(g,rect(x,y,W,Hh,{fill:'#131f38',fo:.9,stroke:C.faint,sw:2,rx:0}))+fade(a,arrow(cx-vd*70,y+40,cx+vd*70,y+40,{color:C.v,w:5,head:14})+arrow(cx-ad*45,y+70,cx+ad*45,y+70,{color:C.a,w:5,head:14})
   +label(txt,cx,y+115,{size:30,color:col,anchor:'middle',weight:700})+(ex?fade(hl,label(ex,cx,y+142,{size:22,color:C.dim,anchor:'middle'})):''));};
 s+=cell(0,0,1,1,'速くなる',C.hi,'',0)+cell(0,1,1,-1,'遅くなる',C.x,'例：18 → 0 m/s',1)+cell(1,0,-1,1,'遅くなる',C.x,'',2)+cell(1,1,-1,-1,'速くなる',C.hi,'例：−2 → −5 m/s',3);
 return s;
}

// ---- v–t graph -------------------------------------------------------------------------------
export const vtAxes=(g=1,{x=110,y=450,w=560,h=380,xmax=6.6,ymax=20,yticks=[3,6,9,12,15,18],xticks=[1,2,3,4,5,6]}={})=>axes({x,y,w,h,xmax,ymax,xlabel:'t [s]',ylabel:'速度 v [m/s]',xticks,yticks,grid:true,g,xcolor:C.t,ycolor:C.v});
const V1=t=>2+3*t, VB=t=>18-3*t, VS=t=>t*t;
function vslope(A,f,t0,t1,{g=1,dv='',dt='',side=1}={}){
 const a=[A.X(t0),A.Y(f(t0))],b=[A.X(t1),A.Y(f(t0))],c=[A.X(t1),A.Y(f(t1))];
 return fade(g,line(a[0],a[1],b[0],b[1],{color:C.t,w:3,dash:'7 6'})+line(b[0],b[1],c[0],c[1],{color:C.a,w:3,dash:'7 6'})
  +(dt?label(dt,(a[0]+b[0])/2,a[1]+(f(t1)>f(t0)?30:-14),{size:24,color:C.t,anchor:'middle'}):'')
  +(dv?label(dv,b[0]+12*side,(b[1]+c[1])/2+8,{size:24,color:C.a,anchor:side>0?'start':'end'}):''));
}
const pt=(A,t,f,color=C.hi,r=8)=>dot(A.X(t),A.Y(f(t)),r,color);
// curved graph: v = t² (values), t in 0..2.2
const CA=g=>axes({x:110,y:450,w:560,h:380,xmax:2.3,ymax:5.2,xlabel:'t [s]',ylabel:'速度 v [m/s]',xticks:[1,2],yticks:[1,2,3,4,5],grid:true,g,xcolor:C.t,ycolor:C.v});
function secant(A,t1,{g=1,color=C.hi,w=3}={}){const m=(VS(t1)-1)/(t1-1),f=t=>1+m*(t-1);const lo=Math.max(.35,1-1/m),hi=Math.min(2.25,1+(5.1-1)/m);return fade(g,line(A.X(lo),A.Y(f(lo)),A.X(hi),A.Y(f(hi)),{color,w})+dot(A.X(t1),A.Y(VS(t1)),7,color));}
function slopeTable(rows,g=1){
 let s=fade(g,label('区間',820,130,{size:26,color:C.dim,anchor:'middle'})+label('傾き',1030,130,{size:26,color:C.dim,anchor:'middle'})+line(720,145,1130,145,{color:C.faint,w:2}));
 rows.forEach(([a,b,gg],i)=>{s+=fade(gg,label(a,820,190+50*i,{size:28,color:C.t,anchor:'middle'})+label(b,1030,190+50*i,{size:30,color:C.a,anchor:'middle',weight:700}));});
 return s;
}

export const hsAcceleration2Diagrams={
 // ================= S1 前回の問い・ブレーキ =================
 [K+'q']:(p)=>card(150,130,900,220,label('加速度が マイナス のとき',600,215,{size:36,color:C.ink,anchor:'middle'})+label('いつも 遅くなっている？',600,290,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 [K+'brake']:(p)=>brakeScene(6*seg(p,.1,.85)),
 [K+'signs']:(p)=>{
  let s=road(300)+fade(.45,car(BX(0),300))+car(BX(6),300);
  s+=varr(BX(0),220,18,14,'',seg(p,.05,.2));
  s+=fade(seg(p,.05,.25),label('はじめ v₀ ＝ ＋18 m/s',BX(0)+126,180,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),dot(BX(6),220,9,C.v)+label('あと v ＝ 0',BX(6),180,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.25),label('t ＝ 0 s',BX(0),370,{size:24,color:C.t,anchor:'middle'}))+fade(seg(p,.5,.65),label('t ＝ 6 s',BX(6),370,{size:24,color:C.t,anchor:'middle'}));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=fade(seg(p,.03,.2),tex('a=\\dfrac{v-v_0}{t}',220,200,{size:50}));
  s+=fade(seg(p,.15,.35),tex('=\\dfrac{0-18}{6}',490,200,{size:50,auto:false}));
  s+=fade(seg(p,.4,.55),tex('=\\dfrac{-18}{6}',740,200,{size:50,auto:false}));
  s+=fade(seg(p,.65,.8),tex('=-3\\,\\mathrm{m/s^2}',990,200,{size:50,auto:false,color:C.a}));
  s+=fade(seg(p,.15,.35),label('あと − はじめ',490,330,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'decel']:(p)=>{
  const t=2;
  let s=road(300)+car(BX(t),300)+varr(BX(t),220,18-3*t,14,'v：右向き',seg(p,.05,.2))+aarr(BX(t),360,-3,40,'a：左向き',seg(p,.2,.35));
  s+=card(200,410,800,90,label('正の向きに 進む ＋ a ＜ 0 → 減速',600,467,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'dv']:(p)=>{
  const O=300,k=20;
  let s=line(150,350,1050,350,{color:C.faint,w:2})+arrow(900,420,1040,420,{color:C.x,w:3,head:12})+label('正の向き',970,460,{size:22,color:C.x,anchor:'middle'});
  s+=arrow(O,120,O+18*k,120,{color:C.v,w:6,head:16})+label('v₀ ＝ ＋18',O+9*k,100,{size:28,color:C.v,anchor:'middle',weight:700});
  s+=label('v ＝ 0',O-24,198,{size:28,color:C.v,anchor:'end',weight:700})+dot(O,190,9,C.v);
  s+=arrow(O+18*k,300,O,300,{color:C.a,w:6,head:16,g:seg(p,.2,.5)});
  s+=fade(seg(p,.45,.6),label('v − v₀ ＝ 0 − 18 ＝ −18 m/s',O+9*k,272,{size:28,color:C.a,anchor:'middle',weight:700})+label('速度の変化：左向き',O+18*k+30,310,{size:28,color:C.a,weight:700}));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=card(110,60,980,150,label('速度の マイナス',330,145,{size:32,color:C.v,anchor:'middle',weight:700})+label('逆向き に 動く',780,145,{size:34,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.v);
  s+=card(110,250,980,150,label('加速度の マイナス',330,335,{size:32,color:C.a,anchor:'middle',weight:700})+label('速度の変化が 逆向き',780,335,{size:34,color:C.ink,anchor:'middle'}),seg(p,.4,.55),C.a);
  s+=fade(seg(p,.7,.85),label('符号は、いつも 向きを 表す',600,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S2 マイナスでも速くなる =================
 [K+'left']:(p)=>leftRows(p,{g1:seg(p,.05,.25),g2:seg(p,.5,.7)}),
 [K+'sub']:(p)=>{
  let s=fade(seg(p,.03,.2),tex('v-v_0=(-5)-(-2)',600,120,{size:50}));
  s+=fade(seg(p,.35,.5),tex('=-5+2',600,240,{size:50,auto:false}));
  s+=fade(seg(p,.35,.5),label('マイナスを 引く ＝ 足す',760,250,{size:26,color:C.hi}));
  s+=fade(seg(p,.7,.85),tex('=-3',600,360,{size:50,auto:false,color:C.a}));
  return s;
 },
 [K+'calc2']:(p)=>{
  let s=fade(seg(p,.03,.2),tex('a=\\dfrac{-3}{1.0}=-3\\,\\mathrm{m/s^2}',600,180,{size:56}));
  s+=card(250,330,700,100,label('ブレーキの例と 同じ −3 m/s²',600,392,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.55,.7),C.a);
  return s;
 },
 [K+'guess']:(p)=>leftRows(p)+card(150,425,460,76,label('遅くなっている？',380,476,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
 [K+'speedup']:(p)=>leftRows(p,{speed:seg(p,.05,.25)})+card(80,432,820,72,label('速さ 2 → 5：速くなっている（a ＝ −3 m/s²）',490,480,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi),
 [K+'notalways']:(p)=>card(150,140,900,200,label('a ＜ 0 でも',600,215,{size:36,color:C.a,anchor:'middle'})+label('速くなる ことがある',600,290,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 // ================= S3 速くなるか、遅くなるか =================
 [K+'arrows']:(p)=>{
  let s=fade(seg(p,.05,.2),arrow(250,170,450,170,{color:C.v,w:6,head:16})+label('速度 v',500,180,{size:32,color:C.v,weight:700}));
  s+=fade(seg(p,.4,.55),arrow(250,300,450,300,{color:C.a,w:6,head:16})+label('加速度 a',500,310,{size:32,color:C.a,weight:700})+label('＝ 速度の変化の 向き',660,310,{size:30,color:C.ink}));
  return s;
 },
 [K+'ex1']:(p)=>{
  let s=label('ブレーキ（18 → 0 m/s）',600,60,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=road(280,{pos:0})+car(560,280)+varr(560,200,12,14,'v 右向き')+aarr(560,340,-3,40,'a 左向き',seg(p,.2,.35));
  s+=card(250,410,700,90,label('逆向き → 遅くなる',600,467,{size:36,color:C.x,anchor:'middle',weight:700}),seg(p,.55,.7),C.x);
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=label('左向き（−2 → −5 m/s）',600,60,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=road(280,{pos:0})+car(760,280,C.E)+varr(760,200,-4,40,'v 左向き')+aarr(760,340,-3,40,'a 左向き',seg(p,.2,.35));
  s+=card(250,410,700,90,label('同じ向き → 速くなる',600,467,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'table']:(p)=>table(p,{g:seg(p,.03,.15),cells:seg(p,.1,.75)}),
 [K+'result']:(p)=>table(p)+card(250,435,700,70,label('（結果）同じ向き → 速く、逆向き → 遅く',600,480,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
 // ================= S4 v-t グラフの傾き =================
 [K+'axes']:(p)=>{
  const A=vtAxes(seg(p,.05,.3));let s=A.svg;
  s+=fade(seg(p,.4,.55),label('横：時刻 t',960,170,{size:30,color:C.t,anchor:'middle'})+label('縦：速度 v',960,230,{size:30,color:C.v,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('v-t グラフ',960,320,{size:34,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'line']:(p)=>{
  const A=vtAxes();let s=A.svg;
  [0,1,2,3,4].forEach(t=>{s+=fade(seg(p,.05+t*.08,.12+t*.08),pt(A,t,V1));});
  s+=A.plot(V1,{from:0,to:5.6,p:seg(p,.55,.8),color:C.v,w:4,steps:2});
  s+=card(740,120,420,140,label('2, 5, 8, 11, 14 m/s',950,180,{size:30,color:C.v,anchor:'middle',weight:700})+label('毎秒 ＋3',950,230,{size:28,color:C.a,anchor:'middle'}),seg(p,.1,.25));
  return s;
 },
 [K+'slope']:(p)=>{
  const A=vtAxes();let s=A.svg+A.plot(V1,{from:0,to:5.6,color:C.v,w:4,steps:2})+pt(A,0,V1)+pt(A,2,V1);
  s+=vslope(A,V1,0,2,{g:seg(p,.05,.3),dt:'Δt ＝ 2 s',dv:'Δv ＝ 6 m/s'});
  s+=card(740,140,420,150,tex('\\dfrac{\\Delta v}{\\Delta t}=\\dfrac{6}{2}=3',950,215,{size:44}),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'slopedef']:(p)=>{
  const A=vtAxes();let s=A.svg+A.plot(V1,{from:0,to:5.6,color:C.v,w:4,steps:2})+vslope(A,V1,0,2,{dt:'Δt ＝ 2 s',dv:'Δv ＝ 6 m/s'});
  s+=card(740,120,420,230,tex('\\dfrac{\\Delta v}{\\Delta t}',950,195,{size:48})+label('＝ 加速度の 定義',950,275,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.45,.6),label('a ＝ 3 m/s²',950,325,{size:32,color:C.a,anchor:'middle',weight:700})),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'height']:(p)=>{
  const A=vtAxes();let s=A.svg+A.plot(V1,{from:0,to:5.6,color:C.v,w:4,steps:2})+vslope(A,V1,0,2);
  s+=fade(seg(p,.05,.2),line(A.X(4),A.Y(0),A.X(4),A.Y(14),{color:C.v,w:4,dash:'6 6'})+pt(A,4,V1,C.v,9)+label('高さ ＝ 速度',A.X(4)+14,A.Y(7),{size:26,color:C.v,weight:700}));
  s+=card(740,140,420,180,label('高さ ＝ 速度 v',950,205,{size:32,color:C.v,anchor:'middle',weight:700})+label('傾き ＝ 加速度 a',950,265,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'brakeline']:(p)=>{
  const A=vtAxes();let s=A.svg+fade(.4,A.plot(V1,{from:0,to:5.6,color:C.v,w:4,steps:2}));
  s+=fade(seg(p,.05,.2),pt(A,0,VB,C.E));
  s+=A.plot(VB,{from:0,to:6,p:seg(p,.25,.6),color:C.E,w:4,steps:2});
  s+=fade(seg(p,.6,.75),pt(A,6,VB,C.E)+label('(6 s, 0)',A.X(6)+14,A.Y(0)-22,{size:24,color:C.E}));
  s+=card(740,140,420,120,label('ブレーキ：18 → 0',950,212,{size:32,color:C.E,anchor:'middle',weight:700}),seg(p,.05,.2),C.E);
  return s;
 },
 [K+'down']:(p)=>{
  const A=vtAxes();let s=A.svg+fade(.4,A.plot(V1,{from:0,to:5.6,color:C.v,w:4,steps:2}))+A.plot(VB,{from:0,to:6,color:C.E,w:4,steps:2})+pt(A,0,VB,C.E)+pt(A,6,VB,C.E);
  s+=vslope(A,VB,0,6,{g:seg(p,.05,.3),dt:'Δt ＝ 6 s',dv:'Δv ＝ −18'});
  s+=card(800,140,370,190,tex('\\dfrac{-18}{6}=-3',985,210,{size:44,auto:false})+fade(seg(p,.5,.65),label('右下がり ＝ a ＜ 0',985,290,{size:30,color:C.a,anchor:'middle',weight:700})),seg(p,.3,.45),C.a);
  return s;
 },
 ...Object.fromEntries([['pair',0],['pair2',1]].map(([k,st])=>[K+k,(p)=>{
  const A=xtAxes(1,{x:90,y:400,w:400,h:300}),B=vtAxes(1,{x:690,y:400,w:400,h:300,xmax:5.4,ymax:18,yticks:[3,6,9,12,15],xticks:[1,2,3,4,5]});
  let s=A.svg+xtLine(A,t=>4+3*t)+slopeTri(A,t=>4+3*t,0,2,{dt:'Δt',dx:'Δx'});
  s+=fade(st?1:seg(p,.3,.5),B.svg+B.plot(V1,{from:0,to:5,color:C.v,w:4,steps:2})+vslope(B,V1,0,2,{dt:'Δt',dv:'Δv'}));
  s+=fade(st?1:seg(p,.05,.2),label('傾き ＝ 速度 v',290,470,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(st?1:seg(p,.5,.65),label('傾き ＝ 加速度 a',890,470,{size:28,color:C.a,anchor:'middle',weight:700}));
  if(st)s+=card(330,25,540,60,label('傾き ＝ 縦軸の量の 変わり方',600,66,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 }])),
 // ================= S5 平均から、瞬間へ =================
 [K+'curve']:(p)=>{
  const A=CA(seg(p,.05,.25));let s=A.svg+A.plot(VS,{from:0,to:2.25,p:seg(p,.25,.6),color:C.v,w:4});
  s+=card(740,150,420,120,label('曲がった v-t グラフ',950,222,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'curve2']:(p)=>{
  const A=CA(1);let s=A.svg+A.plot(VS,{from:0,to:2.25,color:C.v,w:4});
  s+=card(740,110,420,190,label('速度の値 ＝ 時刻の値の 2乗',950,170,{size:26,color:C.ink,anchor:'middle'})+label('1 s：1 m/s',950,225,{size:30,color:C.v,anchor:'middle',weight:700})+label('2 s：4 m/s',950,272,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.4,.55),pt(A,1,VS,C.v,9))+fade(seg(p,.6,.75),pt(A,2,VS,C.v,9));
  return s;
 },
 [K+'secant']:(p)=>{
  const A=CA(1);let s=A.svg+A.plot(VS,{from:0,to:2.25,color:C.v,w:4})+pt(A,1,VS,C.hi,9);
  s+=secant(A,2,{g:seg(p,.1,.35)});
  s+=card(740,140,420,180,label('2点を 結ぶ 直線の 傾き',950,205,{size:28,color:C.hi,anchor:'middle',weight:700})+label('＝ その区間の',950,255,{size:26,color:C.ink,anchor:'middle'})+label('平均の加速度',950,295,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'s1']:(p)=>{
  const A=CA(1);let s=A.svg+A.plot(VS,{from:0,to:2.25,color:C.v,w:4})+pt(A,1,VS,C.hi,9)+secant(A,2);
  s+=vslope(A,VS,1,2,{g:seg(p,.05,.3),dt:'1 s',dv:'4 − 1 ＝ 3'});
  s+=slopeTable([['1 → 2 s','3',seg(p,.4,.55)]]);
  return s;
 },
 [K+'s2']:(p)=>{
  const A=CA(1);let s=A.svg+A.plot(VS,{from:0,to:2.25,color:C.v,w:4})+pt(A,1,VS,C.hi,9)+fade(.35,secant(A,2));
  s+=secant(A,1.1,{g:seg(p,.1,.3),color:'#ffb86b'})+secant(A,1.01,{g:seg(p,.55,.75),color:C.a});
  s+=slopeTable([['1 → 2 s','3',1],['1 → 1.1 s','2.1',seg(p,.2,.35)],['1 → 1.01 s','2.01',seg(p,.65,.8)]]);
  return s;
 },
 [K+'tangent']:(p)=>{
  const A=CA(1);let s=A.svg+A.plot(VS,{from:0,to:2.25,color:C.v,w:4});
  s+=fade(.3,secant(A,2)+secant(A,1.1,{color:'#ffb86b'}));
  const f=t=>1+2*(t-1);s+=fade(seg(p,.2,.4),line(A.X(.5),A.Y(f(.5)),A.X(2.25),A.Y(f(2.25)),{color:C.hi,w:4}))+pt(A,1,VS,C.hi,9);
  s+=slopeTable([['1 → 2 s','3',1],['1 → 1.1 s','2.1',1],['1 → 1.01 s','2.01',1],['↓','2',seg(p,.2,.4)]]);
  s+=fade(seg(p,.55,.7),label('1 s の 瞬間の 加速度 ＝ 2 m/s²',935,400,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'straight']:(p)=>{
  const A=vtAxes();let s=A.svg+A.plot(V1,{from:0,to:5.6,color:C.v,w:4,steps:2});
  s+=vslope(A,V1,0,1,{g:seg(p,.1,.3),dt:'1 s',dv:'3'})+vslope(A,V1,2,4,{g:seg(p,.35,.55),dt:'2 s',dv:'6'})+vslope(A,V1,4,4.5,{g:seg(p,.55,.7),dt:'',dv:''});
  s+=card(740,140,420,150,label('直線 → どの区間でも',950,200,{size:28,color:C.ink,anchor:'middle'})+label('傾き 3',950,255,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.6,.75),C.a);
  return s;
 },
 [K+'univ']:(p)=>card(150,130,900,220,label('区間を 短くしたときの 傾き',600,210,{size:36,color:C.ink,anchor:'middle',weight:700})+label('→ 大学編では「微分」で 書く',600,285,{size:34,color:C.hi,anchor:'middle'}),seg(p,.05,.25),C.hi),
 // ================= S6 加速度0と、次の問い =================
 [K+'zero']:(p)=>card(150,130,900,220,label('加速度 0',600,210,{size:40,color:C.a,anchor:'middle',weight:700})+label('＝ 止まっている？',600,285,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 [K+'zero2']:(p)=>{
  const A=xtAxes(1,{x:90,y:400,w:400,h:300}),B=vtAxes(1,{x:690,y:400,w:400,h:300,xmax:3.4,ymax:6,yticks:[2,4,6],xticks:[1,2,3]});
  let s=A.svg+xtLine(A,t=>4*t,{to:3,p:seg(p,.05,.35)});
  s+=fade(seg(p,.05,.35),label('位置は 変わり続ける',290,470,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),B.svg)+B.plot(()=>4,{from:0,to:3.2,p:seg(p,.45,.65),color:C.v,w:4,steps:2});
  s+=fade(seg(p,.65,.8),label('速度 4 m/s のまま → 傾き 0、a ＝ 0',890,470,{size:26,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'three']:(p)=>{
  const items=[['位置 x','どこに いるか',C.x],['速度 v','どれだけ 速いか（向きつき）',C.v],['加速度 a','速度が どう 変わるか',C.a]];
  let s='';items.forEach(([a,b,c],i)=>{s+=card(150,40+150*i,900,125,label(a,330,113+150*i,{size:36,color:c,anchor:'middle',weight:700})+label(b,720,113+150*i,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05+.2*i,.2+.2*i),c);});
  return s;
 },
 [K+'sum']:(p)=>{
  let s=card(110,50,980,150,label('加速度の 符号 ＝ 速度の変化の 向き',600,140,{size:38,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(110,240,980,150,label('同じ向き → 速くなる　逆向き → 遅くなる',600,330,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'sum2']:(p)=>{
  const A=vtAxes(1,{x:110,y:450,w:520,h:360});let s=A.svg+A.plot(V1,{from:0,to:5.6,color:C.v,w:4,steps:2})+vslope(A,V1,1,2,{dt:'1 s',dv:'a'});
  s+=card(720,150,440,150,label('v-t グラフの 傾き',940,210,{size:32,color:C.ink,anchor:'middle',weight:700})+label('＝ 加速度 a',940,260,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'next']:(p)=>card(120,120,960,240,label('加速度が 一定 と 分かっているとき',600,205,{size:34,color:C.ink,anchor:'middle'})+label('t 秒後の 速度と 位置まで 予言できる？',600,285,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi),
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の単元',600,175,{size:28,color:C.dim,anchor:'middle'})+label('等加速度運動の 3公式',600,260,{size:46,color:C.a,anchor:'middle',weight:700})+label('一定の 加速度から 速度と位置を 予言する',600,315,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a);
  s+=fade(seg(p,.5,.7),label('等加速度運動の3公式・深く学ぶ 1/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
