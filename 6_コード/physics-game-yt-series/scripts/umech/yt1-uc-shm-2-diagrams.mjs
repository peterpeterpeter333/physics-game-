// YouTube シリーズ「単振動・上級 2/3」(ys-uc-shm-2) — 図。Stage 1200×515.
// 色：位置 x 水色、速度 v 紫、力 緑、時間 t 金、エネルギー 橙、抵抗の項 赤、新しい関数 y・強調 黄、確かめ 緑。
// 数値：m＝1 kg、k＝100 N/m、b＝2 kg/s → γ＝1、ω₀＝10、ωd＝√99≈9.95、周期≈0.63 s。A＝0.1 m：0.037（1 s）、0.014（2 s）。臨界 b＝20、過減衰 b＝40。
import {C,seg,fade,mix,label,line,rect,dot,ring,arrow,highlight,axes,texWidth,draw,wall,spring as coil} from './anim.mjs';
import {card,T,cc} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {cF,cV,cX,cT,cE,cH,cA,L,boxT,miniCurve} from './yt1-uc-shm-1-diagrams.mjs';

const K='uc-shm-2:';
const x=cX('x'),t=cT('t'),v=cV('v'),y=cH('y'),bR=s=>cc(C.a,s);
const d1=(q)=>`\\dfrac{d${q}}{d${t}}`,d2=(q)=>`\\dfrac{d^2${q}}{d${t}^2}`;
const EG=`e^{-\\gamma ${t}}`;
const EQ=`m${d2(x)}+${bR('b'+d1(x))}+k${x}=0`;

// spring + dashpot + block
function dampBox(X,{cx=330,y0=300,unit=120,g=1,F=0}={}){
 const bx=cx+unit*X;
 let s=wall(70,y0-110,y0+20)+line(70,y0+20,cx+unit*1.7,y0+20,{color:C.dim,w:3});
 s+=coil(70,bx-40,y0-75,{coils:8,amp:13,color:C.dim,w:3});
 // dashpot: cylinder fixed to wall, piston rod to block
 const cy=y0-22,cylL=70+40,cylR=Math.min(bx-60,70+150);
 s+=line(70,cy,cylL,cy,{color:C.a,w:3})+rect(cylL,cy-16,120,32,{fill:C.a,fo:.12,stroke:C.a,sw:2.5,rx:3});
 const pist=Math.max(cylL+20,Math.min(cylL+110,bx-150));
 s+=line(pist,cy-12,pist,cy+12,{color:C.a,w:4})+line(pist,cy,bx-40,cy,{color:C.a,w:3});
 s+=label('b',cylL+60,cy+46,{size:26,color:C.a,anchor:'middle',weight:700})+label('k',(70+bx-40)/2,y0-100,{size:26,color:C.dim,anchor:'middle',weight:700});
 s+=rect(bx-40,y0-100,80,120,{fill:C.x,fo:.3,stroke:C.x,sw:2,rx:8})+label('m',bx,y0-30,{size:30,color:C.ink,anchor:'middle',weight:700});
 s+=line(cx,y0+28,cx,y0+48,{color:C.dim,w:2})+label('0',cx,y0+76,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
const xd=(u,b=2)=>{ // numeric x(t) for m=1,k=100, x0=0.1, v0=0 (RK4)
 return xdCache(b)(u);
};
const cache={};
function xdCache(b){
 if(cache[b])return cache[b];
 const dt=0.002,N=3000,xs=new Float64Array(N+1);let X=0.1,V=0;xs[0]=X;
 const f=(X,V)=>[V,-100*X-b*V];
 for(let i=0;i<N;i++){const k1=f(X,V),k2=f(X+dt/2*k1[0],V+dt/2*k1[1]),k3=f(X+dt/2*k2[0],V+dt/2*k2[1]),k4=f(X+dt*k3[0],V+dt*k3[1]);X+=dt/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]);V+=dt/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]);xs[i+1]=X;}
 return cache[b]=u=>xs[Math.max(0,Math.min(N,Math.round(u/dt)))];
}
const GX=(o={})=>axes({x:90,y:300,w:560,h:200,xmin:0,xmax:5,ymin:-0.11,ymax:0.11,xticks:[1,2,3,4,5],yticks:[],grid:true,xlabel:'t [s]',xcolor:C.t,...o});
function dampGraph(A,{p=1,env=1,b=2}={}){
 let s=A.svg+A.plot(xdCache(b),{from:0,to:4.9,color:C.x,w:3,p,steps:900});
 if(b===2)s+=fade(env,A.plot(u=>0.1*Math.exp(-u),{from:0,to:4.9,color:C.hi,w:2.5,dash:'8 6'})+A.plot(u=>-0.1*Math.exp(-u),{from:0,to:4.9,color:C.hi,w:2.5,dash:'8 6'}));
 return s;
}

