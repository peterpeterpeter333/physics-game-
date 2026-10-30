// 高校編「熱力学第一法則・要点」(ys-hs-t-firstlaw-summary) — 図。Stage 1200×515.
// 深く学ぶ版（1/3・2/3）の部品と色をそのまま使う。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,clamp,mix} from './anim.mjs';
import {card,tag,T2,TC,QC,Tt,sceneT,thermo,PC,VC,Pt,Vt,syringe,MOL,molBox,UC,WC,Ut,Qt,Wt,dU,DT,LAW,JJ,mrow,flame,QA,WA,wallBounce,bar,HOT} from './yt1-hs-t-firstlaw-1-diagrams.mjs';
import {pvAxes,gX,gY} from './yt1-hs-t-firstlaw-2-diagrams.mjs';

const K='hs-t-firstlaw-summary:';
const SY=(o={})=>syringe({yc:230,h:170,...o});
const lawCard=(g=1,y=60)=>card(300,y,600,130,T2(LAW,600,y+75,{size:60}),g,C.hi);

export const hsTFirstlawSummaryDiagrams={
 [K+'c']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:430,y:110,w:340,h:240,n:14,dist:260*t,seed:4,color:MOL});
  s+=fade(seg(p,.2,.4),flame(600,470)+QA(600,430,600,360)+label('もらった 熱',700,440,{size:28,color:QC,weight:700}));
  s+=fade(seg(p,.45,.65),WA(1000,230,780,230)+label('された 仕事',900,200,{size:28,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.2),label('内部エネルギーの 増加',600,80,{size:30,color:UC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c2']:(p)=>{
  let s=lawCard(seg(p,.05,.25),90);
  s+=fade(seg(p,.25,.4),label('内部エネルギーの 増加',400,280,{size:26,color:UC,anchor:'middle',weight:700})+label('入った 熱',640,280,{size:26,color:QC,anchor:'middle',weight:700})+label('された 仕事',850,280,{size:26,color:WC,anchor:'middle',weight:700}));
  s+=tag('熱力学第一法則',600,400,{g:seg(p,.5,.7),size:30});
  return s;
 },
 [K+'why']:(p)=>{
  let s=card(80,90,420,150,label('熱 Q',290,150,{size:34,color:QC,anchor:'middle',weight:700})+label('壁ごしに 加熱',290,205,{size:26,color:C.ink,anchor:'middle'}),seg(p,.0,.15),QC);
  s+=card(80,290,420,150,label('仕事 W',290,350,{size:34,color:WC,anchor:'middle',weight:700})+label('ピストンで 押す',290,405,{size:26,color:C.ink,anchor:'middle'}),seg(p,.0,.15),WC);
  s+=fade(seg(p,.2,.4),arrow(520,165,700,250,{color:QC,w:6,head:18})+arrow(520,365,700,280,{color:WC,w:6,head:18}));
  s+=card(720,170,420,170,label('分子の 運動が',930,230,{size:30,color:C.ink,anchor:'middle',weight:700})+label('激しく なる',930,290,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'why2']:(p)=>wallBounce(seg(p,.05,.95),{dir:-1}),
 [K+'why3']:(p)=>{
  const k=1.4,b=460;
  let s=bar(300,b,100,k,{color:QC,top:'Q',g:seg(p,.05,.2)});
  s+=bar(450,b,60,k,{color:WC,top:'W',g:seg(p,.1,.25)});
  s+=fade(seg(p,.3,.45),label('＝',600,b-80,{size:50,color:C.ink,anchor:'middle',weight:700}));
  s+=bar(800,b,160,k,{color:UC,top:'ΔU',w:150,g:seg(p,.4,.6)});
  s+=fade(seg(p,.6,.8),label('エネルギー保存',600,70,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sign']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(800,680,seg(p,.5,.9));
  let s=SY({xp,dist:220*t,push:seg(p,.45,.6)});
  s+=fade(seg(p,.05,.25),flame(450,470)+QA(450,430,450,345)+T2(`${Qt}>0`,560,400,{size:40}));
  s+=fade(seg(p,.5,.7),T2(`${Wt}>0`,1060,110,{size:40}));
  return s;
 },
 [K+'sign2']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(680,800,seg(p,.05,.4));
  let s=SY({xp,dist:220*t});
  s+=fade(seg(p,.1,.3),arrow(xp+40,350,xp+150,350,{color:PC,w:6,head:18})+T2(`${Wt}<0`,xp+95,410,{size:40}));
  s+=card(150,410,560,90,mrow(['@','=-',Wt].map((q,i)=>i===1?'=-':q),430,455,{size:40}),seg(p,.55,.75),WC);
  return s;
 },
 [K+'ex']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(700,800,seg(p,.4,.8));
  let s=SY({xp,dist:220*t});
  s+=fade(seg(p,.05,.25),flame(480,470)+QA(480,420,480,345)+label('100 J',530,400,{size:30,color:QC,weight:700}));
  s+=fade(seg(p,.4,.6),arrow(xp+40,370,xp+150,370,{color:WC,w:7,head:18})+label('外へ 30 J',xp+95,420,{size:28,color:WC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=card(330,50,540,110,T2(`${Wt}=-30${JJ}`,600,108,{size:48}),seg(p,.05,.2),WC);
  s+=card(150,210,900,150,T2(`${dU}=100+(-30)=70${JJ}`,600,285,{size:56}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'ex2b']:(p)=>{
  const k=1.4,b=460;
  let s=bar(300,b,100,k,{color:QC,top:'入れた 100 J',w:140,g:seg(p,.05,.2)});
  s+=fade(seg(p,.25,.45),rect(600-70,b-100*k,140,30*k,{fill:WC,fo:.5,stroke:WC,sw:2,rx:6})+label('外への 仕事 30 J',690,b-100*k+30,{size:28,color:WC,weight:700}));
  s+=fade(seg(p,.5,.7),rect(600-70,b-70*k,140,70*k,{fill:UC,fo:.5,stroke:UC,sw:2,rx:6})+label('残る 70 J',690,b-30,{size:28,color:UC,weight:700}));
  s+=line(150,b,1000,b,{color:C.dim,w:2});
  return s;
 },
 [K+'ex3']:(p)=>{
  let s=fade(.6,T2(`${dU}=70${JJ}`,600,70,{size:40}));
  s+=card(110,130,980,150,T2(`${DT}=\\dfrac{70}{1.5\\times1.0\\times8.3}\\approx 5.6\\ \\mathrm{K}`,600,205,{size:48}),seg(p,.1,.3),TC);
  s+=fade(seg(p,.5,.7),label('1.0 mol・単原子',600,350,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=card(180,100,840,130,T2(`100+30=130${JJ}`,600,170,{size:54,color:C.a,auto:false}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.4,.55),line(250,170,950,170,{color:C.a,w:6}));
  return s;
 },
 [K+'wrong2']:(p)=>{
  let s=fade(.5,card(180,60,840,110,T2(`100+30=130${JJ}`,600,120,{size:44,color:C.a,auto:false})+line(250,120,950,120,{color:C.a,w:5}),1,C.a));
  s+=card(180,220,840,160,T2(`100+(-30)=70${JJ}`,600,285,{size:54})+label('外へ した 仕事 → W では 負',600,350,{size:28,color:WC,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'v']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:120,y:100,w:360,h:280,n:14,dist:260*t,seed:6,color:MOL})+flame(300,470)+QA(300,430,300,390);
  s+=fade(seg(p,.05,.2),label('定積',300,70,{size:32,color:VC,anchor:'middle',weight:700}));
  s+=card(600,130,500,220,T2(`${Wt}=0`,850,200,{size:46})+T2(`${dU}=${Qt}`,850,290,{size:56}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'ad']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(800,660,seg(p,.5,.9));
  let s=SY({xp,dist:220*t,push:seg(p,.45,.6)});
  s+=fade(seg(p,.05,.2),label('断熱',480,100,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=card(200,360,800,130,T2(`${Qt}=0,\\qquad ${dU}=${Wt}`,600,425,{size:50}),seg(p,.1,.3),C.hi);
  s+=thermo(1150,290,450,40+100*seg(p,.6,.9));
  return s;
 },
 [K+'pump']:(p)=>{
  let s=rect(500,180,80,230,{fill:'#0f1a30',fo:.9,stroke:C.dim,sw:3,rx:6});
  const d=120*seg(p,.05,.4),py=210+d;
  s+=rect(504,py,72,14,{fill:'#7d8aa3',fo:1,stroke:'none',rx:3})+rect(534,py-120,12,120,{fill:'#7d8aa3',fo:1,stroke:'none'})+rect(480,py-134,120,18,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:6});
  s+=rect(504,py+14,72,410-py-18,{fill:HOT,fo:.3*seg(p,.2,.6),stroke:'none'});
  s+=thermo(680,200,420,60+120*seg(p,.3,.7));
  s+=fade(seg(p,.4,.6),label('素早く 押す → 断熱 圧縮',780,300,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'iso']:(p)=>{
  let s=card(150,70,900,110,label('等温（温度 一定）',600,140,{size:36,color:TC,anchor:'middle',weight:700}),seg(p,.0,.15),TC);
  s+=card(150,230,420,120,T2(`${dU}=0`,360,290,{size:52}),seg(p,.2,.4),UC);
  s+=fade(seg(p,.4,.55),arrow(590,290,650,290,{color:C.hi,w:5,head:16}));
  s+=card(670,230,380,120,T2(`${Qt}=-${Wt}`,860,290,{size:52}),seg(p,.5,.7),QC);
  return s;
 },
 [K+'pdv']:(p)=>{
  let s=pvAxes()+fade(seg(p,.2,.4),rect(gX(25),gY(1),gX(27)-gX(25),gY(0)-gY(1),{fill:WC,fo:.3,stroke:WC,sw:2.5,rx:0}))+draw([[gX(25),gY(1)],[gX(27),gY(1)]],seg(p,.05,.25),{color:PC,w:5});
  s+=card(830,150,350,170,mrow(['@',`=${Pt}\\Delta ${Vt}`],1005,215,{size:44})+label('線の 下の 面積',1005,285,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),WC);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=lawCard(1,70);
  s+=card(150,250,900,170,label('熱も 含めた エネルギーの 保存',600,310,{size:32,color:C.hi,anchor:'middle',weight:700})+label('正：入る 熱 Q・された 仕事 W',600,375,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.15,.35),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(200,170,800,150,label('なぜ そう なるかは、深く 学ぶ 版で',600,260,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
