// YouTube シリーズ 運動方程式・初級 2/2（ステージ ui-newton-small-step 本4〜本9）— 図。Stage 1200×515.
// 色：位置・距離 x 水色、速度 v 紫、加速度 a 赤、力 F 緑、時刻 t 金、強調 黄。
// 表の区間 ①〜④ と v–t グラフの台形 ①〜④ は同じ番号で対応（今話している区間は黄）。
// 数値：v＝0,1,2,3,4（0〜2.0 s）、Δx＝0.25,0.75,1.25,1.75、x＝0.25,1.00,2.25,4.00＝t²。力を止めると v＝4、2.5 s で x＝6.00。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,arrow,brace,highlight,axes,tex,ground,block,poly,draw} from './anim.mjs';

const K='ui-newton-small-step-2:';
const BX='#9fb2d4';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:30,color:C.F,weight:700,anchor:'middle'}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:30,color:C.a,weight:700,anchor:'middle'}));
const cH=s=>`{\\color{${C.hi}}{${s}}}`;

const T=[0,.5,1,1.5,2,2.5],V=[0,1,2,3,4,4],DX=[.25,.75,1.25,1.75,2],X=[0,.25,1,2.25,4,6];
const TS=['0','0.5','1.0','1.5','2.0','2.5'],DXS=['0.25','0.75','1.25','1.75','2.00'],XS=['0','0.25','1.00','2.25','4.00','6.00'];
const NUM=['①','②','③','④','⑤'];