export const ytUcShm2Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  const X=Math.exp(-1.4*p)*Math.cos(2*Math.PI*3*p);
  let s=dampBox(X,{cx:330});
  s+=card(660,70,500,360,L('前回の 最後の 問い',910,118,{size:24,color:C.dim})
   +L('速度に 比例する 抵抗',910,185,{size:32,color:C.a,weight:700})
   +fade(seg(p,.35,.5),L('方程式 は？',910,265,{size:30}))
   +fade(seg(p,.5,.65),L('エネルギー は？',910,330,{size:30,color:C.E})),seg(p,0,.08),C.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=card(150,60,900,380,L('揺れは どのように 減る？',600,125,{size:34,color:C.hi,weight:700})
   +miniCurve(220,290,760,120,u=>Math.exp(-3*u)*Math.cos(2*Math.PI*7*u),{p:seg(p,.0,.9)}),seg(p,0,.08),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=card(80,70,500,330,L('空気抵抗・上級',330,120,{size:24,color:C.dim})+T(`m\\dfrac{d${v}}{d${t}}=mg-k${v}`,330,220,{size:40})+L('k：抵抗の 係数',330,320,{size:26,color:C.dim}),seg(p,0,.08));
  s+=card(620,70,500,330,L('今回',870,120,{size:24,color:C.dim})+L('ばね定数 k と 区別',870,200,{size:28})+fade(seg(p,.4,.55),T(`\\text{抵抗}=-${bR('b')}${v}`,870,300,{size:46})),seg(p,.3,.4),C.hi);
  return s;
 },
 // ===== S2 =====
 [K+'setup']:(p)=>{
  const X=0.6*Math.cos(2*Math.PI*1.2*p),Vv=-Math.sin(2*Math.PI*1.2*p);
  let s=dampBox(X,{cx:330});
  const bx=330+120*X;
  s+=arrow(bx,165,bx-X*110,165,{color:C.F,w:5,head:14})+label('−kx',bx-X*55,150,{size:26,color:C.F,anchor:'middle',weight:700});
  if(Math.abs(Vv)>.08)s+=arrow(bx,385,bx-Vv*90,385,{color:C.a,w:5,head:14})+label('−b dx/dt',bx-Vv*45,425,{size:24,color:C.a,anchor:'middle',weight:700});
  if(Math.abs(Vv)>.08)s+=arrow(bx,410+40,bx+Vv*90,450,{color:C.v,w:4,head:12})+label('動き',bx+Vv*100+(Vv>0?16:-16),458,{size:22,color:C.v,anchor:Vv>0?'start':'end'});
  s+=card(720,90,440,300,L('ばねの 力',940,150,{size:26,color:C.dim})+T(`-k${x}`,940,205,{size:42})+L('抵抗（動きと 逆向き）',940,275,{size:26,color:C.dim})+T(`-${bR('b')}${d1(x)}`,940,340,{size:42}),seg(p,0,.08));
  return s;
 },
 [K+'model']:(p)=>{
  let s=card(110,70,980,110,label('モデル（仮定）',150,138,{size:28,color:C.t,weight:700})+T(`\\text{抵抗}=-${bR('b')}\\,${v}`,700,128,{size:44}),seg(p,0,.08),C.t);
  // oil tank with plate
  const X=0.5*Math.cos(2*Math.PI*1.5*p);
  s+=fade(seg(p,.2,.35),rect(300,250,600,220,{fill:'#e7b45a',fo:.12,stroke:C.dim,sw:2,rx:6})+label('油',330,290,{size:26,color:C.E})
   +rect(590+X*160,270,20,180,{fill:C.x,fo:.5,stroke:C.x,sw:2,rx:3})+line(600+X*160,200,600+X*160,270,{color:C.dim,w:3})
   +L('ゆっくり 動く 板',600,500,{size:24,color:C.dim}));
  return s;
 },
 [K+'eom']:(p)=>{
  let s=T(`m\\,${cA('a')}=${cF('F')}`,600,95,{size:44,opacity:.8});
  s+=fade(seg(p,.1,.25),boxT(`m${d2(x)}=-k${x}-${bR('b'+d1(x))}`,600,290,58,1,C.hi,true));
  return s;
 },
 [K+'eom2']:(p)=>{
  let s=T(`m${d2(x)}=-k${x}-${bR('b'+d1(x))}`,600,100,{size:42,opacity:.8});
  s+=fade(seg(p,.12,.27),L('右辺の 2項を 左へ',600,205,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),boxT(EQ,600,350,60,1,C.F,true));
  s+=fade(seg(p,.6,.75),L('減衰の 方程式',600,480,{size:28,color:C.F,weight:700}));
  return s;
 },
 [K+'de']:(p)=>{
  let s=boxT(`${cE('E')}=\\tfrac12 m${v}^2+\\tfrac12 k${x}^2`,600,170,54,1,C.E,true);
  s+=fade(seg(p,.35,.5),T(`\\dfrac{d${cE('E')}}{d${t}}=\\;?`,600,370,{size:56}));
  return s;
 },
 [K+'de2']:(p)=>{
  let s=T(`\\dfrac{d}{d${t}}\\Big(\\tfrac12 m${v}^2\\Big)=m${v}\\,${d1(v)}`,600,120,{size:46});
  s+=fade(seg(p,.1,.2),L('連鎖律：外側 m v × 中身 dv/dt',600,215,{size:24,color:C.dim}));
  s+=fade(seg(p,.4,.55),T(`\\dfrac{d}{d${t}}\\Big(\\tfrac12 k${x}^2\\Big)=k${x}\\,${d1(x)}=k${x}${v}`,600,340,{size:46}));
  return s;
 },
 [K+'de3']:(p)=>{
  let s=T(`\\dfrac{d${cE('E')}}{d${t}}=m${v}${d1(v)}+k${x}${v}`,600,110,{size:46});
  s+=fade(seg(p,.15,.3),L('v で くくる',600,210,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),boxT(`\\dfrac{d${cE('E')}}{d${t}}=${v}\\Big(m${d1(v)}+k${x}\\Big)`,600,350,54,1,C.hi,true));
  return s;
 },
 [K+'de4']:(p)=>{
  let s=T(`m${d1(v)}+k${x}=-${bR('b')}${v}`,600,90,{size:42})+L('（減衰の 方程式から）',600,160,{size:24,color:C.dim});
  s+=T(`\\dfrac{d${cE('E')}}{d${t}}=${v}\\,(-${bR('b')}${v})`,600,270,{size:46});
  s+=fade(seg(p,.4,.55),boxT(`\\dfrac{d${cE('E')}}{d${t}}=-${bR('b')}${v}^2`,600,420,52,1,C.E,true));
  return s;
 },
 [K+'de5']:(p)=>{
  const A=axes({x:100,y:440,w:520,h:330,xmin:0,xmax:5,ymin:0,ymax:1.1,xticks:[1,2,3,4,5],yticks:[],grid:true,xlabel:'t [s]',ylabel:'E',xcolor:C.t,ycolor:C.E});
  const Ef=u=>{const h=.002,X=xdCache(2)(u),V=(xdCache(2)(u+h)-xdCache(2)(Math.max(0,u-h)))/(u>h?2*h:h);return (0.5*V*V+50*X*X)/0.5;};
  let s=A.svg+A.plot(Ef,{from:0,to:4.9,color:C.E,w:4,p:seg(p,.05,.8),steps:500});
  s+=card(680,110,470,280,T(`${v}^2\\ge0`,915,185,{size:44})+fade(seg(p,.3,.45),L('→ E は 増えない',915,265,{size:30,color:C.E,weight:700}))+fade(seg(p,.5,.65),L('（止まる 瞬間だけ 平ら）',915,330,{size:24,color:C.dim})),seg(p,0,.08));
  return s;
 },
 [K+'heat']:(p)=>{
  const X=0.5*Math.exp(-p)*Math.cos(2*Math.PI*2*p);
  let s=dampBox(X,{cx:330});
  for(let i=0;i<5;i++){const u=(p*2+i/5)%1;s+=fade(Math.sin(Math.PI*u)*seg(p,.1,.25),draw([[230+i*8,240-u*120],[240+i*8,225-u*120],[230+i*8,210-u*120]],1,{color:C.a,w:3}));}
  s+=card(680,110,470,280,L('減った エネルギー',915,170,{size:28,color:C.E})+fade(seg(p,.2,.35),L('→ 周りへ 熱として 移る',915,240,{size:30,color:C.a,weight:700}))+fade(seg(p,.45,.6),L('消えたのでは ない',915,320,{size:28})),seg(p,0,.08));
  return s;
 },
 // ===== S3 =====
 [K+'guess']:(p)=>{
  const A=GX({y:280,h:180});
  let s=dampGraph(A,{env:0,p:seg(p,0,.6)});
  s+=card(150,380,900,100,L('揺れの 幅は、どんな 形で 小さくなる？',600,442,{size:32,color:C.hi,weight:700}),seg(p,0,.08),C.hi);
  return s;
 },
 [K+'guess2']:(p)=>{
  const A=GX({y:280,h:180,w:500});
  let s=dampGraph(A,{env:seg(p,.35,.55)});
  s+=card(150,380,900,110,T(`\\text{幅}\\;\\propto\\;${EG}\\;?`,600,438,{size:48}),seg(p,0,.08));
  s+=card(720,70,440,120,L('空気抵抗：差が',940,115,{size:24,color:C.dim})+T(`e^{-${t}/${cT('\\tau')}}`,940,160,{size:36}),seg(p,0,.08));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=boxT(`${x}=${EG}\\times ${y}`,600,170,64,1,C.hi);
  s+=fade(seg(p,.3,.45),L('γ：まだ 決めない 正の 定数',600,330,{size:30}));
  s+=fade(seg(p,.5,.65),L('y：新しい 未知の 関数',600,400,{size:30,color:C.hi}));
  return s;
 },
 [K+'sub2']:(p)=>{
  let s=T(`${x}=${EG}\\times ${y}`,600,100,{size:46,opacity:.8});
  s+=card(110,180,450,200,L('変数分離',335,250,{size:30,color:C.dim})+L('×',335,320,{size:40,color:C.a,weight:700}),seg(p,.05,.15));
  s+=card(640,180,450,200,L('代入して 調べる',865,250,{size:30,color:C.F,weight:700})+L('y の 式は 簡単に なる？',865,320,{size:26}),seg(p,.2,.3),C.F);
  return s;
 },
 [K+'d1']:(p)=>{
  let s=T(`\\dfrac{d}{d${t}}${EG}=-\\gamma\\,${EG}`,600,95,{size:42});
  s+=fade(seg(p,.25,.4),L('積の 微分：(前の 微分)×後 ＋ 前×(後の 微分)',600,190,{size:24,color:C.dim}));
  s+=fade(seg(p,.4,.55),boxT(`${d1(x)}=${EG}\\Big(${d1(y)}-\\gamma ${y}\\Big)`,600,345,54,1,C.hi,true));
  return s;
 },
 [K+'d2']:(p)=>{
  let s=T(`${d2(x)}=\\dfrac{d}{d${t}}\\Big[${EG}\\Big(${d1(y)}-\\gamma ${y}\\Big)\\Big]`,600,95,{size:38});
  s+=fade(seg(p,.15,.3),T(`=${EG}\\Big(${d2(y)}${bR('-\\gamma'+d1(y))}${bR('-\\gamma'+d1(y))}+\\gamma^2${y}\\Big)`,600,225,{size:38}));
  s+=fade(seg(p,.45,.6),boxT(`=${EG}\\Big(${d2(y)}${bR('-2\\gamma'+d1(y))}+\\gamma^2${y}\\Big)`,600,390,44,1,C.hi,true));
  return s;
 },
 [K+'plug']:(p)=>{
  let s=T(`m\\,${EG}(\\cdots)+${bR('b')}\\,${EG}(\\cdots)+k\\,${EG}\\,${y}=0`,600,100,{size:40});
  s+=fade(seg(p,.25,.4),L(`e の −γt 乗 ≠ 0 → 割る、さらに ÷ m`,600,200,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.45,.6),T(`${d2(y)}-2\\gamma${d1(y)}+\\gamma^2${y}+\\dfrac{${bR('b')}}{m}\\Big(${d1(y)}-\\gamma${y}\\Big)+\\dfrac{k}{m}${y}=0`,600,350,{size:36}));
  return s;
 },
 [K+'coef']:(p)=>{
  let s=T(`${d2(y)}+\\Big(\\dfrac{${bR('b')}}{m}-2\\gamma\\Big)${d1(y)}+\\Big(\\gamma^2-\\dfrac{${bR('b')}}{m}\\gamma+\\dfrac{k}{m}\\Big)${y}=0`,600,140,{size:36});
  const w=texWidth(`\\Big(\\dfrac{b}{m}-2\\gamma\\Big)\\dfrac{dy}{dt}`,36,false);
  s+=highlight(600-texWidth(`${d2(y)}+\\Big(\\dfrac{${bR('b')}}{m}-2\\gamma\\Big)${d1(y)}+\\Big(\\gamma^2-\\dfrac{${bR('b')}}{m}\\gamma+\\dfrac{k}{m}\\Big)${y}=0`,36,false)/2+texWidth(`${d2(y)}+`,36,false)-8,70,w+16,120,seg(p,.2,.35));
  s+=fade(seg(p,.35,.5),L('dy/dt の 項を 集めた',600,290,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'choose']:(p)=>{
  let s=T(`\\Big(\\dfrac{${bR('b')}}{m}-2\\gamma\\Big)${d1(y)}`,600,100,{size:46});
  s+=fade(seg(p,.15,.3),boxT(`\\gamma=\\dfrac{${bR('b')}}{2m}`,600,265,56,1,C.F,true));
  s+=fade(seg(p,.45,.6),T(`\\Big(\\dfrac{${bR('b')}}{m}-\\dfrac{${bR('b')}}{m}\\Big)=0`,600,420,{size:44})+L('→ dy/dt の 項が 消える',900,425,{size:26,color:C.F}));
  return s;
 },
 [K+'ycoef']:(p)=>{
  let s=T(`\\gamma^2-\\dfrac{${bR('b')}}{m}\\gamma+\\dfrac{k}{m}`,600,100,{size:46});
  s+=fade(seg(p,.2,.35),L('b/m ＝ 2γ を 入れる',600,195,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.35,.5),T(`=\\gamma^2-2\\gamma^2+\\dfrac{k}{m}`,600,290,{size:46}));
  s+=fade(seg(p,.6,.75),boxT(`=\\dfrac{k}{m}-\\gamma^2`,600,425,48,1,C.hi,true));
  return s;
 },
 [K+'yeq']:(p)=>{
  let s=boxT(`${d2(y)}=-\\Big(\\dfrac{k}{m}-\\gamma^2\\Big)${y}`,600,170,56,1,C.hi,true);
  s+=fade(seg(p,.35,.5),T(`${d2(x)}=-\\omega^2${x}`,600,380,{size:46})+L('と 同じ 形',860,390,{size:28,color:C.F,weight:700}));
  return s;
 },
 [K+'ysol']:(p)=>{
  let s=T(`\\dfrac{k}{m}>\\gamma^2`,250,110,{size:44})+L('のとき',420,120,{size:26,color:C.dim});
  s+=fade(seg(p,.15,.3),T(`\\omega_d=\\sqrt{\\dfrac{k}{m}-\\gamma^2}`,800,110,{size:44}));
  s+=fade(seg(p,.4,.55),boxT(`${y}=A\\cos(\\omega_d ${t}+\\varphi)`,600,330,56,1,C.hi));
  return s;
 },
 [K+'xsol']:(p)=>{
  const A=GX({y:450,h:220,x:90,w:580});
  let s=dampGraph(A,{p:seg(p,.1,.8),env:seg(p,.35,.5)});
  s+=boxT(`${x}=A\\,${EG}\\cos(\\omega_d ${t}+\\varphi)`,600,95,44,1,C.F);
  s+=fade(seg(p,.5,.65),card(720,220,440,140,L('幅：',780,300,{size:28,color:C.hi,weight:700})+T(`A\\,${EG}`,970,290,{size:46}),1,C.hi));
  return s;
 },
 [K+'exact']:(p)=>{
  const rows=[['仮定（モデル）','抵抗 ＝ −b dx/dt',C.t],['条件','k/m ＞ γ²（抵抗が 弱い）',C.t],['結果','x ＝ A e^(−γt) cos(ωd t ＋ φ)',C.F],['近似？','なし（この モデルでは 正確）',C.F]];
  let s='';
  rows.forEach(([a,b,col],i)=>{const yy=50+i*108;s+=card(130,yy,940,92,label(a,170,yy+58,{size:28,color:col,weight:700})+(i===2?T(`${x}=A\\,${EG}\\cos(\\omega_d ${t}+\\varphi)`,830,yy+50,{size:34}):label(b,1030,yy+58,{size:28,color:C.ink,anchor:'end'})),seg(p,.02+i*.15,.12+i*.15));});
  return s;
 },
 // ===== S4 数値 =====
 [K+'n1']:(p)=>{
  let s=dampBox(0.5*Math.exp(-1.2*p)*Math.cos(2*Math.PI*4*p),{cx:330});
  s+=card(680,90,470,320,T(`m=1\\ \\mathrm{kg}`,915,160,{size:42})+T(`k=100\\ \\mathrm{N/m}`,915,245,{size:42})+T(`${bR('b')}=2\\ \\mathrm{kg/s}`,915,330,{size:42}),seg(p,0,.08));
  return s;
 },
 [K+'n2']:(p)=>{
  let s=T(`\\gamma=\\dfrac{${bR('b')}}{2m}=\\dfrac{2}{2\\times1}=1\\ \\mathrm{/s}`,600,130,{size:46});
  s+=fade(seg(p,.35,.5),T(`\\omega_0=\\sqrt{\\dfrac{k}{m}}=\\sqrt{100}=10\\ \\mathrm{rad/s}`,600,320,{size:46})+L('抵抗が 無い ときの 角振動数',600,430,{size:26,color:C.dim}));
  return s;
 },
 [K+'n3']:(p)=>{
  let s=T(`\\omega_d=\\sqrt{100-1}=\\sqrt{99}\\approx 9.95\\ \\mathrm{rad/s}`,600,130,{size:46});
  s+=fade(seg(p,.4,.55),T(`${cT('T')}=\\dfrac{2\\pi}{9.95}\\approx 0.63\\ \\mathrm{s}`,600,310,{size:50}));
  return s;
 },
 [K+'n4']:(p)=>{
  const A=axes({x:100,y:300,w:1000,h:200,xmin:0,xmax:1.3,ymin:-1.15,ymax:1.15,xticks:[0.5,1],yticks:[],xlabel:'t [s]',xcolor:C.t});
  let s=A.svg+A.plot(u=>Math.cos(10*u),{from:0,to:1.27,color:C.faint,w:3,dash:'8 6'})+A.plot(u=>Math.cos(Math.sqrt(99)*u),{from:0,to:1.27,color:C.x,w:4,p:seg(p,.05,.6)});
  s+=label('ω₀ ＝ 10',A.X(1.27),A.Y(1)-6,{size:24,color:C.dim,anchor:'end'});
  s+=card(250,370,700,110,L('ωd ＝ 9.95：ω₀ より 約 0.5% 小さい',600,435,{size:30,color:C.hi,weight:700}),seg(p,.4,.5));
  return s;
 },
 [K+'n5']:(p)=>{
  const A=axes({x:110,y:440,w:540,h:330,xmin:0,xmax:3.3,ymin:0,ymax:1.1,xticks:[1,2,3],yticks:[0.5,1],grid:true,xlabel:'t [s]',ylabel:'幅の 倍率',xcolor:C.t,ycolor:C.hi});
  let s=A.svg+A.plot(u=>Math.exp(-u),{from:0,to:3.2,color:C.hi,w:4,p:seg(p,.05,.6)});
  [[1,'0.37'],[2,'0.14'],[3,'0.05']].forEach(([u,txt],i)=>{s+=fade(seg(p,.2+i*.15,.3+i*.15),dot(A.X(u),A.Y(Math.exp(-u)),8,C.hi)+label(txt,A.X(u)+10,A.Y(Math.exp(-u))-14,{size:24,color:C.hi,weight:700}));});
  s+=card(700,120,450,240,T(`${EG}=e^{-${t}}`,925,190,{size:44})+L('（γ ＝ 1 /s）',925,250,{size:24,color:C.dim})+L('1秒 ごとに × 0.37',925,320,{size:28,weight:700}),seg(p,0,.08));
  return s;
 },
 [K+'n6']:(p)=>{
  const A=GX({y:280,h:220,x:90,w:640});
  let s=dampGraph(A,{p:1,env:1});
  [[1,'0.037 m'],[2,'0.014 m']].forEach(([u,txt],i)=>{s+=fade(seg(p,.15+i*.25,.25+i*.25),dot(A.X(u),A.Y(0.1*Math.exp(-u)),8,C.hi)+label(txt,A.X(u)+12,A.Y(0.1*Math.exp(-u))-16,{size:24,color:C.hi,weight:700}));});
  s+=label('0.1 m',A.X(0)-12,A.Y(0.1)+8,{size:22,color:C.x,anchor:'end'});
  s+=card(170,410,860,90,T(`\\pm 0.1\\,e^{-${t}}`,400,452,{size:38})+L('の 点線の 中で 揺れる',720,462,{size:28}),seg(p,.6,.7));
  return s;
 },
 [K+'n7']:(p)=>{
  let s=T(`${cE('E')}\\propto(\\text{幅})^2`,600,90,{size:46});
  s+=fade(seg(p,.2,.35),T(`(e^{-${t}})^2=e^{-2${t}}`,600,200,{size:46}));
  s+=fade(seg(p,.4,.55),T(`e^{-2}\\approx 0.14`,600,310,{size:46})+L('1秒で',380,318,{size:26,color:C.dim}));
  s+=fade(seg(p,.6,.75),L('近似：抵抗が 弱く、1周期で ならした 値',600,430,{size:28,color:C.t,weight:700}));
  return s;
 },
 // ===== S5 =====
 [K+'over']:(p)=>{
  let s=T(`${d2(y)}=-\\Big(\\dfrac{k}{m}-\\gamma^2\\Big)${y}`,600,100,{size:46});
  s+=fade(seg(p,.2,.35),T(`\\dfrac{k}{m}\\le\\gamma^2`,600,230,{size:46})+L('抵抗が 強い',820,238,{size:28,color:C.a,weight:700}));
  s+=fade(seg(p,.45,.6),T(`${d2(y)}=(\\gamma^2-\\tfrac{k}{m})\\,${y}`,520,380,{size:46})+L('0 か 正',880,388,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'over2']:(p)=>{
  const A=GX({y:280,h:200,x:90,w:640});
  let s=A.svg+A.plot(xdCache(40),{from:0,to:4.9,color:C.x,w:4,p:seg(p,.1,.8),steps:600});
  s+=card(170,400,860,90,L('戻す 向きの 力が 無い → 行ったり来たり しない',600,455,{size:28,color:C.hi,weight:700}),seg(p,.3,.4));
  return s;
 },
 [K+'crit']:(p)=>{
  let s=T(`\\dfrac{k}{m}=\\gamma^2=\\dfrac{${bR('b')}^2}{4m^2}`,600,100,{size:46});
  s+=fade(seg(p,.2,.35),T(`${bR('b')}=2\\sqrt{mk}`,600,240,{size:52}));
  s+=fade(seg(p,.45,.6),T(`=2\\sqrt{1\\times100}=20\\ \\mathrm{kg/s}`,600,350,{size:46})+L('臨界減衰',600,450,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'cmp']:(p)=>{
  const A=axes({x:90,y:290,w:580,h:220,xmin:0,xmax:2,ymin:-0.11,ymax:0.11,xticks:[0.5,1,1.5,2],yticks:[],grid:true,xlabel:'t [s]',xcolor:C.t});
  let s=A.svg;
  [[2,C.x,'b ＝ 2'],[20,C.hi,'b ＝ 20（臨界）'],[40,C.a,'b ＝ 40（過減衰）']].forEach(([b,col,txt],i)=>{s+=A.plot(xdCache(b),{from:0,to:1.95,color:col,w:4,p:seg(p,.05+i*.2,.35+i*.2),steps:600})+fade(seg(p,.05+i*.2,.15+i*.2),label(txt,790,150+i*55,{size:28,color:col,weight:700}));});
  s+=fade(seg(p,.7,.85),card(170,400,860,90,L('20・40 は 往復 なし。40 は 20 より 戻るのが 遅い',600,455,{size:28,weight:700}),1));
  return s;
 },
 // ===== S6 =====
 [K+'sum']:(p)=>{
  let s=card(90,60,1020,160,T(EQ,600,140,{size:46}),seg(p,0,.08));
  s+=card(90,260,1020,160,T(`\\dfrac{d${cE('E')}}{d${t}}=-${bR('b')}${v}^2\\le0`,600,340,{size:48}),seg(p,.3,.4),C.E);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(90,40,1020,120,T(`${x}=${EG}\\,${y},\\quad \\gamma=\\dfrac{${bR('b')}}{2m}`,600,100,{size:42}),seg(p,0,.08));
  s+=card(90,190,1020,120,T(`${d2(y)}=-\\Big(\\dfrac{k}{m}-\\gamma^2\\Big)${y}`,600,250,{size:40}),seg(p,.25,.35));
  s+=card(90,340,1020,120,T(`\\text{幅}=A\\,${EG}`,600,400,{size:44}),seg(p,.5,.6),C.F);
  return s;
 },
 [K+'next']:(p)=>{
  const X=0.5*Math.cos(2*Math.PI*2*p);
  let s=dampBox(X,{cx:330});
  const bx=330+120*X;
  s+=fade(seg(p,.2,.35),arrow(bx+60,240,bx+60+70*Math.cos(2*Math.PI*2*p),240,{color:C.F,w:6,head:16})+label('押す',bx+60,215,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=card(680,110,470,280,L('失う 分を',915,180,{size:30})+L('周期的に 押して 補う と？',915,250,{size:30,color:C.hi,weight:700}),seg(p,0,.08),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(150,60,900,380,L('押す 周期 ≈ 自分の 揺れの 周期',600,130,{size:32,color:C.hi,weight:700})
   +fade(seg(p,.2,.35),miniCurve(220,300,760,100,u=>(1-Math.exp(-4*u))*Math.sin(2*Math.PI*7*u),{p:seg(p,.2,.9)}))
   +fade(seg(p,.5,.65),L('なぜ 大きく 揺れる？',600,425,{size:32,color:C.hi,weight:700})),seg(p,0,.08),C.hi);
  return s;
 },
};
