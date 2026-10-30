// YouTube シリーズ「積分・中級 2/3」(ys-um-sum-to-integral-2) — 図。Stage 1200×515.
// 色：高さ f 紫、幅 Δx・dx・時刻 金、合計・面積・変位 水色、Σ・∫・上下端 黄、右端の短冊 橙の線、負 赤、正しい 緑。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,poly,draw} from './anim.mjs';
import {G,fline,strips,gaps,bigTri,widthMark,card,T,cc,cV,cT,cX,cH} from './yt1-um-sum-to-integral-1-diagrams.mjs';

const K='um-sum-to-integral-2:';
const ok=C.F,bad=C.a,cA=s=>cc(C.a,s);
const Sn=n=>8-8/n,Rn=n=>8+8/n;
// right-end strips drawn as outlines (so that both sums can be compared)
function rstrips(A,n,{g=1,color=C.hi}={}){const d=4/n;let s='';for(let i=0;i<n;i++){const x0=i*d,h=(x0+d)*clamp(g);s+=rect(A.X(x0),A.Y(h),A.X(x0+d)-A.X(x0),A.Y(0)-A.Y(h),{fill:color,fo:.08,stroke:color,sw:n>20?1:2,rx:1});}return s;}
const intAB=(o='a',u='b',body=cV('f(x)')+'\\,'+cT('dx'))=>cH(`\\int_{${o}}^{${u}}`)+body;
// number line for the direction pictures
const NL={x0:160,x1:1040,y:300};const NX=v=>mix(NL.x0,NL.x1,v);
function numberLine(g=1){let s=arrow(NL.x0-30,NL.y,NL.x1+40,NL.y,{color:C.dim,w:3,head:14});
 s+=line(NX(.2),NL.y-14,NX(.2),NL.y+14,{color:C.hi,w:4})+line(NX(.8),NL.y-14,NX(.8),NL.y+14,{color:C.hi,w:4});
 s+=label('a',NX(.2),NL.y+50,{size:34,color:C.hi,anchor:'middle',weight:700})+label('b',NX(.8),NL.y+50,{size:34,color:C.hi,anchor:'middle',weight:700});
 return fade(g,s);}
// v–s axes (time variable s)
const VS=(o={})=>axes({x:110,y:440,w:480,h:330,xmax:4.6,ymax:4.8,xticks:[1,2,3,4],yticks:[1,2,3,4],grid:true,xlabel:'s [s]',ylabel:'v(s) [m/s]',xcolor:C.t,ycolor:C.v,...o});
const triUpTo=(A,t,o={})=>poly([[A.X(0),A.Y(0)],[A.X(t),A.Y(0)],[A.X(t),A.Y(t)]],{fill:C.x,fo:.3,stroke:C.x,sw:2,...o});

