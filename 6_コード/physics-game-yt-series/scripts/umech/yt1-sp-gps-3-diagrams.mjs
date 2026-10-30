// 特別編「GPS と相対性理論」パート3/4 (ys-sp-gps-3) — 図。Stage 1200×515.
// 色：c・v 紫、t 金、L 白、光 黄、遅れ 青 #6f9dff（下向き・−）、進み 赤（上向き・＋）、差・強調 黄。
// 共通の部品（地球・衛星・時計）はこのファイルの中で描く（他パートとそろえた見た目）。
// 光時計は v＝0.6c（γ＝1.25）で、実際の時間で光の点を動かす：左（電車の中）1カチッ 2.0 s、右（ホーム）2.5 s。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,clamp,mix,poly,smooth} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {tag} from './yt1-hs-m-energy-1-diagrams.mjs';

const K='sp-gps-3:';
const SLOW='#6f9dff', FAST=C.a, HI=C.hi, LIGHT='#fff3a0', MIR='#b9c3d4';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const cc=cs(C.v,'c');
const T=(src,x,y,o={})=>tex(src,x,y,{size:44,...o});
const U=s=>`\\,\\mathrm{${s}}`;
const sT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
const L22=(s,x,y,o={})=>label(s,x,y,{size:24,color:C.ink,anchor:'middle',...o});
const B=(s,x,y,o={})=>label(s,x,y,{size:28,color:C.ink,anchor:'middle',weight:700,...o});

// ---------------- common parts ----------------
// analog clock with a name plate (地上 / 衛星 / …); ang = hand angle in turns
export function clockFace(x,y,R,{ang=0,name='',col=C.ink,g=1,plate=C.faint}={}){
 let s=ring(x,y,R,{color:col,w:4,fill:'#16223b'});
 for(let i=0;i<12;i++){const a=i*Math.PI/6;s+=line(x+R*.8*Math.sin(a),y-R*.8*Math.cos(a),x+R*.95*Math.sin(a),y-R*.95*Math.cos(a),{color:C.dim,w:i%3?2:4});}
 const a=ang*2*Math.PI;s+=line(x,y,x+R*.72*Math.sin(a),y-R*.72*Math.cos(a),{color:C.t,w:4})+dot(x,y,5,C.t);
 if(name){const w=[...name].length*24+26;s+=rect(x-w/2,y+R+10,w,36,{fill:plate,fo:.9,stroke:col,sw:1.5,rx:8})+label(name,x,y+R+37,{size:24,color:C.ink,anchor:'middle',weight:700});}
 return fade(g,s);
}
// GPS satellite: gold body + blue solar panels
export function satellite(x,y,s=1,{g=1}={}){
 const pw=46*s,ph=22*s,bw=26*s,bh=30*s;
 let q=line(x-bw/2-pw-4*s,y,x+bw/2+pw+4*s,y,{color:C.dim,w:2});
 for(const sg of[-1,1]){const px=sg<0?x-bw/2-pw-6*s:x+bw/2+6*s;q+=rect(px,y-ph/2,pw,ph,{fill:'#3f6fd8',fo:.95,stroke:'#9cc0ff',sw:1.5,rx:2});for(let i=1;i<3;i++)q+=line(px+pw*i/3,y-ph/2,px+pw*i/3,y+ph/2,{color:'#9cc0ff',w:1});}
 q+=rect(x-bw/2,y-bh/2,bw,bh,{fill:'#e0b44a',fo:1,stroke:'#ffe08a',sw:1.5,rx:3});
 return fade(g,q);
}
// Earth seen from above the North Pole: blue disc, lighter land patches turning with angle rot (rad, CCW = east)
const LAND=[[.3,.55,.28],[1.4,.6,.22],[2.3,.45,.3],[3.4,.62,.25],[4.4,.5,.3],[5.4,.6,.2],[.9,.2,.16],[3.9,.25,.15]];
export function earth(x,y,R,{rot=0,g=1,pole=true}={}){
 let s=dot(x,y,R*1.04,'#2b5fbf',.25)+dot(x,y,R,'#2f6fd6');
 for(const [a,r,z] of LAND){const A=a+rot;s+=`<ellipse cx="${(x+R*r*Math.cos(A)).toFixed(1)}" cy="${(y-R*r*Math.sin(A)).toFixed(1)}" rx="${(R*z).toFixed(1)}" ry="${(R*z*.62).toFixed(1)}" transform="rotate(${(-A*180/Math.PI).toFixed(1)} ${(x+R*r*Math.cos(A)).toFixed(1)} ${(y-R*r*Math.sin(A)).toFixed(1)})" fill="#6fa6f2" fill-opacity=".55"/>`;}
 if(pole)s+=dot(x,y,7,'#ffffff')+label('北極',x,y-14,{size:22,color:'#ffffff',anchor:'middle',weight:700});
 return fade(g,s);
}
const P=(x,y,r,th)=>[x+r*Math.cos(th),y-r*Math.sin(th)];
// small airliner pointing along heading deg (screen, 0 = right, CCW positive)
function plane(x,y,deg,{col='#e8eef8',s=1}={}){
 const sh=`<polygon points="-22,-3 16,-3 24,0 16,3 -22,3" fill="${col}"/><polygon points="-2,-2 -12,-20 -5,-20 9,-2" fill="${col}"/><polygon points="-2,2 -12,20 -5,20 9,2" fill="${col}"/><polygon points="-20,-2 -26,-10 -22,-10 -15,-2" fill="${col}"/><polygon points="-20,2 -26,10 -22,10 -15,2" fill="${col}"/>`;
 return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(-deg).toFixed(1)}) scale(${s})">${sh}</g>`;
}
// a curved arrow along a circle from th0 to th1 (rad)
function arcArrow(x,y,r,th0,th1,{color=C.v,w=5,head=16}={}){
 const n=24,pts=[];for(let i=0;i<=n;i++)pts.push(P(x,y,r,mix(th0,th1,i/n)));
 const [ax,ay]=pts[n-4],[bx,by]=pts[n];
 return draw(pts.slice(0,n-3),1,{color,w})+arrow(ax,ay,bx,by,{color,w,head});
}
// slow / fast marks (−: blue down, ＋: red up)
const slowMark=(x,y,len=70,{g=1,text=''}={})=>fade(g,arrow(x,y,x,y+len,{color:SLOW,w:7,head:20})+label('−',x-26,y+len*.5+10,{size:40,color:SLOW,anchor:'middle',weight:700})+(text?label(text,x+22,y+len*.5+10,{size:30,color:SLOW,weight:700}):''));
const fastMark=(x,y,len=70,{g=1,text=''}={})=>fade(g,arrow(x,y,x,y-len,{color:FAST,w:7,head:20})+label('＋',x-28,y-len*.5+10,{size:40,color:FAST,anchor:'middle',weight:700})+(text?label(text,x+22,y-len*.5+10,{size:30,color:FAST,weight:700}):''));
function person(x,y,{col=C.dim,s=1}={}){ // feet at y
 return ring(x,y-58*s,10*s,{color:col,w:3})+line(x,y-48*s,x,y-22*s,{color:col,w:3})+line(x,y-22*s,x-9*s,y,{color:col,w:3})+line(x,y-22*s,x+9*s,y,{color:col,w:3})+line(x-12*s,y-38*s,x+12*s,y-38*s,{color:col,w:3});
}
function train(x,y,w,h,{col='#4a5a78',g=1,win=true,wheels=true}={}){ // body top-left x,y
 let s=rect(x,y,w,h,{fill:col,fo:.35,stroke:'#8fa0bf',sw:2,rx:14});
 if(win)for(let i=0;i<3;i++)s+=rect(x+18+i*(w-36)/3,y+16,(w-36)/3-12,h*.32,{fill:'#9fc2ff',fo:.25,stroke:'#9fc2ff',sw:1,rx:4});
 if(wheels)s+=ring(x+w*.2,y+h+8,10,{color:C.dim,w:3,fill:C.bg})+ring(x+w*.8,y+h+8,10,{color:C.dim,w:3,fill:C.bg});
 return fade(g,s);
}
function heart(x,y,s,{col='#ff7a8f'}={}){
 return `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})" d="M0,0.9 C-1.3,0 -0.7,-1 0,-0.35 C0.7,-1 1.3,0 0,0.9 Z" fill="${col}"/>`;
}

