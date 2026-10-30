// 高校編「等加速度運動・深く学ぶ 2/3」(ys-hs-m1-uniform-accel-2) — 図。Stage 1200×515.
// 色：面積（長方形＝はじめの速度のぶん）水色、三角形（加速で増えたぶん）黄、速度 v 紫、加速度 a 赤、時刻 t 金。
import {C,seg,fade,label,line,rect,dot,arrow,tex,poly,mix} from './anim.mjs';
import {card,NL,numberLine,thing} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {hsUA1Diagrams as U1,vtAxes,symAxes,sv,SV0,SA,ST,areaUnder,rcard,F1,F2} from './yt1-hs-m1-uniform-accel-1-diagrams.mjs';

const K='hs-m1-uniform-accel-2:';
const RX=950;
const u1=k=>U1['hs-m1-uniform-accel-1:'+k];

// ---- symbolic trapezoid split into rectangle (v₀) + triangle (at) -------------------------
export function trapPic(p,{trap=0,rectG=0,triG=0,split=0,lab=1,vlab=1,hRect=0,hTri=0,wrongV=0,plot=1}={}){
 const A=symAxes();let s=A.svg;
 const X0=A.X(0),X1=A.X(ST),Y0=A.Y(0),Yv0=A.Y(SV0),Yv=A.Y(sv(ST));
 if(trap)s+=fade(trap,poly([[X0,Y0],[X0,Yv0],[X1,Yv],[X1,Y0]],{fill:C.x,fo:.28,stroke:C.x,sw:2}));
 if(rectG)s+=fade(rectG,rect(X0,Yv0,X1-X0,Y0-Yv0,{fill:C.x,fo:.32,stroke:C.x,rx:0}));
 if(triG)s+=fade(triG,poly([[X0,Yv0],[X1,Yv],[X1,Yv0]],{fill:C.hi,fo:.3,stroke:C.hi,sw:2}));
 if(split)s+=line(X0,Yv0,mix(X0,X1,split),Yv0,{color:C.hi,w:3,dash:'8 6'});
 s+=fade(plot,A.plot(sv,{from:0,to:ST,color:C.v,w:5,steps:2}));
 if(lab)s+=fade(lab,tex('v_0',X0-32,Yv0+8,{size:36})+label('t',X1,Y0+34,{size:28,color:C.t,anchor:'middle'})+label('0',X0,Y0+34,{size:24,color:C.dim,anchor:'middle'}));
 if(vlab)s+=fade(vlab,tex('v',X1+26,Yv-18,{size:36}));
 if(hRect)s+=fade(hRect,arrow(X0+40,Y0,X0+40,Yv0,{color:C.v,w:4,head:14})+tex('v_0',X0+74,(Y0+Yv0)/2+8,{size:32})+label('底辺 t',(X0+X1)/2,Y0-16,{size:26,color:C.t,anchor:'middle',weight:700}));
 if(hTri)s+=fade(hTri,arrow(X1+20,Yv0,X1+20,Yv,{color:C.a,w:4,head:14})+tex('at',X1+60,(Yv0+Yv)/2+8,{size:34}));
 if(wrongV)s+=fade(wrongV,arrow(X1+95,Y0,X1+95,Yv,{color:C.dim,w:3,head:12})+label('v ？',X1+95,Yv-16,{size:28,color:C.dim,anchor:'middle'}));
 return {s,A};
}

