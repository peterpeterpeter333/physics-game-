// 問題編 解説「止まるまでと、半分の速さになるまで」(ys-qx-hs-m1-uniform-accel-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/103_等加速度運動.md の q-hs-m1-uniform-accel-3（解説 19 行）。
// 配置：小問1・3 は上に道と車、その下に「分かっている量」の表、下に式の枠。小問2 は上に表、下に3つの式。行16〜18 は v-t グラフ（ここで初めて描く）。
// 色（01_共通の約束）：位置・距離・面積 水色（三角形の部分は淡い水色）、速度 v 紫、加速度 a 赤、時間 t 金、強調 黄。
// 札（求めるもの・答え・誤答・映像を一時停止）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,clamp,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,axes,tex,poly} from './anim.mjs';
import {QC,card,goalTag,answerTag,wrongSeq,wrongCard,pauseBadge,sentWin,cueT} from './yt1-qx-common.mjs';

const K='qx-hs-m1-uniform-accel-3:';
const G1='止まるまでの距離',G2='第3式を選ぶ理由',G3='12 m/s になるまでの距離';
const A1=g=>answerTag(1,'B','72 m',{g}),A2=g=>answerTag(2,'C','t が出てこない',{g}),A3=g=>answerTag(3,'D','54 m',{g});
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const LT='#a8eeff';

// ---- 道と車 ----------------------------------------------------------------------------------------
const RY=206,X0=260,PM=10,VS=5;   // 道の高さ、ブレーキをかけた所、1 m→10 px、1 m/s→5 px
const XM=m=>X0+PM*m;
function road(g=1){let s=line(30,RY,1180,RY,{color:C.dim,w:3});for(let x=40;x<1180;x+=60)s+=line(x,RY+14,x+28,RY+14,{color:C.faint,w:3});return fade(g,s);}
function car(x,{g=1}={}){   // x＝車の中心
 let s=rect(x-60,RY-46,120,30,{fill:'#d9e2f2',fo:.95,stroke:'#9aa8c0',sw:2,rx:8});
 s+=`<polygon points="${x-34},${RY-46} ${x-22},${RY-70} ${x+24},${RY-70} ${x+40},${RY-46}" fill="#c9d3e4" stroke="#9aa8c0" stroke-width="2"/>`;
 s+=rect(x-18,RY-66,18,16,{fill:'#7fb6ff',fo:.7,stroke:'none',rx:3})+rect(x+4,RY-66,18,16,{fill:'#7fb6ff',fo:.7,stroke:'none',rx:3});
 s+=ring(x-34,RY-12,11,{color:C.dim,w:3,fill:C.bg})+ring(x+34,RY-12,11,{color:C.dim,w:3,fill:C.bg});
 return fade(g,s);
}
// 速度の矢印（紫、車の前から右へ）と加速度の矢印（赤、左向き）
function vArrow(x,v,{lab=1,hi=0,g=1}={}){
 if(v<.05)return '';
 const y=RY-96;
 return fade(g,arrow(x,y,x+v*VS,y,{color:hi?C.hi:QC.v,w:6,head:16})+fade(lab,label(`${Math.round(v)} m/s`,x+v*VS+12,y+9,{size:28,color:hi?C.hi:QC.v,weight:700})));
}
function aArrow(x,{hi=0,g=1}={}){
 const y=RY-96;
 return fade(g,arrow(x-8,y,x-78,y,{color:hi?C.hi:QC.a,w:6,head:16})+label('−4 m/s²',x-88,y+9,{size:28,color:hi?C.hi:QC.a,anchor:'end',weight:700}));
}
const atBrake=({vhi=0,ahi=0,acc=1,vlab=1}={})=>road()+car(X0)+vArrow(X0,24,{hi:vhi,lab:vlab})+aArrow(X0,{hi:ahi,g:acc});