// ---------------- light clock ----------------
const LC={L:180,c:200,beta:.6};const GAM=1/Math.sqrt(1-LC.beta**2); // px, px/s
const tri=u=>u<1?u:2-u; // 0→1→0 over u∈[0,2)
// bare clock: two mirrors (bottom at yb, top at yb-L), centred at x
function mirrors(x,yb,{L=LC.L,w=96,g=1,col=MIR}={}){
 return fade(g,rect(x-w/2,yb,w,9,{fill:col,fo:.9,stroke:col,rx:3})+rect(x-w/2,yb-L-9,w,9,{fill:col,fo:.9,stroke:col,rx:3})
  +line(x-w/2+4,yb,x-w/2+4,yb-L,{color:C.faint,w:2})+line(x+w/2-4,yb,x+w/2-4,yb-L,{color:C.faint,w:2}));
}
const photon=(x,y,g=1)=>fade(g,dot(x,y,16,LIGHT,.25)+dot(x,y,9,LIGHT));
// rest-frame clock at x: photon bouncing; returns {svg, tick count, phase}
function restClock(x,yb,t,{L=LC.L,showTick=true,g=1,trail=true}={}){
 const tau=L/LC.c,u=(t/tau)%2,y=yb-L*tri(u);let s=mirrors(x,yb,{L});
 if(trail)s+=line(x,yb,x,y,{color:HI,w:3,opacity:.5});
 s+=photon(x,y);
 const since=(t%(2*tau));
 if(showTick&&t>2*tau-.05&&since<.45)s+=fade(1-since/.45,label('カチッ',x+62,yb+6,{size:26,color:HI,weight:700}));
 return fade(g,s);
}
// moving clock (platform view): loop over 2 ticks starting at x0
function movingClock(x0,yb,t,{L=LC.L,g=1,trainBox=true,loopTicks=2}={}){
 const tau=L/(LC.c*Math.sqrt(1-LC.beta**2)),vx=LC.beta*LC.c,Pd=2*tau*loopTicks;
 const tt=((t%Pd)+Pd)%Pd,x=x0+vx*tt,u=(tt/tau),y=yb-L*tri(u%2);
 const edge=Math.min(1,tt/.3,(Pd-tt)/.3);
 let s='';
 if(trainBox)s+=rect(x-58,yb-L-32,116,L+60,{fill:'#4a5a78',fo:.18,stroke:'#8fa0bf',sw:2,rx:14});
 // zigzag trail from the loop start
 const pts=[[x0,yb]];const nb=Math.floor(u);for(let i=1;i<=nb;i++)pts.push([x0+vx*tau*i,yb-L*(i%2)]);pts.push([x,y]);
 s+=draw(pts,1,{color:HI,w:3,opacity:.75});
 s+=mirrors(x,yb,{L})+photon(x,y);
 const since=tt%(2*tau);
 if(tt>2*tau-.05&&since<.45)s+=fade(1-since/.45,label('カチッ',x+62,yb+6,{size:26,color:HI,weight:700}));
 s+=arrow(x-36,yb-L-52,x+36,yb-L-52,{color:C.v,w:4,head:14})+label('v',x+48,yb-L-44,{size:28,color:C.v,weight:700});
 return fade(g*edge,s);
}
// split screen frame
const PANEL={l:[20,40,430,410],r:[470,40,710,410]};
function panels({gl=1,gr=1}={}){
 const [a,b,c,d]=PANEL.l,[e,f,h,k]=PANEL.r;
 return fade(gl,rect(a,b,c,d,{fill:'#101a30',fo:.9,stroke:C.faint,rx:14})+B('電車の 中から 見る',a+c/2,b+38,{size:26,color:C.dim}))
  +fade(gr,rect(e,f,h,k,{fill:'#101a30',fo:.9,stroke:C.faint,rx:14})+B('ホームから 見る',e+h/2,f+38,{size:26,color:C.dim})+line(e+10,f+k-24,e+h-10,f+k-24,{color:C.dim,w:3})+person(e+40,f+k-26,{s:.9}));
}
const LX=235,RX0=540,YB=400;
// zigzag drawn completely (2 ticks) from x0
function zigzag(x0,yb,{L=LC.L,ticks=2,g=1,col=HI,w=3}={}){
 const step=LC.beta/Math.sqrt(1-LC.beta**2)*L;const pts=[];for(let i=0;i<=ticks*2;i++)pts.push([x0+step*i,yb-L*(i%2)]);
 return fade(g,draw(pts,1,{color:col,w}));
}
// right triangle: from bottom (x0,yb) to top (x0+b, yb-L)
function triangle(x0,yb,L,{g=1,labels=0,fill=.12,lt=[1,1,1],w=4}={}){
 const b=L*LC.beta/Math.sqrt(1-LC.beta**2),X=x0+b,Y=yb-L;
 let s=poly([[x0,yb],[X,yb],[X,Y]],{fill:HI,fo:fill});
 s+=line(x0,yb,X,Y,{color:HI,w:w+1})+line(x0,yb,X,yb,{color:C.v,w,dash:'10 7'})+line(X,yb,X,Y,{color:C.ink,w});
 s+=draw([[X-18,yb],[X-18,yb-18],[X,yb-18]],1,{color:C.dim,w:2});
 if(labels){
  const ang=Math.atan2(L,b)*180/Math.PI;
  s+=fade(lt[0],T(`${cc}t`,(x0+X)/2-34,(yb+Y)/2-14,{size:46}));
  s+=fade(lt[1],T(`vt`,(x0+X)/2,yb+48,{size:46}));
  s+=fade(lt[2],T(`L`,X+32,(yb+Y)/2+12,{size:46}));
 }
 return fade(g,s);
}

