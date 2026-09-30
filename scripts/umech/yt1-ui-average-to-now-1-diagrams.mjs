// YouTube 5分シリーズ「微分・初級 1/3」— 平均の速さの意味と、足りないところ。Stage 1200×515.
// Colours (anim.mjs C): position x cyan, speed v purple, time t gold, highlight yellow.
// People in the two-runner example: 歩く人 = cyan-ish ink, 走る人 = orange (not a physical quantity here).
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,poly} from './anim.mjs';

const K='ui-average-to-now-1:';
const WALK='#8fd3ff',RUN=C.E;

// ---- speedometer (from the 1-minute pilot) -------------------------------------------------
function meter(cx,cy,r,kmh,{readout=''}={}){
 const MAX=60,ang=v=>(210-240*clamp(v/MAX))*Math.PI/180,P=(v,rr)=>[cx+rr*Math.cos(ang(v)),cy-rr*Math.sin(ang(v))];
 let s=ring(cx,cy,r+14,{color:C.faint,w:3,fill:'#10182c'});
 s+=draw(Array.from({length:61},(_,i)=>P(i,r)),1,{color:C.dim,w:4});
 for(let v=0;v<=MAX;v+=10){const [x1,y1]=P(v,r-6),[x2,y2]=P(v,r-26),[lx,ly]=P(v,r-52);s+=line(x1,y1,x2,y2,{color:C.dim,w:3})+label(String(v),lx,ly+8,{size:22,color:C.dim,anchor:'middle'});}
 const [nx,ny]=P(kmh,r-30);s+=line(cx,cy,nx,ny,{color:C.a,w:6})+dot(cx,cy,10,C.a);
 s+=label('km/h',cx,cy+50,{size:22,color:C.dim,anchor:'middle'});
 if(readout){const w=Math.max(200,readout.length*22);s+=rect(cx-w/2,cy+r+30,w,52,{fill:'#0d1526',fo:1,stroke:C.v,sw:2,rx:10})+label(readout,cx,cy+r+66,{size:28,color:C.v,anchor:'middle',weight:700});}
 return s;
}
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const needle=p=>34+8*Math.sin(p*7)+4*Math.sin(p*17);

