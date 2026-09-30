// YouTube シリーズ 微分の法則・初級 2/2（ステージ ui-function-rules 本1）— 図。Stage 1200×515.
// 色：位置・高さ x（sin）水色、横の位置（cos）緑、速度 v 紫、加速度 a 赤、時刻 t 金、角度・中身 u 橙、ω 桃、強調 黄。
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,poly} from './anim.mjs';

const K='ui-function-rules-2:';
const CU=C.E,CW=C.p,CC=C.F;
const U=`{\\color{${CU}}u}`,W=`{\\color{${CW}}\\omega}`,TH=`{\\color{${CU}}\\theta}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const P=(cx,cy,R,th)=>[cx+R*Math.cos(th),cy-R*Math.sin(th)];

// ---- circle with a point at angle th ---------------------------------------------------------
function circ(cx,cy,R,th,{sc=0,arc=1,rad=1,one='',thl='θ',ptc=C.hi,g=1}={}){
 let s=line(cx-R-30,cy,cx+R+30,cy,{color:C.faint,w:2})+line(cx,cy+R+30,cx,cy-R-30,{color:C.faint,w:2});
 s+=ring(cx,cy,R,{color:C.dim,w:3});
 const [px,py]=P(cx,cy,R,th);
 if(rad)s+=line(cx,cy,px,py,{color:C.ink,w:3})+(one?label(one,(cx+px)/2-14*Math.sin(th)-10,(cy+py)/2-14*Math.cos(th),{size:24,color:C.ink,anchor:'end'}):'');
 if(arc&&Math.abs(th)>.05){const r=46,n=30,pts=Array.from({length:n+1},(_,i)=>P(cx,cy,r,th*i/n));s+=draw(pts,1,{color:CU,w:3});
  const [lx,ly]=P(cx,cy,r+26,th/2);s+=label(thl,lx,ly+8,{size:26,color:CU,anchor:'middle'});}
 if(sc){s+=fade(sc,line(px,cy,px,py,{color:C.x,w:6})+line(cx,cy,px,cy,{color:CC,w:6}));}
 s+=dot(px,py,11,ptc);
 return fade(g,s);
}
// sin graph on the right: θ from 0 to 3.4
function sinGraph({x=640,y=300,w=500,h=190,g=1,cosCurve=0}={}){
 const A=axes({x,y:y+h,w,h:2*h,xmin:0,xmax:3.4,ymin:-1.15,ymax:1.15,xlabel:'θ',ylabel:'',xticks:[],yticks:[1,-1],g,xcolor:CU});
 let s=A.svg+A.plot(Math.sin,{from:0,to:3.3,color:C.x,w:4});
 s+=label('sin θ',A.X(2.75),A.Y(.55),{size:24,color:C.x});
 s+=label('π/2',A.X(Math.PI/2),A.Y(0)+34,{size:22,color:C.dim,anchor:'middle'})+label('π',A.X(Math.PI),A.Y(0)+34,{size:22,color:C.dim,anchor:'middle'});
 return {A,svg:fade(g,s)};
}
function tangentOn(A,t0,{g=1,color=C.hi,half=.7}={}){
 const k=Math.cos(t0),y0=Math.sin(t0);
 return draw([[A.X(Math.max(0,t0-half)),A.Y(y0+k*(Math.max(0,t0-half)-t0))],[A.X(t0+half),A.Y(y0+k*half)]],g,{color,w:4});
}
// ---- circle + shadow + trace (x = A sin(ωt+φ)) -------------------------------------------
const PHI=.5,TURN=2*Math.PI*1.6;
function shm(s0,{cx=220,cy=275,R=140,x0=480,x1=1150,vel=0,acc=0,labels=1,g=1}={}){
 const u=PHI+TURN*s0,[px,py]=P(cx,cy,R,u);
 let o=circ(cx,cy,R,u,{arc:0,rad:1});
 o+=line(px,py,x0,py,{color:C.faint,w:2,dash:'6 6'});
 o+=line(x0,cy-R-20,x0,cy+R+20,{color:C.dim,w:2})+dot(x0,py,10,C.x);
 o+=line(x0,cy,x1,cy,{color:C.faint,w:2});
 const X=s=>x0+30+(x1-x0-40)*s,Yf=s=>cy-R*Math.sin(PHI+TURN*s);
 o+=draw(Array.from({length:161},(_,i)=>{const s=s0*i/160;return [X(s),Yf(s)];}),1,{color:C.x,w:4});
 o+=dot(X(s0),Yf(s0),8,C.x);
 if(labels)o+=label('影（高さ）＝ x',x0+14,cy-R-30,{size:24,color:C.x})+label('時刻 t →',x1,cy+40,{size:24,color:C.t,anchor:'end'});
 if(vel){const L=R*.9,vx=-Math.sin(u)*L,vy=-Math.cos(u)*L;
  o+=fade(vel,arrow(px,py,px+vx,py+vy,{color:C.v,w:5})+arrow(x0,py,x0,py+vy,{color:C.v,w:5}));}
 if(acc){const L=R*.8;
  o+=fade(acc,arrow(px,py,px-Math.cos(u)*L,py+Math.sin(u)*L,{color:C.a,w:5})+arrow(x0,py,x0,py+Math.sin(u)*L,{color:C.a,w:5}));}
 return fade(g,o);
}
// ---- gears -------------------------------------------------------------------------------------
function gear(cx,cy,r,teeth,ang,color,g=1){
 const pts=[];const N=teeth*4;
 for(let i=0;i<N;i++){const a=ang+i*2*Math.PI/N,rr=(i%4<2)?r:r*.8;pts.push([cx+rr*Math.cos(a),cy+rr*Math.sin(a)]);}
 return fade(g,poly(pts,{fill:color,fo:.22,stroke:color,sw:3})+ring(cx,cy,r*.28,{color,w:3,fill:C.bg})+line(cx,cy,cx+r*.62*Math.cos(ang),cy+r*.62*Math.sin(ang),{color,w:4}));
}
function badge(x,y,text,color,g=1,w=170){return fade(g,rect(x-w/2,y-30,w,60,{fill:'#1a2440',fo:1,stroke:color,sw:2,rx:12})+label(text,x,y+10,{size:28,color,anchor:'middle',weight:700}));}
function gears(p,step){
 const X=[200,600,1000],y=130,th=-.9*smooth(clamp(p/.9));
 let s=gear(X[0],y,58,8,th,C.t)+gear(X[1],y,58,8,2*th,CU)+fade(step>=1?1:.25,gear(X[2],y,58,8,3*th,C.x));
 s+=label('t',X[0],y+96,{size:32,color:C.t,anchor:'middle',weight:700})+label('u ＝ ωt ＋ φ',X[1],y+96,{size:30,color:CU,anchor:'middle',weight:700})
  +fade(step>=1?1:.25,label('x ＝ A sin u',X[2],y+96,{size:30,color:C.x,anchor:'middle',weight:700}));
 s+=badge(400,y,'× ω',CW,step===0?seg(p,.2,.35):1,130);
 if(step>=1)s+=badge(800,y,'× A cos u',C.hi,step===1?seg(p,.4,.55):1,190);
 return s;
}
function pipeline(y,{ops=['×ω ＋φ','A sin'],names=['t','u','x'],colors=[C.t,CU,C.x],g=1}={}){
 const X=[170,600,1030],bx=[385,815];let s='';
 X.forEach((x,i)=>{s+=ring(x,y,40,{color:colors[i],w:4,fill:'#10182c'})+label(names[i],x,y+12,{size:34,color:colors[i],anchor:'middle',weight:700});});
 bx.forEach((b,i)=>{s+=arrow(X[i]+44,y,b-86,y,{color:C.dim,w:3,head:12})+arrow(b+86,y,X[i+1]-46,y,{color:C.dim,w:3,head:12})
  +rect(b-80,y-34,160,68,{fill:'#1a2440',fo:1,stroke:C.dim,sw:2,rx:12})+label(ops[i],b,y+10,{size:28,color:C.ink,anchor:'middle',weight:700});});
 return fade(g,s);
}
const XF='x=A\\sin(\\omega t+\\varphi)';

// unit circle geometry used in S2
const UC={cx:290,cy:300,R:170};
function stepTri(th,{L=100,g=1,vert=1,hor=1}={}){
 const {cx,cy,R}=UC,[px,py]=P(cx,cy,R,th),dx=-Math.sin(th)*L,dy=-Math.cos(th)*L;
 let s=arrow(px,py,px+dx,py+dy,{color:C.hi,w:5,g});
 s+=fade(g*vert,line(px,py,px,py+dy,{color:C.x,w:5,dash:'8 6'}));
 s+=fade(g*hor,line(px,py+dy,px+dx,py+dy,{color:CC,w:5,dash:'8 6'}));
 return s;
}

export const ytUiFunctionRules2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=pipeline(120,{ops:['×3','2乗'],names:['t','u','y'],colors:[C.t,CU,C.F]});
  s+=fade(seg(p,.2,.4),tex(`\\dfrac{dy}{dt}=\\dfrac{dy}{d${U}}\\times\\dfrac{d${U}}{dt}`,600,300,{size:56}));
  s+=card(250,390,700,80,label('外側の微分 × 中身の微分（連鎖律）',600,442,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=shm(.15+.5*p,{cy:330,R:120,labels:0});
  s+=card(250,24,700,150,tex(XF,600,80,{size:48})+label('速度 v は どうなる？',600,145,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'symA']:(p)=>{
  const cx=300,cy=270,R=170,u=.9;const [px,py]=P(cx,cy,R,u);
  let s=circ(cx,cy,R,u,{arc:0});
  s+=fade(seg(p,.1,.3),label('A',(cx+px)/2-20,(cy+py)/2-8,{size:32,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.3,.5),line(cx+R+60,cy,cx+R+60,cy-R,{color:C.hi,w:4})+label('A',cx+R+76,cy-R/2+10,{size:30,color:C.hi,weight:700})+line(cx+R+40,cy-R,cx+R+80,cy-R,{color:C.hi,w:3})+line(cx+R+40,cy,cx+R+80,cy,{color:C.hi,w:3}));
  s+=card(640,110,520,230,label('A：振幅 [m]',900,180,{size:34,color:C.ink,anchor:'middle',weight:700})
   +label('振動の中心から',900,240,{size:28,color:C.dim,anchor:'middle'})+label('一番遠くまでの 距離',900,285,{size:28,color:C.dim,anchor:'middle'}),seg(p,.05,.2));
  return s;
 },
 [K+'symW']:(p)=>{
  const cx=300,cy=270,R=170,u=PHI+1.6*seg(p,.1,.9);const [qx,qy]=P(cx,cy,R,PHI);
  let s=circ(cx,cy,R,u,{arc:0});
  s+=line(cx,cy,qx,qy,{color:C.dim,w:2,dash:'6 6'})+label('t ＝ 0',qx+10,qy-12,{size:22,color:C.dim});
  const pts=Array.from({length:31},(_,i)=>P(cx,cy,60,PHI+(u-PHI)*i/30));s+=draw(pts,1,{color:CW,w:4});
  const pf=Array.from({length:16},(_,i)=>P(cx,cy,34,PHI*i/15));s+=draw(pf,1,{color:CU,w:3})+label('φ',cx+48,cy-4,{size:24,color:CU});
  s+=card(640,70,520,370,label('ω：角振動数 [rad/s]',900,130,{size:32,color:CW,anchor:'middle',weight:700})
   +label('1秒あたりに 進む角度',900,180,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.55,.7),label('φ：時刻 0 での角度',900,290,{size:32,color:CU,anchor:'middle',weight:700})+label('（初期位相）',900,340,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'circle']:(p)=>{
  let s=shm(.05+.55*p,{cy:290,R:140});
  s+=fade(seg(p,.5,.65),tex(XF,810,60,{size:40}));
  s+=fade(seg(p,.6,.75),label('回った角度 ＝ ωt ＋ φ',220,490,{size:26,color:CU,anchor:'middle'}));
  return s;
 },

 // ===== S2 sin の傾きは cos =====
 [K+'unit']:(p)=>{
  const {cx,cy,R}=UC;
  let s=circ(cx,cy,R,.75,{sc:seg(p,.2,.4),one:'1'});
  const [px,py]=P(cx,cy,R,.75);
  s+=fade(seg(p,.3,.45),label('sin θ',px+14,(cy+py)/2+8,{size:26,color:C.x})+label('cos θ',(cx+px)/2,cy+36,{size:26,color:CC,anchor:'middle'}));
  s+=card(640,110,520,260,label('半径 1 の円',900,165,{size:28,color:C.dim,anchor:'middle'})
   +label('高さ ＝ sin θ',900,235,{size:34,color:C.x,anchor:'middle',weight:700})
   +label('横の位置 ＝ cos θ',900,300,{size:34,color:CC,anchor:'middle',weight:700}),seg(p,.3,.5));
  return s;
 },
 [K+'radian']:(p)=>{
  const {cx,cy,R}=UC,th=.2+.8*seg(p,.05,.45);
  let s=circ(cx,cy,R,th,{arc:1,one:'1'});
  s+=draw(Array.from({length:41},(_,i)=>P(cx,cy,R,th*i/40)),1,{color:CU,w:8});
  const [lx,ly]=P(cx,cy,R+34,th/2);s+=label('弧 ＝ θ',lx+6,ly+8,{size:26,color:CU,weight:700});
  s+=fade(seg(p,.55,.7),draw(Array.from({length:61},(_,i)=>P(cx,cy,R+12,Math.PI*i/60)),1,{color:C.hi,w:3,dash:'8 6'}));
  s+=card(640,110,520,260,label('角度 ＝ 弧の長さ（ラジアン）',900,175,{size:30,color:CU,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('半周 ＝ π ≈ 3.14',900,260,{size:32,color:C.hi,anchor:'middle',weight:700})+label('（180°）',900,310,{size:26,color:C.dim,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'step']:(p)=>{
  const {cx,cy,R}=UC,th=.75,[px,py]=P(cx,cy,R,th);
  let s=circ(cx,cy,R,th,{one:'1'})+stepTri(th,{g:seg(p,.1,.35),vert:0,hor:0});
  s+=fade(seg(p,.25,.4),label('Δθ',px-Math.sin(th)*120-16,py-Math.cos(th)*120-10,{size:28,color:C.hi,anchor:'end'}));
  s+=fade(seg(p,.55,.7),label('半径に 垂直',px+20,py-40,{size:24,color:C.dim}));
  s+=card(640,110,520,260,label('角度を Δθ 進める',900,170,{size:30,color:C.ink,anchor:'middle'})
   +label('点は 円周に沿って Δθ 動く',900,235,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('向き：半径に垂直',900,300,{size:28,color:C.dim,anchor:'middle'})),seg(p,.05,.2));
  s+=label('一歩は 拡大して表示',40,500,{size:22,color:C.dim});
  return s;
 },
 [K+'tri']:(p)=>{
  const {cx,cy,R}=UC,th=.75;
  let s=circ(cx,cy,R,th,{sc:1,one:'1'})+stepTri(th,{hor:seg(p,.1,.25),vert:seg(p,.1,.25)});
  const [px,py]=P(cx,cy,R,th);
  s+=fade(seg(p,.1,.25),label('cos θ × Δθ',px+12,py-40,{size:24,color:C.x}));
  s+=label('一歩は 拡大して表示',40,500,{size:22,color:C.dim});
  s+=card(640,70,520,370,label('半径の三角形を 90° 回した形',900,125,{size:26,color:C.dim,anchor:'middle'})
   +label('半径 1 → 一歩 Δθ',900,185,{size:28,color:C.ink,anchor:'middle'})
   +label('横 cos θ → 縦 cos θ × Δθ',900,240,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.7),label('高さの増え方',900,320,{size:28,color:C.x,anchor:'middle'})+tex(`\\Delta(\\sin${TH})\\approx\\cos${TH}\\times\\Delta${TH}`,900,390,{size:40,auto:false})),seg(p,.05,.2));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=tex(`\\dfrac{\\Delta(\\sin${TH})}{\\Delta${TH}}\\approx\\cos${TH}`,600,110,{size:52,auto:false});
  s+=fade(seg(p,.2,.35),arrow(600,180,600,250,{color:C.hi,w:4})+label('幅 → 0 の 近づく先',630,225,{size:26,color:C.hi}));
  const src=`(\\sin${TH})'=\\cos${TH}`;
  s+=fade(seg(p,.35,.55),tex(src,600,330,{size:64,auto:false})+highlight(600-texWidth(src,64,false)/2-30,280,texWidth(src,64,false)+60,100,seg(p,.5,.65)));
  s+=fade(seg(p,.7,.85),label('sin の傾き ＝ cos',600,460,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check0']:(p)=>{
  const {cx,cy}=UC,R=160;let s=circ(cx,cy,R,0,{arc:0,one:''});
  s+=arrow(cx+R,cy,cx+R,cy-110,{color:C.hi,w:5,g:seg(p,.1,.3)})+fade(seg(p,.2,.35),label('真上へ',cx+R+16,cy-60,{size:26,color:C.hi}));
  const {A,svg}=sinGraph();s+=svg+tangentOn(A,0,{g:seg(p,.35,.55)})+dot(A.X(0),A.Y(0),8,C.hi);
  s+=fade(seg(p,.5,.65),label('θ ＝ 0：傾き 1 ＝ cos 0',890,60,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check90']:(p)=>{
  const {cx,cy}=UC,R=160;let s=circ(cx,cy,R,Math.PI/2,{arc:0,one:''});
  s+=arrow(cx,cy-R,cx-110,cy-R,{color:C.hi,w:5,g:seg(p,.1,.3)})+fade(seg(p,.2,.35),label('真横へ',cx-60,cy-R-22,{size:26,color:C.hi,anchor:'middle'}));
  const {A,svg}=sinGraph();s+=svg+tangentOn(A,0,{color:C.faint})+tangentOn(A,Math.PI/2,{g:seg(p,.35,.55)})+dot(A.X(Math.PI/2),A.Y(1),8,C.hi);
  s+=fade(seg(p,.5,.65),label('θ ＝ π/2：傾き 0 ＝ cos(π/2)',890,60,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'check180']:(p)=>{
  const {cx,cy}=UC,R=160;let s=circ(cx,cy,R,Math.PI,{arc:0,one:''});
  s+=arrow(cx-R,cy,cx-R,cy+110,{color:C.hi,w:5,g:seg(p,.1,.3)})+fade(seg(p,.2,.35),label('真下へ',cx-R-16,cy+70,{size:26,color:C.hi,anchor:'end'}));
  const {A,svg}=sinGraph();s+=svg+tangentOn(A,0,{color:C.faint})+tangentOn(A,Math.PI/2,{color:C.faint})+tangentOn(A,Math.PI,{g:seg(p,.35,.55),half:.5})+dot(A.X(Math.PI),A.Y(0),8,C.hi);
  s+=fade(seg(p,.5,.65),label('θ ＝ π：傾き −1 ＝ cos π',890,60,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'a3']:(p)=>{
  const rows=['x=\\sin 3t','v=3\\cos 3t','a=-9\\sin 3t=-9x'];let s='';
  rows.forEach((src,i)=>{const g=i===0?1:seg(p,.1+.3*(i-1),.3+.3*(i-1));s+=fade(g,tex(src,560,110+i*140,{size:50}));
   if(i>0)s+=fade(g,label('× 3',900,110+i*140-55,{size:28,color:CW,weight:700})+arrow(880,110+(i-1)*140+15,880,110+i*140-40,{color:CW,w:3,head:12}));});
  s+=fade(seg(p,.75,.9),label('ω ＝ 3 → ω² ＝ 9',600,490,{size:28,color:CW,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cosd']:(p)=>{
  const {cx,cy,R}=UC,th=.75,[px,py]=P(cx,cy,R,th);
  let s=circ(cx,cy,R,th,{sc:1,one:''})+stepTri(th,{vert:.3,hor:1});
  s+=fade(seg(p,.1,.3),label('左へ：− sin θ × Δθ',px-60,py-100,{size:24,color:CC,anchor:'middle'}));
  s+=label('一歩は 拡大して表示',40,500,{size:22,color:C.dim});
  const src=`(\\cos${TH})'=-\\sin${TH}`;
  s+=card(640,120,520,240,label('横の位置 cos θ は 減る',900,180,{size:28,color:CC,anchor:'middle'})
   +fade(seg(p,.4,.6),tex(src,900,280,{size:50,auto:false})),seg(p,.05,.2));
  return s;
 },

 // ===== S3 二段の歯車で速度を出す =====
 [K+'name']:(p)=>{
  let s=tex(XF,600,70,{size:52});
  const w1=texWidth('x=A\\sin(',52),w2=texWidth('\\omega t+\\varphi',52),L=600-texWidth(XF,52)/2;
  s+=highlight(L+w1-6,28,w2+12,70,seg(p,.3,.45),CU);
  s+=fade(seg(p,.4,.55),label('中身 ＝ u',L+w1+w2/2,140,{size:28,color:CU,anchor:'middle',weight:700}));
  s+=pipeline(290,{g:seg(p,.5,.7)});
  s+=fade(seg(p,.7,.85),tex(`x=A\\sin ${U},\\quad ${U}=${W}t+\\varphi`,600,440,{size:44}));
  return s;
 },
 [K+'g1']:(p)=>{
  let s=gears(p,0);
  s+=fade(seg(p,.35,.55),tex(`\\dfrac{d${U}}{dt}=${W}`,420,370,{size:60}));
  s+=fade(seg(p,.2,.35),label('φ は一定 → 変化しない',850,380,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'g1b']:(p)=>{
  const cx=280,cy=280,R=150,u=PHI+2*seg(p,.05,.85);
  let s=circ(cx,cy,R,u,{arc:0});
  s+=draw(Array.from({length:31},(_,i)=>P(cx,cy,60,PHI+(u-PHI)*i/30)),1,{color:CW,w:4});
  s+=label('1秒で ω 回る',cx,cy+R+60,{size:28,color:CW,anchor:'middle',weight:700});
  s+=card(600,110,560,280,label('回転の速さ',880,165,{size:28,color:C.dim,anchor:'middle'})
   +label('＝ 中身の傾き',880,215,{size:28,color:C.dim,anchor:'middle'})
   +tex(`\\dfrac{d${U}}{dt}=${W}`,880,320,{size:60}),seg(p,.2,.35),CW);
  return s;
 },
 [K+'g2']:(p)=>{
  let s=gears(p,1);
  s+=tex(`\\dfrac{d${U}}{dt}=${W}`,300,370,{size:48});
  s+=fade(seg(p,.5,.7),tex(`\\dfrac{dx}{d${U}}=A\\cos ${U}`,820,370,{size:48}));
  s+=fade(seg(p,.6,.75),label('sin の傾きは cos',820,470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'mulv']:(p)=>{
  let s=tex(`v=\\dfrac{dx}{dt}=\\dfrac{dx}{d${U}}\\times\\dfrac{d${U}}{dt}`,600,100,{size:52});
  s+=fade(seg(p,.1,.3),tex(`=A\\cos ${U}\\times ${W}`,600,230,{size:52}));
  const src=`v=A${W}\\cos(${W}t+\\varphi)`;
  s+=fade(seg(p,.45,.65),tex(src,600,380,{size:62})+highlight(600-texWidth(src,62)/2-30,325,texWidth(src,62)+60,100,seg(p,.6,.75)));
  return s;
 },
 [K+'units']:(p)=>{
  let s=label('単位',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=tex('A:\\ \\mathrm{m}',380,170,{size:48,auto:false});
  s+=tex(`${W}:\\ \\mathrm{1/s}`,820,170,{size:48,auto:false});
  s+=fade(seg(p,.4,.6),tex(`A${W}:\\ \\mathrm{m}\\times\\mathrm{1/s}=\\mathrm{m/s}`,600,300,{size:52,auto:false}));
  s+=card(350,380,500,80,label('速度の単位 ✓',600,432,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,.7,.85),C.v);
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(80,60,1040,110,label('A ＝ 1 m　　ω ＝ 2 rad/s　　φ ＝ 0',600,128,{size:34,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  s+=fade(seg(p,.25,.45),tex('x=\\sin 2t\\qquad v=2\\cos 2t',600,250,{size:48}));
  s+=fade(seg(p,.55,.75),tex('t=0:\\ v=2\\cos0=2\\,\\mathrm{m/s}',600,380,{size:48}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=card(170,60,860,230,
    label('t [s]',330,110,{size:28,color:C.t,anchor:'middle',weight:700})+label('x ＝ sin 2t [m]',700,110,{size:28,color:C.x,anchor:'middle',weight:700})
   +line(200,130,1000,130,{color:C.faint,w:2})
   +label('0',330,185,{size:32,color:C.t,anchor:'middle'})+label('0',700,185,{size:32,color:C.x,anchor:'middle'})
   +fade(seg(p,.1,.3),label('0.01',330,250,{size:32,color:C.t,anchor:'middle'})+label('sin 0.02 ＝ 0.019999…',700,250,{size:32,color:C.x,anchor:'middle'})));
  s+=fade(seg(p,.5,.7),tex('\\dfrac{\\Delta x}{\\Delta t}=\\dfrac{0.019999}{0.01}\\approx2.00\\,\\mathrm{m/s}',600,400,{size:46}));
  s+=ok(930,412,seg(p,.75,.9));
  return s;
 },
 [K+'forget']:(p)=>{
  const A=axes({x:90,y:450,w:480,h:340,xmin:0,xmax:.8,ymin:-.2,ymax:1.2,xlabel:'t [s]',ylabel:'x [m]',xticks:[.4,.8],yticks:[1],xcolor:C.t,ycolor:C.x});
  let s=A.svg+A.plot(t=>Math.sin(2*t),{from:0,to:.78,color:C.x,w:4});
  s+=draw([[A.X(0),A.Y(0)],[A.X(.55),A.Y(1.1)]],seg(p,.45,.6),{color:C.F,w:4});
  s+=draw([[A.X(0),A.Y(0)],[A.X(.78),A.Y(.78)]],seg(p,.1,.3),{color:C.a,w:4,dash:'10 8'});
  s+=fade(seg(p,.1,.3),ng(640,150)+tex('v=\\cos2t\\ \\to\\ 1\\,\\mathrm{m/s}',880,140,{size:40})+label('ω を掛け忘れ',880,195,{size:24,color:C.a,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),ok(640,310)+tex(`v=2\\cos2t\\ \\to\\ 2\\,\\mathrm{m/s}`,880,300,{size:40})+label('t ＝ 0 の 接線の傾き',880,355,{size:24,color:C.F,anchor:'middle'}));
  return s;
 },
 [K+'circv']:(p)=>{
  let s=shm(.1+.3*p,{cy:230,R:115,vel:seg(p,.15,.35)});
  s+=card(640,395,540,112,label('点の速さ ＝ Aω（半径 A × 1秒の角度 ω）',910,425,{size:24,color:C.v,anchor:'middle'})
   +fade(seg(p,.5,.65),label('縦の成分 ＝ Aω cos u ＝ v',910,470,{size:28,color:C.v,anchor:'middle',weight:700})),seg(p,.15,.3));
  return s;
 },
 [K+'quiz']:(p)=>card(250,120,700,260,label('確かめ',600,180,{size:26,color:C.dim,anchor:'middle'})
   +tex('x=\\sin 3t',600,260,{size:56})+label('速度 v は？',600,340,{size:32,color:C.v,anchor:'middle',weight:700}),seg(p,0,.15),C.hi),
 [K+'quiz2']:(p)=>{
  let s=tex('x=\\sin 3t',600,70,{size:48});
  s+=fade(seg(p,.05,.25),label('外側：sin → cos',330,170,{size:30,color:C.x,anchor:'middle'})+tex('\\cos 3t',330,240,{size:48}));
  s+=fade(seg(p,.3,.5),label('中身 3t の傾き',870,170,{size:30,color:CU,anchor:'middle'})+tex('3',870,240,{size:48,auto:false}));
  s+=fade(seg(p,.55,.75),tex('v=3\\cos 3t',600,390,{size:60})+highlight(430,340,340,90,1));
  return s;
 },

 // ===== S4 もう一度微分して加速度 =====
 [K+'again']:(p)=>{
  let s=tex(`v=A${W}\\cos(${W}t+\\varphi)`,600,110,{size:56});
  s+=fade(seg(p,.2,.35),arrow(600,170,600,240,{color:C.hi,w:4})+label('もう一度 微分',630,215,{size:26,color:C.hi}));
  s+=fade(seg(p,.35,.5),tex('a=\\dfrac{dv}{dt}',600,320,{size:56}));
  s+=fade(seg(p,.6,.75),label('中身は 同じ u ＝ ωt ＋ φ',600,450,{size:30,color:CU,anchor:'middle',weight:700}));
  return s;
 },
 [K+'again2']:(p)=>{
  let s=label('外側',330,100,{size:28,color:C.dim,anchor:'middle'})+label('中身',870,100,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.25),tex(`\\cos${U}\\ \\to\\ -\\sin${U}`,330,190,{size:48}));
  s+=fade(seg(p,.4,.6),tex(`\\times\\,${W}`,870,190,{size:52}));
  s+=fade(seg(p,.6,.75),label('ω を もう一度 掛ける',870,270,{size:28,color:CW,anchor:'middle',weight:700}));
  return s;
 },
 [K+'acc']:(p)=>{
  let s=tex(`a=A${W}\\times(-\\sin${U})\\times${W}`,600,130,{size:54});
  const src=`a=-A${W}^2\\sin(${W}t+\\varphi)`;
  s+=fade(seg(p,.35,.55),tex(src,600,300,{size:60})+highlight(600-texWidth(src,60)/2-30,245,texWidth(src,60)+60,100,seg(p,.6,.75)));
  return s;
 },
 [K+'ax']:(p)=>{
  const src=`a=-${W}^2\\,A\\sin(${W}t+\\varphi)`;
  let s=tex(src,600,110,{size:54});
  const W0=texWidth(src,54),wl=texWidth(`a=-${W}^2\\,`,54),L=600-W0/2;
  s+=fade(seg(p,.1,.3),brace(L+wl,L+W0,165,{color:C.x,text:'＝ x',size:30}));
  const f=`a=-${W}^2x`;
  s+=fade(seg(p,.45,.65),tex(f,600,360,{size:72})+highlight(600-texWidth(f,72)/2-30,300,texWidth(f,72)+60,110,seg(p,.6,.75)));
  return s;
 },
 [K+'meaning']:(p)=>{
  const x0=320,cy=270,R=170,u=1.2+2*Math.PI*1.2*p,xv=Math.sin(u),py=cy-R*xv;
  let s=line(x0,cy-R-30,x0,cy+R+30,{color:C.dim,w:3})+line(x0-40,cy,x0+40,cy,{color:C.dim,w:3})+label('中心',x0+50,cy+8,{size:24,color:C.dim});
  s+=dot(x0,py,14,C.x)+arrow(x0+50,py,x0+50,py+xv*120,{color:C.a,w:5})+label('a',x0+70,py+xv*60+8,{size:28,color:C.a});
  s+=line(x0-20,py,x0+20,py,{color:C.x,w:3});
  s+=card(600,110,560,280,label('a ＝ −ω²x',880,175,{size:38,color:C.a,anchor:'middle',weight:700})
   +label('いつも 位置と 逆向き',880,245,{size:30,color:C.ink,anchor:'middle'})
   +label('中心から 離れるほど 大きい',880,300,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('→ 中心へ 引き戻す',880,360,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'anum']:(p)=>{
  let s=card(200,60,800,100,label('ω ＝ 2 rad/s，　x ＝ 0.5 m',600,122,{size:34,color:C.ink,anchor:'middle'}),1);
  s+=fade(seg(p,.2,.4),tex('a=-\\omega^2x=-2^2\\times0.5',600,260,{size:52}));
  s+=fade(seg(p,.5,.7),tex('=-2\\,\\mathrm{m/s^2}',600,380,{size:56}));
  s+=fade(seg(p,.75,.9),label('x が正 → a は負（中心向き）',600,470,{size:28,color:C.a,anchor:'middle'}));
  return s;
 },
 [K+'circa']:(p)=>{
  let s=shm(.35+.2*p,{cy:230,R:115,acc:seg(p,.1,.3)});
  s+=card(640,395,540,112,label('点の加速度：中心向き，大きさ Aω²',910,425,{size:24,color:C.a,anchor:'middle'})
   +fade(seg(p,.5,.65),label('縦の成分 ＝ −ω²x ＝ a',910,470,{size:28,color:C.a,anchor:'middle',weight:700})),seg(p,.15,.3));
  return s;
 },

 // ===== S5 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=pipeline(130);
  s+=card(250,280,700,110,label('外側の微分 × 中身の微分',600,348,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'sum2']:(p)=>{
  const rows=[[`x=A\\sin(${W}t+\\varphi)`,C.x],[`v=A${W}\\cos(${W}t+\\varphi)`,C.v],[`a=-A${W}^2\\sin(${W}t+\\varphi)=-${W}^2x`,C.a]];
  let s='';rows.forEach(([src,col],i)=>{s+=fade(i===0?1:seg(p,.1+.3*(i-1),.3+.3*(i-1)),tex(src,560,110+i*150,{size:46}));
   if(i>0)s+=fade(seg(p,.1+.3*(i-1),.3+.3*(i-1)),label('× ω',1080,110+i*150-60,{size:28,color:CW,weight:700})+arrow(1060,110+(i-1)*150+10,1060,110+i*150-40,{color:CW,w:3,head:12}));});
  return s;
 },
 [K+'sum3']:(p)=>{
  const {cx,cy,R}=UC,th=.9;
  let s=circ(cx,cy,R,th,{one:'1'});
  s+=draw(Array.from({length:41},(_,i)=>P(cx,cy,R,th*i/40)),1,{color:CU,w:8});
  s+=card(640,110,520,260,label('角度 ＝ 弧の長さ（ラジアン）',900,175,{size:30,color:CU,anchor:'middle',weight:700})
   +label('点は 角度と同じだけ 進む',900,245,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),label('→ sin の傾き ＝ cos',900,315,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'next']:(p)=>{
  const cx=250,cy=400,R=330,th=.3,[px,py]=P(cx,cy,R,th);
  let s=line(cx,cy,cx+R+30,cy,{color:C.faint,w:2})+draw(Array.from({length:41},(_,i)=>P(cx,cy,R,.5*i/40)),1,{color:C.dim,w:3});
  s+=line(cx,cy,px,py,{color:C.ink,w:3})+draw(Array.from({length:21},(_,i)=>P(cx,cy,R,th*i/20)),1,{color:CU,w:7})+line(px,cy,px,py,{color:C.x,w:6})+dot(px,py,9,C.hi);
  s+=label('弧 θ',px+18,(py+cy)/2-10,{size:24,color:CU})+label('sin θ',px-12,(py+cy)/2+30,{size:24,color:C.x,anchor:'end'});
  s+=card(640,90,520,280,label('次の問い',900,140,{size:26,color:C.dim,anchor:'middle'})
   +label('なぜ ラジアンで 測る？',900,210,{size:34,color:C.hi,anchor:'middle',weight:700})
   +label('小さな角で sin θ は',900,275,{size:30,color:C.ink,anchor:'middle'})
   +label('θ に どれくらい近い？',900,325,{size:30,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
};
