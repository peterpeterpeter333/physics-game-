// 問題編 解説「衛星の周期と、楕円の軌道の形」（q-uc-frontier、大学編 19 慣性力と軌道・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/19_慣性力と軌道.md の q-uc-frontier（解説 23 行）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：r・𝐞r・p 水色、𝐞θ 黄、速度 v 紫、加速度 a 赤、力 F 緑、時間 t・周期 T 金、ω 桃、角度 θ 橙、離心率 e 桃、太陽 金、地球 青。
//   p は正本の小問3の指示どおり水色（単元動画 uc-frontier-4 では黄）。
// 図のために決めた値（問題文にない）：
//   小問1：静止衛星の軌道半径を画面で 190 px。出題中の「？」の点線の円は 0.42 倍（どの選択肢の比 0.5・0.707・0.25・0.63 とも違う大きさ）。
//   小問2：1 m＝60 px（r＝3 m で 180 px）、惑星は x 軸から 35° の所。𝐞r・𝐞θ の長さは画面で 90 px。
//   小問3：1（距離の単位）＝90 px の楕円（e＝0.6、近い点 1.0・遠い点 4.0 から決まる形）。記号を置く点は θ＝120°。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,axes} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,kindTag,legend,note,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-uc-frontier:';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const col=(c,s)=>`{\\color{${c}}${s}}`;
const SUN='#ffcf67',EARTH='#4d8fe0',CTH=C.E,CE=C.p,CP=C.x,CR=C.x,CTT=C.hi;
const G1='周期 T₀/2 の軌道半径 r',G2='加速度の 𝐞r 成分',G3='e と p';
const ANS1=g=>answerTag(1,'D','約 2.66×10⁷ m',{g}),ANS2=g=>answerTag(2,'C','−8 m/s²',{g}),ANS3=g=>answerTag(3,'B','e＝0.6、p＝1.6',{g});
const rr=col(CR,'r'),TT=col(C.t,'T'),WW=col(C.p,'\\omega'),th=col(CTH,'\\theta'),ee=col(CE,'e'),pp=col(CP,'p');
const ER=col(CR,'\\mathbf{e}_r'),ETH=col(CTT,'\\mathbf{e}_\\theta'),RV=col(CR,'\\mathbf{r}');
const D1=(a)=>`\\dfrac{d${a}}{dt}`,D2=(a)=>`\\dfrac{d^2${a}}{dt^2}`,dth=`\\dfrac{d${th}}{dt}`;
const PX=650,PW=530,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};

// ===================== 小問1：円軌道 =====================
const OX=300,OY=300,R0=190;
function orbit1({sat=0,q=1,qr=.42,qSolid=0,lab=1,va=0,g=1,ghosts=0}={}){
 let s=ring(OX,OY,R0,{color:C.dim,w:3})+ring(OX,OY,30,{color:EARTH,w:3,fill:'#1d3a66'})+label('地球',OX,OY+50,{size:22,color:C.ink,anchor:'middle'});
 const sx=OX+R0*Math.cos(sat),sy=OY-R0*Math.sin(sat);
 s+=rect(sx-9,sy-9,18,18,{fill:C.hi,fo:.9,stroke:C.hi,rx:3});
 if(lab)s+=arrow(OX,OY,OX+R0*Math.cos(-.6),OY-R0*Math.sin(-.6),{color:CR,w:3,head:12})+label('4.22×10⁷ m',OX+R0*Math.cos(-.6)+10,OY-R0*Math.sin(-.6)+34,{size:24,color:CR,weight:700})
  +label('周期 T₀',OX+R0+16,OY-120,{size:26,color:C.t,weight:700});
 if(q){const r=R0*qr;s+=ring(OX,OY,r,{color:qSolid?C.hi:C.ink,w:qSolid?4:2.5,dash:qSolid?'':'7 7'});
  if(lab)s+=line(OX-r*.7,OY-r*.7,OX-170,OY-170,{color:C.dim,w:1.5})+label(qSolid?'':'半径？',OX-178,OY-190,{size:24,color:C.ink,anchor:'end',weight:700})+label('周期 T₀/2',OX-178,OY-160,{size:24,color:C.t,anchor:'end',weight:700});}
 if(va){const ux=Math.cos(sat),uy=-Math.sin(sat),tx=-Math.sin(sat),ty=-Math.cos(sat);
  s+=fade(va,arrow(sx,sy,sx+tx*100,sy+ty*100,{color:C.v,w:6,head:16})+label('v',sx+tx*100+10,sy+ty*100-6,{size:28,color:C.v,weight:700})
   +arrow(sx-ux*14,sy-uy*14,sx-ux*90,sy-uy*90,{color:C.a,w:6,head:16})+label('a',sx-ux*90+6,sy-uy*90+30,{size:28,color:C.a,weight:700}));}
 if(ghosts){[[.5,'A'],[Math.SQRT1_2,'B'],[.25,'C']].forEach(([k,L])=>{s+=ring(OX,OY,R0*k,{color:C.dim,w:2,dash:'3 6'})+label(L,OX+R0*k*.71+4,OY+R0*k*.71+22,{size:22,color:C.dim,weight:700});});}
 return fade(g,s);
}

