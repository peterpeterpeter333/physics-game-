// 問題編 解説「二つの力で押される台車」（q-ui-newton-small-step、大学編 10 運動方程式・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/10_運動方程式.md の q-ui-newton-small-step（解説 17 行）。
// 画面：小問1 は左に台車と力、右に説明の枠（誤答カードは枠の下）。小問2・3 は上に台車か式の枠、左下に表、右に v–t グラフ。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：位置 x 水色、速度 v 紫、加速度 a 赤、力 F 緑、時間 t 金、強調 黄、誤りの線 灰色の点線。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly,cart} from './anim.mjs';
import {QX,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,cueT,tAt,sentWin,isProblem} from './yt1-qx-common.mjs';

const K='qx-ui-newton-small-step:';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cF=s=>`{\\color{${C.F}}${s}}`,cA=s=>`{\\color{${C.a}}${s}}`,cV=s=>`{\\color{${C.v}}${s}}`,cX=s=>`{\\color{${C.x}}${s}}`,cT=s=>`{\\color{${C.t}}${s}}`,cH=s=>`{\\color{${C.hi}}${s}}`;
const GRAY='#8a97ad';
const G1='0〜2.0 s の加速度 a',G2='t＝2.0 s の位置 x',G3='t＝3.0 s の位置 x';
const ANS1=g=>answerTag(1,'C','3 m/s²',{g}),ANS2=g=>answerTag(2,'D','6.0 m',{g}),ANS3=g=>answerTag(3,'A','12 m',{g});
const PX=680,PW=500,PC=PX+PW/2;
// 小問1 の大きな図：床 y＝420、x＝0 は 200 px、1 m＝30 px、1 N＝20 px
const O1={ox:200,k:30,fy:420},FK=20,R1=200+55,L1=200-55,Y1=420-18-27,TIP=R1+12*FK,YR=Y1-175;
const res9=()=>arrow(R1,YR,R1+9*FK,YR,{color:C.F,w:11,head:26})+label('9 N',R1+9*FK+14,YR+10,{size:32,color:C.F,weight:700});
const accA=()=>arrow(200,Y1-105,200+3*30,Y1-105,{color:C.a,w:7,head:20})+label('a',200+3*30+12,Y1-97,{size:30,color:C.a,weight:700});
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const W1={x:PX,w:PW,size:26,whySize:22};
const WL={x:20,w:680,size:26,whySize:22,y:262};
const win2=ctx=>{const W=sentWin(ctx);return W.length>1?W[1][0]:.5;};

// ---- 床と台車 ----------------------------------------------------------------
// ox：x＝0 の画面の位置、k：1 m あたりの px、fy：床の高さ、xm：台車の位置 [m]、fk：1 N あたりの px
function floor({ox,k,fy,g=1,max=12,step=2}){
 let s=arrow(ox-50,fy,ox+k*max+40,fy,{color:C.x,w:3,head:14});
 for(let m=0;m<=max;m+=step)s+=line(ox+k*m,fy-6,ox+k*m,fy+6,{color:C.x,w:2})+label(String(m),ox+k*m,fy+32,{size:22,color:C.x,anchor:'middle'});
 s+=label('x [m]',ox+k*max+60,fy+8,{size:22,color:C.x});
 return fade(g,s);
}
function cartAt({ox,k,fy,xm=0,cw=110,ch=54,mass='3 kg'}){
 const x=ox+k*xm;
 return cart(x,fy-2,{w:cw,h:ch,color:'#9fb2d4',text:mass,size:24});
}
// 力の矢印（緑）。台車の右の面から右向き 12 N、左の面から左向き 3 N。
function forces({ox,k,fy,xm=0,cw=110,ch=54,fk=16,g=1,y,lab=1}){
 const x=ox+k*xm,yy=y??fy-18-ch/2,R=x+cw/2,L=x-cw/2;
 return fade(g,arrow(R,yy,R+12*fk,yy,{color:C.F,w:6,head:18})+arrow(L,yy,L-3*fk,yy,{color:C.F,w:6,head:16})
  +fade(lab,label('12 N',R+12*fk+10,yy+9,{size:26,color:C.F,weight:700})+label('3 N',L-3*fk-10,yy+9,{size:26,color:C.F,weight:700,anchor:'end'})));
}

