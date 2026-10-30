// YouTube シリーズ「微分方程式・中級 2/2」(ys-um-simple-derivative-equation-2) — 図。Stage 1200×515.
// 色（1/2・初級と同じ）：量 y と本当の曲線 橙、時刻 t 金、減った量 赤、強調 黄。
// 刻みの折れ線：1 s 灰、0.5 s 桃、0.25 s 黄。
// 数値：×0.8：100, 80, 64, 51.2, 40.96。0.5 s：43.05。0.25 s：44.01。0.01 s：44.90。100e^(−0.8)＝44.93。
//   半分になる時間 3.47 s（100→50→25→12.5 は t＝3.47, 6.93, 10.40）。100e^(−0.2)＝81.87。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,texWidth,draw,wall,spring,block} from './anim.mjs';

const K='um-simple-derivative-equation-2:';
const CY=C.E,CT=C.t,CR=C.a,CH=C.hi,CP=C.p,CD=C.dim;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const cY=s=>cs(CY,s),cT=s=>cs(CT,s),cR=s=>cs(CR,s),cH=s=>cs(CH,s);
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('○',x,y,{size:32,color:C.F,weight:700,anchor:'middle'}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:32,color:CR,weight:700,anchor:'middle'}));
const DY='\\dfrac{'+cY('dy')+'}{d'+cT('t')+'}';
const RULE=DY+'=-k\\,'+cY('y');
const yi=cY('y_i'),yi1=cY('y_{i+1}'),DT='\\Delta '+cT('t');
const STEP=yi1+'\\approx '+yi+'(1-k\\,'+DT+')';
const SOL=cY('y')+'='+cY('y_0')+'\\,e^{-k'+cT('t')+'}';
const ex=t=>100*Math.exp(-0.2*t);
const TH=5*Math.log(2); // 3.466 s

function yt(g=1){return axes({x:100,y:450,w:460,h:340,xmax:4.5,ymax:112,xticks:[1,2,3,4],yticks:[20,40,60,80,100],grid:true,g,xlabel:'時刻 t [s]',ylabel:'量 y [g]',xcolor:CT,ycolor:CY});}
function ytl(g=1){return axes({x:100,y:450,w:480,h:340,xmax:11.5,ymax:112,xticks:[2,4,6,8,10],yticks:[25,50,75,100],grid:true,g,xlabel:'t [s]',ylabel:'量 y [g]',xcolor:CT,ycolor:CY});}
function pts(A,dt,T=4,y0=100,k=0.2){const out=[];let y=y0;const n=Math.round(T/dt);for(let i=0;i<=n;i++){out.push([A.X(i*dt),A.Y(y)]);y*=1-k*dt;}return out;}
const V1=[100,80,64,51.2,40.96],DROP=[20,16,12.8,10.24];
function steps1(A,{p=1,g=1,color=CH,dots=true,upto=4}={}){
 let s=draw(pts(A,1).slice(0,upto+1),p,{color,w:4});
 if(dots)for(let i=0;i<=upto;i++)s+=fade(seg(p,i/(upto+.01)-.05,i/(upto+.01)+.05),dot(A.X(i),A.Y(V1[i]),8,color));
 return fade(g,s);
}
// table for S2
const TX=[700,850,1040],TY0=120,TDY=54;
function tHead(){return label('t [s]',TX[0],TY0,{size:24,color:CT,anchor:'middle',weight:700})+label('y [g]',TX[1],TY0,{size:24,color:CY,anchor:'middle',weight:700})+label('減った量 [g]',TX[2],TY0,{size:24,color:CR,anchor:'middle',weight:700})+line(640,TY0+16,1160,TY0+16,{color:C.faint,w:2});}
function tRow(i,g=1,{hiDrop=0}={}){const y=TY0+TDY*(i+1);
 return fade(g,label(String(i),TX[0],y,{size:26,color:CT,anchor:'middle'})+label(String(V1[i]),TX[1],y,{size:28,color:CY,anchor:'middle',weight:700})
  +(i>0?label('−'+DROP[i-1],TX[2],y,{size:26,color:CR,anchor:'middle',weight:hiDrop?700:400}):'')
  +(i>0?label('×0.8',TX[1]-78,y-TDY/2+6,{size:18,color:CD,anchor:'end'}):''));}
