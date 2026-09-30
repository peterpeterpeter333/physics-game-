// YouTube シリーズ「交流と波・初級 2/2」(ys-ui-ac-waves-2) — 図。Stage 1200×515.
// 色：時刻 t・周期 T 金、ω・f 桃、角度・位相差 橙、電流 I 緑、電圧 V 紫、ひもの変位 淡い白、印 赤、旗・強調 黄、波長 λ 黄、𝐄 水色、𝐁 橙。
// 位相：I＝2 sin(100πt)、V＝V₀ cos(100πt)＝V₀ sin(100πt＋π/2)。V の山（t＝0, 0.02, 0.04）が I の山（0.005, 0.025）より T/4 先。
// ひもの波：y＝A sin 2π(t/T − x/λ)、λ＝2 m、T＝0.5 s、右へ 4 m/s。電磁波：𝐄 上下、𝐁 手前（左下へ描く）・奥、同位相、右へ進む（𝐄×𝐁）。
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';
import {IC,VC,TC,WC,PH,cs,tI,tI0,tV,tV0,tT,tW,tF,card,ok,ng,P,TAU,itAxes} from './yt1-ui-ac-waves-1-diagrams.mjs';

const K='ui-ac-waves-2:';
const ROPE='#c9d6ea',MARK=C.a,LC=C.hi,EC=C.x,BC=C.E;
const tL=cs(LC,'\\lambda');

// ---- 50 Hz pair graph (I green, V purple) ------------------------------------------------
const W100=100*Math.PI;
const I50=t=>2*Math.sin(W100*t),V50=t=>1.5*Math.cos(W100*t);
function pg(g=1,{ylabel=''}={}){
 const A=itAxes({x:100,y:450,w:640,h:340,xmax:.046,ym:2.7,xticks:[],yticks:[],g,xlabel:'t [s]',ylabel});
 let t='';[.01,.02,.03,.04].forEach(u=>{t+=line(A.X(u),A.Y(2.7),A.X(u),A.Y(-2.7),{color:C.grid,w:1.5})+label(String(u),A.X(u),A.Y(-2.7)+30,{size:21,color:C.dim,anchor:'middle'});});
 return {...A,svg:fade(g,t)+A.svg};
}
const legend=(x,y,g=1)=>fade(g,line(x,y,x+40,y,{color:IC,w:5})+label('電流 I',x+52,y+8,{size:24,color:IC,weight:700})+line(x+170,y,x+210,y,{color:VC,w:5})+label('電圧 V',x+222,y+8,{size:24,color:VC,weight:700}));
function pair(A,{pi=1,pv=1,wi=5,wv=5}={}){return A.plot(I50,{from:0,to:.044,p:pi,color:IC,w:wi})+A.plot(V50,{from:0,to:.044,p:pv,color:VC,w:wv});}
// orange gap between V peak (t=0.02) and I peak (t=0.025)
function gap(A,g=1,{text='',y=-2.35}={}){
 const a=A.X(.02),b=A.X(.025);
 return fade(g,dot(a,A.Y(1.5),10,VC)+dot(b,A.Y(2),10,IC)+line(a,A.Y(1.5),a,A.Y(y),{color:VC,w:2,dash:'6 6'})+line(b,A.Y(2),b,A.Y(y),{color:IC,w:2,dash:'6 6'})
  +line(a,A.Y(y),b,A.Y(y),{color:PH,w:7})+(text?label(text,(a+b)/2,A.Y(y)-14,{size:24,color:PH,anchor:'middle',weight:700}):''));
}

// ---- two points on one circle (I at u, V at u+π/2) with shadows ------------------------------
function twoCircle(u,{cx=220,cy=270,R=140,x0=430,arc=0,g=1,trace=0,tsc=48,x1=1150}={}){
 const [ix,iy]=P(cx,cy,R,u),[vx,vy]=P(cx,cy,R,u+Math.PI/2);
 let s=line(cx-R-24,cy,cx+R+24,cy,{color:C.faint,w:2})+line(cx,cy+R+24,cx,cy-R-24,{color:C.faint,w:2})+ring(cx,cy,R,{color:C.dim,w:3});
 if(arc)s+=fade(arc,draw(Array.from({length:41},(_,i)=>P(cx,cy,R*.45,u+Math.PI/2*i/40)),1,{color:PH,w:6}));
 s+=line(cx,cy,ix,iy,{color:IC,w:3})+line(cx,cy,vx,vy,{color:VC,w:3})+dot(ix,iy,11,IC)+dot(vx,vy,11,VC);
 s+=line(ix,iy,x0,iy,{color:IC,w:1.5,dash:'5 6'})+line(vx,vy,x0,vy,{color:VC,w:1.5,dash:'5 6'});
 s+=line(x0,cy-R-16,x0,cy+R+16,{color:C.dim,w:2})+dot(x0,iy,9,IC)+dot(x0,vy,9,VC);
 if(trace){const X=v=>x0+30+v*tsc,u0=Math.max(0,u-TAU*1.4);
  s+=line(x0,cy,x1,cy,{color:C.faint,w:2})+label('t →',x1,cy+36,{size:24,color:TC,anchor:'end'});
  s+=draw(Array.from({length:241},(_,i)=>{const v=u0+(u-u0)*i/240;return [X(v-u0),cy-R*Math.sin(v)];}),1,{color:IC,w:4});
  s+=draw(Array.from({length:241},(_,i)=>{const v=u0+(u-u0)*i/240;return [X(v-u0),cy-R*Math.sin(v+Math.PI/2)];}),1,{color:VC,w:4});}
 return fade(g,s);
}