// ---------------- equations ----------------
const t0='t_0';
const EQ={
 pyth:`(${cc}t)^2=L^2+(vt)^2`,
 Ldef:`L=${cc}${t0}`,
 sub:`(${cc}t)^2=(${cc}${t0})^2+(vt)^2`,
 move:`(${cc}t)^2-(vt)^2=(${cc}${t0})^2`,
 fac:`t^2(${cc}^2-v^2)=${cc}^2${t0}^2`,
 div:`t^2=\\dfrac{${cc}^2${t0}^2}{${cc}^2-v^2}`,
 divc:`t^2=\\dfrac{${t0}^2}{1-v^2/${cc}^2}`,
 sqrt:`t=\\dfrac{${t0}}{\\sqrt{1-v^2/${cc}^2}}`,
};
const opTag=(s,x,y,g=1,col=C.dim)=>fade(g,label(s,x,y,{size:24,color:col,anchor:'end',weight:700}));

// ---------------- Earth / airliner scene ----------------
const EX=330,EY=262,ER=150,ORB=192;
const WG=.28,WP=.2; // rad/s: ground, plane relative to ground (display only)
function groundStation(rot,{g=1}={}){
 const th=1.2+rot,[x,y]=P(EX,EY,ER,th);
 return fade(g,dot(x,y,9,'#ffe08a')+ring(x,y,13,{color:'#ffe08a',w:2}));
}

