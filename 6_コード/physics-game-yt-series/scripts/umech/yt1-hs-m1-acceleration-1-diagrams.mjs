// 高校編「加速度・深く学ぶ 1/2」(ys-hs-m1-acceleration-1) — 図。Stage 1200×515.
// 色（anim.mjs C）：位置 x 水色、速度 v 紫、加速度・速度の変化 赤、時刻 t 金、強調 黄。
// 部品は速度の回（yt1-hs-m1-velocity-*-diagrams.mjs）から借りる。2/2・要点でも使う部品は export する。
import {C,seg,fade,label,line,rect,dot,arrow,tex} from './anim.mjs';
import {card,brace} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {hsVelocity2Diagrams as V2} from './yt1-hs-m1-velocity-2-diagrams.mjs';

const K='hs-m1-acceleration-1:';
const v2=k=>V2['hs-m1-velocity-2:'+k];

// ---- strobe record: positions every 1 s (top: 10 m each, bottom: 1,3,5,7,9 m) -------------
const SX=m=>140+18*m;
const TOP=[0,10,20,30,40,50],BOT=[0,1,4,9,16,25];
function car(x,y,color){return rect(x-22,y-40,44,26,{fill:color,fo:.85,stroke:color,rx:6})+dot(x-12,y-11,5,C.ink)+dot(x+12,y-11,5,C.ink);}
function strobeRow(pos,y,{n=6,color=C.x,name='',gaps=0,gapColor=C.hi,hl=0}={}){
 let s=line(SX(0)-20,y,SX(52),y,{color:C.faint,w:3});
 s+=label(name,SX(0)-30,y+9,{size:26,color,anchor:'end',weight:700});
 for(let i=0;i<n;i++)s+=dot(SX(pos[i]),y,9,color,i===n-1?1:.75);
 if(n>0)s+=car(SX(pos[n-1]),y-6,color);
 if(gaps>0)for(let i=1;i<n;i++)s+=fade(gaps,label(String(pos[i]-pos[i-1]),(SX(pos[i])+SX(pos[i-1]))/2,y+38,{size:24,color:gapColor,anchor:'middle',weight:700}));
 if(hl>0)s+=fade(hl*.9,rect(SX(0)-14,y-60,SX(52)-SX(0)+28,112,{fill:gapColor,fo:.06,stroke:gapColor,sw:2.5,rx:10}));
 return s;
}
export function strobe(p,{nT=6,nB=6,gT=1,gB=1,hlT=0,hlB=0}={}){
 let s=label('1 s ごとの 位置（数字は 間隔 [m]）',600,48,{size:24,color:C.dim,anchor:'middle'});
 s+=strobeRow(TOP,170,{n:nT,color:C.x,name:'上',gaps:gT,hl:hlT});
 s+=strobeRow(BOT,330,{n:nB,color:C.E,name:'下',gaps:gB,hl:hlB});
 return s;
}

// ---- timeline with speed read-outs (速度計の表示) -------------------------------------------
// T(t) → x; boxes above the axis show v [m/s]
export function speedLine(t1,vals,{y=330,x0=220,dx=180,g=1,show=null,steps=0,stepColor=C.a,box=1,unit=true}={}){
 const T=t=>x0+dx*t;
 let s=fade(g,line(T(0)-30,y,T(t1)+40,y,{color:C.dim,w:3})+arrow(T(t1)+30,y,T(t1)+60,y,{color:C.dim,w:3,head:12}));
 for(let t=0;t<=t1;t++)s+=fade(g,line(T(t),y-8,T(t),y+8,{color:C.dim,w:2})+label(`${t} s`,T(t),y+36,{size:22,color:C.t,anchor:'middle'}));
 vals.forEach((v,t)=>{if(v===null)return;const a=show?show(t):1;if(a<=0)return;
  s+=fade(a*g,rect(T(t)-58,y-112,116,58,{fill:'#131f38',fo:.96,stroke:C.v,sw:2,rx:10})+label(String(v),T(t),y-73,{size:30,color:C.v,anchor:'middle',weight:700})+line(T(t),y-54,T(t),y-8,{color:C.v,w:2,dash:'4 5'}));});
 if(unit)s+=fade(g*box,label('速度 [m/s]',T(0)-76,y-74,{size:22,color:C.v,anchor:'end'}));
 if(steps>0)for(let t=1;t<vals.length;t++){if(vals[t]===null||vals[t-1]===null)continue;const d=vals[t]-vals[t-1];
  s+=fade(steps,label(`${d>=0?'＋':'−'}${Math.abs(d)}`,(T(t)+T(t-1))/2,y-128,{size:26,color:stepColor,anchor:'middle',weight:700}));}
 return {svg:s,T};
}

