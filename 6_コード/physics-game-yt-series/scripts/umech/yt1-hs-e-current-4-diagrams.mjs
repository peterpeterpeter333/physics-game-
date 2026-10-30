// 高校編「電流とオームの法則・深く学ぶ 4/4」(ys-hs-e-current-4) — 図。Stage 1200×515.
// 色：電流 I 緑、電圧 V 紫、抵抗 R 白、エネルギー 橙、電荷 桃。電池の長い線＝＋極（右）。
// 直列：同じ緑の矢印が2本を貫き、紫の電圧の棒が2段に積まれる。並列：紫の棒は両枝で同じ高さ、緑の矢印が分かれて合流。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,axes,brace,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,IC,VC,QC,WC,NEG,POS,It,Vt,Rt,qtok,battery,resistor,along,pathLen,fcard} from './yt1-hs-e-current-1-diagrams.mjs';

const K='hs-e-current-4:';
const R1=`${Rt}_1`,R2=`${Rt}_2`,I1=`${It}_1`,I2=`${It}_2`;
// ---- series circuit ---------------------------------------------------------------------------
export const SC={L:80,R:640,T:150,B:420,bx:360,r1:[150,310],r2:[410,570]};
export function series({g=1,cur=0,lab=['R₁','R₂'],batt='',vb=0,vtext=['',''],tok=null,t=0,vt=''}={}){
 const {L,R,T,B,bx,r1,r2}=SC;let s='';
 s+=line(L,T,r1[0],T,{color:C.dim,w:4})+resistor(r1[0],r1[1],T,{n:5})+line(r1[1],T,r2[0],T,{color:C.dim,w:4})+resistor(r2[0],r2[1],T,{n:5})+line(r2[1],T,R,T,{color:C.dim,w:4});
 s+=line(R,T,R,B,{color:C.dim,w:4})+line(L,T,L,B,{color:C.dim,w:4})+line(L,B,bx-11,B,{color:C.dim,w:4})+line(bx+11,B,R,B,{color:C.dim,w:4})+battery(bx,B,{text:batt,pos:'left'});
 s+=label(lab[0],(r1[0]+r1[1])/2,T-34,{size:28,color:C.ink,anchor:'middle',weight:700})+label(lab[1],(r2[0]+r2[1])/2,T-34,{size:28,color:C.ink,anchor:'middle',weight:700});
 if(cur)s+=fade(cur,arrow(R-30,B,bx+50,B,{color:IC,w:6,head:18})+arrow(R,T+40,R,B-30,{color:IC,w:6,head:18})+arrow(L,B-40,L,T+40,{color:IC,w:6,head:18})+arrow(bx-50,B,L+30,B,{color:IC,w:6,head:18})
  +arrow(r1[0],T+44,r1[1],T+44,{color:IC,w:5,head:16})+arrow(r2[0],T+44,r2[1],T+44,{color:IC,w:5,head:16}));
 if(vb){const y=T+100;s+=fade(vb,vbr(r1[0],r1[1],y,vtext[0])+vbr(r2[0],r2[1],y,vtext[1]));}
 if(vt)s+=label(vt,bx,B+62,{size:28,color:VC,anchor:'middle',weight:700});
 if(tok!==null){const P=[[L,B],[L,T],[R,T],[R,B]];for(let k=0;k<10;k++){const [x,y]=along(P,(k/10+t*.06)%1);s+=qtok(x,y);}}
 return fade(g,s);
}
// battery pos:'left' → ＋ (long plate) on the left: current leaves ＋, runs left along the bottom, up the left side,
// rightwards along the top through R₁ then R₂, down the right side, back to −.
function vbr(a,b,y,text){return line(a,y,b,y,{color:VC,w:3})+line(a,y-10,a,y+10,{color:VC,w:3})+line(b,y-10,b,y+10,{color:VC,w:3})+(text?label(text,(a+b)/2,y+36,{size:26,color:VC,anchor:'middle',weight:700}):'');}
// ---- parallel circuit -------------------------------------------------------------------------
export const PC={L:80,R:640,nA:230,nB:500,y1:120,y2:260,B:420,bx:360};
export function parallel({g=1,cur=0,lab=['R₁','R₂'],batt='',vb=0,vtext=['',''],itext=['','',''],vt=''}={}){
 const {L,R,nA,nB,y1,y2,B,bx}=PC,ym=(y1+y2)/2;let s='';
 const ra=nA+60,rb=nB-60;
 s+=line(nA,y1,nA,y2,{color:C.dim,w:4})+line(nB,y1,nB,y2,{color:C.dim,w:4});
 s+=line(nA,y1,ra,y1,{color:C.dim,w:4})+resistor(ra,rb,y1,{n:5})+line(rb,y1,nB,y1,{color:C.dim,w:4});
 s+=line(nA,y2,ra,y2,{color:C.dim,w:4})+resistor(ra,rb,y2,{n:5})+line(rb,y2,nB,y2,{color:C.dim,w:4});
 s+=dot(nA,ym,0)+line(L,ym,nA,ym,{color:C.dim,w:4})+line(nB,ym,R,ym,{color:C.dim,w:4})+line(L,ym,L,B,{color:C.dim,w:4})+line(R,ym,R,B,{color:C.dim,w:4});
 s+=line(L,B,bx-11,B,{color:C.dim,w:4})+line(bx+11,B,R,B,{color:C.dim,w:4})+battery(bx,B,{text:batt,pos:'left'});
 s+=dot(nA,ym,7,C.ink)+dot(nB,ym,7,C.ink);
 s+=label(lab[0],(ra+rb)/2,y1-30,{size:28,color:C.ink,anchor:'middle',weight:700})+label(lab[1],(ra+rb)/2,y2+52,{size:28,color:C.ink,anchor:'middle',weight:700});
 if(cur){
  s+=fade(cur,arrow(bx-50,B,L+30,B,{color:IC,w:6,head:18})+arrow(L,B-30,L,ym+20,{color:IC,w:6,head:18})+arrow(L+20,ym,nA-14,ym,{color:IC,w:6,head:18})
   +arrow(ra-50,y1,ra-4,y1,{color:IC,w:5,head:15})+arrow(ra-50,y2,ra-4,y2,{color:IC,w:5,head:15})
   +arrow(nB+14,ym,R-20,ym,{color:IC,w:6,head:18})+arrow(R,ym+20,R,B-30,{color:IC,w:6,head:18})+arrow(R-30,B,bx+50,B,{color:IC,w:6,head:18}));
  if(itext[0])s+=fade(cur,label(itext[0],L+18,ym+70,{size:26,color:IC,weight:700})+label(itext[1],ra-30,y1+36,{size:24,color:IC,anchor:'middle',weight:700})+label(itext[2],ra-30,y2+36,{size:24,color:IC,anchor:'middle',weight:700}));
 }
 if(vb)s+=fade(vb,vbr(ra,rb,y1+44,'')+vbr(ra,rb,y2-44,'')+label(vtext[0],(ra+rb)/2+0,y1+80,{size:24,color:VC,anchor:'middle',weight:700}));
 if(vt)s+=label(vt,bx,B+62,{size:28,color:VC,anchor:'middle',weight:700});
 return fade(g,s);
}
const PX=700;
const eq=(src,y,{g=1,size=44,col=C.ink}={})=>fade(g,T2(src,930,y,{size,color:col}));
const panel=(inner,g=1,col=C.faint)=>card(PX,60,460,400,inner,g,col);

