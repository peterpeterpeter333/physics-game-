// 高校編「電流とオームの法則・深く学ぶ 1/4」(ys-hs-e-current-1) — 図。Stage 1200×515.
// 色：電荷 Q 桃、時間 t 金、電流 I 緑、電圧 V 紫、エネルギー 橙、電子 青、正電荷 赤、抵抗 R 白。
// 電池の記号：長い細い線＝＋極、短い太い線＝−極。電流（緑の矢印）は電池の外で ＋極 → −極、電子（青）は逆向き。
// 2/4〜4/4・要点でも使う部品は export する（カード・タグ・T2 は熱・波の部品を読み込む）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,axes,brace,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT} from './yt1-hs-t-heat-1-diagrams.mjs';
import {rope,beads,RP} from './yt1-hs-w-basics-1-diagrams.mjs';
export {card,tag,T2,sceneT};

const K='hs-e-current-1:';
export const IC=C.F, VC=C.v, QC=C.p, TC=C.t, WC=C.E, NEG='#7fb3ff', POS=C.a, EC=C.x, RC=C.ink, CU='#d89a5e';
export const It=`{\\color{${IC}}I}`, Qt=`{\\color{${QC}}Q}`, Vt=`{\\color{${VC}}V}`, Rt=`{\\color{${RC}}R}`, Wt=`{\\color{${WC}}W}`;
export const dQ=`\\Delta ${Qt}`, dT=`\\Delta {\\color{${TC}}t}`;
export const U=s=>`\\ \\mathrm{${s}}`;
// ---- tokens --------------------------------------------------------------------------------------
export const qtok=(x,y,op=1)=>fade(op,ring(x,y,13,{color:QC,w:2.5,fill:'#3a2140'})+dot(x,y,5,QC));
export const electron=(x,y,{r=13,op=1}={})=>fade(op,ring(x,y,r,{color:NEG,w:2.5,fill:'#1b2a48'})+label('−',x,y+7,{size:22,color:NEG,anchor:'middle',weight:700}));
export const plus=(x,y,{r=13,op=1}={})=>fade(op,ring(x,y,r,{color:POS,w:2.5,fill:'#3a1d2a'})+label('＋',x,y+8,{size:22,color:POS,anchor:'middle',weight:700}));
export const edot=(x,y,r=7,op=1)=>dot(x,y,r,NEG,op);
// ---- a straight wire (tube) and a cross-section ---------------------------------------------------
export const tube=(x1,x2,y,{hh=50,g=1,fill='#8795ad'}={})=>fade(g,rect(x1,y-hh,x2-x1,2*hh,{fill,fo:.16,stroke:C.dim,sw:2.5,rx:hh-4}));
export const section=(x,y,{hh=50,g=1,text='断面'}={})=>fade(g,`<ellipse cx="${x}" cy="${y}" rx="20" ry="${hh}" fill="${C.hi}" fill-opacity=".14" stroke="${C.hi}" stroke-width="3"/>`
 +(text?label(text,x,y-hh-16,{size:24,color:C.hi,anchor:'middle',weight:700}):''));
