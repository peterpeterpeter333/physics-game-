// 高校編「仕事とエネルギー・深く学ぶ 1/3」(ys-hs-m-energy-1) — 図。Stage 1200×515.
// 色：仕事 W・エネルギー 橙（K 濃い橙、U 薄い橙）、力 F 緑（太い矢印）、変位 x 水色、速度 v 紫、加速度 a 赤、t 金、強調 黄。
// 2/3・3/3・要点でも使う部品は export する（力の矢印・台車・表は 06 の部品と同じ形をここに写した）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,ground,block,cart,wall,axes} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
export {card,ball};

const K='hs-m-energy-1:';
export const WC=C.E, KC='#ff9440', UC='#ffd6a0', Fc=C.F;
export const Wt=`{\\color{${WC}}W}`, Kt=`{\\color{${KC}}K}`, Ut=`{\\color{${UC}}U}`;
export const MG=`{\\color{${Fc}}mg}`, Gt='{\\color{#ff8f9b}g}', Ht='{\\color{#6adfff}h}';
export const T2=(src,x,y,o={})=>tex(src,x,y,{size:46,...o});
// ---- force arrow (green, thick) / velocity arrow (purple) -------------------------------------
export function FA(x,y,X,Y,{text='',g=1,size=28,dx=0,dy=-16,anchor='middle',color=C.F,w=9,head=24}={}){
 let s=arrow(x,y,X,Y,{color,w,head,g});
 if(text&&g>.05)s+=fade(Math.min(1,g*1.4),label(text,(x+X)/2+dx,(y+Y)/2+dy,{size,color,anchor,weight:700}));
 return s;
}
export const VA=(x,y,X,Y,o={})=>arrow(x,y,X,Y,{color:C.v,w:5,head:16,...o});
export const box=(x,gy,{w=120,h=90,color='#c9a46a',text='',size=26,fo=.55}={})=>block(x,gy,w,h,{color,text,size,fo});
export const cartF=(x,gy,o={})=>cart(x,gy,{w:150,h:62,color:C.x,...o});
export function handR(x,y,{o=1}={}){ // a fist pushing to the right, knuckles at (x,y)
 return fade(o,rect(x-120,y-14,80,28,{fill:'#e9c7a6',fo:.9,stroke:'none',rx:10})+rect(x-48,y-26,48,52,{fill:'#e9c7a6',fo:1,stroke:'none',rx:14}));
}
export function handUp(x,y,{o=1}={}){ // a palm holding something from below, top at (x,y)
 return fade(o,rect(x-34,y,68,40,{fill:'#e9c7a6',fo:1,stroke:'none',rx:14})+rect(x-14,y+36,28,80,{fill:'#e9c7a6',fo:.9,stroke:'none',rx:10}));
}
// a table inside a card: cols=[{h,color,w}], rows=[[...]] ; reveal = per-row opacity
export function table({x,y,cols,rows,reveal=null,hl=[],rh=56,g=1,size=30,colColor=null}={}){
 const W=cols.reduce((a,c)=>a+c.w,0);
 let s=card(x-12,y-10,W+24,rh*(rows.length+1)+16,'',g);
 let cx=x;cols.forEach(c=>{s+=fade(g,label(c.h,cx+c.w/2,y+rh*.62,{size:24,color:c.color,anchor:'middle',weight:700}));cx+=c.w;});
 s+=fade(g,line(x,y+rh,x+W,y+rh,{color:C.faint,w:2}));
 rows.forEach((r,i)=>{const yy=y+rh*(i+1),o=g*(reveal?reveal[i]:1);
  if(hl.includes(i))s+=fade(o,rect(x,yy+4,W,rh-8,{fill:C.hi,fo:.12,stroke:C.hi,sw:1.5,rx:8}));
  let cx=x;r.forEach((v,j)=>{s+=fade(o,label(v,cx+cols[j].w/2,yy+rh*.64,{size,color:cols[j].color,anchor:'middle',weight:700}));cx+=cols[j].w;});});
 return s;
}
// small rounded tag: 定義 / 法則 / 結果 / 仮定
export function tag(s,x,y,{color=C.hi,g=1,size=24}={}){
 const w=[...s].length*size+30;
 return fade(g,rect(x-w/2,y-size*.85-8,w,size+18,{fill:color,fo:.14,stroke:color,sw:2,rx:16})+label(s,x,y+2,{size,color,anchor:'middle',weight:700}));
}
// angle arc from direction a0 to a1 (degrees, counter-clockwise on screen = upward)
export function arc(cx,cy,r,a0,a1,{color=C.hi,w=3}={}){
 const P=a=>[cx+r*Math.cos(a*Math.PI/180),cy-r*Math.sin(a*Math.PI/180)];const [x0,y0]=P(a0),[x1,y1]=P(a1);
 return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 0 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
}
// energy bar standing on a baseline
export function ebar(x,base,val,k,{color=KC,w=90,text='',g=1,size=26,top=''}={}){
 const h=val*k;
 return fade(g,rect(x-w/2,base-h,w,h,{fill:color,fo:.55,stroke:color,sw:2,rx:6})+(top?label(top,x,base-h-12,{size,color,anchor:'middle',weight:700}):'')+(text?label(text,x,base+34,{size:24,color:C.ink,anchor:'middle'}):''));
}
// ---- a push lane: cart pushed from rest over d metres -------------------------------------------
// p: progress of the push (0..1); cart moves x0 → x0+k·d with x ∝ p² (constant acceleration).
export function lane({gy=300,x0=230,k=140,d=1,p=1,F='4.0 N',m='2.0 kg',v='',dl='',g=1,hand=1,vG=1,ground0=60,ground1=1140}={}){
 const x=x0+k*d*p*p;
 let s=fade(g,ground(ground0,ground1,gy));
 s+=fade(g,line(x0,gy+28,x0+k*d,gy+28,{color:C.x,w:3})+line(x0,gy+18,x0,gy+38,{color:C.x,w:3})+line(x0+k*d,gy+18,x0+k*d,gy+38,{color:C.x,w:3}));
 if(dl)s+=fade(g,label(dl,x0+k*d/2,gy+66,{size:26,color:C.x,anchor:'middle',weight:700}));
 s+=fade(g,cartF(x,gy,{text:m,size:24}));
 if(hand&&p<.999)s+=fade(g,handR(x-75,gy-46)+FA(x-70,gy-104,x+30,gy-104,{text:F,size:24,dy:-16}));
 if(v&&p>.98)s+=fade(g*vG,VA(x+86,gy-46,x+86+(parseFloat(v)*26),gy-46)+label(v,x+96+(parseFloat(v)*26),gy-38,{size:26,color:C.v,weight:700}));
 return s;
}
// ---- F-x graph ----------------------------------------------------------------------------------
export const fxAxes=(g=1,{x=110,y=440,w=520,h=330,xmax=6.6,ymax=13,xticks=[1,2,3,4,5,6],yticks=[5,10],ylabel='力 F [N]'}={})=>axes({x,y,w,h,xmax,ymax,xlabel:'x [m]',ylabel,xticks,yticks,grid:true,g,xcolor:C.x,ycolor:C.F});
const vtSmall=(g=1,{x=110,y=440,w=480,h=330}={})=>axes({x,y,w,h,xmax:6.6,ymax:13,xlabel:'t [s]',ylabel:'速度 v [m/s]',xticks:[1,2,3,4,5,6],yticks:[5,10],grid:true,g,xcolor:C.t,ycolor:C.v});

