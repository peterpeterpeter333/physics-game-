// 高校編「干渉と回折・深く学ぶ 1/2」(ys-hs-w-interference-1) — 図。Stage 1200×515.
// 色：λ・経路差（長さ）水色、t・T 金、f 桃、v 紫、S₁ の波 水色系 W1、S₂ の波 桃系 W2（音波 2/3 と同じ）、足した波 白、
// 強め合いの線 黄、弱め合いの線 灰。水槽の尺度 1 cm ＝ 30 px（λ＝2.0 cm＝60 px）、S₁S₂ の間隔 8.0 cm。
// 表示の動きはゆっくり（1周期 1.6 s）。P＝(S₁ から 10 cm、S₂ から 14 cm)、Q＝(10 cm、13 cm) は円の交点として計算。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,clamp} from './anim.mjs';
import {card,tag,T2,sceneT,tSince,LC,TCOL,FC,VCOL,ROPE,MK,Lt,Tt,ft} from './yt1-hs-w-basics-1-diagrams.mjs';
import {vt} from './yt1-hs-w-basics-2-diagrams.mjs';
import {W1,W2,beatPanels} from './yt1-hs-w-sound-2-diagrams.mjs';
import {table} from './yt1-hs-m-energy-1-diagrams.mjs';
export {TK,tankBase,ripples,hyper,allLines,srcs,ptOf,tgraph,W1,W2,pathTo,tank,tankT,PP,QQ,STR,WEAK};

