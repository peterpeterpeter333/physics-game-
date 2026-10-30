// 単元8 重心と慣性モーメント (rigid1) — pictures. Viewbox 1200×515.
// Colours: distance / r² areas C.x, speed and ω C.v, energy C.E, twist (torque) C.F, emphasis C.hi.
import {C,clamp,mix,smooth,seg,lin,fmt,fade,label,line,rect,dot,ring,draw,poly,arrow,highlight,tex} from './anim.mjs';

const TAU=2*Math.PI;
const W8='#d8e2f2';// weights (mass) — neutral ink
const at=ctx=>(ctx?.scene?.captions?.[ctx.k]?.start??0)+(ctx?.t??0);// absolute time, continuous across cues
const n2=v=>Number(v.toFixed(2));

// Curved arrow along a circle of radius r around (cx,cy), from angle a0 to a1 (screen angles).
function curved(cx,cy,r,a0,a1,{color=C.F,w=5,g=1,head=16}={}){
 if(g<=0.01)return '';
 const a=mix(a0,a1,g),N=40,pts=Array.from({length:N+1},(_,i)=>{const u=mix(a0,a,i/N);return [cx+r*Math.cos(u),cy+r*Math.sin(u)];});
 const dir=Math.sign(a1-a0)||1,tx=-Math.sin(a)*dir,ty=Math.cos(a)*dir,ex=cx+r*Math.cos(a),ey=cy+r*Math.sin(a);
 const bx=ex-tx*head,by=ey-ty*head,nx=-ty,ny=tx;
 return draw(pts.slice(0,-2),1,{color,w})+`<polygon points="${n2(ex+tx*2)},${n2(ey+ty*2)} ${n2(bx+nx*head*.55)},${n2(by+ny*head*.55)} ${n2(bx-nx*head*.55)},${n2(by-ny*head*.55)}" fill="${color}"/>`;
}
// Dumbbell: light rod through the axle, two equal weights at distance r (px) from the axle.
function dumbbell(cx,cy,r,th,{rod=160,wr=20,tag=''}={}){
 const c=Math.cos(th),s=Math.sin(th);
 return line(cx-rod*c,cy-rod*s,cx+rod*c,cy+rod*s,{color:'#6b7a96',w:6})
  +[1,-1].map(k=>`<circle cx="${n2(cx+k*r*c)}" cy="${n2(cy+k*r*s)}" r="${wr}" fill="${W8}" fill-opacity=".85" stroke="${C.ink}" stroke-width="2"/>`+(tag?label(tag,cx+k*r*c,cy+k*r*s+7,{size:18,color:C.bg,anchor:'middle',weight:700}):'')).join('')
  +ring(cx,cy,9,{color:C.ink,w:3,fill:C.bg});
}
// Tangential velocity arrow of the weight at +r (and -r) for rotation direction +th.
function spinArrows(cx,cy,r,th,len,{color=C.v,text='',g=1}={}){
 let s='';
 [1,-1].forEach(k=>{const px=cx+k*r*Math.cos(th),py=cy+k*r*Math.sin(th),tx=-k*Math.sin(th),ty=k*Math.cos(th);
  s+=arrow(px,py,px+tx*len,py+ty*len,{color,w:5,head:14,g});
  if(text&&k===1)s+=fade(g,label(text,px+tx*len+tx*20+(tx>0?8:-8),py+ty*len+ty*22+8,{size:24,color,anchor:tx>0?'start':'end'}));});
 return s;
}

// ---------------------------------------------------------------- intro
const RL={cx:300,cy:250,r:70},RR={cx:880,cy:250,r:140};
function raceScene(thL,thR,{twist=1,counters=true}={}){
 let s='';
 for(const [D,th] of [[RL,thL],[RR,thR]]){
  s+=ring(D.cx,D.cy,D.r,{color:C.faint,w:2,dash:'6 8'})+dumbbell(D.cx,D.cy,D.r,th);
  s+=fade(twist,curved(D.cx,D.cy,44,-2.6,-0.5,{color:C.F,w:5,g:1,head:14}));
 }
 s+=fade(twist,label('同じひねり',RL.cx,RL.cy-72,{size:22,color:C.F,anchor:'middle'})+label('同じひねり',RR.cx,RR.cy-72,{size:22,color:C.F,anchor:'middle'}));
 if(counters)[[RL,thL],[RR,thR]].forEach(([D,th])=>{s+=label(`${fmt(th/TAU,2)} 回転`,D.cx,485,{size:30,color:C.t,anchor:'middle',weight:700});});
 return s;
}
function distTags(g){
 return fade(g,line(RL.cx,RL.cy+34,RL.cx+RL.r,RL.cy+34,{color:C.x,w:3})+label('0.5 m',RL.cx+RL.r/2,RL.cy+64,{size:24,color:C.x,anchor:'middle'})
  +line(RR.cx,RR.cy+34,RR.cx+RR.r,RR.cy+34,{color:C.x,w:3})+label('1 m',RR.cx+RR.r/2,RR.cy+64,{size:24,color:C.x,anchor:'middle'}))
  +fade(g,label('内側に付けた（1 kg × 2）',RL.cx,437,{size:24,color:C.dim,anchor:'middle'})+label('外側に付けた（1 kg × 2）',RR.cx,437,{size:24,color:C.dim,anchor:'middle'}));
}
const raceAngle=u=>TAU*u*u;// inner: one turn at u=1; outer turns a quarter as fast (I is 4×)