// numeric v–t graphs
const f4=t=>4+2*t, f6=t=>6-2*t, f2=t=>2*t;
const g4=(g=1)=>vtAxes(g,{xmax:3.6,ymax:11.4,xticks:[1,2,3],yticks:[2,4,6,8,10]});
function ex4(p,{rectG=1,triG=1,cuts=0,slices=0,box30=0}={}){
 const A=g4();let s=A.svg;
 const X0=A.X(0),X3=A.X(3),Y0=A.Y(0),Y4=A.Y(4),Y10=A.Y(10);
 if(box30)s+=fade(box30,rect(X0,Y10,X3-X0,Y0-Y10,{fill:C.a,fo:.12,stroke:C.a,sw:2.5,rx:0}));
 if(rectG)s+=fade(rectG,rect(X0,Y4,X3-X0,Y0-Y4,{fill:C.x,fo:.32,stroke:C.x,rx:0}));
 if(triG)s+=fade(triG,poly([[X0,Y4],[X3,Y10],[X3,Y4]],{fill:C.hi,fo:.3,stroke:C.hi,sw:2}));
 if(slices){const cols=[C.x,C.hi,C.x];[0,1,2].forEach(i=>{const g=seg(slices,i*.3,i*.3+.3);s+=fade(g,poly([[A.X(i),Y0],[A.X(i),A.Y(f4(i))],[A.X(i+1),A.Y(f4(i+1))],[A.X(i+1),Y0]],{fill:cols[i],fo:.3,stroke:cols[i],sw:2})+label(String(5+2*i),A.X(i+.5),A.Y(2)+10,{size:30,color:C.ink,anchor:'middle',weight:700}));});}
 if(cuts)[1,2].forEach(t=>{s+=fade(cuts,line(A.X(t),Y0,A.X(t),A.Y(f4(t)),{color:C.t,w:2.5,dash:'7 6'}));});
 s+=A.plot(f4,{from:0,to:3,color:C.v,w:5,steps:2});
 return {s,A};
}