// table for S3
const FX=[690,810,920,1070],FY0=110,FDY=56;
const FROWS=[['1 s','×0.8','4','40.96',CD],['0.5 s','×0.9','8','43.05',CP],['0.25 s','×0.95','16','44.01',CH],['0.01 s','×0.998','400','44.90',CY]];
function fHead(){return label('刻み',FX[0],FY0,{size:24,color:CT,anchor:'middle',weight:700})+label('1−kΔt',FX[1],FY0,{size:24,color:C.ink,anchor:'middle',weight:700})+label('回数',FX[2],FY0,{size:24,color:CD,anchor:'middle',weight:700})+label('4秒後 [g]',FX[3],FY0,{size:24,color:CY,anchor:'middle',weight:700})+line(630,FY0+16,1165,FY0+16,{color:C.faint,w:2});}
function fRow(i,{g=1,last=1,q=false}={}){const r=FROWS[i],y=FY0+FDY*(i+1);
 return fade(g,label(r[0],FX[0],y,{size:26,color:r[4]===CD?CD:r[4],anchor:'middle',weight:700})+label(r[1],FX[1],y,{size:26,color:C.ink,anchor:'middle'})+label(r[2],FX[2],y,{size:26,color:CD,anchor:'middle'})
  +(q?label('？',FX[3],y,{size:30,color:CH,anchor:'middle',weight:700}):fade(last,label(r[3],FX[3],y,{size:28,color:r[4]===CD?C.ink:r[4],anchor:'middle',weight:700}))));}
function ytz(g=1){return axes({x:100,y:450,w:460,h:330,xmin:2,xmax:4.4,ymin:36,ymax:70,xticks:[2,3,4],yticks:[40,50,60,70],grid:true,g,xlabel:'時刻 t [s]',ylabel:'量 y [g]',xcolor:CT,ycolor:CY});}
const zlab=g=>fade(g,label('拡大：t ＝ 2〜4 秒',330,112,{size:22,color:CD,anchor:'middle'}));
function ptsz(A,dt){const n0=Math.round(2/dt);return pts(A,dt).slice(n0);}
function polysz(A,{p1=1,p2=0,p3=0,p4=0,d=[1,0,0,0]}={}){
 const L=[[1,p1,CD],[.5,p2,CP],[.25,p3,CH],[.01,p4,CY]];let s='';
 L.forEach(([dt,pp,col],i)=>{if(pp<=0)return;const P=ptsz(A,dt);s+=draw(P,pp,{color:col,w:i===3?3:4});const e=P[P.length-1];if(d[i])s+=fade(d[i]*seg(pp,.9,1),dot(e[0],e[1],8,col));});
 return s;
}
function polys(A,{p1=1,p2=0,p3=0,p4=0}={}){
 return draw(pts(A,1),p1,{color:CD,w:3})+draw(pts(A,.5),p2,{color:CP,w:3})+draw(pts(A,.25),p3,{color:CH,w:3})+(p4>0?fade(p4,A.plot(ex,{from:0,to:4,color:CY,w:3})):'');
}
// magnified bar of the 4-second value
function zoomBar(vals,g=1,x=600){
 const Y=v=>440-(v-40.5)/(45.5-40.5)*300;
 let s=label('4秒後を 拡大',x,122,{size:22,color:CD,anchor:'middle'})+line(x,Y(40.5),x,Y(45.5),{color:CD,w:2});
 vals.forEach(([v,col,gg,txt])=>s+=fade(gg,line(x-14,Y(v),x+14,Y(v),{color:col,w:4})+label(txt??String(v),x-22,Y(v)+8,{size:22,color:col,anchor:'end',weight:700})));
 return fade(g,s);
}

