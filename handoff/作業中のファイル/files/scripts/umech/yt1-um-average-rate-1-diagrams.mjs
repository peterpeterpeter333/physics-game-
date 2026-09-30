// YouTube シリーズ「微分・中級 1/2」(ys-um-average-rate-1) — 図。Stage 1200×515.
// 色（anim.mjs C）：位置 x 水色、時刻 t・幅 h 金、差商（平均変化率）紫、強調 黄。
// 正方形の図は初級（ui-average-to-now-2:square、ui-function-rules-1）と同じ配色：元の正方形 水色、帯 金、角 赤。
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';

const K='um-average-rate-1:';
const xt=t=>t*t;
const Hc=`{\\color{${C.t}}h}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const RX=735,RW=445,RC=RX+RW/2;

// ---- x–t graph of x = t² ---------------------------------------------------------------
function graph({g=1,curve=1,numeric=true,x=100,y=450,w=450,h=340}={}){
 const A=axes({x,y,w,h,xmax:2.3,ymax:5.6,xlabel:'時刻 t [s]',ylabel:'位置 x [m]',xticks:numeric?[1,2]:[],yticks:numeric?[1,2,3,4,5]:[],grid:numeric,g,xcolor:C.t,ycolor:C.x});
 return {A,svg:A.svg+A.plot(xt,{from:0,to:2.3,p:curve,color:C.x,w:4})};
}
function pt(A,t,g=1,color=C.hi,r=9){return fade(g,dot(A.X(t),A.Y(xt(t)),r,color));}
function secant(A,t1,t2,{g=1,color=C.v,w=4,ext=.4,opacity=1}={}){
 const k=(xt(t2)-xt(t1))/(t2-t1),a=Math.max(.05,t1-ext),b=Math.min(2.3,t2+ext);
 const ya=xt(t1)+k*(a-t1),yb=xt(t1)+k*(b-t1);
 return draw([[A.X(a),A.Y(Math.max(-.3,ya))],[A.X(b),A.Y(Math.min(5.9,yb))]].map((q,i)=>q),g,{color,w,opacity});
}
function tangentLine(A,t,{g=1,color=C.hi,w=4,half=.7,dash='10 8'}={}){
 const k=2*t,a=t-half,b=t+half;return draw([[A.X(a),A.Y(xt(t)+k*(a-t))],[A.X(b),A.Y(xt(t)+k*(b-t))]],g,{color,w,dash});
}
function rise(A,t1,t2,{gt=1,gx=1,tText='',xText=''}={}){
 const x1=A.X(t1),y1=A.Y(xt(t1)),x2=A.X(t2),y2=A.Y(xt(t2));
 let s=line(x1,y1,mix(x1,x2,gt),y1,{color:C.t,w:5})+line(x2,y1,x2,mix(y1,y2,gx),{color:C.x,w:5});
 if(tText)s+=fade(gt,label(tText,(x1+x2)/2,y1+32,{size:24,color:C.t,anchor:'middle'}));
 if(xText)s+=fade(gx,label(xText,x2+12,(y1+y2)/2+8,{size:24,color:C.x}));
 return s;
}
// letters t and t+h under the time axis (abstract graph)
function tick(A,t,text,g=1){return fade(g,line(A.X(t),A.Y(0)-7,A.X(t),A.Y(0)+7,{color:C.t,w:3})+label(text,A.X(t),A.Y(0)+36,{size:24,color:C.t,anchor:'middle'}));}
const T0=.8; // position of the letter t on the abstract graph

// ---- tables ----------------------------------------------------------------------------
function tableBox(x0,y0,w,h){return rect(x0,y0,w,h,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});}

// ---- the square of side t + h (origin at the bottom-left, grows right and up) ------------
const SQ={x0:780,y0:70,u:250,hh:90};
function square({g=1,main=1,right=1,top=1,corner=1,outline=1,sides=1,labels=1,mainFade=1,nums=false,x0=SQ.x0,y0=SQ.y0,u=SQ.u,hh=SQ.hh}={}){
 const F=u+hh;let s='';
 const L=nums?{t2:'9',th:'0.3',h2:'0.01',t:'3',h:'0.1'}:{t2:'t²',th:'th',h2:'h²',t:'t',h:'h'};
 s+=fade(main*mainFade,rect(x0,y0+hh,u,u,{fill:C.x,fo:.25,rx:0})+fade(labels,label(L.t2,x0+u/2,y0+hh+u/2+12,{size:34,color:C.x,anchor:'middle',weight:700})));
 s+=fade(right,rect(x0+u,y0+hh,hh,u,{fill:C.t,fo:.32,rx:0})+fade(labels,label(L.th,x0+u+hh/2,y0+hh+u/2+10,{size:28,color:C.t,anchor:'middle',weight:700})));
 s+=fade(top,rect(x0,y0,u,hh,{fill:C.t,fo:.32,rx:0})+fade(labels,label(L.th,x0+u/2,y0+hh/2+10,{size:28,color:C.t,anchor:'middle',weight:700})));
 s+=fade(corner,rect(x0+u,y0,hh,hh,{fill:C.a,fo:.4,rx:0})+fade(labels,label(L.h2,x0+u+hh/2,y0+hh/2+10,{size:nums?22:28,color:C.a,anchor:'middle',weight:700})));
 s+=fade(outline,rect(x0,y0,F,F,{fill:'none',fo:0,stroke:C.dim,sw:3,rx:0}));
 s+=fade(sides,label(L.t,x0+u/2,y0+F+36,{size:26,color:C.t,anchor:'middle'})+label(L.h,x0+u+hh/2,y0+F+36,{size:26,color:C.t,anchor:'middle'})
  +label(L.t,x0-14,y0+hh+u/2+8,{size:26,color:C.t,anchor:'end'})+label(L.h,x0-14,y0+hh/2+8,{size:26,color:C.t,anchor:'end'})
  +line(x0+u,y0+F+6,x0+u,y0+F+16,{color:C.dim,w:2})+line(x0-6,y0+hh,x0-16,y0+hh,{color:C.dim,w:2}));
 return fade(g,s);
}
// coloured TeX pieces
const cT2=`{\\color{${C.x}}t^2}`,c2th=`{\\color{${C.t}}2th}`,cH2=`{\\color{${C.a}}h^2}`;

export const ytUmAvgRate1Diagrams={
 // ================= S1 初級の最後の問い =================
 [K+'ask']:(p)=>{
  let s=card(150,50,900,290,label('初級の 最後の問い',600,105,{size:26,color:C.dim,anchor:'middle'})
   +label('近づく先を、数表を 作らずに',600,190,{size:38,color:C.ink,anchor:'middle'})
   +label('式から 直接 取り出すには？',600,265,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
  const vals=['15','10.5','10.05','…','10'];
  vals.forEach((v,i)=>{s+=fade(seg(p,.35+i*.08,.45+i*.08),label(v,240+i*180,430,{size:34,color:i===4?C.hi:C.v,anchor:'middle',weight:700})+(i<4?label('→',330+i*180,428,{size:28,color:C.dim,anchor:'middle'}):''));});
  return s;
 },
 [K+'recap']:(p)=>{
  const x0=60,y0=50;let s=tableBox(x0,y0,470,390);
  s+=label('幅 [s]',x0+120,y0+50,{size:26,color:C.t,anchor:'middle'})+label('平均の速さ [m/s]',x0+330,y0+50,{size:26,color:C.v,anchor:'middle'})+line(x0+20,y0+72,x0+450,y0+72,{color:C.faint,w:2});
  [['1','15'],['0.1','10.5'],['0.01','10.05']].forEach(([h,v],i)=>{const y=y0+140+i*70;s+=fade(seg(p,.3+i*.1,.4+i*.1),label(h,x0+120,y,{size:32,color:C.t,anchor:'middle'})+label(v,x0+330,y,{size:34,color:C.v,anchor:'middle',weight:700}));});
  s+=fade(seg(p,0,.15),label('初級：x ＝ 5t²，1 秒から',x0+235,y0+360,{size:24,color:C.dim,anchor:'middle'}));
  // number line
  const lo=9.5,hi=15.5,L0=620,L1=1150,Y=300,X=v=>L0+(L1-L0)*(v-lo)/(hi-lo);
  let n=line(L0,Y,L1,Y,{color:C.dim,w:3});for(let v=10;v<=15;v++)n+=line(X(v),Y-8,X(v),Y+8,{color:C.dim,w:2})+label(String(v),X(v),Y+38,{size:22,color:C.dim,anchor:'middle'});
  n+=line(X(10),Y-80,X(10),Y+12,{color:C.hi,w:3,dash:'8 6'})+label('10',X(10),Y-92,{size:30,color:C.hi,anchor:'middle',weight:700});
  [15,10.5,10.05].forEach((v,i)=>{n+=fade(seg(p,.3+i*.1,.4+i*.1),dot(X(v),Y,10,C.v));});
  n+=arrow(X(15)+10,Y+70,X(10)+14,Y+70,{color:C.hi,w:4,g:seg(p,.65,.85)});
  s+=fade(seg(p,.1,.25),n);
  return s;
 },
 [K+'table']:(p)=>{
  const x0=60,y0=60;let s=tableBox(x0,y0,470,330);
  s+=label('幅 [s]',x0+120,y0+50,{size:26,color:C.t,anchor:'middle'})+label('平均の速さ [m/s]',x0+330,y0+50,{size:26,color:C.v,anchor:'middle'})+line(x0+20,y0+72,x0+450,y0+72,{color:C.faint,w:2});
  const k=Math.min(2,Math.floor(seg(p,.05,.5)*3));
  [['1','15'],['0.1','10.5'],['0.01','10.05']].forEach(([h,v],i)=>{const y=y0+140+i*70;
   if(i===k&&p<.55)s+=rect(x0+14,y-44,442,60,{fill:C.hi,fo:.08,stroke:C.hi,sw:2,rx:10});
   s+=label(h,x0+120,y,{size:32,color:C.t,anchor:'middle'})+label(v,x0+330,y,{size:34,color:C.v,anchor:'middle',weight:700});});
  s+=card(RX-40,60,RW+40,150,label('1 行 ＝ 幅を決めて 1 回代入',RC-20,125,{size:30,color:C.hi,anchor:'middle',weight:700})+label('それを 一行ずつ 繰り返す',RC-20,178,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi);
  // a second, empty table for another time
  const g2=seg(p,.55,.7);
  let e=tableBox(RX-40,240,RW+40,260)+label('時刻を 変えたら？',RC-20,290,{size:30,color:C.a,anchor:'middle',weight:700});
  for(let i=0;i<3;i++)e+=label('？',RX+60,335+i*38,{size:26,color:C.dim,anchor:'middle'})+label('？',RX+280,335+i*38,{size:26,color:C.dim,anchor:'middle'});
  e+=fade(seg(p,.75,.9),label('一から 作り直し',RC-20,470,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=fade(g2,e);
  return s;
 },
 [K+'plan']:(p)=>{
  const {A,svg}=graph({g:seg(p,.3,.45),curve:seg(p,.4,.75)});
  let s=svg;
  s+=card(RX,60,RW,160,label('今回',RC,105,{size:24,color:C.dim,anchor:'middle'})+label('t も h も 文字のまま',RC,170,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=card(RX,245,RW,230,tex('x=t^2',RC,300,{size:56})
   +fade(seg(p,.6,.75),label('x：位置 [m]',RX+60,380,{size:28,color:C.x})+label('t：時刻 [s]',RX+60,430,{size:28,color:C.t})),seg(p,.4,.55));
  return s;
 },
 // ================= S2 平均変化率は、直線の傾き =================
 [K+'rate']:(p)=>{
  const {A,svg}=graph({numeric:false});const t1=T0,t2=T0+1;
  let s=svg+pt(A,t1,seg(p,.05,.15))+pt(A,t2,seg(p,.05,.15));
  s+=rise(A,t1,t2,{gx:seg(p,.15,.35),gt:seg(p,.35,.55),xText:'Δx：位置の差',tText:'Δt：時間の差'});
  s+=card(RX,110,RW,300,label('平均変化率',RC,165,{size:32,color:C.v,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),tex('\\dfrac{\\Delta x}{\\Delta t}',RC,275,{size:64}))
   +fade(seg(p,.7,.85),label('位置の差 ÷ 時間の差',RC,370,{size:28,color:C.ink,anchor:'middle'})),seg(p,.45,.6),C.v);
  return s;
 },
 [K+'slope']:(p)=>{
  const {A,svg}=graph({numeric:false});const t1=T0,t2=T0+1;
  let s=svg+pt(A,t1)+pt(A,t2)+rise(A,t1,t2,{xText:'縦の差 Δx',tText:'横の差 Δt'})+secant(A,t1,t2,{g:seg(p,.4,.65)});
  s+=card(RX,110,RW,300,label('平均変化率',RC,165,{size:30,color:C.v,anchor:'middle'})
   +tex('\\dfrac{\\Delta x}{\\Delta t}',RC,255,{size:56})
   +fade(seg(p,.55,.75),label('＝ 2点を結ぶ 直線の傾き',RC,360,{size:30,color:C.v,anchor:'middle',weight:700})),1,C.v);
  return s;
 },
 [K+'h']:(p)=>{
  const {A,svg}=graph({numeric:false});const t1=T0,t2=T0+1;
  let s=svg+secant(A,t1,t2,{opacity:.6})+pt(A,t1)+pt(A,t2)+rise(A,t1,t2,{xText:'Δx'});
  s+=tick(A,t1,'t',seg(p,.05,.2))+tick(A,t2,'t ＋ h',seg(p,.2,.35));
  s+=fade(seg(p,.35,.5),brace(A.X(t1),A.X(t2),A.Y(xt(t1))+14,{dir:1,text:'幅 h',color:C.t,size:26}));
  s+=card(RX,110,RW,250,label('区間の幅',RC,165,{size:30,color:C.t,anchor:'middle'})
   +fade(seg(p,.6,.75),tex(`\\Delta t=${Hc}`,RC,265,{size:60,auto:false,color:C.ink}))
   +fade(seg(p,.6,.75),label('同じもの',RC,335,{size:26,color:C.dim,anchor:'middle'})),seg(p,.35,.5),C.t);
  return s;
 },
 [K+'hmove']:(p)=>{
  const {A,svg}=graph({numeric:false});
  const h=p<.35?1:mix(1,.35,.5-.5*Math.cos(Math.PI*2*seg(p,.35,1)*1.5)),t2=T0+h;
  let s=svg+secant(A,T0,t2)+pt(A,T0)+pt(A,t2)+tick(A,T0,'t')+tick(A,t2,'t ＋ h');
  s+=card(RX,110,RW,280,label('h ≠ 0',RC,180,{size:44,color:C.t,anchor:'middle',weight:700})
   +label('0 ではない 数',RC,235,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.55),label('h を変えると 傾きも変わる',RC,330,{size:30,color:C.v,anchor:'middle',weight:700})),seg(p,0,.15),C.t);
  return s;
 },
 [K+'which']:(p)=>{
  const {A,svg}=graph({numeric:false});let s=svg;
  [1.2,.7,.35].forEach((h,i)=>{s+=fade(seg(p,.05+i*.12,.15+i*.12),secant(A,T0,T0+h,{opacity:.85,color:[C.v,'#8f7ad6','#6f5fb0'][i]})+pt(A,T0+h,1,C.hi,7));});
  s+=pt(A,T0)+tick(A,T0,'t');
  s+=card(RX,120,RW,260,label('どの傾きを',RC,195,{size:34,color:C.ink,anchor:'middle'})+label('時刻 t の 変化率と 呼ぶ？',RC,260,{size:34,color:C.hi,anchor:'middle',weight:700})+label('？',RC,335,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'tangent']:(p)=>{
  const {A,svg}=graph({numeric:false});const h=mix(1,.02,smooth(seg(p,.05,.7)));
  let s=svg+secant(A,T0,T0+h,{ext:.7})+pt(A,T0)+pt(A,T0+h,1,C.hi,7)+tick(A,T0,'t');
  s+=tangentLine(A,T0,{g:seg(p,.7,.9)});
  s+=fade(seg(p,.8,.95),label('接線',A.X(T0+.72),A.Y(xt(T0)+2*T0*.72)-12,{size:28,color:C.hi,weight:700}));
  s+=card(RX,120,RW,220,label(`h ＝ ${h<.021?'0.02 …':fmt(h,2)}`,RC,190,{size:34,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,.7,.85),label('点 t で 曲線に触れる直線',RC,270,{size:28,color:C.hi,anchor:'middle'})),1,C.faint);
  return s;
 },
 [K+'tangent2']:(p)=>{
  const {A,svg}=graph({numeric:false});
  let s=svg+secant(A,T0,T0+1,{opacity:.7})+pt(A,T0+1,1,C.hi,7)+tangentLine(A,T0,{half:.75})+pt(A,T0)+tick(A,T0,'t');
  s+=card(RX,70,RW,170,label('2点を結ぶ直線',RC,120,{size:28,color:C.v,anchor:'middle',weight:700})+label('区間全体の 平均',RC,175,{size:30,color:C.ink,anchor:'middle'}),seg(p,0,.15),C.v);
  s+=card(RX,260,RW,210,label('接線',RC,310,{size:30,color:C.hi,anchor:'middle',weight:700})+label('点 t だけで 決まる',RC,360,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.7),label('→ 時刻 t の 変化率',RC,425,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.3,.45),C.hi);
  return s;
 },
 // ================= S3 数値で追う =================
 [K+'h1']:(p)=>{
  const {A,svg}=graph();let s=svg+pt(A,1,seg(p,.05,.15))+pt(A,2,seg(p,.1,.2))+rise(A,1,2,{gt:seg(p,.15,.3),gx:seg(p,.3,.45),tText:'h ＝ 1',xText:'3'})+secant(A,1,2,{g:seg(p,.6,.8)});
  s+=fade(seg(p,.05,.15),label('(1, 1)',A.X(1)-14,A.Y(1)-16,{size:22,color:C.hi,anchor:'end'})+label('(2, 4)',A.X(2)-14,A.Y(4)-14,{size:22,color:C.hi,anchor:'end'}));
  s+=card(RX-40,100,RW+40,320,label('t ＝ 1，h ＝ 1',RC-20,155,{size:30,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),tex('\\dfrac{2^2-1^2}{1}',RC-100,265,{size:46,auto:false}))
   +fade(seg(p,.5,.65),tex('=\\dfrac{3}{1}',RC+45,265,{size:46,auto:false}))
   +fade(seg(p,.72,.85),tex('=3',RC+150,265,{size:46,auto:false,color:C.v}))
   +fade(seg(p,.72,.85),label('差商（平均変化率）',RC-20,370,{size:26,color:C.v,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'h01']:(p)=>{
  const {A,svg}=graph();let s=svg+pt(A,1)+pt(A,1.1)+secant(A,1,1.1,{ext:.8,g:seg(p,.6,.8)});
  s+=fade(seg(p,.05,.2),label('h ＝ 0.1',A.X(1.05),A.Y(0)-14,{size:24,color:C.t,anchor:'middle'})+line(A.X(1),A.Y(0),A.X(1.1),A.Y(0),{color:C.t,w:8}));
  s+=card(RX-40,80,RW+40,390,label('t ＝ 1，h ＝ 0.1',RC-20,130,{size:30,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,.05,.25),tex('1.1^2=1.21',RC-20,205,{size:42,auto:false,color:C.x}))
   +fade(seg(p,.35,.5),tex('\\dfrac{1.21-1}{0.1}',RC-100,310,{size:42,auto:false}))
   +fade(seg(p,.45,.6),tex('=\\dfrac{0.21}{0.1}',RC+60,310,{size:42,auto:false}))
   +fade(seg(p,.65,.8),tex('=2.1',RC-20,415,{size:48,auto:false,color:C.v})),seg(p,0,.12));
  return s;
 },
 [K+'h001']:(p)=>{
  const {A,svg}=graph();const h=p<.3?.1:p<.6?.01:.001;
  let s=svg+pt(A,1)+secant(A,1,1+h,{ext:.8})+pt(A,1+h,1,C.hi,6);
  const x0=RX-40,y0=60;s+=tableBox(x0,y0,RW+40,400);
  s+=label('h',x0+110,y0+50,{size:28,color:C.t,anchor:'middle'})+label('差商',x0+330,y0+50,{size:28,color:C.v,anchor:'middle'})+line(x0+20,y0+72,x0+RW+20,y0+72,{color:C.faint,w:2});
  const rows=[['1','3'],['0.1','2.1'],['0.01','2.01'],['0.001','2.001']],sh=[1,1,seg(p,.1,.25),seg(p,.4,.55)];
  rows.forEach(([a,b],i)=>{const y=y0+130+i*62;s+=fade(sh[i],label(a,x0+110,y,{size:30,color:C.t,anchor:'middle'})+label(b,x0+330,y,{size:32,color:C.v,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.7,.85),label('→ 2 に近づく',x0+(RW+40)/2,y0+375,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'same']:(p)=>{
  const x0=50,y0=60,W=680;let s=tableBox(x0,y0,W,400);
  s+=label('今回：x ＝ t²，t ＝ 1',x0+W/2,y0+45,{size:26,color:C.dim,anchor:'middle'});
  s+=label('h',x0+100,y0+100,{size:26,color:C.t,anchor:'middle'})+label('差商',x0+300,y0+100,{size:26,color:C.v,anchor:'middle'})+fade(seg(p,.4,.55),label('2 を超えた分',x0+530,y0+100,{size:26,color:C.hi,anchor:'middle'}));
  s+=line(x0+20,y0+120,x0+W-20,y0+120,{color:C.faint,w:2});
  [['1','3','1'],['0.1','2.1','0.1'],['0.01','2.01','0.01'],['0.001','2.001','0.001']].forEach(([h,v,e],i)=>{const y=y0+175+i*62;
   s+=label(h,x0+100,y,{size:30,color:C.t,anchor:'middle'})+label(v,x0+300,y,{size:32,color:C.v,anchor:'middle',weight:700})+fade(seg(p,.45+i*.07,.55+i*.07),label(e,x0+530,y,{size:30,color:C.hi,anchor:'middle'}));});
  s+=fade(seg(p,.8,.92),rect(x0+440,y0+128,180,258,{fill:'none',fo:0,stroke:C.hi,sw:2.5,rx:10})+label('＝ h',x0+530,y0+430,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(770,60,400,300,label('初級：x ＝ 5t²',970,105,{size:26,color:C.dim,anchor:'middle'})
   +label('15',970,170,{size:32,color:C.v,anchor:'middle'})+label('10.5',970,225,{size:32,color:C.v,anchor:'middle'})+label('10.05',970,280,{size:32,color:C.v,anchor:'middle'})
   +label('→ 10',970,335,{size:28,color:C.hi,anchor:'middle'}),seg(p,0,.15));
  s+=fade(seg(p,.15,.3),label('同じ 近づき方',970,415,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=card(200,70,800,330,label('予想してみよう',600,125,{size:28,color:C.hi,anchor:'middle'})
   +label('t ＝ 3 で 幅を縮めた先は？',600,215,{size:42,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('表を 作り直さずに 答えるには……',600,300,{size:30,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('式が 必要',600,360,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 // ================= S4 t を文字のまま計算する =================
 [K+'quot']:(p)=>{
  let s=fade(seg(p,.02,.2),tex(`\\dfrac{(t+${Hc})^2-t^2}{${Hc}}`,380,250,{size:66,auto:true}));
  s+=fade(seg(p,.25,.4),arrow(610,195,700,160,{color:C.x,w:3})+label('位置の差 Δx',715,165,{size:28,color:C.x}));
  s+=fade(seg(p,.35,.5),arrow(470,318,700,340,{color:C.t,w:3})+label('幅 h ＝ Δt',715,350,{size:28,color:C.t}));
  s+=card(250,410,700,80,label('差商 ＝ 差の割り算',600,462,{size:34,color:C.v,anchor:'middle',weight:700}),seg(p,.6,.75),C.v);
  return s;
 },
 [K+'square']:(p)=>{
  let s=tex(`(t+${Hc})^2`,300,150,{size:60});
  s+=fade(seg(p,.2,.35),label('＝ 一辺 t ＋ h の 正方形の面積',300,250,{size:30,color:C.ink,anchor:'middle'}));
  const F=SQ.u+SQ.hh;
  s+=fade(seg(p,.2,.4),rect(SQ.x0,SQ.y0,F,F,{fill:C.dim,fo:.1,stroke:C.dim,sw:3,rx:0})
   +brace(SQ.x0,SQ.x0+F,SQ.y0+F+10,{dir:1,text:'t ＋ h',color:C.t,size:26})
   +label('t ＋ h',SQ.x0-18,SQ.y0+F/2+8,{size:26,color:C.t,anchor:'end'}));
  return s;
 },
 [K+'strips']:(p)=>{
  let s=tex(`(t+${Hc})^2`,300,110,{size:48,opacity:.8});
  s+=square({main:seg(p,.02,.15),right:seg(p,.45,.58),top:seg(p,.6,.72),corner:seg(p,.78,.9),sides:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('一辺 t の正方形',300,210,{size:28,color:C.x,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),label('右と上に h だけ広げる',300,265,{size:28,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.45,.58),label('右の帯 th',180,345,{size:28,color:C.t,anchor:'middle'}))+fade(seg(p,.6,.72),label('上の帯 th',420,345,{size:28,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.78,.9),label('右上の角 h²',300,410,{size:28,color:C.a,anchor:'middle'}));
  return s;
 },
 [K+'expand']:(p)=>{
  const E=`(t+${Hc})^2=${cT2}+${c2th}+${cH2}`;
  let s=fade(seg(p,.02,.25),tex(E,60,170,{size:52,anchor:'start',auto:false,color:C.ink}));
  const w0=texWidth(`(t+${Hc})^2=`,52,false),wT=texWidth(cT2,52,false),wP=texWidth('+',52,false),w2=texWidth(c2th,52,false),wH=texWidth(cH2,52,false);
  const x2=60+w0+wT+wP,xH=x2+w2+wP;
  s+=fade(seg(p,.4,.55),brace(x2,x2+w2,210,{dir:1,text:'帯 2本',color:C.t,size:26}));
  s+=fade(seg(p,.55,.7),brace(xH,xH+wH,210,{dir:1,text:'角',color:C.a,size:26}));
  s+=square({});
  s+=fade(seg(p,.75,.9),label('同じ色 ＝ 同じ部分',330,380,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'subtract']:(p)=>{
  const R1=`(t+${Hc})^2-${cT2}`,sz=48;
  let s=tex(R1,60,130,{size:sz,anchor:'start',auto:false,color:C.ink});
  s+=fade(seg(p,.1,.3),tex(`=${cT2}+${c2th}+${cH2}-${cT2}`,60+texWidth(`(t+${Hc})^2`,sz,false),230,{size:sz,anchor:'start',auto:false,color:C.ink}));
  // strike the two t²
  const xa=60+texWidth(`(t+${Hc})^2=`,sz,false),wa=texWidth(cT2,sz,false);
  const xb=60+texWidth(`(t+${Hc})^2=${cT2}+${c2th}+${cH2}-`,sz,false);
  const g=seg(p,.35,.5);
  s+=fade(g,line(xa-4,248,xa+wa+4,200,{color:C.a,w:4})+line(xb-4,248,xb+wa+4,200,{color:C.a,w:4}));
  s+=fade(seg(p,.55,.7),tex(`=${c2th}+${cH2}`,60+texWidth(`(t+${Hc})^2`,sz,false),340,{size:sz+6,anchor:'start',auto:false,color:C.ink}));
  s+=fade(seg(p,.7,.85),label('増えた部分',100,430,{size:30,color:C.hi,weight:700}));
  s+=square({mainFade:1-.75*seg(p,.35,.55)});
  s+=fade(seg(p,.4,.55),line(SQ.x0+20,SQ.y0+SQ.hh+20,SQ.x0+SQ.u-20,SQ.y0+SQ.hh+SQ.u-20,{color:C.a,w:3,opacity:.8})+line(SQ.x0+SQ.u-20,SQ.y0+SQ.hh+20,SQ.x0+20,SQ.y0+SQ.hh+SQ.u-20,{color:C.a,w:3,opacity:.8}));
  return s;
 },
 [K+'recall']:(p)=>{
  let s=label('初級：一辺 3 → 3.1',250,50,{size:26,color:C.dim,anchor:'middle'})+label('中級：一辺 t → t ＋ h',900,50,{size:26,color:C.dim,anchor:'middle'});
  s+=square({nums:true,x0:110,y0:90,u:250,hh:60,g:seg(p,0,.15)});
  s+=square({x0:760,y0:90,u:250,hh:60,g:seg(p,.3,.45)});
  s+=fade(seg(p,.45,.6),arrow(480,230,640,230,{color:C.hi,w:4})+label('3 → t',560,200,{size:26,color:C.t,anchor:'middle'})+label('0.1 → h',560,285,{size:26,color:C.t,anchor:'middle'}));
  s+=fade(seg(p,.15,.3),label('増えた分 0.3＋0.3＋0.01',250,480,{size:24,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),label('増えた分 2th ＋ h²',900,480,{size:24,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'factor']:(p)=>{
  let s=tex(`\\dfrac{${c2th}+${cH2}}{${Hc}}`,300,170,{size:60,auto:false,color:C.ink});
  s+=fade(seg(p,.1,.3),label('2th にも h² にも h がある',700,170,{size:28,color:C.hi}));
  s+=fade(seg(p,.4,.6),tex(`=\\dfrac{${Hc}\\,(2t+${Hc})}{${Hc}}`,420,370,{size:60}));
  s+=fade(seg(p,.6,.75),label('分子から h をくくり出す',800,380,{size:28,color:C.hi}));
  return s;
 },
 [K+'cancel']:(p)=>{
  const cn=seg(p,.2,.4);
  const src=cn>.5?`\\dfrac{{\\color{${C.a}}\\cancel{\\color{${C.t}}h}}\\,(2t+${Hc})}{{\\color{${C.a}}\\cancel{\\color{${C.t}}h}}}`:`\\dfrac{${Hc}\\,(2t+${Hc})}{${Hc}}`;
  let s=tex(src,330,190,{size:64});
  s+=card(650,120,520,130,label('h ≠ 0 なので',910,172,{size:30,color:C.t,anchor:'middle',weight:700})+label('分子と分母の h を 約分できる',910,222,{size:28,color:C.ink,anchor:'middle'}),seg(p,.02,.18),C.t);
  const R=`=2t+${Hc}`,W=texWidth(R,72);
  s+=fade(seg(p,.5,.65),tex(R,600,390,{size:72}))+fade(seg(p,.65,.8),highlight(600-W/2-24,335,W+48,105,1));
  s+=fade(seg(p,.7,.85),label('差商',600-W/2-60,400,{size:30,color:C.v,anchor:'end',weight:700}));
  return s;
 },
 [K+'parts']:(p)=>{
  const R=`2t+${Hc}`,sz=76,W=texWidth(R,sz),left=600-W/2;
  let s=tex(R,600,120,{size:sz});
  const w2=texWidth('2t',sz),wh=texWidth(Hc,sz,false);
  s+=fade(seg(p,.1,.25),brace(left,left+w2,160,{color:C.v})+label('幅によらない',left+w2/2+10,225,{size:28,color:C.v,anchor:'end'}));
  s+=fade(seg(p,.3,.45),brace(left+W-wh,left+W,160,{color:C.a})+label('幅とともに 小さく',left+W-wh/2-10,225,{size:28,color:C.a}));
  // bars at t = 1: 2 + h with h shrinking
  const h=Math.pow(10,-2.5*smooth(seg(p,.5,.95))),k=260,y=345;
  s+=fade(seg(p,.45,.55),label(`t ＝ 1，h ＝ ${fmt(h,3)}`,250,y-24,{size:28,color:C.t})
   +rect(250,y,k*2,48,{fill:C.v,fo:.55,rx:6})+rect(250+k*2,y,k*h,48,{fill:C.a,fo:.8,rx:6})
   +label('2',250+k,y+34,{size:28,color:C.ink,anchor:'middle'})
   +label(`差商 ＝ ${fmt(2+h,3)}`,250,y+105,{size:32,color:C.v,weight:700}));
  return s;
 },
 // ================= S5 代入で確かめる =================
 [K+'ex']:(p)=>{
  let s=card(40,80,540,330,label('数表の計算',310,130,{size:28,color:C.dim,anchor:'middle'})
   +tex('\\dfrac{1.1^2-1^2}{0.1}',200,250,{size:40,auto:false})+tex('=\\dfrac{0.21}{0.1}',400,250,{size:40,auto:false})
   +tex('=2.1',310,360,{size:46,auto:false,color:C.v}),seg(p,0,.12));
  s+=card(620,80,540,330,label('式に代入',890,130,{size:28,color:C.hi,anchor:'middle'})
   +fade(seg(p,.15,.3),tex(`2t+${Hc}`,890,215,{size:48}))
   +fade(seg(p,.3,.45),label('t ＝ 1，h ＝ 0.1',890,275,{size:26,color:C.t,anchor:'middle'}))
   +fade(seg(p,.4,.55),tex('=2+0.1=2.1',890,360,{size:46,auto:false,color:C.v})),seg(p,.1,.25),C.hi);
  s+=fade(seg(p,.65,.8),label('一致 ✓',600,470,{size:34,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'row']:(p)=>{
  const x0=60,y0=50,W=1080;let s=tableBox(x0,y0,W,340);
  s+=label('h',x0+120,y0+50,{size:28,color:C.t,anchor:'middle'})+label('2t ＋ h（t ＝ 1）',x0+470,y0+50,{size:28,color:C.ink,anchor:'middle'})+label('数表',x0+860,y0+50,{size:28,color:C.v,anchor:'middle'})+line(x0+20,y0+72,x0+W-20,y0+72,{color:C.faint,w:2});
  [['0.1','2 ＋ 0.1 ＝ 2.1','2.1'],['0.01','2 ＋ 0.01 ＝ 2.01','2.01'],['0.001','2 ＋ 0.001 ＝ 2.001','2.001']].forEach(([h,m,v],i)=>{const y=y0+140+i*75,g=i===0?1:seg(p,.05+i*.2,.2+i*.2);
   s+=fade(g,label(h,x0+120,y,{size:32,color:C.t,anchor:'middle'})+label(m,x0+470,y,{size:32,color:C.ink,anchor:'middle'})+label(v,x0+860,y,{size:32,color:C.v,anchor:'middle',weight:700})+label('✓',x0+990,y,{size:32,color:C.F,anchor:'middle',weight:700}));});
  s+=card(250,420,700,80,label('数表の 1 行 ＝ 式への 1 回の代入',600,472,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=card(200,70,800,330,label('考えてみよう',600,125,{size:28,color:C.hi,anchor:'middle'})
   +label('t ＝ 1，h ＝ 0.5 のとき',600,215,{size:40,color:C.t,anchor:'middle',weight:700})
   +label('差商は いくつ？',600,295,{size:40,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=fade(seg(p,.3,.45),tex(`2t+${Hc}\\ =\\ ?`,600,460,{size:44}));
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=card(60,70,520,330,label('式に代入',320,120,{size:28,color:C.hi,anchor:'middle'})
   +tex(`2t+${Hc}`,320,205,{size:46})+fade(seg(p,.05,.2),tex('=2+0.5=2.5',320,310,{size:46,auto:false,color:C.v})),1,C.hi);
  s+=card(620,70,540,330,label('数表と同じ計算',890,120,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.45),tex('1.5^2=2.25',890,180,{size:38,auto:false,color:C.x}))
   +fade(seg(p,.45,.6),tex('\\dfrac{2.25-1}{0.5}=\\dfrac{1.25}{0.5}',890,280,{size:36,auto:false}))
   +fade(seg(p,.6,.75),tex('=2.5',890,370,{size:42,auto:false,color:C.v})),seg(p,.25,.4));
  s+=fade(seg(p,.8,.92),label('一致 ✓',600,470,{size:34,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'t3']:(p)=>{
  let s=tex(`2t+${Hc}`,300,120,{size:60});
  s+=fade(seg(p,.1,.25),label('t ＝ 3',300,200,{size:30,color:C.t,anchor:'middle'})+arrow(300,215,300,265,{color:C.t,w:4}));
  s+=fade(seg(p,.2,.35),tex(`6+${Hc}`,300,330,{size:60}));
  s+=fade(seg(p,.5,.65),tex('\\xrightarrow{\\;h\\,\\to\\,0\\;}\\ 6',300,440,{size:48,auto:false,color:C.hi}));
  const x0=640,y0=60;s+=fade(seg(p,.3,.45),tableBox(x0,y0,520,380)+label('h',x0+130,y0+55,{size:28,color:C.t,anchor:'middle'})+label('6 ＋ h',x0+370,y0+55,{size:28,color:C.v,anchor:'middle'})+line(x0+20,y0+78,x0+500,y0+78,{color:C.faint,w:2})
   +[['0.1','6.1'],['0.01','6.01'],['0.001','6.001']].map(([h,v],i)=>fade(seg(p,.35+i*.08,.45+i*.08),label(h,x0+130,y0+150+i*70,{size:30,color:C.t,anchor:'middle'})+label(v,x0+370,y0+150+i*70,{size:32,color:C.v,anchor:'middle',weight:700}))).join('')
   +fade(seg(p,.7,.85),label('予想の答え：6',x0+260,y0+355,{size:32,color:C.hi,anchor:'middle',weight:700})));
  return s;
 },
 [K+'t3check']:(p)=>{
  let s=card(60,60,1080,200,label('数値で：t ＝ 3，h ＝ 0.1',600,105,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.2),tex('3.1^2=9.61',260,195,{size:42,auto:false,color:C.x}))
   +fade(seg(p,.25,.45),tex('\\dfrac{9.61-9}{0.1}=\\dfrac{0.61}{0.1}=6.1',760,195,{size:42,auto:false})),1);
  s+=card(60,290,1080,170,label('式で',600,335,{size:28,color:C.hi,anchor:'middle'})
   +fade(seg(p,.6,.75),tex(`6+${Hc}=6+0.1=6.1`,600,415,{size:46,auto:false,color:C.ink})),seg(p,.55,.7),C.hi);
  s+=fade(seg(p,.8,.92),label('一致 ✓',1060,415,{size:32,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'anyt']:(p)=>{
  let s=tex(`\\dfrac{(t+${Hc})^2-t^2}{${Hc}}=2t+${Hc}`,600,110,{size:52});
  const rows=[['t ＝ 1','2 ＋ h','→ 2'],['t ＝ 3','6 ＋ h','→ 6'],['t ＝ ？','2t ＋ h に 入れるだけ','']];
  rows.forEach(([a,b,c],i)=>{const y=260+i*80,g=seg(p,.1+i*.15,.25+i*.15);s+=fade(g,label(a,240,y,{size:32,color:C.t,anchor:'middle'})+label(b,560,y,{size:32,color:i===2?C.hi:C.v,anchor:'middle',weight:700})+label(c,900,y,{size:32,color:C.hi,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.7,.85),label('表を作らずに、近づく先が 式から読める',600,490,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 まとめと次の問い =================
 [K+'sum']:(p)=>{
  const {A,svg}=graph({numeric:false});let s=svg+secant(A,T0,T0+1)+pt(A,T0)+pt(A,T0+1)+rise(A,T0,T0+1,{xText:'Δx',tText:'Δt ＝ h'})+tick(A,T0,'t')+tick(A,T0+1,'t ＋ h');
  s+=card(RX,120,RW,260,label('平均変化率',RC,175,{size:30,color:C.v,anchor:'middle'})+tex('\\dfrac{\\Delta x}{\\Delta t}',RC,260,{size:56})+label('＝ 2点を結ぶ 直線の傾き',RC,345,{size:28,color:C.v,anchor:'middle',weight:700}),seg(p,0,.2),C.v);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=tex(`(t+${Hc})^2-${cT2}=${c2th}+${cH2}`,600,100,{size:48,auto:false,color:C.ink});
  s+=fade(seg(p,.25,.4),label('h で割る（h ≠ 0）',600,190,{size:28,color:C.hi,anchor:'middle'})+arrow(600,205,600,255,{color:C.hi,w:4}));
  const R=`\\dfrac{(t+${Hc})^2-t^2}{${Hc}}=2t+${Hc}`;
  s+=fade(seg(p,.4,.6),tex(R,600,345,{size:56}));
  s+=fade(seg(p,.7,.85),label('x ＝ t² の 差商',600,470,{size:28,color:C.v,anchor:'middle'}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=tex(`2t+${Hc}`,600,120,{size:72});
  s+=fade(seg(p,.2,.35),label('h ＝ 0 を そのまま入れてよい？',600,240,{size:40,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),label('約分できたのは h ≠ 0 だったから……',600,330,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,60,800,120,label('次回',600,105,{size:26,color:C.dim,anchor:'middle'})+label('約分の 前と後で 確かめる',600,155,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=fade(seg(p,.2,.35),label('約分の前',320,245,{size:28,color:C.dim,anchor:'middle'})+tex(`\\dfrac{(t+${Hc})^2-t^2}{${Hc}}`,320,360,{size:52}));
  s+=fade(seg(p,.3,.45),label('約分の後',880,245,{size:28,color:C.dim,anchor:'middle'})+tex(`2t+${Hc}`,880,360,{size:60}));
  s+=fade(seg(p,.5,.65),label('h ＝ 0 では？',600,470,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
};