export const hsUA2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  const {s:b}=trapPic(p,{trap:seg(p,.3,.5),vlab:0});
  let s=b+fade(seg(p,.5,.65),label('？',300,360,{size:60,color:C.hi,anchor:'middle',weight:700}));
  s+=rcard(170,label('台形の 面積は',RX,190,{size:32,color:C.ink,anchor:'middle'})+label('どんな 式？',RX,250,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'recap']:u1('result'),
 [K+'graph']:(p)=>{
  const {s:b,A}=trapPic(p,{plot:seg(p,.2,.5),vlab:seg(p,.5,.6)});
  let s=b;
  // step of a per second
  const t1=1.4,t2=2.4;
  s+=fade(seg(p,.6,.75),line(A.X(t1),A.Y(sv(t1)),A.X(t2),A.Y(sv(t1)),{color:C.t,w:3,dash:'6 5'})+line(A.X(t2),A.Y(sv(t1)),A.X(t2),A.Y(sv(t2)),{color:C.a,w:3})
   +label('1 s',A.X((t1+t2)/2),A.Y(sv(t1))+28,{size:22,color:C.t,anchor:'middle'})+label('a',A.X(t2)+12,A.Y(sv(t1)+.6),{size:28,color:C.a,weight:700}));
  s+=rcard(130,tex(F1,RX,190,{size:52}),seg(p,.03,.18),C.v);
  return s;
 },
 [K+'plan']:(p)=>card(150,110,900,260,label('台形の 面積 → 第2式',600,190,{size:38,color:C.x,anchor:'middle',weight:700})
  +fade(seg(p,.35,.5),tex(F2,600,270,{size:56}))
  +fade(seg(p,.55,.7),label('½ は どこから？',600,340,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.03,.18),C.x),
 // ================= S2 台形を2つに分ける =================
 [K+'trap']:(p)=>{
  const {s:b}=trapPic(p,{trap:seg(p,.05,.25),vlab:seg(p,.6,.75)});
  let s=b+rcard(170,label('左の辺の 高さ：v₀',RX,185,{size:30,color:C.v,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('右の辺の 高さ：v',RX,240,{size:30,color:C.v,anchor:'middle',weight:700})),seg(p,.4,.55));
  return s;
 },
 [K+'split']:(p)=>{
  const c=seg(p,.55,.75);
  const {s:b}=trapPic(p,{trap:1-c,rectG:c,triG:c,split:seg(p,.1,.45)});
  return b+rcard(170,label('高さ v₀ で 横線',RX,185,{size:30,color:C.hi,anchor:'middle',weight:700})+fade(c,label('長方形 ＋ 三角形',RX,240,{size:32,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
 },
 [K+'rectpart']:(p)=>{
  const {s:b}=trapPic(p,{rectG:1,triG:.35,split:1,hRect:seg(p,.45,.6)});
  return b+rcard(170,label('長方形',RX,180,{size:32,color:C.x,anchor:'middle',weight:700})+label('はじめの 速度 v₀ の ぶん',RX,235,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.x);
 },
 [K+'tripart']:(p)=>{
  const {s:b}=trapPic(p,{rectG:.35,triG:1,split:1,hRect:0});
  let s=b+fade(seg(p,.45,.6),label('底辺 t',305,322,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=rcard(170,label('三角形',RX,180,{size:32,color:C.hi,anchor:'middle',weight:700})+label('加速で 増えた 速度の ぶん',RX,235,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'triheight']:(p)=>{
  const {s:b}=trapPic(p,{rectG:.35,triG:1,split:1,hTri:seg(p,.05,.25)});
  let s=b+rcard(230,label('三角形の 高さ',RX,170,{size:28,color:C.ink,anchor:'middle'})+tex('v-v_0',RX,235,{size:46})
   +fade(seg(p,.55,.7),tex('=at',RX,300,{size:46})),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.55,.7),label('第1式 より',RX,375,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'notv']:(p)=>{
  const {s:b}=trapPic(p,{rectG:1,triG:1,split:1,hTri:1,wrongV:seg(p,.05,.2)});
  let s=b+rcard(110,label('高さ ＝ v  ✕',RX,180,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=rcard(130,label('v₀ の ぶんは',RX,315,{size:28,color:C.ink,anchor:'middle'})+label('もう 長方形に 入っている',RX,360,{size:28,color:C.x,anchor:'middle',weight:700}),seg(p,.45,.6),C.x,260);
  return s;
 },
 // ================= S3 面積を足す =================
 [K+'rectarea']:(p)=>{
  const {s:b}=trapPic(p,{rectG:1,triG:.35,split:1,hRect:1});
  return b+rcard(150,label('長方形 ＝ 縦 × 横',RX,175,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.35,.5),tex('v_0\\times t=v_0t',RX,235,{size:44})),seg(p,.05,.2),C.x);
 },
 [K+'triarea']:(p)=>{
  const {s:b}=trapPic(p,{rectG:.35,triG:1,split:1,hTri:1});
  let s=b+label('底辺 t',305,322,{size:26,color:C.t,anchor:'middle',weight:700});
  s+=rcard(250,label('三角形 ＝ 底辺 × 高さ ÷ 2',RX,165,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.3,.45),tex('t\\times at\\div 2',RX,230,{size:44}))+fade(seg(p,.6,.75),tex('=\\tfrac12at^2',RX,300,{size:48})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'sum']:(p)=>{
  const {s:b}=trapPic(p,{rectG:1,triG:1,split:1});
  let s=b+label('v₀t',300,400,{size:32,color:C.x,anchor:'middle',weight:700})+label('½at²',470,305,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=rcard(180,tex(F2,RX,195,{size:46})+fade(seg(p,.5,.65),label('第2式',RX,260,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'half']:(p)=>{
  const {s:b,A}=trapPic(p,{rectG:.25,triG:1,split:1,hTri:1});
  const X0=A.X(0),X1=A.X(ST),Yv0=A.Y(SV0),Yv=A.Y(sv(ST));
  let s=b+fade(seg(p,.3,.5),poly([[X0,Yv0],[X0,Yv],[X1,Yv]],{fill:C.hi,fo:.08,stroke:C.hi,sw:2.5})+line(X0,Yv,X0,Yv0,{color:C.hi,w:2.5,dash:'6 5'}));
  s+=rcard(230,label('底辺 × 高さ ＝ t × at',RX,170,{size:28,color:C.ink,anchor:'middle'})+label('＝ 三角形 2つぶん',RX,225,{size:30,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.55,.7),label('だから ÷ 2 → ½',RX,295,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 ...Object.fromEntries([['tsq',0],['tsq2',1]].map(([k,st])=>[K+k,(p)=>{
  let s='';
  if(!st){const {s:b}=trapPic(p,{rectG:.25,triG:1,split:1,hTri:1});s+=b+label('底辺 t',305,322,{size:26,color:C.t,anchor:'middle',weight:700});
   s+=rcard(200,tex('\\tfrac12\\times {\\color{#ffcf67}t}\\times {\\color{#ff8f9b}a}{\\color{#ffcf67}t}',RX,185,{size:46,auto:false})+fade(seg(p,.35,.5),label('底辺の t と 高さの中の t',RX,255,{size:26,color:C.t,anchor:'middle',weight:700})),seg(p,.05,.2),C.t);
   return s;}
  // small triangle and the doubled one cut into 4
  const tri=(x,y,w,h,col,fo)=>poly([[x,y],[x+w,y],[x+w,y-h]],{fill:col,fo,stroke:col,sw:2});
  const bx=100,by=400,w=150,h=110;
  s+=tri(bx,by,w,h,C.hi,.3)+label('時間 t',bx+w/2,by+34,{size:24,color:C.t,anchor:'middle'})+label('面積 1',bx+w/2,by+74,{size:28,color:C.ink,anchor:'middle',weight:700});
  const cx=380,g=seg(p,.1,.3);
  s+=fade(g,tri(cx,by,2*w,2*h,C.hi,.3)+label('時間 2t',cx+w,by+34,{size:24,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),line(cx+w,by,cx+w,by-h,{color:C.ink,w:2})+line(cx+w,by-h,cx+2*w,by-h,{color:C.ink,w:2})+line(cx+w,by,cx+2*w,by-h,{color:C.ink,w:2}));
  s+=fade(seg(p,.55,.7),label('面積 4',cx+w,by+76,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=rcard(150,label('縦 2倍 × 横 2倍',RX,175,{size:30,color:C.ink,anchor:'middle'})+label('→ 4倍',RX,230,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi,120);
  return s;
 }])),
 [K+'meaning']:(p)=>{
  const {s:b}=trapPic(p,{rectG:1,triG:1,split:1});
  let s=b+rcard(130,label('長方形',RX,165,{size:28,color:C.x,anchor:'middle',weight:700})+label('はじめの 速度の まま 進んだ ぶん',RX,210,{size:24,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.x);
  s+=rcard(130,label('三角形',RX,305,{size:28,color:C.hi,anchor:'middle',weight:700})+label('加速で 余分に 進んだ ぶん',RX,350,{size:24,color:C.ink,anchor:'middle'}),seg(p,.45,.6),C.hi,260);
  return s;
 },
 // ================= S4 数で確かめる =================
 [K+'ex']:(p)=>{
  const A=g4(seg(p,.4,.6));let s=A.svg;
  s+=rcard(230,label('v₀ ＝ 4 m/s',RX,170,{size:32,color:C.v,anchor:'middle',weight:700})+fade(seg(p,.2,.35),label('a ＝ 2 m/s²',RX,230,{size:32,color:C.a,anchor:'middle',weight:700}))+fade(seg(p,.4,.55),label('t ＝ 3 s',RX,290,{size:32,color:C.t,anchor:'middle',weight:700})),seg(p,.03,.18));
  return s;
 },
 [K+'exv']:(p)=>{
  const A=g4();let s=A.svg+A.plot(f4,{from:0,to:3,p:seg(p,.5,.75),color:C.v,w:5,steps:2});
  s+=fade(seg(p,.7,.85),dot(A.X(3),A.Y(10),9,C.v)+label('10',A.X(3)+14,A.Y(10)+6,{size:26,color:C.v,weight:700})+dot(A.X(0),A.Y(4),9,C.v));
  s+=rcard(110,label('4 ＋ 2 × 3 ＝ 10',RX,180,{size:34,color:C.v,anchor:'middle',weight:700}),seg(p,.1,.25),C.v);
  s+=fade(seg(p,.35,.5),label('m/s',RX,250,{size:26,color:C.v,anchor:'middle'}));
  return s;
 },
 [K+'predict']:(p)=>{
  const {s:b}=ex4(p,{rectG:0,triG:0,box30:seg(p,.2,.4)});
  return b+rcard(170,label('10 × 3 ＝ 30 m',RX,185,{size:34,color:C.a,anchor:'middle',weight:700})+label('でしょうか？',RX,240,{size:30,color:C.ink,anchor:'middle'}),seg(p,.1,.25),C.a);
 },
 [K+'exrect']:(p)=>{
  const {s:b}=ex4(p,{rectG:seg(p,.05,.3),triG:0});
  return b+label('12',230,410,{size:34,color:C.ink,anchor:'middle',weight:700,opacity:1})+rcard(110,label('長方形 4 × 3 ＝ 12',RX,180,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.3,.45),C.x);
 },
 [K+'extri']:(p)=>{
  const {s:b}=ex4(p,{rectG:1,triG:seg(p,.05,.25)});
  let s=b+label('12',230,410,{size:34,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.15,.3),label('9',480,280,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=rcard(110,label('長方形 4 × 3 ＝ 12',RX,180,{size:30,color:C.x,anchor:'middle',weight:700}),1,C.x);
  s+=rcard(110,label('三角形 ½ × 2 × 3² ＝ 9',RX,295,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi,235);
  s+=fade(seg(p,.6,.75),label('合計 21 m',RX,420,{size:38,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'exans']:(p)=>{
  const {s:b}=ex4(p,{box30:1});
  let s=b+label('21',330,380,{size:34,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.55),label('多すぎ',180,215,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=rcard(170,label('30 m ＝ 最初から 10 m/s',RX,185,{size:28,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.45,.6),label('実際は 21 m',RX,245,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'table']:(p)=>{
  const {s:b,A}=ex4(p,{rectG:0,triG:0,cuts:seg(p,.2,.4)});
  let s=b;[0,1,2,3].forEach((t,i)=>{s+=fade(seg(p,.3+i*.1,.38+i*.1),dot(A.X(t),A.Y(f4(t)),8,C.v)+label(String(f4(t)),A.X(t)+(t?10:14),A.Y(f4(t))-14,{size:26,color:C.v,weight:700}));});
  s+=rcard(110,label('4、6、8、10 m/s',RX,180,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.3,.45),C.v);
  return s;
 },
 [K+'slices']:(p)=>{
  const {s:b}=ex4(p,{rectG:0,triG:0,cuts:1,slices:seg(p,.15,.85)});
  return b+rcard(230,label('1 s ごとの 台形',RX,165,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.15,.3),label('(4 ＋ 6) ÷ 2 ＝ 5',RX,225,{size:30,color:C.x,anchor:'middle',weight:700}))+fade(seg(p,.5,.6),label('7',RX-60,285,{size:32,color:C.hi,anchor:'middle',weight:700}))+fade(seg(p,.75,.85),label('9',RX+60,285,{size:32,color:C.x,anchor:'middle',weight:700})),seg(p,.05,.15));
 },
 [K+'slicesum']:(p)=>{
  const {s:b}=ex4(p,{rectG:0,triG:0,cuts:1,slices:1});
  return b+rcard(150,label('5 ＋ 7 ＋ 9 ＝ 21 m',RX,180,{size:34,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.4,.55),label('第2式と 一致',RX,230,{size:28,color:C.ink,anchor:'middle'})),seg(p,.05,.2),C.hi);
 },
 ...Object.fromEntries([['rest',0],['rest2',1]].map(([k,st])=>[K+k,(p)=>{
  const A=vtAxes(1,{xmax:5.6,ymax:11.4,xticks:[1,2,3,4,5],yticks:[2,4,6,8,10]});let s=A.svg;
  s+=areaUnder(A,f2,0,5,{color:C.hi,fo:.3,g:st?1:seg(p,.4,.6)})+A.plot(f2,{from:0,to:5,color:C.v,w:5,steps:2});
  if(!st)s+=rcard(170,label('v₀ ＝ 0',RX,180,{size:34,color:C.v,anchor:'middle',weight:700})+fade(seg(p,.4,.55),label('長方形 なし → 三角形 だけ',RX,240,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  else{s+=fade(seg(p,.1,.25),label('高さ 10 m/s',A.X(5)-14,A.Y(10)+4,{size:24,color:C.v,anchor:'end',weight:700})+label('底辺 5 s',A.X(3.8),A.Y(0)-16,{size:24,color:C.t,anchor:'middle',weight:700}));
   s+=rcard(150,label('5 × 10 ÷ 2 ＝ 25 m',RX,180,{size:32,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('a ＝ 2 m/s²、5 s',RX,230,{size:26,color:C.dim,anchor:'middle'})),seg(p,.4,.55),C.hi);}
  return s;
 }])),
 // ================= S5 負の加速度と位置 =================
 [K+'neg']:(p)=>card(150,110,900,260,label('加速度 a が 負 でも',600,190,{size:36,color:C.a,anchor:'middle',weight:700})
  +fade(seg(p,.25,.4),label('符号を 付けたまま 入れる → 同じ式',600,260,{size:32,color:C.ink,anchor:'middle'}))
  +fade(seg(p,.6,.75),label('面積を 符号付きで 数えるから',600,325,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.03,.18),C.a),
 ...Object.fromEntries([['negex',0],['negcalc',1],['neggraph',2]].map(([k,st])=>[K+k,(p)=>{
  const A=vtAxes(1,{xmax:2.6,ymax:7.4,xticks:[1,2],yticks:[2,4,6]});let s=A.svg;
  const X0=A.X(0),X2=A.X(2),Y0=A.Y(0),Y6=A.Y(6),Y2=A.Y(2);
  if(st>=1)s+=fade(st===1?seg(p,.05,.25):1,rect(X0,Y6,X2-X0,Y0-Y6,{fill:C.x,fo:st===2?.12:.32,stroke:C.x,rx:0}));
  if(st>=1)s+=fade(st===1?seg(p,.4,.6):1,poly([[X0,Y6],[X2,Y6],[X2,Y2]],{fill:C.a,fo:.3,stroke:C.a,sw:2})+label('−4',A.X(1.5),A.Y(5.1),{size:28,color:C.a,anchor:'middle',weight:700}));
  if(st===2)s+=fade(seg(p,.4,.6),poly([[X0,Y0],[X0,Y6],[X2,Y2],[X2,Y0]],{fill:C.x,fo:.32,stroke:C.x,sw:2.5})+label('8',A.X(1),A.Y(1.8),{size:36,color:C.ink,anchor:'middle',weight:700}));
  if(st===1)s+=fade(seg(p,.1,.25),label('12',A.X(.7),A.Y(2.4),{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=A.plot(f6,{from:0,to:2,p:st?1:seg(p,.5,.75),color:C.v,w:5,steps:2});
  s+=fade(st?1:seg(p,.7,.85),label('6',A.X(0)+14,A.Y(6)-12,{size:24,color:C.v,weight:700})+label('2',A.X(2)+12,A.Y(2)-8,{size:24,color:C.v,weight:700}));
  if(st===0)s+=rcard(230,label('v₀ ＝ 6 m/s',RX,170,{size:32,color:C.v,anchor:'middle',weight:700})+label('a ＝ −2 m/s²',RX,230,{size:32,color:C.a,anchor:'middle',weight:700})+label('t ＝ 2 s',RX,290,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,.03,.18));
  if(st===1)s+=rcard(250,label('6 × 2 ＝ 12',RX,170,{size:32,color:C.x,anchor:'middle',weight:700})+fade(seg(p,.35,.5),label('½ × (−2) × 2² ＝ −4',RX,230,{size:30,color:C.a,anchor:'middle',weight:700}))+fade(seg(p,.65,.8),label('12 − 4 ＝ 8 m',RX,300,{size:36,color:C.hi,anchor:'middle',weight:700})),seg(p,.03,.18),C.hi);
  if(st===2)s+=rcard(200,label('長方形 から',RX,165,{size:28,color:C.ink,anchor:'middle'})+label('三角形 ぶん 削る',RX,210,{size:30,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.45,.6),label('(6 ＋ 2) × 2 ÷ 2 ＝ 8',RX,275,{size:30,color:C.x,anchor:'middle',weight:700})),seg(p,.03,.18),C.x);
  return s;
 }])),
 ...Object.fromEntries([['posx',0],['posex',1]].map(([k,st])=>[K+k,(p)=>{
  const X=m=>120+m*24,y=300;let s=line(X(0)-20,y,X(40)+30,y,{color:C.dim,w:3})+label('位置 [m]',X(40)+40,y-22,{size:22,color:C.x,anchor:'middle'});
  for(let m=0;m<=40;m+=5)s+=line(X(m),y-8,X(m),y+8,{color:C.dim,w:2})+label(String(m),X(m),y+36,{size:22,color:C.dim,anchor:'middle'});
  s+=thing(10,y,X)+label('x₀',X(10),y-60,{size:30,color:C.x,anchor:'middle',weight:700});
  const g=st?seg(p,.2,.5):seg(p,.55,.75);
  s+=arrow(X(10),y-100,X(st?35:30),y-100,{color:C.x,w:6,head:18,g})+fade(g,label(st?'変位 25 m':'変位 x（第2式）',X(st?22.5:20),y-120,{size:28,color:C.x,anchor:'middle',weight:700}));
  if(st)s+=fade(seg(p,.55,.7),thing(35,y,X,C.dim)+label('位置 35 m',X(35),y+90,{size:30,color:C.hi,anchor:'middle',weight:700}))+fade(seg(p,.6,.75),label('10 ＋ 25 ＝ 35',600,470,{size:32,color:C.hi,anchor:'middle',weight:700}));
  else s+=fade(seg(p,.7,.85),label('位置 ＝ x₀ ＋ 変位',600,470,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 }])),
 [K+'velo']:(p)=>{
  let s=card(150,70,900,130,label('速度の単元（a ＝ 0）',360,145,{size:28,color:C.dim,anchor:'middle'})+tex('x=x_0+vt',780,140,{size:50}),seg(p,.03,.18));
  s+=card(150,240,900,150,label('加速度 a が 一定',360,325,{size:28,color:C.a,anchor:'middle'})+tex('x=x_0+v_0t+{\\color{#ffe28a}\\tfrac12at^2}',780,315,{size:50}),seg(p,.25,.4),C.hi);
  s+=fade(seg(p,.6,.75),label('a ＝ 0 なら 元の式に 戻る',600,460,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 まとめと次の問い =================
 [K+'mistake']:(p)=>{
  let s=card(100,120,480,220,label('½ の 付け忘れ',340,200,{size:34,color:C.a,anchor:'middle',weight:700})+tex('x=v_0t+at^2',340,280,{size:40,auto:false,color:C.dim}),seg(p,.05,.2),C.a);
  s+=card(620,120,480,220,label('三角形の 高さを v',860,200,{size:34,color:C.a,anchor:'middle',weight:700})+label('正しくは at',860,280,{size:32,color:C.ink,anchor:'middle'}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'summary']:(p)=>{
  const {s:b}=trapPic(p,{rectG:1,triG:1,split:1});
  return b+label('v₀t',300,400,{size:32,color:C.x,anchor:'middle',weight:700})+label('½at²',470,305,{size:28,color:C.hi,anchor:'middle',weight:700})
   +rcard(180,label('第2式',RX,160,{size:30,color:C.hi,anchor:'middle',weight:700})+tex(F2,RX,230,{size:46}),seg(p,.05,.2),C.hi);
 },
 [K+'both']:(p)=>{
  let s=card(100,120,480,200,label('第1式',340,175,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(F1,340,255,{size:50}),seg(p,.03,.18));
  s+=card(620,120,480,200,label('第2式',860,175,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(F2,860,255,{size:50}),seg(p,.15,.3));
  s+=fade(seg(p,.5,.65),label('どちらにも 時間 t',600,400,{size:36,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=line(120,140,1080,140,{color:C.faint,w:3});
  const xs=[150,390,590,750,870,950,990,1000];
  xs.forEach((x,i)=>{s+=fade(seg(p,.03+i*.05,.08+i*.05),dot(x,114,13,C.hi,i===xs.length-1?1:.45));});
  s+=fade(seg(p,.4,.55),label('止まる',1000,80,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(200,220,800,220,label('時間 t が 分からない',600,290,{size:32,color:C.t,anchor:'middle'})+label('何 m 先で 止まる？',600,370,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(200,110,800,230,label('次回 3/3',600,175,{size:28,color:C.dim,anchor:'middle'})+label('t を 先に 消しておく',600,255,{size:46,color:C.t,anchor:'middle',weight:700})+label('→ 第3式',600,315,{size:30,color:C.hi,anchor:'middle'}),seg(p,.05,.25),C.t),
};
