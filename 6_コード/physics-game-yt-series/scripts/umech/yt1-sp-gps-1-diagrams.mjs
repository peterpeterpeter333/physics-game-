// 特別編「GPS と相対性理論」パート1/4 (ys-sp-gps-1) — 図。Stage 1200×515.
// 色：c・電波 紫（C.v）、時間 t・時計のずれ b 金（C.t）、x・y・z 水色（C.x）、差 黄（C.hi）。
// 衛星の時計が「進む」＝赤の上向き矢印と「＋」、「遅れる」＝青 #6f9dff の下向き矢印と「−」。
// 地球は青い円、衛星は金色の本体に青い太陽電池板、時計はアナログの顔に「地上」「衛星」の札（他パートとそろえる）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,clamp,mix,poly,scaleAt,brace} from './anim.mjs';

const K='sp-gps-1:';
const PI=Math.PI;
const SLOW='#6f9dff', FAST=C.a, HC=C.hi, CC=C.v, TC=C.t, XC=C.x, BAD=C.a, OK=C.F;
const EARTH='#2f6fd6', GOLD='#e3b341', PANEL='#3f78e0', RADIO=C.v;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const TX=(src,x,y,o={})=>tex(src,x,y,{size:46,auto:false,...o});
const U=s=>`\\,\\mathrm{${s}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
// 大学編と同じ小さな札（定義・原理・実験・近似）
function tag(s,x,y,{color=C.hi,g=1,size=24}={}){
 const w=[...s].length*size+30;
 return fade(g,rect(x-w/2,y-size*.85-8,w,size+18,{fill:color,fo:.14,stroke:color,sw:2,rx:16})+label(s,x,y+2,{size,color,anchor:'middle',weight:700}));
}
const sceneT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
const cueT=(p,ctx)=>ctx&&typeof ctx.t==='number'?ctx.t:p*8;
const cross=(x,y,r=22,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:BAD,w:6})+line(x-r,y+r,x+r,y-r,{color:BAD,w:6}));
const okMark=(x,y,g=1)=>fade(g,draw([[x-18,y],[x-4,y+14],[x+20,y-16]],1,{color:OK,w:6}));
function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const circPts=(cx,cy,r,a0=-PI/2,a1=3*PI/2,n=120)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
const clip=(id,x,y,w,h,inner)=>`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;

