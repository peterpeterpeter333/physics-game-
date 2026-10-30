// 問題編 解説「通り道の式と、いちばん遠くまで届く角度」(ys-qx-hs-m-projectile-3) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/105_放物運動.md の q-hs-m-projectile-3（解説 23 行）。
// vₓ＝10、vᵧ＝20 m/s、g＝10。x＝10t、y＝20t−5t² → y＝2x−x²/20（頂点 (20,20)、着地 x＝40）。v₀²＝500、L＝v₀²sin2θ/g。
// 色：位置 x・y 水色、速度 紫（横の成分 濃い紫、縦の成分 薄い紫）、時刻 t・T 金、θ 橙、強調 黄、誤りの打ち消し 赤。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。図は左（x＜680）、説明の枠は右（x 700〜1190）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex} from './anim.mjs';
import {ball} from './yt1-hs-m-freefall-1-diagrams.mjs';
import {VXC,VYC} from './yt1-hs-m-projectile-1-diagrams.mjs';
import {card,goalTag,answerTag,wrongSeq,sentWin,voiceEnd,kindTag} from './yt1-qx-common.mjs';

const K='qx-hs-m-projectile-3:';
const HC=C.hi, TH=C.E, RED='#ff6b6b';
const T1=(src,x,y,o={})=>tex(src,x,y,{size:44,...o});
const Tg=`{\\color{${C.t}}T}`, th='{\\color{'+TH+'}\\theta}', v0=`{\\color{${C.v}}v_0}`;
const G1='通り道の 式（x と y だけ）',G2='着地点までの 水平距離',G3='最も 遠くへ 届く 角度と 距離';
const A1=g=>answerTag(1,'A',{tex:'y=2x-x^2/20'},{g}),A2=g=>answerTag(2,'C','40 m',{g}),A3=g=>answerTag(3,'B','45°、50 m',{g});
const endIn=(p,ctx)=>{const W=sentWin(ctx),a=W[W.length-1];return seg(p,a[0]+(a[1]-a[0])*.55,a[0]+(a[1]-a[0])*.8);};
const firstIn=(p,ctx)=>{const w=sentWin(ctx)[0][1];return seg(p,w*.6,w*.8);};
const RX=700,RW=490,RC=RX+RW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(RX,y,RW,h,inner,g,stroke);
const cen=(y,h,inner,g=1,stroke=C.faint,{x=250,w=700}={})=>card(x,y,w,h,inner,g,stroke);

// ---- the x-y plane: origin (110,440), 1 m = 8 px, 0〜60 m × 0〜30 m (ticks 22 px) ----------------
const A={x:110,y:440,k:8};
const X=u=>A.x+A.k*u, Y=v=>A.y-A.k*v;
function plane(g=1){
 let s='';
 for(const v of [10,20,30])s+=line(A.x,Y(v),X(60),Y(v),{color:C.grid,w:1.5});
 for(const u of [10,20,30,40,50,60])s+=line(X(u),A.y,X(u),Y(30),{color:C.grid,w:1.5});
 s+=arrow(A.x-10,A.y,X(60)+30,A.y,{color:C.dim,w:2.5,head:14})+arrow(A.x,A.y+10,A.x,Y(30)-30,{color:C.dim,w:2.5,head:14});
 for(const u of [10,20,30,40,50,60])s+=line(X(u),A.y-6,X(u),A.y+6,{color:C.dim})+label(String(u),X(u),A.y+32,{size:22,color:C.x,anchor:'middle'});
 for(const v of [10,20,30])s+=line(A.x-6,Y(v),A.x+6,Y(v),{color:C.dim})+label(String(v),A.x-14,Y(v)+8,{size:22,color:C.x,anchor:'end'});
 s+=label('x [m]',X(60)+40,A.y+8,{size:24,color:C.x})+label('y [m]',A.x,Y(30)-44,{size:24,color:C.x,anchor:'middle'});
 return fade(g,s);
}
const traj=(vx,vy)=>u=>vy/vx*u-5*u*u/(vx*vx);
const range=(vx,vy)=>2*vx*vy/10;
const curve=(vx,vy,p=1,{color=HC,w=4,dash=''}={})=>draw(Array.from({length:121},(_,i)=>{const u=range(vx,vy)*i/120;return [X(u),Y(traj(vx,vy)(u))];}),p,{color,w,dash});
const SV=5;   // velocity arrows: 1 m/s = 5 px
function comps({g=1,vx=1,vy=1,lab=1,hx=0,hy=0}={}){
 let s='';
 if(hx)s+=fade(hx,line(A.x,A.y,A.x+SV*10,A.y,{color:HC,w:14,opacity:.35}));
 if(hy)s+=fade(hy,line(A.x,A.y,A.x,A.y-SV*20,{color:HC,w:14,opacity:.35}));
 s+=arrow(A.x,A.y,A.x+SV*10+4,A.y,{color:VXC,w:5,head:14,g:g*vx})+arrow(A.x,A.y,A.x,A.y-SV*20-4,{color:VYC,w:5,head:14,g:g*vy});
 if(lab)s+=fade(g*vx*lab,label('10 m/s',A.x+SV*10+14,A.y-12,{size:24,color:VXC,weight:700}))+fade(g*vy*lab,label('20 m/s',A.x+14,A.y-SV*20+4,{size:24,color:VYC,weight:700}));
 return s;
}
// 初速度の矢印（長さ √500 を保って角度 deg）
const V0L=Math.sqrt(500)*SV;
const v0Arrow=(deg,{g=1}={})=>{const a=deg*Math.PI/180;return arrow(A.x,A.y,A.x+V0L*Math.cos(a),A.y-V0L*Math.sin(a),{color:C.v,w:6,head:16,g});};
const ANG0=Math.atan2(20,10)*180/Math.PI;   // ≈63.4°

