// YouTube シリーズ 運動方程式・中級 2/3（ステージ um-constant-force-derive 本0〜本5＋補6・補7）— 図。Stage 1200×515.
// 色：位置 x 水色、速度 v・初めの速度 v₀ 紫、加速度 a 赤、力 F 緑、時刻 t 金、増えた分・強調 黄、誤り 赤。
// a–t グラフ（高さ2、0〜3 s の長方形 6）、v–t の家族 v＝2t＋C（C＝0,2,4,6,8）、v＝4＋2t（3 s で 10）、v＝2＋3t（4 s で 14）。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,ground,block,poly} from './anim.mjs';

const K='um-constant-force-derive-2:';
const BX='#9fb2d4';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const box=(x,y,{w=120,h=90,text='2 kg',g=1}={})=>fade(g,block(x,y,w,h,{color:BX,text,size:26,fo:.25}));
const fArrow=(x,y,len,{g=1,text=''}={})=>fade(g,arrow(x,y,x+len,y,{color:C.F,w:6,head:18})+(text?label(text,x+len+12,y+9,{size:26,color:C.F,weight:700}):''));
const V0=`{\\color{${C.v}}v_0}`,CC=`{\\color{${C.hi}}C}`,S_=`{\\color{${C.t}}s}`;
const clock=(x,y,r=34,g=1)=>fade(g,ring(x,y,r,{color:C.t,w:3})+line(x,y,x,y-r*.7,{color:C.t,w:3})+line(x,y,x+r*.55,y+r*.3,{color:C.t,w:3}));

// a–t graph
const GA=(o={})=>axes({x:90,y:440,w:560,h:330,xmin:0,xmax:3.6,ymin:0,ymax:3,xlabel:'t [s]',ylabel:'a [m/s²]',xticks:[1,2,3],yticks:[1,2],xcolor:C.t,ycolor:C.a,...o});
// v–t graph
const GV=(o={})=>axes({x:90,y:455,w:560,h:370,xmin:0,xmax:3.6,ymin:0,ymax:16,xlabel:'t [s]',ylabel:'v [m/s]',xticks:[1,2,3],yticks:[4,8,12],xcolor:C.t,ycolor:C.v,...o});
function family(G,{hi=-1,g=1,p=1,t0=0}={}){
 let s='';[0,2,4,6,8].forEach((c,i)=>{s+=fade(g,G.plot(t=>2*t+c,{from:0,to:Math.min(3.6,(16-c)/2),color:c===hi?C.v:C.faint,w:c===hi?5:3,p:seg(p,.06*i,.3+.06*i)}));});
 if(t0)s+=fade(t0,line(G.X(0),G.Y(0),G.X(0),G.Y(15.5),{color:C.t,w:5})+label('t ＝ 0',G.X(0)+14,G.Y(15.5)+6,{size:24,color:C.t,weight:700}));
 return s;
}
// recipe (as 1/3)
function recipe(g=1){
 const inp=(y,t,c)=>rect(40,y,300,80,{fill:'#131f38',fo:1,stroke:c,sw:3,rx:14})+label(t,190,y+50,{size:28,color:c,anchor:'middle',weight:700})+arrow(345,y+40,420,250,{color:C.dim,w:3,head:12});
 let s=inp(80,'① 力 F',C.F)+inp(210,'② 初めの 位置 x₀',C.x)+inp(340,'③ 初めの 速度 v₀',C.v);
 s+=rect(430,170,230,160,{fill:'#131f38',fo:1,stroke:C.hi,sw:3,rx:18})+tex('ma=F',545,262,{size:48})+arrow(670,250,740,250,{color:C.dim,w:4,head:16});
 const G=axes({x:780,y:410,w:340,h:280,xmin:0,xmax:3.2,ymin:0,ymax:10,xlabel:'t',ylabel:'x',xcolor:C.t,ycolor:C.x});
 s+=G.svg+G.plot(t=>t*t,{from:0,to:3,color:C.x,w:5})+label('x(t)',950,470,{size:28,color:C.hi,anchor:'middle',weight:700});
 return fade(g,s);
}

