// 問題編 解説「4.0 Ω と 12 Ω、つなぎ方で何が変わる？」(ys-qx-hs-e-current-4) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/401_電流とオームの法則.md の q-hs-e-current-4（解説 21 行）。
// 色（正本）：電流 I 緑、電圧 V 紫、抵抗 R 白、電子 青、正電荷 赤、強調 黄。右下に小さな凡例（R 白・電子 青・正電荷 赤）を全画面で出す。
// 左に回路（x＜620）、右に説明の枠（x≥700）。札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 電池の記号・抵抗の記号・色は単元動画（yt1-hs-e-current-1 / -4）の部品を読み込んで使う（そのファイルは編集しない）。
// 電池は長い線（＋極）が左。電流は ＋極 → 左へ → 左の辺を上へ →（並列：分かれ道 A で二手に → 合流点 B）→ 右の辺を下へ → −極。
import {C,seg,fade,label,line,rect,dot,arrow,tex,clamp,draw} from './anim.mjs';
import {IC,VC,NEG,POS,battery,resistor} from './yt1-hs-e-current-1-diagrams.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,legend,sentWin,cueT} from './yt1-qx-common.mjs';

const K='qx-hs-e-current-4:';
const G1='並列の全体の抵抗',G2='R₁ に流れる電流',G3='R₁ の両端の電圧';
const A1=g=>answerTag(1,'C','3.0 Ω',{g}),A2=g=>answerTag(2,'B','3.0 A',{g}),A3=g=>answerTag(3,'A','3.0 V',{g});
const LEG=(g=1)=>legend([['R 白',C.ink],['電子 青',NEG],['正電荷 赤',POS]],832,503,{dir:'row',size:22,gap:12,g});
const W=(x1,y1,x2,y2,o=1)=>line(x1,y1,x2,y2,{color:C.dim,w:4,opacity:o});
const AR=(x1,y1,x2,y2,w=6)=>arrow(x1,y1,x2,y2,{color:IC,w,head:12+1.6*w});
const TX=(src,x,y,o={})=>tex(src,x,y,{size:40,auto:false,...o});
const lab=(t,x,y,o={})=>label(t,x,y,{size:26,color:C.ink,anchor:'middle',weight:700,...o});
// 紫の電圧の目盛り（両端に縦の線）
const vbar=(a,b,y,col=VC)=>line(a,y,b,y,{color:col,w:3})+line(a,y-10,a,y+10,{color:col,w:3})+line(b,y-10,b,y+10,{color:col,w:3});
const vdbl=(x,ya,yb,col=VC)=>arrow(x,(ya+yb)/2,x,ya,{color:col,w:3,head:12})+arrow(x,(ya+yb)/2,x,yb,{color:col,w:3,head:12});
const panel=(y,h,inner,g=1,col=C.faint)=>card(700,y,490,h,inner,g,col);
const PCX=945;   // 説明の枠の中央
// 文の区切り（2文目の始まり）
const s2=(ctx,d=.5)=>{const w=sentWin(ctx);return w[1]?w[1][0]:d;};

