// 問題編 解説「ブレーキの途中で、どこにいる？」(ys-qx-hs-m1-uniform-accel-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/103_等加速度運動.md の q-hs-m1-uniform-accel-2（解説 18 行）。
// 配置：小問1・2 は左に台車 R の v-t グラフ、右に式の枠と誤答カード。小問3 は上に数直線（−10〜15 m）、左下に台車 S の v-t グラフ、右に式。
// 色（01_共通の約束）：位置・変位・面積 水色（三角形の部分は淡い水色）、速度 v 紫、加速度 a 赤、時間 t 金、強調 黄、削られる部分 赤の斜線。
// 札（求めるもの・答え・誤答）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,clamp,mix,seg,lin,fade,move,label,line,rect,dot,draw,arrow,axes,tex,poly} from './anim.mjs';
import {QC,card,goalTag,answerTag,wrongSeq,kindTag,sentWin,cueT} from './yt1-qx-common.mjs';

const K='qx-hs-m1-uniform-accel-2:';
const G1='R の 0〜3 s の変位',G2='三角形の面積は何倍か',G3='S の 3 s 後の位置';
const A1=g=>answerTag(1,'B','24 m',{g}),A2=g=>answerTag(2,'D','9 倍',{g}),A3=g=>answerTag(3,'C','10 m',{g});
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,...o});
const LT='#a8eeff';   // 三角形（増えたぶん）の淡い水色
const hatch=id=>`<defs><pattern id="${id}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="${QC.a}" stroke-width="4"/></pattern></defs>`;

// ---- v-t グラフ（数値の目盛りは自前で描く）----------------------------------------------------------
function vt({x=120,y=455,w=520,h=320,xmax=3.6,ymax=16,xt=[1,2,3],yt=[],g=1}={}){
 const A=axes({x,y,w,h,xmin:0,xmax,ymin:0,ymax,xlabel:'t [s]',ylabel:'速度 v [m/s]',xticks:[],yticks:[],xcolor:QC.t,ycolor:QC.v});
 let s=A.svg;
 for(const k of xt)s+=line(A.X(k),A.Y(0)-6,A.X(k),A.Y(0)+6,{color:C.dim})+label(String(k),A.X(k),A.Y(0)+32,{size:22,color:QC.t,anchor:'middle'});
 for(const [v,o] of yt)s+=fade(o??1,line(A.X(0)-6,A.Y(v),A.X(0)+6,A.Y(v),{color:C.dim})+label(String(v),A.X(0)-14,A.Y(v)+8,{size:24,color:QC.v,anchor:'end',weight:700}));
 return {...A,svg:fade(g,s)};
}
const rv=t=>2+4*t,sv=t=>8-2*t;
// 長方形（v₀ のぶん）と三角形（増えたぶん）
const rectR=(A,t1,g=1,fo=.38)=>fade(g,poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(2)],[A.X(t1),A.Y(2)],[A.X(t1),A.Y(0)]],{fill:QC.x,fo,stroke:QC.x,sw:2}));
const triR=(A,t1,g=1,fo=.28,c=LT)=>fade(g,poly([[A.X(0),A.Y(2)],[A.X(t1),A.Y(2)],[A.X(t1),A.Y(rv(t1))]],{fill:c,fo,stroke:c,sw:2}));
const lineR=(A,t1,p=1)=>draw([[A.X(0),A.Y(2)],[A.X(t1),A.Y(rv(t1))]],p,{color:QC.v,w:6});

// 右の枠
const RX=760,RW=430,RC=RX+RW/2;
const rpanel=(y,h,inner,g=1,stroke=C.faint)=>card(RX,y,RW,h,inner,g,stroke);
const WOPT={x:RX,w:RW,y:300,size:28,whySize:22};

