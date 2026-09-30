// YouTube シリーズ 位置エネルギー・中級 2/2（ステージ um-potential-slope 本5〜本10＋補0・補2）— 図。Stage 1200×515.
// 色：力 F 緑、位置 x・高さ h 水色、エネルギー U・仕事 橙、傾き（接線）黄、負・誤り 赤、強調 黄。
// ばね U＝100x²（k＝200）：x＝±0.10 で傾き ±20、力 ∓20 N。山の例 U＝1−100x²。重力 U＝20h（2 kg）。摩擦 1 N：2 m → −2 J、6 m → −6 J。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,ground,block,poly,wall,spring} from './anim.mjs';

const K='um-potential-slope-2:';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const U_=`{\\color{${C.E}}U}`,dU=`d${U_}`,H_=`{\\color{${C.x}}h}`;
const DUDX=`\\dfrac{${dU}}{dx}`;
const HALF=`{\\color{${C.hi}}\\tfrac12}`;
const TG=C.hi; // tangent / slope colour

// valley graph over a track: U = 100x² (spring). Graph on top, track with the block below.
const GV=(o={})=>axes({x:110,y:330,w:560,h:260,xmin:-.14,xmax:.14,ymin:0,ymax:1.8,xlabel:'x [m]',ylabel:'U [J]',xticks:[-.1,.1],yticks:[1],xcolor:C.x,ycolor:C.E,...o});
const Uv=x=>100*x*x,dUv=x=>200*x;
function tangent(G,f,df,x0,{half=.045,color=TG,g=1}={}){
 const a=x0-half,b=x0+half;return fade(g,line(G.X(a),G.Y(f(x0)+df(x0)*(a-x0)),G.X(b),G.Y(f(x0)+df(x0)*(b-x0)),{color,w:4})+dot(G.X(x0),G.Y(f(x0)),9,C.E));
}
function track(G,x0,F,{y=450,g=1,fs=5,lab=''}={}){ // floor under the graph with a block at x0 and force arrow (F in N)
 let s=line(G.X(-.14),y,G.X(.14),y,{color:C.dim,w:3});
 s+=line(G.X(0),y-8,G.X(0),y+8,{color:C.dim,w:2});
 const bx=G.X(x0);
 s+=rect(bx-22,y-40,44,40,{fill:C.x,fo:.25,stroke:C.x,sw:2,rx:6});
 s+=line(bx,G.Y(Uv(x0))+10,bx,y-44,{color:C.faint,w:2,dash:'5 6'});
 if(Math.abs(F)>.5){const L=F*fs;s+=arrow(bx+(L>0?22:-22),y-20,bx+(L>0?22:-22)+L,y-20,{color:C.F,w:6,head:16})+label(lab||`${Math.abs(F)} N`,bx+(L>0?22:-22)+L+(L>0?10:-10),y-34,{size:24,color:C.F,anchor:L>0?'start':'end',weight:700});}
 return fade(g,s);
}

