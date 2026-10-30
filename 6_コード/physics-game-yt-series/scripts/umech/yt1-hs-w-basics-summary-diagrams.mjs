// 高校編「波の基本・要点」(ys-hs-w-basics-summary) — 図。Stage 1200×515. 深1/2・2/2 の部品を使う。
import {C,seg,lin,fade,label,line,rect,dot,arrow,tex,axes,clamp} from './anim.mjs';
import {card,tag,T2,sceneT,RP,rope,hand,mark,crestMark,trackedCrest,LC,TCOL,FC,VCOL,ROPE,MK,Lt,Tt,ft,MS,MM,SS} from './yt1-hs-w-basics-1-diagrams.mjs';
import {ropeN,crestX,pclock,span,longi,belt,vt} from './yt1-hs-w-basics-2-diagrams.mjs';

const K='hs-w-basics-summary:';
const PI=Math.PI;
const VF=`${vt}=${ft}${Lt}`;

export const hsWBasicsSummaryDiagrams={
 [K+'c1']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:330},t0=t-(ctx?ctx.t:p*8);
  let s=rope({t,o})+hand(t,o)+mark(590,t,o,false,{track:1})+crestMark(trackedCrest(t,t0,o,{from:30}),o);
  s+=card(150,30,900,120,label('進むのは 振動の 模様 と エネルギー',600,104,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'c2']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:330},t0=t-(ctx?ctx.t:p*8);
  let s=rope({t,o})+hand(t,o)+mark(590,t,o,false,{track:1})+crestMark(trackedCrest(t,t0,o,{from:30}),o);
  s+=card(150,410,420,90,label('印：上下',360,467,{size:32,color:MK,anchor:'middle',weight:700}),seg(p,.1,.25),MK);
  s+=card(630,410,420,90,label('山：右へ',840,467,{size:32,color:VCOL,anchor:'middle',weight:700}),seg(p,.5,.65),VCOL);
  return s;
 },
 [K+'c3']:(p)=>{
  let s=card(300,70,600,170,T2(VF,600,175,{size:72}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.5,.65),label('f：振動数',450,340,{size:32,color:FC,anchor:'middle',weight:700})+label('λ：波長',750,340,{size:32,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'d1']:(p)=>{
  const o={...RP,y:300,A:80,x1:960};let s=rope({t:.75*o.T,o});
  const xc=o.x0+o.lam*.5;
  s+=arrow(xc,o.y,xc,o.y-o.A,{color:C.ink,w:4,head:14,g:seg(p,.05,.2)})+arrow(xc,o.y-o.A,xc,o.y,{color:C.ink,w:4,head:14,g:seg(p,.05,.2)});
  s+=fade(seg(p,.1,.25),label('振幅 A',xc,o.y-o.A-24,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=span(xc+o.lam,xc+2*o.lam,o.y-o.A-30,'',LC,seg(p,.5,.65))+fade(seg(p,.55,.7),label('波長 λ',xc+1.5*o.lam,o.y-o.A-50,{size:30,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('写真（時刻を 止める）',600,480,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'d1b']:(p)=>{
  const o={...RP,y:300,A:80,x1:960};let s=rope({t:.75*o.T,o});
  const xc=o.x0+o.lam*.5,xt=xc+o.lam/2;
  s+=arrow(xc,o.y,xc,o.y-o.A,{color:C.ink,w:4,head:14})+arrow(xc,o.y-o.A,xc,o.y,{color:C.ink,w:4,head:14})+label('A',xc,o.y-o.A-24,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),line(xc+20,o.y-o.A,1040,o.y-o.A,{color:C.a,w:2,dash:'5 6'})+line(xt+20,o.y+o.A,1040,o.y+o.A,{color:C.a,w:2,dash:'5 6'}));
  s+=arrow(1020,o.y-o.A,1020,o.y+o.A,{color:C.a,w:4,head:14,g:seg(p,.1,.3)})+arrow(1020,o.y+o.A,1020,o.y-o.A,{color:C.a,w:4,head:14,g:seg(p,.1,.3)});
  s+=fade(seg(p,.25,.4),label('2A',1040,o.y+10,{size:30,color:C.a,weight:700}));
  s+=card(760,40,380,100,label('振幅 ＝ その 半分',950,102,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.55,.7),C.ink);
  return s;
 },
 [K+'d2']:(p)=>{
  const A=axes({x:150,y:440,w:850,h:300,xmin:0,xmax:2.6,ymin:-1.3,ymax:1.3,g:1});
  const f=u=>Math.cos(2*PI*(u-.4));
  let s=A.svg+label('時刻 t',1050,A.Y(0)+40,{size:26,color:TCOL,anchor:'end',weight:700})+label('1か所の ずれ',150,A.Y(1.3)-40,{size:24,color:C.ink,anchor:'middle'});
  s+=A.plot(f,{from:0,to:2.5,p:lin(p,.05,.5),color:MK,w:4});
  const y=A.Y(1.3)+6;
  s+=span(A.X(.4),A.X(1.4),y,'',TCOL,seg(p,.5,.65))+fade(seg(p,.55,.7),label('周期 T',A.X(.9),y-18,{size:30,color:TCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'d3']:(p)=>{
  let s=card(150,50,900,120,label('振動数 f：1秒 あたりの 回数（Hz）',600,125,{size:34,color:FC,anchor:'middle',weight:700}),seg(p,.05,.2),FC);
  s+=fade(seg(p,.35,.5),label('1回に T 秒 → 1秒に 1 ÷ T 回',600,250,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=card(435,310,330,130,T2(`${ft}=\\dfrac{1}{${Tt}}`,600,390,{size:50}),seg(p,.6,.75),FC);
  return s;
 },
 [K+'w1']:(p)=>{
  const u=seg(p,.1,.7),n=.25+u;
  let s=ropeN(n)+crestMark(crestX(n,.25),RP,{text:'山'})+pclock(1000,90,u,{text:u>.99?'T':''});
  if(u>.99)s+=crestMark(RP.x0,RP,{text:'次の 山',color:C.dim})+span(RP.x0,crestX(n,.25),RP.y+RP.A+50,'',LC,seg(p,.72,.85))+fade(seg(p,.75,.88),tex('\\lambda',(RP.x0+crestX(n,.25))/2,RP.y+RP.A+95,{size:40,color:LC}));
  return s;
 },
 [K+'w2']:(p)=>{
  let s=card(150,60,900,150,T2(`${vt}=\\dfrac{${Lt}}{${Tt}}`,600,145,{size:56}),seg(p,.05,.2),VCOL);
  s+=card(300,280,600,150,T2(VF,600,365,{size:64}),seg(p,.55,.7),C.hi);
  s+=fade(seg(p,.45,.6),label('1/T ＝ f',990,365,{size:28,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'w3']:(p)=>{
  let s=belt(lin(p,.05,.6));
  s+=fade(seg(p,.62,.75),span(110,1010,80,'1秒に fλ',VCOL,1,30,-16));
  return s;
 },
 [K+'n1']:(p)=>{
  let s=card(160,40,880,110,label('f ＝ 5.0 Hz、λ ＝ 2.0 m',600,112,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(160,200,880,140,T2(`${vt}=5.0\\times 2.0=10${MS}`,600,280,{size:52}),seg(p,.45,.6),VCOL);
  return s;
 },
 [K+'n2']:(p)=>{
  let s=card(160,40,880,110,label('f ＝ 5.0 Hz、λ ＝ 2.0 m',600,112,{size:36,color:C.ink,anchor:'middle',weight:700}),1,C.dim);
  s+=card(160,190,880,120,T2(`${Tt}=\\dfrac{1}{5.0}=0.20${SS}`,600,260,{size:44}),seg(p,.05,.2),TCOL);
  s+=card(160,345,880,130,T2(`\\dfrac{${Lt}}{${Tt}}=\\dfrac{2.0}{0.20}=10${MS}`,600,420,{size:44}),seg(p,.45,.6),VCOL);
  return s;
 },
 [K+'n3']:(p)=>{
  let s=card(160,60,880,110,label('T ＝ 0.10 s',600,132,{size:38,color:TCOL,anchor:'middle',weight:700}),seg(p,.05,.2),TCOL);
  s+=card(160,230,880,140,T2(`${ft}=\\dfrac{1}{0.10}=10\\ \\mathrm{Hz}`,600,310,{size:50}),seg(p,.4,.55),FC);
  return s;
 },
 [K+'m1']:(p)=>{
  let s=card(140,150,920,140,label('× 振動数を 上げると 速くなる',600,235,{size:38,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'m2']:(p,ctx)=>{
  const t=(ctx?ctx.t:p*8)-.3,o1={...RP,y:200,A:40},o2={...RP,y:380,A:40,lam:160,T:.8};
  let s=rope({t,o:o1,front:true})+hand(t,o1,true)+rope({t,o:o2,front:true})+hand(t,o2,true);
  s+=fade(seg(p,0,.1),label('f ＝ 5.0 Hz',1090,o1.y-70,{size:26,color:FC,anchor:'end',weight:700})+label('f ＝ 10 Hz',1090,o2.y-70,{size:26,color:FC,anchor:'end',weight:700}));
  const fx=o1.x0+Math.max(0,o1.lam/o1.T*t);
  if(fx<o1.x1)s+=line(fx,90,fx,470,{color:VCOL,w:2,dash:'6 6'})+label('先頭',fx,80,{size:24,color:VCOL,anchor:'middle',weight:700});
  s+=fade(seg(p,.55,.7),label('同じ 速さ 10 m/s',600,505,{size:26,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'m3']:(p,ctx)=>{
  const o1={...RP,y:200,A:40},o2={...RP,y:380,A:40,lam:160,T:.8},t=20;
  let s=fade(.6,rope({t,o:o1})+rope({t,o:o2}));
  s+=span(o1.x0+o1.lam*.25+o1.lam,o1.x0+o1.lam*1.25+o1.lam,o1.y+o1.A+28,'2.0 m',LC,seg(p,.3,.45),26,34);
  s+=span(o2.x0+o2.lam*.25+o2.lam*2,o2.x0+o2.lam*1.25+o2.lam*2,o2.y+o2.A+28,'1.0 m',LC,seg(p,.3,.45),26,34);
  s+=card(250,40,700,100,T2(`${Lt}=\\dfrac{10}{10}=1.0${MM}`,600,92,{size:40}),seg(p,.05,.2),LC);
  return s;
 },
 [K+'e1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=longi(t,{hl:-1,dense:1});
  s+=card(300,60,600,120,label('縦波：密から 次の 密 ＝ λ',600,135,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  s+=fade(seg(p,.6,.75),label('音 ＝ 空気の 縦波',600,235,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e2']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:380,A:45};
  let s=rope({t,o})+hand(t,o);
  s+=card(200,40,800,210,label('進むのは 振動の 模様',600,105,{size:34,color:C.ink,anchor:'middle',weight:700})+T2(VF,600,195,{size:60}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'e3']:(p)=>{
  let s=card(200,130,800,200,label('なぜ そうなるかは',600,205,{size:30,color:C.dim,anchor:'middle'})+label('深く 学ぶ 版で',600,280,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
};
