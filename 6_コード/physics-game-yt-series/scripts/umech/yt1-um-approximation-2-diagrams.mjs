// YouTube シリーズ「近似・中級 2/2」(ys-um-approximation-2) — 図。Stage 1200×515.
// 色（1/2 と同じ）：本物の曲線・値 水色、接線（1次）・傾き 黄、曲がり（2次）桃、3次 紫、差（捨てた分）赤。
// 正方形の図は 1/2（um-approximation-1:sq*）と同じ配色：元の正方形 水色、帯 金、角 赤。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';

const K='um-approximation-2:';
const CU=C.x,TA=C.hi,Q2=C.p,Q3=C.v,DF=C.a,GR='#5d6b86';
const OC=[CU,TA,Q2,Q3];           // colour by order: value, 1st, 2nd, 3rd derivative
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
let clipN=0;
const clipBox=(x,y,w,h,inner)=>{const id=`ua2c${clipN++}`;return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g>`;};
// crossfade between several TeX versions of the same row (stage k shown with weight w[k]).
const xf=(srcs,ws,x,y,size)=>srcs.map((s,i)=>fade(ws[i],T(s,x,y,size))).join('');

// ---- cos x near 0 -----------------------------------------------------------------------------------
function gcos({g=1,tan=0,par=0,mark=0,x=80,y=450,w=520,h=380}={}){
 const A=axes({x,y,w,h,xmin:-2.2,xmax:2.2,ymin:-1.3,ymax:1.5,xlabel:'x',ylabel:'y',xticks:[-2,-1,1,2],yticks:[-1,1],grid:true,g});
 let s=A.svg+A.plot(Math.cos,{from:-2.2,to:2.2,color:CU,w:4.5});
 s+=fade(tan,A.plot(()=>1,{from:-2.1,to:2.1,color:TA,w:3.5}));
 s+=fade(par,clipBox(x,y-h,w,h,A.plot(u=>1-u*u/2,{from:-2.2,to:2.2,color:Q2,w:4})));
 s+=dot(A.X(0),A.Y(1),9,C.E);
 if(mark)s+=fade(mark,line(A.X(.1),A.Y(0)-8,A.X(.1),A.Y(0)+8,{color:C.ink,w:3})+label('0.1',A.X(.1)+8,A.Y(0)+30,{size:22,color:C.ink}));
 return {A,svg:s};
}
const cosLab=(A,g=1)=>fade(g,label('y ＝ cos x',A.X(1.25),A.Y(1.3),{size:24,color:CU,weight:700,anchor:'middle'}));

// ---- sin x from 0 ------------------------------------------------------------------------------------
function gsin({g=1,lin=0,cub=0,xmax=3.2,sym='x',x=80,y=455,w=520,h=400,ymin=-1.3,ymax=2}={}){
 const A=axes({x,y,w,h,xmin:-.1,xmax,ymin,ymax,xlabel:sym,ylabel:'y',xticks:[1,2,3].filter(v=>v<xmax),yticks:[-1,1],grid:true,g});
 let s=A.svg+A.plot(Math.sin,{from:0,to:xmax,color:CU,w:4.5});
 s+=fade(lin,clipBox(x,y-h,w,h,A.plot(u=>u,{from:0,to:xmax,color:TA,w:3.5})));
 s+=fade(cub,clipBox(x,y-h,w,h,A.plot(u=>u-u*u*u/6,{from:0,to:xmax,color:Q3,w:4})));
 s+=dot(A.X(0),A.Y(0),9,C.E);
 return {A,svg:s};
}

// ---- the square of side 3 + 0.1 (same as 1/2) -------------------------------------------------------------
function square({g=1,labels=1,x0=110,y0=50,u=300,hh=90}={}){
 const F=u+hh;let s='';
 s+=rect(x0,y0+hh,u,u,{fill:C.x,fo:.25,rx:0})+fade(labels,label('9',x0+u/2,y0+hh+u/2+12,{size:34,color:C.x,anchor:'middle',weight:700}));
 s+=rect(x0+u,y0+hh,hh,u,{fill:C.t,fo:.32,rx:0})+fade(labels,label('0.3',x0+u+hh/2,y0+hh+u/2+10,{size:26,color:C.t,anchor:'middle',weight:700}));
 s+=rect(x0,y0,u,hh,{fill:C.t,fo:.32,rx:0})+fade(labels,label('0.3',x0+u/2,y0+hh/2+10,{size:26,color:C.t,anchor:'middle',weight:700}));
 s+=rect(x0+u,y0,hh,hh,{fill:C.a,fo:.4,rx:0})+fade(labels,label('0.01',x0+u+hh/2,y0+hh/2+9,{size:22,color:C.a,anchor:'middle',weight:700}));
 s+=rect(x0,y0,F,F,{fill:'none',fo:0,stroke:C.dim,sw:3,rx:0});
 s+=fade(labels,label('3',x0+u/2,y0+F+32,{size:24,color:C.ink,anchor:'middle'})+label('0.1',x0+u+hh/2,y0+F+32,{size:24,color:C.t,anchor:'middle'}));
 return fade(g,s);
}

// ---- tables -------------------------------------------------------------------------------------------------
// cols: [{x, head, color}] ; rows: [{y, color, cells:[tex or null]}] ; gc(r,c) visibility.
function table({cols,rows,gc=()=>1,top=70,left=90,right=1110,bottom,headY,size=34}){
 let s=rect(left,top,right-left,(bottom??rows[rows.length-1].y+40)-top,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 const hy=headY??top+46;
 cols.forEach(c=>{if(c.head)s+=label(c.head,c.x,hy,{size:24,color:c.hcolor??C.dim,anchor:'middle',weight:700});});
 s+=line(left+20,hy+20,right-20,hy+20,{color:C.faint,w:2});
 rows.forEach((r,i)=>r.cells.forEach((t,j)=>{if(t==null)return;const g=gc(i,j);if(g<=0.001)return;
  const col=cols[j],color=r.colors?.[j]??col.color??r.color??C.ink;
  s+=fade(g,col.text?label(t,col.x,r.y+10,{size:28,color,anchor:'middle',weight:700}):T(cs(color,t),col.x,r.y,size));}));
 return s;
}
const ROWN=['値','1回微分','2回微分','3回微分'];

// cos table: order rows 0..2
function cosTable(p,stage){
 const cols=[{x:190,text:1,head:''},{x:420,head:'関数'},{x:640,head:'x ＝ 0 で'},{x:830,head:'割る数'},{x:1010,head:'係数',hcolor:C.hi}];
 const F=['\\cos x','-\\sin x','-\\cos x'],V=['1','0','-1'],D=['1','1','2'],Cf=['1','0','-\\dfrac12'];
 const rows=[0,1,2].map(i=>({y:160+i*85,color:OC[i],cells:[ROWN[i],F[i],V[i],D[i],Cf[i]],colors:[OC[i],OC[i],OC[i],C.ink,OC[i]]}));
 const gc=stage===0?(r,c)=>c<=1?(r<2?1:seg(p,.45,.7)):c===2?(r<2?seg(p,.1,.3):0):0
  :(r,c)=>c<=1?1:c===2?(r<2?1:seg(p,.05,.3)):c===3?seg(p,.4,.6):seg(p,.55,.8);
 return table({cols,rows,gc,top:60,bottom:410});
}
// sin table: order rows 0..3
function sinTable(p,stage){
 const cols=[{x:190,text:1,head:''},{x:420,head:'関数'},{x:640,head:'x ＝ 0 で'},{x:830,head:'割る数'},{x:1010,head:'係数',hcolor:C.hi}];
 const F=['\\sin x','\\cos x','-\\sin x','-\\cos x'],V=['0','1','0','-1'],D=['1','1','2','6'],Cf=['0','1','0','-1/6'];
 const rows=[0,1,2,3].map(i=>({y:135+i*68,color:OC[i],cells:[ROWN[i],F[i],V[i],D[i],Cf[i]],colors:[OC[i],OC[i],OC[i],C.ink,OC[i]]}));
 const gc=stage===0?(r,c)=>c<=1?1:c===2?seg(p,.15+r*.14,.3+r*.14):0
  :(r,c)=>c<=2?1:c===3?seg(p,.03,.2):seg(p,.2+r*.06,.32+r*.06);
 return table({cols,rows,gc,top:50,bottom:365,headY:88,size:32});
}

// sin + cubic comparison table (x, estimate, actual difference)
function errTable(p,n){
 const cols=[{x:260,head:'x'},{x:560,head:'見積もり x⁵/120',hcolor:DF},{x:880,head:'実際の差',hcolor:C.ink}];
 const R=[['0.1','8\\times10^{-8}','8\\times10^{-8}'],['0.5','0.00026','0.00026']];
 const rows=R.slice(0,n).map((c,i)=>({y:175+i*95,cells:c,colors:[C.ink,DF,C.ink]}));
 const gc=(r,c)=>r===n-1?(c===0?1:c===1?seg(p,.1,.3):seg(p,.5,.7)):1;
 return table({cols,rows,gc,top:70,bottom:380});
}

// general Taylor formula with term centres
const TF=[['f(x)\\approx',C.ink],[cs(CU,'f(0)'),CU],[`+${cs(TA,"f'(0)")}x`,TA],[`+${cs(Q2,"\\dfrac{f''(0)}{2}")}x^2`,Q2],[`+${cs(Q3,"\\dfrac{f'''(0)}{6}")}x^3`,Q3],['+\\cdots',C.ink]];
function taylorRow(n,cx,y,size){
 const parts=TF.slice(0,n),ws=parts.map(q=>texWidth(q[0],size,false)),W=ws.reduce((a,b)=>a+b,0);
 let x=cx-W/2;const centres=ws.map(w=>{const c=x+w/2;x+=w;return c;});
 return {svg:T(parts.map(q=>q[0]).join(''),cx,y,size),centres};
}

export const ytUmApprox2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const {A,svg}=gsin({g:seg(p,0,.2),lin:seg(p,.15,.35),xmax:1.8,sym:'θ',ymax:1.8,ymin:-.2,w:470});
  let s=svg+fade(seg(p,.2,.4),label('y ＝ θ',A.X(1.1)-14,A.Y(1.1)-8,{size:24,color:TA,weight:700,anchor:'end'})+label('y ＝ sinθ',A.X(1.45),A.Y(Math.sin(1.45))+44,{size:24,color:CU,weight:700,anchor:'middle'}));
  s+=card(640,90,520,320,label('前回の最後の問い',900,140,{size:24,color:C.dim,anchor:'middle'})
   +label('2次式まで 使うと',900,205,{size:30,color:C.ink,anchor:'middle'})
   +label('係数は どう決まる？',900,255,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.4,.6),label('sinθ の差',815,345,{size:28,color:C.ink,anchor:'end'})+T('\\dfrac{\\theta^3}{6}',860,340,40)+label('は どこから？',905,352,{size:30,color:C.hi,weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=card(120,50,960,190,label('前回：接線近似（1次近似）',600,100,{size:26,color:TA,anchor:'middle',weight:700})
   +T(`f(x)\\approx${cs(CU,'f(a)')}+${cs(TA,"f'(a)(x-a)")}`,600,175,46),seg(p,0,.2),TA);
  s+=square({x0:190,y0:275,u:150,hh:50,labels:0,g:seg(p,.4,.6)});
  s+=fade(seg(p,.5,.7),label('x² の差 ＝ 幅の2乗（角）',480,370,{size:30,color:DF,weight:700}));
  s+=fade(seg(p,.65,.85),label('直線は 曲がりを 表せない',480,430,{size:28,color:C.ink}));
  return s;
 },
 [K+'cos1']:(p)=>{
  const {A,svg}=gcos({g:seg(p,0,.15),tan:seg(p,.65,.85)});
  let s=svg+fade(seg(p,.05,.2),cosLab(A));
  s+=card(660,70,480,340,label('cos x を x ＝ 0 の近くで 直線に',900,120,{size:26,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),label('値',780,195,{size:28,color:CU,anchor:'middle'})+T(cs(CU,'\\cos0=1'),780,255,38))
   +fade(seg(p,.5,.7),label('傾き',1025,195,{size:28,color:TA,anchor:'middle'})+T(cs(TA,'-\\sin0=0'),1025,255,38))
   +fade(seg(p,.7,.9),label('→ 水平な直線 y ＝ 1',900,345,{size:28,color:TA,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'cos2']:(p)=>{
  const {A,svg}=gcos({tan:1,mark:seg(p,.3,.5)});
  let s=svg+cosLab(A);
  s+=card(660,70,480,340,label('x ＝ 0.1 で',900,120,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('接線',780,185,{size:26,color:TA,anchor:'middle'})+T(cs(TA,'1'),780,240,42)
   +fade(seg(p,.3,.5),label('本当',1020,185,{size:26,color:CU,anchor:'middle'})+T(cs(CU,'0.995004'),1020,240,40))
   +fade(seg(p,.6,.8),label('ずれ 約 0.005',900,335,{size:32,color:DF,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'cos3']:(p)=>{
  const {A,svg}=gcos({tan:1});
  let s=svg+cosLab(A);
  const g=seg(p,.05,.3);
  s+=fade(g,arrow(A.X(-.9),A.Y(1)+6,A.X(-.9),A.Y(Math.cos(.9))-8,{color:DF,w:4,head:14})+arrow(A.X(.9),A.Y(1)+6,A.X(.9),A.Y(Math.cos(.9))-8,{color:DF,w:4,head:14}));
  s+=fade(g,label('曲がり',A.X(0),A.Y(.35),{size:28,color:DF,anchor:'middle',weight:700}));
  s+=card(660,90,480,300,label('直線は 頂上の曲がりを',900,150,{size:28,color:C.ink,anchor:'middle'})+label('表せない',900,195,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.7),label('今回：曲がりまで 合わせた',900,275,{size:28,color:Q2,anchor:'middle',weight:700})+label('2次式',900,330,{size:34,color:Q2,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'goal']:(p)=>{
  let s=card(150,90,900,300,label('今回の問い',600,145,{size:26,color:C.dim,anchor:'middle'})
   +label('2次・3次の項を 足すと',600,220,{size:34,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),label('どこまで 近づき',600,285,{size:34,color:Q2,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.75),label('どこで 使えなくなる？',600,345,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.2),C.hi);
  return s;
 },

 // ===== S2 2次の係数を決める =====
 [K+'poly']:(p)=>{
  let s=label('x ＝ 0 の近くで',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.25),T(`f(x)\\approx${cs(CU,'c_0')}+${cs(TA,'c_1')}x+${cs(Q2,'c_2')}x^2`,600,170,60));
  s+=fade(seg(p,.55,.7),T(cs(CU,'c_0=\\,?'),370,330,46)+T(cs(TA,'c_1=\\,?'),600,330,46)+T(cs(Q2,'c_2=\\,?'),830,330,46));
  s+=fade(seg(p,.65,.8),label('これから 決める 係数',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=T(`f(x)\\approx${cs(CU,'c_0')}+${cs(TA,'c_1')}x+${cs(Q2,'c_2')}x^2`,600,70,40);
  s+=card(170,120,860,330,label('x ＝ 0 で f と そろえる',600,170,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),label('① 値',380,245,{size:32,color:CU,weight:700})+label('（高さ）',700,245,{size:28,color:C.dim}))
   +fade(seg(p,.35,.5),label('② 傾き',380,315,{size:32,color:TA,weight:700})+label('（1回微分）',700,315,{size:28,color:C.dim}))
   +fade(seg(p,.5,.65),label('③ 傾きの変わり方',380,385,{size:32,color:Q2,weight:700})+label('（2回微分）',700,385,{size:28,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'c0']:(p)=>{
  let s=T(`f(x)\\approx${cs(CU,'c_0')}+${cs(TA,'c_1')}x+${cs(Q2,'c_2')}x^2`,600,70,40);
  s+=fade(seg(p,.1,.25),label('① 値：x ＝ 0 を入れる',600,150,{size:28,color:CU,anchor:'middle',weight:700}));
  const g1=seg(p,.35,.55);
  s+=fade(seg(p,.15,.3),xf([`${cs(CU,'c_0')}+${cs(TA,'c_1')}\\cdot0+${cs(Q2,'c_2')}\\cdot0^2`,`${cs(CU,'c_0')}${cs(GR,'+c_1\\cdot0+c_2\\cdot0^2')}`],[1-g1,g1],600,240,48));
  s+=fade(g1,label('0 になる',600+texWidth('c_0+c_1\\cdot0+c_2\\cdot0^2',48,false)/2-120,305,{size:24,color:GR,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),rect(420,345,360,90,{fill:CU,fo:.08,stroke:CU,sw:2.5,rx:12})+T(cs(CU,'c_0=f(0)'),600,395,48));
  return s;
 },
 [K+'c1']:(p)=>{
  let s=T(`f(x)\\approx${cs(CU,'c_0')}+${cs(TA,'c_1')}x+${cs(Q2,'c_2')}x^2`,600,70,40);
  s+=fade(seg(p,.05,.2),label('② 傾き：1回微分',600,150,{size:28,color:TA,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3),T(`f'(x)\\approx${cs(TA,'c_1')}+2${cs(Q2,'c_2')}x`,600,230,48));
  s+=fade(seg(p,.4,.6),label('x ＝ 0 では',330,318,{size:28,color:C.ink,anchor:'middle'})+T(`${cs(TA,'c_1')}+2${cs(Q2,'c_2')}\\cdot0=${cs(TA,'c_1')}`,720,310,42));
  s+=fade(seg(p,.7,.85),rect(420,355,360,90,{fill:TA,fo:.08,stroke:TA,sw:2.5,rx:12})+T(cs(TA,"c_1=f'(0)"),600,405,48));
  return s;
 },
 [K+'c2a']:(p)=>{
  let s=T(`f'(x)\\approx${cs(TA,'c_1')}+2${cs(Q2,'c_2')}x`,600,70,40);
  s+=fade(seg(p,.05,.2),label('③ もう1回 微分',600,150,{size:28,color:Q2,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.35),T(`f''(x)\\approx2${cs(Q2,'c_2')}`,600,235,52));
  s+=fade(seg(p,.5,.7),card(250,300,700,150,label('x² を 2回 微分すると',600,345,{size:26,color:C.dim,anchor:'middle'})
   +T('x^2\\;\\to\\;2x\\;\\to\\;2',600,410,46)));
  return s;
 },
 [K+'c2b']:(p)=>{
  let s=label('2回微分 ＝ 傾きの変わり方（曲がり具合）',600,70,{size:28,color:Q2,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.5),T(`2${cs(Q2,'c_2')}=f''(0)`,600,170,52));
  s+=fade(seg(p,.55,.7),label('両辺を 2 で割る',600,255,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.65,.85),rect(410,295,380,150,{fill:Q2,fo:.08,stroke:Q2,sw:2.5,rx:12})+T(cs(Q2,"c_2=\\dfrac{f''(0)}{2}"),600,375,52));
  return s;
 },
 [K+'form']:(p)=>{
  const {svg,centres}=taylorRow(4,600,210,50);
  let s=label('2次近似',600,90,{size:32,color:Q2,anchor:'middle',weight:700});
  s+=svg;
  s+=fade(seg(p,.4,.6),label('値',centres[1],330,{size:28,color:CU,anchor:'middle',weight:700})+label('傾き',centres[2]+10,330,{size:28,color:TA,anchor:'middle',weight:700})+label('曲がり',centres[3]+10,330,{size:28,color:Q2,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),brace(centres[1]-50,centres[2]+80,370,{dir:1,color:TA,text:'接線（1次）',size:24})+label('＋ 曲がりの項',centres[3]+10,430,{size:26,color:Q2,anchor:'middle'}));
  return s;
 },
 [K+'sqback']:(p)=>{
  let s=square({labels:1});
  s+=card(580,60,580,390,label('前回の x²（a ＝ 3，幅 0.1）',870,110,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.25),label('2回微分',720,175,{size:28,color:Q2,anchor:'middle'})+T('2',720,230,44))
   +fade(seg(p,.2,.4),label('半分',1010,175,{size:28,color:Q2,anchor:'middle'})+T(cs(Q2,'1'),1010,230,44))
   +fade(seg(p,.5,.7),T(`${cs(Q2,'1')}\\times0.1^2=${cs(DF,'0.01')}`,870,320,44))
   +fade(seg(p,.7,.85),label('＝ 正方形の 角',870,400,{size:30,color:DF,anchor:'middle',weight:700})),1);
  return s;
 },

 // ===== S3 cos で確かめる =====
 [K+'cosd1']:(p)=>cosTable(p,0),
 [K+'cosd2']:(p)=>cosTable(p,1),
 [K+'cosf']:(p)=>{
  const {A,svg}=gcos({tan:.35,par:seg(p,.1,.4)});
  let s=svg+cosLab(A);
  s+=fade(seg(p,.1,.4),label('y ＝ 1 − x²/2',A.X(-1.25),A.Y(1.3),{size:24,color:Q2,weight:700,anchor:'middle'}));
  s+=card(660,90,480,300,T(`\\cos x\\approx${cs(CU,'1')}${cs(Q2,'-\\dfrac{x^2}{2}')}`,900,175,46)
   +fade(seg(p,.45,.65),label('頂上で 下に曲がる 放物線',900,285,{size:28,color:Q2,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.85),label('cos の山に 沿う',900,340,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.15),Q2);
  return s;
 },
 [K+'predict']:(p)=>{
  const {A,svg}=gcos({tan:.35,par:1,mark:seg(p,.1,.3)});
  let s=svg+cosLab(A)+label('y ＝ 1 − x²/2',A.X(-1.25),A.Y(1.3),{size:24,color:Q2,weight:700,anchor:'middle'});
  s+=card(660,90,480,300,T(`\\cos x\\approx${cs(CU,'1')}${cs(Q2,'-\\dfrac{x^2}{2}')}`,900,175,46)
   +fade(seg(p,.1,.3),label('x ＝ 0.1 では？',900,285,{size:34,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.4,.6),label('予想してみよう',900,345,{size:26,color:C.hi,anchor:'middle'})),1,C.hi);
  return s;
 },
 [K+'coscalc']:(p)=>{
  const {A,svg}=gcos({tan:.35,par:1,mark:1});
  let s=svg+cosLab(A)+label('y ＝ 1 − x²/2',A.X(-1.25),A.Y(1.3),{size:24,color:Q2,weight:700,anchor:'middle'});
  s+=card(660,60,480,380,T(`\\cos x\\approx${cs(CU,'1')}${cs(Q2,'-\\dfrac{x^2}{2}')}`,900,140,42)
   +fade(seg(p,.05,.25),T('0.1^2=0.01',900,235,38))
   +fade(seg(p,.25,.45),T(`0.01\\div2=${cs(Q2,'0.005')}`,900,300,38))
   +fade(seg(p,.55,.75),T(`1-${cs(Q2,'0.005')}=${cs(C.hi,'0.995')}`,900,375,42)),1);
  return s;
 },
 [K+'coserr']:(p)=>{
  const cols=[{x:260,text:1,head:''},{x:600,head:'x ＝ 0.1 での値'},{x:920,head:'本当との差',hcolor:DF}];
  const rows=[{y:165,cells:['本当','0.995004',null],colors:[CU,CU]},{y:245,cells:['1次（接線）','1','0.005'],colors:[TA,TA,DF]},{y:325,cells:['2次','0.995','0.000004'],colors:[Q2,Q2,DF]}];
  let s=table({cols,rows,gc:(r,c)=>r<2?1:c<2?seg(p,.05,.25):seg(p,.15,.35),top:70,bottom:370});
  s+=fade(seg(p,.55,.75),label('差は 約 1000分の1 に',600,440,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S4 3次の項と sin =====
 [K+'c3']:(p)=>{
  let s=label('同じ手順を もう1回：3次の項',600,60,{size:28,color:Q3,anchor:'middle',weight:700});
  const R=[[cs(Q3,'c_3')+'x^3',''],['3'+cs(Q3,'c_3')+'x^2','1回'],['3\\times2\\,'+cs(Q3,'c_3')+'x','2回'],['3\\times2\\times1\\,'+cs(Q3,'c_3')+'='+cs(Q3,'6c_3'),'3回']];
  R.forEach((r,i)=>{const g=i===0?seg(p,0,.15):seg(p,.12+i*.18,.27+i*.18);
   s+=fade(g,T(r[0],560,140+i*95,44,{anchor:'start'})+(i?label('→',470,140+i*95+12,{size:34,color:C.dim,anchor:'middle'})+label(r[1]+'微分',380,140+i*95+10,{size:26,color:C.dim,anchor:'end'}):''));});
  return s;
 },
 [K+'c3b']:(p)=>{
  const cols=[{x:210,text:1,head:''},{x:420,head:'値',hcolor:CU},{x:600,head:'1回',hcolor:TA},{x:780,head:'2回',hcolor:Q2},{x:960,head:'3回',hcolor:Q3}];
  const rows=[{y:175,cells:['割る数','1','1','2','6'],colors:[C.ink,CU,TA,Q2,Q3]},{y:260,cells:[null,null,null,'2\\times1','3\\times2\\times1'],colors:[0,0,0,C.dim,C.dim]}];
  let s=table({cols,rows,gc:(r,c)=>r===0?(c===0?1:seg(p,.45+c*.08,.55+c*.08)):seg(p,.8,.95),top:70,bottom:310});
  s+=fade(seg(p,.05,.3),label('係数 ＝（x ＝ 0 での 微分の値）÷（割る数）',600,395,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sinrow']:(p)=>{
  const cx=380,cy=260,r=165,N=[['\\sin x',-90,CU],['\\cos x',0,TA],['-\\sin x',90,Q2],['-\\cos x',180,Q3]];
  let s='';
  N.forEach((n,i)=>{const a=n[1]*Math.PI/180,g=seg(p,.05+i*.15,.2+i*.15);s+=fade(g,T(cs(n[2],n[0]),cx+r*Math.cos(a),cy+r*Math.sin(a)+4,40));});
  N.forEach((n,i)=>{const a1=(n[1]+26)*Math.PI/180,a2=(n[1]+64)*Math.PI/180,g=seg(p,.12+i*.15,.27+i*.15);
   const x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2);
   s+=fade(g,arrow(x1,y1,x2,y2,{color:C.dim,w:3,head:14}));});
  s+=fade(seg(p,.15,.3),label('微分',cx,cy+10,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(700,110,440,260,label('初級で見た 傾き',920,165,{size:26,color:C.dim,anchor:'middle'})
   +label('sin の傾きは cos',920,235,{size:30,color:C.ink,anchor:'middle'})+label('cos の傾きは −sin',920,300,{size:30,color:C.ink,anchor:'middle'}),seg(p,.6,.8));
  return s;
 },
 [K+'sinvals']:(p)=>sinTable(p,0),
 [K+'sincoef']:(p)=>{
  let s=sinTable(p,1);
  s+=fade(seg(p,.6,.8),T(`\\sin x\\approx${cs(TA,'x')}${cs(Q3,'-\\dfrac{x^3}{6}')}`,600,440,46));
  return s;
 },
 [K+'origin']:(p)=>{
  const {A,svg}=gsin({lin:1,cub:seg(p,.3,.6),xmax:1.8,sym:'θ',ymax:1.8,ymin:-.2,w:470});
  let s=svg+label('y ＝ θ',A.X(1.1)-14,A.Y(1.1)-8,{size:24,color:TA,weight:700,anchor:'end'})+label('y ＝ sinθ',A.X(1.62),A.Y(Math.sin(1.62))-22,{size:24,color:CU,weight:700,anchor:'middle'});
  s+=fade(seg(p,.3,.6),label('θ − θ³/6',A.X(1.5),A.Y(1.5-1.5**3/6)+44,{size:24,color:Q3,weight:700,anchor:'middle'}));
  s+=card(660,80,480,340,label('初級の sinθ ≈ θ',900,135,{size:28,color:C.ink,anchor:'middle',weight:700})
   +T(`\\sin\\theta\\approx${cs(TA,'\\theta')}${cs(DF,'-\\dfrac{\\theta^3}{6}')}`,900,225,44)
   +fade(seg(p,.5,.7),label('↑ 捨てていた項',990,320,{size:28,color:DF,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('＝ 差 θ³/6 の正体',900,375,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'nox2']:(p)=>{
  const P=[`\\sin x\\approx`,`${cs(CU,'0')}+`,`${cs(TA,'x')}+`,`${cs(Q2,'0\\cdot x^2')}`,`${cs(Q3,'-\\dfrac{x^3}{6}')}`];
  const ws=P.map(q=>texWidth(q,52,false)),W=ws.reduce((a,b)=>a+b,0),x0=600-W/2,xq=x0+ws[0]+ws[1]+ws[2];
  let s=T(P.join(''),600,130,52);
  s+=fade(seg(p,.15,.35),label('2次の項は 0',xq+ws[3]/2,215,{size:28,color:Q2,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),card(170,270,860,180,label('sinθ ≈ θ の差は',600,320,{size:28,color:C.ink,anchor:'middle'})
   +label('θ² ではなく θ³ から始まる',600,375,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.7,.85),label('θ ＝ 0.1 で 0.000167 と とても小さい',600,425,{size:26,color:C.dim,anchor:'middle'})),1,C.hi));
  return s;
 },
 [K+'sincheck']:(p)=>{
  let s=card(120,70,960,340,label('x ＝ 0.1 で確かめる',600,120,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('近似',300,210,{size:28,color:Q3,anchor:'middle'})+fade(seg(p,.1,.3),T(`0.1-\\dfrac{0.001}{6}=${cs(Q3,'0.0998333')}`,680,205,42))
   +fade(seg(p,.55,.75),label('電卓',300,320,{size:28,color:CU,anchor:'middle'})+T(`\\sin0.1=${cs(CU,'0.0998334')}`,680,315,42)+ok(1000,325,seg(p,.75,.9))),1);
  return s;
 },

 // ===== S5 どこで使えなくなる？ =====
 [K+'next5']:(p)=>{
  let s=T(`\\sin x\\approx x-\\dfrac{x^3}{6}${cs(DF,'+\\dfrac{x^5}{120}')}-\\cdots`,600,110,48);
  s+=fade(seg(p,.05,.25),label('4回微分',380,245,{size:28,color:C.dim,anchor:'end'})+T('\\sin0=0',520,240,38,{anchor:'start'}));
  s+=fade(seg(p,.2,.4),label('5回微分',380,315,{size:28,color:C.dim,anchor:'end'})+T('\\cos0=1',520,310,38,{anchor:'start'}));
  s+=fade(seg(p,.55,.8),T(`${cs(DF,'120')}=1\\times2\\times3\\times4\\times5`,600,420,40));
  return s;
 },
 [K+'est']:(p)=>{
  const a=`\\sin x\\approx x-\\dfrac{x^3}{6}`,b=cs(DF,'+\\dfrac{x^5}{120}'),wa=texWidth(a,52,false),wb=texWidth(b,52,false),x0=600-(wa+wb)/2;
  let s=T(a+b,600,150,52);
  const xa=x0+texWidth('\\sin x\\approx',52,false);
  s+=fade(seg(p,.05,.25),brace(xa,x0+wa,215,{dir:1,color:Q3})+label('ここで 止める',(xa+x0+wa)/2,265,{size:24,color:Q3,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.45),brace(x0+wa+8,x0+wa+wb,215,{dir:1,color:DF})+label('捨てた 最初の項',x0+wa+wb/2+30,300,{size:24,color:DF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),card(260,320,680,120,label('この大きさで 差を 見積もる',600,390,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'e01']:(p)=>errTable(p,1)+fade(seg(p,.7,.9),label('見積もりどおり',600,450,{size:30,color:C.hi,anchor:'middle',weight:700})),
 [K+'e05']:(p)=>errTable(p,2)+fade(seg(p,.7,.9),label('x ＝ 0.5 でも 見積もりどおり',600,450,{size:30,color:C.hi,anchor:'middle',weight:700})),
 [K+'e2']:(p)=>{
  const {A,svg}=gsin({lin:0,cub:1});
  let s=svg+label('y ＝ sin x',A.X(2.3)+14,A.Y(1.05),{size:24,color:CU,weight:700})+label('y ＝ x − x³/6',A.X(.9),A.Y(-.75),{size:24,color:Q3,weight:700});
  const g=seg(p,.2,.45);
  s+=fade(g,line(A.X(2),A.Y(0)-8,A.X(2),A.Y(0)+8,{color:C.ink,w:3})+line(A.X(2),A.Y(Math.sin(2)),A.X(2),A.Y(2-8/6),{color:DF,w:5})+dot(A.X(2),A.Y(Math.sin(2)),8,CU)+dot(A.X(2),A.Y(2-8/6),8,Q3));
  s+=card(660,80,480,340,label('x ＝ 2 では？',900,135,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.2,.4),label('近似',760,215,{size:28,color:Q3,anchor:'middle'})+T(`2-\\dfrac{8}{6}\\approx${cs(Q3,'0.67')}`,975,210,38))
   +fade(seg(p,.45,.65),label('本当',760,300,{size:28,color:CU,anchor:'middle'})+T(`\\sin2\\approx${cs(CU,'0.91')}`,975,295,38))
   +fade(seg(p,.7,.85),label('大きく 外れる',900,375,{size:30,color:DF,anchor:'middle',weight:700})+ng(1040,380)),seg(p,0,.15));
  return s;
 },
 [K+'e2b']:(p)=>{
  const {A,svg}=gsin({lin:0,cub:1});
  let s=svg+label('y ＝ sin x',A.X(2.3)+14,A.Y(1.05),{size:24,color:CU,weight:700})+label('y ＝ x − x³/6',A.X(.9),A.Y(-.75),{size:24,color:Q3,weight:700});
  s+=line(A.X(2),A.Y(Math.sin(2)),A.X(2),A.Y(2-8/6),{color:DF,w:5})+dot(A.X(2),A.Y(Math.sin(2)),8,CU)+dot(A.X(2),A.Y(2-8/6),8,Q3);
  s+=card(660,80,480,340,label('捨てた項',900,135,{size:28,color:DF,anchor:'middle',weight:700})
   +fade(seg(p,.05,.25),T(`\\dfrac{2^5}{120}\\approx${cs(DF,'0.27')}`,900,215,44))
   +fade(seg(p,.3,.5),label('小さくない',900,300,{size:30,color:DF,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.8),label('→ 使えないと 先に分かる',900,365,{size:28,color:C.hi,anchor:'middle',weight:700})),1,DF);
  return s;
 },
 [K+'caution']:(p)=>{
  const {A,svg}=gsin({lin:0,cub:1});
  let s=fade(seg(p,.45,.65),rect(A.X(0),A.Y(2),A.X(.8)-A.X(0),A.Y(-1.3)-A.Y(2),{fill:C.F,fo:.1,stroke:C.F,sw:0,rx:0}))+svg;
  s+=label('y ＝ sin x',A.X(2.3)+14,A.Y(1.05),{size:24,color:CU,weight:700})+label('y ＝ x − x³/6',A.X(.9),A.Y(-.75),{size:24,color:Q3,weight:700});
  s+=fade(seg(p,.45,.65),label('捨てた項が',A.X(.4),A.Y(1.75),{size:22,color:C.F,anchor:'middle',weight:700})+label('小さい所',A.X(.4),A.Y(1.75)+28,{size:22,color:C.F,anchor:'middle',weight:700}));
  s+=card(660,80,480,340,label('項を増やせば どこでも 良くなる？',900,140,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.15,.35),label('→ とは 限らない',900,195,{size:30,color:DF,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.7),label('使う前に 確かめる',900,275,{size:28,color:C.hi,anchor:'middle',weight:700})+label('捨てた項 ＜ 必要な正確さ',900,335,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  const {svg}=taylorRow(6,600,200,38);
  let s=card(60,60,1080,220,label('テイラー展開',600,110,{size:30,color:C.hi,anchor:'middle',weight:700})+svg,seg(p,0,.2),C.hi);
  s+=fade(seg(p,.35,.55),label('割る数',330,360,{size:28,color:C.dim,anchor:'middle'})+T(`${cs(CU,'1')},\\;${cs(TA,'1')},\\;${cs(Q2,'2')},\\;${cs(Q3,'6')},\\;\\ldots`,600,355,42));
  return s;
 },
 [K+'sum2']:(p)=>{
  const {svg,centres}=taylorRow(6,600,200,38);
  let s=card(60,60,1080,220,label('テイラー展開',600,110,{size:30,color:C.hi,anchor:'middle',weight:700})+svg,1,C.hi);
  s+=fade(seg(p,.05,.25),label('値',centres[1],320,{size:26,color:CU,anchor:'middle',weight:700})+label('傾き',centres[2]+10,320,{size:26,color:TA,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.4),label('曲がり',centres[3]+10,320,{size:26,color:Q2,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),card(250,365,700,90,label('捨てた最初の項 → 差の見積もり',600,420,{size:30,color:DF,anchor:'middle',weight:700}),1,DF));
  return s;
 },
 [K+'pend']:(p)=>{
  const px=300,py=70,L=330,th=.38,bx=px+L*Math.sin(th),by=py+L*Math.cos(th);
  let s=line(px-80,py,px+80,py,{color:C.dim,w:4})+line(px,py,px,py+L+20,{color:C.faint,w:2,dash:'8 7'});
  s+=line(px,py,bx,by,{color:C.ink,w:3})+dot(bx,by,20,C.x);
  const arc=Array.from({length:21},(_,i)=>{const a=th*i/20;return [px+120*Math.sin(a),py+120*Math.cos(a)];});
  s+=draw(arc,1,{color:C.E,w:3})+label('θ',px+48*Math.sin(th/2)+4,py+150,{size:30,color:C.E,weight:700});
  s+=card(620,80,520,340,label('振り子で',880,135,{size:26,color:C.dim,anchor:'middle'})+T(`\\sin\\theta\\approx\\theta`,880,200,46)
   +fade(seg(p,.3,.5),label('と置けるのは',880,265,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.4,.65),T(cs(DF,'\\dfrac{\\theta^3}{6}'),730,340,42)+label('＜ 測りたい正確さ',775,352,{size:28,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'next']:(p)=>{
  const ox=240,oy=330;
  let s=fade(seg(p,.35,.55),arrow(ox,oy,ox+190,oy,{color:C.dim,w:3,head:12})+arrow(ox,oy,ox,oy-190,{color:C.dim,w:3,head:12})+arrow(ox,oy,ox+120,oy-90,{color:C.dim,w:3,head:12})
   +label('x',ox+200,oy+8,{size:24,color:C.dim})+label('z',ox-8,oy-200,{size:24,color:C.dim})+label('y',ox+132,oy-98,{size:24,color:C.dim})
   +arrow(ox,oy,ox+70,oy-150,{color:C.F,w:6,head:18}));
  s+=card(480,80,680,340,label('次の問い',820,130,{size:26,color:C.dim,anchor:'middle'})
   +label('ここまでは 1本の数直線の上の関数',820,195,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.55),label('力や速度のような',820,270,{size:30,color:C.ink,anchor:'middle'})+label('3次元の矢印の式は',820,320,{size:30,color:C.ink,anchor:'middle'})
    +label('何を 主張している？',820,380,{size:36,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
};
