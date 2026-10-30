// YouTube シリーズ「振動の方程式・上級 1/1」(ys-um-shm-ode-1) — 図。Stage 1200×515.
// 色：位置 x・ずれ s・底の位置 a 水色、速度 v 紫、力 F 緑、時間 t 金、エネルギー（U 濃い橙・K 薄い橙）、ばね定数 k・U″(a)・強調 黄、誤り・山 赤。
import {C,seg,fade,mix,label,line,rect,dot,ring,arrow,highlight,axes,texWidth,draw,wall,spring as coil} from './anim.mjs';
import {card,T,cc,cX,cH,cV,cT} from './yt1-um-sum-to-integral-1-diagrams.mjs';

const K='um-shm-ode-1:';
const ok=C.F,bad=C.a,CK='#ffd9b0';
const cU=s=>cc(C.E,s),cF=s=>cc(C.F,s),cR=s=>cc(bad,s),cK=s=>cc(CK,s);
const d2=v=>'\\dfrac{d^2'+v+'}{dt^2}';
const L=(s,x,y,o={})=>label(s,x,y,{size:28,color:C.ink,anchor:'middle',...o});

// ---- spring + block. x in units of amplitude (−1..1), 1 unit = 120 px ----
function springBox(x,{cx=330,y=330,g=1,F=0,tag=1,unit=120}={}){
 const bx=cx+unit*x;
 let s=wall(70,y-90,y+10)+line(70,y+10,cx+unit*1.6,y+10,{color:C.dim,w:3});
 s+=coil(70,bx-38,y-34,{coils:9,amp:16,color:C.dim,w:3});
 s+=rect(bx-38,y-72,76,72,{fill:C.x,fo:.3,stroke:C.x,sw:2,rx:8})+label('m',bx,y-26,{size:28,color:C.ink,anchor:'middle',weight:700});
 s+=line(cx,y+18,cx,y+40,{color:C.dim,w:2})+fade(tag,label('0',cx,y+70,{size:24,color:C.dim,anchor:'middle'}));
 if(F)s+=fade(F,Math.abs(x)>0.05?arrow(bx,y-90,bx-x*90,y-90,{color:ok,w:5,head:14})+label('F',bx-x*50,y-104,{size:26,color:ok,anchor:'middle',weight:700}):'');
 return fade(g,s);
}
// ---- energy bars: Kf+Uf = fraction of E (total). ----
function bars(Kf,Uf,{x=760,y=430,h=300,g=1,tot=1,vals=null}={}){
 let s=line(x-30,y,x+330,y,{color:C.dim,w:2});
 const bar=(i,f,col,name,fo=.85)=>{const X=x+i*120;return rect(X,y-h*f,80,h*f,{fill:col,fo,stroke:col,sw:2,rx:4})+label(name,X+40,y+34,{size:26,color:col,anchor:'middle',weight:700});};
 s+=bar(0,Uf,C.E,'U')+bar(1,Kf,CK,'K');
 // total: stacked U + K
 const X=x+240;
 s+=fade(tot,rect(X,y-h*Uf,80,h*Uf,{fill:C.E,fo:.85,stroke:C.E,sw:2,rx:4})+rect(X,y-h*(Uf+Kf),80,h*Kf,{fill:CK,fo:.85,stroke:CK,sw:2,rx:4})
  +label('K＋U',X+40,y+34,{size:26,color:C.hi,anchor:'middle',weight:700})+line(X-14,y-h,X+94,y-h,{color:C.hi,w:3,dash:'7 6'}));
 if(vals)s+=label(vals[0],x+40,y-h*Uf-12,{size:24,color:C.E,anchor:'middle',weight:700})+label(vals[1],x+160,y-h*Kf-12,{size:24,color:CK,anchor:'middle',weight:700})+fade(tot,label(vals[2],X+40,y-h-12,{size:24,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}

// ---- generic bumpy U with a valley (same shape as 近似・上級 2/2) ----
const B=x=>0.6*Math.sin(1.7*x)+0.18*x*x;
const bm=(()=>{let xm=-0.85,best=1e9;for(let u=-2;u<0.5;u+=0.0005){const v=B(u);if(v<best){best=v;xm=u;}}const h=1e-3;return {xm,Um:B(xm),U2:(B(xm+h)-2*B(xm)+B(xm-h))/(h*h)};})();
const GZ=(o={})=>axes({x:70,y:450,w:520,h:360,xmin:bm.xm-1.3,xmax:bm.xm+1.3,ymin:bm.Um-0.2,ymax:bm.Um+1.4,xticks:[],yticks:[],grid:false,...o});
const parB=x=>bm.Um+0.5*bm.U2*(x-bm.xm)**2;
function zoomValley(A,{par=1,F=0}={}){
 let s=A.svg+A.plot(B,{from:bm.xm-1.25,to:bm.xm+1.25,color:C.E,w:5});
 s+=fade(par,A.plot(parB,{from:bm.xm-0.75,to:bm.xm+0.75,color:C.hi,w:3,dash:'9 7'}));
 s+=dot(A.X(bm.xm),A.Y(bm.Um),9,C.E);
 s+=line(A.X(bm.xm),A.Y(bm.Um),A.X(bm.xm),452,{color:C.x,w:2,dash:'5 5'})+label('a',A.X(bm.xm),482,{size:30,color:C.x,anchor:'middle',weight:700});
 s+=label('U',A.X(bm.xm+1.2)-6,A.Y(B(bm.xm+1.2))-14,{size:28,color:C.E,weight:700});
 if(F){[-0.45,0.45].forEach(d=>{const X=A.X(bm.xm+d),Y=A.Y(B(bm.xm+d));s+=fade(F,dot(X,Y,8,C.x)+arrow(X,Y-30,X-Math.sign(d)*(A.X(1)-A.X(0))*0.25,Y-30,{color:ok,w:5,head:14}));});}
 return s;
}

// ---- U = x³ − 3x ----
const U3=x=>x*x*x-3*x,P3=x=>-2+3*(x-1)**2,F3=x=>3-3*x*x,FS=x=>-6*(x-1);
const GU=(o={})=>axes({x:70,y:460,w:560,h:400,xmin:-2.3,xmax:2.4,ymin:-4.5,ymax:4.5,xticks:[-2,-1,1,2],yticks:[-4,-2,2,4],grid:true,xlabel:'x',xcolor:C.x,...o});
function ugraph(A,{par=0,valley=1,hill=0}={}){
 let s=A.svg+A.plot(U3,{from:-2.15,to:2.2,color:C.E,w:5});
 s+=label('U',A.X(2.2)+10,A.Y(U3(2.2))+10,{size:28,color:C.E,weight:700});
 s+=fade(par,A.plot(P3,{from:-0.15,to:2.2,color:C.hi,w:3,dash:'9 7'}));
 s+=fade(valley,dot(A.X(1),A.Y(-2),9,C.x)+label('谷',A.X(1),A.Y(-2)+44,{size:28,color:C.hi,anchor:'middle',weight:700}));
 s+=fade(hill,dot(A.X(-1),A.Y(2),9,C.x)+label('山',A.X(-1),A.Y(2)-22,{size:28,color:bad,anchor:'middle',weight:700}));
 return s;
}

// ---- x(t) graph ----
const GX=(o={})=>axes({x:70,y:300,w:540,h:220,xmin:0,xmax:7,ymin:-1.25,ymax:1.25,xticks:[],yticks:[],grid:false,xlabel:'t',xcolor:C.t,...o});

// projectile for the closing question
function proj(p){
 const X0=110,Y0=430,s0=120,pr=t=>[4*t,5*t-5*t*t];
 let s=line(X0-20,Y0,X0+560,Y0,{color:C.dim,w:3});
 s+=draw(Array.from({length:81},(_,i)=>{const q=pr(i/80);return [X0+s0*q[0],Y0-s0*q[1]*1.6];}),seg(p,.05,.5),{color:C.x,w:4});
 s+=fade(seg(p,.4,.55),arrow(X0,Y0,X0+80,Y0-160,{color:C.v,w:5,head:16})+label('𝐯₀',X0+60,Y0-170,{size:28,color:C.v,weight:700}));
 s+=fade(seg(p,.5,.65),arrow(X0+240,Y0-170,X0+240,Y0-70,{color:ok,w:5,head:16})+label('m𝐠',X0+256,Y0-100,{size:28,color:ok,weight:700}));
 return s;
}

export const ytUmShmOde1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=springBox(Math.cos(2*Math.PI*2*p),{F:1});
  s+=card(660,90,500,300,label('前回の 最後の 問い',910,140,{size:26,color:C.dim,anchor:'middle'})
   +T(d2(cX('x'))+'=-\\omega^2'+cX('x'),910,230,{size:52})
   +fade(seg(p,.5,.65),label('なぜ どこにでも 現れる？',910,335,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15),C.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=springBox(Math.cos(2*Math.PI*(2+p)),{F:1});
  s+=card(660,90,500,300,label('前回の 最後の 問い',910,140,{size:26,color:C.dim,anchor:'middle'})
   +T(d2(cX('x'))+'=-\\omega^2'+cX('x'),910,230,{size:52})
   +label('なぜ どこにでも 現れる？',910,310,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),label('どんな 条件で 成り立たない？',910,360,{size:32,color:C.hi,anchor:'middle',weight:700})),1,C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=springBox(0.7,{F:1,cx:300});
  s+=card(600,60,570,400,label('初級・中級',885,105,{size:24,color:C.dim,anchor:'middle'})
   +T(cF('F')+'=-'+cH('k')+cX('x'),885,160,{size:42})
   +fade(seg(p,.2,.35),T('m'+d2(cX('x'))+'=-'+cH('k')+cX('x'),885,245,{size:40})+label('ma＝F に 入れる',885,318,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.55,.7),T(d2(cX('x'))+'=-\\omega^2'+cX('x')+',\\quad \\omega^2=\\dfrac{'+cH('k')+'}{m}',885,405,{size:38})),seg(p,.02,.12));
  return s;
 },
 [K+'recall2']:(p)=>{
  const A=GX({y:440,h:300});
  const x0=0.6,v0w=0.6,f=t=>x0*Math.cos(1.2*t)+v0w*Math.sin(1.2*t);
  let s=A.svg+A.plot(f,{from:0,to:6.8,color:C.x,w:4,p:seg(p,.05,.6)});
  s+=fade(seg(p,.4,.55),dot(A.X(0),A.Y(x0),9,C.x)+label('x₀',A.X(0)-14,A.Y(x0)+8,{anchor:'end',size:26,color:C.x,weight:700}));
  s+=fade(seg(p,.55,.7),arrow(A.X(0),A.Y(x0),A.X(0.7),A.Y(x0+0.7*1.2*v0w),{color:C.v,w:4,head:14})+label('v₀',A.X(0.7)+8,A.Y(x0+0.84*v0w)-8,{size:26,color:C.v,weight:700}));
  s+=card(660,110,500,280,label('中級の 解',910,155,{size:24,color:C.dim,anchor:'middle'})
   +T(cX('x')+'='+cX('x_0')+'\\cos\\omega '+cT('t')+'+\\dfrac{'+cV('v_0')+'}{\\omega}\\sin\\omega '+cT('t'),910,240,{size:38})
   +fade(seg(p,.5,.65),label('初めの 位置 と 速度 で 1本',910,335,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'plan']:(p)=>{
  const items=[['①','どこにでも 現れる 理由','谷底'],['②','エネルギーで 確かめる','K＋U'],['③','成り立たない 条件','山・摩擦・平らな底']];
  let s='';
  items.forEach(([n,a,b],i)=>{const y=80+i*130;s+=card(170,y,860,110,label(n,230,y+70,{size:40,color:C.hi,weight:700})+label(a,300,y+68,{size:32,color:C.ink,weight:700})+label(b,990,y+66,{size:26,color:C.dim,anchor:'end'}),seg(p,.05+i*.22,.15+i*.22));});
  return s;
 },
 // ===== S2 谷底はばね =====
 [K+'valley']:(p)=>{
  const A=GZ();let s=zoomValley(A,{par:seg(p,.45,.65)});
  s+=card(640,90,520,320,label('近似・上級 2/2',900,135,{size:24,color:C.dim,anchor:'middle'})
   +T(cU('U')+'\\approx'+cU('U(a)')+'+\\tfrac12'+cH("U''(a)")+'('+cX('x-a')+')^2',900,215,{size:36})
   +fade(seg(p,.4,.55),T(cU("U'(a)")+'=0,\\quad'+cH("U''(a)")+'>0',900,305,{size:38})+label('底は 水平、上に 開いた 谷',900,365,{size:26,color:C.dim,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'valley2']:(p)=>{
  const A=GZ();let s=zoomValley(A,{F:seg(p,.2,.35)});
  s+=card(640,90,520,320,T(cF('F')+'\\approx-'+cH("U''(a)")+'('+cX('x-a')+')',900,180,{size:44})
   +fade(seg(p,.45,.6),label('ばね：F ＝ −kx',900,270,{size:30,color:C.dim,anchor:'middle'})+label('k の 代わりに U″(a)',900,330,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'eom']:(p)=>{
  let s=T('m\\,'+cc(C.a,'a')+'='+cF('F'),600,110,{size:52})+label('（実験に 支えられた 法則）',600,175,{size:24,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.3,.45),arrow(600,195,600,245,{color:C.hi,w:4,head:12}));
  const e='m'+d2(cX('x'))+'=-'+cH("U''(a)")+'('+cX('x-a')+')',w=texWidth(e,54,false);
  s+=fade(seg(p,.4,.55),T(e,600,340,{size:54})+highlight(600-w/2-24,240,w+48,180,1));
  s+=fade(seg(p,.6,.75),label('右辺は 谷底の 近くの 力（近似）',600,460,{size:26,color:ok,anchor:'middle'}));
  return s;
 },
 [K+'shift']:(p)=>{
  let s=T(cX('s')+'='+cX('x')+'-'+cX('a'),600,90,{size:50})+label('底からの ずれ',860,100,{size:26,color:C.x});
  s+=fade(seg(p,.3,.45),label('a は 定数 → 微分すると 0',600,190,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),T(d2(cX('s'))+'='+d2(cX('x')),600,290,{size:54}));
  return s;
 },
 [K+'divide']:(p)=>{
  let s=T('m'+d2(cX('s'))+'=-'+cH("U''(a)")+'\\,'+cX('s'),600,110,{size:46});
  s+=fade(seg(p,.15,.3),label('両辺 ÷ m',600,200,{size:28,color:C.hi,anchor:'middle',weight:700}));
  const e=d2(cX('s'))+'=-\\dfrac{'+cH("U''(a)")+'}{m}\\,'+cX('s'),w=texWidth(e,56,false);
  s+=fade(seg(p,.35,.5),T(e,600,340,{size:56})+highlight(600-w/2-24,232,w+48,190,1));
  return s;
 },
 [K+'omega']:(p)=>{
  let s=card(80,80,480,210,label('谷底の 近く',320,125,{size:26,color:C.dim,anchor:'middle'})+T(d2(cX('s'))+'=-\\dfrac{'+cH("U''(a)")+'}{m}\\,'+cX('s'),320,215,{size:42}),seg(p,.02,.12));
  s+=card(640,80,480,210,label('振動の 方程式',880,125,{size:26,color:C.dim,anchor:'middle'})+T(d2(cX('x'))+'=-\\omega^2'+cX('x'),880,215,{size:46}),seg(p,.1,.22));
  s+=fade(seg(p,.35,.5),T('\\omega^2=\\dfrac{'+cH("U''(a)")+'}{m}>0',600,380,{size:50}));
  s+=fade(seg(p,.5,.65),label('U″(a)＞0、m＞0',600,470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ex']:(p)=>{
  const A=GU();let s=ugraph(A,{par:seg(p,.3,.5)});
  s+=card(680,100,470,300,T(cU('U')+'='+cX('x')+'^3-3'+cX('x'),915,160,{size:44})+label('近似・上級の 例',915,215,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.55),T(cU("U''")+'=6'+cX('x')+',\\quad'+cU("U''(1)")+'=6',915,290,{size:38}))
   +fade(seg(p,.6,.75),T(cH('k')+'=6\\ \\mathrm{N/m}',915,365,{size:44,auto:false})),seg(p,.02,.12));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=card(150,60,900,110,label('谷 x ＝ 1 に 1.5 kg を 置く',600,128,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.1));
  s+=fade(seg(p,.1,.25),T('\\omega^2=\\dfrac{'+cH('6')+'}{1.5}=4\\ \\mathrm{/s^2}',400,270,{size:46}));
  s+=fade(seg(p,.35,.5),T('\\omega=2\\ \\mathrm{rad/s}',850,270,{size:46}));
  s+=fade(seg(p,.55,.7),T(cT('T')+'=\\dfrac{2\\pi}{\\omega}=\\dfrac{2\\pi}{2}=\\pi\\ \\mathrm{s}\\approx 3.14\\ \\mathrm{s}',600,410,{size:46}));
  return s;
 },
 [K+'every']:(p)=>{
  const rows=[['ばね','\\dfrac{'+cH('k')+'}{m}'],['振り子','\\dfrac{g}{l}'],['谷底の 近く','\\dfrac{'+cH("U''(a)")+'}{m}']];
  let s=label('どれも  加速度 ＝ −ω² × ずれ',600,62,{size:32,color:C.hi,anchor:'middle',weight:700});
  rows.forEach(([n,t],i)=>{const y=95+i*112;s+=card(200,y,800,96,label(n,250,y+58,{size:28,color:C.dim})+label('ω² ＝',640,y+58,{size:30,color:C.ink,anchor:'end'})+T(t,720,y+52,{size:30}),seg(p,.05+i*.12,.15+i*.12));});
  s+=fade(seg(p,.55,.7),label('安定な 底の 近くの 小さな 揺れ → 単振動',600,470,{size:30,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 エネルギー =====
 [K+'eq']:(p)=>{
  const ph=2*Math.PI*1.5*p,x=Math.cos(ph),Uf=x*x,Kf=1-Uf;
  let s=springBox(x,{cx:300});
  s+=bars(Kf,Uf,{x:700,y:420,h:260});
  s+=fade(seg(p,.4,.55),label('K ＝ ½mv²　U ＝ ½kx²（中級）',600,490,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.1,.25),label('一定？',1100,140,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'setup']:(p)=>{
  const A=GX({y:430,h:300});
  let s=A.svg+A.plot(t=>Math.cos(1.2*t),{from:0,to:6.8,color:C.x,w:4,p:seg(p,.3,.8)});
  s+=label('A',A.X(0)-14,A.Y(1)+8,{size:26,color:C.x,anchor:'end',weight:700})+label('−A',A.X(0)-14,A.Y(-1)+8,{size:26,color:C.x,anchor:'end',weight:700});
  s+=line(A.X(0),A.Y(1),A.X(6.8),A.Y(1),{color:C.faint,w:2,dash:'6 6'})+line(A.X(0),A.Y(-1),A.X(6.8),A.Y(-1),{color:C.faint,w:2,dash:'6 6'});
  s+=dot(A.X(0),A.Y(1),9,C.x);
  s+=card(680,110,470,290,label('端で そっと 離す',915,160,{size:28,color:C.ink,anchor:'middle'})
   +T(cX('x_0')+'=A,\\quad'+cV('v_0')+'=0',915,235,{size:40})
   +fade(seg(p,.4,.55),T(cX('x')+'=A\\cos\\omega '+cT('t'),915,330,{size:50})),seg(p,.02,.12));
  return s;
 },
 [K+'vel']:(p)=>{
  let s=T(cX('x')+'=A\\cos\\omega '+cT('t'),600,90,{size:50});
  s+=fade(seg(p,.15,.3),label('cos → −sin、中身の 倍率 ω を 掛ける',600,190,{size:28,color:C.dim,anchor:'middle'}));
  const e=cV('v')+'=\\dfrac{d'+cX('x')+'}{d'+cT('t')+'}=-A\\omega\\sin\\omega '+cT('t'),w=texWidth(e,54,false);
  s+=fade(seg(p,.4,.55),T(e,600,330,{size:54})+highlight(600-w/2-24,232,w+48,180,1));
  return s;
 },
 [K+'kin']:(p)=>{
  let s=T(cK('K')+'=\\tfrac12 m'+cV('v')+'^2',600,85,{size:50});
  s+=fade(seg(p,.15,.3),T('=\\tfrac12 m(-A\\omega\\sin\\omega '+cT('t')+')^2',600,205,{size:50}));
  s+=fade(seg(p,.35,.5),label('2乗で マイナスは 消える',980,280,{size:26,color:C.dim,anchor:'middle'}));
  const e='='+cK('\\tfrac12 m\\omega^2A^2')+'\\sin^2\\omega '+cT('t'),w=texWidth(e,54,false);
  s+=fade(seg(p,.5,.65),T(e,600,370,{size:54})+highlight(600-w/2-24,305,w+48,120,1));
  return s;
 },
 [K+'pot']:(p)=>{
  let s=T(cK('K')+'='+cK('\\tfrac12 m\\omega^2A^2')+'\\sin^2\\omega '+cT('t'),600,80,{size:40,opacity:.75});
  s+=fade(seg(p,.05,.2),T(cU('U')+'=\\tfrac12'+cH('k')+cX('x')+'^2=\\tfrac12'+cH('k')+'(A\\cos\\omega '+cT('t')+')^2',600,220,{size:48}));
  const e=cU('U')+'='+cU('\\tfrac12 kA^2')+'\\cos^2\\omega '+cT('t'),w=texWidth(e,54,false);
  s+=fade(seg(p,.45,.6),T(e,600,370,{size:54})+highlight(600-w/2-24,305,w+48,120,1));
  return s;
 },
 [K+'coef']:(p)=>{
  let s=T('\\omega^2=\\dfrac{'+cH('k')+'}{m}',330,110,{size:48});
  s+=fade(seg(p,.15,.3),label('両辺 × m',600,120,{size:28,color:C.hi,anchor:'middle',weight:700})+T('m\\omega^2='+cH('k'),870,110,{size:50}));
  s+=fade(seg(p,.4,.55),T(cK('\\tfrac12 m\\omega^2A^2')+'\\;=\\;'+cU('\\tfrac12 '+'kA^2'),600,300,{size:56}));
  s+=fade(seg(p,.6,.75),label('K の 係数 ＝ U の 係数',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=T(cK('K')+'+'+cU('U')+'=\\tfrac12 kA^2\\sin^2\\omega '+cT('t')+'+\\tfrac12 kA^2\\cos^2\\omega '+cT('t'),600,110,{size:44});
  s+=fade(seg(p,.25,.4),label('共通の ½kA² で くくる',600,210,{size:28,color:C.dim,anchor:'middle'}));
  const e=cK('K')+'+'+cU('U')+'=\\tfrac12 kA^2\\,(\\sin^2\\omega '+cT('t')+'+\\cos^2\\omega '+cT('t')+')',w=texWidth(e,52,false);
  s+=fade(seg(p,.45,.6),T(e,600,340,{size:52})+highlight(600-w/2-24,275,w+48,120,1));
  return s;
 },
 [K+'one']:(p)=>{
  // unit circle: sin² + cos² = 1
  const cx=250,cy=280,R=170,th=0.9;
  let s=ring(cx,cy,R,{color:C.faint,w:2})+line(cx-R-20,cy,cx+R+20,cy,{color:C.dim,w:2})+line(cx,cy+R+20,cx,cy-R-20,{color:C.dim,w:2});
  const X=cx+R*Math.cos(th),Y=cy-R*Math.sin(th);
  s+=line(cx,cy,X,Y,{color:C.ink,w:3})+line(X,cy,X,Y,{color:C.E,w:4})+line(cx,cy,X,cy,{color:CK,w:4})+dot(X,Y,7,C.ink);
  s+=label('1',(cx+X)/2-20,(cy+Y)/2-6,{size:26,color:C.ink,weight:700})+label('sin',X+12,(cy+Y)/2+8,{size:24,color:C.E})+label('cos',(cx+X)/2,cy+30,{size:24,color:CK,anchor:'middle'});
  s+=card(520,70,640,150,T('\\sin^2\\omega '+cT('t')+'+\\cos^2\\omega '+cT('t')+'=1',840,150,{size:48})+label('（三平方の 定理）',840,200,{size:24,color:C.dim,anchor:'middle'}),seg(p,.02,.12));
  const e=cK('K')+'+'+cU('U')+'=\\tfrac12 kA^2',w=texWidth(e,62,false);
  s+=fade(seg(p,.4,.55),T(e,840,330,{size:62})+highlight(840-w/2-24,265,w+48,125,1));
  s+=fade(seg(p,.7,.85),label('t が 消えた → 一定',840,470,{size:30,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'const']:(p)=>{
  const rows=[['定義','K ＝ ½mv²、U ＝ ½kx²（中級）',C.dim],['法則','ma ＝ F（実験に 支えられた）',C.dim],['仮定','摩擦・空気抵抗 なし',C.t],['導いた 結果','K ＋ U ＝ ½kA²（一定）',ok]];
  let s='';
  rows.forEach(([a,b,col],i)=>{const y=60+i*105;s+=card(150,y,900,90,label(a,190,y+57,{size:28,color:col,weight:700})+label(b,1010,y+57,{size:30,color:i===3?ok:C.ink,anchor:'end',weight:i===3?700:400}),seg(p,.02+i*.18,.12+i*.18));});
  return s;
 },
 [K+'swap']:(p)=>{
  const ph=2*Math.PI*1.25*p,x=Math.cos(ph),Uf=x*x,Kf=1-Uf;
  let s=springBox(x,{cx:300});
  s+=bars(Kf,Uf,{x:700,y:420,h:260});
  s+=label('端：全部 U',300,120,{size:26,color:C.E,anchor:'middle',weight:700})+label('中心：全部 K',300,160,{size:26,color:CK,anchor:'middle',weight:700});
  return s;
 },
 [K+'num']:(p)=>{
  let s=springBox(1,{cx:280,unit:120,tag:0});
  s+=label('A ＝ 0.1 m',400,410,{size:24,color:C.x,anchor:'middle'});
  s+=card(640,90,520,320,T('m=0.5\\ \\mathrm{kg},\\;\\;'+cH('k')+'=200\\ \\mathrm{N/m}',900,160,{size:36})
   +fade(seg(p,.3,.45),T('\\omega^2=\\dfrac{200}{0.5}=400',900,260,{size:42}))
   +fade(seg(p,.55,.7),T('\\omega=20\\ \\mathrm{rad/s}',900,350,{size:44})),seg(p,.02,.12));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=bars(0,1,{x:120,y:430,h:300,vals:['1 J','0','1 J']});
  s+=card(600,110,560,260,label('振幅 A ＝ 0.1 m',880,165,{size:28,color:C.x,anchor:'middle'})
   +fade(seg(p,.2,.35),T('E=\\tfrac12\\times 200\\times 0.1^2',880,245,{size:40}))
   +fade(seg(p,.5,.65),T('='+cU('1\\ \\mathrm{J}'),880,320,{size:46})),seg(p,.02,.12));
  return s;
 },
 [K+'num3']:(p)=>{
  const u=seg(p,.05,.4);
  let s=bars(0.64*seg(p,.55,.7),mix(1,0.36,u),{x:120,y:430,h:300,vals:[u>.9?'0.36 J':'',seg(p,.55,.7)>.5?'0.64 J':'','1 J']});
  s+=card(600,90,560,320,label('x ＝ 0.06 m',880,140,{size:28,color:C.x,anchor:'middle'})
   +fade(seg(p,.1,.25),T(cU('U')+'=\\tfrac12\\times200\\times0.06^2='+cU('0.36\\ \\mathrm{J}'),880,225,{size:38}))
   +fade(seg(p,.5,.65),T(cK('K')+'=1-0.36='+cK('0.64\\ \\mathrm{J}'),880,320,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'num4']:(p)=>{
  let s=bars(0.64,0.36,{x:120,y:430,h:300,vals:['0.36 J','0.64 J','1 J']});
  s+=card(600,90,560,320,T('\\tfrac12\\times0.5\\times'+cV('v')+'^2=0.64',880,160,{size:40})
   +fade(seg(p,.25,.4),T(cV('v')+'^2=\\dfrac{0.64}{0.25}=2.56',880,255,{size:40}))
   +fade(seg(p,.5,.65),T(cV('v')+'=1.6\\ \\mathrm{m/s}',880,350,{size:48})),seg(p,.02,.12));
  return s;
 },
 [K+'num5']:(p)=>{
  let s=T('\\tfrac12 m'+cV('v')+'^2+\\tfrac12'+cH('k')+cX('x')+'^2=\\tfrac12'+cH('k')+'A^2',600,90,{size:46});
  s+=fade(seg(p,.15,.3),label('× 2/m',600,165,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),T(cV('v')+'^2=\\dfrac{'+cH('k')+'}{m}(A^2-'+cX('x')+'^2)',600,255,{size:48}));
  const e=cV('v')+'^2=\\omega^2(A^2-'+cX('x')+'^2)',w=texWidth(e,54,false);
  s+=fade(seg(p,.6,.75),T(e,600,400,{size:54})+highlight(600-w/2-24,335,w+48,120,1));
  return s;
 },
 [K+'num6']:(p)=>{
  let s=T(cV('v')+'=\\omega\\sqrt{A^2-'+cX('x')+'^2}',600,90,{size:50});
  s+=fade(seg(p,.1,.25),T('=20\\times\\sqrt{0.01-0.0036}',600,210,{size:46}));
  s+=fade(seg(p,.35,.5),T('=20\\times\\sqrt{0.0064}=20\\times0.08',600,320,{size:46}));
  s+=fade(seg(p,.6,.75),T('='+cV('1.6\\ \\mathrm{m/s}'),600,430,{size:52})+label('✓ エネルギーと 一致',860,440,{size:28,color:ok,weight:700}));
  return s;
 },
 // ===== S4 いつ成り立たない =====
 [K+'hill']:(p)=>{
  const A=GU();let s=ugraph(A,{valley:1,hill:seg(p,.3,.45)});
  s+=fade(seg(p,.3,.45),ring(A.X(-1),A.Y(2),44,{color:bad,w:3}));
  s+=card(680,120,470,260,label('成り立たない ①',915,185,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.55),T(cU("U''(a)")+'<0',915,265,{size:48})+label('山',915,330,{size:32,color:bad,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'hill2']:(p)=>{
  const A=GU();let s=ugraph(A,{valley:1,hill:1});
  s+=fade(seg(p,.4,.6),dot(A.X(-1.35),A.Y(U3(-1.35)),8,C.x)+arrow(A.X(-1.35),A.Y(U3(-1.35)),A.X(-1.35)-80,A.Y(U3(-1.35)),{color:ok,w:5,head:14})
   +dot(A.X(-0.65),A.Y(U3(-0.65)),8,C.x)+arrow(A.X(-0.65),A.Y(U3(-0.65)),A.X(-0.65)+80,A.Y(U3(-0.65)),{color:ok,w:5,head:14}));
  s+=card(680,90,470,340,T(cU("U''(-1)")+'=-6',915,155,{size:44})
   +fade(seg(p,.15,.3),T(d2(cX('s'))+'=-\\dfrac{-6}{1.5}\\,'+cX('s'),915,250,{size:40}))
   +fade(seg(p,.35,.5),T('=+4\\,'+cX('s'),915,330,{size:46}))
   +fade(seg(p,.6,.75),label('ずれた 向きへ 加速',915,400,{size:28,color:bad,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'hill3']:(p)=>{
  let s=card(200,110,800,260,label('振動の 第一の 条件',600,175,{size:30,color:C.dim,anchor:'middle'})
   +T('\\omega^2=\\dfrac{'+cH("U''(a)")+'}{m}>0',600,290,{size:58}),seg(p,.02,.15),ok);
  return s;
 },
 [K+'rest']:(p)=>{
  let s=springBox(0,{cx:300,y:300});
  const A=axes({x:70,y:470,w:460,h:90,xmin:0,xmax:7,ymin:-1,ymax:1,xticks:[],yticks:[],xlabel:'t',xcolor:C.t});
  s+=A.svg+A.plot(()=>0,{from:0,to:6.8,color:C.x,w:5,p:seg(p,.4,.8)})+label('x',A.X(0)-14,A.Y(0.9),{size:24,color:C.x,anchor:'end'});
  s+=card(640,90,520,320,label('成り立たない ②',900,140,{size:28,color:C.dim,anchor:'middle'})
   +T(cX('x_0')+'=0,\\quad'+cV('v_0')+'=0',900,220,{size:44})
   +fade(seg(p,.4,.55),T(cX('x')+'=0\\cdot\\cos\\omega '+cT('t')+'+0\\cdot\\sin\\omega '+cT('t')+'=0',900,305,{size:34}))
   +fade(seg(p,.6,.75),label('底で ずっと 静止（これも 解）',900,370,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'fric']:(p)=>{
  const A=GX({y:450,h:300});
  let s=A.svg+A.plot(t=>Math.exp(-0.32*t)*Math.cos(2.2*t),{from:0,to:6.8,color:C.x,w:4,p:seg(p,.3,.8)});
  s+=fade(seg(p,.5,.7),A.plot(t=>Math.exp(-0.32*t),{from:0,to:6.8,color:C.faint,w:2,dash:'6 6'})+A.plot(t=>-Math.exp(-0.32*t),{from:0,to:6.8,color:C.faint,w:2,dash:'6 6'}));
  s+=card(660,90,500,320,label('成り立たない ③ 摩擦・空気抵抗',910,140,{size:26,color:C.dim,anchor:'middle'})
   +T('m'+d2(cX('x'))+'=-'+cH('k')+cX('x')+cR('\\,-\\,b\\dfrac{d'+cX('x')+'}{d'+cT('t')+'}'),910,240,{size:38})
   +fade(seg(p,.3,.45),label('速度に 比例する 力が 加わる',910,330,{size:26,color:bad,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 [K+'fric2']:(p)=>{
  const A=GX({y:450,h:300});
  let s=A.svg+A.plot(t=>Math.exp(-0.32*t)*Math.cos(2.2*t),{from:0,to:6.8,color:C.x,w:4});
  s+=A.plot(t=>Math.exp(-0.32*t),{from:0,to:6.8,color:C.faint,w:2,dash:'6 6'})+A.plot(t=>-Math.exp(-0.32*t),{from:0,to:6.8,color:C.faint,w:2,dash:'6 6'});
  s+=card(660,90,500,320,label('K＋U は 一定でなく 減る',910,150,{size:30,color:C.E,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),label('揺れは しだいに 小さく',910,215,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.5,.65),label('周期的に 押す 場合も 含めて',910,290,{size:26,color:C.dim,anchor:'middle'})+label('→ 力学の 単振動・上級',910,345,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'flat']:(p)=>{
  const A=axes({x:70,y:450,w:560,h:360,xmin:-1.3,xmax:1.3,ymin:0,ymax:1.7,xticks:[-1,1],yticks:[1],grid:true,xlabel:'x',xcolor:C.x});
  let s=A.svg+A.plot(x=>x*x,{from:-1.28,to:1.28,color:C.hi,w:3,dash:'9 7'})+label('x²',A.X(-1.22)+14,A.Y(1.49)+6,{size:26,color:C.hi,weight:700});
  s+=A.plot(x=>x**4,{from:-1.14,to:1.14,color:C.E,w:5,p:seg(p,.05,.35)})+fade(seg(p,.3,.4),label('x⁴',A.X(1.14)+12,A.Y(1.69)+30,{size:28,color:C.E,weight:700}));
  s+=fade(seg(p,.5,.65),rect(A.X(-0.45),A.Y(0.25),A.X(0.45)-A.X(-0.45),A.Y(0)-A.Y(0.25),{fill:'none',fo:0,stroke:bad,sw:3,rx:8})+label('底が 平ら',A.X(0),A.Y(0.25)-14,{size:24,color:bad,anchor:'middle',weight:700}));
  s+=card(680,100,470,300,label('成り立たない ④',915,150,{size:28,color:C.dim,anchor:'middle'})
   +T(cU('U')+'='+cX('x')+'^4',915,225,{size:48})
   +fade(seg(p,.5,.65),T(cU("U''(0)")+'=0',915,305,{size:44})+label('→ ばね定数 0',915,365,{size:28,color:bad,anchor:'middle',weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'flat2']:(p)=>{
  let s=T(cF('F')+'=-\\dfrac{d'+cU('U')+'}{d'+cX('x')+'}=-4'+cX('x')+'^3',600,85,{size:48});
  s+=card(170,160,860,200,
   fade(seg(p,.2,.35),label('x ＝ 0.1 → F ＝ −0.004',600,225,{size:34,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.4,.55),label('x ＝ 0.2 → F ＝ −0.032',600,300,{size:34,color:C.ink,anchor:'middle'})),seg(p,.02,.12));
  s+=fade(seg(p,.65,.8),label('ずれ 2倍 → 力 8倍：ずれに 比例しない',600,430,{size:32,color:bad,anchor:'middle',weight:700}));
  return s;
 },
 [K+'flat3']:(p)=>{
  let s=card(150,80,900,150,label('ずれに 比例する 力（ばね）',600,135,{size:28,color:C.dim,anchor:'middle'})+label('周期は 振幅に よらない',600,195,{size:34,color:ok,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(150,270,900,150,label('U ＝ x⁴ の 谷',600,325,{size:28,color:C.dim,anchor:'middle'})+label('単振動ではなく、周期は 振幅で 変わる',600,385,{size:34,color:bad,anchor:'middle',weight:700}),seg(p,.2,.35));
  return s;
 },
 [K+'big']:(p)=>{
  const A=axes({x:90,y:450,w:520,h:380,xmin:0.4,xmax:1.8,ymin:-7,ymax:4,xticks:[0.5,1,1.5],yticks:[-6,-4,-2,2],grid:true,xlabel:'x',xcolor:C.x,ylabel:'F',ycolor:C.F});
  let s=A.svg+A.plot(F3,{from:0.45,to:1.75,color:C.F,w:5})+A.plot(FS,{from:0.45,to:1.75,color:C.hi,w:3,dash:'9 7'});
  s+=label('本当',A.X(1.72),A.Y(F3(1.72))+34,{size:24,color:C.F,anchor:'end',weight:700})+label('ばね近似',A.X(0.5)+10,A.Y(FS(0.5))-14,{size:24,color:C.hi,weight:700});
  s+=line(A.X(1),A.Y(-7),A.X(1),A.Y(4),{color:C.x,w:2,dash:'5 5'});
  s+=fade(seg(p,.3,.45),dot(A.X(1.5),A.Y(F3(1.5)),9,C.F)+dot(A.X(1.5),A.Y(FS(1.5)),9,C.hi)+line(A.X(1.5),A.Y(F3(1.5)),A.X(1.5),A.Y(FS(1.5)),{color:bad,w:5}));
  s+=card(680,100,470,300,label('成り立たない ⑤',915,150,{size:28,color:C.dim,anchor:'middle'})
   +label('ずれが 大きい',915,215,{size:34,color:bad,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('ずれ 0.5 m：本当 −3.75 N',915,290,{size:26,color:C.F,anchor:'middle'})+label('近似 −3.0 N（約 20% ずれ）',915,335,{size:26,color:C.hi,anchor:'middle'})),seg(p,.02,.12));
  return s;
 },
 // ===== S5 まとめ =====
 [K+'sum1']:(p)=>{
  const A=GZ({x:60,w:440});let s=zoomValley(A,{F:1});
  s+=card(560,70,600,370,label('安定な 谷の 近く',860,115,{size:28,color:C.dim,anchor:'middle'})
   +T(cF('F')+'\\approx-'+cH("U''(a)")+'\\,'+cX('s'),860,195,{size:40})
   +fade(seg(p,.3,.45),T(d2(cX('s'))+'=-\\omega^2'+cX('s'),860,285,{size:38}))
   +fade(seg(p,.5,.65),T('\\omega^2=\\dfrac{'+cH("U''(a)")+'}{m}',860,380,{size:34})),seg(p,.02,.12),ok);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(120,50,960,110,label('摩擦なし：',170,118,{size:28,color:C.dim})+T(cK('K')+'+'+cU('U')+'=\\tfrac12 kA^2',600,112,{size:44})+label('一定',960,118,{size:30,color:ok,weight:700}),seg(p,.02,.12));
  const conds=['U″(a) ＞ 0（谷）','小さな ずれ','摩擦・外力 なし','止まった ままでない'];
  conds.forEach((c,i)=>{const x=150+(i%2)*460,y=210+Math.floor(i/2)*120;s+=card(x,y,440,100,label('✓ '+c,x+30,y+62,{size:30,color:C.ink,weight:700}),seg(p,.25+i*.12,.35+i*.12));});
  return s;
 },
 [K+'tools']:(p)=>{
  const items=['微分','積分','ベクトル','微分方程式','振動'];
  let s=label('数学の 道具',600,90,{size:34,color:C.dim,anchor:'middle'});
  items.forEach((t,i)=>{const x=110+i*200;s+=card(x,150,180,100,label('✓ '+t,x+90,210,{size:26,color:ok,anchor:'middle',weight:700}),seg(p,.05+i*.1,.15+i*.1));});
  s+=fade(seg(p,.65,.8),arrow(600,290,600,360,{color:C.hi,w:5,head:16})+label('次は 力学',600,430,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=proj(p);
  s+=card(700,90,460,330,label('放物運動を',930,150,{size:28,color:C.ink,anchor:'middle'})
   +label('成分で 解き、確かめる',930,205,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('力が 変わったら？',930,300,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.18),C.hi);
  return s;
 },
};