// ---- 100 m in 20 s ----------------------------------------------------------------------
function road(x1,x2,y,{g=1,marks=true}={}){
 let s=rect(x1-10,y-18,x2-x1+20,36,{fill:'#1a2540',fo:1,stroke:C.faint,rx:8})+line(x1,y,x2,y,{color:C.faint,w:2,dash:'14 12'});
 if(marks)s+=line(x1,y-30,x1,y+30,{color:C.dim,w:3})+line(x2,y-30,x2,y+30,{color:C.dim,w:3})
  +label('0 m',x1,y+58,{size:22,color:C.dim,anchor:'middle'})+label('100 m',x2,y+58,{size:22,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
const RX1=150,RX2=1050,RX=m=>mix(RX1,RX2,m/100);

// x–t graph for the 20-second examples
const G20=(g=1)=>axes({x:110,y:450,w:470,h:320,xmax:22,ymax:115,xlabel:'t [s]',ylabel:'位置 x [m]',xticks:[5,10,15,20],yticks:[25,50,75,100],grid:true,g,xcolor:C.t,ycolor:C.x});
const xw=t=>5*t, xr=t=>t<7.5?0:8*(t-7.5);
function paths(A,{w=1,r=1,wp=1,rp=1}={}){
 let s='';
 if(w>0)s+=fade(w,A.plot(xw,{from:0,to:20,p:wp,color:WALK,w:4}));
 if(r>0)s+=fade(r,draw([[A.X(0),A.Y(0)],[A.X(7.5),A.Y(0)],[A.X(20),A.Y(100)]],rp,{color:RUN,w:4}));
 return s;
}
// two lanes on the right, dots at the positions reached at time t
function lanes(t,{w=1,r=1}={}){
 const L1=700,L2=1140,Y1=105,Y2=185,P=m=>mix(L1,L2,m/100);
 let s='';
 const one=(y,m,color,name,g)=>fade(g,rect(L1-8,y-14,L2-L1+16,28,{fill:'#1a2540',fo:1,stroke:C.faint,rx:8})+label(name,L1-14,y+8,{size:22,color,anchor:'end'})+dot(P(m),y,11,color));
 s+=one(Y1,xw(t),WALK,'歩く人',w)+one(Y2,xr(t),RUN,'走る人',r);
 s+=fade(Math.max(w,r),label('0 m',L1,Y2+44,{size:22,color:C.dim,anchor:'middle'})+label('100 m',L2,Y2+44,{size:22,color:C.dim,anchor:'middle'})+label(`t ＝ ${fmt(t,1)} s`,920,Y2+44,{size:24,color:C.t,anchor:'middle'}));
 return s;
}

// ---- x = 5t² ------------------------------------------------------------------------------
const xt=t=>5*t*t;
const G5=(g=1)=>axes({x:110,y:450,w:500,h:340,xmax:2.3,ymax:26,xlabel:'t [s]',ylabel:'位置 x [m]',xticks:[1,2],yticks:[5,10,15,20,25],grid:true,g,xcolor:C.t,ycolor:C.x});
function curve(A,p=1){return A.plot(xt,{from:0,to:2.2,p,color:C.x,w:4});}
function pt(A,t,g=1,color=C.hi){return fade(g,dot(A.X(t),A.Y(xt(t)),9,color));}
function secant(A,t1,t2,{g=1,color=C.v,w=4,ext=.3,dash=''}={}){
 const k=(xt(t2)-xt(t1))/(t2-t1),a=Math.max(-.05,t1-ext),b=Math.min(2.25,t2+ext);
 return draw([[A.X(a),A.Y(xt(t1)+k*(a-t1))],[A.X(b),A.Y(xt(t1)+k*(b-t1))]],g,{color,w,dash});
}
function guides(A,t,g=1){const x=A.X(t),y=A.Y(xt(t));return fade(g,line(x,y,x,A.Y(0),{color:C.t,w:2,dash:'6 6'})+line(x,y,A.X(0),y,{color:C.x,w:2,dash:'6 6'}));}

export const ytAverageToNow1={
 // ================= S1 いまの速さ =================
 [K+'meter']:(p)=>{
  let s=meter(300,235,130,needle(p),{readout:'いま ？ km/h'});
  s+=fade(seg(p,.1,.3),label('いま、この瞬間の',700,200,{size:36,color:C.ink})+label('速さ',700,262,{size:44,color:C.v,weight:700}));
  s+=fade(seg(p,.55,.75),arrow(700,350,760,350,{color:C.a,w:4,g:1})+label('針は 刻々と動く',780,360,{size:28,color:C.dim}));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=meter(300,235,130,needle(1+p),{readout:'いま ？ km/h'});
  s+=card(640,120,520,250,
   label('速さ ＝ 距離 ÷ 時間',900,215,{size:40,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.45,.65),label('進んだ距離',760,300,{size:28,color:C.x,anchor:'middle'})+label('÷',900,300,{size:28,color:C.dim,anchor:'middle'})+label('かかった時間',1040,300,{size:28,color:C.t,anchor:'middle'})),seg(p,.05,.25));
  return s;
 },
 [K+'zero']:(p)=>{
  let s=meter(300,235,130,needle(2+p),{readout:'いま ？ km/h'});
  s+=card(640,40,520,90,label('速さ ＝ 距離 ÷ 時間',900,98,{size:32,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.05,.25),label('一瞬では',680,200,{size:30,color:C.ink})+label('距離 0 m ／ 時間 0 s',680,250,{size:30,color:C.dim}));
  s+=fade(seg(p,.45,.6),tex('\\dfrac{0\\,\\mathrm{m}}{0\\,\\mathrm{s}}=\\;?',900,355,{size:56,auto:false,color:C.ink}));
  s+=fade(seg(p,.7,.85),label('値が 決まらない',900,480,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'question']:(p)=>{
  let s=meter(300,235,130,needle(3+p),{readout:'いま ？ km/h'});
  s+=card(640,140,520,230,label('メーターが指す',900,210,{size:30,color:C.dim,anchor:'middle'})+label('「いまの速さ」とは？',900,290,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'series']:(p)=>{
  const items=[['1','平均の速さ'],['2','区間を縮める'],['3','瞬間の速さ']];
  let s=fade(seg(p,0,.15),label('微分を 組み立てる 3回',600,90,{size:34,color:C.ink,anchor:'middle',weight:700}));
  items.forEach(([n,t],i)=>{const x=110+i*340,g=seg(p,.15+i*.15,.3+i*.15);
   s+=card(x,160,300,200,label(n,x+150,240,{size:52,color:C.hi,anchor:'middle',weight:700})+label(t,x+150,315,{size:30,color:C.ink,anchor:'middle'}),g);
   if(i<2)s+=arrow(x+310,260,x+330,260,{color:C.dim,w:3,head:12,g});});
  s+=fade(seg(p,.7,.85),label('ゴール：「いまの速さ」を 決める',600,440,{size:30,color:C.v,anchor:'middle'}));
  return s;
 },
 [K+'series1']:(p)=>{
  const items=[['1','平均の速さ'],['2','区間を縮める'],['3','瞬間の速さ']];
  let s=label('微分を 組み立てる 3回',600,90,{size:34,color:C.ink,anchor:'middle',weight:700});
  const g=seg(p,.05,.3);
  items.forEach(([n,t],i)=>{const x=110+i*340,on=i===0;
   s+=fade(on?1:1-.6*g,card(x,160,300,200,label(n,x+150,240,{size:52,color:C.hi,anchor:'middle',weight:700})+label(t,x+150,315,{size:30,color:C.ink,anchor:'middle'}),1,on&&g>.5?C.hi:C.faint));
   if(i<2)s+=fade(1-.6*g,arrow(x+310,260,x+330,260,{color:C.dim,w:3,head:12}));});
  s+=fade(seg(p,.45,.6),label('何が 分かる？',140,430,{size:30,color:C.F})+label('何が 足りない？',140,480,{size:30,color:C.a}));
  s+=fade(seg(p,.05,.3),label('今回',260,145,{size:24,color:C.hi,anchor:'middle'}));
  return s;
 },
 // ================= S2 平均の速さ =================
 [K+'road']:(p)=>{
  const u=seg(p,.15,.8),t=20*u;
  let s=road(RX1,RX2,280);
  s+=dot(RX(100*u),280,14,C.hi);
  s+=fade(seg(p,.1,.2),label(`t ＝ ${fmt(t,0)} s`,600,140,{size:34,color:C.t,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.95),brace(RX1,RX2,340,{text:'100 m を 20 s で',color:C.x,size:28}));
  return s;
 },
 [K+'divide']:(p)=>{
  let s=road(RX1,RX2,110,{marks:false})+dot(RX(100),110,12,C.hi)+label('100 m',RX2,165,{size:22,color:C.x,anchor:'middle'})+label('20 s',RX1,165,{size:22,color:C.t,anchor:'middle'});
  const g1=seg(p,.02,.25),g2=seg(p,.45,.7);
  s+=fade(g1,tex('\\dfrac{100\\,\\mathrm{m}}{20\\,\\mathrm{s}}',470,330,{size:60,auto:false})+label('距離',330,290,{size:26,color:C.x,anchor:'end'})+label('時間',330,380,{size:26,color:C.t,anchor:'end'})+line(345,300,390,300,{color:C.x,w:2})+line(345,370,390,370,{color:C.t,w:2}));
  s+=fade(g2,tex('=5\\,\\mathrm{m/s}',700,330,{size:60,auto:false,color:C.v}));
  s+=fade(seg(p,.72,.9),label('秒速 5 メートル',700,450,{size:30,color:C.v,anchor:'middle'}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=road(RX1,RX2,150);
  const n=Math.floor(20*seg(p,.1,.6)+1e-6);
  for(let i=1;i<=n;i++)s+=line(RX(5*i),130,RX(5*i),170,{color:C.hi,w:3});
  s+=dot(RX(5*n),150,12,C.hi);
  s+=fade(seg(p,.25,.4),brace(RX(0),RX(5),110,{dir:-1,text:'1 s で 5 m',color:C.hi,size:24}));
  s+=fade(seg(p,.05,.25),tex('\\mathrm{m}\\div\\mathrm{s}=\\mathrm{m/s}',600,330,{size:48,auto:false}));
  s+=fade(seg(p,.2,.35),label('メートル毎秒',600,400,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),label('1秒あたりに 何m 進むか',600,470,{size:32,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'symbols']:(p)=>{
  let s=road(RX1,RX2,190)+dot(RX1,190,10,C.dim)+dot(RX2,190,12,C.hi);
  s+=fade(seg(p,.25,.45),brace(RX1,RX2,150,{dir:-1,color:C.x})+tex('\\Delta x=100\\,\\mathrm{m}',600,70,{size:40})+label('進んだ距離',860,78,{size:26,color:C.x}));
  s+=fade(seg(p,.55,.75),rect(RX1,330,RX2-RX1,22,{fill:C.t,fo:.35,rx:6})+label('0 s',RX1-16,349,{size:22,color:C.dim,anchor:'end'})+label('20 s',RX2+16,349,{size:22,color:C.dim})
   +brace(RX1,RX2,365,{dir:1,color:C.t})+tex('\\Delta t=20\\,\\mathrm{s}',600,462,{size:40})+label('時間の幅',860,470,{size:26,color:C.t}));
  return s;
 },
 [K+'delta']:(p)=>{
  let s=line(RX1,110,RX2,110,{color:C.dim,w:3})+label('位置',RX1-20,118,{size:24,color:C.x,anchor:'end'});
  s+=dot(RX1,110,10,C.dim)+label('始め x₁ ＝ 0 m',RX1,160,{size:26,color:C.dim,anchor:'middle'});
  s+=dot(RX2,110,12,C.hi)+label('終わり x₂ ＝ 100 m',RX2-40,160,{size:26,color:C.hi,anchor:'middle'});
  s+=fade(seg(p,.02,.2),label('Δ ＝ 差（終わり − 始め）',600,70,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=arrow(RX1,110,mix(RX1,RX2,seg(p,.3,.55)),110,{color:C.x,w:5,g:seg(p,.3,.55)>0?1:0});
  s+=fade(seg(p,.35,.55),tex('\\Delta x=x_2-x_1=100\\,\\mathrm{m}-0\\,\\mathrm{m}=100\\,\\mathrm{m}',600,275,{size:42}));
  s+=fade(seg(p,.7,.88),tex('\\Delta t=t_2-t_1=20\\,\\mathrm{s}-0\\,\\mathrm{s}=20\\,\\mathrm{s}',600,395,{size:42}));
  return s;
 },
 [K+'vbar']:(p)=>{
  let s=tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}',600,250,{size:80});
  const w=texWidth('\\bar v=\\dfrac{\\Delta x}{\\Delta t}',80),vx=600-w/2+18;
  s+=fade(seg(p,.1,.25),label('平均の速さ',600,90,{size:30,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),ring(vx,170,26,{color:C.hi,w:3})+arrow(vx-190,120,vx-34,160,{color:C.hi,w:3,head:14})+label('横棒 ＝「平均」の印',vx-200,110,{size:26,color:C.hi,anchor:'end'}));
  s+=fade(seg(p,.3,.5),tex('=\\dfrac{100\\,\\mathrm{m}}{20\\,\\mathrm{s}}=5\\,\\mathrm{m/s}',600,420,{size:44,auto:false,color:C.v}));
  return s;
 },
 [K+'slope']:(p)=>{
  const A=G20(seg(p,0,.15));
  let s=A.svg+fade(seg(p,.1,.2),dot(A.X(0),A.Y(0),9,C.hi)+dot(A.X(20),A.Y(100),9,C.hi)+label('始め',A.X(0)-12,A.Y(0)-12,{size:22,color:C.hi,anchor:'end'})+label('終わり',A.X(20)-14,A.Y(100)-18,{size:22,color:C.hi,anchor:'end'}));
  s+=draw([[A.X(0),A.Y(0)],[A.X(20),A.Y(100)]],seg(p,.2,.45),{color:C.v,w:5});
  const gt=seg(p,.45,.6),gx=seg(p,.55,.7);
  s+=line(A.X(0),A.Y(0),mix(A.X(0),A.X(20),gt),A.Y(0),{color:C.t,w:6})+fade(gt,label('Δt ＝ 20 s',A.X(10),A.Y(0)-14,{size:24,color:C.t,anchor:'middle'}));
  s+=line(A.X(20),A.Y(0),A.X(20),mix(A.Y(0),A.Y(100),gx),{color:C.x,w:6})+fade(gx,label('Δx ＝ 100 m',A.X(20)+12,A.Y(50),{size:24,color:C.x}));
  s+=card(760,130,400,260,label('直線の傾き',960,180,{size:28,color:C.v,anchor:'middle',weight:700})+tex('\\dfrac{\\Delta x}{\\Delta t}=\\dfrac{100\\,\\mathrm{m}}{20\\,\\mathrm{s}}',960,265,{size:40})+tex('=5\\,\\mathrm{m/s}',960,350,{size:40,auto:false,color:C.v}),seg(p,.7,.85));
  return s;
 },
 // ================= S3 平均で分からないこと =================
 [K+'doubt']:(p)=>{
  const A=G20();
  let s=A.svg+dot(A.X(0),A.Y(0),9,C.hi)+dot(A.X(20),A.Y(100),9,C.hi)+draw([[A.X(0),A.Y(0)],[A.X(20),A.Y(100)]],1,{color:C.v,w:5});
  s+=card(740,130,420,250,label('この20秒間',950,195,{size:30,color:C.ink,anchor:'middle'})+label('ずっと 5 m/s？',950,260,{size:40,color:C.v,anchor:'middle',weight:700})+label('予想してみよう',950,335,{size:26,color:C.hi,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'walker']:(p)=>{
  const A=G20(),u=seg(p,.1,.85),t=20*u;
  let s=A.svg+paths(A,{r:0,wp:u})+lanes(t,{r:0});
  s+=fade(seg(p,.2,.35),label('歩く人：ずっと 5 m/s',700,330,{size:28,color:WALK}));
  return s;
 },
 [K+'runner']:(p)=>{
  const A=G20(),u=seg(p,.05,.9),t=20*u;
  let s=A.svg+paths(A,{rp:u})+lanes(t);
  s+=label('歩く人：ずっと 5 m/s',700,330,{size:28,color:WALK});
  const sig=t<7.5?C.a:C.F;s+=fade(seg(p,.2,.35),rect(A.X(6.3)-13,A.Y(0)-78,26,50,{fill:'#0d1526',fo:1,stroke:C.dim,rx:6})+dot(A.X(6.3),A.Y(0)-53,9,sig));
  s+=fade(seg(p,.1,.25),label('走る人：7.5 s 止まり、',700,385,{size:28,color:RUN})+label('残り 12.5 s を 8 m/s',700,430,{size:28,color:RUN}));
  s+=fade(seg(p,.2,.35),label('信号待ち',A.X(3.75),A.Y(0)-16,{size:22,color:RUN,anchor:'middle'}));
  return s;
 },
 [K+'runcalc']:(p)=>{
  const A=G20();
  let s=A.svg+paths(A)+lanes(20);
  s+=card(660,280,500,210,
   label('走る人',690,325,{size:26,color:RUN})
   +fade(seg(p,.05,.3),tex('8\\,\\mathrm{m/s}\\times12.5\\,\\mathrm{s}=100\\,\\mathrm{m}',910,380,{size:34,auto:false}))
   +fade(seg(p,.5,.75),tex('7.5\\,\\mathrm{s}+12.5\\,\\mathrm{s}=20\\,\\mathrm{s}',910,450,{size:34,auto:false})));
  return s;
 },
 [K+'same']:(p)=>{
  const A=G20();
  let s=A.svg+paths(A)+lanes(20);
  s+=fade(seg(p,.05,.25),ring(A.X(20),A.Y(100),20,{color:C.hi,w:3})+label('同じ終点',A.X(20)-26,A.Y(100)+6,{size:22,color:C.hi,anchor:'end'}));
  s+=draw([[A.X(0),A.Y(0)],[A.X(20),A.Y(100)]],seg(p,.3,.55),{color:C.v,w:3,dash:'10 8'});
  s+=card(660,280,500,210,label('平均の速さ',910,325,{size:26,color:C.dim,anchor:'middle'})+tex('\\dfrac{100\\,\\mathrm{m}}{20\\,\\mathrm{s}}=5\\,\\mathrm{m/s}',910,400,{size:40,auto:false,color:C.v})+label('二人とも 同じ',910,470,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.65));
  return s;
 },
 [K+'check']:(p)=>{
  const A=G20();
  let s=A.svg+paths(A)+draw([[A.X(0),A.Y(0)],[A.X(10),A.Y(0)]],seg(p,.2,.45),{color:C.p,w:4,dash:'10 8'});
  s+=card(660,90,500,400,label('確かめ',690,140,{size:26,color:C.hi})
   +label('信号で 10 s 止まったら、',910,210,{size:30,color:C.ink,anchor:'middle'})
   +label('残りの 10 s は',910,265,{size:30,color:C.ink,anchor:'middle'})
   +label('何 m/s で走る？',910,330,{size:36,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.6,.8),label('（平均を 5 m/s にしたい）',910,400,{size:26,color:C.dim,anchor:'middle'})),seg(p,.02,.2),C.hi);
  return s;
 },
 [K+'check2']:(p)=>{
  const A=G20();
  let s=A.svg+paths(A)+draw([[A.X(0),A.Y(0)],[A.X(10),A.Y(0)],[A.X(20),A.Y(100)]],mix(.33,1,seg(p,.2,.55)),{color:C.p,w:4,dash:'10 8'});
  s+=fade(seg(p,.55,.7),ring(A.X(20),A.Y(100),20,{color:C.hi,w:3}));
  s+=card(660,90,500,400,label('確かめ',690,140,{size:26,color:C.hi})
   +tex('\\dfrac{100\\,\\mathrm{m}}{10\\,\\mathrm{s}}=10\\,\\mathrm{m/s}',910,230,{size:40,auto:false,color:C.p})
   +fade(seg(p,.55,.75),label('止まり方が 違っても',910,340,{size:28,color:C.ink,anchor:'middle'})+label('平均は 同じ 5 m/s',910,395,{size:32,color:C.v,anchor:'middle',weight:700})),1,C.hi);
  return s;
 },
 ...Object.fromEntries([['at5',5,'0'],['at15',15,'8']].map(([k,T,rv])=>[K+k,(p)=>{
  const A=G20();
  let s=A.svg+fade(.5,draw([[A.X(0),A.Y(0)],[A.X(20),A.Y(100)]],1,{color:C.v,w:3,dash:'10 8'}))+paths(A)+lanes(T);
  const g=seg(p,.05,.25);
  s+=fade(g,line(A.X(T),A.Y(0),A.X(T),A.Y(110),{color:C.t,w:3,dash:'8 6'})+label(`t ＝ ${T} s`,A.X(T),A.Y(110)-12,{size:24,color:C.t,anchor:'middle'}));
  // local pieces of each path around T (the speed there = its steepness)
  const piece=(f,color,gg)=>fade(gg,draw([[A.X(T-1.6),A.Y(f(T-1.6))],[A.X(T+1.6),A.Y(f(T+1.6))]],1,{color,w:10})+dot(A.X(T),A.Y(f(T)),9,color));
  const gw=seg(p,.2,.4),gr=seg(p,.45,.65);
  s+=piece(xw,WALK,gw)+piece(xr,RUN,gr);
  s+=card(660,280,500,210,
   label(`t ＝ ${T} s の瞬間`,910,325,{size:26,color:C.t,anchor:'middle'})
   +fade(gw,label('歩く人',700,390,{size:28,color:WALK})+label('5 m/s',1120,390,{size:32,color:C.v,anchor:'end',weight:700}))
   +fade(gr,label(T===5?'走る人（止まっている）':'走る人',700,450,{size:28,color:RUN})+label(`${rv} m/s`,1120,450,{size:32,color:C.v,anchor:'end',weight:700})),g);
  if(k==='at15')s+=fade(seg(p,.72,.88),label('平均の 5 m/s とは違う',910,265,{size:26,color:C.a,anchor:'middle'}));
  return s;
 }])),
 [K+'chord']:(p)=>{
  const A=G20();
  const band=[];for(let i=0;i<=40;i++){const t=20*i/40;band.push([A.X(t),A.Y(xw(t))]);}for(let i=40;i>=0;i--){const t=20*i/40;band.push([A.X(t),A.Y(xr(t))]);}
  let s=A.svg+fade(seg(p,.4,.6)*.9,poly(band,{fill:C.hi,fo:.22}))+paths(A)+lanes(20);
  s+=draw([[A.X(0),A.Y(0)],[A.X(20),A.Y(100)]],1,{color:C.v,w:5});
  s+=card(660,280,500,210,label('2点を結ぶ直線は 同じ1本',910,340,{size:30,color:C.v,anchor:'middle',weight:700})+fade(seg(p,.5,.7),label('途中の進み方の違いは',910,405,{size:28,color:C.hi,anchor:'middle'})+label('平均には 残らない',910,450,{size:28,color:C.hi,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'level']:(p)=>{
  const A=axes({x:120,y:430,w:520,h:300,xmax:22,ymax:10,xlabel:'t [s]',ylabel:'速さ v [m/s]',xticks:[5,7.5,10,15,20],yticks:[5,8],grid:true,xcolor:C.t,ycolor:C.v});
  const u=seg(p,.2,.55),h1=mix(0,5,u),h2=mix(8,5,u);
  let s=A.svg+label('走る人',A.X(0)+10,A.Y(9.5),{size:24,color:RUN});
  s+=rect(A.X(0),A.Y(h1),A.X(7.5)-A.X(0),A.Y(0)-A.Y(h1),{fill:C.v,fo:.35,stroke:C.v,rx:2})+rect(A.X(7.5),A.Y(h2),A.X(20)-A.X(7.5),A.Y(0)-A.Y(h2),{fill:C.v,fo:.35,stroke:C.v,rx:2});
  s+=fade(1-u,label('0',A.X(3.75),A.Y(0)-12,{size:24,color:C.v,anchor:'middle'})+label('8 m/s',A.X(13.75),A.Y(8)-12,{size:24,color:C.v,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),label('5 m/s にならす',A.X(10),A.Y(5)-14,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(720,120,440,300,
   label('平均 ＝ 速い・遅いを',940,180,{size:28,color:C.ink,anchor:'middle'})+label('ならした 一つの値',940,225,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.65,.85),label('5 m/s という数からは',940,310,{size:28,color:C.dim,anchor:'middle'})+label('各瞬間の速さは 読めない',940,360,{size:30,color:C.a,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 // ================= S4 速さが変わり続ける運動 =================
 [K+'accel']:(p)=>{
  const X=m=>mix(150,1050,m/20),u=seg(p,.2,.85),t=2*u;
  let s=fade(seg(p,0,.15),label('速さが 変わり続ける運動',600,90,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=rect(140,242,920,36,{fill:'#1a2540',fo:1,stroke:C.faint,rx:8});
  for(const [tt,m] of [[0,0],[1,5],[2,20]])if(t>=tt-1e-6)s+=line(X(m),225,X(m),295,{color:C.t,w:3})+label(`${tt} s`,X(m),200,{size:24,color:C.t,anchor:'middle'})+label(`${m} m`,X(m),330,{size:24,color:C.x,anchor:'middle'});
  s+=dot(X(xt(t)),260,14,C.hi);
  s+=fade(seg(p,.85,.97),label('同じ 1 s でも、進む距離が どんどん増える',600,430,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'curve']:(p)=>{
  const A=G5(seg(p,0,.15));
  let s=A.svg+curve(A,seg(p,.1,.5));
  s+=fade(seg(p,.2,.35),tex('x=5t^2',920,170,{size:64}));
  s+=fade(seg(p,.5,.65),label('t：時刻 [s]',800,270,{size:30,color:C.t}));
  s+=fade(seg(p,.72,.87),label('x：位置 [m]',800,330,{size:30,color:C.x}));
  return s;
 },
 [K+'x0']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+tex('x=5t^2',920,130,{size:48});
  s+=pt(A,0,seg(p,.05,.25))+fade(seg(p,.05,.25),ring(A.X(0),A.Y(0),20,{color:C.hi,w:3}));
  s+=fade(seg(p,.2,.45),tex('t=0\\,\\mathrm{s}:\\ x=0\\,\\mathrm{m}',920,225,{size:36}));
  s+=fade(seg(p,.55,.75),label('出発点',A.X(0)+26,A.Y(0)-22,{size:24,color:C.hi}));
  return s;
 },
 [K+'x1']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+tex('x=5t^2',920,130,{size:48})+pt(A,0)+tex('t=0\\,\\mathrm{s}:\\ x=0\\,\\mathrm{m}',920,225,{size:36});
  s+=guides(A,1,seg(p,.05,.25))+pt(A,1,seg(p,.05,.25));
  s+=fade(seg(p,.3,.55),tex('t=1\\,\\mathrm{s}:\\ x=5\\times1^2=5\\,\\mathrm{m}',920,300,{size:36}));
  s+=fade(seg(p,.7,.85),label('(1 s, 5 m)',A.X(1)+14,A.Y(5)-14,{size:22,color:C.hi}));
  return s;
 },
 [K+'x2']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+tex('x=5t^2',920,130,{size:48})+pt(A,0)+tex('t=0\\,\\mathrm{s}:\\ x=0\\,\\mathrm{m}',920,225,{size:36})+guides(A,1)+pt(A,1)+tex('t=1\\,\\mathrm{s}:\\ x=5\\times1^2=5\\,\\mathrm{m}',920,300,{size:36})+label('(1 s, 5 m)',A.X(1)+14,A.Y(5)-14,{size:22,color:C.hi});
  s+=guides(A,2,seg(p,.05,.25))+pt(A,2,seg(p,.05,.25));
  s+=fade(seg(p,.3,.55),tex('t=2\\,\\mathrm{s}:\\ x=5\\times2^2=20\\,\\mathrm{m}',920,375,{size:36}));
  s+=fade(seg(p,.7,.85),label('(2 s, 20 m)',A.X(2)-14,A.Y(20)-16,{size:22,color:C.hi,anchor:'end'}));
  return s;
 },
 [K+'steps']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+pt(A,0)+pt(A,1)+pt(A,2);
  const g1=seg(p,.05,.3),g2=seg(p,.35,.6);
  s+=fade(g1,line(A.X(0),A.Y(0),A.X(1),A.Y(0),{color:C.t,w:7})+line(A.X(1),A.Y(0),A.X(1),A.Y(5),{color:C.x,w:7})+label('+5 m',A.X(1)+12,A.Y(2.5)+8,{size:24,color:C.x}));
  s+=fade(g2,line(A.X(1),A.Y(5),A.X(2),A.Y(5),{color:C.t,w:7})+line(A.X(2),A.Y(5),A.X(2),A.Y(20),{color:C.x,w:7})+label('+15 m',A.X(2)+12,A.Y(12.5)+8,{size:24,color:C.x}));
  s+=card(740,120,420,260,
   fade(g1,label('最初の 1 s',770,190,{size:30,color:C.t})+label('5 m',1130,190,{size:32,color:C.x,anchor:'end',weight:700}))
   +fade(g2,label('次の 1 s',770,255,{size:30,color:C.t})+label('15 m',1130,255,{size:32,color:C.x,anchor:'end',weight:700}))
   +fade(seg(p,.7,.85),label('あとの方が 多く進む',950,340,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'steeper']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A);
  const g=seg(p,.35,.6);
  s+=fade(g,arrow(A.X(.45),A.Y(xt(.45))-40,A.X(.9),A.Y(xt(.9))-50,{color:C.dim,w:3,head:12})+label('ゆるやか',A.X(.35),A.Y(xt(.35))-60,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.8),arrow(A.X(1.55)-40,A.Y(xt(1.55)),A.X(1.95)-40,A.Y(xt(1.95)),{color:C.hi,w:4,head:14})+label('急',A.X(1.75)-80,A.Y(xt(1.75)),{size:28,color:C.hi,anchor:'end',weight:700}));
  s+=card(740,150,420,200,label('だんだん',950,225,{size:32,color:C.ink,anchor:'middle'})+label('速くなる運動',950,290,{size:40,color:C.v,anchor:'middle',weight:700}),seg(p,.05,.25));
  return s;
 },
 // ================= S5 幅1秒で測る =================
 [K+'m12']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+pt(A,1,seg(p,.1,.3))+pt(A,2,seg(p,.2,.4));
  s+=fade(seg(p,.1,.3),label('(1 s, 5 m)',A.X(1)+14,A.Y(5)+30,{size:22,color:C.hi})+label('(2 s, 20 m)',A.X(2)-14,A.Y(20)-16,{size:22,color:C.hi,anchor:'end'}));
  s+=card(740,130,420,200,label('1 s → 2 s の',950,205,{size:32,color:C.t,anchor:'middle'})+label('平均の速さ',950,270,{size:38,color:C.v,anchor:'middle',weight:700}),seg(p,.3,.5));
  return s;
 },
 [K+'dx']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+pt(A,1)+pt(A,2)+fade(.8,label('(1 s, 5 m)',A.X(1)+14,A.Y(5)+30,{size:22,color:C.hi})+label('(2 s, 20 m)',A.X(2)-14,A.Y(20)-16,{size:22,color:C.hi,anchor:'end'}));
  const gx=seg(p,.1,.4);
  s+=line(A.X(1),A.Y(5),A.X(2),A.Y(5),{color:C.faint,w:2,dash:'6 6'});
  s+=line(A.X(2),A.Y(5),A.X(2),mix(A.Y(5),A.Y(20),gx),{color:C.x,w:7})+fade(gx,label('Δx',A.X(2)+14,A.Y(12.5)+8,{size:28,color:C.x}));
  s+=card(740,110,420,330,label('1 s → 2 s',950,160,{size:26,color:C.t,anchor:'middle'})+fade(seg(p,.35,.6),tex('\\Delta x=20-5=15\\,\\mathrm{m}',950,230,{size:38})));
  return s;
 },
 [K+'dt']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+pt(A,1)+pt(A,2);
  s+=line(A.X(2),A.Y(5),A.X(2),A.Y(20),{color:C.x,w:7})+label('Δx',A.X(2)+14,A.Y(12.5)+8,{size:28,color:C.x});
  const gt=seg(p,.1,.4);
  s+=line(A.X(1),A.Y(5),mix(A.X(1),A.X(2),gt),A.Y(5),{color:C.t,w:7})+fade(gt,label('Δt',A.X(1.5),A.Y(5)+36,{size:28,color:C.t,anchor:'middle'}));
  s+=card(740,110,420,330,label('1 s → 2 s',950,160,{size:26,color:C.t,anchor:'middle'})+tex('\\Delta x=20-5=15\\,\\mathrm{m}',950,230,{size:38})+fade(seg(p,.35,.6),tex('\\Delta t=2-1=1\\,\\mathrm{s}',950,305,{size:38})));
  return s;
 },
 [K+'v15']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A);
  s+=line(A.X(2),A.Y(5),A.X(2),A.Y(20),{color:C.x,w:7})+line(A.X(1),A.Y(5),A.X(2),A.Y(5),{color:C.t,w:7});
  s+=secant(A,1,2,{g:seg(p,.5,.8)})+pt(A,1)+pt(A,2);
  s+=fade(seg(p,.7,.85),label('傾き 15 m/s',A.X(.9),A.Y(xt(1)-15*.1)-40,{size:26,color:C.v,anchor:'end'}));
  s+=card(740,110,420,330,label('1 s → 2 s',950,160,{size:26,color:C.t,anchor:'middle'})+tex('\\Delta x=15\\,\\mathrm{m},\\ \\Delta t=1\\,\\mathrm{s}',950,225,{size:34})
   +fade(seg(p,.05,.3),tex('\\bar v=\\dfrac{15\\,\\mathrm{m}}{1\\,\\mathrm{s}}=15\\,\\mathrm{m/s}',950,330,{size:40})));
  return s;
 },
 [K+'ask15']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+secant(A,1,2)+pt(A,1)+pt(A,2);
  s+=fade(seg(p,.05,.25),ring(A.X(1),A.Y(5),22,{color:C.a,w:3})+label('1 s ちょうど',A.X(1)+30,A.Y(5)+36,{size:24,color:C.a}));
  s+=card(740,130,420,250,label('1 s ちょうどの 速さも',950,200,{size:30,color:C.ink,anchor:'middle'})+label('15 m/s？',950,275,{size:44,color:C.v,anchor:'middle',weight:700})+label('予想してみよう',950,345,{size:26,color:C.hi,anchor:'middle'}),seg(p,.15,.35),C.hi);
  return s;
 },
 [K+'inside']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+secant(A,1,2)+fade(seg(p,.05,.3),A.plot(xt,{from:1,to:2,color:C.hi,w:9}))+pt(A,1)+pt(A,2);
  s+=fade(seg(p,.15,.35),label('この1秒間も 速くなり続ける',A.X(1.2),A.Y(1.5),{size:24,color:C.hi}));
  s+=card(740,130,420,250,label('15 m/s は',950,200,{size:32,color:C.v,anchor:'middle',weight:700})+label('1 s → 2 s の 1秒間を',950,265,{size:28,color:C.ink,anchor:'middle'})+label('ならした値',950,320,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.7));
  return s;
 },
 [K+'v5']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+fade(.55,secant(A,1,2))+pt(A,0)+pt(A,1)+pt(A,2);
  const g=seg(p,.1,.35);
  s+=fade(g,line(A.X(0),A.Y(0),A.X(1),A.Y(0),{color:C.t,w:7})+line(A.X(1),A.Y(0),A.X(1),A.Y(5),{color:C.x,w:7}));
  s+=draw([[A.X(0),A.Y(0)],[A.X(1.3),A.Y(6.5)]],seg(p,.45,.7),{color:C.v,w:4,dash:'12 8'});
  s+=card(740,110,420,330,label('0 s → 1 s（手前）',950,160,{size:26,color:C.t,anchor:'middle'})
   +fade(seg(p,.3,.55),tex('\\bar v=\\dfrac{5-0}{1-0}',950,250,{size:40}))
   +fade(seg(p,.6,.8),tex('=5\\,\\mathrm{m/s}',950,345,{size:40,auto:false,color:C.v})));
  return s;
 },
 [K+'between']:(p)=>{
  const X=v=>mix(150,1050,v/20),Y=260;
  let s=fade(seg(p,0,.15),label('1 s ちょうどの速さは どこ？',600,80,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=arrow(130,Y,1090,Y,{color:C.dim,w:3,head:14});
  for(let v=0;v<=20;v+=5)s+=line(X(v),Y-8,X(v),Y+8,{color:C.dim,w:2})+label(String(v),X(v),Y+44,{size:22,color:C.dim,anchor:'middle'});
  s+=label('速さ [m/s]',1090,Y-24,{size:22,color:C.v,anchor:'end'});
  s+=fade(seg(p,.1,.25),dot(X(5),Y,12,C.v)+label('手前の 1 秒の平均',X(5),Y-60,{size:24,color:C.v,anchor:'middle'})+label('5',X(5),Y-28,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),dot(X(15),Y,12,C.v)+label('後ろの 1 秒の平均',X(15),Y-60,{size:24,color:C.v,anchor:'middle'})+label('15',X(15),Y-28,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),rect(X(5),Y-10,X(15)-X(5),20,{fill:C.hi,fo:.25,stroke:C.hi,rx:8})+brace(X(5),X(15),Y+62,{text:'この間のどこか',color:C.hi,size:26}));
  s+=fade(seg(p,.8,.95),tex('5\\,\\mathrm{m/s}<\\ ?\\ <15\\,\\mathrm{m/s}',600,470,{size:38,auto:false,color:C.ink}));
  return s;
 },
 [K+'unknown']:(p)=>{
  const X=v=>mix(150,1050,v/20),Y=260;
  let s=label('1 s ちょうどの速さは どこ？',600,80,{size:32,color:C.ink,anchor:'middle',weight:700});
  s+=arrow(130,Y,1090,Y,{color:C.dim,w:3,head:14});
  for(let v=0;v<=20;v+=5)s+=line(X(v),Y-8,X(v),Y+8,{color:C.dim,w:2})+label(String(v),X(v),Y+44,{size:22,color:C.dim,anchor:'middle'});
  s+=label('速さ [m/s]',1090,Y-24,{size:22,color:C.v,anchor:'end'});
  s+=dot(X(5),Y,12,C.v)+label('5',X(5),Y-28,{size:26,color:C.v,anchor:'middle',weight:700})+dot(X(15),Y,12,C.v)+label('15',X(15),Y-28,{size:26,color:C.v,anchor:'middle',weight:700});
  s+=rect(X(5),Y-10,X(15)-X(5),20,{fill:C.hi,fo:.25,stroke:C.hi,rx:8});
  const q=10+4*Math.sin(p*11);s+=label('？',X(q),Y-70,{size:40,color:C.hi,anchor:'middle',weight:700})+line(X(q),Y-58,X(q),Y-14,{color:C.hi,w:2,dash:'4 4'});
  s+=fade(seg(p,.3,.5),label('幅 1 s の平均だけでは まだ決まらない',600,420,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 まとめと次の問い =================
 [K+'sum1']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+secant(A,1,2,{g:seg(p,.1,.35)})+pt(A,1)+pt(A,2);
  s+=card(720,90,440,190,label('平均の速さ',940,140,{size:28,color:C.v,anchor:'middle',weight:700})+tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}',940,225,{size:48}),seg(p,.05,.2));
  s+=fade(seg(p,.5,.7),label('＝ 2点を結ぶ 直線の傾き',940,330,{size:30,color:C.v,anchor:'middle'}));
  return s;
 },
 [K+'sum2']:(p)=>{
  const A=G5();
  let s=A.svg+curve(A)+secant(A,1,2)+fade(seg(p,.4,.6),secant(A,0,1,{color:C.v,dash:'12 8'}))+pt(A,0)+pt(A,1)+pt(A,2);
  s+=fade(seg(p,.45,.6),label('0→1 s：5 m/s',A.X(1.15),A.Y(1.2),{size:24,color:C.v})+label('1→2 s：15 m/s',A.X(1.05),A.Y(20)+10,{size:24,color:C.v,anchor:'end'}));
  s+=card(720,90,440,190,label('平均の速さ',940,140,{size:28,color:C.v,anchor:'middle',weight:700})+tex('\\bar v=\\dfrac{\\Delta x}{\\Delta t}',940,225,{size:48}));
  s+=card(720,305,440,180,label('区間全体を ならした 一つの値',940,355,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.45,.65),label('区間の取り方で 5 にも 15 にも',940,420,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.2));
  return s;
 },
 [K+'next']:(p)=>{
  const A=G5();
  // the right end slides: width 1 → 0.5 → 0.8 → 0.3 → 0.6 (no values shown: part 2 measures them)
  const ks=[1,.5,.8,.3,.6],q=clamp(p/.9)*(ks.length-1),i=Math.min(ks.length-2,Math.floor(q)),w=mix(ks[i],ks[i+1],smooth(q-i));
  let s=A.svg+curve(A)+secant(A,1,1+w)+pt(A,1)+pt(A,1+w,1,C.hi);
  s+=line(A.X(1),A.Y(0),A.X(1+w),A.Y(0),{color:C.t,w:7})+label('幅',A.X(1+w/2),A.Y(0)-14,{size:24,color:C.t,anchor:'middle'});
  s+=card(720,120,440,280,label('区間の幅を 変えて',940,190,{size:30,color:C.ink,anchor:'middle'})+label('測り直すと、',940,240,{size:30,color:C.ink,anchor:'middle'})+label('平均の速さは',940,305,{size:34,color:C.v,anchor:'middle',weight:700})+label('どう動く？',940,360,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=meter(300,235,130,needle(4+p),{readout:'いま ？ km/h'});
  s+=card(640,130,520,250,label('次回　微分・初級 2/3',900,195,{size:28,color:C.dim,anchor:'middle'})+label('区間を 縮める',900,275,{size:44,color:C.hi,anchor:'middle',weight:700})+label('幅を短くすると、何が見える？',900,340,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi);
  return s;
 },
};
