// YouTube シリーズ「単振動・上級 3/3」(ys-uc-shm-3) — 図。Stage 1200×515.
// 色：位置 x 水色、力 緑、時間 t 金、抵抗の項 赤、cos の箱 水色系、sin の箱 紫系、交差項 赤、強調・振幅 黄。
// 数値：m＝1、k＝100、b＝2、F₀＝1 → A(Ω)＝1/√((100−Ω²)²＋(2Ω)²)：0.010、0.0132（Ω＝5）、0.05（10）、0.0033（20）。b＝0.5：0.2（Ω＝10）。山 9.90。
import {C,seg,fade,mix,label,line,rect,dot,ring,arrow,highlight,axes,texWidth,draw,wall,spring as coil} from './anim.mjs';
import {card,T,cc} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {cF,cV,cX,cT,cE,cH,cA,L,boxT,miniCurve,pend,swingTh} from './yt1-uc-shm-1-diagrams.mjs';

const K='uc-shm-3:';
const x=cX('x'),t=cT('t'),bR=s=>cc(C.a,s),O='\\Omega ';
const d1=q=>`\\dfrac{d${q}}{d${t}}`,d2=q=>`\\dfrac{d^2${q}}{d${t}^2}`;
const F0=cF('F_0'),FT=`${F0}\\cos ${O}${t}`;
const EQF=`m${d2(x)}+${bR('b')}${d1(x)}+k${x}=${FT}`;
const CB='#6adfff',SB='#b49bff';
const Amp=(W,b=2)=>1/Math.sqrt((100-W*W)**2+(b*W)**2);

function pushBox(X,{cx=330,y0=300,unit=120,push=0}={}){
 const bx=cx+unit*X;
 let s=wall(70,y0-110,y0+20)+line(70,y0+20,cx+unit*1.9,y0+20,{color:C.dim,w:3});
 s+=coil(70,bx-40,y0-75,{coils:8,amp:13,color:C.dim,w:3});
 const cy=y0-22;s+=line(70,cy,110,cy,{color:C.a,w:3})+rect(110,cy-16,110,30,{fill:C.a,fo:.12,stroke:C.a,sw:2.5,rx:3})+line(Math.min(200,bx-60),cy,bx-40,cy,{color:C.a,w:3});
 s+=rect(bx-40,y0-100,80,120,{fill:C.x,fo:.3,stroke:C.x,sw:2,rx:8})+label('m',bx,y0-30,{size:30,color:C.ink,anchor:'middle',weight:700});
 if(Math.abs(push)>.05)s+=arrow(bx+44,y0-140,bx+44+push*90,y0-140,{color:C.F,w:6,head:16});
 s+=label('F₀ cos Ωt',bx+44,y0-170,{size:24,color:C.F,anchor:'middle',weight:700});
 return s;
}
// simulate forced motion
const simCache={};
function sim(W,x0,b=2,T=6){
 const key=[W,x0,b,T].join();if(simCache[key])return simCache[key];
 const dt=0.002,N=Math.round(T/dt),xs=new Float64Array(N+1);let X=x0,V=0,tt=0;xs[0]=X;
 const f=(X,V,tt)=>[V,-100*X-b*V+Math.cos(W*tt)];
 for(let i=0;i<N;i++){const k1=f(X,V,tt),k2=f(X+dt/2*k1[0],V+dt/2*k1[1],tt+dt/2),k3=f(X+dt/2*k2[0],V+dt/2*k2[1],tt+dt/2),k4=f(X+dt*k3[0],V+dt*k3[1],tt+dt);X+=dt/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]);V+=dt/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]);tt+=dt;xs[i+1]=X;}
 return simCache[key]=u=>xs[Math.max(0,Math.min(N,Math.round(u/dt)))];
}
// two boxes with chips
function boxes(stage,{p=1,rhs=false}={}){
 const cosT=[`-m${O}^2C`,`${bR('b')}${O}D`,'kC'],sinT=[`-m${O}^2D`,`-${bR('b')}${O}C`,'kD'];
 let s=rect(70,40,500,370,{fill:CB,fo:.06,stroke:CB,sw:2.5,rx:16})+rect(630,40,500,370,{fill:SB,fo:.06,stroke:SB,sw:2.5,rx:16});
 s+=T(`\\cos ${O}${t}\\ \\text{の箱}`,320,85,{size:34})+T(`\\sin ${O}${t}\\ \\text{の箱}`,880,85,{size:34});
 const src=['m d²x/dt² から','b dx/dt から','kx から'];
 for(let i=0;i<3;i++){
  const g=i<stage?1:i===stage?seg(p,.15,.45):0;if(g<=0)continue;
  const yy=150+i*62,on=i===stage;
  s+=fade(g,T(cosT[i],320,yy,{size:36})+T(sinT[i],880,yy,{size:36})+(on?label('← '+src[i]+' →',600,460,{size:26,color:C.hi,anchor:'middle',weight:700}):''));
 }
 if(stage>=3||rhs){const g=stage>=3?1:seg(p,.55,.7);s+=fade(g,line(100,335,540,335,{color:C.dim,w:2})+line(660,335,1100,335,{color:C.dim,w:2})+T(`=${F0}`,320,375,{size:34})+T('=0',880,375,{size:34})+label('右辺',600,382,{size:24,color:C.F,anchor:'middle',weight:700}));}
 return s;
}
const GA=(o={})=>axes({x:110,y:450,w:560,h:360,xmin:0,xmax:21,ymin:0,ymax:0.056,xticks:[5,10,15,20],yticks:[0.01,0.02,0.03,0.04,0.05],grid:true,xlabel:'Ω [rad/s]',ylabel:'振幅 A [m]',xcolor:C.dim,ycolor:C.hi,...o});

