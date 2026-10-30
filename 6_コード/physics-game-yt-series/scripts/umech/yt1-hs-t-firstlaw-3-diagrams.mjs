// 高校編「熱力学第一法則・深く学ぶ 3/3」(ys-hs-t-firstlaw-3) — 図。Stage 1200×515.
// 色：Q₁・Q₂（熱）橙、W 濃い橙、U 薄い橙、P 緑、V 水色、高温側 赤み、低温側 青（温度の慣習色。量の色ではない）、強調 黄。
// エネルギーの流れ図は帯の太さを数値と同じ比にする（1000 : 300 : 700）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,clamp,mix} from './anim.mjs';
import {card,tag,T2,FA,TC,QC,Tt,sceneT,thermo,PC,VC,Pt,Vt,syringe,step,MOL,molBox,UC,WC,Ut,Qt,Wt,dU,LAW,JJ,Wo,mrow,Q2,flame,QA,WA,bar} from './yt1-hs-t-firstlaw-1-diagrams.mjs';

const K='hs-t-firstlaw-3:';
const HOTC='#ff9a7a', COLDC='#7fb6ff';
export const Q1=`{\\color{${QC}}Q_1}`, Q2t=`{\\color{${QC}}Q_2}`;
const SY=(o={})=>syringe({yc:230,h:170,...o});
// ---- hot / engine / cold flow diagram; widths ∝ energy ------------------------------------------
// gIn, gW, gC: appearance of the three bands; nums: show numbers
export function flowDiagram({gIn=1,gW=1,gC=1,nums=1,sym=0,g=1,x=420}={}){
 const k=.15,wIn=1000*k,wW=300*k,wC=700*k;
 let s=rect(x-170,30,340,70,{fill:HOTC,fo:.25,stroke:HOTC,sw:2,rx:10})+label('高温側',x,76,{size:28,color:HOTC,anchor:'middle',weight:700});
 s+=rect(x-170,420,340,70,{fill:COLDC,fo:.25,stroke:COLDC,sw:2,rx:10})+label('低温側',x,466,{size:28,color:COLDC,anchor:'middle',weight:700});
 s+=`<circle cx="${x}" cy="260" r="80" fill="#7d8aa3" fill-opacity=".25" stroke="${C.dim}" stroke-width="3"/>`+label('熱機関',x,270,{size:28,color:C.ink,anchor:'middle',weight:700});
 // input band (top) from hot box to engine
 s+=fade(gIn,rect(x-wIn/2,100,wIn,95,{fill:QC,fo:.55,stroke:'none',rx:0}));
 if(nums)s+=fade(gIn,label('1000 J',x+wIn/2+16,160,{size:28,color:QC,weight:700}));
 if(sym)s+=fade(gIn,T2(Q1,x-wIn/2-50,160,{size:40}));
 // work band to the right
 s+=fade(gW,`<path d="M${x+40} ${260-wW/2} L${x+330} ${260-wW/2} L${x+330} ${260-wW/2-14} L${x+380} 260 L${x+330} ${260+wW/2+14} L${x+330} ${260+wW/2} L${x+40} ${260+wW/2} Z" fill="${WC}" fill-opacity=".7"/>`);
 if(nums)s+=fade(gW,label('仕事 300 J',x+220,260-wW/2-16,{size:28,color:WC,anchor:'middle',weight:700}));
 if(sym)s+=fade(gW,mrow(['@'],x+460,272,{size:40,anchor:'start'}));
 // exhaust band down
 s+=fade(gC,rect(x-wC/2+0,325,wC,95,{fill:QC,fo:.4,stroke:'none',rx:0}));
 if(nums)s+=fade(gC,label('捨てる 700 J',x+wC/2+16,385,{size:28,color:QC,weight:700}));
 if(sym)s+=fade(gC,T2(Q2t,x-wC/2-50,385,{size:40}));
 return fade(g,s);
}
// ---- rectangular cycle on P–V axes (qualitative) -------------------------------------------------
const CY={x:150,y:440,w:560,h:330};
const cxp=u=>CY.x+CY.w*u, cyp=u=>CY.y-CY.h*u;
const VL=.25,VR=.75,PH=.75,PL=.35;
function cyAxes(){
 let s=arrow(CY.x-10,CY.y,CY.x+CY.w+30,CY.y,{color:C.dim,w:2.5,head:14})+arrow(CY.x,CY.y+10,CY.x,CY.y-CY.h-30,{color:C.dim,w:2.5,head:14});
 s+=label('体積 V',CY.x+CY.w+40,CY.y+8,{size:24,color:VC,weight:700})+label('圧力 P',CY.x,CY.y-CY.h-44,{size:24,color:PC,anchor:'middle',weight:700});
 return s;
}
function cycle({top=1,right=1,bottom=1,left=1,aTop=0,aBot=0,aIn=0,arrows=1}={}){
 let s=cyAxes();
 if(aTop)s+=fade(aTop,rect(cxp(VL),cyp(PH),cxp(VR)-cxp(VL),cyp(0)-cyp(PH),{fill:WC,fo:.25,stroke:'none',rx:0}));
 if(aBot)s+=fade(aBot,`<rect x="${cxp(VL)}" y="${cyp(PL)}" width="${cxp(VR)-cxp(VL)}" height="${cyp(0)-cyp(PL)}" fill="${C.v}" fill-opacity=".35" stroke="none"/>`);
 if(aIn)s+=fade(aIn,rect(cxp(VL),cyp(PH),cxp(VR)-cxp(VL),cyp(PL)-cyp(PH),{fill:C.hi,fo:.35,stroke:C.hi,sw:3,rx:0}));
 s+=draw([[cxp(VL),cyp(PH)],[cxp(VR),cyp(PH)]],top,{color:HOTC,w:5});
 s+=draw([[cxp(VR),cyp(PH)],[cxp(VR),cyp(PL)]],right,{color:C.dim,w:4});
 s+=draw([[cxp(VR),cyp(PL)],[cxp(VL),cyp(PL)]],bottom,{color:COLDC,w:5});
 s+=draw([[cxp(VL),cyp(PL)],[cxp(VL),cyp(PH)]],left,{color:C.dim,w:4});
 if(arrows){
  const m=(cxp(VL)+cxp(VR))/2;
  if(top>.5)s+=arrow(m-20,cyp(PH),m+20,cyp(PH),{color:HOTC,w:5,head:18});
  if(bottom>.5)s+=arrow(m+20,cyp(PL),m-20,cyp(PL),{color:COLDC,w:5,head:18});
 }
 return s;
}
// ---- traveling transverse wave of dots (preview of 波) ----------------------------------------------
function waveRow(t,{g=1,y=260,amp=60,n=22}={}){
 let s='';
 for(let i=0;i<n;i++){const x=120+i*44,yy=y-amp*Math.sin(2*Math.PI*(t*.6-i/11));s+=line(x,y,x,yy,{color:C.faint,w:2})+dot(x,yy,10,i===8?C.hi:MOL);}
 return fade(g,line(100,y,1080,y,{color:C.faint,w:1.5,dash:'6 6'})+s);
}

