// YouTube シリーズ「微分方程式・初級 1/2」(ys-ui-rate-equation-1) — 図。Stage 1200×515.
// 色（anim.mjs C）：速さ v 紫、時刻 t 金、減る速さ（dv/dt・1秒で減る量）赤、ブレーキの力 緑、強調 黄。
// 例：dv/dt＝−0.1v、v(0)＝100。1秒刻み（近似）100→90→81→72.9→65.61。候補の直線 v＝100−10t。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,cart,ground,draw} from './anim.mjs';

const K='ui-rate-equation-1:';
const CV=C.v,CT=C.t,CR=C.a,CF=C.F,CH=C.hi;
const cV=s=>`{\\color{${CV}}{${s}}}`,cT=s=>`{\\color{${CT}}{${s}}}`,cR=s=>`{\\color{${CR}}{${s}}}`,cI=s=>`{\\color{${C.ink}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('○',x,y,{size:32,color:CF,weight:700,anchor:'middle'}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:32,color:CR,weight:700,anchor:'middle'}));
const DVDT='\\dfrac{dv}{dt}';
const RULE=`${DVDT}=-kv`;

// ---- S1: object with a brake ---------------------------------------------------------------------
function braked(x,y,v,{g=1,vlabel='',blabel=''}={}){
 // v in m/s (0..100) → arrow lengths
 const L=v*1.6;
 let s=cart(x,y,{w:110,h:50,color:CV});
 s+=arrow(x+60,y-100,x+60+L,y-100,{color:CV,w:6});
 if(vlabel)s+=label(vlabel,x+60+L+12,y-92,{size:26,color:CV,weight:700});
 s+=arrow(x-60,y-40,x-60-L*.8,y-40,{color:CF,w:6});
 if(blabel)s+=label(blabel,x-60-L*.8-12,y-32,{size:24,color:CF,anchor:'end'});
 return fade(g,s);
}

// ---- S4: 1-second steps ---------------------------------------------------------------------------
const V=[100,90,81,72.9,65.61],DROP=[10,9,8.1,7.29];
const fmtN=v=>String(Math.round(v*100)/100);
function stepAxes(g=1){return axes({x:100,y:440,w:420,h:320,xmax:4.6,ymin:60,ymax:104,xticks:[1,2,3,4],yticks:[60,70,80,90,100],grid:true,g,xlabel:'時刻 t [s]',ylabel:'速さ v [m/s]',xcolor:CT,ycolor:CV});}
// shown[k] = progress of step k (0..3); drops=show red drop labels
function stepGraph(A,shown,{drops=1,dotsOnly=0,hiStep=-1}={}){
 let s=dot(A.X(0),A.Y(V[0]),8,CV);
 shown.forEach((g,k)=>{
  if(g<=0.001)return;
  const x0=A.X(k),x1=A.X(k+1),y0=A.Y(V[k]),y1=A.Y(V[k+1]);
  // assumed-constant rate over the step: straight segment
  s+=draw([[x0,y0],[x1,y1]],g,{color:CV,w:4});
  if(drops){
   s+=fade(g,line(x0,y0,x1,y0,{color:CR,w:2,dash:'6 6'})+line(x1,y0,x1,y1,{color:CR,w:5})
    +label('−'+fmtN(DROP[k]),x1+8,(y0+y1)/2+8,{size:22,color:CR,weight:700}));
  }
  s+=fade(g,dot(x1,y1,8,k===hiStep?CH:CV));
 });
 return s;
}
const TX=[735,845,975,1105],TY0=110,TDY=58;
function tableHead(g=1){
 return fade(g,label('t [s]',TX[0],TY0,{size:24,color:CT,anchor:'middle',weight:700})
  +label('v [m/s]',TX[1],TY0,{size:24,color:CV,anchor:'middle',weight:700})
  +label('1秒で減る量',TX[2],TY0,{size:22,color:CR,anchor:'middle',weight:700})
  +label('1秒後',TX[3],TY0,{size:24,color:C.ink,anchor:'middle',weight:700})
  +line(680,TY0+16,1170,TY0+16,{color:C.faint,w:2}));
}
function tableRow(k,g=1,{q=0,drop=1,next=1,hi=0}={}){
 const y=TY0+TDY*(k+1);
 if(q){drop=0;next=0;}
 let s=label(String(k),TX[0],y,{size:26,color:CT,anchor:'middle'})+label(fmtN(V[k]),TX[1],y,{size:26,color:CV,anchor:'middle',weight:700});
 s+=fade(1-drop,label('？',TX[2],y,{size:26,color:CH,anchor:'middle',weight:700}))+fade(drop,label('−'+fmtN(DROP[k]),TX[2],y,{size:26,color:CR,anchor:'middle',weight:700}));
 s+=fade(1-next,label('？',TX[3],y,{size:26,color:CH,anchor:'middle',weight:700}))+fade(next,label('≈ '+fmtN(V[k+1]),TX[3],y,{size:26,color:C.ink,anchor:'middle'}));
 if(hi)s+=highlight(685,y-36,485,50,hi);
 return fade(g,s);
}

// ---- S3: candidate line v = 100 − 10t ------------------------------------------------------------
function candAxes(g=1){return axes({x:100,y:440,w:440,h:320,xmax:10.8,ymax:112,xticks:[5,10],yticks:[50,100],grid:true,g,xlabel:'時刻 t [s]',ylabel:'速さ v [m/s]',xcolor:CT,ycolor:CV});}
const LINE='v=100-10t';

export const ytUiRate1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=card(150,70,900,130,label('前回の最後の問い',600,120,{size:26,color:C.dim,anchor:'middle'})
   +label('変化の速さが 今の量で決まる ルールから',600,172,{size:32,color:C.ink,anchor:'middle'}),seg(p,0,.15));
  s+=fade(seg(p,.35,.55),label('変化の速さ',330,300,{size:34,color:CR,anchor:'middle',weight:700})
   +arrow(560,290,420,290,{color:C.dim,w:4})+label('今の量',640,300,{size:34,color:CV,anchor:'middle',weight:700})
   +label('で決まる',640,345,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.65,.85),arrow(760,290,860,290,{color:CH,w:4})+label('量そのもの ？',990,300,{size:34,color:CH,anchor:'middle',weight:700})
   +label('求められる？',990,345,{size:24,color:CH,anchor:'middle'}));
  return s;
 },
 [K+'brake']:(p)=>{
  const u=seg(p,.55,1),v=100*Math.exp(-1.2*u),x=250+520*(1-Math.exp(-1.2*u))/(1-Math.exp(-1.2));
  let s=ground(60,1140,420);
  s+=braked(x,420,v,{vlabel:u<.05?'100 m/s':'',blabel:p>.3?'ブレーキ':''});
  s+=fade(seg(p,.3,.45),card(660,60,500,100,label('仮定：ブレーキの効き方は',910,100,{size:26,color:C.dim,anchor:'middle'})
   +label('今の速さに 比例',910,142,{size:30,color:CF,anchor:'middle',weight:700}),1,CF));
  return s;
 },
 [K+'brake2']:(p)=>{
  let s=ground(60,1140,260)+ground(60,1140,470);
  s+=braked(300,260,100,{vlabel:'速い'})+fade(seg(p,.05,.2),label('強く 減速',700,180,{size:30,color:CF,weight:700}));
  s+=fade(seg(p,.35,.5),braked(300,470,35,{vlabel:'遅い'})+label('ゆっくり 減速',700,390,{size:30,color:CF,weight:700}));
  s+=fade(seg(p,.6,.75),label('緑の矢印 ＝ ブレーキ',1130,60,{size:24,color:CF,anchor:'end'})+label('紫の矢印 ＝ 速さ',1130,95,{size:24,color:CV,anchor:'end'}));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=fade(.35,ground(60,1140,260)+ground(60,1140,470)+braked(300,260,100)+braked(300,470,35));
  s+=card(560,120,560,260,label('このルールの 答えは？',840,190,{size:34,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('一つの数？',840,270,{size:34,color:CH,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('予想してみよう',840,335,{size:26,color:C.dim,anchor:'middle'})),seg(p,.05,.2),CH);
  return s;
 },
 // ===== S2 ルールを式にする =====
 [K+'dvdt']:(p)=>{
  let s=card(80,90,480,300,label('微分で見たこと',320,140,{size:26,color:C.dim,anchor:'middle'})
   +label('位置 x の 変わる速さ',320,210,{size:28,color:C.x,anchor:'middle'})
   +tex('\\dfrac{dx}{dt}=v',320,310,{size:56}),seg(p,0,.15));
  s+=card(640,90,480,300,label('今回',880,140,{size:26,color:CH,anchor:'middle'})
   +label('速さ v の 変わる速さ',880,210,{size:28,color:CV,anchor:'middle'})
   +fade(seg(p,.6,.75),tex(DVDT,880,310,{size:60})),seg(p,.4,.55),CH);
  return s;
 },
 [K+'dvdt2']:(p)=>{
  let s=card(80,90,480,300,label('微分で見たこと',320,140,{size:26,color:C.dim,anchor:'middle'})
   +label('位置 x の 変わる速さ',320,210,{size:28,color:C.x,anchor:'middle'})
   +tex('\\dfrac{dx}{dt}=v',320,310,{size:56}),1);
  s+=card(640,90,480,300,label('今回',880,140,{size:26,color:CH,anchor:'middle'})
   +label('速さ v の 変わる速さ',880,210,{size:28,color:CV,anchor:'middle'})
   +tex(DVDT+'=a',880,310,{size:60}),1,CH);
  s+=fade(seg(p,.15,.3),label('1秒あたりに 速さが どれだけ変わるか ＝ 加速度 a',600,450,{size:28,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('単位：m/s²（メートル毎秒毎秒）',600,500,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'eq']:(p)=>{
  let s=tex(RULE,600,200,{size:84});
  const w=texWidth(RULE,84),x0=600-w/2;
  s+=fade(seg(p,.05,.2),brace(x0,x0+w*.36,265,{text:'v の変わる速さ',color:CR,size:26}));
  s+=fade(seg(p,.3,.45),brace(x0+w*.6,x0+w,265,{text:'今の v に比例',color:CV,size:26}));
  s+=fade(seg(p,.55,.7),label('k：比例の係数（正の数）',600,430,{size:30,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'minus']:(p)=>{
  let s=tex(RULE,600,200,{size:84});
  const w=texWidth(RULE,84),x0=600-w/2;
  s+=label('k：比例の係数（正の数）',600,430,{size:30,color:C.dim,anchor:'middle'});
  s+=highlight(x0+w*.6,140,w*.16,90,seg(p,.3,.45),CR);
  s+=fade(seg(p,.4,.55),label('マイナス ＝ v が 減っていく',600,330,{size:32,color:CR,anchor:'middle',weight:700}));
  return s;
 },
 [K+'k']:(p)=>{
  let s=tex(RULE,600,160,{size:70});
  s+=card(250,250,700,200,tex('k=0.1\\ \\mathrm{/s}',600,310,{size:52})
   +fade(seg(p,.35,.5),label('毎秒、今の速さの 0.1倍 の ペースで 減る',600,400,{size:30,color:CH,anchor:'middle'})),seg(p,.05,.2),CH);
  return s;
 },
 [K+'r100']:(p)=>{
  // rule graph: horizontal = v, vertical = decrease rate 0.1v
  const A=axes({x:110,y:440,w:480,h:320,xmax:112,ymax:11.5,xticks:[50,100],yticks:[5,10],grid:true,xlabel:'v [m/s]',ylabel:'減る速さ [m/s²]',xcolor:CV,ycolor:CR});
  let s=A.svg+A.plot(v=>0.1*v,{from:0,to:108,p:seg(p,.05,.3),color:CR,w:3,dash:'8 7'});
  const g=seg(p,.2,.4);
  s+=fade(g,line(A.X(100),A.Y(0),A.X(100),A.Y(10),{color:CR,w:6})+dot(A.X(100),A.Y(10),9,CR));
  s+=card(700,110,450,260,tex('0.1\\times'+cV('100')+'='+cR('10'),925,190,{size:46,auto:false})
   +fade(seg(p,.55,.7),label('1秒あたり 10 m/s 減る',925,280,{size:30,color:CR,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('v ＝ 100 のとき',925,335,{size:24,color:C.dim,anchor:'middle'})),seg(p,.2,.35));
  return s;
 },
 [K+'r50']:(p)=>{
  const A=axes({x:110,y:440,w:480,h:320,xmax:112,ymax:11.5,xticks:[50,100],yticks:[5,10],grid:true,xlabel:'v [m/s]',ylabel:'減る速さ [m/s²]',xcolor:CV,ycolor:CR});
  let s=A.svg+A.plot(v=>0.1*v,{from:0,to:108,color:CR,w:3,dash:'8 7'});
  s+=line(A.X(100),A.Y(0),A.X(100),A.Y(10),{color:CR,w:6})+dot(A.X(100),A.Y(10),9,CR);
  const g=seg(p,.2,.4);
  s+=fade(g,line(A.X(50),A.Y(0),A.X(50),A.Y(5),{color:CR,w:6})+dot(A.X(50),A.Y(5),9,CR));
  s+=card(700,110,450,260,tex('0.1\\times'+cV('50')+'='+cR('5'),925,190,{size:46,auto:false})
   +fade(seg(p,.6,.75),label('遅いほど ゆっくり減る',925,290,{size:30,color:CR,anchor:'middle',weight:700})),seg(p,.15,.3));
  s+=fade(seg(p,.7,.85),label('比例：原点を通る まっすぐな線',925,470,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'def']:(p)=>{
  let s=tex(RULE,600,170,{size:84});
  const w=texWidth(RULE,84),x0=600-w/2;
  s+=highlight(x0-12,75,w*.36+24,170,seg(p,.3,.45),CR)+fade(seg(p,.15,.3),arrow(x0+w*.93,245,x0+w*.93,205,{color:CV,w:3,head:12}));
  s+=fade(seg(p,.15,.3),label('まだ分からない 関数 v',x0+w*.94,275,{size:24,color:CV,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('その 微分',x0+w*.18,275,{size:24,color:CR,anchor:'middle'}));
  s+=card(230,330,740,110,label('微分方程式',600,375,{size:34,color:CH,anchor:'middle',weight:700})
   +label('分からない関数と、その微分が 混ざった方程式',600,420,{size:26,color:C.ink,anchor:'middle'}),seg(p,.6,.75),CH);
  return s;
 },
 // ===== S3 答えは数でなく関数 =====
 [K+'num']:(p)=>{
  let s=card(60,70,500,380,label('ふつうの方程式',310,120,{size:28,color:C.dim,anchor:'middle'})
   +tex('2x=6',310,210,{size:60,auto:false})
   +fade(seg(p,.5,.65),label('答え',310,300,{size:24,color:C.dim,anchor:'middle'})+tex('x=3',310,360,{size:56,auto:false})
    +label('（一つの数）',310,420,{size:24,color:CH,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=card(60,70,500,380,label('ふつうの方程式',310,120,{size:28,color:C.dim,anchor:'middle'})
   +tex('2x=6',310,210,{size:60,auto:false})
   +label('答え',310,300,{size:24,color:C.dim,anchor:'middle'})+tex('x=3',310,360,{size:56,auto:false})
   +label('（一つの数）',310,420,{size:24,color:CH,anchor:'middle'}),1);
  s+=fade(seg(p,.1,.3),label('確かめ',850,150,{size:26,color:C.dim,anchor:'middle'})+tex('2\\times 3=6',850,230,{size:56,auto:false}));
  s+=fade(seg(p,.5,.65),label('左 ＝ 右',850,320,{size:32,color:CF,anchor:'middle',weight:700})+ok(850,380));
  return s;
 },
 [K+'func']:(p)=>{
  let s=card(60,70,500,380,label('ふつうの方程式',310,120,{size:28,color:C.dim,anchor:'middle'})
   +tex('2x=6',310,210,{size:60,auto:false})
   +label('答え',310,300,{size:24,color:C.dim,anchor:'middle'})+tex('x=3',310,360,{size:56,auto:false})
   +label('（一つの数）',310,420,{size:24,color:CH,anchor:'middle'}),1);
  let inner=label('微分方程式',890,120,{size:28,color:C.dim,anchor:'middle'})+tex(RULE,890,200,{size:48})
   +fade(seg(p,.35,.5),label('答え',890,265,{size:24,color:C.dim,anchor:'middle'}));
  // machine: t → v(t)
  const gm=seg(p,.5,.7);
  inner+=fade(gm,label('時刻 t',720,340,{size:26,color:CT,anchor:'middle'})+arrow(780,332,830,332,{color:C.dim,w:3,head:12})
   +rect(840,305,110,56,{fill:'#20304f',fo:1,stroke:CV,sw:2,rx:10})+tex('v(t)',895,338,{size:34})
   +arrow(958,332,1008,332,{color:C.dim,w:3,head:12})+label('速さ',1060,340,{size:26,color:CV,anchor:'middle'}));
  inner+=fade(seg(p,.75,.9),label('（関数：各時刻の速さ）',890,420,{size:24,color:CH,anchor:'middle'}));
  s+=card(640,70,500,380,inner,seg(p,.05,.2),CH);
  return s;
 },
 [K+'check']:(p)=>{
  let s=card(60,190,230,110,label('候補の関数',175,235,{size:24,color:C.dim,anchor:'middle'})+tex('v(t)',175,280,{size:40}),seg(p,0,.15));
  s+=fade(seg(p,.15,.35),arrow(300,225,470,150,{color:C.dim,w:4})+label('微分する',370,160,{size:24,color:C.dim,anchor:'middle'})
   +card(480,60,300,150,label('左の辺',630,98,{size:24,color:CR,anchor:'middle'})+tex(DVDT,630,168,{size:36})));
  s+=fade(seg(p,.5,.7),arrow(300,265,470,340,{color:C.dim,w:4})+label('入れる',370,345,{size:24,color:C.dim,anchor:'middle'})
   +card(480,290,300,120,label('右の辺',630,330,{size:24,color:CV,anchor:'middle'})+tex('-kv',630,385,{size:40})));
  s+=fade(seg(p,.8,.95),arrow(790,145,900,230,{color:CH,w:4})+arrow(790,345,900,270,{color:CH,w:4})+label('比べる',980,258,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'every']:(p)=>{
  let s=card(60,190,230,110,label('候補の関数',175,235,{size:24,color:C.dim,anchor:'middle'})+tex('v(t)',175,280,{size:40}),1);
  s+=arrow(300,225,470,150,{color:C.dim,w:4})+card(480,60,300,150,label('左の辺',630,98,{size:24,color:CR,anchor:'middle'})+tex(DVDT,630,168,{size:36}));
  s+=arrow(300,265,470,340,{color:C.dim,w:4})+card(480,290,300,120,label('右の辺',630,330,{size:24,color:CV,anchor:'middle'})+tex('-kv',630,385,{size:40}));
  s+=arrow(790,145,900,230,{color:CH,w:4})+arrow(790,345,900,270,{color:CH,w:4})+label('比べる',980,258,{size:30,color:CH,anchor:'middle',weight:700});
  const ts=['t=0','t=1','t=2','t=3','…'];
  ts.forEach((t,i)=>{const g=seg(p,.05+i*.08,.13+i*.08);s+=fade(g,label(t,300+i*140,470,{size:26,color:CT,anchor:'middle'})+(i<4?ok(300+i*140+50,472):''));});
  s+=fade(seg(p,.55,.7),label('どの時刻でも 一致 → 解',1000,470,{size:28,color:CF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('一つの時刻だけ ✗',1000,120,{size:26,color:CR,anchor:'middle'}));
  return s;
 },
 [K+'cand']:(p)=>{
  const A=candAxes(seg(p,0,.15));
  let s=A.svg+A.plot(t=>100-10*t,{from:0,to:10,p:seg(p,.15,.5),color:CV,w:4});
  s+=fade(seg(p,.35,.5),tex(LINE,880,150,{size:52})+label('候補：一定のペースで減る 直線',880,230,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),dot(A.X(0),A.Y(100),10,CH)+label('t ＝ 0 で 100',A.X(0)+20,A.Y(100)-14,{size:24,color:CH}));
  return s;
 },
 [K+'candL']:(p)=>{
  const A=candAxes();
  let s=A.svg+A.plot(t=>100-10*t,{from:0,to:10,color:CV,w:4});
  s+=tex(LINE,880,130,{size:46});
  const g=seg(p,.1,.35),xa=A.X(2),xb=A.X(3),ya=A.Y(80),yb=A.Y(70);
  s+=fade(g,line(xa,ya,xb,ya,{color:CT,w:4})+line(xb,ya,xb,yb,{color:CR,w:5})+label('1 s',(xa+xb)/2,ya-10,{size:22,color:CT,anchor:'middle'})+label('−10',xb+8,(ya+yb)/2+22,{size:24,color:CR,weight:700}));
  s+=card(680,200,400,110,label('左の辺',740,265,{size:26,color:CR})+tex(DVDT+'=-10',960,258,{size:40}),seg(p,.4,.55),CR);
  s+=fade(seg(p,.7,.85),label('いつでも −10',880,360,{size:28,color:CR,anchor:'middle',weight:700}));
  return s;
 },
 [K+'candR']:(p)=>{
  const A=candAxes();
  let s=A.svg+A.plot(t=>100-10*t,{from:0,to:10,color:CV,w:4});
  s+=tex(LINE,880,110,{size:40});
  s+=card(710,150,430,80,label('左の辺',730,203,{size:24,color:CR})+tex(DVDT+'=-10',965,195,{size:34}),1,CR);
  let inner=label('右の辺',730,300,{size:24,color:CV})+tex('-0.1\\,v',965,295,{size:36});
  inner+=fade(seg(p,.15,.35),tex('=-0.1\\times(100-10t)',925,365,{size:34}));
  inner+=fade(seg(p,.5,.65),tex('=-10+t',925,430,{size:40}));
  s+=card(710,250,430,210,inner,1,CV);
  s+=fade(seg(p,.75,.9),label('時刻で変わる',925,495,{size:26,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cmp']:(p)=>{
  const A=candAxes();
  let s=A.svg+A.plot(t=>100-10*t,{from:0,to:10,color:CV,w:4});
  s+=dot(A.X(0),A.Y(100),9,CH)+fade(seg(p,.4,.55),dot(A.X(5),A.Y(50),9,CH)+label('t ＝ 5，v ＝ 50',A.X(5)+16,A.Y(50)-12,{size:22,color:CH}));
  const cx=[740,880,1010,1110];
  s+=label('時刻',cx[0],130,{size:24,color:CT,anchor:'middle'})+label('左の辺',cx[1],130,{size:24,color:CR,anchor:'middle'})+label('右の辺',cx[2],130,{size:24,color:CV,anchor:'middle'})+line(680,148,1160,148,{color:C.faint,w:2});
  s+=fade(seg(p,.05,.2),label('t ＝ 0',cx[0],200,{size:26,color:CT,anchor:'middle'})+label('−10',cx[1],200,{size:28,color:CR,anchor:'middle',weight:700})+label('−10',cx[2],200,{size:28,color:CV,anchor:'middle',weight:700})+ok(cx[3],202,seg(p,.2,.3)));
  s+=fade(seg(p,.45,.6),label('t ＝ 5',cx[0],270,{size:26,color:CT,anchor:'middle'})+label('−10',cx[1],270,{size:28,color:CR,anchor:'middle',weight:700})+label('−5',cx[2],270,{size:28,color:CV,anchor:'middle',weight:700})+ng(cx[3],272,seg(p,.7,.8)));
  s+=fade(seg(p,.8,.95),label('どの時刻でも、ではない → 解ではない',920,360,{size:26,color:CR,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  const A=candAxes();
  let s=A.svg+A.plot(t=>100-10*t,{from:0,to:10,color:CV,w:4});
  s+=dot(A.X(5),A.Y(50),9,CH);
  // at t=5 the rule wants slope −0.1×50 = −5 (gentler) — short segment
  const g=seg(p,.3,.5);
  s+=fade(g,line(A.X(3.5),A.Y(57.5),A.X(6.5),A.Y(42.5),{color:CH,w:5,dash:'10 7'}));
  s+=card(660,90,500,300,label('t ＝ 5 で v ＝ 50',910,140,{size:26,color:C.ink,anchor:'middle'})
   +label('直線の傾き：−10',910,205,{size:30,color:CV,anchor:'middle',weight:700})
   +fade(g,label('ルールの傾き：−0.1 × 50 ＝ −5',910,265,{size:28,color:CH,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('遅くなったら ゆっくり減れ',910,330,{size:26,color:CH,anchor:'middle'})),seg(p,0,.15));
  s+=fade(seg(p,.75,.9),label('直線は 解ではない',910,450,{size:32,color:CR,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 1秒ずつ追う =====
 [K+'plan']:(p)=>{
  const A=stepAxes(seg(p,0,.2));
  let s=A.svg+fade(seg(p,.15,.3),dot(A.X(0),A.Y(100),8,CV)+label('100',A.X(0)+14,A.Y(100)-12,{size:22,color:CV}));
  s+=fade(seg(p,.25,.4),tex(RULE.replace('k','0.1\\,'),925,110,{size:40})+label('v(0) ＝ 100',925,175,{size:26,color:CV,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('1秒ずつ 追う',925,280,{size:34,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s0']:(p)=>{
  const A=stepAxes();
  let s=A.svg+stepGraph(A,[seg(p,.5,.8)]);
  s+=tableHead()+tableRow(0,seg(p,.02,.12),{drop:seg(p,.15,.25),next:seg(p,.8,.9)});
  s+=fade(seg(p,.35,.5),label('この1秒は 減る速さ 10 のまま とみなす',925,440,{size:24,color:CR,anchor:'middle'}));
  s+=fade(seg(p,.8,.95),label('100 − 10 ＝ 90',925,490,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'approx']:(p)=>{
  const A=stepAxes();
  let s=A.svg+stepGraph(A,[1]);
  // inset: decrease rate during the first second, assumed vs actual
  const B=axes({x:740,y:400,w:340,h:190,xmax:1.12,ymin:8,ymax:10.6,xticks:[1],yticks:[9,10],grid:true,xlabel:'t [s]',ylabel:'減る速さ',xcolor:CT,ycolor:CR});
  let inner=B.svg+B.plot(()=>10,{from:0,to:1,color:CR,w:4,dash:'10 7'})+label('みなした：10 のまま',B.X(.05),B.Y(10)-14,{size:22,color:CR});
  inner+=fade(seg(p,.45,.6),B.plot(t=>10*Math.exp(-0.1*t),{from:0,to:1,p:seg(p,.45,.7),color:CH,w:4})+label('実際：少しずつ 小さく',B.X(.3),B.Y(9.05)+34,{size:22,color:CH}));
  s+=card(680,80,490,370,inner,seg(p,0,.12));
  s+=fade(seg(p,.15,.3),label('1秒後 ≈ 90',A.X(1)+18,A.Y(90)+40,{size:26,color:CH,weight:700})+label('≈：近似（ほぼ等しい）',925,490,{size:26,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s1']:(p)=>{
  const A=stepAxes();
  let s=A.svg+stepGraph(A,[1,seg(p,.55,.8)]);
  s+=tableHead()+tableRow(0)+tableRow(1,seg(p,.05,.2),{drop:seg(p,.4,.5),next:seg(p,.75,.85),hi:seg(p,.05,.2)*(1-seg(p,.85,1))});
  return s;
 },
 [K+'s2']:(p)=>{
  const A=stepAxes();
  let s=A.svg+stepGraph(A,[1,1,seg(p,.4,.75)]);
  s+=tableHead()+tableRow(0)+tableRow(1)+tableRow(2,seg(p,.05,.2),{drop:seg(p,.3,.4),next:seg(p,.65,.75)});
  return s;
 },
 [K+'bars']:(p)=>{
  const A=stepAxes();
  let s=A.svg+stepGraph(A,[1,1,1]);
  s+=tableHead()+tableRow(0)+tableRow(1)+tableRow(2);
  s+=highlight(TX[2]-70,TY0+TDY-36,140,TDY*3+2,seg(p,.05,.25),CR);
  s+=fade(seg(p,.2,.35),label('10 → 9 → 8.1：だんだん小さく',925,390,{size:26,color:CR,anchor:'middle',weight:700}));
  // straight line with the first slope, for comparison
  s+=fade(seg(p,.55,.7),line(A.X(0),A.Y(100),A.X(3),A.Y(70),{color:C.dim,w:3,dash:'8 8'})+label('同じペースなら',A.X(3)+10,A.Y(70)+34,{size:22,color:C.dim}));
  s+=fade(seg(p,.72,.87),label('直線ではなく、だんだん 寝ていく',925,450,{size:26,color:CV,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ratio']:(p)=>{
  const A=stepAxes();
  let s=A.svg+stepGraph(A,[1,1,1]);
  s+=tableHead()+tableRow(0)+tableRow(1)+tableRow(2);
  s+=fade(seg(p,.05,.3),tex(cV('v')+'-0.1\\,'+cV('v')+'=0.9\\,'+cV('v'),925,375,{size:40,auto:false}));
  const g=seg(p,.5,.75);
  for(let k=0;k<3;k++){const y=TY0+TDY*(k+1);s+=fade(g,arrow(TX[1]+46,y+2,TX[1]+46,y+TDY-26,{color:CH,w:3,head:10})+label('×0.9',TX[1]+56,y+TDY/2+2,{size:22,color:CH}));}
  s+=fade(seg(p,.75,.9),label('毎秒 0.9倍',925,450,{size:32,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>{
  const A=stepAxes();
  let s=A.svg+stepGraph(A,[1,1,1]);
  s+=tableHead()+tableRow(0)+tableRow(1)+tableRow(2)+tableRow(3,seg(p,.05,.2),{q:1,hi:seg(p,.1,.25)});
  s+=fade(seg(p,.2,.35),label('？',A.X(4),A.Y(66)-18,{size:40,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('4秒後は？ 予想してみよう',925,470,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quizA']:(p)=>{
  const A=stepAxes();
  let s=A.svg+stepGraph(A,[1,1,1,seg(p,.4,.65)],{hiStep:3});
  s+=tableHead()+tableRow(0)+tableRow(1)+tableRow(2)+tableRow(3,1,{drop:seg(p,.1,.2),next:seg(p,.3,.4)});
  s+=fade(seg(p,.1,.3),tex('72.9-7.29=65.61',925,440,{size:36,auto:false}));
  s+=fade(seg(p,.7,.85),tex('72.9\\times 0.9=65.61',925,495,{size:32,auto:false,color:CH}));
  return s;
 },
 [K+'seq']:(p)=>{
  const A=stepAxes();
  let s=A.svg+stepGraph(A,[1,1,1,1],{drops:0});
  s+=tableHead()+tableRow(0)+tableRow(1)+tableRow(2)+tableRow(3);
  s+=fade(seg(p,.3,.45),label('…',A.X(4.4),A.Y(60),{size:32,color:CV,anchor:'middle'}));
  s+=fade(seg(p,.35,.5),highlight(TX[1]-58,TY0+22,116,TDY*4+2,1,CV)+label('答え ＝ すべての時刻の 値の並び',925,480,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 逆向きにたどる =====
 [K+'rev']:(p)=>{
  let s=card(60,70,520,170,label('微分',320,115,{size:28,color:C.dim,anchor:'middle',weight:700})
   +label('位置の式',180,185,{size:30,color:C.x,anchor:'middle'})+arrow(260,177,380,177,{color:C.dim,w:4})+label('速さ',450,185,{size:30,color:CV,anchor:'middle'}),seg(p,0,.15));
  s+=card(620,70,520,170,label('今回（逆向き）',880,115,{size:28,color:CH,anchor:'middle',weight:700})
   +label('量そのもの',735,185,{size:30,color:CV,anchor:'middle'})+arrow(960,177,835,177,{color:CH,w:4})+label('変化の',1045,172,{size:26,color:CR,anchor:'middle'})+label('ルール',1045,206,{size:26,color:CR,anchor:'middle'}),seg(p,.4,.55),CH);
  return s;
 },
 [K+'integ']:(p)=>{
  let s=card(60,70,520,170,label('微分',320,115,{size:28,color:C.dim,anchor:'middle',weight:700})
   +label('位置の式',180,185,{size:30,color:C.x,anchor:'middle'})+arrow(260,177,380,177,{color:C.dim,w:4})+label('速さ',450,185,{size:30,color:CV,anchor:'middle'}),1);
  s+=card(620,70,520,170,label('今回（逆向き）',880,115,{size:28,color:CH,anchor:'middle',weight:700})
   +label('量そのもの',735,185,{size:30,color:CV,anchor:'middle'})+arrow(960,177,835,177,{color:CH,w:4})+label('変化の',1045,172,{size:26,color:CR,anchor:'middle'})+label('ルール',1045,206,{size:26,color:CR,anchor:'middle'}),1,CH);
  s+=card(60,270,520,220,label('積分',320,315,{size:28,color:C.dim,anchor:'middle',weight:700})
   +label('速さのグラフが 先に分かっている',320,370,{size:26,color:CV,anchor:'middle'})
   +label('→ 長方形を 足す',320,430,{size:26,color:C.x,anchor:'middle'}),seg(p,0,.2));
  s+=card(620,270,520,220,label('今回',880,315,{size:28,color:CH,anchor:'middle',weight:700})
   +label('減る速さは 答えの v 自身で決まる',880,370,{size:26,color:CR,anchor:'middle'})
   +fade(seg(p,.6,.75),label('→ 今の値を使って 一歩ずつ',880,430,{size:26,color:CV,anchor:'middle'})),seg(p,.35,.5),CH);
  return s;
 },
 [K+'law']:(p)=>{
  let s=label('自然の法則 ＝ 変化のルール の形',600,110,{size:32,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.5,.65),tex('ma=F',600,260,{size:90})+label('力学の 運動方程式',600,380,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'law2']:(p)=>{
  let s=label('自然の法則 ＝ 変化のルール の形',600,110,{size:32,color:C.dim,anchor:'middle'});
  s+=tex('ma=F',380,250,{size:80});
  s+=fade(seg(p,.05,.25),tex('a='+DVDT,820,250,{size:64})+label('速度の 変わる速さ',820,345,{size:26,color:CR,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),label('力 F が 速度の変わり方を 決める',600,420,{size:30,color:CF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('（ここでは形だけ。詳しくは 力学の回）',600,475,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'law3']:(p)=>{
  let s=label('今日のブレーキ',600,90,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.2),tex('F=-bv',450,160,{size:48})+label('力が 速さに比例（b は正の定数）',720,168,{size:22,color:CF}));
  s+=fade(seg(p,.3,.45),tex('m'+DVDT+'=-bv',450,265,{size:48})+label('ma ＝ F に入れる',720,273,{size:22,color:C.dim}));
  s+=fade(seg(p,.55,.7),tex(DVDT+'=-\\dfrac{b}{m}\\,v',450,385,{size:48})+label('両辺を m で割る',720,393,{size:22,color:C.dim}));
  s+=fade(seg(p,.75,.9),label('k ＝ b/m とおけば  dv/dt ＝ −kv',600,480,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'future']:(p)=>{
  const A=stepAxes(1);
  let s=A.svg+dot(A.X(0),A.Y(100),10,CH)+label('今の値',A.X(0)+16,A.Y(100)-14,{size:24,color:CH});
  s+=A.plot(t=>100*Math.pow(0.9,t),{from:0,to:4.4,p:seg(p,.2,.8),color:CV,w:4,dash:'10 8'});
  s+=card(680,120,480,220,label('今の値',920,180,{size:30,color:CH,anchor:'middle',weight:700})+label('＋ 変化のルール',920,235,{size:30,color:CR,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('→ この先の すべての時刻',920,300,{size:28,color:CV,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=label('まとめ',600,80,{size:30,color:C.dim,anchor:'middle'});
  s+=card(120,105,960,160,label('微分方程式 ＝ 分からない関数と その微分の 関係',600,150,{size:30,color:C.ink,anchor:'middle',weight:700})
   +tex(RULE,600,225,{size:36}),seg(p,0,.15));
  s+=card(120,290,960,130,label('答えは 関数 v(t)',600,340,{size:30,color:CV,anchor:'middle',weight:700})
   +label('どの時刻でも 左の辺 ＝ 右の辺 なら 解',600,390,{size:28,color:CF,anchor:'middle'}),seg(p,.45,.6));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=label('まとめ',600,80,{size:30,color:C.dim,anchor:'middle'});
  s+=card(120,105,960,160,label('微分方程式 ＝ 分からない関数と その微分の 関係',600,150,{size:30,color:C.dim,anchor:'middle'})
   +tex(RULE,600,225,{size:36}),1);
  s+=card(120,290,960,200,tex(RULE.replace('k','0.1\\,'),600,345,{size:36})
   +label('1秒刻み：100 → 90 → 81 → 72.9（毎秒 0.9倍）',600,420,{size:30,color:CV,anchor:'middle',weight:700})
   +fade(seg(p,.7,.85),label('≈ 近似',600,468,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 [K+'smooth']:(p)=>{
  const A=stepAxes(1);
  const pts=(h)=>{const a=[];let v=100;for(let t=0;t<=4.0001;t+=h){a.push([A.X(t),A.Y(v)]);v*=1-0.1*h;}return a;};
  let s=A.svg+draw(pts(1),1,{color:CV,w:4})+label('1秒刻み',A.X(4)+12,A.Y(65.6)+26,{size:22,color:CV});
  s+=fade(seg(p,.2,.4),draw(pts(.25),1,{color:CH,w:3}))+fade(seg(p,.3,.45),label('0.25秒刻み',A.X(2)+10,A.Y(82)-18,{size:22,color:CH}));
  s+=card(680,140,480,200,label('刻みを 細かくすると',920,200,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.7),label('なめらかな 本当の答えへ',920,265,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'next']:(p)=>{
  const A=stepAxes(1);
  let s=A.svg+A.plot(t=>100*Math.exp(-0.1*t),{from:0,to:4.4,p:seg(p,0,.4),color:CV,w:5});
  s+=card(680,120,480,260,label('次の問い',920,170,{size:26,color:C.dim,anchor:'middle'})
   +label('毎回 同じ割合で 減る',920,230,{size:28,color:C.ink,anchor:'middle'})
   +label('なめらかな答えに 出てくる数',920,280,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.7),label('e とは 何者？',920,345,{size:36,color:CH,anchor:'middle',weight:700})),seg(p,.2,.35),CH);
  return s;
 },
};
