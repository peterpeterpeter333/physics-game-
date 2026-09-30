// YouTube シリーズ「微分方程式・初級 2/2」(ys-ui-rate-equation-2) — 図。Stage 1200×515.
// 色（anim.mjs C）：速さ v 紫、時刻 t 金、減る速さ 赤、位置 x 水色、強調・「高さ＝傾き」黄、y（抽象の量）橙。
// 数値：1秒後 90 / 90.44 / 90.48 / 90.48 → 100e^(−0.1)＝90.48。y'＝y：2 / 2.59 / 2.70 / 2.717 → e＝2.71828…。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,draw,wall,spring,block} from './anim.mjs';

const K='ui-rate-equation-2:';
const CV=C.v,CT=C.t,CR=C.a,CH=C.hi,CY=C.E,CX=C.x;
const cV=s=>`{\\color{${CV}}{${s}}}`,cT=s=>`{\\color{${CT}}{${s}}}`,cR=s=>`{\\color{${CR}}{${s}}}`,cY=s=>`{\\color{${CY}}{${s}}}`,cH=s=>`{\\color{${CH}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('○',x,y,{size:32,color:C.F,weight:700,anchor:'middle'}));
const DV='\\dfrac{dv}{dt}',DY='\\dfrac{'+cY('dy')+'}{dt}';
const RULE=DV+'=-0.1\\,v';

// ---- S1: 1-second steps (from 1/2) ---------------------------------------------------------------
const V=[100,90,81,72.9];
function stepAxes(g=1){return axes({x:100,y:440,w:420,h:320,xmax:4.6,ymin:60,ymax:104,xticks:[1,2,3,4],yticks:[60,70,80,90,100],grid:true,g,xlabel:'時刻 t [s]',ylabel:'速さ v [m/s]',xcolor:CT,ycolor:CV});}
function coarse(A,{g=1,color=CV}={}){let s='';for(let k=0;k<3;k++)s+=line(A.X(k),A.Y(V[k]),A.X(k+1),A.Y(V[k+1]),{color,w:4});for(let k=0;k<4;k++)s+=dot(A.X(k),A.Y(V[k]),8,color);return fade(g,s);}

// ---- S2/S3: step tables ---------------------------------------------------------------------------
const TX=[720,860,990,1110],TY0=110,TDY=58;
function tHead(last='1秒後'){return label('刻み',TX[0],TY0,{size:24,color:CT,anchor:'middle',weight:700})+label('1刻みの倍率',TX[1],TY0,{size:22,color:C.ink,anchor:'middle',weight:700})
 +label('回数',TX[2],TY0,{size:24,color:C.dim,anchor:'middle',weight:700})+label(last,TX[3],TY0,{size:24,color:C.ink,anchor:'middle',weight:700})+line(660,TY0+16,1175,TY0+16,{color:C.faint,w:2});}
function tRow(i,cells,{g=1,color=CV,hi=0,last=1}={}){const y=TY0+TDY*(i+1);
 return fade(g,label(cells[0],TX[0],y,{size:26,color:CT,anchor:'middle'})+label(cells[1],TX[1],y,{size:26,color:C.ink,anchor:'middle'})+label(cells[2],TX[2],y,{size:26,color:C.dim,anchor:'middle'})
  +fade(last,label(cells[3],TX[3],y,{size:28,color,anchor:'middle',weight:700})))+(hi?highlight(665,y-36,510,50,hi):'');}
const VROWS=[['1 s','×0.9','1','90'],['0.1 s','×0.99','10','90.44'],['0.01 s','×0.999','100','90.48'],['0.001 s','×0.9999','1000','90.48']];
const YROWS=[['1 s','×2','1','2'],['0.1 s','×1.1','10','2.59'],['0.01 s','×1.01','100','2.70'],['0.001 s','×1.001','1000','2.717']];

// zoomed graph of the first second for dv/dt = −0.1v
function vZoom(g=1){return axes({x:100,y:450,w:400,h:320,xmax:1.12,ymin:89.5,ymax:100.8,xticks:[1],yticks:[90,95,100],grid:true,g,xlabel:'t [s]',ylabel:'v [m/s]',xcolor:CT,ycolor:CV});}
function eulerPts(A,h,rate,y0){const pts=[];let y=y0;const n=Math.round(1/h);for(let i=0;i<=n;i++){pts.push([A.X(i*h),A.Y(y)]);y*=1+rate*h;}return pts;}
function zoomBar(vals,g=1){ // magnified scale of the 1-second value: [[v,color,g],...]
 const x=610,Y=v=>420-(v-89.9)/(90.6-89.9)*250;
 let s=label('1秒後を 拡大',x,140,{size:22,color:C.dim,anchor:'middle'})+line(x,Y(89.9),x,Y(90.6),{color:C.dim,w:2});
 [90,90.5].forEach(v=>s+=line(x-6,Y(v),x+6,Y(v),{color:C.faint,w:2}));
 vals.forEach(([v,col,gg,txt])=>s+=fade(gg,line(x-14,Y(v),x+14,Y(v),{color:col,w:4})+label(txt??String(v),x-20,Y(v)+(v>90.46?-6:v>90.2?24:8),{size:22,color:col,anchor:'end',weight:700})));
 return fade(g,s);
}
function yZoom(g=1){return axes({x:100,y:450,w:400,h:320,xmax:1.12,ymin:.9,ymax:2.85,xticks:[1],yticks:[1,2],grid:true,g,xlabel:'t [s]',ylabel:'y',xcolor:CT,ycolor:CY});}

// ---- S3: y = e^t with heights and slopes -----------------------------------------------------------
function eAxes(g=1){return axes({x:120,y:450,w:470,h:340,xmin:-1.6,xmax:1.35,ymin:0,ymax:3.6,xticks:[-1,1],yticks:[1,2,3],grid:true,g,xlabel:'t',ylabel:'y',xcolor:CT,ycolor:CY});}
function hs(A,t0,g=1,{tan=1}={}){const y0=Math.exp(t0);let s=line(A.X(t0),A.Y(0),A.X(t0),A.Y(y0),{color:CH,w:5})+dot(A.X(t0),A.Y(y0),9,CH);
 const d=Math.min(.45,.9/y0);if(tan)s+=line(A.X(t0-d),A.Y(y0*(1-d)),A.X(t0+d),A.Y(y0*(1+d)),{color:CH,w:3,dash:'9 6'});return fade(g,s);}
const EX=[760,910,1060];
function eTable(rows,{hi=-1}={}){
 let s=label('t',EX[0],130,{size:26,color:CT,anchor:'middle',weight:700})+label('高さ',EX[1],130,{size:26,color:CH,anchor:'middle',weight:700})+label('傾き',EX[2],130,{size:26,color:CH,anchor:'middle',weight:700})+line(690,146,1130,146,{color:C.faint,w:2});
 const data=[['0','1','1'],['1','2.72','2.72'],['−1','0.37','0.37']];
 data.forEach((r,i)=>{const g=rows[i]??0,y=196+i*58;s+=fade(g,label(r[0],EX[0],y,{size:28,color:CT,anchor:'middle'})+label(r[1],EX[1],y,{size:28,color:CH,anchor:'middle',weight:700})+label(r[2],EX[2],y,{size:28,color:CH,anchor:'middle',weight:700}));});
 return s;
}

// ---- S4/S5: v–t graph of the exact solution -------------------------------------------------------
function vAxes(g=1){return axes({x:100,y:440,w:420,h:320,xmax:3.5,ymin:60,ymax:104,xticks:[1,2,3],yticks:[60,70,80,90,100],grid:true,g,xlabel:'時刻 t [s]',ylabel:'速さ v [m/s]',xcolor:CT,ycolor:CV});}
const ex=t=>100*Math.exp(-0.1*t);
function famAxes(g=1){return axes({x:110,y:450,w:470,h:340,xmax:10.6,ymax:132,xticks:[5,10],yticks:[50,100],grid:true,g,xlabel:'時刻 t [s]',ylabel:'速さ v [m/s]',xcolor:CT,ycolor:CV});}
const FAM=[20,40,60,80,100,120];
function family(A,{p=1,pick=0,dimOthers=0}={}){
 let s='';FAM.forEach((c,i)=>{const isP=pick&&c===100;const col=isP?CH:CV;const op=isP?1:(1-.7*dimOthers);
  s+=fade(op,A.plot(t=>c*Math.exp(-0.1*t),{from:0,to:10.3,p:seg(p,i*.08,i*.08+.35),color:col,w:isP?6:3}));});
 return s;
}
// x–t graph of x=2t and x=5+2t
function xAxes(g=1){return axes({x:110,y:450,w:440,h:330,xmax:4.4,ymax:14.5,xticks:[1,2,3,4],yticks:[5,10],grid:true,g,xlabel:'時刻 t [s]',ylabel:'位置 x [m]',xcolor:CT,ycolor:CX});}

export const ytUiRate2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=stepAxes(seg(p,0,.15));
  let s=A.svg+coarse(A,{g:seg(p,.15,.45)});
  s+=card(640,110,520,230,tex(RULE,900,170,{size:38})
   +label('1秒刻み',900,245,{size:26,color:C.dim,anchor:'middle'})
   +label('100 → 90 → 81 → 72.9',900,295,{size:32,color:CV,anchor:'middle',weight:700}),seg(p,.1,.25));
  s+=fade(seg(p,.7,.85),label('毎秒 0.9倍',900,400,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'recap2']:(p)=>{
  const A=stepAxes();
  let s=A.svg+coarse(A);
  s+=card(640,110,520,230,tex(RULE,900,170,{size:38})
   +label('1秒刻み',900,245,{size:26,color:C.dim,anchor:'middle'})
   +label('100 → 90 → 81 → 72.9',900,295,{size:32,color:CV,anchor:'middle',weight:700}),1);
  s+=fade(seg(p,.1,.3),label('1秒の間は 減る速さを 一定とみなした',900,400,{size:26,color:CR,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('≈ 近似',900,455,{size:34,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ask']:(p)=>{
  const A=stepAxes();
  let s=fade(.4,A.svg+coarse(A));
  s+=fade(seg(p,.15,.45),A.plot(ex,{from:0,to:4.4,p:seg(p,.15,.45),color:CH,w:4,dash:'10 8'}))+fade(seg(p,.3,.45),label('なめらかな 本当の答え？',A.X(1.3),A.Y(96),{size:24,color:CH}));
  s+=card(640,110,520,260,label('今回の問い',900,165,{size:26,color:C.dim,anchor:'middle'})
   +label('なめらかな 本当の答えは？',900,235,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('そこに出てくる e とは？',900,310,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,.05,.2),CH);
  return s;
 },
 // ===== S2 刻みを細かくする =====
 [K+'fine1']:(p)=>{
  const A=vZoom(seg(p,0,.15));
  let s=A.svg+dot(A.X(0),A.Y(100),8,CV);
  s+=fade(seg(p,.1,.3),line(A.X(0),A.Y(100),A.X(1),A.Y(90),{color:C.dim,w:3,dash:'8 6'})+dot(A.X(1),A.Y(90),8,C.dim)+label('1秒刻み：90',A.X(1)-10,A.Y(90)+36,{size:22,color:C.dim,anchor:'end'}));
  s+=fade(seg(p,.1,.25),tHead()+tRow(0,VROWS[0],{color:C.dim}));
  s+=fade(seg(p,.6,.75),tRow(1,['0.1 s','？','？','？'],{color:CH}));
  return s;
 },
 [K+'fine2']:(p)=>{
  const A=vZoom();
  let s=A.svg+dot(A.X(0),A.Y(100),8,CV)+line(A.X(0),A.Y(100),A.X(1),A.Y(90),{color:C.dim,w:3,dash:'8 6'})+dot(A.X(1),A.Y(90),8,C.dim);
  s+=tHead()+tRow(0,VROWS[0],{color:C.dim});
  s+=fade(seg(p,.05,.2),tex('0.1\\,'+cV('v')+'\\times 0.1\\,\\mathrm{s}=0.01\\,'+cV('v'),915,330,{size:36,auto:false})+label('0.1秒で 減る量',915,380,{size:22,color:CR,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),tex(cV('v')+'-0.01\\,'+cV('v')+'=0.99\\,'+cV('v'),915,450,{size:36,auto:false}));
  s+=tRow(1,['0.1 s','×0.99','？','？'],{g:seg(p,.75,.9)});
  // first 0.1 s step on the graph
  s+=fade(seg(p,.55,.75),line(A.X(0),A.Y(100),A.X(.1),A.Y(99),{color:CH,w:4})+dot(A.X(.1),A.Y(99),6,CH));
  return s;
 },
 [K+'fine3']:(p)=>{
  const A=vZoom();
  let s=A.svg+line(A.X(0),A.Y(100),A.X(1),A.Y(90),{color:C.dim,w:3,dash:'8 6'})+dot(A.X(1),A.Y(90),8,C.dim);
  s+=draw(eulerPts(A,.1,-0.1,100),seg(p,.05,.5),{color:CH,w:4})+fade(seg(p,.45,.55),dot(A.X(1),A.Y(90.438),8,CH));
  
  s+=tHead()+tRow(0,VROWS[0],{color:C.dim})+tRow(1,VROWS[1],{color:CH,last:seg(p,.6,.75)});
  s+=zoomBar([[90,C.dim,1],[90.44,CH,seg(p,.5,.6)]]);
  s+=fade(seg(p,.25,.45),tex('100\\times 0.99^{10}\\approx 90.44',915,420,{size:36,auto:false}));
  return s;
 },
 [K+'fine4']:(p)=>{
  const A=vZoom();
  let s=A.svg+line(A.X(0),A.Y(100),A.X(1),A.Y(90),{color:C.dim,w:3,dash:'8 6'})+dot(A.X(1),A.Y(90),8,C.dim);
  s+=draw(eulerPts(A,.1,-0.1,100),1,{color:C.dim,w:2});
  s+=fade(seg(p,.1,.35),A.plot(ex,{from:0,to:1,color:CH,w:4})+dot(A.X(1),A.Y(90.48),8,CH));
  s+=tHead()+tRow(0,VROWS[0],{color:C.dim})+tRow(1,VROWS[1],{color:C.dim})+tRow(2,VROWS[2],{g:seg(p,.05,.2),color:CH})+tRow(3,VROWS[3],{g:seg(p,.55,.7),color:CH});
  s+=zoomBar([[90,C.dim,1],[90.44,C.dim,1],[90.48,CH,seg(p,.1,.25),'90.48']]);
  return s;
 },
 [K+'fine5']:(p)=>{
  const A=vZoom();
  let s=A.svg+line(A.X(0),A.Y(100),A.X(1),A.Y(90),{color:C.dim,w:3,dash:'8 6'})+dot(A.X(1),A.Y(90),8,C.dim);
  s+=A.plot(ex,{from:0,to:1,color:CH,w:4})+dot(A.X(1),A.Y(90.48),8,CH);
  s+=tHead()+VROWS.map((r,i)=>tRow(i,r,{color:i?CH:C.dim})).join('')+zoomBar([[90,C.dim,1],[90.44,C.dim,1],[90.48,CH,1,'90.48']]);
  s+=fade(seg(p,.1,.3),arrow(TX[3],TY0+TDY*4+20,TX[3],TY0+TDY*4+70,{color:CH,w:3,head:12}));
  s+=fade(seg(p,.2,.4),label('行き先 90.48…',1172,TY0+TDY*4+110,{size:30,color:CH,anchor:'end',weight:700}));
  s+=fade(seg(p,.55,.7),label('＝ 1秒後の 本当の値',930,TY0+TDY*4+110,{size:26,color:C.ink,anchor:'end'}));
  return s;
 },
 [K+'fine6']:(p)=>{
  const A=vZoom();
  let s=A.svg+line(A.X(0),A.Y(100),A.X(1),A.Y(90),{color:CV,w:4,dash:'8 6'})+dot(A.X(1),A.Y(90),8,CV);
  s+=A.plot(ex,{from:0,to:1,color:CH,w:4})+dot(A.X(1),A.Y(90.48),8,CH)+label('90.48',A.X(1)+14,A.Y(90.48)-8,{size:22,color:CH})+label('90',A.X(1)+14,A.Y(90)+16,{size:22,color:CV});
  s+=card(620,110,550,300,label('1秒刻みの 90',895,165,{size:30,color:CV,anchor:'middle',weight:700})
   +label('最初の 一番大きい 減る速さ 10 を',895,230,{size:26,color:C.ink,anchor:'middle'})
   +label('1秒間 使い続けた',895,275,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('→ 少し 減らしすぎ',895,350,{size:30,color:CR,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S3 e とは何者か =====
 [K+'simple']:(p)=>{
  const A=yZoom(seg(p,.4,.55));
  let s=A.svg;
  s+=card(640,110,520,260,label('もっと簡単なルール',900,160,{size:26,color:C.dim,anchor:'middle'})
   +tex(DY+'='+cY('y'),900,235,{size:48,auto:false})
   +fade(seg(p,.35,.5),label('増える速さ ＝ 今の値そのもの',900,305,{size:26,color:CY,anchor:'middle'}))
   +fade(seg(p,.7,.85),label('出発 y ＝ 1',900,350,{size:26,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CY);
  s+=fade(seg(p,.7,.85),dot(A.X(0),A.Y(1),8,CY));
  return s;
 },
 [K+'e1']:(p)=>{
  const A=yZoom();
  let s=A.svg+dot(A.X(0),A.Y(1),8,CY)+tex(DY+'='+cY('y'),300,50,{size:32,auto:false});
  s+=draw([[A.X(0),A.Y(1)],[A.X(1),A.Y(2)]],seg(p,.2,.6),{color:C.dim,w:3})+fade(seg(p,.55,.65),dot(A.X(1),A.Y(2),8,C.dim)+label('2',A.X(1)+14,A.Y(2)+8,{size:22,color:C.dim}));
  s+=fade(seg(p,.05,.2),tHead()+tRow(0,YROWS[0],{color:C.dim,last:seg(p,.6,.75)}));
  return s;
 },
 [K+'e2']:(p)=>{
  const A=yZoom();
  let s=A.svg+dot(A.X(0),A.Y(1),8,CY)+tex(DY+'='+cY('y'),300,50,{size:32,auto:false});
  s+=line(A.X(0),A.Y(1),A.X(1),A.Y(2),{color:C.dim,w:3})+dot(A.X(1),A.Y(2),8,C.dim);
  s+=draw(eulerPts(A,.1,1,1),seg(p,.05,.35),{color:CY,w:3})+fade(seg(p,.3,.4),dot(A.X(1),A.Y(2.594),7,CY));
  s+=fade(seg(p,.55,.75),draw(eulerPts(A,.01,1,1),1,{color:CH,w:3})+dot(A.X(1),A.Y(2.705),7,CH));
  s+=tHead()+tRow(0,YROWS[0],{color:C.dim})+tRow(1,YROWS[1],{g:seg(p,.05,.2),color:CY})+tRow(2,YROWS[2],{g:seg(p,.55,.7),color:CH});
  return s;
 },
 [K+'e3']:(p)=>{
  const A=yZoom();
  let s=A.svg+tex(DY+'='+cY('y'),300,50,{size:32,auto:false});
  s+=line(A.X(0),A.Y(1),A.X(1),A.Y(2),{color:C.dim,w:3})+draw(eulerPts(A,.1,1,1),1,{color:C.dim,w:2});
  s+=A.plot(Math.exp,{from:0,to:1,color:CH,w:4})+dot(A.X(1),A.Y(Math.E),8,CH);
  s+=tHead()+YROWS.slice(0,3).map((r,i)=>tRow(i,r,{color:C.dim})).join('')+tRow(3,YROWS[3],{g:seg(p,.05,.2),color:CH});
  s+=fade(seg(p,.4,.55),arrow(TX[3],TY0+TDY*4+20,TX[3],TY0+TDY*4+62,{color:CH,w:3,head:12})+label('行き先 2.71828…',1172,TY0+TDY*4+105,{size:30,color:CH,anchor:'end',weight:700}));
  return s;
 },
 [K+'e4']:(p)=>{
  const A=yZoom();
  let s=A.svg+tex(DY+'='+cY('y'),300,50,{size:32,auto:false});
  s+=A.plot(Math.exp,{from:0,to:1,color:CH,w:4})+dot(A.X(0),A.Y(1),8,CY)+dot(A.X(1),A.Y(Math.E),9,CH)+label('e',A.X(1)+14,A.Y(Math.E)+8,{size:30,color:CH,weight:700});
  s+=card(620,110,550,300,tex('e=2.71828\\ldots',895,185,{size:52,auto:false,color:CH})
   +fade(seg(p,.3,.45),label('（定義）',895,250,{size:24,color:C.dim,anchor:'middle'})
    +tex(DY+'='+cY('y')+',\\ \\ '+cY('y')+'(0)=1',895,310,{size:34,auto:false})
    +label('の 1秒後の値',895,375,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.15),CH);
  return s;
 },
 [K+'et']:(p)=>{
  const A=yZoom();
  let s=A.svg+tex(DY+'='+cY('y'),300,50,{size:32,auto:false});
  s+=A.plot(Math.exp,{from:0,to:1.08,color:CH,w:4})+dot(A.X(1),A.Y(Math.E),9,CH)+label('e',A.X(1)+14,A.Y(Math.E)+8,{size:30,color:CH,weight:700});
  s+=fade(seg(p,.1,.3),label('y ＝ eᵗ',A.X(.45),A.Y(1.9),{size:30,color:CH,weight:700,anchor:'end'}));
  s+=card(620,110,550,300,label('t 秒後の値',895,170,{size:28,color:C.ink,anchor:'middle'})
   +tex(cY('y')+'=e^{'+cT('t')+'}',895,245,{size:56,auto:false})
   +fade(seg(p,.5,.65),label('e の t乗 として 計算できる',895,320,{size:26,color:C.dim,anchor:'middle'})
    +label('（ここでは 使うだけ）',895,365,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.15),CH);
  return s;
 },
 [K+'graph']:(p)=>{
  const A=eAxes(seg(p,0,.15));
  let s=A.svg+A.plot(Math.exp,{from:-1.6,to:1.27,p:seg(p,.05,.35),color:CY,w:4})+fade(seg(p,.3,.4),label('y ＝ eᵗ',A.X(-1.5),A.Y(.2)-26,{size:28,color:CY,weight:700}));
  s+=hs(A,0,seg(p,.45,.65));
  s+=fade(seg(p,.55,.7),label('高さ 1',A.X(0)+14,A.Y(.5),{size:24,color:CH})+label('傾き 1',A.X(.45)+6,A.Y(1.45)+26,{size:24,color:CH}));
  s+=eTable([seg(p,.6,.75)]);
  return s;
 },
 [K+'graph2']:(p)=>{
  const A=eAxes();
  let s=A.svg+A.plot(Math.exp,{from:-1.6,to:1.27,color:CY,w:4})+label('y ＝ eᵗ',A.X(-1.5),A.Y(.2)-26,{size:28,color:CY,weight:700});
  s+=hs(A,0,1)+hs(A,1,seg(p,.05,.25))+hs(A,-1,seg(p,.5,.7));
  s+=eTable([1,seg(p,.15,.3),seg(p,.6,.75)]);
  return s;
 },
 [K+'graph3']:(p)=>{
  const A=eAxes();
  let s=A.svg+A.plot(Math.exp,{from:-1.6,to:1.27,color:CY,w:4})+label('y ＝ eᵗ',A.X(-1.5),A.Y(.2)-26,{size:28,color:CY,weight:700});
  // sweeping point: height and slope together
  const t0=-1.2+2.1*seg(p,.05,.45);s+=hs(A,t0,1);
  s+=eTable([1,1,1]);
  s+=highlight(EX[1]-70,150,300,176,seg(p,.1,.3));
  s+=fade(seg(p,.45,.6),label('高さ ＝ 傾き',910,380,{size:32,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),tex('\\dfrac{d}{dt}\\,e^{'+cT('t')+'}=e^{'+cT('t')+'}',910,460,{size:40,auto:false}));
  return s;
 },
 // ===== S4 減る答えを確かめる =====
 [K+'decay']:(p)=>{
  let s=tex('e^{-k'+cT('t')+'}',600,130,{size:70,auto:false});
  s+=fade(seg(p,.4,.55),tex('u=-k'+cT('t'),600,260,{size:48,auto:false})+label('中身に 名前をつける',600,320,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('連鎖律：外側の微分 × 中身の微分',600,420,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'chain']:(p)=>{
  let s=tex('e^{-k'+cT('t')+'}',600,90,{size:56,auto:false});
  s+=fade(seg(p,.02,.2),label('外側',330,185,{size:26,color:C.dim,anchor:'middle'})+tex('\\dfrac{d}{du}\\,e^{u}=e^{u}',330,245,{size:40,auto:false}));
  s+=fade(seg(p,.3,.45),label('中身',870,185,{size:26,color:C.dim,anchor:'middle'})+tex('\\dfrac{du}{dt}=-k',870,245,{size:40,auto:false}));
  s+=fade(seg(p,.6,.75),label('掛ける',600,340,{size:26,color:CH,anchor:'middle'})+tex('\\dfrac{d}{dt}\\,e^{-k'+cT('t')+'}='+cH('-k')+'\\,e^{-k'+cT('t')+'}',600,420,{size:48,auto:false}));
  return s;
 },
 [K+'verify']:(p)=>{
  let s=tex(cV('v')+'=100\\,e^{-0.1'+cT('t')+'}',600,90,{size:54,auto:false});
  s+=fade(seg(p,.15,.35),label('微分すると',600,175,{size:26,color:C.dim,anchor:'middle'})+tex(DV+'=-0.1\\times 100\\,e^{-0.1'+cT('t')+'}',600,250,{size:48,auto:false}));
  s+=fade(seg(p,.6,.75),tex('=-0.1\\,'+cV('v'),600+texWidth(DV+'=-0.1\\times 100\\,e^{-0.1t}',48,false)/2-texWidth('=-0.1\\times 100\\,e^{-0.1t}',48,false)+texWidth('=-0.1\\,v',48,false)/2,360,{size:48,auto:false}));
  s+=fade(seg(p,.7,.85),label('100e^(−0.1t) は v そのもの',600,450,{size:28,color:CH,anchor:'middle'}));
  return s;
 },
 [K+'verify2']:(p)=>{
  let s=tex(cV('v')+'=100\\,e^{-0.1'+cT('t')+'}',600,90,{size:54,auto:false});
  s+=tex(DV+'=-0.1\\times 100\\,e^{-0.1'+cT('t')+'}',600,250,{size:48,auto:false})+label('微分すると',600,175,{size:26,color:C.dim,anchor:'middle'});
  s+=tex('=-0.1\\,'+cV('v'),600+texWidth(DV+'=-0.1\\times 100\\,e^{-0.1t}',48,false)/2-texWidth('=-0.1\\times 100\\,e^{-0.1t}',48,false)+texWidth('=-0.1\\,v',48,false)/2,360,{size:48,auto:false});
  s+=fade(seg(p,.1,.3),label('どの時刻でも 左の辺 ＝ 右の辺',600,450,{size:30,color:C.F,anchor:'middle',weight:700})+ok(870,452,seg(p,.3,.4)));
  s+=fade(seg(p,.45,.6),label('→ 解',1000,450,{size:30,color:CH,weight:700}));
  return s;
 },
 [K+'val']:(p)=>{
  const A=vAxes(seg(p,0,.15));
  let s=A.svg+A.plot(ex,{from:0,to:3.3,p:seg(p,.05,.35),color:CH,w:4})+coarse(A,{g:seg(p,.1,.25)*.8,color:C.dim});
  s+=fade(seg(p,.3,.45),dot(A.X(1),A.Y(90.48),9,CH)+label('90.48',A.X(1)+14,A.Y(90.48)-10,{size:24,color:CH,weight:700}));
  s+=card(640,110,520,250,tex('100\\,e^{-0.1}\\approx 90.48',900,180,{size:42,auto:false})
   +fade(seg(p,.55,.7),label('刻みを細かくした 行き先',900,265,{size:26,color:C.ink,anchor:'middle'})+label('90.48… と 一致',900,315,{size:30,color:C.F,anchor:'middle',weight:700})),seg(p,.1,.25),CH);
  return s;
 },
 [K+'ratio']:(p)=>{
  const A=vAxes();
  let s=A.svg+A.plot(ex,{from:0,to:3.3,color:CH,w:4})+coarse(A,{g:.6,color:C.dim});
  const E=[100,90.48,81.87,74.08];E.forEach((v,k)=>s+=dot(A.X(k),A.Y(v),8,CH));
  const X3=[720,860,1040];
  s+=label('t [s]',X3[0],120,{size:24,color:CT,anchor:'middle',weight:700})+label('本当の値',X3[1],120,{size:24,color:CH,anchor:'middle',weight:700})+label('1秒刻み（≈）',X3[2],120,{size:24,color:C.dim,anchor:'middle',weight:700})+line(660,136,1150,136,{color:C.faint,w:2});
  E.forEach((v,k)=>{const y=180+k*58;s+=label(String(k),X3[0],y,{size:26,color:CT,anchor:'middle'})+label(String(v),X3[1],y,{size:28,color:CH,anchor:'middle',weight:700})+label(String(V[k]),X3[2],y,{size:26,color:C.dim,anchor:'middle'});
   if(k<3)s+=fade(seg(p,.1,.3),arrow(X3[1]+62,y+4,X3[1]+62,y+32,{color:CH,w:3,head:10})+label('×0.905',X3[1]+70,y+30,{size:20,color:CH}));});
  s+=fade(seg(p,.1,.3),tex('e^{-0.1}\\approx 0.905',905,445,{size:38,auto:false}));
  s+=fade(seg(p,.6,.75),label('毎秒 同じ割合で 減る',905,495,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 解は家族になる =====
 [K+'family']:(p)=>{
  let s=label('定数倍しても',600,90,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.25),tex('\\dfrac{d}{dt}\\left(2e^{'+cT('t')+'}\\right)=2e^{'+cT('t')+'}',600,200,{size:48,auto:false}));
  s+=fade(seg(p,.3,.5),tex('\\dfrac{d}{dt}\\left(5e^{'+cT('t')+'}\\right)=5e^{'+cT('t')+'}',600,320,{size:48,auto:false}));
  s+=fade(seg(p,.7,.85),label('微分すると 自分自身に 戻る',600,440,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'family2']:(p)=>{
  const A=eAxes(1);
  let s=A.svg;[.5,1,2,3].forEach((c,i)=>s+=A.plot(t=>c*Math.exp(t),{from:-1.6,to:Math.min(1.27,Math.log(3.5/c)),p:seg(p,.05+i*.1,.35+i*.1),color:CY,w:3}));
  s+=card(680,110,470,260,tex(DY+'='+cY('y'),915,170,{size:40,auto:false})+label('の解',915,230,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.35,.5),tex(cY('y')+'=C\\,e^{'+cT('t')+'}',915,300,{size:50,auto:false}))
   +fade(seg(p,.65,.8),label('C は どんな数でも よい',915,350,{size:24,color:CH,anchor:'middle'})),seg(p,0,.15),CY);
  s+=fade(seg(p,.4,.55),label('解の 家族',A.X(-1.4),A.Y(3.2),{size:28,color:CY,weight:700}));
  return s;
 },
 [K+'fam3']:(p)=>{
  const A=famAxes(seg(p,0,.15));
  let s=A.svg+family(A,{p:seg(p,.05,.6)});
  s+=card(660,110,500,250,tex(RULE,910,165,{size:36})
   +tex(cV('v')+'=C\\,e^{-0.1'+cT('t')+'}',910,245,{size:42,auto:false})
   +fade(seg(p,.6,.75),label('方程式は 減り方だけ → C は決まらない',910,315,{size:22,color:CR,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'ic']:(p)=>{
  const A=famAxes();
  let s=A.svg+family(A);
  s+=fade(seg(p,.1,.3),line(A.X(0),A.Y(0),A.X(0),A.Y(128),{color:CT,w:3,dash:'8 6'})+label('t ＝ 0',A.X(0)+10,A.Y(128)-8,{size:22,color:CT}));
  FAM.forEach((c,i)=>s+=fade(seg(p,.35+i*.05,.45+i*.05),dot(A.X(0),A.Y(c),7,CH)));
  s+=card(660,110,500,250,tex('e^{0}=1',910,170,{size:42,auto:false})
   +fade(seg(p,.3,.45),tex(cV('v')+'(0)=C',910,250,{size:46,auto:false}))
   +fade(seg(p,.65,.8),label('C ＝ 出発のときの値',910,320,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'ic2']:(p)=>{
  const A=famAxes();
  const g=seg(p,.15,.35);
  let s=A.svg+family(A,{pick:g>.5?1:0,dimOthers:g});
  s+=line(A.X(0),A.Y(0),A.X(0),A.Y(128),{color:CT,w:3,dash:'8 6'});
  s+=ring(A.X(0),A.Y(100),16,{color:CH,w:4})+dot(A.X(0),A.Y(100),8,CH);
  s+=card(660,110,500,250,tex(cV('v')+'(0)=100',910,170,{size:42,auto:false})
   +fade(seg(p,.2,.35),tex('C=100',910,245,{size:42,auto:false}))
   +fade(seg(p,.55,.7),label('初期条件：t ＝ 0 の値',910,320,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,0,.12),CH);
  s+=fade(seg(p,.3,.45),label('1本だけ 選ばれる',A.X(3.2),A.Y(100*Math.exp(-.32))-44,{size:24,color:CH,weight:700}));
  return s;
 },
 [K+'const']:(p)=>{
  const A=famAxes();
  let s=A.svg+family(A,{pick:1,dimOthers:1})+ring(A.X(0),A.Y(100),16,{color:CH,w:4});
  s+=card(660,110,500,250,label('方程式だけでは 決まらない 定数 C',910,170,{size:26,color:C.ink,anchor:'middle'})
   +label('積分定数',910,240,{size:40,color:CH,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('（名前だけ。詳しくは 後の回）',910,310,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15),CH);
  return s;
 },
 // ===== S6 法則と出発点 =====
 [K+'x1']:(p)=>{
  const A=xAxes(seg(p,0,.2));
  let s=A.svg;
  s+=card(660,110,500,200,label('一定の速さ 2 m/s',910,165,{size:30,color:CV,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),tex('\\dfrac{dx}{dt}=2',910,250,{size:48})),seg(p,.1,.25));
  return s;
 },
 [K+'x2']:(p)=>{
  const A=xAxes();
  let s=A.svg+A.plot(t=>2*t,{from:0,to:4.2,p:seg(p,.05,.3),color:CX,w:4})+fade(seg(p,.2,.3),dot(A.X(0),A.Y(0),8,CX)+label('x ＝ 2t',A.X(2.6),A.Y(5.2)+40,{size:26,color:CX}));
  s+=A.plot(t=>5+2*t,{from:0,to:4.2,p:seg(p,.35,.6),color:CH,w:4})+fade(seg(p,.5,.6),dot(A.X(0),A.Y(5),8,CH)+label('x ＝ 5 ＋ 2t',A.X(3.1),A.Y(11.2)-18,{size:26,color:CH,anchor:'end'}));
  s+=card(660,110,500,200,tex('\\dfrac{dx}{dt}=2',910,180,{size:44})
   +fade(seg(p,.7,.85),label('どちらも 傾き 2',910,270,{size:28,color:C.F,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'x3']:(p)=>{
  const A=xAxes();
  let s=A.svg+A.plot(t=>2*t,{from:0,to:4.2,color:CX,w:4})+A.plot(t=>5+2*t,{from:0,to:4.2,color:CH,w:4});
  s+=dot(A.X(0),A.Y(0),8,CX)+dot(A.X(0),A.Y(5),8,CH);
  s+=fade(seg(p,.05,.25),line(A.X(3),A.Y(0),A.X(3),A.Y(11),{color:CT,w:2,dash:'6 6'})+dot(A.X(3),A.Y(6),8,CX)+dot(A.X(3),A.Y(11),8,CH)+label('6 m',A.X(3)+14,A.Y(6)+26,{size:24,color:CX,weight:700})+label('11 m',A.X(3)-14,A.Y(11)-12,{size:24,color:CH,anchor:'end',weight:700}));
  s+=fade(seg(p,.45,.6),line(A.X(1),A.Y(2),A.X(1),A.Y(7),{color:CR,w:4})+label('5 m',A.X(1)+10,A.Y(4.5)+8,{size:24,color:CR,weight:700})+line(A.X(3.7),A.Y(7.4),A.X(3.7),A.Y(12.4),{color:CR,w:4})+label('5 m',A.X(3.7)+10,A.Y(9.9)+8,{size:24,color:CR,weight:700}));
  s+=card(660,110,500,200,label('ルールは 同じ',910,170,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('出発点の差 5 m が ずっと残る',910,250,{size:26,color:CR,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'law']:(p)=>{
  let s=card(120,150,380,150,label('法則',310,205,{size:32,color:CR,anchor:'middle',weight:700})+label('変化のルール',310,260,{size:26,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  s+=fade(seg(p,.1,.3),label('だけでは 決まらない ✗',310,350,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),label('＋',560,240,{size:44,color:C.ink,anchor:'middle'}));
  s+=card(620,150,300,150,label('初期条件',770,205,{size:32,color:CH,anchor:'middle',weight:700})+label('t ＝ 0 の値',770,260,{size:26,color:C.ink,anchor:'middle'}),seg(p,.45,.6),CH);
  s+=fade(seg(p,.7,.85),arrow(930,225,990,225,{color:C.F,w:4})+label('ただ一つの',1080,215,{size:26,color:C.F,anchor:'middle',weight:700})+label('未来',1080,260,{size:30,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(200,90,800,300,label('確かめ',600,145,{size:26,color:C.dim,anchor:'middle'})
   +tex(DY+'=-0.5\\,'+cY('y'),600,225,{size:48,auto:false})
   +label('初め y ＝ 10',600,300,{size:30,color:CY,anchor:'middle'})
   +fade(seg(p,.4,.55),label('2秒後は？',600,355,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 [K+'quizA']:(p)=>{
  const A=axes({x:100,y:450,w:420,h:320,xmax:3.4,ymax:11,xticks:[1,2,3],yticks:[5,10],grid:true,xlabel:'時刻 t [s]',ylabel:'y',xcolor:CT,ycolor:CY});
  let s=A.svg+A.plot(t=>10*Math.exp(-.5*t),{from:0,to:3.2,p:seg(p,.05,.3),color:CY,w:4})+dot(A.X(0),A.Y(10),8,CY);
  s+=fade(seg(p,.35,.5),line(A.X(2),A.Y(0),A.X(2),A.Y(3.68),{color:CT,w:2,dash:'6 6'})+dot(A.X(2),A.Y(3.68),9,CH)+label('3.68',A.X(2)+14,A.Y(3.68)-12,{size:24,color:CH,weight:700}));
  s+=tex(cY('y')+'=10\\,e^{-0.5'+cT('t')+'}',880,120,{size:44,auto:false});
  s+=fade(seg(p,.3,.45),tex(cY('y')+'(2)=10\\,e^{-1}',880,220,{size:42,auto:false}));
  s+=fade(seg(p,.55,.7),tex('e^{-1}\\approx 0.368',880,310,{size:38,auto:false}));
  s+=fade(seg(p,.75,.9),tex('\\approx 3.68',880,400,{size:48,auto:false,color:CH}));
  return s;
 },
 [K+'sum1']:(p)=>{
  let s=label('まとめ',600,75,{size:30,color:C.dim,anchor:'middle'});
  s+=card(120,100,960,170,tex('e=2.71828\\ldots',360,165,{size:44,auto:false,color:CH})
   +label('dy/dt ＝ y、出発 1 の 1秒後の値',780,172,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('eᵗ：高さ ＝ 傾き（微分しても 自分自身）',600,240,{size:28,color:CY,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=label('まとめ',600,75,{size:30,color:C.dim,anchor:'middle'});
  s+=card(120,100,960,170,tex('e=2.71828\\ldots',360,165,{size:44,auto:false,color:CH})
   +label('dy/dt ＝ y、出発 1 の 1秒後の値',780,172,{size:26,color:C.ink,anchor:'middle'})
   +label('eᵗ：高さ ＝ 傾き（微分しても 自分自身）',600,240,{size:28,color:CY,anchor:'middle',weight:700}),1,CH);
  s+=card(120,295,960,190,tex('\\dfrac{dv}{dt}=-kv\\ \\ \\Rightarrow\\ \\ '+cV('v')+'=C\\,e^{-k'+cT('t')+'}',600,360,{size:40,auto:false})
   +fade(seg(p,.45,.6),label('C は 方程式では決まらず、初期条件で 決まる',600,450,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'next']:(p)=>{
  const u=Math.sin(p*Math.PI*4)*seg(p,.1,.3),bx=560+120*u;
  let s=wall(220,250,390)+spring(220,bx-60,340)+block(bx,390,120,100,{color:CX})+line(220,392,1000,392,{color:C.dim,w:3});
  s+=line(560,400,560,420,{color:C.dim,w:2})+label('0',560,448,{size:22,color:C.dim,anchor:'middle'});
  s+=card(720,90,450,150,label('次の問い',945,135,{size:24,color:C.dim,anchor:'middle'})
   +label('加速度（変化率の変化率）が',945,180,{size:26,color:CR,anchor:'middle'})+label('位置で 決まる ルール',945,220,{size:26,color:CX,anchor:'middle'}),seg(p,.2,.35),CH);
  s+=fade(seg(p,.55,.7),label('ばねの振動は どんな方程式？',600,490,{size:32,color:CH,anchor:'middle',weight:700}));
  return s;
 },
};
