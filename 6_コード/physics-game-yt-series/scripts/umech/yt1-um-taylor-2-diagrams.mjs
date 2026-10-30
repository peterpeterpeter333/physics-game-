// YouTube シリーズ「近似・上級 2/2」(ys-um-taylor-2) — 図。Stage 1200×515.
// 色：位置エネルギー U 橙、力 F 緑、位置 x・底の位置 a・ずれ s 水色、ばね定数 U″(a)・k 黄、ずれ・誤り・捨てた項 赤、振り子の角 θ 橙。
import {C,seg,fade,mix,label,line,rect,dot,ring,arrow,highlight,axes,texWidth,draw,poly,wall,spring as coil} from './anim.mjs';
import {card,T,cc,cX,cH} from './yt1-um-sum-to-integral-1-diagrams.mjs';

const K='um-taylor-2:';
const ok=C.F,bad=C.a;
const cU=s=>cc(C.E,s),cF=s=>cc(C.F,s),cR=s=>cc(bad,s);
const Ua=s=>cU(s);

// ---- generic bumpy U (same shape as 1/2 の最後の図) ----
const B=x=>0.6*Math.sin(1.7*x)+0.18*x*x;
const bm=(()=>{let xm=-0.85,best=1e9;for(let u=-2;u<0.5;u+=0.0005){const v=B(u);if(v<best){best=v;xm=u;}}const h=1e-3;return {xm,Um:B(xm),U2:(B(xm+h)-2*B(xm)+B(xm-h))/(h*h)};})();
const GB=(o={})=>axes({x:70,y:450,w:560,h:360,xmin:-3.2,xmax:3.2,ymin:-1.2,ymax:2.6,xticks:[],yticks:[],grid:false,...o});
// zoomed valley of B around its minimum
const GZ=(o={})=>axes({x:70,y:450,w:540,h:360,xmin:bm.xm-1.3,xmax:bm.xm+1.3,ymin:bm.Um-0.2,ymax:bm.Um+1.4,xticks:[],yticks:[],grid:false,...o});
const parB=x=>bm.Um+0.5*bm.U2*(x-bm.xm)**2;
function zoomValley(A,{par=0,tan=0,aTick=1}={}){
 let s=A.svg+A.plot(B,{from:bm.xm-1.25,to:bm.xm+1.25,color:C.E,w:5});
 s+=fade(par,A.plot(parB,{from:bm.xm-0.75,to:bm.xm+0.75,color:C.hi,w:3,dash:'9 7'}));
 s+=fade(tan,line(A.X(bm.xm-0.6),A.Y(bm.Um),A.X(bm.xm+0.6),A.Y(bm.Um),{color:C.x,w:3}));
 s+=dot(A.X(bm.xm),A.Y(bm.Um),9,C.E);
 s+=fade(aTick,line(A.X(bm.xm),A.Y(bm.Um),A.X(bm.xm),452,{color:C.x,w:2,dash:'5 5'})+label('a',A.X(bm.xm),482,{size:30,color:C.x,anchor:'middle',weight:700}));
 s+=label('U',A.X(bm.xm+1.2)-6,A.Y(B(bm.xm+1.2))-14,{size:28,color:C.E,weight:700});
 return s;
}
function bumpy(A,{g=1,q=0,zoom=0}={}){
 let s=A.svg+A.plot(B,{from:-3.1,to:3.1,color:C.E,w:4,p:g});
 const X=A.X(bm.xm),Y=A.Y(bm.Um);
 s+=fade(zoom,ring(X,Y,60,{color:C.hi,w:4})+line(X+42,Y+42,X+100,Y+100,{color:C.hi,w:6}));
 s+=fade(q,label('谷底',X-70,Y+95,{size:26,color:C.hi,anchor:'end',weight:700}));
 return s;
}

// ---- U = x³ − 3x ----
const U3=x=>x*x*x-3*x,P3=x=>-2+3*(x-1)**2,F3=x=>3-3*x*x,FS=x=>-6*(x-1);
const GU=(o={})=>axes({x:70,y:460,w:560,h:400,xmin:-2.3,xmax:2.4,ymin:-4.5,ymax:4.5,xticks:[-2,-1,1,2],yticks:[-4,-2,2,4],grid:true,xlabel:'x',xcolor:C.x,...o});
function ugraph(A,{g=1,par=0,marks=0,hill=0}={}){
 let s=A.svg+A.plot(U3,{from:-2.15,to:2.2,color:C.E,w:5,p:g});
 s+=fade(g,label('U',A.X(2.2)+10,A.Y(U3(2.2))+10,{size:28,color:C.E,weight:700}));
 s+=fade(par,A.plot(P3,{from:-0.15,to:2.2,color:C.hi,w:3,dash:'9 7'}));
 s+=fade(marks,dot(A.X(1),A.Y(-2),9,C.x)+dot(A.X(-1),A.Y(2),9,C.x));
 return s;
}
const GF=(o={})=>axes({x:90,y:450,w:520,h:380,xmin:0.4,xmax:1.8,ymin:-7,ymax:4,xticks:[0.5,1,1.5],yticks:[-6,-4,-2,2],grid:true,xlabel:'x',xcolor:C.x,ylabel:'F',ycolor:C.F,...o});
function fgraph(A,{tru=1,spr=0}={}){
 let s=A.svg+fade(tru,A.plot(F3,{from:0.45,to:1.75,color:C.F,w:5}));
 s+=fade(spr,A.plot(FS,{from:0.45,to:1.75,color:C.hi,w:3,dash:'9 7'}));
 s+=fade(tru,label('本当',A.X(1.72),A.Y(F3(1.72))+34,{size:24,color:C.F,anchor:'end',weight:700}));
 s+=fade(spr,label('ばね近似',A.X(0.5)+10,A.Y(FS(0.5))-14,{size:24,color:C.hi,weight:700}));
 return s;
}

