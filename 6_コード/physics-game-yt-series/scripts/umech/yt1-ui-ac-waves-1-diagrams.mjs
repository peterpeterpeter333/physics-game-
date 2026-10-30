// YouTube シリーズ「交流と波・初級 1/2」(ys-ui-ac-waves-1) — 図。Stage 1200×515.
// 色：時刻 t・周期 T 金、ω・振動数 f 桃、角度（中身）橙、電流 I 緑、電圧 V 紫、強調 黄。
// 向き：導線に沿って右向きを正（回路では上の導線で右向き＝時計回り）。円運動の影は振動の方程式の回と同じ形。
import {C,clamp,mix,smooth,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth} from './anim.mjs';

const K='ui-ac-waves-1:';
export const IC=C.F,VC=C.v,TC=C.t,WC=C.p,PH=C.E;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const tI=cs(IC,'I'),tI0=cs(IC,'I_0'),tV=cs(VC,'V'),tV0=cs(VC,'V_0'),tT=cs(TC,'T'),tW=cs(WC,'\\omega'),tF=cs(WC,'f');
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
export const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));
export const P=(cx,cy,R,th)=>[cx+R*Math.cos(th),cy-R*Math.sin(th)];
export const TAU=2*Math.PI;
const U=s=>`\\,\\mathrm{${s}}`;

// ---- circuit loop: source on the left side, resistor on the right; top wire positive = rightward ----
function loop({x1=150,x2=560,y1=120,y2=400,kind='dc',I=1,s=0,g=1}={}){
 const my=(y1+y2)/2;let o='';
 o+=draw([[x1,my-40],[x1,y1],[x2,y1],[x2,my-60]],1,{color:C.dim,w:4})+draw([[x2,my+60],[x2,y2],[x1,y2],[x1,my+40]],1,{color:C.dim,w:4});
 // resistor zigzag on the right side
 const zz=[[x2,my-60]];for(let i=1;i<=6;i++)zz.push([x2+(i%2?16:-16),my-60+20*i-10]);zz.push([x2,my+60]);o+=draw(zz,1,{color:C.ink,w:3});
 o+=label('抵抗',x2+34,my+8,{size:24,color:C.dim});
 if(kind==='dc'){
  o+=line(x1-26,my-10,x1+26,my-10,{color:C.ink,w:5})+line(x1-14,my+10,x1+14,my+10,{color:C.ink,w:9});
  o+=line(x1,my-40,x1,my-10,{color:C.dim,w:4})+line(x1,my+10,x1,my+40,{color:C.dim,w:4});
  o+=label('＋',x1-40,my-18,{size:24,color:C.a,anchor:'end',weight:700})+label('電池',x1-40,my+30,{size:24,color:C.dim,anchor:'end'});
 }else{
  o+=ring(x1,my,40,{color:C.ink,w:3,fill:C.bg});
  o+=draw(Array.from({length:41},(_,i)=>[x1-24+48*i/40,my-12*Math.sin(TAU*i/40)]),1,{color:C.ink,w:3});
  o+=label('交流電源',x1-50,my+8,{size:24,color:C.dim,anchor:'end'});
 }
 // moving charge dots (current direction: clockwise when I>0) along the loop perimeter
 const L=2*(x2-x1)+2*(y2-y1);const pt=d=>{d=((d%L)+L)%L;
  if(d<x2-x1)return [x1+d,y1];d-=x2-x1;if(d<y2-y1)return [x2,y1+d];d-=y2-y1;if(d<x2-x1)return [x2-d,y2];d-=x2-x1;return [x1,y2-d];};
 for(let k=0;k<14;k++){const [px,py]=pt(k*L/14+s);if(Math.abs(py-my)<52&&(Math.abs(px-x1)<3||Math.abs(px-x2)<3))continue;o+=dot(px,py,6,IC,.8);}
 // current arrow on the top wire
 if(Math.abs(I)>.05){const cx=(x1+x2)/2,len=120*I;o+=arrow(cx-len/2,y1-30,cx+len/2,y1-30,{color:IC,w:6,head:18})+label('I',cx,y1-50,{size:28,color:IC,anchor:'middle',weight:700});}
 return fade(g,o);
}

// ---- I–t graph ------------------------------------------------------------------------------
export function itAxes({x=110,y=470,w=880,h=380,xmax=1,ym=2.6,xticks=[],yticks=[],g=1,xlabel='時刻 t',ylabel='電流 I'}={}){
 return axes({x,y,w,h,xmin:0,xmax,ymin:-ym,ymax:ym,xlabel,ylabel,xticks,yticks,g,grid:false,xcolor:TC,ycolor:IC});
}

