// 高校編「熱力学第一法則・深く学ぶ 2/3」(ys-hs-t-firstlaw-2) — 図。Stage 1200×515.
// 色：P 緑、V 水色、T 黄緑、U 薄い橙、Q 橙、W 濃い橙、強調 黄（1/3 と同じ）。P–V グラフの体積軸は 20〜30 L（0 から省略の印あり）、圧力軸は 0 から。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,clamp,mix} from './anim.mjs';
import {card,tag,T2,FA,TC,QC,Tt,sceneT,thermo,PC,VC,Pt,Vt,gasBox,syringe,step,MOL,molBox,UC,WC,Ut,Qt,Wt,dU,DT,LAW,JJ,Wo,mrow,Q2,flame,QA,WA,wallBounce,bar} from './yt1-hs-t-firstlaw-1-diagrams.mjs';
import {cyl} from './yt1-hs-t-gas-2-diagrams.mjs';
export {cyl};

const K='hs-t-firstlaw-2:';
const E5='1.0\\times10^{5}', PA='\\ \\mathrm{Pa}', LL='\\ \\mathrm{L}', M3='\\ \\mathrm{m^3}', NN='\\ \\mathrm{N}';
const dV=`\\Delta ${Vt}`, PdV=`${Pt}\\Delta ${Vt}`;
// ---- horizontal cylinder (sealed left end) with piston at xp; gas from x0 to xp -----------------
const SY=(o={})=>syringe({yc:230,h:170,...o});
// ---- P–V graph ---------------------------------------------------------------------------------
export const PG={x:170,y:430,w:620,h:300,v0:20,v1:30,pmax:1.5};
export const gX=v=>PG.x+PG.w*(v-PG.v0)/(PG.v1-PG.v0), gY=q=>PG.y-PG.h*q/PG.pmax;
export function pvAxes({g=1,ticks=[20,25,27,30]}={}){
 let s=arrow(PG.x-10,PG.y,PG.x+PG.w+30,PG.y,{color:C.dim,w:2.5,head:14})+arrow(PG.x,PG.y+10,PG.x,PG.y-PG.h-30,{color:C.dim,w:2.5,head:14});
 s+=`<path d="M${PG.x+14} ${PG.y-10} l8 20 M${PG.x+24} ${PG.y-10} l8 20" stroke="${C.dim}" stroke-width="2.5"/>`;
 for(const v of ticks)if(v!==20)s+=line(gX(v),PG.y-6,gX(v),PG.y+6,{color:C.dim})+label(String(v),gX(v),PG.y+32,{size:22,color:C.dim,anchor:'middle'});
 for(const q of [.5,1,1.5])s+=line(PG.x-6,gY(q),PG.x+6,gY(q),{color:C.dim})+label(q.toFixed(1),PG.x-14,gY(q)+8,{size:22,color:C.dim,anchor:'end'});
 s+=label('体積 V [L]',PG.x+PG.w+40,PG.y+8,{size:24,color:VC,weight:700});
 s+=label('圧力 P [×10⁵ Pa]',PG.x+40,PG.y-PG.h-44,{size:24,color:PC,anchor:'middle',weight:700});
 return fade(g,s);
}
const pRect=(v1,v2,q,{g=1,color=WC}={})=>fade(g,rect(gX(v1),gY(q),gX(v2)-gX(v1),gY(0)-gY(q),{fill:color,fo:.3,stroke:color,sw:2.5,rx:0}));
// curve for the "pressure changes" demo: P = 25/V (×10⁵ Pa, V in L) from 21 to 29
const cP=v=>25/v;
// ---- a simple pump and a mountain ---------------------------------------------------------------
function pump(x,gy,d,{g=1}={}){
 let s=rect(x-40,gy-230,80,230,{fill:'#0f1a30',fo:.9,stroke:C.dim,sw:3,rx:6});
 const py=gy-200+d;
 s+=rect(x-36,py,72,14,{fill:'#7d8aa3',fo:1,stroke:'none',rx:3})+rect(x-6,py-120,12,120,{fill:'#7d8aa3',fo:1,stroke:'none'})+rect(x-60,py-134,120,18,{fill:'#7d8aa3',fo:1,stroke:'#c9d2e3',sw:2,rx:6});
 s+=rect(x-36,py+14,72,gy-py-18,{fill:HOTF,fo:.25*d/120,stroke:'none'});
 s+=line(x+40,gy-20,x+100,gy-20,{color:C.dim,w:5});
 return fade(g,s);
}
const HOTF='#ff9a7a';
function mountain({g=1,t=0,down=1,up=0}={}){
 let s=`<path d="M560 450 L840 160 L1120 450 Z" fill="#2a3a52" stroke="${C.dim}" stroke-width="2"/>`;
 if(up){s+=fade(up,arrow(600,430,780,200,{color:'#7fb6ff',w:6,head:18})+label('上がる → 冷える',600,300,{size:26,color:'#7fb6ff',anchor:'end',weight:700}));
  s+=fade(seg(up,.5,1),`<ellipse cx="800" cy="170" rx="90" ry="38" fill="#dfe8f5" fill-opacity=".85"/>`+`<ellipse cx="740" cy="185" rx="60" ry="30" fill="#dfe8f5" fill-opacity=".85"/>`+label('雲',800,180,{size:28,color:C.bg,anchor:'middle',weight:700}));}
 if(down)s+=fade(down,arrow(900,200,1080,430,{color:HOTF,w:6,head:18})+label('下りる → 暖まる',1000,260,{size:26,color:HOTF,weight:700}));
 return fade(g,s);
}