// ---- slanted pull on a box -----------------------------------------------------------------------
function slantBox({gy=400,x=420,th=60,L=200,g=1,comp=0,arcG=1,motion=1,lab='F',num=''}={}){
 const r=th*Math.PI/180,ax=x+60,ay=gy-45,ex=ax+L*Math.cos(r),ey=ay-L*Math.sin(r);
 let s=fade(g,ground(120,1140,gy)+box(x,gy,{w:120,h:90}));
 s+=fade(g*motion,arrow(x-60,gy+40,x+160,gy+40,{color:C.x,w:4,head:14})+label('動く 向き',x+180,gy+48,{size:24,color:C.x}));
 s+=fade(g,line(ax,ay,ax+L*.9,ay,{color:C.faint,w:2,dash:'6 6'}));
 s+=FA(ax,ay,ex,ey,{g});
 s+=fade(g,label(lab+(num?' '+num:''),ex+14,ey+4,{size:28,color:C.F,weight:700}));
 s+=fade(g*arcG,arc(ax,ay,56,0,th)+label(th===60&&num?'60°':'θ',ax+64,ay-14,{size:26,color:C.hi,weight:700}));
 if(comp){
  s+=fade(comp,arrow(ax,ay,ex,ay,{color:'#b9f5dc',w:6,head:18})+line(ex,ay,ex,ey,{color:'#b9f5dc',w:3,dash:'7 7'}));
  s+=fade(comp,label(num?'5 N':'F cosθ',ax+(ex-ax)/2,ay+40,{size:26,color:'#b9f5dc',anchor:'middle',weight:700}));
 }
 return s;
}
// ---- K formula chain card ------------------------------------------------------------------------
const KF='\\tfrac12 mv^2';

