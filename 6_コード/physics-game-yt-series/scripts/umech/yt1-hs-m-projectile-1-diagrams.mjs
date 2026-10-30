// 高校編「放物運動・深く学ぶ 1/3」(ys-hs-m-projectile-1) — 図。Stage 1200×515.
// 水平投射：横 x＝v₀t（等速）、縦 y＝½gt²（下向き正、g＝10）。1・2・3 s で 5・20・45 m。
// 色：位置 x・y 水色、速度 v 紫（横の成分は濃く、縦の成分は薄く）、g 赤、時刻 t 金、強調 黄。
// 2/3・3/3・要点でも使う部品は export する。
import {C,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,ground} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {Gt,Yt,Ht,ball,lightBall} from './yt1-hs-m-freefall-1-diagrams.mjs';

const K='hs-m-projectile-1:';
export const G=10;
export const VXC=C.v, VYC='#dccfff';           // 横の成分（濃い紫）・縦の成分（薄い紫）
export const T1=(src,x,y,o={})=>tex(src,x,y,{size:46,...o});
export const fallY=t=>G*t*t/2;

// ---- horizontal throw from a ledge: origin (x0,y0), 1 m = k px, ground at 45 m below --------------
export const PJ={x0:300,y0:90,k:6.4};
export function hThrow({x0=PJ.x0,y0=PJ.y0,k=PJ.k,v0=20,n=3,g=1,drop=0,thrown=1,rows=0,tl=1,yl=0,va=0,vxa=1,vya=1,vl=0,ledge=null,hl=-1,ghost=1,dropDx=-80,path=0,H=45}={}){
 const X=t=>x0+k*v0*t,Y=t=>y0+k*fallY(t),gy=y0+k*H+16,dX=x0+dropDx;
 let s='';
 if(ledge??!drop)s+=fade(g,rect(x0-150,y0+16,150+16,14,{fill:'#4a5570',fo:.9,stroke:'none',rx:3})+line(x0-120,y0+30,x0-120,gy,{color:'#4a5570',w:8}));
 s+=fade(g,ground(Math.min(dX,x0)-170,Math.max(X(n),x0)+90,gy));
 if(path)s+=draw(Array.from({length:41},(_,i)=>{const t=3*i/40;return [X(t),Y(t)];}),path,{color:C.hi,w:2.5,dash:'7 8'});
 for(let i=0;i<=n;i++){
  const a=typeof ghost==='number'?ghost:ghost(i);
  if(rows&&i>0)s+=fade(g*rows,line(dX-30,Y(i),X(i)+30,Y(i),{color:C.hi,w:2,dash:'5 7'}));
  if(drop)s+=fade(g*drop*a,lightBall(dX,Y(i),15));
  if(thrown)s+=fade(g*thrown*a,ball(X(i),Y(i)));
  if(i===hl)s+=fade(g,ring(X(i),Y(i),26,{color:C.hi,w:3}));
  if(tl)s+=fade(g*tl*a,drop?label(`${i} s`,dX-28,Y(i)+(i===0?-14:i===1?16:8),{size:22,color:C.t,anchor:'end'}):label(`${i} s`,X(i)-20,Y(i)-22,{size:22,color:C.t,anchor:'end'}));
  if(yl&&i>0)s+=fade(g*yl,i===3?label(`${fallY(i)} m`,X(i)-26,Y(i)-18,{size:22,color:C.x,anchor:'end'}):label(`${fallY(i)} m`,X(i)+30,Y(i)+8,{size:22,color:C.x}));
  if(va&&thrown){
   s+=arrow(X(i)+12,Y(i),X(i)+12+2.4*v0,Y(i),{color:VXC,w:4,head:12,g:g*va*vxa*a});
   if(i>0)s+=arrow(X(i),Y(i)+12,X(i),Y(i)+12+2.4*G*i,{color:VYC,w:4,head:12,g:g*va*vya*a});
   if(vl){
    s+=fade(g*vl*vxa*a,label(String(v0),X(i)+16+1.2*v0,Y(i)-12,{size:22,color:VXC,anchor:'middle',weight:700}));
    if(i>0)s+=fade(g*vl*vya*a,label(String(G*i),X(i)-12,Y(i)+30+1.2*G*i,{size:22,color:VYC,anchor:'end',weight:700}));
   }
  }
 }
 return s;
}