export const ytUmSumInt2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=G();const n=p<.3?4:p<.55?8:16;
  let s=A.svg+strips(A,n)+gaps(A,n)+fline(A);
  const rows=[[4,6],[8,7],[16,7.5]];
  s+=card(740,120,400,280,T('n',800,165,{size:34,color:C.dim})+T(cX('S_n')+'\\,[\\mathrm{m}]',1000,162,{size:34})
   +rows.map(([k,v],i)=>fade(seg(p,.45+i*.12,.55+i*.12),label(String(k),800,225+i*60,{size:30,color:C.ink,anchor:'middle'})+label(String(v),1000,225+i*60,{size:32,color:C.x,anchor:'middle',weight:700}))).join(''),seg(p,.4,.5));
  return s;
 },
 [K+'recap2']:(p)=>{
  const A=axes({x:130,y:440,w:560,h:320,xmin:0,xmax:70,ymin:5,ymax:8.6,xticks:[4,8,16,32,64],yticks:[6,7,8],grid:true,xlabel:'n',ylabel:'',xcolor:C.dim});
  let s=A.svg+T(cX('S_n')+'\\,[\\mathrm{m}]',A.X(0),A.Y(8.6)-50,{size:30})+line(A.X(0),A.Y(8),A.X(70),A.Y(8),{color:ok,w:3,dash:'10 8'})+label('8',A.X(70)+10,A.Y(8)+8,{size:24,color:ok});
  [4,8,16,32,64].forEach((n,i)=>{s+=fade(seg(p,.1+i*.08,.2+i*.08),dot(A.X(n),A.Y(Sn(n)),9,C.x));});
  s+=card(790,150,380,200,T(cX('S_n')+'=8-\\dfrac{8}{n}',980,230,{size:50})+fade(seg(p,.55,.7),label('n を増やすほど 8 へ',980,315,{size:28,color:ok,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'question']:(p)=>{
  let s=label('今回の問い',600,80,{size:28,color:C.dim,anchor:'middle'});
  s+=card(140,115,920,120,label('① n を限りなく増やした 行き先 を どう書く？',600,188,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.t);
  s+=card(140,275,920,120,label('② その記号は、何を 指示している？',600,348,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 // ===== S2 行き先に名前を付ける =====
 [K+'inf']:(p)=>{
  const A=G({x:90,y:470,w:330,h:230,xmax:4.6,yticks:[2,4],xticks:[2,4]});
  const n=Math.round(Math.pow(2,2+5*seg(p,.02,.6)));
  let s=A.svg+strips(A,n,{fo:.35})+fline(A,1,{w:3})+label(`n ＝ ${n}`,A.X(2),A.Y(4.6),{size:26,color:C.hi,anchor:'middle'});
  s+=fade(seg(p,.1,.3),T('n\\to\\infty',800,190,{size:80}));
  s+=fade(seg(p,.2,.35),label('n を 限りなく 大きく',800,280,{size:30,color:C.ink,anchor:'middle'}));
  s+=card(560,330,500,120,label('∞ は 数 ではない',810,380,{size:30,color:bad,anchor:'middle',weight:700})+label('「限りなく大きく」という 行き先の印',810,425,{size:26,color:C.dim,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'lim']:(p)=>{
  let s=fade(seg(p,.02,.2),label('微分・中級：',160,110,{size:26,color:C.dim})+T('\\lim_{h\\to0}',380,110,{size:40}));
  s+=fade(seg(p,.25,.5),T('\\lim_{n\\to\\infty}'+cX('S_n'),600,290,{size:96}));
  s+=fade(seg(p,.55,.7),label('n を限りなく増やしたときの Sn の 行き先',600,440,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'int']:(p)=>{
  const L=intAB(),R='\\;=\\lim_{n\\to\\infty}'+cH('\\sum_{i=1}^{n}')+cV('f(x_i)')+'\\,'+cT('\\Delta x');
  const wl=texWidth(L,64,false),wr=texWidth(R,64,false),x0=600-(wl+wr)/2;
  let s=fade(seg(p,.02,.2),T(L,x0,250,{size:64,anchor:'start'}));
  s+=fade(seg(p,.15,.3),T(R,x0+wl,250,{size:64,anchor:'start'}));
  s+=fade(seg(p,.4,.55),label('a から b までの 定積分',x0+wl/2,420,{size:32,color:C.x,anchor:'middle',weight:700}));
  s+=card(700,370,380,90,label('これが 定義',890,425,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'intex']:(p)=>{
  const A=G();let s=A.svg+bigTri(A,{g:seg(p,.05,.2)})+fline(A);
  s+=fade(seg(p,.05,.25),T(cH('\\int_0^4')+cV('x')+'\\,'+cT('dx')+'='+cX('8'),940,160,{size:56}));
  s+=card(720,240,440,210,T(cX('S_4,\\,S_8,\\,S_{16}')+'\\approx 8',940,300,{size:40})+label('有限の和：ほぼ等しい',940,350,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.6,.75),label('行き先の積分：ちょうど ＝ 8',940,415,{size:28,color:ok,anchor:'middle',weight:700})),seg(p,.35,.5));
  return s;
 },
 [K+'right']:(p)=>{
  const A=G();const n=p<.35?4:p<.55?8:16;
  let s=A.svg+strips(A,n,{fo:.2})+rstrips(A,n,{g:seg(p,.03,.15)})+fline(A);
  s+=fade(seg(p,.03,.15),label('右端で測る',A.X(1),A.Y(4.5),{size:26,color:C.hi,anchor:'middle'}));
  const rows=[[4,6,10],[8,7,9],[16,7.5,8.5]];
  s+=card(720,110,440,330,label('n',770,160,{size:28,color:C.dim,anchor:'middle'})+label('左端',900,160,{size:26,color:C.x,anchor:'middle'})+label('右端',1060,160,{size:26,color:C.hi,anchor:'middle'})
   +rows.map(([k,l,r],i)=>label(String(k),770,215+i*55,{size:30,color:C.ink,anchor:'middle'})+label(String(l),900,215+i*55,{size:30,color:C.x,anchor:'middle'})+fade(seg(p,.1+i*.2,.2+i*.2),label(String(r),1060,215+i*55,{size:30,color:C.hi,anchor:'middle',weight:700}))).join('')
   +fade(seg(p,.75,.9),label('↑ 下から　　↓ 上から　→ 8',940,400,{size:26,color:ok,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'why']:(p)=>{
  const A=axes({x:130,y:440,w:560,h:320,xmin:0,xmax:70,ymin:5,ymax:11,xticks:[4,8,16,32,64],yticks:[6,8,10],grid:true,xlabel:'n',ylabel:'',xcolor:C.dim});
  let s=A.svg+label('合計 [m]',A.X(0),A.Y(11)-40,{size:24,color:C.dim,anchor:'middle'})+line(A.X(0),A.Y(8),A.X(70),A.Y(8),{color:ok,w:3,dash:'10 8'})+label('8',A.X(70)+10,A.Y(8)+8,{size:24,color:ok});
  [4,8,16,32,64].forEach((n,i)=>{const g=seg(p,.05+i*.07,.15+i*.07);s+=fade(g,dot(A.X(n),A.Y(Sn(n)),9,C.x)+dot(A.X(n),A.Y(Rn(n)),9,C.hi)+line(A.X(n),A.Y(Sn(n)),A.X(n),A.Y(Rn(n)),{color:C.dim,w:2,dash:'4 5'}));});
  s+=fade(seg(p,.05,.15),label('右端',A.X(4)+16,A.Y(10)+8,{size:24,color:C.hi})+label('左端',A.X(4)+16,A.Y(6)+8,{size:24,color:C.x}));
  s+=card(760,110,410,170,label('右端 − 左端',965,155,{size:28,color:C.ink,anchor:'middle'})+T('=\\dfrac{16}{n}\\;\\to\\;0',965,240,{size:44}),seg(p,.3,.45));
  s+=card(760,300,410,150,label('グラフが途中で 跳ばなければ',965,350,{size:26,color:C.dim,anchor:'middle'})+label('どの代表点でも 行き先は同じ',965,405,{size:28,color:ok,anchor:'middle',weight:700}),seg(p,.6,.75));
  return s;
 },
 // ===== S3 ∫ の読み方 =====
 [K+'shape']:(p)=>{
  let s=fade(seg(p,.02,.2),label('S',330,330,{size:170,color:C.faint,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.35),T(cH('\\int'),330,300,{size:220}));
  s+=fade(seg(p,.3,.45),label('合計の S を 縦に伸ばした形',330,470,{size:28,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),T(cH('\\Sigma'),850,300,{size:170})+label('ギリシャ文字の S',850,470,{size:28,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'map1']:(p)=>map(p,1),
 [K+'map2']:(p)=>map(p,2),
 [K+'limits']:(p)=>{
  let s=T(cH('\\int'),420,300,{size:160})+T(cH('b'),468,160,{size:56})+T(cH('a'),392,430,{size:56})+T(cV('f(x)')+'\\,'+cT('dx'),520,285,{size:80,anchor:'start'});
  s+=fade(seg(p,.05,.25),highlight(440,122,60,60,1)+arrow(620,150,510,150,{color:C.hi,w:3,head:12})+label('上端 b：終わり',630,160,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.05,.25),highlight(362,392,60,60,1)+arrow(620,425,432,425,{color:C.hi,w:3,head:12})+label('下端 a：始まり',630,435,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'piece']:(p)=>{
  const A=G();let s=A.svg+fade(seg(p,.5,.65),strips(A,40,{fo:.2}))+fline(A);
  const x0=2.5,d=.12;
  s+=fade(seg(p,.02,.2),rect(A.X(x0),A.Y(x0),A.X(x0+d)-A.X(x0),A.Y(0)-A.Y(x0),{fill:C.x,fo:.5,stroke:C.x,sw:2,rx:1}));
  s+=fade(seg(p,.1,.3)*(1-seg(p,.5,.62)),line(A.X(x0)-12,A.Y(x0),A.X(x0)-12,A.Y(0),{color:C.v,w:5})+label('高さ f(x)',A.X(x0)-22,A.Y(x0/2)+8,{size:24,color:C.v,anchor:'end',weight:700}));
  s+=fade(seg(p,.2,.35)*(1-seg(p,.5,.62)),arrow(A.X(x0+d)+60,A.Y(.5),A.X(x0+d)+6,A.Y(.2),{color:C.t,w:3,head:12})+label('幅 dx',A.X(x0+d)+66,A.Y(.5)-4,{size:24,color:C.t,weight:700}));
  s+=fade(seg(p,.05,.25),T(cV('f(x)')+'\\,'+cT('dx'),940,170,{size:64})+label('＝ 細い短冊 1本',940,245,{size:28,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),label('∫：a から b まで 全部足せ',940,380,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'read']:(p)=>{
  let s=card(150,90,900,150,label('∫ を見たら',600,145,{size:30,color:C.dim,anchor:'middle'})+label('何の短冊を 足している？',600,205,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.35,.55),T(cH('\\int')+cV('v')+'\\,'+cT('dt'),330,370,{size:70})+arrow(450,360,560,360,{color:C.dim,w:3,head:12})
   +label('速度 × 時間の幅 ＝ 距離の短冊',590,372,{size:30,color:C.x}));
  s+=fade(seg(p,.7,.85),label('面積の公式より 先に',600,470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'unit1']:(p)=>units(p,1),
 [K+'unit2']:(p)=>units(p,2),
 [K+'unit3']:(p)=>units(p,3),
 [K+'unit4']:(p)=>units(p,4),
 // ===== S4 上端と下端を入れ替えると =====
 [K+'swapq']:(p)=>{
  let s=numberLine(seg(p,0,.15));
  s+=fade(seg(p,.1,.3),T(intAB('b','a'),600,140,{size:64})+label('＝ ？',760,150,{size:40,color:C.hi,weight:700}));
  s+=fade(seg(p,.35,.5),label('上端と下端を 入れ替えると？',600,450,{size:30,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'rightway']:(p)=>{
  let s=numberLine();const g=seg(p,.05,.4);
  s+=arrow(NX(.2),NL.y-50,NX(.8),NL.y-50,{color:C.x,w:6,g});
  for(let i=0;i<5;i++){const u=seg(p,.35+i*.06,.45+i*.06);s+=fade(u,arrow(NX(.2+i*.12),NL.y+95,NX(.2+(i+1)*.12)-4,NL.y+95,{color:C.t,w:4,head:12}));}
  s+=fade(seg(p,.05,.2),T(intAB(),600,120,{size:56})+label('右向き',NX(.5),NL.y-70,{size:26,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),T(cT('\\Delta x')+'=\\dfrac{b-a}{n}>0',600,470,{size:44}));
  return s;
 },
 [K+'leftway']:(p)=>{
  let s=numberLine();const g=seg(p,.05,.4);
  s+=arrow(NX(.8),NL.y-50,NX(.2),NL.y-50,{color:bad,w:6,g});
  for(let i=0;i<5;i++){const u=seg(p,.35+i*.06,.45+i*.06);s+=fade(u,arrow(NX(.8-i*.12),NL.y+95,NX(.8-(i+1)*.12)+4,NL.y+95,{color:bad,w:4,head:12}));}
  s+=fade(seg(p,.05,.2),T(intAB('b','a'),600,120,{size:56})+label('左向き',NX(.5),NL.y-70,{size:26,color:bad,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),T(cT('\\Delta x')+'=\\dfrac{a-b}{n}<0',600,470,{size:44}));
  return s;
 },
 [K+'flip']:(p)=>{
  let s=fade(seg(p,.02,.2),T(intAB('b','a')+'='+cA('-')+intAB(),600,130,{size:60}));
  s+=card(170,240,860,200,
   T(cV('f(x_i)')+'\\times('+cA('-')+cT('\\Delta x')+')='+cA('-')+cV('f(x_i)')+cT('\\Delta x'),600,310,{size:48})
   +label('高さ：そのまま　　幅：符号が逆 → どの短冊も 符号が反転',600,400,{size:26,color:C.dim,anchor:'middle'}),seg(p,.35,.5));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=label('確認',600,90,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),T(intAB('0','3')+'=5',600,210,{size:60}));
  s+=fade(seg(p,.3,.45),T(intAB('3','0')+'=\\;?',600,380,{size:60}));
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=label('確認',600,90,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=T(intAB('0','3')+'=5',450,210,{size:60});
  s+=T(intAB('3','0')+'='+cA('-5'),450,370,{size:60});
  s+=fade(seg(p,.3,.45),label('大きさ 同じ、符号だけ 逆',720,300,{size:28,color:C.dim}));
  s+=fade(seg(p,.6,.75),label('書く順序 ＝ たどる向き',600,480,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 変位の式と、上端 =====
 [K+'disp']:(p)=>{
  let s=fade(seg(p,.1,.35),T(cX('x(t)-x(t_0)')+'='+cH('\\int_{t_0}^{t}')+cV('v(s)')+'\\,'+cT('ds'),600,220,{size:72}));
  s+=fade(seg(p,.4,.55),label('時刻 t₀ から t までの 変位',600,380,{size:32,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s']:(p)=>{
  const A=VS();const t0=.5,t1=3.5,sNow=mix(t0,t1,seg(p,.45,.95));
  let s=A.svg+A.plot(x=>x,{from:0,to:4.3,color:C.v,w:4});
  s+=poly([[A.X(t0),A.Y(0)],[A.X(sNow),A.Y(0)],[A.X(sNow),A.Y(sNow)],[A.X(t0),A.Y(t0)]],{fill:C.x,fo:.3,stroke:'none'});
  s+=line(A.X(t0),A.Y(0)+14,A.X(t0),A.Y(4.4),{color:C.hi,w:2,dash:'6 6'})+line(A.X(t1),A.Y(0)+14,A.X(t1),A.Y(4.4),{color:C.hi,w:2,dash:'6 6'});
  s+=fade(seg(p,.05,.2),label('下端 t₀',A.X(t0)+8,A.Y(4.5),{size:24,color:C.hi})+label('上端 t',A.X(t1)+8,A.Y(4.5),{size:24,color:C.hi}));
  s+=fade(seg(p,.45,.55),dot(A.X(sNow),A.Y(0),9,C.t)+label('s',A.X(sNow),A.Y(0)-16,{size:28,color:C.t,anchor:'middle',weight:700}));
  s+=card(720,140,440,230,T(cH('\\int_{t_0}^{t}')+cV('v(s)')+'\\,'+cT('ds'),940,215,{size:52})
   +fade(seg(p,.45,.6),label('s：集計中の時刻',760,300,{size:28,color:C.t}))+fade(seg(p,.6,.75),label('t₀ から t まで 動く',760,345,{size:26,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'whys']:(p)=>{
  const A=VS();const t0=.5,t1=3.5,sNow=mix(t0,t1,seg(p,.02,.5)),d=.12;
  let s=A.svg+A.plot(x=>x,{from:0,to:4.3,color:C.v,w:4});
  s+=poly([[A.X(t0),A.Y(0)],[A.X(sNow),A.Y(0)],[A.X(sNow),A.Y(sNow)],[A.X(t0),A.Y(t0)]],{fill:C.x,fo:.3,stroke:'none'});
  s+=rect(A.X(sNow),A.Y(sNow),A.X(sNow+d)-A.X(sNow),A.Y(0)-A.Y(sNow),{fill:C.hi,fo:.4,stroke:C.hi,sw:2,rx:1});
  s+=line(A.X(t1),A.Y(0)+14,A.X(t1),A.Y(4.4),{color:C.hi,w:2,dash:'6 6'})+label('t',A.X(t1)+8,A.Y(4.5),{size:26,color:C.hi,weight:700});
  s+=label('s',A.X(sNow)+6,A.Y(0)-16,{size:28,color:C.t,anchor:'middle',weight:700});
  s+=card(720,120,440,300,label('1本 ＝ v(s) × ds',940,175,{size:30,color:C.x,anchor:'middle'})
   +fade(seg(p,.55,.7),label('t：どこまで足すか（上端）',760,260,{size:28,color:C.hi}))
   +fade(seg(p,.7,.85),label('s：いま足している時刻',760,320,{size:28,color:C.t})+label('→ 別の文字にする',760,370,{size:26,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'signed']:(p)=>{
  const mk=(x,abs)=>axes({x,y:300,w:300,h:200,xmax:3.5,ymin:-2.8,ymax:3.8,xticks:[],yticks:abs?[2]:[-2,2],grid:true,xlabel:'s',ylabel:abs?'|v|':'v(s)',xcolor:C.t,ycolor:C.v});
  const A=mk(110,false),B=mk(700,true);
  const bar=(A,a,b,v,col)=>rect(A.X(a),Math.min(A.Y(0),A.Y(v)),A.X(b)-A.X(a),Math.abs(A.Y(v)-A.Y(0)),{fill:col,fo:.35,stroke:col,sw:2,rx:1});
  let s=A.svg+bar(A,0,2,3,C.x)+bar(A,2,3,-2,bad);
  s+=label('＋6',A.X(1),A.Y(1.5)+10,{size:26,color:C.x,anchor:'middle',weight:700})+label('−2',A.X(2.5),A.Y(-1)+10,{size:26,color:bad,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),label('変位 ＝ 6 − 2 ＝ 4 m',260,470,{size:30,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),B.svg+bar(B,0,2,3,C.x)+bar(B,2,3,2,C.x)+label('＋6',B.X(1),B.Y(1.5)+10,{size:26,color:C.x,anchor:'middle',weight:700})+label('＋2',B.X(2.5),B.Y(1)+10,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('道のり ＝ 6 ＋ 2 ＝ 8 m',850,470,{size:30,color:ok,anchor:'middle',weight:700}));
  return s;
 },
 [K+'func']:(p)=>{
  let s=fade(seg(p,.02,.2),T(cH('\\int_0^4')+cV('v(s)')+'\\,'+cT('ds'),330,190,{size:60})+label('→ 1つの 数',560,205,{size:30,color:C.ink}));
  s+=fade(seg(p,.4,.6),T(cH('\\int_0^{t}')+cV('v(s)')+'\\,'+cT('ds'),330,370,{size:60})+label('→ t ごとに 値が決まる 関数',560,385,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.45,.6),highlight(250,262,42,50,1));
  return s;
 },
 [K+'funcex']:(p)=>{
  const A=VS();const t=p<.3?mix(0,2,seg(p,.02,.28)):p<.45?2:mix(2,4,seg(p,.45,.7));
  let s=A.svg+A.plot(x=>x,{from:0,to:4.3,color:C.v,w:4})+(t>.01?triUpTo(A,t):'');
  s+=line(A.X(t),A.Y(0)+14,A.X(t),A.Y(4.4),{color:C.hi,w:2,dash:'6 6'})+label(`t ＝ ${t.toFixed(1)}`,A.X(t)+8,A.Y(4.5),{size:24,color:C.hi});
  s+=card(720,120,440,300,T(cV('v(s)')+'=s,\\;'+cT('t_0')+'=0',940,175,{size:40})
   +fade(seg(p,.25,.35),label('t ＝ 2 → ½ × 2 × 2 ＝ 2 m',760,260,{size:28,color:C.x}))
   +fade(seg(p,.65,.75),label('t ＝ 4 → ½ × 4 × 4 ＝ 8 m',760,320,{size:28,color:C.x}))
   +fade(seg(p,.78,.9),label('上端を動かす → 面積が たまる',760,385,{size:26,color:C.hi})),seg(p,0,.1));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.02,.2),T(intAB()+'=\\lim_{n\\to\\infty}'+cH('\\sum_{i=1}^{n}')+cV('f(x_i)')+'\\,'+cT('\\Delta x'),600,200,{size:58}));
  s+=card(170,320,860,130,label('短冊 f(x)dx を、a から b まで 全部足せ',600,375,{size:30,color:C.x,anchor:'middle',weight:700})+label('（上下を入れ替えると 符号が反転）',600,420,{size:24,color:C.dim,anchor:'middle'}),seg(p,.45,.6));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(110,110,460,300,T(cH('\\Sigma'),340,200,{size:90})+label('有限個で 止める',340,300,{size:30,color:C.ink,anchor:'middle'})+T(cX('S_n')+'\\approx 8',340,365,{size:40}),seg(p,.02,.15));
  s+=card(630,110,460,300,T(cH('\\int'),860,225,{size:54})+label('限りなく細かくした 行き先',860,300,{size:30,color:C.ink,anchor:'middle'})+T(cH('\\int_0^4')+cV('x')+'\\,'+cT('dx')+'=8',860,375,{size:34}),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.1,.25),label('どちらも 値 × 幅 を足す',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  const A=G({x:90,y:470,w:330,h:230,xmax:4.6,yticks:[2,4],xticks:[2,4]});
  let s=A.svg+bigTri(A)+fline(A,1,{w:3})+label('8',A.X(2.9),A.Y(1)+10,{size:40,color:C.x,anchor:'middle',weight:700});
  s+=card(520,140,640,240,label('次の問い',840,195,{size:26,color:C.dim,anchor:'middle'})+label('行き先の 8 を、短冊を 数えずに',840,265,{size:32,color:C.ink,anchor:'middle'})+label('一発で 出せない？',840,325,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
};

// Σ ↔ ∫ correspondence, column by column
function map(p,stage){
 const cols=[250,560,830],yT=150,yB=410;
 let s=label('有限の和',80,yT+10,{size:26,color:C.dim})+label('行き先',80,yB+10,{size:26,color:C.dim});
 s+=T(cH('\\sum_{i=1}^{n}'),cols[0],yT,{size:70})+T(cV('f(x_i)'),cols[1],yT,{size:64})+T(cT('\\Delta x'),cols[2],yT,{size:64});
 s+=T(cH('\\int_a^b'),cols[0],yB,{size:70})+T(cV('f(x)'),cols[1],yB,{size:64})+T(cT('dx'),cols[2],yB,{size:64});
 const g1=stage===1?seg(p,.2,.4):1,g2=stage===1?seg(p,.5,.7):1,g3=stage===2?seg(p,.05,.3):0;
 s+=arrow(cols[0],yT+78,cols[0],yB-105,{color:C.hi,w:4,head:14,g:g1});
 s+=arrow(cols[1],yT+60,cols[1],yB-70,{color:C.v,w:4,head:14,g:g2});
 s+=arrow(cols[2],yT+60,cols[2],yB-70,{color:C.t,w:4,head:14,g:g3});
 if(stage===2)s+=fade(seg(p,.4,.55),label('dx ＝ 幅 Δx を 限りなく細くした 行き先の印',1180,480,{size:26,color:C.t,anchor:'end'}));
 return s;
}
// unit table rows
function units(p,k){
 const rows=[['速度 [m/s]','時間 [s]','m','進んだ距離',C.x],['力 [N]','距離 [m]','N·m ＝ J','仕事',C.E],['電場 [N/C]','距離 [m]','J/C','1 C あたりの仕事',C.x]];
 const X=[190,420,640,900],y0=190,dy=85;
 let s=[['高さ',C.v],['幅',C.t],['1本',C.ink],['合計',C.hi]].map(([t,c],i)=>label(t,X[i],120,{size:28,color:c,anchor:'middle',weight:700})).join('')+line(90,145,1110,145,{color:C.faint,w:2});
 rows.forEach((r,i)=>{if(i+1>k&&k<4)return;const g=(i+1===k)?seg(p,.02,.2):1;
  s+=fade(g,label(r[0],X[0],y0+i*dy,{size:28,color:C.v,anchor:'middle'})+label('×',305,y0+i*dy,{size:28,color:C.dim,anchor:'middle'})+label(r[1],X[1],y0+i*dy,{size:28,color:C.t,anchor:'middle'})
   +label('→',530,y0+i*dy,{size:28,color:C.dim,anchor:'middle'})+label(r[2],X[2],y0+i*dy,{size:30,color:C.ink,anchor:'middle',weight:700})+label(r[3],X[3],y0+i*dy,{size:28,color:r[4],anchor:'middle'}));});
 if(k===4)s+=card(200,420,800,80,label('掛ける2つの単位 → 合計の単位（足し算では 単位は変わらない）',600,470,{size:26,color:C.hi,anchor:'middle'}),seg(p,.05,.2),C.hi);
 return s;
}