const K='hs-w-interference-1:';
const PI=Math.PI;
const CM='\\ \\mathrm{cm}';
const STR=C.hi, WEAK='#8d9ab3';
const n=v=>Number(v.toFixed(2));
// ---- ripple tank (top view). S₁, S₂ on the bottom edge, waves spread upward ----------------------
const TK={x1:300,x2:540,y:490,s:30,lam:2.0,T:1.6,R:25};
const dcm=(TK.x2-TK.x1)/TK.s; // 8.0 cm
function ptOf(r1,r2){const x=(r1*r1-r2*r2+dcm*dcm)/(2*dcm),y2=r1*r1-x*x;if(y2<0)return null;return [TK.x1+x*TK.s,TK.y-Math.sqrt(y2)*TK.s];}
const PP=ptOf(10,14), QQ=ptOf(10,13);
const semi=(cx,cy,r,color,w,dash,op)=>r<=0?'':`<path d="M ${n(cx-r)} ${cy} A ${n(r)} ${n(r)} 0 0 1 ${n(cx+r)} ${cy}" fill="none" stroke="${color}" stroke-width="${w}"${dash?` stroke-dasharray="${dash}"`:''}${op<1?` opacity="${n(op)}"`:''}/>`;
function tankBase(g=1){return fade(g,rect(0,0,1200,TK.y,{fill:'#0f2846',fo:.55,stroke:'none',rx:0})+line(0,TK.y,1200,TK.y,{color:C.dim,w:3}));}
function srcs(t,{g=1,lab=1}={}){
 const k=1+.25*Math.sin(2*PI*t/TK.T);
 let s=dot(TK.x1,TK.y,11*k,W1)+dot(TK.x2,TK.y,11*k,W2);
 if(lab)s+=rect(TK.x1-22,TK.y-50,44,36,{fill:C.bg,fo:.9,stroke:'none',rx:8})+rect(TK.x2-22,TK.y-50,44,36,{fill:C.bg,fo:.9,stroke:'none',rx:8})+tex('S_1',TK.x1,TK.y-24,{size:28,color:W1,auto:false})+tex('S_2',TK.x2,TK.y-24,{size:28,color:W2,auto:false});
 return fade(g,s);
}
// crests (solid) and troughs (dashed). t in display seconds (steady state when t is large)
function ripples(t,{g=1,on1=1,on2=1,troughs=1,op=1}={}){
 let s='';const v=TK.lam/TK.T;
 [[TK.x1,W1,on1],[TK.x2,W2,on2]].forEach(([x,col,on])=>{if(on<=0)return;
  for(let k=0;k<200;k++){const rc=v*t-(k+.25)*TK.lam,rt=v*t-(k+.75)*TK.lam;if(rc<0&&rt<0)break;
   if(rc>0&&rc<TK.R)s+=semi(x,TK.y,rc*TK.s,col,3,'',on*op);
   if(troughs&&rt>0&&rt<TK.R)s+=semi(x,TK.y,rt*TK.s,col,2,'7 7',.5*on*op*troughs);}});
 return fade(g,s);
}
// hyperbola r2 − r1 = D (cm), drawn from the source line upward; p = drawing progress
function hyper(D,{color=STR,w=4,dash='',g=1,p=1}={}){
 const pts=[];const r0=(dcm-D)/2;
 for(let i=0;i<=160;i++){const r1=r0+.0001+(TK.R-r0)*(i/160)**1.4;const q=ptOf(r1,r1+D);if(q&&q[1]>-10)pts.push(q);}
 return fade(g,draw(pts,p,{color,w,dash}));
}
function allLines({gs=1,gw=1,p=1,hlS=null,hlW=null,dimOthers=1}={}){
 let s='';
 for(let m=-3;m<=3;m++)s+=hyper(m*TK.lam,{color:STR,w:m*TK.lam===hlS?6:3.5,g:gs*(hlS===null||m*TK.lam===hlS?1:dimOthers),p});
 for(let m=-4;m<=3;m++){const D=(m+.5)*TK.lam;s+=hyper(D,{color:WEAK,w:D===hlW?6:3.5,dash:'10 8',g:gw*(hlW===null||D===hlW?1:dimOthers),p});}
 return s;
}
// crest–crest / crest–trough intersections at time t
function crossings(t,{gc=1,gt=1}={}){
 const v=TK.lam/TK.T,cr=[],tr=[];
 for(let k=0;k<200;k++){const rc=v*t-(k+.25)*TK.lam,rt=v*t-(k+.75)*TK.lam;if(rc<0&&rt<0)break;if(rc>0&&rc<TK.R)cr.push(rc);if(rt>0&&rt<TK.R)tr.push(rt);}
 let s='';
 if(gc)for(const a of cr)for(const b of cr){const q=ptOf(a,b);if(q&&q[1]>20&&q[1]<TK.y-8)s+=dot(q[0],q[1],8,STR);}
 if(gt)for(const a of cr)for(const b of tr){const q=ptOf(a,b);if(q&&q[1]>20&&q[1]<TK.y-8)s+=ring(q[0],q[1],7,{color:WEAK,w:3});}
 return fade(Math.max(gc,gt),s);
}
// a point marker with paths from both sources
function pathTo(q,name,{g=1,l1='',l2='',gp=1}={}){
 let s=fade(g*gp,line(TK.x1,TK.y,q[0],q[1],{color:W1,w:4})+line(TK.x2,TK.y,q[0],q[1],{color:W2,w:4}));
 if(l1)s+=fade(g*gp,label(l1,(TK.x1+q[0])/2-58,(TK.y+q[1])/2+10,{size:26,color:W1,anchor:'middle',weight:700}));
 if(l2)s+=fade(g*gp,label(l2,(TK.x2+q[0])/2+62,(TK.y+q[1])/2+10,{size:26,color:W2,anchor:'middle',weight:700}));
 s+=fade(g,dot(q[0],q[1],10,C.ink)+ring(q[0],q[1],10,{color:C.bg,w:2})+label(name,q[0]+(name==='Q'?18:-18),q[1]-14,{size:30,color:C.ink,anchor:name==='Q'?'start':'end',weight:700}));
 return s;
}
// a small "how much it bobs" gauge next to a point: amplitude in units of one wave
function bob(x,y,amp,t,text,color,{g=1}={}){
 const h=26*amp,yy=y-h*Math.sin(2*PI*t/TK.T);
 return fade(g,line(x,y-56,x,y+56,{color:C.faint,w:3})+(amp>0?line(x-10,y-h,x+10,y-h,{color:color,w:2})+line(x-10,y+h,x+10,y+h,{color:color,w:2}):'')+dot(x,yy,9,color)+label(text,x,y+86,{size:24,color,anchor:'middle',weight:700}));
}
const tankT=(p,ctx)=>sceneT(p,ctx)+40;
function tank(t,o={}){return tankBase(o.gb??1)+ripples(t,o)+srcs(t,o);}
// ---- rope with two pulses (superposition) --------------------------------------------------------
const RO={x0:110,x1:1090,y:330,A:70,sig:46};
function pulses(u,{A2=1,g=1,parts=1,lab=0,arrows=0}={}){
 const c1=250+350*u,c2=950-350*u,f1=x=>RO.A*Math.exp(-(((x-c1)/RO.sig)**2)),f2=x=>A2*RO.A*Math.exp(-(((x-c2)/RO.sig)**2));
 const P1=[],P2=[],PS=[];for(let x=RO.x0;x<=RO.x1;x+=4){P1.push([x,RO.y-f1(x)]);P2.push([x,RO.y-f2(x)]);PS.push([x,RO.y-f1(x)-f2(x)]);}
 let s=fade(g*.7,line(RO.x0,RO.y,RO.x1,RO.y,{color:C.faint,w:2,dash:'6 8'}));
 if(parts)s+=fade(g*parts,draw(P1,1,{color:W1,w:3,dash:'9 7'})+draw(P2,1,{color:W2,w:3,dash:'9 7'}));
 s+=fade(g,draw(PS,1,{color:ROPE,w:5}));
 if(lab&&u<.8)s+=fade(g*lab*clamp((.8-u)/.15),label('＋2 cm',c1,RO.y-RO.A-18,{size:26,color:W1,anchor:'middle',weight:700})+label(A2>0?'＋2 cm':'−2 cm',c2,A2>0?RO.y-RO.A-18:RO.y+RO.A+40,{size:26,color:W2,anchor:'middle',weight:700}));
 if(arrows)s+=arrow(560,RO.y-14,560,RO.y+50,{color:VCOL,w:4,head:14,g:arrows})+arrow(640,RO.y+14,640,RO.y-50,{color:VCOL,w:4,head:14,g:arrows})+fade(arrows,label('動いている',600,RO.y+110,{size:26,color:VCOL,anchor:'middle',weight:700}));
 if(u<.8)s+=fade(g*seg(u,.1,.25)*clamp((.8-u)/.1),arrow(c1+70,RO.y+40,c1+140,RO.y+40,{color:W1,w:4,head:12})+arrow(c2-70,RO.y+40,c2-140,RO.y+40,{color:W2,w:4,head:12}));
 return s;
}
// ---- path lengths laid out straight (they end at the same point on the right) ---------------------
const TR={xe:1010,y1:150,y2:270,s:60};
function tracks(r1,r2,{g=1,extra=1,etext='',q=-1,pname='点',clock=''}={}){
 const a1=TR.xe-r1*TR.s,a2=TR.xe-r2*TR.s;
 let s=fade(g,line(a1,TR.y1,TR.xe,TR.y1,{color:W1,w:6})+line(a2,TR.y2,TR.xe,TR.y2,{color:W2,w:6}));
 s+=fade(g,tex('S_1',a1-30,TR.y1+10,{size:30,color:W1,auto:false})+tex('S_2',a2-30,TR.y2+10,{size:30,color:W2,auto:false}));
 s+=fade(g,label(`${r1} cm`,(a1+TR.xe)/2,TR.y1-22,{size:26,color:W1,anchor:'middle',weight:700})+label(`${r2} cm`,(a2+TR.xe)/2,TR.y2+44,{size:26,color:W2,anchor:'middle',weight:700}));
 s+=fade(g,line(TR.xe,TR.y1-40,TR.xe,TR.y2+40,{color:C.ink,w:2,dash:'5 6'})+label(pname,TR.xe+16,(TR.y1+TR.y2)/2+10,{size:30,color:C.ink,weight:700}));
 if(extra)s+=fade(g*extra,rect(a2,TR.y2-14,a1-a2,28,{fill:LC,fo:.35,stroke:LC,rx:6})+(etext?label(etext,(a1+a2)/2,TR.y2+84,{size:28,color:LC,anchor:'middle',weight:700}):''));
 if(q>=0){const L=r1*TR.s/.75,x1=Math.min(TR.xe,a1+q*L),x2=Math.min(TR.xe,a2+q*L);
  s+=poly([[x1-12,TR.y1-34],[x1+12,TR.y1-34],[x1,TR.y1-14]],{fill:VCOL,fo:1})+poly([[x2-12,TR.y2-34],[x2+12,TR.y2-34],[x2,TR.y2-14]],{fill:VCOL,fo:1});
  s+=fade(clamp((q-.05)/.1),label('山',a1+12,TR.y1-46,{size:22,color:VCOL,anchor:'middle',weight:700})+label('山',a2+12,TR.y2-46,{size:22,color:VCOL,anchor:'middle',weight:700}));
  if(x1>=TR.xe)s+=label('到着',TR.xe-60,TR.y1-46,{size:24,color:VCOL,anchor:'middle',weight:700});
  if(x2>=TR.xe)s+=label('到着',TR.xe-60,TR.y2-46,{size:24,color:VCOL,anchor:'middle',weight:700});}
 if(clock)s+=fade(g,label(clock,TR.xe,470,{size:30,color:TCOL,anchor:'end',weight:700}));
 return s;
}
// ---- time graphs of the two arrivals at one point --------------------------------------------------
const TG={x0:250,x1:1090,ys:[85,235,405],A:38,per:240};
function tgraph({tau=1,u=1,gs=0,A2=1,mark=1,g=1,ghost=0}={}){
 const sh=tau*u;let s='';const [y1,y2,y3]=TG.ys;
 const w=(X,d,amp)=>amp*Math.cos(2*PI*((X-TG.x0)/TG.per-.5-d));
 const tr=(y,fn,col,wd)=>{const pts=[];for(let X=TG.x0;X<=TG.x1;X+=3)pts.push([X,y-fn(X)]);return draw(pts,1,{color:col,w:wd});};
 s+=fade(g*.8,[y1,y2].map(y=>line(TG.x0,y,TG.x1,y,{color:C.faint,w:2,dash:'6 8'})).join(''));
 s+=fade(g,label('S₁ からの 波',TG.x0-16,y1+8,{size:24,color:W1,anchor:'end',weight:700})+label('S₂ からの 波',TG.x0-16,y2+8,{size:24,color:W2,anchor:'end',weight:700}));
 s+=fade(g,tr(y1,X=>w(X,0,TG.A),W1,3.5));
 if(ghost)s+=fade(g*ghost*.45,tr(y2,X=>w(X,0,TG.A*A2),W2,2.5));
 s+=fade(g,tr(y2,X=>w(X,sh,TG.A*A2),W2,3.5));
 if(mark){const xa=TG.x0+TG.per*1.5,xb=xa+sh*TG.per;
  s+=fade(g*mark,poly([[xa-12,y1-TG.A-30],[xa+12,y1-TG.A-30],[xa,y1-TG.A-10]],{fill:VCOL,fo:1})+poly([[xb-12,y2-TG.A*A2-30],[xb+12,y2-TG.A*A2-30],[xb,y2-TG.A*A2-10]],{fill:VCOL,fo:1}));
  if(sh>.02)s+=fade(g*mark,line(xa,y1+TG.A+4,xa,y2-TG.A-34,{color:VCOL,w:2,dash:'4 5'}))+arrow(xa,y2-TG.A-44,xb,y2-TG.A-44,{color:TCOL,w:3,head:12,g:g*mark});}
 if(gs){s+=fade(g*gs*.8,line(TG.x0,y3,TG.x1,y3,{color:C.faint,w:2,dash:'6 8'}))+fade(g*gs,tr(y3,X=>w(X,0,TG.A)+w(X,sh,TG.A*A2),ROPE,4.5)+label('足した ずれ',TG.x0-16,y3+8,{size:24,color:ROPE,anchor:'end',weight:700}));}
 s+=fade(g,arrow(TG.x1-150,500,TG.x1,500,{color:TCOL,w:3,head:12})+label('時刻',TG.x1-160,508,{size:22,color:TCOL,anchor:'end'}));
 return s;
}
// ---- an equation row: Japanese word + TeX -------------------------------------------------------------
const eqRow=(word,src,x,y,{size=48,color=C.ink,g=1}={})=>fade(g,label(word,x,y+12,{size:34,color,anchor:'end',weight:700})+T2(src,x+12,y,{size,anchor:'start'}));
const lamCM=`${Lt}=2.0${CM}`;

