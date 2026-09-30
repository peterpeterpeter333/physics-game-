// YouTube シリーズ「微分方程式・中級 1/2」(ys-um-simple-derivative-equation-1) — 図。Stage 1200×515.
// 色（anim.mjs C／初級 ui-rate-equation と同じ）：量 y 橙、時刻 t・刻み Δt 金、減る量 Δy・減る速さ 赤、
// 接線の一歩 黄、速さ v 紫（初級の振り返り）、増える 緑。
// 数値：y₀＝100 g、k＝0.2 /s。減る速さ 100 g→20 g/s、50 g→10 g/s。Δt＝1 s で 100→80。Δt＝5 s で 100→0。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,draw} from './anim.mjs';

const K='um-simple-derivative-equation-1:';
const CY=C.E,CT=C.t,CR=C.a,CH=C.hi,CV=C.v,CG=C.F;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const cY=s=>cs(CY,s),cT=s=>cs(CT,s),cR=s=>cs(CR,s),cH=s=>cs(CH,s);
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('○',x,y,{size:32,color:CG,weight:700,anchor:'middle'}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:32,color:CR,weight:700,anchor:'middle'}));
const DY='\\dfrac{'+cY('dy')+'}{d'+cT('t')+'}';
const RULE=DY+'=-k\\,'+cY('y');
const yi=cY('y_i'),yi1=cY('y_{i+1}'),DT='\\Delta '+cT('t');
const STEP=yi1+'\\approx '+yi+'(1-k\\,'+DT+')';
const ex=t=>100*Math.exp(-0.2*t);

// ---- y–t graph (numbers) ------------------------------------------------------------------------
function yt(g=1){return axes({x:100,y:450,w:470,h:340,xmax:5.5,ymax:114,xticks:[1,2,3,4,5],yticks:[20,40,60,80,100],grid:true,g,xlabel:'時刻 t [s]',ylabel:'量 y [g]',xcolor:CT,ycolor:CY});}
// ---- y–t graph (schematic, for the general step) ------------------------------------------------
function ys(g=1){return axes({x:100,y:450,w:500,h:340,xmax:3.6,ymax:112,g,xlabel:'t',ylabel:'y',xcolor:CT,ycolor:CY});}
const exS=t=>100*Math.exp(-0.5*t),TI=.5,DTS=1.2,YI=exS(TI),SL=-0.5*YI; // schematic (k=0.5, no numbers shown)
// ---- rate–amount graph --------------------------------------------------------------------------
function ry(g=1){return axes({x:120,y:440,w:470,h:320,xmax:112,ymax:26,xticks:[50,100],yticks:[10,20],grid:true,g,xlabel:'量 y [g]',ylabel:'減る速さ [g/s]',xcolor:CY,ycolor:CR});}

// small initial-series recall graph (初級: v)
function vRecall(g=1){
 const A=axes({x:110,y:440,w:420,h:320,xmax:3.6,ymin:60,ymax:104,xticks:[1,2,3],yticks:[70,80,90,100],grid:true,g,xlabel:'t [s]',ylabel:'v [m/s]',xcolor:CT,ycolor:CV});
 const V=[100,90,81,72.9];let s=A.svg;
 for(let k=0;k<3;k++)s+=line(A.X(k),A.Y(V[k]),A.X(k+1),A.Y(V[k+1]),{color:CV,w:4});
 V.forEach((v,k)=>s+=dot(A.X(k),A.Y(v),8,CV)+label(String(v),A.X(k)+10,A.Y(v)-12,{size:22,color:CV}));
 return fade(g,s);
}
// jar with amount y
function jar(level,{x=260,g=1,arrowLen=0,txt=null}={}){
 const top=110,bot=440,w=190,h=bot-top,lv=h*level/110;
 let s=rect(x-w/2,top,w,h,{fill:'none',fo:0,stroke:C.dim,sw:3,rx:10})+rect(x-w/2+6,bot-lv,w-12,lv-6,{fill:CY,fo:.45,stroke:CY,sw:0,rx:6});
 s+=label(txt??`y ＝ ${Math.round(level)} g`,x,bot+42,{size:28,color:CY,anchor:'middle',weight:700});
 if(arrowLen>2)s+=arrow(x+w/2+40,bot-lv-10,x+w/2+40,bot-lv-10+arrowLen,{color:CR,w:5,head:16});
 return fade(g,s);
}
function stepPts(A,dt,n,y0=100){const pts=[];let y=y0;for(let i=0;i<=n;i++){pts.push([A.X(i*dt),A.Y(y)]);y*=1-0.2*dt;}return pts;}

