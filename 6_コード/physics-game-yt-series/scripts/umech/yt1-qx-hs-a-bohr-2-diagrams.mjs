// 問題編 解説「n＝2 の軌道に乗る電子の波」(ys-qx-hs-a-bohr-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/502_物質波とボーア模型.md の q-hs-a-bohr-2（解説 20 行）。
// 色（正本の 502 冒頭）：波長 λ 水色、速さ v 紫、n 黄、半径 r 白、原子核 赤、強調 黄、誤り 赤。2周目の波は桃の点線（単元動画 2/3 と同じ）。
// 図：左に原子（中心 (330,300)、半径 160 px。大きさは模式）。円周に沿う波（半径方向の変位、振幅 18 px）。右に式・札・誤答カード。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-a-bohr-1/2）の部品（原子核・電子・波・色・TeX の記号・「弦を輪にする」画面）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,poly,clamp,mix} from './anim.mjs';
import {electron,LC,VC,PC,NC,RC,POS,BAD,OK,cs,lam,pt,vt,rt,nt,U,TX,nucleus,cross,okMark} from './yt1-hs-a-bohr-1-diagrams.mjs';
import {hsABohr2Diagrams} from './yt1-hs-a-bohr-2-diagrams.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-a-bohr-2:';
const PI=Math.PI;
const F=(s,x,y,size=40,o={})=>TX(s,x,y,{size,...o});
const G1='λ',G2='v',G3='許されない 理由';
const A1=g=>answerTag(1,'B','約 6.6×10⁻¹⁰ m',{g}),A2=g=>answerTag(2,'D','約 1.1×10⁶ m/s',{g}),A3=g=>answerTag(3,'B','',{g});
const W2=(ctx,d=.45)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};
const W2P='#ff9ad5';
const WR={x:640,w:540};   // 誤答カードの置き場所（右）

// ---- 原子と円周の波 ----------------------------------------------------------------------------------
const CX=330,CY=300,R=160,A=26;
const P=(a,r=R)=>[CX+r*Math.cos(a),CY-r*Math.sin(a)];
function orbit({g=1,color=C.ink,w=2.5,dash='',cx=CX,cy=CY,r=R}={}){return fade(g,ring(cx,cy,r,{color,w,dash}));}
// 円周の波：k＝1周あたりの波の個数。a0 から turns 周ぶん（半径方向の変位）
// band＝円と波のあいだを薄く塗る（山と谷が見えるように）
function rw(k,{turns=1,from=0,g=1,color=LC,w=4,dash='',amp=A,cx=CX,cy=CY,r=R,band=0}={}){
 if(turns<=.002)return '';
 const pts=[],base=[],N=Math.ceil(260*turns);
 for(let i=0;i<=N;i++){const a=from+2*PI*turns*i/N,rr=r+amp*Math.sin(k*a);pts.push([cx+rr*Math.cos(a),cy-rr*Math.sin(a)]);base.push([cx+r*Math.cos(a),cy-r*Math.sin(a)]);}
 let s=band?poly([...pts,...base.reverse()],{fill:color,fo:.16*band}):'';
 return fade(g,s+draw(pts,1,{color,w,dash}));
}
// 円弧（強調・なぞり）
function arcPath(a0,a1,{r=R,color=C.hi,w=7,g=1,cx=CX,cy=CY}={}){
 const pts=[];const N=Math.max(2,Math.ceil(120*Math.abs(a1-a0)/PI));
 for(let i=0;i<=N;i++){const a=a0+(a1-a0)*i/N;pts.push([cx+r*Math.cos(a),cy-r*Math.sin(a)]);}
 return fade(g,draw(pts,1,{color,w}));
}
const tick=(a,{g=1,color=C.hi}={})=>{const [x0,y0]=P(a,R-34),[x1,y1]=P(a,R+34);return fade(g,line(x0,y0,x1,y1,{color,w:4}));};
// 出題中の札
const rLab=(g=1)=>fade(g,line(CX,CY,CX+R,CY,{color:RC,w:2.5,dash:'7 6'})+label('r＝2.1×10⁻¹⁰ m',CX+R+30,CY+9,{size:26,color:RC,weight:700}));
const nLab=(g=1)=>fade(g,label('n＝2',CX-R*.72-30,CY-R*.72-26,{size:30,color:NC,anchor:'end',weight:700}));
function base({g=1,lab=1,wave=1,nuc=1}={}){
 return orbit({g})+(nuc?nucleus(CX,CY,{r:16,g}):'')+rw(2,{turns:wave,g,band:1})+(lab?rLab(g*lab)+nLab(g*lab):'');
}
const step=(t,x,y,g)=>fade(g,arrow(x,y,x,y+40,{color:C.hi,w:4,head:14})+label(t,x+24,y+30,{size:26,color:C.hi,weight:700}));
const yBox=(x,y,w,h,g)=>fade(g,rect(x,y,w,h,{fill:C.hi,fo:.08,stroke:C.hi,sw:3,rx:10}));
// 2.5 個の円（小問3。別の円なので半径を少し変える）
const R3=175;
const rw3=(o={})=>rw(2.5,{r:R3,band:1,...o});
const orbit3=(g=1)=>orbit({g,r:R3})+nucleus(CX,CY,{r:16,g});

