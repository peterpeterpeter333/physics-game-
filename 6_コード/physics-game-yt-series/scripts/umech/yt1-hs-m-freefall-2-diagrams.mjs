// 高校編「落体の運動・深く学ぶ 2/2」(ys-hs-m-freefall-2) — 図。Stage 1200×515.
// 投げ上げ：上向き正、v₀＝20 m/s、g＝10 m/s²。v＝20−10t、y＝20t−5t²（0,15,20,15,0 m）。
// 色：変位 y 水色、速度 v 紫、加速度 a・g 赤、時刻 t 金、強調 黄。部品は 1/2 から借りる。
import {C,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,axes,tex,poly,ground} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {Gt,Yt,ball,hand} from './yt1-hs-m-freefall-1-diagrams.mjs';

const K='hs-m-freefall-2:';
export const V0=20,G=10;
export const vAt=t=>V0-G*t, yAt=t=>V0*t-G*t*t/2;
const T2=(src,x,y,o={})=>tex(src,x,y,{size:46,...o});

// ---- the throw column: up-phase balls left, down-phase balls right ---------------------------
export const UP={x:235,gy:455,k:16};
const bx=t=>t<2-1e-9?UP.x-45:t>2+1e-9?UP.x+45:UP.x, by=t=>UP.gy-UP.k*yAt(t);
export function upColumn({n=4,g=1,va=0,aa=0,tl=1,yl=0,hl=-1,live=-1}={}){
 let s=fade(g,ground(UP.x-150,UP.x+150,UP.gy+16)+line(UP.x-110,by(2),UP.x+110,by(2),{color:C.faint,w:2,dash:'6 8'}));
 for(let i=0;i<=n;i++){const x=bx(i),y=by(i),v=vAt(i);
  s+=fade(g,ball(x,y,{o:live>=0&&i!==live?.35:1}));
  if(i===hl)s+=fade(g,ring(x,y,26,{color:C.hi,w:3}));
  s+=fade(g*tl,label(`${i} s`,i<2?x-46:i>2?x+46:x,i===2?y-36:y+8,{size:22,color:C.t,anchor:i<2?'end':i>2?'start':'middle'}));
  if(va&&Math.abs(v)>0)s+=arrow(x,y+(v>0?-18:18),x,y-3*v+(v>0?-18:18),{color:C.v,w:4,head:12,g:g*va});
  if(aa)s+=arrow(x+(i<2?-26:26),y-10,x+(i<2?-26:26),y+40,{color:C.a,w:4,head:12,g:g*aa});
 }
 s+=fade(g*yl,label('15 m',UP.x+150,by(1)+8,{size:22,color:C.x})+label('20 m',UP.x+150,by(2)+8,{size:22,color:C.x}));
 return s;
}

// ---- v table -----------------------------------------------------------------------------------
function vTable({rows=5,g=1,hl=[],diff=0,x=600,y=40}={}){
 const rh=60,w=480;
 let s=card(x-10,y-10,w+20,rh*(rows+1)+20,'',g);
 s+=fade(g,label('t [s]',x+110,y+38,{size:26,color:C.t,anchor:'middle',weight:700})+label('v [m/s]',x+330,y+38,{size:26,color:C.v,anchor:'middle',weight:700})+line(x,y+rh,x+w,y+rh,{color:C.faint,w:2}));
 for(let i=0;i<rows;i++){const yy=y+rh*(i+1)+40,v=vAt(i);
  if(hl.includes(i))s+=fade(g,rect(x,yy-38,w,rh-6,{fill:C.hi,fo:.12,stroke:C.hi,sw:1.5,rx:8}));
  s+=fade(g,label(String(i),x+110,yy,{size:30,color:C.t,anchor:'middle',weight:700})+label(v<0?`−${-v}`:String(v),x+330,yy,{size:30,color:C.v,anchor:'middle',weight:700}));
  if(i>0&&diff)s+=fade(g*diff,label('−10',x+w+30,yy-30,{size:24,color:C.a,weight:700})+arrow(x+w+20,yy-62,x+w+20,yy-8,{color:C.a,w:3,head:10}));
 }
 return s;
}

