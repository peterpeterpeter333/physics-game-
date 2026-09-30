// YouTube シリーズ 微分・初級 3/3（ステージ ui-average-to-now、units[2]）— 図。Stage 1200×515.
// 色：位置 x 水色、速さ v 紫、時刻 t 金、強調 黄、誤り 赤、正しい 緑（anim.mjs の C）。
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth} from './anim.mjs';

const K='ui-average-to-now-3';
const xt=t=>5*t*t;

// ---- speedometer (same as the approved sample) --------------------------------------------
function meter(cx,cy,r,kmh,{readout=''}={}){
 const MAX=60,ang=v=>(210-240*clamp(v/MAX))*Math.PI/180,P=(v,rr)=>[cx+rr*Math.cos(ang(v)),cy-rr*Math.sin(ang(v))];
 let s=ring(cx,cy,r+14,{color:C.faint,w:3,fill:'#10182c'});
 s+=draw(Array.from({length:61},(_,i)=>P(i,r)),1,{color:C.dim,w:4});
 for(let v=0;v<=MAX;v+=10){const [x1,y1]=P(v,r-6),[x2,y2]=P(v,r-26),[lx,ly]=P(v,r-52);s+=line(x1,y1,x2,y2,{color:C.dim,w:3})+label(String(v),lx,ly+8,{size:22,color:C.dim,anchor:'middle'});}
 const [nx,ny]=P(kmh,r-30);s+=line(cx,cy,nx,ny,{color:C.a,w:6})+dot(cx,cy,10,C.a);
 s+=label('km/h',cx,cy+50,{size:22,color:C.dim,anchor:'middle'});
 if(readout){const w=Math.max(200,readout.length*22);s+=rect(cx-w/2,cy+r+30,w,52,{fill:'#0d1526',fo:1,stroke:C.v,sw:2,rx:10})+label(readout,cx,cy+r+66,{size:28,color:C.v,anchor:'middle',weight:700});}
 return s;
}

// ---- x–t graph of x = 5t² (left half) ----------------------------------------------------
function graph({g=1,dim=1}={}){
 const A=axes({x:110,y:450,w:520,h:340,xmax:2.3,ymax:26,xlabel:'時刻 t [s]',ylabel:'位置 x [m]',xticks:[1,2],yticks:[5,10,15,20,25],grid:true,g,xcolor:C.t,ycolor:C.x});
 return {A,svg:fade(dim,A.svg+A.plot(xt,{from:0,to:2.2,color:C.x,w:4}))};
}
function pt(A,t,g=1,color=C.hi,r=9){return fade(g,dot(A.X(t),A.Y(xt(t)),r,color));}
function secant(A,t1,t2,{g=1,color=C.v,w=4,ext=.35}={}){
 const k=(xt(t2)-xt(t1))/(t2-t1),a=Math.max(0.05,Math.min(t1,t2)-ext),b=Math.min(2.25,Math.max(t1,t2)+ext);
 return draw([[A.X(a),A.Y(xt(t1)+k*(a-t1))],[A.X(b),A.Y(xt(t1)+k*(b-t1))]],g,{color,w});
}
// straight line of slope k through (t0, x(t0)), clipped to the plot box
function slopeLine(A,t0,k,{g=1,color=C.hi,w=4,from=.2,to=2.25,dash=''}={}){
 const y0=xt(t0);let a=from,b=to;
 const lo=-1,hi=26;
 if(k>0){a=Math.max(a,t0+(lo-y0)/k);b=Math.min(b,t0+(hi-y0)/k);}
 if(k<0){a=Math.max(a,t0+(hi-y0)/k);b=Math.min(b,t0+(lo-y0)/k);}
 return draw([[A.X(a),A.Y(y0+k*(a-t0))],[A.X(b),A.Y(y0+k*(b-t0))]],g,{color,w,dash});
}
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const hEase=(p,a,b,h0,h1)=>Math.pow(10,mix(Math.log10(h0),Math.log10(h1),seg(p,a,b)));