// ---- 分かっている量の表（1行）--------------------------------------------------------------------
function table(y,cells,{g=1,hi=-1,hiCol=C.hi,gone=-1,goneG=0,dash=-1}={}){
 const n=cells.length,w=1100/n;let s=card(50,y,1100,74,'',g,C.faint);
 cells.forEach(([t,col],i)=>{const cx=50+w*(i+.5);let cell='';
  if(i===dash)cell+=rect(cx-w/2+10,y+10,w-20,54,{fill:'none',fo:0,stroke:QC.t,sw:2.5,rx:8}).replace('/>',' stroke-dasharray="7 6"/>');
  if(i===hi)cell+=rect(cx-w/2+8,y+8,w-16,58,{fill:hiCol,fo:.16,stroke:hiCol,sw:3,rx:8});
  cell+=label(t,cx,y+48,{size:30,color:col,anchor:'middle',weight:700});
  s+=fade(g*(i===gone?1-goneG:1),cell);});
 return s;
}
const TAB1=[['v₀＝24',QC.v],['a＝−4',QC.a],['v＝0',QC.v],['x＝？',QC.x],['t：なし',QC.t]];
const TAB3=[['v₀＝24',QC.v],['a＝−4',QC.a],['v＝12',QC.v],['x＝？',QC.x]];
const TY=236;   // 表の上端（小問1・3）
const EQ={x:150,y:328,w:900,h:176,cx:600};
const eqCard=(inner,g=1,stroke=C.faint)=>card(EQ.x,EQ.y,EQ.w,EQ.h,inner,g,stroke);
// 止まるまでの位置（t 秒後）
const posAt=t=>24*t-2*t*t,velAt=t=>24-4*t;

// ---- 3つの式（小問2）----------------------------------------------------------------------------
const F=['v=v_0+at','x=v_0t+\\tfrac12at^2','v^2-v_0^2=2ax'],FN=['第1式','第2式','第3式'],NOT=['x なし','v なし','t なし'];
function three({tags=[1,1,1],box=0,dim=0}={}){
 let s='';
 F.forEach((f,i)=>{const y=210+i*96;
  s+=fade(i<2?1-dim*.55:1,label(FN[i],210,y+12,{size:28,color:C.dim,weight:700})+T(f,480,y,40));
  s+=fade(tags[i],rect(760,y-26,160,48,{fill:QC.t,fo:.12,stroke:QC.t,sw:2.5,rx:22})+label(NOT[i],840,y+9,{size:26,color:QC.t,anchor:'middle',weight:700}));
 });
 if(box)s+=fade(box,rect(170,402-38,780,76,{fill:'none',fo:0,stroke:C.hi,sw:4,rx:12}));
 return s;
}

// ---- v-t グラフ（行16〜18）---------------------------------------------------------------------
const GA=()=>{
 const A=axes({x:120,y:452,w:560,h:320,xmin:0,xmax:6.8,ymin:0,ymax:27,xlabel:'t [s]',ylabel:'速度 v [m/s]',xticks:[],yticks:[],xcolor:QC.t,ycolor:QC.v});
 let s=A.svg;
 for(const k of [1,2,3,4,5,6])s+=line(A.X(k),A.Y(0)-6,A.X(k),A.Y(0)+6,{color:C.dim})+label(String(k),A.X(k),A.Y(0)+32,{size:22,color:QC.t,anchor:'middle'});
 for(const v of [12,24])s+=line(A.X(0)-6,A.Y(v),A.X(0)+6,A.Y(v),{color:C.dim})+label(String(v),A.X(0)-14,A.Y(v)+8,{size:24,color:QC.v,anchor:'end',weight:700});
 return {...A,svg:s};
};
const trapV=(A,g=1,c=QC.x,fo=.38)=>fade(g,poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(24)],[A.X(3),A.Y(12)],[A.X(3),A.Y(0)]],{fill:c,fo,stroke:c,sw:2}));
const triV=(A,g=1,c=LT,fo=.3)=>fade(g,poly([[A.X(3),A.Y(0)],[A.X(3),A.Y(12)],[A.X(6),A.Y(0)]],{fill:c,fo,stroke:c,sw:2}));
const lineV=(A,p=1)=>draw([[A.X(0),A.Y(24)],[A.X(6),A.Y(0)]],p,{color:QC.v,w:6});
const RX=740,RW=440,RC=RX+RW/2;
const rpanel=(y,h,inner,g=1,stroke=C.faint)=>card(RX,y,RW,h,inner,g,stroke);