// ---------- common parts --------------------------------------------------------------------------
// Earth: a blue disc (only the top shows when it is large)
function earth(cx,cy,R,{g=1}={}){
 let s=`<defs><radialGradient id="gpsE" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#4f8ef0"/><stop offset=".7" stop-color="${EARTH}"/><stop offset="1" stop-color="#1d4594"/></radialGradient></defs>`;
 s+=ring(cx,cy,R+10,{color:'#7fb2ff',w:8})+`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#gpsE)"/>`;
 s+=ring(cx,cy,R+10,{color:'#9cc6ff',w:2});
 return fade(g,s);
}
// GPS satellite: gold body + blue solar panels
function sat(x,y,k=1,{g=1,glow=0}={}){
 const b=13*k,pw=34*k,ph=13*k;
 let s='';
 if(glow)s+=dot(x,y,30*k,GOLD,.18*glow);
 s+=line(x-b-pw-2,y,x+b+pw+2,y,{color:'#c9d3e6',w:2*k});
 for(const sgn of[-1,1]){const px=sgn<0?x-b-4*k-pw:x+b+4*k;
  s+=rect(px,y-ph/2,pw,ph,{fill:PANEL,fo:1,stroke:'#9cc0ff',sw:1.5,rx:2});
  for(let i=1;i<3;i++)s+=line(px+pw*i/3,y-ph/2,px+pw*i/3,y+ph/2,{color:'#9cc0ff',w:1});}
 s+=rect(x-b,y-b,2*b,2*b,{fill:GOLD,fo:1,stroke:'#fff0b8',sw:1.5,rx:3});
 s+=line(x,y+b,x,y+b+8*k,{color:'#c9d3e6',w:2*k})+dot(x,y+b+9*k,3*k,'#c9d3e6');
 return fade(g,s);
}
// analog clock with a name tag (地上 / 衛星 / スマホ)
function clock(x,y,R,{t=0,name='',g=1,col=C.ink,rate=1,off=0,tagCol=C.dim}={}){
 let s=dot(x,y,R+6,'#0e1830')+ring(x,y,R,{color:col,w:4,fill:'#1a2745'});
 for(let i=0;i<12;i++){const a=i*PI/6;s+=line(x+R*.82*Math.cos(a),y+R*.82*Math.sin(a),x+R*.95*Math.cos(a),y+R*.95*Math.sin(a),{color:C.ink,w:i%3?2:4});}
 const ts=t*rate+off,am=ts/60*2*PI-PI/2,ah=ts/720*2*PI-PI/2-.9,as=ts*2*PI/6-PI/2;
 s+=line(x,y,x+R*.5*Math.cos(ah),y+R*.5*Math.sin(ah),{color:C.ink,w:6});
 s+=line(x,y,x+R*.74*Math.cos(am),y+R*.74*Math.sin(am),{color:C.ink,w:4});
 s+=line(x,y,x+R*.86*Math.cos(as),y+R*.86*Math.sin(as),{color:TC,w:2.5})+dot(x,y,5,TC);
 if(name)s+=tag(name,x,y+R+38,{color:tagCol,size:24});
 return fade(g,s);
}
function phone(x,y,h=110,{g=1,dotOn=1}={}){
 const w=h*.52;
 let s=rect(x-w/2,y-h/2,w,h,{fill:'#20283a',fo:1,stroke:'#c9d3e6',sw:3,rx:h*.1});
 s+=rect(x-w/2+5,y-h/2+10,w-10,h-22,{fill:'#0f2244',fo:1,stroke:'#0f2244',sw:1,rx:3});
 if(dotOn)s+=dot(x,y,h*.07,'#4c8dff')+ring(x,y,h*.07+2,{color:'#fff',w:1.5});
 return fade(g,s);
}
// night city map (streets) inside a rectangle
function nightMap(x0,y0,w,h,{g=1,id='m'}={}){
 const R=rng(7);let s=rect(x0,y0,w,h,{fill:'#0d1730',fo:1,stroke:C.faint,sw:2,rx:14});
 let inner=`<path d="M${x0-20} ${y0+h*.72} C ${x0+w*.3} ${y0+h*.5}, ${x0+w*.55} ${y0+h*.95}, ${x0+w+20} ${y0+h*.6}" fill="none" stroke="#163a66" stroke-width="34"/>`;
 for(let X=x0+20;X<x0+w;X+=40+R()*50){const d=(R()-.5)*40;inner+=line(X,y0,X+d,y0+h,{color:'#26375a',w:R()<.2?7:3});}
 for(let Y=y0+15;Y<y0+h;Y+=35+R()*45){const d=(R()-.5)*30;inner+=line(x0,Y,x0+w,Y+d,{color:'#26375a',w:R()<.2?7:3});}
 inner+=line(x0,y0+h*.15,x0+w,y0+h*.9,{color:'#3b5079',w:9})+line(x0+w*.15,y0+h,x0+w*.7,y0,{color:'#3b5079',w:9});
 for(let i=0;i<60;i++)inner+=dot(x0+R()*w,y0+R()*h,1.6+R()*1.6,'#ffd27a',.35+R()*.4);
 s+=clip('gpsMap'+id,x0,y0,w,h,inner);
 return fade(g,s);
}
function here(x,y,t,{g=1,acc=16}={}){
 const q=(t%1.6)/1.6;
 let s=dot(x,y,acc,'#4c8dff',.18)+ring(x,y,12+q*40,{color:'#4c8dff',w:3*(1-q)+.5});
 s+=dot(x,y,12,'#4c8dff')+ring(x,y,13,{color:'#fff',w:3});
 return fade(g,s);
}
// space view: big Earth at the bottom, phone on top of it, satellites above
const SATS=[[220,95],[600,60],[980,105]];
function space(p,t,{g=1,lines=1,pulses=1,sats=SATS,phoneY=318}={}){
 let s=earth(600,1250,900);
 s+=phone(600,phoneY,70);
 sats.forEach(([x,y],i)=>{
  s+=fade(lines,line(x,y+16,600,phoneY-38,{color:RADIO,w:2.5,dash:'2 8'}));
  if(pulses)for(let k=0;k<2;k++){const u=((t*.45+i*.31+k*.5)%1);s+=fade(lines*Math.sin(PI*u),dot(mix(x,600,u),mix(y+16,phoneY-38,u),6,RADIO));}
  s+=sat(x,y,1.1);
 });
 return fade(g,s);
}
// lighthouses for trilateration
const LH={A:[330,250,C.x],B:[900,250,C.E],C:[760,470,C.F]};
const P0=[620,350], Q0=[620,150];
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function lighthouse(x,y,name,col,{g=1,t=0}={}){
 let s=poly([[x-11,y+18],[x+11,y+18],[x+7,y-22],[x-7,y-22]],{fill:'#e8edf6',fo:1,stroke:'#e8edf6'});
 s+=rect(x-9,y-6,18,8,{fill:'#d65a5a',fo:1,stroke:'#d65a5a',rx:1});
 s+=rect(x-9,y-32,18,11,{fill:'#ffd96a',fo:1,stroke:'#ffd96a',rx:2})+dot(x,y-27,22,'#ffd96a',.15+.1*Math.sin(t*3));
 s+=label(name,x-30,y-34,{size:30,color:col,anchor:'middle',weight:700});
 return fade(g,s);
}
function sea({g=1}={}){
 let s=rect(40,10,1120,495,{fill:'#0c1b33',fo:1,stroke:C.faint,sw:2,rx:14});
 for(let y=60;y<500;y+=55)s+=line(50,y,1150,y,{color:'#13284a',w:1.5});
 for(let x=90;x<1160;x+=55)s+=line(x,15,x,500,{color:'#13284a',w:1.5});
 return fade(g,s);
}
function circleAB({a=1,b=1,c=1,t=0}={}){
 let s='';
 const one=(n,u)=>{const [x,y,col]=LH[n];const r=dist([x,y],P0);return clip('gpsSea'+n,40,10,1120,495,draw(circPts(x,y,r),u,{color:col,w:4})+fade(u,`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" fill-opacity=".05"/>`));};
 if(a>0)s+=one('A',a);if(b>0)s+=one('B',b);if(c>0)s+=one('C',c);
 return s;
}
function lighthouses(t,{g=1,show='ABC'}={}){let s='';for(const n of show){const [x,y,col]=LH[n];s+=lighthouse(x,y,n,col,{t});}return fade(g,s);}
const glowPt=(x,y,t,col=HC,g=1)=>fade(g,dot(x,y,16+4*Math.sin(t*5),col,.3)+dot(x,y,9,col));

// sphere picture (side view): sats on one line y=250, P on the Earth, Q its mirror image in space
const SPH=[[280,250,C.x],[640,250,C.E],[960,250,C.F]], PS=[600,450], QS=[600,50];
// 0/1 code pattern
const BITS=[1,0,1,1,0,0,1,0,1,1,1,0,0,1,0,1,0,0,1,1];
const CW=40, TAU=6;
function band(x0,y,{g=1,hl=0,label:lab='',labCol=C.ink,dim=0}={}){
 let s='';
 BITS.forEach((b,i)=>{const x=x0+i*CW;s+=rect(x,y,CW-3,46,{fill:b?'#d8e3f5':'#1a2745',fo:dim?0.5:1,stroke:hl?HC:'#5a6b8c',sw:hl?3:1.5,rx:4})+label(String(b),x+CW/2-1.5,y+32,{size:24,color:b?'#0b1122':C.dim,anchor:'middle',weight:700});});
 if(lab)s+=label(lab,x0,y-14,{size:24,color:labCol,weight:700});
 return fade(g,s);
}
function matchScore(off){ // replica shifted by off cells relative to the received pattern (fractional ok)
 const f=Math.floor(off),w=off-f;let m=0;
 const sc=k=>{let a=0,n=0;BITS.forEach((b,i)=>{const j=i+k;if(j>=0&&j<BITS.length){n++;a+=(b===BITS[j])?1:-1;}});return n?a/BITS.length:0;};
 m=(1-w)*sc(f)+w*sc(f+1);return clamp(m,0,1);
}
// ruler that zooms: span metres across 900 px
function zoomRuler(span,{g=1,y=300,x0=150,W=900}={}){
 const steps=[1,2,5];let tick=1e-3;
 outer:for(let e=-3;e<4;e++)for(const m of steps){const v=m*10**e;if(span/v<=6){tick=v;break outer;}}
 let s=line(x0,y,x0+W,y,{color:C.ink,w:3});
 for(let v=0;v<=span*1.0001;v+=tick){const x=x0+W*v/span;s+=line(x,y-12,x,y+12,{color:C.ink,w:2.5});
  const txt=v>=1?`${+v.toFixed(2)} m`:`${+(v*100).toFixed(1)} cm`;s+=label(v===0?'0':txt,x,y+44,{size:24,color:C.dim,anchor:'middle'});}
 return fade(g,s);
}
const titleCard=(g=1)=>card(160,150,880,210,label('あなたのスマホは、',600,230,{size:40,color:C.ink,anchor:'middle',weight:700})+label('毎日 アインシュタインを 使っている',600,305,{size:44,color:HC,anchor:'middle',weight:700}),g,HC);
function twoClocks(t,{g=1,gap=0,day=0}={}){
 let s=clock(330,215,125,{t,name:'地上',g});
 s+=clock(870,215,125,{t,name:'衛星',g})+sat(870,52,.9,{g});
 return s;
}
const fourSats=[[170,110],[450,60],[760,70],[1040,120]], SATCOL=['#ff9ce6',C.E,C.F,C.v];