// ---- rope wave ---------------------------------------------------------------------------------
const LAM=2,PER=.5,RX=m=>110+140*m,RY0=250,AMP=80;
const yr=(x,t)=>AMP*Math.sin(TAU*(t/PER-x/LAM));
function rope(t,{g=1,axis=1,y0=RY0,xmax=6.5,ghost=null,src=1}={}){
 let s='';
 if(axis)s+=arrow(RX(0)-10,y0+AMP+50,RX(xmax)+30,y0+AMP+50,{color:C.dim,w:2.5,head:14})+label('場所 x [m]',RX(xmax)+40,y0+AMP+58,{size:24,color:C.x})
  +[0,1,2,3,4,5,6,7].filter(m=>m<=xmax).map(m=>line(RX(m),y0+AMP+44,RX(m),y0+AMP+56,{color:C.dim})+label(String(m),RX(m),y0+AMP+84,{size:21,color:C.dim,anchor:'middle'})).join('');
 s+=line(RX(0),y0,RX(xmax),y0,{color:C.faint,w:1.5,dash:'6 8'});
 if(ghost!==null)s+=draw(Array.from({length:281},(_,i)=>{const x=xmax*i/280;return [RX(x),y0-yr(x,ghost)];}),1,{color:ROPE,w:3,dash:'8 8',opacity:.45});
 s+=draw(Array.from({length:281},(_,i)=>{const x=xmax*i/280;return [RX(x),y0-yr(x,t)];}),1,{color:ROPE,w:5});
 if(src){const hy=y0-yr(0,t);s+=rect(RX(0)-34,hy-16,28,32,{fill:C.dim,fo:.5,rx:6});}
 return fade(g,s);
}
const markPt=(t,{x=3,g=1,y0=RY0}={})=>fade(g,dot(RX(x),y0-yr(x,t),12,MARK));
const crestX=(t,n=0)=>LAM*(t/PER-.25)+1.5+.5*LAM*0+n*LAM-LAM*0; // crest that sits at x=1.5 when t=0 (shift by n wavelengths)
function flag(x,y,g=1){return fade(g,line(x,y-12,x,y-70,{color:LC,w:3})+`<polygon points="${x},${y-70} ${x+34},${y-60} ${x},${y-50}" fill="${LC}"/>`);}
const flagAt=(t,g=1,y0=RY0)=>{const x=1.5+LAM*t/PER;return flag(RX(x),y0-AMP,g);};

// ---- electromagnetic wave ---------------------------------------------------------------------
function emWave(t,{g=1,y0=270,x0=110,x1=1080,lam=380,amp=110,showB=1}={}){
 let s=arrow(x0-20,y0,x1+40,y0,{color:C.dim,w:2.5,head:14});
 const ph=x=>Math.sin(TAU*(t-(x-x0)/lam));
 s+=draw(Array.from({length:241},(_,i)=>{const x=x0+(x1-x0)*i/240;return [x,y0-amp*ph(x)];}),1,{color:EC,w:3,opacity:.7});
 if(showB)s+=draw(Array.from({length:241},(_,i)=>{const x=x0+(x1-x0)*i/240,b=.8*amp*ph(x);return [x-.5*b,y0+.55*b];}),1,{color:BC,w:3,opacity:.7});
 for(let x=x0+10;x<=x1;x+=38){const e=amp*ph(x),b=.8*amp*ph(x);
  if(Math.abs(e)>6)s+=arrow(x,y0,x,y0-e,{color:EC,w:3,head:10});
  if(showB&&Math.abs(b)>6)s+=arrow(x,y0,x-.5*b,y0+.55*b,{color:BC,w:3,head:10});}
 return fade(g,s);
}

