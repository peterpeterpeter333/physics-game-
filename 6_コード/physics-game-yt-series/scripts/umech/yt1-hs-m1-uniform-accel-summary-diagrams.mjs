// 高校編「等加速度運動・要点」(ys-hs-m1-uniform-accel-summary) — 図。Stage 1200×515.
// 深く学ぶ 1/3・2/3・3/3 と同じ図・数値を使う（同じ絵を関数として呼ぶ）。
import {C,seg,fade,label,line,arrow,tex} from './anim.mjs';
import {card,thing} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {hsUA1Diagrams as U1,threeCards,vtAxes,areaUnder,rcard,F1,F2} from './yt1-hs-m1-uniform-accel-1-diagrams.mjs';
import {hsUA2Diagrams as U2} from './yt1-hs-m1-uniform-accel-2-diagrams.mjs';
import {hsUA3Diagrams as U3} from './yt1-hs-m1-uniform-accel-3-diagrams.mjs';

const K='hs-m1-uniform-accel-summary:';
const RX=950;
const u1=k=>U1['hs-m1-uniform-accel-1:'+k],u2=k=>U2['hs-m1-uniform-accel-2:'+k],u3=k=>U3['hs-m1-uniform-accel-3:'+k];

export const hsUASummaryDiagrams={
 [K+'intro']:(p)=>card(200,110,800,260,label('加速度 a が 一定',600,190,{size:36,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.4,.55),label('3つの 式 で',600,260,{size:32,color:C.ink,anchor:'middle'})+label('t 秒後の 速度と 位置を 予言',600,320,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi),
 [K+'formulas']:(p)=>threeCards(p,{y:150,g:[seg(p,.05,.15),seg(p,.3,.4),seg(p,.6,.7)]}),
 [K+'xdisp']:u2('posx'),
 [K+'why1']:(p)=>{
  let s=fade(seg(p,.25,.4),label('加速度の 定義',600,60,{size:30,color:C.a,anchor:'middle',weight:700})+tex('a=\\dfrac{v-v_0}{t}',600,200,{size:60}));
  s+=fade(seg(p,.6,.72),arrow(600,265,600,320,{color:C.dim,w:3,head:12})+label('並べ替え',640,300,{size:26,color:C.hi}));
  s+=card(380,340,440,110,tex(F1,600,400,{size:56}),seg(p,.7,.82),C.hi);
  return s;
 },
 [K+'why2']:u1('result'),
 [K+'why3']:u2('summary'),
 [K+'why4']:u3('notlaw'),
 [K+'choose']:u3('missing'),
 [K+'car']:u3('car'),
 [K+'car2']:u3('car2'),
 [K+'t']:(p)=>{
  let s=tex(F1,600,80,{size:44});
  s+=fade(seg(p,.1,.25),tex('0=20-5t',600,200,{size:56}));
  s+=card(400,270,400,110,tex('t=4\\,\\mathrm{s}',600,330,{size:56}),seg(p,.5,.65),C.t);
  return s;
 },
 [K+'x2']:(p)=>{
  let s=tex(F2,600,80,{size:44});
  s+=fade(seg(p,.05,.2),tex('20\\times4+\\tfrac12\\times(-5)\\times4^2',600,190,{size:50,auto:false}));
  s+=fade(seg(p,.4,.55),tex('=80-40=40\\,\\mathrm{m}',600,290,{size:52,auto:false}));
  s+=fade(seg(p,.7,.85),label('同じ 答え',600,400,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'graph']:(p)=>{
  const A=vtAxes(1,{xmax:4.6,ymax:22.8,xticks:[1,2,3,4],yticks:[5,10,15,20]});
  const f=t=>20-5*t;let s=A.svg+areaUnder(A,f,0,4,{color:C.x,fo:.3,g:seg(p,.3,.5)})+A.plot(f,{from:0,to:4,p:seg(p,.05,.3),color:C.v,w:5,steps:2});
  s+=fade(seg(p,.4,.55),label('底辺 4 s',A.X(1.2),A.Y(0)-16,{size:24,color:C.t,anchor:'middle',weight:700})+label('高さ 20 m/s',A.X(0)+16,A.Y(20)-12,{size:24,color:C.v,weight:700}));
  s+=rcard(110,label('4 × 20 ÷ 2 ＝ 40',RX,180,{size:34,color:C.x,anchor:'middle',weight:700}),seg(p,.6,.75),C.x);
  return s;
 },
 [K+'wrong']:u3('wrong'),
 [K+'back']:(p)=>{
  const X=m=>600+m*10,y=300;let s=line(X(-50),y,X(50),y,{color:C.dim,w:3})+label('正の向き →',X(50),y+40,{size:24,color:C.x,anchor:'end'});
  s+=thing(0,y,X)+arrow(X(0),y-80,X(0)+200,y-80,{color:C.v,w:6,head:18})+label('前へ 走っていた',X(0)+100,y-100,{size:26,color:C.v,anchor:'middle',weight:700});
  s+=arrow(X(0),y+80,X(-40),y+80,{color:C.a,w:6,head:18,g:seg(p,.2,.45)})+fade(seg(p,.35,.5),label('−40 m ？',X(-20),y+120,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('おかしい',X(-20),y-100,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fix']:u3('wrong2'),
 [K+'sum']:u3('sum'),
 [K+'sum2']:u3('sum2'),
 [K+'deep']:(p)=>card(200,130,800,220,label('なぜ そうなるかは',600,215,{size:34,color:C.ink,anchor:'middle'})+label('深く学ぶ版で',600,290,{size:48,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
