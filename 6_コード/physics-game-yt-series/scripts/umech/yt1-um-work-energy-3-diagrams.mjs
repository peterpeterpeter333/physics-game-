// YouTube シリーズ 仕事・中級 3/3（ステージ um-work-energy 本10〜本13＋補0・補1）— 図。Stage 1200×515.
// 色：力 F 緑、位置 x・d𝐫 水色、速度 v 紫、仕事・エネルギー（W・K・短冊・面積）橙、影 黄、強調 黄、誤り 赤。
// v–mv グラフ（m＝2）：直線 mv＝2v。3→5 m/s の台形 (6＋10)÷2×2＝16 J、0→2 m/s の三角形 ½×2×4＝4 J。
// 合力：押す 3 N・摩擦 1 N・2 m → +6 J、−2 J、計 4 J → 静止から v＝2 m/s。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,ground,poly,draw} from './anim.mjs';

const K='um-work-energy-3:';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const E_=s=>`{\\color{${C.E}}${s}}`;
const HALF=`{\\color{${C.hi}}\\tfrac12}`;
const box=(x,y,txt='2 kg')=>rect(x-50,y-80,100,80,{fill:C.x,fo:.22,stroke:C.dim,sw:2,rx:8})+label(txt,x,y-30,{size:26,color:C.ink,anchor:'middle'});

// v–mv graph, m = 2
const GM=(o={})=>axes({x:90,y:450,w:560,h:360,xmin:0,xmax:6,ymin:0,ymax:12,xlabel:'v [m/s]',ylabel:'mv [kg·m/s]',xticks:[1,2,3,4,5],yticks:[4,6,10],xcolor:C.v,ycolor:C.v,...o});
const GS=(o={})=>axes({x:90,y:450,w:560,h:360,xmin:0,xmax:6,ymin:0,ymax:12,xlabel:'v',ylabel:'mv',xcolor:C.v,ycolor:C.v,...o});
const trapV=(G,a,b,g=1,col=C.E,fo=.45)=>fade(g,poly([[G.X(a),G.Y(0)],[G.X(a),G.Y(2*a)],[G.X(b),G.Y(2*b)],[G.X(b),G.Y(0)]],{fill:col,fo,stroke:col,sw:2}));
// F–x graph (generic)
const GF=(o={})=>axes({x:90,y:450,w:520,h:340,xmin:0,xmax:5,ymin:0,ymax:5,xlabel:'x',ylabel:'F',xcolor:C.x,ycolor:C.F,...o});
const Fcurve=x=>1.2+2.4*Math.exp(-((x-2.2)**2)/2.5);