export const hsTFirstlaw3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=rect(450,150,300,200,{fill:'#7d8aa3',fo:.25,stroke:C.dim,sw:3,rx:12})+label('エンジン',600,260,{size:34,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),QA(250,250,440,250)+label('受け取った 熱',300,215,{size:28,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),WA(760,250,950,250)+label('仕事',900,215,{size:30,color:WC,anchor:'middle',weight:700}));
  s+=card(250,390,700,100,label('全部 仕事に できる？',600,452,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'guess']:(p)=>Q2('技術が 進めば','100％ に できる？',{g:seg(p,.05,.25)}),
 // ================= S2 熱機関と1サイクル =================
 [K+'car']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(500,760,seg(p,.3,.8));
  let s=SY({xp,dist:300*t});
  s+=fade(seg(p,.05,.25),flame(380,440,{s:1.1})+QA(380,400,380,330)+label('燃料を 燃やした 熱',380,480,{size:26,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),arrow(xp+40,350,xp+150,350,{color:WC,w:7,head:18})+label('仕事',xp+95,400,{size:30,color:WC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'once']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(760,880,seg(p,.1,.4));
  let s=SY({xp,dist:300*t,x1:900});
  s+=rect(905,130,16,200,{fill:C.a,fo:.8,stroke:'none',rx:3});
  s+=fade(seg(p,.5,.7),label('端で 止まる',913,100,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'back']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(880,560,seg(p,.2,.8));
  let s=SY({xp,dist:300*t,x1:900,push:seg(p,.1,.3)});
  s+=fade(seg(p,.5,.7),label('元の 状態へ 戻す',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'def']:(p)=>{
  let s=card(130,60,940,190,label('熱機関',600,125,{size:40,color:C.hi,anchor:'middle',weight:700})+label('熱を 受け取って 仕事を し、元の 状態に 戻る',600,200,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.25,.45),label('→ 繰り返す',600,310,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('定義',600,410,{g:seg(p,.6,.75)});
  return s;
 },
 [K+'du0']:(p)=>{
  // a loop arrow returning to start
  let s=`<path d="M380 270 A140 110 0 1 1 381 271" fill="none" stroke="${C.dim}" stroke-width="5" stroke-dasharray="${880*seg(p,.05,.5)} 900"/>`;
  s+=dot(380,270,14,C.hi)+label('元の 状態',380,325,{size:26,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.45,.6),label('1 サイクル',540,470,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=card(760,140,360,220,label('温度も 元に 戻る',940,200,{size:30,color:TC,anchor:'middle',weight:700})+T2(`${dU}=0`,940,295,{size:58}),seg(p,.5,.7),UC);
  return s;
 },
 // ================= S3 P–V グラフで1周 =================
 [K+'cyc']:(p)=>{
  let s=cycle({top:seg(p,.3,.7),right:0,bottom:0,left:0});
  s+=fade(seg(p,.4,.6),label('行き：温めながら 膨張',cxp(.5),cyp(PH)-24,{size:26,color:HOTC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cyc2']:(p)=>{
  let s=cycle({top:1,right:0,bottom:0,left:0,aTop:seg(p,.1,.4)});
  s+=label('行き：温めながら 膨張',cxp(.5),cyp(PH)-24,{size:26,color:HOTC,anchor:'middle',weight:700});
  s+=card(780,150,380,160,label('外へ する 仕事',970,215,{size:30,color:WC,anchor:'middle',weight:700})+label('＝ 上側の 下の 面積',970,270,{size:28,color:C.ink,anchor:'middle'}),seg(p,.4,.6),WC);
  return s;
 },
 [K+'cyc3']:(p)=>{
  let s=cycle({top:1,right:seg(p,.0,.15),bottom:seg(p,.15,.4),left:0,aBot:seg(p,.5,.7)});
  s+=fade(seg(p,.2,.4),label('帰り：冷やしながら 圧縮',cxp(.46),cyp(PL)-18,{size:26,color:COLDC,anchor:'middle',weight:700}));
  s+=card(780,150,380,160,label('される 仕事',970,215,{size:30,color:C.v,anchor:'middle',weight:700})+label('＝ 下側の 下の 面積',970,270,{size:28,color:C.ink,anchor:'middle'}),seg(p,.55,.75),C.v);
  return s;
 },
 [K+'cyc4']:(p)=>{
  let s=cycle({aTop:1-seg(p,.2,.5),aBot:1-seg(p,.2,.5),aIn:seg(p,.3,.6),left:1});
  s+=card(780,150,380,180,label('差し引き 外へ した 仕事',970,215,{size:28,color:C.hi,anchor:'middle',weight:700})+label('＝ 囲まれた 面積',970,280,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'cyc4b']:(p)=>{
  let s=cycle({aIn:1});
  s+=card(760,140,420,200,label('囲まれた 面積',970,200,{size:30,color:C.hi,anchor:'middle',weight:700})+mrow(['@',`=${Q1}-${Q2t}`],970,280,{size:44}),seg(p,.1,.3),C.hi);
  s+=fade(seg(p,.5,.7),label('（この あと 導く）',970,390,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'cyc5']:(p)=>{
  let s=cycle({aIn:1});
  s+=fade(seg(p,.1,.3),QA(cxp(.5),cyp(PL)+10,cxp(.5),cyp(PL)+80)+label('冷やして 熱を 外へ',cxp(.5)+20,cyp(PL)+60,{size:26,color:COLDC,weight:700}));
  s+=card(780,150,380,180,label('帰りは 低い 圧力で',970,215,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 熱を 捨てる',970,280,{size:32,color:QC,anchor:'middle',weight:700}),seg(p,.4,.6),QC);
  return s;
 },
 // ================= S4 1サイクルの収支 =================
 [K+'q12']:(p)=>{
  let s=flowDiagram({gIn:seg(p,.05,.3),gW:0,gC:seg(p,.4,.65),nums:0,sym:1});
  s+=fade(seg(p,.1,.3),label('受け取る 熱',190,160,{size:26,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.65),label('捨てる 熱',200,385,{size:26,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('どちらも 正の 量',950,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'exhaust']:(p)=>{
  let s=fade(.5,flowDiagram({gW:0,nums:0,sym:1}));
  s+=card(720,170,440,170,label('自動車なら',940,225,{size:28,color:C.ink,anchor:'middle'})+label('排気ガス・ラジエーター',940,290,{size:30,color:COLDC,anchor:'middle',weight:700}),seg(p,.1,.3),COLDC);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=fade(.5,flowDiagram({gW:0,nums:0,sym:1}));
  s+=card(700,170,460,150,T2(`${Qt}=${Q1}-${Q2t}`,930,250,{size:52}),seg(p,.1,.3),QC);
  s+=fade(seg(p,.5,.7),label('気体に 入った 熱（差し引き）',930,370,{size:26,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(250,60,700,120,T2(LAW,600,125,{size:52}),1,C.dim);
  s+=fade(seg(p,.1,.3),label('ΔU ＝ 0 を 入れる',600,240,{size:30,color:UC,anchor:'middle',weight:700}));
  s+=card(200,290,800,140,T2(`0=(${Q1}-${Q2t})+${Wt}`,600,365,{size:58}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'solve']:(p)=>step(p,`0=(${Q1}-${Q2t})+${Wt}`,`${Wt}=-(${Q1}-${Q2t})`,'両辺 − (Q₁ − Q₂)',{size:56}),
 [K+'wout']:(p)=>{
  let s=fade(.6,T2(`${Wt}=-(${Q1}-${Q2t})`,600,80,{size:40}));
  s+=fade(seg(p,.05,.25),label('された 仕事が 負 → 外へ 仕事',600,160,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=card(250,210,700,150,mrow(['@',`=${Q1}-${Q2t}`],600,290,{size:64}),seg(p,.45,.65),WC);
  return s;
 },
 [K+'wout2']:(p)=>{
  let s=flowDiagram({nums:0,sym:1,gW:seg(p,.05,.3)});
  s+=card(780,330,380,140,label('受け取った 熱',970,385,{size:26,color:QC,anchor:'middle',weight:700})+label('− 捨てた 熱 ＝ 残り',970,435,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 // ================= S5 数値と熱効率 =================
 [K+'ex']:(p)=>{
  let s=card(150,100,420,150,T2(`${Q1}=1000${JJ}`,360,175,{size:48}),seg(p,.05,.25),QC);
  s+=fade(seg(p,.05,.25),label('受け取る',360,300,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(630,100,420,150,T2(`${Q2t}=700${JJ}`,840,175,{size:48}),seg(p,.45,.65),QC);
  s+=fade(seg(p,.45,.65),label('捨てる',840,300,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=fade(.6,mrow(['@',`=${Q1}-${Q2t}`],600,80,{size:40}));
  s+=card(200,170,800,150,mrow(['@','=1000-700=300\\ \\mathrm{J}'],600,250,{size:58}),seg(p,.05,.25),WC);
  return s;
 },
 [K+'ex3']:(p)=>{
  let s=card(100,120,1000,150,T2(`${dU}=(1000-700)+(-300)=0`,600,195,{size:52}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.55,.7),label('1 サイクルで 元に 戻る',600,350,{size:32,color:UC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'flow']:(p)=>flowDiagram({gIn:seg(p,.05,.25),gW:seg(p,.35,.55),gC:seg(p,.55,.75)}),
 [K+'eff']:(p)=>{
  let s=fade(.35,flowDiagram({x:300}));
  s+=card(720,120,450,200,label('熱効率',945,175,{size:32,color:C.hi,anchor:'middle',weight:700})+mrow(['e=','@','\\div',Q1],945,260,{size:50}),seg(p,.3,.5),C.hi);
  s+=fade(seg(p,.1,.3),label('仕事に なった 割合',945,370,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('定義',945,440,{g:seg(p,.6,.75)});
  return s;
 },
 [K+'eff2']:(p)=>{
  let s=fade(.35,flowDiagram({x:300}));
  s+=card(720,120,450,200,T2('e=\\dfrac{300}{1000}=0.30',945,220,{size:50}),seg(p,.1,.3),C.hi);
  s+=fade(seg(p,.55,.7),label('30 ％',945,390,{size:46,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'eff2b']:(p)=>{
  let s=flowDiagram({x:300,gW:.35,gIn:.35});
  s+=card(720,150,450,190,label('残り 70 ％',945,215,{size:36,color:QC,anchor:'middle',weight:700})+label('700 J → 低温側へ',945,285,{size:30,color:'#7fb6ff',anchor:'middle',weight:700}),seg(p,.1,.3),QC);
  return s;
 },
 [K+'eff3']:(p)=>{
  let s=fade(.6,mrow(['e=','@','\\div',Q1],600,70,{size:38}));
  s+=card(100,120,1000,150,T2(`e=\\dfrac{${Q1}-${Q2t}}{${Q1}}=\\dfrac{${Q1}}{${Q1}}-\\dfrac{${Q2t}}{${Q1}}`,600,195,{size:46}),seg(p,.05,.25),C.dim);
  s+=card(300,295,600,180,T2(`e=1-\\dfrac{${Q2t}}{${Q1}}`,600,385,{size:54}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'chk']:(p)=>{
  let s=fade(.6,T2(`e=1-\\dfrac{${Q2t}}{${Q1}}`,600,80,{size:40}));
  s+=card(200,170,800,150,T2(`${Q1}=1000${JJ},\\quad ${Q2t}=500${JJ}`,600,230,{size:44})+T2('e=\\ ?',600,290,{size:44}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'chk2']:(p)=>{
  let s=card(200,90,800,150,T2('e=1-\\dfrac{500}{1000}=0.50',600,165,{size:52}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('捨てる 熱が 小さい ほど 1 に 近づく',600,330,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 なぜ 1 にならないのか =================
 [K+'zero']:(p)=>{
  let s=flowDiagram({x:300,gC:1-seg(p,.05,.35),nums:0,sym:0,gW:1});
  s+=card(720,140,450,200,T2(`${Q2t}=0\\ \\ ?`,945,205,{size:50})+T2('e=1\\ (100\\%)',945,285,{size:46}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'first']:(p)=>{
  let s=card(150,80,900,140,mrow(['@',`=${Q1}-0=${Q1}`],600,150,{size:54}),seg(p,.05,.25),WC);
  s+=card(250,280,700,110,label('第一法則（エネルギー）は 合う',600,345,{size:34,color:C.F,anchor:'middle',weight:700}),seg(p,.45,.65),C.F);
  return s;
 },
 [K+'second']:(p)=>{
  let s=fade(.6,flowDiagram({x:300,gC:0,nums:0}));
  s+=fade(seg(p,.2,.4),line(160,40,440,480,{color:C.a,w:8})+line(440,40,160,480,{color:C.a,w:8}));
  s+=card(720,150,450,190,label('捨てる 熱 なしで',945,215,{size:32,color:C.ink,anchor:'middle',weight:700})+label('繰り返す 機関は 作れない',945,280,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.4,.6),C.a);
  return s;
 },
 [K+'second2']:(p)=>{
  let s=card(200,90,800,140,label('熱力学第二法則',600,175,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=tag('法則（多くの 実験に 支えられた）',600,290,{g:seg(p,.3,.5),size:28});
  s+=fade(seg(p,.6,.75),label('第一法則からは 導けない',600,390,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'real']:(p)=>{
  let s=card(200,70,800,120,T2('e<1',600,140,{size:64}),seg(p,.05,.2),C.hi);
  const x0=250,w=700,y=300;
  s+=fade(seg(p,.4,.55),rect(x0,y,w,60,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:8})+rect(x0,y,w*.35*seg(p,.45,.75),60,{fill:WC,fo:.6,stroke:'none',rx:8}));
  s+=fade(seg(p,.6,.75),label('自動車の エンジン：3〜4割',600,420,{size:32,color:WC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'real2']:(p)=>{
  const x0=250,w=700,y=300;
  let s=card(200,70,800,120,T2('e<1',600,140,{size:64}),1,C.hi);
  s+=rect(x0,y,w,60,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:8})+rect(x0,y,w*.35,60,{fill:WC,fo:.6,stroke:'none',rx:8});
  s+=fade(seg(p,.1,.35),rect(x0+w*.35,y,w*.65,60,{fill:'#7fb6ff',fo:.35,stroke:'none',rx:8}));
  s+=fade(seg(p,.3,.5),label('排気ガス・冷却水の 熱 として 捨てる',600,430,{size:30,color:'#7fb6ff',anchor:'middle',weight:700}));
  return s;
 },
 [K+'myth']:(p)=>{
  let s=card(180,100,840,130,label('技術が 進めば 100％ に できる？',600,180,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.3,.45),line(250,170,950,170,{color:C.a,w:5}));
  s+=card(250,300,700,110,label('第二法則が ある → できない',600,368,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'myth2']:(p)=>{
  let s=flowDiagram({x:300});
  s+=card(720,160,450,190,label('700 J は 無くならない',945,225,{size:32,color:C.ink,anchor:'middle',weight:700})+label('使いにくい 形で 低温側へ',945,290,{size:30,color:COLDC,anchor:'middle',weight:700}),seg(p,.2,.4),COLDC);
  return s;
 },
 // ================= S7 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=fade(.5,flowDiagram({x:300}));
  s+=card(720,140,450,220,label('全部は 仕事に できない',945,215,{size:34,color:C.hi,anchor:'middle',weight:700})+label('一部を 低温側へ 捨てる',945,290,{size:30,color:COLDC,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'univ']:(p)=>card(150,150,900,190,label('大学編では',600,215,{size:30,color:C.dim,anchor:'middle'})+label('面積 → 積分　第二法則 → エントロピー',600,285,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.dim),
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:300,y:80,w:600,h:330,n:24,dist:260*t,seed:21,color:MOL});
  s+=fade(seg(p,.3,.5),label('ばらばらな 向き',600,460,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=waveRow(t,{y:220});
  s+=card(200,370,800,110,label('進んで いくのは 何？',600,437,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(250,170,700,150,label('次の 分野：波',600,260,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
