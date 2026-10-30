// YouTube シリーズ 仕事・中級 2/3（ステージ um-work-energy 本6〜本9）— 図。Stage 1200×515.
// 色：力 F 緑、位置 x・dx 水色、速度 v・dv 紫、時刻 t・dt 金、仕事・エネルギー 橙、強調 黄、誤り 赤。
// 例：2 kg・4 N・静止から。x＝1 → v＝2；x＝1.01 → v≈2.00998。dv/dx≈0.998。F dx＝0.04 J、mv dv≈0.040 J。
// 短冊：左は F–x（高さ 4 N、幅 dx）、右は mv–v（直線 mv＝2v、高さ mv＝4、幅 dv）。幅は見やすく拡大して描く。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,poly,draw} from './anim.mjs';

const K='um-work-energy-2:';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const WE=`{\\color{${C.E}}`;

// ---- 道筋の地図（1/3 と同じ） ----
const STEPS=['a=\\dfrac{dv}{dt}','dt=\\dfrac{dx}{v}','a=\\dfrac{dv}{dx/v}'];
function roadmap(p,{y=230,here=-1,g=1,goal=0}={}){
 let s='';const xs=[150,390,600,810,1050];
 s+=fade(g,line(xs[0]+90,y,xs[4]-110,y,{color:C.faint,w:4,dash:'10 10'}));
 s+=card(xs[0]-100,y-60,200,120,tex('F=ma',xs[0],y+12,{size:44})+label('出発点',xs[0],y+95,{size:24,color:C.dim,anchor:'middle'}),g,C.F);
 s+=card(xs[4]-130,y-80,260,165,label('速さ ⇄ 位置',xs[4],y-35,{size:28,color:C.hi,anchor:'middle',weight:700})+fade(goal,tex('F=mv\\dfrac{dv}{dx}',xs[4],y+45,{size:30})),g,C.hi);
 s+=fade(g,label('ゴール',xs[4],y+115,{size:24,color:C.dim,anchor:'middle'}));
 for(let i=0;i<3;i++){const x=xs[i+1];
  s+=fade(g,rect(x-95,y-55,190,110,{fill:'#131f38',fo:.96,stroke:C.ink,sw:2,rx:12})+tex(STEPS[i],x,y+12,{size:34})+label(`${['一','二','三'][i]}手目`,x,y-72,{size:24,color:C.ink,anchor:'middle'}));}
 if(here>=0)s+=fade(g,arrow(here,y+170,here,y+90,{color:C.hi,w:5,head:16})+label('いま ここ',here,y+200,{size:24,color:C.hi,anchor:'middle',weight:700}));
 return s;
}
// ---- 歯車 ----
function gear(cx,cy,r,rot,color,n=12){
 const pts=[];for(let i=0;i<n*4;i++){const a=rot+i*Math.PI*2/(n*4),rr=(i%4<2)?r+12:r-4;pts.push([cx+rr*Math.cos(a),cy+rr*Math.sin(a)]);}
 return poly(pts,{fill:color,fo:.18,stroke:color,sw:3})+ring(cx,cy,r*.35,{color,w:3});
}
// ---- 短冊グラフ ----
const GL=(g=1)=>axes({x:80,y:430,w:440,h:300,xmin:0,xmax:2,ymin:0,ymax:6,xlabel:'x [m]',ylabel:'F [N]',xticks:[1,2],yticks:[4],xcolor:C.x,ycolor:C.F,g});
const GR=(g=1)=>axes({x:680,y:430,w:380,h:300,xmin:0,xmax:3,ymin:0,ymax:7,xlabel:'v [m/s]',ylabel:'mv',xticks:[1,2,3],yticks:[4],xcolor:C.v,ycolor:C.v,g});
function stripL(G,g=1,w=.12){return fade(g,rect(G.X(1),G.Y(4),G.X(1+w)-G.X(1),G.Y(0)-G.Y(4),{fill:C.E,fo:.55,stroke:C.E,sw:2,rx:1}));}
function stripR(G,g=1,w=.18){return fade(g,rect(G.X(2),G.Y(4),G.X(2+w)-G.X(2),G.Y(0)-G.Y(4),{fill:C.E,fo:.55,stroke:C.E,sw:2,rx:1}));}

