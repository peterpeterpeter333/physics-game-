// YouTube シリーズ 微分の法則・上級 1/2（ステージ um-rules 本2・本6 ＋ ln・逆数・実数乗の補い）— 図。Stage 1200×515.
// 色：x 水色、中身 u 橙、外側の出力 y 緑、時間 t 金、強調 黄、誤り・減る帯 赤、増える帯 紫。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,poly} from './anim.mjs';

const K='um-rules-1:';
const R=String.raw;
const CU=C.E,CY=C.F,CX=C.x,CT=C.t,CV=C.v,CK=C.a,CH=C.hi;
const U=`{\\color{${CU}}u}`,Y=`{\\color{${CY}}y}`,T=`{\\color{${CT}}t}`,X=`{\\color{${CX}}x}`;
const DU=`\\Delta ${U}`,DY=`\\Delta ${Y}`,DT=`\\Delta ${T}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const L=(s,x,y,o={})=>label(s,x,y,{anchor:'middle',size:28,color:C.ink,...o});
// centres of the pieces of a formula rendered in one piece (widths of prefixes)
function marks(parts,cx,size,auto=false){
 const W=texWidth(parts.join(''),size,auto),L0=cx-W/2,c=[];let acc='';
 parts.forEach(q=>{const a=texWidth(acc||'{}',size,auto)*(acc?1:0);acc+=q;const b=texWidth(acc,size,auto);c.push(L0+(a+b)/2);});
 return {L:L0,W,c,svg:tex(parts.join(''),cx,0,{size,auto})};
}
const texAt=(parts,cx,y,size,auto=false)=>{const m=marks(parts,cx,size,auto);return {...m,svg:tex(parts.join(''),cx,y,{size,auto})};};

// ---- pipeline & gears ----------------------------------------------------------------------------
function node(x,y,name,color,g=1,size=36){
 return fade(g,ring(x,y,40,{color,w:4,fill:'#10182c'})+label(name,x,y+size/3,{size,color,anchor:'middle',weight:700}));
}
function opbox(x,y,text,g=1){return fade(g,rect(x-86,y-32,172,64,{fill:'#1a2440',fo:1,stroke:C.dim,sw:2,rx:12})+label(text,x,y+10,{size:26,color:C.ink,anchor:'middle',weight:700}));}
function pipeline(y,{g=1,ops=['ln','e の□乗'],Xs=[170,600,1030],cols=[CX,CU,CX],names=['x','u','x'],sizes=[36,36,36]}={}){
 let s='';const bx=[(Xs[0]+Xs[1])/2,(Xs[1]+Xs[2])/2];
 for(let i=0;i<3;i++)s+=node(Xs[i],y,names[i],cols[i],g,sizes[i]);
 for(let i=0;i<2;i++){s+=fade(g,arrow(Xs[i]+44,y,bx[i]-92,y,{color:C.dim,w:3,head:12})+arrow(bx[i]+92,y,Xs[i+1]-46,y,{color:C.dim,w:3,head:12}));s+=opbox(bx[i],y,ops[i],g);}
 return s;
}
function gear(cx,cy,r,teeth,ang,color,g=1){
 const pts=[];const N=teeth*4;
 for(let i=0;i<N;i++){const a=ang+i*2*Math.PI/N,rr=(i%4<2)?r:r*.8;pts.push([cx+rr*Math.cos(a),cy+rr*Math.sin(a)]);}
 return fade(g,poly(pts,{fill:color,fo:.22,stroke:color,sw:3})+ring(cx,cy,r*.28,{color,w:3,fill:C.bg})
  +line(cx,cy,cx+r*.62*Math.cos(ang),cy+r*.62*Math.sin(ang),{color,w:4}));
}

// ---- rectangle f × g with strips (product rule, from 中級) --------------------------------------
function rectFG({x0=110,y0=450,w=300,h=220,d=48,g=[1,1,1],dim=[1,1,1]}={}){
 let s=rect(x0,y0-h,w,h,{fill:C.dim,fo:.12,stroke:C.dim,sw:3,rx:2})+label('fg',x0+w/2,y0-h/2+14,{size:38,color:C.ink,anchor:'middle',weight:700});
 s+=label('g',x0+w/2,y0+36,{size:30,color:C.ink,anchor:'middle',weight:700})+label('f',x0-20,y0-h/2+10,{size:30,color:C.ink,anchor:'end',weight:700});
 s+=fade(g[0]*dim[0],rect(x0,y0-h-d,w,d,{fill:CV,fo:.5,stroke:CV,sw:2,rx:2}));
 s+=fade(g[1]*dim[1],rect(x0+w,y0-h,d,h,{fill:C.p,fo:.5,stroke:C.p,sw:2,rx:2}));
 s+=fade(g[2]*dim[2],rect(x0+w,y0-h-d,d,d,{fill:CK,fo:.75,stroke:CK,sw:2,rx:2}));
 s+=label('Δg',x0+w+d/2,y0+36,{size:24,color:C.p,anchor:'middle'})+label('Δf',x0-20,y0-h-d/2+9,{size:24,color:CV,anchor:'end'});
 return s;
}

// ---- small u(t) graphs: smooth vs jump -------------------------------------------------------------
function miniGraph(x0,kind,{g=1,sec=0,step=1}={}){
 const A=axes({x:x0,y:440,w:400,h:240,xmax:2,ymax:2.4,xlabel:'t',ylabel:'u',g,xcolor:CT,ycolor:CU});
 let s=A.svg;const t0=1,dt=mix(.5,.08,step);
 if(kind==='smooth'){
  const f=t=>.5+.9*t-.15*t*t;
  s+=fade(g,A.plot(f,{from:0,to:1.95,color:CU,w:4}));
  s+=fade(g,dot(A.X(t0),A.Y(f(t0)),7,CH)+dot(A.X(t0+dt),A.Y(f(t0+dt)),7,CH));
  s+=fade(g,line(A.X(t0),A.Y(f(t0)),A.X(t0+dt),A.Y(f(t0)),{color:CT,w:3})+line(A.X(t0+dt),A.Y(f(t0)),A.X(t0+dt),A.Y(f(t0+dt)),{color:CU,w:4}));
  if(sec)s+=fade(sec,draw([[A.X(t0-.5),A.Y(f(t0)-.5*.6)],[A.X(t0+.7),A.Y(f(t0)+.7*.6)]],1,{color:CH,w:3,dash:'8 6'}));
 }else{
  s+=fade(g,draw([[A.X(0),A.Y(.7)],[A.X(t0),A.Y(.7)]],1,{color:CU,w:4})+draw([[A.X(t0),A.Y(1.8)],[A.X(1.95),A.Y(1.8)]],1,{color:CU,w:4}));
  s+=fade(g,ring(A.X(t0),A.Y(.7),7,{color:CU,w:3,fill:C.bg})+dot(A.X(t0),A.Y(1.8),7,CU));
  const ta=t0-dt*.5,tb=t0+dt*.5;
  s+=fade(g,dot(A.X(ta),A.Y(.7),7,CH)+dot(A.X(tb),A.Y(1.8),7,CH));
  s+=fade(g,line(A.X(tb),A.Y(.7),A.X(tb),A.Y(1.8),{color:CU,w:4}));
  if(sec)s+=fade(sec,draw([[A.X(ta),A.Y(.7)],[A.X(tb),A.Y(1.8)]],1,{color:CK,w:3,dash:'8 6'}));
 }
 return {A,svg:s};
}

// ---- graphs of ln x, 1/t, √x -------------------------------------------------------------------
function lnAxes(box={x:110,y:470,w:560,h:400},g=1){
 return axes({...box,xmin:0,xmax:4.6,ymin:-1.6,ymax:1.8,xlabel:'x',ylabel:'ln x',xticks:[1,2,3,4],yticks:[1],g,xcolor:CX,ycolor:CU});
}
function tangent(A,x0,y0,m,half,color=CH,g=1){return fade(g,draw([[A.X(x0-half),A.Y(y0-m*half)],[A.X(x0+half),A.Y(y0+m*half)]],1,{color,w:3,dash:'10 6'}));}
function expGraph(g=1){
 const A=axes({x:120,y:470,w:470,h:400,xmin:-1.2,xmax:1.5,ymin:0,ymax:4.6,xlabel:'何乗',ylabel:'e の何乗',xticks:[-1,1],yticks:[1,2,3,4],g,xcolor:CU,ycolor:CX});
 return {A,svg:A.svg+fade(g,A.plot(s=>Math.exp(s),{from:-1.2,to:1.5,color:CX,w:4}))};
}
const LN2=Math.log(2);

// ---- contour map of h = x²y (same as 中級 2/2) ---------------------------------------------------
const M={x0:110,y0:470,sx:190,sy:125,xmax:2.4,ymax:3.3},MX=x=>M.x0+M.sx*x,MY=y=>M.y0-M.sy*y;
function hillMap({east=0,north=0}={}){
 let s=rect(M.x0,MY(M.ymax),M.sx*M.xmax,M.sy*M.ymax,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:4});
 [1,2,4,8].forEach((c,i)=>{const pts=[];const xa=Math.sqrt(c/M.ymax);for(let k=0;k<=60;k++){const x=mix(xa,M.xmax,k/60);pts.push([MX(x),MY(c/(x*x))]);}s+=`<g opacity="${.45+i*.12}">${draw(pts,1,{color:C.dim,w:2.5})}</g>`;});
 s+=arrow(M.x0,M.y0,MX(M.xmax)+30,M.y0,{color:CX,w:3,head:12})+label('東 x',MX(M.xmax)+34,M.y0+8,{size:24,color:CX});
 s+=arrow(M.x0,M.y0,M.x0,MY(M.ymax)-24,{color:CY,w:3,head:12})+label('北 y',M.x0+12,MY(M.ymax)-12,{size:24,color:CY});
 s+=dot(MX(1),MY(2),10,CH);
 s+=fade(east,arrow(MX(1),MY(2),MX(1.55),MY(2),{color:CX,w:5,head:16})+label('東だけ',MX(1.6),MY(2)+8,{size:24,color:CX,weight:700}));
 s+=fade(north,arrow(MX(1),MY(2),MX(1),MY(2.6),{color:CY,w:5,head:16})+label('北だけ',MX(1)+14,MY(2.7),{size:24,color:CY,weight:700}));
 return s;
}


export const ytUmRules1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=card(150,40,900,190,L('前回の最後の問い',600,85,{size:24,color:C.dim})
   +tex(R`\dfrac{dy}{dt}=\dfrac{dy}{du}\,\dfrac{du}{dt}`,380,165,{size:40})+label('連鎖律',380,215,{size:22,color:C.dim,anchor:'middle'})
   +tex(R`(fg)'=f'g+fg'`,820,160,{size:40,auto:false})+label('積の微分',820,215,{size:22,color:C.dim,anchor:'middle'}),seg(p,0,.15),CH);
  s+=fade(seg(p,.25,.4),L('中級：差の比で 数値を確かめた',600,300,{color:C.dim}));
  s+=fade(seg(p,.5,.65),L('どんな関数にも言える 証明？',600,390,{size:40,color:CH,weight:700}));
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=tex(R`\int\frac{1}{t}\,dt=\ln|t|+C`,600,130,{size:60});
  s+=L('前回（積分・上級 2/2）で使った',600,240,{size:26,color:C.dim});
  s+=fade(seg(p,.45,.6),tex(R`\bigl(\ln|t|\bigr)'\;\overset{?}{=}\;\frac{1}{t}`,600,350,{size:56}));
  s+=fade(seg(p,.6,.75),L('傾きは 本当に 1/t ？',600,470,{size:34,color:CH,weight:700}));
  return s;
 },
 [K+'goal']:(p)=>{
  let s=card(50,120,420,230,L('① 仮定を確かめる',260,185,{size:32,color:CH,weight:700})
   +L('連鎖律・積の微分は',260,250,{size:26})+L('何を使っている？',260,295,{size:26}),seg(p,0,.2),CH);
  s+=fade(seg(p,.35,.5),arrow(485,235,590,235,{color:C.dim,w:4}));
  s+=fade(seg(p,.35,.5),L('② 二つを 道具に',880,95,{size:30,color:CH,weight:700}));
  const rows=[[R`(\ln x)'`,'ln'],[R`(1/f)'`,'逆数'],[R`(x^n)'`,'実数乗']];
  rows.forEach(([t,j],i)=>{const g=seg(p,.55+i*.1,.7+i*.1),y=175+i*110;
   s+=fade(g,rect(640,y-45,480,90,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+tex(t,790,y+5,{size:42})+label(j,960,y+10,{size:30,color:C.ink,anchor:'middle',weight:700}));});
  return s;
 },

 // ===== S2 証明が使った仮定 =====
 [K+'chain']:(p)=>{
  let s=L('連鎖律の出発点（中級 1/2）',600,50,{size:26,color:C.dim});
  s+=tex(`\\dfrac{${DY}}{${DT}}=\\dfrac{${DY}}{${DU}}\\times\\dfrac{${DU}}{${DT}}`,600,180,{size:66,auto:false});
  s+=card(250,340,700,90,L('Δu ≠ 0 なら ぴったり成り立つ 等式',600,397,{size:30,color:C.F,weight:700}),seg(p,.45,.6),C.F);
  return s;
 },
 [K+'need']:(p)=>{
  const m=texAt([`\\dfrac{${DY}}{${DT}}=`,`\\dfrac{${DY}}{${DU}}`,`\\times`,`\\dfrac{${DU}}{${DT}}`],600,150,60);
  let s=m.svg;
  s+=fade(seg(p,.05,.25),L('Δt → 0',600,40,{size:28,color:CT,weight:700}));
  s+=fade(seg(p,.15,.35),arrow(m.c[3],225,m.c[3],285,{color:CU,w:4,head:14})+tex(`\\dfrac{d${U}}{d${T}}`,m.c[3],380,{size:44,auto:false})+ok(m.c[3]+60,390));
  s+=fade(seg(p,.55,.7),arrow(m.c[1],225,m.c[1],285,{color:CY,w:4,head:14})+tex(`\\dfrac{d${Y}}{d${U}}`,m.c[1],380,{size:44,auto:false})+label('？',m.c[1]+55,392,{size:40,color:CH,weight:700}));
  return s;
 },
 [K+'need2']:(p)=>{
  let s=L('Δu も 0 へ 向かう必要がある',600,48,{size:30,color:CH,weight:700});
  const a=miniGraph(110,'smooth',{g:seg(p,.05,.25),step:seg(p,.25,.6)}),b=miniGraph(690,'jump',{g:seg(p,.45,.65),step:seg(p,.6,.9)});
  s+=a.svg+b.svg;
  s+=fade(seg(p,.3,.45),L('つながった u：Δu → 0',330,500,{size:26,color:C.F,weight:700}));
  s+=fade(seg(p,.7,.85),L('跳ぶ u：Δu は 小さくならない',900,500,{size:26,color:CK,weight:700}));
  return s;
 },
 [K+'rewrite']:(p)=>{
  let s=tex(`${DU}=\\dfrac{${DU}}{${DT}}\\times${DT}`,600,170,{size:66,auto:false});
  s+=fade(seg(p,.5,.65),L('Δt で割って Δt を掛けただけ → 同じ量',600,330,{size:30,color:C.dim}));
  return s;
 },
 [K+'rewrite2']:(p)=>{
  const m=texAt([`${DU}=`,`\\dfrac{${DU}}{${DT}}`,`\\times`,`${DT}`],600,170,66);
  let s=m.svg;
  s+=fade(seg(p,.05,.25),brace(m.c[1]-60,m.c[1]+60,240,{color:CU}));
  s+=fade(seg(p,.1,.3),tex(`\\to\\dfrac{d${U}}{d${T}}`,m.c[1],340,{size:44,auto:false})+L('決まった値',m.c[1],430,{size:26,color:CU}));
  s+=fade(seg(p,.55,.7),brace(m.c[3]-45,m.c[3]+45,240,{color:CT}));
  s+=fade(seg(p,.6,.75),tex(R`\to 0`,m.c[3],340,{size:44,auto:false})+L('0 へ',m.c[3],430,{size:26,color:CT}));
  return s;
 },
 [K+'rewrite3']:(p)=>{
  let s=tex(`${DU}=\\dfrac{${DU}}{${DT}}\\times${DT}`,600,110,{size:50,auto:false});
  const src=`${DU}\\;\\to\\;\\dfrac{d${U}}{d${T}}\\times 0=0`;
  s+=fade(seg(p,.1,.3),tex(src,600,300,{size:62,auto:false}));
  const W=texWidth(src,62,false);
  s+=highlight(600-W/2-24,195,W+48,185,seg(p,.5,.65));
  return s;
 },
 [K+'jump']:(p)=>{
  let s=L('微分できる ⇒ つながっている',600,48,{size:30,color:CH,weight:700});
  const a=miniGraph(110,'smooth',{step:1,sec:seg(p,.05,.25)}),b=miniGraph(690,'jump',{step:mix(.3,1,seg(p,.45,.9)),sec:seg(p,.45,.6)});
  s+=a.svg+b.svg;
  s+=fade(seg(p,.1,.25),L('傾きが 決まる',330,500,{size:26,color:C.F,weight:700}));
  s+=fade(seg(p,.55,.7),L('Δu/Δt → いくらでも大きい',900,500,{size:26,color:CK,weight:700}));
  return s;
 },
 [K+'du0']:(p)=>{
  const A=axes({x:110,y:440,w:460,h:300,xmax:2.2,ymax:2.4,xlabel:'t',ylabel:'u',xcolor:CT,ycolor:CU});
  const f=t=>t<.8?.6+.8*t:t<1.4?1.24:1.24+.9*(t-1.4);
  let s=A.svg+A.plot(f,{from:0,to:2.1,color:CU,w:4,steps:300});
  s+=fade(seg(p,.1,.3),rect(A.X(.8),A.Y(2.2),A.X(1.4)-A.X(.8),A.Y(0)-A.Y(2.2),{fill:CH,fo:.08,stroke:CH,sw:2,rx:4})+L('Δu ＝ 0',A.X(1.1),A.Y(1.24)-20,{size:26,color:CH,weight:700}));
  s+=card(650,150,500,210,L('Δu が ちょうど 0 の区間',900,210,{size:28,color:CH,weight:700})
   +L('書き方を 少し変えると',900,270,{size:26})+L('同じ結論になる',900,315,{size:26}),seg(p,.45,.6));
  return s;
 },
 [K+'corner']:(p)=>{
  let s=rectFG({x0:90,w:240,h:180,d:40,dim:[.3,.3,1]});
  s+=L('積の微分の 角の項（中級 1/2）',790,50,{size:24,color:C.dim});
  s+=tex(`{\\color{${CK}}\\dfrac{\\Delta f}{\\Delta ${T}}\\,\\Delta g}`,790,150,{size:56,auto:false});
  s+=fade(seg(p,.1,.3),L("→ f′（決まった値）",660,260,{size:26}));
  s+=fade(seg(p,.1,.3),L('→ 0',930,260,{size:30,color:CK,weight:700}));
  s+=card(540,320,500,110,L('g が微分できる',790,365,{size:28,color:CH,weight:700})+L('→ Δg ＝ (Δg/Δt) × Δt → 0',790,410,{size:26}),seg(p,.55,.7),CH);
  return s;
 },
 [K+'proof']:(p)=>{
  let s=card(50,70,500,300,L('中級',300,125,{size:28,color:C.dim,weight:700})+L('数値で 確かめた',300,190,{size:30})
   +tex(R`12.04\to12`,300,265,{size:40,auto:false})+L('その例で 合っている',300,335,{size:24,color:C.dim}),seg(p,0,.2));
  s+=card(650,70,500,300,L('上級',900,125,{size:28,color:CH,weight:700})+L('仮定は「どれも微分できる」',900,190,{size:28})
   +L('だけ',900,235,{size:28})+L('⇒ 必ず成り立つ',900,310,{size:34,color:CH,weight:700}),seg(p,.35,.55),CH);
  s+=fade(seg(p,.35,.55),arrow(560,220,640,220,{color:C.dim,w:4}));
  s+=fade(seg(p,.7,.85),L('＝ 証明',900,440,{size:40,color:C.F,weight:700}));
  return s;
 },

 // ===== S3 ln の傾き =====
 [K+'lndef']:(p)=>{
  const {A,svg}=expGraph(seg(p,.05,.25));let s=svg;
  s+=card(660,90,500,250,L('ln x',910,160,{size:48,color:CU,weight:700})
   +L('e を 何乗すれば',910,230,{size:30})+L('x になるか ── その「何乗」',910,280,{size:30}),seg(p,.3,.5),CU);
  return s;
 },
 [K+'lnex']:(p)=>{
  const {A,svg}=expGraph();let s=svg;
  s+=fade(seg(p,.05,.2),L('e ≈ 2.718',910,80,{size:30,color:C.dim}));
  s+=fade(seg(p,.25,.45),dot(A.X(1),A.Y(Math.E),8,CH)+tex(R`e^1=e\ \Rightarrow\ \ln e=1`,910,190,{size:40}));
  s+=fade(seg(p,.6,.8),dot(A.X(0),A.Y(1),8,CH)+tex(R`e^0=1\ \Rightarrow\ \ln 1=0`,910,290,{size:40}));
  return s;
 },
 [K+'lnex2']:(p)=>{
  const {A,svg}=expGraph();let s=svg;
  s+=tex(R`e^1=e\ \Rightarrow\ \ln e=1`,910,110,{size:34})+tex(R`e^0=1\ \Rightarrow\ \ln 1=0`,910,180,{size:34});
  s+=fade(seg(p,.05,.25),tex(R`e^{0.693}\approx2\ \Rightarrow\ \ln 2\approx0.693`,910,270,{size:36,auto:false}));
  const g1=seg(p,.5,.7),g2=seg(p,.68,.88);
  s+=fade(g1,dot(A.X(-1.2)+0,A.Y(2),0)+arrow(A.X(0),A.Y(2),A.X(LN2),A.Y(2),{color:CX,w:4,head:12,g:g1}));
  s+=fade(g2,arrow(A.X(LN2),A.Y(2),A.X(LN2),A.Y(0),{color:CU,w:4,head:12,g:g2})+label('0.693',A.X(LN2)+8,A.Y(0)-14,{size:22,color:CU}));
  s+=fade(g1,label('高さ 2',A.X(0)+10,A.Y(2)-14,{size:22,color:CX}));
  s+=fade(seg(p,.8,.95),L('高さ → 横へ → 下へ',910,380,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'id']:(p)=>{
  let s=tex(R`e^{\ln x}=x`,600,190,{size:96});
  s+=fade(seg(p,.1,.3),L('e を「ln x 乗」すると x に戻る（定義）',600,330,{size:30,color:C.dim}));
  s+=fade(seg(p,.55,.7),L('x ＞ 0',600,420,{size:36,color:CX,weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  const A=lnAxes();let s=A.svg+A.plot(Math.log,{from:.2,to:4.5,color:CU,w:4});
  s+=dot(A.X(2),A.Y(LN2),9,CH)+label('x ＝ 2',A.X(2)+10,A.Y(LN2)+36,{size:24,color:CX});
  const ang=mix(-.2,1.2,.5+.5*Math.sin(p*6));
  s+=fade(seg(p,.1,.3),tangent(A,2,LN2,ang,.9,C.dim));
  s+=card(770,140,400,210,L('x ＝ 2 での傾きは？',970,210,{size:32,color:CH,weight:700})+fade(seg(p,.4,.6),L('予想してみよう',970,280,{size:26,color:CH})),seg(p,.05,.2),CH);
  return s;
 },
 [K+'gear']:(p)=>{
  let s=pipeline(90,{g:seg(p,0,.2)});
  const th=-1.4*smooth(p);
  s+=fade(seg(p,.1,.3),gear(170,235,50,8,th,CX)+gear(600,235,50,8,-th*.7,CU)+gear(1030,235,50,8,th,CX));
  s+=fade(seg(p,.35,.55),`<path d="M 1030 300 Q 600 420 170 300" fill="none" stroke="${CH}" stroke-width="3" stroke-dasharray="10 7"/>`+label('一周して 元に戻る',600,405,{size:28,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),tex(R`e^{\ln x}=x`,600,470,{size:40}));
  return s;
 },
 [K+'both']:(p)=>{
  const m=texAt([R`\dfrac{d}{dx}\,e^{\ln x}`,R`\;=\;`,R`\dfrac{d}{dx}\,x`],600,130,58,true);
  let s=L('両辺を x で 微分',600,40,{size:26,color:C.dim})+m.svg;
  s+=fade(seg(p,.5,.65),arrow(m.c[2],200,m.c[2],270,{color:CH,w:4,head:14})+tex('1',m.c[2],330,{size:60,auto:false})+L('x の傾き',m.c[2],410,{size:26,color:C.dim}));
  s+=fade(seg(p,.1,.3),L('左辺：二段',m.c[0],250,{size:26,color:C.dim}));
  return s;
 },
 [K+'left']:(p)=>{
  let s=pipeline(90);
  s+=fade(seg(p,.05,.2),L('左辺は 二段 → 連鎖律',600,200,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.35,.55),tex(`${U}=\\ln x`,385,300,{size:48}));
  s+=fade(seg(p,.65,.8),tex(`e^{${U}}`,815,300,{size:52})+L('外側',815,380,{size:26,color:CY}));
  s+=fade(seg(p,.35,.55),L('中身',385,380,{size:26,color:CU}));
  return s;
 },
 [K+'outer']:(p)=>{
  let s=tex(`\\dfrac{d}{d${U}}\\,e^{${U}}=e^{${U}}`,600,120,{size:60});
  s+=L('微分しても 自分自身（初級）',600,230,{size:26,color:C.dim});
  s+=fade(seg(p,.4,.6),tex(`e^{${U}}=e^{\\ln x}=x`,600,330,{size:56}));
  s+=fade(seg(p,.65,.8),L('外側の倍率 ＝ x',600,440,{size:32,color:CY,weight:700}));
  return s;
 },
 [K+'eq']:(p)=>{
  const m=texAt([R`x`,R`\times`,`{\\color{${CU}}(\\ln x)'}`,R`=`,R`1`],600,180,76,true);
  let s=m.svg;
  s+=fade(seg(p,.05,.2),L('外側の倍率',m.c[0],290,{size:26,color:CY}));
  s+=fade(seg(p,.3,.45),L('中身の倍率',m.c[2],290,{size:26,color:CU}));
  s+=fade(seg(p,.6,.75),L('右辺の傾き',m.c[4],290,{size:26,color:C.dim}));
  s+=fade(seg(p,.6,.75),L('連鎖律：外側の倍率 × 中身の倍率',600,420,{size:28,color:C.dim}));
  return s;
 },
 [K+'result']:(p)=>{
  let s=tex(R`x\times(\ln x)'=1`,300,110,{size:44});
  s+=fade(seg(p,.05,.2),L('両辺を x で割る',300,190,{size:24,color:C.dim}));
  s+=fade(seg(p,.1,.3),tex(R`(\ln x)'=\dfrac{1}{x}`,300,320,{size:64}));
  s+=highlight(300-175,200,350,215,seg(p,.35,.5));
  const A=lnAxes({x:640,y:470,w:500,h:400});
  s+=A.svg+A.plot(Math.log,{from:.2,to:4.5,color:CU,w:4})+dot(A.X(2),A.Y(LN2),9,CH);
  s+=fade(seg(p,.55,.75),tangent(A,2,LN2,.5,1.3)+label('傾き 0.5',A.X(2.4),A.Y(LN2)+60,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=tex(R`\dfrac{\ln(2+\Delta x)-\ln 2}{\Delta x}`,600,90,{size:44});
  const hx=[380,820];
  s+=L('Δx',hx[0],200,{size:28,color:CX,weight:700})+L('差の比',hx[1],200,{size:28,color:CH,weight:700})+line(220,222,980,222,{color:C.faint,w:2});
  const rows=[['0.01','約 0.4988'],['0.001','約 0.4999'],['→ 0','→ 0.5']],gs=[seg(p,.05,.2),seg(p,.55,.7),seg(p,.7,.85)];
  rows.forEach((r,i)=>{const y=280+i*70;s+=fade(gs[i],L(r[0],hx[0],y,{size:32,color:CX})+L(r[1],hx[1],y,{size:34,color:i===2?CH:C.ink,weight:i===2?700:400}));});
  s+=fade(seg(p,.85,.95),highlight(230,378,740,58,1));
  return s;
 },
 [K+'mirror']:(p)=>{
  const A=axes({x:330,y:480,w:420,h:420,xmin:-1.5,xmax:3,ymin:-1.5,ymax:3,xticks:[1,2],yticks:[1,2]});
  let s=A.svg;
  s+=fade(seg(p,.05,.2),draw([[A.X(-1.5),A.Y(-1.5)],[A.X(3),A.Y(3)]],1,{color:C.dim,w:2,dash:'8 8'}));
  s+=A.plot(t=>Math.exp(t),{from:-1.5,to:Math.log(3),color:CX,w:4,p:seg(p,.1,.35)});
  s+=A.plot(Math.log,{from:Math.exp(-1.5),to:3,color:CU,w:4,p:seg(p,.45,.7)});
  s+=fade(seg(p,.2,.35),label('e の x 乗',A.X(.2)-150,A.Y(2.4),{size:26,color:CX,weight:700}));
  s+=fade(seg(p,.55,.7),label('ln x',A.X(2.3),A.Y(1.25),{size:26,color:CU,weight:700}));
  s+=card(830,140,340,200,L('斜めの線で',1000,200,{size:28})+L('折り返し',1000,245,{size:28})+L('なめらか → 傾きがある',1000,305,{size:24,color:CH,weight:700}),seg(p,.6,.75));
  return s;
 },
 [K+'neg']:(p)=>{
  const A=axes({x:100,y:450,w:1000,h:380,xmin:-4.6,xmax:4.6,ymin:-1.8,ymax:1.8,xlabel:'x',ylabel:'ln|x|',xticks:[-4,-2,2,4],yticks:[1],xcolor:CX,ycolor:CU});
  let s=A.svg+A.plot(Math.log,{from:.17,to:4.5,color:CU,w:4});
  s+=A.plot(x=>Math.log(-x),{from:-4.5,to:-.17,color:CU,w:4,p:seg(p,.1,.35)});
  s+=fade(seg(p,.3,.5),card(130,320,330,110,tex(R`|x|=-x`,295,370,{size:36})+L('（x ＜ 0）',295,412,{size:22,color:C.dim}),1));
  s+=fade(seg(p,.6,.8),card(740,320,370,90,tex(R`\ln|x|=\ln(-x)`,925,372,{size:34}),1,CH));
  return s;
 },
 [K+'neg2']:(p)=>{
  const m=texAt([R`\dfrac{d}{dx}\ln(-x)=`,`\\dfrac{1}{{\\color{${CK}}-}x}`,R`\times`,`({\\color{${CK}}-}1)`,R`=\dfrac{1}{x}`],600,170,62,true);
  let s=m.svg;
  s+=fade(seg(p,.05,.25),L('外側 ln の倍率',m.c[1],300,{size:24,color:CY}));
  s+=fade(seg(p,.05,.25),L('中身 −x の倍率',m.c[3],300,{size:24,color:CU}));
    s+=fade(seg(p,.6,.75),L('マイナスが 二つ → 打ち消す',600,420,{size:30,color:CK,weight:700}));
  const w4=texWidth(R`=\dfrac{1}{x}`,62,true),rx=600+m.W/2;s+=fade(seg(p,.75,.9),highlight(rx-w4-14,72,w4+28,190,1));
  return s;
 },
 [K+'neg3']:(p)=>{
  const A=axes({x:100,y:490,w:1000,h:310,xmin:-4.6,xmax:4.6,ymin:-1.8,ymax:1.8,xlabel:'x',ylabel:'ln|x|',xticks:[-4,-2,2,4],yticks:[1],xcolor:CX,ycolor:CU});
  let s=A.svg+A.plot(Math.log,{from:.17,to:4.5,color:CU,w:4})+A.plot(x=>Math.log(-x),{from:-4.5,to:-.17,color:CU,w:4});
  s+=dot(A.X(2),A.Y(LN2),8,CH)+dot(A.X(-2),A.Y(LN2),8,CH);
  s+=fade(seg(p,.05,.25),tangent(A,2,LN2,.5,1.2)+L('傾き 1/2',A.X(3.2),A.Y(-.8),{size:26,color:CH,weight:700}));
  s+=fade(seg(p,.2,.4),tangent(A,-2,LN2,-.5,1.2)+L('傾き 1/(−2)',A.X(-3.2),A.Y(-.8),{size:26,color:CH,weight:700}));
  s+=fade(seg(p,.55,.7),card(330,10,440,80,tex(R`\int\frac{1}{t}\,dt=\ln|t|+C`,530,52,{size:34})+label('✓',740,64,{size:34,color:C.F,weight:700}),1,C.F));
  return s;
 },

 // ===== S4 逆数と実数乗 =====
 [K+'rec0']:(p)=>{
  let s=tex(R`f\times\dfrac{1}{f}=1`,600,170,{size:76,auto:false});
  s+=fade(seg(p,.05,.25),L('1/f の傾きは？',600,330,{size:34,color:CH,weight:700}));
  return s;
 },
 [K+'rect']:(p)=>{
  const sc=170,f=mix(1.4,2.3,seg(p,.4,.9)),x0=120,y0=470,w=f*sc,h=sc/f;
  let s=rect(x0,y0-h,w,h,{fill:CX,fo:.18,stroke:CX,sw:3,rx:2});
  s+=label('横 f',x0+w/2,y0+36,{size:26,color:C.ink,anchor:'middle',weight:700})+label('縦 1/f',x0-12,y0-h/2+8,{size:26,color:C.ink,anchor:'end',weight:700});
  s+=label('面積 1',x0+w/2,y0-h/2+10,{size:30,color:CH,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),rect(x0,y0-sc/1.4,1.4*sc,sc/1.4,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:2}));
  s+=card(760,120,400,220,L('面積は いつも 1',960,180,{size:30,color:CH,weight:700})+L('横が 伸びる',960,245,{size:28})+L('→ 縦は 縮む',960,295,{size:28}),seg(p,.1,.3));
  return s;
 },
 [K+'recprod']:(p)=>{
  const m=texAt([`{\\color{${CV}}f'\\times\\dfrac{1}{f}}`,`+`,`{\\color{${CK}}f\\times\\left(\\dfrac{1}{f}\\right)'}`,`=0`],600,175,58);
  let s=m.svg;
  s+=fade(seg(p,.05,.2),L('積の微分 (fg)′ ＝ f′g ＋ fg′ で g ＝ 1/f',600,40,{size:26,color:C.dim}));
  s+=fade(seg(p,.55,.7),L('1 の傾き',m.c[3]+10,290,{size:26,color:C.dim}));
    return s;
 },
 [K+'recstrip']:(p)=>{
  const sc=170,f=1.6,df=.35*seg(p,.05,.35),x0=120,y0=470,w=f*sc,h=sc/f,dh=sc*(1/f-1/(f+df));
  let s=tex(`{\\color{${CV}}f'\\times\\dfrac{1}{f}}+{\\color{${CK}}f\\times\\left(\\dfrac{1}{f}\\right)'}=0`,870,70,{size:36,auto:false});
  s+=rect(x0,y0-h+dh,w,h-dh,{fill:CX,fo:.18,stroke:CX,sw:3,rx:2});
  s+=fade(seg(p,.05,.3),rect(x0+w,y0-h+dh,df*sc,h-dh,{fill:CV,fo:.55,stroke:CV,sw:2,rx:2}));
  s+=fade(seg(p,.3,.5),rect(x0,y0-h,w,dh,{fill:CK,fo:.25,stroke:CK,sw:2,rx:2}));
  s+=label('横 f',x0+w/2,y0+36,{size:26,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.25,.4),label('増えた帯 ＋',x0+w+df*sc+14,y0-60,{size:26,color:CV,weight:700}));
  s+=fade(seg(p,.45,.6),label('減った帯 −',x0+w/2,y0-h-20,{size:26,color:CK,anchor:'middle',weight:700}));
  s+=card(660,170,500,200,L('増えた ＋ 減った ＝ 0',910,240,{size:30,color:CH,weight:700})+L('面積は 1 のまま',910,300,{size:28}),seg(p,.65,.8),CH);
  return s;
 },
 [K+'solve1']:(p)=>{
  const m=texAt([`{\\color{${CV}}f'\\times\\dfrac{1}{f}}`,`+`,`f\\times\\left(\\dfrac{1}{f}\\right)'`,`=0`],600,110,48);
  let s=m.svg;
  s+=fade(seg(p,.05,.3),`<path d="M ${m.c[0]} 170 Q ${m.c[0]+300} 240 ${m.c[3]+40} 180" fill="none" stroke="${CV}" stroke-width="3" stroke-dasharray="8 6"/>`+L('右辺へ移す',m.c[0]+120,250,{size:24,color:CV}));
  s+=fade(seg(p,.35,.55),tex(`f\\times\\left(\\dfrac{1}{f}\\right)'={\\color{${CV}}-\\dfrac{f'}{f}}`,600,370,{size:56,auto:false}));
  return s;
 },
 [K+'solve2']:(p)=>{
  let s=tex(R`f\times\left(\dfrac{1}{f}\right)'=-\dfrac{f'}{f}`,600,100,{size:46,auto:false});
  s+=fade(seg(p,.05,.2),L('両辺を f で割る',600,200,{size:26,color:C.dim}));
  const src=R`\left(\dfrac{1}{f}\right)'=-\dfrac{f'}{f^2}`,W=texWidth(src,64,false);
  s+=fade(seg(p,.1,.3),tex(src,600,335,{size:64,auto:false}));
  s+=highlight(600-W/2-24,222,W+48,200,seg(p,.3,.45));
  s+=fade(seg(p,.55,.7),L('元の傾き ÷ f²，符号を反対に',600,470,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'recex']:(p)=>{
  const A=axes({x:110,y:470,w:560,h:400,xmin:0,xmax:4.6,ymin:0,ymax:2.4,xlabel:'t',ylabel:'1/t',xticks:[1,2,3,4],yticks:[.5,1,2],xcolor:CT,ycolor:CX});
  let s=A.svg+A.plot(t=>1/t,{from:.42,to:4.5,color:CX,w:4})+dot(A.X(2),A.Y(.5),9,CH);
  s+=tex(R`\left(\dfrac{1}{t}\right)'=-\dfrac{1}{t^2}`,930,150,{size:50});
  s+=fade(seg(p,.5,.7),tex(R`-\dfrac{1}{2^2}=-0.25`,930,300,{size:44,auto:false})+L('t ＝ 2',930,390,{size:26,color:CT}));
  s+=fade(seg(p,.6,.8),tangent(A,2,.5,-.25,1.6));
  return s;
 },
 [K+'recex2']:(p)=>{
  const A=axes({x:110,y:470,w:560,h:400,xmin:0,xmax:4.6,ymin:0,ymax:2.4,xlabel:'t',ylabel:'1/t',xticks:[1,2,3,4],yticks:[.5,1,2],xcolor:CT,ycolor:CX});
  let s=A.svg+A.plot(t=>1/t,{from:.42,to:4.5,color:CX,w:4})+dot(A.X(2),A.Y(.5),9,CH)+tangent(A,2,.5,-.25,1.6);
  s+=fade(seg(p,.05,.25),tex(R`\dfrac{\frac{1}{2.01}-\frac{1}{2}}{0.01}\approx-0.2488`,930,180,{size:40,auto:false}));
  s+=fade(seg(p,.55,.75),L('→ −0.25',930,320,{size:36,color:CH,weight:700})+ok(1050,325));
  return s;
 },
 [K+'pow0']:(p)=>{
  const A=axes({x:110,y:470,w:560,h:380,xmin:0,xmax:6.2,ymin:0,ymax:2.7,xlabel:'x',ylabel:'√x',xticks:[1,2,3,4,5,6],yticks:[1,2],xcolor:CX,ycolor:CU});
  let s=A.svg+fade(seg(p,.4,.6),A.plot(Math.sqrt,{from:0,to:6,color:CU,w:4,steps:300}));
  s+=tex(R`(x^n)'=\;?`,930,130,{size:52});
  s+=fade(seg(p,.35,.55),tex(R`x^{1/2}=\sqrt{x}`,930,270,{size:50})+L('n ＝ 1/2（整数でない）',930,350,{size:26,color:C.dim}));
  return s;
 },
 [K+'pow1']:(p)=>{
  let s=tex(R`x=e^{\ln x}`,600,80,{size:50});
  s+=fade(seg(p,.1,.3),L('n 乗する',600,160,{size:26,color:C.dim}));
  s+=fade(seg(p,.2,.4),tex(R`x^n=\left(e^{\ln x}\right)^n=e^{\,n\ln x}`,600,260,{size:56}));
  s+=fade(seg(p,.35,.5),L('指数法則',430,370,{size:26,color:C.dim})+tex(R`(e^a)^n=e^{na}`,660,365,{size:38,auto:false}));
  s+=fade(seg(p,.7,.85),L('x ＞ 0',600,460,{size:32,color:CX,weight:700}));
  return s;
 },
 [K+'pow2']:(p)=>{
  let s=pipeline(90,{ops:['n × ln','e の□乗'],names:['x','u','xⁿ'],cols:[CX,CU,CY]});
  s+=fade(seg(p,.05,.2),tex(`${U}=n\\ln x`,385,210,{size:40})+tex(`${Y}=e^{${U}}`,815,210,{size:40}));
  s+=fade(seg(p,.2,.4),L('外側の倍率',815,300,{size:26,color:CY})+tex(`e^{${U}}=x^n`,815,370,{size:44}));
  s+=fade(seg(p,.6,.8),L('中身の倍率',385,300,{size:26,color:CU})+tex(R`n\times\dfrac{1}{x}=\dfrac{n}{x}`,385,380,{size:44}));
  return s;
 },
 [K+'pow3']:(p)=>{
  const src=R`(x^n)'=x^n\times\dfrac{n}{x}=n\,x^{n-1}`,W=texWidth(src,64);
  let s=tex(src,600,160,{size:64});
  s+=highlight(600-W/2-24,70,W+48,180,seg(p,.3,.45));
  s+=fade(seg(p,.5,.7),L('n は 整数でなくてよい',600,330,{size:32,color:CH,weight:700}));
  s+=fade(seg(p,.65,.85),L('n が整数のときと 同じ形',600,400,{size:26,color:C.dim}));
  return s;
 },
 [K+'sqrt']:(p)=>{
  let s=tex(R`n=\tfrac12`,600,60,{size:40,auto:false});
  s+=fade(seg(p,.1,.3),tex(R`\left(\sqrt{x}\right)'=\dfrac12\,x^{-1/2}`,600,190,{size:56}));
  s+=fade(seg(p,.5,.7),tex(R`=\dfrac{1}{2\sqrt{x}}`,600,340,{size:60}));
  return s;
 },
 [K+'sqrt2']:(p)=>{
  const A=axes({x:110,y:470,w:560,h:380,xmin:0,xmax:6.2,ymin:0,ymax:2.7,xlabel:'x',ylabel:'√x',xticks:[1,2,3,4,5,6],yticks:[1,2],xcolor:CX,ycolor:CU});
  let s=A.svg+A.plot(Math.sqrt,{from:0,to:6,color:CU,w:4,steps:300})+dot(A.X(4),A.Y(2),9,CH);
  s+=fade(seg(p,.05,.25),tangent(A,4,2,.25,2.2)+label('傾き 0.25',A.X(3.2),A.Y(2)-40,{size:26,color:CH,weight:700}));
  s+=fade(seg(p,.05,.25),tex(R`\dfrac{1}{2\times2}=0.25`,930,140,{size:46,auto:false}));
  s+=fade(seg(p,.45,.65),tex(R`\dfrac{\sqrt{4.01}-2}{0.01}\approx0.2498`,930,300,{size:42,auto:false}));
  return s;
 },

 // ===== S5 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=L('道具',230,60,{size:26,color:C.dim});
  const tools=[['連鎖律',R`\dfrac{dy}{dt}=\dfrac{dy}{du}\dfrac{du}{dt}`],['積の微分',R`(fg)'=f'g+fg'`]];
  tools.forEach(([j,t],i)=>{const y=150+i*150;s+=fade(seg(p,.05+i*.15,.2+i*.15),rect(40,y-60,380,125,{fill:'#131f38',fo:.96,stroke:CH,sw:2,rx:14})+label(j,230,y-22,{size:26,color:CH,anchor:'middle',weight:700})+tex(t,230,y+32,{size:30,auto:i===0}));});
  s+=fade(seg(p,.5,.7),L('仮定：どれも微分できる',230,470,{size:26,color:C.F,weight:700}));
  s+=fade(seg(p,.5,.7),L('⇒ 差の比の極限から 証明',780,250,{size:34,color:CH,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s='';
  const tools=[['連鎖律',150],['積の微分',270],['e の□乗の微分は 自分自身',390]];
  tools.forEach(([j,y])=>{s+=rect(40,y-40,380,80,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+label(j,230,y+9,{size:j.length>6?22:26,color:CH,anchor:'middle',weight:700});});
  const res=[[R`(\ln x)'=\dfrac1x`,130],[R`\left(\dfrac1f\right)'=-\dfrac{f'}{f^2}`,270],[R`(x^n)'=n\,x^{n-1}`,410]];
  res.forEach(([t,y],i)=>{const g=seg(p,.2+i*.2,.35+i*.2);s+=fade(g,arrow(430,y,620,y,{color:C.dim,w:3,head:12})+rect(640,y-55,500,110,{fill:'#131f38',fo:.96,stroke:CH,sw:2,rx:14})+tex(t,890,y+8,{size:i===1?32:40,auto:i!==1}));});
  return s;
 },
 [K+'next1']:(p)=>{
  let s=hillMap({east:seg(p,.35,.5),north:seg(p,.45,.6)});
  s+=card(680,110,470,230,tex('h(x,y)',915,175,{size:48})+L('一方向だけ → 偏微分',915,250,{size:28})+L('（中級 2/2）',915,300,{size:24,color:C.dim}),seg(p,.1,.3));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=hillMap({east:1,north:1});
  s+=fade(seg(p,.1,.3),arrow(MX(1),MY(2),MX(1.5),MY(2.55),{color:CH,w:6,head:18})+label('？',MX(1.55),MY(2.65),{size:40,color:CH,weight:700}));
  s+=card(680,110,470,230,L('東にも 北にも',915,190,{size:32,color:CH,weight:700})+L('同時に進むと',915,245,{size:32,color:CH,weight:700})+L('高さの変化は？',915,305,{size:32,color:CH,weight:700}),seg(p,.2,.35),CH);
  return s;
 },
};