// ---- circle + shadow (same drawing as the oscillation film), shadow read as current -------------
export function shadow(u,{cx=220,cy=270,R=140,x0=440,trace=0,u0=0,x1=1150,tsc=52,g=1,arc=0,lab='I',col=IC,arcR=46}={}){
 const [px,py]=P(cx,cy,R,u);
 let s=line(cx-R-24,cy,cx+R+24,cy,{color:C.faint,w:2})+line(cx,cy+R+24,cx,cy-R-24,{color:C.faint,w:2})+ring(cx,cy,R,{color:C.dim,w:3});
 if(arc&&u>u0+.02)s+=draw(Array.from({length:61},(_,i)=>P(cx,cy,arcR,u0+(u-u0)*i/60)),1,{color:PH,w:4});
 s+=line(cx,cy,px,py,{color:C.ink,w:3})+dot(px,py,11,C.hi);
 s+=line(px,py,x0,py,{color:C.faint,w:2,dash:'6 6'});
 s+=line(x0,cy-R-16,x0,cy+R+16,{color:C.dim,w:2})+dot(x0,py,10,col);
 if(lab)s+=label(lab,x0-14,cy-R-24,{size:26,color:col,anchor:'end',weight:700});
 if(trace){const X=v=>x0+30+(v-u0)*tsc;
  s+=line(x0,cy,x1,cy,{color:C.faint,w:2})+label('t →',x1,cy+36,{size:24,color:TC,anchor:'end'});
  s+=draw(Array.from({length:241},(_,i)=>{const v=u0+(u-u0)*i/240;return [X(v),cy-R*Math.sin(v)];}),1,{color:col,w:4});
  s+=dot(X(u),py,8,col);}
 return fade(g,s);
}

// sine on I–t axes: I = amp sin(2π t / T + ph)
const sinI=(T,amp=2,ph=0)=>t=>amp*Math.sin(TAU*t/T+ph);

// ---- 50 Hz example axes (t in seconds) ----------------------------------------------------------
const ex50=(g=1)=>{const A=itAxes({x:100,y:450,w:670,h:340,xmax:.046,ym:2.7,xticks:[],yticks:[2,-2],g,xlabel:'t [s]',ylabel:'I [A]'});
 let t='';[.01,.02,.03,.04].forEach(u=>{t+=line(A.X(u),A.Y(2.7),A.X(u),A.Y(-2.7),{color:C.grid,w:1.5})+label(String(u),A.X(u),A.Y(-2.7)+30,{size:21,color:C.dim,anchor:'middle'});});
 return {...A,svg:fade(g,t)+A.svg};};
const I50=t=>2*Math.sin(100*Math.PI*t);
function marker(A,t,{g=1,col=C.hi}={}){const x=A.X(t),y=A.Y(I50(t));return fade(g,line(x,A.Y(0),x,y,{color:TC,w:2,dash:'6 6'})+dot(x,y,11,col));}
function wireArrow(x,y,I,{g=1,scale=60}={}){
 let s=rect(x-150,y-22,300,44,{fill:'#8795ad',fo:.16,stroke:C.dim,sw:2,rx:20});
 if(Math.abs(I)>.05)s+=arrow(x-scale*I,y,x+scale*I,y,{color:IC,w:6,head:18});
 return fade(g,s);
}