// 小問3：同じ場所で、1周目と2周目の値が反対（2026-10-16、PQ-046）
const AM=PI/5;   // 2.5×AM＝π/2：1周目は山、2周目（＋5π）は谷
function mismatch(p,{g1=1,g2=1}={}){
 let s=orbit3()+rw3({})+rw3({from:2*PI,turns:1,color:W2P,w:3.5,dash:'9 7'});
 s+=label('1周目',720,150,{size:28,color:LC,weight:700})+label('2周目',720,195,{size:28,color:W2P,weight:700});
 const [x1,y1]=P(AM,R3+A),[x2,y2]=P(AM,R3-A),[xc,yc]=P(AM,R3);
 s+=fade(g1,ring(xc,yc,46,{color:C.hi,w:3})+dot(x1,y1,8,LC)+dot(x2,y2,8,W2P)
  +line(xc+46,yc-6,640,262,{color:C.hi,w:2,opacity:.7})
  +label('同じ 場所で',660,262,{size:28,color:C.hi,weight:700})
  +label('1周目：山（＋）',660,304,{size:28,color:LC,weight:700})+label('2周目：谷（−）',660,346,{size:28,color:W2P,weight:700})
  +label('→ 値が 反対',660,388,{size:28,color:C.hi,weight:700}));
 s+=card(600,412,580,64,label('この 模型：一周で ぴったり つながる 波だけ',890,454,{size:26,color:C.ink,anchor:'middle',weight:700}),g2,C.hi);
 return s;
}

