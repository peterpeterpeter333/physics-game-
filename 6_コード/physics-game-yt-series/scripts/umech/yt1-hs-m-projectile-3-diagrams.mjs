// 高校編「放物運動・深く学ぶ 3/3」(ys-hs-m-projectile-3) — 図。Stage 1200×515.
// 軌道 y＝0.75x−x²/80（v₀＝25、cosθ＝0.8、sinθ＝0.6、g＝10）、x＝30 で 11.25 m、x＝60 で 0。
// 飛距離 L＝v₀²sin2θ/g：37°・53° → 60 m、45° → 62.5 m。色は 2/3 と同じ（θ 橙）。
import {C,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,axes,tex,poly,ground} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {Gt,Yt,ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {T1} from './yt1-hs-m-projectile-1-diagrams.mjs';
import {slant,SL,yS} from './yt1-hs-m-projectile-2-diagrams.mjs';

const K='hs-m-projectile-3:';
const T=(src,x,y,o={})=>tex(src,x,y,{size:46,...o});
const hl=(src,c=C.hi)=>`{\\color{${c}}${src}}`;
export const traj=x=>0.75*x-x*x/80;

// ---- graph of the path y(x) --------------------------------------------------------------------
export const pathAxes=(g=1)=>axes({x:110,y:430,w:560,h:300,xmin:0,xmax:70,ymin:0,ymax:15,xlabel:'x [m]',ylabel:'高さ y [m]',xticks:[10,20,30,40,50,60],yticks:[5,10,15],grid:true,g,xcolor:C.x,ycolor:C.x});
function pathGraph(p,{draw:dp=1,g=1}={}){const A=pathAxes(g);return {A,s:A.svg+A.plot(traj,{from:0,to:60,p:dp,color:C.hi,w:4,steps:120})};}

// ---- three throws at the same speed (true scale, 1 m = k px) ----------------------------------------
export const TH3={x0:120,y0:440,k:8};
export function threePaths({g=1,ps=[1,1,1],labels=1,lands=0}={}){
 const {x0,y0,k}=TH3;
 const set=[[0.8,0.6,'#a9b6f0','約37°'],[Math.SQRT1_2,Math.SQRT1_2,C.hi,'45°'],[0.6,0.8,C.E,'約53°']];
 let s=fade(g,ground(x0-40,x0+k*66,y0+16));
 set.forEach(([c,sn,col,lab],i)=>{
  const T=2*25*sn/10,pts=Array.from({length:81},(_,j)=>{const t=T*j/80;return [x0+k*25*c*t,y0-k*(25*sn*t-5*t*t)];});
  s+=draw(pts,ps[i],{color:col,w:3,dash:i===1?'':'6 7'});
  const top=pts[40];
  s+=fade(labels*ps[i]*g,label(lab,top[0]+(i===2?-14:i===0?30:0),top[1]-14,{size:24,color:col,anchor:i===2?'end':i===0?'start':'middle',weight:700}));
 });
 if(lands){s+=fade(lands,line(x0+k*60,y0+30,x0+k*60,y0+46,{color:'#a9b6f0',w:3})+label('60 m',x0+k*60-8,y0+70,{size:22,color:'#a9b6f0',anchor:'end',weight:700})+line(x0+k*62.5,y0+30,x0+k*62.5,y0+46,{color:C.hi,w:3})+label('62.5 m',x0+k*62.5+8,y0+70,{size:22,color:C.hi,weight:700}));}
 return s;
}

export const hsProjectile3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=slant({ts:[],path:seg(p,.05,.5)});
  s+=card(760,110,400,170,label('この 通り道は',960,170,{size:28,color:C.ink,anchor:'middle'})+label('本当に 放物線？',960,235,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'q2']:(p)=>{
  let s=threePaths({ps:[seg(p,.05,.35),seg(p,.2,.5),seg(p,.35,.65)],labels:0});
  s+=card(760,110,400,170,label('どの 角度で 投げると',960,170,{size:28,color:C.ink,anchor:'middle'})+label('いちばん 遠く？',960,235,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(110,90,460,170,label('横',340,140,{size:26,color:C.dim,anchor:'middle'})+T('x=20t',340,215,{size:48}),1,C.x);
  s+=card(630,90,460,170,label('縦',860,140,{size:26,color:C.dim,anchor:'middle'})+T(Yt+'=15t-5t^2',860,215,{size:48}),1,C.x);
  s+=card(300,320,600,120,label('時刻 t を 消す',600,395,{size:38,color:C.t,anchor:'middle',weight:700}),seg(p,.3,.45),C.t);
  return s;
 },
 [K+'cond']:(p)=>{
  let s=card(150,60,900,170,label('仮定',600,110,{size:26,color:C.dim,anchor:'middle'})+label('空気抵抗なし ・ 同じ 高さに 着地',600,180,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=card(250,270,700,190,label('計算を 見やすく するため',600,330,{size:28,color:C.ink,anchor:'middle'})+tex(Gt+'=10\\ \\mathrm{m/s^2}',600,410,{size:54,auto:false}),seg(p,.55,.7),C.a);
  return s;
 },
 // ================= S2 t を消す =================
 [K+'two']:(p)=>{
  let s=card(110,90,460,170,label('横',340,140,{size:26,color:C.dim,anchor:'middle'})+T('x=20t',340,215,{size:48}),seg(p,.02,.15),C.x);
  s+=card(630,90,460,170,label('縦',860,140,{size:26,color:C.dim,anchor:'middle'})+T(Yt+'=15t-5t^2',860,215,{size:48}),seg(p,.15,.3),C.x);
  s+=fade(seg(p,.6,.75),label('どちらも t の 式',600,360,{size:34,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 [K+'aim']:(p)=>{
  let s=slant({ts:[0,1,2,3],tl:1});
  s+=card(780,90,380,280,label('通り道 ＝',970,150,{size:28,color:C.dim,anchor:'middle'})+label('x と y の 関係',970,205,{size:32,color:C.x,anchor:'middle',weight:700})+label('t を 消すと',970,280,{size:28,color:C.dim,anchor:'middle'})+label('y を x だけで',970,330,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.x);
  return s;
 },
 [K+'solve']:(p)=>{
  let s=T('x=20t',600,90,{size:50});
  s+=fade(seg(p,.25,.4),label('両辺を 20 で 割る',900,100,{size:26,color:C.hi}));
  s+=card(420,170,360,170,T('t=\\dfrac{x}{20}',600,265,{size:54}),seg(p,.5,.65),C.t);
  return s;
 },
 [K+'sub1']:(p)=>{
  let s=T(Yt+'='+hl('15t','#ffe28a')+'-5t^2',600,80,{size:50,auto:false});
  s+=fade(seg(p,.1,.25),label('t ＝ x ÷ 20 を 入れる',600,155,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),T('15\\times\\dfrac{x}{20}',600,250,{size:50}));
  s+=card(450,320,300,110,T('=0.75x',600,385,{size:50}),seg(p,.6,.75),C.x);
  return s;
 },
 [K+'sub2']:(p)=>{
  let s=T(Yt+'=15t-'+hl('5t^2'),600,70,{size:48,auto:false});
  s+=fade(seg(p,.05,.2),T('t^2=\\left(\\dfrac{x}{20}\\right)^2=\\dfrac{x^2}{400}',600,160,{size:44}));
  s+=fade(seg(p,.4,.55),T('5\\times\\dfrac{x^2}{400}',600,262,{size:46}));
  s+=card(450,340,300,130,T('=\\dfrac{x^2}{80}',600,415,{size:50}),seg(p,.65,.8),C.x);
  return s;
 },
 [K+'result']:(p)=>{
  let s=card(300,80,600,150,T(Yt+'=0.75x-\\dfrac{x^2}{80}',600,165,{size:52}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.35,.5),label('t が 消えた',600,300,{size:34,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('y を x だけで 表せた',600,370,{size:34,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quad']:(p)=>{
  const {A,s:g0}=pathGraph(p,{dp:seg(p,.2,.6)});
  let s=g0;
  s+=card(720,80,440,140,T(Yt+'=0.75x-\\dfrac{x^2}{80}',940,155,{size:40}),1,C.hi);
  s+=card(720,250,440,190,label('x の 2次関数',940,300,{size:28,color:C.ink,anchor:'middle'})+label('x² の 係数が 負',940,350,{size:28,color:C.a,anchor:'middle'})+label('→ 上に凸の 放物線',940,405,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'letters']:(p)=>{
  let s=label('文字のまま（同じ 2つの 操作）',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.2),T(Yt+'=\\dfrac{\\sin\\theta}{\\cos\\theta}\\,x-\\dfrac{'+Gt+'x^2}{2v_0^2\\cos^2\\theta}',600,190,{size:50}));
  s+=fade(seg(p,.45,.6),label('x の 1乗の 項',430,320,{size:28,color:C.x,anchor:'middle',weight:700})+label('x の 2乗の 項',790,320,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('例：0.75x と x²/80',600,410,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'cos0']:(p)=>{
  let s=T('t=\\dfrac{x}{v_0\\cos\\theta}',340,170,{size:50});
  s+=fade(seg(p,.05,.2),label('v₀ cosθ で 割った',340,300,{size:28,color:C.hi,anchor:'middle'}));
  s+=card(640,100,500,230,label('真上に 投げる',890,160,{size:28,color:C.dim,anchor:'middle'})+tex('\\cos\\theta=0',890,230,{size:44,auto:false})+label('→ この 消去は しない',890,295,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.35,.5),C.a);
  return s;
 },
 // ================= S3 数で確かめる =================
 [K+'check']:(p)=>{
  const {s:g0}=pathGraph(p,{dp:seg(p,.1,.6)});
  return g0+card(720,120,440,140,T(Yt+'=0.75x-\\dfrac{x^2}{80}',940,195,{size:40}),1,C.hi)+card(720,300,440,110,label('前回の 運動と 合う？',940,365,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.55));
 },
 [K+'x30']:(p)=>{
  const {A,s:g0}=pathGraph(p);
  let s=g0+fade(seg(p,.1,.3),line(A.X(30),A.Y(0),A.X(30),A.Y(11.25),{color:C.x,w:2,dash:'5 6'})+dot(A.X(30),A.Y(11.25),9,C.hi)+label('11.25 m',A.X(30)+14,A.Y(11.25)-14,{size:24,color:C.x,weight:700}));
  s+=card(720,90,440,190,T(Yt+'=0.75\\times 30-\\dfrac{900}{80}',940,160,{size:34})+T('=22.5-11.25=11.25',940,240,{size:34}),seg(p,.05,.2),C.x);
  s+=card(720,310,440,110,label('前回の 最高点と 一致',940,375,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'x60']:(p)=>{
  const {A,s:g0}=pathGraph(p);
  let s=g0+fade(seg(p,.1,.3),ring(A.X(60),A.Y(0),12,{color:C.hi,w:3})+label('60 m',A.X(60)-16,A.Y(0)-30,{size:24,color:C.x,anchor:'end',weight:700}));
  s+=card(720,90,440,190,T(Yt+'=0.75\\times 60-\\dfrac{3600}{80}',940,160,{size:34})+T('=45-45=0',940,240,{size:34}),seg(p,.05,.2),C.x);
  s+=card(720,310,440,110,label('前回の 着地点と 一致',940,375,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'sym']:(p)=>{
  const {A,s:g0}=pathGraph(p);
  let s=g0+fade(seg(p,.05,.25),line(A.X(30),A.Y(0),A.X(30),A.Y(15),{color:C.hi,w:2,dash:'5 6'})+label('x ＝ 30',A.X(30),A.Y(15)-10,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),dot(A.X(10),A.Y(traj(10)),8,C.x)+dot(A.X(50),A.Y(traj(50)),8,C.x)+line(A.X(10),A.Y(traj(10)),A.X(50),A.Y(traj(50)),{color:C.x,w:2,dash:'4 6'}));
  s+=card(720,140,440,150,label('最高点を はさんで',940,195,{size:28,color:C.ink,anchor:'middle'})+label('左右 対称',940,255,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 // ================= S4 飛距離を文字で =================
 [K+'land']:(p)=>{
  let s=slant({ts:[0,3],tl:1});
  s+=card(760,90,400,280,label('着地 ＝',960,150,{size:28,color:C.dim,anchor:'middle'})+label('y が もう一度 0',960,205,{size:32,color:C.x,anchor:'middle',weight:700})+T(Yt+'=v_0\\sin\\theta\\,t-\\tfrac12'+Gt+'t^2=0',960,300,{size:30}),seg(p,.1,.25),C.x);
  return s;
 },
 [K+'fac']:(p)=>{
  let s=T('v_0\\sin\\theta\\,t-\\tfrac12'+Gt+'t^2=0',600,90,{size:46});
  s+=fade(seg(p,.35,.5),label('t で くくる',600,175,{size:28,color:C.hi,anchor:'middle'}));
  s+=card(330,230,540,130,T('t\\left(v_0\\sin\\theta-\\tfrac12'+Gt+'t\\right)=0',600,300,{size:46}),seg(p,.55,.7),C.t);
  return s;
 },
 [K+'roots']:(p)=>{
  let s=T('t\\left(v_0\\sin\\theta-\\tfrac12'+Gt+'t\\right)=0',600,70,{size:42});
  s+=card(110,140,380,150,T('t=0',300,200,{size:46})+label('投げた 瞬間',300,260,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2));
  s+=card(560,140,530,290,T('v_0\\sin\\theta-\\tfrac12'+Gt+'t=0',825,200,{size:38})+T('t=\\dfrac{2v_0\\sin\\theta}{'+Gt+'}',825,330,{size:48}),seg(p,.45,.6),C.t);
  return s;
 },
 [K+'num3']:(p)=>{
  let s=T('t=\\dfrac{2v_0\\sin\\theta}{'+Gt+'}',600,120,{size:48});
  s+=card(400,230,400,130,T('\\dfrac{2\\times 15}{10}=3\\ \\mathrm{s}',600,295,{size:46,auto:false}),seg(p,.15,.3),C.t);
  s+=fade(seg(p,.55,.7),label('前回と 同じ',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'L']:(p)=>{
  let s=label('飛距離 L ＝ 横の 速度 × 時間',600,80,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=card(250,150,700,170,T('L=v_0\\cos\\theta\\times\\dfrac{2v_0\\sin\\theta}{'+Gt+'}',600,240,{size:46}),seg(p,.3,.45),C.x);
  return s;
 },
 [K+'double']:(p)=>{
  let s=T('L=\\dfrac{2v_0^2\\sin\\theta\\cos\\theta}{'+Gt+'}',600,100,{size:48});
  s+=card(300,230,600,170,label('2倍角の 公式（数II）',600,280,{size:26,color:C.dim,anchor:'middle'})+T('2\\sin\\theta\\cos\\theta=\\sin 2\\theta',600,350,{size:44}),seg(p,.4,.55),C.E);
  return s;
 },
 [K+'Lres']:(p)=>{
  let s=card(330,90,540,190,T('L=\\dfrac{v_0^2\\sin 2\\theta}{'+Gt+'}',600,190,{size:58}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.5,.65),label('同じ 高さに 着地 する ときの 飛距離',600,360,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'numL']:(p)=>{
  let s=T('L=\\dfrac{v_0^2\\sin 2\\theta}{'+Gt+'}',600,90,{size:46});
  s+=fade(seg(p,.05,.25),T('\\sin 2\\theta=2\\times 0.6\\times 0.8=0.96',600,200,{size:40,auto:false}));
  s+=card(330,260,540,130,T('L=\\dfrac{625\\times 0.96}{10}=60\\ \\mathrm{m}',600,325,{size:42,auto:false}),seg(p,.45,.6),C.x);
  s+=fade(seg(p,.75,.88),label('前回と 一致',600,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 45° =================
 [K+'only']:(p)=>{
  let s=T('L=\\dfrac{'+hl('v_0^2')+'\\,'+hl('\\sin 2\\theta',C.E)+'}{'+Gt+'}',600,150,{size:60,auto:false});
  s+=fade(seg(p,.1,.25),label('同じ',600,270,{size:28,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),label('変わるのは ここ だけ',680,330,{size:30,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'max']:(p)=>{
  const A=axes({x:140,y:300,w:520,h:200,xmin:0,xmax:180,ymin:0,ymax:1.2,xlabel:'角 [°]',ylabel:'sin の 値',xticks:[45,90,135,180],yticks:[1],grid:true,g:seg(p,.02,.15)});
  let s=A.svg+A.plot(a=>Math.sin(a*Math.PI/180),{from:0,to:180,p:seg(p,.15,.5),color:C.E,w:4});
  s+=fade(seg(p,.55,.7),dot(A.X(90),A.Y(1),9,C.hi)+label('最大 1（90°）',A.X(90),A.Y(1)-22,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(760,140,400,150,label('sin の 値は',960,195,{size:28,color:C.ink,anchor:'middle'})+label('1 以下',960,255,{size:38,color:C.E,anchor:'middle',weight:700}),seg(p,.3,.45),C.E);
  return s;
 },
 [K+'guess']:(p)=>card(300,130,600,200,tex('2\\theta=90^\\circ',600,210,{size:52,auto:false,color:C.E})+label('θ は 何度？',600,290,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 [K+'ans45']:(p)=>{
  let s=card(330,100,540,170,tex('\\theta=45^\\circ',600,200,{size:64,auto:false,color:C.E}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.4,.55),label('飛距離が 最大',600,360,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'L45']:(p)=>{
  let s=threePaths({ps:[0,seg(p,.05,.5),0],lands:0});
  s+=card(760,120,400,170,T('L=\\dfrac{625\\times 1}{10}',960,190,{size:38,auto:false})+T('=62.5\\ \\mathrm{m}',960,255,{size:40,auto:false,color:C.x}),seg(p,.3,.45),C.x);
  return s;
 },
 [K+'three']:(p)=>{
  let s=threePaths({ps:[seg(p,.05,.35),1,seg(p,.3,.6)],lands:seg(p,.6,.75)});
  s+=card(780,90,380,150,label('約37°：cosθ ＝ 0.8',970,150,{size:26,color:'#a9b6f0',anchor:'middle',weight:700})+label('約53°：cosθ ＝ 0.6',970,205,{size:26,color:C.E,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'pair']:(p)=>{
  let s=fade(.5,threePaths({lands:1}));
  s+=card(720,70,440,330,label('約37° ＋ 約53° ＝ 90°',940,125,{size:28,color:C.ink,anchor:'middle',weight:700})+label('2θ：約74° ＋ 約106° ＝ 180°',940,190,{size:26,color:C.E,anchor:'middle'})+label('sin 2θ は どちらも',940,265,{size:26,color:C.dim,anchor:'middle'})+label('0.96',940,325,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.E);
  return s;
 },
 [K+'mid']:(p)=>{
  let s=threePaths({lands:1});
  s+=fade(seg(p,.1,.3),ring(TH3.x0+TH3.k*62.5,TH3.y0+16,12,{color:C.hi,w:3}));
  s+=card(760,90,400,150,label('45° は 真ん中',960,145,{size:28,color:C.ink,anchor:'middle'})+label('62.5 m',960,205,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'cond2']:(p)=>{
  let s=card(150,80,900,280,label('この 結果の 仮定',600,140,{size:28,color:C.dim,anchor:'middle'})+label('① 空気抵抗が ない',600,215,{size:34,color:C.ink,anchor:'middle',weight:700})+label('② 投げた所と 同じ 高さに 着地',600,285,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'cond3']:(p)=>{
  let s=card(110,90,460,250,label('高い 所から 投げる',340,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（崖の上 など）',340,210,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2));
  s+=card(630,90,460,250,label('空気抵抗が ある',860,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('（実際の 空気の 中）',860,210,{size:24,color:C.dim,anchor:'middle'}),seg(p,.25,.4));
  s+=fade(seg(p,.5,.65),label('45° が 最も 遠いとは 限らない',600,420,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  const {s:g0}=pathGraph(p);
  return g0+card(720,120,440,220,label('y は x の 2次関数',940,190,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 通り道は 放物線',940,260,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
 },
 [K+'ans2']:(p)=>{
  let s=threePaths({lands:1});
  s+=card(760,90,400,170,T('L=\\dfrac{v_0^2\\sin 2\\theta}{'+Gt+'}',960,175,{size:44}),seg(p,.05,.2),C.hi);
  s+=card(760,290,400,100,label('45° で 最大',960,353,{size:32,color:C.E,anchor:'middle',weight:700}),seg(p,.5,.65),C.E);
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(150,60,900,120,label('斜めの 運動 → 横 と 縦 に 分ける',600,135,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(150,210,420,120,label('横：等速',360,282,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.15,.3),C.x);
  s+=card(630,210,420,120,label('縦：落体',840,282,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.25,.4),C.a);
  s+=fade(seg(p,.45,.6),label('同じ 時刻 t で つなぐ',600,385,{size:30,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('新しい 法則は 使っていない',600,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=slant({ts:[0,1,2,3],tl:0,va:1,vya:.25});
  s+=card(780,100,380,200,label('横には 力が ない',970,165,{size:28,color:C.ink,anchor:'middle'})+label('→ 横の 速度は',970,225,{size:28,color:C.v,anchor:'middle'})+label('変わらない',970,270,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=fade(.35,slant({ts:[0,1,2,3],tl:0,va:1,vya:.25}));
  s+=card(250,130,700,200,label('力が はたらくと',600,200,{size:32,color:C.F,anchor:'middle',weight:700})+label('速度は どう 変わる？',600,275,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の単元',600,175,{size:28,color:C.dim,anchor:'middle'})+label('力と運動方程式',600,260,{size:56,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('力と運動方程式・深く学ぶ 1/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
