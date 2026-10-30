// YouTube シリーズ 運動方程式・中級 3/3（ステージ um-constant-force-derive 本6〜本9＋補8・補9）— 図。Stage 1200×515.
// 色：位置 x・y・x₀ 水色、速度 v・v₀ 紫、加速度 a・g 赤、時刻 t 金、強調 黄、誤り 赤。
// 台形の2色：長方形（v₀t）は紫、三角形（½at²）は黄。式の2項も同じ色。
// v–t：v＝4＋2t、0〜3 s → 12＋9＝21 m。静止から a＝2：三角形 9 m（18 m は誤り）。投げ上げ：v＝10−10t、y＝10t−5t²。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,ground,block,poly} from './anim.mjs';

const K='um-constant-force-derive-3:';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const V0=`{\\color{${C.v}}v_0}`,X0=`{\\color{${C.x}}x_0}`,Y_=`{\\color{${C.x}}y}`,Y0=`{\\color{${C.x}}y_0}`,G_=`{\\color{${C.a}}g}`,S_=`{\\color{${C.t}}s}`;
const HALF=`{\\color{${C.hi}}\\tfrac12}`;
const CR=C.v,CT=C.hi; // rectangle / triangle colours

// v–t graph for v = 4 + 2t
const GV=(o={})=>axes({x:90,y:455,w:560,h:370,xmin:0,xmax:3.6,ymin:0,ymax:12,xlabel:'t [s]',ylabel:'v [m/s]',xticks:[1,2,3],yticks:[4,8,12],xcolor:C.t,ycolor:C.v,...o});
const vl=t=>4+2*t;
function trapParts(G,{rg=1,tg=1,T=3,v0=4,a=2,fo=.3,outline=1}={}){
 let s='';
 s+=fade(rg,poly([[G.X(0),G.Y(0)],[G.X(0),G.Y(v0)],[G.X(T),G.Y(v0)],[G.X(T),G.Y(0)]],{fill:CR,fo,stroke:outline?CR:'none',sw:2}));
 s+=fade(tg,poly([[G.X(0),G.Y(v0)],[G.X(T),G.Y(v0+a*T)],[G.X(T),G.Y(v0)]],{fill:CT,fo,stroke:outline?CT:'none',sw:2}));
 return s;
}