// ---- a cliff (scale for the 45 m problems; 20 m/s and 40 m/s fit) ---------------------------------
export const CL={x0:200,y0:120,k:4.2};
export function cliff({x0=CL.x0,y0=CL.y0,k=CL.k,g=1,hl=0}={}){
 const gy=y0+k*45+16;
 let s=fade(g,rect(60,y0+16,x0-60,gy-y0-16,{fill:'#4a5570',fo:.85,stroke:'none',rx:4})+ground(x0,x0+560,gy));
 if(hl)s+=fade(g*hl,line(x0-30,y0+16,x0-30,gy,{color:C.x,w:3})+label('45 m',x0-40,(y0+gy)/2+8,{size:26,color:C.x,anchor:'end',weight:700}));
 return s;
}
export function cliffPath(v0,{x0=CL.x0,y0=CL.y0,k=CL.k,p=1,color=C.hi,ballAt=-1,dash='7 8',dots=0,tl=0}={}){
 const X=t=>x0+k*v0*t,Y=t=>y0+k*fallY(t);
 let s=draw(Array.from({length:41},(_,i)=>{const t=3*i/40;return [X(t),Y(t)];}),p,{color,w:3,dash});
 if(dots)for(let i=0;i<=3;i++){s+=fade(dots,dot(X(i),Y(i),7,color));if(tl)s+=fade(tl,label(`${i} s`,X(i)+10,Y(i)-14,{size:22,color:C.t}));}
 if(ballAt>=0)s+=ball(X(ballAt),Y(ballAt));
 return s;
}
const span=(x1,x2,y,txt,{color=C.x,g=1}={})=>fade(g,line(x1,y,x2,y,{color,w:3})+line(x1,y-10,x1,y+10,{color,w:3})+line(x2,y-10,x2,y+10,{color,w:3})+label(txt,(x1+x2)/2,y+36,{size:26,color,anchor:'middle',weight:700}));

// ---- simple lamp ------------------------------------------------------------------------------
const lamp=(x,y,g=1)=>fade(g,dot(x,y,16,'#fff2b8')+[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return line(x+24*Math.cos(a),y+24*Math.sin(a),x+34*Math.cos(a),y+34*Math.sin(a),{color:'#fff2b8',w:3});}).join(''));

// ---- the two-shadow scene (no ledge drawing clutter): origin (x0,y0) -----------------------------
const SH={x0:200,y0:110,k:5,floor:110+5*45+16,wall:760};
function shadowScene(p,{fx=0,wy=0,tt=null,clock=0}={}){
 const {x0,y0,k,floor,wall}=SH,X=t=>x0+k*20*t,Y=t=>y0+k*fallY(t);
 const t=tt??3*seg(p,.1,.85);
 let s=rect(x0-70,y0+16,70,floor-y0-16,{fill:'#4a5570',fo:.85,stroke:'none',rx:3})+ground(x0,wall,floor);
 s+=line(wall,y0-40,wall,floor,{color:C.dim,w:4});
 s+=draw(Array.from({length:31},(_,i)=>{const u=3*i/30;return [X(u),Y(u)];}),1,{color:C.faint,w:2,dash:'6 8'});
 if(fx){s+=lamp(X(t),40,fx)+fade(fx*.6,line(X(t),62,X(t),floor-4,{color:'#fff2b8',w:1.5,dash:'3 6'}));
  s+=fade(fx,`<ellipse cx="${X(t).toFixed(1)}" cy="${floor-3}" rx="18" ry="6" fill="#000" fill-opacity=".75" stroke="${C.x}" stroke-width="2"/>`);}
 if(wy){s+=lamp(80,Y(t),wy)+fade(wy*.6,line(110,Y(t),wall-4,Y(t),{color:'#fff2b8',w:1.5,dash:'3 6'}));
  s+=fade(wy,`<ellipse cx="${wall-3}" cy="${Y(t).toFixed(1)}" rx="6" ry="18" fill="#000" fill-opacity=".75" stroke="${C.x}" stroke-width="2"/>`);}
 s+=ball(X(t),Y(t));
 if(clock)s+=card(830,150,320,150,label('時刻',990,205,{size:28,color:C.dim,anchor:'middle'})+label(`t ＝ ${t.toFixed(1)} s`,990,265,{size:38,color:C.t,anchor:'middle',weight:700}),clock,C.t);
 return {s,X,Y,t};
}

