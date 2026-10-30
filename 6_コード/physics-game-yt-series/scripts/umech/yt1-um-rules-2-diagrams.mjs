// YouTube シリーズ 微分の法則・上級 2/2（ステージ um-rules 本10：全微分の連鎖律）— 図。Stage 1200×515.
// 色：x（東西）水色、y（南北）緑、高さ h 黄、鍵 橙、時間 t 金、速度 紫、傾きの矢印 桃、誤り 赤。山 h = x²y（中級 2/2 と同じ）。
// 地図は縦横同じ縮尺（直角が直角に見えるように）。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,poly} from './anim.mjs';

const K='um-rules-2:';
const R=String.raw;
const CX=C.x,CY=C.F,CH=C.hi,CL=C.E,CV=C.v,CG=C.p,CT=C.t;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const L=(s,x,y,o={})=>label(s,x,y,{anchor:'middle',size:28,color:C.ink,...o});
const PX=`{\\color{${CX}}x}`,PY=`{\\color{${CY}}y}`,PH=`{\\color{${CH}}h}`,PT=`{\\color{${CT}}t}`;
const dHx=`\\dfrac{\\partial ${PH}}{\\partial ${PX}}`,dHy=`\\dfrac{\\partial ${PH}}{\\partial ${PY}}`;
const dxdt=`\\dfrac{d${PX}}{d${PT}}`,dydt=`\\dfrac{d${PY}}{d${PT}}`,dhdt=`\\dfrac{d${PH}}{d${PT}}`;
const FULL=`${dhdt}=${dHx}\\,${dxdt}+${dHy}\\,${dydt}`;

// ---- contour map of h = x²y, equal scale ----------------------------------------------------------
const M={x0:80,y0:480,s:128,xmax:3,ymax:3.3};
const MX=x=>M.x0+M.s*x,MY=y=>M.y0-M.s*y;
function contour(c,{color=C.dim,w=2.5,op=.6}={}){
 const pts=[];const xa=Math.sqrt(c/M.ymax);
 for(let i=0;i<=80;i++){const x=mix(xa,M.xmax,i/80);pts.push([MX(x),MY(c/(x*x))]);}
 return `<g opacity="${op}">${draw(pts,1,{color,w})}</g>`;
}
function map({g=1,hl=0,lab=1,pt=1}={}){
 let s=fade(g,rect(M.x0,MY(M.ymax),M.s*M.xmax,M.s*M.ymax,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:4}));
 [1,2,4,8,16].forEach((c,i)=>{const on=c===2&&hl;s+=fade(g,contour(c,{color:on?CH:C.dim,w:on?4:2.5,op:on?1:.4+i*.1}));
  if(lab&&c>=2){s+=fade(g*lab,label(String(c),MX(Math.sqrt(c/M.ymax)),MY(M.ymax)-8,{size:22,color:on?CH:C.dim,anchor:'middle'}));}});
 s+=fade(g,arrow(M.x0,M.y0,MX(M.xmax)+30,M.y0,{color:CX,w:3,head:12})+label('東 x',MX(M.xmax)+2,M.y0+30,{size:24,color:CX}));
 s+=fade(g,arrow(M.x0,M.y0,M.x0,MY(M.ymax)-24,{color:CY,w:3,head:12})+label('北 y',M.x0-10,MY(M.ymax)-12,{size:24,color:CY,anchor:'end'}));
 s+=fade(g,label('1',MX(1),M.y0+28,{size:22,color:CX,anchor:'middle'})+label('2',MX(2),M.y0+28,{size:22,color:CX,anchor:'middle'})
  +label('1',M.x0-12,MY(1)+8,{size:22,color:CY,anchor:'end'})+label('2',M.x0-12,MY(2)+8,{size:22,color:CY,anchor:'end'})+label('3',M.x0-12,MY(3)+8,{size:22,color:CY,anchor:'end'}));
 if(pt)s+=fade(g*pt,dot(MX(1),MY(2),10,CH));
 return s;
}
const vec=(dx,dy,color,g=1,w=5,k=1)=>fade(g,arrow(MX(1),MY(2),MX(1+dx*k),MY(2+dy*k),{color,w,head:16}));
function lock(x,y,color=CL,g=1,s=1){
 return fade(g,`<path d="M ${x-9*s} ${y-6*s} v ${-8*s} a ${9*s} ${9*s} 0 0 1 ${18*s} 0 v ${8*s}" fill="none" stroke="${color}" stroke-width="${3.5*s}"/>`
  +rect(x-14*s,y-7*s,28*s,22*s,{fill:color,fo:.9,stroke:color,sw:1,rx:4*s}));
}
function path(g=1,dir=[1,1],len=.75,color=CH){
 return fade(g,draw([[MX(1),MY(2)],[MX(1+dir[0]*len),MY(2+dir[1]*len)]],1,{color,w:4,dash:'10 7'}));
}

