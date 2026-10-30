// 問題編 解説「ルートの坂を斜めに歩く」（q-um-rules、大学編 03 微分の法則・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/03_微分の法則.md の q-um-rules（解説 18 行）。
// 画面：左に地図（x 東・y 北、縦横同じ縮尺）、右に断面と式。札は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：x 東 水色、y 北 緑、高さ h・断面・傾きの矢印 橙、速度 紫、等高線 灰、鍵 桃、強調 黄、下り 赤。
// 矢印の長さ：速度は 1 あたり 18 px、傾きの矢印は 1 あたり 50 px（向きだけを比べる。地図の目盛りとは別）。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly} from './anim.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-um-rules:';
const CX=C.x,CY=C.F,CH=C.E,CV=C.v,CL=C.p,CD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const G1='∂h/∂x（点 (4, 3)）',G2='t＝0 の dh/dt',G3='dh/dt＝0 になる速度';
const ANS1=g=>answerTag(1,'B','0.75',{g}),ANS2=g=>answerTag(2,'D','1',{g}),ANS3=g=>answerTag(3,'C','(8, −3)',{g});
const WOPT={x:580,w:600,size:26,whySize:22};

// ---- 地図 --------------------------------------------------------------------------------------
const M={x0:70,y0:470,s:75,xmax:6,ymax:4.2};
const MX=x=>M.x0+M.s*x,MY=y=>M.y0-M.s*y,P=[4,3],PX=MX(4),PY=MY(3);
const VS=18,GS=50;
function contour(c,{color=C.dim,w=2.5,op=.55}={}){
 const xa=Math.max((c/M.ymax)**2,.05);const pts=[];
 for(let i=0;i<=60;i++){const x=mix(xa,M.xmax,i/60);pts.push([MX(x),MY(c/Math.sqrt(x))]);}
 return `<g opacity="${op}">${draw(pts,1,{color,w})}</g>`;
}
function map({g=1,cont=0,hl=0,pt=1,ptGlow=0,hLab=0}={}){
 let s=rect(M.x0,MY(M.ymax),M.s*M.xmax,M.s*M.ymax,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:4});
 for(let i=1;i<=6;i++)s+=line(MX(i),M.y0,MX(i),MY(M.ymax),{color:'#1c2a44',w:2});
 for(let j=1;j<=4;j++)s+=line(M.x0,MY(j),MX(M.xmax),MY(j),{color:'#1c2a44',w:2});
 if(cont)[2,4,8,10].forEach(c=>{s+=fade(cont,contour(c));});
 if(cont||hl)s+=fade(Math.max(cont,hl),contour(6,{color:hl?C.hi:C.dim,w:hl?4:2.5,op:hl?1:.55}));
 s+=arrow(M.x0,M.y0,MX(M.xmax)+30,M.y0,{color:CX,w:3,head:12})+label('東 x',MX(M.xmax)+30,M.y0-12,{size:24,color:CX,anchor:'end'});
 s+=arrow(M.x0,M.y0,M.x0,MY(M.ymax)-22,{color:CY,w:3,head:12})+label('北 y',M.x0+12,MY(M.ymax)-6,{size:24,color:CY});
 for(const i of [2,4,6])s+=label(String(i),MX(i),M.y0+28,{size:22,color:CX,anchor:'middle'});
 for(const j of [1,2,3,4])s+=label(String(j),M.x0-12,MY(j)+8,{size:22,color:CY,anchor:'end'});
 if(pt){s+=dot(PX,PY,10,C.hi)+label('(4, 3)',PX-14,PY-14,{size:24,color:C.hi,weight:700,anchor:'end'});
  if(ptGlow)s+=fade(ptGlow,ring(PX,PY,24,{color:C.hi,w:4}));
  if(hLab)s+=fade(hLab,label('h＝6',PX-14,PY+36,{size:26,color:CH,anchor:'end',weight:700}));}
 return fade(g,s);
}
function lock(x,y,color=CL,g=1,s=1){
 return fade(g,`<path d="M ${x-9*s} ${y-6*s} v ${-8*s} a ${9*s} ${9*s} 0 0 1 ${18*s} 0 v ${8*s}" fill="none" stroke="${color}" stroke-width="${3.5*s}"/>`
  +rect(x-14*s,y-7*s,28*s,22*s,{fill:color,fo:.9,stroke:color,sw:1,rx:4*s}));
}
const vel=(v,{g=1,color=CV,w=6,lab='',lx=0,ly=0}={})=>fade(g,arrow(PX,PY,PX+VS*v[0],PY-VS*v[1],{color,w,head:16})+(lab?label(lab,PX+VS*v[0]+lx,PY-VS*v[1]+ly,{size:24,color,weight:700,anchor:'middle'}):''));
const grad=(g=1,lab=1)=>fade(g,arrow(PX,PY,PX+GS*.75,PY-GS*2,{color:CH,w:6,head:16})+(lab?label('(0.75, 2)',PX+GS*.75+12,PY-GS*2+4,{size:24,color:CH,weight:700}):''));
// 東向きの断面 h＝3√x（y＝3）
function eastSec({x=620,y=470,w=520,h=300,g=1,tan=0,curve=1}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:7,ymin:0,ymax:8.5,xlabel:'x',ylabel:'',xticks:[2,4,6],yticks:[3,6],grid:true,xcolor:CX,ycolor:CH});
 let s=A.svg+fade(curve,A.plot(t=>3*Math.sqrt(t),{from:0,to:6.9,color:CH,w:4}));
 s+=fade(curve,label('h ＝ 3√x（y ＝ 3 の 断面）',x+w/2,y-h-14,{size:26,color:CH,anchor:'middle',weight:700}));
 if(tan){s+=fade(tan,draw([[A.X(1.5),A.Y(6-.75*2.5)],[A.X(6.8),A.Y(6+.75*2.8)]],1,{color:C.hi,w:4,dash:'9 6'})+dot(A.X(4),A.Y(6),9,C.hi)+label('傾き 0.75',A.X(4.4),A.Y(4.6),{size:26,color:C.hi,weight:700}));}
 return fade(g,s);
}
// 北向きの断面 h＝2y（x＝4）
function northSec({x=620,y=470,w=520,h=300,g=1,tan=0}={}){
 const A=axes({x,y,w,h,xmin:0,xmax:4.6,ymin:0,ymax:9,xlabel:'y',ylabel:'',xticks:[1,2,3,4],yticks:[3,6],grid:true,xcolor:CY,ycolor:CH});
 let s=A.svg+A.plot(t=>2*t,{from:0,to:4.4,color:CH,w:4})+dot(A.X(3),A.Y(6),9,C.hi);
 s+=label('h ＝ 2y（x ＝ 4 の 断面）',x+w/2,y-h-14,{size:26,color:CH,anchor:'middle',weight:700});
 s+=fade(tan,label('傾き 2',A.X(3.2),A.Y(4.6),{size:26,color:C.hi,weight:700}));
 return fade(g,s);
}
// 出発の瞬間の高さの変わる速さ（毎秒）を、東への動きの分（＋3）と南への動きの分（−2）の棒に分けて積む（点検 PQ-005・006 で札を直した）
const u0=40;
// 地図の上の、東へ 4・南へ 1 の矢印（step1 で出したものを残す）
const axSplit=()=>arrow(PX,PY,PX+VS*4,PY,{color:CX,w:5,head:12})+label('東へ 4',PX+VS*2,PY-12,{size:22,color:CX,anchor:'middle',weight:700})
 +arrow(PX+VS*4,PY,PX+VS*4,PY+VS,{color:CY,w:5,head:8})+label('南へ 1',PX+VS*4+12,PY+VS+20,{size:22,color:CY,weight:700});