// ---- the triangle for v₀ (1 m/s = 9 px) ------------------------------------------------------------
const TR={ox:150,oy:430,sc:9};
function tri({g=1,lab=1,num=0,split=0,hypEq=0}={}){
 const x1=TR.ox+10*TR.sc,y1=TR.oy-20*TR.sc;
 let s=line(TR.ox-60,TR.oy,TR.ox+280,TR.oy,{color:C.dim,w:2});
 s+=arrow(TR.ox,TR.oy,x1,y1,{color:C.v,w:6,head:16,g});
 s+=arrow(TR.ox,TR.oy,x1,TR.oy,{color:VXC,w:4,head:12,g:g*.9})+arrow(x1,TR.oy,x1,y1,{color:VYC,w:4,head:12,g:g*.9});
 s+=rect(x1-16,TR.oy-16,16,16,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:0});
 const r=56,a1=Math.atan2(20,10);s+=draw(Array.from({length:21},(_,i)=>{const a=-a1*i/20;return [TR.ox+r*Math.cos(a),TR.oy+r*Math.sin(a)];}),1,{color:TH,w:3});
 s+=tex('\\theta',TR.ox+r+8,TR.oy-18,{size:32,color:TH,auto:false});
 if(lab){
  s+=fade(lab,tex(split?`${v0}\\cos${th}`:num?'10':'10',(TR.ox+x1)/2,TR.oy+42,{size:split?34:32,auto:false,color:VXC}));
  s+=fade(lab,tex(split?`${v0}\\sin${th}`:'20',x1+(split?90:30),(TR.oy+y1)/2+8,{size:split?34:32,auto:false,color:VYC}));
  s+=fade(lab*(1-hypEq),tex(num?'\\sqrt{500}':v0,(TR.ox+x1)/2-52,(TR.oy+y1)/2-6,{size:34,auto:false,color:C.v}));
  if(hypEq)s+=fade(lab*hypEq,tex(`${v0}=\\sqrt{500}`,(TR.ox+x1)/2-90,(TR.oy+y1)/2-6,{size:34,auto:false,color:C.v}));
 }
 return s;
}