// ---- zoom of one step: A(x,y) → B(x+Δx,y) → C(x+Δx,y+Δy) ------------------------------------------
const Z={ax:180,ay:430,d:270};
function zoom({g=1,diag=1,east=0,north=0,hA=0,hB=0,hC=0,shiftNote=0}={}){
 const A=[Z.ax,Z.ay],B=[Z.ax+Z.d,Z.ay],Cc=[Z.ax+Z.d,Z.ay-Z.d];
 let s=fade(g,rect(Z.ax-60,Z.ay-Z.d-60,Z.d+120,Z.d+110,{fill:'#0f1a30',fo:1,stroke:C.faint,sw:2,rx:6}));
 s+=fade(g,line(A[0],A[1],B[0],B[1],{color:C.faint,w:2,dash:'5 6'})+line(B[0],B[1],Cc[0],Cc[1],{color:C.faint,w:2,dash:'5 6'}));
 s+=fade(g*diag,arrow(A[0],A[1],Cc[0],Cc[1],{color:CH,w:4,head:16}));
 s+=fade(g,dot(A[0],A[1],8,CH)+dot(B[0],B[1],7,C.dim)+dot(Cc[0],Cc[1],7,C.dim));
 s+=fade(g,label('A',A[0]-28,A[1]+8,{size:24,color:C.ink,weight:700})+label('B',B[0]+14,B[1]+26,{size:24,color:C.ink,weight:700})+label('C',Cc[0]+14,Cc[1]-6,{size:24,color:C.ink,weight:700}));
 s+=fade(east,arrow(A[0],A[1],B[0]-4,B[1],{color:CX,w:6,head:18})+label('Δx',(A[0]+B[0])/2,A[1]+34,{size:26,color:CX,anchor:'middle',weight:700}));
 s+=fade(north,arrow(B[0],B[1],Cc[0],Cc[1]+4,{color:CY,w:6,head:18})+label('Δy',B[0]+16,(B[1]+Cc[1])/2+8,{size:26,color:CY,weight:700}));
 s+=fade(hA,label('h ＝ 2',A[0]-14,A[1]-18,{size:22,color:CH,anchor:'end'}));
 s+=fade(hB,label('h ＝ 2.0402',B[0]-6,B[1]-22,{size:22,color:CH,anchor:'end'}));
 s+=fade(hC,label('h ＝ 2.050401',Cc[0]-10,Cc[1]-18,{size:22,color:CH,anchor:'end'}));
 s+=fade(shiftNote,ring(B[0],B[1],18,{color:CL,w:3}));
 return s;
}