export const ytUmConstantForceDerive2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>recipe(seg(p,0,.2)),
 [K+'lastq']:(p)=>{
  let s=card(150,40,900,420,label('前回の 最後の問い',600,90,{size:24,color:C.dim,anchor:'middle'})
   +tex('m\\dfrac{d^2x}{dt^2}=F',600,200,{size:60})
   +fade(seg(p,.2,.35),label('F が 一定 なら どう 解く？',600,330,{size:34,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.5,.65),label('3秒後の 速度は？',600,400,{size:40,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=label('F が 一定',600,70,{size:32,color:C.F,anchor:'middle',weight:700});
  s+=card(120,140,450,260,label('速度の 式は',345,220,{size:30,color:C.ink,anchor:'middle'})+tex('v=\\ ?',345,310,{size:56}),seg(p,.15,.3),C.hi);
  s+=card(630,140,450,260,label('初めの 速度 v₀ は',855,220,{size:30,color:C.v,anchor:'middle',weight:700})+label('式の どこに？',855,310,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },

 // ===== S2 一定の加速度と面積 =====
 [K+'setup']:(p)=>{
  let s=ground(100,1100,380)+box(420,380)+fArrow(480,335,160,{text:'4 N（一定）'});
  s+=fade(seg(p,.1,.25),label('なめらかな 床',250,430,{size:26,color:C.dim}));
  s+=fade(seg(p,.6,.75),label('初級と 同じ 箱',600,150,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'accel']:(p)=>{
  let s=ground(40,520,420)+box(210,420)+fArrow(270,375,110,{text:'4 N'});
  s+=tex('a=\\dfrac{F}{m}=\\dfrac{4\\ \\mathrm{N}}{2\\ \\mathrm{kg}}=2\\ \\mathrm{m/s^2}',850,110,{size:46});
  const G=axes({x:620,y:440,w:500,h:190,xmin:0,xmax:3.6,ymin:0,ymax:3,xlabel:'t',ylabel:'a',xcolor:C.t,ycolor:C.a,g:seg(p,.4,.55)});
  s+=G.svg+G.plot(()=>2,{from:0,to:3.4,p:seg(p,.5,.85),color:C.a,w:5});
  s+=fade(seg(p,.7,.85),label('いつでも 2 のまま',870,280,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'assume']:(p)=>{
  let s=card(200,100,800,300,label('今回 ただ一つの 仮定',600,165,{size:28,color:C.dim,anchor:'middle'})
   +label('力 F が 一定',420,265,{size:38,color:C.F,anchor:'middle',weight:700})+arrow(560,255,660,255,{color:C.dim,w:4,head:16})
   +label('加速度 a が 一定',820,265,{size:38,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('ここから 出発',600,350,{size:30,color:C.hi,anchor:'middle',weight:700})),1,C.hi);
  return s;
 },
 [K+'q3']:(p)=>{
  let s=tex('a=2\\ \\mathrm{m/s^2}',300,160,{size:52})+clock(300,330,50);
  s+=fade(seg(p,.2,.35),arrow(470,250,600,250,{color:C.dim,w:4,head:16}));
  s+=card(640,110,480,280,label('3秒後の 速度',880,190,{size:32,color:C.ink,anchor:'middle'})+tex('v=\\ ?',880,290,{size:60}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'rate']:(p)=>{
  let s=tex('a=\\dfrac{dv}{dt}',300,130,{size:60});
  s+=card(520,60,640,160,label('今，速度が 1秒あたり',840,125,{size:30,color:C.ink,anchor:'middle'})+label('どれだけ 変わるか だけ',840,180,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2));
  const bx=i=>fade(seg(p,.5+.08*i,.6+.08*i),rect(250+i*230,330,200,70,{fill:C.hi,fo:.18,stroke:C.hi,sw:2,rx:10})+label(`${i+1}秒目 ＋2`,350+i*230,375,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=bx(0)+bx(1)+bx(2);
  s+=fade(seg(p,.8,.92),label('3秒分 積み上げる',600,460,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'integ']:(p)=>{
  const G=GA();const T=3*seg(p,.1,.8);
  let s=G.svg+G.plot(()=>2,{from:0,to:3.5,color:C.a,w:4});
  s+=poly([[G.X(0),G.Y(0)],[G.X(0),G.Y(2)],[G.X(T),G.Y(2)],[G.X(T),G.Y(0)]],{fill:C.hi,fo:.25});
  s+=card(720,120,440,240,label('積み上げ ＝ 積分',940,190,{size:32,color:C.hi,anchor:'middle',weight:700})+label('グラフの 面積 ＝',940,260,{size:28,color:C.ink,anchor:'middle'})+label('変化の 合計',940,305,{size:28,color:C.ink,anchor:'middle'}),seg(p,.2,.35));
  return s;
 },
 [K+'atgraph']:(p)=>{
  const G=GA();
  let s=G.svg+G.plot(()=>2,{from:0,to:3.5,p:seg(p,.3,.7),color:C.a,w:5});
  s+=fade(seg(p,.6,.75),label('高さ 2 の 水平な 線',G.X(1.8),G.Y(2)-24,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rect']:(p)=>{
  const G=GA();
  let s=G.svg+G.plot(()=>2,{from:0,to:3.5,color:C.a,w:5});
  s+=fade(seg(p,.05,.2),poly([[G.X(0),G.Y(0)],[G.X(0),G.Y(2)],[G.X(3),G.Y(2)],[G.X(3),G.Y(0)]],{fill:C.hi,fo:.25,stroke:C.hi,sw:2}));
  s+=fade(seg(p,.1,.25),label('2 × 3 ＝ 6',G.X(1.5),G.Y(1)+10,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=card(720,90,440,300,label('単位',940,145,{size:26,color:C.dim,anchor:'middle'})+label('m/s² × s ＝ m/s',940,205,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('速度が 6 m/s',940,285,{size:32,color:C.hi,anchor:'middle',weight:700})+label('増えた',940,335,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.35,.5));
  return s;
 },
 [K+'table']:(p)=>{
  const T=['0','0.5','1.0','1.5','2.0','2.5','3.0'];
  let s=label('t [s]',300,80,{size:26,color:C.t,anchor:'middle',weight:700})+label('v の 増え',500,80,{size:26,color:C.v,anchor:'middle',weight:700})+line(200,100,600,100,{color:C.faint,w:2});
  T.forEach((t,i)=>{const y=140+i*50;s+=label(t,300,y,{size:26,color:C.t,anchor:'middle'});if(i>0)s+=fade(seg(p,.05+.08*i,.12+.08*i),label('＋1',500,y-20,{size:26,color:C.hi,anchor:'middle',weight:700}));});
  s+=card(700,150,440,200,label('＋1 が 6回',920,220,{size:30,color:C.ink,anchor:'middle'})+label('→ 6 m/s',920,290,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'pred']:(p)=>{
  let s=card(230,150,740,200,label('3秒後の 速度 ＝ 6 m/s ？',600,265,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'notyet']:(p)=>{
  const bar=(x,v0,g)=>{const Y=v=>430-v*28;let q=label(`初めに ${v0} m/s`,x,470,{size:26,color:C.v,anchor:'middle',weight:700});
   if(v0>0)q+=rect(x-60,Y(v0),120,Y(0)-Y(v0),{fill:C.v,fo:.35,stroke:C.v,sw:2,rx:4})+label('初め '+v0,x,Y(v0/2)+8,{size:24,color:C.ink,anchor:'middle'});
   q+=rect(x-60,Y(v0+6),120,Y(v0)-Y(v0+6),{fill:C.hi,fo:.3,stroke:C.hi,sw:2,rx:4})+label('＋6',x,Y(v0+3)+8,{size:26,color:C.hi,anchor:'middle',weight:700});
   q+=label(`→ ${v0+6} m/s`,x+80,Y(v0+6)+8,{size:30,color:C.ink,weight:700});return fade(g,q);};
  let s=card(620,60,540,110,label('面積で 分かるのは 増えた分 だけ',890,125,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=bar(200,4,seg(p,.4,.55))+bar(520,0,seg(p,.6,.75));
  return s;
 },

 // ===== S3 積分定数を決める =====
 [K+'int']:(p)=>{
  let s=tex('v=\\int a\\,dt',600,170,{size:76});
  s+=fade(seg(p,.4,.55),label('加速度を 時間で 積分 → 速度',600,340,{size:32,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'anti']:(p)=>{
  let s=label('微分すると a に なる 関数は？',600,80,{size:30,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.35,.5),tex('\\dfrac{d}{dt}\\bigl(at\\bigr)=a',600,210,{size:60})+ok(790,222));
  s+=fade(seg(p,.55,.7),label('a は 定数 → at の 傾きは a',600,360,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'plusC']:(p)=>{
  let s=tex('\\dfrac{d}{dt}\\bigl(at\\bigr)=a',600,90,{size:48});
  s+=fade(seg(p,.05,.25),tex(`\\dfrac{d}{dt}\\bigl(at+${CC}\\bigr)=a+0=a`,600,240,{size:56}));
  s+=fade(seg(p,.5,.65),label('定数は 変化しない → 微分すると 0',600,390,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'Cname']:(p)=>{
  const f=`v=at+${CC}`;
  let s=tex(f,600,170,{size:80})+highlight(600-texWidth(f,80)/2-26,80,texWidth(f,80)+52,160,seg(p,.3,.45));
  s+=fade(seg(p,.5,.65),label('C：積分定数',600,340,{size:40,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('（積分・中級で 見た）',600,400,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'family']:(p)=>{
  const G=GV();
  let s=G.svg+family(G,{p:seg(p,0,.8)});
  s+=card(720,90,440,300,tex(`v=2t+${CC}`,940,160,{size:46})+label('傾き 2 の 直線が',940,245,{size:28,color:C.ink,anchor:'middle'})+label('縦に ずれて 並ぶ',940,290,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('どれも 別の 解',940,355,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'which']:(p)=>{
  const G=GV();
  let s=G.svg+family(G);
  s+=card(720,120,440,240,label('1本を 選ぶ には？',940,200,{size:36,color:C.hi,anchor:'middle',weight:700})+label('前回の 答えを 思い出す',940,280,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'t0']:(p)=>{
  const G=GV();
  let s=G.svg+family(G,{t0:seg(p,.05,.2)});
  s+=card(700,70,470,340,tex(`v=at+${CC}`,935,140,{size:44})
   +fade(seg(p,.3,.45),label('t ＝ 0 を 入れる',935,215,{size:26,color:C.t,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.6),tex(`v(0)=a\\times 0+${CC}=${CC}`,935,300,{size:40})),seg(p,.1,.25));
  return s;
 },
 [K+'v0']:(p)=>{
  const G=GV();
  let s=G.svg+family(G,{t0:1});
  s+=card(700,70,470,340,tex(`v(0)=${CC}`,935,130,{size:44})
   +fade(seg(p,.15,.3),tex(`${CC}=${V0}`,935,230,{size:56}))
   +fade(seg(p,.45,.6),label('初期条件：',935,315,{size:28,color:C.ink,anchor:'middle'})+label('測った 1つの 値',935,360,{size:30,color:C.hi,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'pick']:(p)=>{
  const G=GV();
  let s=G.svg+family(G,{t0:1,hi:seg(p,.2,.3)>.5?4:-1});
  s+=fade(seg(p,.1,.25),dot(G.X(0),G.Y(4),11,C.v)+label('v₀ ＝ 4',G.X(0)+18,G.Y(4)+36,{size:28,color:C.v,weight:700}));
  s+=card(720,120,440,220,label('高さ 4 を 通る',940,200,{size:30,color:C.ink,anchor:'middle'})+label('1本 だけ',940,270,{size:40,color:C.v,anchor:'middle',weight:700}),seg(p,.4,.55),C.v);
  return s;
 },

 // ===== S4 速度の式を読む =====
 [K+'formula']:(p)=>{
  let s=tex(`v=at+${CC}`,600,90,{size:50});
  s+=fade(seg(p,.05,.2),label(`C → v₀`,600,175,{size:30,color:C.v,anchor:'middle',weight:700}));
  const f=`v=${V0}+at`;
  s+=fade(seg(p,.15,.35),tex(f,600,290,{size:84}));
  s+=highlight(600-texWidth(f,84)/2-30,195,texWidth(f,84)+60,170,seg(p,.4,.55));
  s+=fade(seg(p,.6,.75),label('積分 ＋ 初期条件 → 高校の 速度の 式',600,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'read']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(t=>4+2*t,{from:0,to:3.5,p:seg(p,0,.3),color:C.v,w:5});
  s+=fade(seg(p,.25,.4),dot(G.X(0),G.Y(4),10,C.v)+label('切片 v₀',G.X(0)+16,G.Y(4)+36,{size:26,color:C.v,weight:700}));
  s+=fade(seg(p,.45,.6),line(G.X(1),G.Y(6),G.X(2),G.Y(6),{color:C.t,w:3})+line(G.X(2),G.Y(6),G.X(2),G.Y(8),{color:C.a,w:4})+label('1 s',G.X(1.5),G.Y(6)+30,{size:24,color:C.t,anchor:'middle'})+label('＋a',G.X(2)+10,G.Y(7)+8,{size:26,color:C.a,weight:700}));
  s+=card(720,70,440,350,tex(`v=${V0}+at`,940,140,{size:46})
   +fade(seg(p,.4,.55),label('切片 ＝ 初期条件',940,230,{size:30,color:C.v,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('傾き ＝ 力の 効き',940,300,{size:30,color:C.a,anchor:'middle',weight:700})+tex('a=\\dfrac{F}{m}',940,370,{size:40})),1);
  return s;
 },
 [K+'ex']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(t=>4+2*t,{from:0,to:3.5,color:C.v,w:5});
  s+=dot(G.X(0),G.Y(4),10,C.v);
  s+=fade(seg(p,.5,.65),line(G.X(3),G.Y(0),G.X(3),G.Y(10),{color:C.t,w:3,dash:'7 6'})+dot(G.X(3),G.Y(10),11,C.hi));
  s+=card(700,80,470,300,tex('v_0=4,\\quad a=2,\\quad t=3',935,140,{size:34})
   +fade(seg(p,.4,.55),tex('v=4+2\\times 3',935,230,{size:46}))
   +fade(seg(p,.6,.75),tex('=10\\ \\mathrm{m/s}',935,310,{size:46})),1);
  return s;
 },
 [K+'exread']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(t=>4+2*t,{from:0,to:3.5,color:C.v,w:5})+dot(G.X(3),G.Y(10),11,C.hi);
  s+=fade(seg(p,.05,.2),rect(G.X(3)-14,G.Y(4),28,G.Y(0)-G.Y(4),{fill:C.v,fo:.45,stroke:C.v,sw:2,rx:3})+label('4：初期条件',G.X(3)+26,G.Y(2)+8,{size:26,color:C.v,weight:700}));
  s+=fade(seg(p,.25,.4),rect(G.X(3)-14,G.Y(10),28,G.Y(4)-G.Y(10),{fill:C.hi,fo:.35,stroke:C.hi,sw:2,rx:3})+label('6：3秒で 増えた分',G.X(3)+26,G.Y(7)+8,{size:26,color:C.hi,weight:700}));
  s+=card(840,50,330,170,label('前回の 問いの 答え',1005,105,{size:26,color:C.dim,anchor:'middle'})+label('3秒後 10 m/s',1005,175,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(250,80,700,340,label('確かめ',600,130,{size:26,color:C.dim,anchor:'middle'})
   +tex('v_0=2\\ \\mathrm{m/s},\\quad a=3\\ \\mathrm{m/s^2}',600,210,{size:42})
   +label('4秒後の 速度は？',600,340,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ans']:(p)=>{
  let s=tex('v=2+3\\times 4=14\\ \\mathrm{m/s}',600,110,{size:58})+ok(900,122,seg(p,.2,.35));
  s+=card(250,250,700,180,tex('3\\times 4=12',600,315,{size:44})+label('増えた 分 だけ → 初めの 2 を 足し忘れ',600,390,{size:28,color:C.a,anchor:'middle',weight:700})+ng(860,330),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'graph14']:(p)=>{
  const G=GV({xmax:4.6,xticks:[1,2,3,4]});
  let s=G.svg+G.plot(t=>2+3*t,{from:0,to:4.4,color:C.v,w:5,p:seg(p,.1,.4)})+fade(seg(p,.35,.5),line(G.X(4),G.Y(0),G.X(4),G.Y(14),{color:C.t,w:3,dash:'7 6'})+dot(G.X(4),G.Y(14),11,C.hi))+fade(seg(p,.05,.2),dot(G.X(0),G.Y(2),10,C.v)+label('切片 2',G.X(0)+16,G.Y(2)+34,{size:26,color:C.v,weight:700}));
  s+=card(720,90,440,300,label('切片 2 から',940,160,{size:30,color:C.v,anchor:'middle',weight:700})+label('傾き 3 で 4秒',940,225,{size:30,color:C.a,anchor:'middle',weight:700})+label('2 ＋ 12 ＝ 14',940,300,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.5));
  return s;
 },

 // ===== S5 上下限を付けて書く =====
 [K+'bounds']:(p)=>{
  let s=tex('\\dfrac{dv}{ds}=a',600,90,{size:50});
  s+=fade(seg(p,.3,.5),tex(`\\int_0^t\\dfrac{dv}{d${S_}}\\,d${S_}=\\int_0^t a\\,d${S_}`,600,250,{size:62}));
  s+=fade(seg(p,.6,.75),label('0 から t まで 積分',600,420,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'s']:(p)=>{
  let s=tex(`\\int_0^t\\dfrac{dv}{d${S_}}\\,d${S_}=\\int_0^t a\\,d${S_}`,600,110,{size:54});
  s+=card(120,240,450,190,label('s',345,300,{size:40,color:C.t,anchor:'middle',weight:700})+label('積分の 途中の 時刻',345,370,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.t);
  s+=card(630,240,450,190,label('t',855,300,{size:40,color:C.t,anchor:'middle',weight:700})+label('どこまで 足すか',855,370,{size:28,color:C.ink,anchor:'middle'}),seg(p,.4,.55),C.t);
  return s;
 },
 [K+'left']:(p)=>{
  let s=tex(`\\int_0^t\\dfrac{dv}{d${S_}}\\,d${S_}`,330,110,{size:52});
  s+=fade(seg(p,.1,.25),label('速度の 変わる 速さ を 足す',330,230,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),arrow(330,260,330,320,{color:C.dim,w:3,head:12})+tex('=v(t)-v(0)',330,390,{size:52}));
  s+=fade(seg(p,.6,.75),label('速度の 増えた 分',330,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  const G=axes({x:700,y:440,w:420,h:340,xmin:0,xmax:3.6,ymin:0,ymax:12,xlabel:'s',ylabel:'v',xcolor:C.t,ycolor:C.v,g:seg(p,.3,.45)});
  s+=G.svg+fade(seg(p,.3,.45),G.plot(u=>4+2*u,{from:0,to:3.3,color:C.v,w:4}));
  s+=fade(seg(p,.5,.65),line(G.X(0),G.Y(4),G.X(3),G.Y(4),{color:C.faint,w:2,dash:'6 6'})+line(G.X(3),G.Y(4),G.X(3),G.Y(10),{color:C.hi,w:5})+label('t',G.X(3)-4,G.Y(0)+32,{size:24,color:C.t})+label('増えた分',G.X(3)+10,G.Y(7)+8,{size:24,color:C.hi,weight:700}));
  return s;
 },
 [K+'right']:(p)=>{
  let s=tex(`\\int_0^t a\\,d${S_}=at`,330,110,{size:52});
  const G=axes({x:640,y:420,w:480,h:300,xmin:0,xmax:3.6,ymin:0,ymax:3,xlabel:'s',ylabel:'a',xcolor:C.t,ycolor:C.a});
  s+=G.svg+G.plot(()=>2,{from:0,to:3.4,color:C.a,w:4});
  s+=fade(seg(p,.05,.2),poly([[G.X(0),G.Y(0)],[G.X(0),G.Y(2)],[G.X(3),G.Y(2)],[G.X(3),G.Y(0)]],{fill:C.hi,fo:.25,stroke:C.hi,sw:2})+label('高さ a',G.X(0)-12,G.Y(2)+8,{size:24,color:C.a,anchor:'end'})+label('幅 t',G.X(1.5),G.Y(0)+34,{size:24,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),tex('v(t)-v(0)=at',330,300,{size:50}));
  return s;
 },
 [K+'move']:(p)=>{
  let s=tex(`v(t)-v(0)=at`,600,80,{size:48});
  s+=fade(seg(p,.05,.2),label('v(0) ＝ v₀ を 右へ',600,165,{size:28,color:C.v,anchor:'middle',weight:700}));
  const f=`v(t)=${V0}+at`;
  s+=fade(seg(p,.2,.4),tex(f,600,270,{size:70}))+highlight(600-texWidth(f,70)/2-28,190,texWidth(f,70)+56,150,seg(p,.45,.6));
  s+=fade(seg(p,.6,.75),label('出発点が 初めから 式の 中に 見える',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gravity']:(p)=>{
  let s=label('鉛直（上向きが 正）',300,70,{size:28,color:C.dim,anchor:'middle'});
  s+=tex(`a=-{\\color{${C.a}}g}`,300,160,{size:52});
  s+=fade(seg(p,.2,.35),tex(`v=${V0}-{\\color{${C.a}}g}t`,300,290,{size:60}));
  s+=fade(seg(p,.55,.7),label('1秒ごとに g ずつ 減る',300,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  const G=axes({x:640,y:440,w:480,h:360,xmin:0,xmax:2.4,ymin:-12,ymax:12,xlabel:'t',ylabel:'v',xcolor:C.t,ycolor:C.v,g:seg(p,.3,.45)});
  s+=G.svg+G.plot(t=>10-10*t,{from:0,to:2.2,p:seg(p,.35,.7),color:C.v,w:5})+fade(seg(p,.35,.5),dot(G.X(0),G.Y(10),9,C.v)+label('v₀',G.X(0)+14,G.Y(10)+8,{size:26,color:C.v,weight:700}));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(80,20,1040,140,label('a が 一定 → 積分で 増えた分 at',600,75,{size:30,color:C.ink,anchor:'middle',weight:700})+label('出発点は 分からない → 積分定数 C',600,130,{size:30,color:C.hi,anchor:'middle',weight:700}),1);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,20,1040,140,label('a が 一定 → 積分で 増えた分 at',600,75,{size:30,color:C.ink,anchor:'middle',weight:700})+label('出発点は 分からない → 積分定数 C',600,130,{size:30,color:C.hi,anchor:'middle',weight:700}),1);
  s+=card(80,180,1040,300,label('t ＝ 0 → C ＝ v₀',600,235,{size:30,color:C.v,anchor:'middle',weight:700})+tex(`v=${V0}+at`,600,320,{size:56})
   +label('切片 ＝ 初期条件，傾き ＝ 力の 効き',600,430,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'next1']:(p)=>{
  let s=tex(`v=${V0}+at`,600,110,{size:66});
  s+=fade(seg(p,.2,.35),arrow(600,170,600,250,{color:C.dim,w:4,head:16}));
  s+=card(350,270,500,150,label('位置の 式は？',600,360,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=label('高校で 覚えた 式',600,50,{size:26,color:C.dim,anchor:'middle'})+tex('x=v_0t+{}',640,130,{size:70,anchor:'end'})+tex('\\tfrac12at^2',660,130,{size:70,anchor:'start'});
  s+=highlight(648,60,texWidth('\\tfrac12at^2',70)+24,120,seg(p,.2,.35));
  s+=card(250,270,700,160,label('次の問い',600,315,{size:24,color:C.dim,anchor:'middle'})+label('½ は どこから 来る？',600,385,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
};
