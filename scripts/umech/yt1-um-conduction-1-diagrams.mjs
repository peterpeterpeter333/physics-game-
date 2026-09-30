// YouTube シリーズ「電流・中級 1/2」(ys-um-conduction-1) — 図。Stage 1200×515.
// 導線は横向きの管。電場 𝐄 は右向き、電子（青い点）は左へずれる（ドリフト）、電流 I は右向き。
// Δt の間に断面を通る電子は、断面の右側（電子が来る側）の長さ vΔt の円柱の中の電子。印（黄の輪）を付けて通り抜けを見せる。
// 部品（関数）は export して 2/2 でも使う（関数の export は図の登録に入らない）。
// 色：電流 I 緑、電荷 ΔQ・e 桃、電子 青、陽イオン 赤、電場 𝐄 水色、ドリフト速度 v 紫、時間 Δt・断面積 S 金、n 白、強調 黄。
import {C,clamp,mix,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,brace,poly} from './anim.mjs';

const K='um-conduction-1:';
export const NEG='#7fb3ff',POS=C.a,EC=C.x,QC=C.p,IC=C.F,VEL=C.v,TC=C.t,SC=C.t,NC=C.ink;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
export const U=s=>`\\,\\mathrm{${s}}`;
// TeX pieces
export const It=cs(IC,'I'),et=cs(QC,'e'),nt=cs(NC,'n'),St=cs(SC,'S'),vt=cs(VEL,'v'),Dt=cs(TC,'\\Delta t'),DQ=cs(QC,'\\Delta Q'),vE=cs(EC,'\\mathbf{E}');
export const ENSV=`${et}${nt}${St}${vt}`;
// strike line colour c over content that keeps its own colour; c=BG gives the same layout without a visible line
export const BG='#131f38';
export const xout=(c,inner)=>`{\\color{${c}}\\cancel{${inner}}}`;
const xDt=c=>xout(c,Dt);
const R=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};

// ---- the wire (a horizontal tube) ---------------------------------------------------------------------
export const W={x1:60,x2:700,y:255,h:95,gx:330,lc:180};
export function tube({x1=W.x1,x2=W.x2,y=W.y,h=W.h,g=1}={}){
 return fade(g,rect(x1,y-h,x2-x1,2*h,{fill:'#8795ad',fo:.14,stroke:C.dim,sw:2.5,rx:22}));
}
export function section({x=W.gx,y=W.y,h=W.h,g=1,text='断面',color=C.hi}={}){
 return fade(g,`<ellipse cx="${x}" cy="${y}" rx="${Math.round(h*.28)}" ry="${h}" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-width="3"/>`
  +(text?L(text,x,y-h-16,{size:24,color,weight:700}):''));
}
// electrons: deterministic, roughly uniform. shift = drift to the LEFT in px; jig = amount of random fast motion; tau = its time
export function electronsIn({x1=W.x1,x2=W.x2,y=W.y,h=W.h,n=40,shift=0,jig=0,tau=0,seed=0,r=8,tag=null,g=1}={}){
 let s='';const w=x2-x1-24;
 for(let i=0;i<n;i++){
  const bx=x1+12+(i+.15+.7*R(i+seed))*w/n,by=y-h+16+R(i+seed+500)*(2*h-32);
  let x=bx-shift;x=x1+12+(((x-x1-12)%w)+w)%w;
  let yy=by;
  if(jig>0){const a=R(i+seed+900)*6.28,f=5+4*R(i+seed+1300);x+=jig*26*Math.sin(f*tau+a);yy+=jig*18*Math.sin(1.3*f*tau+2*a);yy=clamp(yy,y-h+10,y+h-10);x=clamp(x,x1+10,x2-10);}
  const tg=tag&&tag(bx,by);
  s+=dot(x,yy,r,NEG)+(tg?ring(x,yy,r+5,{color:C.hi,w:3}):'');
 }
 return fade(g,s);
}
// fixed positive ions (lattice)
export function ions({x1=W.x1,x2=W.x2,y=W.y,h=W.h,g=1}={}){
 let s='';for(let x=x1+40;x<x2-20;x+=64)for(let k=-1;k<=1;k++){const yy=y+k*h*.62,xx=x+(k===0?32:0);if(xx>x2-20)continue;
  s+=ring(xx,yy,11,{color:POS,w:2,fill:'#3a1d2a'})+label('+',xx,yy+7,{size:22,color:POS,anchor:'middle',weight:700});}
 return fade(g*.55,s);
}
export const eArrow=(g=1,x=W.x1+60,y=W.y-W.h-40,len=200)=>fade(g,arrow(x,y,x+len,y,{color:EC,w:5,head:16})+T(vE,x+len+30,y+10,{size:32}));
export const vArrow=(g=1,x=W.x2-60,y=W.y+W.h+42,len=160,text='ドリフト速度')=>fade(g,arrow(x,y,x-len,y,{color:VEL,w:5,head:16})+T(vt,x-len-26,y+10,{size:32})+(text?label(text,x+10,y+9,{size:24,color:VEL}):''));
export const iArrow=(g=1,x=W.x1+60,y=W.y+W.h+42,len=200)=>fade(g,arrow(x,y,x+len,y,{color:IC,w:6,head:16})+label('電流',x+len+18,y+9,{size:26,color:IC,weight:700})+T(It,x+len+90,y+10,{size:32}));
// cylinder to the right of the section (length lc)
export function cylinder({x=W.gx,y=W.y,h=W.h,lc=W.lc,g=1,labels=1}={}){
 const rx=Math.round(h*.28);
 let s=rect(x,y-h,lc,2*h,{fill:C.hi,fo:.10,stroke:'none',sw:0,rx:0});
 s+=line(x,y-h,x+lc,y-h,{color:C.hi,w:3})+line(x,y+h,x+lc,y+h,{color:C.hi,w:3});
 s+=`<ellipse cx="${x+lc}" cy="${y}" rx="${rx}" ry="${h}" fill="none" stroke="${C.hi}" stroke-width="3" stroke-dasharray="8 6"/>`;
 s+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${h}" fill="${SC}" fill-opacity=".22" stroke="${SC}" stroke-width="3"/>`;
 if(labels)s+=T(St,x-rx-24,y+12,{size:36})+fade(1,line(x,y-h-26,x+lc,y-h-26,{color:C.ink,w:3})+line(x,y-h-36,x,y-h-16,{color:C.ink,w:3})+line(x+lc,y-h-36,x+lc,y-h-16,{color:C.ink,w:3})
  +T(`${vt}${Dt}`,x+lc/2,y-h-44,{size:32}));
 return fade(g,s);
}
export const inCyl=(bx)=>bx>W.gx+2&&bx<W.gx+W.lc-2;
const E3=eArrow(1,W.x1+10,W.y-W.h-40,150);
const legend=(x,y,g=1)=>fade(g,dot(x,y-8,8,NEG)+label('電子（電荷 −e）',x+18,y,{size:24,color:NEG}));
const RX=760,RW=400,RCX=RX+RW/2;
const rcard=(y,h,inner,g=1,stroke=C.faint)=>card(RX,y,RW,h,inner,g,stroke);

