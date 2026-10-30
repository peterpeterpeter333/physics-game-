// YouTube シリーズ「微分・中級 2/2」(ys-um-average-rate-2) — 図。Stage 1200×515.
// 色（anim.mjs C）：位置 x 水色、時刻 t・幅 h 金、差商・傾き（速度）紫、強調 黄、誤り 赤、正しい 緑。
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';

const K='um-average-rate-2:';
const xt=t=>t*t;
const Hc=`{\\color{${C.t}}h}`;
const Q=`\\dfrac{(t+${Hc})^2-t^2}{${Hc}}`; // the difference quotient
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const RX=735,RW=445,RC=RX+RW/2;

// ---- small x–t graph of x = t² for t ≥ 0 (scene 3) -----------------------------------
function graph({x=100,y=450,w=450,h=340}={}){
 const A=axes({x,y,w,h,xmax:2.3,ymax:5.6,xlabel:'時刻 t [s]',ylabel:'位置 x [m]',xticks:[1,2],yticks:[1,2,3,4,5],grid:true,xcolor:C.t,ycolor:C.x});
 return {A,svg:A.svg+A.plot(xt,{from:0,to:2.3,color:C.x,w:4})};
}
function secant(A,t1,t2,{g=1,color=C.v,w=4,ext=.6}={}){
 const a=Math.min(t1,t2),b=Math.max(t1,t2),k=(xt(b)-xt(a))/(b-a),u0=Math.max(.05,a-ext),u1=Math.min(2.3,b+ext);
 return draw([[A.X(u0),A.Y(xt(a)+k*(u0-a))],[A.X(u1),A.Y(xt(a)+k*(u1-a))]],g,{color,w});
}

// ---- stacked graphs: x = t² above, dx/dt = 2t below (scene 5) --------------------------
const GX=90,GW=500;
function stack({g=1,ticks=true}={}){
 const T=axes({x:GX,y:228,w:GW,h:165,xmin:-3.4,xmax:3.4,ymin:0,ymax:11.5,xlabel:'t [s]',ylabel:'位置 x ＝ t² [m]',xticks:[],yticks:[4,9],grid:false,g,xcolor:C.t,ycolor:C.x});
 const B=axes({x:GX,y:495,w:GW,h:190,xmin:-3.4,xmax:3.4,ymin:-7.5,ymax:7.5,xlabel:'t [s]',ylabel:'',xticks:ticks?[-3,-2,-1,1,2,3]:[],yticks:[-6,-4,-2,2,4,6],grid:false,g,xcolor:C.t,ycolor:C.v});
 const svg=T.svg+T.plot(xt,{from:-3.35,to:3.35,color:C.x,w:4})+fade(g,label('傾き dx/dt ＝ 2t [m/s]',GX-10,312,{size:22,color:C.v}))+B.svg+B.plot(t=>2*t,{from:-3.4,to:3.4,color:C.v,w:4});
 return {T,B,svg};
}
// tangent on the top graph at t, clipped to the plot box
function tan(T,t,{g=1,half=1.1,color=C.hi,w=4}={}){
 const k=2*t,pts=[];for(let i=0;i<=20;i++){const u=t-half+2*half*i/20;if(u<-3.4||u>3.4)continue;const v=xt(t)+k*(u-t);if(v<-.3||v>11.8)continue;pts.push([T.X(u),T.Y(v)]);}
 return draw(pts,g,{color,w});
}
function mark(S,t,{g=1,lab=true,slopeText=true}={}){
 const {T,B}=S;let s=tan(S.T,t,{g})+dot(T.X(t),T.Y(xt(t)),8,C.hi)+dot(B.X(t),B.Y(2*t),9,C.v);
 s+=line(T.X(t),T.Y(xt(t))+10,T.X(t),B.Y(2*t)-10,{color:C.hi,w:2,dash:'6 6',opacity:.7});
 if(lab)s+=label(`t＝${fmt(t,1)}`,T.X(t),T.Y(0)+30,{size:22,color:C.t,anchor:'middle'});
 if(slopeText)s+=label(`${fmt(2*t,1)}`,B.X(t)+(t<0?-16:16),B.Y(2*t)+8,{size:24,color:C.v,anchor:t<0?'end':'start',weight:700});
 return fade(g,s);
}