export const ytUmConstantForceDerive3Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(vl,{from:0,to:3.5,p:seg(p,.1,.5),color:C.v,w:5})+fade(seg(p,.1,.25),dot(G.X(0),G.Y(4),10,C.v)+label('v₀',G.X(0)+14,G.Y(4)+34,{size:26,color:C.v,weight:700}));
  s+=card(720,120,440,240,label('1回 積分 ＋ 初期条件',940,185,{size:28,color:C.dim,anchor:'middle'})+tex(`v=${V0}+at`,940,275,{size:54}),seg(p,.3,.45));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=card(150,40,900,420,label('前回の 最後の問い',600,90,{size:24,color:C.dim,anchor:'middle'})
   +tex(`v=${V0}+at\\;\\;\\longrightarrow\\;\\;x=\\ ?`,600,190,{size:54})
   +fade(seg(p,.45,.6),tex(`x=${V0}t+${HALF}at^2`,600,310,{size:52})+label('の ½ は どこから？',600,405,{size:36,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'promise']:(p)=>{
  const T=['0','0.5','1.0','1.5','2.0'],X=['0','0.25','1.00','2.25','4.00'],Q=['0','0.25','1','2.25','4'];
  let tb=label('t [s]',180,85,{size:24,color:C.t,anchor:'middle',weight:700})+label('x [m]',330,85,{size:24,color:C.x,anchor:'middle',weight:700})+label('t²',470,85,{size:24,color:C.ink,anchor:'middle',weight:700})+line(110,102,530,102,{color:C.faint,w:2});
  T.forEach((t,i)=>{const y=145+i*55;tb+=label(t,180,y,{size:26,color:C.t,anchor:'middle'})+label(X[i],330,y,{size:26,color:C.x,anchor:'middle',weight:700})+fade(seg(p,.1+.05*i,.2+.05*i),label(Q[i],470,y,{size:26,color:C.ink,anchor:'middle'}));});
  let s=card(90,40,470,420,tb,1);
  s+=card(620,60,540,380,label('初級（2 kg に 4 N）',890,110,{size:24,color:C.dim,anchor:'middle'})+tex('x=t^2=\\tfrac12\\cdot 2\\cdot t^2',890,190,{size:44})
   +fade(seg(p,.55,.7),label('½ の 出どころは',890,300,{size:30,color:C.ink,anchor:'middle'})+label('積分から 導く（約束）',890,355,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.25,.4),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=tex(`x=${X0}+${V0}t+${HALF}at^2`,600,110,{size:64});
  s+=card(120,250,450,170,label('½ は',345,315,{size:30,color:C.ink,anchor:'middle'})+label('どこから？',345,375,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  s+=card(630,250,450,170,label('初めの 位置 x₀ は',855,315,{size:30,color:C.x,anchor:'middle',weight:700})+label('どこから？',855,375,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },

 // ===== S2 台形を二つに分ける =====
 [K+'area']:(p)=>{
  const G=GV();const n=12,w=3/n;
  let s=G.svg+G.plot(vl,{from:0,to:3.5,color:C.v,w:4});
  for(let i=0;i<n;i++){const t0=i*w,g=seg(p,.1+.05*i,.16+.05*i);s+=fade(g,rect(G.X(t0),G.Y(vl(t0+w/2)),G.X(t0+w)-G.X(t0)-2,G.Y(0)-G.Y(vl(t0+w/2)),{fill:C.x,fo:.25,stroke:C.x,sw:1.5,rx:1}));}
  s+=card(720,110,440,260,label('速度 × 時間 の 短冊',940,180,{size:28,color:C.ink,anchor:'middle'})+label('を 足す',940,225,{size:28,color:C.ink,anchor:'middle'})+label('→ 進んだ 距離',940,300,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 [K+'xint']:(p)=>{
  let s=tex(`x=\\int\\bigl(${V0}+at\\bigr)\\,dt`,600,170,{size:76});
  s+=fade(seg(p,.4,.55),label('速度を 時間で 積分 → 位置',600,340,{size:32,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'trap']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(vl,{from:0,to:3.5,color:C.v,w:5})+dot(G.X(0),G.Y(4),9,C.v);
  s+=fade(seg(p,.4,.55),poly([[G.X(0),G.Y(0)],[G.X(0),G.Y(4)],[G.X(3),G.Y(10)],[G.X(3),G.Y(0)]],{fill:C.x,fo:.25,stroke:C.x,sw:2}));
  s+=card(720,110,440,250,tex('v_0=4,\\quad a=2',940,175,{size:40})+label('0 〜 3 秒',940,245,{size:28,color:C.t,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('→ 台形',940,310,{size:34,color:C.x,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'split']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(vl,{from:0,to:3.5,color:C.v,w:5});
  s+=trapParts(G,{rg:seg(p,.3,.45),tg:seg(p,.55,.7)});
  s+=fade(seg(p,.1,.25),line(G.X(0),G.Y(4),G.X(3.3),G.Y(4),{color:C.ink,w:3,dash:'8 6'}));
  s+=card(720,90,440,300,fade(seg(p,.3,.45),label('下：長方形',940,160,{size:30,color:CR,anchor:'middle',weight:700})+label('（高さ v₀）',940,205,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('上：三角形',940,280,{size:30,color:CT,anchor:'middle',weight:700})+label('（傾きの 分）',940,325,{size:24,color:C.dim,anchor:'middle'})),1);
  return s;
 },
 [K+'rectA']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(vl,{from:0,to:3.5,color:C.v,w:5})+trapParts(G,{tg:.35,fo:.45});
  s+=label('v₀',G.X(0)-40,G.Y(2)+8,{size:26,color:CR,weight:700})+label('t',G.X(1.5),G.Y(0)+36,{size:26,color:C.t,anchor:'middle',weight:700});
  s+=card(720,110,440,260,label('長方形',940,170,{size:28,color:CR,anchor:'middle',weight:700})+tex(`${V0}\\times t=${V0}t`,940,245,{size:46})
   +fade(seg(p,.5,.65),tex('4\\times 3=12\\ \\mathrm{m}',940,320,{size:40})),seg(p,.1,.25));
  return s;
 },
 [K+'triA']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(vl,{from:0,to:3.5,color:C.v,w:5})+trapParts(G,{rg:.35,fo:.45});
  s+=fade(seg(p,.1,.25),label('底辺 t',G.X(1.5),G.Y(4)+34,{size:24,color:C.t,anchor:'middle',weight:700})+label('高さ at',G.X(3)+12,G.Y(7)+8,{size:24,color:CT,weight:700}));
  s+=card(720,90,440,300,label('三角形',940,150,{size:28,color:CT,anchor:'middle',weight:700})+tex('\\dfrac{t\\times at}{2}',940,235,{size:44})
   +fade(seg(p,.5,.65),tex(`=${HALF}at^2`,940,330,{size:48})),seg(p,.2,.35));
  return s;
 },
 [K+'half']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(vl,{from:0,to:3.5,color:C.v,w:4});
  s+=poly([[G.X(0),G.Y(4)],[G.X(3),G.Y(10)],[G.X(3),G.Y(4)]],{fill:CT,fo:.45,stroke:CT,sw:2});
  s+=fade(seg(p,.2,.35),poly([[G.X(0),G.Y(4)],[G.X(0),G.Y(10)],[G.X(3),G.Y(10)]],{fill:C.dim,fo:.18,stroke:C.dim,sw:2})+label('同じ 大きさ',G.X(.9),G.Y(8.6)+8,{size:22,color:C.dim,anchor:'middle'})+line(G.X(0),G.Y(10),G.X(3),G.Y(10),{color:C.dim,w:2,dash:'7 6'})+line(G.X(0),G.Y(4),G.X(0),G.Y(10),{color:C.dim,w:2,dash:'7 6'}));
  s+=card(720,110,440,260,label('三角形 ＝ 長方形の',940,180,{size:28,color:C.ink,anchor:'middle'})+label('ちょうど 半分',940,235,{size:34,color:CT,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('→ ½ が 出る',940,315,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'triNum']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(vl,{from:0,to:3.5,color:C.v,w:5})+trapParts(G,{fo:.4});
  s+=label('12',G.X(1.5),G.Y(2)+10,{size:34,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.05,.2),label('9',G.X(2.1),G.Y(6.2)+10,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=card(720,90,440,300,tex('\\tfrac12\\times 3\\times 6=9\\ \\mathrm{m}',940,160,{size:40})
   +fade(seg(p,.4,.55),tex('12+9=21\\ \\mathrm{m}',940,260,{size:48})),1);
  return s;
 },
 [K+'shoki']:(p)=>{
  const G1=axes({x:70,y:440,w:440,h:320,xmin:0,xmax:3.4,ymin:0,ymax:12,xlabel:'t',ylabel:'v',xcolor:C.t,ycolor:C.v});
  const G2=axes({x:680,y:440,w:440,h:320,xmin:0,xmax:3.4,ymin:0,ymax:12,xlabel:'t',ylabel:'v',xcolor:C.t,ycolor:C.v,g:seg(p,.4,.55)});
  let s=label('初級：0.5 秒ごとの 台形',290,60,{size:28,color:C.dim,anchor:'middle'})+G1.svg+G1.plot(vl,{from:0,to:3.2,color:C.v,w:4});
  for(let i=0;i<6;i++){const a=i*.5,b=a+.5;s+=poly([[G1.X(a),G1.Y(0)],[G1.X(a),G1.Y(vl(a))],[G1.X(b),G1.Y(vl(b))],[G1.X(b),G1.Y(0)]],{fill:C.x,fo:.22,stroke:C.x,sw:2});}
  s+=fade(seg(p,.4,.55),label('今回：一度に 2つ',900,60,{size:28,color:C.hi,anchor:'middle',weight:700})+G2.plot(vl,{from:0,to:3.2,color:C.v,w:4})+trapParts(G2,{fo:.4}));
  return s;
 },

 // ===== S3 積分でも同じ ½ =====
 [K+'intsplit']:(p)=>{
  let s=tex(`\\int\\bigl(${V0}+at\\bigr)\\,dt`,600,100,{size:56});
  s+=fade(seg(p,.35,.55),tex(`=\\int ${V0}\\,dt+\\int at\\,dt`,600,260,{size:56}));
  s+=fade(seg(p,.6,.75),label('項ごとに 積分',600,400,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'int1']:(p)=>{
  let s=tex(`\\int ${V0}\\,dt=${V0}t`,420,150,{size:62});
  s+=fade(seg(p,.1,.25),label('v₀ は 定数',420,280,{size:30,color:C.dim,anchor:'middle'}));
  s+=card(760,90,380,240,rect(830,160,240,110,{fill:CR,fo:.4,stroke:CR,sw:2,rx:2})+label('長方形の 面積',950,305,{size:28,color:CR,anchor:'middle',weight:700}),seg(p,.4,.55),CR);
  return s;
 },
 [K+'int2']:(p)=>{
  let s=tex('\\int at\\,dt=a\\int t\\,dt',600,85,{size:52});
  s+=fade(seg(p,.2,.35),label('t の 原始関数を 探す',600,185,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),tex('\\dfrac{d}{dt}\\Bigl(\\dfrac{t^2}{2}\\Bigr)=\\dfrac{2t}{2}=t',600,300,{size:52})+ok(870,312));
  s+=fade(seg(p,.7,.85),label('（積分・中級で 見た）',600,430,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'int3']:(p)=>{
  const f=`\\int at\\,dt=a\\cdot\\dfrac{t^2}{2}=${HALF}at^2`;
  let s=tex(f,600,110,{size:56});
  s+=card(120,260,440,180,label('三角形の ½',340,330,{size:32,color:CT,anchor:'middle',weight:700})+label('底辺 × 高さ ÷ 2',340,385,{size:26,color:C.dim,anchor:'middle'}),seg(p,.3,.45),CT);
  s+=fade(seg(p,.45,.6),label('＝',600,365,{size:48,color:C.ink,anchor:'middle',weight:700}));
  s+=card(640,260,440,180,label('積分の ½',860,330,{size:32,color:CT,anchor:'middle',weight:700})+label('t → t²/2',860,385,{size:26,color:C.dim,anchor:'middle'}),seg(p,.45,.6),CT);
  return s;
 },
 [K+'check']:(p)=>{
  const q=[`\\dfrac{d}{dt}\\Bigl(${HALF}at^2\\Bigr)`,`=${HALF}a\\cdot 2t`,'=at'],z=56,ws=q.map(e=>texWidth(e,z)),W=ws[0]+ws[1]+ws[2]+30,x0=600-W/2;
  let s=tex(q[0],x0,160,{size:z,anchor:'start'});
  s+=fade(seg(p,.2,.4),tex(q[1],x0+ws[0]+15,160,{size:z,anchor:'start'}));
  s+=fade(seg(p,.5,.65),tex(q[2],x0+ws[0]+ws[1]+30,160,{size:z,anchor:'start'})+ok(x0+W+14,172));
  s+=fade(seg(p,.35,.5),label('t² の 2 と ½ が 打ち消す',600,330,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'foot']:(p)=>{
  let s=tex(`x=${V0}t+${HALF}at^2`,600,130,{size:70});
  s+=card(230,260,740,150,label('½ ＝ t を 積分した 足跡',600,350,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.3),C.hi);
  return s;
 },

 // ===== S4 2回目の積分定数 =====
 [K+'D']:(p)=>{
  let s=tex(`x=\\int\\bigl(${V0}+at\\bigr)\\,dt`,600,90,{size:48});
  s+=fade(seg(p,.2,.4),tex(`x=${V0}t+${HALF}at^2+{\\color{${C.x}}D}`,600,250,{size:62}));
  s+=fade(seg(p,.5,.65),label('D：2回目の 積分定数',600,400,{size:32,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'Dt0']:(p)=>{
  let s=tex(`x(0)=${V0}\\cdot 0+${HALF}a\\cdot 0^2+{\\color{${C.x}}D}={\\color{${C.x}}D}`,600,110,{size:48});
  s+=fade(seg(p,.5,.65),tex(`{\\color{${C.x}}D}=${X0}`,600,270,{size:66}));
  s+=fade(seg(p,.65,.8),label('初めの 位置',600,400,{size:32,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'full']:(p)=>{
  const z=84,parts=['x={}',`${X0}`,`{}+${V0}t`,`{}+${HALF}at^2`],ws=parts.map(q=>texWidth(q,z)),gap=10,W=ws.reduce((a,b)=>a+b,0)+gap*3,x0=600-W/2;
  const xs=[];let cx=x0;ws.forEach(w=>{xs.push(cx);cx+=w+gap;});
  let s=parts.map((q,k)=>tex(q,xs[k],150,{size:z,anchor:'start'})).join('');
  s+=highlight(x0-20,50,W+40,180,seg(p,.2,.35));
  const pw=texWidth('{}+{}',z)+4;
  const br=(k,txt,col,ly,g)=>{const a=xs[k]+(k>1?pw:0),b=xs[k]+ws[k];return fade(g,brace(a,b,240,{color:col})+label(txt,(a+b)/2,ly,{size:26,color:col,anchor:'middle',weight:700}));};
  s+=br(1,'初めの 位置',C.x,300,seg(p,.4,.55))+br(2,'初めの 速度の 分',C.v,365,seg(p,.55,.7))+br(3,'加速度の 分',C.a,300,seg(p,.7,.85));
  return s;
 },
 [K+'bounds']:(p)=>{
  let s=tex(`x(t)-${X0}=\\int_0^t\\bigl(${V0}+a${S_}\\bigr)\\,d${S_}`,600,110,{size:56});
  s+=fade(seg(p,.25,.4),tex(`=${V0}t+${HALF}at^2`,600,250,{size:56}));
  s+=fade(seg(p,.55,.7),label('x₀ を 最初から 残す → 定数を 忘れない',600,400,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'two']:(p)=>{
  const bx=(x,t,c,g)=>fade(g,rect(x-120,150,240,100,{fill:'#131f38',fo:1,stroke:c,sw:3,rx:14})+label(t,x,212,{size:34,color:c,anchor:'middle',weight:700}));
  let s=bx(220,'加速度 a',C.a,1)+bx(600,'速度 v',C.v,1)+bx(980,'位置 x',C.x,1);
  s+=arrow(345,200,475,200,{color:C.dim,w:4,head:14})+label('1回目の 積分',410,130,{size:22,color:C.dim,anchor:'middle'});
  s+=arrow(725,200,855,200,{color:C.dim,w:4,head:14})+label('2回目の 積分',790,130,{size:22,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.2),label('＋ v₀',600,300,{size:32,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),label('＋ x₀',980,300,{size:32,color:C.x,anchor:'middle',weight:700}));
  s+=card(220,350,760,100,label('初めの 速度 と 初めの 位置 → 2つの 定数',600,410,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(250,80,700,340,label('確かめ',600,130,{size:26,color:C.dim,anchor:'middle'})
   +label('静止から',600,200,{size:32,color:C.v,anchor:'middle',weight:700})+tex('a=2\\ \\mathrm{m/s^2},\\quad 3\\ \\mathrm{s}',600,270,{size:42})
   +label('何 m 進む？',600,370,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ans']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(t=>2*t,{from:0,to:3.5,color:C.v,w:5})+dot(G.X(0),G.Y(0),9,C.v);
  s+=fade(seg(p,.05,.2),poly([[G.X(0),G.Y(0)],[G.X(3),G.Y(6)],[G.X(3),G.Y(0)]],{fill:CT,fo:.45,stroke:CT,sw:2}));
  s+=card(700,70,470,340,label('v₀ ＝ 0 → 三角形 だけ',935,130,{size:28,color:C.ink,anchor:'middle'})+tex(`${HALF}\\times 2\\times 3^2=9\\ \\mathrm{m}`,935,215,{size:42})
   +fade(seg(p,.55,.7),label('初級：x ＝ t²',935,300,{size:26,color:C.dim,anchor:'middle'})+tex('3^2=9\\ \\mathrm{m}',935,360,{size:40})+ok(1040,368)),seg(p,.1,.25));
  return s;
 },
 [K+'wrong']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(t=>2*t,{from:0,to:3.5,color:C.v,w:5});
  s+=poly([[G.X(0),G.Y(0)],[G.X(3),G.Y(6)],[G.X(3),G.Y(0)]],{fill:CT,fo:.45,stroke:CT,sw:2});
  s+=fade(seg(p,.05,.2),rect(G.X(0),G.Y(6),G.X(3)-G.X(0),G.Y(0)-G.Y(6),{fill:'none',fo:0,stroke:C.a,sw:3,rx:2})+label('6 × 3 ＝ 18',G.X(1),G.Y(6)-14,{size:26,color:C.a,anchor:'middle',weight:700}));
  s+=card(700,90,470,300,label('18 m ✗',935,160,{size:34,color:C.a,anchor:'middle',weight:700})+label('最後の 6 m/s の まま',935,225,{size:26,color:C.ink,anchor:'middle'})+label('3秒 走った 値',935,265,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('0 から 増える 途中を',935,330,{size:24,color:C.dim,anchor:'middle'})+label('数えていない',935,365,{size:24,color:C.dim,anchor:'middle'})),seg(p,.1,.25),C.a);
  return s;
 },

 // ===== S5 投げ上げで確かめる =====
 [K+'vert']:(p)=>{
  let s=label('鉛直（上向きが 正），a ＝ −g',600,60,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.2,.35),tex(`v=${V0}-${G_}t`,600,170,{size:56}));
  s+=fade(seg(p,.4,.55),tex(`${Y_}=${Y0}+${V0}t-${HALF}${G_}t^2`,600,320,{size:60}));
  return s;
 },
 [K+'nums']:(p)=>{
  let s=ground(100,560,440)+ring(330,420,18,{color:C.ink,w:2.5,fill:'#39475f'});
  s+=fade(seg(p,.1,.25),arrow(330,395,330,240,{color:C.v,w:6,head:18})+label('10 m/s',350,300,{size:28,color:C.v,weight:700}));
  s+=card(660,90,480,300,tex('v_0=10\\ \\mathrm{m/s}',900,160,{size:42})+fade(seg(p,.45,.6),tex(`${G_}=10\\ \\mathrm{m/s^2}`,900,245,{size:42}))+fade(seg(p,.6,.75),tex(`${Y0}=0`,900,325,{size:42})),1);
  return s;
 },
 [K+'pred']:(p)=>{
  let s=card(230,120,740,260,label('一番 高い 所は',600,210,{size:34,color:C.ink,anchor:'middle'})+label('何秒後？ 高さ いくつ？',600,300,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'t1']:(p)=>{
  let s=tex('v=10-10t=0',600,80,{size:50});
  s+=fade(seg(p,.2,.35),tex('t=1\\ \\mathrm{s}',600,180,{size:50}));
  s+=fade(seg(p,.45,.6),tex(`${Y_}=10\\times 1-5\\times 1^2=5\\ \\mathrm{m}`,600,300,{size:50}));
  s+=fade(seg(p,.65,.8),label('5 ＝ ½ × g（g ＝ 10）',600,410,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'graphs']:(p)=>{
  const Gv=axes({x:120,y:215,w:560,h:150,xmin:0,xmax:2.3,ymin:-11,ymax:11,xlabel:'t [s]',ylabel:'v [m/s]',xticks:[1,2],yticks:[10,-10],xcolor:C.t,ycolor:C.v});
  const Gy=axes({x:120,y:470,w:560,h:170,xmin:0,xmax:2.3,ymin:0,ymax:6,xlabel:'t [s]',ylabel:'y [m]',xticks:[1,2],yticks:[5],xcolor:C.t,ycolor:C.x});
  let s=Gv.svg+Gv.plot(t=>10-10*t,{from:0,to:2.1,p:seg(p,0,.35),color:C.v,w:4})+Gy.svg+Gy.plot(t=>10*t-5*t*t,{from:0,to:2,p:seg(p,.2,.55),color:C.x,w:4});
  s+=fade(seg(p,.55,.7),line(Gv.X(1),Gv.Y(11),Gy.X(1),Gy.Y(0),{color:C.t,w:3,dash:'7 6'})+dot(Gv.X(1),Gv.Y(0),10,C.hi)+dot(Gy.X(1),Gy.Y(5),10,C.hi));
  s+=card(795,120,400,280,label('v ＝ 0 の 時刻',985,190,{size:30,color:C.v,anchor:'middle',weight:700})+label('＝',985,245,{size:30,color:C.ink,anchor:'middle'})+label('y の 頂点',985,300,{size:30,color:C.x,anchor:'middle',weight:700})+label('（t ＝ 1 s，5 m）',985,355,{size:24,color:C.dim,anchor:'middle'}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'area2']:(p)=>{
  const Gv=axes({x:120,y:215,w:560,h:150,xmin:0,xmax:2.3,ymin:-11,ymax:11,xlabel:'t [s]',ylabel:'v [m/s]',xticks:[1,2],yticks:[10,-10],xcolor:C.t,ycolor:C.v});
  const Gy=axes({x:120,y:470,w:560,h:170,xmin:0,xmax:2.3,ymin:0,ymax:6,xlabel:'t [s]',ylabel:'y [m]',xticks:[1,2],yticks:[5],xcolor:C.t,ycolor:C.x});
  let s=Gv.svg+Gv.plot(t=>10-10*t,{from:0,to:2.1,color:C.v,w:4})+Gy.svg+Gy.plot(t=>10*t-5*t*t,{from:0,to:2,color:C.x,w:4});
  s+=fade(seg(p,.05,.2),poly([[Gv.X(0),Gv.Y(0)],[Gv.X(0),Gv.Y(10)],[Gv.X(1),Gv.Y(0)]],{fill:CT,fo:.45,stroke:CT,sw:2})+label('5',Gv.X(.3),Gv.Y(3)+10,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),line(Gy.X(0),Gy.Y(5),Gy.X(1),Gy.Y(5),{color:CT,w:2,dash:'6 6'})+line(Gy.X(1),Gy.Y(0),Gy.X(1),Gy.Y(5),{color:CT,w:5})+dot(Gy.X(1),Gy.Y(5),9,C.hi));
  s+=card(795,120,400,260,tex(`${HALF}\\times 1\\times 10=5\\ \\mathrm{m}`,985,200,{size:38})+fade(seg(p,.4,.55),label('高さの 増えた 分 と',985,280,{size:26,color:C.ink,anchor:'middle'})+label('ぴったり 一致',985,325,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'t2']:(p)=>{
  const Gv=axes({x:120,y:215,w:560,h:150,xmin:0,xmax:2.3,ymin:-11,ymax:11,xlabel:'t [s]',ylabel:'v [m/s]',xticks:[1,2],yticks:[10,-10],xcolor:C.t,ycolor:C.v});
  const Gy=axes({x:120,y:470,w:560,h:170,xmin:0,xmax:2.3,ymin:0,ymax:6,xlabel:'t [s]',ylabel:'y [m]',xticks:[1,2],yticks:[5],xcolor:C.t,ycolor:C.x});
  let s=Gv.svg+Gv.plot(t=>10-10*t,{from:0,to:2.1,color:C.v,w:4})+Gy.svg+Gy.plot(t=>10*t-5*t*t,{from:0,to:2,color:C.x,w:4});
  s+=fade(seg(p,.05,.2),line(Gv.X(2),Gv.Y(11),Gy.X(2),Gy.Y(0),{color:C.t,w:3,dash:'7 6'})+dot(Gv.X(2),Gv.Y(-10),10,C.hi)+dot(Gy.X(2),Gy.Y(0),10,C.hi));
  s+=card(795,100,400,300,tex(`${Y_}=20-20=0`,985,170,{size:40})+fade(seg(p,.4,.55),tex('v=-10\\ \\mathrm{m/s}',985,260,{size:40})+label('投げた 速さで 下向き',985,340,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },

 // ===== S6 仮定とまとめ、次の問い =====
 [K+'assume']:(p)=>{
  let s=card(200,110,800,280,label('導く 途中で 使った 仮定',600,180,{size:28,color:C.dim,anchor:'middle'})+label('加速度 a が 一定',600,275,{size:48,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('これ だけ',600,345,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'out']:(p)=>{
  const f='\\int a\\,dt=a\\int dt=at';
  let s=tex(f,600,90,{size:52});
  s+=highlight(600-texWidth(f,52)/2+texWidth('\\int a\\,dt=',52)-4,30,texWidth('a',52)+24,110,seg(p,.05,.2),C.a);
  s+=fade(seg(p,.1,.25),label('a を 定数として 外へ 出した',600,190,{size:28,color:C.ink,anchor:'middle'}));
  s+=card(120,250,450,200,label('ばね',345,305,{size:32,color:C.ink,anchor:'middle',weight:700})+label('力が 位置で 変わる',345,360,{size:26,color:C.dim,anchor:'middle'})+label('使えない',345,415,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.4,.55),C.a);
  s+=card(630,250,450,200,label('空気抵抗',855,305,{size:32,color:C.ink,anchor:'middle',weight:700})+label('力が 速度で 変わる',855,360,{size:26,color:C.dim,anchor:'middle'})+label('使えない',855,415,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.55,.7),C.a);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=card(80,20,1040,140,label('a 一定 → 1回 積分 → 速度',600,70,{size:28,color:C.ink,anchor:'middle',weight:700})+tex(`v=${V0}+at`,600,125,{size:40}),1);
  s+=card(80,175,1040,150,label('もう 1回 積分 → 位置',600,220,{size:28,color:C.ink,anchor:'middle',weight:700})+tex(`x=${X0}+${V0}t+${HALF}at^2`,600,285,{size:44}),seg(p,.15,.3));
  s+=card(80,340,1040,140,label('½ ＝ t の 積分の 足跡',600,390,{size:30,color:C.hi,anchor:'middle',weight:700})+label('v₀ と x₀ ＝ 2つの 積分定数',600,440,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'next1']:(p)=>{
  const u=seg(p,.1,.9),y=180+u*170,len=20+u*70;
  let s=`<path d="M 300 ${y-60} Q 262 ${y} 300 ${y+28} Q 338 ${y} 300 ${y-60} Z" fill="${C.x}" fill-opacity=".45" stroke="${C.x}" stroke-width="3"/>`;
  s+=arrow(300,y+32,300,y+130,{color:C.F,w:6,head:16})+label('mg',316,y+110,{size:26,color:C.F,weight:700});
  s+=arrow(300,y-64,300,y-64-len,{color:C.F,w:6,head:16})+label('抵抗',316,y-64-len/2+8,{size:26,color:C.F,weight:700});
  s+=card(620,110,520,260,label('速く なる ほど',880,190,{size:30,color:C.ink,anchor:'middle'})+label('空気抵抗が 強く なる',880,250,{size:32,color:C.hi,anchor:'middle',weight:700})+label('（雨粒）',880,310,{size:26,color:C.dim,anchor:'middle'}),seg(p,.2,.35));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(150,60,900,170,label('力が 速度と ともに 変わる',600,125,{size:34,color:C.ink,anchor:'middle',weight:700})+label('→ a を 積分の 外に 出せない',600,190,{size:30,color:C.a,anchor:'middle'}),1);
  s+=card(300,280,600,160,label('次の問い',600,325,{size:24,color:C.dim,anchor:'middle'})+label('どう 解けば よい？',600,395,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
};