// ---- 台車 S と数直線 -------------------------------------------------------------------------------
const NY=180,NX=m=>230+(m+10)*34;
function nline(g=1){
 let s=line(NX(-10.8),NY,NX(15.6),NY,{color:C.dim,w:3})+arrow(NX(15.4),NY,NX(16.4),NY,{color:C.dim,w:3,head:12});
 for(let m=-10;m<=15;m++)s+=line(NX(m),NY-(m%5?5:9),NX(m),NY+(m%5?5:9),{color:C.dim,w:2});
 for(const m of [-10,-5,0,5,10,15])s+=label(m<0?`−${-m}`:String(m),NX(m),NY+34,{size:22,color:m===0?C.ink:QC.x,anchor:'middle'});
 s+=label('x [m]',NX(16.4)+8,NY+8,{size:22,color:QC.x});
 return fade(g,s);
}
const VS=14;   // 1 m/s → 14 px
function carS(m,{v=8,vlab=1,alab=1,acc=1,g=1}={}){
 const x=NX(m);
 let s=rect(x-24,NY-46,48,34,{fill:C.hi,fo:.85,stroke:C.hi,rx:6})+label('S',x,NY-21,{size:24,color:C.bg,anchor:'middle',weight:700})+line(x,NY-12,x,NY,{color:C.hi,w:3});
 if(v>.05)s+=arrow(x,NY-70,x+v*VS,NY-70,{color:QC.v,w:5,head:14})+fade(vlab,label(`${v} m/s`,x+v*VS+10,NY-62,{size:24,color:QC.v,weight:700}));
 if(acc)s+=fade(acc,arrow(x-6,NY-70,x-66,NY-70,{color:QC.a,w:5,head:14})+fade(alab,label('−2 m/s²',x-76,NY-62,{size:24,color:QC.a,anchor:'end',weight:700})));
 return fade(g,s);
}
// S の v-t グラフ（左下）
const SG={x:120,y:465,w:380,h:190,xmax:3.6,ymax:9.6};
const vtS=(o={})=>vt({...SG,yt:[[8,1],[2,o.two??0]],...o});
const lineS=(A,p=1)=>draw([[A.X(0),A.Y(8)],[A.X(3),A.Y(2)]],p,{color:QC.v,w:6});

