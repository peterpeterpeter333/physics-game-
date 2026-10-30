// 問題編 解説「n＝4 から n＝2 へ移るときの光」(ys-qx-hs-a-bohr-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/502_物質波とボーア模型.md の q-hs-a-bohr-3（解説 20 行）。
// 色（正本の 502 冒頭）：エネルギー 橙、半径 r 白、n 黄、電子 青、原子核 赤、光子 黄、強調 黄、誤り 赤。
// 図：左に原子（円軌道 n＝1〜4、半径 1：4：9：16、r₁＝12 px）。右（小問2・3 では左）にエネルギーの階段（0〜−14 eV を等間隔）。
//   n＝3（−1.51 eV）と n＝4（−0.85 eV）は近いので、段の札は左に少しずらして置く。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画（yt1-hs-a-bohr-1/3）の部品（原子核・電子・光子・波・色・TeX の記号・赤い光の画面）を読み込んで使う（そのファイルは編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,clamp,mix,scaleAt} from './anim.mjs';
import {electron,LC,EC,NC,RC,NEG,POS,BAD,OK,cs,lam,rt,nt,Et,U,TX,nucleus,photon,wave,cross,okMark} from './yt1-hs-a-bohr-1-diagrams.mjs';
import {hsABohr3Diagrams} from './yt1-hs-a-bohr-3-diagrams.mjs';
import {QC,card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-a-bohr-3:';
const PI=Math.PI;
const F=(s,x,y,size=40,o={})=>TX(s,x,y,{size,...o});
const G1='r（n＝3）',G2='λ',G3='離すのに 要る 最小の エネルギー';
const A1=g=>answerTag(1,'C','約 4.8×10⁻¹⁰ m',{g}),A2=g=>answerTag(2,'C','約 486 nm',{g}),A3=g=>answerTag(3,'D','3.40 eV',{g});
const W2=(ctx,d=.45)=>{const W=sentWin(ctx);return W[1]?W[1][0]:d;};
const WR={x:640,w:540};
const BLUEGREEN='#3cd8e8',RED='#ff5a5a';

// ---- 原子（円軌道 n＝1〜4）----------------------------------------------------------------------------
const AX=230,AY=300,R1=12;
const rn=n=>R1*n*n;
const RCOL=[C.ink,C.ink,C.ink,C.ink];
function atom({g=1,show=[1,1,1,1],lab=1,r1lab=1,dash='',hi=-1,cx=AX,cy=AY,nmax=4}={}){
 let s='';
 for(let n=1;n<=nmax;n++){const o=g*(show[n-1]??1);if(o<=.001)continue;
  s+=fade(o,ring(cx,cy,rn(n),{color:n===hi?C.hi:C.ink,w:n===hi?4:2.5,dash}));
  if(lab){const x=cx+rn(n)+4,y=n%2?cy+30:cy-12;s+=fade(o*lab,rect(x-2,y-20,64,26,{fill:C.bg,fo:.85,stroke:'none',rx:4})+label(`n＝${n}`,x,y,{size:22,color:NC,weight:700}));}}
 s+=nucleus(cx,cy,{r:7,g});
 if(r1lab)s+=fade(g*r1lab,line(cx-8,cy-8,cx-70,cy-150,{color:RC,w:2})+label('r₁＝5.3×10⁻¹¹ m',cx-70,cy-162,{size:24,color:RC,anchor:'middle',weight:700}));
 return s;
}
// ---- エネルギーの階段 --------------------------------------------------------------------------------
const EN=n=>-13.6/(n*n);
const LT=104,LB=484,EMIN=-14;
const LY=E=>LT+(0-E)/(0-EMIN)*(LB-LT);
function ladder({x0=700,w=300,g=1,show=[1,1,1,1,1],lab=1,vals={},hl=-1,valG=1}={}){
 let s='';
 // 0 eV の線
 s+=fade(g*show[0],line(x0,LT,x0+w,LT,{color:C.dim,w:3,dash:'10 7'})+label('0 eV',x0-10,LT-6,{size:22,color:C.dim,anchor:'end',weight:700}));
 for(let n=1;n<=4;n++){const o=g*(show[n]??1);if(o<=.001)continue;const y=LY(EN(n)),c=n===hl?C.hi:EC;
  s+=fade(o,line(x0,y,x0+w,y,{color:c,w:n===hl?6:4}));
  if(lab)s+=fade(o*lab,label(`n＝${n}`,x0-10,y+(n===4?2:n===3?17:8),{size:22,color:NC,anchor:'end',weight:700}));
  if(vals[n])s+=fade(o*valG,label(vals[n],x0+w+14,y+(n===3?15:n===4?2:8),{size:24,color:c,weight:700}));}
 return s;
}
const LXL=150,LWL=260;            // 小問2・3 の階段（左）
const ex=(x0,w)=>x0+w*.35;         // 電子の x
const DX=LXL+LWL+150;              // 段差の両矢印の x（値の札の右）
// 光子（黄）と光の波：(x,y) から右へ u（0〜1）だけ進む
function emit(x,y,u,{g=1,len=380}={}){
 if(u<=.001)return '';
 const xe=x+40+len*u;
 return fade(g,wave(x+40,xe,y,46,12,{color:C.hi,w:3})+photon(xe,y));
}
// 電子が n＝4 から n＝2 へ落ちる（u）と光子（v）
function drop(x0,w,u,v,{g=1}={}){
 const x=ex(x0,w),y=mix(LY(EN(4)),LY(EN(2)),u);
 let s=electron(x,y,{r:12,op:g});
 if(u>0&&u<1)s+=fade(g,arrow(x+26,LY(EN(4))+4,x+26,LY(EN(2))-6,{color:C.hi,w:3,head:12}));
 s+=emit(x+10,LY(EN(2))-30,v,{g});
 return s;
}
// ？の矢印（n＝2 の電子から 0 eV の線へ）
function qArrow(x0,w,{g=1,done=0}={}){
 const x=ex(x0,w)+60,y0=LY(EN(2))-6,y1=LT+6;
 let s=fade(g*(1-done),arrow(x,y0,x,y1,{color:C.dim,w:4,head:14})+label('？',x+16,(y0+y1)/2+10,{size:32,color:C.hi,weight:700}));
 s+=fade(g*done,arrow(x,y0,x,y1,{color:EC,w:6,head:16})+rect(x+10,(y0+y1)/2-18,112,34,{fill:C.bg,fo:.92,stroke:'none',rx:6})+label('3.40 eV',x+16,(y0+y1)/2+9,{size:28,color:EC,weight:700}));
 return s;
}
// 両矢印（段差）
function dArrow(x,yA,yB,{g=1,color=EC,text='',tx=14}={}){
 return fade(g,arrow(x,(yA+yB)/2,x,yA+4,{color,w:4,head:12})+arrow(x,(yA+yB)/2,x,yB-4,{color,w:4,head:12})+(text?label(text,x+tx,(yA+yB)/2+9,{size:26,color,weight:700}):''));
}
// 色帯（400〜700 nm）
function spectrum({g=1,x0=200,x1=1000,y=300,h=60,mark486=0,mark656=0,ticks=1,dim=.35}={}){
 const lo=400,hi=700,X=nm=>x0+(nm-lo)/(hi-lo)*(x1-x0);
 let s='<defs><linearGradient id="qxspc3" x1="0" x2="1"><stop offset="0" stop-color="#7a3cff"/><stop offset=".2" stop-color="#3c6cff"/><stop offset=".4" stop-color="#3cd0ff"/><stop offset=".55" stop-color="#4cff6a"/><stop offset=".7" stop-color="#ffee3c"/><stop offset=".83" stop-color="#ff8a3c"/><stop offset="1" stop-color="#ff3c3c"/></linearGradient></defs>';
 s+=`<rect x="${x0}" y="${y}" width="${x1-x0}" height="${h}" fill="url(#qxspc3)" opacity="${dim}"/>`;
 if(ticks)[400,500,600,700].forEach(nm=>s+=label(`${nm} nm`,X(nm),y+h+32,{size:22,color:C.dim,anchor:'middle'}));
 if(mark656)s+=fade(mark656,rect(X(656)-4,y-16,8,h+32,{fill:RED,fo:1,stroke:'none',rx:2})+label('656 nm',X(656),y-28,{size:26,color:RED,anchor:'middle',weight:700}));
 if(mark486)s+=fade(mark486,rect(X(486)-4,y-16,8,h+32,{fill:BLUEGREEN,fo:1,stroke:'none',rx:2})+label('486 nm',X(486),y-28,{size:26,color:BLUEGREEN,anchor:'middle',weight:700}));
 return fade(g,s);
}
const yBox=(x,y,w,h,g)=>fade(g,rect(x,y,w,h,{fill:C.hi,fo:.08,stroke:C.hi,sw:3,rx:10}));
const VALS2={4:'−0.85 eV',2:'−3.40 eV'};

export const qxHsABohr3Diagrams={
 // ================= 問題アニメ =================
 // 出題：0〜3 秒 円軌道（n＝1〜4）と階段が順に現れる。約 4 秒で静止。半径の値は n＝1 だけ、段の値は出さない。
 [K+'q0']:(p,ctx)=>{
  const t=ctx?.t??p*4;
  return atom({show:[1,2,3,4].map(n=>seg(t,.1+(n-1)*.35,.4+(n-1)*.35)),r1lab:seg(t,1.4,1.8)})
   +ladder({show:[seg(t,1.6,2),...[1,2,3,4].map(n=>seg(t,1.8+(n-1)*.3,2.1+(n-1)*.3))]});
 },
 // 小問2：電子（青）が n＝4 から n＝2 へ落ち、黄の光子が出る（約 3 秒で静止）。段差・波長の値は出さない。
 [K+'q2']:(p,ctx)=>{
  const t=ctx?.t??p*3;
  return atom({})+ladder({})+drop(700,300,seg(t,.6,1.5),lin(t,1.5,2.8),{g:seg(t,0,.4)});
 },
 // 小問3：小問2 の光子を消してから、n＝2 の電子から 0 eV の線へ「？」の矢印（約 2.5 秒で静止）
 [K+'q3']:(p,ctx)=>{
  const t=ctx?.t??p*2.5,o=1-seg(t,.05,.5);
  let s=atom({})+ladder({})+electron(ex(700,300),LY(EN(2)),{r:12});
  s+=fade(o,emit(ex(700,300)+10,LY(EN(2))-30,1));
  s+=qArrow(700,300,{g:seg(t,.8,1.5)});
  return s;
 },
 // ================= S1 小問1 n＝3 の半径 =================
 [K+'goal1']:(p)=>atom({})+ladder({})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. n＝1 の半径 r₁ と各円の n の札 → 式 r＝n²×5.3×10⁻¹¹ m（n² に黄の枠）。模型タグ
 [K+'rn']:(p)=>{
  let s=atom({r1lab:seg(p,.03,.12),lab:seg(p,.1,.2)})+fade(1-seg(p,.02,.12),ladder({}));
  s+=card(640,170,520,120,F(`${rt}=${nt}^2\\times5.3\\times10^{-11}${U('m')}`,900,240,40),seg(p,.35,.45),C.ink);
  s+=yBox(766,198,58,58,seg(p,.55,.62));
  s+=kindTag('前提',900,350,{text:'模型',g:seg(p,.6,.7)});
  return s+goalTag(G1);
 },
 // 3. 3²＝9。n＝3 の円が n＝1 の円の9倍の半径まで広がる。札 4.8×10⁻¹⁰ m
 [K+'r3']:(p,ctx)=>{
  const b=W2(ctx),u=seg(p,b,b+.35),rr=mix(rn(1),rn(3),u);
  let s=atom({show:[1,1,0,1],r1lab:1})+fade(seg(p,b,b+.05),ring(AX,AY,rr,{color:C.hi,w:4}))+fade(seg(p,b+.3,b+.4),label('9r₁',AX+rr*.7+8,AY-rr*.7-8,{size:26,color:C.hi,weight:700}));
  s+=card(640,110,520,100,F(`3^2=9`,900,172,44),seg(p,.05,.12),NC);
  s+=card(640,250,520,150,F(`5.3\\times10^{-11}\\times9`,900,305,36)+fade(seg(p,b+.3,b+.4),F(`\\approx4.8\\times10^{-10}${U('m')}`,900,365,38)),seg(p,b,b+.06),C.ink);
  return s+goalTag(G1);
 },
 // 4. 答えの札。2文目で誤答 A（3倍）
 [K+'ans1']:(p,ctx)=>{
  const b=W2(ctx,.3);
  let s=atom({hi:3})+fade(seg(p,.02,.1)*(1-seg(p,b-.02,b+.03)),card(640,250,520,100,F(`${rt}_3\\approx4.8\\times10^{-10}${U('m')}`,900,310,40),1,C.hi));
  s+=wrongCard('A','1.6×10⁻¹⁰ m','n に 比例と した（3倍）',{...WR,y:200,g:seg(p,b+.01,b+.06),mid:`3\\times5.3\\times10^{-11}\\approx1.6\\times10^{-10}`});
  return s+goalTag(G1)+A1(seg(p,.03,.1));
 },
 // 5. 誤答 B（n² で割った）→ 誤答 D（n³ で27倍）。1枚ずつ
 [K+'wBD']:(p,ctx)=>{
  let s=atom({hi:3});
  s+=wrongSeq(p,ctx,[
   ['B','5.9×10⁻¹² m','n² で 割った',{mid:`5.3\\times10^{-11}\\div9\\approx5.9\\times10^{-12}`}],
   ['D','1.4×10⁻⁹ m','n³ で 27倍に した',{mid:`27\\times5.3\\times10^{-11}\\approx1.4\\times10^{-9}`}],
  ],{opts:{...WR,y:200}});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2 4→2 の波長 =================
 // 6. 階段の上で電子が n＝4 から n＝2 へ落ちて光子が出る
 [K+'goal2']:(p)=>ladder({x0:LXL,w:LWL})+drop(LXL,LWL,seg(p,.15,.45),lin(p,.45,.9))+goalTag(G2,{g:seg(p,.03,.15)}),
 // 7. −13.6÷16＝−0.85、−13.6÷4＝−3.40。段に値を付ける
 [K+'E42']:(p)=>{
  let s=ladder({x0:LXL,w:LWL,vals:VALS2,valG:seg(p,.55,.65)})+electron(ex(LXL,LWL),LY(EN(2)),{r:12});
  s+=card(700,110,480,90,F(`${Et}=-\\dfrac{13.6${U('eV')}}{${nt}^2}`,940,165,34),seg(p,.03,.1),EC);
  s+=fade(seg(p,.3,.4),F(`-13.6\\div16=-0.85`,940,270,36));
  s+=fade(seg(p,.55,.65),F(`-13.6\\div4=-3.40`,940,340,36));
  return s+goalTag(G2);
 },
 // 8. 2つの段の間に橙の両矢印 2.55 eV と「ΔE：準位の差」
 [K+'dE']:(p,ctx)=>{
  const b=W2(ctx,.35),y4=LY(EN(4)),y2=LY(EN(2));
  let s=ladder({x0:LXL,w:LWL,vals:VALS2})+electron(ex(LXL,LWL),y2,{r:12});
  s+=dArrow(DX,y4,y2,{g:seg(p,.05,.15)});
  s+=fade(seg(p,.1,.2),label('ΔE：準位の 差',DX,y2+50,{size:26,color:EC,anchor:'middle',weight:700}));
  s+=card(700,170,480,110,F(`-0.85-(-3.40)`,940,236,38),seg(p,b,b+.08),EC);
  s+=card(700,310,480,100,F(`=2.55${U('eV')}`,940,372,40),seg(p,b+.3,b+.38),EC);
  s+=fade(seg(p,b+.3,b+.38),label('2.55 eV',DX+14,(y4+y2)/2+9,{size:24,color:EC,weight:700}));
  return s+goalTag(G2);
 },
 // 9. λ＝hc/ΔE＝1240÷2.55≈486 nm。色帯の 486 nm に印。答えの札
 [K+'lam']:(p,ctx)=>{
  const b=W2(ctx,.65);
  let s=ladder({x0:LXL,w:LWL,vals:VALS2})+dArrow(DX,LY(EN(4)),LY(EN(2)),{})+label('2.55 eV',DX+14,(LY(EN(4))+LY(EN(2)))/2+9,{size:24,color:EC,weight:700});
  s+=card(700,110,480,120,F(`${lam}=\\dfrac{hc}{\\Delta E}=\\dfrac{1240}{2.55}`,940,178,38),seg(p,.03,.1),LC);
  s+=fade(seg(p,.3,.4),F(`\\approx486${U('nm')}`,940,280,42));
  s+=spectrum({x0:720,x1:1160,y:370,h:40,mark486:seg(p,.45,.55),g:seg(p,.4,.5)});
  return s+goalTag(G2)+A2(seg(p,b+.02,b+.08));
 },
 // 10. 水素の線スペクトル。暗い帯に 656 nm（赤）と 486 nm（青緑）。実験タグ
 [K+'spec']:(p,ctx)=>{
  const b=W2(ctx,.5);
  let s=fade(seg(p,.03,.12),label('水素の 線スペクトル',600,150,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=spectrum({y:260,h:70,dim:.12,mark486:seg(p,.1,.2),mark656:seg(p,b,b+.08)});
  s+=kindTag('実験',600,460,{g:seg(p,.15,.25)});
  return s+goalTag(G2)+A2(1);
 },
 // 11. 誤答 A（3.40 eV）→ 誤答 B（0.85 eV）。1枚ずつ
 [K+'wAB']:(p,ctx)=>{
  let s=ladder({x0:LXL,w:LWL,vals:VALS2});
  s+=wrongSeq(p,ctx,[
   ['A','365 nm','n＝2 の 値 3.40 eV を 使った',{mid:`1240\\div3.40\\approx365`}],
   ['B','1459 nm','n＝4 の 値 0.85 eV を 使った',{mid:`1240\\div0.85\\approx1459`}],
  ],{opts:{...WR,y:180}});
  return s+goalTag(G2)+A2(1);
 },
 // 12. 誤答 D（足した 4.25 eV）
 [K+'wD']:(p)=>{
  let s=ladder({x0:LXL,w:LWL,vals:VALS2})+dArrow(DX,LY(EN(4)),LY(EN(2)),{});
  s+=wrongCard('D','292 nm','0.85＋3.40 を 使った',{...WR,y:180,g:seg(p,.03,.1),mid:`1240\\div4.25\\approx292`});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3 n＝2 から離す =================
 // 13. 誤答カードとスペクトルを消す。n＝2 の電子から 0 eV の線へ「？」の矢印
 [K+'goal3']:(p)=>ladder({x0:LXL,w:LWL})+electron(ex(LXL,LWL),LY(EN(2)),{r:12})+qArrow(LXL,LWL,{g:seg(p,.1,.25)})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 14. 0 eV の線に「離れていける」。2文目で n＝2 の段の −3.40 eV を黄で光らせる
 [K+'free']:(p,ctx)=>{
  const b=W2(ctx);
  let s=ladder({x0:LXL,w:LWL,vals:{2:'−3.40 eV'},valG:seg(p,b,b+.06),hl:p>b?2:-1})+electron(ex(LXL,LWL),LY(EN(2)),{r:12})+qArrow(LXL,LWL,{});
  s+=fade(seg(p,.05,.15),rect(LXL+LWL+150,LT-24,210,40,{fill:C.dim,fo:.12,stroke:C.dim,sw:2,rx:16})+label('離れて いける',LXL+LWL+255,LT+4,{size:24,color:C.ink,anchor:'middle',weight:700}));
  return s+goalTag(G3);
 },
 // 15. 「？」の矢印が橙の上向きの矢印 3.40 eV に替わる。答えの札
 [K+'ans3']:(p,ctx)=>{
  const b=W2(ctx,.5);
  let s=ladder({x0:LXL,w:LWL,vals:{2:'−3.40 eV'},hl:2})+electron(ex(LXL,LWL),LY(EN(2)),{r:12})+qArrow(LXL,LWL,{done:seg(p,.1,.3)});
  s+=card(680,200,460,110,F(`0-(-3.40)=3.40${U('eV')}`,910,268,38),seg(p,.15,.25),EC);
  return s+goalTag(G3)+A3(seg(p,b+.02,b+.08));
 },
 // 16. n＝1 から 0 eV への長い矢印 13.6 と、n＝1 から n＝2 への矢印 10.2。誤答 A → 誤答 B（1枚ずつ）
 [K+'wAB3']:(p,ctx)=>{
  const y1=LY(EN(1)),y2=LY(EN(2));
  let s=ladder({x0:LXL,w:LWL,vals:{1:'−13.6 eV',2:'−3.40 eV'}});
  s+=fade(seg(p,.03,.1),arrow(LXL+60,y1-6,LXL+60,LT+6,{color:C.dim,w:4,head:14})+label('13.6',LXL+70,(y1+LT)/2+40,{size:26,color:C.ink,weight:700}));
  s+=fade(seg(p,.45,.52),arrow(LXL+170,y1-6,LXL+170,y2+6,{color:C.dim,w:4,head:14})+label('10.2',LXL+180,(y1+y2)/2+40,{size:26,color:C.ink,weight:700}));
  s+=wrongSeq(p,ctx,[['A','13.6 eV','n＝1 から 離す 場合'],['B','10.2 eV','1→2 の 段差']],{opts:{...WR,y:200}});
  return s+goalTag(G3)+A3(1);
 },
 // 17. 誤答 C（n で割った）
 [K+'wC3']:(p)=>{
  let s=ladder({x0:LXL,w:LWL,vals:{1:'−13.6 eV',2:'−3.40 eV'}});
  s+=wrongCard('C','6.8 eV','n² で なく n で 割った',{...WR,y:200,g:seg(p,.03,.1),mid:`13.6\\div2=6.8`});
  return s+goalTag(G3)+A3(1);
 },
 // ================= S4 まとめ =================
 // 18. 半径の比 1：4：9 と、エネルギーの大きさの比 1：1/4：1/9。外側の円ほど 0 eV の線に近い
 [K+'ratio']:(p,ctx)=>{
  let s=atom({nmax:3,show:[1,1,1],r1lab:0,cy:290})+fade(seg(p,.05,.15),label('半径 1：4：9',AX,470,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=ladder({x0:700,w:300,show:[1,1,1,1,0]})+fade(seg(p,.3,.4),label('エネルギーの 大きさ 1：1/4：1/9',850,330,{size:26,color:EC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.65),arrow(1030,LY(EN(3))-2,1030,LT+4,{color:C.hi,w:4,head:12})+label('外側の 円ほど 0 eV に 近い',850,270,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // 19. 「模型」「近似」の札。円軌道を点線にする
 [K+'model']:(p,ctx)=>{
  const b=W2(ctx);
  let s=atom({dash:seg(p,b,b+.1)>.5?'8 8':'',lab:0,r1lab:0});
  s+=kindTag('前提',840,180,{text:'模型',g:seg(p,.05,.15)})+kindTag('近似',840,250,{text:'電子 1個の 水素型 原子',g:seg(p,.1,.2)});
  s+=fade(seg(p,b+.05,b+.15),label('決まった 円を 回るのでは ない',840,350,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // 20. 元の単元動画の赤い光の画面に戻る（単元動画 3/3 の部品を縮めて使う。上の札の帯を避ける）
 [K+'sum']:(p,ctx)=>scaleAt(600,515,.8,hsABohr3Diagrams['hs-a-bohr-3:g3'](p,ctx))+answerRow([[1,'C',''],[2,'C',''],[3,'D','']]),
};