// ===================== 小問2：極座標 =====================
const SX=270,SY=330,PU=60,TH0=35*Math.PI/180;
function polar(thp,{er=1,et=1,rlab=1,vals=0,g=1,acc=0,trace=0}={}){
 let s=dot(SX,SY,16,SUN)+label('太陽',SX,SY+44,{size:22,color:SUN,anchor:'middle'});
 s+=line(SX,SY,SX+400,SY,{color:C.faint,w:2,dash:'5 7'});
 const R=3*PU,px=SX+R*Math.cos(thp),py=SY-R*Math.sin(thp),ux=Math.cos(thp),uy=-Math.sin(thp),tx=-Math.sin(thp),ty=-Math.cos(thp);
 s+=line(SX,SY,px,py,{color:CR,w:2.5});
 if(trace)s+=fade(trace,draw(Array.from({length:30},(_,i)=>{const a=10*Math.PI/180+(80*Math.PI/180)*i/29;return [SX+R*Math.cos(a),SY-R*Math.sin(a)];}),1,{color:C.faint,w:2,dash:'4 6'}));
 if(rlab)s+=label('r ＝ 3 m',SX+R*.5*ux+18*tx+6,SY+R*.5*uy+18*ty-8,{size:24,color:CR,weight:700,anchor:'middle'});
 s+=dot(px,py,11,C.x)+ring(px,py,11,{color:C.ink,w:2});
 if(er)s+=fade(er,arrow(px+ux*12,py+uy*12,px+ux*90,py+uy*90,{color:CR,w:5,head:14})+T(ER,px+ux*112,py+uy*112+10,30));
 if(et)s+=fade(et,arrow(px+tx*12,py+ty*12,px+tx*90,py+ty*90,{color:CTT,w:5,head:14})+T(ETH,px+tx*110-6,py+ty*110+4,30));
 if(acc)s+=fade(acc,arrow(px-ux*14,py-uy*14,px-ux*120,py-uy*120,{color:C.a,w:7,head:18})+label('8 m/s²',px-ux*70+20,py-uy*70+36,{size:26,color:C.a,weight:700}));
 if(vals){s+=fade(vals,label('dθ/dt ＝ 2 rad/s',700,180,{size:28,color:C.ink,weight:700})+label('d²r/dt² ＝ 4 m/s²',700,235,{size:28,color:C.ink,weight:700})+label('（数値は 計算練習用）',700,285,{size:24,color:C.dim}));}
 return fade(g,s);
}
const ledgerCols=(x0,w)=>[x0+w*.27,x0+w*.73];
// 帳簿：列 𝐞r／𝐞θ。rows＝[[見出し, 𝐞r の TeX, 𝐞θ の TeX, g, 𝐞θ を薄く]]
function ledger(x0,y0,w,rows,{hiR=0,dimT=0}={}){
 const [c1,c2]=ledgerCols(x0,w);
 let s=rect(x0,y0,w,60+rows.length*110,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:12});
 s+=T(ER,c1,y0+40,30)+label('の 列',c1+40,y0+44,{size:22,color:C.dim})+T(ETH,c2,y0+40,30)+label('の 列',c2+40,y0+44,{size:22,color:C.dim});
 s+=line(x0+10,y0+60,x0+w-10,y0+60,{color:C.faint,w:2})+line(x0+w/2,y0+12,x0+w/2,y0+50+rows.length*110,{color:C.faint,w:2});
 rows.forEach(([h,a,b,g=1],i)=>{const y=y0+60+i*110+60;
  s+=fade(g,label(h,x0+14,y-36,{size:22,color:C.dim})+(a?T(a,c1,y,30):'')+(b?T(b,c2,y,30,{opacity:dimT&&i===rows.length-1?.4:1}):''));});
 if(hiR)s+=highlight(x0+10,y0+60+(rows.length-1)*110+10,w/2-20,100,hiR,CR);
 return s;
}