// ---- 出題中の図 -----------------------------------------------------------------------------------
function q0(p){
 let s=move(0,-36,nline(seg(p,0,.12))+carS(-5,{g:seg(p,.1,.2),acc:seg(p,.6,.72)}));
 const R=vt({x:120,y:470,w:380,h:190,xmax:3.6,ymax:16,yt:[[2,1]],g:seg(p,.2,.3)});
 s+=R.svg+fade(seg(p,.2,.3),label('台車 R',330,262,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=lineR(R,3,lin(p,.3,.58));
 const S=vt({x:690,y:470,w:380,h:190,xmax:3.6,ymax:9.6,yt:[[8,1]],g:seg(p,.45,.55)});
 s+=S.svg+fade(seg(p,.45,.55),label('台車 S',900,262,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=lineS(S,lin(p,.55,.85));
 return s;
}

export const qxHsM1UA2Diagrams={
 // ================= 問題アニメ：出題中（約5秒＋静止）=================
 // 上段：数直線と、−5 m の S（紫 8 m/s、赤 −2 m/s²）。左：R の v-t グラフ（高さ 2 から右上がり）。右：S の v-t グラフ（高さ 8 から下がる）。
 // 3 s での高さには数値を付けない。台形の分け方・面積の数値は出さず、S は動かさない。
 [K+'q0']:(p)=>q0(p),
 // ================= S1 小問1 =================
 // 1. R の v-t グラフだけ。「2」と傾きを黄で光らせる
 [K+'setup']:(p)=>{
  const A=vt({yt:[[2,1]]});
  let s=A.svg+lineR(A,3,lin(p,.05,.35));
  const h2=seg(p,.3,.4)*(1-seg(p,.55,.62)),hs=seg(p,.62,.72);
  s+=fade(h2,rect(A.X(0)-46,A.Y(2)-24,40,40,{fill:C.hi,fo:.12,stroke:C.hi,sw:3,rx:8}));
  s+=fade(hs,draw([[A.X(0),A.Y(2)],[A.X(3),A.Y(14)]],1,{color:C.hi,w:9}));
  s+=fade(hs,label('毎秒 4 ずつ 上がる',A.X(1.8),A.Y(rv(1.8))+48,{size:26,color:C.hi,weight:700}));
  s+=rpanel(130,170,label('台車 R',RC,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('初速度 2 m/s',RC,226,{size:28,color:QC.v,anchor:'middle',weight:700})+label('加速度 4 m/s²',RC,270,{size:28,color:QC.a,anchor:'middle',weight:700}),seg(p,.05,.15));
  return s;
 },
 // 2. 求めるもの。直線の下を薄く塗る
 [K+'goal1']:(p)=>{
  const A=vt({yt:[[2,1]]});
  let s=A.svg+fade(seg(p,.3,.5),poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(2)],[A.X(3),A.Y(14)],[A.X(3),A.Y(0)]],{fill:QC.x,fo:.14,stroke:'none'}))+lineR(A,3);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 3 s の高さ 14（紫）。台形の輪郭を水色でなぞる
 [K+'v3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  const A=vt({yt:[[2,1],[14,seg(p,.3,.4)]]});
  let s=A.svg+fade(1,poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(2)],[A.X(3),A.Y(14)],[A.X(3),A.Y(0)]],{fill:QC.x,fo:.14,stroke:'none'}))+lineR(A,3);
  s+=fade(seg(p,.3,.4),line(A.X(0),A.Y(14),A.X(3),A.Y(14),{color:C.faint,w:2,dash:'6 6'})+dot(A.X(3),A.Y(14),8,QC.v)+label('14',A.X(3)+14,A.Y(14)+8,{size:30,color:QC.v,weight:700}));
  s+=rpanel(120,110,T('v=2+4\\times3=14',RC,178,40),seg(p,.05,.15));
  s+=draw([[A.X(0),A.Y(0)],[A.X(0),A.Y(2)],[A.X(3),A.Y(14)],[A.X(3),A.Y(0)],[A.X(0),A.Y(0)]],lin(p,b+.05,b+.4),{color:QC.x,w:5});
  s+=fade(seg(p,b+.35,b+.45),label('台形',A.X(2.2),A.Y(4)+8,{size:30,color:QC.x,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 4. 高さ 2 に横線 → 長方形（水色）と三角形（淡い水色）。札「v₀ のぶん」「増えたぶん」
 [K+'split']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const A=vt({yt:[[2,1],[14,1]]});
  let s=A.svg+fade(1-seg(p,.15,.3),poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(2)],[A.X(3),A.Y(14)],[A.X(3),A.Y(0)]],{fill:QC.x,fo:.14,stroke:'none'}));
  s+=rectR(A,3,seg(p,.2,.32))+triR(A,3,seg(p,.3,.42))+lineR(A,3);
  s+=line(A.X(0),A.Y(2),A.X(0)+(A.X(3)-A.X(0))*lin(p,.05,.2),A.Y(2),{color:C.hi,w:4});
  s+=label('14',A.X(3)+14,A.Y(14)+8,{size:30,color:QC.v,weight:700});
  s+=rpanel(130,90,label('長方形：v₀ のぶん',RC,186,{size:28,color:QC.x,anchor:'middle',weight:700}),seg(p,b,b+.08),QC.x);
  s+=rpanel(240,90,label('三角形：増えたぶん',RC,296,{size:28,color:LT,anchor:'middle',weight:700}),seg(p,b+.15,b+.23),LT);
  s+=goalTag(G1);
  return s;
 },
 // 5. 長方形 v₀t＝6。三角形の高さ at＝4×3＝12（赤）。高さ 14 に点線と赤の ×
 [K+'parts']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  const A=vt({yt:[[2,1],[14,1]]});
  let s=A.svg+rectR(A,3)+triR(A,3)+lineR(A,3);
  s+=label('14',A.X(3)+14,A.Y(14)+8,{size:30,color:QC.v,weight:700});
  s+=fade(seg(p,.05,.15),label('6',A.X(1.5),A.Y(1)+10,{size:26,color:C.ink,anchor:'middle',weight:700}));
  const gh=seg(p,b,b+.1);
  s+=fade(gh,line(A.X(3)+70,A.Y(2),A.X(3)+70,A.Y(14),{color:QC.a,w:5})+line(A.X(3)+60,A.Y(2),A.X(3)+80,A.Y(2),{color:QC.a,w:4})+line(A.X(3)+60,A.Y(14),A.X(3)+80,A.Y(14),{color:QC.a,w:4}));
  s+=fade(gh,T('at=12',A.X(3)+125,A.Y(8)+6,32));
  const gx=seg(p,b+.3,b+.4);
  s+=fade(gx,line(A.X(0),A.Y(14),A.X(3),A.Y(14),{color:QC.a,w:2,dash:'6 6'})+label('×',A.X(3)+16,A.Y(14)+12,{size:44,color:QC.bad,weight:700}));
  s+=rpanel(110,190,fade(seg(p,.05,.15),T('v_0t=2\\times3=6',RC,170,36))+fade(gh,T('at=4\\times3=12',RC,250,36)),1,QC.x);
  s+=goalTag(G1);
  return s;
 },
 // 6. 三角形 ½at²＝18、6＋18＝24。答え B
 [K+'sum1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  const A=vt({yt:[[2,1],[14,1]]});
  let s=A.svg+rectR(A,3)+triR(A,3)+lineR(A,3);
  s+=label('6',A.X(1.5),A.Y(1)+10,{size:26,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.1,.2),label('18',A.X(2.2),A.Y(8)+10,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=rpanel(110,250,T('v_0t=6',RC,165,36)+fade(seg(p,.05,.15),T('\\tfrac12at^2=\\tfrac12\\times12\\times3=18',RC,240,32))+fade(seg(p,.25,.35),T('6+18=24\\ \\mathrm{m}',RC,315,40)),1,QC.x);
  s+=goalTag(G1)+A1(seg(p,b,b+.08));
  return s;
 },
 // 7. 誤答 A・C・D を1枚ずつ
 [K+'wrong1']:(p,ctx)=>{
  const A=vt({yt:[[2,1],[14,1]]});
  let s=A.svg+rectR(A,3)+triR(A,3)+lineR(A,3);
  s+=label('6',A.X(1.5),A.Y(1)+10,{size:26,color:C.ink,anchor:'middle',weight:700})+label('18',A.X(2.2),A.Y(8)+10,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=goalTag(G1)+A1(1);
  s+=wrongSeq(p,ctx,[['A','42 m','½ を付け忘れた（14×3 と同じ）'],['C','27 m','三角形の高さを 14 にした'],['D','18 m','長方形 v₀t を落とした']],{opts:{...WOPT,y:200}});
  return s;
 },
 // ================= S2 小問2 =================
 // 8. 求めるもの。横軸を 0〜9 s に延ばす
 [K+'goal2']:(p)=>{
  const u=seg(p,.2,.6);
  const A=vt({xmax:mix(3.6,9.6,u),ymax:mix(16,40,u),xt:u>.5?[3,6,9]:[1,2,3],yt:[[2,1]]});
  let s=A.svg+triR(A,3)+lineR(A,mix(3,9,seg(p,.45,.85)));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 9. 0〜9 s の三角形を重ねる。底辺 ×3（金）、高さ ×3（赤）
 [K+'tri9']:(p)=>{
  const A=vt({xmax:9.6,ymax:40,xt:[3,6,9],yt:[[2,1]]});
  let s=A.svg+triR(A,9,seg(p,.05,.18),.16,QC.x)+triR(A,3,1,.45)+lineR(A,9);
  const gb=seg(p,.4,.5),gh=seg(p,.65,.75);
  s+=fade(gb,line(A.X(0),A.Y(2),A.X(9),A.Y(2),{color:QC.t,w:7})+label('底辺 ×3',A.X(6),A.Y(2)-16,{size:28,color:QC.t,anchor:'middle',weight:700}));
  s+=fade(gh,line(A.X(9)+26,A.Y(2),A.X(9)+26,A.Y(38),{color:QC.a,w:4})+label('高さ ×3',A.X(9)+40,A.Y(20),{size:28,color:QC.a,weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 10. 小さい三角形が 9 個ぶん入る。18×9＝162。答え D
 [K+'nine']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.75;
  const A=vt({xmax:9.6,ymax:40,xt:[3,6,9],yt:[[2,1]]});
  const P=(t,v)=>[A.X(t),A.Y(v)];
  let s=A.svg;
  // 9 個の小さな三角形（上向き 6、下向き 3）
  const ups=[[0,2],[3,2],[6,2],[3,14],[6,14],[6,26]].map(([t,v])=>[P(t,v),P(t+3,v),P(t+3,v+12)]);
  const downs=[[3,2],[6,2],[6,14]].map(([t,v])=>[P(t,v),P(t,v+12),P(t+3,v+12)]);
  const tris=[ups[0],ups[1],downs[0],ups[2],downs[1],ups[3],ups[4],downs[2],ups[5]];
  tris.forEach((tr,i)=>{const g=seg(p,.05+i*.045,.09+i*.045);s+=fade(g,poly(tr,{fill:i%2?LT:QC.x,fo:.35,stroke:C.ink,sw:2}));
   const cx=(tr[0][0]+tr[1][0]+tr[2][0])/3,cy=(tr[0][1]+tr[1][1]+tr[2][1])/3;s+=fade(g,label(String(i+1),cx,cy+9,{size:24,color:C.ink,anchor:'middle',weight:700}));});
  s+=lineR(A,9);
  s+=rpanel(110,200,T('3\\times3=9',RC,165,38)+fade(seg(p,.45,.55),T('\\tfrac12\\times4\\times9^2=162',RC,230,32))+fade(seg(p,.55,.65),T('18\\times9=162',RC,280,36)),1,QC.x);
  s+=goalTag(G2)+A2(seg(p,b,b+.06));
  return s;
 },
 // 11. 誤答 A・B・C を1枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  const A=vt({xmax:9.6,ymax:40,xt:[3,6,9],yt:[[2,1]]});
  let s=A.svg+triR(A,9,1,.2,QC.x)+triR(A,3,1,.45)+lineR(A,9);
  s+=goalTag(G2)+A2(1);
  s+=wrongSeq(p,ctx,[['A','3 倍','高さの at も3倍になる'],['B','27 倍','t² を t³ とした'],['C','7.5 倍','全体どうし 180÷24']],{opts:{...WOPT,y:200}});
  return s;
 },
 // ================= S3 小問3 =================
 // 12. S の v-t グラフと上段の数直線（S は −5 m）
 [K+'goal3']:(p)=>{
  const A=vtS();
  let s=nline()+carS(-5)+A.svg+lineS(A,lin(p,.1,.4));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 13. 第2式に 8×3 と ½×(−2)×3² を入れる。長方形 8×3（水色）、削られる三角形（赤の斜線）−9
 [K+'eq2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const A=vtS();
  let s=nline()+carS(-5)+A.svg;
  const gr=seg(p,b,b+.08),gt=seg(p,b+.2,b+.3);
  s+=fade(gr,rect(A.X(0),A.Y(8),A.X(3)-A.X(0),A.Y(0)-A.Y(8),{fill:QC.x,fo:.35,stroke:QC.x,sw:2,rx:0}));
  s+=fade(gr,label('24',A.X(1.2),A.Y(2.5)+10,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(gt,hatch('qxua2h')+poly([[A.X(0),A.Y(8)],[A.X(3),A.Y(8)],[A.X(3),A.Y(2)]],{fill:'url(#qxua2h)',fo:.7,stroke:QC.a,sw:2})+label('−9',A.X(2.4),A.Y(6.6)+10,{size:28,color:QC.a,anchor:'middle',weight:700}));
  s+=lineS(A);
  let eq=T('x=v_0t+\\tfrac12at^2',880,290,40);
  eq+=fade(seg(p,.25,.35),T('=8\\times3+\\tfrac12\\times(-2)\\times3^2',880,368,34));
  s+=card(580,244,600,170,eq,seg(p,.05,.15),C.faint);
  s+=fade(seg(p,.08,.18),label('符号を 付けた まま',880,448,{size:26,color:QC.a,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 14. 24−9＝15、(8＋2)×3÷2＝15。台形を水色で
 [K+'disp3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  const A=vtS({two:1});
  let s=nline()+carS(-5)+A.svg;
  const gtr=seg(p,b,b+.1);
  s+=fade(1-gtr,rect(A.X(0),A.Y(8),A.X(3)-A.X(0),A.Y(0)-A.Y(8),{fill:QC.x,fo:.35,stroke:QC.x,sw:2,rx:0})+hatch('qxua2h')+poly([[A.X(0),A.Y(8)],[A.X(3),A.Y(8)],[A.X(3),A.Y(2)]],{fill:'url(#qxua2h)',fo:.7,stroke:QC.a,sw:2}));
  s+=fade(gtr,poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(8)],[A.X(3),A.Y(2)],[A.X(3),A.Y(0)]],{fill:QC.x,fo:.4,stroke:QC.x,sw:2})+label('15',A.X(1.5),A.Y(2.5)+10,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=lineS(A);
  s+=card(580,244,600,170,T('24-9=15',880,298,40)+fade(gtr,T('\\dfrac{(8+2)\\times3}{2}=15',880,373,34)),1,QC.x);
  s+=goalTag(G3);
  return s;
 },
 // 15. 「位置＝x₀＋変位」。数直線上で −5 から右へ 15 の水色の矢印
 [K+'pos']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  const A=vtS({two:1});
  let s=nline()+carS(-5,{acc:1-seg(p,b,b+.1)})+A.svg+poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(8)],[A.X(3),A.Y(2)],[A.X(3),A.Y(0)]],{fill:QC.x,fo:.4,stroke:QC.x,sw:2})+lineS(A);
  s+=label('15',A.X(1.5),A.Y(2.5)+10,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=card(580,262,600,100,label('第2式の x ＝ 開始からの 変位',880,322,{size:28,color:QC.x,anchor:'middle',weight:700}),seg(p,.05,.15),QC.x);
  s+=card(580,378,600,100,label('位置 ＝ x₀ ＋ 変位',880,438,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,b,b+.08),C.hi);
  s+=arrow(NX(-5),NY+56,NX(10),NY+56,{color:QC.x,w:6,head:18,g:seg(p,b+.15,b+.4)});
  s+=fade(seg(p,b+.3,b+.4),label('変位 15',NX(10)+20,NY+64,{size:26,color:QC.x,weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 16. S を −5 から 10 まで動かす（速さの数値は消し、紫の矢印を 2 m/s の長さまで短く）。x＝10 に黄の点。答え C
 [K+'move']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  const u=lin(p,.08,.55),t=3*u,m=-5+8*t-t*t,v=8-2*t;
  const A=vtS({two:1});
  let s=nline()+A.svg+poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(8)],[A.X(3),A.Y(2)],[A.X(3),A.Y(0)]],{fill:QC.x,fo:.4,stroke:QC.x,sw:2})+lineS(A);
  s+=dot(A.X(t),A.Y(v),9,C.hi);
  s+=fade(1-seg(p,.55,.62),arrow(NX(-5),NY+56,NX(10),NY+56,{color:QC.x,w:6,head:18,opacity:.5}));
  s+=carS(m,{v:Math.round(v*100)/100,vlab:0,acc:0});
  s+=fade(seg(p,.55,.62),dot(NX(10),NY,10,C.hi)+label('10 m',NX(10),NY+70,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(580,300,600,110,T('-5+15=10\\ \\mathrm{m}',880,365,40),seg(p,.05,.15),C.hi);
  s+=goalTag(G3)+A3(seg(p,b,b+.08));
  return s;
 },
 // 17. 誤答 A・B・D を1枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  const A=vtS({two:1});
  let s=nline()+A.svg+poly([[A.X(0),A.Y(0)],[A.X(0),A.Y(8)],[A.X(3),A.Y(2)],[A.X(3),A.Y(0)]],{fill:QC.x,fo:.4,stroke:QC.x,sw:2})+lineS(A);
  s+=carS(10,{v:2,vlab:0,acc:0})+dot(NX(10),NY,10,C.hi);
  s+=goalTag(G3)+A3(1);
  s+=wrongSeq(p,ctx,[['A','15 m','変位を位置とした'],['B','28 m','a の符号を落として 9 を足した'],['D','20 m','−5 を ＋5 とした']],{opts:{x:620,w:540,y:280,size:28,whySize:24}});
  return s;
 },
 // ================= S4 まとめ =================
 // 18. 式の v₀t を長方形の色、½at² を三角形の色で。R の図と並べる
 [K+'sum']:(p)=>{
  const A=vt({x:140,y:455,w:480,h:330,yt:[[2,1],[14,1]]});
  let s=A.svg+rectR(A,3,seg(p,.3,.4),.5)+triR(A,3,seg(p,.5,.6),.4)+lineR(A,3);
  s+=fade(seg(p,.3,.4),label('v₀t',A.X(1.5),A.Y(1)+10,{size:26,color:C.ink,anchor:'middle',weight:700}))+fade(seg(p,.5,.6),label('½at²',A.X(2.2),A.Y(8)+10,{size:28,color:C.ink,anchor:'middle',weight:700}));
  const f=`x={\\color{${seg(p,.3,.4)>.5?QC.x:C.ink}}v_0t}+{\\color{${seg(p,.5,.6)>.5?LT:C.ink}}\\tfrac12at^2}`;
  s+=card(700,170,480,150,tex(f,940,255,{size:46,auto:false}),seg(p,.03,.15),C.hi);
  s+=fade(seg(p,.3,.4),label('長方形',820,370,{size:28,color:QC.x,anchor:'middle',weight:700}))+fade(seg(p,.5,.6),label('三角形',1040,370,{size:28,color:LT,anchor:'middle',weight:700}));
  return s;
 },
};