// ---- ÷ check rows -------------------------------------------------------------------------
function checkRows(p,step){
 const Y=[130,245,360];let s='';
 const r1=step===0?seg(p,.05,.25):1,r1b=step===0?seg(p,.5,.7):1;
 s+=fade(step>0?.55:1,
   fade(r1,tex('6\\div2=3',330,Y[0],{size:48,auto:false}))
  +fade(r1b,label('⇔',600,Y[0]+12,{size:40,color:C.dim,anchor:'middle'})+tex('3\\times2=6',860,Y[0],{size:48,auto:false})+ok(1010,Y[0]+14)));
 if(step>=1){const a=step===1?seg(p,.05,.3):1,b=step===1?seg(p,.45,.7):1;
  s+=fade(a,tex('0\\div0=\\square',330,Y[1],{size:48,auto:false,color:C.hi}))
   +fade(b,label('⇔',600,Y[1]+12,{size:40,color:C.dim,anchor:'middle'})+tex('\\square\\times0=0',860,Y[1],{size:48,auto:false,color:C.hi}));
  s+=fade(a,label('答えを □ と置く',330,Y[1]+62,{size:24,color:C.dim,anchor:'middle'}));
 }
 if(step>=2){
  const tr=[['10',.08],['15',.35],['100',.62]];
  tr.forEach(([n,at],i)=>{const g=step===2?seg(p,at,at+.15):1,x=260+i*330;
   s+=fade(g,tex(`${n}\\times0=0`,x,Y[2]+20,{size:40,auto:false})+ok(x+texWidth(`${n}\\times0=0`,40,false)/2+16,Y[2]+32));});
 }
 return s;
}

// ---- number line of values near 10 -------------------------------------------------------
function valueLine(p){
 const X=v=>600+(v-10)*800,y=300;let s=line(150,y,1050,y,{color:C.dim,w:3});
 for(const v of [9.5,10,10.5])s+=line(X(v),y-10,X(v),y+10,{color:C.dim,w:2})+(v===10?label('10',X(v),y+52,{size:32,color:C.hi,anchor:'middle',weight:700}):'');
 s+=ring(X(10),y,14,{color:C.hi,w:4});
 const L=[[9.5,'9.5',.05],[9.95,'9.95',.25]],R=[[10.5,'10.5',.45],[10.05,'10.05',.6]];
 for(const [v,t,a] of L)s+=fade(seg(p,a,a+.12),dot(X(v),y,10,C.v)+label(t,X(v),y-40,{size:24,color:C.v,anchor:'middle'}));
 for(const [v,t,a] of R)s+=fade(seg(p,a,a+.12),dot(X(v),y,10,C.v)+label(t,X(v),y-40,{size:24,color:C.v,anchor:'middle'}));
 s+=fade(seg(p,.72,.85),arrow(230,y+100,X(10)-40,y+100,{color:C.F,w:4})+label('下から（0.9 s, 0.99 s）',240,y+145,{size:24,color:C.F}));
 s+=fade(seg(p,.72,.85),arrow(970,y+100,X(10)+40,y+100,{color:C.F,w:4})+label('上から（1.1 s, 1.01 s）',960,y+145,{size:24,color:C.F,anchor:'end'}));
 return s;
}

// ---- table of widths -----------------------------------------------------------------------
const ROWS=[['1','15'],['0.5','12.5'],['0.1','10.5'],['0.01','10.05']];
function table(x,y,{show=[1,1,1,1],hl=-1,hg=0}={}){
 let s=rect(x,y,440,330,{fill:'#131f38',fo:.96,stroke:C.faint,rx:14});
 s+=label('幅 h [s]',x+110,y+48,{size:26,color:C.t,anchor:'middle'})+label('平均 [m/s]',x+320,y+48,{size:26,color:C.v,anchor:'middle'});
 s+=line(x+20,y+70,x+420,y+70,{color:C.faint,w:2});
 ROWS.forEach(([h,v],i)=>{const yy=y+120+i*60;
  s+=fade(show[i],label(h,x+110,yy,{size:30,color:C.t,anchor:'middle'})+label(v,x+320,yy,{size:32,color:C.v,anchor:'middle',weight:700}));
  if(i===hl)s+=highlight(x+14,yy-40,412,56,hg);
 });
 return s;
}