// ---- v-t graph (−25 … 25 m/s) -----------------------------------------------------------------
export const vtAxes2=(g=1,{x=110,y=445,w=520,h=345}={})=>axes({x,y,w,h,xmin:0,xmax:4.6,ymin:-25,ymax:25,xlabel:'t [s]',ylabel:'速度 v [m/s]',xticks:[1,2,3,4],yticks:[-20,-10,10,20],grid:true,g,xcolor:C.t,ycolor:C.v});

export const hsFreefall2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  const tt=2*seg(p,.1,.7);
  let s=ground(350,850,470)+fade(seg(p,.6,.75),line(520,450-16*20,680,450-16*20,{color:C.dim,w:2,dash:'6 8'})+label('最高点',700,450-16*20+8,{size:28,color:C.hi,weight:700}));
  s+=ball(600,450-16*yAt(tt));
  return s;
 },
 [K+'q2']:(p)=>{
  let s=fade(.35,ground(350,850,470))+line(520,130,680,130,{color:C.dim,w:2,dash:'6 8'})+ball(600,130);
  s+=card(150,220,900,170,label('最高点では',600,275,{size:30,color:C.ink,anchor:'middle'})+label('速度も 加速度も 0 ？',600,345,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'stop']:(p)=>{
  let s=ground(350,850,470)+line(520,130,680,130,{color:C.dim,w:2,dash:'6 8'})+ball(600,130);
  s+=fade(seg(p,.05,.2),label('一瞬 止まって 見える',720,140,{size:30,color:C.ink}));
  s+=fade(seg(p,.5,.65),label('全部 0？',720,200,{size:34,color:C.dim,weight:700}));
  return s;
 },
 [K+'g10']:(p)=>card(250,120,700,230,label('計算を 見やすく するため',600,190,{size:30,color:C.ink,anchor:'middle'})+tex(Gt+'=10\\ \\mathrm{m/s^2}',600,280,{size:56,auto:false}),seg(p,.05,.25),C.a)+fade(seg(p,.6,.75),label('（本当は 約 9.8）',600,410,{size:28,color:C.dim,anchor:'middle'})),
 // ================= S2 上向きを正に =================
 [K+'up']:(p)=>{
  let s=ground(100,500,470)+ball(300,440);
  s+=arrow(150,450,150,110,{color:C.x,w:4,head:16,g:seg(p,.05,.25)})+fade(seg(p,.15,.3),label('正',172,140,{size:30,color:C.x,weight:700})+label('上向き',172,180,{size:24,color:C.dim}));
  s+=arrow(300,410,300,300,{color:C.v,w:6,head:18,g:seg(p,.45,.6)})+fade(seg(p,.5,.65),label('v₀',322,350,{size:32,color:C.v,weight:700}));
  s+=card(600,150,520,160,label('投げた 向き ＝ 上',860,210,{size:30,color:C.ink,anchor:'middle'})+label('v₀ ＝ ＋20 m/s',860,270,{size:36,color:C.v,anchor:'middle',weight:700}),seg(p,.6,.75),C.v);
  return s;
 },
 [K+'force']:(p)=>{
  let s=upColumn({tl:0,aa:seg(p,.1,.35)});
  s+=fade(seg(p,.3,.45),label('上りでも 下りでも 下向き',UP.x+180,150,{size:28,color:C.a,weight:700}));
  s+=card(600,240,500,140,tex('a=-'+Gt,850,315,{size:60}),seg(p,.6,.75),C.a);
  return s;
 },
 [K+'sub']:(p)=>{
  let s=label('第1式',600,60,{size:28,color:C.dim,anchor:'middle'})+T2('v=v_0+at',600,135,{size:52});
  s+=fade(seg(p,.2,.35),label('a ＝ −g',880,140,{size:32,color:C.a,weight:700}));
  s+=fade(seg(p,.4,.55),T2('v=v_0+(-'+Gt+')t',600,245,{size:52}));
  s+=card(400,310,400,120,T2('v=v_0-'+Gt+'t',600,375,{size:56}),seg(p,.65,.8),C.v);
  return s;
 },
 [K+'v20']:(p)=>{
  let s=T2('v=v_0-'+Gt+'t',600,90,{size:48});
  s+=fade(seg(p,.05,.2),label('v₀ ＝ 20、g ＝ 10',600,175,{size:30,color:C.ink,anchor:'middle'}));
  s+=card(380,220,440,120,T2('v=20-10t',600,285,{size:56,auto:true}),seg(p,.2,.35),C.v);
  s+=fade(seg(p,.6,.75),label('1秒ごとに 10 ずつ 減る',600,420,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'tab']:(p)=>{
  let s='';
  const r=[.02,.12,.3,.55,.75].map(a=>seg(p,a,a+.1));
  let col='';for(let i=0;i<=4;i++)col+=fade(r[i],ball(bx(i),by(i))+label(`${i} s`,i<2?bx(i)-46:i>2?bx(i)+46:bx(i),i===2?by(i)-28:by(i)+8,{size:22,color:C.t,anchor:i<2?'end':i>2?'start':'middle'}));
  s+=ground(UP.x-150,UP.x+150,UP.gy+16)+col;
  s+=vTable({rows:5,g:1});
  // reveal rows progressively by covering
  for(let i=0;i<5;i++)s+=fade(1-r[i],rect(600,40+60*(i+1)+2,480,56,{fill:'#131f38',fo:1,stroke:'none',rx:0}));
  return s;
 },
 [K+'minus']:(p)=>{
  let s=upColumn({va:seg(p,.05,.3),yl:0});
  s+=vTable({rows:5,hl:[3,4]});
  s+=fade(seg(p,.2,.35),label('上向き',UP.x-120,by(.5)-30,{size:24,color:C.v,anchor:'middle'})+label('下向き',UP.x+120,by(3.5)-30,{size:24,color:C.v,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('マイナス ＝ 下向き',840,470,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 最高点で0になるのは =================
 [K+'top']:(p)=>{
  let s=upColumn({va:1,hl:seg(p,.1,.25)>.5?2:-1});
  s+=vTable({rows:5,hl:[2]});
  s+=fade(seg(p,.3,.45),label('v ＝ 0 → 最高点',UP.x+60,by(2)-60,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'acc']:(p)=>{
  let s=upColumn({va:1,hl:2});
  s+=vTable({rows:5,hl:[1,2,3],diff:seg(p,.3,.5)});
  s+=fade(seg(p,.6,.75),label('最高点の 前後も −10',840,470,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'accans']:(p)=>{
  let s=upColumn({va:1,aa:seg(p,.05,.25),hl:2});
  s+=card(560,90,560,130,label('加速度',840,140,{size:28,color:C.ink,anchor:'middle'})+label('最高点でも −10 m/s²',840,195,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(560,260,560,130,label('0 になるのは',840,310,{size:28,color:C.ink,anchor:'middle'})+label('速度 だけ',840,365,{size:40,color:C.v,anchor:'middle',weight:700}),seg(p,.45,.6),C.v);
  return s;
 },
 [K+'ifzero']:(p)=>{
  let s=ground(150,550,470)+line(240,130,460,130,{color:C.faint,w:2,dash:'6 8'})+ball(350,130);
  s+=fade(seg(p,.3,.5),label('ずっと 止まったまま？',350,90,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(620,110,500,230,label('もし a ＝ 0 なら',870,170,{size:32,color:C.ink,anchor:'middle',weight:700})+label('速度は 0 のまま',870,230,{size:30,color:C.v,anchor:'middle'})+label('→ 落ちてこない',870,290,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.7,.85),label('実際は 落ちてくる → a ≠ 0',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'vt']:(p)=>{
  const A=vtAxes2(seg(p,.02,.2));let s=A.svg;
  s+=A.plot(vAt,{from:0,to:4,p:seg(p,.2,.55),color:C.v,w:4,steps:2});
  s+=fade(seg(p,.4,.55),[0,1,2,3,4].map(t=>dot(A.X(t),A.Y(vAt(t)),7,C.v)).join(''));
  s+=card(720,140,420,170,tex('v=20-10t',930,205,{size:44})+label('傾き ずっと −10',930,275,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.55,.7),C.v);
  return s;
 },
 [K+'cross']:(p)=>{
  const A=vtAxes2();let s=A.svg+A.plot(vAt,{from:0,to:4,color:C.v,w:4,steps:2});
  s+=fade(seg(p,.05,.2),ring(A.X(2),A.Y(0),14,{color:C.hi,w:3})+label('最高点（2 s）',A.X(2)+18,A.Y(0)-22,{size:24,color:C.hi,weight:700}));
  s+=card(720,140,420,190,label('折れ曲がらない',930,205,{size:30,color:C.ink,anchor:'middle',weight:700})+label('平らにも ならない',930,255,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 突き抜ける',930,305,{size:28,color:C.hi,anchor:'middle'}),seg(p,.45,.6));
  return s;
 },
 // ================= S4 最高点の時間と高さ =================
 [K+'cond']:(p)=>{
  let s=T2('v=v_0-'+Gt+'t',600,110,{size:52});
  s+=card(380,200,440,130,label('最高点の 条件',600,250,{size:28,color:C.ink,anchor:'middle'})+T2('v=0',600,300,{size:48}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'put0']:(p)=>{
  let s=T2('v=v_0-'+Gt+'t',600,110,{size:52});
  s+=fade(seg(p,.15,.3),label('v に 0 を 入れる',900,120,{size:26,color:C.hi}));
  s+=card(380,220,440,120,T2('{\\color{#ffe28a}0}=v_0-'+Gt+'t',600,285,{size:56}),seg(p,.35,.5));
  return s;
 },
 [K+'addgt']:(p)=>{
  let s=T2('0=v_0-'+Gt+'t',600,90,{size:50});
  s+=fade(seg(p,.05,.25),T2('0\\,{\\color{#ffe28a}+'+Gt+'t}=v_0-'+Gt+'t\\,{\\color{#ffe28a}+'+Gt+'t}',600,200,{size:50})+label('両辺に gt を 足す',960,210,{size:26,color:C.hi}));
  s+=card(420,280,360,120,T2(Gt+'t=v_0',600,345,{size:56}),seg(p,.5,.65),C.v);
  return s;
 },
 [K+'divg']:(p)=>{
  let s=T2(Gt+'t=v_0',600,90,{size:50});
  s+=fade(seg(p,.05,.2),label('g で 割る',900,100,{size:26,color:C.hi}));
  s+=card(250,150,330,180,T2('t=\\dfrac{v_0}{'+Gt+'}',415,250,{size:56}),seg(p,.1,.25),C.t);
  s+=card(640,150,330,180,T2('\\dfrac{20}{10}=2\\ \\mathrm{s}',805,250,{size:52,auto:false}),seg(p,.5,.65),C.t);
  return s;
 },
 [K+'height']:(p)=>{
  let s=label('第2式（x を y に）',600,55,{size:28,color:C.dim,anchor:'middle'})+T2(Yt+'=v_0t-\\tfrac12'+Gt+'t^2',600,130,{size:50});
  s+=fade(seg(p,.2,.35),label('t ＝ 2 を 入れる',960,140,{size:26,color:C.hi}));
  s+=fade(seg(p,.4,.55),T2(Yt+'=20\\times 2-\\tfrac12\\times 10\\times 2^2',600,250,{size:48,auto:false}));
  return s;
 },
 [K+'height2']:(p)=>{
  let s=T2(Yt+'=20\\times 2-\\tfrac12\\times 10\\times 2^2',600,90,{size:44,auto:false});
  s+=fade(seg(p,.05,.25),T2('=40-20',600,190,{size:48,auto:false}));
  s+=card(420,250,360,120,T2('=20\\ \\mathrm{m}',600,315,{size:56,auto:false,color:C.x}),seg(p,.4,.55),C.x);
  s+=fade(seg(p,.6,.75),label('最高点の 高さ',600,430,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'hs1']:(p)=>{
  let s=T2(Yt+'=v_0t-\\tfrac12'+Gt+'t^2',600,90,{size:48});
  s+=fade(seg(p,.15,.3),label('t ＝ v₀ ÷ g を 入れる',600,175,{size:30,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),T2(Yt+'=v_0\\cdot\\dfrac{v_0}{'+Gt+'}-\\tfrac12'+Gt+'\\left(\\dfrac{v_0}{'+Gt+'}\\right)^2',600,300,{size:48}));
  return s;
 },
 [K+'hs2']:(p)=>{
  let s=T2(Yt+'=v_0\\cdot\\dfrac{v_0}{'+Gt+'}-\\tfrac12'+Gt+'\\left(\\dfrac{v_0}{'+Gt+'}\\right)^2',600,90,{size:44});
  s+=fade(seg(p,.05,.2),T2(Yt+'=\\dfrac{v_0^2}{'+Gt+'}-\\dfrac{v_0^2}{2'+Gt+'}',600,220,{size:48}));
  s+=fade(seg(p,.2,.35),label('第1項',515,300,{size:24,color:C.dim,anchor:'middle'})+label('その半分',700,300,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(420,320,360,170,T2(Yt+'=\\dfrac{v_0^2}{2'+Gt+'}',600,412,{size:52}),seg(p,.55,.7),C.x);
  return s;
 },
 [K+'hs3']:(p)=>{
  let s=T2(Yt+'=\\dfrac{v_0^2}{2'+Gt+'}',600,100,{size:52});
  s+=fade(seg(p,.1,.3),T2('=\\dfrac{20^2}{2\\times 10}=\\dfrac{400}{20}',600,240,{size:50,auto:false}));
  s+=card(420,320,360,110,T2('=20\\ \\mathrm{m}',600,380,{size:54,auto:false,color:C.x}),seg(p,.45,.6),C.x);
  s+=fade(seg(p,.65,.8),label('数で 求めた 高さと 一致',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'third']:(p)=>{
  let s=label('第3式（x を y に）',600,55,{size:28,color:C.dim,anchor:'middle'})+T2('v^2-v_0^2=2a'+Yt,600,125,{size:50});
  s+=fade(seg(p,.1,.25),label('v ＝ 0、v₀ ＝ 20、a ＝ −10',600,205,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),T2('0-400=-20'+Yt,600,290,{size:50,auto:false}));
  s+=card(420,340,360,110,T2(Yt+'=20\\ \\mathrm{m}',600,400,{size:54,auto:false}),seg(p,.6,.75),C.x);
  return s;
 },
 [K+'area']:(p)=>{
  const A=vtAxes2();let s=A.svg+A.plot(vAt,{from:0,to:4,color:C.v,w:4,steps:2});
  s+=fade(seg(p,.05,.25),poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(20)],[A.X(2),A.Y(0)]],{fill:C.x,fo:.3,stroke:C.x,sw:2}));
  s+=card(720,140,420,190,tex('\\tfrac12\\times 2\\times 20',930,205,{size:42,auto:false})+tex('=20\\ \\mathrm{m}',930,265,{size:44,auto:false,color:C.x}),seg(p,.3,.45),C.x);
  s+=fade(seg(p,.6,.75),label('＝ 最高点の 高さ',930,375,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 上りと下りは対称 =================
 [K+'back']:(p)=>{
  let s=upColumn({tl:1,g:1});
  s+=card(560,120,560,150,label('投げた 所に 戻る',840,180,{size:30,color:C.ink,anchor:'middle'})+T2(Yt+'=0',840,235,{size:46}),seg(p,.3,.45),C.x);
  s+=fade(seg(p,.6,.75),label('何秒後？',840,330,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fac']:(p)=>{
  let s=T2('0=20t-5t^2',600,100,{size:52});
  s+=fade(seg(p,.25,.4),label('t で くくる',930,110,{size:26,color:C.hi}));
  s+=card(380,190,440,120,T2('0=t\\,(20-5t)',600,255,{size:56}),seg(p,.45,.6),C.t);
  return s;
 },
 [K+'roots']:(p)=>{
  let s=T2('0=t\\,(20-5t)',600,80,{size:48});
  s+=fade(seg(p,.05,.2),label('かけ算が 0 → どちらかが 0',600,160,{size:28,color:C.ink,anchor:'middle'}));
  s+=card(170,210,380,150,T2('t=0',360,270,{size:50})+label('投げた 瞬間',360,330,{size:26,color:C.dim,anchor:'middle'}),seg(p,.3,.45));
  s+=card(650,210,380,150,T2('20-5t=0',840,265,{size:44})+T2('t=4\\ \\mathrm{s}',840,330,{size:44}),seg(p,.6,.75),C.t);
  return s;
 },
 [K+'twice']:(p)=>{
  let s=upColumn({tl:1});
  const X0=560,W=560,y=230,sc=W/4;
  s+=fade(seg(p,.05,.2),line(X0,y,X0+W,y,{color:C.dim,w:3})+[0,1,2,3,4].map(i=>line(X0+sc*i,y-10,X0+sc*i,y+10,{color:C.dim,w:2})+label(`${i}`,X0+sc*i,y+40,{size:24,color:C.t,anchor:'middle'})).join('')+label('t [s]',X0+W+20,y+8,{size:24,color:C.t}));
  s+=fade(seg(p,.3,.45),rect(X0,y-60,sc*2,40,{fill:C.v,fo:.3,stroke:C.v,rx:6})+label('上り 2 s',X0+sc,y-32,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),rect(X0+sc*2,y-60,sc*2,40,{fill:'#7f8fd8',fo:.3,stroke:'#7f8fd8',rx:6})+label('下り 2 s',X0+sc*3,y-32,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('4 s ＝ 最高点までの 2倍',X0+W/2,y+120,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'h15']:(p)=>{
  let s=upColumn({tl:1,yl:seg(p,.6,.75),hl:-1});
  s+=fade(seg(p,.05,.2),T2(Yt+'=20t-5t^2',850,90,{size:46}));
  s+=card(600,150,500,100,tex('t=1:\\ 20\\times 1-5\\times 1^2=15',850,210,{size:36,auto:false}),seg(p,.2,.35),C.x);
  s+=card(600,280,500,100,tex('t=3:\\ 20\\times 3-5\\times 3^2=15',850,340,{size:36,auto:false}),seg(p,.4,.55),C.x);
  s+=fade(seg(p,.6,.75),label('同じ 15 m',850,440,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 ...Object.fromEntries([['fold',0],['fold2',1]].map(([k,st])=>[K+k,(p)=>{
  let s=upColumn({va:1,tl:1,yl:1});
  const rowsP=[['15 m','1 s：＋10','3 s：−10'],['0 m','0 s：＋20','4 s：−20']];
  s+=fade(1,label('同じ 高さ',700,90,{size:26,color:C.dim,anchor:'middle'})+label('上り',860,90,{size:26,color:C.v,anchor:'middle'})+label('下り',1040,90,{size:26,color:'#a9b6f0',anchor:'middle'}));
  rowsP.forEach((r,j)=>{const g=j===0?(st?1:seg(p,.2,.4)):(st?seg(p,.1,.3):0),yy=170+j*110;
   s+=card(620,yy-45,520,80,label(r[0],700,yy+8,{size:28,color:C.x,anchor:'middle',weight:700})+label(r[1],860,yy+8,{size:28,color:C.v,anchor:'middle',weight:700})+label(r[2],1040,yy+8,{size:28,color:C.v,anchor:'middle',weight:700}),g,j===st?C.hi:C.faint);});
  if(st)s+=fade(seg(p,.55,.7),label('同じ高さ → 速さ が そろう',880,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 }])),
 [K+'areas']:(p)=>{
  const A=vtAxes2();let s=A.svg+A.plot(vAt,{from:0,to:4,color:C.v,w:4,steps:2});
  s+=poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(20)],[A.X(2),A.Y(0)]],{fill:C.x,fo:.3,stroke:C.x,sw:2});
  s+=fade(seg(p,.1,.3),poly([[A.X(2),A.Y(0)],[A.X(4),A.Y(-20)],[A.X(4),A.Y(0)]],{fill:C.a,fo:.3,stroke:C.a,sw:2}));
  s+=fade(seg(p,.05,.2),label('＋20 m',A.X(0.2),A.Y(4),{size:26,color:C.x,weight:700}));
  s+=fade(seg(p,.25,.4),label('−20 m',A.X(4.1),A.Y(-14),{size:26,color:C.a,weight:700}));
  s+=card(720,160,420,150,label('4 s 後の 変位',930,215,{size:28,color:C.ink,anchor:'middle'})+label('20 − 20 ＝ 0 m',930,275,{size:34,color:C.x,anchor:'middle',weight:700}),seg(p,.5,.65),C.x);
  return s;
 },
 [K+'why']:(p)=>{
  let s=upColumn({va:1,aa:1});
  s+=card(560,120,560,200,label('加速度は ずっと 同じ −g',840,185,{size:32,color:C.a,anchor:'middle',weight:700})+label('→ 最高点を はさんで 対称',840,255,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3));
  return s;
 },
 [K+'caveat']:(p)=>{
  let s=rect(120,200,260,270,{fill:'#4a5570',fo:.8,stroke:'none',rx:4})+ground(380,700,470);
  s+=fade(seg(p,.05,.2),line(300,200,300,100,{color:C.v,w:3,dash:'6 6'})+ball(300,200));
  s+=fade(seg(p,.1,.25),label('崖の 上から 投げ上げ → 下まで 落ちる',540,140,{size:26,color:C.ink}));
  s+=card(560,250,560,140,label('この 対称は 使えない',840,305,{size:32,color:C.a,anchor:'middle',weight:700})+label('崖の下まで 落ちる・空気抵抗が ある',840,355,{size:24,color:C.dim,anchor:'middle'}),seg(p,.4,.55),C.a);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=upColumn({va:1,aa:seg(p,.3,.5),hl:2});
  s+=card(560,100,560,130,label('最高点で 0',840,150,{size:28,color:C.ink,anchor:'middle'})+label('速度 だけ',840,205,{size:38,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2),C.v);
  s+=card(560,260,560,130,label('加速度',840,310,{size:28,color:C.ink,anchor:'middle'})+label('ずっと 下向きに g',840,365,{size:38,color:C.a,anchor:'middle',weight:700}),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'mis']:(p)=>{
  let s=upColumn({va:1,aa:1});
  s+=card(560,100,560,130,label('加速度の 向き',840,150,{size:28,color:C.ink,anchor:'middle'})+label('変わらない（下）',840,205,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(560,260,560,130,label('速度の 向き',840,310,{size:28,color:C.ink,anchor:'middle'})+label('上 → 下 に 変わる',840,365,{size:36,color:C.v,anchor:'middle',weight:700}),seg(p,.45,.6),C.v);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=card(150,60,900,120,label('落体の運動 ＝ 3公式 ＋ a ＝ ±g',600,135,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(150,220,420,150,label('下向きを 正',360,270,{size:28,color:C.dim,anchor:'middle'})+T2('a=+'+Gt,360,330,{size:48}),seg(p,.3,.42),C.a);
  s+=card(630,220,420,150,label('上向きを 正',840,270,{size:28,color:C.dim,anchor:'middle'})+T2('a=-'+Gt,840,330,{size:48}),seg(p,.5,.62),C.a);
  return s;
 },
 [K+'next']:(p)=>{
  const u=seg(p,.1,.8);
  let s=rect(100,200,200,270,{fill:'#4a5570',fo:.8,stroke:'none',rx:4})+ground(300,1100,470);
  const pts=[];for(let i=0;i<=30;i++){const k=i/30*u;pts.push([300+600*k,200+260*k*k]);}
  s+=draw(pts,1,{color:C.hi,w:3,dash:'8 8'})+ball(300+600*u,200+260*u*u);
  s+=fade(seg(p,.05,.15),arrow(300,160,400,160,{color:C.v,w:5,head:14})+label('横に 投げる',350,130,{size:26,color:C.v,anchor:'middle'}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=fade(.35,rect(100,200,200,270,{fill:'#4a5570',fo:.8,stroke:'none',rx:4})+ground(300,1100,470));
  s+=card(250,130,800,200,label('横に 速く 投げるほど',650,200,{size:32,color:C.ink,anchor:'middle'})+label('落ちるまでの 時間は 長くなる？',650,270,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の単元',600,175,{size:28,color:C.dim,anchor:'middle'})+label('放物運動',600,260,{size:56,color:C.hi,anchor:'middle',weight:700})+label('横と 縦に 分けて 考える',600,315,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('放物運動・深く学ぶ 1/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