// tokens passing x=gx at times (k+.5)/r, moving with `speed` px/s in direction dir
export function stream(t,{r=3,speed=110,dir=1,kind='q',y=250,x1=70,x2=660,gx=365,g=1,dy=22,tmax=1e9}={}){
 let s='';
 const tt=Math.min(t,tmax),k0=Math.floor(tt*r);
 for(let k=k0-120;k<k0+120;k++){
  const x=gx+dir*speed*(tt-(k+.5)/r);if(x<x1+20||x>x2-20)continue;
  const yy=y+[0,-dy,dy][((k%3)+3)%3];
  s+=kind==='q'?qtok(x,yy):kind==='p'?plus(x,yy):electron(x,yy);
 }
 return fade(g,s);
}
export const passed=(t,r=3)=>t<=0?0:Math.max(0,Math.floor(t*r-.5+1e-9)+1);
// ---- circuit symbols ------------------------------------------------------------------------------
// battery in a horizontal wire at (x,y): plates at x∓gap. pos='right' → long (＋) plate on the right.
export function battery(x,y,{pos='right',g=1,text='',gap=11,hl=0,signs=true}={}){
 const xl=x-gap,xr=x+gap,long=pos==='right'?xr:xl,short=pos==='right'?xl:xr;
 let s=line(long,y-36,long,y+36,{color:C.ink,w:5})+line(short,y-19,short,y+19,{color:C.ink,w:10});
 if(signs)s+=label('＋',long+(pos==='right'?22:-22),y-24,{size:26,color:POS,anchor:'middle',weight:700})+label('−',short+(pos==='right'?-22:22),y-24,{size:28,color:NEG,anchor:'middle',weight:700});
 if(text)s+=label(text,x,y+(hl?84:68),{size:24,color:C.dim,anchor:'middle'});
 if(hl)s+=fade(hl,ring(x,y,52,{color:C.hi,w:3}));
 return fade(g,s);
}
export function bulb(x,y,{on=0,r=34,g=1}={}){
 let s='';
 if(on>0)s+=fade(on,dot(x,y,r+30,'#ffe9a0',.18)+dot(x,y,r+14,'#ffe9a0',.3));
 s+=ring(x,y,r,{color:C.ink,w:3,fill:on>.5?'#5a5030':'#131f38'});
 s+=draw([[x-r*.55,y+r*.15],[x-r*.3,y-r*.25],[x-r*.05,y+r*.15],[x+r*.2,y-r*.25],[x+r*.45,y+r*.15]],1,{color:on>.3?C.hi:C.dim,w:3});
 return fade(g,s);
}
export function resistor(x1,x2,y,{color=C.ink,n=6,amp=18,w=4}={}){const pts=[[x1,y]];for(let i=1;i<n*2;i++)pts.push([x1+(x2-x1)*i/(n*2),y+(i%2?-amp:amp)]);pts.push([x2,y]);return draw(pts,1,{color,w});}
// ---- a loop circuit: battery on the bottom wire (＋ on the right), an element on the top wire ----
// path (current direction): ＋ terminal → right side up → top leftwards → left side down → − terminal.
export function loopPath(L,R,T,B,bx){return [[bx+11,B],[R,B],[R,T],[L,T],[L,B],[bx-11,B]];}
export function along(pts,f){
 let Ltot=0;const d=[];for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);d.push(s);Ltot+=s;}
 let w=Ltot*(((f%1)+1)%1);for(let i=1;i<pts.length;i++){if(w<=d[i-1]){const u=w/d[i-1];return [mix(pts[i-1][0],pts[i][0],u),mix(pts[i-1][1],pts[i][1],u)];}w-=d[i-1];}
 return pts[pts.length-1];
}
export const pathLen=pts=>{let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return L;};
export const CIR={L:200,R:760,T:110,B:420,bx:480,ex:480};
export function circuit({o=CIR,g=1,elem='bulb',on=0,cur=0,elec=0,t=0,ev=40,n=22,batt='電池',sw=null,bhl=0,eop=1}={}){
 const {L,R,T,B,bx,ex}=o;let s='';
 // wires
 s+=line(bx+11,B,R,B,{color:C.dim,w:4})+line(R,B,R,T,{color:C.dim,w:4})+line(L,B,bx-11,B,{color:C.dim,w:4});
 if(sw===null)s+=line(L,T,L,B,{color:C.dim,w:4});
 else{ // switch on the left side: gap from T+90 to T+150, lever closes as sw→1
  const y1=T+100,y2=T+170;s+=line(L,T,L,y1,{color:C.dim,w:4})+line(L,y2,L,B,{color:C.dim,w:4})+dot(L,y1,6,C.ink)+dot(L,y2,6,C.ink);
  const a=mix(-0.75,0,sw);s+=line(L,y2,L+Math.sin(a)*(y2-y1),y2-Math.cos(a)*(y2-y1),{color:C.ink,w:5});
  s+=label('スイッチ',L-24,(y1+y2)/2+8,{size:24,color:C.dim,anchor:'end'});
 }
 if(elem==='bulb'){s+=line(L,T,ex-34,T,{color:C.dim,w:4})+line(ex+34,T,R,T,{color:C.dim,w:4})+bulb(ex,T,{on});}
 else if(elem==='res'){s+=line(L,T,ex-80,T,{color:C.dim,w:4})+line(ex+80,T,R,T,{color:C.dim,w:4})+resistor(ex-80,ex+80,T);}
 else s+=line(L,T,R,T,{color:C.dim,w:4});
 s+=battery(bx,B,{text:batt,hl:bhl});
 if(elec>0){const P=loopPath(L,R,T,B,bx),Lp=pathLen(P);
  for(let k=0;k<n;k++){const f=k/n-ev*t/Lp;const [x,y]=along(P,f);
   if(elem==='bulb'&&Math.abs(y-T)<2&&Math.abs(x-ex)<36)continue;
   s+=fade(elec*eop,edot(x,y,8));}}
 if(cur>0)s+=fade(cur,arrow(bx+50,B,R-40,B,{color:IC,w:6,head:18})+arrow(R,B-40,R,T+40,{color:IC,w:6,head:18})+arrow(R-40,T,ex+70,T,{color:IC,w:6,head:18})
  +arrow(ex-70,T,L+40,T,{color:IC,w:6,head:18})+(sw===null?arrow(L,T+40,L,B-40,{color:IC,w:6,head:18}):'')+arrow(L+30,B,bx-50,B,{color:IC,w:6,head:18}));
 return fade(g,s);
}
// ---- formula card -------------------------------------------------------------------------------
export const fcard=(x,y,w,h,src,{g=1,size=50,col=C.hi,dy=0}={})=>card(x,y,w,h,T2(src,x+w/2,y+h/2+size*.3+dy,{size}),g,col);
export const IDEF=`${It}=\\dfrac{${dQ}}{${dT}}`;
// ---- side panel: counted charge and time ---------------------------------------------------------
const PX=730,PWD=430;
function counter(n,t,{g=1,y=100,h=280}={}){
 const cx=PX+PWD/2;
 return card(PX,y,PWD,h,label('通った 電荷',cx,y+52,{size:26,color:C.dim,anchor:'middle'})+label(`${n} C`,cx,y+115,{size:46,color:QC,anchor:'middle',weight:700})
  +label('時間',cx,y+180,{size:26,color:C.dim,anchor:'middle'})+label(`${t.toFixed(1)} s`,cx,y+243,{size:44,color:TC,anchor:'middle',weight:700}),g,QC);
}
const legend=(x,y,g=1)=>fade(g,qtok(x,y-8)+label('1つ ＝ 1 C',x+24,y,{size:24,color:QC}));
// ---- crystal: fixed ions and free electrons -----------------------------------------------------
function rnd(seed){let s=seed*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
export function crystal(t,{x=120,y=80,w=560,h=340,nx=7,ny=4,ne=26,g=1,drift=0,seed=5,jit=1,fixed=1}={}){
 let s=rect(x,y,w,h,{fill:CU,fo:.08,stroke:C.faint,sw:2,rx:12});
 for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const cx=x+w*(i+.5)/nx,cy=y+h*(j+.5)/ny;s+=fade(fixed,plus(cx,cy,{r:15}));}
 const R=rnd(seed);
 for(let k=0;k<ne;k++){const u=R(),v=R(),ph=R()*6.28,sp=.8+R();
  let ex=x+14+(w-28)*((((u-drift*t/w)%1)+1)%1),ey=y+14+(h-28)*v;
  ex+=jit*12*Math.sin(t*3*sp+ph);ey+=jit*12*Math.cos(t*2.4*sp+ph*1.3);
  s+=edot(ex,ey,8);}
 return fade(g,s);
}
// ---- hose ----------------------------------------------------------------------------------------
function hose(t,{push=0,g=1,y=260,x1=200,x2=980}={}){
 let s=rect(x1,y-40,x2-x1,80,{fill:'#4a90d9',fo:.35,stroke:'#9fd0ff',sw:3,rx:10});
 const px=x1-60+70*push;s+=rect(px-14,y-36,28,72,{fill:C.dim,fo:.8,stroke:C.ink,sw:2,rx:4})+line(px-14,y,px-110,y,{color:C.dim,w:8});
 if(push>0){const n=Math.round(10*push);for(let i=0;i<n;i++){const yy=y+(i%3-1)*14,xx=x2+20+i*14;s+=dot(xx,yy+ (i*i)*.6,6,'#9fd0ff');}}
 return fade(g,s);
}