// ---- 表（0.5 s 刻み。横に時刻） -----------------------------------------------------
const TX=20,LW=150,CW=76,TY=262,RH=44;
const TS=['0','0.5','1.0','1.5','2.0','2.5','3.0'];
const VS=['0','1.5','3.0','4.5','6.0','6.0','6.0'];
const DXS=['0.375','1.125','1.875','2.625'];
const XS=['0','0.375','1.5','3.375','6.0','','12'];
const HS=['0','0.375','1.5','3.375','6.0'];
const colX=i=>TX+LW+CW*(i+.5),midX=i=>TX+LW+CW*(i+1),rowY=r=>TY+RH*r;
// v：v の数（0〜7）、dx：区間の距離の数、x：位置の数、xs：位置の文字の配列、h：½·3·t² の数（0 なら行なし）
function table({g=1,v=0,dx=0,x=0,h=0,hRow=0,vHi=-1,xHi=[],tHi=-1,vg=[],dxg=[],xg=[],hg=[],xs=XS}={}){
 const rows=hRow?5:4,W=LW+CW*7;
 let s=rect(TX,TY,W,RH*rows,{fill:'#101a30',fo:.9,stroke:C.faint,sw:2,rx:8});
 for(let r=1;r<rows;r++)s+=line(TX,rowY(r),TX+W,rowY(r),{color:C.faint,w:1.5});
 s+=line(TX+LW,TY,TX+LW,TY+RH*rows,{color:C.faint,w:1.5});
 const names=[['t [s]',C.t],['v [m/s]',C.v],['区間の距離',C.x],['位置 x [m]',C.x],['½·3·t²',C.hi]];
 names.slice(0,rows).forEach(([n,c],r)=>{s+=label(n,TX+12,rowY(r)+30,{size:22,color:c,weight:700});});
 if(tHi>=0)s+=rect(TX+LW+CW*tHi+3,TY+3,CW-6,RH*rows-6,{fill:C.hi,fo:.08,stroke:C.hi,sw:2.5,rx:6});
 TS.forEach((t,i)=>{s+=label(t,colX(i),rowY(0)+30,{size:22,color:C.t,anchor:'middle',weight:700});});
 for(let i=0;i<v;i++)s+=fade(vg[i]??1,label(VS[i],colX(i),rowY(1)+30,{size:22,color:i===vHi?C.hi:C.v,anchor:'middle',weight:700}));
 for(let i=0;i<dx;i++)s+=fade(dxg[i]??1,label(DXS[i],midX(i),rowY(2)+30,{size:22,color:C.x,anchor:'middle',weight:700}));
 for(let i=0;i<x;i++)if(xs[i])s+=fade(xg[i]??1,label(xs[i],colX(i),rowY(3)+30,{size:22,color:xHi.includes(i)?C.hi:C.x,anchor:'middle',weight:700}));
 if(hRow)for(let i=0;i<h;i++)s+=fade(hg[i]??1,label(HS[i],colX(i),rowY(4)+30,{size:22,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}

// ---- v–t グラフ ------------------------------------------------------------------
const GX=790,GY=440,GW=320,GH=290,TMAX=3.3,VMAX=9.6;
function graph({g=1}={}){
 const A=axes({x:GX,y:GY,w:GW,h:GH,xmax:TMAX,ymax:VMAX,xticks:[.5,1,1.5,2,2.5,3],yticks:[1.5,3,4.5,6,7.5,9],grid:true,g:1});
 // axes の目盛りの数は 21px なので、目盛りの線だけ使い、数は 22px で描き直す
 const svg=A.svg.replace(/<text[^>]*>[^<]*<\/text>/g,'');
 let s=svg;
 for(const t of [.5,1,1.5,2,2.5,3])s+=label(t.toFixed(1),A.X(t),GY+32,{size:22,color:C.t,anchor:'middle'});
 for(const v of [3,6,9])s+=label(v.toFixed(0),GX-14,A.Y(v)+8,{size:22,color:C.v,anchor:'end'});
 s+=label('t [s]',A.X(3)+26,GY+32,{size:22,color:C.t});
 s+=label('v [m/s]',GX,GY-GH-26,{size:22,color:C.v,anchor:'middle'});
 return {A,svg:fade(g,s)};
}
const vTrue=t=>t<=2?3*t:6;
// 「力を取り去る」の札（2.0 s の目盛りの上）
function removeTag(A,{g=1,glow=0}={}){
 const x=A.X(2),col=glow>.5?C.hi:C.dim;
 return fade(g,line(x,GY,x,GY-GH+16,{color:col,w:2.5,dash:'7 7'})
  +rect(x-82,GY-GH-10,164,36,{fill:'#1b2438',fo:.95,stroke:col,sw:2+glow*1.5,rx:18})+label('力を取り去る',x,GY-GH+16,{size:22,color:col,anchor:'middle',weight:700}));
}
function trapezoid(A,i,{g=1,fo=.3,col=C.x}={}){
 const t0=i*.5,t1=t0+.5;
 return fade(g,poly([[A.X(t0),A.Y(0)],[A.X(t0),A.Y(vTrue(t0))],[A.X(t1),A.Y(vTrue(t1))],[A.X(t1),A.Y(0)]],{fill:col,fo,stroke:col,sw:1.5}));
}
function stairs(A,{lower=1,g=1,col=GRAY,w=3}={}){
 const pts=[[A.X(0),A.Y(0)]];
 for(let i=0;i<4;i++){const t0=i*.5,t1=t0+.5,v=lower?vTrue(t0):vTrue(t1);pts.push([A.X(t0),A.Y(v)],[A.X(t1),A.Y(v)]);}
 pts.push([A.X(2),A.Y(0)]);
 return fade(g,draw(pts,1,{color:col,w,dash:'7 6'}));
}

// 上の枠（小問2・3 で、式や説明を置く）
const topCard=(inner,g=1,stroke=C.faint)=>card(20,86,682,150,inner,g,stroke);

// 小問3 の行14 の画面：2.0〜3.0 s の長方形「6.0 m」、表の 3.0 s の位置 12、答えの札
function ans3Scene({rect:rg=0,x12=0,ans=0}={}){
 const o={ox:140,k:38,fy:205,cw:90,ch:44,fk:13};
 let s=floor(o)+cartAt({...o,xm:12-1e-3});
 s+=table({v:7,dx:4,x:x12>0?7:5,xg:[1,1,1,1,1,1,x12],xHi:[6]});
 const {A,svg}=graph();s+=svg+removeTag(A,{glow:1});
 s+=fade(rg,poly([[A.X(2),A.Y(0)],[A.X(2),A.Y(6)],[A.X(3),A.Y(6)],[A.X(3),A.Y(0)]],{fill:C.x,fo:.32,stroke:C.x,sw:1.5})+label('6.0 m',A.X(2.5),A.Y(3)+8,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=A.plot(vTrue,{from:0,to:3,color:C.v,w:4});
 return s+goalTag(G3)+ANS3(ans);
}

export const ytQxUiNewtonSmallStepDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約5秒）：床と台車（x＝0）。0〜2 s 力の矢印2本（別々のまま）、2〜4 s 空の表（t の列だけ）と目盛りだけの v–t グラフ、4〜5 s「力を取り去る」の札。静止。
 [K+'q0']:(p)=>{
  const o={ox:140,k:38,fy:205,cw:90,ch:44,fk:13};
  let s=floor({...o,g:seg(p,0,.1)})+fade(seg(p,0,.1),cartAt(o));
  s+=forces({...o,g:seg(p,.1,.35),lab:seg(p,.2,.38)});
  s+=table({g:seg(p,.42,.62)});
  const {A,svg}=graph({g:seg(p,.45,.7)});s+=svg;
  s+=removeTag(A,{g:seg(p,.8,.95)});
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 台車と二つの力。右の枠「小問1／0〜2.0 s の 加速度 a は？」
 [K+'goal1']:(p)=>{
  let s=floor(O1)+cartAt(O1)+forces({...O1,fk:FK,g:seg(p,.05,.25)});
  s+=panel(90,250,label('小問1',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('0〜2.0 s の 加速度 a は？',PC,210,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('質量 3 kg、右向きが ＋',PC,280,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2a. 法則 ma＝F。「全部足した」で 3 N の矢印を 12 N の先へ継ぎ足す
 [K+'sum']:(p)=>{
  const mv=seg(p,.55,.85);
  let s=floor(O1)+cartAt(O1);
  s+=arrow(R1,Y1,TIP,Y1,{color:C.F,w:6,head:18})+label('12 N',TIP+10,Y1+9,{size:26,color:C.F,weight:700});
  // 3 N：左の面から → 12 N の矢印の先（少し上にずらして、左向きのまま）
  const tx=mix(L1,TIP,seg(p,.62,.85)),ty=mix(Y1,Y1-45,seg(p,.55,.63));
  s+=arrow(tx,ty,tx-3*FK,ty,{color:C.F,w:6,head:16})+(mv<.5?label('3 N',tx-3*FK-10,ty+9,{size:26,color:C.F,weight:700,anchor:'end'}):label('3 N',tx+10,ty+9,{size:26,color:C.F,weight:700}));
  s+=panel(90,250,kindTag('法則',PC,140,{g:seg(p,.05,.15)})+fade(seg(p,.08,.2),T(`m${cA('a')}=${cF('F')}`,PC,215,50))
   +fade(seg(p,.4,.55),label('F ＝ 力を 全部 足した 合力',PC,300,{size:28,color:C.F,anchor:'middle',weight:700})),seg(p,.02,.12),C.F);
  s+=goalTag(G1);
  return s;
 },
 // 2b. 右向きを正に：「−」の札 → 重なった所が打ち消し、残った右向き 9 N を太い緑で
 [K+'sum2']:(p)=>{
  const minus=seg(p,.3,.4),cancel=seg(p,.5,.65),res=seg(p,.62,.78);
  let s=floor(O1)+cartAt(O1);
  s+=arrow(R1,Y1,TIP,Y1,{color:C.F,w:6,head:18,opacity:1-.6*cancel})+label('12 N',TIP+10,Y1+9,{size:26,color:C.F,weight:700,opacity:1-.6*cancel});
  s+=fade(1-.6*cancel,arrow(TIP,Y1-45,TIP-3*FK,Y1-45,{color:C.F,w:6,head:16})+label('3 N',TIP+10,Y1-36,{size:26,color:C.F,weight:700}));
  s+=fade(minus,rect(TIP-3*FK/2-22,Y1-112,44,40,{fill:C.hi,fo:.15,stroke:C.hi,sw:2.5,rx:10})+label('−',TIP-3*FK/2,Y1-82,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(cancel,line(TIP-3*FK,Y1-14,TIP-3*FK,Y1-60,{color:C.hi,w:3,dash:'5 5'})+label('打ち消し',TIP-3*FK-12,Y1-80,{size:22,color:C.hi,anchor:'end'}));
  s+=fade(res,arrow(R1,YR,R1+9*FK,YR,{color:C.F,w:11,head:26})+label('9 N',R1+9*FK+14,YR+10,{size:32,color:C.F,weight:700}));
  s+=fade(res*.6,highlight(R1-10,YR-30,9*FK+80,60,1,C.F));
  const fl=`${cF('F')}=12+(-3)`,fr=`=${cF('9\\ \\mathrm{N}')}`,wl=texWidth(fl,36,false),wr=texWidth(fr,36,false),x0=PC-(wl+wr+8)/2;
  s+=panel(90,280,kindTag('法則',PC,140)+T(`m${cA('a')}=${cF('F')}`,PC,215,50)
   +fade(seg(p,.05,.15),line(PX+40,255,PX+PW-40,255,{color:C.faint,w:2})+label('合力（右向きが ＋）',PC,292,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.32,.45),T(fl,x0,340,36,{anchor:'start'}))+fade(seg(p,.62,.75),T(fr,x0+wl+8,340,36,{anchor:'start'}))
   ,1,C.F);
  s+=goalTag(G1);
  return s;
 },
 // 3. a＝F/m に 9 と 3 を一つずつ入れ、a＝3 m/s²（赤）。台車に赤の加速度の矢印。答えの札 C
 [K+'ans1']:(p,ctx)=>{
  const b=win2(ctx);
  let s=floor(O1)+cartAt(O1)+res9();
  s+=fade(seg(p,b*.75,b*.9),accA());
  const s9=seg(p,.15,.28),s3=seg(p,.28,.4);
  s+=panel(90,350,label('両辺を m で 割る',PC,132,{size:24,color:C.dim,anchor:'middle'})
   +T(`${cA('a')}=\\dfrac{${cF('F')}}{m}`,PC,205,40)
   +fade(s9*(1-s3),T(`=\\dfrac{${cF('9')}}{\\phantom{3}}`,PC,305,40))+fade(s3,T(`=\\dfrac{${cF('9')}}{3}`,PC,305,40))
   +fade(seg(p,.45,.6),T(`=${cA('3\\ \\mathrm{m/s^2}')}`,PC,395,44)),1,C.a);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.08));
  return s;
 },
 // 4. 誤答 A → B（1文目を半分ずつ）→ D（2文目）を一枚ずつ。枠は上に小さく
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1];
  let s=floor(O1)+cartAt(O1)+res9()+accA();
  s+=panel(90,150,label('小問1',PC,128,{size:24,color:C.dim,anchor:'middle'})+T(`${cA('a')}=\\dfrac{${cF('9\\ \\mathrm{N}')}}{3\\ \\mathrm{kg}}=${cA('3\\ \\mathrm{m/s^2}')}`,PC,190,34),1);
  s+=wrongSeq(p,ctx,[['A','4 m/s²','左向き 3 N を 入れていない（12÷3）'],['B','5 m/s²','向きを 考えず 12＋3＝15 N'],['D','9 m/s²','合力 9 N を m で 割っていない']],
   {win:[[0,e1*.5],[e1*.5,e1],[W[1]?W[1][0]:e1,1]],opts:{...W1,y:262}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 5. 誤答カードと力を消す。表と v–t グラフを大きく。求めるもの
 [K+'goal2']:(p)=>{
  let s=table({g:seg(p,.05,.25)});
  const {A,svg}=graph({g:seg(p,.1,.3)});s+=svg+removeTag(A,{g:seg(p,.1,.3)});
  s+=topCard(label('小問2',360,128,{size:24,color:C.dim,anchor:'middle'})+label('t ＝ 2.0 s の 位置 x は？',360,180,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('t ＝ 0 で 静止、x ＝ 0',360,220,{size:24,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 6. Δv＝aΔt＝1.5（＋1.5 の札）。2文目で v の列を1つずつ埋め、グラフに点を打つ
 [K+'dv']:(p,ctx)=>{
  const b=win2(ctx),ve=1-(ctx?.cue?.pause??1)/Math.max(1,ctx?.dur??10);
  const fill=i=>seg(p,b+(ve-b)*(i/5),b+(ve-b)*(i/5)+.04);
  const vg=[0,1,2,3,4].map(fill),n=vg.filter(x=>x>0).length;
  let s=table({v:n,vg});
  const {A,svg}=graph();s+=svg+removeTag(A);
  for(let i=0;i<5;i++)s+=fade(vg[i],dot(A.X(i*.5),A.Y(vTrue(i*.5)),8,C.v));
  s+=topCard(label('刻み 0.5 s の 速度の 増え分',360,124,{size:24,color:C.dim,anchor:'middle'})
   +T(`\\Delta ${cV('v')}=${cA('a')}\\,\\Delta ${cT('t')}=3\\times0.5=${cV('1.5\\ \\mathrm{m/s}')}`,360,190,36),seg(p,.02,.12));
  // ＋1.5 の札（表の v の行の上、隣の列の間）
  for(let i=1;i<5;i++)s+=fade(vg[i]*(1-seg(p,.97,1)),label('＋1.5',midX(i-1),TY-6,{size:22,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 7. 点を結ぶと一直線。「傾き 1.5÷0.5＝3」（赤）
 [K+'exact']:(p,ctx)=>{
  const b=win2(ctx);
  let s=table({v:5});
  const {A,svg}=graph();s+=svg+removeTag(A);
  s+=A.plot(vTrue,{from:0,to:2,p:seg(p,.05,.3),color:C.v,w:4});
  for(let i=0;i<5;i++)s+=dot(A.X(i*.5),A.Y(vTrue(i*.5)),8,C.v);
  // 傾きの三角形（1.0〜1.5 s）
  s+=fade(seg(p,.25,.4),draw([[A.X(1),A.Y(3)],[A.X(1.5),A.Y(3)],[A.X(1.5),A.Y(4.5)]],1,{color:C.a,w:3,dash:'5 5'})
   +label('傾き 1.5÷0.5 ＝ 3',A.X(1.5)+14,A.Y(3.6),{size:24,color:C.a,weight:700}));
  s+=topCard(label('力が 一定 → 刻みの 中でも',360,122,{size:26,color:C.ink,anchor:'middle'})+T(`${cA('a')}=${cA('3\\ \\mathrm{m/s^2}')}`,360,166,32)
   +fade(seg(p,b,b+.1),label('表は 近似 ではなく、ちょうどの 値',360,220,{size:26,color:C.hi,anchor:'middle',weight:700})),1);
  s+=goalTag(G2);
  return s;
 },
 // 8. 「平均の速度」で 0 と 1.5 を光らせ、真ん中 0.75 に黄の横線。「台形の面積」で 0〜0.5 s の台形を水色で塗る
 [K+'trap']:(p,ctx)=>{
  const b=win2(ctx),hiE=seg(p,.25,.32)*(1-seg(p,b,b+.05)),mid=seg(p,.35,.45);
  let s=table({v:5,vHi:-1});
  s+=fade(hiE,highlight(colX(0)-30,rowY(1)+4,CW*2-16,RH-8,1,C.hi));
  const {A,svg}=graph();s+=svg+removeTag(A);
  s+=trapezoid(A,0,{g:seg(p,b+.1,b+.25)});
  s+=A.plot(vTrue,{from:0,to:2,color:C.v,w:4});
  for(let i=0;i<5;i++)s+=dot(A.X(i*.5),A.Y(vTrue(i*.5)),i<2?8+4*hiE:8,i<2&&hiE>.5?C.hi:C.v);
  s+=fade(mid,line(A.X(0),A.Y(.75),A.X(.5),A.Y(.75),{color:C.hi,w:4})+label('0.75',A.X(.5)+10,A.Y(.75)-12,{size:22,color:C.hi,weight:700}));
  s+=topCard(label('区間の 距離 ＝ 平均の 速度 × 0.5 s',360,128,{size:26,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.42),T(`\\dfrac{0+1.5}{2}\\times0.5`,240,195,34))
   +fade(seg(p,b+.1,b+.25),label('＝ 細い 台形の 面積',520,205,{size:26,color:C.x,anchor:'middle',weight:700})),1);
  s+=goalTag(G2);
  return s;
 },
 // 9. 4つの台形を順に塗り、表の区間の距離と位置の列（水色）を埋める。答えの札 D
 [K+'ans2']:(p,ctx)=>{
  const b=win2(ctx),gi=i=>seg(p,.04+i*b*.22,.1+i*b*.22);
  const dxg=[0,1,2,3].map(gi),n=dxg.filter(x=>x>0).length;
  const xg=[seg(p,.02,.06),...dxg];
  let s=table({v:5,dx:n,dxg,x:1+n,xg,xHi:seg(p,b,b+.05)>0?[4]:[]});
  const {A,svg}=graph();s+=svg+removeTag(A);
  for(let i=0;i<4;i++)s+=trapezoid(A,i,{g:dxg[i],fo:i%2?.22:.34});
  s+=A.plot(vTrue,{from:0,to:2,color:C.v,w:4});
  for(let i=0;i<5;i++)s+=dot(A.X(i*.5),A.Y(vTrue(i*.5)),8,C.v);
  s+=topCard(label('区間の 距離を 足す',360,124,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.6),T(`0.375+1.125+1.875+2.625`,360,175,32))
   +fade(seg(p,b*.85,b),T(`={\\color{${C.x}}6.0\\ \\mathrm{m}}`,360,218,32)),1);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.08));
  return s;
 },
 // 10. ½at² の値を位置の列の下に並べ、6.0 どうしを黄で結ぶ
 [K+'check2']:(p)=>{
  const hg=[0,1,2,3,4].map(i=>seg(p,.1+i*.08,.16+i*.08));
  let s=table({v:5,dx:4,x:5,hRow:1,h:5,hg,xHi:seg(p,.55,.65)>0?[4]:[]});
  const lk=seg(p,.55,.65);
  s+=fade(lk,rect(colX(4)-34,rowY(3)+4,68,RH*2-8,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8})+label('一致',colX(4)+44,rowY(4)+10,{size:24,color:C.hi,weight:700}));
  const {A,svg}=graph();s+=svg+removeTag(A);
  for(let i=0;i<4;i++)s+=trapezoid(A,i,{fo:i%2?.22:.34});
  s+=A.plot(vTrue,{from:0,to:2,color:C.v,w:4});
  s+=topCard(label('確かめ',360,124,{size:24,color:C.dim,anchor:'middle'})
   +T(`\\tfrac{1}{2}${cA('a')}${cT('t')}^2=\\tfrac{1}{2}\\times3\\times2.0^2=${cX('6.0\\ \\mathrm{m}')}`,360,190,36),1,C.hi);
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 11. 誤答 A → C（1文目を半分ずつ）→ B（2文目）。下の階段（始めの速度）・上の階段（終わりの速度）・6 m/s の長方形を点線で
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],b2=W[1]?W[1][0]:e1;
  const inA=seg(p,.01,.05)*(1-seg(p,e1*.5-.04,e1*.5)),inC=seg(p,e1*.5+.01,e1*.5+.05)*(1-seg(p,e1-.04,e1)),inB=seg(p,b2+.01,b2+.05);
  const {A,svg}=graph();let s=svg+removeTag(A);
  for(let i=0;i<4;i++)s+=trapezoid(A,i,{fo:.18});
  s+=A.plot(vTrue,{from:0,to:2,color:C.v,w:4});
  s+=stairs(A,{lower:1,g:.35+.65*inA,col:inA>.5?C.hi:GRAY,w:3+2*inA});
  s+=stairs(A,{lower:0,g:.35+.65*inC,col:inC>.5?C.hi:GRAY,w:3+2*inC});
  s+=fade(inB,draw([[A.X(0),A.Y(6)],[A.X(2),A.Y(6)],[A.X(2),A.Y(0)]],1,{color:C.hi,w:5,dash:'7 6'})+label('6 m/s × 2.0 s',A.X(1),A.Y(6)-14,{size:22,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(inA,label('始めの 速度',A.X(2.1),A.Y(2.2),{size:22,color:C.hi,weight:700}));
  s+=fade(inC,label('終わりの 速度',A.X(2.1),A.Y(4.6),{size:22,color:C.hi,weight:700}));
  s+=topCard(label('台形は、下の 階段と 上の 階段の 間',360,128,{size:26,color:C.ink,anchor:'middle',weight:700})
   +label('正しい 位置 6.0 m',360,185,{size:28,color:C.x,anchor:'middle',weight:700}),1);
  s+=wrongSeq(p,ctx,[['A','4.5 m','各区間を 始めの 速度で 計算'],['C','7.5 m','各区間を 終わりの 速度で 計算'],['B','12 m','6 m/s の まま 2.0 s 走った と した']],
   {win:[[0,e1*.5],[e1*.5,e1],[b2,1]],opts:{...WL}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 12. 誤答カードと点線を消す。2.0 s の札「力を取り去る」を黄で光らせる
 [K+'goal3']:(p)=>{
  let s=table({v:5,dx:4,x:5,tHi:-1});
  const {A,svg}=graph();s+=svg+removeTag(A,{glow:seg(p,.2,.35)});
  s+=A.plot(vTrue,{from:0,to:2,color:C.v,w:4});
  s+=topCard(label('小問3',360,124,{size:24,color:C.dim,anchor:'middle'})+label('力を 取り去った 後、',360,172,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('t ＝ 3.0 s の 位置 x は？',360,214,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.03,.15),C.hi);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 13a. 台車の図（上）：緑の力の矢印と赤の加速度の矢印が消える。a＝0
 [K+'remove']:(p)=>{
  const o={ox:140,k:38,fy:205,cw:90,ch:44,fk:13},xm=6;
  const gone=seg(p,.35,.6);
  let s=floor(o)+cartAt({...o,xm});
  const x=o.ox+o.k*xm,yy=205-18-22;
  s+=fade(1-gone,arrow(x+45,yy,x+45+12*13,yy,{color:C.F,w:6,head:18})+arrow(x-45,yy,x-45-39,yy,{color:C.F,w:6,head:16}));
  s+=fade(1-gone,arrow(x,yy-40,x+3*38*.6,yy-40,{color:C.a,w:6,head:16}));
  s+=arrow(x,yy-70,x+130,yy-70,{color:C.v,w:6,head:18})+label('6.0 m/s',x+140,yy-62,{size:24,color:C.v,weight:700});
  s+=fade(seg(p,.55,.7),label('合力 0 → a ＝ 0',x-60,yy-50,{size:26,color:C.a,weight:700,anchor:'end'}));
  s+=table({v:5,dx:4,x:5});
  const {A,svg}=graph();s+=svg+removeTag(A,{glow:1});
  s+=A.plot(vTrue,{from:0,to:2,color:C.v,w:4});
  s+=goalTag(G3);
  return s;
 },
 // 13b. 紫の速度の矢印は同じ長さのまま、台車が等速で進む。v–t グラフは 2.0 s から水平線
 [K+'remove2']:(p,ctx)=>{
  const o={ox:140,k:38,fy:205,cw:90,ch:44,fk:13},u=seg(p,.15,.85),xm=6+6*u*.999;
  const x=o.ox+o.k*xm,yy=205-18-22;
  let s=floor(o)+cartAt({...o,xm});
  s+=arrow(x,yy-70,x+130,yy-70,{color:C.v,w:6,head:18})+label('6.0 m/s',x+140>560?x-10:x+140,yy-62,{size:24,color:C.v,weight:700,anchor:x+140>560?'end':'start'});
  s+=table({v:5+(seg(p,.4,.5)>0?2:0),vg:[1,1,1,1,1,seg(p,.4,.5),seg(p,.5,.6)],dx:4,x:5});
  const {A,svg}=graph();s+=svg+removeTag(A,{glow:1});
  s+=A.plot(vTrue,{from:0,to:2,color:C.v,w:4})+A.plot(()=>6,{from:2,to:3,p:u,color:C.v,w:4});
  s+=fade(seg(p,.6,.75),label('等速',A.X(2.5),A.Y(6)-14,{size:24,color:C.v,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 14a. 2.0〜3.0 s の長方形を水色で塗り「6.0 m」
 [K+'ans3a']:(p)=>ans3Scene({rect:seg(p,.05,.2)}),
 // 14b. 表の 3.0 s に 12。答えの札 A（「小問3の答えは」で出す）
 [K+'ans3']:(p)=>ans3Scene({rect:1,x12:seg(p,.12,.22),ans:seg(p,.5,.58)}),
 // 15. 誤りの線（灰色の点線）を3本。B（2.0 s で 0）→ C（3.0 s で 0）→ D（傾き 3 のまま）。カードは1枚ずつ（表の場所に）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],b2=W[1]?W[1][0]:e1,m2=b2+(1-b2)*.5;
  const inB=seg(p,.01,.05)*(1-seg(p,e1-.04,e1)),inC=seg(p,b2+.01,b2+.05)*(1-seg(p,m2-.04,m2)),inD=seg(p,m2+.01,m2+.05);
  const {A,svg}=graph();let s=svg+removeTag(A);
  s+=poly([[A.X(2),A.Y(0)],[A.X(2),A.Y(6)],[A.X(3),A.Y(6)],[A.X(3),A.Y(0)]],{fill:C.x,fo:.15,stroke:'none'});
  s+=A.plot(vTrue,{from:0,to:3,color:C.v,w:4});
  const wl=(pts,on,g)=>fade(g,draw(pts,1,{color:on>.5?C.hi:GRAY,w:3+2*on,dash:'8 6'}));
  s+=wl([[A.X(2),A.Y(6)],[A.X(2),A.Y(0)],[A.X(3),A.Y(0)]],inB,.35+.65*seg(p,0,.05));
  s+=wl([[A.X(2),A.Y(6)],[A.X(3),A.Y(0)]],inC,.35+.65*seg(p,b2,b2+.05));
  s+=wl([[A.X(2),A.Y(6)],[A.X(3),A.Y(9)]],inD,.35+.65*seg(p,m2,m2+.05));
  s+=fade(inB,label('すぐ止まる',A.X(2)-10,A.Y(1)-6,{size:22,color:C.hi,anchor:'end',weight:700}));
  s+=fade(inC,label('減って止まる',A.X(2.6)+8,A.Y(2.8),{size:22,color:C.hi,weight:700}));
  s+=fade(inD,label('加速し続ける',A.X(1.95),A.Y(7.3),{size:22,color:C.hi,anchor:'end',weight:700}));
  s+=topCard(label('力を 取り去った 後（2.0〜3.0 s）',360,128,{size:26,color:C.ink,anchor:'middle',weight:700})
   +label('正しくは 6.0 m/s の 等速',360,185,{size:28,color:C.v,anchor:'middle',weight:700}),1);
  s+=wrongSeq(p,ctx,[['B','6.0 m','すぐ 止まった と した'],['C','9.0 m','一定の 割合で 減って 止まった と した'],['D','13.5 m','力が なくても 加速し続ける と した']],
   {win:[[0,e1],[b2,m2],[m2,1]],opts:{...WL}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 16. 誤答カードを消す。水平線を黄で光らせ、「a＝0、v は残る」の札
 [K+'keep']:(p,ctx)=>{
  const b=win2(ctx);
  let s=table({v:7,dx:4,x:7});
  const {A,svg}=graph();s+=svg+removeTag(A);
  s+=A.plot(vTrue,{from:0,to:2,color:C.v,w:4});
  const hl=seg(p,b,b+.1);
  s+=A.plot(()=>6,{from:2,to:3,color:hl>.5?C.hi:C.v,w:4+4*hl});
  s+=topCard(fade(seg(p,.05,.15),label('力 0 → 消えるのは 加速度',360,140,{size:28,color:C.a,anchor:'middle',weight:700}))
   +fade(hl,label('速度は、積み上げた 分が 残る',360,200,{size:28,color:C.v,anchor:'middle',weight:700})),1);
  s+=fade(hl,rect(A.X(3)-250,A.Y(6)-74,250,44,{fill:'#2a2a1c',fo:.97,stroke:C.hi,sw:2.5,rx:12})+label('a ＝ 0、v は 残る',A.X(3)-125,A.Y(6)-44,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 17. 「力 → 加速度 → 速度 → 位置」の3段の矢印（緑 → 赤 → 紫 → 水色）。右上に答えの札3枚
 [K+'sum3']:(p)=>{
  const items=[['力','F',C.F],['加速度','a',C.a],['速度','v',C.v],['位置','x',C.x]];
  const bw=200,gap=90,x0=600-(4*bw+3*gap)/2,y0=170,bh=130;
  let s='';
  items.forEach(([n,sym,col],i)=>{const x=x0+i*(bw+gap),g=seg(p,.03+i*.1,.1+i*.1);
   s+=card(x,y0,bw,bh,label(n,x+bw/2,y0+56,{size:32,color:col,anchor:'middle',weight:700})+label(sym,x+bw/2,y0+104,{size:30,color:col,anchor:'middle',weight:700}),g,col);
   if(i<3)s+=fade(seg(p,.1+i*.1,.16+i*.1),arrow(x+bw+8,y0+bh/2,x+bw+gap-8,y0+bh/2,{color:C.dim,w:4,head:16}));});
  s+=fade(seg(p,.1,.2),label('今の 値を 決める',x0+bw+gap/2,y0+bh+50,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),rect(x0+2*bw+gap-20,y0+bh+20,2*bw+2*gap+40-bw+20,56,{fill:C.hi,fo:.08,stroke:C.hi,sw:2,rx:12})
   +label('初期条件から 積み上げる',x0+2.5*bw+2*gap+gap/2-20,y0+bh+56,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=answerRow([[1,'C','3 m/s²'],[2,'D','6.0 m'],[3,'A','12 m']],{g:seg(p,.6,.72)});
  return s;
 },
};