export const ytUcShm3Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  let s=pushBox(0.3*Math.sin(2*Math.PI*3*p),{push:Math.cos(2*Math.PI*3*p)});
  s+=card(680,90,470,320,L('前回の 最後の 問い',915,140,{size:24,color:C.dim})+L('失う 分を',915,210,{size:30})+L('周期的に 押して 補うと？',915,270,{size:30,color:C.hi,weight:700}),seg(p,0,.08),C.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=card(150,60,900,380,L('押す 周期 ≈ 自分の 揺れの 周期',600,130,{size:32,color:C.hi,weight:700})
   +miniCurve(220,300,760,100,u=>(1-Math.exp(-4*u))*Math.sin(2*Math.PI*7*u),{p:seg(p,0,.8)})
   +fade(seg(p,.4,.55),L('なぜ 大きく 揺れる？',600,425,{size:32,color:C.hi,weight:700})),seg(p,0,.08),C.hi);
  return s;
 },
 [K+'swing']:(p)=>{
  const th=swingTh(p,.35+.25*p,2.5);
  let s=pend(250,40,300,th);
  const [bx,by]=[250+300*Math.sin(th),40+300*Math.cos(th)];
  const ph=Math.cos(2*Math.PI*2.5*p);
  if(ph>.85)s+=arrow(bx-70,by+10,bx-26,by,{color:C.F,w:5,head:12});
  s+=card(560,70,600,170,L('揺れに 合わせて 押す',860,135,{size:30,color:C.F,weight:700})+L('→ どんどん 大きく',860,195,{size:28}),seg(p,0,.08),C.F);
  s+=card(560,280,600,170,L('合わない リズムで 押す',860,345,{size:30,color:C.a,weight:700})+L('→ あまり 大きく ならない',860,405,{size:28}),seg(p,.4,.5));
  return s;
 },
 [K+'force']:(p)=>{
  let s=pushBox(0.3*Math.sin(2*Math.PI*2*p),{push:Math.cos(2*Math.PI*2*p)});
  s+=card(660,60,500,400,T(`${FT}`,910,130,{size:44})
   +L('Ω：押す 角振動数（選べる）',910,215,{size:26,color:C.F})
   +fade(seg(p,.45,.6),T(`\\omega_0=\\sqrt{\\dfrac{k}{m}}`,910,320,{size:44})+L('ばね 自身の 角振動数',910,410,{size:26,color:C.dim})),seg(p,0,.08));
  return s;
 },
 // ===== S2 =====
 [K+'eq']:(p)=>{
  let s=T(`m${d2(x)}+${bR('b')}${d1(x)}+k${x}=0`,600,100,{size:42,opacity:.75});
  s+=fade(seg(p,.1,.25),L('右辺に 押す 力を 加える',600,200,{size:28,color:C.F,weight:700}));
  s+=fade(seg(p,.3,.45),boxT(EQF,600,345,52,1,C.F,true));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=T(`${x}\\;=\\;`,150,250,{size:52});
  s+=card(230,120,400,260,L('前回の 減っていく 揺れ',430,170,{size:26,color:C.dim})+miniCurve(260,280,340,70,u=>Math.exp(-4*u)*Math.cos(2*Math.PI*6*u)),seg(p,.05,.15));
  s+=T('+',665,250,{size:52});
  s+=card(700,120,420,260,L('押す 力に 合わせた 揺れ',910,170,{size:26,color:C.F})+fade(seg(p,.3,.4),miniCurve(730,280,360,50,u=>Math.sin(2*Math.PI*4*u),{color:C.hi})),seg(p,.25,.35));
  s+=fade(seg(p,.5,.65),L('線形 → 解を 足しても 解',600,450,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'trans']:(p)=>{
  const A=axes({x:90,y:260,w:1000,h:180,xmin:0,xmax:6,ymin:-0.07,ymax:0.07,xticks:[1,2,3,4,5,6],yticks:[],grid:true,xlabel:'t [s]',xcolor:C.t});
  const f=sim(5,0.06);
  const st=u=>0.0131*Math.cos(5*u)+0.00175*Math.sin(5*u);
  let s=A.svg+A.plot(f,{from:0,to:5.95,color:C.x,w:3,p:seg(p,0,.75),steps:1200});
  s+=fade(seg(p,.55,.7),A.plot(st,{from:3,to:5.95,color:C.hi,w:3,dash:'8 6',steps:300}));
  s+=card(140,330,920,150,L('減っていく 揺れは e の −γt 乗 で 消える',600,385,{size:28})+fade(seg(p,.55,.7),L('残るのは 押す 力と 同じ Ω の 揺れ（点線）',600,445,{size:28,color:C.hi,weight:700})),seg(p,0,.08));
  return s;
 },
 [K+'form']:(p)=>{
  let s=L('定常解',600,90,{size:32,color:C.hi,weight:700});
  s+=boxT(`${x}=C\\cos ${O}${t}+D\\sin ${O}${t}`,600,215,56,1,C.hi);
  s+=fade(seg(p,.45,.6),L('C、D：これから 決める 定数',600,370,{size:30}));
  return s;
 },
 [K+'why']:(p)=>{
  const A=axes({x:90,y:270,w:1000,h:200,xmin:0,xmax:4.2*Math.PI,ymin:-1.2,ymax:1.2,xticks:[],yticks:[],xlabel:'t',xcolor:C.t});
  let s=A.svg+A.plot(u=>Math.cos(u),{from:0,to:4.1*Math.PI,color:C.F,w:3,dash:'8 6'})+A.plot(u=>0.8*Math.cos(u-0.9),{from:0,to:4.1*Math.PI,color:C.x,w:4,p:seg(p,0,.6)});
  s+=label('押す 力',A.X(0)+10,A.Y(1)-14,{size:24,color:C.F})+label('揺れ',A.X(0.9)+10,A.Y(0.8)+40,{size:24,color:C.x});
  s+=fade(seg(p,.3,.45),arrow(A.X(2*Math.PI),A.Y(1.08),A.X(2*Math.PI+0.9),A.Y(1.08),{color:C.hi,w:4,head:12})+label('遅れ',A.X(2*Math.PI+0.45),A.Y(1.08)-14,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=card(150,350,900,120,T(`C\\cos ${O}${t}+D\\sin ${O}${t}`,600,395,{size:40})+L('sin の 項で 遅れを 表す',600,452,{size:24,color:C.dim}),seg(p,.5,.6));
  return s;
 },
 [K+'d1']:(p)=>{
  let s=T(`${x}=C\\cos ${O}${t}+D\\sin ${O}${t}`,600,100,{size:44,opacity:.8});
  s+=fade(seg(p,.1,.25),L('cos → −sin、sin → cos、中身の 倍率 Ω',600,195,{size:26,color:C.dim}));
  s+=fade(seg(p,.3,.45),boxT(`${d1(x)}=-${O}C\\sin ${O}${t}+${O}D\\cos ${O}${t}`,600,340,50,1,C.hi,true));
  return s;
 },
 [K+'d2']:(p)=>{
  let s=T(`${d2(x)}=-${O}^2C\\cos ${O}${t}-${O}^2D\\sin ${O}${t}`,600,110,{size:44});
  s+=fade(seg(p,.4,.55),boxT(`${d2(x)}=-${O}^2${x}`,600,320,56,1,C.hi,true));
  return s;
 },
 // ===== S3 =====
 [K+'box']:(p)=>boxes(0,{p:0})+fade(seg(p,.3,.45),L('項を 一つずつ 振り分ける',600,450,{size:28,color:C.hi,weight:700})),
 [K+'box1']:(p)=>boxes(0,{p}),
 [K+'box2']:(p)=>boxes(1,{p}),
 [K+'box3']:(p)=>boxes(2,{p,rhs:true}),
 [K+'times']:(p)=>{
  let s=card(80,60,500,330,T(`${O}${t}=0`,330,125,{size:42})+L('cos ＝ 1、sin ＝ 0',330,195,{size:28})+L('→ cos の 箱 どうし',330,280,{size:30,color:CB,weight:700}),seg(p,.05,.15));
  s+=card(620,60,500,330,T(`${O}${t}=\\dfrac{\\pi}{2}`,870,130,{size:42})+L('cos ＝ 0、sin ＝ 1',870,205,{size:28})+L('→ sin の 箱 どうし',870,280,{size:30,color:SB,weight:700}),seg(p,.4,.5));
  s+=fade(seg(p,.6,.75),L('どの 時刻でも 左右が 等しい から',600,450,{size:28,color:C.hi}));
  return s;
 },
 [K+'eq1']:(p)=>{
  let s=T(`-m${O}^2C+${bR('b')}${O}D+kC=${F0}`,600,110,{size:42,color:C.ink});
  s+=fade(seg(p,.15,.3),L('C の 項を まとめる',600,205,{size:26,color:C.dim}));
  s+=fade(seg(p,.3,.45),boxT(`(k-m${O}^2)\\,C+${bR('b')}${O}\\,D=${F0}`,600,330,54,1,CB));
  s+=label('cos の 箱',600,460,{size:26,color:CB,anchor:'middle',weight:700});
  return s;
 },
 [K+'eq2']:(p)=>{
  let s=T(`(k-m${O}^2)\\,C+${bR('b')}${O}\\,D=${F0}`,600,90,{size:40});
  s+=T(`-m${O}^2D-${bR('b')}${O}C+kD=0`,600,200,{size:40,opacity:.8});
  s+=fade(seg(p,.2,.35),boxT(`(k-m${O}^2)\\,D-${bR('b')}${O}\\,C=0`,600,330,52,1,SB));
  s+=fade(seg(p,.5,.65),L('C と D の 2本の 式',600,460,{size:28,color:C.hi,weight:700}));
  return s;
 },
 // ===== S4 =====
 [K+'amp']:(p)=>{
  const cx=280,cy=270,R=180,ang=Math.atan2(0.3,1),Cx=cx+R*Math.cos(ang),Cy=cy-R*Math.sin(ang);
  let s=ring(cx,cy,R,{color:C.faint,w:2})+line(cx-R-20,cy,cx+R+20,cy,{color:C.dim,w:2})+line(cx,cy+R+10,cx,cy-R-20,{color:C.dim,w:2});
  s+=line(cx,cy,Cx,cy,{color:CB,w:5})+line(Cx,cy,Cx,Cy,{color:SB,w:5})+line(cx,cy,Cx,Cy,{color:C.hi,w:4})+dot(Cx,Cy,8,C.hi);
  s+=label('C',(cx+Cx)/2,cy+34,{size:28,color:CB,anchor:'middle',weight:700})+label('D',Cx+14,(cy+Cy)/2+10,{size:28,color:SB,weight:700})+label('振幅',(cx+Cx)/2-20,(cy+Cy)/2-16,{size:26,color:C.hi,anchor:'middle',weight:700});
  s+=card(560,100,580,300,L('振動の 方程式・中級：円の 影',850,155,{size:24,color:C.dim})+T(`C\\cos ${O}${t}+D\\sin ${O}${t}`,850,230,{size:38})+fade(seg(p,.4,.55),T(`\\text{振幅}=\\sqrt{C^2+D^2}`,850,330,{size:44})),seg(p,0,.08));
  return s;
 },
 [K+'ab']:(p)=>{
  let s=card(110,40,980,120,T(`\\alpha=k-m${O}^2,\\qquad \\beta=${bR('b')}${O}`,600,100,{size:44}),seg(p,0,.08),C.hi);
  s+=fade(seg(p,.35,.5),T(`\\alpha C+\\beta D=${F0}`,600,250,{size:50}));
  s+=fade(seg(p,.5,.65),T(`\\alpha D-\\beta C=0`,600,370,{size:50}));
  return s;
 },
 [K+'sq1']:(p)=>{
  let s=T(`(\\alpha C+\\beta D)^2=${F0}^2`,600,100,{size:46});
  s+=fade(seg(p,.25,.4),boxT(`\\alpha^2C^2${cA('+2\\alpha\\beta CD')}+\\beta^2D^2=${F0}^2`,600,280,50,1,C.hi));
  return s;
 },
 [K+'sq2']:(p)=>{
  let s=T(`\\alpha^2C^2${cA('+2\\alpha\\beta CD')}+\\beta^2D^2=${F0}^2`,600,90,{size:42,opacity:.85});
  s+=T(`(\\alpha D-\\beta C)^2=0`,600,210,{size:44});
  s+=fade(seg(p,.25,.4),boxT(`\\alpha^2D^2${cA('-2\\alpha\\beta CD')}+\\beta^2C^2=0`,600,360,48,1,C.hi));
  return s;
 },
 [K+'add']:(p)=>{
  const s1=`\\alpha^2C^2${cA('+2\\alpha\\beta CD')}+\\beta^2D^2=${F0}^2`,s2=`\\alpha^2D^2${cA('-2\\alpha\\beta CD')}+\\beta^2C^2=0`;
  let s=T(s1,600,100,{size:44})+T(s2,600,200,{size:44})+line(260,250,940,250,{color:C.dim,w:2})+label('＋',230,212,{size:36,color:C.hi});
  const w1=texWidth(`\\alpha^2C^2`,44,false),wc=texWidth('+2\\alpha\\beta CD',44,false),W1=texWidth(s1,44,false),W2=texWidth(s2,44,false);
  const xc1=600-W1/2+w1+wc/2,xc2=600-W2/2+texWidth('\\alpha^2D^2',44,false)+wc/2;
  s+=fade(seg(p,.2,.35),line(xc1-wc/2,100-10,xc1+wc/2,100-30,{color:C.a,w:4})+line(xc2-wc/2,200-10,xc2+wc/2,200-30,{color:C.a,w:4}));
  s+=fade(seg(p,.35,.5),L('交差項は 打ち消し合う',600,330,{size:32,color:C.a,weight:700}));
  s+=fade(seg(p,.55,.7),T(`\\alpha^2C^2+\\beta^2D^2+\\alpha^2D^2+\\beta^2C^2=${F0}^2`,600,430,{size:40}));
  return s;
 },
 [K+'fac']:(p)=>{
  let s=T(`\\alpha^2C^2+\\beta^2D^2+\\alpha^2D^2+\\beta^2C^2=${F0}^2`,600,100,{size:40,opacity:.85});
  s+=fade(seg(p,.15,.3),L('α² ＋ β² で くくる',600,200,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),boxT(`(\\alpha^2+\\beta^2)(C^2+D^2)=${F0}^2`,600,340,54));
  return s;
 },
 [K+'root']:(p)=>{
  let s=T(`C^2+D^2=\\dfrac{${F0}^2}{\\alpha^2+\\beta^2}`,600,120,{size:46});
  s+=fade(seg(p,.25,.4),L('正の 平方根',600,230,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.4,.55),boxT(`\\sqrt{C^2+D^2}=\\dfrac{${F0}}{\\sqrt{\\alpha^2+\\beta^2}}`,600,370,52,1,C.hi,true));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=boxT(`A=\\dfrac{${F0}}{\\sqrt{(k-m${O}^2)^2+(${bR('b')}${O})^2}}`,600,200,60,1,C.F,true);
  s+=fade(seg(p,.45,.6),L('押されて 揺れる 振幅',600,400,{size:30,color:C.F,weight:700}));
  return s;
 },
 // ===== S5 =====
 [K+'n0']:(p)=>{
  let s=pushBox(0.3*Math.sin(2*Math.PI*2*p),{push:Math.cos(2*Math.PI*2*p)});
  s+=card(680,70,470,380,T('m=1\\ \\mathrm{kg}',915,140,{size:40})+T('k=100\\ \\mathrm{N/m}',915,215,{size:40})+T(`${bR('b')}=2\\ \\mathrm{kg/s}`,915,290,{size:40})+T(`${F0}=1\\ \\mathrm{N}`,915,370,{size:40}),seg(p,0,.08));
  return s;
 },
 [K+'n1']:(p)=>{
  const A=GA();let s=A.svg+fade(seg(p,.2,.35),dot(A.X(0),A.Y(0.01),9,C.hi)+label('0.010',A.X(0)+14,A.Y(0.01)-12,{size:24,color:C.hi,weight:700}));
  s+=card(720,90,430,300,T(`${O}=0`,935,150,{size:40})+T('A=\\dfrac{1}{100}=0.010\\ \\mathrm{m}',935,245,{size:38})+L('= F₀/k：伸ばした だけ',935,345,{size:24,color:C.dim}),seg(p,0,.08));
  return s;
 },
 [K+'n2']:(p)=>{
  const A=GA();let s=A.svg+dot(A.X(0),A.Y(0.01),8,C.hi)+fade(seg(p,.4,.55),dot(A.X(5),A.Y(0.0132),9,C.hi)+label('0.0132',A.X(5)+12,A.Y(0.0132)-12,{size:24,color:C.hi,weight:700}));
  s+=card(720,60,430,380,T(`${O}=5`,935,115,{size:40})+T(`k-m${O}^2=75`,935,185,{size:36})+T(`${bR('b')}${O}=10`,935,250,{size:36})+fade(seg(p,.3,.45),T('A=\\dfrac{1}{\\sqrt{5725}}\\approx0.0132',935,350,{size:36})),seg(p,0,.08));
  return s;
 },
 [K+'n3']:(p)=>{
  let s=T('C=\\dfrac{75}{5725}\\approx0.0131',330,120,{size:42})+T('D=\\dfrac{10}{5725}\\approx0.0017',870,120,{size:42});
  s+=fade(seg(p,.4,.55),boxT('\\sqrt{C^2+D^2}\\approx0.0132\\ \\mathrm{m}',600,330,50,1,C.F,true)+label('✓ 同じ',920,340,{size:30,color:C.F,weight:700}));
  return s;
 },
 [K+'n4']:(p)=>{
  const A=GA();let s=A.svg+dot(A.X(0),A.Y(0.01),8,C.hi)+dot(A.X(5),A.Y(0.0132),8,C.hi)+fade(seg(p,.35,.5),dot(A.X(10),A.Y(0.05),10,C.hi)+label('0.05',A.X(10)+14,A.Y(0.05)+6,{size:26,color:C.hi,weight:700}));
  s+=card(720,60,430,380,T(`${O}=10=\\omega_0`,935,115,{size:40})+T(`k-m${O}^2=0`,935,190,{size:38})+fade(seg(p,.3,.45),T('A=\\dfrac{1}{20}=0.05\\ \\mathrm{m}',935,285,{size:38}))+fade(seg(p,.55,.7),L('ゆっくり 押した ときの 5倍',935,385,{size:26,color:C.hi,weight:700})),seg(p,0,.08));
  return s;
 },
 [K+'n5']:(p)=>{
  const A=axes({x:90,y:220,w:1000,h:180,xmin:0,xmax:1.3,ymin:-1.2,ymax:1.2,xticks:[0.5,1],yticks:[],xlabel:'t [s]',xcolor:C.t});
  let s=A.svg+A.plot(u=>Math.cos(10*u),{from:0,to:1.27,color:C.F,w:3,dash:'8 6'})+A.plot(u=>Math.sin(10*u),{from:0,to:1.27,color:C.x,w:4,p:seg(p,.05,.5)});
  s+=label('力 cos 10t',A.X(0.66),A.Y(1)-12,{size:24,color:C.F})+label('揺れ（0.05 で 割った 形）',A.X(1.3),A.Y(-1)+34,{size:22,color:C.x,anchor:'end'});
  s+=fade(seg(p,.4,.55),arrow(A.X(0),A.Y(1.1),A.X(Math.PI/20),A.Y(1.1),{color:C.hi,w:4,head:12})+label('1/4 周期',A.X(Math.PI/40),A.Y(1.1)-14,{size:22,color:C.hi,anchor:'middle',weight:700}));
  s+=card(200,330,800,130,T(`C=0,\\ D=0.05:\\quad ${x}=0.05\\sin 10${t}`,600,395,{size:40}),seg(p,0,.08));
  return s;
 },
 [K+'n6']:(p)=>{
  const A=GA();let s=A.svg;[[0,0.01],[5,0.0132],[10,0.05]].forEach(([w,a])=>s+=dot(A.X(w),A.Y(a),8,C.hi));
  s+=fade(seg(p,.35,.5),dot(A.X(20),A.Y(0.0033),9,C.hi)+label('0.0033',A.X(20)-10,A.Y(0.0033)-16,{size:24,color:C.hi,weight:700,anchor:'end'}));
  s+=card(720,60,430,380,T(`${O}=20`,935,120,{size:40})+T(`k-m${O}^2=-300`,935,200,{size:36})+fade(seg(p,.3,.45),T('A\\approx0.0033\\ \\mathrm{m}',935,290,{size:40}))+fade(seg(p,.55,.7),L('速すぎ → ほとんど 揺れない',935,385,{size:26})),seg(p,0,.08));
  return s;
 },
 [K+'curve']:(p)=>{
  const A=GA();let s=A.svg;[[0,0.01],[5,0.0132],[10,0.05],[20,0.0033]].forEach(([w,a])=>s+=dot(A.X(w),A.Y(a),8,C.hi));
  s+=A.plot(w=>Amp(w),{from:0,to:21,color:C.hi,w:4,p:seg(p,.05,.6),steps:600});
  s+=line(A.X(10),A.Y(0),A.X(10),A.Y(0.056),{color:C.x,w:2,dash:'6 6'})+label('ω₀',A.X(10),A.Y(0)+56,{size:24,color:C.x,anchor:'middle'});
  s+=card(720,140,430,200,L('ω₀ の 近くに 山',935,215,{size:32,weight:700})+fade(seg(p,.5,.65),L('共振',935,290,{size:44,color:C.hi,weight:700})),seg(p,0,.08),C.hi);
  return s;
 },
 [K+'weak']:(p)=>{
  const A=GA({ymax:0.215,yticks:[0.05,0.1,0.15,0.2]});
  let s=A.svg+A.plot(w=>Amp(w),{from:0,to:21,color:C.hi,w:4,steps:600})+A.plot(w=>Amp(w,0.5),{from:0,to:21,color:C.a,w:4,p:seg(p,.1,.6),steps:1200});
  s+=label('b ＝ 2',A.X(12),A.Y(0.05)-8,{size:24,color:C.hi,weight:700})+fade(seg(p,.4,.55),label('b ＝ 0.5：0.2 m',A.X(10)+14,A.Y(0.2)+8,{size:24,color:C.a,weight:700}));
  s+=card(720,140,430,220,T(`A=\\dfrac{1}{0.5\\times10}=0.2\\ \\mathrm{m}`,935,215,{size:36})+fade(seg(p,.5,.65),L('細く、高い 山',935,300,{size:30,color:C.a,weight:700})),seg(p,0,.08));
  return s;
 },
 [K+'bal']:(p)=>{
  let s=card(80,70,480,300,L('押して 入る',320,140,{size:30,color:C.F,weight:700})+arrow(220,220,420,220,{color:C.F,w:8,head:20})+L('エネルギー',320,290,{size:28,color:C.E}),seg(p,0,.08),C.F);
  s+=card(640,70,480,300,L('抵抗で 失う',880,140,{size:30,color:C.a,weight:700})+arrow(780,220,980,220,{color:C.a,w:8,head:20})+L('エネルギー',880,290,{size:28,color:C.E}),seg(p,.2,.3),C.a);
  s+=fade(seg(p,.45,.6),L('つり合う → 振幅は 有限',600,450,{size:34,color:C.hi,weight:700}));
  return s;
 },
 [K+'peak']:(p)=>{
  const A=GA({xmin:8.5,xmax:11.5,xticks:[9,10,11],ymin:0.025,ymax:0.054,yticks:[0.03,0.04,0.05]});
  let s=A.svg+A.plot(w=>Amp(w),{from:8.6,to:11.4,color:C.hi,w:4,steps:400});
  s+=line(A.X(10),A.Y(0.025),A.X(10),A.Y(0.054),{color:C.x,w:2,dash:'6 6'})+label('ω₀',A.X(10)+8,A.Y(0.025)-10,{size:24,color:C.x});
  s+=fade(seg(p,.2,.35),dot(A.X(Math.sqrt(98)),A.Y(Amp(Math.sqrt(98))),9,C.a)+label('9.90',A.X(Math.sqrt(98))-12,A.Y(Amp(Math.sqrt(98)))-14,{size:24,color:C.a,anchor:'end',weight:700}));
  s+=card(720,120,430,260,L('山の 頂上',935,180,{size:28,color:C.dim})+T('\\approx 9.90\\ \\mathrm{rad/s}',935,250,{size:40})+fade(seg(p,.5,.65),L('抵抗が 弱いほど ω₀ に 近づく',935,330,{size:24})),seg(p,0,.08));
  return s;
 },
 // ===== S6 =====
 [K+'ex']:(p)=>{
  const items=[['ブランコ','揺れに 合わせて こぐ'],['ビル と 地震','固有の 周期 ≈ 揺れの 周期'],['ラジオの 選局','回路の 共振']];
  let s='';
  items.forEach(([a,b],i)=>{const xx=60+i*370;s+=card(xx,110,340,260,L(a,xx+170,200,{size:32,color:C.hi,weight:700})+L(b,xx+170,280,{size:24}),seg(p,.03+i*.2,.13+i*.2));});
  return s;
 },
 [K+'sum1']:(p)=>{
  let s=card(80,60,1040,120,label('① 箱に 分けて 係数を 比べる',120,132,{size:30,weight:700}),seg(p,0,.08));
  s+=card(80,200,1040,120,label('② 2乗して 足す → 交差項が 消える',120,272,{size:30,weight:700}),seg(p,.25,.35));
  s+=card(80,335,1040,160,T(`A=\\dfrac{${F0}}{\\sqrt{(k-m${O}^2)^2+(${bR('b')}${O})^2}}`,600,425,{size:38}),seg(p,.5,.6),C.F);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=T(`A=\\dfrac{${F0}}{\\sqrt{(k-m${O}^2)^2+(${bR('b')}${O})^2}}`,600,140,{size:52});
  s+=fade(seg(p,.15,.3),L('Ω ≈ ω₀ → ほぼ 0',470,300,{size:28,color:C.x,weight:700}));
  s+=fade(seg(p,.4,.55),L('b Ω だけが 抑える',800,300,{size:28,color:C.a,weight:700}));
  s+=fade(seg(p,.6,.75),L('→ 大きく 揺れる',600,410,{size:34,color:C.hi,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=pushBox(0.3*Math.sin(2*Math.PI*2*p),{push:0});
  s+=card(680,120,470,250,L('ここまで：',915,190,{size:28,color:C.dim})+L('大きさの ない 点',915,260,{size:34,weight:700}),seg(p,0,.08));
  return s;
 },
 [K+'next2']:(p)=>{
  const ang=2*Math.PI*0.5*p;
  let s='';
  // rod
  s+=fade(1,`<g transform="rotate(${ang*180/Math.PI} 230 250)">`+rect(110,240,240,20,{fill:C.x,fo:.4,stroke:C.x,sw:2,rx:6})+`</g>`+dot(230,250,6,C.hi)+L('棒',230,400,{size:28}));
  s+=fade(seg(p,.1,.2),ring(600,250,100,{color:C.x,w:3,fill:'#1d3350'})+line(600,250,600+100*Math.cos(ang),250+100*Math.sin(ang),{color:C.x,w:3})+L('円板',600,400,{size:28}));
  s+=fade(seg(p,.2,.3),ring(960,250,100,{color:C.x,w:3,fill:'#24304e'})+`<ellipse cx="960" cy="250" rx="100" ry="30" fill="none" stroke="${C.dim}" stroke-width="2"/>`+L('球',960,400,{size:28}));
  s+=fade(seg(p,.45,.6),L('回しにくさを 積分で 求めると？',600,470,{size:34,color:C.hi,weight:700}));
  return s;
 },
};