// ===================== 小問3：楕円 =====================
const EE=.6,PP=1.6,AA=2.5,BB=2,CC=1.5;
function ellGeo({cx=330,cy=300,U=90}={}){const sx=cx+CC*U,sy=cy;return {cx,cy,U,sx,sy,P:t=>{const r=PP/(1+EE*Math.cos(t));return [sx+r*U*Math.cos(t),sy-r*U*Math.sin(t),r];}};}
function ell({cx=330,cy=300,U=90,near=1,far=1,comet=1,axis=1,g=1,rArrow=0,thArc=0,mark=120*Math.PI/180,rLab=1,thLab=1,hiR=0,hiTh=0}={}){
 const G=ellGeo({cx,cy,U});let s='';
 s+=draw(Array.from({length:121},(_,i)=>{const t=2*Math.PI*i/120;return [cx+AA*U*Math.cos(t),cy-BB*U*Math.sin(t)];}),1,{color:C.dim,w:3});
 if(axis)s+=line(cx-AA*U-10,cy,cx+AA*U+40,cy,{color:C.ink,w:2,dash:'3 7',opacity:.8});
 s+=dot(G.sx,G.sy,14,SUN)+label('太陽',G.sx-6,G.sy+40,{size:22,color:SUN,anchor:'middle'});
 if(near)s+=fade(near,label('1.0',(G.sx+cx+AA*U)/2+8,cy+34,{size:26,color:CR,anchor:'middle',weight:700}));
 if(far)s+=fade(far,label('4.0',(G.sx+cx-AA*U)/2,cy-12,{size:26,color:CR,anchor:'middle',weight:700}));
 if(comet)s+=dot(cx+AA*U,cy,9,C.ink)+label('彗星',cx+AA*U+14,cy+30,{size:22,color:C.ink});
 if(rArrow){const [px,py]=G.P(mark);
  s+=fade(rArrow,arrow(G.sx,G.sy,px,py,{color:CR,w:5+3*hiR,head:14})+dot(px,py,8,C.hi));
  if(rLab){const mx=(G.sx+px)/2,my=(G.sy+py)/2;s+=fade(rArrow,label('r：太陽からの距離',mx-14,my,{size:24,color:CR,anchor:'end',weight:700}));}}
 if(thArc){const n=24,ra=46,pts=Array.from({length:n+1},(_,i)=>{const a=mark*i/n;return [G.sx+ra*Math.cos(a),G.sy-ra*Math.sin(a)];});
  s+=fade(thArc,draw(pts,1,{color:CTH,w:4+3*hiTh}));
  if(thLab)s+=fade(thArc,label('θ：向き（最も近い向きが θ＝0）',640,262,{size:24,color:CTH,weight:700})+highlight(632,236,390,38,hiTh,CTH));}
 return fade(g,s);
}
// 小さな楕円（焦点に太陽）
function miniEll(x,y,a,e,{color=C.dim,g=1}={}){
 const b=a*Math.sqrt(1-e*e),c=a*e;
 return fade(g,draw(Array.from({length:61},(_,i)=>{const t=2*Math.PI*i/60;return [x+a*Math.cos(t),y-b*Math.sin(t)];}),1,{color,w:2.5})+dot(x+c,y,5,SUN));
}
const ORBIT=`${rr}=\\dfrac{${pp}}{1+${ee}\\cos${th}}`;