// number line of difference quotients around 2 (scene 3)
function qline({g=1,right=[1,1],left=[1,1],arrows=1,x0=120,x1=1080,y=250}={}){
 const lo=1.85,hi=2.15,X=v=>x0+(x1-x0)*(v-lo)/(hi-lo);
 let s=line(x0,y,x1,y,{color:C.dim,w:3});
 [1.9,1.95,2,2.05,2.1].forEach(v=>{s+=line(X(v),y-8,X(v),y+8,{color:C.dim,w:2})+(v===2||v===1.9||v===2.1?'':label(String(v),X(v),y+40,{size:22,color:C.dim,anchor:'middle'}));});
 s+=line(X(2),y-90,X(2),y+14,{color:C.hi,w:3,dash:'8 6'})+label('2',X(2),y-100,{size:32,color:C.hi,anchor:'middle',weight:700});
 [[2.1,right[0],'h ＝ 0.1'],[2.01,right[1],'h ＝ 0.01']].forEach(([v,gg,t],i)=>{const an=i?'start':'middle',dx=i?4:0;s+=fade(gg,dot(X(v),y,10,C.v)+label(String(v),X(v)+dx,y-24,{size:24,color:C.v,anchor:an,weight:700})+label(t,X(v)+dx,y+(i?80:40),{size:22,color:C.t,anchor:an}));});
 [[1.9,left[0],'h ＝ −0.1'],[1.99,left[1],'h ＝ −0.01']].forEach(([v,gg,t],i)=>{const an=i?'end':'middle',dx=i?-4:0;s+=fade(gg,dot(X(v),y,10,C.x)+label(String(v),X(v)+dx,y-24,{size:24,color:C.x,anchor:an,weight:700})+label(t,X(v)+dx,y+(i?80:40),{size:22,color:C.t,anchor:an}));});
 s+=arrow(X(2.14),y+130,X(2)+12,y+130,{color:C.v,w:4,g:arrows})+arrow(X(1.86),y+130,X(2)-12,y+130,{color:C.x,w:4,g:arrows});
 s+=fade(arrows,label('右側から',X(2.075),y+168,{size:24,color:C.v,anchor:'middle'})+label('左側から',X(1.925),y+168,{size:24,color:C.x,anchor:'middle'}));
 return fade(g,s);
}