export const ytUmSde1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=card(170,90,860,300,label('前回の問い',600,145,{size:26,color:C.dim,anchor:'middle'})
   +label('「減り方は 今の量に 比例する」',600,220,{size:36,color:CY,anchor:'middle',weight:700})
   +fade(seg(p,.35,.55),label('このルールから、量そのものを',600,290,{size:30,color:C.ink,anchor:'middle'})
    +label('一歩ずつ 刻んで 求めるには？',600,345,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 [K+'shokyu']:(p)=>{
  let s=vRecall(seg(p,0,.2));
  s+=card(630,100,530,300,label('初級',895,145,{size:24,color:C.dim,anchor:'middle'})
   +tex('\\dfrac{d{\\color{'+CV+'}{v}}}{d'+cT('t')+'}=-k\\,{\\color{'+CV+'}{v}}',895,215,{size:42,auto:false})
   +fade(seg(p,.35,.5),label('1秒刻み 100 → 90 → 81',895,290,{size:28,color:CV,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('毎秒 0.9倍',895,350,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'goal']:(p)=>{
  let s=vRecall(.35);
  s+=card(630,100,530,330,label('今回：一般の量 y で',895,150,{size:28,color:CY,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),label('① 言葉を 式にする',720,225,{size:28,color:C.ink}))
   +fade(seg(p,.4,.55),label('② 負号と 単位を 読む',720,290,{size:28,color:C.ink}))
   +fade(seg(p,.6,.75),label('③ 一歩の式を 作る',720,355,{size:28,color:CH,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'setup']:(p)=>{
  const u=seg(p,.1,.95),lv=100*Math.exp(-0.9*u);
  let s=jar(lv,{g:seg(p,0,.1),arrowLen:mix(70,32,u),txt:u<.05?'y ＝ 100 g':'y [g]'});
  s+=card(560,120,590,270,label('残っている量 y [g]',855,175,{size:28,color:CY,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),label('多いうちは 速く減る',855,250,{size:30,color:CR,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('少なくなれば ゆっくり減る',855,320,{size:30,color:CR,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=jar(41,{arrowLen:32,g:.5,txt:'y [g]'});
  s+=card(540,110,620,280,label('今回の問い',850,165,{size:26,color:C.dim,anchor:'middle'})
   +label('この文を 式にすると？',850,235,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('次の瞬間の量は どう計算する？',850,315,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 // ===== S2 言葉を式にする =====
 [K+'rate']:(p)=>{
  let s=tex(DY,600,210,{size:90,auto:false});
  s+=fade(seg(p,.3,.45),line(660,138,790,120,{color:C.dim,w:2})+label('y の変化',800,125,{size:28,color:CY}));
  s+=fade(seg(p,.45,.6),line(660,260,790,285,{color:C.dim,w:2})+label('かかった時間',800,295,{size:28,color:CT}));
  s+=fade(seg(p,.65,.8),label('1秒あたり、y が どれだけ 変わるか',600,420,{size:32,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rateunit']:(p)=>{
  let s=tex(DY,380,210,{size:90,auto:false});
  s+=label('y の変化',580,125,{size:28,color:CY})+label('かかった時間',580,295,{size:28,color:CT});
  s+=fade(seg(p,.3,.5),label('単位',840,222,{size:26,color:C.dim,anchor:'end'})+tex('\\dfrac{\\mathrm{g}}{\\mathrm{s}}',900,215,{size:70,auto:false}));
  s+=fade(seg(p,.6,.75),label('g/s（グラム毎秒）',900,330,{size:32,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=tex(DY,600,110,{size:60,auto:false});
  s+=card(140,190,420,230,tex(DY+'>0',350,260,{size:44,auto:false})+arrow(350,395,350,320,{color:CG,w:6})+label('増えている',420,370,{size:30,color:CG,weight:700}),seg(p,.15,.3));
  s+=card(640,190,420,230,tex(DY+'<0',850,260,{size:44,auto:false})+arrow(850,320,850,395,{color:CR,w:6})+label('減っている',920,370,{size:30,color:CR,weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'eq']:(p)=>{
  let s=label('減る速さ は 今の量 y に 比例',600,120,{size:34,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.35,.5),label('比例の係数',470,215,{size:28,color:C.dim,anchor:'middle'})+label('k',470,265,{size:44,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('減る速さ ＝',520,380,{size:36,color:CR,anchor:'end',weight:700})+tex('k\\,'+cY('y'),600,370,{size:64,auto:false}));
  return s;
 },
 [K+'eq2']:(p)=>{
  let s=label('減る向き → マイナス',600,72,{size:30,color:CR,anchor:'middle',weight:700});
  s+=tex(RULE,600,250,{size:90,auto:false});
  const w=texWidth(RULE,90,false),xr=600+w/2;
  s+=fade(seg(p,.4,.55),highlight(xr-48,190,58,110,1,CY)+label('今の量',xr-30,340,{size:28,color:CY,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('右の辺に y が入っている ＝ この式の特徴',600,440,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'const']:(p)=>{
  const A=ry(seg(p,0,.15));
  let s=A.svg+fade(seg(p,.2,.45),line(A.X(0),A.Y(20),A.X(108),A.Y(20),{color:C.dim,w:5})+label('一定',A.X(28),A.Y(20)-14,{size:26,color:C.dim,weight:700}));
  s+=card(660,110,500,250,label('毎秒 20 g ずつ 一定に 減る',910,165,{size:28,color:C.ink,anchor:'middle'})
   +tex(DY+'=-20',910,250,{size:48,auto:false})
   +fade(seg(p,.6,.75),label('右の辺に y が無い',910,330,{size:28,color:CR,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'const2']:(p)=>{
  const A=ry();
  let s=A.svg+line(A.X(0),A.Y(20),A.X(108),A.Y(20),{color:C.dim,w:5})+label('一定',A.X(28),A.Y(20)-14,{size:26,color:C.dim,weight:700});
  s+=fade(seg(p,.05,.2),dot(A.X(100),A.Y(20),9,C.dim)+dot(A.X(10),A.Y(20),9,C.dim));
  s+=draw([[A.X(0),A.Y(0)],[A.X(108),A.Y(21.6)]],seg(p,.45,.65),{color:CY,w:5})+fade(seg(p,.6,.7),label('比例',A.X(84),A.Y(16)+40,{size:26,color:CY,weight:700}));
  s+=fade(seg(p,.7,.85),dot(A.X(100),A.Y(20),9,CY)+dot(A.X(50),A.Y(10),9,CY)+line(A.X(50),A.Y(0),A.X(50),A.Y(10),{color:CY,w:2,dash:'6 5'})
   +label('半分',A.X(50)+10,A.Y(5)+8,{size:22,color:CY}));
  s+=card(660,110,500,250,label('一定：どの量でも 同じ速さ',910,175,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),label('比例：量が 半分 → 速さも 半分',910,250,{size:28,color:CY,anchor:'middle',weight:700}))
   +fade(seg(p,.75,.9),tex(RULE,910,320,{size:40,auto:false})),1);
  return s;
 },
 // ===== S3 負号と k の単位 =====
 [K+'minus']:(p)=>{
  let s=tex(RULE,600,110,{size:62,auto:false});
  s+=fade(seg(p,.15,.3),label('k ＞ 0',420,230,{size:34,color:C.ink,anchor:'middle',weight:700})+label('正',420,275,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('y ＞ 0',780,230,{size:34,color:CY,anchor:'middle',weight:700})+label('正',780,275,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),tex('-k\\,'+cY('y')+'<0',600,360,{size:54,auto:false})+label('いつでも 負',600,420,{size:28,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('→ y は 減り続ける',600,480,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'plus']:(p)=>{
  let s=card(110,110,460,300,label('負号あり',340,160,{size:26,color:C.dim,anchor:'middle'})+tex(RULE,340,235,{size:44,auto:false})+label('減り続ける',340,330,{size:30,color:CR,anchor:'middle',weight:700}),1);
  s+=card(630,110,460,300,label('負号を 外すと',860,160,{size:26,color:C.dim,anchor:'middle'})+tex(DY+'=+k\\,'+cY('y'),860,235,{size:44,auto:false})
   +fade(seg(p,.3,.45),label('増え続ける',860,330,{size:30,color:CG,anchor:'middle',weight:700})),seg(p,.1,.25));
  s+=fade(seg(p,.65,.8),label('負号 ＝ 減る向き だけ を表す',600,470,{size:32,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'zero']:(p)=>{
  const A=ry();
  let s=A.svg+line(A.X(0),A.Y(0),A.X(108),A.Y(21.6),{color:CY,w:5})+label('減る速さ ＝ ky',A.X(60),A.Y(12)-24,{size:26,color:CY,weight:700,anchor:'end'});
  const yv=mix(100,6,seg(p,.1,.7));
  s+=dot(A.X(yv),A.Y(.2*yv),10,CH)+line(A.X(yv),A.Y(0),A.X(yv),A.Y(.2*yv),{color:CH,w:2,dash:'6 5'});
  s+=card(660,110,500,270,label('y → 0 に 近づくと',910,170,{size:30,color:CY,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('減る速さ ky → 0',910,240,{size:30,color:CR,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('減り方が ゆるむ',910,300,{size:26,color:C.ink,anchor:'middle'})+label('→ 0 を 割り込まない',910,345,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=tex(RULE,600,90,{size:50,auto:false});
  // balance
  const bx=600,by=260;
  s+=fade(seg(p,.1,.3),line(bx,by,bx,430,{color:C.dim,w:5})+line(bx-60,430,bx+60,430,{color:C.dim,w:5})+line(bx-300,by,bx+300,by,{color:C.dim,w:5})+dot(bx,by,9,C.dim)
   +line(bx-300,by,bx-450,by+90,{color:C.dim,w:2})+line(bx-300,by,bx-150,by+90,{color:C.dim,w:2})+line(bx-460,by+90,bx-140,by+90,{color:C.dim,w:5})
   +line(bx+300,by,bx+150,by+90,{color:C.dim,w:2})+line(bx+300,by,bx+450,by+90,{color:C.dim,w:2})+line(bx+140,by+90,bx+460,by+90,{color:C.dim,w:5}));
  s+=fade(seg(p,.3,.45),tex('\\mathrm{g/s}',bx-300,by+72,{size:46,auto:false,color:C.ink})+label('左の辺',bx-300,by+130,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),tex('[k]\\times\\mathrm{g}',bx+300,by+72,{size:46,auto:false,color:C.ink})+label('右の辺',bx+300,by+130,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),tex('\\mathrm{g/s}=[k]\\times\\mathrm{g}',600,190,{size:44,auto:false,color:CH}));
  s+=fade(seg(p,.8,.95),label('[k]：k の単位',990,480,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'unit2']:(p)=>{
  let s=tex('\\mathrm{g/s}=[k]\\times\\mathrm{g}',600,130,{size:58,auto:false});
  s+=fade(seg(p,.05,.2),label('両辺を g で割る',600,215,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.25,.45),tex('[k]=\\mathrm{1/s}',600,310,{size:70,auto:false,color:CH}));
  s+=fade(seg(p,.6,.75),label('量の単位を 持たない、1秒あたりの 割合',600,430,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'k02']:(p)=>{
  const A=ry();
  let s=A.svg+draw([[A.X(0),A.Y(0)],[A.X(108),A.Y(21.6)]],seg(p,.05,.3),{color:CY,w:5});
  s+=fade(seg(p,.45,.6),dot(A.X(100),A.Y(20),10,CH)+line(A.X(100),A.Y(0),A.X(100),A.Y(20),{color:CH,w:2,dash:'6 5'})+label('20',A.X(100)-14,A.Y(20)-14,{size:24,color:CR,weight:700,anchor:'end'}));
  s+=card(660,110,500,260,tex('k=0.2\\ \\mathrm{/s}',910,170,{size:44,auto:false})
   +fade(seg(p,.35,.5),label('y ＝ 100 g のとき',910,240,{size:26,color:CY,anchor:'middle'}))
   +fade(seg(p,.45,.6),tex('0.2\\times 100=20\\ \\mathrm{g/s}',910,310,{size:40,auto:false,color:CR})),seg(p,0,.15));
  return s;
 },
 [K+'k02b']:(p)=>{
  const A=ry();
  let s=A.svg+line(A.X(0),A.Y(0),A.X(108),A.Y(21.6),{color:CY,w:5});
  s+=dot(A.X(100),A.Y(20),10,CH)+label('20',A.X(100)-14,A.Y(20)-14,{size:24,color:CR,weight:700,anchor:'end'});
  s+=fade(seg(p,.05,.25),dot(A.X(50),A.Y(10),10,CH)+line(A.X(50),A.Y(0),A.X(50),A.Y(10),{color:CH,w:2,dash:'6 5'})+label('10',A.X(50)-14,A.Y(10)-14,{size:24,color:CR,weight:700,anchor:'end'}));
  s+=card(660,110,500,260,tex('0.2\\times 100=20\\ \\mathrm{g/s}',910,170,{size:38,auto:false,color:CR})
   +fade(seg(p,.05,.25),tex('0.2\\times 50=10\\ \\mathrm{g/s}',910,240,{size:38,auto:false,color:CR}))
   +fade(seg(p,.55,.7),tex('\\mathrm{1/s}\\times\\mathrm{g}=\\mathrm{g/s}',910,320,{size:40,auto:false,color:CH})),1);
  return s;
 },
 [K+'meyasu']:(p)=>{
  let s=card(200,100,800,330,tex('k=0.2\\ \\mathrm{/s}',600,170,{size:50,auto:false})
   +fade(seg(p,.1,.25),label('1秒あたり 2割 ＝ 目安',600,250,{size:34,color:CH,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),label('1秒の間にも y は減る',600,320,{size:28,color:CY,anchor:'middle'})+label('→ ちょうど 2割 とは 限らない',600,375,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 // ===== S4 一歩の式を作る =====
 [K+'q']:(p)=>{
  const A=yt(seg(p,0,.15));
  let s=A.svg+fade(seg(p,.1,.25),dot(A.X(0),A.Y(100),9,CY)+label('出発 100 g',A.X(0)+16,A.Y(100)-16,{size:24,color:CY,weight:700}));
  s+=fade(seg(p,.55,.7),label('？',A.X(1.5),A.Y(75),{size:40,color:CH,weight:700})+label('？',A.X(3),A.Y(55),{size:40,color:CH,weight:700})+label('？',A.X(4.5),A.Y(40),{size:40,color:CH,weight:700}));
  s+=card(660,110,500,250,tex(RULE,910,175,{size:44,auto:false})
   +fade(seg(p,.2,.35),label('教えるのは 変わり方 だけ',910,260,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('この先を どう追う？',910,320,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'tangent']:(p)=>{
  const A=axes({x:110,y:450,w:470,h:340,xmax:4.2,ymax:17,g:1,xlabel:'x',ylabel:'',xcolor:C.x});
  const f=x=>x*x,a=2.2;
  let s=A.svg+A.plot(f,{from:0,to:4.05,color:C.x,w:4});
  s+=fade(seg(p,.15,.35),dot(A.X(a),A.Y(f(a)),9,C.E)+label('a',A.X(a)-6,A.Y(0)+34,{size:24,color:C.E,anchor:'middle'}));
  s+=draw([[A.X(a-1.2),A.Y(f(a)-2*a*1.2)],[A.X(a+1.5),A.Y(f(a)+2*a*1.5)]],seg(p,.3,.55),{color:CH,w:4});
  s+=card(640,110,520,260,label('近似の回：接線近似',900,160,{size:26,color:C.dim,anchor:'middle'})
   +tex('f(x)\\approx f(a)+f\'(a)(x-a)',900,240,{size:40,auto:false})
   +fade(seg(p,.55,.7),label('値と傾きを 合わせた 直線',900,320,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'slope']:(p)=>{
  const A=ys();
  let s=A.svg+A.plot(exS,{from:0,to:3.5,color:CY,w:3,dash:'10 8'})+fade(.8,label('本当の y',A.X(3.1),A.Y(exS(3.1))-18,{size:22,color:CY}));
  s+=fade(seg(p,.05,.2),dot(A.X(TI),A.Y(YI),10,CY)+label('yᵢ',A.X(TI)-16,A.Y(YI)+32,{size:28,color:CY,anchor:'end',weight:700})
   +line(A.X(TI),A.Y(0),A.X(TI),A.Y(YI),{color:CT,w:2,dash:'6 5'})+label('tᵢ',A.X(TI),A.Y(0)+34,{size:24,color:CT,anchor:'middle'}));
  s+=draw([[A.X(TI),A.Y(YI)],[A.X(TI+DTS),A.Y(YI+SL*DTS)]],seg(p,.3,.5),{color:CH,w:5});
  s+=fade(seg(p,.4,.55),label('傾き −kyᵢ',A.X(TI+.9)+10,A.Y(YI+SL*.5),{size:26,color:CH,weight:700}));
  s+=card(660,110,500,250,label('今の点',910,160,{size:26,color:C.dim,anchor:'middle'})
   +label('値',720,240,{size:28,color:C.ink,anchor:'end'})+tex(yi,760,232,{size:40,auto:false})
   +label('傾き',850,240,{size:28,color:C.ink,anchor:'end'})+tex(DY+'=-k\\,'+yi,980,232,{size:36,auto:false})
   +fade(seg(p,.65,.8),label('i：ステップの番号（i ＝ 0 が出発点）',910,315,{size:24,color:C.ink,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'dy']:(p)=>{
  const A=ys();const Y1=YI+SL*DTS;
  let s=A.svg+A.plot(exS,{from:0,to:3.5,color:CY,w:3,dash:'10 8'});
  s+=dot(A.X(TI),A.Y(YI),10,CY)+label('yᵢ',A.X(TI)-16,A.Y(YI)+32,{size:28,color:CY,anchor:'end',weight:700});
  s+=line(A.X(TI),A.Y(YI),A.X(TI+DTS),A.Y(Y1),{color:CH,w:5});
  s+=fade(seg(p,.05,.25),line(A.X(TI),A.Y(YI),A.X(TI+DTS),A.Y(YI),{color:C.dim,w:2,dash:'6 5'})+brace(A.X(TI),A.X(TI+DTS),A.Y(YI)-8,{dir:-1,color:CT,text:'Δt',size:26}));
  s+=fade(seg(p,.4,.6),line(A.X(TI+DTS),A.Y(YI),A.X(TI+DTS),A.Y(Y1),{color:CR,w:6})+label('Δy',A.X(TI+DTS)+12,A.Y((YI+Y1)/2)+8,{size:28,color:CR,weight:700}));
  s+=card(660,110,500,250,label('短い Δt の間は 傾きを一定とみなす',910,165,{size:24,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),label('変化 ＝ 傾き × 幅',910,230,{size:28,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.55,.7),tex(cR('\\Delta y')+'\\approx -k\\,'+yi+'\\,'+DT,910,305,{size:46,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'next']:(p)=>{
  const A=ys();const Y1=YI+SL*DTS;
  let s=A.svg+A.plot(exS,{from:0,to:3.5,color:CY,w:3,dash:'10 8'});
  s+=dot(A.X(TI),A.Y(YI),10,CY)+label('yᵢ',A.X(TI)-16,A.Y(YI)+32,{size:28,color:CY,anchor:'end',weight:700});
  s+=line(A.X(TI),A.Y(YI),A.X(TI+DTS),A.Y(Y1),{color:CH,w:5})+line(A.X(TI+DTS),A.Y(YI),A.X(TI+DTS),A.Y(Y1),{color:CR,w:6});
  s+=fade(seg(p,.2,.4),dot(A.X(TI+DTS),A.Y(Y1),10,CH)+label('yᵢ₊₁',A.X(TI+DTS)+14,A.Y(Y1)+30,{size:28,color:CH,weight:700}));
  s+=card(660,110,500,250,label('今の値 ＋ 変化',910,165,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.35,.55),tex(yi1+'\\approx '+yi+'-k\\,'+yi+'\\,'+DT,910,250,{size:44,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'factor']:(p)=>{
  let s=tex(yi1+'\\approx '+yi+'-k\\,'+yi+'\\,'+DT,600,110,{size:54,auto:false});
  s+=fade(seg(p,.05,.25),label('両方の項に yᵢ → くくり出す',600,195,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.25,.45),tex(STEP,600,290,{size:64,auto:false}));
  const w=texWidth(STEP,64,false),wR=texWidth('(1-k\\,'+DT+')',64,false);
  s+=fade(seg(p,.55,.7),highlight(600+w/2-wR+18,238,wR-6,90,1,CH)+label('毎回 同じ数を 掛ける',600+w/2-wR/2,380,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'approx']:(p)=>{
  const A=ys();const Y1=YI+SL*DTS,Yt=exS(TI+DTS);
  let s=A.svg+A.plot(exS,{from:0,to:3.5,color:CY,w:4});
  s+=dot(A.X(TI),A.Y(YI),10,CY)+line(A.X(TI),A.Y(YI),A.X(TI+DTS),A.Y(Y1),{color:CH,w:5})+dot(A.X(TI+DTS),A.Y(Y1),10,CH);
  s+=fade(seg(p,.15,.35),dot(A.X(TI+DTS),A.Y(Yt),10,CY)+line(A.X(TI+DTS),A.Y(Y1),A.X(TI+DTS),A.Y(Yt),{color:CR,w:4})+label('ずれ',A.X(TI+DTS)-14,A.Y(Y1)+34,{size:26,color:CR,weight:700,anchor:'end'}));
  s+=card(660,110,500,270,tex('\\approx',910,170,{size:60,auto:false,color:CH})
   +fade(seg(p,.3,.45),label('Δt の間にも y は減り、傾きは ゆるむ',910,245,{size:24,color:CY,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('始めの傾きを 使い続ける',910,305,{size:28,color:CH,anchor:'middle',weight:700})+label('→ 少し 減らしすぎ',910,350,{size:26,color:CR,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 // ===== S5 1ステップ進める =====
 [K+'given']:(p)=>{
  const A=yt(seg(p,0,.15));
  let s=A.svg+dot(A.X(0),A.Y(100),9,CY)+label('100',A.X(0)+14,A.Y(100)-14,{size:24,color:CY,weight:700});
  s+=card(660,110,500,270,tex(cY('y_0')+'=100\\ \\mathrm{g}',910,170,{size:40,auto:false})
   +fade(seg(p,.3,.45),tex('k=0.2\\ \\mathrm{/s}',910,240,{size:40,auto:false}))
   +fade(seg(p,.55,.7),tex(DT+'=1\\ \\mathrm{s}',910,310,{size:40,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'predict']:(p)=>{
  const A=yt();
  let s=A.svg+dot(A.X(0),A.Y(100),9,CY)+label('100',A.X(0)+14,A.Y(100)-14,{size:24,color:CY,weight:700});
  s+=fade(seg(p,.2,.4),line(A.X(1),A.Y(0),A.X(1),A.Y(108),{color:CT,w:2,dash:'6 6'})+label('？',A.X(1)+12,A.Y(80)+12,{size:40,color:CH,weight:700}));
  s+=card(660,110,500,270,tex(cY('y_0')+'=100\\ \\mathrm{g}',910,170,{size:40,auto:false})+tex('k=0.2\\ \\mathrm{/s}',910,240,{size:40,auto:false})+tex(DT+'=1\\ \\mathrm{s}',910,310,{size:40,auto:false}),1,CH);
  s+=fade(seg(p,.4,.55),label('1秒後は？',910,440,{size:34,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'calc']:(p)=>{
  const A=yt();
  let s=A.svg+dot(A.X(0),A.Y(100),9,CY)+label('100',A.X(0)+14,A.Y(100)-14,{size:24,color:CY,weight:700});
  s+=draw([[A.X(0),A.Y(100)],[A.X(1),A.Y(80)]],seg(p,.05,.3),{color:CH,w:5});
  s+=fade(seg(p,.25,.4),line(A.X(1),A.Y(100),A.X(1),A.Y(80),{color:CR,w:6})+label('−20',A.X(1)+12,A.Y(90)+8,{size:26,color:CR,weight:700}));
  s+=card(640,110,520,270,tex(cR('\\Delta y')+'\\approx -0.2\\times 100\\times 1',900,175,{size:40,auto:false})
   +fade(seg(p,.2,.35),tex('=-20\\ \\mathrm{g}',900,245,{size:42,auto:false,color:CR}))
   +fade(seg(p,.55,.7),label('単位',700,330,{size:24,color:C.dim})+tex('\\mathrm{1/s}\\times\\mathrm{g}\\times\\mathrm{s}=\\mathrm{g}',930,325,{size:34,auto:false})),seg(p,0,.12));
  return s;
 },
 [K+'result']:(p)=>{
  const A=yt();
  let s=A.svg+dot(A.X(0),A.Y(100),9,CY)+label('100',A.X(0)+14,A.Y(100)-14,{size:24,color:CY,weight:700});
  s+=line(A.X(0),A.Y(100),A.X(1),A.Y(80),{color:CH,w:5})+line(A.X(1),A.Y(100),A.X(1),A.Y(80),{color:CR,w:6});
  s+=fade(seg(p,.1,.25),dot(A.X(1),A.Y(80),10,CH)+label('80',A.X(1)+14,A.Y(80)+30,{size:26,color:CH,weight:700}));
  s+=card(640,110,520,270,tex('100-20=80\\ \\mathrm{g}',900,175,{size:44,auto:false,color:CH})
   +fade(seg(p,.45,.6),tex('1-k\\,'+DT+'=1-0.2\\times 1=0.8',900,250,{size:36,auto:false}))
   +fade(seg(p,.65,.8),tex('100\\times 0.8=80',900,320,{size:40,auto:false})),seg(p,0,.12));
  return s;
 },
 [K+'prop']:(p)=>{
  const x0=180,W=840,y0=200,H=90,u=W/100;
  let s=rect(x0,y0,80*u,H,{fill:CY,fo:.45,stroke:CY,sw:2,rx:4})+rect(x0+80*u,y0,20*u,H,{fill:CR,fo:.55,stroke:CR,sw:2,rx:4});
  s+=label('100 g',x0,y0-20,{size:28,color:CY,weight:700})+label('残り 80 g',x0+40*u,y0+H/2+10,{size:30,color:C.ink,anchor:'middle',weight:700})+label('20 g',x0+90*u,y0+H/2+10,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.4),brace(x0+80*u,x0+100*u,y0+H+10,{color:CR,text:'減った分',size:26}));
  s+=fade(seg(p,.4,.6),tex('20\\ \\mathrm{g}=0.2\\times 100\\ \\mathrm{g}',600,420,{size:48,auto:false,color:CR}));
  s+=fade(seg(p,.7,.85),label('今の量に 比例して 減る',600,490,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mistake']:(p)=>{
  const X=[250,600,950];
  let s=card(110,120,280,250,label('80 g',X[0],210,{size:48,color:CH,anchor:'middle',weight:700})+label('残り',X[0],280,{size:28,color:C.ink,anchor:'middle'})+ok(X[0],345),seg(p,0,.15),CH);
  s+=card(460,120,280,250,label('20 g',X[1],210,{size:48,color:C.dim,anchor:'middle',weight:700})+label('減った分',X[1],280,{size:28,color:C.ink,anchor:'middle'})+ng(X[1],345),seg(p,.15,.3));
  s+=card(810,120,280,250,label('120 g',X[2],210,{size:48,color:C.dim,anchor:'middle',weight:700})+label('負号を 落とした',X[2],280,{size:28,color:C.ink,anchor:'middle'})+ng(X[2],345),seg(p,.55,.7));
  s+=fade(seg(p,.2,.35),label('変化分と 残りを 取り違えない',600,450,{size:30,color:CR,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(200,90,800,320,label('確かめ',600,145,{size:26,color:C.dim,anchor:'middle'})
   +tex(cY('y')+'=50\\ \\mathrm{g},\\quad k=0.2\\ \\mathrm{/s},\\quad '+DT+'=0.5\\ \\mathrm{s}',600,230,{size:40,auto:false})
   +fade(seg(p,.4,.55),label('次の値は？',600,330,{size:34,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 [K+'quizA']:(p)=>{
  let s=tex(cY('y')+'=50\\ \\mathrm{g},\\quad k=0.2\\ \\mathrm{/s},\\quad '+DT+'=0.5\\ \\mathrm{s}',600,100,{size:36,auto:false});
  s+=fade(seg(p,.05,.25),label('減る量',330,215,{size:28,color:CR,anchor:'middle'})+tex('0.2\\times 50\\times 0.5=5\\ \\mathrm{g}',700,210,{size:44,auto:false,color:CR}));
  s+=fade(seg(p,.5,.7),label('次の値',330,335,{size:28,color:CH,anchor:'middle'})+tex('50-5=45\\ \\mathrm{g}',700,330,{size:50,auto:false,color:CH}));
  return s;
 },
 [K+'coarse']:(p)=>{
  const A=yt();
  let s=A.svg+dot(A.X(0),A.Y(100),9,CY);
  s+=draw([[A.X(0),A.Y(100)],[A.X(5),A.Y(0)]],seg(p,.4,.7),{color:CR,w:5})+fade(seg(p,.65,.8),dot(A.X(5),A.Y(0),10,CR)+label('0 g',A.X(5)+12,A.Y(0)-30,{size:26,color:CR,weight:700}));
  s+=card(640,110,520,270,tex(DT+'=5\\ \\mathrm{s}',900,170,{size:42,auto:false})
   +fade(seg(p,.15,.3),tex('1-k\\,'+DT+'=1-0.2\\times 5=0',900,250,{size:38,auto:false,color:CR}))
   +fade(seg(p,.7,.85),label('一歩で 0 g に',900,330,{size:30,color:CR,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'coarse2']:(p)=>{
  const A=yt();
  let s=A.svg+dot(A.X(0),A.Y(100),9,CY)+line(A.X(0),A.Y(100),A.X(5),A.Y(0),{color:CR,w:4})+dot(A.X(5),A.Y(0),10,CR);
  s+=fade(seg(p,.05,.25),A.plot(ex,{from:0,to:5.3,color:CY,w:4,dash:'10 8'})+label('本当の y',A.X(3.3),A.Y(ex(3.3))-18,{size:24,color:CY}));
  s+=fade(seg(p,.5,.65),line(A.X(0),A.Y(100),A.X(1),A.Y(80),{color:CH,w:5})+dot(A.X(1),A.Y(80),9,CH));
  s+=card(640,110,520,300,label('本当の y は 0 を 割り込まない',900,160,{size:26,color:CY,anchor:'middle'})
   +label('→ 刻みが 粗すぎる',900,205,{size:28,color:CR,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('Δt ＝ 1 s：kΔt ＝ 0.2',900,275,{size:26,color:CH,anchor:'middle'})+label('Δt ＝ 5 s：kΔt ＝ 1',900,315,{size:26,color:CR,anchor:'middle'}))
   +fade(seg(p,.7,.85),label('kΔt が 1 より ずっと小さいと よく合う',900,380,{size:24,color:C.ink,anchor:'middle',weight:700})),1);
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=label('まとめ',600,75,{size:30,color:C.dim,anchor:'middle'});
  s+=card(120,100,960,180,tex(RULE,330,190,{size:50,auto:false})
   +label('「減り方が 今の量に 比例する」',780,165,{size:28,color:CY,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('負号 ＝ 減る向き、k の単位 ＝ 1/s',780,230,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.15),CH);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=label('まとめ',600,75,{size:30,color:C.dim,anchor:'middle'});
  s+=card(120,100,960,180,tex(RULE,330,190,{size:50,auto:false})
   +label('「減り方が 今の量に 比例する」',780,165,{size:28,color:CY,anchor:'middle',weight:700})
   +label('負号 ＝ 減る向き、k の単位 ＝ 1/s',780,230,{size:28,color:C.ink,anchor:'middle'}),1,CH);
  s+=card(120,300,960,190,tex(STEP,400,380,{size:50,auto:false})
   +label('短い Δt で 傾き一定',860,355,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.55,.7),label('100 g → 1秒後 約 80 g',860,420,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'nextq']:(p)=>{
  const A=yt();
  let s=A.svg+dot(A.X(0),A.Y(100),9,CY)+line(A.X(0),A.Y(100),A.X(1),A.Y(80),{color:CH,w:5})+dot(A.X(1),A.Y(80),9,CH);
  s+=fade(seg(p,.1,.3),draw([[A.X(1),A.Y(80)],[A.X(2),A.Y(64)],[A.X(3),A.Y(51.2)],[A.X(4),A.Y(40.96)]],1,{color:CH,w:3,dash:'8 8'})+label('？',A.X(4)+10,A.Y(41)-14,{size:40,color:CH,weight:700}));
  s+=fade(seg(p,.55,.75),draw(stepPts(A,.25,16),1,{color:C.dim,w:2}));
  s+=card(660,110,500,260,label('次の問い',910,160,{size:24,color:C.dim,anchor:'middle'})
   +label('一歩を 繰り返すと 4秒後は？',910,230,{size:30,color:CH,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('刻みを 細かくすると 答えは 変わる？',910,300,{size:26,color:C.ink,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
};