// ---- table on the left: columns t, v, (Δx), x ----------------------------------------------
const CX={t:95,v:200,dx:320,x:430},TY0=110,TDY=58;
const rowY=i=>TY0+TDY*(i+1);
function tHead({dx=0,x=0,g=1}={}){
 return fade(g,label('t [s]',CX.t,TY0,{size:24,color:C.t,anchor:'middle',weight:700})+label('v [m/s]',CX.v,TY0,{size:24,color:C.v,anchor:'middle',weight:700})
  +fade(dx,label('区間の距離',CX.dx,TY0-4,{size:22,color:C.x,anchor:'middle',weight:700}))+fade(x,label('x [m]',CX.x,TY0,{size:24,color:C.x,anchor:'middle',weight:700}))
  +line(40,TY0+16,480,TY0+16,{color:C.faint,w:2}));
}
// opts: t[i], v[i], vq (show '？' in v col at index), dx[i] (interval i between rows i and i+1), x[i], hi (interval index highlighted), plus (show +1 marks)
function table({n=5,tg=[],vg=[],dxg=[],xg=[],vq=-1,xq=[],hi=-1,plus=[],dxHead=0,xHead=0}={}){
 let s=tHead({dx:dxHead,x:xHead});
 for(let i=0;i<n;i++){const y=rowY(i);
  s+=fade(tg[i]??1,label(TS[i],CX.t,y,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(vg[i]??0,label(i===vq?'？':String(V[i]),CX.v,y,{size:28,color:i===vq?C.hi:C.v,anchor:'middle',weight:700}));
  if(xq.includes(i))s+=label('？',CX.x,y,{size:28,color:C.x,anchor:'middle',weight:700});
  s+=fade(xg[i]??0,label(XS[i],CX.x,y,{size:28,color:C.x,anchor:'middle',weight:700}));
  if(i>0)s+=fade(plus[i]??0,label(i>=5?'＋0':'＋1',CX.v+28,y-TDY/2+8,{size:22,color:C.a,weight:700}));
  if(i<n-1){const g=dxg[i]??0,col=i===hi?C.hi:C.x;s+=fade(g,label(NUM[i]+' '+DXS[i],CX.dx,y+TDY/2+8,{size:24,color:col,anchor:'middle',weight:700}));}
 }
 if(hi>=0)s+=highlight(40,rowY(hi)-34,445,TDY+50,1);
 return s;
}

// ---- v–t graph on the right ----------------------------------------------------------------
function vAx(g=1,{xmax=2.35}={}){return axes({x:600,y:450,w:480,h:310,xmax,ymax:4.7,xticks:xmax>2.4?[0.5,1,1.5,2,2.5]:[0.5,1,1.5,2],yticks:[1,2,3,4],grid:true,g,xlabel:'t [s]',ylabel:'v [m/s]',xcolor:C.t,ycolor:C.v});}
function vPts(A,n,{g=1,upto=4}={}){let s='';for(let i=0;i<=Math.min(n,upto+1)-1;i++)s+=dot(A.X(T[i]),A.Y(V[i]),8,C.v);return fade(g,s);}
function vLine(A,p=1,{to=2}={}){return A.plot(t=>t<=2?2*t:4,{from:0,to,p,color:C.v,w:4});}
function trap(A,i,{g=1,col=C.x,fo=.28,num=1}={}){const t0=T[i],t1=T[i+1],v0=V[i],v1=V[i+1];
 return fade(g,poly([[A.X(t0),A.Y(0)],[A.X(t0),A.Y(v0)],[A.X(t1),A.Y(v1)],[A.X(t1),A.Y(0)]],{fill:col,fo,stroke:col,sw:2})
  +(num?label(NUM[i],A.X((t0+t1)/2),A.Y(0)-14,{size:24,color:col,anchor:'middle',weight:700}):''));}
// ---- x–t graph -------------------------------------------------------------------------------
function xAx(g=1,{xmax=2.35,ymax=4.6}={}){return axes({x:600,y:450,w:480,h:310,xmax,ymax,xticks:xmax>2.4?[0.5,1,1.5,2,2.5]:[0.5,1,1.5,2],yticks:ymax>5?[1,2,3,4,5,6]:[1,2,3,4],grid:true,g,xlabel:'t [s]',ylabel:'x [m]',xcolor:C.t,ycolor:C.x});}
// box helpers
function box(x,y,{w=120,h=90,text='2 kg',g=1}={}){return fade(g,block(x,y,w,h,{color:BX,text,size:26,fo:.25}));}
function fArrow(x,y,N,{g=1,text=''}={}){const X=x+N*40;return fade(g,arrow(x,y,X,y,{color:C.F,w:6,head:18})+(text?label(text,X+12,y+9,{size:26,color:C.F,weight:700}):''));}

export const ytUiNewton2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=fade(seg(p,0,.15),ground(60,560,380)+box(260,380)+fArrow(320,335,4,{text:'4 N'}));
  s+=card(620,80,520,150,tex('a=\\dfrac{4}{2}=2\\,\\mathrm{m/s^2}',880,155,{size:46}),seg(p,.15,.35));
  s+=fade(seg(p,.6,.75),card(620,280,520,110,label('決めるのは 今の 加速度',880,345,{size:32,color:C.a,anchor:'middle',weight:700}),1,C.a));
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=ground(60,560,380)+box(260,380)+fArrow(320,335,4,{text:'4 N'});
  s+=card(620,80,520,150,tex('a=\\dfrac{4}{2}=2\\,\\mathrm{m/s^2}',880,155,{size:46}),1);
  s+=card(620,280,520,130,tex('\\Delta v=2\\times0.5=1\\,\\mathrm{m/s}',880,345,{size:42}),seg(p,.1,.3),C.v);
  s+=fade(seg(p,.5,.65),label('0.5 秒ごと',880,450,{size:28,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=table({vg:[1,1,0,0,0],xq:[0,1,2,3,4],xHead:1,vq:-1});
  s+=fade(1,[2,3,4].map(i=>label('？',CX.v,rowY(i),{size:28,color:C.v,anchor:'middle',weight:700})).join(''));
  s+=card(600,130,540,200,label('今回の問い',870,185,{size:26,color:C.dim,anchor:'middle'})+label('積み上げると、',870,245,{size:32,color:C.ink,anchor:'middle',weight:700})+label('速度と 位置は？',870,300,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'init']:(p)=>{
  const ox=300,y=360;
  let s=ground(60,1140,y)+box(ox,y);
  s+=line(ox,y-150,ox,y+20,{color:C.x,w:2,dash:'7 7'})+label('x ＝ 0',ox,y+52,{size:26,color:C.x,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),label('t ＝ 0 で 静止：v ＝ 0',ox,y-170,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),card(640,90,480,160,label('初期条件',880,150,{size:34,color:C.hi,anchor:'middle',weight:700})+label('t ＝ 0 の v と x',880,210,{size:28,color:C.ink,anchor:'middle'}),1,C.hi));
  return s;
 },
 // ===== S2 速度を表に積み上げる =====
 [K+'t0']:(p)=>table({n:5,tg:[1,seg(p,.1,.3),seg(p,.1,.3),seg(p,.1,.3),seg(p,.1,.3)],vg:[seg(p,.6,.75)]})+fade(seg(p,.2,.35),card(600,130,540,160,tex('\\Delta v=1\\,\\mathrm{m/s}',870,190,{size:40})+label('0.5 秒ごとの 増え分',870,255,{size:26,color:C.dim,anchor:'middle'}),1)),
 [K+'t1']:(p)=>{
  let s=table({vg:[1,seg(p,.5,.65)],plus:[0,seg(p,.3,.45)]});
  s+=card(600,130,540,160,tex('\\Delta v=1\\,\\mathrm{m/s}',870,190,{size:40})+label('0.5 秒ごとの 増え分',870,255,{size:26,color:C.dim,anchor:'middle'}),1);
  s+=fade(seg(p,.3,.5),tex('0+1=1',870,380,{size:44}));
  return s;
 },
 [K+'t2']:(p)=>{
  let s=table({vg:[1,1,seg(p,.1,.25),seg(p,.55,.7)],plus:[0,1,seg(p,.05,.2),seg(p,.5,.65)]});
  s+=card(600,130,540,160,tex('\\Delta v=1\\,\\mathrm{m/s}',870,190,{size:40})+label('0.5 秒ごとの 増え分',870,255,{size:26,color:C.dim,anchor:'middle'}),1);
  s+=fade(seg(p,.05,.2)*(1-seg(p,.45,.5)),tex('1+1=2',870,380,{size:44}))+fade(seg(p,.5,.65),tex('2+1=3',870,380,{size:44}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=table({vg:[1,1,1,1,1],vq:4,plus:[0,1,1,1,1]});
  s+=card(600,130,540,160,tex('\\Delta v=1\\,\\mathrm{m/s}',870,190,{size:40})+label('0.5 秒ごとの 増え分',870,255,{size:26,color:C.dim,anchor:'middle'}),1);
  s+=highlight(40,rowY(4)-36,445,52,seg(p,.1,.3));
  return s;
 },
 [K+'t4']:(p)=>{
  let s=table({vg:[1,1,1,1,seg(p,.05,.2)],plus:[0,1,1,1,1]});
  s+=card(600,130,540,160,tex('\\Delta v=1\\,\\mathrm{m/s}',870,190,{size:40})+label('0.5 秒ごとの 増え分',870,255,{size:26,color:C.dim,anchor:'middle'}),1);
  s+=fade(seg(p,.05,.2),tex('3+1=4',870,380,{size:44}));
  s+=fade(seg(p,.5,.7),label('毎回 同じ ＋1',870,460,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'approx']:(p)=>{
  let s=table({vg:[1,1,1,1,1],plus:[0,1,1,1,1]});
  s+=card(600,70,540,250,label('微分方程式の回',870,115,{size:26,color:C.dim,anchor:'middle'})+tex('\\dfrac{dv}{dt}=-0.1\\,v',870,180,{size:38})
   +label('100 → 90 → 81 → 72.9',870,250,{size:28,color:C.v,anchor:'middle',weight:700})+fade(seg(p,.3,.45),label('≈ 近似',870,300,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  s+=fade(seg(p,.6,.75),label('刻みの中で 減る速さも 変わった',870,380,{size:26,color:C.a,anchor:'middle'}));
  return s;
 },
 [K+'exact']:(p)=>{
  let s=table({vg:[1,1,1,1,1],plus:[0,1,1,1,1]});
  const A=axes({x:620,y:330,w:440,h:200,xmax:2.3,ymax:3,xticks:[0.5,1,1.5,2],yticks:[2],grid:true,g:seg(p,0,.15),xlabel:'t [s]',ylabel:'a [m/s²]',xcolor:C.t,ycolor:C.a});
  s+=A.svg+A.plot(()=>2,{from:0,to:2,p:seg(p,.1,.35),color:C.a,w:5});
  s+=fade(seg(p,.3,.45),label('刻みの中でも ずっと 2',A.X(1),A.Y(2)-22,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),card(640,400,460,90,label('近似 ではなく ちょうど（＝）',870,455,{size:28,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 // ===== S3 速度のグラフ =====
 [K+'plot']:(p)=>{
  let s=table({vg:[1,1,1,1,1]});
  const A=vAx(seg(p,0,.2));s+=A.svg;
  for(let i=0;i<5;i++){const g=seg(p,.3+.1*i,.38+.1*i);s+=fade(g,dot(A.X(T[i]),A.Y(V[i]),8,C.v))+highlight(40,rowY(i)-36,445,52,g*(1-seg(p,.4+.1*i,.46+.1*i)));}
  return s;
 },
 [K+'line']:(p)=>{
  let s=table({vg:[1,1,1,1,1],plus:[0,1,1,1,1]});
  const A=vAx();s+=A.svg+vPts(A,5)+vLine(A,seg(p,.05,.4));
  for(let i=0;i<4;i++){const g=seg(p,.45+.1*i,.55+.1*i);s+=fade(g,line(A.X(T[i]),A.Y(V[i]),A.X(T[i+1]),A.Y(V[i]),{color:C.t,w:3,dash:'6 5'})+line(A.X(T[i+1]),A.Y(V[i]),A.X(T[i+1]),A.Y(V[i+1]),{color:C.a,w:3})+label('＋1',A.X(T[i+1])+8,A.Y(V[i]+.5)+8,{size:22,color:C.a,weight:700}));}
  return s;
 },
 [K+'slope']:(p)=>{
  let s=table({vg:[1,1,1,1,1],plus:[0,1,1,1,1]});
  const A=vAx();s+=A.svg+vPts(A,5)+vLine(A);
  s+=fade(seg(p,.05,.25),line(A.X(1),A.Y(2),A.X(1.5),A.Y(2),{color:C.t,w:4})+line(A.X(1.5),A.Y(2),A.X(1.5),A.Y(3),{color:C.a,w:4})+label('0.5 s',A.X(1.25),A.Y(2)+30,{size:22,color:C.t,anchor:'middle',weight:700})+label('1 m/s',A.X(1.5)+10,A.Y(2.5)+8,{size:22,color:C.a,weight:700}));
  s+=card(660,60,380,110,tex('\\dfrac{1}{0.5}=2\\,\\mathrm{m/s^2}',850,115,{size:36}),seg(p,.4,.6),C.a);
  s+=fade(seg(p,.75,.9),label('傾き ＝ 加速度',850,205,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'slope2']:(p)=>{
  let s=table({vg:[1,1,1,1,1],plus:[0,1,1,1,1]});
  const A=vAx();s+=A.svg+vPts(A,5)+vLine(A);
  s+=line(A.X(1),A.Y(2),A.X(1.5),A.Y(2),{color:C.t,w:4})+line(A.X(1.5),A.Y(2),A.X(1.5),A.Y(3),{color:C.a,w:4});
  s+=card(655,45,270,180,tex('a=\\dfrac{dv}{dt}',790,105,{size:38}),seg(p,.1,.3),C.a);
  s+=fade(seg(p,.35,.5),label('＝ グラフの 傾き',790,195,{size:24,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 位置を求める =====
 [K+'posQ']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:seg(p,.1,.3),xq:p>.3?[0,1,2,3,4]:[]});
  const A=vAx();s+=A.svg+vPts(A,5)+vLine(A);
  s+=fade(seg(p,.4,.6),label('2.0 秒で どこまで？',870,90,{size:30,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:1,xq:[0,1,2,3,4]});
  const A=vAx();s+=A.svg+vPts(A,5)+vLine(A);
  s+=fade(seg(p,.3,.45),line(A.X(0),A.Y(0),A.X(2),A.Y(0),{color:C.a,w:6})+label('0 m/s × 2 s ＝ 0 m',A.X(1),A.Y(0)-16,{size:22,color:C.a,anchor:'middle',weight:700})+ng(A.X(2)+30,A.Y(0)-10));
  s+=fade(seg(p,.55,.7),rect(A.X(0),A.Y(4),A.X(2)-A.X(0),A.Y(0)-A.Y(4),{fill:C.a,fo:.1,stroke:C.a,sw:2})+label('4 m/s × 2 s ＝ 8 m',A.X(.9),A.Y(4)-14,{size:22,color:C.a,anchor:'middle',weight:700})+ng(A.X(2)+30,A.Y(4)+6));
  s+=fade(seg(p,.8,.92),label('どちらも 違う',870,70,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'strip']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:1,dxHead:1,xq:[0,1,2,3,4]});
  const A=vAx();s+=A.svg+vPts(A,5)+vLine(A);
  s+=fade(seg(p,.05,.25),[.5,1,1.5,2].map(t=>line(A.X(t),A.Y(0),A.X(t),A.Y(4.5),{color:C.faint,w:2,dash:'5 6'})).join(''));
  s+=trap(A,2,{g:seg(p,.45,.6),col:C.hi,num:0});
  s+=fade(seg(p,.55,.7),label('2 m/s',A.X(1)-10,A.Y(2)-12,{size:22,color:C.v,anchor:'end',weight:700})+label('3 m/s',A.X(1.5)-10,A.Y(3)-12,{size:22,color:C.v,anchor:'end',weight:700}));
  s+=highlight(40,rowY(2)-34,445,TDY+50,seg(p,.45,.6));
  return s;
 },
 [K+'strip2']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:1,dxHead:1,xq:[0,1,2,3,4],dxg:[0,0,seg(p,.6,.75)],hi:2});
  const A=vAx();s+=A.svg+vPts(A,5)+vLine(A)+trap(A,2,{col:C.hi,num:0});
  s+=label('2 m/s',A.X(1)-10,A.Y(2)-12,{size:22,color:C.v,anchor:'end',weight:700})+label('3 m/s',A.X(1.5)-10,A.Y(3)-12,{size:22,color:C.v,anchor:'end',weight:700});
  s+=fade(seg(p,.05,.25),line(A.X(.8),A.Y(2.5),A.X(1.7),A.Y(2.5),{color:C.hi,w:3,dash:'8 6'})+label('平均 2.5',A.X(1.72),A.Y(2.5)+8,{size:22,color:C.hi,weight:700}));
  s+=card(660,60,500,100,tex('\\dfrac{2+3}{2}\\times0.5=2.5\\times0.5=1.25\\,\\mathrm{m}',910,110,{size:32}),seg(p,.3,.5),C.hi);
  return s;
 },
 [K+'trap']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:1,dxHead:1,xq:[0,1,2,3,4],dxg:[0,0,1],hi:2});
  const A=vAx();s+=A.svg+vPts(A,5)+vLine(A)+trap(A,2,{col:C.hi,num:1,fo:.2+.25*seg(p,.1,.3)});
  s+=card(660,60,500,100,label('台形の 面積 ＝ 進んだ 距離',910,120,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  s+=fade(seg(p,.55,.7),label('高さ ＝ 速度、幅 ＝ 時間',790,215,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'trap2']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:1,dxHead:1,xq:[0,1,2,3,4],dxg:[0,0,1],hi:2});
  const A=axes({x:620,y:460,w:480,h:340,xmin:.85,xmax:1.7,ymin:0,ymax:3.6,xticks:[1,1.5],yticks:[2,2.5,3],grid:true,xlabel:'t [s]',ylabel:'v [m/s]',xcolor:C.t,ycolor:C.v});
  s+=A.svg+trap(A,2,{col:C.hi,num:0,fo:.15});
  s+=line(A.X(.9),A.Y(1.8),A.X(1.6),A.Y(3.2),{color:C.v,w:4});
  s+=fade(seg(p,.1,.3),rect(A.X(1),A.Y(2.5),A.X(1.5)-A.X(1),A.Y(0)-A.Y(2.5),{fill:C.x,fo:.12,stroke:C.x,sw:2})+label('平均 × 時間',A.X(1.25),A.Y(1.2),{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),poly([[A.X(1.25),A.Y(2.5)],[A.X(1.5),A.Y(2.5)],[A.X(1.5),A.Y(3)]],{fill:C.hi,fo:.6,stroke:C.hi})+label('台形だけ',A.X(1.5)+10,A.Y(2.8),{size:22,color:C.hi,weight:700}));
  s+=fade(seg(p,.45,.6),poly([[A.X(1),A.Y(2)],[A.X(1),A.Y(2.5)],[A.X(1.25),A.Y(2.5)]],{fill:C.a,fo:.6,stroke:C.a})+label('長方形だけ',A.X(1.05),A.Y(2.5)-14,{size:22,color:C.a,weight:700}));
  s+=fade(seg(p,.65,.8),label('同じ 大きさ → ちょうど 等しい',930,80,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'strips']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:1,dxHead:1,xq:[0,1,2,3,4],dxg:[seg(p,.05,.2),seg(p,.15,.3),1,seg(p,.3,.45)]});
  const A=vAx();s+=A.svg+vPts(A,5)+vLine(A);
  for(let i=0;i<4;i++)s+=trap(A,i,{g:i===2?1:seg(p,.05+.1*i,.2+.1*i)});
  s+=fade(seg(p,.6,.75),label('＋0.5 m ずつ 長くなる',870,80,{size:28,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'xcol']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:1,dxHead:1,dxg:[1,1,1,1],xg:[1,seg(p,.1,.2),seg(p,.25,.35),seg(p,.4,.5),seg(p,.55,.65)],xq:p<.1?[1,2,3,4]:p<.25?[2,3,4]:p<.4?[3,4]:p<.55?[4]:[]});
  const A=vAx();s+=A.svg+vPts(A,5)+vLine(A);
  for(let i=0;i<4;i++)s+=trap(A,i);
  s+=card(660,50,500,110,tex('0.25+0.75=1.00',910,90,{size:32})+fade(seg(p,.25,.35),tex('1.00+1.25=2.25',910,135,{size:32})),seg(p,.1,.2));
  return s;
 },
 [K+'sq']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:1,dxHead:1,dxg:[1,1,1,1],xg:[1,1,1,1,1]});
  s+=highlight(380,rowY(3)-36,105,52,seg(p,.3,.45));
  s+=card(620,120,500,220,tex('1.5^2=2.25',870,200,{size:52})+label('1.5 秒 → 2.25 m',870,285,{size:28,color:C.x,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'t2b']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:1,dxHead:1,dxg:[1,1,1,1],xg:[1,1,1,1,1]});
  const rows=[['0.5^2=0.25',1],['1^2=1',2],['1.5^2=2.25',3],['2^2=4',4]];
  rows.forEach(([t,i],k)=>{const g=seg(p,.05+.15*k,.18+.15*k);s+=fade(g,tex(t,760,rowY(i)-10,{size:34}))+ok(930,rowY(i)-4,g);});
  s+=fade(seg(p,.7,.85),card(640,40,440,90,tex('x=t^2',860,90,{size:44}),1,C.hi));
  return s;
 },
 [K+'q3']:(p)=>{
  let s=ytUiNewton2Diagrams[K+'t2b'](1);
  s+=card(620,400,540,110,label('もし 3.0 秒まで 押し続けたら',890,440,{size:26,color:C.ink,anchor:'middle'})+label('x ＝ ？',890,490,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'q3a']:(p)=>{
  let s=ytUiNewton2Diagrams[K+'t2b'](1);
  s+=card(620,400,540,110,tex('x=3^2=9\\,\\mathrm{m}',890,440,{size:34})+fade(seg(p,.4,.6),tex('4.00+2.25+2.75=9.00',890,490,{size:28})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'half']:(p)=>{
  let s=card(150,50,900,150,tex('x=\\tfrac{1}{2}\\,a\\,t^2=\\tfrac{1}{2}\\times2\\times t^2=t^2',600,125,{size:48}),seg(p,0,.2),C.hi);
  s+=fade(seg(p,.1,.3),label('（この例：x は m、t は s）',600,245,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),card(250,300,700,120,label('½ の 出どころ → 次のレベル：積分で 導く',600,370,{size:30,color:C.ink,anchor:'middle',weight:700}),1));
  return s;
 },
 [K+'xcurve']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:1,dxHead:1,dxg:[1,1,1,1],xg:[1,1,1,1,1]});
  const A=xAx(seg(p,0,.15));s+=A.svg;
  for(let i=0;i<5;i++)s+=fade(seg(p,.1+.06*i,.16+.06*i),dot(A.X(T[i]),A.Y(X[i]),8,C.x));
  s+=A.plot(t=>t*t,{from:0,to:2.05,p:seg(p,.4,.6),color:C.x,w:4});
  for(let i=0;i<4;i++)s+=fade(seg(p,.65,.8),line(A.X(T[i+1]),A.Y(X[i]),A.X(T[i+1]),A.Y(X[i+1]),{color:C.hi,w:4})+label(DXS[i],A.X(T[i+1])+8,A.Y((X[i]+X[i+1])/2)+8,{size:22,color:C.hi,weight:700}));
  s+=fade(seg(p,.8,.92),label('だんだん 急に',A.X(.9),A.Y(3.8),{size:26,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 力を止めると =====
 [K+'offQ']:(p)=>{
  let s=table({n:6,tg:[1,1,1,1,1,seg(p,.3,.45)],vg:[1,1,1,1,1],vq:5,xHead:1,dxHead:1,dxg:[1,1,1,1],xg:[1,1,1,1,1]});
  s+=fade(seg(p,.3,.45),label('？',CX.v,rowY(5),{size:28,color:C.hi,anchor:'middle',weight:700}));
  const A=vAx(1,{xmax:2.75});s+=A.svg+vPts(A,5)+vLine(A);
  s+=fade(seg(p,.1,.3),line(A.X(2),A.Y(0),A.X(2),A.Y(4.6),{color:C.F,w:3,dash:'8 6'})+label('合力 0',A.X(2)+10,A.Y(4.45),{size:24,color:C.F,weight:700}));
  s+=fade(seg(p,.4,.55),label('？',A.X(2.4),A.Y(3),{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'off1']:(p)=>{
  let s=table({n:6,vg:[1,1,1,1,1],vq:5,xHead:1,dxHead:1,dxg:[1,1,1,1],xg:[1,1,1,1,1]});
  s+=label('？',CX.v,rowY(5),{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=card(600,75,540,145,tex('a=\\dfrac{0}{2}=0',870,150,{size:46}),seg(p,0,.2),C.a);
  s+=card(600,250,540,120,tex('a\\,\\Delta t=0\\times0.5=0',870,310,{size:42}),seg(p,.45,.65));
  return s;
 },
 [K+'off2']:(p)=>{
  let s=table({n:6,vg:[1,1,1,1,1,seg(p,.3,.45)],xHead:1,dxHead:1,dxg:[1,1,1,1],xg:[1,1,1,1,1],plus:[0,0,0,0,0,seg(p,.1,.25)]});
  const A=vAx(1,{xmax:2.75});s+=A.svg+vPts(A,5)+vLine(A);
  s+=line(A.X(2),A.Y(0),A.X(2),A.Y(4.6),{color:C.F,w:3,dash:'8 6'})+label('合力 0',A.X(2)+10,A.Y(4.45),{size:24,color:C.F,weight:700});
  s+=A.plot(()=>4,{from:2,to:2.55,p:seg(p,.3,.55),color:C.v,w:4})+fade(seg(p,.5,.6),dot(A.X(2.5),A.Y(4),8,C.v));
  s+=fade(seg(p,.6,.75),label('4 m/s の まま',A.X(1.4),A.Y(4)-50,{size:26,color:C.v,anchor:'middle',weight:700})+ng(A.X(2.3),A.Y(0)-20)+label('0 に 戻らない',A.X(2.35),A.Y(1.4),{size:22,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'off3']:(p)=>{
  let s=table({n:6,vg:[1,1,1,1,1,1],xHead:1,dxHead:1,dxg:[1,1,1,1,seg(p,.2,.35)],xg:[1,1,1,1,1,seg(p,.6,.75)],plus:[0,0,0,0,0,1]});
  const A=vAx(1,{xmax:2.75});s+=A.svg+vPts(A,5)+vLine(A)+A.plot(()=>4,{from:2,to:2.55,color:C.v,w:4})+dot(A.X(2.5),A.Y(4),8,C.v);
  s+=line(A.X(2),A.Y(0),A.X(2),A.Y(4.6),{color:C.F,w:3,dash:'8 6'});
  s+=fade(seg(p,.15,.3),rect(A.X(2),A.Y(4),A.X(2.5)-A.X(2),A.Y(0)-A.Y(4),{fill:C.x,fo:.28,stroke:C.x,sw:2})+label('⑤',A.X(2.25),A.Y(0)-14,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=card(660,40,330,80,tex('4\\times0.5=2\\,\\mathrm{m}',825,80,{size:32}),seg(p,.2,.35));
  s+=fade(seg(p,.6,.75),label('4.00 ＋ 2 ＝ 6.00 m',825,150,{size:26,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'off4']:(p)=>{
  const X0=[160,470,780,1060],names=['力 F','加速度 a','速度 v','位置 x'],cols=[C.F,C.a,C.v,C.x];let s='';
  X0.forEach((x,i)=>{const g=seg(p,.05+.12*i,.15+.12*i);s+=fade(g,card(x-115,170,230,90,label(names[i],x,228,{size:30,color:cols[i],anchor:'middle',weight:700}),1,cols[i]));
   if(i>0)s+=fade(g,arrow(X0[i-1]+118,215,x-118,215,{color:C.dim,w:3,head:14})+label(i===1?'÷ m':'積み上げ',(X0[i-1]+x)/2,150,{size:22,color:C.t,anchor:'middle'}));});
  s+=fade(seg(p,.6,.75),label('力が 決めるのは 今の 加速度',600,360,{size:32,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('速度は 積み上がった 結果',600,420,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=table({vg:[1,1,1,1,1],plus:[0,1,1,1,1]});
  s+=card(600,55,540,135,tex('a=\\dfrac{F}{m}',870,125,{size:42}),seg(p,0,.2),C.a);
  s+=card(600,210,540,110,tex('\\Delta v=a\\,\\Delta t',870,265,{size:42}),seg(p,.3,.5),C.v);
  s+=fade(seg(p,.65,.8),label('表に 足す → 各時刻の 速度',870,380,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=table({vg:[1,1,1,1,1],xHead:1,dxHead:1,dxg:[1,1,1,1],xg:[1,1,1,1,1]});
  const A=vAx();s+=A.svg+vPts(A,5)+vLine(A);
  for(let i=0;i<4;i++)s+=trap(A,i,{g:seg(p,.2+.08*i,.3+.08*i)});
  s+=fade(seg(p,.7,.85),label('面積の 合計 ＝ 位置',870,80,{size:28,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum3']:(p)=>{
  let s=card(80,90,480,300,label('法則と 力のモデル',320,145,{size:26,color:C.dim,anchor:'middle'})+tex('ma=F',320,225,{size:52})+label('F ＝ 4 N、m ＝ 2 kg',320,320,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.2));
  s+=fade(seg(p,.25,.35),label('＋',600,250,{size:48,color:C.dim,anchor:'middle'}));
  s+=card(640,90,480,300,label('初期条件',880,145,{size:30,color:C.hi,anchor:'middle',weight:700})+label('t ＝ 0 で v ＝ 0',880,235,{size:30,color:C.v,anchor:'middle',weight:700})+label('t ＝ 0 で x ＝ 0',880,300,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'drop']:(p)=>{
  const cx=380,y=120+200*seg(p,0,1);
  let s=ring(cx,y,34,{color:BX,w:3,fill:'#1d2a44'});
  s+=fade(seg(p,.1,.25),arrow(cx,y+40,cx,y+140,{color:C.F,w:6,head:18})+label('重力',cx+18,y+120,{size:24,color:C.F,weight:700}));
  s+=fade(seg(p,.5,.65),arrow(cx,y-40,cx,y-40-30-60*seg(p,.5,1),{color:C.F,w:6,head:18})+label('空気の 抵抗',cx+18,y-60,{size:24,color:C.F,weight:700}));
  s+=fade(seg(p,.2,.35),card(660,120,460,160,label('今回：力は 一定',890,180,{size:28,color:C.dim,anchor:'middle'})+fade(seg(p,.5,.65),label('抵抗は 速さで 変わる',890,240,{size:30,color:C.hi,anchor:'middle',weight:700})),1));
  return s;
 },
 [K+'next']:(p)=>{
  const A=axes({x:140,y:450,w:520,h:320,xmax:5,ymax:5,xticks:[],yticks:[],g:1,xlabel:'t',ylabel:'v',xcolor:C.t,ycolor:C.v});
  let s=A.svg+A.plot(t=>t,{from:0,to:1.6,p:seg(p,.05,.3),color:C.v,w:4});
  s+=fade(seg(p,.3,.45),A.plot(t=>t,{from:1.6,to:4.3,color:C.dim,w:3,dash:'8 7'})+label('どこまで？',A.X(3.8),A.Y(4.5),{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(740,140,400,190,label('抵抗が 速さと ともに 増えると',940,210,{size:26,color:C.ink,anchor:'middle'})+label('速度は どこまで？',940,275,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
};
