// YouTube シリーズ 振動の方程式・中級 1/1（ステージ um-oscillation-equation 本0〜本2）— 図。Stage 1200×515.
// 色：位置 x・cos の項・係数 A（初めの位置）水色、速度 v・sin の項・係数 B（初めの速度）紫、加速度 赤、時刻 t 金、ω 桃、和・強調 黄、誤り 赤。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,wall,ground,block,spring} from './anim.mjs';

const K='um-oscillation-equation-1:';
const CW=C.p,CA=C.x,CB=C.v,CS=C.hi;
const W=`{\\color{${CW}}\\omega}`;
const A_=`{\\color{${CA}}A}`,B_=`{\\color{${CB}}B}`;
const XDD=`\\dfrac{d^2x}{dt^2}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const P=(cx,cy,R,th)=>[cx+R*Math.cos(th),cy-R*Math.sin(th)];
const TAU=2*Math.PI;

// ---- spring + block (same drawing as 初級) ------------------------------------------------------
function rig(d,{ox=600,y=400,sc=1500,wx=180,vArr=0,vlen=0,g=1,bw=110,bh=90,mtext='m',x1=1150}={}){
 const bx=ox+d*sc;
 let s=ground(wx-10,x1,y)+wall(wx,y-bh-60,y);
 s+=spring(wx,bx-bw/2,y-bh/2,{coils:10,amp:14,color:C.dim,w:3});
 s+=block(bx,y,bw,bh,{color:C.x,text:mtext,size:26,fo:.22});
 s+=line(ox,y-bh-40,ox,y+10,{color:C.dim,w:2,dash:'7 7'});
 if(vArr)s+=fade(vArr,arrow(bx,y-bh-18,bx+vlen,y-bh-18,{color:C.v,w:6,head:16}));
 return fade(g,s);
}
// x(t) graph area used by several cues
const GX=(o={})=>axes({x:90,y:450,w:620,h:360,xmin:0,xmax:6.6,ymin:-.26,ymax:.26,xlabel:'t [s]',ylabel:'x [m]',xticks:[1,2,3,4,5,6],yticks:[.2,.1,-.1,-.2],xcolor:C.t,ycolor:C.x,...o});
const cosF=(A,w=2)=>t=>A*Math.cos(w*t),sinF=(B,w=2)=>t=>B*Math.sin(w*t),sumF=(A,B,w=2)=>t=>A*Math.cos(w*t)+B*Math.sin(w*t);
// short tangent segment at t=0 (slope in m/s)
const tan0=(G,x0,v0,color,len=.45,g=1)=>fade(g,draw([[G.X(0),G.Y(x0)],[G.X(len),G.Y(x0+v0*len)]],1,{color,w:5}));

// ---- circle + shadow (as 初級): point at angle u, shadow on a vertical line at x0 ----------------
function shadow(u,{cx=240,cy=270,R=179,x0=500,trace=0,u0=0,x1=1150,tsc=60,g=1}={}){
 const [px,py]=P(cx,cy,R,u);
 let s=line(cx-R-24,cy,cx+R+24,cy,{color:C.faint,w:2})+line(cx,cy+R+24,cx,cy-R-24,{color:C.faint,w:2})+ring(cx,cy,R,{color:C.dim,w:3});
 s+=line(cx,cy,px,py,{color:C.ink,w:3})+dot(px,py,11,C.hi);
 s+=line(px,py,x0,py,{color:C.faint,w:2,dash:'6 6'});
 s+=line(x0,cy-R-16,x0,cy+R+16,{color:C.dim,w:2})+dot(x0,py,10,C.x);
 if(trace){const X=v=>x0+20+(v-u0)*tsc;
  s+=line(x0,cy,x1,cy,{color:C.faint,w:2});
  s+=draw(Array.from({length:201},(_,i)=>{const v=u0+(u-u0)*i/200;return [X(v),cy-R*Math.sin(v)];}),1,{color:CS,w:4});
  s+=dot(X(u),py,8,CS);}
 return fade(g,s);
}
const PHI=Math.atan2(.1,.2),RR=Math.hypot(.1,.2),PX=800; // px per metre on the circle

export const ytUmOscillationEquation1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const G=axes({x:110,y:450,w:600,h:360,xmin:0,xmax:10,ymin:0,ymax:140,xlabel:'t [s]',ylabel:'y [g]',xticks:[2,4,6,8],yticks:[50,100],xcolor:C.t});
  let s=G.svg;
  [40,70,130].forEach((c,i)=>{s+=fade(seg(p,.05+.08*i,.2+.08*i),G.plot(t=>c*Math.exp(-.2*t),{color:C.faint,w:3}));});
  s+=G.plot(t=>100*Math.exp(-.2*t),{p:seg(p,.35,.7),color:CS,w:5})+fade(seg(p,.3,.4),dot(G.X(0),G.Y(100),10,CS)+label('出発点 100 g',G.X(0)+22,G.Y(100)-16,{size:24,color:CS}));
  s+=card(770,110,400,250,tex('\\dfrac{dy}{dt}=-ky',970,180,{size:44})+label('1階の 方程式',970,270,{size:28,color:C.dim,anchor:'middle'})+label('初めの量 1つで 1本',970,325,{size:30,color:CS,anchor:'middle',weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=card(150,30,900,230,label('前回の 最後の問い',600,68,{size:24,color:C.dim,anchor:'middle'})+label('2階の 方程式',360,190,{size:30,color:C.ink,anchor:'middle'})+tex(`${XDD}=-${W}^2x`,700,185,{size:52}),seg(p,0,.15),C.hi);
  s+=card(170,310,400,120,label('解の 確かめは？',370,383,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  s+=card(630,310,400,120,label('出発点の 指定は？',830,383,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=rig(.1*Math.cos(2*4*Math.PI*p),{y:490,bh:70});
  s+=card(170,10,860,320,label('初級で 見たこと',600,45,{size:24,color:C.dim,anchor:'middle'})+tex(`${XDD}=-${W}^2x`,600,142,{size:46})
   +fade(seg(p,.25,.4),label('sin の 振動 → 解',600,230,{size:30,color:C.ink,anchor:'middle'})+ok(760,232))
   +fade(seg(p,.6,.75),label('初めの位置 と 初めの速度 の 2つで 決まる',600,295,{size:28,color:CS,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'ask']:(p)=>{
  const G=axes({x:70,y:470,w:620,h:420,xmin:0,xmax:6.5,ymin:-.27,ymax:.27,xlabel:'t',ylabel:'x',xcolor:C.t,ycolor:C.x});
  let s=G.svg;
  [[.2,0],[0,.15],[-.1,.2],[.05,-.2],[-.18,-.06]].forEach(([a,b],i)=>{s+=fade(seg(p,.05+.07*i,.2+.07*i),G.plot(sumF(a,b),{color:C.faint,w:3}));});
  s+=G.plot(sumF(.1,.2),{p:seg(p,.45,.8),color:CS,w:5});
  s+=card(740,120,420,250,label('解は 何通り？',950,200,{size:36,color:C.hi,anchor:'middle',weight:700})+label('出発点で どう 1本に？',950,290,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },

 // ===== S2 2回微分で確かめる =====
 [K+'order']:(p)=>{
  let s=tex(`\\dfrac{d^2}{dt^2}\\bigl[\\;?\\;\\bigr]=-${W}^2\\times\\bigl[\\;?\\;\\bigr]`,600,150,{size:60});
  s+=fade(seg(p,.3,.45),label('2回 微分すると',600,290,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),label('−ω² 倍の 自分に 戻る 関数',600,360,{size:40,color:CS,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('＝ この方程式の 解',600,440,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sin']:(p)=>{
  const Y=170;
  let s=tex(`\\sin ${W}t`,190,Y,{size:48});
  s+=fade(seg(p,.1,.25),arrow(290,Y,400,Y,{color:C.dim,w:3,head:12})+label('微分',345,Y-30,{size:24,color:C.dim,anchor:'middle'})+tex(`${W}\\cos ${W}t`,540,Y,{size:48}));
  s+=fade(seg(p,.35,.5),arrow(680,Y,790,Y,{color:C.dim,w:3,head:12})+label('微分',735,Y-30,{size:24,color:C.dim,anchor:'middle'})+tex(`-${W}^2\\sin ${W}t`,960,Y,{size:48}));
  s+=highlight(840,Y-70,240,120,seg(p,.6,.75));
  s+=fade(seg(p,.6,.75),label('−ω² 倍の 自分',960,Y+110,{size:32,color:CS,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.9),label('（初級で 確かめた）',600,440,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=tex('x=3\\cos 2t',600,160,{size:76});
  s+=card(230,280,740,130,label('cos でも −ω² 倍の 自分に 戻る？',600,358,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'d1']:(p)=>{
  let s=tex('x=3\\cos 2t',330,90,{size:46});
  s+=fade(seg(p,.1,.3),tex('\\dfrac{dx}{dt}=-6\\sin 2t',330,230,{size:46}));
  s+=fade(seg(p,.3,.45),label('cos の微分 → −sin',800,205,{size:28,color:C.ink}));
  s+=fade(seg(p,.5,.65),label('× 2（中身の 倍率）',800,255,{size:28,color:C.E,weight:700}));
  s+=fade(seg(p,.7,.85),label('3 × 2 ＝ 6',800,305,{size:26,color:C.dim}));
  return s;
 },
 [K+'d2']:(p)=>{
  let s=tex('x=3\\cos 2t',330,90,{size:46})+tex('\\dfrac{dx}{dt}=-6\\sin 2t',330,230,{size:46});
  s+=fade(seg(p,.1,.3),tex(`${XDD}=-12\\cos 2t`,330,380,{size:46}));
  s+=fade(seg(p,.3,.45),label('sin の微分 → cos',800,355,{size:28,color:C.ink}));
  s+=fade(seg(p,.5,.65),label('× 2（もう一度）',800,405,{size:28,color:C.E,weight:700}));
  s+=fade(seg(p,.7,.85),label('6 × 2 ＝ 12',800,455,{size:26,color:C.dim}));
  return s;
 },
 [K+'back']:(p)=>{
  let s=tex('-12\\cos 2t=-4\\times\\bigl(3\\cos 2t\\bigr)',600,90,{size:48});
  s+=fade(seg(p,.25,.4),tex(`${XDD}=-4\\,x`,600,230,{size:58}));
  const f=`${XDD}=-4\\,x`;s+=highlight(600-texWidth(f,58)/2-26,160,texWidth(f,58)+52,130,seg(p,.4,.55));
  s+=fade(seg(p,.6,.75),tex(`${W}^2=4,\\quad ${W}=2`,600,380,{size:50})+ok(800,390));
  return s;
 },
 [K+'twice']:(p)=>{
  let s=tex(`2\\times 2=4=${W}^2`,600,120,{size:60});
  s+=card(170,250,400,150,label('sin ωt',370,315,{size:34,color:C.ink,anchor:'middle',weight:700})+label('解',370,370,{size:30,color:C.dim,anchor:'middle'})+ok(420,372),seg(p,.3,.45));
  s+=card(630,250,400,150,label('cos ωt',830,315,{size:34,color:C.ink,anchor:'middle',weight:700})+label('解',830,370,{size:30,color:C.dim,anchor:'middle'})+ok(880,372),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'coef']:(p)=>{
  let s=tex('\\dfrac{d^2}{dt^2}\\bigl(\\boxed{3}\\cos 2t\\bigr)=-4\\bigl(\\boxed{3}\\cos 2t\\bigr)',600,130,{size:52});
  s+=fade(seg(p,.2,.35),label('3 は 両辺に 同じだけ 掛かる',600,280,{size:32,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('3 でも 0.5 でも，何倍しても 解',600,370,{size:34,color:CS,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S3 足しても解になる =====
 [K+'sum']:(p)=>{
  let s=tex(`x=${A_}\\cos ${W}t+${B_}\\sin ${W}t`,600,140,{size:62});
  s+=fade(seg(p,.25,.4),label('A，B：時間に よらない 定数',600,260,{size:30,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),label('これも 解？',600,370,{size:42,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'diff']:(p)=>{
  let s=tex(`\\dfrac{d^2}{dt^2}\\bigl(${A_}\\cos ${W}t\\bigr)=-${W}^2${A_}\\cos ${W}t`,600,80,{size:40});
  s+=fade(seg(p,.1,.25),tex(`\\dfrac{d^2}{dt^2}\\bigl(${B_}\\sin ${W}t\\bigr)=-${W}^2${B_}\\sin ${W}t`,600,190,{size:40}));
  s+=fade(seg(p,.3,.45),label('和の 微分 ＝ 項ごとの 微分の 和',600,285,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),tex(`${XDD}=-${W}^2${A_}\\cos ${W}t-${W}^2${B_}\\sin ${W}t`,600,400,{size:44}));
  return s;
 },
 [K+'factor']:(p)=>{
  let s=tex(`${XDD}=-${W}^2${A_}\\cos ${W}t-${W}^2${B_}\\sin ${W}t`,600,80,{size:42});
  s+=fade(seg(p,.1,.25),label('−ω² で くくる',600,160,{size:28,color:C.hi,anchor:'middle'}));
  const f2=`=-${W}^2\\bigl(${A_}\\cos ${W}t+${B_}\\sin ${W}t\\bigr)`;
  s+=fade(seg(p,.2,.35),tex(f2,600,240,{size:46}));
  const w2=texWidth(f2,46),bx1=600-w2/2+texWidth(`=-${W}^2`,46),bx2=600+w2/2;
  s+=fade(seg(p,.4,.55),brace(bx1+6,bx2-6,285,{text:'x',size:30,color:C.x}));
  s+=fade(seg(p,.6,.75),tex(`=-${W}^2x`,600,420,{size:56})+ok(760,430));
  return s;
 },
 [K+'linear']:(p)=>{
  let s=tex(`${XDD}=-${W}^2\\,x`,600,110,{size:60});
  s+=card(170,210,860,130,label('x と d²x/dt² が',600,260,{size:30,color:C.ink,anchor:'middle'})+label('定数倍 と 足し算 だけで 入っている',600,315,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.2,.35));
  s+=fade(seg(p,.6,.75),label('→ 線形',600,430,{size:48,color:CS,anchor:'middle',weight:700}));
  return s;
 },
 [K+'nonlin']:(p)=>{
  let s=card(60,60,520,380,label('線形',320,115,{size:32,color:C.F,anchor:'middle',weight:700})
   +tex(`${XDD}=-${W}^2x`,320,195,{size:40})+label('x を 2倍 → 両辺 2倍',320,285,{size:28,color:C.ink,anchor:'middle'})+label('そろう',320,360,{size:32,color:C.F,anchor:'middle',weight:700})+ok(400,362),1,C.F);
  s+=card(620,60,520,380,label('もし x² が あったら',880,115,{size:30,color:C.a,anchor:'middle',weight:700})
   +tex('x^2\\;\\to\\;(2x)^2=4x^2',880,195,{size:40})+label('x を 2倍 → x² は 4倍',880,285,{size:28,color:C.ink,anchor:'middle'})+label('そろわない',880,360,{size:32,color:C.a,anchor:'middle',weight:700})+ng(990,362),seg(p,.1,.25),C.a);
  return s;
 },
 [K+'waves']:(p)=>{
  const G=GX();
  const keys=[[.1,0],[.1,.2],[0,.2],[-.15,.1],[.2,-.1]],u=clamp(p/.85)*(keys.length-1),i=Math.min(keys.length-2,Math.floor(u)),f=smooth(u-i);
  const A=mix(keys[i][0],keys[i+1][0],f),B=mix(keys[i][1],keys[i+1][1],f);
  let s=G.svg+G.plot(cosF(A),{color:CA,w:3,dash:'10 8'})+G.plot(sinF(B),{color:CB,w:3,dash:'10 8'})+G.plot(sumF(A,B),{color:CS,w:5});
  s+=card(830,40,340,420,label('ω ＝ 2（固定）',1000,95,{size:30,color:CW,anchor:'middle',weight:700})
   +label(`cos の 係数 A ＝ ${A.toFixed(2).replace('-','−')}`,1000,165,{size:26,color:CA,anchor:'middle'})
   +label(`sin の 係数 B ＝ ${B.toFixed(2).replace('-','−')}`,1000,215,{size:26,color:CB,anchor:'middle'})
   +line(860,250,1140,250,{color:C.faint,w:2})
   +label('点線：cos の波・sin の波',1000,290,{size:22,color:C.dim,anchor:'middle'})
   +label('実線：2つの 和',1000,325,{size:22,color:CS,anchor:'middle'})
   +fade(seg(p,.5,.65),label('どれも 解',1000,395,{size:32,color:CS,anchor:'middle',weight:700})),1);
  return s;
 },

 // ===== S4 出発点で1本に決める =====
 [K+'many']:(p)=>{
  const G=GX();
  let s=G.svg;
  [[.2,0],[0,.15],[-.1,.2],[.05,-.2],[-.18,-.06],[.1,.2]].forEach(([a,b],i)=>{s+=G.plot(sumF(a,b),{color:i===5?CS:C.faint,w:i===5?4:3,p:seg(p,.04*i,.2+.04*i)});});
  s+=fade(seg(p,.45,.6),line(G.X(0),G.Y(.26),G.X(0),G.Y(-.26),{color:C.t,w:4})+label('t ＝ 0',G.X(0)+12,G.Y(-.26)+4,{size:24,color:C.t}));
  s+=card(830,90,340,300,label('A と B の 組の 数',1000,160,{size:28,color:C.ink,anchor:'middle'})+label('だけ 解が ある',1000,205,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.7),label('t ＝ 0 の 様子で',1000,290,{size:30,color:C.t,anchor:'middle',weight:700})+label('1本を 選ぶ',1000,340,{size:30,color:CS,anchor:'middle',weight:700})),seg(p,.25,.4));
  return s;
 },
 [K+'pos']:(p)=>{
  let s=tex(`x(0)=${A_}\\cos 0+${B_}\\sin 0`,600,90,{size:50});
  s+=fade(seg(p,.2,.35),label('cos 0 ＝ 1，　sin 0 ＝ 0',600,180,{size:30,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),tex(`=${A_}\\times 1+${B_}\\times 0=${A_}`,600,270,{size:50}));
  s+=card(330,340,540,130,tex(`${A_}=x_0`,510,410,{size:52})+label('初めの位置',730,418,{size:32,color:CA,anchor:'middle',weight:700}),seg(p,.6,.75),CA);
  return s;
 },
 [K+'vel']:(p)=>{
  let s=tex(`x=${A_}\\cos ${W}t+${B_}\\sin ${W}t`,600,90,{size:46});
  s+=fade(seg(p,.15,.3),arrow(600,140,600,205,{color:C.dim,w:3,head:12})+label('1回 微分',630,185,{size:26,color:C.dim}));
  s+=fade(seg(p,.3,.5),tex(`v=\\dfrac{dx}{dt}=-${W}${A_}\\sin ${W}t+${W}${B_}\\cos ${W}t`,600,290,{size:48}));
  s+=fade(seg(p,.6,.75),label('cos の微分 → −sin，sin の微分 → cos，中身の 倍率 ω',600,420,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'v0']:(p)=>{
  let s=tex(`v=-${W}${A_}\\sin ${W}t+${W}${B_}\\cos ${W}t`,600,70,{size:40});
  s+=fade(seg(p,.05,.25),tex(`v(0)=-${W}${A_}\\times 0+${W}${B_}\\times 1=${W}${B_}`,600,180,{size:46}));
  s+=fade(seg(p,.45,.6),tex(`${W}${B_}=v_0`,380,330,{size:52})+label('初めの速度',380,420,{size:30,color:CB,anchor:'middle',weight:700}));
  const f=`${B_}=\\dfrac{v_0}{${W}}`;
  s+=fade(seg(p,.65,.8),arrow(520,330,610,330,{color:C.dim,w:3,head:12})+tex(f,800,330,{size:58})+highlight(800-texWidth(f,58)/2-24,250,texWidth(f,58)+48,150,seg(p,.8,.9)));
  return s;
 },
 [K+'formula']:(p)=>{
  const f=`x=x_0\\cos ${W}t+\\dfrac{v_0}{${W}}\\sin ${W}t`;
  let s=tex(f,600,170,{size:70})+highlight(600-texWidth(f,70)/2-30,70,texWidth(f,70)+60,190,seg(p,.3,.45));
  s+=fade(seg(p,.45,.6),label('初めの位置',420,330,{size:30,color:CA,anchor:'middle',weight:700})+label('初めの速度 ÷ ω',790,330,{size:30,color:CB,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('出発点の 2つの値 → 解が 1本',600,430,{size:36,color:CS,anchor:'middle',weight:700}));
  return s;
 },
 [K+'separate']:(p)=>{
  const G1=axes({x:80,y:330,w:440,h:220,xmin:-.8,xmax:2.2,ymin:-.15,ymax:.15,xlabel:'t',ylabel:'',xcolor:C.t});
  const G2=axes({x:680,y:330,w:440,h:220,xmin:-.8,xmax:2.2,ymin:-.15,ymax:.15,xlabel:'t',ylabel:'',xcolor:C.t,g:seg(p,.3,.45)});
  let s=label('cos の項',300,60,{size:30,color:CA,anchor:'middle',weight:700})+G1.svg+G2.svg+G1.plot(cosF(.1),{color:CA,w:4});
  s+=dot(G1.X(0),G1.Y(.1),9,CA)+draw([[G1.X(-.45),G1.Y(.1)],[G1.X(.45),G1.Y(.1)]],1,{color:C.hi,w:4});
  s+=fade(seg(p,.1,.25),label('t＝0：高さ A，傾き 0',300,400,{size:26,color:C.ink,anchor:'middle'})+label('→ 位置だけ',300,450,{size:30,color:CA,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('sin の項',900,60,{size:30,color:CB,anchor:'middle',weight:700})+G2.plot(sinF(.1),{color:CB,w:4})+dot(G2.X(0),G2.Y(0),9,CB)+draw([[G2.X(-.45),G2.Y(-.09)],[G2.X(.45),G2.Y(.09)]],1,{color:C.hi,w:4}));
  s+=fade(seg(p,.45,.6),label('t＝0：高さ 0，傾き ωB',900,400,{size:26,color:C.ink,anchor:'middle'})+label('→ 速度だけ',900,450,{size:30,color:CB,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why2']:(p)=>{
  let s=label('方程式が 教えるのは 加速度だけ',600,60,{size:30,color:C.ink,anchor:'middle'});
  const box=(x,t,c,g)=>fade(g,rect(x-120,150,240,100,{fill:'#131f38',fo:1,stroke:c,sw:3,rx:14})+label(t,x,212,{size:34,color:c,anchor:'middle',weight:700}));
  s+=box(220,'加速度 a',C.a,1)+box(600,'速度 v',C.v,seg(p,.2,.35))+box(980,'位置 x',C.x,seg(p,.45,.6));
  s+=fade(seg(p,.2,.35),arrow(345,200,475,200,{color:C.dim,w:4,head:14})+label('1段目',410,180,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),arrow(725,200,855,200,{color:C.dim,w:4,head:14})+label('2段目',790,180,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('出発点 v₀ が 要る',600,300,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('出発点 x₀ が 要る',980,300,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('2段 たどる → 条件は 2つ',600,420,{size:36,color:CS,anchor:'middle',weight:700}));
  return s;
 },
 [K+'compare']:(p)=>{
  let s=card(60,60,520,360,label('1階',320,115,{size:32,color:C.dim,anchor:'middle',weight:700})+tex('\\dfrac{dy}{dt}=-ky',320,210,{size:44})+label('初めの量',320,310,{size:30,color:C.ink,anchor:'middle'})+label('1つ',320,370,{size:38,color:C.hi,anchor:'middle',weight:700}),1);
  s+=card(620,60,520,360,label('2階',880,115,{size:32,color:C.dim,anchor:'middle',weight:700})+tex(`${XDD}=-${W}^2x`,880,210,{size:44})+label('初めの位置 と 初めの速度',880,310,{size:30,color:C.ink,anchor:'middle'})+label('2つ',880,370,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.5),C.hi);
  return s;
 },

 // ===== S5 数値で3本の解 =====
 [K+'nums']:(p)=>{
  let s=rig(.1,{y:490,bh:70,vArr:seg(p,.6,.75),vlen:130,mtext:'m'});
  s+=fade(seg(p,.3,.45),brace(600,750,398,{dir:-1,text:'x₀ ＝ 0.1 m',size:24,color:C.x}));
  s+=card(210,20,780,250,tex(`${W}=2\\ \\mathrm{rad/s}`,600,80,{size:40})
   +fade(seg(p,.3,.45),tex('x_0=0.1\\ \\mathrm{m}',600,150,{size:40}))
   +fade(seg(p,.6,.75),tex('v_0=0.4\\ \\mathrm{m/s}',600,220,{size:40})),1);
  return s;
 },
 [K+'AB']:(p)=>{
  let s=tex(`${A_}=x_0=0.1`,600,80,{size:48});
  s+=fade(seg(p,.15,.35),tex(`${B_}=\\dfrac{v_0}{${W}}=\\dfrac{0.4}{2}=0.2`,600,200,{size:48}));
  const f='x=0.1\\cos 2t+0.2\\sin 2t';
  s+=fade(seg(p,.5,.65),tex(f,600,370,{size:62})+highlight(600-texWidth(f,62)/2-26,315,texWidth(f,62)+52,100,seg(p,.65,.8)));
  return s;
 },
 [K+'check']:(p)=>{
  const G=GX();
  let s=G.svg+G.plot(sumF(.1,.2),{p:seg(p,0,.35),color:CS,w:5});
  s+=fade(seg(p,.25,.4),dot(G.X(0),G.Y(.1),10,CA));
  s+=tan0(G,.1,.4,CB,.22,seg(p,.5,.65));
  s+=card(850,100,320,300,tex('t=0',1010,150,{size:36})
   +fade(seg(p,.25,.4),label('x ＝ 0.1 m',1010,220,{size:30,color:CA,anchor:'middle',weight:700})+ok(1110,222))
   +fade(seg(p,.5,.65),label('傾き ＝ 速度',1010,285,{size:24,color:C.dim,anchor:'middle'})+label('2 × 0.2 ＝ 0.4 m/s',1000,340,{size:26,color:CB,anchor:'middle',weight:700})+ok(1128,342)),seg(p,.2,.3));
  return s;
 },
 [K+'circle']:(p)=>{
  const cx=240,cy=270,R=RR*PX;
  let s=shadow(PHI,{cx,cy,R,x0:560});
  const hx=cx+.2*PX,hy=cy-.1*PX;
  s+=fade(seg(p,.35,.5),line(cx,cy,hx,cy,{color:CB,w:6})+label('横 0.2',(cx+hx)/2,cy+36,{size:24,color:CB,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),line(hx,cy,hx,hy,{color:CA,w:6})+label('高さ 0.1',hx+12,cy-28,{size:24,color:CA,weight:700}));
  s+=card(610,80,560,320,label('影の 高さ ＝ x',890,140,{size:28,color:C.x,anchor:'middle'})
   +label('影の 速度 ＝ ω × 横',890,200,{size:28,color:C.v,anchor:'middle'})
   +fade(seg(p,.35,.5),label('横 ＝ v₀ ÷ ω ＝ 0.4 ÷ 2 ＝ 0.2',890,275,{size:28,color:CB,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('高さ ＝ x₀ ＝ 0.1',890,340,{size:28,color:CA,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'amp']:(p)=>{
  const cx=240,cy=270,R=RR*PX,u=PHI+TAU*.75*seg(p,.35,.95);
  let s=shadow(u,{cx,cy,R,trace:1,u0:PHI,tsc:58,x0:560});
  s+=fade(seg(p,.05,.2)*(1-seg(p,.3,.4)),line(cx,cy,...P(cx,cy,R,PHI),{color:CS,w:7}));
  s+=fade(seg(p,.05,.2),label('半径 ＝ 振幅',cx,cy+R+44,{size:26,color:CS,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.3),tex('\\sqrt{0.1^2+0.2^2}=\\sqrt{0.05}\\approx0.22\\ \\mathrm{m}',860,50,{size:40,auto:false}));
  s+=fade(seg(p,.6,.75),line(580,cy-R,1150,cy-R,{color:CS,w:2,dash:'6 6'})+label('振幅 0.22 m',1150,cy-R+36,{size:24,color:CS,anchor:'end',weight:700}));
  return s;
 },
 [K+'same']:(p)=>{
  let s=label('初級の 形',300,90,{size:28,color:C.dim,anchor:'middle'})+tex(`\\sqrt{0.05}\\,\\sin(2t+\\varphi)`,300,180,{size:48});
  s+=fade(seg(p,.15,.3),label('＝',600,190,{size:48,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),label('cos と sin の 係数で',900,90,{size:28,color:C.dim,anchor:'middle'})+tex('0.1\\cos 2t+0.2\\sin 2t',900,180,{size:48}));
  s+=fade(seg(p,.4,.55),label('振幅 ≈ 0.22 m，　φ は t＝0 の 点の 角度',600,300,{size:28,color:C.ink,anchor:'middle'}));
  s+=card(250,350,700,110,label('同じ 運動の 別の 書き方',600,418,{size:36,color:CS,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(50,60,530,370,label('①',315,110,{size:30,color:C.dim,anchor:'middle'})+label('0.1 m ずらして そっと 離す',315,170,{size:28,color:C.ink,anchor:'middle'})
   +tex('x_0=0.1,\\quad v_0=0',315,250,{size:40})+label('x ＝ ？',315,360,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),CA);
  s+=card(620,60,530,370,label('②',885,110,{size:30,color:C.dim,anchor:'middle'})+label('中心から 0.4 m/s で 押し出す',885,170,{size:28,color:C.ink,anchor:'middle'})
   +tex('x_0=0,\\quad v_0=0.4',885,250,{size:40})+label('x ＝ ？',885,360,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),CB);
  return s;
 },
 [K+'three']:(p)=>{
  const G=GX();
  let s=G.svg;
  s+=G.plot(cosF(.1),{p:seg(p,.05,.3),color:CA,w:4})+fade(seg(p,.05,.2),dot(G.X(0),G.Y(.1),9,CA))+tan0(G,.1,0,CA,.4,seg(p,.2,.3));
  s+=G.plot(sinF(.2),{p:seg(p,.3,.55),color:CB,w:4})+fade(seg(p,.3,.45),dot(G.X(0),G.Y(0),9,CB))+tan0(G,0,.4,CB,.4,seg(p,.45,.55));
  s+=G.plot(sumF(.1,.2),{p:seg(p,.6,.85),color:CS,w:5})+fade(seg(p,.6,.7),dot(G.X(0),G.Y(.1),8,CS))+tan0(G,.1,.4,CS,.4,seg(p,.75,.85));
  s+=card(800,40,370,440,label('① 位置だけ',985,90,{size:26,color:CA,anchor:'middle',weight:700})+tex('x=0.1\\cos 2t',985,145,{size:34})
   +fade(seg(p,.3,.45),label('② 速度だけ',985,215,{size:26,color:CB,anchor:'middle',weight:700})+tex('x=0.2\\sin 2t',985,270,{size:34}))
   +fade(seg(p,.6,.75),label('両方 ＝ ① ＋ ②',985,340,{size:26,color:CS,anchor:'middle',weight:700})+tex('0.1\\cos 2t+0.2\\sin 2t',985,395,{size:30})),1);
  return s;
 },
 [K+'fixed']:(p)=>{
  const G=GX();
  let s=G.svg+G.plot(cosF(.1),{color:CA,w:4})+G.plot(sinF(.2),{color:CB,w:4})+G.plot(sumF(.1,.2),{color:CS,w:5});
  s+=fade(seg(p,.1,.25),brace(G.X(Math.PI),G.X(2*Math.PI),G.Y(.26)-8,{dir:-1,text:'周期 π s（3本とも）',size:24,color:C.t}));
  s+=card(800,70,370,170,label('方程式',985,125,{size:28,color:C.dim,anchor:'middle'})+label('→ ω ＝ 2（固定）',985,190,{size:32,color:CW,anchor:'middle',weight:700}),seg(p,.35,.5),CW);
  s+=card(800,270,370,170,label('出発点',985,325,{size:28,color:C.dim,anchor:'middle'})+label('→ 係数の 配分',985,390,{size:32,color:CS,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(80,15,1040,105,label('2回 微分すると −ω² 倍の 自分に 戻る',600,55,{size:28,color:C.ink,anchor:'middle'})+label('sin も cos も 解',600,100,{size:30,color:CS,anchor:'middle',weight:700}),1);
  s+=card(80,135,1040,125,label('線形 → 足しても 解',600,172,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(`x=${A_}\\cos ${W}t+${B_}\\sin ${W}t`,600,225,{size:40}),seg(p,.4,.55));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,15,1040,105,label('2回 微分すると −ω² 倍の 自分に 戻る',600,55,{size:28,color:C.ink,anchor:'middle'})+label('sin も cos も 解',600,100,{size:30,color:CS,anchor:'middle',weight:700}),1);
  s+=card(80,135,1040,125,label('線形 → 足しても 解',600,172,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(`x=${A_}\\cos ${W}t+${B_}\\sin ${W}t`,600,225,{size:40}),1);
  s+=card(80,275,1040,215,label('初めの位置・初めの速度 → 1本',600,315,{size:28,color:C.ink,anchor:'middle',weight:700})+tex(`x=x_0\\cos ${W}t+\\dfrac{v_0}{${W}}\\sin ${W}t`,600,405,{size:46}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'tools']:(p)=>{
  const items=[['微分',C.v],['積分',C.t],['近似',C.E],['ベクトル',C.x],['微分方程式',C.F],['振動の方程式',C.hi]];let s='';
  items.forEach(([t,c],i)=>{const x=110+i*196;s+=fade(seg(p,.05+.08*i,.2+.08*i),rect(x-94,150,188,100,{fill:'#131f38',fo:1,stroke:c,sw:3,rx:14})+label(t,x,212,{size:t.length>5?24:28,color:c,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.6,.75),label('数学の 道具が そろった → 次は 力学',600,380,{size:36,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=tex('ma=F',600,130,{size:88});
  s+=card(150,250,900,200,label('次の問い',600,300,{size:26,color:C.dim,anchor:'middle'})
   +label('「微分方程式」として 読むと',600,360,{size:34,color:C.ink,anchor:'middle'})
   +label('何が 決まる？',600,420,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
};