export const hsECurrent4Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  const R2a=(x,y)=>resistor(x-60,x+60,y,{n:4,amp:14});
  let s=card(80,90,480,300,label('1列に つなぐ',320,150,{size:30,color:C.ink,anchor:'middle',weight:700})+line(110,260,150,260,{color:C.dim,w:4})+R2a(210,260)+line(270,260,370,260,{color:C.dim,w:4})+R2a(430,260)+line(490,260,530,260,{color:C.dim,w:4})+label('？',320,350,{size:40,color:C.hi,anchor:'middle',weight:700}),1,C.faint);
  s+=card(640,90,480,300,label('枝分かれ させる',880,150,{size:30,color:C.ink,anchor:'middle',weight:700})+line(680,250,760,250,{color:C.dim,w:4})+line(760,210,760,290,{color:C.dim,w:4})+line(760,210,820,210,{color:C.dim,w:4})+R2a(880,210)+line(940,210,1000,210,{color:C.dim,w:4})+line(760,290,820,290,{color:C.dim,w:4})+R2a(880,290)+line(940,290,1000,290,{color:C.dim,w:4})+line(1000,210,1000,290,{color:C.dim,w:4})+line(1000,250,1080,250,{color:C.dim,w:4})+label('？',880,355,{size:40,color:C.hi,anchor:'middle',weight:700}),1,C.faint);
  s+=fade(seg(p,.3,.45),label('全体の 通りにくさは？',600,460,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p)=>{
  let s=series({g:seg(p,.05,.2),lab:['','']})+fade(seg(p,.05,.2),label('直列',360,40,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),`<g transform="translate(610 20) scale(.9)">${parallel({lab:['','']})}</g>`+label('並列',900,40,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'guess']:(p)=>{
  let s=parallel({lab:['6 Ω','3 Ω']});
  s+=panel(label('全体は',930,140,{size:30,color:C.ink,anchor:'middle'})+label('9 Ω より',930,210,{size:34,color:C.ink,anchor:'middle',weight:700})+label('大きい？',860,300,{size:34,color:C.hi,anchor:'middle',weight:700})+label('小さい？',1000,300,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 // ================= S2 直列 =================
 [K+'series']:(p)=>series({g:seg(p,.05,.25)})+fade(seg(p,.4,.55),label('直列：1列に つなぐ',930,250,{size:32,color:C.hi,anchor:'middle',weight:700})),
 [K+'assume']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=series({tok:1,t});
  s+=panel(label('途中に 電荷が',930,170,{size:30,color:C.ink,anchor:'middle'})+label('たまり 続けない',930,225,{size:30,color:C.ink,anchor:'middle',weight:700})+tag('仮定',930,310,{color:C.hi,size:28})+label('（電流が 一定の 状態）',930,380,{size:24,color:C.dim,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'sameI']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=series({tok:1,t,cur:seg(p,.4,.55)});
  s+=panel(label('1本目を 出た 電荷',930,150,{size:28,color:QC,anchor:'middle',weight:700})+label('→ そのまま 2本目へ',930,200,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.55,.7),label('どちらにも',930,290,{size:28,color:C.ink,anchor:'middle'})+label('同じ 電流',880,350,{size:34,color:IC,anchor:'middle',weight:700})+T2(It,1010,345,{size:44})),seg(p,.05,.2),IC);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=series({cur:1});
  s+=panel(label('深く学ぶ 1/4',930,170,{size:28,color:C.dim,anchor:'middle'})+label('電流は 途中で',930,250,{size:32,color:C.ink,anchor:'middle',weight:700})+label('減らない',930,310,{size:36,color:IC,anchor:'middle',weight:700}),seg(p,.05,.2),IC);
  return s;
 },
 [K+'each']:(p)=>{
  let s=series({cur:1,vb:seg(p,.1,.3),vtext:['','']});
  s+=fade(seg(p,.2,.35),T2(`${R1}${It}`,(SC.r1[0]+SC.r1[1])/2,SC.T+150,{size:36}));
  s+=fade(seg(p,.5,.65),T2(`${R2}${It}`,(SC.r2[0]+SC.r2[1])/2,SC.T+150,{size:36}));
  s+=panel(label('それぞれに',930,150,{size:28,color:C.ink,anchor:'middle'})+label('オームの法則',930,200,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(`${Vt}=${Rt}${It}`,930,290,{size:46}),seg(p,.05,.2),VC);
  return s;
 },
 [K+'vsum']:(p)=>{
  let s=series({cur:1,vb:1});
  s+=T2(`${R1}${It}`,(SC.r1[0]+SC.r1[1])/2,SC.T+150,{size:36})+T2(`${R2}${It}`,(SC.r2[0]+SC.r2[1])/2,SC.T+150,{size:36});
  // stacked voltage bars
  const x=760,base=400,u=70;
  s+=fade(seg(p,.1,.25),rect(x,base-u,90,u,{fill:VC,fo:.5,stroke:VC,sw:2,rx:4})+T2(`${R1}${It}`,x+45,base-u/2+10,{size:30}));
  s+=fade(seg(p,.3,.45),rect(x,base-2.5*u,90,1.5*u,{fill:VC,fo:.35,stroke:VC,sw:2,rx:4})+T2(`${R2}${It}`,x+45,base-1.75*u+10,{size:30}));
  s+=fade(seg(p,.1,.25),label('1 C が 渡す エネルギー',805,base+44,{size:24,color:WC,anchor:'middle',weight:700}));
  s+=card(890,170,280,150,T2(`${Vt}=${R1}${It}+${R2}${It}`,1030,255,{size:32}),seg(p,.6,.75),VC);
  return s;
 },
 [K+'factor']:(p)=>{
  let s=fade(.55,T2(`${Vt}=${R1}${It}+${R2}${It}`,600,90,{size:42}));
  s+=fade(seg(p,.1,.25),label('I で くくる',600,170,{size:28,color:C.hi,anchor:'middle',weight:700})+arrow(600,185,600,230,{color:C.hi,w:4,head:14}));
  s+=fcard(300,250,600,160,`${Vt}=(${R1}+${R2})${It}`,{size:56,col:VC,g:seg(p,.3,.45)});
  return s;
 },
 [K+'compare']:(p)=>{
  let s=card(100,60,480,130,T2(`${Vt}=(${R1}+${R2})${It}`,340,135,{size:42}),1,C.faint);
  s+=card(620,60,480,130,T2(`${Vt}=${Rt}${It}`,860,135,{size:42})+label('全体を 1本と みる',860,225,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.faint);
  s+=fade(seg(p,.4,.5),label('比べる',600,240,{size:28,color:C.hi,anchor:'middle',weight:700})+arrow(600,250,600,275,{color:C.hi,w:4,head:12}));
  s+=fcard(330,280,540,160,`${Rt}=${R1}+${R2}`,{size:60,col:C.hi,g:seg(p,.55,.7)});
  return s;
 },
 [K+'three']:(p)=>{
  let s=fcard(330,60,540,150,`${Rt}=${R1}+${R2}`,{size:56,col:C.hi});
  s+=fade(seg(p,.3,.45),T2(`${Rt}=${R1}+${R2}+${Rt}_3+\\cdots`,600,330,{size:46}));
  s+=fade(seg(p,.3,.45),label('3本 以上でも 全部 足す',600,420,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=series({lab:['2.0 Ω','3.0 Ω'],vt:'10 V'});
  s+=panel(T2(`${Rt}=2.0+3.0`,930,170,{size:42,auto:false})+fade(seg(p,.5,.65),T2(`=5.0\\ \\Omega`,930,270,{size:46,auto:false,color:C.hi})),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'exI']:(p)=>{
  let s=series({lab:['2.0 Ω','3.0 Ω'],vt:'10 V',cur:seg(p,.4,.6)});
  s+=panel(T2(`${Rt}=5.0\\ \\Omega`,930,140,{size:40,auto:false})+fade(seg(p,.1,.25),T2(`${It}=\\dfrac{10}{5.0}=2.0\\ \\mathrm{A}`,930,290,{size:44,auto:false})),1,IC);
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=series({lab:['2.0 Ω','3.0 Ω'],vt:'10 V',cur:1,vb:1,vtext:['4.0 V','6.0 V']});
  const x=760,base=420,u=28;
  s+=fade(seg(p,.1,.25),rect(x,base-4*u,90,4*u,{fill:VC,fo:.5,stroke:VC,sw:2,rx:4})+label('4.0 V',x+45,base-2*u+9,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),rect(x,base-10*u,90,6*u,{fill:VC,fo:.35,stroke:VC,sw:2,rx:4})+label('6.0 V',x+45,base-7*u+9,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),line(x-10,base-10*u,x+120,base-10*u,{color:C.hi,w:3,dash:'6 5'})+label('合計 10 V',x+140,base-10*u+9,{size:30,color:C.hi,weight:700}));
  s+=fade(seg(p,.05,.2),label('2.0 × 2.0 ＝ 4.0',1010,330,{size:24,color:C.dim,anchor:'middle'})+label('3.0 × 2.0 ＝ 6.0',1010,370,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'mis']:(p)=>{
  let s=series({lab:['2.0 Ω','3.0 Ω'],vt:'10 V',cur:1});
  s+=label('2.0 A',(SC.r1[0]+SC.r1[1])/2,SC.T+90,{size:26,color:IC,anchor:'middle',weight:700})+label('2.0 A',(SC.r2[0]+SC.r2[1])/2,SC.T+90,{size:26,color:IC,anchor:'middle',weight:700});
  s+=panel(label('✕ 先の 抵抗で',930,150,{size:30,color:C.a,anchor:'middle',weight:700})+label('電流が 減る',930,200,{size:30,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('○ どちらも 2.0 A',930,320,{size:32,color:C.F,anchor:'middle',weight:700})),seg(p,.05,.2),C.faint);
  return s;
 },
 // ================= S3 並列 =================
 [K+'par']:(p)=>parallel({g:seg(p,.05,.25)})+fade(seg(p,.4,.55),label('並列：同じ 2点に つなぐ',930,250,{size:32,color:C.hi,anchor:'middle',weight:700})),
 [K+'sameV']:(p)=>{
  let s=parallel({vb:seg(p,.15,.35),vtext:['']});
  s+=fade(seg(p,.3,.45),T2(Vt,PC.nB-35,PC.y1+56,{size:30})+T2(Vt,PC.nB-35,PC.y2-32,{size:30}));
  s+=panel(label('両端が 同じ 2点',930,170,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ どちらの 枝にも',930,250,{size:28,color:C.ink,anchor:'middle'})+label('同じ 電圧',880,320,{size:34,color:VC,anchor:'middle',weight:700})+T2(Vt,1010,315,{size:44}),seg(p,.05,.2),VC);
  return s;
 },
 [K+'split']:(p)=>parallel({cur:seg(p,.05,.4),itext:['I','I₁','I₂']})+panel(label('分かれ道で 二手に',930,190,{size:30,color:IC,anchor:'middle',weight:700})+label('合流点で 一つに',930,280,{size:30,color:IC,anchor:'middle',weight:700}),seg(p,.3,.45),IC),
 [K+'isum']:(p)=>{
  let s=parallel({cur:1,itext:['I','I₁','I₂']});
  s+=panel(label('電荷は たまらない',930,150,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.3,.45),T2(`${It}=${I1}+${I2}`,930,270,{size:52})),seg(p,.05,.2),IC);
  return s;
 },
 [K+'sub']:(p)=>{
  let s=parallel({cur:1,itext:['I','I₁','I₂'],vb:1});
  s+=panel(T2(`${I1}=\\dfrac{${Vt}}{${R1}},\\ \\ ${I2}=\\dfrac{${Vt}}{${R2}}`,930,150,{size:38})+fade(seg(p,.45,.6),label('代入',930,240,{size:26,color:C.hi,anchor:'middle',weight:700})+T2(`${It}=\\dfrac{${Vt}}{${R1}}+\\dfrac{${Vt}}{${R2}}`,930,330,{size:44})),seg(p,.05,.2),IC);
  return s;
 },
 [K+'compare2']:(p)=>{
  let s=card(100,50,480,150,T2(`${It}=\\dfrac{${Vt}}{${R1}}+\\dfrac{${Vt}}{${R2}}`,340,135,{size:40}),1,C.faint);
  s+=card(620,50,480,150,T2(`${It}=\\dfrac{${Vt}}{${Rt}}`,860,135,{size:42})+label('全体を 1本と みる',860,235,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.faint);
  s+=fcard(250,290,700,170,`\\dfrac{${Vt}}{${Rt}}=\\dfrac{${Vt}}{${R1}}+\\dfrac{${Vt}}{${R2}}`,{size:50,col:C.hi,g:seg(p,.55,.7)});
  return s;
 },
 [K+'divide']:(p)=>{
  let s=fade(.55,T2(`\\dfrac{${Vt}}{${Rt}}=\\dfrac{${Vt}}{${R1}}+\\dfrac{${Vt}}{${R2}}`,600,90,{size:40}));
  s+=fade(seg(p,.05,.2),label('両辺を V で 割る',600,190,{size:28,color:C.hi,anchor:'middle',weight:700})+arrow(600,205,600,245,{color:C.hi,w:4,head:14}));
  s+=fcard(280,265,640,170,`\\dfrac{1}{${Rt}}=\\dfrac{1}{${R1}}+\\dfrac{1}{${R2}}`,{size:56,col:C.hi,g:seg(p,.25,.4)});
  s+=fade(seg(p,.6,.75),label('逆数の 足し算',600,480,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 数で確かめる =================
 [K+'ex3']:(p)=>{
  let s=parallel({lab:['6 Ω','3 Ω']});
  s+=panel(T2(`\\dfrac{1}{${Rt}}=\\dfrac{1}{6}+\\dfrac{1}{3}`,930,140,{size:42})+fade(seg(p,.3,.45),T2(`=\\dfrac{1}{6}+\\dfrac{2}{6}`,950,250,{size:42,auto:false}))+fade(seg(p,.6,.75),T2(`=\\dfrac{3}{6}=\\dfrac{1}{2}`,950,360,{size:42,auto:false,color:C.hi})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'ex4']:(p)=>{
  let s=parallel({lab:['6 Ω','3 Ω']});
  s+=panel(T2(`\\dfrac{1}{${Rt}}=\\dfrac{1}{2}`,930,130,{size:44})+fade(seg(p,.1,.25),label('逆数を とる',930,215,{size:26,color:C.hi,anchor:'middle',weight:700}))+fade(seg(p,.2,.35),T2(`${Rt}=2\\ \\Omega`,930,290,{size:50,auto:false,color:C.hi}))
   +fade(seg(p,.55,.7),label('✕ 9 Ω　✕ 1/2 Ω',930,400,{size:30,color:C.a,anchor:'middle',weight:700})),1,C.hi);
  return s;
 },
 [K+'check']:(p)=>{
  let s=parallel({lab:['6 Ω','3 Ω'],vt:'6 V',cur:seg(p,.3,.5),itext:['','','']});
  s+=fade(seg(p,.45,.6),label('1 A',PC.nA+20,PC.y1-14,{size:26,color:IC,weight:700}));
  s+=fade(seg(p,.65,.8),label('2 A',PC.nA+20,PC.y2+40,{size:26,color:IC,weight:700}));
  s+=panel(T2(`6\\div6=1\\ \\mathrm{A}`,930,170,{size:42,auto:false,color:IC})+fade(seg(p,.6,.75),T2(`6\\div3=2\\ \\mathrm{A}`,930,280,{size:42,auto:false,color:IC})),seg(p,.4,.55),IC);
  return s;
 },
 [K+'check2']:(p)=>{
  let s=parallel({lab:['6 Ω','3 Ω'],vt:'6 V',cur:1,itext:['3 A','','']});
  s+=label('1 A',PC.nA+20,PC.y1-14,{size:26,color:IC,weight:700})+label('2 A',PC.nA+20,PC.y2+40,{size:26,color:IC,weight:700});
  s+=panel(T2(`1+2=3\\ \\mathrm{A}`,930,150,{size:42,auto:false,color:IC})+fade(seg(p,.35,.5),T2(`6\\ \\mathrm{V}\\div3\\ \\mathrm{A}=2\\ \\Omega`,930,280,{size:42,auto:false,color:C.hi})),1,IC);
  return s;
 },
 [K+'smaller']:(p)=>{
  const bar=(x,v,t,col,g)=>fade(g,rect(x,420-v*40,120,v*40,{fill:col,fo:.45,stroke:col,sw:2,rx:6})+label(t,x+60,455,{size:28,color:C.ink,anchor:'middle',weight:700}));
  let s=bar(200,6,'6 Ω',C.dim,1)+bar(420,3,'3 Ω',C.dim,1)+bar(640,2,'並列 2 Ω',C.hi,seg(p,.1,.25));
  s+=card(840,150,320,160,label('どの 1本 より',1000,215,{size:28,color:C.ink,anchor:'middle'})+label('小さい',1000,270,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=card(150,70,900,140,T2(`\\dfrac{1}{${Rt}}=\\dfrac{1}{2}`,330,150,{size:44})+label('→ ✕',520,152,{size:30,color:C.a,anchor:'middle',weight:700})+T2(`${Rt}=\\dfrac{1}{2}\\ \\Omega`,700,150,{size:44,auto:false,color:C.a}),seg(p,.05,.2),C.a);
  s+=card(150,260,900,140,T2(`\\dfrac{1}{${Rt}}=\\dfrac{1}{2}`,330,340,{size:44})+label('→ ○',520,342,{size:30,color:C.F,anchor:'middle',weight:700})+T2(`${Rt}=2\\ \\Omega`,700,340,{size:44,auto:false,color:C.F})+label('逆数を とる',930,345,{size:26,color:C.F,anchor:'middle',weight:700}),seg(p,.55,.7),C.F);
  return s;
 },
 // ================= S5 同じものと足すもの =================
 [K+'swap']:(p)=>{
  let s=card(80,50,500,400,label('直列',330,110,{size:34,color:C.hi,anchor:'middle',weight:700})+label('同じ：電流',330,200,{size:32,color:IC,anchor:'middle',weight:700})+label('足す：電圧',330,270,{size:32,color:VC,anchor:'middle',weight:700})+T2(`${Rt}=${R1}+${R2}`,330,375,{size:40}),seg(p,.05,.2),C.faint);
  s+=card(620,50,500,400,label('並列',870,110,{size:34,color:C.hi,anchor:'middle',weight:700})+label('同じ：電圧',870,200,{size:32,color:VC,anchor:'middle',weight:700})+label('足す：電流',870,270,{size:32,color:IC,anchor:'middle',weight:700})+T2(`\\dfrac{1}{${Rt}}=\\dfrac{1}{${R1}}+\\dfrac{1}{${R2}}`,870,375,{size:40}),seg(p,.5,.65),C.faint);
  return s;
 },
 [K+'swap2']:(p)=>{
  let s=card(80,50,500,400,label('直列',330,110,{size:34,color:C.hi,anchor:'middle',weight:700})+label('同じ：電流',330,200,{size:32,color:IC,anchor:'middle',weight:700})+label('足す：電圧',330,270,{size:32,color:VC,anchor:'middle',weight:700})+T2(`${Rt}=${R1}+${R2}`,330,375,{size:40}),1,C.faint);
  s+=card(620,50,500,400,label('並列',870,110,{size:34,color:C.hi,anchor:'middle',weight:700})+label('同じ：電圧',870,200,{size:32,color:VC,anchor:'middle',weight:700})+label('足す：電流',870,270,{size:32,color:IC,anchor:'middle',weight:700})+T2(`\\dfrac{1}{${Rt}}=\\dfrac{1}{${R1}}+\\dfrac{1}{${R2}}`,870,375,{size:40}),1,C.faint);
  s+=fade(seg(p,.1,.3),label('⇄',600,240,{size:56,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'road']:(p)=>{
  let s=card(60,60,520,380,'',1,C.faint)+card(620,60,520,380,'',1,C.faint);
  s+=label('直列 ＝ 道が 長くなる',320,115,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=rect(100,230,200,40,{fill:'#8c97ad',fo:.5,stroke:C.dim,sw:2,rx:6})+rect(300,230,240,40,{fill:'#8c97ad',fo:.5,stroke:C.dim,sw:2,rx:6})+label('家',100,320,{size:26,color:C.ink,anchor:'middle'})+label('学校',540,320,{size:26,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.4,.55),label('並列 ＝ 道の 数が 増える',880,115,{size:28,color:C.hi,anchor:'middle',weight:700})+rect(680,190,400,36,{fill:'#8c97ad',fo:.5,stroke:C.dim,sw:2,rx:6})+rect(680,280,400,36,{fill:'#8c97ad',fo:.5,stroke:C.dim,sw:2,rx:6})+label('家',680,370,{size:26,color:C.ink,anchor:'middle'})+label('学校',1080,370,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'road2']:(p)=>{
  let s=card(60,60,520,380,'',1,C.faint)+card(620,60,520,380,'',1,C.faint);
  s+=label('直列 ＝ 道が 長くなる',320,115,{size:28,color:C.hi,anchor:'middle',weight:700})+rect(100,230,200,40,{fill:'#8c97ad',fo:.5,stroke:C.dim,sw:2,rx:6})+rect(300,230,240,40,{fill:'#8c97ad',fo:.5,stroke:C.dim,sw:2,rx:6});
  s+=label('並列 ＝ 道の 数が 増える',880,115,{size:28,color:C.hi,anchor:'middle',weight:700})+rect(680,190,400,36,{fill:'#8c97ad',fo:.5,stroke:C.dim,sw:2,rx:6})+rect(680,280,400,36,{fill:'#8c97ad',fo:.5,stroke:C.dim,sw:2,rx:6});
  s+=fade(seg(p,.1,.25),label('通りにくさ：足し算で 増える',320,370,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('どの 1本 よりも 通りやすい',880,390,{size:26,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'road3']:(p)=>{
  let s=fcard(80,120,500,170,`${Rt}=${R1}+${R2}`,{size:48,col:C.faint})+fcard(620,120,500,170,`\\dfrac{1}{${Rt}}=\\dfrac{1}{${R1}}+\\dfrac{1}{${R2}}`,{size:44,col:C.faint});
  s+=fade(seg(p,.2,.35),label('数を 出すのは いつも 式で',600,380,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'home']:(p)=>{
  let s=line(120,120,1080,120,{color:C.dim,w:5})+line(120,400,1080,400,{color:C.dim,w:5})+label('100 V',100,270,{size:30,color:VC,anchor:'end',weight:700})+arrow(110,135,110,385,{color:VC,w:3,head:12})+arrow(110,385,110,135,{color:VC,w:3,head:12});
  const items=['冷蔵庫','電灯','テレビ'];
  items.forEach((t,i)=>{const x=330+i*270,g=seg(p,.1+i*.12,.22+i*.12);s+=fade(g,line(x,120,x,200,{color:C.dim,w:4})+rect(x-70,200,140,120,{fill:'#131f38',fo:1,stroke:C.ink,sw:2,rx:10})+label(t,x,270,{size:28,color:C.ink,anchor:'middle',weight:700})+line(x,320,x,400,{color:C.dim,w:4})+label('100 V',x+80,265,{size:24,color:VC,weight:700}));});
  s+=fade(seg(p,.5,.65),label('家電は 並列：どれにも 100 V',600,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=card(80,90,500,300,label('直列',330,150,{size:34,color:C.hi,anchor:'middle',weight:700})+T2(`${Rt}=${R1}+${R2}`,330,270,{size:46}),seg(p,.05,.2),C.faint);
  s+=card(620,90,500,300,label('並列',870,150,{size:34,color:C.hi,anchor:'middle',weight:700})+T2(`\\dfrac{1}{${Rt}}=\\dfrac{1}{${R1}}+\\dfrac{1}{${R2}}`,870,270,{size:44}),seg(p,.3,.45),C.faint);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=card(80,90,500,300,label('直列',330,150,{size:34,color:C.hi,anchor:'middle',weight:700})+T2(`${Rt}=${R1}+${R2}`,330,240,{size:46})+fade(seg(p,.1,.25),label('共通：電流',330,340,{size:32,color:IC,anchor:'middle',weight:700})),1,C.faint);
  s+=card(620,90,500,300,label('並列',870,150,{size:34,color:C.hi,anchor:'middle',weight:700})+T2(`\\dfrac{1}{${Rt}}=\\dfrac{1}{${R1}}+\\dfrac{1}{${R2}}`,870,240,{size:44})+fade(seg(p,.35,.5),label('共通：電圧',870,340,{size:32,color:VC,anchor:'middle',weight:700})),1,C.faint);
  return s;
 },
 [K+'summary']:(p)=>{
  const it=(x,t,src,col,g)=>card(x,110,320,230,label(t,x+160,175,{size:32,color:col,anchor:'middle',weight:700})+T2(src,x+160,280,{size:40}),g,col);
  let s=it(60,'電流',`${It}=\\dfrac{\\Delta {\\color{${QC}}Q}}{\\Delta {\\color{#ffcf67}t}}`,IC,seg(p,.05,.2))+it(440,'電圧',`${Vt}=\\dfrac{{\\color{${WC}}W}}{{\\color{${QC}}Q}}`,VC,seg(p,.15,.3))+it(820,'抵抗',`${Rt}=\\dfrac{${Vt}}{${It}}`,C.ink,seg(p,.25,.4));
  s+=fade(seg(p,.5,.65),label('オームの法則 V＝RI（温度一定の 金属など）',600,420,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=resistor(250,550,220,{n:6})+line(120,220,250,220,{color:C.dim,w:4})+line(550,220,680,220,{color:C.dim,w:4});
  s+=arrow(280,300,520,300,{color:IC,w:6,head:18})+label('電流',400,345,{size:28,color:IC,anchor:'middle',weight:700});
  for(let i=0;i<5;i++){const x=290+i*55;s+=fade(seg(p,.2,.35),draw([[x,180],[x+10,160],[x,140],[x+10,120]],1,{color:WC,w:3}));}
  s+=card(760,110,400,260,label('電池が 渡した',960,175,{size:28,color:C.ink,anchor:'middle'})+label('エネルギーは',960,220,{size:28,color:WC,anchor:'middle',weight:700})+label('どこへ？',960,275,{size:34,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.55,.7),label('1秒あたり どれだけ？',960,335,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(250,170,700,140,label('次の単元「電力とジュール熱」へ',600,255,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
};
function highlight2(x,y,w,h){return rect(x,y,w,h,{fill:C.hi,fo:.08,stroke:C.hi,sw:3,rx:10});}