export const ytUmRules2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=map({g:seg(p,.05,.3),lab:0});
  s+=vec(1,1,CH,seg(p,.2,.4),5,.55)+fade(seg(p,.2,.4),label('？',MX(1.6),MY(2.65),{size:40,color:CH,weight:700}));
  s+=card(640,110,500,250,L('前回の最後の問い',890,160,{size:24,color:C.dim})
   +L('東にも 北にも 同時に進むと',890,230,{size:30,color:CH,weight:700})+L('高さの変化は？',890,290,{size:34,color:CH,weight:700}),seg(p,.1,.25),CH);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=map({});
  s+=vec(1,0,CX,seg(p,.3,.45),5,.6)+fade(seg(p,.3,.45),lock(MX(1.3),MY(2)+30));
  s+=vec(0,1,CY,seg(p,.6,.75),5,.6)+fade(seg(p,.6,.75),lock(MX(1)-34,MY(2.3)));
  s+=tex(`${PH}=${PX}^2${PY}`,890,110,{size:52,auto:false});
  s+=fade(seg(p,.3,.45),L('y に鍵 → 東向きの傾き',890,210,{size:26,color:CX}));
  s+=fade(seg(p,.6,.75),L('x に鍵 → 北向きの傾き',890,290,{size:26,color:CY}));
  s+=fade(seg(p,.8,.9),L('（中級 2/2）',890,360,{size:24,color:C.dim}));
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=map({})+vec(1,0,CX,1,5,.6)+vec(0,1,CY,1,5,.6);
  s+=fade(seg(p,.05,.25),L('x ＝ 1，y ＝ 2',890,90,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.2,.45),tex(`${dHx}=2${PX}${PY}=4`,890,200,{size:46,auto:false}));
  s+=fade(seg(p,.55,.8),tex(`${dHy}=${PX}^2=1`,890,340,{size:46,auto:false}));
  return s;
 },
 [K+'walk']:(p)=>{
  let s=map({hl:0});
  const g=seg(p,.3,.8);
  s+=path(g>0?1:0,[1,1],.9*g);
  [0,.25,.5,.75].forEach((t,i)=>{s+=fade(seg(p,.35+i*.12,.45+i*.12),dot(MX(1+t),MY(2+t),6,CT)+label(`t＝${t}`,MX(1+t)+10,MY(2+t)+22,{size:22,color:CT}));});
  s+=card(650,100,490,300,L('北東へ歩く',895,150,{size:30,color:CH,weight:700})
   +tex(`${PX}=1+${PT},\\quad ${PY}=2+${PT}`,895,230,{size:40,auto:false})
   +fade(seg(p,.7,.85),L('1 秒に 東へ 1，北へ 1',895,320,{size:28})),seg(p,.05,.2));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=map({})+path(1,[1,1],.9);
  s+=card(650,120,490,240,L('歩き始めの 高さの増え方',895,190,{size:30,color:CH,weight:700})
   +L('1 秒あたり いくつ？',895,250,{size:32,color:CH,weight:700})+fade(seg(p,.4,.6),L('予想してみよう',895,315,{size:24,color:CH})),seg(p,.05,.2),CH);
  return s;
 },

 // ===== S2 斜めの一歩を二段に分ける =====
 [K+'step']:(p)=>{
  let s=zoom({g:seg(p,0,.2),diag:seg(p,.1,.3),east:seg(p,.65,.8),north:seg(p,.75,.9)});
  s+=card(600,110,560,250,L('短い時間 Δt の 一歩',880,165,{size:30,color:CH,weight:700})
   +L('x は Δx，y は Δy 増える',880,230,{size:28})+fade(seg(p,.6,.75),L('A → B → C の 二段に分ける',880,300,{size:28,color:CH})),seg(p,.1,.3));
  return s;
 },
 [K+'east']:(p)=>{
  let s=zoom({east:seg(p,.05,.25),hA:0});
    s+=L('一段目：A → B（東へ）',880,120,{size:30,color:CX,weight:700});
  s+=fade(seg(p,.1,.3),lock(800,178)+label('y に鍵（北へは動かない）',822,184,{size:24,color:CL}));
  s+=fade(seg(p,.45,.65),tex(`\\approx ${dHx}\\,\\Delta ${PX}`,880,300,{size:52,auto:false})+L('高さの増え',880,400,{size:26,color:CH}));
  return s;
 },
 [K+'north']:(p)=>{
  let s=zoom({east:1,north:seg(p,.05,.25)});
    s+=tex(`\\approx ${dHx}\\,\\Delta ${PX}`,880,140,{size:40,auto:false})+L('一段目',880,70,{size:24,color:CX});
  s+=fade(seg(p,.05,.25),L('二段目：B → C（北へ）',880,240,{size:26,color:CY,weight:700})+lock(760,290)+label('x に鍵（東へは動かない）',782,296,{size:24,color:CL}));
  s+=fade(seg(p,.45,.65),tex(`\\approx ${dHy}\\,\\Delta ${PY}`,880,380,{size:40,auto:false}));
  return s;
 },
 [K+'exact']:(p)=>{
  let s=zoom({east:1,north:1});
  const HB=`{\\color{${CH}}h(\\mathrm{B})}`;
  s+=tex(R`h(\mathrm{C})-h(\mathrm{A})`,880,90,{size:40,auto:false});
  s+=fade(seg(p,.05,.25),tex(`=\\bigl(${HB}-h(\\mathrm{A})\\bigr)+\\bigl(h(\\mathrm{C})-${HB}\\bigr)`,880,190,{size:36,auto:false}));
  s+=fade(seg(p,.4,.6),L('途中の B を 足して引いただけ',880,290,{size:26,color:CH}));
  s+=fade(seg(p,.6,.8),L('＝ ぴったり成り立つ',880,350,{size:30,color:C.F,weight:700}));
  s+=fade(seg(p,.6,.8),L('≈ は 傾きで見積もる所だけ',880,420,{size:24,color:C.dim}));
  return s;
 },
 [K+'num1']:(p)=>{
  let s=zoom({east:1,north:.25,hA:1,hB:seg(p,.45,.65)});
  s+=L('Δt ＝ 0.01',880,90,{size:28,color:CT,weight:700});
  s+=fade(seg(p,.1,.3),L('Δx ＝ 0.01，Δy ＝ 0.01',880,150,{size:28}));
  s+=fade(seg(p,.45,.65),L('一段目：2 → 2.0402',880,250,{size:30,color:CX,weight:700}));
  s+=fade(seg(p,.7,.85),L('＋0.0402',880,310,{size:34,color:CH,weight:700}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=zoom({east:.3,north:1,hA:1,hB:1,hC:seg(p,.35,.55)});
  s+=L('Δt ＝ 0.01',880,90,{size:28,color:CT,weight:700});
  s+=L('一段目：＋0.0402',880,160,{size:26,color:CX});
  s+=fade(seg(p,.05,.25),L('x ＝ 1.01 のまま 北へ',880,240,{size:26,color:CY}));
  s+=fade(seg(p,.35,.55),L('二段目：2.0402 → 2.050401',880,300,{size:28,color:CY,weight:700}));
  s+=fade(seg(p,.7,.85),L('＋0.010201',880,360,{size:34,color:CH,weight:700}));
  return s;
 },
 [K+'num3']:(p)=>{
  const hx=[250,560,900];
  let s=L('Δt ＝ 0.01',600,50,{size:26,color:CT,weight:700});
  s+=L('本物の増え',hx[1],120,{size:26,color:CH,weight:700})+L('傾き × 進んだ量',hx[2],120,{size:26,color:C.hi,weight:700})+line(110,142,1090,142,{color:C.faint,w:2});
  const rows=[['一段目（東）','0.0402','4 × 0.01 ＝ 0.04',CX],['二段目（北）','0.010201','1 × 0.01 ＝ 0.01',CY],['合計','0.050401','0.05',CH]];
  rows.forEach((r,i)=>{const y=210+i*80,g=i<2?seg(p,.05+i*.3,.25+i*.3):seg(p,.7,.85);
   s+=fade(i<2?1:g,L(r[0],hx[0],y,{size:28,color:r[3],weight:700})+L(r[1],hx[1],y,{size:32}))+fade(g,L(r[2],hx[2],y,{size:32}));});
  s+=fade(seg(p,.75,.9),line(110,322,1090,322,{color:C.faint,w:2})+L('ほとんど 同じ',600,470,{size:30,color:C.F,weight:700}));
  return s;
 },
 [K+'div']:(p)=>{
  let s=tex(`\\Delta ${PH}\\approx ${dHx}\\,\\Delta ${PX}+${dHy}\\,\\Delta ${PY}`,600,100,{size:44,auto:false});
  s+=fade(seg(p,.05,.2),L('両辺を Δt で割る',600,200,{size:26,color:C.dim}));
  const parts=[`\\dfrac{\\Delta ${PH}}{\\Delta ${PT}}\\approx ${dHx}`,`\\dfrac{\\Delta ${PX}}{\\Delta ${PT}}`,`+${dHy}`,`\\dfrac{\\Delta ${PY}}{\\Delta ${PT}}`];
  const W=texWidth(parts.join(''),50,false),L0=600-W/2;let acc='',c=[];
  parts.forEach(q=>{const a=acc?texWidth(acc,50,false):0;acc+=q;c.push(L0+(a+texWidth(acc,50,false))/2);});
  s+=fade(seg(p,.1,.3),tex(parts.join(''),600,310,{size:50,auto:false}));
  s+=fade(seg(p,.4,.55),L('東へ進む速さ',c[1],420,{size:24,color:CX,weight:700}));
  s+=fade(seg(p,.7,.85),L('北へ進む速さ',c[3],420,{size:24,color:CY,weight:700}));
  return s;
 },
 [K+'lim']:(p)=>{
  let s=L('Δt → 0',600,60,{size:28,color:CT,weight:700});
  const W=texWidth(FULL,62,false);
  s+=fade(seg(p,.1,.3),tex(FULL,600,210,{size:62,auto:false}));
  s+=highlight(600-W/2-24,125,W+48,160,seg(p,.6,.75));
  return s;
 },
 [K+'note']:(p)=>{
  let s=zoom({east:1,north:1,shiftNote:seg(p,.1,.3)});
  s+=fade(seg(p,.1,.3),L('二段目の傾きは B で測る',880,110,{size:28,color:CL,weight:700})+L('（A から Δx だけ東）',880,160,{size:24,color:C.dim}));
  s+=card(620,230,520,190,L('なめらかな山',880,285,{size:28,color:CH,weight:700})+L('傾きも なめらかに変わる',880,335,{size:26})+L('→ Δx → 0 で ずれ → 0',880,385,{size:26}),seg(p,.45,.6),CH);
  return s;
 },
 [K+'name']:(p)=>{
  const parts=[`${dhdt}=`,`${dHx}\\,${dxdt}`,`+`,`${dHy}\\,${dydt}`];
  const W=texWidth(parts.join(''),58,false),L0=600-W/2;let acc='',c=[];
  parts.forEach(q=>{const a=acc?texWidth(acc,58,false):0;acc+=q;c.push(L0+(a+texWidth(acc,58,false))/2);});
  let s=tex(parts.join(''),600,150,{size:58,auto:false});
  s+=fade(seg(p,.35,.55),L('東向きの傾き × 東への速さ',c[1],290,{size:24,color:CX,weight:700})+L('北向きの傾き × 北への速さ',c[3],340,{size:24,color:CY,weight:700}));
  s+=card(300,390,600,90,L('二変数の 連鎖律：足し合わせる',600,447,{size:30,color:CH,weight:700}),seg(p,.1,.25),CH);
  return s;
 },

 // ===== S3 数値で確かめる =====
 [K+'calc']:(p)=>{
  let s=tex(FULL,600,100,{size:46,auto:false});
  s+=fade(seg(p,.05,.3),L('t ＝ 0（x ＝ 1，y ＝ 2）',600,210,{size:26,color:CT}));
  s+=fade(seg(p,.2,.6),tex(`=\\;{\\color{${CX}}4\\times1}\\;+\\;{\\color{${CY}}1\\times1}`,600,300,{size:56,auto:false}));
  s+=fade(seg(p,.75,.9),tex('=5',600,410,{size:66,auto:false})+highlight(530,355,140,90,1));
  return s;
 },
 [K+'numchk']:(p)=>{
  const hx=[380,820];
  let s=tex(`\\dfrac{\\Delta ${PH}}{\\Delta ${PT}}`,600,80,{size:44,auto:false});
  s+=L('Δt',hx[0],190,{size:28,color:CT,weight:700})+L('差の比',hx[1],190,{size:28,color:CH,weight:700})+line(220,212,980,212,{color:C.faint,w:2});
  const rows=[['0.01','0.050401 ÷ 0.01 ＝ 5.0401'],['0.001','5.004001'],['→ 0','→ 5']],gs=[seg(p,.05,.25),seg(p,.5,.65),seg(p,.65,.8)];
  rows.forEach((r,i)=>{const y=270+i*70;s+=fade(gs[i],L(r[0],hx[0],y,{size:32,color:CT})+L(r[1],hx[1],y,{size:30,color:i===2?CH:C.ink,weight:i===2?700:400}));});
  s+=fade(seg(p,.8,.92),highlight(230,368,740,58,1));
  return s;
 },
 [K+'direct']:(p)=>{
  let s=L('道の式を 直接代入',600,50,{size:26,color:C.dim});
  s+=tex(`${PH}(${PT})=(1+${PT})^2(2+${PT})`,600,130,{size:46,auto:false});
  s+=fade(seg(p,.35,.55),tex(`=(1+2${PT}+${PT}^2)(2+${PT})`,600,240,{size:46,auto:false}));
  s+=fade(seg(p,.6,.8),tex(`=2+5${PT}+4${PT}^2+${PT}^3`,600,350,{size:52,auto:false}));
  return s;
 },
 [K+'direct2']:(p)=>{
  let s=tex(`${PH}=2+5${PT}+4${PT}^2+${PT}^3`,600,90,{size:44,auto:false});
  s+=fade(seg(p,.05,.3),tex(`${dhdt}=5+8${PT}+3${PT}^2`,600,220,{size:52,auto:false}));
  s+=fade(seg(p,.5,.7),L('t ＝ 0 で 5',600,350,{size:36,color:C.F,weight:700})+ok(720,354));
  s+=fade(seg(p,.7,.85),L('連鎖律の 4 × 1 ＋ 1 × 1 ＝ 5 と一致',600,430,{size:26,color:C.dim}));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=map({})+vec(1,0,CX,1,5,.6)+path(1,[1,1],.8);
  s+=fade(seg(p,.05,.2),label('∂h/∂x ＝ 4',MX(1.65),MY(2)+10,{size:22,color:CX}));
  s+=card(640,90,510,150,ng(670,150)+L('東向きの傾き 4 だけ',905,150,{size:28,color:C.a,weight:700})+L('一方向の傾き（偏微分）',905,205,{size:24,color:C.dim}),seg(p,.05,.25));
  s+=card(640,280,510,150,ok(670,340)+L('道に沿った変化 dh/dt ＝ 5',905,340,{size:28,color:C.F,weight:700})+L('二方向の分を 足す',905,395,{size:24,color:C.dim}),seg(p,.5,.7),C.F);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=map({})+path(seg(p,.2,.4),[2,-1],.45,CV)+vec(2,-1,CV,seg(p,.2,.4),5,.3);
  s+=card(640,100,510,300,L('確かめ',895,150,{size:24,color:C.dim})
   +tex(`${PX}=1+2${PT},\\quad ${PY}=2-${PT}`,895,225,{size:40,auto:false})
   +L('東へ速く，南へ ゆっくり',895,290,{size:26})+L('dh/dt は？',895,355,{size:34,color:CH,weight:700}),seg(p,.05,.2),CH);
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=tex(FULL,600,90,{size:40,auto:false});
  s+=fade(seg(p,.05,.3),tex(`=\\;{\\color{${CX}}4\\times2}\\;+\\;{\\color{${CY}}1\\times(-1)}\\;=\\;7`,600,230,{size:54,auto:false}));
  s+=fade(seg(p,.5,.7),L('南へ進む → y が増える速さ dy/dt ＝ −1',600,360,{size:28,color:CY,weight:700}));
  return s;
 },
 [K+'quiz3']:(p)=>{
  let s=tex(`${PH}=(1+2${PT})^2(2-${PT})`,600,80,{size:44,auto:false});
  s+=fade(seg(p,.05,.25),tex(`=(1+4${PT}+4${PT}^2)(2-${PT})`,600,180,{size:44,auto:false}));
  s+=fade(seg(p,.3,.5),tex(`=2+7${PT}+4${PT}^2-4${PT}^3`,600,280,{size:48,auto:false}));
  s+=fade(seg(p,.6,.8),L('t ＝ 0 の傾き 7',600,390,{size:36,color:C.F,weight:700})+ok(760,394));
  return s;
 },

 // ===== S4 傾きの矢印と等高線 =====
 [K+'dot']:(p)=>{
  let s=map({hl:0});
  s+=vec(4,1,CG,seg(p,.3,.5),5,.14)+fade(seg(p,.3,.5),label('(4, 1)',MX(1.6),MY(2.1),{size:24,color:CG,weight:700}));
  s+=vec(1,1,CV,seg(p,.55,.7),5,.5)+fade(seg(p,.55,.7),label('(1, 1)',MX(1.1),MY(2.62),{size:24,color:CV,weight:700}));
  s+=L('中級の内積：成分ごとの積の和',895,90,{size:24,color:C.dim});
  s+=fade(seg(p,.3,.5),L('傾きの矢印',795,170,{size:26,color:CG,weight:700}));
  s+=fade(seg(p,.55,.7),L('速度',1010,170,{size:26,color:CV,weight:700}));
  s+=fade(seg(p,.3,.7),tex(`{\\color{${CG}}(4,\\,1)}\\cdot{\\color{${CV}}(1,\\,1)}`,895,250,{size:44,auto:false}));
  s+=fade(seg(p,.75,.9),tex(R`=4\times1+1\times1=5`,895,350,{size:44,auto:false}));
  return s;
 },
 [K+'dot2']:(p)=>{
  let s=map({hl:0})+vec(4,1,CG,1,5,.14)+vec(2,-1,CV,seg(p,.05,.25),5,.3)+fade(seg(p,.05,.25),label('(2, −1)',MX(1.62),MY(1.62),{size:24,color:CV,weight:700}));
  s+=tex(`{\\color{${CG}}(4,\\,1)}\\cdot{\\color{${CV}}(2,\\,-1)}`,895,180,{size:44,auto:false});
  s+=fade(seg(p,.4,.6),tex(R`=8-1=7`,895,290,{size:48,auto:false})+ok(1060,300));
  return s;
 },
 [K+'cpred']:(p)=>{
  let s=map({hl:0})+vec(4,1,CG,1,5,.14)+vec(1,-4,CV,seg(p,.05,.25),5,.15)+fade(seg(p,.05,.25),label('(1, −4)',MX(1.18),MY(1.35),{size:24,color:CV,weight:700}));
  s+=card(640,120,510,230,L('速度 (1, −4) なら',895,185,{size:30,color:CV,weight:700})+L('高さの増え方は？',895,250,{size:32,color:CH,weight:700})+fade(seg(p,.4,.6),L('予想してみよう',895,310,{size:24,color:CH})),seg(p,.1,.25),CH);
  return s;
 },
 [K+'contour']:(p)=>{
  let s=map({hl:seg(p,.45,.6)>.5?1:0})+vec(4,1,CG,1,5,.14)+vec(1,-4,CV,1,5,.15);
  s+=tex(`{\\color{${CG}}(4,\\,1)}\\cdot{\\color{${CV}}(1,\\,-4)}`,895,120,{size:40,auto:false});
  s+=fade(seg(p,.05,.3),tex(R`=4\times1+1\times(-4)=0`,895,220,{size:40,auto:false}));
  s+=fade(seg(p,.45,.6),L('高さが 変わらない向き',895,320,{size:28,color:CH,weight:700})+L('＝ 高さ 2 の 等高線に沿う',895,375,{size:28,color:CH}));
  return s;
 },
 [K+'perp']:(p)=>{
  let s=map({hl:1})+vec(4,1,CG,1,5,.14)+vec(1,-4,CV,1,5,.15);
  // right-angle mark at P between (4,1) and (1,-4) directions (equal scale map)
  const u=[4,1].map(v=>v/Math.hypot(4,1)),w=[1,-4].map(v=>v/Math.hypot(1,-4)),k=20,P=[MX(1),MY(2)];
  const q1=[P[0]+u[0]*k,P[1]-u[1]*k],q2=[q1[0]+w[0]*k,q1[1]-w[1]*k],q3=[P[0]+w[0]*k,P[1]-w[1]*k];
  s+=fade(seg(p,.1,.3),draw([q1,q2,q3],1,{color:C.ink,w:2.5}));
  s+=card(640,140,510,200,L('内積 ＝ 0',895,200,{size:30,color:CH,weight:700})+L('傾きの矢印 ⊥ 等高線',895,265,{size:30,color:CG,weight:700}),seg(p,.3,.5),CH);
  return s;
 },
 [K+'total']:(p)=>{
  let s=L('小さな一歩の式',600,40,{size:26,color:C.dim});
  s+=tex(`d${PH}=${dHx}\\,d${PX}+${dHy}\\,d${PY}`,600,160,{size:58,auto:false});
  s+=card(420,230,360,80,L('全微分',600,282,{size:36,color:CH,weight:700}),seg(p,.3,.45),CH);
  return s;
 },
 [K+'total2']:(p)=>{
  let s=ytUmRules2Diagrams[K+'total'](1);
  s+=fade(seg(p,.05,.25),L('電位の単元で 再会',600,380,{size:26,color:C.dim}));
  s+=fade(seg(p,.2,.45),tex(`dV=-{\\color{${CX}}\\mathbf{E}}\\cdot d\\mathbf{r}`,600,450,{size:46,auto:false}));
  return s;
 },

 // ===== S5 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=zoom({east:1,north:1});
  s+=tex(`\\Delta ${PH}\\approx {\\color{${CX}}${dHx}\\,\\Delta x}+{\\color{${CY}}${dHy}\\,\\Delta y}`,880,200,{size:38,auto:false});
  s+=fade(seg(p,.4,.6),L('傾き × 進んだ量 を 足す',880,320,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=tex(FULL,600,110,{size:52,auto:false});
  s+=fade(seg(p,.4,.6),tex(`=\\left({\\color{${CG}}\\tfrac{\\partial h}{\\partial x},\\,\\tfrac{\\partial h}{\\partial y}}\\right)\\cdot\\left({\\color{${CV}}\\tfrac{dx}{dt},\\,\\tfrac{dy}{dt}}\\right)`,600,270,{size:52,auto:false}));
  s+=fade(seg(p,.6,.75),L('傾きの矢印',470,380,{size:26,color:CG,weight:700})+L('速度',800,380,{size:26,color:CV,weight:700}));
  return s;
 },
 [K+'gap']:(p)=>{
  let s=tex(`${PH}(0.01)-${PH}(0)=5(0.01)+4(0.01)^2+(0.01)^3`,600,90,{size:40,auto:false});
  s+=fade(seg(p,.1,.3),L('÷ 0.01',600,170,{size:26,color:C.dim}));
  s+=fade(seg(p,.15,.35),tex(R`5+0.04+0.0001=5.0401`,600,250,{size:48,auto:false}));
  s+=fade(seg(p,.55,.75),brace(600-texWidth(R`5+0.04+0.0001=5.0401`,48,false)/2+42,600-texWidth(R`5+0.04+0.0001=5.0401`,48,false)/2+300,290,{color:C.a,text:'4t² ＋ t³ から来る ずれ 0.0401',size:26}));
  return s;
 },
 [K+'next']:(p)=>{
  const A=axes({x:90,y:470,w:520,h:380,xmin:-1,xmax:1,ymin:-1,ymax:6,xlabel:'t',ylabel:'h',xticks:[-1,1],yticks:[2,4],xcolor:CT,ycolor:CH});
  let s=A.svg+A.plot(t=>2+5*t+4*t*t+t*t*t,{from:-1,to:.78,color:CH,w:4});
  s+=fade(seg(p,.05,.25),A.plot(t=>2+5*t,{from:-.6,to:.78,color:CX,w:3,dash:'10 7'})+label('1 次：2 ＋ 5t',A.X(.3),A.Y(2.1),{size:24,color:CX}));
  s+=card(660,110,500,270,L('1 回の傾き → 1 次の変化',910,170,{size:28})
   +L('何回も微分して',910,240,{size:28,color:CH,weight:700})+L('多項式で置き換える係数は？',910,295,{size:30,color:CH,weight:700}),seg(p,.4,.6),CH);
  return s;
 },
};