// ---- Δ → d rows ----------------------------------------------------------------------------
function deltaTop(p,step){
 let s=fade(step===0?seg(p,0,.15):1,label('平均の速さ',300,110,{size:28,color:C.v,anchor:'middle',weight:700})+tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}',300,215,{size:56}));
 if(step===0)s+=fade(seg(p,.45,.6),label('Δ：区間のあいだの 変化の量',300,330,{size:26,color:C.dim,anchor:'middle'}));
 if(step>=1){const g=step===1?seg(p,.1,.35):1,g2=step===1?seg(p,.45,.65):1;
  s+=arrow(470,200,640,200,{color:C.hi,w:5,g})+fade(g,label('幅 → 0 の行き先',555,160,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(g2,label('瞬間の速さ',860,110,{size:28,color:C.v,anchor:'middle',weight:700})+tex('v=\\dfrac{dx}{dt}',860,215,{size:64}));
  if(step===1)s+=fade(seg(p,.55,.75),label('Δ を d に書きかえる',860,330,{size:26,color:C.dim,anchor:'middle'}));
 }
 return s;
}

export const ytUiAvgNow3Diagrams={
 // ===== S1 幅を0にして割れば？ =====
 [`${K}:recap`]:(p)=>{
  const {A,svg}=graph({g:seg(p,0,.12)});const h=hEase(p,.15,.75,1,.03);
  let s=svg+pt(A,1)+pt(A,1+h)+secant(A,1,1+h,{g:seg(p,.1,.2)});
  s+=card(700,110,470,300,label('前回',935,158,{size:24,color:C.dim,anchor:'middle'})
   +label('1 s から 幅 h の平均の速さ',935,215,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),tex('\\bar v=10+5h',935,300,{size:54}))
   +fade(seg(p,.6,.75),label(`h ＝ ${fmt(h,2)} s → ${fmt(10+5*h,2)} m/s`,935,375,{size:26,color:C.t,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [`${K}:ask`]:(p)=>{
  const {A,svg}=graph();const h=.03;
  let s=svg+pt(A,1)+pt(A,1+h)+secant(A,1,1+h);
  s+=card(700,110,470,300,label('今回の問い',935,160,{size:24,color:C.dim,anchor:'middle'})
   +label('h ＝ 0 にして 割れば',935,235,{size:32,color:C.ink,anchor:'middle'})
   +label('1秒ちょうどの速さが 出る？',935,295,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('予想してみよう',935,370,{size:26,color:C.hi,anchor:'middle'})),1,C.hi);
  return s;
 },
 [`${K}:merge`]:(p)=>{
  const {A,svg}=graph();const h=.3*(1-seg(p,.15,.7));
  let s=svg+pt(A,1)+(h>.002?pt(A,1+h,1,C.hi,7):'')+fade(1-seg(p,.55,.7),secant(A,1,1+Math.max(h,.002)));
  s+=arrow(A.X(1)-60,A.Y(5)-45,A.X(1)-20,A.Y(5)-16,{color:C.hi,w:4,g:seg(p,.7,.85)});
  s+=fade(seg(p,.72,.85),ring(A.X(1),A.Y(5),22,{color:C.hi,w:3})+label('ぴったり重なる',A.X(1)-30,A.Y(5)-50,{size:26,color:C.hi,anchor:'end'}));
  s+=card(700,110,470,200,label('幅',800,195,{size:30,color:C.t})+label(`h ＝ ${h<.001?'0':fmt(h,2)} s`,880,195,{size:36,color:C.t,weight:700})
   +label('右の点を 1秒の点へ',935,265,{size:26,color:C.dim,anchor:'middle'}),1);
  return s;
 },
 [`${K}:zero`]:(p)=>{
  const {A,svg}=graph();let s=svg+pt(A,1)+ring(A.X(1),A.Y(5),22,{color:C.hi,w:3});
  s+=card(700,90,470,330,
    fade(seg(p,.05,.25),label('進んだ距離',730,150,{size:26,color:C.x})+tex('\\Delta x=5-5=0\\,\\mathrm{m}',935,215,{size:44,auto:false,color:C.x}))
   +fade(seg(p,.5,.7),label('かかった時間',730,300,{size:26,color:C.t})+tex('\\Delta t=1-1=0\\,\\mathrm{s}',935,365,{size:44,auto:false,color:C.t})),1);
  return s;
 },
 [`${K}:zero2`]:(p)=>{
  const {A,svg}=graph();let s=svg+pt(A,1)+ring(A.X(1),A.Y(5),22,{color:C.hi,w:3});
  s+=card(700,90,470,330,
    label('平均の速さの式に 入れると',935,145,{size:26,color:C.dim,anchor:'middle'})
   +tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}',935,225,{size:48})
   +fade(seg(p,.2,.4),tex('=\\dfrac{0\\,\\mathrm{m}}{0\\,\\mathrm{s}}=\\;?',935,350,{size:52,auto:false,color:C.a})),1,C.a);
  return s;
 },
 [`${K}:check`]:(p)=>checkRows(p,0)+fade(seg(p,.3,.45),label('割り算の答えは 掛け算で確かめられる',600,470,{size:28,color:C.dim,anchor:'middle'})),
 [`${K}:check2`]:(p)=>checkRows(p,1),
 [`${K}:check3`]:(p)=>checkRows(p,2)+fade(seg(p,.8,.95),label('□ に何を入れても 成り立つ',600,480,{size:28,color:C.hi,anchor:'middle'})),
 [`${K}:check4`]:(p)=>checkRows(p,3)+card(250,432,700,74,label('0 ÷ 0 は 一つの値に 決まらない',600,480,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.25),C.a),
 [`${K}:onepoint`]:(p)=>{
  const {A,svg}=graph();let s=svg;
  const ks=[[10,.05],[2,.2],[25,.35],[-4,.5],[5,.62]];
  ks.forEach(([k,a])=>{s+=slopeLine(A,1,k,{g:seg(p,a,a+.15),color:C.v,w:3,from:.25,to:2.1});});
  s+=pt(A,1,1,C.hi,10);
  s+=card(700,130,470,250,label('点が 1つだけ',935,195,{size:32,color:C.ink,anchor:'middle'})
   +label('通る直線は 何本でも引ける',935,260,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.7,.85),label('傾きが 決まらない',935,335,{size:34,color:C.a,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },

 // ===== S2 0へ近づける =====
 [`${K}:approach`]:(p)=>{
  const X=h=>150+h*850,y=260;let s=line(120,y,1060,y,{color:C.dim,w:3});
  s+=label('幅 h [s]',1072,y+8,{size:24,color:C.t});
  const hs=[[1,'1',.05],[.5,'0.5',.15],[.1,'0.1',.25],[.01,'0.01',.35]];
  hs.forEach(([h,t,a],i)=>{s+=fade(seg(p,a,a+.1),dot(X(h),y,10,C.t)+label(t,X(h)+(i===3?14:0),y+(i===3?-26:44),{size:24,color:C.t,anchor:i===3?'start':'middle'}));});
  s+=arrow(X(.45),y-100,X(.03),y-100,{color:C.hi,w:4,g:seg(p,.35,.55)})+fade(seg(p,.4,.55),label('0 へ 近づける',X(.25),y-122,{size:26,color:C.hi,anchor:'middle'}));
  s+=ring(X(0),y,12,{color:C.a,w:3,fill:C.bg})+label('0',X(0),y+44,{size:26,color:C.a,anchor:'middle'});
  s+=fade(seg(p,.55,.7),label('0 そのものは 入れない',X(0)-20,y+90,{size:26,color:C.a}));
  s+=card(280,390,640,90,label('h ≠ 0 なら 割り算ができる',600,448,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,.72,.87),C.F);
  return s;
 },
 [`${K}:table`]:(p)=>{
  let s=table(90,100,{show:[seg(p,.05,.18),seg(p,.25,.38),seg(p,.45,.58),seg(p,.65,.78)]});
  s+=fade(seg(p,.8,.95),arrow(560,250,700,250,{color:C.hi,w:5})+label('10 へ 寄っていく',720,260,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [`${K}:ex1`]:(p)=>{
  let s=table(90,100,{hl:2,hg:seg(p,0,.15)});
  s+=card(590,100,580,330,label('幅 0.1 s を確かめる',880,150,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.25,.45),label('1.1 s の位置',620,215,{size:24,color:C.x})+tex('x=5\\times1.1^2',880,270,{size:44}))
   +fade(seg(p,.6,.8),tex('=5\\times1.21=6.05\\,\\mathrm{m}',880,370,{size:44,auto:false,color:C.x})),1);
  return s;
 },
 [`${K}:ex2`]:(p)=>{
  let s=table(90,100,{hl:2,hg:1});
  s+=card(590,100,580,330,label('幅 0.1 s を確かめる',880,150,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.02,.2),tex('\\Delta x=6.05-5=1.05\\,\\mathrm{m}',880,230,{size:40,auto:false,color:C.x}))
   +fade(seg(p,.4,.6),tex('\\bar v=\\dfrac{1.05\\,\\mathrm{m}}{0.1\\,\\mathrm{s}}=10.5\\,\\mathrm{m/s}',880,350,{size:42,auto:false,color:C.v})),1);
  s+=fade(seg(p,.75,.9),label('表と一致 ✓',880,470,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [`${K}:formula`]:(p)=>{
  let s=tex('\\bar v=\\dfrac{10h+5h^2}{h}',300,150,{size:52});
  s+=fade(seg(p,.2,.4),tex('=\\dfrac{\\cancel{h}\\,(10+5h)}{\\cancel{h}}',300+texWidth('\\bar v=\\dfrac{10h+5h^2}{h}',52)/2+14,150,{size:52,auto:false,anchor:'start'}));
  s+=fade(seg(p,.5,.65),label('h ≠ 0 なので 約分できる',720,275,{size:28,color:C.F,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),tex('\\bar v=10+5h',600,400,{size:64})+highlight(600-texWidth('\\bar v=10+5h',64)/2-24,358,texWidth('\\bar v=10+5h',64)+48,84,1));
  return s;
 },
 [`${K}:quiz`]:(p)=>{
  let s=tex('\\bar v=10+5h',600,90,{size:52});
  s+=card(250,170,700,220,label('確かめ',600,225,{size:26,color:C.dim,anchor:'middle'})
   +label('幅 h ＝ 0.2 s なら',600,290,{size:34,color:C.t,anchor:'middle'})
   +label('平均の速さは？',600,350,{size:34,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [`${K}:quiz2`]:(p)=>{
  let s=tex('\\bar v=10+5h',600,90,{size:52});
  s+=fade(seg(p,.02,.2),tex('10+5\\times0.2=11\\,\\mathrm{m/s}',600,190,{size:48,auto:false,color:C.v}));
  s+=fade(seg(p,.4,.55),label('位置から 計算しても',120,285,{size:26,color:C.dim})+tex('x(1.2)=5\\times1.2^2=7.2\\,\\mathrm{m}',600,300,{size:40,auto:false,color:C.x}));
  s+=fade(seg(p,.6,.78),tex('\\bar v=\\dfrac{7.2-5}{0.2}=\\dfrac{2.2}{0.2}=11\\,\\mathrm{m/s}',600,420,{size:42,auto:false,color:C.v}));
  s+=fade(seg(p,.85,.95),label('一致 ✓',1080,430,{size:30,color:C.F,anchor:'end',weight:700}));
  return s;
 },
 [`${K}:tiny`]:(p)=>{
  let s=tex('\\bar v=10+5h',600,90,{size:52});
  const rows=[['0.001','10.005',.1],['0.0001','10.0005',.5]];
  rows.forEach(([h,v,a],i)=>{const y=220+i*110;
   s+=fade(seg(p,a,a+.15),label(`h ＝ ${h}`,250,y,{size:34,color:C.t})+label('→',610,y,{size:34,color:C.dim,anchor:'middle'})+label(`${v} m/s`,950,y,{size:36,color:C.v,anchor:'end',weight:700}));});
  return s;
 },
 [`${K}:bar`]:(p)=>{
  let s=tex('\\bar v=10+5h',600,90,{size:52});
  const h=hEase(p,.1,.8,1,.0001),W=560,x0=250,y=220;
  const w10=W*10/15,w5=W*5*h/15;
  s+=rect(x0,y,w10,60,{fill:C.v,fo:.55,rx:6})+rect(x0+w10,y,w5,60,{fill:C.a,fo:.8,rx:6});
  s+=label('10（そのまま）',x0+w10/2,y+100,{size:28,color:C.v,anchor:'middle'});
  s+=label('5h',Math.min(x0+w10+Math.max(w5,4)/2,x0+w10+10),y-18,{size:28,color:C.a,anchor:w5>40?'middle':'start'});
  s+=label(`h ＝ ${h<.00015?'0.0001':fmt(h,h<.01?4:2)}`,250,410,{size:30,color:C.t});
  s+=label(`5h ＝ ${h<.00015?'0.0005':fmt(5*h,h<.01?4:2)}`,560,410,{size:30,color:C.a});
  s+=fade(seg(p,.8,.95),label('小さくなるのは 5h だけ',600,480,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [`${K}:limit`]:(p)=>{
  let s=tex('\\bar v=10+5h',600,90,{size:52});
  s+=fade(seg(p,.05,.25),tex('10+5h\\;\\xrightarrow{\\;h\\,\\to\\,0\\;}\\;10',600,230,{size:66,auto:false,color:C.v}));
  s+=card(250,330,700,140,label('行き先 ＝ 10 m/s',600,385,{size:36,color:C.hi,anchor:'middle',weight:700})
   +label('＝ 1秒ちょうどの速さ と決める',600,440,{size:28,color:C.ink,anchor:'middle'}),seg(p,.55,.7),C.hi);
  return s;
 },
 [`${K}:notsub`]:(p)=>{
  let s=tex('10+5h\\;\\xrightarrow{\\;h\\,\\to\\,0\\;}\\;10',600,110,{size:52,auto:false,color:C.v});
  s+=card(120,210,450,230,label('✕',170,275,{size:40,color:C.a,weight:700})+label('h に 0 を入れて割る',220,275,{size:28,color:C.ink})
   +tex('\\dfrac{0}{0}\\ \\text{?}',345,375,{size:52,auto:false,color:C.a}),seg(p,.05,.2),C.a);
  s+=card(630,210,450,230,label('○',680,275,{size:40,color:C.F,weight:700})+label('h を 0 へ近づけた',735,275,{size:28,color:C.ink})
   +label('値が向かう先',855,330,{size:28,color:C.ink,anchor:'middle'})+tex('\\to 10',855,400,{size:52,auto:false,color:C.F}),seg(p,.45,.6),C.F);
  return s;
 },
 [`${K}:left`]:(p)=>{
  const {A,svg}=graph();let s=svg+secant(A,.9,1,{g:seg(p,.05,.25),ext:.4})+pt(A,.9)+pt(A,1);
  s+=fade(seg(p,.05,.2),line(A.X(.9),A.Y(xt(.9)),A.X(.9),A.Y(0),{color:C.t,w:2,dash:'5 5'})+label('0.9 s',A.X(.9)+8,A.Y(0)+34,{size:22,color:C.t,anchor:'end'}));
  s+=card(700,90,470,340,label('1秒より 前の区間',935,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.2,.4),tex('x(0.9)=5\\times0.81=4.05',935,210,{size:36,auto:false,color:C.x}))
   +fade(seg(p,.4,.6),tex('\\Delta x=5-4.05=0.95',935,280,{size:36,auto:false,color:C.x}))
   +fade(seg(p,.6,.8),tex('\\bar v=\\dfrac{0.95\\,\\mathrm{m}}{0.1\\,\\mathrm{s}}=9.5\\,\\mathrm{m/s}',935,380,{size:38,auto:false,color:C.v})),1);
  return s;
 },
 [`${K}:left2`]:(p)=>tex('\\bar v\\ [\\mathrm{m/s}]',600,90,{size:40,auto:false,color:C.v})+valueLine(p),

 // ===== S3 グラフで見る行き先 =====
 [`${K}:secant`]:(p)=>{
  const {A,svg}=graph({g:seg(p,0,.1)});let s=svg+pt(A,1)+pt(A,2)+secant(A,1,2,{g:seg(p,.1,.4)});
  s+=card(700,130,470,220,label('2点を結ぶ直線の 傾き',935,200,{size:30,color:C.ink,anchor:'middle'})
   +label('＝ その区間の 平均の速さ',935,260,{size:30,color:C.v,anchor:'middle',weight:700})
   +fade(seg(p,.65,.8),label('1 s〜2 s：15 m/s',935,320,{size:26,color:C.dim,anchor:'middle'})),seg(p,.35,.5));
  return s;
 },
 [`${K}:shrink`]:(p)=>{
  const {A,svg}=graph();
  const h=p<.1?1:p<.35?mix(1,.5,seg(p,.1,.35)):p<.7?mix(.5,.1,seg(p,.4,.7)):.1;
  let s=svg+secant(A,1,2,{color:C.faint,w:3})+pt(A,1)+pt(A,1+h)+secant(A,1,1+h);
  const vals=[['15',0],['12.5',.35],['10.5',.7]];let t='';
  vals.forEach(([v,a],i)=>{t+=fade(a?seg(p,a,a+.08):1,label(v,780+i*155,260,{size:36,color:C.v,anchor:'middle',weight:700}));if(i<2)t+=fade(seg(p,vals[i+1][1],vals[i+1][1]+.08),label('→',857+i*155,260,{size:30,color:C.dim,anchor:'middle'}));});
  s+=card(700,150,470,230,label('傾き（平均の速さ）',935,200,{size:28,color:C.dim,anchor:'middle'})+t
   +fade(seg(p,.8,.92),label('直線が 寝ていく',935,335,{size:28,color:C.hi,anchor:'middle'})),1);
  return s;
 },
 [`${K}:tangent`]:(p)=>{
  const {A,svg}=graph();let s=svg+secant(A,1,1.1,{color:C.faint,w:3});
  s+=slopeLine(A,1,10,{g:seg(p,.05,.35),color:C.hi,w:5,from:.45,to:1.9});
  s+=pt(A,1,1,C.hi,10);
  // slope triangle on the line: 0.5 s along, 5 m up
  const g=seg(p,.55,.75),x1=A.X(1),y1=A.Y(5),x2=A.X(1.5),y2=A.Y(10);
  s+=fade(g,line(x1,y1,x2,y1,{color:C.t,w:4})+line(x2,y1,x2,y2,{color:C.x,w:4})+label('0.5 s',(x1+x2)/2,y1+32,{size:22,color:C.t,anchor:'middle'})+label('5 m',x2+10,(y1+y2)/2+8,{size:22,color:C.x}));
  s+=card(700,130,470,260,label('1秒の点で 曲線に',935,195,{size:28,color:C.ink,anchor:'middle'})
   +label('そっと触れる直線',935,245,{size:28,color:C.hi,anchor:'middle',weight:700})
   +fade(g,tex('\\dfrac{5\\,\\mathrm{m}}{0.5\\,\\mathrm{s}}=10\\,\\mathrm{m/s}',935,335,{size:40,auto:false,color:C.v})),seg(p,.25,.4));
  return s;
 },
 [`${K}:zoom`]:(p)=>{
  const {A,svg}=graph();let s=svg+slopeLine(A,1,10,{color:C.hi,w:3,from:.45,to:1.9})+pt(A,1,1,C.hi,8);
  const g=seg(p,.05,.25);
  s+=fade(g,rect(A.X(.9)-4,A.Y(6)-4,A.X(1.1)-A.X(.9)+8,A.Y(4)-A.Y(6)+8,{fill:C.hi,fo:.05,stroke:C.hi,sw:2,rx:4}));
  // inset: t in [0.9,1.1] → 700..1160, x in [4,6] → 440..120
  const bx=700,by=110,bw=460,bh=320,T=t=>bx+(t-.9)/.2*bw,Xp=v=>by+bh-(v-3.9)/2.2*bh;
  let ins=rect(bx,by,bw,bh,{fill:'#0d1526',fo:1,stroke:C.hi,sw:2,rx:8});
  ins+=draw([[T(.9),Xp(4)],[T(1.1),Xp(6)]],1,{color:C.hi,w:3});
  ins+=draw(Array.from({length:61},(_,i)=>{const t=.9+.2*i/60;return [T(t),Xp(xt(t))];}),seg(p,.2,.5),{color:C.x,w:5});
  ins+=dot(T(1),Xp(5),8,C.hi);
  ins+=label('0.9 s',T(.9)+8,by+bh-12,{size:22,color:C.t})+label('1.1 s',T(1.1)-8,by+bh-12,{size:22,color:C.t,anchor:'end'});
  s+=fade(g,line(A.X(1.1)+4,A.Y(6)-4,bx,by,{color:C.hi,w:1.5,dash:'6 6'})+line(A.X(1.1)+4,A.Y(4)+4,bx,by+bh,{color:C.hi,w:1.5,dash:'6 6'})+ins);
  s+=fade(seg(p,.55,.7),label('拡大すると ほぼまっすぐ',930,160,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),label('傾き 10 m/s',1140,300,{size:28,color:C.hi,anchor:'end',weight:700}));
  return s;
 },

 // ===== S4 v = dx/dt =====
 [`${K}:name`]:(p)=>card(250,110,700,300,label('1秒ちょうどの速さ',600,185,{size:34,color:C.ink,anchor:'middle'})
   +fade(seg(p,.3,.45),label('→ t ＝ 1 s での 瞬間の速さ',600,260,{size:34,color:C.v,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),label('10 m/s',600,350,{size:48,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15)),
 [`${K}:delta`]:(p)=>deltaTop(p,0),
 [`${K}:dxdt`]:(p)=>deltaTop(p,1),
 [`${K}:dmean`]:(p)=>deltaTop(p,2)+card(160,300,880,170,
   fade(seg(p,.05,.2),label('d：幅を 限りなく縮める 約束の印',600,360,{size:30,color:C.hi,anchor:'middle',weight:700}))
  +fade(seg(p,.5,.65),label('dx/dt で ひとまとまりの記号 ＝ 行き先',600,425,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.1)),
 [`${K}:v1`]:(p)=>deltaTop(p,2)+card(160,300,880,170,
   fade(seg(p,.35,.5),label('x ＝ 5t² の運動で',400,395,{size:28,color:C.dim,anchor:'middle'})+label('t ＝ 1 s で',400,440,{size:28,color:C.t,anchor:'middle'}))
  +fade(seg(p,.45,.6),label('v ＝ 10 m/s',780,425,{size:44,color:C.v,anchor:'middle',weight:700})),1),
 [`${K}:unit`]:(p)=>deltaTop(p,2)+card(160,300,880,170,
   label('単位',260,395,{size:28,color:C.dim,anchor:'middle'})
  +fade(seg(p,.1,.3),tex('\\dfrac{\\mathrm{m}}{\\mathrm{s}}=\\mathrm{m/s}',520,395,{size:44,auto:false}))
  +fade(seg(p,.5,.7),label('平均と同じ',840,405,{size:30,color:C.F,anchor:'middle',weight:700})),1),
 [`${K}:t2`]:(p)=>{
  let s=label('2 s から 幅 h',120,90,{size:28,color:C.t});
  s+=fade(seg(p,.1,.3),tex('\\Delta x=5(2+h)^2-5\\cdot2^2',150,180,{size:44,anchor:'start'}));
  s+=fade(seg(p,.3,.5),tex('=20h+5h^2',240,262,{size:44,anchor:'start',auto:false}));
  s+=fade(seg(p,.55,.75),tex('\\bar v=\\dfrac{20h+5h^2}{h}=20+5h',150,390,{size:46,anchor:'start'})+label('h ≠ 0 なので 約分',1150,395,{size:24,color:C.F,anchor:'end'}));
  return s;
 },
 [`${K}:t2b`]:(p)=>{
  let s=label('2 s から 幅 h',120,90,{size:28,color:C.t});
  s+=fade(.5,tex('\\Delta x=5(2+h)^2-5\\cdot2^2',150,180,{size:44,anchor:'start'})+tex('=20h+5h^2',240,262,{size:44,anchor:'start',auto:false}));
  s+=tex('\\bar v=\\dfrac{20h+5h^2}{h}=20+5h',150,390,{size:46,anchor:'start'});
  const W=texWidth('\\bar v=\\dfrac{20h+5h^2}{h}=20+5h',46);
  s+=fade(seg(p,.1,.3),tex('\\xrightarrow{\\;h\\,\\to\\,0\\;}\\;20',150+W+20,390,{size:46,anchor:'start',auto:false,color:C.hi}));
  s+=fade(seg(p,.5,.7),label('t ＝ 2 s の瞬間の速さ ＝ 20 m/s',600,485,{size:32,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [`${K}:compare`]:(p)=>{
  const {A,svg}=graph();let s=svg;
  s+=slopeLine(A,1,10,{g:seg(p,.05,.3),color:C.hi,w:4,from:.45,to:1.9})+pt(A,1,1,C.hi,9);
  s+=slopeLine(A,2,20,{g:seg(p,.3,.55),color:C.a,w:4,from:1.4,to:2.3})+pt(A,2,1,C.a,9);
  s+=card(700,120,470,280,label('触れる直線の 傾き ＝ 瞬間の速さ',935,175,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),label('t ＝ 1 s：10 m/s',935,235,{size:32,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.35,.55),label('t ＝ 2 s：20 m/s（急）',935,295,{size:32,color:C.a,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('時間とともに 速くなる',935,365,{size:28,color:C.ink,anchor:'middle'})),1);
  return s;
 },

 // ===== S5 まとめと次の問い =====
 ...Object.fromEntries([0,1,2].map(k=>[`${K}:sum${k+1}`,(p)=>{
  const items=[['①','平均の速さは 区間の幅で 変わる','15 → 12.5 → 10.5 → 10.05',C.v],
   ['②','幅 0 で割ると 0÷0（決まらない）','だから 0 へ 近づけた 行き先を見る',C.a],
   ['③','行き先 ＝ 瞬間の速さ','',C.hi]];
  let s='';items.forEach(([n,a,b,col],i)=>{if(i>k)return;const g=i<k?1:seg(p,.02,.2),y=70+i*145;
   s+=card(120,y,960,125,label(n,170,y+75,{size:40,color:col,weight:700})+label(a,240,y+55,{size:32,color:C.ink})+(b?label(b,240,y+100,{size:26,color:C.dim}):''),g,col);});
  if(k===2)s+=fade(seg(p,.3,.5),tex('v=\\dfrac{dx}{dt}',870,70+2*145+72,{size:38}));
  return s;
 }])),
 [`${K}:meter`]:(p)=>{
  let s=meter(320,230,140,36,{readout:'10 m/s ＝ 36 km/h'});
  s+=card(660,130,500,260,label('スピードメーターの値',910,190,{size:28,color:C.dim,anchor:'middle'})
   +label('＝ その時刻の 瞬間の速さ',910,245,{size:30,color:C.v,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),tex('10\\,\\mathrm{m/s}\\times3.6=36\\,\\mathrm{km/h}',910,335,{size:36,auto:false,color:C.ink})),seg(p,.05,.2));
  return s;
 },
 ...Object.fromEntries([1,2].map(k=>[`${K}:next${k}`,(p)=>{
  const L=axes({x:90,y:440,w:360,h:290,xmax:2.3,ymax:26,xlabel:'t [s]',ylabel:'位置 x [m]',xticks:[1,2],yticks:[10,20],grid:true,xcolor:C.t,ycolor:C.x});
  const R=axes({x:740,y:440,w:360,h:290,xmax:2.3,ymax:26,xlabel:'t [s]',ylabel:'速さ v [m/s]',xticks:[1,2],yticks:[10,20],grid:true,xcolor:C.t,ycolor:C.v});
  let s=L.svg+L.plot(xt,{from:0,to:2.2,color:C.x,w:4});
  const gr=k===1?seg(p,.2,.5):1;
  s+=arrow(500,230,690,230,{color:C.v,w:5,g:k===1?seg(p,.05,.3):1})+fade(k===1?seg(p,.1,.3):1,tex('\\dfrac{dx}{dt}',595,180,{size:40}));
  s+=fade(gr,R.svg+R.plot(t=>10*t,{from:0,to:2.2,color:C.v,w:4})+label('v ＝ 10t',R.X(1.25),R.Y(20)-10,{size:24,color:C.v}));
  if(k===2){
   const g=seg(p,.35,.6);
   s+=fade(g*.9,`<polygon points="${R.X(0)},${R.Y(0)} ${R.X(2)},${R.Y(20)} ${R.X(2)},${R.Y(0)}" fill="${C.x}" fill-opacity=".22" stroke="none"/>`);
   s+=arrow(690,330,500,330,{color:C.hi,w:5,g:seg(p,.05,.3)})+fade(seg(p,.1,.3),label('逆に？',595,380,{size:30,color:C.hi,anchor:'middle',weight:700}));
   s+=fade(g,label('進んだ距離は？',R.X(1.45),R.Y(4),{size:24,color:C.x,anchor:'middle',weight:700}));
  }
  return s;
 }])),
};