function stairs({x=600,y=420,g=1,s1=1,s2=0,sum=0,head=1}={}){
 let s=line(x,y,x+560,y,{color:C.faint,w:2});
 if(head)s+=fade(head,label('出発する 瞬間の 高さの 変わる 速さ（毎秒）',x+280,y-3*u0-70,{size:24,color:C.dim,anchor:'middle'}));
 const u=40;
 // 一段目：上り 3
 s+=fade(s1,rect(x+20,y-3*u,220,3*u,{fill:CH,fo:.25,stroke:CH,sw:2,rx:4})+label('東への 動きの 分',x+130,y+32,{size:24,color:CX,anchor:'middle',weight:700})
  +label('0.75 × 4 ＝ ＋3',x+130,y-3*u-14,{size:28,color:CH,anchor:'middle',weight:700}));
 // 二段目：下り 2（3 の高さから 1 まで）
 s+=fade(s2,rect(x+260,y-3*u,220,2*u,{fill:CD,fo:.22,stroke:CD,sw:2,rx:4})+rect(x+260,y-u,220,u,{fill:CH,fo:.25,stroke:CH,sw:2,rx:4})
  +label('南への 動きの 分',x+370,y+32,{size:24,color:CY,anchor:'middle',weight:700})+label('2 × (−1) ＝ −2',x+370,y-3*u-14,{size:28,color:CD,anchor:'middle',weight:700}));
 s+=fade(sum,label('＋1',x+520,y-u+10,{size:30,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
// 直角の印（点で、傾きの矢印と等高線の接線の間）
function rightMark(g=1){
 const gx=.75,gy=2,n=Math.hypot(gx,gy),ux=gx/n,uy=gy/n,tx=8/Math.hypot(8,3),ty=-3/Math.hypot(8,3),q=22;
 const a=[PX+q*ux,PY-q*uy],b=[PX+q*ux+q*tx,PY-q*uy-q*ty],c=[PX+q*tx,PY-q*ty];
 return fade(g,draw([a,b,c],1,{color:C.hi,w:3}));
}
const V4=[['(3, 8)',[3,8],[0,-14]],['(8, 3)',[8,3],[0,-14]],['(8, −3)',[8,-3],[0,40]],['(4, −1)',[4,-1],[0,34]]];

export const ytQxUmRulesDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（小問1、約4秒）：地図と点 (4, 3)。点が一度光って止まる。右に y＝3 の東向きの断面 h＝3√x の曲線だけ（接線なし）。
 [K+'q1']:(p)=>{
  const gl=Math.sin(Math.PI*clamp((p-.1)/.5));
  return map({ptGlow:gl})+eastSec({g:seg(p,.45,.75)})+fade(seg(p,.45,.75),lock(MX(.6),MY(3)-26,CL)+label('y＝3 に 鍵',MX(.6)+24,MY(3)-18,{size:24,color:CL,weight:700})+line(M.x0,MY(3),MX(M.xmax),MY(3),{color:CX,w:2,dash:'8 6'}));
 },
 // 小問2（約4秒）：断面は消し、点から速度の矢印 (4, −1)（紫）。
 [K+'q2']:(p)=>{
  const gl=Math.sin(Math.PI*clamp((p-.05)/.4));
  let s=map({ptGlow:gl});
  s+=fade(seg(p,.4,.7),vel([4,-1],{lab:'(4, −1)',ly:34}));
  s+=fade(seg(p,.5,.8),label('x ＝ 4 ＋ 4t、y ＝ 3 − t',850,260,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // 小問3（約4秒）：4本の速度の矢印を、同じ色・同じ太さで順に描く。
 [K+'q3']:(p)=>{
  let s=map({});
  V4.forEach(([t,v,o],i)=>{s+=vel(v,{g:seg(p,.08+.18*i,.22+.18*i),lab:t,lx:o[0],ly:o[1]});});
  s+=fade(seg(p,.8,.95),note('矢印の 長さは 地図の 目盛りと 別（縮めて 描いた）',870,420));
  return s;
 },

 // ===================== 問題の設定 =====================
 [K+'setup']:(p)=>{
  let s=map({ptGlow:Math.sin(Math.PI*clamp((p-.3)/.4)),hLab:seg(p,.5,.6)});
  s+=card(620,110,520,150,T(`h=y\\sqrt{x}`,880,200,52,{color:CH}),seg(p,.05,.15));
  s+=fade(seg(p,.4,.5),label('点 (4, 3) から 歩き出す',880,330,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },

 // ===================== 小問1 =====================
 // 2. y＝3 に鍵、断面 h＝3√x。h＝y×√x の √x を光らせる。
 [K+'goal1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=map({});
  s+=fade(seg(p,b,b+.08),lock(MX(.6),MY(3)-26,CL)+label('y＝3 に 鍵',MX(.6)+24,MY(3)-18,{size:24,color:CL,weight:700})+line(M.x0,MY(3),MX(M.xmax),MY(3),{color:CX,w:2,dash:'8 6'}));
  s+=fade(seg(p,.05,.15),T(`h=y\\times\\sqrt{x}`,880,120,40));
  const w=texWidth(`h=y\\times\\sqrt{x}`,40,false),ws=texWidth(`\\sqrt{x}`,40,false);
  s+=highlight(880+w/2-ws-6,88,ws+12,56,seg(p,b+.15,b+.25));
  s+=eastSec({x:640,y:470,w:500,h:280,g:seg(p,b+.05,b+.15)});
  s+=goalTag(G1,{g:seg(p,.02,.08)});
  return s;
 },
 // 3. √x＝x^(1/2) → ½ を前に → 肩は ½−1＝−½ → ½x^(−1/2)＝1/(2√x)
 [K+'power']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35;
  let s=map({});
  s+=card(580,95,600,410,'',1);
  s+=T(`\\sqrt{x}=x^{\\frac12}`,880,170,46);
  s+=fade(seg(p,b,b+.1),label('½ を 前に 出す',720,250,{size:26,color:C.hi,anchor:'middle',weight:700})+label('肩を 1つ 下げる',1040,250,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.15,b+.25),T(`\\frac12-1=-\\frac12`,1040,310,34,{color:C.hi}));
  s+=fade(seg(p,b+.3,b+.42),T(`\\dfrac{d}{dx}\\,x^{\\frac12}=\\frac12\\,x^{-\\frac12}`,880,400,42));
  s+=goalTag(G1);
  return s;
 },
 // 4. 傾きは 1/(2√x)。∂h/∂x＝y/(2√x)＝3/(2×2)＝0.75。断面の x＝4 に接線。
 [K+'slope1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=map({})+lock(MX(.6),MY(3)-26,CL)+label('y＝3 に 鍵',MX(.6)+24,MY(3)-18,{size:24,color:CL,weight:700})+line(M.x0,MY(3),MX(M.xmax),MY(3),{color:CX,w:2,dash:'8 6'});
  s+=T(`\\dfrac{d}{dx}\\sqrt{x}=\\dfrac{1}{2\\sqrt{x}}`,880,125,36);
  s+=eastSec({x:640,y:390,w:500,h:165,tan:seg(p,b+.3,b+.42)});
  s+=fade(seg(p,b,b+.1),T(`\\dfrac{\\partial h}{\\partial x}=\\dfrac{y}{2\\sqrt{x}}=\\dfrac{3}{2\\times2}=0.75`,880,482,30));
  s+=goalTag(G1);
  return s;
 },
 // 5. 小問1 の答え B。誤答 A → C → D（2文目を3つに分ける）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,L=(1-b)/3;
  const win=[[b,b+L+.01],[b+L+.01,b+2*L+.01],[b+2*L+.01,1]];
  let s=map({})+lock(MX(.6),MY(3)-26,CL)+line(M.x0,MY(3),MX(M.xmax),MY(3),{color:CX,w:2,dash:'8 6'});
  s+=card(580,100,600,150,T(`\\dfrac{\\partial h}{\\partial x}=\\dfrac{y}{2\\sqrt{x}}=0.75`,880,175,38),1);
  s+=wrongSeq(p,ctx,[['A','0.375',['1/(2x) とした','（正しくは 1/(2√x)）']],['C','3','½√x（肩を 下げ忘れた）'],['D','2','∂h/∂y ＝ √x と 取り違えた']],{win,opts:{...WOPT,y:290}});
  s+=goalTag(G1)+ANS1(seg(p,b-.06,b-.01));
  return s;
 },

 // ===================== 小問2 =====================
 // 6. 速度の矢印 (4, −1)、成分 dx/dt＝4、dy/dt＝−1
 [K+'goal2']:(p)=>goal2Fig(p*.45,.45),
 [K+'goal2b']:(p)=>goal2Fig(.45+.55*p,.45,1),
 [K+'goal2__']:(p,b,later)=>{
  let s=map({});
  s+=vel([4,-1],{g:seg(p,b,b+.1)});
  s+=fade(seg(p,b+.15,b+.25),arrow(PX,PY+44,PX+VS*4,PY+44,{color:CX,w:3,head:10})+label('dx/dt＝4',PX+VS*2,PY+80,{size:24,color:CX,anchor:'middle',weight:700})
   +arrow(PX+VS*4+20,PY,PX+VS*4+20,PY+VS,{color:CY,w:3,head:8})+label('dy/dt＝−1',PX+VS*2,PY+112,{size:24,color:CY,anchor:'middle',weight:700}));
  s+=card(580,100,600,200,T(`x=4+4${`{\\color{${C.t}}t}`},\\ \\ y=3-{\\color{${C.t}}t}`,880,180,38)
   +fade(seg(p,b+.1,b+.2),label('東へ 速さ 4、南へ 速さ 1',880,260,{size:28,color:CV,anchor:'middle',weight:700})),seg(p,.03,.1));
  s+=goalTag(G2,{g:later?1:seg(p,.02,.08)});
  return s;
 },
 // 7. x＝4 に鍵。北向きの断面 h＝2y、傾き 2。
 [K+'north']:(p)=>{
  let s=map({})+vel([4,-1],{g:.5});
  s+=fade(seg(p,.05,.15),lock(MX(4)+30,MY(4.0),CL)+label('x＝4 に 鍵',MX(4)+52,MY(4.0)+8,{size:24,color:CL,weight:700})+line(MX(4),M.y0,MX(4),MY(M.ymax),{color:CY,w:2,dash:'8 6'}));
  s+=northSec({x:640,y:385,w:500,h:220,tan:seg(p,.45,.55),g:seg(p,.1,.2)});
  s+=fade(seg(p,.35,.45),T(`\\dfrac{\\partial h}{\\partial y}=\\sqrt{x}=2`,880,480,32));
  s+=goalTag(G2);
  return s;
 },
 // 8. 出発の瞬間の動き（速度 (4, −1)）を、東への動き 4 と南への動き 1 に分ける（点検 PQ-005・006）
 [K+'step1']:(p)=>{
  let s=map({})+vel([4,-1],{g:1-.6*seg(p,.15,.3)});
  const sx=seg(p,.25,.4),sy=seg(p,.45,.6);
  s+=fade(sx,arrow(PX,PY,PX+VS*4,PY,{color:CX,w:5,head:12})+label('東へ 4',PX+VS*2,PY-12,{size:22,color:CX,anchor:'middle',weight:700}));
  s+=fade(sy,arrow(PX+VS*4,PY,PX+VS*4,PY+VS,{color:CY,w:5,head:8})+label('南へ 1',PX+VS*4+12,PY+VS+20,{size:22,color:CY,weight:700}));
  s+=stairs({s1:0,s2:0,head:seg(p,.05,.15)});
  s+=goalTag(G2);
  return s;
 },
 // 8b. 東への動きの分：0.75×4＝＋3（毎秒）
 [K+'step1b']:(p)=>{
  let s=map({})+vel([4,-1],{g:.4})+axSplit();
  s+=stairs({s1:seg(p,.1,.25),s2:0});
  s+=goalTag(G2);
  return s;
 },
 // 9. 南への動きの分：2×(−1)＝−2（毎秒、下り）
 [K+'step2']:(p)=>{
  let s=map({})+vel([4,-1],{g:.4})+axSplit();
  s+=stairs({s1:1,s2:seg(p,.05,.2)});
  s+=fade(seg(p,.5,.6),label('y は 減っている → dy/dt ＝ −1',880,496,{size:26,color:CY,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 10. dh/dt＝(∂h/∂x)(dx/dt)＋(∂h/∂y)(dy/dt)＝3−2＝1。小問2 の答え D。
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=map({})+vel([4,-1]);
  s+=stairs({s1:1,s2:1,sum:seg(p,.2,.3),y:470,g:1,head:0});
  s+=card(580,95,600,190,T(`\\dfrac{dh}{dt}=\\dfrac{\\partial h}{\\partial x}\\dfrac{dx}{dt}+\\dfrac{\\partial h}{\\partial y}\\dfrac{dy}{dt}`,880,155,30)
   +fade(seg(p,.1,.2),T(`=3-2=1`,880,240,40,{color:C.hi})),1);
  s+=goalTag(G2)+ANS2(seg(p,b+.02,b+.12));
  return s;
 },
 // 11. 誤答 A（東への動きの分だけ）→ B（速さを掛けていない）→ C（dy/dt を ＋1）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),b2=W[1]?W[1][0]:.4,m=b2+(1-b2)*.5;
  const win=[[0,b2+.02],[b2+.02,m+.02],[m+.02,1]];
  let s=map({})+vel([4,-1]);
  s+=card(580,100,600,150,T(`\\dfrac{dh}{dt}=0.75\\times4+2\\times(-1)=1`,880,178,32),1);
  s+=wrongSeq(p,ctx,[['A','3','東への 動きの 分 だけ'],['B','2.75','0.75 ＋ 2（速さを 掛けていない）'],['C','5','3 ＋ 2（dy/dt を ＋1 とした）']],{win,opts:{...WOPT,y:290}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 12. 代入で確かめる：h(t)＝2(3−t)√(1＋t) → 積の微分 → 2×(−1＋1.5)＝1 ✓
 [K+'subst']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=card(80,95,1040,410,'',1);
  s+=T(`h=(3-t)\\sqrt{4+4t}=2(3-t)\\sqrt{1+t}`,600,165,40);
  s+=fade(seg(p,b,b+.1),label('積の 微分（2つの 帯）',600,240,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,b+.1,b+.22),T(`\\dfrac{dh}{dt}=2\\Big[{\\color{${C.hi}}(-1)\\sqrt{1+t}}+{\\color{${C.F}}(3-t)\\dfrac{1}{2\\sqrt{1+t}}}\\Big]`,600,320,38));
  s+=fade(seg(p,b+.3,b+.42),T(`t=0:\\ \\ 2\\times({\\color{${C.hi}}-1}+{\\color{${C.F}}1.5})=1`,570,435,40));
  s+=fade(seg(p,b+.45,b+.52),label('✓',860,450,{size:46,color:C.F,weight:700}));
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 13. 傾きの矢印 (0.75, 2)。(0.75, 2)·(4, −1)＝3−2 と小問2 の 3、−2 を対応させる。
 [K+'goal3']:(p)=>goal3Fig(p*.45,.45),
 [K+'goal3b']:(p)=>goal3Fig(.45+.55*p,.45,1),
 [K+'goal3__']:(p,b,later)=>{
  let s=map({})+vel([4,-1],{g:seg(p,b,b+.1),lab:'(4, −1)',ly:34});
  s+=grad(seg(p,b,b+.1));
  s+=card(580,100,600,250,label('今の 足し算 ＝ 内積',880,150,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,b+.15,b+.25),T(`{\\color{${CH}}(0.75,\\,2)}\\cdot{\\color{${CV}}(4,\\,-1)}`,880,225,36))
   +fade(seg(p,b+.3,b+.4),T(`=3-2`,840,300,38)+label('（小問2 の 東・南の 分）',1040,300,{size:22,color:C.dim,anchor:'middle'})),seg(p,b,b+.08));
  s+=fade(seg(p,b+.05,b+.12),note('矢印の 長さは 縮めて 描いた',880,400));
  s+=goalTag(G3,{g:later?1:seg(p,.02,.08)});
  return s;
 },
 // 14. 4本の速度の矢印に内積を添える。(8, −3) に 6−6＝0 を黄色で。
 [K+'four']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=map({})+grad(1,0);
  V4.forEach(([t,v,o],i)=>{s+=vel(v,{g:seg(p,.04+.06*i,.1+.06*i),lab:t,lx:o[0],ly:o[1],color:i===2?mixC(seg(p,b,b+.1)):CV});});
  const rows=[['(3, 8)','2.25 ＋ 16 ＝ 18.25'],['(8, 3)','6 ＋ 6 ＝ 12'],['(8, −3)','6 − 6 ＝ 0'],['(4, −1)','3 − 2 ＝ 1']];
  s+=card(580,95,600,370,label('内積が 0 なら 高さは 変わらない',880,140,{size:26,color:C.ink,anchor:'middle',weight:700})
   +rows.map(([a,c],i)=>fade(seg(p,.25+.07*i,.32+.07*i),label(a,680,210+i*62,{size:28,color:i===2&&seg(p,b,b+.1)>.5?C.hi:CV,anchor:'middle',weight:700})
    +label(c,920,210+i*62,{size:28,color:i===2&&seg(p,b,b+.1)>.5?C.hi:C.ink,anchor:'middle',weight:700}))).join(''),1);
  s+=fade(seg(p,b,b+.1),rect(605,206+2*62-34,550,48,{fill:C.hi,fo:.08,stroke:C.hi,sw:2.5,rx:10}));
  s+=goalTag(G3);
  return s;
 },
 // 15. 等高線を描き、(8, −3) の矢印が点で等高線に接する。小問3 の答え C。
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35;
  let s=map({hl:seg(p,b,b+.12),cont:seg(p,b,b+.12)*.6})+grad(.5,0);
  s+=vel([8,-3],{color:C.hi,lab:'(8, −3)',lx:0,ly:40});
  s+=fade(seg(p,b+.15,b+.25),label('等高線（h＝6）に 沿う',880,330,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(580,100,600,150,T(`(0.75,\\,2)\\cdot(8,\\,-3)=6-6=0`,880,178,34),1);
  s+=goalTag(G3)+ANS3(seg(p,.05,.12));
  return s;
 },
 // 16. 誤答 A（傾きの矢印と同じ向き、18.25）→ B（12）→ D（1）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),b2=W[1]?W[1][0]:.45,m=b2+(1-b2)*.5;
  const win=[[0,b2+.02],[b2+.02,m+.02],[m+.02,1]];
  const inA=seg(p,.01,.05)*(1-seg(p,b2,b2+.03)),inB=seg(p,b2+.01,b2+.04)*(1-seg(p,m,m+.03)),inD=seg(p,m+.01,m+.04);
  let s=map({hl:1,cont:.6})+grad(1,0)+vel([8,-3],{color:C.hi,g:.5});
  s+=vel([3,8],{g:inA,lab:'(3, 8)',ly:-14})+vel([8,3],{g:inB,lab:'(8, 3)',ly:-14})+vel([4,-1],{g:inD,lab:'(4, −1)',ly:34});
  s+=wrongSeq(p,ctx,[['A','(3, 8)',['傾きの 矢印と 同じ 向き','（内積 18.25、最大）']],['B','(8, 3)','内積 12（上り）'],['D','(4, −1)','内積 1（小問2 の 道）']],{win,opts:{...WOPT,y:200}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 17. 傾きの矢印と等高線の接線の間に直角の印。
 [K+'perp']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=map({hl:1,cont:.6})+grad(1,1);
  const tx=8/Math.hypot(8,3),ty=-3/Math.hypot(8,3);
  s+=fade(seg(p,.05,.15),line(PX-130*tx,PY+130*ty,PX+150*tx,PY-150*ty,{color:C.hi,w:3,dash:'8 6'}));
  s+=rightMark(seg(p,.15,.25));
  s+=card(580,100,600,280,label('傾きの 矢印 ⟂ 等高線',880,160,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),line(620,200,1140,200,{color:C.faint,w:2})+label('等高線に 沿う 向き',880,250,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('＝ 傾きの 矢印との 内積が 0',880,310,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.03,.1));
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=map({hl:seg(p,b,b+.08),cont:.4*seg(p,b,b+.08)})+grad(seg(p,0,.05),1);
  s+=fade(seg(p,.15,.22),vel([4,-1],{lab:'(4, −1)',ly:34}));
  s+=fade(seg(p,b,b+.08),vel([8,-3],{color:C.hi,lab:'(8, −3)',lx:0,ly:40}));
  s+=card(580,95,600,140,T(`\\dfrac{\\partial h}{\\partial x}=\\dfrac{y}{2\\sqrt{x}}=0.75`,880,148,30)+label('↓ 傾きの 矢印の x 成分',880,215,{size:22,color:CH,anchor:'middle'}),seg(p,0,.05));
  s+=card(580,250,600,110,label('小問2：内積 3 − 2 ＝ 1',880,292,{size:28,color:CV,anchor:'middle',weight:700})+label('（少しずつ 上る）',880,336,{size:22,color:C.dim,anchor:'middle'}),seg(p,.15,.22));
  s+=card(580,375,600,110,label('小問3：内積 6 − 6 ＝ 0',880,417,{size:28,color:C.hi,anchor:'middle',weight:700})+label('（等高線に 接する ＝ 高さは 変わらない）',880,461,{size:22,color:C.dim,anchor:'middle'}),seg(p,b,b+.08));
  s+=answerRow([[1,'B','0.75'],[2,'D','1'],[3,'C','(8, −3)']],{g:seg(p,.85,.92)});
  return s;
 },
};
const goal2Fig=(p,b,l)=>ytQxUmRulesDiagrams[K+'goal2__'](p,b,l),goal3Fig=(p,b,l)=>ytQxUmRulesDiagrams[K+'goal3__'](p,b,l);
function mixC(u){return u>.5?C.hi:CV;}