export const qxHsMProjectile3Diagrams={
 // ================= 問題アニメ =================
 // 出題：x-y 平面と原点のボール。紫の横の成分「10 m/s」、縦の成分「20 m/s」が順に伸びる。通り道・着地点・頂点は描かない。
 [K+'q0']:(p)=>plane(seg(p,0,.2))+comps({vx:seg(p,.2,.45),vy:seg(p,.5,.75)})+ball(A.x,A.y,{r:12}),
 // 小問3：速さ（矢印の長さ）はそのまま、向きだけを上下に振る。通り道は描かない。最後は元の向きで止まる。
 [K+'q3']:(p)=>{
  const deg=ANG0+(-33*Math.sin(Math.PI*2*seg(p,.15,.85)))*(1-seg(p,.85,1)*0);
  let s=plane(1)+v0Arrow(p<.15?ANG0:deg)+ball(A.x,A.y,{r:12});
  s+=panel(130,150,label('速さは そのまま',RC,190,{size:28,color:C.v,anchor:'middle',weight:700})+label('角度 だけ 変える',RC,245,{size:30,color:HC,anchor:'middle',weight:700}),seg(p,.05,.15),HC);
  return s;
 },
 // ================= 小問1 =================
 // 1 出題中の図を再生して静止。紫の「10」「20」を順に光らせる
 [K+'setup']:(p,ctx)=>{
  const u=seg(p,0,.35);
  return plane(1)+comps({vx:seg(p,.05,.2),vy:seg(p,.2,.35),hx:seg(p,.4,.5)*(1-seg(p,.6,.66)),hy:seg(p,.66,.74)*(1-seg(p,.86,.92))})+ball(A.x,A.y,{r:12});
 },
 // 2 求めるもの
 [K+'goal1']:(p)=>plane(1)+comps({})+ball(A.x,A.y,{r:12})+goalTag(G1,{g:seg(p,.03,.15)}),
 // 3 式の画面：x＝10t と y＝20t−5t²、2つの t を金で
 [K+'eqs']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=cen(110,120,label('横（等速）',290,150,{size:24,color:C.dim})+T1('x=10t',600,190,{size:48}),seg(p,.03,.15),C.x);
  s+=cen(260,120,label('縦（投げ上げ）',290,300,{size:24,color:C.dim})+T1('y=20t-5t^2',600,340,{size:48}),seg(p,.25,.4),C.x);
  s+=fade(seg(p,b,b+.1),label('どちらも t の 式',600,445,{size:30,color:C.t,anchor:'middle',weight:700})+rect(250,100,700,300,{fill:C.t,fo:.05,stroke:C.t,sw:2,rx:16}));
  s+=goalTag(G1);
  return s;
 },
 // 4 「t を消す」。x＝10t の両辺を 10 で割って t＝x/10
 [K+'solve']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=card(450,96,300,56,label('t を 消す',600,134,{size:28,color:HC,anchor:'middle',weight:700}),seg(p,.05,.15),HC);
  s+=fade(.5,T1('y=20t-5t^2',870,250,{size:40}));
  s+=fade(seg(p,b,b+.08),T1('x=10t',330,230,{size:48}));
  s+=fade(seg(p,b+.12,b+.2),label('両辺を 10 で 割る',330,300,{size:26,color:HC,anchor:'middle'}));
  s+=card(190,330,280,120,T1('t=\\dfrac{x}{10}',330,395,{size:48}),seg(p,b+.25,b+.35),C.t);
  s+=goalTag(G1);
  return s;
 },
 // 5 縦の式の1つ目の t に x/10 を入れる → 20×x/10＝2x
 [K+'sub1']:(p)=>{
  let s=card(40,96,220,110,T1('t=\\dfrac{x}{10}',150,155,{size:40}),1,C.t);
  s+=fade(1-seg(p,.25,.32),T1(`y=20{\\color{${HC}}t}-5t^2`,700,170,{size:50}));
  s+=fade(seg(p,.3,.4),T1(`y=20\\times{\\color{${HC}}\\dfrac{x}{10}}-5t^2`,700,170,{size:50}));
  s+=fade(seg(p,.55,.65),T1('20\\times\\dfrac{x}{10}=2x',700,320,{size:50}));
  s+=fade(seg(p,.55,.65),rect(520,270,360,100,{fill:'none',fo:0,stroke:HC,sw:3,rx:12}));
  s+=goalTag(G1);
  return s;
 },
 // 6 2つ目の t² に (x/10)²＝x²/100。5×x²/100＝x²/20（5 と 100 の約分に打ち消し線）
 [K+'sub2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=card(40,96,220,110,T1('t=\\dfrac{x}{10}',150,155,{size:40}),1,C.t);
  s+=T1(`y=2x-5{\\color{${HC}}t^2}`,700,150,{size:46});
  s+=fade(seg(p,.08,.2),T1(`{\\color{${HC}}t^2}=\\left(\\dfrac{x}{10}\\right)^2=\\dfrac{x^2}{100}`,700,250,{size:44}));
  s+=fade(seg(p,b,b+.08)*(1-seg(p,b+.4,b+.46)),T1('5\\times\\dfrac{x^2}{100}=\\dfrac{5x^2}{100}',700,375,{size:44}));
  s+=fade(seg(p,b+.4,b+.46),T1(`\\dfrac{{\\color{${RED}}\\cancel{\\color{${C.ink}}5}}\\,x^2}{{\\color{${RED}}\\cancel{\\color{${C.ink}}100}}}=\\dfrac{x^2}{20}`,700,375,{size:44}));
  s+=fade(seg(p,b+.45,b+.55),label('5 と 100 を 5 で 割る（約分）',700,470,{size:24,color:HC,anchor:'middle'}));
  s+=goalTag(G1);
  return s;
 },
 // 7 y＝2x−x²/20 を黄の枠で。小問1 の答え A
 [K+'ans1']:(p,ctx)=>{
  let s=card(330,170,540,140,T1('y=2x-\\dfrac{x^2}{20}',600,248,{size:56}),seg(p,.03,.15),HC);
  s+=goalTag(G1)+A1(endIn(p,ctx));
  return s;
 },
 // 8 誤答 B・C・D を1枚ずつ
 [K+'wrong1']:(p,ctx)=>{
  let s=card(330,100,540,120,T1('y=2x-\\dfrac{x^2}{20}',600,168,{size:48}),.6,HC);
  s+=wrongSeq(p,ctx,[['B','y＝2x−x²/2','t² に x²/10 を 入れた'],['C','y＝1.5x','2乗を 落とした'],['D','y＝0.5x−x²/80','横と 縦の 成分を 入れ替えた']],{opts:{y:260}});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= 小問2 =================
 // 9 求めるもの（平面に戻る。放物線はまだ描かない）
 [K+'goal2']:(p)=>plane(1)+comps({lab:0,g:.5})+ball(A.x,A.y,{r:12})+panel(110,100,T1('y=2x-\\dfrac{x^2}{20}',RC,170,{size:40}),seg(p,.1,.2))+goalTag(G2,{g:seg(p,.03,.15)}),
 // 10 放物線をここで初めて描く。x 軸に戻る所を黄で光らせる
 [K+'curve']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=plane(1)+curve(10,20,seg(p,.05,.4));
  s+=panel(110,100,T1('y=2x-\\dfrac{x^2}{20}',RC,170,{size:40}),1);
  s+=fade(seg(p,.1,.25),label('x² の 係数が 負 → 上に 凸',RC,250,{size:26,color:HC,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.1)*(.6+.4*Math.sin(((ctx?.t)??0)*5)**2),ring(X(40),Y(0),18,{color:HC,w:4}));
  s+=fade(seg(p,b,b+.1),label('y が もう一度 0',X(40),Y(0)-30,{size:24,color:HC,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 11 0＝x(2−x/20)。二つの解に原点と (40, 0)
 [K+'factor']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=plane(1)+curve(10,20);
  s+=panel(110,100,T1('0=2x-\\dfrac{x^2}{20}',RC,170,{size:40}),1);
  s+=panel(225,100,T1('0=x\\left(2-\\dfrac{x}{20}\\right)',RC,285,{size:40}),seg(p,.25,.38),HC);
  s+=fade(seg(p,b,b+.1),label('x ＝ 0　か　x ＝ 40',RC,385,{size:32,color:C.x,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.05,b+.15),dot(X(0),Y(0),9,HC)+dot(X(40),Y(0),9,HC));
  s+=goalTag(G2);
  return s;
 },
 // 12 原点に「投げた点」、(40, 0) に「40 m」。小問2 の答え C
 [K+'ans2']:(p,ctx)=>{
  let s=plane(1)+curve(10,20)+dot(X(0),Y(0),9,HC)+dot(X(40),Y(0),10,HC);
  s+=fade(seg(p,.05,.15),label('投げた 点',X(0)+16,Y(0)-18,{size:24,color:C.dim,weight:700}));
  s+=fade(seg(p,.2,.3),label('40 m',X(40),Y(0)-26,{size:28,color:HC,anchor:'middle',weight:700}));
  s+=panel(110,100,T1('x=40\\ \\mathrm{m}',RC,170,{size:44}),seg(p,.2,.3),HC);
  s+=goalTag(G2)+A2(endIn(p,ctx));
  return s;
 },
 // 13 頂点 (20, 20) と対称の軸。誤答 A
 [K+'wrongA']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=plane(1)+curve(10,20)+dot(X(40),Y(0),10,HC)+label('40 m',X(40),Y(0)-26,{size:28,color:HC,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.18),line(X(20),Y(23),X(20),Y(0),{color:C.dim,w:2,dash:'6 6'})+dot(X(20),Y(20),9,C.x)+label('最高点（20, 20）',X(20),Y(20)-22,{size:24,color:C.x,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['A','20 m','最高点の x']],{win:[[b,1]],opts:{x:RX,y:140,w:RW}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 14 20t−5t²＝0 → t＝4（金）。誤答 B・D を1枚ずつ
 [K+'wrongBD']:(p,ctx)=>{
  const ve=voiceEnd(ctx),a=ve*.33,m=a+(ve-a)*.55;
  let s=plane(1)+curve(10,20)+dot(X(40),Y(0),10,HC)+label('40 m',X(40),Y(0)-26,{size:28,color:HC,anchor:'middle',weight:700});
  s+=panel(110,90,T1(`20t-5t^2=0\\ \\rightarrow\\ t=4\\ \\mathrm{s}`,RC,165,{size:36}),seg(p,.03,.12),C.t);
  s+=wrongSeq(p,ctx,[['B','80 m','4 s × 縦の 20'],['D','4 m','時刻 4 s を 距離と した']],{win:[[a,m],[m,1]],opts:{x:RX,y:225,w:RW}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= 小問3 =================
 // 15 放物線と着地点を消し、原点のボールと初速度の矢印だけ。長さを保って向きを上下に振る
 [K+'goal3']:(p,ctx)=>{
  const t=(ctx?.t)??0,deg=ANG0-33*Math.sin(t*1.3)*seg(p,.15,.25);
  let s=plane(1)+v0Arrow(deg)+ball(A.x,A.y,{r:12});
  s+=panel(130,150,label('速さは そのまま',RC,190,{size:28,color:C.v,anchor:'middle',weight:700})+label('角度 だけ 変える',RC,245,{size:30,color:HC,anchor:'middle',weight:700}),seg(p,.2,.3),HC);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 16 直角三角形（横 10、縦 20、斜辺 √500）。v₀ と θ を先に置いてから 100＋400＝500
 [K+'v0sq']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=tri({lab:1,hypEq:seg(p,.25,.35)});
  s+=panel(110,100,T1(`${v0}^2=10^2+20^2`,RC,170,{size:40,auto:false}),seg(p,.3,.4));
  s+=panel(225,100,T1('100+400=500',RC,285,{size:40}),seg(p,.45,.55),HC);
  s+=fade(seg(p,b,b+.1),label('角度を 変えても 500 の まま',RC,380,{size:28,color:HC,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 17a 【カット割り】① 図：v₀ を v₀cosθ と v₀sinθ に分ける
 [K+'stepT0']:(p)=>{
  let s=tri({lab:seg(p,.1,.3),split:1});
  s+=panel(110,110,label('飛距離の 式を 3手で',RC,178,{size:30,color:HC,anchor:'middle',weight:700}),seg(p,.05,.2),HC);
  s+=goalTag(G3);
  return s;
 },
 // 17b ② 式の画面：v₀sinθ·T−½gT²＝0 → T＝2v₀sinθ/g（T＝0 は投げた瞬間として薄く）
 [K+'stepT']:(p)=>{
  let s=label('① 縦：投げ上げ',150,130,{size:28,color:VYC,weight:700});
  s+=fade(seg(p,.1,.22),T1(`${v0}\\sin${th}\\,${Tg}-\\tfrac12 g${Tg}^2=0`,600,210,{size:44,auto:false}));
  s+=fade(seg(p,.35,.45)*(1-seg(p,.55,.65)*.6),label('（T ＝ 0 は 投げた 瞬間）',600,280,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(380,295,440,150,T1(`${Tg}=\\dfrac{2${v0}\\sin${th}}{g}`,600,378,{size:48,auto:false}),seg(p,.6,.72),C.t);
  s+=fade(seg(p,.8,.9),label('この例：2×20÷10 ＝ 4 s',1010,380,{size:24,color:C.dim,anchor:'middle'}));
  s+=goalTag(G3);
  return s;
 },
 // 18 L＝v₀cosθ×T → T を入れて L＝2v₀²sinθcosθ/g
 [K+'stepL']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=label('② 横：等速',150,130,{size:28,color:VXC,weight:700});
  s+=card(820,96,280,110,T1(`${Tg}=\\dfrac{2${v0}\\sin${th}}{g}`,960,152,{size:34,auto:false}),.8,C.t);
  const hiA=seg(p,.15,.22)*(1-seg(p,.3,.35)),hiB=seg(p,.32,.38)*(1-seg(p,b-.05,b));
  s+=fade(seg(p,.05,.15),T1(`L=${hiA>.5?`{\\color{${HC}}${v0}\\cos${th}}`:`${v0}\\cos${th}`}\\times ${hiB>.5?`{\\color{${HC}}T}`:Tg}`,500,250,{size:46,auto:false}));
  s+=card(250,300,600,155,T1(`L=\\dfrac{2${v0}^2\\sin${th}\\cos${th}}{g}`,550,385,{size:48,auto:false}),seg(p,b+.1,b+.25),HC);
  s+=goalTag(G3);
  return s;
 },
 // 19 2sinθcosθ＝sin2θ（2倍角の公式）→ L＝v₀²sin2θ/g。条件の札
 [K+'step2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=label('③ まとめる',150,130,{size:28,color:HC,weight:700});
  s+=card(250,150,700,90,T1(`2\\sin${th}\\cos${th}=\\sin2${th}`,600,200,{size:40,auto:false}),seg(p,.05,.15),C.faint);
  s+=fade(seg(p,.12,.22),label('（数学の 2倍角の 公式）',600,270,{size:24,color:C.dim,anchor:'middle'}));
  s+=card(330,290,540,150,T1(`L=\\dfrac{${v0}^2\\sin2${th}}{g}`,600,372,{size:52,auto:false}),seg(p,b,b+.12),HC);
  s+=kindTag('前提',600,482,{text:'空気抵抗 なし・同じ 高さに 着地',g:seg(p,b+.2,b+.3)});
  s+=goalTag(G3);
  return s;
 },
 // 20 三角形に戻る。sinθ＝20/√500、cosθ＝10/√500 → 2×200/500＝0.8 → L＝40
 [K+'check']:(p)=>{
  let s=tri({lab:1,num:1});
  s+=panel(100,90,T1(`\\sin${th}=\\dfrac{20}{\\sqrt{500}},\\ \\cos${th}=\\dfrac{10}{\\sqrt{500}}`,RC,152,{size:30,auto:false}),seg(p,.03,.15));
  s+=panel(205,90,T1(`\\sin2${th}=\\dfrac{2\\times 200}{500}=0.8`,RC,258,{size:34,auto:false}),seg(p,.2,.32));
  s+=panel(310,90,T1('L=500\\times 0.8\\div 10=40',RC,362,{size:34}),seg(p,.5,.62),HC);
  s+=fade(seg(p,.75,.85),label('小問2の 40 m と 一致',RC,450,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 // 21 sin のグラフで 90° の最大値 1。通り道はまだ描かず θ＝45° → L＝50 m を式で
 [K+'max']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  const gx=100,gy=420,gw=480,gh=230,GX=d=>gx+gw*d/180,GY=v=>gy-gh*v;
  let s=line(gx,gy,gx+gw+20,gy,{color:C.dim,w:2.5})+line(gx,gy+10,gx,gy-gh-30,{color:C.dim,w:2.5});
  for(const d of [0,45,90,135,180])s+=line(GX(d),gy-6,GX(d),gy+6,{color:C.dim})+label(`${d}°`,GX(d),gy+32,{size:22,color:C.dim,anchor:'middle'});
  s+=label('1',gx-12,GY(1)+8,{size:22,color:C.dim,anchor:'end'})+label('2θ',gx+gw+40,gy+8,{size:24,color:TH})+label('sin 2θ',gx,gy-gh-44,{size:24,color:C.ink,anchor:'middle'});
  s+=draw(Array.from({length:91},(_,i)=>{const d=2*i;return [GX(d),GY(Math.sin(d*Math.PI/180))];}),seg(p,.03,.25),{color:C.ink,w:4});
  s+=fade(seg(p,.25,.35),line(GX(90),gy,GX(90),GY(1),{color:HC,w:2,dash:'6 6'})+dot(GX(90),GY(1),9,HC)+label('最大 1（90°）',GX(90)+16,GY(1)-14,{size:24,color:HC,weight:700}));
  s+=panel(110,100,T1(`2${th}=90^\\circ,\\ ${th}=45^\\circ`,RC,170,{size:40,auto:false}),seg(p,.3,.42),TH);
  s+=panel(230,100,T1('L=500\\times 1\\div 10=50\\ \\mathrm{m}',RC,290,{size:34}),seg(p,b+.05,b+.18),HC);
  s+=goalTag(G3);
  return s;
 },
 // 22 小問3 の答え B。ここで初めて 3本の通り道（約63°・45°・約27°）。45° は黄で 50 m、63° と 27° は (40, 0)
 [K+'ans3']:(p,ctx)=>{
  const w=sentWin(ctx)[0][1],q=seg(p,w,w+.3),r=Math.sqrt(250);
  let s=plane(1);
  s+=curve(10,20,q,{color:'#a9b6f0',w:3,dash:'7 6'})+curve(20,10,q,{color:TH,w:3,dash:'7 6'})+curve(r,r,q,{color:HC,w:4});
  s+=fade(seg(p,w+.3,w+.4),label('約63°',X(20)-6,Y(20)-14,{size:24,color:'#a9b6f0',anchor:'middle',weight:700})+label('45°',X(25),Y(12.5)-14,{size:24,color:HC,anchor:'middle',weight:700})+label('約27°',X(20),Y(5)+30,{size:24,color:TH,anchor:'middle',weight:700}));
  s+=fade(seg(p,w+.35,w+.45),dot(X(40),Y(0),9,'#a9b6f0')+dot(X(50),Y(0),10,HC)+label('40 m',X(40),Y(0)-24,{size:24,color:'#a9b6f0',anchor:'middle',weight:700})+label('50 m',X(50)+8,Y(0)-24,{size:26,color:HC,weight:700}));
  s+=panel(130,110,label('63° と 27° → 40 m',RC,178,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,w+.4,w+.5));
  s+=panel(260,90,label('45° は その 真ん中',RC,317,{size:28,color:HC,anchor:'middle',weight:700}),seg(p,w+.55,w+.65),HC);
  s+=goalTag(G3)+A3(firstIn(p,ctx));
  return s;
 },
 // 23 誤答 A・C・D を1枚ずつ。最後に誤答カードを消し、放物線と L の式を条件の札とともに並べる
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),ve=voiceEnd(ctx),a=W[0][1],m=a+(ve-a)*.48,r=Math.sqrt(250),fin=seg(p,ve,ve+.06);
  let s=plane(1)+curve(10,20,1,{color:'#a9b6f0',w:3,dash:'7 6'})+curve(20,10,1,{color:TH,w:3,dash:'7 6'})+curve(r,r,1,{color:HC,w:4});
  s+=dot(X(50),Y(0),10,HC)+label('50 m',X(50)+8,Y(0)-24,{size:26,color:HC,weight:700});
  s+=wrongSeq(p,ctx,[['A','45°、100 m','45° では sinθcosθ ＝ 0.5'],['C','90°、50 m','最大は 2θ ＝ 90°（真上なら L ＝ 0）'],['D','約 63°、40 m','縦が 大きいほど 遠いと した']],{win:[[0,a],[a,m],[m,ve]],keepLast:false,opts:{x:RX,y:140,w:RW,whySize:22}});
  s+=card(RX,135,RW,150,T1(`L=\\dfrac{${v0}^2\\sin2${th}}{g}`,RC,215,{size:46,auto:false}),fin,HC);
  s+=kindTag('前提',RC,330,{text:'空気抵抗 なし・同じ 高さに 着地',size:22,g:fin});
  s+=goalTag(G3)+A3(1);
  return s;
 },
};