export const ytUiAcWaves1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const rows=[['抵抗','I',IC],['コンデンサ','q',C.p],['コイル','\\dfrac{dI}{dt}',IC]];
  let s=label('電圧が 比例する量',600,90,{size:30,color:C.dim,anchor:'middle'});
  rows.forEach(([n,q,c],i)=>{const y=180+i*110,g=seg(p,.1+.12*i,.22+.12*i);
   s+=card(270,y-50,660,96,label(n,330,y+10,{size:32,color:C.ink})+tex(q,720,y+4,{size:i===2?40:44,color:c,auto:false}),g,i===2?C.hi:C.faint);});
  s+=fade(seg(p,.5,.65),label('コイルは 電流の 変わる速さ',600,500,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=card(170,120,860,280,label('前回の 最後の問い',600,180,{size:28,color:C.dim,anchor:'middle'})
   +label('向きが 周期的に 入れ替わる 交流',600,255,{size:36,color:IC,anchor:'middle',weight:700})
   +label('周期・位相、空間を伝わる波は どう読む？',600,330,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'dc']:(p)=>{
  let s=loop({kind:'dc',I:1,s:260*p});
  s+=card(720,140,420,220,label('直流',930,205,{size:40,color:IC,anchor:'middle',weight:700})+label('いつも 同じ向き',930,270,{size:30,color:C.ink,anchor:'middle'})+label('（電池）',930,325,{size:26,color:C.dim,anchor:'middle'}),seg(p,.2,.35));
  return s;
 },
 [K+'ac']:(p)=>{
  const ph=TAU*2*p,I=Math.sin(ph);
  let s=loop({kind:'ac',I,s:-70*Math.cos(ph)+70});
  s+=card(720,140,420,220,label('交流',930,205,{size:40,color:IC,anchor:'middle',weight:700})+label('向きが 入れ替わる',930,270,{size:30,color:C.ink,anchor:'middle'})+label('（コンセント）',930,325,{size:26,color:C.dim,anchor:'middle'}),seg(p,.15,.3));
  s+=fade(seg(p,.4,.55),label('1秒に 何十回も',930,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ask']:(p)=>{
  const ph=TAU*1.5*p;let s=fade(.45,loop({kind:'ac',I:Math.sin(ph),s:-70*Math.cos(ph)+70}));
  s+=card(640,90,500,330,label('今回の問い',890,145,{size:26,color:C.dim,anchor:'middle'})
   +label('交流は 何で 表す？',890,210,{size:34,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('周期・振動数・振幅',890,290,{size:32,color:C.ink,anchor:'middle'})+label('それぞれ 何を 測る？',890,350,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.hi);
  return s;
 },

 // ===== S2 向きを符号で表す =====
 [K+'sign']:(p)=>{
  let s=arrow(200,90,1000,90,{color:C.dim,w:3,head:14})+label('正の向き',1010,98,{size:26,color:C.ink});
  const row=(y,dir,g,txt,val)=>{let o=rect(150,y-40,700,80,{fill:'#8795ad',fo:.14,stroke:C.dim,sw:2,rx:36});
   for(let k=0;k<6;k++){let x=180+((k*120+dir*300*p)%720+720)%720;if(x>820)continue;o+=ring(x,y,14,{color:C.a,w:2.5,fill:'#3a1d2a'})+label('＋',x,y+8,{size:20,color:C.a,anchor:'middle',weight:700});}
   o+=arrow(dir>0?420:580,y-58,dir>0?580:420,y-58,{color:IC,w:6,head:18});
   o+=label(txt,900,y-6,{size:28,color:C.ink})+tex(val,1030,y+40,{size:38,auto:false,color:IC});return fade(g,o);};
  s+=row(220,1,seg(p,.05,.2),'右向き','I=+2\\,\\mathrm{A}');
  s+=row(410,-1,seg(p,.45,.6),'左向き','I=-2\\,\\mathrm{A}');
  return s;
 },
 [K+'dcgraph']:(p)=>{
  const A=itAxes({g:seg(p,0,.15)});
  let s=A.svg+fade(seg(p,.15,.3),rect(A.X(0),A.Y(2.6),A.X(1)-A.X(0),A.Y(0)-A.Y(2.6),{fill:IC,fo:.06,stroke:'none'})+label('正 ＝ 右向き',A.X(1)-10,A.Y(2.3),{size:26,color:IC,anchor:'end'}));
  s+=A.plot(()=>1.5,{from:0,to:.98,p:seg(p,.3,.8),color:IC,w:5});
  s+=fade(seg(p,.75,.9),label('直流：ずっと 正の側',A.X(.5),A.Y(1.5)-24,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'acgraph']:(p)=>{
  const A=itAxes(),f=sinI(.4,2);
  let s=A.svg;
  s+=rect(A.X(0),A.Y(2.6),A.X(1)-A.X(0),A.Y(0)-A.Y(2.6),{fill:IC,fo:.06,stroke:'none'});
  s+=fade(seg(p,.45,.6),rect(A.X(0),A.Y(0),A.X(1)-A.X(0),A.Y(-2.6)-A.Y(0),{fill:C.a,fo:.06,stroke:'none'}));
  s+=A.plot(f,{from:0,to:.98,p:seg(p,.05,.45),color:IC,w:5});
  s+=fade(seg(p,.45,.6),label('上：右向き →',1010,A.Y(1.6),{size:26,color:IC,weight:700})+label('下：左向き ←',1010,A.Y(-1.9),{size:26,color:C.a,weight:700}));
  return s;
 },
 [K+'cycle']:(p)=>{
  const A=itAxes({w:640}),f=sinI(.8,2),t=.8*seg(p,.02,.92);
  let s=A.svg+fade(.35,A.plot(f,{from:0,to:.98,color:IC,w:4}))+A.plot(f,{from:0,to:Math.max(.001,t),color:IC,w:6})+dot(A.X(t),A.Y(f(t)),11,C.hi);
  const tags=[[.1,'増える',.1,80,62],[.2,'最大',.22,0,-26],[.4,'0 を通る',.42,80,-24],[.6,'逆向きに 最大',.62,0,50],[.8,'戻る',.84,50,-30]];
  tags.forEach(([tt,txt,a,dx,dy])=>{s+=fade(seg(p,a,a+.08),label(txt,A.X(tt)+dx,A.Y(f(tt))+dy,{size:26,color:C.hi,anchor:'middle',weight:700}));});
  s+=wireArrow(990,200,f(t)/2,{scale:50})+label('導線の 電流',990,270,{size:24,color:C.dim,anchor:'middle'});
  return s;
 },
 [K+'sinwave']:(p)=>{
  const A=itAxes(),f=sinI(.4,2);
  let s=A.svg+A.plot(f,{from:0,to:.98,color:IC,w:5});
  s+=card(640,20,380,80,label('正弦波',830,74,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.45,.6),tex('\\sin',1080,62,{size:44,auto:false,color:C.ink})+label('と同じ形',1080,108,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'minus']:(p)=>{
  let s=arrow(250,110,950,110,{color:C.dim,w:3,head:14})+label('正の向き',960,118,{size:26,color:C.ink});
  s+=rect(250,200,700,80,{fill:'#8795ad',fo:.14,stroke:C.dim,sw:2,rx:36});
  s+=arrow(680,240,520,240,{color:IC,w:8,head:22});
  s+=tex('I=-2\\,\\mathrm{A}',600,360,{size:50,auto:false,color:IC});
  s+=fade(seg(p,.2,.35),ng(300,450)+label('小さい 電流',345,450,{size:30,color:C.a}));
  s+=fade(seg(p,.5,.65),ok(640,450)+label('左向きに 2 A',685,450,{size:30,color:IC,weight:700}));
  return s;
 },

 // ===== S3 円運動の影で描く =====
 [K+'shadow']:(p)=>shadow(TAU*1.3*seg(p,.05,.95),{trace:1,lab:'I'}),
 [K+'readI']:(p)=>{
  const u=TAU*.3+.9*seg(p,.05,.6);
  let s=shadow(u,{trace:0,cx:300,cy:270,R:170,x0:560,arc:1,u0:0,arcR:60});
  const [ex,ey]=P(300,270,170,u);s+=fade(seg(p,.1,.25),label('半径 ＝ I₀',(300+ex)/2-10,(270+ey)/2+60,{size:26,color:IC,anchor:'middle',weight:700}));
  const [lx,ly]=P(300,270,90,u/2);s+=fade(seg(p,.4,.55),label('ωt',lx+6,ly+10,{size:26,color:PH,weight:700}));
  s+=card(680,110,470,260,label('影の高さ ＝ 電流 I',915,175,{size:32,color:IC,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),label('半径 ＝ 一番大きな 電流 I₀',915,245,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.45,.6),label('回った角度 ＝ ωt',915,315,{size:30,color:PH,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'formula']:(p)=>{
  const u=TAU*.3+.9+.6*p;
  let s=shadow(u,{trace:0,cx:300,cy:270,R:170,x0:560,arc:0});
  const f=`${tI}=${tI0}\\sin ${cs(PH,`${tW} t`)}`;
  s+=tex(f,900,170,{size:56,auto:false});
  s+=fade(seg(p,.3,.45),label('ω：角振動数',900,290,{size:30,color:WC,anchor:'middle',weight:700})+label('1秒あたりに 進む 角度',900,345,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'period']:(p)=>{
  const u=TAU*1.08*seg(p,.02,.7);
  let s=shadow(u,{trace:1,lab:'I',tsc:62});
  const X=v=>440+30+v*62;
  s+=fade(seg(p,.72,.85),line(X(0),130,X(0),410,{color:TC,w:2,dash:'6 6'})+line(X(TAU),130,X(TAU),410,{color:TC,w:2,dash:'6 6'})+brace(X(0),X(TAU),110,{dir:-1,text:'一周 ＝ 周期 T',size:28,color:TC}));
  return s;
 },
 [K+'T2pi']:(p)=>{
  let s=shadow(TAU*1.08,{trace:1,lab:'I',tsc:62,g:.35});
  const f=`${tT}=\\dfrac{2\\pi}{${tW}}`;
  s+=card(330,60,540,410,label('一周の角度',600,110,{size:28,color:PH,anchor:'middle'})+tex(`${cs(PH,'2\\pi')}`,600,160,{size:40,auto:false})
   +fade(seg(p,.25,.4),tex(f,600,330,{size:72,auto:false})+highlight(600-texWidth(f,72,false)/2-30,215,texWidth(f,72,false)+60,205,seg(p,.4,.55)))
   +fade(seg(p,.5,.65),label('振動の方程式の回と 同じ',600,452,{size:24,color:C.dim,anchor:'middle'})),1,C.hi);
  return s;
 },
 [K+'roundtrip']:(p)=>{
  const u=TAU*1.08;let s=shadow(u,{trace:1,lab:'I',tsc:62});
  const X=v=>470+v*62,cy=270;
  s+=fade(seg(p,.05,.2),rect(X(0),cy-150,X(Math.PI)-X(0),150,{fill:IC,fo:.12,stroke:'none'})+label('右向き →',(X(0)+X(Math.PI))/2,cy-160,{size:26,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),rect(X(Math.PI),cy,X(TAU)-X(Math.PI),150,{fill:C.a,fo:.12,stroke:'none'})+label('← 左向き',(X(Math.PI)+X(TAU))/2,cy+180,{size:26,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),brace(X(0),X(TAU),cy+215,{dir:1,text:'',size:26,color:TC})+label('1往復 ＝ T',X(TAU)+30,cy+238,{size:28,color:TC,weight:700}));
  return s;
 },

 // ===== S4 周期と振動数 =====
 [K+'Tdef']:(p)=>{
  const A=itAxes({w:900}),f=sinI(.3,2);
  let s=A.svg+A.plot(f,{from:0,to:.98,color:IC,w:4});
  const a=.075,b=.375;
  s+=fade(seg(p,.1,.3),dot(A.X(a),A.Y(2),9,C.hi)+dot(A.X(b),A.Y(2),9,C.hi)+brace(A.X(a),A.X(b),A.Y(2)-20,{dir:-1,text:'周期 T',size:30,color:TC}));
  s+=card(620,20,470,80,label('1往復の 時間　単位 s',855,72,{size:30,color:TC,anchor:'middle',weight:700}),seg(p,.4,.55),TC);
  return s;
 },
 [K+'fdef']:(p)=>{
  const A=itAxes({xmax:1.25,xticks:[1],w:900}),f=sinI(.25,2);
  let s=A.svg+rect(A.X(0),A.Y(2.6),A.X(1)-A.X(0),A.Y(-2.6)-A.Y(2.6),{fill:C.hi,fo:.06,stroke:C.hi,sw:2,rx:6})+label('1 秒',A.X(.5),A.Y(-2.6)+34,{size:26,color:TC,anchor:'middle',weight:700});
  s+=A.plot(f,{from:0,to:1.2,color:IC,w:4});
  for(let k=0;k<4;k++)s+=fade(seg(p,.15+.12*k,.25+.12*k),label(String(k+1),A.X(.0625+.25*k),A.Y(2)-22,{size:30,color:WC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),card(760,20,380,80,label('振動数 f ＝ 4 回/s',950,72,{size:32,color:WC,anchor:'middle',weight:700}),1,WC));
  return s;
 },
 [K+'f1T']:(p)=>{
  const y=200,x0=150,W=900,T=.25;
  let s=line(x0,y,x0+W,y,{color:C.dim,w:3})+label('0',x0,y+40,{size:24,color:TC,anchor:'middle'})+label('1 s',x0+W,y+40,{size:24,color:TC,anchor:'middle'});
  for(let k=0;k<4;k++){const g=seg(p,.05+.1*k,.15+.1*k);s+=fade(g,rect(x0+W*T*k+4,y-60,W*T-8,50,{fill:TC,fo:.2,stroke:TC,sw:2,rx:8})+label('T',x0+W*T*(k+.5),y-26,{size:28,color:TC,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.45,.6),label('1 秒の中に T が 1/T 個',600,300,{size:30,color:C.ink,anchor:'middle'}));
  const fm=`${tF}=\\dfrac{1}{${tT}}`;
  s+=fade(seg(p,.6,.75),tex(fm,600,420,{size:64,auto:false})+highlight(600-texWidth(fm,64,false)/2-30,325,texWidth(fm,64,false)+60,175,seg(p,.75,.9)));
  return s;
 },
 [K+'hz']:(p)=>{
  let s=tex(`${tF}=\\dfrac{1}{${tT}}`,300,200,{size:56,auto:false});
  s+=fade(seg(p,.1,.25),label('単位',650,150,{size:28,color:C.dim,anchor:'middle'})+tex('\\dfrac{1}{\\mathrm{s}}',650,230,{size:52,auto:false}));
  s+=fade(seg(p,.45,.6),label('＝',780,230,{size:44,color:C.ink,anchor:'middle'})+label('Hz',900,245,{size:56,color:WC,anchor:'middle',weight:700})+label('ヘルツ',900,310,{size:28,color:WC,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),label('1秒あたりの 回数',600,440,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=card(250,100,700,300,label('東日本の コンセント',600,165,{size:30,color:C.dim,anchor:'middle'})
   +label('f ＝ 50 Hz',600,245,{size:44,color:WC,anchor:'middle',weight:700})
   +label('1秒に 50往復　→　T ＝ ？ s',600,335,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'strip']:(p)=>{
  const x0=100,W=1000,y=170,amp=50;
  let s=line(x0,y,x0+W,y,{color:C.faint,w:2})+label('0',x0,y+amp+40,{size:24,color:TC,anchor:'middle'})+label('1 s',x0+W,y+amp+40,{size:24,color:TC,anchor:'middle'});
  s+=rect(x0,y-amp-10,W,2*amp+20,{fill:C.hi,fo:.04,stroke:C.hi,sw:2,rx:6});
  s+=draw(Array.from({length:2001},(_,i)=>[x0+W*i/2000,y-amp*Math.sin(TAU*50*i/2000)]),seg(p,.02,.4),{color:IC,w:2});
  s+=fade(seg(p,.35,.45),label('山と谷の組が 50 個',600,y-amp-26,{size:28,color:C.ink,anchor:'middle'}));
  // zoom into one cycle
  const zx=x0+W*10/50,zw=W/50,gz=seg(p,.5,.65);
  s+=fade(gz,rect(zx,y-amp-6,zw,2*amp+12,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:2})+line(zx,y+amp+6,300,330,{color:C.hi,w:2,dash:'5 5'})+line(zx+zw,y+amp+6,660,330,{color:C.hi,w:2,dash:'5 5'}));
  s+=fade(gz,rect(300,330,360,150,{fill:'#131f38',fo:.96,stroke:C.hi,sw:2,rx:10})+draw(Array.from({length:81},(_,i)=>[320+320*i/80,400-50*Math.sin(TAU*i/80)]),1,{color:IC,w:4}));
  s+=fade(seg(p,.7,.85),label('1個の幅 ＝ 1 ÷ 50 ＝ 0.02 s',700,420,{size:30,color:TC,weight:700}));
  return s;
 },
 [K+'calc']:(p)=>{
  const f1=`${tT}=\\dfrac{1}{${tF}}=\\dfrac{1}{50\\,\\mathrm{Hz}}=0.02\\,\\mathrm{s}`;
  let s=tex(f1,600,150,{size:54,auto:false})+highlight(600-texWidth(f1,54,false)/2-24,62,texWidth(f1,54,false)+48,165,seg(p,.2,.35));
  s+=fade(seg(p,.45,.6),label('逆に確かめる',600,300,{size:28,color:C.dim,anchor:'middle'})+tex('0.02\\,\\mathrm{s}\\times 50=1\\,\\mathrm{s}',600,390,{size:50,auto:false})+ok(900,400));
  return s;
 },
 [K+'mistake']:(p)=>{
  let s=card(120,70,450,200,label('f ＝ 50 Hz',345,130,{size:34,color:WC,anchor:'middle',weight:700})+label('1秒あたりの 回数',345,190,{size:28,color:C.ink,anchor:'middle'})+label('単位 1/s',345,240,{size:26,color:C.dim,anchor:'middle'}),1,WC);
  s+=card(630,70,450,200,label('T ＝ 0.02 s',855,130,{size:34,color:TC,anchor:'middle',weight:700})+label('1回あたりの 時間',855,190,{size:28,color:C.ink,anchor:'middle'})+label('単位 s',855,240,{size:26,color:C.dim,anchor:'middle'}),1,TC);
  s+=fade(seg(p,.05,.2),ng(360,360)+label('T ＝ 50 s',405,362,{size:32,color:C.a,weight:700})+label('取り違え',405,410,{size:26,color:C.a}));
  s+=fade(seg(p,.6,.75),label('T と f は 逆数',860,380,{size:34,color:C.hi,anchor:'middle',weight:700})+tex(`${tT}=\\dfrac{1}{${tF}}`,860,460,{size:40,auto:false}));
  return s;
 },
 [K+'q60']:(p)=>{
  let s=card(250,100,700,300,label('西日本の コンセント',600,165,{size:30,color:C.dim,anchor:'middle'})
   +label('f ＝ 60 Hz',600,245,{size:44,color:WC,anchor:'middle',weight:700})
   +label('T ＝ ？ s',600,335,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'a60']:(p)=>{
  let s=tex(`${tT}=\\dfrac{1}{60\\,\\mathrm{Hz}}\\approx 0.017\\,\\mathrm{s}`,600,120,{size:52,auto:false});
  const x0=260,sc=30000;
  s+=fade(seg(p,.3,.45),label('50 Hz',x0-20,280,{size:28,color:WC,anchor:'end'})+rect(x0,255,.02*sc,40,{fill:TC,fo:.3,stroke:TC,rx:6})+label('0.02 s',x0+.02*sc+16,284,{size:28,color:TC}));
  s+=fade(seg(p,.4,.55),label('60 Hz',x0-20,370,{size:28,color:WC,anchor:'end'})+rect(x0,345,(1/60)*sc,40,{fill:TC,fo:.3,stroke:TC,rx:6})+label('0.017 s',x0+sc/60+16,374,{size:28,color:TC}));
  s+=fade(seg(p,.65,.8),label('振動数が 大きいほど 周期は 短い',600,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'omega']:(p)=>{
  const cx=230,cy=270,R=150,u=TAU*seg(p,.05,.45);
  let s=ring(cx,cy,R,{color:C.dim,w:3})+line(cx,cy,cx+R+24,cy,{color:C.faint,w:2});
  if(u>.02)s+=draw(Array.from({length:121},(_,i)=>P(cx,cy,R,u*i/120)),1,{color:PH,w:6});
  const [px,py]=P(cx,cy,R,u);s+=line(cx,cy,px,py,{color:C.ink,w:3})+dot(px,py,11,C.hi);
  s+=fade(seg(p,.4,.5),label('1往復 ＝ 2π',cx,cy+R+50,{size:30,color:PH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.62),label('1秒に f 往復',800,130,{size:30,color:WC,anchor:'middle'}));
  const fm=`${tW}=${cs(PH,'2\\pi')}${tF}`;
  s+=fade(seg(p,.62,.75),tex(fm,800,270,{size:64,auto:false})+highlight(800-texWidth(fm,64,false)/2-30,200,texWidth(fm,64,false)+60,130,seg(p,.75,.9)));
  return s;
 },
 [K+'omega50']:(p)=>{
  let s=tex(`${tW}=${cs(PH,'2\\pi')}${tF}`,600,90,{size:48,auto:false});
  s+=fade(seg(p,.05,.2),tex(`=2\\pi\\times 50\\,\\mathrm{Hz}=100\\pi\\,\\mathrm{rad/s}`,600,220,{size:50,auto:false}));
  s+=fade(seg(p,.45,.6),tex('\\approx 314\\,\\mathrm{rad/s}',600,360,{size:56,auto:false,color:WC}));
  return s;
 },
 [K+'omega2']:(p)=>{
  const fm=`${tT}=\\dfrac{2\\pi}{${tW}}=\\dfrac{2\\pi}{100\\pi}=0.02\\,\\mathrm{s}`;
  let s=tex(fm,600,110,{size:52,auto:false})+fade(seg(p,.15,.3),ok(1000,120));
  s+=card(110,240,460,220,label('f ＝ 50 Hz',340,300,{size:34,color:WC,anchor:'middle',weight:700})+label('1秒に 50 回',340,370,{size:30,color:C.ink,anchor:'middle'})+label('回数で 測る',340,425,{size:26,color:C.dim,anchor:'middle'}),seg(p,.4,.55),WC);
  s+=card(630,240,460,220,label('ω ≈ 314 rad/s',860,300,{size:34,color:WC,anchor:'middle',weight:700})+label('1秒に 100π の角度',860,370,{size:30,color:C.ink,anchor:'middle'})+label('角度で 測る',860,425,{size:26,color:C.dim,anchor:'middle'}),seg(p,.55,.7),WC);
  return s;
 },

 // ===== S5 振幅と各時刻の値 =====
 [K+'ex']:(p)=>{
  const A=ex50(seg(p,0,.15));
  let s=A.svg+A.plot(I50,{from:0,to:.044,p:seg(p,.1,.6),color:IC,w:5});
  s+=card(900,110,270,180,label('振幅 2 A',1035,175,{size:34,color:IC,anchor:'middle',weight:700})+label('50 Hz',1035,240,{size:34,color:WC,anchor:'middle',weight:700}),seg(p,.2,.35));
  return s;
 },
 [K+'ampdef']:(p)=>{
  const A=ex50();
  let s=A.svg+A.plot(I50,{from:0,to:.044,color:IC,w:5});
  s+=fade(seg(p,.05,.2),line(A.X(0),A.Y(2),A.X(.046),A.Y(2),{color:C.hi,w:2,dash:'8 6'})+line(A.X(0),A.Y(-2),A.X(.046),A.Y(-2),{color:C.hi,w:2,dash:'8 6'}));
  s+=fade(seg(p,.2,.35),arrow(A.X(.025),A.Y(0),A.X(.025),A.Y(2),{color:C.hi,w:5,head:16}));
  s+=card(900,110,270,200,label('振幅 I₀',1035,170,{size:32,color:C.hi,anchor:'middle',weight:700})+label('最大の大きさ',1035,225,{size:26,color:C.ink,anchor:'middle'})+label('＝ 2 A',1035,285,{size:34,color:IC,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'t005']:(p)=>{
  const A=ex50();const t=.005*seg(p,.3,.75);
  let s=A.svg+A.plot(I50,{from:0,to:.044,color:IC,w:4})+marker(A,t);
  s+=fade(seg(p,.02,.15),label('t ＝ 0：I ＝ 0',925,150,{size:28,color:C.ink}));
  s+=fade(seg(p,.7,.85),label('t ＝ 0.005 s',925,240,{size:28,color:TC,weight:700})+label('（1/4 周期）',925,280,{size:24,color:C.dim})+label('I ＝ ＋2 A',925,330,{size:30,color:IC,weight:700})+label('右向きに 最大',925,370,{size:26,color:IC}));
  return s;
 },
 [K+'t015']:(p)=>{
  const A=ex50();const t=.005+.005*seg(p,.02,.25)+.005*seg(p,.45,.7);
  let s=A.svg+A.plot(I50,{from:0,to:.044,color:IC,w:4})+marker(A,t);
  s+=fade(seg(p,.2,.32),label('t ＝ 0.01 s：I ＝ 0',925,150,{size:26,color:C.ink})+label('（半周期）',925,188,{size:24,color:C.dim}));
  s+=fade(seg(p,.7,.85),label('t ＝ 0.015 s',925,260,{size:28,color:TC,weight:700})+label('（3/4 周期）',925,300,{size:24,color:C.dim})+label('I ＝ −2 A',925,350,{size:30,color:C.a,weight:700})+label('左向きに 最大',925,390,{size:26,color:C.a}));
  return s;
 },
 [K+'ampval']:(p)=>{
  const A=ex50();const t=.044*p;
  let s=A.svg+A.plot(I50,{from:0,to:.044,color:IC,w:4})+marker(A,t);
  s+=line(A.X(0),A.Y(2),A.X(.046),A.Y(2),{color:C.hi,w:2,dash:'8 6'})+line(A.X(0),A.Y(-2),A.X(.046),A.Y(-2),{color:C.hi,w:2,dash:'8 6'});
  s+=card(900,70,270,120,label('振幅',1035,118,{size:26,color:C.hi,anchor:'middle'})+label('2 A　一つ',1035,168,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  const v=I50(t);
  s+=card(900,220,270,190,label('各時刻の値',1035,265,{size:26,color:C.dim,anchor:'middle'})+label(`${v>=0?'＋':'−'}${Math.abs(v).toFixed(1)} A`,1035,325,{size:36,color:IC,anchor:'middle',weight:700})+label('変わり続ける',1035,385,{size:26,color:C.ink,anchor:'middle'}),seg(p,.3,.45));
  return s;
 },
 [K+'q002']:(p)=>{
  const A=ex50();
  let s=A.svg+A.plot(I50,{from:0,to:.044,color:IC,w:4});
  s+=fade(seg(p,.05,.2),line(A.X(.02),A.Y(2.6),A.X(.02),A.Y(-2.6),{color:TC,w:3,dash:'6 6'}));
  s+=card(900,150,270,180,label('t ＝ 0.02 s',1035,210,{size:30,color:TC,anchor:'middle',weight:700})+label('I ＝ ？',1035,280,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'a002']:(p)=>{
  const A=ex50();
  let s=A.svg+A.plot(I50,{from:0,to:.044,color:IC,w:4});
  s+=dot(A.X(0),A.Y(0),10,C.hi)+fade(seg(p,.05,.2),dot(A.X(.02),A.Y(0),11,C.hi));
  s+=fade(seg(p,.3,.45),arrow(A.X(.02),A.Y(0),A.X(.0228),A.Y(1.4),{color:IC,w:5,head:16}));
  s+=card(900,100,270,300,label('I ＝ 0',1035,160,{size:34,color:IC,anchor:'middle',weight:700})+label('1周期後は',1035,220,{size:26,color:TC,anchor:'middle'})+label('t ＝ 0 と 同じ状態',1035,265,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.7),label('これから',1035,325,{size:24,color:IC,anchor:'middle',weight:700})+label('右向きに 増える',1035,365,{size:24,color:IC,anchor:'middle',weight:700})),seg(p,.2,.35),C.hi);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'summary']:(p)=>{
  const rows=[['周期 T','1往復の 時間 [s]',TC],['振動数 f ＝ 1/T','1秒の 往復の回数 [Hz]',WC],['振幅','最大の 大きさ（各時刻の値とは別）',C.hi]];
  let s='';rows.forEach(([a,b,c],i)=>{s+=card(110,50+i*145,980,120,label(a,150,122+i*145,{size:34,color:c,weight:700})+label(b,560,122+i*145,{size:30,color:C.ink}),seg(p,.05+.15*i,.18+.15*i),c);});
  return s;
 },
 [K+'volt']:(p)=>{
  const A=itAxes({ylabel:'',w:900}),T=.25;
  let s=A.svg+A.plot(sinI(T,2),{from:0,to:.98,p:seg(p,.05,.4),color:IC,w:5})+A.plot(sinI(T,1.4),{from:0,to:.98,p:seg(p,.25,.6),color:VC,w:5});
  s+=fade(seg(p,.1,.25),label('電流 I',A.X(1)+20,A.Y(2)+8,{size:28,color:IC,weight:700}));
  s+=fade(seg(p,.4,.55),label('電圧 V',A.X(1)+20,A.Y(1.2)+40,{size:28,color:VC,weight:700}));
  s+=fade(seg(p,.6,.75),card(760,20,360,70,label('どちらも 50 Hz',940,66,{size:30,color:WC,anchor:'middle',weight:700}),1,WC));
  return s;
 },
 [K+'next']:(p)=>{
  const A=itAxes({ylabel:'',w:900}),T=.4;
  let s=A.svg+A.plot(sinI(T,2),{from:0,to:.98,color:IC,w:5})+A.plot(sinI(T,1.4,Math.PI/2),{from:0,to:.98,color:VC,w:5});
  const tv=T,ti=T*1.25;
  s+=fade(seg(p,.1,.25),dot(A.X(tv),A.Y(1.4),10,VC)+dot(A.X(ti),A.Y(2),10,IC)+line(A.X(tv),A.Y(1.4),A.X(tv),A.Y(-2.6),{color:VC,w:2,dash:'6 6'})+line(A.X(ti),A.Y(2),A.X(ti),A.Y(-2.6),{color:IC,w:2,dash:'6 6'}));
  s+=fade(seg(p,.3,.45),line(A.X(tv),A.Y(-2.3),A.X(ti),A.Y(-2.3),{color:PH,w:6})+label('ずれ ？',(A.X(tv)+A.X(ti))/2,A.Y(-2.3)+36,{size:28,color:PH,anchor:'middle',weight:700}));
  s+=card(700,10,440,80,label('どう 数える？',920,64,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
};
