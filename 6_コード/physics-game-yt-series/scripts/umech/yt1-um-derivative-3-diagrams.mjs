// YouTube シリーズ 微分・上級 3/3（ステージ um-derivative 本11・本12）— 図。Stage 1200×515.
// 色：位置 x 水色、速度 v 紫、加速度 a 赤、時刻 t 金、幅 h 橙、強調 黄。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,poly} from './anim.mjs';

const K='um-derivative-3:';
const CH=C.E;
const card=(x,y,w,hh,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,hh,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
const top=(s,g=1)=>fade(g,label(s,600,44,{size:26,color:C.dim,anchor:'middle'}));

// ---- the three stacked graphs x, v, a -----------------------------------------------------------
const X3=t=>t*t*t-3*t,V3=t=>3*t*t-3,A3=t=>6*t;
const PAN=[{f:X3,d:V3,col:C.x,name:'x',y:160,ymin:-2.6,ymax:3.2},{f:V3,d:A3,col:C.v,name:'v',y:320,ymin:-4,ymax:11},{f:A3,d:()=>6,col:C.a,name:'a',y:480,ymin:-10,ymax:13}];
function stack({g=[1,1,1],T=null,tan=[0,0],gl=1,lab=[0,0,0],x0=150,w=560,tmin=-1.5,tmax=2.1,pans=PAN,hh=130}={}){
 let s='';const As=[];
 pans.forEach((P,i)=>{
  const A=axes({x:x0,y:P.y,w,h:hh,xmin:tmin,xmax:tmax,ymin:P.ymin,ymax:P.ymax,xlabel:i===2?'t':'',ylabel:'',xcolor:C.t});As.push(A);
  s+=fade(g[i],A.svg+A.plot(P.f,{from:tmin,to:tmax,color:P.col,w:4})+label(P.name,x0-40,P.y-hh/2+10,{size:32,color:P.col,weight:700,anchor:'middle'}));
 });
 if(T!==null){
  s+=fade(gl,line(As[0].X(T),30,As[0].X(T),490,{color:C.faint,w:2,dash:'5 6'}));
  pans.forEach((P,i)=>{
   const A=As[i];s+=fade(g[i],dot(A.X(T),A.Y(P.f(T)),8,C.hi));
   if(i<2&&tan[i]>0){const k=P.d(T),dt=Math.min(.5,(P.ymax-P.ymin)*.22/Math.max(1e-6,Math.abs(k)));s+=fade(tan[i],draw([[A.X(T-dt),A.Y(P.f(T)-k*dt)],[A.X(T+dt),A.Y(P.f(T)+k*dt)]],1,{color:C.hi,w:4,dash:'10 6'}));}
   if(lab[i]&&lab[i][1]>0)s+=fade(lab[i][1],label(lab[i][0],A.X(T)+14,A.Y(P.f(T))-12,{size:24,color:C.hi,weight:700}));
  });
 }
 return {s,As};
}

// ---- |t| helpers ------------------------------------------------------------------------------
function absAxes({x=120,y=440,w=520,h=320}={}){return axes({x,y,w,h,xmin:-1.2,xmax:1.2,ymin:-.2,ymax:1.2,xlabel:'t',ylabel:'x',xcolor:C.t,ycolor:C.x});}
// zoom window: plot f on [c-wd, c+wd] into a square panel
function zoomPanel(f,c,wd,x,y,sz,{col=C.x,title=''}={}){
 const fc=f(c);let pts=[];for(let i=0;i<=80;i++){const u=c-wd+2*wd*i/80;pts.push([x+sz*(i/80),y+sz/2-(f(u)-fc)/wd*sz/2]);}
 pts=pts.filter(q=>q[1]>=y-2&&q[1]<=y+sz+2);
 return rect(x,y,sz,sz,{fill:'#0f182c',fo:1,stroke:C.faint,sw:2,rx:6})+draw(pts,1,{color:col,w:4})+label(title,x+sz/2,y+sz+30,{size:24,color:C.dim,anchor:'middle'});
}

export const ytUmDerivative3Diagrams={
 // ================= S1 =================
 [K+'ask']:(p)=>{
  const {s:st}=stack({g:[seg(p,.1,.3),seg(p,.3,.5),seg(p,.5,.7)]});
  let s=st;
  s+=card(760,90,400,220,label('前回の最後の問い',960,140,{size:24,color:C.dim,anchor:'middle'})+label('x → v → a',960,205,{size:36,color:C.ink,anchor:'middle',weight:700})+label('順に微分すると 何が読める？',960,265,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  const {s:st}=stack({});
  let s=st+card(760,90,400,220,label('x → v → a',960,150,{size:34,color:C.ink,anchor:'middle',weight:700})+label('何が読める？',960,200,{size:26,color:C.hi,anchor:'middle'})
   +fade(seg(p,.05,.25),label('傾きは 1つに 決まる？',960,270,{size:28,color:C.a,anchor:'middle',weight:700})),1,C.hi);
  return s;
 },
 [K+'table']:(p)=>{
  let s=label('微分の表（前の2本）',600,50,{size:30,color:C.hi,anchor:'middle',weight:700});
  const rows=[['t^n','n\\,t^{n-1}'],['\\sin t','\\cos t'],['\\cos t','-\\sin t']];
  rows.forEach((r,i)=>{const y=150+i*100;s+=fade(seg(p,.1+i*.15,.25+i*.15),tex(r[0],450,y,{size:52})+label('→',600,y+10,{size:36,color:C.dim,anchor:'middle'})+tex(r[1],760,y,{size:52}));});
  s+=fade(seg(p,.75,.9),label('＋ 定数倍・和の規則',600,470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },

 // ================= S2 =================
 [K+'def1']:(p)=>{
  const {s:st}=stack({g:[1,seg(p,.3,.5),0],T:-.6,tan:[seg(p,.5,.7),0],gl:seg(p,.5,.7)});
  let s=st;
  s+=card(760,70,410,190,tex('v=\\dfrac{dx}{dt}',965,150,{size:50})+label('x の傾き → v の値',965,230,{size:26,color:C.v,anchor:'middle',weight:700}),seg(p,.02,.2),C.v);
  return s;
 },
 [K+'def2']:(p)=>{
  const {s:st}=stack({g:[1,1,seg(p,.3,.5)],T:-.6,tan:[1,seg(p,.5,.7)],gl:1});
  let s=st;
  s+=card(760,70,410,190,tex('v=\\dfrac{dx}{dt}',965,150,{size:50})+label('x の傾き → v の値',965,230,{size:26,color:C.v,anchor:'middle',weight:700}),1,C.v);
  s+=card(760,290,410,190,tex('a=\\dfrac{dv}{dt}',965,370,{size:50})+label('v の傾き → a の値',965,450,{size:26,color:C.a,anchor:'middle',weight:700}),seg(p,.02,.2),C.a);
  return s;
 },
 [K+'d2']:(p)=>{
  let s=tex('a=\\dfrac{dv}{dt}=\\dfrac{d}{dt}\\left(\\dfrac{dx}{dt}\\right)',600,140,{size:52});
  s+=fade(seg(p,.4,.65),tex('=\\dfrac{d^2x}{dt^2}',600,300,{size:64}));
  s+=fade(seg(p,.6,.8),label('x を 2回 微分',600,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'d2b']:(p)=>{
  let s=tex('\\dfrac{d^2x}{dt^2}',300,170,{size:72});
  s+=fade(seg(p,.05,.25),ng(480,140)+label('2乗',520,140,{size:30,color:C.a}));
  s+=fade(seg(p,.2,.4),ok(480,210)+label('微分を 2回 した 印',520,210,{size:30,color:C.F,weight:700}));
  s+=fade(seg(p,.55,.75),label('単位：m ÷ s ÷ s ＝ m/s²',600,380,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=top('例');
  s+=tex('x=t^3-3t',600,180,{size:72});
  s+=fade(seg(p,.4,.6),label('x ［m］、t ［s］',600,320,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'v']:(p)=>{
  let s=tex('x=t^3-3t',600,70,{size:48});
  s+=fade(seg(p,.1,.3),tex('t^3\\ \\to\\ 3t^2',380,190,{size:46}));
  s+=fade(seg(p,.3,.5),tex('-3t\\ \\to\\ -3',820,190,{size:46}));
  s+=fade(seg(p,.6,.8),tex('v=3t^2-3',600,340,{size:64})+highlight(420,285,360,100,seg(p,.8,.95),C.v));
  return s;
 },
 [K+'a']:(p)=>{
  let s=tex('v=3t^2-3',600,70,{size:48});
  s+=fade(seg(p,.1,.3),tex('3t^2\\ \\to\\ 6t',380,190,{size:46}));
  s+=fade(seg(p,.3,.5),tex('-3\\ \\to\\ 0',820,190,{size:46})+label('定数は 変わらない',820,250,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),tex('a=6t',600,350,{size:64})+highlight(480,295,240,100,seg(p,.8,.95),C.a));
  return s;
 },
 [K+'stack']:(p)=>{
  const {s:st}=stack({g:[seg(p,.05,.25),seg(p,.3,.5),seg(p,.55,.75)]});
  let s=st;
  s+=fade(seg(p,.05,.25),tex('x=t^3-3t',960,110,{size:40}));
  s+=fade(seg(p,.3,.5),tex('v=3t^2-3',960,270,{size:40}));
  s+=fade(seg(p,.55,.75),tex('a=6t',960,430,{size:40}));
  return s;
 },
 [K+'link']:(p)=>{
  const T=mix(-1.3,1.9,seg(p,.05,.95));
  const {s:st}=stack({T,tan:[1,1]});
  let s=st;
  s+=tex('x=t^3-3t',960,110,{size:40})+tex('v=3t^2-3',960,270,{size:40})+tex('a=6t',960,430,{size:40});
  s+=label('傾き ↓ 高さ',800,200,{size:24,color:C.hi})+label('傾き ↓ 高さ',800,360,{size:24,color:C.hi});
  return s;
 },

 // ================= S3 =================
 [K+'t0']:(p)=>{
  const {s:st}=stack({T:0,tan:[seg(p,.05,.2),seg(p,.55,.7)],lab:[0,['−3',seg(p,.3,.45)],['0',seg(p,.75,.9)]]});
  let s=st;
  s+=card(760,60,410,420,label('t ＝ 0',965,110,{size:32,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,.05,.2),label('x の傾き −3（右下がり）',965,180,{size:26,color:C.x,anchor:'middle'}))
   +fade(seg(p,.3,.45),label('v ＝ −3 m/s',965,250,{size:30,color:C.v,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('v は 谷の底（傾き 0）',965,320,{size:26,color:C.v,anchor:'middle'}))
   +fade(seg(p,.75,.9),label('a ＝ 0',965,390,{size:30,color:C.a,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'predict']:(p)=>{
  const {s:st}=stack({T:1,gl:seg(p,.05,.2)});
  let s=st;
  s+=card(760,140,410,220,label('t ＝ 1 では？',965,200,{size:34,color:C.hi,anchor:'middle',weight:700})+label('速度 v ＝ ？',965,265,{size:30,color:C.v,anchor:'middle'})+label('加速度 a ＝ ？',965,320,{size:30,color:C.a,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'t1']:(p)=>{
  const {s:st}=stack({T:1,tan:[seg(p,.4,.6),0],lab:[0,['0',seg(p,.1,.3)],0]});
  let s=st;
  s+=card(760,60,410,220,tex('v=3-3=0',965,130,{size:44})+fade(seg(p,.4,.6),label('x の谷底：接線が 水平',965,220,{size:26,color:C.x,anchor:'middle',weight:700})),1,C.v);
  return s;
 },
 [K+'t1b']:(p)=>{
  const {s:st}=stack({T:1,tan:[1,0],lab:[0,['0',1],0]});
  let s=st;
  s+=card(760,60,410,220,label('一瞬 止まり',965,130,{size:30,color:C.ink,anchor:'middle'})+label('向きを 変える',965,180,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.65),label('折り返し点',965,245,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  // arrows on x curve: moving down before, up after
  const A=axes({x:150,y:160,w:560,h:130,xmin:-1.5,xmax:2.1,ymin:-2.6,ymax:3.2});
  s+=fade(seg(p,.2,.4),arrow(A.X(.55),A.Y(X3(.55))-18,A.X(.85),A.Y(X3(.85))-18,{color:C.x,w:3,head:12})+arrow(A.X(1.15),A.Y(X3(1.15))-18,A.X(1.45),A.Y(X3(1.45))-18,{color:C.x,w:3,head:12}));
  return s;
 },
 [K+'t1a']:(p)=>{
  const {s:st}=stack({T:1,tan:[1,seg(p,.4,.6)],lab:[0,['0',1],['6',seg(p,.1,.3)]]});
  let s=st;
  s+=card(760,60,410,420,tex('a=6\\times1',965,130,{size:44})+fade(seg(p,.1,.3),label('＝ 6 m/s²',965,200,{size:34,color:C.a,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.7),label('v ＝ 0 でも',965,300,{size:30,color:C.v,anchor:'middle'})+label('a ≠ 0',965,360,{size:38,color:C.hi,anchor:'middle',weight:700})),1,C.a);
  return s;
 },
 [K+'t1c']:(p)=>{
  const {s:st}=stack({T:1,tan:[1,1],lab:[0,['0',1],['6',1]]});
  let s=st;
  const A=axes({x:150,y:320,w:560,h:130,xmin:-1.5,xmax:2.1,ymin:-4,ymax:11});
  s+=fade(seg(p,.05,.3),label('負',A.X(.55),A.Y(-2.5)+34,{size:28,color:C.v,anchor:'middle',weight:700})+label('正',A.X(1.45),A.Y(3.4)-12,{size:28,color:C.v,anchor:'middle',weight:700}));
  s+=card(760,60,410,300,label('v：負 → 正',965,130,{size:32,color:C.v,anchor:'middle',weight:700})+label('増え続けている',965,190,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.7),label('→ a ＞ 0',965,270,{size:36,color:C.a,anchor:'middle',weight:700})),seg(p,0,.15),C.v);
  return s;
 },
 [K+'t1num']:(p)=>{
  let s=top('差商で 確かめる（t ＝ 1、h ＝ 0.001）');
  s+=fade(seg(p,.2,.45),tex('\\dfrac{x(1.001)-x(1)}{0.001}\\approx0.003',600,170,{size:46}));
  s+=fade(seg(p,.55,.8),tex('\\dfrac{v(1.001)-v(1)}{0.001}\\approx6.003',600,330,{size:46}));
  return s;
 },
 [K+'t1num2']:(p)=>{
  let s=top('差商で 確かめる（t ＝ 1、h ＝ 0.001）');
  s+=tex('\\dfrac{x(1.001)-x(1)}{0.001}\\approx0.003',470,170,{size:42})+tex('\\dfrac{v(1.001)-v(1)}{0.001}\\approx6.003',470,330,{size:42});
  s+=fade(seg(p,.05,.3),label('→ 0 ＝ v(1)',920,180,{size:32,color:C.v,weight:700})+label('→ 6 ＝ a(1)',920,340,{size:32,color:C.a,weight:700}));
  s+=fade(seg(p,.6,.8),ok(1120,180)+ok(1120,340));
  return s;
 },
 [K+'t2']:(p)=>{
  const {s:st}=stack({T:2,tan:[1,1],lab:[0,['9',seg(p,.1,.3)],['12',seg(p,.4,.6)]]});
  let s=st;
  s+=card(760,60,410,300,label('t ＝ 2',965,110,{size:32,color:C.t,anchor:'middle',weight:700})
   +fade(seg(p,.05,.3),tex('v=12-3=9\\ \\mathrm{m/s}',965,190,{size:38}))
   +fade(seg(p,.4,.6),tex('a=12\\ \\mathrm{m/s^2}',965,280,{size:38})),1);
  return s;
 },

 // ================= S4 =================
 ...(()=>{
  const XO=t=>3*Math.sin(2*t),VO=t=>6*Math.cos(2*t),AO=t=>-12*Math.sin(2*t);
  const P2=[{f:XO,d:VO,col:C.x,name:'x',y:160,ymin:-4,ymax:4},{f:VO,d:AO,col:C.v,name:'v',y:320,ymin:-7.5,ymax:7.5},{f:AO,d:()=>0,col:C.a,name:'a',y:480,ymin:-13,ymax:13}];
  const st=(o={})=>stack({pans:P2,tmin:0,tmax:3.3,...o}).s;
  return {
   [K+'osc1']:(p)=>{
    let s=st({g:[1,0,0]});
    s+=card(760,60,410,240,tex('x=3\\sin 2t',965,130,{size:46})+fade(seg(p,.4,.6),label('中身 2t の 倍率 ＝ 2',965,220,{size:28,color:CH,anchor:'middle',weight:700})),1,C.x);
    return s;
   },
   [K+'osc2']:(p)=>{
    let s=st({g:[1,seg(p,.5,.7),0]});
    s+=card(760,60,410,300,tex('x=3\\sin 2t',965,120,{size:40})
     +fade(seg(p,.05,.25),label('sin → cos',965,190,{size:28,color:C.ink,anchor:'middle'}))+fade(seg(p,.25,.45),label('× 中身の 2',965,240,{size:28,color:CH,anchor:'middle',weight:700}))
     +fade(seg(p,.5,.7),tex('v=6\\cos 2t',965,310,{size:42})),1,C.v);
    return s;
   },
   [K+'osc3']:(p)=>{
    let s=st({g:[1,1,seg(p,.5,.7)]});
    s+=card(760,60,410,300,tex('v=6\\cos 2t',965,120,{size:40})
     +fade(seg(p,.05,.25),label('cos → −sin',965,190,{size:28,color:C.ink,anchor:'middle'}))+fade(seg(p,.25,.45),label('× 中身の 2',965,240,{size:28,color:CH,anchor:'middle',weight:700}))
     +fade(seg(p,.5,.7),tex('a=-12\\sin 2t',965,310,{size:42})),1,C.a);
    return s;
   },
   [K+'osc4']:(p)=>{
    let s=st({});
    s+=card(760,60,410,420,tex('a=-12\\sin 2t',965,120,{size:40})+fade(seg(p,.1,.35),tex('=-4\\times3\\sin 2t',965,200,{size:40}))
     +fade(seg(p,.4,.6),tex('a=-4x',965,290,{size:56}))+fade(seg(p,.65,.85),label('位置と いつも 逆向き',965,390,{size:28,color:C.hi,anchor:'middle',weight:700})),1,C.a);
    return s;
   },
   [K+'osc5']:(p)=>{
    let s=st({});
    s+=card(760,120,410,260,label('位置の式 1つ',965,190,{size:32,color:C.x,anchor:'middle',weight:700})+label('↓ 微分',965,250,{size:28,color:C.dim,anchor:'middle'})+label('速度・加速度',965,315,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2));
    return s;
   },
  };
 })(),

 // ================= S5 =================
 [K+'abs']:(p)=>{
  const A=absAxes();
  let s=A.svg+A.plot(Math.abs,{from:-1.1,to:1.1,color:C.x,w:5,p:seg(p,.05,.35)});
  s+=fade(seg(p,.2,.4),label('x ＝ −t',A.X(-.08),A.Y(.8),{size:26,color:C.x,anchor:'end'})+label('x ＝ t',A.X(.08),A.Y(.8),{size:26,color:C.x}));
  s+=fade(seg(p,.6,.8),ring(A.X(0),A.Y(0),20,{color:C.hi,w:3})+label('尖った角',A.X(0),A.Y(0)+50,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=card(760,100,400,200,tex('x=|t|',960,190,{size:60})+label('t ＝ 0 で 傾きは？',960,260,{size:28,color:C.hi,anchor:'middle'}),seg(p,.02,.2));
  return s;
 },
 ...(()=>{
  const sec=(A,hv,col)=>draw([[A.X(0),A.Y(0)],[A.X(hv),A.Y(Math.abs(hv))]],1,{color:col,w:4})+dot(A.X(hv),A.Y(Math.abs(hv)),7,col);
  const base=()=>{const A=absAxes();return {A,s:A.svg+A.plot(Math.abs,{from:-1.1,to:1.1,color:C.x,w:4})+dot(A.X(0),A.Y(0),7,C.hi)};};
  return {
   [K+'absr']:(p)=>{
    const {A,s:b}=base();let s=b;
    const hv=mix(.9,.3,seg(p,.1,.6));
    s+=sec(A,hv,C.F)+label('h ＞ 0',A.X(hv)+12,A.Y(hv)+8,{size:24,color:C.F})+fade(seg(p,.6,.8),label('傾き ＋1',A.X(.25)+20,A.Y(.1)+6,{size:26,color:C.F,weight:700}));
    s+=card(700,70,470,300,label('右から（h ＝ 0.01）',935,130,{size:28,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.3,.55),tex('\\dfrac{|0.01|-0}{0.01}',935,220,{size:46,auto:false}))+fade(seg(p,.6,.8),label('＝ ＋1',935,320,{size:40,color:C.F,anchor:'middle',weight:700})),1,C.F);
    return s;
   },
   [K+'absl']:(p)=>{
    const {A,s:b}=base();let s=b+sec(A,.3,C.F);
    const hv=-mix(.9,.3,seg(p,.1,.6));
    s+=sec(A,hv,C.a)+label('h ＜ 0',A.X(hv)-12,A.Y(-hv)+8,{size:24,color:C.a,anchor:'end'})+fade(seg(p,.6,.8),label('傾き −1',A.X(-.25)-20,A.Y(.1)+6,{size:26,color:C.a,weight:700,anchor:'end'}));
    s+=card(700,70,470,300,label('左から（h ＝ −0.01）',935,130,{size:28,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.3,.55),tex('\\dfrac{|-0.01|-0}{-0.01}',935,220,{size:46,auto:false}))+fade(seg(p,.6,.8),label('＝ −1',935,320,{size:40,color:C.a,anchor:'middle',weight:700})),1,C.a);
    return s;
   },
   [K+'absm']:(p)=>{
    const {A,s:b}=base();let s=b;
    const hv=mix(.3,.02,seg(p,.05,.6));
    s+=sec(A,hv,C.F)+sec(A,-hv,C.a);
    s+=card(700,70,470,320,label('h → 0',935,120,{size:30,color:CH,anchor:'middle',weight:700})+label('右から：＋1 のまま',935,190,{size:30,color:C.F,anchor:'middle'})+label('左から：−1 のまま',935,250,{size:30,color:C.a,anchor:'middle'})+fade(seg(p,.6,.8),label('行き先が 一致しない',935,330,{size:32,color:C.hi,anchor:'middle',weight:700})),1);
    return s;
   },
   [K+'absnd']:(p)=>{
    const {A,s:b}=base();let s=b+sec(A,.4,C.F)+sec(A,-.4,C.a);
    s+=card(700,70,470,320,label('t ＝ 0 では',935,130,{size:30,color:C.ink,anchor:'middle'})+label('微分できない',935,200,{size:40,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.5,.7),label('差商の定義から 導いた結果',935,290,{size:26,color:C.dim,anchor:'middle'})),seg(p,.02,.2),C.a);
    return s;
   },
  };
 })(),
 [K+'zoom1']:(p)=>{
  let s=label('x ＝ t² を t ＝ 1 の近くで 拡大',600,44,{size:26,color:C.dim,anchor:'middle'});
  const f=u=>u*u;
  s+=fade(seg(p,.05,.2),zoomPanel(f,1,1,120,110,260,{title:'1 倍'}));
  s+=fade(seg(p,.3,.45),zoomPanel(f,1,.1,470,110,260,{title:'10 倍'}));
  s+=fade(seg(p,.55,.7),zoomPanel(f,1,.01,820,110,260,{title:'100 倍'}));
  s+=fade(seg(p,.75,.9),label('→ 直線に 見える',950,460,{size:30,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'zoom2']:(p)=>{
  let s=label('x ＝ |t| を t ＝ 0 の近くで 拡大',600,44,{size:26,color:C.dim,anchor:'middle'});
  const f=Math.abs;
  s+=zoomPanel(f,0,1,120,110,260,{title:'1 倍'});
  s+=fade(seg(p,.1,.25),zoomPanel(f,0,.1,470,110,260,{title:'10 倍'}));
  s+=fade(seg(p,.3,.45),zoomPanel(f,0,.01,820,110,260,{title:'100 倍'}));
  s+=fade(seg(p,.55,.7),label('→ 何倍でも 角のまま',950,460,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cont']:(p)=>{
  const A=absAxes({x:120,y:440,w:460,h:300});
  let s=A.svg+A.plot(Math.abs,{from:-1.1,to:1.1,color:C.x,w:5});
  s+=card(660,70,500,380,label('途切れずに つながる',910,140,{size:30,color:C.F,anchor:'middle',weight:700})+label('（連続）',910,185,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),label('≠',910,245,{size:40,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.7),label('なめらか・微分できる',910,310,{size:30,color:C.a,anchor:'middle',weight:700})+label('|t| は t ＝ 0 で ✗',910,370,{size:26,color:C.dim,anchor:'middle'})),1);
  return s;
 },
 [K+'wall']:(p)=>{
  // picture: wall at left, ball approaching and leaving
  let s=rect(90,40,20,160,{fill:C.dim,fo:.5,stroke:C.dim,sw:2,rx:2});
  for(let q=50;q<200;q+=22)s+=line(90,q,74,q+14,{color:C.faint,w:2});
  const u=seg(p,.05,.6),tt=mix(-1,1,u),bx=110+24+300*Math.abs(tt);
  s+=ring(bx,120,24,{color:C.x,w:3,fill:'#1a2b4a'})+arrow(bx+(tt<0?-30:30),120,bx+(tt<0?-80:80),120,{color:C.v,w:4,head:12});
  s+=label('壁からの 距離 x',300,240,{size:24,color:C.x,anchor:'middle'});
  const A=axes({x:620,y:460,w:480,h:260,xmin:-1.2,xmax:1.2,ymin:-.1,ymax:1.2,xlabel:'t',ylabel:'x',xcolor:C.t,ycolor:C.x});
  s+=fade(seg(p,.4,.6),A.svg+A.plot(Math.abs,{from:-1.1,to:1.1,color:C.x,w:4})+ring(A.X(0),A.Y(0),18,{color:C.hi,w:3}));
  s+=fade(seg(p,.7,.85),label('跳ね返る瞬間に 尖る',860,150,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wall2']:(p)=>{
  const A=axes({x:120,y:250,w:440,h:180,xmin:-1.2,xmax:1.2,ymin:-.1,ymax:1.2,xlabel:'t',ylabel:'x',xcolor:C.t,ycolor:C.x});
  let s=A.svg+A.plot(Math.abs,{from:-1.1,to:1.1,color:C.x,w:4});
  const B=axes({x:120,y:490,w:440,h:180,xmin:-1.2,xmax:1.2,ymin:-1.4,ymax:1.4,xlabel:'t',ylabel:'v',xcolor:C.t,ycolor:C.v});
  s+=fade(seg(p,.05,.3),B.svg+line(B.X(-1.1),B.Y(-1),B.X(0),B.Y(-1),{color:C.v,w:4})+line(B.X(0),B.Y(1),B.X(1.1),B.Y(1),{color:C.v,w:4})+line(B.X(0),B.Y(-1),B.X(0),B.Y(1),{color:C.v,w:2,dash:'4 5'})+label('跳ぶ',B.X(0)+14,B.Y(.45),{size:24,color:C.v}));
  s+=card(640,60,520,420,label('その瞬間の a は 決まらない',900,130,{size:28,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('本物の球：',900,220,{size:26,color:C.dim,anchor:'middle'})+label('短い時間で つぶれて 戻る',900,265,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.65,.8),label('→ 尖りは モデルの 限界',900,350,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.25,.4));
  return s;
 },

 // ================= S6 =================
 [K+'sum1']:(p)=>{
  const {s:st}=stack({T:1,tan:[1,1]});
  let s=st;
  s+=card(760,90,410,300,label('まとめ',965,140,{size:28,color:C.hi,anchor:'middle',weight:700})+label('x の傾き → v',965,200,{size:28,color:C.v,anchor:'middle'})+label('v の傾き → a',965,250,{size:28,color:C.a,anchor:'middle'})+tex('a=\\dfrac{d^2x}{dt^2}',965,330,{size:40}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(90,90,480,300,label('v ＝ 0 でも',330,170,{size:30,color:C.v,anchor:'middle'})+label('a ≠ 0 のことがある',330,230,{size:30,color:C.a,anchor:'middle',weight:700})+tex('x=t^3-3t,\\ t=1',330,320,{size:32}),seg(p,0,.15));
  const A=absAxes({x:700,y:360,w:380,h:220});
  s+=fade(seg(p,.4,.55),A.svg+A.plot(Math.abs,{from:-1.1,to:1.1,color:C.x,w:4})+label('尖った点：傾きが 決まらない',890,420,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next1']:(p)=>{
  let s=label('微分：量 → 傾き',600,110,{size:36,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.35,.55),arrow(600,150,600,250,{color:C.hi,w:4,head:16}));
  s+=fade(seg(p,.5,.7),label('積分：傾き → 元の量',600,320,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  const A=axes({x:120,y:440,w:520,h:320,xmin:0,xmax:3,ymin:0,ymax:3,xlabel:'s',ylabel:'f',xcolor:C.dim,ycolor:C.dim});
  const f=u=>.6+.5*u;
  let s=A.svg;
  const xs=1.8,hv=.25;
  s+=poly([[A.X(0),A.Y(0)],...Array.from({length:21},(_,i)=>[A.X(xs*i/20),A.Y(f(xs*i/20))]),[A.X(xs),A.Y(0)]],{fill:C.E,fo:.25,stroke:'none'});
  s+=fade(seg(p,.2,.4),poly([[A.X(xs),A.Y(0)],[A.X(xs),A.Y(f(xs))],[A.X(xs+hv),A.Y(f(xs+hv))],[A.X(xs+hv),A.Y(0)]],{fill:C.hi,fo:.5,stroke:C.hi,sw:2}));
  s+=A.plot(f,{from:0,to:2.8,color:C.x,w:4});
  s+=card(700,100,460,300,label('面積の増え方',930,170,{size:30,color:C.ink,anchor:'middle'})+label('＝ その場所の高さ',930,230,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.4,.6),label('どう 証明する？',930,320,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
};