export const qxHsABohr2Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1・2 共通）：0〜2 秒 原子核と円軌道（札 r・n）、2〜5 秒 円周に沿って水色の波が描かれ、2個ぶんで1周がつながる。
 [K+'q0']:(p,ctx)=>{const t=ctx?.t??p*5;return base({g:seg(t,0,1),lab:seg(t,.6,1.6),wave:lin(t,2,4.8)});},
 // 小問3：n＝2 の円・波・札を消してから、別の円に波が 2.5 個乗る場合を1周目だけ描く（2周目は描かない）
 [K+'q3']:(p,ctx)=>{
  const t=ctx?.t??p*3.5,o=1-seg(t,.1,.7);
  let s=fade(o,base({}));
  s+=orbit3(seg(t,.8,1.2))+rw3({turns:lin(t,1.2,3.3)});
  s+=fade(seg(t,3.2,3.5),label('波 2.5 個',CX+R3*.72+34,CY-R3*.72-26,{size:30,color:LC,weight:700}));
  return s;
 },
 // ================= S1 小問1 n＝2 の波長 =================
 [K+'goal1']:(p)=>base({})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 山を1個ずつ数える「1、2」。前提タグ「模型の仮定」
 [K+'count']:(p)=>{
  let s=base({});
  [PI/4,5*PI/4].forEach((a,i)=>{const [x,y]=P(a,R+A),[lx,ly]=P(a,R+58);
   s+=fade(seg(p,.15+i*.15,.22+i*.15),dot(x,y,9,C.hi)+label(String(i+1),lx,ly+12,{size:36,color:C.hi,anchor:'middle',weight:700}));});
  s+=kindTag('前提',900,200,{text:'模型の 仮定',g:seg(p,.55,.65)});
  s+=fade(seg(p,.6,.7),label('円周に 波長が 整数個',900,280,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 3. 先に記号（r・λ・n）を図に置いてから、式 2πr＝nλ。仮定の札
 [K+'sym']:(p,ctx)=>{
  let s=orbit({})+nucleus(CX,CY,{r:16})+rw(2,{band:1});
  s+=fade(seg(p,.03,.1),line(CX,CY,CX+R,CY,{color:RC,w:3})+label('r：半径',CX+R/2,CY+36,{size:26,color:RC,anchor:'middle',weight:700}));
  s+=rw(2,{from:0,turns:.5,color:C.hi,w:7,g:seg(p,.1,.18)})+tick(0,{g:seg(p,.1,.18)})+tick(PI,{g:seg(p,.1,.18)});
  s+=fade(seg(p,.1,.18),label('λ：波長（波1個）',CX,CY-R-44,{size:26,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.18,.26),label('n：円周に 乗る 波の 個数',900,140,{size:28,color:NC,anchor:'middle',weight:700}));
  const b=W2(ctx);
  s+=card(680,190,440,130,F(`2\\pi ${rt}=${nt}${lam}`,900,268,56),seg(p,.3,.38),LC);
  s+=kindTag('仮定',900,380,{g:seg(p,b,b+.08)});
  return s+goalTag(G1);
 },
 // 4. 円周を黄で強調しながら一周なぞる。値 1.32×10⁻⁹ m
 [K+'circ']:(p)=>{
  const u=lin(p,.05,.6);
  let s=orbit({})+nucleus(CX,CY,{r:16})+rw(2,{g:.5})+arcPath(0,2*PI*u,{});
  s+=card(640,140,540,120,F(`2\\times3.14\\times2.1\\times10^{-10}`,910,210,34),seg(p,.05,.12),C.hi);
  s+=card(700,300,420,110,F(`\\approx1.32\\times10^{-9}${U('m')}`,910,365,40),seg(p,.6,.68),C.hi);
  s+=fade(seg(p,.6,.68),label('円周',CX,CY+R+50,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 5. 円周を2つに区切り、片方に水色の λ＝6.6×10⁻¹⁰ m
 [K+'half']:(p,ctx)=>{
  const b=W2(ctx);
  let s=orbit({})+nucleus(CX,CY,{r:16})+rw(2,{band:1});
  s+=tick(0,{g:seg(p,.05,.12)})+tick(PI,{g:seg(p,.05,.12)});
  s+=fade(seg(p,.1,.2),label('1',CX,CY-R+64,{size:32,color:C.hi,anchor:'middle',weight:700})+label('2',CX,CY+R-44,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=rw(2,{from:0,turns:.5,color:LC,w:8,g:seg(p,b,b+.08)});
  s+=card(660,150,500,120,F(`${lam}=\\dfrac{2\\pi ${rt}}{2}`,910,222,44),seg(p,b,b+.08),LC);
  s+=card(660,300,500,110,F(`${lam}\\approx6.6\\times10^{-10}${U('m')}`,910,365,40),seg(p,b+.2,b+.28),LC);
  return s+goalTag(G1);
 },
 // 6. 答えの札。2文目で誤答 A（2 で割り忘れ）
 [K+'ans1']:(p,ctx)=>{
  const b=W2(ctx,.3);
  let s=orbit({})+nucleus(CX,CY,{r:16})+rw(2,{band:1})+rw(2,{from:0,turns:.5,color:LC,w:8});
  s+=fade(1-seg(p,b-.02,b+.03),card(660,300,500,110,F(`${lam}\\approx6.6\\times10^{-10}${U('m')}`,910,365,40),1,LC));
  s+=wrongCard('A','1.3×10⁻⁹ m','n で 割り忘れた（波2個ぶん）',{...WR,y:200,g:seg(p,b+.01,b+.06)});
  return s+goalTag(G1)+A1(seg(p,.03,.1));
 },
 // 7. 誤答 C（n² で割った）→ 誤答 D（半径を波長とした）。1枚ずつ
 [K+'wCD']:(p,ctx)=>{
  let s=orbit({})+nucleus(CX,CY,{r:16})+rw(2,{band:1})+rw(2,{from:0,turns:.5,color:LC,w:8});
  s+=wrongSeq(p,ctx,[['C','3.3×10⁻¹⁰ m','n² で 割った',{mid:`1.32\\times10^{-9}\\div4\\approx3.3\\times10^{-10}`}],['D','2.1×10⁻¹⁰ m','半径を 波長と した']],{opts:{...WR,y:200}});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2 電子の速さ =================
 [K+'goal2']:(p)=>orbit({})+nucleus(CX,CY,{r:16})+rw(2,{band:1})+fade(seg(p,.05,.15),label('λ≈6.6×10⁻¹⁰ m',900,250,{size:30,color:LC,anchor:'middle',weight:700}))+goalTag(G2,{g:seg(p,.03,.15)}),
 // 9. 式変形を一操作ずつ：λ＝h/(mv) → 両辺に v → λ で割る → v＝h/(mλ)
 [K+'solve']:(p)=>{
  let s=F(`${lam}=\\dfrac{h}{m${vt}}`,600,125,46);
  s+=step('両辺に v を 掛ける',560,172,seg(p,.2,.28))+fade(seg(p,.25,.35),F(`${lam}${vt}=\\dfrac{h}{m}`,600,272,46));
  s+=step('λ で 割る',560,318,seg(p,.45,.52))+card(390,366,420,124,F(`${vt}=\\dfrac{h}{m${lam}}`,600,436,48),seg(p,.5,.6),VC);
  return s+goalTag(G2);
 },
 // 10. 分母を黄の枠で囲んで計算
 [K+'den']:(p)=>{
  let s=F(`${vt}=\\dfrac{6.6\\times10^{-34}}{9.1\\times10^{-31}\\times6.6\\times10^{-10}}`,600,170,44);
  s+=yBox(385,152,510,66,seg(p,.05,.15));
  s+=card(240,320,720,120,F(`9.1\\times10^{-31}\\times6.6\\times10^{-10}\\approx6.0\\times10^{-40}`,600,390,40),seg(p,.4,.5),C.hi);
  return s+goalTag(G2);
 },
 // 11. 6.6 に打ち消し線 → 1÷(9.1×10⁻⁷)≈1.1×10⁶ m/s。2文目で図に戻り、紫の速さの矢印と答えの札
 [K+'ans2']:(p,ctx)=>{
  const b=W2(ctx,.6),f=1-seg(p,b-.04,b+.02),g=seg(p,b-.02,b+.05),c=seg(p,.1,.2);
  let e=F(c>.5?`${vt}=\\dfrac{\\cancel{6.6}\\times10^{-34}}{9.1\\times10^{-31}\\times\\cancel{6.6}\\times10^{-10}}`:`${vt}=\\dfrac{6.6\\times10^{-34}}{9.1\\times10^{-31}\\times6.6\\times10^{-10}}`,600,170,44);
  e+=fade(seg(p,.25,.35),F(`=\\dfrac{1}{9.1\\times10^{-7}}`,600,300,44));
  e+=card(380,360,440,110,F(`${vt}\\approx1.1\\times10^{6}${U('m/s')}`,600,425,42),seg(p,.4,.5),VC);
  let s=fade(f,e);
  const [ex,ey]=P(PI/2);
  s+=fade(g,orbit({})+nucleus(CX,CY,{r:16})+rw(2,{band:1})+electron(ex,ey,{r:14})+arrow(ex,ey,ex-130,ey,{color:VC,w:5,head:16})
   +label('1.1×10⁶ m/s',ex-140,ey-20,{size:28,color:VC,anchor:'end',weight:700}));
  s+=fade(g,note('円軌道の 接線の 向き',900,300));
  return s+goalTag(G2)+A2(seg(p,b+.02,b+.08));
 },
 // 12. 誤答 A（λ＝3.3×10⁻¹⁰ m）。n＝1 の軌道の速さと並べる
 [K+'wA2']:(p)=>{
  let s=fade(seg(p,.25,.35),label('n＝1：約 2.2×10⁶ m/s',600,150,{size:32,color:C.ink,anchor:'middle',weight:700})
   +label('n＝2：約 1.1×10⁶ m/s（約 半分）',600,205,{size:32,color:VC,anchor:'middle',weight:700}));
  s+=wrongCard('A','2.2×10⁶ m/s','λ＝3.3×10⁻¹⁰ m を 使った（n＝1 の 値）',{y:260,g:seg(p,.03,.1),mid:`6.6\\times10^{-34}/(9.1\\times10^{-31}\\times3.3\\times10^{-10})\\approx2.2\\times10^{6}`,midSize:30});
  return s+goalTag(G2)+A2(1);
 },
 // 13. 誤答 B（円周全体）→ 誤答 C（逆に割った）。1枚ずつ
 [K+'wBC']:(p,ctx)=>{
  let s=fade(.75,F(`${vt}=\\dfrac{h}{m${lam}}\\approx1.1\\times10^{6}${U('m/s')}`,600,150,40));
  s+=wrongSeq(p,ctx,[
   ['B','5.5×10⁵ m/s','円周全体を 波長と した',{mid:`\\lambda=1.32\\times10^{-9}\\ \\to\\ 5.5\\times10^{5}`}],
   ['C','9.1×10⁻⁷ m/s','逆に 割った（単位 s/m）',{mid:`m\\lambda/h=9.1\\times10^{-7}`}],
  ],{opts:{y:240}});
  return s+goalTag(G2)+A2(1);
 },
 // 14. 量子条件 mvr＝nh/(2π)、n＝2 で h/π。両辺の値を並べて ≈
 [K+'qc']:(p,ctx)=>{
  const b=W2(ctx,.25);
  let s=card(330,100,540,110,F(`m${vt}${rt}=\\dfrac{${nt}h}{2\\pi}`,600,168,46),seg(p,.02,.1),C.hi);
  s+=fade(seg(p,.1,.2),label('n＝2',600,250,{size:30,color:NC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.12,.22),F(`\\dfrac{2h}{2\\pi}=\\dfrac{h}{\\pi}`,600,320,40));
  s+=fade(seg(p,b+.05,b+.15),label('左辺 mvr',300,390,{size:28,color:C.ink,anchor:'middle',weight:700})+F(`\\approx2.1\\times10^{-34}`,300,450,38));
  s+=fade(seg(p,b+.35,b+.45),label('右辺 h/π',900,390,{size:28,color:C.ink,anchor:'middle',weight:700})+F(`\\approx2.1\\times10^{-34}`,900,450,38));
  s+=fade(seg(p,b+.55,b+.65),F(`\\approx`,600,440,56,{color:C.hi}));
  return s+goalTag(G2);
 },
 // ================= S3 小問3 波が 2.5 個 =================
 // 15. n＝2 の円・波・式を消してから、出題中の 2.5 個の波（1周目）
 [K+'goal3']:(p)=>{
  let s=orbit3(seg(p,.05,.15))+rw3({turns:lin(p,.15,.8)});
  s+=fade(seg(p,.8,.9),label('波 2.5 個',CX+R3*.72+34,CY-R3*.72-26,{size:30,color:LC,weight:700}));
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 16. 1周目の終わりが始まりとつながらず、2周目（桃の点線）が山と谷のずれた位置で重なる
 [K+'turn2']:(p)=>{
  let s=orbit3()+rw3({})+label('1周目',720,150,{size:28,color:LC,weight:700});
  const [jx,jy]=P(0,R3);
  s+=fade(seg(p,.1,.2),ring(jx,jy,30,{color:C.hi,w:3})+label('つながらない',jx+40,jy-30,{size:26,color:C.hi,weight:700}));
  s+=rw3({from:2*PI,turns:lin(p,.3,.85),color:W2P,w:3.5,dash:'9 7'});
  s+=fade(seg(p,.3,.4),label('2周目',720,195,{size:28,color:W2P,weight:700}));
  s+=fade(seg(p,.85,.95),label('山と 谷が 逆',900,300,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 17. 2026-10-16（PQ-046）：「何周もして消える」動きはやめた。1周目（水色）と2周目（桃の点線）を並べたまま、
 //     同じ場所（角 36°：1周目は山、2周目は谷）を黄の輪で囲み、値が反対になることを示す。2文目で「一周でぴったりつながる波だけ」の札
 [K+'cancel']:(p,ctx)=>{
  const b=W2(ctx,.5);
  return mismatch(p,{g1:seg(p,.05,.15),g2:seg(p,b,b+.08)})+goalTag(G3);
 },
 // 17b. 答えの札（行17 の3文目）
 [K+'ans3']:(p)=>mismatch(1,{g1:1,g2:1})+goalTag(G3)+A3(seg(p,.03,.12)),
 // 18. 誤答 A（光の速さ）→ 誤答 C（原子核に落ちる）。1枚ずつ
 [K+'wAC3']:(p,ctx)=>{
  let s=fade(.5,orbit3()+rw3({}));
  s+=wrongSeq(p,ctx,[['A','光速を 超える','速さの 問題では ない'],['C','原子核に 落ちる','力の 話と 取り違えた']],{opts:{...WR,y:200}});
  return s+goalTag(G3)+A3(1);
 },
 // 19. 誤答 D（偶数だけ）。波が1個・3個乗る円を小さく並べる
 [K+'wD3']:(p)=>{
  let s=wrongCard('D','偶数だけ','n＝1、3 も 許される',{x:150,w:900,y:110,g:seg(p,.03,.1)});
  [[1,380],[3,820]].forEach(([k,x],i)=>{const g=seg(p,.3+i*.15,.4+i*.15);
   s+=orbit({cx:x,cy:340,r:95,g})+nucleus(x,340,{r:10,g})+rw(k,{cx:x,cy:340,r:95,amp:14,g,w:3.5});
   s+=fade(g,label(`n＝${k}`,x,480,{size:30,color:NC,anchor:'middle',weight:700})+okMark(x+120,250,1));});
  return s+goalTag(G3)+A3(1);
 },
 // ================= S4 まとめ =================
 // 20. 元の単元動画の「弦を輪にする」画面に戻る（単元動画 2/3 の部品をそのまま使う）
 [K+'sum']:(p,ctx)=>hsABohr2Diagrams['hs-a-bohr-2:s3'](p,ctx)+answerRow([[1,'B',''],[2,'D',''],[3,'B','']]),
};