export const qxHsM1UA3Diagrams={
 // ================= 問題アニメ：出題中（約4.5秒＋静止）=================
 // 車が 24 m/s のまま少し右へ進み（3 s）、ブレーキをかける瞬間で映像を一時停止。一時停止の画面に赤の −4 m/s² を加える。
 // 止まる所までは動かさない。v-t グラフは出さない。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx),u=clamp(t/3),x=60+(X0-60)*u;
  let s=road()+car(x)+vArrow(x,24);
  s+=pauseBadge({x:800,g:seg(t,3.05,3.25)});
  s+=aArrow(x,{g:seg(t,3.4,3.8)});
  return s;
 },
 // ================= S1 小問1 =================
 // 1. 出題中の図を再生して静止。紫の「24」と赤の「−4」を順に光らせる
 [K+'setup']:(p,ctx)=>{
  const t=cueT(ctx),u=clamp(t/2.4),x=60+(X0-60)*u;
  let s=road()+car(x);
  const hv=seg(p,.35,.42)*(1-seg(p,.55,.6)),ha=seg(p,.62,.7);
  s+=vArrow(x,24,{hi:hv>.5});
  s+=pauseBadge({x:800,g:seg(t,2.45,2.6)});
  s+=aArrow(x,{g:seg(t,2.7,3.0),hi:ha>.5&&p<.95});
  return s;
 },
 // 2. 求めるもの。車の前方に水色の「？ m」
 [K+'goal1']:(p)=>{
  let s=atBrake();
  s+=fade(seg(p,.3,.45),line(XM(0)+70,RY+40,1120,RY+40,{color:QC.x,w:3,dash:'10 8'})+label('？ m',820,RY+80,{size:34,color:QC.x,anchor:'middle',weight:700}));
  s+=pauseBadge({x:800})+goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 表「v₀＝24、a＝−4、v＝0、x＝？、t：なし」。v＝0 を黄で、t の欄を金の点線で空ける
 [K+'known']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=atBrake({acc:1});
  const vis=[seg(p,.05,.12),seg(p,.15,.22),seg(p,.3,.38),seg(p,.4,.48),seg(p,b,b+.08)];
  s+=card(50,TY,1100,74,'',seg(p,0,.08),C.faint);
  const w=220;
  TAB1.forEach(([t,col],i)=>{const cx=50+w*(i+.5);
   if(i===4){s+=fade(vis[4],rect(cx-w/2+10,TY+10,w-20,54,{fill:'none',fo:0,stroke:QC.t,sw:2.5,rx:8}).replace('/>',' stroke-dasharray="7 6"/>')+label(t,cx,TY+48,{size:30,color:col,anchor:'middle',weight:700}));return;}
   if(i===2)s+=fade(vis[2],rect(cx-w/2+8,TY+8,w-16,58,{fill:C.hi,fo:.16,stroke:C.hi,sw:3,rx:8}));
   s+=fade(vis[i],label(t,cx,TY+48,{size:30,color:i===2?C.hi:col,anchor:'middle',weight:700}));});
  s+=pauseBadge({x:800})+goalTag(G1);
  return s;
 },
 // 4. 「v²−v₀²＝2ax」と「t なし」の札。v、v₀、a に 0、24、−4 を一つずつ
 [K+'eq3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=atBrake()+table(TY,TAB1,{dash:4});
  const st=[seg(p,b+.05,b+.1),seg(p,b+.18,b+.23),seg(p,b+.32,b+.37)];
  const k=st.filter(x=>x>.5).length;
  const Y='#ffe28a';
  const sub=['v^2-v_0^2=2ax',`{\\color{${Y}}0}^2-v_0^2=2ax`,`0^2-{\\color{${Y}}24}^2=2ax`,`0^2-24^2=2\\times({\\color{${Y}}-4})\\times x`];
  let eq=T(F[2],EQ.cx-120,EQ.y+60,40)+fade(seg(p,.1,.2),rect(EQ.cx+110,EQ.y+34,140,48,{fill:QC.t,fo:.12,stroke:QC.t,sw:2.5,rx:22})+label('t なし',EQ.cx+180,EQ.y+67,{size:26,color:QC.t,anchor:'middle',weight:700}));
  eq+=fade(st[0],T(sub[Math.max(1,k)],EQ.cx,EQ.y+132,40));
  s+=eqCard(eq,seg(p,.05,.15),C.hi);
  s+=pauseBadge({x:800})+goalTag(G1);
  return s;
 },
 // 5. −576＝−8x → x＝72。車を 72 m 先まで動かす（数値 24 m/s を消し、矢印をだんだん短く、72 m で消す）。答え B
 [K+'solve']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  const u=lin(p,.25,.8),t=6*u,x=XM(posAt(t)),v=velAt(t);
  let s=road()+car(x)+vArrow(x,v,{lab:0})+fade(1-seg(p,.22,.27),aArrow(X0));
  s+=fade(seg(p,.78,.85),line(XM(0),RY+26,XM(72),RY+26,{color:QC.x,w:4})+line(XM(0),RY+17,XM(0),RY+35,{color:QC.x,w:4})+line(XM(72),RY+17,XM(72),RY+35,{color:QC.x,w:4})+label('72 m',XM(36),RY-16,{size:30,color:QC.x,anchor:'middle',weight:700}));
  s+=table(TY,TAB1,{dash:4});
  let eq=T('0^2-24^2=2\\times(-4)\\times x',EQ.cx,EQ.y+50,36);
  eq+=fade(seg(p,.05,.12),T('-576=-8x',EQ.cx,EQ.y+102,38));
  eq+=fade(seg(p,.18,.25),T('x=72\\ \\mathrm{m}',EQ.cx,EQ.y+152,40));
  s+=eqCard(eq,1,C.hi);
  s+=fade(1-seg(p,.2,.25),pauseBadge({x:800}));
  s+=goalTag(G1)+A1(seg(p,b,b+.06));
  return s;
 },
 // 6. 誤答 A（−72）。右向きの紫と、左向きの赤の矢印を並べる
 [K+'wrongA']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=road()+car(XM(72));
  s+=line(XM(0),RY+26,XM(72),RY+26,{color:QC.x,w:4})+label('72 m',XM(36),RY-16,{size:30,color:QC.x,anchor:'middle',weight:700});
  const g=seg(p,b,b+.08);
  s+=fade(g,arrow(120,330,300,330,{color:QC.v,w:6,head:18})+label('進む向き（右）',210,372,{size:24,color:QC.v,anchor:'middle',weight:700}));
  s+=fade(g,arrow(300,430,120,430,{color:QC.a,w:6,head:18})+label('加速度 a（左）',210,472,{size:24,color:QC.a,anchor:'middle',weight:700}));
  s+=wrongCard('A','−72 m','a を ＋4 で入れた',{x:420,w:720,y:300,g:seg(p,.03,.1),mid:'0^2-24^2=2\\times(+4)\\times x',midSize:30});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 7. 誤答 C・D を1枚ずつ
 [K+'wrongCD']:(p,ctx)=>{
  let s=road()+car(XM(72))+line(XM(0),RY+26,XM(72),RY+26,{color:QC.x,w:4})+label('72 m',XM(36),RY-16,{size:30,color:QC.x,anchor:'middle',weight:700});
  s+=wrongSeq(p,ctx,[['C','144 m','右辺の 2 を落とした'],['D','6 m','時間 6 s を距離とした']],{opts:{x:250,w:700,y:300}});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2 =================
 // 8. 求めるもの：第3式を選ぶ理由（表を上に）
 [K+'goal2']:(p)=>table(100,TAB1,{dash:4,g:seg(p,.05,.2)})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 9. 3つの式を縦に並べ、「x なし」「v なし」「t なし」を順に
 [K+'tags']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,e=W[1]?W[1][1]:1,d=(e-b)/3;
  let s=table(100,TAB1,{dash:4});
  s+=fade(seg(p,.03,.15),three({tags:[seg(p,b+.02,b+.06),seg(p,b+d+.02,b+d+.06),seg(p,b+2*d+.02,b+2*d+.06)]}));
  s+=goalTag(G2);
  return s;
 },
 // 10. 表の t の欄を金で光らせてから消し、第3式を黄で囲む。答え C
 [K+'pick']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=table(100,TAB1,{dash:4,hi:4,hiCol:QC.t,gone:4,goneG:seg(p,.3,.4)});
  s+=three({box:seg(p,.4,.5),dim:seg(p,.4,.5)});
  s+=goalTag(G2)+A2(seg(p,b,b+.06));
  return s;
 },
 // 11. 誤答 B・D を1枚ずつ
 [K+'wrongBD']:(p,ctx)=>{
  let s=table(100,TAB1,{dash:4,gone:4,goneG:1})+fade(.35,three({box:1,dim:1}));
  s+=wrongSeq(p,ctx,[['B','v がない','v＝0 と分かっている'],['D','x がない','x は聞かれている量']],{opts:{x:250,w:700,y:250}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 誤答 A
 [K+'wrongA2']:(p)=>{
  let s=table(100,TAB1,{dash:4,gone:4,goneG:1})+fade(.35,three({box:1,dim:1}));
  s+=wrongCard('A','a が負のときの式','どの式も符号によらず使える',{x:250,w:700,y:250,g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3 =================
 // 13. 車を出発点に戻し、24 m/s と −4 m/s² の出題時の状態に。表を v＝12 に書き換える。12 m/s になる位置は示さない
 [K+'goal3']:(p)=>{
  let s=atBrake()+pauseBadge({x:800});
  s+=table(TY,TAB1,{dash:4,g:1-seg(p,.25,.35)})+table(TY,TAB3,{g:seg(p,.35,.45),hi:2});
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. 第3式に数を一つずつ。144−576＝−432、−432＝−8x
 [K+'eq3b']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3;
  let s=atBrake()+pauseBadge({x:800})+table(TY,TAB3);
  let eq=T(F[2],EQ.cx,EQ.y+40,34);
  eq+=fade(seg(p,b+.02,b+.1),T('12^2-24^2=2\\times(-4)\\times x',EQ.cx,EQ.y+90,34));
  eq+=fade(seg(p,b+.35,b+.45),T('144-576=-432=-8x',EQ.cx,EQ.y+140,34));
  s+=eqCard(eq,1,C.hi);
  s+=goalTag(G3);
  return s;
 },
 // 15. −432÷(−8)＝54。答え D
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=atBrake()+pauseBadge({x:800})+table(TY,TAB3);
  let eq=T('-432=-8x',EQ.cx,EQ.y+50,36)+fade(seg(p,.05,.15),T('x=-432\\div(-8)=54\\ \\mathrm{m}',EQ.cx,EQ.y+120,40));
  s+=eqCard(eq,1,C.hi);
  s+=goalTag(G3)+A3(seg(p,b,b+.08));
  return s;
 },
 // 16. ここで初めて v-t グラフ。0〜3 s の台形 54、3〜6 s の三角形 18、54＋18＝72
 [K+'graph']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3;
  const A=GA();
  let s=fade(seg(p,.02,.1),A.svg)+lineV(A,lin(p,.05,.25));
  s+=fade(seg(p,.15,.25),dot(A.X(6),A.Y(0),8,QC.v)+dot(A.X(3),A.Y(12),8,QC.v)+line(A.X(0),A.Y(12),A.X(3),A.Y(12),{color:C.faint,w:2,dash:'6 6'}));
  const g1=seg(p,b+.15,b+.25),g2=seg(p,b+.45,b+.55);
  s+=trapV(A,g1)+triV(A,g2)+lineV(A,1);
  s+=fade(g1,label('54',A.X(1.4),A.Y(8)+10,{size:34,color:C.ink,anchor:'middle',weight:700}))+fade(g2,label('18',A.X(3.9),A.Y(3)+10,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=rpanel(110,260,fade(g1,T('\\dfrac{(24+12)\\times3}{2}=54',RC,180,32))+fade(g2,T('\\tfrac12\\times3\\times12=18',RC,260,32))+fade(seg(p,.88,.95),T('54+18=72',RC,330,36)),1,QC.x);
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 17. 台形と三角形の大きさの差を黄で。誤答 A（36）
 [K+'half']:(p)=>{
  const A=GA();
  let s=A.svg+trapV(A)+triV(A)+lineV(A);
  const g=seg(p,.05,.2);
  s+=fade(g,poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(24)],[A.X(3),A.Y(12)],[A.X(3),A.Y(0)]],{fill:'none',fo:0,stroke:C.hi,sw:5}));
  s+=label('54',A.X(1.4),A.Y(8)+10,{size:34,color:C.ink,anchor:'middle',weight:700})+label('18',A.X(3.9),A.Y(3)+10,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(g,label('速い うち（前半の 3 s）',A.X(1.5),A.Y(26)+8,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=wrongCard('A','36 m','速さ半分 ≠ 距離半分',{x:RX,w:RW,y:150,g:seg(p,.45,.52)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 18. 誤答 B・C を1枚ずつ。B のあいだ、三角形を光らせる
 [K+'wrongBC']:(p,ctx)=>{
  const W=sentWin(ctx);const a2=W[1]?W[1][0]:.5;
  const A=GA();
  let s=A.svg+trapV(A)+triV(A,1,LT,.3)+lineV(A);
  s+=fade(seg(p,.02,.08)*(1-seg(p,a2-.04,a2)),poly([[A.X(3),A.Y(0)],[A.X(3),A.Y(12)],[A.X(6),A.Y(0)]],{fill:C.hi,fo:.25,stroke:C.hi,sw:4}));
  s+=label('54',A.X(1.4),A.Y(8)+10,{size:34,color:C.ink,anchor:'middle',weight:700})+label('18',A.X(3.9),A.Y(3)+10,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=wrongSeq(p,ctx,[['B','18 m','12 m/s から止まるまで（三角形）'],['C','108 m','右辺の 2 を落とした']],{opts:{x:RX,w:RW,y:150,whySize:22}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 // 19. 「出てこない文字 → 式を選ぶ」の札。v²−v₀²＝2ax を黄で囲む
 [K+'sum']:(p)=>{
  let s=card(250,120,700,90,label('出てこない 文字 → 式を 選ぶ',600,178,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.3,.45),T(F[2],600,320,56));
  s+=fade(seg(p,.45,.6),rect(330,262,540,110,{fill:'none',fo:0,stroke:C.hi,sw:4,rx:14})+rect(880,295,140,48,{fill:QC.t,fo:.12,stroke:QC.t,sw:2.5,rx:22})+label('t なし',950,328,{size:26,color:QC.t,anchor:'middle',weight:700}));
  return s;
 },
};