export const ytUmSde2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=yt(seg(p,0,.15));
  let s=A.svg+steps1(A,{upto:1,p:seg(p,.1,.3)});
  s+=fade(seg(p,.3,.45),draw([[A.X(1),A.Y(80)],[A.X(2),A.Y(64)],[A.X(3),A.Y(51.2)],[A.X(4),A.Y(40.96)]],1,{color:CH,w:3,dash:'8 8'})+label('？',A.X(4)+10,A.Y(41)-14,{size:40,color:CH,weight:700}));
  s+=card(640,110,520,260,label('前回の問い',900,160,{size:24,color:CD,anchor:'middle'})
   +label('一歩を 繰り返すと 4秒後は？',900,230,{size:30,color:CH,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('刻みを 細かくすると 変わる？',900,300,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 [K+'recall']:(p)=>{
  const A=yt();
  let s=A.svg+steps1(A,{upto:1});
  s+=card(640,110,520,280,tex(RULE,900,175,{size:40,auto:false})
   +fade(seg(p,.1,.25),tex(STEP,900,255,{size:40,auto:false}))
   +fade(seg(p,.55,.7),label('100 g → 1秒後 約 80 g',900,335,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'ask']:(p)=>{
  const A=yt();
  let s=fade(.45,A.svg+steps1(A,{upto:1}))+fade(seg(p,.2,.45)*.8,A.plot(ex,{from:0,to:4.3,color:CY,w:3,dash:'10 8'}))+fade(seg(p,.35,.5),label('細かくした先の 曲線？',A.X(1.7),A.Y(78),{size:24,color:CY}));
  s+=card(640,110,520,260,label('今回の問い',900,165,{size:26,color:CD,anchor:'middle'})
   +label('刻みを 細かくした先の 曲線は',900,235,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('どんな式で 書ける？',900,305,{size:34,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 // ===== S2 一歩を繰り返す =====
 [K+'s2']:(p)=>{
  const A=yt();
  let s=A.svg+steps1(A,{upto:1})+draw([[A.X(1),A.Y(80)],[A.X(2),A.Y(64)]],seg(p,.3,.55),{color:CH,w:4})+fade(seg(p,.5,.6),dot(A.X(2),A.Y(64),8,CH));
  s+=fade(seg(p,.35,.55),line(A.X(2),A.Y(80),A.X(2),A.Y(64),{color:CR,w:5}));
  s+=tHead()+tRow(0)+tRow(1)+tRow(2,seg(p,.5,.65));
  s+=fade(seg(p,.15,.35),tex('0.2\\times 80\\times 1=16',900,440,{size:36,auto:false,color:CR}));
  return s;
 },
 [K+'s34']:(p)=>{
  const A=yt();
  let s=A.svg+steps1(A,{upto:2})+draw([[A.X(2),A.Y(64)],[A.X(3),A.Y(51.2)],[A.X(4),A.Y(40.96)]],seg(p,.2,.7),{color:CH,w:4});
  s+=fade(seg(p,.4,.5),dot(A.X(3),A.Y(51.2),8,CH))+fade(seg(p,.65,.75),dot(A.X(4),A.Y(40.96),8,CH)+label('40.96',A.X(4)-10,A.Y(40.96)+32,{size:22,color:CH,weight:700,anchor:'middle'}));
  s+=tHead()+tRow(0)+tRow(1)+tRow(2)+tRow(3,seg(p,.35,.5))+tRow(4,seg(p,.6,.75));
  return s;
 },
 [K+'drops']:(p)=>{
  const A=yt();
  let s=A.svg+steps1(A);
  for(let i=0;i<4;i++)s+=fade(seg(p,.1+i*.1,.2+i*.1),line(A.X(i+1),A.Y(V1[i]),A.X(i+1),A.Y(V1[i+1]),{color:CR,w:6})+label(String(DROP[i]),A.X(i+1)+8,A.Y((V1[i]+V1[i+1])/2)+8,{size:20,color:CR,weight:700}));
  s+=tHead()+[0,1,2,3,4].map(i=>tRow(i,1,{hiDrop:1})).join('');
  s+=highlight(TX[2]-90,TY0+TDY*1.5,180,TDY*4,seg(p,.5,.65),CR);
  s+=fade(seg(p,.6,.75),label('減る幅も 毎回 0.8倍',1000,TY0+TDY*5+62,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'power']:(p)=>{
  const A=yt();
  let s=A.svg+steps1(A)+tHead()+[0,1,2,3,4].map(i=>tRow(i)).join('');
  s+=card(720,TY0+TDY*5+22,440,70,tex(cY('y_i')+'=100\\times 0.8^{\\,i}\\ \\mathrm{g}',940,TY0+TDY*5+62,{size:38,auto:false}),seg(p,.3,.5),CH);
  return s;
 },
 [K+'doubt']:(p)=>{
  const A=yt();
  let s=A.svg+steps1(A)+label('40.96',A.X(4)-10,A.Y(40.96)+32,{size:22,color:CH,weight:700,anchor:'middle'});
  s+=card(640,110,520,280,label('1秒刻み：4秒後 40.96 g',900,170,{size:30,color:CH,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('1秒の間 ずっと',900,245,{size:26,color:C.ink,anchor:'middle'})+label('始めの傾きを 使った',900,285,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('どこまで 正しい？',900,350,{size:32,color:CR,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S3 刻みを細かくする =====
 [K+'half']:(p)=>{
  const A=ytz();
  let s=A.svg+zlab(1)+polysz(A,{p1:1,p2:seg(p,.3,.7),d:[1,0,0,0]});
  s+=fHead()+fRow(0)+fRow(1,{g:seg(p,.1,.25),q:true});
  s+=fade(seg(p,.1,.3),tex('1-0.2\\times 0.5=0.9',900,FY0+FDY*3+30,{size:36,auto:false,color:CP}));
  return s;
 },
 [K+'predict']:(p)=>{
  const A=ytz();
  let s=A.svg+zlab(1)+polysz(A,{p1:1,p2:1,d:[1,0,0,0]});
  s+=fHead()+fRow(0)+fRow(1,{q:true});
  s+=card(660,FY0+FDY*3,480,120,label('40.96 g より',900,FY0+FDY*3+48,{size:28,color:C.ink,anchor:'middle'})+label('大きい？ 小さい？',900,FY0+FDY*3+94,{size:32,color:CH,anchor:'middle',weight:700}),seg(p,.1,.25),CH);
  return s;
 },
 [K+'half2']:(p)=>{
  const A=ytz();
  let s=A.svg+zlab(1)+polysz(A,{p1:1,p2:1,d:[1,0,0,0]});
  s+=fade(seg(p,.3,.45),dot(A.X(4),A.Y(43.05),9,CP)+label('43.05',A.X(4)+14,A.Y(43.05)-6,{size:22,color:CP,weight:700}))+label('40.96',A.X(4)+14,A.Y(40.96)+14,{size:22,color:C.ink,weight:700});
  s+=fHead()+fRow(0)+fRow(1,{last:seg(p,.3,.45)});
  s+=fade(seg(p,.05,.25),tex('100\\times 0.9^{8}\\approx 43.05',900,FY0+FDY*3+30,{size:38,auto:false,color:CP}));
  s+=fade(seg(p,.6,.75),label('1秒刻みより 大きい',900,FY0+FDY*3+95,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'finer']:(p)=>{
  const A=ytz();
  let s=A.svg+zlab(1)+polysz(A,{p1:1,p2:1,p3:seg(p,.05,.35),p4:seg(p,.55,.75),d:[1,1,1,1]});
  s+=fHead()+fRow(0)+fRow(1)+fRow(2,{g:seg(p,.05,.2)})+fRow(3,{g:seg(p,.55,.7)});
  return s;
 },
 [K+'why']:(p)=>{
  const A=axes({x:100,y:450,w:460,h:340,xmin:.4,xmax:1.12,ymin:78,ymax:93,xticks:[.5,1],yticks:[80,85,90],grid:true,xlabel:'t [s]',ylabel:'量 y [g]',xcolor:CT,ycolor:CY});
  let s=A.svg+label('拡大：t ＝ 0.4〜1 秒',330,112,{size:22,color:CD,anchor:'middle'})+A.plot(ex,{from:.4,to:1.1,color:CY,w:3,dash:'10 8'});
  s+=line(A.X(.4),A.Y(92),A.X(1),A.Y(80),{color:CD,w:4})+dot(A.X(1),A.Y(80),8,CD)+label('80（1 s）',A.X(1)+14,A.Y(80)+14,{size:22,color:C.ink,weight:700});
  s+=draw([[A.X(.5),A.Y(90)],[A.X(1),A.Y(81)]],seg(p,.4,.7),{color:CP,w:4})+fade(seg(p,.45,.55),dot(A.X(.5),A.Y(90),8,CP))+fade(seg(p,.65,.75),dot(A.X(1),A.Y(81),8,CP)+label('81（0.5 s）',A.X(1)+14,A.Y(81)-6,{size:22,color:CP,weight:700}));
  s+=fade(seg(p,.5,.65),ring(A.X(.5),A.Y(90),18,{color:CH,w:3})+label('傾きを 直す',A.X(.5)+24,A.Y(90)-22,{size:22,color:CH}));
  s+=card(640,110,520,280,label('粗い刻み',900,165,{size:26,color:CD,anchor:'middle'})
   +label('始めの 急な傾きのまま → 減らしすぎ',900,215,{size:24,color:CR,anchor:'middle'})
   +fade(seg(p,.5,.65),label('細かい刻み',900,285,{size:26,color:CP,anchor:'middle'})+label('途中で 傾きを こまめに 直す',900,335,{size:26,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'settle']:(p)=>{
  let s=zoomBar([[40.96,CD,1],[43.05,CP,1],[44.01,CH,1],[44.9,CY,seg(p,.5,.65),'44.90']],1,300);
  s+=card(460,110,700,300,label('上がり方',810,165,{size:26,color:CD,anchor:'middle'})
   +label('1 s → 0.5 s：＋2.09',810,230,{size:30,color:CP,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),label('0.5 s → 0.25 s：＋0.96',810,285,{size:30,color:CH,anchor:'middle',weight:700}))
   +fade(seg(p,.3,.45),label('刻みが半分 → 上がり方も ほぼ半分',810,350,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  s+=fade(seg(p,.65,.8),label('→ ある一つの値に 落ち着く',810,470,{size:32,color:CY,anchor:'middle',weight:700}));
  return s;
 },
 [K+'integral']:(p)=>{
  const n=[4,8,16][Math.min(2,Math.floor(seg(p,.1,.9)*3))];
  const A=axes({x:100,y:430,w:420,h:280,xmax:4.4,ymax:9,xticks:[],yticks:[],g:1,xlabel:'',ylabel:''});
  let s=A.svg;const f=x=>2*x;
  for(let i=0;i<n;i++){const x0=4*i/n,w=4/n;s+=rect(A.X(x0),A.Y(f(x0)),A.X(x0+w)-A.X(x0),A.Y(0)-A.Y(f(x0)),{fill:C.x,fo:.3,stroke:C.x,sw:1.5,rx:0});}
  s+=A.plot(f,{from:0,to:4,color:C.x,w:3})+label('積分の回：n ＝ '+n,A.X(2),A.Y(9)-10,{size:26,color:C.x,anchor:'middle',weight:700});
  s+=card(620,110,540,300,label('短冊の本数 n を 増やす',890,170,{size:28,color:C.x,anchor:'middle'})+label('→ 和が 一つの値に 近づく',890,215,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('刻みを 細かくする',890,290,{size:28,color:CY,anchor:'middle'})+label('→ 値が 一つの値に 落ち着く',890,335,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('同じ構図',890,390,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S4 曲線と半分になる時間 =====
 [K+'curve']:(p)=>{
  const A=yt();
  let s=A.svg+polys(A,{p1:1,p2:1,p3:1})+A.plot(ex,{from:0,to:4.3,p:seg(p,.3,.7),color:CY,w:5});
  s+=card(640,110,520,230,label('細かい刻みの 折れ線',900,170,{size:28,color:C.ink,anchor:'middle'})
   +label('→ 1本の 曲線に 近づく',900,220,{size:30,color:CY,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('はじめ急、次第に なだらか',900,290,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'curve2']:(p)=>{
  const A=yt();
  let s=A.svg+A.plot(ex,{from:0,to:4.3,color:CY,w:5});
  const tan=(t0,d)=>line(A.X(t0-d),A.Y(ex(t0)*(1+0.2*d)),A.X(t0+d),A.Y(ex(t0)*(1-0.2*d)),{color:CR,w:4});
  s+=fade(seg(p,.05,.2),tan(0.05,.5)+label('多い → 速く減る',A.X(1.0),A.Y(104),{size:24,color:CR,weight:700}));
  s+=fade(seg(p,.3,.45),tan(3.5,.6)+label('少ない → ゆっくり',A.X(2.6),A.Y(ex(3.5))+50,{size:24,color:CR,weight:700}));
  s+=card(640,110,520,200,tex(RULE,900,180,{size:44,auto:false})+fade(seg(p,.55,.7),label('文のとおりの 形',900,270,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'h1']:(p)=>{
  const A=ytl(seg(p,0,.12));
  let s=A.svg+A.plot(ex,{from:0,to:11.3,p:seg(p,.05,.3),color:CY,w:4});
  s+=fade(seg(p,.3,.45),line(A.X(0),A.Y(50),A.X(TH),A.Y(50),{color:CH,w:2,dash:'6 6'})+line(A.X(TH),A.Y(0),A.X(TH),A.Y(50),{color:CH,w:2,dash:'6 6'})+dot(A.X(TH),A.Y(50),8,CH));
  s+=fade(seg(p,.55,.7),brace(A.X(0),A.X(TH),A.Y(50)+8,{dir:1,color:CT,text:'約 3.5 s',size:24}));
  s+=card(640,110,520,200,label('100 g → 50 g',900,180,{size:32,color:CY,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('約 3.5 秒',900,250,{size:34,color:CT,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'h2q']:(p)=>{
  const A=ytl();
  let s=A.svg+A.plot(ex,{from:0,to:11.3,color:CY,w:4})+line(A.X(0),A.Y(50),A.X(TH),A.Y(50),{color:CH,w:2,dash:'6 6'})+dot(A.X(TH),A.Y(50),8,CH)+brace(A.X(0),A.X(TH),A.Y(50)+8,{dir:1,color:CT,text:'約 3.5 s',size:24});
  s+=fade(seg(p,.2,.4),line(A.X(0),A.Y(25),A.X(2*TH),A.Y(25),{color:CH,w:2,dash:'6 6'})+dot(A.X(2*TH),A.Y(25),8,CH)+label('？',A.X(1.5*TH),A.Y(25)-40,{size:36,color:CH,weight:700,anchor:'middle'}));
  s+=card(640,110,520,200,label('50 g → 25 g',900,180,{size:32,color:CY,anchor:'middle',weight:700})+fade(seg(p,.3,.45),label('何秒？',900,250,{size:34,color:CH,anchor:'middle',weight:700})),1,CH);
  return s;
 },
 [K+'h2']:(p)=>{
  const A=ytl();
  let s=A.svg+A.plot(ex,{from:0,to:11.3,color:CY,w:4})+line(A.X(0),A.Y(50),A.X(TH),A.Y(50),{color:CH,w:2,dash:'6 6'})+dot(A.X(TH),A.Y(50),8,CH)+brace(A.X(0),A.X(TH),A.Y(50)+8,{dir:1,color:CT,text:'約 3.5 s',size:24});
  s+=line(A.X(0),A.Y(25),A.X(2*TH),A.Y(25),{color:CH,w:2,dash:'6 6'})+dot(A.X(2*TH),A.Y(25),8,CH);
  s+=fade(seg(p,.05,.2),brace(A.X(TH),A.X(2*TH),A.Y(25)+8,{dir:1,color:CT,text:'約 3.5 s',size:24}));
  s+=card(640,110,520,260,label('50 g → 25 g も 約 3.5 秒',900,175,{size:30,color:CT,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('量が半分でも、減る割合 k は同じ',900,245,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('→ 半分になる時間は 変わらない',900,305,{size:28,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'h3']:(p)=>{
  const A=ytl();
  let s=A.svg+A.plot(ex,{from:0,to:11.3,color:CY,w:4});
  [[50,0],[25,1],[12.5,2]].forEach(([v,i])=>{const g=i<2?1:seg(p,.05,.2);s+=fade(g,line(A.X(i<2?0:i*TH),A.Y(v),A.X((i+1)*TH),A.Y(v),{color:CH,w:2,dash:'6 6'})+dot(A.X((i+1)*TH),A.Y(v),8,CH)+brace(A.X(i*TH),A.X((i+1)*TH),A.Y(v)+8,{dir:1,color:CT,text:i<2?'約 3.5 s':'',size:22}));});
  s+=card(640,110,520,220,label('25 g → 12.5 g も 約 3.5 秒',900,175,{size:28,color:CT,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('半減期',900,260,{size:44,color:CH,anchor:'middle',weight:700})),seg(p,0,.12),CH);
  return s;
 },
 [K+'hconst']:(p)=>{
  const A=ytl();
  let s=A.svg+A.plot(ex,{from:0,to:11.3,color:CY,w:3})+fade(.6,label('比例',A.X(8),A.Y(ex(8))-14,{size:22,color:CY}));
  s+=draw([[A.X(0),A.Y(100)],[A.X(5),A.Y(0)]],seg(p,.1,.35),{color:CD,w:4})+fade(seg(p,.3,.4),label('一定 20 g/s',A.X(5.3),A.Y(9),{size:22,color:C.ink,weight:700}));
  s+=fade(seg(p,.4,.55),dot(A.X(2.5),A.Y(50),8,C.ink)+line(A.X(2.5),A.Y(0),A.X(2.5),A.Y(50),{color:CD,w:2,dash:'5 5'})+line(A.X(0),A.Y(50),A.X(2.5),A.Y(50),{color:CD,w:2,dash:'5 5'})+brace(A.X(0),A.X(2.5),A.Y(50)+8,{dir:1,color:C.ink,text:'2.5 s',size:22}));
  s+=fade(seg(p,.6,.75),dot(A.X(3.75),A.Y(25),8,C.ink)+line(A.X(3.75),A.Y(0),A.X(3.75),A.Y(25),{color:CD,w:2,dash:'5 5'})+line(A.X(0),A.Y(25),A.X(3.75),A.Y(25),{color:CD,w:2,dash:'5 5'})+brace(A.X(2.5),A.X(3.75),A.Y(25)+8,{dir:1,color:CR,text:'1.25 s',size:22}));
  s+=card(640,110,520,230,label('一定の 20 g/s ずつ',900,165,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('100 → 50：2.5 秒',900,225,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('50 → 25：1.25 秒 → 縮む',900,280,{size:28,color:CR,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S5 行き先の式 =====
 [K+'exp']:(p)=>{
  let s=label('同じ割合を 掛け続けた 行き先 ＝ 指数関数',600,90,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.5),tex(SOL,600,240,{size:100,auto:false}));
  s+=fade(seg(p,.6,.75),label('出発の値',612,385,{size:26,color:CY,anchor:'middle'})+label('e ≈ 2.718',690,435,{size:26,color:CH,anchor:'middle'}));
  return s;
 },
 [K+'e']:(p)=>{
  let s=tex(SOL,600,110,{size:64,auto:false});
  s+=fade(seg(p,.05,.2),label('e ＝ 2.718…（初級で見た数）',600,210,{size:30,color:CH,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),tex(cT('t')+'=0:\\quad e^{0}=1',600,300,{size:48,auto:false}));
  s+=fade(seg(p,.65,.8),tex(cY('y')+'='+cY('y_0'),600,395,{size:52,auto:false})+label('出発の値',760,405,{size:28,color:CY}));
  return s;
 },
 [K+'check']:(p)=>{
  const A=yt();
  let s=A.svg+polys(A,{p1:1,p2:1,p3:1})+A.plot(ex,{from:0,to:4.3,color:CY,w:5});
  s+=fade(seg(p,.4,.55),dot(A.X(4),A.Y(44.93),10,CY)+label('44.93',A.X(4)+14,A.Y(44.93)+30,{size:22,color:CY,weight:700}));
  s+=card(640,110,520,280,tex('100\\,e^{-0.2\\times 4}',900,175,{size:44,auto:false})
   +fade(seg(p,.3,.45),tex('=100\\,e^{-0.8}\\approx 44.93',900,250,{size:40,auto:false,color:CY}))
   +fade(seg(p,.6,.75),label('刻みの行き先 44.90 などと 一致',900,335,{size:26,color:C.F,anchor:'middle',weight:700})),seg(p,0,.12),CH);
  return s;
 },
 [K+'one']:(p)=>{
  const A=axes({x:100,y:450,w:460,h:340,xmax:1.25,ymin:76,ymax:101.5,xticks:[.5,1],yticks:[80,85,90,95,100],grid:true,xlabel:'t [s]',ylabel:'量 y [g]',xcolor:CT,ycolor:CY});
  let s=A.svg+A.plot(ex,{from:0,to:1.2,color:CY,w:4})+line(A.X(0),A.Y(100),A.X(1),A.Y(80),{color:CD,w:3})+dot(A.X(1),A.Y(80),8,CD)+label('80',A.X(1)-12,A.Y(80)+26,{size:22,color:CD,weight:700,anchor:'end'});
  s+=fade(seg(p,.2,.35),dot(A.X(1),A.Y(81.87),9,CY)+label('81.9',A.X(1)+12,A.Y(81.87)-4,{size:22,color:CY,weight:700}));
  s+=card(640,110,520,280,tex('100\\,e^{-0.2}\\approx 81.9\\ \\mathrm{g}',900,180,{size:42,auto:false,color:CY})
   +fade(seg(p,.4,.55),label('1秒で 減るのは 約 18％',900,260,{size:30,color:CR,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('「2割」は 目安',900,330,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'halfcalc']:(p)=>{
  const A=ytl();
  let s=A.svg+A.plot(ex,{from:0,to:11.3,color:CY,w:4})+line(A.X(0),A.Y(50),A.X(TH),A.Y(50),{color:CH,w:2,dash:'6 6'})+line(A.X(TH),A.Y(0),A.X(TH),A.Y(50),{color:CH,w:2,dash:'6 6'})+dot(A.X(TH),A.Y(50),8,CH);
  s+=card(640,110,520,290,label('半分になる 時間 T',900,160,{size:26,color:CD,anchor:'middle'})
   +tex('e^{-0.2\\,T}=\\tfrac{1}{2}',900,235,{size:46,auto:false})
   +fade(seg(p,.35,.5),tex('T\\approx 3.47\\ \\mathrm{s}',900,315,{size:44,auto:false,color:CT}))
   +fade(seg(p,.6,.75),label('グラフの 約 3.5 秒 と 合う',900,370,{size:24,color:C.F,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'later']:(p)=>{
  let s=tex(SOL,600,110,{size:64,auto:false});
  s+=card(200,190,800,250,label('導き方',600,245,{size:26,color:CD,anchor:'middle'})+label('上級で 扱う',600,295,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('ここでは：刻みを 細かくした 行き先 として',600,360,{size:26,color:CH,anchor:'middle'})+label('数値で 確かめた',600,405,{size:26,color:CH,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S6 出発点と k の単位 =====
 [K+'family']:(p)=>{
  const A=axes({x:120,y:450,w:450,h:340,xmin:-1.3,xmax:1.35,ymin:0,ymax:3.6,xticks:[-1,1],yticks:[1,2,3],grid:true,xlabel:'t',ylabel:'y',xcolor:CT,ycolor:CY});
  let s=A.svg;[.5,1,2,3].forEach((c,i)=>s+=A.plot(t=>c*Math.exp(t),{from:-1.3,to:Math.min(1.27,Math.log(3.5/c)),p:seg(p,.05+i*.08,.3+i*.08),color:c===1&&p>.6?CH:CY,w:c===1&&p>.6?5:3}));
  s+=fade(seg(p,.6,.75),dot(A.X(0),A.Y(1),9,CH)+label('y(0) ＝ 1',A.X(0)+14,A.Y(1)+30,{size:22,color:CH,weight:700}));
  s+=card(640,110,520,260,label('初級の確認',900,160,{size:24,color:CD,anchor:'middle'})+tex(DY+'='+cY('y'),900,225,{size:40,auto:false})
   +fade(seg(p,.2,.35),tex(cY('y')+'=C\\,e^{'+cT('t')+'}',900,295,{size:40,auto:false})+label('C は 何でも 解',900,345,{size:24,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  s+=fade(seg(p,.7,.85),label('出発の値で 1本に 決まる',900,430,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'family2']:(p)=>{
  const A=axes({x:100,y:450,w:480,h:340,xmax:8.5,ymax:165,xticks:[2,4,6,8],yticks:[50,100,150],grid:true,xlabel:'t [s]',ylabel:'量 y [g]',xcolor:CT,ycolor:CY});
  const pick=seg(p,.55,.7);let s=A.svg;
  [50,100,150].forEach((c,i)=>{const isP=c===100;s+=fade(isP?1:1-.6*pick,A.plot(t=>c*Math.exp(-0.2*t),{from:0,to:8.3,p:seg(p,.05+i*.1,.3+i*.1),color:isP&&pick>.5?CH:CY,w:isP&&pick>.5?5:3})+fade(seg(p,.1+i*.1,.25+i*.1),dot(A.X(0),A.Y(c),8,CY)+label(String(c),A.X(0)+12,A.Y(c)-10,{size:22,color:CY})));});
  s+=card(640,110,520,260,tex(RULE,900,175,{size:40,auto:false})
   +label('y₀ ＝ 50、100、150 g … どれも 満たす',900,250,{size:24,color:C.ink,anchor:'middle'})
   +fade(pick,label('y₀ を 決めて 1本',900,320,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'dimless']:(p)=>{
  let s=tex('e^{\\,\\square}',600,150,{size:110,auto:false});
  s+=fade(seg(p,.1,.25),label('指数 □ ＝ −kt',600,265,{size:34,color:CT,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('単位のない 数 でなければならない',600,340,{size:32,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),tex('e^{\\,2\\,\\mathrm{s}}',470,440,{size:50,auto:false,color:CD})+ng(560,450)+label('「e の 2秒乗」は 意味を持たない',790,448,{size:24,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'dimless2']:(p)=>{
  let s=tex('[k]\\times\\mathrm{s}=1',600,120,{size:56,auto:false});
  s+=label('kt が 単位なし（t の単位は s）',600,200,{size:26,color:CD,anchor:'middle'});
  s+=fade(seg(p,.2,.35),tex('[k]=\\mathrm{1/s}',600,290,{size:60,auto:false,color:CH}));
  s+=fade(seg(p,.5,.65),card(200,350,800,110,label('前回：g/s ＝ [k] × g から 1/s',600,400,{size:28,color:C.ink,anchor:'middle'})+label('一致',600,440,{size:28,color:C.F,anchor:'middle',weight:700}),1,C.F));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(200,90,800,320,label('確かめ',600,145,{size:26,color:CD,anchor:'middle'})
   +tex('k=0.2\\ \\mathrm{/s},\\quad '+cY('y_0')+'=10\\ \\mathrm{g}',600,225,{size:44,auto:false})
   +fade(seg(p,.4,.55),label('5 g になるのは 約 何秒後？',600,325,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,0,.15),CH);
  return s;
 },
 [K+'quizA']:(p)=>{
  const A=axes({x:100,y:450,w:480,h:340,xmax:8.5,ymax:11.5,xticks:[2,4,6,8],yticks:[5,10],grid:true,xlabel:'t [s]',ylabel:'量 y [g]',xcolor:CT,ycolor:CY});
  const f=t=>10*Math.exp(-0.2*t);
  let s=A.svg+A.plot(f,{from:0,to:8.3,color:CY,w:4})+dot(A.X(0),A.Y(10),8,CY);
  s+=fade(seg(p,.05,.2),line(A.X(0),A.Y(5),A.X(TH),A.Y(5),{color:CH,w:2,dash:'6 6'})+dot(A.X(TH),A.Y(5),8,CH)+brace(A.X(0),A.X(TH),A.Y(5)+8,{dir:1,color:CT,text:'約 3.5 s',size:24}));
  s+=card(640,110,520,230,label('約 3.5 秒',900,180,{size:40,color:CT,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('出発の量に よらない',900,250,{size:28,color:C.ink,anchor:'middle'})+label('k だけで 決まる',900,300,{size:30,color:CH,anchor:'middle',weight:700})),seg(p,0,.12),CH);
  return s;
 },
 // ===== S7 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=label('まとめ',600,75,{size:30,color:CD,anchor:'middle'});
  s+=card(120,100,960,180,label('一歩を 繰り返す → 0.8倍ずつの 折れ線',600,165,{size:30,color:CH,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('刻みを 細かく → 値が上がり 1本の曲線に 落ち着く',600,230,{size:28,color:CY,anchor:'middle'})),seg(p,0,.15),CH);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=label('まとめ',600,75,{size:30,color:CD,anchor:'middle'});
  s+=card(120,100,960,180,label('一歩を 繰り返す → 0.8倍ずつの 折れ線',600,165,{size:30,color:CH,anchor:'middle',weight:700})
   +label('刻みを 細かく → 値が上がり 1本の曲線に 落ち着く',600,230,{size:28,color:CY,anchor:'middle'}),1,CH);
  s+=card(120,300,960,190,tex(SOL,380,385,{size:54,auto:false})
   +label('半分になる時間は いつも同じ',820,365,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('k ＝ 0.2 /s で 約 3.5 秒',820,420,{size:30,color:CT,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'nextq']:(p)=>{
  const u=Math.sin(p*Math.PI*4)*seg(p,.1,.3),bx=500+110*u;
  let s=wall(170,250,390)+spring(170,bx-60,340)+block(bx,390,120,100,{color:C.x})+line(170,392,860,392,{color:CD,w:3});
  s+=line(500,400,500,420,{color:CD,w:2})+label('0',500,448,{size:22,color:CD,anchor:'middle'});
  s+=card(640,90,530,200,label('次の問い：2階の方程式',905,135,{size:24,color:CD,anchor:'middle'})
   +tex('\\dfrac{d^2x}{dt^2}=-\\omega^2x',905,215,{size:44}),seg(p,.15,.3),CH);
  s+=fade(seg(p,.55,.7),label('解の確かめと 出発点の指定は？',905,340,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
};