export const hsECurrent1Diagrams={
 // ================= S1 波からの問い =================
 [K+'wave']:(p,ctx)=>{
  const t=sceneT(p,ctx),o={...RP,y:270};
  let s=beads(t,o,{g:seg(p,0,.15)});
  s+=fade(seg(p,.25,.4),label('媒質（水・空気）が 揺れる',300,100,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),arrow(700,96,1000,96,{color:C.hi,w:5,head:16})+label('揺れが 伝わる',850,74,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q']:(p,ctx)=>{
  let s=tube(80,1120,250,{g:seg(p,0,.15),fill:CU});
  s+=fade(seg(p,0,.15),label('電線の 中',600,340,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.15,.3),label('？',600,268,{size:60,color:C.hi,anchor:'middle',weight:700}));
  s+=card(140,380,420,100,label('何が 動いている？',350,442,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  s+=card(640,380,420,100,label('何が 押している？',850,442,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.6,.75),C.faint);
  return s;
 },
 [K+'switch']:(p)=>{
  const sw=seg(p,.12,.25),on=seg(p,.25,.32);
  let s=circuit({sw,on});
  s+=fade(seg(p,.35,.5),label('すぐに つく',CIR.ex,CIR.T-58,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(840,150,320,200,label('導線の 中で',1000,225,{size:30,color:C.ink,anchor:'middle'})+label('何かが 一斉に',1000,275,{size:30,color:C.ink,anchor:'middle'})+label('動いている？',1000,325,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(180,100,840,120,label('① 何が 動いている？',300,175,{size:36,color:C.hi,weight:700})+label('→ この回',900,175,{size:30,color:C.hi,anchor:'end',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(180,270,840,120,label('② 何が 押している？',300,345,{size:36,color:C.ink,weight:700})+label('→ 次の回',900,345,{size:30,color:C.dim,anchor:'end',weight:700}),seg(p,.55,.7),C.faint);
  return s;
 },
 // ================= S2 電荷と電流 =================
 [K+'charge']:(p)=>{
  let s='';for(let i=0;i<6;i++)s+=fade(seg(p,.05+i*.04,.15+i*.04),qtok(180+(i%3)*60,180+Math.floor(i/3)*60));
  s+=fade(seg(p,.1,.25),label('電気の 量',240,340,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=card(480,90,620,300,label('電荷',600,175,{size:38,color:QC,weight:700})+T2(Qt,760,165,{size:56})
   +fade(seg(p,.45,.6),label('単位：クーロン',600,265,{size:32,color:C.ink,weight:700})+T2('\\mathrm{C}',920,255,{size:46,auto:false})),seg(p,.25,.4),QC);
  return s;
 },
 [K+'current']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,230)+section(600,230)+stream(t,{x1:70,x2:1130,gx:600,y:230,r:2,speed:120});
  s+=card(200,340,800,140,label('断面を 1秒あたりに 通る 電荷',600,400,{size:32,color:C.ink,anchor:'middle',weight:700})+label('＝ 電流',540,455,{size:32,color:IC,anchor:'middle',weight:700})+T2(It,640,447,{size:44}),seg(p,.4,.55),IC);
  return s;
 },
 [K+'water']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  // left: a tank (amount of water) ; right: a pipe (flow per second)
  let s=card(60,40,520,440,'',1,C.faint)+card(620,40,520,440,'',1,C.faint);
  s+=rect(190,150,260,200,{fill:'#4a90d9',fo:.35,stroke:'#9fd0ff',sw:3,rx:6})+label('水の 量',320,110,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.3),label('電荷',290,420,{size:32,color:QC,anchor:'middle',weight:700})+T2(Qt,360,412,{size:40}));
  s+=rect(660,220,440,70,{fill:'#4a90d9',fo:.25,stroke:'#9fd0ff',sw:3,rx:10});
  for(let i=0;i<8;i++){const x=660+((i*55+t*90)%440);s+=dot(x,255,7,'#9fd0ff');}
  s+=fade(seg(p,.3,.45),line(880,200,880,310,{color:C.hi,w:3,dash:'6 5'}));
  s+=label('1秒あたりに 流れる 水の 量',880,110,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.45,.6),label('電流',850,420,{size:32,color:IC,anchor:'middle',weight:700})+T2(It,910,412,{size:40}));
  return s;
 },
 [K+'gate']:(p,ctx)=>{
  const t=Math.min(1,sceneT(p,ctx)*.0);
  let s=tube(70,660,250)+section(365,250)+stream(0,{r:3,speed:110,tmax:0,x1:70,x2:660});
  s+=fade(seg(p,.2,.35),label('門',365,340,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=legend(120,450,seg(p,.5,.65));
  s+=counter(0,0,{g:seg(p,.3,.45)});
  return s;
 },
 [K+'count']:(p)=>{
  const tt=2*lin(p,.1,.75);
  let s=tube(70,660,250)+section(365,250)+stream(tt,{r:3,speed:110,x1:70,x2:660});
  s+=legend(120,450)+counter(passed(tt),tt);
  s+=fade(seg(p,.8,.92),highlight2(PX,100,PWD,280));
  return s;
 },
 [K+'def']:(p)=>{
  let s=fcard(330,50,540,190,IDEF,{size:60,col:IC,g:seg(p,.45,.6)});
  s+=fade(seg(p,.05,.2),label('通った 電荷',230,330,{size:30,color:QC,anchor:'middle',weight:700})+T2(dQ,230,390,{size:44}));
  s+=fade(seg(p,.05,.2),label('かかった 時間',970,330,{size:30,color:TC,anchor:'middle',weight:700})+T2(dT,970,390,{size:44}));
  s+=tag('定義',600,320,{color:C.hi,g:seg(p,.8,.92),size:28});
  s+=fade(seg(p,.6,.75),label('1秒あたりに 直す',600,420,{size:30,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'calc']:(p)=>{
  let s=fcard(330,30,540,150,IDEF,{size:46,col:IC});
  s+=card(150,220,900,150,T2(`${It}=\\dfrac{6${U('C')}}{2${U('s')}}`,380,310,{size:50,auto:false})
   +fade(seg(p,.25,.4),T2(`=3${U('C/s')}`,640,305,{size:50,auto:false}))
   +fade(seg(p,.6,.75),T2(`=3${U('A')}`,860,305,{size:50,auto:false,color:IC})),seg(p,.05,.2),IC);
  s+=fade(seg(p,.6,.75),label('アンペア',860,420,{size:28,color:IC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=fcard(250,90,700,170,`1${U('A')}=1${U('C/s')}`,{size:70,col:IC,g:seg(p,.3,.45)});
  s+=fade(seg(p,.05,.2),label('1秒に 1 C 通る 電流 ＝ 1 A',600,350,{size:34,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'velocity']:(p)=>{
  let s=card(80,90,480,240,label('速度',320,150,{size:30,color:C.v,anchor:'middle',weight:700})+T2('v=\\dfrac{\\Delta x}{\\Delta t}',320,255,{size:54}),seg(p,.05,.2),C.v);
  s+=card(640,90,480,240,label('電流',880,150,{size:30,color:IC,anchor:'middle',weight:700})+T2(IDEF,880,255,{size:54}),seg(p,.2,.35),IC);
  s+=fade(seg(p,.5,.65),label('どちらも「1秒あたり」に 直す',600,410,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'avg']:(p)=>{
  const A=axes({x:150,y:420,w:520,h:300,xmax:2.3,ymax:7,xticks:[1,2],yticks:[3,6],grid:true,xlabel:'t [s]',ylabel:'通った 電荷 [C]',xcolor:TC,ycolor:QC});
  let s=A.svg+A.plot(u=>3*u,{from:0,to:2,p:seg(p,.05,.4),color:QC,w:5});
  s+=fade(seg(p,.4,.5),dot(A.X(2),A.Y(6),9,QC));
  s+=card(760,90,400,150,label('2秒間の 平均',960,145,{size:28,color:C.ink,anchor:'middle'})+T2(`${It}=3${U('A')}`,960,210,{size:46,auto:false}),seg(p,.15,.3),IC);
  s+=card(760,280,400,150,label('一定なら どの 瞬間も',960,335,{size:28,color:C.ink,anchor:'middle'})+T2(`${It}=3${U('A')}`,960,400,{size:46,auto:false}),seg(p,.6,.75),IC);
  return s;
 },
 // ================= S3 動いているのは電子 =================
 [K+'what']:(p,ctx)=>{
  let s=tube(70,1130,250,{fill:CU})+label('金属の 導線',600,440,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.2,.4),ring(600,250,110,{color:C.hi,w:4,fill:'#0f1a30'})+label('？',600,272,{size:64,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'free']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=crystal(t,{fixed:seg(p,0,.2)});
  s+=fade(seg(p,.1,.25),plus(780,150,{r:15})+label('原子（動かない）',810,158,{size:26,color:POS,weight:700}));
  s+=fade(seg(p,.3,.45),edot(780,240,8)+label('電子（自由に 動く）',810,248,{size:26,color:NEG,weight:700}));
  s+=card(760,320,400,110,label('自由電子',960,392,{size:40,color:NEG,anchor:'middle',weight:700}),seg(p,.6,.75),NEG);
  return s;
 },
 [K+'e']:(p)=>{
  let s=ring(250,250,60,{color:NEG,w:4,fill:'#1b2a48'})+label('−',250,272,{size:64,color:NEG,anchor:'middle',weight:700})+label('電子 1個',250,370,{size:30,color:NEG,anchor:'middle',weight:700});
  s+=card(420,140,720,200,label('電荷の 大きさ',780,200,{size:30,color:C.ink,anchor:'middle'})+T2(`1.6\\times10^{-19}${U('C')}`,780,280,{size:54,auto:false,color:QC}),seg(p,.05,.25),QC);
  s+=tag('実験で 測られた 値',780,410,{color:C.hi,g:seg(p,.6,.75),size:26});
  return s;
 },
 [K+'count1']:(p)=>{
  let s=card(150,60,900,140,label('1 C は 電子 何個ぶん？',600,145,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(150,250,900,160,T2(`1${U('C')}\\div(1.6\\times10^{-19}${U('C')})`,600,345,{size:50,auto:false}),seg(p,.5,.65),QC);
  return s;
 },
 [K+'count2']:(p)=>{
  let s=card(150,40,900,150,T2(`1\\div(1.6\\times10^{-19})=6.25\\times10^{18}`,600,128,{size:50,auto:false}),1,QC);
  s+=fade(seg(p,.05,.2),label('個',990,135,{size:32,color:C.ink,weight:700}));
  s+=card(150,250,900,170,label('1 A なら 1秒に',600,315,{size:32,color:IC,anchor:'middle',weight:700})+T2(`6.25\\times10^{18}`,560,385,{size:46,auto:false,color:NEG})+label('個の 電子が 通る',780,393,{size:30,color:C.ink,weight:700}),seg(p,.45,.6),IC);
  return s;
 },
 // ================= S4 電流の向き =================
 [K+'dir']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,230)+stream(t,{kind:'p',x1:70,x2:1130,gx:600,y:230,r:1.2,speed:90,dir:1});
  s+=arrow(380,360,820,360,{color:IC,w:8,head:24,g:seg(p,.15,.35)})+fade(seg(p,.25,.4),label('電流の 向き',600,410,{size:30,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('＝ 正の 電荷が 進む 向き（約束）',600,460,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('定義',1030,120,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 [K+'dir2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,230)+stream(t,{kind:'e',x1:70,x2:1130,gx:600,y:230,r:1.2,speed:90,dir:-1});
  s+=arrow(380,360,820,360,{color:IC,w:8,head:24})+label('電流 I',600,410,{size:30,color:IC,anchor:'middle',weight:700});
  s+=fade(seg(p,.25,.4),arrow(820,110,380,110,{color:NEG,w:6,head:20})+label('電子の 動き',600,80,{size:30,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('逆向き',1000,460,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'battery']:(p)=>{
  let s=line(330,260,560,260,{color:C.dim,w:5})+line(640,260,870,260,{color:C.dim,w:5});
  s+=line(620,170,620,350,{color:C.ink,w:8})+line(580,215,580,305,{color:C.ink,w:18});
  s+=fade(seg(p,.25,.4),label('長い 線',700,150,{size:28,color:C.ink,weight:700})+label('＋極',700,195,{size:34,color:POS,weight:700}));
  s+=fade(seg(p,.5,.65),label('短い 線',500,150,{size:28,color:C.ink,anchor:'end',weight:700})+label('−極',500,195,{size:34,color:NEG,anchor:'end',weight:700}));
  s+=fade(seg(p,.05,.2),label('電池の 記号',600,430,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'iloop']:(p)=>{
  let s=circuit({on:1,cur:seg(p,.2,.45)});
  s+=card(850,140,310,230,label('電流',1005,200,{size:30,color:IC,anchor:'middle',weight:700})+label('＋極 から 出て',1005,260,{size:28,color:C.ink,anchor:'middle'})+label('−極 へ 戻る',1005,315,{size:28,color:C.ink,anchor:'middle'}),seg(p,.4,.55),IC);
  return s;
 },
 [K+'eloop']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({on:1,cur:1,elec:seg(p,.05,.2),t,ev:60,n:26});
  s+=card(850,140,310,230,label('電子',1005,200,{size:30,color:NEG,anchor:'middle',weight:700})+label('−極 から 出て',1005,260,{size:28,color:C.ink,anchor:'middle'})+label('＋極 へ 向かう',1005,315,{size:28,color:C.ink,anchor:'middle'}),seg(p,.3,.45),NEG);
  return s;
 },
 [K+'same']:(p,ctx)=>{
  const t=sceneT(p,ctx),o=CIR;
  let s=circuit({on:1,cur:1,elec:1,t,ev:60,n:26,eop:.6});
  const g1=seg(p,.1,.25),g2=seg(p,.3,.45);
  s+=fade(g1,`<ellipse cx="${o.R}" cy="${(o.T+o.B)/2}" rx="34" ry="12" fill="none" stroke="${C.hi}" stroke-width="3"/>`+label('手前',o.R-44,(o.T+o.B)/2+8,{size:26,color:C.hi,anchor:'end',weight:700}));
  s+=fade(g2,`<ellipse cx="${o.L}" cy="${(o.T+o.B)/2}" rx="34" ry="12" fill="none" stroke="${C.hi}" stroke-width="3"/>`+label('後ろ',o.L+44,(o.T+o.B)/2+8,{size:26,color:C.hi,weight:700}));
  s+=card(850,150,310,200,label('どちらも',1005,215,{size:28,color:C.ink,anchor:'middle'})+label('同じ 電流',1005,275,{size:34,color:IC,anchor:'middle',weight:700})+label('減らない',1005,325,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),IC);
  return s;
 },
 [K+'energy']:(p,ctx)=>{
  const t=sceneT(p,ctx),o=CIR;
  let s=circuit({on:1,cur:1,elec:1,t,ev:60,n:26,eop:.6});
  for(let i=0;i<6;i++){const a=-Math.PI*(i+.5)/6,r0=56,r1=56+40*seg(p,.45,.7);s+=fade(seg(p,.45,.6),line(o.ex+r0*Math.cos(a),o.T+r0*Math.sin(a),o.ex+r1*Math.cos(a),o.T+r1*Math.sin(a),{color:WC,w:4}));}
  s+=card(850,110,310,280,label('入った 電荷 ＝',1005,170,{size:28,color:QC,anchor:'middle',weight:700})+label('出た 電荷',1005,215,{size:28,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('移るのは',1005,290,{size:28,color:C.ink,anchor:'middle'})+label('エネルギー',1005,340,{size:34,color:WC,anchor:'middle',weight:700})),seg(p,.05,.2),WC);
  return s;
 },
 // ================= S5 電子は意外とゆっくり =================
 [K+'guess']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,190,{fill:CU})+stream(t,{kind:'e',x1:70,x2:1130,gx:600,y:190,r:1.5,speed:60,dir:-1});
  s+=card(300,320,600,130,label('電子の 速さは？',600,400,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.3),C.hi);
  return s;
 },
 [K+'wire']:(p)=>{
  let s=tube(260,1100,240,{hh:70,fill:CU});
  s+=`<ellipse cx="260" cy="240" rx="28" ry="70" fill="${CU}" fill-opacity=".35" stroke="${C.hi}" stroke-width="3"/>`;
  s+=fade(seg(p,.1,.25),label('断面積 1 mm²',260,135,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),label('銅線',680,248,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=arrow(520,380,880,380,{color:IC,w:8,head:24,g:seg(p,.5,.7)})+fade(seg(p,.6,.75),label('電流 1 A',700,440,{size:30,color:IC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'density']:(p)=>{
  // a cube 1 m on a side
  const x=170,y=160,a=210,d=70;
  let s=poly([[x,y],[x+a,y],[x+a+d,y-d],[x+d,y-d]],{fill:CU,fo:.25,stroke:C.dim,sw:2})+poly([[x+a,y],[x+a+d,y-d],[x+a+d,y+a-d],[x+a,y+a]],{fill:CU,fo:.18,stroke:C.dim,sw:2})+rect(x,y,a,a,{fill:CU,fo:.12,stroke:C.dim,sw:2,rx:0});
  const R=rnd(9);for(let i=0;i<40;i++)s+=edot(x+12+(a-24)*R(),y+12+(a-24)*R(),6);
  s+=label('1 m³',x+a/2,y+a+44,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=card(560,110,580,190,label('動ける 電子の 数',850,165,{size:28,color:C.ink,anchor:'middle'})+T2(`8.5\\times10^{28}`,800,245,{size:50,auto:false,color:NEG})+label('個',985,252,{size:32,color:C.ink,weight:700}),seg(p,.1,.25),NEG);
  s+=tag('実験で 求めた 値',850,370,{color:C.hi,g:seg(p,.6,.75),size:26});
  return s;
 },
 [K+'per1m']:(p)=>{
  let s=tube(150,1050,170,{hh:44,fill:CU});
  const R=rnd(4);for(let i=0;i<48;i++)s+=edot(170+860*R(),142+56*R(),6);
  s+=fade(seg(p,.05,.2),line(150,240,150,262,{color:C.ink,w:3})+line(1050,240,1050,262,{color:C.ink,w:3})+line(150,251,1050,251,{color:C.ink,w:3})+label('長さ 1 m',600,288,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=card(100,320,1000,150,T2(`8.5\\times10^{28}\\times1.0\\times10^{-6}=8.5\\times10^{22}`,560,405,{size:44,auto:false})+label('個',1040,412,{size:30,color:C.ink,weight:700}),seg(p,.4,.55),NEG);
  s+=fade(seg(p,.15,.3),T2(`1${U('mm^2')}=1.0\\times10^{-6}${U('m^2')}`,600,75,{size:40,auto:false,color:C.hi}));
  return s;
 },
 [K+'row']:(p)=>{
  let s=tube(80,1120,200,{hh:44,fill:CU})+section(800,200,{hh:44,text:'断面'});
  const R=rnd(4);for(let i=0;i<50;i++)s+=edot(100+1000*R(),172+56*R(),6);
  s+=fade(seg(p,.15,.3),highlight2(520,150,280,100,NEG));
  s+=fade(seg(p,.15,.3),label('1秒に 通る 電子の 列',560,120,{size:28,color:NEG,anchor:'middle',weight:700}));
  s+=card(250,310,700,150,T2(`6.25\\times10^{18}`,430,392,{size:42,auto:false,color:NEG})+label('個 → 長さ ？ m',580,400,{size:36,color:C.hi,weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'divide']:(p)=>{
  let s=card(80,40,1040,160,label('個数 ÷ 1 m あたりの 個数',600,95,{size:28,color:C.dim,anchor:'middle'})+T2(`6.25\\times10^{18}\\div(8.5\\times10^{22})`,600,165,{size:46,auto:false}),seg(p,.05,.2),NEG);
  s+=card(250,260,700,150,T2(`\\approx7.4\\times10^{-5}${U('m')}`,600,350,{size:56,auto:false,color:C.hi}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'slow']:(p)=>{
  // ruler: 0..1 mm, 1 mm = 800 px
  const x0=200,k=800,y=230;
  let s=line(x0,y,x0+k,y,{color:C.ink,w:3});
  for(let i=0;i<=10;i++)s+=line(x0+k*i/10,y,x0+k*i/10,y-(i%5?16:30),{color:C.ink,w:2});
  s+=label('0',x0,y+36,{size:24,color:C.dim,anchor:'middle'})+label('0.5 mm',x0+k/2,y+36,{size:24,color:C.dim,anchor:'middle'})+label('1 mm',x0+k,y+36,{size:24,color:C.dim,anchor:'middle'});
  const L=k*.074*seg(p,.05,.4);
  s+=rect(x0,y-70,L,30,{fill:NEG,fo:.7,stroke:NEG,sw:2,rx:3});
  s+=fade(seg(p,.3,.45),label('約 0.074 mm',x0+k*.074+16,y-46,{size:30,color:NEG,weight:700}));
  s+=card(250,330,700,120,label('1秒に 0.1 mm も 進まない',600,405,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'why']:(p)=>{
  let s=circuit({sw:1,on:1});
  s+=card(840,150,320,200,label('電子は 遅いのに',1000,225,{size:28,color:C.ink,anchor:'middle'})+label('なぜ すぐ',1000,280,{size:32,color:C.hi,anchor:'middle',weight:700})+label('つく？',1000,330,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'together']:(p,ctx)=>{
  const t=sceneT(p,ctx),go=seg(p,.45,.55),tt=Math.max(0,t-(ctx&&ctx.dur?ctx.dur*.5:3));
  let s=circuit({sw:go,on:go,elec:1,t:go>0.99?tt:0,ev:45,n:34});
  s+=fade(seg(p,.05,.2),label('はじめから 電子で いっぱい',480,40,{size:28,color:NEG,anchor:'middle',weight:700}));
  s+=card(840,150,320,200,label('導線じゅうの',1000,225,{size:30,color:C.ink,anchor:'middle'})+label('電子が ほぼ',1000,275,{size:30,color:C.ink,anchor:'middle'})+label('同時に 動く',1000,325,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'hose']:(p)=>{
  let s=hose(0,{push:seg(p,.3,.6)});
  s+=fade(seg(p,.05,.2),label('水で 満たした ホース',590,150,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('押す',150,350,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('すぐ 出る',1060,350,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'hose2']:(p)=>{
  const row=(y,a,b,col,g)=>fade(g,label(a,380,y,{size:30,color:C.ink,anchor:'middle',weight:700})+label('⇔',600,y,{size:30,color:C.dim,anchor:'middle'})+label(b,820,y,{size:30,color:col,anchor:'middle',weight:700}));
  let s=card(150,40,900,420,'',1,C.faint);
  s+=label('ホース',380,100,{size:26,color:C.dim,anchor:'middle'})+label('導線',820,100,{size:26,color:C.dim,anchor:'middle'});
  s+=row(170,'満たした 水','自由電子',NEG,1)+row(245,'すぐ 出る','すぐ つく',C.hi,1);
  s+=row(340,'水圧で 押す','電気の 力で 押す',C.hi,seg(p,.1,.25));
  s+=fade(seg(p,.5,.65),label('✕ ここは 違う',600,420,{size:28,color:C.a,anchor:'middle',weight:700})+line(250,350,510,350,{color:C.a,w:3}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,200,{fill:CU})+stream(t,{kind:'e',x1:70,x2:1130,gx:600,y:200,r:1.5,speed:60,dir:-1});
  s+=card(250,320,700,130,label('動いているのは 自由電子',600,402,{size:40,color:NEG,anchor:'middle',weight:700}),seg(p,.3,.45),NEG);
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=tube(70,1130,200,{fill:CU})+section(600,200)+stream(t,{kind:'e',x1:70,x2:1130,gx:600,y:200,r:1.5,speed:60,dir:-1});
  s+=fcard(380,310,440,170,IDEF,{size:54,col:IC,g:seg(p,.3,.45)});
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({on:1,elec:1,t,ev:60,n:26,bhl:seg(p,.3,.45)});
  s+=card(850,110,310,120,label('押しているのは？',1005,182,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  s+=card(850,270,310,120,label('電池は 何を 渡す？',1005,342,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'bye']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(.35,circuit({on:1,elec:1,t,ev:60,n:26}));
  s+=card(300,170,600,140,label('深く学ぶ 2/4 へ',600,255,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
function highlight2(x,y,w,h,color=C.hi){return rect(x,y,w,h,{fill:color,fo:.06,stroke:color,sw:3,rx:12});}
Object.assign(hsECurrent1Diagrams,{
 [K+'check']:(p)=>{
  let s=fcard(330,30,540,150,IDEF,{size:46,col:IC});
  s+=card(200,230,800,170,label('2.0 秒で 10 C',600,295,{size:36,color:C.ink,anchor:'middle',weight:700})+label('電流は？',600,365,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'check2']:(p)=>{
  let s=fcard(330,30,540,150,IDEF,{size:46,col:IC});
  s+=card(150,230,900,170,T2(`${It}=\\dfrac{10${U('C')}}{2.0${U('s')}}`,420,320,{size:50,auto:false})+fade(seg(p,.15,.3),T2(`=5.0${U('A')}`,720,315,{size:50,auto:false,color:IC})),1,IC);
  return s;
 },
});