export const ytUmWorkEnergy2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=tex('a=\\dfrac{dv}{dt}',230,200,{size:60});
  s+=fade(seg(p,.2,.35),arrow(370,200,480,200,{color:C.dim,w:4,head:14})+label('dt ＝ dx/v',425,145,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),tex('a=\\dfrac{dv}{dx/v}',680,200,{size:64}));
  s+=fade(seg(p,.6,.75),label('（v ≠ 0 の 区間）',680,390,{size:28,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'lastq']:(p)=>card(150,50,900,410,label('前回の 最後の問い',600,100,{size:24,color:C.dim,anchor:'middle'})+tex('a=\\dfrac{dv}{dx/v}',600,215,{size:64})
   +fade(seg(p,.3,.45),label('どう 整理 できる？',600,340,{size:36,color:C.hi,anchor:'middle',weight:700}))+fade(seg(p,.5,.65),label('何を 意味する？',600,405,{size:36,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi),
 [K+'map']:(p)=>roadmap(p,{here:810}),
 [K+'ask']:(p)=>{
  let s=tex('a=\\dfrac{dv}{dx/v}',300,190,{size:64});
  s+=arrow(460,190,560,190,{color:C.dim,w:4,head:14,g:seg(p,.1,.25)})+fade(seg(p,.15,.3),label('整理',510,150,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),tex('F=m\\,?',720,190,{size:60}));
  s+=card(250,320,700,150,label('時刻 t は どう なる？',600,380,{size:34,color:C.t,anchor:'middle',weight:700})+label('何が 見えて くる？',600,440,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },

 // ===== S2 分母の分数を整理する =====
 [K+'inv']:(p)=>{
  let s=label('分数で 割る ＝ 逆数を 掛ける',600,80,{size:34,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.25,.4),tex('1\\div\\dfrac12=1\\times 2=2',600,230,{size:60}));
  s+=fade(seg(p,.5,.65),tex('\\div\\dfrac{A}{B}\\;=\\;\\times\\dfrac{B}{A}',600,390,{size:52,color:C.dim}));
  s+=fade(seg(p,.5,.65),label('四手目',160,230,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'tidy']:(p)=>{
  let s=tex('a=dv\\div\\dfrac{dx}{v}',600,80,{size:50});
  s+=fade(seg(p,.1,.3),tex('=dv\\times\\dfrac{v}{dx}',600,215,{size:50}));
  s+=fade(seg(p,.4,.6),tex('a=v\\dfrac{dv}{dx}',600,400,{size:76})+highlight(440,280,320,200,seg(p,.6,.75)));
  return s;
 },
 [K+'num']:(p)=>{
  let s=label('v ＝ 2、dv ＝ 0.02、dx ＝ 0.02',600,80,{size:30,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.15,.3),tex('v\\dfrac{dv}{dx}=2\\times\\dfrac{0.02}{0.02}',600,220,{size:54}));
  s+=fade(seg(p,.45,.6),tex('=2\\ \\mathrm{m/s^2}',600,370,{size:58})+ok(790,380));
  return s;
 },
 [K+'mean1']:(p)=>{
  const f='a=v\\dfrac{dv}{dx}',z=80;
  let s=tex(f,330,200,{size:z});
  const cx=330+texWidth(f,z)/2-texWidth('\\dfrac{dv}{dx}',z)/2;
  const fw=texWidth('\\dfrac{dv}{dx}',z);s+=highlight(cx-fw/2-14,200-1.45*z,fw+28,2.05*z,seg(p,.1,.25),C.v);
  s+=card(660,90,480,240,label('1 m 進む 間に',900,160,{size:30,color:C.x,anchor:'middle',weight:700})+label('速度が どれだけ',900,215,{size:30,color:C.v,anchor:'middle'})+label('変わるか',900,265,{size:30,color:C.v,anchor:'middle'}),seg(p,.3,.45),C.v);
  s+=fade(seg(p,.6,.75),label('位置 あたりの 速度の 変化',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mean2']:(p)=>{
  const bx=(x,t1,t2,c,g)=>card(x-150,120,300,170,label(t1,x,190,{size:28,color:c,anchor:'middle',weight:700})+label(t2,x,245,{size:24,color:C.dim,anchor:'middle'}),g,c);
  let s=bx(220,'v','1秒に 何 m',C.v,1);
  s+=fade(seg(p,.1,.2),label('×',415,215,{size:48,color:C.ink,anchor:'middle'}));
  s+=bx(600,'dv/dx','1 m あたりの 変化',C.v,seg(p,.1,.25));
  s+=fade(seg(p,.35,.45),label('＝',795,215,{size:48,color:C.ink,anchor:'middle'}));
  s+=bx(980,'加速度 a','1秒 あたりの 変化',C.a,seg(p,.4,.55));
  s+=fade(seg(p,.6,.75),label('（何 m/秒）×（1 m ごとの 変化）＝ 1秒ごとの 変化',600,400,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=tex('\\dfrac{dv}{dx}:\\ \\dfrac{\\mathrm{m/s}}{\\mathrm{m}}=\\mathrm{1/s}',600,140,{size:56});
  s+=fade(seg(p,.35,.5),tex('v\\dfrac{dv}{dx}:\\ \\mathrm{\\dfrac{m}{s}}\\times\\mathrm{\\dfrac{1}{s}}=\\mathrm{m/s^2}',600,320,{size:56})+ok(1010,330,seg(p,.6,.75)));
  s+=fade(seg(p,.65,.8),label('加速度の 単位',600,460,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S3 連鎖律でも同じ形 =====
 [K+'gear']:(p)=>{
  const r=p*6;
  let s=gear(250,260,95,r,C.t)+gear(600,260,95,-r+.2,C.x)+gear(950,260,95,r,C.v);
  s+=label('t',250,272,{size:34,color:C.t,anchor:'middle',weight:700})+label('x',600,272,{size:34,color:C.x,anchor:'middle',weight:700})+label('v',950,272,{size:34,color:C.v,anchor:'middle',weight:700});
  s+=label('時刻',250,410,{size:28,color:C.t,anchor:'middle',weight:700})+label('位置',600,410,{size:28,color:C.x,anchor:'middle',weight:700})+label('速度',950,410,{size:28,color:C.v,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.35),label('一段目',425,110,{size:26,color:C.dim,anchor:'middle'}))+fade(seg(p,.45,.6),label('二段目',775,110,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('連鎖律 ＝ 二段の 歯車（微分の 法則の 回）',600,480,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gear2']:(p)=>{
  const r=.8;
  let s=gear(250,220,80,r,C.t)+gear(600,220,80,-r,C.x)+gear(950,220,80,r,C.v);
  s+=label('t',250,232,{size:30,color:C.t,anchor:'middle',weight:700})+label('x',600,232,{size:30,color:C.x,anchor:'middle',weight:700})+label('v',950,232,{size:30,color:C.v,anchor:'middle',weight:700});
  s+=card(270,330,320,175,label('一段目の 倍率',430,365,{size:24,color:C.dim,anchor:'middle'})+tex('\\dfrac{dx}{dt}=v',430,455,{size:40}),seg(p,.05,.2),C.x);
  s+=card(620,330,320,175,label('二段目の 倍率',780,365,{size:24,color:C.dim,anchor:'middle'})+tex('\\dfrac{dv}{dx}',780,455,{size:40}),seg(p,.45,.6),C.v);
  return s;
 },
 [K+'chain']:(p)=>{
  let s=tex('\\dfrac{dv}{dt}=\\dfrac{dv}{dx}\\times\\dfrac{dx}{dt}',600,140,{size:62});
  s+=fade(seg(p,.35,.5),tex('=v\\dfrac{dv}{dx}',600,310,{size:66}));
  s+=fade(seg(p,.6,.75),label('割り算の 整理と 同じ 形',600,450,{size:32,color:C.hi,anchor:'middle',weight:700})+ok(820,320));
  return s;
 },
 [K+'notcancel']:(p)=>{
  let s=tex('\\dfrac{\\Delta v}{\\Delta t}=\\dfrac{\\Delta v}{\\Delta x}\\times\\dfrac{\\Delta x}{\\Delta t}',600,140,{size:56});
  s+=fade(seg(p,.2,.35),label('Δx ≠ 0 なら ぴったり 成り立つ 等式',600,260,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),arrow(600,290,600,340,{color:C.dim,w:4,head:14})+label('幅を 0 へ 近づけた 先',790,325,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),tex('\\dfrac{dv}{dt}=\\dfrac{dv}{dx}\\cdot\\dfrac{dx}{dt}',600,430,{size:48}));
  s+=fade(seg(p,.65,.8),label('d の 約分 ではない',190,440,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=label('v ＝ 2t、x ＝ t²（2 kg を 4 N で 静止から）',600,70,{size:28,color:C.dim,anchor:'middle'});
  const row=(y,xv,t,v,g)=>fade(g,tex(xv,300,y,{size:40})+tex(t,620,y,{size:40})+tex(v,940,y,{size:40}));
  s+=row(170,'x=1\\ \\mathrm{m}','t=1\\ \\mathrm{s}','v=2\\ \\mathrm{m/s}',seg(p,.1,.25));
  s+=row(290,'x=1.01\\ \\mathrm{m}','t\\approx1.00499\\ \\mathrm{s}','v\\approx2.00998\\ \\mathrm{m/s}',seg(p,.35,.5));
  s+=fade(seg(p,.6,.75),tex('dx=0.01',300,410,{size:40,color:C.x})+tex('dv\\approx0.00998',940,410,{size:40,color:C.v})+label('増えた 分',620,418,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'num3']:(p)=>{
  let s=tex('\\dfrac{dv}{dx}\\approx\\dfrac{0.00998}{0.01}\\approx0.998',600,130,{size:54});
  s+=fade(seg(p,.35,.5),tex('v\\dfrac{dv}{dx}\\approx2\\times0.998\\approx2',600,290,{size:54}));
  s+=fade(seg(p,.6,.75),label('a ＝ 2 m/s² と 一致',600,430,{size:32,color:C.hi,anchor:'middle',weight:700})+ok(780,440));
  return s;
 },

 // ===== S4 時刻が消える =====
 [K+'Fx1']:(p)=>{
  const f='F=ma',z=70,w=texWidth(f,z);
  let s=tex(f,600,110,{size:z})+highlight(600+w/2-texWidth('a',z)-14,50,texWidth('a',z)+28,90,seg(p,.1,.25),C.a);
  s+=fade(seg(p,.3,.45),arrow(600,170,600,225,{color:C.dim,w:4,head:14})+label('a ＝ v dv/dx を 入れる',800,210,{size:26,color:C.dim}));
  s+=fade(seg(p,.5,.7),tex('F=mv\\dfrac{dv}{dx}',600,350,{size:80}));
  s+=fade(seg(p,.6,.75),label('五手目',230,350,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'Fx2']:(p)=>{
  let s=tex('F=mv\\dfrac{dv}{dx}',600,200,{size:100});
  s+=card(300,330,600,120,label('t が どこにも ない！',600,405,{size:40,color:C.t,anchor:'middle',weight:700}),seg(p,.4,.55),C.t);
  return s;
 },
 [K+'Fx3']:(p)=>{
  let s=tex('F=mv\\dfrac{dv}{dx}',600,120,{size:70});
  const tag=(x,t,c,g)=>fade(g,label(t,x,320,{size:32,color:c,anchor:'middle',weight:700}));
  s+=tag(240,'力 F',C.F,seg(p,.4,.5))+tag(480,'質量 m',C.ink,seg(p,.45,.55))+tag(720,'速さ v',C.v,seg(p,.5,.6))+tag(960,'位置 x',C.x,seg(p,.55,.65));
  s+=fade(seg(p,.1,.25),label('dt → dx/v と 置き換えた から',600,230,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('残ったのは これ だけ（時刻 なし）',600,430,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'goal']:(p)=>roadmap(p,{goal:seg(p,.2,.4)})+fade(seg(p,.5,.65),label('速さ と 位置 を 直接 つなぐ 式',600,80,{size:32,color:C.hi,anchor:'middle',weight:700})),
 [K+'numF']:(p)=>{
  let s=tex('mv\\dfrac{dv}{dx}\\approx2\\times2\\times0.998',600,130,{size:56});
  s+=fade(seg(p,.3,.45),tex('\\approx4\\ \\mathrm{N}',600,280,{size:64}));
  s+=fade(seg(p,.5,.65),label('押している 力 F ＝ 4 N と 一致',600,420,{size:32,color:C.F,anchor:'middle',weight:700})+ok(870,430));
  return s;
 },
 [K+'solve']:(p)=>{
  let s=tex('\\dfrac{dv}{dx}=\\dfrac{F}{mv}',400,210,{size:86});
  s+=card(700,100,440,240,label('1 m での 速度の 変化は',920,170,{size:28,color:C.ink,anchor:'middle'})+label('力 F と',920,230,{size:30,color:C.F,anchor:'middle',weight:700})+label('今の 速さ v で 決まる',920,285,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'quiz']:(p)=>card(200,80,800,340,label('問題（同じ 4 N・2 kg）',600,140,{size:26,color:C.dim,anchor:'middle'})+label('4 m/s の ときの dv/dx は',600,220,{size:34,color:C.v,anchor:'middle',weight:700})+label('2 m/s の ときの 何倍？',600,290,{size:34,color:C.v,anchor:'middle',weight:700})+tex('\\dfrac{dv}{dx}=\\dfrac{F}{mv}',600,375,{size:36}),seg(p,0,.15),C.hi),
 [K+'ans']:(p)=>{
  let s=tex('\\dfrac{4}{2\\times2}=1',330,140,{size:50})+label('2 m/s',330,230,{size:28,color:C.v,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),tex('\\dfrac{4}{2\\times4}=0.5',870,140,{size:50})+label('4 m/s',870,230,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('v が 2倍 → 半分（0.5 倍）',600,320,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('速いほど 1 m を すぐ 通り過ぎ、力を 受ける 時間が 短い',600,420,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },

 // ===== S5 両辺に dx を掛ける =====
 [K+'mdx']:(p)=>{
  let s=tex('F=mv\\dfrac{dv}{dx}',600,100,{size:56});
  s+=fade(seg(p,.1,.25),label('両辺に × dx',900,110,{size:28,color:C.x,weight:700}));
  s+=fade(seg(p,.3,.45),arrow(600,160,600,215,{color:C.dim,w:4,head:14}));
  s+=fade(seg(p,.4,.6),tex('F\\,dx=mv\\,dv',600,330,{size:90}));
  s+=fade(seg(p,.6,.75),label('六手目',220,330,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'split']:(p)=>{
  let s=tex('F\\,dx=mv\\,dv',600,160,{size:90});
  s+=card(120,280,420,170,label('左：位置の 小さな 変化',330,345,{size:28,color:C.x,anchor:'middle',weight:700})+tex('dx',330,410,{size:44}),seg(p,.2,.35),C.x);
  s+=card(660,280,420,170,label('右：速さの 小さな 変化',870,345,{size:28,color:C.v,anchor:'middle',weight:700})+tex('dv',870,410,{size:44}),seg(p,.4,.55),C.v);
  return s;
 },
 [K+'left1']:(p)=>{
  let s=card(200,60,800,220,label('初級（仕事）',600,110,{size:24,color:C.dim,anchor:'middle'})+label('仕事 ＝ 進む 向きの 力 × 進んだ 距離',600,180,{size:34,color:C.E,anchor:'middle',weight:700})+tex('W=FL',600,240,{size:40,color:C.E}),1,C.E);
  s+=fade(seg(p,.3,.45),tex('F\\,dx\\ =\\ ?',600,380,{size:64}));
  return s;
 },
 [K+'left2']:(p)=>{
  const G=GL();
  let s=G.svg+G.plot(()=>4,{from:0,to:1.9,color:C.F,w:4})+stripL(G,seg(p,.3,.45));
  s+=fade(seg(p,.4,.55),label('dx',G.X(1.06),G.Y(0)+60,{size:26,color:C.x,anchor:'middle',weight:700})+label('F',G.X(1)-22,G.Y(2)+10,{size:28,color:C.F,anchor:'end',weight:700}));
  s+=card(640,110,520,260,label('小さな 仕事',900,175,{size:34,color:C.E,anchor:'middle',weight:700})+tex(`${WE}F\\,dx}`,900,250,{size:52,auto:false})+label('高さ F、幅 dx の 短冊',900,330,{size:26,color:C.dim,anchor:'middle'}),seg(p,.1,.25),C.E);
  return s;
 },
 [K+'right1']:(p)=>{
  const G=GL(),R=GR(seg(p,.05,.2));
  let s=G.svg+G.plot(()=>4,{from:0,to:1.9,color:C.F,w:4})+stripL(G);
  s+=label('F dx',G.X(1.06),G.Y(4)-18,{size:26,color:C.E,anchor:'middle',weight:700});
  s+=R.svg+R.plot(v=>2*v,{from:0,to:3.2,p:seg(p,.15,.35),color:C.v,w:4})+stripR(R,seg(p,.4,.55));
  s+=fade(seg(p,.5,.65),label('dv',R.X(2.09),R.Y(0)+60,{size:26,color:C.v,anchor:'middle',weight:700})+label('mv',R.X(2)-20,R.Y(2)+10,{size:26,color:C.v,anchor:'end',weight:700})+label('mv dv',R.X(2.09),R.Y(4)-50,{size:26,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'numL']:(p)=>{
  const G=GL();
  let s=G.svg+G.plot(()=>4,{from:0,to:1.9,color:C.F,w:4})+stripL(G);
  s+=card(620,100,540,270,label('x：1 m → 1.01 m、F ＝ 4 N',890,160,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.3,.45),tex(`F\\,dx=4\\times0.01=${WE}0.04\\ \\mathrm{J}}`,890,260,{size:44})),1,C.E);
  return s;
 },
 [K+'numR']:(p)=>{
  const G=GL(),R=GR();
  let s=G.svg+G.plot(()=>4,{from:0,to:1.9,color:C.F,w:4})+stripL(G)+label('0.04 J',G.X(1.06),G.Y(4)-18,{size:26,color:C.E,anchor:'middle',weight:700});
  s+=R.svg+R.plot(v=>2*v,{from:0,to:3.2,color:C.v,w:4})+stripR(R);
  s+=fade(seg(p,.05,.25),tex('mv\\,dv\\approx2\\times2\\times0.00998',600,38,{size:32})+label('≈ 0.040 J',R.X(2.09),R.Y(4)-60,{size:26,color:C.E,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('面積が',592,230,{size:30,color:C.hi,anchor:'middle',weight:700})+label('一致',592,272,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'units']:(p)=>{
  let s=label('左',260,120,{size:30,color:C.dim,anchor:'middle'})+tex('\\mathrm{N\\cdot m}',420,120,{size:50});
  s+=fade(seg(p,.2,.35),label('右',260,250,{size:30,color:C.dim,anchor:'middle'})+tex('\\mathrm{kg}\\times\\mathrm{\\dfrac{m}{s}}\\times\\mathrm{\\dfrac{m}{s}}=\\mathrm{kg\\cdot m^2/s^2}',560,250,{size:46}));
  s+=fade(seg(p,.5,.65),tex('\\mathrm{N}=\\mathrm{kg\\cdot m/s^2}\\ \\Rightarrow\\ \\mathrm{N\\cdot m}=\\mathrm{kg\\cdot m^2/s^2}',600,380,{size:40}));
  s+=fade(seg(p,.7,.85),label('どちらも ジュール J',600,470,{size:32,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'name']:(p)=>{
  let s=tex('F\\,dx=mv\\,dv',600,110,{size:70});
  s+=card(90,210,480,230,label('小さな 仕事',330,290,{size:34,color:C.E,anchor:'middle',weight:700})+label('力が した 分',330,350,{size:26,color:C.dim,anchor:'middle'}),seg(p,.1,.25),C.E);
  s+=card(630,210,480,230,label('運動の 側の 量の',870,280,{size:28,color:C.ink,anchor:'middle'})+label('小さな 増え分',870,330,{size:34,color:C.E,anchor:'middle',weight:700})+fade(seg(p,.55,.7),label('→ 正体は 運動エネルギー？',870,395,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.25,.4),C.E);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=tex('a=\\dfrac{dv}{dx/v}',230,180,{size:54});
  s+=fade(seg(p,.2,.35),arrow(380,180,470,180,{color:C.dim,w:4,head:14})+tex('a=v\\dfrac{dv}{dx}',650,180,{size:60}));
  s+=card(250,300,700,140,label('連鎖律（二段の 歯車）でも 同じ 形',600,385,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=tex('F=mv\\dfrac{dv}{dx}',320,120,{size:56})+fade(seg(p,.05,.2),label('時刻が 消えた',320,230,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),arrow(540,120,640,120,{color:C.dim,w:4,head:14})+label('× dx',590,85,{size:24,color:C.x,anchor:'middle',weight:700})+tex('F\\,dx=mv\\,dv',880,120,{size:56}));
  s+=card(170,300,860,150,label('小さな 仕事 ＝ 小さな 増え分',600,390,{size:36,color:C.E,anchor:'middle',weight:700}),seg(p,.55,.7),C.E);
  return s;
 },
 [K+'next']:(p)=>{
  const G=GL();
  let s=G.svg+G.plot(()=>4,{from:0,to:1.9,color:C.F,w:4});
  for(let i=0;i<12;i++){const a=.2+i*.12;s+=fade(seg(p,.05+.04*i,.1+.04*i),rect(G.X(a),G.Y(4),G.X(a+.12)-G.X(a)-2,G.Y(0)-G.Y(4),{fill:C.E,fo:.45,stroke:C.E,sw:1.5,rx:1}));}
  s+=card(640,110,520,280,label('始点 から 終点 まで',900,180,{size:30,color:C.ink,anchor:'middle'})+label('短冊を 足し上げると？',900,245,{size:34,color:C.hi,anchor:'middle',weight:700})+tex('\\sum F\\,dx=\\sum mv\\,dv\\ ?',900,330,{size:40}),seg(p,.4,.55),C.hi);
  return s;
 },
};