export const hsAcceleration1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:v2('next'),
 [K+'ball']:v2('ball'),
 [K+'plan']:(p)=>{
  let s=card(110,150,430,190,label('速度の',325,225,{size:32,color:C.v,anchor:'middle'})+label('「変わり方」',325,285,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.v);
  s+=arrow(570,245,680,245,{color:C.dim,w:4,g:seg(p,.4,.55)});
  s+=card(710,150,380,190,label('加速度',900,265,{size:56,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'series']:(p)=>{
  const items=[['1','作り方','1 s あたりの 速度の変化'],['2','符号と グラフ','マイナスの 意味・v-t グラフ']];
  let s=fade(seg(p,0,.12),label('加速度の単元 2回',600,80,{size:34,color:C.ink,anchor:'middle',weight:700}));
  items.forEach(([n,a,b],i)=>{const x=150+i*480,g=seg(p,.1+i*.3,.28+i*.3),on=i===0&&p>.3;
   s+=card(x,140,420,240,label(n,x+210,210,{size:50,color:C.hi,anchor:'middle',weight:700})+label(a,x+210,285,{size:38,color:C.a,anchor:'middle',weight:700})+label(b,x+210,340,{size:26,color:C.ink,anchor:'middle'}),g,on?C.hi:C.faint);
   if(i===0)s+=arrow(x+430,260,x+470,260,{color:C.dim,w:3,head:12,g:seg(p,.42,.5)});});
  s+=fade(seg(p,.2,.35),label('今回',360,128,{size:24,color:C.hi,anchor:'middle'}));
  return s;
 },
 // ================= S2 速いと、速くなっている =================
 [K+'strobe']:(p)=>{const k=1+Math.floor(5*seg(p,.1,.85)+1e-6);return strobe(p,{nT:k,nB:k,gT:0,gB:0});},
 [K+'top']:(p)=>strobe(p,{gT:seg(p,.1,.35),gB:0,hlT:seg(p,.5,.7)}),
 [K+'bottom']:(p)=>strobe(p,{gB:seg(p,.1,.6),hlB:seg(p,.65,.8)}),
 [K+'guess']:(p)=>strobe(p)+card(150,400,900,96,label('速いのは？　速くなっているのは？',600,460,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
 [K+'fast']:(p)=>{
  let s=strobe(p,{hlT:seg(p,.05,.2)});
  s+=card(150,400,900,96,label('上：1 s に 10 m　＞　下：どの 1 s も 9 m 以下',600,460,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.3,.45),C.x);
  return s;
 },
 [K+'same']:(p)=>{
  let s=strobe(p,{hlT:1});
  s+=card(150,400,900,96,label('間隔が 同じ → 速度は 一定、速くなっていない',600,460,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'grow']:(p)=>{
  let s=strobe(p,{hlB:seg(p,.05,.2)});
  s+=card(150,400,900,96,label('間隔が 広がる → 速度が 増えている',600,460,{size:32,color:C.E,anchor:'middle',weight:700}),seg(p,.3,.45),C.E);
  return s;
 },
 [K+'differ']:(p)=>{
  let s=card(60,60,480,170,label('速い',300,125,{size:38,color:C.v,anchor:'middle',weight:700})+label('速度が 大きい',300,185,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.v);
  s+=card(660,60,480,170,label('速くなっている',900,125,{size:38,color:C.a,anchor:'middle',weight:700})+label('速度が 変化している',900,185,{size:28,color:C.ink,anchor:'middle'}),seg(p,.25,.4),C.a);
  s+=fade(seg(p,.25,.4),label('≠',600,160,{size:48,color:C.hi,anchor:'middle',weight:700}));
  s+=card(200,290,800,120,label('測りたいのは「速度の変化」',600,365,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 // ================= S3 1秒あたりの速度の変化 =================
 [K+'car20']:(p)=>{
  const L=speedLine(4,[0,null,null,null,20],{g:seg(p,.05,.2),show:t=>t===0?seg(p,.15,.3):seg(p,.5,.65)});
  return L.svg+fade(seg(p,.5,.65),label('止まっていた → 4 s 後',600,460,{size:28,color:C.dim,anchor:'middle'}));
 },
 [K+'dv20']:(p)=>{
  const L=speedLine(4,[0,null,null,null,20]);
  let s=L.svg;
  s+=fade(seg(p,.05,.25),brace(L.T(0),L.T(4),196,{dir:-1,color:C.a})+label('速度の変化　20 − 0 ＝ 20 m/s',600,140,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),brace(L.T(0),L.T(4),388,{color:C.t,text:'4 s 間',size:26}));
  return s;
 },
 [K+'per1']:(p)=>{
  const L=speedLine(4,[0,5,10,15,20],{y:300,show:t=>t===0||t===4?1:seg(p,.3+.08*t,.4+.08*t),steps:seg(p,.65,.8)});
  let s=L.svg;
  s+=fade(seg(p,.05,.25),tex('20\\div 4=5',380,440,{size:48,auto:false}));
  s+=fade(seg(p,.6,.8),label('1 s あたり ＋5 m/s',780,452,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'define']:(p)=>{
  let s=card(160,80,880,200,label('加速度 ＝ 1 s あたりの 速度の変化',600,175,{size:42,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.35,.5),label('（定義）',600,240,{size:28,color:C.hi,anchor:'middle'})),seg(p,.05,.25),C.a);
  s+=fade(seg(p,.7,.85),label('記号',470,380,{size:30,color:C.dim,anchor:'end'})+tex('a',530,372,{size:60}));
  return s;
 },
 [K+'unitname']:(p)=>{
  let s=card(160,80,880,200,label('加速度 ＝ 1 s あたりの 速度の変化',600,175,{size:42,color:C.a,anchor:'middle',weight:700})+label('（定義）',600,240,{size:28,color:C.hi,anchor:'middle'}),1,C.a);
  s+=fade(seg(p,.05,.2),label('単位',330,360,{size:30,color:C.dim,anchor:'end'})+tex('\\mathrm{m/s^2}',430,352,{size:50,auto:false})+label('メートル毎秒毎秒',520,362,{size:28,color:C.ink}));
  s+=fade(seg(p,.5,.65),label('この車：a ＝ 5 m/s²',600,450,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'symbols']:(p)=>{
  const L=speedLine(4,[null,null,null,null,null],{y:300,unit:false});
  let s=L.svg;
  const bx=(t,src,g)=>fade(g,rect(L.T(t)-58,188,116,58,{fill:'#131f38',fo:.96,stroke:C.v,sw:2,rx:10})+tex(src,L.T(t),226,{size:40})+line(L.T(t),246,L.T(t),292,{color:C.v,w:2,dash:'4 5'}));
  s+=bx(0,'v_0',seg(p,.1,.3))+fade(seg(p,.1,.3),label('時刻 0',L.T(0),420,{size:26,color:C.t,anchor:'middle'}));
  s+=bx(4,'v',seg(p,.55,.75))+fade(seg(p,.55,.75),label('時刻 t',L.T(4),420,{size:26,color:C.t,anchor:'middle'}));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=fade(seg(p,.05,.25),tex('a=\\dfrac{v-v_0}{t}',360,250,{size:80}));
  s+=fade(seg(p,.25,.45),label('← 速度の変化（あと − はじめ）',560,218,{size:28,color:C.a}));
  s+=fade(seg(p,.55,.75),label('← かかった時間',560,318,{size:28,color:C.t}));
  s+=fade(seg(p,.8,.92),label('例：(20 − 0) ÷ 4 ＝ 5',600,450,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 ...Object.fromEntries([['uneven',0],['avg',1]].map(([k,st])=>[K+k,(p)=>{
  const A=speedLine(4,[0,5,10,15,20],{y:160,steps:1,unit:false});
  const B=speedLine(4,[0,2,6,13,20],{y:370,steps:st?1:seg(p,.3,.5),show:t=>st||t===0||t===4?1:seg(p,.15,.3),unit:false});
  let s=A.svg+B.svg+label('一定に 増える',A.T(4)+80,110,{size:24,color:C.dim})+fade(st?1:seg(p,.15,.3),label('途中で 変わる',A.T(4)+80,320,{size:24,color:C.dim}));
  if(!st)s+=fade(seg(p,.6,.75),label('どちらも (20 − 0) ÷ 4 ＝ 5',600,480,{size:30,color:C.a,anchor:'middle',weight:700}));
  else s+=card(240,432,720,76,label('平均の加速度',420,482,{size:28,color:C.ink,anchor:'middle'})+tex('\\bar a=5\\,\\mathrm{m/s^2}',700,476,{size:40}),seg(p,.05,.2),C.a);
  return s;
 }])),
 // ================= S4 はじめの速度と、引き算の順 =================
 [K+'v0']:(p)=>speedLine(4,[3,null,null,null,11],{y:300,g:seg(p,.05,.2),show:t=>t===0?seg(p,.15,.3):seg(p,.55,.7)}).svg,
 [K+'v0read']:(p)=>{
  const L=speedLine(4,[3,null,null,null,11],{y:300});
  let s=L.svg+fade(seg(p,.05,.2),rect(L.T(0)-64,180,128,74,{fill:C.hi,fo:.05,stroke:C.hi,sw:3,rx:12}));
  s+=fade(seg(p,.1,.3),tex('v_0',L.T(0),140,{size:44}));
  s+=card(330,400,700,90,label('v₀（ブイ・ゼロ）＝ 測り始めの速度 3 m/s',680,457,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.35,.5),C.v);
  return s;
 },
 [K+'calc']:(p)=>{
  const L=speedLine(4,[3,null,null,null,11],{y:250});
  let s=L.svg;
  s+=fade(seg(p,.05,.2),tex('a=\\dfrac{11-3}{4}',330,430,{size:50}));
  s+=fade(seg(p,.3,.45),tex('=\\dfrac{8}{4}',560,430,{size:50,auto:false}));
  s+=fade(seg(p,.55,.7),tex('=2\\,\\mathrm{m/s^2}',780,430,{size:50,auto:false,color:C.a}));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(150,40,900,110,label('11 ÷ 4 ＝ 2.75',430,108,{size:40,color:C.dim,anchor:'middle'})+label('まちがい',840,108,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  const U=50,x0=240,y=260;
  s+=fade(seg(p,.3,.45),rect(x0,y,3*U,56,{fill:C.dim,fo:.35,stroke:C.dim,rx:4})+label('はじめから 3',x0+1.5*U,y+100,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),rect(x0+3*U,y,8*U,56,{fill:C.a,fo:.45,stroke:C.a,rx:4})+label('増えた分 8',x0+7*U,y+100,{size:26,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('あとの速度 11',x0,y-20,{size:26,color:C.v}));
  return s;
 },
 [K+'order']:(p)=>{
  let s=card(200,50,800,120,label('変化 ＝ あと − はじめ',600,128,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.35,.5),label('速度の変化',380,270,{size:30,color:C.a,anchor:'end'})+tex('v-v_0',520,262,{size:46}));
  s+=fade(seg(p,.6,.75),label('変位',380,380,{size:30,color:C.x,anchor:'end'})+tex('\\Delta x=x-x_0',570,372,{size:46}));
  s+=fade(seg(p,.6,.75),label('（速度の回）',800,385,{size:24,color:C.dim}));
  return s;
 },
 ...Object.fromEntries([['ab',0],['abq',1],['abans',2]].map(([k,st])=>[K+k,(p)=>{
  const g=st?1:seg(p,.05,.3);
  const fill=st===2?seg(p,.05,.35):0;
  const A=speedLine(2,[0,st===2?6:null,12],{y:180,x0:250,dx:140,g,show:t=>t===1?fill:1,steps:st===2?seg(p,.3,.45):0,unit:false});
  const B=speedLine(5,[0,...[5,10,15,20].map(v=>st===2?v:null),25],{y:395,x0:250,dx:140,g:st?1:seg(p,.3,.55),show:t=>t===0||t===5?1:fill,steps:st===2?seg(p,.3,.45):0,unit:false});
  let s=A.svg+B.svg+fade(g,label('A',190,150,{size:34,color:'#8fd3ff',anchor:'end',weight:700}))+fade(st?1:seg(p,.3,.55),label('B',190,365,{size:34,color:C.E,anchor:'end',weight:700}));
  if(st===1)s+=card(640,40,500,90,label('加速度が 大きいのは？',890,98,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  if(st===2){s+=fade(seg(p,.45,.6),label('A：12 ÷ 2 ＝ 6 m/s²',840,95,{size:32,color:C.a,anchor:'middle',weight:700}));
   s+=fade(seg(p,.65,.8),label('B：25 ÷ 5 ＝ 5 m/s²',840,160,{size:32,color:C.a,anchor:'middle',weight:700}));}
  return s;
 }])),
 [K+'abmean']:(p)=>{
  let s=card(110,60,980,140,label('最後の速度',330,145,{size:30,color:C.dim,anchor:'middle'})+label('B 25 ＞ A 12',760,145,{size:40,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2),C.v);
  s+=card(110,230,980,140,label('加速度',330,315,{size:30,color:C.dim,anchor:'middle'})+label('A 6 ＞ B 5',760,315,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.3,.45),C.a);
  s+=fade(seg(p,.6,.75),label('速い ≠ 加速度が 大きい',600,460,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 単位 =================
 ...Object.fromEntries([['unit1',1],['unit2',2],['unit3',3]].map(([k,st])=>[K+k,(p)=>{
  const g=q=>st>q?1:seg(p,.1,.35);
  let s=fade(g(0),tex('\\dfrac{20\\,\\mathrm{m/s}}{4\\,\\mathrm{s}}',260,230,{size:60,auto:false}));
  s+=fade(g(0),label('← 速度の変化',380,195,{size:24,color:C.a})+label('← 時間',380,280,{size:24,color:C.t}));
  if(st>=2)s+=fade(g(1),tex('=5\\,\\dfrac{\\mathrm{m/s}}{\\mathrm{s}}',680,230,{size:60,auto:false}));
  if(st>=2)s+=fade(st>2?1:seg(p,.5,.7),label('m/s を さらに s で 割る',680,370,{size:28,color:C.ink,anchor:'middle'}));
  if(st>=3){s+=fade(seg(p,.15,.35),tex('=5\\,\\mathrm{m/s^2}',1000,230,{size:60,auto:false,color:C.a}));
   s+=fade(seg(p,.5,.7),label('s で 2回 割った 跡',1000,330,{size:28,color:C.hi,anchor:'middle',weight:700}));}
  return s;
 }])),
 [K+'unit4']:(p)=>{
  let s=card(160,30,880,160,tex('5\\,\\mathrm{m/s^2}',340,115,{size:56,auto:false,color:C.a})+label('＝ 毎秒、速度が 5 m/s ずつ 増える',720,122,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=speedLine(4,[0,5,10,15,20],{y:400,show:t=>seg(p,.3+.1*t,.4+.1*t),steps:seg(p,.7,.85)}).svg;
  return s;
 },
 // ================= S6 毎秒毎秒を、数で読む =================
 [K+'given']:(p)=>{
  let s=fade(seg(p,.05,.25),label('はじめの速度',380,190,{size:30,color:C.ink,anchor:'end'})+tex('v_0=3\\,\\mathrm{m/s}',540,182,{size:48}));
  s+=fade(seg(p,.45,.65),label('加速度',380,320,{size:30,color:C.ink,anchor:'end'})+tex('a=2\\,\\mathrm{m/s^2}',540,312,{size:48}));
  return s;
 },
 [K+'table']:(p)=>{
  let s=label('v₀ ＝ 3 m/s、a ＝ 2 m/s²',600,60,{size:28,color:C.dim,anchor:'middle'});
  const X=i=>460+170*i;
  s+=label('時刻 t [s]',300,170,{size:30,color:C.t,anchor:'end'})+label('速度 v [m/s]',300,280,{size:30,color:C.v,anchor:'end'});
  s+=line(160,215,1100,215,{color:C.faint,w:2});
  [3,5,7,9].forEach((v,i)=>{const g=seg(p,.05+.17*i,.17+.17*i);
   s+=fade(g,label(String(i),X(i),170,{size:36,color:C.t,anchor:'middle'})+label(String(v),X(i),285,{size:44,color:C.v,anchor:'middle',weight:700}));
   if(i>0)s+=fade(seg(p,.7,.85),label('＋2',(X(i)+X(i-1))/2,370,{size:36,color:C.a,anchor:'middle',weight:700})+arrow(X(i-1)+20,330,X(i)-20,330,{color:C.a,w:3,head:12}));});
  s+=fade(seg(p,.8,.92),label('毎秒 ＋2 m/s',600,460,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'notpos']:(p)=>{
  let s=card(150,60,900,140,label('毎秒 2 ずつ 増えるのは 速度',600,125,{size:38,color:C.v,anchor:'middle',weight:700})+label('3 → 5 → 7 → 9 m/s',600,175,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.v);
  s+=card(150,260,900,140,label('位置が 毎秒 2 m ずつ 増える',600,325,{size:36,color:C.dim,anchor:'middle'})+label('ではない',600,375,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.45,.6),C.a);
  s+=fade(seg(p,.6,.75),line(330,315,870,315,{color:C.a,w:4}));
  return s;
 },
 [K+'move']:(p)=>{
  let s=label('1 s → 2 s の 間：速度 5 → 7 m/s',600,80,{size:32,color:C.v,anchor:'middle',weight:700});
  const U=90,x0=200;
  s+=fade(seg(p,.1,.25),label('2 m',x0-20,214,{size:28,color:C.dim,anchor:'end'})+rect(x0,190,2*U,36,{fill:C.dim,fo:.3,stroke:C.dim,rx:4}));
  s+=fade(seg(p,.35,.55),label('5 m',x0-20,324,{size:28,color:C.x,anchor:'end'})+rect(x0,300,5*U,36,{fill:C.x,fo:.4,stroke:C.x,rx:4})+rect(x0+5*U,300,2*U,36,{fill:C.x,fo:.12,stroke:C.x,rx:4}));
  s+=fade(seg(p,.35,.55),label('〜 7 m',x0+7*U+16,326,{size:26,color:C.x}));
  s+=fade(seg(p,.6,.8),label('この 1 s で 5 m 以上 進む',600,450,{size:32,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=card(150,50,900,120,label('加速度 ＝ 1 s あたりの 速度の変化（定義）',600,125,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(300,210,600,170,tex('a=\\dfrac{v-v_0}{t}',600,300,{size:64}),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(150,50,900,120,label('加速度 ＝ 1 s あたりの 速度の変化（定義）',600,125,{size:36,color:C.a,anchor:'middle',weight:700}),1,C.a);
  s+=card(150,210,900,170,label('単位 m/s²',600,280,{size:40,color:C.a,anchor:'middle',weight:700})+label('速さ ではなく、速度の 変わり方',600,340,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'plus']:(p)=>{
  const rows=[['0 → 20 m/s','＋5'],['3 → 11 m/s','＋2'],['0 → 12 m/s','＋6'],['0 → 25 m/s','＋5']];
  let s=label('今回の 例',600,60,{size:28,color:C.dim,anchor:'middle'});
  rows.forEach(([a,b],i)=>{const g=seg(p,.05+.1*i,.15+.1*i);s+=fade(g,label(a,560,130+70*i,{size:32,color:C.v,anchor:'end'})+label(`a ＝ ${b} m/s²`,620,130+70*i,{size:32,color:C.a}));});
  s+=fade(seg(p,.55,.7),label('どれも 速度が 増える → a は プラス',600,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>card(150,130,900,220,label('加速度が マイナス のとき',600,215,{size:36,color:C.ink,anchor:'middle'})+label('いつも 遅くなっている？',600,290,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi),
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('加速度の 符号',600,260,{size:52,color:C.a,anchor:'middle',weight:700})+label('マイナスは 何を 表す？',600,315,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.a);
  s+=fade(seg(p,.5,.7),label('加速度・深く学ぶ 2/2 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
