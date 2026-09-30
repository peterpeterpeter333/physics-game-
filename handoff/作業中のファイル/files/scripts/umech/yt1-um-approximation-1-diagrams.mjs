// YouTube シリーズ「近似・中級 1/2」(ys-um-approximation-1) — 図。Stage 1200×515.
// 色：本物の曲線 水色、接線（近似の直線）黄、近似する場所 a 橙、傾き × 幅（接線が数えた変化）金、差（接線が落とした分）赤。
// 正方形の図は微分・中級（um-average-rate-1:square）と同じ配色：元の正方形 水色、帯 金、角 赤。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';

const K='um-approximation-1:';
const CU=C.x,TA=C.hi,AA=C.E,RI=C.t,DF=C.a;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
let clipN=0;
const clipBox=(x,y,w,h,inner)=>{const id=`ua1c${clipN++}`;return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g>`;};
const sq=x=>x*x;

// ---- y = x² near x = 3 ----------------------------------------------------------------------
function gx2({x=110,y=470,w=500,h=400,xmin=0,xmax=4.3,ymin=0,ymax=18,g=1,curve=1,ticks=true}={}){
 const A=axes({x,y,w,h,xmin,xmax,ymin,ymax,xlabel:'x',ylabel:'y',xticks:ticks?[1,2,3,4]:[],yticks:ticks?[5,10,15]:[],grid:ticks,g,xcolor:CU,ycolor:C.dim});
 return {A,svg:A.svg+A.plot(sq,{from:Math.max(xmin,0),to:Math.min(xmax,Math.sqrt(ymax)),p:curve,color:CU,w:4})};
}
function lineThrough(A,x0,y0,k,a,b,{g=1,color=TA,w=4,dash='',ymin=-1e9,ymax=1e9}={}){
 const ya=y0+k*(a-x0),yb=y0+k*(b-x0);
 return draw([[A.X(a),A.Y(ya)],[A.X(b),A.Y(yb)]],g,{color,w,dash});
}
// zoom panel around (3, 9) with half-width hw of the x-window; the slope-6 line looks diagonal.
const ZP={x0:690,y0:40,W:460,H:420};
function zoomPanel(hw,{g=1}={}){
 const {x0,y0,W,H}=ZP,vh=6*hw*H/W;
 const X=u=>x0+W*(u-(3-hw))/(2*hw),Y=v=>y0+H-H*(v-(9-vh))/(2*vh);
 const pts=Array.from({length:121},(_,i)=>{const u=3-hw+2*hw*i/120;return [X(u),Y(sq(u))];});
 let s=rect(x0,y0,W,H,{fill:'#0f1a30',fo:1,stroke:C.dim,sw:2,rx:4});
 s+=clipBox(x0,y0,W,H,draw(pts,1,{color:CU,w:5}));
 s+=dot(X(3),Y(9),9,AA);
 return fade(g,s);
}
function zoomWindow(A,hw,g=1){
 const vh=6*hw*ZP.H/ZP.W;
 const x1=A.X(3-hw),x2=A.X(3+hw),y1=A.Y(9+vh),y2=A.Y(9-vh);
 return fade(g,rect(x1,y1,Math.max(2,x2-x1),Math.max(2,y2-y1),{fill:'none',fo:0,stroke:C.hi,sw:2,rx:0})
  +line(x2,y1,ZP.x0,ZP.y0,{color:C.faint,w:1.5,dash:'5 5'})+line(x2,y2,ZP.x0,ZP.y0+ZP.H,{color:C.faint,w:1.5,dash:'5 5'}));
}

// ---- generic smooth curve for the general formula ---------------------------------------------
const gf=x=>1+.3*x+.18*x*x,gd=x=>.3+.36*x,GA=1.5,GX=3.8;
function ggen({g=1,tan=1,xpt=0,rise=0,gap=0,aLab=1}={}){
 const A=axes({x:90,y:470,w:520,h:400,xmax:4.6,ymax:5.6,xlabel:'x',ylabel:'y',g});
 let s=A.svg+A.plot(gf,{from:0,to:4.4,color:CU,w:4});
 const ax=A.X(GA),ay=A.Y(gf(GA));
 s+=fade(aLab,line(ax,ay,ax,A.Y(0),{color:AA,w:2,dash:'6 5'})+label('a',ax,A.Y(0)+36,{size:28,color:AA,anchor:'middle',weight:700}));
 s+=fade(aLab,line(ax,A.Y(0),ax,ay,{color:CU,w:6})+label('f(a)',ax-12,(A.Y(0)+ay)/2+8,{size:26,color:CU,anchor:'end'}));
 s+=fade(tan,lineThrough(A,GA,gf(GA),gd(GA),.2,4.4,{color:TA,w:4}));
 s+=dot(ax,ay,9,AA);
 if(xpt){
  const xx=A.X(GX),ty=A.Y(gf(GA)+gd(GA)*(GX-GA));
  s+=fade(xpt,line(xx,A.Y(0)-7,xx,A.Y(0)+7,{color:C.ink,w:3})+label('x',xx,A.Y(0)+36,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(xpt,line(ax,ay,xx,ay,{color:C.dim,w:2,dash:'6 5'}));
  s+=fade(xpt,brace(ax,xx,ay+10,{dir:1,color:C.ink,text:'x − a',size:24}));
  s+=fade(rise,line(xx,ay,xx,ty,{color:RI,w:6})+label("f′(a)(x − a)",xx+12,(ay+ty)/2+8,{size:24,color:RI}));
  s+=fade(gap,line(xx,ty,xx,A.Y(gf(GX)),{color:DF,w:6})+label('ずれ',xx+12,(ty+A.Y(gf(GX)))/2+8,{size:24,color:DF,weight:700}));
 }
 return {A,svg:s};
}
const FORM=`f(x)\\approx${cs(CU,'f(a)')}+${cs(RI,"f'(a)(x-a)")}`;

// ---- the square of side 3 + 0.1 (0.1 drawn much larger) ---------------------------------------
function square({g=1,main=1,right=1,top=1,corner=1,labels=1,x0=110,y0=50,u=300,hh=90}={}){
 const F=u+hh;let s='';
 s+=fade(main,rect(x0,y0+hh,u,u,{fill:C.x,fo:.25,rx:0})+fade(labels,label('9',x0+u/2,y0+hh+u/2+12,{size:34,color:C.x,anchor:'middle',weight:700})));
 s+=fade(right,rect(x0+u,y0+hh,hh,u,{fill:C.t,fo:.32,rx:0})+fade(labels,label('0.3',x0+u+hh/2,y0+hh+u/2+10,{size:26,color:C.t,anchor:'middle',weight:700})));
 s+=fade(top,rect(x0,y0,u,hh,{fill:C.t,fo:.32,rx:0})+fade(labels,label('0.3',x0+u/2,y0+hh/2+10,{size:26,color:C.t,anchor:'middle',weight:700})));
 s+=fade(corner,rect(x0+u,y0,hh,hh,{fill:C.a,fo:.4,rx:0})+fade(labels,label('0.01',x0+u+hh/2,y0+hh/2+9,{size:22,color:C.a,anchor:'middle',weight:700})));
 s+=rect(x0,y0,F,F,{fill:'none',fo:0,stroke:C.dim,sw:3,rx:0});
 s+=label('3',x0+u/2,y0+F+32,{size:24,color:C.ink,anchor:'middle'})+label('0.1',x0+u+hh/2,y0+F+32,{size:24,color:C.t,anchor:'middle'});
 s+=label('3',x0-14,y0+hh+u/2+8,{size:24,color:C.ink,anchor:'end'})+label('0.1',x0-14,y0+hh/2+8,{size:24,color:C.t,anchor:'end'});
 return fade(g,s);
}

// ---- √(1+x) --------------------------------------------------------------------------------------
function grt({g=1,tan=0,x=90,y=460,w=540,h=380,xmin=-1,xmax=3,ymin=0,ymax=2.8,mark=0}={}){
 const A=axes({x,y,w,h,xmin,xmax,ymin,ymax,xlabel:'x',ylabel:'y',xticks:[1,2,3],yticks:[1,2],grid:true,g,xcolor:C.ink,ycolor:C.dim});
 let s=A.svg+A.plot(u=>Math.sqrt(1+u),{from:-1,to:xmax,color:CU,w:4,steps:240});
 s+=fade(tan,A.plot(u=>1+u/2,{from:xmin,to:xmax,color:TA,w:4}));
 s+=dot(A.X(0),A.Y(1),9,AA);
 if(mark)s+=fade(mark,ring(A.X(.02),A.Y(1.01),22,{color:C.hi,w:3})+label('x ＝ 0.02',A.X(.02)+30,A.Y(1.01)+60,{size:22,color:C.hi}));
 return {A,svg:s};
}

// ---- sin near 0 -------------------------------------------------------------------------------------
function gsin({g=1,tan=1}={}){
 const A=axes({x:90,y:440,w:520,h:360,xmin:-.1,xmax:1.6,ymin:-.1,ymax:1.6,xlabel:'θ',ylabel:'y',xticks:[.5,1,1.5],yticks:[.5,1,1.5],grid:true,g,xcolor:C.ink,ycolor:C.dim});
 let s=A.svg+A.plot(Math.sin,{from:0,to:1.6,color:CU,w:5})+fade(tan,A.plot(u=>u,{from:0,to:1.55,color:TA,w:3.5}));
 s+=fade(tan,label('y ＝ θ',A.X(1.2)+14,A.Y(1.35),{size:24,color:TA,weight:700}))+label('y ＝ sinθ',A.X(1.25),A.Y(Math.sin(1.25))+40,{size:24,color:CU,weight:700});
 s+=dot(A.X(0),A.Y(0),9,AA);
 return {A,svg:s};
}


function farPic(p,stage){
 const A=axes({x:90,y:470,w:520,h:420,xmin:0,xmax:4.3,ymin:-4,ymax:18,xlabel:'x',ylabel:'y',xticks:[1,2,3,4],yticks:[5,10,15],grid:true,xcolor:CU});
 const gOld=stage?.3:1-.7*seg(p,.5,.7),gNew=stage?1:seg(p,.55,.8);
 let s=A.svg+A.plot(sq,{from:0,to:4.2,color:CU,w:4})+fade(gOld,lineThrough(A,3,9,6,.85,4.25,{color:TA,w:4})+dot(A.X(3),A.Y(9),9,AA)+line(A.X(1.1),A.Y(1.21),A.X(1.1),A.Y(-2.4),{color:DF,w:5})+dot(A.X(1.1),A.Y(-2.4),8,TA));
 s+=fade(gNew,lineThrough(A,1,1,2,.05,2.6,{color:TA,w:4})+dot(A.X(1),A.Y(1),9,AA)+label('a ＝ 1',A.X(1)-10,A.Y(1)-22,{size:24,color:AA,anchor:'end'}));
 s+=dot(A.X(1.1),A.Y(1.21),7,CU);
 s+=card(660,70,480,340,label('本当',780,125,{size:28,color:CU,anchor:'middle'})+tex(`1.1^2=${cs(CU,'1.21')}`,1000,125,{size:36,auto:false})
  +fade(stage?1:seg(p,.15,.35),label('a ＝ 3 の式 −2.4',900,190,{size:26,color:DF,anchor:'middle'})+ng(1060,195))
  +fade(gNew,label('a ＝ 1 で 作り直す',900,260,{size:28,color:AA,anchor:'middle',weight:700}))
  +fade(stage?seg(p,.05,.25):0,label('値 1，傾き 2',900,310,{size:26,color:C.ink,anchor:'middle'}))
  +fade(stage?seg(p,.3,.5):0,tex(`1+2\\times0.1=${cs(TA,'1.2')}`,900,370,{size:38,auto:false})+ok(1110,378,stage?seg(p,.6,.75):0)),1);
 return s;
}

export const ytUmApprox1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const {A,svg}=gx2({g:seg(p,0,.2),curve:seg(p,.05,.3),x:90,w:440});
  let s=svg+fade(seg(p,.25,.4),lineThrough(A,3,9,6,1.7,4.1,{color:TA,w:3,dash:'9 7'})+dot(A.X(3),A.Y(9),8,AA));
  s+=card(620,110,540,270,label('前回の最後の問い',890,160,{size:24,color:C.dim,anchor:'middle'})
   +label('曲線を 直線や 2次式で 置き換えると',890,235,{size:28,color:C.ink,anchor:'middle'})
   +label('どこまで 正確に 予想できる？',890,305,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  const A=axes({x:110,y:450,w:460,h:360,xmin:.6,xmax:1.45,ymin:.6,ymax:4.2,xlabel:'x',ylabel:'高さ',xticks:[1],yticks:[2,4],grid:true,xcolor:CU});
  let s=A.svg+A.plot(u=>2*u*u,{from:.6,to:1.43,color:CU,w:4})+fade(seg(p,.1,.3),lineThrough(A,1,2,4,.62,1.45,{color:TA,w:3,dash:'9 7'}));
  s+=dot(A.X(1),A.Y(2),8,AA)+label('y ＝ 2x²',A.X(1.25),A.Y(2*1.25*1.25)+50,{size:24,color:CU});
  s+=fade(seg(p,.1,.3),label('傾き 4',A.X(.7),A.Y(1.4)+10,{size:24,color:TA,weight:700}));
  s+=card(660,90,480,300,label('前回：0.01 先の高さ',900,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.2,.4),label('予想',780,215,{size:28,color:TA,anchor:'middle'})+tex('2.04',780,275,{size:44,auto:false}))
   +fade(seg(p,.6,.8),label('実際',1020,215,{size:28,color:CU,anchor:'middle'})+tex('2.0402',1020,275,{size:44,auto:false})
    +label('ずれ 0.0002',900,350,{size:28,color:DF,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'shokyu']:(p)=>{
  const {svg}=gsin({tan:seg(p,.15,.35)});
  let s=svg;
  s+=card(660,90,480,300,label('初級：小さな角',900,140,{size:26,color:C.dim,anchor:'middle'})
   +tex('\\sin\\theta\\approx\\theta',900,215,{size:50,auto:false})
   +fade(seg(p,.45,.65),label('θ ＝ 0.1 で',900,285,{size:26,color:C.ink,anchor:'middle'})+label('差 0.000167',900,340,{size:32,color:DF,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'goal']:(p)=>{
  let s=card(150,70,900,300,label('今回',600,125,{size:26,color:C.dim,anchor:'middle'})
   +label('傾きから 少し先の値を 予想する',600,205,{size:36,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('→ どんな曲線にも 使える形に',600,290,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.2));
  return s;
 },
 [K+'goal2']:(p)=>{
  const {A,svg}=gx2({x:90,w:480,xmin:1.5,xmax:4.3,ymin:0,ymax:18});
  let s=svg;
  [2,4,6,8,10].forEach((k,i)=>{s+=fade(seg(p,.1+i*.08,.2+i*.08),lineThrough(A,3,9,k,Math.max(1.55,3-9/k+.1),Math.min(4.25,3+8.5/k),{color:k===6?C.dim:C.dim,w:2.5,dash:'7 6'}));});
  s+=dot(A.X(3),A.Y(9),9,AA);
  s+=card(660,130,480,220,label('1本の直線で 置き換えるなら',900,195,{size:28,color:C.ink,anchor:'middle'})
   +label('どの直線が 最良？',900,275,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },

 // ===== S2 拡大すると直線 =====
 [K+'zoom1']:(p)=>{
  const {A,svg}=gx2({x:90,w:480});
  let s=svg+fade(seg(p,.3,.5),dot(A.X(3),A.Y(9),9,AA)+label('x ＝ 3',A.X(3)+14,A.Y(9)+36,{size:24,color:AA}));
  s+=fade(seg(p,.5,.7),label('y ＝ x²',A.X(3.7)+14,A.Y(13.69)+30,{size:26,color:CU,weight:700}));
  s+=zoomWindow(A,1,seg(p,.6,.8))+zoomPanel(1,{g:seg(p,.65,.85)});
  s+=fade(seg(p,.7,.9),label('等倍',ZP.x0+ZP.W/2,ZP.y0+ZP.H+36,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'zoom2']:(p)=>{
  const {A,svg}=gx2({x:90,w:480});
  const u=clamp((p-.05)/.8),hw=Math.pow(10,-2*smooth(u));
  let s=svg+dot(A.X(3),A.Y(9),9,AA)+label('x ＝ 3',A.X(3)+14,A.Y(9)+36,{size:24,color:AA})+label('y ＝ x²',A.X(3.7)+14,A.Y(13.69)+30,{size:26,color:CU,weight:700});
  s+=zoomWindow(A,hw)+zoomPanel(hw);
  const mag=1/hw,t=mag<3?'等倍':mag<30?'10倍':'100倍';
  const tt=mag<3?'等倍':`${Math.round(mag)}倍`;
  s+=label(p<.9?tt:'100倍',ZP.x0+ZP.W/2,ZP.y0+ZP.H+36,{size:24,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.85,.97),label('ほとんど 直線',ZP.x0+ZP.W/2,ZP.y0+60,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'line2']:(p)=>{
  const {A,svg}=gx2({x:90,w:480,xmin:1.5,xmax:4.3});
  let s=svg+dot(A.X(3),A.Y(9),9,AA);
  s+=card(660,110,480,280,label('直線を決める 二つの数',900,165,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),label('① ある点での 高さ',900,245,{size:32,color:AA,anchor:'middle'}))
   +fade(seg(p,.6,.8),label('② 傾き',900,320,{size:32,color:TA,anchor:'middle'})),seg(p,0,.2));
  return s;
 },
 [K+'fan']:(p)=>{
  const {A,svg}=gx2({x:90,w:480,xmin:1.5,xmax:4.3});
  let s=svg;
  [2,4,8,10,1].forEach((k,i)=>{s+=fade(seg(p,.1+i*.1,.2+i*.1),lineThrough(A,3,9,k,Math.max(1.55,3-9/k+.1),Math.min(4.25,3+8.5/k),{color:C.dim,w:2.5,dash:'7 6'}));});
  s+=dot(A.X(3),A.Y(9),9,AA)+label('(3, 9)',A.X(3)+16,A.Y(9)+34,{size:24,color:AA});
  s+=card(660,110,480,280,label('直線を決める 二つの数',900,165,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('① ある点での 高さ',900,245,{size:32,color:AA,anchor:'middle'})+ok(1090,250,seg(p,.1,.25))
   +label('② 傾き',900,320,{size:32,color:TA,anchor:'middle'})+fade(seg(p,.6,.75),label('？',1000,322,{size:32,color:TA,weight:700})),1);
  s+=fade(seg(p,.7,.85),label('高さだけでは 何本も',A.X(3.3),A.Y(1.8),{size:26,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'slope6']:(p)=>{
  const {A,svg}=gx2({x:90,w:480,xmin:1.5,xmax:4.3});
  const gOut=1-seg(p,.35,.55);
  let s=svg;
  [2,4,8,10,1].forEach(k=>{s+=fade(gOut,lineThrough(A,3,9,k,Math.max(1.55,3-9/k+.1),Math.min(4.25,3+8.5/k),{color:C.dim,w:2.5,dash:'7 6'}));});
  s+=fade(seg(p,.5,.75),lineThrough(A,3,9,6,1.7,4.25,{color:TA,w:5}));
  s+=dot(A.X(3),A.Y(9),9,AA)+label('(3, 9)',A.X(3)+16,A.Y(9)+34,{size:24,color:AA});
  s+=card(660,110,480,280,label('x² の傾き',900,165,{size:28,color:C.ink,anchor:'middle',weight:700})
   +tex('2x',900,240,{size:48})
   +fade(seg(p,.2,.4),label('x ＝ 3 で 6',900,320,{size:34,color:TA,anchor:'middle',weight:700})),1);
  s+=fade(seg(p,.7,.85),label('傾き 6',A.X(3.6)+10,A.Y(12.6)+10,{size:26,color:TA,weight:700}));
  return s;
 },
 [K+'tangent']:(p)=>{
  const {A,svg}=gx2({x:90,w:480,xmin:1.5,xmax:4.3});
  let s=svg+lineThrough(A,3,9,6,1.7,4.25,{color:TA,w:5})+dot(A.X(3),A.Y(9),9,AA)+label('(3, 9)',A.X(3)+16,A.Y(9)+34,{size:24,color:AA})+label('傾き 6',A.X(3.6)+10,A.Y(12.6)+10,{size:26,color:TA,weight:700});
  s+=card(660,90,480,320,label('x ＝ 3 での 接線',900,150,{size:34,color:TA,anchor:'middle',weight:700})
   +fade(seg(p,.25,.45),label('高さも 傾きも 合わせた',900,225,{size:28,color:C.ink,anchor:'middle'})+label('ただ 1本の直線',900,275,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.8),label('→ 最良の直線',900,355,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),TA);
  return s;
 },

 // ===== S3 接線近似の式 =====
 [K+'gen1']:(p)=>{
  const {svg}=ggen({tan:seg(p,.55,.75),aLab:seg(p,.1,.35)});
  let s=svg;
  s+=fade(seg(p,.1,.3),label('近似する場所 x ＝ a',900,110,{size:30,color:AA,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.55),label('値',800,190,{size:28,color:CU,anchor:'middle'})+tex(cs(CU,'f(a)'),800,250,{size:44,auto:false}));
  s+=fade(seg(p,.6,.8),label('傾き',1010,190,{size:28,color:TA,anchor:'middle'})+tex(cs(TA,"f'(a)"),1010,250,{size:44,auto:false}));
  return s;
 },
 [K+'gen2']:(p)=>{
  const {svg}=ggen({xpt:seg(p,.05,.3),rise:seg(p,.5,.75)});
  let s=svg;
  s+=label('近似する場所 x ＝ a',900,110,{size:30,color:AA,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),label('進んだ幅',900,200,{size:28,color:C.ink,anchor:'middle'})+tex('x-a',900,255,{size:44,auto:false}));
  s+=fade(seg(p,.5,.75),label('高さの変化 ＝ 傾き × 幅',900,335,{size:28,color:RI,anchor:'middle'})+tex(cs(RI,"f'(a)(x-a)"),900,395,{size:40,auto:false}));
  return s;
 },
 [K+'gen3']:(p)=>{
  const {svg}=ggen({xpt:1,rise:1});
  let s=svg;
  s+=fade(1-seg(p,0,.2),label('近似する場所 x ＝ a',900,110,{size:30,color:AA,anchor:'middle',weight:700}));
  s+=tex(FORM,905,190,{size:40,auto:false});
  s+=fade(seg(p,.2,.4),label('元の高さ',790,260,{size:24,color:CU,anchor:'middle'})+label('＋ 変化',1000,260,{size:24,color:RI,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),card(700,310,410,110,label('接線による近似',905,355,{size:30,color:TA,anchor:'middle',weight:700})+label('（1次近似）',905,398,{size:24,color:C.dim,anchor:'middle'}),1,TA));
  return s;
 },
 [K+'approx']:(p)=>{
  const {svg}=ggen({xpt:1,rise:1,gap:seg(p,.45,.65)});
  let s=svg+tex(FORM,905,190,{size:40,auto:false});
  const w=texWidth(FORM,40,false),wl=texWidth('f(x)',40,false),wa=texWidth('\\approx',40,false);
  const ax=905-w/2+wl+wa/2;
  s+=highlight(ax-26,135,52,80,seg(p,.05,.25));
  s+=fade(seg(p,.15,.35),label('≈ は 近似',ax,280,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.65),label('左は曲線，右は直線',905,350,{size:28,color:C.ink,anchor:'middle'})+label('x ＝ a のほかでは ずれる',905,400,{size:28,color:DF,anchor:'middle',weight:700}));
  return s;
 },
 [K+'where']:(p)=>{
  const {svg}=ggen({xpt:1,rise:1,gap:1});
  const F2=`f(x)\\approx f(${cs(AA,'a')})+f'(${cs(AA,'a')})(x-${cs(AA,'a')})`;
  let s=svg+tex(F2,905,190,{size:40,auto:false});
  s+=fade(seg(p,.1,.3),label('式の中に a が 3か所',905,275,{size:28,color:AA,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),card(690,320,430,110,label('場所 a を決めて',905,365,{size:28,color:C.ink,anchor:'middle'})+label('初めて 式が決まる',905,410,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },

 // ===== S4 x² で確かめる =====
 [K+'ex1']:(p)=>{
  const {A,svg}=gx2({x:90,w:480,xmin:1.5,xmax:4.3});
  let s=svg+dot(A.X(3),A.Y(9),9,AA)+fade(seg(p,.6,.8),lineThrough(A,3,9,6,1.7,4.25,{color:TA,w:4}));
  s+=card(660,70,480,340,tex('f(x)=x^2,\\quad a=3',900,125,{size:38,auto:false})
   +fade(seg(p,.3,.5),label('値',760,210,{size:28,color:CU,anchor:'middle'})+tex(cs(CU,'3^2=9'),760,265,{size:40,auto:false}))
   +fade(seg(p,.55,.75),label('傾き',1030,210,{size:28,color:TA,anchor:'middle'})+tex(cs(TA,'2\\times3=6'),1030,265,{size:40,auto:false})),seg(p,0,.2));
  return s;
 },
 [K+'ex2']:(p)=>{
  const {A,svg}=gx2({x:90,w:480,xmin:1.5,xmax:4.3});
  let s=svg+dot(A.X(3),A.Y(9),9,AA)+lineThrough(A,3,9,6,1.7,4.25,{color:TA,w:4});
  s+=card(660,70,480,340,tex('f(x)=x^2,\\quad a=3',900,125,{size:38,auto:false})
   +label('値',760,210,{size:28,color:CU,anchor:'middle'})+tex(cs(CU,'3^2=9'),760,265,{size:40,auto:false})
   +label('傾き',1030,210,{size:28,color:TA,anchor:'middle'})+tex(cs(TA,'2\\times3=6'),1030,265,{size:40,auto:false})
   +fade(seg(p,.1,.35),tex(`x^2\\approx${cs(CU,'9')}+${cs(TA,'6')}(x-3)`,900,355,{size:42,auto:false})),1);
  return s;
 },
 [K+'predict']:(p)=>{
  const {A,svg}=gx2({x:90,w:480,xmin:1.5,xmax:4.3});
  let s=svg+dot(A.X(3),A.Y(9),9,AA)+lineThrough(A,3,9,6,1.7,4.25,{color:TA,w:4});
  s+=fade(seg(p,.1,.3),line(A.X(3.1),A.Y(0)-8,A.X(3.1),A.Y(0)+8,{color:C.ink,w:3})+label('3.1',A.X(3.1)+6,A.Y(0)+36,{size:22,color:C.ink}));
  s+=card(660,70,480,340,tex(`x^2\\approx${cs(CU,'9')}+${cs(TA,'6')}(x-3)`,900,135,{size:42,auto:false})
   +fade(seg(p,.1,.3),label('x ＝ 3.1 では？',900,240,{size:36,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.4,.6),label('予想してみよう',900,320,{size:26,color:C.hi,anchor:'middle'})),1,C.hi);
  return s;
 },
 [K+'calc']:(p)=>{
  const {A,svg}=gx2({x:90,w:480,xmin:1.5,xmax:4.3});
  let s=svg+dot(A.X(3),A.Y(9),9,AA)+lineThrough(A,3,9,6,1.7,4.25,{color:TA,w:4})+line(A.X(3.1),A.Y(0)-8,A.X(3.1),A.Y(0)+8,{color:C.ink,w:3})+label('3.1',A.X(3.1)+6,A.Y(0)+36,{size:22,color:C.ink});
  s+=card(660,70,480,340,tex(`x^2\\approx${cs(CU,'9')}+${cs(TA,'6')}(x-3)`,900,135,{size:42,auto:false})
   +fade(seg(p,.05,.25),label('幅 x − 3 ＝ 0.1',900,215,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.3,.5),tex(`${cs(CU,'9')}+${cs(TA,'6')}\\times0.1`,900,285,{size:42,auto:false}))
   +fade(seg(p,.6,.8),tex(`=${cs(TA,'9.6')}`,900,355,{size:46,auto:false})),1);
  return s;
 },
 [K+'true']:(p)=>{
  let s=card(90,70,1020,320,'',1);
  s+=label('予想（接線）',330,140,{size:30,color:TA,anchor:'middle'})+tex(cs(TA,'9.6'),330,215,{size:56,auto:false});
  s+=fade(seg(p,.05,.3),label('本当（x²）',870,140,{size:30,color:CU,anchor:'middle'})+tex(`3.1^2=${cs(CU,'9.61')}`,870,215,{size:52,auto:false}));
  s+=fade(seg(p,.5,.7),label('足りない',600,300,{size:28,color:DF,anchor:'middle'})+label('0.01',600,355,{size:44,color:DF,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sq1']:(p)=>{
  let s=square({main:seg(p,.3,.45),right:seg(p,.5,.65),top:seg(p,.5,.65),corner:seg(p,.5,.65),labels:0});
  s+=fade(seg(p,.05,.2),label('この 0.01 は どこから？',850,110,{size:32,color:DF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.5),label('一辺 3 の正方形',850,210,{size:28,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),label('→ 一辺 3.1 に 広げる',850,265,{size:28,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.7,.9),label('（0.1 は 大きく描いています）',850,330,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sq2']:(p)=>{
  let s=square({labels:seg(p,.05,.4)});
  s+=label('増えた面積',850,110,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),label('右の帯 0.3',850,180,{size:28,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.2,.4),label('上の帯 0.3',850,230,{size:28,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.3,.5),label('右上の角 0.01',850,280,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('微分・中級で見た 正方形',850,360,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sq3']:(p)=>{
  let s=square({});
  s+=card(590,70,560,160,label('帯 2本',700,125,{size:28,color:C.t,anchor:'middle',weight:700})+tex(`0.6=${cs(TA,'6')}\\times0.1`,940,125,{size:36,auto:false})
   +label('接線が 数えた分',870,195,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.t);
  s+=card(590,260,560,160,label('角',700,315,{size:28,color:C.a,anchor:'middle',weight:700})+tex(`${cs(DF,'0.01')}=0.1^2`,940,315,{size:36,auto:false})
   +label('接線が 落とした分',870,385,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.7),C.a);
  return s;
 },
 [K+'half']:(p)=>{
  const X=[250,470,690,910];
  let s=card(90,70,1020,300,'',1);
  ['幅','予想','本当','差'].forEach((t,i)=>{s+=label(t,X[i],125,{size:28,color:[C.t,TA,CU,DF][i],anchor:'middle',weight:700});});
  s+=line(110,150,1090,150,{color:C.faint,w:2});
  const R=[['0.1','9.6','9.61','0.01'],['0.05','9.3','9.3025','0.0025']];
  R.forEach((r,j)=>{s+=fade(j?seg(p,.05,.3):1,r.map((t,i)=>label(t,X[i],215+j*80,{size:32,color:[C.t,TA,CU,DF][i],anchor:'middle',weight:i===3?700:400})).join(''));});
  s+=fade(seg(p,.7,.85),label('幅 半分 → 差 4分の1',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sqlaw']:(p)=>{
  const X=[250,470,690,910];
  let s=card(90,70,1020,300,'',1);
  ['幅','予想','本当','差'].forEach((t,i)=>{s+=label(t,X[i],125,{size:28,color:[C.t,TA,CU,DF][i],anchor:'middle',weight:700});});
  s+=line(110,150,1090,150,{color:C.faint,w:2});
  const R=[['0.1','9.6','9.61','0.01'],['0.05','9.3','9.3025','0.0025']];
  R.forEach((r,j)=>{s+=r.map((t,i)=>label(t,X[i],215+j*80,{size:32,color:[C.t,TA,CU,DF][i],anchor:'middle',weight:i===3?700:400})).join('');});
  s+=fade(seg(p,.05,.25),label('＝ 0.1²',1030,215,{size:26,color:DF,anchor:'middle'})+label('＝ 0.05²',1030,295,{size:26,color:DF,anchor:'middle'}));
  s+=fade(seg(p,.1,.3),label('差 ＝ 幅の2乗',600,440,{size:32,color:DF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('a の近くほど よく合う',600,490,{size:26,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'far1']:(p)=>{
  const A=axes({x:90,y:470,w:520,h:420,xmin:0,xmax:4.3,ymin:-4,ymax:18,xlabel:'x',ylabel:'y',xticks:[1,2,3,4],yticks:[5,10,15],grid:true,xcolor:CU});
  let s=A.svg+A.plot(sq,{from:0,to:4.2,color:CU,w:4})+lineThrough(A,3,9,6,.85,4.25,{color:TA,w:4})+dot(A.X(3),A.Y(9),9,AA);
  s+=label('a ＝ 3',A.X(3)+14,A.Y(9)+32,{size:24,color:AA});
  const g=seg(p,.35,.6);
  s+=fade(g,line(A.X(1.1),A.Y(1.21),A.X(1.1),A.Y(-2.4),{color:DF,w:5})+dot(A.X(1.1),A.Y(-2.4),8,TA)+dot(A.X(1.1),A.Y(1.21),8,CU));
  s+=card(660,70,480,340,label('a ＝ 3 の式を x ＝ 1.1 に',900,125,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.25,.45),tex(`9+6\\times(-1.9)`,900,215,{size:42,auto:false}))
   +fade(seg(p,.55,.75),tex(`=${cs(TA,'-2.4')}`,900,290,{size:46,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'far2']:(p)=>farPic(p,0),
 [K+'far3']:(p)=>farPic(p,1),

 // ===== S5 √(1+x) =====
 [K+'rt1']:(p)=>{
  const {A,svg}=grt({g:seg(p,.05,.25)});
  let s=svg+fade(seg(p,.1,.3),label('y ＝ √(1＋x)',A.X(1.8),A.Y(Math.sqrt(2.8))-18,{size:26,color:CU,weight:700,anchor:'middle'}));
  s+=card(680,90,460,300,label('x ＝ 0 の近くで 直線に',910,145,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.55,.75),label('x ＝ 0 での値',910,225,{size:28,color:AA,anchor:'middle'})+tex('\\sqrt{1}=1',910,295,{size:44,auto:false})),seg(p,.05,.2));
  return s;
 },
 [K+'rt2']:(p)=>{
  const {A,svg}=grt({});
  let s=svg+label('y ＝ √(1＋x)',A.X(1.8),A.Y(Math.sqrt(2.8))-18,{size:26,color:CU,weight:700,anchor:'middle'});
  s+=card(680,60,460,380,label('√ の傾き：まだ 扱っていない',910,110,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.5),label('直線を',910,180,{size:28,color:C.ink,anchor:'middle'})+tex(cs(TA,'1+kx'),910,240,{size:48,auto:false})+label('と置く',910,300,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.8),label('2乗して 1＋x に 合う k は？',910,385,{size:28,color:C.hi,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'rt3']:(p)=>{
  let s=label('2乗して 1＋x と比べる',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=tex(`(${cs(TA,'1+kx')})^2`,600,160,{size:56,auto:false});
  s+=fade(seg(p,.25,.5),tex('=1+2kx+k^2x^2',600,270,{size:56,auto:false}));
  return s;
 },
 [K+'rt4']:(p)=>{
  const R='=1+2kx+k^2x^2',w=texWidth(R,56,false),x0=600-w/2;
  const w1=texWidth('=1+',56,false),w2=texWidth('2kx',56,false),w3=texWidth('+',56,false),w4=texWidth('k^2x^2',56,false);
  let s=label('2乗して 1＋x と比べる',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=tex(`(${cs(TA,'1+kx')})^2`,600,160,{size:56,auto:false})+tex(R,600,270,{size:56,auto:false});
  s+=fade(seg(p,.05,.25),rect(x0+w1+w2+w3-8,225,w4+16,80,{fill:C.dim,fo:.12,stroke:C.dim,sw:2,rx:10})+label('x² の項：ずっと小さい',x0+w1+w2+w3+w4/2,340,{size:24,color:C.dim,anchor:'middle'}));
  s+=highlight(x0+w1-10,225,w2+20,80,seg(p,.45,.6));
  s+=fade(seg(p,.45,.65),tex('1+x',600-w/2+w1+w2/2-40,420,{size:44,auto:false})+label('x の項をそろえる',330,425,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.7,.9),tex(cs(C.hi,'2k=1'),900,425,{size:48,auto:false}));
  return s;
 },
 [K+'rt5']:(p)=>{
  let s=tex(cs(C.hi,'2k=1'),600,90,{size:48,auto:false});
  s+=fade(seg(p,.05,.3),label('両辺を 2 で割る',600,160,{size:26,color:C.dim,anchor:'middle'})+tex('k=\\tfrac12',600,230,{size:52,auto:false}));
  s+=fade(seg(p,.45,.7),tex(`\\sqrt{1+x}\\approx${cs(TA,'1+\\tfrac{x}{2}')}`,600,360,{size:62,auto:false}));
  return s;
 },
 [K+'chk1']:(p)=>{
  let s=label('2乗して 確かめる',600,60,{size:28,color:C.dim,anchor:'middle'});
  s+=tex(`\\left(${cs(TA,'1+\\tfrac{x}{2}')}\\right)^2`,600,150,{size:52,auto:false});
  s+=fade(seg(p,.2,.45),tex(`=1+x+${cs(DF,'\\tfrac{x^2}{4}')}`,600,260,{size:52,auto:false}));
  s+=fade(seg(p,.6,.8),label('1＋x より x²/4 だけ 大きい',600,380,{size:32,color:DF,anchor:'middle',weight:700}));
  return s;
 },
 [K+'chk2']:(p)=>{
  let s=label('x ＝ 0.02',600,60,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.3),tex(`\\sqrt{1.02}\\approx1+0.01=${cs(TA,'1.01')}`,600,150,{size:48,auto:false}));
  s+=fade(seg(p,.45,.65),tex(`${cs(TA,'1.01')}^2=1.0201`,600,260,{size:48,auto:false}));
  s+=fade(seg(p,.7,.9),label('1.02 より 0.0001 大きいだけ',600,370,{size:32,color:DF,anchor:'middle',weight:700})+label('（x²/4 ＝ 0.0001）',600,420,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'chk3']:(p)=>{
  let s=label('電卓',330,80,{size:28,color:CU,anchor:'middle'})+tex(`\\sqrt{1.02}=${cs(CU,'1.00995\\ldots')}`,330,150,{size:40,auto:false});
  s+=label('近似',870,80,{size:28,color:TA,anchor:'middle'})+tex(cs(TA,'1.01'),870,150,{size:44,auto:false});
  s+=fade(seg(p,.2,.4),label('差 約 0.00005',600,250,{size:34,color:DF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),ng(330,370)+tex('\\sqrt{1.02}=1.01',500,360,{size:40,auto:false}));
  s+=fade(seg(p,.65,.85),ok(760,370)+tex('\\sqrt{1.02}\\approx1.01',930,360,{size:40,auto:false}));
  return s;
 },
 [K+'rtg']:(p)=>{
  const {A,svg}=grt({tan:seg(p,.05,.3),mark:seg(p,.45,.65)});
  let s=svg+label('y ＝ √(1＋x)',A.X(2.2),A.Y(Math.sqrt(3.2))+44,{size:24,color:CU,weight:700,anchor:'middle'});
  s+=fade(seg(p,.05,.3),label('y ＝ 1＋x/2',A.X(2.3),A.Y(2.15)-24,{size:24,color:TA,weight:700,anchor:'middle'}));
  s+=card(680,110,460,260,label('x ＝ 0 で 曲線に接する',910,170,{size:28,color:TA,anchor:'middle',weight:700})
   +fade(seg(p,.45,.65),label('0.02 の近くでは',910,245,{size:28,color:C.ink,anchor:'middle'})+label('ほとんど 重なる',910,300,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.3));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sin']:(p)=>{
  const {svg}=gsin({tan:seg(p,.55,.8)});
  let s=svg;
  s+=card(660,70,480,360,label('初級の sinθ ≈ θ も 接線近似',900,120,{size:26,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.2,.4),label('θ ＝ 0 での値',780,190,{size:24,color:CU,anchor:'middle'})+tex(cs(CU,'\\sin0=0'),780,245,{size:36,auto:false}))
   +fade(seg(p,.35,.55),label('傾き',1030,190,{size:24,color:TA,anchor:'middle'})+tex(cs(TA,'\\cos0=1'),1030,245,{size:36,auto:false}))
   +fade(seg(p,.6,.8),tex(`\\sin\\theta\\approx${cs(CU,'0')}+${cs(TA,'1')}\\times\\theta`,900,350,{size:40,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'sum1']:(p)=>{
  let s=card(120,80,960,200,label('接線近似（1次近似）',600,135,{size:28,color:TA,anchor:'middle',weight:700})
   +tex(FORM,600,215,{size:50,auto:false}),seg(p,0,.2),TA);
  s+=fade(seg(p,.4,.6),label('a での 値と傾きを 合わせた ただ1本の直線',600,350,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(120,80,960,200,label('接線近似（1次近似）',600,135,{size:28,color:TA,anchor:'middle',weight:700})
   +tex(FORM,600,215,{size:50,auto:false}),1,TA);
  s+=square({x0:180,y0:310,u:120,hh:40,labels:0,g:seg(p,.05,.25)});
  s+=fade(seg(p,.1,.3),label('x² の差 ＝ 幅の2乗（角）',600,375,{size:30,color:DF,weight:700}));
  s+=fade(seg(p,.5,.7),label('直線は 曲がりを 表せない',600,440,{size:30,color:C.ink,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(150,70,900,340,label('次の問い',600,120,{size:26,color:C.dim,anchor:'middle'})
   +label('2次式まで 使うと 係数は どう決まる？',600,200,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('初級の sinθ の差',600,280,{size:28,color:C.ink,anchor:'middle'})+tex('\\dfrac{\\theta^3}{6}',600,345,{size:48,auto:false})+label('は どこから来る？',790,355,{size:30,color:C.hi,weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
};