// ---------------------------------------------------------------- middle / advanced: rod split into pieces with x² columns
const ROD={x0:200,x1:1000,base:390,hs:1000,y:425};
const RX=x=>600+800*x;// x in metres (rod length 1 m)
function rodColumns(N,{g=1,curve=0,hiIdx=-1,grow=1,col=C.x}={}){
 let s='';
 for(let i=0;i<N;i++){
  const xm=-.5+(i+.5)/N,w=800/N,h=ROD.hs*xm*xm;
  const order=Math.abs(xm)/.5,gi=clamp((grow-order*.6)/.4);
  if(gi<=0)continue;
  s+=fade(g,rect(RX(xm)-w/2+.5,ROD.base-h*gi,w-1,h*gi,{fill:i===hiIdx?C.hi:col,fo:i===hiIdx?.55:.3,rx:0,sw:N>40?0:1.2}));
 }
 if(curve>0)s+=draw(Array.from({length:121},(_,i)=>{const x=-.5+i/120;return [RX(x),ROD.base-ROD.hs*x*x];}),curve,{color:C.hi,w:4});
 return s;
}
function rodBar(N,{g=1,axis=600,cuts=true}={}){
 let s=rect(ROD.x0,ROD.y-12,ROD.x1-ROD.x0,24,{fill:'#8aa0c4',fo:.35,rx:4,sw:2});
 if(cuts)for(let i=1;i<N&&N<=40;i++)s+=line(RX(-.5+i/N),ROD.y-12,RX(-.5+i/N),ROD.y+12,{color:C.bg,w:2});
 s+=line(axis,70,axis,475,{color:C.dim,w:2.5,dash:'8 7'})+dot(axis,ROD.y,8,C.ink)+label('軸',axis+12,96,{size:24,color:C.dim});
 return fade(g,s);
}
const midSum=N=>{let s=0;for(let i=0;i<N;i++){const x=-.5+(i+.5)/N;s+=x*x/N;}return s;};