// ---- 並列の回路 ----------------------------------------------------------------------------------
export const PQ={L:70,R:600,nA:150,nB:520,ra:240,rb:430,y1:150,y2:300,ym:225,B:440,bx:335};
function par({cur=1,w1=6,w2=6,wm=6,br=1,one=0,vb=0,nodes=0,i1=0,i2=0,itot=0,hl1=0,glow=0,v1hl=0,r1hl=0,draw:dr=1,arr=1}={}){
 const {L,R,nA,nB,ra,rb,y1,y2,ym,B,bx}=PQ,rc=(ra+rb)/2;
 const d1=seg(dr,0,.45),d2=seg(dr,.3,.75),d3=seg(dr,.55,1);
 let s='';
 // 外側の導線と電池
 s+=fade(d1,W(L,ym,L,B)+W(L,ym,nA,ym)+W(nB,ym,R,ym)+W(R,ym,R,B)+W(L,B,bx-11,B)+W(bx+11,B,R,B)+battery(bx,B,{pos:'left'})+dot(nA,ym,7,C.ink)+dot(nB,ym,7,C.ink));
 s+=fade(d3,lab('12 V',bx,B+64,{size:28,color:VC}));
 // R₁ の枝の黄の縁取り
 if(hl1)s+=fade(hl1,rect(nA-12,y1-28,nB-nA+24,56,{fill:C.hi,fo:.10,stroke:C.hi,sw:3,rx:12}));
 // 2本の枝
 const bo=br*d2;
 if(bo>0){
  let b=W(nA,y1,nA,y2)+W(nB,y1,nB,y2);
  for(const y of [y1,y2])b+=W(nA,y,ra,y)+resistor(ra,rb,y,{n:5})+W(rb,y,nB,y);
  if(r1hl)b+=fade(r1hl,rect(rc-92,y1-58,184,40,{fill:C.hi,fo:.18,stroke:C.hi,sw:2.5,rx:8}));
  b+=fade(seg(dr,.5,.85),lab('R₁　4.0 Ω',rc,y1-30,{size:28})+lab('R₂　12 Ω',rc,y2+52,{size:28}));
  s+=fade(bo,b);
 }
 // 1本の抵抗に置き換えた図
 if(one>0)s+=fade(one,W(nA,ym,ra,ym)+resistor(ra,rb,ym,{n:5})+W(rb,ym,nB,ym)+lab('3.0 Ω',rc,ym-32,{size:30,color:C.hi})
  +rect(rc-125,ym+34,250,42,{fill:C.ink,fo:.08,stroke:C.ink,sw:2,rx:10})+lab('R：全体の抵抗',rc,ym+64,{size:26}));
 // 両端の点（黄）
 if(nodes)s+=fade(nodes*bo,line(nA,y1,nA,y2,{color:C.hi,w:7})+line(nB,y1,nB,y2,{color:C.hi,w:7})
  +dot(nA,y1,10,C.hi)+dot(nA,y2,10,C.hi)+dot(nB,y1,10,C.hi)+dot(nB,y2,10,C.hi));
 // 両方の枝に同じ 12 V（紫）
 if(vb){let v=vbar(ra,rb,y1+40)+vbar(ra,rb,y2-40);
  if(v1hl)v+=fade(v1hl,rect(rb+4,y1+20,82,38,{fill:C.hi,fo:.18,stroke:C.hi,sw:2.5,rx:8}));
  v+=label('12 V',rb+12,y1+50,{size:26,color:VC,weight:700})+label('12 V',rb+12,y2-30,{size:26,color:VC,weight:700});
  s+=fade(vb*bo,v);}
 // 電流の矢印（緑）。分かれ道で二手に、合流点で一つに
 if(cur>0){
  const a1=seg(arr,0,.3),a2=seg(arr,.3,.6),a3=seg(arr,.6,1);
  let c=fade(a1,AR(bx-50,B,L+40,B,wm)+AR(L,B-40,L,ym+40,wm)+AR(L+16,ym,nA-16,ym,wm));
  let br2='';
  if(glow)br2+=fade(glow,line(nA+14,y1,ra-8,y1,{color:C.hi,w:w1+14,opacity:.35})+line(rb+8,y1,nB-14,y1,{color:C.hi,w:w1+14,opacity:.35})
   +line(nA+14,y2,ra-8,y2,{color:C.hi,w:w2+14,opacity:.35})+line(rb+8,y2,nB-14,y2,{color:C.hi,w:w2+14,opacity:.35}));
  br2+=AR(nA+14,y1,ra-8,y1,w1)+AR(rb+8,y1,nB-14,y1,w1)+AR(nA+14,y2,ra-8,y2,w2)+AR(rb+8,y2,nB-14,y2,w2);
  c+=fade(a2*bo,br2);
  c+=fade(a3,AR(nB+16,ym,R-16,ym,wm)+AR(R,ym+40,R,B-40,wm)+AR(R-40,B,bx+50,B,wm));
  s+=fade(cur,c);
 }
 if(i1)s+=fade(i1*bo,lab('3.0 A',(nA+ra)/2+4,y1-36,{color:IC}));
 if(i2)s+=fade(i2*bo,lab('1.0 A',(nA+ra)/2+4,y2+42,{color:IC}));
 if(itot)s+=fade(itot,label('4.0 A',L+20,(ym+B)/2+50,{size:26,color:IC,weight:700})+label('4.0 A',R+14,(ym+B)/2+10,{size:26,color:IC,weight:700}));
 return s;
}
// ---- 直列の回路 ----------------------------------------------------------------------------------
export const SQ={L:70,R:600,T:170,B:440,bx:335,r1:[130,290],r2:[380,540]};
function ser({cur=0,i=0,vb1=0,vb2=0,c1=0,c2=0,draw:dr=1,vhl=0}={}){
 const {L,R,T,B,bx,r1,r2}=SQ,m1=(r1[0]+r1[1])/2,m2=(r2[0]+r2[1])/2;
 const d1=seg(dr,0,.45),d2=seg(dr,.3,.75),d3=seg(dr,.55,1);
 let s=fade(d1,W(L,T,r1[0],T)+W(r1[1],T,r2[0],T)+W(r2[1],T,R,T)+W(R,T,R,B)+W(L,T,L,B)+W(L,B,bx-11,B)+W(bx+11,B,R,B)+battery(bx,B,{pos:'left'}));
 s+=fade(d2,resistor(r1[0],r1[1],T,{n:5})+resistor(r2[0],r2[1],T,{n:5}));
 s+=fade(d3,lab('R₁　4.0 Ω',m1,T-36,{size:28})+lab('R₂　12 Ω',m2,T-36,{size:28})+lab('12 V',bx,B+64,{size:28,color:VC}));
 if(cur)s+=fade(cur,AR(bx-50,B,L+40,B)+AR(L,B-40,L,T+40)+AR(r1[0]+30,T+44,r1[1]-30,T+44)+AR(r2[0]+30,T+44,r2[1]-30,T+44)+AR(R,T+40,R,B-40)+AR(R-40,B,bx+50,B));
 if(i)s+=fade(i,lab('0.75 A',m1,T+84,{color:IC})+lab('0.75 A',m2,T+84,{color:IC}));
 const vc=vhl?C.hi:VC;
 if(vb1)s+=fade(vb1,vbar(r1[0],r1[1],T+114)+lab('3.0 V',m1,T+150,{size:28,color:VC}));
 if(vb2)s+=fade(vb2,vbar(r2[0],r2[1],T+114)+lab('9.0 V',m2,T+150,{size:28,color:VC}));
 if(c1)s+=fade(c1,TX(`4.0\\times 0.75=3.0\\ \\mathrm{V}`,m1,T+196,{size:30,color:C.dim}));
 if(c2)s+=fade(c2,TX(`12\\times 0.75=9.0\\ \\mathrm{V}`,m2,T+196,{size:30,color:C.dim}));
 return s;
}
// ---- 電気の高さのグラフ（直列。回路を電流の向きにたどる）------------------------------------------
const GX={x0:740,x1:1175,xs:765,a1:840,b1:925,a2:1005,b2:1090,xe:1160,y0:300,k:15};
const gy=v=>GX.y0-GX.k*v;
function pot({r1=1,r2=0,hl=0,sum=0,g=1}={}){
 const {x0,x1,xs,a1,b1,a2,b2,xe,y0}=GX;
 let s=line(x0,y0,x1,y0,{color:C.dim,w:2})+arrow(x0,y0,x0,gy(13.5),{color:C.dim,w:2,head:12});
 s+=label('電気の 高さ',x0+14,gy(13.5)+8,{size:24,color:VC,weight:700});
 s+=label('12 V',x0-8,gy(12)+8,{size:24,color:VC,anchor:'end',weight:700})+label('0',x0-8,y0+8,{size:24,color:C.dim,anchor:'end'});
 s+=line(x0,gy(12),xs,gy(12),{color:C.faint,w:2,dash:'5 5'});
 s+=label('R₁',(a1+b1)/2,y0+32,{size:24,color:C.ink,anchor:'middle',weight:700})+label('R₂',(a2+b2)/2,y0+32,{size:24,color:C.ink,anchor:'middle',weight:700});
 s+=line(a1,y0-6,a1,y0+6,{color:C.dim,w:2})+line(b1,y0-6,b1,y0+6,{color:C.dim,w:2})+line(a2,y0-6,a2,y0+6,{color:C.dim,w:2})+line(b2,y0-6,b2,y0+6,{color:C.dim,w:2});
 const col=hl?C.hi:VC;
 s+=fade(r1,draw([[xs,gy(12)],[a1,gy(12)],[b1,gy(9)]],1,{color:VC,w:5})+line(b1,gy(12),b1+40,gy(12),{color:C.faint,w:2,dash:'5 5'})+vdbl(b1+28,gy(12),gy(9),col)+label('3.0 V',b1+42,gy(10.5)+2,{size:24,color:col,weight:700}));
 s+=fade(r2,draw([[b1,gy(9)],[a2,gy(9)],[b2,gy(0)],[xe,gy(0)]],1,{color:VC,w:5})+line(b2,gy(9),b2+40,gy(9),{color:C.faint,w:2,dash:'5 5'})+vdbl(b2+28,gy(9),gy(0),col)+label('9.0 V',b2+38,gy(4.5)+8,{size:24,color:col,weight:700}));
 if(sum)s+=fade(sum,TX(`3.0+9.0=12\\ \\mathrm{V}`,1188,gy(13.5)-6,{size:30,color:VC,anchor:'end'}));
 return fade(g,s);
}
// ---- 並列の式（1/R の足し算 → 逆数）------------------------------------------------------------
const FR=`\\dfrac{1}{R}`;
function recipLine(x,y,{hl=0,g=1,size=44}={}){
 let s=TX(`${FR}=\\dfrac{1}{3}`,x,y,{size});
 const ac=hl?C.hi:C.ink;
 if(hl)s+=fade(hl,rect(x+90,y-62,190,80,{fill:C.hi,fo:.12,stroke:C.hi,sw:3,rx:12}));
 s+=arrow(x+105,y,x+265,y,{color:ac,w:5,head:18})+label('逆数を とる',x+185,y-22,{size:24,color:hl?C.hi:C.dim,anchor:'middle',weight:700});
 s+=TX(`R=3.0\\ \\Omega`,x+400,y,{size,color:C.hi});
 return fade(g,s);
}
// ---- 棒（4.0 Ω・12 Ω・並列 3.0 Ω）-------------------------------------------------------------------
function bars(g=1,{hi=0}={}){
 const row=(y,t,v,col,o)=>fade(o,label(t,300,y+10,{size:28,color:col,anchor:'end',weight:700})+rect(330,y-18,40*v,36,{fill:col,fo:.45,stroke:col,sw:2,rx:6}));
 let s=row(150,'R₁　4.0 Ω',4,C.dim,1)+row(215,'R₂　12 Ω',12,C.dim,1)+row(280,'並列　3.0 Ω',3,C.hi,1);
 s+=label('どちらの 1本 よりも 小さい',480,290,{size:28,color:C.hi,weight:700,opacity:hi});
 return fade(g,s);
}