export const hsWInterference1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  const tr=(y0,ph,col,g)=>{const pts=[];for(let x=80;x<=1120;x+=5)pts.push([x,y0-34*Math.sin(2*PI*((x-80)/170-t/1.6)+ph)]);return fade(g,draw(pts,1,{color:col,w:4}));};
  s+=tr(240,0,W1,seg(p,.05,.2))+tr(370,0,W2,seg(p,.15,.3));
  s+=fade(seg(p,.05,.2),label('光の 波 1',80,190,{size:24,color:W1,weight:700}))+fade(seg(p,.15,.3),label('光の 波 2',80,320,{size:24,color:W2,weight:700}));
  s+=card(250,40,700,100,label('重なると、強め合う？ 弱め合う？',600,104,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s='';
  const tr=(y0,col)=>{const pts=[];for(let x=80;x<=1120;x+=5)pts.push([x,y0-34*Math.sin(2*PI*((x-80)/170-t/1.6))]);return fade(.5,draw(pts,1,{color:col,w:4}));};
  s+=tr(240,W1)+tr(370,W2);
  s+=card(250,40,700,100,label('重なると、強め合う？ 弱め合う？',600,104,{size:34,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=card(250,420,330,80,label('どこで？',415,472,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),C.dim);
  s+=card(620,420,330,80,label('どう 見る？',785,472,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.55),C.dim);
  return s;
 },
 [K+'water']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{g:seg(p,.3,.5)});
  s+=card(760,40,400,110,label('まず 水面の 波で',960,108,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  s+=fade(seg(p,0,.15)*(1-seg(p,.3,.45)),label('光の 波：細かすぎて 見えない',600,260,{size:32,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'pred']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t);
  s+=card(720,40,440,150,label('どこでも',940,100,{size:34,color:C.ink,anchor:'middle',weight:700})+label('2倍 大きく 揺れる？',940,156,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ================= S2 重ね合わせの原理 =================
 [K+'link']:(p)=>{
  let s=fade(.55,beatPanels({gs:1,axis:0,lab:1}));
  s+=card(640,20,520,90,label('音波：二つの ずれを 足した',900,78,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(640,280,520,90,label('この回：足し算を 確かめる',900,338,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'pulse']:(p)=>{
  const u=.85*seg(p,.15,.95);
  let s=pulses(u,{lab:1});
  s+=fade(seg(p,.6,.75),label('真ん中で 出会う',600,140,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'add']:(p)=>{
  const u=.85+.15*seg(p,0,.3);
  let s=pulses(u,{parts:1});
  s+=fade(seg(p,.3,.45),label('＋4 cm',660,RO.y-2*RO.A-10,{size:30,color:ROPE,anchor:'start',weight:700}));
  s+=card(80,40,560,90,T2('(+2)+(+2)=+4',360,98,{size:44,auto:false}),seg(p,.3,.45),C.hi);
  s+=tag('強め合い',1000,90,{color:C.hi,g:seg(p,.6,.75),size:30});
  return s;
 },
 [K+'cancel']:(p)=>{
  const u=seg(p,.1,.75);
  let s=pulses(u,{A2:-1,lab:1});
  s+=card(80,40,560,90,T2('(+2)+(-2)=0',360,98,{size:44,auto:false}),seg(p,.7,.82),C.dim);
  s+=tag('弱め合い',1000,90,{color:C.dim,g:seg(p,.8,.92),size:30});
  return s;
 },
 [K+'flat']:(p)=>{
  let s=pulses(1,{A2:-1,parts:.6,arrows:seg(p,.45,.6)});
  s+=fade(seg(p,.05,.2),label('平ら',600,RO.y-110,{size:28,color:ROPE,anchor:'middle',weight:700}));
  s+=card(250,40,700,90,label('平らでも、ロープは 動いている',600,98,{size:32,color:VCOL,anchor:'middle',weight:700}),seg(p,.55,.7),VCOL);
  return s;
 },
 [K+'pass']:(p)=>{
  const u=1+seg(p,.05,.85);
  let s=pulses(u,{A2:-1,parts:.6});
  s+=fade(seg(p,.6,.75),label('すれ違って そのまま 進む',600,140,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'principle']:(p)=>{
  let s='';
  s+=card(170,30,860,190,T2('y=y_1+y_2',600,110,{size:60,auto:false})+fade(seg(p,.25,.4),label('出会う点の ずれ ＝ 波1の ずれ ＋ 波2の ずれ',600,185,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  s+=tag('重ね合わせの 原理',600,320,{color:C.hi,g:seg(p,.65,.8),size:30});
  return s;
 },
 [K+'law']:(p)=>{
  let s='';
  s+=card(170,30,860,190,T2('y=y_1+y_2',600,110,{size:60,auto:false})+label('出会う点の ずれ ＝ 波1の ずれ ＋ 波2の ずれ',600,185,{size:28,color:C.ink,anchor:'middle',weight:700}),1,C.hi);
  s+=tag('実験で 確かめた 法則',600,320,{color:C.F,g:seg(p,.05,.2),size:30});
  s+=fade(seg(p,.55,.7),label('振幅が 小さい 波で 成り立つ',600,420,{size:28,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 水面の二つの波源 =================
 [K+'tank']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tankBase()+ripples(t,{g:seg(p,.1,.35)})+srcs(t,{lab:0});
  s+=fade(seg(p,.5,.65),tex('S_1',TK.x1,TK.y-24,{size:30,color:W1,auto:false})+tex('S_2',TK.x2,TK.y-24,{size:30,color:W2,auto:false}));
  s+=card(760,40,400,90,label('上から 見た 水面',960,98,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),C.dim);
  return s;
 },
 [K+'phase']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.6});
  // side view inset: two rods moving together
  const y=Math.sin(2*PI*t/TK.T)*24;
  s+=card(760,40,400,250,'',seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.05,.2),line(790,200,1130,200,{color:'#4a90d9',w:3})+rect(880,120-y,18,90,{fill:W1,fo:.9,stroke:W1,rx:4})+rect(1010,120-y,18,90,{fill:W2,fo:.9,stroke:W2,rx:4})+label('横から 見ると',960,80,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),label('同時に 上、同時に 下',960,262,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('同位相',960,340,{color:C.hi,g:seg(p,.65,.8),size:30});
  return s;
 },
 [K+'nums']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.6});
  s+=card(720,30,460,200,label('f ＝ 5.0 Hz',950,90,{size:32,color:FC,anchor:'middle',weight:700})+label('λ ＝ 2.0 cm',950,140,{size:32,color:LC,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.4,.55),T2(`${vt}=${ft}${Lt}=5.0\\times 2.0`,950,195,{size:34}));
  s+=card(720,250,460,90,T2(`=10\\ \\mathrm{cm/s}`,950,300,{size:40,auto:false}),seg(p,.7,.82),VCOL);
  return s;
 },
 [K+'period']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.6});
  s+=card(720,30,460,120,T2(`${Tt}=\\dfrac{1}{5.0}=0.20\\ \\mathrm{s}`,950,92,{size:40}),seg(p,.05,.2),TCOL);
  s+=fade(seg(p,.5,.65),label('0.20 s ごとに 山が 1つ',950,200,{size:28,color:TCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'circles']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t);
  s+=card(800,30,360,200,'',seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.05,.2),line(830,75,900,75,{color:C.ink,w:3})+label('山',920,84,{size:28,color:C.ink,weight:700})+line(830,125,900,125,{color:C.ink,w:2,dash:'7 7'})+label('谷',920,134,{size:28,color:C.ink,weight:700}));
  s+=fade(seg(p,.55,.7),label('実際より ゆっくり',980,195,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'cross']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.75})+crossings(t,{gc:seg(p,.05,.2),gt:seg(p,.5,.65)});
  s+=card(800,30,360,160,'',seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.05,.2),dot(840,80,9,STR)+label('山 ＋ 山：強め合い',860,90,{size:26,color:STR,weight:700}));
  s+=fade(seg(p,.5,.65),ring(840,140,8,{color:WEAK,w:3})+label('山 ＋ 谷：弱め合い',860,150,{size:26,color:WEAK,weight:700}));
  return s;
 },
 [K+'lines']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.45})+allLines({gs:seg(p,.05,.15),gw:seg(p,.4,.5),p:1});
  s+=fade(seg(p,0,.15)*(1-seg(p,.15,.3)),crossings(t,{gc:1,gt:0}));
  s+=card(800,30,360,210,'',seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.05,.2),line(830,80,890,80,{color:STR,w:4})+label('強め合い',910,90,{size:26,color:STR,weight:700}));
  s+=fade(seg(p,.4,.55),line(830,140,890,140,{color:WEAK,w:4,dash:'10 8'})+label('弱め合い',910,150,{size:26,color:WEAK,weight:700}));
  s+=fade(seg(p,.7,.85),label('交互に 並ぶ',980,212,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'energy']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.35})+allLines({});
  const A=ptOf(10,12),B=ptOf(10,13);
  s+=fade(seg(p,.05,.2),dot(A[0],A[1],9,STR)+dot(B[0],B[1],9,WEAK));
  s+=card(760,30,400,300,'',seg(p,.05,.2),C.dim);
  s+=bob(860,170,2,t,'黄色の 線',STR,{g:seg(p,.05,.2)})+bob(1060,170,0,t,'灰色の 線',WEAK,{g:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('揺れの 幅',960,70,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(760,360,400,110,label('消えた？ → 偏った',960,428,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'predans']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.35})+allLines({});
  s+=card(720,40,440,280,label('どこでも 2倍？',940,100,{size:32,color:C.dim,anchor:'middle',weight:700})+label('いいえ',940,160,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.45,.6),label('大きく 揺れる 場所 と',940,250,{size:28,color:STR,anchor:'middle',weight:700})+label('ほとんど 揺れない 場所',940,295,{size:28,color:WEAK,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 1波長の差は1周期の遅れ =================
 [K+'which']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.3})+allLines({});
  s+=pathTo(PP,'P',{g:seg(p,.1,.25),gp:seg(p,.55,.7)});
  s+=card(760,40,400,200,label('P は どちらの 線？',960,108,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  s+=fade(seg(p,.6,.75),label('手がかり：道のり',960,210,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'P']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.3})+allLines({gs:.3,gw:.3});
  s+=pathTo(PP,'P',{l1:'10 cm',l2:'14 cm',gp:1});
  s+=card(720,40,440,120,label('経路差 ＝ 道のりの 差',940,112,{size:32,color:LC,anchor:'middle',weight:700}),seg(p,.55,.7),LC);
  s+=tag('定義',940,210,{color:LC,g:seg(p,.7,.85)});
  return s;
 },
 [K+'one']:(p)=>{
  let s=tracks(10,12,{g:seg(p,.05,.2),extra:seg(p,.3,.45),etext:'2.0 cm ＝ 1波長'});
  s+=card(250,410,700,90,label('どれだけ 遅れて 届く？',600,468,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'delay']:(p)=>{
  const q=lin(p,.05,.9)*.95;
  let s=tracks(10,12,{etext:'2.0 cm ＝ 1波長',q,clock:''});
  s+=card(60,400,780,100,T2(`\\dfrac{2.0}{10}=0.20\\ \\mathrm{s}`,450,452,{size:40,auto:false}),seg(p,.3,.45),TCOL);
  s+=fade(seg(p,.8,.92),label('＝ 1周期',1000,465,{size:34,color:TCOL,anchor:'end',weight:700}));
  return s;
 },
 [K+'gen1']:(p)=>{
  let s=card(140,40,920,150,eqRow('遅れ',`=\\dfrac{${Lt}}{${vt}}`,420,115,{size:52}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.35,.5),T2(`${vt}=${ft}${Lt}`,900,115,{size:40}));
  s+=card(140,230,920,150,eqRow('遅れ',`=\\dfrac{${Lt}}{${ft}${Lt}}`,420,305,{size:52}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'gen2']:(p)=>{
  const c=seg(p,.05,.25);
  const can=`{\\color{#ff8f9b}\\cancel{\\color{${LC}}\\lambda}}`;
  let s=card(140,20,920,190,eqRow('遅れ',`=\\dfrac{${c>.5?can:Lt}}{${ft}${c>.5?can:Lt}}`,420,125,{size:52}),1,C.dim);
  s+=fade(seg(p,.3,.45),T2(`=\\dfrac{1}{${ft}}=${Tt}`,620,125,{size:52,anchor:'start'}));
  s+=card(140,250,920,120,label('1波長 余分な 道 → いつでも 1周期の 遅れ',600,322,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  s+=tag('導いた 結果',600,440,{color:C.hi,g:seg(p,.75,.9)});
  return s;
 },
 [K+'graphs']:(p)=>{
  let s=tgraph({tau:1,u:seg(p,.45,.85),ghost:seg(p,.2,.4)*(1-seg(p,.85,.95))});
  s+=fade(seg(p,.6,.8),label('1周期 遅れ',TG.x0+TG.per*2.5+16,TG.ys[1]-TG.A-36,{size:26,color:TCOL,weight:700}));
  return s;
 },
 [K+'same']:(p)=>{
  let s=tgraph({tau:1,u:1,gs:seg(p,.45,.65)});
  s+=fade(seg(p,.1,.3),label('ぴったり 同じ 揺れ',1080,TG.ys[1]+TG.A+40,{size:26,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.7,.85),label('幅 2倍',TG.x0-16,TG.ys[2]+44,{size:26,color:C.hi,anchor:'end',weight:700}));
  return s;
 },
 [K+'mlam']:(p)=>{
  const cols=[{h:'経路差',color:LC,w:260},{h:'遅れ',color:TCOL,w:260},{h:'重なり方',color:C.hi,w:300}];
  const rows=[['1λ','1周期','山 ＋ 山'],['2λ','2周期','山 ＋ 山'],['3λ','3周期','山 ＋ 山']];
  return table({x:190,y:70,cols,rows,reveal:[1,seg(p,.1,.3),seg(p,.4,.6)],rh:80,size:34,hl:p>.75?[0,1,2]:[]});
 },
 [K+'cond']:(p)=>{
  let s=card(150,50,900,170,eqRow('経路差',`=m${Lt}`,480,130,{size:60}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.2,.35),label('→ 強め合い',760,145,{size:36,color:C.hi,weight:700}));
  s+=fade(seg(p,.5,.65),T2('m=0,\\ 1,\\ 2,\\ \\cdots',600,300,{size:44,auto:false})+label('（整数）',820,312,{size:28,color:C.dim,weight:700}));
  s+=tag('導いた 結果',600,420,{color:C.hi,g:seg(p,.75,.9)});
  return s;
 },
 [K+'Pchk']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.3})+allLines({hlS:4,dimOthers:.25,gs:1,gw:1});
  s+=pathTo(PP,'P',{l1:'10 cm',l2:'14 cm'});
  s+=card(680,30,500,100,T2(`14-10=4.0${CM}`,930,88,{size:40,auto:false}),seg(p,.05,.2),LC);
  s+=card(680,150,500,100,T2(`=2\\times 2.0${CM}=2${Lt}`,930,208,{size:40}),seg(p,.4,.55),LC);
  s+=tag('強め合い（m ＝ 2）',930,310,{color:STR,g:seg(p,.7,.85),size:28});
  return s;
 },
 // ================= S5 半波長の差は半周期の遅れ =================
 [K+'half']:(p)=>{
  const q=lin(p,.25,.9)*.9;
  let s=tracks(10,11,{g:seg(p,.0,.12),extra:seg(p,.05,.2),etext:'1.0 cm ＝ 半波長',q});
  s+=card(60,400,780,100,T2(`\\dfrac{1.0}{10}=0.10\\ \\mathrm{s}`,450,452,{size:40,auto:false}),seg(p,.45,.6),TCOL);
  s+=fade(seg(p,.75,.88),label('＝ 半周期',1000,465,{size:34,color:TCOL,anchor:'end',weight:700}));
  return s;
 },
 [K+'halfg']:(p)=>{
  let s=tgraph({tau:.5,u:seg(p,.05,.35),gs:seg(p,.5,.65)});
  s+=fade(seg(p,.35,.5),label('山 に 谷',TG.x0+TG.per*1.75,TG.ys[1]+TG.A+40,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('打ち消し合う',1080,TG.ys[2]-30,{size:26,color:C.dim,anchor:'end',weight:700}));
  return s;
 },
 [K+'halfm']:(p)=>{
  const cols=[{h:'経路差',color:LC,w:260},{h:'遅れ',color:TCOL,w:300},{h:'重なり方',color:C.dim,w:260}];
  const rows=[['0.5λ','半周期','山 ＋ 谷'],['1.5λ','1周期 ＋ 半周期','山 ＋ 谷'],['2.5λ','2周期 ＋ 半周期','山 ＋ 谷']];
  let s=table({x:190,y:30,cols,rows,reveal:[1,seg(p,.05,.2),seg(p,.2,.35)],rh:66,size:30});
  s+=card(190,330,820,130,eqRow('経路差',`=\\left(m+\\tfrac12\\right)${Lt}`,420,395,{size:52})+fade(seg(p,.7,.8),label('→ 弱め合い',760,410,{size:32,color:C.ink,weight:700})),seg(p,.5,.65),C.dim);
  return s;
 },
 [K+'Q']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.3})+allLines({hlW:3,dimOthers:.25});
  s+=pathTo(QQ,'Q',{l1:'10 cm',l2:'13 cm'});
  s+=card(680,30,500,100,T2(`13-10=3.0${CM}=1.5${Lt}`,930,88,{size:38}),seg(p,.15,.3),LC);
  s+=card(680,150,500,100,T2(`=\\left(1+\\tfrac12\\right)${Lt}`,930,208,{size:40}),seg(p,.45,.6),LC);
  s+=tag('弱め合い',930,310,{color:WEAK,g:seg(p,.75,.88),size:30});
  return s;
 },
 [K+'zero']:(p)=>{
  const a=1-.4*seg(p,.5,.7);
  let s=tgraph({tau:.5,u:1,gs:1,A2:a});
  s+=fade(seg(p,.05,.2)*(1-seg(p,.45,.55)),label('振幅が 等しい → 0',1080,TG.ys[2]-30,{size:26,color:C.dim,anchor:'end',weight:700}));
  s+=fade(seg(p,.7,.85),label('振幅が 違う → 小さく 揺れ残る',1080,TG.ys[2]-50,{size:26,color:C.hi,anchor:'end',weight:700}));
  return s;
 },
 [K+'anti']:(p)=>{
  let s=card(80,50,500,300,'',seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.05,.2),label('同位相',330,110,{size:34,color:C.hi,anchor:'middle',weight:700})+arrow(250,220,250,160,{color:W1,w:6,head:16})+arrow(410,220,410,160,{color:W2,w:6,head:16})+label('同時に 山',330,260,{size:24,color:C.dim,anchor:'middle'})+label('mλ → 強め合い',330,320,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(620,50,500,300,'',seg(p,.45,.6),C.a);
  s+=fade(seg(p,.45,.6),label('半周期 ずれた 波源',870,110,{size:32,color:C.a,anchor:'middle',weight:700})+arrow(790,220,790,160,{color:W1,w:6,head:16})+arrow(950,160,950,220,{color:W2,w:6,head:16})+label('一方が 山、他方が 谷',870,260,{size:24,color:C.dim,anchor:'middle'})+label('mλ → 弱め合い',870,320,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.88),label('強め合い と 弱め合い が 入れ替わる',600,440,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mis']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.25})+allLines({gs:.6,gw:.6})+pathTo(PP,'P')+pathTo(QQ,'Q');
  s+=card(680,30,500,100,label('× 経路差が 大きいほど 弱め合う',930,92,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(680,160,500,130,'',seg(p,.5,.65),C.dim);
  s+=fade(seg(p,.5,.65),label('P：4.0 cm → 強め合い',700,200,{size:28,color:STR,weight:700})+label('Q：3.0 cm → 弱め合い',700,250,{size:28,color:WEAK,weight:700}));
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=card(160,40,880,110,label('見るのは「波長の 何個分か」',600,108,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(160,200,420,120,label('整数',370,252,{size:34,color:STR,anchor:'middle',weight:700})+label('→ 強め合い',370,298,{size:28,color:STR,anchor:'middle',weight:700}),seg(p,.4,.55),STR);
  s+=card(620,200,420,120,label('整数 と 半分',830,252,{size:34,color:WEAK,anchor:'middle',weight:700})+label('→ 弱め合い',830,298,{size:28,color:WEAK,anchor:'middle',weight:700}),seg(p,.65,.8),WEAK);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=tank(t,{op:.3})+allLines({});
  s+=card(680,30,500,110,T2(`m${Lt}`,760,92,{size:44})+label('→ 強め合い',830,96,{size:30,color:STR,weight:700}),seg(p,.1,.25),STR);
  s+=card(680,160,500,110,T2(`\\left(m+\\tfrac12\\right)${Lt}`,800,222,{size:40})+label('→ 弱め合い',920,226,{size:30,color:WEAK,weight:700}),seg(p,.5,.65),WEAK);
  return s;
 },
 [K+'light']:(p)=>{
  let s=card(160,40,880,120,label('光の 波長：たとえば 600 nm',600,115,{size:36,color:LC,anchor:'middle',weight:700}),seg(p,.3,.45),LC);
  s+=card(160,200,880,120,T2('600\\ \\mathrm{nm}=0.0006\\ \\mathrm{mm}',600,262,{size:44,auto:false}),seg(p,.6,.75),LC);
  s+=fade(seg(p,.8,.92),label('（1 mm の 千分の一 ＝ 0.001 mm より 短い）',600,400,{size:30,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=tankT(p,ctx);let s=fade(.3,tank(t)+allLines({}));
  s+=card(130,60,940,190,label('1 mm の 千分の一 より 短い 波長',600,130,{size:34,color:LC,anchor:'middle',weight:700})+label('模様を どうすれば 目で 見られる？',600,200,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,230,label('次の回',600,175,{size:28,color:C.dim,anchor:'middle'})+label('深く学ぶ 2/2：光の 縞の 間隔',600,265,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
};