export const rigid1Diagrams={
 // ---------- intro scene 1: which dumbbell turns first?
 'r1-race':(p)=>raceScene(0,0,{twist:seg(p,.3,.6)})+distTags(seg(p,.05,.35))
  +fade(seg(p,.55,.85),label('同じ力でひねると、先に1回転するのは？',600,40,{size:30,color:C.hi,anchor:'middle',weight:700})),
 'r1-race:run':(p)=>{const u=lin(p,.05,.8),th=raceAngle(u);
  return raceScene(th,th/4)+fade(seg(p,.82,.95),label('内側が先に1回転！',RL.cx,40,{size:30,color:C.hi,anchor:'middle',weight:700})+label('外側はまだ 4分の1',RR.cx,40,{size:30,color:C.dim,anchor:'middle'}));},
 'r1-race:same':(p)=>{
  let s=raceScene(TAU,TAU/4,{twist:1-seg(p,0,.2),counters:false})+distTags(1);
  s+=fade(seg(p,.1,.35),label('おもり合計 2 kg',RL.cx,40,{size:28,color:C.ink,anchor:'middle'})+label('おもり合計 2 kg',RR.cx,40,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),label('＝',590,52,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s+fade(seg(p,.55,.85),highlight(250,452,700,56,1)+label('違うのは、軸からの距離だけ',600,491,{size:30,color:C.hi,anchor:'middle',weight:700}));
 },
 // ---------- intro scene 2: same ω, speeds rω, energies ×4
 'r1-omega':(p,ctx)=>omegaScene(p,ctx,1),
 'r1-omega:v':(p,ctx)=>omegaScene(p,ctx,2),
 'r1-omega:E':(p,ctx)=>omegaScene(p,ctx,3),
 // ---------- intro scene 3: I as the total of m r² squares
 'r1-I':(p)=>squaresScene(p),
 'r1-I:end':(p,ctx)=>{
  const T=at(ctx);let s='';
  s+=rect(90,40,470,170,{fill:C.x,fo:.06,stroke:C.dim,rx:14})+rect(640,40,470,170,{fill:C.x,fo:.06,stroke:C.x,rx:14});
  s+=label('動かしにくさ',325,85,{size:26,color:C.dim,anchor:'middle'})+tex('m',325,160,{size:52});
  s+=label('回しにくさ',875,85,{size:26,color:C.x,anchor:'middle'})+tex('I=\\sum mr^2',875,160,{size:48});
  s+=arrow(570,125,630,125,{color:C.hi,w:4,head:14,g:seg(p,0,.25)});
  const g=seg(p,.3,.55);
  // replay: the same twist, inner turns 4× faster
  const th=.9*T;
  s+=fade(g,ring(300,370,55,{color:C.faint,w:2,dash:'5 7'})+dumbbell(300,370,55,th,{rod:110,wr:15})+ring(820,370,110,{color:C.faint,w:2,dash:'5 7'})+dumbbell(820,370,110,th/4,{rod:120,wr:15}));
  s+=fade(g,tex('I=0.5',470,355,{size:34,anchor:'start'})+tex('I=2',970,355,{size:34,anchor:'start'}));
  s+=fade(seg(p,.55,.8),label('回転の速まり方 4倍',470,405,{size:24,color:C.v})+label('4倍回しにくい',970,405,{size:24,color:C.hi}));
  return s;
 },
 // ---------- middle scene 1: the square hidden in v²
 'r1m-sq:v':(p,ctx)=>sqScene(p,ctx,1),
 'r1m-sq:sq':(p,ctx)=>sqScene(p,ctx,2),
 // ---------- middle scene 2: every particle shares ω
 'r1m-body':(p,ctx)=>{
  const T=at(ctx),th=.45*T,cx=330,cy=260;let s='';
  const blob=Array.from({length:60},(_,i)=>{const a=TAU*i/60,rr=175+22*Math.sin(3*a+.6)+12*Math.cos(5*a);return [cx+rr*Math.cos(a+th),cy+rr*Math.sin(a+th)];});
  s+=poly(blob,{fill:'#8aa0c4',fo:.14,stroke:'#8aa0c4',sw:2});
  const P=[[40,.3],[80,1.4],[120,2.4],[150,.9],[100,3.6],[140,4.4],[60,5.1],[160,5.8],[110,-.4],[30,2.9]];
  const g=seg(p,.25,.6);
  P.forEach(([r,a])=>{const x=cx+r*Math.cos(a+th),y=cy+r*Math.sin(a+th);
   s+=line(cx,cy,x,y,{color:C.faint,w:1.5})+dot(x,y,9,W8);
   s+=arrow(x,y,x-Math.sin(a+th)*r*.55,y+Math.cos(a+th)*r*.55,{color:C.v,w:4,head:12,g});});
  s+=ring(cx,cy,8,{color:C.ink,w:3,fill:C.bg});
  s+=fade(seg(p,.05,.3),label('剛体：形の変わらない物体',640,120,{size:28,color:C.ink}));
  s+=fade(g,label('速さはばらばら（ r ω ）',640,200,{size:28,color:C.v}));
  s+=fade(seg(p,.6,.85),highlight(625,250,520,80,1)+label('でも ω は全員共通',650,302,{size:32,color:C.hi,weight:700}));
  return s;
 },
 // ---------- middle scene 3: Σ over pieces → ∫
 'r1m-rod:8':(p)=>{
  let s=rodBar(8,{g:seg(p,0,.2)})+rodColumns(8,{grow:mix(0,1.6,seg(p,.2,.75)),hiIdx:seg(p,.75,.9)>0?7:-1});
  s+=fade(seg(p,.15,.35),label('棒を 8 つに切る',230,60,{size:26,color:C.ink}));
  const g=seg(p,.72,.95),xm=.4375;
  s+=fade(g,line(RX(xm),ROD.base-ROD.hs*xm*xm-8,RX(xm),ROD.base-ROD.hs*xm*xm-60,{color:C.hi,w:2})+tex('x^2',RX(xm)+14,ROD.base-ROD.hs*xm*xm-60,{size:34,anchor:'start'})
   +line(600,ROD.y+30,RX(xm),ROD.y+30,{color:C.x,w:3})+tex('x',(600+RX(xm))/2,ROD.y+66,{size:32}));
  return s+fade(seg(p,.4,.7),label('柱の高さ ＝ 軸からの距離の2乗',230,105,{size:24,color:C.x}));
 },
 'r1m-rod:fine':(p)=>{
  const k=Math.min(3,Math.floor(lin(p,0,1)*4)),N=[16,32,64,200][k];
  let s=rodBar(N,{cuts:N<=32})+rodColumns(N,{sw:0,curve:k===3?seg(p,.75,.95):0});
  const val=k===3?'0.0833':fmt(midSum(N),4).padEnd(6,'0');
  s+=label(k===3?'限りなく細かく：':`${N} 等分：`,590,500,{size:26,color:C.ink,anchor:'end'})+label(`足した値 ${val}`,600,500,{size:28,color:C.hi,weight:700});
  s+=label('8 等分：0.0820',230,50,{size:24,color:C.dim});
  return s+label('質量 1 kg・長さ 1 m の棒',230,90,{size:22,color:C.dim});
 },
 // ---------- advanced scene 1: rod about its centre
 'r1a-bat':(p)=>{
  const th=mix(0,.45,seg(p,.4,1)),cx=600,cy=250;
  let s='';
  const bat=[[-300,-7],[-110,-9],[120,-22],[300,-26],[300,26],[120,22],[-110,9],[-300,7]];
  const rot=(q,a)=>[cx+q[0]*Math.cos(a)-q[1]*Math.sin(a),cy+q[0]*Math.sin(a)+q[1]*Math.cos(a)];
  const gb=1-seg(p,.15,.35),gr=seg(p,.15,.35),a=th;
  s+=fade(gb,poly(bat.map(q=>rot(q,0)),{fill:'#c9a26b',fo:.55,stroke:'#c9a26b'}))+fade(gb,label('バット',cx,cy+80,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(gr,poly([[-300,-12],[300,-12],[300,12],[-300,12]].map(q=>rot(q,a)),{fill:'#8aa0c4',fo:.35,stroke:'#8aa0c4'})+ring(cx,cy,9,{color:C.ink,w:3,fill:C.bg}));
  s+=fade(seg(p,.3,.5),curved(cx,cy,70,-2.4,-.7,{color:C.F,w:4,head:14})+label('真ん中が軸',cx,60,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.4,.65),label('長さ',150,480,{size:26,color:C.dim})+tex('l',215,480,{size:34})+label('質量',300,480,{size:26,color:C.dim})+tex('M',375,480,{size:34})+label('一様：どこでも同じ太さと重さ',480,480,{size:24,color:C.dim}));
  return s;
 },
 'r1a-check':(p)=>{
  let s=rodBar(10)+rodColumns(10,{grow:mix(0,1.6,seg(p,0,.45)),curve:seg(p,.45,.7)});
  s+=fade(seg(p,.3,.55),label('10 個に分けて足す：',590,500,{size:26,color:C.ink,anchor:'end'})+label('0.0825',600,500,{size:30,color:C.x,weight:700}));
  s+=fade(seg(p,.6,.85),label('積分の答え',720,500,{size:26,color:C.hi})+tex('\\tfrac{1}{12}\\approx0.0833',870,494,{size:32,anchor:'start'}));
  return s+label('質量 1 kg・長さ 1 m',200,60,{size:22,color:C.dim});
 },
 // ---------- advanced scene 2: move the axis to the end; (x + l/2)² as a square
 'r1a-end:move':(p)=>{
  const ax=mix(600,200,seg(p,.05,.35));let s=rodBar(1,{axis:ax,cuts:false});
  const xp=800,g=seg(p,.4,.6);
  s+=fade(g,rect(xp-18,ROD.y-14,36,28,{fill:C.hi,fo:.6,rx:3,sw:2}));
  s+=fade(seg(p,.1,.35),dot(600,ROD.y,7,C.dim)+label('中心',600,ROD.y-30,{size:22,color:C.dim,anchor:'middle'}));
  const gb=seg(p,.55,.8);
  s+=fade(gb,line(200,ROD.y+40,600,ROD.y+40,{color:C.t,w:4})+tex('\\dfrac{l}{2}',400,ROD.y+70,{size:30})+line(600,ROD.y+40,800,ROD.y+40,{color:C.x,w:4})+tex('x',700,ROD.y+76,{size:32}));
  s+=fade(seg(p,.75,.95),line(200,ROD.y-80,800,ROD.y-80,{color:C.hi,w:3})+line(200,ROD.y-90,200,ROD.y-70,{color:C.hi,w:3})+line(800,ROD.y-90,800,ROD.y-70,{color:C.hi,w:3})+tex('x+\\dfrac{l}{2}',500,ROD.y-118,{size:36}));
  return s+fade(seg(p,.1,.35),label('軸を端へ',200,60,{size:26,color:C.ink}));
 },
 'r1a-end:sq':(p)=>endSquares(p,1),
 'r1a-end:cancel':(p)=>endSquares(p,2),
 // ---------- advanced scene 3: any shape
 'r1a-gen':(p)=>{
  const cx=640,cy=250;let s='';
  const blob=Array.from({length:60},(_,i)=>{const a=TAU*i/60,rr=150+30*Math.sin(2*a+1)+14*Math.cos(3*a);return [cx+rr*Math.cos(a)*1.25,cy+rr*Math.sin(a)*.85];});
  s+=poly(blob,{fill:'#8aa0c4',fo:.14,stroke:'#8aa0c4',sw:2});
  s+=line(cx,60,cx,450,{color:C.dim,w:2,dash:'6 7'})+dot(cx,cy,9,C.hi)+label('G',cx+14,cy-12,{size:26,color:C.hi,weight:700});
  const P=[[-170,-40,1.2],[-90,60,1],[-40,-80,.8],[60,90,1],[110,-30,1.3],[190,40,.7]];
  const g=seg(p,.15,.5);
  P.forEach(([dx,dy,m])=>{const x=cx+dx,y=cy+dy;s+=dot(x,y,7+5*m,W8);s+=arrow(cx,y,x,y,{color:dx<0?'#6aa8ff':C.a,w:4,head:10,g});});
  s+=fade(seg(p,.4,.65),label('左：マイナス',470,110,{size:24,color:'#6aa8ff',anchor:'middle'})+label('右：プラス',810,110,{size:24,color:C.a,anchor:'middle'}));
  const ga=seg(p,.55,.8),ax=cx-mix(0,360,seg(p,.7,.95));
  s+=fade(ga,highlight(880,380,300,80,1)+tex('\\sum m\\,x=0',1030,428,{size:40}));
  s+=fade(seg(p,.7,.95),line(ax,80,ax,460,{color:C.F,w:3})+label('新しい軸',ax,495,{size:24,color:C.F,anchor:'middle'})+line(ax,440,cx,440,{color:C.t,w:3})+tex('d',(ax+cx)/2,475,{size:32}));
  return s+fade(seg(p,0,.2),label('重心 G は、左右の「質量 × 距離」がつり合う点',40,40,{size:26,color:C.ink}));
 },
 'r1a-gen:bat':(p)=>{
  const base=440,u=80;let s='';
  const bar=(x,h,col,g)=>rect(x,base-h*g,140,h*g,{fill:col,fo:.45,rx:4});
  s+=bar(220,u,C.x,seg(p,0,.25))+fade(seg(p,.1,.3),tex('\\tfrac{1}{12}Ml^2',290,base-u-30,{size:32}));
  s+=bar(700,u,C.x,seg(p,.25,.45))+rect(700,base-u-3*u*seg(p,.45,.7),140,3*u*seg(p,.45,.7),{fill:C.E,fo:.45,rx:4});
  s+=fade(seg(p,.3,.5),label('重心まわり',860,base-u/2+8,{size:24,color:C.x}))+fade(seg(p,.55,.75),label('重心ごと振り回す分',860,base-2.5*u+8,{size:24,color:C.E})+tex('M\\left(\\tfrac{l}{2}\\right)^2',870,base-1.5*u+8,{size:30,anchor:'start'}));
  s+=fade(seg(p,.7,.9),tex('\\tfrac{1}{3}Ml^2',770,base-4*u-34,{size:34})+label('4倍',540,base-2*u,{size:44,color:C.hi,anchor:'middle',weight:700})+arrow(400,base-u/2,680,base-3*u,{color:C.hi,w:3,head:14}));
  // tiny rods showing where the axis is
  s+=rect(200,base+22,180,12,{fill:'#8aa0c4',fo:.4,rx:3})+dot(290,base+28,6,C.ink)+label('真ん中で持つ',290,base+62,{size:22,color:C.dim,anchor:'middle'});
  s+=rect(680,base+22,180,12,{fill:'#8aa0c4',fo:.4,rx:3})+dot(680,base+28,6,C.ink)+label('端で持つ',770,base+62,{size:22,color:C.dim,anchor:'middle'});
  return s;
 },
 // ---------- followups-5: disc → rings; sphere → coins
 'r1f-disc:rings':(p)=>discScene(p,1),
 'r1f-disc:cut':(p)=>discScene(p,2),
 'r1f-check':(p)=>{
  const A={x:560,base:430,w:560,h:330};let s='';
  // disc with 10 rings on the left
  for(let i=10;i>=1;i--){s+=`<circle cx="270" cy="250" r="${i*18}" fill="${i%2?C.x:'#4fb8d6'}" fill-opacity="${.12+.03*i}" stroke="${C.bg}" stroke-width="1.5"/>`;}
  s+=label('10 本の輪',270,480,{size:24,color:C.dim,anchor:'middle'});
  s+=line(A.x,A.base,A.x+A.w,A.base,{color:C.dim,w:2.5})+label('中心',A.x+20,A.base+32,{size:22,color:C.dim,anchor:'middle'})+label('縁',A.x+A.w-20,A.base+32,{size:22,color:C.dim,anchor:'middle'});
  let sum=0;
  for(let i=1;i<=10;i++){const r=(i-.5)/10,c=r*r*2*r*.1;const g=seg(p,.05+i*.045,.12+i*.045);if(g<=0)continue;sum+=c*(g>=1?1:0);
   const h=A.h*c/.2;s+=rect(A.x+(i-1)*A.w/10+6,A.base-h*g,A.w/10-12,h*g,{fill:C.x,fo:.4,rx:2,sw:1});}
  s+=fade(seg(p,.05,.25),label('輪ごとの「質量 × 半径²」',A.x,70,{size:26,color:C.ink}));
  s+=fade(seg(p,.62,.8),label('外側の輪ほど大きい',A.x,110,{size:24,color:C.x}));
  s+=fade(seg(p,.7,.9),rect(580,150,300,110,{fill:C.hi,fo:.08,stroke:C.hi,rx:12})+label('合計 0.4975',730,195,{size:30,color:C.hi,anchor:'middle',weight:700})+label('積分の答え 0.5',730,242,{size:24,color:C.dim,anchor:'middle'}));
  return s+label('質量 1・半径 1',270,40,{size:22,color:C.dim,anchor:'middle'});
 },
 'r1f-sph':(p)=>sphereScene(p,1),
 'r1f-sph:tri':(p)=>sphereScene(p,2),
 'r1f-cmp':(p)=>{
  const base=420,u=300;let s='';
  const items=[['輪',1,'1'],['円板',.5,'\\tfrac12'],['球',.4,'\\tfrac25']];
  items.forEach(([name,k,tx],i)=>{const x=240+i*330,g=seg(p,i*.15,i*.15+.25);
   // icon
   const ix=x,iy=base+50;
   if(i===0)s+=ring(ix-80,iy-8,22,{color:C.x,w:6});
   if(i===1)s+=`<circle cx="${ix-80}" cy="${iy-8}" r="22" fill="${C.x}" fill-opacity=".45" stroke="${C.x}" stroke-width="2"/>`;
   if(i===2)s+=`<circle cx="${ix-80}" cy="${iy-8}" r="22" fill="${C.x}" fill-opacity=".3" stroke="${C.x}" stroke-width="2"/><ellipse cx="${ix-80}" cy="${iy-8}" rx="22" ry="7" fill="none" stroke="${C.x}" stroke-width="1.5"/>`;
   s+=label(name,ix-45,iy,{size:26,color:C.ink});
   s+=rect(x-50,base-u*k*g,120,u*k*g,{fill:C.x,fo:.4,rx:4});
   s+=fade(g,tex(tx,x+10,base-u*k-34,{size:40}));});
  s+=fade(seg(p,.4,.6),label('I ＝ 係数 × M R²',620,50,{size:28,color:C.ink,anchor:'middle'}));
  return s+fade(seg(p,.65,.9),label('質量が軸の近くにあるほど、係数は小さい',620,100,{size:28,color:C.hi,anchor:'middle',weight:700}));
 },
};

function omegaScene(p,ctx,stage){
 const T=at(ctx),th=.8*T,L={cx:250,cy:250,r:70},R={cx:760,cy:250,r:140};let s='';
 for(const D of [L,R])s+=ring(D.cx,D.cy,D.r,{color:C.faint,w:2,dash:'6 8'})+dumbbell(D.cx,D.cy,D.r,th);
 s+=label('同じ角速度 ω で回す',510,40,{size:28,color:C.v,anchor:'middle'});
 if(stage===1)s+=fade(seg(p,.35,.7),label('ω：1秒あたりに回る角度',510,475,{size:26,color:C.ink,anchor:'middle'}));
 if(stage>=2){
  const g=stage===2?seg(p,.1,.4):1;
  s+=spinArrows(L.cx,L.cy,L.r,th,55,{g,text:'1 m/s'})+spinArrows(R.cx,R.cy,R.r,th,110,{g,text:'2 m/s'});
  const gl=stage===2?seg(p,.4,.7):1;
  s+=fade(gl,label('1周 3.14 m',L.cx,470,{size:24,color:C.x,anchor:'middle'})+label('1周 6.28 m',R.cx,470,{size:24,color:C.x,anchor:'middle'}));
  s+=fade(stage===2?seg(p,.7,.95):1,label('速さ ＝ r ω',510,90,{size:26,color:C.hi,anchor:'middle'}));
 }
 if(stage===3){
  const base=455,k=80;
  const bars=[[470,[.5,.5],'1 J'],[1000,[2,2],'4 J']];
  bars.forEach(([x,parts,txt],j)=>{let y=base;parts.forEach((e,i)=>{const g=seg(p,.05+j*.25+i*.1,.2+j*.25+i*.1),h=e*k*g;s+=rect(x,y-h,70,h,{fill:C.E,fo:.45,rx:2,sw:1.5});y-=e*k;});
   s+=fade(seg(p,.25+j*.25,.4+j*.25),label(txt,x+35,base-parts.reduce((a,b)=>a+b)*k-14,{size:26,color:C.E,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.05,.2),label('運動エネルギー',1035,base+34,{size:22,color:C.E,anchor:'middle'})+label('運動エネルギー',505,base+34,{size:22,color:C.E,anchor:'middle'}));
  s+=fade(seg(p,.75,.95),label('4倍',1100,200,{size:44,color:C.hi,anchor:'middle',weight:700}));
 }
 return s;
}

function squaresScene(p){
 const cy=140,Lc=270,Rc=820,S1=70,S2=140;let s='';
 s+=dumbbell(Lc,cy,70,0)+dumbbell(Rc,cy,140,0);
 const grow=seg(p,.05,.35),gather=seg(p,.4,.7);
 const sq=(x0,y0,x1,y1,side,col)=>{const x=mix(x0,x1,gather),y=mix(y0,y1,gather),w=side*grow;return rect(x,y,w,w,{fill:col,fo:.35,rx:2,sw:2})+fade(seg(p,.25,.4),label(side===S1?'0.25':'1',x+w/2,y+w/2+9,{size:24,color:C.ink,anchor:'middle'}));};
 // squares hang under each weight, then gather into one pile per dumbbell
 s+=sq(Lc-70-S1/2,cy+28,Lc-S1,300,S1,C.x)+sq(Lc+70-S1/2,cy+28,Lc,300,S1,C.x);
 s+=sq(Rc-140-S2/2,cy+28,Rc-S2,230,S2,C.x)+sq(Rc+140-S2/2,cy+28,Rc,230,S2,C.x);
 s+=fade(seg(p,.1,.3),label('1 × 0.5² ＝ 0.25',Lc,cy-50,{size:24,color:C.x,anchor:'middle'})+label('1 × 1² ＝ 1',Rc,cy-50,{size:24,color:C.x,anchor:'middle'}));
 s+=fade(seg(p,.7,.9),tex('I=0.5',Lc,420,{size:40})+tex('I=2',Rc,420,{size:40})+label('4倍',545,330,{size:44,color:C.hi,anchor:'middle',weight:700}));
 return s+fade(seg(p,.1,.3),label('質量 × 距離² を、正方形の面積で',600,40,{size:28,color:C.ink,anchor:'middle'}));
}

function sqScene(p,ctx,stage){
 const cx=150,cy=280,th=-.7+.07*at(ctx);let s='';
 const c=Math.cos(th),sn=Math.sin(th),r1=110,r2=220;
 s+=line(cx,cy,cx+260*c,cy+260*sn,{color:'#6b7a96',w:6})+ring(cx,cy,9,{color:C.ink,w:3,fill:C.bg});
 [[r1,70,'v'],[r2,140,'2v']].forEach(([r,len,t])=>{const x=cx+r*c,y=cy+r*sn;s+=dot(x,y,16,W8)+arrow(x,y,x-sn*len,y+c*len,{color:C.v,w:5,head:14})+tex(t,x-sn*len+26,y+c*len+14,{size:30,anchor:'start'});});
 s+=fade(seg(p,.1,.35),tex('r',cx+r1*c/2+10,cy+r1*sn/2-18,{size:28})+tex('2r',cx+(r1+r2)*c/2+10,cy+(r1+r2)*sn/2-22,{size:28}));
 s+=fade(stage===1?seg(p,.5,.8):1,label('同じ ω で回ると、速さは2倍',640,60,{size:28,color:C.v,anchor:'middle'}));
 if(stage===2){
  const g=seg(p,.1,.55),base=440;
  [[560,70,'v^2','1'],[760,140,'(2v)^2','4']].forEach(([x,side,t,num],i)=>{
   const gi=seg(p,.1+i*.2,.45+i*.2);
   s+=line(x,base,x+side,base,{color:C.v,w:5})+rect(x,base-side*gi,side,side*gi,{fill:C.E,fo:.35,rx:0,sw:2});
   s+=fade(gi,tex(t,x+side/2,base+44,{size:32})+label(num,x+side/2,base-side/2+10,{size:30,color:C.ink,anchor:'middle',weight:700}));
   for(let k=1;k<side/70;k++)s+=fade(gi,line(x+70*k,base,x+70*k,base-side,{color:C.bg,w:2})+line(x,base-70*k,x+side,base-70*k,{color:C.bg,w:2}));
  });
  s+=fade(seg(p,.7,.95),label('運動エネルギーは 4倍',1170,215,{size:28,color:C.E,anchor:'end'}));
  s+=fade(g,label('速さを1辺とする正方形',840,140,{size:24,color:C.dim,anchor:'middle'}));
 }
 return s;
}

// (l/2 + x)² for the piece at +x and (l/2 − x)² for its partner at −x.
function endSquares(p,stage){
 const a=200,b=70,y0=130;let s='';
 const A=100,B=720;// left edges
 const gin=stage===1?seg(p,0,.4):1,cancel=stage===2?seg(p,.15,.6):0,after=stage===2?seg(p,.6,.85):0;
 // +x : side a+b = a² + 2ab + b²
 s+=label('＋x の片',A+(a+b)/2,y0-92,{size:24,color:C.a,anchor:'middle'})+tex('\\left(\\frac{l}{2}+x\\right)^2',A+(a+b)/2,y0-30,{size:34});
 s+=fade(gin,rect(A,y0,a,a,{fill:'#8aa0c4',fo:.25,rx:0})+tex('\\left(\\frac{l}{2}\\right)^2',A+a/2,y0+a/2+8,{size:34}));
 const redA=1-cancel;
 const strips=(x,y,w,h,col,sign,g)=>fade(g,rect(x,y,w,h,{fill:col,fo:.45,rx:0})+label(sign,x+w/2,y+h/2+10,{size:28,color:C.ink,anchor:'middle',weight:700}));
 s+=strips(A+a,y0,b,a,C.a,'＋',gin*redA)+strips(A,y0+a,a,b,C.a,'＋',gin*redA);
 s+=fade(gin,rect(A+a,y0+a,b,b,{fill:C.x,fo:.5,rx:0})+tex('x^2',A+a+b/2,y0+a+b/2+8,{size:26}));
 // −x : side a−b drawn inside a²: a² − 2ab + b²
 s+=label('−x の片',B+a/2,y0-92,{size:24,color:'#6aa8ff',anchor:'middle'})+tex('\\left(\\frac{l}{2}-x\\right)^2',B+a/2,y0-30,{size:34});
 s+=fade(gin,rect(B,y0,a,a,{fill:'#8aa0c4',fo:.25,rx:0})+tex('\\left(\\frac{l}{2}\\right)^2',B+(a-b)/2,y0+(a-b)/2+8,{size:34}));
 const blueA=1-cancel;
 s+=strips(B+a-b,y0,b,a,'#6aa8ff','−',gin*blueA)+strips(B,y0+a-b,a,b,'#6aa8ff','−',gin*blueA);
 s+=fade(gin,rect(B+a-b,y0+a-b,b,b,{fill:C.x,fo:.5,rx:0})+tex('x^2',B+a-b/2,y0+a-b/2+8,{size:26}));
 if(stage===1)s+=fade(seg(p,.55,.85),label('(l/2) × x の長方形が 2つ',600,480,{size:26,color:C.ink,anchor:'middle'}));
 if(stage===2){
  // the + strips and − strips fly to the middle and annihilate
  const fly=(x,y,col,dx)=>fade(cancel*(1-after),rect(mix(x,560+dx,cancel),mix(y,300,cancel),b,a*.6,{fill:col,fo:.5,rx:0}));
  s+=fly(A+a,y0,C.a,-30)+fly(B+a-b,y0,'#6aa8ff',30);
  s+=fade(after,label('＋ と − が打ち消し合って 0',600,480,{size:30,color:C.hi,anchor:'middle',weight:700}));
 }
 return s;
}

// Disc of radius R split into rings; one ring (radius r, width dr) is cut and unrolled into a 2πr × dr strip.
function discScene(p,stage){
 const cx=280,cy=260,R=200,N=10,dr=R/N;let s='';
 const ringsG=stage===1?seg(p,.2,.55):1;
 s+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.x}" fill-opacity="${.3*(1-ringsG)}" stroke="${C.x}" stroke-width="2"/>`;
 for(let i=N;i>=1;i--)s+=fade(ringsG,`<circle cx="${cx}" cy="${cy}" r="${n2(i*dr-dr/2)}" fill="none" stroke="${i%2?C.x:'#4fb8d6'}" stroke-opacity=".55" stroke-width="${dr-3}"/>`);
 s+=dot(cx,cy,6,C.ink);
 s+=fade(stage===1?seg(p,.05,.25):1,line(cx,cy,cx+R,cy,{color:C.t,w:2.5,dash:'6 5'})+tex('R',cx+R+22,cy+10,{size:32}));
 const ri=4.5*dr;// the highlighted ring, radius r = 90 px
 if(stage===1){
  const g=seg(p,.55,.85);
  s+=fade(g,`<circle cx="${cx}" cy="${cy}" r="${ri}" fill="none" stroke="${C.hi}" stroke-width="${dr-2}" stroke-opacity=".9"/>`+line(cx,cy,cx-ri*.7,cy-ri*.7,{color:C.hi,w:3})+tex('r',cx-ri*.35-18,cy-ri*.35-4,{size:32}));
  s+=fade(g,label('輪の半径',640,160,{size:26,color:C.hi})+tex('r',770,160,{size:34,anchor:'start'})+label('輪の幅',640,230,{size:26,color:C.hi})+tex('dr',740,230,{size:34,anchor:'start'})+label('円板全体の半径',640,300,{size:26,color:C.t})+tex('R',840,300,{size:34,anchor:'start'}));
  s+=fade(seg(p,.05,.25),label('円板 → 細い輪の集まり',640,80,{size:28,color:C.ink}));
  return s;
 }
 // stage 2: unroll the ring into a strip of length 2πr
 const u=seg(p,.1,.6),L=TAU*ri,sx=560,sy=400,M=90;
 const pts=Array.from({length:M+1},(_,i)=>{const f=i/M,ang=-Math.PI/2+TAU*f;const c=[cx+ri*Math.cos(ang),cy+ri*Math.sin(ang)],t=[sx+L*f,sy];return [mix(c[0],t[0],u),mix(c[1],t[1],u)];});
 s+=draw(pts,1,{color:C.hi,w:dr-2});
 s+=fade(seg(p,.6,.8),line(sx,sy+30,sx+L,sy+30,{color:C.x,w:3})+line(sx,sy+22,sx,sy+38,{color:C.x,w:3})+line(sx+L,sy+22,sx+L,sy+38,{color:C.x,w:3})+tex('2\\pi r',sx+L/2,sy+64,{size:32})+tex('dr',sx+L+30,sy+8,{size:30,anchor:'start'}));
 s+=fade(seg(p,.7,.95),label('細い長方形の面積',sx,300,{size:26,color:C.ink})+tex('2\\pi r\\,dr',sx+260,300,{size:38,anchor:'start'}));
 return s+fade(seg(p,0,.15),label('1本の輪を切って伸ばす',sx,90,{size:28,color:C.ink}));
}

// Sphere cut into coins perpendicular to the rotation axis (vertical).
function sphereScene(p,stage){
 const cx=300,cy=265,R=200;let s='';
 s+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.x}" fill-opacity=".1" stroke="${C.x}" stroke-width="2"/>`;
 s+=line(cx,cy-R-40,cx,cy+R+40,{color:C.dim,w:2.5,dash:'8 7'})+label('軸',cx+12,cy-R-24,{size:24,color:C.dim});
 const K=12,g=stage===1?seg(p,.15,.75):1;
 for(let i=0;i<K;i++){const z=-1+(i+.5)*2/K,rr=R*Math.sqrt(1-z*z),y=cy-z*R,gi=clamp((g*K-i)/1.5);if(gi<=0)continue;
  s+=fade(gi*(stage===2?.5:1),`<ellipse cx="${cx}" cy="${n2(y)}" rx="${n2(rr)}" ry="${n2(rr*.16)}" fill="${C.x}" fill-opacity=".22" stroke="${C.x}" stroke-width="1.5"/>`);}
 if(stage===1)return s+fade(seg(p,.05,.25),label('球 → 薄い硬貨の積み重ね',600,80,{size:28,color:C.ink}))+fade(seg(p,.6,.9),label('どの硬貨も、軸を中心に回る円板',600,140,{size:26,color:C.x}));
 // stage 2: one coin at height z; right triangle R, z, coin radius
 const z=.55,y=cy-z*R,rr=R*Math.sqrt(1-z*z),gc=seg(p,0,.3),gt=seg(p,.3,.6);
 s+=fade(gc,`<ellipse cx="${cx}" cy="${n2(y)}" rx="${n2(rr)}" ry="${n2(rr*.16)}" fill="${C.hi}" fill-opacity=".45" stroke="${C.hi}" stroke-width="2.5"/>`);
 s+=fade(gt,line(cx,cy,cx+rr,y,{color:C.t,w:3.5})+line(cx,cy,cx,y,{color:C.x,w:3.5})+line(cx,y,cx+rr,y,{color:C.hi,w:3.5})+tex('R',cx+rr/2+26,(cy+y)/2+22,{size:32})+tex('z',cx-22,(cy+y)/2+10,{size:32}));
 s+=fade(gt,dot(cx,cy,6,C.ink));
 s+=fade(seg(p,.55,.8),label('硬貨の半径² ＝',600,170,{size:28,color:C.hi})+tex('R^2-z^2',860,170,{size:40,anchor:'start'}));
 s+=fade(seg(p,.75,.95),label('三平方の定理',600,240,{size:24,color:C.dim})+label('厚さ',600,310,{size:26,color:C.dim})+tex('dz',670,310,{size:34,anchor:'start'}));
 return s;
}