// ---- pendulum ----
function pendulum(cx,cy,L,th,{g=1,comp=1}={}){
 const bx=cx+L*Math.sin(th),by=cy+L*Math.cos(th);
 let s=line(cx-60,cy,cx+60,cy,{color:C.dim,w:4})+line(cx,cy,cx,cy+L+20,{color:C.faint,w:2,dash:'6 6'});
 s+=line(cx,cy,bx,by,{color:C.dim,w:3});
 // arc for θ
 const pts=[];for(let i=0;i<=20;i++){const t=th*i/20;pts.push([cx+70*Math.sin(t),cy+70*Math.cos(t)]);}
 s+=draw(pts,1,{color:C.E,w:3})+label('θ',cx+95*Math.sin(th/2)+4,cy+95*Math.cos(th/2)+8,{size:28,color:C.E,weight:700});
 s+=ring(bx,by,20,{color:C.ink,w:2,fill:'#2a3a5a'});
 s+=arrow(bx,by,bx,by+110,{color:C.F,w:4,head:14})+label('mg',bx+12,by+100,{size:26,color:C.F,weight:700});
 // tangential component toward bottom: direction (-cos th, sin th)
 const tl=110*Math.sin(th);
 s+=fade(comp,arrow(bx,by,bx-tl*Math.cos(th),by+tl*Math.sin(th),{color:C.hi,w:5,head:14})+label('mg sinθ',bx-tl*Math.cos(th)-14,by+tl*Math.sin(th)+36,{size:24,color:C.hi,anchor:'end',weight:700}));
 return fade(g,s);
}

// 3D axes for the closing question
function axes3(p){
 const O=[300,360];let s=arrow(O[0],O[1],O[0]+260,O[1],{color:C.dim,w:3,head:12})+label('y',O[0]+275,O[1]+8,{size:24,color:C.dim});
 s+=arrow(O[0],O[1],O[0],O[1]-250,{color:C.dim,w:3,head:12})+label('z',O[0]-8,O[1]-262,{size:24,color:C.dim,anchor:'end'});
 s+=arrow(O[0],O[1],O[0]-150,O[1]+110,{color:C.dim,w:3,head:12})+label('x',O[0]-166,O[1]+122,{size:24,color:C.dim,anchor:'end'});
 const P=[O[0]+170,O[1]-160];
 s+=arrow(O[0],O[1],P[0],P[1],{color:C.x,w:6,head:16,g:seg(p,.05,.3)});
 s+=fade(seg(p,.2,.35),T('\\mathbf{r}(t)',P[0]+50,P[1]-6,{size:40,color:C.x}));
 const pts=[];for(let i=0;i<=30;i++){const u=i/30;pts.push([O[0]+60+200*u,O[1]-40-200*u+120*u*u]);}
 s+=fade(seg(p,.3,.45),draw(pts,1,{color:C.x,w:2,dash:'6 6'}));
 return s;
}