export const ytUiAcWaves2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const rows=[['周期 T','1往復の 時間',TC,'0.02 s'],['振動数 f ＝ 1/T','1秒の 往復の回数',WC,'50 Hz'],['振幅','最大の 大きさ',C.hi,'']];
  let s='';rows.forEach(([a,b,c,v],i)=>{s+=card(140,60+i*140,920,115,label(a,180,128+i*140,{size:32,color:c,weight:700})+label(b,560,128+i*140,{size:28,color:C.ink})+(v?label(v,1020,128+i*140,{size:32,color:c,anchor:'end',weight:700}):''),seg(p,.05+.12*i,.17+.12*i),c);});
  return s;
 },
 [K+'lastq']:(p)=>{
  const A=itAxes({ylabel:'',w:900}),T=.4,f=t=>2*Math.sin(TAU*t/T),g2=t=>1.4*Math.sin(TAU*t/T+Math.PI/2);
  let s=fade(.5,A.svg+A.plot(f,{from:0,to:.98,color:IC,w:4})+A.plot(g2,{from:0,to:.98,color:VC,w:4}));
  s+=card(250,150,700,200,label('前回の 最後の問い',600,205,{size:26,color:C.dim,anchor:'middle'})+label('山の来る 時刻の ずれは',600,265,{size:34,color:PH,anchor:'middle',weight:700})+label('どう 数える？',600,320,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'coil']:(p)=>{
  const A=pg(seg(p,0,.1));
  let s=A.svg+pair(A,{pi:seg(p,.05,.45),pv:seg(p,.15,.55)})+legend(820,70,seg(p,.1,.25));
  s+=fade(seg(p,.55,.7),dot(A.X(0),A.Y(1.5),10,VC)+dot(A.X(.005),A.Y(2),10,IC)+dot(A.X(.02),A.Y(1.5),10,VC)+dot(A.X(.025),A.Y(2),10,IC));
  s+=card(820,150,350,160,label('コイル・50 Hz',995,205,{size:28,color:C.ink,anchor:'middle'})+label('電圧の山が 先',995,270,{size:32,color:VC,anchor:'middle',weight:700}),seg(p,.6,.75),VC);
  return s;
 },
 [K+'ask']:(p)=>{
  const A=pg();let s=fade(.35,A.svg+pair(A));
  s+=card(250,90,700,320,label('今回の問い',600,145,{size:26,color:C.dim,anchor:'middle'})+label('ずれは どう 数える？',600,215,{size:36,color:PH,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('波が 空間を 伝わる 速さは？',600,300,{size:34,color:C.hi,anchor:'middle',weight:700})+rope(.3*p,{g:.0,axis:0})),seg(p,0,.15),C.hi);
  return s;
 },

 // ===== S2 ずれを角度で数える =====
 [K+'circ']:(p)=>{
  const u=TAU*(1.4+.9*seg(p,.02,.95));
  let s=twoCircle(u,{trace:1});
  s+=legend(760,60,seg(p,.1,.25));
  return s;
 },
 [K+'const']:(p)=>{
  const u=TAU*2.3+2.2*p;
  let s=twoCircle(u,{cx:300,cy:270,R:170,x0:560,arc:seg(p,.3,.45)});
  s+=card(690,120,460,230,label('間の角度は 変わらない',920,190,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.65),label('＝ 位相差',920,270,{size:40,color:PH,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=card(100,50,470,150,label('角度',335,105,{size:28,color:PH,anchor:'middle'})+tex(cs(PH,'2\\pi'),335,170,{size:48,auto:false}),seg(p,.02,.15),PH);
  s+=card(630,50,470,150,label('時間',865,105,{size:28,color:TC,anchor:'middle'})+tex(tT,865,170,{size:48,auto:false}),seg(p,.02,.15),TC);
  s+=fade(seg(p,.15,.25),label('＝',600,140,{size:40,color:C.ink,anchor:'middle'})+label('一周の ずれ',600,245,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),label('位相差 ＝',470,372,{size:40,color:PH,anchor:'end',weight:700})+tex(`${cs(PH,'2\\pi')}\\times\\dfrac{${cs(PH,'\\Delta t')}}{${tT}}`,490,360,{size:62,auto:false,anchor:'start'}));
  s+=fade(seg(p,.55,.7),label('Δt：時間のずれ',820,330,{size:26,color:PH})+label('Δt/T：T の何分のいくつか',820,420,{size:26,color:TC}));
  return s;
 },
 [K+'dt']:(p)=>{
  const A=pg();let s=A.svg+pair(A)+legend(820,70);
  s+=gap(A,seg(p,.05,.25),{text:'Δt'});
  s+=card(820,140,350,230,label('Δt ＝ 0.005 s',995,200,{size:32,color:PH,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('周期 0.02 s の',995,265,{size:26,color:TC,anchor:'middle'})+label('4分の1',995,320,{size:36,color:C.hi,anchor:'middle',weight:700})),seg(p,.2,.35),PH);
  return s;
 },
 [K+'pi2']:(p)=>{
  const A=pg();let s=A.svg+pair(A)+legend(820,70)+gap(A,1,{text:'Δt'});
  s+=card(820,140,350,300,tex('\\dfrac{1}{4}\\times 2\\pi',995,215,{size:44,auto:false,color:PH})+fade(seg(p,.35,.5),tex(`=${cs(PH,'\\dfrac{\\pi}{2}')}`,995,320,{size:56,auto:false}))
   +fade(seg(p,.55,.7),label('0.005 s ↔ π/2',995,410,{size:28,color:PH,anchor:'middle',weight:700})),1,PH);
  return s;
 },
 [K+'lead']:(p)=>{
  const A=pg();let s=A.svg+pair(A)+legend(820,70)+gap(A,1,{text:'π/2'});
  s+=card(820,140,350,260,label('山が 先 ＝ 進んでいる',995,200,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.4,.55),label('電圧が 電流より',995,270,{size:28,color:VC,anchor:'middle',weight:700})+label('π/2 進む',995,330,{size:36,color:PH,anchor:'middle',weight:700})),seg(p,.05,.2),VC);
  return s;
 },
 [K+'formula']:(p)=>{
  const u=TAU*.1+1.2*p;
  let s=twoCircle(u,{cx:230,cy:270,R:150,x0:450,arc:1});
  s+=tex(`${tI}=${tI0}\\sin ${cs(PH,`${tW}t`)}`,850,120,{size:46,auto:false});
  s+=fade(seg(p,.2,.35),tex(`${tV}=${tV0}\\sin\\!\\left(${cs(PH,`${tW}t`)}+${cs(PH,'\\dfrac{\\pi}{2}')}\\right)`,850,250,{size:46,auto:false}));
  s+=fade(seg(p,.5,.65),label('中身に π/2 ＝ 円の上で 先を回る',850,380,{size:28,color:PH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'inst']:(p)=>{
  const A=pg();let s=A.svg+pair(A,{wi:4,wv:4})+legend(820,70);
  s+=fade(seg(p,.05,.2),line(A.X(0)+2,A.Y(2.7),A.X(0)+2,A.Y(-2.7),{color:TC,w:3,dash:'6 6'}));
  s+=fade(seg(p,.2,.35),dot(A.X(0),A.Y(1.5),12,VC))+fade(seg(p,.5,.65),dot(A.X(0),A.Y(0),12,IC));
  s+=card(820,130,350,240,label('t ＝ 0 の瞬間',995,190,{size:30,color:TC,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),label('電圧：最大',995,260,{size:30,color:VC,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),label('電流：0',995,325,{size:30,color:IC,anchor:'middle',weight:700})),seg(p,0,.15),TC);
  return s;
 },
 [K+'sameamp']:(p)=>{
  const A=itAxes({x:100,y:450,w:640,h:340,xmax:.046,ym:2.7,xticks:[],yticks:[2,-2],xlabel:'t [s]',ylabel:'I [A]'});
  const I1=I50,I2=t=>2*Math.cos(W100*t),tt=.0*1+.02*seg(p,.35,.8);
  let s=A.svg+A.plot(I1,{from:0,to:.044,color:IC,w:5})+A.plot(I2,{from:0,to:.044,color:'#c8f7e0',w:4,dash:'10 8'});
  s+=label('I₁',A.X(.044)+10,A.Y(I1(.044))+8,{size:26,color:IC,weight:700})+label('I₂',A.X(.044)+10,A.Y(I2(.044))-6,{size:26,color:'#c8f7e0',weight:700});
  s+=line(A.X(tt),A.Y(2.7),A.X(tt),A.Y(-2.7),{color:TC,w:2,dash:'6 6'})+dot(A.X(tt),A.Y(I1(tt)),10,IC)+dot(A.X(tt),A.Y(I2(tt)),10,'#c8f7e0');
  s+=card(840,100,330,260,label('どちらも 振幅 2 A',1005,150,{size:26,color:C.ink,anchor:'middle'})+label('π/2 ずれ',1005,195,{size:26,color:PH,anchor:'middle',weight:700})
   +label(`I₁ ＝ ${fmt(I1(tt),1)} A`,1005,260,{size:30,color:IC,anchor:'middle',weight:700})+label(`I₂ ＝ ${fmt(I2(tt),1)} A`,1005,320,{size:30,color:'#c8f7e0',anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'q']:(p)=>{
  let s=card(250,100,700,300,label('50 Hz（周期 0.02 s）',600,165,{size:30,color:C.dim,anchor:'middle'})
   +label('山が 0.01 s ずれたら',600,245,{size:38,color:PH,anchor:'middle',weight:700})
   +label('位相差は ？',600,330,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'a']:(p)=>{
  const A=itAxes({x:100,y:450,w:640,h:340,xmax:.046,ym:2.7,xticks:[],yticks:[],xlabel:'t [s]',ylabel:''});
  const I2=t=>-2*Math.sin(W100*t);
  let s=A.svg+A.plot(I50,{from:0,to:.044,color:IC,w:5})+A.plot(I2,{from:0,to:.044,color:'#c8f7e0',w:4,dash:'10 8'});
  s+=fade(seg(p,.35,.5),dot(A.X(.005),A.Y(2),10,IC)+dot(A.X(.005),A.Y(-2),10,'#c8f7e0')+label('山',A.X(.005)+16,A.Y(2)-12,{size:26,color:IC,weight:700})+label('谷',A.X(.005)+16,A.Y(-2)+30,{size:26,color:'#c8f7e0',weight:700}));
  s+=card(820,110,350,280,tex('\\dfrac{0.01}{0.02}=\\dfrac{1}{2}',995,185,{size:40,auto:false})+tex(`\\dfrac{1}{2}\\times 2\\pi=${cs(PH,'\\pi')}`,995,290,{size:40,auto:false})+label('半周期 ＝ π',995,365,{size:30,color:PH,anchor:'middle',weight:700}),seg(p,0,.15),PH);
  return s;
 },

 // ===== S3 コイルで電圧が先になる理由 =====
 [K+'why']:(p)=>{
  const A=pg();let s=A.svg+A.plot(I50,{from:0,to:.044,color:IC,w:5});
  s+=card(820,90,350,250,label('前回：コイルの電圧',995,145,{size:26,color:C.dim,anchor:'middle'})+tex(`${tV}=L\\,\\dfrac{d${tI}}{dt}`,995,225,{size:44,auto:false})+label('＝ 電流のグラフの 傾き',995,305,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.2),VC);
  const t0=.001+.043*seg(p,.35,.95),k=2*W100*Math.cos(W100*t0),h=.004;
  s+=fade(seg(p,.35,.45),draw([[A.X(t0-h),A.Y(I50(t0)-k*h)],[A.X(t0+h),A.Y(I50(t0)+k*h)]],1,{color:C.hi,w:4})+dot(A.X(t0),A.Y(I50(t0)),9,C.hi));
  return s;
 },
 [K+'steep']:(p)=>{
  const A=pg();let s=A.svg+A.plot(I50,{from:0,to:.044,color:IC,w:5});
  const h=.004,k=2*W100;
  s+=fade(seg(p,.05,.2),draw([[A.X(.02-h),A.Y(-k*h)],[A.X(.02+h),A.Y(k*h)]],1,{color:C.hi,w:5})+dot(A.X(.02),A.Y(0),11,C.hi)+label('一番 急',A.X(.02)-22,A.Y(0)-18,{size:26,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.45,.6),dot(A.X(.025),A.Y(2),11,IC)+line(A.X(.02),A.Y(-2.35),A.X(.025),A.Y(-2.35),{color:PH,w:7})+line(A.X(.025),A.Y(2),A.X(.025),A.Y(-2.35),{color:IC,w:2,dash:'6 6'})+label('T/4',A.X(.0225),A.Y(-2.35)-14,{size:24,color:PH,anchor:'middle',weight:700}));
  s+=card(820,110,350,220,label('0 を 上向きに 通る',995,170,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.65),label('電流の山より',995,240,{size:28,color:IC,anchor:'middle'})+label('1/4 周期 早い',995,290,{size:30,color:PH,anchor:'middle',weight:700})),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'so']:(p)=>{
  const A=pg();let s=A.svg+A.plot(I50,{from:0,to:.044,color:IC,w:5})+A.plot(V50,{from:0,to:.044,p:seg(p,.05,.45),color:VC,w:5})+legend(820,70);
  s+=fade(seg(p,.1,.25),dot(A.X(.02),A.Y(1.5),11,VC)+dot(A.X(.02),A.Y(0),9,C.hi));
  s+=fade(seg(p,.55,.7),dot(A.X(.025),A.Y(2),11,IC)+dot(A.X(.025),A.Y(0),11,VC));
  s+=card(820,120,350,300,label('傾き 最大 → 電圧 最大',995,175,{size:24,color:VC,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('電圧が π/2 進む',995,250,{size:32,color:PH,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('電流の山：傾き 0',995,320,{size:24,color:IC,anchor:'middle',weight:700})+label('→ 電圧 0',995,360,{size:24,color:VC,anchor:'middle',weight:700})),seg(p,.1,.25),VC);
  return s;
 },
 [K+'middle']:(p)=>{
  const A=pg();let s=fade(.35,A.svg+pair(A));
  s+=card(250,140,700,220,tex(`${tV}=L\\,\\dfrac{d${tI}}{dt}`,600,220,{size:48,auto:false})+label('式の 微分で 導くのは 中級',600,315,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },

 // ===== S4 波が空間を伝わる =====
 [K+'space']:(p)=>{
  const A=itAxes({x:100,y:450,w:470,h:300,xmax:.046,ym:2.7,xticks:[],yticks:[],xlabel:'t',ylabel:''});
  let s=A.svg+A.plot(I50,{from:0,to:.044,color:IC,w:4})+label('1つの場所・時間で 振動',335,110,{size:26,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.4,.55),arrow(640,280,720,280,{color:C.hi,w:4,head:14}));
  s+=fade(seg(p,.5,.7),label('空間を 伝わる ＝ 波',950,110,{size:28,color:C.hi,anchor:'middle',weight:700})+draw(Array.from({length:161},(_,i)=>{const x=760+380*i/160;return [x,300-60*Math.sin(TAU*(1.5*p-(i/160)*1.6))];}),1,{color:ROPE,w:5}));
  return s;
 },
 [K+'rope']:(p)=>{
  const t=2.2*PER*p;let s=rope(t,{axis:0});
  s+=fade(seg(p,.2,.35),arrow(RX(4.4),RY0-AMP-60,RX(5.8),RY0-AMP-60,{color:C.hi,w:5,head:16})+label('右へ 進む',RX(5.1),RY0-AMP-82,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=label('左端を 上下に振る',RX(0)-10,RY0+AMP+60,{size:24,color:C.dim});
  return s;
 },
 [K+'photo']:(p)=>{
  const t=2.2*PER;let s=rope(t,{axis:1});
  s+=fade(seg(p,.05,.2),rect(RX(0)-40,RY0-AMP-40,RX(6.5)-RX(0)+80,2*AMP+80,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:10})+label('ある瞬間の 写真',RX(6.5)+40,RY0-AMP-50,{size:26,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.45,.6),highlight(RX(6.5)+30,RY0+AMP+26,140,44,1,C.x));
  return s;
 },
 [K+'lambda']:(p)=>{
  const t=2.2*PER;let s=rope(t,{axis:1});
  // crests at t=1.1 s: x = λ(t/T −1/4 − n) = 2(2.2−.25−n) = 3.9−2n → 1.9, 3.9, 5.9
  const c1=1.9,c2=3.9;
  s+=fade(seg(p,.05,.2),dot(RX(c1),RY0-AMP,10,LC)+dot(RX(c2),RY0-AMP,10,LC)+line(RX(c1),RY0-AMP,RX(c1),RY0-AMP-40,{color:LC,w:2,dash:'5 5'})+line(RX(c2),RY0-AMP,RX(c2),RY0-AMP-40,{color:LC,w:2,dash:'5 5'}));
  s+=fade(seg(p,.2,.35),brace(RX(c1),RX(c2),RY0-AMP-44,{dir:-1,text:'波長 λ',size:30,color:LC}));
  s+=fade(seg(p,.6,.75),label('単位 m',RX(6),RY0-AMP-60,{size:28,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'Tvsl']:(p)=>{
  const A=itAxes({x:80,y:430,w:440,h:260,xmax:1.1,ym:2.6,xticks:[],yticks:[],xlabel:'時刻 t',ylabel:'1点の 高さ'}),f=t=>2*Math.sin(TAU*(t/.5)+.3);
  let s=A.svg+A.plot(f,{from:0,to:1.05,color:ROPE,w:4});
  const ta=(Math.PI/2-.3)/TAU*.5,tb=ta+.5;
  s+=fade(seg(p,.05,.2),brace(A.X(ta),A.X(tb),A.Y(2)-14,{dir:-1,text:'周期 T',size:28,color:TC}));
  const B=axes({x:680,y:430,w:390,h:260,xmin:0,xmax:4.4,ymin:-2.6,ymax:2.6,xlabel:'場所 x',ylabel:'ある瞬間',xcolor:C.x,ycolor:C.dim});
  s+=fade(seg(p,.35,.5),B.svg+B.plot(x=>2*Math.sin(TAU*(-x/2)+2.2),{from:0,to:4.3,color:ROPE,w:4}));
  const xa=((2.2-Math.PI/2)/TAU)*2,xb=xa+2;
  s+=fade(seg(p,.45,.6),brace(B.X(xa),B.X(xb),B.Y(2)-14,{dir:-1,text:'波長 λ',size:28,color:LC}));
  s+=fade(seg(p,.75,.9),label('軸が 違う',600,490,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mark']:(p)=>{
  const t=1.6*PER*p;let s=rope(t,{axis:1})+markPt(t,{g:seg(p,0,.1)});
  s+=fade(seg(p,.3,.45),line(RX(3),RY0-AMP-20,RX(3),RY0+AMP+20,{color:MARK,w:2,dash:'5 6'})+arrow(RX(3)+40,RY0-30,RX(3)+40,RY0-AMP,{color:MARK,w:3,head:10})+arrow(RX(3)+40,RY0+30,RX(3)+40,RY0+AMP,{color:MARK,w:3,head:10})+label('上下だけ',RX(3),RY0-AMP-30,{size:26,color:MARK,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),ng(RX(4.6),RY0-AMP-40)+label('右へは 運ばれない',RX(4.6)+40,RY0-AMP-38,{size:26,color:MARK,weight:700}));
  return s;
 },
 [K+'fixed']:(p)=>{
  const t=.8*PER+1.2*PER*p;let s=rope(t,{axis:1});
  for(let m=.5;m<7;m+=.5){const y=RY0-yr(m,t);s+=line(RX(m),RY0,RX(m),y,{color:C.dim,w:2})+dot(RX(m),y,6,m===3?MARK:C.dim);}
  s+=markPt(t);
  s+=card(760,20,420,80,label('場所は 固定・高さが 変わる',970,72,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.55,.7),label('進むのは 振動の 形',RX(3.5),RY0+AMP+130,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'markT']:(p)=>{
  const t=PER*seg(p,.05,.9);
  let s=rope(t,{axis:1})+markPt(t);
  const ox=760,oy=85,sc=720,am=.5;
  s+=card(640,10,540,150,label('印の 高さ',660,50,{size:24,color:MARK})+line(ox,oy,ox+PER*sc,oy,{color:C.faint,w:1.5}),seg(p,0,.1));
  const trace=Array.from({length:61},(_,i)=>{const tt=t*i/60;return [ox+tt*sc,oy-am*yr(3,tt)];});
  if(t>.005)s+=draw(trace,1,{color:MARK,w:4})+dot(ox+t*sc,oy-am*yr(3,t),7,MARK);
  s+=fade(seg(p,.88,.97),label('T で 1往復',ox+PER*sc,150,{size:24,color:TC,anchor:'end',weight:700}));
  return s;
 },

 // ===== S5 波の速さ =====
 [K+'flag']:(p)=>{
  const t=0;let s=rope(t,{axis:1})+markPt(t,{g:.5});
  s+=flagAt(t,seg(p,.3,.45));
  s+=card(760,15,420,70,label('山は どれだけ速く？',970,62,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'oneT']:(p)=>{
  const t=PER*seg(p,.05,.85);
  let s=rope(t,{axis:1,ghost:0})+markPt(t,{g:.5})+flagAt(t);
  s+=card(760,15,420,70,label(`t ＝ ${(t).toFixed(2)} s`,970,62,{size:30,color:TC,anchor:'middle',weight:700}),1,TC);
  s+=fade(seg(p,.85,.95),label('形は 元と 同じ',RX(1),RY0+AMP+130,{size:28,color:ROPE,weight:700}));
  return s;
 },
 [K+'moved']:(p)=>{
  const t=PER;let s=rope(t,{axis:1,ghost:0})+markPt(t,{g:.5})+flagAt(t);
  s+=fade(seg(p,.05,.2),flag(RX(1.5),RY0-AMP,.4));
  s+=fade(seg(p,.2,.4),arrow(RX(1.5),RY0-AMP-90,RX(3.5),RY0-AMP-90,{color:LC,w:5,head:16})+label('λ ＝ 2 m 進んだ',RX(2.5),RY0-AMP-106,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=card(760,15,420,70,label('t ＝ T ＝ 0.5 s',970,62,{size:30,color:TC,anchor:'middle',weight:700}),1,TC);
  return s;
 },
 [K+'v']:(p)=>{
  let s=label('T 秒で λ 進む',600,110,{size:32,color:C.ink,anchor:'middle'});
  const f=`${cs(C.v,'v')}=\\dfrac{${tL}}{${tT}}`;
  s+=fade(seg(p,.15,.3),tex(f,600,280,{size:84,auto:false})+highlight(600-texWidth(f,84,false)/2-30,180,texWidth(f,84,false)+60,200,seg(p,.3,.45)));
  s+=fade(seg(p,.55,.7),label('距離 ÷ 時間',600,460,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex']:(p)=>{
  const t=2*PER*p;let s=rope(t,{axis:1,y0:280})+flag(RX(1.5+LAM*t/PER),280-AMP);
  s+=card(700,0,480,130,tex(`${cs(C.v,'v')}=\\dfrac{2\\,\\mathrm{m}}{0.5\\,\\mathrm{s}}=4\\,\\mathrm{m/s}`,940,72,{size:36,auto:false}),seg(p,.05,.25),C.v);
  s+=fade(seg(p,.05,.2),label('λ ＝ 2 m，T ＝ 0.5 s',RX(0),40,{size:28,color:C.ink}));
  return s;
 },
 [K+'fl']:(p)=>{
  const t=2*PER*seg(p,.05,.9);let s=rope(t,{axis:1,y0:280,ghost:0})+flag(RX(1.5+LAM*t/PER),280-AMP);
  s+=card(700,10,480,110,label('f ＝ 1/0.5 ＝ 2 Hz',940,55,{size:28,color:WC,anchor:'middle',weight:700})+label('1秒で 2波長 ＝ 4 m',940,100,{size:28,color:C.v,anchor:'middle',weight:700}),seg(p,.02,.15),WC);
  s+=label(`t ＝ ${t.toFixed(2)} s`,RX(0),40,{size:28,color:TC,weight:700});
  return s;
 },
 [K+'q3']:(p)=>{
  let s=card(250,100,700,300,label('周期 T ＝ 0.5 s（同じ）',600,170,{size:32,color:TC,anchor:'middle'})
   +label('波長 λ ＝ 3 m',600,245,{size:38,color:LC,anchor:'middle',weight:700})
   +label('速さ v ＝ ？',600,330,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'a3']:(p)=>{
  let s=tex(`${cs(C.v,'v')}=\\dfrac{3\\,\\mathrm{m}}{0.5\\,\\mathrm{s}}=6\\,\\mathrm{m/s}`,600,220,{size:64,auto:false});
  s+=fade(seg(p,.4,.55),label('波長が 1.5倍 → 速さも 1.5倍',600,390,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'diff']:(p)=>{
  const t=PER*p;let s=rope(t,{axis:1,y0:290})+markPt(t,{y0:290})+flag(RX(1.5+LAM*t/PER),290-AMP);
  s+=card(40,10,540,100,label('波の速さ v：旗が 右へ',310,50,{size:26,color:C.v,anchor:'middle',weight:700})+label('（4 m/s）',310,88,{size:24,color:C.dim,anchor:'middle'}),seg(p,.02,.15),C.v);
  s+=card(620,10,540,100,label('印が 上下に動く 速さ',890,50,{size:26,color:MARK,anchor:'middle',weight:700})+label('（別の量）',890,88,{size:24,color:C.dim,anchor:'middle'}),seg(p,.2,.35),MARK);
  return s;
 },

 // ===== S6 電磁波と、初級のふり返り =====
 [K+'em']:(p)=>{
  let s=emWave(.8*p,{showB:0,g:seg(p,0,.15)});
  s+=card(760,20,420,80,label('光・電波 ＝ 電磁波',970,72,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.55,.7),label('真空でも 伝わる',970,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'EB']:(p)=>{
  let s=emWave(.8+.8*p,{showB:seg(p,.3,.45)>0?1:0,g:1});
  s+=tex(cs(EC,'\\mathbf{E}'),90,120,{size:44,auto:false})+label('電場',130,130,{size:26,color:EC});
  s+=fade(seg(p,.3,.45),tex(cs(BC,'\\mathbf{B}'),90,470,{size:44,auto:false})+label('磁場',130,480,{size:26,color:BC}));
  s+=fade(seg(p,.1,.25),card(760,20,420,70,label('振動するのは 場の 値',970,66,{size:28,color:C.ink,anchor:'middle',weight:700}),1));
  s+=fade(seg(p,.6,.75),label('進む向き →',1180,420,{size:26,color:C.hi,anchor:'end',weight:700}));
  return s;
 },
 [K+'c']:(p)=>{
  let s=emWave(1.6+.8*p,{g:.8});
  s+=card(250,4,700,124,tex(`${cs(C.v,'v')}=\\dfrac{${tL}}{${tT}}\\approx 3.0\\times 10^{8}\\,\\mathrm{m/s}`,600,70,{size:36,auto:false}),seg(p,.02,.15),C.hi);
  s+=fade(seg(p,.35,.5),label('秒速 約30万 km ＝ 光の速さ',600,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('電場と磁場の 法則から 導くのは 上級',1150,420,{size:24,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'summary']:(p)=>{
  let s=card(90,60,1020,170,label('位相差',140,125,{size:34,color:PH,weight:700})+label('1周期の ずれ ＝ 2π と 数えた 角度',400,125,{size:30,color:C.ink})+label('1/4 周期 → π/2',400,190,{size:28,color:PH}),seg(p,.05,.2),PH);
  s+=card(90,270,1020,170,label('波の速さ',140,335,{size:34,color:C.v,weight:700})+label('1周期に 1波長 進む',400,335,{size:30,color:C.ink})+tex(`${cs(C.v,'v')}=\\dfrac{${tL}}{${tT}}`,500,400,{size:36,auto:false}),seg(p,.4,.55),C.v);
  return s;
 },
 [K+'look']:(p)=>{
  const A=axes({x:110,y:450,w:460,h:340,xmax:2.3,ymax:26,xlabel:'t [s]',ylabel:'x [m]',xticks:[1,2],yticks:[5,10,15,20,25],grid:true,xcolor:C.t,ycolor:C.x});
  const xt=t=>5*t*t,lg=3*seg(p,.1,.8),h=Math.pow(10,-lg),k=(xt(1+h)-xt(1))/h;
  let s=A.svg+A.plot(xt,{from:0,to:2.2,color:C.x,w:4})+dot(A.X(1),A.Y(5),9,C.hi)+dot(A.X(1+h),A.Y(xt(1+h)),9,C.hi);
  s+=draw([[A.X(.65),A.Y(5-.35*k)],[A.X(Math.min(2.25,1+h+.35)),A.Y(5+k*(Math.min(2.25,1+h+.35)-1))]],1,{color:C.v,w:4});
  const rows=[['1','15'],['0.1','10.5'],['0.01','10.05']];let t='';
  rows.forEach(([w,v],i)=>{t+=fade(seg(p,.1+.2*i,.2+.2*i),label(`幅 ${w} s`,700,190+i*65,{size:30,color:C.t})+label('→',860,190+i*65,{size:30,color:C.dim})+label(`${v} m/s`,1120,190+i*65,{size:32,color:C.v,anchor:'end',weight:700}));});
  s+=card(660,110,500,260,label('初級の最初：平均の速さ',910,150,{size:24,color:C.dim,anchor:'middle'})+t);
  s+=fade(seg(p,.8,.92),label('近づく先 ＝ 10 m/s',910,440,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'look2']:(p)=>{
  const items=[['傾き','速さ・電流',C.v],['面積','距離・仕事',C.F],['周期','時間の 山の間隔',TC],['波長','場所の 山の間隔',LC]];
  let s=label('図と 数表から 読みとってきた',600,90,{size:32,color:C.ink,anchor:'middle'});
  items.forEach(([a,b,c],i)=>{const x=80+i*270;s+=card(x,150,250,220,label(a,x+125,235,{size:40,color:c,anchor:'middle',weight:700})+label(b,x+125,310,{size:24,color:C.ink,anchor:'middle'}),seg(p,.1+.15*i,.22+.15*i),c);});
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(200,70,800,330,label('次の問い',600,125,{size:26,color:C.dim,anchor:'middle'})
   +label('近づく先を、数表なしで',600,200,{size:34,color:C.ink,anchor:'middle'})
   +label('式から 直接 取り出すには？',600,265,{size:38,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('→ 微分・中級へ',600,350,{size:32,color:C.v,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
};