export const hsTFirstlaw2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(700,800,seg(p,.2,.7));
  let s=SY({xp,dist:220*t});
  s+=fade(seg(p,.2,.4),arrow(xp+40,350,xp+150,350,{color:PC,w:6,head:18}));
  s+=card(200,390,800,100,label('気体が される 仕事は いくら？',600,452,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.65),C.hi);
  return s;
 },
 [K+'q2']:(p)=>{
  let s=card(150,100,400,160,label('力 × 距離',350,195,{size:44,color:C.F,anchor:'middle',weight:700}),1,C.F);
  s+=fade(seg(p,.1,.3),arrow(580,180,690,180,{color:C.hi,w:6,head:18}));
  s+=card(710,100,400,160,label('気体の 言葉',910,165,{size:34,color:C.ink,anchor:'middle',weight:700})+label('圧力・体積 で？',910,225,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.4),C.hi);
  return s;
 },
 // ================= S2 力×距離から PΔV へ =================
 [K+'gas']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:120,y:90,w:420,h:320,n:18,dist:240*t,seed:3,color:MOL});
  s+=card(620,90,500,330,label('前の 単元の 気体',870,150,{size:28,color:C.dim,anchor:'middle'})+T2(`n=1.0\\ \\mathrm{mol}`,870,210,{size:40})+T2(`${Tt}=300\\ \\mathrm{K}`,870,265,{size:40})+T2(`${Vt}=25${LL}`,870,320,{size:40})+T2(`${Pt}\\approx ${E5}${PA}`,870,385,{size:40}),seg(p,.05,.25),C.dim);
  return s;
 },
 [K+'cyl']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=SY({xp:700,dist:220*t});
  s+=fade(seg(p,.1,.3),`<ellipse cx="711" cy="230" rx="22" ry="85" fill="${C.hi}" fill-opacity=".25" stroke="${C.hi}" stroke-width="3"/>`);
  s+=fade(seg(p,.15,.35),label('面積 A',711,110,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(260,370,680,110,T2(`A=0.010\\ \\mathrm{m^2}=100\\ \\mathrm{cm^2}`,600,425,{size:42}),seg(p,.3,.5),C.hi);
  s+=fade(seg(p,.6,.8),label('手のひら くらい',1050,440,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'force']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=SY({xp:700,dist:220*t,hit:1});
  s+=FA(735,330,880,330,{g:seg(p,.05,.3),text:'',w:9});
  s+=fade(seg(p,.2,.35),label('F ＝ P × A',820,380,{size:30,color:PC,anchor:'middle',weight:700}));
  s+=card(150,400,900,100,T2(`F=(${E5})\\times0.010=1000${NN}`,600,452,{size:42}),seg(p,.45,.65),C.F);
  return s;
 },
 [K+'fx']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(600,700,seg(p,.1,.5));
  let s=SY({xp,dist:220*t});
  s+=FA(xp+35,330,xp+160,330,{w:8,head:22});
  s+=fade(seg(p,.3,.5),line(600,370,700,370,{color:VC,w:3})+line(600,358,600,382,{color:VC,w:3})+line(700,358,700,382,{color:VC,w:3})+label('0.20 m',650,410,{size:28,color:VC,anchor:'middle',weight:700}));
  s+=card(150,30,900,90,T2(`1000${NN}\\times0.20\\ \\mathrm{m}=200${JJ}`,600,78,{size:40}),seg(p,.5,.7),WC);
  s+=fade(seg(p,.75,.9),label('外へ した 仕事',600,470,{size:30,color:WC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sym']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=SY({xp:700,dist:220*t});
  s+=fade(seg(p,.05,.2),line(600,370,700,370,{color:VC,w:3})+label('Δx',650,410,{size:30,color:VC,anchor:'middle',weight:700}));
  s+=card(120,30,960,90,T2(`F=${Pt}A,\\qquad F\\times\\Delta x=${Pt}A\\times\\Delta x`,600,78,{size:40}),seg(p,.3,.5),C.F);
  return s;
 },
 [K+'dv']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=SY({xp:700,dist:220*t});
  s+=fade(seg(p,.1,.35),rect(600,148,100,164,{fill:VC,fo:.35,stroke:VC,sw:3,rx:0}));
  s+=fade(seg(p,.05,.2),line(600,370,700,370,{color:VC,w:3})+label('Δx',650,410,{size:30,color:VC,anchor:'middle',weight:700}));
  s+=card(120,420,960,80,T2(`A\\times\\Delta x=${dV}`,600,462,{size:44}),seg(p,.45,.65),VC);
  s+=fade(seg(p,.55,.75),label('増えた 体積',920,100,{size:30,color:VC,anchor:'middle',weight:700})+arrow(880,110,710,170,{color:VC,w:4,head:14}));
  return s;
 },
 [K+'pdv']:(p)=>{
  let s=fade(.6,T2(`${Pt}A\\times\\Delta x`,600,80,{size:40}));
  s+=fade(seg(p,.05,.2),label('A × Δx ＝ ΔV',600,150,{size:30,color:VC,anchor:'middle',weight:700}));
  s+=card(250,190,700,150,mrow(['@',`=${PdV}`],600,268,{size:66}),seg(p,.2,.4),WC);
  s+=tag('導いた 結果（圧力 一定）',600,420,{g:seg(p,.6,.75),size:26});
  return s;
 },
 [K+'chk']:(p)=>{
  let s=card(120,120,960,150,T2(`${dV}=0.010\\times0.20=0.0020${M3}`,600,195,{size:48}),seg(p,.05,.25),VC);
  s+=card(400,320,400,110,T2(`=2.0${LL}`,600,375,{size:50}),seg(p,.55,.75),VC);
  return s;
 },
 [K+'chk2']:(p)=>{
  let s=card(80,90,1040,150,T2(`${PdV}=(${E5})\\times0.0020=200${JJ}`,600,165,{size:48}),seg(p,.05,.25),WC);
  s+=fade(seg(p,.5,.7),T2(`1000${NN}\\times0.20\\ \\mathrm{m}=200${JJ}`,600,320,{size:40}));
  s+=fade(seg(p,.6,.8),label('一致',600,410,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wneg']:(p)=>{
  let s=card(150,70,900,150,mrow([`${Wt}=-`,'@',`=-${PdV}=-200${JJ}`],600,145,{size:50}),seg(p,.05,.25),WC);
  s+=card(150,280,420,140,label('膨張（ΔV ＞ 0）',360,335,{size:30,color:VC,anchor:'middle',weight:700})+T2(`${Wt}<0`,360,390,{size:44}),seg(p,.45,.6),C.dim);
  s+=card(630,280,420,140,label('圧縮（ΔV ＜ 0）',840,335,{size:30,color:VC,anchor:'middle',weight:700})+T2(`${Wt}>0`,840,390,{size:44}),seg(p,.6,.75),C.dim);
  return s;
 },
 [K+'slow']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(640,700,seg(p,0,1));
  let s=SY({xp,dist:220*t});
  s+=FA(xp+35,330,xp+130,330,{w:7,head:20})+FA(xp+260,140,xp+30,140,{w:7,head:20,color:C.dim});
  s+=fade(seg(p,.2,.4),label('気体の 圧力',xp+80,370,{size:24,color:PC,anchor:'middle',weight:700})+label('外から 押す 圧力',xp+150,110,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=card(200,410,800,80,label('ゆっくり 動かす → 二つの 圧力が 等しい',600,460,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  s+=tag('仮定',1080,470,{g:seg(p,.6,.75),color:C.dim});
  return s;
 },
 // ================= S3 P–V グラフの面積 =================
 [K+'axes']:(p)=>{
  let s=pvAxes({g:seg(p,.05,.3)});
  s+=fade(seg(p,.5,.7),label('P–V グラフ',990,180,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'line']:(p)=>{
  let s=pvAxes();
  s+=fade(seg(p,.05,.2),dot(gX(25),gY(1),10,C.hi));
  s+=draw([[gX(25),gY(1)],[gX(27),gY(1)]],seg(p,.2,.6),{color:PC,w:5});
  s+=fade(seg(p,.55,.7),dot(gX(27),gY(1),10,C.hi)+arrow(gX(26)-10,gY(1)-26,gX(26)+20,gY(1)-26,{color:PC,w:3,head:10}));
  s+=card(840,150,330,130,label('圧力 一定',1005,200,{size:30,color:PC,anchor:'middle',weight:700})+T2(`${E5}${PA}`,1005,250,{size:30}),seg(p,.4,.6),PC);
  return s;
 },
 [K+'area']:(p)=>{
  let s=pvAxes()+draw([[gX(25),gY(1)],[gX(27),gY(1)]],1,{color:PC,w:5});
  s+=pRect(25,27,1,{g:seg(p,.05,.25)});
  s+=fade(seg(p,.25,.4),label('ΔV',gX(26),PG.y+70,{size:28,color:VC,anchor:'middle',weight:700})+label('P',gX(27)+20,gY(.5)+8,{size:30,color:PC,weight:700}));
  s+=card(830,140,350,220,label('面積 ＝ P × ΔV',1005,200,{size:30,color:C.ink,anchor:'middle',weight:700})+mrow(['@',`=200${JJ}`],1005,280,{size:44}),seg(p,.45,.65),WC);
  return s;
 },
 [K+'fxg']:(p)=>{
  // small F–x panel next to the P–V panel
  let s=fade(.85,pvAxes())+pRect(25,27,1)+draw([[gX(25),gY(1)],[gX(27),gY(1)]],1,{color:PC,w:5});
  const x0=900,y0=350,w=230,h=180;
  s+=fade(seg(p,.05,.25),arrow(x0-6,y0,x0+w+20,y0,{color:C.dim,w:2.5,head:12})+arrow(x0,y0+6,x0,y0-h-20,{color:C.dim,w:2.5,head:12})+label('x',x0+w+30,y0+8,{size:24,color:C.x})+label('F',x0,y0-h-30,{size:24,color:C.F,anchor:'middle'})+rect(x0+40,y0-120,140,120,{fill:WC,fo:.3,stroke:WC,sw:2.5,rx:0})+line(x0+40,y0-120,x0+180,y0-120,{color:C.F,w:4}));
  s+=fade(seg(p,.3,.5),label('力学：F–x グラフ',x0+115,110,{size:26,color:C.ink,anchor:'middle',weight:700})+label('面積 ＝ 仕事',x0+115,400,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'slices']:(p)=>{
  let s=pvAxes({ticks:[20,25,30]});
  s+=draw(Array.from({length:81},(_,i)=>{const v=21+8*i/80;return [gX(v),gY(cP(v))];}),seg(p,.0,.25),{color:PC,w:4});
  const n=8,a=seg(p,.25,.6);
  for(let i=0;i<n;i++){const v1=22+i*.75,v2=v1+.75,q=cP(v1+.375);s+=fade(clamp(a*n-i),rect(gX(v1),gY(q),gX(v2)-gX(v1),gY(0)-gY(q),{fill:WC,fo:.3,stroke:WC,sw:1.5,rx:0}));}
  s+=card(830,150,350,170,label('細い 長方形を 足す',1005,215,{size:28,color:C.ink,anchor:'middle',weight:700})+label('＝ 線の 下の 面積',1005,275,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.8),C.hi);
  return s;
 },
 [K+'dir']:(p)=>{
  let s=pvAxes()+pRect(25,27,1,{g:.6})+draw([[gX(25),gY(1)],[gX(27),gY(1)]],1,{color:PC,w:5});
  s+=fade(seg(p,.05,.25),arrow(gX(25),gY(1)-50,gX(27),gY(1)-50,{color:C.hi,w:5,head:16})+label('右へ：外へ 仕事',980,170,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),arrow(gX(27),gY(1)-90,gX(25),gY(1)-90,{color:C.a,w:5,head:16})+label('左へ：外から 仕事を される',980,260,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 定積と定圧 =================
 [K+'v']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:330,y:90,w:400,h:290,n:16,dist:260*t*(1+seg(p,.3,1)*.6),seed:6,color:MOL});
  s+=fade(seg(p,.2,.4),flame(530,470,{s:1.1})+QA(530,430,530,390));
  s+=fade(seg(p,.05,.25),label('定積（体積 一定）',530,60,{size:32,color:VC,anchor:'middle',weight:700}));
  s+=card(800,170,340,140,label('動かない',970,225,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${Wt}=0`,970,280,{size:44}),seg(p,.5,.7),WC);
  return s;
 },
 [K+'v2']:(p)=>{
  let s=fade(.6,T2(LAW,600,80,{size:40}));
  s+=card(250,130,700,120,T2(`${dU}=${Qt}+0`,600,195,{size:54}),seg(p,.05,.25),C.dim);
  s+=card(250,290,700,130,T2(`${dU}=${Qt}`,600,358,{size:64}),seg(p,.4,.6),C.hi);
  s+=fade(seg(p,.7,.85),label('熱が 全部 U へ',600,470,{size:30,color:UC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p']:(p,ctx)=>{
  const t=sceneT(p,ctx),V=mix(25,27,seg(p,.3,.9));
  let s=cyl({x:400,gy:430,w:220,V:V*.12,dist:220*t,flame:seg(p,.1,.3),label:'',hot:seg(p,.4,1)>.5?1:0});
  s+=fade(seg(p,.05,.25),label('定圧（圧力 一定）',830,90,{size:32,color:PC,anchor:'middle',weight:700}));
  s+=card(660,170,340,150,T2(`${Vt}=${V.toFixed(1)}${LL}`,830,250,{size:44}),seg(p,.3,.5),VC);
  s+=fade(seg(p,.1,.3),label('ゆっくり 温める',830,400,{size:28,color:QC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p2']:(p)=>{
  let s=card(150,60,900,130,T2(`\\dfrac{${Tt}}{300\\ \\mathrm{K}}=\\dfrac{27${LL}}{25${LL}}`,600,128,{size:46}),seg(p,.05,.25),TC);
  s+=card(150,230,900,120,T2(`${Tt}=300\\times\\dfrac{27}{25}=324\\ \\mathrm{K}`,600,290,{size:46}),seg(p,.35,.55),TC);
  s+=fade(seg(p,.65,.8),T2(`${DT}=24\\ \\mathrm{K}`,600,420,{size:50}));
  return s;
 },
 [K+'p3']:(p)=>{
  let s=fade(.6,T2(`${dU}=\\tfrac{3}{2}nR${DT}`,600,80,{size:40}));
  s+=card(110,150,980,150,T2(`${dU}=1.5\\times1.0\\times8.3\\times24\\approx 300${JJ}`,600,225,{size:48}),seg(p,.05,.25),UC);
  s+=fade(seg(p,.6,.75),label('（298.8 J を 丸めた 値）',600,370,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'p4']:(p)=>{
  let s=card(150,60,900,110,mrow(['@',`=200${JJ}\\ \\ \\rightarrow\\ \\ ${Wt}=-200${JJ}`],600,115,{size:44}),seg(p,.05,.25),WC);
  s+=fade(seg(p,.4,.55),T2(LAW,600,250,{size:44}));
  s+=card(250,310,700,120,T2(`${Qt}=${dU}-${Wt}`,600,370,{size:56}),seg(p,.55,.75),QC);
  s+=fade(seg(p,.6,.75),label('両辺 から W を 引く',600,470,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'p5']:(p)=>{
  let s=fade(.6,T2(`${Qt}=${dU}-${Wt}`,600,80,{size:40}));
  s+=card(150,150,900,150,T2(`${Qt}\\approx 300-(-200)=500${JJ}`,600,225,{size:54}),seg(p,.05,.25),QC);
  return s;
 },
 [K+'p6']:(p)=>{
  const k=.6,b=460;
  let s=bar(250,b,500,k,{color:QC,top:'Q ≈ 500 J',w:140,g:seg(p,.05,.2),text:'入れた 熱'});
  s+=fade(seg(p,.3,.5),rect(600-70,b-500*k,140,200*k,{fill:WC,fo:.5,stroke:WC,sw:2,rx:6})+label('外への 仕事 200 J',700,b-500*k+70,{size:28,color:WC,weight:700}));
  s+=fade(seg(p,.55,.75),rect(600-70,b-300*k,140,300*k,{fill:UC,fo:.5,stroke:UC,sw:2,rx:6})+label('温度を 上げた 300 J',700,b-150*k+10,{size:28,color:UC,weight:700}));
  s+=fade(seg(p,.25,.4),label('→',420,b-150*k,{size:50,color:C.ink,anchor:'middle',weight:700}));
  s+=line(150,b,1000,b,{color:C.dim,w:2});
  return s;
 },
 // ================= S5 断熱と等温 =================
 [K+'ad']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=molBox({x:330,y:90,w:400,h:290,n:16,dist:260*t,seed:6,color:MOL});
  s+=fade(seg(p,.05,.25),rect(312,72,436,326,{fill:'none',fo:0,stroke:'#c9d2e3',sw:14,rx:16}).replace('<rect','<rect stroke-opacity=".5"'));
  s+=fade(seg(p,.05,.25),label('断熱（熱が 通らない 壁）',530,450,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=card(800,130,360,230,T2(`${Qt}=0`,980,200,{size:46})+T2(`${dU}=${Wt}`,980,300,{size:52}),seg(p,.4,.6),C.hi);
  s+=tag('定義',980,420,{g:seg(p,.6,.75)});
  return s;
 },
 [K+'ad2']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(780,660,seg(p,.2,.8));
  let s=SY({xp,dist:220*t,push:1});
  s+=fade(seg(p,.05,.2),rect(225,130,xp-225+12,200,{fill:'none',fo:0,stroke:'#c9d2e3',sw:8,rx:10}).replace('<rect','<rect stroke-opacity=".45"'));
  s+=fade(seg(p,.05,.2),label('1.0 mol・単原子・断熱',480,90,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(250,390,700,100,T2(`${Wt}=+100${JJ}`,600,442,{size:46}),seg(p,.4,.6),WC);
  return s;
 },
 [K+'ad3']:(p)=>{
  let s=fade(.6,T2(`${dU}=${Wt}=100${JJ}`,600,70,{size:40}));
  s+=card(110,130,980,150,T2(`${DT}=\\dfrac{100}{1.5\\times1.0\\times8.3}`,600,205,{size:52}),seg(p,.05,.25),TC);
  s+=card(390,320,420,110,T2(`\\approx 8.0\\ \\mathrm{K}`,600,378,{size:54,color:TC,auto:false}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'wall']:(p)=>wallBounce(seg(p,.05,.95),{dir:-1}),
 [K+'wall2']:(p)=>{
  let s=wallBounce(seg(p,.05,.85),{dir:1,u:760,w:200,y:230});
  s+=fade(seg(p,.7,.85),label('遅く なる → 温度が 下がる',600,470,{size:30,color:'#7fb6ff',anchor:'middle',weight:700}));
  return s;
 },
 [K+'myth']:(p)=>{
  let s=card(180,80,840,120,label('断熱 なら 温度は 変わらない？',600,152,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.25,.4),line(250,140,950,140,{color:C.a,w:5}));
  s+=card(180,250,840,170,T2(`${Qt}=0`,420,335,{size:52})+label('ゼロ なのは 熱の 出入り',760,320,{size:30,color:C.hi,anchor:'middle',weight:700})+label('温度は 変わる',760,375,{size:30,color:TC,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'iso']:(p)=>{
  let s=card(150,60,900,120,label('等温（温度 一定）',600,135,{size:36,color:TC,anchor:'middle',weight:700}),seg(p,.0,.15),TC);
  s+=card(150,210,420,120,T2(`${dU}=0`,360,270,{size:52}),seg(p,.25,.45),UC);
  s+=fade(seg(p,.45,.6),arrow(590,270,650,270,{color:C.hi,w:5,head:16}));
  s+=card(670,210,380,120,T2(`${Qt}=-${Wt}`,860,270,{size:52}),seg(p,.55,.75),QC);
  s+=fade(seg(p,.6,.75),label('0 ＝ Q ＋ W から',600,400,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'iso2']:(p,ctx)=>{
  const t=sceneT(p,ctx),xp=mix(800,680,seg(p,.05,.95));
  let s=SY({xp,dist:220*t,push:1});
  s+=fade(seg(p,.2,.4),QA(420,320,420,420)+QA(540,320,540,420)+label('同じ だけ 熱が 出る',480,470,{size:28,color:QC,anchor:'middle',weight:700}));
  s+=thermo(80,60,300,120);
  s+=fade(seg(p,.5,.7),label('温度 一定',100,380,{size:28,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'pump']:(p)=>{
  let s=pump(220,450,120*seg(p,.05,.35));
  s+=fade(seg(p,.1,.3),label('空気入れ',220,500,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=thermo(340,190,400,60+120*seg(p,.2,.45),{g:seg(p,.15,.3)});
  s+=fade(seg(p,.2,.4),label('素早い 断熱 圧縮',220,90,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=mountain({g:seg(p,.5,.65),down:seg(p,.6,.85)});
  s+=fade(seg(p,.65,.8),label('フェーン 現象',840,490,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cloud']:(p)=>{
  let s=fade(.35,pump(220,450,120));
  s+=mountain({down:.35,up:seg(p,.05,.6)});
  s+=fade(seg(p,.5,.7),label('断熱 膨張 → 冷えて 雲',840,490,{size:28,color:'#7fb6ff',anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=fade(.8,pvAxes())+pRect(25,27,1)+draw([[gX(25),gY(1)],[gX(27),gY(1)]],1,{color:PC,w:5});
  s+=card(830,130,350,250,T2(`${Wt}=-${PdV}`,1005,200,{size:44})+label('＝ 線の 下の 面積',1005,280,{size:28,color:C.hi,anchor:'middle',weight:700})+label('（符号に 注意）',1005,330,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  let s=rect(450,160,300,200,{fill:'#7d8aa3',fo:.25,stroke:C.dim,sw:3,rx:12})+label('エンジン',600,270,{size:34,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),QA(250,260,440,260)+label('熱',300,235,{size:30,color:QC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),WA(760,260,950,260)+label('仕事',900,235,{size:30,color:WC,anchor:'middle',weight:700}));
  s+=card(250,390,700,100,label('全部 仕事に できる？',600,452,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(200,170,800,150,label('次の 動画：エンジンの 1サイクルと 熱効率',600,260,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