export const qxHsECurrent4Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1・2）：並列の回路を描き、緑の電流の矢印が分かれ道で二手に分かれ、合流点で一つに。枝の矢印の太さは同じ。3 秒で静止。
 // 出さないもの：全体の抵抗、各枝の電流、各抵抗の両端の電圧。
 [K+'q0']:(p)=>par({draw:seg(p,0,.55),cur:1,arr:seg(p,.5,1)})+LEG(seg(p,.3,.6)),
 // 小問3：暗転から、同じ R₁・R₂ を直列にして 12 V の電池につないだ回路を描く（2 秒で静止）。並列の図は残さない。電流の矢印・電圧は描かない。
 [K+'q3']:(p)=>ser({draw:seg(p,.05,1)})+LEG(seg(p,.4,.8)),
 // ================= S1 小問1：並列の全体の抵抗 =================
 // 1. 並列の回路。求めるもの：並列の全体の抵抗
 [K+'goal1']:(p)=>par({draw:seg(p,0,.3),arr:seg(p,.25,.55)})+goalTag(G1,{g:seg(p,.03,.15)})+LEG(),
 // 2. 両端が同じ2点（黄の点）→ どちらの枝にも 12 V（紫）
 [K+'sameV']:(p,ctx)=>{
  const b=s2(ctx);
  let s=par({nodes:seg(p,.04,.16),vb:seg(p,b+.02,b+.14)});
  s+=panel(100,200,lab('両端が 同じ 2点',PCX,160,{size:30,color:C.hi})+fade(seg(p,b+.02,b+.14),lab('どちらの 枝にも 12 V',PCX,240,{size:30,color:VC})),seg(p,.06,.18),C.hi);
  return s+goalTag(G1)+LEG();
 },
 // 3. 枝ごとにオームの法則：R₁ 3.0 A、R₂ 1.0 A。矢印の太さを 3：1 に
 [K+'ohm']:(p,ctx)=>{
  const b=s2(ctx),c1=seg(p,b+.02,b+.14),c2=seg(p,b+.4,b+.52);
  let s=par({vb:1,w1:6+4.5*c1,w2:6-2.5*c2,i1:c1,i2:c2});
  let pn=lab('オームの法則',PCX,140,{size:26,color:C.dim})+TX(`{\\color{${IC}}I}=\\dfrac{{\\color{${VC}}V}}{R}`,PCX,222,{size:42});
  pn+=fade(c1,TX(`R_1:\\ 12\\div 4.0={\\color{${IC}}3.0\\ \\mathrm{A}}`,PCX,300,{size:36}));
  pn+=fade(c2,TX(`R_2:\\ 12\\div 12={\\color{${IC}}1.0\\ \\mathrm{A}}`,PCX,375,{size:36}));
  s+=panel(100,310,pn,seg(p,.03,.15),IC);
  return s+goalTag(G1)+LEG();
 },
 // 4. 全体の電流は枝の電流の和 4.0 A。合流後の矢印を太く
 [K+'isum']:(p)=>{
  const u=seg(p,.15,.45);
  let s=par({vb:1,w1:10.5,w2:3.5,wm:6+8*u,i1:1,i2:1,itot:seg(p,.35,.5)});
  s+=fade(seg(p,.05,.2),label('合流点',PQ.nB+16,PQ.ym-34,{size:24,color:C.hi,weight:700}));
  s+=panel(100,200,lab('全体の 電流',PCX,150,{size:28,color:C.dim})+TX(`3.0+1.0={\\color{${IC}}4.0\\ \\mathrm{A}}`,PCX,230,{size:40,color:IC}),seg(p,.05,.2),IC);
  return s+goalTag(G1)+LEG();
 },
 // 5. 2本の枝を 1本の白い抵抗「3.0 Ω」に置き換え、「R：全体の抵抗」
 [K+'whole']:(p)=>{
  const sw=seg(p,.1,.3);
  let s=par({w1:10.5,w2:3.5,wm:14,itot:1,br:1-sw,one:sw,i1:1,i2:1,vb:1});
  let pn=lab('全体を 1本と みる',PCX,150,{size:28,color:C.dim});
  pn+=fade(seg(p,.35,.5),TX(`\\dfrac{{\\color{${VC}}12\\ \\mathrm{V}}}{{\\color{${IC}}4.0\\ \\mathrm{A}}}=3.0\\ \\Omega`,PCX,250,{size:40}));
  s+=panel(100,220,pn,seg(p,.05,.2),C.hi);
  return s+goalTag(G1)+LEG();
 },
 // 6. 【式】1/R＝1/R₁＋1/R₂ に代入 → 1/4 を 3/12 に直して 4/12＝1/3 → 逆数で 3.0 Ω
 [K+'formula']:(p)=>{
  let s=TX(`${FR}=\\dfrac{1}{R_1}+\\dfrac{1}{R_2}`,600,150,{size:44});
  const x0=170,y=290,st=[seg(p,.1,.2),seg(p,.3,.4),seg(p,.48,.56)];
  s+=fade(st[0],TX(`${FR}=\\dfrac{1}{4.0}+\\dfrac{1}{12}`,x0,y,{size:42,anchor:'start'}));
  s+=fade(st[1],TX(`${FR}=\\dfrac{1}{4.0}+\\dfrac{1}{12}=\\dfrac{3}{12}+\\dfrac{1}{12}`,x0,y,{size:42,anchor:'start'}));
  s+=fade(st[2],TX(`${FR}=\\dfrac{1}{4.0}+\\dfrac{1}{12}=\\dfrac{3}{12}+\\dfrac{1}{12}=\\dfrac{4}{12}=\\dfrac{1}{3}`,x0,y,{size:42,anchor:'start'}));
  s+=fade(st[1]*(1-seg(p,.62,.7)),label('1/4.0 を 3/12 に 直す',600,375,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=recipLine(260,430,{g:seg(p,.68,.8)});
  return s+goalTag(G1)+LEG();
 },
 // 7. 小問1 の答え C。2文目で 4.0 Ω・12 Ω・3.0 Ω の棒を並べる
 [K+'ans1']:(p,ctx)=>{
  const b=s2(ctx),x=seg(p,b,b+.08);
  let s=fade(1-x,recipLine(260,430)+TX(`${FR}=\\dfrac{1}{R_1}+\\dfrac{1}{R_2}`,600,150,{size:44}));
  s+=bars(x,{hi:seg(p,b+.3,b+.42)});
  const w=sentWin(ctx);
  return s+goalTag(G1)+A1(seg(p,w[0][1]-.08,w[0][1]))+LEG();
 },
 // 8. 誤答 A（直列の足し方）→ 誤答 D（平均）。1枚ずつ
 [K+'wrongAD']:(p,ctx)=>{
  let s=bars(1,{hi:1});
  s+=wrongSeq(p,ctx,[['A','16 Ω','直列の足し方を使った',{mid:'4.0+12=16'}],['D','8.0 Ω','平均をとった',{mid:'(4.0+12)\\div 2=8.0'}]],{opts:{y:305}});
  return s+goalTag(G1)+A1(1)+LEG();
 },
 // 9. 誤答 B：1/R で止めた（逆数のとり忘れ）。「逆数」の矢印を黄で光らせる
 [K+'wrongB']:(p,ctx)=>{
  const bl=seg(p,.15,.3)*(.6+.4*Math.sin(cueT(ctx)*5)**2);
  let s=recipLine(260,190,{hl:bl});
  s+=wrongCard('B','1/3 Ω','逆数のとり忘れ（単位 1/Ω）',{y:330,g:seg(p,.03,.1)});
  return s+goalTag(G1)+A1(1)+LEG();
 },
 // ================= S2 小問2：R₁ の電流 =================
 // 10. 求めるもの：R₁ に流れる電流。R₁ の枝を黄で縁取る
 [K+'goal2']:(p)=>par({hl1:seg(p,.2,.35)})+goalTag(G2,{g:seg(p,.03,.15)})+LEG(),
 // 11. R₁ の枝の 12 V と 4.0 Ω を光らせ、3.0 A。2文目で答え B
 [K+'ans2']:(p,ctx)=>{
  const b=s2(ctx),hv=seg(p,.12,.22),hr=seg(p,.3,.4),a=seg(p,.45,.6);
  let s=par({hl1:1,vb:hv,v1hl:hv,r1hl:hr,i1:a,w1:6+4.5*a,w2:6-2.5*a});
  s+=panel(100,150,TX(`12\\div 4.0={\\color{${IC}}3.0\\ \\mathrm{A}}`,PCX,185,{size:42}),seg(p,.4,.52),IC);
  return s+goalTag(G2)+A2(seg(p,b,b+.08))+LEG();
 },
 // 12. 誤答 A（R₂ の枝の電流 1.0 A）→ 誤答 C（合流後の全体の電流 4.0 A）
 [K+'wrongAC']:(p,ctx)=>{
  const w=sentWin(ctx),b=w[1]?w[1][0]:.5;
  let s=par({hl1:1,vb:1,i1:1,i2:seg(p,.02,.12),itot:seg(p,b,b+.08),w1:10.5,w2:3.5});
  s+=panel(100,150,TX(`12\\div 4.0={\\color{${IC}}3.0\\ \\mathrm{A}}`,PCX,185,{size:42}),1,IC);
  s+=wrongSeq(p,ctx,[['A','1.0 A','R₂ の枝の電流'],['C','4.0 A','合流後の全体の電流']],{opts:{x:700,w:490,y:280}});
  return s+goalTag(G2)+A2(1)+LEG();
 },
 // 13. 誤答 D（半分ずつ 2.0 A）。枝の矢印の太さ 3：1 を黄で強調
 [K+'wrongD2']:(p,ctx)=>{
  const b=s2(ctx);
  let s=par({hl1:1,vb:1,i1:1,i2:1,w1:10.5,w2:3.5,glow:seg(p,b,b+.08)});
  s+=panel(100,150,TX(`12\\div 4.0={\\color{${IC}}3.0\\ \\mathrm{A}}`,PCX,185,{size:42}),1,IC);
  s+=wrongCard('D','2.0 A','半分ずつではない',{x:700,w:490,y:280,mid:'4.0\\div 2=2.0',g:seg(p,.02,.08)});
  s+=fade(seg(p,b,b+.08),label('太さ 3 ： 1',PQ.nB+16,PQ.ym-34,{size:26,color:C.hi,weight:700}));
  return s+goalTag(G2)+A2(1)+LEG();
 },
 // ================= S3 小問3：直列の R₁ の電圧 =================
 // 14. 暗転して直列の回路。求めるもの：R₁ の両端の電圧
 [K+'goal3']:(p)=>ser({draw:seg(p,.02,.35)})+goalTag(G3,{g:seg(p,.03,.15)})+LEG(),
 // 15. 1本の道に、同じ太さの緑の矢印
 [K+'sameI']:(p)=>{
  let s=ser({cur:seg(p,.15,.35)});
  s+=panel(100,200,lab('1本の 道',PCX,160,{size:30,color:C.ink})+fade(seg(p,.4,.55),lab('R₁ にも R₂ にも 同じ 電流',PCX,240,{size:28,color:IC})),seg(p,.05,.18),IC);
  return s+goalTag(G3)+LEG();
 },
 // 16. R＝R₁＋R₂＝16 Ω、I＝12÷16＝0.75 A。両方の抵抗の横に 0.75 A
 [K+'calc']:(p)=>{
  let s=ser({cur:1,i:seg(p,.7,.82)});
  let pn=TX(`R=R_1+R_2`,PCX,150,{size:40});
  pn+=fade(seg(p,.12,.24),TX(`=4.0+12=16\\ \\Omega`,PCX,215,{size:40}));
  pn+=fade(seg(p,.5,.62),TX(`{\\color{${IC}}I}=\\dfrac{12}{16}={\\color{${IC}}0.75\\ \\mathrm{A}}`,PCX,320,{size:40}));
  s+=panel(100,290,pn,seg(p,.03,.12),C.hi);
  return s+goalTag(G3)+LEG();
 },
 // 17. R₁ の両端に 3.0 V。電気の高さのグラフで R₁ の区間に 3.0 V の段。2文目で答え A
 [K+'ans3']:(p,ctx)=>{
  const b=s2(ctx);
  let s=ser({cur:1,i:1,c1:seg(p,.05,.18),vb1:seg(p,.3,.42)});
  s+=pot({r1:seg(p,.35,.5),r2:0,g:seg(p,.3,.42)});
  return s+goalTag(G3)+A3(seg(p,b,b+.08))+LEG();
 },
 // 18. R₂ の両端に 9.0 V。グラフの 9.0 V の段を重ね、3.0＋9.0＝12 V
 [K+'v2']:(p)=>{
  let s=ser({cur:1,i:1,c1:1,vb1:1,c2:seg(p,.05,.18),vb2:seg(p,.2,.32)});
  s+=pot({r1:1,r2:seg(p,.25,.45),sum:seg(p,.6,.72)});
  return s+goalTag(G3)+A3(1)+LEG();
 },
 // 19. 誤答 B（12 V 全部）→ 誤答 C（R₂ の電圧 9.0 V）
 [K+'wrongBC']:(p,ctx)=>{
  let s=ser({cur:1,i:1,vb1:1,vb2:1});
  s+=pot({r1:1,r2:1,sum:1});
  s+=wrongSeq(p,ctx,[['B','12 V','直列では電圧を分け合う'],['C','9.0 V','R₂ の電圧']],{opts:{x:700,w:490,y:362}});
  return s+goalTag(G3)+A3(1)+LEG();
 },
 // 20. 誤答 D（半分ずつ 6.0 V）。3.0 V と 9.0 V の段の高さの違いを黄で
 [K+'wrongD3']:(p,ctx)=>{
  const b=s2(ctx);
  let s=ser({cur:1,i:1,vb1:1,vb2:1});
  s+=pot({r1:1,r2:1,sum:1,hl:seg(p,b,b+.06)>.5?1:0});
  s+=wrongCard('D','6.0 V','半分ずつではない',{x:700,w:490,y:362,g:seg(p,.02,.08)});
  return s+goalTag(G3)+A3(1)+LEG();
 },
 // ================= S4 まとめ =================
 // 21. 並列と直列を左右に並べ、「同じもの」の行に黄の枠。答えの札を右上に並べる
 [K+'sum']:(p,ctx)=>{
  const w=sentWin(ctx),b=w[0][1]*.55;
  const gL=seg(p,.03,.12),gR=seg(p,b,b+.1);
  const mini=(inner,x,y)=>`<g transform="translate(${x} ${y}) scale(.36)">${inner}</g>`;
  const box=(x,y,wd,o)=>fade(o,rect(x,y-30,wd,42,{fill:C.hi,fo:.10,stroke:C.hi,sw:3,rx:10}));
  let L=card(15,86,580,390,'',1,C.faint)+mini(par({vb:0}),40,70)+lab('並列',470,140,{size:34,color:C.hi});
  L+=box(30,330,550,seg(p,.12,.22))+label('同じもの：電圧 12 V',45,330,{size:28,color:VC,weight:700});
  L+=label('足すもの：電流 3.0＋1.0＝4.0 A',45,390,{size:28,color:IC,weight:700});
  L+=label('全体の 抵抗：3.0 Ω',45,450,{size:28,color:C.ink,weight:700});
  let R=card(605,86,580,390,'',1,C.faint)+mini(ser({cur:1}),630,70)+lab('直列',1060,140,{size:34,color:C.hi});
  R+=box(620,330,550,seg(p,b+.1,b+.2))+label('同じもの：電流 0.75 A',635,330,{size:28,color:IC,weight:700});
  R+=label('足すもの：電圧 3.0＋9.0＝12 V',635,390,{size:28,color:VC,weight:700});
  R+=label('全体の 抵抗：16 Ω',635,450,{size:28,color:C.ink,weight:700});
  return fade(gL,L)+fade(gR,R)+answerRow([[1,'C','3.0 Ω'],[2,'B','3.0 A'],[3,'A','3.0 V']],{g:seg(p,.03,.12)})+LEG();
 },
};