export const ytUmPotentialSlope2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=tex(`${dU}=-F\\,dx`,600,100,{size:60});
  s+=fade(seg(p,.35,.5),arrow(600,150,600,230,{color:C.E,w:5,head:16})+label('ばねの 力を 足し上げる',640,200,{size:26,color:C.E}));
  s+=fade(seg(p,.55,.7),tex(`${U_}=${HALF}kx^2`,600,320,{size:70}));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=tex(`${U_}=${HALF}kx^2`,330,200,{size:64})+fade(seg(p,.2,.35),arrow(500,190,720,190,{color:C.hi,w:5,head:18})+label('？',610,160,{size:40,color:C.hi,anchor:'middle',weight:700})+tex('F',820,200,{size:70}));
  s+=card(250,300,700,150,label('前回の 最後の問い',600,345,{size:24,color:C.dim,anchor:'middle'})+label('U の 式から 力を 取り戻せる？',600,410,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'info']:(p)=>{
  let s=card(300,70,600,200,label('位置の 関数',600,135,{size:28,color:C.dim,anchor:'middle'})+tex(`${U_}(x)`,600,220,{size:66}),1,C.E);
  s+=fade(seg(p,.35,.5),label('この 1つの 中に',600,330,{size:30,color:C.ink,anchor:'middle'})+label('力の 情報が 全部 入っている？',600,400,{size:36,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(90,90,500,320,label('問い 1',340,150,{size:24,color:C.dim,anchor:'middle'})+label('力は U の グラフの',340,230,{size:30,color:C.ink,anchor:'middle'})+label('どちら 向き？',340,300,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(610,90,500,320,label('問い 2',860,150,{size:24,color:C.dim,anchor:'middle'})+label('U を 作れない 力とは',860,230,{size:30,color:C.ink,anchor:'middle'})+label('どんな 力？',860,300,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },

 // ===== S2 定義を逆にたどる =====
 [K+'start']:(p)=>{
  let s=tex(`${dU}=-F\\,dx`,600,130,{size:80});
  s+=fade(seg(p,.5,.65),label('両辺を dx で 割る',600,320,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'divide']:(p)=>{
  const z=50,a=`${DUDX}=-F\\,`,b=`\\dfrac{dx}{dx}`,wa=texWidth(a,z),wb=texWidth(b,z),x0=600-(wa+wb)/2;
  let s=tex(`${dU}=-F\\,dx`,600,45,{size:40});
  s+=tex(a,x0,175,{size:z,anchor:'start'})+tex(b,x0+wa,175,{size:z,anchor:'start'});
  s+=fade(seg(p,.25,.4),line(x0+wa-4,215,x0+wa+wb+4,115,{color:C.a,w:4}));
  s+=fade(seg(p,.45,.6),tex(`${DUDX}=-F`,600,330,{size:z}));
  s+=fade(seg(p,.65,.8),label('dU/dx ＝ U の グラフの 傾き',600,470,{size:30,color:TG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'solve']:(p)=>{
  let s=tex(`${DUDX}=-F`,600,70,{size:48});
  s+=fade(seg(p,.1,.25),label('両辺に −1 を 掛ける',600,175,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),tex(`F=-${DUDX}`,600,310,{size:70}));
  s+=fade(seg(p,.6,.75),label('力 ＝ U の 傾き × （−1）',600,470,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=label('傾きの 単位',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=tex('\\dfrac{\\mathrm{J}}{\\mathrm{m}}',330,210,{size:64});
  s+=fade(seg(p,.25,.4),tex('=\\dfrac{\\mathrm{N\\cdot m}}{\\mathrm{m}}',560,210,{size:64}));
  s+=fade(seg(p,.5,.65),tex('=\\mathrm{N}',800,210,{size:64})+ok(890,222));
  s+=fade(seg(p,.7,.85),label('ちゃんと 力の 単位',600,380,{size:34,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'steep']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(Uv,{from:-.13,to:.13,color:C.E,w:5});
  s+=tangent(G,Uv,dUv,.11,{g:seg(p,.05,.2)})+tangent(G,Uv,dUv,.05,{g:seg(p,.2,.35)})+tangent(G,Uv,dUv,0,{g:seg(p,.55,.7)});
  s+=card(770,70,400,320,label('急な 傾き → 強い 力',970,150,{size:30,color:C.F,anchor:'middle',weight:700})+label('ゆるい 傾き → 弱い 力',970,220,{size:28,color:C.F,anchor:'middle'})+fade(seg(p,.55,.7),label('傾き 0 → 力 0',970,310,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },

 // ===== S3 ばねと重力で確かめる =====
 [K+'spring']:(p)=>{
  let s=tex(`${U_}=${HALF}kx^2`,600,70,{size:50});
  s+=fade(seg(p,.1,.3),tex(`${DUDX}=${HALF}k\\cdot 2x=kx`,600,200,{size:54}));
  s+=fade(seg(p,.3,.45),label('2 と ½ が 打ち消す',1010,215,{size:26,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),tex(`F=-${DUDX}=-kx`,600,360,{size:62})+ok(900,372));
  return s;
 },
 [K+'cycle']:(p)=>{
  let s=tex('F=-kx',260,230,{size:60})+tex(`${U_}=\\tfrac12kx^2`,940,230,{size:60});
  s+=fade(seg(p,.05,.2),arrow(420,170,760,170,{color:C.E,w:5,head:18})+label('足し上げる（積分）',590,135,{size:26,color:C.E,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),arrow(760,290,420,290,{color:C.F,w:5,head:18})+label('傾き × （−1）（微分）',590,340,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('U と F は 行き来できる',600,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(Uv,{from:-.13,to:.13,color:C.E,w:5});
  s+=tangent(G,Uv,dUv,.1,{g:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('傾き 20',G.X(.1)+40,G.Y(1)+40,{size:24,color:TG,weight:700}));
  s+=track(G,.1,-20,{g:seg(p,.55,.7)});
  s+=card(770,60,400,330,tex('x=0.10\\ \\mathrm{m}',970,120,{size:36})+fade(seg(p,.2,.35),tex('200\\times0.10=20\\ \\mathrm{J/m}',970,200,{size:32}))+fade(seg(p,.55,.7),tex('F=-20\\ \\mathrm{N}',970,285,{size:42})+label('左向き',970,355,{size:28,color:C.F,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'grav']:(p)=>{
  const FY=460,SC=110;
  let s=ground(100,460,FY)+line(160,FY,160,FY-3*SC-10,{color:C.x,w:3})+arrow(160,FY,160,FY-3.4*SC,{color:C.x,w:3,head:14})+label('h（上が 正）',180,FY-3.3*SC,{size:24,color:C.x,weight:700});
  s+=rect(250,FY-2*SC-70,90,70,{fill:C.x,fo:.22,stroke:C.x,sw:2,rx:8})+label('m',295,FY-2*SC-26,{size:28,color:C.ink,anchor:'middle'});
  s+=line(170,FY-2*SC,240,FY-2*SC,{color:C.x,w:2,dash:'6 6'});
  s+=card(560,120,560,230,tex(`${U_}=mg${H_}`,840,215,{size:66})+label('h は 上向きが 正',840,305,{size:28,color:C.x,anchor:'middle',weight:700}),seg(p,.15,.3));
  return s;
 },
 [K+'gravd']:(p)=>{
  let s=tex(`\\dfrac{${dU}}{d${H_}}=mg`,600,90,{size:56});
  s+=fade(seg(p,.3,.45),tex('F=-mg',600,250,{size:72}));
  s+=fade(seg(p,.6,.75),label('負号 ＝ 下向き',470,400,{size:34,color:C.hi,anchor:'middle',weight:700})+arrow(700,350,700,450,{color:C.F,w:7,head:20}));
  return s;
 },
 [K+'gravnum']:(p)=>{
  const G=axes({x:110,y:450,w:460,h:360,xmin:0,xmax:3.4,ymin:0,ymax:70,xlabel:'h [m]',ylabel:'U [J]',xticks:[1,2,3],yticks:[20,40,60],xcolor:C.x,ycolor:C.E});
  let s=G.svg+G.plot(h=>20*h,{from:0,to:3.2,color:C.E,w:5});
  for(const h of [.5,1.9])s+=fade(seg(p,.2,.35),draw([[G.X(h),G.Y(20*h)],[G.X(h+1),G.Y(20*h)],[G.X(h+1),G.Y(20*h+20)]],1,{color:TG,w:3})+label('1 m',G.X(h+.5),G.Y(20*h)+26,{size:22,color:TG,anchor:'middle'})+label('20 J',G.X(h+1)+10,G.Y(20*h+10)+8,{size:22,color:TG}));
  s+=card(650,70,500,340,label('初級の 2 kg の 箱',900,130,{size:28,color:C.dim,anchor:'middle'})+tex(`${U_}=20${H_}`,900,210,{size:50})+fade(seg(p,.2,.35),label('傾き：どこでも 20 J/m',900,285,{size:28,color:TG,anchor:'middle',weight:700}))+fade(seg(p,.55,.7),label('力：いつも 下向き 20 N',900,360,{size:30,color:C.F,anchor:'middle',weight:700})),1);
  return s;
 },

 // ===== S4 力は坂を下る向き =====
 [K+'valley']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(Uv,{from:-.13,to:.13,p:seg(p,.1,.5),color:C.E,w:5});
  s+=fade(seg(p,.5,.65),dot(G.X(0),G.Y(0),10,C.hi)+label('谷底 x ＝ 0',G.X(0)+16,G.Y(0)-16,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.45),line(G.X(-.14),450,G.X(.14),450,{color:C.dim,w:3})+label('床（物体は 横に 動く）',G.X(0),495,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(780,90,380,200,tex(`${U_}=${HALF}kx^2`,970,170,{size:44})+label('谷の 形',970,245,{size:30,color:C.E,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'right']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(Uv,{from:-.13,to:.13,color:C.E,w:5});
  s+=tangent(G,Uv,dUv,.1,{g:seg(p,.05,.2)});
  s+=track(G,.1,-20,{g:seg(p,.45,.6)});
  s+=card(780,60,390,330,label('x ＝ 0.10 m',975,115,{size:28,color:C.x,anchor:'middle',weight:700})+fade(seg(p,.1,.25),label('傾き ＋20（上り）',975,190,{size:28,color:TG,anchor:'middle',weight:700}))+fade(seg(p,.45,.6),label('力 −20 N',975,265,{size:30,color:C.F,anchor:'middle',weight:700})+label('← 谷底の 向き',975,330,{size:28,color:C.hi,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'left']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(Uv,{from:-.13,to:.13,color:C.E,w:5});
  s+=tangent(G,Uv,dUv,.1,{g:.5})+track(G,.1,-20,{g:.4});
  s+=tangent(G,Uv,dUv,-.1,{g:seg(p,.05,.2)});
  s+=track(G,-.1,20,{g:seg(p,.45,.6)});
  s+=card(780,60,390,330,label('x ＝ −0.10 m',975,115,{size:28,color:C.x,anchor:'middle',weight:700})+fade(seg(p,.1,.25),label('傾き −20（下り）',975,190,{size:28,color:TG,anchor:'middle',weight:700}))+fade(seg(p,.45,.6),label('力 ＋20 N',975,265,{size:30,color:C.F,anchor:'middle',weight:700})+label('谷底の 向き →',975,330,{size:28,color:C.hi,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'bottom']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(Uv,{from:-.13,to:.13,color:C.E,w:5});
  s+=tangent(G,Uv,dUv,.1,{g:.4})+tangent(G,Uv,dUv,-.1,{g:.4});
  s+=tangent(G,Uv,dUv,0,{g:seg(p,.05,.2),half:.05});
  s+=track(G,0,0,{g:seg(p,.3,.45)});
  s+=card(780,60,390,330,label('谷底 x ＝ 0',975,120,{size:30,color:C.hi,anchor:'middle',weight:700})+label('傾き 0 → 力 0',975,200,{size:30,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('自然の 長さ',975,280,{size:26,color:C.dim,anchor:'middle'})+label('押しも 引きも しない',975,330,{size:26,color:C.dim,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'rule']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(Uv,{from:-.13,to:.13,color:C.E,w:5});
  for(const x0 of [-.1,-.05,.05,.1]){const g=seg(p,.05,.3);s+=tangent(G,Uv,dUv,x0,{g,half:.025});const L=-dUv(x0)*3.2;s+=fade(g,arrow(G.X(x0),G.Y(Uv(x0))+22,G.X(x0)+L,G.Y(Uv(x0))+22,{color:C.F,w:5,head:14}));}
  s+=card(780,70,390,300,label('力は',975,140,{size:28,color:C.ink,anchor:'middle'})+label('U が 減る 向き',975,205,{size:32,color:C.F,anchor:'middle',weight:700})+label('＝ 坂を 下る 向き',975,265,{size:30,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.5,.65),tex(`F={\\color{${C.hi}}-}${DUDX}`,975,335,{size:36})),seg(p,.25,.4),C.hi);
  return s;
 },
 [K+'hill']:(p)=>{
  const G=GV({ymax:1.3,yticks:[1]}),Uh=x=>1-50*x*x,dUh=x=>-100*x;
  let s=G.svg+G.plot(Uh,{from:-.13,to:.13,color:C.E,w:5});
  for(const x0 of [-.09,.09]){const g=seg(p,.1,.35);s+=tangent(G,Uh,dUh,x0,{g,half:.03});const L=-dUh(x0)*5;s+=fade(g,arrow(G.X(x0),G.Y(Uh(x0))-24,G.X(x0)+L,G.Y(Uh(x0))-24,{color:C.F,w:5,head:14}));}
  s+=fade(seg(p,.55,.7),tangent(G,Uh,dUh,0,{half:.05})+label('山頂：傾き 0，力 0',G.X(0),G.Y(1)-30,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=card(780,90,390,240,label('山の 形なら',975,160,{size:28,color:C.ink,anchor:'middle'})+label('山頂から 離れる 向き',975,230,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.2,.35));
  return s;
 },
 [K+'meta1']:(p)=>{
  // ball on a real slope (left) vs U graph (right)
  let s=label('たとえ：坂を 転がる 玉',300,60,{size:28,color:C.dim,anchor:'middle'});
  s+=draw([[80,200],[520,420]],1,{color:C.dim,w:4})+line(80,420,520,420,{color:C.faint,w:2});
  s+=ring(260,272,20,{color:C.ink,w:2.5,fill:'#39475f'})+arrow(275,300,375,350,{color:C.F,w:5,head:14})+label('下る 向きに 押される',230,470,{size:24,color:C.F,anchor:'middle',weight:700});
  s+=card(640,70,520,360,label('対応する',900,130,{size:28,color:C.F,anchor:'middle',weight:700})+label('・坂を 下る 向きに 押される',680,200,{size:26,color:C.ink})+label('・急な ほど 強く 押される',680,260,{size:26,color:C.ink}),seg(p,.2,.35),C.F);
  return s;
 },
 [K+'meta2']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(Uv,{from:-.13,to:.13,color:C.E,w:5});
  s+=fade(seg(p,.05,.2),label('← 縦軸 ＝ エネルギー [J]',G.X(0)+50,G.Y(1.8)-36,{size:24,color:C.a,weight:700}));
  s+=track(G,.1,-20,{g:seg(p,.35,.5)});
  s+=fade(seg(p,.35,.5),label('物体は 床の 上を 横に 動く',G.X(0),500,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(780,70,390,300,label('対応しない',975,130,{size:28,color:C.a,anchor:'middle',weight:700})+label('・縦軸は 高さ でない',800,200,{size:24,color:C.ink})+label('・グラフの 坂を',800,260,{size:24,color:C.ink})+label('  登り下り しない',800,300,{size:24,color:C.ink}),seg(p,.1,.25),C.a);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(200,70,800,360,label('確かめ',600,120,{size:26,color:C.dim,anchor:'middle'})+tex(`F={\\color{${C.hi}}-}${DUDX}`,600,215,{size:54})
   +label('この 負号は',600,305,{size:30,color:C.ink,anchor:'middle'})+label('「力が いつも 負」の 意味？',600,375,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ans']:(p)=>{
  const G=GV();
  let s=G.svg+G.plot(Uv,{from:-.13,to:.13,color:C.E,w:5});
  s+=tangent(G,Uv,dUv,-.1)+track(G,-.1,20,{lab:'＋20 N'});
  s+=card(780,60,390,340,label('いいえ ✗',975,120,{size:32,color:C.a,anchor:'middle',weight:700})+label('x ＝ −0.10 m で',975,185,{size:26,color:C.x,anchor:'middle'})+label('力は 正の 20 N',975,235,{size:28,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('負号 ＝ 値の 正負 でなく',975,305,{size:24,color:C.ink,anchor:'middle'})+label('U が 減る 向き',975,350,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },

 // ===== S5 U を作れない力 =====
 [K+'fric']:(p)=>{
  let s=rect(70,50,640,420,{fill:'#2a3550',fo:.35,stroke:C.faint,sw:2,rx:10})+label('上から 見た 床（摩擦 1 N）',90,455,{size:22,color:C.dim});
  s+=dot(250,330,11,C.ink)+label('A',236,318,{size:30,color:C.ink,anchor:'end',weight:700})+dot(470,330,11,C.ink)+label('B',486,318,{size:30,color:C.ink,weight:700});
  s+=fade(seg(p,.4,.55),label('2 m',360,370,{size:24,color:C.x,anchor:'middle',weight:700})+line(250,350,470,350,{color:C.x,w:2,dash:'5 6'}));
  return s;
 },
 [K+'fricnum']:(p)=>{
  let s=rect(70,50,640,420,{fill:'#2a3550',fo:.35,stroke:C.faint,sw:2,rx:10})+label('上から 見た 床（摩擦 1 N）',90,455,{size:22,color:C.dim});
  s+=draw([[250,330],[470,330]],seg(p,.05,.3),{color:C.hi,w:6});
  s+=draw([[250,330],[250,110],[470,110],[470,330]],seg(p,.45,.8),{color:C.p,w:6,dash:''});
  s+=dot(250,330,11,C.ink)+label('A',236,318,{size:30,color:C.ink,anchor:'end',weight:700})+dot(470,330,11,C.ink)+label('B',486,318,{size:30,color:C.ink,weight:700});
  s+=fade(seg(p,.45,.6),label('2 m',230,225,{size:22,color:C.p,anchor:'end'})+label('2 m',360,95,{size:22,color:C.p,anchor:'middle'})+label('2 m',490,225,{size:22,color:C.p}));
  s+=card(760,70,410,340,label('まっすぐ 2 m',965,135,{size:28,color:C.hi,anchor:'middle',weight:700})+tex('-1\\times2=-2\\ \\mathrm{J}',965,195,{size:38})
   +fade(seg(p,.5,.65),label('遠回り 6 m',965,275,{size:28,color:C.p,anchor:'middle',weight:700})+tex('-1\\times6=-6\\ \\mathrm{J}',965,335,{size:38})),seg(p,.1,.25));
  return s;
 },
 [K+'contra']:(p)=>{
  let s=card(150,60,900,180,label('もし 摩擦に U が あれば',600,120,{size:30,color:C.ink,anchor:'middle'})+label('A → B の 仕事 ＝ A と B の U の 差だけで 決まる',600,190,{size:28,color:C.E,anchor:'middle',weight:700}),seg(p,0,.15));
  s+=card(350,290,500,140,label('値は 1つの はず',600,375,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'contra2']:(p)=>{
  let s=card(150,50,900,200,label('同じ 2点 A，B で',600,105,{size:28,color:C.ink,anchor:'middle'})+tex(`{\\color{${C.hi}}-2\\ \\mathrm{J}}`,470,190,{size:48,auto:false})+label('と',600,200,{size:34,color:C.ink,anchor:'middle'})+tex(`{\\color{${C.p}}-6\\ \\mathrm{J}}`,730,190,{size:48,auto:false}),1);
  s+=card(200,290,800,150,label('位置だけで 決まる U は 作れない',600,375,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.45,.6),C.a);
  return s;
 },
 [K+'grav2']:(p)=>{
  const AX=110,AY=440,SP=58,P=(u,v)=>[AX+SP*u,AY-SP*v];
  let s=ground(AX-40,P(5,0)[0]+30,AY);
  const paths=[[[0,0],[4,3]],[[0,0],[4,0],[4,3]],[[0,0],[0,5],[4,5],[4,3]]],cols=[C.hi,C.p,C.v];
  paths.forEach((pa,i)=>{s+=draw(pa.map(([u,v])=>P(u,v)),seg(p,.05+.12*i,.2+.12*i),{color:cols[i],w:5});});
  s+=dot(...P(0,0),10,C.ink)+label('A',P(0,0)[0]-14,P(0,0)[1]-10,{size:28,color:C.ink,anchor:'end',weight:700})+dot(...P(4,3),10,C.ink)+label('B',P(4,3)[0]+16,P(4,3)[1]+8,{size:28,color:C.ink,weight:700});
  const row=(y,t,vals,c,res,g)=>fade(g,label(t,500,y,{size:26,color:c,weight:700})+vals.map((v,i)=>label(v,700+i*120,y,{size:28,color:C.ink,anchor:'middle',weight:700})).join('')+label(res,1110,y,{size:26,color:c,anchor:'middle',weight:700}));
  s+=card(470,60,710,390,label('2 kg，A → B（初級）',825,110,{size:24,color:C.dim,anchor:'middle'})
   +row(200,'重力',['−60','−60','−60'],C.F,'同じ',seg(p,.4,.55))
   +row(310,'摩擦',['−2','−6',''],C.a,'違う',seg(p,.6,.75))
   +fade(seg(p,.6,.75),label('（床の 上，1 N）',560,350,{size:20,color:C.dim})),1);
  return s;
 },
 [K+'cons']:(p)=>{
  let s=card(140,40,920,150,label('保存力',600,100,{size:40,color:C.hi,anchor:'middle',weight:700})+label('＝ 2点間の 仕事が 道に よらない 力',600,160,{size:30,color:C.ink,anchor:'middle'}),1,C.hi);
  const cd=(x,t,g)=>card(x,220,260,100,label(t,x+130,282,{size:30,color:C.F,anchor:'middle',weight:700}),g,C.F);
  s+=cd(160,'重力',seg(p,.2,.3))+cd(470,'ばねの 力',seg(p,.28,.38))+cd(780,'静電気力',seg(p,.36,.46));
  s+=fade(seg(p,.6,.75),label('U を 作れるのは 保存力 だけ（摩擦 ✗）',600,420,{size:32,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'base']:(p)=>{
  let s=tex(`${U_}\\;\\longrightarrow\\;${U_}+{\\color{${C.hi}}c}`,600,150,{size:70});
  s+=fade(seg(p,.4,.55),label('0 の 基準を 変える ＝ どこでも 同じ 定数 c を 足す',600,320,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'base2']:(p)=>{
  const G=axes({x:110,y:390,w:460,h:330,xmin:0,xmax:3.4,ymin:-25,ymax:70,xlabel:'h [m]',ylabel:'U [J]',xticks:[1,2,3],yticks:[20,60],xcolor:C.x,ycolor:C.E});
  let s=G.svg+G.plot(h=>20*h,{from:0,to:3.2,color:C.E,w:5})+label('床が 基準',G.X(3.2)+10,G.Y(64)+8,{size:22,color:C.E,weight:700});
  s+=fade(seg(p,.25,.4),G.plot(h=>20*h-20,{from:0,to:3.2,color:C.p,w:5})+label('机が 基準',G.X(3.2)+10,G.Y(44)+8,{size:22,color:C.p,weight:700}));
  s+=card(720,60,440,340,tex(`${U_}=20${H_}`,940,130,{size:42})+fade(seg(p,.25,.4),tex(`${U_}=20${H_}-20`,940,210,{size:42}))+fade(seg(p,.55,.7),label('平行：傾きは どちらも 20',940,300,{size:28,color:TG,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'base3']:(p)=>{
  let s=tex(`\\dfrac{d}{d${H_}}\\bigl(20${H_}-{\\color{${C.hi}}20}\\bigr)=20-{\\color{${C.hi}}0}=20`,600,90,{size:50});
  s+=fade(seg(p,.2,.35),label('定数は 微分すると 0',600,190,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(120,250,460,190,label('力',350,305,{size:28,color:C.F,anchor:'middle',weight:700})+label('同じ 下向き 20 N',350,380,{size:32,color:C.F,anchor:'middle',weight:700}),seg(p,.3,.45),C.F);
  s+=card(620,250,460,190,label('差（0 → 3 m）',850,305,{size:28,color:C.E,anchor:'middle',weight:700})+label('60 − 0 ＝ 40 − (−20) ＝ 60 J',850,380,{size:26,color:C.E,anchor:'middle',weight:700}),seg(p,.6,.75),C.E);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(80,40,1040,190,label('力 ＝ U の 傾き × （−1）',600,85,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(`F=-${DUDX}`,600,185,{size:42}),1);
  s+=card(80,260,1040,190,label('向き：U の 坂を 下る 向き',600,330,{size:32,color:C.F,anchor:'middle',weight:700})+label('谷底・山頂では 力 0',600,400,{size:28,color:C.dim,anchor:'middle'}),seg(p,.45,.6));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,40,1040,190,label('U を 作れるのは 保存力 だけ',600,110,{size:34,color:C.E,anchor:'middle',weight:700})+label('（重力・ばね・静電気力）',600,175,{size:26,color:C.dim,anchor:'middle'}),1);
  s+=card(80,260,1040,190,label('摩擦 → 道で 仕事が 変わる → U なし',600,355,{size:32,color:C.a,anchor:'middle',weight:700}),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'next1']:(p)=>{
  const Gx=axes({x:90,y:420,w:420,h:260,xmin:0,xmax:1.1,ymin:0,ymax:1.2,xlabel:'x',ylabel:'F',xcolor:C.x,ycolor:C.F});
  let s=label('位置で 積む → 仕事',300,70,{size:28,color:C.E,anchor:'middle',weight:700})+Gx.svg+Gx.plot(x=>.9*x,{from:0,to:1,color:C.F,w:4})+poly([[Gx.X(0),Gx.Y(0)],[Gx.X(1),Gx.Y(.9)],[Gx.X(1),Gx.Y(0)]],{fill:C.E,fo:.35});
  const Gt=axes({x:690,y:420,w:420,h:260,xmin:0,xmax:1.1,ymin:0,ymax:1.2,xlabel:'t',ylabel:'F',xcolor:C.t,ycolor:C.F,g:seg(p,.5,.65)});
  const bump=t=>Math.exp(-(((t-.5)/.12)**2));
  s+=fade(seg(p,.5,.65),Gt.svg+Gt.plot(bump,{from:0,to:1,color:C.F,w:4})+label('バットで 打つ 一瞬の 力',900,70,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  const Gt=axes({x:90,y:420,w:440,h:260,xmin:0,xmax:1.1,ymin:0,ymax:1.2,xlabel:'t',ylabel:'F',xcolor:C.t,ycolor:C.F});
  const bump=t=>Math.exp(-(((t-.5)/.12)**2));
  let s=Gt.svg+Gt.plot(bump,{from:0,to:1,color:C.F,w:4});
  s+=fade(seg(p,.15,.3),poly([[Gt.X(.1),Gt.Y(0)],...Array.from({length:41},(_,i)=>{const t=.1+.8*i/40;return [Gt.X(t),Gt.Y(bump(t))];}),[Gt.X(.9),Gt.Y(0)]],{fill:C.t,fo:.3}));
  s+=card(650,90,500,280,label('次の問い',900,150,{size:24,color:C.dim,anchor:'middle'})+label('力を 時間で 積むと',900,225,{size:34,color:C.ink,anchor:'middle',weight:700})+label('何が 変わる？',900,300,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
};