export const ytQxUcFrontierDiagrams={
 // ===================== 問題アニメ =====================
 // 小問1の図（約4秒）：静止衛星が円軌道を少し進む（0〜3 s）。内側に「？」の点線の円（大きさは答えに合わせない）。静止。
 [K+'q1']:(p,ctx)=>{
  const t=Math.min(cueT(ctx),3);
  return orbit1({sat:.4+.25*t,q:seg(p,.5,.8)});
 },
 // 小問2の図（約3秒）：太陽と惑星、r＝3 m、𝐞r・𝐞θ、値の札。静止。
 [K+'q2']:(p)=>polar(TH0,{er:seg(p,.2,.45),et:seg(p,.35,.6),vals:seg(p,.55,.85),g:seg(p,0,.2)}),
 // 小問3の図（約6秒）：楕円・太陽・彗星（最も近い点）・1.0・4.0。0〜3 s で記号を図に置き、3〜5 s で式の札。静止。
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=ell({rArrow:clamp(t/.8),thArc:clamp((t-.8)/.8),g:clamp(t/.4)});
  s+=fade(clamp((t-1.6)/.6),label('e：楕円の形（離心率）',640,150,{size:26,color:CE,weight:700}));
  s+=fade(clamp((t-2.2)/.6),label('p：軌道の大きさを決める長さ',640,200,{size:26,color:CP,weight:700}));
  s+=card(640,300,540,120,T(ORBIT,910,360,44),clamp((t-3)/.8),C.hi);
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題中の図
 [K+'goal1']:(p)=>orbit1({sat:1.15})+panel(110,160,label('小問1',PC,160,{size:26,color:C.dim,anchor:'middle'})+label('周期 T₀/2 の 軌道半径 は？',PC,215,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi)+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 円軌道の衛星に v（紫）と a（赤）。v＝rω、a＝rω²（単元動画で導いた結果）、ω＝2π/T
 [K+'circ']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=orbit1({sat:.35,q:0,lab:0,va:seg(p,.05,.15)});
  s+=panel(96,400,kindTag('結果',PC,140,{text:'単元動画で導いた結果'})
   +fade(seg(p,.08,.2),T(`${col(C.v,'v')}=${rr}${WW}`,PC,215,40))
   +fade(seg(p,.25,.38),T(`${col(C.a,'a')}=${rr}${WW}^2`,PC,295,40)+label('（中心向き）',PC+150,300,{size:22,color:C.a}))
   +fade(seg(p,b,b+.12),line(PX+40,340,PX+PW-40,340,{color:C.faint,w:2})+label('1周 2π を 周期 T で 割る',PC,380,{size:24,color:C.dim,anchor:'middle'})+T(`${WW}=\\dfrac{2\\pi}{${TT}}`,PC,450,40)),1);
  s+=goalTag(G1);
  return s;
 },
 // 3a. 法則 ma＝F：GMm/r²＝mr(2π/T)²
 [K+'law']:(p)=>{
  let s=kindTag('法則',600,130,{g:seg(p,.03,.12),text:'ma ＝ F（中心向き）'});
  s+=fade(seg(p,.1,.25),T(`m\\,${rr}\\left(\\dfrac{2\\pi}{${TT}}\\right)^2=\\dfrac{GMm}{${rr}^2}`,600,260,52));
  s+=fade(seg(p,.3,.45),label('質量 × 加速度',430,360,{size:26,color:C.a,anchor:'middle',weight:700})+label('万有引力（中心向きの 力）',800,360,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=goalTag(G1);
  return s;
 },
 // 3b. 整理：m を消し、r² を移して T² について解く。T²（金）と r³（水色）を光らせる
 [K+'kepler']:(p)=>{
  const mC=`{\\color{${C.a}}\\cancel{\\color{${C.ink}}m}}`;
  let s=T(`${mC}\\,${rr}\\left(\\dfrac{2\\pi}{${TT}}\\right)^2=\\dfrac{GM${mC}}{${rr}^2}`,600,150,40);
  s+=fade(seg(p,.15,.28),label('両辺に r² を 掛ける',980,250,{size:24,color:C.dim,anchor:'middle'})+T(`\\dfrac{4\\pi^2\\,${rr}^3}{${TT}^2}=GM`,600,250,40));
  s+=fade(seg(p,.38,.5),label('T² について 解く',980,370,{size:24,color:C.dim,anchor:'middle'})+T(`${TT}^2=\\dfrac{4\\pi^2\\,${rr}^3}{GM}`,600,370,48));
  const w=texWidth(`${TT}^2=\\dfrac{4\\pi^2\\,${rr}^3}{GM}`,48,false),x0=600-w/2;
  s+=fade(seg(p,.6,.7),highlight(x0-8,330,texWidth(`${TT}^2`,48,false)+16,70,1,C.t));
  s+=goalTag(G1);
  return s;
 },
 // 4. 棒：T² が 1/4 → r³ も 1/4 → r は (1/4)^(1/3)≈0.630
 [K+'bars']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,L=640,x0=360;
  const k1=mix(1,.25,seg(p,.1,.3)),k2=mix(1,.25,seg(p,b+.05,b+.25)),k3=mix(1,.63,seg(p,b+.4,b+.6));
  let s='';
  const bar=(y,k,c,lab,txt,g=1)=>fade(g,label(lab,x0-30,y+34,{size:30,color:c,anchor:'end',weight:700})+rect(x0,y,L,46,{fill:c,fo:.12,stroke:c,sw:1.5,rx:6,opacity:.5})+rect(x0,y,L*k,46,{fill:c,fo:.75,stroke:c,rx:6})+(txt?label(txt,x0+L*k+16,y+34,{size:26,color:c,weight:700}):''));
  s+=bar(110,k1,C.t,'T²',seg(p,.25,.32)>0?'× 1/4':'');
  s+=bar(220,k2,CR,'r³',seg(p,b+.2,b+.28)>0?'× 1/4':'',seg(p,b-.05,b+.05));
  s+=bar(330,k3,'#9fe9ff','r',seg(p,b+.55,b+.62)>0?'× 0.630':'',seg(p,b+.3,b+.4));
  s+=fade(seg(p,b+.55,b+.65),T(`\\left(\\dfrac14\\right)^{1/3}\\approx0.630`,600,465,36)+label('（1/4 の 3乗根）',830,472,{size:24,color:C.dim}));
  s+=goalTag(G1);
  return s;
 },
 // 5. 「？」の円が 0.630 倍の円に決まる。約 2.66×10⁷ m。小問1 の答え D
 [K+'r1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=orbit1({sat:1.15,qr:mix(.42,.63,seg(p,.05,.3)),qSolid:seg(p,.05,.3)>.5?1:0});
  s+=fade(seg(p,.3,.4),label('約 2.66×10⁷ m',OX-120,OY+R0*.63+46,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(110,200,T(`4.22\\times10^7\\times0.630`,PC,180,34)+fade(seg(p,.2,.35),T(`\\approx2.66\\times10^7\\ \\mathrm{m}`,PC,260,36)),1,C.hi);
  s+=goalTag(G1)+ANS1(seg(p,b+.1,b+.2));
  return s;
 },
 // 6. 誤答 A → B → C を一枚ずつ。3つの円軌道を薄い灰色の点線で重ねる
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),ve=W[0][1],wins=[[0,ve*.45],[ve*.45,ve*.72],[ve*.72,1]];
  let s=orbit1({sat:1.15,qr:.63,qSolid:1,ghosts:seg(p,.02,.1)});
  s+=wrongSeq(p,ctx,[['A','約 2.11×10⁷ m','T∝r（半分にした）'],['B','約 2.98×10⁷ m','T∝r²（1/√2 倍）'],['C','約 1.06×10⁷ m','T²∝r（1/4 倍）']],{win:wins,opts:{...WOPT,y:200}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 7. 暗転して出題中の小問2の図
 [K+'goal2']:(p)=>polar(TH0,{vals:1})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 8. 惑星を少し動かし、𝐞r と 𝐞θ が長さ 1 のまま向きを変える。札 𝐫＝r𝐞r
 [K+'units']:(p,ctx)=>{
  const a=mix(15,55,seg(p,.1,.9))*Math.PI/180;
  let s=polar(a,{trace:1});
  s+=panel(110,250,T(`${RV}=${rr}\\,${ER}`,PC,180,44)
   +label('𝐞r・𝐞θ：長さ 1 の 矢印',PC,260,{size:26,color:C.ink,anchor:'middle'})+label('回ると 向きが 変わる',PC,310,{size:26,color:C.hi,anchor:'middle',weight:700}),1);
  s+=goalTag(G2);
  return s;
 },
 // 9. 𝐞r の変化は 𝐞θ の向き、𝐞θ の変化は −𝐞r の向き
 [K+'deriv']:(p,ctx)=>{
  let s=card(20,90,1160,415,'',1);
  const box=(x0,y0,a,left,c1,c2,lab1,lab2,dc,dlab,g)=>{const L=140,d=24*Math.PI/180;
   const t1=[x0+L*Math.cos(a),y0-L*Math.sin(a)],t2=[x0+L*Math.cos(a+d),y0-L*Math.sin(a+d)];
   let q=arrow(x0,y0,...t1,{color:c1,w:5,head:14})+arrow(x0,y0,...t2,{color:c1,w:5,head:14,opacity:.6})+T(lab1,t1[0]+(left?-10:34),t1[1]+(left?-22:12),26);
   q+=fade(g,arrow(...t1,...t2,{color:dc,w:5,head:12})+label(dlab,(t1[0]+t2[0])/2+(left?-16:12),(t1[1]+t2[1])/2+(left?36:-14),{size:22,color:dc,anchor:left?'end':'start',weight:700}));
   const n=10,pts=Array.from({length:n+1},(_,i)=>{const u=a+d*i/n;return [x0+46*Math.cos(u),y0-46*Math.sin(u)];});
   q+=draw(pts,1,{color:CTH,w:3})+label('dθ',x0+58*Math.cos(a+d/2)+4,y0-58*Math.sin(a+d/2)+4,{size:22,color:CTH,weight:700});
   return q;};
  s+=box(90,260,10*Math.PI/180,0,CR,0,ER,'',CTT,'𝐞θ の 向き',seg(p,.1,.25));
  s+=fade(seg(p,.2,.32),T(`\\dfrac{d${ER}}{dt}=${dth}\\,${ETH}`,450,200,38));
  s+=box(240,480,100*Math.PI/180,1,CTT,0,ETH,'',CR,'−𝐞r の 向き',seg(p,.5,.65));
  s+=fade(seg(p,.6,.72),T(`\\dfrac{d${ETH}}{dt}=-${dth}\\,${ER}`,450,400,38));
  s+=fade(seg(p,.3,.4),label('（変化の 長さ ≈ dθ）',450,262,{size:24,color:C.dim,anchor:'middle'}));
  s+=goalTag(G2);
  return s;
 },
 // 10. 帳簿：𝐫＝r𝐞r を1回微分（積の微分）→ (dr/dt)𝐞r ＋ r(dθ/dt)𝐞θ
 [K+'vel']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=polar(TH0,{rlab:0});
  s+=fade(seg(p,.03,.15),T(`${D1(`(${rr}${ER})`)}=${D1(rr)}${ER}+${rr}\\,${D1(ER)}`,880,135,30));
  s+=ledger(600,190,580,[['速度',`${D1(rr)}`,`${rr}\\,${dth}`,seg(p,.2,.35)]]);
  s+=fade(seg(p,b,b+.1),label('r の 変化',740,395,{size:24,color:CR,anchor:'middle',weight:700})+label('𝐞r が 回った 分',1020,395,{size:24,color:CTT,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 11. もう1回微分：5つの項を帳簿に振り分け、−r(dθ/dt)² を 𝐞θ から 𝐞r の列へ。𝐞r の列を光らせる
 [K+'acc']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=fade(seg(p,.02,.12),T(`\\dfrac{d}{dt}\\!\\left[${D1(rr)}${ER}\\right]=${D2(rr)}${ER}+${D1(rr)}${dth}${ETH}`,600,110,28));
  s+=fade(seg(p,.12,.24),T(`\\dfrac{d}{dt}\\!\\left[${rr}${dth}${ETH}\\right]=${D1(rr)}${dth}${ETH}+${rr}${D2(th)}${ETH}{\\color{${C.a}}-${rr}\\left(${dth}\\right)^2${ER}}`,600,185,28));
  s+=ledger(150,240,900,[['加速度',`${D2(rr)}${seg(p,.4,.5)>.5?`-${rr}\\left(${dth}\\right)^2`:''}`,`2${D1(rr)}${dth}+${rr}${D2(th)}`,seg(p,.26,.36)]],{hiR:seg(p,b-.06,b),dimT:seg(p,b-.06,b)>.5?1:0});
  s+=fade(seg(p,.38,.5)*(1-seg(p,b+.3,b+.4)),arrow(980,215,520,340,{color:C.a,w:4,head:14})+label('𝐞θ が 回って 生まれた 項',1060,300,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 12. 4−3×2²＝4−12＝−8。惑星に太陽向きの加速度（赤）8 m/s²。小問2 の答え C
 [K+'num']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=polar(TH0,{rlab:0,acc:seg(p,b,b+.12)});
  s+=panel(96,300,T(`${D2(rr)}-${rr}\\left(${dth}\\right)^2`,PC,160,34)
   +fade(seg(p,.1,.22),T(`={\\color{${CR}}4}-{\\color{${C.a}}3\\times2^2}`,PC,250,36))
   +fade(seg(p,.25,.38),T(`=4-12=-8\\ \\mathrm{m/s^2}`,PC,335,36)),1,C.a);
  s+=fade(seg(p,b+.05,b+.15),label('太陽の 向きに 8 m/s²',PC,445,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=goalTag(G2)+ANS2(seg(p,b+.3,b+.4));
  return s;
 },
 // 13. 誤答 A → B → D
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),s0=W[0][1],wins=[[0,s0*.5],[s0*.5,s0],[W[1]?W[1][0]:s0,1]];
  let s=polar(TH0,{rlab:0,acc:1});
  s+=panel(96,130,T(`4-3\\times2^2=-8`,PC,165,36),1);
  s+=wrongSeq(p,ctx,[['A','＋4','−r(dθ/dt)² を落とした'],['B','−12','d²r/dt² を落とした'],['D','＋16','4＋12（引かずに足した）']],{win:wins,opts:{...WOPT,y:250}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 14. 出題中の小問3の図（楕円・近い点 1.0・遠い点 4.0）。記号と式の札は外す
 [K+'goal3']:(p)=>ell({})+panel(130,160,label('小問3',PC,180,{size:26,color:C.dim,anchor:'middle'})+label('軌道の e と p の 組 は？',PC,235,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi)+goalTag(G3,{g:seg(p,.03,.15)}),
 // 15. 式はまだ出さない。r（太陽からの距離）と θ（最も近い向きから）を図に置き、印を楕円に沿って動かす
 [K+'sym']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3,mk=(120+50*Math.sin(Math.max(0,cueT(ctx)-3.5)*.8))*Math.PI/180;
  let s=ell({rArrow:seg(p,b,b+.1),thArc:seg(p,b+.3,b+.4),mark:mk});
  s+=panel(110,120,label('式を 出す 前に、',PC,160,{size:26,color:C.ink,anchor:'middle'})+label('記号を 図で 確かめる',PC,205,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.03,.12),C.hi);
  s+=goalTag(G3);
  return s;
 },
 // 16a. e：楕円の形（形の違う3つ）、p：大きさを決める長さ（大きさの違う2つ）。値は出さない
 [K+'ep']:(p)=>{
  let s=ell({rArrow:1,thArc:1,thLab:0});
  s+=card(640,90,540,200,miniEll(720,190,60,.15,{g:seg(p,.05,.15)})+miniEll(880,190,60,.55,{g:seg(p,.1,.2)})+miniEll(1040,190,60,.85,{g:seg(p,.15,.25)})
   +fade(seg(p,.2,.3),label('e：楕円の形',910,270,{size:26,color:CE,anchor:'middle',weight:700})),seg(p,.03,.1));
  s+=card(640,305,540,200,miniEll(780,400,45,.6,{g:seg(p,.45,.55)})+miniEll(990,400,80,.6,{g:seg(p,.5,.6)})
   +fade(seg(p,.55,.65),label('p：大きさを決める長さ',910,488,{size:26,color:CP,anchor:'middle',weight:700})),seg(p,.4,.47));
  s+=goalTag(G3);
  return s;
 },
 // 16b. r・θ・e・p の札を図に残したまま、右の枠に r＝p/(1＋e cosθ)。記号が出るたびに図の札を光らせる
 [K+'orbit']:(p)=>{
  const hR=seg(p,.25,.32)*(1-seg(p,.4,.45)),hP=seg(p,.4,.47)*(1-seg(p,.55,.6)),hE=seg(p,.55,.62)*(1-seg(p,.7,.75)),hT=seg(p,.7,.77)*(1-seg(p,.85,.9));
  let s=ell({rArrow:1,thArc:1,hiR:hR,hiTh:hT});
  s+=label('e：楕円の形（離心率）',640,130,{size:26,color:CE,weight:700})+label('p：軌道の大きさを決める長さ',640,180,{size:26,color:CP,weight:700});
  s+=highlight(632,104,300,38,hE,CE)+highlight(632,154,380,38,hP,CP);
  s+=card(640,300,540,140,T(ORBIT,910,370,48),seg(p,.1,.25),C.hi);
  s+=goalTag(G3);
  return s;
 },
 // 17. 単元動画で導いた結果。u–θ のグラフに cos の波（桃）。波の上の点と軌道の上の点を同じ色で（θ を進めると一緒に動く）
 [K+'wave']:(p,ctx)=>{
  const t=2*Math.PI*seg(p,.15,.9);
  let s=ell({cx:200,cy:300,U:56,near:0,far:0,comet:0,axis:1});
  const G=ellGeo({cx:200,cy:300,U:56}),[px,py]=G.P(t);
  s+=line(G.sx,G.sy,px,py,{color:CR,w:3})+dot(px,py,10,C.hi);
  const A=axes({x:470,y:470,w:640,h:250,xmin:0,xmax:2*Math.PI,ymin:0,ymax:1.1,xlabel:'θ',ylabel:'u ＝ 1/r',xcolor:CTH,ycolor:CR});
  s+=A.svg+A.plot(u=>(1+EE*Math.cos(u))/PP,{color:CE,w:4});
  s+=label('0',A.X(0),490,{size:22,color:C.dim,anchor:'middle'})+label('π',A.X(Math.PI),490,{size:22,color:C.dim,anchor:'middle'})+label('2π',A.X(2*Math.PI),490,{size:22,color:C.dim,anchor:'middle'});
  s+=line(A.X(t),A.Y(0),A.X(t),A.Y((1+EE*Math.cos(t))/PP),{color:C.hi,w:1.5,dash:'4 5'})+dot(A.X(t),A.Y((1+EE*Math.cos(t))/PP),10,C.hi);
  s+=kindTag('結果',260,110,{text:'単元動画で導いた結果'});
  s+=card(640,90,540,110,T(ORBIT,910,145,40),1,C.hi);
  s+=goalTag(G3);
  return s;
 },
 // 18. θ＝0 で最も近く r＝p/(1＋e)、θ＝π で最も遠く r＝p/(1−e)
 [K+'ends']:(p,ctx)=>{
  const W=sentWin(ctx);
  let s=ell({});
  const G=ellGeo({});
  s+=fade(seg(p,.05,.15),dot(330+225,300,10,C.hi)+label('θ ＝ 0',330+225+14,270,{size:24,color:CTH,weight:700}));
  s+=fade(seg(p,.5,.6),dot(330-225,300,10,C.hi)+label('θ ＝ π',330-225-14,270,{size:24,color:CTH,anchor:'end',weight:700}));
  s+=panel(96,400,label('最も 近い 点（cos0 ＝ 1）',PC,140,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.25),T(`${rr}=\\dfrac{${pp}}{1+${ee}}=1.0`,PC,215,38))
   +fade(seg(p,.5,.55),line(PX+40,275,PX+PW-40,275,{color:C.faint,w:2})+label('最も 遠い 点（cosπ ＝ −1）',PC,315,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.55,.7),T(`${rr}=\\dfrac{${pp}}{1-${ee}}=4.0`,PC,390,38)),1);
  s+=goalTag(G3);
  return s;
 },
 // 19a. 近い点の式 ÷ 遠い点の式：p が消え、(1−e)/(1＋e)＝1.0÷4.0＝1/4
 [K+'ratio']:(p)=>{
  const pC=`{\\color{${C.a}}\\cancel{\\color{${CP}}p}}`,cn=seg(p,.3,.4)>.5;
  let s=label('近い点 ÷ 遠い点',600,108,{size:26,color:C.dim,anchor:'middle'});
  s+=T(`\\dfrac{\\;\\dfrac{${cn?pC:pp}}{1+${ee}}\\;}{\\;\\dfrac{${cn?pC:pp}}{1-${ee}}\\;}=\\dfrac{1.0}{4.0}`,600,270,40);
  s+=fade(seg(p,.45,.6),T(`\\dfrac{1-${ee}}{1+${ee}}=\\dfrac{1}{4}`,600,440,44));
  s+=goalTag(G3);
  return s;
 },
 // 19b. 4(1−e)＝1＋e → 4−4e＝1＋e → 5e＝3 → e＝0.6
 [K+'solve']:(p)=>{
  let s=T(`\\dfrac{1-${ee}}{1+${ee}}=\\dfrac{1}{4}`,600,130,38);
  s+=fade(seg(p,.03,.12),label('両辺に 4(1＋e) を 掛ける',980,215,{size:24,color:C.dim,anchor:'middle'})+T(`4(1-${ee})=1+${ee}`,600,215,38));
  s+=fade(seg(p,.15,.27),T(`4-4${ee}=1+${ee}`,600,290,38));
  s+=fade(seg(p,.3,.42),T(`5${ee}=3`,600,365,38));
  s+=fade(seg(p,.45,.57),T(`{\\color{${CE}}e=0.6}`,600,445,46));
  s+=goalTag(G3);
  return s;
 },
 // 20. p＝1.0×(1＋0.6)＝1.6。確かめ 1.6÷(1−0.6)＝4.0。小問3 の答え B
 [K+'p']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,ve=W[1]?W[1][1]:1;
  let s=ell({});
  s+=fade(seg(p,b+.05,b+.15),highlight(250,264,70,46,1,C.hi)+label('1.6÷0.4 ＝ 4.0 ✓',250,350,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(96,330,label('近い 点の 式から',PC,140,{size:24,color:C.dim,anchor:'middle'})
   +T(`${pp}=1.0\\times(1+0.6)=1.6`,PC,205,36)
   +fade(seg(p,b,b+.1),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+label('確かめ：遠い 点',PC,290,{size:24,color:C.dim,anchor:'middle'})+T(`\\dfrac{1.6}{1-0.6}=4.0`,PC,365,36)),1,C.hi);
  s+=goalTag(G3)+ANS3(seg(p,ve*.88,ve*.96));
  return s;
 },
 // 21. θ＝90° の点に太陽からの距離 p＝1.6。長軸の半分に長半径 2.5。誤答 A
 [K+'wrongA']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=ell({near:0,far:0});
  const G=ellGeo({}),[qx,qy]=G.P(Math.PI/2);
  s+=fade(seg(p,b,b+.1),arrow(G.sx,G.sy,qx,qy,{color:CP,w:5,head:14})+dot(qx,qy,8,C.hi)+label('p ＝ 1.6',qx+14,(G.sy+qy)/2,{size:26,color:CP,weight:700})+label('θ ＝ 90°',qx+14,qy-8,{size:22,color:CTH,weight:700}));
  s+=fade(seg(p,.05,.15),line(330,300,555,300,{color:C.hi,w:5})+label('長半径 2.5',400,288,{size:24,color:C.hi,anchor:'middle',weight:700})+dot(330,300,5,C.hi));
  s+=wrongSeq(p,ctx,[['A','e＝0.6、p＝2.5','p を 長半径に した']],{win:[[0,1]],opts:{...WOPT,y:200}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 22. 誤答 C → D
 [K+'wrongCD']:(p,ctx)=>{
  const W=sentWin(ctx),ve=W[0][1],wins=[[0,ve*.5],[ve*.5,1]];
  let s=ell({});
  s+=panel(96,110,T(`${ee}=0.6,\\ ${pp}=1.6`,PC,155,36),1);
  s+=wrongSeq(p,ctx,[['C','e＝0.75、p＝1.75','(4−1)÷4 を e にした'],['D','e＝0.25、p＝1.25','比 1/4 を e にした']],{win:wins,opts:{...WOPT,y:230}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 23. T²∝r³（0.630 倍）、帳簿の 𝐞r の列（−8）、r＝p/(1＋e cosθ)（e＝0.6、p＝1.6）を並べ、ma＝F と GMm/r² からつなぐ
 [K+'sum']:(p)=>{
  let s='';
  s+=card(330,90,540,90,T(`m${col(C.a,'a')}=${col(C.F,'F')},\\quad F=\\dfrac{GMm}{${rr}^2}`,600,138,34),seg(p,.02,.12),C.F);
  const cw=360,gap=30,x0=30,xs=[0,1,2].map(i=>x0+i*(cw+gap)),y0=250,ch=220;
  const gs=[seg(p,.15,.28),seg(p,.3,.43),seg(p,.45,.58)];
  const items=[
   [T(`${TT}^2\\propto${rr}^3`,0,0,34),'0.630 倍','2.66×10⁷ m'],
   [T(`${D2(rr)}-${rr}\\left(${dth}\\right)^2`,0,0,26),'4 − 12','−8 m/s²'],
   [T(ORBIT,0,0,34),'e ＝ 0.6','p ＝ 1.6'],
  ];
  items.forEach(([f,a,b],i)=>{const x=xs[i];
   s+=fade(gs[i],arrow(600,184,x+cw/2,y0-6,{color:C.dim,w:3,head:12}));
   s+=card(x,y0,cw,ch,`<g transform="translate(${x+cw/2} ${y0+70})">${f}</g>`+label(a,x+cw/2,y0+150,{size:26,color:C.ink,anchor:'middle',weight:700})+label(b,x+cw/2,y0+195,{size:28,color:C.hi,anchor:'middle',weight:700}),gs[i],C.hi);});
  s+=answerRow([[1,'D',''],[2,'C',''],[3,'B','']],{g:seg(p,.85,.95)});
  return s;
 },
};