export const ytUmAvgRate2Diagrams={
 // ================= S1 前回の問い =================
 [K+'recap']:(p)=>{
  let s=label('前回：x ＝ t²',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.25),tex(`${Q}=\\dfrac{2t${Hc}+${Hc}^2}{${Hc}}`,420,220,{size:54}));
  s+=fade(seg(p,.4,.6),tex(`=2t+${Hc}`,860,220,{size:60})+label('展開 → 約分（h ≠ 0）',600,350,{size:30,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),highlight(860-texWidth(`=2t+${Hc}`,60)/2-20,170,texWidth(`=2t+${Hc}`,60)+40,95,1));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(200,50,800,150,label('今回の問い',600,95,{size:26,color:C.dim,anchor:'middle'})+label('この h に、そのまま 0 を入れてよい？',600,160,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=card(120,240,440,230,label('約分の前',340,285,{size:28,color:C.dim,anchor:'middle'})+tex(Q,340,390,{size:52}),seg(p,.45,.6));
  s+=card(640,240,440,230,label('約分の後',860,285,{size:28,color:C.dim,anchor:'middle'})+tex(`2t+${Hc}`,860,390,{size:60}),seg(p,.55,.7));
  return s;
 },
 // ================= S2 h＝0 を代入すると =================
 [K+'before']:(p)=>{
  let s=label('約分の前の式',300,70,{size:28,color:C.dim,anchor:'middle'})+tex(Q,300,190,{size:62});
  s+=fade(seg(p,.1,.25),label('h ＝ 0 を入れる',300,310,{size:30,color:C.a,anchor:'middle',weight:700})+arrow(480,190,620,190,{color:C.a,w:4}));
  s+=fade(seg(p,.3,.5),tex('(t+0)^2-t^2',880,150,{size:50}));
  s+=fade(seg(p,.55,.7),tex('=t^2-t^2=0',880,240,{size:50}));
  s+=fade(seg(p,.7,.85),label('分子 ＝ 0',880,330,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'zero']:(p)=>{
  let s=tex(Q,300,190,{size:62,opacity:.7})+arrow(480,190,620,190,{color:C.a,w:4})+label('h ＝ 0',550,235,{size:26,color:C.a,anchor:'middle'});
  s+=tex('\\dfrac{(t+0)^2-t^2}{0}',880,190,{size:54,color:C.ink});
  s+=fade(seg(p,.1,.25),label('分母 ＝ 0',880,300,{size:28,color:C.a,anchor:'middle'}));
  s+=fade(seg(p,.4,.6),tex('=\\dfrac{0}{0}',880,410,{size:62,auto:false,color:C.a}));
  return s;
 },
 [K+'undecided']:(p)=>{
  let s=tex('\\dfrac{0}{0}=\\;\\square\\ ?',280,130,{size:62,auto:false,color:C.a});
  s+=fade(seg(p,.1,.25),label('確かめ：□ × 0 ＝ 0',280,250,{size:32,color:C.ink,anchor:'middle'}));
  const cands=['2','10','−6','100'];
  s+=card(600,50,560,330,label('□ に入れると',880,100,{size:28,color:C.dim,anchor:'middle'})
   +cands.map((c,i)=>fade(seg(p,.25+i*.1,.35+i*.1),label(`${c} × 0 ＝ 0`,820,165+i*60,{size:32,color:C.ink,anchor:'middle'})+label('✓',1010,165+i*60,{size:32,color:C.F,anchor:'middle',weight:700}))).join(''),seg(p,.2,.3));
  s+=fade(seg(p,.72,.87),label('どの数でも合う → 一つに決まらない',600,460,{size:34,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  let s=tex(`\\dfrac{${Hc}\\,(2t+${Hc})}{${Hc}}=2t+${Hc}`,420,170,{size:60});
  s+=card(760,80,410,150,label('約分できたのは',965,135,{size:28,color:C.ink,anchor:'middle'})+label('h ≠ 0 だから',965,190,{size:34,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  s+=card(200,320,800,120,label('h ＝ 0 では、約分そのものが 使えない',600,392,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'predict']:(p)=>{
  let s=label('約分の後',600,70,{size:28,color:C.dim,anchor:'middle'})+tex(`2t+${Hc}`,600,170,{size:78});
  s+=fade(seg(p,.2,.35),tex(`${Hc}\\to 0`,600,285,{size:52,auto:false,color:C.t}));
  s+=card(300,340,600,120,label('何が 残る？',600,415,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.5),C.hi);
  return s;
 },
 [K+'approach']:(p)=>{
  let s=tex(`${Q}=2t+${Hc}`,600,100,{size:52})+fade(seg(p,.5,.65),label('（h ≠ 0 の間は ずっと等しい）',600,190,{size:28,color:C.F,anchor:'middle'}));
  // number line of h: points walk toward 0 but 0 itself stays an open ring
  const x0=150,x1=1050,y=330,lo=-.2,hi=1.1,X=v=>x0+(x1-x0)*(v-lo)/(hi-lo);
  s+=line(x0,y,x1,y,{color:C.dim,w:3})+label('h',x1+20,y+8,{size:28,color:C.t});
  [0,.5,1].forEach(v=>{s+=line(X(v),y-8,X(v),y+8,{color:C.dim,w:2})+label(String(v),X(v),y+40,{size:24,color:C.dim,anchor:'middle'});});
  s+=ring(X(0),y,13,{color:C.a,w:3,fill:C.bg})+label('0 には しない',X(0),y+80,{size:24,color:C.a,anchor:'middle'});
  const hv=Math.pow(10,-2.3*smooth(seg(p,.1,.8)));
  s+=dot(X(hv),y,11,C.t)+label(`h ＝ ${fmt(hv,3)}`,X(hv),y-26,{size:24,color:C.t,anchor:'middle'});
  s+=arrow(X(.9),y+80,X(.12),y+80,{color:C.t,w:4,g:seg(p,.1,.35)});
  return s;
 },
 [K+'shrink']:(p)=>{
  const R=`2t+${Hc}`,sz=70,W=texWidth(R,sz),left=600-W/2;
  let s=tex(R,600,100,{size:sz});
  const hv=Math.pow(10,-3*smooth(seg(p,.15,.8))),k=240,y=250;
  s+=label('t ＝ 1 の例',250,y-30,{size:26,color:C.dim});
  s+=rect(250,y,k*2,50,{fill:C.v,fo:.55,rx:6})+rect(250+k*2,y,k*hv,50,{fill:C.t,fo:.85,rx:6});
  s+=label('2t ＝ 2',250+k,y+35,{size:28,color:C.ink,anchor:'middle'})+fade(clamp(hv*2.5),label('h',250+k*2+k*hv/2,y+35,{size:26,color:C.bg,anchor:'middle',weight:700}));
  s+=label(`h ＝ ${hv<.0015?'0.001':fmt(hv,3)}　→　2t ＋ h ＝ ${fmt(2+hv,3)}`,250,y+110,{size:30,color:C.v,weight:700});
  s+=fade(seg(p,.75,.9),label('h の部分が消えて、2t へ いくらでも近づく',600,470,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'notsub']:(p)=>{
  let s=card(100,70,1000,150,label('✕',170,165,{size:48,color:C.a,anchor:'middle',weight:700})+label('h ＝ 0 を 入れて 計算する',230,140,{size:32,color:C.ink})+tex('\\to\\ \\dfrac{0}{0}',900,150,{size:44,auto:false,color:C.a})+label('決まらない',230,190,{size:26,color:C.a}),seg(p,0,.15),C.a);
  s+=card(100,260,1000,170,label('○',170,365,{size:48,color:C.F,anchor:'middle',weight:700})+label('0 でない h で 成り立つ式の',230,330,{size:32,color:C.ink})+label('向かっていく先を 読む',230,385,{size:32,color:C.F,weight:700})+tex(`2t+${Hc}\\ \\to\\ 2t`,900,350,{size:44}),seg(p,.3,.45),C.F);
  return s;
 },
 // ================= S3 両側から近づける =================
 [K+'neg']:(p)=>{
  const {A,svg}=graph();let s=svg+dot(A.X(1),A.Y(1),9,C.hi)+label('t ＝ 1',A.X(1)+14,A.Y(1)+30,{size:22,color:C.hi});
  const t2=mix(1.1,.9,smooth(seg(p,.3,.6)));
  s+=secant(A,1,t2,{ext:.7})+dot(A.X(t2),A.Y(xt(t2)),9,t2<1?C.x:C.v);
  s+=fade(seg(p,.55,.7),label('0.9 s',A.X(.9)-8,A.Y(0)+64,{size:22,color:C.x,anchor:'end'})+line(A.X(.9),A.Y(0),A.X(1),A.Y(0),{color:C.x,w:8}));
  s+=card(RX,100,RW,300,label('h は 負でもよい',RC,160,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),label('h ＝ −0.1',RC,235,{size:36,color:C.t,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('もう一つの点：0.9 秒',RC,305,{size:28,color:C.x,anchor:'middle'})+label('（左側）',RC,350,{size:26,color:C.x,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'negcalc']:(p)=>{
  const {A,svg}=graph();let s=svg+secant(A,.9,1,{ext:.7})+dot(A.X(1),A.Y(1),9,C.hi)+dot(A.X(.9),A.Y(.81),9,C.x);
  s+=card(RX-40,80,RW+40,390,label('t ＝ 1，h ＝ −0.1',RC-20,130,{size:30,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,.02,.2),tex('0.9^2=0.81',RC-20,200,{size:42,auto:false,color:C.x}))
   +fade(seg(p,.3,.5),tex('\\dfrac{0.81-1}{-0.1}',RC-110,305,{size:40,auto:false}))
   +fade(seg(p,.45,.6),tex('=\\dfrac{-0.19}{-0.1}',RC+70,305,{size:40,auto:false}))
   +fade(seg(p,.7,.85),tex('=1.9',RC-20,410,{size:48,auto:false,color:C.x})),1);
  return s;
 },
 [K+'negformula']:(p)=>{
  let s=tex(`2t+${Hc}`,600,90,{size:60});
  const rows=[['h ＝ −0.1','2 ＋ (−0.1)','1.9'],['h ＝ −0.01','2 ＋ (−0.01)','1.99']];
  s+=card(120,160,960,260,rows.map(([a,b,c],i)=>{const y=245+i*100,g=i===0?seg(p,.05,.2):seg(p,.55,.7);return fade(g,label(a,200,y,{size:32,color:C.t})+label(b,640,y,{size:34,color:C.ink,anchor:'middle'})+label(`＝ ${c}`,900,y,{size:36,color:C.x,weight:700}));}).join('')+label('t ＝ 1',1050,200,{size:24,color:C.dim,anchor:'end'}),seg(p,0,.15));
  s+=fade(seg(p,.3,.45),label('数値の 1.9 と 一致 ✓',600,475,{size:30,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'both']:(p)=>qline({right:[seg(p,.02,.15),seg(p,.12,.25)],left:[seg(p,.35,.48),seg(p,.45,.58)],arrows:seg(p,.65,.85)}),
 [K+'word']:(p)=>{
  let s=qline({});
  s=`<g transform="translate(0 -60)">${s}</g>`;
  s+=card(150,400,900,100,label('両側から、ただ一つの値へ ＝ 行き先',600,445,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('（不等式による厳密な定義は、ここでは扱わない）',600,485,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.2),C.hi);
  return s;
 },
 // ================= S4 lim と dx/dt =================
 [K+'lim']:(p)=>{
  let s=tex('\\lim_{h\\to 0}',330,200,{size:110,auto:false});
  s+=fade(seg(p,.1,.25),arrow(430,150,560,120,{color:C.hi,w:3})+label('lim：近づけたときの 行き先',575,125,{size:32,color:C.hi,weight:700}));
  s+=fade(seg(p,.55,.7),arrow(420,285,560,320,{color:C.t,w:3})+label('h → 0：h を 0 へ近づける',575,330,{size:32,color:C.t,weight:700}));
  s+=fade(seg(p,.75,.9),label('（近づけ方を 下に書く）',575,385,{size:26,color:C.dim}));
  return s;
 },
 [K+'limeq']:(p)=>{
  const A=`\\lim_{h\\to 0}${Q}`,B=`=\\lim_{h\\to 0}\\,(2t+${Hc})`,Cc='=2t',sz=52,wA=texWidth(A,sz),wB=texWidth(B,sz),wC=texWidth(Cc,sz);
  const x0=600-(wA+wB+wC+40)/2,xB=x0+wA+20,xC=xB+wB+20;
  let s=tex(A,x0,180,{size:sz,anchor:'start'});
  s+=fade(seg(p,.25,.45),tex(B,xB,180,{size:sz,anchor:'start'})+label('約分（h ≠ 0）',xB+wB/2,300,{size:26,color:C.F,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),tex(Cc,xC,180,{size:sz,anchor:'start',color:C.v}));
  s+=fade(seg(p,.65,.85),label('h → 0 の 行き先',xC+wC/2,360,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.95),highlight(xC-14,130,wC+28,95,1));
  return s;
 },
 [K+'dxdt']:(p)=>{
  const R=`\\dfrac{dx}{dt}=\\lim_{h\\to 0}${Q}=2t`;
  let s=tex(R,600,190,{size:54});
  s+=fade(seg(p,.05,.2),highlight(600-texWidth(R,54)/2-16,120,texWidth('\\dfrac{dx}{dt}',54)+30,140,1));
  s+=fade(seg(p,.5,.65),card(250,340,700,120,tex('\\dfrac{\\Delta x}{\\Delta t}\\ \\longrightarrow\\ \\dfrac{dx}{dt}',600,405,{size:44})+label('初級',300,395,{size:24,color:C.dim}),1));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=tex('\\dfrac{dx}{dt}',260,180,{size:80});
  s+=fade(seg(p,.05,.2),label('割り算の答え ではない',260,320,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(520,90,640,300,label('単位は 組み立てのまま',840,145,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.4,.55),tex('\\dfrac{x\\ [\\mathrm{m}]}{t\\ [\\mathrm{s}]}',740,265,{size:52}))
   +fade(seg(p,.6,.75),tex('\\to\\ \\mathrm{m/s}',960,265,{size:52,auto:false,color:C.v}))
   +fade(seg(p,.7,.85),label('メートル毎秒',840,355,{size:30,color:C.v,anchor:'middle',weight:700})),seg(p,.3,.45));
  return s;
 },
 [K+'notdiv']:(p)=>{
  let s=tex('\\dfrac{dx}{dt}=2t',600,130,{size:72});
  s+=card(100,240,480,160,label('✕ 0 で割って 出した値',340,310,{size:32,color:C.a,anchor:'middle',weight:700})+label('（0 ÷ 0 は決まらない）',340,360,{size:26,color:C.dim,anchor:'middle'}),seg(p,.1,.25),C.a);
  s+=card(620,240,480,160,label('○ 0 へ近づけた先の値',860,310,{size:32,color:C.F,anchor:'middle',weight:700})+label('（行き先）',860,360,{size:26,color:C.dim,anchor:'middle'}),seg(p,.4,.55),C.F);
  return s;
 },
 // ================= S5 dx/dt は、時刻の関数 =================
 [K+'func']:(p)=>{
  let s=tex('\\dfrac{dx}{dt}=2t',600,100,{size:64});
  s+=fade(seg(p,.1,.25),brace(600+texWidth('\\dfrac{dx}{dt}=',64)/2-texWidth('2t',64)/2-10,600+texWidth('\\dfrac{dx}{dt}=2t',64)/2,150,{color:C.t,text:'t が 文字のまま',size:26}));
  // a machine: time in, slope out
  const g=seg(p,.45,.6);
  s+=fade(g,rect(460,300,280,120,{fill:C.v,fo:.18,stroke:C.v,sw:3,rx:14})+label('2 倍する',600,372,{size:34,color:C.v,anchor:'middle',weight:700})
   +arrow(250,360,450,360,{color:C.t,w:5})+label('時刻 t',300,340,{size:28,color:C.t,anchor:'middle'})
   +arrow(750,360,950,360,{color:C.v,w:5})+label('傾き',900,340,{size:28,color:C.v,anchor:'middle'}));
  const inp=[['1','2'],['2','4'],['−3','−6']],k=Math.min(2,Math.floor(seg(p,.6,1)*3));
  s+=fade(seg(p,.6,.7),label(inp[k][0],300,405,{size:32,color:C.t,anchor:'middle',weight:700})+label(inp[k][1],900,405,{size:32,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.7),label('一つの数ではなく 関数',600,480,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'graphs']:(p)=>{
  const S=stack({g:seg(p,0,.15)});let s=S.svg;
  const t=mix(-2.5,2.5,smooth(seg(p,.35,.95)));
  s+=fade(seg(p,.3,.4),mark(S,t,{lab:false}));
  s+=card(700,60,480,170,label('上：x ＝ t²',740,110,{size:30,color:C.x})+label('下：dx/dt ＝ 2t',740,165,{size:30,color:C.v}),seg(p,.05,.2));
  s+=card(700,260,480,200,label('上の 接線の傾き',940,320,{size:30,color:C.hi,anchor:'middle',weight:700})+label('＝',940,370,{size:30,color:C.ink,anchor:'middle'})+label('下の グラフの 高さ',940,420,{size:30,color:C.v,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'t12']:(p)=>{
  const S=stack();let s=S.svg+mark(S,1,{g:seg(p,.02,.2)})+mark(S,2,{g:seg(p,.3,.5)});
  s+=card(700,60,480,260,label('t ＝ 1 s　→　傾き 2',940,130,{size:32,color:C.v,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('t ＝ 2 s　→　傾き 4',940,195,{size:32,color:C.v,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('2 秒の接線は 2 倍の急さ',940,270,{size:30,color:C.hi,anchor:'middle'})),1);
  return s;
 },
 [K+'neg3']:(p)=>{
  const S=stack();let s=S.svg+mark(S,-3,{g:seg(p,.02,.25)});
  s+=card(700,60,480,340,label('t ＝ −3 s　→　傾き −6',940,125,{size:32,color:C.v,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('負の傾き',940,200,{size:30,color:C.a,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.6),label('t が増えると x が減る',940,260,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.65,.8),arrow(1020,330,860,330,{color:C.x,w:5})+label('戻る向き',940,375,{size:28,color:C.x,anchor:'middle'})),1);
  return s;
 },
 [K+'notval']:(p)=>{
  const S=stack();let s=S.svg+mark(S,-3);
  s+=fade(seg(p,.05,.2),label('x ＝ 9',S.T.X(-3)+16,S.T.Y(9)+6,{size:26,color:C.x,weight:700}));
  s+=card(700,60,480,340,label('位置の値',940,120,{size:28,color:C.x,anchor:'middle'})
   +fade(seg(p,.05,.2),tex('x=(-3)^2=9',940,185,{size:44}))
   +fade(seg(p,.35,.5),label('傾き',940,265,{size:28,color:C.v,anchor:'middle'})+tex('\\dfrac{dx}{dt}=2\\times(-3)=-6',940,335,{size:40}))
   ,1);
  s+=fade(seg(p,.6,.75),label('値と傾きを 取り違えない',940,460,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'zero0']:(p)=>{
  const S=stack();let s=S.svg+mark(S,0,{g:seg(p,.02,.2),slopeText:false});
  s+=fade(seg(p,.1,.25),label('0',S.B.X(0)+16,S.B.Y(0)-14,{size:24,color:C.v,weight:700}));
  s+=fade(seg(p,.45,.6),mark(S,-1.5,{lab:false,slopeText:false}));
  s+=fade(seg(p,.5,.65),rect(S.B.X(-3.4),S.B.Y(0),S.B.X(0)-S.B.X(-3.4),S.B.Y(-7.5)-S.B.Y(0),{fill:C.a,fo:.08,stroke:'none',rx:0}));
  s+=card(700,60,480,340,label('t ＝ 0：接線は 水平',940,125,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('下の高さ 0',940,180,{size:28,color:C.v,anchor:'middle'})
   +fade(seg(p,.45,.6),label('t ＜ 0：接線は 右下がり',940,265,{size:30,color:C.a,anchor:'middle',weight:700})
    +label('下のグラフも 負',940,320,{size:28,color:C.v,anchor:'middle'})),1);
  return s;
 },
 [K+'quiz']:(p)=>{
  const S=stack();let s=S.svg+fade(seg(p,.1,.25),tan(S.T,1.5)+dot(S.T.X(1.5),S.T.Y(2.25),8,C.hi)+label('t ＝ 1.5',S.T.X(1.5),S.T.Y(0)+30,{size:22,color:C.t,anchor:'middle'}));
  s+=card(700,100,480,260,label('考えてみよう',940,160,{size:28,color:C.hi,anchor:'middle'})+label('t ＝ 1.5 での',940,235,{size:36,color:C.t,anchor:'middle',weight:700})+label('傾きは いくつ？',940,300,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'quiz2']:(p)=>{
  const S=stack();let s=S.svg+mark(S,1.5,{g:seg(p,.2,.4)});
  s+=card(700,100,480,300,tex('2t=2\\times1.5=3',940,175,{size:44})
   +fade(seg(p,.4,.55),label('上：接線の傾き 3',940,275,{size:30,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('下：高さ 3　一致 ✓',940,340,{size:30,color:C.v,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'op']:(p)=>{
  let s=card(80,110,400,220,label('位置の関数',280,165,{size:28,color:C.x,anchor:'middle'})+tex('x=t^2',280,265,{size:64}),seg(p,0,.15),C.x);
  s+=fade(seg(p,.2,.4),arrow(500,220,700,220,{color:C.hi,w:6})+label('微分',600,190,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=card(720,110,400,220,label('傾きを返す関数',920,165,{size:28,color:C.v,anchor:'middle'})+tex('\\dfrac{dx}{dt}=2t',920,270,{size:56}),seg(p,.35,.5),C.v);
  s+=fade(seg(p,.6,.75),label('各時刻の傾きを返す関数を 作る操作',600,430,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sin']:(p)=>{
  let s=label('同じ手順を sin に',600,80,{size:32,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.3),tex(`\\dfrac{\\sin(t+${Hc})-\\sin t}{${Hc}}`,600,200,{size:56}));
  s+=card(250,320,700,130,label('角度は ラジアンで 測る',600,380,{size:36,color:C.hi,anchor:'middle',weight:700})+label('（初級で 確かめたこと）',600,425,{size:24,color:C.dim,anchor:'middle'}),seg(p,.45,.6),C.hi);
  return s;
 },
 // ================= S6 まとめと次の問い =================
 [K+'sum']:(p)=>{
  let s=card(60,50,1080,120,label('✕ 約分の前に h ＝ 0',120,122,{size:32,color:C.a,weight:700})+tex('\\to\\ \\dfrac{0}{0}',720,115,{size:40,auto:false,color:C.a})+label('決まらない',820,122,{size:30,color:C.a}),seg(p,0,.15),C.a);
  s+=card(60,200,1080,280,label('○ 約分してから 近づける',120,265,{size:32,color:C.F,weight:700})
   +fade(seg(p,.4,.6),tex(`\\lim_{h\\to 0}${Q}=\\lim_{h\\to 0}\\,(2t+${Hc})=2t`,600,385,{size:50})),seg(p,.3,.45),C.F);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=tex('\\dfrac{dx}{dt}=2t',600,130,{size:78});
  s+=fade(seg(p,.3,.45),label('x ＝ t² の微分',600,250,{size:30,color:C.dim,anchor:'middle'}));
  s+=card(250,320,700,120,label('時刻ごとに 傾きを返す 関数',600,392,{size:36,color:C.v,anchor:'middle',weight:700}),seg(p,.5,.65),C.v);
  return s;
 },
 [K+'back']:(p)=>{
  let s=label('初級',600,70,{size:26,color:C.dim,anchor:'middle'});
  s+=tex('x=5t^2',330,170,{size:60})+fade(seg(p,.1,.25),arrow(470,170,640,170,{color:C.hi,w:5})+tex('v=10t',850,170,{size:60,color:C.v}));
  s+=fade(seg(p,.45,.6),tex('10t=5\\times 2t',600,320,{size:56}));
  s+=fade(seg(p,.65,.8),label('x ＝ t² の 2t の 5 倍 ── 同じ手順',600,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next1']:(p)=>{
  let s=card(80,130,400,200,label('位置の式',280,185,{size:28,color:C.x,anchor:'middle'})+tex('x=t^2',280,275,{size:60}),1,C.x);
  s+=fade(seg(p,.1,.3),arrow(500,230,700,230,{color:C.hi,w:6})+label('微分',600,200,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(720,130,400,200,label('傾きの式 ＝ 速度の式',920,185,{size:28,color:C.v,anchor:'middle'})+tex('v=2t',920,275,{size:60,color:C.v}),seg(p,.25,.4),C.v);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(80,90,400,200,label('速度の式',280,145,{size:28,color:C.v,anchor:'middle'})+tex('v=2t',280,235,{size:60,color:C.v}),1,C.v);
  s+=fade(seg(p,.15,.35),arrow(500,190,700,190,{color:C.hi,w:6})+label('？',600,160,{size:40,color:C.hi,anchor:'middle',weight:700}));
  s+=card(720,90,400,200,label('進んだ距離の式',920,145,{size:28,color:C.x,anchor:'middle'})+label('？',920,245,{size:60,color:C.x,anchor:'middle',weight:700}),seg(p,.3,.45),C.x);
  s+=card(200,340,800,110,label('次：速度の式から、進んだ距離を 式で取り出すには？',600,405,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
};