export const hsEnergy1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=lane({gy:240,x0:200,k:110,d:1.2,p:seg(p,.05,.4),F:'同じ力',m:'',hand:1});
  s+=lane({gy:440,x0:200,k:110,d:6.5,p:seg(p,.1,.85),F:'同じ力',m:'',hand:1});
  s+=fade(seg(p,.4,.5),VA(200+132+86,240-46,200+132+86+50,240-46));
  s+=fade(seg(p,.85,.95),VA(200+715+86,440-46,200+715+86+130,440-46));
  s+=fade(seg(p,.5,.65),label('短く 押す',200,150,{size:26,color:C.dim})+label('長く 押す',200,350,{size:26,color:C.dim}));
  s+=label('同じ 力で 押す',600,110,{size:30,color:C.F,anchor:'middle',weight:700});
  return s;
 },
 [K+'q2']:(p)=>{
  let s=fade(.3,lane({gy:440,x0:200,k:110,d:6.5,p:1,F:'',m:'',hand:0}));
  s+=card(250,90,700,220,label('力 × 距離 は',600,165,{size:34,color:C.ink,anchor:'middle'})+label('物体の 何を 増やす？',600,250,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'ex']:(p)=>{
  let s=lane({gy:300,x0:230,k:150,d:1,p:seg(p,.3,.8),dl:'',v:''});
  s+=fade(seg(p,.05,.2),label('質量 2.0 kg',600,110,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),label('押す力 4.0 N',600,160,{size:30,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),label('摩擦 なし',1000,360,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=lane({gy:210,x0:200,k:150,d:1,p:seg(p,.03,.3),dl:'1.0 m',v:'2.0 m/s'});
  s+=lane({gy:430,x0:200,k:150,d:4,p:seg(p,.45,.85),dl:'4.0 m',v:'4.0 m/s'});
  return s;
 },
 [K+'ex3']:(p)=>{
  let s=fade(.45,lane({gy:210,x0:200,k:150,d:1,p:1,dl:'1.0 m',v:'2.0 m/s'})+lane({gy:430,x0:200,k:150,d:4,p:1,dl:'4.0 m',v:'4.0 m/s'}));
  s+=card(620,60,540,110,label('距離 4倍 → 速さ 2倍',890,130,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(620,235,540,100,label('比例するのは 速さ ではない？',890,298,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.65));
  return s;
 },
 // ================= S2 仕事の決め方 =================
 [K+'def']:(p)=>{
  const u=seg(p,.05,.4),x=260+300*u;
  let s=ground(80,760,400)+box(x,400,{w:110,h:90});
  s+=FA(x-55,285,x+55,285,{text:'F',size:30,dy:-18});
  s+=fade(seg(p,.3,.45),line(260,440,560,440,{color:C.x,w:3})+line(260,430,260,450,{color:C.x,w:3})+line(560,430,560,450,{color:C.x,w:3})+label('x（力の 向きに 動いた 距離）',410,484,{size:24,color:C.x,anchor:'middle'}));
  s+=card(800,110,340,170,T2(Wt+'=Fx',970,200,{size:60}),seg(p,.45,.6),WC);
  s+=tag('定義',970,330,{color:C.hi,g:seg(p,.75,.88)});
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(250,90,700,200,label('仕事の 単位：ジュール J',600,150,{size:32,color:WC,anchor:'middle',weight:700})+T2('1\\ \\mathrm{J}=1\\ \\mathrm{N}\\times 1\\ \\mathrm{m}',600,235,{size:52,auto:false}),seg(p,0,.15),WC);
  s+=fade(seg(p,.4,.55),ground(300,900,450)+box(480,450,{w:80,h:60})+FA(440,400,520,400,{text:'1 N',size:24,dy:-14})+line(480,470,680,470,{color:C.x,w:3})+label('1 m',580,500,{size:24,color:C.x,anchor:'middle'})+fade(.5,box(680,450,{w:80,h:60})));
  return s;
 },
 [K+'ex50']:(p)=>{
  let s=ground(80,1120,330)+box(200+500*seg(p,.05,.4),330,{w:110,h:90});
  s+=FA(145+500*seg(p,.05,.4),215,265+500*seg(p,.05,.4),215,{text:'10 N',size:28,dy:-18});
  s+=fade(seg(p,.3,.45),line(200,370,700,370,{color:C.x,w:3})+line(200,360,200,380,{color:C.x,w:3})+line(700,360,700,380,{color:C.x,w:3})+label('5.0 m',450,410,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=card(770,370,380,110,T2(Wt+'=10\\times 5.0=50\\ \\mathrm{J}',960,430,{size:40,auto:false}),seg(p,.5,.65),WC);
  return s;
 },
 [K+'wall']:(p)=>{
  let s=wall(700,120,420)+ground(120,700,420)+handR(690,300)+FA(520,250,680,250,{text:'押す',size:26,dy:-20});
  s+=fade(seg(p,.15,.3),label('壁は 動かない：x ＝ 0',430,140,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=card(780,170,370,160,T2(Wt+'=F\\times 0=0',965,250,{size:44,auto:false}),seg(p,.3,.45),WC);
  s+=fade(seg(p,.65,.8),label('疲れても 仕事は 0',965,400,{size:28,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'slant']:(p)=>slantBox({g:1,comp:seg(p,.5,.75),arcG:seg(p,.1,.3)})+fade(seg(p,.6,.75),label('垂直な 部分 → 動きに 効かない',900,170,{size:24,color:C.dim,anchor:'middle'})),
 [K+'slant2']:(p)=>{
  let s=slantBox({comp:1});
  s+=card(760,150,400,170,T2(Wt+'=Fx\\cos\\theta',960,240,{size:52}),seg(p,.45,.6),WC);
  return s;
 },
 [K+'ex25']:(p)=>{
  let s=slantBox({num:'10 N',comp:seg(p,.45,.65)});
  s+=card(760,110,400,190,T2('\\cos 60^\\circ=0.5',960,180,{size:44,auto:false})+tex('10\\times 0.5=5\\ \\mathrm{N}',960,255,{size:40,auto:false,color:'#b9f5dc'}),seg(p,.25,.4),C.F);
  return s;
 },
 [K+'ex25b']:(p)=>{
  let s=slantBox({num:'10 N',comp:1});
  s+=card(740,90,440,140,T2(Wt+'=5\\times 5.0=25\\ \\mathrm{J}',960,165,{size:40,auto:false}),seg(p,.05,.2),WC);
  s+=card(740,260,440,120,label('まっすぐ なら 50 J',960,310,{size:28,color:C.dim,anchor:'middle'})+label('→ 半分',960,355,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'perp']:(p)=>{
  const x1=230+110*seg(p,.03,.4),x2=760+110*seg(p,.45,.85);
  let s=ground(90,540,330)+box(x1,330,{w:100,h:80});
  s+=FA(x1,240,x1,130,{text:'F',size:28,dx:24,dy:0,anchor:'start'});
  s+=arrow(170,370,420,370,{color:C.x,w:4,head:14})+label('動く 向き',430,378,{size:22,color:C.x});
  s+=card(140,400,360,90,label('垂直',230,458,{size:30,color:C.F,anchor:'middle',weight:700})+T2('\\to '+Wt+'=0',380,450,{size:38}),seg(p,.15,.3),WC);
  s+=fade(seg(p,.45,.55),ground(640,1120,330)+box(x2,330,{w:100,h:80})+FA(x2-10,318,x2-130,318,{text:'摩擦',size:24,dy:-14,w:8})+arrow(700,370,950,370,{color:C.x,w:4,head:14})+label('動く 向き',960,378,{size:22,color:C.x}));
  s+=card(680,400,400,90,label('逆向き',790,458,{size:30,color:C.F,anchor:'middle',weight:700})+T2('\\to '+Wt+'<0',950,450,{size:38}),seg(p,.6,.72),WC);
  s+=fade(seg(p,.75,.88),label('→ 遅くなる',880,150,{size:28,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fx']:(p)=>{
  const A=fxAxes(seg(p,0,.15));let s=A.svg;
  s+=A.plot(()=>10,{from:0,to:6.3,p:seg(p,.15,.4),color:C.F,w:4,steps:2});
  s+=fade(seg(p,.45,.6),rect(A.X(0),A.Y(10),A.X(5)-A.X(0),A.Y(0)-A.Y(10),{fill:WC,fo:.35,stroke:WC,sw:2,rx:0})+line(A.X(5),A.Y(0),A.X(5),A.Y(10),{color:WC,w:2}));
  s+=fade(seg(p,.5,.65),label('10 N',A.X(0)+14,A.Y(10)-14,{size:24,color:C.F,weight:700}));
  s+=card(740,140,400,170,label('長方形の 面積',940,195,{size:28,color:C.ink,anchor:'middle'})+T2('F\\times x=10\\times 5=50\\ \\mathrm{J}',940,265,{size:36,auto:true}),seg(p,.6,.75),WC);
  return s;
 },
 [K+'fxvt']:(p)=>{
  const A=fxAxes(1,{x:90,y:430,w:440,h:300});let s=A.svg+A.plot(()=>10,{from:0,to:6.3,color:C.F,w:4,steps:2});
  s+=rect(A.X(0),A.Y(10),A.X(5)-A.X(0),A.Y(0)-A.Y(10),{fill:WC,fo:.35,stroke:WC,sw:2,rx:0});
  s+=label('面積 ＝ 仕事',A.X(2.5),A.Y(4),{size:28,color:C.ink,anchor:'middle',weight:700});
  const B=vtSmall(seg(p,.05,.25),{x:650,y:430,w:420,h:300});s+=B.svg;
  s+=fade(seg(p,.2,.35),B.plot(()=>10,{from:0,to:6.3,color:C.v,w:4,steps:2})+rect(B.X(0),B.Y(10),B.X(5)-B.X(0),B.Y(0)-B.Y(10),{fill:C.x,fo:.3,stroke:C.x,sw:2,rx:0})+label('面積 ＝ 変位',B.X(2.5),B.Y(4),{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('同じ 形・違う 量',600,500,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 ½mv² を導く =================
 [K+'setup']:(p)=>{
  let s=lane({gy:330,x0:200,k:110,d:5,p:seg(p,.3,.85),F:'F',m:'m',v:''});
  s+=fade(seg(p,.05,.2),label('静止：v₀ ＝ 0',200,180,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('x',200+275,400+20,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.85,.97),VA(200+550+86,330-46,200+550+86+80,330-46)+label('v',200+550+86+96,330-38,{size:28,color:C.v,weight:700}));
  return s;
 },
 [K+'setup2']:(p)=>{
  let s=fade(.5,lane({gy:330,x0:200,k:110,d:5,p:.55,F:'F',m:'m'}));
  s+=fade(seg(p,.05,.2),label('摩擦 なし',600,400,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(330,70,540,120,label('横の 力は F だけ → F ＝ 合力',600,140,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,.4,.55),C.F);
  s+=tag('仮定',600,240,{color:C.dim,g:seg(p,.1,.25)});
  return s;
 },
 [K+'d1']:(p)=>{
  let s=label('仕事',600,60,{size:26,color:C.dim,anchor:'middle'})+T2(Wt+'=Fx',600,125,{size:52});
  s+=fade(seg(p,.1,.25),label('ma ＝ F',900,130,{size:30,color:C.F,weight:700})+tag('法則',1060,124,{color:C.F,size:22}));
  s+=fade(seg(p,.35,.5),T2('F\\,x={\\color{#ffe28a}ma}\\,x',600,240,{size:52}));
  s+=card(400,310,400,120,T2('Fx=max',600,375,{size:56}),seg(p,.65,.8),C.F);
  return s;
 },
 [K+'d2']:(p)=>{
  let s=T2('Fx=max',600,80,{size:44});
  s+=fade(seg(p,.1,.25),label('第3式',600,165,{size:26,color:C.dim,anchor:'middle'})+T2('v^2-v_0^2=2ax',600,225,{size:48}));
  s+=fade(seg(p,.4,.55),label('静止から：v₀ ＝ 0',600,305,{size:28,color:C.v,anchor:'middle'}));
  s+=card(420,340,360,110,T2('v^2=2ax',600,400,{size:54}),seg(p,.6,.75),C.v);
  return s;
 },
 [K+'d3']:(p)=>{
  let s=T2('v^2=2ax',600,90,{size:50});
  s+=fade(seg(p,.1,.25),label('両辺を 2 で 割る',900,100,{size:26,color:C.hi}));
  s+=card(400,190,400,170,T2('ax=\\dfrac{v^2}{2}',600,285,{size:56}),seg(p,.35,.5),C.hi);
  return s;
 },
 [K+'d4']:(p)=>{
  let s=T2('F x=m\\,{\\color{#ffe28a}ax}',600,70,{size:48})+fade(seg(p,0,.1),tex('ax=\\dfrac{v^2}{2}',1000,80,{size:34}));
  s+=fade(seg(p,.2,.35),T2('Fx=m\\times{\\color{#ffe28a}\\dfrac{v^2}{2}}',600,200,{size:50}));
  s+=card(380,290,440,140,T2('Fx=\\tfrac12 mv^2',600,365,{size:60}),seg(p,.5,.65),KC);
  return s;
 },
 [K+'d5']:(p)=>{
  let s=card(200,80,800,150,T2('Fx',380,160,{size:54})+arrow(470,150,640,150,{color:C.hi,w:4,head:16})+T2(KF,800,160,{size:54,color:KC}),seg(p,0,.15),KC);
  s+=fade(seg(p,.2,.35),label('した 仕事',380,290,{size:28,color:WC,anchor:'middle',weight:700})+label('物体に たくわえられる',800,290,{size:28,color:KC,anchor:'middle',weight:700}));
  s+=tag('導いた 結果',600,400,{g:seg(p,.6,.75)});
  return s;
 },
 [K+'d6']:(p)=>{
  let s=card(250,70,700,170,T2(Kt+'=\\tfrac12 mv^2',600,170,{size:64}),seg(p,0,.12),KC);
  s+=fade(seg(p,.1,.25),label('運動エネルギー',600,300,{size:36,color:KC,anchor:'middle',weight:700}));
  s+=tag('名前：定義',420,400,{g:seg(p,.5,.65)})+tag('形：導いた 結果',780,400,{g:seg(p,.6,.75)});
  return s;
 },
 [K+'half']:(p)=>{
  const A=vtSmall(1,{x:100,y:440,w:470,h:320});let s=A.svg;
  s+=A.plot(t=>2*t,{from:0,to:5,color:C.v,w:4,steps:2});
  s+=fade(seg(p,.05,.2),poly([[A.X(0),A.Y(0)],[A.X(5),A.Y(10)],[A.X(5),A.Y(0)]],{fill:C.x,fo:.3,stroke:C.x,sw:2}));
  s+=fade(seg(p,.1,.25),label('x ＝ ½ × t × v',A.X(3.3),A.Y(2.2),{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=card(660,90,480,330,label('三角形の ½',900,145,{size:30,color:C.hi,anchor:'middle',weight:700})+arrow(900,165,900,200,{color:C.dim,w:3,head:12})+T2('v^2=2ax',900,240,{size:44})+arrow(900,265,900,300,{color:C.dim,w:3,head:12})+T2(Kt+'=\\tfrac12 mv^2',900,355,{size:48}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ================= S4 数で確かめる =================
 [K+'n1']:(p)=>{
  let s=lane({gy:300,x0:150,k:88,d:9,p:seg(p,.05,.5),dl:'9.0 m',F:'4.0 N'});
  s+=card(300,370,600,110,T2(Wt+'=4.0\\times 9.0=36\\ \\mathrm{J}',600,430,{size:44,auto:false}),seg(p,.55,.7),WC);
  return s;
 },
 [K+'n2']:(p)=>{
  let s=fade(.4,lane({gy:200,x0:150,k:88,d:9,p:1,dl:'',v:''}));
  s+=card(150,250,420,110,T2('a=4.0\\div 2.0=2.0',360,310,{size:40}),seg(p,.02,.17),C.a);
  s+=card(620,250,500,110,T2('v^2=2\\times 2.0\\times 9.0=36',870,310,{size:38}),seg(p,.3,.45),C.v);
  s+=card(620,390,500,100,T2('v=6.0\\ \\mathrm{m/s}',870,445,{size:44}),seg(p,.6,.75),C.v);
  return s;
 },
 [K+'n3']:(p)=>{
  let s=fade(.4,lane({gy:200,x0:150,k:88,d:9,p:1,dl:'',v:''}))+label('v ＝ 6.0 m/s',600,110,{size:30,color:C.v,anchor:'middle',weight:700});
  s+=card(200,260,800,110,T2(Kt+'=\\tfrac12\\times 2.0\\times 6.0^2=36\\ \\mathrm{J}',600,320,{size:44,auto:false}),seg(p,.02,.17),KC);
  s+=fade(seg(p,.5,.65),label('した 仕事 36 J と 一致',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 ...Object.fromEntries([['back',0],['back2',1]].map(([k,st])=>[K+k,(p)=>{
  const rows=[['1.0','4.0','4.0','2.0'],['4.0','16','16','4.0'],['9.0','36','36','6.0']];
  const cols=[{h:'押した 距離 [m]',color:C.x,w:200},{h:'仕事 W [J]',color:WC,w:170},{h:'K [J]',color:KC,w:140},{h:'速さ v [m/s]',color:C.v,w:180}];
  const rv=st?[1,1,1]:[seg(p,.05,.2),seg(p,.4,.55),seg(p,.75,.9)];
  let s=table({x:120,y:90,cols,rows,reveal:rv,hl:st?[0,1]:[],rh:70,size:32});
  if(st){
   s+=card(860,90,300,130,label('W・K',1010,140,{size:28,color:WC,anchor:'middle',weight:700})+label('4倍',1010,195,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),WC);
   s+=card(860,250,300,130,label('速さ v',1010,300,{size:28,color:C.v,anchor:'middle',weight:700})+label('2倍',1010,355,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.v);
   s+=fade(seg(p,.7,.85),label('v² が 比例する',1010,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  }
  return s;
 }])),
 ...Object.fromEntries([['x2',0],['x2b',1]].map(([k,st])=>[K+k,(p)=>{
  const base=430,kk=6;
  let s=line(150,base,700,base,{color:C.dim,w:3});
  s+=ebar(300,base,9,kk,{text:'3.0 m/s',top:'9.0 J'});
  s+=ebar(550,base,36,kk,{text:'6.0 m/s',top:'36 J',g:st?1:seg(p,.6,.75)});
  s+=fade(st?1:seg(p,.05,.2),label('2.0 kg',425,90,{size:28,color:C.ink,anchor:'middle',weight:700}));
  if(st){
   s+=label('速さ 2倍 → K 4倍',425,140,{size:28,color:C.hi,anchor:'middle',weight:700});
   s+=card(760,120,400,250,label('よくある 間違い',960,170,{size:28,color:C.a,anchor:'middle',weight:700})+tex('\\tfrac12\\times 2.0\\times 3.0=3.0',960,235,{size:34,auto:false,color:C.dim})+line(800,228,1120,228,{color:C.a,w:4})+tex('\\tfrac12\\times 2.0\\times 3.0^2=9.0',960,320,{size:34,auto:false,color:KC}),seg(p,.3,.45),C.a);
  }
  return s;
 }])),
 // ================= S5 はじめから動いていたら =================
 [K+'v0']:(p)=>{
  let s=lane({gy:220,x0:200,k:110,d:5,p:seg(p,.05,.4)*.3+.3,F:'F',m:'m'});
  s+=fade(seg(p,.05,.2),VA(200+50,130,200+130,130)+label('はじめ v₀',200+90,108,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=card(330,320,540,110,T2('v^2-v_0^2=2ax',600,380,{size:50}),seg(p,.45,.6),C.v);
  return s;
 },
 [K+'m2']:(p)=>{
  let s=T2('v^2-v_0^2=2ax',600,80,{size:46});
  s+=fade(seg(p,.05,.2),label('両辺に m の 半分 を 掛ける',600,160,{size:28,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),T2('{\\color{#ffe28a}\\tfrac{m}{2}}(v^2-v_0^2)={\\color{#ffe28a}\\tfrac{m}{2}}\\times 2ax',600,250,{size:46}));
  s+=card(250,320,440,120,T2('\\tfrac12 mv^2-\\tfrac12 mv_0^2',470,382,{size:46}),seg(p,.6,.75),KC);
  s+=fade(seg(p,.6,.75),label('左辺',470,475,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'rhs']:(p)=>{
  let s=T2('\\tfrac12 mv^2-\\tfrac12 mv_0^2=\\tfrac{m}{2}\\times 2ax',600,80,{size:44});
  s+=fade(seg(p,.05,.2),T2('\\tfrac{m}{2}\\times 2ax=max',600,190,{size:46}));
  s+=fade(seg(p,.35,.5),T2('max=Fx',600,290,{size:46})+label('ma ＝ F',860,298,{size:26,color:C.F}));
  s+=card(420,350,360,110,T2('Fx='+Wt,600,410,{size:50}),seg(p,.65,.8),WC);
  return s;
 },
 [K+'wke']:(p)=>{
  let s=card(180,90,840,160,T2(Wt+'=\\tfrac12 mv^2-\\tfrac12 mv_0^2',600,180,{size:58}),seg(p,0,.15),WC);
  s+=fade(seg(p,.3,.45),label('あと の K',735,300,{size:26,color:KC,anchor:'middle'})+label('はじめ の K',905,300,{size:26,color:KC,anchor:'middle'}));
  s+=card(300,340,600,110,label('仕事 ＝ K の 増えた 量',600,408,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  s+=tag('導いた 結果',330,300,{g:seg(p,.7,.85)});
  return s;
 },
 [K+'ex12']:(p)=>{
  let s=lane({gy:240,x0:220,k:150,d:3,p:seg(p,.3,.75),dl:'3.0 m',F:'4.0 N'});
  s+=fade(seg(p,.02,.15),VA(220+70,130,220+150,130)+label('はじめ 2.0 m/s',220+110,108,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=card(330,350,540,100,T2(Wt+'=4.0\\times 3.0=12\\ \\mathrm{J}',600,405,{size:44,auto:false}),seg(p,.7,.85),WC);
  return s;
 },
 [K+'ex16']:(p)=>{
  const base=440,kk=14;
  let s=line(120,base,760,base,{color:C.dim,w:3});
  s+=card(760,80,400,110,T2(Kt+'_0=\\tfrac12\\times 2.0\\times 2.0^2',960,135,{size:34,auto:false}),seg(p,0,.12),KC);
  s+=ebar(260,base,4,kk,{text:'はじめ',top:'4.0 J',g:seg(p,.15,.3)});
  s+=fade(seg(p,.4,.55),rect(470-45,base-16*kk,90,12*kk,{fill:WC,fo:.25,stroke:WC,sw:2,rx:6})+label('＋12 J',470,base-10*kk+8,{size:28,color:WC,anchor:'middle',weight:700})+ebar(470,base,4,kk,{text:''}));
  s+=ebar(660,base,16,kk,{text:'あと',top:'16 J',g:seg(p,.65,.8)});
  return s;
 },
 [K+'exv']:(p)=>{
  let s=T2('\\tfrac12\\times 2.0\\times v^2=16',600,90,{size:48});
  s+=fade(seg(p,.2,.35),T2('v^2=16',600,210,{size:50}));
  s+=card(420,280,360,110,T2('v=4.0\\ \\mathrm{m/s}',600,340,{size:50}),seg(p,.5,.65),C.v);
  s+=fade(seg(p,.75,.9),label('第3式でも 4 ＋ 2×2.0×3.0 ＝ 16',600,460,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'negw']:(p)=>{
  const base=440,kk=14,u=seg(p,.3,.7);
  let s=line(120,base,760,base,{color:C.dim,w:3});
  s+=ebar(300,base,16-12*u,kk,{text:'K',top:''});
  s+=fade(seg(p,.05,.2),label('ブレーキ：W ＜ 0',300,120,{size:30,color:WC,anchor:'middle',weight:700}));
  s+=card(760,150,400,160,label('負の 仕事',960,205,{size:30,color:WC,anchor:'middle',weight:700})+label('→ K が 減る',960,265,{size:32,color:KC,anchor:'middle',weight:700}),seg(p,.35,.5),WC);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(200,90,800,130,label('力 × 距離 ＝ 仕事 W',600,170,{size:40,color:WC,anchor:'middle',weight:700}),seg(p,0,.12),WC);
  s+=fade(seg(p,.2,.35),arrow(600,235,600,290,{color:C.hi,w:4,head:16}));
  s+=card(200,300,800,140,label('運動エネルギー を 増やす',600,365,{size:34,color:KC,anchor:'middle',weight:700})+T2(Kt+'=\\tfrac12 mv^2',600,415,{size:40}),seg(p,.3,.45),KC);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=fade(.5,lane({gy:210,x0:200,k:150,d:1,p:1,dl:'1.0 m',v:'2.0 m/s'})+lane({gy:430,x0:200,k:150,d:4,p:1,dl:'4.0 m',v:'4.0 m/s'}));
  s+=card(780,90,380,170,label('仕事に 比例',970,150,{size:28,color:C.ink,anchor:'middle'})+label('v ではなく v²',970,215,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'bank']:(p)=>{
  let s=card(420,140,360,240,label('運動エネルギー',600,215,{size:30,color:KC,anchor:'middle',weight:700})+label('K',600,300,{size:64,color:KC,anchor:'middle',weight:700}),seg(p,0,.12),KC);
  s+=fade(seg(p,.15,.3),arrow(160,200,400,200,{color:WC,w:6,head:20})+label('仕事を 入れる',280,170,{size:26,color:WC,anchor:'middle',weight:700})+label('→ 増える',280,245,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),arrow(800,320,1040,320,{color:WC,w:6,head:20})+label('負の 仕事',920,290,{size:26,color:WC,anchor:'middle',weight:700})+label('→ 減る',920,365,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('仕事の 貯金 の ようなもの',600,460,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  const u=seg(p,.05,.8),y=430-220*u;
  let s=ground(150,750,450)+box(450,y,{w:110,h:80});
  s+=handUp(450,y);
  s+=FA(330,y-20,330,y-120,{text:'mg と 同じ 力',size:24,dx:-14,dy:0,anchor:'end'});
  s+=FA(570,y-60,570,y+40,{text:'mg',size:26,dx:14,dy:10,anchor:'start'});
  s+=fade(seg(p,.1,.25),label('ゆっくり',800,180,{size:30,color:C.ink,weight:700}));
  s+=fade(seg(p,.6,.75),label('速さは ほとんど 0 のまま',800,240,{size:28,color:C.v,weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=fade(.3,ground(150,750,450)+box(450,210,{w:110,h:80})+handUp(450,210));
  s+=card(250,130,700,200,label('持ち上げた 仕事は',600,200,{size:32,color:WC,anchor:'middle',weight:700})+label('どこへ 行った？',600,275,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('持ち上げた 仕事の 行き先',600,265,{size:46,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('仕事とエネルギー・深く学ぶ 2/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