export const hsProjectile1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  const u=seg(p,.1,.85);
  let s=cliff();
  s+=fade(seg(p,.02,.15),arrow(CL.x0,CL.y0-40,CL.x0+90,CL.y0-40,{color:C.v,w:5,head:14})+label('横に 投げる',CL.x0+45,CL.y0-62,{size:26,color:C.v,anchor:'middle'}));
  s+=cliffPath(20,{p:u})+ball(CL.x0+CL.k*20*3*u,CL.y0+CL.k*fallY(3*u));
  return s;
 },
 [K+'q2']:(p)=>{
  let s=fade(.35,cliff()+cliffPath(20));
  s+=card(250,130,800,200,label('横に 速く 投げるほど',650,200,{size:32,color:C.ink,anchor:'middle'})+label('落ちるまでの 時間は 長くなる？',650,270,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'feel']:(p)=>{
  let s=cliff();
  s+=cliffPath(20,{p:seg(p,.05,.45),color:'#a9b6f0'})+fade(seg(p,.4,.5),label('ゆっくり',CL.x0+CL.k*60,CL.y0+CL.k*45+60,{size:24,color:'#a9b6f0',anchor:'middle'}));
  s+=cliffPath(40,{p:seg(p,.3,.7)})+fade(seg(p,.65,.75),label('速く',CL.x0+CL.k*120,CL.y0+CL.k*45+60,{size:24,color:C.hi,anchor:'middle'}));
  s+=card(760,140,400,170,label('遠くまで 飛ぶ間',960,200,{size:28,color:C.ink,anchor:'middle'})+label('長く 空中に いる？',960,260,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.75,.88));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=fade(.4,cliff()+cliffPath(20));
  s+=card(720,110,440,250,label('曲がって 飛ぶ 運動',940,170,{size:30,color:C.ink,anchor:'middle'})+label('↓',940,220,{size:32,color:C.dim,anchor:'middle'})+label('横 ＋ 縦',940,285,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'series']:(p)=>{
  const items=[['1回目','横に 投げる'],['2回目','斜めに 投げる'],['3回目','通り道と 飛ぶ 距離']];
  let s=label('放物運動・深く学ぶ（3回）',600,80,{size:32,color:C.ink,anchor:'middle',weight:700});
  items.forEach(([a,b],i)=>{s+=card(90+i*350,150,320,200,label(a,250+i*350,215,{size:28,color:C.dim,anchor:'middle'})+label(b,250+i*350,285,{size:30,color:i===0?C.hi:C.ink,anchor:'middle',weight:700}),seg(p,.05+i*.22,.2+i*.22),i===0?C.hi:C.faint);});
  return s;
 },
 [K+'cond']:(p)=>{
  let s=card(150,60,900,170,label('仮定',600,110,{size:26,color:C.dim,anchor:'middle'})+label('空気抵抗なし ・ 重力は 一定',600,180,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=card(250,270,700,190,label('計算を 見やすく するため',600,330,{size:28,color:C.ink,anchor:'middle'})+tex(Gt+'=10\\ \\mathrm{m/s^2}',600,410,{size:54,auto:false}),seg(p,.5,.65),C.a);
  return s;
 },
 // ================= S2 横と縦、2つの数 =================
 [K+'path']:(p)=>{
  const u=seg(p,.05,.6);
  let s=hThrow({n:0,tl:0,path:u});
  s+=ball(PJ.x0+PJ.k*20*3*u,PJ.y0+PJ.k*fallY(3*u));
  s+=card(760,160,400,150,label('位置は',960,215,{size:28,color:C.ink,anchor:'middle'})+label('どう 表す？',960,270,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'xy']:(p)=>{
  const {x0,y0}=PJ;
  let s=hThrow({n:0,tl:0,path:1});
  s+=arrow(x0,y0,x0+420,y0,{color:C.x,w:3,head:14,g:seg(p,.15,.35)})+fade(seg(p,.3,.4),label('x（横）',x0+430,y0+8,{size:28,color:C.x,weight:700}));
  s+=arrow(x0,y0,x0,y0+310,{color:C.x,w:3,head:14,g:seg(p,.45,.65)})+fade(seg(p,.6,.7),label('y（縦・下が正）',x0+14,y0+330,{size:26,color:C.x,weight:700}));
  s+=fade(seg(p,.05,.15),label('原点',x0-14,y0-14,{size:24,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'pt']:(p)=>{
  const {x0,y0,k}=PJ,X=x0+k*40,Y=y0+k*20;
  let s=hThrow({n:0,tl:0,path:1});
  s+=arrow(x0,y0,x0+420,y0,{color:C.x,w:3,head:14})+label('x',x0+430,y0+8,{size:28,color:C.x,weight:700});
  s+=arrow(x0,y0,x0,y0+310,{color:C.x,w:3,head:14})+label('y',x0+14,y0+330,{size:28,color:C.x,weight:700});
  s+=ball(X,Y)+fade(seg(p,.05,.15),label('2秒後',X+24,Y-20,{size:24,color:C.t}));
  s+=fade(seg(p,.2,.4),line(X,Y,X,y0,{color:C.x,w:2,dash:'5 6'})+label('40 m',X,y0-14,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),line(X,Y,x0,Y,{color:C.x,w:2,dash:'5 6'})+label('20 m',x0-14,Y+8,{size:26,color:C.x,anchor:'end',weight:700}));
  s+=card(780,170,370,150,label('（x, y）＝',965,225,{size:28,color:C.ink,anchor:'middle'})+label('（40 m, 20 m）',965,282,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.75,.88),C.x);
  return s;
 },
 [K+'split']:(p)=>{
  let s=hThrow({n:3,tl:0,path:1,ghost:.35});
  s+=card(760,90,400,140,label('分けるのは',960,145,{size:28,color:C.dim,anchor:'middle'})+label('球 ではない',960,200,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(760,260,400,140,label('分けるのは',960,315,{size:28,color:C.dim,anchor:'middle'})+label('記録する 方向',960,370,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'shadowx']:(p)=>{
  const r=shadowScene(p,{fx:1});
  return r.s+card(830,330,330,120,label('床の 影',995,375,{size:26,color:C.dim,anchor:'middle'})+label('横の 動き だけ',995,425,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.4,.55),C.x);
 },
 [K+'shadowy']:(p)=>{
  const r=shadowScene(p,{fx:.35,wy:1});
  return r.s+card(830,330,330,120,label('壁の 影',995,375,{size:26,color:C.dim,anchor:'middle'})+label('縦の 動き だけ',995,425,{size:30,color:C.x,anchor:'middle',weight:700}),seg(p,.4,.55),C.x);
 },
 [K+'clock']:(p)=>{
  const r=shadowScene(p,{fx:1,wy:1,clock:seg(p,.05,.2)});
  return r.s+card(830,330,330,120,label('x も y も',995,375,{size:26,color:C.dim,anchor:'middle'})+label('同じ 時刻 t',995,425,{size:32,color:C.t,anchor:'middle',weight:700}),seg(p,.5,.65),C.t);
 },
 // ================= S3 2つの球を同時に撮る =================
 [K+'exp']:(p)=>{
  const {x0,y0,k}=PJ,u=seg(p,.35,.9),t=3*u;
  let s=hThrow({n:0,tl:0,thrown:0,drop:0,ledge:0});
  s+=lightBall(x0-80,y0+k*fallY(t),15)+ball(x0+k*20*t,y0+k*fallY(t));
  s+=fade(seg(p,.05,.2),label('静かに 落とす',x0-100,y0-40,{size:24,color:'#ffd9a8',anchor:'end'})+label('水平に 投げる',x0+10,y0-40,{size:24,color:C.hi,anchor:'start'})+arrow(x0+20,y0-12,x0+80,y0-12,{color:C.v,w:4,head:12}));
  return s;
 },
 [K+'guess']:(p)=>{
  let s=fade(.4,hThrow({n:0,tl:0,drop:1}));
  s+=card(720,140,440,200,label('先に 地面に 着くのは',940,205,{size:30,color:C.ink,anchor:'middle'})+label('どちら？',940,275,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'photo']:(p)=>hThrow({drop:1,ghost:i=>seg(p,.05+i*.2,.15+i*.2)})+card(760,160,400,130,label('1秒ごとに 同時に 撮影',960,235,{size:28,color:C.ink,anchor:'middle'}),seg(p,.02,.12)),
 [K+'rows']:(p)=>{
  let s=hThrow({drop:1,rows:seg(p,.1,.4)});
  s+=card(760,160,400,150,label('同じ 時刻の 縦の 位置',960,215,{size:26,color:C.ink,anchor:'middle'})+label('そろう',960,275,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'fall']:(p)=>{
  let s=hThrow({drop:1,rows:1,yl:seg(p,.05,.35)});
  s+=card(760,120,400,230,tex(Yt+'=\\tfrac12'+Gt+'t^2',960,185,{size:44})+label('5、20、45 m',960,260,{size:32,color:C.x,anchor:'middle',weight:700})+label('落とした球と 同じ',960,315,{size:26,color:C.dim,anchor:'middle'}),seg(p,.45,.6),C.x);
  return s;
 },
 [K+'fact']:(p)=>{
  let s=hThrow({drop:1,rows:1,yl:1,hl:seg(p,.3,.45)>.5?3:-1});
  s+=card(760,120,400,130,label('実験で 確かめた 事実',960,195,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=card(760,280,400,120,label('同時に 着地',960,352,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'xgap']:(p)=>{
  const {x0,y0,k}=PJ,gy=y0+k*45+16;
  let s=hThrow({drop:.35,rows:.3});
  for(let i=0;i<3;i++)s+=fade(seg(p,.1+i*.15,.22+i*.15),line(x0+k*20*i,gy+40,x0+k*20*(i+1),gy+40,{color:C.x,w:3})+line(x0+k*20*(i+1),gy+30,x0+k*20*(i+1),gy+50,{color:C.x,w:3})+(i===0?line(x0,gy+30,x0,gy+50,{color:C.x,w:3}):'')+label('20 m',x0+k*20*(i+.5),gy+80,{size:22,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.6),[0,1,2,3].map(i=>line(x0+k*20*i,y0+k*fallY(i)+18,x0+k*20*i,gy+30,{color:C.faint,w:1.5,dash:'3 6'})).join(''));
  s+=card(760,160,400,130,label('横の 間隔は 一定',960,235,{size:32,color:C.x,anchor:'middle',weight:700}),seg(p,.6,.75),C.x);
  return s;
 },
 [K+'both']:(p)=>{
  let s=hThrow({drop:1,rows:1});
  s+=card(760,90,400,130,label('横',960,140,{size:26,color:C.dim,anchor:'middle'})+label('等速',960,195,{size:36,color:C.x,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(760,250,400,130,label('縦',960,300,{size:26,color:C.dim,anchor:'middle'})+label('落体と 同じ',960,355,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.25,.4));
  s+=fade(seg(p,.6,.75),label('互いに 影響しない',960,430,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 横の速度は変わらない =================
 [K+'arrows']:(p)=>{
  let s=hThrow({va:seg(p,.2,.6),tl:1});
  s+=card(760,140,400,200,label('速度の 矢印',960,195,{size:28,color:C.ink,anchor:'middle'})+label('横向きの 部分',960,250,{size:30,color:VXC,anchor:'middle',weight:700})+label('縦向きの 部分',960,300,{size:30,color:VYC,anchor:'middle',weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'vx']:(p)=>{
  let s=hThrow({va:1,vl:1,vya:.3});
  s+=card(760,160,400,150,label('横の 速度',960,215,{size:28,color:C.dim,anchor:'middle'})+label('ずっと 20 m/s',960,275,{size:34,color:VXC,anchor:'middle',weight:700}),seg(p,.3,.45),VXC);
  return s;
 },
 [K+'vy']:(p)=>{
  let s=hThrow({va:1,vl:1,vxa:.3});
  s+=card(760,160,400,150,label('縦の 速度',960,215,{size:28,color:C.dim,anchor:'middle'})+label('0 → 10 → 20 → 30',960,275,{size:32,color:VYC,anchor:'middle',weight:700}),seg(p,.3,.45),VYC);
  s+=fade(seg(p,.6,.75),label('1秒ごとに ＋10 m/s',960,370,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'why']:(p)=>{
  const {x0,y0,k}=PJ,X=x0+k*20,Y=y0+k*5;
  let s=hThrow({va:1,ghost:.3});
  s+=ball(X,Y)+arrow(X,Y+20,X,Y+110,{color:C.F,w:5,head:16,g:seg(p,.3,.45)})+fade(seg(p,.35,.5),label('重力（下向きだけ）',X,Y+145,{size:24,color:C.F,anchor:'middle',weight:700}));
  s+=card(760,140,400,200,label('横',960,195,{size:26,color:C.dim,anchor:'middle'})+label('速度を 変える 力が ない',960,250,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 横の 速度は 一定',960,305,{size:28,color:VXC,anchor:'middle',weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'later']:(p)=>{
  let s=card(200,90,800,140,label('力と 速度の 関係',600,145,{size:28,color:C.dim,anchor:'middle'})+label('力の 単元で ma ＝ F を 使って 確かめる',600,200,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  s+=card(200,280,800,140,label('この 単元では',600,335,{size:28,color:C.dim,anchor:'middle'})+label('実験事実 として 使う',600,390,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 // ================= S5 水平投射の式 =================
 [K+'name']:(p)=>{
  let s=hThrow({path:1,ghost:.5});
  s+=card(760,160,400,150,label('横に 投げる 運動',960,215,{size:28,color:C.dim,anchor:'middle'})+label('水平投射',960,280,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'xeq']:(p)=>{
  const {x0,y0,k}=PJ;
  let s=hThrow({va:.5,vya:0});
  s+=fade(seg(p,.1,.3),line(x0,y0-36,x0+k*60,y0-36,{color:C.x,w:3})+line(x0+k*60,y0-46,x0+k*60,y0-26,{color:C.x,w:3})+line(x0,y0-46,x0,y0-26,{color:C.x,w:3})+label('x',x0+k*30,y0-50,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=card(760,160,400,170,label('横：等速',960,210,{size:28,color:C.dim,anchor:'middle'})+T1('x=v_0t',960,285,{size:56}),seg(p,.45,.6),C.x);
  return s;
 },
 [K+'yeq']:(p)=>{
  const {x0,y0,k}=PJ;
  let s=hThrow({va:.5,vxa:0,drop:.5});
  s+=fade(seg(p,.1,.3),line(x0-170,y0,x0-170,y0+k*45,{color:C.x,w:3})+line(x0-180,y0,x0-160,y0,{color:C.x,w:3})+line(x0-180,y0+k*45,x0-160,y0+k*45,{color:C.x,w:3})+label('y',x0-190,y0+k*22,{size:28,color:C.x,anchor:'end',weight:700}));
  s+=card(760,160,400,170,label('縦：自由落下（下が正）',960,210,{size:26,color:C.dim,anchor:'middle'})+T1(Yt+'=\\tfrac12'+Gt+'t^2',960,285,{size:52}),seg(p,.45,.6),C.x);
  return s;
 },
 [K+'tie']:(p)=>{
  let s=card(110,90,460,190,label('横',340,140,{size:26,color:C.dim,anchor:'middle'})+T1('x=v_0t',340,220,{size:56}),1,C.x);
  s+=card(630,90,460,190,label('縦',860,140,{size:26,color:C.dim,anchor:'middle'})+T1(Yt+'=\\tfrac12'+Gt+'t^2',860,220,{size:52}),1,C.x);
  s+=fade(seg(p,.05,.2),label('同じ t',600,330,{size:34,color:C.t,anchor:'middle',weight:700})+line(340,290,560,320,{color:C.t,w:2,dash:'5 6'})+line(860,290,640,320,{color:C.t,w:2,dash:'5 6'}));
  s+=fade(seg(p,.45,.6),label('g が ない',340,420,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),label('v₀ が ない',860,420,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'key']:(p)=>{
  let s=card(630,90,460,190,label('縦',860,140,{size:26,color:C.dim,anchor:'middle'})+T1(Yt+'=\\tfrac12'+Gt+'t^2',860,220,{size:52}),1,C.hi);
  s+=fade(.35,card(110,90,460,190,label('横',340,140,{size:26,color:C.dim,anchor:'middle'})+T1('x=v_0t',340,220,{size:56}),1,C.x));
  s+=card(250,330,700,130,label('落ちるまでの 時間 ← 高さ だけで 決まる',600,408,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.5),C.hi);
  return s;
 },
 // ================= S6 届く距離 =================
 [K+'h45']:(p)=>{
  let s=cliff({hl:seg(p,.05,.2)})+ball(CL.x0,CL.y0);
  s+=arrow(CL.x0+16,CL.y0,CL.x0+90,CL.y0,{color:C.v,w:5,head:14,g:seg(p,.25,.4)})+fade(seg(p,.3,.45),label('20 m/s',CL.x0+50,CL.y0-26,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=card(780,160,370,150,label('着地まで',965,215,{size:28,color:C.ink,anchor:'middle'})+label('何秒？',965,275,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'sub']:(p)=>{
  let s=T1(Yt+'=\\tfrac12'+Gt+'t^2',600,80,{size:48});
  s+=fade(seg(p,.05,.2),label('y ＝ 45、g ＝ 10 を 入れる',600,160,{size:28,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.25,.45),T1('45=\\tfrac12\\times 10\\times t^2',600,250,{size:50}));
  s+=card(400,310,400,120,T1('45=5t^2',600,375,{size:54}),seg(p,.6,.75),C.t);
  return s;
 },
 [K+'t3']:(p)=>{
  let s=T1('45=5t^2',600,80,{size:50});
  s+=fade(seg(p,.05,.2),label('両辺を 5 で 割る',900,90,{size:26,color:C.hi}));
  s+=fade(seg(p,.15,.35),T1('t^2=9',600,190,{size:52}));
  s+=fade(seg(p,.5,.6),label('時間は 正',900,200,{size:26,color:C.hi}));
  s+=card(420,260,360,130,T1('t=3\\ \\mathrm{s}',600,330,{size:56}),seg(p,.6,.75),C.t);
  return s;
 },
 [K+'x60']:(p)=>{
  let s=cliff()+cliffPath(20,{p:seg(p,.02,.35),dots:seg(p,.3,.4),tl:seg(p,.3,.4)});
  const gy=CL.y0+CL.k*45+16;
  s+=span(CL.x0,CL.x0+CL.k*60,gy+40,'60 m',{g:seg(p,.5,.65)});
  s+=card(780,140,370,150,tex('x=20\\times 3',965,200,{size:44})+tex('=60\\ \\mathrm{m}',965,260,{size:44,auto:false,color:C.x}),seg(p,.55,.7),C.x);
  return s;
 },
 [K+'v40']:(p)=>{
  let s=cliff({hl:1})+cliffPath(20,{color:'#a9b6f0'})+ball(CL.x0,CL.y0);
  s+=arrow(CL.x0+16,CL.y0,CL.x0+16+150,CL.y0,{color:C.v,w:5,head:14,g:seg(p,.3,.5)})+fade(seg(p,.4,.55),label('40 m/s（2倍）',CL.x0+90,CL.y0-26,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=card(780,160,370,150,label('高さ 45 m は そのまま',965,215,{size:26,color:C.dim,anchor:'middle'})+label('横の 初速度 だけ 2倍',965,270,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'guess2']:(p)=>{
  let s=fade(.35,cliff()+cliffPath(20,{color:'#a9b6f0'}));
  s+=card(300,140,700,200,label('40 m/s では',650,200,{size:30,color:C.ink,anchor:'middle'})+label('時間は？  距離は？',650,275,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'same']:(p)=>{
  let s=cliff()+cliffPath(20,{color:'#a9b6f0',dots:1})+cliffPath(40,{p:seg(p,.05,.45),dots:seg(p,.4,.5)});
  const {x0,y0,k}=CL;
  s+=fade(seg(p,.4,.55),[1,2,3].map(i=>line(x0+k*20*i-20,y0+k*fallY(i),x0+k*40*i+20,y0+k*fallY(i),{color:C.hi,w:2,dash:'5 7'})).join(''));
  s+=card(780,140,370,150,label('どちらも',965,195,{size:28,color:C.dim,anchor:'middle'})+label('3 s で 着地',965,255,{size:38,color:C.t,anchor:'middle',weight:700}),seg(p,.6,.75),C.t);
  return s;
 },
 [K+'x120']:(p)=>{
  let s=cliff()+cliffPath(20,{color:'#a9b6f0',dots:1})+cliffPath(40,{dots:1});
  const gy=CL.y0+CL.k*45+16;
  s+=span(CL.x0,CL.x0+CL.k*60,gy+30,'60 m',{color:'#a9b6f0'});
  s+=span(CL.x0,CL.x0+CL.k*120,gy+90,'120 m',{g:seg(p,.05,.25)});
  s+=card(780,130,370,170,tex('x=40\\times 3',965,190,{size:44})+tex('=120\\ \\mathrm{m}',965,255,{size:44,auto:false,color:C.x}),seg(p,.1,.25),C.x);
  s+=fade(seg(p,.6,.75),label('距離 だけ 2倍',965,355,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'letters']:(p)=>{
  let s=card(130,50,440,270,label('落ちるまでの 時間',350,95,{size:28,color:C.dim,anchor:'middle'})+T1('t=\\sqrt{\\dfrac{2'+Ht+'}{'+Gt+'}}',350,235,{size:50}),seg(p,.02,.2),C.t);
  s+=fade(seg(p,.25,.4),label('（落体の 単元の 式）',350,365,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(630,50,440,270,label('届く 距離',850,95,{size:28,color:C.dim,anchor:'middle'})+T1('x=v_0\\sqrt{\\dfrac{2'+Ht+'}{'+Gt+'}}',850,235,{size:50}),seg(p,.55,.7),C.x);
  s+=fade(seg(p,.7,.85),label('h：高さ',600,430,{size:28,color:C.x,anchor:'middle'}));
  return s;
 },
 // ================= S7 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(150,80,900,130,label('横に 速く 投げても',600,130,{size:28,color:C.dim,anchor:'middle'})+label('落ちるまでの 時間は 延びない',600,185,{size:36,color:C.t,anchor:'middle',weight:700}),seg(p,.05,.2),C.t);
  s+=card(150,260,900,130,label('延びるのは',600,310,{size:28,color:C.dim,anchor:'middle'})+label('届く 距離',600,365,{size:38,color:C.x,anchor:'middle',weight:700}),seg(p,.55,.7),C.x);
  return s;
 },
 [K+'mis']:(p)=>{
  let s=hThrow({drop:1,rows:1});
  s+=card(760,110,400,240,label('横の 運動は',960,170,{size:28,color:C.dim,anchor:'middle'})+label('縦の 落下を',960,230,{size:32,color:C.ink,anchor:'middle',weight:700})+label('遅らせない',960,290,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=card(150,60,900,120,label('放物運動 ＝ 横の 等速 ＋ 縦の 落体',600,135,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.15));
  s+=card(150,220,420,150,label('横',360,270,{size:28,color:C.dim,anchor:'middle'})+T1('x=v_0t',360,330,{size:48}),seg(p,.25,.4),C.x);
  s+=card(630,220,420,150,label('縦',840,270,{size:28,color:C.dim,anchor:'middle'})+T1(Yt+'=\\tfrac12'+Gt+'t^2',840,330,{size:46}),seg(p,.4,.55),C.x);
  s+=fade(seg(p,.6,.75),label('同じ 時刻 t で つなぐ',600,440,{size:32,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  const u=seg(p,.15,.85),X=t=>180+9*20*t,Y=t=>440-9*(15*t-5*t*t);
  let s=ground(100,1000,456);
  s+=fade(seg(p,.02,.15),arrow(180,440,180+4*20,440-4*15,{color:C.v,w:5,head:14})+label('斜め上に 投げる',290,440,{size:26,color:C.v}));
  s+=draw(Array.from({length:41},(_,i)=>{const t=3*i/40*u;return [X(t),Y(t)];}),1,{color:C.hi,w:3,dash:'7 8'})+ball(X(3*u),Y(3*u));
  s+=card(760,90,400,150,label('横と 縦に',960,145,{size:28,color:C.ink,anchor:'middle'})+label('どう 分ける？',960,205,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('斜めの 初速度を 分ける',600,255,{size:46,color:C.hi,anchor:'middle',weight:700})+label('横と 縦に',600,310,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi);
  s+=fade(seg(p,.5,.7),label('放物運動・深く学ぶ 2/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