export const spGps1Diagrams={
 // ================= S1 スマホは何も送っていない =================
 [K+'a1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=nightMap(80,25,1040,470,{id:'a'});
  s+=here(600,265,t,{acc:22});
  s+=card(800,60,300,100,label('数メートルの 精度',950,122,{size:30,color:HC,anchor:'middle',weight:700}),seg(p,.55,.7),HC);
  s+=fade(seg(p,.55,.7),line(800,140,622,250,{color:HC,w:2,dash:'6 6'}));
  return s;
 },
 [K+'a2']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=seg(p,0,.3);
  let s='';
  s+=fade(1-u,scaleAt(600,265,1-.9*u,nightMap(80,25,1040,470,{id:'b'})+here(600,265,t)));
  s+=fade(u,space(p,t,{lines:seg(p,.3,.45)}));
  s+=fade(seg(p,.45,.6),arrow(690,330,690,200,{color:C.dim,w:4,head:16})+cross(690,265,22)+label('送らない',720,250,{size:26,color:BAD,weight:700}));
  s+=fade(seg(p,.7,.85),label('届く 電波を 聞くだけ',300,265,{size:28,color:RADIO,anchor:'middle',weight:700}));
  return s;
 },
 [K+'a3']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  return fade(.35,space(p,t))+card(220,150,760,170,label('聞くだけで、',600,220,{size:34,color:C.ink,anchor:'middle',weight:700})+label('なぜ 場所が 分かる？',600,285,{size:44,color:HC,anchor:'middle',weight:700}),seg(p,.05,.2),HC);
 },
 [K+'a4']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=clock(260,230,150,{t:t*6});
  s+=fade(seg(p,.05,.2),label('測っているのは',700,90,{size:30,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.1,.25),label('場所',560,170,{size:44,color:C.ink,anchor:'middle',weight:700}))+cross(560,155,34,seg(p,.25,.35));
  s+=fade(seg(p,.3,.45),label('→',680,170,{size:44,color:C.dim,anchor:'middle'})+label('時間',820,170,{size:56,color:TC,anchor:'middle',weight:700}));
  s+=card(480,250,640,180,label('10億分の1 秒',800,315,{size:34,color:TC,anchor:'middle',weight:700})+TX(`1${U('ns')}=10^{-9}${U('s')}`,800,390,{size:44}),seg(p,.6,.75),TC);
  return s;
 },
 [K+'a5']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.45,clock(260,230,150,{t:t*6}));
  const g=seg(p,.15,.35);
  s+=fade(g,poly([[800,90],[960,370],[640,370]],{fill:HC,fo:.15,stroke:HC,sw:5})+label('！',800,330,{size:110,color:HC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('とんでもない 落とし穴',800,440,{size:36,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'a6']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=twoClocks(t);
  const u=seg(p,.35,.85);
  s+=fade(seg(p,.3,.4),arrow(1050,250,1050,120,{color:FAST,w:7,head:22})+label('＋',1090,175,{size:44,color:FAST,anchor:'middle',weight:700}));
  s+=card(400,420,400,80,label(`1日 で ＋${Math.round(38*u)} μs`,600,472,{size:34,color:HC,anchor:'middle',weight:700}),seg(p,.3,.4),HC);
  s+=fade(seg(p,.3,.4),rect(410,505,380*u,6,{fill:HC,fo:.9,stroke:HC,rx:3}));
  s+=fade(seg(p,.8,.92),label('速く 進む',1050,90,{size:28,color:FAST,anchor:'middle',weight:700}));
  return s;
 },
 [K+'a7']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=twoClocks(t);
  s+=arrow(1050,250,1050,120,{color:FAST,w:7,head:22})+label('＋',1090,175,{size:44,color:FAST,anchor:'middle',weight:700});
  s+=card(60,400,400,100,label('故障',190,462,{size:32,color:C.ink,anchor:'middle',weight:700})+cross(190,450,24)+label('では ない',340,462,{size:30,color:C.ink,anchor:'middle'}),seg(p,.02,.15),C.faint);
  s+=card(500,400,640,100,label('時間の 進み方 そのものが 地上と 違う',820,462,{size:30,color:HC,anchor:'middle',weight:700}),seg(p,.4,.55),HC);
  return s;
 },
 [K+'a8']:(p,ctx)=>{
  const t=sceneT(p,ctx),days=3*seg(p,.15,.9),X=d=>300+250*d;
  let s=nightMap(80,25,1040,470,{id:'c'});
  s+=tag('もし 直さなければ',260,80,{color:BAD,size:26});
  for(let d=1;d<=3;d++)s+=fade(clamp((days-d)*4+1),line(X(d),330,X(d),360,{color:HC,w:3})+label(`${d}日 ${11*d} km`,X(d),395,{size:24,color:HC,anchor:'middle',weight:700}));
  s+=line(X(0),345,X(days),345,{color:HC,w:4,dash:'10 6'});
  s+=dot(X(0),265,10,'#4c8dff',.35)+label('本当の 場所',X(0),225,{size:24,color:C.dim,anchor:'middle'});
  s+=here(X(days),265,t);
  s+=card(700,430,380,56,label(`${days.toFixed(1)} 日 → 約 ${Math.round(11*days)} km`,890,468,{size:28,color:HC,anchor:'middle',weight:700}),1,HC);
  return s;
 },
 [K+'a9']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=sat(240,250,2.4,{glow:.6+.4*Math.sin(t*2)});
  s+=card(450,80,660,370,
    label('1977年 試験衛星',780,150,{size:40,color:C.ink,anchor:'middle',weight:700})
   +label('予言：衛星の 時計は 速く 進む',780,230,{size:28,color:C.ink,anchor:'middle'})
   +label('結果',600,340,{size:32,color:C.dim,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),rect(680,280,260,100,{fill:HC,fo:.08,stroke:HC,sw:3,rx:10})+label('？',810,358,{size:70,color:HC,anchor:'middle',weight:700})),seg(p,.02,.15),C.faint);
  s+=fade(seg(p,.6,.75),label('後半で 明かす',780,430,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'a10']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.6,earth(600,1250,900));
  const a=t*.35;s+=sat(600+520*Math.cos(a),70+30*Math.sin(a),.9)+sat(600+520*Math.cos(a+PI),70+30*Math.sin(a+PI),.9);
  s+=titleCard(seg(p,.02,.18));
  return s;
 },
 // ================= S2 距離で場所を決める =================
 [K+'b11']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=sea()+lighthouses(t,{g:seg(p,.05,.3)});
  s+=fade(seg(p,.3,.45),label('？',P0[0],P0[1]+14,{size:50,color:C.dim,anchor:'middle',weight:700}));
  s+=card(380,30,440,70,label('場所を 知る 素朴な 方法',600,76,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.3,.45),C.faint);
  return s;
 },
 [K+'b12']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=seg(p,.05,.4);
  let s=sea()+circleAB({a:u,b:0,c:0})+lighthouses(t);
  const [ax,ay]=LH.A,r=dist(LH.A,P0),ar=-2.5;
  s+=fade(seg(p,.2,.35),line(ax,ay,ax+r*Math.cos(ar),ay+r*Math.sin(ar),{color:C.x,w:3,dash:'8 6'})+label('3 km',ax+r*.5*Math.cos(ar)-40,ay+r*.5*Math.sin(ar)-10,{size:28,color:C.x,weight:700}));
  // "somewhere on the circle": a marker slides around it
  const b=seg(p,.5,.65);const am=-.3+t*.6;
  s+=fade(b,clip('gpsW1',40,10,1120,495,dot(ax+r*Math.cos(am),ay+r*Math.sin(am),11,C.ink)+ring(ax+r*Math.cos(am),ay+r*Math.sin(am),18,{color:C.ink,w:2})));
  s+=fade(b,label('この 円の 上の どこか',1000,400,{size:28,color:C.x,anchor:'middle',weight:700}));
  return s;
 },
 [K+'b13']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=seg(p,.35,.65);
  let s=sea()+circleAB({a:1,b:u,c:0})+lighthouses(t);
  const g=seg(p,.65,.8);
  s+=glowPt(...P0,t,HC,g)+glowPt(...Q0,t,HC,g);
  s+=fade(g,label('交わる 点は 2つ',430,470,{size:28,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'b14']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=seg(p,.1,.4);
  let s=sea()+circleAB({a:1,b:1,c:u})+lighthouses(t);
  s+=glowPt(...Q0,t,HC,1-seg(p,.4,.55))+fade(seg(p,.4,.55)*(1-seg(p,.55,.6)),dot(...Q0,7,C.dim));
  s+=glowPt(...P0,t,HC,1)+fade(seg(p,.45,.6),ring(P0[0],P0[1],28,{color:HC,w:4})+label('ここ',P0[0]+40,P0[1]-28,{size:34,color:HC,weight:700}));
  return s;
 },
 [K+'b15']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.5,sea()+circleAB({})) +lighthouses(t);
  for(const n of 'ABC'){const [x,y,col]=LH[n];s+=fade(seg(p,.02,.2),line(x,y,P0[0],P0[1],{color:col,w:5}));}
  s+=glowPt(...P0,t);
  s+=card(60,30,320,110,label('角度',150,97,{size:32,color:C.ink,anchor:'middle',weight:700})+cross(150,86,26,seg(p,.2,.3))+label('使わない',290,97,{size:26,color:C.dim,anchor:'middle'}),seg(p,.1,.25),C.faint);
  s+=card(790,30,360,110,label('三辺測量',970,100,{size:40,color:HC,anchor:'middle',weight:700}),seg(p,.55,.7),HC);
  s+=tag('距離 だけ',970,170,{color:HC,g:seg(p,.55,.7)});
  return s;
 },
 [K+'b16']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=earth(600,1450,1000);
  SPH.forEach(([x,y,col],i)=>{const r=dist([x,y],PS),g=seg(p,.12+i*.08,.24+i*.08);
   s+=fade(g,`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" fill-opacity=".09" stroke="${col}" stroke-width="3"/>`);});
  SPH.forEach(([x,y])=>{s+=sat(x,y,.9);});
  s+=fade(seg(p,.05,.15),label('横から 見た 図',150,490,{size:24,color:C.dim,anchor:'middle'}));
  const gp=seg(p,.45,.55);
  s+=glowPt(...PS,t,HC,gp)+glowPt(...QS,t,HC,gp);
  s+=fade(seg(p,.6,.72),cross(QS[0],QS[1],24)+rect(QS[0]+35,QS[1]-22,170,42,{fill:C.bg,fo:.85,stroke:'none',rx:8})+label('宇宙の 遠く',QS[0]+45,QS[1]+10,{size:26,color:BAD,weight:700}));
  s+=fade(seg(p,.75,.88),ring(PS[0],PS[1],26,{color:HC,w:4})+rect(PS[0]-185,PS[1]-62,150,44,{fill:C.bg,fo:.85,stroke:'none',rx:8})+label('地表の 点',PS[0]-40,PS[1]-30,{anchor:'end',size:30,color:HC,weight:700}));
  return s;
 },
 // ================= S3 距離は、時間で測る =================
 [K+'c17']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=earth(600,1500,1100)+phone(600,360,70)+sat(600,70,1.4);
  s+=fade(seg(p,.05,.2),line(760,90,760,360,{color:C.dim,w:2})+line(745,90,775,90,{color:C.dim,w:2})+line(745,360,775,360,{color:C.dim,w:2})+label('2万 km',785,235,{size:32,color:C.ink,weight:700}));
  const L=110*seg(p,.45,.7);
  s+=fade(seg(p,.4,.5),rect(560,312-L,14,L,{fill:'#f2c94c',fo:1,stroke:'#f2c94c',rx:2})+rect(545,312,44,30,{fill:'#f2c94c',fo:1,stroke:'#b8902a',rx:5}));
  s+=fade(seg(p,.72,.82),cross(567,200-0,26)+label('メジャーは 伸ばせない',380,190,{size:28,color:BAD,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c18']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=earth(600,1500,1100)+phone(600,360,70);
  let w='';for(let k=0;k<5;k++){const r=((t*90+k*70)%350);if(r>8)w+=fade(1-r/360,`<path d="M${600-r} ${70} A${r} ${r} 0 0 0 ${600+r} 70" fill="none" stroke="${RADIO}" stroke-width="4"/>`);}
  s+=fade(seg(p,.05,.2),clip('gpsC18',0,70,1200,330,w));
  s+=sat(600,70,1.4);
  s+=card(800,150,350,150,label('電波 ＝ 光の 仲間',975,205,{size:28,color:RADIO,anchor:'middle',weight:700})+label('秒速 約30万 km',975,265,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6),RADIO);
  s+=card(50,150,320,110,label('かかった 時間',210,218,{size:32,color:TC,anchor:'middle',weight:700}),seg(p,.1,.25),TC);
  return s;
 },
 [K+'c19']:(p,ctx)=>{
  const u=seg(p,.45,.85);
  let s=card(180,30,840,120,label('距離',330,108,{size:44,color:C.ink,anchor:'middle',weight:700})+label('＝',420,108,{size:44,color:C.ink,anchor:'middle'})+TX(cs(CC,'c'),500,104,{size:56})+label('×',580,108,{size:44,color:C.ink,anchor:'middle'})+label('かかった 時間',760,108,{size:44,color:TC,anchor:'middle',weight:700}),seg(p,.02,.15),HC);
  s+=fade(seg(p,.02,.15),label('光の 速さ',500,180,{size:24,color:CC,anchor:'middle'}));
  // pulse travelling 20 000 km with a stopwatch
  s+=fade(seg(p,.4,.5),sat(150,300,1)+phone(150,470,50,{})+line(150,320,150,440,{color:C.faint,w:2,dash:'4 6'})+dot(150,mix(320,440,u),8,RADIO));
  s+=card(260,240,880,140,TX(`\\dfrac{2.0\\times10^{4}${U('km')}}{3.0\\times10^{5}${U('km/s')}}\\approx${cs(TC,'0.07'+U('s'))}`,700,322,{size:46}),seg(p,.4,.5),C.faint);
  s+=fade(seg(p,.4,.5),label(`経過 ${(0.067*u).toFixed(3)} 秒`,700,440,{size:30,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c20']:(p,ctx)=>{
  const u=seg(p,.45,.85),X=v=>150+900*v/300;
  let s=card(240,30,720,100,label('100万分の1 秒 ＝',470,95,{size:32,color:TC,anchor:'end',weight:700})+TX(`${cs(TC,'1'+U('\\mu s'))}`,560,90,{size:44}),seg(p,.25,.4),TC);
  s+=line(X(0),300,X(300),300,{color:C.ink,w:3});
  for(let v=0;v<=300;v+=50)s+=line(X(v),288,X(v),312,{color:C.ink,w:v%100?1.5:3})+(v%100?'':label(`${v} m`,X(v),350,{size:24,color:C.dim,anchor:'middle'}));
  const xp=X(300*u);
  s+=fade(seg(p,.4,.45),dot(xp,300,22,RADIO,.25)+dot(xp,300,10,RADIO)+line(X(0),300,xp,300,{color:RADIO,w:6}));
  s+=fade(seg(p,.4,.45),label(`${(u).toFixed(2)} μs`,xp,250,{size:28,color:TC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.85,.95),label('300 m！',X(300),430,{size:40,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c21']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=card(40,30,520,90,TX(`${cs(TC,'1'+U('\\mu s'))}\\ \\to\\ 300${U('m')}`,300,92,{size:44}),1,C.faint);
  s+=fade(seg(p,.02,.15),label('時間の ずれ',150,160,{size:26,color:TC,anchor:'middle',weight:700})+label('距離の ずれ',420,160,{size:26,color:C.ink,anchor:'middle',weight:700}));
  // target picture: 300 m error ring vs the few-metre ring we want
  s+=fade(seg(p,.1,.25),ring(860,250,200,{color:HC,w:4,dash:'10 8'})+label('300 m の ずれ',860,40,{size:28,color:HC,anchor:'middle',weight:700}));
  s+=here(860,250,t,{acc:4});
  s+=fade(seg(p,.4,.55),ring(860,250,22,{color:OK,w:4})+label('数 m',900,232,{size:26,color:OK,weight:700}));
  s+=card(60,260,500,200,label('数 m の 精度には',310,320,{size:30,color:C.ink,anchor:'middle'})+label('10億分の1 秒',310,380,{size:38,color:TC,anchor:'middle',weight:700})+label('（ナノ秒）',310,430,{size:28,color:TC,anchor:'middle'}),seg(p,.55,.7),TC);
  return s;
 },
 [K+'c22']:(p,ctx)=>{
  const z=seg(p,.05,.45),span=300*10**(-3*z); // metres across 900 px; 300 m → 0.3 m
  let s=zoomRuler(span,{y:300});
  const X=v=>150+900*v/span;
  const xp=Math.min(X(.3),1060);
  s+=line(150,300,xp,300,{color:RADIO,w:7})+dot(xp,300,11,RADIO);
  s+=label(z<.98?'目盛りを 拡大中':'1 ns の 間に 進む 距離',600,240,{size:30,color:TC,anchor:'middle',weight:700});
  s+=card(250,30,700,110,TX(`${cs(TC,'1'+U('ns'))}\\ \\to\\ 30${U('cm')}`,600,102,{size:52}),seg(p,.45,.55),TC);
  s+=card(250,390,700,100,label('場所の 精度 ＝ 時計の 精度',600,452,{size:36,color:HC,anchor:'middle',weight:700}),seg(p,.65,.8),HC);
  return s;
 },
 // ================= S4 雑音より弱い声 =================
 [K+'d23']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=earth(600,1500,1100)+phone(1000,355,70)+sat(170,70,1.4);
  const x0=200,y0=95,x1=990,y1=320,L=Math.hypot(x1-x0,y1-y0),ux=(x1-x0)/L,uy=(y1-y0)/L;
  const pts=[];for(let i=0;i<=240;i++){const q=i/240,A=36*(1-q)**2+2;const w=A*Math.sin(q*L/22-t*6);pts.push([x0+ux*q*L-uy*w,y0+uy*q*L+ux*w]);}
  s+=draw(pts,seg(p,.05,.4),{color:RADIO,w:4});
  s+=fade(seg(p,.4,.55),label('強い',300,90,{size:28,color:RADIO,weight:700})+label('とても 弱い',880,250,{size:28,color:RADIO,anchor:'middle',weight:700}));
  return s;
 },
 [K+'d24']:(p,ctx)=>{
  const t=sceneT(p,ctx),R=rng(11+Math.floor(t*8));
  const y=260;let pts=[],sig=[];
  for(let x=100;x<=1100;x+=6){pts.push([x,y+(R()-.5)*170]);const b=BITS[Math.floor((x-100)/50)%BITS.length];sig.push([x,y+(b?-14:14)]);}
  let s=card(60,60,1080,400,'',1,C.faint);
  s+=draw(pts,1,{color:'#8291ad',w:2});
  s+=fade(seg(p,.45,.6),draw(sig,1,{color:HC,w:4}));
  s+=label('雑音',140,110,{size:28,color:'#a7b4cc',weight:700});
  s+=fade(seg(p,.45,.6),label('信号（雑音より 弱い）',650,110,{size:28,color:HC,weight:700}));
  s+=fade(seg(p,.7,.85),label('埋もれた 声を 聞き取る',600,430,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'d25']:(p,ctx)=>{
  const t=sceneT(p,ctx),off=TAU*seg(p,.35,.85),x0r=100+TAU*CW,x0=100+off*CW;
  const sc=matchScore(TAU-off), ok=off>TAU-.03?1:0;
  let s=band(x0r,130,{label:'届いた 模様（衛星から）',labCol:RADIO,hl:ok,g:seg(p,.02,.12)});
  s+=band(x0,260,{label:'',hl:ok,g:seg(p,.2,.3)});
  s+=fade(seg(p,.2,.3),label('手元で 作った 同じ 模様',x0,340,{size:24,color:C.ink,weight:700}));
  s+=fade(seg(p,.3,.4),label('一致',120,440,{size:26,color:C.dim,weight:700})+rect(190,415,700,34,{fill:'#1a2745',fo:1,stroke:C.faint,rx:8})+rect(190,415,700*sc,34,{fill:ok?HC:'#7f8fae',fo:.9,stroke:'none',rx:8}));
  s+=fade(ok*seg(p,.85,.92),label('ぴったり！',1000,445,{size:34,color:HC,anchor:'middle',weight:700})+`<rect x="${x0r-6}" y="120" width="${BITS.length*CW+9}" height="196" rx="10" fill="${HC}" fill-opacity=".07"/>`);
  return s;
 },
 [K+'d26']:(p,ctx)=>{
  const x0r=100+TAU*CW;
  let s=band(x0r,130,{label:'届いた 模様（衛星から）',labCol:RADIO,hl:1});
  s+=band(x0r,260,{hl:1});
  s+=fade(seg(p,.05,.2),line(100,250,100,400,{color:C.dim,w:3,dash:'6 6'})+label('元の 位置',100,236,{size:24,color:C.dim,anchor:'middle'}));
  s+=arrow(100,385,x0r,385,{color:TC,w:6,head:20,g:seg(p,.15,.45)});
  s+=fade(seg(p,.35,.5),label('ずらした 量 ＝ かかった 時間',220,450,{size:30,color:TC,weight:700}));
  return s;
 },
 // ================= S5 スマホの時計は、安物 =================
 [K+'e27']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=phone(260,280,230);
  s+=fade(seg(p,.05,.2),arrow(260,30,260,150,{color:RADIO,w:5,head:18})+label('届いた！',300,70,{size:28,color:RADIO,weight:700}));
  s+=clock(620,250,110,{t,name:'スマホの 時計',g:seg(p,.3,.45)});
  s+=card(800,150,350,180,label('正確な 時計が',975,220,{size:30,color:C.ink,anchor:'middle',weight:700})+label('必要',975,285,{size:40,color:HC,anchor:'middle',weight:700}),seg(p,.5,.65),HC);
  return s;
 },
 [K+'e28']:(p,ctx)=>{
  const t=sceneT(p,ctx),q=Math.sin(t*40)*seg(p,.05,.15);
  let s=card(60,60,480,380,'',1,C.faint);
  s+=label('水晶の 板',300,110,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=scaleAt(300,250,1,rect(230-q*5,190,140+q*10,120,{fill:'#cfe8ff',fo:.55,stroke:'#e6f3ff',sw:3,rx:6}));
  for(const sg of[-1,1])s+=fade(Math.abs(q),draw([[300+sg*95,215],[300+sg*110,250],[300+sg*95,285]],1,{color:'#cfe8ff',w:3}));
  s+=label('振動を 数える',300,370,{size:28,color:C.dim,anchor:'middle'});
  const n=Math.floor(t*1234567)%100000000;
  s+=label(String(n).padStart(8,'0'),300,415,{size:30,color:TC,anchor:'middle',weight:700});
  s+=card(620,150,520,190,label('進み方の ずれ',880,210,{size:30,color:C.ink,anchor:'middle',weight:700})+label('100万分の1 ほど',880,285,{size:40,color:HC,anchor:'middle',weight:700}),seg(p,.6,.75),HC);
  return s;
 },
 [K+'e29']:(p,ctx)=>{
  const t=sceneT(p,ctx),sec=Math.round(40*seg(p,.15,.95))/10,px=60/300; // 300 m = 60 px
  let s=nightMap(80,25,1040,470,{id:'d'});
  const R=sec*300*px;
  s+=`<defs><radialGradient id="gpsBlur"><stop offset="0" stop-color="#4c8dff" stop-opacity=".55"/><stop offset=".75" stop-color="#4c8dff" stop-opacity=".25"/><stop offset="1" stop-color="#4c8dff" stop-opacity="0"/></radialGradient></defs>`;
  if(R>2)s+=`<circle cx="600" cy="265" r="${R+20}" fill="url(#gpsBlur)"/>`;
  for(let k=1;k<=4;k++)s+=fade(clamp((sec-k)*3+1),ring(600,265,k*60,{color:HC,w:2,dash:'6 6'})+label(`${k*300} m`,600+k*60*.72,265-k*60*.72,{size:24,color:HC,weight:700}));
  s+=here(600,265,t,{g:1-.6*seg(p,.15,.6)});
  s+=card(110,50,360,90,label(`${sec.toFixed(1)} 秒 → ${Math.round(sec*300)} m`,290,108,{size:32,color:HC,anchor:'middle',weight:700}),1,HC);
  s+=card(110,400,340,80,label('1秒ごとに 1 μs ＝ 300 m',280,450,{size:26,color:TC,anchor:'middle',weight:700}),seg(p,.05,.15),TC);
  return s;
 },
 [K+'e30']:(p,ctx)=>{
  const t=sceneT(p,ctx),sec=Math.round(40+40*seg(p,.05,.9))/10,px=60/300,R=sec*300*px;
  let s=nightMap(80,25,1040,470,{id:'e'});
  s+=`<defs><radialGradient id="gpsBlur2"><stop offset="0" stop-color="#4c8dff" stop-opacity=".6"/><stop offset=".8" stop-color="#4c8dff" stop-opacity=".3"/><stop offset="1" stop-color="#4c8dff" stop-opacity="0"/></radialGradient></defs>`;
  s+=clip('gpsMapE2',80,25,1040,470,`<circle cx="600" cy="265" r="${R+20}" fill="url(#gpsBlur2)"/>`);
  s+=card(110,50,360,90,label(`${sec.toFixed(1)} 秒 → ${Math.round(sec*300)} m`,290,108,{size:32,color:HC,anchor:'middle',weight:700}),1,HC);
  s+=card(650,390,460,90,label('どの 町に いるのかさえ？',880,448,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.55),BAD);
  return s;
 },
 [K+'e31']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=phone(220,260,200);
  s+=card(400,110,700,240,label('スマホは どうしている？',750,200,{size:40,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('GPS の 一番 かしこい ところ',750,280,{size:34,color:HC,anchor:'middle',weight:700})),seg(p,.02,.15),HC);
  return s;
 },
 [K+'e32']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=seg(p,.45,.75);
  let s=clock(200,230,110,{t,name:'スマホの 時計'});
  s+=fade(seg(p,.05,.2),label('ずれている',200,80,{size:28,color:BAD,anchor:'middle',weight:700})+okMark(300,72,1));
  s+=fade(seg(p,.05,.2),label('（認める）',380,80,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(560,120,580,300,label('分からない 数',850,175,{size:32,color:C.ink,anchor:'middle',weight:700})+label('場所',720,300,{size:40,color:XC,anchor:'middle',weight:700})+label('＋',850,300,{size:40,color:C.ink,anchor:'middle'}),seg(p,.3,.45),C.faint);
  const bx=mix(300,980,u),by=mix(230,290,u);
  s+=fade(seg(p,.4,.5),card(bx-60,by-45,120,90,TX(cs(TC,'b'),bx,by+16,{size:56}),1,TC));
  s+=fade(seg(p,.8,.9),label('まとめて 計算で 求める',850,390,{size:28,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e33']:(p)=>{
  const items=[['x',XC],['y',XC],['z',XC],['b',TC]];
  let s='';
  items.forEach(([v,col],i)=>{const x=170+i*230+(i===3?60:0),g=seg(p,.05+i*.12,.15+i*.12);s+=card(x-80,120,160,160,TX(cs(col,v),x,222,{size:80}),g,col);});
  s+=fade(seg(p,.2,.35),brace(90,780,300,{color:XC,text:'場所',size:30}));
  s+=fade(seg(p,.5,.6),brace(870,1070,300,{color:TC,text:'時計の ずれ',size:30}));
  s+=fade(seg(p,.7,.85),label('合わせて 4つ',600,470,{size:40,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e34']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=earth(600,1500,1100)+phone(600,360,70);
  fourSats.forEach(([x,y],i)=>{const g=seg(p,.05+i*.08,.15+i*.08);
   s+=fade(g,line(x,y+16,600,322,{color:SATCOL[i],w:4}));
   const u=(t*.5+i*.25)%1;s+=fade(g*Math.sin(PI*u),dot(mix(x,600,u),mix(y+16,322,u),7,SATCOL[i]));
   s+=sat(x,y,1.1,{g:Math.max(g,.0)})+fade(g,label(`式 ${i+1}`,x,y-35,{size:26,color:SATCOL[i],anchor:'middle',weight:700}));});
  s+=card(820,210,330,110,label('未知数 4つ',985,255,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 式 4本',985,300,{size:30,color:HC,anchor:'middle',weight:700}),seg(p,.55,.7),HC);
  return s;
 },
 [K+'e35']:(p)=>{
  const sz=50,y=200;
  const A=`\\rho_i\\,=`, B=`\\sqrt{(${cs(XC,'x')}-${cs(XC,'x_i')})^2+(${cs(XC,'y')}-${cs(XC,'y_i')})^2+(${cs(XC,'z')}-${cs(XC,'z_i')})^2}`, Cc=`+\\ ${cs(CC,'c')}\\,${cs(TC,'b')}`;
  const wa=texWidth(A,sz,false),wb=texWidth(B,sz,false),wc=texWidth(Cc,sz,false),gap=16,W=wa+wb+wc+2*gap,x0=600-W/2;
  const xa=x0,xb=xa+wa+gap,xc=xb+wb+gap;
  let s=fade(seg(p,.02,.15),TX(A,xa,y,{size:sz,anchor:'start'})+TX(B,xb,y,{size:sz,anchor:'start'})+TX(Cc,xc,y,{size:sz,anchor:'start'}));
  s+=fade(seg(p,.15,.3),brace(xb,xb+wb,y+50,{color:XC,text:'本当の 距離',size:30}));
  s+=fade(seg(p,.4,.55),brace(xc+20,xc+wc,y+50,{color:TC,text:'',size:28})+label('時計の ずれ',xc+wc/2+10,y+125,{size:28,color:TC,anchor:'middle',weight:700})+label('× 光の 速さ',xc+wc/2+10,y+162,{size:28,color:CC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),brace(xa,xa+wa-20,y-56,{dir:-1,color:HC,text:'',size:28})+label('測った 距離',xa+wa/2-10,y-100,{size:28,color:HC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.9),label('i ＝ 衛星の 番号',150,470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'e36']:(p)=>{
  let rows='';
  for(let i=1;i<=4;i++){const g=seg(p,.02+i*.04,.08+i*.04);rows+=fade(g,TX(`\\rho_${i}=\\sqrt{(${cs(XC,'x')}-${cs(XC,'x_'+i)})^2+\\cdots}+${cs(CC,'c')}\\,${cs(TC,'b')}`,40,30+i*58,{size:34,anchor:'start'}));}
  let s=fade(1-.55*seg(p,.35,.45),rows);
  s+=fade(seg(p,.05,.2),label('4本 連立 → 場所と ずれが 決まる',290,320,{size:26,color:HC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.5),arrow(560,160,640,160,{color:C.dim,w:4,head:16}));
  const M=`\\begin{pmatrix}\\ast&\\ast&\\ast&\\ast\\\\\\ast&\\ast&\\ast&\\ast\\\\\\ast&\\ast&\\ast&\\ast\\\\\\ast&\\ast&\\ast&\\ast\\end{pmatrix}\\begin{pmatrix}\\Delta ${cs(XC,'x')}\\\\\\Delta ${cs(XC,'y')}\\\\\\Delta ${cs(XC,'z')}\\\\\\Delta ${cs(TC,'b')}\\end{pmatrix}=\\begin{pmatrix}\\ast\\\\\\ast\\\\\\ast\\\\\\ast\\end{pmatrix}`;
  s+=fade(seg(p,.4,.5),TX(M,910,195,{size:30}));
  s+=tag('近似',780,40,{color:C.dim,g:seg(p,.4,.5)})+fade(seg(p,.4,.5),label('直線に 近似して 行列で 解く',1040,48,{size:24,color:C.dim,anchor:'middle'}));
  // iteration: guesses hop toward the answer
  const yy=430,tx=1080,gs=[200,640,900,1030];
  s+=fade(seg(p,.6,.65),line(160,yy,1120,yy,{color:C.faint,w:2})+dot(tx,yy,13,HC)+label('答え',tx+10,yy-34,{size:24,color:HC,anchor:'middle',weight:700}));
  gs.forEach((x,i)=>{const g=seg(p,.62+i*.07,.68+i*.07);s+=fade(g,dot(x,yy,9,XC)+label(String(i+1),x,yy+40,{size:24,color:XC,anchor:'middle'}));
   if(i>0)s+=fade(g,`<path d="M${gs[i-1]} ${yy-12} Q ${(gs[i-1]+x)/2} ${yy-70} ${x} ${yy-14}" fill="none" stroke="${XC}" stroke-width="2.5"/>`);});
  s+=fade(seg(p,.62,.7),label('少しずつ 直す',420,yy+45,{size:26,color:XC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e37']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  const all=[[170,110],[450,60],[760,70],[1040,120],[80,230],[300,170],[900,180],[1120,250]];
  let s=earth(600,1500,1100);
  let n=4;all.forEach(([x,y],i)=>{const g=i<4?1:seg(p,.05+(i-4)*.07,.12+(i-4)*.07);if(i>=4&&g>.5)n++;
   s+=fade(g,line(x,y+16,600,330,{color:RADIO,w:2,dash:'2 8'}))+sat(x,y,1,{g});});
  const spread=60*Math.sqrt(4/n)*(1-.35*seg(p,.55,.8))+(n<=4?0:0);
  s+=`<defs><radialGradient id="gpsFuz"><stop offset="0" stop-color="#4c8dff" stop-opacity=".7"/><stop offset="1" stop-color="#4c8dff" stop-opacity="0"/></radialGradient></defs><circle cx="600" cy="370" r="${spread}" fill="url(#gpsFuz)"/>`;
  s+=dot(600,370,9,'#4c8dff')+ring(600,370,10,{color:'#fff',w:2});
  s+=card(40,300,330,90,label(`衛星 ${n} 機 → 式 ${n} 本`,205,357,{size:30,color:C.ink,anchor:'middle',weight:700}),1,C.faint);
  s+=card(820,300,340,140,label('誤差を ならす',990,350,{size:28,color:C.ink,anchor:'middle',weight:700})+label('最小二乗法',990,410,{size:36,color:HC,anchor:'middle',weight:700}),seg(p,.6,.75),HC);
  return s;
 },
 [K+'e38']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  const pos=[[170,120],[450,95],[750,95],[1030,120]];
  let s='';
  pos.forEach(([x,y],i)=>{s+=line(x,y+60,600,380,{color:RADIO,w:2,dash:'3 7'})+clock(x,y,58,{t})+sat(x+52,y-50,.6);});
  // phone clock drifts, then snaps back to the satellites' time every 2 s
  const ph=(t%2)/2, drift=ph*9; // seconds of exaggerated drift
  s+=clock(600,400,80,{t,off:drift,name:''});
  s+=fade(ph<.12?1-ph/.12:0,ring(600,400,96,{color:HC,w:6}));
  s+=label('スマホ',720,420,{size:26,color:C.ink,weight:700});
  s+=tag('衛星',90,40,{color:C.dim,size:24});
  s+=card(820,250,350,110,label('借りて 合わせ直す',995,318,{size:30,color:HC,anchor:'middle',weight:700}),seg(p,.4,.55),HC);
  s+=fade(seg(p,.1,.2),label('安い 時計',380,470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'e39']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.6,earth(600,1500,1100));
  s+=clock(220,230,110,{t,name:'衛星'})+sat(220,70,1.3,{glow:.5+.5*Math.sin(t*2)});
  s+=card(400,110,740,250,label('全てを 支えるのは 衛星の 時計',770,180,{size:30,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.45,.6),label('宇宙で どんな 目に あう？',770,280,{size:42,color:HC,anchor:'middle',weight:700})),seg(p,.02,.15),HC);
  return s;
 },
};