export const ytUmWorkEnergy3Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=tex('a=v\\dfrac{dv}{dx}',190,130,{size:44});
  s+=fade(seg(p,.2,.35),arrow(310,130,380,130,{color:C.dim,w:4,head:14})+tex('F=mv\\dfrac{dv}{dx}',530,130,{size:44}));
  s+=fade(seg(p,.45,.6),arrow(690,130,770,130,{color:C.dim,w:4,head:14})+label('× dx',730,95,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),tex('F\\,dx=mv\\,dv',960,130,{size:46}));
  s+=card(170,260,860,170,label('小さな 仕事 F dx ＝ 小さな 増え分 mv dv',600,330,{size:32,color:C.E,anchor:'middle',weight:700})+label('（時刻 t は 消えた）',600,390,{size:26,color:C.t,anchor:'middle'}),seg(p,.7,.85),C.E);
  return s;
 },
 [K+'lastq']:(p)=>card(150,50,900,410,label('前回の 最後の問い',600,100,{size:24,color:C.dim,anchor:'middle'})+tex('F\\,dx=mv\\,dv',600,200,{size:60})
   +fade(seg(p,.3,.45),label('始点 から 終点 まで',600,310,{size:32,color:C.ink,anchor:'middle'})+label('足し上げると？',600,380,{size:40,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi),
 [K+'promise']:(p)=>card(200,110,800,280,label('初級で 約束',600,170,{size:26,color:C.dim,anchor:'middle'})+tex(`K=${HALF}mv^2`,600,260,{size:66})+label('この ½ の 出どころ → 今回',600,350,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi),
 [K+'ask']:(p)=>{
  const q=(x,t,g)=>card(x-170,150,340,200,label(t,x,262,{size:32,color:C.hi,anchor:'middle',weight:700}),g,C.hi);
  let s=q(220,'どんな 式？',seg(p,.05,.2))+q(600,'F は どの 力？',seg(p,.35,.5))+q(980,'½ は どこから？',seg(p,.6,.75));
  return s;
 },

 // ===== S2 両辺を足し上げる =====
 [K+'sum1']:(p)=>{
  const G=GF();const n=16,a=.4,b=4.4,w=(b-a)/n;
  let s=G.svg+G.plot(Fcurve,{from:0,to:4.8,color:C.F,w:4});
  for(let i=0;i<n;i++){const x0=a+i*w;s+=fade(seg(p,.05+.025*i,.1+.025*i),rect(G.X(x0),G.Y(Fcurve(x0+w/2)),G.X(x0+w)-G.X(x0)-1.5,G.Y(0)-G.Y(Fcurve(x0+w/2)),{fill:C.E,fo:.45,stroke:C.E,sw:1,rx:1}));}
  s+=card(680,110,480,260,label('短冊を 細かく して 足す',920,180,{size:28,color:C.ink,anchor:'middle'})+label('↓',920,230,{size:30,color:C.ink,anchor:'middle'})+label('積分',920,290,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7));
  s+=fade(seg(p,.4,.55),label('七手目',920,70,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=tex('\\int F\\,dx=\\int mv\\,dv',600,170,{size:76});
  s+=fade(seg(p,.2,.35),label('位置 で 積分',380,320,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('速さ で 積分',820,320,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lim1']:(p)=>{
  let s=tex('\\int_{\\square}^{\\square}F\\,dx=\\int_{\\square}^{\\square}mv\\,dv',600,190,{size:80});
  s+=fade(seg(p,.2,.35),label('上端 と 下端 に 何を 入れる？',600,390,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lim2']:(p)=>{
  const x0=220,x1=980,u=seg(p,.1,.55);
  let s=ground(100,1100,300);
  s+=fade(.45,box(x0,300,''))+box(mix(x0,x1,u),300,'');
  s+=fade(seg(p,.05,.2),label('始めの 時刻',x0,110,{size:26,color:C.t,anchor:'middle',weight:700})+tex('x_i,\\ v_i',x0,380,{size:44})+line(x0,130,x0,215,{color:C.t,w:2,dash:'6 6'}));
  s+=fade(seg(p,.55,.7),label('終わりの 時刻',x1,110,{size:26,color:C.t,anchor:'middle',weight:700})+tex('x_f,\\ v_f',x1,380,{size:44})+line(x1,130,x1,215,{color:C.t,w:2,dash:'6 6'}));
  s+=fade(seg(p,.15,.3),arrow(x0+60,250,x0+140,250,{color:C.v,w:5,head:14}))+fade(seg(p,.6,.75),arrow(x1+60,250,x1+190,250,{color:C.v,w:5,head:14}));
  return s;
 },
 [K+'lim3']:(p)=>{
  const f='\\int_{x_i}^{x_f}F\\,dx=\\int_{v_i}^{v_f}mv\\,dv';
  let s=tex(f,600,215,{size:80});
  s+=card(140,330,420,140,label('始点 どうし',350,385,{size:28,color:C.t,anchor:'middle',weight:700})+tex('x_i\\ \\leftrightarrow\\ v_i',350,440,{size:40}),seg(p,.3,.45),C.t);
  s+=card(640,330,420,140,label('終点 どうし',850,385,{size:28,color:C.t,anchor:'middle',weight:700})+tex('x_f\\ \\leftrightarrow\\ v_f',850,440,{size:40}),seg(p,.5,.65),C.t);
  s+=fade(seg(p,.1,.25),label('同じ 時刻 を 対に',600,32,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lim4']:(p)=>{
  let s=tex('\\int_{x_i}^{x_f}mv\\,dv',330,200,{size:80})+ng(500,215,seg(p,.1,.25));
  s+=fade(seg(p,.1,.25),line(180,120,480,280,{color:C.a,w:5})+label('位置の 値を 入れない',330,370,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=card(660,110,460,270,label('上下限 ＝',890,190,{size:30,color:C.ink,anchor:'middle'})+label('積分する 変数',890,250,{size:34,color:C.hi,anchor:'middle',weight:700})+label('そのものの 値',890,310,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'Wleft']:(p)=>{
  const G=GF();
  let s=G.svg+G.plot(Fcurve,{from:0,to:4.8,color:C.F,w:4});
  const pts=[[G.X(.4),G.Y(0)]];for(let i=0;i<=60;i++){const x=.4+4*i/60;pts.push([G.X(x),G.Y(Fcurve(x))]);}pts.push([G.X(4.4),G.Y(0)]);
  s+=fade(seg(p,.1,.3),poly(pts,{fill:C.E,fo:.45,stroke:C.E,sw:2})+tex(E_('W'),G.X(2.3),G.Y(1),{size:50,auto:false}));
  s+=fade(seg(p,.1,.2),label('xi',G.X(.4),G.Y(0)+60,{size:24,color:C.x,anchor:'middle',weight:700})+label('xf',G.X(4.4),G.Y(0)+60,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=card(680,120,480,240,tex(`\\int_{x_i}^{x_f}F\\,dx=${E_('W')}`,920,220,{size:52})+label('力が した 仕事 ＝ 面積',920,310,{size:28,color:C.E,anchor:'middle',weight:700}),seg(p,.4,.55),C.E);
  return s;
 },

 // ===== S3 ½ の出どころ =====
 [K+'mout']:(p)=>{
  let s=tex('\\int_{v_i}^{v_f}mv\\,dv',380,190,{size:72});
  s+=fade(seg(p,.2,.4),tex('=m\\int_{v_i}^{v_f}v\\,dv',820,190,{size:72}));
  s+=fade(seg(p,.5,.65),label('m は 定数 → 外へ',600,360,{size:30,color:C.dim,anchor:'middle'})+label('v の 原始関数 は？',600,430,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'prim']:(p)=>{
  let s=tex('\\dfrac{d}{dv}\\Bigl(\\dfrac{v^2}{2}\\Bigr)=\\dfrac{2v}{2}=v',600,140,{size:58})+ok(900,152,seg(p,.3,.45));
  s+=fade(seg(p,.5,.65),tex(`\\int v\\,dv=\\dfrac{v^2}{2}`,600,330,{size:64}));
  s+=fade(seg(p,.1,.25),label('（積分・中級 と 同じ）',600,460,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'res']:(p)=>{
  let s=tex('m\\Bigl[\\dfrac{v^2}{2}\\Bigr]_{v_i}^{v_f}',600,110,{size:54});
  s+=fade(seg(p,.25,.45),tex(`${E_('W')}=${HALF}mv_f^2-${HALF}mv_i^2`,600,300,{size:72}));
  s+=fade(seg(p,.55,.7),highlight(160,210,880,150,1,C.E));
  return s;
 },
 [K+'graph1']:(p)=>{
  const G=GS();
  let s=G.svg+G.plot(v=>2*v,{from:0,to:5.6,p:seg(p,.15,.5),color:C.v,w:5});
  s+=card(720,120,440,230,label('mv ＝ m × v',940,190,{size:32,color:C.v,anchor:'middle',weight:700})+label('原点を 通る 直線',940,250,{size:30,color:C.ink,anchor:'middle'})+label('（傾き m）',940,300,{size:26,color:C.dim,anchor:'middle'}),seg(p,.4,.55));
  return s;
 },
 [K+'graph2']:(p)=>{
  const G=GS(),V=4;
  let s=G.svg+G.plot(v=>2*v,{from:0,to:5.6,color:C.v,w:5});
  s+=fade(seg(p,.05,.2),poly([[G.X(0),G.Y(0)],[G.X(V),G.Y(2*V)],[G.X(V),G.Y(0)]],{fill:C.E,fo:.45,stroke:C.E,sw:2}));
  s+=fade(seg(p,.2,.35),label('底辺 v',G.X(V/2),G.Y(0)+40,{size:26,color:C.v,anchor:'middle',weight:700})+label('高さ mv',G.X(V)+14,G.Y(V)+8,{size:26,color:C.v,weight:700}));
  s+=card(720,120,440,250,tex('\\dfrac{v\\times mv}{2}',940,220,{size:50})+fade(seg(p,.5,.65),tex(`=${HALF}mv^2`,940,320,{size:52})),seg(p,.3,.45),C.E);
  return s;
 },
 [K+'half']:(p)=>{
  const G=GS(),V=4;
  let s=G.svg+G.plot(v=>2*v,{from:0,to:5.6,color:C.v,w:4});
  s+=poly([[G.X(0),G.Y(0)],[G.X(V),G.Y(2*V)],[G.X(V),G.Y(0)]],{fill:C.E,fo:.45,stroke:C.E,sw:2});
  s+=fade(seg(p,.15,.3),poly([[G.X(0),G.Y(0)],[G.X(0),G.Y(2*V)],[G.X(V),G.Y(2*V)]],{fill:C.dim,fo:.18,stroke:C.dim,sw:2})+label('同じ 大きさ',G.X(1.2),G.Y(6.4)+8,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(720,110,440,260,label('三角形 ＝ 長方形の',940,180,{size:28,color:C.ink,anchor:'middle'})+label('ちょうど 半分',940,235,{size:34,color:C.E,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('→ ½ が 出る',940,315,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.7,.85),label('（運動方程式・中級 3/3 の ½at² と 同じ 形）',600,500,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'name']:(p)=>{
  let s=tex(`${E_('K')}=${HALF}mv^2`,600,150,{size:96});
  s+=fade(seg(p,.1,.25),label('運動エネルギー',600,265,{size:34,color:C.E,anchor:'middle',weight:700}));
  s+=card(230,320,740,130,label('½ ＝ v を 積分した 足跡',600,400,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'thm']:(p)=>{
  let s=tex(`${E_('W')}=\\Delta ${E_('K')}`,600,160,{size:110});
  s+=card(160,300,880,150,label('合力の した 仕事 ＝ 運動エネルギーの 変化',600,375,{size:34,color:C.E,anchor:'middle',weight:700})+label('（初級で 約束した 関係）',600,425,{size:24,color:C.dim,anchor:'middle'}),seg(p,.3,.45),C.E);
  return s;
 },

 // ===== S4 例で確かめる =====
 [K+'ex1']:(p)=>{
  let s=ground(100,1100,330)+box(400,330);
  s+=arrow(460,250,560,250,{color:C.v,w:5,head:14})+label('3 m/s',570,258,{size:26,color:C.v,weight:700});
  s+=fade(seg(p,.2,.35),box(800,330)+arrow(860,250,1030,250,{color:C.v,w:5,head:14})+label('5 m/s',950,230,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=card(300,370,600,120,label('合力の した 仕事 W は？',600,445,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=tex(`\\Delta ${E_('K')}=\\tfrac12\\times2\\times\\bigl(5^2-3^2\\bigr)`,600,130,{size:56});
  s+=fade(seg(p,.3,.45),tex('=25-9=16',600,270,{size:56}));
  s+=fade(seg(p,.55,.7),tex(`${E_('W')}=${E_('16\\ \\mathrm{J}')}`,600,410,{size:66}));
  return s;
 },
 [K+'trap']:(p)=>{
  const G=GM();
  let s=G.svg+G.plot(v=>2*v,{from:0,to:5.6,color:C.v,w:4})+trapV(G,3,5,seg(p,.05,.2));
  s+=fade(seg(p,.2,.35),label('6',G.X(3)-16,G.Y(3)+8,{size:26,color:C.hi,anchor:'end',weight:700})+line(G.X(3),G.Y(6),G.X(3),G.Y(0),{color:C.hi,w:3}));
  s+=fade(seg(p,.25,.4),label('10',G.X(5)+14,G.Y(5)+8,{size:26,color:C.hi,weight:700})+line(G.X(5),G.Y(10),G.X(5),G.Y(0),{color:C.hi,w:3}));
  s+=card(720,120,440,250,tex('\\dfrac{6+10}{2}\\times2',940,210,{size:48})+fade(seg(p,.55,.7),tex(`=${E_('16\\ \\mathrm{J}')}`,940,310,{size:52})),seg(p,.35,.5),C.E);
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=tex('\\tfrac12\\times2\\times(5-3)^2=4\\ \\mathrm{J}',420,140,{size:52})+ng(740,150,seg(p,.1,.25));
  s+=fade(seg(p,.1,.25),line(160,110,690,170,{color:C.a,w:4}));
  s+=card(170,260,860,190,label('速さの 差 だけ では 決まらない',600,330,{size:34,color:C.a,anchor:'middle',weight:700})+label('どの 速さ からの 2 m/s か で 変わる',600,400,{size:30,color:C.ink,anchor:'middle'}),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'cmp']:(p)=>{
  const G=GM();
  let s=G.svg+G.plot(v=>2*v,{from:0,to:5.6,color:C.v,w:4});
  s+=fade(seg(p,.05,.2),poly([[G.X(0),G.Y(0)],[G.X(2),G.Y(4)],[G.X(2),G.Y(0)]],{fill:C.E,fo:.35,stroke:C.E,sw:2})+label('4 J',G.X(1.4),G.Y(1)+8,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=trapV(G,3,5,seg(p,.3,.45),C.E,.6)+fade(seg(p,.35,.5),label('16 J',G.X(4),G.Y(3)+8,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(720,100,440,300,label('どちらも ＋2 m/s',940,165,{size:28,color:C.v,anchor:'middle',weight:700})+label('0 → 2 m/s：4 J',940,230,{size:28,color:C.ink,anchor:'middle'})+label('3 → 5 m/s：16 J',940,280,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.6,.75),label('速いほど 仕事が 要る',940,350,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },
 [K+'back']:(p)=>{
  let s=label('前回の 例（2 kg、4 N、静止から）',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=tex(`${E_('W')}=4\\times1=${E_('4\\ \\mathrm{J}')}`,600,180,{size:56});
  s+=fade(seg(p,.35,.5),tex(`\\tfrac12\\times2\\times2^2=${E_('4\\ \\mathrm{J}')}`,600,310,{size:56}));
  s+=fade(seg(p,.6,.75),label('v ＝ 2 m/s と 一致',600,440,{size:32,color:C.hi,anchor:'middle',weight:700})+ok(760,450));
  return s;
 },

 // ===== S5 F は合力、そして曲がった道 =====
 [K+'net1']:(p)=>{
  let s=tex('F=ma',600,150,{size:90});
  s+=fade(seg(p,.4,.55),arrow(600,210,600,280,{color:C.dim,w:4,head:14}));
  s+=card(250,300,700,150,label('F ＝ はたらく 力 すべての 合力',600,390,{size:36,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.F);
  return s;
 },
 [K+'net2']:(p)=>{
  let s=ground(80,700,280)+box(390,280,'2 kg');
  s+=arrow(440,240,580,240,{color:C.F,w:6,head:18})+label('押す 3 N',590,248,{size:26,color:C.F});
  s+=arrow(340,270,250,270,{color:C.F,w:6,head:18})+label('摩擦 1 N',240,250,{size:26,color:C.F,anchor:'end'});
  s+=fade(seg(p,.1,.25),arrow(330,330,450,330,{color:C.x,w:4,head:14})+label('2 m 進む',470,338,{size:26,color:C.x}));
  const row=(y,t,v,c,g)=>fade(g,label(t,800,y,{size:30,color:C.ink})+label(v,1150,y,{size:32,color:c,anchor:'end',weight:700}));
  s+=card(760,60,420,400,row(140,'押す力','＋6 J',C.E,seg(p,.3,.45))+row(210,'摩擦','−2 J',C.a,seg(p,.45,.6))+fade(seg(p,.6,.7),line(800,245,1150,245,{color:C.dim,w:2}))+row(300,'合力の 仕事','4 J',C.E,seg(p,.65,.8)),1);
  return s;
 },
 [K+'net3']:(p)=>{
  let s=tex(`\\tfrac12\\times2\\times v^2=${E_('4')}`,420,130,{size:54});
  s+=fade(seg(p,.2,.35),tex('v=2\\ \\mathrm{m/s}',420,260,{size:56})+ok(600,272));
  s+=card(740,80,420,260,label('押す 力の 6 J だけ',950,160,{size:28,color:C.ink,anchor:'middle'})+label('→ 速さを 正しく',950,220,{size:28,color:C.a,anchor:'middle'})+label('出せない',950,270,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  s+=fade(seg(p,.7,.85),label('W ＝ ΔK の W は 合力の 仕事',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fric']:(p)=>{
  const u=seg(p,.05,.9),bx=mix(250,560,1-(1-u)*(1-u)),vl=mix(140,30,u);
  let s=ground(80,1120,300)+box(bx,300,'箱');
  s+=arrow(bx+55,200,bx+55+vl,200,{color:C.v,w:5,head:14})+label('v',bx+60+vl,190,{size:26,color:C.v,weight:700});
  s+=arrow(bx-55,290,bx-150,290,{color:C.F,w:6,head:16})+label('摩擦 だけ',bx-160,270,{size:24,color:C.F,anchor:'end'});
  s+=card(760,90,400,260,tex(`${E_('W')}<0`,960,170,{size:50})+tex(`\\Delta ${E_('K')}<0`,960,250,{size:50})+label('遅く なる',960,320,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.a);
  return s;
 },
 [K+'circle']:(p)=>{
  const cx=330,cy=260,R=180,a=p*2.2+.3,bx=cx+R*Math.cos(a),by=cy-R*Math.sin(a);
  let s=ring(cx,cy,R,{color:C.faint,w:3,dash:'8 8'})+dot(cx,cy,7,C.dim);
  s+=line(cx,cy,bx,by,{color:C.dim,w:2})+arrow(bx,by,mix(bx,cx,.45),mix(by,cy,.45),{color:C.F,w:6,head:16});
  const tx=-Math.sin(a),ty=-Math.cos(a);
  s+=arrow(bx,by,bx+tx*110,by+ty*110,{color:C.x,w:5,head:14})+label('d𝐫',bx+tx*125,by+ty*125,{size:26,color:C.x,weight:700});
  const rx=(cx-bx)/R,ry=(cy-by)/R,k=18;
  s+=draw([[bx+rx*k,by+ry*k],[bx+rx*k+tx*k,by+ry*k+ty*k],[bx+tx*k,by+ty*k]],1,{color:C.hi,w:2});
  s+=dot(bx,by,14,C.v);
  s+=card(660,80,500,340,label('ひもの 力 ⊥ 一歩',910,145,{size:30,color:C.F,anchor:'middle',weight:700})+tex('dW=\\mathbf F\\cdot d\\mathbf r=0',910,215,{size:40})+tex(`\\Delta ${E_('K')}=0`,910,300,{size:44})+label('速さは 変わらない',910,375,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35));
  return s;
 },
 [K+'curve']:(p)=>{
  const P=t=>[120+900*t,420-300*Math.sin(Math.PI*t*.9)*(.6+.4*t)];
  const pts=Array.from({length:81},(_,i)=>P(i/80));
  let s=draw(pts,seg(p,0,.3),{color:C.dim,w:3});
  const n=8;for(let i=0;i<n;i++){const A=P(i/n),B=P((i+1)/n);s+=fade(seg(p,.2+.04*i,.25+.04*i),arrow(A[0],A[1],B[0],B[1],{color:C.x,w:4,head:12}));}
  const A=P(3/8),B=P(4/8);
  s+=fade(seg(p,.55,.7),arrow(A[0],A[1],A[0]+150,A[1]+20,{color:C.F,w:5,head:14})+label('𝐅',A[0]+160,A[1]+40,{size:28,color:C.F,weight:700})+label('d𝐫',(A[0]+B[0])/2-40,(A[1]+B[1])/2-14,{size:26,color:C.x,weight:700}));
  s+=card(760,300,420,160,tex(`${E_('W')}=\\int\\mathbf F\\cdot d\\mathbf r`,970,390,{size:48}),seg(p,.7,.85),C.E);
  return s;
 },
 [K+'curve2']:(p)=>{
  const ox=160,oy=390,dx=470,dy=-140,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
  const Fx=260,Fy=-330,proj=Fx*ux+Fy*uy;
  let s=arrow(ox,oy,ox+dx,oy+dy,{color:C.x,w:6,head:18})+label('一歩 d𝐫',ox+dx+10,oy+dy+40,{size:26,color:C.x,weight:700});
  s+=arrow(ox,oy,ox+Fx,oy+Fy,{color:C.F,w:6,head:18})+label('𝐅',ox+Fx-10,oy+Fy-12,{size:30,color:C.F,weight:700});
  s+=fade(seg(p,.15,.3),line(ox+Fx,oy+Fy,ox+proj*ux,oy+proj*uy,{color:C.dim,w:2,dash:'7 6'}));
  s+=fade(seg(p,.3,.45),line(ox,oy+10,ox+proj*ux,oy+proj*uy+10,{color:C.hi,w:10})+label('影',ox+proj*ux/2,oy+proj*uy/2+50,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(800,90,370,300,label('効くのは 影 だけ',985,150,{size:28,color:C.hi,anchor:'middle',weight:700})+label('（内積・中級）',985,195,{size:22,color:C.dim,anchor:'middle'})+fade(seg(p,.55,.7),tex('\\mathrm{N}\\times\\mathrm{m}=\\mathrm{J}',985,280,{size:44})+label('d𝐫 の 単位は m',985,350,{size:24,color:C.x,anchor:'middle'})),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'adv']:(p)=>{
  let s=card(90,90,480,280,label('今回',330,150,{size:26,color:C.dim,anchor:'middle'})+line(160,250,500,250,{color:C.x,w:5})+dot(160,250,8,C.x)+dot(500,250,8,C.x)+label('1本の 軸 で 導いた',330,330,{size:28,color:C.ink,anchor:'middle',weight:700}),1,C.x);
  s+=card(630,90,480,280,label('上級',870,150,{size:26,color:C.dim,anchor:'middle'})+draw(Array.from({length:40},(_,i)=>{const t=i/39;return [700+340*t,270-80*Math.sin(Math.PI*t)];}),1,{color:C.x,w:5})+label('曲がった 道 でも W ＝ ΔK',870,330,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.6,.75),label('導き方は 上級で',600,450,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'v0']:(p)=>{
  const G=axes({x:120,y:260,w:620,h:200,xmin:0,xmax:2.2,ymin:-11,ymax:11,xlabel:'t',ylabel:'v',xticks:[],yticks:[],xcolor:C.t,ycolor:C.v});
  let s=G.svg+G.plot(t=>10-10*t,{from:0,to:2,color:C.v,w:5});
  s+=dot(G.X(1),G.Y(0),11,C.a)+label('v ＝ 0',G.X(1)+18,G.Y(0)-22,{size:24,color:C.a,weight:700});
  s+=fade(seg(p,.2,.35),line(G.X(1),60,G.X(1),480,{color:C.hi,w:3,dash:'8 6'})+label('W₁ ＝ ΔK₁',G.X(.5),450,{size:26,color:C.E,anchor:'middle',weight:700})+label('W₂ ＝ ΔK₂',G.X(1.5),450,{size:26,color:C.E,anchor:'middle',weight:700}));
  s+=card(820,130,350,220,label('足すと',995,195,{size:28,color:C.ink,anchor:'middle'})+tex(`${E_('W')}=\\Delta ${E_('K')}`,995,285,{size:50}),seg(p,.5,.65),C.E);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sumA']:(p)=>{
  const T=[['運動方程式','F ＝ ma',C.F],['a と v の 定義','a ＝ dv/dt、v ＝ dx/dt',C.a],['連鎖律','二段の 歯車',C.x],['積分','短冊を 足す',C.E]];
  let s='';
  T.forEach(([a,b,c],i)=>{const x=60+i*275;s+=card(x,110,255,200,label(a,x+127,190,{size:26,color:c,anchor:'middle',weight:700})+label(b,x+127,250,{size:22,color:C.dim,anchor:'middle'}),seg(p,.05+.12*i,.15+.12*i),c);});
  s+=fade(seg(p,.6,.75),label('新しい 法則は 足していない',600,420,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sumB']:(p)=>{
  let s=tex(`${E_('W')}=\\Delta ${E_('K')}=${HALF}mv_f^2-${HALF}mv_i^2`,600,140,{size:62});
  s+=card(140,270,440,170,label('W は 合力の 仕事',360,365,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,.2,.35),C.F);
  s+=card(620,270,440,170,label('½ ＝ v を 積分した 足跡',840,365,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'next1']:(p)=>{
  const A=[150,420],B=[560,170];
  let s=ground(80,700,440);
  s+=draw([A,B],seg(p,.05,.25),{color:C.x,w:4});
  s+=draw([A,[560,420],B],seg(p,.15,.35),{color:C.x,w:4,dash:'10 8'});
  s+=draw([A,[250,120],[450,120],B],seg(p,.25,.45),{color:C.x,w:4,dash:'4 8'});
  s+=dot(A[0],A[1],10,C.hi)+dot(B[0],B[1],10,C.hi)+label('A',A[0]-28,A[1]-8,{size:28,color:C.hi,weight:700})+label('B',B[0]+16,B[1]-8,{size:28,color:C.hi,weight:700});
  s+=fade(seg(p,.4,.55),line(620,420,620,170,{color:C.hi,w:3})+label('高さの 差',635,300,{size:24,color:C.hi,weight:700}));
  s+=card(760,90,420,300,label('重力の 仕事',970,160,{size:30,color:C.F,anchor:'middle',weight:700})+label('どの 道 でも 同じ',970,215,{size:28,color:C.ink,anchor:'middle'})+label('（高さの 差 だけ）',970,260,{size:24,color:C.dim,anchor:'middle'})+fade(seg(p,.65,.8),label('ばねの 力も 両端 だけ',970,335,{size:26,color:C.F,anchor:'middle',weight:700})),seg(p,.45,.6));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(200,70,800,190,label('道に よらない 力 なら',600,140,{size:32,color:C.ink,anchor:'middle'})+label('仕事 を 位置だけの 関数 に まとめられる？',600,205,{size:32,color:C.E,anchor:'middle',weight:700}),1);
  s+=card(350,300,500,160,label('次の問い',600,345,{size:24,color:C.dim,anchor:'middle'})+tex(`${E_('U')}(x)\\ ?`,600,420,{size:56}),seg(p,.4,.55),C.hi);
  return s;
 },
};