export const spGps3Diagrams={
 // ================= S1 光だけは、足し算できない =================
 [K+'c1']:(p,ctx)=>{
  const t=sT(p,ctx),x=80+((t*260)%1050);
  let s=line(60,300,1140,300,{color:C.faint,w:2,dash:'6 10'});
  s+=line(Math.max(60,x-260),300,x,300,{color:LIGHT,w:6,opacity:.55})+photon(x,300);
  s+=card(330,90,540,130,B('光の 奇妙な 事実',600,170,{size:40,color:HI}),seg(p,.15,.35),HI);
  return s;
 },
 [K+'c2']:(p,ctx)=>{
  const u=seg(p,.05,.95),tx=120+u*120;
  let s=line(40,330,1160,330,{color:C.dim,w:3})+label('ホーム',60,370,{size:24,color:C.dim});
  s+=person(1080,330,{s:1.1});
  s+=train(tx,210,260,110);
  const bx=tx+270+seg(p,.25,.55)*250;
  s+=fade(seg(p,.25,.3),dot(bx,262,14,'#f4f4f4')+ring(bx,262,14,{color:C.dim,w:2}));
  // velocity arrows
  s+=fade(seg(p,.08,.2),arrow(120,130,380,130,{color:C.v,w:6,head:18})+label('電車 100 km/h',250,108,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.42),arrow(380,130,640,130,{color:C.v,w:6,head:18})+label('ボール 100 km/h',510,170,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.62),arrow(120,410,640,410,{color:HI,w:7,head:20})+label('ホームから：約 200 km/h',670,420,{size:30,color:HI,weight:700}));
  s+=card(760,90,380,90,B('100 ＋ 100 ＝ 200',950,148,{size:32,color:C.v}),seg(p,.62,.75),C.v);
  s+=fade(seg(p,.8,.9),B('速さは 足し算',950,220,{size:30,color:HI}));
  return s;
 },
 [K+'c3']:(p,ctx)=>{
  const t=sT(p,ctx);let s='';
  const row=(y,title,dir,g)=>{
   const lx=150+((t*300)%700),ox=dir>0?120+((t*110)%500):900-((t*110)%500);
   let q=label(title,40,y-62,{size:28,color:C.ink,weight:700});
   q+=line(60,y,860,y,{color:C.faint,w:2,dash:'6 10'});
   q+=line(Math.max(60,lx-160),y,lx,y,{color:LIGHT,w:6,opacity:.5})+photon(lx,y);
   q+=person(ox,y+40,{col:C.v,s:.8})+arrow(ox+(dir>0?14:-14),y+8,ox+(dir>0?74:-74),y+8,{color:C.v,w:4,head:12});
   q+=card(890,y-50,280,90,T(`${cc}`,935,y+8,{size:44})+label('秒速 約30万 km',1045,y+8,{size:24,color:C.ink,anchor:'middle',weight:700}),seg(p,.55,.7),C.v);
   return fade(g,q);
  };
  s+=row(170,'光を 追いかけながら 測る',1,seg(p,.12,.25));
  s+=row(380,'光に 向かっていきながら 測る',-1,seg(p,.25,.38));
  s+=fade(seg(p,.02,.12),label('光だけは 違う',1170,40,{size:30,color:HI,anchor:'end',weight:700}));
  return s;
 },
 [K+'c4']:(p)=>{
  let s=tag('実験',600,70,{color:C.ink,size:30,g:seg(p,.02,.12)});
  s+=card(170,120,860,150,B('19世紀の 終わりから、たくさんの 実験',600,180,{size:30})+B('光の 速さは いつも 同じ',600,238,{size:34,color:C.v}),seg(p,.05,.2),C.v);
  s+=card(170,310,860,150,label('大学編：マクスウェル方程式の 最後の 問い',600,370,{size:26,color:C.dim,anchor:'middle'})+B('→ 自然からの 答え',600,428,{size:32,color:HI}),seg(p,.5,.65),HI);
  return s;
 },
 [K+'c5']:(p)=>{
  let s=B('アインシュタインの 決断',600,60,{size:30,color:C.dim});
  s+=card(110,110,450,280,B('変えない',335,175,{size:32,color:C.dim})+T(`${cc}`,335,265,{size:80})+B('光の 速さ',335,350,{size:30,color:C.v}),seg(p,.05,.2),C.v);
  s+=card(640,110,450,280,B('変わって よい',865,175,{size:32,color:C.dim})+T(`t`,865,265,{size:80})+B('時間',865,350,{size:30,color:C.t}),seg(p,.5,.65),C.t);
  s+=fade(seg(p,.5,.65),label('⇒',600,265,{size:56,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S2 光時計 =================
 [K+'c6']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=fade(seg(p,0,.15),mirrors(600,420,{L:300,w:150}));
  s+=fade(seg(p,.05,.2),label('鏡',710,128,{size:26,color:MIR,weight:700})+label('鏡',710,428,{size:26,color:MIR,weight:700}));
  s+=fade(seg(p,.4,.5),restClock(600,420,t,{L:300,showTick:false,trail:true}));
  return s;
 },
 [K+'c7']:(p,ctx)=>{
  const t=sT(p,ctx),tau=300/LC.c,u=(t/tau)%2;
  let s=restClock(600,420,t,{L:300,trail:true});
  s+=arrow(470,400,470,150,{color:C.dim,w:3,head:12})+arrow(440,150,440,400,{color:C.dim,w:3,head:12});
  s+=card(780,170,360,170,B('1往復 ＝',960,235,{size:30,color:C.ink})+B('1カチッ',960,295,{size:40,color:HI}),seg(p,.25,.4),HI);
  s+=fade(seg(p,.6,.75),B('光時計',600,490,{size:32,color:HI}));
  return s;
 },
 [K+'c8']:(p,ctx)=>{
  const t=sT(p,ctx),u=seg(p,.15,.9),x=330+u*480;
  let s=line(40,450,1160,450,{color:C.dim,w:3});
  s+=train(x-150,150,300,270,{win:false});
  s+=restClock(x,390,t,{L:200,showTick:false});
  s+=fade(seg(p,.2,.35),arrow(x+170,140,x+260,140,{color:C.v,w:5,head:16})+label('v',x+272,150,{size:30,color:C.v,weight:700}));
  return s;
 },
 [K+'c9']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=panels({gl:1,gr:.35});
  s+=restClock(LX,YB,t);
  s+=fade(seg(p,.3,.45),B('まっすぐ 上下',LX,495,{size:26,color:HI}));
  s+=fade(.35,B('？',825,260,{size:80,color:C.dim}));
  return s;
 },
 [K+'c10']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=panels();
  s+=restClock(LX,YB,t);
  s+=movingClock(RX0,YB,t,{g:seg(p,.02,.12)});
  s+=fade(seg(p,.55,.7),B('斜めの 線（ジグザグ）',825,500,{size:26,color:HI}));
  s+=fade(.8,B('まっすぐ 上下',LX,500,{size:26,color:HI}));
  return s;
 },
 [K+'c11']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=panels({gl:.4});
  s+=fade(.4,restClock(LX,YB,t));
  // the platform path, frozen: one diagonal vs the straight path
  const x0=RX0,b=LC.beta/Math.sqrt(1-LC.beta**2)*LC.L;
  s+=zigzag(x0,YB,{ticks:2,g:.45});
  s+=fade(seg(p,.05,.2),line(x0,YB,x0+b,YB-LC.L,{color:HI,w:8})+B('斜め',x0+b/2-50,YB-LC.L/2,{size:28,color:HI}));
  s+=fade(seg(p,.3,.45),line(x0+b,YB,x0+b,YB-LC.L,{color:C.ink,w:5,dash:'10 8'})+B('まっすぐ',x0+b+70,YB-LC.L/2+60,{size:28,color:C.ink}));
  s+=fade(seg(p,.55,.7),card(850,110,310,64,B('斜め ＞ まっすぐ',1005,153,{size:30,color:HI}),1,HI));
  return s;
 },
 [K+'c12']:(p)=>{
  let s='';
  const row=(y,title,col,items,g)=>{
   let q=card(40,y,1120,190,B(title,140,y+105,{size:34,color:col}),1,col);
   items.forEach(([a,b,bc],i)=>{const x=[360,640,960][i];q+=label(a,x,y+65,{size:24,color:C.dim,anchor:'middle'})+B(b,x,y+125,{size:30,color:bc});});
   q+=label('→',810,y+125,{size:34,color:C.dim,anchor:'middle',weight:700});
   return fade(g,q);
  };
  s+=row(30,'ボール',C.ink,[['道','長い',C.ink],['速さ','速く 見える',C.v],['時間','変わらない',C.ink]],seg(p,.02,.15));
  s+=row(260,'光',LIGHT,[['道','長い',C.ink],['速さ','誰から 見ても 同じ',C.v],['時間','？',HI]],seg(p,.5,.62));
  return s;
 },
 [K+'c13']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=panels();
  s+=restClock(LX,YB,t);
  s+=movingClock(RX0,YB,t);
  // one tick bars: t0 (2.0 s) vs t (2.5 s), scale 100 px/s
  const k=100,gb=seg(p,.35,.5),gt=seg(p,.5,.65);
  s+=fade(gb,rect(LX-100,468,2*k*seg(p,.35,.5),26,{fill:C.t,fo:.55,stroke:C.t,rx:4})+label('1カチッ',LX-112,490,{size:22,color:C.dim,anchor:'end'})+T(`${t0}`,LX+125,488,{size:34}));
  s+=fade(gt,rect(600,468,2*GAM*k*seg(p,.5,.65),26,{fill:C.t,fo:.55,stroke:C.t,rx:4})+T(`t`,600+2*GAM*k+25,488,{size:34})+B('長い',600+2*GAM*k+90,492,{size:26,color:HI}));
  return s;
 },
 [K+'c14']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=fade(.55,panels())+fade(.55,restClock(LX,YB,t))+fade(.55,movingClock(RX0,YB,t));
  s+=card(170,150,860,210,B('動いている 時計は、ゆっくり 進む',600,235,{size:38,color:HI})+B('時間の 遅れ（特殊相対性理論）',600,305,{size:30,color:C.ink}),seg(p,.3,.45),HI);
  return s;
 },
 [K+'c15']:(p,ctx)=>{
  const t=sT(p,ctx),r=1/GAM;let s='';
  s+=train(60,70,1080,350,{win:false,wheels:false});
  s+=B('ホームから 見た、動く 電車の 中',600,50,{size:26,color:C.dim});
  // light clock (slowed), analog clock (slowed), heart (slowed)
  s+=fade(seg(p,.02,.15),restClock(250,370,t*r,{L:220,showTick:false})+B('光時計',250,460,{size:26}));
  s+=fade(seg(p,.25,.38),clockFace(600,190,90,{ang:t*r/6})+B('ふつうの 時計',600,460,{size:26}));
  const beat=Math.pow(Math.max(0,Math.sin(Math.PI*t*r*1.1)),8);
  s+=fade(seg(p,.38,.5),heart(940,240,70+14*beat)+B('心臓の 鼓動',940,460,{size:26}));
  s+=card(330,315,540,70,B('どれも 同じ 割合で ゆっくり',600,362,{size:30,color:HI}),seg(p,.6,.72),HI);
  return s;
 },
 [K+'c16']:(p,ctx)=>{
  const t=sT(p,ctx);let s='';
  s+=train(60,60,700,330,{win:false,wheels:false});
  s+=B('電車の 中',410,45,{size:24,color:C.dim});
  const bad=seg(p,.12,.3);const rL=mix(1,.8,bad);
  s+=restClock(230,330,t*rL,{L:200,showTick:false})+B('光時計',230,420,{size:26});
  s+=clockFace(560,220,95,{ang:t/6})+B('ふつうの 時計',560,420,{size:26});
  s+=fade(bad,label('もし 光時計 だけ 遅れたら…',410,470,{size:28,color:SLOW,anchor:'middle',weight:700}));
  s+=card(800,70,370,130,B('ずれに 気づく',985,125,{size:28,color:C.ink})+B('「動いている」と 分かる',985,175,{size:26,color:C.a}),seg(p,.3,.42),C.a);
  s+=tag('原理',985,262,{color:C.ink,size:28,g:seg(p,.6,.7)});
  s+=card(800,290,370,160,B('どの 電車の 中でも',985,350,{size:28})+B('物理の 決まりは 同じ',985,405,{size:30,color:HI}),seg(p,.6,.72),HI);
  return s;
 },
 // ================= S3 三平方の定理で、遅れを計算する =================
 [K+'c17']:(p,ctx)=>{
  let s=B('ホームから 見た 光の 道',600,40,{size:26,color:C.dim});
  s+=line(80,445,1120,445,{color:C.dim,w:3});
  const x0=180,step=LC.beta/Math.sqrt(1-LC.beta**2)*LC.L;
  for(let i=0;i<=4;i++)s+=mirrors(x0+step*i,420,{g:.35});
  s+=zigzag(x0,420,{ticks:2});
  s+=triangle(x0,420,LC.L,{g:seg(p,.35,.55),fill:.22});
  s+=card(820,90,330,100,B('三平方の 定理',985,152,{size:32,color:HI}),seg(p,.5,.65),HI);
  s+=fade(seg(p,.65,.8),T(`a^2+b^2=${cs(HI,'h')}^2`,985,250,{size:40,auto:false}));
  return s;
 },
 [K+'c18']:(p,ctx)=>{
  const u=seg(p,0,.18),x0=mix(180,110,u),yb=mix(420,445,u),L=mix(LC.L,330,u);
  let s=fade(1-u,line(80,445,1120,445,{color:C.dim,w:3})+zigzag(180,420,{ticks:2,g:.6}));
  const b=L*.75;
  s+=fade(.5,mirrors(x0,yb,{L,w:80})); s+=mirrors(x0+b,yb,{L,w:80,g:.9});
  s+=fade(seg(p,.12,.2),label('はじめ',x0,yb+40,{size:22,color:C.dim,anchor:'middle'})+label('上に 着いた とき',x0+b+20,yb-L-26,{size:22,color:C.dim,anchor:'middle'}));
  s+=triangle(x0,yb,L,{labels:1,lt:[seg(p,.3,.42),seg(p,.55,.65),seg(p,.75,.85)],fill:.16});
  // legend on the right
  const row=(y,src,txt,g)=>fade(g,T(src,650,y,{size:44})+label(txt,720,y+8,{size:28,color:C.ink,weight:700}));
  s+=row(140,`${cc}t`,'斜めの 長さ（光が 進んだ）',seg(p,.3,.42));
  s+=row(250,`vt`,'横に 進んだ 距離',seg(p,.55,.65));
  s+=row(360,`L`,'鏡の 間の 距離',seg(p,.75,.85));
  s+=fade(seg(p,.1,.25),T(`t`,650,60,{size:34})+label('：上の 鏡に 着くまでの 時間（ホームで 測る）',680,68,{size:24,color:C.dim}));
  return s;
 },
 [K+'c19']:(p)=>{
  let s=triangle(110,445,330,{labels:1,fill:.16});
  s+=fade(.5,mirrors(110,445,{L:330,w:80})+mirrors(357.5,445,{L:330,w:80}));
  s+=card(520,150,640,160,T(EQ.pyth,840,250,{size:56}),seg(p,.1,.3),HI);
  s+=fade(seg(p,.5,.7),label('斜辺² ＝ 縦² ＋ 横²',840,370,{size:28,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c20']:(p)=>{
  let s=fade(.6,triangle(110,445,330,{labels:1,fill:.12}));
  const g1=seg(p,.05,.2),g2=seg(p,.45,.6),gs=seg(p,.7,.85);
  s+=fade(g1,card(520,40,640,120,label('電車の 中では まっすぐ 上る',840,82,{size:24,color:C.dim,anchor:'middle'})+T(EQ.Ldef,840,138,{size:46}),1,C.ink));
  s+=fade(g1,line(450,445,450,115,{color:C.ink,w:4,dash:'8 6'})+T(`${cc}${t0}`,480,290,{size:36,anchor:'start'}));
  s+=fade((1-gs)*(1-g2),T(EQ.pyth,840,270,{size:52}));
  s+=fade(g2*(1-gs),T(`(${cc}t)^2=${cs(HI,'\\boxed{L^2}')}+(vt)^2`,840,270,{size:52}));
  s+=fade(gs,T(EQ.sub,840,270,{size:52}));
  s+=fade(gs,label('L に ct₀ を 代入',840,370,{size:28,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c21']:(p)=>{
  const g1=seg(p,.12,.3),g2=seg(p,.5,.68);
  const hb=seg(p,.02,.12);
  let s=fade(1-hb,T(EQ.sub,700,90,{size:46}))+fade(hb,T(`(${cc}t)^2=(${cc}${t0})^2+${cs(HI,'\\boxed{(vt)^2}')}`,700,90,{size:46,opacity:mix(1,.6,g1)}));
  // the boxed term sits at the right end of the row; its new place is the second term of the next row
  const w0=texWidth(EQ.sub,46),w1=texWidth(EQ.move,46),xa=700+w0/2-50,xb=700-w1/2+texWidth(`(${cc}t)^2-`,46)+30;
  s+=fade(g1,arrow(xa,128,xb,200,{color:HI,w:3,head:12}));
  s+=opTag('(vt)² を 左へ',300,250,g1,HI)+fade(g1,T(EQ.move,700,245,{size:46}));
  s+=opTag('t² で くくる',300,395,g2,HI)+fade(g2,card(380,330,640,120,T(EQ.fac,700,400,{size:52}),1,HI));
  return s;
 },
 [K+'c22']:(p)=>{
  const g1=seg(p,.1,.25),g2=seg(p,.35,.5),g3=seg(p,.58,.72);
  let s=T(EQ.fac,700,58,{size:38,opacity:.6});
  s+=opTag('両辺 ÷ (c² − v²)',360,170,g1,HI)+fade(g1,T(EQ.div,700,165,{size:40}));
  s+=opTag('分子・分母 ÷ c²',360,290,g2,C.dim)+fade(g2,T(EQ.divc,700,285,{size:40}));
  s+=opTag('平方根',360,420,g3,HI)+fade(g3,card(420,335,560,165,T(EQ.sqrt,700,428,{size:46}),1,HI));
  return s;
 },
 [K+'c23']:(p)=>{
  let s=T(EQ.sqrt,600,60,{size:38,opacity:.6});
  s+=fade(seg(p,.05,.2),label('v が c より ずっと 小さい とき',600,138,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.3),T(`\\dfrac{t}{${t0}}=\\dfrac{1}{\\sqrt{1-v^2/${cc}^2}}\\approx1+\\dfrac{v^2}{2${cc}^2}`,600,245,{size:40}));
  s+=fade(seg(p,.4,.55),label('遅れの 割合',300,390,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),card(440,325,560,130,T(`\\dfrac{t-${t0}}{${t0}}${cs(HI,'\\approx')}\\dfrac{v^2}{2${cc}^2}`,720,400,{size:46}),1,HI));
  s+=tag('近似',1090,395,{color:HI,size:28,g:seg(p,.7,.82)});
  return s;
 },
 [K+'c24']:(p)=>{
  const g1=seg(p,.05,.18),g2=seg(p,.45,.58),g3=seg(p,.6,.72),g4=seg(p,.75,.88);
  let s=fade(.6,T(`\\dfrac{v^2}{2${cc}^2}=\\dfrac{1}{2}\\left(\\dfrac{v}{${cc}}\\right)^2`,600,60,{size:36}));
  s+=fade(g1,T(`v=3.87${U('km/s')}`,330,165,{size:40})+T(`${cc}=3.0\\times10^{5}${U('km/s')}`,830,165,{size:40}));
  s+=opTag('÷ c',250,265,g2,C.dim)+fade(g2,T(`\\dfrac{v}{${cc}}=\\dfrac{3.87}{3.0\\times10^{5}}\\approx1.29\\times10^{-5}`,640,260,{size:38}));
  s+=opTag('2乗',250,355,g3,C.dim)+fade(g3,T(`(1.29\\times10^{-5})^2\\approx1.66\\times10^{-10}`,640,350,{size:38}));
  s+=opTag('÷ 2',250,455,g4,HI)+fade(g4,card(330,405,620,90,T(`\\approx8.3\\times10^{-11}`,640,462,{size:46}),1,HI));
  return s;
 },
 [K+'c25']:(p)=>{
  const g1=seg(p,.03,.18),g2=seg(p,.3,.45),g3=seg(p,.65,.8);
  let s=fade(g1,card(330,40,540,90,B('1日 ＝',520,112,{size:36,color:C.t})+T(`86400${U('s')}`,650,100,{size:40}),1,C.t));
  s+=fade(g2,T(`8.3\\times10^{-11}\\times86400${U('s')}\\approx7.2\\times10^{-6}${U('s')}`,600,230,{size:44}));
  s+=fade(g3,card(300,300,600,130,T(`\\approx7${U('\\mu s')}`,520,385,{size:60})+B('1日 あたり',780,382,{size:32,color:C.t}),1,HI));
  return s;
 },
 [K+'c26']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=earth(170,520,230,{pole:false,rot:t*.03});
  s+=satellite(250,90,1.1);
  s+=fade(seg(p,.05,.15),arrow(330,90,420,90,{color:C.v,w:4,head:14})+label('3.87 km/s',430,98,{size:24,color:C.v,weight:700}));
  s+=clockFace(560,190,80,{ang:t/8,name:'地上'});
  s+=clockFace(800,190,80,{ang:t/8-.05*seg(p,.25,.5),name:'衛星',col:SLOW});
  s+=slowMark(930,140,90,{g:seg(p,.35,.5),text:'7 μs/日'});
  // tug of war preview
  s+=fade(seg(p,.6,.75),card(470,370,700,120,B('速さ：',560,440,{size:30,color:C.ink})+B('−7 μs/日',690,442,{size:32,color:SLOW})+line(800,395,800,465,{color:C.faint,w:2})+B('高さ：',880,440,{size:30,color:C.ink})+B('？',990,442,{size:40,color:FAST}),1,C.faint));
  return s;
 },
 // ================= S4 旅客機に、原子時計を乗せた =================
 [K+'c27']:(p)=>{
  let s=card(300,70,600,160,B('1971年',600,140,{size:48,color:C.t})+label('二人の 科学者が 確かめた',600,200,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.55),C.t);
  s+=fade(seg(p,.02,.15),B('本当に 起きるのか？',600,330,{size:40,color:HI}));
  s+=tag('実験',600,430,{color:C.ink,size:28,g:seg(p,.5,.65)});
  return s;
 },
 [K+'c28']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=earth(EX,EY,ER)+ring(EX,EY,ORB,{color:C.faint,w:2,dash:'6 8'});
  s+=label('北極の 上から 見た 地球',EX,30,{size:24,color:C.dim,anchor:'middle'});
  const ge=seg(p,.05,.2),gw=seg(p,.15,.3);
  const te=.9+t*.35,tw=2.2-t*.35;
  const [ex,ey]=P(EX,EY,ORB,te),[wx,wy]=P(EX,EY,ORB,tw);
  s+=fade(ge,plane(ex,ey,(te*180/Math.PI)+90,{col:'#ffd27a'}));
  s+=fade(gw,plane(wx,wy,(tw*180/Math.PI)-90,{col:'#9fe0ff'}));
  s+=fade(seg(p,.6,.72),arcArrow(EX,EY,ORB+34,-.5,.4,{color:'#ffd27a'})+label('東回り',EX+ORB+20,EY+110,{size:26,color:'#ffd27a',weight:700}));
  s+=fade(seg(p,.7,.82),arcArrow(EX,EY,ORB+34,3.6,2.7,{color:'#9fe0ff'})+label('西回り',EX-ORB-110,EY+110,{size:26,color:'#9fe0ff',weight:700}));
  s+=card(640,90,520,190,B('セシウム原子時計 4台',900,150,{size:30,color:C.t})+[0,1,2,3].map(i=>clockFace(735+i*110,220,32,{ang:t/8})).join(''),seg(p,.1,.25),C.t);
  s+=card(640,320,520,110,B('ふつうの 旅客機で 一周',900,388,{size:30}),seg(p,.3,.45),C.faint);
  return s;
 },
 [K+'c29']:(p,ctx)=>{
  const t=sT(p,ctx);let s='';
  s+=clockFace(200,200,85,{ang:t/8,name:'地上'});
  s+=clockFace(560,200,85,{ang:t/8-.03*seg(p,.2,.4),name:'東回り',col:SLOW});
  s+=clockFace(920,200,85,{ang:t/8+.06*seg(p,.5,.7),name:'西回り',col:FAST});
  s+=fade(seg(p,.05,.15),label('基準',200,80,{size:24,color:C.dim,anchor:'middle'}));
  s+=slowMark(560,360,70,{g:seg(p,.25,.4)})+fade(seg(p,.25,.4),B('約 59 ns 遅れ',560,480,{size:30,color:SLOW}));
  s+=fastMark(920,430,70,{g:seg(p,.55,.7)})+fade(seg(p,.55,.7),B('約 273 ns 進み',920,480,{size:30,color:FAST}));
  s+=fade(seg(p,.8,.9),label('ns ＝ ナノ秒 ＝ 10⁻⁹ 秒',1180,40,{size:22,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'c30']:(p,ctx)=>{
  const t=sT(p,ctx),rot=t*WG;
  let s=earth(EX,EY,ER,{rot});
  s+=label('北極の 上から 見た 地球（中心から 見る）',EX+40,30,{size:24,color:C.dim,anchor:'middle'});
  s+=groundStation(rot);
  const th=1.2+rot,[gx,gy]=P(EX,EY,ER,th);
  const [ax,ay]=P(EX,EY,ER+18,th),dx=-Math.sin(th),dy=-Math.cos(th);
  s+=fade(seg(p,.4,.55),arrow(ax,ay,ax+dx*90,ay+dy*90,{color:C.v,w:6,head:18}));
  s+=fade(seg(p,.4,.55),arcArrow(EX,EY,ER+45,-.9,.0,{color:C.v,w:4,head:14}));
  s+=card(640,110,520,130,B('なぜ 向きで 逆に？',900,190,{size:36,color:HI}),seg(p,.02,.15),HI);
  s+=card(640,290,520,130,B('地面 そのものが',900,345,{size:28})+B('東へ 動いている',900,395,{size:32,color:C.v}),seg(p,.5,.62),C.v);
  return s;
 },
 [K+'c31']:(p,ctx)=>{
  const t=sT(p,ctx),rot=t*WG;
  let s=earth(EX,EY,ER,{rot})+ring(EX,EY,ORB,{color:C.faint,w:2,dash:'6 8'});
  s+=groundStation(rot);
  const te=.6+t*(WG+WP),tw=2.4+t*(WG-WP*.8);
  const [ex,ey]=P(EX,EY,ORB,te),[wx,wy]=P(EX,EY,ORB,tw);
  const tang=(th,len,col,g)=>{const [x,y]=P(EX,EY,ORB,th);return fade(g,arrow(x,y,x-Math.sin(th)*len,y-Math.cos(th)*len,{color:col,w:5,head:14}));};
  s+=plane(ex,ey,te*180/Math.PI+90,{col:'#ffd27a'})+plane(wx,wy,tw*180/Math.PI-90,{col:'#9fe0ff'});
  s+=tang(te,(WG+WP)*260,C.v,seg(p,.05,.15))+tang(tw,(WG-WP*.8)*260,C.v,seg(p,.5,.6));
  // speed bars as seen from the centre
  const bx=640,bar=(y,lab,col,v,g)=>fade(g,label(lab,bx,y+8,{size:26,color:col,weight:700})+rect(bx+110,y-14,v*500,28,{fill:C.v,fo:.6,stroke:C.v,rx:4}));
  s+=label('地球の 中心から 見た 速さ',870,70,{size:24,color:C.dim,anchor:'middle'});
  s+=bar(130,'東回り','#ffd27a',WG+WP,seg(p,.05,.15));
  s+=bar(200,'地上','#ffe08a',WG,seg(p,.0,.1));
  s+=bar(270,'西回り','#9fe0ff',WG-WP*.8,seg(p,.5,.6));
  s+=fade(seg(p,.2,.32),arrow(1060,108,1060,152,{color:SLOW,w:6,head:16})+label('遅れる',1082,140,{size:24,color:SLOW,weight:700}));
  s+=fade(seg(p,.05,.15),label('基準',1055,208,{size:24,color:C.dim,weight:700}));
  s+=fade(seg(p,.68,.8),arrow(1060,292,1060,248,{color:FAST,w:6,head:16})+label('進む',1082,280,{size:24,color:FAST,weight:700}));
  s+=fade(seg(p,.68,.8),B('地上より 遅い → 相対的に 進む',880,380,{size:28,color:FAST}));
  return s;
 },
 [K+'c32']:(p)=>{
  // stacked effect arrows (lengths ∝ predicted parts; no numbers): east speed −184, height +144; west speed +96, height +179 (ns)
  const k=.6,base=255;let s=line(120,base,1180,base,{color:C.dim,w:2,dash:'8 6'})+label('地上の 時計',1180,base-12,{size:22,color:C.dim,anchor:'end'});
  const col=(x,name,nc,sp,ht,gs,gh)=>{
   let q=B(name,x,40,{size:30,color:nc});
   const y1=base-sp*k;
   q+=fade(gs,arrow(x-50,base,x-50,y1,{color:sp<0?SLOW:FAST,w:8,head:20})+label('速さ',x-70,sp<0?base+28:base-12,{size:24,color:sp<0?SLOW:FAST,anchor:'end',weight:700}));
   const y2=y1-ht*k;
   q+=fade(gh,arrow(x+50,y1,x+50,y2,{color:FAST,w:8,head:20})+label('高さ ＋',x+70,y1-ht*k*.5+8,{size:26,color:FAST,weight:700})+line(x-50,y1,x+50,y1,{color:C.faint,w:2,dash:'4 4'}));
   q+=fade(seg(p,.4,.5),line(x+30,y2,x+150,y2,{color:HI,w:4})+label('合計',x+160,y2+8,{size:24,color:HI,weight:700}));
   return q;
  };
  s+=col(330,'東回り','#ffd27a',-184,144,seg(p,.02,.15),seg(p,.15,.35));
  s+=col(780,'西回り','#9fe0ff',96,179,seg(p,.02,.15),seg(p,.15,.35));
  s+=card(250,420,700,80,B('「高さ」の 効果：もう 一つの 主役',600,470,{size:30,color:FAST}),seg(p,.6,.72),FAST);
  return s;
 },
 [K+'c33']:(p)=>{
  const y0=300,k=.62,Y=v=>y0-v*k;let s='';
  s+=line(140,Y(0),1060,Y(0),{color:C.dim,w:2})+label('0',125,Y(0)+8,{size:22,color:C.dim,anchor:'end'});
  for(const v of[-100,100,200,300])s+=line(140,Y(v),1060,Y(v),{color:C.grid,w:1})+label(String(v),125,Y(v)+8,{size:22,color:C.dim,anchor:'end'});
  s+=label('ns',125,Y(300)-28,{size:22,color:C.dim,anchor:'end'});
  const pt=(x,v,e,col,g,txt,side)=>fade(g,line(x,Y(v-e),x,Y(v+e),{color:col,w:4})+line(x-14,Y(v-e),x+14,Y(v-e),{color:col,w:3})+line(x-14,Y(v+e),x+14,Y(v+e),{color:col,w:3})+dot(x,Y(v),10,col)
   +label(txt,x+side*24,Y(v)+8,{size:24,color:col,weight:700,anchor:side<0?'end':'start'}));
  s+=B('東回り',400,430,{size:28,color:'#ffd27a'})+B('西回り',820,430,{size:28,color:'#9fe0ff'});
  s+=pt(370,-59,10,C.ink,seg(p,.05,.2),'測定 −59±10',-1);
  s+=pt(790,273,7,C.ink,seg(p,.05,.2),'測定 ＋273±7',-1);
  s+=pt(440,-40,23,HI,seg(p,.3,.45),'予言 −40±23',1);
  s+=pt(860,275,21,HI,seg(p,.3,.45),'予言 ＋275±21',1);
  s+=tag('実験',600,40,{color:C.ink,size:26,g:seg(p,.02,.12)});
  s+=card(400,455,400,54,B('誤差の 範囲で 一致',600,492,{size:30,color:HI}),seg(p,.55,.7),HI);
  return s;
 },
 [K+'c34']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=earth(220,560,260,{pole:false,rot:t*.03});
  s+=satellite(230,110,1.1)+fastMark(380,150,80,{g:seg(p,.5,.65)});
  s+=card(480,60,680,120,B('速さの 話：重力は 一度も 出てこない',820,132,{size:30,color:C.ink}),seg(p,.02,.15),C.faint);
  s+=card(480,230,680,190,B('では、高い 所の 時計は',820,300,{size:32,color:C.ink})+B('なぜ 速く 進む？',820,370,{size:42,color:FAST}),seg(p,.45,.6),FAST);
  return s;
 },
};