// ---- simple circuit: battery, long wires, bulb ----------------------------------------------------------
export function bulb(x,y,on=0){
 let s='';
 if(on>0)s+=fade(on,`<circle cx="${x}" cy="${y}" r="58" fill="${C.hi}" fill-opacity=".22"/>`);
 s+=ring(x,y,30,{color:on>.5?C.hi:C.dim,w:3,fill:on>.5?'#4a4020':'#172238'});
 s+=draw([[x-14,y+10],[x-8,y-8],[x,y+6],[x+8,y-8],[x+14,y+10]],1,{color:on>.5?C.hi:C.dim,w:2.5});
 return s;
}
export function battery(x,y,{g=1,vert=true,label:lb='電池'}={}){
 // vertical wire through (x,y): long plate (+) on top, short thick plate (−) below
 let s=line(x-30,y-8,x+30,y-8,{color:C.ink,w:5})+line(x-16,y+10,x+16,y+10,{color:C.ink,w:10});
 s+=label('＋',x+40,y-4,{size:24,color:POS,weight:700})+label('−',x+40,y+26,{size:26,color:NEG,weight:700});
 if(lb)s+=label(lb,x-44,y+12,{size:24,color:C.dim,anchor:'end'});
 return fade(g,s);
}

export const ytUmConduction1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recall']:(p)=>{
  let s=card(70,80,430,300,L('前回の結果',285,128,{size:24,color:C.dim})
   +T(`${cs(C.hi,'C')}=\\dfrac{\\varepsilon_0${St}}{d}`,285,250,{size:60})+L('コンデンサの 容量',285,345,{size:26,color:C.hi,weight:700}),seg(p,0,.2),C.hi);
  const o={x1:580,x2:1140,y:230,h:60};
  s+=fade(seg(p,.35,.55),tube(o)+electronsIn({...o,n:20,shift:120*p,r:7})
   +L('電荷を運んだのは',860,360,{size:26})+L('導線の中の 電子',860,405,{size:30,color:NEG,weight:700}));
  return s;
 },
 [K+'lastq']:(p)=>{
  let s=tube()+electronsIn({shift:90*p});
  s+=rcard(100,300,L('最後の問い',RCX,148,{size:24,color:C.dim})
   +T(`${It}=\\;?`,RCX,235,{size:58})
   +fade(seg(p,.35,.55),L('電子の 数 と 速さ から',RCX,330,{size:28,color:C.hi,weight:700})),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'recallI']:(p)=>{
  let s=tube()+electronsIn({shift:90*p})+section({g:seg(p,.05,.25)});
  s+=rcard(90,320,L('初級：電流の定義',RCX,138,{size:26,color:IC,weight:700})
   +T(`${It}=\\dfrac{${DQ}}{${Dt}}`,RCX,250,{size:60})
   +fade(seg(p,.45,.65),L('1秒あたりに',RCX,345,{size:26})+L('断面を通る電荷',RCX,385,{size:26,color:QC,weight:700})),seg(p,.1,.3),IC);
  return s;
 },
 [K+'promise']:(p)=>{
  const a={x1:60,x2:640,y:140,h:50},b={x1:60,x2:640,y:370,h:50};
  let s=tube(a)+electronsIn({...a,n:9,shift:110*p,r:8,seed:3})+tube(b)+electronsIn({...b,n:18,shift:110*p,r:8,seed:7});
  s+=section({...a,x:350,text:''})+section({...b,x:350,text:''});
  s+=L('同じ速さ',350,245,{size:26,color:VEL,weight:700,opacity:1});
  s+=fade(seg(p,.1,.3),label('並ぶ電荷',680,150,{size:26,color:C.dim})+label('並ぶ電荷 ×2',680,380,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.3,.5),label('→ 電流 ×2',900,380,{size:30,color:IC,weight:700}));
  s+=fade(seg(p,.62,.8),card(800,110,360,180,L('今回',980,160,{size:24,color:C.dim})+L('これを 式にする',980,230,{size:32,color:C.hi,weight:700}),1,C.hi));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=tube()+electronsIn({shift:90*p});
  s+=rcard(90,320,L('今回の問い',RCX,140,{size:24,color:C.dim})
   +L('電子の 数',RCX-90,205,{size:28,color:NEG,weight:700})+L('速さ',RCX+110,205,{size:28,color:VEL,weight:700})
   +L('↓',RCX,262,{size:34,color:C.dim})+T(`${It}=\\;?`,RCX,345,{size:56}),seg(p,.05,.25),C.hi);
  return s;
 },
 // ===== S2 導線の中の電子 =====
 [K+'zoom']:(p)=>{
  let s=tube()+ions({g:seg(p,.3,.5)})+electronsIn({jig:seg(p,.0,.2),tau:8*p});
  s+=rcard(90,320,L('銅の導線の中',RCX,140,{size:26,color:C.dim})
   +fade(seg(p,.3,.5),dot(RX+60,212,11,POS)+label('陽イオン（ほぼ動かない）',RX+84,221,{size:24,color:POS}))
   +fade(seg(p,.55,.75),dot(RX+60,282,9,NEG)+label('自由電子',RX+84,291,{size:28,color:NEG,weight:700})+L('動き回れる電子',RCX,360,{size:26})),seg(p,0,.2));
  return s;
 },
 [K+'random']:(p)=>{
  let s=tube()+ions()+electronsIn({jig:1,tau:8+10*p});
  s+=rcard(90,320,L('電流なし',RCX,140,{size:26,color:C.dim})
   +L('ばらばらの向きに',RCX,230,{size:30,color:NEG,weight:700})+L('とても速く 動く',RCX,285,{size:30,color:NEG,weight:700}),1);
  return s;
 },
 [K+'random2']:(p)=>{
  let s=tube()+ions()+electronsIn({jig:1,tau:18+10*p});
  s+=rcard(90,320,L('電流なし',RCX,140,{size:26,color:C.dim})+fade(seg(p,.1,.3),arrow(RCX-20,210,RCX-150,210,{color:VEL,w:5,head:15})+arrow(RCX+20,210,RCX+150,210,{color:VEL,w:5,head:15}))
   +fade(seg(p,.4,.6),L('打ち消し合う',RCX,280,{size:28,color:C.ink})+L('平均の進み ＝ 0',RCX,350,{size:32,color:C.hi,weight:700})),1);
  return s;
 },
 [K+'drift']:(p)=>{
  const sh=150*lin(p,.3,1);
  let s=tube()+ions()+electronsIn({jig:1,tau:28+10*p,shift:sh});
  s+=eArrow(seg(p,.05,.25));
  s+=rcard(90,320,L('電池をつなぐ',RCX,140,{size:26,color:C.dim})
   +fade(seg(p,.05,.25),L('右向きの 電場',RCX,205,{size:28,color:EC,weight:700}))
   +fade(seg(p,.4,.6),L('電子は 全体として',RCX,275,{size:26})+L('← 左へ 少しずつ',RCX,330,{size:30,color:NEG,weight:700})),1);
  return s;
 },
 [K+'vdef']:(p)=>{
  let s=tube()+ions()+electronsIn({jig:1,tau:38+10*p,shift:150+60*p})+eArrow();
  s+=vArrow(seg(p,.05,.25),W.x1+240,W.y+W.h+42,150,'');
  s+=rcard(90,320,L('ドリフト速度',RCX,140,{size:28,color:VEL,weight:700})
   +T(`${vt}`,RCX,215,{size:48})+L('平均の ずれの 速さ',RCX,275,{size:26})
   +fade(seg(p,.5,.7),L('電流に効くのは v',RCX,345,{size:28,color:C.hi,weight:700})),seg(p,0,.2),VEL);
  return s;
 },
 [K+'ndef']:(p)=>{
  // an oblique cube 1 m on a side, with electrons inside
  const x=150,y=420,a=260,d=90;
  const F=[[x,y],[x+a,y],[x+a,y-a],[x,y-a]],B=F.map(([u,v])=>[u+d,v-d*.8]);
  let s=fade(seg(p,0,.2),poly([F[3],F[2],B[2],B[3]],{fill:'#8795ad',fo:.12,stroke:C.dim,sw:2})+poly([F[1],B[1],B[2],F[2]],{fill:'#8795ad',fo:.08,stroke:C.dim,sw:2})
   +poly(F,{fill:'#8795ad',fo:.10,stroke:C.dim,sw:2.5}));
  let e='';for(let i=0;i<34;i++){const u=R(i+40),v=R(i+80),w=R(i+120);e+=dot(x+18+u*(a-36)+w*d*.8,y-18-v*(a-36)-w*d*.64,7,NEG);}
  s+=fade(seg(p,.15,.35),e);
  s+=fade(seg(p,0,.2),L('1 m',x+a/2,y+38,{size:26,color:C.dim})+label('1 m',x-16,y-a/2,{size:26,color:C.dim,anchor:'end'}));
  s+=rcard(90,320,L('数密度',RCX,140,{size:28,color:C.ink,weight:700})
   +T(`${nt}`,RCX,215,{size:48})+L('1 m³ の中の 自由電子の 個数',RCX,280,{size:24})
   +fade(seg(p,.55,.75),L('単位',RCX-80,350,{size:26,color:C.dim})+label('個/m³',RCX+10,360,{size:30,color:C.ink})),seg(p,.25,.45));
  return s;
 },
 [K+'nnot']:(p)=>{
  let s=card(200,70,800,370,L('この n は',600,125,{size:28,color:C.dim})
   +L('1 m³ あたりの 個数',600,195,{size:34,color:C.hi,weight:700})
   +fade(seg(p,.1,.3),L('モル数 とは 別',600,280,{size:28}))
   +fade(seg(p,.3,.5),L('コイルの 巻き数 とは 別',600,340,{size:28})),seg(p,0,.15));
  return s;
 },
 [K+'Sdef']:(p)=>{
  // the tube and its round cross-section
  let s=tube({x1:60,x2:560})+electronsIn({x1:60,x2:560,n:30,shift:40*p});
  s+=section({x:310,text:'',color:SC});
  s+=fade(seg(p,.05,.25),T(St,310,W.y-W.h-30,{size:40})+L('断面積',310,W.y+W.h+45,{size:26,color:SC,weight:700}));
  s+=card(640,90,520,320,L('電子1個の 電荷',900,140,{size:26,color:C.dim})
   +dot(820,215,11,NEG)+T(`-${et}`,900,225,{size:48})
   +fade(seg(p,.5,.7),T(`${et}\\approx 1.6\\times10^{-19}${U('C')}`,900,305,{size:36})+L('e は 正の数（電荷の大きさ）',900,375,{size:24,color:QC})),seg(p,.4,.6),QC);
  return s;
 },
 // ===== S3 円柱で数える =====
 [K+'setup']:(p)=>{
  const sh=110*p;
  let s=tube()+section()+electronsIn({shift:sh})+E3+vArrow(1,W.x1+240,W.y+W.h+42,150,'');
  s+=fade(seg(p,.4,.6),label('← 右側から 来る電子',W.gx+200,W.y-W.h-16,{size:24,color:NEG,anchor:'middle',weight:700}));
  s+=rcard(90,320,L('時間',RCX,145,{size:26,color:C.dim})+T(Dt,RCX,210,{size:48})
   +L('の間に 断面を',RCX,270,{size:26})+L('通り抜ける 電子を 数える',RCX,315,{size:26,color:C.hi,weight:700})
   +L('（平均のずれだけ 描く）',RCX,375,{size:22,color:C.dim}),seg(p,0,.2));
  return s;
 },
 [K+'reach']:(p)=>{
  let s=tube()+section({text:''})+electronsIn({tag:seg(p,.45,.65)>.5?inCyl:null})+E3;
  const x=W.gx,lc=W.lc,y=W.y-W.h-26;
  s+=fade(seg(p,.2,.4),line(x,y,x+lc,y,{color:C.ink,w:3})+line(x,y-10,x,y+10,{color:C.ink,w:3})+line(x+lc,y-10,x+lc,y+10,{color:C.ink,w:3})+T(`${vt}${Dt}`,x+lc/2,y-18,{size:32})
   +line(x+lc,W.y-W.h,x+lc,W.y+W.h,{color:C.hi,w:2,dash:'8 6'}));
  s+=fade(seg(p,.45,.65),rect(x,W.y-W.h,lc,2*W.h,{fill:C.hi,fo:.08,stroke:'none',sw:0,rx:0}));
  s+=rcard(90,320,L('Δt の間に 進む距離',RCX,145,{size:26,color:C.dim})+T(`${vt}\\times${Dt}`,RCX,215,{size:48})
   +fade(seg(p,.45,.65),dot(RX+70,292,8,NEG)+ring(RX+70,292,13,{color:C.hi,w:3})+label('＝ 時間内に 断面を通る',RX+95,300,{size:24,color:C.hi,weight:700})),seg(p,0,.2));
  return s;
 },
 [K+'check']:(p)=>{
  const sh=W.lc*lin(p,.12,.72);
  let s=tube()+section({text:''})+electronsIn({shift:sh,tag:inCyl})+E3;
  s+=fade(1-seg(p,.05,.15),line(W.gx+W.lc,W.y-W.h,W.gx+W.lc,W.y+W.h,{color:C.hi,w:2,dash:'8 6'}));
  s+=rcard(90,320,L('経過時間',RCX,145,{size:26,color:C.dim})
   +T(`${(lin(p,.12,.72)).toFixed(2)}\\,${Dt}`,RCX,215,{size:44})
   +fade(seg(p,.72,.85),L('印の電子は 全部 通過',RCX,295,{size:28,color:C.hi,weight:700})+L('遠い電子は まだ',RCX,350,{size:26,color:C.dim})),1);
  return s;
 },
 [K+'cylinder']:(p)=>{
  let s=tube()+electronsIn({tag:inCyl})+cylinder({g:seg(p,0,.25)})+E3;
  s+=rcard(90,320,L('円柱の 体積',RCX,145,{size:26,color:C.hi,weight:700})
   +fade(seg(p,.35,.55),L('底面積 × 長さ',RCX,210,{size:26}))
   +fade(seg(p,.55,.75),T(`${St}\\times${vt}${Dt}=${St}${vt}${Dt}`,RCX,300,{size:44})),seg(p,.2,.4),C.hi);
  return s;
 },
 [K+'count']:(p)=>{
  let s=tube()+electronsIn({tag:inCyl})+cylinder({labels:0})+T(St,W.gx-50,W.y+12,{size:36});
  s+=rcard(90,320,L('円柱の中の 電子の数',RCX,145,{size:26,color:NEG,weight:700})
   +T(`${nt}\\times${St}${vt}${Dt}`,RCX,235,{size:48})
   +fade(seg(p,.4,.6),L('1 m³ あたり n 個 × 体積',RCX,320,{size:24,color:C.dim})),1,NEG);
  return s;
 },
 [K+'charge']:(p)=>{
  let s=tube()+electronsIn({tag:inCyl})+cylinder({labels:0})+T(St,W.gx-50,W.y+12,{size:36});
  s+=rcard(90,320,L('通った電荷の 大きさ',RCX,145,{size:26,color:QC,weight:700})
   +T(`${et}\\times${nt}${St}${vt}${Dt}`,RCX,215,{size:44})
   +fade(seg(p,.45,.65),T(`${DQ}=${ENSV}${Dt}`,RCX,315,{size:44})),1,QC);
  return s;
 },
 [K+'divide']:(p)=>{
  const g1=seg(p,.05,.2),g2=seg(p,.3,.45),g3=seg(p,.5,.62),g4=seg(p,.65,.8);
  let s=card(110,60,980,380,'',1,IC);
  s+=fade(g1,T(`${It}=\\dfrac{${DQ}}{${Dt}}`,330,200,{size:58}));
  s+=fade(g2*(1-g3),T(`=\\dfrac{${ENSV}\\,${xDt(BG)}}{${xDt(BG)}}`,720,200,{size:58}));
  s+=fade(g3,T(`=\\dfrac{${ENSV}\\,${xDt(C.a)}}{${xDt(C.a)}}`,720,200,{size:58})+L('約分',960,120,{size:26,color:C.a,weight:700}));
  s+=fade(g4,T(`${It}=${ENSV}`,600,360,{size:72})+rect(440,300,320,100,{fill:C.hi,fo:0,stroke:C.hi,sw:3,rx:12}));
  return s;
 },
 [K+'read']:(p)=>{
  let s=card(110,50,980,400,'',1,IC);
  s+=T(`${It}=`,420,190,{size:80})+T(`${et}${nt}`,560,190,{size:80})+T(`${St}${vt}`,730,190,{size:80});
  s+=fade(seg(p,.05,.25),brace(510,610,240,{color:QC})+L('1 m³ あたりの 電荷',560,318,{size:26,color:QC,weight:700}));
  s+=fade(seg(p,.35,.55),brace(680,780,240,{color:SC})+L('1秒に 通る 体積',790,370,{size:26,color:SC,weight:700}));
  s+=fade(seg(p,.7,.85),L('掛けると、1秒に 通る 電荷 ＝ 電流',600,425,{size:28,color:IC,weight:700}));
  return s;
 },

 [K+'unit']:(p)=>{
  let s=card(80,60,1040,380,L('単位',600,110,{size:26,color:C.dim}),1);
  const xs=[230,390,550,710],fs=['\\mathrm{C}','\\dfrac{1}{\\mathrm{m}^3}','\\mathrm{m}^2','\\dfrac{\\mathrm{m}}{\\mathrm{s}}'];
  const mk=c=>['\\mathrm{C}',`\\dfrac{1}{${xout(c,cs(C.ink,'\\mathrm{m}^3'))}}`,xout(c,cs(C.ink,'\\mathrm{m}^2')),`\\dfrac{${xout(c,cs(C.ink,'\\mathrm{m}'))}}{\\mathrm{s}}`];
  const fs0=mk(BG),fc=mk(C.a);
  const sy=[et,nt,St,vt],g=seg(p,.35,.55);
  for(let i=0;i<4;i++){
   s+=fade(1-g,T(fs0[i],xs[i],215,{size:54}))+fade(g,T(fc[i],xs[i],215,{size:54}))+T(sy[i],xs[i],315,{size:36});
   if(i<3)s+=T('\\times',(xs[i]+xs[i+1])/2,215,{size:44});
  }
  s+=fade(seg(p,.5,.7),T(`=\\dfrac{\\mathrm{C}}{\\mathrm{s}}`,880,215,{size:54}));
  s+=fade(seg(p,.72,.88),T(`=${cs(IC,'\\mathrm{A}')}`,880,330,{size:56})+label('アンペア',940,340,{size:28,color:IC,weight:700}));
  return s;
 },

 // ===== S4 銅線で計算する =====
 [K+'copper']:(p)=>{
  let s=tube({x1:60,x2:560})+electronsIn({x1:60,x2:560,n:44,r:7,shift:20*p});
  s+=L('銅線',310,W.y+W.h+45,{size:28,color:C.E,weight:700});
  s+=card(620,80,540,340,L('銅',890,130,{size:28,color:C.E,weight:700})
   +T(`${nt}\\approx 8.5\\times10^{28}\\;/\\mathrm{m}^3`,890,215,{size:44})
   +fade(seg(p,.55,.75),L('原子1個に 自由電子 約1個',890,315,{size:26,color:C.hi,weight:700})),seg(p,.05,.25),C.E);
  return s;
 },
 [K+'given']:(p)=>{
  let s=card(80,60,1040,390,L('条件',600,108,{size:26,color:C.dim}),1);
  s+=T(`${nt}\\approx 8.5\\times10^{28}\\;/\\mathrm{m}^3`,600,175,{size:40});
  s+=fade(seg(p,.05,.3),T(`${St}=1\\,\\mathrm{mm}^2=1\\times10^{-6}\\,\\mathrm{m}^2`,600,260,{size:40}));
  s+=fade(seg(p,.5,.7),T(`${It}=1\\,\\mathrm{A}`,420,345,{size:40})+T(`${et}=1.6\\times10^{-19}\\,\\mathrm{C}`,780,345,{size:40}));
  s+=fade(seg(p,.5,.7),T(`${vt}=\\;?`,600,418,{size:40}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=tube()+electronsIn({shift:20*p})+eArrow();
  s+=rcard(90,320,L('予想',RCX,145,{size:28,color:C.hi,weight:700})
   +L('電子は 1秒に',RCX,225,{size:30})+L('どれくらい 進む？',RCX,285,{size:30,color:VEL,weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'solve']:(p)=>{
  let s=card(110,60,980,380,'',1,VEL);
  s+=T(`${It}=${ENSV}`,600,160,{size:60});
  s+=fade(seg(p,.15,.35),L('両辺を enS で割る',600,235,{size:26,color:C.dim}));
  s+=fade(seg(p,.45,.65),T(`${vt}=\\dfrac{${It}}{${et}${nt}${St}}`,600,365,{size:64}));
  return s;
 },
 [K+'enS']:(p)=>{
  let s=card(60,50,1080,410,L('分母',600,95,{size:26,color:C.dim}),1);
  s+=T(`${et}${nt}${St}=1.6\\times10^{-19}\\times8.5\\times10^{28}\\times10^{-6}`,600,185,{size:44});
  s+=fade(seg(p,.35,.55),T(`=13.6\\times10^{3}`,600,275,{size:44})+L('1.6 × 8.5 ＝ 13.6、指数は −19 ＋ 28 − 6 ＝ 3',600,335,{size:24,color:C.dim}));
  s+=fade(seg(p,.62,.82),T(`\\approx 1.36\\times10^{4}\\,\\mathrm{C/m}`,600,415,{size:46,color:C.hi}));
  return s;
 },
 [K+'vres']:(p)=>{
  let s=card(90,50,1020,410,'',1,VEL);
  s+=T(`${vt}=\\dfrac{1\\,\\mathrm{A}}{1.36\\times10^{4}\\,\\mathrm{C/m}}`,600,160,{size:52});
  s+=fade(seg(p,.25,.45),T(`\\approx 7\\times10^{-5}\\,\\mathrm{m/s}`,600,285,{size:52,color:VEL}));
  s+=fade(seg(p,.6,.8),L('1秒に 約 0.07 mm',600,390,{size:34,color:C.hi,weight:700}));
  return s;
 },
 [K+'slow']:(p)=>{
  // a time line: 1 s, 1 h, 1 m
  let s=card(80,60,1040,390,'',1);
  const row=(y,a,b,g,ca=TC,cb=VEL)=>fade(g,label(a,420,y,{size:32,color:ca,weight:700,anchor:'end'})+label('→',470,y,{size:30,color:C.dim,anchor:'middle'})+label(b,520,y,{size:32,color:cb,weight:700}));
  s+=row(150,'1 秒','約 0.07 mm',1);
  s+=row(250,'1 時間','約 26 cm（30 cm に届かない）',seg(p,.05,.3));
  s+=row(350,'1 m 進むには','約 4 時間',seg(p,.5,.75),VEL,TC);
  return s;
 },
 [K+'bign']:(p)=>{
  let s=card(110,60,980,380,'',1,IC);
  const y=170,xs=[430,540,610,680,750];
  s+=T(`${It}=`,xs[0],y,{size:64})+T(et,xs[1],y,{size:64})+T(nt,xs[2],y,{size:64})+T(St,xs[3],y,{size:64})+T(vt,xs[4],y,{size:64});
  s+=fade(seg(p,.1,.3),arrow(xs[2],285,xs[2],215,{color:C.hi,w:3,head:12})+L('とても大きい',xs[2]-40,318,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.1,.3),arrow(xs[4],285,xs[4],215,{color:VEL,w:3,head:12})+L('とても小さい',xs[4]+100,318,{size:28,color:VEL,weight:700}));
  s+=fade(seg(p,.55,.75),L('数の多さが 遅さを 補う → 1 A',600,400,{size:30,color:IC,weight:700}));
  return s;
 },

 // ===== S5 確かめ =====
 [K+'quizS']:(p)=>{
  const a={x1:60,x2:620,y:140,h:45},b={x1:60,x2:620,y:350,h:90};
  let s=tube(a)+electronsIn({...a,n:22,r:7,seed:11,shift:40*p})+tube(b)+electronsIn({...b,n:44,r:7,seed:13,shift:40*p});
  s+=T(St,660,150,{size:36})+T(`2${St}`,660,360,{size:36});
  s+=card(760,110,400,280,L('確認',960,160,{size:28,color:C.hi,weight:700})
   +L('n と v は そのまま',960,225,{size:26})+L('S だけ 2倍',960,275,{size:28,color:SC,weight:700})+T(`${It}\\;\\to\\;?`,960,350,{size:44}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ansS']:(p)=>{
  let s=card(110,60,980,380,'',1,IC);
  s+=T(`${It}'=${et}${nt}(2${St})${vt}`,600,170,{size:60});
  s+=fade(seg(p,.25,.45),T(`=2\\,${ENSV}=2${It}`,600,280,{size:60}));
  s+=fade(seg(p,.6,.8),T(`1\\,\\mathrm{A}\\;\\to\\;2\\,\\mathrm{A}`,600,390,{size:52,color:IC}));
  return s;
 },
 [K+'ansS2']:(p)=>{
  const a={x1:60,x2:620,y:140,h:45},b={x1:60,x2:620,y:350,h:90};
  let s=tube(a)+tube(b);
  s+=cylinder({x:300,y:a.y,h:a.h,lc:W.lc,labels:0,g:seg(p,0,.2)})+cylinder({x:300,y:b.y,h:b.h,lc:W.lc,labels:0,g:seg(p,0,.2)});
  s+=electronsIn({...a,n:22,r:7,seed:11})+electronsIn({...b,n:44,r:7,seed:13});
  s+=label('体積 SvΔt',660,150,{size:26,color:C.hi,weight:700})+label('体積 2SvΔt',660,360,{size:28,color:C.hi,weight:700});
  s+=fade(seg(p,.4,.6),card(830,190,330,130,L('中の電子も 2倍',995,240,{size:26,color:NEG,weight:700})+L('→ 電流 2倍',995,290,{size:28,color:IC,weight:700}),1,IC));
  return s;
 },
 [K+'ansn']:(p)=>{
  const a={x1:60,x2:620,y:140,h:50},b={x1:60,x2:620,y:350,h:50};
  let s=tube(a)+electronsIn({...a,n:11,r:8,seed:3,shift:90*p})+tube(b)+electronsIn({...b,n:22,r:8,seed:7,shift:90*p});
  s+=T(nt,660,150,{size:36})+T(`2${nt}`,660,360,{size:36});
  s+=fade(seg(p,.1,.3),label('→ 電流 2倍',740,360,{size:28,color:IC,weight:700}));
  s+=card(760,40,400,90,L('初級：並ぶ電荷 ×2 → 電流 ×2',960,95,{size:22,color:C.hi,weight:700}),seg(p,.45,.65),C.hi);
  return s;
 },
 [K+'dir']:(p)=>{
  let s=tube()+electronsIn({shift:120*p})+eArrow();
  s+=vArrow(1,W.x1+300,W.y+W.h+42,160,'電子');
  s+=rcard(90,320,L('向き',RCX,140,{size:26,color:C.dim})
   +T(`${It}=${ENSV}`,RCX,210,{size:44})+L('は 大きさ',RCX,265,{size:26})
   +fade(seg(p,.4,.6),L('電子 ← 、 電流 →',RCX,345,{size:30,color:C.ink,weight:700})),1);
  s+=fade(seg(p,.4,.6),arrow(W.x1+380,W.y+W.h+42,W.x1+600,W.y+W.h+42,{color:IC,w:6,head:16})+label('電流',W.x1+610,W.y+W.h+51,{size:26,color:IC,weight:700}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'summary']:(p)=>{
  const box=(x,title,tx,col,g)=>card(x,70,500,300,L(title,x+250,120,{size:26,color:col,weight:700})+T(tx,x+250,245,{size:52}),g,col);
  let s=box(70,'定義',`${It}=\\dfrac{${DQ}}{${Dt}}`,C.dim,1);
  s+=fade(seg(p,.25,.4),L('→',600,230,{size:48,color:C.dim}));
  s+=box(630,'導いた結果',`${It}=${ENSV}`,C.hi,seg(p,.3,.5));
  s+=fade(seg(p,.5,.7),L('長さ vΔt の 円柱の 電子を 数えた',880,330,{size:24,color:C.dim}));
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=tube()+electronsIn({shift:15*p})+eArrow();
  s+=rcard(90,320,L('銅線・1 A・1 mm²',RCX,145,{size:26,color:C.dim})
   +T(`${vt}\\approx 7\\times10^{-5}\\,\\mathrm{m/s}`,RCX,230,{size:40})+L('1秒に 約 0.07 mm',RCX,320,{size:30,color:C.hi,weight:700}),1,VEL);
  return s;
 },
 [K+'puzzle']:(p)=>{
  // battery on the left, long wire loop, bulb on the right; switch closes early, bulb lights at once
  const x1=120,x2=1080,yt=140,yb=400,bx=x1,by=270;
  const on=seg(p,.18,.24);
  let s=draw([[bx,by-8],[x1,yt],[x2,yt],[x2,yb],[x1,yb],[bx,by+10]],1,{color:C.dim,w:4});
  s+=battery(bx,by,{label:'電池'});
  // switch on the top wire
  const sx=360;s+=rect(sx-10,yt-6,60,12,{fill:C.bg,fo:1,stroke:C.bg,sw:0,rx:0})+dot(sx,yt,6,C.ink)+dot(sx+50,yt,6,C.ink)
   +line(sx,yt,sx+50*Math.cos(.6*(1-on)),yt-50*Math.sin(.6*(1-on)),{color:C.ink,w:4});
  s+=label('スイッチ',sx+25,yt-40,{size:24,color:C.dim,anchor:'middle'});
  s+=rect(x2-40,by-60,80,120,{fill:C.bg,fo:1,stroke:C.bg,sw:0,rx:0})+line(x2,yt,x2,by-30,{color:C.dim,w:4})+line(x2,by+30,x2,yb,{color:C.dim,w:4})+bulb(x2,by,on);
  s+=label('電球',x2-70,by+8,{size:24,color:C.dim,anchor:'end'});
  s+=fade(seg(p,.3,.45),L('すぐ 点く',x2-150,by-70,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.55,.75),card(330,210,480,150,L('電子が 電球まで 進むには',570,265,{size:26})+L('何時間も かかる はず',570,320,{size:30,color:NEG,weight:700}),1,NEG));
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(90,80,480,340,L('次の問い 1',330,130,{size:24,color:C.dim})
   +L('電子は 遅いのに',330,210,{size:30,color:NEG,weight:700})+L('電球は なぜ すぐ 点く？',330,270,{size:30,color:C.hi,weight:700})+bulb(330,355,1),seg(p,0,.2),C.hi);
  // junction picture
  const jx=870,jy=250;
  const pic=line(jx-190,jy,jx,jy,{color:C.dim,w:5})+line(jx,jy,jx+170,jy-100,{color:C.dim,w:5})+line(jx,jy,jx+170,jy+100,{color:C.dim,w:5})+dot(jx,jy,9,C.hi)
   +arrow(jx-170,jy-22,jx-50,jy-22,{color:IC,w:5,head:14})+label('?',jx+190,jy-92,{size:34,color:IC,weight:700})+label('?',jx+190,jy+122,{size:34,color:IC,weight:700});
  s+=card(630,80,480,340,L('次の問い 2',870,130,{size:24,color:C.dim})+fade(1,pic)+L('分かれ道の 電流は？',870,395,{size:28,color:C.hi,weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
};