export const ytUmTaylor2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=bumpy(GB(),{q:seg(p,.3,.45),zoom:seg(p,.3,.5)});
  s+=card(690,70,460,160,label('なぜ 物理では',920,125,{size:26,color:C.dim,anchor:'middle'})+label('近似が「正義」？',920,190,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=card(690,260,460,170,label('どんな 谷底も 拡大すると',920,320,{size:26,color:C.ink,anchor:'middle'})+label('何に 見える？',920,390,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  const A=axes({x:80,y:450,w:520,h:360,xmin:-1.6,xmax:1.6,ymin:0,ymax:2.6,xticks:[],yticks:[],grid:false,xlabel:'x',xcolor:C.x});
  const f=x=>x*x,x0=1.05;
  let s=A.svg+A.plot(f,{from:-1.55,to:1.55,color:C.E,w:5})+label('U',A.X(1.55)+8,A.Y(f(1.55))+8,{size:28,color:C.E,weight:700});
  s+=fade(seg(p,.2,.35),line(A.X(x0-0.4),A.Y(f(x0)-0.8*x0),A.X(x0+0.4),A.Y(f(x0)+0.8*x0),{color:C.x,w:3})+label('傾き dU/dx ＞ 0',A.X(0.1),A.Y(2.3),{size:24,color:C.x}));
  s+=dot(A.X(x0),A.Y(f(x0)),9,C.E);
  s+=fade(seg(p,.45,.6),arrow(A.X(x0),A.Y(f(x0)),A.X(x0)-120,A.Y(f(x0)),{color:ok,w:5,head:16})+label('F',A.X(x0)-130,A.Y(f(x0))-14,{size:30,color:ok,anchor:'end',weight:700}));
  s+=card(680,110,470,290,label('位置エネルギー・中級 2/2',915,160,{size:24,color:C.dim,anchor:'middle'})+T(cF('F')+'=-\\dfrac{d'+cU('U')+'}{d'+cX('x')+'}',915,260,{size:56})
   +fade(seg(p,.6,.75),label('U の 坂を 下る 向き',915,355,{size:28,color:ok,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'recall2']:(p)=>{
  const A=axes({x:80,y:450,w:520,h:360,xmin:-1.6,xmax:1.6,ymin:0,ymax:2.6,xticks:[],yticks:[],grid:false,xlabel:'x',xcolor:C.x});
  const f=x=>x*x;
  let s=A.svg+A.plot(f,{from:-1.55,to:1.55,color:C.E,w:5})+label('0',A.X(0),A.Y(0)+32,{size:24,color:C.x,anchor:'middle'});
  [-1,1].forEach(x0=>{s+=dot(A.X(x0),A.Y(f(x0)),9,C.E)+fade(seg(p,.4,.55),arrow(A.X(x0),A.Y(f(x0)),A.X(x0)-x0*110,A.Y(f(x0)),{color:ok,w:5,head:16}));});
  s+=fade(seg(p,.1,.25),label('谷底 x ＝ 0',A.X(0),A.Y(1.75),{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(680,110,470,290,T(cU('U')+'=\\tfrac12\\,'+cH('k')+cX('x')+'^2',915,190,{size:50})
   +fade(seg(p,.35,.5),T(cF('F')+'=-'+cH('k')+cX('x'),915,290,{size:52}))
   +fade(seg(p,.55,.7),label('ずれに 比例して 底へ',915,365,{size:28,color:ok,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'other']:(p)=>{
  let s=bumpy(GB(),{q:1,zoom:seg(p,.1,.3)});
  s+=card(690,120,460,260,label('ばねではない でこぼこの U',920,180,{size:26,color:C.E,anchor:'middle'})
   +fade(seg(p,.4,.55),label('底の 近くで',920,255,{size:28,color:C.ink,anchor:'middle'})+label('力 は ずれに 比例？',920,315,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'tool']:(p)=>{
  const A=GB();let s=bumpy(A,{q:0});
  s+=fade(seg(p,.2,.35),line(A.X(bm.xm),A.Y(bm.Um),A.X(bm.xm),A.Y(0),{color:C.x,w:2,dash:'5 5'})+label('a',A.X(bm.xm)+16,A.Y(0)-12,{size:30,color:C.x,weight:700}));
  s+=card(680,100,480,300,label('前回：x ＝ a の まわり',920,150,{size:26,color:C.dim,anchor:'middle'})
   +T('f(x)\\approx f(a)+f\'(a)('+cX('x-a')+')',920,230,{size:36})+T('+\\,\\dfrac{f\'\'(a)}{2!}('+cX('x-a')+')^2+\\cdots',920,305,{size:36})
   +fade(seg(p,.5,.65),label('f を U に して 使う',920,375,{size:28,color:C.E,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 // ===== S2 谷底で展開する =====
 [K+'expand']:(p)=>{
  const t0=Ua('U(x)')+'\\;\\approx\\;',t1=Ua('U(a)'),t2='\\;+\\;'+Ua("U'(a)")+'('+cX('x-a')+')',t3='\\;+\\;\\tfrac12'+Ua("U''(a)")+'('+cX('x-a')+')^2',t4='\\;+\\cdots';
  const SZ=44,ws=[t0,t1,t2,t3,t4].map(t=>texWidth(t,SZ,false)),tot=ws.reduce((a,b)=>a+b,0);
  let x=600-tot/2,s='',cx=[];
  [t0,t1,t2,t3,t4].forEach((t,i)=>{s+=T(t,x+ws[i]/2,130,{size:SZ});cx.push(x+ws[i]/2);x+=ws[i];});
  s+=fade(seg(p,.1,.25),label('底の 高さ',cx[1],210,{size:26,color:C.E,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),label('傾き × ずれ',cx[2],210,{size:26,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('曲がり × ずれ²',cx[3],210,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),card(300,290,600,150,T('\\tfrac12=\\dfrac{1}{2!}',600,370,{size:52}),1));
  return s;
 },
 [K+'flat']:(p)=>{
  const A=GZ();let s=zoomValley(A,{tan:seg(p,.1,.3)});
  s+=card(660,110,500,290,fade(seg(p,.1,.25),T(Ua("U'(a)")+'=0',910,200,{size:54}))+fade(seg(p,.1,.25),label('底では グラフが 水平',910,260,{size:26,color:C.x,anchor:'middle'}))
   +fade(seg(p,.5,.65),T(cF('F')+'=-'+Ua("U'(a)")+'=0',910,330,{size:44})+label('つり合いの 位置',910,385,{size:28,color:ok,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'drop']:(p)=>{
  const t0=Ua('U(x)')+'\\approx'+Ua('U(a)'),t2='+'+Ua("U'(a)")+'('+cX('x-a')+')',t3='+\\tfrac12'+Ua("U''(a)")+'('+cX('x-a')+')^2+\\cdots';
  const SZ=44,w0=texWidth(t0,SZ,false),w2=texWidth(t2,SZ,false),w3=texWidth(t3,SZ,false),x0=600-(w0+w2+w3)/2;
  let s=T(t0,x0+w0/2,110,{size:SZ})+fade(1-.6*seg(p,.15,.3),T(t2,x0+w0+w2/2,110,{size:SZ}))+T(t3,x0+w0+w2+w3/2,110,{size:SZ});
  s+=fade(seg(p,.05,.2),line(x0+w0,125,x0+w0+w2,85,{color:bad,w:5})+label('U′(a) ＝ 0 で 消える',x0+w0+w2/2,180,{size:26,color:bad,anchor:'middle'}));
  const res=Ua('U')+'\\approx'+Ua('U(a)')+'+\\tfrac12'+Ua("U''(a)")+'('+cX('x-a')+')^2',wr=texWidth(res,54,false);
  s+=fade(seg(p,.3,.45),T(res,600,300,{size:54})+highlight(600-wr/2-24,240,wr+48,110,1));
  s+=fade(seg(p,.65,.8),label('3次より 先：底の 近くでは さらに 小さい → 捨てる',600,430,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'bowl']:(p)=>{
  const A=GZ();let s=zoomValley(A,{par:seg(p,.3,.55)});
  s+=card(660,110,500,290,T(Ua("U''(a)")+'>0',910,200,{size:54})+label('谷（仮定）',910,260,{size:28,color:C.E,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('上に 開いた 放物線',910,330,{size:30,color:C.hi,anchor:'middle',weight:700})+label('（黄色の 点線）',910,375,{size:24,color:C.dim,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'force']:(p)=>{
  let s=T(cF('F')+'=-\\dfrac{d}{d'+cX('x')+'}\\Big['+Ua('U(a)')+'+\\tfrac12'+Ua("U''(a)")+'('+cX('x-a')+')^2\\Big]',600,140,{size:48});
  s+=fade(seg(p,.5,.65),T('\\dfrac{d}{d'+cX('x')+'}'+Ua('U(a)')+'=0',400,330,{size:48})+label('（定数）',400,410,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'force2']:(p)=>{
  let s=T('\\dfrac{d}{d'+cX('x')+'}('+cX('x-a')+')^2=2('+cX('x-a')+')',600,110,{size:46});
  s+=fade(seg(p,.2,.35),T(cF('F')+'\\approx-\\tfrac12\\,'+Ua("U''(a)")+'\\cdot 2('+cX('x-a')+')',600,240,{size:50}));
  const w=texWidth(cF('F')+'\\approx-\\tfrac12\\,',50,false),wf=texWidth(cF('F')+'\\approx-\\tfrac12\\,'+Ua("U''(a)")+'\\cdot 2('+cX('x-a')+')',50,false),xl=600-wf/2;
  const w2=texWidth(cF('F')+'\\approx-\\tfrac12\\,'+Ua("U''(a)")+'\\cdot ',50,false);
  s+=fade(seg(p,.4,.5),line(xl+w-34,262,xl+w-6,212,{color:bad,w:4})+line(xl+w2+10,262,xl+w2+36,212,{color:bad,w:4}));
  const res=cF('F')+'\\approx-'+Ua("U''(a)")+'('+cX('x-a')+')',wr=texWidth(res,62,false);
  s+=fade(seg(p,.55,.7),T(res,600,390,{size:62})+highlight(600-wr/2-26,330,wr+52,110,1));
  return s;
 },
 [K+'spring']:(p)=>{
  let s=card(80,90,480,210,label('ばね',320,140,{size:28,color:C.dim,anchor:'middle'})+T(cF('F')+'=-'+cH('k')+'\\,'+cX('x'),320,230,{size:54}),seg(p,.02,.15));
  s+=card(640,90,480,210,label('谷底の 近く',880,140,{size:28,color:C.dim,anchor:'middle'})+T(cF('F')+'\\approx-'+cH("U''(a)")+'\\,('+cX('x-a')+')',880,230,{size:46}),seg(p,.1,.25));
  s+=fade(seg(p,.4,.55),label('ずれ：x ↔ x − a',600,370,{size:32,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('ばね定数：k ↔ U″(a)',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'result']:(p)=>{
  const A=GZ({x:60,w:460});let s=zoomValley(A,{par:1});
  s+=card(600,100,560,300,label('どんな 谷底も、近くでは',880,160,{size:28,color:C.ink,anchor:'middle'})
   +label('ばね定数 U″(a) の ばね',880,230,{size:36,color:C.hi,anchor:'middle',weight:700})
   +T(cF('F')+'\\approx-'+cH("U''(a)")+'\\,('+cX('x-a')+')',880,310,{size:40})
   +fade(seg(p,.5,.65),label('近似つきの 導いた 結果',880,375,{size:26,color:ok,anchor:'middle',weight:700})),seg(p,.02,.15),ok);
  return s;
 },
 // ===== S3 U = x³ − 3x =====
 [K+'ex']:(p)=>{
  let s=ugraph(GU(),{g:seg(p,.05,.5)});
  s+=card(680,120,470,260,T(cU('U')+'='+cX('x')+'^3-3'+cX('x'),915,210,{size:54})+label('U：J、x：m',915,300,{size:30,color:C.dim,anchor:'middle'}),seg(p,.1,.25));
  return s;
 },
 [K+'ex2']:(p)=>{
  const A=GU();let s=ugraph(A,{marks:seg(p,.55,.7)});
  s+=fade(seg(p,.55,.7),line(A.X(0.6),A.Y(-2),A.X(1.4),A.Y(-2),{color:C.x,w:3})+line(A.X(-1.4),A.Y(2),A.X(-0.6),A.Y(2),{color:C.x,w:3}));
  s+=card(680,90,470,340,T(cU("U'")+'=3'+cX('x')+'^2-3',915,160,{size:46})
   +fade(seg(p,.25,.4),T('3'+cX('x')+'^2-3=0',915,250,{size:44}))
   +fade(seg(p,.45,.6),T(cX('x')+'^2=1\\;\\Rightarrow\\;'+cX('x')+'=\\pm1',915,340,{size:44}))
   +fade(seg(p,.6,.75),label('傾き 0 の 点',915,400,{size:26,color:C.x,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'ex3']:(p)=>{
  const A=GU();let s=ugraph(A,{marks:1});
  s+=fade(seg(p,.3,.45),label('谷',A.X(1),A.Y(-2)+44,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('山',A.X(-1),A.Y(2)-22,{size:30,color:bad,anchor:'middle',weight:700}));
  s+=card(680,90,470,340,T(cU("U''")+'=6'+cX('x'),915,160,{size:50})
   +fade(seg(p,.2,.35),T(cU("U''(1)")+'=6>0',915,260,{size:42})+label('→ 谷',915,310,{size:28,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),T(cU("U''(-1)")+'=-6<0',915,370,{size:42})+label('→ 山',915,415,{size:28,color:bad,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'ex4']:(p)=>{
  const A=GU();let s=ugraph(A,{marks:1,par:seg(p,.6,.8)});
  s+=card(680,90,470,340,T(cU('U(1)')+'=1-3=-2',915,160,{size:44})
   +fade(seg(p,.3,.45),T('\\tfrac12\\times'+cH('6')+'=3',915,250,{size:44}))
   +fade(seg(p,.55,.7),T(cU('U')+'\\approx-2+3('+cX('x')+'-1)^2',915,345,{size:42})+label('（黄色の 点線）',915,400,{size:24,color:C.hi,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'ex5']:(p)=>{
  const A=GU();let s=ugraph(A,{marks:1,par:1});
  s+=fade(seg(p,.1,.3),ring(A.X(1),A.Y(-2),46,{color:ok,w:3}));
  s+=fade(seg(p,.4,.6),ring(A.X(1.95),A.Y(U3(1.95))+10,50,{color:bad,w:3,dash:'6 6'})+ring(A.X(0),A.Y(0)+10,46,{color:bad,w:3,dash:'6 6'}));
  s+=card(680,120,470,260,fade(seg(p,.1,.3),label('x ＝ 1 の 近く：ほぼ 重なる',915,200,{size:28,color:ok,anchor:'middle',weight:700}))
   +fade(seg(p,.4,.6),label('離れるほど 外れる',915,290,{size:28,color:bad,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'k']:(p)=>{
  let s=T('k='+cU("U''(1)")+'=6\\ \\mathrm{N/m}',600,130,{size:60,auto:false});
  s+=fade(seg(p,.4,.55),T('\\dfrac{\\mathrm{J}}{\\mathrm{m}\\cdot\\mathrm{m}}=\\dfrac{\\mathrm{N\\cdot m}}{\\mathrm{m}\\cdot\\mathrm{m}}=\\mathrm{N/m}',600,300,{size:54}));
  s+=fade(seg(p,.4,.55),label('（J ＝ N·m）',600,410,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'f11']:(p)=>{
  const A=GF();let s=fgraph(A,{tru:seg(p,.02,.3)});
  s+=fade(seg(p,.2,.35),line(A.X(1),A.Y(-7),A.X(1),A.Y(4),{color:C.x,w:2,dash:'5 5'})+label('底 x ＝ 1',A.X(1)-8,A.Y(3.3),{size:22,color:C.x,anchor:'end'}));
  s+=fade(seg(p,.5,.65),dot(A.X(1.1),A.Y(F3(1.1)),9,C.F)+label('−0.63',A.X(1.1)-14,A.Y(F3(1.1))+36,{size:24,color:C.F,weight:700,anchor:'end'}));
  s+=card(680,100,480,300,label('x ＝ 1.1（ずれ 0.1 m）',920,150,{size:26,color:C.x,anchor:'middle'})
   +T(cF('F')+'=-'+cU("U'")+'=3-3'+cX('x')+'^2',920,225,{size:40})
   +fade(seg(p,.45,.6),T('-(3\\times1.21-3)',920,300,{size:40}))
   +fade(seg(p,.6,.75),T('='+cF('-0.63\\ \\mathrm{N}'),920,365,{size:44})),seg(p,.02,.12));
  return s;
 },
 [K+'f11b']:(p)=>{
  const A=GF();let s=fgraph(A,{spr:seg(p,.02,.25)});
  s+=line(A.X(1),A.Y(-7),A.X(1),A.Y(4),{color:C.x,w:2,dash:'5 5'});
  s+=dot(A.X(1.1),A.Y(F3(1.1)),9,C.F)+fade(seg(p,.2,.35),dot(A.X(1.1),A.Y(FS(1.1)),9,C.hi));
  s+=card(680,80,480,360,label('ばね近似：k ＝ 6 N/m',920,130,{size:26,color:C.hi,anchor:'middle'})
   +T('-6\\times0.1='+cH('-0.6\\ \\mathrm{N}'),920,200,{size:42})
   +fade(seg(p,.4,.55),label('差',750,283,{size:30,color:bad,weight:700})+T('0.63-0.6='+cR('0.03\\ \\mathrm{N}'),950,275,{size:36}))
   +fade(seg(p,.6,.75),T('\\dfrac{0.03}{0.63}\\approx'+cR('5\\%'),920,375,{size:38})),seg(p,.02,.12));
  return s;
 },
 [K+'f15']:(p)=>{
  const A=GF();let s=fgraph(A,{spr:1});
  s+=line(A.X(1),A.Y(-7),A.X(1),A.Y(4),{color:C.x,w:2,dash:'5 5'});
  s+=fade(seg(p,.05,.2),dot(A.X(1.5),A.Y(F3(1.5)),9,C.F)+dot(A.X(1.5),A.Y(FS(1.5)),9,C.hi)+line(A.X(1.5),A.Y(F3(1.5)),A.X(1.5),A.Y(FS(1.5)),{color:bad,w:5}));
  s+=card(680,80,480,360,label('x ＝ 1.5（ずれ 0.5 m）',920,130,{size:26,color:C.x,anchor:'middle'})
   +fade(seg(p,.1,.25),label('本当',770,205,{size:28,color:C.F,weight:700})+T(cF('-3.75\\ \\mathrm{N}'),1010,202,{size:40}))
   +fade(seg(p,.3,.45),label('近似',770,270,{size:28,color:C.hi,weight:700})+T(cH('-3.0\\ \\mathrm{N}'),1010,267,{size:40}))
   +fade(seg(p,.55,.7),T('\\dfrac{0.75}{3.75}='+cR('20\\%'),920,375,{size:38})),seg(p,.02,.12));
  return s;
 },
 [K+'why']:(p)=>{
  let s=T(cX('s')+'='+cX('x')+'-1\\qquad('+cX('x')+'=1+'+cX('s')+')',600,80,{size:40});
  s+=fade(seg(p,.1,.25),T(cU('U')+'=(1+'+cX('s')+')^3-3(1+'+cX('s')+')',600,180,{size:44}));
  s+=fade(seg(p,.3,.45),T('=1+3'+cX('s')+'+3'+cX('s')+'^2+'+cX('s')+'^3-3-3'+cX('s'),600,280,{size:44}));
  const res=cU('U')+'=-2+3'+cX('s')+'^2+'+cR(cX('s')+'^3'),w=texWidth(res,54,false);
  s+=fade(seg(p,.55,.7),T(res,600,400,{size:54})+highlight(600-w/2-24,345,w+48,100,1));
  s+=fade(seg(p,.75,.9),label('近似なしの 等号',1010,470,{size:24,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why2']:(p)=>{
  let s=T(cF('F')+'=-\\dfrac{d'+cU('U')+'}{d'+cX('s')+'}=-6'+cX('s')+'-'+cR('3'+cX('s')+'^2'),600,110,{size:50});
  s+=fade(seg(p,.1,.25),label('ばね近似',470,190,{size:26,color:C.hi,anchor:'middle',weight:700})+label('捨てた s³ の 力',790,190,{size:26,color:bad,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),card(190,240,820,220,
   label('s ＝ 0.1：−3 × 0.01 ＝ −0.03 N',600,310,{size:32,color:C.ink,anchor:'middle'})
   +label('s ＝ 0.5：−3 × 0.25 ＝ −0.75 N',600,370,{size:32,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('→ さっきの 差と ぴったり 一致',600,430,{size:30,color:ok,anchor:'middle',weight:700}))));
  return s;
 },
 [K+'hill']:(p)=>{
  const A=GU();let s=ugraph(A,{marks:1});
  const x0=-1,Y=A.Y(2);
  s+=fade(seg(p,.3,.5),dot(A.X(-1.35),A.Y(U3(-1.35)),8,C.x)+arrow(A.X(-1.35),A.Y(U3(-1.35)),A.X(-1.35)-80,A.Y(U3(-1.35)),{color:ok,w:5,head:14})
   +dot(A.X(-0.65),A.Y(U3(-0.65)),8,C.x)+arrow(A.X(-0.65),A.Y(U3(-0.65)),A.X(-0.65)+80,A.Y(U3(-0.65)),{color:ok,w:5,head:14}));
  s+=label('山',A.X(x0),Y-22,{size:30,color:bad,anchor:'middle',weight:700});
  s+=card(680,90,470,340,T(cU("U''(-1)")+'=-6',915,160,{size:46})
   +fade(seg(p,.15,.3),T(cF('F')+'\\approx-(-6)('+cX('x')+'+1)',915,250,{size:40})+T('=+6('+cX('x')+'+1)',915,320,{size:42}))
   +fade(seg(p,.55,.7),label('ずれた 向きへ 押し出す',915,385,{size:26,color:bad,anchor:'middle',weight:700})+label('→ 不安定',915,420,{size:26,color:bad,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 // ===== S4 なぜ近似が「正義」か =====
 [K+'pend']:(p)=>{
  let s=pendulum(300,90,280,0.5,{comp:seg(p,.2,.35)});
  s+=card(640,110,520,290,label('単振動・中級 1/1',900,160,{size:24,color:C.dim,anchor:'middle'})
   +label('戻す 力',900,215,{size:28,color:C.hi,anchor:'middle',weight:700})
   +T('-mg\\sin\\theta',900,280,{size:48})
   +fade(seg(p,.5,.65),T('\\approx-mg\\,\\theta',900,355,{size:48})),seg(p,.02,.12));
  return s;
 },
 [K+'pend2']:(p)=>{
  let s=T('\\sin\\theta=\\theta'+cR('\\;-\\;\\dfrac{\\theta^3}{6}+\\cdots'),600,120,{size:56});
  s+=fade(seg(p,.1,.25),label('θ ＝ 0 の まわりで 展開',600,220,{size:28,color:C.E,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('1次で 止める：赤は 捨てる',600,275,{size:28,color:bad,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),card(250,320,700,130,label('真下の 底の 近くで',600,370,{size:26,color:C.ink,anchor:'middle'})+label('力 ∝ ずれ θ',600,420,{size:32,color:C.hi,anchor:'middle',weight:700})));
  return s;
 },
 [K+'same']:(p)=>{
  const rows=[['ばね','\\dfrac{d^2'+cX('x')+'}{dt^2}=-\\dfrac{'+cH('k')+'}{m}\\,'+cX('x')],['振り子','\\dfrac{d^2\\theta}{dt^2}=-\\dfrac{g}{l}\\,\\theta'],['谷底の 近く','\\dfrac{d^2'+cX('x')+'}{dt^2}\\approx-\\dfrac{'+cH("U''(a)")+'}{m}\\,('+cX('x-a')+')']];
  let s=label('加速度 ＝ −（正の 定数）× ずれ',600,70,{size:32,color:C.hi,anchor:'middle',weight:700});
  rows.forEach(([n,t],i)=>{s+=fade(seg(p,.1+i*.2,.2+i*.2),card(110,105+i*130,980,115,label(n,150,172+i*130,{size:28,color:C.dim})+T(t,720,165+i*130,{size:40})));});
  return s;
 },
 [K+'solve']:(p)=>{
  let s=card(90,90,1020,150,T('\\dfrac{d^2\\theta}{dt^2}=-\\dfrac{g}{l}\\sin\\theta',420,168,{size:46})+label('簡単な 式では 解けない',850,176,{size:28,color:bad,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=fade(seg(p,.4,.55),arrow(420,250,420,300,{color:C.hi,w:4,head:12})+label('sinθ → θ（1手）',480,285,{size:26,color:C.hi}));
  s+=card(90,310,1020,150,T('\\dfrac{d^2\\theta}{dt^2}\\approx-\\dfrac{g}{l}\\,\\theta',420,388,{size:46})+label('解ける（単振動）',850,396,{size:28,color:ok,anchor:'middle',weight:700}),seg(p,.5,.65),ok);
  return s;
 },
 [K+'why3']:(p)=>{
  let s=card(180,80,840,170,label('捨てた 項を 無視して よいのは',600,145,{size:30,color:C.ink,anchor:'middle'})+label('なぜ？',600,210,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.35,.5),T(cF('-0.63\\ \\mathrm{N}'),420,350,{size:48})+label('と',600,360,{size:30,color:C.dim,anchor:'middle'})+T(cH('-0.6\\ \\mathrm{N}'),780,350,{size:48})+label('本当',420,420,{size:24,color:C.F,anchor:'middle'})+label('ばね近似',780,420,{size:24,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'meter']:(p)=>{
  const X=v=>150+900*(v+0.9)/0.6; // −0.9 … −0.3
  let s=label('目盛り 0.1 N 刻みの 力の 計り',600,80,{size:28,color:C.dim,anchor:'middle'});
  s+=rect(120,150,960,90,{fill:'#1a2745',fo:1,stroke:C.faint,sw:2,rx:10});
  for(let v=-0.9;v<=-0.29;v+=0.1){const x=X(v);s+=line(x,150,x,200,{color:C.ink,w:3})+label(v.toFixed(1),x,275,{size:26,color:C.ink,anchor:'middle'});}
  s+=fade(seg(p,.2,.35),line(X(-0.63),140,X(-0.63),250,{color:C.F,w:4})+label('−0.63',X(-0.63),125,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),line(X(-0.6),140,X(-0.6),250,{color:C.hi,w:4,dash:'6 5'})+label('−0.6',X(-0.6)+60,125,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('どちらも 読みは −0.6 N',600,380,{size:34,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'meter2']:(p)=>{
  let s=card(120,70,960,160,label('捨てた 項 0.03 N ＜ 読みの ずれ（最大 0.05 N）',600,135,{size:30,color:C.ink,anchor:'middle'})
   +label('→ 信頼できる 桁は 変わらない',600,195,{size:30,color:ok,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(120,270,960,160,label('しかも',600,325,{size:26,color:C.dim,anchor:'middle'})
   +label('捨てた 項の 大きさ ＝ 差の 見積もり',600,385,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'justice']:(p)=>{
  let s=card(160,70,880,140,label('近似 ＝ 誤差を 管理した 技術',600,155,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.4,.55),label('① 解ける 方程式に なる（振り子）',600,290,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),label('② 測定の 誤差より 小さい 項だけ 捨てる',600,360,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('→ 物理で 近似が「正義」である 理由',600,440,{size:30,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 使えないとき・次の問い =====
 [K+'fail']:(p)=>{
  const A=GF();let s=fgraph(A,{spr:1});
  s+=line(A.X(1),A.Y(-7),A.X(1),A.Y(4),{color:C.x,w:2,dash:'5 5'});
  s+=dot(A.X(1.5),A.Y(F3(1.5)),9,C.F)+dot(A.X(1.5),A.Y(FS(1.5)),9,C.hi)+line(A.X(1.5),A.Y(F3(1.5)),A.X(1.5),A.Y(FS(1.5)),{color:bad,w:5});
  s+=card(680,120,470,260,label('① ずれが 大きい',915,190,{size:34,color:bad,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('x ＝ 1.5 で 差 20%',915,270,{size:30,color:C.ink,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'flat4']:(p)=>{
  const A=axes({x:70,y:450,w:560,h:360,xmin:-1.3,xmax:1.3,ymin:0,ymax:1.7,xticks:[-1,1],yticks:[1],grid:true,xlabel:'x',xcolor:C.x});
  let s=A.svg+fade(seg(p,.02,.2),A.plot(x=>x*x,{from:-1.28,to:1.28,color:C.hi,w:3,dash:'9 7'})+label('x²',A.X(-1.22)+14,A.Y(1.49)+6,{size:26,color:C.hi,weight:700}));
  s+=A.plot(x=>x**4,{from:-1.14,to:1.14,color:C.E,w:5})+label('x⁴',A.X(1.14)+12,A.Y(1.69)+30,{size:28,color:C.E,weight:700});
  s+=card(680,100,470,300,label('② 平らな 底 U ＝ x⁴',915,160,{size:30,color:bad,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),T(cU("U'")+'=4'+cX('x')+'^3,\\;\\;'+cU("U''")+'=12'+cX('x')+'^2',915,245,{size:36}))
   +fade(seg(p,.6,.75),T(cU("U'(0)")+'='+cU("U''(0)")+'=0',915,330,{size:42})),seg(p,.02,.12));
  return s;
 },
 [K+'flat4b']:(p)=>{
  const A=axes({x:70,y:450,w:560,h:360,xmin:-1.3,xmax:1.3,ymin:0,ymax:1.7,xticks:[-1,1],yticks:[1],grid:true,xlabel:'x',xcolor:C.x});
  let s=A.svg+A.plot(x=>x*x,{from:-1.28,to:1.28,color:C.hi,w:3,dash:'9 7'})+A.plot(x=>x**4,{from:-1.14,to:1.14,color:C.E,w:5});
  s+=fade(seg(p,.2,.4),rect(A.X(-0.45),A.Y(0.25),A.X(0.45)-A.X(-0.45),A.Y(0)-A.Y(0.25),{fill:'none',fo:0,stroke:bad,sw:3,rx:8})+label('底が 平ら',A.X(0),A.Y(0.25)-14,{size:24,color:bad,anchor:'middle',weight:700}));
  s+=card(680,100,470,300,label('2次の 項 ＝ 0',915,170,{size:32,color:C.ink,anchor:'middle',weight:700})
   +label('→ ばね定数 0',915,235,{size:32,color:bad,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('放物線ではなく',915,310,{size:28,color:C.ink,anchor:'middle'})+label('x⁴ の 形の まま',915,360,{size:30,color:C.E,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'fail3']:(p)=>{
  const A=GU();let s=ugraph(A,{marks:1});
  s+=dot(A.X(-1.35),A.Y(U3(-1.35)),8,C.x)+arrow(A.X(-1.35),A.Y(U3(-1.35)),A.X(-1.35)-80,A.Y(U3(-1.35)),{color:ok,w:5,head:14})
   +dot(A.X(-0.65),A.Y(U3(-0.65)),8,C.x)+arrow(A.X(-0.65),A.Y(U3(-0.65)),A.X(-0.65)+80,A.Y(U3(-0.65)),{color:ok,w:5,head:14});
  s+=label('山',A.X(-1),A.Y(2)-22,{size:30,color:bad,anchor:'middle',weight:700});
  s+=card(680,120,470,260,label('③ U″ ＜ 0 の 山',915,190,{size:34,color:bad,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('引き戻さず 押し出す',915,270,{size:30,color:C.ink,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'sum']:(p)=>{
  let s='';
  const rows=[['条件',T(cU("U'(a)")+'=0,\\quad'+cU("U''(a)")+'>0',800,135,{size:38}),C.E],['導いた 結果',T(cF('F')+'\\approx-'+cH("U''(a)")+'('+cX('x-a')+')',800,265,{size:38}),ok],['範囲',label('底の 近く（ずれが 小さい）だけ',1040,405,{size:30,color:C.ink,anchor:'end'}),C.t]];
  rows.forEach(([a,b,col],i)=>{const y=125+i*135;s+=card(120,y-55,960,115,label(a,160,y+12,{size:28,color:col,weight:700})+b,seg(p,.02+i*.25,.12+i*.25));});
  return s;
 },
 [K+'next']:(p)=>{
  let s=line(150,260,1050,260,{color:C.dim,w:3});
  for(let v=0;v<=9;v++)s+=line(150+v*100,250,150+v*100,270,{color:C.dim,w:2});
  const x=mix(300,800,seg(p,.1,.8));
  s+=dot(x,260,16,C.x)+label('x',x,225,{size:28,color:C.x,anchor:'middle',weight:700});
  s+=label('1本の 数直線の 上',600,380,{size:34,color:C.ink,anchor:'middle',weight:700});
  return s;
 },
 [K+'next2']:(p)=>{
  let s=axes3(p);
  s+=card(660,110,500,290,label('3次元の 位置の 矢印',910,150,{size:28,color:C.x,anchor:'middle',weight:700})
   +T('\\dfrac{d\\mathbf{r}}{dt}=\\;?',910,255,{size:50})
   +label('速度・加速度は どんな 矢印？',910,350,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
};
